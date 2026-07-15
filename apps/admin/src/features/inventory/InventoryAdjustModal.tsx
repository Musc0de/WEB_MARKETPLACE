import React, { useState, useEffect } from 'react';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';


interface InventoryAdjustModalProps {
  variantId: string;
  warehouseId: string;
  variantName: string;
  currentStock: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function InventoryAdjustModal({
  variantId,
  warehouseId,
  variantName,
  currentStock,
  onClose,
  onSuccess,
}: InventoryAdjustModalProps) {
  const [type, setType] = useState<'receive' | 'adjust'>('receive');
  
  // For 'receive', this is the incoming quantity. For 'adjust', this is the actual physical stock.
  const [inputValue, setInputValue] = useState('');
  
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Compute delta based on type
  const parsedInput = parseInt(inputValue, 10);
  const isInputValid = !isNaN(parsedInput) && inputValue !== '';
  
  let computedDelta = 0;
  let finalStock = currentStock;

  if (isInputValid) {
    if (type === 'receive') {
      computedDelta = parsedInput; // Can be positive or negative
      finalStock = currentStock + computedDelta;
    } else {
      // type === 'adjust' (Audit)
      // Input is the physical stock they counted. Delta is the difference.
      computedDelta = parsedInput - currentStock;
      finalStock = parsedInput;
    }
  }

  // Clear input when type changes
  useEffect(() => {
    setInputValue('');
    setErrors({});
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!isInputValid) {
      setErrors({ inputValue: 'Masukkan angka yang valid' });
      return;
    }
    
    if (type === 'adjust' && parsedInput < 0) {
      setErrors({ inputValue: 'Stok fisik tidak boleh minus' });
      return;
    }

    if (computedDelta === 0) {
      setErrors({ inputValue: 'Tidak ada perubahan stok (selisih 0)' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await client.v1.admin.inventory.adjust.$post({
        json: {
          variantId,
          warehouseId,
          delta: computedDelta,
          type,
          note: note.trim() || (type === 'adjust' ? `Penyesuaian Audit (Stok fisik: ${parsedInput})` : 'Restock'),
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error((errorData as any).error?.message || 'Gagal menyesuaikan stok');
        return;
      }

      toast.success('Stok berhasil diperbarui');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Kesalahan jaringan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm'>
      <div 
        className='bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white relative z-10'>
          <h2 className='text-lg font-bold text-gray-900'>Kelola Stok</h2>
          <button 
            type='button'
            onClick={onClose}
            className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-6 bg-gray-50/50'>
          
          {/* Info Card */}
          <div className='p-4 bg-white border border-gray-200 shadow-sm rounded-xl flex items-center justify-between'>
            <div>
              <p className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-1'>Target Produk</p>
              <p className='text-sm font-semibold text-gray-900'>{variantName}</p>
            </div>
            <div className='text-right border-l border-gray-100 pl-4'>
               <p className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-1'>Stok Tersedia Saat Ini</p>
               <p className='text-xl font-black text-blue-600'>{currentStock}</p>
            </div>
          </div>

          {/* Type */}
          <div className='space-y-2'>
            <label className='block text-sm font-bold text-gray-700'>
              Mode Penyesuaian
            </label>
            <div className='grid grid-cols-2 gap-3'>
              <button
                type='button'
                onClick={() => setType('receive')}
                className={`px-4 py-3 text-sm font-semibold rounded-xl border text-center transition-all ${
                  type === 'receive' 
                    ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Terima Stok (Restock)
              </button>
              <button
                type='button'
                onClick={() => setType('adjust')}
                className={`px-4 py-3 text-sm font-semibold rounded-xl border text-center transition-all ${
                  type === 'adjust' 
                    ? 'bg-purple-50 border-purple-600 text-purple-700 ring-1 ring-purple-600' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Audit (Hitung Fisik)
              </button>
            </div>
          </div>

          {/* Dynamic Input */}
          <div className='space-y-2'>
            <label className='block text-sm font-bold text-gray-700 flex justify-between'>
              <span>{type === 'receive' ? 'Jumlah Barang Masuk' : 'Hasil Hitung Fisik (Stok Nyata)'}</span>
            </label>
            <div className='relative'>
              <input
                type='number'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={type === 'receive' ? 'Contoh: 50' : 'Contoh: 15'}
                disabled={isSubmitting}
                className={`w-full pl-4 pr-16 py-3 text-lg font-bold bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.inputValue 
                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                    : type === 'receive'
                      ? 'border-gray-300 focus:ring-blue-500/20 focus:border-blue-500'
                      : 'border-gray-300 focus:ring-purple-500/20 focus:border-purple-500'
                }`}
              />
              <div className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold'>
                unit
              </div>
            </div>
            {errors.inputValue && (
              <p className='text-xs text-red-500 font-bold mt-1'>{errors.inputValue}</p>
            )}
          </div>

          {/* Result Calculation Display */}
          {isInputValid && (
            <div className={`p-4 rounded-xl border ${
              computedDelta > 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
              computedDelta < 0 ? 'bg-rose-50 border-rose-100 text-rose-800' :
              'bg-gray-100 border-gray-200 text-gray-600'
            }`}>
              <div className='flex justify-between items-center mb-1'>
                <span className='text-sm font-medium'>Perubahan Sistem (Selisih):</span>
                <span className='font-bold'>{computedDelta > 0 ? '+' : ''}{computedDelta} unit</span>
              </div>
              <div className='flex justify-between items-center pt-2 border-t border-black/5'>
                <span className='text-sm font-bold uppercase'>Stok Akhir Menjadi:</span>
                <span className='text-xl font-black'>{finalStock}</span>
              </div>
            </div>
          )}

          {/* Note */}
          <div className='space-y-2'>
            <label className='block text-sm font-bold text-gray-700'>
              Catatan / Alasan
            </label>
            <input
              type='text'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder='Opsional...'
              disabled={isSubmitting}
              className='w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all'
            />
          </div>

          {/* Actions */}
          <div className='flex items-center gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              disabled={isSubmitting}
              className='flex-1 px-4 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors'
            >
              Batal
            </button>
            <button 
              type='submit' 
              disabled={isSubmitting || !isInputValid || computedDelta === 0}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white rounded-xl transition-all ${
                (!isInputValid || computedDelta === 0)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : type === 'receive'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isSubmitting ? 'Memproses...' : 'Simpan Stok'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
