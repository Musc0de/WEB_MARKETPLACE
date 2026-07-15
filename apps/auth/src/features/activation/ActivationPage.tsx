import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@starsuperscare/ui';
import { Input } from '../../components/ui/Input.tsx';
import { notify } from '@starsuperscare/ui';
import { apiClient, parseApiError } from '../../lib/api.ts';
import { ActivationSchema } from '../../lib/schemas.ts';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, User, XCircle } from 'lucide-react';

export function ActivationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!token) {
      notify.error('Activation token is missing');
      return;
    }

    try {
      ActivationSchema.parse({ username, password });
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        (err as z.ZodError<any>).issues.forEach((e: any) => {
          if (e.path[0]) newErrors[e.path[0].toString()] = e.message;
        });
        setErrors(newErrors);
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await apiClient.v1.auth.activation.$post({
        json: { token, newPassword: password, username },
      });

      if (!res.ok) {
        const errorMsg = await parseApiError(res);
        notify.error(errorMsg);
        return;
      }

      setIsSuccess(true);
      notify.success('Account activated successfully!');

      // Redirect directly to dashboard or returnTo URL
      setTimeout(() => {
        const returnTo = searchParams.get('return_to');
        const dashboardUrl = (import.meta as any).env?.VITE_DASHBOARD_URL;

        if (returnTo) {
          if (returnTo.startsWith('/') && !returnTo.startsWith('//')) {
            if (!dashboardUrl) throw new Error('VITE_DASHBOARD_URL is missing');
            globalThis.location.href = `${dashboardUrl}${returnTo}`;
          } else {
            globalThis.location.href = returnTo;
          }
        } else {
          if (!dashboardUrl) throw new Error('VITE_DASHBOARD_URL is missing');
          globalThis.location.href = dashboardUrl;
        }
      }, 1500);
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
          Akun Diaktifkan!
        </h1>
        <p className='text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed'>
          Akun Anda telah sepenuhnya aktif. Mengarahkan Anda ke dasbor...
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
          Token aktivasi tidak ditemukan atau tidak valid. Silakan periksa email Anda dan gunakan tautan yang diberikan.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='w-full max-w-md mx-auto'
    >
      <motion.div variants={itemVariants} className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Aktifkan Akun</h1>
        <p className='text-gray-500 text-sm'>
          Silakan atur nama pengguna dan kata sandi Anda untuk melanjutkan.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} noValidate className='space-y-5'>
        <motion.div variants={itemVariants}>
          <Input
            label='Username'
            type='text'
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
            error={errors.username}
            disabled={isLoading}
            placeholder='nama_keren'
            autoComplete='username'
            icon={<User className='w-4 h-4 text-gray-400' />}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            label='Kata Sandi'
            type='password'
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            error={errors.password}
            disabled={isLoading}
            placeholder='••••••••'
            autoComplete='new-password'
            icon={<Lock className='w-4 h-4 text-gray-400' />}
          />
        </motion.div>

        <motion.div variants={itemVariants} className='pt-2'>
          <Button
            type='submit'
            disabled={isLoading}
            className='w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all hover:shadow-lg active:scale-[0.98]'
          >
            {isLoading ? 'Mengaktifkan...' : 'Aktifkan Akun'}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
