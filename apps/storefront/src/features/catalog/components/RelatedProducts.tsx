import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProductDetail, ProductListItem } from '@starsuperscare/contracts';
import { toast } from '@starsuperscare/ui';
import { client } from '../../../lib/api.ts';
import { useCart } from '../../cart/api/useCart.ts';
import { createDirectBuyCart } from '../../cart/api/createDirectBuyCart.ts';
import { ProductCard } from './ProductCard.tsx';
import { ProductCardSkeleton } from './ProductCardSkeleton.tsx';

export const RelatedProducts = ({ product }: { product: ProductDetail }) => {
  const [related, setRelated] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        const categoryId = product.categories.length > 0 ? product.categories[0].id : undefined;

        const res = await client.v1.catalog.products.$get({
          query: {
            page: '1',
            per_page: '4',
            category: categoryId,
            sort: 'newest',
          } as any,
        });

        if (res.ok) {
          const payload = await res.json();
          const items = payload.data.items.filter((p) => p.id !== product.id).slice(0, 4);
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
      const res = await client.v1.catalog.products[':slug'].$get({ param: { slug: p.slug } });
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
        // No toast — cart badge animation provides visual feedback
      }
    } catch (_e) {
      toast.error('Gagal memproses aksi. Coba lagi.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-4'>
        {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }

  if (related.length === 0) {
    return null;
  }

  return (
    <div className='mt-4'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {related.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            isLoading={actionLoading === p.id}
            onAddToCart={(pItem) => handleAction(pItem, false)}
            onBuyNow={(pItem) => handleAction(pItem, true)}
          />
        ))}
      </div>
    </div>
  );
};
