import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { twMerge } from '../../utils/cn';
import { IconX, IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { Badge } from '../Badge';
import type { BadgeTheme } from '../Badge/Badge';

/* ----------------------------------------
   Types
   ---------------------------------------- */

/** Alert App: critical | warning, Other App: success | failed */
export type SnackbarType = 'critical' | 'warning' | 'success' | 'failed';

export type SnackbarPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface SnackbarDetail {
  code?: string | number;
  message?: string;
}

export interface SnackbarData {
  id: string;
  type: SnackbarType;
  message: string;
  /** App icon URL (displayed in desktop scope) */
  appIcon?: string;
  /** Partition / tenant / namespace info */
  partition?: string;
  /** Timestamp string (e.g. "10:33") */
  time?: string;
  /** Expandable detail (error type only) */
  detail?: SnackbarDetail;
  /** If true, snackbar won't auto-dismiss */
  persistent?: boolean;
  /** Navigation href on body click */
  href?: string;
  /** Auto-dismiss duration in ms (default 2000, ignored when persistent) */
  duration?: number;
  /** Called when body is clicked */
  onClick?: () => void;
  /** Called when snackbar is dismissed */
  onDismiss?: () => void;
  /** @internal Set by store to trigger animated dismiss on FIFO overflow */
  _dismissing?: boolean;
}

export interface SnackbarProps {
  snackbar: SnackbarData;
  onDismiss: (id: string) => void;
  className?: string;
}

export interface SnackbarContainerProps {
  position?: SnackbarPosition;
  /** 'global' = fixed, 'app' = absolute (relative to parent) */
  scope?: 'global' | 'app';
  /** Max auto-dismiss snackbars visible at once */
  maxAuto?: number;
  /** Max persistent snackbars visible at once */
  maxPersistent?: number;
  className?: string;
}

export interface SnackbarContextValue {
  show: (options: Omit<SnackbarData, 'id'>) => string;
  success: (
    message: string,
    options?: Partial<Omit<SnackbarData, 'id' | 'type' | 'message'>>
  ) => string;
  failed: (
    message: string,
    options?: Partial<Omit<SnackbarData, 'id' | 'type' | 'message'>>
  ) => string;
  critical: (
    message: string,
    options?: Partial<Omit<SnackbarData, 'id' | 'type' | 'message'>>
  ) => string;
  warning: (
    message: string,
    options?: Partial<Omit<SnackbarData, 'id' | 'type' | 'message'>>
  ) => string;
  /** @deprecated Use `failed()` instead */
  error: (
    message: string,
    options?: Partial<Omit<SnackbarData, 'id' | 'type' | 'message'>>
  ) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

/* ----------------------------------------
   Status Badge Map
   ---------------------------------------- */

const snackbarTypeBadgeMap: Record<SnackbarType, { label: string; theme: BadgeTheme }> = {
  critical: { label: 'Critical', theme: 'red' },
  warning: { label: 'Warning', theme: 'yellow' },
  success: { label: 'Success', theme: 'green' },
  failed: { label: 'Failed', theme: 'red' },
};

/* ----------------------------------------
   Position Styles
   ---------------------------------------- */

const positionStyles: Record<SnackbarPosition, string> = {
  'top-right': 'top-[var(--primitive-spacing-4)] right-[var(--primitive-spacing-4)]',
  'top-left': 'top-[var(--primitive-spacing-4)] left-[var(--primitive-spacing-4)]',
  'bottom-right': 'bottom-[var(--primitive-spacing-4)] right-[var(--primitive-spacing-4)]',
  'bottom-left': 'bottom-[var(--primitive-spacing-4)] left-[var(--primitive-spacing-4)]',
};

/* ----------------------------------------
   Time Helpers
   ---------------------------------------- */

function formatTime(date: Date): string {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

/* ----------------------------------------
   Snackbar Context
   ---------------------------------------- */

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function useSnackbar(): SnackbarContextValue {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}

/* ----------------------------------------
   Snackbar Card Component
   ---------------------------------------- */

export function Snackbar({ snackbar, onDismiss, className = '' }: SnackbarProps) {
  const [isEntered, setIsEntered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const timerRef = useRef<number | null>(null);
  const remainingRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isPersistent = snackbar.persistent ?? false;
  const duration = isPersistent ? 0 : (snackbar.duration ?? 3000);
  const hasDetail = snackbar.detail && (snackbar.detail.code || snackbar.detail.message);
  const showDetail = hasDetail && (snackbar.type === 'failed' || snackbar.type === 'critical');

  useEffect(() => {
    requestAnimationFrame(() => setIsEntered(true));
  }, []);

  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const onDismissCallbackRef = useRef(snackbar.onDismiss);
  onDismissCallbackRef.current = snackbar.onDismiss;
  const snackbarIdRef = useRef(snackbar.id);
  snackbarIdRef.current = snackbar.id;

  const collapseAndRemove = useCallback(() => {
    const el = wrapperRef.current;
    if (el) {
      el.style.maxHeight = `${el.offsetHeight}px`;
      el.style.overflow = 'hidden';
      void el.offsetHeight;
      el.style.transition = 'max-height 200ms ease-out';
      el.style.maxHeight = '0px';
      setTimeout(() => {
        onDismissRef.current(snackbarIdRef.current);
      }, 200);
    } else {
      onDismissRef.current(snackbarIdRef.current);
    }
  }, []);

  const dismissingRef = useRef(false);

  const handleDismiss = useCallback(() => {
    if (dismissingRef.current) return;
    dismissingRef.current = true;
    setIsExiting(true);
    onDismissCallbackRef.current?.();
    setTimeout(collapseAndRemove, 300);
  }, [collapseAndRemove]);

  useEffect(() => {
    if (snackbar._dismissing) {
      handleDismiss();
    }
  }, [snackbar._dismissing, handleDismiss]);

  useEffect(() => {
    if (duration > 0 && !isDetailExpanded) {
      remainingRef.current = duration;
      startTimeRef.current = Date.now();
      timerRef.current = window.setTimeout(handleDismiss, duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [duration, handleDismiss, isDetailExpanded]);

  const handleMouseEnter = () => {
    if (timerRef.current && duration > 0) {
      clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    }
  };

  const handleMouseLeave = () => {
    if (duration > 0 && remainingRef.current > 0 && !isDetailExpanded) {
      startTimeRef.current = Date.now();
      timerRef.current = window.setTimeout(handleDismiss, remainingRef.current);
    }
  };

  const handleBodyClick = () => {
    snackbar.onClick?.();
    handleDismiss();
  };

  const toggleDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDetailExpanded((prev) => {
      const next = !prev;
      if (next && timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return next;
    });
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDismiss();
  };

  const isAlert = snackbar.type === 'critical' || snackbar.type === 'warning';
  const badgeInfo = snackbarTypeBadgeMap[snackbar.type];

  const cardBg = isAlert
    ? snackbar.type === 'critical'
      ? 'rounded-[var(--radius-lg)] bg-[var(--inline-message-error-bg)] flex flex-col py-3 w-[320px] shadow-lg'
      : 'rounded-[var(--radius-lg)] bg-[var(--color-state-warning-bg)] flex flex-col py-3 w-[320px] shadow-lg'
    : 'rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] flex flex-col py-3 w-[320px] shadow-lg';

  return (
    <div ref={wrapperRef}>
      <div
        data-figma-name="[TDS] Snackbar"
        role="alert"
        className={twMerge(
          cardBg,
          'transition-all duration-300 ease-out',
          isExiting
            ? 'opacity-0 translate-x-full'
            : isEntered
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-full',
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Body */}
        <div
          className={twMerge(
            'flex items-start justify-between px-3',
            (snackbar.onClick || snackbar.href) && 'cursor-pointer'
          )}
          onClick={handleBodyClick}
        >
          <div className="flex gap-2 items-start flex-1 min-w-0 pr-4">
            {snackbar.appIcon && (
              <img src={snackbar.appIcon} alt="" className="size-5 shrink-0 object-contain" />
            )}
            <div className="flex flex-col gap-1.5 flex-1 min-w-[1px]">
              <span className="text-label-md text-[var(--color-text-default)]">
                {snackbar.message}
              </span>

              <div className="flex items-center gap-1.5 min-w-0">
                <Badge theme={badgeInfo.theme} size="sm" className="shrink-0">
                  {badgeInfo.label}
                </Badge>
                {snackbar.partition && (
                  <Badge
                    theme="white"
                    size="sm"
                    className="overflow-hidden min-w-0"
                    title={snackbar.partition}
                  >
                    <span className="block truncate">{snackbar.partition}</span>
                  </Badge>
                )}
              </div>

              {/* View detail toggle (failed/critical type only) */}
              {showDetail && (
                <div
                  className="flex flex-col gap-2 rounded-[var(--radius-sm)] mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={toggleDetail}
                    className="group flex items-center gap-1"
                  >
                    <span className="text-body-sm text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-muted)] whitespace-nowrap">
                      View detail
                    </span>
                    {isDetailExpanded ? (
                      <IconChevronUp
                        size={12}
                        stroke={1.5}
                        className="text-[var(--color-text-subtle)]"
                      />
                    ) : (
                      <IconChevronDown
                        size={12}
                        stroke={1.5}
                        className="text-[var(--color-text-subtle)]"
                      />
                    )}
                  </button>

                  {isDetailExpanded && (
                    <>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                      <div className="flex flex-col gap-1 text-body-sm text-[var(--color-text-muted)]">
                        {snackbar.detail!.code !== undefined && (
                          <p>code: {snackbar.detail!.code}</p>
                        )}
                        {snackbar.detail!.message && <p>{snackbar.detail!.message}</p>}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex flex-col items-end justify-end self-stretch shrink-0">
            <span className="text-body-sm text-[var(--color-text-subtle)] whitespace-nowrap">
              {snackbar.time}
            </span>
          </div>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={handleCloseClick}
          className="absolute top-[7px] right-[7px] size-4 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)] transition-colors"
          aria-label="Close"
        >
          <IconX size={12} stroke={1.5} />
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Snackbar Container
   ---------------------------------------- */

export function SnackbarContainer({
  position = 'top-right',
  scope = 'global',
  maxAuto = 3,
  maxPersistent = 3,
  className = '',
}: SnackbarContainerProps) {
  const { snackbars, dismiss } = useSnackbarStore();

  const allAuto = snackbars.filter((s) => !s.persistent);
  const dismissingAuto = allAuto.filter((s) => s._dismissing);
  const activeAuto = allAuto.filter((s) => !s._dismissing).slice(0, maxAuto);
  const autoSnackbars = [...dismissingAuto, ...activeAuto];
  const persistentSnackbars = snackbars.filter((s) => s.persistent).slice(0, maxPersistent);
  const visibleSnackbars = [...persistentSnackbars, ...autoSnackbars];

  const isBottom = position.includes('bottom');
  const positionType = scope === 'app' ? 'absolute' : 'fixed';

  if (visibleSnackbars.length === 0) return null;

  return (
    <div
      className={twMerge(
        `${positionType} z-[var(--z-toast)]`,
        'flex flex-col gap-[var(--primitive-spacing-2)]',
        positionStyles[position],
        isBottom && 'flex-col-reverse',
        className
      )}
      role="region"
      aria-live="polite"
      aria-label="Snackbar notifications"
    >
      {visibleSnackbars.map((s) => (
        <Snackbar key={s.id} snackbar={s} onDismiss={dismiss} />
      ))}
    </div>
  );
}

/* ----------------------------------------
   Snackbar Store (internal)
   ---------------------------------------- */

let snackbarStore: SnackbarData[] = [];
const listeners: Set<() => void> = new Set();

function emitChange() {
  listeners.forEach((fn) => fn());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snackbarStore;
}

const MAX_AUTO = 3;

const DISMISS_STAGGER = 400;

function addSnackbar(snackbar: SnackbarData) {
  if (!snackbar.persistent) {
    const existingAutoCount = snackbarStore.filter((s) => !s.persistent && !s._dismissing).length;
    const baseDuration = snackbar.duration ?? 3000;
    snackbar = { ...snackbar, duration: baseDuration + existingAutoCount * DISMISS_STAGGER };
  }

  snackbarStore = [...snackbarStore, snackbar];

  if (!snackbar.persistent) {
    const activeAuto = snackbarStore.filter((s) => !s.persistent && !s._dismissing);
    if (activeAuto.length > MAX_AUTO) {
      const dismissCount = activeAuto.length - MAX_AUTO;
      const idsToDismiss = new Set(activeAuto.slice(0, dismissCount).map((s) => s.id));
      snackbarStore = snackbarStore.map((s) =>
        idsToDismiss.has(s.id) ? { ...s, _dismissing: true } : s
      );
    }
  }

  emitChange();
}

function removeSnackbar(id: string) {
  snackbarStore = snackbarStore.filter((s) => s.id !== id);
  emitChange();
}

function clearAllSnackbars() {
  snackbarStore = [];
  emitChange();
}

function useSnackbarStore() {
  const snackbars = useSyncExternalStore(subscribe, getSnapshot);
  return { snackbars, dismiss: removeSnackbar };
}

/* ----------------------------------------
   Snackbar Provider
   ---------------------------------------- */

let snackbarIdCounter = 0;

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const generateId = useCallback(() => {
    return `snackbar-${++snackbarIdCounter}-${Date.now()}`;
  }, []);

  const show = useCallback(
    (options: Omit<SnackbarData, 'id'>) => {
      const id = generateId();
      const time = options.time ?? formatTime(new Date());
      addSnackbar({ ...options, id, time });
      return id;
    },
    [generateId]
  );

  const success = useCallback(
    (message: string, options?: Partial<Omit<SnackbarData, 'id' | 'type' | 'message'>>) => {
      return show({ type: 'success', message, ...options });
    },
    [show]
  );

  const failed = useCallback(
    (message: string, options?: Partial<Omit<SnackbarData, 'id' | 'type' | 'message'>>) => {
      return show({ type: 'failed', message, persistent: true, ...options });
    },
    [show]
  );

  const critical = useCallback(
    (message: string, options?: Partial<Omit<SnackbarData, 'id' | 'type' | 'message'>>) => {
      return show({ type: 'critical', message, persistent: true, ...options });
    },
    [show]
  );

  const warning = useCallback(
    (message: string, options?: Partial<Omit<SnackbarData, 'id' | 'type' | 'message'>>) => {
      return show({ type: 'warning', message, ...options });
    },
    [show]
  );

  const error = useCallback(
    (message: string, options?: Partial<Omit<SnackbarData, 'id' | 'type' | 'message'>>) => {
      return show({ type: 'failed', message, persistent: true, ...options });
    },
    [show]
  );

  const dismiss = useCallback((id: string) => {
    removeSnackbar(id);
  }, []);

  const dismissAll = useCallback(() => {
    clearAllSnackbars();
  }, []);

  const value: SnackbarContextValue = {
    show,
    success,
    failed,
    critical,
    warning,
    error,
    dismiss,
    dismissAll,
  };

  return <SnackbarContext.Provider value={value}>{children}</SnackbarContext.Provider>;
}
