import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
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
        if (currentStatus === 'paid') {
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
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-md w-full text-center'>
        {isPolling
          ? (
            <>
              <div className='w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <Loader2 className='w-8 h-8 animate-spin' />
              </div>
              <h1 className='text-2xl font-bold mb-2'>Memproses Pembayaran</h1>
              <p className='text-gray-500'>
                Mohon tunggu, kami sedang memverifikasi pembayaran Anda...
              </p>
            </>
          )
          : status === 'success'
          ? (
            <>
              <div className='w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <CheckCircle2 className='w-8 h-8' />
              </div>
              <h1 className='text-2xl font-bold mb-2 text-green-600'>Pembayaran Berhasil</h1>
              <p className='text-gray-500 mb-8'>
                Pesanan Anda sedang diproses dan akan segera dikirim.
              </p>
              <button
                type='button'
                onClick={() => navigate('/')}
                className='w-full bg-black text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-800'
              >
                Kembali ke Beranda
              </button>
            </>
          )
          : (
            <>
              <div className='w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <XCircle className='w-8 h-8' />
              </div>
              <h1 className='text-2xl font-bold mb-2 text-red-600'>
                {status === 'timeout' ? 'Waktu Habis' : 'Pembayaran Gagal'}
              </h1>
              <p className='text-gray-500 mb-8'>
                {status === 'timeout'
                  ? 'Sistem kami belum menerima konfirmasi pembayaran. Silakan periksa status pesanan Anda nanti.'
                  : 'Pembayaran Anda tidak dapat diproses. Pesanan dibatalkan otomatis.'}
              </p>
              <button
                type='button'
                onClick={() => navigate('/products')}
                className='w-full bg-black text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-800'
              >
                Belanja Kembali
              </button>
            </>
          )}
      </div>
    </div>
  );
}
