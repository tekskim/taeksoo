import React, { memo, type ComponentType } from 'react';

export interface StaticAppIconProps {
  size?: number;
  className?: string;
}

export function createStaticAppIcon(
  src: string,
  appName: string
): ComponentType<StaticAppIconProps> {
  const StaticAppIcon = ({
    size = 24,
    className,
  }: StaticAppIconProps): React.ReactElement => (
    <img
      src={src}
      alt={`${appName} icon`}
      width={size}
      height={size}
      draggable={false}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );

  StaticAppIcon.displayName = `AppIcon(${appName})`;
  return memo(StaticAppIcon);
}
