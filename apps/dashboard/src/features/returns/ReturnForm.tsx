import React, { useState } from 'react';
import { client } from '../../lib/api.ts';
import { Button, toast } from '@starsuperscare/ui';

export const ReturnForm = ({
  order,
  onClose,
  onSuccess,
}: {
  order: any;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [resolution, setResolution] = useState('refund');
  const [reason, setReason] = useState('');
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { quantity: number; reason: string }>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleItem = (itemId: string, maxQty: number) => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      if (next[itemId]) {
        delete next[itemId];
      } else {
        next[itemId] = { quantity: maxQty, reason: '' };
      }
      return next;
    });
  };

  const updateItem = (itemId: string, field: 'quantity' | 'reason', value: any) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemsToReturn = Object.entries(selectedItems).map(([id, data]) => ({
      orderItemId: id,
      quantity: data.quantity,
      reasonDetail: data.reason || null,
      condition: 'opened',
    }));

    if (itemsToReturn.length === 0) {
      toast.error('Pilih setidaknya satu produk untuk dikembalikan');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await (client.v1 as any).returns.$post({
        json: {
          orderId: order.orderId,
          resolution,
          reason: reason || null,
          items: itemsToReturn,
        },
      });

      if (res.ok) {
        toast.success('Pengajuan pengembalian berhasil');
        onSuccess();
      } else {
        toast.error('Gagal mengajukan pengembalian');
      }
    } catch (_err) {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto'>
      <div className='bg-[#0f1115] border border-white/10 rounded-xl p-6 w-full max-w-2xl my-8'>
        <h3 className='text-lg font-bold text-white mb-2'>
          Ajukan Pengembalian (Pesanan #{order.orderNumber})
        </h3>
        <p className='text-sm text-muted-foreground/80 mb-6'>
          Pilih produk yang ingin Anda kembalikan beserta alasannya.
        </p>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4 max-h-[40vh] overflow-y-auto pr-2'>
            {order.items.map((item: any) => {
              const isSelected = !!selectedItems[item.orderItemId];
              return (
                <div
                  key={item.orderItemId}
                  className={`border rounded-lg p-4 transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-white/10 bg-card/5'
                  }`}
                >
                  <label className='flex items-start gap-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      className='mt-1'
                      checked={isSelected}
                      onChange={() => toggleItem(item.orderItemId, item.quantity)}
                    />
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-white'>{item.productName}</p>
                      <p className='text-xs text-muted-foreground/80'>
                        SKU: {item.variantSku} • Max Qty: {item.quantity}
                      </p>
                    </div>
                  </label>

                  {isSelected && (
                    <div className='mt-4 pl-7 space-y-3'>
                      <div>
                        <label className='text-xs text-muted-foreground/80 block mb-1'>
                          Kuantitas Dikembalikan
                        </label>
                        <input
                          type='number'
                          min={1}
                          max={item.quantity}
                          value={selectedItems[item.orderItemId].quantity}
                          onChange={(e) =>
                            updateItem(item.orderItemId, 'quantity', parseInt(e.target.value) || 1)}
                          className='w-full sm:w-32 rounded border border-white/20 bg-black/50 px-2 py-1 text-sm text-white'
                        />
                      </div>
                      <div>
                        <label className='text-xs text-muted-foreground/80 block mb-1'>
                          Alasan Detail (Opsional)
                        </label>
                        <input
                          type='text'
                          value={selectedItems[item.orderItemId].reason}
                          onChange={(e) => updateItem(item.orderItemId, 'reason', e.target.value)}
                          placeholder='Barang cacat/tidak sesuai...'
                          className='w-full rounded border border-white/20 bg-black/50 px-2 py-1 text-sm text-white'
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-white'>Resolusi yang Diinginkan</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className='w-full rounded border border-white/20 bg-black/50 px-3 py-2 text-sm text-white'
            >
              <option value='refund'>Pengembalian Dana (Refund)</option>
              <option value='exchange'>Tukar Barang (Exchange)</option>
              <option value='store_credit'>Saldo Toko (Store Credit)</option>
            </select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-white'>Alasan Umum (Opsional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder='Tambahkan informasi tambahan bila perlu...'
              className='w-full rounded border border-white/20 bg-black/50 px-3 py-2 text-sm text-white'
              rows={3}
            />
          </div>

          <div className='flex justify-end gap-3 pt-4 border-t border-white/10'>
            <Button variant='ghost' type='button' onClick={onClose}>Batal</Button>
            <Button
              type='submit'
              disabled={isSubmitting || Object.keys(selectedItems).length === 0}
            >
              {isSubmitting ? 'Memproses...' : 'Kirim Pengajuan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
