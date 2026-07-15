import type { ProductListItem } from '@starsuperscare/contracts';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  formatIDR,
  formatIndonesianSold,
  H4,
  Small,
  Text,
} from '@starsuperscare/ui';
import { ShoppingCart, Star } from 'lucide-react';
import { WishlistButton } from '../../wishlist/components/WishlistButton.tsx';

export interface ProductCardProps {
  product: ProductListItem;
  onAddToCart?: (product: ProductListItem) => void;
  onBuyNow?: (product: ProductListItem) => void;
}
export const ProductCard = (
  { product, onAddToCart, onBuyNow }: ProductCardProps,
): JSX.Element => {
  const isOutOfStock = product.variantsSummary.totalAvailableStock <= 0;

  // Format price
  const { minPrice, maxPrice } = product.variantsSummary;
  let priceDisplay = formatIDR(minPrice);
  if (maxPrice && maxPrice > minPrice) {
    priceDisplay = `${formatIDR(minPrice)} - ${formatIDR(maxPrice)}`;
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    onAddToCart?.(product);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    onBuyNow?.(product);
  };

  return (
    <Card className='flex flex-col h-full overflow-hidden transition-all hover:shadow-lg group relative'>
      {/* Badges */}
      <div className='absolute top-2 left-2 flex flex-col gap-1 z-10'>
        {product.netSold === 0 && !isOutOfStock && (
          <Badge className='bg-blue-500 hover:bg-blue-600 border-none font-bold shadow-sm'>
            Baru
          </Badge>
        )}
        {isOutOfStock && (
          <Badge variant='destructive' className='font-bold shadow-sm'>
            Habis
          </Badge>
        )}
      </div>

      <WishlistButton
        productId={product.id}
        className='absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm shadow-sm'
      />

      {/* Image Area */}
      <div className='aspect-square relative bg-gray-100 overflow-hidden'>
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
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a1a3b1a10%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3Avar(--font-sans)%2C%20sans-serif%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a1a3b1a10%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23f3f4f6%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2274%22%20y%3D%22105%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
              }}
            />
          )
          : (
            <div className='flex items-center justify-center w-full h-full text-gray-400 text-sm'>
              No Image
            </div>
          )}
      </div>

      <CardContent className='flex flex-col flex-grow p-4 gap-2'>
        <Small className='text-gray-500 line-clamp-1 h-5'>
          {product.brandId ? 'Brand' : 'Unbranded'}
        </Small>

        <Text className='font-medium line-clamp-2 leading-tight h-10 group-hover:text-blue-600 transition-colors'>
          {product.name}
        </Text>

        <div className='mt-auto pt-2'>
          <H4
            className={`font-bold ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}
          >
            {priceDisplay}
          </H4>

          <div className='flex items-center gap-2 mt-2 text-xs text-gray-500'>
            <div className='flex items-center text-yellow-500'>
              <Star className='w-3.5 h-3.5 fill-current mr-1' />
              <span className='font-medium'>
                {product.averageRating > 0 ? product.averageRating.toFixed(1) : '-'}
              </span>
            </div>
            {product.reviewCount > 0 && <span>({product.reviewCount})</span>}
            <span className='w-1 h-1 rounded-full bg-gray-300'></span>
            <span>{formatIndonesianSold(product.netSold)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className='p-4 pt-0 gap-2'>
        <Button
          variant='outline'
          className='flex-1 w-full'
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          aria-label={isOutOfStock ? 'Stok habis' : 'Beli Langsung'}
        >
          Beli
        </Button>
        <Button
          variant='default'
          className='flex-1 w-full flex items-center justify-center gap-2'
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-label={isOutOfStock ? 'Stok habis' : 'Tambah ke Keranjang'}
        >
          <ShoppingCart className='w-4 h-4' />
          <span className='sr-only sm:not-sr-only'>Keranjang</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
