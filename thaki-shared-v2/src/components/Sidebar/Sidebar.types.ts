import type { IconProps } from '../Icon';

/**
 * 아이콘 컴포넌트 타입
 */
export type SidebarIconComponent = React.ComponentType<Omit<IconProps, 'children'>>;

/**
 * 메뉴 아이템 인터페이스
 */
export interface MenuItem {
  /** 고유 ID */
  id: string;
  /** 표시될 라벨 */
  label: string;
  /** 네비게이션 경로 */
  path: string;
  /** 아이콘 컴포넌트 (선택적) */
  icon?: SidebarIconComponent;
}

/**
 * 사이드바 섹션 인터페이스
 */
export interface SidebarSection {
  /** 고유 ID */
  id: string;
  /** 섹션 라벨 */
  label: string;
  /** 섹션 아이콘 (선택적) */
  icon?: SidebarIconComponent;
  /** 섹션 직접 경로 (children이 없는 고정 메뉴용) */
  path?: string;
  /** 하위 메뉴 아이템들 */
  children?: MenuItem[];
}

/**
 * 사이드바 Props 인터페이스
 */
export interface SidebarProps {
  /** 로고 정보 (선택적) */
  logo?: {
    src: string;
    alt: string;
  };
  /** 사이드바 토글 핸들러 (선택적) */
  onToggleSidebar?: () => void;
  /** 사이드바 축소 상태 (선택적) */
  isCollapsed?: boolean;
  /** 메뉴 내용 */
  children: React.ReactNode;
}
