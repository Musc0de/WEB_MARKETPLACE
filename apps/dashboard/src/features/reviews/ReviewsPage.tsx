import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import {
  Button,
  Card,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  toast,
} from '@starsuperscare/ui';
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
        <ReviewSheet
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

function ReviewSheet({
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
  const target = item ?? review;
  const productImage = target?.primaryImage ?? target?.product?.primaryImage ?? null;
  const productName = target?.productName ?? target?.product?.name ?? null;
  const orderNumber = target?.orderNumber ?? target?.order?.orderNumber ?? null;

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
    <Sheet
      open
      onOpenChange={(open: boolean) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <SheetContent
        side='bottom'
        aria-describedby='review-sheet-description'
        className='z-[110] flex h-[min(92dvh,760px)] max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[30px] border-x border-t border-slate-200/80 bg-white p-0 shadow-[0_-24px_80px_-28px_rgba(15,23,42,0.45)] outline-none dark:border-slate-700/80 dark:bg-slate-950 [&>button]:hidden sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[90dvh] sm:w-[min(680px,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px] sm:border sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:slide-in-from-bottom-0'
      >
        {/* Mobile drag handle */}
        <div className='flex shrink-0 justify-center bg-white pb-1 pt-2.5 dark:bg-slate-950 sm:hidden'>
          <div className='h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700' />
        </div>

        <SheetHeader className='relative shrink-0 border-b border-slate-200/80 bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-5 pb-4 pt-3 text-left dark:border-slate-800 dark:from-violet-950/35 dark:via-slate-950 dark:to-indigo-950/30 sm:px-7 sm:pb-5 sm:pt-6'>
          <div className='pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-500/10' />

          <div className='relative flex items-start justify-between gap-4 pr-1'>
            <div className='min-w-0'>
              <div className='mb-2 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-100/80 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-violet-700 dark:border-violet-800/80 dark:bg-violet-500/10 dark:text-violet-300'>
                <Sparkles className='h-3 w-3' />
                {review ? 'Perbarui pengalaman' : 'Bagikan pengalaman'}
              </div>

              <SheetTitle
                id='review-sheet-title'
                className='text-xl font-black tracking-tight text-slate-950 dark:text-white sm:text-2xl'
              >
                {review ? 'Edit ulasan produk' : 'Tulis ulasan produk'}
              </SheetTitle>

              <SheetDescription
                id='review-sheet-description'
                className='mt-1.5 max-w-lg text-xs font-medium leading-5 text-slate-600 dark:text-slate-300 sm:text-sm'
              >
                Nilai produk secara jujur agar pengalaman Anda bermanfaat bagi pembeli lain.
              </SheetDescription>
            </div>

            <button
              type='button'
              onClick={onClose}
              disabled={isSubmitting}
              className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-slate-500 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/15 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-violet-800 dark:hover:bg-violet-950/60 dark:hover:text-violet-300'
              aria-label='Tutup form ulasan'
            >
              <X className='h-5 w-5' />
            </button>
          </div>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className='flex min-h-0 flex-1 flex-col'
        >
          <div className='min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5 [scrollbar-width:thin] sm:space-y-6 sm:px-7 sm:py-6'>
            {productName && (
              <section className='relative overflow-hidden rounded-2xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50 via-white to-violet-50 p-3.5 shadow-sm dark:border-indigo-900/70 dark:from-indigo-950/45 dark:via-slate-900 dark:to-violet-950/35'>
                <div className='absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-300/20 blur-2xl dark:bg-indigo-500/10' />

                <div className='relative flex items-center gap-3.5'>
                  <div className='flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800'>
                    {productImage
                      ? (
                        <img
                          src={getMediaUrl(productImage) || ''}
                          className='h-full w-full object-cover'
                          alt={productName || 'Produk'}
                          loading='lazy'
                          decoding='async'
                        />
                      )
                      : <ImageIcon className='h-7 w-7 text-slate-400 dark:text-slate-500' />}
                  </div>

                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300'>
                      <ShieldCheck className='h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400' />
                      Pembelian terverifikasi
                    </div>
                    <p className='mt-1.5 line-clamp-2 text-sm font-extrabold leading-5 text-slate-950 dark:text-white sm:text-base'>
                      {productName}
                    </p>
                    {orderNumber && (
                      <p className='mt-1.5 truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400 sm:text-xs'>
                        Nomor pesanan #{orderNumber}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            <section aria-labelledby='rating-heading'>
              <div className='flex items-end justify-between gap-3'>
                <div>
                  <h3
                    id='rating-heading'
                    className='text-sm font-extrabold text-slate-900 dark:text-slate-100'
                  >
                    Penilaian Anda
                  </h3>
                  <p className='mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400'>
                    Ketuk bintang untuk memberikan nilai.
                  </p>
                </div>

                <span className='shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-extrabold text-amber-700 dark:border-amber-800/70 dark:bg-amber-500/10 dark:text-amber-300'>
                  {visibleRating}/5 · {RATING_LABELS[visibleRating]}
                </span>
              </div>

              <div className='mt-3 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-orange-50/70 to-white px-2 py-4 shadow-inner dark:border-amber-900/60 dark:from-amber-950/35 dark:via-orange-950/20 dark:to-slate-900'>
                <div
                  className='flex items-center justify-center gap-0.5 min-[360px]:gap-1 sm:gap-2'
                  onMouseLeave={() => setHoveredRating(null)}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= visibleRating;

                    return (
                      <button
                        key={star}
                        type='button'
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/20 sm:h-12 sm:w-12 ${
                          active
                            ? 'bg-amber-100 text-amber-500 shadow-sm hover:-translate-y-0.5 dark:bg-amber-500/15 dark:text-amber-300'
                            : 'text-slate-300 hover:bg-white hover:text-amber-400 dark:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-amber-400'
                        }`}
                        aria-label={`Beri ${star} bintang`}
                        aria-pressed={rating === star}
                      >
                        <Star
                          className={`h-7 w-7 transition-transform sm:h-8 sm:w-8 ${
                            active ? 'fill-current scale-105' : 'fill-transparent'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className='space-y-2'>
              <div className='flex items-center justify-between gap-3'>
                <label
                  htmlFor='review-title'
                  className='text-sm font-extrabold text-slate-900 dark:text-slate-100'
                >
                  Judul ulasan
                </label>
                <span className='rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-600 dark:bg-violet-500/10 dark:text-violet-300'>
                  Opsional
                </span>
              </div>

              <input
                id='review-title'
                className='h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-950 shadow-sm outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-500 dark:focus:bg-slate-900'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Contoh: Nyaman dan sesuai deskripsi'
                maxLength={120}
                autoComplete='off'
              />

              <div className='flex items-center justify-between gap-3'>
                <p className='text-[11px] font-medium text-slate-500 dark:text-slate-400'>
                  Buat judul singkat yang mewakili pengalaman Anda.
                </p>
                <span
                  className={`text-[11px] font-bold ${
                    title.length >= 110
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {title.length}/120
                </span>
              </div>
            </section>

            <section className='space-y-2'>
              <div className='flex items-center justify-between gap-3'>
                <label
                  htmlFor='review-content'
                  className='text-sm font-extrabold text-slate-900 dark:text-slate-100'
                >
                  Ceritakan pengalaman Anda
                </label>
                <span className='rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300'>
                  Opsional
                </span>
              </div>

              <textarea
                id='review-content'
                className='min-h-32 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium leading-6 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:bg-slate-900'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='Ceritakan kualitas produk, ukuran, warna, kemasan, dan pengalaman penggunaan.'
                rows={5}
                maxLength={1000}
              />

              <div className='flex items-center justify-between gap-4'>
                <span className='text-[11px] font-medium text-slate-500 dark:text-slate-400'>
                  Gunakan bahasa yang jujur, jelas, dan relevan.
                </span>
                <span
                  className={`shrink-0 text-[11px] font-bold ${
                    content.length >= 950
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {content.length}/1000
                </span>
              </div>
            </section>

            <div className='flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 dark:border-emerald-900/70 dark:bg-emerald-500/10'>
              <span className='mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'>
                <ShieldCheck className='h-4 w-4' />
              </span>
              <div>
                <p className='text-xs font-extrabold text-emerald-900 dark:text-emerald-200'>
                  Ulasan pembelian terverifikasi
                </p>
                <p className='mt-0.5 text-[11px] font-medium leading-5 text-emerald-700 dark:text-emerald-300/90'>
                  Ulasan akan membantu pelanggan lain memahami kualitas produk secara lebih akurat.
                </p>
              </div>
            </div>
          </div>

          <div className='shrink-0 border-t border-slate-200/80 bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 sm:px-7 sm:pb-5 sm:pt-4'>
            <div className='grid grid-cols-[0.82fr_1.4fr] gap-2.5 sm:flex sm:justify-end'>
              <Button
                variant='outline'
                type='button'
                onClick={onClose}
                className='h-12 rounded-2xl border-slate-300 bg-white px-4 text-sm font-extrabold text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:min-w-28'
                disabled={isSubmitting}
              >
                Batal
              </Button>

              <Button
                type='submit'
                disabled={isSubmitting}
                className='h-12 gap-2 rounded-2xl border-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-5 text-sm font-extrabold text-white shadow-[0_14px_28px_-14px_rgba(109,40,217,0.9)] transition hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 hover:text-white active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-65 sm:min-w-48'
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
                      {review ? 'Simpan perubahan' : 'Kirim ulasan'}
                    </>
                  )}
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
