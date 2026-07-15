import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/rpc.ts';
import { toast } from '@starsuperscare/ui';
import { CreditCard, Banknote, Loader2 } from 'lucide-react';
import {
  PageHeader,
  SearchBar,
  StatusPill,
  DataTable,
  TableSkeleton,
  EmptyState,
  FilterTabs,
} from '../../components/admin-ui.tsx';
import { ToggleInputModal, useModalState } from '../../components/modal.tsx';
import { formatDate, formatIDR } from '@starsuperscare/ui';

type RefundStatus = 'all' | 'pending' | 'processing' | 'completed' | 'failed';

const STATUS_TABS: { key: RefundStatus; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Menunggu' },
  { key: 'processing', label: 'Diproses' },
  { key: 'completed', label: 'Selesai' },
  { key: 'failed', label: 'Gagal' },
];

const TABLE_HEADERS = [
  { label: 'ID Refund' },
  { label: 'Order / Return' },
  { label: 'Jumlah' },
  { label: 'Referensi' },
  { label: 'Status' },
  { label: 'Tanggal' },
  { label: 'Aksi' },
];

export const RefundsList = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RefundStatus>('all');
  const [processing, setProcessing] = useState<string | null>(null);

  // Modal state
  const processModal = useModalState();
  const [activeRefundId, setActiveRefundId] = useState<string | null>(null);

  const { data: refunds, mutate, isLoading } = useSWR(
    '/api/v1/admin/refunds',
    async () => {
      const res = await (client.v1 as any).admin.refunds.$get();
      const json = await res.json();
      return json.data || [];
    },
  );

  const handleProcessRefund = async (refundId: string, amount: string, restockItems: boolean) => {
    try {
      setProcessing(refundId);
      const payload: any = { restockItems };
      if (amount && !isNaN(parseFloat(amount))) {
        payload.amount = parseFloat(amount);
      }
      const res = await (client.v1 as any).admin.refunds[':id'].process.$post({
        param: { id: refundId },
        json: payload,
      });
      if (res.ok) {
        toast.success('Refund berhasil diproses dan dana sedang dikembalikan');
        mutate();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Gagal memproses refund');
      }
    } catch {
      toast.error('Kesalahan jaringan, coba lagi');
    } finally {
      setProcessing(null);
    }
  };

  const filtered = refunds?.filter((r: any) => {
    const matchSearch =
      !search ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.orderId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className='space-y-6'>
      <PageHeader
        icon={Banknote}
        title='Refund'
        description='Proses dan pantau pengembalian dana kepada pelanggan.'
        badge='Keuangan'
        badgeColor='bg-amber-50 text-amber-700 ring-amber-600/20'
      />

      {/* Filters */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <FilterTabs<RefundStatus>
          options={STATUS_TABS}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder='Cari ID Refund atau Order ID…'
        />
      </div>

      {/* Table */}
      <DataTable
        headers={TABLE_HEADERS}
        summary={`${filtered?.length ?? 0} refund ditemukan`}
      >
        {isLoading ? (
          <TableSkeleton cols={7} />
        ) : !filtered?.length ? (
          <tr>
            <td colSpan={7}>
              <EmptyState
                icon={CreditCard}
                title='Tidak ada data refund'
                description='Semua proses pengembalian dana akan ditampilkan di sini.'
              />
            </td>
          </tr>
        ) : (
          filtered.map((refund: any) => (
            <tr key={refund.id} className='hover:bg-amber-50/20 transition-colors'>
              <td className='px-5 py-3.5'>
                <span className='font-mono text-sm font-semibold text-amber-600'>
                  {refund.id.slice(0, 8)}…
                </span>
              </td>
              <td className='px-5 py-3.5'>
                <p className='text-sm font-medium text-gray-700'>
                  Order: <span className='font-mono text-xs text-gray-500'>{refund.orderId?.slice(0, 8)}…</span>
                </p>
                {refund.returnId && (
                  <p className='text-xs text-gray-400'>
                    Retur: <span className='font-mono'>{refund.returnId?.slice(0, 8)}…</span>
                  </p>
                )}
              </td>
              <td className='px-5 py-3.5'>
                <span className='text-sm font-bold text-gray-900'>{formatIDR(refund.amount ?? 0)}</span>
              </td>
              <td className='px-5 py-3.5'>
                <span className='text-xs font-mono text-gray-400'>{refund.providerReference || '—'}</span>
              </td>
              <td className='px-5 py-3.5'>
                <StatusPill status={refund.status} />
              </td>
              <td className='px-5 py-3.5 text-sm text-gray-400'>{formatDate(refund.createdAt)}</td>
              <td className='px-5 py-3.5'>
                {refund.status === 'pending' ? (
                  <button
                    type='button'
                    disabled={processing === refund.id}
                    onClick={() => { setActiveRefundId(refund.id); processModal.show(); }}
                    className='inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-500 transition disabled:opacity-60'
                  >
                    {processing === refund.id
                      ? <Loader2 className='h-3 w-3 animate-spin' />
                      : <CreditCard className='h-3 w-3' />}
                    Proses
                  </button>
                ) : (
                  <span className='text-xs text-gray-400'>—</span>
                )}
              </td>
            </tr>
          ))
        )}
      </DataTable>

      {/* ── Process Refund Modal ── */}
      <ToggleInputModal
        open={processModal.open}
        onClose={processModal.hide}
        onConfirm={(amount, restockItems) => {
          if (activeRefundId) handleProcessRefund(activeRefundId, amount, restockItems);
        }}
        title='Proses Refund'
        message='Nominal akhir yang akan dikembalikan kepada pelanggan. Kosongkan untuk menggunakan nominal default dari sistem.'
        inputLabel='Nominal Final (Rp) — opsional'
        inputPlaceholder='Contoh: 150000 (kosongkan = default)'
        inputType='number'
        toggleLabel='Kembalikan stok produk ke gudang (restock)'
        defaultToggle={false}
        variant='warning'
        confirmLabel='Proses Refund'
      />
    </div>
  );
};
