/**
 * Formats a number into Indonesian Rupiah currency string.
 * Uses integer formatting (no floating points).
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a date string or Date object into Indonesian localized date.
 * Enforces Asia/Jakarta timezone at the presentation layer.
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
    ...options,
  };
  return new Intl.DateTimeFormat('id-ID', defaultOptions).format(new Date(date));
}

/**
 * Formats sold counts into Indonesian shorthand (e.g. 10,5 rb Terjual)
 */
export function formatIndonesianSold(count: number): string {
  if (count < 1000) {
    return `${count} Terjual`;
  }
  if (count < 1000000) {
    const rb = count / 1000;
    // Format to 1 decimal place max, replacing dot with comma for ID locale
    const formatted = rb % 1 === 0 ? rb.toString() : rb.toFixed(1).replace('.', ',');
    return `${formatted} rb Terjual`;
  }
  const jt = count / 1000000;
  const formatted = jt % 1 === 0 ? jt.toString() : jt.toFixed(1).replace('.', ',');
  return `${formatted} jt Terjual`;
}
