import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Headphones,
  HelpCircle,
  Loader2,
  Lock,
  MessageSquare,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { SupportTicketModal } from './SupportTicketModal.tsx';
import { formatDate } from '@starsuperscare/ui';

// ─── Status config ────────────────────────────────────────────────────────────
const TICKET_STATUS: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  open: {
    label: 'Terbuka',
    cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    icon: MessageSquare,
  },
  in_progress: {
    label: 'Diproses',
    cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    icon: RefreshCw,
  },
  resolved: {
    label: 'Selesai',
    cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: CheckCircle2,
  },
  closed: {
    label: 'Ditutup',
    cls: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    icon: AlertTriangle,
  },
};

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FaqItem({ faq }: { faq: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        open
          ? 'border-indigo-500/30 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-md'
          : 'border-border/60 bg-card dark:bg-background hover:border-indigo-500/20'
      }`}
    >
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='flex w-full items-start justify-between gap-4 px-6 py-5 text-left'
      >
        <span
          className={`text-base font-semibold leading-snug transition-colors ${
            open ? 'text-indigo-700 dark:text-indigo-400' : 'text-foreground'
          }`}
        >
          {faq.question}
        </span>
        <span
          className={`mt-0.5 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
            open ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-muted/50'
          }`}
        >
          {open
            ? <ChevronDown className='h-4 w-4 text-indigo-600 dark:text-indigo-400' />
            : <ChevronRight className='h-4 w-4 text-muted-foreground' />}
        </span>
      </button>
      {open && (
        <div className='border-t border-indigo-100 dark:border-indigo-900/30 px-6 pb-6 pt-4 animate-in slide-in-from-top-2 fade-in duration-200'>
          <p className='text-sm text-muted-foreground leading-relaxed whitespace-pre-line'>
            {faq.answer}
          </p>
          <span className='mt-4 inline-block rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 capitalize'>
            {faq.category}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Ticket card ──────────────────────────────────────────────────────────────
function TicketCard({ ticket }: { ticket: any }) {
  const cfg = TICKET_STATUS[ticket.status] ?? TICKET_STATUS.open;
  const Icon = cfg.icon;
  return (
    <Link to={`/support/${ticket.id}`} className='block group'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between rounded-3xl border border-border/60 bg-card dark:bg-background p-5 sm:px-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-500/30 group-hover:bg-indigo-50/10 dark:group-hover:bg-indigo-950/10 gap-4 sm:gap-6'>
        <div className='flex items-start gap-4 min-w-0'>
          <span
            className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border ${cfg.cls}`}
          >
            <Icon className='h-5 w-5' />
          </span>
          <div className='min-w-0 flex-1'>
            <p className='text-base font-bold text-foreground line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
              {ticket.subject}
            </p>
            <div className='mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
              <span className='font-mono font-medium text-foreground/70'>
                #{ticket.id?.slice(0, 8)}
              </span>
              <span className='w-1 h-1 rounded-full bg-border'></span>
              <span className='capitalize font-medium'>{ticket.category}</span>
              <span className='w-1 h-1 rounded-full bg-border'></span>
              <span className='font-medium'>{formatDate(ticket.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto flex-shrink-0 border-t border-border/40 sm:border-t-0 pt-4 sm:pt-0'>
          <span className={`rounded-full px-3 py-1 text-xs font-bold border ${cfg.cls}`}>
            {cfg.label}
          </span>
          <ArrowRight className='h-5 w-5 text-muted-foreground/40 group-hover:text-indigo-500 transition-all group-hover:translate-x-1' />
        </div>
      </div>
    </Link>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export const SupportPage = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets'>('faq');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: faqs, isLoading: isLoadingFaqs } = useSWR(
    '/api/faqs',
    async () => {
      const res = await (client.v1 as any).support.faqs.$get();
      const json = await res.json();
      return json.data || [];
    },
  );

  const { data: tickets, mutate, isLoading: isLoadingTickets } = useSWR(
    '/api/tickets',
    async () => {
      const res = await (client.v1 as any).support.tickets.$get();
      const json = await res.json();
      return json.data || [];
    },
  );

  const openCount =
    (tickets as any[])?.filter((t) => t.status === 'open' || t.status === 'in_progress').length ??
      0;

  return (
    <div className='mx-auto max-w-4xl space-y-8 pb-12 animate-in fade-in duration-500'>
      {/* ── Header Banner ── */}
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 shadow-xl border border-indigo-900/50'>
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none'>
          <div className='absolute -top-24 -right-12 w-64 h-64 bg-indigo-500 rounded-full blur-[80px]' />
          <div className='absolute -bottom-24 -left-12 w-64 h-64 bg-violet-500 rounded-full blur-[80px]' />
        </div>

        <div className='relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8'>
          <div className='flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left'>
            <div className='w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)]'>
              <Headphones className='w-10 h-10 sm:w-12 sm:h-12 text-indigo-300' />
            </div>
            <div>
              <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight'>
                Pusat Bantuan
              </h1>
              <p className='text-indigo-200 font-medium text-sm sm:text-base max-w-lg'>
                Temukan jawaban cepat atau hubungi tim support kami yang siap membantu.
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => setIsModalOpen(true)}
            className='inline-flex h-12 px-6 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98] flex-shrink-0 w-full sm:w-auto'
          >
            <Plus className='h-5 w-5' /> Buat Tiket Baru
          </button>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {[
          {
            label: 'FAQ Tersedia',
            value: faqs?.length ?? '—',
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-card dark:bg-background',
            icon: HelpCircle,
          },
          {
            label: 'Tiket Saya',
            value: tickets?.length ?? '—',
            color: 'text-foreground',
            bg: 'bg-card dark:bg-background',
            icon: MessageSquare,
          },
          {
            label: 'Perlu Respons',
            value: openCount,
            color: 'text-amber-600 dark:text-amber-500',
            bg: 'bg-card dark:bg-background',
            icon: RefreshCw,
          },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div
            key={label}
            className={`rounded-2xl border border-border/60 ${bg} p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-border transition-all duration-300`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center bg-muted/50 ${color}`}
            >
              <Icon className='w-6 h-6 opacity-80' />
            </div>
            <div>
              <p className={`text-2xl font-black ${color} leading-none`}>{value}</p>
              <p className='text-xs font-semibold text-muted-foreground mt-1.5'>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── E2E notice ── */}
      <div className='flex items-start sm:items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4'>
        <div className='w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0'>
          <Lock className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
        </div>
        <p className='text-sm text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed'>
          Semua percakapan support dienkripsi secara aman{' '}
          <span className='font-bold underline decoration-emerald-500/50 underline-offset-2'>
            End-to-End (E2E)
          </span>{' '}
          dan hanya dapat dilihat oleh Anda serta tim support resmi kami.
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className='flex gap-2 rounded-2xl border border-border/60 bg-muted/30 p-1.5 overflow-x-auto hide-scrollbar'>
        {[
          { key: 'faq', label: 'Panduan FAQ', icon: HelpCircle },
          { key: 'tickets', label: 'Tiket Support Saya', icon: MessageSquare },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type='button'
            onClick={() => setActiveTab(key as any)}
            className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold transition-all whitespace-nowrap min-w-[150px] ${
              activeTab === key
                ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon className={`h-4 w-4 ${activeTab === key ? 'text-indigo-500' : ''}`} /> {label}
            {key === 'tickets' && (tickets as any[])?.length > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black text-white leading-none ${
                  activeTab === key ? 'bg-indigo-600' : 'bg-muted-foreground/30'
                }`}
              >
                {(tickets as any[]).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className='min-h-[400px]'>
        {activeTab === 'faq' && (
          <div className='space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500'>
            {isLoadingFaqs
              ? (
                <div className='flex flex-col items-center justify-center py-20'>
                  <Loader2 className='h-10 w-10 animate-spin text-indigo-500/50 mb-4' />
                  <p className='text-muted-foreground animate-pulse font-medium text-sm'>
                    Memuat panduan FAQ...
                  </p>
                </div>
              )
              : faqs?.length > 0
              ? (
                faqs.map((faq: any) => <FaqItem key={faq.id} faq={faq} />)
              )
              : (
                <div className='flex flex-col items-center py-20 px-4 text-center bg-card dark:bg-background border border-border/60 rounded-3xl'>
                  <div className='mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50'>
                    <HelpCircle className='h-10 w-10 text-muted-foreground/40' />
                  </div>
                  <h3 className='text-xl font-bold text-foreground mb-2'>Belum Ada FAQ</h3>
                  <p className='text-sm text-muted-foreground max-w-sm mx-auto'>
                    Pertanyaan yang sering diajukan (FAQ) akan ditampilkan di sini ketika tim kami
                    telah menyiapkannya.
                  </p>
                </div>
              )}
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className='space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500'>
            {isLoadingTickets
              ? (
                <div className='flex flex-col items-center justify-center py-20'>
                  <Loader2 className='h-10 w-10 animate-spin text-indigo-500/50 mb-4' />
                  <p className='text-muted-foreground animate-pulse font-medium text-sm'>
                    Memuat tiket Anda...
                  </p>
                </div>
              )
              : (tickets as any[])?.length > 0
              ? (
                <div className='grid grid-cols-1 gap-4'>
                  {(tickets as any[]).map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              )
              : (
                <div className='flex flex-col items-center py-20 px-4 text-center bg-card dark:bg-background border border-border/60 rounded-3xl'>
                  <div className='mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50'>
                    <MessageSquare className='h-10 w-10 text-muted-foreground/40' />
                  </div>
                  <h3 className='text-xl font-bold text-foreground mb-2'>Belum Ada Tiket</h3>
                  <p className='text-sm text-muted-foreground max-w-sm mx-auto mb-8'>
                    Anda belum pernah membuat tiket keluhan. Jika Anda memiliki masalah terkait
                    transaksi atau akun, jangan ragu untuk menghubungi kami.
                  </p>
                  <button
                    type='button'
                    onClick={() =>
                      setIsModalOpen(true)}
                    className='inline-flex items-center gap-2 rounded-full shadow-lg shadow-indigo-500/20 bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all'
                  >
                    <Plus className='h-4 w-4' /> Buat Tiket Pertama
                  </button>
                </div>
              )}
          </div>
        )}
      </div>

      {/* ── Create Ticket Modal ── */}
      <SupportTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          setActiveTab('tickets');
          mutate();
        }}
      />
    </div>
  );
};
