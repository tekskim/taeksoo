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
    <h1
      className={twMerge(
        'text-[16px] font-semibold leading-6',
        'text-[var(--color-text-default)]',
        'mb-3',
        className
      )}
      {...props}
    >
      {children}
    </h1>
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
    <div
      className={twMerge(
        'flex items-center gap-1',
        'mb-3',
        className
      )}
      {...props}
    >
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
    <div
      className={twMerge(
        'flex items-center gap-2',
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
   DetailHeader.InfoCard
   ---------------------------------------- */

export interface DetailHeaderInfoCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Label for the info card */
  label: string;
  /** Value to display */
  value: string;
  /** Show copy button for the value */
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

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      {/* Copy button positioned at top-right */}
      {copyable && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1 rounded hover:bg-[var(--color-surface-muted)] transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <IconCheck size={12} className="text-[var(--color-state-success)]" />
          ) : (
            <IconCopy size={12} className="text-[var(--color-text-default)]" />
          )}
        </button>
      )}
      
      {/* Status indicator positioned at top-right - large circular style */}
      {status && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <StatusIndicator status={status} layout="icon-only" size="lg" />
        </div>
      )}
      
      <div className="flex flex-col gap-1.5 min-w-0 pr-6">
        <span className="text-[11px] font-medium leading-4 text-[var(--color-text-subtle)]">
          {label}
        </span>
        <span className="text-[12px] leading-4 text-[var(--color-text-default)] font-normal truncate" title={value}>
          {value}
        </span>
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

export {
  DetailHeaderTitle,
  DetailHeaderActions,
  DetailHeaderInfoGrid,
  DetailHeaderInfoCard,
};

