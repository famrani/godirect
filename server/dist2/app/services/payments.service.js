import { randomUUID } from 'node:crypto';
import { cancellationLocked } from './cancellation.service.js';
import { ownerStripeTestMode, ownerStripeAccountId, assertOwnerTestAccount } from './owner-stripe-mode.js';
import { updateExisting } from './existing-transaction.js';
import { ensureReservationWorkflow, bookingPayments } from './reservation-compatibility.js';
import { findAsset } from './asset-paths.service.js';
import { z } from 'zod';
import { requireUser } from './stripe-auth.service.js';
const schema = z.object({ bookingId: z.string().regex(/^[a-zA-Z0-9_-]+$/), kind: z.enum(['booking_deposit', 'balance', 'security_deposit', 'security_payment']) });
export class PaymentsService {
    firebase;
    stripeSvc;
    config = async (_req, res) => {
        ownerStripeTestMode();
        const publishableKey = String(process.env.STRIPE_PUBLISHABLE_KEY || '').trim();
        if (!publishableKey)
            return res.status(503).json({ error: 'stripe_publishable_key_not_configured' });
        return res.json({ publishableKey, mode: publishableKey.startsWith('pk_live_') ? 'live' : 'test', directCharges: true, goDirectCommissionPercent: 0 });
    };
    constructor(firebase, stripeSvc) {
        this.firebase = firebase;
        this.stripeSvc = stripeSvc;
    }
    checkout = async (req, res) => {
        const uid = await requireUser(req, this.firebase);
        const p = schema.parse(req.body);
        let bookingPath = `bookings/${p.bookingId}`;
        let b = (await this.firebase.db.ref(`bookings/${p.bookingId}`).once('value')).val();
        if (!b) {
            for (const type of ['boat', 'car', 'parking', 'property', 'pool']) {
                const index = (await this.firebase.db.ref(`bookingsByCustomer/${uid}/${type}/${p.bookingId}`).once('value')).val();
                if (typeof index === 'string' && /^bookings\/(boat|car|parking|property|pool)\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(index)) {
                    b = (await this.firebase.db.ref(index).once('value')).val();
                    if (b) {
                        bookingPath = index;
                        break;
                    }
                }
            }
        }
        if (!b)
            return res.status(404).json({ error: 'booking_not_found' });
        if (![b.customerId, b.userId, b.customerUid].includes(uid))
            return res.status(403).json({ error: 'booking_access_denied' });
        b = await ensureReservationWorkflow(this.firebase, bookingPath);
        if (!b)
            return res.status(404).json({ error: 'booking_not_found' });
        if (cancellationLocked(b))
            return res.status(409).json({ error: 'cancellation_in_progress' });
        if (b.financialReviewRequired)
            return res.status(409).json({ error: 'legacy_payment_review_required' });
        if ((['cancelled', 'rejected'].includes(b.status) || (b.status === 'completed' && p.kind !== 'balance')))
            return res.status(409).json({ error: 'booking_closed' });
        const stripeMode = String(process.env.STRIPE_SECRET_KEY || '').startsWith('sk_test_') ? 'test' : 'live';
        if (b.stripeMode && b.stripeMode !== stripeMode)
            return res.status(409).json({ error: 'booking_stripe_mode_mismatch' });
        const proof = p.kind === 'booking_deposit' ? 'depositPaid' : p.kind === 'balance' ? 'balancePaid' : 'warrantyProvided';
        if (b.workflow?.[proof])
            return res.status(409).json({ error: 'already_completed' });
        const asset = await findAsset(this.firebase, b.assetId, b.assetType);
        if (!asset || !asset.ownerId)
            return res.status(409).json({ error: 'asset_owner_missing' });
        // Resolve payment destination from the current asset, never from a client amount or stale booking owner.
        const canonicalOwnerId = String(asset.ownerId);
        if (canonicalOwnerId !== String(b.ownerId))
            return res.status(409).json({ error: 'booking_owner_changed_review_required' });
        const owner = (await this.firebase.db.ref(`owners/${canonicalOwnerId}`).once('value')).val();
        if (!owner || owner.uid !== canonicalOwnerId)
            return res.status(409).json({ error: 'owner_profile_invalid' });
        const accountId = ownerStripeAccountId(owner);
        if (!accountId)
            return res.status(409).json({ error: ownerStripeTestMode() ? 'owner_stripe_test_not_connected' : 'owner_stripe_not_connected' });
        if (b.stripeConnectedAccountId && b.stripeConnectedAccountId !== accountId)
            return res.status(409).json({ error: 'booking_stripe_account_mismatch' });
        const account = await this.stripeSvc.stripe.accounts.retrieve(accountId);
        if (ownerStripeTestMode())
            assertOwnerTestAccount(account, canonicalOwnerId);
        if (account.deleted || !account.charges_enabled)
            return res.status(409).json({ error: ownerStripeTestMode() ? 'stripe_test_account_not_ready' : 'owner_stripe_charges_not_enabled' });
        const amount = p.kind === 'booking_deposit' ? b.bookingDeposit : p.kind === 'balance' ? b.balanceAmount : b.securityDeposit;
        if (!Number.isFinite(Number(amount)) || Number(amount) <= 0)
            return res.status(400).json({ error: 'invalid_amount' });
        const existing = await bookingPayments(this.firebase, String(b.id));
        if (existing.some(r => r.status !== 'canceled' && r.stripeConnectedAccountId && r.stripeConnectedAccountId !== accountId))
            return res.status(409).json({ error: 'booking_stripe_account_mismatch' });
        const idempotencyScope = ownerStripeTestMode() ? `${accountId}:${b.id}` : String(b.id);
        let attempt = 0;
        for (const r of existing) {
            if (r?.kind === p.kind && r?.status === 'succeeded')
                return res.status(409).json({ error: 'already_completed' });
            if (r?.kind === p.kind && r?.status === 'canceled')
                attempt++;
        }
        const operation = randomUUID();
        const locked = await updateExisting(this.firebase.db.ref(bookingPath), (current) => {
            if (cancellationLocked(current))
                return;
            if (!current || (current.stripeMode && current.stripeMode !== stripeMode) || (current.stripeConnectedAccountId && current.stripeConnectedAccountId !== accountId) || ![current.customerId, current.userId, current.customerUid].includes(uid) || (['cancelled', 'rejected'].includes(current.status) || (current.status === 'completed' && p.kind !== 'balance')) || current.workflow?.[proof])
                return;
            if (['bookingDeposit', 'balanceAmount', 'securityDeposit', 'currency', 'startAt', 'endAt', 'ownerId'].some(k => current[k] !== b[k]))
                return;
            return { ...current, checkoutOperations: { ...(current.checkoutOperations || {}), [operation]: true }, stripeMode, stripeConnectedAccountId: accountId, paymentCheckoutStartedAt: current.paymentCheckoutStartedAt || new Date().toISOString() };
        });
        if (locked.missing)
            return res.status(404).json({ error: 'booking_not_found' });
        if (!locked.committed)
            return res.status(409).json({ error: 'booking_changed_reload_required' });
        const metadata = { bookingId: String(b.id), bookingPath, kind: p.kind, assetId: String(b.assetId), ownerId: canonicalOwnerId, platform: 'godirect' };
        const warranty = p.kind === 'security_deposit';
        // A warranty registers a card for future off-session charges; it does not charge the security amount.
        const customer = warranty ? await this.stripeSvc.stripe.customers.create({ email: b.customerEmail, metadata: { bookingId: String(b.id) } }, { stripeAccount: accountId, idempotencyKey: `gd25:${idempotencyScope}:customer` }) : null;
        const pi = warranty
            ? await this.stripeSvc.stripe.setupIntents.create({ customer: customer.id, usage: 'off_session', payment_method_types: ['card'], metadata }, { stripeAccount: accountId, idempotencyKey: `gd25:${idempotencyScope}:warranty:${attempt}` })
            : await this.stripeSvc.stripe.paymentIntents.create({ amount: Math.round(Number(amount) * 100), currency: String(b.currency || 'eur').toLowerCase(), automatic_payment_methods: { enabled: true }, metadata }, { stripeAccount: accountId, idempotencyKey: `gd25:${idempotencyScope}:${p.kind}:${Math.round(Number(amount) * 100)}:${attempt}` });
        const paymentId = pi.id;
        const payment = { id: paymentId, stripeMode, bookingId: b.id, bookingPath, ownerId: canonicalOwnerId, assetId: b.assetId, kind: p.kind, amount: Number(amount), currency: String(b.currency || 'eur').toLowerCase(), stripePaymentIntentId: pi.id, stripeConnectedAccountId: accountId, goDirectCommissionAmount: 0, goDirectCommissionPercent: 0, status: pi.status, createdAt: new Date().toISOString() };
        // Deterministic records make repeated checkout requests idempotent.
        await this.firebase.db.ref(`payments/${paymentId}`).transaction((old) => old || payment, undefined, false);
        await this.firebase.db.ref(`paymentsByBooking/${b.id}/${paymentId}`).set(true);
        await updateExisting(this.firebase.db.ref(bookingPath), (current) => { const operations = { ...(current.checkoutOperations || {}) }; delete operations[operation]; return { ...current, checkoutOperations: operations }; });
        return res.json({ clientSecret: pi.client_secret, connectedAccountId: accountId, paymentId, mode: warranty ? 'setup' : 'payment', stripeMode });
    };
}

//# sourceMappingURL=payments.service.js.map
