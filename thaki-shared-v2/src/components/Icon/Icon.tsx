import React, {
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
} from 'react';
import { useRTL } from '../../services';
import {
  DEFAULT_COLOR,
  DEFAULT_SIZE,
  DEFAULT_WEIGHT,
  ICON_SIZES,
  ICON_VARIANTS,
} from './consts';
import type { DuotoneColors, IconProps, IconVariant, IconWeight } from './types';

const WEIGHT_TO_STROKE: Record<IconWeight, number> = {
  thin: 1,
  light: 1.25,
  regular: 1.5,
  bold: 2,
  fill: 0,
  duotone: 1.5,
};

/**
 * [Design System] Icon wrapper component
 *
 * Wraps Tabler icons and custom SVG icons with the design system's
 * variant, size, and weight system.
 *
 * @example
 * import { SearchIcon, CloseSmallIcon, ChevronDownIcon } from '@thaki/shared';
 *
 * <SearchIcon variant="primary" size="md" />
 * <CloseSmallIcon variant="muted" size="sm" />
 */
export const Icon = ({
  children,
  variant,
  size = DEFAULT_SIZE,
  weight,
  color,
  duotone,
  mirrored,
  withStroke,
  className,
  style,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  onClick,
}: IconProps): ReactElement | null => {
  const { isRTL } = useRTL();

  // Validate children prop
  if (!children || !isValidElement(children)) {
    console.error(
      'Icon component requires a valid React element as children (e.g., <Icon><House /></Icon>)'
    );
    return null;
  }

  // Get variant configuration
  const variantConfig = variant
    ? ICON_VARIANTS[variant as IconVariant]
    : undefined;

  // Resolve final props with priority: explicit props > variant > defaults
  const finalSize = typeof size === 'number' ? size : ICON_SIZES[size];
  const finalWeight = weight || DEFAULT_WEIGHT;
  const finalMirrored = mirrored !== undefined ? mirrored : isRTL;

  // Determine colors based on weight and variant
  let finalColor: string;
  let finalStyle = style;

  if (finalWeight === 'duotone') {
    // Duotone mode: use primary + secondary colors
    let duotoneColors: DuotoneColors;

    if (duotone) {
      // Custom duotone colors provided
      duotoneColors = duotone;
    } else if (variantConfig) {
      // Use variant's duotone colors
      duotoneColors = {
        primary: variantConfig.primaryColor,
        secondary: variantConfig.secondaryColor,
      };
    } else {
      // Fallback to current color
      duotoneColors = {
        primary: DEFAULT_COLOR,
        secondary: DEFAULT_COLOR,
      };
    }

    finalColor = color || duotoneColors.primary;
    finalStyle = {
      ...style,
      color: finalColor,
      flexShrink: 0,
      ...(finalMirrored && { transform: 'scaleX(-1)' }),
      '--ph-duotone-primary': duotoneColors.primary,
      '--ph-duotone-secondary': duotoneColors.secondary,
    } as React.CSSProperties;
  } else {
    finalColor = color || variantConfig?.primaryColor || DEFAULT_COLOR;
    finalStyle = {
      ...style,
      color: finalColor,
      flexShrink: 0,
      ...(finalMirrored && { transform: 'scaleX(-1)' }),
    } as CSSProperties;
  }

  const childProps = children.props as {
    className?: string;
    style?: CSSProperties;
    ['data-thaki-icon']?: string;
  };
  const mergedClassName = [childProps.className, className]
    .filter(Boolean)
    .join(' ');
  const mergedStyle: CSSProperties | undefined = childProps.style
    ? { ...childProps.style, ...finalStyle }
    : finalStyle;
  const dataAttributeValue = childProps['data-thaki-icon'] ?? 'true';

  // Clone the child icon element with resolved props.
  // `stroke` is for Tabler icons (weight→stroke width mapping).
  // `weight` + `withStroke` are for custom SVG wrapper components.
  // RTL mirroring is handled via style transform (scaleX), not mirrored prop.
  const iconElement = cloneElement(children, {
    size: finalSize,
    weight: finalWeight,
    stroke: WEIGHT_TO_STROKE[finalWeight],
    color: finalColor,
    ...(withStroke !== undefined && { withStroke }),
    ...(mergedClassName ? { className: mergedClassName } : {}),
    ...(mergedStyle ? { style: mergedStyle } : {}),
    ...(ariaLabel && { 'aria-label': ariaLabel }),
    ...(ariaHidden !== undefined && { 'aria-hidden': ariaHidden }),
    ...(onClick && { onClick }),
  } as Record<string, unknown>);

  const iconElementWithDataAttribute = isValidElement(iconElement)
    ? cloneElement(iconElement, {
        'data-thaki-icon': dataAttributeValue,
      } as Record<string, unknown>)
    : iconElement;

  return iconElementWithDataAttribute;
};
