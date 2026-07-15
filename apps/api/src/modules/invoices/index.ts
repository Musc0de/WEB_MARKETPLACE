import { Hono } from 'hono';
import { db, invoices, orders } from '@starsuperscare/database';
import { and, count, desc, eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { HTTPException } from 'hono/http-exception';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';

const app = new Hono<AuthContext>();

const routes = app
  .use('*', authMiddleware)
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(100).default(10),
      }),
    ),
    async (c) => {
      const user = c.get('user');
      const { page, limit } = c.req.valid('query');
      const offset = (page - 1) * limit;

      // Join orders to verify ownership
      const [totalResult] = await db
        .select({ count: count() })
        .from(invoices)
        .innerJoin(orders, eq(invoices.orderId, orders.id))
        .where(eq(orders.userId, user.id));

      const total = totalResult.count;

      const invoiceList = await db
        .select({
          id: invoices.id,
          orderId: invoices.orderId,
          invoiceNumber: invoices.invoiceNumber,
          pdfObjectKey: invoices.pdfObjectKey,
          status: invoices.status,
          snapshotData: invoices.snapshotData,
          createdAt: invoices.createdAt,
          updatedAt: invoices.createdAt, // fallback if no updatedAt
        })
        .from(invoices)
        .innerJoin(orders, eq(invoices.orderId, orders.id))
        .where(eq(orders.userId, user.id))
        .orderBy(desc(invoices.createdAt))
        .limit(limit)
        .offset(offset);

      return c.json({
        data: {
          invoices: invoiceList,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    },
  )
  .get('/:id/download', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    // 1. Ownership check
    const [invoice] = await db
      .select({
        id: invoices.id,
        pdfObjectKey: invoices.pdfObjectKey,
      })
      .from(invoices)
      .innerJoin(orders, eq(invoices.orderId, orders.id))
      .where(and(eq(invoices.id, id), eq(orders.userId, user.id)))
      .limit(1);

    if (!invoice) {
      throw new HTTPException(404, { message: 'Invoice not found or unauthorized' });
    }

    if (!invoice.pdfObjectKey) {
      throw new HTTPException(404, { message: 'Invoice PDF not generated yet' });
    }

    // 2. Stream private file (mock streaming)
    // Normally you'd use AWS SDK to get a signed URL or stream the object from S3.
    // For local env, we'll return a mock text file as application/pdf for demonstration
    // or just return the signed URL. Let's return a fake stream.

    c.header('Content-Type', 'application/pdf');
    c.header('Content-Disposition', `attachment; filename="invoice_${id}.pdf"`);
    return c.body(`%PDF-1.4\n%Mock PDF for invoice ${id}\nEOF`);
  });

export default routes;
