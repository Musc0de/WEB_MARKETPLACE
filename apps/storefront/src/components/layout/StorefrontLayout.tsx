import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { client } from '../../lib/api.ts';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [accountUrl, setAccountUrl] = useState(`${(import.meta as any).env.VITE_AUTH_URL}/login`);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await client.v1.auth.me.$get();
        if (res.ok) {
          const dashboardUrl = (import.meta as any).env?.VITE_DASHBOARD_URL;
          setAccountUrl(dashboardUrl ? dashboardUrl : 'http://localhost:5175');
        }
      } catch (err) {
        // ignore error, default to login url
      }
    };
    checkSession();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-white'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4 sm:px-8'>
        <div className='flex items-center gap-6'>
          <a href='/' className='font-bold text-xl tracking-tight text-gray-900'>
            StarSuperScare
          </a>
          <nav className='hidden md:flex gap-6'>
            <a
              href='/categories'
              className='text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors'
            >
              Kategori
            </a>
            <a
              href='/brands'
              className='text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors'
            >
              Brand
            </a>
          </nav>
        </div>
        <div className='flex flex-1 justify-center px-6 hidden lg:flex'>
          <form onSubmit={handleSearch} className='w-full max-w-lg relative'>
            <input
              type='search'
              placeholder='Cari produk...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full h-10 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
            />
          </form>
        </div>
        <div className='flex items-center gap-4'>
          <a href='/cart' className='p-2 text-gray-600 hover:text-gray-900 transition-colors'>
            {/* Simple Cart Icon */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='8' cy='21' r='1' />
              <circle cx='19' cy='21' r='1' />
              <path d='M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' />
            </svg>
          </a>
          <a
            href={accountUrl}
            className='p-2 text-gray-600 hover:text-gray-900 transition-colors hidden sm:block'
          >
            {/* Simple User Icon */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
              <circle cx='12' cy='7' r='4' />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className='border-t bg-gray-50 mt-12 py-12'>
      <div className='container mx-auto px-4 sm:px-8'>
        <div className='flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4'>
          <div>
            &copy; {new Date().getFullYear()} StarSuperScare. All rights reserved.
          </div>
          <div className='flex gap-6'>
            <a href='/terms' className='hover:text-gray-900 transition-colors'>
              Syarat & Ketentuan
            </a>
            <a href='/privacy' className='hover:text-gray-900 transition-colors'>
              Kebijakan Privasi
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const StorefrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900'>
      <Header />
      <main className='flex-1 w-full container mx-auto px-4 sm:px-8 py-6'>
        <ErrorBoundary
          fallback={
            <div className='p-6 bg-red-50 text-red-900 rounded-lg'>
              Terjadi kesalahan pada sistem. Silakan muat ulang halaman.
            </div>
          }
        >
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};
