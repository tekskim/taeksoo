import React from 'react';
import { cn } from '../../services/utils/cn';
import Layout from '../Layout';
import { sidebarStyles, sidebarContentStyles, sidebarMenuStyles } from './Sidebar.styles';
import type { SidebarProps } from './Sidebar.types';

/**
 * 사이드바 컴포넌트
 *
 * @description
 * 사이드바의 기본 골격을 제공하는 컴포넌트.
 * 헤더(로고 + 토글 버튼)와 메뉴 영역을 포함하며,
 * 메뉴 내용은 children으로 전달받아 렌더링한다.
 *
 */
export const Sidebar = ({ isCollapsed = false, children }: SidebarProps): React.ReactElement => {
  return (
    <aside className={cn(sidebarStyles({ collapsed: isCollapsed }))}>
      <Layout.VStack className={sidebarContentStyles}>
        {/* 메뉴 영역 - children으로 받음 */}
        <div className={sidebarMenuStyles}>{!isCollapsed && children}</div> {/* prettier-ignore */}
      </Layout.VStack>
    </aside>
  );
};

export default Sidebar;
