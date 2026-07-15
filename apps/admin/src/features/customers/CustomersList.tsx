import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.ts';
import { formatDate } from '@starsuperscare/ui';
import { Link } from 'react-router-dom';
import { Search, Users, UserCheck, UserX, Eye, ChevronRight } from 'lucide-react';
import { CustomerAvatar, CustomerStatusBadge, getDisplayName } from './shared.tsx';
import { Pagination } from '../../components/Pagination.tsx';

export function CustomersList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'customers', { search, page, limit }],
    queryFn: async () => {
      const q = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (search) q.set('search', search);
      return await api.get('/admin/customers?' + q.toString());
    },
  });

  const customers: any[] = data?.data ?? [];
  const totalCustomers: number = data?.total ?? 0;
  const statusCounts: Record<string, number> = data?.statusCounts ?? {};

  // Client-side status filter
  const filtered = useMemo(() => {
    if (statusFilter === 'all') return customers;
    return customers.filter((c) => c.status === statusFilter);
  }, [customers, statusFilter]);

  // Stats — use statusCounts from API for accurate global totals
  const stats = useMemo(() => ({
    total: totalCustomers,
    active:   statusCounts['active']   ?? 0,
    inactive: statusCounts['inactive'] ?? customers.filter((c) => c.status !== 'active').length,
  }), [statusCounts, totalCustomers, customers]);

  return (
    <div className='space-y-5 p-4 px-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900'>Customers</h1>
          <p className='text-sm text-gray-500 mt-0.5'>Manage and view your store's customers.</p>
        </div>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <Users className='w-4 h-4' />
          <span>{totalCustomers} total</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-3 gap-4'>
        {[
          { label: 'Semua Pelanggan', value: totalCustomers, icon: <Users className='w-5 h-5' />,     bg: 'bg-gray-50',    border: 'border-gray-200',   text: 'text-gray-900' },
          { label: 'Aktif',          value: stats.active,   icon: <UserCheck className='w-5 h-5' />, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
          { label: 'Tidak Aktif',    value: stats.inactive, icon: <UserX className='w-5 h-5' />,     bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 flex items-center gap-4`}>
            <div className={`${s.text} opacity-60`}>{s.icon}</div>
            <div>
              <p className='text-xs font-medium text-gray-500'>{s.label}</p>
              <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input
            type='text'
            placeholder='Cari berdasarkan nama atau email...'
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className='w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400'
          />
        </div>

        <div className='flex gap-1.5'>
          {(['all', 'active', 'inactive'] as const).map((s) => (
            <button
              key={s}
              type='button'
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                statusFilter === s
                  ? s === 'active'
                    ? 'bg-emerald-600 text-white'
                    : s === 'inactive'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'all' ? 'Semua' : s === 'active' ? 'Aktif' : 'Tidak Aktif'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm'>
        <table className='w-full'>
          <thead>
            <tr className='bg-gray-50 border-b border-gray-200'>
              {['Pelanggan', 'Status', 'Bergabung', ''].map((h) => (
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
              ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className='animate-pulse'>
                  <td className='px-4 py-3.5'>
                    <div className='flex items-center gap-3'>
                      <div className='w-9 h-9 rounded-full bg-gray-100' />
                      <div className='space-y-1'>
                        <div className='h-3.5 bg-gray-100 rounded w-28' />
                        <div className='h-3 bg-gray-100 rounded w-36' />
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-3.5'><div className='h-5 bg-gray-100 rounded-full w-16' /></td>
                  <td className='px-4 py-3.5'><div className='h-4 bg-gray-100 rounded w-24' /></td>
                  <td className='px-4 py-3.5'><div className='h-8 bg-gray-100 rounded w-16' /></td>
                </tr>
              ))
              : filtered.length === 0
              ? (
                <tr>
                  <td colSpan={4} className='px-4 py-16 text-center'>
                    <Users className='w-10 h-10 text-gray-300 mx-auto mb-3' />
                    <p className='text-sm font-medium text-gray-500'>No customers found</p>
                    <p className='text-xs text-gray-400 mt-1'>Try changing your search term</p>
                  </td>
                </tr>
              )
              : filtered.map((customer: any) => {
                const name = getDisplayName(customer.firstName, customer.lastName);
                return (
                  <tr key={customer.id} className='hover:bg-gray-50 transition-colors group'>
                    {/* Customer */}
                    <td className='px-4 py-3.5'>
                      <div className='flex items-center gap-3'>
                        <CustomerAvatar
                          firstName={customer.firstName}
                          lastName={customer.lastName}
                          email={customer.email}
                        />
                        <div className='min-w-0'>
                          <p className='text-sm font-semibold text-gray-900 truncate'>{name}</p>
                          <p className='text-xs text-gray-400 truncate'>{customer.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className='px-4 py-3.5'>
                      <CustomerStatusBadge status={customer.status} />
                    </td>

                    {/* Joined */}
                    <td className='px-4 py-3.5'>
                      <span className='text-sm text-gray-600'>{formatDate(customer.createdAt)}</span>
                    </td>

                    {/* Action */}
                    <td className='px-4 py-3.5'>
                      <Link
                        to={`/customers/${customer.id}`}
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
        total={totalCustomers}
        onPageChange={setPage}
      />
    </div>
  );
}

