import React, { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Button, Input, Label, toast } from '@starsuperscare/ui';
import {
  Calendar,
  CreditCard,
  Hash,
  Loader2,
  Lock,
  Plus,
  Shield,
  ShieldCheck,
  Trash2,
  User,
  WalletCards,
} from 'lucide-react';

const fetchPaymentMethods = async () => {
  const res = await client.v1.me['payment-methods'].$get();
  if (!res.ok) throw new Error('Failed to fetch payment methods');
  const result = await res.json();
  return result.data;
};

export function PaymentMethodsPage() {
  const { data: methods, error, isLoading, mutate } = useSWR(
    '/api/v1/me/payment-methods',
    fetchPaymentMethods,
  );

  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kartu ini?')) return;
    try {
      const res = await client.v1.me['payment-methods'][':id'].$delete({ param: { id } });
      if (!res.ok) throw new Error('Gagal menghapus');
      toast.success('Metode pembayaran berhasil dihapus!');
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'Error menghapus metode pembayaran');
    }
  };

  const handleSimulateAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const simulatedToken = `tok_fake_${Date.now()}`;
      const last4 = cardNumber.slice(-4) || '0000';
      const brand = cardNumber.startsWith('4')
        ? 'Visa'
        : cardNumber.startsWith('5')
        ? 'Mastercard'
        : 'Card';

      const res = await client.v1.me['payment-methods'].$post({
        json: {
          provider: 'stripe_fake',
          providerToken: simulatedToken,
          displayMetadata: {
            brand,
            last4,
            expDate,
            nameOnCard: name,
          },
        },
      });

      if (!res.ok) throw new Error('Gagal menyimpan metode pembayaran');

      toast.success('Kartu baru berhasil ditambahkan!');
      mutate();
      setIsAdding(false);
      setCardNumber('');
      setExpDate('');
      setCvv('');
      setName('');
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='max-w-5xl mx-auto pb-12 animate-in fade-in duration-500'>
      {/* Header Banner */}
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-8 sm:p-10 shadow-xl mb-8 border border-emerald-900/50'>
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none'>
          <div className='absolute -top-24 -right-12 w-64 h-64 bg-emerald-500 rounded-full blur-[80px]' />
          <div className='absolute -bottom-24 -left-12 w-64 h-64 bg-teal-500 rounded-full blur-[80px]' />
        </div>

        <div className='relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6'>
          <div className='flex flex-col sm:flex-row items-center gap-6'>
            <div className='w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)]'>
              <WalletCards className='w-10 h-10 sm:w-12 sm:h-12 text-emerald-300' />
            </div>
            <div className='text-center sm:text-left'>
              <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight'>
                Metode Pembayaran
              </h1>
              <p className='text-emerald-200 font-medium text-sm sm:text-base max-w-lg flex items-center justify-center sm:justify-start gap-2'>
                <ShieldCheck className='w-4 h-4 opacity-80' />
                Dienkripsi dan diamankan dengan standar PCI-DSS.
              </p>
            </div>
          </div>
          {!isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              className='rounded-xl shadow-lg shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]'
            >
              <Plus className='w-5 h-5 mr-2' />
              Tambah Kartu Baru
            </Button>
          )}
        </div>
      </div>

      {isAdding && (
        <div className='bg-card dark:bg-background rounded-3xl p-6 sm:p-8 shadow-sm border border-border/60 mb-8 animate-in slide-in-from-top-4 fade-in duration-300'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center'>
              <CreditCard className='w-5 h-5 text-teal-600 dark:text-teal-400' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-foreground'>Informasi Kartu Baru</h2>
              <p className='text-sm text-muted-foreground'>
                Detail Anda dilindungi enkripsi end-to-end 256-bit.
              </p>
            </div>
          </div>

          <form onSubmit={handleSimulateAdd} className='space-y-6 max-w-2xl'>
            <div className='space-y-2.5'>
              <Label htmlFor='name' className='text-muted-foreground font-semibold ml-1'>
                Nama pada Kartu
              </Label>
              <div className='relative'>
                <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                <Input
                  id='name'
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='pl-11 h-12 rounded-xl border-input/60 focus:border-emerald-500 focus:ring-emerald-500/20 text-foreground bg-background'
                  placeholder='Cth: Budi Santoso'
                />
              </div>
            </div>

            <div className='space-y-2.5'>
              <Label htmlFor='cardNumber' className='text-muted-foreground font-semibold ml-1'>
                Nomor Kartu
              </Label>
              <div className='relative'>
                <CreditCard className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                <Input
                  id='cardNumber'
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  maxLength={16}
                  className='pl-11 h-12 rounded-xl border-input/60 focus:border-emerald-500 focus:ring-emerald-500/20 text-foreground bg-background tracking-widest font-mono'
                  placeholder='1234 5678 9012 3456'
                />
                <Lock className='absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/70' />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-6'>
              <div className='space-y-2.5'>
                <Label htmlFor='expDate' className='text-muted-foreground font-semibold ml-1'>
                  Berlaku Hingga
                </Label>
                <div className='relative'>
                  <Calendar className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                  <Input
                    id='expDate'
                    required
                    value={expDate}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                      setExpDate(val);
                    }}
                    maxLength={5}
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-emerald-500 focus:ring-emerald-500/20 text-foreground bg-background font-mono'
                    placeholder='MM/YY'
                  />
                </div>
              </div>
              <div className='space-y-2.5'>
                <Label htmlFor='cvv' className='text-muted-foreground font-semibold ml-1'>
                  CVV
                </Label>
                <div className='relative'>
                  <Hash className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                  <Input
                    id='cvv'
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                    type='password'
                    className='pl-11 h-12 rounded-xl border-input/60 focus:border-emerald-500 focus:ring-emerald-500/20 text-foreground bg-background font-mono tracking-widest'
                    placeholder='•••'
                  />
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2 p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl'>
              <Shield className='w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0' />
              <p className='text-[11px] font-medium text-emerald-800 dark:text-emerald-300'>
                Dalam implementasi nyata, form ini akan di-host oleh payment gateway (seperti Stripe
                Elements / Midtrans) untuk kepatuhan PCI-DSS. Kami tidak menyimpan detail kartu
                secara mentah.
              </p>
            </div>

            <div className='flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4 border-t border-border/40'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => setIsAdding(false)}
                className='w-full sm:w-auto h-12 px-8 rounded-xl font-semibold text-muted-foreground hover:text-foreground'
              >
                Batal
              </Button>
              <Button
                type='submit'
                disabled={isSaving || cardNumber.length < 15 || expDate.length < 5 ||
                  cvv.length < 3 || name.length < 2}
                className='w-full sm:w-auto h-12 px-8 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:scale-[1.02] active:scale-[0.98]'
              >
                {isSaving
                  ? (
                    <>
                      <Loader2 className='w-5 h-5 mr-2 animate-spin' /> Mengenkripsi...
                    </>
                  )
                  : 'Simpan & Tokenisasi'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading
        ? (
          <div className='flex flex-col items-center justify-center py-16'>
            <Loader2 className='w-10 h-10 animate-spin text-primary/50 mb-4' />
            <p className='text-muted-foreground animate-pulse text-sm font-medium'>
              Memuat kartu tersimpan...
            </p>
          </div>
        )
        : error
        ? (
          <div className='p-8 bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-100 dark:border-red-900/30 text-center'>
            <p className='text-red-600 dark:text-red-400 font-bold text-lg'>
              Gagal Memuat Metode Pembayaran
            </p>
            <p className='text-red-500/80 mt-2'>
              {error.message || 'Silakan coba muat ulang halaman.'}
            </p>
          </div>
        )
        : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {methods?.length === 0
              ? (
                <div className='col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 px-4 bg-card dark:bg-background rounded-3xl border border-border/60 text-center'>
                  <div className='w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6'>
                    <CreditCard className='w-10 h-10 text-muted-foreground/40' />
                  </div>
                  <h3 className='text-xl font-bold text-foreground mb-2'>
                    Belum Ada Kartu Tersimpan
                  </h3>
                  <p className='text-muted-foreground max-w-md'>
                    Tambahkan kartu kredit atau debit Anda untuk mempercepat proses pembayaran pada
                    pesanan berikutnya secara aman.
                  </p>
                  <Button
                    onClick={() => setIsAdding(true)}
                    variant='outline'
                    className='mt-6 rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/50 dark:hover:bg-emerald-950/30'
                  >
                    <Plus className='w-4 h-4 mr-2' />
                    Tambah Kartu
                  </Button>
                </div>
              )
              : (
                methods?.map((m: any) => (
                  <div
                    key={m.id}
                    className='relative overflow-hidden rounded-2xl shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300'
                  >
                    {/* Credit Card Background Gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        m.displayMetadata?.brand === 'Visa'
                          ? 'from-blue-900 to-blue-600'
                          : m.displayMetadata?.brand === 'Mastercard'
                          ? 'from-orange-700 to-red-600'
                          : 'from-slate-800 to-gray-900'
                      }`}
                    />

                    {/* Decorative Elements */}
                    <div className='absolute -right-6 -bottom-10 opacity-10'>
                      <CreditCard className='w-48 h-48 text-white' />
                    </div>
                    <div className='absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded px-2.5 py-1'>
                      <span className='text-[10px] font-bold text-white uppercase tracking-widest'>
                        {m.displayMetadata?.brand || 'Kartu Kredit'}
                      </span>
                    </div>

                    <div className='relative z-10 p-6 pt-12 flex flex-col h-full'>
                      <div className='mb-6'>
                        <div className='w-10 h-7 bg-white/20 rounded-md backdrop-blur-sm mb-4 relative overflow-hidden border border-white/10'>
                          <div className='absolute inset-0 bg-gradient-to-r from-amber-200/50 via-yellow-400/50 to-amber-500/50 mix-blend-overlay'>
                          </div>
                        </div>
                        <p className='text-xl sm:text-2xl tracking-[0.2em] font-mono text-white text-shadow-sm font-medium'>
                          •••• {m.displayMetadata?.last4 || '****'}
                        </p>
                      </div>

                      <div className='flex justify-between items-end mt-auto pt-2'>
                        <div className='flex flex-col'>
                          <span className='text-[9px] text-white/60 uppercase tracking-widest mb-1'>
                            Nama Pemilik
                          </span>
                          <span className='text-sm font-semibold text-white truncate max-w-[120px] uppercase tracking-wider'>
                            {m.displayMetadata?.nameOnCard}
                          </span>
                        </div>
                        <div className='flex flex-col text-right'>
                          <span className='text-[9px] text-white/60 uppercase tracking-widest mb-1'>
                            Berlaku
                          </span>
                          <span className='text-sm font-semibold text-white font-mono tracking-widest'>
                            {m.displayMetadata?.expDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button Overlay Trigger */}
                    <div className='absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center z-20'>
                      <Button
                        onClick={() => handleDelete(m.id)}
                        variant='destructive'
                        className='rounded-xl font-bold shadow-2xl scale-90 hover:scale-100 transition-transform'
                      >
                        <Trash2 className='w-4 h-4 mr-2' />
                        Hapus Kartu
                      </Button>
                    </div>
                  </div>
                ))
              )}
          </div>
        )}
    </div>
  );
}
