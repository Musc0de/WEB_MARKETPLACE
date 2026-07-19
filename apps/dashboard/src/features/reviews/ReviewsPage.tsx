import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Button, Card, toast } from '@starsuperscare/ui';
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock3,
  History,
  Image as ImageIcon,
  Loader2,
  MessageSquareText,
  PackageCheck,
  Pencil,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react';

const RATING_LABELS: Record<number, string> = {
  1: 'Sangat buruk',
  2: 'Kurang baik',
  3: 'Cukup baik',
  4: 'Sangat baik',
  5: 'Luar biasa',
};

const ELIGIBLE_BATCH_SIZE = 6;

const getMediaUrl = (key: string | null) => {
  if (!key) return null;
  if (key.startsWith('http://') || key.startsWith('https://')) return key;
  const r2Url = (import.meta as any).env?.VITE_R2_PUBLIC_URL;
  if (r2Url) return `${r2Url.replace(/\/$/, '')}/${key.replace(/^\//, '')}`;
  return key;
};

export const ReviewsPage = () => {
  const [activeTab, setActiveTab] = useState<'eligible' | 'mine'>('eligible');
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [creatingReviewFor, setCreatingReviewFor] = useState<any | null>(null);
  const [eligibleQuery, setEligibleQuery] = useState('');
  const [eligibleLimit, setEligibleLimit] = useState(ELIGIBLE_BATCH_SIZE);

  const {
    data: eligibleItems,
    mutate: mutateEligible,
    isLoading: isLoadingEligible,
  } = useSWR('/api/reviews/eligible', async () => {
    const res = await (client.v1 as any).reviews.eligible.$get();
    const json = await res.json();
    return json.data || [];
  });

  const {
    data: myReviews,
    mutate: mutateReviews,
    isLoading: isLoadingReviews,
  } = useSWR('/api/reviews', async () => {
    const res = await (client.v1 as any).reviews.$get();
    const json = await res.json();
    return json.data || [];
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus ulasan ini?')) return;

    try {
      const res = await (client.v1 as any).reviews[':id'].$delete({
        param: { id },
      });

      if (res.ok) {
        toast.success('Ulasan dihapus');
        mutateReviews();
        mutateEligible();
      }
    } catch (_e) {
      toast.error('Gagal menghapus');
    }
  };

  const eligibleCount = eligibleItems?.length ?? 0;
  const reviewCount = myReviews?.length ?? 0;

  const filteredEligibleItems = useMemo(() => {
    const query = eligibleQuery.trim().toLocaleLowerCase('id-ID');
    const items = eligibleItems ?? [];

    if (!query) return items;

    return items.filter((item: any) => {
      const searchableValue = [
        item.productName,
        item.orderNumber,
        item.variantSku,
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('id-ID');

      return searchableValue.includes(query);
    });
  }, [eligibleItems, eligibleQuery]);

  const visibleEligibleItems = filteredEligibleItems.slice(0, eligibleLimit);
  const filteredEligibleCount = filteredEligibleItems.length;
  const hasMoreEligible = visibleEligibleItems.length < filteredEligibleCount;
  const canCollapseEligible = eligibleLimit > ELIGIBLE_BATCH_SIZE;
  const nextEligibleBatch = Math.min(
    ELIGIBLE_BATCH_SIZE,
    Math.max(0, filteredEligibleCount - visibleEligibleItems.length),
  );

  return (
    <div className='mx-auto w-full max-w-6xl pb-28 md:pb-12'>
      <div className='space-y-7 animate-in fade-in slide-in-from-bottom-3 duration-500'>
        {/* Page header */}
        <section className='relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/[0.09] via-transparent to-transparent' />
          <div className='absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl' />

          <div className='relative grid gap-6 px-5 py-6 sm:px-7 sm:py-8 lg:grid-cols-[1fr_auto] lg:items-end'>
            <div className='max-w-2xl'>
              <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary'>
                <Sparkles className='h-3.5 w-3.5' />
                Pusat ulasan produk
              </div>

              <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl'>
                Ulasan Saya
              </h1>
              <p className='mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base'>
                Bagikan pengalaman belanja Anda dan bantu pelanggan lain memilih produk dengan lebih
                percaya diri.
              </p>
            </div>

            <div className='grid grid-cols-2 gap-3 sm:min-w-[320px]'>
              <SummaryCard
                icon={<Clock3 className='h-5 w-5' />}
                label='Menunggu ulasan'
                value={eligibleCount}
                description='Produk siap dinilai'
              />
              <SummaryCard
                icon={<MessageSquareText className='h-5 w-5' />}
                label='Ulasan terkirim'
                value={reviewCount}
                description='Riwayat ulasan Anda'
              />
            </div>
          </div>
        </section>

        {/* Tab navigation */}
        <div className='rounded-2xl border border-border/70 bg-card p-1.5 shadow-sm'>
          <div
            className='grid grid-cols-2 gap-1'
            role='tablist'
            aria-label='Navigasi ulasan'
          >
            <TabButton
              active={activeTab === 'eligible'}
              icon={<PackageCheck className='h-4 w-4' />}
              label='Menunggu Ulasan'
              count={eligibleCount}
              onClick={() => setActiveTab('eligible')}
            />
            <TabButton
              active={activeTab === 'mine'}
              icon={<History className='h-4 w-4' />}
              label='Riwayat Ulasan'
              count={reviewCount}
              onClick={() => setActiveTab('mine')}
            />
          </div>
        </div>

        {/* Eligible items */}
        {activeTab === 'eligible' && (
          <section className='animate-in fade-in duration-300'>
            <SectionHeading
              title='Produk yang dapat diulas'
              description='Ulasan hanya tersedia untuk produk dari transaksi yang memenuhi syarat.'
              count={eligibleCount}
            />

            <div className='mt-4'>
              {isLoadingEligible ? <ReviewListSkeleton /> : eligibleCount === 0
                ? (
                  <EmptyState
                    icon={<CheckCircle2 className='h-8 w-8' />}
                    title='Semua produk sudah diulas'
                    description='Saat ini tidak ada produk yang menunggu ulasan. Produk baru akan muncul setelah pesanan Anda memenuhi syarat.'
                  />
                )
                : (
                  <>
                    <div className='mb-3 rounded-2xl border border-border/70 bg-card p-2.5 shadow-sm sm:mb-4 sm:p-3'>
                      <div className='relative'>
                        <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                        <input
                          type='search'
                          value={eligibleQuery}
                          onChange={(event) => {
                            setEligibleQuery(event.target.value);
                            setEligibleLimit(ELIGIBLE_BATCH_SIZE);
                          }}
                          placeholder='Cari nama produk, nomor pesanan, atau SKU'
                          aria-label='Cari produk yang menunggu ulasan'
                          className='h-11 w-full rounded-xl border border-border/70 bg-background pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-4 focus:ring-primary/10'
                        />
                      </div>
                    </div>

                    {filteredEligibleCount === 0
                      ? (
                        <div className='rounded-2xl border border-dashed border-border bg-card px-5 py-10 text-center shadow-sm'>
                          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground'>
                            <Search className='h-5 w-5' />
                          </div>
                          <h3 className='mt-4 text-sm font-semibold text-foreground'>
                            Produk tidak ditemukan
                          </h3>
                          <p className='mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground'>
                            Coba gunakan nama produk, nomor pesanan, atau SKU yang berbeda.
                          </p>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            className='mt-4 h-9 rounded-xl px-4'
                            onClick={() => {
                              setEligibleQuery('');
                              setEligibleLimit(ELIGIBLE_BATCH_SIZE);
                            }}
                          >
                            Hapus pencarian
                          </Button>
                        </div>
                      )
                      : (
                        <>
                          <div
                            className='grid gap-3 sm:gap-4'
                            aria-live='polite'
                            aria-label='Daftar produk yang dapat diulas'
                          >
                            {visibleEligibleItems.map((item: any) => (
                              <EligibleReviewCard
                                key={item.orderItemId}
                                item={item}
                                onReview={setCreatingReviewFor}
                              />
                            ))}
                          </div>

                          <div className='mt-4 flex flex-col items-center gap-3'>
                            <p className='text-center text-xs text-muted-foreground'>
                              Menampilkan {visibleEligibleItems.length} dari {filteredEligibleCount}
                              {' '}
                              produk
                              {eligibleQuery ? ' hasil pencarian' : ''}.
                            </p>

                            <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row'>
                              {hasMoreEligible && (
                                <Button
                                  type='button'
                                  variant='outline'
                                  className='h-11 w-full gap-2 rounded-xl border-primary/25 bg-card px-5 text-sm font-semibold text-primary shadow-sm hover:bg-primary/5 sm:w-auto'
                                  onClick={() => {
                                    setEligibleLimit((current) => current + ELIGIBLE_BATCH_SIZE);
                                  }}
                                >
                                  Tampilkan {nextEligibleBatch} produk lagi
                                  <ChevronDown className='h-4 w-4' />
                                </Button>
                              )}

                              {canCollapseEligible && (
                                <Button
                                  type='button'
                                  variant='ghost'
                                  className='h-11 w-full gap-2 rounded-xl px-5 text-sm text-muted-foreground sm:w-auto'
                                  onClick={() => {
                                    setEligibleLimit(ELIGIBLE_BATCH_SIZE);
                                    document
                                      .querySelector(
                                        '[aria-label="Daftar produk yang dapat diulas"]',
                                      )
                                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }}
                                >
                                  Tampilkan lebih sedikit
                                  <ChevronUp className='h-4 w-4' />
                                </Button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                  </>
                )}
            </div>
          </section>
        )}

        {/* Review history */}
        {activeTab === 'mine' && (
          <section className='animate-in fade-in duration-300'>
            <SectionHeading
              title='Riwayat ulasan Anda'
              description='Kelola penilaian dan pengalaman produk yang pernah Anda bagikan.'
              count={reviewCount}
            />

            <div className='mt-4'>
              {isLoadingReviews ? <ReviewListSkeleton /> : reviewCount === 0
                ? (
                  <EmptyState
                    icon={<MessageSquareText className='h-8 w-8' />}
                    title='Belum ada ulasan'
                    description='Ulasan yang sudah Anda kirim akan ditampilkan di halaman ini agar mudah dikelola.'
                  />
                )
                : (
                  <div className='grid gap-4'>
                    {myReviews?.map((review: any) => (
                      <Card
                        key={review.id}
                        className='overflow-hidden border-border/70 bg-card p-0 shadow-sm transition-all duration-200 hover:border-primary/25 hover:shadow-md'
                      >
                        <div className='p-5 sm:p-6'>
                          <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
                            <div className='min-w-0 flex-1'>
                              <div className='flex flex-wrap items-center gap-3'>
                                <RatingStars rating={review.rating} size='sm' />
                                <span className='rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400'>
                                  {review.rating}/5 · {RATING_LABELS[review.rating] ?? 'Dinilai'}
                                </span>
                              </div>

                              <h3 className='mt-4 text-lg font-semibold leading-7 text-foreground'>
                                {review.title || 'Ulasan produk'}
                              </h3>

                              {review.content
                                ? (
                                  <p className='mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground'>
                                    {review.content}
                                  </p>
                                )
                                : (
                                  <p className='mt-2 text-sm italic text-muted-foreground/70'>
                                    Tidak ada komentar tertulis untuk ulasan ini.
                                  </p>
                                )}

                              <div className='mt-5 flex items-center gap-2 border-t border-border/70 pt-4 text-xs text-muted-foreground'>
                                <CalendarDays className='h-4 w-4' />
                                Dikirim pada {new Date(review.createdAt).toLocaleDateString(
                                  'id-ID',
                                  {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  },
                                )}
                              </div>
                            </div>

                            <div className='flex w-full gap-2 lg:w-auto lg:shrink-0'>
                              <Button
                                variant='outline'
                                size='sm'
                                className='h-10 flex-1 gap-2 rounded-xl lg:flex-none'
                                onClick={() => setEditingReview(review)}
                              >
                                <Pencil className='h-4 w-4' />
                                Edit
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                className='h-10 flex-1 gap-2 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive lg:flex-none'
                                onClick={() => handleDelete(review.id)}
                              >
                                <Trash2 className='h-4 w-4' />
                                Hapus
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
            </div>
          </section>
        )}
      </div>

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

type EligibleReviewItem = {
  orderItemId: string;
  productName?: string | null;
  primaryImage?: string | null;
  orderNumber?: string | null;
  variantSku?: string | null;
};

function EligibleReviewCard({
  item,
  onReview,
}: {
  item: EligibleReviewItem;
  onReview: (item: EligibleReviewItem) => void;
}) {
  return (
    <Card className='group overflow-hidden rounded-2xl border-border/70 bg-card p-0 shadow-sm transition-[border-color,box-shadow] duration-200 [content-visibility:auto] [contain-intrinsic-size:164px] sm:hover:border-primary/30 sm:hover:shadow-md'>
      <div className='p-3 sm:flex sm:items-center sm:gap-4 sm:p-4'>
        <div className='flex min-w-0 items-start gap-3 sm:flex-1 sm:items-center sm:gap-4'>
          <ProductThumbnail
            src={item.primaryImage}
            alt={item.productName || 'Gambar produk'}
          />

          <div className='min-w-0 flex-1 py-0.5'>
            <div className='flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-primary sm:text-xs'>
              <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
                <ShieldCheck className='h-3 w-3' />
              </span>
              <span className='truncate'>Siap untuk dinilai</span>
            </div>

            <h3 className='mt-1.5 line-clamp-2 break-words text-sm font-bold leading-5 text-foreground sm:text-base sm:leading-6'>
              {item.productName || 'Produk tanpa nama'}
            </h3>

            <div className='mt-2 flex min-w-0 flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground sm:text-xs'>
              {item.orderNumber && (
                <span className='max-w-full truncate rounded-lg border border-border/80 bg-muted/50 px-2 py-1 font-semibold'>
                  Pesanan #{item.orderNumber.slice(-6)}
                </span>
              )}
              {item.variantSku && (
                <span className='max-w-full truncate rounded-lg border border-border/80 bg-muted/50 px-2 py-1 font-semibold'>
                  {item.variantSku}
                </span>
              )}
            </div>
          </div>
        </div>

        <Button
          type='button'
          className='mt-3 h-11 w-full shrink-0 justify-center gap-2 rounded-xl px-4 text-sm font-bold shadow-sm transition-transform active:scale-[0.99] sm:mt-0 sm:w-auto sm:min-w-36 sm:px-5'
          onClick={() => onReview(item)}
          aria-label={`Tulis ulasan untuk ${item.productName || 'produk'}`}
        >
          <MessageSquareText className='h-4 w-4' />
          Tulis Ulasan
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </Card>
  );
}

function ProductThumbnail({
  src,
  alt,
}: {
  src?: string | null | undefined;
  alt: string;
}) {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getMediaUrl(src ?? null);

  return (
    <div className='relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-muted sm:h-28 sm:w-28 sm:rounded-2xl'>
      {imageUrl && !hasError
        ? (
          <img
            src={imageUrl}
            alt={alt}
            loading='lazy'
            decoding='async'
            onError={() => setHasError(true)}
            className='h-full w-full object-cover transition-transform duration-300 sm:group-hover:scale-[1.03]'
          />
        )
        : (
          <div className='flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground/60'>
            <ImageIcon className='h-7 w-7' />
            <span className='text-[9px] font-semibold uppercase tracking-wide'>Tanpa gambar</span>
          </div>
        )}

      <span className='absolute bottom-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-background/90 text-emerald-600 shadow-sm backdrop-blur dark:text-emerald-400'>
        <ShieldCheck className='h-3.5 w-3.5' />
      </span>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className='rounded-2xl border border-border/70 bg-background/75 p-4 shadow-sm backdrop-blur'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
          {icon}
        </div>
        <span className='text-2xl font-bold tracking-tight text-foreground'>
          {value}
        </span>
      </div>
      <p className='mt-3 text-sm font-semibold text-foreground'>{label}</p>
      <p className='mt-0.5 text-xs text-muted-foreground'>{description}</p>
    </div>
  );
}

function TabButton({
  active,
  icon,
  label,
  count,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      role='tab'
      aria-selected={active}
      onClick={onClick}
      className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-all sm:px-5 ${
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {icon}
      <span className='truncate'>{label}</span>
      <span
        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
          active
            ? 'bg-primary-foreground/15 text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function SectionHeading({
  title,
  description,
  count,
}: {
  title: string;
  description: string;
  count: number;
}) {
  return (
    <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
      <div>
        <h2 className='text-lg font-semibold text-foreground sm:text-xl'>
          {title}
        </h2>
        <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
      </div>
      <span className='w-fit rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm'>
        {count} item
      </span>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className='rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-sm sm:py-20'>
      <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
        {icon}
      </div>
      <h3 className='mt-5 text-lg font-semibold text-foreground'>{title}</h3>
      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground'>
        {description}
      </p>
    </div>
  );
}

function ReviewListSkeleton() {
  return (
    <div className='grid gap-3 sm:gap-4' aria-label='Memuat data ulasan'>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className='overflow-hidden rounded-2xl border border-border/70 bg-card p-3 shadow-sm sm:p-4'
        >
          <div className='animate-pulse sm:flex sm:items-center sm:gap-4'>
            <div className='flex items-center gap-3 sm:flex-1 sm:gap-4'>
              <div className='h-24 w-24 shrink-0 rounded-xl bg-muted sm:h-28 sm:w-28 sm:rounded-2xl' />
              <div className='min-w-0 flex-1 space-y-3'>
                <div className='h-3 w-24 rounded bg-muted' />
                <div className='h-5 w-4/5 rounded bg-muted' />
                <div className='h-7 w-2/3 rounded-lg bg-muted' />
              </div>
            </div>
            <div className='mt-3 h-11 w-full rounded-xl bg-muted sm:mt-0 sm:w-36' />
          </div>
        </div>
      ))}
    </div>
  );
}

function RatingStars({
  rating,
  size = 'md',
}: {
  rating: number;
  size?: 'sm' | 'md';
}) {
  const starSize = size === 'sm' ? 'h-4 w-4' : 'h-7 w-7';

  return (
    <div
      className='flex items-center gap-1'
      aria-label={`${rating} dari 5 bintang`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/25'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewModal({
  item,
  review,
  onClose,
  onSuccess,
}: {
  item?: any;
  review?: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [rating, setRating] = useState(review?.rating || 5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [title, setTitle] = useState(review?.title || '');
  const [content, setContent] = useState(review?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visibleRating = hoveredRating ?? rating;

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
    <div className='fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4'>
      <button
        type='button'
        aria-label='Tutup modal ulasan'
        className='absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm animate-in fade-in duration-200'
        onClick={onClose}
      />

      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='review-modal-title'
        className='relative max-h-[94vh] w-full overflow-y-auto rounded-t-3xl border border-border bg-card shadow-2xl animate-in slide-in-from-bottom-6 duration-300 sm:max-w-xl sm:rounded-3xl sm:zoom-in-95'
      >
        <div className='sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border/50 bg-card/95 px-5 py-5 backdrop-blur-md sm:px-7'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-purple-400'>
              {review ? 'Perbarui pengalaman' : 'Bagikan pengalaman'}
            </p>
            <h2 className='mt-1 text-xl font-bold text-foreground sm:text-2xl'>
              {review ? 'Edit Ulasan' : 'Tulis Ulasan'}
            </h2>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/50 text-muted-foreground transition hover:bg-muted hover:text-foreground'
            aria-label='Tutup'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='space-y-7 px-5 py-6 sm:px-7'>
            {item && (
              <div className='flex items-center gap-4 rounded-2xl border border-indigo-500/15 bg-indigo-50/50 p-3.5 dark:bg-indigo-500/10'>
                <div className='flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-background'>
                  {item.primaryImage
                    ? (
                      <img
                        src={getMediaUrl(item.primaryImage) || ''}
                        className='h-full w-full object-cover'
                        alt={item.productName || 'Produk'}
                      />
                    )
                    : <ImageIcon className='h-6 w-6 text-muted-foreground/50' />}
                </div>
                <div className='min-w-0'>
                  <span className='text-xs font-semibold text-purple-400'>
                    Produk yang diulas
                  </span>
                  <p className='mt-1 line-clamp-2 text-sm font-semibold leading-5 text-foreground'>
                    {item.productName}
                  </p>
                  {item.orderNumber && (
                    <p className='mt-1 text-xs text-muted-foreground'>
                      Pesanan #{item.orderNumber}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <div className='flex items-center justify-between gap-3'>
                <label className='text-sm font-semibold text-foreground'>
                  Penilaian Anda
                </label>
                <span className='text-sm font-semibold text-amber-500'>
                  {RATING_LABELS[visibleRating]}
                </span>
              </div>

              <div className='mt-3 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 px-3 py-5 shadow-inner'>
                <div
                  className='flex items-center justify-center gap-1 sm:gap-2'
                  onMouseLeave={() => setHoveredRating(null)}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type='button'
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      className='rounded-xl p-1.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-2'
                      aria-label={`Beri ${star} bintang`}
                    >
                      <Star
                        className={`h-9 w-9 transition-all sm:h-10 sm:w-10 ${
                          star <= visibleRating
                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                            : 'fill-muted text-muted-foreground/25'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between gap-3'>
                <label
                  htmlFor='review-title'
                  className='text-sm font-semibold text-foreground'
                >
                  Judul ulasan
                </label>
                <span className='text-xs text-muted-foreground/80'>Opsional</span>
              </div>
              <input
                id='review-title'
                className='h-12 w-full rounded-xl border border-border/80 bg-background px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/50 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Contoh: Kualitas sangat memuaskan'
                maxLength={120}
              />
              <p className='text-right text-xs text-muted-foreground/80'>
                {title.length}/120
              </p>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between gap-3'>
                <label
                  htmlFor='review-content'
                  className='text-sm font-semibold text-foreground'
                >
                  Ceritakan pengalaman Anda
                </label>
                <span className='text-xs text-muted-foreground/80'>Opsional</span>
              </div>
              <textarea
                id='review-content'
                className='min-h-32 w-full resize-none rounded-xl border border-border/80 bg-background px-4 py-3 text-sm leading-6 text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/50 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='Ceritakan kualitas produk, kesesuaian deskripsi, kemasan, atau pengalaman penggunaan Anda.'
                rows={5}
                maxLength={1000}
              />
              <div className='flex items-center justify-between gap-4 text-xs text-muted-foreground/80'>
                <span>Berikan informasi yang jujur dan relevan.</span>
                <span>{content.length}/1000</span>
              </div>
            </div>

            <div className='flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-5 text-emerald-600 dark:text-emerald-400'>
              <ShieldCheck className='mt-0.5 h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400' />
              Ulasan Anda akan ditampilkan sebagai pembelian terverifikasi dan membantu meningkatkan
              kualitas informasi produk.
            </div>
          </div>

          <div className='sticky bottom-0 flex flex-col-reverse gap-3 border-t border-border/50 bg-card/95 px-5 py-4 backdrop-blur-md sm:flex-row sm:justify-end sm:px-7'>
            <Button
              variant='outline'
              type='button'
              onClick={onClose}
              className='h-11 rounded-xl px-5 border-border text-foreground hover:bg-muted transition-colors'
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='h-11 min-w-40 gap-2 rounded-xl px-5 shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 transition-all hover:scale-[1.02] active:scale-[0.98]'
            >
              {isSubmitting
                ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Menyimpan...
                  </>
                )
                : (
                  <>
                    <MessageSquareText className='h-4 w-4' />
                    {review ? 'Simpan Perubahan' : 'Kirim Ulasan'}
                  </>
                )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
