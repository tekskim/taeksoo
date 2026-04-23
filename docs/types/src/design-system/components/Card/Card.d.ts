import { ReactNode } from 'react';
export interface CardProps {
    children: ReactNode;
    className?: string;
}
declare function CardRoot({ children, className }: CardProps): import("react/jsx-runtime").JSX.Element;
export interface CardDetailsBoxProps {
    children: ReactNode;
    className?: string;
}
declare function DetailsBox({ children, className }: CardDetailsBoxProps): import("react/jsx-runtime").JSX.Element;
export interface CardDetailItem {
    label: string;
    value: ReactNode;
}
export interface CardDetailRowProps {
    items: CardDetailItem[];
    className?: string;
}
declare function DetailRow({ items, className }: CardDetailRowProps): import("react/jsx-runtime").JSX.Element;
export interface CardProgressBarProps {
    /** Progress label text */
    label: string;
    /** Progress value (0-100) */
    value: number;
    className?: string;
}
declare function ProgressBar({ label, value, className }: CardProgressBarProps): import("react/jsx-runtime").JSX.Element;
export interface CardMetadataItemProps {
    label: string;
    value: string | number;
}
export interface CardFooterProps {
    /** Metadata items displayed as "label value | label value" */
    metadata?: CardMetadataItemProps[];
    /** Action buttons (right-aligned) */
    actions?: ReactNode;
    className?: string;
}
declare function Footer({ metadata, actions, className }: CardFooterProps): import("react/jsx-runtime").JSX.Element;
export declare const ResourceCard: typeof CardRoot & {
    DetailsBox: typeof DetailsBox;
    DetailRow: typeof DetailRow;
    ProgressBar: typeof ProgressBar;
    Footer: typeof Footer;
};
export {};
