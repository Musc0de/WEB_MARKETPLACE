import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { client } from '../../lib/api.ts';
import { useCart } from '../../features/cart/api/useCart.ts';

/** Animated cart badge — bounces every time itemCount changes */
const CartBadge = ({ count }: { count: number }) => {
  const [animKey, setAnimKey] = useState(0);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count !== prevCount.current) {
      setAnimKey((k) => k + 1); // force re-mount to replay animation
      prevCount.current = count;
    }
  }, [count]);

  if (count <= 0) return null;

  return (
    <span
      key={animKey}
      style={{
        animation: 'cartBadgeBounce 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
      }}
      className='absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full shadow-sm'
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [accountUrl, setAccountUrl] = useState(`${(import.meta as any).env.VITE_AUTH_URL}/login`);
  const { cart } = useCart();
  // Use TOTAL QUANTITY (sum of all item quantities) so the badge animates
  // every time any item is added — even if it's a quantity increment.
  const cartItemCount = cart?.items?.reduce(
    (sum: number, item: any) => sum + (item.quantity || 1),
    0,
  ) || 0;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await client.v1.auth.me.$get();
        if (res.ok) {
          const dashboardUrl = (import.meta as any).env?.VITE_DASHBOARD_URL;
          setAccountUrl(dashboardUrl);
        }
      } catch (_err) {
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
    <header className='sticky top-0 z-50 w-full border-b bg-white shadow-sm'>
      {/* Top Utility Bar (Desktop only) */}
      <div className='hidden md:block bg-gray-900 text-white py-1 px-4 text-xs text-center'>
        <p>Gratis ongkir untuk pesanan di atas Rp 500.000!</p>
      </div>

      <div className='max-w-[1360px] mx-auto flex flex-col md:flex-row md:h-16 items-center justify-between px-4 py-3 md:py-0 gap-3 md:gap-6'>
        <div className='flex items-center justify-between w-full md:w-auto'>
          <a href='/' className='font-bold text-2xl tracking-tight text-blue-600'>
            StarSuperScare
          </a>
          <div className='flex md:hidden gap-3 items-center'>
            {/* Mobile Cart Icon */}
            <a
              href='/cart'
              className='p-2 text-gray-600 hover:text-blue-600 transition-colors relative'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='22'
                height='22'
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
              <CartBadge count={cartItemCount} />
            </a>
          </div>
        </div>

        {/* Mega Menu Placeholder (Desktop) */}
        <nav className='hidden md:flex gap-6 shrink-0'>
          <a
            href='/categories'
            className='text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors'
          >
            Kategori
          </a>
          <a
            href='/brands'
            className='text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors'
          >
            Brand
          </a>
          <a
            href='/promo'
            className='text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors'
          >
            Promo
          </a>
          <a
            href='/tracking'
            className='text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors'
          >
            Lacak Pesanan
          </a>
        </nav>

        {/* Dominant Search Bar */}
        <div className='flex flex-1 w-full justify-center'>
          <form onSubmit={handleSearch} className='w-full max-w-2xl relative'>
            <input
              type='search'
              placeholder='Cari produk, kategori, atau brand...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full h-11 pl-4 pr-10 rounded-full border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all'
            />
            <button
              type='submit'
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='11' cy='11' r='8' />
                <path d='m21 21-4.3-4.3' />
              </svg>
            </button>
          </form>
        </div>

        {/* Action Icons (Desktop) */}
        <div className='hidden md:flex items-center gap-2 shrink-0'>
          <a
            href='/wishlist'
            className='p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 rounded-full transition-colors'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='22'
              height='22'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' />
            </svg>
          </a>
          <a
            href='/cart'
            className='p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 rounded-full transition-colors relative'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='22'
              height='22'
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
            <CartBadge count={cartItemCount} />
          </a>
          <div className='w-px h-6 bg-gray-300 mx-2' />
          <a
            href={accountUrl}
            className='p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 rounded-full transition-colors'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='22'
              height='22'
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

const MobileBottomNav = () => {
  const location = useLocation();
  const [accountUrl, setAccountUrl] = useState(`${(import.meta as any).env.VITE_AUTH_URL}/login`);

  useEffect(() => {
    setAccountUrl(
      `${(import.meta as any).env.VITE_AUTH_URL}/login?return_to=${
        encodeURIComponent(globalThis.location.href)
      }`,
    );
    // Ideally check session here too for correct account routing on mobile
  }, [location]);

  return (
    <nav className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe'>
      <div className='flex justify-around items-center h-14'>
        <a
          href='/'
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            location.pathname === '/' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
            <polyline points='9 22 9 12 15 12 15 22' />
          </svg>
          <span className='text-[10px] font-medium'>Home</span>
        </a>
        <a
          href='/categories'
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            location.pathname.startsWith('/categories')
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <rect width='7' height='7' x='3' y='3' rx='1' />
            <rect width='7' height='7' x='14' y='3' rx='1' />
            <rect width='7' height='7' x='14' y='14' rx='1' />
            <rect width='7' height='7' x='3' y='14' rx='1' />
          </svg>
          <span className='text-[10px] font-medium'>Kategori</span>
        </a>
        <a
          href='/wishlist'
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            location.pathname === '/wishlist'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' />
          </svg>
          <span className='text-[10px] font-medium'>Wishlist</span>
        </a>
        <a
          href={accountUrl}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-gray-900`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
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
          <span className='text-[10px] font-medium'>Akun</span>
        </a>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className='border-t bg-white mt-12 pt-12 pb-24 md:pb-12'>
      <div className='max-w-[1360px] mx-auto px-4 sm:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          <div className='col-span-1 md:col-span-2'>
            <h3 className='font-bold text-lg mb-4 text-blue-600'>StarSuperScare</h3>
            <p className='text-gray-500 text-sm max-w-sm'>
              Marketplace terpercaya untuk segala kebutuhan digital dan fisik Anda. Belanja aman,
              cepat, dan nyaman.
            </p>
          </div>
          <div>
            <h4 className='font-semibold text-gray-900 mb-4'>Layanan Pelanggan</h4>
            <ul className='space-y-2 text-sm text-gray-500'>
              <li>
                <a href='/help' className='hover:text-blue-600 transition-colors'>Bantuan</a>
              </li>
              <li>
                <a href='/returns' className='hover:text-blue-600 transition-colors'>
                  Pengembalian Dana
                </a>
              </li>
              <li>
                <a
                  href='/tracking'
                  className='hover:text-blue-600 transition-colors'
                >
                  Lacak Pesanan
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='font-semibold text-gray-900 mb-4'>Jelajahi</h4>
            <ul className='space-y-2 text-sm text-gray-500'>
              <li>
                <a href='/about' className='hover:text-blue-600 transition-colors'>Tentang Kami</a>
              </li>
              <li>
                <a href='/terms' className='hover:text-blue-600 transition-colors'>
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href='/privacy' className='hover:text-blue-600 transition-colors'>
                  Kebijakan Privasi
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className='border-t pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400'>
          <p>&copy; {new Date().getFullYear()} StarSuperScare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export const StorefrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900 pb-14 md:pb-0'>
      <Header />
      <main className='flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-8 py-6'>
        <ErrorBoundary
          fallback={
            <div className='p-6 bg-red-50 text-red-900 rounded-lg border border-red-200 shadow-sm'>
              <h3 className='font-semibold mb-2'>Terjadi Kesalahan</h3>
              <p className='text-sm'>Gagal memuat komponen. Silakan muat ulang halaman.</p>
            </div>
          }
        >
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};
