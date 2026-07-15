import React, { useState } from 'react';
import { Button, Dialog, Input, toast } from '@starsuperscare/ui';
import { client } from '../../lib/api.ts';

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SupportTicketModal = ({ isOpen, onClose, onSuccess }: SupportTicketModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    orderId: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = {
        subject: formData.subject,
        category: formData.category,
        message: formData.message,
      };

      if (formData.orderId.trim() !== '') {
        payload.orderId = formData.orderId.trim();
      }

      const res = await (client.v1 as any).support.tickets.$post({
        json: payload,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal membuat tiket');
      }

      toast.success('Tiket berhasil dibuat');
      setFormData({ subject: '', category: 'general', orderId: '', message: '' });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title='Buat Tiket Bantuan'
      description='Jelaskan masalah Anda secara detail agar tim kami dapat membantu dengan cepat.'
    >
      <form onSubmit={handleSubmit} className='space-y-4 py-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Subjek</label>
          <Input
            required
            placeholder='Contoh: Barang yang diterima rusak'
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Kategori</label>
          <select
            className='flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value='general'>Pertanyaan Umum</option>
            <option value='order'>Masalah Pesanan</option>
            <option value='product'>Pertanyaan Produk</option>
            <option value='payment'>Pembayaran</option>
          </select>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>ID Pesanan (Opsional)</label>
          <Input
            placeholder='UUID Pesanan'
            value={formData.orderId}
            onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
          />
          <p className='text-xs text-muted-foreground'>
            Kosongkan jika tidak berhubungan dengan pesanan tertentu.
          </p>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Pesan</label>
          <textarea
            required
            className='flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            placeholder='Deskripsikan masalah Anda...'
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <div className='flex justify-end gap-2 pt-4'>
          <Button type='button' variant='outline' onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button type='submit' disabled={loading}>
            {loading ? 'Mengirim...' : 'Kirim Tiket'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
