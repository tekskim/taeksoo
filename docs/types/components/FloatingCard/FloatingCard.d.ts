import { HTMLAttributes } from 'react';
export type FloatingCardPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type SectionStatus = 'processing' | 'warning' | 'success' | 'default';
export interface SectionItem {
    id: string;
    title: string;
    status: SectionStatus;
    onClick?: () => void;
}
export interface QuotaItem {
    label: string;
    current: number;
    total: number;
    unit?: string;
}
export interface FloatingCardSection {
    tabTitle: string;
    items: SectionItem[];
    collapsible?: boolean;
    defaultExpanded?: boolean;
    showSuccessIcon?: boolean;
    showChevron?: boolean;
}
export interface FloatingCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    title: string;
    sections?: FloatingCardSection[];
    quota?: QuotaItem[];
    instanceCount?: number;
    onInstanceCountChange?: (count: number) => void;
    cancelLabel?: string;
    actionLabel?: string;
    actionEnabled?: boolean;
    onCancel?: () => void;
    onAction?: () => void;
    position?: FloatingCardPosition;
    showCloseButton?: boolean;
    onClose?: () => void;
    isOpen?: boolean;
    zIndex?: number;
    portal?: boolean;
    width?: string;
}
export declare function FloatingCard({ title, sections, quota, instanceCount, onInstanceCountChange, cancelLabel, actionLabel, actionEnabled, onCancel, onAction, position, showCloseButton, onClose, isOpen, zIndex, portal, width, className, style, ...props }: FloatingCardProps): import("react/jsx-runtime").JSX.Element | null;
export default FloatingCard;
