import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@starsuperscare/ui';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Package,
  RefreshCcw,
  ShoppingCart,
  Truck,
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

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBuyingAgain, setIsBuyingAgain] = useState(false);

  const { data, error, isLoading } = useSWR(
    id ? ['/api/orders', id] : null,
    ([, orderId]) => fetchOrderDetail(orderId),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'paid':
      case 'processing':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'shipped':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'delivered':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled':
      case 'refunded':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Menunggu Pembayaran',
      paid: 'Dibayar',
      processing: 'Diproses',
      shipped: 'Dikirim',
      delivered: 'Selesai',
      cancelled: 'Dibatalkan',
      refunded: 'Refund',
    };
    return labels[status] || status;
  };

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
          // In a real app we'd trigger cart drawer or redirect to cart
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

  if (isLoading) {
    return <div className='animate-pulse bg-white/5 border border-white/10 h-[600px] rounded-xl' />;
  }

  if (error || !data) {
    return (
      <div className='text-center py-10 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20'>
        <p>Pesanan tidak ditemukan.</p>
        <Button variant='outline' onClick={() => navigate('/orders')} className='mt-4'>
          Kembali
        </Button>
      </div>
    );
  }

  const { order, items, addresses, history } = data;
  const shipping: any = addresses?.shippingSnapshot;

  return (
    <div className='space-y-6 max-w-5xl mx-auto pb-10'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate('/orders')}
            className='shrink-0 hover:bg-white/10 rounded-full'
          >
            <ArrowLeft className='w-5 h-5' />
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight text-white flex items-center gap-3'>
              Order #{order.orderNumber}
              <Badge variant='outline' className={getStatusColor(order.status)}>
                {getStatusLabel(order.status)}
              </Badge>
            </h2>
            <p className='text-sm text-muted-foreground mt-1'>
              Dibuat pada {new Date(order.createdAt).toLocaleString('id-ID', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            className='border-white/20 hover:bg-white/10 shadow-sm'
            onClick={() => globalThis.open(`/api/v1/orders/${order.id}/invoice`, '_blank')}
          >
            <FileText className='w-4 h-4 mr-2' />
            Invoice
          </Button>
          <Button
            onClick={handleBuyAgain}
            disabled={isBuyingAgain}
            className='shadow-sm shadow-primary/20'
          >
            {isBuyingAgain
              ? <RefreshCcw className='w-4 h-4 mr-2 animate-spin' />
              : <ShoppingCart className='w-4 h-4 mr-2' />}
            Beli Lagi
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          {/* Products */}
          <Card className='bg-[#0f1115] border-white/10'>
            <CardHeader className='border-b border-white/5 bg-white/[0.02]'>
              <CardTitle className='text-lg'>Detail Produk</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='divide-y divide-white/5'>
                {items.map((item: any) => (
                  <div key={item.id} className='p-6 flex flex-col sm:flex-row items-start gap-4'>
                    <div className='w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10'>
                      <Package className='w-8 h-8 text-muted-foreground/50' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-medium text-white truncate'>
                        {item.productNameSnapshot}
                      </h4>
                      <p className='text-sm text-muted-foreground mt-1'>
                        SKU: {item.variantSkuSnapshot}
                      </p>
                      <div className='mt-2 flex items-center justify-between'>
                        <p className='text-sm text-white'>
                          {item.quantity} x Rp {item.priceSnapshot.toLocaleString('id-ID')}
                        </p>
                        <p className='font-medium text-white'>
                          Rp {(item.quantity * item.priceSnapshot).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline Tracking */}
          <Card className='bg-[#0f1115] border-white/10'>
            <CardHeader className='border-b border-white/5 bg-white/[0.02]'>
              <CardTitle className='text-lg'>Lacak Pesanan</CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
              <div className='space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent'>
                {history.map((event: any, idx: number) => {
                  const getEventIcon = (status: string) => {
                    if (status === 'delivered') {
                      return <CheckCircle2 className='w-4 h-4 text-green-500' />;
                    }
                    if (status === 'shipped') return <Truck className='w-4 h-4 text-indigo-500' />;
                    if (status.includes('cancel')) {
                      return <XCircle className='w-4 h-4 text-red-500' />;
                    }
                    return <Clock className='w-4 h-4 text-blue-500' />;
                  };

                  const isFirst = idx === 0;

                  return (
                    <div
                      key={event.id}
                      className='relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active'
                    >
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0f1115] bg-[#1a1d24] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_2px_rgba(255,255,255,0.05)] ${
                          isFirst ? 'shadow-[0_0_0_2px_rgba(59,130,246,0.3)]' : ''
                        } relative z-10`}
                      >
                        {getEventIcon(event.status)}
                      </div>
                      <div className='w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white/5 border border-white/10 shadow-sm transition-all hover:bg-white/10 hover:border-white/20'>
                        <div className='flex flex-col gap-1'>
                          <span className='font-medium text-white'>
                            {getStatusLabel(event.status)}
                          </span>
                          <span className='text-xs text-muted-foreground flex items-center gap-1'>
                            <Clock className='w-3 h-3' />
                            {new Date(event.createdAt).toLocaleString('id-ID', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>
                        {event.note && (
                          <div className='mt-2 text-sm text-muted-foreground bg-black/20 p-2 rounded-lg'>
                            {event.note}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          {/* Payment Summary */}
          <Card className='bg-[#0f1115] border-white/10'>
            <CardHeader className='border-b border-white/5 bg-white/[0.02]'>
              <CardTitle className='text-lg'>Rincian Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className='p-6 space-y-4'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Subtotal Produk</span>
                <span className='text-white'>
                  Rp {order.subtotalAmount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Ongkos Kirim</span>
                <span className='text-white'>
                  Rp {order.shippingAmount.toLocaleString('id-ID')}
                </span>
              </div>
              {order.taxAmount > 0 && (
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Pajak</span>
                  <span className='text-white'>Rp {order.taxAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              {order.discountAmount > 0 && (
                <div className='flex justify-between text-sm text-green-400'>
                  <span>Diskon</span>
                  <span>-Rp {order.discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className='pt-4 border-t border-white/10 flex justify-between'>
                <span className='font-bold text-white'>Total Belanja</span>
                <span className='font-bold text-white text-lg'>
                  Rp {order.totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          {shipping && (
            <Card className='bg-[#0f1115] border-white/10'>
              <CardHeader className='border-b border-white/5 bg-white/[0.02]'>
                <CardTitle className='text-lg'>Info Pengiriman</CardTitle>
              </CardHeader>
              <CardContent className='p-6 space-y-4 text-sm'>
                <div>
                  <p className='text-muted-foreground mb-1'>Penerima</p>
                  <p className='font-medium text-white'>{shipping.recipientName}</p>
                  <p className='text-white'>{shipping.phone}</p>
                </div>
                <div>
                  <p className='text-muted-foreground mb-1'>Alamat</p>
                  <p className='text-white'>
                    {shipping.addressLine1}
                    {shipping.addressLine2 ? `, ${shipping.addressLine2}` : ''}
                  </p>
                  <p className='text-white'>
                    {shipping.district}, {shipping.city}
                  </p>
                  <p className='text-white'>
                    {shipping.province}, {shipping.postalCode}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
