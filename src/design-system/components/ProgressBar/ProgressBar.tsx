import React, { useState } from 'react';
import { IconAlertCircle, IconInfinity } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type ProgressBarVariant = 'default' | 'quota';
// thaki-ui compatibility: color variant
export type ThakiProgressBarVariant = 'success' | 'error' | 'warning';

export type ProgressBarStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/** Configurable thresholds for status color transitions */
export interface StatusThresholds {
  /** Percentage at which to show warning color (default: 70) */
  warning: number;
  /** Percentage at which to show danger color (default: 100) */
  danger: number;
}

// Map thaki-ui variant to tds status
const thakiVariantToStatus: Record<ThakiProgressBarVariant, ProgressBarStatus> = {
  success: 'success',
  error: 'danger',
  warning: 'warning',
};

export interface ProgressBarProps {
  /** Current value (Used) */
  value: number;
  /** Maximum value (Total), undefined = unlimited */
  max?: number;
  /** New/additional value to be added */
  newValue?: number;
  /** Variant */
  variant?: ProgressBarVariant;
  /** Label (e.g., "Instance") */
  label?: string;
  /** Show value text */
  showValue?: boolean;
  /** Error state */
  error?: boolean;
  /** Error message for tooltip */
  errorMessage?: string;
  /** Status text (e.g., "chunking") */
  statusText?: string;
  /** Custom status color (overrides default 'info') */
  status?: ProgressBarStatus;
  /** Custom class name */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Custom thresholds for status color transitions.
   *  Default: { warning: 70, danger: 100 }
   *  Compute: { warning: 70, danger: 90 } */
  thresholds?: StatusThresholds;
  /** @deprecated thaki-ui compatibility - use status instead */
  thakiVariant?: ThakiProgressBarVariant;
  /** @deprecated thaki-ui compatibility - custom bar color */
  color?: string;
  /** @deprecated thaki-ui compatibility - custom pending bar color */
  pendingColor?: string;
}

/* ----------------------------------------
   Helpers
   ---------------------------------------- */

const DEFAULT_THRESHOLDS: StatusThresholds = { warning: 70, danger: 95 };

/** Preset thresholds per app */
export const STATUS_THRESHOLDS = {
  /** Compute: 0-69% Normal, 70-89% Warning, 90%+ Danger */
  compute: { warning: 70, danger: 90 } as StatusThresholds,
  /** Compute Admin: 0-69% Normal, 70-99% Warning, 100%+ Danger */
  computeAdmin: { warning: 70, danger: 100 } as StatusThresholds,
  /** Storage: 0-84% Normal, 85-94% Warning, 95%+ Danger */
  storage: { warning: 85, danger: 95 } as StatusThresholds,
  /** Container: 0-69% Normal, 70-94% Warning, 95%+ Danger */
  container: { warning: 70, danger: 95 } as StatusThresholds,
  /** Default: 0-69% Normal, 70-94% Warning, 95%+ Danger */
  default: DEFAULT_THRESHOLDS,
};

const getStatus = (
  usedPercent: number,
  totalPercent: number,
  isUnlimited: boolean,
  thresholds: StatusThresholds = DEFAULT_THRESHOLDS
): { usedStatus: ProgressBarStatus; newStatus: ProgressBarStatus } => {
  if (isUnlimited) {
    return { usedStatus: 'neutral', newStatus: 'neutral' };
  }

  const { warning, danger } = thresholds;

  // Already exceeds danger threshold (used only)
  if (usedPercent >= danger) {
    return { usedStatus: 'danger', newStatus: 'danger' };
  }

  // Total (used + new) exceeds danger threshold
  if (totalPercent >= danger) {
    if (usedPercent < warning) {
      return { usedStatus: 'success', newStatus: 'danger' };
    }
    return { usedStatus: 'danger', newStatus: 'danger' };
  }

  // Total is at warning level (warning% ~ danger%)
  if (totalPercent >= warning) {
    if (usedPercent < warning) {
      return { usedStatus: 'success', newStatus: 'warning' };
    }
    return { usedStatus: 'warning', newStatus: 'warning' };
  }

  // Normal (under warning%)
  return { usedStatus: 'success', newStatus: 'success' };
};

const getStatusColor = (status: ProgressBarStatus, isLight = false): string => {
  const colors: Record<ProgressBarStatus, { default: string; light: string }> = {
    success: {
      default: 'var(--color-state-success)',
      light: 'var(--color-green-300)',
    },
    warning: {
      default: 'var(--color-state-warning)',
      light: 'var(--color-orange-300)',
    },
    danger: {
      default: 'var(--color-state-danger)',
      light: 'var(--color-red-300)',
    },
    info: {
      default: 'var(--color-state-info)',
      light: 'var(--color-blue-300)',
    },
    neutral: {
      default: 'var(--color-border-default)',
      light: 'var(--color-border-subtle)',
    },
  };

  return isLight ? colors[status].light : colors[status].default;
};

/* ----------------------------------------
   ProgressBar Component
   ---------------------------------------- */

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  newValue = 0,
  variant = 'default',
  label,
  showValue = true,
  error = false,
  errorMessage,
  statusText,
  status: rawStatus,
  className = '',
  size = 'md',
  thresholds,
  // thaki-ui compatibility props
  thakiVariant,
  color,
  pendingColor,
}) => {
  // thaki-ui compatibility: map thakiVariant to status
  const status = rawStatus ?? (thakiVariant ? thakiVariantToStatus[thakiVariant] : undefined);

  // thaki-ui compatibility: warn about deprecated props
  if (process.env.NODE_ENV === 'development') {
    if (color) console.warn('[ProgressBar] color prop is deprecated. Use status prop instead.');
    if (pendingColor)
      console.warn('[ProgressBar] pendingColor prop is deprecated. Use status prop instead.');
  }
  const [showTooltip, setShowTooltip] = useState(false);

  const isUnlimited = max === undefined || max === Infinity;
  const total = max || 100;
  const usedPercent = isUnlimited ? 50 : Math.min((value / total) * 100, 100);
  const newPercent = isUnlimited ? 0 : Math.min((newValue / total) * 100, 100 - usedPercent);
  const totalPercent = usedPercent + newPercent;

  const { usedStatus, newStatus } = error
    ? { usedStatus: 'danger' as ProgressBarStatus, newStatus: 'danger' as ProgressBarStatus }
    : getStatus((value / total) * 100, ((value + newValue) / total) * 100, isUnlimited, thresholds);

  // Quota variant
  if (variant === 'quota') {
    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {/* Header */}
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <span className="text-label-sm text-[var(--color-text-default)]">{label}</span>
            )}
            {showValue && (
              <div className="flex items-center text-body-sm text-[var(--color-text-default)]">
                <span>{value + newValue}/</span>
                {isUnlimited ? <IconInfinity size={12} stroke={1} /> : <span>{max}</span>}
              </div>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div
          className="relative h-[var(--progress-bar-height)] w-full"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {/* Background - full width */}
          <div
            className="absolute inset-0 rounded-[var(--progress-bar-radius)]"
            style={{
              backgroundColor: 'var(--color-border-subtle)',
            }}
          />

          {/* Used segment */}
          <div
            className={`absolute inset-y-0 left-0 z-[3] ${
              newValue > 0
                ? 'rounded-l-[var(--progress-bar-radius)]'
                : 'rounded-[var(--progress-bar-radius)]'
            }`}
            style={{
              width: `${usedPercent}%`,
              backgroundColor: getStatusColor(usedStatus),
              minWidth: usedPercent > 0 ? 4 : 0,
            }}
          />

          {/* New segment */}
          {newValue > 0 && (
            <div
              className="absolute inset-y-0 rounded-r-[var(--progress-bar-radius)] z-[2]"
              style={{
                left: `${usedPercent}%`,
                width: `${newPercent}%`,
                backgroundColor: getStatusColor(newStatus, true),
                minWidth: newPercent > 0 ? 4 : 0,
              }}
            />
          )}

          {/* Tooltip */}
          {showTooltip && newValue > 0 && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full z-10">
              <div className="relative bg-[var(--tooltip-bg)] text-[var(--tooltip-text)] text-body-sm px-2 py-1 rounded-[var(--radius-sm)] shadow-[var(--shadow-md)]">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span
                      className="w-[6px] h-[6px] rounded-full"
                      style={{ backgroundColor: getStatusColor(usedStatus) }}
                    />
                    <span>Used: {value}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className="w-[6px] h-[6px] rounded-full"
                      style={{ backgroundColor: getStatusColor(newStatus, true) }}
                    />
                    <span>New: {newValue}</span>
                  </div>
                </div>
                {/* Pointer arrow */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0"
                  style={{
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderTop: '4px solid var(--tooltip-bg)',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant (simple progress bar or table cell)
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {/* Header */}
      {(label || statusText || showValue) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {label && (
              <span className="text-body-md text-[var(--color-text-default)]">{label}</span>
            )}
            {error && (
              <div className="relative group">
                <IconAlertCircle
                  size={12}
                  stroke={1}
                  className="text-[var(--color-state-danger)]"
                />
                {errorMessage && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block z-10">
                    <div className="bg-[var(--tooltip-bg)] text-[var(--tooltip-text)] text-body-sm px-2 py-1 rounded-[var(--radius-sm)] shadow-[var(--shadow-md)] whitespace-nowrap">
                      {errorMessage}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {statusText && (
            <span className="text-body-sm text-[var(--color-text-subtle)]">{statusText}</span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative h-[var(--progress-bar-height)] w-full">
        {/* Background - full width */}
        <div
          className="absolute inset-0 rounded-[var(--progress-bar-radius)]"
          style={{
            backgroundColor: 'var(--color-border-subtle)',
          }}
        />

        {/* Filled segment */}
        <div
          className="absolute inset-y-0 left-0 rounded-[var(--progress-bar-radius)] z-[2]"
          style={{
            width: `${Math.min(totalPercent, 100)}%`,
            backgroundColor: error
              ? getStatusColor('danger')
              : status || thresholds
                ? getStatusColor(usedStatus)
                : 'var(--color-action-primary)',
            minWidth: totalPercent > 0 ? 4 : 0,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
