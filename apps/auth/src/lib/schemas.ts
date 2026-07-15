import { z } from 'zod';

export const LoginSchema = z.object({
  identifier: z.string().min(3, 'Username or Email is too short'),
  password: z.string().min(1, 'Password is required'),
});

export const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(
    /^[a-zA-Z0-9_]+$/,
    'Only alphanumeric and underscores allowed',
  ),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const ActivationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
