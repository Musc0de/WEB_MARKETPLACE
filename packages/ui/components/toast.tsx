import {
  goeyToast,
  GoeyToaster as Toaster,
  type GoeyToastOptions as ToastOptions,
} from 'goey-toast';
import 'goey-toast/styles.css';

export const ToastProvider = (): JSX.Element => {
  return <Toaster position='bottom-right' />;
};

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
    // goey-toast doesn't have a built-in disable animation toggle globally but you can override classNames
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

export const toast = {
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
