import { Hono } from 'hono';
import { zValidator } from '../../middleware/validator.ts';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';
import {
  db,
  orderItems,
  orders,
  productImages,
  productRatingStats,
  reviews,
} from '@starsuperscare/database';
import { and, desc, eq, inArray, isNull, sql } from 'drizzle-orm';
import { createReviewRequestSchema, updateReviewRequestSchema } from '@starsuperscare/contracts';

type AppContext = {
  Variables: AuthContext['Variables'] & {
    requestId: string;
  };
};

const app = new Hono<AppContext>();

app.use('*', authMiddleware);

// GET /v1/reviews/eligible
// Returns order items that belong to the user, are from paid/shipped/delivered orders, and haven't been reviewed yet
app.get('/eligible', async (c) => {
  const userId = c.get('user').id;

  const items = await db.select({
    orderItemId: orderItems.id,
    orderId: orders.id,
    orderNumber: orders.orderNumber,
    productId: orderItems.productId,
    variantId: orderItems.variantId,
    productName: orderItems.productNameSnapshot,
    variantSku: orderItems.variantSkuSnapshot,
    purchasedAt: orders.createdAt,
    primaryImage: sql<string>`(
      SELECT object_key FROM ${productImages}
      WHERE product_id = ${orderItems.productId}
      ORDER BY sort_order ASC
      LIMIT 1
    )`,
  })
    .from(orderItems)
    .innerJoin(orders, eq(orders.id, orderItems.orderId))
    .leftJoin(reviews, eq(reviews.orderItemId, orderItems.id))
    .where(
      and(
        eq(orders.userId, userId),
        inArray(orders.status, ['paid', 'processing', 'shipped', 'delivered']),
        isNull(reviews.id),
      ),
    )
    .orderBy(desc(orders.createdAt));

  return c.json({
    data: items,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// GET /v1/reviews
app.get('/', async (c) => {
  const userId = c.get('user').id;

  const items = await db.select()
    .from(reviews)
    .where(eq(reviews.userId, userId))
    .orderBy(desc(reviews.createdAt));

  return c.json({
    data: items.map((r) => ({
      ...r,
      publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString() : null,
      createdAt: new Date(r.createdAt).toISOString(),
      updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
    })),
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// POST /v1/reviews
app.post('/', zValidator('json', createReviewRequestSchema), async (c) => {
  const userId = c.get('user').id;
  const payload = c.req.valid('json');

  // Verify ownership and eligibility
  const [eligibleItem] = await db.select({ id: orderItems.id })
    .from(orderItems)
    .innerJoin(orders, eq(orders.id, orderItems.orderId))
    .leftJoin(reviews, eq(reviews.orderItemId, orderItems.id))
    .where(
      and(
        eq(orders.userId, userId),
        eq(orderItems.id, payload.orderItemId),
        eq(orderItems.productId, payload.productId),
        isNull(reviews.id),
      ),
    )
    .limit(1);

  if (!eligibleItem) {
    return c.json({ error: 'Order item is not eligible for review or already reviewed' }, 400);
  }

  const [review] = await db.insert(reviews)
    .values({
      userId,
      productId: payload.productId,
      orderItemId: payload.orderItemId,
      rating: payload.rating,
      title: payload.title || null,
      content: payload.content || null,
      isVerifiedPurchase: 1,
      moderationStatus: 'approved', // auto-approve for now
      publishedAt: new Date().toISOString(),
    })
    .returning();

  // Update rating stats asynchronously (or trigger worker)
  // For simplicity, do it synchronously here
  await db.execute(sql`
    INSERT INTO ${productRatingStats} (product_id, average_rating, review_count, updated_at)
    VALUES (
      ${payload.productId}, 
      ${payload.rating * 100}, 
      1, 
      NOW()
    )
    ON CONFLICT (product_id) DO UPDATE SET
      average_rating = (
        SELECT CAST(AVG(rating) * 100 AS INTEGER) FROM ${reviews} WHERE product_id = ${payload.productId} AND moderation_status = 'approved'
      ),
      review_count = (
        SELECT COUNT(*) FROM ${reviews} WHERE product_id = ${payload.productId} AND moderation_status = 'approved'
      ),
      updated_at = NOW()
  `);

  return c.json({
    data: review,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// PUT /v1/reviews/:id
app.put('/:id', zValidator('json', updateReviewRequestSchema), async (c) => {
  const userId = c.get('user').id;
  const reviewId = c.req.param('id');
  const payload = c.req.valid('json');

  const updates: any = { updatedAt: new Date().toISOString() };
  if (payload.rating !== undefined) updates.rating = payload.rating;
  if (payload.title !== undefined) updates.title = payload.title || null;
  if (payload.content !== undefined) updates.content = payload.content || null;

  const [review] = await db.update(reviews)
    .set(updates)
    .where(and(eq(reviews.id, reviewId), eq(reviews.userId, userId)))
    .returning();

  if (!review) {
    return c.json({ error: 'Review not found' }, 404);
  }

  if (payload.rating !== undefined) {
    await db.execute(sql`
      UPDATE ${productRatingStats}
      SET 
        average_rating = (
          SELECT CAST(AVG(rating) * 100 AS INTEGER) FROM ${reviews} WHERE product_id = ${review.productId} AND moderation_status = 'approved'
        ),
        updated_at = NOW()
      WHERE product_id = ${review.productId}
    `);
  }

  return c.json({
    data: review,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// DELETE /v1/reviews/:id
app.delete('/:id', async (c) => {
  const userId = c.get('user').id;
  const reviewId = c.req.param('id');

  const [review] = await db.delete(reviews)
    .where(and(eq(reviews.id, reviewId), eq(reviews.userId, userId)))
    .returning();

  if (!review) {
    return c.json({ error: 'Review not found' }, 404);
  }

  await db.execute(sql`
    UPDATE ${productRatingStats}
    SET 
      average_rating = COALESCE((
        SELECT CAST(AVG(rating) * 100 AS INTEGER) FROM ${reviews} WHERE product_id = ${review.productId} AND moderation_status = 'approved'
      ), 0),
      review_count = (
        SELECT COUNT(*) FROM ${reviews} WHERE product_id = ${review.productId} AND moderation_status = 'approved'
      ),
      updated_at = NOW()
    WHERE product_id = ${review.productId}
  `);

  return c.json({
    data: { success: true },
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

export { app as reviewsRouter };
