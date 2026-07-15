import { encodeHex } from 'oslo/encoding';
import { secureRandomToken } from './tokens.ts';

/**
 * Computes a SHA-256 hash of a given string token using the Web Crypto API.
 */
export async function hashSessionToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  return encodeHex(hashArray);
}

/**
 * Generates a new cryptographically secure session token and its SHA-256 hash.
 * @returns An object containing the raw token (to be sent to the client) and the hash (to be stored in the DB).
 */
export async function createSessionToken(): Promise<{ raw: string; hash: string }> {
  // 30 bytes provides 240 bits of entropy.
  // base64url encoding 30 bytes results in a 40-character string.
  const rawToken = secureRandomToken(30);
  const hash = await hashSessionToken(rawToken);
  return { raw: rawToken, hash };
}
