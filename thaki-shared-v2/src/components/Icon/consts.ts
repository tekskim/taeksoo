import type { IconVariant, IconSize, IconWeight } from './types';

// Size mapping from string to pixels - semantic.control.icon.size 토큰과 맞춤
export const ICON_SIZES: Record<Exclude<IconSize, number>, number> = {
  xs: 12,
  sm: 16, // semantic.control.icon.size.sm (16px / 1rem)
  md: 24, // semantic.control.icon.size.md (24px / 1.5rem)
  lg: 28, // semantic.control.icon.size.lg (28px / 1.75rem)
  xl: 32,
} as const;

// Variant configuration - 색상 팔레트만 정의 (weight 분리)
export interface VariantConfig {
  // Regular weight에서 사용할 primary color (stroke)
  primaryColor: string;
  // Duotone weight에서 사용할 secondary color (fill)
  secondaryColor: string;
}

export const ICON_VARIANTS: Record<IconVariant, VariantConfig> = {
  // Basic semantic variants (실제 존재하는 토큰 사용)
  primary: {
    primaryColor: 'var(--semantic-color-primary)',
    secondaryColor: 'var(--semantic-color-primaryHover)',
  },
  secondary: {
    primaryColor: 'var(--semantic-color-secondary)',
    secondaryColor: 'var(--semantic-color-secondaryHover)',
  },
  success: {
    primaryColor: 'var(--semantic-color-success)',
    secondaryColor: 'var(--semantic-color-successLight)',
  },
  warning: {
    primaryColor: 'var(--semantic-color-warning)',
    secondaryColor: 'var(--semantic-color-warningLight)',
  },
  error: {
    primaryColor: 'var(--semantic-color-error)',
    secondaryColor: 'var(--semantic-color-errorLight)',
  },
  info: {
    primaryColor: 'var(--semantic-color-info)',
    secondaryColor: 'var(--semantic-color-infoLight)',
  },
  muted: {
    primaryColor: 'var(--semantic-color-muted)',
    secondaryColor: 'var(--semantic-color-mutedLight)',
  },
  inverse: {
    primaryColor: 'var(--semantic-color-textInverse)',
    secondaryColor: 'var(--semantic-color-surface)',
  },

  // Thaki 브랜드 색상 (보라색 - 첨부 이미지 참고)
  brand: {
    primaryColor: 'var(--semantic-color-tertiary)',
    secondaryColor: 'var(--semantic-color-tertiaryHover)',
  },

  // 서비스별 variants (첨부 이미지 참고)
  compute: {
    primaryColor: 'var(--semantic-color-warning)',
    secondaryColor: 'var(--semantic-color-warningLight)',
  },
  container: {
    primaryColor: 'var(--semantic-color-info)', // 파란색 (컨테이너)
    secondaryColor: 'var(--semantic-color-infoLight)', // 연한 파란색
  },
  mlops: {
    primaryColor: 'var(--semantic-color-success)', // 초록색 (MLOps)
    secondaryColor: 'var(--semantic-color-successLight)', // 연한 초록색
  },
} as const;

// Default values
export const DEFAULT_SIZE: IconSize = 'md';
export const DEFAULT_WEIGHT: IconWeight = 'regular';
export const DEFAULT_COLOR = 'var(--semantic-color-text)';
