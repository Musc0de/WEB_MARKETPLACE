import { db } from '@starsuperscare/database';
import {
  carts,
  inventoryLevels,
  inventoryMovements,
  inventoryReservations,
  orderArchives,
  orders,
  outboxArchives,
  outboxEvents,
  sessions,
  tokens,
} from '@starsuperscare/database';
import { and, eq, inArray, isNull, lte, or, sql } from 'drizzle-orm';
const uuidv4 = () => crypto.randomUUID();

export async function runCleanupJobs() {
  const now = new Date().toISOString();

  // 1. Cleanup Expired Sessions
  try {
    const deletedSessions = await db.delete(sessions)
      .where(lte(sessions.expiresAt, now))
      .returning({ id: sessions.id });
    if (deletedSessions.length > 0) {
      console.log(`[cleanup] Deleted ${deletedSessions.length} expired sessions.`);
    }
  } catch (err) {
    console.error(`[cleanup] Error deleting expired sessions:`, err);
  }

  // 2. Cleanup Expired Tokens
  try {
    const deletedTokens = await db.delete(tokens)
      .where(lte(tokens.expiresAt, now))
      .returning({ id: tokens.id });
    if (deletedTokens.length > 0) {
      console.log(`[cleanup] Deleted ${deletedTokens.length} expired tokens.`);
    }
  } catch (err) {
    console.error(`[cleanup] Error deleting expired tokens:`, err);
  }

  // 3. Cleanup Stale Guest Carts (or any expired cart)
  try {
    // If guest carts have userId as NULL, and an expiresAt
    // Let's just delete any cart that has expired
    const deletedCarts = await db.delete(carts)
      .where(
        and(
          isNull(carts.userId),
          lte(carts.expiresAt, now),
        ),
      )
      .returning({ id: carts.id });
    if (deletedCarts.length > 0) {
      console.log(`[cleanup] Deleted ${deletedCarts.length} stale guest carts.`);
    }
  } catch (err) {
    console.error(`[cleanup] Error deleting stale guest carts:`, err);
  }

  // 4. Release Expired Inventory Reservations
  try {
    await db.transaction(async (tx) => {
      // Find all active reservations that are expired
      const expiredReservations = await tx.select()
        .from(inventoryReservations)
        .where(
          and(
            eq(inventoryReservations.status, 'active'),
            lte(inventoryReservations.expiresAt, now),
          ),
        )
        .for('update', { skipLocked: true });

      if (expiredReservations.length === 0) return;

      for (const reservation of expiredReservations) {
        // Mark as expired
        await tx.update(inventoryReservations)
          .set({ status: 'expired' })
          .where(eq(inventoryReservations.id, reservation.id));

        // Decrement reserved and increment available (note: our schema doesn't track warehouse per reservation,
        // wait, inventoryReservations doesn't have warehouseId but inventoryLevels has warehouseId)
        // Let's look up the inventory level for this variant (assuming single warehouse for now or find the level that was reserved)

        // Actually, we can just update inventoryLevels where variantId matches
        // It's possible there are multiple warehouses, but we'll decrement reserved across all
        // Usually, the system should specify which warehouse was reserved.
        // For simplicity, we just refund it to the first available warehouse or a specific one.
        const [level] = await tx.select().from(inventoryLevels).where(
          eq(inventoryLevels.variantId, reservation.variantId),
        ).limit(1);

        if (level) {
          await tx.update(inventoryLevels)
            .set({
              available: sql`${inventoryLevels.available} + ${reservation.quantity}`,
              reserved: sql`${inventoryLevels.reserved} - ${reservation.quantity}`,
            })
            .where(eq(inventoryLevels.id, level.id));

          // Add movement
          await tx.insert(inventoryMovements).values({
            id: uuidv4(),
            variantId: reservation.variantId,
            warehouseId: level.warehouseId,
            quantity: reservation.quantity,
            type: 'release',
            referenceId: reservation.id,
            note: 'Cleanup of expired reservation',
          });
        }
      }

      console.log(
        `[cleanup] Released ${expiredReservations.length} expired inventory reservations.`,
      );
    });
  } catch (err) {
    console.error(`[cleanup] Error releasing expired reservations:`, err);
  }

  // 5. Archive Old Orders (> 1 year old, delivered or cancelled)
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const dateLimit = oneYearAgo.toISOString();

    await db.transaction(async (tx) => {
      const oldOrders = await tx.select().from(orders).where(
        and(
          lte(orders.createdAt, dateLimit),
          or(eq(orders.status, 'delivered'), eq(orders.status, 'cancelled')),
        ),
      ).limit(100);

      if (oldOrders.length > 0) {
        await tx.insert(orderArchives).values(oldOrders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          originalCreatedAt: o.createdAt,
          dataSnapshot: o,
        })));

        await tx.delete(orders).where(inArray(orders.id, oldOrders.map((o) => o.id)));
        console.log(`[cleanup] Archived ${oldOrders.length} old orders.`);
      }
    });
  } catch (err) {
    console.error(`[cleanup] Error archiving orders:`, err);
  }

  // 6. Archive Old Outbox Events (> 30 days old, completed or failed)
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateLimit = thirtyDaysAgo.toISOString();

    await db.transaction(async (tx) => {
      const oldEvents = await tx.select().from(outboxEvents).where(
        and(
          lte(outboxEvents.createdAt, dateLimit),
          or(eq(outboxEvents.state, 'completed'), eq(outboxEvents.state, 'failed')),
        ),
      ).limit(100);

      if (oldEvents.length > 0) {
        await tx.insert(outboxArchives).values(oldEvents.map((e) => ({
          id: e.id,
          type: e.type,
          payload: e.payload,
          state: e.state,
          errorDetails: e.errorDetails,
          retryCount: e.retryCount,
          originalCreatedAt: e.createdAt,
        })));

        await tx.delete(outboxEvents).where(inArray(outboxEvents.id, oldEvents.map((e) => e.id)));
        console.log(`[cleanup] Archived ${oldEvents.length} old outbox events.`);
      }
    });
  } catch (err) {
    console.error(`[cleanup] Error archiving outbox events:`, err);
  }

  // 7. Cleanup Stuck Outbox Events
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const stuckEvents = await db.update(outboxEvents)
      .set({ state: 'pending' })
      .where(
        and(
          eq(outboxEvents.state, 'processing'),
          lte(outboxEvents.availableAt, fiveMinutesAgo),
        ),
      )
      .returning({ id: outboxEvents.id });
    if (stuckEvents.length > 0) {
      console.log(`[cleanup] Reset ${stuckEvents.length} stuck outbox events back to pending.`);
    }
  } catch (err) {
    console.error(`[cleanup] Error resetting stuck outbox events:`, err);
  }
}
