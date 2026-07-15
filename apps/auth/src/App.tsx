import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ResponsiveGooeyToaster } from '@starsuperscare/ui';
import { AuthLayout } from './components/layout/AuthLayout.tsx';

import { LoginPage } from './features/login/LoginPage.tsx';
import { SignupPage } from './features/signup/SignupPage.tsx';
import { ForgotPasswordPage } from './features/recovery/ForgotPasswordPage.tsx';
import { ResetPasswordPage } from './features/recovery/ResetPasswordPage.tsx';
import { ActivationPage } from './features/activation/ActivationPage.tsx';
import { VerifyEmailPage } from './features/activation/VerifyEmailPage.tsx';
import { ClaimOrderPage } from './features/claim/ClaimOrderPage.tsx';

import { HelpPage } from './features/legal/HelpPage.tsx';
import { PrivacyPage } from './features/legal/PrivacyPage.tsx';
import { TermsPage } from './features/legal/TermsPage.tsx';

const Fallback = ({ error }: { error: Error }) => (
  <div role='alert' className='p-8'>
    <h1 className='text-red-600 font-bold'>Something went wrong</h1>
    <pre className='bg-gray-100 p-4 mt-2'>{error.message}</pre>
    <button
      type='button'
      onClick={() => globalThis.location.reload()}
      className='mt-4 px-4 py-2 border rounded'
    >
      Reload Page
    </button>
  </div>
);

const NotFound = () => (
  <div className='text-center py-8'>
    <h1 className='font-bold text-xl'>404 - Not Found</h1>
    <p className='text-gray-500'>The page you are looking for does not exist.</p>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <ResponsiveGooeyToaster />
      <BrowserRouter>
        <AuthLayout>
          <Routes>
            <Route path='/' element={<Navigate to='/login' replace />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            <Route path='/reset-password' element={<ResetPasswordPage />} />
            <Route path='/activate' element={<ActivationPage />} />
            <Route path='/verify-email' element={<VerifyEmailPage />} />
            <Route path='/claim-order' element={<ClaimOrderPage />} />
            <Route path='/help' element={<HelpPage />} />
            <Route path='/privacy' element={<PrivacyPage />} />
            <Route path='/terms' element={<TermsPage />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </AuthLayout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
