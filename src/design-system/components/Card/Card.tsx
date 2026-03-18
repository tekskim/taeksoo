import { type ReactNode } from 'react';

/* ----------------------------------------
   Card Container
   ---------------------------------------- */

export interface CardProps {
  children: ReactNode;
  className?: string;
}

function CardRoot({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] flex flex-col gap-3 px-4 py-3 ${className}`}
    >
      {children}
    </div>
  );
}

/* ----------------------------------------
   Card.DetailsBox — gray container for detail items
   ---------------------------------------- */

export interface CardDetailsBoxProps {
  children: ReactNode;
  className?: string;
}

function DetailsBox({ children, className = '' }: CardDetailsBoxProps) {
  return (
    <div
      className={`bg-[var(--color-surface-muted)] border border-[var(--color-border-default)] rounded-[var(--radius-sm)] flex flex-col gap-5 p-2 ${className}`}
    >
      {children}
    </div>
  );
}

/* ----------------------------------------
   Card.DetailRow — row of key-value pairs
   ---------------------------------------- */

export interface CardDetailItem {
  label: string;
  value: ReactNode;
}

export interface CardDetailRowProps {
  items: CardDetailItem[];
  className?: string;
}

function DetailRow({ items, className = '' }: CardDetailRowProps) {
  return (
    <div className={`flex gap-4 items-center w-full ${className}`}>
      {items.map((item, idx) => (
        <div key={idx} className="flex-1 min-w-0 flex flex-col gap-1">
          <span className="text-label-sm text-[var(--color-text-muted)]">{item.label}</span>
          <span className="text-body-md text-[var(--color-text-default)] truncate">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------
   Card.ProgressBar — gauge / progress bar
   ---------------------------------------- */

export interface CardProgressBarProps {
  /** Progress label text */
  label: string;
  /** Progress value (0-100) */
  value: number;
  className?: string;
}

function ProgressBar({ label, value, className = '' }: CardProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={`flex flex-col gap-2.5 pt-0.5 pb-1 w-full ${className}`}>
      <div className="flex items-center justify-between w-full">
        <span className="text-body-sm text-[var(--color-text-subtle)]">{label}</span>
        <span className="text-body-md text-[var(--color-text-default)]">{clamped}%</span>
      </div>
      <div className="flex items-start h-1 w-full pr-1">
        <div
          className="bg-[var(--color-action-primary)] h-1 rounded-lg -mr-1 z-[2]"
          style={{ width: `${clamped}%` }}
        />
        <div className="bg-[var(--color-border-strong)] flex-1 min-w-0 h-1 rounded-lg -mr-1 z-[1]" />
      </div>
    </div>
  );
}

/* ----------------------------------------
   Card.MetadataItem — single metadata token
   ---------------------------------------- */

export interface CardMetadataItemProps {
  label: string;
  value: string | number;
}

/* ----------------------------------------
   Card.Footer — metadata row + action buttons
   ---------------------------------------- */

export interface CardFooterProps {
  /** Metadata items displayed as "label value | label value" */
  metadata?: CardMetadataItemProps[];
  /** Action buttons (right-aligned) */
  actions?: ReactNode;
  className?: string;
}

function Footer({ metadata, actions, className = '' }: CardFooterProps) {
  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
      {metadata && metadata.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {metadata.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {idx > 0 && (
                <div className="w-0 h-2.5 border-l border-[var(--color-border-default)]" />
              )}
              <div className="flex items-center gap-1 text-label-sm text-[var(--color-text-muted)]">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {actions && <div className="flex items-center gap-1 justify-end w-full">{actions}</div>}
    </div>
  );
}

/* ----------------------------------------
   Compound Export
   ---------------------------------------- */

export const ResourceCard = Object.assign(CardRoot, {
  DetailsBox,
  DetailRow,
  ProgressBar,
  Footer,
});
