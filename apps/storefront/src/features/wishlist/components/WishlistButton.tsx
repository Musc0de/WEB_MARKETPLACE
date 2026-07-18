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
        className={cn('p-1.5 rounded-full transition-transform active:scale-95', className)}
        disabled
      >
        <Heart className={cn('w-5 h-5 text-muted-foreground/50', iconClassName)} />
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
        'p-1.5 rounded-full transition-transform active:scale-95 focus:outline-none',
        className,
      )}
      aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={cn(
          'w-5 h-5 transition-colors',
          isWished
            ? 'fill-rose-500 text-rose-500'
            : 'text-muted-foreground/70 hover:text-rose-500 dark:text-muted-foreground hover:dark:text-rose-400 drop-shadow-sm',
          iconClassName,
        )}
      />
    </button>
  );
}
