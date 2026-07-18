import { useEffect, useState } from 'react';
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
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    if (!product.images || product.images.length <= 1) return;

    // Randomize the interval between 3.5s and 5.5s so products don't slide in perfect sync
    const randomInterval = 3500 + Math.random() * 2000;

    const interval = setInterval(() => {
      setCurrentImgIdx((prev) => {
        if (prev >= product.images!.length - 1) {
          setDirection(-1);
          return prev - 1;
        }
        if (prev <= 0) {
          setDirection(1);
          return prev + 1;
        }
        return prev + direction;
      });
    }, randomInterval);

    return () => clearInterval(interval);
  }, [product.images, direction]);

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
    <div className='flex flex-col bg-card/80 backdrop-blur-md rounded-2xl border border-border/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group relative'>
      {/* ── Top badge — priority: Habis > Diskon > Baru ── */}
      <div className='absolute top-2 left-2 z-10'>
        {isOutOfStock
          ? (
            <span className='bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-md shadow-rose-500/20 leading-tight uppercase tracking-wider'>
              Habis
            </span>
          )
          : hasDiscount
          ? (
            <span className='bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-md shadow-indigo-600/20 leading-tight uppercase tracking-wider'>
              -{discountPct}%
            </span>
          )
          : product.netSold === 0
          ? (
            <span className='bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-md shadow-emerald-500/20 leading-tight uppercase tracking-wider'>
              Baru
            </span>
          )
          : null}
      </div>

      {/* Wishlist */}
      <WishlistButton
        productId={product.id}
        className='absolute top-2 right-2 z-10 hover:scale-110'
        iconClassName='w-5 h-5'
      />

      {/* Image Slider */}
      <div className='aspect-square relative overflow-hidden group/slider flex flex-col'>
        {product.images && product.images.length > 0
          ? (
            <div
              className='w-full h-full flex transition-transform duration-700 ease-in-out'
              style={{ transform: `translateX(-${currentImgIdx * 100}%)` }}
            >
              {product.images.map((img, idx) => (
                <a
                  key={idx}
                  href={`/products/${product.slug}`}
                  className='w-full h-full flex-shrink-0 relative block'
                >
                  <img
                    src={img}
                    alt={`Gambar produk ${product.name} ${idx + 1}`}
                    className={`block object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 ${
                      isOutOfStock ? 'opacity-50 grayscale' : ''
                    }`}
                    loading='eager'
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
                </a>
              ))}
            </div>
          )
          : product.primaryImage
          ? (
            <a href={`/products/${product.slug}`} className='block w-full h-full relative'>
              <img
                src={product.primaryImage}
                alt={`Gambar produk ${product.name}`}
                className={`block object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 ${
                  isOutOfStock ? 'opacity-50 grayscale' : ''
                }`}
                loading='eager'
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className='absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
            </a>
          )
          : (
            <a href={`/products/${product.slug}`} className='block w-full h-full relative'>
              <div className='flex items-center justify-center w-full h-full text-muted-foreground/50 text-[11px] select-none font-bold'>
                No Image
              </div>
            </a>
          )}

        {/* Simple dots indicator */}
        {product.images && product.images.length > 1 && (
          <div className='absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none'>
            {product.images.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-300 ${
                  i === currentImgIdx
                    ? 'bg-indigo-600 w-3'
                    : 'bg-background/80 border border-border/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className='flex flex-col flex-grow px-3 pt-3 pb-3 gap-1'>
        {/* Brand or Category */}
        <span className='text-[10px] font-black text-muted-foreground/80 truncate uppercase tracking-widest'>
          {product.brandName || product.categoryName || 'Unbranded'}
        </span>

        {/* Name */}
        <a href={`/products/${product.slug}`}>
          <p className='text-xs font-bold text-foreground line-clamp-2 leading-snug min-h-[2.4rem] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
            {product.name}
          </p>
        </a>

        {/* Price + strikethrough */}
        <div className='mt-1'>
          <div className='flex items-baseline gap-1.5 flex-wrap'>
            <span
              className={`text-sm font-black ${
                isOutOfStock ? 'text-muted-foreground/50' : 'text-foreground'
              }`}
            >
              {formatIDR(minPrice)}
              {maxPrice && maxPrice > minPrice && (
                <span className='text-[10px] font-bold text-muted-foreground/50 ml-1'>
                  ~
                </span>
              )}
            </span>
            {/* Strikethrough compare price — always visible when set */}
            {hasDiscount && (
              <span className='text-[10px] font-semibold text-muted-foreground/60 line-through'>
                {formatIDR(maxComparePrice!)}
              </span>
            )}
          </div>
        </div>

        {/* Rating · Sold */}
        <div className='flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5'>
          {product.averageRating > 0
            ? (
              <span className='flex items-center gap-0.5 text-amber-500'>
                <Star className='w-3 h-3 fill-current' />
                <span className='text-foreground font-bold'>
                  {product.averageRating.toFixed(1)}
                </span>
              </span>
            )
            : (
              <span className='text-[10px] font-semibold text-muted-foreground/60'>
                Belum ada ulasan
              </span>
            )}
          {product.netSold > 0 && (
            <>
              <span className='text-border'>·</span>
              <span className='font-semibold'>{formatIndonesianSold(product.netSold)} terjual</span>
            </>
          )}
        </div>

        {/* ── Action buttons ── */}
        <div className='flex gap-1.5 mt-2.5 w-full'>
          <button
            type='button'
            onClick={handleBuyNow}
            disabled={isOutOfStock || isLoading}
            className='w-1/3 shrink-0 text-[11px] font-bold py-1.5 rounded-lg border-2 border-border text-foreground hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 dark:hover:border-indigo-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center bg-card shadow-sm'
          >
            {isLoading ? <Loader2 className='w-3.5 h-3.5 animate-spin mx-auto' /> : 'Beli'}
          </button>
          <button
            type='button'
            onClick={handleAddToCart}
            disabled={isOutOfStock || isLoading}
            className={`flex-1 min-w-0 px-2 text-[11px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
              cartSuccess
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 active:scale-95'
            }`}
          >
            {isLoading
              ? <Loader2 className='w-3.5 h-3.5 animate-spin shrink-0' />
              : cartSuccess
              ? <CheckCircle className='w-3.5 h-3.5 shrink-0' />
              : <ShoppingCart className='w-3.5 h-3.5 shrink-0' />}
            {!isLoading && !cartSuccess && <span className='truncate'>Keranjang</span>}
          </button>
        </div>
      </div>
    </div>
  );
};
