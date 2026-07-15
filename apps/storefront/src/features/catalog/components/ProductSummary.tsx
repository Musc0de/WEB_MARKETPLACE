import { useState } from 'react';
import type { ProductDetail, ProductVariant } from '@starsuperscare/contracts';
import { Badge, Button, formatIndonesianSold, H1, H3, Text } from '@starsuperscare/ui';
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
  const comparePrice = selectedVariant?.comparePrice || null;
  const stock = selectedVariant?.availableStock || 0;

  const isOutOfStock = stock <= 0;

  const handleQuantityChange = (amount: number) => {
    let newQty = quantity + amount;
    if (newQty < 1) newQty = 1;

    // Clamp to available stock or purchase limit
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
      // Reset checkmark after 2 seconds
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
      // Direct buy: create a fresh isolated cart with ONLY this product
      // so checkout shows only this item, not the user's entire cart
      const directToken = await createDirectBuyCart(selectedVariantId, quantity);
      navigate(`/checkout?directToken=${encodeURIComponent(directToken)}`);
    } catch (_err) {
      toast.error('Gagal memproses pembelian');
      setAddingToCart(false);
    }
  };

  return (
    <div className='flex flex-col'>
      <div className='flex items-center gap-2 mb-2 text-gray-500'>
        <Text className='font-medium text-blue-600 hover:underline cursor-pointer'>
          {product.brand?.name || 'Unbranded'}
        </Text>
        <span>•</span>
        <span className='flex items-center gap-1 text-sm text-yellow-500'>
          <Star className='w-4 h-4 fill-current' />
          <span className='text-gray-700'>{product.averageRating.toFixed(1)}</span>
          <span className='text-gray-400'>({product.reviewCount})</span>
        </span>
        <span>•</span>
        <Text className='text-sm'>{formatIndonesianSold(product.netSold)}</Text>
      </div>

      <H1 className='text-2xl md:text-3xl font-bold mb-4 text-gray-900'>{product.name}</H1>

      <div className='bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100 flex flex-col gap-1'>
        <div className='flex items-end gap-3'>
          <H3 className='text-3xl font-bold text-blue-700'>
            Rp {price.toLocaleString('id-ID')}
          </H3>
          {comparePrice && comparePrice > price && (
            <Text className='text-lg line-through text-gray-400 mb-1'>
              Rp {comparePrice.toLocaleString('id-ID')}
            </Text>
          )}
        </div>
        {comparePrice && comparePrice > price && (
          <Badge className='w-max bg-red-100 text-red-600 hover:bg-red-100'>
            Hemat Rp {(comparePrice - price).toLocaleString('id-ID')}
          </Badge>
        )}
      </div>

      {/* Variants Selector */}
      {product.variants.length > 1 && (
        <div className='mb-6'>
          <Text className='font-bold mb-3 text-gray-800'>Pilih Varian:</Text>
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
                className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                  selectedVariantId === v.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : v.availableStock <= 0
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
                }`}
              >
                {v.sku}
                {v.size ? ` - ${v.size}` : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Actions */}
      <div className='flex flex-col gap-4 py-6 border-t border-b border-gray-100 mb-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Text className='font-bold text-gray-800'>Atur Jumlah:</Text>
            <div className='flex items-center border border-gray-300 rounded-md'>
              <button
                type='button'
                onClick={() => handleQuantityChange(-1)}
                disabled={isOutOfStock || quantity <= 1}
                className='px-3 py-1 text-xl text-gray-600 disabled:text-gray-300 hover:bg-gray-100 rounded-l-md'
              >
                -
              </button>
              <span className='w-12 text-center font-medium'>{quantity}</span>
              <button
                type='button'
                onClick={() => handleQuantityChange(1)}
                disabled={isOutOfStock || quantity >= stock ||
                  (product.purchaseLimit > 0 && quantity >= product.purchaseLimit)}
                className='px-3 py-1 text-xl text-gray-600 disabled:text-gray-300 hover:bg-gray-100 rounded-r-md'
              >
                +
              </button>
            </div>
          </div>
          <Text className='text-sm text-gray-500'>
            Sisa stok: <span className='font-bold text-gray-900'>{stock}</span>
          </Text>
        </div>

        <div className='flex gap-3 mt-4'>
          <Button
            variant='outline'
            size='lg'
            className={`flex-1 flex items-center justify-center gap-2 transition-all ${
              addedToCart
                ? 'border-green-500 text-green-600 bg-green-50 hover:bg-green-50'
                : 'border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
            onClick={handleAddToCart}
            disabled={isOutOfStock || addingToCart}
          >
            {addingToCart
              ? <Loader2 className='w-5 h-5 animate-spin' />
              : addedToCart
              ? <Check className='w-5 h-5' />
              : <ShoppingCart className='w-5 h-5' />}
            {addedToCart ? 'Ditambahkan!' : '+ Keranjang'}
          </Button>
          <Button
            size='lg'
            className='flex-1 bg-blue-600 hover:bg-blue-700 text-white'
            onClick={handleBuyNow}
            disabled={isOutOfStock || addingToCart}
          >
            {addingToCart ? <Loader2 className='w-5 h-5 animate-spin' /> : 'Beli Langsung'}
          </Button>
          <WishlistButton
            productId={product.id}
            className='p-3 w-[46px] h-[46px] border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center'
            iconClassName='w-6 h-6'
          />
        </div>
      </div>

      <div className='flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-md border border-green-100'>
        <ShieldCheck className='w-5 h-5 text-green-600' />
        <span>Jaminan aman berbelanja di StarSuperScare. 100% Ori.</span>
      </div>
    </div>
  );
};
