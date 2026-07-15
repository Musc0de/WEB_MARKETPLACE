import { encodeBase64url } from 'oslo/encoding';

export function secureRandomToken(byteLength: number = 20): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return encodeBase64url(bytes);
}

export function generateIdempotencyKey(): string {
  return secureRandomToken(16);
}
