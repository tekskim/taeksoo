import { forwardRef, type HTMLAttributes } from 'react';
import { twMerge } from '../../utils/cn';

/* ----------------------------------------
   Skeleton Types
   ---------------------------------------- */

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

/* ----------------------------------------
   Skeleton Component
   ---------------------------------------- */

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      width,
      height,
      animation = 'pulse',
      count = 1,
      gap = 8,
      loading = true,
      children,
      size,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    // If not loading, show children
    if (!loading && children) {
      return <>{children}</>;
    }

    // Base styles
    const baseStyles = [
      'bg-[var(--color-surface-muted)]',
      animation === 'pulse' && 'animate-pulse',
      animation === 'wave' && 'animate-shimmer',
    ]
      .filter(Boolean)
      .join(' ');

    // Variant-specific styles
    const variantStyles: Record<SkeletonVariant, string> = {
      text: 'rounded-[var(--radius-sm)]',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      rounded: 'rounded-[var(--radius-md)]',
    };

    // Calculate dimensions
    const getWidth = () => {
      if (width) return typeof width === 'number' ? `${width}px` : width;
      if (variant === 'circular' && size) return `${size}px`;
      if (variant === 'text') return '100%';
      return undefined;
    };

    const getHeight = () => {
      if (height) return typeof height === 'number' ? `${height}px` : height;
      if (variant === 'circular' && size) return `${size}px`;
      if (variant === 'text') return '1em';
      return undefined;
    };

    const skeletonStyle = {
      width: getWidth(),
      height: getHeight(),
      ...style,
    };

    // Render multiple skeletons if count > 1
    if (count > 1) {
      return (
        <div ref={ref} className={twMerge('flex flex-col', className)} style={{ gap }} {...props}>
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className={twMerge(baseStyles, variantStyles[variant])}
              style={{
                ...skeletonStyle,
                // Last item can be shorter for text variant
                width: variant === 'text' && index === count - 1 ? '80%' : skeletonStyle.width,
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={twMerge(baseStyles, variantStyles[variant], className)}
        style={skeletonStyle}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

/* ----------------------------------------
   Skeleton.Text - Preset for text content
   ---------------------------------------- */

export interface SkeletonTextProps extends Omit<SkeletonProps, 'variant'> {
  /** Number of lines */
  lines?: number;
}

export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, ...props }, ref) => {
    return <Skeleton ref={ref} variant="text" count={lines} height={16} {...props} />;
  }
);

SkeletonText.displayName = 'SkeletonText';

/* ----------------------------------------
   Skeleton.Avatar - Preset for avatars
   ---------------------------------------- */

export interface SkeletonAvatarProps extends Omit<SkeletonProps, 'variant'> {
  /** Avatar size */
  size?: 'sm' | 'md' | 'lg' | number;
}

const avatarSizes = {
  sm: 32,
  md: 40,
  lg: 56,
};

export const SkeletonAvatar = forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ size = 'md', ...props }, ref) => {
    const sizeValue = typeof size === 'number' ? size : avatarSizes[size];
    return <Skeleton ref={ref} variant="circular" size={sizeValue} {...props} />;
  }
);

SkeletonAvatar.displayName = 'SkeletonAvatar';

/* ----------------------------------------
   Skeleton.Button - Preset for buttons
   ---------------------------------------- */

export interface SkeletonButtonProps extends Omit<SkeletonProps, 'variant'> {
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
}

const buttonSizes = {
  sm: { width: 64, height: 28 },
  md: { width: 80, height: 32 },
  lg: { width: 96, height: 40 },
};

export const SkeletonButton = forwardRef<HTMLDivElement, SkeletonButtonProps>(
  ({ size = 'md', ...props }, ref) => {
    return (
      <Skeleton
        ref={ref}
        variant="rounded"
        width={buttonSizes[size].width}
        height={buttonSizes[size].height}
        {...props}
      />
    );
  }
);

SkeletonButton.displayName = 'SkeletonButton';

/* ----------------------------------------
   Skeleton.Image - Preset for images
   ---------------------------------------- */

export interface SkeletonImageProps extends Omit<SkeletonProps, 'variant'> {
  /** Aspect ratio (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
}

export const SkeletonImage = forwardRef<HTMLDivElement, SkeletonImageProps>(
  ({ aspectRatio = '16/9', width = '100%', ...props }, ref) => {
    return (
      <Skeleton ref={ref} variant="rounded" width={width} style={{ aspectRatio }} {...props} />
    );
  }
);

SkeletonImage.displayName = 'SkeletonImage';

/* ----------------------------------------
   Skeleton.Card - Preset for cards
   ---------------------------------------- */

export interface SkeletonCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Show avatar */
  avatar?: boolean;
  /** Number of text lines */
  lines?: number;
  /** Show image placeholder */
  image?: boolean;
}

export const SkeletonCard = forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ avatar = true, lines = 3, image = false, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          'flex flex-col gap-4 p-4',
          'bg-[var(--color-surface-default)]',
          'border border-[var(--color-border-default)]',
          'rounded-[var(--radius-lg)]',
          className
        )}
        {...props}
      >
        {image && <SkeletonImage />}
        {avatar && (
          <div className="flex items-center gap-3">
            <SkeletonAvatar size="md" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton variant="text" width="60%" height={16} />
              <Skeleton variant="text" width="40%" height={12} />
            </div>
          </div>
        )}
        <SkeletonText lines={lines} />
      </div>
    );
  }
);

SkeletonCard.displayName = 'SkeletonCard';

/* ----------------------------------------
   Skeleton.Table - Preset for table rows
   ---------------------------------------- */

export interface SkeletonTableProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of rows */
  rows?: number;
  /** Number of columns */
  columns?: number;
}

export const SkeletonTable = forwardRef<HTMLDivElement, SkeletonTableProps>(
  ({ rows = 5, columns = 4, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={twMerge('flex flex-col gap-2', className)} {...props}>
        {/* Header */}
        <div className="flex gap-4 py-2 border-b border-[var(--color-border-default)]">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton
              key={`header-${i}`}
              variant="text"
              width={i === 0 ? '20%' : `${60 / (columns - 1)}%`}
              height={14}
            />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex gap-4 py-3 border-b border-[var(--color-border-subtle)]"
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                variant="text"
                width={colIndex === 0 ? '20%' : `${60 / (columns - 1)}%`}
                height={16}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
);

SkeletonTable.displayName = 'SkeletonTable';

export default Skeleton;
