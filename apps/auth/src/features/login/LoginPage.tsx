import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@starsuperscare/ui';
import { Input } from '../../components/ui/Input.tsx';
import { useToast } from '../../components/ui/ToastProvider.tsx';
import { apiClient, parseApiError } from '../../lib/api.ts';
import { LoginSchema } from '../../lib/schemas.ts';
import { z } from 'zod';

export function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    try {
      LoginSchema.parse({ identifier, password });
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
      const res = await apiClient.v1.auth.login.$post({
        json: { identifier, password },
      });

      if (!res.ok) {
        const errorMsg = await parseApiError(res);
        toast(errorMsg, 'error');
        return;
      }

      toast('Login successful!', 'success');

      // Handle return_to
      const returnTo = searchParams.get('return_to');
      if (returnTo) {
        // Redirecting via location.href because it might go to another subdomain (dashboard)
        globalThis.location.href = returnTo;
      } else {
        // Fallback default
        const dashboardUrl = (import.meta as any).env?.VITE_DASHBOARD_URL;
        globalThis.location.href = dashboardUrl ? dashboardUrl : 'http://localhost:5175';
      }
    } catch (err: any) {
      toast(err.message || 'Network error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '40px auto',
        padding: '24px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#111827' }}>Welcome back</h1>
      <p style={{ color: '#4b5563', marginBottom: '24px', fontSize: '14px' }}>
        Sign in to your account
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label='Username or Email'
          type='text'
          value={identifier}
          onChange={(e: any) => setIdentifier(e.target.value)}
          error={errors.identifier}
          disabled={isLoading}
          placeholder='admin'
          autoComplete='username'
        />

        <Input
          label='Password'
          type='password'
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          error={errors.password}
          disabled={isLoading}
          placeholder='••••••••'
          autoComplete='current-password'
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <Link
            to='/forgot-password'
            style={{ fontSize: '14px', color: '#4f46e5', textDecoration: 'none', fontWeight: 500 }}
          >
            Forgot password?
          </Link>
        </div>

        <Button type='submit' disabled={isLoading} style={{ width: '100%', marginBottom: '16px' }}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#4b5563' }}>
          Don't have an account?{' '}
          <Link to='/signup' style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 500 }}>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
