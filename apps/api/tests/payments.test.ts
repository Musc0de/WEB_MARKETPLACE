import { expect } from 'jsr:@std/expect@1';
import { db } from '@starsuperscare/database';
import { orders, paymentEvents, payments } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import appRoute from '../src/app.ts';
import { paymentProvider } from '../src/modules/payments/provider.ts';

const testApp = appRoute; // use the Hono app directly

Deno.test('Payments API & Webhooks', async (t) => {
  let orderId = '';
  let providerTxId = '';
  const testOrderId = crypto.randomUUID();
  let paymentId = '';

  await t.step('Setup dummy order', async () => {
    // Insert dummy order to test payment
    const [order] = await db.insert(orders).values({
      id: testOrderId,
      orderNumber: `ORD-TEST-${Date.now()}`,
      emailSnapshot: 'test@example.com',
      totalAmount: 100000,
      subtotalAmount: 100000,
      discountAmount: 0,
      shippingAmount: 0,
      taxAmount: 0,
      status: 'pending',
    }).returning({ id: orders.id });
    orderId = order.id;
  });

  await t.step('POST /v1/payments/intent - Should create payment intent', async () => {
    const res = await testApp.request('/v1/payments/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.paymentId).toBeDefined();
    expect(json.data.providerTransactionId).toBeDefined();
    expect(json.data.clientSecret).toBeDefined();

    providerTxId = json.data.providerTransactionId;
    paymentId = json.data.paymentId;
  });

  await t.step('POST /v1/webhooks/payments - Should reject invalid signature', async () => {
    const payload = JSON.stringify({
      providerEventId: `evt_inv_${Date.now()}`,
      type: 'payment_success',
      data: { providerTransactionId: providerTxId, orderId },
    });

    const res = await testApp.request('/v1/webhooks/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': 'invalid_signature_123',
      },
      body: payload,
    });

    expect(res.status).toBe(401);
  });

  await t.step('POST /v1/webhooks/payments - Should process valid success webhook', async () => {
    const providerEventId = `evt_succ_${Date.now()}`;
    const payload = JSON.stringify({
      providerEventId,
      type: 'payment_success',
      data: { providerTransactionId: providerTxId, orderId },
    });

    const signature = paymentProvider.generateSignature(payload);

    const res = await testApp.request('/v1/webhooks/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': signature,
      },
      body: payload,
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.status).toBe('processed');

    // Verify DB states
    const [paymentRecord] = await db.select().from(payments).where(eq(payments.id, paymentId));
    expect(paymentRecord.status).toBe('success');

    const [orderRecord] = await db.select().from(orders).where(eq(orders.id, orderId));
    expect(orderRecord.status).toBe('paid');
  });

  await t.step('POST /v1/webhooks/payments - Should ignore duplicate webhook', async () => {
    // Reusing the same payload/eventId
    const [existingEvent] = await db.select().from(paymentEvents).where(
      eq(paymentEvents.paymentId, paymentId),
    );

    const payload = JSON.stringify({
      providerEventId: existingEvent.providerEventId, // same event ID
      type: 'payment_success',
      data: { providerTransactionId: providerTxId, orderId },
    });

    const signature = paymentProvider.generateSignature(payload);

    const res = await testApp.request('/v1/webhooks/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': signature,
      },
      body: payload,
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.status).toBe('ignored_duplicate');
  });

  // Cleanup
  await t.step('Cleanup', async () => {
    await db.delete(paymentEvents).where(eq(paymentEvents.paymentId, paymentId));
    await db.delete(payments).where(eq(payments.id, paymentId));
    await db.delete(orders).where(eq(orders.id, orderId));
  });
});
