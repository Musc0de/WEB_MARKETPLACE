import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/api/useCart.ts';
import { useCheckoutValidation, useCreateOrder } from '../api/useCheckout.ts';
import { AddressForm } from '../components/AddressForm.tsx';
import { ShippingOptions } from '../components/ShippingOptions.tsx';
import type { ShippingAddress } from '@starsuperscare/contracts';
import { formatIDR, toast } from '@starsuperscare/ui';
import { CheckCircle2 } from 'lucide-react';

type CheckoutStep = 'address' | 'shipping' | 'review';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, isLoading: isCartLoading } = useCart();
  const { trigger: validateCheckout, data: validationData } = useCheckoutValidation();
  const { trigger: createOrder, isMutating: isCreatingOrder } = useCreateOrder();

  const [step, setStep] = useState<CheckoutStep>('address');
  const [address, setAddress] = useState<(ShippingAddress & { email: string }) | null>(null);
  const [shippingOptionId, setShippingOptionId] = useState<string | null>(null);

  // Validate on mount or when shipping/cart changes
  useEffect(() => {
    if (cart?.items?.length) {
      validateCheckout({ shippingOptionId, voucherCode: null }).catch(() => {});
    }
  }, [cart, shippingOptionId, validateCheckout]);

  if (isCartLoading) {
    return <div className='p-8 text-center'>Memuat checkout...</div>;
  }

  if (!cart || cart.items.length === 0) {
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
    setStep('shipping');
  };

  const handleOrderSubmit = async () => {
    if (!address || !shippingOptionId || !validationData?.isValid) {
      toast.error('Lengkapi semua data dengan benar');
      return;
    }

    try {
      const res = await createOrder({
        idempotencyKey: crypto.randomUUID(),
        shippingAddress: address,
        shippingOptionId,
        emailSnapshot: address.email,
        voucherCode: null,
      });

      if (res && res.orderId) {
        toast.success('Pesanan berhasil dibuat');
        navigate(`/payment/${res.orderId}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal membuat pesanan');
    }
  };

  const steps: { id: CheckoutStep; label: string }[] = [
    { id: 'address', label: 'Alamat' },
    { id: 'shipping', label: 'Pengiriman' },
    { id: 'review', label: 'Pembayaran' },
  ];

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Checkout</h1>

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
              <h2 className='text-xl font-bold mb-6'>Alamat Pengiriman</h2>
              <AddressForm initialValues={address || {}} onSubmit={handleAddressSubmit} />
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
                  onClick={() => setStep('shipping')}
                  className='text-sm text-blue-600'
                >
                  Ubah Pengiriman
                </button>
              </div>

              {validationData && (
                <div className='space-y-4'>
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
                <div className='space-y-4 text-sm'>
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
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Ongkos Kirim</span>
                    <span className='font-medium'>
                      {validationData.summary.shippingCost > 0
                        ? formatIDR(validationData.summary.shippingCost)
                        : '-'}
                    </span>
                  </div>
                  <div className='border-t pt-4 flex justify-between items-center'>
                    <span className='font-bold text-lg'>Total Akhir</span>
                    <span className='font-bold text-xl'>
                      {formatIDR(validationData.summary.grandTotal)}
                    </span>
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
