import { assertEquals } from '@std/assert';
import app from '../src/app.ts';
import { db, orders, sessions, users } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import { createSessionToken } from '@starsuperscare/auth-pkg';

Deno.test('History API', async (t) => {
  let userId: string;
  let sessionToken: string;
  let order1Id: string;
  let order2Id: string;

  await t.step('Setup test data', async () => {
    await db.delete(users).where(eq(users.emailNormalized, 'history-user@test.com'));

    const [u] = await db.insert(users).values({
      usernameDisplay: 'History User',
      usernameNormalized: 'historyuser',
      emailDisplay: 'history-user@test.com',
      emailNormalized: 'history-user@test.com',
    }).returning();
    userId = u.id;

    const sessionTokenResult = await createSessionToken();
    sessionToken = sessionTokenResult.raw;
    await db.insert(sessions).values({
      userId,
      sessionTokenHash: sessionTokenResult.hash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    });

    const [o1] = await db.insert(orders).values({
      userId,
      orderNumber: 'HST-TEST-1',
      emailSnapshot: 'history-user@test.com',
      totalAmount: 150000,
      subtotalAmount: 150000,
      status: 'delivered',
    }).returning();
    order1Id = o1.id;

    const [o2] = await db.insert(orders).values({
      userId,
      orderNumber: 'HST-TEST-2',
      emailSnapshot: 'history-user@test.com',
      totalAmount: 50000,
      subtotalAmount: 50000,
      status: 'refunded',
    }).returning();
    order2Id = o2.id;
  });

  await t.step('GET /v1/history - Returns history and summary', async () => {
    const req = new Request('http://localhost/v1/history', {
      headers: { Cookie: `sss_session=${sessionToken}` },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.data.items.length, 2);
    assertEquals(body.data.summary.totalTransactions, 2);
    assertEquals(body.data.summary.totalNominal, 200000);
    assertEquals(body.data.summary.completedCount, 1);
    assertEquals(body.data.summary.refundCount, 1);
    assertEquals(body.data.summary.refundNominal, 50000);
  });

  await t.step('Cleanup', async () => {
    await db.delete(orders).where(eq(orders.id, order1Id));
    await db.delete(orders).where(eq(orders.id, order2Id));
    await db.delete(users).where(eq(users.id, userId));
  });
});
