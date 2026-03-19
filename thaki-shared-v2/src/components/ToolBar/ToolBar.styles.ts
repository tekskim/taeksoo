import { cva } from 'class-variance-authority';

/**
 * ToolBar container styles
 *
 * Figma design tokens:
 * - bg: var(--color-surface) = #ffffff
 * - border-bottom: 1px solid var(--color-border-default) = #e2e8f0
 * - padding-x: var(--semantic/spacing/component/sm) = 12px
 * - padding-y: var(--semantic/spacing/component/xxs) = 4px
 */
export const toolBarStyles = cva(
  [
    'flex items-center justify-between',
    'bg-surface',
    'border-b border-border',
    'px-3',
    'h-9',
    'flex-shrink-0',
  ],
  {
    variants: {
      /** 전체 너비 여부 */
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      fullWidth: true,
    },
  }
);

/**
 * Left section (navigation + breadcrumb)
 *
 * Figma design tokens:
 * - gap: var(--semantic/spacing/component/xs) = 8px
 */
export const toolBarLeftStyles = 'flex items-center gap-2';

/**
 * Right section (action buttons)
 *
 * Figma design tokens:
 * - gap: var(--semantic/spacing/component/xs) = 8px
 */
export const toolBarRightStyles = 'flex items-center gap-2';

/**
 * Sidebar toggle button styles
 *
 * Figma design tokens:
 * - bg: var(--color-base-white) = #ffffff
 * - border: 1px solid var(--color-border-strong) = #cbd5e1
 * - padding: 4px
 * - border-radius: 6px
 */
export const sidebarToggleStyles = cva(
  [
    'inline-flex items-center justify-center',
    'p-1',
    'rounded-base6',
    'bg-surface',
    'border border-solid border-border',
    'cursor-pointer',
    'text-text-muted',
    'transition-colors duration-150',
    'hover:bg-surface-hover hover:text-text',
    'focus:outline-none focus-visible:ring-1 focus-visible:ring-focus',
  ],
  {
    variants: {
      size: {
        sm: 'size-6', // 24px
        md: 'size-7', // 28px
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
);

/**
 * Action button styles (notification, etc.)
 *
 * Figma design tokens:
 * - bg: var(--color-base-white) = #ffffff
 * - padding: var(--space-1) = 4px
 * - border-radius: var(--radius-base-6) = 6px
 * - gap: 8px
 */
export const actionButtonStyles = cva(
  [
    'inline-flex items-center justify-center',
    'gap-2',
    'p-1',
    'rounded-base6',
    'bg-surface',
    'border-none',
    'cursor-pointer',
    'transition-colors duration-150',
    'hover:bg-surface-hover active:bg-surface-tertiary',
    'focus:outline-none focus-visible:ring-1 focus-visible:ring-focus',
  ],
  {
    variants: {
      /** 알림 표시 여부 (빨간 배지) */
      hasNotification: {
        true: 'relative',
        false: '',
      },
      size: {
        sm: 'size-6', // 24px
        md: 'size-7', // 28px
      },
    },
    defaultVariants: {
      hasNotification: false,
      size: 'sm',
    },
  }
);

/**
 * Notification badge styles (빨간 배지)
 *
 * 읽지 않은 알림이 있을 때 표시
 */
export const notificationBadgeStyles = [
  'absolute top-0 right-0',
  'size-2',
  'bg-error',
  'rounded-full',
  'pointer-events-none',
].join(' ');
