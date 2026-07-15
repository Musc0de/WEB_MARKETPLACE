import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<InputProps> & React.RefAttributes<HTMLInputElement>
> = React.forwardRef<
  HTMLInputElement,
  InputProps
>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex h-10 w-full rounded-[var(--radius-control)] border bg-[var(--color-bg-surface)] px-[var(--spacing-3)] py-[var(--spacing-2)] text-[var(--text-sm)] ring-offset-background file:border-0 file:bg-transparent file:text-[var(--text-sm)] file:font-medium placeholder:text-[var(--color-text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-[var(--motion-fast)] ${
          error
            ? 'border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]'
            : 'border-[var(--color-border-default)]'
        } ${className}`}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
