import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/rpc.ts';
import { toast } from '@starsuperscare/ui';
import { RotateCcw, CheckCircle2, XCircle, PackageCheck, DollarSign } from 'lucide-react';
import {
  PageHeader,
  SearchBar,
  StatusPill,
  DataTable,
  TableSkeleton,
  EmptyState,
  FilterTabs,
} from '../../components/admin-ui.tsx';
import { ConfirmModal, InputModal, useModalState } from '../../components/modal.tsx';
import { formatDate } from '@starsuperscare/ui';

type ReturnStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'received' | 'completed';

const STATUS_TABS: { key: ReturnStatus; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Menunggu' },
  { key: 'approved', label: 'Disetujui' },
  { key: 'received', label: 'Diterima' },
  { key: 'completed', label: 'Selesai' },
  { key: 'rejected', label: 'Ditolak' },
];

const TABLE_HEADERS = [
  { label: 'ID Retur' },
  { label: 'Order ID' },
  { label: 'Resolusi' },
  { label: 'Alasan' },
  { label: 'Status' },
  { label: 'Tanggal' },
  { label: 'Aksi' },
];

export const ReturnsList = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReturnStatus>('all');

  // Modal state
  const approveModal = useModalState();
  const rejectModal = useModalState();
  const receiveModal = useModalState();
  const refundAmountModal = useModalState();
  const [activeReturnId, setActiveReturnId] = useState<string | null>(null);
  const [activeReturn, setActiveReturn] = useState<any>(null);

  const { data: returns, mutate, isLoading } = useSWR(
    '/api/v1/admin/returns',
    async () => {
      const res = await (client.v1 as any).admin.returns.$get();
      const json = await res.json();
      return json.data || [];
    },
  );

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await (client.v1 as any).admin.returns[':id'].status.$put({
        param: { id },
        json: { status },
      });
      if (res.ok) {
        toast.success(`Status retur berhasil diperbarui menjadi "${status}"`);
        mutate();
      } else {
        toast.error('Gagal memperbarui status retur');
      }
    } catch {
      toast.error('Kesalahan jaringan, coba lagi');
    }
  };

  const handleCreateRefund = async (returnItem: any, amount: number) => {
    try {
      const res = await (client.v1 as any).admin.refunds.$post({
        json: { returnId: returnItem.id, amount },
      });
      if (res.ok) {
        toast.success('Refund berhasil dibuat dan sedang diproses');
      } else {
        toast.error('Gagal membuat refund');
      }
    } catch {
      toast.error('Kesalahan jaringan, coba lagi');
    }
  };

  const filtered = returns?.filter((r: any) => {
    const matchSearch =
      !search ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.orderId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = filtered?.length ?? 0;

  return (
    <div className='space-y-6'>
      <PageHeader
        icon={RotateCcw}
        title='Retur Barang'
        description='Kelola permintaan pengembalian barang dari pelanggan.'
        badge='After Sales'
        badgeColor='bg-purple-50 text-purple-700 ring-purple-600/20'
      />

      {/* Filters */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <FilterTabs<ReturnStatus>
          options={STATUS_TABS}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder='Cari ID Retur atau Order ID…'
        />
      </div>

      {/* Table */}
      <DataTable headers={TABLE_HEADERS} summary={`${total} retur ditemukan`}>
        {isLoading ? (
          <TableSkeleton cols={7} />
        ) : !filtered?.length ? (
          <tr>
            <td colSpan={7}>
              <EmptyState
                icon={RotateCcw}
                title='Tidak ada data retur'
                description='Semua permintaan retur pelanggan akan muncul di sini.'
              />
            </td>
          </tr>
        ) : (
          filtered.map((ret: any) => (
            <tr key={ret.id} className='hover:bg-blue-50/20 transition-colors'>
              <td className='px-5 py-3.5'>
                <span className='font-mono text-sm font-semibold text-blue-600'>{ret.id.slice(0, 8)}…</span>
              </td>
              <td className='px-5 py-3.5'>
                <span className='font-mono text-sm text-gray-600'>{ret.orderId.slice(0, 8)}…</span>
              </td>
              <td className='px-5 py-3.5'>
                <span className='inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 capitalize'>
                  {ret.resolution?.replace('_', ' ')}
                </span>
              </td>
              <td className='px-5 py-3.5 text-sm text-gray-600 max-w-xs'>
                <span className='line-clamp-2'>{ret.reason || '—'}</span>
              </td>
              <td className='px-5 py-3.5'><StatusPill status={ret.status} /></td>
              <td className='px-5 py-3.5 text-sm text-gray-400'>{formatDate(ret.createdAt)}</td>
              <td className='px-5 py-3.5'>
                <div className='flex items-center gap-1.5'>
                  {ret.status === 'pending' && (
                    <>
                      <button
                        type='button'
                        onClick={() => { setActiveReturnId(ret.id); approveModal.show(); }}
                        className='inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition'
                      >
                        <CheckCircle2 className='h-3 w-3' /> Setujui
                      </button>
                      <button
                        type='button'
                        onClick={() => { setActiveReturnId(ret.id); rejectModal.show(); }}
                        className='inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition'
                      >
                        <XCircle className='h-3 w-3' /> Tolak
                      </button>
                    </>
                  )}
                  {ret.status === 'approved' && (
                    <button
                      type='button'
                      onClick={() => { setActiveReturnId(ret.id); receiveModal.show(); }}
                      className='inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition'
                    >
                      <PackageCheck className='h-3 w-3' /> Diterima
                    </button>
                  )}
                  {(ret.status === 'approved' || ret.status === 'received') && ret.resolution === 'refund' && (
                    <button
                      type='button'
                      onClick={() => { setActiveReturn(ret); refundAmountModal.show(); }}
                      className='inline-flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition'
                    >
                      <DollarSign className='h-3 w-3' /> Buat Refund
                    </button>
                  )}
                  {!['pending', 'approved', 'received'].includes(ret.status) && (
                    <span className='text-xs text-gray-400'>—</span>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </DataTable>

      {/* ── Modals ── */}
      <ConfirmModal
        open={approveModal.open}
        onClose={approveModal.hide}
        onConfirm={() => activeReturnId && handleUpdateStatus(activeReturnId, 'approved')}
        title='Setujui Retur'
        message='Pelanggan akan dinotifikasi bahwa retur mereka telah disetujui. Lanjutkan?'
        variant='success'
        confirmLabel='Ya, Setujui'
      />

      <ConfirmModal
        open={rejectModal.open}
        onClose={rejectModal.hide}
        onConfirm={() => activeReturnId && handleUpdateStatus(activeReturnId, 'rejected')}
        title='Tolak Permintaan Retur'
        message='Permintaan retur akan ditolak dan pelanggan akan dinotifikasi. Tindakan ini tidak dapat dibatalkan.'
        variant='danger'
        confirmLabel='Ya, Tolak'
      />

      <ConfirmModal
        open={receiveModal.open}
        onClose={receiveModal.hide}
        onConfirm={() => activeReturnId && handleUpdateStatus(activeReturnId, 'received')}
        title='Tandai Barang Diterima'
        message='Konfirmasi bahwa barang retur dari pelanggan sudah diterima di gudang.'
        variant='info'
        confirmLabel='Konfirmasi Diterima'
      />

      <InputModal
        open={refundAmountModal.open}
        onClose={refundAmountModal.hide}
        onConfirm={(val) => {
          const amount = parseFloat(val) || 0;
          if (activeReturn) handleCreateRefund(activeReturn, amount);
        }}
        title='Buat Refund'
        message='Masukkan nominal refund yang akan dikembalikan kepada pelanggan. Masukkan 0 untuk refund penuh.'
        label='Nominal Refund (Rp)'
        placeholder='Contoh: 150000'
        inputType='number'
        defaultValue='0'
        variant='info'
        confirmLabel='Buat Refund'
      />
    </div>
  );
};
