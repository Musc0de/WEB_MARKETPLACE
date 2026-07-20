import { assertEquals } from '@std/assert';
import { Hono } from 'hono';
import { browserNavigationShield } from './browser-shield.ts';

const apiUrl = (typeof Deno !== 'undefined' ? Deno.env.get('VITE_API_URL') : process?.env?.['VITE_API_URL']) || '';

Deno.test('Browser Navigation Shield Middleware', async (t) => {
  const app = new Hono();
  app.use('*', browserNavigationShield);

  app.get('/v1/auth/me', (c) => c.json({ user: 'test' }));
  app.get('/v1/webhooks/payments', (c) => c.json({ received: true }));
  app.get('/health', (c) => c.json({ status: 'ok' }));

  await t.step('Blocks direct browser navigation (Accept: text/html)', async () => {
    const req = new Request(`${apiUrl}/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
      },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 404);
    assertEquals(res.headers.get('Content-Type'), 'text/html; charset=UTF-8');
    assertEquals(res.headers.get('Cache-Control'), 'no-store');
  });

  await t.step('Blocks direct browser navigation (Sec-Fetch-Dest: document)', async () => {
    const req = new Request(`${apiUrl}/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Sec-Fetch-Dest': 'document',
      },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 404);
  });

  await t.step('Allows frontend JSON fetch (Accept: application/json)', async () => {
    const req = new Request(`${apiUrl}/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const data = await res.json();
    assertEquals(data.user, 'test');
  });

  await t.step('Allows exempt routes even with browser headers', async () => {
    const req1 = new Request(`${apiUrl}/v1/webhooks/payments`, {
      method: 'GET',
      headers: { 'Accept': 'text/html' },
    });
    const res1 = await app.fetch(req1);
    assertEquals(res1.status, 200);

    const req2 = new Request(`${apiUrl}/health`, {
      method: 'GET',
      headers: { 'Sec-Fetch-Dest': 'document' },
    });
    const res2 = await app.fetch(req2);
    assertEquals(res2.status, 200);
  });
});
