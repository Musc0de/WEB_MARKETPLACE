import { Hono } from 'hono';
import {
  cancellationRequests,
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
  returns,
  shipments,
  userProfiles,
  users,
} from '@starsuperscare/database';
import { and, count, desc, eq, inArray, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';
import { deleteInvoicePDF, generateInvoicePDF, uploadInvoicePDF } from './invoice-generator.ts';
import { EligibilityService } from '../returns/services/eligibility.service.ts';

/**
 * Parse optionValues JSON → human-readable string, e.g. "Merah · XL"
 */
function parseVariantName(optionValues: unknown): string {
  if (!optionValues) return '';
  try {
    const parsed = typeof optionValues === 'string' ? JSON.parse(optionValues) : optionValues;
    if (Array.isArray(parsed)) {
      return parsed.map((v: any) => v.value ?? v.label ?? String(v)).filter(Boolean).join(' · ');
    }
    if (typeof parsed === 'object' && parsed !== null) {
      return Object.values(parsed).filter(Boolean).join(' · ');
    }
    return String(parsed);
  } catch {
    return String(optionValues);
  }
}

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

      if (orderIds.length > 0) {
        const orderReturns = await db.query.returns.findMany({
          where: inArray(returns.orderId, orderIds),
        });
        const orderCancellations = await db.query.cancellationRequests.findMany({
          where: inArray(cancellationRequests.orderId, orderIds),
        });

        for (const order of enrichedOrders) {
          const ret = orderReturns.find((r) => r.orderId === order.id);
          if (ret) {
            order.status = ret.status === 'resolved'
              ? 'refunded'
              : ret.status === 'rejected'
              ? 'return_rejected'
              : 'return_requested';
          } else {
            const cancel = orderCancellations.find((c) => c.orderId === order.id);
            if (cancel) {
              order.status = cancel.status === 'approved'
                ? 'cancelled'
                : cancel.status === 'rejected'
                ? 'cancellation_rejected'
                : 'cancellation_requested';
            }
          }
        }
      }

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
  .get('/:id/resolution-eligibility', async (c) => {
    const user = c.get('user');
    const orderId = c.req.param('id');
    const eligibility = await EligibilityService.checkReturnEligibility(orderId, user.id);
    const cancellation = await EligibilityService.checkCancellationEligibility(orderId, user.id);

    return c.json({
      data: {
        returnEligibility: eligibility,
        cancellationEligibility: cancellation,
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  })
  .post(
    '/:id/cancellation-requests',
    zValidator('json', z.object({ reason: z.string().min(5) })),
    async (c) => {
      const user = c.get('user');
      const orderId = c.req.param('id');
      const { reason } = c.req.valid('json');

      const eligibility = await EligibilityService.checkCancellationEligibility(orderId, user.id);
      if (!eligibility.eligible) {
        return c.json(
          { error: eligibility.reasonMessage || 'Pesanan tidak dapat dibatalkan.' },
          400,
        );
      }

      const result = await db.transaction(async (tx) => {
        // Create request
        const [request] = await tx.insert(cancellationRequests)
          .values({
            orderId,
            userId: user.id,
            reason,
            status: eligibility.requireApproval ? 'under_review' : 'approved',
          })
          .returning();

        if (!eligibility.requireApproval) {
          // Automatically approve and mark order cancelled
          await tx.update(orders)
            .set({ status: 'cancelled', updatedAt: new Date().toISOString() })
            .where(eq(orders.id, orderId));

          await tx.insert(orderStatusHistory)
            .values({
              orderId,
              status: 'cancelled',
              note: `Dibatalkan otomatis oleh sistem (Alasan: ${reason})`,
            });
        }

        return request;
      });

      return c.json({
        data: result,
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

    let history = await db
      .select()
      .from(orderStatusHistory)
      .where(eq(orderStatusHistory.orderId, id))
      .orderBy(desc(orderStatusHistory.createdAt));

    // Fetch cancellations
    const orderCancellations = await db.query.cancellationRequests.findMany({
      where: eq(cancellationRequests.orderId, id),
    });
    // Fetch returns
    const orderReturns = await db.query.returns.findMany({
      where: eq(returns.orderId, id),
    });

    const extraEvents: any[] = [];

    for (const cancel of orderCancellations) {
      extraEvents.push({
        id: `cancellation-${cancel.id}`,
        orderId: id,
        status: 'cancellation_requested',
        note: `Pengajuan Pembatalan: ${cancel.reason || 'Lainnya'}`,
        createdAt: new Date(cancel.createdAt),
      });

      if (cancel.status === 'rejected') {
        extraEvents.push({
          id: `cancellation-rejected-${cancel.id}`,
          orderId: id,
          status: 'cancellation_rejected',
          note: `Pembatalan Ditolak${cancel.rejectionReason ? `: ${cancel.rejectionReason}` : ''}`,
          createdAt: new Date(cancel.updatedAt || cancel.createdAt),
        });
      } else if (cancel.status === 'approved') {
        extraEvents.push({
          id: `cancellation-approved-${cancel.id}`,
          orderId: id,
          status: 'cancelled',
          note: `Pembatalan Disetujui`,
          createdAt: new Date(cancel.updatedAt || cancel.createdAt),
        });
      }
    }

    for (const ret of orderReturns) {
      extraEvents.push({
        id: `return-${ret.id}`,
        orderId: id,
        status: 'return_requested',
        note: `Pengajuan Pengembalian (Resolusi: ${
          ret.resolution === 'refund_only'
            ? 'Refund Dana'
            : ret.resolution === 'return_and_refund'
            ? 'Pengembalian Barang & Dana'
            : ret.resolution
        })`,
        createdAt: new Date(ret.createdAt),
      });
      // Jika ditolak
      if (ret.status === 'rejected') {
        extraEvents.push({
          id: `return-rejected-${ret.id}`,
          orderId: id,
          status: 'return_rejected',
          note: `Retur Ditolak${ret.rejectionReason ? `: ${ret.rejectionReason}` : ''}`,
          createdAt: new Date(ret.updatedAt || ret.createdAt),
        });
      }
      // Jika sudah refund
      if (ret.status === 'resolved') {
        extraEvents.push({
          id: `refund-${ret.id}`,
          orderId: id,
          status: 'refund_processed',
          note: 'Pengembalian Dana telah diproses',
          createdAt: new Date(ret.updatedAt || ret.createdAt),
        });
      }
    }

    history = [...history, ...extraEvents].sort((a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const activeReturn = orderReturns.find((r) => r.orderId === order.id);
    if (activeReturn) {
      order.status = activeReturn.status === 'resolved'
        ? 'refunded'
        : activeReturn.status === 'rejected'
        ? 'return_rejected'
        : 'return_requested';
    } else {
      const activeCancel = orderCancellations.find((c) => c.orderId === order.id);
      if (activeCancel) {
        order.status = activeCancel.status === 'approved'
          ? 'cancelled'
          : activeCancel.status === 'rejected'
          ? 'cancellation_rejected'
          : 'cancellation_requested';
      }
    }

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
  // ─── GET /:id/invoice — check DB first, generate only once, redirect to CDN ──
  .get('/:id/invoice', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    // clientTime dikirim dari browser client dalam format ISO — untuk tanggal/waktu 24 jam Indonesia
    const clientTime = c.req.query('clientTime') ?? '';

    // 1. Verify order ownership
    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, id), eq(orders.userId, user.id)))
      .limit(1);

    if (!order) throw new HTTPException(404, { message: 'Order not found' });

    // 2. Fetch Payment Info (untuk mengecek apakah perlu regenerasi invoice yang tadinya pending)
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, id))
      .orderBy(desc(payments.createdAt))
      .limit(1);

    const isPaymentPaid = payment?.status === 'success' || payment?.status === 'paid';

    // 3. Cek apakah invoice PDF sudah pernah dibuat
    const [existingInvoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.orderId, id))
      .limit(1);

    if (existingInvoice?.pdfObjectKey) {
      // Jika invoice lama tercatat 'unpaid' padahal webhook sudah mengupdate payment menjadi lunas
      if (existingInvoice.status === 'unpaid' && isPaymentPaid) {
        try {
          await deleteInvoicePDF(existingInvoice.pdfObjectKey);
        } catch (_e) {
          // ignore
        }
        await db.delete(invoices).where(eq(invoices.id, existingInvoice.id));
      } else {
        const publicUrlBase = Deno.env.get('R2_PUBLIC_URL_2') || '';
        const publicUrl = `${publicUrlBase}/${existingInvoice.pdfObjectKey}`;
        return c.redirect(publicUrl, 302);
      }
    }

    // 4. Fetch order items — termasuk comparePrice dan optionValues untuk nama varian
    const orderItemRows = await db
      .select({
        productNameSnapshot: orderItems.productNameSnapshot,
        variantSkuSnapshot: orderItems.variantSkuSnapshot,
        quantity: orderItems.quantity,
        priceSnapshot: orderItems.priceSnapshot,
        comparePrice: productVariants.comparePrice,
        optionValues: productVariants.optionValues,
      })
      .from(orderItems)
      .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
      .where(eq(orderItems.orderId, id));

    // 5. Fetch shipping & billing addresses
    const [addresses] = await db
      .select()
      .from(orderAddresses)
      .where(eq(orderAddresses.orderId, id))
      .limit(1);
    const shipping: any = addresses?.shippingSnapshot;
    const billing: any = addresses?.billingSnapshot;

    // 5. Fetch customer name + email
    const [customer] = await db
      .select({ name: userProfiles.fullName, email: users.emailDisplay })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(users.id, user.id))
      .limit(1);

    const customerName = customer?.name ?? 'Pelanggan';
    const customerEmail = customer?.email ?? user.id;

    // 6. Bangun object key unik privasi: invoicebill/<orderNum>/<uuid>.pdf
    const safeOrder = order.orderNumber.replace(/[^a-zA-Z0-9-]/g, '-');
    const objectKey = `invoicebill/${safeOrder}/${crypto.randomUUID()}.pdf`;

    // 7. Format clientTime ke waktu Indonesia 24 jam jika ada
    let clientOrderTime: string | undefined;
    if (clientTime) {
      try {
        const dt = new Date(clientTime);
        clientOrderTime = dt.toLocaleString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Jakarta',
        });
      } catch {
        clientOrderTime = undefined;
      }
    }

    // 8. Generate PDF
    const invoiceNumber = `INV-${order.orderNumber}`;
    const pdfBytes = await generateInvoicePDF({
      invoiceNumber,
      orderId: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      clientOrderTime,
      customerName,
      customerEmail,
      orderStatus: order.status,
      paymentInfo: payment
        ? {
          method: payment.paymentType || 'Belum dipilih',
          status: (payment.status === 'success' ? 'paid' : payment.status) as any,
          date: payment.createdAt,
          reference: payment.providerTransactionId ?? undefined,
          amountPaid: (payment.status === 'success' || payment.status === 'paid')
            ? payment.amount
            : 0,
        }
        : {
          method: 'Belum dipilih',
          status: 'pending',
          date: order.createdAt,
          amountPaid: 0,
        },
      items: orderItemRows.map((it) => ({
        productName: it.productNameSnapshot,
        variantName: parseVariantName(it.optionValues),
        comparePrice: (it.comparePrice && it.comparePrice > it.priceSnapshot) ? it.comparePrice : 0,
        price: it.priceSnapshot,
        quantity: it.quantity,
      })),
      subtotal: order.subtotalAmount,
      shipping: order.shippingAmount,
      tax: order.taxAmount,
      serviceFee: order.serviceFeeAmount ?? 0,
      discount: order.discountAmount,
      total: order.totalAmount,
      shippingAddress: shipping
        ? {
          recipientName: shipping.recipientName ?? shipping.fullName ?? '-',
          phone: shipping.phone ?? shipping.phoneNumber ?? '-',
          addressLine1: shipping.addressLine1 ?? shipping.streetAddress ?? '-',
          addressLine2: shipping.addressLine2,
          district: shipping.district,
          city: shipping.city ?? '-',
          province: shipping.province ?? '-',
          postalCode: shipping.postalCode ?? '-',
          notes: shipping.notes ?? shipping.note ?? undefined,
        }
        : undefined,
      billingAddress: billing
        ? {
          recipientName: billing.recipientName ?? billing.fullName ?? '-',
          phone: billing.phone ?? billing.phoneNumber ?? '-',
          addressLine1: billing.addressLine1 ?? billing.streetAddress ?? '-',
          addressLine2: billing.addressLine2,
          district: billing.district,
          city: billing.city ?? '-',
          province: billing.province ?? '-',
          postalCode: billing.postalCode ?? '-',
        }
        : undefined,
      notes: shipping?.notes ?? shipping?.note ?? undefined,
    });

    // 9. Upload ke R2 invoice bucket (private)
    await uploadInvoicePDF(pdfBytes, objectKey);
    const publicUrlBase = Deno.env.get('R2_PUBLIC_URL_2') || '';
    const publicUrl = `${publicUrlBase}/${objectKey}`;

    // 10. Simpan record ke tabel invoices (untuk idempoten: generate sekali)
    try {
      await db.insert(invoices).values({
        invoiceNumber,
        orderId: order.id,
        pdfObjectKey: objectKey,
        status: payment?.status === 'paid' ? 'paid' : 'unpaid',
      });
    } catch {
      // Abaikan jika sudah ada
    }

    // 11. Redirect ke CDN PDF URL
    return c.redirect(publicUrl, 302);
  })
  // ─── DELETE /:id/invoice — hapus PDF dari R2 dan record dari DB ──────────────
  .delete('/:id/invoice', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    // Verifikasi ownership order
    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, id), eq(orders.userId, user.id)))
      .limit(1);

    if (!order) throw new HTTPException(404, { message: 'Order not found' });

    // Cari invoice record
    const [existingInvoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.orderId, id))
      .limit(1);

    if (existingInvoice?.pdfObjectKey) {
      // Hapus file dari R2 (best-effort — tidak throw jika gagal)
      try {
        await deleteInvoicePDF(existingInvoice.pdfObjectKey);
      } catch (_e) {
        // File mungkin sudah tidak ada di R2 — lanjutkan
      }

      // Hapus record dari DB
      await db.delete(invoices).where(eq(invoices.orderId, id));
    }

    return c.json({
      data: { success: true, deleted: !!existingInvoice },
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
