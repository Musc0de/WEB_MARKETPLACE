export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount == null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string | null | undefined, includeTime = false): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      }),
    };

    return new Intl.DateTimeFormat('id-ID', options).format(date);
  } catch (_e) {
    return '-';
  }
};
