import { Hono } from 'hono';
import { db, digitalCredentials, users } from '@starsuperscare/database';
import { and, count, desc, eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { HTTPException } from 'hono/http-exception';
import { authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { encryptCredential } from '../../../utils/crypto.ts';

const app = new Hono()
  .use('*', authMiddleware)
  .use('*', requirePermission('catalog.read'))
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        productId: z.string().uuid(),
        variantId: z.string().uuid().optional(),
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(100).default(10),
      }),
    ),
    async (c) => {
      const { productId, variantId, page, limit } = c.req.valid('query');
      const offset = (page - 1) * limit;

      const conditions: any[] = [eq(digitalCredentials.productId, productId)];
      if (variantId) {
        conditions.push(eq(digitalCredentials.variantId, variantId));
      }

      const [totalResult] = await db
        .select({ count: count() })
        .from(digitalCredentials)
        .where(and(...conditions));
      const total = totalResult.count;

      const items = await db
        .select({
          id: digitalCredentials.id,
          productId: digitalCredentials.productId,
          variantId: digitalCredentials.variantId,
          status: digitalCredentials.status,
          orderItemId: digitalCredentials.orderItemId,
          userId: digitalCredentials.userId,
          createdAt: digitalCredentials.createdAt,
          userEmail: users.emailDisplay,
        })
        .from(digitalCredentials)
        .leftJoin(users, eq(digitalCredentials.userId, users.id))
        .where(and(...conditions))
        .orderBy(desc(digitalCredentials.createdAt))
        .limit(limit)
        .offset(offset);

      return c.json({
        data: {
          credentials: items,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
        error: null,
      });
    },
  )
  .post(
    '/',
    requirePermission('catalog.write'),
    zValidator(
      'json',
      z.object({
        productId: z.string().uuid(),
        variantId: z.string().uuid().optional(),
        credentials: z.array(z.string().min(1)).min(1), // array of stringified JSON or plain text
      }),
    ),
    async (c) => {
      const { productId, variantId, credentials } = c.req.valid('json');

      const values = credentials.map((cred) => {
        const { encryptedData, iv, authTag } = encryptCredential(cred);
        return {
          productId,
          variantId: variantId ?? null,
          encryptedData,
          iv,
          authTag,
          status: 'available',
        };
      });

      await db.insert(digitalCredentials).values(values as any);

      return c.json({
        data: { message: `Successfully added ${credentials.length} credentials.` },
        error: null,
      }, 201);
    },
  )
  .delete(
    '/:id',
    requirePermission('catalog.write'),
    async (c) => {
      const id = c.req.param('id') as string;
      const [cred] = await db.select().from(digitalCredentials).where(eq(digitalCredentials.id, id))
        .limit(1);

      if (!cred) {
        throw new HTTPException(404, { message: 'Credential not found' });
      }

      if (cred.status !== 'available') {
        throw new HTTPException(400, {
          message: 'Cannot delete an assigned or revoked credential',
        });
      }

      await db.delete(digitalCredentials).where(eq(digitalCredentials.id, id));

      return c.json({
        data: { message: 'Credential deleted successfully' },
        error: null,
      });
    },
  );

export default app;
