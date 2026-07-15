/// <reference lib="deno.ns" />
import { assertEquals, assertExists } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import app from './app.ts';

Deno.test('API /health endpoint returns healthy status', async () => {
  const req = new Request('http://localhost/health');
  const res = await app.request(req);

  assertEquals(res.status, 200);
  const body = await res.json();

  assertEquals(body.data.status, 'healthy');
  assertExists(body.meta.request_id);
  assertEquals(body.error, null);
});

Deno.test('API not found endpoint returns correct envelope', async () => {
  const req = new Request('http://localhost/non-existent-route');
  const res = await app.request(req);

  assertEquals(res.status, 404);
  const body = await res.json();

  assertEquals(body.data, null);
  assertEquals(body.error.code, 'NOT_FOUND');
  assertExists(body.meta.request_id);
});
