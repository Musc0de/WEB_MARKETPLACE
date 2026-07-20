import { useEffect, useState } from 'react';
import { API_URL, client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';
import { Loader2, Search, Truck } from 'lucide-react';

export function ApiCoidTestWidget() {
  const [originCode, setOriginCode] = useState('');
  const [destinationCode, setDestinationCode] = useState('');
  const [weight, setWeight] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    // Fetch settings to get API key and Origin Village Code
    (client.v1.admin as any).settings.$get({ query: { app: 'global' } })
      .then((res: any) => res.json())
      .then((json: any) => {
        const data = json.data as any;
        if (data?.storeOriginAddress?.villageCode) {
          setOriginCode(data.storeOriginAddress.villageCode);
        }
      })
      .catch(() => console.error('Failed to load settings for test widget'));
  }, []);

  const handleTest = async () => {
    if (!originCode) {
      toast.error('Kode Desa Origin belum diatur di menu Store Location.');
      return;
    }
    if (!destinationCode || destinationCode.length !== 10) {
      toast.error('Masukkan 10 digit Kode Desa Tujuan dengan benar.');
      return;
    }
    if (!weight || Number(weight) <= 0) {
      toast.error('Berat paket harus lebih dari 0.');
      return;
    }

    setIsLoading(true);
    setResults([]);
    try {
      const response = await fetch(
        `${API_URL}/v1/admin/settings/shipping/cost?origin_village_code=${originCode}&destination_village_code=${destinationCode}&weight=${weight}`,
        {
          credentials: 'include',
        },
      );

      const resData = await response.json();

      if (
        response.ok && (resData.data?.status === 'success' || resData.data?.is_success === true)
      ) {
        // Data API terbungkus di dalam data.data.couriers
        const items = resData.data?.data?.couriers || resData.data?.result || resData.data?.data ||
          [];
        setResults(items);
        toast.success('Berhasil mendapatkan estimasi ongkir!');
      } else {
        toast.error(
          resData.error?.message || resData.data?.message || 'Gagal mengambil data ongkir dari API',
        );
      }
    } catch (e) {
      console.error(e);
      toast.error('Kesalahan jaringan saat menghubungi backend API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mt-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden'>
      <div className='bg-gray-50 px-5 py-4 border-b border-gray-200'>
        <div className='flex items-center gap-2'>
          <Truck className='w-5 h-5 text-indigo-600' />
          <h3 className='font-bold text-gray-900'>Alat Uji Cek Ongkir (api.co.id)</h3>
        </div>
        <p className='text-xs text-gray-500 mt-1'>
          Uji langsung koneksi API dan simulasi perhitungan tarif ke seluruh Indonesia secara live.
        </p>
      </div>

      <div className='p-5'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div>
            <label className='block text-xs font-medium text-gray-700 mb-1'>
              Origin (Kode Desa 10 Digit)
            </label>
            <input
              type='text'
              value={originCode}
              readOnly
              className='w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 text-gray-500'
              title='Diambil otomatis dari pengaturan Store Location'
            />
          </div>
          <div>
            <label className='block text-xs font-medium text-gray-700 mb-1'>
              Destination (Kode Desa 10 Digit)
            </label>
            <input
              type='text'
              value={destinationCode}
              onChange={(e) => setDestinationCode(e.target.value)}
              placeholder='Contoh: 3204282004'
              className='w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
            />
          </div>
          <div>
            <label className='block text-xs font-medium text-gray-700 mb-1'>Berat (kg)</label>
            <input
              type='number'
              step='0.1'
              min='0.1'
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder='Contoh: 0.4 (400 gr)'
              className='w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
            />
          </div>
        </div>

        <div className='flex justify-end mb-6'>
          <button
            type='button'
            onClick={handleTest}
            disabled={isLoading}
            className='inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50'
          >
            {isLoading
              ? <Loader2 className='w-4 h-4 animate-spin' />
              : <Search className='w-4 h-4' />}
            Test Cek Ongkir
          </button>
        </div>

        {results.length > 0 && (
          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'
                  >
                    Kurir
                  </th>
                  <th
                    scope='col'
                    className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'
                  >
                    Layanan
                  </th>
                  <th
                    scope='col'
                    className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'
                  >
                    Estimasi
                  </th>
                  <th
                    scope='col'
                    className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase'
                  >
                    Berat (kg)
                  </th>
                  <th
                    scope='col'
                    className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase'
                  >
                    Tarif (Rp)
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {results.map((res, i) => (
                  <tr key={i} className='hover:bg-gray-50 transition'>
                    <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {res.courier_code}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                      {res.courier_name}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                      {res.estimation || '-'}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center'>
                      {res.weight}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right'>
                      {res.price.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
