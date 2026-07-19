import { Hono } from 'hono';
import { zValidator } from '../../middleware/validator.ts';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';
import { db } from '@starsuperscare/database';
// @ts-ignore - DB exports not fully typed yet
import { vouchers } from '@starsuperscare/database';
import { and, desc, eq, gt, isNull, or } from 'drizzle-orm';
import { VoucherValidationRequestSchema } from '@starsuperscare/contracts';

type AppContext = {
  Variables: AuthContext['Variables'] & {
    requestId: string;
  };
};

const router = new Hono<AppContext>();

// PUBLIC ENDPOINT: Get active vouchers
router.get('/', async (c) => {
  const now = new Date().toISOString();

  const activeVouchers = await db.select().from(vouchers).where(
    and(
      eq(vouchers.isActive, 1),
      eq(vouchers.status, 'active'),
      or(isNull(vouchers.validTo), gt(vouchers.validTo, now)),
    ),
  ).orderBy(desc(vouchers.createdAt));

  return c.json({
    data: activeVouchers,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

router.use('/validate', authMiddleware);

const routes = router.post(
  '/validate',
  zValidator('json', VoucherValidationRequestSchema),
  async (c) => {
    const { code } = c.req.valid('json');

    // Find voucher
    const voucherList = await db.select().from(vouchers).where(eq(vouchers.code, code)).limit(1);

    if (voucherList.length === 0) {
      return c.json({ error: 'Voucher tidak ditemukan atau tidak valid' }, 404);
    }

    const voucher = voucherList[0];

    // Rule Engine
    if (voucher.isActive !== 1) {
      return c.json({ error: 'Voucher sudah tidak aktif' }, 400);
    }

    const now = new Date();
    if (voucher.validFrom && new Date(voucher.validFrom) > now) {
      return c.json({ error: 'Voucher belum dapat digunakan' }, 400);
    }
    if (voucher.validTo && new Date(voucher.validTo) < now) {
      return c.json({ error: 'Voucher sudah kadaluarsa' }, 400);
    }

    if (voucher.maxUses !== null && voucher.currentUses >= voucher.maxUses) {
      return c.json({ error: 'Kuota penggunaan voucher sudah habis' }, 400);
    }

    return c.json({
      data: {
        code: voucher.code,
        discountType: voucher.discountType,
        discountAmount: Number(voucher.discountAmount),
        description: voucher.description,
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  },
);

export { routes as vouchersRouter };
