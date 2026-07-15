import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './features/auth/AuthContext.tsx';
import { AuthGuard } from './features/auth/AuthGuard.tsx';
import { AdminLayout } from './components/layout/AdminLayout.tsx';
import { ReturnsList } from './features/returns/ReturnsList.tsx';
import { RefundsList } from './features/refunds/RefundsList.tsx';
import { ProductsList } from './features/catalog/ProductsList.tsx';
import { ProductForm } from './features/catalog/ProductForm.tsx';
import { InventoryList } from './features/inventory/InventoryList.tsx';
import { SupportQueueList } from './features/support/SupportQueueList.tsx';
import { AdminTicketDetailPage } from './features/support/AdminTicketDetailPage.tsx';
import { OrdersList } from './features/orders/OrdersList.tsx';
import { OrderDetail } from './features/orders/OrderDetail.tsx';
import { CustomersList } from './features/customers/CustomersList.tsx';
import { CustomerDetail } from './features/customers/CustomerDetail.tsx';
import { PaymentsList } from './features/payments/PaymentsList.tsx';
import { InvoicesList } from './features/payments/InvoicesList.tsx';
import { GoeyToaster } from 'goey-toast';
import { DashboardCards } from './features/overview/DashboardCards.tsx';
import { ReviewsList } from './features/reviews/ReviewsList.tsx';
import { AuditLogViewer } from './features/audit/AuditLogViewer.tsx';
import 'goey-toast/styles.css';

const queryClient = new QueryClient();

const Fallback = ({ error }: { error: Error }) => (
  <div role='alert' style={{ padding: '2rem' }}>
    <h2 style={{ color: 'red' }}>Application Error</h2>
    <pre style={{ background: '#f8f8f8', padding: '1rem', overflow: 'auto' }}>
      {error.message}
    </pre>
  </div>
);

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
    <DashboardCards />
  </div>
);

const NotFound = () => (
  <div>
    <h1>404 - Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <QueryClientProvider client={queryClient}>
        <GoeyToaster position='top-right' />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path='/'
                element={
                  <AuthGuard>
                    <AdminLayout />
                  </AuthGuard>
                }
              >
                <Route index element={<Dashboard />} />
                {/* Product Routes */}
                <Route path='catalog' element={<ProductsList />} />
                <Route path='catalog/create' element={<ProductForm />} />
                <Route path='catalog/:id/edit' element={<ProductForm />} />

                {/* Inventory Management */}
                <Route path='inventory' element={<InventoryList />} />
                <Route path='support' element={<SupportQueueList />} />
                <Route path='support/:id' element={<AdminTicketDetailPage />} />

                <Route path='orders' element={<OrdersList />} />
                <Route path='orders/:id' element={<OrderDetail />} />

                <Route path='customers' element={<CustomersList />} />
                <Route path='customers/:id' element={<CustomerDetail />} />

                <Route path='payments' element={<PaymentsList />} />
                <Route path='invoices' element={<InvoicesList />} />

                <Route path='reviews' element={<ReviewsList />} />
                <Route path='audit' element={<AuditLogViewer />} />

                <Route path='returns' element={<ReturnsList />} />
                <Route path='refunds' element={<RefundsList />} />

                {/* Fallback */}
                <Route path='*' element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
