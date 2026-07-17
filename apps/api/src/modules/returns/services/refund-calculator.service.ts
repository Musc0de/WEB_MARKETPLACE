import { and, eq } from 'drizzle-orm';
import { db, orderItems, orders, refunds } from '@starsuperscare/database';

export class RefundCalculatorService {
  /**
   * Calculates the final refundable amount for a given return request.
   * Ensures that the total refund never exceeds the original captured payment.
   */
  static async calculateMaxRefund(
    orderId: string,
    requestedReturnItems: { orderItemId: string; quantity: number }[],
  ): Promise<number> {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order) return 0;

    let maxRefund = 0;

    for (const reqItem of requestedReturnItems) {
      const item = await db.query.orderItems.findFirst({
        where: eq(orderItems.id, reqItem.orderItemId),
      });
      if (!item) continue;

      // Basic item value
      // The priceSnapshot is the post-variant-adjustment price before order-level discounts.
      maxRefund += item.priceSnapshot * reqItem.quantity;
    }

    // Now, we must prorate the order-level discount across all items if we want exact math,
    // but the simplest robust way to ensure we don't refund more than paid is capping it against the remaining order balance.

    // Find all successful refunds so far for this order
    const existingRefunds = await db.query.refunds.findMany({
      where: and(eq(refunds.orderId, orderId), eq(refunds.status, 'completed')),
    });

    const totalAlreadyRefunded = existingRefunds.reduce((sum: number, r: any) => sum + r.amount, 0);

    // totalAmount is the actual captured payment (subtotal + shipping + tax + serviceFee - discount)
    const remainingCapturedPayment = order.totalAmount - totalAlreadyRefunded;

    // We can't refund more than the total they paid.
    if (maxRefund > remainingCapturedPayment) {
      maxRefund = remainingCapturedPayment;
    }

    return maxRefund;
  }
}
