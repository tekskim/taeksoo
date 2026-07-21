import { VStack } from '@/design-system';
import { ProgressBar } from '@/design-system';

/**
 * Reusable stat/metric card for AI Platform pages.
 * Supports 3 variants: basic (label + value), progress (with bar), and compact (small inline).
 */

interface StatCardProps {
  label: string;
  value: string | number;
  variant?: 'basic' | 'progress' | 'compact';
  /** Progress bar value (0-100), only used with variant="progress" */
  progress?: number;
  /** Color for progress bar */
  progressColor?: string;
  /** Optional unit suffix displayed after value */
  unit?: string;
  /** Optional secondary/description text below value */
  description?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  variant = 'basic',
  progress,
  progressColor,
  unit,
  description,
  className = '',
}: StatCardProps) {
  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center justify-between rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] px-4 py-3 ${className}`}
      >
        <span className="text-body-md text-[var(--color-text-subtle)]">{label}</span>
        <span className="text-heading-h6 text-[var(--color-text-default)]">
          {value}
          {unit && (
            <span className="text-body-md text-[var(--color-text-subtle)] ml-0.5">{unit}</span>
          )}
        </span>
      </div>
    );
  }

  if (variant === 'progress') {
    return (
      <div
        className={`flex flex-col gap-2 rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] px-4 py-3 ${className}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-body-md text-[var(--color-text-subtle)]">{label}</span>
          <span className="text-heading-h6 text-[var(--color-text-default)]">
            {value}
            {unit && (
              <span className="text-body-md text-[var(--color-text-subtle)] ml-0.5">{unit}</span>
            )}
          </span>
        </div>
        {progress !== undefined && <ProgressBar value={progress} color={progressColor} size="sm" />}
        {description && (
          <span className="text-body-sm text-[var(--color-text-subtle)]">{description}</span>
        )}
      </div>
    );
  }

  return (
    <VStack
      gap={1}
      className={`rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] px-4 py-3 ${className}`}
    >
      <span className="text-body-sm text-[var(--color-text-subtle)]">{label}</span>
      <span className="text-heading-h5 text-[var(--color-text-default)]">
        {value}
        {unit && <span className="text-body-md text-[var(--color-text-subtle)] ml-1">{unit}</span>}
      </span>
      {description && (
        <span className="text-body-sm text-[var(--color-text-subtle)]">{description}</span>
      )}
    </VStack>
  );
}

/**
 * Grid container for StatCards.
 * Automatically handles responsive layout.
 */
interface StatCardGroupProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function StatCardGroup({ children, columns = 4, className = '' }: StatCardGroupProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  return <div className={`grid ${gridCols[columns]} gap-3 ${className}`}>{children}</div>;
}
