import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Badge, Button } from '@starsuperscare/ui';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Package, RefreshCcw, ShoppingCart } from 'lucide-react';
import { toast } from '@starsuperscare/ui';

type Tab = 'semua' | 'aktif' | 'selesai' | 'dibatalkan' | 'refund';

const TABS: { value: Tab; label: string }[] = [
  { value: 'semua', label: 'Semua' },
  { value: 'aktif', label: 'Aktif' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'dibatalkan', label: 'Dibatalkan' },
  { value: 'refund', label: 'Refund' },
];

const fetchOrders = async (_url: string, tab: Tab, page: number) => {
  const res = await client.v1.orders.$get({ query: { tab, page: String(page), limit: '10' } });
  if (res.ok) {
    const json = await res.json();
    return json.data;
  }
  throw new Error('Failed');
};

const STATUS_STYLE: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-50 border-amber-200',
  paid: 'text-blue-600 bg-blue-50 border-blue-200',
  processing: 'text-sky-600 bg-sky-50 border-sky-200',
  shipped: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  delivered: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  cancelled: 'text-red-600 bg-red-50 border-red-200',
  refunded: 'text-rose-600 bg-rose-50 border-rose-200',
};
const STATUS_LABEL: Record<string, string> = {
  pending: 'Menunggu Pembayaran',
  paid: 'Dibayar',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Selesai',
  cancelled: 'Dibatalkan',
  refunded: 'Dikembalikan',
};

/** Build full Cloudflare R2 image URL from objectKey — reads VITE_R2_PUBLIC_URL env variable */
const R2_PUBLIC_URL = (import.meta as any).env?.VITE_R2_PUBLIC_URL ?? '';
const buildImageUrl = (objectKey: string) => `${R2_PUBLIC_URL}/${objectKey}`;

/** Parse variant option values (JSON) into human-readable string */
const variantLabel = (optionValues: any): string => {
  if (!optionValues) return '';
  if (typeof optionValues === 'string') {
    try {
      optionValues = JSON.parse(optionValues);
    } catch {
      return optionValues;
    }
  }
  if (Array.isArray(optionValues)) return optionValues.map((v: any) => v.value ?? v).join(' / ');
  return Object.values(optionValues).join(' / ');
};

const fmt = (n: number) => `Rp\u00a0${n.toLocaleString('id-ID')}`;

/** Mini image carousel for a single product's images */
function ItemImageSlideshow({ imageKeys }: { imageKeys: string[] }) {
  const [idx, setIdx] = useState(0);

  if (!imageKeys.length) {
    return (
      <div className='w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200'>
        <Package className='w-8 h-8 text-gray-300' />
      </div>
    );
  }

  return (
    <div className='relative w-20 h-20 shrink-0 select-none'>
      <img
        src={buildImageUrl(imageKeys[idx])}
        alt='Produk'
        className='w-20 h-20 rounded-xl object-cover border border-gray-200 bg-gray-50'
        onError={(e) => {
          (e.target as HTMLImageElement).src = '';
          (e.target as HTMLImageElement).classList.add('hidden');
        }}
      />
      {imageKeys.length > 1 && (
        <>
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              setIdx((i) => (i - 1 + imageKeys.length) % imageKeys.length);
            }}
            className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-5 h-5 rounded-full bg-white/90 shadow border border-gray-200 flex items-center justify-center hover:bg-white transition'
          >
            <ChevronLeft className='w-3 h-3 text-gray-600' />
          </button>
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              setIdx((i) => (i + 1) % imageKeys.length);
            }}
            className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-5 h-5 rounded-full bg-white/90 shadow border border-gray-200 flex items-center justify-center hover:bg-white transition'
          >
            <ChevronRight className='w-3 h-3 text-gray-600' />
          </button>
          {/* dot indicators */}
          <div className='absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 pb-1'>
            {imageKeys.map((_, i) => (
              <span
                key={i}
                className={`inline-block w-1 h-1 rounded-full transition-all ${
                  i === idx ? 'bg-primary w-2' : 'bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** "Beli Lagi" button — posts to buy-again endpoint */
function BuyAgainButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await client.v1.orders[':id']['buy-again'].$post({
        param: { id: orderId },
      });
      if (res.ok) {
        const result = await res.json();
        if (result.data.outOfStockItems?.length > 0) {
          toast.warning(
            `Beberapa item habis: ${result.data.outOfStockItems.join(', ')}`,
          );
        }
        if (result.data.addedCount > 0) {
          toast.success('Item ditambahkan ke keranjang!');
        } else {
          toast.error('Tidak ada item yang tersedia.');
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
      className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all disabled:opacity-50'
    >
      {loading
        ? <RefreshCcw className='w-3 h-3 animate-spin' />
        : <ShoppingCart className='w-3 h-3' />}
      Beli Lagi
    </button>
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
      {/* ── Header ── */}
      <div className='mb-4'>
        <h2 className='text-xl font-bold text-gray-900'>Pesanan Saya</h2>
        <p className='text-sm text-gray-500 mt-0.5'>Kelola dan lacak semua pesanan Anda</p>
      </div>

      {/* ── Tab Bar ── */}
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
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div className='py-4 space-y-3'>
        {isLoading
          ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='animate-pulse h-40 rounded-xl bg-gray-100 border border-gray-200'
                />
              ))}
            </>
          )
          : error
          ? (
            <div className='text-center py-16 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100'>
              Gagal memuat pesanan. Silakan muat ulang halaman.
            </div>
          )
          : !data?.orders?.length
          ? (
            <div className='text-center py-20 bg-white rounded-xl border border-gray-200'>
              <Package className='w-14 h-14 mx-auto text-gray-300 mb-4' />
              <p className='text-base font-semibold text-gray-700 mb-1'>Belum Ada Pesanan</p>
              <p className='text-sm text-gray-400 mb-6'>
                Mulai belanja sekarang dan temukan produk favorit Anda!
              </p>
              <Button onClick={() => navigate('/')} className='rounded-full px-8'>
                Mulai Belanja
              </Button>
            </div>
          )
          : (
            <>
              {data.orders.map((order: any) => (
                <div
                  key={order.id}
                  className='bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200'
                >
                  {/* Order header */}
                  <div className='px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-gray-50/60'>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                        {order.orderNumber}
                      </span>
                      <span className='text-gray-300'>·</span>
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
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        STATUS_STYLE[order.status] || 'text-gray-600 bg-gray-50 border-gray-200'
                      }`}
                    >
                      {STATUS_LABEL[order.status] || order.status}
                    </Badge>
                  </div>

                  {/* Items list */}
                  <div className='divide-y divide-gray-100'>
                    {order.items.map((item: any) => {
                      const label = variantLabel(item.optionValues);
                      const hasDiscount = item.comparePrice &&
                        item.comparePrice > item.priceSnapshot;
                      return (
                        <div key={item.orderItemId} className='px-4 py-4 flex gap-4 items-start'>
                          {/* Product image with slideshow */}
                          <ItemImageSlideshow imageKeys={item.imageKeys ?? []} />

                          {/* Product info */}
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm font-semibold text-gray-900 line-clamp-2 leading-snug'>
                              {item.productName}
                            </p>
                            {label && (
                              <p className='text-xs text-gray-400 mt-1 bg-gray-50 border border-gray-200 rounded-md px-2 py-0.5 inline-block'>
                                {label}
                              </p>
                            )}
                            <div className='flex items-center gap-3 mt-2'>
                              {hasDiscount && (
                                <span className='text-xs text-gray-400 line-through tabular-nums'>
                                  {fmt(item.comparePrice)}
                                </span>
                              )}
                              <span className='text-sm font-bold text-primary tabular-nums'>
                                {fmt(item.priceSnapshot)}
                              </span>
                            </div>
                            <p className='text-xs text-gray-400 mt-1'>
                              × {item.quantity} item
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer: Total + CTAs */}
                  <div className='px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/40'>
                    <div>
                      <p className='text-xs text-gray-500'>
                        {order.items.length} produk · Total Belanja
                      </p>
                      <p className='text-base font-bold text-gray-900 tabular-nums'>
                        {fmt(order.totalAmount)}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <BuyAgainButton orderId={order.id} />
                      <button
                        type='button'
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all'
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='flex items-center justify-between pt-4 pb-2 border-t border-gray-100'>
                  <span className='text-sm text-gray-500'>
                    Halaman <strong className='text-gray-900'>{page}</strong> dari{' '}
                    <strong className='text-gray-900'>{totalPages}</strong>
                    <span className='text-gray-400 ml-1.5'>({data.pagination.total} pesanan)</span>
                  </span>
                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className='inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    >
                      <ChevronLeft className='w-4 h-4' />
                      Sebelumnya
                    </button>
                    <button
                      type='button'
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className='inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
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
