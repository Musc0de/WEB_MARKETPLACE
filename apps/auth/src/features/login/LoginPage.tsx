import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@starsuperscare/ui';
import { Input } from '../../components/ui/Input.tsx';
import { notify } from '@starsuperscare/ui';
import { apiClient, parseApiError } from '../../lib/api.ts';
import { LoginSchema } from '../../lib/schemas.ts';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';

export function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();

  // Redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiClient.v1.me.profile.$get();
        if (res.ok) {
          const returnTo = searchParams.get('return_to');
          const dashboardUrl = (import.meta as any).env?.VITE_DASHBOARD_URL;

          if (returnTo) {
            if (returnTo.startsWith('/') && !returnTo.startsWith('//')) {
              if (dashboardUrl) {
                globalThis.location.href = `${dashboardUrl}${returnTo}`;
              }
            } else {
              globalThis.location.href = returnTo;
            }
          } else if (dashboardUrl) {
            globalThis.location.href = dashboardUrl;
          }
        }
      } catch (_e) {
        // Not logged in or network error, stay on login page
      }
    };
    checkAuth();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      LoginSchema.parse({ identifier, password });
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
      const res = await apiClient.v1.auth.login.$post({
        json: { identifier, password },
      });

      if (!res.ok) {
        const errorMsg = await parseApiError(res);
        notify.error(errorMsg);
        return;
      }

      notify.success('Login successful!');

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

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='w-full max-w-md mx-auto'
    >
      <motion.div variants={itemVariants} className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Selamat datang kembali</h1>
        <p className='text-gray-500 text-sm'>Silakan masuk ke akun Anda untuk melanjutkan</p>
      </motion.div>

      <form onSubmit={handleSubmit} noValidate className='space-y-5'>
        <motion.div variants={itemVariants}>
          <Input
            label='Username atau Email'
            type='text'
            value={identifier}
            onChange={(e: any) => setIdentifier(e.target.value)}
            error={errors.identifier}
            disabled={isLoading}
            placeholder='anda@contoh.com'
            autoComplete='username'
            icon={<Mail className='w-4 h-4 text-gray-400' />}
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
            autoComplete='current-password'
            icon={<Lock className='w-4 h-4 text-gray-400' />}
          />
        </motion.div>

        <motion.div variants={itemVariants} className='flex items-center justify-between mt-2'>
          <div className='flex items-center'>
            <input
              id='remember-me'
              name='remember-me'
              type='checkbox'
              className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer'
            />
            <label
              htmlFor='remember-me'
              className='ml-2 block text-sm text-gray-900 cursor-pointer'
            >
              Ingat saya
            </label>
          </div>
          <Link
            to='/forgot-password'
            className='text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors'
          >
            Lupa kata sandi?
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className='pt-2'>
          <Button
            type='submit'
            disabled={isLoading}
            className='w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all hover:shadow-lg active:scale-[0.98]'
          >
            {isLoading ? 'Masuk...' : 'Masuk'}
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className='text-center mt-6'>
          <p className='text-sm text-gray-600'>
            Belum punya akun?{' '}
            <Link
              to='/signup'
              className='font-semibold text-indigo-600 hover:text-indigo-500 transition-colors'
            >
              Daftar sekarang
            </Link>
          </p>
        </motion.div>
      </form>
    </motion.div>
  );
}
