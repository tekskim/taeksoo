import { ReactNode, HTMLAttributes } from 'react';
export interface DropdownRootProps {
    /** Children (Dropdown.Select, Dropdown.ComboBox) */
    children: ReactNode;
    /** Controlled value */
    value?: string;
    /** Default value */
    defaultValue?: string;
    /** Change handler */
    onChange?: (value: string) => void;
    /** Disabled state */
    disabled?: boolean;
}
export interface DropdownSelectProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'> {
    /** Placeholder text */
    placeholder?: string;
    /** Children (Dropdown.Option) */
    children: ReactNode;
    /** Size variant */
    size?: 'sm' | 'md';
    /** Error state */
    error?: boolean;
    /** Full width */
    fullWidth?: boolean;
    /** Width */
    width?: 'sm' | 'md' | 'lg' | number;
}
export interface DropdownOptionProps extends HTMLAttributes<HTMLDivElement> {
    /** Option value */
    value: string;
    /** Option label (defaults to children) */
    label?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Children */
    children: ReactNode;
}
export type DropdownDividerProps = HTMLAttributes<HTMLDivElement>;
export interface DropdownGroupProps extends HTMLAttributes<HTMLDivElement> {
    /** Group label */
    label?: string;
    /** Children */
    children: ReactNode;
}
export declare function DropdownRoot({ children, value: controlledValue, defaultValue, onChange, disabled, }: DropdownRootProps): import("react/jsx-runtime").JSX.Element;
export declare const DropdownSelect: import('react').ForwardRefExoticComponent<DropdownSelectProps & import('react').RefAttributes<HTMLButtonElement>>;
export declare function DropdownOption({ value, label, disabled, children, className, ...props }: DropdownOptionProps): import("react/jsx-runtime").JSX.Element;
export declare function DropdownDivider({ className, ...props }: DropdownDividerProps): import("react/jsx-runtime").JSX.Element;
export declare function DropdownGroup({ label, children, className, ...props }: DropdownGroupProps): import("react/jsx-runtime").JSX.Element;
export declare const Dropdown: {
    Root: typeof DropdownRoot;
    Select: import('react').ForwardRefExoticComponent<DropdownSelectProps & import('react').RefAttributes<HTMLButtonElement>>;
    Option: typeof DropdownOption;
    Divider: typeof DropdownDivider;
    Group: typeof DropdownGroup;
};
export default Dropdown;
