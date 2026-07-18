import * as path from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

/**
 * A mock object storage provider that saves files to the local file system.
 * In production, this would be backed by AWS S3, Google Cloud Storage, etc.
 */
export interface ObjectStorageProvider {
  /** Upload an object */
  putObject(key: string, data: Uint8Array, contentType: string): Promise<void>;
  /** Get a signed URL for an object */
  /** Get a signed URL for an object */
  getSignedUrl(key: string, expiresInSeconds: number): Promise<string>;
  /** Get an object */
  getObject(key: string): Promise<Uint8Array | null>;
}

/**
 * A mock object storage provider that saves files to the local file system.
 * In production, this would be backed by AWS S3, Google Cloud Storage, etc.
 */
export class LocalStorageProvider implements ObjectStorageProvider {
  private baseDir: string;
  private baseUrl: string;

  /** Constructor for LocalStorageProvider */
  constructor(baseDir: string, baseUrl: string) {
    this.baseDir = baseDir;
    this.baseUrl = baseUrl;
  }

  /** Upload an object to local storage */
  putObject(key: string, data: Uint8Array, _contentType: string): Promise<void> {
    const fullPath = path.join(this.baseDir, key);
    const dir = path.dirname(fullPath);
    mkdirSync(dir, { recursive: true });
    writeFileSync(fullPath, data);
    writeFileSync(fullPath, data);
    return Promise.resolve();
  }

  /** Get an object from local storage */
  getObject(key: string): Promise<Uint8Array | null> {
    const fullPath = path.join(this.baseDir, key);
    if (!existsSync(fullPath)) return Promise.resolve(null);
    return Promise.resolve(new Uint8Array(readFileSync(fullPath)));
  }

  /** Get a signed URL for local storage */
  getSignedUrl(key: string, expiresInSeconds: number): Promise<string> {
    // In a real implementation, we would generate a crypto signature.
    // For local dev, we just append a mock token and expiry.
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    const mockSignature = `mock_sig_${expiresAt}`;

    const url = new URL(`${this.baseUrl}/storage/${key}`);
    url.searchParams.set('expires', expiresAt.toString());
    url.searchParams.set('signature', mockSignature);

    return Promise.resolve(url.toString());
  }
}

// Singleton instance configured for local dev
const __dirname = import.meta.dirname || '';
// __dirname is packages/storage/src
const WORKSPACE_ROOT = path.resolve(__dirname, '../../..');
const MOCK_STORAGE_DIR = path.join(WORKSPACE_ROOT, 'data', 'storage');
const API_BASE_URL = Deno.env.get('VITE_API_URL') || Deno.env.get('API_URL');
if (!API_BASE_URL) throw new Error('VITE_API_URL is missing in environment variables');

import { R2StorageProvider } from './r2.ts';

/** Default storage instance */
export const storage: ObjectStorageProvider = Deno.env.get('R2_ACCOUNT_ID_3')
  ? new R2StorageProvider()
  : new LocalStorageProvider(MOCK_STORAGE_DIR, API_BASE_URL);

export { R2StorageProvider };
