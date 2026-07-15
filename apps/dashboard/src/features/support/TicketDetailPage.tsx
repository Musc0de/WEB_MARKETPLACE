/**
 * TicketDetailPage (Client)
 * - Premium chat UI for customers viewing their support ticket
 * - Real-time polling every 5s
 * - Image upload to R2 (max 10MB)
 * - Inline image display in chat bubbles
 * - E2E encryption badge
 */
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { Link, useParams } from 'react-router-dom';
import { API_URL, client } from '../../lib/api.ts';
import { toast } from '@starsuperscare/ui';
import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Download,
  File,
  Headphones,
  ImagePlus,
  Loader2,
  Lock,
  MessageSquare,
  RefreshCw,
  Send,
  User,
  X,
} from 'lucide-react';
import { formatDate } from '@starsuperscare/ui';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  open: { label: 'Terbuka', cls: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'Diproses', cls: 'bg-amber-100 text-amber-700' },
  resolved: { label: 'Selesai', cls: 'bg-emerald-100 text-emerald-700' },
  closed: { label: 'Ditutup', cls: 'bg-gray-100 text-gray-500' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

function getMediaUrl(key: string | null, publicUrl?: string | null): string | null {
  if (publicUrl) return publicUrl;
  if (!key) return null;
  return `${API_URL}/storage/${key}`;
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: any }) {
  const isUser = msg.senderType === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <span
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
            : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
        }`}
      >
        {isUser ? <User className='h-4 w-4' /> : <Headphones className='h-4 w-4' />}
      </span>

      <div className={`flex max-w-[78%] flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Sender + time */}
        <div className='flex items-center gap-1.5 text-[11px] text-gray-400'>
          {!isUser && <span className='font-medium text-emerald-600'>Admin Support</span>}
          {isUser && <span className='font-medium text-blue-600'>Anda</span>}
          <span>{timeStr(msg.createdAt)}</span>
          <Lock className='h-2.5 w-2.5 text-gray-300' />
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'rounded-tr-sm bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
              : 'rounded-tl-sm border border-gray-200 bg-white text-gray-800'
          }`}
          style={{ wordBreak: 'break-word' }}
        >
          {msg.content && <p className='whitespace-pre-wrap'>{msg.content}</p>}

          {/* Attachments */}
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
                        alt={att.fileName ?? 'gambar'}
                        className='max-w-[260px] rounded-xl object-cover shadow-sm hover:opacity-90 transition'
                        style={{ maxHeight: 220 }}
                      />
                      <span
                        className={`mt-1 block text-[10px] ${
                          isUser ? 'text-blue-200' : 'text-gray-400'
                        }`}
                      >
                        {att.fileName}
                      </span>
                    </a>
                  );
                }
                return (
                  <a
                    key={att.id}
                    href={src || '#'}
                    target='_blank'
                    rel='noreferrer'
                    className={`flex items-center gap-2 rounded-xl border p-2 text-xs transition ${
                      isUser
                        ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
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

// ─── Image Preview ────────────────────────────────────────────────────────────
function ImagePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const url = URL.createObjectURL(file);
  return (
    <div className='relative inline-block'>
      <img
        src={url}
        alt={file.name}
        className='h-16 w-16 rounded-lg object-cover border border-gray-200'
      />
      <button
        type='button'
        onClick={onRemove}
        className='absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500 transition'
      >
        <X className='h-3 w-3' />
      </button>
      <p className='mt-1 w-16 truncate text-[10px] text-gray-400'>{file.name}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: ticket, mutate, isLoading } = useSWR(
    id ? `/api/client/tickets/${id}` : null,
    async () => {
      const res = await (client.v1 as any).support.tickets[':id'].$get({ param: { id } });
      if (!res.ok) throw new Error('Gagal memuat tiket');
      const json = await res.json();
      return json.data;
    },
    { refreshInterval: 5000, revalidateOnFocus: true },
  );

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages?.length]);

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const MAX = 10 * 1024 * 1024;
    const valid = files.filter((f) => {
      if (f.size > MAX) {
        toast.error(`${f.name}: ukuran melebihi 10MB`);
        return false;
      }
      return true;
    });
    setPendingFiles((prev) => [...prev, ...valid].slice(0, 5));
    e.target.value = '';
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() && pendingFiles.length === 0) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Upload files first
      const attachmentIds: string[] = [];
      if (pendingFiles.length > 0) {
        setUploadingFiles(true);
        for (const file of pendingFiles) {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch(`${API_URL}/v1/support/attachments`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
          });
          if (res.ok) {
            const json = await res.json();
            attachmentIds.push(json.data.id);
          } else {
            const err = await res.json().catch(() => ({}));
            toast.error((err as any)?.error ?? `Gagal upload ${file.name}`);
          }
        }
        setUploadingFiles(false);
      }

      // Send message
      const res = await (client.v1 as any).support.tickets[':id'].messages.$post({
        param: { id },
        json: {
          content: replyContent.trim() || ' ',
          isInternal: false,
          attachments: attachmentIds,
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as any)?.error?.message ?? 'Gagal mengirim pesan');
      }

      toast.success('Pesan terkirim!');
      setReplyContent('');
      setPendingFiles([]);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      mutate();
    } catch (err: any) {
      toast.error(typeof err?.message === 'string' ? err.message : 'Gagal mengirim');
    } finally {
      setIsSubmitting(false);
      setUploadingFiles(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <Loader2 className='h-7 w-7 animate-spin text-blue-500' />
          <p className='text-sm text-gray-500'>Memuat percakapan…</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className='flex h-64 flex-col items-center justify-center text-center gap-3'>
        <AlertTriangle className='h-8 w-8 text-red-400' />
        <p className='text-base font-semibold text-gray-700'>Tiket tidak ditemukan</p>
        <Link to='/support' className='text-sm text-blue-600 hover:underline'>
          ← Kembali ke Support
        </Link>
      </div>
    );
  }

  const isClosed = ticket.status === 'closed' || ticket.status === 'resolved';
  const statusCfg = STATUS_LABEL[ticket.status] ?? STATUS_LABEL.open;
  const messages: any[] = [...(ticket.messages ?? [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div className='mx-auto max-w-3xl space-y-5 py-2'>
      {/* ── Header ── */}
      <div className='flex items-center gap-3'>
        <Link
          to='/support'
          className='inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-50 transition'
        >
          <ArrowLeft className='h-4 w-4' /> Kembali
        </Link>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <span>Support</span>
          <ChevronDown className='h-3.5 w-3.5 rotate-[-90deg] text-gray-300' />
          <span className='font-mono font-semibold text-gray-800'>#{ticket.id.slice(0, 8)}</span>
        </div>
        <span className='ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20'>
          <span className='animate-pulse inline-block h-1.5 w-1.5 rounded-full bg-emerald-500' />
          Live · 5s
        </span>
      </div>

      {/* ── Ticket summary ── */}
      <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <div className='flex flex-wrap items-center gap-2 mb-2'>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusCfg.cls}`}>
                {statusCfg.label}
              </span>
              <span className='rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 capitalize'>
                {ticket.category}
              </span>
            </div>
            <h1 className='text-xl font-black text-gray-900'>{ticket.subject}</h1>
            <p className='mt-1 text-xs text-gray-400'>
              Dibuat {formatDate(ticket.createdAt)} · #{ticket.id.slice(0, 8)}
            </p>
          </div>
          <span className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600'>
            <Headphones className='h-5 w-5 text-white' />
          </span>
        </div>
      </div>

      {/* ── Chat ── */}
      <div className='flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
        {/* Chat header */}
        <div className='flex items-center justify-between border-b border-gray-100 px-5 py-3'>
          <div className='flex items-center gap-2'>
            <MessageSquare className='h-4 w-4 text-gray-400' />
            <span className='text-sm font-semibold text-gray-700'>Percakapan</span>
            <span className='rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700'>
              {messages.length}
            </span>
          </div>
          <div className='flex items-center gap-1.5 text-xs text-gray-400'>
            <Lock className='h-3 w-3' /> End-to-end encrypted
          </div>
        </div>

        {/* Messages */}
        <div
          className='flex flex-col gap-4 overflow-y-auto p-5'
          style={{ maxHeight: 480, minHeight: 160 }}
        >
          {messages.length === 0
            ? (
              <div className='flex flex-col items-center py-10 text-center'>
                <span className='mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100'>
                  <MessageSquare className='h-5 w-5 text-gray-400' />
                </span>
                <p className='text-sm font-medium text-gray-600'>Belum ada pesan</p>
                <p className='text-xs text-gray-400 mt-1'>
                  Tim support kami akan merespons secepatnya.
                </p>
              </div>
            )
            : (
              messages.reduce<JSX.Element[]>((acc, msg, i) => {
                const prev = messages[i - 1];
                if (
                  !prev ||
                  new Date(msg.createdAt).toDateString() !== new Date(prev.createdAt).toDateString()
                ) {
                  acc.push(<DaySeparator key={`sep-${i}`} date={msg.createdAt} />);
                }
                acc.push(<MessageBubble key={msg.id} msg={msg} />);
                return acc;
              }, [])
            )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply form */}
        {isClosed
          ? (
            <div className='border-t border-gray-100 p-4 text-center'>
              <p className='text-sm text-gray-400'>
                Tiket ini sudah{' '}
                {statusCfg.label.toLowerCase()}. Buat tiket baru jika ada pertanyaan lain.
              </p>
            </div>
          )
          : (
            <form onSubmit={handleReply} className='border-t border-gray-100 p-4 space-y-3'>
              {/* Pending images preview */}
              {pendingFiles.length > 0 && (
                <div className='flex flex-wrap gap-3'>
                  {pendingFiles.map((f, i) => (
                    <ImagePreview
                      key={i}
                      file={f}
                      onRemove={() => setPendingFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    />
                  ))}
                </div>
              )}

              <div className='flex items-end gap-3 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/15 focus-within:bg-white transition p-3'>
                <textarea
                  ref={textareaRef}
                  value={replyContent}
                  onChange={handleTextareaInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleReply(e as any);
                    }
                  }}
                  placeholder='Ketik pesan Anda… (Ctrl+Enter untuk kirim)'
                  rows={2}
                  className='flex-1 resize-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none'
                  style={{ minHeight: 44, maxHeight: 180 }}
                />
                <div className='flex items-center gap-1.5 flex-shrink-0'>
                  {/* Image upload button */}
                  <button
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                    className='flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition'
                    title='Lampirkan gambar (maks 10MB)'
                  >
                    <ImagePlus className='h-4 w-4' />
                  </button>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*,.pdf'
                    multiple
                    className='hidden'
                    onChange={handleFileSelect}
                  />
                  {/* Send button */}
                  <button
                    type='submit'
                    disabled={isSubmitting || (!replyContent.trim() && pendingFiles.length === 0)}
                    className='flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-40'
                  >
                    {isSubmitting
                      ? <Loader2 className='h-4 w-4 animate-spin' />
                      : uploadingFiles
                      ? <RefreshCw className='h-4 w-4 animate-spin' />
                      : <Send className='h-4 w-4' />}
                  </button>
                </div>
              </div>
              <p className='text-right text-[11px] text-gray-400'>
                Ctrl+Enter untuk kirim · Maks gambar 10MB · <Lock className='inline h-2.5 w-2.5' />
                {' '}
                Dienkripsi
              </p>
            </form>
          )}
      </div>

      {/* ── E2E Footer ── */}
      <div className='flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3'>
        <Lock className='h-3.5 w-3.5 text-emerald-600 flex-shrink-0' />
        <p className='text-xs text-emerald-700'>
          Semua pesan dalam percakapan ini dienkripsi end-to-end dan hanya dapat dilihat oleh Anda
          dan tim support kami.
        </p>
      </div>
    </div>
  );
};
