import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../cart/api/useCart.ts';
import { useCheckoutValidation, useCreateOrder } from '../api/useCheckout.ts';
import { AddressForm } from '../components/AddressForm.tsx';
import { ShippingOptions } from '../components/ShippingOptions.tsx';
import type { ShippingAddress } from '@starsuperscare/contracts';
import { formatIDR, toast } from '@starsuperscare/ui';
import { CheckCircle2, Info, Ticket, X } from 'lucide-react';

type CheckoutStep = 'address' | 'shipping' | 'review';

export function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const initialVoucher = location.state?.appliedVoucherCode || null;

  // directToken: present when user clicks "Beli Langsung" — isolated cart session
  const directToken = searchParams.get('directToken');

  const { cart, isLoading: isCartLoading } = useCart();
  const { trigger: validateCheckout, data: validationData } = useCheckoutValidation();
  const { trigger: createOrder, isMutating: isCreatingOrder } = useCreateOrder();

  const [step, setStep] = useState<CheckoutStep>('address');
  const [address, setAddress] = useState<(ShippingAddress & { email: string }) | null>(null);
  const [shippingOptionId, setShippingOptionId] = useState<string | null>(null);
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(initialVoucher);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  // Validate on mount or when shipping/cart changes
  // For direct-buy: pass the directToken so the API uses the fresh isolated cart
  const cartHash = JSON.stringify(cart?.items || []);
  useEffect(() => {
    const hasItems = directToken || cart?.items?.length;
    if (hasItems) {
      validateCheckout({
        shippingOptionId,
        voucherCode: appliedVoucher,
        _cartToken: directToken ?? null,
      } as any).catch(() => {
        // If validation fails after applying voucher, probably means voucher expired/invalid
        if (appliedVoucher) handleRemoveVoucher();
      });
    }
  }, [cartHash, shippingOptionId, directToken, appliedVoucher, validateCheckout]);

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    setIsApplyingVoucher(true);

    try {
      await validateCheckout({
        shippingOptionId,
        voucherCode: voucherInput.trim(),
        _cartToken: directToken ?? null,
      } as any);
      setAppliedVoucher(voucherInput.trim());
      toast.success('Voucher berhasil digunakan');
    } catch (err: any) {
      toast.error(err.message || 'Voucher tidak valid');
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput('');
    toast.success('Voucher dibatalkan');
  };

  // Show loader while normal cart is loading OR direct buy validation is pending
  if ((!directToken && isCartLoading) || (directToken && !validationData)) {
    return (
      <div className='min-h-[50vh] flex flex-col items-center justify-center p-8 text-center'>
        <div className='w-10 h-10 rounded-full border-4 border-gray-100 border-t-black animate-spin mb-4' />
        <p className='text-gray-500 font-medium animate-pulse'>Menyiapkan checkout...</p>
      </div>
    );
  }

  // Show empty-cart screen only if NOT in direct-buy mode and cart is really empty
  if (!directToken && (!cart || cart.items.length === 0)) {
    return (
      <div className='max-w-2xl mx-auto p-8 text-center'>
        <h1 className='text-2xl font-bold mb-4'>Keranjang Kosong</h1>
        <p className='mb-6'>Anda tidak memiliki barang untuk dicheckout.</p>
        <button
          type='button'
          onClick={() => navigate('/products')}
          className='bg-black text-white px-6 py-2 rounded-lg'
        >
          Belanja Sekarang
        </button>
      </div>
    );
  }

  const handleAddressSubmit = (data: ShippingAddress & { email: string }) => {
    setAddress(data);
    if (requiresShipping) {
      setStep('shipping');
    } else {
      setStep('review');
    }
  };

  const handleOrderSubmit = async () => {
    if (!address || !validationData?.isValid || (requiresShipping && !shippingOptionId)) {
      toast.error('Lengkapi semua data dengan benar');
      return;
    }

    try {
      if (!validationData) return;
      const res = await createOrder({
        idempotencyKey: crypto.randomUUID(),
        shippingAddress: address,
        shippingOptionId: requiresShipping ? shippingOptionId : null,
        emailSnapshot: address.email,
        voucherCode: appliedVoucher,
        _cartToken: directToken ?? null,
      } as any);

      if (res && res.orderId) {
        toast.success('Pesanan berhasil dibuat');
        navigate(`/payment/${res.orderId}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal membuat pesanan');
    }
  };

  const requiresShipping = directToken
    ? (validationData?.items?.some((i: any) => i.productType === 'physical') ?? false)
    : (cart?.items?.some((i: any) => i.product?.type === 'physical') ?? true);

  const steps: { id: CheckoutStep; label: string }[] = requiresShipping
    ? [
      { id: 'address', label: 'Alamat Pengiriman' },
      { id: 'shipping', label: 'Opsi Pengiriman' },
      { id: 'review', label: 'Pembayaran' },
    ]
    : [
      { id: 'address', label: 'Informasi Pembeli' },
      { id: 'review', label: 'Pembayaran' },
    ];

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Checkout</h1>

      {/* Direct Buy Indicator */}
      {directToken && (
        <div className='mb-6 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 flex items-center gap-2'>
          <CheckCircle2 className='w-4 h-4' />
          <span>Checkout langsung — hanya produk yang dipilih</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className='flex items-center mb-12 overflow-x-auto pb-4'>
        {steps.map((s, idx) => {
          const isActive = step === s.id;
          const isPast = steps.findIndex((x) => x.id === step) > idx;

          return (
            <div key={s.id} className='flex items-center'>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-medium ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : isPast
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                {isPast ? <CheckCircle2 className='w-5 h-5' /> : idx + 1}
              </div>
              <span
                className={`ml-3 font-medium ${
                  isActive || isPast ? 'text-black' : 'text-gray-400'
                }`}
              >
                {s.label}
              </span>
              {idx < steps.length - 1 && (
                <div className={`w-12 h-px mx-4 ${isPast ? 'bg-black' : 'bg-gray-300'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Content */}
        <div className='lg:col-span-2'>
          {step === 'address' && (
            <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
              <h2 className='text-xl font-bold mb-6'>
                {requiresShipping ? 'Alamat Pengiriman' : 'Informasi Pembeli'}
              </h2>
              <AddressForm
                initialValues={address || {}}
                onSubmit={handleAddressSubmit}
                isDigitalOnly={!requiresShipping}
              />
            </div>
          )}

          {step === 'shipping' && (
            <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold'>Opsi Pengiriman</h2>
                <button
                  type='button'
                  onClick={() => setStep('address')}
                  className='text-sm text-blue-600'
                >
                  Ubah Alamat
                </button>
              </div>
              {address
                ? (
                  <ShippingOptions
                    province={address.province}
                    city={address.city}
                    selectedOptionId={shippingOptionId}
                    onSelect={setShippingOptionId}
                    onNext={() => setStep('review')}
                  />
                )
                : <p>Alamat belum diisi.</p>}
            </div>
          )}

          {step === 'review' && (
            <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold'>Review Pesanan</h2>
                <button
                  type='button'
                  onClick={() => setStep(requiresShipping ? 'shipping' : 'address')}
                  className='text-sm text-blue-600'
                >
                  Ubah {requiresShipping ? 'Pengiriman' : 'Data Diri'}
                </button>
              </div>

              {validationData && (
                <div className='space-y-4'>
                  {validationData.items.some((i) =>
                    i.productType === 'digital' || i.productType === 'service'
                  ) && (
                    <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 items-start'>
                      <Info className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0' />
                      <div>
                        <h4 className='text-sm font-bold text-blue-900 mb-1'>
                          Informasi Akses Produk
                        </h4>
                        <p className='text-xs text-blue-800 leading-relaxed'>
                          Anda dapat melihat dan mengunduh produk digital/layanan pesanan Anda
                          melalui halaman{' '}
                          <a
                            href='/downloads'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='font-bold underline hover:text-blue-600'
                          >
                            Downloads
                          </a>.
                          <br />
                          <br />
                          <strong>Penting:</strong> Pastikan Anda telah <strong>Login</strong> dan
                          {' '}
                          <strong>Verifikasi Email</strong>. Jika email belum terverifikasi, Anda
                          tidak akan bisa login maupun mengunduh produk ini.
                        </p>
                      </div>
                    </div>
                  )}

                  {validationData.items.map((item) => (
                    <div
                      key={item.id}
                      className='flex justify-between items-center p-4 border rounded-xl'
                    >
                      <div>
                        <p className='font-medium'>{item.productName}</p>
                        <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                      </div>
                      <p className='font-medium'>{formatIDR(item.priceSnapshot * item.quantity)}</p>
                    </div>
                  ))}

                  {!validationData.isValid && validationData.errors && (
                    <div className='p-4 bg-red-50 text-red-600 rounded-xl'>
                      <ul className='list-disc pl-5'>
                        {validationData.errors.map((e, i) => <li key={i}>{e}</li>)}
                      </ul>
                    </div>
                  )}

                  <div className='pt-6'>
                    <button
                      type='button'
                      onClick={handleOrderSubmit}
                      disabled={!validationData.isValid || isCreatingOrder}
                      className='w-full bg-black text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 disabled:opacity-50'
                    >
                      {isCreatingOrder ? 'Memproses Pesanan...' : 'Bayar Sekarang'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className='lg:col-span-1'>
          <div className='bg-gray-50 p-6 rounded-2xl sticky top-8'>
            <h2 className='text-xl font-bold mb-6'>Ringkasan Checkout</h2>

            {validationData
              ? (
                <div className='flex flex-col text-sm'>
                  <div className='space-y-4 mb-6 pb-6 border-b border-gray-200'>
                    {validationData.items.map((item) => (
                      <div key={item.id} className='flex gap-4'>
                        <div className='w-16 h-16 bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0'>
                          {item.primaryImage
                            ? (
                              <img
                                src={item.primaryImage}
                                alt={item.productName}
                                className='w-full h-full object-cover'
                              />
                            )
                            : (
                              <div className='w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs'>
                                No Img
                              </div>
                            )}
                        </div>
                        <div className='flex-1 min-w-0 flex flex-col justify-center'>
                          <p className='font-bold text-gray-900 truncate'>{item.productName}</p>
                          <p className='text-xs text-gray-500 truncate'>{item.variantSku}</p>
                          <div className='flex justify-between items-center mt-1'>
                            <span className='text-xs font-medium text-gray-500'>
                              {item.quantity} x {formatIDR(item.priceSnapshot)}
                            </span>
                            <span className='font-bold text-gray-900'>
                              {formatIDR(item.priceSnapshot * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='my-6 pt-6 border-t border-gray-200'>
                    {appliedVoucher
                      ? (
                        <div className='flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3'>
                          <div className='flex items-center gap-2 text-blue-700'>
                            <Ticket className='w-4 h-4' />
                            <div>
                              <p className='text-sm font-bold uppercase tracking-wider'>
                                {appliedVoucher}
                              </p>
                              <p className='text-xs text-blue-600 font-medium'>
                                Voucher berhasil digunakan
                              </p>
                              {validationData.appliedVoucher?.description && (
                                <p className='text-xs text-blue-600/80 mt-0.5 max-w-[200px] leading-tight'>
                                  {validationData.appliedVoucher.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            type='button'
                            onClick={handleRemoveVoucher}
                            className='p-1.5 hover:bg-blue-100 rounded-md text-blue-600 transition-colors'
                            title='Batalkan Voucher'
                          >
                            <X className='w-4 h-4' />
                          </button>
                        </div>
                      )
                      : (
                        <form onSubmit={handleApplyVoucher} className='flex gap-2'>
                          <input
                            type='text'
                            value={voucherInput}
                            onChange={(e) => setVoucherInput(e.target.value)}
                            placeholder='Masukkan kode voucher'
                            className='flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border'
                            disabled={isApplyingVoucher}
                          />
                          <button
                            type='submit'
                            disabled={isApplyingVoucher || !voucherInput.trim()}
                            className='rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-50'
                          >
                            {isApplyingVoucher ? 'Cek...' : 'Terapkan'}
                          </button>
                        </form>
                      )}
                  </div>

                  <div className='space-y-4'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Subtotal</span>
                      <span className='font-medium'>
                        {formatIDR(validationData.summary.subtotal)}
                      </span>
                    </div>
                    {validationData.summary.totalDiscount > 0 && (
                      <div className='flex justify-between text-green-600'>
                        <span>Diskon</span>
                        <span className='font-medium'>
                          -{formatIDR(validationData.summary.totalDiscount)}
                        </span>
                      </div>
                    )}
                    {requiresShipping && (
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Ongkos Kirim</span>
                        <span className='font-medium'>
                          {validationData.summary.shippingCost > 0
                            ? formatIDR(validationData.summary.shippingCost)
                            : '-'}
                        </span>
                      </div>
                    )}
                    <div className='border-t pt-4 flex justify-between items-center'>
                      <span className='font-bold text-lg'>Total Akhir</span>
                      <span className='font-bold text-xl'>
                        {formatIDR(validationData.summary.grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              )
              : (
                <div className='animate-pulse space-y-4'>
                  <div className='h-4 bg-gray-200 rounded w-full'></div>
                  <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                  <div className='h-6 bg-gray-200 rounded w-1/2 mt-4'></div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
