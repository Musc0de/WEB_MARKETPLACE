import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Card } from '@starsuperscare/ui';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  MapPin,
  Package,
  Phone,
  RefreshCcw,
  ShoppingCart,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import { toast } from '@starsuperscare/ui';

const fetchOrderDetail = async (id: string) => {
  const res = await client.v1.orders[':id'].$get({ param: { id } });
  if (res.ok) {
    const json = await res.json();
    return json.data;
  }
  throw new Error('Failed to fetch order detail');
};

/** Status badge styles for light mode */
const getStatusStyle = (status: string) => {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    paid: 'bg-blue-50 text-blue-700 border-blue-200',
    processing: 'bg-sky-50 text-sky-700 border-sky-200',
    shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    refunded: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return styles[status] || 'bg-gray-50 text-gray-600 border-gray-200';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Menunggu Pembayaran',
    paid: 'Dibayar',
    processing: 'Diproses',
    shipped: 'Dikirim',
    delivered: 'Selesai',
    cancelled: 'Dibatalkan',
    refunded: 'Dikembalikan',
  };
  return labels[status] || status;
};

/** Timeline event icon */
const getEventIcon = (status: string) => {
  if (status === 'delivered') return <CheckCircle2 className='w-4 h-4 text-emerald-600' />;
  if (status === 'shipped') return <Truck className='w-4 h-4 text-indigo-600' />;
  if (status.includes('cancel')) return <XCircle className='w-4 h-4 text-red-500' />;
  if (status === 'refunded') return <RefreshCcw className='w-4 h-4 text-rose-500' />;
  return <Clock className='w-4 h-4 text-blue-500' />;
};

/** Timeline event dot color */
const getEventDotColor = (status: string) => {
  if (status === 'delivered') return 'bg-emerald-100 border-emerald-300';
  if (status === 'shipped') return 'bg-indigo-100 border-indigo-300';
  if (status.includes('cancel')) return 'bg-red-100 border-red-300';
  if (status === 'refunded') return 'bg-rose-100 border-rose-300';
  return 'bg-blue-100 border-blue-300';
};

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBuyingAgain, setIsBuyingAgain] = useState(false);

  const { data, error, isLoading } = useSWR(
    id ? ['/api/orders', id] : null,
    ([, orderId]) => fetchOrderDetail(orderId),
  );

  const handleBuyAgain = async () => {
    if (!id) return;
    setIsBuyingAgain(true);
    try {
      const res = await client.v1.orders[':id']['buy-again'].$post({ param: { id } });
      if (res.ok) {
        const result = await res.json();
        if (result.data.outOfStockItems?.length > 0) {
          toast.warning(
            `Beberapa item habis/tidak tersedia: ${result.data.outOfStockItems.join(', ')}`,
          );
        }
        if (result.data.addedCount > 0) {
          toast.success('Item berhasil ditambahkan ke keranjang!');
        } else if (result.data.addedCount === 0) {
          toast.error('Tidak ada item yang bisa dibeli lagi saat ini.');
        }
      } else {
        toast.error('Gagal memproses permintaan beli lagi');
      }
    } catch (_err) {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setIsBuyingAgain(false);
    }
  };

  /* ── Loading State ── */
  if (isLoading) {
    return (
      <div className='max-w-5xl mx-auto space-y-6 animate-pulse'>
        <div className='h-8 w-48 bg-gray-100 rounded-lg' />
        <div className='h-4 w-72 bg-gray-100 rounded-lg' />
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-6'>
            <div className='h-64 bg-gray-100 rounded-2xl' />
            <div className='h-48 bg-gray-100 rounded-2xl' />
          </div>
          <div className='space-y-6'>
            <div className='h-52 bg-gray-100 rounded-2xl' />
            <div className='h-40 bg-gray-100 rounded-2xl' />
          </div>
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (error || !data) {
    return (
      <div className='text-center py-20 max-w-md mx-auto'>
        <div className='w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5 border border-red-100'>
          <Package className='w-8 h-8 text-red-400' />
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>Pesanan Tidak Ditemukan</h3>
        <p className='text-gray-500 text-sm mb-6'>
          Pesanan yang Anda cari tidak ada atau mungkin sudah dihapus.
        </p>
        <Button variant='outline' onClick={() => navigate('/orders')} className='rounded-full px-6'>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Kembali ke Daftar Pesanan
        </Button>
      </div>
    );
  }

  const { order, items, addresses, history } = data;
  const shipping: any = addresses?.shippingSnapshot;

  return (
    <div className='space-y-8 max-w-5xl mx-auto pb-10'>
      {/* ═══════════ Header ═══════════ */}
      <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-5'>
        <div className='flex items-start gap-4'>
          <button
            type='button'
            onClick={() => navigate('/orders')}
            className='mt-1 p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all active:scale-95 shrink-0'
          >
            <ArrowLeft className='w-4 h-4 text-gray-600' />
          </button>
          <div>
            <div className='flex items-center gap-3 flex-wrap'>
              <h2 className='text-xl font-bold text-gray-900'>
                {order.orderNumber}
              </h2>
              <Badge
                variant='outline'
                className={`${
                  getStatusStyle(order.status)
                } border rounded-full px-3 py-0.5 text-xs font-semibold`}
              >
                {getStatusLabel(order.status)}
              </Badge>
            </div>
            <p className='text-sm text-gray-500 mt-1.5 flex items-center gap-1.5'>
              <Clock className='w-3.5 h-3.5' />
              Dibuat pada {new Date(order.createdAt).toLocaleString('id-ID', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-2.5 pl-14 sm:pl-0'>
          <Button
            variant='outline'
            className='rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
            onClick={() => globalThis.open(`/api/v1/orders/${order.id}/invoice`, '_blank')}
          >
            <Download className='w-4 h-4 mr-2' />
            Unduh Invoice
          </Button>
          <Button
            onClick={handleBuyAgain}
            disabled={isBuyingAgain}
            className='rounded-xl font-medium shadow-sm'
          >
            {isBuyingAgain
              ? <RefreshCcw className='w-4 h-4 mr-2 animate-spin' />
              : <ShoppingCart className='w-4 h-4 mr-2' />}
            Beli Lagi
          </Button>
        </div>
      </div>

      {/* ═══════════ Main Content Grid ═══════════ */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* ── Left Column ── */}
        <div className='lg:col-span-2 space-y-6'>
          {/* ── Products Card ── */}
          <Card className='bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm'>
            <div className='px-6 py-4 border-b border-gray-100 bg-gray-50/50'>
              <h3 className='text-base font-semibold text-gray-900 flex items-center gap-2'>
                <Package className='w-4 h-4 text-gray-500' />
                Detail Produk
                <span className='text-xs font-normal text-gray-400 ml-1'>
                  ({items.length} item)
                </span>
              </h3>
            </div>
            <div className='divide-y divide-gray-100'>
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className='px-6 py-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors'
                >
                  <div className='w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center shrink-0 border border-gray-200'>
                    <Package className='w-6 h-6 text-gray-400' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h4 className='font-semibold text-gray-900 text-sm truncate'>
                      {item.productNameSnapshot}
                    </h4>
                    <p className='text-xs text-gray-400 mt-0.5 font-mono'>
                      SKU: {item.variantSkuSnapshot}
                    </p>
                    <div className='mt-2.5 flex items-center justify-between'>
                      <span className='text-sm text-gray-500'>
                        {item.quantity} × Rp {item.priceSnapshot.toLocaleString('id-ID')}
                      </span>
                      <span className='font-bold text-gray-900 text-sm tabular-nums'>
                        Rp {(item.quantity * item.priceSnapshot).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Order Timeline ── */}
          <Card className='bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm'>
            <div className='px-6 py-4 border-b border-gray-100 bg-gray-50/50'>
              <h3 className='text-base font-semibold text-gray-900 flex items-center gap-2'>
                <Truck className='w-4 h-4 text-gray-500' />
                Lacak Pesanan
              </h3>
            </div>
            <div className='px-6 py-6'>
              <div className='space-y-0'>
                {history.map((event: any, idx: number) => {
                  const isLast = idx === history.length - 1;
                  return (
                    <div key={event.id} className='flex gap-4'>
                      {/* Timeline dot + line */}
                      <div className='flex flex-col items-center'>
                        <div
                          className={`w-9 h-9 rounded-full ${
                            getEventDotColor(event.status)
                          } border flex items-center justify-center shrink-0 z-10`}
                        >
                          {getEventIcon(event.status)}
                        </div>
                        {!isLast && <div className='w-px flex-1 bg-gray-200 my-1' />}
                      </div>
                      {/* Content */}
                      <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                        <p className='font-semibold text-gray-900 text-sm'>
                          {getStatusLabel(event.status)}
                        </p>
                        <p className='text-xs text-gray-400 mt-0.5 flex items-center gap-1'>
                          <Clock className='w-3 h-3' />
                          {new Date(event.createdAt).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                        {event.note && (
                          <div className='mt-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100'>
                            {event.note}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* ── Right Column (Sidebar) ── */}
        <div className='space-y-6'>
          {/* ── Payment Summary ── */}
          <Card className='bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm'>
            <div className='px-6 py-4 border-b border-gray-100 bg-gray-50/50'>
              <h3 className='text-base font-semibold text-gray-900 flex items-center gap-2'>
                <CreditCard className='w-4 h-4 text-gray-500' />
                Rincian Pembayaran
              </h3>
            </div>
            <div className='px-6 py-5 space-y-3.5'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Subtotal Produk</span>
                <span className='text-gray-800 font-medium tabular-nums'>
                  Rp {order.subtotalAmount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Ongkos Kirim</span>
                <span className='text-gray-800 font-medium tabular-nums'>
                  Rp {order.shippingAmount.toLocaleString('id-ID')}
                </span>
              </div>
              {order.taxAmount > 0 && (
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>Pajak</span>
                  <span className='text-gray-800 font-medium tabular-nums'>
                    Rp {order.taxAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
              {order.discountAmount > 0 && (
                <div className='flex justify-between text-sm'>
                  <span className='text-emerald-600 font-medium'>Diskon</span>
                  <span className='text-emerald-600 font-medium tabular-nums'>
                    −Rp {order.discountAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {/* Total */}
              <div className='pt-4 mt-2 border-t border-gray-100 flex justify-between items-center'>
                <span className='font-bold text-gray-900'>Total Belanja</span>
                <span className='font-bold text-lg text-gray-900 tabular-nums'>
                  Rp {order.totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </Card>

          {/* ── Shipping Info ── */}
          {shipping && (
            <Card className='bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm'>
              <div className='px-6 py-4 border-b border-gray-100 bg-gray-50/50'>
                <h3 className='text-base font-semibold text-gray-900 flex items-center gap-2'>
                  <MapPin className='w-4 h-4 text-gray-500' />
                  Alamat Pengiriman
                </h3>
              </div>
              <div className='px-6 py-5 space-y-4'>
                {/* Recipient */}
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5'>
                    <User className='w-4 h-4 text-gray-500' />
                  </div>
                  <div>
                    <p className='font-semibold text-gray-900 text-sm'>{shipping.recipientName}</p>
                    <p className='text-xs text-gray-500 flex items-center gap-1 mt-0.5'>
                      <Phone className='w-3 h-3' />
                      {shipping.phone}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5'>
                    <MapPin className='w-4 h-4 text-gray-500' />
                  </div>
                  <div className='text-sm text-gray-600 leading-relaxed'>
                    <p>
                      {shipping.addressLine1}
                      {shipping.addressLine2 ? `, ${shipping.addressLine2}` : ''}
                    </p>
                    <p>{shipping.district}, {shipping.city}</p>
                    <p className='text-gray-500'>{shipping.province}, {shipping.postalCode}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
