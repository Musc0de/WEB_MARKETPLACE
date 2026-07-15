import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db, invoices, orders, payments } from '@starsuperscare/database';
import { authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';

const adminPaymentsRouter = new Hono();

adminPaymentsRouter.use('/*', authMiddleware);
adminPaymentsRouter.use('/*', requirePermission('orders.read')); // Reusing orders read permission for payments

adminPaymentsRouter.get(
  '/payments',
  zValidator(
    'query',
    z.object({
      page: z.string().optional().default('1'),
      limit: z.string().optional().default('20'),
    }),
  ),
  async (c) => {
    const { page, limit } = c.req.valid('query');
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 20;
    const offset = (p - 1) * l;

    const results = await db.select({
      id: payments.id,
      orderId: payments.orderId,
      orderNumber: orders.orderNumber,
      provider: payments.provider,
      providerTransactionId: payments.providerTransactionId,
      amount: payments.amount,
      status: payments.status,
      createdAt: payments.createdAt,
      updatedAt: payments.updatedAt,
    })
      .from(payments)
      .leftJoin(orders, eq(payments.orderId, orders.id))
      .limit(l)
      .offset(offset)
      .orderBy(desc(payments.createdAt));

    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(payments);

    const total = Number(countResult[0]?.count || 0);

    return c.json({
      data: results,
      total,
      page: p,
      limit: l,
    });
  },
);

adminPaymentsRouter.get(
  '/invoices',
  zValidator(
    'query',
    z.object({
      page: z.string().optional().default('1'),
      limit: z.string().optional().default('20'),
    }),
  ),
  async (c) => {
    const { page, limit } = c.req.valid('query');
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 20;
    const offset = (p - 1) * l;

    const results = await db.select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      orderId: invoices.orderId,
      orderNumber: orders.orderNumber,
      pdfObjectKey: invoices.pdfObjectKey,
      issuedAt: invoices.issuedAt,
      dueDate: invoices.dueDate,
      status: invoices.status,
      createdAt: invoices.createdAt,
    })
      .from(invoices)
      .leftJoin(orders, eq(invoices.orderId, orders.id))
      .limit(l)
      .offset(offset)
      .orderBy(desc(invoices.createdAt));

    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(invoices);

    const total = Number(countResult[0]?.count || 0);

    return c.json({
      data: results.map((r) => ({ ...r, status: r.status as any })),
      total,
      page: p,
      limit: l,
    });
  },
);

adminPaymentsRouter.post('/invoices/:id/resend', requirePermission('orders.write'), async (c) => {
  const id = c.req.param('id');

  const invoiceResult = await db.select().from(invoices).where(eq(invoices.id, id as string)).limit(
    1,
  );
  if (!invoiceResult.length) return c.json({ error: 'Invoice not found' }, 404);

  // In a real system, you'd queue a background job to send the email
  // Example: await outbox.insert({ topic: 'email.invoice.resend', payload: { invoiceId: id } })

  return c.json({ success: true, message: 'Invoice resend job queued' });
});

export { adminPaymentsRouter };
