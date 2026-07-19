import React, { useEffect, useRef } from 'react';

export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onOpenChange?.(false);
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onOpenChange]);

  return (
    <dialog
      ref={dialogRef}
      className='fixed inset-0 z-50 bg-transparent p-0 m-0 w-full max-w-none h-full max-h-none backdrop:bg-black/60 open:animate-in open:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0'
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onOpenChange?.(false);
        }
      }}
    >
      {children}
    </dialog>
  );
};

export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const SheetContent: React.FC<SheetContentProps> = ({
  children,
  className = '',
  side = 'right',
  ...props
}) => {
  return (
    <div
      className={`fixed ${
        side === 'bottom'
          ? 'inset-x-0 bottom-0'
          : side === 'top'
          ? 'inset-x-0 top-0'
          : side === 'left'
          ? 'inset-y-0 left-0'
          : 'inset-y-0 right-0'
      } ${className}`}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
};

export const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  { children, className = '', ...props },
) => (
  <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`} {...props}>
    {children}
  </div>
);

export const SheetTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (
  { children, className = '', ...props },
) => (
  <h2 className={`text-lg font-semibold text-foreground ${className}`} {...props}>
    {children}
  </h2>
);

export const SheetDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = (
  { children, className = '', ...props },
) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>
    {children}
  </p>
);
