import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { brands, db } from '@starsuperscare/database';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { logAudit } from '../../../utils/audit.ts';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

const app = new Hono<AuthContext>();

app.use('*', authMiddleware);
app.use('*', requirePermission('catalog.read'));

app.post(
  '/',
  requirePermission('catalog.write'),
  zValidator('json', z.object({ name: z.string(), slug: z.string() })),
  async (c) => {
    const { name, slug } = c.req.valid('json');
    const user = c.get('user');

    // Check slug conflict
    const existing = await db.select().from(brands).where(eq(brands.slug, slug)).limit(1);
    if (existing.length > 0) {
      throw new HTTPException(409, { message: 'Brand slug already exists' });
    }

    const brand = await db.transaction(async (tx) => {
      const [newBrand] = await tx.insert(brands).values({ name, slug }).returning();
      await logAudit(tx, {
        actorId: user.id,
        entityType: 'brand',
        entityId: newBrand.id,
        action: 'create',
        changes: { after: newBrand },
      });
      return newBrand;
    });

    return c.json({ data: brand, meta: { request_id: c.get('requestId') }, error: null }, 201);
  },
);

export default app;
