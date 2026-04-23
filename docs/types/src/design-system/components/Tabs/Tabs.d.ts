import { default as React, ReactNode } from 'react';
export type TabSize = 'sm' | 'md';
export type TabVariant = 'underline' | 'boxed';
export type TabVariantAlias = 'line' | 'button';
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
    /** Default active tab value */
    defaultValue?: string;
    /** Controlled active tab value */
    value?: string;
    /** @deprecated Use value instead (thaki-ui compatibility) */
    activeTabId?: string;
    /** Change handler */
    onChange?: (value: string) => void;
    /** Tab size */
    size?: TabSize;
    /** Tab style variant (also accepts thaki-ui aliases: line, button) */
    variant?: TabVariant | TabVariantAlias;
    /** Children (TabList and TabPanels) */
    children: ReactNode;
}
export interface TabListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Tab items */
    children: ReactNode;
}
export interface TabProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'children' | 'value'> {
    /** Tab value (unique identifier) */
    value: string;
    /** Tab label */
    children: ReactNode;
    /** Disabled state */
    disabled?: boolean;
}
export interface TabPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Panel value (matches Tab value) */
    value: string;
    /** Panel content */
    children: ReactNode;
}
export declare function Tabs({ defaultValue, value: controlledValue, activeTabId, onChange, size, variant: rawVariant, children, className, ...rest }: TabsProps): import("react/jsx-runtime").JSX.Element;
export declare function TabList({ children, className, ...rest }: TabListProps): import("react/jsx-runtime").JSX.Element;
export declare function Tab({ value, children, disabled, className, ...rest }: TabProps): import("react/jsx-runtime").JSX.Element;
export declare function TabPanel({ value, children, className, ...rest }: TabPanelProps): import("react/jsx-runtime").JSX.Element;
