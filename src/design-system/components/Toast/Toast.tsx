import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { twMerge } from '../../utils/cn';
import {
  IconCircleCheck,
  IconAlertTriangle,
  IconCircleX,
  IconInfoCircle,
  IconX,
  IconExternalLink,
  IconChevronUp,
} from '@tabler/icons-react';

/* ----------------------------------------
   Toast Types
   ---------------------------------------- */

export type ToastVariant = 'success' | 'warning' | 'error' | 'info';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface ToastLink {
  /** Link label text */
  label: string;
  /** Optional URL for external link */
  href?: string;
  /** Optional click handler */
  onClick?: () => void;
}

export interface ToastDetail {
  /** Optional error/status code */
  code?: string;
  /** Detail content/message */
  content: string;
}

export interface ToastData {
  id: string;
  variant: ToastVariant;
  message: string;
  /** Optional title for the toast */
  title?: string;
  /** Optional project/source label */
  project?: string;
  /** Optional timestamp (displayed as hh:mm format) */
  timestamp?: Date;
  /** Duration in ms before auto-dismiss (0 = never) */
  duration?: number;
  /** Whether the toast can be manually dismissed */
  dismissible?: boolean;
  /** Optional action button */
  action?: {
    label?: string;
    icon?: ReactNode;
    onClick: () => void;
  };
  /** Optional resource link (displays at bottom of toast) */
  link?: ToastLink;
  /** Optional expandable detail section */
  detail?: ToastDetail;
}

export interface ToastProps {
  /** Toast data */
  toast: ToastData;
  /** Called when toast should be removed */
  onDismiss: (id: string) => void;
  /** Custom className */
  className?: string;
}

export interface ToastContainerProps {
  /** Position of the toast container */
  position?: ToastPosition;
  /** Maximum number of toasts to show */
  maxToasts?: number;
  /** Custom className for container */
  className?: string;
}

export interface ToastContextValue {
  /** Show a toast */
  toast: (options: Omit<ToastData, 'id'>) => string;
  /** Show a success toast */
  success: (
    message: string,
    options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>
  ) => string;
  /** Show a warning toast */
  warning: (
    message: string,
    options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>
  ) => string;
  /** Show an error toast */
  error: (
    message: string,
    options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>
  ) => string;
  /** Show an info toast */
  info: (
    message: string,
    options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>
  ) => string;
  /** Dismiss a specific toast */
  dismiss: (id: string) => void;
  /** Dismiss all toasts */
  dismissAll: () => void;
}

/* ----------------------------------------
   Variant Styles
   ---------------------------------------- */

const variantIcons: Record<ToastVariant, ReactNode> = {
  success: (
    <IconCircleCheck size={20} className="text-[var(--color-state-success)]" strokeWidth={1.5} />
  ),
  warning: (
    <IconAlertTriangle size={20} className="text-[var(--color-state-warning)]" strokeWidth={1.5} />
  ),
  error: <IconCircleX size={20} className="text-[var(--color-state-danger)]" strokeWidth={1.5} />,
  info: <IconInfoCircle size={20} className="text-[var(--color-state-info)]" strokeWidth={1.5} />,
};

/* ----------------------------------------
   Position Styles
   ---------------------------------------- */

const positionStyles: Record<ToastPosition, string> = {
  'top-right': 'top-[var(--primitive-spacing-4)] right-[var(--primitive-spacing-4)]',
  'top-left': 'top-[var(--primitive-spacing-4)] left-[var(--primitive-spacing-4)]',
  'bottom-right': 'bottom-[var(--primitive-spacing-4)] right-[var(--primitive-spacing-4)]',
  'bottom-left': 'bottom-[var(--primitive-spacing-4)] left-[var(--primitive-spacing-4)]',
  'top-center': 'top-[var(--primitive-spacing-4)] left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-[var(--primitive-spacing-4)] left-1/2 -translate-x-1/2',
};

/* ----------------------------------------
   Toast Context
   ---------------------------------------- */

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

/* ----------------------------------------
   Helper: Format time
   ---------------------------------------- */

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/* ----------------------------------------
   Toast Component
   ---------------------------------------- */

export function Toast({ toast, onDismiss, className = '' }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const timerRef = useRef<number | null>(null);
  const duration = toast.duration ?? 5000;
  const dismissible = toast.dismissible ?? true;
  const timestamp = toast.timestamp;

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    // Wait for animation to complete before removing
    setTimeout(() => {
      onDismiss(toast.id);
    }, 200);
  }, [onDismiss, toast.id]);

  useEffect(() => {
    if (duration > 0) {
      timerRef.current = window.setTimeout(handleDismiss, duration);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, handleDismiss]);

  // Pause timer on hover
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (duration > 0) {
      timerRef.current = window.setTimeout(handleDismiss, duration);
    }
  };

  const handleLinkClick = () => {
    if (toast.link?.onClick) {
      toast.link.onClick();
    } else if (toast.link?.href) {
      window.open(toast.link.href, '_blank', 'noopener,noreferrer');
    }
  };

  const toggleDetail = () => {
    setIsDetailExpanded((prev) => !prev);
  };

  return (
    <div
      data-figma-name="[TDS] Toast"
      role="alert"
      className={twMerge(
        'flex flex-col gap-[var(--primitive-spacing-2)]',
        'w-[360px]',
        'p-[var(--primitive-spacing-3)]',
        'rounded-[var(--primitive-radius-lg)]',
        'bg-[var(--color-surface-default)]',
        'border border-[var(--color-border-default)]',
        'shadow-lg',
        // Hover state
        'hover:border-[var(--color-action-primary)] hover:border-2',
        // Animation
        'transition-all duration-200 ease-out',
        isExiting ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0 animate-toast-in',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header Row */}
      <div className="flex items-start gap-[var(--primitive-spacing-2)]">
        {/* Icon */}
        <span className="shrink-0 -mt-px">{variantIcons[toast.variant]}</span>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-[var(--primitive-spacing-1)]">
          {/* Title */}
          {toast.title && (
            <p className="text-label-md text-[var(--color-text-default)]">{toast.title}</p>
          )}

          {/* Message */}
          <p className="text-body-md text-[var(--color-text-muted)]">{toast.message}</p>

          {/* Project Badge */}
          {toast.project && (
            <span className="inline-flex self-start px-[var(--primitive-spacing-1-5)] py-[var(--primitive-spacing-0-5)] text-body-sm text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)]">
              {toast.project}
            </span>
          )}
        </div>

        {/* Right Actions */}
        <div className="shrink-0 flex flex-col items-end gap-[var(--primitive-spacing-1)]">
          {/* Close Button */}
          {dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              className={twMerge(
                'p-[var(--primitive-spacing-1)] -m-[var(--primitive-spacing-1)]',
                'rounded-[var(--primitive-radius-sm)]',
                'text-[var(--color-text-subtle)]',
                'hover:text-[var(--color-text-default)]',
                'hover:bg-[var(--color-surface-hover)]',
                'transition-colors duration-[var(--duration-fast)]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]'
              )}
              aria-label="닫기"
            >
              <IconX size={16} strokeWidth={1.5} />
            </button>
          )}

          {/* Timestamp */}
          {timestamp && (
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              {formatTime(timestamp)}
            </span>
          )}

          {/* Action Button */}
          {toast.action && (
            <button
              type="button"
              onClick={toast.action.onClick}
              className={twMerge(
                'p-[var(--primitive-spacing-1-5)]',
                'rounded-[var(--primitive-radius-sm)]',
                'text-[var(--color-text-muted)]',
                'bg-[var(--color-surface-subtle)]',
                'hover:bg-[var(--color-surface-hover)]',
                'transition-colors duration-[var(--duration-fast)]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]'
              )}
              aria-label={toast.action.label ?? '액션'}
            >
              {toast.action.icon ?? <IconExternalLink size={14} strokeWidth={1.5} />}
            </button>
          )}
        </div>
      </div>

      {/* Link Section */}
      {toast.link && (
        <div className="flex items-center justify-end gap-[var(--primitive-spacing-1-5)]">
          <button
            type="button"
            onClick={handleLinkClick}
            className={twMerge(
              'inline-flex items-center gap-[var(--primitive-spacing-1)]',
              'text-label-md',
              'text-[var(--color-action-primary)]',
              'hover:underline hover:underline-offset-2',
              'transition-colors duration-[var(--duration-fast)]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded-[var(--primitive-radius-sm)]'
            )}
          >
            <span>{toast.link.label}</span>
            <IconExternalLink size={12} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Detail Section */}
      {toast.detail && (
        <div className="flex flex-col gap-[var(--primitive-spacing-3)]">
          {/* View Detail Toggle */}
          <button
            type="button"
            onClick={toggleDetail}
            className={twMerge(
              'inline-flex items-center justify-end gap-[var(--primitive-spacing-1-5)] w-full',
              'text-label-md',
              'text-[var(--color-text-default)]',
              'hover:text-[var(--color-text-muted)]',
              'transition-colors duration-[var(--duration-fast)]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded-[var(--primitive-radius-sm)]'
            )}
            aria-expanded={isDetailExpanded}
          >
            <span>View detail</span>
            <IconChevronUp
              size={16}
              strokeWidth={1.5}
              className={twMerge(
                'transition-transform duration-[var(--duration-fast)]',
                !isDetailExpanded && 'rotate-180'
              )}
            />
          </button>

          {/* Detail Content */}
          {isDetailExpanded && (
            <div className="flex flex-col gap-[var(--primitive-spacing-1-5)] px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-3)] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
              {toast.detail.code && (
                <p className="text-label-md text-[var(--color-text-default)]">
                  code: {toast.detail.code}
                </p>
              )}
              <p className="text-body-md text-[var(--color-text-muted)]">{toast.detail.content}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   Toast Container Component
   ---------------------------------------- */

export function ToastContainer({
  position = 'top-right',
  maxToasts = 5,
  className = '',
}: ToastContainerProps) {
  const { toasts, dismiss } = useToastStore();
  const visibleToasts = toasts.slice(0, maxToasts);
  const isBottom = position.includes('bottom');

  return (
    <div
      className={twMerge(
        'fixed z-[var(--z-toast)]',
        'flex flex-col gap-[var(--primitive-spacing-2)]',
        positionStyles[position],
        isBottom && 'flex-col-reverse',
        className
      )}
      role="region"
      aria-live="polite"
      aria-label="알림"
    >
      {visibleToasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}

/* ----------------------------------------
   Toast Store (internal)
   ---------------------------------------- */

let toastStore: ToastData[] = [];
const listeners: Set<() => void> = new Set();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return toastStore;
}

function addToast(toast: ToastData) {
  toastStore = [toast, ...toastStore];
  emitChange();
}

function removeToast(id: string) {
  toastStore = toastStore.filter((t) => t.id !== id);
  emitChange();
}

function clearAllToasts() {
  toastStore = [];
  emitChange();
}

// Internal hook for ToastContainer
function useToastStore() {
  const [toasts, setToasts] = useState<ToastData[]>(getSnapshot());

  useEffect(() => {
    return subscribe(() => {
      setToasts(getSnapshot());
    });
  }, []);

  return { toasts, dismiss: removeToast };
}

/* ----------------------------------------
   Toast Provider Component
   ---------------------------------------- */

let toastIdCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const generateId = useCallback(() => {
    return `toast-${++toastIdCounter}-${Date.now()}`;
  }, []);

  const toast = useCallback(
    (options: Omit<ToastData, 'id'>) => {
      const id = generateId();
      addToast({ ...options, id, timestamp: options.timestamp ?? new Date() });
      return id;
    },
    [generateId]
  );

  const success = useCallback(
    (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) => {
      return toast({ variant: 'success', message, ...options });
    },
    [toast]
  );

  const warning = useCallback(
    (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) => {
      return toast({ variant: 'warning', message, ...options });
    },
    [toast]
  );

  const error = useCallback(
    (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) => {
      return toast({ variant: 'error', message, ...options });
    },
    [toast]
  );

  const info = useCallback(
    (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) => {
      return toast({ variant: 'info', message, ...options });
    },
    [toast]
  );

  const dismiss = useCallback((id: string) => {
    removeToast(id);
  }, []);

  const dismissAll = useCallback(() => {
    clearAllToasts();
  }, []);

  const value: ToastContextValue = {
    toast,
    success,
    warning,
    error,
    info,
    dismiss,
    dismissAll,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
