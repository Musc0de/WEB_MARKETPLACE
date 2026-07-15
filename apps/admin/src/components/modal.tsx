/**
 * AdminModal — reusable dialog system for admin pages.
 * Replaces browser prompt() / confirm() / alert() with styled popups.
 *
 * Usage:
 *   import { useModal, ConfirmModal, InputModal } from '../../components/modal.tsx';
 *
 *   const modal = useModal();
 *   const confirmed = await modal.confirm({ title: '...', message: '...' });
 *   const value = await modal.input({ title: '...', label: '...', placeholder: '...' });
 */

import { useCallback, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalVariant = 'danger' | 'warning' | 'success' | 'info';

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  variant?: ModalVariant;
}

interface ConfirmModalProps extends BaseModalProps {
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

interface InputModalProps extends BaseModalProps {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  inputType?: 'text' | 'number';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (value: string) => void;
}

interface ToggleModalProps extends BaseModalProps {
  toggleLabel: string;
  defaultToggle?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputType?: 'text' | 'number';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (value: string, toggle: boolean) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<
  ModalVariant,
  { icon: typeof AlertTriangle; iconBg: string; iconColor: string; btn: string }
> = {
  danger: {
    icon: AlertTriangle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    btn: 'bg-red-600 hover:bg-red-500 text-white',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    btn: 'bg-amber-600 hover:bg-amber-500 text-white',
  },
  success: {
    icon: CheckCircle2,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    btn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  },
  info: {
    icon: Info,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white',
  },
};

// ─── Backdrop & Shell ────────────────────────────────────────────────────────

function ModalShell(
  { open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode },
) {
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className='relative w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl'
        style={{ animation: 'modalIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both' }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>
          {`@keyframes modalIn { from { opacity:0; transform:scale(0.9) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }`}
        </style>
        {children}
      </div>
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'info',
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
}: ConfirmModalProps) {
  const { icon: Icon, iconBg, iconColor, btn } = VARIANT_STYLES[variant];

  return (
    <ModalShell open={open} onClose={onClose}>
      <div className='p-6'>
        {/* Icon + close */}
        <div className='mb-4 flex items-start justify-between gap-3'>
          <span
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${iconBg}`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </span>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
        {/* Content */}
        <h3 className='text-base font-bold text-gray-900'>{title}</h3>
        {message && <p className='mt-1.5 text-sm text-gray-500 leading-relaxed'>{message}</p>}
        {/* Actions */}
        <div className='mt-6 flex gap-2.5 justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition'
          >
            {cancelLabel}
          </button>
          <button
            type='button'
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition ${btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Input Modal ──────────────────────────────────────────────────────────────

export function InputModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  label,
  placeholder = '',
  defaultValue = '',
  inputType = 'text',
  variant = 'info',
  confirmLabel = 'Simpan',
  cancelLabel = 'Batal',
}: InputModalProps) {
  const [value, setValue] = useState(defaultValue);
  const { icon: Icon, iconBg, iconColor, btn } = VARIANT_STYLES[variant];

  const handleConfirm = () => {
    onConfirm(value);
    onClose();
    setValue(defaultValue);
  };

  return (
    <ModalShell open={open} onClose={onClose}>
      <div className='p-6'>
        <div className='mb-4 flex items-start justify-between gap-3'>
          <span
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${iconBg}`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </span>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg p-1 text-gray-400 hover:bg-gray-100 transition'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
        <h3 className='text-base font-bold text-gray-900'>{title}</h3>
        {message && <p className='mt-1 text-sm text-gray-500'>{message}</p>}
        <div className='mt-4'>
          <label className='mb-1.5 block text-sm font-semibold text-gray-700'>{label}</label>
          <input
            type={inputType}
            autoFocus
            value={value}
            placeholder={placeholder}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            className='w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20'
          />
        </div>
        <div className='mt-5 flex gap-2.5 justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition'
          >
            {cancelLabel}
          </button>
          <button
            type='button'
            onClick={handleConfirm}
            className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition ${btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Toggle + Optional Input Modal ────────────────────────────────────────────
// (e.g. Process Refund: amount input + restock toggle)

export function ToggleInputModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  toggleLabel,
  defaultToggle = false,
  inputLabel,
  inputPlaceholder = '',
  inputType = 'text',
  variant = 'info',
  confirmLabel = 'Proses',
  cancelLabel = 'Batal',
}: ToggleModalProps) {
  const [value, setValue] = useState('');
  const [toggled, setToggled] = useState(defaultToggle);
  const { icon: Icon, iconBg, iconColor, btn } = VARIANT_STYLES[variant];

  const handleConfirm = () => {
    onConfirm(value, toggled);
    onClose();
    setValue('');
    setToggled(defaultToggle);
  };

  return (
    <ModalShell open={open} onClose={onClose}>
      <div className='p-6'>
        <div className='mb-4 flex items-start justify-between gap-3'>
          <span
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${iconBg}`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </span>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg p-1 text-gray-400 hover:bg-gray-100 transition'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        <h3 className='text-base font-bold text-gray-900'>{title}</h3>
        {message && <p className='mt-1 text-sm text-gray-500'>{message}</p>}

        {inputLabel && (
          <div className='mt-4'>
            <label className='mb-1.5 block text-sm font-semibold text-gray-700'>{inputLabel}</label>
            <input
              type={inputType}
              autoFocus
              value={value}
              placeholder={inputPlaceholder}
              onChange={(e) => setValue(e.target.value)}
              className='w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20'
            />
          </div>
        )}

        {/* Toggle */}
        <div className='mt-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3'>
          <button
            type='button'
            role='switch'
            aria-checked={toggled}
            onClick={() => setToggled(!toggled)}
            className={`relative h-5 w-9 rounded-full transition-colors duration-200 focus:outline-none ${
              toggled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                toggled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
          <span className='text-sm font-medium text-gray-700'>{toggleLabel}</span>
        </div>

        <div className='mt-5 flex gap-2.5 justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition'
          >
            {cancelLabel}
          </button>
          <button
            type='button'
            onClick={handleConfirm}
            className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition ${btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Imperative hook (optional sugar) ────────────────────────────────────────
// For simple state wiring in components

export function useModalState(initial = false) {
  const [open, setOpen] = useState(initial);
  return {
    open,
    show: useCallback(() => setOpen(true), []),
    hide: useCallback(() => setOpen(false), []),
  };
}
