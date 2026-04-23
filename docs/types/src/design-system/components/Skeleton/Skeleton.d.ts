import { HTMLAttributes } from 'react';
export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    /** Skeleton variant */
    variant?: SkeletonVariant;
    /** Width (CSS value or number for px) */
    width?: string | number;
    /** Height (CSS value or number for px) */
    height?: string | number;
    /** Animation type */
    animation?: 'pulse' | 'wave' | 'none';
    /** Number of skeleton rows (for text variant) */
    count?: number;
    /** Gap between rows (for count > 1) */
    gap?: number;
    /** Whether to show the skeleton */
    loading?: boolean;
    /** Children to show when not loading */
    children?: React.ReactNode;
    /** Circle size (for circular variant) */
    size?: number;
}
export declare const Skeleton: import('react').ForwardRefExoticComponent<SkeletonProps & import('react').RefAttributes<HTMLDivElement>>;
export interface SkeletonTextProps extends Omit<SkeletonProps, 'variant'> {
    /** Number of lines */
    lines?: number;
}
export declare const SkeletonText: import('react').ForwardRefExoticComponent<SkeletonTextProps & import('react').RefAttributes<HTMLDivElement>>;
export interface SkeletonAvatarProps extends Omit<SkeletonProps, 'variant'> {
    /** Avatar size */
    size?: 'sm' | 'md' | 'lg' | number;
}
export declare const SkeletonAvatar: import('react').ForwardRefExoticComponent<SkeletonAvatarProps & import('react').RefAttributes<HTMLDivElement>>;
export interface SkeletonButtonProps extends Omit<SkeletonProps, 'variant'> {
    /** Button size */
    size?: 'sm' | 'md' | 'lg';
}
export declare const SkeletonButton: import('react').ForwardRefExoticComponent<SkeletonButtonProps & import('react').RefAttributes<HTMLDivElement>>;
export interface SkeletonImageProps extends Omit<SkeletonProps, 'variant'> {
    /** Aspect ratio (e.g., "16/9", "4/3", "1/1") */
    aspectRatio?: string;
}
export declare const SkeletonImage: import('react').ForwardRefExoticComponent<SkeletonImageProps & import('react').RefAttributes<HTMLDivElement>>;
export interface SkeletonCardProps extends HTMLAttributes<HTMLDivElement> {
    /** Show avatar */
    avatar?: boolean;
    /** Number of text lines */
    lines?: number;
    /** Show image placeholder */
    image?: boolean;
}
export declare const SkeletonCard: import('react').ForwardRefExoticComponent<SkeletonCardProps & import('react').RefAttributes<HTMLDivElement>>;
export interface SkeletonTableProps extends HTMLAttributes<HTMLDivElement> {
    /** Number of rows */
    rows?: number;
    /** Number of columns */
    columns?: number;
}
export declare const SkeletonTable: import('react').ForwardRefExoticComponent<SkeletonTableProps & import('react').RefAttributes<HTMLDivElement>>;
export default Skeleton;
