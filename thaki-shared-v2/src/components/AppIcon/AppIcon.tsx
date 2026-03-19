import React, { memo, type ComponentType } from 'react';
import {
  agentIcon,
  aiIcon,
  cloudBuilderIcon,
  computeAdminIcon,
  computeIcon,
  containerIcon,
  iamIcon,
  settingsIcon,
  storageAdminIcon,
  storageIcon,
} from '../../assets/app-icons';

/**
 * App icon names mapped to their image sources
 */
const APP_ICON_MAP = {
  iam: iamIcon,
  compute: computeIcon,
  storage: storageIcon,
  container: containerIcon,
  ai: aiIcon,
  agent: agentIcon,
  settings: settingsIcon,
  'compute-admin': computeAdminIcon,
  'storage-admin': storageAdminIcon,
  'cloud-builder': cloudBuilderIcon,
} as const;

export type AppIconName = keyof typeof APP_ICON_MAP;

export interface AppIconProps {
  /** The app name to display the icon for */
  name: AppIconName;
  /** Size in pixels (default: 24) */
  size?: number;
  /** Additional CSS class */
  className?: string;
}

/**
 * AppIcon component - displays branded app icons
 * Used in AppLayout sidebar header
 *
 * @example
 * <AppIcon name="compute" size={24} />
 */
const AppIcon = memo(
  ({ name, size = 24, className }: AppIconProps): React.ReactElement => {
    const iconSrc = APP_ICON_MAP[name];

    return (
      <img
        src={iconSrc}
        alt={`${name} icon`}
        width={size}
        height={size}
        draggable={false}
        className={className}
        style={{ objectFit: 'contain' }}
      />
    );
  }
);

AppIcon.displayName = 'AppIcon';

/**
 * Factory function to create an AppIcon component for a specific app
 * Returns a component compatible with AppLayoutConfig.AppIcon prop
 *
 * @example
 * const ComputeIcon = createAppIcon('compute');
 * <AppLayout config={{ AppIcon: ComputeIcon, ... }} />
 */
export function createAppIcon(
  name: AppIconName
): ComponentType<{ size?: number; className?: string }> {
  const AppIconComponent = ({
    size = 24,
    className,
  }: {
    size?: number;
    className?: string;
  }): React.ReactElement => (
    <AppIcon name={name} size={size} className={className} />
  );

  AppIconComponent.displayName = `AppIcon(${name})`;
  return memo(AppIconComponent);
}
export { AppIcon };
