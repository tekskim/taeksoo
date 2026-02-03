import { ReactNode, HTMLAttributes } from 'react';
import { StatusType } from '../StatusIndicator';
export interface DetailHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /** Child components */
    children: ReactNode;
}
export declare function DetailHeader({ children, className, ...props }: DetailHeaderProps): import("react/jsx-runtime").JSX.Element;
export declare namespace DetailHeader {
    var Title: typeof DetailHeaderTitle;
    var Actions: typeof DetailHeaderActions;
    var InfoGrid: typeof DetailHeaderInfoGrid;
    var InfoCard: typeof DetailHeaderInfoCard;
}
export interface DetailHeaderTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    /** Title text or children */
    children: ReactNode;
}
declare function DetailHeaderTitle({ children, className, ...props }: DetailHeaderTitleProps): import("react/jsx-runtime").JSX.Element;
export interface DetailHeaderActionsProps extends HTMLAttributes<HTMLDivElement> {
    /** Action buttons */
    children: ReactNode;
}
declare function DetailHeaderActions({ children, className, ...props }: DetailHeaderActionsProps): import("react/jsx-runtime").JSX.Element;
export interface DetailHeaderInfoGridProps extends HTMLAttributes<HTMLDivElement> {
    /** InfoCard components */
    children: ReactNode;
}
declare function DetailHeaderInfoGrid({ children, className, ...props }: DetailHeaderInfoGridProps): import("react/jsx-runtime").JSX.Element;
export interface DetailHeaderInfoCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Label for the info card */
    label: string;
    /** Value to display - can be string or ReactNode */
    value: ReactNode;
    /** Show copy button for the value (only works with string values) */
    copyable?: boolean;
    /** Show status indicator instead of value */
    status?: StatusType;
}
declare function DetailHeaderInfoCard({ label, value, copyable, status, className, ...props }: DetailHeaderInfoCardProps): import("react/jsx-runtime").JSX.Element;
export { DetailHeaderTitle, DetailHeaderActions, DetailHeaderInfoGrid, DetailHeaderInfoCard, };
