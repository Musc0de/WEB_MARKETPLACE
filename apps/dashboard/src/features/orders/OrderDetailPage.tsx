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
    style: 'text-amber-700 bg-amber-50 border-amber-200',
    dot: 'bg-amber-500',
    label: 'Menunggu Pembayaran',
  },
  paid: {
    style: 'text-blue-700 bg-blue-50 border-blue-200',
    dot: 'bg-blue-500',
    label: 'Dibayar',
  },
  processing: {
    style: 'text-sky-700 bg-sky-50 border-sky-200',
    dot: 'bg-sky-500',
    label: 'Diproses',
  },
  shipped: {
    style: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    dot: 'bg-indigo-500',
    label: 'Dikirim',
  },
  delivered: {
    style: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Selesai',
  },
  cancelled: {
    style: 'text-red-700 bg-red-50 border-red-200',
    dot: 'bg-red-500',
    label: 'Dibatalkan',
  },
  refunded: {
    style: 'text-rose-700 bg-rose-50 border-rose-200',
    dot: 'bg-rose-500',
    label: 'Dikembalikan',
  },
  cancellation_requested: {
    style: 'text-orange-700 bg-orange-50 border-orange-200',
    dot: 'bg-orange-500',
    label: 'Pengajuan Pembatalan',
  },
  return_requested: {
    style: 'text-purple-700 bg-purple-50 border-purple-200',
    dot: 'bg-purple-500',
    label: 'Pengajuan Pengembalian',
  },
  cancellation_rejected: {
    style: 'text-red-700 bg-red-50 border-red-200',
    dot: 'bg-red-500',
    label: 'Batal Ditolak',
  },
  return_rejected: {
    style: 'text-red-700 bg-red-50 border-red-200',
    dot: 'bg-red-500',
    label: 'Retur Ditolak',
  },
  refund_processed: {
    style: 'text-teal-700 bg-teal-50 border-teal-200',
    dot: 'bg-teal-500',
    label: 'Refund Diproses',
  },
};

const getStatusCfg = (s: string) =>
  STATUS_CONFIG[s] ??
    { style: 'text-gray-700 bg-gray-50 border-gray-200', dot: 'bg-gray-400', label: s };

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
  if (status === 'delivered') return <CheckCircle2 className='w-4 h-4 text-emerald-600' />;
  if (status === 'shipped') return <Truck className='w-4 h-4 text-indigo-600' />;
  if (
    status === 'cancelled' || status === 'refunded' || status === 'cancellation_requested' ||
    status === 'return_rejected' || status === 'cancellation_rejected'
  ) {
    return <XCircle className='w-4 h-4 text-red-500' />;
  }
  if (status === 'return_requested' || status === 'refund_processed') {
    return <RefreshCcw className='w-4 h-4 text-purple-600' />;
  }
  return <Clock className='w-4 h-4 text-blue-500' />;
};

const timelineDotColor = (status: string) => {
  if (status === 'delivered') return 'border-emerald-400 bg-emerald-50';
  if (status === 'shipped') return 'border-indigo-400 bg-indigo-50';
  if (
    status === 'cancelled' || status === 'refunded' || status === 'cancellation_requested' ||
    status === 'return_rejected' || status === 'cancellation_rejected'
  ) return 'border-red-400 bg-red-50';
  if (status === 'return_requested' || status === 'refund_processed') {
    return 'border-purple-400 bg-purple-50';
  }
  return 'border-blue-400 bg-blue-50';
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
        <div className='h-8 w-52 bg-gray-100 rounded-xl' />
        <div className='h-4 w-80 bg-gray-100 rounded-xl' />
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4'>
          <div className='lg:col-span-2 space-y-5'>
            <div className='h-56 bg-gray-100 rounded-2xl' />
            <div className='h-44 bg-gray-100 rounded-2xl' />
          </div>
          <div className='space-y-5'>
            <div className='h-52 bg-gray-100 rounded-2xl' />
            <div className='h-44 bg-gray-100 rounded-2xl' />
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !data) {
    return (
      <div className='text-center py-24 max-w-sm mx-auto'>
        <div className='w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5'>
          <Package className='w-8 h-8 text-red-300' />
        </div>
        <p className='text-base font-bold text-gray-800 mb-1'>Pesanan Tidak Ditemukan</p>
        <p className='text-sm text-gray-400 mb-6'>Pesanan yang Anda cari tidak tersedia.</p>
        <button
          type='button'
          onClick={() => navigate('/orders')}
          className='inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition'
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
    <div className='space-y-6 max-w-5xl mx-auto pb-10'>
      {/* ══════════ Header ══════════ */}
      <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
        <div className='flex items-start gap-3'>
          <button
            type='button'
            onClick={() => navigate('/orders')}
            className='mt-0.5 p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 transition shrink-0'
          >
            <ArrowLeft className='w-4 h-4 text-gray-600' />
          </button>
          <div>
            <div className='flex items-center gap-2.5 flex-wrap'>
              <h2 className='text-lg font-bold text-gray-900'>{order.orderNumber}</h2>
              <Badge
                variant='outline'
                className={`${cfg.style} border rounded-full px-3 py-0.5 text-xs font-bold`}
              >
                {cfg.label}
              </Badge>
            </div>
            <p className='text-xs text-gray-400 mt-1 flex items-center gap-1.5'>
              <Clock className='w-3 h-3' />
              Dibuat {new Date(order.createdAt).toLocaleString('id-ID', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-2 pl-11 sm:pl-0 shrink-0'>
          <button
            type='button'
            onClick={handleInvoice}
            disabled={isGeneratingInvoice}
            className='inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border-2 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition disabled:opacity-60'
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
            className='inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-orange-500 text-white hover:bg-orange-600 active:scale-95 transition disabled:opacity-50 shadow-sm shadow-orange-200'
          >
            {isBuyingAgain
              ? <RefreshCcw className='w-3.5 h-3.5 animate-spin' />
              : <ShoppingCart className='w-3.5 h-3.5' />}
            Beli Lagi
          </button>
        </div>
      </div>

      {/* ══════════ Main Grid ══════════ */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
        {/* ── Left column ── */}
        <div className='lg:col-span-2 space-y-5'>
          {/* Products Card */}
          <div className='bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm'>
            <div className='px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-orange-50/50 to-transparent'>
              <Package className='w-4 h-4 text-orange-500' />
              <h3 className='text-sm font-bold text-gray-900'>Detail Produk</h3>
              <span className='text-xs text-gray-400 font-normal'>({items.length} item)</span>
            </div>
            <div className='divide-y divide-gray-100'>
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
                    className='px-5 py-4 flex gap-4 hover:bg-gray-50/50 transition-colors'
                  >
                    {/* Image */}
                    <div className='w-[76px] h-[76px] rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-200'>
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
                            <Package className='w-7 h-7 text-gray-300' />
                          </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold text-gray-900 text-sm leading-snug line-clamp-2'>
                        {item.productNameSnapshot}
                      </p>
                      <p className='text-[11px] text-gray-400 mt-0.5 font-mono'>
                        {item.variantSkuSnapshot}
                      </p>
                      {label && (
                        <span className='inline-block mt-1 text-[11px] text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 font-medium'>
                          {label}
                        </span>
                      )}
                      <div className='mt-2 flex items-center gap-2'>
                        {hasItemDiscount && (
                          <span className='text-[11px] text-gray-400 line-through tabular-nums'>
                            {fmt(item.comparePrice)}
                          </span>
                        )}
                        <span className='text-sm font-bold text-orange-600 tabular-nums'>
                          {fmt(item.priceSnapshot)}
                        </span>
                        <span className='text-xs text-gray-400'>× {item.quantity}</span>
                        {savedAmount > 0 && (
                          <span className='text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5'>
                            Hemat {fmt(savedAmount)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Line total */}
                    <div className='shrink-0 text-right flex flex-col justify-end'>
                      <span className='text-sm font-bold text-gray-900 tabular-nums'>
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
            <div className='bg-white border border-rose-100 rounded-2xl overflow-hidden shadow-sm'>
              <div className='px-5 py-4 border-b border-rose-100 flex items-center gap-2 bg-gradient-to-r from-rose-50/50 to-transparent'>
                <Copy className='w-4 h-4 text-rose-500' />
                <h3 className='text-sm font-bold text-gray-900'>
                  Butuh Bantuan dengan Pesanan Ini?
                </h3>
              </div>
              <div className='p-5 flex flex-col gap-4'>
                {/* Cancellation Section */}
                {/* Cancellation Section */}
                <div>
                  {eligibilityData.cancellationEligibility?.eligible
                    ? (
                      <button
                        type='button'
                        onClick={() => navigate(`/returns/new?orderId=${id}&type=cancel`)}
                        className='w-full py-2.5 rounded-xl font-bold transition active:scale-95 bg-rose-50 text-rose-600 hover:bg-rose-100'
                      >
                        Ajukan Pembatalan
                      </button>
                    )
                    : (
                      <div className='w-full py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-center px-4'>
                        <p className='text-xs font-medium text-gray-500 leading-snug'>
                          {eligibilityData.cancellationEligibility?.reasonMessage ||
                            'Pesanan tidak dapat dibatalkan.'}
                        </p>
                      </div>
                    )}
                </div>

                {/* Return/Refund Section */}
                <div className='border-t border-gray-100 pt-4'>
                  {eligibilityData.returnEligibility?.eligible
                    ? (
                      <button
                        type='button'
                        onClick={() => navigate(`/returns/new?orderId=${id}`)}
                        className='w-full py-2.5 rounded-xl font-bold transition active:scale-95 bg-orange-50 text-orange-600 hover:bg-orange-100'
                      >
                        Ajukan Pengembalian Barang / Dana
                      </button>
                    )
                    : eligibilityData.returnEligibility?.reasonCode === 'active_request_exists'
                    ? (
                      <div className='flex flex-col gap-2'>
                        <div className='w-full py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-center px-4'>
                          <p className='text-xs font-medium text-gray-500 leading-snug'>
                            {eligibilityData.returnEligibility?.reasonMessage ||
                              'Terdapat riwayat pengajuan pengembalian.'}
                          </p>
                        </div>
                        <button
                          type='button'
                          onClick={() => navigate(`/returns`)}
                          className='w-full py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-bold transition active:scale-95'
                        >
                          Lihat Status Pengembalian
                        </button>
                      </div>
                    )
                    : (
                      <div className='w-full py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-center px-4'>
                        <p className='text-xs font-medium text-gray-500 leading-snug'>
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
          <div className='bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm'>
            <div className='px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-indigo-50/50 to-transparent'>
              <Truck className='w-4 h-4 text-indigo-500' />
              <h3 className='text-sm font-bold text-gray-900'>Lacak Pesanan</h3>
            </div>
            <div className='px-5 py-5'>
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
                          } flex items-center justify-center shrink-0`}
                        >
                          {timelineIcon(event.status)}
                        </div>
                        {!isLast && <div className='w-px flex-1 bg-gray-100 my-1.5 min-h-[20px]' />}
                      </div>
                      {/* content */}
                      <div className={`flex-1 pb-5 ${isLast ? 'pb-0' : ''}`}>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <Badge
                            variant='outline'
                            className={`${evtCfg.style} border rounded-full px-2 py-0 text-[11px] font-bold`}
                          >
                            {evtCfg.label}
                          </Badge>
                          <span className='text-[11px] text-gray-400 flex items-center gap-1'>
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
                              const kurirPart = parts.find((p: string) => p.startsWith('Kurir:'))
                                ?.replace('Kurir:', '').trim();
                              const resiPart = parts.find((p: string) => p.startsWith('Resi:'))
                                ?.replace('Resi:', '').trim();

                              return (
                                <div className='mt-2 bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 flex items-center justify-between gap-3'>
                                  <div className='flex flex-col'>
                                    <span className='text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-0.5'>
                                      Informasi Pengiriman
                                    </span>
                                    <span className='text-sm text-indigo-900 font-semibold'>
                                      {kurirPart}{' '}
                                      <span className='text-indigo-300 font-normal mx-1'>•</span>
                                      {' '}
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
                                      className='p-2 text-indigo-600 hover:text-indigo-700 bg-white shadow-sm hover:shadow border border-indigo-100 rounded-lg transition-all active:scale-95'
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
                            <p className='mt-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2'>
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
        <div className='space-y-5'>
          {/* Payment Summary Card */}
          <div className='bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm'>
            <div className='px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-blue-50/50 to-transparent'>
              <CreditCard className='w-4 h-4 text-blue-500' />
              <h3 className='text-sm font-bold text-gray-900'>Rincian Pembayaran</h3>
            </div>
            <div className='px-5 py-4 space-y-3'>
              {/* Subtotal */}
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>Subtotal harga normal</span>
                <span className='text-gray-800 font-medium tabular-nums'>
                  {fmt(order.subtotalAmount)}
                </span>
              </div>

              {/* Discount */}
              {hasDiscount && (
                <div className='flex justify-between items-center text-sm'>
                  <span className='flex items-center gap-1.5 text-emerald-600 font-medium'>
                    Diskon produk
                    {discountPct > 0 && (
                      <span className='text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-200 rounded px-1.5 py-0.5 font-bold'>
                        -{discountPct}%
                      </span>
                    )}
                  </span>
                  <span className='text-emerald-600 font-medium tabular-nums'>
                    − {fmt(order.discountAmount)}
                  </span>
                </div>
              )}

              {/* Shipping */}
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>Ongkos kirim</span>
                <span className='text-gray-800 font-medium tabular-nums'>
                  {fmt(order.shippingAmount)}
                </span>
              </div>

              {/* Tax */}
              {order.taxAmount > 0 && (
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-500'>Pajak</span>
                  <span className='text-gray-800 font-medium tabular-nums'>
                    {fmt(order.taxAmount)}
                  </span>
                </div>
              )}

              {/* Total */}
              <div className='pt-3 mt-2 border-t-2 border-dashed border-gray-100'>
                <div className='flex justify-between items-center'>
                  <span className='font-bold text-gray-900 text-sm'>Total</span>
                  <span className='font-bold text-lg text-orange-600 tabular-nums'>
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
                  <div className='pt-2 space-y-2 border-t border-gray-100'>
                    <div className='flex justify-between text-sm font-semibold'>
                      <span className='text-gray-700'>Jumlah dibayar</span>
                      <span className='text-emerald-600'>{fmt(paidAmount)}</span>
                    </div>
                    <div className='flex justify-between text-sm font-semibold'>
                      <span className='text-gray-700'>Sisa pembayaran</span>
                      <span className={remaining > 0 ? 'text-red-500' : 'text-emerald-600'}>
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
            <div className='bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm'>
              <div className='px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-emerald-50/50 to-transparent'>
                <MapPin className='w-4 h-4 text-emerald-500' />
                <h3 className='text-sm font-bold text-gray-900'>Alamat Pengiriman</h3>
              </div>
              <div className='px-5 py-4 space-y-4'>
                {/* Recipient */}
                <div className='flex gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0'>
                    <User className='w-4 h-4 text-orange-400' />
                  </div>
                  <div>
                    <p className='font-bold text-gray-900 text-sm'>
                      {shipping.fullName || shipping.recipientName}
                    </p>
                    <p className='text-xs text-gray-400 flex items-center gap-1 mt-0.5'>
                      <Phone className='w-3 h-3' />
                      {shipping.phoneNumber || shipping.phone}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className='flex gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5'>
                    <MapPin className='w-4 h-4 text-emerald-400' />
                  </div>
                  <div className='text-sm text-gray-600 leading-relaxed'>
                    <p className='font-medium text-gray-800'>
                      {shipping.streetAddress || shipping.addressLine1}
                      {shipping.addressLine2 ? `, ${shipping.addressLine2}` : ''}
                    </p>
                    <p>{shipping.district ? `${shipping.district}, ` : ''}{shipping.city}</p>
                    <p className='text-gray-400 text-xs mt-0.5'>
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
