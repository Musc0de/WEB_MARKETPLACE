import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Badge, Button, Card, CardContent } from '@starsuperscare/ui';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';

type Tab = 'semua' | 'aktif' | 'selesai' | 'dibatalkan' | 'refund';

const tabs: { value: Tab; label: string }[] = [
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
  throw new Error('Failed to fetch orders');
};

export const OrdersPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('semua');
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useSWR(
    ['/api/orders', activeTab, page],
    ([url, t, p]) => fetchOrders(url, t as Tab, p),
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

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Pesanan Saya</h2>
          <p className='text-muted-foreground text-sm mt-1'>
            Kelola dan lacak pesanan Anda di sini.
          </p>
        </div>
      </div>

      <div className='flex space-x-2 border-b border-white/10 pb-4 overflow-x-auto'>
        {tabs.map((tab) => (
          <button
            type='button'
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setPage(1);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-white/5 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading
        ? (
          <div className='grid gap-4'>
            {[1, 2, 3].map((i) => (
              <Card key={i} className='animate-pulse bg-white/5 border-white/10 h-32' />
            ))}
          </div>
        )
        : error
        ? (
          <div className='text-center py-10 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20'>
            <p>Gagal memuat pesanan. Silakan coba lagi.</p>
          </div>
        )
        : data?.orders?.length === 0
        ? (
          <div className='text-center py-20 bg-white/5 rounded-xl border border-white/10'>
            <Package className='w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50' />
            <h3 className='text-lg font-medium text-white mb-2'>Belum Ada Pesanan</h3>
            <p className='text-muted-foreground text-sm mb-6 max-w-sm mx-auto'>
              Anda belum memiliki pesanan dengan status ini. Mulai belanja untuk melihat riwayat
              Anda.
            </p>
            <Button onClick={() => navigate('/')}>
              Mulai Belanja
            </Button>
          </div>
        )
        : (
          <div className='grid gap-4'>
            {data?.orders.map((order: any) => (
              <Card
                key={order.id}
                className='bg-[#0f1115] border-white/10 hover:border-white/20 transition-all overflow-hidden group'
              >
                <div className='p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-white/5 bg-white/[0.02]'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
                      <Package className='w-5 h-5 text-primary' />
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground mb-1'>
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium text-white'>{order.orderNumber}</span>
                        <Badge variant='outline' className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className='text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between sm:justify-start items-center sm:items-end'>
                    <p className='text-sm text-muted-foreground'>Total Belanja</p>
                    <p className='font-bold text-lg text-white'>
                      Rp {order.totalAmount.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                <CardContent className='p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
                  <div className='flex -space-x-2 w-full sm:w-auto'>
                    {/* Summary of items */}
                    {order.items.slice(0, 3).map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className='w-12 h-12 rounded-lg bg-white/10 border border-[#0f1115] flex items-center justify-center overflow-hidden relative z-10'
                        title={item.productName}
                      >
                        <span className='text-xs text-muted-foreground'>{item.quantity}x</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className='w-12 h-12 rounded-lg bg-white/5 border border-[#0f1115] flex items-center justify-center relative z-0'>
                        <span className='text-xs text-muted-foreground'>
                          +{order.items.length - 3}
                        </span>
                      </div>
                    )}
                    <div className='ml-4 pl-4 flex flex-col justify-center'>
                      <p className='text-sm font-medium text-white line-clamp-1'>
                        {order.items[0]?.productName}
                      </p>
                      {order.items.length > 1 && (
                        <p className='text-xs text-muted-foreground'>
                          + {order.items.length - 1} produk lainnya
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    variant='outline'
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className='w-full sm:w-auto border-white/20 hover:bg-white/10 shrink-0'
                  >
                    Detail Pesanan
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {(data?.pagination?.totalPages ?? 0) > 1 && (
              <div className='flex justify-center items-center gap-4 mt-8'>
                <Button
                  variant='outline'
                  size='icon'
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className='border-white/20 hover:bg-white/10'
                >
                  <ChevronLeft className='w-4 h-4' />
                </Button>
                <span className='text-sm text-muted-foreground'>
                  Halaman <span className='text-white font-medium'>{page}</span> dari{' '}
                  {data?.pagination?.totalPages}
                </span>
                <Button
                  variant='outline'
                  size='icon'
                  disabled={page === data?.pagination?.totalPages}
                  onClick={() => setPage((p) => Math.min(data?.pagination?.totalPages || 1, p + 1))}
                  className='border-white/20 hover:bg-white/10'
                >
                  <ChevronRight className='w-4 h-4' />
                </Button>
              </div>
            )}
          </div>
        )}
    </div>
  );
};
