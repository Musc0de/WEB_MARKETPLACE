import { useState } from 'react';
import type { CartItem } from '@starsuperscare/contracts';
import { formatIDR, toast } from '@starsuperscare/ui';
import { Heart, Trash2 } from 'lucide-react';

interface CartItemCardProps {
  item: CartItem;
  onUpdate: (id: string, updates: any) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export function CartItemCard({ item, onUpdate, onRemove }: CartItemCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1) return;
    if (item.variant?.availableStock && newQty > item.variant.availableStock) {
      toast.error('Stok tidak mencukupi');
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(item.id, { quantity: newQty });
    } catch (e: any) {
      toast.error(e.message || 'Gagal mengubah kuantitas');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleSelect = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(item.id, { selected: !item.selected });
    } catch (e: any) {
      toast.error(e.message || 'Gagal mengubah pilihan');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleSaveForLater = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(item.id, { saveForLater: !item.saveForLater, selected: false });
      toast.success(item.saveForLater ? 'Dipindahkan ke keranjang' : 'Disimpan untuk nanti');
    } catch (e: any) {
      toast.error(e.message || 'Gagal menyimpan item');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await onRemove(item.id);
      toast.success('Item dihapus');
    } catch (e: any) {
      toast.error(e.message || 'Gagal menghapus item');
      setIsUpdating(false); // Only set false if failed, since if success it unmounts
    }
  };

  if (!item.product || !item.variant) return null;

  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 py-6 border-b border-gray-200 ${
        isUpdating ? 'opacity-70 pointer-events-none' : ''
      }`}
    >
      <div className='flex items-start gap-4 flex-1'>
        {!item.saveForLater && (
          <input
            type='checkbox'
            checked={item.selected}
            onChange={handleToggleSelect}
            className='mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
          />
        )}

        <div className='h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200'>
          <img
            src={item.product.primaryImage || ''}
            alt={item.product.name}
            className='h-full w-full object-cover object-center'
          />
        </div>

        <div className='flex flex-1 flex-col'>
          <div>
            <div className='flex justify-between text-base font-medium text-gray-900'>
              <h3>
                <a href={`/products/${item.product.slug}`}>{item.product.name}</a>
              </h3>
              <p className='ml-4'>{formatIDR(item.variant.price)}</p>
            </div>
            <p className='mt-1 text-sm text-gray-500'>SKU: {item.variant.sku}</p>
          </div>

          <div className='flex flex-1 items-end justify-between text-sm mt-4'>
            {!item.saveForLater
              ? (
                <div className='flex items-center border border-gray-300 rounded-md'>
                  <button
                    type='button'
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className='px-3 py-1 hover:bg-gray-100 disabled:opacity-50'
                    aria-label='Kurangi kuantitas'
                  >
                    -
                  </button>
                  <span className='px-3 py-1 border-x border-gray-300'>{item.quantity}</span>
                  <button
                    type='button'
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={item.quantity >= (item.variant?.availableStock || 0)}
                    className='px-3 py-1 hover:bg-gray-100 disabled:opacity-50'
                    aria-label='Tambah kuantitas'
                  >
                    +
                  </button>
                </div>
              )
              : <span className='text-gray-500'>Tersimpan</span>}

            <div className='flex gap-2'>
              <button
                type='button'
                onClick={handleToggleSaveForLater}
                className='font-medium text-blue-600 hover:text-blue-500 flex items-center gap-1'
              >
                <Heart className={`w-4 h-4 ${item.saveForLater ? 'fill-blue-600' : ''}`} />
                <span>{item.saveForLater ? 'Pindah ke Keranjang' : 'Simpan'}</span>
              </button>
              <button
                type='button'
                onClick={handleRemove}
                className='font-medium text-red-600 hover:text-red-500 flex items-center gap-1 ml-4'
              >
                <Trash2 className='w-4 h-4' />
                <span>Hapus</span>
              </button>
            </div>
          </div>

          {item.status === 'price_changed' && (
            <p className='mt-2 text-sm text-amber-600'>
              Harga item ini telah berubah sejak ditambahkan.
            </p>
          )}
          {item.status === 'out_of_stock' && (
            <p className='mt-2 text-sm text-red-600'>Item ini kehabisan stok.</p>
          )}
          {item.status === 'quantity_adjusted' && (
            <p className='mt-2 text-sm text-amber-600'>
              Kuantitas disesuaikan dengan stok tersedia.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
