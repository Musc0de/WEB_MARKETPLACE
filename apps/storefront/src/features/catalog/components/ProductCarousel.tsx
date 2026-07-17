import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProductListItem } from '@starsuperscare/contracts';
import { H2, toast } from '@starsuperscare/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { client } from '../../../lib/api.ts';
import { useCart } from '../../cart/api/useCart.ts';
import { createDirectBuyCart } from '../../cart/api/createDirectBuyCart.ts';
import { ProductCard } from './ProductCard.tsx';

export function ProductCarousel(
  { title, limit = 10, type = 'newest', layout = 'slider' }: {
    title: string;
    limit?: number;
    type?: 'newest' | 'best_selling' | 'most_viewed' | 'smart_recommendation';
    layout?: 'slider' | 'grid';
  },
) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        let res;
        if (type === 'smart_recommendation') {
          res = await client.v1.catalog.products.recommendations.$get();
        } else {
          res = await client.v1.catalog.products.$get({
            query: { page: '1', per_page: String(limit), sort: type, in_stock: 'false' } as any,
          });
        }
        if (res.ok) {
          const data: any = await res.json();
          setProducts(data.data.items || data.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [limit, type]);

  const handleAction = async (p: ProductListItem, isBuyNow: boolean) => {
    if (actionLoading) return;
    try {
      setActionLoading(p.id);
      const res = await client.v1.catalog.products[':slug'].$get({ param: { slug: p.slug } });
      if (!res.ok) throw new Error('Produk tidak ditemukan');
      const detail: any = (await res.json()).data;

      if (!detail.variants || detail.variants.length === 0) {
        toast.error('Produk tidak memiliki varian tersedia');
        return;
      }

      if (isBuyNow) {
        const directToken = await createDirectBuyCart(detail.variants[0].id, 1);
        if (directToken) {
          navigate(`/checkout?directToken=${encodeURIComponent(directToken)}`);
        }
      } else {
        await addItem(detail.variants[0].id, 1);
        toast.success('Berhasil ditambahkan ke keranjang');
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal memproses pesanan');
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return <div className='animate-pulse h-48 bg-gray-100 rounded-lg'></div>;
  }

  if (products.length === 0) return null;

  return (
    <div className='py-8'>
      <div className='flex items-center justify-between mb-6'>
        <H2 className='font-bold tracking-tight'>{title}</H2>
        {layout === 'slider' && products.length > 3 && (
          <div className='hidden md:flex gap-2'>
            <button
              type='button'
              onClick={scrollLeft}
              className='p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors'
              aria-label='Scroll Left'
            >
              <ChevronLeft className='w-5 h-5 text-gray-600' />
            </button>
            <button
              type='button'
              onClick={scrollRight}
              className='p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors'
              aria-label='Scroll Right'
            >
              <ChevronRight className='w-5 h-5 text-gray-600' />
            </button>
          </div>
        )}
      </div>
      <div
        ref={scrollRef}
        className={layout === 'slider'
          ? 'flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory scrollbar-hide'
          : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'}
        style={layout === 'slider'
          ? { scrollbarWidth: 'none', msOverflowStyle: 'none' }
          : undefined}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={layout === 'slider'
              ? 'w-[140px] sm:w-[160px] md:w-[200px] shrink-0 snap-start'
              : ''}
          >
            <ProductCard
              product={product}
              onAddToCart={() => handleAction(product, false)}
              onBuyNow={() => handleAction(product, true)}
              isLoading={actionLoading === product.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
