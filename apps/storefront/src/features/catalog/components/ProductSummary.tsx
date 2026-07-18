import { useState } from 'react';
import type { ProductDetail, ProductVariant } from '@starsuperscare/contracts';
import { Button, formatIndonesianSold } from '@starsuperscare/ui';
import { toast } from '@starsuperscare/ui';
import { Check, Loader2, ShieldCheck, ShoppingCart, Star } from 'lucide-react';
import { WishlistButton } from '../../wishlist/components/WishlistButton.tsx';
import { useCart } from '../../cart/api/useCart.ts';
import { createDirectBuyCart } from '../../cart/api/createDirectBuyCart.ts';
import { useNavigate } from 'react-router-dom';

export const ProductSummary = ({ product }: { product: ProductDetail }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants.length > 0 ? product.variants[0].id : null,
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const selectedVariant =
    product.variants.find((v: ProductVariant) => v.id === selectedVariantId) || product.variants[0];

  const price = selectedVariant?.price || product.variantsSummary.minPrice;
  const comparePrice = selectedVariant?.comparePrice || product.variantsSummary.maxComparePrice ||
    null;

  const hasDiscount = comparePrice != null && comparePrice > price;
  const discountPct = hasDiscount ? Math.round((1 - price / comparePrice) * 100) : 0;
  const savings = hasDiscount ? comparePrice - price : 0;
  const stock = selectedVariant?.availableStock || 0;

  const isOutOfStock = stock <= 0;

  const handleQuantityChange = (amount: number) => {
    let newQty = quantity + amount;
    if (newQty < 1) newQty = 1;

    const maxQty = product.purchaseLimit > 0 ? Math.min(stock, product.purchaseLimit) : stock;
    if (newQty > maxQty) newQty = maxQty;

    setQuantity(newQty);
  };

  const handleAddToCart = async () => {
    if (!selectedVariantId || addingToCart) return;
    setAddingToCart(true);
    try {
      await addItem(selectedVariantId, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (_err) {
      toast.error('Gagal menambahkan ke keranjang');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariantId || addingToCart) return;
    setAddingToCart(true);
    try {
      const directToken = await createDirectBuyCart(selectedVariantId, quantity);
      navigate(`/checkout?directToken=${encodeURIComponent(directToken)}`);
    } catch (_err) {
      toast.error('Gagal memproses pembelian');
      setAddingToCart(false);
    }
  };

  return (
    <div className='flex flex-col'>
      {/* Brand · Rating · Sold row */}
      <div className='flex items-center flex-wrap gap-x-2 gap-y-1 mb-2'>
        <span className='text-[11px] font-black tracking-widest uppercase text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer'>
          {product.brand?.name || 'Unbranded'}
        </span>
        <span className='text-muted-foreground/30 text-xs'>•</span>
        <span className='flex items-center gap-0.5 text-xs text-amber-500'>
          <Star className='w-3.5 h-3.5 fill-current' />
          <span className='text-foreground font-bold ml-1'>
            {product.reviewCount > 0 ? product.averageRating.toFixed(1) : 'Belum ada rating'}
          </span>
          {product.reviewCount > 0 && (
            <span className='text-muted-foreground font-medium'>
              ({product.reviewCount})
            </span>
          )}
        </span>
        <span className='text-muted-foreground/30 text-xs'>•</span>
        <span className='text-xs font-medium text-muted-foreground'>
          {product.netSold > 0
            ? `${formatIndonesianSold(product.netSold)} terjual`
            : 'Belum ada penjualan'}
        </span>
      </div>

      <h1 className='text-2xl md:text-3xl font-black mb-4 text-foreground leading-tight tracking-tight'>
        {product.name}
      </h1>

      <div className='bg-muted/10 p-4 lg:p-5 rounded-2xl mb-6 border border-border/60 flex flex-col gap-2'>
        <div className='flex items-end gap-3 flex-wrap'>
          <h3 className='text-3xl lg:text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter'>
            Rp {price.toLocaleString('id-ID')}
          </h3>
          {hasDiscount && (
            <div className='flex items-center gap-2 mb-1'>
              <span className='text-sm lg:text-base font-bold line-through text-muted-foreground/60'>
                Rp {comparePrice.toLocaleString('id-ID')}
              </span>
              <span className='bg-rose-500 text-white text-[10px] lg:text-xs font-black px-2 py-0.5 rounded-md shadow-sm shadow-rose-500/20 tracking-wider'>
                -{discountPct}%
              </span>
            </div>
          )}
        </div>
        {hasDiscount && (
          <div className='w-max bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-md border border-emerald-500/20 text-[11px] shadow-sm mt-1'>
            Hemat Rp {savings.toLocaleString('id-ID')}
          </div>
        )}
      </div>

      {/* Variants Selector */}
      {product.variants.length > 1 && (
        <div className='mb-6'>
          <p className='font-bold mb-3 text-foreground text-sm'>Pilih Varian:</p>
          <div className='flex flex-wrap gap-2'>
            {product.variants.map((v: ProductVariant) => (
              <button
                key={v.id}
                type='button'
                onClick={() => {
                  setSelectedVariantId(v.id);
                  setQuantity(1); // Reset qty on variant change
                  setAddedToCart(false);
                }}
                disabled={v.availableStock <= 0}
                className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all active:scale-95 ${
                  selectedVariantId === v.id
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : v.availableStock <= 0
                    ? 'border-border/30 bg-muted/30 text-muted-foreground/40 cursor-not-allowed'
                    : 'border-border/60 bg-card text-foreground hover:border-indigo-400 shadow-sm'
                }`}
              >
                {v.name ? v.name : v.sku}
                {v.size ? ` - ${v.size}` : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Actions */}
      <div className='flex flex-col gap-5 py-6 border-t border-b border-border/60 mb-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <p className='font-bold text-foreground text-sm'>Atur Jumlah:</p>
            <div className='flex items-center border border-border/60 rounded-xl bg-card shadow-sm overflow-hidden'>
              <button
                type='button'
                onClick={() => handleQuantityChange(-1)}
                disabled={isOutOfStock || quantity <= 1}
                className='px-3.5 py-1.5 text-xl font-medium text-foreground disabled:text-muted-foreground/30 hover:bg-muted active:bg-muted/80 transition-colors'
              >
                -
              </button>
              <span className='w-10 text-center font-bold text-sm'>{quantity}</span>
              <button
                type='button'
                onClick={() => handleQuantityChange(1)}
                disabled={isOutOfStock || quantity >= stock ||
                  (product.purchaseLimit > 0 && quantity >= product.purchaseLimit)}
                className='px-3.5 py-1.5 text-xl font-medium text-foreground disabled:text-muted-foreground/30 hover:bg-muted active:bg-muted/80 transition-colors'
              >
                +
              </button>
            </div>
          </div>
          <p className='text-xs font-medium text-muted-foreground'>
            Sisa stok: <span className='font-black text-foreground'>{stock}</span>
          </p>
        </div>

        <div className='flex gap-2 mt-2'>
          <Button
            variant='outline'
            className={`flex-1 flex flex-row items-center justify-center gap-1.5 transition-all font-bold rounded-xl active:scale-95 shadow-sm border-2 h-12 px-1 sm:px-4 ${
              addedToCart
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                : 'border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10'
            }`}
            onClick={handleAddToCart}
            disabled={isOutOfStock || addingToCart}
          >
            {addingToCart
              ? <Loader2 className='w-4 h-4 sm:w-5 sm:h-5 animate-spin shrink-0' />
              : addedToCart
              ? <Check className='w-4 h-4 sm:w-5 sm:h-5 shrink-0' />
              : <ShoppingCart className='w-4 h-4 sm:w-5 sm:h-5 shrink-0' />}
            <span className='whitespace-nowrap text-xs sm:text-sm'>
              {addedToCart ? 'Berhasil' : '+ Keranjang'}
            </span>
          </Button>
          <Button
            className='flex-1 flex flex-row items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl active:scale-95 shadow-md shadow-indigo-500/20 transition-all h-12 px-1 sm:px-4'
            onClick={handleBuyNow}
            disabled={isOutOfStock || addingToCart}
          >
            {addingToCart
              ? <Loader2 className='w-4 h-4 sm:w-5 sm:h-5 animate-spin shrink-0' />
              : <span className='whitespace-nowrap text-xs sm:text-sm'>Beli Langsung</span>}
          </Button>
          <WishlistButton
            productId={product.id}
            className='w-12 h-12 flex-shrink-0 border-2 border-border/60 rounded-xl hover:bg-muted transition-colors flex items-center justify-center shadow-sm text-foreground active:scale-95'
            iconClassName='w-6 h-6'
          />
        </div>
      </div>

      <div className='flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20'>
        <ShieldCheck className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />
        <span>Jaminan aman berbelanja di StarSuperScare. 100% Ori.</span>
      </div>
    </div>
  );
};
