import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ReturnsPage = () => {
  const navigate = useNavigate();

  const { data: myReturns, mutate: _mutateReturns, isLoading: isLoadingReturns } = useSWR(
    '/api/returns',
    async () => {
      const res = await (client.v1 as any).returns.$get();
      const json = await res.json();
      return json.data || [];
    },
  );

  return (
    <div className='max-w-4xl mx-auto space-y-6 relative'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
          Riwayat Pengembalian & Komplain
        </h1>
        <p className='text-gray-500 mt-1'>
          Lacak status pengajuan pengembalian dana atau tukar barang Anda.
        </p>
      </div>

      <div className='space-y-4'>
        {isLoadingReturns
          ? <div className='animate-pulse bg-gray-50 border border-gray-100 h-32 rounded-xl'></div>
          : myReturns?.length === 0
          ? (
            <div className='text-center py-20 bg-gray-50 rounded-xl border border-gray-100'>
              <Package className='w-12 h-12 mx-auto text-gray-300 mb-4' />
              <h3 className='text-lg font-bold text-gray-900 mb-2'>Tidak Ada Riwayat</h3>
              <p className='text-gray-500 text-sm mb-4'>
                Anda belum pernah mengajukan pengembalian barang atau dana.
              </p>
              <button
                type='button'
                onClick={() => navigate('/orders')}
                className='px-6 py-2 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition'
              >
                Lihat Pesanan Saya
              </button>
            </div>
          )
          : (
            myReturns?.map((ret: any) => (
              <div
                key={ret.id}
                className='bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition'
              >
                <div className='flex items-center justify-between mb-4'>
                  <div>
                    <span className='text-xs font-bold text-gray-400'>ID PENGEMBALIAN</span>
                    <p className='font-mono font-bold text-gray-900'>
                      {ret.returnNumber || ret.id.split('-')[0].toUpperCase()}
                    </p>
                  </div>
                  <div className='text-right'>
                    <span className='inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700'>
                      {ret.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className='flex items-center gap-4 py-4 border-t border-gray-100'>
                  <div className='flex-1'>
                    <p className='text-sm text-gray-600 mb-1'>Solusi yang Diajukan:</p>
                    <p className='font-bold text-gray-900 capitalize'>
                      {ret.resolution.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div className='flex-1 border-l border-gray-100 pl-4'>
                    <p className='text-sm text-gray-600 mb-1'>Alasan:</p>
                    <p className='font-bold text-gray-900 capitalize'>
                      {ret.reasonCode?.replace(/_/g, ' ') || '-'}
                    </p>
                  </div>
                  <div className='flex-1 border-l border-gray-100 pl-4'>
                    <p className='text-sm text-gray-600 mb-1'>Nominal Diajukan:</p>
                    <p className='font-bold text-orange-600'>
                      Rp {ret.requestedAmount?.toLocaleString('id-ID') || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
      </div>
    </div>
  );
};
