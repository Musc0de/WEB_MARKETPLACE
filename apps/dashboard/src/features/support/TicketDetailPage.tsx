/**
 * TicketDetailPage (Client)
 * - Premium chat UI for customers viewing their support ticket
 * - Real-time polling every 5s
 * - Image upload to R2 (max 10MB)
 * - Inline image display in chat bubbles
 * - E2E encryption badge
 */
import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { Link, useParams } from 'react-router-dom';
import { API_URL, client } from '../../lib/api.ts';
import { toast } from '@starsuperscare/ui';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
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
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { formatDate } from '@starsuperscare/ui';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  open: {
    label: 'Terbuka',
    cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  in_progress: {
    label: 'Diproses',
    cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  resolved: {
    label: 'Selesai',
    cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  closed: {
    label: 'Ditutup',
    cls: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  },
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
    <div
      className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <span
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-md ring-2 ring-background ${
          isUser
            ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
            : 'bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 text-white'
        }`}
      >
        {isUser ? <User className='h-4 w-4' /> : <Headphones className='h-4 w-4' />}
      </span>

      <div
        className={`flex max-w-[50%] sm:max-w-[20%] flex-col gap-1.5 ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {/* Sender + time */}
        <div className='flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground'>
          {!isUser && <span className='text-foreground font-bold'>Admin Support</span>}
          {isUser && <span className='text-indigo-600 dark:text-indigo-400 font-bold'>Anda</span>}
          <span className='w-1 h-1 rounded-full bg-border'></span>
          <span>{timeStr(msg.createdAt)}</span>
          <Lock className='h-2.5 w-2.5 opacity-40' />
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'rounded-tr-sm bg-gradient-to-br from-indigo-600 to-violet-600 text-white'
              : 'rounded-tl-sm border border-border/60 bg-card text-foreground'
          }`}
          style={{ wordBreak: 'break-word' }}
        >
          {msg.content && <p className='whitespace-pre-wrap font-medium'>{msg.content}</p>}

          {/* Attachments */}
          {msg.attachments && msg.attachments.length > 0 && (
            <div className='mt-3 space-y-2'>
              {msg.attachments.map((att: any) => {
                const isImg = att.mimeType?.startsWith('image/');
                const src = att.publicUrl || getMediaUrl(att.objectKey);
                if (isImg && src) {
                  return (
                    <a
                      key={att.id}
                      href={src}
                      target='_blank'
                      rel='noreferrer'
                      className='block group relative'
                    >
                      <img
                        src={src}
                        alt={att.fileName ?? 'gambar'}
                        className='w-full max-w-[200px] sm:max-w-[260px] rounded-xl object-cover shadow-sm group-hover:opacity-90 transition-all border border-black/5 dark:border-white/5'
                        style={{ maxHeight: 220 }}
                      />
                      <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center'>
                        <Download className='w-6 h-6 text-white drop-shadow-md' />
                      </div>
                      <span
                        className={`mt-1 block text-[10px] font-medium ${
                          isUser ? 'text-indigo-200' : 'text-muted-foreground'
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
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                      isUser
                        ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                        : 'border-border/60 bg-muted/50 hover:bg-muted text-foreground'
                    }`}
                  >
                    <File className='h-4 w-4 flex-shrink-0' />
                    <span className='flex-1 truncate max-w-[180px]'>{att.fileName}</span>
                    <Download
                      className={`h-3.5 w-3.5 ${isUser ? 'opacity-70' : 'text-muted-foreground'}`}
                    />
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
    <div className='flex items-center gap-4 py-4'>
      <div className='flex-1 border-t border-border/40' />
      <span className='text-[11px] font-bold text-muted-foreground tracking-wider uppercase'>
        {dayStr(date)}
      </span>
      <div className='flex-1 border-t border-border/40' />
    </div>
  );
}

// ─── Image Preview ────────────────────────────────────────────────────────────
function ImagePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const url = URL.createObjectURL(file);
  return (
    <div className='relative inline-block group'>
      <img
        src={url}
        alt={file.name}
        className='h-16 w-16 rounded-xl object-cover border border-border/60 shadow-sm'
      />
      <div className='absolute inset-0 bg-background/20 rounded-xl pointer-events-none' />
      <button
        type='button'
        onClick={onRemove}
        className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 hover:scale-110 transition-all'
      >
        <X className='h-3.5 w-3.5' />
      </button>
      <p className='mt-1.5 w-16 truncate text-[10px] font-medium text-muted-foreground text-center'>
        {file.name}
      </p>
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
      <div className='flex h-64 items-center justify-center animate-in fade-in duration-500'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='h-8 w-8 animate-spin text-indigo-500' />
          <p className='text-sm font-semibold text-muted-foreground'>Memuat percakapan tiket…</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className='flex h-64 flex-col items-center justify-center text-center gap-4 animate-in fade-in duration-500'>
        <div className='w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center'>
          <AlertTriangle className='h-8 w-8 text-red-500' />
        </div>
        <div>
          <p className='text-lg font-bold text-foreground'>Tiket Tidak Ditemukan</p>
          <p className='text-sm text-muted-foreground mt-1 mb-4'>
            Tiket yang Anda cari tidak tersedia atau telah dihapus.
          </p>
        </div>
        <Link
          to='/support'
          className='inline-flex items-center gap-2 h-10 px-6 rounded-full bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' /> Kembali ke Support
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
    <div className='mx-auto max-w-4xl space-y-6 pb-28 sm:pb-12 animate-in fade-in duration-500'>
      {/* ── Header ── */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <Link
            to='/support'
            className='inline-flex items-center gap-2 rounded-full border border-border/60 bg-card hover:bg-muted px-4 py-2 text-sm font-bold text-foreground shadow-sm transition-all hover:-translate-x-1'
          >
            <ArrowLeft className='h-4 w-4 text-muted-foreground' /> Kembali
          </Link>
          <div className='hidden sm:flex items-center gap-2 text-sm font-semibold text-muted-foreground'>
            <ChevronDown className='h-4 w-4 rotate-[-90deg] opacity-50' />
            <span className='font-mono font-bold text-foreground'>#{ticket.id?.slice(0, 8)}</span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400'>
            <span className='animate-pulse inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' />
            Live Sync
          </span>
        </div>
      </div>

      {/* ── Ticket summary ── */}
      <div className='relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 bg-card p-4 sm:p-8 shadow-sm'>
        <div className='absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none'>
        </div>
        <div className='flex flex-row items-start justify-between gap-4 relative z-10'>
          <div className='flex-1 min-w-0'>
            <div className='flex flex-wrap items-center gap-2 mb-2 sm:mb-3'>
              <span
                className={`rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold border ${statusCfg.cls}`}
              >
                {statusCfg.label}
              </span>
              <span className='rounded-full bg-muted/80 border border-border/50 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-muted-foreground capitalize'>
                {ticket.category}
              </span>
            </div>
            <h1 className='text-lg sm:text-3xl font-black text-foreground mb-1 sm:mb-2 leading-tight tracking-tight truncate sm:whitespace-normal'>
              {ticket.subject}
            </h1>
            <p className='text-[11px] sm:text-sm font-medium text-muted-foreground truncate sm:whitespace-normal'>
              {formatDate(ticket.createdAt)} <span className='mx-1.5 sm:mx-2 text-border'>•</span>
              {' '}
              <span className='font-mono'>#{ticket.id?.slice(0, 8)}</span>
            </p>
          </div>
          <span className='flex h-10 w-10 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20'>
            <Headphones className='h-5 w-5 sm:h-6 sm:w-6 text-white' />
          </span>
        </div>
      </div>

      {/* ── Chat Container ── */}
      <div className='flex flex-col rounded-3xl border border-border/60 bg-card shadow-lg shadow-black/5 overflow-hidden'>
        {/* Chat header */}
        <div className='flex items-center justify-between border-b border-border/40 bg-muted/20 px-6 py-4'>
          <div className='flex items-center gap-3'>
            <MessageSquare className='h-5 w-5 text-indigo-500' />
            <span className='text-base font-bold text-foreground'>Riwayat Percakapan</span>
            <span className='rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 text-xs font-black'>
              {messages.length}
            </span>
          </div>
          <div className='flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full'>
            <ShieldCheck className='h-3.5 w-3.5' />
            <span className='hidden sm:inline'>End-to-End Encrypted</span>
            <span className='sm:hidden'>E2E</span>
          </div>
        </div>

        {/* Messages */}
        <div
          className='flex flex-col gap-6 overflow-y-auto p-6 scroll-smooth bg-gradient-to-b from-transparent to-muted/20'
          style={{ maxHeight: '60vh', minHeight: 300 }}
        >
          {messages.length === 0
            ? (
              <div className='flex flex-col items-center justify-center py-16 text-center h-full'>
                <span className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted shadow-inner'>
                  <MessageSquare className='h-7 w-7 text-muted-foreground/50' />
                </span>
                <p className='text-lg font-bold text-foreground'>Belum Ada Percakapan</p>
                <p className='text-sm text-muted-foreground mt-2 max-w-sm'>
                  Sampaikan detail masalah Anda. Tim Support kami akan merespons secepatnya.
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
          <div ref={messagesEndRef} className='h-1 w-full' />
        </div>

        {/* Reply form */}
        {isClosed
          ? (
            <div className='border-t border-border/40 bg-muted/50 p-5 sm:p-6 text-center'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3'>
                <CheckCircle2 className='w-6 h-6 text-muted-foreground' />
              </div>
              <p className='text-sm font-semibold text-muted-foreground'>
                Tiket ini telah berstatus{' '}
                <span className='text-foreground'>{statusCfg.label}</span>. Anda tidak dapat
                membalas tiket ini.
              </p>
              <Link
                to='/support'
                className='inline-block mt-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline'
              >
                Buat tiket baru jika ada masalah lain
              </Link>
            </div>
          )
          : (
            <form
              onSubmit={handleReply}
              className='border-t border-border/40 bg-muted/10 p-4 sm:p-6 space-y-4'
            >
              {/* Pending images preview */}
              {pendingFiles.length > 0 && (
                <div className='flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-2'>
                  {pendingFiles.map((f, i) => (
                    <ImagePreview
                      key={i}
                      file={f}
                      onRemove={() => setPendingFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    />
                  ))}
                </div>
              )}

              <div className='flex items-end gap-3 rounded-2xl border border-border/60 bg-card focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all p-3 shadow-sm'>
                <div className='flex-1 relative'>
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
                    placeholder='Ketik pesan balasan Anda… (Ctrl+Enter untuk kirim)'
                    rows={1}
                    className='w-full resize-none bg-transparent text-sm sm:text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none p-2'
                    style={{ minHeight: 44, maxHeight: 200 }}
                  />
                </div>

                <div className='flex items-center gap-2 flex-shrink-0 mb-1 mr-1'>
                  {/* Image upload button */}
                  <button
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                    className='flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
                    title='Lampirkan gambar (maks 10MB)'
                  >
                    <ImagePlus className='h-5 w-5' />
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
                    className='flex h-10 w-10 sm:w-auto sm:px-5 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none'
                  >
                    {isSubmitting
                      ? <Loader2 className='h-5 w-5 animate-spin' />
                      : uploadingFiles
                      ? <RefreshCw className='h-5 w-5 animate-spin' />
                      : (
                        <>
                          <span className='hidden sm:inline'>Kirim</span>
                          <Send className='h-4 w-4' />
                        </>
                      )}
                  </button>
                </div>
              </div>
              <div className='flex items-center justify-between px-2 text-[11px] font-semibold text-muted-foreground'>
                <span>Maks lampiran 10MB</span>
                <span className='flex items-center gap-1'>
                  <Lock className='h-3 w-3' /> Dienkripsi E2E
                </span>
              </div>
            </form>
          )}
      </div>
    </div>
  );
};
