import React, { useState } from 'react';
import { IconAlertCircle, IconInfinity } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type ProgressBarVariant = 'default' | 'quota';
// thaki-ui compatibility: color variant
export type ThakiProgressBarVariant = 'success' | 'error' | 'warning';

export type ProgressBarStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

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

const getStatus = (
  usedPercent: number,
  totalPercent: number,
  isUnlimited: boolean
): { usedStatus: ProgressBarStatus; newStatus: ProgressBarStatus } => {
  if (isUnlimited) {
    return { usedStatus: 'neutral', newStatus: 'neutral' };
  }

  // Already exceeds quota (used only)
  if (usedPercent >= 100) {
    return { usedStatus: 'danger', newStatus: 'danger' };
  }

  // Total (used + new) exceeds quota
  if (totalPercent > 100) {
    if (usedPercent < 70) {
      return { usedStatus: 'success', newStatus: 'danger' };
    }
    return { usedStatus: 'danger', newStatus: 'danger' };
  }

  // Total is at warning level (70-100%)
  if (totalPercent >= 70) {
    if (usedPercent < 70) {
      return { usedStatus: 'success', newStatus: 'warning' };
    }
    return { usedStatus: 'warning', newStatus: 'warning' };
  }

  // Normal (under 70%)
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
    : getStatus((value / total) * 100, ((value + newValue) / total) * 100, isUnlimited);

  // Quota variant
  if (variant === 'quota') {
    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          {label && <span className="text-label-sm text-[var(--color-text-default)]">{label}</span>}
          {showValue && (
            <div className="flex items-center text-body-sm text-[var(--color-text-default)]">
              <span>{value + newValue}/</span>
              {isUnlimited ? <IconInfinity size={12} stroke={1} /> : <span>{max}</span>}
            </div>
          )}
        </div>

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
              <div className="bg-[var(--tooltip-bg)] text-[var(--tooltip-text)] text-body-sm px-2 py-1 rounded-[var(--radius-sm)] shadow-[var(--shadow-md)]">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span
                      className="w-[6px] h-[6px] rounded-full"
                      style={{ backgroundColor: getStatusColor(newStatus, true) }}
                    />
                    <span>Used: {value}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className="w-[6px] h-[6px] rounded-full"
                      style={{ backgroundColor: getStatusColor(usedStatus) }}
                    />
                    <span>New: {newValue}</span>
                  </div>
                </div>
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
            backgroundColor: error ? getStatusColor('danger') : getStatusColor(status || 'info'),
            minWidth: totalPercent > 0 ? 4 : 0,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
