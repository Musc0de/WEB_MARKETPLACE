import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { simulateWebhook, usePaymentIntent } from '../api/useCheckout.ts';
import type { WebhookPayload } from '@starsuperscare/contracts';
import { formatIDR } from '@starsuperscare/ui';

export function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { trigger: createIntent, isMutating: isLoadingIntent } = usePaymentIntent();

  const [intent, setIntent] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      createIntent({ orderId })
        .then((res) => {
          setIntent(res);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [orderId, createIntent]);

  const handleSimulatePayment = async (success: boolean) => {
    if (!intent || !orderId) return;

    setIsProcessing(true);

    // In a real app, this is where we'd submit card details to Stripe/Midtrans,
    // and they would send the webhook. Since it's a sandbox, we simulate the webhook locally.

    try {
      const payload = {
        providerEventId: `evt_${Date.now()}`,
        type: success ? 'payment_success' : 'payment_failed',
        data: {
          providerTransactionId: intent.providerTransactionId,
          orderId: orderId,
        },
      };

      // Backend generates the signature and triggers the webhook locally
      await simulateWebhook(payload as WebhookPayload);
    } catch (err: any) {
      setError(err.message);
    } finally {
      // Go to status page to poll backend
      navigate(`/payment/status?orderId=${orderId}`);
    }
  };

  if (isLoadingIntent && !intent) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-gray-500' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center p-8 text-center'>
        <h1 className='text-2xl font-bold text-red-600 mb-4'>Gagal Memuat Pembayaran</h1>
        <p className='text-gray-600 mb-6'>{error}</p>
        <button
          type='button'
          onClick={() => navigate('/')}
          className='px-6 py-2 bg-black text-white rounded-xl'
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  if (!intent) return null;

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4'>
      <div className='max-w-xl mx-auto'>
        <div className='bg-white rounded-3xl p-8 shadow-sm border border-gray-100'>
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4'>
              <CreditCard className='w-8 h-8' />
            </div>
            <h1 className='text-2xl font-bold mb-2'>Pembayaran Pesanan</h1>
            <p className='text-gray-500'>Selesaikan pembayaran untuk pesanan Anda</p>
          </div>

          <div className='bg-gray-50 p-6 rounded-2xl mb-8 flex justify-between items-center'>
            <span className='font-medium text-gray-600'>Total Pembayaran</span>
            <span className='text-2xl font-bold text-black'>{formatIDR(intent.amount)}</span>
          </div>

          <div className='space-y-4'>
            <h3 className='font-bold mb-2 flex items-center gap-2'>
              <ShieldCheck className='w-5 h-5 text-green-500' />
              Sandbox / Mode Testing
            </h3>
            <p className='text-sm text-gray-500 mb-6'>
              Ini adalah lingkungan sandbox. Tidak ada tagihan nyata yang akan dilakukan. Anda dapat
              mensimulasikan pembayaran yang berhasil atau gagal di bawah ini.
            </p>

            <button
              type='button'
              onClick={() => handleSimulatePayment(true)}
              disabled={isProcessing}
              className='w-full bg-black text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center'
            >
              {isProcessing
                ? <Loader2 className='w-5 h-5 animate-spin' />
                : 'Simulasi Pembayaran Berhasil'}
            </button>

            <button
              type='button'
              onClick={() => handleSimulatePayment(false)}
              disabled={isProcessing}
              className='w-full bg-red-50 text-red-600 px-6 py-4 rounded-xl font-bold text-lg hover:bg-red-100 disabled:opacity-50 flex items-center justify-center'
            >
              Simulasi Pembayaran Gagal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
