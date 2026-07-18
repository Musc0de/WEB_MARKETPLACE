import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ProductDetail } from '@starsuperscare/contracts';
import { Button, Skeleton } from '@starsuperscare/ui';

import { client } from '../../../lib/api.ts';
import { ProductGallery } from '../components/ProductGallery.tsx';
import { ProductSummary } from '../components/ProductSummary.tsx';
import { ProductDetailsAccordion } from '../components/ProductDetailsAccordion.tsx';
import { RelatedProducts } from '../components/RelatedProducts.tsx';
import { SEO } from '@starsuperscare/ui';

export const ProductDetailPage = (): JSX.Element => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        setLoading(true);
        setError(null);

        const res = await client.v1.catalog.products[':slug'].$get(
          { param: { slug } },
          { init: { signal: abortController.signal } },
        );

        if (res.status === 404) {
          navigate('/404', { replace: true });
          return;
        }

        if (!res.ok) {
          throw new Error('Gagal memuat produk dari server.');
        }

        const payload = await res.json();
        if (payload.error) {
          throw new Error(payload.error || 'Terjadi kesalahan sistem.');
        }

        setProduct(payload.data);
      } catch (err: any) {
        // If the request was intentionally aborted (component unmount / slug change),
        // do NOT update state — the new request will handle it.
        if (err.name === 'AbortError') return;
        setError(err.message || 'Gagal memuat detail produk.');
      } finally {
        // Only clear loading if we haven't been aborted
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8 max-w-6xl'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <Skeleton className='aspect-square w-full rounded-lg' />
          <div className='flex flex-col gap-4'>
            <Skeleton className='h-8 w-3/4' />
            <Skeleton className='h-6 w-1/4' />
            <Skeleton className='h-10 w-1/2 mt-4' />
            <Skeleton className='h-24 w-full mt-8' />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='flex flex-col items-center justify-center py-24 text-center bg-destructive/10 rounded-3xl border border-destructive/20'>
        <h3 className='text-xl font-bold text-destructive mb-2'>Terjadi Kesalahan</h3>
        <p className='text-muted-foreground mb-6 font-medium'>
          {error || 'Produk tidak ditemukan'}
        </p>
        <Button
          onClick={() => navigate('/products')}
          variant='default'
          className='rounded-full px-8 font-bold shadow-sm'
        >
          Kembali ke Katalog
        </Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-6xl'>
      <SEO
        title={product.seoTitle || product.name}
        description={product.seoDescription || product.description || ''}
        appId='storefront'
      />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
        {/* Left Column: Gallery */}
        <ProductGallery product={product} />

        {/* Right Column: Summary */}
        <ProductSummary product={product} />
      </div>

      {/* Tabs / Accordions */}
      <ProductDetailsAccordion product={product} />

      {/* Related Products */}
      <div className='mt-16'>
        <h3 className='text-xl md:text-2xl font-black mb-6 text-foreground flex items-center gap-3'>
          <div className='w-1.5 h-6 bg-indigo-500 rounded-full' />
          Produk Serupa
        </h3>
        <RelatedProducts product={product} />
      </div>
    </div>
  );
};
