import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { addresses, db } from '@starsuperscare/database';
import { and, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';

const app = new Hono<AuthContext>();

const AddressSchema = z.object({
  type: z.enum(['shipping', 'billing', 'both']),
  label: z.string().nullish(),
  recipientName: z.string().min(1),
  phone: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().nullish(),
  district: z.string().nullish(),
  city: z.string().min(1),
  province: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1).default('ID'),
  isPrimaryShipping: z.boolean().default(false),
  isPrimaryBilling: z.boolean().default(false),
});

const routes = app
  .use('*', authMiddleware)
  .get('/', async (c) => {
    const user = c.get('user');
    const list = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, user.id));

    return c.json({
      data: list,
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  })
  .post(
    '/',
    zValidator('json', AddressSchema),
    async (c) => {
      const user = c.get('user');
      const data = c.req.valid('json');

      const address = await db.transaction(async (tx) => {
        // Handle primary logic: if true, unset others
        if (data.isPrimaryShipping) {
          await tx.update(addresses)
            .set({ isPrimaryShipping: false })
            .where(eq(addresses.userId, user.id));
        }
        if (data.isPrimaryBilling) {
          await tx.update(addresses)
            .set({ isPrimaryBilling: false })
            .where(eq(addresses.userId, user.id));
        }

        // Filter out undefined properties for insert
        const toInsert = {
          userId: user.id,
          ...Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined)),
        };

        const [newAddress] = await tx
          .insert(addresses)
          .values(toInsert as any)
          .returning();

        return newAddress;
      });

      return c.json(
        { data: address, meta: { request_id: c.get('requestId') }, error: null },
        201,
      );
    },
  )
  .put(
    '/:id',
    zValidator('json', AddressSchema),
    async (c) => {
      const user = c.get('user');
      const id = c.req.param('id');
      const data = c.req.valid('json');

      const [existing] = await db
        .select()
        .from(addresses)
        .where(and(eq(addresses.id, id), eq(addresses.userId, user.id)))
        .limit(1);

      if (!existing) {
        throw new HTTPException(404, { message: 'Address not found or unauthorized' });
      }

      const address = await db.transaction(async (tx) => {
        if (data.isPrimaryShipping && !existing.isPrimaryShipping) {
          await tx.update(addresses)
            .set({ isPrimaryShipping: false })
            .where(eq(addresses.userId, user.id));
        }
        if (data.isPrimaryBilling && !existing.isPrimaryBilling) {
          await tx.update(addresses)
            .set({ isPrimaryBilling: false })
            .where(eq(addresses.userId, user.id));
        }

        // Filter out undefined properties for update
        const toUpdate = {
          updatedAt: new Date().toISOString(),
          ...Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined)),
        };

        const [updatedAddress] = await tx
          .update(addresses)
          .set(toUpdate as any)
          .where(and(eq(addresses.id, id), eq(addresses.userId, user.id)))
          .returning();

        return updatedAddress;
      });

      return c.json({ data: address, meta: { request_id: c.get('requestId') }, error: null });
    },
  )
  .delete('/:id', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    const [existing] = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, user.id)))
      .limit(1);

    if (!existing) {
      throw new HTTPException(404, { message: 'Address not found or unauthorized' });
    }

    await db.delete(addresses).where(and(eq(addresses.id, id), eq(addresses.userId, user.id)));

    return c.json({
      data: { success: true },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  });

export default routes;
