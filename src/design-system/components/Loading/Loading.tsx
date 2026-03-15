import React from 'react';
import { IconLoader2 } from '@tabler/icons-react';
import { twMerge } from '../../utils/cn';

/* ----------------------------------------
   Types
   ---------------------------------------- */

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

/* ----------------------------------------
   Size Configurations
   ---------------------------------------- */

const spinnerSizes: Record<LoadingSize, { icon: number; text: string; gap: string }> = {
  sm: { icon: 16, text: 'text-body-sm leading-4', gap: 'gap-1.5' },
  md: { icon: 22, text: 'text-body-md leading-4', gap: 'gap-2' },
  lg: { icon: 32, text: 'text-body-lg leading-5', gap: 'gap-3' },
};

/* ----------------------------------------
   Loading Component
   ---------------------------------------- */

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  text = 'Loading',
  description,
  progress = 0,
  statusText,
  buttonLabel = 'Loading',
  className = '',
}) => {
  const sizeConfig = spinnerSizes[size];

  // Spinner variant
  if (variant === 'spinner') {
    return (
      <div
        data-figma-name="Loading"
        className={twMerge('flex flex-col items-center', sizeConfig.gap, className)}
      >
        <IconLoader2
          size={sizeConfig.icon}
          stroke={1.5}
          className="text-[var(--color-action-primary)] animate-spin"
        />
        {text && (
          <p
            className={twMerge(
              'font-normal text-[var(--color-text-subtle)] text-center',
              sizeConfig.text
            )}
          >
            {text}
          </p>
        )}
      </div>
    );
  }

  // Progress variant (gage)
  if (variant === 'progress') {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
      <div
        data-figma-name="Loading"
        className={twMerge('flex flex-col items-center gap-3', className)}
      >
        {/* Title and Description */}
        <div className="flex flex-col items-center gap-2 text-[var(--color-text-default)]">
          <p className="font-medium text-body-lg leading-5">{text}</p>
          {description && (
            <p className="font-normal text-body-md leading-4 text-center">{description}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col items-center gap-2 w-[300px]">
          <div className="relative w-full h-1">
            {/* Background */}
            <div className="absolute inset-0 bg-[var(--color-border-subtle)] rounded-lg" />
            {/* Filled */}
            <div
              className="absolute inset-y-0 left-0 bg-[var(--color-state-info)] rounded-lg transition-all duration-300"
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
          {statusText && (
            <p className="font-normal text-body-md leading-4 text-[var(--color-text-subtle)] text-center">
              {statusText}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Button variant (loading-button)
  if (variant === 'button') {
    return (
      <div data-figma-name="Loading" className={twMerge('inline-flex', className)}>
        <button
          type="button"
          disabled
          className={twMerge(
            'flex items-center justify-center gap-1.5',
            'min-w-[80px] px-3 py-2',
            'bg-[var(--color-border-strong)] rounded-[var(--primitive-radius-md)]',
            'cursor-not-allowed'
          )}
        >
          <IconLoader2 size={12} stroke={2} className="text-white animate-spin" />
          <span className="font-medium text-body-md leading-4 text-white text-center">
            {buttonLabel}
          </span>
        </button>
      </div>
    );
  }

  return null;
};

export default Loading;
