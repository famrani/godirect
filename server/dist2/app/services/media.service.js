import { hasAssetPermission } from './asset-delegation.js';
import { hostnameMatches } from './asset-domain.js';
import { outingMediaFolder } from './outing-media-folder.js';
import { MEDIA_ROUTES, mediaObjectUrl } from './media-routes.js';
import { gcsPhotoPath } from './gcs-photo-path.js';
import { platformAdministrator } from './account-access.service.js';
import rateLimit from 'express-rate-limit';
import { Storage } from '@google-cloud/storage';
import multer from 'multer';
/**
 * Proxies public website media from a private tenant folder. The browser only
 * knows logical paths such as `alegria/img/...`; bucket and tenant paths remain
 * trusted backend configuration. Credentials are resolved through Google ADC.
 */
export class MediaService {
    store;
    legacyBucketName = process.env.GCS_BUCKET || process.env.GCS_MEDIA_BUCKET || 'ailla-poc.appspot.com';
    legacyTenantRoot = String(process.env.GCS_MEDIA_TENANT_ROOT || 'tenants').replace(/^\/+|\/+$/g, '');
    legacyAllowedPrefix = process.env.GCS_MEDIA_PREFIX || 'alegria/img/';
    defaultTenantId = process.env.GCS_MEDIA_DEFAULT_TENANT || 'alegria';
    tenantCache;
    lifetimeMs = Math.max(15 * 60 * 1000, Number(process.env.GCS_SIGNED_URL_LIFETIME_MS || 6 * 60 * 60 * 1000));
    storage = new Storage({
        keyFilename: process.env.GCS_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT || undefined,
    });
    supportedResourceTypes = new Set(['boat', 'place', 'car', 'pool', 'parking', 'property']);
    upload = multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 12 * 1024 * 1024, files: 1 },
        fileFilter: (_req, file, callback) => {
            const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
            callback(null, allowed.includes(String(file.mimetype || '').toLowerCase()));
        },
    });
    constructor(store) {
        this.store = store;
    }
    setRoutes(router) {
        const limiter = rateLimit({
            windowMs: 60 * 1000,
            max: 60,
            standardHeaders: true,
            legacyHeaders: false,
            // Local development often reloads many images at once. Do not let those
            // requests exhaust the public media limiter. This bypass is deliberately
            // disabled in production so a forged Host header cannot disable limits.
            skip: (req) => {
                if (process.env.NODE_ENV === 'production')
                    return false;
                return this.isLocalHostname(this.getRequestHostname(req));
            },
        });
        router.post(MEDIA_ROUTES.urlsAlias, limiter, (req, res) => this.createMediaUrls(req, res));
        // Backward-compatible route for already deployed frontends. The returned
        // URLs now point to the authenticated backend proxy, not directly to GCS.
        router.post(MEDIA_ROUTES.urls, limiter, (req, res) => this.createMediaUrls(req, res));
        router.get(MEDIA_ROUTES.object, limiter, (req, res) => this.streamObject(req, res));
        router.post(MEDIA_ROUTES.upload, limiter, (req, res, next) => {
            this.upload.single('file')(req, res, (error) => {
                if (!error)
                    return next();
                const tooLarge = error?.code === 'LIMIT_FILE_SIZE';
                return res.status(tooLarge ? 413 : 400).json({
                    error: tooLarge ? 'image_too_large' : 'invalid_image_upload',
                    message: tooLarge ? 'La photo dépasse la limite de 12 Mo.' : error?.message,
                });
            });
        }, (req, res) => this.uploadObject(req, res));
    }
    async uploadObject(req, res) {
        try {
            const tenant = await this.resolveTenant(req);
            if (!tenant)
                return res.status(404).json({ error: 'storage_tenant_not_found' });
            const adminUser = await this.requireAdmin(req, tenant);
            if (!adminUser)
                return res.status(403).json({ error: 'admin_access_required' });
            const file = req.file;
            if (!file)
                return res.status(400).json({ error: 'image_file_required' });
            if (!this.validImage(file.buffer, file.mimetype))
                return res.status(400).json({ error: 'unsupported_image_type' });
            const category = this.destinationSegment(req.body?.category || 'content', 'category');
            const subject = this.destinationSegment(req.body?.subject || 'general', 'subject');
            const categoryFolders = {
                outings: 'events',
                boat: 'boat',
                gallery: 'gallery',
                content: 'content',
            };
            const folder = categoryFolders[category];
            if (!folder)
                return res.status(400).json({ error: 'invalid_media_category' });
            const extension = this.extensionFor(file.mimetype);
            if (!extension)
                return res.status(400).json({ error: 'unsupported_image_type' });
            const baseName = this.safeFileBase(file.originalname || 'photo');
            const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName}.${extension}`;
            // All new uploads live under assets/ in the GoDirect bucket.
            // Boats have boat, homepage and outings categories.
            // New frontends should send resourceType + resourceId. For the existing
            // Alegria frontend, resourceId falls back to boatId or the tenant id.
            // Accept both naming conventions:
            // - resourceType/resourceId: canonical backend API
            // - assetType/assetId: current resource-aware frontend CMS
            // Without these aliases, Big Boss / Sea Breeze uploads silently fell
            // back to tenant.id (alegria), so the CMS saved/read the wrong resource.
            const resourceType = this.safeResourceType(req.body?.resourceType || req.body?.assetType || 'boat');
            const resourceId = this.resourceIdentifier(req.body?.resourceId || req.body?.assetId || req.body?.boatId || tenant.id);
            const directories = { boat: 'boats', car: 'cars', property: 'lodging', place: 'lodging', parking: 'parkings', pool: 'pools' };
            const boatCategory = category === 'outings' ? 'outings' : category === 'content' ? 'homepage' : 'boat';
            const logicalPath = resourceType === 'boat'
                ? `assets/boats/${resourceId}/${boatCategory}/${category === 'outings' ? outingMediaFolder(subject) + '/' : ''}${uniqueName}`
                : `assets/${directories[resourceType]}/${resourceId}/${category}/${subject}/${uniqueName}`;
            if (!this.isAllowedPath(logicalPath, tenant)) {
                return res.status(400).json({ error: 'invalid_media_path' });
            }
            const object = this.storage
                .bucket('ailla-poc.appspot.com')
                .file(this.getPhysicalPath(tenant, logicalPath));
            await object.save(file.buffer, {
                resumable: false,
                contentType: file.mimetype,
                metadata: {
                    cacheControl: 'private, max-age=3600',
                    metadata: {
                        uploadedBy: adminUser.uid,
                        uploadedAt: String(Date.now()),
                        tenantId: tenant.id,
                        logicalPath,
                    },
                },
            });
            return res.status(201).json({
                ok: true,
                path: logicalPath,
                url: mediaObjectUrl(logicalPath),
                contentType: file.mimetype,
                size: file.size,
            });
        }
        catch (error) {
            console.error('Unable to upload private media object', error);
            const message = String(error?.message || error || '');
            if (message === 'missing_token' || message === 'invalid_token') {
                return res.status(401).json({ error: 'authentication_required' });
            }
            if (message === 'invalid_identifier') {
                return res.status(400).json({ error: 'invalid_media_destination', field: error?.field || 'identifier', message: 'La destination de la photo est invalide. Vérifiez le type et l’identifiant du bien.' });
            }
            return res.status(500).json({
                error: 'media_upload_failed',
                message: process.env.NODE_ENV === 'production' ? undefined : message,
            });
        }
    }
    async requireAdmin(req, tenant) {
        const header = String(req.headers.authorization || '');
        const match = /^Bearer\s+(.+)$/i.exec(header);
        if (!match)
            throw new Error('missing_token');
        let decoded;
        try {
            decoded = await this.store.auth.verifyIdToken(match[1]);
        }
        catch {
            throw new Error('invalid_token');
        }
        // A listing owner may upload only to their own canonical resource scope,
        // without being promoted to a global administrator or tenant operator.
        const type = this.safeResourceType(req.body?.resourceType || req.body?.assetType || 'boat');
        const id = String(req.body?.resourceId || req.body?.assetId || req.body?.boatId || '');
        if (['boat', 'car', 'property', 'parking', 'pool'].includes(type) && /^[a-zA-Z0-9_-]{1,80}$/.test(id)) {
            const asset = (await this.store.db.ref(`assets/${type}/${id}`).once('value')).val();
            if (asset && !asset.deletedAt && await hasAssetPermission(this.store, decoded.uid, type, id, 'content'))
                return { uid: decoded.uid, email: String(decoded.email || '') };
        }
        const snapshot = await this.store.db.ref(`/backendusers/${decoded.uid}`).once('value');
        const profile = snapshot.val() || {};
        const globalAdmin = platformAdministrator(decoded, profile);
        const email = String(decoded.email || profile.email || '').trim().toLowerCase();
        const verifiedEmail = decoded.email_verified === true ? email : '';
        const tenantAdmin = tenant.adminUids.includes(String(decoded.uid || ''))
            || (!!verifiedEmail && tenant.adminEmails.includes(verifiedEmail));
        // Asset ownership and platform administration are independent of tenant operators.
        // Verified platform administrators can manage all GoDirect assets.
        const allowed = tenantAdmin || globalAdmin;
        return allowed ? { uid: decoded.uid, email } : null;
    }
    resourceIdentifier(value) {
        const id = String(value || '');
        // Preserve the exact Firebase key, including uppercase. Never slugify an asset id.
        if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id))
            throw Object.assign(new Error('invalid_identifier'), { field: 'resourceId' });
        return id;
    }
    destinationSegment(value, field) {
        try {
            return this.safeSegment(value);
        }
        catch {
            throw Object.assign(new Error('invalid_identifier'), { field });
        }
    }
    safeSegment(value) {
        const segment = String(value || '').trim().toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 80);
        if (!segment || !/^[a-z0-9_-]+$/.test(segment))
            throw new Error('invalid_identifier');
        return segment;
    }
    safeResourceType(value) {
        const resourceType = this.destinationSegment(value, 'resourceType');
        if (!this.supportedResourceTypes.has(resourceType))
            throw Object.assign(new Error('invalid_identifier'), { field: 'resourceType' });
        return resourceType;
    }
    safeFileBase(originalName) {
        const withoutExtension = originalName.replace(/\.[^.]+$/, '');
        try {
            return this.safeSegment(withoutExtension || 'photo').slice(0, 60);
        }
        catch {
            return 'photo';
        }
    }
    validImage(buffer, mime) {
        if (!buffer || buffer.length < 12)
            return false;
        switch (mime) {
            case 'image/jpeg': return buffer.subarray(0, 3).equals(Buffer.from([255, 216, 255]));
            case 'image/png': return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
            case 'image/gif': return ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6));
            case 'image/webp': return buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
            case 'image/avif': return buffer.toString('ascii', 4, 8) === 'ftyp' && /avif|avis/.test(buffer.toString('ascii', 8, Math.min(buffer.length, 40)));
            default: return false;
        }
    }
    extensionFor(contentType) {
        const extensions = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/webp': 'webp',
            'image/gif': 'gif',
            'image/avif': 'avif',
        };
        return extensions[String(contentType || '').toLowerCase()] || null;
    }
    async createMediaUrls(req, res) {
        try {
            const tenant = await this.resolveTenant(req);
            if (!tenant)
                return res.status(404).json({ error: 'storage_tenant_not_found' });
            const requested = Array.isArray(req.body?.paths) ? req.body.paths : [];
            const paths = Array.from(new Set(requested.map((value) => String(value || '').trim())));
            if (!paths.length || paths.length > 200) {
                return res.status(400).json({ error: 'invalid_media_paths' });
            }
            for (const objectPath of paths) {
                if (!this.isAllowedPath(objectPath, tenant)) {
                    return res.status(400).json({ error: 'invalid_media_path', path: objectPath });
                }
            }
            const expiresAt = Date.now() + this.lifetimeMs;
            const entries = paths.map((objectPath) => [
                objectPath,
                mediaObjectUrl(objectPath),
            ]);
            const urls = entries.reduce((result, entry) => {
                result[entry[0]] = entry[1];
                return result;
            }, {});
            res.setHeader('Cache-Control', 'private, max-age=300');
            return res.status(200).json({ expiresAt, urls });
        }
        catch (error) {
            console.error('Unable to create media URLs', error);
            return res.status(500).json({
                error: 'media_url_creation_failed',
                message: process.env.NODE_ENV === 'production' ? undefined : error?.message || String(error),
            });
        }
    }
    async streamObject(req, res) {
        const objectPath = String(req.query?.path || '').trim();
        const tenant = await this.resolveTenant(req);
        if (!tenant) {
            res.status(404).json({ error: 'storage_tenant_not_found' });
            return;
        }
        if (!this.isAllowedPath(objectPath, tenant)) {
            res.status(400).json({ error: 'invalid_media_path' });
            return;
        }
        try {
            const file = this.storage
                .bucket('ailla-poc.appspot.com')
                .file(this.getPhysicalPath(tenant, objectPath));
            const [metadata] = await file.getMetadata();
            res.setHeader('Content-Type', metadata.contentType || 'application/octet-stream');
            if (metadata.size)
                res.setHeader('Content-Length', String(metadata.size));
            if (metadata.etag)
                res.setHeader('ETag', String(metadata.etag));
            // The bucket stays private, but website media returned by this endpoint
            // is public and can be cached by browsers/reverse proxies.
            res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
            file.createReadStream()
                .on('error', (error) => {
                console.error('Unable to stream private media object', error);
                if (!res.headersSent)
                    res.status(error?.code === 404 ? 404 : 500).end();
                else
                    res.end();
            })
                .pipe(res);
        }
        catch (error) {
            const physicalPath = this.getPhysicalPath(tenant, objectPath);
            console.error('====================================');
            console.error('[Media] GET /api/media/object FAILED');
            console.error('[Media] requested path:', objectPath);
            console.error('[Media] bucket:', 'ailla-poc.appspot.com');
            console.error('[Media] physical path:', physicalPath);
            console.error('[Media] error:', error);
            console.error('====================================');
            if (!res.headersSent) {
                res.status(error?.code === 404 ? 404 : 500).json({
                    error: error?.code === 404 ? 'media_not_found' : 'media_read_failed',
                    message: process.env.NODE_ENV === 'production'
                        ? undefined
                        : (error instanceof Error ? error.message : String(error)),
                });
            }
        }
    }
    getPhysicalPath(tenant, objectPath) {
        const path = gcsPhotoPath(objectPath);
        if (!path)
            throw new Error('invalid_media_path');
        return path;
    }
    isAllowedPath(objectPath, _tenant) {
        return gcsPhotoPath(objectPath) !== null;
    }
    async resolveTenant(req) {
        const values = await this.loadTenantConfigs();
        const hostname = this.getRequestHostname(req);
        let tenantId = Object.keys(values).find((id) => {
            const config = values[id];
            if (config?.enabled === false)
                return false;
            return this.asStringArray(config?.hostnames)
                .map((value) => this.normalizeHostname(value))
                .some(pattern => hostnameMatches(pattern, hostname));
        });
        // Local development and single-tenant reverse proxies can explicitly use
        // GCS_MEDIA_DEFAULT_TENANT. The physical root is still never accepted from
        // the browser.
        if (!tenantId && (this.isLocalHostname(hostname) || process.env.GCS_MEDIA_ALLOW_DEFAULT_TENANT === 'true')) {
            tenantId = values[this.defaultTenantId] ? this.defaultTenantId : undefined;
        }
        const config = tenantId ? values[tenantId] : undefined;
        if (!tenantId || !config || config.enabled === false)
            return null;
        // Keep tenant configuration keys to one safe segment even though the
        // tenant folder is already included in the logical mediaPrefix.
        if (!/^[a-z0-9][a-z0-9_-]{0,79}$/.test(tenantId)) {
            console.error('Invalid storage tenant ID', { tenantId });
            return null;
        }
        const bucket = 'ailla-poc.appspot.com';
        const root = 'assets';
        const mediaPrefix = 'assets/';
        if (!this.isSafeBucket(bucket) || !this.isSafeRoot(root) || !this.isSafePrefix(mediaPrefix)) {
            console.error('Invalid storage tenant configuration', { tenantId });
            return null;
        }
        return {
            id: tenantId,
            bucket,
            root,
            mediaPrefix,
            adminEmails: this.asStringArray(config.adminEmails).map((value) => value.toLowerCase()),
            adminUids: this.asStringArray(config.adminUids),
        };
    }
    async loadTenantConfigs() {
        const now = Date.now();
        if (this.tenantCache && this.tenantCache.expiresAt > now)
            return this.tenantCache.values;
        let values = {};
        try {
            const snapshot = await this.store.db.ref('/storageTenants').once('value');
            const raw = snapshot.val() || {};
            // Release 114: accept both supported Firebase layouts during the
            // resource migration:
            //   /storageTenants/alegria
            //   /storageTenants/boat/alegria
            // The media service itself still resolves a tenant by tenant id.
            values = this.normalizeTenantConfigs(raw);
        }
        catch (error) {
            console.error('Unable to load storageTenants; using configured legacy fallback', error);
        }
        // Deployment-safe fallback for the existing Alegria installation. Once
        // storageTenants is imported, Firebase becomes the source of truth.
        if (!Object.keys(values).length) {
            values[this.defaultTenantId] = {
                enabled: true,
                bucket: this.legacyBucketName,
                root: this.legacyTenantRoot,
                mediaPrefix: this.legacyAllowedPrefix,
                hostnames: ['alegriaboat.eu', 'www.alegriaboat.eu', 'localhost', '127.0.0.1'],
            };
        }
        this.tenantCache = { expiresAt: now + 5 * 60 * 1000, values };
        return values;
    }
    normalizeTenantConfigs(raw) {
        const normalized = {};
        if (!raw || typeof raw !== 'object')
            return normalized;
        const looksLikeTenant = (value) => !!value && typeof value === 'object'
            && (typeof value.bucket === 'string' || typeof value.root === 'string' || typeof value.mediaPrefix === 'string');
        // Legacy/current layout: /storageTenants/<tenantId>
        Object.entries(raw).forEach(([id, value]) => {
            if (looksLikeTenant(value))
                normalized[id] = value;
        });
        // Resource-scoped layout introduced by the DB migration:
        // /storageTenants/<resourceType>/<resourceId>.  Flatten it for tenant
        // resolution while preserving direct entries above as the authority.
        for (const resourceType of this.supportedResourceTypes) {
            const scoped = raw[resourceType];
            if (!scoped || typeof scoped !== 'object')
                continue;
            Object.entries(scoped).forEach(([id, value]) => {
                if (!normalized[id] && looksLikeTenant(value)) {
                    normalized[id] = value;
                }
            });
        }
        return normalized;
    }
    getRequestHostname(req) {
        const forwarded = String(req.headers['x-forwarded-host'] || '').split(',')[0].trim();
        return this.normalizeHostname(forwarded || String(req.headers.host || req.hostname || ''));
    }
    normalizeHostname(value) {
        return String(value || '').trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0].replace(/:\d+$/, '');
    }
    isLocalHostname(hostname) {
        return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
    }
    asStringArray(value) {
        if (Array.isArray(value))
            return value.map(String).map((item) => item.trim()).filter(Boolean);
        if (value && typeof value === 'object') {
            return Object.entries(value)
                .filter(([, item]) => item === true || typeof item === 'string')
                .map(([key, item]) => item === true ? key : String(item))
                .map((item) => item.trim())
                .filter(Boolean);
        }
        return [];
    }
    isSafeBucket(value) {
        return /^[a-z0-9][a-z0-9._-]{1,220}[a-z0-9]$/.test(value);
    }
    isSafeRoot(value) {
        return (value === 'assets' || value === 'tenants' || value.startsWith('tenants/'))
            && value.length <= 256
            && !value.includes('..')
            && !value.includes('\\')
            && /^[a-zA-Z0-9._/\-]+$/.test(value);
    }
    isSafePrefix(value) {
        return value.endsWith('/')
            && value.length <= 160
            && !value.includes('..')
            && !value.includes('\\')
            && /^[a-zA-Z0-9._/\-]+$/.test(value);
    }
}

//# sourceMappingURL=media.service.js.map
