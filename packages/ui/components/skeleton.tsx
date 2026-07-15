import React from 'react';

export const Skeleton: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.HTMLAttributes<HTMLDivElement>> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 ${className}`}
      {...props}
    />
  ),
);
Skeleton.displayName = 'Skeleton';
