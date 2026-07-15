import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Box,
  CheckCircle2,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  ShoppingCart,
  Timer,
  Zap,
} from 'lucide-react';

import { api } from '../../lib/api.ts';
import { formatDate, formatIDR } from '@starsuperscare/ui';

// ─── CSS-in-JS keyframe animations injected once ─────────────────────────────
const STYLE = `
@keyframes dash-slide-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes dash-count-up { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
@keyframes dash-pulse-dot { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.6); opacity: 0.5; } }
@keyframes dash-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes dash-bar-grow { from { height: 0; } to { height: var(--h); } }
.dash-card { animation: dash-slide-in 0.45s ease both; }
.dash-card:nth-child(1) { animation-delay: 0ms; }
.dash-card:nth-child(2) { animation-delay: 80ms; }
.dash-card:nth-child(3) { animation-delay: 160ms; }
.dash-card:nth-child(4) { animation-delay: 240ms; }
.dash-value { animation: dash-count-up 0.5s cubic-bezier(.34,1.56,.64,1) both; animation-delay: 0.35s; }
.dash-live-dot { animation: dash-pulse-dot 1.8s ease-in-out infinite; }
.dash-activity-row { animation: dash-slide-in 0.35s ease both; }
.dash-activity-row:nth-child(1) { animation-delay: 0.1s; }
.dash-activity-row:nth-child(2) { animation-delay: 0.2s; }
.dash-activity-row:nth-child(3) { animation-delay: 0.3s; }
.dash-activity-row:nth-child(4) { animation-delay: 0.4s; }
.dash-activity-row:nth-child(5) { animation-delay: 0.5s; }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardMetrics {
  totalSold: number;
  waitingToShip: number;
  waitingPayment: number;
  totalAvailableStock: number;
}

interface MetricCard {
  id: string;
  title: string;
  value: number;
  description: string;
  badge: string;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  iconColor: string;
  valueColor: string;
  badgeClass: string;
  bar: string;
}

const initialMetrics: DashboardMetrics = {
  totalSold: 0,
  waitingToShip: 0,
  waitingPayment: 0,
  totalAvailableStock: 0,
};

// ─── Status badge helper ──────────────────────────────────────────────────────

const STATUS_CFG: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700',
  delivered: 'bg-teal-100 text-teal-700',
  processing: 'bg-amber-100 text-amber-700',
  shipped: 'bg-blue-100 text-blue-700',
  pending: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
};

function StatusPill({ status }: { status: string }) {
  const cls = STATUS_CFG[status] ?? 'bg-gray-100 text-gray-600';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${cls}`}
    >
      {status.toUpperCase()}
    </span>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <section className='mb-8 px-1' aria-label='Memuat dashboard'>
      <div className='mb-8 flex items-center justify-between'>
        <div className='space-y-2'>
          <div className='h-5 w-40 animate-pulse rounded-full bg-gray-200' />
          <div className='h-8 w-72 animate-pulse rounded-xl bg-gray-200' />
          <div className='h-4 w-56 animate-pulse rounded-md bg-gray-100' />
        </div>
        <div className='h-9 w-24 animate-pulse rounded-lg bg-gray-200' />
      </div>
      <div className='grid grid-cols-2 gap-4 xl:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='h-40 animate-pulse rounded-2xl bg-gray-200' />
        ))}
      </div>
    </section>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ card }: { card: MetricCard }) {
  const Icon = card.icon;
  return (
    <article
      className={`dash-card group relative overflow-hidden rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default ${card.gradient}`}
    >
      {/* Decorative blob */}
      <div className='pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl' />
      <div className='pointer-events-none absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-black/5 blur-2xl' />

      <div className='relative flex items-start justify-between mb-5'>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}>
          <Icon className={`h-5 w-5 ${card.iconColor}`} aria-hidden />
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${card.badgeClass}`}
        >
          {card.badge}
        </span>
      </div>

      <p className='text-sm font-medium text-white/80'>{card.title}</p>
      <p className={`dash-value mt-1 text-4xl font-black tracking-tight ${card.valueColor}`}>
        {card.value.toLocaleString('id-ID')}
      </p>
      <p className='mt-3 text-xs text-white/60'>{card.description}</p>

      {/* Bottom accent bar */}
      <div className={`absolute inset-x-0 bottom-0 h-1 ${card.bar}`} />
    </article>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DashboardCards() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [_tick, setTick] = useState(0); // drives live clock re-render

  // Live clock every 30 s
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const fetchMetrics = useCallback(async (refresh = false) => {
    try {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      const [response, ordersRes, auditRes] = await Promise.all([
        api.get('/admin/overview') as Promise<{ data: DashboardMetrics }>,
        api.get('/admin/orders?limit=5') as Promise<{ data: any[]; total: number }>,
        api.get('/admin/audit?type=system&limit=5') as Promise<{ data: any[] }>,
      ]);

      setMetrics({
        totalSold: Number(response.data.totalSold ?? 0),
        waitingToShip: Number(response.data.waitingToShip ?? 0),
        waitingPayment: Number(response.data.waitingPayment ?? 0),
        totalAvailableStock: Number(response.data.totalAvailableStock ?? 0),
      });

      if (Array.isArray(ordersRes.data)) setRecentOrders(ordersRes.data.slice(0, 5));
      if (Array.isArray(auditRes.data)) setRecentActivities(auditRes.data.slice(0, 5));

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Gagal memuat metrik dashboard:', err);
      setError('Data dashboard tidak dapat dimuat. Periksa koneksi atau coba lagi.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchMetrics();
  }, [fetchMetrics]);

  const cards: MetricCard[] = [
    {
      id: 'total-sold',
      title: 'Total Terjual',
      value: metrics.totalSold,
      description: 'Pesanan paid · processing · shipped · delivered',
      badge: 'Selesai',
      icon: CheckCircle2,
      gradient: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      valueColor: 'text-white',
      badgeClass: 'bg-white/20 text-white',
      bar: 'bg-teal-400/50',
    },
    {
      id: 'waiting-to-ship',
      title: 'Perlu Dikirim',
      value: metrics.waitingToShip,
      description: 'Status "processing" — perlu tindakan segera',
      badge: 'Urgent',
      icon: Package,
      gradient: 'bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      valueColor: 'text-white',
      badgeClass: 'bg-white/20 text-white',
      bar: 'bg-yellow-300/50',
    },
    {
      id: 'waiting-payment',
      title: 'Belum Dibayar',
      value: metrics.waitingPayment,
      description: 'Transaksi masih menunggu konfirmasi pembayaran',
      badge: 'Pending',
      icon: Timer,
      gradient: 'bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-700',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      valueColor: 'text-white',
      badgeClass: 'bg-white/20 text-white',
      bar: 'bg-pink-300/50',
    },
    {
      id: 'available-stock',
      title: 'Stok Tersedia',
      value: metrics.totalAvailableStock,
      description: 'Unit aktif di semua gudang (bukan reserved/rusak)',
      badge: 'Gudang',
      icon: ShoppingCart,
      gradient: 'bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-700',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      valueColor: 'text-white',
      badgeClass: 'bg-white/20 text-white',
      bar: 'bg-indigo-300/50',
    },
  ];

  if (isLoading) return <LoadingSkeleton />;

  const now = lastUpdated ?? new Date();
  const timeStr = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(
    now,
  );
  const dateStr = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <>
      {/* Inject animations */}
      <style>{STYLE}</style>

      <section className='mb-10 space-y-8' aria-labelledby='dashboard-title'>
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            {/* Live badge + date */}
            <div className='mb-2 flex items-center gap-2'>
              <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20'>
                <span className='dash-live-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-500' />
                Live
              </span>
              <span className='text-xs text-gray-400 hidden sm:block'>{dateStr}</span>
            </div>

            <h1
              id='dashboard-title'
              className='bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-3xl font-black tracking-tight text-transparent'
            >
              Selamat datang kembali, Admin 👋
            </h1>
            <p className='mt-1 text-sm text-gray-500'>
              Ringkasan kondisi operasional toko Anda — terakhir diperbarui pukul {timeStr}.
            </p>
          </div>

          {/* Refresh */}
          <button
            type='button'
            onClick={() => void fetchMetrics(true)}
            disabled={isRefreshing}
            className='inline-flex h-9 flex-shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow disabled:opacity-60'
          >
            {isRefreshing
              ? <Loader2 className='h-4 w-4 animate-spin' />
              : <RefreshCw className='h-4 w-4' />}
            Perbarui
          </button>
        </div>

        {/* ── Error banner ─────────────────────────────────────────────────── */}
        {error && (
          <div
            role='alert'
            className='flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 shadow-sm'
          >
            <AlertCircle className='mt-0.5 h-5 w-5 shrink-0 text-red-500' />
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-semibold text-red-800'>Gagal memuat dashboard</p>
              <p className='mt-0.5 text-sm text-red-600'>{error}</p>
            </div>
            <button
              type='button'
              onClick={() => void fetchMetrics(true)}
              className='text-sm font-semibold text-red-700 hover:underline flex-shrink-0'
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* ── Metric Cards ─────────────────────────────────────────────────── */}
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4'>
          {cards.map((card) => <StatCard key={card.id} card={card} />)}
        </div>

        {/* ── Main content 2-col ───────────────────────────────────────────── */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Left column */}
          <div className='lg:col-span-2 flex flex-col gap-6'>
            {/* Chart block */}
            <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
              <div className='mb-5 flex items-start justify-between'>
                <div>
                  <h2 className='text-base font-bold text-gray-900'>Ringkasan Penjualan</h2>
                  <p className='text-xs text-gray-500 mt-0.5'>
                    Performa 7 hari terakhir (ilustrasi)
                  </p>
                </div>
                <div className='flex gap-1 rounded-lg bg-gray-100 p-1'>
                  {['7H', '30H', '90H'].map((l) => (
                    <span
                      key={l}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                        l === '7H' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Animated bars */}
              <div className='relative flex h-56 items-end gap-2 rounded-xl bg-gradient-to-b from-blue-50/40 to-white border border-gray-100 px-4 pt-8 pb-3 overflow-hidden'>
                <div className='absolute inset-0 flex flex-col justify-between py-7 pointer-events-none'>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className='w-full border-t border-gray-100/80' />
                  ))}
                </div>
                {[35, 72, 48, 95, 60, 85, 100].map((h, i) => (
                  <div key={i} className='group relative flex flex-1 flex-col items-center gap-1.5'>
                    <span className='absolute -top-7 hidden rounded-md bg-gray-800 px-2 py-0.5 text-[10px] text-white group-hover:block z-10 whitespace-nowrap'>
                      Rp {h * 150}K
                    </span>
                    <div
                      className='w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-400 opacity-80 group-hover:opacity-100 transition-all duration-300'
                      style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
                    />
                    <span className='text-[9px] text-gray-400 font-medium'>
                      {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent orders table */}
            <div className='rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
              <div className='flex items-center justify-between border-b border-gray-100 px-6 py-4'>
                <div>
                  <h2 className='text-base font-bold text-gray-900'>Pesanan Terbaru</h2>
                  <p className='text-xs text-gray-500 mt-0.5'>5 transaksi terakhir</p>
                </div>
                <button
                  type='button'
                  onClick={() => navigate('/orders')}
                  className='group inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition'
                >
                  Lihat Semua
                  <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
                </button>
              </div>

              <div className='overflow-x-auto'>
                <table className='min-w-full'>
                  <thead>
                    <tr className='bg-gray-50/80'>
                      {['No. Pesanan', 'Pelanggan', 'Status', 'Total'].map((h, i) => (
                        <th
                          key={h}
                          className={`px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider ${
                            i === 3 ? 'text-right' : ''
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-50'>
                    {recentOrders.length === 0
                      ? (
                        <tr>
                          <td colSpan={4} className='px-5 py-10 text-center text-sm text-gray-400'>
                            Belum ada pesanan terbaru
                          </td>
                        </tr>
                      )
                      : recentOrders.map((order, idx) => (
                        <tr
                          key={order.id}
                          className='hover:bg-blue-50/30 transition-colors cursor-default'
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <td className='px-5 py-3.5'>
                            <p className='text-sm font-semibold text-gray-900 font-mono'>
                              {order.orderNumber ?? `#${order.id.slice(0, 8)}`}
                            </p>
                            <p className='text-[11px] text-gray-400'>
                              {formatDate(order.createdAt)}
                            </p>
                          </td>
                          <td className='px-5 py-3.5'>
                            <div className='flex items-center gap-2.5'>
                              <span className='flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-[11px] font-bold text-white'>
                                {order.customerName ? order.customerName[0].toUpperCase() : 'G'}
                              </span>
                              <div>
                                <p className='text-sm font-medium text-gray-800'>
                                  {order.customerName || 'Guest'}
                                </p>
                                <p className='text-[11px] text-gray-400 truncate max-w-[120px]'>
                                  {order.customerEmail || ''}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className='px-5 py-3.5'>
                            <StatusPill status={order.status} />
                          </td>
                          <td className='px-5 py-3.5 text-right text-sm font-bold text-gray-900'>
                            {formatIDR(order.totalAmount)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className='flex flex-col gap-6'>
            {/* Pipeline */}
            <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='text-base font-bold text-gray-900 mb-5'>Pipeline Operasional</h2>
              <div className='space-y-5'>
                {/* Waiting to ship */}
                <div>
                  <div className='flex items-center justify-between text-sm mb-1.5'>
                    <span className='font-medium text-gray-700'>Perlu Dikirim</span>
                    <span className='font-bold text-amber-600 tabular-nums'>
                      {metrics.waitingToShip}
                    </span>
                  </div>
                  <div className='h-2 w-full rounded-full bg-gray-100 overflow-hidden'>
                    <div
                      className='h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700'
                      style={{
                        width: `${
                          Math.max(
                            4,
                            (metrics.waitingToShip /
                              (metrics.totalSold + metrics.waitingToShip || 1)) * 100,
                          )
                        }%`,
                      }}
                    />
                  </div>
                </div>
                {/* Waiting payment */}
                <div>
                  <div className='flex items-center justify-between text-sm mb-1.5'>
                    <span className='font-medium text-gray-700'>Menunggu Bayar</span>
                    <span className='font-bold text-rose-600 tabular-nums'>
                      {metrics.waitingPayment}
                    </span>
                  </div>
                  <div className='h-2 w-full rounded-full bg-gray-100 overflow-hidden'>
                    <div
                      className='h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all duration-700'
                      style={{ width: `${Math.max(4, metrics.waitingPayment ? 30 : 0)}%` }}
                    />
                  </div>
                </div>
                {/* Stock health */}
                <div className='pt-3 mt-2 border-t border-gray-100 flex items-center gap-3'>
                  <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50'>
                    <Box className='h-4 w-4 text-blue-600' />
                  </span>
                  <div>
                    <p className='text-xs text-gray-500'>Kesehatan Inventaris</p>
                    <p className='text-sm font-bold text-gray-900'>
                      {metrics.totalAvailableStock > 0 ? 'Status Optimal' : 'Perlu Perhatian'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
              <div className='flex items-center gap-2 mb-4'>
                <Zap className='h-4 w-4 text-yellow-500' />
                <h2 className='text-base font-bold text-gray-900'>Aksi Cepat</h2>
              </div>
              <div className='grid grid-cols-2 gap-2.5'>
                {[
                  {
                    label: 'Tambah Produk',
                    icon: Plus,
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-50 hover:bg-emerald-100',
                    to: '/catalog',
                  },
                  {
                    label: 'Update Stok',
                    icon: RefreshCw,
                    color: 'text-blue-600',
                    bg: 'bg-blue-50 hover:bg-blue-100',
                    to: '/inventory',
                  },
                  {
                    label: 'Proses Order',
                    icon: Package,
                    color: 'text-amber-600',
                    bg: 'bg-amber-50 hover:bg-amber-100',
                    to: '/orders',
                  },
                  {
                    label: 'Laporan',
                    icon: BarChart3,
                    color: 'text-purple-600',
                    bg: 'bg-purple-50 hover:bg-purple-100',
                    to: '/reports',
                  },
                ].map(({ label, icon: Icon, color, bg, to }) => (
                  <button
                    key={label}
                    type='button'
                    onClick={() => navigate(to)}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition-all duration-200 hover:scale-[1.04] hover:shadow-sm ${bg}`}
                  >
                    <Icon className={`h-5 w-5 ${color}`} />
                    <span className='text-xs font-semibold text-gray-700'>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity feed */}
            <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex-1'>
              <h2 className='text-base font-bold text-gray-900 mb-4'>Aktivitas Terbaru</h2>

              {recentActivities.length === 0
                ? <p className='text-sm text-gray-400 text-center py-4'>Belum ada aktivitas</p>
                : (
                  <div className='relative pl-5 space-y-5 before:absolute before:inset-y-0 before:left-1.5 before:w-px before:bg-gradient-to-b before:from-blue-200 before:via-gray-200 before:to-transparent'>
                    {recentActivities.map((activity, i) => {
                      const action = String(activity.action ?? '');
                      const dotColor = action.includes('create')
                        ? 'bg-emerald-500 ring-emerald-100'
                        : action.includes('update')
                        ? 'bg-blue-500 ring-blue-100'
                        : action.includes('delete')
                        ? 'bg-red-500 ring-red-100'
                        : 'bg-gray-400 ring-gray-100';
                      return (
                        <div
                          key={activity.id ?? i}
                          className='dash-activity-row relative flex items-start gap-3'
                        >
                          <span
                            className={`absolute -left-5 mt-0.5 flex h-3 w-3 rounded-full ring-4 ${dotColor} flex-shrink-0`}
                          />
                          <div className='min-w-0 pl-1'>
                            <p className='text-sm font-semibold text-gray-800 capitalize leading-tight'>
                              {action.replace(/_/g, ' ')} {activity.entityType}
                            </p>
                            <p className='text-[11px] text-gray-400 mt-0.5'>
                              {formatDate(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
