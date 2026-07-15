import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProductListItem } from '@starsuperscare/contracts';
import { Button, H1, H2, Text, toast } from '@starsuperscare/ui';
import { client } from '../../lib/api.ts';
import { useCart } from '../cart/api/useCart.ts';
import { createDirectBuyCart } from '../cart/api/createDirectBuyCart.ts';
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
          },
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

  const { addItem } = useCart();
  // Track per-product loading state (key = product.id)
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAction = async (p: ProductListItem, isBuyNow: boolean) => {
    if (actionLoading) return;
    try {
      setActionLoading(p.id);

      // Fetch product detail to get variant ID
      const res = await client.v1.catalog.products[':slug'].$get({ param: { slug: p.slug } });
      if (!res.ok) throw new Error('Produk tidak ditemukan');

      const detail = (await res.json()).data;
      if (!detail.variants || detail.variants.length === 0) {
        toast.error('Produk tidak memiliki varian tersedia');
        return;
      }

      if (isBuyNow) {
        // Direct buy: fresh isolated cart — doesn't touch user's regular cart
        const directToken = await createDirectBuyCart(detail.variants[0].id, 1);
        navigate(`/checkout?directToken=${encodeURIComponent(directToken)}`);
      } else {
        await addItem(detail.variants[0].id, 1);
        // No toast — cart badge animation provides visual feedback
      }
    } catch (_e) {
      toast.error('Gagal memproses aksi. Coba lagi.');
    } finally {
      setActionLoading(null);
    }
  };

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
      <section className='space-y-6'>
        <div className='flex items-center justify-between'>
          <H2>Produk Terbaru</H2>
          <Button variant='outline' onClick={() => navigate('/products')}>
            Lihat Semua
          </Button>
        </div>

        {loading
          ? (
            <div className='flex overflow-x-auto gap-3 pb-2 md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 snap-x no-scrollbar'>
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className='w-[140px] sm:w-[160px] shrink-0 snap-start md:w-auto md:shrink'
                >
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          )
          : products.length > 0
          ? (
            <div className='flex overflow-x-auto gap-3 pb-2 md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 snap-x no-scrollbar'>
              {products.map((product) => (
                <div
                  key={product.id}
                  className='w-[140px] sm:w-[160px] shrink-0 snap-start md:w-auto md:shrink'
                >
                  <ProductCard
                    product={product}
                    isLoading={actionLoading === product.id}
                    onAddToCart={(p) => handleAction(p, false)}
                    onBuyNow={(p) => handleAction(p, true)}
                  />
                </div>
              ))}
            </div>
          )
          : (
            <div className='py-12 text-center border rounded-lg bg-gray-50 w-full'>
              <Text className='text-gray-500'>Belum ada produk yang tersedia.</Text>
            </div>
          )}
      </section>
    </div>
  );
}
