import { ReactNode, useCallback, useId, useRef, useState } from 'react';

import { cn } from '../../services/utils/cn';
import type { Direction } from '../../types';
import Portal from '../Portal';
import { tooltipContainerStyles, tooltipContentStyles } from './Tooltip.styles';

interface Props {
  children: ReactNode;
  content: ReactNode;
  /** 툴팁이 표시될 방향 */
  direction?: Direction;
  /** 외부에서 주입하는 툴팁 표시 여부 */
  visibile?: boolean;
  className?: string;
  /** 키보드 포커스 가능 여부 (focusable한 자식 요소를 감쌀 때 false로 설정) */
  focusable?: boolean;
}

const TOOLTIP_GAP_PX = 8;

/**
 * [Design System] 툴팁 컴포넌트
 *
 * 호버/포커스 시 추가 정보를 표시하는 툴팁입니다.
 * Portal의 CSS Anchor Positioning + position-try-fallbacks가
 * 자동으로 최적 방향을 결정합니다.
 *
 * @example
 * <Tooltip content="추가 설명 텍스트">
 *   <span>호버하세요</span>
 * </Tooltip>
 *
 * @example
 * <Tooltip content="위에 표시" direction="top">...</Tooltip>
 *
 * @param children - 툴팁 트리거 요소
 * @param content - 툴팁 내용 (문자열 또는 ReactNode)
 * @param direction - 선호 방향 (브라우저가 자동 전환 가능)
 * @param visibile - 외부 제어 표시 여부
 * @param className - 추가 CSS 클래스
 */
const Tooltip = ({
  children,
  content,
  direction = 'top',
  visibile = undefined,
  className,
  focusable = true,
}: Props): React.ReactElement => {
  const tooltipId = useId();
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideTooltip = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        className={tooltipContainerStyles}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        aria-describedby={isVisible ? tooltipId : undefined}
        tabIndex={focusable ? 0 : -1}
      >
        {children}
      </div>

      {(typeof visibile === 'undefined' ? isVisible : visibile) && (
        <Portal
          triggerRef={triggerRef}
          direction={direction}
          gap={TOOLTIP_GAP_PX}
          matchWidth={false}
        >
          <div
            id={tooltipId}
            className={cn(tooltipContentStyles, className)}
            role="tooltip"
            aria-live="polite"
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
};

export default Tooltip;
