import { cva } from 'class-variance-authority';

export const rangeContainerStyles = cva('inline-flex w-full', {
  variants: {
    disabled: {
      true: 'opacity-50 pointer-events-none',
    },
  },
});

export const dualRangeContainerStyles = cva('relative h-10 flex items-center', {
  variants: {
    disabled: {
      true: 'opacity-50 pointer-events-none',
    },
  },
});

export const trackStyles =
  'absolute top-1/2 -translate-y-1/2 w-full h-1.5 bg-border-muted rounded-full pointer-events-none';

export const trackActiveStyles =
  'absolute h-full bg-primary rounded-full transition-[left,right] duration-100 ease-out';

export const inputWrapperStyles = cva('absolute top-0 left-0 w-full h-full flex items-center', {
  variants: {
    type: {
      min: 'z-[1]',
      max: 'z-[2]',
    },
  },
});

/**
 * Range input base styles with browser pseudo-element styling via Tailwind arbitrary variants
 */

// Base input styles
const rangeInputBase = 'w-full h-4 appearance-none bg-transparent cursor-pointer outline-none';

// Webkit track styling (uses CSS variable --range-progress for gradient)
const webkitTrack = [
  '[&::-webkit-slider-runnable-track]:w-full',
  '[&::-webkit-slider-runnable-track]:h-1.5',
  '[&::-webkit-slider-runnable-track]:rounded-full',
  '[&::-webkit-slider-runnable-track]:[background:linear-gradient(to_right,var(--semantic-color-primary)_0%,var(--semantic-color-primary)_var(--range-progress,0%),var(--semantic-color-borderMuted)_var(--range-progress,0%),var(--semantic-color-borderMuted)_100%)]',
].join(' ');

// Firefox track styling
const mozTrack = [
  '[&::-moz-range-track]:w-full',
  '[&::-moz-range-track]:h-1.5',
  '[&::-moz-range-track]:bg-border-muted',
  '[&::-moz-range-track]:rounded-full',
  '[&::-moz-range-progress]:h-1.5',
  '[&::-moz-range-progress]:bg-primary',
  '[&::-moz-range-progress]:rounded-full',
].join(' ');

// Webkit thumb styling
const webkitThumb = [
  '[&::-webkit-slider-thumb]:appearance-none',
  '[&::-webkit-slider-thumb]:w-4',
  '[&::-webkit-slider-thumb]:h-4',
  '[&::-webkit-slider-thumb]:bg-surface-elevated',
  '[&::-webkit-slider-thumb]:border-[3px]',
  '[&::-webkit-slider-thumb]:border-solid',
  '[&::-webkit-slider-thumb]:border-primary',
  '[&::-webkit-slider-thumb]:rounded-full',
  '[&::-webkit-slider-thumb]:cursor-grab',
  '[&::-webkit-slider-thumb]:shadow-sm',
  '[&::-webkit-slider-thumb]:-mt-[5px]',
  '[&::-webkit-slider-thumb]:transition-[box-shadow,transform]',
  '[&::-webkit-slider-thumb]:duration-200',
  '[&::-webkit-slider-thumb]:ease-out',
].join(' ');

// Webkit thumb hover/active states
const webkitThumbStates = [
  'hover:[&::-webkit-slider-thumb]:shadow-md',
  'hover:[&::-webkit-slider-thumb]:scale-110',
  'active:[&::-webkit-slider-thumb]:cursor-grabbing',
  'active:[&::-webkit-slider-thumb]:shadow-lg',
  'active:[&::-webkit-slider-thumb]:scale-[1.15]',
].join(' ');

// Firefox thumb styling
const mozThumb = [
  '[&::-moz-range-thumb]:w-4',
  '[&::-moz-range-thumb]:h-4',
  '[&::-moz-range-thumb]:bg-surface-elevated',
  '[&::-moz-range-thumb]:border-[3px]',
  '[&::-moz-range-thumb]:border-solid',
  '[&::-moz-range-thumb]:border-primary',
  '[&::-moz-range-thumb]:rounded-full',
  '[&::-moz-range-thumb]:cursor-grab',
  '[&::-moz-range-thumb]:shadow-sm',
  '[&::-moz-range-thumb]:transition-[box-shadow,transform]',
  '[&::-moz-range-thumb]:duration-200',
  '[&::-moz-range-thumb]:ease-out',
].join(' ');

// Firefox thumb hover/active states
const mozThumbStates = [
  'hover:[&::-moz-range-thumb]:shadow-md',
  'hover:[&::-moz-range-thumb]:scale-110',
  'active:[&::-moz-range-thumb]:cursor-grabbing',
  'active:[&::-moz-range-thumb]:shadow-lg',
  'active:[&::-moz-range-thumb]:scale-[1.15]',
].join(' ');

// Focus visible states
const focusStyles = [
  'focus-visible:outline-2',
  'focus-visible:outline-focus',
  'focus-visible:outline-offset-1',
  'focus-visible:rounded-md',
  'focus-visible:[&::-webkit-slider-thumb]:shadow-[0_0_0_var(--primitive-space-4)_var(--semantic-color-primarySubtle)]',
  'focus-visible:[&::-moz-range-thumb]:shadow-[0_0_0_var(--primitive-space-4)_var(--semantic-color-primarySubtle)]',
].join(' ');

// Disabled states
const disabledStyles = [
  'disabled:cursor-not-allowed',
  'disabled:[&::-webkit-slider-thumb]:cursor-not-allowed',
  'disabled:[&::-moz-range-thumb]:cursor-not-allowed',
].join(' ');

// Combined range input styles
export const rangeInputStyles = [
  rangeInputBase,
  webkitTrack,
  mozTrack,
  webkitThumb,
  webkitThumbStates,
  mozThumb,
  mozThumbStates,
  focusStyles,
  disabledStyles,
].join(' ');

// Dual range mode - transparent track for overlay inputs
export const dualRangeInputStyles = [
  rangeInputBase,
  // Override track to transparent for dual mode
  '[&::-webkit-slider-runnable-track]:w-full',
  '[&::-webkit-slider-runnable-track]:h-1.5',
  '[&::-webkit-slider-runnable-track]:bg-transparent',
  '[&::-webkit-slider-runnable-track]:border-none',
  '[&::-moz-range-track]:w-full',
  '[&::-moz-range-track]:h-1.5',
  '[&::-moz-range-track]:bg-transparent',
  '[&::-moz-range-track]:border-none',
  // Keep thumb styles
  webkitThumb,
  webkitThumbStates,
  mozThumb,
  mozThumbStates,
  focusStyles,
  disabledStyles,
].join(' ');
