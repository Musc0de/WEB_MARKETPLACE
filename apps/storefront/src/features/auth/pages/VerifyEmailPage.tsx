import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@starsuperscare/ui';
import { client } from '../../../lib/api.ts';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState<
    'loading' | 'success' | 'already_verified' | 'error' | 'resend_success' | 'resend_error'
  >('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCountdown > 0) {
      timer = globalThis.setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    }
    return () => globalThis.clearTimeout(timer);
  }, [resendCountdown]);

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    try {
      setResendCountdown(60); // 60s cooldown
      const resendRes = await fetch(
        `${(import.meta as any).env.VITE_API_URL}/v1/auth/verify-email/resend`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        },
      );
      if (resendRes.ok) {
        setStatus('resend_success');
        toast.success('Link verifikasi baru telah dikirim ke email Anda.');
      } else {
        const data = await resendRes.json();
        toast.error(data.error?.message || 'Gagal mengirim ulang email.');
        // If rate limited, keep countdown, else maybe reset it
      }
    } catch (_resendErr) {
      toast.error('Gagal memverifikasi email.');
      setResendCountdown(0);
    }
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Token tidak valid atau tidak ditemukan.');
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const verifyToken = async () => {
      try {
        const res = await fetch(`${(import.meta as any).env.VITE_API_URL}/v1/auth/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          if (data.data?.alreadyVerified) {
            setStatus('already_verified');
            toast.success('Email Anda sudah terverifikasi sebelumnya.');
          } else {
            setStatus('success');
            toast.success('Email Anda berhasil diverifikasi. Tunggu sebentar...');
          }
          
          setTimeout(async () => {
            try {
              const meRes = await client.v1.auth.me.$get();
              if (meRes.ok) {
                globalThis.location.href = (import.meta as any).env.VITE_STOREFRONT_URL || '/';
                return;
              }
            } catch (_err) {
              // ignore
            }
            globalThis.location.href = `${(import.meta as any).env.VITE_AUTH_URL}/login`;
          }, 3000);
        } else {
          setStatus('error');
          setErrorMessage(
            data.error?.message || 'Gagal memverifikasi email. Tautan mungkin telah kedaluwarsa.',
          );
        }
      } catch (_err) {
        setStatus('error');
        setErrorMessage('Terjadi kesalahan jaringan.');
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className='flex flex-col items-center justify-center py-24 text-center'>
      <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full'>
        {status === 'loading' && (
          <>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
              Memverifikasi Email...
            </h1>
            <p className='mt-4 text-sm text-gray-600'>
              Harap tunggu sebentar, kami sedang memverifikasi token Anda.
            </p>
          </>
        )}

        {(status === 'success' || status === 'already_verified') && (
          <>
            <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4'>
              <svg
                className='h-6 w-6 text-green-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
              {status === 'already_verified' ? 'Sudah Terverifikasi' : 'Berhasil!'}
            </h1>
            <p className='mt-4 text-sm text-gray-600'>
              {status === 'already_verified'
                ? 'Email Anda telah diverifikasi sebelumnya. Anda akan segera diarahkan...'
                : 'Email Anda telah berhasil diverifikasi. Anda akan segera diarahkan...'}
            </p>
            <button
              type='button'
              onClick={async () => {
                try {
                  const meRes = await client.v1.auth.me.$get();
                  if (meRes.ok) {
                    globalThis.location.href = (import.meta as any).env.VITE_STOREFRONT_URL || '/';
                    return;
                  }
                } catch (_err) {
                  // ignore error
                }
                globalThis.location.href = `${(import.meta as any).env.VITE_AUTH_URL}/login`;
              }}
              className='mt-6 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:text-sm'
            >
              Lanjutkan
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4'>
              <svg
                className='h-6 w-6 text-red-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </div>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>Verifikasi Gagal</h1>
            <p className='mt-4 text-sm text-red-600'>{errorMessage}</p>
            <button
              type='button'
              onClick={() => navigate('/')}
              className='mt-6 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm'
            >
              Kembali ke Beranda
            </button>
            <button
              type='button'
              onClick={handleResend}
              disabled={resendCountdown > 0}
              className='mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {resendCountdown > 0
                ? `Kirim Ulang (${resendCountdown}s)`
                : 'Kirim Ulang Email Verifikasi'}
            </button>
          </>
        )}

        {status === 'resend_success' && (
          <>
            <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4'>
              <svg
                className='h-6 w-6 text-blue-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
            </div>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>Link Kadaluwarsa</h1>
            <p className='mt-4 text-sm text-gray-600'>
              Link verifikasi sebelumnya sudah tidak berlaku. Kami telah{' '}
              <strong>mengirim ulang</strong>{' '}
              link verifikasi yang baru ke email Anda. Silakan periksa kotak masuk (inbox) atau
              folder spam Anda.
            </p>
            <button
              type='button'
              onClick={() => navigate('/')}
              className='mt-6 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm'
            >
              Kembali ke Beranda
            </button>
          </>
        )}
      </div>
    </div>
  );
}
