import { Hono } from 'hono';
import { zValidator } from '../../middleware/validator.ts';
import { AuthContext, optionalAuthMiddleware } from '../../middleware/auth.ts';
import { resolveActiveCart } from '../cart/cart.ts';
import {
  addresses,
  cartItems,
  db,
  globalSettings,
  inventoryLevels,
  inventoryMovements,
  orderAddresses,
  orderItems,
  orders,
  orderStatusHistory,
  productImages,
  products,
  productVariants,
  users,
  voucherRedemptions,
  vouchers,
} from '@starsuperscare/database';
import { and, eq, sql } from 'drizzle-orm';
import { storageAdapter } from '../../adapters/storage.ts';
import {
  CheckoutValidateRequestSchema,
  CreateOrderRequestSchema,
  GetShippingOptionsRequestSchema,
} from '@starsuperscare/contracts';

type AppContext = {
  Variables: AuthContext['Variables'] & {
    requestId: string;
  };
};

export const checkoutRouter = new Hono<AppContext>();

checkoutRouter.use('*', optionalAuthMiddleware);

checkoutRouter.post(
  '/shipping-options',
  zValidator('json', GetShippingOptionsRequestSchema),
  async (c) => {
    const { destinationPostalCode } = c.req.valid('json');
    if (!destinationPostalCode) {
      return c.json({
        data: { options: [] },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    }

    const { cartId } = await resolveActiveCart(c, false);
    if (!cartId) {
      return c.json({
        data: { options: [] },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    }

    // Fetch items to calculate weight
    const items = await db.select({
      quantity: cartItems.quantity,
      price: productVariants.price,
      productName: products.name,
      weight: sql<number>`COALESCE(${productVariants.weight}, 1000)`.mapWith(Number),
    })
      .from(cartItems)
      .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.saveForLater, 0)));

    if (items.length === 0) {
      return c.json({
        data: { options: [] },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    }

    const biteshipItems = items.map((item) => ({
      name: item.productName,
      value: item.price,
      weight: item.weight,
      quantity: item.quantity,
    }));

    // Fetch global settings for shipping gateway configuration
    const [settings] = await db.select().from(globalSettings).where(eq(globalSettings.id, 'global'))
      .limit(1);

    const activeGateway = settings?.activeShippingGateway;
    if (activeGateway !== 'biteship') {
      return c.json({
        data: { options: [] }, // No active integration or not biteship
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    }

    // Attempt to get origin postal code from settings, fallback to env or default
    const originPostalCode = settings?.storeOriginAddress?.postalCode ||
      process.env.STORE_ORIGIN_POSTAL_CODE;

    const biteshipApiKey = process.env.BITESHIP_API_KEY;
    if (!biteshipApiKey) {
      return c.json({
        data: { options: [] },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    }

    try {
      const response = await fetch('https://api.biteship.com/v1/rates/couriers', {
        method: 'POST',
        headers: {
          'Authorization': biteshipApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin_postal_code: Number(originPostalCode),
          destination_postal_code: Number(destinationPostalCode),
          couriers: 'jne,sicepat,jnt,pos',
          items: biteshipItems,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        console.error('Biteship error:', result);
        return c.json({
          data: { options: [] },
          meta: { request_id: c.get('requestId') },
          error: null,
        });
      }

      const options = result.pricing.map((p: any) => ({
        id: `${p.company}_${p.type}`,
        name: `${p.courier_name} ${p.courier_service_name}`,
        description: p.description,
        cost: p.price,
        estimatedDays: p.shipment_duration_range || p.shipment_duration_time,
      }));

      return c.json({
        data: { options },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    } catch (e) {
      console.error('Failed to fetch shipping rates', e);
      return c.json({
        data: { options: [] },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    }
  },
);

checkoutRouter.post('/validate', zValidator('json', CheckoutValidateRequestSchema), async (c) => {
  const req = c.req.valid('json');
  const session = c.get('session');
  const { cartId } = await resolveActiveCart(c, false);

  if (!cartId) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Cart not found' } }, 404);
  }

  // Fetch active items (not saved for later) — LEFT JOIN inventory so products
  // without inventory rows still appear (treated as 0 available stock)
  const items = await db.select({
    id: cartItems.id,
    productId: products.id,
    variantId: productVariants.id,
    quantity: cartItems.quantity,
    price: productVariants.price,
    productName: products.name,
    variantSku: productVariants.sku,
    productType: products.type,
    primaryImage: sql<string>`(
      SELECT object_key FROM ${productImages}
      WHERE product_id = ${products.id}
      ORDER BY sort_order ASC
      LIMIT 1
    )`,
    availableStock: sql<number>`COALESCE(${inventoryLevels.available}, 0)`.mapWith(Number),
  })
    .from(cartItems)
    .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
    .innerJoin(products, eq(productVariants.productId, products.id))
    .leftJoin(inventoryLevels, eq(productVariants.id, inventoryLevels.variantId))
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.saveForLater, 0)));

  if (items.length === 0) {
    return c.json(
      { error: { code: 'BAD_REQUEST', message: 'Cart is empty or no active items' } },
      400,
    );
  }

  let subtotal = 0;
  let totalDiscount = 0; // Handled by vouchers
  let isValid = true;
  const errors: string[] = [];
  const snapshotItems = [];

  for (const item of items) {
    if (item.quantity > item.availableStock) {
      isValid = false;
      errors.push(`Stok ${item.productName} tidak mencukupi (Tersedia: ${item.availableStock})`);
    }

    let primaryImage = null;
    if (item.primaryImage) {
      primaryImage = await storageAdapter.generatePresignedDownloadUrl(item.primaryImage);
    }

    subtotal += item.price * item.quantity;
    snapshotItems.push({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      priceSnapshot: item.price,
      productName: item.productName,
      variantSku: item.variantSku,
      productType: item.productType,
      primaryImage,
    });
  }

  // Handle Shipping
  let shippingCost = 0;
  if (req.shippingOptionId) {
    const parts = req.shippingOptionId.split('|');
    if (parts.length >= 2) {
      shippingCost = parseInt(parts[parts.length - 1], 10) || 0;
    } else {
      isValid = false;
      errors.push('Opsi pengiriman tidak valid');
    }
  }

  // Handle Voucher
  let appliedVoucherInfo = null;
  if (req.voucherCode) {
    if (!session?.userId) {
      isValid = false;
      errors.push('Silakan login untuk menggunakan voucher');
    } else {
      const voucherList = await db.select().from(vouchers).where(eq(vouchers.code, req.voucherCode))
        .limit(1);
      if (voucherList.length === 0) {
        isValid = false;
        errors.push('Voucher tidak valid');
      } else {
        const voucher = voucherList[0];
        const now = new Date();

        let hasPreviousOrders = false;
        if (voucher.isNewUserOnly === 1) {
          const pastOrders = await db.select({ id: orders.id }).from(orders).where(
            and(eq(orders.userId, session.userId), eq(orders.status, 'completed')),
          ).limit(1);
          hasPreviousOrders = pastOrders.length > 0;
        }

        if (voucher.isActive !== 1 || voucher.status !== 'active') {
          isValid = false;
          errors.push('Voucher tidak aktif');
        } else if (voucher.validFrom && new Date(voucher.validFrom) > now) {
          isValid = false;
          errors.push('Voucher belum berlaku');
        } else if (voucher.validTo && new Date(voucher.validTo) < now) {
          isValid = false;
          errors.push('Voucher sudah kadaluarsa');
        } else if (voucher.maxUses !== null && voucher.currentUses >= voucher.maxUses) {
          isValid = false;
          errors.push('Voucher sudah mencapai batas maksimal penggunaan');
        } else if (voucher.minOrderValue && subtotal < Number(voucher.minOrderValue)) {
          isValid = false;
          errors.push(
            `Minimal belanja Rp ${
              Number(voucher.minOrderValue).toLocaleString('id-ID')
            } untuk menggunakan voucher ini`,
          );
        } else if (voucher.isNewUserOnly === 1 && hasPreviousOrders) {
          isValid = false;
          errors.push('Voucher ini khusus untuk pengguna baru');
        } else {
          // Calculate discount
          const baseAmount = voucher.isShippingPromo === 1 ? shippingCost : subtotal;

          if (voucher.discountType === 'percentage') {
            totalDiscount = Math.floor((baseAmount * Number(voucher.discountAmount)) / 100);
            if (voucher.maxDiscountValue && totalDiscount > Number(voucher.maxDiscountValue)) {
              totalDiscount = Number(voucher.maxDiscountValue);
            }
          } else {
            totalDiscount = Number(voucher.discountAmount);
          }

          // Cap discount
          if (totalDiscount > baseAmount) totalDiscount = baseAmount;

          appliedVoucherInfo = {
            code: voucher.code,
            description: voucher.description,
          };
        }
      }
    }
  }

  const taxAmount = 0; // Simplified
  const grandTotal = Math.max(0, subtotal + shippingCost - totalDiscount) + taxAmount;

  return c.json({
    data: {
      summary: {
        subtotal,
        totalDiscount,
        shippingCost,
        taxAmount,
        grandTotal,
      },
      items: snapshotItems,
      appliedVoucher: appliedVoucherInfo,
      isValid,
      errors,
    },
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

checkoutRouter.post('/orders', zValidator('json', CreateOrderRequestSchema), async (c) => {
  const req = c.req.valid('json');
  const session = c.get('session');

  // Idempotency check
  const existingOrder = await db.select({
    id: orders.id,
    orderNumber: orders.orderNumber,
    totalAmount: orders.totalAmount,
    status: orders.status,
  })
    .from(orders)
    .where(eq(orders.idempotencyKey, req.idempotencyKey))
    .limit(1);

  if (existingOrder.length > 0) {
    return c.json({
      data: {
        orderId: existingOrder[0].id,
        orderNumber: existingOrder[0].orderNumber,
        totalAmount: existingOrder[0].totalAmount,
        status: existingOrder[0].status,
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  }

  const { cartId } = await resolveActiveCart(c, false);
  if (!cartId) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Cart not found' } }, 404);
  }

  // Run validation — LEFT JOIN inventory for products without inventory rows
  const items = await db.select({
    id: cartItems.id,
    productId: products.id,
    variantId: productVariants.id,
    quantity: cartItems.quantity,
    price: productVariants.price,
    productName: products.name,
    variantSku: productVariants.sku,
    productType: products.type,
    warehouseId: inventoryLevels.warehouseId,
    availableStock: sql<number>`COALESCE(${inventoryLevels.available}, 9999)`.mapWith(Number),
  })
    .from(cartItems)
    .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
    .innerJoin(products, eq(productVariants.productId, products.id))
    .leftJoin(inventoryLevels, eq(productVariants.id, inventoryLevels.variantId))
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.saveForLater, 0)));

  if (items.length === 0) {
    console.log('Checkout validate failed. CartId:', cartId);
    const rawItems = await db.select().from(cartItems).where(eq(cartItems.cartId, cartId));
    console.log('Raw items:', rawItems);
    return c.json({ error: { code: 'BAD_REQUEST', message: 'Cart is empty' } }, 400);
  }

  let subtotal = 0;
  for (const item of items) {
    if (item.quantity > item.availableStock) {
      return c.json({
        error: { code: 'BAD_REQUEST', message: `Stok ${item.productName} tidak mencukupi` },
      }, 400);
    }
    subtotal += item.price * item.quantity;
  }

  let totalDiscount = 0;
  let appliedVoucherId = null;
  if (req.voucherCode) {
    if (!session?.userId) {
      return c.json({
        error: { code: 'UNAUTHORIZED', message: 'Silakan login untuk menggunakan voucher' },
      }, 401);
    }
    const voucherList = await db.select().from(vouchers).where(eq(vouchers.code, req.voucherCode))
      .limit(1);
    if (voucherList.length === 0) {
      return c.json({ error: { code: 'BAD_REQUEST', message: 'Voucher tidak valid' } }, 400);
    }
    const voucher = voucherList[0];
    const now = new Date();
    if (voucher.isActive !== 1 || voucher.status !== 'active') {
      return c.json({ error: { code: 'BAD_REQUEST', message: 'Voucher tidak aktif' } }, 400);
    } else if (voucher.validFrom && new Date(voucher.validFrom) > now) {
      return c.json({ error: { code: 'BAD_REQUEST', message: 'Voucher belum berlaku' } }, 400);
    } else if (voucher.validTo && new Date(voucher.validTo) < now) {
      return c.json({ error: { code: 'BAD_REQUEST', message: 'Voucher sudah kadaluarsa' } }, 400);
    } else if (voucher.maxUses !== null && voucher.currentUses >= voucher.maxUses) {
      return c.json({
        error: { code: 'BAD_REQUEST', message: 'Voucher sudah mencapai batas penggunaan' },
      }, 400);
    } else {
      if (voucher.discountType === 'percentage') {
        totalDiscount = Math.floor((subtotal * voucher.discountAmount) / 100);
      } else {
        totalDiscount = voucher.discountAmount;
      }
      if (totalDiscount > subtotal) totalDiscount = subtotal;
      appliedVoucherId = voucher.id;
    }
  }

  let shippingCost = 0;
  const requiresShipping = items.some((i) => i.productType === 'physical');

  if (requiresShipping) {
    if (!req.shippingOptionId || !req.shippingAddress) {
      return c.json({
        error: { code: 'BAD_REQUEST', message: 'Alamat dan opsi pengiriman wajib diisi' },
      }, 400);
    }

    const parts = req.shippingOptionId.split('|');
    if (parts.length >= 2) {
      shippingCost = parseInt(parts[parts.length - 1], 10) || 0;
    } else {
      return c.json(
        { error: { code: 'BAD_REQUEST', message: 'Opsi pengiriman tidak valid' } },
        400,
      );
    }
  }

  const grandTotal = Math.max(0, subtotal - totalDiscount) + shippingCost;
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(10).substring(2, 7).toUpperCase();
  const orderNumber = `ORD-IN-CO-${dateStr}-${randomStr}`;

  // Start Transaction for Reservation & Order Creation
  try {
    const result = await db.transaction(async (tx) => {
      // 1. Reserve Inventory (Reduce available stock immediately)
      // Since Drizzle lacks deep batch updates with arithmetic, we loop
      for (const item of items) {
        await tx.update(inventoryLevels)
          .set({
            available: sql`${inventoryLevels.available} - ${item.quantity}`,
            reserved: sql`${inventoryLevels.reserved} + ${item.quantity}`,
          })
          .where(eq(inventoryLevels.variantId, item.variantId));

        if (item.warehouseId) {
          await tx.insert(inventoryMovements).values({
            variantId: item.variantId,
            warehouseId: item.warehouseId,
            quantity: item.quantity,
            type: 'reserve',
            note: 'Order checkout',
          });
        }
      }

      // 1.5. Resolve Guest UserId if Email matches existing user
      let finalUserId = session?.userId || null;
      if (!finalUserId && req.emailSnapshot) {
        const normalizedEmail = req.emailSnapshot.trim().toLowerCase();
        const existingUserList = await tx.select({ id: users.id })
          .from(users)
          .where(eq(users.emailNormalized, normalizedEmail))
          .limit(1);
        if (existingUserList.length > 0) {
          finalUserId = existingUserList[0].id;
        }
      }

      // 2. Create Order
      const [newOrder] = await tx.insert(orders).values({
        orderNumber,
        idempotencyKey: req.idempotencyKey,
        userId: finalUserId,
        emailSnapshot: req.emailSnapshot,
        totalAmount: grandTotal,
        subtotalAmount: subtotal,
        discountAmount: totalDiscount,
        shippingAmount: shippingCost,
        taxAmount: 0,
        status: 'pending',
      }).returning({
        id: orders.id,
        orderNumber: orders.orderNumber,
        totalAmount: orders.totalAmount,
        status: orders.status,
      });

      await tx.insert(orderStatusHistory).values({
        orderId: newOrder.id,
        status: 'pending',
        note: 'Pesanan dibuat, menunggu pembayaran',
      });

      // 3. Insert Order Items
      const orderItemsToInsert = items.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        priceSnapshot: item.price,
        productNameSnapshot: item.productName,
        variantSkuSnapshot: item.variantSku,
      }));
      await tx.insert(orderItems).values(orderItemsToInsert);

      // 4. Insert Address
      await tx.insert(orderAddresses).values({
        orderId: newOrder.id,
        shippingSnapshot: req.shippingAddress || {},
        billingSnapshot: req.billingAddress || req.shippingAddress || {},
      });

      // 4.5. Automatically save address to user's address book if they are logged in
      if (session?.userId && req.shippingAddress) {
        // Check if user already has any addresses
        const existingAddresses = await tx.select({ id: addresses.id }).from(addresses).where(
          eq(addresses.userId, session.userId),
        ).limit(1);
        if (existingAddresses.length === 0) {
          await tx.insert(addresses).values({
            userId: session.userId,
            recipientName: req.shippingAddress.fullName,
            phone: req.shippingAddress.phoneNumber,
            addressLine1: req.shippingAddress.streetAddress,
            city: req.shippingAddress.city,
            province: req.shippingAddress.province,
            postalCode: req.shippingAddress.postalCode,
            country: req.shippingAddress.country || 'Indonesia',
            isPrimaryShipping: true,
            isPrimaryBilling: true,
          });
        }
      }

      // 5. Delete active items from cart
      await tx.delete(cartItems)
        .where(and(eq(cartItems.cartId, cartId), eq(cartItems.saveForLater, 0)));

      // 6. Record Voucher Redemption
      if (appliedVoucherId && session?.userId) {
        await tx.insert(voucherRedemptions).values({
          voucherId: appliedVoucherId,
          userId: session.userId,
          orderId: newOrder.id,
          discountApplied: totalDiscount,
        });
        await tx.update(vouchers)
          .set({ currentUses: sql`${vouchers.currentUses} + 1` })
          .where(eq(vouchers.id, appliedVoucherId));
      }

      return newOrder;
    });

    return c.json({
      data: {
        orderId: result.id,
        orderNumber: result.orderNumber,
        totalAmount: result.totalAmount,
        status: result.status,
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  } catch (error: any) {
    return c.json({ error: { code: 'INTERNAL_SERVER_ERROR', message: error.message } }, 500);
  }
});

checkoutRouter.get('/orders/:id', async (c) => {
  const id = c.req.param('id');
  const orderList = await db.select({
    id: orders.id,
    orderNumber: orders.orderNumber,
    totalAmount: orders.totalAmount,
    status: orders.status,
  })
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  if (orderList.length === 0) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Order not found' } }, 404);
  }

  return c.json({
    data: orderList[0],
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});
