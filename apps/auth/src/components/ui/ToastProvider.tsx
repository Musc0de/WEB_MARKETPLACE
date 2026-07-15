import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div
        aria-live='polite'
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              backgroundColor: t.type === 'error'
                ? '#fee2e2'
                : t.type === 'success'
                ? '#dcfce7'
                : '#e0e7ff',
              color: t.type === 'error' ? '#991b1b' : t.type === 'success' ? '#166534' : '#3730a3',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: '250px',
              animation: 'slideIn 0.3s ease-out forwards',
            }}
          >
            <span>{t.message}</span>
            <button
              type='button'
              onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                marginLeft: '12px',
                color: 'inherit',
                opacity: 0.7,
              }}
              aria-label='Close notification'
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}
