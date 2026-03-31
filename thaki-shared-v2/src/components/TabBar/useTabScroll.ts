import { useEffect, RefObject, useCallback, useMemo } from 'react';
import { TabItem } from './types';

// 탭 간격 상수
const TAB_GAP = 2;

interface UseTabScrollParams {
  tabsWrapperRef: RefObject<HTMLDivElement | null>;
  tabs: TabItem[];
  activeTab: string;
  activeTabWidth: number;
  inactiveTabWidth: number;
  needsScroll: boolean;
}

export const useTabScroll = ({
  tabsWrapperRef,
  tabs,
  activeTab,
  activeTabWidth,
  inactiveTabWidth,
  needsScroll,
}: UseTabScrollParams): void => {
  // 활성 탭의 인덱스
  const activeTabIndex = useMemo(
    () => tabs.findIndex((tab) => tab.id === activeTab),
    [tabs, activeTab]
  );

  // 활성 탭의 위치 정보
  const tabPosition = useMemo(() => {
    if (activeTabIndex === -1) return null;
    const start = activeTabIndex * (inactiveTabWidth + TAB_GAP);
    return {
      start,
      end: start + activeTabWidth,
    };
  }, [activeTabIndex, activeTabWidth, inactiveTabWidth]);

  const scrollToActiveTab = useCallback(() => {
    const wrapper = tabsWrapperRef.current;
    if (!wrapper || !needsScroll || !tabPosition) return;

    const { start, end } = tabPosition;
    const { offsetWidth: wrapperWidth, scrollLeft: currentScroll } = wrapper;

    // 스크롤 위치 결정: 활성 탭이 현재 보이는 영역을 벗어났는지 확인
    const targetScroll =
      start < currentScroll
        ? start // 왼쪽으로 벗어남: 탭의 시작점으로 스크롤하여 탭 전체를 표시
        : end > currentScroll + wrapperWidth
          ? end - wrapperWidth // 오른쪽으로 벗어남: 탭의 끝점이 컨테이너 끝에 맞춰지도록 스크롤
          : null; // 탭이 이미 완전히 보임: 스크롤 불필요

    if (targetScroll !== null) {
      wrapper.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  }, [tabsWrapperRef, needsScroll, tabPosition]);

  useEffect(() => {
    scrollToActiveTab();
  }, [scrollToActiveTab]);
};
