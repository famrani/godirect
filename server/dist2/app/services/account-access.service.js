import { moderationView, listingRevision } from './listing-moderation.js';
import { randomUUID } from 'node:crypto';
import { ASSET_TYPES } from './asset-paths.service.js';
import { paidEntitlement, ANNUAL_PRICES } from './listing-billing.service.js';
import { listingImpact } from './listing-impact.js';
import { z } from 'zod';
import { isAssetType, assetPath } from './asset-paths.service.js';
export function accountRole(value) {
    const role = String(value || '').trim().toLowerCase();
    if (['owner', 'boatowner', 'assetowner', 'asset_owner'].includes(role))
        return 'assetOwner';
    if (['admin', 'superadmin'].includes(role))
        return 'admin';
    if (['serviceprovider', 'provider'].includes(role))
        return 'serviceProvider';
    return 'customer';
}
export function platformAdministrator(user, profile) { return user?.admin === true || user?.role === 'admin' || accountRole(profile?.role) === 'admin' || profile?.isAdmin === true || profile?.roles?.admin === true; }
const fail = (status, message) => Object.assign(new Error(message), { status });
const profileSchema = z.object({
    firstname: z.string().trim().max(120).optional(), lastname: z.string().trim().max(120).optional(),
    displayName: z.string().trim().max(240).optional(), country: z.string().max(120).optional(),
    phone: z.string().max(80).optional(), address: z.string().max(1000).optional(), role: z.string().optional(),
    photos: z.array(z.string().max(2000)).max(20).optional(), photoURL: z.string().max(2000).optional(),
    socialnetwork: z.array(z.object({ label: z.string().max(120), url: z.string().max(2000) })).max(20).optional(),
});
export class AccountAccessService {
    store;
    constructor(store) {
        this.store = store;
    }
    async identity(req) {
        const token = /^Bearer\s+(.+)$/i.exec(String(req.headers.authorization || ''))?.[1];
        if (!token)
            throw fail(401, 'authentication_required');
        try {
            return await this.store.auth.verifyIdToken(token);
        }
        catch {
            throw fail(401, 'invalid_authentication');
        }
    }
    context = async (req, res) => {
        const user = await this.identity(req);
        const profile = (await this.store.db.ref(`backendusers/${user.uid}`).once('value')).val() || {};
        const role = accountRole(profile.role);
        const platformAdmin = platformAdministrator(user, profile);
        const type = String(req.query.type || ''), id = String(req.query.id || '');
        let ownsAsset = false;
        if (isAssetType(type) && /^[a-zA-Z0-9_-]+$/.test(id)) {
            const asset = (await this.store.db.ref(assetPath(type, id)).once('value')).val();
            ownsAsset = asset?.ownerId === user.uid;
        }
        return res.json({ uid: user.uid, role, platformAdmin, ownsAsset, isAssetOwner: role === 'assetOwner' || profile.roles?.assetOwner === true || ownsAsset, scope: type && id ? `${type}/${id}` : '' });
    };
    platformOverview = async (req, res) => {
        const user = await this.identity(req);
        const profile = (await this.store.db.ref(`backendusers/${user.uid}`).once('value')).val() || {};
        if (!platformAdministrator(user, profile))
            throw fail(403, 'platform_admin_required');
        const paths = ['assets', 'backendusers', 'owners', 'listingBilling', 'bookings', 'bnBookings', 'listingModeration'];
        const snaps = await Promise.all(paths.map(p => this.store.db.ref(p).once('value')));
        const [assets, profiles, owners, billing, bookings, legacy, moderations] = snaps.map(s => s.val() || {});
        const ownerIds = new Set(Object.keys(owners));
        for (const [uid, p] of Object.entries(profiles))
            if (accountRole(p?.role) === 'assetOwner' || p?.roles?.assetOwner === true)
                ownerIds.add(uid);
        const assetRows = [], subscriptions = [];
        for (const type of ASSET_TYPES) {
            for (const [id, a] of Object.entries(assets[type] || {})) {
                if (!a || typeof a !== 'object')
                    continue;
                const ownerId = String(a.ownerId || '');
                if (ownerId)
                    ownerIds.add(ownerId);
                const b = billing[type]?.[id], impact = listingImpact(a, bookings[type]?.[id], legacy, b, type, id);
                const moderation = moderationView(a, moderations[type]?.[id]);
                assetRows.push({ moderation, headline: String(a.headline || ''), description: String(a.description || ''), location: { city: a.location?.city || '', area: a.location?.area || '', country: a.location?.country || '' }, pricing: a.pricing || {}, properties: a.properties || {}, media: a.media || {}, id, assetType: type, name: String(a.name || id), ownerId, archived: !!a.deletedAt, public: !a.deletedAt && a.enabled !== false && a.published === true && a.status === 'active' && moderation.status === 'approved' && b?.ownerId === ownerId && paidEntitlement(b), pending: impact.pending, confirmed: impact.confirmed, subscriptionStatus: b?.status || 'required', paidUntil: Number(b?.paidUntil || 0), cancelAtPeriodEnd: !!b?.cancelAtPeriodEnd });
            }
            for (const [id, b] of Object.entries(billing[type] || {})) {
                if (!b || typeof b !== 'object')
                    continue;
                const ownerId = String(b.ownerId || '');
                if (ownerId)
                    ownerIds.add(ownerId);
                subscriptions.push({ assetId: id, assetType: type, assetName: String(assets[type]?.[id]?.name || id), ownerId, status: String(b.status || 'unknown'), mode: String(b.mode || 'unknown'), entitled: paidEntitlement(b), paidUntil: Number(b.paidUntil || 0), cancelAtPeriodEnd: !!b.cancelAtPeriodEnd, renewalState: !b.subscriptionId || ['canceled', 'incomplete_expired'].includes(b.status) ? 'none' : b.cancelAtPeriodEnd ? 'stopped' : 'automatic', annualPrice: ANNUAL_PRICES[type], missingAsset: !assets[type]?.[id], archived: !!assets[type]?.[id]?.deletedAt });
            }
        }
        const ownerRows = [...ownerIds].filter(uid => { const o = owners[uid] || {}, p = profiles[uid] || {}; return !/^owner_demo(?:_|$)/i.test(uid) && o.isDemo !== true && o.demo !== true && p.isDemo !== true && p.demo !== true && String(o.status || '').toLowerCase() !== 'migrated' && assetRows.some(a => a.ownerId === uid && !a.archived); }).sort().map(uid => { const p = profiles[uid] || {}, o = owners[uid] || {}, owned = assetRows.filter(a => a.ownerId === uid); return { uid, name: String(p.displayName || [p.firstname, p.lastname].filter(Boolean).join(' ') || p.email || uid), email: String(p.email || o.email || ''), status: String(o.status || 'unknown'), assetCount: owned.filter(a => !a.archived).length, archivedAssetCount: owned.filter(a => a.archived).length, online: owned.filter(a => a.public).length, pending: owned.reduce((n, a) => n + a.pending, 0), subscriptions: subscriptions.filter(b => b.ownerId === uid && b.entitled).length }; });
        res.setHeader('Cache-Control', 'no-store');
        return res.json({ generatedAt: new Date().toISOString(), owners: ownerRows, assets: assetRows, subscriptions });
    };
    moderateListing = async (req, res) => {
        const user = await this.identity(req);
        const profile = (await this.store.db.ref(`backendusers/${user.uid}`).once('value')).val() || {};
        if (!platformAdministrator(user, profile))
            throw fail(403, 'platform_admin_required');
        const type = String(req.params.type), id = String(req.params.id);
        if (!isAssetType(type) || !/^[a-zA-Z0-9_-]+$/.test(id))
            throw fail(400, 'invalid_asset_scope');
        const body = z.object({ decision: z.enum(['approved', 'rejected']), revision: z.string().regex(/^[a-f0-9]{64}$/), reason: z.string().trim().max(2000).default('') }).parse(req.body);
        if (body.decision === 'rejected' && !body.reason)
            throw fail(400, 'rejection_reason_required');
        const now = new Date().toISOString(), audit = randomUUID();
        let error = 'listing_changed_reload_required';
        const result = await this.store.db.ref().transaction((root) => {
            if (root === null)
                return null;
            const a = root.assets?.[type]?.[id];
            if (!a || a.deletedAt) {
                error = 'listing_unavailable';
                return;
            }
            if (listingRevision(a) !== body.revision)
                return;
            const current = root.listingModeration?.[type]?.[id];
            if (moderationView(a, current).status !== 'pending') {
                error = 'moderation_not_pending';
                return;
            }
            const record = { status: body.decision, revision: body.revision, reason: body.reason, reviewedAt: now, reviewedBy: user.uid, requestedAt: current?.requestedAt || a.createdAt || null, requestedBy: current?.requestedBy || a.ownerId || null };
            root.listingModeration ??= {};
            root.listingModeration[type] ??= {};
            root.listingModeration[type][id] = record;
            root.listingModerationHistory ??= {};
            root.listingModerationHistory[type] ??= {};
            root.listingModerationHistory[type][id] ??= {};
            root.listingModerationHistory[type][id][audit] = record;
            return root;
        }, undefined, false);
        if (!result.committed || !result.snapshot.val()?.listingModeration?.[type]?.[id])
            throw fail(409, error);
        res.setHeader('Cache-Control', 'no-store');
        return res.json({ ok: true });
    };
    saveProfile = async (req, res) => {
        const user = await this.identity(req), input = profileSchema.parse(req.body);
        const ref = this.store.db.ref(`backendusers/${user.uid}`);
        const existing = (await ref.once('value')).val();
        const requested = accountRole(input.role ?? existing?.role);
        if (requested === 'admin' && accountRole(existing?.role) !== 'admin')
            throw fail(403, 'platform_role_cannot_be_self_assigned');
        const allowed = (await this.store.db.ref(`platformConfig/roles/${requested}/selfRegistration`).once('value')).val();
        if (accountRole(existing?.role) !== 'admin' && (!existing || accountRole(existing.role) !== requested) && allowed !== true)
            throw fail(403, 'role_not_available');
        const now = Date.now();
        const result = await ref.transaction((old) => {
            // Re-evaluate the stored role on every retry; profile editing must not revoke an administrator.
            const role = accountRole(old?.role) === 'admin' ? 'admin' : requested === 'admin' ? accountRole(old?.role) : requested;
            return { ...(old || {}), ...input, role, userId: user.uid, email: user.email || old?.email || '',
                emailverified: user.email_verified === true, provider: old?.provider || user.firebase?.sign_in_provider || 'firebase',
                state: old?.state || 'active', createdTS: old?.createdTS || now, modifiedTS: now };
        });
        if (!result.committed)
            throw fail(409, 'profile_changed_reload_required');
        const profile = result.snapshot.val();
        if (accountRole(profile.role) === 'assetOwner') {
            await this.store.db.ref(`owners/${user.uid}`).update({ uid: user.uid, status: 'active' });
            await ref.child('roles/assetOwner').set(true);
            profile.roles = { ...(profile.roles || {}), assetOwner: true };
        }
        return res.json(profile);
    };
    registrationRoles = async (_req, res) => {
        const catalog = (await this.store.db.ref('platformConfig/roles').once('value')).val() || {};
        return res.json(['customer', 'assetOwner', 'serviceProvider'].filter(id => catalog[id]?.selfRegistration === true).map(id => ({ id, labelKey: `roles.${id}` })));
    };
    uiContent = async (_req, res) => {
        res.setHeader('Cache-Control', 'no-store');
        return res.json((await this.store.db.ref('uiTranslations').once('value')).val() || {});
    };
}

//# sourceMappingURL=account-access.service.js.map
