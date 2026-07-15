import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@starsuperscare/ui';
import { useToast } from '../../components/ui/ToastProvider.tsx';
import { apiClient, parseApiError } from '../../lib/api.ts';

export function ClaimOrderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const claimOrder = async () => {
    if (!token) return;
    setIsLoading(true);
    setHasAttempted(true);
    try {
      const res = await apiClient.v1.auth['claim-order'].$post({
        json: { token },
      });

      if (!res.ok) {
        const errorMsg = await parseApiError(res);
        toast(errorMsg, 'error');
        return;
      }

      setIsSuccess(true);
      toast('Order successfully claimed!', 'success');

      // Redirect directly to dashboard or login
      setTimeout(() => {
        globalThis.location.href = (import.meta as any).env?.VITE_DASHBOARD_URL ||
          'http://localhost:5175';
      }, 2000);
    } catch (err: any) {
      toast(err.message || 'Network error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
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
        <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#166534' }}>
          Order Claimed!
        </h1>
        <p style={{ color: '#4b5563', marginBottom: '24px' }}>
          The order has been successfully linked to your account. Redirecting you to your
          dashboard...
        </p>
      </div>
    );
  }

  if (!token) {
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
        <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#991b1b' }}>Invalid Request</h1>
        <p style={{ color: '#4b5563', marginBottom: '24px' }}>
          The claim link is invalid or missing a token. Please use the exact link sent to your
          email.
        </p>
      </div>
    );
  }

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
      <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#111827' }}>Claim Your Order</h1>
      <p style={{ color: '#4b5563', marginBottom: '24px' }}>
        Click the button below to securely link this order to your account.
      </p>

      {!hasAttempted && (
        <Button onClick={claimOrder} disabled={isLoading} style={{ width: '100%' }}>
          {isLoading ? 'Claiming...' : 'Claim Order'}
        </Button>
      )}

      {hasAttempted && !isSuccess && !isLoading && (
        <div style={{ marginTop: '16px' }}>
          <p style={{ color: '#991b1b', marginBottom: '16px' }}>
            Failed to claim order. The link might be expired or already used.
          </p>
          <Link to='/login' style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 500 }}>
            Go to Login
          </Link>
        </div>
      )}
    </div>
  );
}
