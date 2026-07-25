import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { useLang } from '../../i18n/LanguageContext';

type LightboxProps = {
  open: boolean;
  onClose: () => void;
  /** The dialog's accessible name (aria-label) — caller supplies it, since
   *  what's being enlarged (an image, a graph) varies by call site. */
  label: string;
  children: ReactNode;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Generic, reusable modal dialog (G6-L) — click-to-enlarge popups for the
 * project card art and the capability graph both go through this. Portalled
 * to document.body: several ancestors in this tree (framer-motion's
 * animated section/card elements) carry a `transform`, which would trap a
 * plain `position: fixed` descendant to THEIR box instead of the viewport —
 * the portal sidesteps that regardless of where the Lightbox gets rendered
 * from. Renders nothing while closed; AnimatePresence unmounts the dialog
 * from the DOM once its exit animation finishes rather than just hiding it.
 *
 * A11y (hard requirements, see the work-package brief): role="dialog" +
 * aria-modal + aria-label; Esc and a backdrop click both close it (clicking
 * the dialog itself does not — the click handler on `.lightbox` stops
 * propagation); Tab is trapped inside while open; focus moves to the close
 * button on open and returns to whatever triggered the open on close; body
 * scroll is locked for the duration, with the scrollbar's own width
 * compensated via padding so locking it never shifts the layout.
 * `MotionConfig reducedMotion="user"` matches every other motion surface in
 * this codebase (Section, CommandPalette, AiChat).
 */
export function Lightbox({ open, onClose, label, children }: LightboxProps) {
  const { t } = useLang();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Scroll lock + focus in/out, scoped to the open state's own lifetime.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // A tick after mount so the portal's DOM node exists to focus.
    const focusTimer = setTimeout(() => closeBtnRef.current?.focus(), 30);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  // Esc closes; Tab (and Shift+Tab) wrap within the dialog's own focusables.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return createPortal(
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          >
            <motion.div
              ref={dialogRef}
              className="lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={label}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeBtnRef}
                type="button"
                className="icon-btn lightbox__close"
                onClick={onClose}
                aria-label={t('lightbox.close')}
              >
                <FiX aria-hidden="true" />
              </button>
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>,
    document.body
  );
}
