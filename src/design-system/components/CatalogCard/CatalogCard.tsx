import { type ReactNode } from 'react';
import { Badge } from '../Badge';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface CatalogCardBadge {
  label: string;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  theme?: 'white';
}

export interface CatalogCardProps {
  /** Icon source URL */
  iconSrc: string;
  /** Icon alt text */
  iconAlt: string;
  /** Card title */
  name: string;
  /** Optional version string (displayed as-is) */
  version?: string;
  /** Description text (clamped to 3 lines) */
  description: string;
  /** Badge list rendered in the footer */
  badges?: CatalogCardBadge[];
  /** Action button(s) rendered in the footer */
  actions?: ReactNode;
  /** Additional CSS class */
  className?: string;
}

export function CatalogCard({
  iconSrc,
  iconAlt,
  name,
  version,
  description,
  badges,
  actions,
  className = '',
}: CatalogCardProps) {
  return (
    <div
      className={`flex flex-col gap-3 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] ${className}`.trim()}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-[var(--radius-lg)] shrink-0 border border-[var(--color-border-default)] flex items-center justify-center">
          <img src={iconSrc} alt={iconAlt} className="w-6 h-6 object-contain" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-heading-h6 text-[var(--color-text-default)]">{name}</span>
          {version && (
            <span className="text-body-sm text-[var(--color-text-subtle)]">{version}</span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-body-md text-[var(--color-text-muted)] m-0 line-clamp-3 flex-1">
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-end justify-between mt-auto pt-3">
        {badges && badges.length > 0 ? (
          <div className="flex items-center gap-1 flex-wrap min-w-0">
            {badges.map((badge, idx) => (
              <Badge
                key={idx}
                variant={badge.variant}
                theme={badge.theme}
                size="sm"
                className="whitespace-nowrap"
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        ) : (
          <div />
        )}
        {actions && <div className="flex items-center gap-1 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
