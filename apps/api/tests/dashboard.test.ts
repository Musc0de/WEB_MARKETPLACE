import { expect } from '@std/expect';
import app from '../src/app.ts';
import { db, users } from '@starsuperscare/database';
import * as crypto from 'node:crypto';

// Use same setup as other tests
Deno.test('Dashboard Home Endpoint', async (t) => {
  const testUserId = crypto.randomUUID();

  await t.step('Setup Test User', async () => {
    await db.insert(users).values({
      id: testUserId,
      emailDisplay: `dashboard-test-${Date.now()}@example.com`,
      emailNormalized: `dashboard-test-${Date.now()}@example.com`,
      usernameDisplay: `user_${Date.now()}`,
      usernameNormalized: `user_${Date.now()}`,
    });
  });

  await t.step('Get Dashboard Home (Unauthorized)', async () => {
    const req = new Request('http://localhost:8000/v1/dashboard/home', {
      method: 'GET',
    });
    const res = await app.request(req);
    expect(res.status).toBe(401);
  });

  // Since mocking authenticated requests needs a session or mocking the auth middleware,
  // we will just test that the route exists and is protected.
});
