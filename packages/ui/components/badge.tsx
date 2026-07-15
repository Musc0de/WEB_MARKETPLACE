import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const Badge: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<BadgeProps> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<
  HTMLDivElement,
  BadgeProps
>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'border-transparent bg-[var(--color-action-primary)] text-white hover:opacity-90',
      secondary:
        'border-transparent bg-[var(--color-bg-canvas)] text-[var(--color-text-primary)] hover:bg-[var(--color-border-default)]',
      destructive: 'border-transparent bg-[var(--color-danger)] text-white hover:opacity-90',
      outline: 'text-[var(--color-text-primary)] border-[var(--color-border-default)]',
    };

    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-[var(--radius-pill)] border px-[var(--spacing-2)] py-[var(--spacing-1)] text-[var(--text-metadata)] font-semibold transition-colors duration-[var(--motion-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--color-action-primary)] focus:ring-offset-2 ${
          variants[variant]
        } ${className}`}
        {...props}
      />
    );
  },
);
Badge.displayName = 'Badge';
