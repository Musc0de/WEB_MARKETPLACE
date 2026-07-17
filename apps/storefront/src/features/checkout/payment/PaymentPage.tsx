import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Building2,
  Check,
  Copy,
  CreditCard,
  Loader2,
  QrCode,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { checkPaymentStatus, simulateWebhook, usePaymentIntent } from '../api/useCheckout.ts';
import type { WebhookPayload } from '@starsuperscare/contracts';
import { formatIDR } from '@starsuperscare/ui';
import { QRCodeSVG } from 'qrcode.react';

export function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { trigger: createIntent, isMutating: isLoadingIntent } = usePaymentIntent();

  const [intent, setIntent] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [selectedMethod, setSelectedMethod] = useState('QRIS');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderId) {
      createIntent({ orderId, paymentType: selectedMethod })
        .then((res) => {
          setIntent(res);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [orderId, selectedMethod]);

  // Polling for Louvin integration
  useEffect(() => {
    if (!intent?.paymentId) return;

    // Skip polling if this is a Sandbox intent with a clientSecret (we have manual buttons for it)
    if (intent.clientSecret && !intent.instructionPayload) return;

    const intervalId = setInterval(async () => {
      try {
        const status = await checkPaymentStatus(intent.paymentId);
        if (status === 'success' || status === 'paid') {
          clearInterval(intervalId);
          navigate(`/payment/status?orderId=${orderId}`);
        } else if (status === 'failed') {
          clearInterval(intervalId);
          navigate(`/payment/status?orderId=${orderId}`);
        }
      } catch (_e) {
        // Ignore poll errors
      }
    }, 5000); // Poll every 5s

    return () => clearInterval(intervalId);
  }, [intent, orderId, navigate]);

  const handleSimulatePayment = async (success: boolean) => {
    if (!intent || !orderId) return;

    setIsProcessing(true);

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
      navigate(`/payment/status?orderId=${orderId}`);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderInstruction = () => {
    if (!intent?.instructionPayload) return null;

    const payload = intent.instructionPayload;
    const qrString = typeof payload === 'string'
      ? payload
      : (payload.qr_code || payload.qrCode || payload.qrString || JSON.stringify(payload));
    const vaNumber = typeof payload === 'string'
      ? payload
      : (payload.va_number || payload.vaNumber || payload.account_number ||
        JSON.stringify(payload));
    const checkoutUrl = typeof payload === 'string'
      ? payload
      : (payload.checkout_url || payload.checkoutUrl || payload.url || JSON.stringify(payload));

    if (selectedMethod === 'QRIS') {
      return (
        <div className='flex flex-col items-center justify-center space-y-6 pt-4'>
          <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative group overflow-hidden transition-all duration-300 hover:shadow-md'>
            <div className='absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out' />
            <div className='relative z-10 bg-white p-4 rounded-xl border border-gray-100'>
              <QRCodeSVG value={qrString} size={220} level='M' includeMargin={false} />
            </div>
          </div>
          <p className='text-sm text-gray-600 max-w-xs text-center font-medium leading-relaxed'>
            Buka aplikasi M-Banking atau E-Wallet Anda dan scan QR Code di atas.
          </p>
        </div>
      );
    }

    if (selectedMethod === 'VA') {
      return (
        <div className='flex flex-col items-center space-y-6 pt-4'>
          <p className='text-sm font-medium text-gray-500'>Nomor Virtual Account</p>
          <div className='flex items-center gap-4 bg-gray-50/80 px-8 py-5 rounded-3xl border border-gray-200 shadow-inner group'>
            <span className='text-3xl font-mono font-bold tracking-[0.2em] text-gray-900 group-hover:text-blue-600 transition-colors'>
              {vaNumber}
            </span>
            <button
              type='button'
              onClick={() => handleCopy(vaNumber)}
              className='p-3 hover:bg-white rounded-2xl transition-all duration-200 shadow-sm border border-transparent hover:border-gray-200 hover:scale-105 active:scale-95'
              title='Salin Nomor VA'
            >
              {copied
                ? <Check className='w-6 h-6 text-green-600' />
                : <Copy className='w-6 h-6 text-gray-500' />}
            </button>
          </div>
          <p className='text-xs text-gray-400 text-center max-w-xs'>
            Salin nomor di atas dan gunakan menu Transfer &gt; Virtual Account di aplikasi bank
            Anda.
          </p>
        </div>
      );
    }

    if (selectedMethod === 'EWALLET') {
      const isUrl = checkoutUrl.startsWith('http') || checkoutUrl.startsWith('intent://');
      return (
        <div className='flex flex-col items-center space-y-6 pt-4'>
          <p className='text-sm font-medium text-gray-600 text-center max-w-sm leading-relaxed'>
            Klik tombol di bawah ini untuk dialihkan ke aplikasi E-Wallet Anda dan menyelesaikan
            pembayaran.
          </p>
          {isUrl
            ? (
              <a
                href={checkoutUrl}
                target='_blank'
                rel='noreferrer'
                className='px-10 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-900 transition-all shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-95 duration-200 flex items-center gap-3'
              >
                <Smartphone className='w-5 h-5' />
                Buka Aplikasi E-Wallet
              </a>
            )
            : (
              <div className='bg-gray-50 p-6 rounded-2xl font-mono text-sm break-all text-center border border-gray-200 shadow-inner w-full max-w-sm'>
                {checkoutUrl}
              </div>
            )}
        </div>
      );
    }

    return (
      <div className='bg-white p-4 rounded-2xl border border-gray-200 font-mono text-sm break-all shadow-sm'>
        {JSON.stringify(payload, null, 2)}
      </div>
    );
  };

  if (isLoadingIntent && !intent) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50/50'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin' />
          <p className='text-sm font-medium text-gray-500 animate-pulse'>
            Menyiapkan pembayaran...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-transparent'>
        <div className='bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 max-w-lg w-full relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-48 h-48 bg-red-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2' />

          <div className='w-20 h-20 bg-gradient-to-br from-red-50 to-orange-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-red-100/50 rotate-3 transition-transform hover:rotate-6'>
            <ShieldCheck className='w-10 h-10' />
          </div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight'>
            Transaksi Tertunda
          </h1>
          <p className='text-gray-500 mb-10 leading-relaxed text-sm md:text-base px-2'>{error}</p>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='w-full px-6 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-900 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/10'
          >
            Kembali Belanja
          </button>
        </div>
      </div>
    );
  }

  if (!intent) return null;

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50 py-12 px-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden'>
          {/* Subtle background decoration */}
          <div className='absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2' />

          <div className='text-center mb-10'>
            <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20 rotate-3 transition-transform hover:rotate-6'>
              <CreditCard className='w-10 h-10' />
            </div>
            <h1 className='text-3xl font-bold text-gray-900 mb-3 tracking-tight'>
              Pembayaran Pesanan
            </h1>
            <p className='text-gray-500 font-medium'>Selesaikan pembayaran untuk pesanan Anda</p>
          </div>

          <div className='bg-gray-900 text-white p-8 rounded-[2rem] mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4 shadow-2xl shadow-gray-900/10'>
            <div>
              <span className='block text-gray-400 font-medium text-sm mb-1'>Total Pembayaran</span>
              <span className='text-3xl font-bold tracking-tight'>{formatIDR(intent.amount)}</span>
            </div>
            {intent.expiresAt && (
              <div className='bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm'>
                <span className='block text-gray-300 text-xs mb-1'>Jatuh Tempo</span>
                <span className='text-sm font-medium'>
                  {new Date(intent.expiresAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} WIB
                </span>
              </div>
            )}
          </div>

          {!intent.instructionPayload && intent.clientSecret
            ? (
              <div className='space-y-6'>
                <div className='flex items-center gap-3 justify-center mb-8'>
                  <ShieldCheck className='w-6 h-6 text-green-500' />
                  <h3 className='font-bold text-lg text-gray-900'>Sandbox / Mode Testing</h3>
                </div>
                <p className='text-gray-500 mb-8 text-center leading-relaxed px-4'>
                  Ini adalah lingkungan sandbox. Tidak ada tagihan nyata yang akan dilakukan. Anda
                  dapat mensimulasikan pembayaran yang berhasil atau gagal di bawah ini.
                </p>

                <div className='grid grid-cols-1 gap-4'>
                  <button
                    type='button'
                    onClick={() => handleSimulatePayment(true)}
                    disabled={isProcessing}
                    className='w-full bg-black text-white px-6 py-5 rounded-2xl font-bold text-lg hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/10'
                  >
                    {isProcessing
                      ? <Loader2 className='w-6 h-6 animate-spin' />
                      : 'Simulasi Pembayaran Berhasil'}
                  </button>

                  <button
                    type='button'
                    onClick={() => handleSimulatePayment(false)}
                    disabled={isProcessing}
                    className='w-full bg-white text-red-600 px-6 py-5 rounded-2xl font-bold text-lg hover:bg-red-50 disabled:opacity-50 flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95 border-2 border-red-100'
                  >
                    Simulasi Pembayaran Gagal
                  </button>
                </div>
              </div>
            )
            : (
              <div className='space-y-10'>
                <div>
                  <h3 className='font-bold text-gray-900 mb-4 text-center'>
                    Pilih Metode Pembayaran
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <button
                      type='button'
                      className={`group p-5 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden ${
                        selectedMethod === 'QRIS'
                          ? 'border-black bg-black text-white shadow-lg shadow-black/10'
                          : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedMethod('QRIS')}
                    >
                      <QrCode
                        className={`w-7 h-7 mx-auto mb-3 transition-transform group-hover:scale-110 ${
                          selectedMethod === 'QRIS' ? 'text-white' : 'text-gray-900'
                        }`}
                      />
                      <span className='block font-bold text-sm tracking-wide'>QRIS</span>
                    </button>
                    <button
                      type='button'
                      className={`group p-5 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden ${
                        selectedMethod === 'VA'
                          ? 'border-black bg-black text-white shadow-lg shadow-black/10'
                          : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedMethod('VA')}
                    >
                      <Building2
                        className={`w-7 h-7 mx-auto mb-3 transition-transform group-hover:scale-110 ${
                          selectedMethod === 'VA' ? 'text-white' : 'text-gray-900'
                        }`}
                      />
                      <span className='block font-bold text-sm tracking-wide'>VIRTUAL ACC</span>
                    </button>
                    <button
                      type='button'
                      className={`group p-5 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden ${
                        selectedMethod === 'EWALLET'
                          ? 'border-black bg-black text-white shadow-lg shadow-black/10'
                          : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedMethod('EWALLET')}
                    >
                      <Smartphone
                        className={`w-7 h-7 mx-auto mb-3 transition-transform group-hover:scale-110 ${
                          selectedMethod === 'EWALLET' ? 'text-white' : 'text-gray-900'
                        }`}
                      />
                      <span className='block font-bold text-sm tracking-wide'>E-WALLET</span>
                    </button>
                  </div>
                </div>

                {intent.instructionPayload && (
                  <div className='bg-white border border-gray-100 shadow-xl shadow-gray-200/40 p-8 rounded-[2rem] relative'>
                    {renderInstruction()}

                    <div className='mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-3'>
                      <div className='relative flex h-3 w-3'>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75'>
                        </span>
                        <span className='relative inline-flex rounded-full h-3 w-3 bg-blue-500'>
                        </span>
                      </div>
                      <p className='text-sm font-medium text-gray-500'>
                        Menunggu konfirmasi pembayaran...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
