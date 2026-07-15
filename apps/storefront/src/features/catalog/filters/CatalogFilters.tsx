import { useEffect, useState } from 'react';
import { client } from '../../../lib/api.ts';
import { Button, Input, Text } from '@starsuperscare/ui';
import { useSearchFilters } from '../../search/useSearchFilters.ts';
import { FilterX } from 'lucide-react';

interface CatalogFiltersProps {
  fixedCategorySlug?: string | undefined;
  fixedBrandSlug?: string | undefined;
  onCloseMobile?: () => void;
}

export function CatalogFilters(
  { fixedCategorySlug, fixedBrandSlug, onCloseMobile }: CatalogFiltersProps,
) {
  const { filters, updateFilter, resetFilters } = useSearchFilters();
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [brands, setBrands] = useState<{ slug: string; name: string }[]>([]);

  useEffect(() => {
    client.v1.catalog.categories.$get().then((res) => {
      if (res.ok) res.json().then((d) => setCategories(d.data));
    });
    client.v1.catalog.brands.$get().then((res) => {
      if (res.ok) res.json().then((d) => setBrands(d.data));
    });
  }, []);

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <Text className='font-bold text-lg text-gray-800'>Filter</Text>
        <Button
          variant='ghost'
          size='sm'
          onClick={resetFilters}
          className='text-gray-500 h-8 px-2 text-xs'
        >
          <FilterX className='w-3 h-3 mr-1' />
          Reset
        </Button>
      </div>

      {!fixedCategorySlug && (
        <div className='flex flex-col gap-2'>
          <Text className='font-semibold text-sm'>Kategori</Text>
          <select
            className='w-full border border-gray-300 rounded-md p-2 text-sm'
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
          >
            <option value=''>Semua Kategori</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
      )}

      {!fixedBrandSlug && (
        <div className='flex flex-col gap-2'>
          <Text className='font-semibold text-sm'>Brand</Text>
          <select
            className='w-full border border-gray-300 rounded-md p-2 text-sm'
            value={filters.brand}
            onChange={(e) => updateFilter('brand', e.target.value)}
          >
            <option value=''>Semua Brand</option>
            {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
          </select>
        </div>
      )}

      <div className='flex flex-col gap-2'>
        <Text className='font-semibold text-sm'>Harga (Rp)</Text>
        <div className='flex items-center gap-2'>
          <Input
            type='number'
            placeholder='Min'
            value={filters.min_price || ''}
            onChange={(e) => updateFilter('min_price', e.target.value)}
            className='h-8 text-sm'
          />
          <span className='text-gray-400'>-</span>
          <Input
            type='number'
            placeholder='Max'
            value={filters.max_price || ''}
            onChange={(e) => updateFilter('max_price', e.target.value)}
            className='h-8 text-sm'
          />
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <Text className='font-semibold text-sm'>Rating Minimum</Text>
        <select
          className='w-full border border-gray-300 rounded-md p-2 text-sm'
          value={filters.min_rating || ''}
          onChange={(e) => updateFilter('min_rating', e.target.value)}
        >
          <option value=''>Semua Rating</option>
          <option value='4'>4 Bintang ke Atas</option>
          <option value='3'>3 Bintang ke Atas</option>
        </select>
      </div>

      <div className='flex flex-col gap-3 pt-2'>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            className='w-4 h-4 text-blue-600 rounded border-gray-300'
            checked={filters.promo}
            onChange={(e) => updateFilter('promo', e.target.checked)}
          />
          <Text className='text-sm'>Sedang Diskon</Text>
        </label>

        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            className='w-4 h-4 text-blue-600 rounded border-gray-300'
            checked={filters.in_stock}
            onChange={(e) => updateFilter('in_stock', e.target.checked)}
          />
          <Text className='text-sm'>Tersedia (In Stock)</Text>
        </label>
      </div>

      {onCloseMobile && (
        <Button className='w-full mt-4 md:hidden' onClick={onCloseMobile}>
          Terapkan Filter
        </Button>
      )}
    </div>
  );
}
