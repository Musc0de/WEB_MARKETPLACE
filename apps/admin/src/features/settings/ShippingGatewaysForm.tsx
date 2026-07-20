import { useEffect, useState } from 'react';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';
import { Box, Loader2, Save } from 'lucide-react';
import { ApiCoidTestWidget } from './ApiCoidTestWidget.tsx';

const PROVIDERS = [
  { id: 'biteship', name: 'Biteship (Rekomendasi - Resi & Pickup Otomatis)' },
  { id: 'rajaongkir', name: 'RajaOngkir (Cek Tarif Saja)' },
  { id: 'shipper', name: 'Shipper (Biteship Alternative)' },
  { id: 'apicoid', name: 'Api Cek Ongkos Kirim (api.co.id)' },
];

export function ShippingGatewaysForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeGateway, setActiveGateway] = useState<string>('none');
  const [configs, setConfigs] = useState<
    Record<string, { mode: 'sandbox' | 'production'; config?: any }>
  >({});
  const [isDirty, setIsDirty] = useState(false);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await (client.v1.admin as any).settings.$get({ query: { app: 'global' } });
      if (res.ok) {
        const json = await res.json();
        setActiveGateway(json.data?.activeShippingGateway || 'none');
        setConfigs(json.data?.shippingGatewayConfigs || {});
        setIsDirty(false);
      }
    } catch (_e) {
      toast.error('Gagal memuat pengaturan shipping gateway');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await (client.v1.admin as any).settings.$put({
        json: {
          appId: 'global',
          activeShippingGateway: activeGateway,
          shippingGatewayConfigs: configs,
        },
      });
      if (res.ok) {
        toast.success('Pengaturan Shipping Gateway disimpan!');
        setIsDirty(false);
      } else {
        toast.error('Gagal menyimpan pengaturan');
      }
    } catch (_e) {
      toast.error('Kesalahan jaringan');
    } finally {
      setIsSaving(false);
    }
  };

  const updateProviderMode = (providerId: string, mode: 'sandbox' | 'production') => {
    setConfigs((prev) => ({
      ...prev,
      [providerId]: { ...prev[providerId], mode },
    }));
    setIsDirty(true);
  };

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center text-gray-500'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='space-y-6 pb-24'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm'>
        <div className='flex items-center gap-3'>
          <Box className='w-6 h-6 text-gray-500' />
          <div>
            <h2 className='text-lg font-bold text-gray-900'>Cek Ongkir & Ekspedisi</h2>
            <p className='text-sm text-gray-500'>
              Pilih provider API yang akan digunakan untuk menghitung tarif ongkir dan penjemputan
              otomatis.
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
            Simpan Perubahan
          </button>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* No Gateway Option */}
        <div
          className={`relative rounded-xl border-2 p-5 transition-all cursor-pointer ${
            activeGateway === 'none'
              ? 'border-indigo-500 bg-indigo-50/30 shadow-md'
              : 'border-gray-200 bg-white hover:border-indigo-200'
          }`}
          onClick={() => {
            setActiveGateway('none');
            setIsDirty(true);
          }}
        >
          <div className='flex items-start justify-between mb-4'>
            <div>
              <h3 className='font-bold text-gray-900'>Tidak Ada Integrasi</h3>
              <p className='text-xs text-gray-500 mt-1'>
                Pilih opsi ini jika Anda tidak menjual produk fisik.
              </p>
            </div>
            <div className='flex h-5 items-center'>
              <input
                type='radio'
                checked={activeGateway === 'none'}
                readOnly
                className='h-4 w-4 text-indigo-600 focus:ring-indigo-600'
              />
            </div>
          </div>
        </div>

        {PROVIDERS.map((provider) => {
          const isActive = activeGateway === provider.id;
          const config = configs[provider.id] || { mode: 'sandbox' };

          return (
            <div
              key={provider.id}
              className={`relative rounded-xl border-2 p-5 transition-all ${
                isActive
                  ? 'border-indigo-500 bg-indigo-50/30 shadow-md'
                  : 'border-gray-200 bg-white hover:border-indigo-200'
              }`}
            >
              <div
                className='flex items-start justify-between mb-4 cursor-pointer'
                onClick={() => {
                  setActiveGateway(provider.id);
                  setIsDirty(true);
                }}
              >
                <div>
                  <h3 className='font-bold text-gray-900'>{provider.name}</h3>
                  <p className='text-xs text-gray-500 mt-1'>
                    Integrasi resmi via API {provider.name.split(' ')[0]}.
                  </p>
                </div>
                <div className='flex h-5 items-center'>
                  <input
                    type='radio'
                    checked={isActive}
                    readOnly
                    className='h-4 w-4 text-indigo-600 focus:ring-indigo-600 cursor-pointer'
                  />
                </div>
              </div>

              {/* Mode Toggle */}
              <div className='mt-4 pt-4 border-t border-gray-100'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-gray-700'>Mode Environment</span>
                  <div className='flex items-center bg-gray-100 rounded-lg p-1'>
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation();
                        updateProviderMode(provider.id, 'sandbox');
                      }}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                        config.mode === 'sandbox'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Sandbox
                    </button>
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation();
                        updateProviderMode(provider.id, 'production');
                      }}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                        config.mode === 'production'
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Production
                    </button>
                  </div>
                </div>
              </div>

              {isActive && (
                <div className='mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100'>
                  <p className='text-xs text-indigo-700 font-medium'>
                    Gateway aktif! Masukkan kredensial API Key pada file .env backend untuk mulai
                    menggunakan.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activeGateway === 'apicoid' && <ApiCoidTestWidget />}
    </div>
  );
}
