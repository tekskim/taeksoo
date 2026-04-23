import { InputHTMLAttributes, ReactNode } from 'react';
export type InputSize = 'sm' | 'md';
export type InputSizeAlias = 'xs' | 'lg';
export type InputVariant = 'default' | 'search' | 'code';
export type InputWidth = 'xs' | 'sm' | 'md' | 'lg' | 'half' | 'full';
type FilterProp = RegExp | ((value: string) => string);
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Input field size (also accepts thaki-ui xs, lg) */
    size?: InputSize | InputSizeAlias;
    /** Input variant */
    variant?: InputVariant;
    /** @deprecated Use FormField with label prop instead: <FormField label="Name"><Input /></FormField> */
    label?: string;
    /** @deprecated Use FormField with helperText prop instead: <FormField helperText="Help"><Input /></FormField> */
    helperText?: string;
    /** Error state (boolean) or error message (string). Prefer boolean with FormField errorMessage prop */
    error?: string | boolean;
    /** @deprecated Use width="full" instead */
    fullWidth?: boolean;
    /** Width variant: xs (80px), sm (160px), md (240px), lg (360px), half (50%), full (100%), or number for custom pixel width */
    width?: InputWidth | number;
    /** Left icon/element */
    leftElement?: ReactNode;
    /** Right icon/element */
    rightElement?: ReactNode;
    /** Required field indicator */
    required?: boolean;
    /** @deprecated thaki-ui compatibility - success state (use error={false} instead) */
    success?: boolean;
    /** @deprecated thaki-ui compatibility - input filter (implement in onChange instead) */
    filter?: FilterProp;
    /** @deprecated thaki-ui compatibility - show password toggle (use type="password" with rightElement) */
    showPasswordToggle?: boolean;
}
export declare const Input: import('react').ForwardRefExoticComponent<InputProps & import('react').RefAttributes<HTMLInputElement>>;
export {};
