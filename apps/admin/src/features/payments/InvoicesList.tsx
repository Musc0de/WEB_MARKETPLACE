import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.ts';
import { formatDate, formatIDR, toast } from '@starsuperscare/ui';
import { FileText, Mail, ExternalLink, Send } from 'lucide-react';
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

type InvStatus = 'all' | 'paid' | 'unpaid' | 'overdue';

const STATUS_TABS: { key: InvStatus; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'paid', label: 'Lunas' },
  { key: 'unpaid', label: 'Belum Bayar' },
  { key: 'overdue', label: 'Jatuh Tempo' },
];

const TABLE_HEADERS = [
  { label: 'Invoice #' },
  { label: 'Order' },
  { label: 'Diterbitkan' },
  { label: 'Jatuh Tempo' },
  { label: 'Jumlah', right: true },
  { label: 'Status' },
  { label: 'Aksi' },
];

export function InvoicesList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvStatus>('all');
  const limit = 10;
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'invoices', { page, limit }],
    queryFn: () => {
      const q = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      return api.get('/admin/payments/invoices?' + q.toString());
    },
  });

  const resendInvoice = useMutation({
    mutationFn: (id: string) => api.post(`/admin/payments/invoices/${id}/resend`, {}),
    onSuccess: () => {
      toast.success('Invoice berhasil dikirim ulang ke email pelanggan');
      qc.invalidateQueries({ queryKey: ['admin', 'invoices'] });
    },
    onError: () => toast.error('Gagal mengirim ulang invoice'),
  });

  const allInvoices: any[] = data?.data ?? [];
  const total: number = data?.total ?? 0;

  const filtered = allInvoices.filter((inv) => {
    const matchSearch =
      !search ||
      inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      inv.orderNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className='space-y-6'>
      <PageHeader
        icon={FileText}
        title='Invoice'
        description='Kelola dan kirim ulang invoice pesanan kepada pelanggan.'
        badge='Billing'
        badgeColor='bg-blue-50 text-blue-700 ring-blue-600/20'
      />

      {/* Filters */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <FilterTabs<InvStatus>
          options={STATUS_TABS}
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
        />
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder='Cari No. Invoice atau Order…'
        />
      </div>

      {/* Table */}
      <div>
        <DataTable
          headers={TABLE_HEADERS}
          summary={`${filtered.length} invoice dari total ${total}`}
        >
          {isLoading ? (
            <TableSkeleton cols={7} />
          ) : !filtered.length ? (
            <tr>
              <td colSpan={7}>
                <EmptyState
                  icon={FileText}
                  title='Tidak ada invoice'
                  description='Invoice akan muncul secara otomatis setelah pesanan dibuat.'
                />
              </td>
            </tr>
          ) : (
            filtered.map((inv: any) => (
              <tr key={inv.id} className='hover:bg-blue-50/20 transition-colors'>
                <td className='px-5 py-3.5'>
                  <span className='font-mono text-sm font-bold text-gray-900'>
                    {inv.invoiceNumber || `INV-${inv.id.slice(0, 8)}`}
                  </span>
                </td>
                <td className='px-5 py-3.5'>
                  <Link
                    to={`/orders/${inv.orderId}`}
                    className='inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline'
                  >
                    {inv.orderNumber || `#${inv.orderId?.slice(0, 8)}`}
                    <ExternalLink className='h-3 w-3' />
                  </Link>
                </td>
                <td className='px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap'>{formatDate(inv.issuedAt ?? inv.createdAt)}</td>
                <td className='px-5 py-3.5'>
                  {inv.dueAt ? (
                    <span className={`text-sm ${inv.status === 'overdue' ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                      {formatDate(inv.dueAt)}
                    </span>
                  ) : <span className='text-gray-400 text-sm'>—</span>}
                </td>
                <td className='px-5 py-3.5 text-right'>
                  <span className='text-sm font-bold text-gray-900'>{formatIDR(inv.totalAmount ?? inv.amount ?? 0)}</span>
                </td>
                <td className='px-5 py-3.5'><StatusPill status={inv.status} /></td>
                <td className='px-5 py-3.5'>
                  <button
                    type='button'
                    onClick={() => resendInvoice.mutate(inv.id)}
                    disabled={resendInvoice.isPending}
                    className='inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition disabled:opacity-50'
                  >
                    {resendInvoice.isPending ? (
                      <Mail className='h-3 w-3 animate-bounce' />
                    ) : (
                      <Send className='h-3 w-3' />
                    )}
                    Kirim Ulang
                  </button>
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
