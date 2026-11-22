import { hasAssetPermission } from './asset-delegation.js';
import { domainAssetId } from './asset-domain.js';
import { platformAdministrator } from './account-access.service.js';
import { parseAssetSearch, locationMatches, overlapsSearch, legacySearchInterval } from './asset-search.service.js';
import { listingPublic } from './listing-billing.service.js';
import { findAsset, isAssetType } from './asset-paths.service.js';
export function publicAsset(a) { if (!a)
    return a; const raw = a.location; const location = raw && typeof raw === 'object' ? Object.fromEntries(['city', 'area', 'region', 'country'].filter(k => typeof raw[k] === 'string').map(k => [k, raw[k]])) : {}; return { ...a, location }; }
export class AssetsService {
    firebase;
    constructor(firebase) {
        this.firebase = firebase;
    }
    async accessible(req, a, id) {
        if (!a)
            return false;
        if (!a.deletedAt && await listingPublic(this.firebase, a?.assetType || a?.type, id, a))
            return true;
        const token = /^Bearer\s+(.+)$/i.exec(String(req.headers.authorization || ''))?.[1];
        if (!token)
            return false;
        try {
            const u = await this.firebase.auth.verifyIdToken(token);
            if (a.deletedAt) {
                const p = (await this.firebase.db.ref(`backendusers/${u.uid}`).once('value')).val() || {};
                return platformAdministrator(u, p);
            }
            if (u.uid === a.ownerId)
                return true;
            for (const permission of ['content', 'bookings', 'customers', 'payments'])
                if (await hasAssetPermission(this.firebase, u.uid, String(a.assetType || a.type), id, permission))
                    return true;
            const p = (await this.firebase.db.ref(`backendusers/${u.uid}`).once('value')).val() || {};
            return platformAdministrator(u, p);
        }
        catch {
            return false;
        }
    }
    resolveDomain = async (req, res) => {
        res.setHeader('Cache-Control', 'no-store');
        const id = domainAssetId(String(req.headers.host || ''));
        if (!id)
            return res.status(404).json({ error: 'asset_domain_not_found' });
        const alias = (await this.firebase.db.ref(`assetPrefixes/${id}`).once('value')).val();
        if (alias && isAssetType(alias.assetType) && typeof alias.assetId === 'string') {
            const asset = await findAsset(this.firebase, alias.assetId, alias.assetType);
            if (!asset || asset.deletedAt)
                return res.status(404).json({ error: 'asset_domain_not_found' });
            return res.json({ assetType: alias.assetType, assetId: alias.assetId });
        }
        // IDs must be unique across asset types to be usable as a subdomain.
        const types = ['boat', 'car', 'property', 'parking', 'pool'];
        const all = (await this.firebase.db.ref('assets').once('value')).val() || {};
        const matches = types.flatMap(type => Object.entries(all[type] || {}).filter(([assetId, a]) => a && !a.deletedAt && (assetId === id || String(a.prefix || '').toLowerCase() === id)).map(([assetId]) => ({ assetType: type, assetId })));
        if (matches.length !== 1)
            return res.status(matches.length ? 409 : 404).json({ error: matches.length ? 'ambiguous_asset_domain' : 'asset_domain_not_found' });
        // Only routing identifiers are returned; content/publication guards still apply.
        return res.json(matches[0]);
    };
    list = async (req, res) => {
        const snap = await this.firebase.db.ref('assets').once('value');
        let rows = Object.entries(snap.val() || {}).filter(([t]) => isAssetType(t)).flatMap(([t, group]) => Object.entries(group || {}).map(([id, value]) => ({ ...value, id, assetType: t })));
        const filter = parseAssetSearch(req.query);
        if (filter.type)
            rows = rows.filter(a => a.assetType === filter.type);
        rows = rows.filter(a => locationMatches(a, filter.location));
        rows = (await Promise.all(rows.map(async (a) => await listingPublic(this.firebase, a.assetType, String(a.id), a) ? a : null))).filter(Boolean);
        if (filter.startAt) {
            const legacy = rows.some(a => a.assetType === 'boat') ? (await this.firebase.db.ref('bnBookings').once('value')).val() || {} : {};
            rows = (await Promise.all(rows.map(async (a) => {
                const bookings = (await this.firebase.db.ref(`bookings/${a.assetType}/${a.id}`).once('value')).val() || {};
                const old = a.assetType === 'boat' ? Object.values(legacy).filter((b) => !!b && String(b.assetId || b.boatId || 'alegria') === String(a.id) && (!b.assetType || b.assetType === 'boat')).map(legacySearchInterval) : [];
                return [...Object.values(bookings), ...old].some(b => overlapsSearch(b, filter.startAt, filter.endAt)) ? null : a;
            }))).filter(Boolean);
        }
        return res.json(rows.map(publicAsset));
    };
    get = async (req, res) => {
        const id = String(req.params.id);
        const asset = await findAsset(this.firebase, id);
        return asset && await this.accessible(req, asset, id) ? res.json(publicAsset({ id, ...asset })) : res.status(404).json({ error: 'asset_not_found' });
    };
    assetTypes = async (_req, res) => {
        const snap = await this.firebase.db.ref('assetTypes').once('value');
        return res.json(snap.val() || {});
    };
    faqs = async (req, res) => {
        const assetId = String(req.params.assetId);
        const asset = await findAsset(this.firebase, assetId);
        if (!asset || !await this.accessible(req, asset, assetId))
            return res.status(404).json({ error: 'asset_not_found' });
        const snap = await this.firebase.db.ref(`faqs/${asset.assetType}/${assetId}`).once('value');
        return res.json(Object.values(snap.val() || {}));
    };
    listByType = async (req, res) => {
        const type = String(req.params.type || '').toLowerCase();
        const snap = await this.firebase.db.ref(`assets/${type}`).once('value');
        let rows = Object.entries(snap.val() || {})
            .map(([id, value]) => ({ ...value, id, assetType: type }))
            .filter((a) => String(a.assetType || a.type || '').toLowerCase() === type)
            .filter((a) => a.enabled !== false && a.published !== false && a.status !== 'disabled');
        rows = (await Promise.all(rows.map(async (a) => (await listingPublic(this.firebase, type, String(a.id), a)) ? a : null))).filter(Boolean);
        return res.json(rows.map(publicAsset));
    };
    getByScope = async (req, res) => {
        const type = String(req.params.type || '').toLowerCase();
        const id = String(req.params.id || '');
        const asset = await findAsset(this.firebase, id, type);
        if (!asset || !await this.accessible(req, asset, id))
            return res.status(404).json({ error: 'asset_not_found' });
        if (String(asset.assetType || asset.type || '').toLowerCase() !== type)
            return res.status(404).json({ error: 'asset_not_found' });
        return res.json(publicAsset({ id, ...asset }));
    };
    outingsByScope = async (req, res) => {
        const type = String(req.params.type || '').toLowerCase();
        const id = String(req.params.id || '');
        const asset = await findAsset(this.firebase, id, type);
        if (!asset || !await this.accessible(req, asset, id))
            return res.status(404).json({ error: 'asset_not_found' });
        const snap = await this.firebase.db.ref(`bnOutings/${type}/${id}`).once('value');
        return res.json(snap.val() || {});
    };
}

//# sourceMappingURL=assets.service.js.map
