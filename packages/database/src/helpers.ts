/**
 * Generates an ISO 8601 UTC timestamp string.
 * This ensures consistency across the application when inserting/updating timestamps.
 */
export function getUtcTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Converts a string or decimal Rupiah amount (e.g. 15000.50) into an integer representation (e.g. 15000)
 * since the database stores money as integer (IDR).
 * Fractions of a Rupiah are truncated.
 */
export function toIdrInteger(amount: number | string): number {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) {
    throw new Error('Invalid monetary amount provided');
  }
  return Math.floor(numericAmount);
}

/**
 * Formats an integer IDR amount to a localized string (e.g., 15000 -> "Rp 15.000").
 */
export function formatIdr(amount: number | bigint): string {
  const numericAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}
