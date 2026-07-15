import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Category } from '@starsuperscare/contracts';
import { H1, Text, toast, Skeleton } from '@starsuperscare/ui';
import { client } from '../../../lib/api.ts';

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
    <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12'>
      <div className="text-center space-y-4">
        <H1>Kategori Produk</H1>
        <Text className="text-gray-500 max-w-2xl mx-auto">
          Jelajahi berbagai kategori produk unggulan kami dan temukan apa yang Anda butuhkan dengan mudah.
        </Text>
      </div>

      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className='h-32 w-full rounded-xl' />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(`/categories/${category.slug}`)}
              className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-center items-center text-center space-y-2 group"
            >
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              {category.description && (
                <Text className="text-sm text-gray-500 line-clamp-2">
                  {category.description}
                </Text>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className='py-12 text-center border rounded-lg bg-gray-50 w-full'>
          <Text className="text-gray-500">Belum ada kategori yang tersedia.</Text>
        </div>
      )}
    </div>
  );
}
