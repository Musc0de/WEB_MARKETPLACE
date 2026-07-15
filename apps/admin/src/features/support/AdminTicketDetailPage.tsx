import React, { useState } from 'react';
import useSWR from 'swr';
import { Link, useParams } from 'react-router-dom';
import { API_URL, client } from '../../lib/rpc.ts';
import { Button, Card, toast } from '@starsuperscare/ui';
import { ArrowLeft, Download, File, Send, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export const AdminTicketDetailPage = () => {
  const { id } = useParams();
  const [replyContent, setReplyContent] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: ticket, mutate, isLoading } = useSWR(
    `/api/admin/support/tickets/${id}`,
    async () => {
      const res = await (client.v1.admin as any).support.tickets[':id'].$get({ param: { id } });
      if (!res.ok) throw new Error('Failed to load ticket');
      const json = await res.json();
      return json.data;
    },
  );

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await (client.v1.admin as any).support.tickets[':id'].messages.$post({
        param: { id },
        json: {
          content: replyContent,
          isInternal,
          attachments: [],
        },
      });

      if (!res.ok) {
        throw new Error('Gagal mengirim balasan');
      }

      toast.success(isInternal ? 'Catatan internal disimpan' : 'Balasan terkirim ke pengguna');
      setReplyContent('');
      mutate();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      const res = await (client.v1.admin as any).support.tickets[':id'].status.$put({
        param: { id },
        json: { status },
      });
      if (!res.ok) throw new Error('Gagal update status');
      toast.success('Status diperbarui');
      mutate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getMediaUrl = (key: string | null) => {
    if (!key) return null;
    return `${API_URL}/storage/${key}`;
  };

  if (isLoading) return <div className='p-8'>Memuat tiket...</div>;
  if (!ticket) return <div className='p-8'>Tiket tidak ditemukan</div>;

  return (
    <div className='space-y-6 max-w-5xl mx-auto'>
      <div className='flex items-center space-x-4'>
        <Link to='/support'>
          <Button variant='ghost' className='px-2'>
            <ArrowLeft className='h-4 w-4 mr-2' /> Kembali ke Antrian
          </Button>
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 space-y-6'>
          <Card className='p-6'>
            <div className='flex justify-between items-start mb-6 border-b pb-4'>
              <div>
                <h1 className='text-2xl font-bold'>{ticket.subject}</h1>
                <p className='text-muted-foreground mt-1'>
                  Tiket #{ticket.id.slice(0, 8)} •{' '}
                  {format(new Date(ticket.createdAt), 'dd MMM yyyy, HH:mm', { locale: idLocale })}
                </p>
              </div>
            </div>

            <div className='space-y-6'>
              {ticket.messages?.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.senderId === ticket.userId ? 'items-start' : 'items-end'
                  }`}
                >
                  <div className='text-xs text-muted-foreground mb-1 flex items-center'>
                    {msg.senderId === ticket.userId ? 'Pengguna' : 'Admin'}
                    {msg.isInternal === 'true' && (
                      <span className='ml-2 flex items-center text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold'>
                        <ShieldAlert className='w-3 h-3 mr-1' /> Internal
                      </span>
                    )}
                    <span className='ml-2'>
                      • {format(new Date(msg.createdAt), 'HH:mm', { locale: idLocale })}
                    </span>
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.isInternal === 'true'
                        ? 'bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-tr-sm'
                        : msg.senderId === ticket.userId
                        ? 'bg-muted rounded-tl-sm'
                        : 'bg-primary text-primary-foreground rounded-tr-sm'
                    }`}
                  >
                    <p className='whitespace-pre-wrap text-sm'>{msg.content}</p>

                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className='mt-3 space-y-2'>
                        {msg.attachments.map((att: any) => (
                          <a
                            key={att.id}
                            href={getMediaUrl(att.objectKey) || '#'}
                            target='_blank'
                            rel='noreferrer'
                            className='flex items-center p-2 bg-background/20 rounded border hover:bg-background/40 transition-colors text-xs'
                          >
                            <File className='h-4 w-4 mr-2' />
                            <span className='truncate flex-1 max-w-[200px]'>{att.fileName}</span>
                            <Download className='h-4 w-4 ml-2 opacity-50' />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <form onSubmit={handleReply} className='space-y-4'>
            <div className='bg-background border rounded-lg p-4 shadow-sm'>
              <div className='mb-4'>
                <label className='flex items-center space-x-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className='rounded border-gray-300 text-primary focus:ring-primary'
                  />
                  <span>Tandai sebagai Catatan Internal (Pengguna tidak akan melihat ini)</span>
                </label>
              </div>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={isInternal
                  ? 'Ketik catatan internal...'
                  : 'Ketik balasan ke pengguna...'}
                className={`w-full min-h-[120px] rounded-md border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  isInternal ? 'bg-yellow-50/50 border-yellow-200' : 'bg-background border-input'
                }`}
              />
              <div className='mt-4 flex justify-end'>
                <Button type='submit' disabled={isSubmitting || !replyContent.trim()}>
                  <Send className='h-4 w-4 mr-2' />
                  {isInternal ? 'Simpan Catatan' : 'Kirim Balasan'}
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className='space-y-6'>
          <Card className='p-6'>
            <h3 className='font-semibold mb-4 text-lg'>Detail Tiket</h3>
            <div className='space-y-4 text-sm'>
              <div>
                <span className='text-muted-foreground block mb-1'>Status</span>
                <select
                  value={ticket.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className='w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring capitalize'
                >
                  <option value='open'>Open</option>
                  <option value='in_progress'>In Progress</option>
                  <option value='resolved'>Resolved</option>
                  <option value='closed'>Closed</option>
                </select>
              </div>
              <div>
                <span className='text-muted-foreground block mb-1'>Kategori</span>
                <span className='capitalize font-medium'>{ticket.category}</span>
              </div>
              <div>
                <span className='text-muted-foreground block mb-1'>Prioritas</span>
                <span className='capitalize font-medium'>{ticket.priority}</span>
              </div>
              {ticket.orderId && (
                <div>
                  <span className='text-muted-foreground block mb-1'>Terkait Pesanan</span>
                  <Link
                    to={`/orders/${ticket.orderId}`}
                    className='text-primary hover:underline font-mono text-xs'
                  >
                    {ticket.orderId}
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
