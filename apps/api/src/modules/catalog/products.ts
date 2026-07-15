import { Hono } from 'hono';
import { zValidator } from '../../middleware/validator.ts';
import {
  brands,
  categories,
  db,
  inventoryLevels,
  productCategories,
  productImages,
  productRatingStats,
  products,
  productSalesStats,
  productVariants,
} from '@starsuperscare/database';
import { and, asc, desc, eq, ilike, isNull, sql } from 'drizzle-orm';
import { ProductListQuerySchema } from '@starsuperscare/contracts';
import { storageAdapter } from '../../adapters/storage.ts';
// no zod
import { HTTPException } from 'hono/http-exception';

type AppContext = {
  Variables: {
    requestId: string;
  };
};

const productsRouter = new Hono<AppContext>();

const routes = productsRouter
  .get(
    '/',
    zValidator('query', ProductListQuerySchema),
    async (c) => {
      type QueryType = {
        page: number;
        per_page: number;
        search?: string;
        category?: string;
        brand?: string;
        min_price?: number;
        max_price?: number;
        min_rating?: number;
        promo?: boolean;
        sort: 'newest' | 'price_asc' | 'price_desc' | 'best_selling';
        in_stock: boolean;
      };
      const query = c.req.valid('query') as QueryType;
      const limit = query.per_page;
      const offset = (query.page - 1) * limit;

      // Only show 'published' products on storefront (single live status after migration)
      const whereClauses = [
        eq(products.status, 'published'),
        isNull(products.deletedAt),
      ];

      if (query.search) {
        whereClauses.push(ilike(products.name, `%${query.search}%`));
      }

      const isUUID = (str: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

      if (query.category) {
        if (isUUID(query.category)) {
          whereClauses.push(eq(categories.id, query.category));
        } else {
          whereClauses.push(eq(categories.slug, query.category));
        }
      }

      if (query.brand) {
        if (isUUID(query.brand)) {
          whereClauses.push(eq(brands.id, query.brand));
        } else {
          whereClauses.push(eq(brands.slug, query.brand));
        }
      }

      const havingClauses = [];
      if (query.min_price !== undefined) {
        havingClauses.push(sql`MIN(${productVariants.price}) >= ${query.min_price}`);
      }
      if (query.max_price !== undefined) {
        havingClauses.push(sql`MIN(${productVariants.price}) <= ${query.max_price}`);
      }
      if (query.in_stock) {
        havingClauses.push(sql`COALESCE(SUM(${inventoryLevels.available}), 0) > 0`);
      }
      if (query.promo) {
        havingClauses.push(
          sql`MAX(${productVariants.comparePrice}) > MIN(${productVariants.price})`,
        );
      }
      if (query.min_rating !== undefined) {
        havingClauses.push(
          sql`COALESCE(${productRatingStats.averageRating}, 0) >= ${query.min_rating}`,
        );
      }

      // FIX: GROUP BY only products.id — stats columns use MAX() aggregation
      // Bug was: including salesStats/ratingStats columns in GROUP BY caused
      // products with multiple stat records to appear as separate groups,
      // resulting in fewer unique products returned than actually exist.
      const baseQuery = db.select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        brandId: products.brandId,
        type: products.type,
        status: products.status,
        publishedAt: products.publishedAt,
        netSold: sql<number>`COALESCE(MAX(${productSalesStats.netSold}), 0)`,
        averageRating: sql<number>`COALESCE(MAX(${productRatingStats.averageRating}), 0)`,
        reviewCount: sql<number>`COALESCE(MAX(${productRatingStats.reviewCount}), 0)`,
        primaryImage: sql<
          string | null
        >`(SELECT object_key FROM sss_product_images WHERE product_id = ${products.id} AND is_primary = true LIMIT 1)`,
        minPrice: sql<number>`COALESCE(MIN(${productVariants.price}), 0)`,
        maxPrice: sql<number>`COALESCE(MAX(${productVariants.price}), 0)`,
        maxComparePrice: sql<number | null>`MAX(${productVariants.comparePrice})`,
        totalAvailableStock: sql<number>`COALESCE(SUM(${inventoryLevels.available}), 0)`,
      })
        .from(products)
        .leftJoin(productSalesStats, eq(productSalesStats.productId, products.id))
        .leftJoin(productRatingStats, eq(productRatingStats.productId, products.id))
        .leftJoin(productVariants, eq(productVariants.productId, products.id))
        .leftJoin(inventoryLevels, eq(inventoryLevels.variantId, productVariants.id))
        .leftJoin(productCategories, eq(productCategories.productId, products.id))
        .leftJoin(categories, eq(categories.id, productCategories.categoryId))
        .leftJoin(brands, eq(brands.id, products.brandId))
        .where(and(...whereClauses))
        .groupBy(products.id) // Only group by PK — correct SQL practice
        .having(havingClauses.length > 0 ? and(...havingClauses) : undefined);

      const fullResults = await baseQuery;
      const total = fullResults.length;

      // FIX: Same GROUP BY fix as baseQuery — only products.id, stats use MAX()
      let finalQuery = db.select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        brandId: products.brandId,
        type: products.type,
        status: products.status,
        publishedAt: products.publishedAt,
        netSold: sql<number>`COALESCE(MAX(${productSalesStats.netSold}), 0)`,
        averageRating: sql<number>`COALESCE(MAX(${productRatingStats.averageRating}), 0)`,
        reviewCount: sql<number>`COALESCE(MAX(${productRatingStats.reviewCount}), 0)`,
        primaryImage: sql<
          string | null
        >`(SELECT object_key FROM sss_product_images WHERE product_id = ${products.id} ORDER BY is_primary DESC, sort_order ASC, created_at ASC LIMIT 1)`,
        images: sql<
          string[]
        >`ARRAY(SELECT object_key FROM sss_product_images WHERE product_id = ${products.id} ORDER BY is_primary DESC, sort_order ASC, created_at ASC LIMIT 10)`,
        minPrice: sql<number>`COALESCE(MIN(${productVariants.price}), 0)`,
        maxPrice: sql<number>`COALESCE(MAX(${productVariants.price}), 0)`,
        maxComparePrice: sql<number | null>`MAX(${productVariants.comparePrice})`,
        totalAvailableStock: sql<number>`COALESCE(SUM(${inventoryLevels.available}), 0)`,
      })
        .from(products)
        .leftJoin(productSalesStats, eq(productSalesStats.productId, products.id))
        .leftJoin(productRatingStats, eq(productRatingStats.productId, products.id))
        .leftJoin(productVariants, eq(productVariants.productId, products.id))
        .leftJoin(inventoryLevels, eq(inventoryLevels.variantId, productVariants.id))
        .leftJoin(productCategories, eq(productCategories.productId, products.id))
        .leftJoin(categories, eq(categories.id, productCategories.categoryId))
        .leftJoin(brands, eq(brands.id, products.brandId))
        .where(and(...whereClauses))
        .groupBy(products.id) // Only group by PK — correct SQL practice
        .having(havingClauses.length > 0 ? and(...havingClauses) : undefined)
        .$dynamic();

      switch (query.sort) {
        case 'price_asc':
          finalQuery = finalQuery.orderBy(sql`MIN(${productVariants.price}) ASC`);
          break;
        case 'price_desc':
          finalQuery = finalQuery.orderBy(sql`MAX(${productVariants.price}) DESC`);
          break;
        case 'best_selling':
          // Use MAX() since netSold is now aggregated
          finalQuery = finalQuery.orderBy(sql`COALESCE(MAX(${productSalesStats.netSold}), 0) DESC`);
          break;
        case 'newest':
        default:
          finalQuery = finalQuery.orderBy(desc(products.publishedAt));
          break;
      }

      const items = await finalQuery.limit(limit).offset(offset);

      const mappedItems = await Promise.all(items.map(async (item) => {
        let primaryImage = null;
        if (item.primaryImage) {
          primaryImage = await storageAdapter.generatePresignedDownloadUrl(item.primaryImage);
        }

        const images = await Promise.all(
          (item.images || []).map((key) => storageAdapter.generatePresignedDownloadUrl(key)),
        );

        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          brandId: item.brandId,
          type: item.type,
          status: item.status,
          netSold: item.netSold ?? 0,
          averageRating: item.averageRating ?? 0,
          reviewCount: item.reviewCount ?? 0,
          primaryImage,
          images,
          variantsSummary: {
            minPrice: Number(item.minPrice),
            maxPrice: Number(item.maxPrice),
            maxComparePrice: item.maxComparePrice ? Number(item.maxComparePrice) : null,
            totalAvailableStock: Number(item.totalAvailableStock),
          },
        };
      }));

      return c.json({
        data: {
          items: mappedItems,
          total,
          page: query.page,
          perPage: limit,
          totalPages: Math.ceil(total / limit),
        },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    },
  )
  .get(
    '/:slug',
    async (c) => {
      const slug = c.req.param('slug');

      const [product] = await db.select().from(products)
        .where(and(
          eq(products.slug, slug),
          eq(products.status, 'published'),
          isNull(products.deletedAt),
        ))
        .limit(1);

      if (!product) {
        throw new HTTPException(404, { message: 'Product not found' });
      }

      const variantsDataRaw = await db.select({
        id: productVariants.id,
        sku: productVariants.sku,
        price: productVariants.price,
        comparePrice: productVariants.comparePrice,
        availableStock: inventoryLevels.available,
        optionValues: productVariants.optionValues,
      })
        .from(productVariants)
        .leftJoin(inventoryLevels, eq(productVariants.id, inventoryLevels.variantId))
        .where(
          and(
            eq(productVariants.productId, product.id),
            isNull(productVariants.deletedAt),
          ),
        );

      const variantsData = variantsDataRaw.map((v) => ({
        ...v,
        availableStock: v.availableStock || 0,
        size: (v.optionValues as any)?.size || null,
      }));

      const imagesData = await db.select({ objectKey: productImages.objectKey })
        .from(productImages)
        .where(eq(productImages.productId, product.id))
        .orderBy(asc(productImages.sortOrder));

      const categoriesData = await db.select({
        id: categories.id,
        parentId: categories.parentId,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
      })
        .from(productCategories)
        .innerJoin(categories, eq(categories.id, productCategories.categoryId))
        .where(eq(productCategories.productId, product.id));

      let brandData = null;
      if (product.brandId) {
        const [brand] = await db.select().from(brands).where(eq(brands.id, product.brandId)).limit(
          1,
        );
        brandData = brand;
      }

      const [salesStats] = await db.select().from(productSalesStats).where(
        eq(productSalesStats.productId, product.id),
      ).limit(1);
      const [ratingStats] = await db.select().from(productRatingStats).where(
        eq(productRatingStats.productId, product.id),
      ).limit(1);

      const minPrice = variantsData.length > 0
        ? Math.min(...variantsData.map((v) => Number(v.price)))
        : 0;
      const maxPrice = variantsData.length > 0
        ? Math.max(...variantsData.map((v) => Number(v.price)))
        : 0;
      const totalAvailableStock = variantsData.reduce(
        (sum, v) => sum + Number(v.availableStock ?? 0),
        0,
      );

      const images = await Promise.all(
        imagesData.map((i) => storageAdapter.generatePresignedDownloadUrl(i.objectKey)),
      );

      const primaryImage = images.length > 0 ? images[0] : null;

      const responseData = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        brandId: product.brandId,
        type: product.type,
        status: product.status,
        description: product.description,
        purchaseLimit: product.purchaseLimit,
        netSold: salesStats?.netSold ?? 0,
        averageRating: ratingStats?.averageRating ?? 0,
        reviewCount: ratingStats?.reviewCount ?? 0,
        primaryImage,
        variantsSummary: {
          minPrice,
          maxPrice,
          totalAvailableStock,
        },
        brand: brandData,
        categories: categoriesData,
        variants: variantsData.map((v) => ({
          ...v,
          price: Number(v.price),
          comparePrice: v.comparePrice ? Number(v.comparePrice) : null,
          availableStock: Number(v.availableStock ?? 0),
        })),
        images,
      };

      return c.json({
        data: responseData,
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    },
  );

export default routes;
