import { useEffect, useState } from 'react';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';
import { InventoryAdjustModal } from '../inventory/InventoryAdjustModal.tsx';

type InventoryLevel = {
  id: string;
  variantId: string;
  warehouseId: string;
  available: number;
  reserved: number;
  damaged: number;
  updatedAt: string;
  initialStock?: number;
  variant: { sku: string };
  product: { name: string };
};

export function ProductInventory({ productId }: { productId: string }) {
  const [levels, setLevels] = useState<InventoryLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adjustingLevel, setAdjustingLevel] = useState<InventoryLevel | null>(null);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      // Hono RPC might not have strict query typing if not using zValidator, so we cast to any if needed
      const res = await (client.v1.admin.inventory.$get as any)({
        query: { productId },
      });
      if (!res.ok) throw new Error('Gagal memuat inventaris');
      const data = await res.json();
      setLevels(data.data as any);
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat memuat inventaris');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    const handleFocus = () => fetchInventory();
    globalThis.addEventListener('focus', handleFocus);
    return () => globalThis.removeEventListener('focus', handleFocus);
  }, [productId]);

  return (
    <div className='border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden mb-6'>
      <div className='px-5 py-4 border-b border-gray-100 flex items-center justify-between'>
        <h2 className='text-lg font-bold text-gray-900'>Stok & Inventaris</h2>
        <button
          type='button'
          onClick={fetchInventory}
          disabled={isLoading}
          className='text-xs font-semibold text-gray-500 hover:text-gray-800'
        >
          {isLoading ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
            <tr>
              <th className='px-5 py-3'>SKU</th>
              <th className='px-5 py-3 text-right'>Stok Awal</th>
              <th className='px-5 py-3 text-right'>Tersedia</th>
              <th className='px-5 py-3 text-right'>Dipesan</th>
              <th className='px-5 py-3 text-right'>Rusak</th>
              <th className='px-5 py-3 text-right'>Aksi</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-50'>
            {levels.length === 0 ? (
              <tr>
                <td colSpan={6} className='px-5 py-8 text-center text-gray-500 text-sm'>
                  Belum ada data inventaris.
                </td>
              </tr>
            ) : (
              levels.map((level) => (
                <tr key={level.id} className='hover:bg-gray-50/50 transition-colors'>
                  <td className='px-5 py-3 font-mono text-xs text-gray-700 font-medium'>
                    {level.variant.sku}
                  </td>
                  <td className='px-5 py-3 text-right text-gray-500 font-medium'>
                    {level.initialStock ?? 0}
                  </td>
                  <td className='px-5 py-3 text-right'>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                      level.available > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {level.available} unit
                    </span>
                  </td>
                  <td className='px-5 py-3 text-right text-amber-600 font-medium'>
                    {level.reserved}
                  </td>
                  <td className='px-5 py-3 text-right text-rose-600 font-medium'>
                    {level.damaged}
                  </td>
                  <td className='px-5 py-3 text-right'>
                    <button
                      type='button'
                      onClick={() => setAdjustingLevel(level)}
                      className='inline-flex items-center px-2.5 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm'
                    >
                      Sesuaikan
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {adjustingLevel && (
        <InventoryAdjustModal
          variantId={adjustingLevel.variantId}
          warehouseId={adjustingLevel.warehouseId}
          variantName={`${adjustingLevel.product.name} (${adjustingLevel.variant.sku})`}
          currentStock={adjustingLevel.available}
          onClose={() => setAdjustingLevel(null)}
          onSuccess={() => {
            setAdjustingLevel(null);
            fetchInventory();
          }}
        />
      )}
    </div>
  );
}
