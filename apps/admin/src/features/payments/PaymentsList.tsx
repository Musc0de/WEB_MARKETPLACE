import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.ts';
import { formatDate, formatIDR } from '@starsuperscare/ui';
import { CreditCard, ExternalLink } from 'lucide-react';
import {
  PageHeader,
  SearchBar,
  StatusPill,
  DataTable,
  TableSkeleton,
  EmptyState,
  FilterTabs,
  Pagination,
} from '../../components/admin-ui.tsx';

type PayStatus = 'all' | 'paid' | 'pending' | 'failed' | 'refunded';

const STATUS_TABS: { key: PayStatus; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'paid', label: 'Berhasil' },
  { key: 'pending', label: 'Menunggu' },
  { key: 'failed', label: 'Gagal' },
  { key: 'refunded', label: 'Direfund' },
];

const TABLE_HEADERS = [
  { label: 'Tanggal' },
  { label: 'Order' },
  { label: 'Provider' },
  { label: 'Transaction ID' },
  { label: 'Jumlah', right: true },
  { label: 'Status' },
];

const PROVIDER_ICON: Record<string, string> = {
  midtrans: '🏦',
  xendit: '💳',
  bank_transfer: '🏧',
  gopay: '🟢',
  ovo: '🟣',
  dana: '🔵',
};

export function PaymentsList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PayStatus>('all');
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'payments', { page, limit }],
    queryFn: () => {
      const q = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      return api.get('/admin/payments/payments?' + q.toString());
    },
  });

  const allPayments: any[] = data?.data ?? [];

  const filtered = allPayments.filter((p) => {
    const matchSearch =
      !search ||
      p.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      p.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      p.providerTransactionId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total: number = data?.total ?? 0;

  return (
    <div className='space-y-6'>
      <PageHeader
        icon={CreditCard}
        title='Pembayaran'
        description='Monitor semua transaksi pembayaran dari pelanggan.'
        badge='Keuangan'
        badgeColor='bg-green-50 text-green-700 ring-green-600/20'
      />

      {/* Filters */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <FilterTabs<PayStatus>
          options={STATUS_TABS}
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
        />
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder='Cari Order, No. Transaksi…'
        />
      </div>

      {/* Stats bar */}
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        {[
          { label: 'Total Transaksi', value: total, color: 'text-gray-900' },
          { label: 'Berhasil', value: allPayments.filter((p) => p.status === 'paid').length, color: 'text-emerald-600' },
          { label: 'Menunggu', value: allPayments.filter((p) => p.status === 'pending').length, color: 'text-amber-600' },
          { label: 'Gagal', value: allPayments.filter((p) => p.status === 'failed').length, color: 'text-red-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className='rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm'>
            <p className='text-xs font-medium text-gray-500'>{label}</p>
            <p className={`text-2xl font-black tabular-nums ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div>
        <DataTable headers={TABLE_HEADERS}>
          {isLoading ? (
            <TableSkeleton cols={6} />
          ) : !filtered.length ? (
            <tr>
              <td colSpan={6}>
                <EmptyState
                  icon={CreditCard}
                  title='Tidak ada pembayaran'
                  description='Transaksi akan muncul di sini setelah pelanggan melakukan pembayaran.'
                />
              </td>
            </tr>
          ) : (
            filtered.map((payment: any) => (
              <tr key={payment.id} className='hover:bg-green-50/20 transition-colors'>
                <td className='px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap'>{formatDate(payment.createdAt)}</td>
                <td className='px-5 py-3.5'>
                  <Link
                    to={`/orders/${payment.orderId}`}
                    className='inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline'
                  >
                    {payment.orderNumber || `#${payment.orderId?.slice(0, 8)}`}
                    <ExternalLink className='h-3 w-3' />
                  </Link>
                </td>
                <td className='px-5 py-3.5'>
                  <span className='inline-flex items-center gap-1.5 text-sm text-gray-700 font-medium'>
                    {PROVIDER_ICON[payment.provider] ?? '💰'}
                    <span className='capitalize'>{payment.provider?.replace('_', ' ')}</span>
                  </span>
                </td>
                <td className='px-5 py-3.5'>
                  <span className='font-mono text-xs text-gray-400'>{payment.providerTransactionId || '—'}</span>
                </td>
                <td className='px-5 py-3.5 text-right'>
                  <span className='text-sm font-bold text-gray-900'>{formatIDR(payment.amount)}</span>
                </td>
                <td className='px-5 py-3.5'>
                  <StatusPill status={payment.status} />
                </td>
              </tr>
            ))
          )}
        </DataTable>
        <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
      </div>
    </div>
  );
}
