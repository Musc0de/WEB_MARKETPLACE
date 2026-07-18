import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Badge, Button } from '@starsuperscare/ui';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Package,
  RefreshCcw,
  ShoppingCart,
} from 'lucide-react';
import { toast } from '@starsuperscare/ui';

type Tab = 'semua' | 'aktif' | 'selesai' | 'dibatalkan' | 'refund';

const TABS: { value: Tab; label: string; color: string }[] = [
  { value: 'semua', label: 'Semua', color: '' },
  { value: 'aktif', label: 'Aktif', color: 'text-indigo-500 dark:text-indigo-400' },
  { value: 'selesai', label: 'Selesai', color: 'text-emerald-600 dark:text-emerald-400' },
  { value: 'dibatalkan', label: 'Dibatalkan', color: 'text-rose-500 dark:text-rose-400' },
  { value: 'refund', label: 'Refund', color: 'text-purple-500 dark:text-purple-400' },
];

const fetchOrders = async (_url: string, tab: Tab, page: number) => {
  const res = await client.v1.orders.$get({ query: { tab, page: String(page), limit: '10' } });
  if (res.ok) {
    const json = await res.json();
    return json.data;
  }
  throw new Error('Failed');
};

/** Status badge config */
const STATUS_CONFIG: Record<string, { style: string; label: string }> = {
  pending: {
    style: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    label: 'Menunggu Bayar',
  },
  paid: {
    style: 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
    label: 'Dibayar',
  },
  processing: {
    style: 'text-sky-700 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
    label: 'Diproses',
  },
  shipped: {
    style: 'text-indigo-700 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    label: 'Dikirim',
  },
  delivered: {
    style: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    label: 'Selesai',
  },
  cancelled: {
    style: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    label: 'Dibatalkan',
  },
  refunded: {
    style: 'text-purple-700 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
    label: 'Dikembalikan',
  },
  cancellation_requested: {
    style: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    label: 'Proses Batal',
  },
  return_requested: {
    style: 'text-orange-700 dark:text-orange-400 bg-orange-500/10 border-orange-500/20',
    label: 'Proses Retur',
  },
  cancellation_rejected: {
    style: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    label: 'Batal Ditolak',
  },
  return_rejected: {
    style: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    label: 'Retur Ditolak',
  },
};

const fmt = (n: number) => `Rp\u00a0${n.toLocaleString('id-ID')}`;

/** Parse variant optionValues JSON → readable label */
const variantLabel = (optionValues: any): string => {
  if (!optionValues) return '';
  try {
    const parsed = typeof optionValues === 'string' ? JSON.parse(optionValues) : optionValues;
    if (Array.isArray(parsed)) return parsed.map((v: any) => v.value ?? v).join(' / ');
    return Object.values(parsed).join(' / ');
  } catch {
    return String(optionValues);
  }
};

/** Inline "Beli Lagi" button */
function BuyAgainButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await client.v1.orders[':id']['buy-again'].$post({ param: { id: orderId } });
      if (res.ok) {
        const result = await res.json();
        if ((result.data.outOfStockItems?.length ?? 0) > 0) {
          toast.warning(`Item habis: ${result.data.outOfStockItems.join(', ')}`);
        }
        if (result.data.addedCount > 0) {
          toast.success('Berhasil ditambahkan ke keranjang!');
        } else {
          toast.error('Tidak ada item yang tersedia saat ini.');
        }
      } else {
        toast.error('Gagal memproses beli lagi.');
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={loading}
      className='inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 text-xs font-bold rounded-full border-2 border-indigo-500/20 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-500/40 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {loading
        ? <RefreshCcw className='w-3 h-3 animate-spin' />
        : <ShoppingCart className='w-3.5 h-3.5' />}
      <span className='hidden sm:inline'>Beli Lagi</span>
      <span className='sm:hidden'>Beli</span>
    </button>
  );
}

/** Single order card */
function OrderCard({ order, onNavigate }: { order: any; onNavigate: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] ??
    { style: 'text-muted-foreground bg-muted border-border', label: order.status };
  const itemCount = order.items?.length ?? 0;

  return (
    <div className='bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-border transition-all duration-200'>
      {/* ── Header bar ── */}
      <div className='px-4 py-3 flex items-center justify-between bg-muted/30 border-b border-border/40'>
        <div className='flex items-center gap-2 min-w-0'>
          <span className='text-xs font-bold text-foreground truncate'>{order.orderNumber}</span>
          <span className='text-border'>·</span>
          <span className='text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
            {new Date(order.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        <Badge
          variant='outline'
          className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 uppercase tracking-widest ${cfg.style}`}
        >
          {cfg.label}
        </Badge>
      </div>

      {/* ── First Item Preview (always visible) ── */}
      {itemCount > 0 && (() => {
        const first = order.items[0];
        const label = variantLabel(first.optionValues);
        const hasDiscount = first.comparePrice && first.comparePrice > first.priceSnapshot;
        return (
          <div
            className='px-4 py-4 flex gap-3 sm:gap-4 items-start group cursor-pointer'
            onClick={() => onNavigate(order.id)}
          >
            {/* Image */}
            <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-muted/50 border border-border/40'>
              {first.imageUrl
                ? (
                  <img
                    src={first.imageUrl}
                    alt={first.productName}
                    loading='lazy'
                    decoding='async'
                    className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300'
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )
                : (
                  <div className='w-full h-full flex items-center justify-center'>
                    <Package className='w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/50' />
                  </div>
                )}
            </div>
            {/* Info */}
            <div className='flex-1 min-w-0'>
              <p className='text-sm sm:text-base font-bold text-foreground line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
                {first.productName}
              </p>
              {label && (
                <span className='inline-block mt-1.5 text-[10px] sm:text-[11px] font-semibold text-muted-foreground bg-muted/60 rounded px-1.5 py-0.5 border border-border/40'>
                  {label}
                </span>
              )}
              <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2'>
                {hasDiscount && (
                  <span className='text-[10px] sm:text-[11px] text-muted-foreground/70 line-through tabular-nums'>
                    {fmt(first.comparePrice)}
                  </span>
                )}
                <span className='text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 tabular-nums'>
                  {fmt(first.priceSnapshot)}
                </span>
                <span className='text-xs font-medium text-muted-foreground ml-1'>
                  × {first.quantity}
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Expandable: remaining items ── */}
      {itemCount > 1 && (
        <>
          {expanded && (
            <div className='border-t border-dashed border-border/60 divide-y divide-dashed divide-border/60'>
              {order.items.slice(1).map((item: any) => {
                const label = variantLabel(item.optionValues);
                const hasDiscount = item.comparePrice && item.comparePrice > item.priceSnapshot;
                return (
                  <div
                    key={item.orderItemId}
                    className='px-4 py-3 flex gap-3 sm:gap-4 items-start bg-muted/10 cursor-pointer hover:bg-muted/30 transition-colors'
                    onClick={() => onNavigate(order.id)}
                  >
                    <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 bg-muted/50 border border-border/40'>
                      {item.imageUrl
                        ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            loading='lazy'
                            decoding='async'
                            className='w-full h-full object-cover'
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )
                        : (
                          <div className='w-full h-full flex items-center justify-center'>
                            <Package className='w-5 h-5 text-muted-foreground/50' />
                          </div>
                        )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-xs sm:text-sm font-bold text-foreground line-clamp-2 leading-snug'>
                        {item.productName}
                      </p>
                      {label && (
                        <span className='inline-block mt-1 text-[10px] font-semibold text-muted-foreground bg-muted/60 rounded px-1.5 py-0.5 border border-border/40'>
                          {label}
                        </span>
                      )}
                      <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5'>
                        {hasDiscount && (
                          <span className='text-[10px] text-muted-foreground/70 line-through tabular-nums'>
                            {fmt(item.comparePrice)}
                          </span>
                        )}
                        <span className='text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 tabular-nums'>
                          {fmt(item.priceSnapshot)}
                        </span>
                        <span className='text-[11px] font-medium text-muted-foreground ml-1'>
                          × {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Toggle button */}
          <button
            type='button'
            onClick={() => setExpanded((v) => !v)}
            className='w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors border-t border-dashed border-border/60'
          >
            {expanded
              ? (
                <>
                  <ChevronUp className='w-3.5 h-3.5' />
                  Sembunyikan produk lainnya
                </>
              )
              : (
                <>
                  <ChevronDown className='w-3.5 h-3.5' />
                  +{itemCount - 1} produk lainnya
                </>
              )}
          </button>
        </>
      )}

      {/* ── Footer: Total + Actions ── */}
      <div className='px-4 py-3.5 flex flex-row items-center justify-between gap-3 border-t border-border/40 bg-muted/10'>
        <div className='flex flex-col'>
          <span className='text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-wider font-bold'>
            Total ({itemCount} brg)
          </span>
          <span className='text-sm sm:text-base font-black text-foreground tabular-nums mt-0.5'>
            {fmt(order.totalAmount)}
          </span>
        </div>
        <div className='flex items-center gap-2 shrink-0'>
          <BuyAgainButton orderId={order.id} />
          <button
            type='button'
            onClick={() => onNavigate(order.id)}
            className='inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 text-xs font-bold rounded-full border-2 border-border text-foreground bg-card hover:bg-muted active:scale-95 transition-all duration-150'
          >
            Detail
          </button>
        </div>
      </div>
    </div>
  );
}

export const OrdersPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('semua');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useSWR(
    ['/api/orders', activeTab, page],
    ([url, t, p]) => fetchOrders(url, t as Tab, p),
  );

  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 max-w-4xl mx-auto'>
      {/* ── Page Title ── */}
      <div>
        <h2 className='text-3xl font-black text-foreground tracking-tight'>Pesanan Saya</h2>
        <p className='text-sm font-medium text-muted-foreground mt-1'>
          Kelola dan lacak semua pesanan belanja Anda.
        </p>
      </div>

      {/* ── Tab Filter Bar ── */}
      <div className='flex border-b border-border/60 overflow-x-auto scrollbar-hide'>
        {TABS.map((tab) => {
          const active = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type='button'
              onClick={() => {
                setActiveTab(tab.value);
                setPage(1);
              }}
              className={`flex-shrink-0 px-4 sm:px-6 py-3.5 text-[13px] sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 -mb-px ${
                active
                  ? `border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400`
                  : `border-transparent text-muted-foreground hover:text-foreground hover:border-border/80`
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div className='pt-2 space-y-4'>
        {isLoading
          ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='animate-pulse h-44 rounded-2xl bg-muted/50 border border-border/40'
                />
              ))}
            </>
          )
          : error
          ? (
            <div className='text-center py-16 text-sm text-red-600 dark:text-red-400 bg-red-500/10 rounded-3xl border border-red-500/20'>
              <p className='font-bold mb-1.5 text-lg'>Gagal memuat pesanan</p>
              <p className='font-medium text-red-600/80 dark:text-red-400/80'>
                Terjadi masalah jaringan. Silakan muat ulang halaman.
              </p>
            </div>
          )
          : !data?.orders?.length
          ? (
            <div className='text-center py-24 bg-card rounded-3xl border border-border/60 shadow-sm'>
              <div className='w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-6 shadow-inner'>
                <Package className='w-10 h-10 text-indigo-500/60' />
              </div>
              <p className='text-xl font-black text-foreground mb-2'>Belum Ada Pesanan</p>
              <p className='text-sm font-medium text-muted-foreground mb-8 max-w-sm mx-auto'>
                Anda belum memiliki pesanan di kategori ini. Mulai belanja dan temukan produk
                incaran Anda!
              </p>
              <Button
                onClick={() => navigate('/')}
                className='rounded-full px-8 py-6 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 active:scale-95 transition-all'
              >
                <ShoppingCart className='w-5 h-5 mr-2' />
                Mulai Belanja Sekarang
              </Button>
            </div>
          )
          : (
            <>
              <div className='space-y-4'>
                {data.orders.map((order: any) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onNavigate={(id) => navigate(`/orders/${id}`)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 pb-2 mt-4'>
                  <span className='text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider text-center sm:text-left'>
                    Halaman <strong className='text-foreground'>{page}</strong> dari{' '}
                    <strong className='text-foreground'>{totalPages}</strong>
                    <span className='ml-1.5 text-muted-foreground/60'>
                      ({data.pagination.total} total)
                    </span>
                  </span>
                  <div className='flex items-center justify-center sm:justify-end gap-2.5'>
                    <button
                      type='button'
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className='inline-flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-full border-2 border-border text-foreground bg-card hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all'
                    >
                      <ChevronLeft className='w-4 h-4' />
                      Sebelumnya
                    </button>
                    <button
                      type='button'
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className='inline-flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-full border-2 border-border text-foreground bg-card hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all'
                    >
                      Berikutnya
                      <ChevronRight className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
};
