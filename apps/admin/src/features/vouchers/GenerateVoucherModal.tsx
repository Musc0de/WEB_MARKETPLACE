import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.ts';
import { goeyToast as toast } from 'goey-toast';
import { HelpCircle, Ticket, X } from 'lucide-react';

export function GenerateVoucherModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const [count, setCount] = useState(1);
  const [format, setFormat] = useState('XXXX-XXXX-XXX');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [rawDiscountAmount, setRawDiscountAmount] = useState('10');
  const [description, setDescription] = useState('');
  const [maxUses, setMaxUses] = useState<number | ''>('');

  const [minOrderValue, setMinOrderValue] = useState<number | ''>('');
  const [maxDiscountValue, setMaxDiscountValue] = useState<number | ''>('');
  const [isShippingPromo, setIsShippingPromo] = useState(false);
  const [isNewUserOnly, setIsNewUserOnly] = useState(false);

  const generateMutation = useMutation({
    mutationFn: async () => {
      await api.post('/admin/vouchers/generate', {
        count: Number(count),
        format,
        discountType,
        discountAmount: Number(rawDiscountAmount),
        description: description || undefined,
        maxUses: maxUses ? Number(maxUses) : undefined,
        minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
        maxDiscountValue: maxDiscountValue ? Number(maxDiscountValue) : undefined,
        isShippingPromo: isShippingPromo ? 1 : 0,
        isNewUserOnly: isNewUserOnly ? 1 : 0,
      });
    },
    onSuccess: () => {
      toast.success(`${count} voucher berhasil digenerate`);
      queryClient.invalidateQueries({ queryKey: ['admin', 'vouchers'] });
      onClose();
    },
    onError: () => {
      toast.error('Gagal men-generate voucher');
      setIsSaving(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (count < 1 || count > 5000) {
      toast.error('Jumlah voucher harus antara 1 dan 5000');
      return;
    }
    if (Number(rawDiscountAmount) <= 0) {
      toast.error('Nominal diskon tidak valid');
      return;
    }
    setIsSaving(true);
    generateMutation.mutate();
  };

  return (
    <div className='fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto'>
      <div className='bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden my-8'>
        <div className='flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center'>
              <Ticket className='w-4 h-4 text-blue-600' />
            </div>
            <h2 className='text-lg font-bold text-gray-900'>Generate Voucher</h2>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-5'>
          {/* Section: Mode Generate */}
          <div className='bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-4'>
            <h3 className='text-sm font-bold text-blue-900 flex items-center gap-1.5'>
              <HelpCircle className='w-4 h-4' /> Mode Generate
            </h3>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-semibold text-blue-900 mb-1.5'>
                  Jumlah Generate
                </label>
                <input
                  type='number'
                  min='1'
                  max='5000'
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className='w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white'
                />
              </div>
              <div>
                <label className='block text-xs font-semibold text-blue-900 mb-1.5'>
                  Format Kode
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className='w-full pl-3 pr-8 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white font-mono'
                >
                  <option value='XXXX-XXXX-XXX'>XXXX-XXXX-XXX (A-Z, 0-9)</option>
                  <option value='XXX-XX-XXX'>XXX-XX-XXX (0-9)</option>
                  <option value='XX-XX-XXXX'>XX-XX-XXXX (0-9, A-Z)</option>
                  <option value='XX-XX-XXX'>XX-XX-XXX (A-Z)</option>
                  <option value='XXXXXXXX-XXXXXX-XXXXXX'>XXXX...XXXX (A-Z, 0-9)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Aturan Diskon */}
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                  Tipe Diskon
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className='w-full pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white'
                >
                  <option value='percentage'>Persentase (%)</option>
                  <option value='fixed'>Nominal Tetap (Rp)</option>
                </select>
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                  Nominal Diskon
                </label>
                <input
                  type='text'
                  value={rawDiscountAmount ? Number(rawDiscountAmount).toLocaleString('id-ID') : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (discountType === 'percentage' && Number(val) > 100) {
                      setRawDiscountAmount('100');
                    } else {
                      setRawDiscountAmount(val);
                    }
                  }}
                  className='w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                  Maksimal Penggunaan
                </label>
                <input
                  type='number'
                  min='1'
                  placeholder='Tak Terbatas'
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value === '' ? '' : Number(e.target.value))}
                  className='w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white'
                />
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                  S&K Deskripsi
                </label>
                <input
                  type='text'
                  placeholder='Cth: Minimal Belanja 100rb'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white'
                />
              </div>
            </div>

            {/* Section: Syarat & Ketentuan Ekstra */}
            <div className='pt-4 border-t border-gray-100'>
              <h3 className='text-sm font-bold text-gray-900 mb-3'>Syarat & Ketentuan Lanjutan</h3>
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                    Minimal Belanja (Rp)
                  </label>
                  <input
                    type='number'
                    min='0'
                    placeholder='Tanpa Min. Belanja'
                    value={minOrderValue}
                    onChange={(e) =>
                      setMinOrderValue(e.target.value === '' ? '' : Number(e.target.value))}
                    className='w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white'
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                    Maksimal Potongan (Rp)
                  </label>
                  <input
                    type='number'
                    min='0'
                    placeholder='Tanpa Maks. Potongan'
                    value={maxDiscountValue}
                    onChange={(e) =>
                      setMaxDiscountValue(e.target.value === '' ? '' : Number(e.target.value))}
                    disabled={discountType === 'fixed'}
                    className='w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:opacity-50'
                  />
                </div>
              </div>
              <div className='flex gap-6'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={isShippingPromo}
                    onChange={(e) => setIsShippingPromo(e.target.checked)}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700 font-medium'>Promo Gratis Ongkir</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={isNewUserOnly}
                    onChange={(e) => setIsNewUserOnly(e.target.checked)}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700 font-medium'>Khusus Pengguna Baru</span>
                </label>
              </div>
            </div>
          </div>

          <div className='pt-4 border-t border-gray-100 flex justify-end gap-3'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50'
            >
              Batal
            </button>
            <button
              type='submit'
              disabled={isSaving}
              className='px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50'
            >
              {isSaving ? 'Memproses...' : `Generate ${count} Voucher`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
