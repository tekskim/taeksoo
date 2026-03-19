import React, { type MouseEventHandler, type ReactElement } from 'react';
import type { SvgIconProps } from './types';
import styles from './SvgRawIcon.module.css';

export type SvgIconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export type SvgRawIconProps = SvgIconProps & {
  Component: SvgIconComponent;
  /** stroke 적용 여부 (기본값: true). false로 설정하면 stroke 제거 */
  withStroke?: boolean;
};

function resolveMode(weight: SvgIconProps['weight'], withStroke: boolean) {
  if (weight === 'fill' && withStroke) {
    return 'fill-stroke' as const;
  }

  if (weight === 'fill') {
    return 'fill' as const;
  }

  return 'stroke' as const;
}

export default function SvgRawIcon(props: SvgRawIconProps): ReactElement {
  const {
    Component,
    size = 24,
    weight = 'light',
    color = 'currentColor',
    mirrored,
    className,
    style,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
    onClick,
    withStroke = true,
  } = props;

  const mode = resolveMode(weight, withStroke);

  const finalStyle: React.CSSProperties = {
    display: 'inline-block',
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
    lineHeight: 0,
    color,
    ...style,
  };

  if (mirrored) {
    const existingTransform =
      typeof finalStyle.transform === 'string' && finalStyle.transform !== ''
        ? `${finalStyle.transform} scaleX(-1)`
        : 'scaleX(-1)';
    finalStyle.transform = existingTransform;
  }

  const combinedClassName = [styles.root, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      className={combinedClassName}
      data-thaki-svg-mode={mode}
      role={ariaLabel ? 'img' : 'presentation'}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      onClick={onClick as MouseEventHandler<SVGSVGElement>}
      style={finalStyle}
    />
  );
}
