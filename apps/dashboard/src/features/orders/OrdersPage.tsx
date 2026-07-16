import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Badge, Button, Card, CardContent } from '@starsuperscare/ui';
import { useNavigate } from 'react-router-dom';
import { Box, Package, Receipt, ShoppingBag } from 'lucide-react';
import { Pagination } from '../../components/Pagination.tsx';

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

      <div className='flex space-x-1.5 border-b border-white/10 pb-4 overflow-x-auto scrollbar-hide'>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              type='button'
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setPage(1);
              }}
              className={`px-5 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
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
          <div className='grid gap-6'>
            {data?.orders.map((order: any) => (
              <Card
                key={order.id}
                className='bg-black/20 backdrop-blur-md border border-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden group shadow-sm hover:shadow-xl hover:shadow-black/40 rounded-2xl'
              >
                <div className='p-5 sm:p-7 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent'>
                  <div className='flex items-center gap-4 w-full sm:w-auto'>
                    <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-105 transition-transform duration-300'>
                      <ShoppingBag className='w-6 h-6 text-primary' />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                      <div className='flex items-center gap-2'>
                        <span className='font-bold text-white text-base tracking-wide flex items-center gap-2'>
                          <Receipt className='w-4 h-4 text-muted-foreground' />
                          {order.orderNumber}
                        </span>
                        <Badge
                          variant='outline'
                          className={`${
                            getStatusColor(order.status)
                          } border px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm`}
                        >
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                      <p className='text-sm text-muted-foreground flex items-center gap-1.5'>
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className='text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between sm:justify-start items-center sm:items-end p-4 sm:p-0 bg-white/5 sm:bg-transparent rounded-xl sm:rounded-none border sm:border-none border-white/5'>
                    <p className='text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1'>
                      Total Belanja
                    </p>
                    <p className='font-bold text-xl text-white'>
                      Rp {order.totalAmount.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                <CardContent className='p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6'>
                  <div className='flex items-center gap-4 w-full sm:w-auto'>
                    {/* Summary of items */}
                    <div className='flex -space-x-3'>
                      {order.items?.slice(0, 3).map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className='w-12 h-12 rounded-full bg-[#16181d] border-2 border-[#0a0c10] flex items-center justify-center relative z-10 shadow-sm'
                          title={item.productName}
                        >
                          <Box className='w-4 h-4 text-muted-foreground opacity-50 absolute' />
                          <span className='text-xs font-bold text-white relative z-10 drop-shadow-md'>
                            {item.quantity}x
                          </span>
                        </div>
                      ))}
                      {(order.items?.length || 0) > 3 && (
                        <div className='w-12 h-12 rounded-full bg-white/5 border-2 border-[#0a0c10] flex items-center justify-center relative z-0 backdrop-blur-sm'>
                          <span className='text-xs font-medium text-muted-foreground'>
                            +{(order.items?.length || 0) - 3}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className='flex flex-col justify-center'>
                      <p className='text-sm font-semibold text-white line-clamp-1'>
                        {order.items?.[0]?.productName || 'Produk'}
                      </p>
                      {(order.items?.length || 0) > 1 && (
                        <p className='text-xs text-muted-foreground mt-0.5'>
                          + {(order.items?.length || 0) - 1} produk lainnya
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    variant='outline'
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className='w-full sm:w-auto border-white/10 bg-white/5 hover:bg-white/10 hover:text-white shrink-0 shadow-sm rounded-xl'
                  >
                    Lihat Detail Pesanan
                  </Button>
                </CardContent>
              </Card>
            ))}

            {data?.pagination && data.pagination.total > 0 && (
              <Pagination
                page={page}
                limit={data.pagination.limit}
                total={data.pagination.total}
                onPageChange={setPage}
              />
            )}
          </div>
        )}
    </div>
  );
};
