import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = 'text', id, icon, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        <label
          htmlFor={inputId}
          className='text-sm font-medium text-gray-700'
        >
          {label}
        </label>

        <div className='relative group'>
          {icon && (
            <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none'>
              {icon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={inputType}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`
              w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 outline-none
              bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-4
              ${icon ? 'pl-10' : ''}
              ${isPassword ? 'pr-10' : ''}
              ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900 placeholder-red-300'
                : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400'
            }
            `}
            {...props}
          />

          {isPassword && (
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-indigo-500 transition-colors p-1'
            >
              {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
            </button>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className='text-xs text-red-500 mt-0.5 animate-in slide-in-from-top-1'
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
