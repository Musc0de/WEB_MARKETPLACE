import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@starsuperscare/ui';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Download,
  MapPin,
  Package,
  Phone,
  RefreshCcw,
  ShoppingCart,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import { toast } from '@starsuperscare/ui';

// ─── helpers ────────────────────────────────────────────────────────────────

const fetchOrderDetail = async (id: string) => {
  const res = await client.v1.orders[':id'].$get({ param: { id } });
  if (res.ok) return (await res.json()).data;
  throw new Error('Failed to fetch');
};

const fmt = (n: number) => `Rp\u00a0${n.toLocaleString('id-ID')}`;

const STATUS_CONFIG: Record<string, { style: string; dot: string; label: string }> = {
  pending: {
    style: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    dot: 'bg-amber-500',
    label: 'Menunggu Pembayaran',
  },
  paid: {
    style: 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
    dot: 'bg-blue-500',
    label: 'Dibayar',
  },
  processing: {
    style: 'text-sky-700 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
    dot: 'bg-sky-500',
    label: 'Diproses',
  },
  shipped: {
    style: 'text-indigo-700 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    dot: 'bg-indigo-500',
    label: 'Dikirim',
  },
  delivered: {
    style: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-500',
    label: 'Selesai',
  },
  cancelled: {
    style: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    dot: 'bg-rose-500',
    label: 'Dibatalkan',
  },
  refunded: {
    style: 'text-purple-700 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
    dot: 'bg-purple-500',
    label: 'Dikembalikan',
  },
  cancellation_requested: {
    style: 'text-orange-700 dark:text-orange-400 bg-orange-500/10 border-orange-500/20',
    dot: 'bg-orange-500',
    label: 'Pengajuan Pembatalan',
  },
  return_requested: {
    style: 'text-orange-700 dark:text-orange-400 bg-orange-500/10 border-orange-500/20',
    dot: 'bg-orange-500',
    label: 'Pengajuan Pengembalian',
  },
  cancellation_rejected: {
    style: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    dot: 'bg-rose-500',
    label: 'Batal Ditolak',
  },
  return_rejected: {
    style: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    dot: 'bg-rose-500',
    label: 'Retur Ditolak',
  },
  refund_processed: {
    style: 'text-teal-700 dark:text-teal-400 bg-teal-500/10 border-teal-500/20',
    dot: 'bg-teal-500',
    label: 'Refund Diproses',
  },
};

const getStatusCfg = (s: string) =>
  STATUS_CONFIG[s] ??
    { style: 'text-muted-foreground bg-muted border-border', dot: 'bg-muted-foreground', label: s };

const variantLabel = (optionValues: any): string => {
  if (!optionValues) return '';
  try {
    const parsed = typeof optionValues === 'string' ? JSON.parse(optionValues) : optionValues;
    if (Array.isArray(parsed)) return parsed.map((v: any) => v.value ?? v).join(' · ');
    return Object.values(parsed).join(' · ');
  } catch {
    return String(optionValues);
  }
};

const timelineIcon = (status: string) => {
  if (status === 'delivered') {
    return <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />;
  }
  if (status === 'shipped') {
    return <Truck className='w-4 h-4 text-indigo-600 dark:text-indigo-400' />;
  }
  if (
    status === 'cancelled' || status === 'refunded' || status === 'cancellation_requested' ||
    status === 'return_rejected' || status === 'cancellation_rejected'
  ) {
    return <XCircle className='w-4 h-4 text-rose-500 dark:text-rose-400' />;
  }
  if (status === 'return_requested' || status === 'refund_processed') {
    return <RefreshCcw className='w-4 h-4 text-purple-600 dark:text-purple-400' />;
  }
  return <Clock className='w-4 h-4 text-blue-500 dark:text-blue-400' />;
};

const timelineDotColor = (status: string) => {
  if (status === 'delivered') return 'border-emerald-500/40 bg-emerald-500/10';
  if (status === 'shipped') return 'border-indigo-500/40 bg-indigo-500/10';
  if (
    status === 'cancelled' || status === 'refunded' || status === 'cancellation_requested' ||
    status === 'return_rejected' || status === 'cancellation_rejected'
  ) return 'border-rose-500/40 bg-rose-500/10';
  if (status === 'return_requested' || status === 'refund_processed') {
    return 'border-purple-500/40 bg-purple-500/10';
  }
  return 'border-blue-500/40 bg-blue-500/10';
};

// ─── component ──────────────────────────────────────────────────────────────

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBuyingAgain, setIsBuyingAgain] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  const { data, error, isLoading } = useSWR(
    id ? ['/api/orders', id] : null,
    ([, orderId]) => fetchOrderDetail(orderId),
  );

  const { data: eligibilityData } = useSWR(
    id ? ['/api/orders', id, 'resolution-eligibility'] : null,
    async ([, orderId]) => {
      const res = await client.v1.orders[':id']['resolution-eligibility'].$get({
        param: { id: orderId },
      });
      if (res.ok) return (await res.json()).data;
      return null;
    },
  );

  const handleBuyAgain = async () => {
    if (!id) return;
    setIsBuyingAgain(true);
    try {
      const res = await client.v1.orders[':id']['buy-again'].$post({ param: { id } });
      if (res.ok) {
        const result = await res.json();
        if ((result.data.outOfStockItems?.length ?? 0) > 0) {
          toast.warning(`Item habis: ${result.data.outOfStockItems.join(', ')}`);
        }
        if (result.data.addedCount > 0) toast.success('Item ditambahkan ke keranjang!');
        else toast.error('Tidak ada item yang bisa dibeli lagi.');
      } else {
        toast.error('Gagal memproses beli lagi.');
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setIsBuyingAgain(false);
    }
  };

  /**
   * Flow invoice:
   * 1. Hapus invoice lama (DELETE) agar bisa generate ulang
   * 2. Generate baru (GET) dengan clientTime dari browser untuk format waktu Indonesia 24 jam
   * 3. Buka PDF di tab baru
   */
  const handleInvoice = async () => {
    if (!id || isGeneratingInvoice) return;
    setIsGeneratingInvoice(true);
    try {
      // Step 1: Hapus invoice lama (Gunakan RPC Client agar auth cookie/token ikut terkirim)
      await client.v1.orders[':id'].invoice.$delete({ param: { id } });

      // Step 2: clientTime dari browser — format ISO dengan timezone offset lokal
      // API akan konversi ke format Indonesia 24 jam (WIB/WITA/WIT auto)
      const clientTime = new Date().toISOString();

      // Step 3: Generate baru + redirect ke PDF
      const invoiceUrl = `/api/v1/orders/${id}/invoice?clientTime=${
        encodeURIComponent(clientTime)
      }`;
      globalThis.open(invoiceUrl, '_blank');
    } catch {
      toast.error('Gagal membuat invoice. Coba lagi.');
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className='max-w-5xl mx-auto space-y-5 animate-pulse pb-10'>
        <div className='h-8 w-52 bg-muted rounded-xl' />
        <div className='h-4 w-80 bg-muted rounded-xl' />
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4'>
          <div className='lg:col-span-2 space-y-5'>
            <div className='h-56 bg-muted rounded-2xl' />
            <div className='h-44 bg-muted rounded-2xl' />
          </div>
          <div className='space-y-5'>
            <div className='h-52 bg-muted rounded-2xl' />
            <div className='h-44 bg-muted rounded-2xl' />
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !data) {
    return (
      <div className='text-center py-24 max-w-sm mx-auto bg-card rounded-3xl border border-border/60 shadow-sm mt-10'>
        <div className='w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-5'>
          <Package className='w-8 h-8 text-rose-500/60' />
        </div>
        <p className='text-lg font-bold text-foreground mb-1'>Pesanan Tidak Ditemukan</p>
        <p className='text-sm text-muted-foreground mb-6'>
          Pesanan yang Anda cari tidak tersedia atau mungkin sudah dihapus.
        </p>
        <button
          type='button'
          onClick={() => navigate('/orders')}
          className='inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-full border-2 border-border text-foreground hover:bg-muted transition active:scale-95'
        >
          <ArrowLeft className='w-4 h-4' />
          Kembali ke Pesanan
        </button>
      </div>
    );
  }

  const { order, items, addresses } = data;
  const history = [...(data.history || [])].sort((a: any, b: any) => {
    const tA = new Date(a.createdAt).getTime();
    const tB = new Date(b.createdAt).getTime();
    if (tA !== tB) return tB - tA;
    const w: Record<string, number> = {
      pending: 1,
      paid: 2,
      processing: 3,
      shipped: 4,
      delivered: 5,
      cancelled: 6,
      refunded: 7,
    };
    return (w[b.status] || 0) - (w[a.status] || 0);
  });
  const shipping: any = addresses?.shippingSnapshot;
  const cfg = getStatusCfg(order.status);

  const hasDiscount = order.discountAmount > 0;
  const discountPct = hasDiscount && order.subtotalAmount > 0
    ? Math.round((order.discountAmount / (order.subtotalAmount + order.discountAmount)) * 100)
    : 0;

  return (
    <div className='space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700'>
      {/* ══════════ Header ══════════ */}
      <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
        <div className='flex items-start gap-3'>
          <button
            type='button'
            onClick={() => navigate('/orders')}
            className='mt-0.5 p-2 rounded-xl border border-border bg-card hover:bg-muted active:scale-95 transition shrink-0 shadow-sm'
          >
            <ArrowLeft className='w-4 h-4 text-foreground' />
          </button>
          <div>
            <div className='flex items-center gap-2.5 flex-wrap'>
              <h2 className='text-lg font-black text-foreground'>{order.orderNumber}</h2>
              <Badge
                variant='outline'
                className={`${cfg.style} border rounded-full px-3 py-0.5 text-xs font-bold tracking-wider uppercase`}
              >
                {cfg.label}
              </Badge>
            </div>
            <p className='text-xs font-medium text-muted-foreground mt-1 flex items-center gap-1.5'>
              <Clock className='w-3.5 h-3.5' />
              Dibuat {new Date(order.createdAt).toLocaleString('id-ID', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-wrap sm:flex-nowrap items-center gap-2 pl-12 sm:pl-0 shrink-0 w-full sm:w-auto'>
          <button
            type='button'
            onClick={handleInvoice}
            disabled={isGeneratingInvoice}
            className='flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-full border-2 border-border text-foreground bg-card hover:bg-muted active:scale-95 transition disabled:opacity-60 shadow-sm'
          >
            {isGeneratingInvoice
              ? <RefreshCcw className='w-3.5 h-3.5 animate-spin' />
              : <Download className='w-3.5 h-3.5' />}
            {isGeneratingInvoice ? 'Membuat...' : 'Invoice'}
          </button>
          <button
            type='button'
            onClick={handleBuyAgain}
            disabled={isBuyingAgain}
            className='flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-full bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition disabled:opacity-50 shadow-md shadow-indigo-600/20'
          >
            {isBuyingAgain
              ? <RefreshCcw className='w-3.5 h-3.5 animate-spin' />
              : <ShoppingCart className='w-3.5 h-3.5' />}
            Beli Lagi
          </button>
        </div>
      </div>

      {/* ══════════ Main Grid ══════════ */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* ── Left column ── */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Products Card */}
          <div className='bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm'>
            <div className='px-5 py-4 border-b border-border/40 flex items-center gap-2 bg-indigo-500/5'>
              <Package className='w-4 h-4 text-indigo-500' />
              <h3 className='text-sm font-bold text-foreground'>Detail Produk</h3>
              <span className='text-[11px] text-muted-foreground font-semibold'>
                ({items.length} item)
              </span>
            </div>
            <div className='divide-y divide-border/40'>
              {items.map((item: any) => {
                const label = variantLabel(item.optionValues);
                const hasItemDiscount = item.comparePrice && item.comparePrice > item.priceSnapshot;
                const lineTotal = item.quantity * item.priceSnapshot;
                const savedAmount = hasItemDiscount
                  ? item.quantity * (item.comparePrice - item.priceSnapshot)
                  : 0;

                return (
                  <div
                    key={item.id}
                    className='px-4 sm:px-5 py-5 flex flex-col sm:flex-row gap-4 hover:bg-muted/30 transition-colors'
                  >
                    <div className='flex gap-4 flex-1 min-w-0'>
                      {/* Image */}
                      <div className='w-16 h-16 sm:w-[76px] sm:h-[76px] rounded-xl overflow-hidden shrink-0 bg-muted/50 border border-border/40'>
                        {item.imageUrl
                          ? (
                            <img
                              src={item.imageUrl}
                              alt={item.productNameSnapshot}
                              loading='lazy'
                              decoding='async'
                              className='w-full h-full object-cover'
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )
                          : (
                            <div className='w-full h-full flex items-center justify-center'>
                              <Package className='w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground/50' />
                            </div>
                          )}
                      </div>

                      {/* Info */}
                      <div className='flex-1 min-w-0'>
                        <p className='font-bold text-foreground text-sm leading-snug line-clamp-2'>
                          {item.productNameSnapshot}
                        </p>
                        <p className='text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 font-mono uppercase'>
                          {item.variantSkuSnapshot}
                        </p>
                        {label && (
                          <span className='inline-block mt-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded px-2 py-0.5 font-bold uppercase tracking-wider'>
                            {label}
                          </span>
                        )}
                        <div className='mt-2.5 flex flex-wrap items-center gap-1.5 sm:gap-2'>
                          {hasItemDiscount && (
                            <span className='text-[10px] sm:text-[11px] text-muted-foreground/70 line-through tabular-nums'>
                              {fmt(item.comparePrice)}
                            </span>
                          )}
                          <span className='text-sm font-black text-indigo-600 dark:text-indigo-400 tabular-nums'>
                            {fmt(item.priceSnapshot)}
                          </span>
                          <span className='text-xs font-semibold text-muted-foreground mx-0.5'>
                            × {item.quantity}
                          </span>
                          {savedAmount > 0 && (
                            <span className='text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-0.5 uppercase tracking-wider mt-1 sm:mt-0 block sm:inline-block'>
                              Hemat {fmt(savedAmount)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className='shrink-0 sm:text-right flex flex-row sm:flex-col justify-between sm:justify-end items-end sm:items-end border-t sm:border-t-0 border-border/40 pt-3 sm:pt-0 mt-2 sm:mt-0'>
                      <span className='text-[11px] text-muted-foreground font-semibold sm:hidden'>
                        Subtotal Barang
                      </span>
                      <span className='text-sm sm:text-base font-black text-foreground tabular-nums'>
                        {fmt(lineTotal)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Help Card */}
          {eligibilityData && (
            <div className='bg-card border border-rose-500/20 rounded-3xl overflow-hidden shadow-sm'>
              <div className='px-5 py-4 border-b border-rose-500/20 flex items-center gap-2 bg-rose-500/5'>
                <Copy className='w-4 h-4 text-rose-500' />
                <h3 className='text-sm font-bold text-foreground'>
                  Butuh Bantuan dengan Pesanan Ini?
                </h3>
              </div>
              <div className='p-5 flex flex-col gap-4'>
                {/* Cancellation Section */}
                <div>
                  {eligibilityData.cancellationEligibility?.eligible
                    ? (
                      <button
                        type='button'
                        onClick={() => navigate(`/returns/new?orderId=${id}&type=cancel`)}
                        className='w-full py-2.5 rounded-full font-bold transition active:scale-95 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-xs sm:text-sm'
                      >
                        Ajukan Pembatalan
                      </button>
                    )
                    : (
                      <div className='w-full py-3 bg-muted/40 border border-border/60 rounded-xl text-center px-4'>
                        <p className='text-xs font-semibold text-muted-foreground leading-snug'>
                          {eligibilityData.cancellationEligibility?.reasonMessage ||
                            'Pesanan tidak dapat dibatalkan.'}
                        </p>
                      </div>
                    )}
                </div>

                {/* Return/Refund Section */}
                <div className='border-t border-border/40 pt-4'>
                  {eligibilityData.returnEligibility?.eligible
                    ? (
                      <button
                        type='button'
                        onClick={() => navigate(`/returns/new?orderId=${id}`)}
                        className='w-full py-2.5 rounded-full font-bold transition active:scale-95 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 text-xs sm:text-sm'
                      >
                        Ajukan Pengembalian Barang / Dana
                      </button>
                    )
                    : eligibilityData.returnEligibility?.reasonCode === 'active_request_exists'
                    ? (
                      <div className='flex flex-col gap-3'>
                        <div className='w-full py-3 bg-muted/40 border border-border/60 rounded-xl text-center px-4'>
                          <p className='text-xs font-semibold text-muted-foreground leading-snug'>
                            {eligibilityData.returnEligibility?.reasonMessage ||
                              'Terdapat riwayat pengajuan pengembalian.'}
                          </p>
                        </div>
                        <button
                          type='button'
                          onClick={() => navigate(`/returns`)}
                          className='w-full py-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-full text-xs font-bold transition active:scale-95'
                        >
                          Lihat Status Pengembalian
                        </button>
                      </div>
                    )
                    : (
                      <div className='w-full py-3 bg-muted/40 border border-border/60 rounded-xl text-center px-4'>
                        <p className='text-xs font-semibold text-muted-foreground leading-snug'>
                          {eligibilityData.returnEligibility?.reasonMessage ||
                            'Tidak tersedia untuk status saat ini.'}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* Timeline Card */}
          <div className='bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm'>
            <div className='px-5 py-4 border-b border-border/40 flex items-center gap-2 bg-indigo-500/5'>
              <Truck className='w-4 h-4 text-indigo-500' />
              <h3 className='text-sm font-bold text-foreground'>Lacak Pesanan</h3>
            </div>
            <div className='px-5 py-6'>
              <div className='space-y-0'>
                {history.map((event: any, idx: number) => {
                  const isLast = idx === history.length - 1;
                  const evtCfg = getStatusCfg(event.status);
                  return (
                    <div key={event.id} className='flex gap-4'>
                      {/* dot + line */}
                      <div className='flex flex-col items-center pt-0.5'>
                        <div
                          className={`w-8 h-8 rounded-full border-2 ${
                            timelineDotColor(event.status)
                          } flex items-center justify-center shrink-0 shadow-sm`}
                        >
                          {timelineIcon(event.status)}
                        </div>
                        {!isLast && <div className='w-px flex-1 bg-border/60 my-2 min-h-[24px]' />}
                      </div>
                      {/* content */}
                      <div className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <Badge
                            variant='outline'
                            className={`${evtCfg.style} border rounded-full px-2 py-0 text-[10px] font-bold uppercase tracking-wider`}
                          >
                            {evtCfg.label}
                          </Badge>
                          <span className='text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5'>
                            <Clock className='w-3 h-3' />
                            {new Date(event.createdAt).toLocaleString('id-ID', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>
                        {event.note && event.note.startsWith('[TRACKING]')
                          ? (
                            (() => {
                              const infoStr = event.note.replace('[TRACKING]', '').trim();
                              const parts = infoStr.split('|').map((s: string) => s.trim());
                              const kurirPart = parts.find((p: string) =>
                                p.startsWith('Kurir:')
                              )
                                ?.replace('Kurir:', '').trim();
                              const resiPart = parts.find((p: string) => p.startsWith('Resi:'))
                                ?.replace('Resi:', '').trim();

                              return (
                                <div className='mt-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 flex items-center justify-between gap-3'>
                                  <div className='flex flex-col'>
                                    <span className='text-[10px] text-indigo-600/80 dark:text-indigo-400/80 font-bold uppercase tracking-widest mb-1'>
                                      Informasi Pengiriman
                                    </span>
                                    <span className='text-sm sm:text-base text-indigo-700 dark:text-indigo-300 font-black'>
                                      {kurirPart}{' '}
                                      <span className='text-indigo-500/40 font-normal mx-1.5'>
                                        •
                                      </span>{' '}
                                      {resiPart}
                                    </span>
                                  </div>
                                  {resiPart && resiPart !== 'N/A' && (
                                    <button
                                      type='button'
                                      onClick={() => {
                                        navigator.clipboard.writeText(resiPart);
                                        toast.success('Nomor resi berhasil disalin!');
                                      }}
                                      className='p-2.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-card shadow-sm hover:shadow-md border border-indigo-500/20 rounded-xl transition-all active:scale-95'
                                      title='Salin Resi'
                                    >
                                      <Copy className='w-4 h-4' />
                                    </button>
                                  )}
                                </div>
                              );
                            })()
                          )
                          : event.note
                          ? (
                            <p className='mt-2 text-xs sm:text-sm font-medium text-muted-foreground bg-muted/40 border border-border/40 rounded-xl px-4 py-3 leading-relaxed'>
                              {event.note}
                            </p>
                          )
                          : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className='space-y-6'>
          {/* Payment Summary Card */}
          <div className='bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm'>
            <div className='px-5 py-4 border-b border-border/40 flex items-center gap-2 bg-emerald-500/5'>
              <CreditCard className='w-4 h-4 text-emerald-500' />
              <h3 className='text-sm font-bold text-foreground'>Rincian Pembayaran</h3>
            </div>
            <div className='px-5 py-5 space-y-3.5'>
              {/* Subtotal */}
              <div className='flex justify-between items-center text-sm'>
                <span className='text-muted-foreground font-medium'>Subtotal produk</span>
                <span className='text-foreground font-semibold tabular-nums'>
                  {fmt(order.subtotalAmount)}
                </span>
              </div>

              {/* Discount */}
              {hasDiscount && (
                <div className='flex justify-between items-center text-sm'>
                  <span className='flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold'>
                    Diskon produk
                    {discountPct > 0 && (
                      <span className='text-[10px] bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-0.5 font-black tracking-wider uppercase'>
                        -{discountPct}%
                      </span>
                    )}
                  </span>
                  <span className='text-emerald-600 dark:text-emerald-400 font-bold tabular-nums'>
                    − {fmt(order.discountAmount)}
                  </span>
                </div>
              )}

              {/* Shipping */}
              <div className='flex justify-between items-center text-sm'>
                <span className='text-muted-foreground font-medium'>Ongkos kirim</span>
                <span className='text-foreground font-semibold tabular-nums'>
                  {fmt(order.shippingAmount)}
                </span>
              </div>

              {/* Tax */}
              {((order as any).taxAmount || 0) > 0 && (
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-muted-foreground font-medium'>Pajak</span>
                  <span className='text-foreground font-semibold tabular-nums'>
                    {fmt((order as any).taxAmount)}
                  </span>
                </div>
              )}

              {/* Total */}
              <div className='pt-4 mt-3 border-t-2 border-dashed border-border/60'>
                <div className='flex justify-between items-center'>
                  <span className='font-black text-foreground text-sm uppercase tracking-widest'>
                    Total Belanja
                  </span>
                  <span className='font-black text-xl text-indigo-600 dark:text-indigo-400 tabular-nums'>
                    {fmt(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Payment Details */}
              {(() => {
                const isPaid = ['paid', 'processing', 'shipped', 'delivered'].includes(
                  order.status,
                );
                const paidAmount = isPaid ? order.totalAmount : 0;
                const remaining = order.totalAmount - paidAmount;

                return (
                  <div className='pt-3 space-y-2 border-t border-border/40 mt-1'>
                    <div className='flex justify-between text-[13px] font-bold'>
                      <span className='text-muted-foreground'>Jumlah dibayar</span>
                      <span className='text-emerald-600 dark:text-emerald-400'>
                        {fmt(paidAmount)}
                      </span>
                    </div>
                    <div className='flex justify-between text-[13px] font-bold'>
                      <span className='text-muted-foreground'>Sisa pembayaran</span>
                      <span
                        className={remaining > 0
                          ? 'text-rose-500 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400'}
                      >
                        {fmt(remaining)}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Shipping Address Card */}
          {shipping && (
            <div className='bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm'>
              <div className='px-5 py-4 border-b border-border/40 flex items-center gap-2 bg-amber-500/5'>
                <MapPin className='w-4 h-4 text-amber-500' />
                <h3 className='text-sm font-bold text-foreground'>Alamat Pengiriman</h3>
              </div>
              <div className='px-5 py-5 space-y-4'>
                {/* Recipient */}
                <div className='flex gap-4'>
                  <div className='w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0'>
                    <User className='w-4.5 h-4.5 text-indigo-500' />
                  </div>
                  <div className='flex-1'>
                    <p className='font-black text-foreground text-sm tracking-wide'>
                      {shipping.fullName || shipping.recipientName}
                    </p>
                    <p className='text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mt-1'>
                      <Phone className='w-3 h-3' />
                      {shipping.phoneNumber || shipping.phone}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className='flex gap-4'>
                  <div className='w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5'>
                    <MapPin className='w-4.5 h-4.5 text-amber-500' />
                  </div>
                  <div className='text-[13px] text-muted-foreground font-medium leading-relaxed flex-1'>
                    <p className='font-bold text-foreground mb-1'>
                      {shipping.streetAddress || shipping.addressLine1}
                      {shipping.addressLine2 ? `, ${shipping.addressLine2}` : ''}
                    </p>
                    <p>{shipping.district ? `${shipping.district}, ` : ''}{shipping.city}</p>
                    <p className='text-muted-foreground/70 text-[11px] font-bold mt-1 uppercase tracking-wider'>
                      {shipping.province} {shipping.postalCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
