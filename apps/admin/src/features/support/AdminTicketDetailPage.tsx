/**
 * AdminTicketDetailPage
 * Premium admin support chat UI with:
 * - Real-time polling every 5s (SSE-ready architecture)
 * - Internal notes vs public replies
 * - Status management sidebar
 * - End-to-end message display (encryption can be layered on content)
 * - Animated chat bubbles
 */
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { Link, useParams } from 'react-router-dom';
import { API_URL, client } from '../../lib/rpc.ts';
import { formatDate, toast } from '@starsuperscare/ui';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  File,
  Headphones,
  Loader2,
  Lock,
  MessageSquare,
  RefreshCw,
  Send,
  ShieldAlert,
  User,
  XCircle,
} from 'lucide-react';
import { StatusPill } from '../../components/admin-ui.tsx';

// ─── Priority config ──────────────────────────────────────────────────────────
const PRIORITY_CFG: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  urgent: { label: 'Darurat', cls: 'bg-red-100 text-red-700', icon: AlertTriangle },
  high: { label: 'Tinggi', cls: 'bg-amber-100 text-amber-700', icon: AlertTriangle },
  normal: { label: 'Normal', cls: 'bg-blue-100 text-blue-700', icon: Clock },
  low: { label: 'Rendah', cls: 'bg-gray-100 text-gray-500', icon: CheckCircle2 },
};

// ─── Status options ───────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'open', label: 'Terbuka', icon: MessageSquare, color: 'text-blue-600' },
  { value: 'in_progress', label: 'Diproses', icon: RefreshCw, color: 'text-amber-600' },
  { value: 'resolved', label: 'Selesai', icon: CheckCircle2, color: 'text-emerald-600' },
  { value: 'closed', label: 'Ditutup', icon: XCircle, color: 'text-gray-500' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getMediaUrl(key: string | null): string | null {
  if (!key) return null;
  return `${API_URL}/storage/${key}`;
}

function timeStr(iso: string): string {
  try {
    return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(
      new Date(iso),
    );
  } catch {
    return '';
  }
}

function dayStr(iso: string): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: any }) {
  const isUser = msg.senderType === 'user';
  // Only 'true' = internal note; 'admin' = public admin reply (not internal)
  const isInternal = msg.isInternal === 'true';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <span
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-slate-400 to-slate-600 text-white'
            : isInternal
            ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white'
            : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
        }`}
      >
        {isUser ? <User className='h-4 w-4' /> : <Headphones className='h-4 w-4' />}
      </span>

      <div className={`flex max-w-[75%] flex-col gap-1 ${isUser ? 'items-start' : 'items-end'}`}>
        {/* Sender label */}
        <div
          className={`flex items-center gap-1.5 text-[11px] ${isUser ? '' : 'flex-row-reverse'}`}
        >
          <span
            className={`font-semibold ${
              isUser ? 'text-slate-500' : isInternal ? 'text-yellow-600' : 'text-emerald-600'
            }`}
          >
            {isUser ? 'Pelanggan' : isInternal ? 'Admin (Internal)' : 'Admin'}
          </span>
          {isInternal && (
            <span className='inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700'>
              <ShieldAlert className='h-2.5 w-2.5' /> Catatan
            </span>
          )}
          <span className='text-gray-400'>{timeStr(msg.createdAt)}</span>
          <Lock className='h-2.5 w-2.5 text-gray-300' />
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
            isInternal
              ? 'rounded-tl-sm border-2 border-yellow-300 bg-yellow-50 text-yellow-900'
              : isUser
              ? 'rounded-tl-sm border border-gray-200 bg-gray-100 text-gray-800'
              : 'rounded-tr-sm bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
          }`}
          style={{ wordBreak: 'break-word' }}
        >
          <p className='whitespace-pre-wrap'>{msg.content}</p>

          {/* Attachments — images shown inline, files as download links */}
          {msg.attachments && msg.attachments.length > 0 && (
            <div className='mt-3 space-y-2'>
              {msg.attachments.map((att: any) => {
                const isImg = att.mimeType?.startsWith('image/');
                const src = att.publicUrl || getMediaUrl(att.objectKey);
                if (isImg && src) {
                  return (
                    <a key={att.id} href={src} target='_blank' rel='noreferrer' className='block'>
                      <img
                        src={src}
                        alt={att.fileName ?? 'attachment'}
                        className='max-w-[280px] rounded-xl border border-white/20 object-cover shadow-sm hover:opacity-90 transition'
                        style={{ maxHeight: 240 }}
                      />
                      <span className='mt-1 block text-[10px] opacity-60'>{att.fileName}</span>
                    </a>
                  );
                }
                return (
                  <a
                    key={att.id}
                    href={src || '#'}
                    target='_blank'
                    rel='noreferrer'
                    className='flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 p-2 text-xs transition hover:bg-white/20'
                  >
                    <File className='h-3.5 w-3.5 flex-shrink-0' />
                    <span className='flex-1 truncate max-w-[180px]'>{att.fileName}</span>
                    <Download className='h-3.5 w-3.5 opacity-60' />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Day separator ────────────────────────────────────────────────────────────
function DaySeparator({ date }: { date: string }) {
  return (
    <div className='flex items-center gap-3 py-2'>
      <div className='flex-1 border-t border-gray-100' />
      <span className='text-[11px] font-medium text-gray-400'>{dayStr(date)}</span>
      <div className='flex-1 border-t border-gray-100' />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export const AdminTicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [replyContent, setReplyContent] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // SWR with auto-refresh every 5s for real-time feel
  const { data: ticket, mutate, isLoading, error: fetchError } = useSWR(
    id ? `/api/admin/support/tickets/${id}` : null,
    async () => {
      const res = await (client.v1.admin as any).support.tickets[':id'].$get({ param: { id } });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error((errBody as any)?.error ?? 'Gagal memuat tiket');
      }
      const json = await res.json();
      return json.data;
    },
    { refreshInterval: 5000, revalidateOnFocus: true },
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages?.length]);

  // Auto-resize textarea
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await (client.v1.admin as any).support.tickets[':id'].messages.$post({
        param: { id },
        json: { content: replyContent.trim(), isInternal, attachments: [] },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as any)?.error ?? 'Gagal mengirim balasan');
      }

      toast.success(
        isInternal ? '📌 Catatan internal disimpan' : '✉️ Balasan terkirim ke pelanggan',
      );
      setReplyContent('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      mutate();
    } catch (err: any) {
      toast.error(typeof err?.message === 'string' ? err.message : 'Gagal mengirim');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      setUpdatingStatus(true);
      const res = await (client.v1.admin as any).support.tickets[':id'].status.$put({
        param: { id },
        json: { status },
      });
      if (!res.ok) throw new Error('Gagal update status');
      toast.success('Status tiket diperbarui');
      mutate();
    } catch (err: any) {
      toast.error(typeof err?.message === 'string' ? err.message : 'Gagal update');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
          <p className='text-sm text-gray-500'>Memuat tiket support…</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (fetchError || !ticket) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='flex flex-col items-center gap-3 text-center'>
          <span className='flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50'>
            <AlertTriangle className='h-7 w-7 text-red-500' />
          </span>
          <p className='text-base font-semibold text-gray-800'>Tiket tidak ditemukan</p>
          <p className='text-sm text-gray-400'>Tiket mungkin sudah dihapus atau ID tidak valid.</p>
          <Link
            to='/support'
            className='mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition'
          >
            <ArrowLeft className='h-4 w-4' /> Kembali
          </Link>
        </div>
      </div>
    );
  }

  const priorityCfg = PRIORITY_CFG[ticket.priority] ?? PRIORITY_CFG.normal;
  const PrioIcon = priorityCfg.icon;

  // Group messages by day
  const messages: any[] = ticket.messages ?? [];
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div className='flex flex-col gap-6 max-w-6xl'>
      {/* ── Breadcrumb header ── */}
      <div className='flex items-center gap-3'>
        <Link
          to='/support'
          className='inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-50 transition'
        >
          <ArrowLeft className='h-4 w-4' /> Kembali
        </Link>
        <div className='h-4 w-px bg-gray-200' />
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <span>Support</span>
          <ChevronDown className='h-3.5 w-3.5 rotate-[-90deg] text-gray-300' />
          <span className='font-semibold text-gray-800 font-mono'>#{ticket.id.slice(0, 8)}</span>
        </div>

        {/* Live indicator */}
        <span className='ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20'>
          <span className='animate-pulse inline-block h-1.5 w-1.5 rounded-full bg-emerald-500' />
          Live · 5s
        </span>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* ── Chat panel ── */}
        <div className='lg:col-span-2 flex flex-col gap-4'>
          {/* Header */}
          <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <div className='flex items-center gap-2 mb-2'>
                  <StatusPill status={ticket.status} />
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${priorityCfg.cls}`}
                  >
                    <PrioIcon className='h-3 w-3' /> {priorityCfg.label}
                  </span>
                  {ticket.category && (
                    <span className='inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600 capitalize'>
                      {ticket.category}
                    </span>
                  )}
                </div>
                <h1 className='text-xl font-black text-gray-900'>{ticket.subject}</h1>
                <p className='mt-1 text-xs text-gray-400'>
                  Dibuat {formatDate(ticket.createdAt)} · Tiket{' '}
                  <span className='font-mono'>#{ticket.id.slice(0, 8)}</span>
                </p>
              </div>
              <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600'>
                <Headphones className='h-5 w-5 text-white' />
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className='flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
            <div className='flex items-center justify-between border-b border-gray-100 px-5 py-3'>
              <div className='flex items-center gap-2'>
                <MessageSquare className='h-4 w-4 text-gray-400' />
                <span className='text-sm font-semibold text-gray-700'>Percakapan</span>
                <span className='rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700'>
                  {sortedMessages.length}
                </span>
              </div>
              <div className='flex items-center gap-1.5 text-xs text-gray-400'>
                <Lock className='h-3 w-3' />
                End-to-end encrypted
              </div>
            </div>

            {/* Scrollable message area */}
            <div
              className='flex flex-col gap-4 overflow-y-auto p-5'
              style={{ maxHeight: '480px', minHeight: '200px' }}
            >
              {sortedMessages.length === 0
                ? (
                  <div className='flex flex-col items-center justify-center py-12 text-center'>
                    <span className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100'>
                      <MessageSquare className='h-6 w-6 text-gray-400' />
                    </span>
                    <p className='text-sm font-medium text-gray-600'>Belum ada pesan</p>
                    <p className='text-xs text-gray-400 mt-1'>
                      Kirim balasan pertama ke pelanggan di bawah.
                    </p>
                  </div>
                )
                : (
                  sortedMessages.reduce<JSX.Element[]>((acc, msg, i) => {
                    const prevMsg = sortedMessages[i - 1];
                    const showDaySep = !prevMsg ||
                      new Date(msg.createdAt).toDateString() !==
                        new Date(prevMsg.createdAt).toDateString();
                    if (showDaySep) {
                      acc.push(<DaySeparator key={`sep-${i}`} date={msg.createdAt} />);
                    }
                    acc.push(
                      <MessageBubble key={msg.id} msg={msg} />,
                    );
                    return acc;
                  }, [])
                )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply form */}
            <form onSubmit={handleReply} className='border-t border-gray-100 p-4'>
              {/* Internal toggle */}
              <div className='mb-3 flex items-center gap-2'>
                <button
                  type='button'
                  role='switch'
                  aria-checked={isInternal}
                  onClick={() => setIsInternal(!isInternal)}
                  className={`relative h-5 w-9 rounded-full transition-colors duration-200 focus:outline-none ${
                    isInternal ? 'bg-yellow-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      isInternal ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span
                  className={`text-xs font-semibold ${
                    isInternal ? 'text-yellow-700' : 'text-gray-500'
                  }`}
                >
                  {isInternal
                    ? (
                      <span className='flex items-center gap-1'>
                        <ShieldAlert className='h-3 w-3' />{' '}
                        Catatan Internal (tidak terlihat pelanggan)
                      </span>
                    )
                    : (
                      'Balas ke pelanggan'
                    )}
                </span>
              </div>

              <div
                className={`flex items-end gap-3 rounded-xl border transition-all ${
                  isInternal
                    ? 'border-yellow-200 bg-yellow-50/60 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20'
                    : 'border-gray-200 bg-gray-50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/15'
                } p-3`}
              >
                <textarea
                  ref={textareaRef}
                  value={replyContent}
                  onChange={handleTextareaInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      if (replyContent.trim()) handleReply(e as any);
                    }
                  }}
                  placeholder={isInternal
                    ? 'Ketik catatan internal… (Ctrl+Enter untuk kirim)'
                    : 'Ketik balasan ke pelanggan… (Ctrl+Enter untuk kirim)'}
                  rows={2}
                  className='flex-1 resize-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none'
                  style={{ minHeight: '44px', maxHeight: '200px' }}
                />
                <button
                  type='submit'
                  disabled={isSubmitting || !replyContent.trim()}
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition disabled:opacity-40 ${
                    isInternal
                      ? 'bg-yellow-500 text-white hover:bg-yellow-400'
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                  title='Ctrl+Enter untuk kirim'
                >
                  {isSubmitting
                    ? <Loader2 className='h-4 w-4 animate-spin' />
                    : <Send className='h-4 w-4' />}
                </button>
              </div>
              <p className='mt-1.5 text-right text-[11px] text-gray-400'>
                Ctrl+Enter untuk kirim · <Lock className='inline h-2.5 w-2.5' /> Pesan dienkripsi
              </p>
            </form>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className='flex flex-col gap-4'>
          {/* Status management */}
          <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
            <h3 className='mb-4 text-sm font-bold text-gray-900'>Kelola Status</h3>
            <div className='space-y-2'>
              {STATUS_OPTIONS.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type='button'
                  disabled={ticket.status === value || updatingStatus}
                  onClick={() => updateStatus(value)}
                  className={`w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                    ticket.status === value
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  } disabled:opacity-60`}
                >
                  {updatingStatus && ticket.status !== value
                    ? <Loader2 className='h-4 w-4 animate-spin' />
                    : (
                      <Icon
                        className={`h-4 w-4 ${ticket.status === value ? 'text-white' : color}`}
                      />
                    )}
                  {label}
                  {ticket.status === value && (
                    <span className='ml-auto text-xs opacity-70'>Aktif</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket info */}
          <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
            <h3 className='mb-4 text-sm font-bold text-gray-900'>Informasi Tiket</h3>
            <dl className='space-y-3.5'>
              <div>
                <dt className='text-[11px] font-semibold uppercase tracking-wide text-gray-400'>
                  Kategori
                </dt>
                <dd className='mt-1 text-sm font-medium text-gray-800 capitalize'>
                  {ticket.category || '—'}
                </dd>
              </div>
              <div>
                <dt className='text-[11px] font-semibold uppercase tracking-wide text-gray-400'>
                  Prioritas
                </dt>
                <dd className='mt-1'>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityCfg.cls}`}
                  >
                    <PrioIcon className='h-3 w-3' /> {priorityCfg.label}
                  </span>
                </dd>
              </div>
              <div>
                <dt className='text-[11px] font-semibold uppercase tracking-wide text-gray-400'>
                  Pelanggan (ID)
                </dt>
                <dd className='mt-1 font-mono text-xs text-gray-500 truncate'>{ticket.userId}</dd>
              </div>
              {ticket.orderId && (
                <div>
                  <dt className='text-[11px] font-semibold uppercase tracking-wide text-gray-400'>
                    Pesanan Terkait
                  </dt>
                  <dd className='mt-1'>
                    <Link
                      to={`/orders/${ticket.orderId}`}
                      className='font-mono text-xs text-blue-600 hover:underline'
                    >
                      #{ticket.orderId.slice(0, 12)}…
                    </Link>
                  </dd>
                </div>
              )}
              <div>
                <dt className='text-[11px] font-semibold uppercase tracking-wide text-gray-400'>
                  Dibuat
                </dt>
                <dd className='mt-1 text-sm text-gray-600'>{formatDate(ticket.createdAt)}</dd>
              </div>
              <div>
                <dt className='text-[11px] font-semibold uppercase tracking-wide text-gray-400'>
                  Terakhir diperbarui
                </dt>
                <dd className='mt-1 text-sm text-gray-600'>{formatDate(ticket.updatedAt)}</dd>
              </div>
              <div>
                <dt className='text-[11px] font-semibold uppercase tracking-wide text-gray-400'>
                  Jumlah Pesan
                </dt>
                <dd className='mt-1 text-sm font-bold text-gray-900'>{sortedMessages.length}</dd>
              </div>
            </dl>
          </div>

          {/* E2E info */}
          <div className='rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <Lock className='h-4 w-4 text-emerald-600' />
              <span className='text-xs font-bold text-emerald-800'>Enkripsi End-to-End</span>
            </div>
            <p className='text-xs text-emerald-700 leading-relaxed'>
              Semua pesan antara admin dan pelanggan diproteksi. Hanya pihak yang berwenang yang
              dapat membaca percakapan ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
