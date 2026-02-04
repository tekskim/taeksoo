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
// thaki-ui compatibility: type alias
export type ThakiInlineMessageType = InlineMessageVariant;

export interface InlineMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** Message variant (also accepts thaki-ui 'type') */
  variant?: InlineMessageVariant;
  /** Message content */
  children?: ReactNode;
  /** Hide icon */
  hideIcon?: boolean;
  /** Custom icon */
  icon?: ReactNode;
  /** @deprecated thaki-ui compatibility - use variant instead */
  type?: ThakiInlineMessageType;
  /** @deprecated thaki-ui compatibility - use children instead */
  message?: ReactNode;
  /** @deprecated thaki-ui compatibility - close button (not implemented, handle in parent) */
  closable?: boolean;
  /** @deprecated thaki-ui compatibility - close callback */
  onClose?: () => void;
  /** @deprecated thaki-ui compatibility - expandable content (not implemented) */
  expandable?: boolean;
}

/* ----------------------------------------
   Variant Styles
   ---------------------------------------- */

const variantStyles: Record<InlineMessageVariant, { bg: string; icon: ReactNode }> = {
  success: {
    bg: 'bg-[var(--inline-message-success-bg)]',
    icon: (
      <IconCircleCheck
        size={12}
        className="text-[var(--inline-message-success-icon)]"
        strokeWidth={1.5}
      />
    ),
  },
  warning: {
    bg: 'bg-[var(--inline-message-warning-bg)]',
    icon: (
      <IconAlertTriangle
        size={12}
        className="text-[var(--inline-message-warning-icon)]"
        strokeWidth={1.5}
      />
    ),
  },
  error: {
    bg: 'bg-[var(--inline-message-error-bg)]',
    icon: (
      <IconCircleX
        size={12}
        className="text-[var(--inline-message-error-icon)]"
        strokeWidth={1.5}
      />
    ),
  },
  info: {
    bg: 'bg-[var(--inline-message-info-bg)]',
    icon: (
      <IconInfoCircle
        size={12}
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
  variant: rawVariant,
  children,
  hideIcon = false,
  icon,
  className = '',
  // thaki-ui compatibility props
  type,
  message,
  closable,
  onClose,
  expandable,
  ...props
}: InlineMessageProps) {
  // thaki-ui compatibility: type alias for variant
  const variant = rawVariant ?? type ?? 'info';

  // thaki-ui compatibility: message alias for children
  const content = children ?? message;

  // thaki-ui compatibility: warn about deprecated props
  if (process.env.NODE_ENV === 'development') {
    if (closable)
      console.warn(
        '[InlineMessage] closable prop is deprecated. Implement close button in parent component.'
      );
    if (expandable)
      console.warn(
        '[InlineMessage] expandable prop is deprecated. Implement expandable content in parent component.'
      );
  }

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
        {content}
      </p>
    </div>
  );
}
