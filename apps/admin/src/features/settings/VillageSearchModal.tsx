import { useState } from 'react';
import { Loader2, MapPin, Search, X } from 'lucide-react';
import { API_URL } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';

export function VillageSearchModal({
  onSelect,
  onClose,
}: {
  onSelect: (villageCode: string, addressDetail?: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || query.length < 3) {
      toast.error('Masukkan minimal 3 karakter untuk mencari');
      return;
    }

    setIsLoading(true);
    setResults([]);
    try {
      const response = await fetch(
        `${API_URL}/v1/admin/settings/shipping/villages?search=${encodeURIComponent(query)}`,
        {
          credentials: 'include',
        },
      );
      const resData = await response.json();

      if (
        response.ok && (resData.data?.status === 'success' || resData.data?.is_success === true)
      ) {
        const items = resData.data?.result || resData.data?.data || [];
        setResults(items);
        if (items.length === 0) {
          toast.error('Tidak ada desa/kelurahan yang cocok dengan pencarian Anda.');
        }
      } else {
        toast.error(resData.error?.message || resData.data?.message || 'Gagal mencari data');
      }
    } catch (e) {
      console.error(e);
      toast.error('Kesalahan jaringan saat mencari');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
          <h3 className='font-bold text-gray-900 text-lg'>Cari Kode Desa</h3>
          <button
            type='button'
            onClick={onClose}
            className='p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='p-5'>
          <form onSubmit={handleSearch} className='flex gap-2 mb-4'>
            <div className='relative flex-1'>
              <input
                type='text'
                autoFocus
                placeholder='Ketik nama Desa atau Kecamatan...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
              />
              <Search className='absolute left-3 top-2.5 w-4 h-4 text-gray-400' />
            </div>
            <button
              type='submit'
              disabled={isLoading}
              className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50'
            >
              {isLoading ? <Loader2 className='w-4 h-4 animate-spin mx-auto' /> : 'Cari'}
            </button>
          </form>

          <div className='max-h-[300px] overflow-y-auto rounded-lg border border-gray-100 bg-gray-50/50'>
            {isLoading
              ? (
                <div className='flex flex-col items-center justify-center py-10 text-gray-400'>
                  <Loader2 className='w-6 h-6 animate-spin mb-2 text-indigo-500' />
                  <span className='text-sm'>Mencari desa...</span>
                </div>
              )
              : results.length > 0
              ? (
                <div className='divide-y divide-gray-100'>
                  {results.map((item, idx) => (
                    <button
                      key={idx}
                      type='button'
                      onClick={() => {
                        const vCode = item.code || item.village_code;
                        const vName = item.name || item.village_name;
                        const dName = item.district || item.district_name;
                        const cName = item.regency || item.city || item.city_name;
                        const pName = item.province || item.province_name;

                        onSelect(vCode, `${vName}, Kec. ${dName}, ${cName}, ${pName}`);
                        onClose();
                      }}
                      className='w-full text-left px-4 py-3 hover:bg-indigo-50/70 transition flex items-start gap-3'
                    >
                      <MapPin className='w-5 h-5 text-indigo-400 mt-0.5 shrink-0' />
                      <div>
                        <p className='text-sm font-bold text-gray-900'>
                          {item.name || item.village_name}
                        </p>
                        <p className='text-xs text-gray-500 mt-0.5'>
                          Kec. {item.district || item.district_name},{' '}
                          {item.regency || item.city || item.city_name},{' '}
                          {item.province || item.province_name}
                        </p>
                        <span className='inline-block mt-1.5 bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded font-mono'>
                          Code: {item.code || item.village_code}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )
              : query && !isLoading
              ? (
                <div className='py-10 text-center text-sm text-gray-500'>
                  Gunakan kata kunci yang lebih spesifik jika hasil tidak ditemukan.
                </div>
              )
              : (
                <div className='py-10 text-center text-sm text-gray-500'>
                  Ketik nama desa atau kecamatan lalu tekan Cari.
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
