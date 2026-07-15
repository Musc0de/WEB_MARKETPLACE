import { assertEquals } from '@std/assert';
import app from '../src/app.ts';
import {
  db,
  orderItems,
  orders,
  products,
  productVariants,
  stores,
  users,
} from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import { createSessionToken } from '@starsuperscare/auth-pkg';

Deno.test('Returns API', async (t) => {
  let userId: string;
  let sessionToken: string;
  let orderId: string;
  let orderItemId: string;

  await t.step('Setup test data', async () => {
    const suffix = crypto.randomUUID().substring(0, 8);
    const [u] = await db.insert(users).values({
      usernameDisplay: 'Return User',
      usernameNormalized: `returnuser_${suffix}`,
      emailDisplay: `return_${suffix}@test.com`,
      emailNormalized: `return_${suffix}@test.com`,
    }).returning();
    userId = u.id;

    const tokenRes = await createSessionToken();
    sessionToken = tokenRes.raw;
    await db.insert(db._.fullSchema.sessions).values({
      userId,
      sessionTokenHash: tokenRes.hash,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });

    const [o] = await db.insert(orders).values({
      userId,
      orderNumber: `ORD-RET-${suffix}`,
      emailSnapshot: `return_${suffix}@test.com`,
      totalAmount: 1000,
      subtotalAmount: 1000,
      status: 'delivered', // Delivered order can be returned
    }).returning();
    orderId = o.id;

    const [st] = await db.insert(stores).values({
      name: `Return Store ${suffix}`,
      slug: `ret-store-${suffix}`,
    }).returning();

    const [p] = await db.insert(products).values({
      name: 'Return Product',
      slug: `ret-prod-${suffix}`,
      type: 'physical',
      storeId: st.id,
      status: 'active',
    }).returning();

    const [v] = await db.insert(productVariants).values({
      productId: p.id,
      sku: `sku-ret-${suffix}`,
      price: 1000,
    }).returning();

    const [oi] = await db.insert(orderItems).values({
      orderId,
      productId: p.id,
      variantId: v.id,
      quantity: 1,
      priceSnapshot: 1000,
      productNameSnapshot: 'Test',
      variantSkuSnapshot: 'SKU',
    }).returning();
    orderItemId = oi.id;
  });

  await t.step('POST /v1/returns - Creates a return request', async () => {
    const req = new Request('http://localhost/v1/returns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sss_session=${sessionToken}`,
      },
      body: JSON.stringify({
        orderId,
        reason: 'wrong_item',
        resolution: 'refund',
        items: [{ orderItemId, quantity: 1, reasonDetail: 'test' }],
      }),
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
  });

  await t.step('GET /v1/returns - Lists user returns', async () => {
    const req = new Request('http://localhost/v1/returns', {
      headers: { 'Cookie': `sss_session=${sessionToken}` },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.data.length, 1);
  });

  await t.step('Cleanup', async () => {
    try {
      await db.delete(orders).where(eq(orders.id, orderId));
      await db.delete(users).where(eq(users.id, userId));
    } catch (e) {
      console.warn('Cleanup error:', e);
    }
  });
});
