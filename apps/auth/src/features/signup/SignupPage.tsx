import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@starsuperscare/ui';
import { Input } from '../../components/ui/Input.tsx';
import { useToast } from '../../components/ui/ToastProvider.tsx';
import { apiClient, parseApiError } from '../../lib/api.ts';
import { SignupSchema } from '../../lib/schemas.ts';
import { z } from 'zod';

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      SignupSchema.parse({ email, username, password });
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
      const res = await apiClient.v1.auth.signup.$post({
        json: { email, username, password },
      });

      if (!res.ok) {
        const errorMsg = await parseApiError(res);
        toast(errorMsg, 'error');
        return;
      }

      setIsSuccess(true);
      toast('Account created! Please verify your email.', 'success');
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
          Check Your Email
        </h1>
        <p style={{ color: '#4b5563', marginBottom: '24px' }}>
          We've sent a verification link to{' '}
          <strong>{email}</strong>. Please check your inbox to activate your account.
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
      <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#111827' }}>Create an Account</h1>
      <p style={{ color: '#4b5563', marginBottom: '24px', fontSize: '14px' }}>
        Join StarSuperScare today.
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
          autoComplete='email'
        />

        <Input
          label='Username'
          type='text'
          value={username}
          onChange={(e: any) => setUsername(e.target.value)}
          error={errors.username}
          disabled={isLoading}
          placeholder='cool_user'
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
          autoComplete='new-password'
        />

        <Button
          type='submit'
          disabled={isLoading}
          style={{ width: '100%', marginTop: '8px', marginBottom: '16px' }}
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#4b5563' }}>
          Already have an account?{' '}
          <Link to='/login' style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
