import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './components/ui/ToastProvider.tsx';

import { LoginPage } from './features/login/LoginPage.tsx';
import { SignupPage } from './features/signup/SignupPage.tsx';
import { ForgotPasswordPage } from './features/recovery/ForgotPasswordPage.tsx';
import { ResetPasswordPage } from './features/recovery/ResetPasswordPage.tsx';
import { ActivationPage } from './features/activation/ActivationPage.tsx';
import { VerifyEmailPage } from './features/activation/VerifyEmailPage.tsx';
import { ClaimOrderPage } from './features/claim/ClaimOrderPage.tsx';

const Fallback = ({ error }: { error: Error }) => (
  <div role='alert' style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
    <h1 style={{ color: '#991b1b' }}>Something went wrong</h1>
    <pre
      style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '4px' }}
    >{error.message}</pre>
    <button
      type='button'
      onClick={() =>
        globalThis.location.reload()}
      style={{ padding: '8px 16px', marginTop: '1rem' }}
    >
      Reload Page
    </button>
  </div>
);

const NotFound = () => (
  <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
    <h1>404 - Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigate to='/login' replace />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            <Route path='/reset-password' element={<ResetPasswordPage />} />
            <Route path='/activate' element={<ActivationPage />} />
            <Route path='/verify-email' element={<VerifyEmailPage />} />
            <Route path='/claim-order' element={<ClaimOrderPage />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}
