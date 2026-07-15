import { assertEquals } from '@std/assert';
import { hashPassword, validatePasswordStrength, verifyPassword } from '../src/password.ts';
import { secureRandomToken } from '../src/tokens.ts';

Deno.test('Auth: Password strength validator', () => {
  assertEquals(validatePasswordStrength('short'), false);
  assertEquals(validatePasswordStrength('NoNumbersHere'), false); // No numbers
  assertEquals(validatePasswordStrength('alllowercase1'), false); // No uppercase
  assertEquals(validatePasswordStrength('ALLUPPERCASE1'), false); // No lowercase
  assertEquals(validatePasswordStrength('ValidPassw0rd!'), true); // Has all
});

Deno.test('Auth: Argon2id hash and verify', async () => {
  const pass = 'SecureP@ss123';
  const hash = await hashPassword(pass);

  // It should be a string starting with $argon2id$
  assertEquals(hash.startsWith('$argon2id$'), true);

  // Verification
  const isMatch = await verifyPassword(hash, pass);
  assertEquals(isMatch, true);

  const isFalseMatch = await verifyPassword(hash, 'WrongP@ss123');
  assertEquals(isFalseMatch, false);
});

import { createSessionToken, hashSessionToken } from '../src/sessions.ts';

Deno.test('Auth: Secure random tokens', () => {
  const t1 = secureRandomToken();
  const t2 = secureRandomToken();
  assertEquals(t1 !== t2, true);
  // Base64url encoded length for 20 bytes is 27 chars
  assertEquals(t1.length, 27);
});

Deno.test('Auth: Session tokens and hashing', async () => {
  const { raw, hash } = await createSessionToken();
  assertEquals(raw.length, 40); // 30 bytes in base64url is 40 chars
  assertEquals(hash.length, 64); // SHA-256 hex is 64 chars

  const computedHash = await hashSessionToken(raw);
  assertEquals(computedHash, hash);
});
