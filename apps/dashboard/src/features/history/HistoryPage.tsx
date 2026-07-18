import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Badge, Button, Card, CardContent } from '@starsuperscare/ui';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  SearchX,
  ShoppingBag,
} from 'lucide-react';

const fetchHistory = async (_url: string, page: number, filters: any) => {
  const query: any = { page: String(page), limit: '5' };
  if (filters.status) query.status = filters.status;
  if (filters.year) query.year = String(filters.year);
  if (filters.start_date) query.start_date = filters.start_date;
  if (filters.end_date) query.end_date = filters.end_date;

  const res = await (client.v1 as any).history.$get({ query });
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
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'paid':
      case 'processing':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'shipped':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'cancelled':
      case 'refunded':
      case 'cancellation_requested':
      case 'return_requested':
      case 'cancellation_rejected':
      case 'return_rejected':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-muted/50 text-foreground border-border/60';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Menunggu Pemb.',
      paid: 'Dibayar',
      processing: 'Diproses',
      shipped: 'Dikirim',
      delivered: 'Selesai',
      cancelled: 'Dibatalkan',
      refunded: 'Refund',
      cancellation_requested: 'Proses Batal',
      return_requested: 'Proses Retur',
      cancellation_rejected: 'Batal Ditolak',
      return_rejected: 'Retur Ditolak',
    };
    return labels[status] || status;
  };

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setPage(1); // reset page on filter change
  };

  return (
    <div className='max-w-5xl mx-auto space-y-8 pb-10'>
      <div className='flex flex-col gap-2'>
        <h2 className='text-3xl font-extrabold tracking-tight text-foreground'>
          Riwayat Transaksi
        </h2>
        <p className='text-muted-foreground text-base'>
          Pantau semua pesanan dan aktivitas belanja Anda di sini.
        </p>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
        <Card className='bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg shadow-blue-500/20 rounded-2xl hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 group'>
          <CardContent className='p-4 md:p-5 relative overflow-hidden'>
            <div className='absolute -right-4 -top-4 w-20 h-20 bg-card/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500' />
            <div className='flex items-center gap-3 mb-2 relative z-10'>
              <div className='p-2 bg-card/20 rounded-lg backdrop-blur-sm'>
                <ShoppingBag className='w-5 h-5 text-white' />
              </div>
              <p className='text-xs md:text-sm font-medium text-blue-50'>Pesanan</p>
            </div>
            <p className='text-2xl font-bold text-white relative z-10'>
              {isLoading ? '...' : data?.summary?.totalTransactions ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-lg shadow-emerald-500/20 rounded-2xl hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 group'>
          <CardContent className='p-4 md:p-5 relative overflow-hidden'>
            <div className='absolute -right-4 -top-4 w-20 h-20 bg-card/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500' />
            <div className='flex items-center gap-3 mb-2 relative z-10'>
              <div className='p-2 bg-card/20 rounded-lg backdrop-blur-sm'>
                <Activity className='w-5 h-5 text-white' />
              </div>
              <p className='text-xs md:text-sm font-medium text-emerald-50'>Nominal</p>
            </div>
            <p className='text-lg md:text-xl font-bold text-white truncate relative z-10'>
              Rp {isLoading ? '...' : (data?.summary?.totalNominal ?? 0).toLocaleString('id-ID')}
            </p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg shadow-purple-500/20 rounded-2xl hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 group'>
          <CardContent className='p-4 md:p-5 relative overflow-hidden'>
            <div className='absolute -right-4 -top-4 w-20 h-20 bg-card/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500' />
            <div className='flex items-center gap-3 mb-2 relative z-10'>
              <div className='p-2 bg-card/20 rounded-lg backdrop-blur-sm'>
                <Activity className='w-5 h-5 text-white' />
              </div>
              <p className='text-xs md:text-sm font-medium text-purple-50'>Selesai</p>
            </div>
            <p className='text-2xl font-bold text-white relative z-10'>
              {isLoading ? '...' : data?.summary?.completedCount ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-rose-500 to-red-600 text-white border-0 shadow-lg shadow-rose-500/20 rounded-2xl hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/40 transition-all duration-300 group'>
          <CardContent className='p-4 md:p-5 relative overflow-hidden'>
            <div className='absolute -right-4 -top-4 w-20 h-20 bg-card/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500' />
            <div className='flex items-center gap-3 mb-2 relative z-10'>
              <div className='p-2 bg-card/20 rounded-lg backdrop-blur-sm'>
                <Activity className='w-5 h-5 text-white' />
              </div>
              <p className='text-xs md:text-sm font-medium text-rose-50'>Batal/Refund</p>
            </div>
            <p className='text-2xl font-bold text-white relative z-10'>
              {isLoading ? '...' : data?.summary?.refundCount ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Area */}
      <div className='bg-muted/80 p-4 md:p-5 rounded-2xl border border-border/60/60 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto'>
          <div className='flex flex-col gap-1.5 flex-1 sm:flex-none'>
            <label className='text-[11px] font-semibold text-muted-foreground uppercase tracking-wider'>
              Status Pesanan
            </label>
            <select
              className='bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer shadow-sm w-full sm:min-w-[160px]'
              value={filters.status || ''}
              onChange={(e) => updateFilter('status', e.target.value)}
            >
              <option value=''>Semua Status</option>
              <option value='pending'>Menunggu Pembayaran</option>
              <option value='delivered'>Selesai</option>
              <option value='refunded'>Refund & Retur</option>
              <option value='cancelled'>Dibatalkan</option>
            </select>
          </div>
          <div className='flex flex-col gap-1.5 flex-1 sm:flex-none'>
            <label className='text-[11px] font-semibold text-muted-foreground uppercase tracking-wider'>
              Tahun Transaksi
            </label>
            <select
              className='bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer shadow-sm w-full sm:min-w-[140px]'
              value={filters.year || ''}
              onChange={(e) => updateFilter('year', e.target.value)}
            >
              <option value=''>Semua Waktu</option>
              <option value='2026'>2026</option>
              <option value='2025'>2025</option>
            </select>
          </div>
        </div>
      </div>

      {/* List Area */}
      {isLoading
        ? (
          <div className='grid gap-5'>
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className='animate-pulse bg-muted border-border/60 h-32 rounded-2xl'
              />
            ))}
          </div>
        )
        : error
        ? (
          <div className='text-center py-12 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-500/20 shadow-sm'>
            <p className='font-medium text-lg'>Gagal memuat riwayat transaksi.</p>
            <p className='text-sm mt-1 opacity-80'>Silakan coba muat ulang halaman.</p>
          </div>
        )
        : data?.items?.length === 0
        ? (
          <div className='text-center py-20 bg-muted/50 rounded-3xl border border-dashed border-border flex flex-col items-center justify-center'>
            <div className='w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-sm mb-5'>
              <SearchX className='w-8 h-8 text-muted-foreground/80' />
            </div>
            <h3 className='text-xl font-bold text-foreground mb-2'>Tidak Ada Riwayat</h3>
            <p className='text-muted-foreground text-sm max-w-sm px-4'>
              Belum ada transaksi yang sesuai dengan filter Anda. Coba ubah filter atau lakukan
              transaksi baru.
            </p>
          </div>
        )
        : (
          <div className='grid gap-5'>
            {data?.items.map((item: any) => (
              <Card
                key={item.id}
                className='bg-card border border-border/60 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-200 overflow-hidden rounded-2xl group'
              >
                <div className='p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5'>
                  {/* Left Section: Info */}
                  <div className='flex items-start gap-4'>
                    <div className='w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-sm mt-1 md:mt-0'>
                      <ShoppingBag className='w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400' />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                      <div className='flex flex-col sm:flex-row sm:items-start gap-2 md:gap-3'>
                        <div className='flex flex-col'>
                          <span className='font-bold text-foreground text-base md:text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1'>
                            {item.items?.[0]?.productNameSnapshot || item.orderNumber}
                            {(item.items?.length ?? 0) > 1 && (
                              <span className='text-sm font-normal text-muted-foreground ml-1.5'>
                                +{(item.items?.length ?? 0) - 1} lainnya
                              </span>
                            )}
                          </span>
                          {item.items?.[0]?.variantSkuSnapshot &&
                            !item.items[0].variantSkuSnapshot.startsWith('SKU-') &&
                            item.items[0].variantSkuSnapshot !== 'Default Title' && (
                            <span className='text-xs text-muted-foreground font-mono mt-0.5'>
                              {item.items[0].variantSkuSnapshot}
                            </span>
                          )}
                        </div>
                        <Badge
                          variant='outline'
                          className={`w-fit px-2.5 py-0.5 rounded-full border mt-1 sm:mt-0 ${
                            getStatusColor(item.status)
                          }`}
                        >
                          {getStatusLabel(item.status)}
                        </Badge>
                      </div>
                      <div className='flex items-center gap-2 text-xs md:text-sm text-muted-foreground mt-0.5'>
                        <span className='font-mono bg-muted/80 px-1.5 py-0.5 rounded border border-border/60/50'>
                          {item.orderNumber}
                        </span>
                        <span className='text-muted-foreground/50'>•</span>
                        <Calendar className='w-3.5 h-3.5 md:w-4 md:h-4' />
                        <span>
                          {new Date(item.createdAt).toLocaleString('id-ID', {
                            timeZone: 'Asia/Jakarta',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })} WIB
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Price & CTA */}
                  <div className='w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:gap-3 border-t md:border-t-0 border-border/40 pt-4 md:pt-0'>
                    <div className='flex flex-col md:items-end text-left md:text-right'>
                      <span className='text-[11px] md:text-xs text-muted-foreground font-medium mb-0.5'>
                        Total Belanja
                      </span>
                      <p className='font-extrabold text-lg md:text-xl text-foreground'>
                        Rp {item.totalAmount.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <Button
                      variant='default'
                      className='bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm px-4 md:px-5 py-2 h-auto text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-transform active:scale-95 whitespace-nowrap'
                      onClick={() => navigate(`/orders/${item.id}`)}
                    >
                      Lihat Detail
                      <ArrowUpRight className='w-3.5 h-3.5 md:w-4 md:h-4 opacity-80' />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Pagination */}
            {(data?.pagination?.totalPages ?? 0) > 1 && (
              <div className='flex justify-center items-center gap-3 md:gap-4 mt-8 mb-4'>
                <Button
                  variant='outline'
                  size='icon'
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className='border-border/60 text-muted-foreground hover:bg-muted/50 rounded-xl w-9 h-9 md:w-10 md:h-10'
                >
                  <ChevronLeft className='w-4 h-4 md:w-5 md:h-5' />
                </Button>
                <span className='text-xs md:text-sm font-medium text-muted-foreground bg-card border border-border/60 px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-sm'>
                  Hal <strong className='text-foreground'>{page}</strong> /{' '}
                  {data?.pagination?.totalPages}
                </span>
                <Button
                  variant='outline'
                  size='icon'
                  disabled={page === data?.pagination?.totalPages}
                  onClick={() => setPage((p) => Math.min(data?.pagination?.totalPages || 1, p + 1))}
                  className='border-border/60 text-muted-foreground hover:bg-muted/50 rounded-xl w-9 h-9 md:w-10 md:h-10'
                >
                  <ChevronRight className='w-4 h-4 md:w-5 md:h-5' />
                </Button>
              </div>
            )}
          </div>
        )}
    </div>
  );
};
