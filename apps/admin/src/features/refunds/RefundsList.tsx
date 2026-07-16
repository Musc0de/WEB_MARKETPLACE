import { useRef, useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/rpc.ts';
import { toast } from '@starsuperscare/ui';
import { Banknote, Camera, CreditCard, Image as ImageIcon, Loader2 } from 'lucide-react';
import {
  DataTable,
  EmptyState,
  FilterTabs,
  PageHeader,
  SearchBar,
  StatusPill,
  TableSkeleton,
} from '../../components/admin-ui.tsx';
import { ModalShell, useModalState } from '../../components/modal.tsx';
import { formatDate, formatIDR } from '@starsuperscare/ui';
import { Pagination } from '../../components/Pagination.tsx';

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
  const [page, setPage] = useState(1);
  const limit = 10;

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

  const handleProcessRefund = async (
    refundId: string,
    amount: string,
    restockItems: boolean,
    proofImageUrl: string | null,
  ) => {
    try {
      setProcessing(refundId);
      const payload: any = { restockItems, proofImageUrl };
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
        const errMsg = typeof err.error === 'string'
          ? err.error
          : err.error?.message ?? 'Gagal memproses refund';
        toast.error(errMsg);
      }
    } catch {
      toast.error('Kesalahan jaringan, coba lagi');
    } finally {
      setProcessing(null);
    }
  };

  const filtered = refunds?.filter((r: any) => {
    const matchSearch = !search ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.orderId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = filtered?.length ?? 0;
  const paginated = filtered?.slice((page - 1) * limit, page * limit) || [];

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
        summary={`${total} refund ditemukan`}
      >
        {isLoading ? <TableSkeleton cols={7} /> : !filtered?.length
          ? (
            <tr>
              <td colSpan={7}>
                <EmptyState
                  icon={CreditCard}
                  title='Tidak ada data refund'
                  description='Semua proses pengembalian dana akan ditampilkan di sini.'
                />
              </td>
            </tr>
          )
          : (
            paginated.map((refund: any) => (
              <tr key={refund.id} className='hover:bg-amber-50/20 transition-colors'>
                <td className='px-5 py-3.5'>
                  <span className='font-mono text-sm font-semibold text-amber-600'>
                    {refund.id.slice(0, 8)}…
                  </span>
                </td>
                <td className='px-5 py-3.5'>
                  <p className='text-sm font-medium text-gray-700'>
                    Order:{' '}
                    <span className='font-mono text-xs text-gray-500'>
                      {refund.orderId?.slice(0, 8)}…
                    </span>
                  </p>
                  {refund.returnId && (
                    <p className='text-xs text-gray-400'>
                      Retur: <span className='font-mono'>{refund.returnId?.slice(0, 8)}…</span>
                    </p>
                  )}
                </td>
                <td className='px-5 py-3.5'>
                  <span className='text-sm font-bold text-gray-900'>
                    {formatIDR(refund.amount ?? 0)}
                  </span>
                </td>
                <td className='px-5 py-3.5'>
                  <span className='text-xs font-mono text-gray-400'>
                    {refund.providerReference || '—'}
                  </span>
                </td>
                <td className='px-5 py-3.5'>
                  <StatusPill status={refund.status} />
                </td>
                <td className='px-5 py-3.5 text-sm text-gray-400'>
                  {formatDate(refund.createdAt)}
                </td>
                <td className='px-5 py-3.5'>
                  {refund.status === 'pending'
                    ? (
                      <button
                        type='button'
                        disabled={processing === refund.id}
                        onClick={() => {
                          setActiveRefundId(refund.id);
                          processModal.show();
                        }}
                        className='inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-500 transition disabled:opacity-60'
                      >
                        {processing === refund.id
                          ? <Loader2 className='h-3 w-3 animate-spin' />
                          : <CreditCard className='h-3 w-3' />}
                        Proses
                      </button>
                    )
                    : refund.proofImageUrl
                    ? (
                      <a
                        href={refund.proofImageUrl}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-200 transition'
                      >
                        <ImageIcon className='h-3 w-3 text-gray-500' />
                        Bukti
                      </a>
                    )
                    : <span className='text-xs text-gray-400'>—</span>}
                </td>
              </tr>
            ))
          )}
      </DataTable>

      {total > 0 && (
        <Pagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
        />
      )}

      {/* ── Process Refund Modal ── */}
      <ProcessRefundModal
        open={processModal.open}
        onClose={processModal.hide}
        onConfirm={(amount, restockItems, proofImageUrl) => {
          if (activeRefundId) {
            handleProcessRefund(
              activeRefundId,
              amount,
              restockItems,
              proofImageUrl,
            );
          }
          processModal.hide();
        }}
      />
    </div>
  );
};

function ProcessRefundModal(
  { open, onClose, onConfirm }: {
    open: boolean;
    onClose: () => void;
    onConfirm: (amount: string, restockItems: boolean, proofUrl: string | null) => void;
  },
) {
  const [amount, setAmount] = useState('');
  const [restock, setRestock] = useState(false);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Hanya gambar yang diperbolehkan');
      return;
    }

    setIsUploading(true);
    try {
      const res = await (client.v1 as any).admin.assets['upload-proof-url'].$post({
        json: {
          filename: file.name,
          contentType: file.type,
          size: file.size,
        },
      });

      if (!res.ok) throw new Error('Gagal mendapatkan URL upload');
      const { uploadUrl, publicUrl } = await res.json();

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error('Gagal mengunggah file ke server');

      setProofUrl(publicUrl);
      toast.success('Bukti transfer berhasil diunggah');
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat unggah');
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleConfirm = () => {
    onConfirm(amount, restock, proofUrl);
  };

  return (
    <ModalShell open={open} onClose={onClose}>
      <div className='p-6'>
        <h3 className='text-base font-bold text-gray-900 mb-1'>Proses Refund Manual</h3>
        <p className='text-sm text-gray-500 mb-4'>
          Proses ini akan menandai refund sebagai selesai dan mengembalikan dana secara manual.
        </p>

        <div className='space-y-4 text-sm text-gray-700'>
          <div>
            <label className='block font-medium mb-1'>Nominal Final (Rp) — opsional</label>
            <input
              type='number'
              className='w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:border-amber-500 focus:ring-amber-500'
              placeholder='Kosongkan untuk menggunakan default'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='restock-chk'
              checked={restock}
              onChange={(e) => setRestock(e.target.checked)}
              className='h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600'
            />
            <label htmlFor='restock-chk' className='font-medium text-gray-900'>
              Kembalikan stok (restock)
            </label>
          </div>

          <div>
            <label className='block font-medium mb-1'>
              Bukti Transfer / Pengembalian (opsional)
            </label>
            <div className='flex items-start gap-4 mt-2'>
              {proofUrl
                ? (
                  <div className='relative h-20 w-20 rounded border bg-gray-50 flex items-center justify-center overflow-hidden'>
                    <img src={proofUrl} alt='Proof' className='object-cover max-h-full' />
                  </div>
                )
                : (
                  <div className='h-20 w-20 rounded border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50'>
                    <ImageIcon className='h-6 w-6 text-gray-400' />
                  </div>
                )}
              <div>
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  ref={fileRef}
                  onChange={handleUpload}
                />
                <button
                  type='button'
                  disabled={isUploading}
                  onClick={() => fileRef.current?.click()}
                  className='inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-gray-50 transition'
                >
                  {isUploading
                    ? <Loader2 className='h-3 w-3 animate-spin' />
                    : <Camera className='h-3 w-3' />}
                  Unggah Bukti
                </button>
                <p className='text-xs text-gray-500 mt-1.5'>Format: JPG, PNG. Maks 2MB.</p>
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-2 pt-4 border-t mt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition'
            >
              Batal
            </button>
            <button
              type='button'
              onClick={handleConfirm}
              disabled={isUploading}
              className='px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-xl hover:bg-amber-700 disabled:opacity-50 transition'
            >
              Selesaikan Refund
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
