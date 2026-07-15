import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Brand } from '@starsuperscare/contracts';
import { H1, Skeleton, Text, toast } from '@starsuperscare/ui';
import { client } from '../../../lib/api.ts';

export function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const res = await client.v1.catalog.brands.$get();
        if (res.ok) {
          const payload = await res.json();
          setBrands(payload.data || []);
        } else {
          toast.error('Gagal memuat merek.');
        }
      } catch (_err) {
        toast.error('Kesalahan jaringan saat memuat merek.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12'>
      <div className='text-center space-y-4'>
        <H1>Merek Resmi</H1>
        <Text className='text-gray-500 max-w-2xl mx-auto'>
          Temukan produk unggulan dari berbagai merek ternama dan terpercaya yang bermitra dengan
          kami.
        </Text>
      </div>

      {loading
        ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className='h-24 w-full rounded-xl' />
            ))}
          </div>
        )
        : brands.length > 0
        ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
            {brands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => navigate(`/brands/${brand.slug}`)}
                className='bg-white border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer flex justify-center items-center text-center group min-h-[6rem]'
              >
                <h3 className='text-md font-bold text-gray-900 group-hover:text-blue-600 transition-colors'>
                  {brand.name}
                </h3>
              </div>
            ))}
          </div>
        )
        : (
          <div className='py-12 text-center border rounded-lg bg-gray-50 w-full'>
            <Text className='text-gray-500'>Belum ada merek yang tersedia.</Text>
          </div>
        )}
    </div>
  );
}
