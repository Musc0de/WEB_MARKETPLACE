import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<TextareaProps> & React.RefAttributes<HTMLTextAreaElement>
> = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`flex min-h-[80px] w-full rounded-[var(--radius-control)] border bg-[var(--color-bg-surface)] px-[var(--spacing-3)] py-[var(--spacing-2)] text-[var(--text-sm)] ring-offset-background placeholder:text-[var(--color-text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-[var(--motion-fast)] ${
          error
            ? 'border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]'
            : 'border-[var(--color-border-default)]'
        } ${className}`}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
