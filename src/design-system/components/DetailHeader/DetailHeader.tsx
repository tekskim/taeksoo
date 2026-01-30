import { useState, type ReactNode, type HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { StatusIndicator, type StatusType } from '../StatusIndicator';

/* ----------------------------------------
   DetailHeader - Main Container
   ---------------------------------------- */

export interface DetailHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Child components */
  children: ReactNode;
}

export function DetailHeader({ children, className, ...props }: DetailHeaderProps) {
  return (
    <div
      className={twMerge(
        'bg-[var(--color-surface-default)]',
        'border border-[var(--color-border-default)]',
        'rounded-lg',
        'px-4 pt-3 pb-4',
        'w-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ----------------------------------------
   DetailHeader.Title
   ---------------------------------------- */

export interface DetailHeaderTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Title text or children */
  children: ReactNode;
}

function DetailHeaderTitle({ children, className, ...props }: DetailHeaderTitleProps) {
  return (
    <h5
      className={twMerge(
        'text-heading-h5',
        'text-[var(--color-text-default)]',
        'mb-3',
        className
      )}
      {...props}
    >
      {children}
    </h5>
  );
}

/* ----------------------------------------
   DetailHeader.Actions
   ---------------------------------------- */

export interface DetailHeaderActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Action buttons */
  children: ReactNode;
}

function DetailHeaderActions({ children, className, ...props }: DetailHeaderActionsProps) {
  return (
    <div className={twMerge('flex items-center gap-1', 'mb-3', className)} {...props}>
      {children}
    </div>
  );
}

/* ----------------------------------------
   DetailHeader.InfoGrid
   ---------------------------------------- */

export interface DetailHeaderInfoGridProps extends HTMLAttributes<HTMLDivElement> {
  /** InfoCard components */
  children: ReactNode;
}

function DetailHeaderInfoGrid({ children, className, ...props }: DetailHeaderInfoGridProps) {
  return (
    <div className={twMerge('flex items-center gap-3', 'w-full', className)} {...props}>
      {children}
    </div>
  );
}

/* ----------------------------------------
   DetailHeader.InfoCard
   ---------------------------------------- */

export interface DetailHeaderInfoCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** Label for the info card */
  label: string;
  /** Value to display - can be string or ReactNode */
  value: ReactNode;
  /** Show copy button for the value (only works with string values) */
  copyable?: boolean;
  /** Show status indicator instead of value */
  status?: StatusType;
}

function DetailHeaderInfoCard({
  label,
  value,
  copyable = false,
  status,
  className,
  ...props
}: DetailHeaderInfoCardProps) {
  const [copied, setCopied] = useState(false);
  const isStringValue = typeof value === 'string';

  const handleCopy = () => {
    if (isStringValue) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={twMerge(
        'flex-1',
        'bg-[var(--color-surface-subtle)]',
        'rounded-lg',
        'px-4 py-3',
        'relative',
        'min-w-0',
        className
      )}
      {...props}
    >
      {/* Status indicator positioned at top-right - large circular style */}
      {status && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <StatusIndicator status={status} layout="icon-only" size="lg" />
        </div>
      )}

      <div className={twMerge('flex flex-col gap-1.5 min-w-0', status && 'pr-6')}>
        <span className="text-label-sm leading-4 text-[var(--color-text-subtle)] whitespace-nowrap">
          {label}
        </span>
        <div className="flex items-center gap-1 min-w-0 min-h-[26px]">
          {isStringValue ? (
            <span
              className="text-body-md leading-4 font-normal truncate text-[var(--color-text-default)]"
              title={value}
            >
              {value}
            </span>
          ) : (
            value
          )}
          {/* Copy button inline next to value (only for string values) */}
          {copyable && isStringValue && (
            <button
              onClick={handleCopy}
              className="shrink-0 p-0.5 rounded hover:bg-[var(--color-surface-default)] transition-colors"
              aria-label="Copy to clipboard"
            >
              {copied ? (
                <IconCheck size={12} className="text-[var(--color-state-success)]" />
              ) : (
                <IconCopy size={12} className="text-[var(--color-action-primary)]" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Compound Component Assembly
   ---------------------------------------- */

DetailHeader.Title = DetailHeaderTitle;
DetailHeader.Actions = DetailHeaderActions;
DetailHeader.InfoGrid = DetailHeaderInfoGrid;
DetailHeader.InfoCard = DetailHeaderInfoCard;

export { DetailHeaderTitle, DetailHeaderActions, DetailHeaderInfoGrid, DetailHeaderInfoCard };
