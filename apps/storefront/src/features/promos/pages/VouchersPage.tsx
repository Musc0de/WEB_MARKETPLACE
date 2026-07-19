import { useEffect, useState } from 'react';
import { Button, H1, Text, toast } from '@starsuperscare/ui';
import { CheckCircle2, CircleDollarSign, Percent, Ticket, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimedCodes, setClaimedCodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchVouchers() {
      try {
        const res = await fetch(`${(import.meta as any).env.VITE_API_URL}/v1/vouchers`);
        const json = await res.json();
        if (json.data) {
          setVouchers(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch vouchers', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVouchers();
  }, []);

  const handleClaim = (code: string) => {
    setClaimedCodes((prev) => {
      const next = new Set(prev);
      next.add(code);
      return next;
    });
    toast.success(`Voucher ${code} berhasil diklaim!`);
  };

  return (
    <div className='min-h-[70vh] bg-slate-50 dark:bg-slate-950 pb-20 pt-10'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
            <Ticket className='h-8 w-8' />
          </div>
          <H1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl'>
            Voucher & Promo
          </H1>
          <Text className='mt-3 text-lg text-slate-600 dark:text-slate-400'>
            Klaim voucher di bawah ini dan nikmati belanja lebih hemat!
          </Text>
        </div>

        {isLoading
          ? (
            <div className='flex justify-center p-12'>
              <span className='loading loading-spinner loading-lg text-primary'></span>
            </div>
          )
          : vouchers.length === 0
          ? (
            <div className='rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900'>
              <p className='text-slate-500'>Tidak ada voucher aktif saat ini.</p>
            </div>
          )
          : (
            <div className='grid gap-6 sm:grid-cols-2'>
              {vouchers.map((voucher) => {
                const isClaimed = claimedCodes.has(voucher.code);
                const Icon = voucher.discountType === 'percentage' ? Percent : CircleDollarSign;

                return (
                  <div
                    key={voucher.id}
                    className='relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-emerald-900/30 dark:bg-slate-900'
                  >
                    <div className='absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl' />

                    <div className='flex h-full flex-col p-6 sm:p-8'>
                      <div className='mb-6 flex items-center gap-4'>
                        <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'>
                          <Icon className='h-6 w-6' />
                        </div>
                        <div>
                          <h3 className='text-xl font-bold text-slate-900 dark:text-white uppercase'>
                            {voucher.code}
                          </h3>
                          <div className='mt-1 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'>
                            Terbatas
                          </div>
                        </div>
                      </div>

                      <div className='mb-8 flex-1'>
                        <p className='text-base leading-relaxed text-slate-600 dark:text-slate-400'>
                          {voucher.description || 'Voucher Spesial Untuk Anda.'}
                        </p>
                        <p className='mt-2 text-xl font-black text-slate-900 dark:text-white'>
                          Diskon {voucher.discountType === 'percentage'
                            ? `${voucher.discountAmount}%`
                            : `Rp ${Number(voucher.discountAmount).toLocaleString('id-ID')}`}
                        </p>
                      </div>

                      {isClaimed
                        ? (
                          <div className='flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'>
                            <CheckCircle2 className='h-5 w-5' />
                            Sudah Diklaim
                          </div>
                        )
                        : (
                          <Button
                            onClick={() => handleClaim(voucher.code)}
                            className='h-12 w-full rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.98]'
                          >
                            Klaim Sekarang
                          </Button>
                        )}
                    </div>

                    {/* Divider styling (ticket notch effect) */}
                    <div className='absolute -left-3 bottom-24 h-6 w-6 rounded-full border-r border-emerald-100 bg-slate-50 dark:border-emerald-900/30 dark:bg-slate-950' />
                    <div className='absolute -right-3 bottom-24 h-6 w-6 rounded-full border-l border-emerald-100 bg-slate-50 dark:border-emerald-900/30 dark:bg-slate-950' />
                    <div className='absolute bottom-[108px] left-0 right-0 border-t-2 border-dashed border-emerald-100/60 dark:border-emerald-900/30' />
                  </div>
                );
              })}
            </div>
          )}

        <div className='mt-10 text-center'>
          <Link to='/' className='text-sm font-semibold text-primary hover:underline'>
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
