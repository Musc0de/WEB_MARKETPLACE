import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.ts';
import { goeyToast as toast } from 'goey-toast';
import { CheckCircle2, Clock, Plus, Search, Ticket, Trash2, XCircle } from 'lucide-react';
import { formatDate } from '@starsuperscare/ui';
import { GenerateVoucherModal } from './GenerateVoucherModal.tsx';

function ConfirmDialog({
  count,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className='fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden'>
        <div className='p-6'>
          <div className='w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto'>
            <Trash2 className='w-6 h-6 text-red-600' />
          </div>
          <h2 className='text-xl font-bold text-gray-900 text-center mb-2'>
            Hapus {count} Voucher?
          </h2>
          <p className='text-sm text-gray-500 text-center'>
            Voucher yang dihapus tidak bisa dikembalikan. Pengguna tidak akan bisa lagi menggunakan
            voucher ini.
          </p>
        </div>
        <div className='p-5 border-t border-gray-100 bg-gray-50 flex gap-3'>
          <button
            type='button'
            onClick={onCancel}
            disabled={isDeleting}
            className='flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50'
          >
            Batal
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={isDeleting}
            className='flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50'
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}

function VoucherStatusBadge({ status }: { status: string }) {
  let bg = 'bg-gray-100 text-gray-700';
  let Icon = Ticket;

  if (status === 'active') {
    bg = 'bg-emerald-100 text-emerald-700';
    Icon = CheckCircle2;
  } else if (status === 'inactive') {
    bg = 'bg-amber-100 text-amber-700';
    Icon = Clock;
  } else if (status === 'expired') {
    bg = 'bg-red-100 text-red-700';
    Icon = XCircle;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold capitalize ${bg}`}
    >
      <Icon className='w-3 h-3' />
      {status}
    </span>
  );
}

export function VouchersList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>(
    'all',
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'vouchers', { search, page, statusFilter }],
    queryFn: async () => {
      const q = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (search) q.set('search', search);
      if (statusFilter !== 'all') q.set('status', statusFilter);
      return await api.get('/admin/vouchers?' + q.toString());
    },
  });

  const vouchers: any[] = data?.data ?? [];
  const totalItems: number = data?.total ?? 0;
  const statusCounts: Record<string, number> = data?.statusCounts ?? {};

  const stats = useMemo(() => ({
    active: statusCounts['active'] ?? 0,
    inactive: statusCounts['inactive'] ?? 0,
    expired: statusCounts['expired'] ?? 0,
    total: Object.values(statusCounts).reduce((a, b) => a + b, 0),
  }), [statusCounts]);

  const bulkDeleteMutation = useMutation({
    mutationFn: async () => {
      await api.post('/admin/vouchers/bulk-delete', { ids: Array.from(selectedIds) });
    },
    onSuccess: () => {
      toast.success(`${selectedIds.size} voucher berhasil dihapus`);
      setSelectedIds(new Set());
      setShowConfirm(false);
      queryClient.invalidateQueries({ queryKey: ['admin', 'vouchers'] });
    },
    onError: () => toast.error('Gagal menghapus voucher'),
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === vouchers.length && vouchers.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(vouchers.map((v) => v.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className='space-y-5 p-4 px-6 relative'>
      {showConfirm && (
        <ConfirmDialog
          count={selectedIds.size}
          isDeleting={bulkDeleteMutation.isPending}
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => bulkDeleteMutation.mutate()}
        />
      )}

      {showGenerateModal && <GenerateVoucherModal onClose={() => setShowGenerateModal(false)} />}

      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900'>Voucher</h1>
          <p className='text-sm text-gray-500 mt-0.5'>
            Kelola dan buat voucher diskon untuk pelanggan.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-1.5 text-sm text-gray-500'>
            <Ticket className='w-4 h-4' />
            <span>{stats.total} total</span>
          </div>
          <button
            type='button'
            onClick={() => setShowGenerateModal(true)}
            className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm'
          >
            <Plus className='w-4 h-4' />
            Generate Voucher
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-4 gap-4'>
        {[
          {
            label: 'Semua',
            value: stats.total,
            icon: <Ticket className='w-5 h-5' />,
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            text: 'text-gray-900',
          },
          {
            label: 'Active',
            value: stats.active,
            icon: <CheckCircle2 className='w-5 h-5' />,
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-700',
          },
          {
            label: 'Inactive',
            value: stats.inactive,
            icon: <Clock className='w-5 h-5' />,
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-700',
          },
          {
            label: 'Expired',
            value: stats.expired,
            icon: <XCircle className='w-5 h-5' />,
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-700',
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} border ${s.border} rounded-xl p-4 flex items-center gap-4`}
          >
            <div className={`${s.text} opacity-60`}>{s.icon}</div>
            <div>
              <p className='text-xs font-medium text-gray-500'>{s.label}</p>
              <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className='flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3'>
          <div className='flex items-center gap-2 text-sm text-red-700'>
            <span className='font-semibold'>{selectedIds.size} voucher dipilih</span>
            <span className='text-red-400'>·</span>
            <button
              type='button'
              onClick={() => setSelectedIds(new Set())}
              className='text-xs text-red-500 hover:underline'
            >
              Batalkan pilihan
            </button>
          </div>
          <button
            type='button'
            onClick={() => setShowConfirm(true)}
            className='inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all shadow-sm'
          >
            <Trash2 className='w-4 h-4' />
            Hapus {selectedIds.size} Voucher
          </button>
        </div>
      )}

      {/* Search & Filter */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-h-[44px]'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full'>
          <div className='relative flex-1 max-w-sm'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              placeholder='Cari kode atau deskripsi...'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className='w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div className='flex gap-1.5 overflow-x-auto pb-1 sm:pb-0'>
            {(['all', 'active', 'inactive', 'expired'] as const).map((s) => (
              <button
                key={s}
                type='button'
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize whitespace-nowrap ${
                  statusFilter === s
                    ? s === 'active'
                      ? 'bg-emerald-600 text-white'
                      : s === 'all'
                      ? 'bg-gray-900 text-white'
                      : s === 'inactive'
                      ? 'bg-amber-500 text-white'
                      : 'bg-red-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s === 'all' ? 'Semua' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[800px]'>
            <thead>
              <tr className='bg-gray-50 border-b border-gray-200'>
                <th className='px-4 py-3 text-left w-10'>
                  <input
                    type='checkbox'
                    checked={vouchers.length > 0 && selectedIds.size === vouchers.length}
                    onChange={toggleSelectAll}
                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer'
                  />
                </th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  Kode Voucher
                </th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  Deskripsi
                </th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  Diskon
                </th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  Dibuat
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {isLoading
                ? (
                  <tr>
                    <td colSpan={6} className='p-8 text-center text-gray-500'>Memuat data...</td>
                  </tr>
                )
                : vouchers.length === 0
                ? (
                  <tr>
                    <td colSpan={6} className='px-4 py-16 text-center'>
                      <Ticket className='w-10 h-10 text-gray-300 mx-auto mb-3' />
                      <p className='text-sm font-medium text-gray-500'>
                        Tidak ada voucher ditemukan
                      </p>
                    </td>
                  </tr>
                )
                : (
                  vouchers.map((v) => (
                    <tr
                      key={v.id}
                      className={`hover:bg-gray-50 transition-colors group ${
                        selectedIds.has(v.id) ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <td className='px-4 py-3.5'>
                        <input
                          type='checkbox'
                          checked={selectedIds.has(v.id)}
                          onChange={() => toggleSelect(v.id)}
                          className='rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer'
                        />
                      </td>
                      <td className='px-4 py-3.5'>
                        <span className='font-mono text-sm font-semibold text-gray-900'>
                          {v.code}
                        </span>
                        <p className='text-xs text-gray-500 mt-1'>
                          Digunakan: {v.currentUses} / {v.maxUses ? v.maxUses : '∞'}
                        </p>
                      </td>
                      <td className='px-4 py-3.5'>
                        <p className='text-sm text-gray-700'>{v.description || '-'}</p>
                      </td>
                      <td className='px-4 py-3.5'>
                        <span className='text-sm font-semibold text-gray-900'>
                          {v.discountType === 'percentage'
                            ? `${v.discountAmount}%`
                            : `Rp ${v.discountAmount.toLocaleString()}`}
                        </span>
                      </td>
                      <td className='px-4 py-3.5'>
                        <VoucherStatusBadge status={v.status} />
                      </td>
                      <td className='px-4 py-3.5 text-sm text-gray-600'>
                        {formatDate(v.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50'>
          <p className='text-sm text-gray-500'>
            Menampilkan <span className='font-medium'>{(page - 1) * limit + 1}</span> hingga{' '}
            <span className='font-medium'>{Math.min(page * limit, totalItems)}</span> dari{' '}
            <span className='font-medium'>{totalItems}</span> voucher
          </p>
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className='px-3 py-1 text-sm font-medium border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50'
            >
              Sebelumnya
            </button>
            <button
              type='button'
              onClick={() => setPage((p) => p + 1)}
              disabled={page * limit >= totalItems}
              className='px-3 py-1 text-sm font-medium border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50'
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
