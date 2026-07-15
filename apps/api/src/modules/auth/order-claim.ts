import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '../../middleware/validator.ts';
import { db, orders, securityAuditLogs, tokens, withTransaction } from '@starsuperscare/database';
import { HTTPException } from 'hono/http-exception';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { AuthContext } from '../../middleware/auth.ts';

const claimRouter = new Hono<AuthContext>();

const ClaimSchema = z.object({
  token: z.string(),
});

const routes = claimRouter.post(
  '/',
  zValidator('json', ClaimSchema),
  async (c) => {
    const { token } = c.req.valid('json');
    const ipHash = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const userAgent = c.req.header('user-agent') || null;

    // 1. Verify token
    const tokenRecord = await db.query.tokens.findFirst({
      where: and(
        eq(tokens.tokenHash, token),
        eq(tokens.type, 'order_claim'),
        isNull(tokens.usedAt),
        gt(tokens.expiresAt, new Date().toISOString()),
      ),
    });

    if (!tokenRecord || !tokenRecord.userId) {
      throw new HTTPException(400, { message: 'Invalid or expired order claim token' });
    }

    const metadata = tokenRecord.metadata as { orderId?: string };
    const orderId = metadata?.orderId;

    if (!orderId) {
      throw new HTTPException(400, { message: 'Invalid token payload' });
    }

    // 2. Fetch order
    const orderRecord = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!orderRecord) {
      throw new HTTPException(404, { message: 'Order not found' });
    }

    if (orderRecord.userId === tokenRecord.userId) {
      // Already claimed
      return c.json({
        data: { message: 'Order is already claimed by this account' },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    }

    if (orderRecord.userId !== null) {
      throw new HTTPException(400, {
        message: 'Order has already been claimed by another account',
      });
    }

    await withTransaction(async (tx) => {
      // 3. Link order
      await tx.update(orders)
        .set({ userId: tokenRecord.userId, updatedAt: new Date().toISOString() })
        .where(eq(orders.id, orderId));

      // 4. Mark token as used
      await tx.update(tokens)
        .set({ usedAt: new Date().toISOString() })
        .where(eq(tokens.id, tokenRecord.id));

      // 5. Audit log
      await tx.insert(securityAuditLogs).values({
        userId: tokenRecord.userId,
        event: 'order_claimed_via_token',
        ipHash,
        userAgent,
      });
    });

    return c.json({
      data: {
        message: 'Order successfully claimed to your account',
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  },
);

export default routes;
