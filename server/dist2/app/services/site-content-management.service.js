import { hasAssetPermission, assetPermission } from './asset-delegation.js';
import { photoUpdate, persistPhoto } from './persisted-photo.js';
import { createHash, randomUUID } from 'node:crypto';
import { isAssetType } from './asset-paths.service.js';
import { platformAdministrator } from './account-access.service.js';
import { listingRevision } from './listing-moderation.js';
const languages = ['fr', 'en', 'es', 'it', 'de', 'nl', 'ru'];
const sections = ['homePage', 'outingsPage', 'outings', 'brand', 'brandTagline', 'boatPage', 'boatHighlights', 'boatHeroImage', 'galleryImages', 'contactPage', 'contactInfo', 'phoneDisplay', 'phoneRaw'];
const fail = (status, message) => Object.assign(new Error(message), { status });
function safeTree(v, depth = 0) {
    if (depth > 25)
        return false;
    if (v === null || typeof v === 'string' || typeof v === 'boolean')
        return true;
    if (typeof v === 'number')
        return Number.isFinite(v);
    if (Array.isArray(v))
        return v.length <= 1000 && v.every(x => safeTree(x, depth + 1));
    return !!v && typeof v === 'object' && Object.entries(v).every(([k, x]) => /^[^.#$\[\]/]+$/.test(k) && !['__proto__', 'prototype', 'constructor'].includes(k) && safeTree(x, depth + 1));
}
function setPath(target, path, value) { const keys = path.split('/'); let node = target; for (const k of keys.slice(0, -1))
    node = node[k] ??= {}; node[keys[keys.length - 1]] = value; }
export function cmsAssetUpdates(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input) || !safeTree(Object.fromEntries(Object.entries(input).map(([k, v]) => [k.replaceAll('/', '_'), v]))))
        throw fail(400, 'invalid_content');
    const out = {};
    for (const [key, v] of Object.entries(input)) {
        if (!/^(name|headline|description|location\/(city|area|country)|pricing\/basePrice|properties\/[a-zA-Z][a-zA-Z0-9_]{0,60}|translations\/(fr|en|es|it|de|nl|ru)\/(headline|description)|media\/(hero|cover|gallery|configured))$/.test(key))
            throw fail(400, 'content_field_not_allowed');
        if (key === 'pricing/basePrice' && (typeof v !== 'number' || !Number.isFinite(v) || v < 0))
            throw fail(400, 'invalid_price');
        if (key === 'name' && (typeof v !== 'string' || !v.trim() || v.length > 240))
            throw fail(400, 'invalid_name');
        if (key === 'media/configured' && typeof v !== 'boolean')
            throw fail(400, 'invalid_media');
        if (key.startsWith('media/') && key !== 'media/configured' && !(v === null || typeof v === 'string' || (key === 'media/gallery' && Array.isArray(v) && v.length <= 100 && v.every(x => typeof x === 'string'))))
            throw fail(400, 'invalid_media');
        if (!key.startsWith('properties/') && !key.startsWith('media/') && key !== 'pricing/basePrice' && typeof v !== 'string')
            throw fail(400, 'invalid_content');
        out[key] = v;
    }
    return out;
}
export class SiteContentManagementService {
    store;
    constructor(store) {
        this.store = store;
    }
    async access(req) {
        const type = String(req.params.type), id = String(req.params.id);
        if (!isAssetType(type) || !/^[a-zA-Z0-9_-]{1,80}$/.test(id))
            throw fail(400, 'invalid_asset_scope');
        const token = /^Bearer\s+(.+)$/i.exec(String(req.headers.authorization || ''))?.[1];
        if (!token)
            throw fail(401, 'authentication_required');
        let user;
        try {
            user = await this.store.auth.verifyIdToken(token);
        }
        catch {
            throw fail(401, 'invalid_authentication');
        }
        const profile = (await this.store.db.ref(`backendusers/${user.uid}`).once('value')).val() || {};
        const asset = (await this.store.db.ref(`assets/${type}/${id}`).once('value')).val();
        const admin = platformAdministrator(user, profile);
        if (!asset || asset.deletedAt)
            throw fail(404, 'asset_not_found');
        if (!admin && !await hasAssetPermission(this.store, user.uid, type, id, 'content'))
            throw fail(403, 'asset_management_required');
        return { type, id, user, admin, asset };
    }
    get = async (req, res) => {
        const { type, id, asset } = await this.access(req);
        const [site, pricing, outings, fleet] = await Promise.all(['siteContent', 'bnPricingModel', 'bnOutings', 'bnFleet'].map(root => this.store.db.ref(`${root}/${type}/${id}`).once('value')));
        res.setHeader('Cache-Control', 'no-store');
        return res.json({ asset, revision: listingRevision(asset), siteContent: site.val() || {}, pricing: pricing.val(), outings: outings.val() || {}, fleet: fleet.val() });
    };
    save = async (req, res) => {
        const { type, id, user, admin } = await this.access(req), body = req.body;
        if (!body || !safeTree({ ...body, asset: null }) || JSON.stringify(body).length > 1000000 || Object.keys(body).some(k => !['asset', 'siteContent', 'pricing', 'outings', 'photo', 'expectedRevision'].includes(k)))
            throw fail(400, 'invalid_content');
        if (body.expectedRevision !== undefined && !/^[a-f0-9]{64}$/.test(String(body.expectedRevision)))
            throw fail(400, 'invalid_revision');
        if (body.outings || Object.values(body.siteContent || {}).some(c => c && ('outings' in c || 'outingsPage' in c)))
            throw fail(400, 'listing_outings_removed');
        const assetUpdates = body.asset ? cmsAssetUpdates(body.asset) : {};
        const photo = body.photo ? photoUpdate(body.photo, type, id) : undefined;
        if (type !== 'boat' && (body.siteContent || body.pricing || body.outings))
            throw fail(400, 'invalid_content_scope');
        if (body.siteContent)
            for (const [lang, content] of Object.entries(body.siteContent))
                if (!languages.includes(lang) || !content || Object.keys(content).some(k => !sections.includes(k)))
                    throw fail(400, 'invalid_content_section');
        const numericPricing = new Set(['day', 'halfDay', 'sunset', 'evening', 'skipperPrice', 'cleaningPrice', 'nominalGuests', 'minGuests', 'maxGuests', 'extraGuestPrice']);
        if (body.pricing && (Array.isArray(body.pricing) || typeof body.pricing !== 'object' || Object.entries(body.pricing).some(([key, v]) => numericPricing.has(key) && (typeof v !== 'number' || !Number.isFinite(v) || v < 0))))
            throw fail(400, 'invalid_price');
        if (body.outings && Object.keys(body.outings).some(k => !/^[a-zA-Z0-9_-]{1,80}$/.test(k)))
            throw fail(400, 'invalid_outing');
        const now = new Date().toISOString(), auditId = randomUUID();
        let error = 'asset_changed_reload_required';
        await this.store.db.ref().once('value');
        const result = await this.store.db.ref().transaction((root) => {
            if (root === null)
                return null;
            const asset = root.assets?.[type]?.[id];
            if (!asset || asset.deletedAt || !assetPermission(root, user.uid, type, id, 'content', user)) {
                error = 'asset_management_required';
                return;
            }
            if (body.expectedRevision !== undefined && listingRevision(asset) !== body.expectedRevision)
                return;
            for (const [key, v] of Object.entries(assetUpdates))
                setPath(asset, key, v);
            if (['property', 'pool', 'parking'].includes(type) && (!String(asset.location?.city || '').trim() || !String(asset.location?.country || '').trim())) {
                error = 'location_required';
                return;
            }
            if (body.siteContent) {
                root.siteContent ??= {};
                root.siteContent[type] ??= {};
                root.siteContent[type][id] ??= {};
                for (const [l, c] of Object.entries(body.siteContent))
                    root.siteContent[type][id][l] = { ...(root.siteContent[type][id][l] || {}), ...c };
                const lang = body.siteContent.fr || Object.values(body.siteContent)[0], hero = lang?.boatHeroImage;
                const brand = body.siteContent.fr?.brand;
                const name = typeof brand === 'string' ? brand : brand?.name;
                if (typeof name === 'string' && name.trim() && name.length <= 240) {
                    asset.name = name.trim();
                    root.bnFleet ??= {};
                    root.bnFleet[type] ??= {};
                    root.bnFleet[type][id] = { ...(root.bnFleet[type][id] || {}), boatId: id, ownerId: asset.ownerId, boatName: asset.name };
                }
                if (hero) {
                    asset.media ??= {};
                    asset.media.hero = hero;
                    asset.media.cover = hero;
                    root.resources ??= {};
                    root.resources[type] ??= {};
                    root.resources[type][id] = { ...(root.resources[type][id] || {}), coverImage: hero };
                }
                // CMS edits are part of the moderated listing. This leaves older revisions valid until their first CMS edit.
                asset.siteContentRevision = createHash('sha256').update(JSON.stringify(root.siteContent[type][id])).digest('hex');
            }
            if (body.pricing) {
                root.bnPricingModel ??= {};
                root.bnPricingModel[type] ??= {};
                root.bnPricingModel[type][id] = { ...(root.bnPricingModel[type][id] || {}), ...body.pricing };
            }
            if (body.outings) {
                root.bnOutings ??= {};
                root.bnOutings[type] ??= {};
                const previous = root.bnOutings[type][id] || {};
                for (const [slug, o] of Object.entries(body.outings))
                    previous[slug] = { ...(previous[slug] || {}), ...o, ownerId: asset.ownerId, boatId: id };
                root.bnOutings[type][id] = previous;
            }
            if (photo) {
                persistPhoto(root, type, id, photo);
                if (type === 'boat')
                    asset.siteContentRevision = createHash('sha256').update(JSON.stringify(root.siteContent?.boat?.[id] || {})).digest('hex');
            }
            if (type === 'boat' && (body.siteContent || body.pricing || body.outings || photo))
                asset.siteContentRevision = createHash('sha256').update(JSON.stringify({ site: root.siteContent?.boat?.[id] || {}, pricing: root.bnPricingModel?.boat?.[id] || {}, outings: root.bnOutings?.boat?.[id] || {} })).digest('hex');
            root.listingModeration ??= {};
            root.listingModeration[type] ??= {};
            root.listingModeration[type][id] = { status: 'pending', revision: listingRevision(asset), requestedAt: now, requestedBy: user.uid };
            asset.updatedAt = now;
            root.managementAudit ??= {};
            root.managementAudit[auditId] = { actorId: user.uid, ownerId: asset.ownerId, assetType: type, assetId: id, action: 'content.save', at: now };
            return root;
        }, undefined, false);
        if (!result.committed)
            throw fail(409, error);
        res.setHeader('Cache-Control', 'no-store');
        return res.json({ ok: true, revision: listingRevision(result.snapshot.val()?.assets?.[type]?.[id]), moderation: 'pending', ...(photo ? { photo, media: result.snapshot.val()?.assets?.[type]?.[id]?.media } : {}) });
    };
}

//# sourceMappingURL=site-content-management.service.js.map
