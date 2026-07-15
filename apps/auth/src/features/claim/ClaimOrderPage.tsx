import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@starsuperscare/ui';
import { notify } from '@starsuperscare/ui';
import { apiClient, parseApiError } from '../../lib/api.ts';
import { motion } from 'framer-motion';
import { CheckCircle2, PackageOpen, XCircle } from 'lucide-react';

export function ClaimOrderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const claimOrder = async () => {
    if (!token) return;
    setIsLoading(true);
    setHasAttempted(true);
    try {
      const res = await apiClient.v1.auth['claim-order'].$post({
        json: { token },
      });

      if (!res.ok) {
        const errorMsg = await parseApiError(res);
        notify.error(errorMsg);
        return;
      }

      setIsSuccess(true);
      notify.success('Order successfully claimed!');

      // Redirect directly to dashboard or login
      setTimeout(() => {
        const dashboardUrl = (import.meta as any).env?.VITE_DASHBOARD_URL;
        if (!dashboardUrl) throw new Error('VITE_DASHBOARD_URL is missing');
        globalThis.location.href = dashboardUrl;
      }, 2000);
    } catch (err: any) {
      notify.error(err.message || 'Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className='w-full text-center'
      >
        <div className='mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6'>
          <CheckCircle2 className='w-8 h-8' />
        </div>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>
          Pesanan Diklaim!
        </h1>
        <p className='text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed'>
          Pesanan ini telah berhasil ditautkan ke akun Anda. Mengarahkan Anda ke dasbor...
        </p>
      </motion.div>
    );
  }

  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className='w-full text-center'
      >
        <div className='mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6'>
          <XCircle className='w-8 h-8' />
        </div>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Permintaan Tidak Valid</h1>
        <p className='text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed'>
          Tautan klaim tidak valid atau token tidak ditemukan. Silakan gunakan tautan persis yang dikirimkan ke email Anda.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='w-full max-w-md mx-auto text-center'
    >
      <motion.div variants={itemVariants} className='mb-8 flex flex-col items-center'>
        <div className='w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm rotate-3'>
          <PackageOpen className='w-8 h-8' />
        </div>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Klaim Pesanan Anda</h1>
        <p className='text-gray-500 text-sm max-w-xs mx-auto'>
          Klik tombol di bawah ini untuk menautkan pesanan ini ke akun Anda secara aman.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className='pt-2 w-full'>
        <Button
          onClick={claimOrder}
          disabled={isLoading || hasAttempted}
          className='w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all hover:shadow-lg active:scale-[0.98]'
        >
          {isLoading ? 'Mengklaim Pesanan...' : 'Klaim Pesanan'}
        </Button>

        {hasAttempted && !isSuccess && !isLoading && (
          <div className='mt-6'>
            <p className='text-red-600 mb-4 text-sm font-medium'>
              Gagal mengklaim pesanan. Tautan mungkin telah kedaluwarsa atau sudah pernah digunakan.
            </p>
            <Link
              to='/login'
              className='text-indigo-600 hover:text-indigo-700 text-sm font-semibold transition-colors'
            >
              Masuk ke Akun
            </Link>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
