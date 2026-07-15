import React, { useEffect } from 'react';
import { useSession } from './useSession.ts';
import { AUTH_URL } from '../../lib/api.ts';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading, isError } = useSession();

  useEffect(() => {
    if (!isLoading && (!session || isError)) {
      // Redirect to auth if not logged in
      const currentUrl = encodeURIComponent(
        globalThis.location.pathname + globalThis.location.search,
      );
      globalThis.location.href = `${AUTH_URL}/login?return_to=${currentUrl}`;
    }
  }, [session, isLoading, isError]);

  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-gray-50'>
        <div className='flex flex-col items-center gap-4'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900'>
          </div>
          <p className='text-sm text-gray-500'>Memeriksa sesi...</p>
        </div>
      </div>
    );
  }

  if (!session || isError) {
    // Will be redirecting, render blank or a message
    return (
      <div className='flex h-screen w-full items-center justify-center bg-gray-50'>
        <p className='text-gray-500'>Mengarahkan ke halaman login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
