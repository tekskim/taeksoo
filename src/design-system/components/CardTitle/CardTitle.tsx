import { type ReactNode } from 'react';
import { Badge, type BadgeVariant } from '../Badge/Badge';
import { StatusIndicator, type StatusType } from '../StatusIndicator';

/* ----------------------------------------
   Badge Type for CardTitle
   ---------------------------------------- */
export interface CardTitleBadge {
  label: string;
  variant?: 'default' | 'success' | 'info' | 'warning' | 'muted';
  icon?: ReactNode;
}

const STATUS_COLOR_MAP: Record<string, StatusType> = {
  success: 'active',
  warning: 'pending',
  error: 'error',
  info: 'building',
  muted: 'disabled',
};

/* ----------------------------------------
   CardTitle Props
   ---------------------------------------- */
export interface CardTitleProps {
  /** Main title text */
  title: string;
  /** Optional description text */
  description?: string;
  /** Show status indicator */
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

const BADGE_VARIANT_MAP: Record<string, BadgeVariant> = {
  default: 'default',
  success: 'success',
  info: 'info',
  warning: 'warning',
  muted: 'default',
};

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
      {showStatus && (
        <StatusIndicator
          status={STATUS_COLOR_MAP[statusColor] || 'active'}
          layout="icon-only"
          size="lg"
          className="shrink-0"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        {/* Title & Description */}
        <div className="flex flex-col gap-1">
          <h4 className="text-heading-h5 leading-6 text-[var(--color-text-default)] truncate">
            {title}
          </h4>
          {description && (
            <p className="text-body-md leading-4 text-[var(--color-text-muted)] line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Badges */}
        {hasBadges && (
          <div className="flex flex-wrap gap-1">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant={BADGE_VARIANT_MAP[badge.variant || 'muted']}
                size="sm"
                leftIcon={badge.icon}
              >
                {badge.label}
              </Badge>
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
