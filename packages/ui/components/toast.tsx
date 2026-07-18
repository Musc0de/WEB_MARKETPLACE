import { useEffect, useState } from 'react';
import {
  goeyToast,
  GoeyToaster as Toaster,
  type GoeyToastOptions as ToastOptions,
} from 'goey-toast';
import 'goey-toast/styles.css';

export const ResponsiveGooeyToaster = (): JSX.Element => {
  const [position, setPosition] = useState<'top-right' | 'bottom-center'>('top-right');

  useEffect(() => {
    const handleResize = () => {
      // Always show toast at the top right, even on mobile devices.
      setPosition('top-right');
    };

    // Set initial position
    handleResize();

    globalThis.addEventListener('resize', handleResize);
    return () => globalThis.removeEventListener('resize', handleResize);
  }, []);

  return <Toaster position={position} />;
};

// Alias for backward compatibility
export const ToastProvider = ResponsiveGooeyToaster;

// Check if user prefers reduced motion for accessibility
const prefersReducedMotion = (): boolean => {
  if (typeof globalThis === 'undefined' || !globalThis.matchMedia) return false;
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Internal helper for standardized toasts
const createToast = (
  message: string,
  type: 'success' | 'error' | 'warning' | 'info',
  options?: ToastOptions,
): string | number => {
  const baseOptions: ToastOptions = {
    duration: type === 'error' ? 5000 : 3000,
    ...options,
  };

  // Turn off animations if user prefers reduced motion
  if (prefersReducedMotion()) {
    baseOptions.classNames = {
      ...baseOptions.classNames,
      wrapper: `${baseOptions.classNames?.wrapper || ''} !transition-none !animate-none`.trim(),
    };
  }

  switch (type) {
    case 'success':
      return goeyToast.success(message, baseOptions);
    case 'error':
      return goeyToast.error(message, baseOptions);
    case 'info':
      return goeyToast(message, {
        icon: 'ℹ️',
        ...baseOptions,
      });
    case 'warning':
      return goeyToast(message, {
        icon: '⚠️',
        ...baseOptions,
      });
    default:
      return goeyToast(message, baseOptions);
  }
};

export const notify = {
  success: (message: string = 'Berhasil!', options?: ToastOptions): string | number =>
    createToast(message, 'success', options),

  error: (message: string = 'Terjadi kesalahan sistem.', options?: ToastOptions): string | number =>
    createToast(message, 'error', options),

  info: (message: string, options?: ToastOptions): string | number =>
    createToast(message, 'info', options),

  warning: (message: string, options?: ToastOptions): string | number =>
    createToast(message, 'warning', options),

  promise: <T,>(
    promise: Promise<T>,
    msgs: {
      loading?: string;
      success?: string | ((data: T) => string);
      error?: string | ((err: any) => string);
    } = {},
  ): string => {
    return goeyToast.promise(promise, {
      loading: msgs.loading || 'Sedang memproses...',
      success: msgs.success || 'Berhasil memproses data.',
      error: msgs.error || 'Gagal memproses data.',
    });
  },

  dismiss: (toastId?: string): void => goeyToast.dismiss(toastId),
};

// Alias for backward compatibility
export const toast = notify;
