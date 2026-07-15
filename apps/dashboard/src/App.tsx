import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ResponsiveGooeyToaster } from '@starsuperscare/ui';
import { DashboardLayout } from './components/layout/DashboardLayout.tsx';

const Fallback = ({ error }: { error: unknown }) => {
  const msg = error instanceof Error
    ? error.message
    : typeof error === 'object' && error !== null
    ? JSON.stringify(error, null, 2)
    : String(error);
  return (
    <div role='alert' style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h2 style={{ color: '#dc2626' }}>Terjadi Kesalahan</h2>
      <pre
        style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          padding: '1rem',
          borderRadius: 8,
          fontSize: '0.875rem',
          color: '#7f1d1d',
        }}
      >
        {msg}
      </pre>
      <button
        type='button'
        onClick={() => global.location.reload()}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1.25rem',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Refresh
      </button>
    </div>
  );
};

import { DashboardHome } from './features/home/DashboardHome.tsx';
import { ProfilePage } from './features/profile/ProfilePage.tsx';
import { SecurityPage } from './features/security/SecurityPage.tsx';
import { AddressesPage } from './features/addresses/AddressesPage.tsx';
import { PaymentMethodsPage } from './features/payment-methods/PaymentMethodsPage.tsx';
import { OrderDetailPage, OrdersPage } from './features/orders/index.ts';
import { HistoryPage } from './features/history/HistoryPage.tsx';
import { InvoicesPage } from './features/invoices/InvoicesPage.tsx';
import { DownloadsPage } from './features/downloads/DownloadsPage.tsx';
import { NotificationsPage } from './features/notifications/NotificationsPage.tsx';
import { WishlistPage } from './features/wishlist/WishlistPage.tsx';
import { ReviewsPage } from './features/reviews/ReviewsPage.tsx';
import { SettingsPage } from './features/settings/SettingsPage.tsx';
import { ReturnsPage } from './features/returns/ReturnsPage.tsx';
import { SupportPage } from './features/support/SupportPage.tsx';
import { TicketDetailPage } from './features/support/TicketDetailPage.tsx';
const NotFound = () => (
  <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
    <h1>404 - Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <ResponsiveGooeyToaster />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path='/' element={<DashboardHome />} />
            <Route path='/orders' element={<OrdersPage />} />
            <Route path='/orders/:id' element={<OrderDetailPage />} />
            <Route path='/history' element={<HistoryPage />} />
            <Route path='/invoices' element={<InvoicesPage />} />
            <Route path='/downloads' element={<DownloadsPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/security' element={<SecurityPage />} />
            <Route path='/addresses' element={<AddressesPage />} />
            <Route path='/payments' element={<PaymentMethodsPage />} />
            <Route path='/notifications' element={<NotificationsPage />} />
            <Route path='/wishlist' element={<WishlistPage />} />
            <Route path='/reviews' element={<ReviewsPage />} />
            <Route path='/returns' element={<ReturnsPage />} />
            <Route path='/support' element={<SupportPage />} />
            <Route path='/support/:id' element={<TicketDetailPage />} />
            <Route path='/settings' element={<SettingsPage />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
