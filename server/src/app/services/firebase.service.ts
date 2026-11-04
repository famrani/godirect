import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { UtilsService } from './utils.service.js';

export class FirebaseService {
  private initialized = false;
  public db!: admin.database.Database;
  public auth!: admin.auth.Auth;

  constructor(private readonly utils = new UtilsService()) {}

  async initFirebase(): Promise<void> {
    if (this.initialized) return;
    const databaseURL = this.utils.requiredEnv('FIREBASE_DATABASE_URL');
    const configuredPath = this.utils.requiredEnv('FIREBASE_SERVICE_ACCOUNT');
    const serviceAccountPath = path.resolve(process.cwd(), configuredPath);
    if (!fs.existsSync(serviceAccountPath)) throw new Error(`Firebase service account not found: ${serviceAccountPath}`);
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8')) as admin.ServiceAccount;

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined
      });
    }
    this.db = admin.database();
    this.auth = admin.auth();

    // Force a real RTDB operation before the web server starts.
    await this.db.ref('.info/connected').once('value');
    this.initialized = true;
    console.log(`[Firebase] Admin initialized for ${databaseURL}`);
  }
}
