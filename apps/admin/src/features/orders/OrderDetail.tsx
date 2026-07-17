import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api.ts';
import { formatDate, formatIDR } from '@starsuperscare/ui';
import { toast } from '@starsuperscare/ui';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShoppingBag,
  Truck,
  User,
  XCircle,
} from 'lucide-react';

// ─── Shared status config (mirrors OrdersList) ──────────────────────────────
const STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  paid: { label: 'Paid', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  processing: { label: 'Processing', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
  shipped: { label: 'Shipped', bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400' },
  delivered: { label: 'Delivered', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
  refunded: { label: 'Refunded', bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
};

// ─── Sub-components ──────────────────────────────────────────────────────────
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

function StatusBadge({ status, size = 'md' }: { status: string; size?: 'sm' | 'md' | 'lg' }) {
  const cfg = STATUS_CFG[status] ??
    { label: status, bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
  const px = size === 'lg'
    ? 'px-3 py-1.5 text-sm'
    : size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${px} rounded-full font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function SectionCard(
  { title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode },
) {
  return (
    <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm'>
      <div className='flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50'>
        <span className='text-gray-400'>{icon}</span>
        <h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>{title}</h3>
      </div>
      <div className='p-5'>{children}</div>
    </div>
  );
}

// Timeline event icon mapping
function timelineIcon(status: string) {
  const cls = 'w-4 h-4';
  if (['paid', 'delivered'].includes(status)) return <CheckCircle2 className={cls} />;
  if (status === 'cancelled') return <XCircle className={cls} />;
  if (status === 'shipped') return <Truck className={cls} />;
  if (['processing', 'refunded'].includes(status)) return <RefreshCw className={cls} />;
  return <Package className={cls} />;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [newStatus, setNewStatus] = useState('');
  const [carrier, setCarrier] = useState('');
  const [tracking, setTracking] = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin', 'orders', id],
    queryFn: () => api.get(`/admin/orders/${id}`),
  });

  const updateStatus = useMutation({
    mutationFn: (status: string) => api.post(`/admin/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast.success('Status berhasil diperbarui');
      setNewStatus('');
    },
    onError: () => toast.error('Gagal memperbarui status'),
  });

  const attachShipment = useMutation({
    mutationFn: () =>
      api.post(`/admin/orders/${id}/shipments`, { carrier, trackingNumber: tracking }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders', id] });
      setCarrier('');
      setTracking('');
      toast.success('Shipment berhasil ditambahkan');
    },
    onError: () => toast.error('Gagal menambahkan shipment'),
  });

  // ── Loading / error states ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh] gap-3 text-gray-400'>
        <Loader2 className='w-5 h-5 animate-spin' />
        <span className='text-sm'>Memuat order...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-3'>
        <ShoppingBag className='w-12 h-12 text-gray-300' />
        <p className='text-gray-500 font-medium'>Order tidak ditemukan</p>
        <Link
          to='/orders'
          className='text-sm text-blue-600 hover:underline flex items-center gap-1'
        >
          <ArrowLeft className='w-4 h-4' /> Kembali ke Orders
        </Link>
      </div>
    );
  }

  const ship = order.shippingSnapshot;
  const canUpdate = ['pending', 'paid', 'processing', 'shipped'].includes(order.status);

  return (
    <div className='p-6 max-w-6xl mx-auto space-y-6'>
      {/* ── Header ── */}
      <div className='flex items-start gap-4'>
        <Link
          to='/orders'
          className='mt-1 p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-800 flex-shrink-0'
        >
          <ArrowLeft className='w-4 h-4' />
        </Link>
        <div className='flex-1 min-w-0'>
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='text-xl font-bold text-gray-900 font-mono tracking-tight'>
              {order.orderNumber}
            </h1>
            <StatusBadge status={order.status} size='lg' />
          </div>
          <p className='text-sm text-gray-400 mt-0.5 flex items-center gap-1.5'>
            <Clock className='w-3.5 h-3.5' />
            {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      {/* ── 2-column layout ── */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* ── LEFT: Order items + Timeline ── */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Order Items */}
          <SectionCard title='Order Items' icon={<ShoppingBag className='w-4 h-4' />}>
            <div className='space-y-1'>
              {order.items.map((item: any) => {
                const label = variantLabel(item.optionValues);
                const hasItemDiscount = item.comparePrice && item.comparePrice > item.priceSnapshot;
                const lineTotal = item.quantity * item.priceSnapshot;
                const savedAmount = hasItemDiscount
                  ? item.quantity * (item.comparePrice - item.priceSnapshot)
                  : 0;

                return (
                  <div
                    key={item.id}
                    className='px-5 py-4 flex gap-4 hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0'
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
                            {formatIDR(item.comparePrice)}
                          </span>
                        )}
                        <span className='text-sm font-bold text-orange-600 tabular-nums'>
                          {formatIDR(item.priceSnapshot)}
                        </span>
                        <span className='text-xs text-gray-400'>× {item.quantity}</span>
                        {savedAmount > 0 && (
                          <span className='text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5'>
                            Hemat {formatIDR(savedAmount)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Line total */}
                    <div className='shrink-0 text-right flex flex-col justify-end'>
                      <span className='text-sm font-bold text-gray-900 tabular-nums'>
                        {formatIDR(lineTotal)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Totals Breakdown */}
              <div className='pt-4 mt-2 space-y-2 bg-gray-50 rounded-lg px-4 py-4 border border-gray-100'>
                <div className='flex justify-between text-sm text-gray-500'>
                  <span>Subtotal harga normal</span>
                  <span>{formatIDR(order.subtotalAmount)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className='flex justify-between text-sm text-green-600 font-medium'>
                    <span>Diskon produk</span>
                    <span>- {formatIDR(order.discountAmount)}</span>
                  </div>
                )}
                <div className='flex justify-between text-sm text-gray-500'>
                  <span>Ongkos kirim</span>
                  <span>{formatIDR(order.shippingAmount)}</span>
                </div>
                {order.taxAmount > 0 && (
                  <div className='flex justify-between text-sm text-gray-500'>
                    <span>Pajak</span>
                    <span>{formatIDR(order.taxAmount)}</span>
                  </div>
                )}

                <div className='flex justify-between text-base font-bold pt-3 mt-3 border-t border-gray-200'>
                  <span className='text-gray-900'>Total</span>
                  <span className='text-orange-600'>{formatIDR(order.totalAmount)}</span>
                </div>

                {(() => {
                  const isPaid = ['paid', 'processing', 'shipped', 'delivered'].includes(
                    order.status,
                  );
                  const paidAmount = isPaid ? order.totalAmount : 0;
                  const remaining = order.totalAmount - paidAmount;

                  return (
                    <div className='pt-1 space-y-1.5'>
                      <div className='flex justify-between text-sm font-semibold'>
                        <span className='text-gray-700'>Jumlah dibayar</span>
                        <span className='text-green-600'>{formatIDR(paidAmount)}</span>
                      </div>
                      <div className='flex justify-between text-sm font-semibold'>
                        <span className='text-gray-700'>Sisa pembayaran</span>
                        <span className={remaining > 0 ? 'text-red-500' : 'text-green-600'}>
                          {formatIDR(remaining)}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </SectionCard>

          {/* Timeline */}
          <SectionCard title='Timeline' icon={<Clock className='w-4 h-4' />}>
            {order.history?.length > 0
              ? (
                <div className='relative pl-8'>
                  {/* Vertical line */}
                  <div className='absolute left-3.5 top-2 bottom-2 w-px bg-gray-100' />

                  <div className='space-y-6'>
                    {[...(order.history || [])].sort((a: any, b: any) => {
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
                    }).map((h: any, idx: number) => {
                      const cfg = STATUS_CFG[h.status] ??
                        {
                          bg: 'bg-gray-100',
                          text: 'text-gray-600',
                          dot: 'bg-gray-400',
                          label: h.status,
                        };
                      const isLatest = idx === order.history.length - 1;
                      return (
                        <div key={h.id} className='relative flex gap-4 items-start'>
                          {/* Icon */}
                          <div
                            className={`absolute -left-8 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isLatest ? `${cfg.bg} ${cfg.text}` : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {timelineIcon(h.status)}
                          </div>

                          {/* Content */}
                          <div
                            className={`flex-1 p-3 rounded-lg border ${
                              isLatest
                                ? 'border-blue-100 bg-blue-50/40'
                                : 'border-gray-100 bg-white'
                            }`}
                          >
                            <div className='flex items-center justify-between gap-2 flex-wrap'>
                              <StatusBadge status={h.status} size='sm' />
                              <time className='text-xs text-gray-400'>
                                {new Date(h.createdAt).toLocaleString('id-ID', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </time>
                            </div>
                            {h.note && h.note.startsWith('[TRACKING]')
                              ? (
                                (() => {
                                  const infoStr = h.note.replace('[TRACKING]', '').trim();
                                  const parts = infoStr.split('|').map((s: string) => s.trim());
                                  const kurirPart = parts.find((p: string) =>
                                    p.startsWith('Kurir:')
                                  )?.replace('Kurir:', '').trim();
                                  const resiPart = parts.find((p: string) => p.startsWith('Resi:'))
                                    ?.replace('Resi:', '').trim();

                                  return (
                                    <div className='mt-2 bg-blue-50/60 border border-blue-100 rounded-lg p-2.5 flex items-center justify-between gap-3'>
                                      <div className='flex flex-col'>
                                        <span className='text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-0.5'>
                                          Info Pengiriman
                                        </span>
                                        <span className='text-sm text-blue-900 font-semibold'>
                                          {kurirPart}{' '}
                                          <span className='text-blue-300 font-normal mx-1'>•</span>
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
                                          className='p-1.5 text-blue-600 hover:text-blue-700 bg-white shadow-sm hover:shadow border border-blue-100 rounded-md transition-all active:scale-95'
                                          title='Salin Resi'
                                        >
                                          <Copy className='w-4 h-4' />
                                        </button>
                                      )}
                                    </div>
                                  );
                                })()
                              )
                              : h.note
                              ? (
                                <p className='text-xs text-gray-500 mt-1.5 leading-relaxed'>
                                  {h.note}
                                </p>
                              )
                              : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
              : <p className='text-sm text-gray-400 text-center py-4'>Belum ada riwayat status</p>}
          </SectionCard>
        </div>

        {/* ── RIGHT: Customer + Actions + Shipments ── */}
        <div className='space-y-6'>
          {/* Customer */}
          <SectionCard title='Customer' icon={<User className='w-4 h-4' />}>
            {/* Name with avatar */}
            {ship?.fullName
              ? (
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0'>
                    <span className='text-sm font-bold text-violet-600'>
                      {ship.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('')
                        .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-gray-900'>{ship.fullName}</p>
                    {order.userId && (
                      <Link
                        to={`/customers/${order.userId}`}
                        className='text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5'
                      >
                        <ExternalLink className='w-3 h-3' />
                        Lihat Profil
                      </Link>
                    )}
                  </div>
                </div>
              )
              : (
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                    <User className='w-5 h-5 text-gray-400' />
                  </div>
                  <p className='text-sm font-medium text-gray-500 italic'>Guest</p>
                </div>
              )}

            {/* Shipping address + phone */}
            {ship
              ? (
                <div className='bg-gray-50 rounded-lg p-3 border border-gray-100'>
                  <div className='flex items-center gap-1.5 mb-2'>
                    <MapPin className='w-3.5 h-3.5 text-gray-400' />
                    <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                      Alamat Pengiriman
                    </span>
                  </div>
                  <div className='text-sm text-gray-700 leading-relaxed space-y-0.5'>
                    {ship.streetAddress && <p>{ship.streetAddress}</p>}
                    <p>{[ship.city, ship.province, ship.postalCode].filter(Boolean).join(', ')}</p>
                    {ship.country && <p>{ship.country}</p>}
                    {ship.notes && (
                      <p className='text-xs text-gray-400 italic mt-1'>Catatan: {ship.notes}</p>
                    )}
                  </div>
                  {ship.phoneNumber && (
                    <div className='mt-2 pt-2 border-t border-gray-200 flex items-center gap-1.5 text-sm text-gray-700'>
                      <Phone className='w-3.5 h-3.5 text-gray-400 flex-shrink-0' />
                      <span className='font-medium'>{ship.phoneNumber}</span>
                    </div>
                  )}
                </div>
              )
              : <p className='text-sm text-gray-400 italic'>Tidak ada alamat pengiriman</p>}
          </SectionCard>

          {/* Actions */}
          <SectionCard title='Actions' icon={<RefreshCw className='w-4 h-4' />}>
            {/* Update Status */}
            <div className='space-y-3'>
              <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Update Status
              </label>
              <div className='flex flex-wrap gap-1.5'>
                {['processing', 'shipped', 'delivered', 'cancelled'].map((s) => {
                  const cfg = STATUS_CFG[s];
                  const isCurrent = order.status === s;
                  const isSelected = newStatus === s;
                  return (
                    <button
                      key={s}
                      type='button'
                      disabled={isCurrent || !canUpdate}
                      onClick={() => setNewStatus(isSelected ? '' : s)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isSelected
                          ? `${cfg.bg} ${cfg.text} border-current ring-2 ring-offset-1 ring-current`
                          : isCurrent
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
              {newStatus === 'shipped' && (
                <div className='mt-3 space-y-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg'>
                  <label className='block text-[10px] font-bold text-blue-800 uppercase tracking-wide'>
                    Detail Pengiriman (Wajib)
                  </label>
                  <input
                    type='text'
                    placeholder='Kurir (misal: JNE, SiCepat)'
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className='w-full px-3 py-1.5 text-sm border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-gray-400'
                  />
                  <input
                    type='text'
                    placeholder='Nomor Resi'
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    className='w-full px-3 py-1.5 text-sm border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-gray-400'
                  />
                </div>
              )}

              <button
                type='button'
                disabled={!newStatus ||
                  updateStatus.isPending ||
                  attachShipment.isPending ||
                  (newStatus === 'shipped' && (!carrier || !tracking))}
                onClick={() => {
                  if (newStatus === 'shipped') {
                    attachShipment.mutate();
                  } else {
                    updateStatus.mutate(newStatus);
                  }
                }}
                className='w-full mt-2 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2'
              >
                {updateStatus.isPending || attachShipment.isPending
                  ? (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin' /> Memperbarui...
                    </>
                  )
                  : 'Terapkan Perubahan'}
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
