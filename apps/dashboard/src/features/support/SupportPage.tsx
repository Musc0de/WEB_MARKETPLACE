import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  MessageSquare,
  Plus,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Headphones,
  Loader2,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { SupportTicketModal } from './SupportTicketModal.tsx';
import { formatDate } from '@starsuperscare/ui';

// ─── Status config ────────────────────────────────────────────────────────────
const TICKET_STATUS: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  open:        { label: 'Terbuka',  cls: 'bg-blue-100 text-blue-700',    icon: MessageSquare },
  in_progress: { label: 'Diproses', cls: 'bg-amber-100 text-amber-700',   icon: RefreshCw    },
  resolved:    { label: 'Selesai',  cls: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  closed:      { label: 'Ditutup', cls: 'bg-gray-100 text-gray-500',    icon: AlertTriangle },
};

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FaqItem({ faq }: { faq: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${open ? 'border-blue-200 bg-blue-50/40' : 'border-gray-200 bg-white'}`}
    >
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='flex w-full items-start justify-between gap-3 px-5 py-4 text-left'
      >
        <span className='text-sm font-semibold text-gray-900 leading-snug'>{faq.question}</span>
        <span className='mt-0.5 flex-shrink-0'>
          {open
            ? <ChevronDown className='h-4 w-4 text-blue-600' />
            : <ChevronRight className='h-4 w-4 text-gray-400' />}
        </span>
      </button>
      {open && (
        <div className='border-t border-blue-100 px-5 pb-5 pt-3'>
          <p className='text-sm text-gray-600 leading-relaxed whitespace-pre-line'>{faq.answer}</p>
          <span className='mt-3 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 capitalize'>
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
      <div className='flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200 group-hover:bg-blue-50/30'>
        <div className='flex items-start gap-4 min-w-0'>
          <span className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${cfg.cls}`}>
            <Icon className='h-4 w-4' />
          </span>
          <div className='min-w-0'>
            <p className='text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-700 transition-colors'>
              {ticket.subject}
            </p>
            <div className='mt-1 flex items-center gap-2 text-xs text-gray-400'>
              <span className='font-mono'>#{ticket.id.slice(0, 8)}</span>
              <span>·</span>
              <span className='capitalize'>{ticket.category}</span>
              <span>·</span>
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-3 flex-shrink-0'>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.cls}`}>
            {cfg.label}
          </span>
          <ArrowRight className='h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors group-hover:translate-x-0.5 transition-transform' />
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

  const openCount = (tickets as any[])?.filter((t) => t.status === 'open' || t.status === 'in_progress').length ?? 0;

  return (
    <div className='mx-auto max-w-3xl space-y-8 py-2'>
      {/* ── Header ── */}
      <div className='flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex items-start gap-4'>
          <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md'>
            <Headphones className='h-6 w-6 text-white' />
          </span>
          <div>
            <h1 className='text-2xl font-black tracking-tight text-gray-900'>Pusat Bantuan</h1>
            <p className='mt-1 text-sm text-gray-500'>
              Temukan jawaban atau hubungi tim support kami.
            </p>
          </div>
        </div>
        <button
          type='button'
          onClick={() => setIsModalOpen(true)}
          className='inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition flex-shrink-0'
        >
          <Plus className='h-4 w-4' /> Buat Tiket
        </button>
      </div>

      {/* ── Stats bar ── */}
      <div className='grid grid-cols-3 gap-3'>
        {[
          { label: 'FAQ Tersedia', value: faqs?.length ?? '—', color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Tiket Saya', value: tickets?.length ?? '—', color: 'text-gray-900', bg: 'bg-gray-50' },
          { label: 'Perlu Respons', value: openCount, color: 'text-amber-700', bg: 'bg-amber-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-xl border border-gray-200 ${bg} px-4 py-3 text-center shadow-sm`}>
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className='text-xs text-gray-500 mt-0.5'>{label}</p>
          </div>
        ))}
      </div>

      {/* ── E2E notice ── */}
      <div className='flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-2.5'>
        <Lock className='h-3.5 w-3.5 text-emerald-600 flex-shrink-0' />
        <p className='text-xs text-emerald-700'>Semua percakapan support dienkripsi end-to-end dan hanya dapat dilihat oleh Anda dan tim support kami.</p>
      </div>

      {/* ── Tabs ── */}
      <div className='flex gap-1 rounded-xl border border-gray-200 bg-gray-100/60 p-1'>
        {[
          { key: 'faq',     label: 'FAQ',        icon: HelpCircle    },
          { key: 'tickets', label: 'Tiket Saya',  icon: MessageSquare },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type='button'
            onClick={() => setActiveTab(key as any)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className='h-4 w-4' /> {label}
            {key === 'tickets' && (tickets as any[])?.length > 0 && (
              <span className='rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none'>
                {(tickets as any[]).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {activeTab === 'faq' && (
        <div className='space-y-3'>
          {isLoadingFaqs ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-6 w-6 animate-spin text-blue-500' />
            </div>
          ) : faqs?.length > 0 ? (
            faqs.map((faq: any) => <FaqItem key={faq.id} faq={faq} />)
          ) : (
            <div className='flex flex-col items-center py-12 text-center'>
              <span className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100'>
                <HelpCircle className='h-6 w-6 text-gray-400' />
              </span>
              <p className='text-sm font-medium text-gray-600'>Belum ada FAQ</p>
              <p className='text-xs text-gray-400 mt-1'>FAQ akan ditampilkan di sini ketika tersedia.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className='space-y-3'>
          {isLoadingTickets ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-6 w-6 animate-spin text-blue-500' />
            </div>
          ) : (tickets as any[])?.length > 0 ? (
            (tickets as any[]).map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
          ) : (
            <div className='flex flex-col items-center py-12 text-center'>
              <span className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100'>
                <MessageSquare className='h-6 w-6 text-gray-400' />
              </span>
              <p className='text-sm font-medium text-gray-600'>Belum ada tiket</p>
              <p className='text-xs text-gray-400 mt-1'>Buat tiket baru jika ada masalah yang perlu diselesaikan.</p>
              <button
                type='button'
                onClick={() => setIsModalOpen(true)}
                className='mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition'
              >
                <Plus className='h-4 w-4' /> Buat Tiket Pertama
              </button>
            </div>
          )}
        </div>
      )}

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
