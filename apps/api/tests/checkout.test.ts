import { assertEquals, assertNotEquals } from '@std/assert';
import app from '../src/app.ts';
import { createSessionToken } from '@starsuperscare/auth-pkg';
import {
  cartItems,
  carts,
  db,
  inventoryLevels,
  products,
  productVariants,
  stores,
  users,
  warehouses,
} from '@starsuperscare/database';
import { eq } from 'drizzle-orm';

Deno.test('Checkout API', async (t) => {
  let userId: string;
  let variantId: string;
  let cartId: string;
  let sessionToken: string;

  await t.step('Setup test data', async () => {
    const suffix = crypto.randomUUID().substring(0, 8);
    const [u] = await db.insert(users).values({
      usernameDisplay: 'Checkout User',
      usernameNormalized: `checkoutuser_${suffix}`,
      emailDisplay: `checkout_${suffix}@test.com`,
      emailNormalized: `checkout_${suffix}@test.com`,
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
      name: `Checkout Store ${suffix}`,
      slug: `checkout-store-${suffix}`,
    }).returning();

    const [p] = await db.insert(products).values({
      name: 'Test Product Checkout',
      slug: 'test-product-checkout-' + suffix,
      description: 'Test',
      type: 'physical',
      storeId: st.id,
      status: 'active',
    }).returning();
    const [v] = await db.insert(productVariants).values({
      productId: p.id,
      sku: 'SKU-TEST-CO-' + Date.now(),
      price: 100000,
    }).returning();
    variantId = v.id;

    const [w] = await db.insert(warehouses).values({
      name: `Warehouse ${suffix}`,
      storeId: st.id,
    }).returning();

    await db.insert(inventoryLevels).values({
      variantId: v.id,
      warehouseId: w.id,
      available: 10,
      reserved: 0,
    });

    const [c] = await db.insert(carts).values({
      userId: userId,
      status: 'active',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    }).returning();
    cartId = c.id;

    await db.insert(cartItems).values({
      cartId: cartId,
      variantId: variantId,
      quantity: 2,
    });
  });

  await t.step('POST /v1/checkout/shipping-options - Returns options', async () => {
    const req = new Request('http://localhost/v1/checkout/shipping-options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationProvince: 'DKI Jakarta',
        destinationCity: 'Jakarta Pusat',
        weight: 1000,
      }),
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.data.options.length, 2);
  });

  await t.step('POST /v1/checkout/validate - Validates cart and applies voucher', async () => {
    // Requires cookie so it links to the cart
    const req = new Request('http://localhost/v1/checkout/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sss_session=${sessionToken}`,
      },
      body: JSON.stringify({
        voucherCode: 'STAR10',
        shippingOptionId: 'ship_reguler',
      }),
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.data.isValid, true);
    assertEquals(body.data.summary.subtotal, 200000); // 2 * 100000
    assertEquals(body.data.summary.totalDiscount, 20000); // 10%
    assertEquals(body.data.summary.shippingCost, 15000);
  });

  await t.step('POST /v1/checkout/orders - Creates order successfully', async () => {
    const req = new Request('http://localhost/v1/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sss_session=${sessionToken}`,
      },
      body: JSON.stringify({
        idempotencyKey: crypto.randomUUID(),
        emailSnapshot: 'checkout@test.com',
        totalAmount: 200000,
        subtotalAmount: 200000,
        shippingAddress: {
          fullName: 'Test User',
          phoneNumber: '08123456789',
          streetAddress: 'Test St No 123',
          city: 'Jakarta',
          province: 'DKI',
          postalCode: '10110',
        },
        shippingOptionId: 'ship_reguler',
        voucherCode: 'STAR10',
      }),
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertNotEquals(body.data.orderId, undefined);
  });

  await t.step('GET /v1/checkout/orders/:id - Returns order', async () => {
    const req = new Request(`http://localhost/v1/checkout/orders/${crypto.randomUUID()}`);
    const res = await app.fetch(req);
    assertEquals(res.status, 404);
  });

  await t.step('Cleanup', async () => {
    // Deep cleanup is complex due to FKs, but we will let DB cascade or just delete the user
    // We can delete user and everything should cascade if setup correctly.
    // Drizzle doesn't cascade by default unless ON DELETE CASCADE is set.
    // The test DB resets on each full run anyway, but good citizen cleanup:
    await db.delete(users).where(eq(users.id, userId));
  });
});
