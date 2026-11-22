import { publicWarrantyBooking } from './warranty-charges.js';
import { updateExisting } from './existing-transaction.js';
import { initialWorkflow, advanceReservation } from './reservation-workflow.js';
export async function bookingPayments(firebase, id) {
    const index = (await firebase.db.ref(`paymentsByBooking/${id}`).once('value')).val() || {};
    if (Object.keys(index).length)
        return (await Promise.all(Object.keys(index).map(async (key) => (await firebase.db.ref(`payments/${key}`).once('value')).val()))).filter(Boolean);
    const snap = await firebase.db.ref('payments').orderByChild('bookingId').equalTo(id).once('value');
    return Object.values(snap.val() || {});
}
// Legacy status labels are not proof of payment. Only the server's verified ledger is adopted.
export async function reservationView(firebase, b) {
    if (b.workflow?.version === 25)
        return publicWarrantyBooking(advanceReservation(b));
    const w = { ...initialWorkflow('customer'), legacyLinked: true, adminApproved: b.status === 'confirmed' };
    let unresolvedPayment = false;
    const records = await bookingPayments(firebase, String(b.id));
    for (const r of records) {
        const amount = r.kind === 'booking_deposit' ? b.bookingDeposit : r.kind === 'balance' ? b.balanceAmount : b.securityDeposit;
        const related = r.bookingId === b.id && ['booking_deposit', 'balance', 'security_deposit', 'security_payment'].includes(r.kind);
        if (related && r.status !== 'canceled' && r.status !== 'succeeded')
            unresolvedPayment = true;
        if (r.bookingId !== b.id || r.ownerId !== b.ownerId || r.assetId !== b.assetId || r.status !== 'succeeded' || !r.webhookEventId || !r.stripeConnectedAccountId || Number(r.amount) !== Number(amount) || String(r.currency).toLowerCase() !== String(b.currency).toLowerCase()) {
            if (related && r.status === 'succeeded')
                unresolvedPayment = true;
            continue;
        }
        const field = r.kind === 'booking_deposit' ? 'depositPaid' : r.kind === 'balance' ? 'balancePaid' : ['security_deposit', 'security_payment'].includes(r.kind) ? 'warrantyProvided' : null;
        if (!field)
            continue;
        w[field] = true;
        w[field + 'Proof'] = { intentId: r.stripePaymentIntentId, eventId: r.webhookEventId, accountId: r.stripeConnectedAccountId, kind: r.kind === 'security_deposit' && String(r.stripePaymentIntentId).startsWith('pi_') ? 'security_payment' : r.kind, source: 'verified_legacy_ledger' };
    }
    const legacyPaid = (b.status === 'confirmed' && Number(b.bookingDeposit) > 0) || b.depositPaid === true || b.balancePaid === true || ['paid', 'deposit_paid', 'fully_paid'].includes(String(b.paymentStatus).toLowerCase());
    const legacyWarranty = b.warrantyStatus === true || ['paid', 'provided', 'card_registered'].includes(String(b.warrantyStatus).toLowerCase());
    const financialReviewRequired = unresolvedPayment || (legacyPaid && Number(b.bookingDeposit) > 0 && !w.depositPaid) || (b.balancePaid === true && !w.balancePaid) || (legacyWarranty && !w.warrantyProvided);
    const result = advanceReservation({ ...b, workflow: w });
    return publicWarrantyBooking({ ...result, ...(b.status === 'confirmed' ? { status: b.status } : {}), financialReviewRequired, financialChangesLocked: records.length > 0 || !!b.paymentCheckoutStartedAt });
}
export async function ensureReservationWorkflow(firebase, path) {
    const old = (await firebase.db.ref(path).once('value')).val();
    if (!old)
        return null;
    const view = await reservationView(firebase, old);
    if (old.workflow?.version === 25 || view.financialReviewRequired)
        return view;
    const result = await updateExisting(firebase.db.ref(path), (current) => {
        if (!current)
            return;
        if (current.workflow?.version === 25)
            return current;
        if (['bookingDeposit', 'securityDeposit', 'balanceAmount', 'currency', 'ownerId', 'customerId', 'updatedAt'].some(k => current[k] !== old[k]))
            return;
        const { financialReviewRequired, financialChangesLocked, ...adopted } = view;
        return { ...current, ...adopted };
    });
    if (result.missing)
        return null;
    if (!result.committed)
        throw Object.assign(new Error('booking_changed_reload_required'), { status: 409 });
    return result.snapshot.val();
}

//# sourceMappingURL=reservation-compatibility.js.map
