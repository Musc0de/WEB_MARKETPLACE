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
