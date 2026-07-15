import { useState } from 'react';
import type { ProductListItem } from '@starsuperscare/contracts';
import { formatIDR, formatIndonesianSold } from '@starsuperscare/ui';
import { CheckCircle, Loader2, ShoppingCart, Star } from 'lucide-react';
import { WishlistButton } from '../../wishlist/components/WishlistButton.tsx';

export interface ProductCardProps {
  product: ProductListItem;
  onAddToCart?: (product: ProductListItem) => void;
  onBuyNow?: (product: ProductListItem) => void;
  isLoading?: boolean;
}

export const ProductCard = (
  { product, onAddToCart, onBuyNow, isLoading = false }: ProductCardProps,
): JSX.Element => {
  const [cartSuccess, setCartSuccess] = useState(false);
  const isOutOfStock = product.variantsSummary.totalAvailableStock <= 0;

  const { minPrice, maxPrice, maxComparePrice } = product.variantsSummary;

  const hasDiscount = maxComparePrice != null && maxComparePrice > minPrice;
  const discountPct = hasDiscount ? Math.round((1 - minPrice / maxComparePrice!) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock || isLoading) return;
    onAddToCart?.(product);
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock || isLoading) return;
    onBuyNow?.(product);
  };

  return (
    <div className='flex flex-col bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group relative'>
      {/* ── Top badge — priority: Habis > Diskon > Baru ── */}
      <div className='absolute top-1.5 left-1.5 z-10'>
        {isOutOfStock
          ? (
            <span className='bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm leading-tight'>
              Habis
            </span>
          )
          : hasDiscount
          ? (
            <span className='bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm leading-tight'>
              -{discountPct}%
            </span>
          )
          : product.netSold === 0
          ? (
            <span className='bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm leading-tight'>
              Baru
            </span>
          )
          : null}
      </div>

      {/* Wishlist */}
      <WishlistButton
        productId={product.id}
        className='absolute top-1.5 right-1.5 z-10 bg-white/80 backdrop-blur-sm shadow-sm w-6 h-6 p-0.5 rounded-full'
        iconClassName='w-3.5 h-3.5'
      />

      {/* Image */}
      <a href={`/products/${product.slug}`} className='block'>
        <div className='aspect-square relative bg-gray-50 overflow-hidden'>
          {product.primaryImage
            ? (
              <img
                src={product.primaryImage}
                alt={`Gambar produk ${product.name}`}
                className={`object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 ${
                  isOutOfStock ? 'opacity-50 grayscale' : ''
                }`}
                loading='lazy'
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )
            : (
              <div className='flex items-center justify-center w-full h-full text-gray-300 text-[11px] select-none'>
                No Image
              </div>
            )}
        </div>
      </a>

      {/* ── Content ── */}
      <div className='flex flex-col flex-grow px-2 pt-2 pb-2 gap-0.5'>
        {/* Brand */}
        <span className='text-[10px] text-gray-400 truncate'>
          {product.brandId ? 'Brand' : 'Unbranded'}
        </span>

        {/* Name */}
        <a href={`/products/${product.slug}`}>
          <p className='text-[11px] font-medium text-gray-800 line-clamp-2 leading-tight min-h-[2.2rem] group-hover:text-blue-600 transition-colors'>
            {product.name}
          </p>
        </a>

        {/* Price + strikethrough */}
        <div className='mt-0.5'>
          <div className='flex items-baseline gap-1 flex-wrap'>
            <span
              className={`text-sm font-bold ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}
            >
              {formatIDR(minPrice)}
              {maxPrice && maxPrice > minPrice && (
                <span className='text-[10px] font-normal text-gray-400 ml-0.5'>
                  ~
                </span>
              )}
            </span>
            {/* Strikethrough compare price — always visible when set */}
            {hasDiscount && (
              <span className='text-[10px] text-gray-400 line-through'>
                {formatIDR(maxComparePrice!)}
              </span>
            )}
          </div>
        </div>

        {/* Rating · Sold */}
        <div className='flex items-center gap-1 text-[10px] text-gray-400 mt-0.5'>
          {product.averageRating > 0
            ? (
              <span className='flex items-center gap-0.5 text-yellow-500'>
                <Star className='w-2.5 h-2.5 fill-current' />
                <span className='text-gray-600 font-medium'>
                  {product.averageRating.toFixed(1)}
                </span>
              </span>
            )
            : <span className='text-[10px] text-gray-400'>Belum ada rating</span>}
          {product.netSold > 0 && (
            <>
              <span className='text-gray-300'>·</span>
              <span>{formatIndonesianSold(product.netSold)} terjual</span>
            </>
          )}
        </div>

        {/* ── Action buttons ── */}
        <div className='flex gap-1 mt-1.5'>
          <button
            type='button'
            onClick={handleBuyNow}
            disabled={isOutOfStock || isLoading}
            className='flex-1 text-[11px] font-medium py-1 rounded border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
          >
            {isLoading ? <Loader2 className='w-3 h-3 animate-spin mx-auto' /> : 'Beli'}
          </button>
          <button
            type='button'
            onClick={handleAddToCart}
            disabled={isOutOfStock || isLoading}
            className={`flex-1 text-[11px] font-semibold py-1 rounded flex items-center justify-center gap-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
              cartSuccess ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading
              ? <Loader2 className='w-3 h-3 animate-spin' />
              : cartSuccess
              ? <CheckCircle className='w-3 h-3' />
              : (
                <>
                  <ShoppingCart className='w-3 h-3' />
                  <span>Keranjang</span>
                </>
              )}
          </button>
        </div>
      </div>
    </div>
  );
};
