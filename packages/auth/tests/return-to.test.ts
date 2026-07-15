import { assertEquals } from '@std/assert';
import { getSafeReturnTo } from '../src/return-to.ts';

Deno.test('Auth: getSafeReturnTo allows relative paths', () => {
  assertEquals(getSafeReturnTo('/dashboard'), '/dashboard');
  assertEquals(getSafeReturnTo('/settings/profile'), '/settings/profile');
});

Deno.test('Auth: getSafeReturnTo blocks protocol-relative paths', () => {
  assertEquals(getSafeReturnTo('//evil.com', '/fallback'), '/fallback');
  assertEquals(getSafeReturnTo('///evil.com', '/fallback'), '/fallback');
});

Deno.test('Auth: getSafeReturnTo blocks unauthorized external domains', () => {
  assertEquals(getSafeReturnTo('https://evil.com/login', '/'), '/');
  assertEquals(getSafeReturnTo('http://attacker.org', '/home'), '/home');
});

Deno.test('Auth: getSafeReturnTo allows authorized external domains', () => {
  assertEquals(
    getSafeReturnTo('https://starsuperscare.com/dashboard', '/'),
    'https://starsuperscare.com/dashboard',
  );
  assertEquals(
    getSafeReturnTo('http://localhost:3000/callback', '/'),
    'http://localhost:3000/callback',
  );
});

Deno.test('Auth: getSafeReturnTo handles invalid URLs gracefully', () => {
  assertEquals(getSafeReturnTo('not_a_valid_url_and_no_slash', '/safe'), '/safe');
  assertEquals(getSafeReturnTo('', '/safe'), '/safe');
  assertEquals(getSafeReturnTo(null, '/safe'), '/safe');
  assertEquals(getSafeReturnTo(undefined, '/safe'), '/safe');
});
