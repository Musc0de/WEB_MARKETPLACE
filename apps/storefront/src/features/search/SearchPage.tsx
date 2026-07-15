import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { ProductListItem } from '@starsuperscare/contracts';
import { Button, H1, H3, Pagination, Text } from '@starsuperscare/ui';
import { toast } from '@starsuperscare/ui';
import { client } from '../../lib/api.ts';
import { useCart } from '../cart/api/useCart.ts';
import { createDirectBuyCart } from '../cart/api/createDirectBuyCart.ts';
import { ProductCard } from '../catalog/components/ProductCard.tsx';
import { ProductCardSkeleton } from '../catalog/components/ProductCardSkeleton.tsx';
import { SearchX } from 'lucide-react';
import { useSearchFilters } from './useSearchFilters.ts';
import { CatalogFilters } from '../catalog/filters/CatalogFilters.tsx';
import { MobileFilterDrawer } from '../catalog/filters/MobileFilterDrawer.tsx';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const SearchPage = (): JSX.Element => {
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>();

  const isCategoryRoute = location.pathname.startsWith('/categories');
  const isBrandRoute = location.pathname.startsWith('/brands');
  const isSearchRoute = location.pathname.startsWith('/search');

  const { filters, updateFilter } = useSearchFilters();
  const debouncedSearch = useDebounce(filters.q, 500);

  const perPage = 12;
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();
  const { addItem } = useCart();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
      await addItem(detail.variants[0].id, 1);
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

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setLoading(true);
      setError(null);

      // Force category/brand filter if inside specific route
      const effectiveCategory = isCategoryRoute ? slug : filters.category;
      const effectiveBrand = isBrandRoute ? slug : filters.brand;

      const queryObj: Record<string, string> = {
        page: filters.page.toString(),
        per_page: perPage.toString(),
        sort: filters.sort,
        in_stock: filters.in_stock ? 'true' : 'false',
      };
      if (debouncedSearch) queryObj.search = debouncedSearch;
      if (effectiveCategory) queryObj.category = effectiveCategory;
      if (effectiveBrand) queryObj.brand = effectiveBrand;
      if (filters.min_price !== null) queryObj.min_price = filters.min_price.toString();
      if (filters.max_price !== null) queryObj.max_price = filters.max_price.toString();
      if (filters.min_rating !== null) queryObj.min_rating = filters.min_rating.toString();
      if (filters.promo) queryObj.promo = 'true';

      const res = await client.v1.catalog.products.$get(
        { query: queryObj as any },
        { init: { signal: abortController.signal } },
      );

      if (!res.ok) throw new Error('Gagal memuat produk dari server.');

      const payload = await res.json();
      if (payload.error) throw new Error(payload.error || 'Terjadi kesalahan sistem.');

      setProducts(payload.data.items);
      setTotalItems(payload.data.total);
      setLoading(false);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Gagal memuat produk.');
      toast.error(err.message || 'Gagal memuat produk.');
      setLoading(false);
    }
  }, [filters, debouncedSearch, isCategoryRoute, isBrandRoute, slug]);

  useEffect(() => {
    fetchProducts();
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchProducts]);

  const handlePageChange = (newPage: number) => {
    updateFilter('page', newPage);
    globalThis.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine Title
  let title = 'Katalog Produk';
  if (isCategoryRoute) title = `Kategori: ${slug}`;
  if (isBrandRoute) title = `Brand: ${slug}`;
  if (isSearchRoute) title = 'Hasil Pencarian';

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <H1 className='text-3xl font-bold capitalize'>{title.replace('-', ' ')}</H1>
        <Text className='text-gray-500 mt-2'>
          Temukan koleksi perlengkapan terbaik kami
        </Text>
      </div>

      <div className='flex flex-col md:flex-row gap-8'>
        {/* Sidebar Desktop */}
        <aside className='hidden md:block w-64 shrink-0 border-r border-gray-100 pr-6'>
          <CatalogFilters
            fixedCategorySlug={isCategoryRoute ? slug : undefined}
            fixedBrandSlug={isBrandRoute ? slug : undefined}
          />
        </aside>

        {/* Main Content */}
        <div className='flex-1'>
          {/* Controls Bar */}
          <div className='flex flex-col md:flex-row gap-4 justify-end items-center mb-6'>
            <div className='flex gap-2 w-full md:w-auto'>
              <MobileFilterDrawer
                fixedCategorySlug={isCategoryRoute ? slug : undefined}
                fixedBrandSlug={isBrandRoute ? slug : undefined}
              />
              <select
                className='border border-gray-300 rounded-md p-2 flex-1 md:w-48 text-sm'
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
              >
                <option value='newest'>Terbaru</option>
                <option value='best_selling'>Paling Laku</option>
                <option value='price_asc'>Harga Termurah</option>
                <option value='price_desc'>Harga Termahal</option>
              </select>
            </div>
          </div>

          {/* Results Area */}
          {error
            ? (
              <div className='flex flex-col items-center justify-center py-20 text-center'>
                <H3 className='text-red-500 mb-2'>Terjadi Kesalahan</H3>
                <Text className='text-gray-500 mb-6'>{error}</Text>
                <Button onClick={() => fetchProducts()} variant='default'>Coba Lagi</Button>
              </div>
            )
            : loading
            ? (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
                {Array.from({ length: perPage }).map((_, i) => (
                  <div key={i}>
                    <ProductCardSkeleton />
                  </div>
                ))}
              </div>
            )
            : products.length === 0
            ? (
              <div className='flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-lg'>
                <SearchX className='w-16 h-16 text-gray-300 mb-4' />
                <H3 className='mb-2'>Produk Tidak Ditemukan</H3>
                <Text className='text-gray-500 max-w-md'>
                  Kami tidak menemukan produk yang cocok dengan pencarian atau filter Anda. Coba
                  kurangi kata kunci atau ubah filter pencarian.
                </Text>
                <Button variant='outline' className='mt-6' onClick={() => updateFilter('q', '')}>
                  Hapus Pencarian
                </Button>
              </div>
            )
            : (
              <>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
                  {products.map((product) => (
                    <div key={product.id}>
                      <ProductCard
                        product={product}
                        isLoading={actionLoading === product.id}
                        onAddToCart={(p) => handleAction(p, false)}
                        onBuyNow={(p) => handleAction(p, true)}
                      />
                    </div>
                  ))}
                </div>

                {totalItems > perPage && (
                  <div className='mt-12 flex justify-center'>
                    <Pagination
                      currentPage={filters.page}
                      totalPages={Math.ceil(totalItems / perPage)}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
        </div>
      </div>
    </div>
  );
};
