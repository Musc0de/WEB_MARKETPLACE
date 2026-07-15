import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { formatIDR } from '@starsuperscare/ui';
import { ArrowRight, Bell, CreditCard, Package, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSession } from '../auth/useSession.ts';

const fetchHomeSummary = async () => {
  const res = await client.v1.dashboard.home.$get();
  if (!res.ok) throw new Error('Gagal memuat ringkasan dashboard');
  const result = await res.json();
  return result.data;
};

export function DashboardHome() {
  const { session } = useSession();
  const { data, error, isLoading } = useSWR('/api/v1/dashboard/home', fetchHomeSummary);

  if (isLoading) {
    return (
      <div className='flex flex-col gap-6 animate-pulse'>
        <div className='h-8 bg-gray-200 rounded w-1/4'></div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {[1, 2, 3, 4].map((i) => <div key={i} className='h-32 bg-gray-200 rounded-lg'></div>)}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='rounded-lg bg-red-50 p-4'>
        <h3 className='text-sm font-medium text-red-800'>Gagal memuat dashboard</h3>
        <p className='mt-2 text-sm text-red-700'>Silakan coba muat ulang halaman.</p>
      </div>
    );
  }

  const { summary, latestOrders } = data;

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Ringkasan Akun</h1>
        <p className='text-gray-500'>
          Selamat datang kembali, {session?.user?.username || 'Pengguna'}
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {/* Active Orders */}
        <div className='rounded-xl border bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium text-gray-500'>Pesanan Aktif</p>
            <Package className='h-5 w-5 text-blue-600' />
          </div>
          <p className='mt-2 text-3xl font-bold text-gray-900'>{summary.activeOrders}</p>
        </div>

        {/* Total Purchases */}
        <div className='rounded-xl border bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium text-gray-500'>Total Pembelian</p>
            <ShoppingBag className='h-5 w-5 text-green-600' />
          </div>
          <p className='mt-2 text-2xl font-bold text-gray-900'>
            {formatIDR(summary.totalPurchases)}
          </p>
        </div>

        {/* Unread Notifications */}
        <div className='rounded-xl border bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium text-gray-500'>Notifikasi Baru</p>
            <Bell
              className={`h-5 w-5 ${
                summary.unreadNotifications > 0 ? 'text-orange-500' : 'text-gray-400'
              }`}
            />
          </div>
          <p className='mt-2 text-3xl font-bold text-gray-900'>{summary.unreadNotifications}</p>
        </div>

        {/* Unpaid Invoices */}
        <div className='rounded-xl border bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium text-gray-500'>Tagihan Belum Dibayar</p>
            <CreditCard
              className={`h-5 w-5 ${summary.hasUnpaidInvoices ? 'text-red-600' : 'text-gray-400'}`}
            />
          </div>
          <p
            className={`mt-2 text-xl font-bold ${
              summary.hasUnpaidInvoices ? 'text-red-600' : 'text-gray-900'
            }`}
          >
            {summary.hasUnpaidInvoices ? 'Perlu Perhatian' : 'Aman'}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='rounded-xl border bg-white shadow-sm overflow-hidden'>
          <div className='border-b px-6 py-4 flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-900'>Pesanan Terakhir</h2>
            <Link
              to='/orders'
              className='text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center gap-1'
            >
              Lihat Semua
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
          <div className='divide-y'>
            {latestOrders.length > 0
              ? (
                latestOrders.map((order: any) => (
                  <div key={order.id} className='px-6 py-4 flex items-center justify-between'>
                    <div>
                      <p className='font-medium text-gray-900'>{order.orderNumber}</p>
                      <p className='text-sm text-gray-500'>
                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-medium text-gray-900'>{formatIDR(order.totalAmount)}</p>
                      <p className='text-sm capitalize text-blue-600'>{order.status}</p>
                    </div>
                  </div>
                ))
              )
              : (
                <div className='px-6 py-8 text-center text-gray-500'>
                  Belum ada pesanan aktif.
                </div>
              )}
          </div>
        </div>

        <div className='rounded-xl border bg-blue-50 p-6 shadow-sm flex flex-col items-center justify-center text-center'>
          <h2 className='text-lg font-bold text-blue-900 mb-2'>Temukan Produk Baru</h2>
          <p className='text-blue-700 mb-6'>Jelajahi koleksi terbaru dari StarSuperScare</p>
          <a
            href='http://shop.starsuperscare.net:5173/'
            className='px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors'
          >
            Mulai Belanja
          </a>
        </div>
      </div>
    </div>
  );
}
