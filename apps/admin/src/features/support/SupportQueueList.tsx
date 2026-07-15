import { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/rpc.ts';
import { Button, Card } from '@starsuperscare/ui';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const SupportQueueList = () => {
  const [filter, setFilter] = useState<string>('all');

  const { data: tickets, isLoading } = useSWR(
    ['/api/admin/support/tickets', filter],
    async () => {
      const query = filter !== 'all' ? { status: filter } : {};
      const res = await (client.v1.admin as any).support.tickets.$get({ query });
      if (!res.ok) throw new Error('Failed to load tickets');
      const json = await res.json();
      return json.data;
    },
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Antrian Support</h1>
          <p className='text-muted-foreground mt-2'>
            Kelola tiket bantuan pelanggan dan balas pesan mereka.
          </p>
        </div>
      </div>

      <div className='flex gap-2'>
        {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
            className='capitalize'
          >
            {status === 'all' ? 'Semua' : status.replace('_', ' ')}
          </Button>
        ))}
      </div>

      <Card>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>
            <thead className='text-xs text-muted-foreground uppercase bg-muted/50'>
              <tr>
                <th className='px-6 py-4 font-medium'>ID Tiket</th>
                <th className='px-6 py-4 font-medium'>Subjek</th>
                <th className='px-6 py-4 font-medium'>Kategori</th>
                <th className='px-6 py-4 font-medium'>Status</th>
                <th className='px-6 py-4 font-medium text-right'>Dibuat Pada</th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {isLoading
                ? (
                  <tr>
                    <td colSpan={5} className='px-6 py-8 text-center text-muted-foreground'>
                      Memuat antrian...
                    </td>
                  </tr>
                )
                : tickets?.length > 0
                ? (
                  tickets.map((ticket: any) => (
                    <tr key={ticket.id} className='hover:bg-muted/50 transition-colors'>
                      <td className='px-6 py-4 font-medium'>
                        <Link to={`/support/${ticket.id}`} className='text-primary hover:underline'>
                          #{ticket.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className='px-6 py-4'>
                        <Link to={`/support/${ticket.id}`} className='hover:underline'>
                          {ticket.subject}
                        </Link>
                      </td>
                      <td className='px-6 py-4 capitalize'>{ticket.category}</td>
                      <td className='px-6 py-4'>
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
                      </td>
                      <td className='px-6 py-4 text-right text-muted-foreground'>
                        {format(new Date(ticket.createdAt), 'dd MMM yyyy, HH:mm', { locale: id })}
                      </td>
                    </tr>
                  ))
                )
                : (
                  <tr>
                    <td colSpan={5} className='px-6 py-12 text-center'>
                      <HelpCircle className='h-8 w-8 mx-auto text-muted-foreground mb-3' />
                      <p className='text-muted-foreground'>Tidak ada tiket di antrian ini.</p>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
