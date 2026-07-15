import React, { useEffect, useRef } from 'react';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
}) => {
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
      onOpenChange(false);
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onOpenChange]);

  return (
    <dialog
      ref={dialogRef}
      className='backdrop:bg-black/50 open:animate-in open:fade-in-0 open:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 p-0 rounded-xl shadow-lg border border-gray-200'
      onClick={(e) => {
        // Close when clicking the backdrop
        if (e.target === dialogRef.current) {
          onOpenChange(false);
        }
      }}
    >
      <div className='w-full max-w-lg bg-white p-6' onClick={(e) => e.stopPropagation()}>
        <div className='flex flex-col space-y-1.5 text-center sm:text-left mb-4'>
          <h2 className='text-lg font-semibold leading-none tracking-tight'>{title}</h2>
          {description && <p className='text-sm text-gray-500'>{description}</p>}
        </div>
        <div>{children}</div>
      </div>
    </dialog>
  );
};
