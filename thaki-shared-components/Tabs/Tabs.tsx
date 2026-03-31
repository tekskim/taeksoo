import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../services';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icon/svg/wrapped';
import {
  scrollButtonStyles,
  tabButtonStyles,
  tabChildrenStyles,
  tabContainerStyles,
  tabContentStyles,
  tabHeaderStyles,
  tabHeaderWrapperStyles,
  tabNoneStyles,
} from './Tabs.styles';

export type TabSize = 'sm' | 'md';
export type TabVariant = 'line' | 'button';

// 개별 탭 버튼 컴포넌트
interface TabButtonProps {
  tab: React.ReactElement<TabProps>;
  isActive: boolean;
  size: TabSize;
  variant: TabVariant;
  onClick: (id: string) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ tab, isActive, size, variant, onClick }) => {
  return (
    <button
      disabled={tab.props.disabled}
      onClick={() => onClick(tab.props.id)}
      className={cn(tabButtonStyles({ size, variant, active: isActive }))}
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${tab.props.id}`}
      id={`tab-${tab.props.id}`}
      tabIndex={isActive ? 0 : -1}
    >
      {tab.props.label}
    </button>
  );
};

interface TabProps {
  id: string;
  label: React.ReactNode;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface TabsProps {
  className?: string;
  /** Additional className for the tab content wrapper */
  contentClassName?: string;
  activeTabId?: string;
  defaultActiveTabId?: string;
  size?: TabSize;
  variant?: TabVariant;
  onChange?: (id: string) => void;
  children: React.ReactNode;
  destroyOnHidden?: boolean;
  /** When true, the tab divider stretches to fill the container width (default: true) */
  fullWidth?: boolean;
}

/**
 * @param props.id - 탭 아이디
 * @param props.label - 탭 라벨
 * @param props.disabled - 탭 비활성화 여부
 * @param props.children - 탭 컨텐츠
 * @param props.className - 탭 컨텐츠 클래스명
 * @returns 탭 컨텐츠
 */
const Tab: React.FC<TabProps> = ({ children, className }) => {
  return <div className={cn(tabChildrenStyles, className)}>{children}</div>;
};

/**
 * [Design System] 탭 컴포넌트
 *
 * 여러 패널 사이를 전환하는 탭 네비게이션입니다.
 *
 * @example
 * // 기본 사용법
 * <Tabs defaultActiveTabId="overview">
 *   <Tab id="overview" label="개요">개요 내용</Tab>
 *   <Tab id="settings" label="설정">설정 내용</Tab>
 *   <Tab id="logs" label="로그">로그 내용</Tab>
 * </Tabs>
 *
 * @example
 * // Controlled 모드
 * <Tabs activeTabId={activeTab} onChange={setActiveTab}>
 *   <Tab id="tab1" label="첫 번째">Tab 1 Content</Tab>
 *   <Tab id="tab2" label="두 번째">Tab 2 Content</Tab>
 * </Tabs>
 *
 * @example
 * // 버튼 스타일 탭
 * <Tabs variant="button" size="sm">
 *   <Tab id="all" label="전체">전체 목록</Tab>
 *   <Tab id="active" label="활성">활성 목록</Tab>
 *   <Tab id="inactive" label="비활성">비활성 목록</Tab>
 * </Tabs>
 *
 * @example
 * // 비활성 탭 유지 (DOM에서 제거하지 않음)
 * <Tabs destroyOnHidden={false}>
 *   <Tab id="form" label="폼">폼 상태가 유지됩니다</Tab>
 *   <Tab id="preview" label="미리보기">미리보기</Tab>
 * </Tabs>
 *
 * @example
 * // 비활성화된 탭 포함
 * <Tabs>
 *   <Tab id="enabled" label="활성 탭">활성 탭 내용</Tab>
 *   <Tab id="disabled" label="비활성 탭" disabled>비활성 탭 내용</Tab>
 * </Tabs>
 *
 * @param activeTabId - 활성 탭 ID (controlled)
 * @param defaultActiveTabId - 기본 활성 탭 ID (uncontrolled)
 * @param size - 탭 크기 ('sm' | 'md')
 * @param variant - 탭 스타일 ('line' | 'button')
 * @param onChange - 탭 변경 콜백
 * @param destroyOnHidden - 비활성 탭 DOM 제거 여부 (기본: true)
 * @param children - Tab 컴포넌트들
 */
export const Tabs: React.FC<TabsProps> = ({
  children,
  className,
  contentClassName,
  activeTabId,
  defaultActiveTabId,
  onChange,
  size = 'md',
  variant = 'line',
  destroyOnHidden = true,
  fullWidth = true,
}) => {
  // 자식 요소 중 Tab 컴포넌트만 필터링
  const tabElements = useMemo(() => {
    return React.Children.toArray(children).filter(
      (child) => React.isValidElement(child) && child.type === Tab
    ) as React.ReactElement<TabProps>[];
  }, [children]);

  const [tabId, setTabId] = useState(() => defaultActiveTabId || tabElements[0]?.props.id);

  // activeTabId가 전달되지 않으면 tabId를 사용
  const currentActiveTabId = activeTabId ?? tabId;

  // 스크롤 관련 상태 및 ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  // 스크롤 상태 체크 함수
  const checkScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      setShowScrollButtons(false);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const isScrollable = scrollWidth > clientWidth + 1;

    setShowScrollButtons(isScrollable);
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  // 스크롤 버튼 핸들러 (뷰포트 너비 기준)
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // 현재 보이는 영역의 80%만큼 왼쪽으로 스크롤
    const scrollAmount = container.clientWidth * 0.8;

    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // 현재 보이는 영역의 80%만큼 오른쪽으로 스크롤
    const scrollAmount = container.clientWidth * 0.8;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  // 스크롤 상태 체크를 위한 useEffect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => checkScrollState();
    const handleResize = () => {
      // 약간의 지연을 두고 체크 (레이아웃 완료 후)
      setTimeout(checkScrollState, 100);
    };

    // 초기 상태 체크
    setTimeout(checkScrollState, 50);

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // ResizeObserver로 컨테이너 크기 변경 감지
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(checkScrollState, 50);
    });

    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [checkScrollState, tabElements]);

  const handleClick = async (id: string) => {
    if (id === currentActiveTabId) return;

    // activeTabId가 전달되지 않으면 tabId를 사용
    if (activeTabId === undefined) {
      setTabId(id); // uncontrolled 상태일 때만 변경
    }

    // 탭 변경 시 호출되는 함수
    onChange?.(id);
  };

  const currentIndex = tabElements.findIndex((tab) => tab.props.id === currentActiveTabId);
  const currentTab = currentIndex >= 0 ? tabElements[currentIndex] : undefined;

  // 탭 버튼들 렌더링 함수
  const renderTabButtons = () => {
    return tabElements.map((tab) => (
      <TabButton
        key={tab.props.id}
        tab={tab}
        isActive={tab.props.id === currentActiveTabId}
        size={size}
        variant={variant}
        onClick={handleClick}
      />
    ));
  };

  return (
    <div className={cn(tabContainerStyles, className)}>
      <div className={tabHeaderWrapperStyles}>
        {showScrollButtons && (
          <button
            className={cn(
              scrollButtonStyles({
                position: 'left',
                disabled: !canScrollLeft,
              })
            )}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="이전 탭들 보기"
          >
            <ChevronLeftIcon size="sm" variant="secondary" />
          </button>
        )}
        <div
          ref={scrollContainerRef}
          className={cn(
            tabHeaderStyles({
              variant,
              scrollable: showScrollButtons,
              fullWidth,
            })
          )}
          role="tablist"
          aria-label="tabs"
        >
          {renderTabButtons()}
        </div>
        {showScrollButtons && (
          <button
            className={cn(
              scrollButtonStyles({
                position: 'right',
                disabled: !canScrollRight,
              })
            )}
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="다음 탭들 보기"
          >
            <ChevronRightIcon size="sm" variant="secondary" />
          </button>
        )}
      </div>
      <div className={cn(tabContentStyles, contentClassName)}>
        {destroyOnHidden
          ? // destroyOnHidden이 true이면 현재 탭만 렌더링
            currentTab && (
              <div
                key={currentTab.props.id}
                role="tabpanel"
                id={`panel-${currentTab.props.id}`}
                aria-labelledby={`tab-${currentTab.props.id}`}
              >
                {currentTab.props.children}
              </div>
            )
          : // false이면 모든 탭을 렌더링하되 display로 숨김 처리
            tabElements.map((tab) => {
              const isActive = tab.props.id === currentActiveTabId;
              return (
                <div
                  key={tab.props.id}
                  className={cn(!isActive && tabNoneStyles)}
                  role="tabpanel"
                  id={`panel-${tab.props.id}`}
                  aria-labelledby={`tab-${tab.props.id}`}
                  aria-hidden={!isActive}
                >
                  {tab.props.children}
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Tabs;
export { Tab };
export type { TabProps, TabsProps };
