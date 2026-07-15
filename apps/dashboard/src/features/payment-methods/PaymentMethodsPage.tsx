import React, { useState } from 'react';
import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { Button, Input, Label } from '@starsuperscare/ui';
import { CreditCard } from 'lucide-react';

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
      mutate();
    } catch (_err) {
      alert('Error menghapus metode pembayaran');
    }
  };

  const handleSimulateAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate tokenization (PCI-DSS compliance: never send raw card to our DB directly)
    // In a real app, this would use Stripe.js or Midtrans Snap to get a token
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

      mutate();
      setIsAdding(false);
      setCardNumber('');
      setExpDate('');
      setCvv('');
      setName('');
    } catch (_err) {
      alert('Terjadi kesalahan. Coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='max-w-4xl space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>Metode Pembayaran</h1>
        {!isAdding && <Button onClick={() => setIsAdding(true)}>Tambah Kartu</Button>}
      </div>

      {isAdding && (
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-lg font-semibold mb-4'>Tambah Kartu Baru (Simulasi Tokenisasi)</h2>
          <form onSubmit={handleSimulateAdd} className='space-y-4 max-w-md'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Nama pada Kartu</Label>
              <Input id='name' required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='cardNumber'>Nomor Kartu (Tidak akan disimpan di server kami)</Label>
              <Input
                id='cardNumber'
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={16}
                placeholder='1234123412341234'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='expDate'>Masa Berlaku (MM/YY)</Label>
                <Input
                  id='expDate'
                  required
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  placeholder='12/25'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='cvv'>CVV</Label>
                <Input
                  id='cvv'
                  required
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={4}
                  type='password'
                />
              </div>
            </div>
            <div className='flex space-x-4 pt-4'>
              <Button type='submit' disabled={isSaving}>
                {isSaving ? 'Menyimpan...' : 'Simpan (Tokenize)'}
              </Button>
              <Button type='button' variant='outline' onClick={() => setIsAdding(false)}>
                Batal
              </Button>
            </div>
            <p className='text-xs text-gray-500 mt-4'>
              Dalam implementasi nyata, form ini di-*host* oleh provider (seperti Stripe Elements)
              agar mematuhi standar PCI-DSS.
            </p>
          </form>
        </div>
      )}

      {isLoading
        ? <div>Memuat metode pembayaran...</div>
        : error
        ? <div className='text-red-500'>Gagal memuat.</div>
        : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {methods?.length === 0
              ? (
                <p className='text-gray-500 sm:col-span-3'>
                  Belum ada metode pembayaran tersimpan.
                </p>
              )
              : (
                methods?.map((m: any) => (
                  <div
                    key={m.id}
                    className='bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden'
                  >
                    <div className='absolute -right-4 -top-4 opacity-5'>
                      <CreditCard className='w-32 h-32' />
                    </div>
                    <div className='z-10 relative'>
                      <h3 className='font-semibold text-gray-900 flex items-center gap-2'>
                        <CreditCard className='w-5 h-5 text-gray-500' />
                        {m.displayMetadata?.brand || 'Card'}
                      </h3>
                      <p className='text-lg tracking-widest mt-4 font-mono text-gray-700'>
                        •••• {m.displayMetadata?.last4 || '****'}
                      </p>
                      <div className='flex justify-between items-center mt-2 text-sm text-gray-500'>
                        <span>{m.displayMetadata?.nameOnCard}</span>
                        <span>{m.displayMetadata?.expDate}</span>
                      </div>
                    </div>
                    <div className='mt-4 pt-2 border-t border-gray-100 flex justify-end z-10 relative'>
                      <button
                        type='button'
                        onClick={() => handleDelete(m.id)}
                        className='text-sm text-red-600 hover:text-red-900 font-medium'
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
          </div>
        )}
    </div>
  );
}
