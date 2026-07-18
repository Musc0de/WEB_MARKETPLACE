import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { formatIDR } from '@starsuperscare/ui';
import {
  ArrowRight,
  Bell,
  CreditCard,
  Package,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSession } from '../auth/useSession.ts';

const fetchHomeSummary = async () => {
  const res = await client.v1.dashboard.home.$get();
  if (!res.ok) throw new Error('Gagal memuat ringkasan dashboard');
  const result = await res.json();
  return result.data;
};

const fetchProfile = async () => {
  const res = await client.v1.me.profile.$get();
  if (!res.ok) return null;
  const result = await res.json();
  return result.data;
};

export function DashboardHome() {
  const { session } = useSession();
  const { data, error, isLoading } = useSWR('/api/v1/dashboard/home', fetchHomeSummary);
  const { data: profile } = useSWR(session ? '/api/v1/me/profile' : null, fetchProfile);

  if (isLoading) {
    return (
      <div className='flex flex-col gap-8 animate-in fade-in duration-500'>
        <div className='space-y-3'>
          <div className='h-8 bg-muted rounded-md w-1/4 animate-pulse'></div>
          <div className='h-4 bg-muted rounded-md w-1/3 animate-pulse'></div>
        </div>
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='h-36 bg-muted rounded-2xl animate-pulse'></div>
          ))}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 h-64 bg-muted rounded-2xl animate-pulse'></div>
          <div className='h-64 bg-muted rounded-2xl animate-pulse'></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='rounded-2xl border border-red-500/20 bg-red-500/10 p-6 flex items-start gap-4'>
        <div className='p-3 bg-red-500/20 rounded-full text-red-500'>
          <Bell className='w-6 h-6' />
        </div>
        <div>
          <h3 className='text-lg font-bold text-red-600 dark:text-red-400'>
            Gagal memuat dashboard
          </h3>
          <p className='mt-1 text-sm font-medium text-red-600/80 dark:text-red-400/80'>
            Terjadi kesalahan koneksi. Silakan muat ulang halaman.
          </p>
        </div>
      </div>
    );
  }

  const { summary, latestOrders } = data;

  return (
    <div className='flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700'>
      {/* ── Header ── */}
      <div>
        <h1 className='text-3xl font-black text-foreground tracking-tight'>Ringkasan Akun</h1>
        <p className='text-muted-foreground font-medium mt-1 flex items-center gap-2'>
          Selamat datang kembali,{' '}
          <span className='font-bold text-indigo-600 dark:text-indigo-400'>
            {profile?.fullName || session?.user?.username || 'Pengguna'}
          </span>{' '}
          <Sparkles className='w-4 h-4 text-amber-500' />
        </p>
      </div>

      {/* ── STAT CARDS ── */}
      <div className='grid grid-cols-1 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        {/* Active Orders */}
        <div className='group rounded-2xl border border-border/60 bg-card p-4 sm:p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors'>
          </div>
          <div className='flex items-center justify-between mb-2 sm:mb-4 relative z-10'>
            <div className='flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400'>
              <Package className='h-5 w-5 sm:h-6 sm:w-6' />
            </div>
            <p className='text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider'>
              Pesanan Aktif
            </p>
          </div>
          <p className='text-2xl sm:text-3xl font-black text-foreground relative z-10'>
            {summary.activeOrders}
          </p>
        </div>

        {/* Total Purchases */}
        <div className='group rounded-2xl border border-border/60 bg-card p-4 sm:p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors'>
          </div>
          <div className='flex items-center justify-between mb-2 sm:mb-4 relative z-10'>
            <div className='flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
              <ShoppingBag className='h-5 w-5 sm:h-6 sm:w-6' />
            </div>
            <p className='text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider'>
              Total Beli
            </p>
          </div>
          <p
            className='text-xl sm:text-2xl font-black text-foreground relative z-10 truncate'
            title={formatIDR(summary.totalPurchases)}
          >
            {formatIDR(summary.totalPurchases)}
          </p>
        </div>

        {/* Unread Notifications */}
        <div className='group rounded-2xl border border-border/60 bg-card p-4 sm:p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden'>
          <div
            className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-colors ${
              summary.unreadNotifications > 0
                ? 'bg-amber-500/10 group-hover:bg-amber-500/20'
                : 'bg-slate-500/5 group-hover:bg-slate-500/10'
            }`}
          >
          </div>
          <div className='flex items-center justify-between mb-2 sm:mb-4 relative z-10'>
            <div
              className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${
                summary.unreadNotifications > 0
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Bell className='h-5 w-5 sm:h-6 sm:w-6' />
            </div>
            <p className='text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider'>
              Notifikasi
            </p>
          </div>
          <p className='text-2xl sm:text-3xl font-black text-foreground relative z-10'>
            {summary.unreadNotifications}
          </p>
        </div>

        {/* Unpaid Invoices */}
        <div className='group rounded-2xl border border-border/60 bg-card p-4 sm:p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden'>
          <div
            className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-colors ${
              summary.hasUnpaidInvoices
                ? 'bg-rose-500/10 group-hover:bg-rose-500/20'
                : 'bg-emerald-500/5 group-hover:bg-emerald-500/10'
            }`}
          >
          </div>
          <div className='flex items-center justify-between mb-2 sm:mb-4 relative z-10'>
            <div
              className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${
                summary.hasUnpaidInvoices
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <CreditCard className='h-5 w-5 sm:h-6 sm:w-6' />
            </div>
            <p className='text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider'>
              Tagihan
            </p>
          </div>
          <p
            className={`text-base sm:text-xl font-black relative z-10 ${
              summary.hasUnpaidInvoices
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {summary.hasUnpaidInvoices ? 'Perlu Dibayar' : 'Aman'}
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        {/* Latest Orders List */}
        <div className='xl:col-span-2 rounded-3xl border border-border/60 bg-card shadow-sm overflow-hidden flex flex-col'>
          <div className='border-b border-border/40 bg-muted/20 px-6 py-5 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400'>
                <TrendingUp className='w-5 h-5' />
              </div>
              <h2 className='text-lg font-bold text-foreground'>Pesanan Terakhir</h2>
            </div>
            <Link
              to='/orders'
              className='text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 transition-colors group'
            >
              Lihat Semua
              <ArrowRight className='h-4 w-4 transform group-hover:translate-x-1 transition-transform' />
            </Link>
          </div>
          <div className='divide-y divide-border/40 flex-1 bg-gradient-to-b from-transparent to-muted/10'>
            {latestOrders.length > 0
              ? (
                latestOrders.map((order: any) => {
                  const itemsText = order.items && order.items.length > 0
                    ? order.items.map((i: any) => {
                      const code = i.productCode || i.sku || i.variantName;
                      return `${i.productName} ${code ? `(${code})` : ''} x${i.quantity}`;
                    }).join(', ')
                    : order.orderNumber;

                  let statusText = order.status;
                  let statusColor = 'text-gray-600 dark:text-gray-400 bg-gray-500/10';

                  switch (order.status) {
                    case 'pending':
                      statusText = 'Menunggu';
                      statusColor = 'text-amber-600 dark:text-amber-400 bg-amber-500/10';
                      break;
                    case 'paid':
                      statusText = 'Dibayar';
                      statusColor = 'text-blue-600 dark:text-blue-400 bg-blue-500/10';
                      break;
                    case 'processing':
                      statusText = 'Diproses';
                      statusColor = 'text-purple-600 dark:text-purple-400 bg-purple-500/10';
                      break;
                    case 'shipped':
                      statusText = 'Dikirim';
                      statusColor = 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10';
                      break;
                    case 'delivered':
                      statusText = 'Diterima';
                      statusColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10';
                      break;
                    case 'cancelled':
                      statusText = 'Dibatalkan';
                      statusColor = 'text-red-600 dark:text-red-400 bg-red-500/10';
                      break;
                    case 'refunded':
                      statusText = 'Dikembalikan';
                      statusColor = 'text-rose-600 dark:text-rose-400 bg-rose-500/10';
                      break;
                  }

                  return (
                    <div
                      key={order.id}
                      className='px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors'
                    >
                      <div className='flex-1 min-w-0 pr-4'>
                        <p
                          className='font-bold text-foreground text-base truncate'
                          title={itemsText}
                        >
                          {itemsText}
                        </p>
                        <p className='text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider'>
                          {order.orderNumber} &bull;{' '}
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className='sm:text-right flex sm:flex-col items-center sm:items-end justify-between whitespace-nowrap shrink-0'>
                        <p className='font-black text-foreground text-lg'>
                          {formatIDR(order.totalAmount)}
                        </p>
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest mt-0 sm:mt-2 ${statusColor}`}
                        >
                          {statusText}
                        </span>
                      </div>
                    </div>
                  );
                })
              )
              : (
                <div className='px-6 py-16 flex flex-col items-center justify-center text-center'>
                  <div className='w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4'>
                    <Package className='w-8 h-8 text-muted-foreground/50' />
                  </div>
                  <p className='text-lg font-bold text-foreground'>Belum ada pesanan aktif</p>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Mulai belanja untuk melihat riwayat pesanan Anda di sini.
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* CTA Discover New Products */}
        <div className='rounded-3xl border-0 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 shadow-lg shadow-indigo-600/20 flex flex-col items-center justify-center text-center relative overflow-hidden group'>
          <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-white/20 transition-all duration-700'>
          </div>
          <div className='absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none'>
          </div>

          <div className='relative z-10 flex flex-col items-center'>
            <div className='w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/20'>
              <Sparkles className='w-8 h-8 text-white' />
            </div>
            <h2 className='text-2xl font-black text-white mb-3'>Temukan Produk Baru</h2>
            <p className='text-indigo-100 font-medium mb-8 leading-relaxed text-sm'>
              Jelajahi koleksi terbaru dan promo eksklusif dari StarSuperScare hari ini.
            </p>
            <a
              href={import.meta.env.VITE_STOREFRONT_URL || ''}
              className='group/btn flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 font-black text-sm rounded-full shadow-xl hover:shadow-indigo-900/20 hover:scale-105 active:scale-95 transition-all w-full justify-center sm:w-auto'
            >
              Mulai Belanja
              <ArrowRight className='w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform' />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
