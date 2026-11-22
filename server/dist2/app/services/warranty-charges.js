import { createHash } from 'node:crypto';
import { z } from 'zod';
import { assetPath } from './asset-paths.service.js';
import { ownerStripeAccountId, ownerStripeTestMode, assertOwnerTestAccount } from './owner-stripe-mode.js';
import { cancellationLocked } from './cancellation.service.js';
const fail = (message, status = 409) => Object.assign(new Error(message), { status });
const objectId = (v) => typeof v === 'string' ? v : String(v?.id || '');
export const WARRANTY_TERMS_VERSION = 'gd-warranty-v1';
export const WARRANTY_TERMS = 'J’autorise le propriétaire à débiter la carte enregistrée pour des dommages ou frais justifiés liés à cette réservation, dans la limite cumulée du montant de caution indiqué. Le motif et le montant de chaque débit seront visibles dans ma réservation. L’enregistrement de carte ne débite ni ne bloque les fonds.';
export function warrantyMinor(value) { const n = Number(value); return Number.isFinite(n) && n >= 0 && Number.isSafeInteger(Math.round(n * 100)) ? Math.round(n * 100) : -1; }
export function warrantySummary(b, payments = []) {
    const entries = Object.entries(b.warrantyCharges || {}), ids = new Set(entries.map(([, v]) => v.intentId).filter(Boolean));
    const spent = entries.filter(([, v]) => v.status === 'succeeded').reduce((n, [, v]) => n + Number(v.amountMinor || 0), 0);
    const reserved = entries.filter(([, v]) => !['succeeded', 'canceled'].includes(v.status)).reduce((n, [, v]) => n + Number(v.amountMinor || 0), 0);
    const legacyRecords = payments.filter(p => p.bookingId === b.id && p.kind === 'security_payment' && !ids.has(p.stripePaymentIntentId || p.id) && p.status !== 'canceled');
    const legacy = legacyRecords.filter(p => p.status === 'succeeded').reduce((n, p) => n + Math.max(0, warrantyMinor(p.amount)), 0);
    const legacyReserved = legacyRecords.filter(p => p.status !== 'succeeded').reduce((n, p) => n + Math.max(0, warrantyMinor(p.amount)), 0);
    const reviewRequired = entries.some(([, v]) => !Number.isSafeInteger(v.amountMinor) || v.amountMinor <= 0 || !['creating', 'unknown', 'succeeded', 'canceled', 'processing', 'requires_action', 'requires_confirmation', 'requires_payment_method', 'requires_capture'].includes(v.status)) || legacyRecords.some(p => warrantyMinor(p.amount) < 0 || String(p.currency).toLowerCase() !== String(b.currency).toLowerCase());
    const limit = Math.max(0, warrantyMinor(b.securityDeposit)), proof = b.workflow?.warrantyProvidedProof;
    const card = !!(b.workflow?.warrantyProvided && proof?.kind === 'security_deposit' && String(proof.intentId || '').startsWith('seti_') && proof.paymentMethodId && proof.customerId);
    const consent = !!(b.warrantyConsent?.version === WARRANTY_TERMS_VERSION && b.warrantyConsent.acceptedBy === b.customerId && b.warrantyConsent.intentId === proof?.intentId && b.warrantyConsent.limitMinor === limit && b.warrantyConsent.currency === String(b.currency).toLowerCase());
    return { reviewRequired, limitMinor: limit, chargedMinor: spent + legacy, reservedMinor: reserved + legacyReserved, remainingMinor: reviewRequired ? 0 : Math.max(0, limit - spent - legacy - reserved - legacyReserved), hasCard: card, consent, charges: entries.map(([id, v]) => ({ id, amountMinor: v.amountMinor, reason: v.reason, status: v.status, intentId: v.intentId || null, createdAt: v.createdAt, updatedAt: v.updatedAt || v.createdAt })), canCharge: !reviewRequired && String(b.currency).toLowerCase() === 'eur' && card && consent && limit > spent + legacy + reserved + legacyReserved && !b.financialReviewRequired && !['cancelled', 'rejected'].includes(b.status) && !cancellationLocked(b) };
}
export function publicWarrantyBooking(b) { return { ...b, ...(b.warrantyCharges ? { warrantyCharges: Object.fromEntries(warrantySummary(b).charges.map(c => [c.id, c])) } : {}) }; }
export class WarrantyChargeService {
    store;
    stripe;
    constructor(store, stripe) {
        this.store = store;
        this.stripe = stripe;
    }
    async uid(req) { const token = /^Bearer\s+(.+)$/i.exec(String(req.headers.authorization || ''))?.[1]; if (!token)
        throw fail('authentication_required', 401); try {
        return (await this.store.auth.verifyIdToken(token)).uid;
    }
    catch {
        throw fail('authentication_required', 401);
    } }
    path(req) { const t = String(req.params.type), id = String(req.params.id), bookingId = String(req.params.bookingId); assetPath(t, id); if (!/^[a-zA-Z0-9_-]+$/.test(bookingId))
        throw fail('invalid_booking_scope', 400); return { t, id, bookingId, path: `bookings/${t}/${id}/${bookingId}` }; }
    async scope(req, owner) { const uid = await this.uid(req), scope = this.path(req), b = (await this.store.db.ref(scope.path).once('value')).val(); const a = (await this.store.db.ref(assetPath(scope.t, scope.id)).once('value')).val(); if (!b || b.assetType !== scope.t || b.assetId !== scope.id || b.id !== scope.bookingId || !a || a.ownerId !== b.ownerId || (owner ? b.ownerId : b.customerId) !== uid)
        throw fail('booking_not_found', 404); return { ...scope, b, uid }; }
    consent = async (req, res) => {
        const s = await this.scope(req, false);
        const p = z.object({ accepted: z.literal(true), version: z.literal(WARRANTY_TERMS_VERSION), limitMinor: z.number().int().positive(), currency: z.string().regex(/^[a-z]{3}$/), intentId: z.string().regex(/^seti_[a-zA-Z0-9]+$/) }).parse(req.body);
        const payment = (await this.store.db.ref(`payments/${p.intentId}`).once('value')).val();
        if (!payment || payment.kind !== 'security_deposit' || payment.bookingPath !== s.path || payment.bookingId !== s.b.id || payment.ownerId !== s.b.ownerId)
            throw fail('warranty_setup_required');
        const now = new Date().toISOString();
        const result = await this.store.db.ref(s.path).transaction((b) => { if (b === null)
            return null; if (b.customerId !== s.uid || b.ownerId !== s.b.ownerId || b.stripeConnectedAccountId !== payment.stripeConnectedAccountId || p.limitMinor !== warrantyMinor(b.securityDeposit) || p.currency !== String(b.currency).toLowerCase() || ['cancelled', 'rejected'].includes(b.status) || cancellationLocked(b) || warrantyMinor(b.securityDeposit) <= 0)
            return; return { ...b, warrantyConsent: { version: WARRANTY_TERMS_VERSION, terms: WARRANTY_TERMS, acceptedBy: s.uid, acceptedAt: now, intentId: p.intentId, limitMinor: warrantyMinor(b.securityDeposit), currency: String(b.currency).toLowerCase() } }; }, undefined, false);
        if (!result.committed || !result.snapshot.val()?.warrantyConsent)
            throw fail('booking_changed_reload_required');
        return res.json({ accepted: true });
    };
    async reserve(s, p) {
        const mode = String(process.env.STRIPE_SECRET_KEY || '').startsWith('sk_test_') ? 'test' : 'live';
        let error = 'warranty_limit_exceeded';
        const result = await this.store.db.ref().transaction((root) => {
            if (root === null)
                return null;
            const b = root.bookings?.[s.t]?.[s.id]?.[s.bookingId], asset = root.assets?.[s.t]?.[s.id];
            if (!b || b.ownerId !== s.uid || asset?.ownerId !== s.uid) {
                error = 'owner_required';
                return;
            }
            const existing = b.warrantyCharges?.[p.requestId];
            if (existing) {
                if (existing.amountMinor !== p.amountMinor || existing.reason !== p.reason) {
                    error = 'warranty_request_changed';
                    return;
                }
                return root;
            }
            if (['cancelled', 'rejected'].includes(b.status) || cancellationLocked(b) || b.financialReviewRequired) {
                error = 'booking_closed';
                return;
            }
            const accountId = ownerStripeAccountId(root.owners?.[s.uid]);
            const proof = b.workflow?.warrantyProvidedProof;
            if (!accountId || accountId !== b.stripeConnectedAccountId || accountId !== proof?.accountId || b.stripeMode !== mode) {
                error = 'booking_stripe_account_mismatch';
                return;
            }
            const summary = warrantySummary(b, Object.values(root.payments || {}));
            if (summary.reviewRequired) {
                error = 'warranty_manual_review_required';
                return;
            }
            if (String(b.currency).toLowerCase() !== 'eur') {
                error = 'unsupported_currency';
                return;
            }
            if (!summary.hasCard) {
                error = 'warranty_setup_required';
                return;
            }
            if (!summary.consent) {
                error = 'warranty_consent_required';
                return;
            }
            if (p.amountMinor > summary.remainingMinor)
                return;
            const op = { id: p.requestId, amountMinor: p.amountMinor, reason: p.reason, status: 'creating', createdAt: new Date().toISOString(), createdBy: s.uid, accountId, mode, ownerId: s.uid, customerUid: b.customerId, customerId: proof.customerId, paymentMethodId: proof.paymentMethodId, setupIntentId: proof.intentId, currency: String(b.currency).toLowerCase(), bookingPath: s.path, bookingId: b.id, assetId: s.id, assetType: s.t, email: String(b.customerEmail || '') };
            b.warrantyCharges ??= {};
            b.warrantyCharges[p.requestId] = op;
            b.checkoutOperations ??= {};
            b.checkoutOperations['warranty_' + p.requestId] = true;
            return root;
        }, undefined, false);
        if (!result.committed)
            throw fail(error, error === 'owner_required' ? 403 : 409);
        const op = result.snapshot.val()?.bookings?.[s.t]?.[s.id]?.[s.bookingId]?.warrantyCharges?.[p.requestId];
        if (!op)
            throw fail('booking_changed_reload_required');
        return op;
    }
    async applyIntent(pi, accountId, eventId) {
        const path = String(pi.metadata?.bookingPath || ''), requestId = String(pi.metadata?.warrantyChargeId || '');
        if (!/^bookings\/(boat|car|property|parking|pool)\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(path) || !z.string().uuid().safeParse(requestId).success)
            throw fail('invalid_booking_scope');
        const parts = path.split('/');
        const result = await this.store.db.ref().transaction((root) => {
            if (root === null)
                return null;
            const b = root.bookings?.[parts[1]]?.[parts[2]]?.[parts[3]], op = b?.warrantyCharges?.[requestId];
            if (!op)
                return;
            if (op.accountId !== accountId || op.mode !== (pi.livemode ? 'live' : 'test') || pi.metadata?.platform !== 'godirect' || pi.metadata?.kind !== 'security_payment' || pi.metadata?.bookingId !== op.bookingId || pi.metadata?.ownerId !== op.ownerId || pi.metadata?.assetId !== op.assetId || pi.amount !== op.amountMinor || pi.currency !== op.currency || objectId(pi.customer) !== op.customerId || (objectId(pi.payment_method) && objectId(pi.payment_method) !== op.paymentMethodId) || (op.intentId && op.intentId !== pi.id))
                return;
            if (pi.status === 'succeeded' && (pi.amount_received !== op.amountMinor || !pi.payment_method))
                return;
            const status = op.status === 'succeeded' ? 'succeeded' : op.status === 'canceled' && pi.status !== 'succeeded' ? 'canceled' : pi.status;
            op.status = status;
            op.intentId = pi.id;
            op.updatedAt = new Date().toISOString();
            delete b.checkoutOperations?.['warranty_' + requestId];
            root.payments ??= {};
            const old = root.payments[pi.id];
            if (old && (old.bookingPath !== path || old.stripeConnectedAccountId !== accountId))
                return;
            root.payments[pi.id] = { ...(old || {}), id: pi.id, bookingId: op.bookingId, bookingPath: path, ownerId: op.ownerId, assetId: op.assetId, customerUid: op.customerUid, stripeCustomerId: op.customerId, customerEmail: op.email, kind: 'security_payment', warrantyChargeId: requestId, reason: op.reason, amount: op.amountMinor / 100, currency: op.currency, stripeMode: op.mode, stripePaymentIntentId: pi.id, stripeConnectedAccountId: accountId, status, createdAt: op.createdAt, updatedAt: op.updatedAt, ...(eventId ? { webhookEventId: eventId } : { verifiedBy: 'stripe_api' }) };
            root.paymentsByBooking ??= {};
            root.paymentsByBooking[op.bookingId] ??= {};
            root.paymentsByBooking[op.bookingId][pi.id] = true;
            return root;
        }, undefined, false);
        const saved = result.snapshot.val()?.bookings?.[parts[1]]?.[parts[2]]?.[parts[3]]?.warrantyCharges?.[requestId];
        if (!result.committed || !saved)
            throw fail('warranty_payment_scope_mismatch');
        return saved;
    }
    async execute(op) {
        const activeMode = String(process.env.STRIPE_SECRET_KEY || '').startsWith('sk_test_') ? 'test' : 'live';
        if (activeMode !== op.mode)
            throw fail('booking_stripe_mode_mismatch');
        const options = { stripeAccount: op.accountId };
        let pi;
        if (op.intentId) {
            pi = await this.stripe.paymentIntents.retrieve(op.intentId, options);
        }
        else {
            const owner = (await this.store.db.ref('owners/' + op.ownerId).once('value')).val();
            if (ownerStripeAccountId(owner) !== op.accountId)
                throw fail('booking_stripe_account_mismatch');
            if (Date.now() - Date.parse(op.createdAt) > 23 * 3600000)
                throw fail('warranty_manual_review_required');
            const setup = await this.stripe.setupIntents.retrieve(op.setupIntentId, options);
            if (setup.status !== 'succeeded' || setup.livemode !== (op.mode === 'live') || objectId(setup.customer) !== op.customerId || objectId(setup.payment_method) !== op.paymentMethodId || setup.metadata?.bookingPath !== op.bookingPath || setup.metadata?.bookingId !== op.bookingId || setup.metadata?.platform !== 'godirect')
                throw fail('warranty_setup_required');
            const account = await this.stripe.accounts.retrieve(op.accountId);
            if (ownerStripeTestMode())
                assertOwnerTestAccount(account, op.ownerId);
            if (!account.charges_enabled)
                throw fail('owner_stripe_charges_not_enabled');
            try {
                pi = await this.stripe.paymentIntents.create({ amount: op.amountMinor, currency: op.currency, customer: op.customerId, payment_method: op.paymentMethodId, payment_method_types: ['card'], confirm: true, off_session: true, description: op.reason.slice(0, 500), ...(op.email ? { receipt_email: op.email } : {}), metadata: { platform: 'godirect', kind: 'security_payment', warrantyChargeId: op.id, bookingPath: op.bookingPath, bookingId: op.bookingId, ownerId: op.ownerId, assetId: op.assetId } }, { ...options, idempotencyKey: 'gd-warranty-v1:' + createHash('sha256').update(op.bookingPath + ':' + op.accountId + ':' + op.mode + ':' + op.id).digest('hex') });
            }
            catch (e) {
                const candidate = e.payment_intent || e.raw?.payment_intent;
                pi = typeof candidate === 'string' ? await this.stripe.paymentIntents.retrieve(candidate, options) : candidate;
                if (!pi || typeof pi !== 'object')
                    throw e;
            }
        }
        if (pi.status === 'requires_payment_method') {
            try {
                pi = await this.stripe.paymentIntents.cancel(pi.id, {}, options);
            }
            catch { /* Preserve the reserved cap until Stripe confirms cancellation. */ }
        }
        return this.applyIntent(pi, op.accountId);
    }
    charge = async (req, res) => { const s = await this.scope(req, true); const p = z.object({ requestId: z.string().uuid(), amountMinor: z.number().int().positive().max(100000000), reason: z.string().trim().min(10).max(2000), acknowledged: z.literal(true) }).parse(req.body); const op = await this.reserve(s, p); try {
        return res.status(202).json(this.publicOperation(await this.execute(op)));
    }
    catch (e) {
        if (!e.status)
            return res.status(202).json({ ...this.publicOperation(op), status: 'unknown', message: 'warranty_status_unknown' });
        throw e;
    } };
    reconcile = async (req, res) => { const s = await this.scope(req, true); const id = z.string().uuid().parse(req.params.requestId), op = s.b.warrantyCharges?.[id]; if (!op || op.ownerId !== s.uid)
        throw fail('warranty_charge_not_found', 404); try {
        return res.json(this.publicOperation(await this.execute(op)));
    }
    catch (e) {
        if (!e.status)
            return res.status(202).json({ ...this.publicOperation(op), status: 'unknown' });
        throw e;
    } };
    authenticate = async (req, res) => { const s = await this.scope(req, false); const id = z.string().uuid().parse(req.params.requestId), op = s.b.warrantyCharges?.[id]; if (!op?.intentId || ['cancelled', 'rejected'].includes(s.b.status) || cancellationLocked(s.b))
        throw fail('warranty_charge_not_found', 404); const pi = await this.stripe.paymentIntents.retrieve(op.intentId, { stripeAccount: op.accountId }); await this.applyIntent(pi, op.accountId); if (!['requires_action', 'requires_confirmation'].includes(pi.status))
        throw fail('payment_confirmation_pending'); return res.json({ clientSecret: pi.client_secret, connectedAccountId: op.accountId, paymentId: pi.id, mode: 'payment', stripeMode: op.mode }); };
    publicOperation(op) { return { id: op.id, amountMinor: op.amountMinor, reason: op.reason, status: op.status, intentId: op.intentId || null }; }
}

//# sourceMappingURL=warranty-charges.js.map
