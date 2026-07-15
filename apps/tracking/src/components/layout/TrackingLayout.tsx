import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const TrackingFallback = ({ error }: { error: Error }) => (
  <div className='p-6 bg-red-50 text-red-900 rounded-lg max-w-xl mx-auto mt-12 shadow-sm border border-red-100'>
    <h1 className='font-bold text-lg mb-2'>Kesalahan Sistem Pelacakan</h1>
    <pre className='text-sm bg-red-100 p-3 rounded mb-4 overflow-auto'>{error.message}</pre>
    <button
      type='button'
      onClick={() => globalThis.location.reload()}
      className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium'
    >
      Muat Ulang
    </button>
  </div>
);

export const TrackingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storefrontUrl = (import.meta as any).env?.VITE_STOREFRONT_URL;
  const dashboardUrl = (import.meta as any).env?.VITE_DASHBOARD_URL;
  const authUrl = (import.meta as any).env?.VITE_AUTH_URL;

  if (!storefrontUrl) {
    throw new Error('VITE_STOREFRONT_URL environment variable is missing.');
  }
  
  if (!dashboardUrl) {
    throw new Error('VITE_DASHBOARD_URL environment variable is missing.');
  }

  if (!authUrl) {
    throw new Error('VITE_AUTH_URL environment variable is missing.');
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900'>
      {/* Minimal Header */}
      <header className='bg-white border-b border-gray-200'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between'>
          <a
            href={storefrontUrl}
            className='font-bold text-xl tracking-tight text-blue-600 hover:text-blue-700 transition-colors'
          >
            StarSuperScare
          </a>
          <nav className='flex items-center gap-4 text-sm font-medium'>
            <a
              href={`${authUrl}/help`}
              className='text-gray-500 hover:text-gray-900 transition-colors'
            >
              Bantuan
            </a>
            <a
              href={dashboardUrl}
              className='text-gray-500 hover:text-gray-900 transition-colors'
            >
              Dasbor
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content Area - Centered Card Style */}
      <main className='flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12'>
        <ErrorBoundary FallbackComponent={TrackingFallback}>
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]'>
            {children}
          </div>
        </ErrorBoundary>
      </main>

      {/* Minimal Footer */}
      <footer className='py-8 text-center text-xs text-gray-400'>
        <p>&copy; {new Date().getFullYear()} StarSuperScare. Seluruh hak cipta dilindungi.</p>
      </footer>
    </div>
  );
};
