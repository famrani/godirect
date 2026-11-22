import { createCipheriv, createDecipheriv, createHash, hkdfSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
const MAGIC = Buffer.from('GDDOC01\0'), HEADER = 44;
const fail = (code) => Object.assign(Error(code), { status: 503 });
function explicit(value) { if (!/^[A-Za-z0-9+/]{43}=$/.test(value))
    throw fail('document_encryption_key_invalid'); const key = Buffer.from(value, 'base64'); if (key.length !== 32)
    throw fail('document_encryption_key_invalid'); return key; }
function credentialKey(path) { try {
    const c = JSON.parse(readFileSync(path, 'utf8'));
    if (typeof c.private_key !== 'string' || !c.private_key.includes('PRIVATE KEY') || c.private_key.length < 128)
        throw Error();
    return Buffer.from(hkdfSync('sha256', Buffer.from(c.private_key), Buffer.from('godirect-document-encryption-v1'), Buffer.from('ailla-poc.appspot.com/asset-documents'), 32));
}
catch {
    throw fail('document_encryption_key_unavailable');
} }
function keyId(key) { return createHash('sha256').update(key).digest().subarray(0, 8); }
function keys() { const current = process.env.DOCUMENT_ENCRYPTION_KEY ? explicit(process.env.DOCUMENT_ENCRYPTION_KEY) : credentialKey(process.env.FIREBASE_SERVICE_ACCOUNT || process.env.GCS_SERVICE_ACCOUNT || process.env.GOOGLE_APPLICATION_CREDENTIALS || ''); const previous = (process.env.DOCUMENT_ENCRYPTION_PREVIOUS_KEYS || '').split(',').filter(Boolean).map(v => explicit(v.trim())); for (const path of (process.env.DOCUMENT_DECRYPTION_SERVICE_ACCOUNTS || '').split(',').filter(Boolean))
    previous.push(credentialKey(path.trim())); return [current, ...previous]; }
export function encryptDocument(plain, aad) { const key = keys()[0], nonce = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key, nonce); cipher.setAAD(Buffer.from(aad)); const body = Buffer.concat([cipher.update(plain), cipher.final()]), id = keyId(key); return { bytes: Buffer.concat([MAGIC, id, nonce, cipher.getAuthTag(), body]), keyId: id.toString('hex') }; }
export function decryptDocument(encrypted, aad) { if (encrypted.length < HEADER || !encrypted.subarray(0, 8).equals(MAGIC))
    throw fail('document_encryption_invalid'); const id = encrypted.subarray(8, 16), key = keys().find(k => timingSafeEqual(keyId(k), id)); if (!key)
    throw fail('document_encryption_key_missing'); try {
    const cipher = createDecipheriv('aes-256-gcm', key, encrypted.subarray(16, 28));
    cipher.setAAD(Buffer.from(aad));
    cipher.setAuthTag(encrypted.subarray(28, 44));
    return Buffer.concat([cipher.update(encrypted.subarray(44)), cipher.final()]);
}
catch {
    throw fail('document_encryption_invalid');
} }

//# sourceMappingURL=document-encryption.js.map
