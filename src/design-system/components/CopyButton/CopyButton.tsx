import {
  forwardRef,
  useState,
  useCallback,
  type ButtonHTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from 'react';
import { twMerge } from '../../utils/cn';
import { IconCopy, IconCheck } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type CopyButtonVariant = 'default' | 'ghost' | 'outline';
export type CopyButtonSize = 'sm' | 'md' | 'lg';

export interface CopyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Text to copy to clipboard */
  value: string;
  /** Button variant */
  variant?: CopyButtonVariant;
  /** Button size */
  size?: CopyButtonSize;
  /** Custom copy icon */
  copyIcon?: ReactNode;
  /** Custom success icon */
  successIcon?: ReactNode;
  /** Label text (optional, shows text next to icon) */
  label?: string;
  /** Success label (shown after copy) */
  successLabel?: string;
  /** Time to show success state (ms) */
  successDuration?: number;
  /** Callback on successful copy */
  onCopy?: (value: string) => void;
  /** Callback on copy error */
  onError?: (error: Error) => void;
  /** Show only icon (no label) */
  iconOnly?: boolean;
  /** Tooltip text */
  tooltip?: string;
  /** Additional CSS classes */
  className?: string;
}

/* ----------------------------------------
   Styles
   ---------------------------------------- */

const variantStyles: Record<CopyButtonVariant, string> = {
  default:
    'bg-[var(--color-surface-muted)] text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] border-transparent',
  ghost:
    'bg-transparent text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] border-transparent',
  outline:
    'bg-transparent text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] border-[var(--color-border-default)]',
};

const sizeStyles: Record<CopyButtonSize, { button: string; icon: number }> = {
  sm: {
    button: 'h-6 px-1.5 text-body-sm gap-1',
    icon: 12,
  },
  md: {
    button: 'h-8 px-2 text-body-md gap-1.5',
    icon: 14,
  },
  lg: {
    button: 'h-9 px-2.5 text-body-md gap-2',
    icon: 16,
  },
};

const successStyles = 'text-[var(--color-state-success)]';

/* ----------------------------------------
   CopyButton Component
   ---------------------------------------- */

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      variant = 'ghost',
      size = 'sm',
      copyIcon,
      successIcon,
      label = 'Copy',
      successLabel = 'Copied!',
      successDuration = 2000,
      onCopy,
      onError,
      iconOnly = false,
      tooltip,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false);

    const sizeConfig = sizeStyles[size];

    const handleCopy = useCallback(
      async (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (disabled) return;

        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          onCopy?.(value);

          setTimeout(() => {
            setCopied(false);
          }, successDuration);
        } catch (error) {
          const copyError = error instanceof Error ? error : new Error('Failed to copy');
          onError?.(copyError);
          console.error('Failed to copy:', copyError);
        }
      },
      [value, disabled, onCopy, onError, successDuration]
    );

    const defaultCopyIcon = <IconCopy size={sizeConfig.icon} stroke={1.5} />;
    const defaultSuccessIcon = <IconCheck size={sizeConfig.icon} stroke={2} />;

    const currentIcon = copied
      ? (successIcon ?? defaultSuccessIcon)
      : (copyIcon ?? defaultCopyIcon);

    const currentLabel = copied ? successLabel : label;

    return (
      <button
        ref={ref}
        data-figma-name="[TDS] CopyButton"
        type="button"
        onClick={handleCopy}
        disabled={disabled}
        title={tooltip}
        aria-label={iconOnly ? currentLabel : undefined}
        className={twMerge(
          'inline-flex items-center justify-center',
          'border rounded-[var(--radius-sm)]',
          'font-medium',
          'transition-colors duration-[var(--duration-fast)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary)]',
          sizeConfig.button,
          variantStyles[variant],
          disabled && 'opacity-50 cursor-not-allowed',
          iconOnly && 'px-1.5',
          className,
          copied && successStyles
        )}
        {...props}
      >
        <span className="shrink-0 flex items-center">{currentIcon}</span>
        {!iconOnly && <span>{currentLabel}</span>}
      </button>
    );
  }
);

CopyButton.displayName = 'CopyButton';

/* ----------------------------------------
   Copyable Component (value with copy button)
   ---------------------------------------- */

export interface CopyableProps {
  /** Value to display and copy */
  value: string;
  /** Truncate the displayed value */
  truncate?: boolean;
  /** Max width for truncation */
  maxWidth?: string | number;
  /** Size of the copy button */
  size?: CopyButtonSize;
  /** Additional CSS classes for the container */
  className?: string;
  /** Callback on successful copy */
  onCopy?: (value: string) => void;
}

export const Copyable = forwardRef<HTMLDivElement, CopyableProps>(
  ({ value, truncate = false, maxWidth, size = 'sm', className = '', onCopy }, ref) => {
    return (
      <div
        ref={ref}
        data-figma-name="[TDS] Copyable"
        className={twMerge(
          'inline-flex items-center gap-1.5',
          'px-2 py-1',
          'bg-[var(--color-surface-subtle)]',
          'rounded-[var(--radius-sm)]',
          'text-body-md text-[var(--color-text-default)]',
          className
        )}
        style={maxWidth ? { maxWidth } : undefined}
      >
        <span
          className={twMerge('flex-1', truncate && 'truncate')}
          title={truncate ? value : undefined}
        >
          {value}
        </span>
        <CopyButton value={value} size={size} iconOnly onCopy={onCopy} />
      </div>
    );
  }
);

Copyable.displayName = 'Copyable';

export default CopyButton;
