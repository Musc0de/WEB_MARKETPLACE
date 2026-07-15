import { useState } from 'react';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import { client } from '../../lib/rpc.ts';
import { formatDate } from '@starsuperscare/ui';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, HeadphonesIcon } from 'lucide-react';
import {
  DataTable,
  EmptyState,
  FilterTabs,
  PageHeader,
  SearchBar,
  StatusPill,
  TableSkeleton,
} from '../../components/admin-ui.tsx';

type SupportStatus = 'all' | 'open' | 'in_progress' | 'resolved' | 'closed';

const STATUS_TABS: { key: SupportStatus; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'open', label: 'Terbuka' },
  { key: 'in_progress', label: 'Diproses' },
  { key: 'resolved', label: 'Selesai' },
  { key: 'closed', label: 'Ditutup' },
];

const TABLE_HEADERS = [
  { label: 'Tiket ID' },
  { label: 'Subjek' },
  { label: 'Kategori' },
  { label: 'Prioritas' },
  { label: 'Status' },
  { label: 'Tanggal' },
  { label: '' },
];

const PRIORITY_ICON: Record<string, React.ReactNode> = {
  urgent: <AlertTriangle className='h-3.5 w-3.5 text-red-500' />,
  high: <AlertTriangle className='h-3.5 w-3.5 text-amber-500' />,
  normal: <Clock className='h-3.5 w-3.5 text-blue-500' />,
  low: <CheckCircle2 className='h-3.5 w-3.5 text-gray-400' />,
};

export const SupportQueueList = () => {
  const [statusFilter, setStatusFilter] = useState<SupportStatus>('all');
  const [search, setSearch] = useState('');

  const { data: tickets, isLoading } = useSWR(
    ['/api/admin/support/tickets', statusFilter],
    async () => {
      const query = statusFilter !== 'all' ? { status: statusFilter } : {};
      const res = await (client.v1.admin as any).support.tickets.$get({ query });
      if (!res.ok) throw new Error('Failed to load tickets');
      const json = await res.json();
      return json.data ?? [];
    },
  );

  // Stats
  const allTickets: any[] = tickets ?? [];
  const openCount = allTickets.filter((t) => t.status === 'open').length;
  const inProgressCount = allTickets.filter((t) => t.status === 'in_progress').length;
  const urgentCount = allTickets.filter((t) => t.priority === 'urgent').length;

  const filtered = allTickets.filter((t) => {
    if (!search) return true;
    return (
      t.subject?.toLowerCase().includes(search.toLowerCase()) ||
      t.id?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className='space-y-6'>
      <PageHeader
        icon={HeadphonesIcon}
        title='Antrian Support'
        description='Kelola tiket bantuan dan pertanyaan dari pelanggan.'
        badge='Customer Service'
        badgeColor='bg-rose-50 text-rose-700 ring-rose-600/20'
      />

      {/* Quick stats */}
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        {[
          {
            label: 'Total Tiket',
            value: allTickets.length,
            icon: HeadphonesIcon,
            color: 'text-gray-900',
            iconColor: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            label: 'Terbuka',
            value: openCount,
            icon: Clock,
            color: 'text-blue-700',
            iconColor: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            label: 'Diproses',
            value: inProgressCount,
            icon: CheckCircle2,
            color: 'text-amber-700',
            iconColor: 'text-amber-600',
            bg: 'bg-amber-50',
          },
          {
            label: 'Darurat',
            value: urgentCount,
            icon: AlertTriangle,
            color: 'text-red-700',
            iconColor: 'text-red-600',
            bg: 'bg-red-50',
          },
        ].map(({ label, value, icon: Icon, color, iconColor, bg }) => (
          <div
            key={label}
            className='flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm'
          >
            <span
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${bg}`}
            >
              <Icon className={`h-4 w-4 ${iconColor}`} />
            </span>
            <div>
              <p className='text-xs font-medium text-gray-500'>{label}</p>
              <p className={`text-xl font-black ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <FilterTabs<SupportStatus>
          options={STATUS_TABS}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder='Cari subjek, kategori, atau ID tiket…'
        />
      </div>

      {/* Table */}
      <DataTable
        headers={TABLE_HEADERS}
        summary={`${filtered.length} tiket ditemukan`}
      >
        {isLoading ? <TableSkeleton cols={7} /> : !filtered.length
          ? (
            <tr>
              <td colSpan={7}>
                <EmptyState
                  icon={HeadphonesIcon}
                  title='Tidak ada tiket support'
                  description='Semua tiket bantuan pelanggan akan muncul di sini.'
                />
              </td>
            </tr>
          )
          : (
            filtered.map((ticket: any) => (
              <tr key={ticket.id} className='hover:bg-rose-50/20 transition-colors'>
                <td className='px-5 py-3.5'>
                  <Link
                    to={`/support/${ticket.id}`}
                    className='font-mono text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline'
                  >
                    #{ticket.id.slice(0, 8)}
                  </Link>
                </td>
                <td className='px-5 py-3.5 max-w-xs'>
                  <Link
                    to={`/support/${ticket.id}`}
                    className='text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-1 hover:underline'
                  >
                    {ticket.subject}
                  </Link>
                </td>
                <td className='px-5 py-3.5'>
                  <span className='inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 capitalize'>
                    {ticket.category}
                  </span>
                </td>
                <td className='px-5 py-3.5'>
                  <span className='inline-flex items-center gap-1 text-xs font-semibold capitalize text-gray-700'>
                    {PRIORITY_ICON[ticket.priority] ?? (
                      <Clock className='h-3.5 w-3.5 text-gray-400' />
                    )}
                    {ticket.priority}
                  </span>
                </td>
                <td className='px-5 py-3.5'>
                  <StatusPill status={ticket.status} />
                </td>
                <td className='px-5 py-3.5 text-sm text-gray-400 whitespace-nowrap'>
                  {formatDate(ticket.createdAt)}
                </td>
                <td className='px-5 py-3.5'>
                  <Link
                    to={`/support/${ticket.id}`}
                    className='inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition'
                  >
                    Balas <ArrowRight className='h-3 w-3' />
                  </Link>
                </td>
              </tr>
            ))
          )}
      </DataTable>
    </div>
  );
};
