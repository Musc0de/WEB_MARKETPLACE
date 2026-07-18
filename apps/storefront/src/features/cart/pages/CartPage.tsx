import { useCart } from '../api/useCart.ts';
import { CartItemCard } from '../components/CartItemCard.tsx';
import { CartSummary } from '../components/CartSummary.tsx';
import { Box, RefreshCw, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductCarousel } from '../../catalog/components/ProductCarousel.tsx';
import { Button } from '@starsuperscare/ui';

export function CartPage() {
  const { cart, isLoading, isError, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600 dark:border-indigo-400'>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='py-24 text-center flex flex-col items-center justify-center bg-destructive/10 border border-destructive/20 rounded-3xl p-8 max-w-xl mx-auto mt-16 shadow-sm'>
        <h2 className='text-2xl font-black text-destructive tracking-tight mb-2'>
          Gagal memuat keranjang
        </h2>
        <p className='text-muted-foreground font-medium mb-8'>
          Silakan coba lagi nanti atau muat ulang halaman.
        </p>
        <Button
          onClick={() => globalThis.location?.reload()}
          className='rounded-xl font-bold shadow-sm active:scale-95'
        >
          <RefreshCw className='w-4 h-4 mr-2' />
          Muat Ulang
        </Button>
      </div>
    );
  }

  const items = cart?.items || [];
  const activeItems = items.filter((i: any) => !i.saveForLater);
  const savedItems = items.filter((i: any) => i.saveForLater);
  const isEmpty = activeItems.length === 0;

  return (
    <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 animate-in fade-in duration-500'>
      <div className='flex items-center gap-3 mb-10'>
        <ShoppingCart className='w-8 h-8 text-indigo-600 dark:text-indigo-400' />
        <h1 className='text-3xl font-black tracking-tight text-foreground'>Keranjang Belanja</h1>
      </div>

      <div className='flex flex-col lg:flex-row gap-12 items-start'>
        <div className='flex-1 w-full flex flex-col gap-8'>
          {items.length === 0
            ? (
              <div className='flex flex-col items-center justify-center py-24 bg-card border border-border/60 rounded-3xl shadow-sm'>
                <div className='w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6'>
                  <Box className='w-10 h-10 text-muted-foreground/40' />
                </div>
                <p className='text-xl text-foreground font-black tracking-tight mb-2'>
                  Keranjang masih kosong
                </p>
                <p className='text-sm text-muted-foreground font-medium mb-8'>
                  Yuk, mulai penuhi dengan barang impianmu!
                </p>
                <Button
                  onClick={() => navigate('/products')}
                  className='rounded-xl font-bold px-8 h-12 shadow-md active:scale-95'
                >
                  Mulai Belanja
                </Button>
              </div>
            )
            : (
              <>
                {activeItems.length > 0 && (
                  <div className='bg-card border border-border/60 rounded-3xl shadow-sm overflow-hidden p-5 lg:p-8'>
                    <div className='flex justify-between items-center pb-5 mb-5 border-b border-border/60'>
                      <h2 className='text-lg lg:text-xl font-black text-foreground flex items-center gap-2'>
                        <div className='w-1.5 h-5 bg-indigo-500 rounded-full' />
                        Barang untuk Dibeli ({activeItems.length})
                      </h2>
                      <button
                        type='button'
                        onClick={clearCart}
                        className='text-sm font-bold text-rose-600 hover:text-rose-700 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 active:scale-95'
                      >
                        <Trash2 className='w-4 h-4' />
                        <span className='hidden sm:inline'>Kosongkan Keranjang</span>
                      </button>
                    </div>
                    <div className='flex flex-col divide-y divide-border/60 gap-4'>
                      {activeItems.map((item: any) => (
                        <div key={item.id} className='pt-4 first:pt-0'>
                          <CartItemCard
                            item={item}
                            onUpdate={updateItem}
                            onRemove={removeItem}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {savedItems.length > 0 && (
                  <div className='mt-4 bg-muted/20 border border-border/40 rounded-3xl p-5 lg:p-8 opacity-80 hover:opacity-100 transition-opacity'>
                    <h2 className='text-lg font-black text-muted-foreground pb-5 mb-5 border-b border-border/40 flex items-center gap-2'>
                      Disimpan untuk Nanti ({savedItems.length})
                    </h2>
                    <div className='flex flex-col divide-y divide-border/40 gap-4'>
                      {savedItems.map((item: any) => (
                        <div
                          key={item.id}
                          className='pt-4 first:pt-0 grayscale hover:grayscale-0 transition-all'
                        >
                          <CartItemCard
                            item={item}
                            onUpdate={updateItem}
                            onRemove={removeItem}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
        </div>

        {/* Summary side panel */}
        {cart && cart.summary && (
          <CartSummary
            summary={cart.summary}
            isEmpty={isEmpty}
            onCheckout={(voucherCode) =>
              navigate('/checkout', { state: { appliedVoucherCode: voucherCode } })}
          />
        )}
      </div>

      <div className='mt-20 pt-10 border-t border-border/60'>
        <ProductCarousel title='Mungkin Anda Suka' limit={10} type='smart_recommendation' />
      </div>
    </div>
  );
}
