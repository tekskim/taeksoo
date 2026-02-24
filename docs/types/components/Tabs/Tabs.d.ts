import { ReactNode } from 'react';
export type TabSize = 'sm' | 'md';
export type TabVariant = 'underline' | 'boxed';
export interface TabsProps {
    /** Default active tab value */
    defaultValue?: string;
    /** Controlled active tab value */
    value?: string;
    /** Change handler */
    onChange?: (value: string) => void;
    /** Tab size */
    size?: TabSize;
    /** Tab style variant */
    variant?: TabVariant;
    /** Children (TabList and TabPanels) */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
}
export interface TabListProps {
    /** Tab items */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
}
export interface TabProps {
    /** Tab value (unique identifier) */
    value: string;
    /** Tab label */
    children: ReactNode;
    /** Disabled state */
    disabled?: boolean;
    /** Additional CSS classes */
    className?: string;
}
export interface TabPanelProps {
    /** Panel value (matches Tab value) */
    value: string;
    /** Panel content */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
}
export declare function Tabs({ defaultValue, value: controlledValue, onChange, size, variant, children, className, }: TabsProps): import("react/jsx-runtime").JSX.Element;
export declare function TabList({ children, className }: TabListProps): import("react/jsx-runtime").JSX.Element;
export declare function Tab({ value, children, disabled, className }: TabProps): import("react/jsx-runtime").JSX.Element;
export declare function TabPanel({ value, children, className }: TabPanelProps): import("react/jsx-runtime").JSX.Element;
