import { createHash } from 'node:crypto';
function stable(v) { if (Array.isArray(v))
    return '[' + v.map(stable).join(',') + ']'; if (v && typeof v === 'object')
    return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}'; return JSON.stringify(v) ?? 'null'; }
export function listingRevision(a) { return createHash('sha256').update(stable(Object.fromEntries(['id', 'ownerId', 'assetType', 'name', 'headline', 'description', 'location', 'pricing', 'properties', 'paymentPolicy', 'media', 'translations'].concat(a?.siteContentRevision ? ['siteContentRevision'] : []).map(k => [k, a?.[k] ?? null])))).digest('hex'); }
export function moderationView(a, m) { const revision = listingRevision(a); return { status: a?.deletedAt ? 'archived' : m?.revision === revision && ['approved', 'rejected'].includes(m?.status) ? m.status : a?.published === true ? 'pending' : 'draft', revision, reason: m?.revision === revision ? String(m?.reason || '') : '', requestedAt: m?.requestedAt || a?.createdAt || null, reviewedAt: m?.reviewedAt || null }; }

//# sourceMappingURL=listing-moderation.js.map
