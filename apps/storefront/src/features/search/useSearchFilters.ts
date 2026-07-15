import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export interface SearchFilters {
  q: string;
  category: string;
  brand: string;
  min_price: number | null;
  max_price: number | null;
  min_rating: number | null;
  promo: boolean;
  in_stock: boolean;
  sort: 'newest' | 'price_asc' | 'price_desc' | 'best_selling';
  page: number;
}

export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: SearchFilters = useMemo(() => ({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    min_price: searchParams.has('min_price') ? Number(searchParams.get('min_price')) : null,
    max_price: searchParams.has('max_price') ? Number(searchParams.get('max_price')) : null,
    min_rating: searchParams.has('min_rating') ? Number(searchParams.get('min_rating')) : null,
    promo: searchParams.get('promo') === 'true',
    in_stock: searchParams.get('in_stock') === 'true',
    sort: (searchParams.get('sort') as SearchFilters['sort']) || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
  }), [searchParams]);

  const updateFilter = useCallback(
    (key: keyof SearchFilters, value: any) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        if (value === null || value === false || value === '') {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }

        // Jika mengubah filter apapun selain page, kembalikan ke page 1
        if (key !== 'page') {
          next.delete('page');
        }

        return next;
      });
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return { filters, updateFilter, resetFilters };
}
