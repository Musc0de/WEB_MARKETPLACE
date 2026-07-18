import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Category } from '@starsuperscare/contracts';
import { Skeleton, toast } from '@starsuperscare/ui';
import { client } from '../../../lib/api.ts';
import { Grid, Tag } from 'lucide-react';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await client.v1.catalog.categories.$get();
        if (res.ok) {
          const payload = await res.json();
          setCategories(payload.data || []);
        } else {
          toast.error('Gagal memuat kategori.');
        }
      } catch (_err) {
        toast.error('Kesalahan jaringan saat memuat kategori.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className='max-w-7xl mx-auto py-8 lg:py-12 px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700'>
      <div className='text-center space-y-3'>
        <h1 className='text-2xl lg:text-3xl font-black text-foreground tracking-tight inline-flex items-center gap-3'>
          <Grid className='w-6 h-6 lg:w-8 lg:h-8 text-indigo-500' />
          Kategori Produk
        </h1>
        <p className='text-sm lg:text-base font-medium text-muted-foreground max-w-2xl mx-auto'>
          Jelajahi berbagai kategori produk unggulan kami dan temukan apa yang Anda butuhkan dengan
          mudah.
        </p>
      </div>

      {loading
        ? (
          <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 lg:gap-4'>
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className='h-24 w-full rounded-2xl' />
            ))}
          </div>
        )
        : categories.length > 0
        ? (
          <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 lg:gap-4'>
            {categories.map((category) => (
              <button
                key={category.id}
                type='button'
                onClick={() => navigate(`/categories/${category.slug}`)}
                className='bg-card border border-border/60 rounded-2xl p-3 lg:p-4 shadow-sm hover:shadow-lg hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col justify-center items-center text-center space-y-2 group active:scale-95'
              >
                <div className='w-8 h-8 lg:w-10 lg:h-10 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300 shadow-inner'>
                  <Tag className='w-4 h-4 lg:w-5 lg:h-5' />
                </div>
                <div>
                  <h3 className='text-[11px] lg:text-sm font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1'>
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className='text-[9px] lg:text-xs font-medium text-muted-foreground line-clamp-1 mt-0.5 leading-snug hidden sm:block'>
                      {category.description}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )
        : (
          <div className='py-16 text-center border border-border/60 rounded-3xl bg-muted/20 w-full flex flex-col items-center justify-center gap-3'>
            <Tag className='w-10 h-10 text-muted-foreground/40' />
            <p className='text-sm font-bold text-muted-foreground'>
              Belum ada kategori yang tersedia.
            </p>
          </div>
        )}
    </div>
  );
}
