import { cloneElement, isValidElement, memo, type HTMLAttributes, type ReactNode } from 'react';
import { twMerge } from '../../utils/cn';
import {
  IconAlertTriangle,
  IconPlugConnectedX,
  IconPower,
  IconPlayerPause,
  IconLoader,
  IconPlugConnected,
  IconEdit,
  IconCircleDashedCheck,
  IconLivePhotoOff,
  IconTool,
  IconAlertCircle,
  IconAlertHexagon,
  IconShieldExclamation,
  IconCircleMinus,
  IconLivePhoto,
  IconBan,
} from '@tabler/icons-react';

/* ----------------------------------------
   Status Types & Configuration
   ---------------------------------------- */

export type StatusType =
  | 'active'
  | 'enabled'
  | 'error'
  | 'building'
  | 'deleting'
  | 'suspended'
  | 'shelved'
  | 'shelved-offloaded'
  | 'mounted'
  | 'shutoff'
  | 'paused'
  | 'pending'
  | 'draft'
  | 'verify-resized'
  | 'deactivated'
  | 'disabled'
  | 'in-use'
  | 'maintenance'
  | 'degraded'
  | 'no-monitor'
  | 'down';

// Custom In-Use Icon (transfer/sync arrows)
const IconInUse = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.6665 8V6C2.6665 5.46957 2.87722 4.96086 3.25229 4.58579C3.62736 4.21071 4.13607 4 4.6665 4H13.3332M13.3332 4L11.3332 2M13.3332 4L11.3332 6M13.3332 8V10C13.3332 10.5304 13.1225 11.0391 12.7474 11.4142C12.3723 11.7893 11.8636 12 11.3332 12H2.6665M2.6665 12L4.6665 14M2.6665 12L4.6665 10"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export type StatusLayout = 'icon-only' | 'default' | 'badge';
export type StatusSize = 'sm' | 'md' | 'lg';

export interface StatusConfig {
  label: string;
  icon: ReactNode;
  bgColor: string;
}

const ICON_SIZE = 16;

const statusConfig: Record<StatusType, StatusConfig> = {
  // Success (Green) - using semantic color
  active: {
    label: 'Active',
    icon: <IconLivePhoto size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-success-bg)]',
  },
  enabled: {
    label: 'Enabled',
    icon: <IconPower size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-success-bg)]',
  },
  // Danger (Red) - using semantic color
  error: {
    label: 'Error',
    icon: <IconAlertTriangle size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-danger-bg)]',
  },
  // Info (Blue) - using semantic color (transitional states)
  building: {
    label: 'Building...',
    icon: <IconLoader size={ICON_SIZE} strokeWidth={2} className="animate-spin-slow" />,
    bgColor: 'bg-[var(--status-info-bg)]',
  },
  deleting: {
    label: 'Deleting...',
    icon: <IconLoader size={ICON_SIZE} strokeWidth={2} className="animate-spin-slow" />,
    bgColor: 'bg-[var(--status-info-bg)]',
  },
  pending: {
    label: 'Pending',
    icon: <IconLoader size={ICON_SIZE} strokeWidth={2} className="animate-spin-slow" />,
    bgColor: 'bg-[var(--status-info-bg)]',
  },
  // Warning (Orange) - using semantic color
  'verify-resized': {
    label: 'Verify Resized',
    icon: <IconCircleDashedCheck size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-warning-bg)]',
  },
  degraded: {
    label: 'Degraded',
    icon: <IconAlertHexagon size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-warning-bg)]',
  },
  'no-monitor': {
    label: 'No Monitor',
    icon: <IconShieldExclamation size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-warning-bg)]',
  },
  down: {
    label: 'Down',
    icon: <IconAlertCircle size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-warning-bg)]',
  },
  maintenance: {
    label: 'Maintenance',
    icon: <IconTool size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-warning-bg)]',
  },
  // Muted (Gray) - using semantic color
  suspended: {
    label: 'Suspended',
    icon: <IconCircleMinus size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  shelved: {
    label: 'Shelved Offloaded',
    icon: <IconPlugConnectedX size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  'shelved-offloaded': {
    label: 'Shelved Offloaded',
    icon: <IconPlugConnectedX size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  mounted: {
    label: 'Mounted',
    icon: <IconPlugConnected size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  shutoff: {
    label: 'Shutoff',
    icon: <IconPower size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  paused: {
    label: 'Paused',
    icon: <IconPlayerPause size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  draft: {
    label: 'Draft',
    icon: <IconEdit size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  deactivated: {
    label: 'Deactivated',
    icon: <IconLivePhotoOff size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  disabled: {
    label: 'Disabled',
    icon: <IconBan size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  'in-use': {
    label: 'In-use',
    icon: <IconInUse size={ICON_SIZE} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
};

/* ----------------------------------------
   StatusIndicator Props
   ---------------------------------------- */

// thaki-ui compatibility: color scheme type
export type ThakiColorScheme = 'success' | 'danger' | 'warning' | 'info' | 'muted';

export interface StatusIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Status type */
  status: StatusType;
  /** Layout variant (also accepts thaki-ui 'leftIcon', 'iconOnly') */
  layout?: StatusLayout | 'leftIcon' | 'iconOnly';
  /** Size variant (only applies to icon-only layout) */
  size?: StatusSize;
  /** Custom label (overrides default) */
  label?: string;
  /** @deprecated thaki-ui compatibility - custom color scheme */
  colorScheme?: ThakiColorScheme;
  /** @deprecated thaki-ui compatibility - custom icon */
  customIcon?: ReactNode;
  /** @deprecated thaki-ui compatibility - tooltip text */
  tooltip?: string;
}

/* ----------------------------------------
   StatusIndicator Component
   ---------------------------------------- */

export const StatusIndicator = memo(function StatusIndicator({
  status,
  layout: rawLayout = 'default',
  size = 'md',
  label,
  className = '',
  // thaki-ui compatibility props
  colorScheme,
  customIcon,
  tooltip,
  ...props
}: StatusIndicatorProps) {
  // thaki-ui compatibility: map layout aliases
  const layout: StatusLayout =
    rawLayout === 'leftIcon'
      ? 'default'
      : rawLayout === 'iconOnly'
        ? 'icon-only'
        : (rawLayout as StatusLayout);

  const config = statusConfig[status] ?? statusConfig.error;

  // thaki-ui compatibility: use customIcon if provided
  const displayIcon = customIcon ?? config.icon;
  const displayLabel = label ?? config.label;

  // thaki-ui compatibility: warn about deprecated props
  if (process.env.NODE_ENV === 'development') {
    if (colorScheme)
      console.warn('[StatusIndicator] colorScheme prop is deprecated. Use status prop instead.');
    if (tooltip)
      console.warn(
        '[StatusIndicator] tooltip prop is deprecated. Wrap with Tooltip component instead.'
      );
  }

  // Size-based icon sizes for icon-only layout
  const iconSizes: Record<StatusSize, number> = {
    sm: 14,
    md: 14,
    lg: 16,
  };

  // Size-based container sizes for icon-only layout
  const sizeStyles: Record<StatusSize, string> = {
    sm: 'size-[24px]',
    md: 'size-[24px]',
    lg: 'size-[28px]',
  };

  // For icon-only layout with size variant
  if (layout === 'icon-only') {
    const iconSize = iconSizes[size];
    const containerSize = sizeStyles[size];

    // Clone the icon with the appropriate size
    const clonedIcon = isValidElement(displayIcon)
      ? cloneElement(displayIcon as React.ReactElement<{ size?: number }>, { size: iconSize })
      : displayIcon;

    const classes = twMerge(
      'inline-flex items-center justify-center',
      'rounded-full',
      'text-[var(--status-text)]',
      containerSize,
      config.bgColor,
      className
    );

    return (
      <span
        data-figma-name="[TDS] StatusIndicator"
        className={classes}
        role="status"
        aria-label={displayLabel}
        {...props}
      >
        <span className="shrink-0">{clonedIcon}</span>
      </span>
    );
  }

  // Badge layout - square-ish with icon and text
  if (layout === 'badge') {
    const baseStyles = [
      'inline-flex items-center',
      'gap-1.5',
      'font-medium',
      'rounded-md',
      'px-2 py-0.5',
      'text-[var(--status-text)]',
      'text-body-sm',
      'leading-4',
    ].join(' ');

    const classes = twMerge(baseStyles, config.bgColor, className);

    return (
      <span
        data-figma-name="[TDS] StatusIndicator"
        className={classes}
        role="status"
        aria-label={displayLabel}
        {...props}
      >
        <span className="shrink-0">{displayIcon}</span>
        <span>{displayLabel}</span>
      </span>
    );
  }

  // Default layout with label (rounded pill shape)
  const baseStyles = [
    'inline-flex items-center',
    'gap-[var(--status-gap)]',
    'font-medium',
    'rounded-[var(--status-radius)]',
    'text-[var(--status-text)]',
    'text-[length:var(--status-font-size)]',
    'leading-[var(--status-line-height)]',
  ].join(' ');

  const paddingStyles = 'px-[var(--status-padding-x)] py-[var(--status-padding-y)]';

  const classes = twMerge(baseStyles, paddingStyles, config.bgColor, className);

  return (
    <span
      data-figma-name="[TDS] StatusIndicator"
      className={classes}
      role="status"
      aria-label={displayLabel}
      {...props}
    >
      <span className="shrink-0">{displayIcon}</span>
      <span>{displayLabel}</span>
    </span>
  );
});
