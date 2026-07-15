import { useState } from 'react';
import useSWR from 'swr';
import { API_URL, client } from '../../lib/api.ts';
import { Button, Card } from '@starsuperscare/ui';
import { Image as ImageIcon, Package, RotateCcw } from 'lucide-react';
import { ReturnForm } from './ReturnForm.tsx';

export const ReturnsPage = () => {
  const [activeTab, setActiveTab] = useState<'eligible' | 'mine'>('eligible');
  const [creatingReturnFor, setCreatingReturnFor] = useState<any | null>(null);

  const { data: eligibleItems, mutate: mutateEligible, isLoading: isLoadingEligible } = useSWR(
    '/api/returns/eligible',
    async () => {
      const res = await (client.v1 as any).returns.eligible.$get();
      const json = await res.json();
      return json.data || [];
    },
  );

  const { data: myReturns, mutate: mutateReturns, isLoading: isLoadingReturns } = useSWR(
    '/api/returns',
    async () => {
      const res = await (client.v1 as any).returns.$get();
      const json = await res.json();
      return json.data || [];
    },
  );

  const getMediaUrl = (key: string | null) => {
    if (!key) return null;
    return `${API_URL}/v1/admin/assets/${key}`;
  };

  // Group eligible items by order
  const eligibleOrders = eligibleItems?.reduce((acc: any, item: any) => {
    if (!acc[item.orderId]) {
      acc[item.orderId] = {
        orderId: item.orderId,
        orderNumber: item.orderNumber,
        purchasedAt: item.purchasedAt,
        items: [],
      };
    }
    acc[item.orderId].items.push(item);
    return acc;
  }, {});

  const orderList = eligibleOrders ? Object.values(eligibleOrders) : [];

  return (
    <div className='max-w-4xl mx-auto space-y-6 relative'>
      <div>
        <h1 className='text-2xl font-bold text-white flex items-center gap-2'>
          Pengembalian & Komplain
        </h1>
        <p className='text-muted-foreground mt-1'>
          Ajukan pengembalian dana atau tukar barang untuk pesanan yang bermasalah.
        </p>
      </div>

      <div className='flex gap-4 border-b border-white/10'>
        <button
          type='button'
          className={`pb-2 px-1 border-b-2 transition-colors ${
            activeTab === 'eligible'
              ? 'border-primary text-primary font-medium'
              : 'border-transparent text-muted-foreground hover:text-white'
          }`}
          onClick={() => setActiveTab('eligible')}
        >
          Pesanan Memenuhi Syarat
        </button>
        <button
          type='button'
          className={`pb-2 px-1 border-b-2 transition-colors ${
            activeTab === 'mine'
              ? 'border-primary text-primary font-medium'
              : 'border-transparent text-muted-foreground hover:text-white'
          }`}
          onClick={() => setActiveTab('mine')}
        >
          Riwayat Pengembalian
        </button>
      </div>

      {activeTab === 'eligible' && (
        <div className='space-y-4'>
          {isLoadingEligible
            ? (
              <div className='animate-pulse bg-white/5 border border-white/10 h-32 rounded-xl'>
              </div>
            )
            : orderList.length === 0
            ? (
              <div className='text-center py-20 bg-white/5 rounded-xl border border-white/10'>
                <Package className='w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50' />
                <h3 className='text-lg font-medium text-white mb-2'>Tidak Ada Pesanan</h3>
                <p className='text-muted-foreground text-sm'>
                  Tidak ada pesanan yang memenuhi syarat untuk dikembalikan saat ini.
                </p>
              </div>
            )
            : (
              orderList.map((order: any) => (
                <Card
                  key={order.orderId}
                  className='p-4 bg-[#0f1115] border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-start'
                >
                  <div className='flex-1 space-y-3'>
                    <div>
                      <h4 className='font-medium text-white'>Pesanan #{order.orderNumber}</h4>
                      <p className='text-xs text-muted-foreground mt-1'>
                        Diterima: {new Date(order.purchasedAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {order.items.map((item: any) => (
                        <div
                          key={item.orderItemId}
                          className='flex items-center gap-2 bg-white/5 p-2 rounded-md border border-white/5'
                        >
                          <div className='w-8 h-8 bg-black/50 rounded flex items-center justify-center shrink-0 overflow-hidden'>
                            {item.primaryImage
                              ? (
                                <img
                                  src={getMediaUrl(item.primaryImage) || ''}
                                  alt={item.productName}
                                  className='w-full h-full object-cover'
                                />
                              )
                              : <ImageIcon className='w-4 h-4 text-muted-foreground' />}
                          </div>
                          <div>
                            <p className='text-xs font-medium text-white line-clamp-1'>
                              {item.productName}
                            </p>
                            <p className='text-[10px] text-muted-foreground'>
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => setCreatingReturnFor(order)}>Ajukan Komplain</Button>
                </Card>
              ))
            )}
        </div>
      )}

      {activeTab === 'mine' && (
        <div className='space-y-4'>
          {isLoadingReturns
            ? (
              <div className='animate-pulse bg-white/5 border border-white/10 h-32 rounded-xl'>
              </div>
            )
            : myReturns?.length === 0
            ? (
              <div className='text-center py-20 bg-white/5 rounded-xl border border-white/10'>
                <RotateCcw className='w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50' />
                <h3 className='text-lg font-medium text-white mb-2'>Belum Ada Riwayat</h3>
                <p className='text-muted-foreground text-sm'>
                  Anda belum pernah mengajukan pengembalian.
                </p>
              </div>
            )
            : (
              myReturns?.map((ret: any) => (
                <Card key={ret.id} className='p-4 bg-[#0f1115] border-white/10 space-y-4'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='px-2 py-1 bg-white/10 rounded text-xs font-medium uppercase'>
                          {ret.status}
                        </span>
                        <span className='px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium uppercase'>
                          {ret.resolution.replace('_', ' ')}
                        </span>
                      </div>
                      <p className='text-sm text-gray-300 mt-2'>
                        Alasan: {ret.reason || 'Tidak ada alasan'}
                      </p>
                      <p className='text-xs text-muted-foreground mt-2'>
                        Diajukan: {new Date(ret.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <Button variant='outline' size='sm' onClick={() => {}}>Detail</Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
        </div>
      )}

      {creatingReturnFor && (
        <ReturnForm
          order={creatingReturnFor}
          onClose={() => setCreatingReturnFor(null)}
          onSuccess={() => {
            mutateEligible();
            mutateReturns();
            setCreatingReturnFor(null);
            setActiveTab('mine');
          }}
        />
      )}
    </div>
  );
};
