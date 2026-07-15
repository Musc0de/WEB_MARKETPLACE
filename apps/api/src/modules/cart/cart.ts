import { Hono } from 'hono';
import { zValidator } from '../../middleware/validator.ts';
import { AuthContext, optionalAuthMiddleware } from '../../middleware/auth.ts';
import { computeSha256 } from '../../utils/crypto.ts';
import {
  cartItems,
  carts,
  db,
  productImages,
  products,
  productVariants,
} from '@starsuperscare/database';
import { and, eq, gt, inArray, sql } from 'drizzle-orm';
import {
  AddCartItemRequestSchema,
  CartItemStatus,
  MergeCartRequestSchema,
  UpdateCartItemRequestSchema,
} from '@starsuperscare/contracts';

type AppContext = {
  Variables: AuthContext['Variables'] & {
    requestId: string;
  };
};

const router = new Hono<AppContext>();

router.use('*', optionalAuthMiddleware);

/**
 * Helper to resolve the active cart for the current request.
 */
export async function resolveActiveCart(c: any, createIfMissing = false) {
  const session = c.get('session');
  const guestToken = c.req.header('X-Cart-Token');

  let activeCartId: string | null = null;
  let newGuestToken: string | undefined = undefined;

  if (session?.userId) {
    const activeCarts = await db.select({ id: carts.id })
      .from(carts)
      .where(and(eq(carts.userId, session.userId), eq(carts.status, 'active')))
      .limit(1);

    if (activeCarts.length > 0) {
      activeCartId = activeCarts[0].id;
    } else if (createIfMissing) {
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const [newCart] = await db.insert(carts).values({
        userId: session.userId,
        status: 'active',
        expiresAt: expiresAt.toISOString(),
      }).returning({ id: carts.id });
      activeCartId = newCart.id;
    }
  } else {
    if (guestToken) {
      const digest = await computeSha256(guestToken);
      const activeCarts = await db.select({ id: carts.id })
        .from(carts)
        .where(and(
          eq(carts.guestTokenHash, digest),
          eq(carts.status, 'active'),
          gt(carts.expiresAt, new Date().toISOString()),
        ))
        .limit(1);

      if (activeCarts.length > 0) {
        activeCartId = activeCarts[0].id;
      }
    }

    if (!activeCartId && createIfMissing) {
      newGuestToken = crypto.randomUUID();
      const digest = await computeSha256(newGuestToken);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const [newCart] = await db.insert(carts).values({
        guestTokenHash: digest,
        status: 'active',
        expiresAt: expiresAt.toISOString(),
      }).returning({ id: carts.id });

      activeCartId = newCart.id;
    }
  }

  return { cartId: activeCartId, guestToken: newGuestToken };
}

const routes = router
  .get('/', async (c) => {
    const { cartId } = await resolveActiveCart(c, false);

    if (!cartId) {
      return c.json({
        data: { items: [], summary: { subtotal: 0, totalDiscount: 0, grandTotal: 0 } },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    }

    const items = await db.select({
      id: cartItems.id,
      variantId: cartItems.variantId,
      quantity: cartItems.quantity,
      selected: cartItems.selected,
      saveForLater: cartItems.saveForLater,
      priceObservation: cartItems.priceObservation,
      note: cartItems.note,
      createdAt: cartItems.createdAt,
      variant: {
        id: productVariants.id,
        sku: productVariants.sku,
        price: productVariants.price,
        comparePrice: productVariants.comparePrice,
        availableStock: sql<
          number
        >`(SELECT available FROM sss_inventory_levels WHERE variant_id = ${productVariants.id})`
          .mapWith(Number),
      },
      product: {
        id: products.id,
        name: products.name,
        slug: products.slug,
        brandId: products.brandId,
        type: products.type,
        status: products.status,
        netSold: sql<number>`0`.mapWith(Number),
        averageRating: sql<number>`0`.mapWith(Number),
        reviewCount: sql<number>`0`.mapWith(Number),
        primaryImage: sql<string>`(
          SELECT object_key FROM ${productImages}
          WHERE product_id = ${products.id}
          ORDER BY sort_order ASC
          LIMIT 1
        )`,
      },
    })
      .from(cartItems)
      .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(eq(cartItems.cartId, cartId))
      .orderBy(cartItems.createdAt);

    let subtotal = 0;
    let totalDiscount = 0;

    const idsToDelete: string[] = [];
    const updates: { id: string; quantity?: number; priceObservation?: number }[] = [];

    const formattedItems = items.map((item) => {
      let status: CartItemStatus = 'available';
      let finalQuantity = item.quantity;

      const currentPrice = Number(item.variant.price);
      const observedPrice = item.priceObservation ? Number(item.priceObservation) : currentPrice;

      if (item.product.status !== 'published' && item.product.status !== 'active') {
        status = 'inactive';
        idsToDelete.push(item.id);
      } else if (item.variant.availableStock <= 0) {
        status = 'out_of_stock';
      } else if (item.variant.availableStock < item.quantity) {
        status = 'quantity_adjusted';
        finalQuantity = item.variant.availableStock;
        updates.push({ id: item.id, quantity: finalQuantity });
      } else if (observedPrice !== currentPrice) {
        status = 'price_changed';
        updates.push({ id: item.id, priceObservation: currentPrice });
      }

      const lineTotal = finalQuantity * currentPrice;

      // Calculate totals for active, non-saved items
      if (
        item.selected && !item.saveForLater && status !== 'inactive' && status !== 'out_of_stock'
      ) {
        subtotal += lineTotal;
        if (item.variant.comparePrice && Number(item.variant.comparePrice) > currentPrice) {
          totalDiscount += (Number(item.variant.comparePrice) - currentPrice) * finalQuantity;
        }
      }

      return {
        id: item.id,
        variantId: item.variantId,
        quantity: finalQuantity,
        selected: Boolean(item.selected),
        saveForLater: Boolean(item.saveForLater),
        priceObservation: observedPrice,
        note: item.note,
        createdAt: item.createdAt,
        status,
        lineTotal,
        variant: {
          ...item.variant,
          price: currentPrice,
          comparePrice: item.variant.comparePrice ? Number(item.variant.comparePrice) : undefined,
        },
        product: {
          ...item.product,
          variantsSummary: { minPrice: 0, totalAvailableStock: 0 },
        },
      };
    });

    // Background cleanup (Fire and forget, but wrapped in try/catch)
    // For transactional safety, we execute them immediately.
    if (idsToDelete.length > 0) {
      await db.delete(cartItems).where(inArray(cartItems.id, idsToDelete)).catch(console.error);
    }
    for (const update of updates) {
      const setVals: any = {};
      if (update.quantity !== undefined) setVals.quantity = update.quantity;
      if (update.priceObservation !== undefined) setVals.priceObservation = update.priceObservation;
      await db.update(cartItems).set(setVals).where(eq(cartItems.id, update.id)).catch(
        console.error,
      );
    }

    return c.json({
      data: {
        items: formattedItems.filter((i) => i.status !== 'inactive'), // Exclude deleted from response
        summary: {
          subtotal,
          totalDiscount,
          grandTotal: subtotal,
        },
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  })
  .post('/merge', zValidator('json', MergeCartRequestSchema), async (c) => {
    const { guestToken } = c.req.valid('json');
    const session = c.get('session');

    if (!session?.userId) {
      return c.json({ error: 'Must be logged in to merge' }, 401);
    }

    const digest = await computeSha256(guestToken);

    await db.transaction(async (tx) => {
      // Find guest cart
      const guestCarts = await tx.select({ id: carts.id })
        .from(carts)
        .where(and(eq(carts.guestTokenHash, digest), eq(carts.status, 'active')))
        .limit(1);

      if (guestCarts.length === 0) return; // Nothing to merge

      const guestCartId = guestCarts[0].id;

      // Find user cart
      const userCarts = await tx.select({ id: carts.id })
        .from(carts)
        .where(and(eq(carts.userId, session.userId), eq(carts.status, 'active')))
        .limit(1);

      let userCartId;
      if (userCarts.length === 0) {
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        const [newCart] = await tx.insert(carts).values({
          userId: session.userId,
          status: 'active',
          expiresAt: expiresAt.toISOString(),
        }).returning({ id: carts.id });
        userCartId = newCart.id;
      } else {
        userCartId = userCarts[0].id;
      }

      // Merge items
      const itemsToMerge = await tx.select().from(cartItems).where(
        eq(cartItems.cartId, guestCartId),
      );
      for (const guestItem of itemsToMerge) {
        // Get available stock
        const stockData = await tx.execute(
          sql`SELECT available FROM sss_inventory_levels WHERE variant_id = ${guestItem.variantId}`,
        );
        const maxStock = stockData.rows.length > 0
          ? Number((stockData.rows[0] as any).available)
          : 0;

        // Check if user already has this variant
        const existing = await tx.select({ id: cartItems.id, quantity: cartItems.quantity })
          .from(cartItems)
          .where(
            and(eq(cartItems.cartId, userCartId), eq(cartItems.variantId, guestItem.variantId)),
          )
          .limit(1);

        if (existing.length > 0) {
          const newQty = Math.min(existing[0].quantity + guestItem.quantity, maxStock);
          await tx.update(cartItems)
            .set({ quantity: newQty })
            .where(eq(cartItems.id, existing[0].id));
        } else {
          const newQty = Math.min(guestItem.quantity, maxStock);
          if (newQty > 0) {
            await tx.insert(cartItems).values({
              cartId: userCartId,
              variantId: guestItem.variantId,
              quantity: newQty,
              priceObservation: guestItem.priceObservation,
            });
          }
        }
      }

      // Mark guest cart converted
      await tx.update(carts).set({ status: 'converted' }).where(eq(carts.id, guestCartId));
    });

    return c.json({ success: true, meta: { request_id: c.get('requestId') } });
  })
  .post('/items', zValidator('json', AddCartItemRequestSchema), async (c) => {
    const { variantId, quantity } = c.req.valid('json');
    const { cartId, guestToken } = await resolveActiveCart(c, true);

    if (!cartId) return c.json({ error: 'Failed to resolve cart' }, 500);

    const variant = await db.select({ price: productVariants.price }).from(productVariants).where(
      eq(productVariants.id, variantId),
    ).limit(1);
    const priceObservation = variant.length > 0 ? variant[0].price : null;

    const existing = await db.select({ id: cartItems.id, quantity: cartItems.quantity }).from(
      cartItems,
    )
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.variantId, variantId)))
      .limit(1);

    try {
      if (existing.length > 0) {
        await db.update(cartItems)
          .set({ quantity: existing[0].quantity + quantity })
          .where(eq(cartItems.id, existing[0].id));
      } else {
        const inserted = await db.insert(cartItems).values({
          cartId,
          variantId,
          quantity,
          priceObservation,
        }).returning({ id: cartItems.id });
        console.log('[cart] INSERT cartItem result:', JSON.stringify(inserted));
      }
    } catch (insertErr) {
      console.error('[cart] INSERT cartItem FAILED:', insertErr);
      return c.json({
        data: null,
        meta: { request_id: c.get('requestId') },
        error: { code: 'INSERT_FAILED', message: String(insertErr) },
      }, 500);
    }

    return c.json({
      data: { success: true, guestToken },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  })
  .patch('/items/:id', zValidator('json', UpdateCartItemRequestSchema), async (c) => {
    const itemId = c.req.param('id');
    const updates = c.req.valid('json');
    const { cartId } = await resolveActiveCart(c, false);

    if (!cartId) return c.json({ error: 'Cart not found' }, 404);

    const existing = await db.select({ id: cartItems.id }).from(cartItems)
      .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)))
      .limit(1);

    if (existing.length === 0) return c.json({ error: 'Item not found in cart' }, 404);

    const setValues: any = {};
    if (updates.quantity !== undefined) setValues.quantity = updates.quantity;
    if (updates.selected !== undefined) setValues.selected = updates.selected ? 1 : 0;
    if (updates.saveForLater !== undefined) setValues.saveForLater = updates.saveForLater ? 1 : 0;
    if (updates.note !== undefined) setValues.note = updates.note;

    if (Object.keys(setValues).length > 0) {
      await db.update(cartItems).set(setValues).where(eq(cartItems.id, itemId));
    }

    return c.json({ success: true, meta: { request_id: c.get('requestId') } });
  })
  .delete('/items/:id', async (c) => {
    const itemId = c.req.param('id');
    const { cartId } = await resolveActiveCart(c, false);

    if (!cartId) return c.json({ error: 'Cart not found' }, 404);

    await db.delete(cartItems)
      .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)));

    return c.json({ success: true, meta: { request_id: c.get('requestId') } });
  })
  .delete('/', async (c) => {
    const { cartId } = await resolveActiveCart(c, false);

    if (!cartId) return c.json({ error: 'Cart not found' }, 404);

    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));

    return c.json({ success: true, meta: { request_id: c.get('requestId') } });
  });

export { routes as cartRouter };
