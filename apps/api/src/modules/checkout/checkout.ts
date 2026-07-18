import { Hono } from 'hono';
import { zValidator } from '../../middleware/validator.ts';
import { AuthContext, optionalAuthMiddleware } from '../../middleware/auth.ts';
import { resolveActiveCart } from '../cart/cart.ts';
import {
  addresses,
  cartItems,
  db,
  inventoryLevels,
  inventoryMovements,
  orderAddresses,
  orderItems,
  orders,
  orderStatusHistory,
  productImages,
  products,
  productVariants,
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

// Mock shipping options
const MOCK_SHIPPING_OPTIONS = [
  {
    id: 'ship_reguler',
    name: 'Reguler',
    description: 'Pengiriman standar',
    cost: 15000,
    estimatedDays: '2-4 Hari',
  },
  {
    id: 'ship_express',
    name: 'Express',
    description: 'Pengiriman cepat (besok sampai)',
    cost: 35000,
    estimatedDays: '1-2 Hari',
  },
];

checkoutRouter.post(
  '/shipping-options',
  zValidator('json', GetShippingOptionsRequestSchema),
  (c) => {
    // In a real app, this would call an external logistics API (e.g. RajaOngkir)
    // based on the provided destinationProvince/destinationCity.
    return c.json({
      data: { options: MOCK_SHIPPING_OPTIONS },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
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
        } else {
          // Calculate discount
          if (voucher.discountType === 'percentage') {
            totalDiscount = Math.floor((subtotal * voucher.discountAmount) / 100);
          } else {
            totalDiscount = voucher.discountAmount;
          }
          // Cap discount at subtotal
          if (totalDiscount > subtotal) totalDiscount = subtotal;
          appliedVoucherInfo = {
            code: voucher.code,
            description: voucher.description,
          };
        }
      }
    }
  }

  // Handle Shipping
  let shippingCost = 0;
  if (req.shippingOptionId) {
    const shipping = MOCK_SHIPPING_OPTIONS.find((s) => s.id === req.shippingOptionId);
    if (!shipping) {
      isValid = false;
      errors.push('Opsi pengiriman tidak valid');
    } else {
      shippingCost = shipping.cost;
    }
  }

  const taxAmount = 0; // Simplified
  const grandTotal = Math.max(0, subtotal - totalDiscount) + shippingCost + taxAmount;

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
    const shipping = MOCK_SHIPPING_OPTIONS.find((s) => s.id === req.shippingOptionId);
    if (!shipping) {
      return c.json(
        { error: { code: 'BAD_REQUEST', message: 'Opsi pengiriman tidak valid' } },
        400,
      );
    }
    shippingCost = shipping.cost;
  }

  const grandTotal = Math.max(0, subtotal - totalDiscount) + shippingCost;
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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

      // 2. Create Order
      const [newOrder] = await tx.insert(orders).values({
        orderNumber,
        idempotencyKey: req.idempotencyKey,
        userId: session?.userId || null,
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
