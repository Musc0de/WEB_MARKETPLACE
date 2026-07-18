import { useState } from 'react';
import type { CartSummary as CartSummaryType } from '@starsuperscare/contracts';
import { Button, formatIDR, toast } from '@starsuperscare/ui';
import { useCart } from '../api/useCart.ts';
import { Ticket, X } from 'lucide-react';

interface CartSummaryProps {
  summary: CartSummaryType;
  isEmpty: boolean;
  onCheckout: (voucherCode?: string) => void;
}

export function CartSummary({ summary, isEmpty, onCheckout }: CartSummaryProps) {
  const [voucherCode, setVoucherCode] = useState('');
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<
    { code: string; amount: number; description?: string | null } | null
  >(
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
        description: data.description,
      });
      toast.success('Voucher berhasil digunakan');
      setVoucherCode('');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
    toast.success('Voucher dibatalkan');
  };

  const finalTotal = Math.max(0, summary.grandTotal - (appliedVoucher?.amount || 0));

  return (
    <div className='bg-card border border-border/60 shadow-sm rounded-3xl p-6 lg:p-8 w-full lg:w-96 flex flex-col gap-6 sticky top-6'>
      <h2 className='text-lg font-black text-foreground tracking-tight pb-6 border-b border-border/60'>
        Ringkasan Belanja
      </h2>

      <div className='flex flex-col gap-4 text-sm font-medium'>
        <div className='flex justify-between items-center text-muted-foreground gap-4'>
          <span className='shrink-0'>Subtotal</span>
          <span className='font-bold text-foreground truncate'>{formatIDR(summary.subtotal)}</span>
        </div>

        {(summary.totalDiscount > 0 || appliedVoucher) && (
          <div className='flex justify-between items-center text-emerald-600 dark:text-emerald-400 gap-4'>
            <span className='font-bold shrink-0'>Total Diskon</span>
            <span className='font-black bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 truncate'>
              -{formatIDR(summary.totalDiscount + (appliedVoucher?.amount || 0))}
            </span>
          </div>
        )}

        <div className='flex justify-between items-center text-muted-foreground gap-4'>
          <span className='shrink-0'>Estimasi Ongkos Kirim</span>
          <span className='font-bold text-foreground truncate'>Dihitung saat checkout</span>
        </div>

        <div className='border-t border-border/60 pt-6 mt-2 flex justify-between items-center gap-4'>
          <span className='font-black text-lg text-foreground shrink-0'>Total Tagihan</span>
          <span className='font-black text-xl text-indigo-600 dark:text-indigo-400 truncate'>
            {formatIDR(finalTotal)}
          </span>
        </div>
      </div>

      <div className='pt-2'>
        {appliedVoucher
          ? (
            <div className='flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 shadow-sm'>
              <div className='flex items-center gap-3 text-emerald-700 dark:text-emerald-400'>
                <Ticket className='w-5 h-5 shrink-0' />
                <div>
                  <p className='text-sm font-black uppercase tracking-widest'>
                    {appliedVoucher.code}
                  </p>
                  <p className='text-xs font-bold opacity-80'>Voucher berhasil digunakan</p>
                  {appliedVoucher.description && (
                    <p className='text-xs opacity-70 mt-1 max-w-[200px] leading-relaxed font-medium'>
                      {appliedVoucher.description}
                    </p>
                  )}
                </div>
              </div>
              <button
                type='button'
                onClick={handleRemoveVoucher}
                className='p-2 hover:bg-emerald-500/20 rounded-xl transition-colors shrink-0'
                title='Batalkan Voucher'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
          )
          : (
            <form onSubmit={handleApplyVoucher} className='flex gap-2'>
              <input
                type='text'
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder='Makin hemat pakai promo'
                className='flex-1 rounded-xl bg-muted/20 border-border/60 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-4 py-3 font-medium transition-colors outline-none border'
                disabled={isApplyingVoucher || isEmpty}
              />
              <Button
                type='submit'
                disabled={isApplyingVoucher || isEmpty || !voucherCode.trim()}
                className='rounded-xl font-bold px-6 shadow-sm active:scale-95'
              >
                {isApplyingVoucher ? 'Cek...' : 'Terapkan'}
              </Button>
            </form>
          )}
      </div>

      <Button
        onClick={() => onCheckout(appliedVoucher?.code)}
        disabled={isEmpty || summary.subtotal === 0}
        className='w-full rounded-xl font-bold text-lg h-14 shadow-md active:scale-[0.98] mt-2'
      >
        Beli Sekarang
      </Button>
    </div>
  );
}
