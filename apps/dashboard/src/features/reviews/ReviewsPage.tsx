import React, { useState } from 'react';
import useSWR from 'swr';
import { API_URL, client } from '../../lib/api.ts';
import { Button, Card, toast } from '@starsuperscare/ui';
import { Image as ImageIcon, MessageSquare, Star } from 'lucide-react';

export const ReviewsPage = () => {
  const [activeTab, setActiveTab] = useState<'eligible' | 'mine'>('eligible');
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [creatingReviewFor, setCreatingReviewFor] = useState<any | null>(null);

  const { data: eligibleItems, mutate: mutateEligible, isLoading: isLoadingEligible } = useSWR(
    '/api/reviews/eligible',
    async () => {
      const res = await (client.v1 as any).reviews.eligible.$get();
      const json = await res.json();
      return json.data || [];
    },
  );

  const { data: myReviews, mutate: mutateReviews, isLoading: isLoadingReviews } = useSWR(
    '/api/reviews',
    async () => {
      const res = await (client.v1 as any).reviews.$get();
      const json = await res.json();
      return json.data || [];
    },
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus ulasan ini?')) return;
    try {
      const res = await (client.v1 as any).reviews[':id'].$delete({ param: { id } });
      if (res.ok) {
        toast.success('Ulasan dihapus');
        mutateReviews();
        mutateEligible();
      }
    } catch (_e) {
      toast.error('Gagal menghapus');
    }
  };

  const getMediaUrl = (key: string | null) => {
    if (!key) return null;
    return `${API_URL}/v1/admin/assets/${key}`;
  };

  return (
    <div className='max-w-4xl mx-auto space-y-6 relative'>
      <div>
        <h1 className='text-2xl font-bold text-white flex items-center gap-2'>
          Ulasan Saya
        </h1>
        <p className='text-muted-foreground mt-1'>
          Berikan penilaian untuk produk yang telah Anda beli.
        </p>
      </div>

      <div className='flex gap-4 border-b border-white/10'>
        <button
          type='button'
          className={`pb-2 px-1 border-b-2 transition-colors ${
            activeTab === 'eligible'
              ? 'border-primary text-primary font-medium'
              : 'border-transparent text-muted-foreground hover:text-white'
          }`}
          onClick={() => setActiveTab('eligible')}
        >
          Menunggu Ulasan
        </button>
        <button
          type='button'
          className={`pb-2 px-1 border-b-2 transition-colors ${
            activeTab === 'mine'
              ? 'border-primary text-primary font-medium'
              : 'border-transparent text-muted-foreground hover:text-white'
          }`}
          onClick={() => setActiveTab('mine')}
        >
          Riwayat Ulasan
        </button>
      </div>

      {activeTab === 'eligible' && (
        <div className='space-y-4'>
          {isLoadingEligible
            ? (
              <div className='animate-pulse bg-white/5 border border-white/10 h-32 rounded-xl'>
              </div>
            )
            : eligibleItems?.length === 0
            ? (
              <div className='text-center py-20 bg-white/5 rounded-xl border border-white/10'>
                <MessageSquare className='w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50' />
                <h3 className='text-lg font-medium text-white mb-2'>Belum Ada Transaksi</h3>
                <p className='text-muted-foreground text-sm'>
                  Tidak ada produk yang menunggu ulasan Anda.
                </p>
              </div>
            )
            : (
              eligibleItems?.map((item: any) => (
                <Card
                  key={item.orderItemId}
                  className='p-4 bg-[#0f1115] border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center'
                >
                  <div className='flex items-center gap-4'>
                    <div className='w-16 h-16 bg-white/5 rounded-md flex items-center justify-center shrink-0 overflow-hidden'>
                      {item.primaryImage
                        ? (
                          <img
                            src={getMediaUrl(item.primaryImage) || ''}
                            alt={item.productName}
                            className='w-full h-full object-cover'
                          />
                        )
                        : <ImageIcon className='w-6 h-6 text-muted-foreground' />}
                    </div>
                    <div>
                      <h4 className='font-medium text-white line-clamp-2'>{item.productName}</h4>
                      <p className='text-xs text-muted-foreground mt-1'>
                        No. Pesanan: {item.orderNumber}
                      </p>
                      <p className='text-xs text-muted-foreground'>SKU: {item.variantSku}</p>
                    </div>
                  </div>
                  <Button onClick={() => setCreatingReviewFor(item)}>Tulis Ulasan</Button>
                </Card>
              ))
            )}
        </div>
      )}

      {activeTab === 'mine' && (
        <div className='space-y-4'>
          {isLoadingReviews
            ? (
              <div className='animate-pulse bg-white/5 border border-white/10 h-32 rounded-xl'>
              </div>
            )
            : myReviews?.length === 0
            ? (
              <div className='text-center py-20 bg-white/5 rounded-xl border border-white/10'>
                <Star className='w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50' />
                <h3 className='text-lg font-medium text-white mb-2'>Belum Ada Ulasan</h3>
                <p className='text-muted-foreground text-sm'>
                  Anda belum memberikan ulasan untuk produk apapun.
                </p>
              </div>
            )
            : (
              myReviews?.map((review: any) => (
                <Card key={review.id} className='p-4 bg-[#0f1115] border-white/10 space-y-4'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <div className='flex gap-1 mb-2'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      {review.title && <h4 className='font-medium text-white'>{review.title}</h4>}
                      {review.content && (
                        <p className='text-sm text-gray-300 mt-1'>{review.content}</p>
                      )}
                      <p className='text-xs text-muted-foreground mt-2'>
                        {new Date(review.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          setEditingReview(review)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() =>
                          handleDelete(review.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
        </div>
      )}

      {/* Review Modal */}
      {(creatingReviewFor || editingReview) && (
        <ReviewModal
          item={creatingReviewFor}
          review={editingReview}
          onClose={() => {
            setCreatingReviewFor(null);
            setEditingReview(null);
          }}
          onSuccess={() => {
            mutateEligible();
            mutateReviews();
            setCreatingReviewFor(null);
            setEditingReview(null);
            setActiveTab('mine');
          }}
        />
      )}
    </div>
  );
};

function ReviewModal(
  { item, review, onClose, onSuccess }: {
    item?: any;
    review?: any;
    onClose: () => void;
    onSuccess: () => void;
  },
) {
  const [rating, setRating] = useState(review?.rating || 5);
  const [title, setTitle] = useState(review?.title || '');
  const [content, setContent] = useState(review?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (review) {
        const res = await (client.v1 as any).reviews[':id'].$put({
          param: { id: review.id },
          json: { rating, title: title || null, content: content || null },
        });
        if (res.ok) {
          toast.success('Ulasan diperbarui');
          onSuccess();
        } else {
          toast.error('Gagal memperbarui');
        }
      } else if (item) {
        const res = await (client.v1 as any).reviews.$post({
          json: {
            productId: item.productId,
            orderItemId: item.orderItemId,
            rating,
            title: title || null,
            content: content || null,
          },
        });
        if (res.ok) {
          toast.success('Ulasan berhasil dikirim');
          onSuccess();
        } else {
          toast.error('Gagal mengirim');
        }
      }
    } catch (_err) {
      toast.error('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
      <div className='bg-[#0f1115] border border-white/10 rounded-xl p-6 w-full max-w-md'>
        <h3 className='text-lg font-bold text-white mb-4'>
          {review ? 'Edit Ulasan' : 'Tulis Ulasan'}
        </h3>

        {item && <p className='text-sm text-gray-300 mb-6'>Produk: {item.productName}</p>}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Penilaian</label>
            <div className='flex gap-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type='button'
                  onClick={() => setRating(star)}
                  className='focus:outline-none'
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Judul (Opsional)</label>
            <input
              className='flex h-10 w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Sangat memuaskan...'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Ceritakan pengalaman Anda (Opsional)</label>
            <textarea
              className='flex w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Kualitas bagus, pengiriman cepat...'
              rows={4}
            />
          </div>

          <div className='flex justify-end gap-3 pt-4'>
            <Button variant='ghost' type='button' onClick={onClose}>Batal</Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Ulasan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
