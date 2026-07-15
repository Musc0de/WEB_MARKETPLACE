import { Heart } from 'lucide-react';
import { useWishlist } from '../useWishlist.ts';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

interface WishlistButtonProps {
  productId: string;
  className?: string;
  iconClassName?: string;
}

export function WishlistButton({ productId, className, iconClassName }: WishlistButtonProps) {
  const { items, toggle, hydrated } = useWishlist();

  if (!hydrated) {
    return (
      <button
        type='button'
        className={cn('p-2 rounded-full hover:bg-zinc-100 transition-colors', className)}
        disabled
      >
        <Heart className={cn('w-5 h-5 text-zinc-300', iconClassName)} />
      </button>
    );
  }

  const isWished = !!items[productId];

  return (
    <button
      type='button'
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      className={cn(
        'p-2 rounded-full hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-black',
        className,
      )}
      aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={cn(
          'w-5 h-5 transition-colors',
          isWished ? 'fill-red-500 text-red-500' : 'text-zinc-500 hover:text-black',
          iconClassName,
        )}
      />
    </button>
  );
}
