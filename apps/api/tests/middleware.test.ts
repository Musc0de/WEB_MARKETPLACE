import { assertEquals } from '@std/assert';
import app from '../src/app.ts';

Deno.test('Middleware: CORS should reject disallowed origins', async () => {
  const req = new Request('http://localhost:8000/health', {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://malicious.com',
      'Access-Control-Request-Method': 'GET',
    },
  });

  const res = await app.request(req);
  // Hono CORS might just not include the Access-Control-Allow-Origin header if rejected
  const allowOrigin = res.headers.get('Access-Control-Allow-Origin');
  assertEquals(allowOrigin, null);
});

Deno.test('Middleware: CORS should allow allowed origins', async () => {
  const req = new Request('http://localhost:8000/health', {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:3000',
      'Access-Control-Request-Method': 'GET',
    },
  });

  const res = await app.request(req);
  const allowOrigin = res.headers.get('Access-Control-Allow-Origin');
  assertEquals(allowOrigin, 'http://localhost:3000');
});

Deno.test('Middleware: CSRF should block state-changing requests without valid origin', async () => {
  const req = new Request('http://localhost:8000/v1/test-csrf', {
    method: 'POST',
    headers: {
      Origin: 'http://malicious.com',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: 'test' }),
  });

  const res = await app.request(req);
  assertEquals(res.status, 403);
});

Deno.test('Middleware: Request ID should be propagated', async () => {
  const req = new Request('http://localhost:8000/health');
  const res = await app.request(req);

  assertEquals(res.status, 200);

  const body = await res.json();
  assertEquals(typeof body.meta.request_id, 'string');
});
