import React from 'react';

export type IconWeight =
  | 'thin'
  | 'light'
  | 'regular'
  | 'bold'
  | 'fill'
  | 'duotone';

// Icon size presets or custom numbers
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

// Icon variants for different use cases
export type IconVariant =
  | 'primary' // Main action/brand color
  | 'secondary' // Secondary action
  | 'success' // Success/positive state
  | 'warning' // Warning/caution state
  | 'error' // Error/danger state
  | 'info' // Information state
  | 'muted' // Subtle/disabled state
  | 'brand' // Thaki brand purple
  | 'inverse' // For dark backgrounds
  // Service-specific variants
  | 'compute' // Compute service (orange/red)
  | 'container' // Container service (blue)
  | 'mlops'; // MLOps service (green)

// Duotone color configuration
export interface DuotoneColors {
  primary: string;
  secondary: string;
}

// Main Icon component props
export interface IconProps {
  children: React.ReactElement<{
    size?: number;
    weight?: IconWeight;
    stroke?: number;
    color?: string;
    mirrored?: boolean;
  }>;

  /** Icon variant - applies predefined styles */
  variant?: IconVariant;

  /** Icon size - can be preset string or number */
  size?: IconSize;

  /** Icon weight - overrides variant weight */
  weight?: IconWeight;

  /** Icon color - overrides variant primary color */
  color?: string;

  /** Custom duotone colors - only works with duotone weight. Overrides variant colors */
  duotone?: DuotoneColors;

  /** Mirror icon for RTL - overrides global RTL context */
  mirrored?: boolean;

  /** stroke 적용 여부 (기본값: true). weight="fill"일 때 false로 설정하면 stroke 제거 */
  withStroke?: boolean;

  /** Additional CSS class */
  className?: string;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Accessibility label */
  'aria-label'?: string;

  /** Whether the icon is decorative */
  'aria-hidden'?: boolean;

  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}
