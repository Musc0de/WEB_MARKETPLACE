import React, { useState } from 'react';
import { toast } from '@starsuperscare/ui';
import { client } from '../../lib/api.ts';
import {
  AlertCircle,
  CreditCard,
  HelpCircle,
  Loader2,
  MessageSquare,
  Package,
  Send,
  X,
} from 'lucide-react';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Extract a human-readable error message from any API response shape */
function extractApiError(body: any): string {
  if (!body) return 'Terjadi kesalahan tidak diketahui';
  // Shape: { error: { code, message, details } }
  if (body.error && typeof body.error === 'object') {
    const { message, details } = body.error;
    if (details && Array.isArray(details)) {
      return details.map((d: any) => d.message ?? String(d)).join(', ');
    }
    return typeof message === 'string' ? message : 'Validasi gagal';
  }
  // Shape: { error: "string" }
  if (typeof body.error === 'string') return body.error;
  // Shape: { message: "string" }
  if (typeof body.message === 'string') return body.message;
  return 'Terjadi kesalahan tidak diketahui';
}

const CATEGORIES = [
  { value: 'general', label: 'Pertanyaan Umum', icon: HelpCircle, color: 'text-blue-600' },
  { value: 'order', label: 'Masalah Pesanan', icon: Package, color: 'text-amber-600' },
  { value: 'payment', label: 'Pembayaran', icon: CreditCard, color: 'text-emerald-600' },
  { value: 'product', label: 'Pertanyaan Produk', icon: MessageSquare, color: 'text-purple-600' },
];

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SupportTicketModal = ({ isOpen, onClose, onSuccess }: SupportTicketModalProps) => {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    orderId: '',
    message: '',
  });

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.subject.trim() || formData.subject.trim().length < 5) {
      errors.subject = 'Subjek minimal 5 karakter';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Pesan minimal 10 karakter';
    }
    if (formData.orderId.trim() && !UUID_REGEX.test(formData.orderId.trim())) {
      errors.orderId = 'ID Pesanan harus berformat UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: any = {
        subject: formData.subject.trim(),
        category: formData.category,
        message: formData.message.trim(),
      };
      if (formData.orderId.trim()) {
        payload.orderId = formData.orderId.trim();
      }

      const res = await (client.v1 as any).support.tickets.$post({ json: payload });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(extractApiError(body));
      }

      toast.success('✅ Tiket berhasil dibuat! Tim kami akan merespons segera.');
      setFormData({ subject: '', category: 'general', orderId: '', message: '' });
      setFieldErrors({});
      onSuccess();
    } catch (err: any) {
      toast.error(typeof err?.message === 'string' ? err.message : 'Gagal membuat tiket');
    } finally {
      setLoading(false);
    }
  };

  const set =
    (key: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [key]: e.target.value }));
      if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: '' }));
    };

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={!loading ? onClose : undefined}
      />

      {/* Panel */}
      <div
        className='relative w-full max-w-lg rounded-2xl bg-white shadow-2xl'
        style={{ animation: 'modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both' }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>
          {`@keyframes modalIn{from{opacity:0;transform:scale(0.9) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}
        </style>

        {/* Header */}
        <div className='flex items-start justify-between border-b border-gray-100 px-6 py-5'>
          <div>
            <h2 className='text-lg font-black text-gray-900'>Buat Tiket Bantuan</h2>
            <p className='mt-0.5 text-sm text-gray-500'>Tim support kami siap membantu Anda.</p>
          </div>
          <button
            type='button'
            onClick={onClose}
            disabled={loading}
            className='rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition disabled:opacity-50'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='px-6 py-5 space-y-5'>
          {/* Category tabs */}
          <div>
            <label className='mb-2 block text-sm font-semibold text-gray-700'>Kategori</label>
            <div className='grid grid-cols-2 gap-2'>
              {CATEGORIES.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type='button'
                  onClick={() => setFormData((p) => ({ ...p, category: value }))}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                    formData.category === value
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${formData.category === value ? 'text-white' : color}`}
                  />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-gray-700'>
              Subjek <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              required
              value={formData.subject}
              onChange={set('subject')}
              placeholder='Contoh: Barang yang diterima rusak'
              className={`w-full rounded-xl border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition ${
                fieldErrors.subject
                  ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-500/15'
                  : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:ring-blue-500/15 focus:bg-white'
              }`}
            />
            {fieldErrors.subject && (
              <p className='mt-1 flex items-center gap-1 text-xs text-red-600'>
                <AlertCircle className='h-3 w-3' /> {fieldErrors.subject}
              </p>
            )}
          </div>

          {/* Order ID */}
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-gray-700'>
              ID Pesanan <span className='text-gray-400 font-normal'>(Opsional)</span>
            </label>
            <input
              type='text'
              value={formData.orderId}
              onChange={set('orderId')}
              placeholder='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
              className={`w-full rounded-xl border px-4 py-2.5 text-sm font-mono placeholder:text-gray-300 focus:outline-none focus:ring-2 transition ${
                fieldErrors.orderId
                  ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-500/15'
                  : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:ring-blue-500/15 focus:bg-white'
              }`}
            />
            {fieldErrors.orderId
              ? (
                <p className='mt-1 flex items-center gap-1 text-xs text-red-600'>
                  <AlertCircle className='h-3 w-3' /> {fieldErrors.orderId}
                </p>
              )
              : (
                <p className='mt-1 text-xs text-gray-400'>
                  Kosongkan jika tidak terkait pesanan tertentu.
                </p>
              )}
          </div>

          {/* Message */}
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-gray-700'>
              Pesan <span className='text-red-500'>*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={set('message')}
              placeholder='Deskripsikan masalah Anda secara detail...'
              className={`w-full resize-none rounded-xl border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition ${
                fieldErrors.message
                  ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-500/15'
                  : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:ring-blue-500/15 focus:bg-white'
              }`}
            />
            <div className='flex items-center justify-between mt-1'>
              {fieldErrors.message
                ? (
                  <p className='flex items-center gap-1 text-xs text-red-600'>
                    <AlertCircle className='h-3 w-3' /> {fieldErrors.message}
                  </p>
                )
                : <span />}
              <span
                className={`text-xs tabular-nums ${
                  formData.message.length < 10 ? 'text-gray-400' : 'text-emerald-600'
                }`}
              >
                {formData.message.length} kar
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className='flex items-center justify-end gap-2.5 border-t border-gray-100 pt-4'>
            <button
              type='button'
              onClick={onClose}
              disabled={loading}
              className='rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition disabled:opacity-50'
            >
              Batal
            </button>
            <button
              type='submit'
              disabled={loading}
              className='inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition disabled:opacity-60'
            >
              {loading
                ? <Loader2 className='h-4 w-4 animate-spin' />
                : <Send className='h-4 w-4' />}
              {loading ? 'Mengirim…' : 'Kirim Tiket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
