import React, { forwardRef, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = 'text', id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    // Auto-generate id if not provided for accessibility pairing
    const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const isPassword = type === 'password';

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
        <label
          htmlFor={inputId}
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {label}
        </label>

        <div style={{ position: 'relative' }}>
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'system-ui, sans-serif',
              boxSizing: 'border-box',
              outline: 'none',
              paddingRight: isPassword ? '40px' : '12px',
              transition: 'border-color 0.15s ease-in-out',
            }}
            onFocus={(e) => {
              if (!error) {
                e.target.style.borderColor = '#4f46e5';
              }
            }}
            onBlur={(e) => {
              if (!error) {
                e.target.style.borderColor = '#d1d5db';
              }
            }}
            {...props}
          />

          {isPassword && (
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
              }}
            >
              {showPassword
                ? (
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'>
                    </path>
                    <line x1='1' y1='1' x2='23' y2='23'></line>
                  </svg>
                )
                : (
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
                    <circle cx='12' cy='12' r='3'></circle>
                  </svg>
                )}
            </button>
          )}
        </div>

        {error && (
          <span
            id={`${inputId}-error`}
            role='alert'
            style={{
              fontSize: '12px',
              color: '#ef4444',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
