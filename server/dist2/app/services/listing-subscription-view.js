/** A placeholder with no Stripe operation can acquire its billing mode at first checkout. */
export function unstartedSubscription(b) { return !!b && ['required', 'not_subscribed'].includes(b.status) && !b.mode && !b.sessionId && !b.subscriptionId && !b.customerId && !b.requestId && !b.requestStartedAt && !b.busyUntil && !b.syncUntil && !b.paid && !Number(b.paidUntil); }
/** Public owner-facing fields; never expose Stripe credentials or payment details. */
export function subscriptionView(b, active) {
    if (!b)
        return null;
    return { status: b.status || 'required', paidUntil: b.paidUntil || null, cancelAtPeriodEnd: !!b.cancelAtPeriodEnd, mode: b.mode,
        active, startedAt: b.startedAt || null, currentPeriodStart: b.currentPeriodStart || null,
        currentPeriodEnd: b.currentPeriodEnd || b.paidUntil || null, canceledAt: b.canceledAt || null,
        canReconcile: !!(b.sessionId || b.subscriptionId), canManage: !!b.subscriptionId, canOpenPortal: !!b.customerId };
}

//# sourceMappingURL=listing-subscription-view.js.map
