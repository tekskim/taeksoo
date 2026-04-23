import { default as React } from 'react';
export type LoadingVariant = 'spinner' | 'progress' | 'button';
export type LoadingSize = 'sm' | 'md' | 'lg';
export interface LoadingProps {
    /** Loading variant */
    variant?: LoadingVariant;
    /** Size */
    size?: LoadingSize;
    /** Loading text */
    text?: string;
    /** Description text (for progress variant) */
    description?: string;
    /** Progress value (0-100) for progress variant */
    progress?: number;
    /** Status text for progress variant */
    statusText?: string;
    /** Button label for button variant */
    buttonLabel?: string;
    /** Custom class name */
    className?: string;
}
export declare const Loading: React.FC<LoadingProps>;
export default Loading;
