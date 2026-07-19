import { useState } from 'react';
import { Button, H1, Text, toast } from '@starsuperscare/ui';
import { CheckCircle2, Ticket, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VouchersPage() {
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    setClaimed(true);
    toast.success('Voucher Gratis Ongkir berhasil diklaim!');
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

        <div className='grid gap-6 sm:grid-cols-2'>
          {/* Voucher Gratis Ongkir */}
          <div className='relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-emerald-900/30 dark:bg-slate-900'>
            {/* Background Decorative */}
            <div className='absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl' />

            <div className='flex h-full flex-col p-6 sm:p-8'>
              <div className='mb-6 flex items-center gap-4'>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'>
                  <Truck className='h-6 w-6' />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-slate-900 dark:text-white'>
                    Gratis Ongkir
                  </h3>
                  <div className='mt-1 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'>
                    Terbatas
                  </div>
                </div>
              </div>

              <div className='mb-8 flex-1'>
                <p className='text-base leading-relaxed text-slate-600 dark:text-slate-400'>
                  Bebas biaya kirim untuk minimal belanja{' '}
                  <strong className='font-bold text-slate-900 dark:text-white'>Rp 50.000</strong>.
                </p>
                <p className='mt-2 text-sm text-slate-500 dark:text-slate-500'>
                  Berlaku untuk semua metode pengiriman reguler.
                </p>
              </div>

              {claimed
                ? (
                  <div className='flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'>
                    <CheckCircle2 className='h-5 w-5' />
                    Sudah Diklaim
                  </div>
                )
                : (
                  <Button
                    onClick={handleClaim}
                    className='h-12 w-full rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.98]'
                  >
                    Klaim Sekarang
                  </Button>
                )}
            </div>

            {/* Divider styling (ticket notch effect) */}
            <div className='absolute -left-3 bottom-24 h-6 w-6 rounded-full bg-slate-50 dark:bg-slate-950 border-r border-emerald-100 dark:border-emerald-900/30' />
            <div className='absolute -right-3 bottom-24 h-6 w-6 rounded-full bg-slate-50 dark:bg-slate-950 border-l border-emerald-100 dark:border-emerald-900/30' />
            <div className='absolute bottom-[108px] left-0 right-0 border-t-2 border-dashed border-emerald-100/60 dark:border-emerald-900/30' />
          </div>
        </div>

        <div className='mt-10 text-center'>
          <Link
            to='/'
            className='text-sm font-semibold text-primary hover:underline'
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
