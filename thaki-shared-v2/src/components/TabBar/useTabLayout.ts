import { useState, useEffect, RefObject, useCallback, useMemo, useRef } from 'react';
import { TabItem } from './types';

// 탭 레이아웃 관련 상수들
const MIN_TAB_WIDTH = 80;
const MAX_TAB_WIDTH = 160;
const ADD_BUTTON_WIDTH = 32;
const TAB_GAP = 2;

interface UseTabLayoutParams {
  containerRef: RefObject<HTMLDivElement | null>;
  tabs: TabItem[];
}

interface UseTabLayoutReturn {
  activeTabWidth: number;
  inactiveTabWidth: number;
  needsScroll: boolean;
}

export const useTabLayout = ({
  containerRef,
  tabs,
}: UseTabLayoutParams): UseTabLayoutReturn => {
  const [activeTabWidth, setActiveTabWidth] = useState<number>(MIN_TAB_WIDTH);
  const [inactiveTabWidth, setInactiveTabWidth] =
    useState<number>(MIN_TAB_WIDTH);
  const [needsScroll, setNeedsScroll] = useState(false);
  const lastMeasuredWidthRef = useRef<number | null>(null);

  // 전체 컨테이너 너비 - 고정 요소들 = 탭들이 사용할 수 있는 너비를 계산
  const layoutMetrics = useMemo(() => {
    const totalGaps = Math.max(0, tabs.length - 1) * TAB_GAP;
    const buttonGap = 8;
    const safetyMargin = 4;
    const fixedWidth = ADD_BUTTON_WIDTH + totalGaps + buttonGap + safetyMargin;

    return { totalGaps, fixedWidth };
  }, [tabs.length]);

  // 반응형 탭 크기 계산 및 레이아웃 계산 함수
  const calculateLayout = useCallback(
    (containerWidth: number) => {
      const availableWidth = containerWidth - layoutMetrics.fixedWidth;

      if (tabs.length === 0) {
        return {
          activeWidth: MIN_TAB_WIDTH,
          inactiveWidth: MIN_TAB_WIDTH,
          needsScroll: false,
        };
      }

      const idealTabWidth = availableWidth / tabs.length;

      // 충분한 공간이 있는 경우: 모든 탭을 동일한 크기로 설정
      if (idealTabWidth >= MIN_TAB_WIDTH) {
        const calculatedWidth = Math.min(MAX_TAB_WIDTH, idealTabWidth);
        return {
          activeWidth: calculatedWidth,
          inactiveWidth: calculatedWidth,
          needsScroll: false,
        };
      }

      // 공간이 부족한 경우: 활성 탭을 더 크게, 비활성 탭을 작게 설정
      const activeTabMinWidth = MIN_TAB_WIDTH + 40;
      const remainingWidth = availableWidth - activeTabMinWidth;
      const inactiveTabCount = tabs.length - 1;

      if (inactiveTabCount === 0) {
        // 탭이 하나만 있는 경우
        return {
          activeWidth: Math.min(MAX_TAB_WIDTH, availableWidth),
          inactiveWidth: MIN_TAB_WIDTH,
          needsScroll: false,
        };
      }

      const inactiveWidth = remainingWidth / inactiveTabCount;

      if (inactiveWidth >= MIN_TAB_WIDTH) {
        // 비활성 탭들도 최소 너비를 만족하는 경우
        return {
          activeWidth: activeTabMinWidth,
          inactiveWidth: Math.min(MAX_TAB_WIDTH, inactiveWidth),
          needsScroll: false,
        };
      }

      // 비활성 탭들이 최소 너비를 만족하지 못하는 경우: 스크롤 필요
      return {
        activeWidth: activeTabMinWidth,
        inactiveWidth: MIN_TAB_WIDTH,
        needsScroll: true,
      };
    },
    [tabs.length, layoutMetrics.fixedWidth]
  );

  // 레이아웃 업데이트 함수
  const updateTabLayout = useCallback((): void => {
    const container = containerRef.current;
    if (!container) return;

    const measuredWidth = Math.round(container.getBoundingClientRect().width);
    if (lastMeasuredWidthRef.current === measuredWidth) {
      return;
    }
    lastMeasuredWidthRef.current = measuredWidth;

    const layout = calculateLayout(measuredWidth);

    // NOTE:
    // ResizeObserver → setState → layout change → ResizeObserver 루프를 끊기 위해
    // 실제 값이 변할 때만 state를 갱신합니다.
    setActiveTabWidth(prev => (prev === layout.activeWidth ? prev : layout.activeWidth));
    setInactiveTabWidth(prev =>
      prev === layout.inactiveWidth ? prev : layout.inactiveWidth
    );
    setNeedsScroll(prev => (prev === layout.needsScroll ? prev : layout.needsScroll));
  }, [containerRef, calculateLayout]);

  useEffect(() => {
    // 초기 레이아웃 계산 실행 (지연 실행으로 들썩거림 방지)
    const timer = setTimeout(updateTabLayout, 0);

    // 컨테이너 크기 변경을 감지하여 레이아웃 재계산
    // 디바운스 적용으로 빈번한 크기 변경 시 성능 최적화
    let resizeTimer: NodeJS.Timeout;
    const debouncedUpdateLayout = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateTabLayout, 16); // 1프레임 지연
    };

    const resizeObserver = new ResizeObserver(debouncedUpdateLayout);
    const container = containerRef.current;

    if (container) {
      resizeObserver.observe(container);
    }

    // 클린업: ResizeObserver 해제
    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
    };
  }, [updateTabLayout, containerRef]);

  return {
    activeTabWidth,
    inactiveTabWidth,
    needsScroll,
  };
};
