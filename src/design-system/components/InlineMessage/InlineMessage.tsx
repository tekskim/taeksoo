import type { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import {
  IconCircleCheck,
  IconAlertTriangle,
  IconCircleX,
  IconInfoCircle,
} from '@tabler/icons-react';

/* ----------------------------------------
   InlineMessage Types
   ---------------------------------------- */

export type InlineMessageVariant = 'success' | 'warning' | 'error' | 'info';

export interface InlineMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** Message variant */
  variant?: InlineMessageVariant;
  /** Message content */
  children: ReactNode;
  /** Hide icon */
  hideIcon?: boolean;
  /** Custom icon */
  icon?: ReactNode;
}

/* ----------------------------------------
   Variant Styles
   ---------------------------------------- */

const variantStyles: Record<InlineMessageVariant, { bg: string; icon: ReactNode }> = {
  success: {
    bg: 'bg-[var(--inline-message-success-bg)]',
    icon: (
      <IconCircleCheck
        size={16}
        className="text-[var(--inline-message-success-icon)]"
        strokeWidth={1.5}
      />
    ),
  },
  warning: {
    bg: 'bg-[var(--inline-message-warning-bg)]',
    icon: (
      <IconAlertTriangle
        size={16}
        className="text-[var(--inline-message-warning-icon)]"
        strokeWidth={1.5}
      />
    ),
  },
  error: {
    bg: 'bg-[var(--inline-message-error-bg)]',
    icon: (
      <IconCircleX
        size={16}
        className="text-[var(--inline-message-error-icon)]"
        strokeWidth={1.5}
      />
    ),
  },
  info: {
    bg: 'bg-[var(--inline-message-info-bg)]',
    icon: (
      <IconInfoCircle
        size={16}
        className="text-[var(--inline-message-info-icon)]"
        strokeWidth={1.5}
      />
    ),
  },
};

/* ----------------------------------------
   InlineMessage Component
   ---------------------------------------- */

export function InlineMessage({
  variant = 'info',
  children,
  hideIcon = false,
  icon,
  className = '',
  ...props
}: InlineMessageProps) {
  const styles = variantStyles[variant];

  return (
    <div
      role="status"
      className={twMerge(
        'flex items-start gap-[var(--inline-message-gap)]',
        'p-[var(--inline-message-padding)]',
        'rounded-[var(--inline-message-radius)]',
        styles.bg,
        className
      )}
      {...props}
    >
      {/* Icon */}
      {!hideIcon && <span className="shrink-0 mt-px">{icon ?? styles.icon}</span>}

      {/* Message Content */}
      <p className="text-[length:var(--inline-message-font-size)] leading-[var(--inline-message-line-height)] text-[var(--inline-message-text)]">
        {children}
      </p>
    </div>
  );
}
