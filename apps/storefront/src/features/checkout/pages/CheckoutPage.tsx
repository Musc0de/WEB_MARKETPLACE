import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../cart/api/useCart.ts';
import { useCheckoutValidation, useCreateOrder } from '../api/useCheckout.ts';
import { AddressForm } from '../components/AddressForm.tsx';
import { AddressBookSelector } from '../components/AddressBookSelector.tsx';
import { ShippingOptions } from '../components/ShippingOptions.tsx';
import type { ShippingAddress } from '@starsuperscare/contracts';
import { Button, formatIDR, SEO, toast } from '@starsuperscare/ui';
import { CheckCircle2, Info, ShoppingBag, Ticket, X } from 'lucide-react';
import { useAuth } from '../../auth/api/useAuth.ts';
import { useAddresses } from '../../me/api/useAddresses.ts';

type CheckoutStep = 'address' | 'shipping' | 'review';

export function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const initialVoucher = location.state?.appliedVoucherCode ||
    localStorage.getItem('claimed_voucher') || null;

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

  const { user, isLoading: isAuthLoading } = useAuth();
  const userEmail = user?.email || null;
  const { addresses: savedAddresses, isLoading: isAddressesLoading } = useAddresses(!!userEmail);

  useEffect(() => {
    if (userEmail && savedAddresses.length > 0 && !address) {
      const primary = savedAddresses.find((a: any) => a.isPrimaryShipping) ||
        savedAddresses.find((a: any) => a.isPrimaryBilling) || savedAddresses[0];

      if (primary) {
        setAddress({
          fullName: primary.recipientName,
          email: userEmail,
          phoneNumber: primary.phone,
          streetAddress: primary.addressLine1 +
            (primary.addressLine2 ? ', ' + primary.addressLine2 : ''),
          province: primary.province,
          city: primary.city,
          postalCode: primary.postalCode,
          country: primary.country || 'ID',
          notes: '',
        });
      }
    }
  }, [userEmail, savedAddresses, address]);

  const cartHash = JSON.stringify(cart?.items || []);
  useEffect(() => {
    const hasItems = directToken || cart?.items?.length;
    if (hasItems) {
      validateCheckout({
        shippingOptionId,
        voucherCode: appliedVoucher,
        _cartToken: directToken ?? null,
      } as any).catch(() => {
        if (appliedVoucher) handleRemoveVoucher();
      });
    }
  }, [cartHash, shippingOptionId, directToken, appliedVoucher, validateCheckout]);

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    setIsApplyingVoucher(true);

    try {
      const result = await validateCheckout({
        shippingOptionId,
        voucherCode: voucherInput.trim(),
        _cartToken: directToken ?? null,
      } as any);

      if (!result.appliedVoucher) {
        const voucherError = result.errors?.find((e: string) =>
          e.toLowerCase().includes('voucher')
        ) || 'Voucher tidak valid';
        throw new Error(voucherError);
      }

      setAppliedVoucher(result.appliedVoucher.code);
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
    localStorage.removeItem('claimed_voucher');
    toast.success('Voucher dibatalkan');
  };

  const requiresShipping = directToken
    ? (validationData?.items?.some((i: any) => i.productType === 'physical') ?? false)
    : (cart?.items?.some((i: any) => i.product?.type === 'physical') ?? true);

  useEffect(() => {
    if (isAuthLoading) return;
    if (userEmail && step === 'address' && !requiresShipping && address) {
      setStep('review');
    }
  }, [isAuthLoading, userEmail, step, address, requiresShipping]);

  if ((!directToken && isCartLoading) || (directToken && !validationData)) {
    return (
      <div className='min-h-[50vh] flex flex-col items-center justify-center p-8 text-center'>
        <div className='w-10 h-10 rounded-full border-4 border-muted border-t-indigo-600 animate-spin mb-4' />
        <p className='text-muted-foreground font-medium animate-pulse'>Menyiapkan checkout...</p>
      </div>
    );
  }

  if (!directToken && (!cart || cart.items.length === 0)) {
    return (
      <div className='max-w-2xl mx-auto p-8 text-center mt-16 bg-card border border-border/60 rounded-3xl shadow-sm py-16'>
        <div className='w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6'>
          <ShoppingBag className='w-10 h-10 text-muted-foreground/40' />
        </div>
        <h1 className='text-2xl font-black mb-2 text-foreground tracking-tight'>
          Keranjang Kosong
        </h1>
        <p className='mb-8 text-muted-foreground font-medium'>
          Anda tidak memiliki barang untuk dicheckout.
        </p>
        <Button
          onClick={() => navigate('/products')}
          className='rounded-xl font-bold px-8 shadow-sm active:scale-95'
        >
          Belanja Sekarang
        </Button>
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

  let pageTitle = 'Checkout';
  if (step === 'address') {
    pageTitle = requiresShipping ? 'Alamat Pengiriman | Checkout' : 'Informasi Pembeli | Checkout';
  } else if (step === 'shipping') {
    pageTitle = 'Opsi Pengiriman | Checkout';
  } else if (step === 'review') {
    pageTitle = 'Review Pesanan | Checkout';
  }

  return (
    <div className='max-w-3xl mx-auto px-4 py-8 animate-in fade-in duration-500'>
      <SEO title={pageTitle} />
      <h1 className='text-3xl font-black tracking-tight mb-8 text-foreground'>Checkout</h1>

      {directToken && (
        <div className='mb-8 px-5 py-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-3 shadow-sm'>
          <CheckCircle2 className='w-5 h-5 shrink-0' />
          <span>Checkout langsung — hanya produk yang dipilih</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className='flex items-center mb-12 overflow-x-auto pb-4 no-scrollbar'>
        {steps.map((s, idx) => {
          const isActive = step === s.id;
          const isPast = steps.findIndex((x) => x.id === step) > idx;

          return (
            <div key={s.id} className='flex items-center'>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-black shadow-sm shrink-0 transition-colors ${
                  isActive || isPast
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-border/60 bg-card text-muted-foreground'
                }`}
              >
                {isPast ? <CheckCircle2 className='w-5 h-5' /> : idx + 1}
              </div>
              <span
                className={`ml-3 font-bold whitespace-nowrap transition-colors ${
                  isActive || isPast ? 'text-foreground' : 'text-muted-foreground/60'
                }`}
              >
                {s.label}
              </span>
              {idx < steps.length - 1 && (
                <div
                  className={`w-8 lg:w-16 h-1 mx-4 rounded-full transition-colors ${
                    isPast ? 'bg-indigo-600' : 'bg-border/60'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className='flex flex-col gap-6'>
        {step === 'address' && (
          <div className='bg-card p-6 lg:p-8 rounded-3xl shadow-sm border border-border/60'>
            <h2 className='text-xl font-black mb-6 text-foreground tracking-tight flex items-center gap-2'>
              <div className='w-1.5 h-5 bg-indigo-500 rounded-full' />
              {requiresShipping ? 'Alamat Pengiriman' : 'Informasi Pembeli'}
            </h2>
            {(isAuthLoading || isAddressesLoading)
              ? (
                <div className='flex justify-center py-12'>
                  <div className='animate-spin w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full' />
                </div>
              )
              : (userEmail && requiresShipping)
              ? (
                <AddressBookSelector
                  userEmail={userEmail}
                  onSelect={handleAddressSubmit}
                />
              )
              : (
                <AddressForm
                  initialValues={address || { email: userEmail || '' }}
                  onSubmit={handleAddressSubmit}
                  isDigitalOnly={!requiresShipping}
                  hideEmail={!!userEmail}
                />
              )}
          </div>
        )}

        {step === 'shipping' && (
          <div className='bg-card p-6 lg:p-8 rounded-3xl shadow-sm border border-border/60'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-black text-foreground tracking-tight flex items-center gap-2'>
                <div className='w-1.5 h-5 bg-indigo-500 rounded-full' />
                Opsi Pengiriman
              </h2>
              <button
                type='button'
                onClick={() => setStep('address')}
                className='text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline'
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
              : <p className='text-muted-foreground font-medium'>Alamat belum diisi.</p>}
          </div>
        )}

        {step === 'review' && (
          <div className='bg-card p-6 lg:p-8 rounded-3xl shadow-sm border border-border/60'>
            <div className='flex justify-between items-center mb-6 border-b border-border/60 pb-6'>
              <h2 className='text-xl font-black text-foreground tracking-tight flex items-center gap-2'>
                <div className='w-1.5 h-5 bg-indigo-500 rounded-full' />
                Review Pesanan & Checkout
              </h2>
              <button
                type='button'
                onClick={() => setStep(requiresShipping ? 'shipping' : 'address')}
                className='text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline'
              >
                Ubah {requiresShipping ? 'Pengiriman' : 'Data Diri'}
              </button>
            </div>

            {validationData && (
              <div className='space-y-6'>
                {/* Information Alerts */}
                {validationData.items.some((i) =>
                  i.productType === 'digital' || i.productType === 'service'
                ) && (
                  <div className='bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 flex gap-4 items-start shadow-sm'>
                    <Info className='w-6 h-6 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0' />
                    <div>
                      <h4 className='text-sm font-black text-indigo-700 dark:text-indigo-300 mb-2'>
                        Informasi Akses Produk
                      </h4>
                      <p className='text-xs text-indigo-700/80 dark:text-indigo-300/80 font-medium leading-relaxed'>
                        Anda dapat melihat dan mengunduh produk digital/layanan pesanan Anda melalui
                        halaman{' '}
                        <a
                          href='/downloads'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='font-bold underline hover:text-indigo-600 dark:hover:text-indigo-400'
                        >
                          Downloads
                        </a>.
                        <br />
                        <br />
                        <strong className='text-indigo-800 dark:text-indigo-200'>Penting:</strong>
                        {' '}
                        Pastikan Anda telah <strong>Login</strong> dan{' '}
                        <strong>Verifikasi Email</strong>. Jika email belum terverifikasi, Anda
                        tidak akan bisa login maupun mengunduh produk ini.
                      </p>
                    </div>
                  </div>
                )}

                {requiresShipping && (
                  <div className='bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex gap-4 items-start shadow-sm'>
                    <Info className='w-6 h-6 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0' />
                    <div>
                      <h4 className='text-sm font-black text-amber-700 dark:text-amber-300 mb-2'>
                        Informasi Pengiriman & Kebijakan Retur
                      </h4>
                      <div className='text-xs text-amber-700/80 dark:text-amber-300/80 font-medium leading-relaxed space-y-3'>
                        <p>
                          <strong className='text-amber-800 dark:text-amber-200'>Penting:</strong>
                          {''}
                          Mohon pastikan <strong>Alamat Pengiriman</strong>
                          {''}
                          Anda sudah benar. Jika ingin mengganti, klik{' '}
                          <button
                            type='button'
                            onClick={() => setStep('address')}
                            className='font-bold underline hover:text-amber-900 dark:hover:text-amber-100 transition-colors'
                          >
                            Ubah Alamat
                          </button>{' '}
                          untuk memilih atau menambahkan alamat terbaru sebelum melakukan
                          pembayaran.
                        </p>
                        <p>
                          <strong className='text-amber-800 dark:text-amber-200'>
                            Status Pengiriman:
                          </strong>
                          {''}
                          Pesanan Anda akan diproses dan dikirim sesuai estimasi kurir. Anda dapat
                          melacak resi dan melihat detail pesanan kapan saja.
                        </p>
                        <p>
                          <strong className='text-amber-800 dark:text-amber-200'>
                            Kebijakan Refund & Return:
                          </strong>
                          {''}
                          Segala bentuk komplain barang rusak atau kurang{' '}
                          <strong>WAJIB menyertakan Video Unboxing lengkap</strong>
                          {''}
                          (tanpa jeda/edit sejak paket masih tersegel).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className='flex flex-col gap-4'>
                  {validationData.items.map((item) => (
                    <div
                      key={item.id}
                      className='flex gap-4 p-4 border border-border/60 rounded-2xl bg-muted/20'
                    >
                      <div className='w-16 h-16 bg-muted rounded-xl border border-border/60 overflow-hidden shrink-0'>
                        {item.primaryImage
                          ? (
                            <img
                              src={item.primaryImage}
                              alt={item.productName}
                              className='w-full h-full object-cover'
                            />
                          )
                          : (
                            <div className='w-full h-full flex items-center justify-center text-muted-foreground/40 font-bold text-xs'>
                              No Img
                            </div>
                          )}
                      </div>
                      <div className='flex-1 min-w-0 flex flex-col justify-center'>
                        <p className='font-bold text-foreground text-sm truncate'>
                          {item.productName}
                        </p>
                        <p className='text-xs text-muted-foreground font-medium truncate mb-1'>
                          {item.variantSku}
                        </p>
                        <div className='flex justify-between items-center gap-3 mt-1'>
                          <span className='text-xs font-bold text-muted-foreground shrink-0'>
                            Qty: {item.quantity} x {formatIDR(item.priceSnapshot)}
                          </span>
                          <span className='font-black text-foreground truncate'>
                            {formatIDR(item.priceSnapshot * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className='border-border/60' />

                {/* Voucher Section */}
                <div>
                  {appliedVoucher
                    ? (
                      <div className='flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 shadow-sm'>
                        <div className='flex items-center gap-3 text-emerald-700 dark:text-emerald-400'>
                          <Ticket className='w-5 h-5 shrink-0' />
                          <div>
                            <p className='text-sm font-black uppercase tracking-widest'>
                              {appliedVoucher}
                            </p>
                            <p className='text-xs font-bold opacity-80'>
                              Voucher berhasil digunakan
                            </p>
                            {validationData.appliedVoucher?.description && (
                              <p className='text-xs opacity-70 mt-1 max-w-[200px] leading-relaxed font-medium'>
                                {validationData.appliedVoucher.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          type='button'
                          onClick={handleRemoveVoucher}
                          className='p-2 hover:bg-emerald-500/20 rounded-xl transition-colors shrink-0'
                          title='Batalkan Voucher'
                        >
                          <X className='w-5 h-5' />
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
                          className='flex-1 rounded-xl bg-muted/20 border-border/60 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-4 py-3 font-medium transition-colors outline-none border'
                          disabled={isApplyingVoucher}
                        />
                        <Button
                          type='submit'
                          disabled={isApplyingVoucher || !voucherInput.trim()}
                          className='rounded-xl font-bold px-6 shadow-sm active:scale-95'
                        >
                          {isApplyingVoucher ? 'Cek...' : 'Terapkan'}
                        </Button>
                      </form>
                    )}
                </div>

                {/* Price Breakdown */}
                <div className='space-y-4 font-medium bg-muted/20 p-5 rounded-2xl border border-border/40'>
                  <div className='flex justify-between items-center text-muted-foreground gap-4'>
                    <span className='shrink-0'>Subtotal Produk</span>
                    <span className='font-bold text-foreground truncate'>
                      {formatIDR(validationData.summary.subtotal)}
                    </span>
                  </div>
                  {validationData.summary.totalDiscount > 0 && (
                    <div className='flex justify-between items-center text-emerald-600 dark:text-emerald-400 gap-4'>
                      <span className='font-bold shrink-0'>Diskon Voucher</span>
                      <span className='font-black bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 truncate'>
                        -{formatIDR(validationData.summary.totalDiscount)}
                      </span>
                    </div>
                  )}
                  {requiresShipping && (
                    <div className='flex justify-between items-center text-muted-foreground gap-4'>
                      <span className='shrink-0'>Ongkos Kirim</span>
                      <span className='font-bold text-foreground truncate'>
                        {validationData.summary.shippingCost > 0
                          ? formatIDR(validationData.summary.shippingCost)
                          : '-'}
                      </span>
                    </div>
                  )}
                  <div className='border-t border-border/60 pt-5 mt-2 flex justify-between items-center gap-4'>
                    <span className='font-black text-lg text-foreground shrink-0'>Total Akhir</span>
                    <span className='font-black text-xl text-indigo-600 dark:text-indigo-400 truncate'>
                      {formatIDR(validationData.summary.grandTotal)}
                    </span>
                  </div>
                </div>

                <div className='pt-6 border-t border-border/60'>
                  <Button
                    onClick={handleOrderSubmit}
                    disabled={!validationData.isValid || isCreatingOrder}
                    className='w-full rounded-xl font-bold text-lg h-14 shadow-md active:scale-[0.98]'
                  >
                    {isCreatingOrder
                      ? 'Memproses Pesanan...'
                      : (
                        <div className='flex justify-between items-center w-full px-2 gap-4'>
                          <span className='shrink-0'>Bayar Sekarang</span>
                          <span className='truncate'>
                            {formatIDR(validationData.summary.grandTotal)}
                          </span>
                        </div>
                      )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
