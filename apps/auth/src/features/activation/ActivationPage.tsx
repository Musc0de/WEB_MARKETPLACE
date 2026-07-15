import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@starsuperscare/ui';
import { Input } from '../../components/ui/Input.tsx';
import { useToast } from '../../components/ui/ToastProvider.tsx';
import { apiClient, parseApiError } from '../../lib/api.ts';
import { ActivationSchema } from '../../lib/schemas.ts';
import { z } from 'zod';

export function ActivationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toast = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!token) {
      toast('Activation token is missing', 'error');
      return;
    }

    try {
      ActivationSchema.parse({ username, password });
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        (err as z.ZodError<any>).issues.forEach((e: any) => {
          if (e.path[0]) newErrors[e.path[0].toString()] = e.message;
        });
        setErrors(newErrors);
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await apiClient.v1.auth.activation.$post({
        json: { token, newPassword: password, username },
      });

      if (!res.ok) {
        const errorMsg = await parseApiError(res);
        toast(errorMsg, 'error');
        return;
      }

      setIsSuccess(true);
      toast('Account activated successfully!', 'success');

      // Redirect directly to dashboard or returnTo URL
      setTimeout(() => {
        const returnTo = searchParams.get('return_to');
        if (returnTo) {
          globalThis.location.href = returnTo;
        } else {
          globalThis.location.href = (import.meta as any).env?.VITE_DASHBOARD_URL ||
            'http://localhost:5175';
        }
      }, 1500);
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
          Account Activated!
        </h1>
        <p style={{ color: '#4b5563', marginBottom: '24px' }}>
          Your account has been fully activated. Redirecting you to your dashboard...
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
          The activation token is missing from the URL. Please use the link provided in your email.
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
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#111827' }}>Activate Account</h1>
      <p style={{ color: '#4b5563', marginBottom: '24px', fontSize: '14px' }}>
        Welcome! Please choose a username and secure password to complete your account setup.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label='Choose Username'
          type='text'
          value={username}
          onChange={(e: any) => setUsername(e.target.value)}
          error={errors.username}
          disabled={isLoading}
          placeholder='your_username'
          autoComplete='username'
        />

        <Input
          label='Set Password'
          type='password'
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          error={errors.password}
          disabled={isLoading}
          placeholder='••••••••'
          autoComplete='new-password'
        />

        <Button
          disabled={isLoading}
          style={{ width: '100%', marginTop: '8px', marginBottom: '16px' }}
        >
          {isLoading ? 'Activating...' : 'Activate Account'}
        </Button>
      </form>
    </div>
  );
}
