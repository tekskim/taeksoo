import { type ReactNode, type HTMLAttributes, Children, isValidElement, Fragment } from 'react';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   SectionCard - Main Container
   ---------------------------------------- */

export interface SectionCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Child components */
  children: ReactNode;
  /** Active state - shows blue border */
  isActive?: boolean;
}

export function SectionCard({ children, isActive = false, className, ...props }: SectionCardProps) {
  return (
    <div
      className={twMerge(
        'flex flex-col items-start',
        'gap-3',
        'bg-[var(--color-surface-default)]',
        'rounded-[var(--radius-md)]',
        isActive
          ? 'border-2 border-[var(--color-action-primary)] pt-[11px] pb-[11px] px-[15px]'
          : 'border border-[var(--color-border-default)] pt-[12px] pb-[12px] px-[16px]',
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
  /** Show divider below header (default: true) */
  showDivider?: boolean;
  /** Optional status icon (e.g., for Wizard sections) */
  statusIcon?: ReactNode;
  /** Optional description text below title, above divider */
  description?: string;
}

function SectionCardHeader({
  title,
  actions,
  showDivider = true,
  statusIcon,
  description,
  className,
  ...props
}: SectionCardHeaderProps) {
  return (
    <div className="flex flex-col w-full gap-3">
      <div
        className={twMerge('flex items-center justify-between w-full h-[28px]', className)}
        {...props}
      >
        <div className="flex items-center gap-2">
          {statusIcon}
          <h5 className="text-heading-h5 text-[var(--color-text-default)] h-7">{title}</h5>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {description && (
        <span className="text-body-sm text-[var(--color-text-subtle)]">{description}</span>
      )}
      {showDivider && <div className="h-px w-full bg-[var(--color-border-subtle)]" />}
    </div>
  );
}

/* ----------------------------------------
   SectionCard.Content
   ---------------------------------------- */

export interface SectionCardContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Content children */
  children: ReactNode;
}

// Divider component for between DataRows
function DataRowDivider() {
  return <div className="h-px w-full bg-[var(--color-border-subtle)]" />;
}

function SectionCardContent({ children, className, ...props }: SectionCardContentProps) {
  // Convert children to array and filter valid elements
  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <div className={twMerge('flex flex-col w-full gap-3', className)} {...props}>
      {childArray.map((child, index) => (
        <Fragment key={index}>
          {index > 0 && <DataRowDivider />}
          {child}
        </Fragment>
      ))}
    </div>
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
  /** @deprecated - no longer used, dividers are managed by Content */
  showDivider?: boolean;
}

function SectionCardDataRow({
  label,
  value,
  children,
  isLink = false,
  linkHref,
  className,
  ...props
}: SectionCardDataRowProps) {
  // Determine what to render: children take precedence over value
  const renderValue = () => {
    if (children) {
      return <div className="text-body-md text-[var(--color-text-default)]">{children}</div>;
    }

    if (isLink) {
      return (
        <Link
          to={linkHref || '#'}
          className="text-label-md text-[var(--color-action-primary)] hover:underline"
        >
          {value}
        </Link>
      );
    }

    return <span className="text-body-md text-[var(--color-text-default)]">{value}</span>;
  };

  return (
    <div className={twMerge('flex flex-col gap-1.5 w-full', className)} {...props}>
      <span className="text-label-sm text-[var(--color-text-subtle)]">{label}</span>
      {renderValue()}
    </div>
  );
}

/* ----------------------------------------
   Compound Component Assembly
   ---------------------------------------- */

SectionCard.Header = SectionCardHeader;
SectionCard.Content = SectionCardContent;
SectionCard.DataRow = SectionCardDataRow;

export { SectionCardHeader, SectionCardContent, SectionCardDataRow };
