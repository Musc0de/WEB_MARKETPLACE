import { useEffect, useState } from 'react';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';
import { InventoryAdjustModal } from './InventoryAdjustModal.tsx';
import { Pagination } from '../../components/Pagination.tsx';

type InventoryLevel = {
  id: string;
  variantId: string;
  warehouseId: string;
  available: number;
  reserved: number;
  damaged: number;
  updatedAt: string;
  initialStock?: number;
  variant: {
    sku: string;
    size?: string | null;
  };
  product: {
    name: string;
  };
};

export function InventoryList() {
  const [levels, setLevels] = useState<InventoryLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adjustingLevel, setAdjustingLevel] = useState<InventoryLevel | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await client.v1.admin.inventory.$get();
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
  }, []);

  const totalInitial = levels.reduce((sum, l) => sum + (l.initialStock ?? 0), 0);
  const totalAvailable = levels.reduce((sum, l) => sum + l.available, 0);
  const totalReserved = levels.reduce((sum, l) => sum + l.reserved, 0);
  const totalDamaged = levels.reduce((sum, l) => sum + l.damaged, 0);

  const paginatedLevels = levels.slice((page - 1) * limit, page * limit);

  return (
    <div className='max-w-6xl mx-auto space-y-6 pb-16 px-4 md:px-0'>
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4 pb-2'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 tracking-tight'>Manajemen Inventaris</h1>
          <p className='text-sm text-gray-500 mt-2'>
            Pantau dan kelola ketersediaan stok produk Anda di gudang
          </p>
        </div>
        <div>
          <button
            type='button'
            onClick={fetchInventory}
            disabled={isLoading}
            className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm disabled:opacity-50'
          >
            <svg
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
            Muat Ulang
          </button>
        </div>
      </div>

      {/* ── Summary Cards ───────────────────────────────────────────────────── */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white border border-gray-200 rounded-xl p-4 shadow-sm'>
          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
            Total Stok Awal
          </p>
          <p className='text-2xl font-bold text-gray-900 mt-1'>{totalInitial}</p>
        </div>
        <div className='bg-white border border-gray-200 rounded-xl p-4 shadow-sm'>
          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
            Total Tersedia
          </p>
          <p className='text-2xl font-bold text-emerald-600 mt-1'>{totalAvailable}</p>
        </div>
        <div className='bg-white border border-gray-200 rounded-xl p-4 shadow-sm'>
          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
            Total Di Pesan
          </p>
          <p className='text-2xl font-bold text-amber-600 mt-1'>{totalReserved}</p>
        </div>
        <div className='bg-white border border-gray-200 rounded-xl p-4 shadow-sm'>
          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Total Rusak</p>
          <p className='text-2xl font-bold text-rose-600 mt-1'>{totalDamaged}</p>
        </div>
      </div>

      {/* ── Inventory Table ─────────────────────────────────────────────────── */}
      <div className='bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden'>
        {isLoading
          ? (
            <div className='min-h-[40vh] flex flex-col items-center justify-center gap-3 text-gray-400'>
              <svg className='w-8 h-8 animate-spin' fill='none' viewBox='0 0 24 24'>
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
              </svg>
              <p className='text-sm'>Memuat data inventaris...</p>
            </div>
          )
          : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm text-left'>
                <thead className='bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  <tr>
                    <th className='px-6 py-4'>Produk</th>
                    <th className='px-6 py-4'>SKU</th>
                    <th className='px-6 py-4'>Ukuran</th>
                    <th className='px-6 py-4'>Stok Awal</th>
                    <th className='px-6 py-4'>Tersedia</th>
                    <th className='px-6 py-4'>Di Pesan</th>
                    <th className='px-6 py-4'>Rusak</th>
                    <th className='px-6 py-4 text-right'>Aksi</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {levels.length === 0
                    ? (
                      <tr>
                        <td colSpan={8} className='px-6 py-12 text-center text-gray-500'>
                          <div className='flex flex-col items-center gap-2'>
                            <svg
                              className='w-8 h-8 text-gray-300'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={1.5}
                                d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                              />
                            </svg>
                            <p>Belum ada catatan inventaris.</p>
                          </div>
                        </td>
                      </tr>
                    )
                    : (
                      paginatedLevels.map((level) => (
                        <tr key={level.id} className='hover:bg-gray-50/80 transition-colors'>
                          <td className='px-6 py-4 font-medium text-gray-900'>
                            {level.product.name}
                          </td>
                          <td className='px-6 py-4 font-mono text-xs text-gray-600'>
                            {level.variant.sku}
                          </td>
                          <td className='px-6 py-4 text-xs font-medium text-gray-700'>
                            {level.variant.size || '—'}
                          </td>
                          <td className='px-6 py-4 font-medium text-gray-500'>
                            {level.initialStock ?? 0}
                          </td>
                          <td className='px-6 py-4'>
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                level.available > 0
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {level.available} unit
                            </span>
                          </td>
                          <td className='px-6 py-4 text-amber-600 font-medium'>
                            {level.reserved}
                          </td>
                          <td className='px-6 py-4 text-rose-600 font-medium'>
                            {level.damaged}
                          </td>
                          <td className='px-6 py-4 text-right'>
                            <button
                              type='button'
                              onClick={() =>
                                setAdjustingLevel(level)}
                              className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm'
                            >
                              <svg
                                className='w-3.5 h-3.5'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                                />
                              </svg>
                              Sesuaikan
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {levels.length > 0 && (
        <Pagination
          page={page}
          limit={limit}
          total={levels.length}
          onPageChange={setPage}
        />
      )}

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
