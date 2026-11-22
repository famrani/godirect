import { encryptDocument, decryptDocument } from './document-encryption.js';
import { DEFAULT_DOCUMENT_CATALOG, DOCUMENT_WORKFLOW_LABELS, LEGACY_DOCUMENT_TITLES } from './asset-document-catalog.js';
import { Storage } from '@google-cloud/storage';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { randomUUID, createHash } from 'node:crypto';
import { platformManagement } from './asset-delegation.js';
import { scope, today, validDate, fileKind, objectName, legacyDocumentName, DOCUMENT_BUCKET, DOCUMENT_TYPES, catalogOK, checklist, documentSummary, documentFingerprint } from './asset-documents.js';
const fail = (code, status = 400) => Object.assign(Error(code), { status });
/** Express 4/5 parameters are runtime-checked; arrays must never become paths or keys. */
export function documentRouteParam(req, name) { const value = req.params[name]; if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{1,160}$/.test(value) || ['__proto__', 'prototype', 'constructor'].includes(value))
    throw fail('invalid_document_parameter'); return value; }
export class AssetDocumentsService {
    store;
    storage = new Storage({ keyFilename: process.env.GCS_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT || undefined });
    upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 3, parts: 4 } }).single('file');
    constructor(store) {
        this.store = store;
    }
    async init() { await this.store.db.ref('publicContent/documentRequirements').transaction((old) => { if (!old)
        return DEFAULT_DOCUMENT_CATALOG; old.labels ??= {}; for (const [lang, copy] of Object.entries(DOCUMENT_WORKFLOW_LABELS)) {
        old.labels[lang] ??= {};
        for (const [key, value] of Object.entries(copy))
            if (old.labels[lang][key] === undefined || (key === 'title' && old.labels[lang][key] === LEGACY_DOCUMENT_TITLES[lang]))
                old.labels[lang][key] = value;
    } return old; }); for (const [lang, copy] of Object.entries(DOCUMENT_WORKFLOW_LABELS)) {
        await this.store.db.ref('uiTranslations/' + lang + '/ui/documents').transaction((old) => ({ ...copy, ...(old || {}) }));
    } }
    async administrator(req) { const token = /^Bearer (.+)$/.exec(req.headers.authorization || '')?.[1]; if (!token)
        throw fail('unauthorized', 401); let u; try {
        u = await this.store.auth.verifyIdToken(token, true);
    }
    catch {
        throw fail('unauthorized', 401);
    } const p = (await this.store.db.ref('backendusers/' + u.uid).once('value')).val(); if (!platformManagement({ backendusers: { [u.uid]: p } }, u.uid, u))
        throw fail('forbidden', 403); return u; }
    async context(req) { const type = documentRouteParam(req, 'type'), id = documentRouteParam(req, 'id'); scope(type, id); const token = /^Bearer (.+)$/.exec(req.headers.authorization || '')?.[1]; if (!token)
        throw fail('unauthorized', 401); let user; try {
        user = await this.store.auth.verifyIdToken(token, true);
    }
    catch {
        throw fail('unauthorized', 401);
    } const [a, p] = await Promise.all([this.store.db.ref(`assets/${type}/${id}`).once('value'), this.store.db.ref(`backendusers/${user.uid}`).once('value')]); const asset = a.val(), admin = platformManagement({ backendusers: { [user.uid]: p.val() } }, user.uid, user); if (!asset)
        throw fail('asset_not_found', 404); if (!admin && asset.ownerId !== user.uid)
        throw fail('forbidden', 403); return { type, id, user, asset, admin, action: 'update', policyVersion: '' }; }
    async checkedBucket(name, requirePrivate = false) { const bucket = this.storage.bucket(name); const [m] = await bucket.getMetadata(); if (requirePrivate && m.iamConfiguration?.publicAccessPrevention !== 'enforced')
        throw fail('private_document_bucket_required', 503); return { bucket, uniform: m.iamConfiguration?.uniformBucketLevelAccess?.enabled === true }; }
    async bucket(requirePrivate = false) { const name = process.env.GCS_BUCKET || process.env.GCS_MEDIA_BUCKET || DOCUMENT_BUCKET; if (name !== DOCUMENT_BUCKET)
        throw fail('document_bucket_mismatch', 503); return this.checkedBucket(name, requirePrivate); }
    async storedObject(ctx, d, forDelete = false) {
        if (d.storageLayout === 'asset-documents-v3' && d.encryption?.format === 'GDDOC01' && d.bucket === DOCUMENT_BUCKET && d.objectPath === objectName(ctx.asset.ownerId, ctx.type, ctx.id, d.id, d.ext) + '.enc') {
            const { bucket } = await this.bucket();
            return bucket.file(d.objectPath);
        }
        if (d.storageLayout === 'asset-documents-v2' && d.bucket === DOCUMENT_BUCKET && d.objectPath === objectName(ctx.asset.ownerId, ctx.type, ctx.id, d.id, d.ext)) {
            const { bucket } = await this.bucket(!forDelete);
            return bucket.file(d.objectPath);
        }
        const legacy = process.env.GCS_DOCUMENTS_BUCKET;
        if (!d.storageLayout && legacy && legacy !== DOCUMENT_BUCKET && d.objectPath === legacyDocumentName(ctx.asset.ownerId, ctx.type, ctx.id, d.id, d.ext)) {
            const { bucket } = await this.checkedBucket(legacy, !forDelete);
            return bucket.file(d.objectPath);
        }
        throw fail('document_storage_location_unavailable', 503);
    }
    async policy(type) { const c = (await this.store.db.ref('publicContent/documentRequirements').once('value')).val(); if (!catalogOK(c, type))
        throw fail('document_policy_missing', 503); return c; }
    async mutate(ctx, fn) { const { type, id, user, asset } = ctx; const auditId = randomUUID(); const ref = this.store.db.ref(); await ref.once('value'); const result = await ref.transaction(root => { if (root === null)
        return null; const current = root.assets?.[type]?.[id]; const admin = platformManagement(root, user.uid, user); if (ctx.requireAdmin && !admin)
        return; if (ctx.policyVersion && root.publicContent?.documentRequirements?.version !== ctx.policyVersion)
        return; if (!current || current.ownerId !== asset.ownerId || current.deletedAt || (!admin && current.ownerId !== user.uid))
        return; root.assetDocuments ??= {}; root.assetDocuments[type] ??= {}; const d = root.assetDocuments[type][id] ??= { files: {}, waivers: {} }; d.files ??= {}; d.waivers ??= {}; fn(d); root.assetDocumentAudit ??= {}; root.assetDocumentAudit[auditId] = { assetType: type, assetId: id, actor: user.uid, at: new Date().toISOString(), action: String(ctx.action || 'update') }; return root; }, undefined, false); if (!result.committed || !result.snapshot.val()?.assetDocumentAudit?.[auditId])
        throw fail('document_context_changed', 409); }
    setRoutes(router) {
        const base = '/api/manage/assets/:type/:id/documents';
        const wrap = (f) => (req, res, next) => Promise.resolve(f(req, res)).catch(next);
        router.get('/api/platform/admin/documents', wrap(async (req, res) => { await this.administrator(req); const [assets, docs, profiles, catalog] = await Promise.all(['assets', 'assetDocuments', 'backendusers', 'publicContent/documentRequirements'].map(p => this.store.db.ref(p).once('value'))); const c = catalog.val(), all = assets.val() || {}, d = docs.val() || {}, people = profiles.val() || {}, rows = []; for (const type of DOCUMENT_TYPES)
            for (const [id, a] of Object.entries(all[type] || {})) {
                if (a.deletedAt)
                    continue;
                rows.push({ id, assetType: type, name: String(a.name || id), ownerName: String(people[a.ownerId]?.displayName || people[a.ownerId]?.email || a.ownerId), ...documentSummary(c, type, a.ownerId, d[type]?.[id]) });
            } const language = String(req.query.language || 'fr'); res.set('Cache-Control', 'private, no-store').json({ rows, labels: c?.labels?.[language] || c?.labels?.fr || {} }); }));
        router.get(base, wrap(async (req, res) => { const ctx = await this.context(req), c = await this.policy(ctx.type), d = (await this.store.db.ref(`assetDocuments/${ctx.type}/${ctx.id}`).once('value')).val(); const lang = String(req.query.language || 'fr'); const rows = checklist(c, ctx.type, ctx.asset.ownerId, d).map((r) => ({ ...r, title: r.title?.[lang] || r.title?.fr, files: r.files.map(({ objectPath, sha256, bucket, encryption, storedSize, ...v }) => ({ ...v, readForReview: ctx.admin && !!d?.reads?.[v.id]?.[ctx.user.uid]?.[v.revision] })) })); res.set('Cache-Control', 'private, no-store').json({ assetName: ctx.asset.name, canReview: ctx.admin, canUpload: ctx.user.uid === ctx.asset.ownerId, summary: documentSummary(c, ctx.type, ctx.asset.ownerId, d), readOnly: !!ctx.asset.deletedAt, labels: c.labels?.[lang] || c.labels?.fr, requirements: rows, complete: rows.every((r) => r.complete) }); }));
        router.post(base, rateLimit({ windowMs: 60000, max: 20 }), wrap(async (req, res) => { const ctx = await this.context(req); if (ctx.user.uid !== ctx.asset.ownerId)
            throw fail('owner_upload_required', 403); if (ctx.asset.deletedAt)
            throw fail('asset_archived', 409); await new Promise((resolve, reject) => this.upload(req, res, e => e ? reject(fail('invalid_document_upload')) : resolve())); const c = await this.policy(ctx.type), r = c.types[ctx.type].find((r) => r.id === req.body.requirementId), file = req.file, kind = file && fileKind(file.buffer), expiresOn = String(req.body.expiresOn || ''); if (!r || !file || !kind || file.mimetype !== kind.mime)
            throw fail('invalid_document_upload'); if ((r.expiryRequired && !expiresOn) || (expiresOn && (!validDate(expiresOn) || expiresOn < today())))
            throw fail('invalid_expiry'); const { bucket, uniform } = await this.bucket(), id = randomUUID(), path = objectName(ctx.asset.ownerId, ctx.type, ctx.id, id, kind.ext) + '.enc', object = bucket.file(path), encrypted = encryptDocument(file.buffer, `${DOCUMENT_BUCKET}/${path}\n${ctx.asset.ownerId}`); await object.save(encrypted.bytes, { resumable: false, contentType: 'application/octet-stream', preconditionOpts: { ifGenerationMatch: 0 }, ...(!uniform ? { predefinedAcl: 'private' } : {}), metadata: { cacheControl: 'private, no-store' } }); try {
            ctx.policyVersion = c.version;
            ctx.action = 'upload';
            await this.mutate(ctx, d => { if (Object.values(d.files).filter(f => f.status !== 'removed').length >= 100)
                throw fail('document_limit'); d.files[id] = { id, ownerId: ctx.asset.ownerId, requirementId: r.id, filename: file.originalname.replace(/[\r\n\x00/\\]/g, '_').slice(0, 160), objectPath: path, bucket: DOCUMENT_BUCKET, storageLayout: 'asset-documents-v3', encryption: { format: 'GDDOC01', keyId: encrypted.keyId }, storedSize: encrypted.bytes.length, ext: kind.ext, contentType: kind.mime, size: file.size, sha256: createHash('sha256').update(file.buffer).digest('hex'), status: 'pending', revision: 1, policyVersion: c.version, expiresOn, createdAt: new Date().toISOString(), uploadedBy: ctx.user.uid }; });
        }
        catch (e) {
            await object.delete({ ignoreNotFound: true }).catch(() => { });
            throw e;
        } res.status(201).json({ id, status: 'pending' }); }));
        router.get(base + '/:documentId/download', wrap(async (req, res) => { const ctx = await this.context(req), id = documentRouteParam(req, 'documentId'); if (!/^[a-f0-9-]{36}$/.test(id))
            throw fail('invalid_document'); const d = (await this.store.db.ref(`assetDocuments/${ctx.type}/${ctx.id}/files/${id}`).once('value')).val(); if (!d || d.ownerId !== ctx.asset.ownerId || d.status === 'removed')
            throw fail('document_not_found', 404); const object = await this.storedObject(ctx, d); const [metadata] = await object.getMetadata(); if (Number(metadata.size) > 10 * 1024 * 1024 + 44)
            throw fail('document_changed', 409); const [stored] = await object.download(); const bytes = d.storageLayout === 'asset-documents-v3' ? decryptDocument(stored, `${DOCUMENT_BUCKET}/${d.objectPath}\n${ctx.asset.ownerId}`) : stored; if (bytes.length !== d.size || createHash('sha256').update(bytes).digest('hex') !== d.sha256)
            throw fail('document_changed', 409); if (ctx.admin && !ctx.asset.deletedAt) {
            ctx.action = 'document_opened';
            await this.mutate(ctx, state => { const current = state.files?.[id]; if (!current || current.revision !== d.revision || current.status === 'removed')
                throw fail('document_changed', 409); state.reads ??= {}; state.reads[id] ??= {}; state.reads[id][ctx.user.uid] ??= {}; state.reads[id][ctx.user.uid][d.revision] = { at: new Date().toISOString() }; });
        } res.set({ 'Content-Type': d.contentType, 'Content-Disposition': `attachment; filename="document-${id}.${d.ext}"`, 'Cache-Control': 'private, no-store', 'Pragma': 'no-cache', 'X-Content-Type-Options': 'nosniff' }).send(bytes); }));
        router.post(base + '/waivers/:requirementId', wrap(async (req, res) => { const ctx = await this.context(req); if (ctx.user.uid !== ctx.asset.ownerId)
            throw fail('owner_upload_required', 403); const c = await this.policy(ctx.type), r = c.types[ctx.type].find((r) => r.id === documentRouteParam(req, 'requirementId')), reason = String(req.body.reason || '').trim(); if (r?.policy !== 'conditional' || reason.length < 10 || reason.length > 2000)
            throw fail('invalid_waiver'); ctx.policyVersion = c.version; ctx.action = 'waiver_requested'; await this.mutate(ctx, d => { const old = d.waivers[r.id]; d.waivers[r.id] = { ownerId: ctx.asset.ownerId, reason, status: 'pending', revision: (old?.revision || 0) + 1, policyVersion: c.version, createdAt: new Date().toISOString() }; }); res.json({ ok: true }); }));
        router.post(base + '/:kind/:documentId/review', wrap(async (req, res) => { const ctx = await this.context(req); if (!ctx.admin)
            throw fail('forbidden', 403); const c = await this.policy(ctx.type), kind = documentRouteParam(req, 'kind'); if (!['files', 'waivers'].includes(kind))
            throw fail('invalid_document'); const status = req.body.status, reason = String(req.body.reason || '').trim(), expiresOn = String(req.body.expiresOn || ''); if (!['approved', 'rejected'].includes(status) || reason.length > 2000 || (status === 'rejected' && reason.length < 10) || (expiresOn && (!validDate(expiresOn) || expiresOn < today())))
            throw fail('invalid_review'); ctx.policyVersion = c.version; ctx.action = 'review_' + status; await this.mutate(ctx, d => { const f = d[kind]?.[documentRouteParam(req, 'documentId')], r = c.types[ctx.type].find((r) => r.id === f?.requirementId || kind === 'waivers' && r.id === documentRouteParam(req, 'documentId')); if (!f || f.status === 'removed' || f.ownerId !== ctx.asset.ownerId || f.revision !== req.body.revision || !r || (kind === 'waivers' && r.policy !== 'conditional'))
            throw fail('document_changed', 409); if (status === 'approved' && kind === 'files' && req.body.readConfirmed !== true)
            throw fail('document_review_confirmation_required'); if (status === 'approved' && kind === 'files' && !d.reads?.[f.id]?.[ctx.user.uid]?.[f.revision])
            throw fail('document_read_required', 409); if (status === 'approved' && kind === 'files' && ((r.expiryRequired && !validDate(f.expiresOn)) || (f.expiresOn && f.expiresOn < today())))
            throw fail('invalid_expiry'); Object.assign(f, { status, reviewReason: reason, reviewConfirmed: kind === 'files' && status === 'approved', reviewedBy: ctx.user.uid, reviewedAt: new Date().toISOString(), revision: f.revision + 1, policyVersion: c.version }); if (kind === 'waivers')
            f.expiresOn = expiresOn; }); res.json({ ok: true }); }));
        router.post(base + '/admin-exemption', wrap(async (req, res) => {
            const ctx = await this.context(req);
            if (!ctx.admin)
                throw fail('forbidden', 403);
            if (ctx.asset.deletedAt)
                throw fail('asset_archived', 409);
            const c = await this.policy(ctx.type), active = req.body.active, reason = String(req.body.reason || '').trim(), expiresOn = String(req.body.expiresOn || '');
            if (typeof active !== 'boolean' || reason.length < 10 || reason.length > 2000 || (expiresOn && (!validDate(expiresOn) || expiresOn < today())))
                throw fail('invalid_exemption');
            Object.assign(ctx, { policyVersion: c.version, requireAdmin: true, action: active ? 'admin_exemption_granted' : 'admin_exemption_revoked' });
            await this.mutate(ctx, d => { if (req.body.fingerprint !== documentFingerprint(d))
                throw fail('document_changed', 409); d.adminExemption = { ownerId: ctx.asset.ownerId, active, reason, expiresOn: active ? expiresOn : '', policyVersion: c.version, grantedBy: ctx.user.uid, grantedAt: new Date().toISOString() }; d.adminExemptionHistory ??= {}; d.adminExemptionHistory[randomUUID()] = { ...d.adminExemption }; });
            res.json({ ok: true });
        }));
        router.post(base + '/submit', wrap(async (req, res) => { const ctx = await this.context(req); if (ctx.user.uid !== ctx.asset.ownerId)
            throw fail('owner_upload_required', 403); const c = await this.policy(ctx.type); ctx.action = 'dossier_submitted'; ctx.policyVersion = c.version; await this.mutate(ctx, d => { if (!documentSummary(c, ctx.type, ctx.asset.ownerId, d).provided)
            throw fail('document_dossier_incomplete', 409); d.review = { ownerId: ctx.asset.ownerId, status: 'pending', submittedAt: new Date().toISOString(), submittedBy: ctx.user.uid, policyVersion: c.version, reason: '' }; }); res.json({ ok: true }); }));
        router.post(base + '/decision', wrap(async (req, res) => { const ctx = await this.context(req); if (!ctx.admin)
            throw fail('forbidden', 403); const c = await this.policy(ctx.type), status = req.body.status, reason = String(req.body.reason || '').trim(); if (!['approved', 'rejected'].includes(status) || reason.length > 2000 || (status === 'rejected' && reason.length < 10))
            throw fail('invalid_review'); ctx.policyVersion = c.version; ctx.action = 'dossier_' + status; await this.mutate(ctx, d => { if (d.review?.ownerId !== ctx.asset.ownerId || !d.review?.submittedAt)
            throw fail('document_submit_required', 409); if (req.body.fingerprint !== documentFingerprint(d))
            throw fail('document_changed', 409); if (status === 'approved' && Object.values(d.files || {}).some(f => f.ownerId === ctx.asset.ownerId && f.status === 'approved' && (f.reviewConfirmed !== true || !d.reads?.[f.id]?.[f.reviewedBy]?.[f.revision - 1])))
            throw fail('document_read_required', 409); if (status === 'approved' && (!documentSummary(c, ctx.type, ctx.asset.ownerId, d).complete || documentSummary(c, ctx.type, ctx.asset.ownerId, d).pendingFiles > 0 || documentSummary(c, ctx.type, ctx.asset.ownerId, d).pendingWaivers > 0))
            throw fail('document_dossier_incomplete', 409); d.review = { ...d.review, status, reason, reviewedBy: ctx.user.uid, reviewedAt: new Date().toISOString(), policyVersion: c.version, fingerprint: documentFingerprint(d) }; }); res.json({ ok: true }); }));
        router.delete(base + '/:documentId', wrap(async (req, res) => { const ctx = await this.context(req), id = documentRouteParam(req, 'documentId'); let saved; ctx.action = 'remove'; await this.mutate(ctx, d => { const f = d.files[id]; if (!f || f.ownerId !== ctx.asset.ownerId || f.revision !== Number(req.query.revision))
            throw fail('document_changed', 409); saved = { ...f }; f.status = 'removed'; f.purgePending = true; f.revision++; f.removedAt = new Date().toISOString(); }); const object = await this.storedObject(ctx, saved, true); await object.delete({ ignoreNotFound: true }); await this.mutate(ctx, d => { const f = d.files[id]; if (f?.status === 'removed')
            f.purgePending = false; }); res.json({ ok: true }); }));
    }
}

//# sourceMappingURL=asset-documents.service.js.map
