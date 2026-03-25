import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cn } from '../../services/utils/cn';
import { Icon } from '../Icon';
import type { IconWeight } from '../Icon/types';
import { badgeVariants } from './Badge.styles';

type BadgeSize = 'sm' | 'md';
type BadgeType = 'subtle' | 'solid';
type BadgeTheme = 'blu' | 'red' | 'gry' | 'gre' | 'ylw' | 'white';
type BadgeLayout = 'text-only' | 'left-icon' | 'right-icon';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  theme?: BadgeTheme;
  size?: BadgeSize;
  type?: BadgeType;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** @deprecated Use leftIcon/rightIcon instead */
  layout?: BadgeLayout;
  /** @deprecated Use leftIcon/rightIcon instead */
  icon?: ReactElement<{
    size?: number;
    weight?: IconWeight;
    color?: string;
    mirrored?: boolean;
  }>;
  className?: string;
}

const Badge = ({
  children,
  theme = 'gry',
  size = 'md',
  type = 'subtle',
  leftIcon: rawLeftIcon,
  rightIcon: rawRightIcon,
  layout = 'text-only',
  icon,
  className,
  ...props
}: Props): ReactElement => {
  const leftIcon = layout === 'left-icon' && icon ? icon : rawLeftIcon;
  const rightIcon = layout === 'right-icon' && icon ? icon : rawRightIcon;

  const iconSize = size === 'sm' ? 12 : 14;

  const renderIcon = (iconNode: ReactNode) => (
    <span className="flex items-center shrink-0">
      <Icon size={iconSize}>{iconNode}</Icon>
    </span>
  );

  return (
    <span className={cn(badgeVariants({ size, theme, type }), className)} {...props}>
      {leftIcon && renderIcon(leftIcon)}
      <span className="flex items-center min-w-0">{children}</span>
      {rightIcon && renderIcon(rightIcon)}
    </span>
  );
};

export type { BadgeTheme, BadgeLayout, BadgeSize, BadgeType };
export default Badge;
