/**
 * Shared UI helpers used across admin list pages.
 * Provides: PageHeader, StatusPill, TableSkeleton, EmptyState, Pagination, SearchBar
 */
import type { LucideIcon } from 'lucide-react';
import { AlertCircle, ChevronLeft, ChevronRight, Search } from 'lucide-react';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  // Returns
  pending: { label: 'Menunggu', cls: 'bg-gray-100 text-gray-600' },
  approved: { label: 'Disetujui', cls: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Ditolak', cls: 'bg-red-100 text-red-700' },
  received: { label: 'Diterima', cls: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Selesai', cls: 'bg-teal-100 text-teal-700' },
  // Refunds
  initiated: { label: 'Diajukan', cls: 'bg-amber-100 text-amber-700' },
  processed: { label: 'Diproses', cls: 'bg-blue-100 text-blue-700' },
  failed: { label: 'Gagal', cls: 'bg-red-100 text-red-700' },
  refunded: { label: 'Direfund', cls: 'bg-purple-100 text-purple-700' },
  // Payments
  paid: { label: 'Dibayar', cls: 'bg-emerald-100 text-emerald-700' },
  unpaid: { label: 'Belum Bayar', cls: 'bg-rose-100 text-rose-700' },
  overdue: { label: 'Jatuh Tempo', cls: 'bg-red-100 text-red-800' },
  // Support
  open: { label: 'Terbuka', cls: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'Diproses', cls: 'bg-amber-100 text-amber-700' },
  resolved: { label: 'Selesai', cls: 'bg-emerald-100 text-emerald-700' },
  closed: { label: 'Ditutup', cls: 'bg-gray-100 text-gray-500' },
  // Orders
  processing: { label: 'Diproses', cls: 'bg-amber-100 text-amber-700' },
  shipped: { label: 'Dikirim', cls: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Terkirim', cls: 'bg-teal-100 text-teal-700' },
  cancelled: { label: 'Dibatalkan', cls: 'bg-red-100 text-red-700' },
  // Priority
  low: { label: 'Rendah', cls: 'bg-gray-100 text-gray-500' },
  normal: { label: 'Normal', cls: 'bg-blue-100 text-blue-700' },
  high: { label: 'Tinggi', cls: 'bg-amber-100 text-amber-700' },
  urgent: { label: 'Darurat', cls: 'bg-red-100 text-red-700' },
};

export function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_MAP[status] ??
    { label: status.toUpperCase(), cls: 'bg-gray-100 text-gray-600' };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Page header ──────────────────────────────────────────────────────────────

export function PageHeader({
  icon: Icon,
  title,
  description,
  badge,
  badgeColor = 'bg-blue-50 text-blue-700 ring-blue-600/20',
  actions,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-start gap-4'>
        <span className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md'>
          <Icon className='h-6 w-6 text-white' />
        </span>
        <div>
          {badge && (
            <span
              className={`mb-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${badgeColor}`}
            >
              {badge}
            </span>
          )}
          <h1 className='text-2xl font-black tracking-tight text-gray-900 sm:text-3xl'>{title}</h1>
          <p className='mt-1 text-sm text-gray-500'>{description}</p>
        </div>
      </div>
      {actions && <div className='flex items-center gap-2 flex-shrink-0'>{actions}</div>}
    </div>
  );
}

// ─── Search bar ───────────────────────────────────────────────────────────────

export function SearchBar({
  value,
  onChange,
  placeholder = 'Cari...',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className='relative max-w-sm'>
      <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
      <input
        type='search'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className='h-9 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
      />
    </div>
  );
}

// ─── Tab filter bar ───────────────────────────────────────────────────────────

export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className='flex flex-wrap gap-1.5'>
      {options.map(({ key, label }) => (
        <button
          key={key}
          type='button'
          onClick={() => onChange(key)}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
            value === key
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 scale-[1.02]'
              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Table skeleton ───────────────────────────────────────────────────────────

export function TableSkeleton({ cols, rows = 6 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className='border-b border-gray-50'>
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className='px-5 py-4'>
              <div
                className='h-4 animate-pulse rounded-md bg-gray-100'
                style={{ width: `${50 + ((r * cols + c) * 17) % 45}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

export function EmptyState({ icon: Icon, title, description }: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center'>
      <span className='mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100'>
        <Icon className='h-8 w-8 text-gray-400' />
      </span>
      <p className='text-base font-semibold text-gray-700'>{title}</p>
      {description && <p className='mt-1 text-sm text-gray-400'>{description}</p>}
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className='flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5'>
      <AlertCircle className='mt-0.5 h-5 w-5 shrink-0 text-red-500' />
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-semibold text-red-800'>Gagal memuat data</p>
        <p className='text-sm text-red-600'>{message}</p>
      </div>
      {onRetry && (
        <button
          type='button'
          onClick={onRetry}
          className='text-sm font-semibold text-red-700 hover:underline flex-shrink-0'
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}

// ─── Table wrapper ────────────────────────────────────────────────────────────

export function DataTable({
  headers,
  children,
  summary,
}: {
  headers: { label: string; right?: boolean }[];
  children: React.ReactNode;
  summary?: string;
}) {
  return (
    <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>
      {summary && (
        <div className='border-b border-gray-100 px-5 py-3 text-xs font-medium text-gray-500'>
          {summary}
        </div>
      )}
      <div className='overflow-x-auto'>
        <table className='min-w-full'>
          <thead>
            <tr className='border-b border-gray-100 bg-gray-50/80'>
              {headers.map(({ label, right }) => (
                <th
                  key={label}
                  className={`px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 ${
                    right ? 'text-right' : 'text-left'
                  }`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-50'>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export function Pagination({
  page,
  total,
  limit,
  onPageChange,
}: {
  page: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages: number[] = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    pages.push(i);
  }

  return (
    <div className='flex items-center justify-between border-t border-gray-100 bg-white px-5 py-4 rounded-b-2xl'>
      <p className='text-sm text-gray-500'>
        <span className='font-semibold text-gray-700'>{from}–{to}</span> dari{' '}
        <span className='font-semibold text-gray-700'>{total}</span> data
      </p>
      <div className='flex items-center gap-1.5'>
        <button
          type='button'
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className='inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition'
        >
          <ChevronLeft className='h-3.5 w-3.5' /> Sebelumnya
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type='button'
            onClick={() => onPageChange(p)}
            className={`h-8 w-8 rounded-lg text-sm font-semibold transition ${
              p === page
                ? 'bg-blue-600 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type='button'
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className='inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition'
        >
          Lanjut <ChevronRight className='h-3.5 w-3.5' />
        </button>
      </div>
    </div>
  );
}
