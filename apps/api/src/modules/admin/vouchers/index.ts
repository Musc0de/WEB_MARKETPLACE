import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db, voucherRedemptions, vouchers } from '@starsuperscare/database';
import { count, desc, eq, ilike, inArray, or } from 'drizzle-orm';
import crypto from 'node:crypto';

export const adminVouchersRouter = new Hono();

// 1. Get Vouchers List
adminVouchersRouter.get('/', async (c) => {
  const search = c.req.query('search') || '';
  const statusFilter = c.req.query('status') || 'all';
  const page = parseInt(c.req.query('page') || '1', 10);
  const limit = parseInt(c.req.query('limit') || '10', 10);
  const offset = (page - 1) * limit;

  const conditions = [];
  if (search) {
    conditions.push(
      or(ilike(vouchers.code, `%${search}%`), ilike(vouchers.description, `%${search}%`)),
    );
  }

  if (statusFilter !== 'all') {
    conditions.push(eq(vouchers.status, statusFilter));
  }

  const whereClause = conditions.length > 0
    ? (conditions.length === 1 ? conditions[0] : or(...conditions))
    : undefined;

  const totalResult = await db.select({ count: count() }).from(vouchers).where(whereClause);
  const total = totalResult[0].count;

  const data = await db
    .select()
    .from(vouchers)
    .where(whereClause)
    .orderBy(desc(vouchers.createdAt))
    .limit(limit)
    .offset(offset);

  const statusCountsRaw = await db
    .select({
      status: vouchers.status,
      count: count(),
    })
    .from(vouchers)
    .groupBy(vouchers.status);

  const statusCounts = Object.fromEntries(
    statusCountsRaw.map((r) => [r.status, Number(r.count)]),
  );

  return c.json({ data, total, page, limit, statusCounts });
});

// 2. Generate Vouchers
adminVouchersRouter.post(
  '/generate',
  zValidator(
    'json',
    z.object({
      count: z.number().min(1).max(5000),
      format: z.enum([
        'XXXX-XXXX-XXX', // A-Z 1-100 RANDOM
        'XXX-XX-XXX', // 1-100 RANDOM (Numeric)
        'XX-XX-XXXX', // 1-100 RANDOM + A-Z RANDOM
        'XX-XX-XXX', // A-Z RANDOM (Alpha)
        'XXXXXXXX-XXXXXX-XXXXXX', // A-Z RANDOM + 1-100 RANDOM
      ]),
      discountType: z.enum(['percentage', 'fixed']),
      discountAmount: z.number().min(0),
      description: z.string().optional(),
      maxUses: z.number().optional(),
      minOrderValue: z.number().optional(),
      maxDiscountValue: z.number().optional(),
      isShippingPromo: z.number().optional(),
      isNewUserOnly: z.number().optional(),
    }),
  ),
  async (c) => {
    const body = await c.req.valid('json');

    const generateCode = (format: string) => {
      const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const num = '0123456789';
      const alnum = alpha + num;
      let result = '';

      const randomChar = (charset: string) => charset[crypto.randomInt(0, charset.length)];

      if (format === 'XXXX-XXXX-XXX') { // A-Z 0-9
        result = `${Array.from({ length: 4 }).map(() => randomChar(alnum)).join('')}-${
          Array.from({ length: 4 }).map(() => randomChar(alnum)).join('')
        }-${Array.from({ length: 3 }).map(() => randomChar(alnum)).join('')}`;
      } else if (format === 'XXX-XX-XXX') { // Numeric
        result = `${Array.from({ length: 3 }).map(() => randomChar(num)).join('')}-${
          Array.from({ length: 2 }).map(() => randomChar(num)).join('')
        }-${Array.from({ length: 3 }).map(() => randomChar(num)).join('')}`;
      } else if (format === 'XX-XX-XXXX') { // Mix Numeric and Alpha
        result = `${Array.from({ length: 2 }).map(() => randomChar(num)).join('')}-${
          Array.from({ length: 2 }).map(() => randomChar(num)).join('')
        }-${Array.from({ length: 4 }).map(() => randomChar(alpha)).join('')}`;
      } else if (format === 'XX-XX-XXX') { // Alpha
        result = `${Array.from({ length: 2 }).map(() => randomChar(alpha)).join('')}-${
          Array.from({ length: 2 }).map(() => randomChar(alpha)).join('')
        }-${Array.from({ length: 3 }).map(() => randomChar(alpha)).join('')}`;
      } else if (format === 'XXXXXXXX-XXXXXX-XXXXXX') { // Alphanumeric
        result = `${Array.from({ length: 8 }).map(() => randomChar(alnum)).join('')}-${
          Array.from({ length: 6 }).map(() => randomChar(alnum)).join('')
        }-${Array.from({ length: 6 }).map(() => randomChar(alnum)).join('')}`;
      }
      return result;
    };

    const newVouchers = [];
    for (let i = 0; i < body.count; i++) {
      newVouchers.push({
        code: generateCode(body.format),
        discountType: body.discountType,
        discountAmount: body.discountAmount,
        description: body.description || null,
        maxUses: body.maxUses || null,
        minOrderValue: body.minOrderValue || 0,
        maxDiscountValue: body.maxDiscountValue || null,
        isShippingPromo: body.isShippingPromo || 0,
        isNewUserOnly: body.isNewUserOnly || 0,
        status: 'active',
      });
    }

    // Batch insert for better performance
    const batchSize = 1000;
    for (let i = 0; i < newVouchers.length; i += batchSize) {
      const batch = newVouchers.slice(i, i + batchSize);
      await db.insert(vouchers).values(batch).onConflictDoNothing({ target: vouchers.code });
    }

    return c.json({ success: true, count: body.count });
  },
);

// 3. Bulk Delete
adminVouchersRouter.post(
  '/bulk-delete',
  zValidator('json', z.object({ ids: z.array(z.string().uuid()) })),
  async (c) => {
    const { ids } = c.req.valid('json');
    if (ids.length === 0) return c.json({ success: true });

    await db.transaction(async (tx) => {
      await tx.delete(voucherRedemptions).where(inArray(voucherRedemptions.voucherId, ids));
      await tx.delete(vouchers).where(inArray(vouchers.id, ids));
    });

    return c.json({ success: true });
  },
);

// 4. Update Voucher Status/Description
adminVouchersRouter.patch(
  '/:id',
  zValidator(
    'json',
    z.object({
      status: z.enum(['active', 'inactive', 'expired']).optional(),
      description: z.string().optional(),
    }),
  ),
  async (c) => {
    const id = c.req.param('id');
    const body = c.req.valid('json');

    if (Object.keys(body).length > 0) {
      await db.update(vouchers).set(body).where(eq(vouchers.id, id));
    }

    return c.json({ success: true });
  },
);
