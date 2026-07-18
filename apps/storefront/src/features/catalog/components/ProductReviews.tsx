import { useEffect, useState } from 'react';
import { Button, Skeleton } from '@starsuperscare/ui';
import { client } from '../../../lib/api.ts';
import { BadgeCheck, MessageSquare, Star, Store } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  isVerifiedPurchase: boolean;
  sellerResponse: string | null;
  publishedAt: string | null;
  user: {
    id: string;
    username: string;
  };
}

export const ProductReviews = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await (client.v1.catalog.products as any)[':productId'].reviews.$get({
          param: { productId },
        });

        if (!res.ok) {
          throw new Error('Gagal memuat ulasan');
        }

        const payload = await res.json();
        setReviews(Array.isArray(payload.data) ? payload.data : (payload.data?.items ?? []));
      } catch (err: any) {
        setError(err.message || 'Gagal memuat ulasan');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className='flex flex-col gap-4 py-4 bg-card border border-border/60 p-5 lg:p-6 rounded-3xl shadow-sm'>
        <Skeleton className='h-24 w-full rounded-xl' />
        <Skeleton className='h-24 w-full rounded-xl' />
      </div>
    );
  }

  if (error) {
    return <p className='text-destructive font-medium py-4 px-2'>{error}</p>;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center bg-card border border-border/60 rounded-3xl shadow-sm'>
        <div className='w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4'>
          <MessageSquare className='w-8 h-8 text-muted-foreground/40' />
        </div>
        <p className='text-foreground font-black mb-1'>Belum ada ulasan untuk produk ini.</p>
        <p className='text-sm text-muted-foreground font-medium'>
          Jadilah yang pertama memberikan ulasan setelah membeli!
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 py-2'>
      {reviews.map((review) => (
        <div
          key={review.id}
          className='flex flex-col gap-3 p-5 lg:p-6 bg-card border border-border/60 rounded-3xl shadow-sm hover:border-border transition-colors'
        >
          <div className='flex items-center justify-between flex-wrap gap-2'>
            <div className='flex items-center gap-3 flex-wrap'>
              <div className='flex items-center gap-0.5 bg-muted/30 px-2 py-1 rounded-lg border border-border/40'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < review.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/20'
                    }`}
                  />
                ))}
              </div>
              <span className='text-sm font-black text-foreground'>{review.user.username}</span>
              {review.isVerifiedPurchase && (
                <span className='flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md font-bold uppercase tracking-widest border border-emerald-500/20'>
                  <BadgeCheck className='w-3.5 h-3.5' />
                  Pembeli Terverifikasi
                </span>
              )}
            </div>
            {review.publishedAt && (
              <span className='text-[11px] font-medium text-muted-foreground'>
                {new Date(review.publishedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>

          <div className='flex flex-col gap-1 mt-1'>
            <h3 className='text-sm font-black text-foreground'>{review.title}</h3>
            <p className='text-muted-foreground font-medium text-sm leading-relaxed'>
              {review.content}
            </p>
          </div>

          {review.sellerResponse && (
            <div className='mt-2 bg-indigo-500/5 p-4 rounded-2xl text-sm text-muted-foreground border border-indigo-500/10 flex flex-col gap-1.5'>
              <span className='font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2 text-xs uppercase tracking-widest'>
                <Store className='w-4 h-4' />
                Respons Penjual
              </span>
              <p className='leading-relaxed font-medium text-foreground text-sm'>
                {review.sellerResponse}
              </p>
            </div>
          )}
        </div>
      ))}
      {reviews.length >= 10 && (
        <Button
          variant='outline'
          className='w-full mt-4 rounded-2xl h-12 font-bold shadow-sm active:scale-[0.98] transition-transform'
        >
          Lihat Semua Ulasan
        </Button>
      )}
    </div>
  );
};
