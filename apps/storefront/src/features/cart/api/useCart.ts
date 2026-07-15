import useSWR from 'swr';
import { client } from '../../../lib/api.ts';
import type { CartItem, UpdateCartItemRequest } from '@starsuperscare/contracts';

const fetcher = async () => {
  const res = await client.v1.cart.$get();
  if (!res.ok) {
    throw new Error('Failed to fetch cart');
  }
  const data = await res.json();

  if (data.data && typeof data.data === 'object' && 'guestToken' in data.data) {
    localStorage.setItem('guestToken', (data.data as any).guestToken);
  }
  return data.data;
};

export function useCart() {
  const { data, error, isLoading, mutate } = useSWR('/api/v1/cart', fetcher);

  const addItem = async (variantId: string, quantity: number) => {
    const res = await client.v1.cart.items.$post({
      json: { variantId, quantity },
    });
    if (!res.ok) throw new Error('Gagal menambah item ke keranjang');
    const result = await res.json();
    if (result.data?.guestToken) {
      localStorage.setItem('guestToken', result.data.guestToken);
    }
    await mutate();
    return result;
  };

  const updateItem = async (itemId: string, updates: UpdateCartItemRequest) => {
    // Optimistic update
    if (data) {
      const newItems = data.items.map((item: CartItem) =>
        item.id === itemId ? { ...item, ...updates } as CartItem : item
      );
      mutate({ ...data, items: newItems as any }, false);
    }

    const res = await client.v1.cart.items[':id'].$patch({
      param: { id: itemId },
      json: updates,
    });

    if (!res.ok) {
      // Revert on failure
      await mutate();
      throw new Error('Gagal memperbarui item');
    }
    await mutate();
  };

  const removeItem = async (itemId: string) => {
    if (data) {
      const newItems = data.items.filter((item: CartItem) => item.id !== itemId);
      mutate({ ...data, items: newItems as any }, false);
    }

    const res = await client.v1.cart.items[':id'].$delete({
      param: { id: itemId },
    });

    if (!res.ok) {
      await mutate();
      throw new Error('Gagal menghapus item');
    }
    await mutate();
  };

  const clearCart = async () => {
    if (data) {
      mutate({ ...data, items: [] }, false);
    }

    const res = await client.v1.cart.$delete();
    if (!res.ok) {
      await mutate();
      throw new Error('Gagal mengosongkan keranjang');
    }
    await mutate();
  };

  const applyVoucher = async (code: string) => {
    const res = await client.v1.vouchers.validate.$post({
      json: { code },
    });
    if (!res.ok) {
      const errorData = await res.json() as any;
      throw new Error(errorData.error || 'Voucher tidak valid');
    }
    const result = await res.json();
    return result.data;
  };

  return {
    cart: data,
    isLoading,
    isError: error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    applyVoucher,
    mutate,
  };
}
