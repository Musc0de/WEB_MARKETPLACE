import React from 'react';

export const Card: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.HTMLAttributes<HTMLDivElement>> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-xl border bg-card text-card-foreground shadow-sm bg-white ${className}`}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export const CardHeader: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.HTMLAttributes<HTMLDivElement>> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 p-6 ${className}`}
      {...props}
    />
  ),
);
CardHeader.displayName = 'CardHeader';

export const CardTitle: React.ForwardRefExoticComponent<
  & React.PropsWithoutRef<React.HTMLAttributes<HTMLHeadingElement>>
  & React.RefAttributes<HTMLHeadingElement>
> = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(
  ({ className = '', ...props }, ref) => (
    <h3
      ref={ref}
      className={`font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

export const CardDescription: React.ForwardRefExoticComponent<
  & React.PropsWithoutRef<React.HTMLAttributes<HTMLParagraphElement>>
  & React.RefAttributes<HTMLParagraphElement>
> = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(
  ({ className = '', ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm text-muted-foreground ${className}`}
      {...props}
    />
  ),
);
CardDescription.displayName = 'CardDescription';

export const CardContent: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.HTMLAttributes<HTMLDivElement>> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

export const CardFooter: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.HTMLAttributes<HTMLDivElement>> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`flex items-center p-6 pt-0 ${className}`}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';
