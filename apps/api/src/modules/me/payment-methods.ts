import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { customerPaymentMethods, db } from '@starsuperscare/database';
import { and, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';

const app = new Hono<AuthContext>();

const routes = app
  .use('*', authMiddleware)
  .get('/', async (c) => {
    const user = c.get('user');
    const list = await db
      .select()
      .from(customerPaymentMethods)
      .where(eq(customerPaymentMethods.userId, user.id));

    return c.json({
      data: list,
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  })
  .post(
    '/',
    zValidator(
      'json',
      z.object({
        provider: z.string().min(1),
        providerToken: z.string().min(1),
        displayMetadata: z.record(z.string(), z.any()).optional(),
      }),
    ),
    async (c) => {
      const user = c.get('user');
      const data = c.req.valid('json');

      const [newMethod] = await db
        .insert(customerPaymentMethods)
        .values({
          userId: user.id,
          provider: data.provider,
          providerToken: data.providerToken,
          displayMetadata: data.displayMetadata,
        })
        .returning();

      return c.json(
        { data: newMethod, meta: { request_id: c.get('requestId') }, error: null },
        201,
      );
    },
  )
  .delete('/:id', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    const [existing] = await db
      .select()
      .from(customerPaymentMethods)
      .where(and(eq(customerPaymentMethods.id, id), eq(customerPaymentMethods.userId, user.id)))
      .limit(1);

    if (!existing) {
      throw new HTTPException(404, { message: 'Payment method not found or unauthorized' });
    }

    await db
      .delete(customerPaymentMethods)
      .where(and(eq(customerPaymentMethods.id, id), eq(customerPaymentMethods.userId, user.id)));

    return c.json({
      data: { success: true },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  });

export default routes;
