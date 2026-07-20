import { encodeHex } from '@std/encoding/hex';

/**
 * Computes a SHA-256 digest of the given input string.
 * This uses the native Web Crypto API available in Deno.
 *
 * @param input The plaintext string to hash
 * @returns The hex-encoded SHA-256 digest
 */
export async function computeSha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return encodeHex(new Uint8Array(hashBuffer));
}

import * as nodeCrypto from 'node:crypto';

// Use JWT_SECRET or fallback key for encryption if ENCRYPTION_KEY is not defined
const ENCRYPTION_KEY =
  (typeof Deno !== 'undefined'
    ? Deno.env.get('ENCRYPTION_KEY')
    : process?.env?.['ENCRYPTION_KEY']) ||
  (typeof Deno !== 'undefined' ? Deno.env.get('JWT_SECRET') : process?.env?.['JWT_SECRET']) || '';

// Ensure the key is exactly 32 bytes for AES-256
function getEncryptionKey(): Buffer {
  const hash = nodeCrypto.createHash('sha256');
  hash.update(ENCRYPTION_KEY);
  return hash.digest();
}

/**
 * Encrypts a string (e.g. JSON stringified credential) using AES-256-GCM
 * @param plaintext The string to encrypt
 * @returns { encryptedData, iv, authTag } as hex strings
 */
export function encryptCredential(plaintext: string) {
  const key = getEncryptionKey();
  const iv = nodeCrypto.randomBytes(12);
  const cipher = nodeCrypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag,
  };
}

/**
 * Decrypts a credential ciphertext using AES-256-GCM
 * @param encryptedData Hex string
 * @param iv Hex string
 * @param authTag Hex string
 * @returns Decrypted plaintext string
 */
export function decryptCredential(encryptedData: string, iv: string, authTag: string): string {
  const key = getEncryptionKey();
  const decipher = nodeCrypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
