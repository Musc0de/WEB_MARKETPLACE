import { and, eq, sql } from 'drizzle-orm';
import {
  cancellationRequests,
  db,
  orderItems,
  orders,
  orderStatusHistory,
  productImages,
  returns,
} from '@starsuperscare/database';
import { storageAdapter } from '../../../adapters/storage.ts';

const RETURN_WINDOW_DAYS = Number(
  (typeof Deno !== 'undefined'
    ? Deno.env.get('RETURN_WINDOW_DAYS')
    : process?.env?.['RETURN_WINDOW_DAYS']) ?? 7,
);

export interface EligibleReturnItem {
  orderItemId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantSku: string;
  primaryImage: string | null;
  purchasedQuantity: number;
  remainingEligibleQuantity: number;
  paidUnitAmount: number;
  maximumRefundableAmount: number;
}

export interface ReturnEligibility {
  eligible: boolean;
  reasonCode?: string;
  reasonMessage?: string;
  activeReturnId?: string;
  eligibleUntil?: string;
  allowedResolutionTypes: string[];
  eligibleItems: EligibleReturnItem[];
}

export class EligibilityService {
  static async checkReturnEligibility(orderId: string, userId: string): Promise<ReturnEligibility> {
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.userId, userId)),
    });

    if (!order) {
      return {
        eligible: false,
        reasonCode: 'order_not_found',
        reasonMessage: 'Pesanan tidak ditemukan',
        allowedResolutionTypes: [],
        eligibleItems: [],
      };
    }

    if (order.status !== 'delivered' && order.status !== 'completed') {
      return {
        eligible: false,
        reasonCode: 'not_delivered',
        reasonMessage:
          'Pesanan belum diterima. Pengajuan pengembalian hanya bisa dilakukan setelah pesanan diterima.',
        allowedResolutionTypes: [],
        eligibleItems: [],
      };
    }

    // Check timeframe
    const deliveredAt = new Date(order.updatedAt); // Using updatedAt as proxy for delivery date, normally shipment.deliveredAt
    const eligibleUntil = new Date(
      deliveredAt.getTime() + RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000,
    );
    const now = new Date();

    if (now > eligibleUntil) {
      return {
        eligible: false,
        reasonCode: 'expired',
        reasonMessage: 'Batas waktu pengajuan pengembalian telah berakhir',
        eligibleUntil: eligibleUntil.toISOString(),
        allowedResolutionTypes: [],
        eligibleItems: [],
      };
    }

    // Check if ANY return request exists for this order (we only allow one attempt)
    const existingReturns = await db.query.returns.findMany({
      where: and(eq(returns.orderId, orderId)),
    });

    if (existingReturns.length > 0) {
      const activeOrPast = existingReturns[0];
      let msg = 'Terdapat pengajuan pengembalian yang sedang aktif untuk pesanan ini.';
      if (activeOrPast.status === 'rejected') {
        msg = 'Pengajuan pengembalian sebelumnya telah ditolak.';
      } else if (activeOrPast.status === 'resolved' || activeOrPast.status === 'closed') {
        msg = 'Pengajuan pengembalian telah selesai diproses.';
      }

      return {
        eligible: false,
        reasonCode: 'active_request_exists',
        reasonMessage: msg,
        activeReturnId: activeOrPast.id,
        eligibleUntil: eligibleUntil.toISOString(),
        allowedResolutionTypes: [],
        eligibleItems: [],
      };
    }

    // Fetch items
    const rawItems = await db.select({
      orderItemId: orderItems.id,
      productId: orderItems.productId,
      variantId: orderItems.variantId,
      productName: orderItems.productNameSnapshot,
      variantSku: orderItems.variantSkuSnapshot,
      price: orderItems.priceSnapshot,
      quantity: orderItems.quantity,
      primaryImage: sql<string>`(
        SELECT object_key FROM ${productImages}
        WHERE product_id = ${orderItems.productId}
        ORDER BY sort_order ASC
        LIMIT 1
      )`,
    })
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    const items: EligibleReturnItem[] = await Promise.all(rawItems.map(async (item) => {
      let imageUrl = null;
      if (item.primaryImage) {
        imageUrl = await storageAdapter.generatePresignedDownloadUrl(item.primaryImage);
      }

      const paidUnitAmount = item.price;
      const maximumRefundableAmount = paidUnitAmount * item.quantity;

      return {
        orderItemId: item.orderItemId,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.productName,
        variantSku: item.variantSku,
        primaryImage: imageUrl,
        purchasedQuantity: item.quantity,
        remainingEligibleQuantity: item.quantity,
        paidUnitAmount,
        maximumRefundableAmount,
      };
    }));

    const result: ReturnEligibility = {
      eligible: items.length > 0,
      eligibleUntil: eligibleUntil.toISOString(),
      allowedResolutionTypes: ['refund_only', 'return_and_refund', 'replacement'],
      eligibleItems: items,
    };
    if (items.length === 0) {
      result.reasonCode = 'no_eligible_items';
      result.reasonMessage = 'Tidak ada produk yang bisa dikembalikan';
    }
    return result;
  }

  static async checkCancellationEligibility(
    orderId: string,
    userId: string,
  ): Promise<{ eligible: boolean; requireApproval: boolean; reasonMessage?: string }> {
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.userId, userId)),
    });

    if (!order) {
      return { eligible: false, requireApproval: false, reasonMessage: 'Pesanan tidak ditemukan' };
    }

    // Check if cancellation request already exists
    const existingCancellations = await db.query.cancellationRequests.findMany({
      where: and(eq(cancellationRequests.orderId, orderId)),
    });

    if (existingCancellations.length > 0) {
      const req = existingCancellations[0];
      let msg = 'Pengajuan pembatalan sedang diproses.';
      if (req.status === 'rejected') {
        msg = 'Pengajuan pembatalan telah ditolak.';
      } else if (req.status === 'approved') {
        msg = 'Pesanan telah dibatalkan.';
      }
      return { eligible: false, requireApproval: false, reasonMessage: msg };
    }

    if (order.status === 'pending') {
      return { eligible: true, requireApproval: false };
    }

    if (order.status === 'paid' || order.status === 'processing') {
      // Find when the order was paid or placed
      let referenceTime = new Date(order.createdAt);
      const paidHistory = await db.query.orderStatusHistory.findFirst({
        where: and(
          eq(orderStatusHistory.orderId, orderId),
          eq(orderStatusHistory.status, 'paid'),
        ),
      });

      if (paidHistory) {
        referenceTime = new Date(paidHistory.createdAt);
      }

      const threeHoursInMs = 3 * 60 * 60 * 1000;
      const cancellationDeadline = new Date(referenceTime.getTime() + threeHoursInMs);
      const now = new Date();

      if (now > cancellationDeadline) {
        // Format to Indonesian time (WIB is GMT+7)
        const formatter = new Intl.DateTimeFormat('id-ID', {
          timeZone: 'Asia/Jakarta',
          dateStyle: 'medium',
          timeStyle: 'short',
        });
        const deadlineStr = formatter.format(cancellationDeadline) + ' WIB';

        return {
          eligible: false,
          requireApproval: false,
          reasonMessage:
            `Batas waktu pengajuan pembatalan (3 jam setelah pembayaran) telah habis pada ${deadlineStr}.`,
        };
      }

      return { eligible: true, requireApproval: true };
    }

    return {
      eligible: false,
      requireApproval: false,
      reasonMessage: 'Pesanan dalam status ini tidak dapat dibatalkan.',
    };
  }
}
