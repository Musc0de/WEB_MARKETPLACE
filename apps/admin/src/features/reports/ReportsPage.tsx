import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Package,
  TrendingUp,
  RotateCcw,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { formatIDR, formatDate } from '@starsuperscare/ui';

// ─── Types ────────────────────────────────────────────────────────────────────

type ReportTab = 'sales' | 'financial' | 'stock' | 'returns';

interface DateRange {
  startDate: string;
  endDate: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  paid: { label: 'Dibayar', className: 'bg-green-100 text-green-800' },
  delivered: { label: 'Terkirim', className: 'bg-emerald-100 text-emerald-800' },
  processing: { label: 'Diproses', className: 'bg-amber-100 text-amber-800' },
  shipped: { label: 'Dikirim', className: 'bg-blue-100 text-blue-800' },
  pending: { label: 'Menunggu', className: 'bg-gray-100 text-gray-700' },
  cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-800' },
  refunded: { label: 'Direfund', className: 'bg-purple-100 text-purple-800' },
  approved: { label: 'Disetujui', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Ditolak', className: 'bg-red-100 text-red-800' },
  received: { label: 'Diterima', className: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Selesai', className: 'bg-emerald-100 text-emerald-800' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_BADGE[status] ?? { label: status.toUpperCase(), className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

// ─── Summary Cards ────────────────────────────────────────────────────────────

function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: typeof BarChart3;
  label: string;
  value: string;
  sub?: string;
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <span className={`p-2 rounded-xl ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </span>
        <p className="text-sm font-medium text-gray-500">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
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

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Menampilkan <span className="font-semibold text-gray-700">{from}–{to}</span> dari{' '}
        <span className="font-semibold text-gray-700">{total}</span> data
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="h-4 w-4" />
          Sebelumnya
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum = i + 1;
            if (totalPages > 5) {
              if (page > 3) pageNum = page - 2 + i;
              if (page > totalPages - 2) pageNum = totalPages - 4 + i;
            }
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`h-8 w-8 rounded-lg text-sm font-medium transition ${
                  pageNum === page
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Lanjut
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Export to CSV ────────────────────────────────────────────────────────────

function exportCSV(data: any[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Table Loading Skeleton ───────────────────────────────────────────────────

function TableSkeleton({ cols, rows = 5 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-6 py-4">
              <div className="h-4 animate-pulse rounded bg-gray-100" style={{ width: `${60 + Math.random() * 30}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Tab: Penjualan ───────────────────────────────────────────────────────────

function SalesReport({ dateRange }: { dateRange: DateRange }) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (dateRange.startDate) params.set('startDate', dateRange.startDate);
  if (dateRange.endDate) params.set('endDate', dateRange.endDate);

  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'sales', page, dateRange],
    queryFn: () => api.get(`/admin/reports/sales?${params}`),
  });

  const rows: any[] = data?.data ?? [];
  const total: number = data?.total ?? 0;
  const summary = data?.summary ?? {};

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard icon={TrendingUp} label="Total Pendapatan" value={formatIDR(summary.totalRevenue ?? 0)} color="green" />
        <SummaryCard icon={BarChart3} label="Total Pesanan" value={String(summary.totalOrders ?? 0)} color="blue" />
        <SummaryCard icon={CheckCircle2} label="Avg per Pesanan" value={formatIDR(summary.totalOrders ? (summary.totalRevenue / summary.totalOrders) : 0)} color="purple" />
        <SummaryCard icon={Clock} label="Periode Data" value={dateRange.startDate ? `${dateRange.startDate} – ${dateRange.endDate}` : 'Semua waktu'} color="amber" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['No. Pesanan', 'Pelanggan', 'Email', 'Status', 'Total', 'Tanggal'].map((h) => (
                <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <TableSkeleton cols={6} />
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                  Tidak ada data untuk periode ini
                </td>
              </tr>
            ) : rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-blue-600">{row.orderNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{row.customerName || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{row.customerEmail || '—'}</td>
                <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatIDR(row.totalAmount)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(row.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={() => exportCSV(rows, 'laporan_penjualan')} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Keuangan ────────────────────────────────────────────────────────────

function FinancialReport({ dateRange }: { dateRange: DateRange }) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (dateRange.startDate) params.set('startDate', dateRange.startDate);
  if (dateRange.endDate) params.set('endDate', dateRange.endDate);

  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'financial', page, dateRange],
    queryFn: () => api.get(`/admin/reports/financial?${params}`),
  });

  const rows: any[] = data?.data ?? [];
  const total: number = data?.total ?? 0;
  const summary = data?.summary ?? {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard icon={TrendingUp} label="Gross Revenue" value={formatIDR(summary.grossRevenue ?? 0)} color="green" />
        <SummaryCard icon={CheckCircle2} label="Transaksi Sukses" value={String(summary.totalTransactions ?? 0)} color="blue" />
        <SummaryCard icon={XCircle} label="Pesanan Dibatalkan" value={String(summary.cancelledOrders ?? 0)} color="red" />
        <SummaryCard icon={RotateCcw} label="Direfund" value={String(summary.refundedOrders ?? 0)} color="purple" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['No. Pesanan', 'Email', 'Status', 'Total', 'Tanggal'].map((h) => (
                <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <TableSkeleton cols={5} />
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">Tidak ada data keuangan</td>
              </tr>
            ) : rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-blue-600">{row.orderNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{row.customerEmail || '—'}</td>
                <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatIDR(row.totalAmount)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(row.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={() => exportCSV(rows, 'laporan_keuangan')} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Stok ────────────────────────────────────────────────────────────────

function StockReport({ dateRange: _dateRange }: { dateRange: DateRange }) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const params = new URLSearchParams({ page: String(page), limit: String(limit) });

  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'stock', page],
    queryFn: () => api.get(`/admin/reports/stock?${params}`),
  });

  const rows: any[] = data?.data ?? [];
  const total: number = data?.total ?? 0;
  const summary = data?.summary ?? {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <SummaryCard icon={Package} label="Total Stok Tersedia" value={String(summary.totalAvailable ?? 0)} sub="Unit tersedia di semua gudang" color="green" />
        <SummaryCard icon={Clock} label="Total Direservasi" value={String(summary.totalReserved ?? 0)} sub="Dikunci oleh pesanan aktif" color="amber" />
        <SummaryCard icon={AlertTriangle} label="Total Rusak/Hilang" value={String(summary.totalDamaged ?? 0)} sub="Unit dalam kondisi rusak" color="red" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Produk', 'SKU', 'Status Produk', 'Tersedia', 'Reservasi', 'Rusak', 'Terakhir Update'].map((h) => (
                <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <TableSkeleton cols={7} />
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">Tidak ada data stok</td>
              </tr>
            ) : rows.map((row) => (
              <tr key={row.variantId} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900">{row.productName}</p>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-gray-500">{row.sku || '—'}</td>
                <td className="px-6 py-4"><StatusBadge status={row.productStatus} /></td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-bold ${row.available <= 5 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {row.available}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-amber-600 font-medium">{row.reserved}</td>
                <td className="px-6 py-4 text-sm text-red-600 font-medium">{row.damaged}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{formatDate(row.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={() => exportCSV(rows, 'laporan_stok')} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Retur & Kehilangan ──────────────────────────────────────────────────

function ReturnsReport({ dateRange }: { dateRange: DateRange }) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (dateRange.startDate) params.set('startDate', dateRange.startDate);
  if (dateRange.endDate) params.set('endDate', dateRange.endDate);

  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'returns', page, dateRange],
    queryFn: () => api.get(`/admin/reports/returns?${params}`),
  });

  const rows: any[] = data?.data ?? [];
  const total: number = data?.total ?? 0;
  const summary = data?.summary ?? {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <SummaryCard icon={RotateCcw} label="Total Retur" value={String(summary.totalReturns ?? 0)} sub="Permintaan retur dalam periode ini" color="purple" />
        <SummaryCard icon={AlertTriangle} label="Total Stok Rusak" value={String(summary.totalDamagedStock ?? 0)} sub="Unit rusak di seluruh gudang" color="red" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['ID Retur', 'Order ID', 'Alasan', 'Resolusi', 'Jml Item', 'Status', 'Tanggal'].map((h) => (
                <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <TableSkeleton cols={7} />
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">Tidak ada data retur</td>
              </tr>
            ) : rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4 text-sm font-mono text-gray-500">{row.id.split('-')[0]}…</td>
                <td className="px-6 py-4 text-sm text-blue-600 font-medium">{row.orderId.split('-')[0]}…</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{row.reason || '—'}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 capitalize">
                    {row.resolution}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-700 text-center">{row.itemCount}</td>
                <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                <td className="px-6 py-4 text-sm text-gray-400">{formatDate(row.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={() => exportCSV(rows, 'laporan_retur')} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: { key: ReportTab; label: string; icon: typeof BarChart3; description: string }[] = [
  { key: 'sales', label: 'Penjualan', icon: TrendingUp, description: 'Semua transaksi pesanan' },
  { key: 'financial', label: 'Keuangan', icon: BarChart3, description: 'Revenue & transaksi sukses' },
  { key: 'stock', label: 'Stok', icon: Package, description: 'Kondisi inventaris produk' },
  { key: 'returns', label: 'Retur & Kehilangan', icon: RotateCcw, description: 'Pengembalian & kerusakan barang' },
];

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('sales');
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: '', endDate: '' });

  const today = new Date().toISOString().split('T')[0];

  const setPreset = useCallback((days: number | null) => {
    if (days === null) {
      setDateRange({ startDate: '', endDate: '' });
    } else {
      const end = new Date().toISOString().split('T')[0];
      const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setDateRange({ startDate: start, endDate: end });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      {/* ── Page Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
            Analytics
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Pusat Laporan
        </h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Laporan keuangan, penjualan, stok, dan retur barang secara real-time.
        </p>
      </div>

      {/* ── Date Filter Bar ── */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-600 mr-1">Periode:</span>

        {/* Preset buttons */}
        {[
          { label: '7 Hari', days: 7 },
          { label: '30 Hari', days: 30 },
          { label: '90 Hari', days: 90 },
          { label: 'Semua', days: null },
        ].map(({ label, days }) => (
          <button
            key={label}
            type="button"
            onClick={() => setPreset(days)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              (days === null && !dateRange.startDate) ||
              (days !== null && dateRange.startDate === new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
                ? 'bg-blue-600 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs text-gray-500">Dari:</label>
          <input
            type="date"
            value={dateRange.startDate}
            max={today}
            onChange={(e) => setDateRange((p) => ({ ...p, startDate: e.target.value }))}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="text-xs text-gray-500">Hingga:</label>
          <input
            type="date"
            value={dateRange.endDate}
            max={today}
            onChange={(e) => setDateRange((p) => ({ ...p, endDate: e.target.value }))}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex-shrink-0 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === key
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-[1.02]'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'sales' && <SalesReport dateRange={dateRange} />}
      {activeTab === 'financial' && <FinancialReport dateRange={dateRange} />}
      {activeTab === 'stock' && <StockReport dateRange={dateRange} />}
      {activeTab === 'returns' && <ReturnsReport dateRange={dateRange} />}
    </div>
  );
}
