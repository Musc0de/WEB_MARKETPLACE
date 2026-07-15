import { useState } from 'react';
import type { CartSummary as CartSummaryType } from '@starsuperscare/contracts';
import { formatIDR, toast } from '@starsuperscare/ui';
import { useCart } from '../api/useCart.ts';

interface CartSummaryProps {
  summary: CartSummaryType;
  isEmpty: boolean;
  onCheckout: () => void;
}

export function CartSummary({ summary, isEmpty, onCheckout }: CartSummaryProps) {
  const [voucherCode, setVoucherCode] = useState('');
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; amount: number } | null>(
    null,
  );

  const { applyVoucher } = useCart();

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    setIsApplyingVoucher(true);
    try {
      const data = await applyVoucher(voucherCode);
      setAppliedVoucher({
        code: data.code,
        // Basic projection logic, proper logic will be in checkout
        amount: data.discountType === 'percentage'
          ? Math.floor((summary.subtotal * data.discountAmount) / 100)
          : data.discountAmount,
      });
      toast.success('Voucher berhasil digunakan');
      setVoucherCode('');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const finalTotal = Math.max(0, summary.grandTotal - (appliedVoucher?.amount || 0));

  return (
    <div className='bg-gray-50 rounded-lg p-6 w-full lg:w-96 flex flex-col gap-6 sticky top-6'>
      <h2 className='text-lg font-medium text-gray-900'>Ringkasan Belanja</h2>

      <div className='flex flex-col gap-4 text-sm text-gray-600'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p className='font-medium text-gray-900'>{formatIDR(summary.subtotal)}</p>
        </div>

        {(summary.totalDiscount > 0 || appliedVoucher) && (
          <div className='flex justify-between text-green-600'>
            <p>Total Diskon</p>
            <p className='font-medium'>
              -{formatIDR(summary.totalDiscount + (appliedVoucher?.amount || 0))}
            </p>
          </div>
        )}

        <div className='flex justify-between'>
          <p>Estimasi Ongkos Kirim</p>
          <p className='font-medium text-gray-900'>Dihitung saat checkout</p>
        </div>

        <div className='border-t border-gray-200 pt-4 flex justify-between items-center text-base font-medium text-gray-900'>
          <p>Total Tagihan</p>
          <p className='text-xl text-blue-600'>{formatIDR(finalTotal)}</p>
        </div>
      </div>

      <form onSubmit={handleApplyVoucher} className='flex gap-2'>
        <input
          type='text'
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          placeholder='Makin hemat pakai promo'
          className='flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border'
          disabled={isApplyingVoucher || appliedVoucher !== null || isEmpty}
        />
        <button
          type='submit'
          disabled={isApplyingVoucher || appliedVoucher !== null || isEmpty || !voucherCode.trim()}
          className='rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-50'
        >
          {isApplyingVoucher ? 'Cek...' : 'Terapkan'}
        </button>
      </form>

      <button
        type='button'
        onClick={onCheckout}
        disabled={isEmpty || summary.subtotal === 0}
        className='w-full rounded-md bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed'
      >
        Beli Sekarang
      </button>
    </div>
  );
}
