import { type ReactNode, type HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router-dom';
import { VStack } from '../../layouts';

/* ----------------------------------------
   SectionCard - Main Container
   ---------------------------------------- */

export interface SectionCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Child components */
  children: ReactNode;
}

export function SectionCard({ children, className, ...props }: SectionCardProps) {
  return (
    <div
      className={twMerge(
        'flex flex-col items-start',
        'bg-[var(--color-surface-default)]',
        'border border-[var(--color-border-default)]',
        'rounded-lg',
        'px-4 py-3',
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
   SectionCard.Header
   ---------------------------------------- */

export interface SectionCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Section title */
  title: string;
  /** Optional action buttons (e.g., Edit button) */
  actions?: ReactNode;
}

function SectionCardHeader({ title, actions, className, ...props }: SectionCardHeaderProps) {
  return (
    <div
      className={twMerge(
        'flex items-center justify-between',
        'w-full h-8 mb-2',
        className
      )}
      {...props}
    >
      <h5 className="text-[length:var(--font-size-14)] font-semibold leading-[var(--line-height-20)] text-[var(--color-text-default)]">
        {title}
      </h5>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   SectionCard.Content
   ---------------------------------------- */

export interface SectionCardContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Content children */
  children: ReactNode;
  /** Gap between items (default: 3) */
  gap?: 1 | 2 | 3 | 4 | 5 | 6;
}

function SectionCardContent({ children, gap = 0, className, ...props }: SectionCardContentProps) {
  return (
    <VStack gap={gap} className={twMerge('w-full', className)} {...props}>
      {children}
    </VStack>
  );
}

/* ----------------------------------------
   SectionCard.DataRow
   ---------------------------------------- */

export interface SectionCardDataRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Label for the data row */
  label: ReactNode;
  /** Value to display (string) - use this or children */
  value?: string;
  /** Custom content - use this for complex values like chips */
  children?: ReactNode;
  /** Render as a link */
  isLink?: boolean;
  /** Link destination (required if isLink is true) */
  linkHref?: string;
  /** Show divider above (default: true) */
  showDivider?: boolean;
}

function SectionCardDataRow({
  label,
  value,
  children,
  isLink = false,
  linkHref,
  showDivider = true,
  className,
  ...props
}: SectionCardDataRowProps) {
  // Determine what to render: children take precedence over value
  const renderValue = () => {
    if (children) {
      return <div className="text-[12px] leading-4 text-[var(--color-text-default)]">{children}</div>;
    }
    
    if (isLink) {
      return (
        <Link
          to={linkHref || '#'}
          className="text-[12px] font-medium leading-4 text-[var(--color-action-primary)] hover:underline"
        >
          {value}
        </Link>
      );
    }
    
    return (
      <span className="text-[12px] leading-4 text-[var(--color-text-default)]">
        {value}
      </span>
    );
  };

  return (
    <div className={twMerge('flex flex-col w-full', className)} {...props}>
      {showDivider && (
        <div className="h-px w-full bg-[var(--color-border-subtle)]" />
      )}
      <div className="flex flex-col gap-1.5 pt-3 pb-3">
        <span className="text-[11px] font-medium leading-4 text-[var(--color-text-subtle)]">
          {label}
        </span>
        {renderValue()}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Compound Component Assembly
   ---------------------------------------- */

SectionCard.Header = SectionCardHeader;
SectionCard.Content = SectionCardContent;
SectionCard.DataRow = SectionCardDataRow;

export {
  SectionCardHeader,
  SectionCardContent,
  SectionCardDataRow,
};










