import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiClient, parseApiError } from '../../lib/api.ts';
import { motion } from 'framer-motion';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectingTo, setRedirectingTo] = useState<'storefront' | 'auth' | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Token verifikasi tidak ditemukan.');
      return;
    }

    let isMounted = true;

    const verifyToken = async () => {
      try {
        const res = await apiClient.v1.auth['verify-email'].$post({
          json: { token },
        });

        if (!isMounted) return;

        if (!res.ok) {
          const msg = await parseApiError(res);
          setStatus('error');
          setErrorMessage(msg);
          return;
        }

        setStatus('success');

        // Cek sesi login
        try {
          const meRes = await apiClient.v1.auth.me.$get();
          if (meRes.ok) {
            setRedirectingTo('storefront');
            const storefrontUrl = (import.meta as any).env?.VITE_STOREFRONT_URL;
            setTimeout(() => {
              globalThis.location.href = storefrontUrl;
            }, 3000);
          } else {
            setRedirectingTo('auth');
            const authUrl = (import.meta as any).env?.VITE_AUTH_URL;
            setTimeout(() => {
              globalThis.location.href = `${authUrl}/login`;
            }, 3000);
          }
        } catch (_e) {
          setRedirectingTo('auth');
          const authUrl = (import.meta as any).env?.VITE_AUTH_URL;
          setTimeout(() => {
            globalThis.location.href = `${authUrl}/login`;
          }, 3000);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setStatus('error');
        setErrorMessage(err.message || 'Terjadi kesalahan jaringan.');
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className='w-full max-w-md mx-auto text-center'>
      {status === 'loading' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex flex-col items-center'
        >
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>Memverifikasi Email...</h1>
          <p className='text-gray-500 mb-6'>
            Mohon tunggu sebentar, kami sedang memverifikasi alamat email Anda.
          </p>
          <div className='w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin'>
          </div>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='flex flex-col items-center'
        >
          <div className='w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6'>
            <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={3}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>Email Berhasil Diverifikasi!</h1>
          <p className='text-gray-500 mb-6'>
            Alamat email Anda telah berhasil diverifikasi. Anda sekarang memiliki akses penuh.
          </p>

          {redirectingTo && (
            <p className='text-indigo-600 text-sm font-medium animate-pulse'>
              {redirectingTo === 'storefront'
                ? 'Anda sudah login. Mengalihkan ke Storefront...'
                : 'Mengalihkan ke halaman Login...'}
            </p>
          )}
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col items-center'
        >
          <div className='w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6'>
            <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>Verifikasi Gagal</h1>
          <p className='text-gray-500 mb-6'>{errorMessage}</p>
          <button
            type='button'
            onClick={() => globalThis.location.href = '/login'}
            className='px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors'
          >
            Kembali ke Halaman Login
          </button>
        </motion.div>
      )}
    </div>
  );
}
