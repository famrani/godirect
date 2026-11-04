import { Request } from 'express';
import { FirebaseService } from './firebase.service.js';
export async function requireUser(req: Request, firebase: FirebaseService): Promise<string> {
  const match = /^Bearer\s+(.+)$/i.exec(String(req.headers.authorization || ''));
  if (!match) throw Object.assign(new Error('authentication_required'), { status: 401 });
  try { return (await firebase.auth.verifyIdToken(match[1])).uid; }
  catch { throw Object.assign(new Error('invalid_authentication'), { status: 401 }); }
}
export async function requireOwner(req: Request, firebase: FirebaseService, ownerId: string): Promise<string> {
  const uid = await requireUser(req, firebase);
  const owner = (await firebase.db.ref(`owners/${ownerId}`).once('value')).val();
  if (!owner) throw Object.assign(new Error('owner_not_found'), { status: 404 });
  // R7: ownerId is the Firebase UID; do not authorize by a client-controlled role.
  if (ownerId !== uid || owner.uid !== uid) {
    throw Object.assign(new Error('owner_access_denied'), { status: 403 });
  }
  return uid;
}
