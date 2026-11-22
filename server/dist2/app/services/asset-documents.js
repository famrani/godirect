import { createHash } from 'node:crypto';
export const DOCUMENT_TYPES = ['boat', 'car', 'property', 'parking', 'pool'];
export function scope(type, id) { if (!DOCUMENT_TYPES.includes(type) || !/^[a-zA-Z0-9_-]{1,160}$/.test(id))
    throw Object.assign(Error('invalid_asset'), { status: 400 }); }
export function today() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
export function validDate(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s + 'T12:00:00Z')) && new Date(s + 'T12:00:00Z').toISOString().slice(0, 10) === s; }
export function fileKind(b) { if (b.subarray(0, 5).toString() === '%PDF-')
    return { ext: 'pdf', mime: 'application/pdf' }; if (b[0] === 255 && b[1] === 216 && b[2] === 255)
    return { ext: 'jpg', mime: 'image/jpeg' }; if (b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    return { ext: 'png', mime: 'image/png' }; return null; }
export function legacyDocumentName(owner, type, id, doc, ext) { scope(type, id); if (!/^[a-f0-9-]{36}$/.test(doc) || !['pdf', 'jpg', 'png'].includes(ext))
    throw Error('invalid_document_path'); return `private/asset-documents/${createHash('sha256').update(owner).digest('hex')}/${type}/${id}/${doc}.${ext}`; }
export const DOCUMENT_BUCKET = 'ailla-poc.appspot.com';
export const DOCUMENT_FOLDERS = { boat: 'boats', car: 'cars', property: 'lodging', parking: 'parkings', pool: 'pools' };
export function objectName(_owner, type, id, doc, ext) { scope(type, id); if (!/^[a-f0-9-]{36}$/.test(doc) || !['pdf', 'jpg', 'png'].includes(ext))
    throw Error('invalid_document_path'); return `assets/${DOCUMENT_FOLDERS[type]}/${id}/documents/${doc}.${ext}`; }
export function catalogOK(c, type) { return c?.version && Array.isArray(c?.types?.[type]) && c.types[type].length > 0 && c.types[type].every((r) => /^[a-zA-Z0-9_-]+$/.test(r.id) && ['required', 'conditional', 'recommended'].includes(r.policy) && typeof r.expiryRequired === 'boolean'); }
export function checklist(c, type, owner, dossier, date = today()) {
    if (!catalogOK(c, type))
        throw Object.assign(Error('document_policy_missing'), { status: 503 });
    return c.types[type].map((r) => { const files = Object.values(dossier?.files || {}).filter(d => d.ownerId === owner && d.requirementId === r.id && (d.status !== 'removed' || d.purgePending === true)); const valid = (d) => d.policyVersion === c.version && (!d.expiresOn || d.expiresOn >= date) && (!r.expiryRequired || validDate(d.expiresOn)); const w = dossier?.waivers?.[r.id]; const waived = r.policy === 'conditional' && w?.ownerId === owner && w.status === 'approved' && w.policyVersion === c.version && (!w.expiresOn || w.expiresOn >= date); const approved = files.some(d => d.status === 'approved' && valid(d)); return { ...r, files, waiver: w?.ownerId === owner ? w : null, status: approved ? 'approved' : waived ? 'waived' : files.some(d => d.status === 'approved') ? 'expired' : files.some(d => d.status === 'pending') ? 'pending' : files.length ? 'rejected' : 'missing', complete: approved || waived || r.policy === 'recommended' }; });
}
export function documentFingerprint(d) { const files = Object.values(d?.files || {}).filter(f => f.status !== 'removed').map(f => [f.id, f.ownerId, f.requirementId, f.revision, f.status, f.expiresOn || '', f.policyVersion, f.sha256 || '']).sort((a, b) => String(a[0]).localeCompare(String(b[0]))); const waivers = Object.entries(d?.waivers || {}).map(([id, w]) => [id, w.ownerId, w.revision, w.status, w.expiresOn || '', w.policyVersion, w.reason || '']).sort((a, b) => String(a[0]).localeCompare(String(b[0]))); return createHash('sha256').update(JSON.stringify({ files, waivers, adminExemption: d?.adminExemption || null })).digest('hex'); }
export function documentSummary(c, type, owner, d) { try {
    const rows = checklist(c, type, owner, d), complete = rows.every((r) => r.complete), review = d?.review?.ownerId === owner ? d.review : null, fingerprint = documentFingerprint(d);
    const readProof = rows.every((r) => r.files.every((f) => f.status !== 'approved' || (f.reviewConfirmed === true && !!d?.reads?.[f.id]?.[f.reviewedBy]?.[f.revision - 1])));
    const exemption = d?.adminExemption;
    const exempted = exemption?.active === true && exemption.ownerId === owner && exemption.policyVersion === c.version && typeof exemption.reason === 'string' && exemption.reason.trim().length >= 10 && typeof exemption.grantedBy === 'string' && (!exemption.expiresOn || exemption.expiresOn >= today());
    const approved = exempted || (complete && readProof && review?.status === 'approved' && review.policyVersion === c.version && review.fingerprint === fingerprint);
    const provided = rows.every((r) => r.policy === 'recommended' || r.files.some((f) => ['pending', 'approved'].includes(f.status) && (!r.expiryRequired || validDate(f.expiresOn)) && (!f.expiresOn || f.expiresOn >= today())) || (r.policy === 'conditional' && r.waiver && ['pending', 'approved'].includes(r.waiver.status) && (!r.waiver.expiresOn || r.waiver.expiresOn >= today())));
    return { approved, complete, provided, fingerprint, exempted, adminExemption: exemption?.ownerId === owner ? exemption : null, status: exempted ? 'exempted' : approved ? 'validated' : rows.some((r) => r.status === 'expired') ? 'expiredDossier' : review?.status === 'rejected' ? 'refused' : review?.submittedAt ? 'pendingReview' : 'draft', reason: review?.reason || '', submittedAt: review?.submittedAt || null, total: rows.filter((r) => r.policy !== 'recommended').length, validated: rows.filter((r) => r.policy !== 'recommended' && r.complete).length, pendingWaivers: rows.filter((r) => r.waiver?.status === 'pending').length, pendingFiles: rows.reduce((n, r) => n + r.files.filter((f) => f.status === 'pending').length, 0) };
}
catch {
    return { approved: false, complete: false, provided: false, fingerprint: documentFingerprint(d), status: 'incomplete', reason: '', submittedAt: null, total: 0, validated: 0, pendingFiles: 0 };
} }
export async function assetDocumentStatus(store, type, id, owner) { const [c, d] = await Promise.all([store.db.ref('publicContent/documentRequirements').once('value'), store.db.ref(`assetDocuments/${type}/${id}`).once('value')]); return documentSummary(c.val(), type, owner, d.val()); }
export async function documentsPermitPublication(store, type, id, owner) { return (await assetDocumentStatus(store, type, id, owner)).approved; }

//# sourceMappingURL=asset-documents.js.map
