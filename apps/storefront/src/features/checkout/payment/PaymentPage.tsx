import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
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
import { API_URL } from '../../../lib/api.ts';

export function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { trigger: createIntent, isMutating: isLoadingIntent } = usePaymentIntent();

  const [intent, setIntent] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [selectedMethod, setSelectedMethod] = useState('QRIS');
  const [copied, setCopied] = useState(false);

  const intentLock = useRef<string | null>(null);

  useEffect(() => {
    if (orderId && intentLock.current !== selectedMethod) {
      intentLock.current = selectedMethod;
      createIntent({ orderId, paymentType: selectedMethod })
        .then((res) => {
          setIntent(res);
        })
        .catch((err) => {
          setError(err.message);
          intentLock.current = null; // unlock on error to allow retry
        });
    }
  }, [orderId, selectedMethod]);

  const isManualSandbox = intent?.clientSecret && !intent?.instructionPayload;
  const shouldPoll = intent?.paymentId && !isManualSandbox;

  // SSE for real-time status updates (Primary)
  useEffect(() => {
    if (!orderId || !intent?.paymentId || isManualSandbox) return;

    const baseUrl = API_URL.replace(/\/$/, '');
    const eventSource = new EventSource(`${baseUrl}/v1/notifications/stream`, {
      withCredentials: true,
    });

    eventSource.addEventListener('payment.success', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.orderId === orderId) {
          navigate(`/payment/status?orderId=${orderId}`);
        }
      } catch (_e) {
        // ignore
      }
    });

    return () => {
      eventSource.close();
    };
  }, [intent, orderId, navigate, isManualSandbox]);

  // Fallback Polling using SWR (disabled automatic interval) in case SSE drops.
  // It will natively revalidate on window focus.
  const { data: statusData } = useSWR(
    shouldPoll ? ['payment-status', intent.paymentId] : null,
    () => checkPaymentStatus(intent.paymentId),
    {
      dedupingInterval: 15000,
      revalidateOnFocus: true,
    },
  );

  useEffect(() => {
    if (statusData === 'success' || statusData === 'paid' || statusData === 'failed') {
      navigate(`/payment/status?orderId=${orderId}`);
    }
  }, [statusData, navigate, orderId]);

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
        <section
          className='flex flex-col items-center justify-center pt-2 md:pt-4'
          aria-label='Instruksi QRIS'
        >
          <div className='bg-white p-3 md:p-4 rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.1)] border-4 border-slate-800/50 mb-4 md:mb-6 group transition-all duration-500 hover:scale-105 hover:border-indigo-500/30'>
            <QRCodeSVG
              value={qrString}
              size={180}
              level='M'
              includeMargin={false}
              aria-label='QR Code Pembayaran'
            />
          </div>
          <p className='text-xs md:text-sm text-slate-300 max-w-xs text-center font-medium leading-relaxed bg-slate-900/50 py-2.5 md:py-3 px-4 rounded-2xl border border-slate-800'>
            Buka aplikasi M-Banking atau E-Wallet Anda dan scan QR Code di atas.
          </p>
        </section>
      );
    }

    if (selectedMethod === 'VA') {
      return (
        <section className='flex flex-col items-center pt-2' aria-label='Instruksi Virtual Account'>
          <p className='text-sm font-semibold text-gray-400 mb-4 tracking-wide uppercase'>
            Nomor Virtual Account
          </p>
          <div className='flex items-center gap-4 bg-gray-50/80 px-6 py-4 rounded-[2rem] border border-gray-200 shadow-inner group mb-6 w-full justify-center'>
            <span
              className='text-2xl md:text-3xl font-mono font-bold tracking-[0.15em] text-gray-900 group-hover:text-black transition-colors'
              aria-label={`Nomor VA: ${vaNumber}`}
            >
              {vaNumber}
            </span>
            <button
              type='button'
              onClick={() =>
                handleCopy(vaNumber)}
              className='p-3 hover:bg-white rounded-2xl transition-all duration-300 shadow-sm border border-transparent hover:border-gray-200 hover:scale-110 active:scale-95'
              aria-label='Salin Nomor Virtual Account'
              title='Salin Nomor VA'
            >
              {copied ? <Check className='w-6 h-6 text-green-600' aria-hidden='true' /> : (
                <Copy
                  className='w-6 h-6 text-gray-500 group-hover:text-black'
                  aria-hidden='true'
                />
              )}
            </button>
          </div>
          <p className='text-xs text-gray-400 text-center max-w-xs font-medium leading-relaxed'>
            Salin nomor di atas dan gunakan menu Transfer &gt; Virtual Account di aplikasi bank
            Anda.
          </p>
        </section>
      );
    }

    if (selectedMethod === 'EWALLET') {
      const isUrl = checkoutUrl.startsWith('http') || checkoutUrl.startsWith('intent://');
      return (
        <section className='flex flex-col items-center pt-2' aria-label='Instruksi E-Wallet'>
          <p className='text-sm font-medium text-gray-500 text-center max-w-sm leading-relaxed mb-6'>
            Klik tombol di bawah ini untuk dialihkan ke aplikasi E-Wallet Anda secara otomatis.
          </p>
          {isUrl
            ? (
              <a
                href={checkoutUrl}
                target='_blank'
                rel='noreferrer'
                className='w-full max-w-xs px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-900 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-[1.02] active:scale-95 duration-300 flex items-center justify-center gap-3 relative overflow-hidden group'
                aria-label='Buka Aplikasi E-Wallet'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700' />
                <Smartphone className='w-5 h-5' aria-hidden='true' />
                Buka Aplikasi
              </a>
            )
            : (
              <div className='bg-gray-50 p-6 rounded-2xl font-mono text-sm break-all text-center border border-gray-200 shadow-inner w-full max-w-sm font-medium'>
                {checkoutUrl}
              </div>
            )}
        </section>
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
      <div
        className='flex-1 flex flex-col w-full h-full md:items-center md:justify-center'
        role='main'
        aria-label='Memuat Halaman Pembayaran'
      >
        <section className='flex flex-col items-center justify-center w-full rounded-[2rem] md:max-w-2xl md:h-auto md:min-h-[500px] bg-slate-950 text-white md:rounded-[2.5rem] shadow-xl md:shadow-2xl overflow-hidden p-8 sm:p-12 md:p-16 relative'>
          {/* Optimized Ambient Background */}
          <div className='absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-950 to-slate-950 opacity-50' />

          <div className='relative z-10 text-center flex flex-col items-center w-full'>
            <div className='mb-8 w-24 h-24 sm:w-32 sm:h-32 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin flex-shrink-0' />
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 break-words w-full'>
              MENYIAPKAN<br />
              <span className='text-indigo-400'>TAGIHAN.</span>
            </h1>
            <p className='text-base sm:text-lg text-slate-400 font-medium max-w-sm mx-auto'>
              Mohon tunggu sebentar, kami sedang menyiapkan rincian pembayaran Anda secara aman.
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className='flex-1 flex flex-col w-full h-full md:items-center md:justify-center'
        role='main'
      >
        <section className='flex flex-col items-center justify-center w-full rounded-[2rem] md:max-w-2xl md:h-auto md:min-h-[500px] bg-slate-950 text-white md:rounded-[2.5rem] shadow-xl md:shadow-2xl overflow-hidden p-8 sm:p-12 md:p-16 relative animate-in zoom-in-95 duration-500'>
          {/* Optimized Ambient Background */}
          <div className='absolute inset-0 bg-gradient-to-br from-red-900/30 via-slate-950 to-slate-950 opacity-50' />

          <div className='relative z-10 text-center flex flex-col items-center w-full'>
            <div className='mb-8 inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 bg-red-500/10 text-red-500 rounded-full ring-8 ring-red-500/5'>
              <ShieldCheck className='w-12 h-12 sm:w-16 sm:h-16' strokeWidth={2.5} />
            </div>
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 break-words w-full text-red-500'>
              TRANSAKSI<br />
              <span className='text-white'>GAGAL.</span>
            </h1>
            <p className='text-base sm:text-lg text-slate-400 font-medium max-w-md mx-auto mb-10'>
              {error === 'Order status is cancelled, cannot pay'
                ? 'Pesanan ini sudah dibatalkan atau melebihi batas waktu pembayaran.'
                : error}
            </p>
            <button
              type='button'
              onClick={() => navigate('/')}
              className='group flex items-center justify-center gap-3 w-full max-w-sm mx-auto px-6 py-4 bg-white text-slate-900 text-lg font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-xl'
            >
              <span>KEMBALI BELANJA</span>
              <svg
                className='w-5 h-5 group-hover:translate-x-1 transition-transform'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2.5}
                  d='M14 5l7 7m0 0l-7 7m7-7H3'
                />
              </svg>
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (!intent) return null;

  return (
    <div
      className='flex-1 flex flex-col w-full h-full md:items-center md:justify-center'
      role='main'
      aria-label='Halaman Pembayaran Utama'
    >
      <div className='w-full max-w-2xl mx-auto flex flex-col relative z-10'>
        {/* Main Content Card */}
        <div className='bg-slate-950 rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-10 shadow-xl md:shadow-2xl border border-white/10 overflow-hidden transition-all duration-500 animate-in fade-in zoom-in-95'>
          <header className='text-center mb-4 sm:mb-6 md:mb-8'>
            <div className='w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-3 md:mb-6 shadow-lg shadow-indigo-500/40 rotate-3 transition-transform hover:rotate-6 duration-300'>
              <CreditCard className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10' aria-hidden='true' />
            </div>
            <h1 className='text-xl sm:text-2xl md:text-4xl font-black text-white mb-1 md:mb-2 tracking-tight break-words'>
              PEMBAYARAN.
            </h1>
            <p className='text-indigo-200/80 font-medium text-xs sm:text-sm md:text-base'>
              Selesaikan pembayaran untuk pesanan Anda
            </p>
          </header>

          <section
            className='bg-slate-900/80 backdrop-blur-xl text-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] mb-4 md:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 md:gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/5'
            aria-label='Ringkasan Total Pembayaran'
          >
            <div>
              <span className='block text-slate-400 font-medium text-xs md:text-sm mb-1'>
                Total Pembayaran
              </span>
              <span className='text-3xl md:text-5xl font-black tracking-tighter text-indigo-400'>
                {formatIDR(intent.amount)}
              </span>
            </div>
            {intent.expiresAt && (
              <div className='bg-white/5 px-5 py-3 rounded-2xl backdrop-blur-md border border-white/10'>
                <span className='block text-slate-400 text-[0.7rem] font-bold mb-1 uppercase tracking-widest'>
                  Jatuh Tempo
                </span>
                <span className='text-base font-bold text-white'>
                  {new Date(intent.expiresAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} WIB
                </span>
              </div>
            )}
          </section>

          {!intent.instructionPayload && intent.clientSecret
            ? (
              <section
                className='space-y-6 animate-in fade-in zoom-in duration-500'
                aria-label='Mode Sandbox'
              >
                <div className='flex items-center gap-3 justify-center mb-8 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20'>
                  <ShieldCheck className='w-6 h-6 text-emerald-400' aria-hidden='true' />
                  <h2 className='font-bold text-lg text-emerald-400'>Sandbox / Mode Testing</h2>
                </div>
                <p className='text-slate-400 mb-8 text-center leading-relaxed px-4 font-medium'>
                  Ini adalah lingkungan sandbox. Tidak ada tagihan nyata yang akan dilakukan. Anda
                  dapat mensimulasikan pembayaran yang berhasil atau gagal di bawah ini.
                </p>

                <div className='grid grid-cols-1 gap-4'>
                  <button
                    type='button'
                    onClick={() => handleSimulatePayment(true)}
                    disabled={isProcessing}
                    aria-label='Simulasi Pembayaran Berhasil'
                    className='group relative w-full flex items-center justify-center gap-3 px-6 py-5 bg-indigo-500 text-white rounded-2xl font-bold text-lg hover:bg-indigo-600 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_8px_30px_rgba(99,102,241,0.3)] overflow-hidden'
                  >
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700' />
                    {isProcessing
                      ? <Loader2 className='w-6 h-6 animate-spin' aria-hidden='true' />
                      : 'Simulasi Pembayaran Berhasil'}
                  </button>

                  <button
                    type='button'
                    onClick={() => handleSimulatePayment(false)}
                    disabled={isProcessing}
                    aria-label='Simulasi Pembayaran Gagal'
                    className='w-full bg-red-500/10 text-red-500 px-6 py-5 rounded-2xl font-bold text-lg hover:bg-red-500/20 disabled:opacity-50 flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95 border-2 border-red-500/20'
                  >
                    Simulasi Pembayaran Gagal
                  </button>
                </div>
              </section>
            )
            : (
              <section className='space-y-8' aria-label='Pilih Metode Pembayaran'>
                {!(intent.instructionPayload?.isSaweria) && (
                  <div>
                    <h2 className='font-bold text-gray-900 mb-5 text-center text-lg'>
                      Pilih Metode Pembayaran
                    </h2>
                    <div className='grid grid-cols-3 gap-3 md:gap-4'>
                      <button
                        type='button'
                        aria-pressed={selectedMethod === 'QRIS'}
                        className={`group p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center gap-2 ${
                          selectedMethod === 'QRIS'
                            ? 'border-gray-900 bg-gray-900 text-white shadow-[0_8px_20px_rgb(0,0,0,0.12)] scale-[1.02]'
                            : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50 hover:scale-[1.02]'
                        }`}
                        onClick={() => setSelectedMethod('QRIS')}
                      >
                        <QrCode
                          className={`w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110 ${
                            selectedMethod === 'QRIS' ? 'text-white' : 'text-gray-900'
                          }`}
                          aria-hidden='true'
                        />
                        <span className='block font-bold text-xs md:text-sm tracking-wide'>
                          QRIS
                        </span>
                      </button>
                      <button
                        type='button'
                        aria-pressed={selectedMethod === 'VA'}
                        className={`group p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center gap-2 ${
                          selectedMethod === 'VA'
                            ? 'border-indigo-500 bg-indigo-500 text-white shadow-[0_8px_20px_rgba(99,102,241,0.4)] scale-[1.02]'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:scale-[1.02]'
                        }`}
                        onClick={() => setSelectedMethod('VA')}
                      >
                        <Building2
                          className={`w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110 ${
                            selectedMethod === 'VA' ? 'text-white' : 'text-slate-300'
                          }`}
                          aria-hidden='true'
                        />
                        <span className='block font-bold text-xs md:text-sm tracking-wide'>
                          VIRTUAL ACC
                        </span>
                      </button>
                      <button
                        type='button'
                        aria-pressed={selectedMethod === 'EWALLET'}
                        className={`group p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center gap-2 ${
                          selectedMethod === 'EWALLET'
                            ? 'border-indigo-500 bg-indigo-500 text-white shadow-[0_8px_20px_rgba(99,102,241,0.4)] scale-[1.02]'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:scale-[1.02]'
                        }`}
                        onClick={() => setSelectedMethod('EWALLET')}
                      >
                        <Smartphone
                          className={`w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110 ${
                            selectedMethod === 'EWALLET' ? 'text-white' : 'text-slate-300'
                          }`}
                          aria-hidden='true'
                        />
                        <span className='block font-bold text-xs md:text-sm tracking-wide'>
                          E-WALLET
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {intent.instructionPayload && (
                  <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4 md:mt-8 relative flex flex-col items-center'>
                    {renderInstruction()}

                    <div
                      className='mt-4 md:mt-8 flex items-center justify-center gap-2 md:gap-3 bg-indigo-500/10 py-2 md:py-3 px-4 md:px-6 rounded-full border border-indigo-500/20 w-full max-w-sm'
                      aria-live='polite'
                    >
                      <Loader2
                        className='w-4 h-4 md:w-5 md:h-5 text-indigo-400 animate-spin flex-shrink-0'
                        strokeWidth={2.5}
                      />
                      <p className='text-xs md:text-sm font-bold text-indigo-300 truncate'>
                        Menunggu konfirmasi...
                      </p>
                    </div>
                  </div>
                )}
              </section>
            )}
        </div>
      </div>
    </div>
  );
}
