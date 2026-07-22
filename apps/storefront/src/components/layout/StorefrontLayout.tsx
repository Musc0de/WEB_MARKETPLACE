import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { client } from '../../lib/api.ts';
import { useCart } from '../../features/cart/api/useCart.ts';
import { useAuth } from '../../features/auth/api/useAuth.ts';
import { SEO } from '@starsuperscare/ui';
import { Heart, Search, ShoppingCart, User } from 'lucide-react';

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
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { session } = useAuth();

  const authUrl = (import.meta as any).env?.VITE_AUTH_URL || '';
  const dashboardUrl = (import.meta as any).env?.VITE_DASHBOARD_URL || '';
  const [accountUrl, setAccountUrl] = useState(`${authUrl}/login`);
  const [wishlistUrl, setWishlistUrl] = useState(
    `${authUrl}/login?returnUrl=${encodeURIComponent(`${dashboardUrl}/wishlist`)}`,
  );
  const { cart } = useCart();
  const cartItemCount = cart?.items?.reduce(
    (sum: number, item: any) => sum + (item.quantity || 1),
    0,
  ) || 0;

  useEffect(() => {
    if (session) {
      setAccountUrl(dashboardUrl);
      setWishlistUrl(`${dashboardUrl}/wishlist`);
    } else {
      setAccountUrl(`${authUrl}/login`);
      setWishlistUrl(
        `${authUrl}/login?returnUrl=${encodeURIComponent(`${dashboardUrl}/wishlist`)}`,
      );
    }
  }, [session, dashboardUrl, authUrl]);

  // Sync global search bar with URL parameter if on /search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (location.pathname === '/search' && q) {
      setSearchQuery(q);
    } else if (location.pathname !== '/search') {
      setSearchQuery('');
    }
  }, [location.search, location.pathname]);

  // Fetch search suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSuggestionsLoading(true);
        const res = await client.v1.catalog.products.$get({
          query: {
            page: '1',
            per_page: '5',
            search: searchQuery.trim(),
            sort: 'newest',
            in_stock: 'false',
          } as any,
        });
        if (res.ok) {
          const payload: any = await res.json();
          setSuggestions(payload.data?.items || []);
        }
      } catch (_err) {
        // ignore error
      } finally {
        setIsSuggestionsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/85 backdrop-blur-xl shadow-sm'>
      {/* Top Utility Bar (Desktop only) */}
      <div className='hidden md:block bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-1.5 px-4 text-xs text-center font-medium'>
        <p>Gratis ongkir untuk pesanan di atas Rp 500.000!</p>
      </div>

      <div className='max-w-[1360px] mx-auto flex flex-col md:flex-row md:h-[72px] items-center justify-between px-4 sm:px-6 py-3 md:py-0 gap-3 md:gap-8'>
        {/* Logo & Mobile Action (Left) */}
        <div className='flex items-center justify-between w-full md:w-auto shrink-0'>
          <a
            href='/'
            className='font-black text-2xl tracking-tight text-indigo-600 hover:text-indigo-700 transition-colors'
          >
            StarSuperScare
          </a>
          <div className='flex md:hidden gap-4 items-center'>
            {/* Mobile Cart Icon */}
            <a
              href='/cart'
              className='p-1.5 text-gray-500 hover:text-indigo-600 transition-colors relative'
            >
              <ShoppingCart strokeWidth={2.5} className='w-5 h-5' />
              <CartBadge count={cartItemCount} />
            </a>
          </div>
        </div>

        {/* Mega Menu (Desktop) */}
        <nav className='hidden lg:flex gap-7 shrink-0'>
          {[
            { label: 'Semua Produk', href: '/products' },
            { label: 'Kategori', href: '/categories' },
            { label: 'Brand', href: '/brands' },
            { label: 'Promo', href: '/promo' },
            { label: 'Lacak Pesanan', href: (import.meta as any).env?.VITE_TRACKING_URL || '' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className='text-[15px] font-semibold text-gray-700 hover:text-indigo-600 transition-colors'
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Dominant Search Bar */}
        <div className='flex flex-1 w-full justify-end lg:justify-center min-w-0'>
          <form onSubmit={handleSearch} className='w-full max-w-xl relative'>
            <input
              type='search'
              placeholder='Cari produk, kategori, atau brand...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className='w-full h-11 pl-4 pr-11 rounded-full border border-gray-200 bg-gray-100/50 hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all shadow-inner'
            />
            <button
              type='submit'
              className='absolute right-1 top-1 bottom-1 px-3 text-gray-400 hover:text-indigo-600 bg-transparent rounded-r-full transition-colors flex items-center justify-center'
            >
              <Search className='w-[18px] h-[18px]' strokeWidth={2.5} />
            </button>

            {/* Auto-complete Dropdown */}
            {showSuggestions && searchQuery.trim().length >= 2 && (
              <div className='absolute top-[calc(100%+8px)] left-0 right-0 bg-white/95 backdrop-blur-md border border-gray-200/60 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2'>
                {isSuggestionsLoading
                  ? (
                    <div className='p-6 text-center text-sm font-medium text-gray-500 flex items-center justify-center gap-2'>
                      <div className='w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin' />
                      Mencari...
                    </div>
                  )
                  : suggestions.length > 0
                  ? (
                    <ul className='py-2'>
                      {suggestions.map((product) => (
                        <li key={product.id}>
                          <a
                            href={`/products/${product.slug}`}
                            className='flex items-center gap-4 px-4 py-3 hover:bg-indigo-50/50 transition-colors'
                            onClick={() => setShowSuggestions(false)}
                          >
                            <div className='w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center border border-gray-200/50 shadow-sm'>
                              {product.primaryImage
                                ? (
                                  <img
                                    src={product.primaryImage}
                                    alt={product.name}
                                    className='w-full h-full object-cover'
                                  />
                                )
                                : (
                                  <span className='text-[9px] font-medium text-gray-400'>
                                    No Img
                                  </span>
                                )}
                            </div>
                            <div className='flex flex-col min-w-0'>
                              <span className='text-[15px] font-semibold text-gray-900 truncate'>
                                {product.name}
                              </span>
                              <span className='text-[13px] text-indigo-600 font-bold mt-0.5'>
                                Rp{' '}
                                {(product.variantsSummary?.minPrice || 0).toLocaleString('id-ID')}
                              </span>
                            </div>
                          </a>
                        </li>
                      ))}
                      <li className='px-4 pt-2 pb-1 border-t border-gray-100 mt-2'>
                        <button
                          type='button'
                          onClick={handleSearch}
                          className='w-full py-2.5 text-[13px] rounded-xl bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors'
                        >
                          Lihat semua hasil untuk "{searchQuery}"
                        </button>
                      </li>
                    </ul>
                  )
                  : (
                    <div className='p-8 text-center flex flex-col items-center justify-center gap-2'>
                      <Search className='w-8 h-8 text-gray-300' strokeWidth={1.5} />
                      <p className='text-[15px] font-medium text-gray-900 mt-2'>Tidak ada hasil</p>
                      <p className='text-[13px] text-gray-500'>Coba gunakan kata kunci lain.</p>
                    </div>
                  )}
              </div>
            )}
          </form>
        </div>

        {/* Action Icons (Desktop) */}
        <div className='hidden md:flex items-center gap-1.5 shrink-0'>
          <a
            href={wishlistUrl}
            className='p-2.5 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors group'
            title='Wishlist'
          >
            <Heart
              strokeWidth={2}
              className='w-[22px] h-[22px] group-hover:scale-110 transition-transform'
            />
          </a>
          <a
            href='/cart'
            className='p-2.5 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors relative group'
            title='Keranjang'
          >
            <ShoppingCart
              strokeWidth={2}
              className='w-[22px] h-[22px] group-hover:scale-110 transition-transform'
            />
            <CartBadge count={cartItemCount} />
          </a>
          <div className='w-[1px] h-6 bg-gray-200 mx-1.5' />
          <a
            href={accountUrl}
            className='p-2.5 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors group'
            title='Akun'
          >
            <User
              strokeWidth={2}
              className='w-[22px] h-[22px] group-hover:scale-110 transition-transform'
            />
          </a>
        </div>
      </div>
    </header>
  );
};

const MobileBottomNav = () => {
  const location = useLocation();
  const { session } = useAuth();
  const authUrl = (import.meta as any).env?.VITE_AUTH_URL || '';
  const dashboardUrl = (import.meta as any).env?.VITE_DASHBOARD_URL || '';
  const [accountUrl, setAccountUrl] = useState(
    `${authUrl}/login?return_to=${encodeURIComponent(globalThis.location?.href || '')}`,
  );
  const [wishlistUrl, setWishlistUrl] = useState(
    `${authUrl}/login?returnUrl=${encodeURIComponent(`${dashboardUrl}/wishlist`)}`,
  );

  useEffect(() => {
    if (session) {
      setAccountUrl(dashboardUrl);
      setWishlistUrl(`${dashboardUrl}/wishlist`);
    } else {
      setAccountUrl(
        `${authUrl}/login?return_to=${encodeURIComponent(globalThis.location?.href || '')}`,
      );
      setWishlistUrl(
        `${authUrl}/login?returnUrl=${encodeURIComponent(`${dashboardUrl}/wishlist`)}`,
      );
    }
  }, [session, dashboardUrl, authUrl, location]);

  return (
    <nav className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-t border-border/60 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]'>
      <div className='flex justify-around items-center h-14'>
        <a
          href='/'
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            location.pathname === '/'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-muted-foreground hover:text-foreground font-medium'
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
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            location.pathname.startsWith('/categories')
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-muted-foreground hover:text-foreground font-medium'
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
          href={wishlistUrl}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            location.pathname === '/wishlist'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-muted-foreground hover:text-foreground font-medium'
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
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-foreground font-medium transition-colors`}
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
    <footer className='border-t border-border/60 bg-card mt-12 pt-12 pb-24 md:pb-12 shadow-sm'>
      <div className='max-w-[1360px] mx-auto px-4 sm:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          <div className='col-span-1 md:col-span-2'>
            <h3 className='font-black text-xl tracking-tight mb-4 text-indigo-600 dark:text-indigo-400'>
              StarSuperScare
            </h3>
            <p className='text-muted-foreground font-medium text-sm max-w-sm leading-relaxed'>
              Marketplace terpercaya untuk segala kebutuhan digital dan fisik Anda. Belanja aman,
              cepat, dan nyaman.
            </p>
          </div>
          <div>
            <h4 className='font-bold text-foreground mb-4 tracking-tight'>Layanan Pelanggan</h4>
            <ul className='space-y-3 text-sm font-medium text-muted-foreground'>
              <li>
                <a
                  href='/help'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                >
                  Bantuan
                </a>
              </li>
              <li>
                <a
                  href='/returns'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                >
                  Pengembalian Dana
                </a>
              </li>
              <li>
                <a
                  href={(import.meta as any).env?.VITE_TRACKING_URL || '#'}
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                >
                  Lacak Pesanan
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='font-bold text-foreground mb-4 tracking-tight'>Jelajahi</h4>
            <ul className='space-y-3 text-sm font-medium text-muted-foreground'>
              <li>
                <a
                  href='/about'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                >
                  Tentang Kami
                </a>
              </li>
              <li>
                <a
                  href='/terms'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                >
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a
                  href='/privacy'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                >
                  Kebijakan Privasi
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className='border-t border-border/60 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-bold text-muted-foreground/60'>
          <p>&copy; {new Date().getFullYear()} StarSuperScare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

import { useSSE } from '../../lib/useSSE.ts';

export const StorefrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useSSE();

  return (
    <div className='min-h-screen flex flex-col font-sans bg-background text-foreground pb-24 md:pb-0'>
      <SEO appId='storefront' />
      <Header />
      <main className='flex-1 flex flex-col w-full max-w-[1360px] mx-auto px-4 sm:px-8 py-6'>
        <ErrorBoundary
          fallback={
            <div className='p-6 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 shadow-sm flex-1'>
              <h3 className='font-bold mb-2'>Terjadi Kesalahan</h3>
              <p className='text-sm font-medium'>
                Gagal memuat komponen. Silakan muat ulang halaman.
              </p>
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
