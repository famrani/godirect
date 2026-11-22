import { createHash } from 'node:crypto';
import { ownerStripeTestMode, ownerStripeAccountId, assertOwnerTestAccount, stripeTestNamespace } from './owner-stripe-mode.js';
const fail = (status, message) => Object.assign(new Error(message), { status });
export function testProvisioningEnabled() {
    return ownerStripeTestMode() && process.env.STRIPE_TEST_ACCOUNT_PROVISIONING === 'true';
}
export function testFixturePhone() {
    // International form of the phone used in Stripe's API-onboarding test example.
    const phone = String(process.env.STRIPE_TEST_FIXTURE_PHONE || '+18888675309').trim();
    if (!/^\+[1-9][0-9]{7,14}$/.test(phone))
        throw fail(503, 'invalid_stripe_test_fixture_phone');
    return phone;
}
export function testOwnerParams(ownerId, email, namespace, acceptedAt) {
    const phone = testFixturePhone();
    // Only Stripe sandbox fixtures. Never call this from the live onboarding branch.
    return { type: 'custom', country: 'FR', default_currency: 'eur', email, business_type: 'individual',
        capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
        business_profile: { mcc: '7399', url: 'https://godirect.fr', product_description: 'GoDirect synthetic test asset rentals', support_phone: phone },
        individual: { first_name: 'Jenny', last_name: 'Rosen', email, phone, dob: { day: 1, month: 1, year: 1901 },
            address: { line1: 'address_full_match', city: 'Paris', postal_code: '75001', country: 'FR' },
            verification: { document: { front: 'file_identity_document_success' } } },
        external_account: { object: 'bank_account', country: 'FR', currency: 'eur', account_holder_name: 'Jenny Rosen', account_holder_type: 'individual', account_number: 'FR1420041010050500013M02606' },
        tos_acceptance: { date: acceptedAt, ip: '127.0.0.1' },
        metadata: { platform: 'godirect', goDirectOwnerId: ownerId, goDirectTestNamespace: namespace, environment: 'test', fixture: 'gd-fr-individual-v1' } };
}
function usesAccount(value, id) {
    if (!value || typeof value !== 'object')
        return false;
    if (value.stripeConnectedAccountId === id)
        return true;
    return Object.values(value).some(v => usesAccount(v, id));
}
export async function provisionTestOwner(firebase, stripe, ownerId, replaceExisting) {
    if (!testProvisioningEnabled())
        throw fail(403, 'stripe_test_provisioning_disabled');
    const country = String(process.env.STRIPE_TEST_ACCOUNT_COUNTRY || 'FR').toUpperCase();
    if (country !== 'FR')
        throw fail(409, 'stripe_test_fixture_country_unsupported');
    const ownerRef = firebase.db.ref(`owners/${ownerId}`);
    const owner = (await ownerRef.once('value')).val();
    if (owner?.uid !== ownerId)
        throw fail(403, 'owner_access_denied');
    const previousId = ownerStripeAccountId(owner);
    if (previousId) {
        const old = await stripe.accounts.retrieve(previousId);
        assertOwnerTestAccount(old, ownerId);
        // Keep ready accounts and the already provisioned fixture account, including during pending verification.
        if (old.charges_enabled || old.metadata?.fixture === 'gd-fr-individual-v1')
            return old;
        if (!replaceExisting)
            throw fail(409, 'stripe_test_replace_confirmation_required');
        const snapshots = await Promise.all(['payments', 'bookings', 'bnBookings'].map(p => firebase.db.ref(p).once('value')));
        if (snapshots.some(s => usesAccount(s.val(), previousId)))
            throw fail(409, 'stripe_test_account_in_use_create_new_owner');
    }
    const identity = await firebase.auth.getUser(ownerId);
    if (!identity.email)
        throw fail(409, 'stripe_test_owner_email_required');
    const namespace = stripeTestNamespace();
    // Persist the exact request before Stripe: retries retain identical idempotency parameters.
    const candidateRef = firebase.db.ref(`stripeTestProvisioning/${namespace}/${ownerId}`);
    await candidateRef.once('value');
    const prepared = await candidateRef.transaction((v) => v || { ownerId, previousAccountId: previousId, requestVersion: 2, params: testOwnerParams(ownerId, identity.email, namespace, Math.floor(Date.now() / 1000)) }, undefined, false);
    let candidate = prepared.snapshot.val();
    if (candidate?.ownerId !== ownerId || candidate.previousAccountId !== previousId)
        throw fail(409, 'stripe_test_connection_changed_retry');
    const digest = createHash('sha256').update(namespace + '|' + ownerId).digest('hex');
    const createCandidate = (v) => stripe.accounts.create(v.params, { idempotencyKey: `gd-fr-fixture-v${v.requestVersion || 1}:${digest}` });
    let account;
    try {
        account = candidate.accountId ? await stripe.accounts.retrieve(candidate.accountId) : await createCandidate(candidate);
    }
    catch (error) {
        // Recover ONLY a confirmed legacy phone-validation rejection. Never rotate a
        // request after timeouts, 5xx responses, or an uncertain successful creation.
        if (candidate.accountId || (candidate.requestVersion || 1) !== 1 || error.type !== 'StripeInvalidRequestError' || error.statusCode !== 400 || !['business_profile[support_phone]', 'individual[phone]'].includes(error.param) || !String(error.message).includes('invalid phone number'))
            throw error;
        const phone = testFixturePhone();
        const migrated = await candidateRef.transaction((v) => {
            if (v === null)
                return null;
            if (v.accountId || (v.requestVersion || 1) !== 1)
                return v;
            if (v.ownerId !== ownerId || v.previousAccountId !== previousId)
                return;
            return { ...v, requestVersion: 2, params: { ...v.params, business_profile: { ...v.params.business_profile, support_phone: phone }, individual: { ...v.params.individual, phone } }, legacyPhoneRejectionRecovered: true };
        }, undefined, false);
        candidate = migrated.snapshot.val();
        if (!migrated.committed || candidate?.ownerId !== ownerId || candidate.previousAccountId !== previousId)
            throw fail(409, 'stripe_test_connection_changed_retry');
        account = candidate.accountId ? await stripe.accounts.retrieve(candidate.accountId) : await createCandidate(candidate);
    }
    assertOwnerTestAccount(account, ownerId);
    if (account.type !== 'custom' || !/^acct_[a-zA-Z0-9]+$/.test(account.id) || account.metadata?.fixture !== 'gd-fr-individual-v1')
        throw fail(409, 'stripe_test_fixture_invalid_account');
    await candidateRef.update({ accountId: account.id });
    const claim = await firebase.db.ref(`stripeTestAccountOwners/${account.id}`).transaction((v) => v && v.ownerId !== ownerId ? undefined : { ownerId }, undefined, false);
    if (!claim.committed)
        throw fail(409, 'stripe_test_account_already_assigned');
    const connectionRef = firebase.db.ref(`owners/${ownerId}/stripeTest/${namespace}`);
    await connectionRef.once('value');
    const saved = await connectionRef.transaction((v) => {
        // RTDB may first invoke this callback with speculative null even when a
        // connection exists on the server. Returning undefined would abort before
        // the server can supply it. Null asks RTDB to compare/retry with server data.
        if (v === null && previousId)
            return null;
        const current = String(v?.connectedAccountId || '');
        if (current === account.id)
            return v;
        if (current !== previousId)
            return;
        return { ownerId, connectedAccountId: account.id, accountType: 'custom', namespace, mode: 'test', connectionMethod: 'test_fixture', connectedAt: new Date().toISOString(), previousAccountId: previousId };
    }, undefined, false);
    if (!saved.committed || saved.snapshot.val()?.connectedAccountId !== account.id)
        throw fail(409, 'stripe_test_connection_changed_retry');
    return stripe.accounts.retrieve(account.id);
}

//# sourceMappingURL=test-owner-provisioning.js.map
