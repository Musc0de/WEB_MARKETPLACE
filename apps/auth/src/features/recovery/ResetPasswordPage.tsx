import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@starsuperscare/ui';
import { Input } from '../../components/ui/Input.tsx';
import { useToast } from '../../components/ui/ToastProvider.tsx';
import { apiClient, parseApiError } from '../../lib/api.ts';
import { ResetPasswordSchema } from '../../lib/schemas.ts';
import { z } from 'zod';

export function ResetPasswordPage() {
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
      toast('Reset token is missing from the URL', 'error');
      return;
    }

    try {
      ResetPasswordSchema.parse({ password });
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
      const res = await apiClient.v1.auth['reset-password'].$post({
        json: { token, newPassword: password },
      });

      if (!res.ok) {
        const errorMsg = await parseApiError(res);
        toast(errorMsg, 'error');
        return;
      }

      setIsSuccess(true);
      toast('Password reset successfully!', 'success');
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
          Password Updated
        </h1>
        <p style={{ color: '#4b5563', marginBottom: '24px' }}>
          Your password has been successfully reset. All previous sessions have been revoked for
          your security.
        </p>
        <Link to='/login' style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 500 }}>
          Go to Login
        </Link>
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
          The password reset token is missing. Please request a new password reset link.
        </p>
        <Link
          to='/forgot-password'
          style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 500 }}
        >
          Request New Link
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
      <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#111827' }}>Reset Password</h1>
      <p style={{ color: '#4b5563', marginBottom: '24px', fontSize: '14px' }}>
        Please enter your new password below.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label='New Password'
          type='password'
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          error={errors.password}
          disabled={isLoading}
          placeholder='••••••••'
          autoComplete='new-password'
        />

        <Button
          type='submit'
          disabled={isLoading}
          style={{ width: '100%', marginTop: '8px', marginBottom: '16px' }}
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
}
