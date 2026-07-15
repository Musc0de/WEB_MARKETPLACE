import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ProductDetail } from '@starsuperscare/contracts';
import { Button, H3, Skeleton, Text } from '@starsuperscare/ui';
import { toast } from '@starsuperscare/ui';
import { client } from '../../../lib/api.ts';
import { ProductGallery } from '../components/ProductGallery.tsx';
import { ProductSummary } from '../components/ProductSummary.tsx';
import { ProductDetailsAccordion } from '../components/ProductDetailsAccordion.tsx';
import { RelatedProducts } from '../components/RelatedProducts.tsx';

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
        if (err.name === 'AbortError') return;
        setError(err.message || 'Gagal memuat detail produk.');
        toast.error(err.message || 'Gagal memuat detail produk.');
      } finally {
        setLoading(false);
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
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <H3 className='text-red-500 mb-2'>Terjadi Kesalahan</H3>
        <Text className='text-gray-500 mb-6'>{error || 'Produk tidak ditemukan'}</Text>
        <Button onClick={() => navigate('/products')} variant='default'>Kembali ke Katalog</Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-6xl'>
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
        <H3 className='text-xl md:text-2xl font-bold mb-6 text-gray-900 border-l-4 border-blue-600 pl-3'>
          Produk Serupa
        </H3>
        <RelatedProducts product={product} />
      </div>
    </div>
  );
};
