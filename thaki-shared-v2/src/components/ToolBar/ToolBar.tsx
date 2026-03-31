import React, { memo, type ReactNode } from 'react';
import { cn } from '../../services';
import { Breadcrumb, type BreadcrumbItem } from '../Breadcrumb';
import { SidebarIcon } from '../Icon/svg/wrapped';
import { NavigationControls } from '../NavigationControls';
import {
  sidebarToggleStyles,
  toolBarLeftStyles,
  toolBarRightStyles,
  toolBarStyles,
} from './ToolBar.styles';

interface NavigationConfig {
  /** 뒤로가기 가능 여부 */
  canGoBack: boolean;
  /** 앞으로가기 가능 여부 */
  canGoForward: boolean;
  /** 뒤로가기 핸들러 */
  onGoBack: () => void;
  /** 앞으로가기 핸들러 */
  onGoForward: () => void;
}

interface ToolBarProps {
  /** 브레드크럼 아이템 배열 */
  breadcrumbItems: BreadcrumbItem[];
  /** 네비게이션 컨트롤 설정 */
  navigation: NavigationConfig;
  /** 사이드바 상태 (true: 펼침, false: 접힘) */
  isSidebarOpen: boolean;
  /** 사이드바 토글 핸러 (제공되지 않으면 토글 버튼 숨김) */
  onToggleSidebar: () => void;
  /** 언어 선택 버튼 */
  langButton: ReactNode;
  /** 우측 액션 영역 */
  rightActions?: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 전체 너비 적용 여부 */
  fullWidth?: boolean;
}

/**
 * ToolBar 컴포넌트
 *
 * 앱 상단에 위치하는 툴바로, 네비게이션 컨트롤, 브레드크럼, 알림 센터 버튼을 포함합니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <ToolBar
 *   breadcrumbItems={[
 *     { label: 'Home', onClick: () => navigate('/') },
 *     { label: 'Instances' },
 *   ]}
 *   navigation={{
 *     canGoBack: true,
 *     canGoForward: false,
 *     onGoBack: () => {},
 *     onGoForward: () => {},
 *   }}
 * />
 *
 * // 사이드바 토글 포함 (사이드바가 접혀 있을 때)
 * <ToolBar
 *   isSidebarOpen={false}
 *   onToggleSidebar={toggleSidebar}
 *   breadcrumbItems={breadcrumbs}
 *   navigation={nav}
 * />
 * ```
 */
const ToolBar: React.FC<ToolBarProps> = memo(
  ({
    breadcrumbItems,
    navigation,
    isSidebarOpen = true,
    onToggleSidebar,
    langButton,
    rightActions,
    className,
    fullWidth = true,
  }) => {
    const showBreadcrumb = breadcrumbItems.length > 0;

    return (
      <div className={cn(toolBarStyles({ fullWidth }), className)}>
        {/* Left section: Sidebar toggle + Navigation + Breadcrumb */}
        <div className={toolBarLeftStyles}>
          {/* 사이드바 토글 버튼 (사이드바가 접혀 있을 때만 표시) */}
          {!isSidebarOpen && (
            <button
              type="button"
              className={cn(sidebarToggleStyles())}
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              <SidebarIcon size={14} variant="secondary" />
            </button>
          )}

          {/* 네비게이션 컨트롤 (뒤로가기/앞으로가기) */}
          <NavigationControls {...navigation} />

          {/* 브레드크럼 */}
          {showBreadcrumb && <Breadcrumb items={breadcrumbItems} />}
        </div>

        {/* Right section: Custom actions + Notification */}
        <div className={toolBarRightStyles}>
          {rightActions}
          {langButton}

          {/* 알림 센터 버튼 */}
          <>
            {/* <button
              type="button"
              className={cn(
                'notification-button',
                actionButtonStyles({
                  hasNotification: hasUnread,
                })
              )}
              onClick={handleNotificationClick}
              aria-label="Notifications"
              title="Notifications"
              aria-expanded={isNotificationPanelOpen}
            >
              <NotificationIcon size={16} variant="secondary" />
              {hasUnread && (
                <span className={notificationBadgeStyles} aria-hidden="true" />
              )}
            </button> */}

            {/* Built-in Notification Panel */}
            {/* <NotificationPanel
              isOpen={isNotificationPanelOpen}
              onClose={() => setIsNotificationPanelOpen(false)}
            /> */}
          </>
        </div>
      </div>
    );
  }
);

ToolBar.displayName = 'ToolBar';

export default ToolBar;
export type { NavigationConfig, ToolBarProps };
