import { createHash } from 'node:crypto';
export const LEGAL_LANGUAGES = ['fr', 'en', 'es', 'it', 'de', 'nl', 'ru'];
export const LEGAL_ROLES = ['customer', 'assetOwner', 'concierge'];
export const legalFileHash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const canonical = (v) => Array.isArray(v) ? v.map(canonical) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])])) : v;
export const legalHash = (value) => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
export function legalReference(d) { return legalHash({ title: d?.title || '', version: d?.version || '', text: d?.text || '', attachment: d?.attachment || null }); }
export function managedLegalPublished(release) { return release?.status === 'published' && release.publication?.method === 'admin-ui' && typeof release.publication.by === 'string' && release.publication.contentHash === legalHash(release.documents); }
export function legalPublicationProblems(release) { const errors = []; for (const role of LEGAL_ROLES) {
    const fr = release?.documents?.[role]?.fr, reference = legalReference(fr);
    for (const language of LEGAL_LANGUAGES) {
        const d = release?.documents?.[role]?.[language];
        if (!d || d.id !== role || d.language !== language || typeof d.title !== 'string' || !d.title.trim() || typeof d.version !== 'string' || !d.version.trim() || typeof d.text !== 'string' || d.text.trim().length < 20 || d.reviewedReference !== reference)
            errors.push(role + '/' + language);
    }
} return errors; }
export function legalReleasePublished(release) { return managedLegalPublished(release) || (release?.status === 'published' && process.env.LEGAL_TERMS_PUBLISHED === 'true'); }

//# sourceMappingURL=legal-publication.js.map
