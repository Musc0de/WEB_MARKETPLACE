import { useEffect, useState } from 'react';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';
import { CreditCard, Loader2, Save, Server, ShieldCheck } from 'lucide-react';

const PROVIDERS = [
  { id: 'louvin', name: 'Louvin Payment Gateway' },
  { id: 'xendit', name: 'Xendit' },
  { id: 'duid', name: 'DUID' },
  { id: 'midtrans', name: 'Midtrans' },
  { id: 'qris_official', name: 'QRIS Official (qris.interactive.co.id)' },
  { id: 'dompetx', name: 'DompetX (dompetx.com)' },
  { id: 'tripay', name: 'Tripay' },
];

export function PaymentGatewaysForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeGateway, setActiveGateway] = useState<string>('sandbox');
  const [configs, setConfigs] = useState<Record<string, { mode: 'sandbox' | 'production' }>>({});
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

      <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6'>
        <label className='block text-base font-semibold text-gray-900 mb-2'>
          Active Payment Gateway
        </label>
        <p className='text-sm text-gray-500 mb-4'>
          Pilih gateway utama yang akan digunakan untuk memproses transaksi pengguna saat ini.
        </p>
        <select
          value={activeGateway}
          onChange={(e) => {
            setActiveGateway(e.target.value);
            setIsDirty(true);
          }}
          className='w-full max-w-md rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all'
        >
          <option value='sandbox'>Sandbox Lokal (Bypass/Testing)</option>
          {PROVIDERS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2'>
        {PROVIDERS.map((provider) => {
          const mode = configs[provider.id]?.mode || 'sandbox';
          const isProduction = mode === 'production';

          return (
            <div
              key={provider.id}
              className='bg-white rounded-xl border border-gray-200 p-5 shadow-sm'
            >
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h3 className='font-bold text-gray-900'>{provider.name}</h3>
                  <span
                    className={`inline-flex items-center gap-1 mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isProduction ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {isProduction
                      ? <ShieldCheck className='w-3 h-3' />
                      : <Server className='w-3 h-3' />}
                    {isProduction ? 'PRODUCTION' : 'SANDBOX'}
                  </span>
                </div>
              </div>

              <div className='pt-4 border-t border-gray-100'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Operational Mode
                </label>
                <div className='flex items-center gap-3 bg-gray-50 p-1.5 rounded-lg border border-gray-200 w-max'>
                  <button
                    type='button'
                    onClick={() => updateProviderMode(provider.id, 'sandbox')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      !isProduction
                        ? 'bg-white shadow-sm text-gray-900 ring-1 ring-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Sandbox
                  </button>
                  <button
                    type='button'
                    onClick={() => updateProviderMode(provider.id, 'production')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      isProduction
                        ? 'bg-white shadow-sm text-gray-900 ring-1 ring-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Production
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
