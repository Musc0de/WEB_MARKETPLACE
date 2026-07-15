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

Deno.test('Reviews API', async (t) => {
  let userId: string;
  let sessionToken: string;
  let productId: string;
  let orderId: string;

  await t.step('Setup test data', async () => {
    const suffix = crypto.randomUUID().substring(0, 8);
    const [u] = await db.insert(users).values({
      usernameDisplay: 'Review User',
      usernameNormalized: `reviewuser_${suffix}`,
      emailDisplay: `review_${suffix}@test.com`,
      emailNormalized: `review_${suffix}@test.com`,
    }).returning();
    userId = u.id;

    const tokenRes = await createSessionToken();
    sessionToken = tokenRes.raw;
    await db.insert(db._.fullSchema.sessions).values({
      userId,
      sessionTokenHash: tokenRes.hash,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });

    const [st] = await db.insert(stores).values({
      name: `Review Store ${suffix}`,
      slug: `review-store-${suffix}`,
    }).returning();

    const [p] = await db.insert(products).values({
      name: 'Review Product',
      slug: `review-prod-${suffix}`,
      type: 'physical',
      storeId: st.id,
      status: 'active',
    }).returning();
    productId = p.id;

    const [o] = await db.insert(orders).values({
      userId,
      orderNumber: `ORD-REV-${suffix}`,
      emailSnapshot: `review_${suffix}@test.com`,
      totalAmount: 1000,
      subtotalAmount: 1000,
      status: 'delivered',
    }).returning();
    orderId = o.id;

    const [v] = await db.insert(productVariants).values({
      productId,
      sku: `sku-rev-${suffix}`,
      price: 1000,
    }).returning();

    await db.insert(orderItems).values({
      orderId,
      productId: productId,
      variantId: v.id,
      quantity: 1,
      priceSnapshot: 1000,
      productNameSnapshot: 'Test',
      variantSkuSnapshot: 'SKU',
    });
  });

  await t.step('POST /v1/reviews - Submit review', async () => {
    const req = new Request(`http://localhost/v1/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sss_session=${sessionToken}`,
      },
      body: JSON.stringify({
        orderId,
        rating: 5,
        title: 'Great',
        comment: 'Very good',
      }),
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 201);
  });

  await t.step('GET /v1/reviews - Fetch reviews', async () => {
    const req = new Request(`http://localhost/v1/reviews`);
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.data.length, 1);
    assertEquals(body.data[0].rating, 5);
  });

  await t.step('Cleanup', async () => {
    try {
      await db.delete(users).where(eq(users.id, userId));
    } catch (e) {
      console.warn('Cleanup error:', e);
    }
    try {
      await db.delete(products).where(eq(products.id, productId));
    } catch (e) {
      console.warn('Cleanup error:', e);
    }
  });
});
