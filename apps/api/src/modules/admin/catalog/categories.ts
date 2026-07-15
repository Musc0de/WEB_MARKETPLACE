import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { categories, db } from '@starsuperscare/database';
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
  zValidator(
    'json',
    z.object({ name: z.string(), slug: z.string(), parentId: z.string().uuid().optional() }),
  ),
  async (c) => {
    const { name, slug, parentId } = c.req.valid('json');
    const user = c.get('user');

    const existing = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    if (existing.length > 0) {
      throw new HTTPException(409, { message: 'Category slug already exists' });
    }

    const category = await db.transaction(async (tx) => {
      const [newCat] = await tx.insert(categories).values({
        name,
        slug,
        parentId: parentId || null,
      }).returning();
      await logAudit(tx, {
        actorId: user.id,
        entityType: 'category',
        entityId: newCat.id,
        action: 'create',
        changes: { after: newCat },
      });
      return newCat;
    });

    return c.json({ data: category, meta: { request_id: c.get('requestId') }, error: null }, 201);
  },
);

export default app;
