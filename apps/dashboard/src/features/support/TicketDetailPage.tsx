import React, { useRef, useState } from 'react';
import useSWR from 'swr';
import { Link, useParams } from 'react-router-dom';
import { API_URL, client } from '../../lib/api.ts';
import { Button, Card, Input, toast } from '@starsuperscare/ui';
import { ArrowLeft, Download, File, Paperclip, Send } from 'lucide-react';

export const TicketDetailPage = () => {
  const { id } = useParams();
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: ticket, mutate, isLoading } = useSWR(
    `/api/tickets/${id}`,
    async () => {
      const res = await (client.v1 as any).support.tickets[':id'].$get({ param: { id } });
      if (!res.ok) throw new Error('Failed to load ticket');
      const json = await res.json();
      return json.data;
    },
  );

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() && attachments.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await (client.v1 as any).support.tickets[':id'].messages.$post({
        param: { id },
        json: {
          content: replyContent,
          isInternal: false,
          attachments,
        },
      });

      if (!res.ok) {
        throw new Error('Gagal mengirim balasan');
      }

      toast.success('Balasan terkirim');
      setReplyContent('');
      setAttachments([]);
      mutate();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_URL}/v1/support/attachments`, {
        method: 'POST',
        body: formData,
        // Using native fetch because hc client doesn't handle FormData perfectly for our custom route yet without openapi spec
        headers: {
          'Authorization': `Bearer ${(client as any).token || ''}`, // assuming token is handled via cookies mostly
        },
        credentials: 'include', // crucial for session cookies
      });

      if (!res.ok) throw new Error('Gagal mengunggah file');

      const json = await res.json();
      setAttachments([...attachments, json.data.id]);
      toast.success('File berhasil diunggah');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getMediaUrl = (key: string | null) => {
    if (!key) return null;
    return `${API_URL}/storage/${key}`;
  };

  if (isLoading) return <div>Memuat...</div>;
  if (!ticket) return <div>Tiket tidak ditemukan</div>;

  return (
    <div className='space-y-6 max-w-4xl mx-auto'>
      <div className='flex items-center space-x-4'>
        <Link to='/dashboard/support'>
          <Button variant='ghost' className='px-2'>
            <ArrowLeft className='h-4 w-4 mr-2' /> Kembali
          </Button>
        </Link>
      </div>

      <Card className='p-6'>
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h1 className='text-2xl font-bold'>{ticket.subject}</h1>
            <p className='text-muted-foreground mt-1'>
              Tiket #{ticket.id.slice(0, 8)} • Dibuat {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize
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
        </div>

        <div className='space-y-6 border-t pt-6'>
          {ticket.messages?.map((msg: any) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.senderId === ticket.userId ? 'items-end' : 'items-start'
              }`}
            >
              <div className='text-xs text-muted-foreground mb-1'>
                {msg.senderId === ticket.userId ? 'Anda' : 'Tim Support'} •{' '}
                {new Date(msg.createdAt).toLocaleString()}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.senderId === ticket.userId
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted rounded-tl-sm'
                }`}
              >
                <p className='whitespace-pre-wrap'>{msg.content}</p>

                {msg.attachments && msg.attachments.length > 0 && (
                  <div className='mt-3 space-y-2'>
                    {msg.attachments.map((att: any) => (
                      <a
                        key={att.id}
                        href={getMediaUrl(att.objectKey) || '#'}
                        target='_blank'
                        rel='noreferrer'
                        className='flex items-center p-2 bg-background/20 rounded border hover:bg-background/40 transition-colors text-sm'
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

      {ticket.status !== 'closed' && (
        <form onSubmit={handleReply} className='flex gap-2 items-end'>
          <div className='flex-1 space-y-2'>
            {attachments.length > 0 && (
              <div className='text-xs text-muted-foreground'>
                {attachments.length} file(s) siap dikirim
              </div>
            )}
            <Input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder='Tulis balasan...'
              className='h-12'
            />
          </div>
          <input
            type='file'
            ref={fileInputRef}
            className='hidden'
            onChange={handleFileUpload}
            accept='.jpg,.jpeg,.png,.pdf'
          />
          <Button
            type='button'
            variant='outline'
            className='h-12 w-12 p-0 shrink-0'
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingFile || isSubmitting}
          >
            <Paperclip className='h-5 w-5' />
          </Button>
          <Button type='submit' className='h-12 shrink-0' disabled={isSubmitting || uploadingFile}>
            <Send className='h-5 w-5 mr-2' />
            Kirim
          </Button>
        </form>
      )}
    </div>
  );
};
