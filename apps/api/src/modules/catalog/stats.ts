import { eq, sql } from 'drizzle-orm';
import { db, productRatingStats, productSalesStats } from '@starsuperscare/database';

/**
 * Formats a sold count into an Indonesian localized string.
 * Example:
 * 1200 -> "1,2 rb Terjual"
 * 10500 -> "10,5 rb Terjual"
 * 1500000 -> "1,5 jt Terjual"
 * 500 -> "500 Terjual"
 */
export function formatIndonesianSold(count: number): string {
  if (count < 1000) {
    return `${count} Terjual`;
  }

  if (count < 1_000_000) {
    const formatted = (count / 1000).toFixed(1).replace('.', ',');
    // Remove trailing ',0' if any
    return `${formatted.endsWith(',0') ? formatted.slice(0, -2) : formatted} rb Terjual`;
  }

  const formatted = (count / 1_000_000).toFixed(1).replace('.', ',');
  return `${formatted.endsWith(',0') ? formatted.slice(0, -2) : formatted} jt Terjual`;
}

/**
 * Increments product gross sales when an order is paid.
 */
export async function incrementGrossSales(productId: string, quantity: number) {
  return await db
    .insert(productSalesStats)
    .values({
      productId,
      grossSold: quantity,
      netSold: quantity,
      refunded: 0,
    })
    .onConflictDoUpdate({
      target: productSalesStats.productId,
      set: {
        grossSold: sql`${productSalesStats.grossSold} + ${quantity}`,
        netSold: sql`${productSalesStats.netSold} + ${quantity}`,
        updatedAt: sql`now()`,
      },
    });
}

/**
 * Increments refunded sales when an order is refunded, reducing net_sold.
 */
export async function incrementRefundedSales(productId: string, quantity: number) {
  return await db
    .insert(productSalesStats)
    .values({
      productId,
      grossSold: 0,
      netSold: -quantity,
      refunded: quantity,
    })
    .onConflictDoUpdate({
      target: productSalesStats.productId,
      set: {
        refunded: sql`${productSalesStats.refunded} + ${quantity}`,
        netSold: sql`${productSalesStats.netSold} - ${quantity}`,
        updatedAt: sql`now()`,
      },
    });
}

/**
 * Updates product rating when a new review is added or updated.
 * averageRating is stored as an integer multiplied by 100 (e.g. 4.5 => 450).
 */
export async function updateProductRatingStats(
  productId: string,
  newRating: number,
  oldRating?: number,
) {
  // If oldRating is provided, it's an update, so we don't increment reviewCount
  if (oldRating !== undefined) {
    return await db.transaction(async (tx) => {
      const stats = await tx.query.productRatingStats.findFirst({
        where: eq(productRatingStats.productId, productId),
      });

      if (!stats || stats.reviewCount === 0) return;

      // Calculate new average: (oldTotal - oldRating + newRating) / count
      const currentAvg = stats.averageRating / 100;
      const totalScore = currentAvg * stats.reviewCount;
      const newTotalScore = totalScore - oldRating + newRating;
      const newAverage = Math.round((newTotalScore / stats.reviewCount) * 100);

      await tx.update(productRatingStats)
        .set({ averageRating: newAverage, updatedAt: sql`now()` })
        .where(eq(productRatingStats.productId, productId));
    });
  }

  // It's a new review
  return await db.transaction(async (tx) => {
    const stats = await tx.query.productRatingStats.findFirst({
      where: eq(productRatingStats.productId, productId),
    });

    if (!stats) {
      // First review
      await tx.insert(productRatingStats).values({
        productId,
        averageRating: Math.round(newRating * 100),
        reviewCount: 1,
      });
    } else {
      const currentAvg = stats.averageRating / 100;
      const newCount = stats.reviewCount + 1;
      const newTotalScore = (currentAvg * stats.reviewCount) + newRating;
      const newAverage = Math.round((newTotalScore / newCount) * 100);

      await tx.update(productRatingStats)
        .set({
          averageRating: newAverage,
          reviewCount: newCount,
          updatedAt: sql`now()`,
        })
        .where(eq(productRatingStats.productId, productId));
    }
  });
}
