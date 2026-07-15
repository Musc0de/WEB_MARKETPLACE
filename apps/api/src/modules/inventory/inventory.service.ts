import { and, eq, sql } from 'drizzle-orm';
import {
  db,
  inventoryLevels,
  inventoryMovements,
  inventoryReservations,
} from '@starsuperscare/database';

type Tx = typeof db; // Use db type for transaction

export class InventoryService {
  /**
   * Adjust available stock, ensuring optimistic locking to prevent race conditions.
   */
  static async adjustStock(
    tx: Tx,
    params: {
      variantId: string;
      warehouseId: string;
      delta: number;
      type: 'receive' | 'adjust' | 'ship';
      note?: string;
      referenceId?: string;
    },
  ) {
    const { variantId, warehouseId, delta, type, note, referenceId } = params;

    // 1. Get current level
    const level = await tx.query.inventoryLevels.findFirst({
      where: and(
        eq(inventoryLevels.variantId, variantId),
        eq(inventoryLevels.warehouseId, warehouseId),
      ),
    });

    if (!level) {
      if (delta < 0) throw new Error('Insufficient stock: level not found');

      // Initialize if not exists
      await tx.insert(inventoryLevels).values({
        variantId,
        warehouseId,
        available: delta,
        version: 1,
      });
    } else {
      if (level.available + delta < 0) {
        throw new Error(`Insufficient stock: only ${level.available} available`);
      }

      // Optimistic concurrency update
      const updateResult = await tx
        .update(inventoryLevels)
        .set({
          available: sql`${inventoryLevels.available} + ${delta}`,
          version: sql`${inventoryLevels.version} + 1`,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(inventoryLevels.id, level.id),
            eq(inventoryLevels.version, level.version),
          ),
        );

      // If no rows were updated, a concurrent modification occurred
      if ((updateResult as any).length === 0 || (updateResult as any).rowCount === 0) {
        throw new Error('Concurrent modification detected. Please retry.');
      }
    }

    // 2. Log movement
    await tx.insert(inventoryMovements).values({
      variantId,
      warehouseId,
      quantity: delta,
      type,
      referenceId: referenceId || null,
      note: note || null,
    });

    return true;
  }

  /**
   * Reserve stock temporarily (e.g. during checkout)
   */
  static async reserveStock(
    tx: Tx,
    params: {
      variantId: string;
      warehouseId: string;
      quantity: number;
      userId?: string;
      expiresInMinutes?: number;
    },
  ) {
    const { variantId, warehouseId, quantity, userId, expiresInMinutes = 15 } = params;

    if (quantity <= 0) throw new Error('Quantity must be positive');

    const level = await tx.query.inventoryLevels.findFirst({
      where: and(
        eq(inventoryLevels.variantId, variantId),
        eq(inventoryLevels.warehouseId, warehouseId),
      ),
    });

    if (!level || level.available < quantity) {
      throw new Error('Insufficient available stock to reserve');
    }

    // Optimistic concurrency update
    const updateResult = await tx
      .update(inventoryLevels)
      .set({
        available: sql`${inventoryLevels.available} - ${quantity}`,
        reserved: sql`${inventoryLevels.reserved} + ${quantity}`,
        version: sql`${inventoryLevels.version} + 1`,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(inventoryLevels.id, level.id),
          eq(inventoryLevels.version, level.version),
        ),
      );

    if ((updateResult as any).length === 0 || (updateResult as any).rowCount === 0) {
      throw new Error('Concurrent modification detected while reserving. Please retry.');
    }

    // Create reservation record
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000).toISOString();
    const [reservation] = await tx
      .insert(inventoryReservations)
      .values({
        variantId,
        userId: userId || null,
        quantity,
        expiresAt,
        status: 'active',
      })
      .returning();

    // Log movement
    await tx.insert(inventoryMovements).values({
      variantId,
      warehouseId,
      quantity: -quantity,
      type: 'reserve',
      referenceId: reservation.id,
      note: 'Reservation created',
    });

    return reservation;
  }

  /**
   * Commit a reservation (e.g. after successful payment)
   */
  static async commitReservation(tx: Tx, reservationId: string, warehouseId: string) {
    const reservation = await tx.query.inventoryReservations.findFirst({
      where: eq(inventoryReservations.id, reservationId),
    });

    if (!reservation || reservation.status !== 'active') {
      throw new Error('Invalid or inactive reservation');
    }

    const level = await tx.query.inventoryLevels.findFirst({
      where: and(
        eq(inventoryLevels.variantId, reservation.variantId),
        eq(inventoryLevels.warehouseId, warehouseId),
      ),
    });

    if (!level || level.reserved < reservation.quantity) {
      throw new Error('Data inconsistency: not enough reserved stock');
    }

    // Decrement reserved stock ONLY
    const updateResult = await tx
      .update(inventoryLevels)
      .set({
        reserved: sql`${inventoryLevels.reserved} - ${reservation.quantity}`,
        version: sql`${inventoryLevels.version} + 1`,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(inventoryLevels.id, level.id),
          eq(inventoryLevels.version, level.version),
        ),
      );

    if ((updateResult as any).length === 0 || (updateResult as any).rowCount === 0) {
      throw new Error('Concurrent modification detected. Please retry.');
    }

    // Update reservation
    await tx
      .update(inventoryReservations)
      .set({
        status: 'fulfilled',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(inventoryReservations.id, reservationId));

    // Log movement
    await tx.insert(inventoryMovements).values({
      variantId: reservation.variantId,
      warehouseId,
      quantity: -reservation.quantity,
      type: 'ship',
      referenceId: reservation.id,
      note: 'Reservation fulfilled',
    });

    return true;
  }

  /**
   * Release a reservation (e.g. abandoned cart or expired)
   */
  static async releaseReservation(tx: Tx, reservationId: string, warehouseId: string) {
    const reservation = await tx.query.inventoryReservations.findFirst({
      where: eq(inventoryReservations.id, reservationId),
    });

    if (!reservation || reservation.status !== 'active') {
      throw new Error('Invalid or inactive reservation');
    }

    const level = await tx.query.inventoryLevels.findFirst({
      where: and(
        eq(inventoryLevels.variantId, reservation.variantId),
        eq(inventoryLevels.warehouseId, warehouseId),
      ),
    });

    if (!level || level.reserved < reservation.quantity) {
      throw new Error('Data inconsistency: not enough reserved stock');
    }

    // Revert reservation: +available, -reserved
    const updateResult = await tx
      .update(inventoryLevels)
      .set({
        available: sql`${inventoryLevels.available} + ${reservation.quantity}`,
        reserved: sql`${inventoryLevels.reserved} - ${reservation.quantity}`,
        version: sql`${inventoryLevels.version} + 1`,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(inventoryLevels.id, level.id),
          eq(inventoryLevels.version, level.version),
        ),
      );

    if ((updateResult as any).length === 0 || (updateResult as any).rowCount === 0) {
      throw new Error('Concurrent modification detected. Please retry.');
    }

    // Update reservation
    await tx
      .update(inventoryReservations)
      .set({
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(inventoryReservations.id, reservationId));

    // Log movement
    await tx.insert(inventoryMovements).values({
      variantId: reservation.variantId,
      warehouseId,
      quantity: reservation.quantity,
      type: 'release',
      referenceId: reservation.id,
      note: 'Reservation released',
    });

    return true;
  }
}
