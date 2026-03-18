import React, { useRef } from 'react';
import { useDragAndDrop } from '../../services/hooks/useDragAndDrop';
import { cn } from '../../services/utils';
import { Button } from '../Button';
import { AddIcon } from '../Icon';
import { addTabButtonStyles, tabBarContainerStyles, tabsWrapperStyles } from './TabBar.styles';
import TabItem from './TabItem';
import { TabItem as TabItemType } from './types';
import { useTabLayout } from './useTabLayout';
import { useTabScroll } from './useTabScroll';

const TAB_CONSTANTS = {
  MIN_TAB_WIDTH: 80,
} as const;

export interface TabBarProps {
  /** 탭 목록 */
  tabs: TabItemType[];
  /** 활성 탭 ID */
  activeTab: string;
  /** 탭 클릭 핸들러 */
  onTabClick: (tabId: string) => void;
  /** 탭 닫기 핸들러 */
  onTabClose: (tabId: string) => void;
  /** 탭 추가 핸들러 */
  onAddTab: () => void;
  /** 탭 순서 변경 핸들러 */
  onTabReorder?: (fromIndex: number, toIndex: number) => void;
  /** 탭 드래그 시작 시 호출되는 핸들러 (확장 동작용) */
  onTabDragStart?: (tabId: string, e: React.DragEvent) => void;
  /** 단일 탭일 때 창 드래그에 이벤트를 전달 (탭 DnD/재정렬 비활성화) */
  enableWindowDragPassthrough?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabClick,
  onTabClose,
  onAddTab,
  onTabReorder,
  onTabDragStart,
  enableWindowDragPassthrough = false,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsWrapperRef = useRef<HTMLDivElement>(null);

  const { activeTabWidth, inactiveTabWidth, needsScroll } = useTabLayout({
    containerRef,
    tabs,
  });

  useTabScroll({
    tabsWrapperRef,
    tabs,
    activeTab,
    activeTabWidth,
    inactiveTabWidth,
    needsScroll,
  });

  // 드래그앤드롭 훅 (순서 변경이 가능한 경우에만)
  const dragAndDrop = useDragAndDrop({
    items: tabs,
    onReorder: onTabReorder || (() => {}),
    canDrag: (tab) => Boolean(onTabReorder && tab.draggable !== false && !tab.fixed),
    canDrop: (tab) => Boolean(onTabReorder && !tab.fixed),
  });

  // 마우스 이벤트 차단 핸들러 (react-rnd와의 충돌 방지)
  const handleMouseDown = (e: React.MouseEvent): void => {
    // 창 드래그 전달 모드가 아닐 때만 전파 차단
    if (!enableWindowDragPassthrough) {
      e.stopPropagation();
    }
  };

  return (
    <div ref={containerRef} className={cn(tabBarContainerStyles, className)}>
      <div ref={tabsWrapperRef} className={cn(tabsWrapperStyles({ scrollable: needsScroll }))}>
        {tabs.map((tab, index) => (
          <TabItem
            key={tab.id}
            title={tab.title}
            isActive={activeTab === tab.id}
            alwaysShowClose={tabs.length === 1}
            onClick={() => onTabClick(tab.id)}
            onClose={() => onTabClose(tab.id)}
            style={{
              width: activeTab === tab.id ? `${activeTabWidth}px` : `${inactiveTabWidth}px`,
              flexShrink: activeTab === tab.id ? 0 : 1,
              minWidth:
                activeTab === tab.id
                  ? `${activeTabWidth}px`
                  : `${Math.min(inactiveTabWidth, TAB_CONSTANTS.MIN_TAB_WIDTH)}px`,
              transition: 'none', // 애니메이션 제거
            }}
            draggable={
              Boolean(onTabReorder) &&
              !enableWindowDragPassthrough &&
              dragAndDrop.canDragItem(index)
            }
            onDragStart={
              enableWindowDragPassthrough
                ? undefined
                : (e) => {
                    e.stopPropagation();
                    dragAndDrop.handleDragStart(e, index);
                    onTabDragStart?.(tab.id, e);
                  }
            }
            onDragOver={
              enableWindowDragPassthrough
                ? undefined
                : (e) => {
                    e.stopPropagation();
                    dragAndDrop.handleDragOver(e, index);
                  }
            }
            onDragLeave={
              enableWindowDragPassthrough
                ? undefined
                : (e) => {
                    e.stopPropagation();
                    dragAndDrop.handleDragLeave();
                  }
            }
            onDrop={
              enableWindowDragPassthrough
                ? undefined
                : (e) => {
                    e.stopPropagation();
                    dragAndDrop.handleDrop(e, index);
                  }
            }
            onDragEnd={
              enableWindowDragPassthrough
                ? undefined
                : (e) => {
                    e.stopPropagation();
                    dragAndDrop.handleDragEnd();
                  }
            }
            onMouseDown={handleMouseDown}
            isDragging={!enableWindowDragPassthrough && dragAndDrop.isDragging(index)}
            isDragOver={!enableWindowDragPassthrough && dragAndDrop.isDragOver(index)}
          />
        ))}

        <Button
          appearance="ghost"
          size="sm"
          onClick={onAddTab}
          className={cn(addTabButtonStyles)}
          aria-label="Add new tab"
        >
          <AddIcon variant="secondary" size="sm" />
        </Button>
      </div>
    </div>
  );
};

export default TabBar;
