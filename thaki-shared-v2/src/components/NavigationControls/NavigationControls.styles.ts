import { cva } from 'class-variance-authority';

/**
 * 네비게이션 컨트롤 컨테이너 스타일
 *
 * Figma 디자인 토큰:
 * - bg: var(--color-base-white) = #ffffff
 * - border: var(--color-border-strong) = #cbd5e1
 * - padding: var(--space-1) = 4px
 * - gap: var(--space-1) = 4px
 * - border-radius: 6px
 */
export const navigationContainerStyles = [
  'inline-flex items-center',
  'gap-0.5',
].join(' ');

/**
 * 네비게이션 버튼 스타일
 *
 * Figma 디자인 토큰:
 * - size: 16px x 16px (아이콘 크기에 맞춤)
 */
export const navigationButtonStyles = cva(
  [
    'flex items-center justify-center',
    'size-7 p-0',
    'bg-transparent border-none cursor-pointer',
    'rounded',
    'text-text-muted',
    'transition-colors duration-150',
    'focus:outline-none focus-visible:ring-1 focus-visible:ring-focus',
  ],
  {
    variants: {
      disabled: {
        true: 'opacity-40 cursor-not-allowed',
        false: 'hover:bg-surfaceSubtle hover:text-text',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

/**
 * 구분선 스타일
 *
 * Figma 디자인 토큰:
 * - bg: var(--color-border-default) = #e2e8f0
 * - width: 0.5px (1px for practical use)
 * - height: 8px
 */
export const dividerStyles = 'w-px h-2 bg-border shrink-0';
