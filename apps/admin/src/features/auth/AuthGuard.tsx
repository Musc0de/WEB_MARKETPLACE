import React, { useEffect } from 'react';
import { Loader2, LogIn, ShieldCheck } from 'lucide-react';

import { useAuth } from './AuthContext.tsx';

interface AuthGuardProps {
  children: React.ReactNode;
  requirePermission?: string;
}

export function AuthGuard({ children, requirePermission }: AuthGuardProps) {
  const { isAuthenticated, isLoading, permissions } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const authUrl = (import.meta as any).env?.VITE_AUTH_URL;
      if (!authUrl) throw new Error('VITE_AUTH_URL is missing in environment variables');
      globalThis.location.href = `${authUrl}/login?return_to=${
        encodeURIComponent(globalThis.location.href)
      }`;
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-[#0c0e12] p-4 text-center'>
        <div className='relative flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-500/10 shadow-inner mb-6'>
          <ShieldCheck className='h-10 w-10 text-indigo-600 dark:text-indigo-400' />
          <div className='absolute inset-0 rounded-3xl border-2 border-indigo-600/20 dark:border-indigo-400/20'>
          </div>
          <div className='absolute -inset-1 animate-pulse rounded-3xl bg-indigo-500/20 blur-xl'>
          </div>
        </div>
        <Loader2 className='h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400 mb-4' />
        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>Memuat Sesi Admin</h2>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Sedang memverifikasi kredensial Anda...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-[#0c0e12] p-4 text-center'>
        <div className='relative flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500/10 shadow-inner mb-6'>
          <LogIn className='h-10 w-10 text-emerald-600 dark:text-emerald-400' />
        </div>
        <Loader2 className='h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400 mb-4' />
        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
          Mengalihkan ke Portal Login
        </h2>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Silakan masuk untuk melanjutkan akses ke area admin.
        </p>
      </div>
    );
  }

  if (requirePermission && !permissions.includes(requirePermission)) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h2>Forbidden</h2>
        <p>
          You do not have the required permission: <strong>{requirePermission}</strong>
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
