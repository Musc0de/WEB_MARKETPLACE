import { assertEquals } from '@std/assert';
import app from '../src/app.ts';
import { db, invoices, orders, sessions, users } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import { createSessionToken } from '@starsuperscare/auth-pkg';

Deno.test('Invoices API', async (t) => {
  let userId: string;
  let user2Id: string;
  let sessionToken: string;
  let sessionToken2: string;
  let orderId: string;
  let invoiceId: string;

  await t.step('Setup test data', async () => {
    await db.delete(users).where(eq(users.emailNormalized, 'invoice-user@test.com'));
    await db.delete(users).where(eq(users.emailNormalized, 'invoice-user2@test.com'));

    const [u] = await db.insert(users).values({
      usernameDisplay: 'Invoice User',
      usernameNormalized: 'invoiceuser',
      emailDisplay: 'invoice-user@test.com',
      emailNormalized: 'invoice-user@test.com',
    }).returning();
    userId = u.id;

    const [u2] = await db.insert(users).values({
      usernameDisplay: 'Invoice User 2',
      usernameNormalized: 'invoiceuser2',
      emailDisplay: 'invoice-user2@test.com',
      emailNormalized: 'invoice-user2@test.com',
    }).returning();
    user2Id = u2.id;

    const sessionTokenResult = await createSessionToken();
    sessionToken = sessionTokenResult.raw;
    await db.insert(sessions).values({
      userId,
      sessionTokenHash: sessionTokenResult.hash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    });

    const sessionTokenResult2 = await createSessionToken();
    sessionToken2 = sessionTokenResult2.raw;
    await db.insert(sessions).values({
      userId: user2Id,
      sessionTokenHash: sessionTokenResult2.hash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    });

    const [o1] = await db.insert(orders).values({
      userId,
      orderNumber: 'INV-TEST-ORD',
      emailSnapshot: 'invoice-user@test.com',
      totalAmount: 150000,
      subtotalAmount: 150000,
      status: 'delivered',
    }).returning();
    orderId = o1.id;

    const [inv] = await db.insert(invoices).values({
      orderId,
      invoiceNumber: 'INV-TEST-1',
      pdfObjectKey: 'invoices/test.pdf',
      status: 'paid',
    }).returning();
    invoiceId = inv.id;
  });

  await t.step('GET /v1/invoices - Returns invoices', async () => {
    const req = new Request('http://localhost/v1/invoices', {
      headers: { Cookie: `sss_session=${sessionToken}` },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.data.invoices.length, 1);
    assertEquals(body.data.invoices[0].id, invoiceId);
  });

  await t.step('GET /v1/invoices/:id/download - Returns mock PDF for owner', async () => {
    const req = new Request(`http://localhost/v1/invoices/${invoiceId}/download`, {
      headers: { Cookie: `sss_session=${sessionToken}` },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const text = await res.text();
    assertEquals(text.includes('%PDF'), true);
  });

  await t.step('GET /v1/invoices/:id/download - Returns 404 for non-owner (IDOR)', async () => {
    const req = new Request(`http://localhost/v1/invoices/${invoiceId}/download`, {
      headers: { Cookie: `sss_session=${sessionToken2}` },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 404);
  });

  await t.step('Cleanup', async () => {
    await db.delete(invoices).where(eq(invoices.id, invoiceId));
    await db.delete(orders).where(eq(orders.id, orderId));
    await db.delete(users).where(eq(users.id, userId));
    await db.delete(users).where(eq(users.id, user2Id));
  });
});
