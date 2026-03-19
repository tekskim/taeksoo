/**
 * useContainerReady Hook
 *
 * 컨테이너가 렌더링되고 크기가 확보될 때까지 대기하는 훅
 *
 * - 패널 모드: 부모 컨테이너가 이미 렌더링된 상태이므로 즉시 통과
 * - 새 창 모드: window.open()으로 열린 창에서는 DOM 레이아웃 전에 마운트될 수 있어
 *   ResizeObserver로 크기가 확보될 때까지 대기 필요
 */

import { useEffect, useState, type RefObject } from 'react';

const MIN_CONTAINER_SIZE = 10;
const NEW_WINDOW_STABILIZE_DELAY = 100;

interface UseContainerReadyOptions {
  /**
   * 새 창 모드 여부
   * - true: ResizeObserver로 크기 확보 대기 (새 창에서 필요)
   * - false: 즉시 준비 완료 (패널에서 사용)
   * @default false
   */
  isNewWindow?: boolean;
}

interface UseContainerReadyReturn {
  isContainerReady: boolean;
}

/**
 * 컨테이너 준비 상태를 모니터링하는 훅
 *
 * @param containerRef - 모니터링할 컨테이너 ref
 * @param options - 설정 옵션
 * @returns 컨테이너가 준비되었는지 여부
 *
 * @example
 * // 패널에서 사용 (즉시 준비)
 * const { isContainerReady } = useContainerReady(ref);
 *
 * @example
 * // 새 창에서 사용 (크기 확보 대기)
 * const { isContainerReady } = useContainerReady(ref, { isNewWindow: true });
 */
export function useContainerReady(
  containerRef: RefObject<HTMLDivElement | null>,
  options: UseContainerReadyOptions = {}
): UseContainerReadyReturn {
  const { isNewWindow = false } = options;
  const [isContainerReady, setIsContainerReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let resizeObserver: ResizeObserver | null = null;
    let isCleanedUp = false;

    // 패널 모드: 즉시 준비 완료
    if (!isNewWindow) {
      requestAnimationFrame(() => {
        if (!isCleanedUp) {
          setIsContainerReady(true);
        }
      });
      return () => {
        isCleanedUp = true;
        setIsContainerReady(false);
      };
    }

    // 새 창 모드: 크기 확보 대기
    const checkContainerSize = (): boolean => {
      const rect = container.getBoundingClientRect();
      return (
        rect.width >= MIN_CONTAINER_SIZE && rect.height >= MIN_CONTAINER_SIZE
      );
    };

    if (checkContainerSize()) {
      // 이미 크기가 확보됨 - 다음 프레임에서 준비 완료
      requestAnimationFrame(() => {
        if (!isCleanedUp) {
          setIsContainerReady(true);
        }
      });
    } else {
      // 크기가 0이면 ResizeObserver로 대기
      resizeObserver = new ResizeObserver(() => {
        if (checkContainerSize() && !isCleanedUp) {
          resizeObserver?.disconnect();
          // 추가 안정화를 위해 지연
          requestAnimationFrame(() => {
            setTimeout(() => {
              if (!isCleanedUp) {
                setIsContainerReady(true);
              }
            }, NEW_WINDOW_STABILIZE_DELAY);
          });
        }
      });

      resizeObserver.observe(container);
    }

    return () => {
      isCleanedUp = true;
      resizeObserver?.disconnect();
      setIsContainerReady(false);
    };
  }, [containerRef, isNewWindow]);

  return { isContainerReady };
}
