import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { toast } from '@starsuperscare/ui';
import { ArrowLeft, CheckCircle2, Package } from 'lucide-react';

const fetchEligibility = async (orderId: string) => {
  const res = await client.v1.orders[':id']['resolution-eligibility'].$get({
    param: { id: orderId },
  });
  if (res.ok) return (await res.json()).data;
  throw new Error('Failed to fetch eligibility');
};

export function ReturnFormPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const type = searchParams.get('type') || 'return'; // 'return' or 'cancel'

  const navigate = useNavigate();

  const { data, error, isLoading } = useSWR(
    orderId ? ['/api/orders', orderId, 'resolution-eligibility'] : null,
    ([, id]) => fetchEligibility(id),
  );

  const [step, setStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { quantity: number; reason: string }>
  >({});
  const [reasonCode, setReasonCode] = useState('');
  const [description, setDescription] = useState('');
  const [resolution, setResolution] = useState('refund_only');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!orderId) {
    return <div className='p-8 text-center text-red-500'>Order ID is required.</div>;
  }

  if (isLoading) {
    return <div className='p-8 text-center'>Loading...</div>;
  }

  if (error || !data) {
    return <div className='p-8 text-center text-red-500'>Failed to load eligibility data.</div>;
  }

  const isCancel = type === 'cancel';
  const el = isCancel ? data.cancellationEligibility : data.returnEligibility;

  if (!el?.eligible) {
    return (
      <div className='max-w-2xl mx-auto py-12 px-6 text-center'>
        <h2 className='text-xl font-bold text-gray-900 mb-2'>Tidak Memenuhi Syarat</h2>
        <p className='text-gray-500 mb-6'>
          {el?.reasonMessage || 'Pesanan ini tidak dapat diproses saat ini.'}
        </p>
        <button
          type='button'
          onClick={() => navigate(`/orders/${orderId}`)}
          className='px-6 py-2 bg-gray-100 rounded-full font-bold'
        >
          Kembali ke Pesanan
        </button>
      </div>
    );
  }

  const handleCancelSubmit = async () => {
    if (!description || description.length < 5) {
      toast.error('Alasan pembatalan minimal 5 karakter');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await client.v1.orders[':id']['cancellation-requests'].$post({
        param: { id: orderId },
        json: { reason: description },
      });
      if (res.ok) {
        toast.success('Permintaan pembatalan berhasil diajukan');
        navigate(`/orders/${orderId}`);
      } else {
        toast.error('Gagal membatalkan pesanan');
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnSubmit = async () => {
    const itemsToReturn = Object.entries(selectedItems).map(([id, data]) => ({
      orderItemId: id,
      quantity: data.quantity,
      reasonDetail: description || null,
      condition: 'opened',
    }));

    if (itemsToReturn.length === 0) {
      toast.error('Pilih setidaknya satu produk untuk dikembalikan');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await (client.v1 as any).returns.$post({
        json: {
          orderId: orderId,
          resolution,
          reason: reasonCode || null,
          items: itemsToReturn,
        },
      });

      if (res.ok) {
        toast.success('Pengajuan pengembalian berhasil');
        navigate(`/returns`);
      } else {
        toast.error('Gagal mengajukan pengembalian');
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI for Cancellation
  if (isCancel) {
    return (
      <div className='max-w-2xl mx-auto py-10 space-y-6'>
        <button
          type='button'
          onClick={() => navigate(-1)}
          className='flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium'
        >
          <ArrowLeft className='w-4 h-4' /> Batal
        </button>
        <div className='bg-white p-6 rounded-2xl border border-gray-200 shadow-sm'>
          <h1 className='text-xl font-bold text-gray-900 mb-1'>Ajukan Pembatalan</h1>
          <p className='text-sm text-gray-500 mb-6'>
            Tolong beritahu kami alasan Anda membatalkan pesanan ini.
          </p>

          <textarea
            className='w-full border border-gray-200 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-rose-500 outline-none mb-6'
            placeholder='Alasan pembatalan...'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            type='button'
            onClick={handleCancelSubmit}
            disabled={isSubmitting}
            className='w-full bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 transition disabled:opacity-50'
          >
            {isSubmitting ? 'Memproses...' : 'Ajukan Pembatalan'}
          </button>
        </div>
      </div>
    );
  }

  // UI for Returns (Wizard)
  const eligibleItems = data.returnEligibility.eligibleItems;
  const toggleItem = (itemId: string, maxQty: number) => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      if (next[itemId]) delete next[itemId];
      else next[itemId] = { quantity: maxQty, reason: '' };
      return next;
    });
  };

  const calculateMaxRefund = () => {
    return Object.entries(selectedItems).reduce((sum, [id, data]) => {
      const item = eligibleItems.find((i: any) => i.orderItemId === id);
      return sum + (item ? item.paidUnitAmount * data.quantity : 0);
    }, 0);
  };

  return (
    <div className='max-w-3xl mx-auto py-10 space-y-6'>
      <button
        type='button'
        onClick={() => navigate(-1)}
        className='flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium'
      >
        <ArrowLeft className='w-4 h-4' /> Batal
      </button>

      <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
        {/* Header / Stepper */}
        <div className='bg-orange-50/50 p-6 border-b border-gray-100 flex gap-4'>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 flex flex-col items-center gap-2 ${
                step >= s ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step === s
                    ? 'bg-orange-500 text-white'
                    : step > s
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > s ? <CheckCircle2 className='w-4 h-4' /> : s}
              </div>
              <span className='text-xs font-semibold text-gray-600 text-center'>
                {s === 1 ? 'Pilih Produk' : s === 2 ? 'Detail' : 'Konfirmasi'}
              </span>
            </div>
          ))}
        </div>

        <div className='p-6'>
          {step === 1 && (
            <div className='space-y-4'>
              <h2 className='text-lg font-bold'>Pilih Produk untuk Dikembalikan</h2>
              <div className='divide-y border rounded-xl overflow-hidden'>
                {eligibleItems.map((item: any) => {
                  const isSelected = !!selectedItems[item.orderItemId];
                  return (
                    <div
                      key={item.orderItemId}
                      className={`p-4 flex gap-4 ${isSelected ? 'bg-orange-50' : 'bg-white'}`}
                    >
                      <input
                        type='checkbox'
                        className='mt-1'
                        checked={isSelected}
                        onChange={() =>
                          toggleItem(item.orderItemId, item.remainingEligibleQuantity)}
                      />
                      {item.primaryImage
                        ? (
                          <img
                            src={item.primaryImage}
                            className='w-16 h-16 rounded object-cover'
                            alt=''
                          />
                        )
                        : (
                          <div className='w-16 h-16 rounded bg-gray-100 flex items-center justify-center'>
                            <Package className='w-6 h-6 text-gray-300' />
                          </div>
                        )}
                      <div className='flex-1'>
                        <p className='font-semibold text-sm line-clamp-1'>{item.productName}</p>
                        <p className='text-xs text-gray-500 mt-1'>
                          Maks: {item.remainingEligibleQuantity}
                        </p>
                        {isSelected && (
                          <div className='mt-3 flex items-center gap-3'>
                            <label className='text-xs font-semibold'>Jumlah:</label>
                            <input
                              type='number'
                              min='1'
                              max={item.remainingEligibleQuantity}
                              value={selectedItems[item.orderItemId].quantity}
                              onChange={(e) => {
                                const q = parseInt(e.target.value);
                                if (q > 0 && q <= item.remainingEligibleQuantity) {
                                  setSelectedItems((prev) => ({
                                    ...prev,
                                    [item.orderItemId]: { ...prev[item.orderItemId], quantity: q },
                                  }));
                                }
                              }}
                              className='w-20 px-2 py-1 border rounded'
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                type='button'
                onClick={() =>
                  Object.keys(selectedItems).length > 0 ? setStep(2) : toast.error('Pilih produk')}
                className='w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600'
              >
                Selanjutnya
              </button>
            </div>
          )}

          {step === 2 && (
            <div className='space-y-6'>
              <h2 className='text-lg font-bold'>Detail Pengembalian</h2>

              <div>
                <label className='block text-sm font-bold mb-2'>Solusi yang Diinginkan</label>
                <div className='grid grid-cols-2 gap-3'>
                  <button
                    type='button'
                    onClick={() => setResolution('refund_only')}
                    className={`p-4 border rounded-xl text-left ${
                      resolution === 'refund_only' ? 'border-orange-500 bg-orange-50' : 'bg-white'
                    }`}
                  >
                    <span className='block font-bold'>Hanya Refund</span>
                    <span className='text-xs text-gray-500'>
                      Barang tidak perlu dikembalikan (Syarat berlaku)
                    </span>
                  </button>
                  <button
                    type='button'
                    onClick={() => setResolution('return_and_refund')}
                    className={`p-4 border rounded-xl text-left ${
                      resolution === 'return_and_refund'
                        ? 'border-orange-500 bg-orange-50'
                        : 'bg-white'
                    }`}
                  >
                    <span className='block font-bold'>Return & Refund</span>
                    <span className='text-xs text-gray-500'>
                      Kembalikan barang dan dapatkan dana
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className='block text-sm font-bold mb-2'>Alasan Pengembalian (Kode)</label>
                <select
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value)}
                  className='w-full border rounded-xl p-3 bg-white'
                >
                  <option value=''>Pilih alasan...</option>
                  <option value='damaged'>Barang rusak/cacat</option>
                  <option value='wrong_item'>Barang tidak sesuai pesanan</option>
                  <option value='missing_parts'>Ada bagian yang kurang</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-bold mb-2'>Penjelasan Detail</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='w-full border rounded-xl p-3 h-24'
                  placeholder='Ceritakan masalah secara spesifik...'
                />
              </div>

              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={() => setStep(1)}
                  className='flex-1 border bg-white font-bold py-3 rounded-xl'
                >
                  Kembali
                </button>
                <button
                  type='button'
                  onClick={() => {
                    if (!reasonCode) {
                      toast.error('Pilih alasan pengembalian');
                      return;
                    }
                    setStep(3);
                  }}
                  className='flex-1 bg-orange-500 text-white font-bold py-3 rounded-xl'
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className='space-y-6'>
              <h2 className='text-lg font-bold text-center'>Konfirmasi Pengajuan</h2>

              <div className='bg-gray-50 p-6 rounded-xl border border-gray-200'>
                <div className='flex justify-between mb-2'>
                  <span className='text-gray-600'>Total Item:</span>
                  <span className='font-bold'>{Object.keys(selectedItems).length}</span>
                </div>
                <div className='flex justify-between mb-2'>
                  <span className='text-gray-600'>Solusi:</span>
                  <span className='font-bold'>
                    {resolution === 'refund_only'
                      ? 'Hanya Pengembalian Dana'
                      : 'Pengembalian Barang & Dana'}
                  </span>
                </div>
                <div className='flex justify-between mb-4 pb-4 border-b'>
                  <span className='text-gray-600'>Alasan:</span>
                  <span className='font-bold capitalize'>{reasonCode.replace('_', ' ')}</span>
                </div>
                <div className='flex justify-between items-center text-lg'>
                  <span className='font-bold text-gray-900'>Maks. Pengembalian Dana:</span>
                  <span className='font-bold text-orange-600'>
                    Rp {calculateMaxRefund().toLocaleString('id-ID')}
                  </span>
                </div>
                <p className='text-xs text-gray-400 mt-2 text-right'>
                  * Nilai pasti ditentukan oleh admin setelah ditinjau
                </p>
              </div>

              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={() => setStep(2)}
                  className='flex-1 border bg-white font-bold py-3 rounded-xl'
                >
                  Kembali
                </button>
                <button
                  type='button'
                  onClick={handleReturnSubmit}
                  disabled={isSubmitting}
                  className='flex-1 bg-orange-500 text-white font-bold py-3 rounded-xl'
                >
                  {isSubmitting ? 'Memproses...' : 'Kirim Pengajuan'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
