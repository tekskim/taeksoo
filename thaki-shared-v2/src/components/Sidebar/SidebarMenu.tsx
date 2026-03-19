import React from 'react';
import { TcAccordion } from '../TcAccordion';
import { ChevronRightIcon } from '../Icon';
import {
  accordionArrowStyles,
  accordionContentStyles,
  accordionHeaderStyles,
  accordionItemStyles,
  accordionTitleStyles,
} from './Sidebar.styles';
import type { SidebarSection } from './Sidebar.types';
import { SidebarMenuItem } from './SidebarMenuItem';

interface SidebarMenuProps {
  /** 메뉴 구조 데이터 */
  sections: SidebarSection[];
  /** 기본으로 열려있을 아코디언 섹션 ID 배열 */
  defaultOpenSections: string[];
  /** 네비게이션 핸들러 */
  onNavigate: (path: string, options: { newTab: boolean }) => void;
  /** 활성 상태 판단 함수 */
  isItemActive: (path: string) => boolean;
  /** 아코디언 타입 (선택적, 기본값: 'multiple') */
  accordionType?: 'single' | 'multiple';
}

/**
 * 사이드바 메뉴 컴포넌트
 *
 * @description
 * 사이드바의 메뉴 섹션들을 렌더링하는 컴포넌트.
 * 아코디언 형태의 메뉴 그룹과 고정 메뉴를 지원한다.
 *
 * @example
 * ```tsx
 * <SidebarMenu
 *   sections={sections}
 *   defaultOpenSections={['compute', 'storage']}
 *   onNavigate={handleNavigate}
 *   isItemActive={isItemActive}
 * />
 * ```
 */
export const SidebarMenu = ({
  sections,
  defaultOpenSections,
  onNavigate,
  isItemActive,
  accordionType = 'multiple',
}: SidebarMenuProps): React.ReactElement => {
  const handleItemClick = (path: string, event?: React.MouseEvent): void => {
    const shouldOpenNewTab =
      event && (event.ctrlKey || event.metaKey || event.button === 1);

    onNavigate(path, { newTab: Boolean(shouldOpenNewTab) });
  };

  return (
    <TcAccordion.Group multiple={accordionType === 'multiple'} className={'gap-4 w-[175px]'}>
      {sections.map(section => {
        // 고정 메뉴 항목 (children이 없는 경우)
        if (!section.children && section.path) {
          const isActive = isItemActive(section.path);
          return (
            <SidebarMenuItem
              key={section.id}
              path={section.path}
              label={section.label}
              icon={section.icon}
              isActive={isActive}
              onClick={handleItemClick}
            />
          );
        }

        // 아코디언 메뉴 (children이 있는 경우)
        if (section.children) {
          return (
            <TcAccordion
              key={section.id}
              id={section.id}
              className={accordionItemStyles}
              defaultOpen={defaultOpenSections.includes(section.id)}
              header={
                <div className={accordionHeaderStyles}>
                  <span className={accordionTitleStyles}>{section.label}</span>
                  <ChevronRightIcon
                    weight="thin"
                    size={12}
                    color="var(--primitive-color-blueGray400)"
                    className={accordionArrowStyles}
                  />
                </div>
              }
            >
              <div className={accordionContentStyles}>
                {section.children.map(item => {
                  const isActive = isItemActive(item.path);
                  return (
                    <SidebarMenuItem
                      key={item.id}
                      path={item.path}
                      label={item.label}
                      icon={item.icon}
                      isActive={isActive}
                      onClick={handleItemClick}
                      isSubmenu={true}
                    />
                  );
                })}
              </div>
            </TcAccordion>
          );
        }

        return null;
      })}
    </TcAccordion.Group>
  );
};

export default SidebarMenu;
