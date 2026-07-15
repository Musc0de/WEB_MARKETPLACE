import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.ts';
import { formatDate, formatIDR } from '@starsuperscare/ui';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react';
import { Pagination } from '../../components/Pagination.tsx';

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string; icon: React.ReactNode }
> = {
  pending: {
    label: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
    icon: <Clock className='w-3.5 h-3.5' />,
  },
  paid: {
    label: 'Paid',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-400',
    icon: <CheckCircle2 className='w-3.5 h-3.5' />,
  },
  processing: {
    label: 'Processing',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-400',
    icon: <RefreshCw className='w-3.5 h-3.5' />,
  },
  shipped: {
    label: 'Shipped',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    dot: 'bg-indigo-400',
    icon: <Truck className='w-3.5 h-3.5' />,
  },
  delivered: {
    label: 'Delivered',
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500',
    icon: <Package className='w-3.5 h-3.5' />,
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-400',
    icon: <XCircle className='w-3.5 h-3.5' />,
  },
  refunded: {
    label: 'Refunded',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    icon: <RefreshCw className='w-3.5 h-3.5' />,
  },
};

const ALL_STATUSES = [
  'all',
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
    icon: null,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function CustomerAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Generate consistent color from name
  const colors = [
    'bg-violet-500',
    'bg-blue-500',
    'bg-emerald-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500',
  ];
  const colorIdx = name.charCodeAt(0) % colors.length;

  return (
    <div
      className={`w-8 h-8 rounded-full ${
        colors[colorIdx]
      } flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
    >
      {initials || '?'}
    </div>
  );
}

export function OrdersList() {
  const [status, setStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', { status, page, limit }],
    queryFn: async () => {
      const q = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (status !== 'all') q.set('status', status);
      return await api.get('/admin/orders?' + q.toString());
    },
  });

  const orders: any[] = data?.data ?? [];
  const totalOrders: number = data?.total ?? 0;
  const statusCounts: Record<string, number> = data?.statusCounts ?? {};

  // Client-side search filter on order number or customer name
  const filtered = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o.orderNumber?.toLowerCase().includes(q) ||
        (o.customerName || '').toLowerCase().includes(q),
    );
  }, [orders, search]);

  // Stats — use statusCounts from API (global totals), totalOrders for 'all'
  const stats = useMemo(() => ({
    total: totalOrders,
    pending: statusCounts['pending'] ?? 0,
    processing: statusCounts['processing'] ?? 0,
    paid: statusCounts['paid'] ?? 0,
    delivered: statusCounts['delivered'] ?? 0,
    cancelled: statusCounts['cancelled'] ?? 0,
  }), [statusCounts, totalOrders]);

  return (
    <div className='space-y-5 p-4 px-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900'>Pesanan</h1>
          <p className='text-sm text-gray-500 mt-0.5'>
            Kelola dan pantau semua pesanan pelanggan.
          </p>
        </div>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <ShoppingBag className='w-4 h-4' />
          <span>{totalOrders} total pesanan</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {[
          {
            label: 'Semua Pesanan',
            value: stats.total,
            color: 'text-gray-900',
            bg: 'bg-gray-50',
            border: 'border-gray-200',
          },
          {
            label: 'Menunggu untuk dikirim',
            value: stats.processing,
            color: 'text-amber-700',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
          },
          {
            label: 'Baru Dibayar',
            value: stats.paid,
            color: 'text-emerald-700',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
          },
          {
            label: 'Terkirim',
            value: stats.delivered,
            color: 'text-blue-700',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} border ${s.border} rounded-xl p-4 flex flex-col gap-1`}
          >
            <span className='text-xs font-medium text-gray-500'>{s.label}</span>
            <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Filter + Search Bar */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
        {/* Search */}
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input
            type='text'
            placeholder='Cari nomor pesanan atau nama pelanggan...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className='w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400'
          />
        </div>

        {/* Status Pills */}
        <div className='flex flex-wrap gap-1.5'>
          {ALL_STATUSES.map((s) => {
            const isActive = s === status;
            const cfg = s === 'all' ? null : STATUS_CONFIG[s];
            return (
              <button
                key={s}
                type='button'
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? s === 'all'
                      ? 'bg-gray-900 text-white shadow-sm'
                      : `${cfg?.bg} ${cfg?.text} ring-2 ring-offset-1 ring-current`
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {s === 'all' ? 'Semua' : STATUS_CONFIG[s]?.label ?? s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm'>
        <table className='w-full'>
          <thead>
            <tr className='bg-gray-50 border-b border-gray-200'>
              {['No. Pesanan', 'Pelanggan', 'Tanggal', 'Total', 'Status', ''].map((h) => (
                <th
                  key={h}
                  className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className='animate-pulse'>
                  <td className='px-4 py-3.5'>
                    <div className='h-4 bg-gray-100 rounded w-40' />
                  </td>
                  <td className='px-4 py-3.5'>
                    <div className='h-4 bg-gray-100 rounded w-28' />
                  </td>
                  <td className='px-4 py-3.5'>
                    <div className='h-4 bg-gray-100 rounded w-20' />
                  </td>
                  <td className='px-4 py-3.5'>
                    <div className='h-4 bg-gray-100 rounded w-24' />
                  </td>
                  <td className='px-4 py-3.5'>
                    <div className='h-5 bg-gray-100 rounded-full w-20' />
                  </td>
                  <td className='px-4 py-3.5'>
                    <div className='h-8 bg-gray-100 rounded w-16' />
                  </td>
                </tr>
              ))
              : filtered.length === 0
              ? (
                <tr>
                  <td colSpan={6} className='px-4 py-16 text-center'>
                    <ShoppingBag className='w-10 h-10 text-gray-300 mx-auto mb-3' />
                    <p className='text-sm font-medium text-gray-500'>No orders found</p>
                    <p className='text-xs text-gray-400 mt-1'>
                      Try changing the filter or search term
                    </p>
                  </td>
                </tr>
              )
              : filtered.map((order: any) => {
                const customerName = order.customerName || 'Guest';
                return (
                  <tr
                    key={order.id}
                    className='hover:bg-gray-50 transition-colors group'
                  >
                    {/* Order # */}
                    <td className='px-4 py-3.5'>
                      <span className='font-mono text-sm font-semibold text-gray-800'>
                        {order.orderNumber}
                      </span>
                    </td>

                    {/* Customer — name only with avatar */}
                    <td className='px-4 py-3.5'>
                      <div className='flex items-center gap-2.5'>
                        <CustomerAvatar name={customerName} />
                        <span className='text-sm font-medium text-gray-900 truncate max-w-[160px]'>
                          {customerName}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className='px-4 py-3.5'>
                      <span className='text-sm text-gray-600'>
                        {formatDate(order.createdAt)}
                      </span>
                    </td>

                    {/* Total */}
                    <td className='px-4 py-3.5'>
                      <span className='text-sm font-semibold text-gray-800'>
                        {formatIDR(order.totalAmount)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className='px-4 py-3.5'>
                      <StatusBadge status={order.status} />
                    </td>

                    {/* Action */}
                    <td className='px-4 py-3.5'>
                      <Link
                        to={`/orders/${order.id}`}
                        className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all group-hover:shadow-sm'
                      >
                        <Eye className='w-3.5 h-3.5' />
                        View
                        <ChevronRight className='w-3 h-3 opacity-50' />
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        limit={limit}
        total={totalOrders}
        onPageChange={setPage}
      />
    </div>
  );
}
