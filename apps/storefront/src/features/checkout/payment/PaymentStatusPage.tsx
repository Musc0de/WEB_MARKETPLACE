import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { checkOrderStatus } from '../api/useCheckout.ts';

export function PaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  const [status, setStatus] = useState<string>('pending');
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    const pollStatus = async () => {
      try {
        const currentStatus = await checkOrderStatus(orderId);
        if (
          currentStatus === 'paid' || currentStatus === 'processing' ||
          currentStatus === 'shipped' || currentStatus === 'completed'
        ) {
          setStatus('success');
          setIsPolling(false);
          return true; // indicates we should stop polling
        } else if (currentStatus === 'cancelled' || currentStatus === 'failed') {
          setStatus('failed');
          setIsPolling(false);
          return true;
        }
      } catch (_err) {
        // Continue
      }
      return false;
    };

    // Initial check
    let intervalId: ReturnType<typeof setInterval>;
    pollStatus().then((shouldStop) => {
      if (!shouldStop) {
        // Poll every 2 seconds
        intervalId = setInterval(async () => {
          const stop = await pollStatus();
          if (stop) clearInterval(intervalId);
        }, 2000);
      }
    });

    // Timeout after 30 seconds
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      setIsPolling(false);
      if (status === 'pending') {
        setStatus('timeout');
      }
    }, 30000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [orderId, navigate, status]);

  return (
    <div
      className='flex-1 flex flex-col w-full h-full md:items-center md:justify-center'
      role='main'
      aria-label='Status Pembayaran'
    >
      {isPolling
        ? (
          <section className='flex flex-col items-center justify-center w-full md:max-w-2xl md:h-auto md:min-h-[500px] bg-slate-950 text-white md:rounded-[2.5rem] md:shadow-2xl overflow-hidden p-8 sm:p-12 md:p-16 relative'>
            {/* Optimized Ambient Background (No Heavy Blurs) */}
            <div className='absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-950 to-slate-950 opacity-50' />

            <div className='relative z-10 text-center flex flex-col items-center w-full'>
              <div className='mb-8 w-24 h-24 sm:w-32 sm:h-32 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin flex-shrink-0' />
              <h1 className='text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 break-words w-full'>
                MEMPROSES<br />
                <span className='text-indigo-400'>STATUS.</span>
              </h1>
              <p className='text-base sm:text-lg text-slate-400 font-medium max-w-sm mx-auto'>
                Sedang memverifikasi pembayaran Anda secara aman. Mohon tunggu sebentar.
              </p>
            </div>
          </section>
        )
        : status === 'success'
        ? (
          <section className='flex flex-col items-center justify-center w-full md:max-w-2xl md:h-auto md:min-h-[500px] bg-emerald-950 text-white md:rounded-[2.5rem] md:shadow-2xl overflow-hidden p-8 sm:p-12 md:p-16 relative animate-in zoom-in-95 duration-500'>
            <div className='absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-emerald-950 to-emerald-950 opacity-50' />

            <div className='relative z-10 text-center flex flex-col items-center w-full'>
              <div className='mb-8 inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/30 ring-8 ring-emerald-500/20'>
                <CheckCircle2 className='w-12 h-12 sm:w-16 sm:h-16' strokeWidth={2.5} />
              </div>
              <h1 className='text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 break-words w-full'>
                PEMBAYARAN<br />
                <span className='text-emerald-400'>BERHASIL.</span>
              </h1>
              <p className='text-base sm:text-lg text-emerald-200/80 font-medium max-w-md mx-auto mb-10'>
                Pesanan Anda telah dikonfirmasi dan segera diproses untuk pengiriman. Terima kasih!
              </p>
              <button
                type='button'
                onClick={() => navigate('/')}
                className='group flex items-center justify-center gap-3 w-full max-w-sm mx-auto px-6 py-4 bg-white text-emerald-950 text-lg font-bold rounded-2xl hover:bg-emerald-400 hover:text-emerald-950 transition-all duration-300 shadow-xl'
              >
                <span>KEMBALI KE BERANDA</span>
                <svg
                  className='w-5 h-5 group-hover:translate-x-1 transition-transform'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2.5}
                    d='M14 5l7 7m0 0l-7 7m7-7H3'
                  />
                </svg>
              </button>
            </div>
          </section>
        )
        : (
          <section className='flex flex-col items-center justify-center w-full md:max-w-2xl md:h-auto md:min-h-[500px] bg-slate-950 text-white md:rounded-[2.5rem] md:shadow-2xl overflow-hidden p-8 sm:p-12 md:p-16 relative animate-in zoom-in-95 duration-500'>
            <div className='absolute inset-0 bg-gradient-to-br from-red-900/30 via-slate-950 to-slate-950 opacity-50' />

            <div className='relative z-10 text-center flex flex-col items-center w-full'>
              <div className='mb-8 inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 bg-red-500/10 text-red-500 rounded-full ring-8 ring-red-500/5'>
                <XCircle className='w-12 h-12 sm:w-16 sm:h-16' strokeWidth={2.5} />
              </div>
              <h1 className='text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 break-words w-full'>
                {status === 'timeout' ? 'WAKTU HABIS.' : 'GAGAL.'}
              </h1>
              <p className='text-base sm:text-lg text-slate-400 font-medium max-w-md mx-auto mb-10'>
                {status === 'timeout'
                  ? 'Sistem belum menerima konfirmasi. Jika sudah membayar, status akan diperbarui otomatis.'
                  : 'Mohon maaf, pembayaran Anda tidak dapat diproses dan pesanan dibatalkan.'}
              </p>
              <button
                type='button'
                onClick={() => navigate('/products')}
                className='group flex items-center justify-center gap-3 w-full max-w-sm mx-auto px-6 py-4 bg-white text-slate-900 text-lg font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-xl'
              >
                <span>BELANJA KEMBALI</span>
                <svg
                  className='w-5 h-5 group-hover:translate-x-1 transition-transform'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2.5}
                    d='M14 5l7 7m0 0l-7 7m7-7H3'
                  />
                </svg>
              </button>
            </div>
          </section>
        )}
    </div>
  );
}
