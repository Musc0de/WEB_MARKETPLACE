import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Button, Card } from '@starsuperscare/ui';
import { HelpCircle, MessageSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SupportTicketModal } from './SupportTicketModal.tsx';

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

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Pusat Bantuan</h1>
          <p className='text-muted-foreground mt-2'>
            Temukan jawaban untuk pertanyaan umum atau hubungi tim support kami.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Buat Tiket
        </Button>
      </div>

      <div className='flex space-x-1 border-b'>
        <button
          type='button'
          className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'faq'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('faq')}
        >
          <HelpCircle className='h-4 w-4 inline mr-2' />
          FAQ
        </button>
        <button
          type='button'
          className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'tickets'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('tickets')}
        >
          <MessageSquare className='h-4 w-4 inline mr-2' />
          Tiket Saya
        </button>
      </div>

      <div className='mt-6'>
        {activeTab === 'faq' && (
          <div className='grid gap-4 md:grid-cols-2'>
            {isLoadingFaqs ? <p>Memuat FAQ...</p> : faqs?.length > 0
              ? (
                faqs.map((faq: any) => (
                  <Card key={faq.id} className='p-6'>
                    <h3 className='font-semibold text-lg'>{faq.question}</h3>
                    <span className='text-xs text-muted-foreground bg-secondary px-2 py-1 rounded mt-1 inline-block'>
                      {faq.category}
                    </span>
                    <p className='mt-4 text-muted-foreground whitespace-pre-line'>{faq.answer}</p>
                  </Card>
                ))
              )
              : <p className='text-muted-foreground col-span-2 text-center py-10'>Belum ada FAQ</p>}
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className='space-y-4'>
            {isLoadingTickets ? <p>Memuat tiket...</p> : tickets?.length > 0
              ? (
                tickets.map((ticket: any) => (
                  <Link key={ticket.id} to={`/dashboard/support/${ticket.id}`} className='block'>
                    <Card className='p-6 hover:border-primary transition-colors cursor-pointer'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <h3 className='font-semibold text-lg'>{ticket.subject}</h3>
                          <p className='text-sm text-muted-foreground mt-1'>
                            #{ticket.id.slice(0, 8)} • Kategori: {ticket.category}
                          </p>
                        </div>
                        <div className='text-right'>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize
                          ${
                              ticket.status === 'open'
                                ? 'bg-blue-100 text-blue-800'
                                : ticket.status === 'in_progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : ticket.status === 'resolved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                        `}
                          >
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <p className='text-xs text-muted-foreground mt-2'>
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))
              )
              : (
                <div className='text-center py-12'>
                  <p className='text-muted-foreground mb-4'>Anda belum memiliki tiket bantuan</p>
                  <Button variant='outline' onClick={() => setIsModalOpen(true)}>
                    Buat Tiket Pertama
                  </Button>
                </div>
              )}
          </div>
        )}
      </div>

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
