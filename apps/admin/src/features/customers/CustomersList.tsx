import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.ts';
import { formatDate } from '@starsuperscare/ui';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Edit2,
  Eye,
  Search,
  Trash2,
  UserCheck,
  Users,
  UserX,
  X,
} from 'lucide-react';
import { CustomerAvatar, CustomerStatusBadge, getDisplayName } from './shared.tsx';
import { Pagination } from '../../components/Pagination.tsx';
import { goeyToast as toast } from 'goey-toast';

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
    <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0'>
            <AlertTriangle className='w-5 h-5 text-red-600' />
          </div>
          <div>
            <p className='text-sm font-semibold text-gray-900'>Hapus {count} Pengguna?</p>
            <p className='text-xs text-gray-500 mt-0.5'>Aksi ini tidak dapat dibatalkan.</p>
          </div>
        </div>
        <div className='flex gap-2 mt-4'>
          <button
            type='button'
            onClick={onCancel}
            disabled={isDeleting}
            className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all'
          >
            Batal
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={isDeleting}
            className='flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all disabled:opacity-60'
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ roleName }: { roleName: string | null }) {
  const name = roleName || 'Customer';
  const slug = name.toLowerCase();

  let bg = 'bg-gray-100 text-gray-700'; // Default
  if (slug.includes('super admin')) bg = 'bg-red-100 text-red-700';
  else if (slug === 'admin') bg = 'bg-violet-100 text-violet-700';
  else if (slug === 'staff') bg = 'bg-blue-100 text-blue-700';
  else if (slug === 'support') bg = 'bg-amber-100 text-amber-700';
  else if (slug === 'customer') bg = 'bg-emerald-100 text-emerald-700';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${bg}`}>
      {name}
    </span>
  );
}

function EditCustomerModal({
  customer,
  onClose,
  roles,
}: {
  customer: any;
  onClose: () => void;
  roles: any[];
}) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState(customer.status);
  const [roleId, setRoleId] = useState(customer.roleId || '');
  const [isSaving, setIsSaving] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/admin/customers/${customer.id}`, { status, roleId: roleId || null });
    },
    onSuccess: () => {
      toast.success('Pengguna berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      onClose();
    },
    onError: () => toast.error('Gagal memperbarui pengguna'),
    onSettled: () => setIsSaving(false),
  });

  return (
    <div className='fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden'>
        <div className='flex items-center justify-between p-5 border-b border-gray-100'>
          <h2 className='text-lg font-bold text-gray-900'>Edit Pengguna</h2>
          <button
            type='button'
            onClick={onClose}
            className='p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100'
          >
            <X className='w-5 h-5' />
          </button>
        </div>
        <div className='p-6 space-y-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>Role / Peran</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className='w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm'
            >
              <option value=''>-- Customer (Tanpa Role) --</option>
              {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className='w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm'
            >
              <option value='active'>Active</option>
              <option value='suspended'>Suspended</option>
              <option value='blocked'>Blocked</option>
            </select>
          </div>
        </div>
        <div className='p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900'
          >
            Batal
          </button>
          <button
            type='button'
            onClick={() => {
              setIsSaving(true);
              saveMutation.mutate();
            }}
            disabled={isSaving}
            className='px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50'
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CustomersList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'blocked'>(
    'all',
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editCustomer, setEditCustomer] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'customers', { search, page, limit }],
    queryFn: async () => {
      const q = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (search) q.set('search', search);
      return await api.get('/admin/customers?' + q.toString());
    },
  });

  const { data: rolesData } = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: async () => await api.get('/admin/customers/roles'),
  });
  const roles = rolesData?.data || [];

  const bulkDeleteMutation = useMutation({
    mutationFn: async () => {
      await api.post('/admin/customers/bulk-delete', { ids: Array.from(selectedIds) });
    },
    onSuccess: () => {
      toast.success(`${selectedIds.size} pengguna berhasil dihapus`);
      setSelectedIds(new Set());
      setShowDeleteConfirm(false);
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
    },
    onError: () => toast.error('Gagal menghapus pengguna'),
  });

  const customers: any[] = data?.data ?? [];
  const totalCustomers: number = data?.total ?? 0;
  const statusCounts: Record<string, number> = data?.statusCounts ?? {};

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return customers;
    return customers.filter((c) => c.status === statusFilter);
  }, [customers, statusFilter]);

  const stats = useMemo(() => ({
    total: totalCustomers,
    active: statusCounts['active'] ?? 0,
    suspended: statusCounts['suspended'] ?? 0,
    blocked: statusCounts['blocked'] ?? 0,
  }), [statusCounts, totalCustomers]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((c) => c.id)));
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
      {editCustomer && (
        <EditCustomerModal
          customer={editCustomer}
          onClose={() => setEditCustomer(null)}
          roles={roles}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          count={selectedIds.size}
          isDeleting={bulkDeleteMutation.isPending}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => bulkDeleteMutation.mutate()}
        />
      )}

      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900'>Pengguna</h1>
          <p className='text-sm text-gray-500 mt-0.5'>
            Kelola pengguna, status, dan perannya di sistem.
          </p>
        </div>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <Users className='w-4 h-4' />
          <span>{totalCustomers} total</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-4 gap-4'>
        {[
          {
            label: 'Semua',
            value: totalCustomers,
            icon: <Users className='w-5 h-5' />,
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            text: 'text-gray-900',
          },
          {
            label: 'Aktif',
            value: stats.active,
            icon: <UserCheck className='w-5 h-5' />,
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-700',
          },
          {
            label: 'Ditangguhkan',
            value: stats.suspended,
            icon: <UserX className='w-5 h-5' />,
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            text: 'text-orange-700',
          },
          {
            label: 'Diblokir',
            value: stats.blocked,
            icon: <UserX className='w-5 h-5' />,
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

      {/* Search & Bulk Actions */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-h-[44px]'>
        {selectedIds.size > 0
          ? (
            <div className='flex items-center gap-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl w-full sm:w-auto'>
              <span className='text-sm font-semibold text-blue-700'>
                {selectedIds.size} terpilih
              </span>
              <div className='h-4 w-px bg-blue-200' />
              <button
                type='button'
                onClick={() => setShowDeleteConfirm(true)}
                className='text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5'
              >
                <Trash2 className='w-4 h-4' />
                Hapus
              </button>
              <button
                type='button'
                onClick={() => setSelectedIds(new Set())}
                className='ml-auto sm:ml-0 text-sm text-gray-500 hover:text-gray-700 font-medium'
              >
                Batal
              </button>
            </div>
          )
          : (
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full'>
              <div className='relative flex-1 max-w-sm'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Cari nama atau email...'
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className='w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div className='flex gap-1.5 overflow-x-auto pb-1 sm:pb-0'>
                {(['all', 'active', 'suspended', 'blocked'] as const).map((s) => (
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
                          : 'bg-red-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {s === 'all' ? 'Semua' : s === 'active' ? 'Aktif' : s}
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Table */}
      <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[700px]'>
            <thead>
              <tr className='bg-gray-50 border-b border-gray-200'>
                <th className='px-4 py-3 text-left w-10'>
                  <input
                    type='checkbox'
                    checked={filtered.length > 0 && selectedIds.size === filtered.length}
                    onChange={toggleSelectAll}
                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer'
                  />
                </th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  Pelanggan
                </th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  Peran / Role
                </th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  Bergabung
                </th>
                <th className='px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  Aksi
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
                : filtered.length === 0
                ? (
                  <tr>
                    <td colSpan={6} className='px-4 py-16 text-center'>
                      <Users className='w-10 h-10 text-gray-300 mx-auto mb-3' />
                      <p className='text-sm font-medium text-gray-500'>
                        Tidak ada pengguna ditemukan
                      </p>
                    </td>
                  </tr>
                )
                : (
                  filtered.map((customer: any) => {
                    const name = getDisplayName(customer.firstName, customer.lastName);
                    return (
                      <tr
                        key={customer.id}
                        className={`hover:bg-gray-50 transition-colors group ${
                          selectedIds.has(customer.id) ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <td className='px-4 py-3.5'>
                          <input
                            type='checkbox'
                            checked={selectedIds.has(customer.id)}
                            onChange={() => toggleSelect(customer.id)}
                            className='rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer'
                          />
                        </td>
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
                        <td className='px-4 py-3.5'>
                          <RoleBadge roleName={customer.roleName} />
                        </td>
                        <td className='px-4 py-3.5'>
                          <CustomerStatusBadge status={customer.status} />
                        </td>
                        <td className='px-4 py-3.5 text-sm text-gray-600'>
                          {formatDate(customer.createdAt)}
                        </td>
                        <td className='px-4 py-3.5 text-right'>
                          <div className='flex items-center justify-end gap-2'>
                            <button
                              type='button'
                              onClick={() => setEditCustomer(customer)}
                              className='p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors'
                              title='Edit Pengguna'
                            >
                              <Edit2 className='w-4 h-4' />
                            </button>
                            <Link
                              to={`/customers/${customer.id}`}
                              className='p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors'
                              title='Lihat Detail'
                            >
                              <Eye className='w-4 h-4' />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} limit={limit} total={totalCustomers} onPageChange={setPage} />
    </div>
  );
}
