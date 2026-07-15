import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Link, Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const AuthFallback = ({ error }: { error: Error }) => (
  <div className='p-6 bg-red-50 text-red-900 rounded-lg max-w-md w-full border border-red-200'>
    <h1 className='font-bold text-lg mb-2'>Authentication Error</h1>
    <pre className='text-sm bg-white/50 p-3 rounded mb-4 overflow-auto border border-red-100'>{error.message}</pre>
    <button
      type='button'
      onClick={() => globalThis.location.reload()}
      className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium shadow-sm'
    >
      Reload Page
    </button>
  </div>
);

export const AuthLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className='min-h-screen flex flex-col lg:flex-row bg-gray-50'>
      {/* Left Pane - Branding / Hero (Hidden on Mobile) */}
      <div className='hidden lg:flex lg:w-[45%] bg-gradient-to-br from-indigo-700 via-blue-800 to-indigo-900 text-white relative overflow-hidden flex-col justify-between p-12 shadow-2xl'>
        {/* Animated Background Shapes */}
        <div className='absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob'>
        </div>
        <div className='absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000'>
        </div>
        <div className='absolute bottom-[-10%] left-[20%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-4000'>
        </div>

        <div className='relative z-10'>
          <Link
            to='/'
            className='inline-flex items-center gap-2 hover:opacity-90 transition-opacity'
          >
            <div className='bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/20'>
              <ShieldCheck className='w-8 h-8 text-white' />
            </div>
            <span className='font-extrabold text-2xl tracking-tight text-white'>
              StarSuperScare
            </span>
          </Link>
        </div>

        <div className='relative z-10 max-w-lg mt-12 mb-auto pb-12 pt-24'>
          <h1 className='text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-white'>
            Akses Aman, Cepat, & <br />
            <span className='text-blue-300'>Dapat Diandalkan</span>.
          </h1>
          <p className='text-lg text-indigo-100 mb-10 leading-relaxed font-medium'>
            Bergabunglah dengan ribuan pengguna yang mempercayakan StarSuperScare untuk mengelola aset digital mereka dan melacak pesanan secara mulus di satu platform terpadu.
          </p>

          {/* Social Proof */}
          <div className='flex items-center gap-4'>
            <div className='flex -space-x-3'>
              {['A', 'B', 'C', 'D'].map((initial, i) => (
                <div
                  key={i}
                  className='w-10 h-10 rounded-full border-2 border-indigo-800 bg-gradient-to-tr from-blue-400 to-indigo-400 flex items-center justify-center text-xs font-bold text-white shadow-sm z-10 relative'
                >
                  {initial}
                </div>
              ))}
            </div>
            <div className='text-sm font-medium text-indigo-100'>
              Lebih dari <strong className='text-white'>10.000+</strong> pengguna
            </div>
          </div>
        </div>

        <div className='relative z-10 text-indigo-200/60 text-sm font-medium'>
          &copy; {new Date().getFullYear()} StarSuperScare Inc. Hak Cipta Dilindungi.
        </div>
      </div>

      {/* Right Pane - Content (Form) */}
      <div className='w-full lg:w-[55%] flex flex-col px-4 sm:px-6 lg:px-20 xl:px-32 bg-white relative min-h-screen overflow-y-auto py-12 lg:py-16'>
        {/* Subtle mobile background */}
        <div className='absolute inset-0 bg-gray-50/50 lg:hidden'></div>

        <div className='mx-auto w-full max-w-2xl relative z-10 my-auto'>
          {/* Mobile Logo */}
          <div className='lg:hidden mb-10 text-center flex flex-col items-center justify-center'>
            <Link to='/' className='inline-flex items-center gap-2'>
              <div className='bg-indigo-600 p-2 rounded-xl shadow-md'>
                <ShieldCheck className='w-8 h-8 text-white' />
              </div>
              <span className='font-extrabold text-3xl tracking-tight text-gray-900'>
                StarSuperScare
              </span>
            </Link>
          </div>

          <div className='w-full'>
            <ErrorBoundary FallbackComponent={AuthFallback}>
              {children || <Outlet />}
            </ErrorBoundary>
          </div>

          {/* Support & Legal Links */}
          <div className='mt-12 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-gray-500'>
            <Link to='/help' className='hover:text-gray-900 transition-colors'>
              Pusat Bantuan
            </Link>
            <Link to='/privacy' className='hover:text-gray-900 transition-colors'>
              Kebijakan Privasi
            </Link>
            <Link to='/terms' className='hover:text-gray-900 transition-colors'>
              Syarat & Ketentuan
            </Link>
          </div>
          <p className='mt-4 text-center lg:hidden text-xs text-gray-500'>&copy; {new Date().getFullYear()} StarSuperScare</p>
        </div>
      </div>
    </div>
  );
};
