import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@starsuperscare/ui';
import { Input } from '../../components/ui/Input.tsx';
import { useToast } from '../../components/ui/ToastProvider.tsx';
import { apiClient, parseApiError } from '../../lib/api.ts';
import { ForgotPasswordSchema } from '../../lib/schemas.ts';
import { z } from 'zod';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      ForgotPasswordSchema.parse({ email });
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
      const res = await apiClient.v1.auth['forgot-password'].$post({
        json: { email },
      });

      if (!res.ok) {
        const errorMsg = await parseApiError(res);
        toast(errorMsg, 'error');
        return;
      }

      setIsSuccess(true);
      toast('Reset instructions sent', 'success');
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
        <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#111827' }}>
          Check your email
        </h1>
        <p style={{ color: '#4b5563', marginBottom: '24px' }}>
          If an account exists for <strong>{email}</strong>, we've sent password reset instructions.
        </p>
        <Link to='/login' style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 500 }}>
          Back to Login
        </Link>
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
      <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#111827' }}>Forgot Password</h1>
      <p style={{ color: '#4b5563', marginBottom: '24px', fontSize: '14px' }}>
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label='Email Address'
          type='email'
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          error={errors.email}
          disabled={isLoading}
          placeholder='you@example.com'
        />

        <Button
          type='submit'
          disabled={isLoading}
          style={{ width: '100%', marginTop: '8px', marginBottom: '16px' }}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>

        <p style={{ textAlign: 'center', fontSize: '14px' }}>
          <Link to='/login' style={{ color: '#4b5563', textDecoration: 'none', fontWeight: 500 }}>
            ← Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}
