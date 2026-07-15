import useSWR from 'swr';
import { client } from '../../../lib/api.ts';
import type { CartItem, UpdateCartItemRequest } from '@starsuperscare/contracts';

/**
 * Cart fetcher — reads the X-Cart-Token from localStorage at call time
 * (the client custom fetch in api.ts handles injecting the header).
 */
const fetcher = async () => {
  const res = await client.v1.cart.$get();
  if (!res.ok) {
    throw new Error('Failed to fetch cart');
  }
  const data = await res.json();
  return data.data;
};

export function useCart() {
  const { data, error, isLoading, mutate } = useSWR('/api/v1/cart', fetcher, {
    // Revalidate on focus so the cart badge stays fresh when user returns to tab
    revalidateOnFocus: true,
    // Don't dedupe too aggressively — we want fresh data after addItem
    dedupingInterval: 500,
  });

  /**
   * addItem — adds a variant to the cart.
   * Crucially:
   *  1. We await the POST which may return a new guestToken for first-time guests.
   *  2. We SYNCHRONOUSLY save the token to localStorage BEFORE calling mutate().
   *  3. Only then we call mutate() so the refetch uses the correct token.
   */
  const addItem = async (variantId: string, quantity: number) => {
    const res = await client.v1.cart.items.$post({
      json: { variantId, quantity },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null) as any;
      throw new Error(errData?.error?.message || 'Gagal menambah item ke keranjang');
    }

    const result = await res.json();

    // Save guest token synchronously BEFORE triggering SWR revalidation
    if (result.data?.guestToken) {
      localStorage.setItem('guestToken', result.data.guestToken);
    }

    // Trigger revalidation in background — don't block the caller
    // so the UI can immediately show the success state (checkmark/animation)
    mutate();
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
      await mutate();
      throw new Error('Gagal memperbarui item');
    }
    await mutate();
  };

  const removeItem = async (itemId: string) => {
    // Optimistic update
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
