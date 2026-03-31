import React from 'react';
import { cn } from '../../services/utils/cn';
import type { IconProps } from '../Icon';
import {
  fixedMenuItemStyles,
  fixedMenuTextStyles,
  submenuItemStyles,
  submenuTextStyles,
} from './Sidebar.styles';
import type { SidebarIconComponent } from './Sidebar.types';

interface SidebarMenuItemProps {
  /** 메뉴 경로 */
  path: string;
  /** 메뉴 라벨 */
  label: string;
  /** 아이콘 컴포넌트 (선택적) */
  icon?: SidebarIconComponent;
  /** 아이콘 props (선택적) */
  iconProps?: Omit<IconProps, 'children'>;
  /** 활성 상태 */
  isActive?: boolean;
  /** 클릭 핸들러 */
  onClick: (path: string, event?: React.MouseEvent) => void;
  /** 서브메뉴 여부 (스타일 변경용) */
  isSubmenu?: boolean;
}

/**
 * 사이드바 메뉴 아이템 컴포넌트
 *
 * @description
 * 사이드바의 개별 메뉴 아이템을 렌더링하는 컴포넌트.
 * 고정 메뉴나 서브메뉴 아이템으로 사용할 수 있다.
 *
 * @example
 * ```tsx
 * <SidebarMenuItem
 *   path="/dashboard"
 *   label="Dashboard"
 *   icon={HomeIcon}
 *   isActive={true}
 *   onClick={handleClick}
 * />
 * ```
 */
export const SidebarMenuItem = ({
  path,
  label,
  icon: IconComponent,
  iconProps,
  isActive = false,
  onClick,
  isSubmenu = false,
}: SidebarMenuItemProps): React.ReactElement => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    onClick(path, event);
  };

  const itemClassName = isSubmenu
    ? cn(submenuItemStyles({ active: isActive }))
    : cn(fixedMenuItemStyles({ active: isActive }));

  const textClassName = isSubmenu
    ? cn(submenuTextStyles({ active: isActive }))
    : cn(fixedMenuTextStyles({ active: isActive }));

  return (
    <button onClick={handleClick} className={itemClassName}>
      {IconComponent && (
        <IconComponent
          {...({
            variant: isActive ? 'primary' : 'secondary',
            size: 16,
            ...iconProps,
          } as Omit<IconProps, 'children'>)}
        />
      )}
      <span className={textClassName}>{label}</span>
    </button>
  );
};

export default SidebarMenuItem;
