import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@starsuperscare/ui';
import { Input } from '../../components/ui/Input.tsx';
import { notify } from '@starsuperscare/ui';
import { apiClient, parseApiError } from '../../lib/api.ts';
import { ForgotPasswordSchema } from '../../lib/schemas.ts';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      ForgotPasswordSchema.parse({ email });
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
      const res = await apiClient.v1.auth['forgot-password'].$post({
        json: { email },
      });

      if (!res.ok) {
        const errorMsg = await parseApiError(res);
        notify.error(errorMsg);
        return;
      }

      setIsSuccess(true);
      notify.success('Reset instructions sent');
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
          Periksa Email Anda
        </h1>
        <p className='text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed'>
          Jika akun untuk <strong className='text-gray-900'>{email}</strong>{' '}
          terdaftar, kami telah mengirimkan instruksi atur ulang kata sandi.
        </p>
        <Link
          to='/login'
          className='inline-flex justify-center px-6 py-2.5 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors'
        >
          Kembali ke Login
        </Link>
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
        <Link
          to='/login'
          className='inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors'
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          Kembali ke login
        </Link>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Lupa Kata Sandi</h1>
        <p className='text-gray-500 text-sm'>
          Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata
          sandi Anda.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} noValidate className='space-y-5'>
        <motion.div variants={itemVariants}>
          <Input
            label='Alamat Email'
            type='email'
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            error={errors.email}
            disabled={isLoading}
            placeholder='anda@contoh.com'
            autoComplete='email'
            icon={<Mail className='w-4 h-4 text-gray-400' />}
          />
        </motion.div>

        <motion.div variants={itemVariants} className='pt-2'>
          <Button
            type='submit'
            disabled={isLoading}
            className='w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all hover:shadow-lg active:scale-[0.98]'
          >
            {isLoading ? 'Mengirim...' : 'Kirim Tautan Atur Ulang'}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
