import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProductDetail, ProductListItem } from '@starsuperscare/contracts';
import { toast } from '@starsuperscare/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { client } from '../../../lib/api.ts';
import { useCart } from '../../cart/api/useCart.ts';
import { createDirectBuyCart } from '../../cart/api/createDirectBuyCart.ts';
import { ProductCard } from './ProductCard.tsx';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SliderSkeleton() {
  return (
    <div className='flex gap-2 overflow-hidden'>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className='flex-none w-[160px] sm:w-[180px] rounded-lg bg-gray-100 animate-pulse'
          style={{ height: '280px' }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const RelatedProducts = ({ product }: { product: ProductDetail }) => {
  const [related, setRelated] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Slider ref & scroll state
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    if (!loading && related.length > 0) {
      // small delay to let DOM settle
      setTimeout(checkScroll, 100);
    }
  }, [loading, related]);

  const scroll = (dir: 'left' | 'right') => {
    const el = sliderRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        const categoryId = product.categories.length > 0 ? product.categories[0].id : undefined;

        const res = await client.v1.catalog.products.$get({
          query: {
            page: '1',
            per_page: '10',
            category: categoryId,
            sort: 'newest',
          } as any,
        });

        if (res.ok) {
          const payload = await res.json();
          const items = payload.data.items
            .filter((p) => p.id !== product.id)
            .slice(0, 8);
          setRelated(items);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [product.id, product.categories]);

  const handleAction = async (p: ProductListItem, isBuyNow: boolean) => {
    if (actionLoading) return;
    try {
      setActionLoading(p.id);
      const res = await client.v1.catalog.products[':slug'].$get({
        param: { slug: p.slug },
      });
      if (!res.ok) throw new Error('Produk tidak ditemukan');
      const detail = (await res.json()).data;
      if (!detail.variants || detail.variants.length === 0) {
        toast.error('Produk tidak memiliki varian tersedia');
        return;
      }
      if (isBuyNow) {
        const directToken = await createDirectBuyCart(detail.variants[0].id, 1);
        navigate(`/checkout?directToken=${encodeURIComponent(directToken)}`);
      } else {
        await addItem(detail.variants[0].id, 1);
      }
    } catch (_e) {
      toast.error('Gagal memproses aksi. Coba lagi.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <SliderSkeleton />;
  if (related.length === 0) return null;

  return (
    <div className='relative mt-3'>
      {/* ── Left Arrow ── */}
      {canScrollLeft && (
        <button
          type='button'
          onClick={() => scroll('left')}
          aria-label='Geser kiri'
          className='absolute left-0 top-1/2 -translate-y-1/2 z-20 -translate-x-3 bg-white border border-gray-200 shadow-md rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-50 hover:shadow-lg transition-all'
        >
          <ChevronLeft className='w-4 h-4 text-gray-600' />
        </button>
      )}

      {/* ── Scrollable Track ── */}
      <div
        ref={sliderRef}
        onScroll={checkScroll}
        className='flex gap-2 overflow-x-auto scroll-smooth no-scrollbar pb-1'
        style={{ scrollbarWidth: 'none' }}
      >
        {related.map((p) => (
          <div
            key={p.id}
            className='flex-none w-[150px] sm:w-[168px]'
          >
            <ProductCard
              product={p}
              isLoading={actionLoading === p.id}
              onAddToCart={(pItem) => handleAction(pItem, false)}
              onBuyNow={(pItem) => handleAction(pItem, true)}
            />
          </div>
        ))}
      </div>

      {/* ── Right Arrow ── */}
      {canScrollRight && (
        <button
          type='button'
          onClick={() => scroll('right')}
          aria-label='Geser kanan'
          className='absolute right-0 top-1/2 -translate-y-1/2 z-20 translate-x-3 bg-white border border-gray-200 shadow-md rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-50 hover:shadow-lg transition-all'
        >
          <ChevronRight className='w-4 h-4 text-gray-600' />
        </button>
      )}
    </div>
  );
};
