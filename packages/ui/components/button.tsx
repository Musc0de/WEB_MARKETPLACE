import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<ButtonProps> & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-[var(--radius-control)] text-sm font-medium ring-offset-background transition-colors duration-[var(--motion-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      default:
        'bg-[var(--color-action-primary)] text-white hover:bg-[var(--color-action-hover)] active:bg-[var(--color-action-active)]',
      destructive: 'bg-[var(--color-danger)] text-white hover:opacity-90',
      outline:
        'border border-[var(--color-border-default)] bg-transparent hover:bg-[var(--color-bg-canvas)] hover:text-[var(--color-text-primary)]',
      secondary:
        'bg-[var(--color-bg-canvas)] text-[var(--color-text-primary)] hover:bg-[var(--color-border-default)]',
      ghost: 'hover:bg-[var(--color-bg-canvas)] hover:text-[var(--color-text-primary)]',
      link: 'text-[var(--color-action-primary)] underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-10 px-[var(--spacing-4)] py-[var(--spacing-2)]',
      sm: 'h-9 px-[var(--spacing-3)]',
      lg: 'h-11 px-[var(--spacing-8)]',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
