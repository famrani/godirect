import { createHash, randomUUID } from 'node:crypto';
import { updateExisting } from './existing-transaction.js';
const fail = (message) => Object.assign(new Error(message), { status: 409 });
/** Only called after authenticating the booking's customer and resolving its canonical owner/account. */
export async function connectedCustomer(store, stripe, input) {
    const email = String(input.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['test', 'live'].includes(input.mode))
        throw fail('stripe_customer_identity_required');
    const hash = createHash('sha256').update(input.ownerId + '\0' + input.uid).digest('hex');
    const ref = store.db.ref(`stripeCustomers/${input.mode}/${input.accountId}/${hash}`);
    const planned = { uid: input.uid, ownerId: input.ownerId, accountId: input.accountId, mode: input.mode, email, name: String(input.name || '').slice(0, 150), generation: randomUUID(), candidateId: input.candidateId || '', candidateBookingId: input.candidateId ? input.bookingId : '' };
    const claim = await ref.transaction((old) => old || planned, undefined, false);
    const record = claim.snapshot.val();
    if (!record || record.uid !== input.uid || record.ownerId !== input.ownerId || record.accountId !== input.accountId || record.mode !== input.mode)
        throw fail('stripe_customer_scope_mismatch');
    const options = { stripeAccount: input.accountId };
    let customer;
    if (record.customerId || record.candidateId) {
        customer = await stripe.customers.retrieve(record.customerId || record.candidateId, options);
        if (customer.deleted || customer.livemode !== (input.mode === 'live'))
            throw fail('stripe_customer_unavailable');
        const tagged = customer.metadata?.goDirectCustomerId === input.uid && customer.metadata?.goDirectOwnerId === input.ownerId;
        const legacy = record.candidateBookingId && customer.metadata?.bookingId === record.candidateBookingId && String(customer.email || '').toLowerCase() === String(record.email).toLowerCase();
        if (!tagged && !legacy)
            throw fail('stripe_customer_scope_mismatch');
    }
    else {
        customer = await stripe.customers.create({ email: record.email, ...(record.name ? { name: record.name } : {}), metadata: { goDirectCustomerId: input.uid, goDirectOwnerId: input.ownerId, platform: 'godirect', environment: input.mode } }, { ...options, idempotencyKey: `gd-customer-v1:${input.mode}:${input.accountId}:${hash}:${record.generation}` });
    }
    if (customer.deleted || customer.livemode !== (input.mode === 'live') || !customer.id)
        throw fail('stripe_customer_unavailable');
    const saved = await updateExisting(ref, (old) => { if (old.generation !== record.generation || old.uid !== input.uid || old.accountId !== input.accountId || (old.customerId && old.customerId !== customer.id))
        return; return { ...old, customerId: customer.id }; });
    if (!saved.committed)
        throw fail('stripe_customer_changed_retry');
    return { id: customer.id, email };
}

//# sourceMappingURL=connected-customer.js.map
