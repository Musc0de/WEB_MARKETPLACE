import React from 'react';

export const Label: React.ForwardRefExoticComponent<
  & React.PropsWithoutRef<React.LabelHTMLAttributes<HTMLLabelElement>>
  & React.RefAttributes<HTMLLabelElement>
> = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(
  ({ className = '', ...props }, ref) => (
    <label
      ref={ref}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    />
  ),
);
Label.displayName = 'Label';

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string;
}

export const FormGroup: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<FormGroupProps> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<
  HTMLDivElement,
  FormGroupProps
>(
  ({ className = '', error, children, ...props }, ref) => (
    <div ref={ref} className={`space-y-2 ${className}`} {...props}>
      {children}
      {error && <p className='text-[0.8rem] font-medium text-red-500'>{error}</p>}
    </div>
  ),
);
FormGroup.displayName = 'FormGroup';
