import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { client } from '../../lib/api.ts';
import { toast } from '@starsuperscare/ui';

interface WishlistState {
  items: Record<string, boolean>; // map of productId to true
  hydrated: boolean;
  toggle: (productId: string) => Promise<void>;
  syncWithServer: () => Promise<void>;
  setHydrated: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: {},
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      toggle: async (productId: string) => {
        const { items } = get();
        const isWished = !!items[productId];

        // Optimistic UI update
        set({
          items: {
            ...items,
            [productId]: !isWished,
          },
        });

        if (isWished) {
          // Remove from server
          try {
            await client.v1.wishlist.remove.$post({ json: { productId } });
          } catch (_e) {
            // Ignore errors (likely not logged in)
          }
        } else {
          // Add to server
          try {
            const res = await client.v1.wishlist.add.$post({ json: { productId } });
            if (!res.ok) {
              toast.info('Disimpan lokal. Login untuk sinkronisasi antar perangkat.');
            }
          } catch (_e) {
            toast.info('Disimpan lokal. Login untuk sinkronisasi antar perangkat.');
          }
        }
      },
      syncWithServer: async () => {
        try {
          const { items } = get();
          const localIds = Object.keys(items).filter((id) => items[id]);

          if (localIds.length > 0) {
            await client.v1.wishlist.merge.$post({ json: { productIds: localIds } });
          }

          const res = await client.v1.wishlist.$get();
          if (res.ok) {
            const data = await res.json();
            if (data.data) {
              const serverItems: Record<string, boolean> = {};
              data.data.forEach((item: any) => {
                serverItems[item.productId] = true;
              });
              set({ items: serverItems });
            }
          }
        } catch (_e) {
          // Ignore, probably not logged in
        }
      },
    }),
    {
      name: 'sss-wishlist-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
        // Fire sync in background
        setTimeout(() => state?.syncWithServer(), 100);
      },
    },
  ),
);
