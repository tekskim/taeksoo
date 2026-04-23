import { HTMLAttributes, ReactNode } from 'react';
export type StatusType = 'active' | 'enabled' | 'error' | 'building' | 'deleting' | 'suspended' | 'shelved' | 'shelved-offloaded' | 'mounted' | 'shutoff' | 'paused' | 'pending' | 'draft' | 'verify-resized' | 'deactivated' | 'disabled' | 'in-use' | 'maintenance' | 'degraded' | 'no-monitor' | 'down';
export type StatusLayout = 'icon-only' | 'badge';
export type StatusSize = 'sm' | 'md' | 'lg';
export interface StatusConfig {
    label: string;
    icon: ReactNode;
    bgColor: string;
}
export type ThakiColorScheme = 'success' | 'danger' | 'warning' | 'info' | 'muted';
export interface StatusIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    /** Status type */
    status: StatusType;
    /** Layout variant (also accepts thaki-ui 'iconOnly', 'default', 'leftIcon' for compat) */
    layout?: StatusLayout | 'default' | 'leftIcon' | 'iconOnly';
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
export declare const StatusIndicator: import('react').NamedExoticComponent<StatusIndicatorProps>;
