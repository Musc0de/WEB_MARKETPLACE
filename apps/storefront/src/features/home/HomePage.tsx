import { useNavigate } from 'react-router-dom';
import { Button, H1, Text } from '@starsuperscare/ui';
import { ProductCarousel } from '../catalog/components/ProductCarousel.tsx';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className='space-y-12 pb-16'>
      {/* Hero Section */}
      <section className='bg-blue-600 text-white rounded-2xl p-8 sm:p-16 text-center space-y-6 shadow-lg'>
        <H1 className='text-white'>Selamat Datang di StarSuperScare</H1>
        <Text className='text-blue-100 max-w-2xl mx-auto text-lg'>
          Marketplace terbaik untuk menemukan segala kebutuhan Anda. Dapatkan produk berkualitas
          dengan harga terbaik hanya di sini.
        </Text>
        <div className='pt-4'>
          <Button size='lg' variant='secondary' onClick={() => navigate('/products')}>
            Mulai Belanja
          </Button>
        </div>
      </section>

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
