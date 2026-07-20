import { useEffect, useState } from 'react';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';
import { Loader2, MapPin, Save } from 'lucide-react';

export function StoreLocationForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [address, setAddress] = useState({
    provinceId: '',
    cityId: '',
    districtId: '',
    postalCode: '',
    fullAddress: '',
  });

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await (client.v1.admin as any).settings.$get({ query: { app: 'global' } });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.storeOriginAddress) {
          setAddress({
            provinceId: json.data.storeOriginAddress.provinceId || '',
            cityId: json.data.storeOriginAddress.cityId || '',
            districtId: json.data.storeOriginAddress.districtId || '',
            postalCode: json.data.storeOriginAddress.postalCode || '',
            fullAddress: json.data.storeOriginAddress.fullAddress || '',
          });
        }
        setIsDirty(false);
      }
    } catch (_e) {
      toast.error('Gagal memuat pengaturan lokasi toko');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await (client.v1.admin as any).settings.$put({
        json: {
          appId: 'global',
          storeOriginAddress: address,
        },
      });
      if (res.ok) {
        toast.success('Lokasi asal toko berhasil disimpan!');
        setIsDirty(false);
      } else {
        toast.error('Gagal menyimpan lokasi');
      }
    } catch (_e) {
      toast.error('Kesalahan jaringan');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center text-gray-500'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  const inputCls =
    'mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 bg-gray-50/50';

  return (
    <div className='space-y-6 pb-24'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm'>
        <div className='flex items-center gap-3'>
          <MapPin className='w-6 h-6 text-indigo-500' />
          <div>
            <h2 className='text-lg font-bold text-gray-900'>Lokasi Asal (Origin)</h2>
            <p className='text-sm text-gray-500'>
              Lokasi ini digunakan untuk menghitung tarif ongkir secara akurat dan sebagai titik
              penjemputan (pickup) kurir.
            </p>
          </div>
        </div>
        <div className='flex gap-2'>
          <button
            type='button'
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className='inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-50 transition'
          >
            {isSaving ? <Loader2 className='w-4 h-4 animate-spin' /> : <Save className='w-4 h-4' />}
            Simpan Alamat
          </button>
        </div>
      </div>

      <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Provinsi (Origin)
            </label>
            <input
              type='text'
              name='provinceId'
              value={address.provinceId}
              onChange={handleChange}
              placeholder='Contoh: DKI Jakarta'
              className={inputCls}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Kota / Kabupaten (Origin)
            </label>
            <input
              type='text'
              name='cityId'
              value={address.cityId}
              onChange={handleChange}
              placeholder='Contoh: Jakarta Selatan'
              className={inputCls}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Kecamatan
            </label>
            <input
              type='text'
              name='districtId'
              value={address.districtId}
              onChange={handleChange}
              placeholder='Contoh: Kebayoran Baru'
              className={inputCls}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Kode Pos
            </label>
            <input
              type='text'
              name='postalCode'
              value={address.postalCode}
              onChange={handleChange}
              placeholder='Contoh: 12110'
              className={inputCls}
            />
          </div>
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Alamat Lengkap Toko
            </label>
            <textarea
              name='fullAddress'
              value={address.fullAddress}
              onChange={handleChange}
              rows={3}
              placeholder='Nama Jalan, Gedung, No. Rumah, RT/RW (Detail patokan untuk kurir pickup)'
              className={inputCls}
            />
            <p className='mt-2 text-xs text-gray-500'>
              Pastikan alamat lengkap ditulis selengkap mungkin untuk memudahkan kurir menjemput
              barang jualan Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
