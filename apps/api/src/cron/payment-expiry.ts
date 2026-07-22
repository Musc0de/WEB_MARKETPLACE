import { db } from '@starsuperscare/database';
import {
  inventoryLevels,
  orderItems,
  orders,
  orderStatusHistory,
  payments,
} from '@starsuperscare/database';
import { eq, sql } from 'drizzle-orm';

/**
 * Cron Job: Auto-Expire Pending Payments
 *
 * Runs every 5 minutes.
 * Sweeps the `payments` table for any `pending` payments that were created
 * more than 30 minutes ago. For each expired payment:
 * 1. Marks the payment as 'failed'.
 * 2. Marks the order as 'cancelled'.
 * 3. Records the cancellation in `orderStatusHistory`.
 * 4. Reverts the inventory reservations in `inventoryLevels`.
 */

// Use setInterval as a fallback if Deno.cron is not enabled or available
const RUN_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

async function runPaymentExpiryJob() {
  try {
    // Calculate timestamp for 30 minutes ago
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const thirtyMinsStr = thirtyMinutesAgo.toISOString();

    // Find all pending payments older than 30 mins
    const expiredPayments = await db.select().from(payments).where(
      sql`${payments.status} = 'pending' AND ${payments.createdAt} <= ${thirtyMinsStr}`,
    );

    if (expiredPayments.length === 0) return;

    console.log(JSON.stringify({
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message: `[CRON] Found ${expiredPayments.length} expired payments to process.`,
    }));

    const processedOrderIds = new Set<string>();

    for (const payment of expiredPayments) {
      try {
        if (processedOrderIds.has(payment.orderId)) {
          // Just mark the duplicate payment as failed
          await db.update(payments).set({
            status: 'failed',
            updatedAt: new Date().toISOString(),
          }).where(eq(payments.id, payment.id));
          continue;
        }

        processedOrderIds.add(payment.orderId);

        await db.transaction(async (tx) => {
          // 1. Mark payment as failed/expired
          await tx.update(payments).set({
            status: 'failed',
            updatedAt: new Date().toISOString(),
          }).where(eq(payments.id, payment.id));

          // 2. Mark order as cancelled
          await tx.update(orders).set({
            status: 'cancelled',
            updatedAt: new Date().toISOString(),
          }).where(eq(orders.id, payment.orderId));

          // 3. Record order history
          await tx.insert(orderStatusHistory).values({
            orderId: payment.orderId,
            status: 'cancelled',
            note: 'Pesanan dibatalkan otomatis karena melebihi batas waktu pembayaran',
            createdAt: new Date().toISOString(),
          });

          // 4. Restock inventory (revert reservation)
          const items = await tx.select().from(orderItems).where(
            eq(orderItems.orderId, payment.orderId),
          );
          for (const item of items) {
            // Note: This reverses the logic from checkout.ts which adds to reserved and subtracts from available.
            // Using GREATEST(0, ...) to ensure we don't violate the reserved >= 0 constraint if it was manually adjusted
            await tx.update(inventoryLevels).set({
              available: sql`${inventoryLevels.available} + ${item.quantity}`,
              reserved: sql`GREATEST(0, ${inventoryLevels.reserved} - ${item.quantity})`,
            }).where(eq(inventoryLevels.variantId, item.variantId));
          }
        });

        console.log(JSON.stringify({
          level: 'INFO',
          timestamp: new Date().toISOString(),
          message: `[CRON] Expired payment ${payment.id} and restocked order ${payment.orderId}`,
        }));
      } catch (innerErr) {
        console.error(JSON.stringify({
          level: 'ERROR',
          timestamp: new Date().toISOString(),
          message: `[CRON] Error processing payment expiry for ${payment.id}`,
          error: innerErr instanceof Error ? innerErr.message : String(innerErr),
        }));
      }
    }
  } catch (err) {
    console.error(JSON.stringify({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message: '[CRON] Error in payment expiry job',
      error: err instanceof Error ? err.message : String(err),
    }));
  }
}

// Check if Deno.cron is available and enabled, else fallback to setInterval
if (typeof Deno !== 'undefined' && typeof (Deno as any).cron === 'function') {
  (Deno as any).cron('Auto-Expire Pending Payments', '*/5 * * * *', runPaymentExpiryJob);
} else {
  console.log(JSON.stringify({
    level: 'INFO',
    timestamp: new Date().toISOString(),
    message: '[CRON] Deno.cron not available, falling back to setInterval (every 5 minutes)',
  }));
  setInterval(runPaymentExpiryJob, RUN_INTERVAL_MS);

  // Run once immediately on startup just in case
  setTimeout(runPaymentExpiryJob, 5000);
}
