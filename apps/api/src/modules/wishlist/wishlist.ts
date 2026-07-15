import { Hono } from 'hono';
import { zValidator } from '../../middleware/validator.ts';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';
import {
  db,
  inventoryLevels,
  productImages,
  productRatingStats,
  products,
  productSalesStats,
  productVariants,
  wishlists,
} from '@starsuperscare/database';
import { and, eq, sql } from 'drizzle-orm';
import {
  AddWishlistRequestSchema,
  MergeWishlistRequestSchema,
  RemoveWishlistRequestSchema,
} from '@starsuperscare/contracts';
import { storageAdapter } from '../../adapters/storage.ts';

type AppContext = {
  Variables: AuthContext['Variables'] & {
    requestId: string;
  };
};

const router = new Hono<AppContext>();

router.use('*', authMiddleware);

const routes = router
  .get('/', async (c) => {
    const session = c.get('session');
    if (!session?.userId) return c.json({ error: 'Unauthorized' }, 401);

    const items = await db.select({
      id: wishlists.id,
      productId: wishlists.productId,
      createdAt: wishlists.createdAt,
      product: {
        id: products.id,
        name: products.name,
        slug: products.slug,
        brandId: products.brandId,
        type: products.type,
        status: products.status,
        netSold: sql<number>`COALESCE(${productSalesStats.netSold}, 0)::int`,
        averageRating: sql<number>`COALESCE(${productRatingStats.averageRating}, 0)::float`,
        reviewCount: sql<number>`COALESCE(${productRatingStats.reviewCount}, 0)::int`,
        primaryImage: sql<string>`(
          SELECT object_key FROM ${productImages}
          WHERE product_id = ${products.id}
          ORDER BY sort_order ASC
          LIMIT 1
        )`,
      },
      minPrice: sql<number>`MIN(${productVariants.price})::int`.mapWith(Number),
      maxPrice: sql<number>`MAX(${productVariants.price})::int`.mapWith(Number),
      totalAvailableStock: sql<number>`COALESCE(SUM(${inventoryLevels.available}), 0)::int`.mapWith(
        Number,
      ),
    })
      .from(wishlists)
      .leftJoin(products, eq(wishlists.productId, products.id))
      .leftJoin(productSalesStats, eq(products.id, productSalesStats.productId))
      .leftJoin(productRatingStats, eq(products.id, productRatingStats.productId))
      .leftJoin(productVariants, eq(products.id, productVariants.productId))
      .leftJoin(inventoryLevels, eq(productVariants.id, inventoryLevels.variantId))
      .where(eq(wishlists.userId, session.userId))
      .groupBy(
        wishlists.id,
        products.id,
        productSalesStats.netSold,
        productRatingStats.averageRating,
        productRatingStats.reviewCount,
      )
      .orderBy(wishlists.createdAt);

    const formattedItems = await Promise.all(items.map(async ({ minPrice, maxPrice, totalAvailableStock, ...item }) => {
      let primaryImage = null;
      if (item.product?.primaryImage) {
        primaryImage = await storageAdapter.generatePresignedDownloadUrl(item.product.primaryImage);
      }

      return {
        ...item,
        product: item.product
          ? {
            ...item.product,
            primaryImage,
            variantsSummary: { minPrice, maxPrice, totalAvailableStock },
          }
          : null,
        createdAt: item.createdAt instanceof Date
          ? item.createdAt.toISOString()
          : new Date(item.createdAt as any).toISOString(),
      };
    }));

    return c.json({
      data: formattedItems,
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  })
  .post('/add', zValidator('json', AddWishlistRequestSchema), async (c) => {
    const session = c.get('session');
    if (!session?.userId) return c.json({ error: 'Unauthorized' }, 401);

    const { productId } = c.req.valid('json');

    await db.insert(wishlists)
      .values({
        userId: session.userId,
        productId,
      })
      .onConflictDoNothing({ target: [wishlists.userId, wishlists.productId] });

    return c.json({ success: true, meta: { request_id: c.get('requestId') } });
  })
  .post('/remove', zValidator('json', RemoveWishlistRequestSchema), async (c) => {
    const session = c.get('session');
    if (!session?.userId) return c.json({ error: 'Unauthorized' }, 401);

    const { productId } = c.req.valid('json');

    await db.delete(wishlists)
      .where(and(eq(wishlists.userId, session.userId), eq(wishlists.productId, productId)));

    return c.json({ success: true, meta: { request_id: c.get('requestId') } });
  })
  .post('/merge', zValidator('json', MergeWishlistRequestSchema), async (c) => {
    const session = c.get('session');
    if (!session?.userId) return c.json({ error: 'Unauthorized' }, 401);

    const { productIds } = c.req.valid('json');

    if (productIds.length > 0) {
      const values = productIds.map((productId: string) => ({
        userId: session.userId as string,
        productId,
      }));

      await db.insert(wishlists)
        .values(values)
        .onConflictDoNothing({ target: [wishlists.userId, wishlists.productId] });
    }

    return c.json({ success: true, meta: { request_id: c.get('requestId') } });
  });

export { routes as wishlistRouter };
