import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ResponsiveGooeyToaster } from '@starsuperscare/ui';
import { StorefrontLayout } from './components/layout/StorefrontLayout.tsx';
import HomePage from './features/home/HomePage.tsx';
import { SearchPage } from './features/search/SearchPage.tsx';
import { CategoriesPage } from './features/catalog/pages/CategoriesPage.tsx';
import { BrandsPage } from './features/catalog/pages/BrandsPage.tsx';
import { ProductDetailPage } from './features/catalog/pages/ProductDetailPage.tsx';
import { CartPage } from './features/cart/pages/CartPage.tsx';
import { CheckoutPage } from './features/checkout/pages/CheckoutPage.tsx';
import { InvoicePage } from './features/orders/pages/InvoicePage.tsx';
import { PaymentPage } from './features/checkout/payment/PaymentPage.tsx';
import { PaymentStatusPage } from './features/checkout/payment/PaymentStatusPage.tsx';
import { VerifyEmailPage } from './features/auth/pages/VerifyEmailPage.tsx';
import { TermsPage } from './features/legal/pages/TermsPage.tsx';
import { PrivacyPage } from './features/legal/pages/PrivacyPage.tsx';
import { HelpPage } from './features/legal/pages/HelpPage.tsx';
import { ReturnsPage } from './features/legal/pages/ReturnsPage.tsx';
import { AboutPage } from './features/legal/pages/AboutPage.tsx';
import { VouchersPage } from './features/promos/pages/VouchersPage.tsx';

const Fallback = ({ error }: { error: Error }) => (
  <div role='alert' className='p-6'>
    <h1 className='text-xl font-bold text-red-600'>Something went wrong:</h1>
    <pre className='text-sm mt-4 p-4 bg-red-50 rounded-md overflow-auto'>{error.message}</pre>
  </div>
);

const NotFound = () => (
  <div className='flex flex-col items-center justify-center py-24 text-center'>
    <h1 className='text-4xl font-extrabold tracking-tight text-gray-900'>404</h1>
    <p className='mt-4 text-lg text-gray-600'>Halaman yang Anda cari tidak ditemukan.</p>
    <a href='/' className='mt-8 text-blue-600 hover:underline'>Kembali ke Beranda</a>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <ResponsiveGooeyToaster />
      <BrowserRouter>
        <StorefrontLayout>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/products' element={<SearchPage />} />
            <Route path='/search' element={<SearchPage />} />
            <Route path='/promo' element={<SearchPage />} />
            <Route path='/categories' element={<CategoriesPage />} />
            <Route path='/categories/:slug' element={<SearchPage />} />
            <Route path='/brands' element={<BrandsPage />} />
            <Route path='/brands/:slug' element={<SearchPage />} />
            <Route path='/products/:slug' element={<ProductDetailPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/orders/:id/invoice' element={<InvoicePage />} />
            <Route path='/payment/status' element={<PaymentStatusPage />} />
            <Route path='/payment/:orderId' element={<PaymentPage />} />
            <Route path='/verify-email' element={<VerifyEmailPage />} />
            <Route path='/terms' element={<TermsPage />} />
            <Route path='/privacy' element={<PrivacyPage />} />
            <Route path='/help' element={<HelpPage />} />
            <Route path='/returns' element={<ReturnsPage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/vouchers' element={<VouchersPage />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </StorefrontLayout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
