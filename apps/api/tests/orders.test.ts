import { assertEquals } from '@std/assert';
import app from '../src/app.ts';
import { db, orders, sessions, users } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import { createSessionToken } from '@starsuperscare/auth-pkg';

Deno.test('Orders API', async (t) => {
  let user1Id: string;
  let user2Id: string;
  let sessionToken1: string;
  let sessionToken2: string;
  let order1Id: string;
  let order2Id: string;

  await t.step('Setup test data', async () => {
    // Clean up
    await db.delete(users).where(eq(users.emailNormalized, 'order-user1@test.com'));
    await db.delete(users).where(eq(users.emailNormalized, 'order-user2@test.com'));

    // Create user 1
    const [u1] = await db.insert(users).values({
      usernameDisplay: 'Order User 1',
      usernameNormalized: 'orderuser1',
      emailDisplay: 'order-user1@test.com',
      emailNormalized: 'order-user1@test.com',
    }).returning();
    user1Id = u1.id;

    const sessionTokenResult1 = await createSessionToken();
    sessionToken1 = sessionTokenResult1.raw;
    await db.insert(sessions).values({
      userId: user1Id,
      sessionTokenHash: sessionTokenResult1.hash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    });

    // Create user 2
    const [u2] = await db.insert(users).values({
      usernameDisplay: 'Order User 2',
      usernameNormalized: 'orderuser2',
      emailDisplay: 'order-user2@test.com',
      emailNormalized: 'order-user2@test.com',
    }).returning();
    user2Id = u2.id;

    const sessionTokenResult2 = await createSessionToken();
    sessionToken2 = sessionTokenResult2.raw;
    await db.insert(sessions).values({
      userId: user2Id,
      sessionTokenHash: sessionTokenResult2.hash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    });

    // Create orders
    const [o1] = await db.insert(orders).values({
      userId: user1Id,
      orderNumber: 'ORD-TEST-1',
      emailSnapshot: 'order-user1@test.com',
      totalAmount: 100000,
      subtotalAmount: 100000,
      status: 'pending',
    }).returning();
    order1Id = o1.id;

    const [o2] = await db.insert(orders).values({
      userId: user2Id,
      orderNumber: 'ORD-TEST-2',
      emailSnapshot: 'order-user2@test.com',
      totalAmount: 200000,
      subtotalAmount: 200000,
      status: 'paid',
    }).returning();
    order2Id = o2.id;
  });

  await t.step('GET /v1/orders - Returns user orders', async () => {
    const req = new Request('http://localhost/v1/orders', {
      headers: { Cookie: `sss_session=${sessionToken1}` },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.data.orders.length, 1);
    assertEquals(body.data.orders[0].id, order1Id);
  });

  await t.step('GET /v1/orders/:id - Returns order detail for owner', async () => {
    const req = new Request(`http://localhost/v1/orders/${order1Id}`, {
      headers: { Cookie: `sss_session=${sessionToken1}` },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.data.order.id, order1Id);
  });

  await t.step('GET /v1/orders/:id - Returns 404 for non-owner (IDOR check)', async () => {
    const req = new Request(`http://localhost/v1/orders/${order1Id}`, {
      headers: { Cookie: `sss_session=${sessionToken2}` },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 404);
  });

  await t.step('Cleanup', async () => {
    await db.delete(orders).where(eq(orders.id, order1Id));
    await db.delete(orders).where(eq(orders.id, order2Id));
    await db.delete(users).where(eq(users.id, user1Id));
    await db.delete(users).where(eq(users.id, user2Id));
  });
});
