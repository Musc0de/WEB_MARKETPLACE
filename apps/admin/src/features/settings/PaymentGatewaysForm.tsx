import { useEffect, useState } from 'react';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';
import { CreditCard, Loader2, Save } from 'lucide-react';

const PROVIDERS = [
  { id: 'louvin', name: 'Louvin Payment Gateway' },
  { id: 'saweria', name: 'Saweria Payment' },
  { id: 'xendit', name: 'Xendit' },
  { id: 'duid', name: 'DUID' },
  { id: 'midtrans', name: 'Midtrans' },
  { id: 'qris_interactive', name: 'QRIS Official (qris.interactive.co.id)' },
  { id: 'dompetx', name: 'DompetX (dompetx.com)' },
  { id: 'tripay', name: 'Tripay' },
];

export function PaymentGatewaysForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeGateway, setActiveGateway] = useState<string>('sandbox');
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
        setActiveGateway(json.data?.activePaymentGateway || 'sandbox');
        setConfigs(json.data?.paymentGatewayConfigs || {});
        setIsDirty(false);
      }
    } catch (_e) {
      toast.error('Gagal memuat pengaturan payment gateway');
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
          activePaymentGateway: activeGateway,
          paymentGatewayConfigs: configs,
        },
      });
      if (res.ok) {
        toast.success('Pengaturan Payment Gateway disimpan!');
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
          <CreditCard className='w-6 h-6 text-gray-500' />
          <div>
            <h2 className='text-lg font-bold text-gray-900'>Payment Gateways</h2>
            <p className='text-sm text-gray-500'>
              Kelola integrasi penyedia pembayaran dan konfigurasinya.
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
            {isSaving ? <Loader2 className='h-4 w-4 animate-spin' /> : <Save className='h-4 w-4' />}
            Simpan Konfigurasi
          </button>
        </div>
      </div>

      <div className='bg-blue-50 rounded-xl border border-blue-200 p-5 shadow-sm flex items-center justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <h3 className='font-bold text-blue-900'>Sandbox Lokal (Bypass/Testing)</h3>
            {activeGateway === 'sandbox' && (
              <span className='bg-blue-600 text-white text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 rounded-full'>
                ACTIVE GATEWAY
              </span>
            )}
          </div>
          <p className='text-sm text-blue-700 mt-1'>
            Gunakan ini untuk melewati proses pembayaran nyata saat *development* atau *testing*.
          </p>
        </div>
        {activeGateway !== 'sandbox' && (
          <button
            type='button'
            onClick={() => {
              setActiveGateway('sandbox');
              setIsDirty(true);
            }}
            className='px-4 py-2 bg-white text-blue-600 text-sm font-semibold rounded-lg shadow-sm border border-blue-200 hover:bg-blue-100 transition'
          >
            Jadikan Aktif
          </button>
        )}
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-2'>
        {PROVIDERS.map((provider) => {
          const mode = configs[provider.id]?.mode || 'sandbox';
          const isProduction = mode === 'production';
          const isActiveGateway = activeGateway === provider.id;

          return (
            <div
              key={provider.id}
              className={`flex flex-col relative bg-white rounded-2xl border p-5 shadow-sm transition-all ${
                isActiveGateway
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-blue-100'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className='flex justify-between items-start mb-4'>
                <div className='pr-4'>
                  <h3
                    className={`font-bold text-lg leading-tight ${
                      isActiveGateway ? 'text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {provider.name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      isProduction ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    API: {isProduction ? 'PRODUCTION' : 'SANDBOX'}
                  </span>
                </div>
                {isActiveGateway && (
                  <span className='bg-blue-600 text-white text-[10px] tracking-wider uppercase font-bold px-2.5 py-1 rounded-full flex-shrink-0'>
                    ACTIVE
                  </span>
                )}
              </div>

              <div className='flex-1 border-t border-gray-100 pt-4 mt-auto'>
                <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
                  Operational Mode
                </label>
                <div className='flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200 w-max'>
                  <button
                    type='button'
                    onClick={() => updateProviderMode(provider.id, 'sandbox')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
                      !isProduction
                        ? 'bg-white shadow-sm text-gray-900 ring-1 ring-gray-200'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    Sandbox
                  </button>
                  <button
                    type='button'
                    onClick={() => updateProviderMode(provider.id, 'production')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
                      isProduction
                        ? 'bg-white shadow-sm text-gray-900 ring-1 ring-gray-200'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    Production
                  </button>
                </div>
              </div>

              {provider.id === 'saweria' && (
                <div className='mt-4 pt-4 border-t border-gray-100'>
                  <label className='block text-xs font-semibold text-gray-700 mb-2'>
                    Saweria URL (Checkout Destination)
                  </label>
                  <input
                    type='url'
                    placeholder='https://saweria.co/ownertmail'
                    className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    value={configs[provider.id]?.config?.supportPageUrl || ''}
                    onChange={(e) => {
                      setConfigs((prev) => ({
                        ...prev,
                        [provider.id]: {
                          ...prev[provider.id],
                          mode: prev[provider.id]?.mode || 'production',
                          config: { ...prev[provider.id]?.config, supportPageUrl: e.target.value },
                        } as any,
                      }));
                      setIsDirty(true);
                    }}
                  />
                </div>
              )}

              {!isActiveGateway && (
                <div className='mt-5'>
                  <button
                    type='button'
                    onClick={() => {
                      setActiveGateway(provider.id);
                      setIsDirty(true);
                    }}
                    className='w-full py-2.5 bg-gray-50 hover:bg-blue-50 text-blue-600 text-sm font-semibold rounded-xl border border-gray-200 hover:border-blue-200 transition-colors'
                  >
                    Set as Active Gateway
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
