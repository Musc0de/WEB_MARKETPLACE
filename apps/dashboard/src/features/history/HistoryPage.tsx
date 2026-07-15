import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Badge, Button, Card, CardContent } from '@starsuperscare/ui';
import { useNavigate } from 'react-router-dom';
import { Activity, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const fetchHistory = async (_url: string, page: number, filters: any) => {
  const query: any = { page: String(page), limit: '5' };
  if (filters.status) query.status = filters.status;
  if (filters.year) query.year = String(filters.year);
  if (filters.start_date) query.start_date = filters.start_date;
  if (filters.end_date) query.end_date = filters.end_date;

  const res = await client.v1.history.$get({ query });
  if (res.ok) {
    const json = await res.json();
    return json.data;
  }
  throw new Error('Failed to fetch history');
};

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<
    { status?: string; year?: string; start_date?: string; end_date?: string }
  >({});

  const { data, error, isLoading } = useSWR(
    ['/api/history', page, filters],
    ([url, p, f]) => fetchHistory(url, p as number, f),
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
      pending: 'Menunggu',
      paid: 'Dibayar',
      processing: 'Diproses',
      shipped: 'Dikirim',
      delivered: 'Selesai',
      cancelled: 'Batal',
      refunded: 'Refund',
    };
    return labels[status] || status;
  };

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setPage(1); // reset page on filter change
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Riwayat Transaksi</h2>
          <p className='text-muted-foreground text-sm mt-1'>
            Pantau semua riwayat dan ringkasan transaksi Anda.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <Card className='bg-[#0f1115] border-white/10'>
          <CardContent className='p-4'>
            <p className='text-sm text-muted-foreground'>Total Transaksi</p>
            <p className='text-2xl font-bold text-white mt-1'>
              {isLoading ? '-' : data?.summary?.totalTransactions ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className='bg-[#0f1115] border-white/10'>
          <CardContent className='p-4'>
            <p className='text-sm text-muted-foreground'>Total Nominal</p>
            <p className='text-2xl font-bold text-white mt-1'>
              Rp {isLoading ? '-' : (data?.summary?.totalNominal ?? 0).toLocaleString('id-ID')}
            </p>
          </CardContent>
        </Card>
        <Card className='bg-[#0f1115] border-white/10'>
          <CardContent className='p-4'>
            <p className='text-sm text-muted-foreground'>Selesai</p>
            <p className='text-2xl font-bold text-green-500 mt-1'>
              {isLoading ? '-' : data?.summary?.completedCount ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className='bg-[#0f1115] border-white/10'>
          <CardContent className='p-4'>
            <p className='text-sm text-muted-foreground'>Refund</p>
            <p className='text-2xl font-bold text-red-500 mt-1'>
              {isLoading ? '-' : data?.summary?.refundCount ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap gap-4 items-center bg-[#0f1115] p-4 rounded-xl border border-white/10'>
        <div className='flex flex-col gap-1'>
          <label className='text-xs text-muted-foreground'>Status</label>
          <select
            className='bg-transparent border border-white/20 rounded p-2 text-sm text-white'
            value={filters.status || ''}
            onChange={(e) => updateFilter('status', e.target.value)}
          >
            <option value='' className='bg-black'>Semua Status</option>
            <option value='delivered' className='bg-black'>Selesai</option>
            <option value='refunded' className='bg-black'>Refund</option>
            <option value='cancelled' className='bg-black'>Dibatalkan</option>
          </select>
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-xs text-muted-foreground'>Tahun</label>
          <select
            className='bg-transparent border border-white/20 rounded p-2 text-sm text-white'
            value={filters.year || ''}
            onChange={(e) => updateFilter('year', e.target.value)}
          >
            <option value='' className='bg-black'>Semua Waktu</option>
            <option value='2026' className='bg-black'>2026</option>
            <option value='2025' className='bg-black'>2025</option>
          </select>
        </div>
      </div>

      {isLoading
        ? (
          <div className='grid gap-4'>
            {[1, 2, 3].map((i) => (
              <Card key={i} className='animate-pulse bg-white/5 border-white/10 h-24' />
            ))}
          </div>
        )
        : error
        ? (
          <div className='text-center py-10 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20'>
            <p>Gagal memuat riwayat. Silakan coba lagi.</p>
          </div>
        )
        : data?.items?.length === 0
        ? (
          <div className='text-center py-20 bg-white/5 rounded-xl border border-white/10'>
            <Activity className='w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50' />
            <h3 className='text-lg font-medium text-white mb-2'>Tidak Ada Riwayat</h3>
            <p className='text-muted-foreground text-sm mb-6'>
              Belum ada transaksi yang sesuai dengan filter Anda.
            </p>
          </div>
        )
        : (
          <div className='grid gap-4'>
            {data?.items.map((item: any) => (
              <Card
                key={item.id}
                className='bg-[#0f1115] border-white/10 hover:border-white/20 transition-all overflow-hidden'
              >
                <div className='p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
                      <Calendar className='w-5 h-5 text-primary' />
                    </div>
                    <div>
                      <div className='flex items-center gap-2 mb-1'>
                        <span className='font-medium text-white'>{item.orderNumber}</span>
                        <Badge variant='outline' className={getStatusColor(item.status)}>
                          {getStatusLabel(item.status)}
                        </Badge>
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(item.createdAt).toLocaleString('id-ID', {
                          timeZone: 'Asia/Jakarta',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })} WIB
                      </p>
                    </div>
                  </div>
                  <div className='text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between sm:justify-start items-center sm:items-end'>
                    <p className='font-bold text-lg text-white'>
                      Rp {item.totalAmount.toLocaleString('id-ID')}
                    </p>
                    <Button
                      variant='link'
                      className='px-0 text-primary h-auto'
                      onClick={() => navigate(`/orders/${item.id}`)}
                    >
                      Lihat Detail
                    </Button>
                  </div>
                </div>
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
