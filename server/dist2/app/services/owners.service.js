import { createHash, randomBytes } from 'node:crypto';
import { ownerStripeTestMode, ownerStripeAccountId, assertOwnerTestAccount, stripeTestNamespace } from './owner-stripe-mode.js';
import { findAsset } from './asset-paths.service.js';
import { requireOwner } from './stripe-auth.service.js';
export class OwnersService {
    firebase;
    stripeSvc;
    constructor(firebase, stripeSvc) {
        this.firebase = firebase;
        this.stripeSvc = stripeSvc;
    }
    connect = async (req, res) => {
        const ownerId = String(req.params.ownerId);
        await requireOwner(req, this.firebase, ownerId);
        const ref = this.firebase.db.ref(`owners/${ownerId}`);
        const owner = (await ref.once('value')).val();
        if (!owner)
            return res.status(404).json({ error: 'owner_not_found' });
        const front = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
        if (!front)
            return res.status(500).json({ error: 'frontend_url_missing' });
        // Redirect to the same asset's management payments page, only if it belongs to this UID.
        const assetType = String(req.body?.assetType || '');
        const assetId = String(req.body?.assetId || '');
        let paymentPath = '/owner/payments';
        if (assetId && ['boat', 'car', 'property', 'parking', 'pool'].includes(assetType) && /^[a-zA-Z0-9_-]+$/.test(assetId)) {
            const asset = await findAsset(this.firebase, assetId);
            if (!asset || asset.ownerId !== ownerId || asset.assetType !== assetType)
                return res.status(403).json({ error: 'asset_access_denied' });
            paymentPath = `/${assetType}/${assetId}/owner/payments`;
        }
        if (ownerStripeTestMode()) {
            const clientId = String(process.env.STRIPE_TEST_CONNECT_CLIENT_ID || '');
            const redirectUri = String(process.env.STRIPE_TEST_CONNECT_REDIRECT_URI || '');
            if (!/^ca_[a-zA-Z0-9]+$/.test(clientId) || !redirectUri)
                return res.status(503).json({ error: 'stripe_test_oauth_config_missing' });
            const state = randomBytes(32).toString('hex');
            const key = createHash('sha256').update(state).digest('hex');
            const namespace = stripeTestNamespace();
            await this.firebase.db.ref(`stripeOAuthStates/${key}`).set({ ownerId, namespace, paymentPath, expiresAt: Date.now() + 10 * 60 * 1000, previousAccountId: ownerStripeAccountId(owner) });
            const url = new URL('https://connect.stripe.com/oauth/authorize');
            url.search = new URLSearchParams({ response_type: 'code', client_id: clientId, scope: 'read_write', redirect_uri: redirectUri, state }).toString();
            return res.json({ mode: 'test', perOwnerTestAccount: true, url: url.toString() });
        }
        let accountId = owner?.stripe?.connectedAccountId || owner?.stripeAccountId;
        if (!accountId) {
            const a = await this.stripeSvc.stripe.accounts.create({ type: 'standard', metadata: { goDirectOwnerId: ownerId } });
            accountId = a.id;
            await ref.update({ stripe: { connectedAccountId: accountId, accountType: 'standard', onboardingComplete: false, chargesEnabled: false, payoutsEnabled: false } });
        }
        const link = await this.stripeSvc.stripe.accountLinks.create({ account: accountId, refresh_url: `${front}${paymentPath}?refresh=1`, return_url: `${front}${paymentPath}?connected=1`, type: 'account_onboarding' });
        return res.json({ accountId, url: link.url });
    };
    // Public Stripe redirect: authorization comes from the unguessable, one-use state
    // created by the owner-authenticated POST, never from callback owner parameters.
    oauthCallback = async (req, res) => {
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Referrer-Policy', 'no-referrer');
        if (!ownerStripeTestMode())
            return res.status(409).json({ error: 'stripe_test_owner_mode_disabled' });
        const state = typeof req.query.state === 'string' ? req.query.state : '';
        if (!/^[a-f0-9]{64}$/.test(state))
            return res.status(400).json({ error: 'invalid_oauth_state' });
        const key = createHash('sha256').update(state).digest('hex');
        const stateRef = this.firebase.db.ref(`stripeOAuthStates/${key}`);
        // Warm the RTDB cache; returning null on its speculative null callback retries
        // against server data without accidentally consuming an absent state.
        await stateRef.once('value');
        const consumed = await stateRef.transaction((v) => {
            if (v === null)
                return null;
            if (v.used || v.expiresAt <= Date.now() || v.namespace !== stripeTestNamespace())
                return;
            return { ...v, used: true };
        }, undefined, false);
        const entry = consumed.snapshot.val();
        if (!consumed.committed || !entry?.used)
            return res.status(400).json({ error: 'invalid_or_expired_oauth_state' });
        const front = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
        if (!front)
            return res.status(503).json({ error: 'frontend_url_missing' });
        const returnUrl = `${front}${entry.paymentPath}`;
        if (req.query.error)
            return res.redirect(`${returnUrl}?stripeOAuth=cancelled`);
        const code = typeof req.query.code === 'string' ? req.query.code : '';
        if (!code)
            return res.status(400).json({ error: 'stripe_oauth_code_missing' });
        const owner = (await this.firebase.db.ref(`owners/${entry.ownerId}`).once('value')).val();
        if (owner?.uid !== entry.ownerId)
            return res.status(403).json({ error: 'owner_access_denied' });
        const token = await this.stripeSvc.stripe.oauth.token({ grant_type: 'authorization_code', code });
        const accountId = String(token.stripe_user_id || '');
        if (token.livemode !== false || token.scope !== 'read_write' || !/^acct_[a-zA-Z0-9]+$/.test(accountId))
            return res.status(409).json({ error: 'stripe_test_oauth_invalid_account' });
        const a = await this.stripeSvc.stripe.accounts.retrieve(accountId);
        if (a.deleted || ('type' in a && a.type !== 'standard'))
            return res.status(409).json({ error: 'stripe_test_oauth_invalid_account' });
        const metadata = a.metadata || {};
        if (metadata.goDirectOwnerId && metadata.goDirectOwnerId !== entry.ownerId)
            return res.status(409).json({ error: 'stripe_test_account_already_assigned' });
        // Account-level claim survives reconnects and prevents cross-owner reuse.
        const claim = await this.firebase.db.ref(`stripeTestAccountOwners/${accountId}`).transaction((v) => v && v.ownerId !== entry.ownerId ? undefined : { ownerId: entry.ownerId }, undefined, false);
        if (!claim.committed)
            return res.status(409).json({ error: 'stripe_test_account_already_assigned' });
        await this.stripeSvc.stripe.accounts.update(accountId, { metadata: { platform: 'godirect', goDirectOwnerId: entry.ownerId, goDirectTestNamespace: entry.namespace, environment: 'test' } });
        const connectionRef = this.firebase.db.ref(`owners/${entry.ownerId}/stripeTest/${entry.namespace}`);
        await connectionRef.once('value');
        const saved = await connectionRef.transaction((v) => {
            if (v === null && entry.previousAccountId)
                return null;
            if (String(v?.connectedAccountId || '') !== entry.previousAccountId)
                return;
            return { ownerId: entry.ownerId, connectedAccountId: accountId, accountType: 'standard', namespace: entry.namespace, mode: 'test', connectionMethod: 'oauth', connectedAt: new Date().toISOString(), previousAccountId: entry.previousAccountId };
        }, undefined, false);
        if (!saved.committed || saved.snapshot.val()?.connectedAccountId !== accountId)
            return res.status(409).json({ error: 'stripe_test_connection_changed_retry' });
        return res.redirect(`${returnUrl}?stripeOAuth=connected`);
    };
    status = async (req, res) => {
        const ownerId = String(req.params.ownerId);
        await requireOwner(req, this.firebase, ownerId);
        const owner = (await this.firebase.db.ref(`owners/${ownerId}`).once('value')).val();
        if (!owner)
            return res.status(404).json({ error: 'owner_not_found' });
        const sandbox = ownerStripeTestMode();
        const accountId = ownerStripeAccountId(owner);
        if (!accountId)
            return res.json({ connected: false, mode: sandbox ? 'test' : undefined, perOwnerTestAccount: sandbox });
        const a = await this.stripeSvc.stripe.accounts.retrieve(accountId);
        if (sandbox)
            assertOwnerTestAccount(a, ownerId);
        return res.json({ connected: true, accountId, mode: sandbox ? 'test' : (String(process.env.STRIPE_SECRET_KEY || '').startsWith('sk_test_') ? 'test' : 'live'), perOwnerTestAccount: sandbox, chargesEnabled: !!a.charges_enabled, payoutsEnabled: !!a.payouts_enabled, detailsSubmitted: !!a.details_submitted, requirementsCurrentlyDue: a.requirements?.currently_due || [], requirementsPastDue: a.requirements?.past_due || [], requirementsPendingVerification: a.requirements?.pending_verification || [], disabledReason: a.requirements?.disabled_reason || null, onboardingComplete: !!(a.charges_enabled && a.payouts_enabled) });
    };
}

//# sourceMappingURL=owners.service.js.map
