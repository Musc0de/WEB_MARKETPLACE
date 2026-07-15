import React from 'react';

export const H1: React.ForwardRefExoticComponent<
  & React.PropsWithoutRef<React.HTMLAttributes<HTMLHeadingElement>>
  & React.RefAttributes<HTMLHeadingElement>
> = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(
  ({ className = '', ...props }, ref) => (
    <h1
      ref={ref}
      className={`text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}
      {...props}
    />
  ),
);
H1.displayName = 'H1';

export const H2: React.ForwardRefExoticComponent<
  & React.PropsWithoutRef<React.HTMLAttributes<HTMLHeadingElement>>
  & React.RefAttributes<HTMLHeadingElement>
> = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(
  ({ className = '', ...props }, ref) => (
    <h2
      ref={ref}
      className={`text-3xl font-bold tracking-tight first:mt-0 ${className}`}
      {...props}
    />
  ),
);
H2.displayName = 'H2';

export const H3: React.ForwardRefExoticComponent<
  & React.PropsWithoutRef<React.HTMLAttributes<HTMLHeadingElement>>
  & React.RefAttributes<HTMLHeadingElement>
> = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(
  ({ className = '', ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-2xl font-semibold tracking-tight ${className}`}
      {...props}
    />
  ),
);
H3.displayName = 'H3';

export const H4: React.ForwardRefExoticComponent<
  & React.PropsWithoutRef<React.HTMLAttributes<HTMLHeadingElement>>
  & React.RefAttributes<HTMLHeadingElement>
> = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(
  ({ className = '', ...props }, ref) => (
    <h4
      ref={ref}
      className={`text-xl font-semibold tracking-tight ${className}`}
      {...props}
    />
  ),
);
H4.displayName = 'H4';

export const Text: React.ForwardRefExoticComponent<
  & React.PropsWithoutRef<React.HTMLAttributes<HTMLParagraphElement>>
  & React.RefAttributes<HTMLParagraphElement>
> = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(
  ({ className = '', ...props }, ref) => (
    <p
      ref={ref}
      className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}
      {...props}
    />
  ),
);
Text.displayName = 'Text';

export const Small: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.HTMLAttributes<HTMLElement>> & React.RefAttributes<HTMLElement>
> = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(
  ({ className = '', ...props }, ref) => (
    <small
      ref={ref}
      className={`text-sm font-medium leading-none ${className}`}
      {...props}
    />
  ),
);
Small.displayName = 'Small';

export const Muted: React.ForwardRefExoticComponent<
  & React.PropsWithoutRef<React.HTMLAttributes<HTMLParagraphElement>>
  & React.RefAttributes<HTMLParagraphElement>
> = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(
  ({ className = '', ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}
      {...props}
    />
  ),
);
Muted.displayName = 'Muted';
