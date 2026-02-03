import { ReactNode } from 'react';
export interface CardTitleBadge {
    label: string;
    variant?: 'default' | 'success' | 'info' | 'warning' | 'muted';
    icon?: ReactNode;
}
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
export declare function CardTitle({ title, description, showStatus, statusColor, badges, side, gaugeValue, gaugeLabel, sideIcon, className, onClick, }: CardTitleProps): import("react/jsx-runtime").JSX.Element;
export default CardTitle;
