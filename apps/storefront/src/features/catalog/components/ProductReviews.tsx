import { useEffect, useState } from 'react';
import { Button, H3, Skeleton, Text } from '@starsuperscare/ui';
import { client } from '../../../lib/api.ts';
import { MessageSquare, Star } from 'lucide-react';

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
        setReviews(payload.data.items);
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
      <div className='flex flex-col gap-4 py-4'>
        <Skeleton className='h-24 w-full' />
        <Skeleton className='h-24 w-full' />
      </div>
    );
  }

  if (error) {
    return <Text className='text-red-500 py-4'>{error}</Text>;
  }

  if (reviews.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-10 text-center bg-gray-50 rounded-lg'>
        <MessageSquare className='w-12 h-12 text-gray-300 mb-3' />
        <Text className='text-gray-500 font-medium'>Belum ada ulasan untuk produk ini.</Text>
        <Text className='text-sm text-gray-400'>
          Jadilah yang pertama memberikan ulasan setelah membeli!
        </Text>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 py-4'>
      {reviews.map((review) => (
        <div
          key={review.id}
          className='flex flex-col gap-2 pb-6 border-b border-gray-100 last:border-0'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className='text-sm font-medium text-gray-900'>{review.user.username}</span>
              {review.isVerifiedPurchase && (
                <span className='text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium'>
                  Pembeli Terverifikasi
                </span>
              )}
            </div>
            {review.publishedAt && (
              <span className='text-xs text-gray-400'>
                {new Date(review.publishedAt).toLocaleDateString('id-ID')}
              </span>
            )}
          </div>

          <H3 className='text-sm font-bold text-gray-800'>{review.title}</H3>
          <Text className='text-gray-600 text-sm'>{review.content}</Text>

          {review.sellerResponse && (
            <div className='mt-3 bg-gray-50 p-3 rounded text-sm text-gray-700 border-l-4 border-blue-400'>
              <span className='font-bold text-gray-900 block mb-1'>Respons Penjual:</span>
              {review.sellerResponse}
            </div>
          )}
        </div>
      ))}
      {reviews.length >= 10 && (
        <Button variant='outline' className='w-full mt-2'>Lihat Semua Ulasan</Button>
      )}
    </div>
  );
};
