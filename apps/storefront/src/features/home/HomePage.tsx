import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProductListItem } from '@starsuperscare/contracts';
import { Button, H1, H2, Text, toast } from '@starsuperscare/ui';
import { client } from '../../lib/api.ts';
import { ProductCard } from '../catalog/components/ProductCard.tsx';
import { ProductCardSkeleton } from '../catalog/components/ProductCardSkeleton.tsx';

export default function HomePage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await client.v1.catalog.products.$get({
          query: {
            page: '1',
            per_page: '8',
            sort: 'newest',
            in_stock: 'true',
          }
        });
        if (res.ok) {
          const payload = await res.json();
          setProducts(payload.data?.items || []);
        } else {
          toast.error('Gagal memuat produk rekomendasi.');
        }
      } catch (_err) {
        toast.error('Kesalahan jaringan.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className='space-y-12 pb-16'>
      {/* Hero Section */}
      <section className='bg-blue-600 text-white rounded-2xl p-8 sm:p-16 text-center space-y-6 shadow-lg'>
        <H1 className="text-white">Selamat Datang di StarSuperScare</H1>
        <Text className="text-blue-100 max-w-2xl mx-auto text-lg">
          Marketplace terbaik untuk menemukan segala kebutuhan Anda. Dapatkan produk berkualitas dengan harga terbaik hanya di sini.
        </Text>
        <div className="pt-4">
          <Button size="lg" variant="secondary" onClick={() => navigate('/products')}>
            Mulai Belanja
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className='space-y-6'>
        <div className="flex items-center justify-between">
          <H2>Produk Terbaru</H2>
          <Button variant="outline" onClick={() => navigate('/products')}>
            Lihat Semua
          </Button>
        </div>
        
        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className='py-12 text-center border rounded-lg bg-gray-50 w-full'>
            <Text className="text-gray-500">Belum ada produk yang tersedia.</Text>
          </div>
        )}
      </section>
    </div>
  );
}
