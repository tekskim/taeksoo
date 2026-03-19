/**
 * ChartToggle - 차트용 토글 버튼 컴포넌트
 *
 * 라인차트 범례 토글 디자인 (SSOT 기준):
 * - 투명 배경 + 보더 스타일
 * - 활성화 시 primary 컬러 적용
 *
 * 일반 Toggle과 다른 점:
 * - 스위치 크기: 24x12px (Toggle은 28x16px)
 * - 스위치 스타일: 투명 배경 + 보더 (Toggle은 채워진 배경)
 * - 노브 크기: 8x8px (Toggle은 12x12px)
 * - 차트 컨트롤 영역에 최적화된 컴팩트 디자인
 */
import React from 'react';
import { cn } from '../../services/utils/cn';
import {
  chartToggleButtonStyles,
  chartToggleSwitchStyles,
  chartToggleKnobStyles,
  chartToggleLabelStyles,
} from './ChartToggle.styles';

export interface ChartToggleProps {
  /** 토글 활성화 상태 */
  isActive: boolean;
  /** 토글 클릭 핸들러 */
  onClick: () => void;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 활성 상태 라벨 */
  activeLabel?: string;
  /** 비활성 상태 라벨 */
  inactiveLabel?: string;
  /** 클래스명 */
  className?: string;
}

/**
 * 차트 컨트롤 영역용 토글 버튼
 *
 * 디자인 스펙 (SSOT 기준):
 * - 스위치: 24x12px, border-radius 6px, transparent bg
 * - 노브: 8x8px, border-radius 50%
 * - 활성: border-color primary, 노브 bg primary, translateX(12px)
 * - 비활성: border-color default, 노브 bg muted
 *
 * @example
 * // 기본 사용
 * <ChartToggle
 *   isActive={allVisible}
 *   onClick={toggleAll}
 * />
 *
 * @example
 * // 커스텀 라벨
 * <ChartToggle
 *   isActive={showAll}
 *   onClick={handleToggle}
 *   activeLabel="모두 숨기기"
 *   inactiveLabel="모두 보기"
 * />
 */
const ChartToggle: React.FC<ChartToggleProps> = ({
  isActive,
  onClick,
  disabled = false,
  activeLabel = 'Hide All',
  inactiveLabel = 'View All',
  className = '',
}) => {
  return (
    <button
      type="button"
      className={cn(chartToggleButtonStyles, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Toggle Switch */}
      <span className={chartToggleSwitchStyles({ isActive })}>
        {/* Toggle Knob */}
        <span
          className={chartToggleKnobStyles({ isActive })}
          style={{
            transform: isActive ? 'translateX(12px)' : 'translateX(0)',
          }}
        />
      </span>
      {/* Label */}
      <span className={chartToggleLabelStyles}>
        {isActive ? activeLabel : inactiveLabel}
      </span>
    </button>
  );
};

export { ChartToggle };
export default ChartToggle;

