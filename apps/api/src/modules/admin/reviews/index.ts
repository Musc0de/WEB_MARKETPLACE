import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { desc, eq, sql } from 'drizzle-orm';
import {
  db,
  productRatingStats,
  products,
  reviews,
  systemAuditLogs,
  users,
} from '@starsuperscare/database';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';

const app = new Hono<AuthContext>();

const ReviewModerationSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  reason: z.string().min(1, 'Reason is required for audit logs'),
});

const routes = app
  .use('*', authMiddleware)
  .get('/', requirePermission('catalog.read'), async (c) => {
    // Basic listing of reviews
    const allReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        title: reviews.title,
        content: reviews.content,
        moderationStatus: reviews.moderationStatus,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          name: users.usernameDisplay,
        },
        product: {
          id: products.id,
          name: products.name,
        },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .innerJoin(products, eq(reviews.productId, products.id))
      .orderBy(desc(reviews.createdAt))
      .limit(100);

    return c.json({ data: allReviews }, 200);
  })
  .post(
    '/:id/moderate',
    requirePermission('catalog.write'),
    zValidator('param', z.object({ id: z.string().uuid() })),
    zValidator('json', ReviewModerationSchema),
    async (c) => {
      const { id } = c.req.valid('param');
      const { status, reason } = c.req.valid('json');
      const user = c.get('user');

      try {
        await db.transaction(async (tx) => {
          const [review] = await tx
            .select()
            .from(reviews)
            .where(eq(reviews.id, id));

          if (!review) {
            throw new Error('Review not found');
          }

          if (review.moderationStatus === status) {
            return; // Idempotent
          }

          const oldStatus = review.moderationStatus;

          // Update review status
          await tx
            .update(reviews)
            .set({
              moderationStatus: status,
              updatedAt: new Date().toISOString(),
            })
            .where(eq(reviews.id, id));

          // Log the action
          await tx.insert(systemAuditLogs).values({
            entityType: 'review',
            entityId: id,
            action: `moderate_${status}`,
            actorId: user.id,
            changes: {
              before: { status: oldStatus },
              after: { status, reason },
            },
          });

          // Recalculate stats only if moving to/from 'approved'
          if (status === 'approved' || oldStatus === 'approved') {
            const productReviews = await tx
              .select({
                rating: reviews.rating,
              })
              .from(reviews)
              .where(
                sql`${reviews.productId} = ${review.productId} AND ${reviews.moderationStatus} = 'approved'`,
              );

            const count = productReviews.length;
            const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
            const averageRating = count > 0 ? Math.round((sum / count) * 100) : 0;

            await tx
              .insert(productRatingStats)
              .values({
                productId: review.productId,
                averageRating,
                reviewCount: count,
              })
              .onConflictDoUpdate({
                target: productRatingStats.productId,
                set: {
                  averageRating,
                  reviewCount: count,
                  updatedAt: new Date().toISOString(),
                },
              });
          }
        });

        return c.json({ data: { success: true } }, 200);
      } catch (error: any) {
        if (error.message === 'Review not found') {
          return c.json({ error: { code: 'NOT_FOUND', message: 'Review not found' } }, 404);
        }
        throw error;
      }
    },
  );

export default routes;
