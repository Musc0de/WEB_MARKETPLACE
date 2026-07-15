import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db, reviews, users } from '@starsuperscare/database';
import { and, desc, eq, isNull } from 'drizzle-orm';

const reviewReadRouter = new Hono<{ Variables: { requestId: string } }>();

const QuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
});

reviewReadRouter.get(
  '/products/:productId/reviews',
  zValidator('param', z.object({ productId: z.string().uuid() })),
  zValidator('query', QuerySchema),
  async (c) => {
    const { productId } = c.req.valid('param');
    const { page, limit } = c.req.valid('query');

    const offset = (page - 1) * limit;

    const query = db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        title: reviews.title,
        content: reviews.content,
        isVerifiedPurchase: reviews.isVerifiedPurchase,
        sellerResponse: reviews.sellerResponse,
        publishedAt: reviews.publishedAt,
        user: {
          id: users.id,
          username: users.usernameDisplay,
        },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(
        and(
          eq(reviews.productId, productId),
          eq(reviews.moderationStatus, 'approved'),
          isNull(reviews.deletedAt),
        ),
      )
      .orderBy(desc(reviews.publishedAt))
      .limit(limit)
      .offset(offset);

    const data = await query;

    return c.json({
      data,
      meta: { page, limit, request_id: c.get('requestId') || crypto.randomUUID() },
      error: null,
    });
  },
);

export default reviewReadRouter;
