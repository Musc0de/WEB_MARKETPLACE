import { Hono } from 'hono';
import {
  cartItems,
  carts,
  db,
  invoices,
  orderAddresses,
  orderItems,
  orders,
  orderStatusHistory,
  payments,
  productImages,
  products,
  productVariants,
  shipments,
  userProfiles,
  users,
} from '@starsuperscare/database';
import { and, count, desc, eq, inArray, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';

const app = new Hono<AuthContext>();

const routes = app
  .use('*', authMiddleware)
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        tab: z.enum(['semua', 'aktif', 'selesai', 'dibatalkan', 'refund']).default('semua'),
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(10),
      }),
    ),
    async (c) => {
      const user = c.get('user');
      const { tab, page, limit } = c.req.valid('query');
      const offset = (page - 1) * limit;

      let statusFilter;
      switch (tab) {
        case 'aktif':
          statusFilter = inArray(orders.status, ['pending', 'paid', 'processing', 'shipped']);
          break;
        case 'selesai':
          statusFilter = eq(orders.status, 'delivered');
          break;
        case 'dibatalkan':
          statusFilter = eq(orders.status, 'cancelled');
          break;
        case 'refund':
          statusFilter = eq(orders.status, 'refunded');
          break;
        case 'semua':
        default:
          statusFilter = undefined; // No filter
      }

      const conditions = statusFilter
        ? and(eq(orders.userId, user.id), statusFilter)
        : eq(orders.userId, user.id);

      // Get total count for pagination
      const [totalResult] = await db
        .select({ count: count() })
        .from(orders)
        .where(conditions);
      const total = totalResult.count;

      // Fetch paginated orders
      const orderList = await db
        .select()
        .from(orders)
        .where(conditions)
        .orderBy(desc(orders.createdAt))
        .limit(limit)
        .offset(offset);

      // Fetch rich items (with variant & image) for these orders
      const orderIds = orderList.map((o) => o.id);
      const itemsMap: Record<string, any[]> = {};

      if (orderIds.length > 0) {
        // Join orderItems → productVariants to get comparePrice + optionValues
        const allItems = await db
          .select({
            orderId: orderItems.orderId,
            orderItemId: orderItems.id,
            productId: orderItems.productId,
            variantId: orderItems.variantId,
            productName: orderItems.productNameSnapshot,
            variantSku: orderItems.variantSkuSnapshot,
            quantity: orderItems.quantity,
            priceSnapshot: orderItems.priceSnapshot,
            comparePrice: productVariants.comparePrice,
            optionValues: productVariants.optionValues,
          })
          .from(orderItems)
          .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
          .where(inArray(orderItems.orderId, orderIds));

        // Fetch primary images for each unique product
        const uniqueProductIds = [...new Set(allItems.map((i) => i.productId))];
        const imageRows = uniqueProductIds.length > 0
          ? await db
            .select({
              productId: productImages.productId,
              objectKey: productImages.objectKey,
              isPrimary: productImages.isPrimary,
              sortOrder: productImages.sortOrder,
            })
            .from(productImages)
            .where(inArray(productImages.productId, uniqueProductIds))
          : [];

        // Build full public URLs using server-side R2_PUBLIC_URL env var
        // This is built on the server so the frontend never needs R2 config
        const r2BaseUrl = Deno.env.get('R2_PUBLIC_URL') || '';
        const imageMap: Record<string, string[]> = {};
        for (const img of imageRows) {
          if (!imageMap[img.productId]) imageMap[img.productId] = [];
          // Build the full CDN URL on the server side
          imageMap[img.productId].push(`${r2BaseUrl}/${img.objectKey}`);
        }

        for (const item of allItems) {
          if (!itemsMap[item.orderId]) {
            itemsMap[item.orderId] = [];
          }
          // Only send the first (primary) image URL — caller shows 1 image per item
          const allImageUrls = imageMap[item.productId] || [];
          itemsMap[item.orderId].push({
            ...item,
            imageUrl: allImageUrls[0] ?? null,
          });
        }
      }

      const enrichedOrders = orderList.map((o) => ({
        ...o,
        items: itemsMap[o.id] || [],
      }));

      return c.json({
        data: {
          orders: enrichedOrders,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    },
  )
  .get('/:id', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, id), eq(orders.userId, user.id)))
      .limit(1);

    if (!order) {
      throw new HTTPException(404, { message: 'Order not found' });
    }

    const rawItems = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        variantId: orderItems.variantId,
        quantity: orderItems.quantity,
        priceSnapshot: orderItems.priceSnapshot,
        productNameSnapshot: orderItems.productNameSnapshot,
        variantSkuSnapshot: orderItems.variantSkuSnapshot,
        productSlug: products.slug,
        comparePrice: productVariants.comparePrice,
        optionValues: productVariants.optionValues,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
      .where(eq(orderItems.orderId, id));

    // Fetch primary image for each unique product
    const uniqueProductIds = [...new Set(rawItems.map((i) => i.productId))];
    const r2Base = Deno.env.get('R2_PUBLIC_URL') || '';
    const imageRows = uniqueProductIds.length > 0
      ? await db
        .select({
          productId: productImages.productId,
          objectKey: productImages.objectKey,
          isPrimary: productImages.isPrimary,
        })
        .from(productImages)
        .where(inArray(productImages.productId, uniqueProductIds))
      : [];

    // Build productId → first image URL map
    const imageMap: Record<string, string> = {};
    for (const img of imageRows) {
      if (!imageMap[img.productId]) {
        imageMap[img.productId] = `${r2Base}/${img.objectKey}`;
      }
    }

    // Attach imageUrl to each item
    const items = rawItems.map((item) => ({
      ...item,
      imageUrl: imageMap[item.productId] ?? null,
    }));

    const [addresses] = await db
      .select()
      .from(orderAddresses)
      .where(eq(orderAddresses.orderId, id))
      .limit(1);

    const history = await db
      .select()
      .from(orderStatusHistory)
      .where(eq(orderStatusHistory.orderId, id))
      .orderBy(desc(orderStatusHistory.createdAt));

    return c.json({
      data: {
        order,
        items,
        addresses: addresses || null,
        history,
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  })
  .get('/:id/invoice-data', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, id), eq(orders.userId, user.id)))
      .limit(1);

    if (!order) {
      throw new HTTPException(404, { message: 'Order not found' });
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    const [addresses] = await db
      .select()
      .from(orderAddresses)
      .where(eq(orderAddresses.orderId, id))
      .limit(1);

    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, id))
      .limit(1);

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.orderId, id))
      .limit(1);

    const [shipment] = await db
      .select()
      .from(shipments)
      .where(eq(shipments.orderId, id))
      .limit(1);

    const [customer] = await db
      .select({
        name: userProfiles.fullName,
        email: users.emailDisplay,
      })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(users.id, user.id))
      .limit(1);

    return c.json({
      data: {
        order,
        items,
        addresses: addresses || null,
        payment: payment || null,
        invoice: invoice || null,
        shipment: shipment || null,
        customer,
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  })
  .post('/:id/buy-again', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    // 1. Verify order ownership
    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, id), eq(orders.userId, user.id)))
      .limit(1);

    if (!order) {
      throw new HTTPException(404, { message: 'Order not found' });
    }

    // 2. Resolve or create user's active cart
    const activeCarts = await db
      .select({ id: carts.id })
      .from(carts)
      .where(and(eq(carts.userId, user.id), eq(carts.status, 'active')))
      .limit(1);

    let cartId;
    if (activeCarts.length > 0) {
      cartId = activeCarts[0].id;
    } else {
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      const [newCart] = await db.insert(carts).values({
        userId: user.id,
        status: 'active',
        expiresAt: expiresAt.toISOString(),
      }).returning({ id: carts.id });
      cartId = newCart.id;
    }

    // 3. Fetch order items to re-buy
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    const addedItems: string[] = [];
    const outOfStockItems: string[] = [];

    await db.transaction(async (tx) => {
      for (const item of items) {
        // Revalidate product and variant stock
        const [variant] = await tx
          .select({
            id: productVariants.id,
            price: productVariants.price,
            availableStock: sql<
              number
            >`(SELECT available FROM sss_inventory_levels WHERE variant_id = ${productVariants.id})`
              .mapWith(Number),
            status: products.status,
          })
          .from(productVariants)
          .innerJoin(products, eq(productVariants.productId, products.id))
          .where(eq(productVariants.id, item.variantId))
          .limit(1);

        if (!variant || variant.status !== 'published' || variant.availableStock <= 0) {
          outOfStockItems.push(item.productNameSnapshot);
          continue;
        }

        const quantityToAdd = Math.min(item.quantity, variant.availableStock);

        // Check if item already exists in cart
        const existing = await tx
          .select({ id: cartItems.id, quantity: cartItems.quantity })
          .from(cartItems)
          .where(and(eq(cartItems.cartId, cartId), eq(cartItems.variantId, item.variantId)))
          .limit(1);

        if (existing.length > 0) {
          await tx
            .update(cartItems)
            .set({ quantity: existing[0].quantity + quantityToAdd })
            .where(eq(cartItems.id, existing[0].id));
        } else {
          await tx
            .insert(cartItems)
            .values({
              cartId,
              variantId: item.variantId,
              quantity: quantityToAdd,
              priceObservation: variant.price,
            });
        }
        addedItems.push(item.productNameSnapshot);
      }
    });

    return c.json({
      data: {
        success: true,
        addedCount: addedItems.length,
        addedItems,
        outOfStockItems,
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  });

export default routes;
