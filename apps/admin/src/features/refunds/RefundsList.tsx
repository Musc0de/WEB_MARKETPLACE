import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/rpc.ts';
import { Button, Card, toast } from '@starsuperscare/ui';
import { CreditCard, Search } from 'lucide-react';

export const RefundsList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: refunds, mutate, isLoading } = useSWR(
    '/api/v1/admin/refunds',
    async () => {
      const res = await (client.v1 as any).admin.refunds.$get();
      const json = await res.json();
      return json.data || [];
    },
  );

  const handleProcessRefund = async (refundId: string) => {
    try {
      const amountStr = prompt(
        'Masukkan nominal final untuk diproses (kosongkan untuk default):',
        '',
      );
      const restockStr = confirm('Apakah Anda ingin mengembalikan stok produk (restock)?');

      const payload: any = { restockItems: restockStr };
      if (amountStr && !isNaN(parseFloat(amountStr))) {
        payload.amount = parseFloat(amountStr);
      }

      const res = await (client.v1 as any).admin.refunds[':id'].process.$post({
        param: { id: refundId },
        json: payload,
      });

      if (res.ok) {
        toast.success('Refund processed successfully');
        mutate();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to process refund');
      }
    } catch (_e) {
      toast.error('Network error');
    }
  };

  const filteredRefunds = refunds?.filter((r: any) =>
    r.id.includes(searchTerm) || r.orderId.includes(searchTerm)
  );

  return (
    <div className='p-6 max-w-6xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-white'>Refunds</h1>
          <p className='text-muted-foreground'>Manage and process customer refunds.</p>
        </div>
      </div>

      <div className='flex items-center gap-4 bg-[#0f1115] p-4 rounded-xl border border-white/10'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
          <input
            type='text'
            placeholder='Search refunds by ID or Order ID...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>
      </div>

      <div className='grid gap-4'>
        {isLoading
          ? <div className='animate-pulse h-32 bg-white/5 rounded-xl border border-white/10' />
          : filteredRefunds?.length === 0
          ? (
            <div className='text-center py-12 bg-white/5 rounded-xl border border-white/10'>
              <CreditCard className='w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50' />
              <h3 className='text-lg font-medium text-white mb-1'>No refunds found</h3>
            </div>
          )
          : (
            filteredRefunds?.map((refund: any) => (
              <Card
                key={refund.id}
                className='p-5 bg-[#0f1115] border-white/10 flex flex-col md:flex-row justify-between gap-4'
              >
                <div className='space-y-2'>
                  <div className='flex items-center gap-3'>
                    <span className='font-mono text-sm text-primary'>{refund.id.slice(0, 8)}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium uppercase
                    ${
                        refund.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : refund.status === 'processing'
                          ? 'bg-blue-500/20 text-blue-500'
                          : refund.status === 'completed'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {refund.status}
                    </span>
                  </div>
                  <p className='text-sm text-gray-400'>Order ID: {refund.orderId}</p>
                  {refund.returnId && (
                    <p className='text-sm text-gray-400'>Return ID: {refund.returnId}</p>
                  )}
                  <p className='text-sm font-medium text-white mt-2'>
                    Amount: Rp {refund.amount?.toLocaleString('id-ID')}
                  </p>
                  {refund.providerReference && (
                    <p className='text-xs text-muted-foreground'>Ref: {refund.providerReference}</p>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Created: {new Date(refund.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className='flex items-center'>
                  {refund.status === 'pending' && (
                    <Button onClick={() => handleProcessRefund(refund.id)}>Process Refund</Button>
                  )}
                </div>
              </Card>
            ))
          )}
      </div>
    </div>
  );
};
