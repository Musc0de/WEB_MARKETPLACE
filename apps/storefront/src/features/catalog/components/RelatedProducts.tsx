import { useEffect, useState } from 'react';
import type { ProductDetail, ProductListItem } from '@starsuperscare/contracts';
import { client } from '../../../lib/api.ts';
import { ProductCard } from './ProductCard.tsx';
import { ProductCardSkeleton } from './ProductCardSkeleton.tsx';

export const RelatedProducts = ({ product }: { product: ProductDetail }) => {
  const [related, setRelated] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        // Build query for related products: same category if available, else newest
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
          // Filter out the current product
          const items = payload.data.items.filter((p) => p.id !== product.id).slice(0, 4);
          setRelated(items);
        }
      } catch (err) {
        // Silently fail for related products and show nothing
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [product.id, product.categories]);

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
        {related.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};
