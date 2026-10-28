import { useEffect, useRef, type ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  label: string;
  className?: string;
  children: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

/**
 * Native modal <dialog>: the page behind becomes inert, Escape closes it,
 * Tab is kept inside, and focus returns to the opener on close.
 */
export function Dialog({ open, onClose, label, className, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) {
      opener.current = document.activeElement as HTMLElement | null;
      dlg.showModal();
      document.documentElement.classList.add('is-locked');
      const first = dlg.querySelector<HTMLElement>('[data-autofocus]') ?? dlg.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus({ preventScroll: true });
    } else if (!open && dlg.open) {
      dlg.close();
    }
  }, [open]);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const handleClose = () => {
      document.documentElement.classList.remove('is-locked');
      const target = opener.current;
      opener.current = null;
      if (target && document.contains(target)) target.focus({ preventScroll: true });
    };
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onCloseRef.current();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = [...dlg.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    dlg.addEventListener('close', handleClose);
    dlg.addEventListener('cancel', handleCancel);
    dlg.addEventListener('keydown', handleKey);
    return () => {
      dlg.removeEventListener('close', handleClose);
      dlg.removeEventListener('cancel', handleCancel);
      dlg.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className={className}
      aria-label={label}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
