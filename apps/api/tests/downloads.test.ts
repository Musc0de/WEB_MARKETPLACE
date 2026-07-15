import { assertEquals } from '@std/assert';
import app from '../src/app.ts';
import {
  db,
  digitalAssets,
  digitalEntitlements,
  orderItems,
  orders,
  products,
  productVariants,
  sessions,
  stores,
  users,
} from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import { createSessionToken } from '@starsuperscare/auth-pkg';

Deno.test('Downloads API', async (t) => {
  let userId: string;
  let user2Id: string;
  let sessionToken: string;
  let sessionToken2: string;
  let orderId: string;
  let orderItemId: string;
  let productId: string;
  let variantId: string;
  let assetId: string;
  let entitlementId: string;
  let storeId: string;

  await t.step('Setup test data', async () => {
    const suffix1 = crypto.randomUUID().substring(0, 8);
    const suffix2 = crypto.randomUUID().substring(0, 8);

    const [u] = await db.insert(users).values({
      usernameDisplay: 'Download User',
      usernameNormalized: `downloaduser_${suffix1}`,
      emailDisplay: `download-user_${suffix1}@test.com`,
      emailNormalized: `download-user_${suffix1}@test.com`,
    }).returning();
    userId = u.id;

    const [u2] = await db.insert(users).values({
      usernameDisplay: 'Download User 2',
      usernameNormalized: `downloaduser2_${suffix2}`,
      emailDisplay: `download-user2_${suffix2}@test.com`,
      emailNormalized: `download-user2_${suffix2}@test.com`,
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

    const [s] = await db.insert(stores).values({
      name: 'Test Store',
      slug: 'test-store-' + Date.now(),
    }).returning();
    storeId = s.id;

    const [p] = await db.insert(products).values({
      storeId,
      name: 'Test Digital Product',
      slug: `test-digital-product-${suffix1}`,
      description: 'Test digital product',
      status: 'active',
      type: 'digital',
    }).returning();
    productId = p.id;

    const [v] = await db.insert(productVariants).values({
      productId,
      sku: `SKU-DIGITAL-1-${suffix1}`,
      price: 50000,
    }).returning();
    variantId = v.id;

    const [o] = await db.insert(orders).values({
      userId,
      orderNumber: `ORD-DIGITAL-${suffix1}`,
      emailSnapshot: 'download-user@test.com',
      totalAmount: 50000,
      subtotalAmount: 50000,
      status: 'paid',
    }).returning();
    orderId = o.id;

    const [oi] = await db.insert(orderItems).values({
      orderId,
      productId,
      variantId,
      quantity: 1,
      priceSnapshot: 50000,
      productNameSnapshot: 'Test Digital Product',
      variantSkuSnapshot: 'SKU-DIGITAL-1',
    }).returning();
    orderItemId = oi.id;

    const [a] = await db.insert(digitalAssets).values({
      variantId,
      objectKey: 'assets/test-download.zip',
      version: '1.0',
    }).returning();
    assetId = a.id;

    const [e] = await db.insert(digitalEntitlements).values({
      userId,
      assetId,
      orderItemId,
      downloadLimit: 3,
    }).returning();
    entitlementId = e.id;
  });

  await t.step('GET /v1/downloads - Returns entitlements', async () => {
    const req = new Request('http://localhost/v1/downloads', {
      headers: { Cookie: `sss_session=${sessionToken}` },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.data.entitlements.length, 1);
    assertEquals(body.data.entitlements[0].id, entitlementId);
  });

  await t.step('GET /v1/downloads/:id/stream - Success and limits', async () => {
    // 1st download
    let req = new Request(`http://localhost/v1/downloads/${entitlementId}/stream`, {
      headers: { Cookie: `sss_session=${sessionToken}` },
    });
    let res = await app.fetch(req);
    assertEquals(res.status, 200);

    // 2nd download
    req = new Request(`http://localhost/v1/downloads/${entitlementId}/stream`, {
      headers: { Cookie: `sss_session=${sessionToken}` },
    });
    res = await app.fetch(req);
    assertEquals(res.status, 200);

    // 3rd download
    req = new Request(`http://localhost/v1/downloads/${entitlementId}/stream`, {
      headers: { Cookie: `sss_session=${sessionToken}` },
    });
    res = await app.fetch(req);
    assertEquals(res.status, 200);

    // 4th download (should fail)
    req = new Request(`http://localhost/v1/downloads/${entitlementId}/stream`, {
      headers: { Cookie: `sss_session=${sessionToken}` },
    });
    res = await app.fetch(req);
    assertEquals(res.status, 403);
    const text = await res.text();
    assertEquals(text.includes('limit exceeded'), true);
  });

  await t.step('GET /v1/downloads/:id/stream - IDOR', async () => {
    const req = new Request(`http://localhost/v1/downloads/${entitlementId}/stream`, {
      headers: { Cookie: `sss_session=${sessionToken2}` },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 404);
  });

  await t.step('Cleanup', async () => {
    await db.delete(digitalEntitlements).where(eq(digitalEntitlements.id, entitlementId));
    await db.delete(digitalAssets).where(eq(digitalAssets.id, assetId));
    await db.delete(orderItems).where(eq(orderItems.id, orderItemId));
    await db.delete(orders).where(eq(orders.id, orderId));
    await db.delete(productVariants).where(eq(productVariants.id, variantId));
    await db.delete(products).where(eq(products.id, productId));
    await db.delete(stores).where(eq(stores.id, storeId));
    await db.delete(users).where(eq(users.id, userId));
    await db.delete(users).where(eq(users.id, user2Id));
  });
});
