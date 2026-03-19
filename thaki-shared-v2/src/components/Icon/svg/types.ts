import type React from 'react';
import type { IconWeight } from '../types';

export interface SvgIconProps {
  size?: number | string;
  weight?: IconWeight;
  color?: string;
  mirrored?: boolean;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
}
