import type { ReactNode } from 'react';
import { cn } from '../../services/utils/cn';
import {
  ActiveIcon,
  AlertIcon,
  BuildingIcon,
  DeletingIcon,
  EditIcon,
  ErrorIcon,
  InuseIcon,
  PausedIcon,
  PendingIcon,
  SecurityErrorIcon,
  ShelvedIcon,
  ShutoffIcon,
  SuspendedIcon,
} from '../Icon';
import { Tooltip } from '../Tooltip';
import {
  statusIndicatorVariants,
  statusLabelStyles,
  colorSchemeStyles,
} from './StatusIndicator.styles';

/**
 * Predefined status variants with icon+color preset
 */
export type StatusVariant =
  | 'active'
  | 'pending'
  | 'error'
  | 'draft'
  | 'suspended'
  | 'shelved'
  | 'mounted'
  | 'shutoff'
  | 'down'
  | 'paused'
  | 'building'
  | 'deleting'
  | 'inUse'
  | 'degraded'
  | 'offline'
  | 'noMonitor';

/**
 * Color schemes for status indicator background
 * - success: green (active states)
 * - danger: red (error states)
 * - warning: orange (degraded/warning states)
 * - muted: gray (inactive/paused states)
 * - info: blue (building/progress states)
 */
export type StatusColorScheme = 'success' | 'danger' | 'warning' | 'muted' | 'info';

export type StatusIndicatorProps = {
  /**
   * Predefined status variant (provides both icon and color)
   * When using variant, colorScheme and customIcon are optional overrides
   */
  variant?: StatusVariant;
  /**
   * Custom color scheme - overrides variant's color when provided
   */
  colorScheme?: StatusColorScheme;
  /**
   * Custom icon - overrides variant's icon when provided
   * Use with colorScheme for fully custom statuses
   */
  customIcon?: ReactNode;
  label?: string;
  layout?: 'leftIcon' | 'iconOnly';
  tooltip?: string;
  className?: string;
};

// Maps variant to its default color scheme
const variantToColorScheme: Record<StatusVariant, StatusColorScheme> = {
  active: 'success',
  pending: 'muted',
  error: 'danger',
  draft: 'muted',
  suspended: 'muted',
  shelved: 'muted',
  mounted: 'muted',
  shutoff: 'muted',
  down: 'muted',
  paused: 'muted',
  building: 'info',
  deleting: 'danger',
  inUse: 'muted',
  degraded: 'warning',
  offline: 'danger',
  noMonitor: 'warning',
};

// Maps variant to its display label for tooltips
const variantToLabel: Record<StatusVariant, string> = {
  active: 'Active',
  pending: 'Pending',
  error: 'Error',
  draft: 'Draft',
  suspended: 'Suspended',
  shelved: 'Shelved',
  mounted: 'Mounted',
  shutoff: 'Shutoff',
  down: 'Down',
  paused: 'Paused',
  building: 'Building',
  deleting: 'Deleting',
  inUse: 'In Use',
  degraded: 'Degraded',
  offline: 'Offline',
  noMonitor: 'No Monitor',
};

// Maps variant to its default icon (16x16px icons inside 24x24px container)
const variantToIcon: Record<StatusVariant, ReactNode> = {
  active: <ActiveIcon color="white" size="sm" />,
  pending: <PendingIcon color="white" size="sm" />,
  error: <AlertIcon color="white" size="sm" />,
  draft: <EditIcon color="white" size="sm" />,
  suspended: <SuspendedIcon color="white" size="sm" />,
  shelved: <ShelvedIcon color="white" size="sm" />,
  mounted: <ShelvedIcon color="white" size="sm" />,
  shutoff: <ShutoffIcon color="white" size="sm" />,
  down: <ErrorIcon color="white" size="sm" />,
  paused: <PausedIcon color="white" size="sm" />,
  building: <BuildingIcon color="white" size="sm" />,
  deleting: <DeletingIcon color="white" size="sm" />,
  inUse: <InuseIcon color="white" size="sm" />,
  degraded: <AlertIcon color="white" size="sm" />,
  offline: <AlertIcon color="white" size="sm" />,
  noMonitor: <SecurityErrorIcon color="white" size="sm" />,
};

/**
 * [Design System] Status Indicator Component
 *
 * Displays resource status with icon and optional label.
 *
 * @example
 * // Predefined variants (backward compatible)
 * <StatusIndicator variant="active" label="Active" />
 * <StatusIndicator variant="error" label="Error" />
 * <StatusIndicator variant="building" label="Building" />
 *
 * @example
 * // Custom status with predefined color
 * <StatusIndicator
 *   colorScheme="muted"
 *   customIcon={<PendingIcon color="white" size="xs" />}
 *   label="Pending"
 * />
 *
 * @example
 * // Override variant's color
 * <StatusIndicator variant="active" colorScheme="info" label="Custom Active" />
 *
 * @example
 * // Icon only with tooltip
 * <StatusIndicator variant="active" layout="iconOnly" tooltip="Server Active" />
 */
export function StatusIndicator({
  variant,
  colorScheme,
  customIcon,
  label,
  layout = 'leftIcon',
  tooltip,
  className,
}: StatusIndicatorProps): React.ReactElement {
  // Resolve icon: customIcon > variant's icon > default building icon
  const resolvedIcon =
    customIcon ?? (variant ? variantToIcon[variant] : <BuildingIcon color="white" size="sm" />);

  // Resolve color: colorScheme > variant's color > default muted
  const resolvedColorScheme = colorScheme ?? (variant ? variantToColorScheme[variant] : 'muted');

  const isIconOnly = layout === 'iconOnly' || !label;
  const showLabel = layout === 'leftIcon' && Boolean(label);

  const displayLabel = label ?? (variant ? variantToLabel[variant] : undefined);
  const tooltipText = tooltip ?? (isIconOnly ? displayLabel : undefined);

  const indicatorContent = (
    <div
      className={cn(
        statusIndicatorVariants({ iconOnly: isIconOnly }),
        colorSchemeStyles[resolvedColorScheme],
        className
      )}
      role="status"
      aria-label={displayLabel}
    >
      {resolvedIcon}
      {showLabel && label && <span className={statusLabelStyles}>{label}</span>}
    </div>
  );

  if (tooltipText) {
    return <Tooltip content={tooltipText}>{indicatorContent}</Tooltip>;
  }

  return indicatorContent;
}

export default StatusIndicator;
