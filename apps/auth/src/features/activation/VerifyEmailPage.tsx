import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiClient, parseApiError } from '../../lib/api.ts';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Verification token is missing.');
      return;
    }

    let isMounted = true;

    const verifyToken = async () => {
      try {
        const res = await apiClient.v1.auth['verify-email'].$post({
          json: { token },
        });

        if (!isMounted) return;

        if (!res.ok) {
          const msg = await parseApiError(res);
          setStatus('error');
          setErrorMessage(msg);
          return;
        }

        setStatus('success');
      } catch (err: any) {
        if (!isMounted) return;
        setStatus('error');
        setErrorMessage(err.message || 'A network error occurred.');
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '40px auto',
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {status === 'loading' && (
        <>
          <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#111827' }}>
            Verifying Email...
          </h1>
          <p style={{ color: '#4b5563', marginBottom: '24px' }}>
            Please wait while we verify your email address.
          </p>
          <div
            style={{
              width: '24px',
              height: '24px',
              border: '3px solid #e5e7eb',
              borderTopColor: '#4f46e5',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}

      {status === 'success' && (
        <>
          <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#166534' }}>
            Email Verified!
          </h1>
          <p style={{ color: '#4b5563', marginBottom: '24px' }}>
            Your email address has been successfully verified. You can now access all features.
          </p>
          <Link
            to='/login'
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#4f46e5',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 500,
            }}
          >
            Continue to Login
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#991b1b' }}>
            Verification Failed
          </h1>
          <p style={{ color: '#4b5563', marginBottom: '24px' }}>{errorMessage}</p>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>
            The link might be expired or invalid. Try signing in to request a new link.
          </p>
          <Link
            to='/login'
            style={{
              color: '#4f46e5',
              textDecoration: 'none',
              fontWeight: 500,
              marginTop: '16px',
              display: 'inline-block',
            }}
          >
            Go to Login
          </Link>
        </>
      )}
    </div>
  );
}
