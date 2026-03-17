import React, { ReactNode } from 'react';

/* ----------------------------------------
   Badge Type for CardTitle
   ---------------------------------------- */
export interface CardTitleBadge {
  label: string;
  variant?: 'default' | 'success' | 'info' | 'warning' | 'muted';
  icon?: ReactNode;
}

/* ----------------------------------------
   CardTitle Props
   ---------------------------------------- */
export interface CardTitleProps {
  /** Main title text */
  title: string;
  /** Optional description text */
  description?: string;
  /** Show status indicator (colored dot) */
  showStatus?: boolean;
  /** Status indicator color */
  statusColor?: 'success' | 'warning' | 'error' | 'info' | 'muted';
  /** Badges to display */
  badges?: CardTitleBadge[];
  /** Side content type */
  side?: 'none' | 'gauge' | 'icon';
  /** Gauge value (for side="gauge") */
  gaugeValue?: string;
  /** Gauge label (for side="gauge") */
  gaugeLabel?: string;
  /** Icon element (for side="icon") */
  sideIcon?: ReactNode;
  /** Additional class name */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

/* ----------------------------------------
   Status Indicator Sub-component
   ---------------------------------------- */
interface StatusDotProps {
  color?: 'success' | 'warning' | 'error' | 'info' | 'muted';
}

function StatusDot({ color = 'success' }: StatusDotProps) {
  const colorClasses = {
    success: 'bg-[var(--color-state-success)]',
    warning: 'bg-[var(--color-state-warning)]',
    error: 'bg-[var(--color-state-danger)]',
    info: 'bg-[var(--color-action-primary)]',
    muted: 'bg-[var(--color-text-muted)]',
  };

  return (
    <div
      className={`w-6 h-6 rounded-full ${colorClasses[color]} flex items-center justify-center shrink-0`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.3334 4L6.00008 11.3333L2.66675 8"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ----------------------------------------
   Badge Sub-component
   ---------------------------------------- */
interface BadgeItemProps {
  badge: CardTitleBadge;
}

function BadgeItem({ badge }: BadgeItemProps) {
  const variantClasses = {
    default: 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]',
    success: 'bg-[var(--color-state-success-bg)] text-[var(--color-state-success)]',
    info: 'bg-[var(--color-state-info-bg)] text-[var(--color-state-info)]',
    warning: 'bg-[var(--color-state-warning-bg)] text-[var(--color-state-warning)]',
    muted: 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-label-sm leading-4 ${
        variantClasses[badge.variant || 'muted']
      }`}
    >
      {badge.icon && <span className="w-[9px] h-[9px]">{badge.icon}</span>}
      {badge.label}
    </span>
  );
}

/* ----------------------------------------
   CardTitle Component
   ---------------------------------------- */
/**
 * CardTitle - A flexible card header component
 *
 * Displays a title with optional status indicator, description, badges, and side content.
 * Commonly used in list items, cards, and detail headers.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CardTitle title="lively-sunset-6041" />
 *
 * // With description and status
 * <CardTitle
 *   title="lively-sunset-6041"
 *   description="PyTorch GPU-enabled template for AI/ML workloads"
 *   showStatus
 *   statusColor="success"
 * />
 *
 * // With badges
 * <CardTitle
 *   title="lively-sunset-6041"
 *   badges={[
 *     { label: 'Public', variant: 'success' },
 *     { label: 'ai-ml', variant: 'info' },
 *   ]}
 * />
 *
 * // With gauge side content
 * <CardTitle
 *   title="lively-sunset-6041"
 *   side="gauge"
 *   gaugeValue="0.0%"
 *   gaugeLabel="Utilization"
 * />
 * ```
 */
export function CardTitle({
  title,
  description,
  showStatus = false,
  statusColor = 'success',
  badges,
  side = 'none',
  gaugeValue,
  gaugeLabel,
  sideIcon,
  className = '',
  onClick,
}: CardTitleProps) {
  const hasBadges = badges && badges.length > 0;

  return (
    <div
      data-figma-name="[TDS] CardTitle"
      className={`flex items-start gap-3 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Status Indicator */}
      {showStatus && <StatusDot color={statusColor} />}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        {/* Title & Description */}
        <div className="flex flex-col gap-1">
          <h4 className="text-heading-h5 leading-6 text-[var(--color-text-default)] truncate">
            {title}
          </h4>
          {description && (
            <p className="text-body-md leading-4 text-[var(--color-text-subtle)] line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Badges */}
        {hasBadges && (
          <div className="flex flex-wrap gap-1">
            {badges.map((badge, index) => (
              <BadgeItem key={index} badge={badge} />
            ))}
          </div>
        )}
      </div>

      {/* Side Content */}
      {side === 'gauge' && (
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
            {gaugeValue}
          </span>
          <span className="text-body-md leading-4 text-[var(--color-text-subtle)]">
            {gaugeLabel}
          </span>
        </div>
      )}

      {side === 'icon' && sideIcon && (
        <div className="flex items-center justify-end shrink-0">{sideIcon}</div>
      )}
    </div>
  );
}

export default CardTitle;
