import { useCart } from '../api/useCart.ts';
import { CartItemCard } from '../components/CartItemCard.tsx';
import { CartSummary } from '../components/CartSummary.tsx';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductCarousel } from '../../catalog/components/ProductCarousel.tsx';

export function CartPage() {
  const { cart, isLoading, isError, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900'>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='py-24 text-center'>
        <h2 className='text-xl font-bold text-red-600'>Gagal memuat keranjang</h2>
        <p className='mt-2 text-gray-500'>Silakan coba lagi nanti atau muat ulang halaman.</p>
        <button
          type='button'
          onClick={() => globalThis.location?.reload()}
          className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500'
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  const items = cart?.items || [];
  const activeItems = items.filter((i: any) => !i.saveForLater);
  const savedItems = items.filter((i: any) => i.saveForLater);
  const isEmpty = activeItems.length === 0;

  return (
    <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
      <h1 className='text-3xl font-bold tracking-tight text-gray-900 mb-10'>Keranjang Belanja</h1>

      <div className='flex flex-col lg:flex-row gap-12 items-start'>
        <div className='flex-1 w-full flex flex-col gap-8'>
          {items.length === 0
            ? (
              <div className='flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg'>
                <ShoppingCart className='w-16 h-16 text-gray-400 mb-4' />
                <p className='text-lg text-gray-600 font-medium'>Keranjang masih kosong</p>
                <p className='text-sm text-gray-500 mb-6'>
                  Yuk, mulai penuhi dengan barang impianmu!
                </p>
                <a
                  href='/products'
                  className='px-6 py-3 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-800'
                >
                  Mulai Belanja
                </a>
              </div>
            )
            : (
              <>
                {activeItems.length > 0 && (
                  <div>
                    <div className='flex justify-between items-center border-b border-gray-200 pb-4 mb-4'>
                      <h2 className='text-xl font-semibold text-gray-900'>
                        Barang untuk Dibeli ({activeItems.length})
                      </h2>
                      <button
                        type='button'
                        onClick={clearCart}
                        className='text-sm font-medium text-red-600 hover:text-red-500'
                      >
                        Kosongkan Keranjang
                      </button>
                    </div>
                    <div className='flex flex-col divide-y divide-gray-200'>
                      {activeItems.map((item: any) => (
                        <CartItemCard
                          key={item.id}
                          item={item}
                          onUpdate={updateItem}
                          onRemove={removeItem}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {savedItems.length > 0 && (
                  <div className='mt-8'>
                    <h2 className='text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-4'>
                      Disimpan untuk Nanti ({savedItems.length})
                    </h2>
                    <div className='flex flex-col divide-y divide-gray-200 opacity-80'>
                      {savedItems.map((item: any) => (
                        <CartItemCard
                          key={item.id}
                          item={item}
                          onUpdate={updateItem}
                          onRemove={removeItem}
                        />
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

      <div className='mt-16 pt-8 border-t border-gray-200'>
        <ProductCarousel title='Mungkin Anda Suka' limit={10} type='smart_recommendation' />
      </div>
    </div>
  );
}
