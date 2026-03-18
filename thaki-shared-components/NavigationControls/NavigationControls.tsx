import React, { memo } from 'react';
import { cn } from '../../services';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icon';
import {
  dividerStyles,
  navigationButtonStyles,
  navigationContainerStyles,
} from './NavigationControls.styles';

interface NavigationControlsProps {
  /** 뒤로가기 가능 여부 */
  canGoBack: boolean;
  /** 앞으로가기 가능 여부 */
  canGoForward: boolean;
  /** 뒤로가기 핸들러 */
  onGoBack: () => void;
  /** 앞으로가기 핸들러 */
  onGoForward: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * NavigationControls 컴포넌트
 *
 * 탭 내 히스토리 네비게이션을 제어하는 뒤로가기/앞으로가기 버튼 컴포넌트입니다.
 * 브라우저의 네비게이션 버튼처럼 동작합니다.
 *
 * @example
 * ```tsx
 * <NavigationControls
 *   canGoBack={canGoBack}
 *   canGoForward={canGoForward}
 *   onGoBack={goBack}
 *   onGoForward={goForward}
 * />
 * ```
 */
const NavigationControls: React.FC<NavigationControlsProps> = memo(
  ({ canGoBack, canGoForward, onGoBack, onGoForward, className }) => {
    return (
      <div className={cn(navigationContainerStyles, className)}>
        <button
          type="button"
          className={navigationButtonStyles({ disabled: !canGoBack })}
          onClick={onGoBack}
          disabled={!canGoBack}
          aria-label="Go back"
          title="Go back"
        >
          <ChevronLeftIcon size={16} variant="secondary" />
        </button>

        <div className={dividerStyles} aria-hidden="true" />

        <button
          type="button"
          className={navigationButtonStyles({ disabled: !canGoForward })}
          onClick={onGoForward}
          disabled={!canGoForward}
          aria-label="Go forward"
          title="Go forward"
        >
          <ChevronRightIcon size={16} variant="secondary" />
        </button>
      </div>
    );
  }
);

NavigationControls.displayName = 'NavigationControls';

export default NavigationControls;
export type { NavigationControlsProps };
