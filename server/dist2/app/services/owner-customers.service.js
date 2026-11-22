import { createHash } from 'node:crypto';
import { ASSET_TYPES } from './asset-paths.service.js';
import { warrantySummary } from './warranty-charges.js';
const fail = (message, status) => Object.assign(new Error(message), { status });
const text = (v) => typeof v === 'string' ? v : '';
export function ownerCustomerRows(root, ownerId) {
    const bookings = [];
    for (const type of ASSET_TYPES)
        for (const [assetId, items] of Object.entries(root.bookings?.[type] || {})) {
            const asset = root.assets?.[type]?.[assetId];
            if (asset?.ownerId !== ownerId)
                continue;
            for (const [id, value] of Object.entries(items || {}))
                if (value && value.ownerId === ownerId && value.assetId === assetId && value.assetType === type && value.id === id)
                    bookings.push({ ...value, assetName: asset.name || assetId, _path: `bookings/${type}/${assetId}/${id}` });
        }
    const payments = Object.values(root.payments || {});
    const groups = new Map();
    for (const b of bookings) {
        const records = payments.filter(p => p?.bookingId === b.id && p.ownerId === ownerId && p.assetId === b.assetId && p.bookingPath === b._path && p.stripeConnectedAccountId === b.stripeConnectedAccountId && (!p.customerUid || p.customerUid === b.customerId) && /^(pi|seti)_[a-zA-Z0-9]+$/.test(p.stripePaymentIntentId || ''));
        const identity = b.customerId && b.customerId !== 'guest' ? String(b.customerId) : 'guest:' + String(b.customerEmail || '').trim().toLowerCase();
        if (!identity || identity === 'guest:')
            continue;
        const id = createHash('sha256').update(ownerId + '\0' + identity).digest('hex');
        let group = groups.get(id);
        if (!group) {
            const profile = b.customerId !== 'guest' ? root.backendusers?.[b.customerId] || {} : {};
            const name = text(profile.displayName) || [text(profile.firstname || profile.firstName), text(profile.lastname || profile.lastName)].filter(Boolean).join(' ') || text(b.customerName);
            group = { id, profile: { name, email: text(b.customerEmail), phone: text(profile.phone) || text(b.customerPhone) }, bookings: [], payments: [], qualified: false };
            groups.set(id, group);
        }
        if (records.some(p => p.status === 'succeeded'))
            group.qualified = true;
        const summary = warrantySummary(b, records);
        const mode = String(process.env.STRIPE_SECRET_KEY || '').startsWith('sk_test_') ? 'test' : 'live';
        summary.canCharge = summary.canCharge && b.stripeMode === mode;
        group.bookings.push({ id: b.id, assetType: b.assetType, assetId: b.assetId, assetName: b.assetName, startAt: b.startAt || b.outingDate || null, endAt: b.endAt || null, status: b.status, currency: b.currency, rentalAmount: b.rentalAmount, bookingDeposit: b.bookingDeposit, balanceAmount: b.balanceAmount, securityDeposit: b.securityDeposit, stripeMode: b.stripeMode, warranty: summary });
        group.payments.push(...records.map(p => ({ id: p.id || p.stripePaymentIntentId, bookingId: b.id, assetType: b.assetType, assetId: b.assetId, kind: p.kind, status: p.status, amount: p.amount, currency: p.currency, stripeMode: p.stripeMode, stripeCustomerId: p.stripeCustomerId || null, stripeConnectedAccountId: p.stripeConnectedAccountId, createdAt: p.createdAt || null, reason: text(p.reason), refundedMinor: Number(p.cancellationRefund?.refunded || 0) })));
    }
    return [...groups.values()].filter(g => g.qualified).map(({ qualified, ...g }) => g).sort((a, b) => a.profile.name.localeCompare(b.profile.name));
}
export class OwnerCustomersService {
    store;
    constructor(store) {
        this.store = store;
    }
    async rows(req) { const token = /^Bearer\s+(.+)$/i.exec(String(req.headers.authorization || ''))?.[1]; if (!token)
        throw fail('authentication_required', 401); let uid; try {
        uid = (await this.store.auth.verifyIdToken(token)).uid;
    }
    catch {
        throw fail('authentication_required', 401);
    } const root = (await this.store.db.ref().once('value')).val() || {}; return ownerCustomerRows(root, uid); }
    list = async (req, res) => { res.setHeader('Cache-Control', 'no-store'); const rows = await this.rows(req); return res.json(rows.map(r => ({ id: r.id, profile: r.profile, bookingCount: r.bookings.length, paymentCount: r.payments.length, lastTransactionAt: r.payments.map((p) => p.createdAt || '').sort().at(-1) || null }))); };
    detail = async (req, res) => { res.setHeader('Cache-Control', 'no-store'); const row = (await this.rows(req)).find(r => r.id === String(req.params.customerKey)); if (!row)
        throw fail('customer_not_found', 404); return res.json(row); };
}

//# sourceMappingURL=owner-customers.service.js.map
