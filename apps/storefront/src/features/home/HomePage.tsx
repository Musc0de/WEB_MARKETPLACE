import { useNavigate } from 'react-router-dom';
import { Button } from '@starsuperscare/ui';
import { ProductCarousel } from '../catalog/components/ProductCarousel.tsx';
import { StorefrontHero } from './components/StorefrontHero.tsx';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className='space-y-12 pb-16'>
      {/* Hero Section */}
      <StorefrontHero />

      {/* Featured Products */}
      <div className='mt-12'>
        <ProductCarousel title='Produk Terlaris' type='best_selling' limit={10} />
      </div>

      <div className='mt-8 pt-8 border-t border-gray-100'>
        <ProductCarousel title='Produk Terbaru' type='newest' limit={10} />
      </div>

      <div className='mt-12 pt-8 border-t border-gray-100 text-center'>
        <Button variant='outline' size='lg' onClick={() => navigate('/products')}>
          Lihat Semua Produk
        </Button>
      </div>
    </div>
  );
}
