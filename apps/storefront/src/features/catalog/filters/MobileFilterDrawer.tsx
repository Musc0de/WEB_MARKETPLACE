import { useState } from 'react';
import { Button } from '@starsuperscare/ui';
import { Filter } from 'lucide-react';
import { CatalogFilters } from './CatalogFilters.tsx';

interface MobileFilterDrawerProps {
  fixedCategorySlug?: string | undefined;
  fixedBrandSlug?: string | undefined;
}

export function MobileFilterDrawer({ fixedCategorySlug, fixedBrandSlug }: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='md:hidden'>
      <Button
        variant='outline'
        className='w-full flex items-center justify-center gap-2'
        onClick={() => setIsOpen(true)}
      >
        <Filter className='w-4 h-4' />
        Filter Produk
      </Button>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex justify-end bg-black/50'>
          <div className='w-4/5 max-w-sm bg-white h-full shadow-xl overflow-y-auto p-6 animate-in slide-in-from-right'>
            <CatalogFilters
              fixedCategorySlug={fixedCategorySlug}
              fixedBrandSlug={fixedBrandSlug}
              onCloseMobile={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
