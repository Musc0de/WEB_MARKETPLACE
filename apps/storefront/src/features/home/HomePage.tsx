import { useNavigate } from 'react-router-dom';
import { Button } from '@starsuperscare/ui';
import { Gift, Grid, PackageSearch, Tag } from 'lucide-react';
import { ProductCarousel } from '../catalog/components/ProductCarousel.tsx';
import { StorefrontHero } from './components/StorefrontHero.tsx';
import { TicketPercent } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const QUICK_LINKS = [
    {
      name: 'Kategori',
      icon: Grid,
      href: '/categories',
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      hover: 'group-hover:bg-indigo-500',
    },
    {
      name: 'Produk',
      icon: PackageSearch,
      href: '/products',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      hover: 'group-hover:bg-emerald-500',
    },
    {
      name: 'Brands',
      icon: Tag,
      href: '/brands',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      hover: 'group-hover:bg-amber-500',
    },
    {
      name: 'Promo',
      icon: Gift,
      href: '/promo',
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      hover: 'group-hover:bg-rose-500',
    },
    {
      name: 'Voucher',
      icon: TicketPercent,
      href: '/vouchers',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      hover: 'group-hover:bg-emerald-500',
    },
  ];

  return (
    <div className='space-y-12 pb-16 animate-in fade-in duration-700'>
      {/* Hero Section */}
      <StorefrontHero />

      {/* Quick Links (Mobile Only) */}
      <div className='grid md:hidden grid-cols-4 gap-3 px-1 mt-6'>
        {QUICK_LINKS.map((link) => (
          <button
            key={link.name}
            type='button'
            onClick={() => navigate(link.href)}
            className='flex flex-col items-center justify-center gap-2 group active:scale-95 transition-transform'
          >
            <div
              className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl ${link.bg} flex items-center justify-center ${link.hover} transition-colors duration-300 shadow-sm border border-transparent group-hover:border-border/30`}
            >
              <link.icon
                className={`w-5 h-5 lg:w-7 lg:h-7 ${link.color} group-hover:text-white transition-colors`}
              />
            </div>
            <span className='text-[10px] lg:text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors'>
              {link.name}
            </span>
          </button>
        ))}
      </div>

      {/* Featured Products */}
      <div className='mt-12'>
        <ProductCarousel title='Produk Terlaris' type='best_selling' limit={10} />
      </div>

      <div className='mt-8 pt-8 border-t border-border/60'>
        <ProductCarousel title='Produk Terbaru' type='newest' limit={10} />
      </div>

      <div className='mt-12 pt-8 border-t border-border/60 text-center'>
        <Button
          variant='outline'
          size='lg'
          onClick={() => navigate('/products')}
          className='font-bold border-border text-foreground hover:bg-muted active:scale-95 transition-all rounded-full px-8 shadow-sm'
        >
          Lihat Semua Produk
        </Button>
      </div>
    </div>
  );
}
