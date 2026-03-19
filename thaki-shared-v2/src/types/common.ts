type ArrayToUnion<T extends readonly unknown[]> = T[number];

/**
 * Component color variants
 * - 'primary' = Main action (blue)
 * - 'secondary' = Secondary action (gray)
 * - 'tertiary' = Tertiary action (purple)
 * - 'success' = Success state (green)
 * - 'error' = Error/Danger state (red)
 * - 'warning' = Warning state (yellow)
 * - 'muted' = Subtle/disabled state (light gray)
 */
export const ComponentVariants = [
  'primary',   // Main action (blue)
  'secondary', // Secondary action (gray)
  'tertiary',  // Tertiary action (purple)
  'success',   // Success state (green)
  'error',     // Error/Danger state (red)
  'warning',   // Warning state (yellow)
  'muted',     // Subtle/disabled state (light gray)
] as const;
export type ComponentVariant = ArrayToUnion<typeof ComponentVariants>;

/**
 * Component appearance styles
 * - 'solid' = Filled background
 * - 'outline' = Border only, transparent background
 * - 'ghost' = No border, transparent background
 */
export const ComponentAppearances = [
  'solid',   // Filled background
  'outline', // Border only, transparent background
  'ghost',   // No border, transparent background
] as const;
export type ComponentAppearance = ArrayToUnion<typeof ComponentAppearances>;

/**
 * Component size options
 * - 'xs' = Extra small (24px height)
 * - 'sm' = Small (28px height)
 * - 'md' = Medium (32px height) - default
 * - 'lg' = Large (36px height)
 */
export const ComponentSizes = [
  'xs', // Extra small (24px)
  'sm', // Small (28px)
  'md', // Medium (32px) - default
  'lg', // Large (36px)
] as const;
export type ComponentSize = ArrayToUnion<typeof ComponentSizes>;
