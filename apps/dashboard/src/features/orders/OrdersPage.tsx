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
  { value: 'aktif', label: 'Aktif', color: 'text-orange-500' },
  { value: 'selesai', label: 'Selesai', color: 'text-green-600' },
  { value: 'dibatalkan', label: 'Dibatalkan', color: 'text-red-500' },
  { value: 'refund', label: 'Refund', color: 'text-purple-500' },
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
  pending: { style: 'text-amber-700 bg-amber-50 border-amber-200', label: 'Menunggu Bayar' },
  paid: { style: 'text-blue-700 bg-blue-50 border-blue-200', label: 'Dibayar' },
  processing: { style: 'text-sky-700 bg-sky-50 border-sky-200', label: 'Diproses' },
  shipped: { style: 'text-indigo-700 bg-indigo-50 border-indigo-200', label: 'Dikirim' },
  delivered: { style: 'text-emerald-700 bg-emerald-50 border-emerald-200', label: 'Selesai' },
  cancelled: { style: 'text-red-700 bg-red-50 border-red-200', label: 'Dibatalkan' },
  refunded: { style: 'text-rose-700 bg-rose-50 border-rose-200', label: 'Dikembalikan' },
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
      className='inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full border-2 border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100 hover:border-orange-500 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {loading
        ? <RefreshCcw className='w-3 h-3 animate-spin' />
        : <ShoppingCart className='w-3.5 h-3.5' />}
      Beli Lagi
    </button>
  );
}

/** Single order card */
function OrderCard({ order, onNavigate }: { order: any; onNavigate: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] ??
    { style: 'text-gray-600 bg-gray-50 border-gray-200', label: order.status };
  const itemCount = order.items?.length ?? 0;

  return (
    <div className='bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200'>
      {/* ── Header bar ── */}
      <div className='px-4 py-3 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white border-b border-gray-100'>
        <div className='flex items-center gap-2 min-w-0'>
          <span className='text-xs font-bold text-gray-700 truncate'>{order.orderNumber}</span>
          <span className='text-gray-200'>·</span>
          <span className='text-xs text-gray-400'>
            {new Date(order.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        <Badge
          variant='outline'
          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${cfg.style}`}
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
          <div className='px-4 py-4 flex gap-3 items-start'>
            {/* Image */}
            <div className='w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100'>
              {first.imageUrl
                ? (
                  <img
                    src={first.imageUrl}
                    alt={first.productName}
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
                    <Package className='w-7 h-7 text-gray-300' />
                  </div>
                )}
            </div>
            {/* Info */}
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-semibold text-gray-900 line-clamp-2 leading-snug'>
                {first.productName}
              </p>
              {label && (
                <span className='inline-block mt-1 text-[11px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5 border border-gray-200'>
                  {label}
                </span>
              )}
              <div className='flex items-center gap-2 mt-1.5'>
                {hasDiscount && (
                  <span className='text-[11px] text-gray-400 line-through tabular-nums'>
                    {fmt(first.comparePrice)}
                  </span>
                )}
                <span className='text-sm font-bold text-orange-600 tabular-nums'>
                  {fmt(first.priceSnapshot)}
                </span>
                <span className='text-xs text-gray-400'>× {first.quantity}</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Expandable: remaining items ── */}
      {itemCount > 1 && (
        <>
          {expanded && (
            <div className='border-t border-dashed border-gray-100 divide-y divide-dashed divide-gray-100'>
              {order.items.slice(1).map((item: any) => {
                const label = variantLabel(item.optionValues);
                const hasDiscount = item.comparePrice && item.comparePrice > item.priceSnapshot;
                return (
                  <div
                    key={item.orderItemId}
                    className='px-4 py-3 flex gap-3 items-start bg-gray-50/50'
                  >
                    <div className='w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-100'>
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
                            <Package className='w-5 h-5 text-gray-300' />
                          </div>
                        )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-800 line-clamp-1'>
                        {item.productName}
                      </p>
                      {label && (
                        <span className='inline-block mt-0.5 text-[11px] text-gray-400 bg-gray-100 rounded px-1.5 py-0.5'>
                          {label}
                        </span>
                      )}
                      <div className='flex items-center gap-2 mt-1'>
                        {hasDiscount && (
                          <span className='text-[11px] text-gray-400 line-through tabular-nums'>
                            {fmt(item.comparePrice)}
                          </span>
                        )}
                        <span className='text-xs font-bold text-orange-600 tabular-nums'>
                          {fmt(item.priceSnapshot)}
                        </span>
                        <span className='text-xs text-gray-400'>× {item.quantity}</span>
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
            className='w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors border-t border-dashed border-gray-100'
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
      <div className='px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-gray-100 bg-gradient-to-r from-gray-50/60 to-white'>
        <div className='flex flex-col'>
          <span className='text-[11px] text-gray-400 uppercase tracking-wide font-medium'>
            Total Belanja ({itemCount} produk)
          </span>
          <span className='text-base font-bold text-gray-900 tabular-nums mt-0.5'>
            {fmt(order.totalAmount)}
          </span>
        </div>
        <div className='flex items-center gap-2 shrink-0'>
          <BuyAgainButton orderId={order.id} />
          <button
            type='button'
            onClick={() => onNavigate(order.id)}
            className='inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 active:scale-95 transition-all duration-150'
          >
            Lihat Detail
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
    <div className='space-y-0'>
      {/* ── Page Title ── */}
      <div className='mb-5'>
        <h2 className='text-xl font-bold text-gray-900'>Pesanan Saya</h2>
        <p className='text-sm text-gray-400 mt-0.5'>Kelola dan lacak semua pesanan Anda</p>
      </div>

      {/* ── Tab Filter Bar ── */}
      <div className='flex border-b border-gray-200 overflow-x-auto scrollbar-hide'>
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
              className={`flex-shrink-0 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                active
                  ? `border-orange-500 text-orange-600`
                  : `border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300`
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div className='pt-5 space-y-4'>
        {isLoading
          ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='animate-pulse h-44 rounded-2xl bg-gray-100 border border-gray-200'
                />
              ))}
            </>
          )
          : error
          ? (
            <div className='text-center py-16 text-sm text-red-500 bg-red-50 rounded-2xl border border-red-100'>
              <p className='font-semibold mb-1'>Gagal memuat pesanan</p>
              <p className='text-red-400'>Silakan muat ulang halaman.</p>
            </div>
          )
          : !data?.orders?.length
          ? (
            <div className='text-center py-24 bg-white rounded-2xl border border-gray-200'>
              <div className='w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-5'>
                <Package className='w-8 h-8 text-orange-300' />
              </div>
              <p className='text-base font-bold text-gray-800 mb-1.5'>Belum Ada Pesanan</p>
              <p className='text-sm text-gray-400 mb-7'>
                Mulai belanja dan temukan produk favorit Anda!
              </p>
              <Button
                onClick={() => navigate('/')}
                className='rounded-full px-8 bg-orange-500 hover:bg-orange-600 text-white border-0'
              >
                <ShoppingCart className='w-4 h-4 mr-2' />
                Mulai Belanja
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
                <div className='flex items-center justify-between pt-5 pb-2 border-t border-gray-100 mt-4'>
                  <span className='text-xs text-gray-400'>
                    Halaman <strong className='text-gray-700'>{page}</strong> dari{' '}
                    <strong className='text-gray-700'>{totalPages}</strong>
                    <span className='ml-1.5 text-gray-300'>
                      ({data.pagination.total} pesanan)
                    </span>
                  </span>
                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all'
                    >
                      <ChevronLeft className='w-3.5 h-3.5' />
                      Sebelumnya
                    </button>
                    <button
                      type='button'
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all'
                    >
                      Berikutnya
                      <ChevronRight className='w-3.5 h-3.5' />
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
