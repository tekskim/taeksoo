import React, { useMemo } from 'react';
import { cn } from '../../services/utils/cn';
import {
  progressContainerStyles,
  progressHeaderStyles,
  progressLabelStyles,
  progressPercentageStyles,
  progressInfinityStyles,
  progressWrapperStyles,
  progressTrackVariants,
  progressPendingOverlayVariants,
} from './ProgressBar.styles';
import type { ProgressBarProps } from './types';

/**
 * [Design System] 프로그레스 바 컴포넌트
 *
 * 진행률을 시각적으로 표시하는 컴포넌트입니다.
 * pending 값을 통해 예정된 진행률도 함께 표시할 수 있습니다.
 *
 * @example
 * // 기본 사용법
 * <ProgressBar value={75} max={100} />
 *
 * @example
 * // 라벨과 퍼센트 표시
 * <ProgressBar
 *   label="업로드 진행률"
 *   value={45}
 *   max={100}
 *   showValue="percentage"
 * />
 *
 * @example
 * // 절대값 표시
 * <ProgressBar
 *   label="파일 업로드"
 *   value={7}
 *   max={10}
 *   showValue="absolute"
 * />
 *
 * @example
 * // Pending 값 포함 (예: 할당량)
 * <ProgressBar
 *   label="스토리지 사용량"
 *   value={60}
 *   pendingValue={20}
 *   max={100}
 *   variant="warning"
 * />
 *
 * @example
 * // 색상 변형
 * <ProgressBar value={80} variant="success" />
 * <ProgressBar value={80} variant="error" />
 * <ProgressBar value={80} variant="warning" />
 *
 * @example
 * // 커스텀 색상
 * <ProgressBar value={50} color="var(--primitive-blue-500)" />
 *
 * @param value - 현재 값
 * @param pendingValue - 예정된 추가 값
 * @param max - 최대 값 (기본: 100)
 * @param label - 라벨 텍스트
 * @param showValue - 값 표시 방식 ('percentage' | 'absolute' | false)
 * @param variant - 색상 변형 ('success' | 'error' | 'warning')
 * @param color - 커스텀 색상
 * @param pendingColor - pending 영역 커스텀 색상
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  pendingValue = 0,
  max = 100,
  label,
  showValue = 'percentage',
  variant = 'success',
  color,
  pendingColor,
  className,
  ...rest
}) => {
  // max가 무한대인지 확인
  const isInfinite = max === Infinity || !isFinite(max);

  // 계산된 값들을 useMemo로 최적화
  const { currentPercent, pendingPercent, totalPercent, hasPending } = useMemo(() => {
    // max가 무한대면 진행률을 0으로 설정
    if (isInfinite) {
      return {
        currentPercent: 0,
        pendingPercent: 0,
        totalPercent: 0,
        hasPending: pendingValue > 0,
      };
    }

    // 백분율로 변환 (0-100 범위 제한)
    const toPercent = (val: number) => Math.min(100, Math.max(0, (val / max) * 100));

    const currentPercent = toPercent(value);
    const pendingPercent = Math.min(toPercent(pendingValue), 100 - currentPercent); // 100% 초과 방지

    const totalPercent = currentPercent + pendingPercent;
    const hasPending = pendingPercent > 0;

    return {
      currentPercent,
      pendingPercent,
      totalPercent,
      hasPending,
    };
  }, [value, pendingValue, max, isInfinite]);

  // 값 표시 렌더링
  const displayValueElement = useMemo(() => {
    if (!showValue) return null;

    // max가 무한대면 "current/∞" 형식으로 표시
    if (isInfinite) {
      const total = hasPending ? value + pendingValue : value;
      return (
        <span className={progressInfinityStyles}>
          <span>{total}/</span>
          <span>∞</span>
        </span>
      );
    }

    if (showValue === 'percentage') {
      return `${Math.round(totalPercent)}%`;
    }
    if (showValue === 'absolute') {
      const total = hasPending ? value + pendingValue : value;
      return `${total}/${max}`;
    }
    return null;
  }, [showValue, totalPercent, hasPending, value, pendingValue, max, isInfinite]);

  return (
    <figure className={cn(progressContainerStyles, className)} style={rest.style} {...rest}>
      {/* 헤더 영역 - 라벨과 값 표시 */}
      {(label || showValue) && (
        <header className={progressHeaderStyles}>
          {label && <span className={progressLabelStyles}>{label}</span>}
          {showValue && displayValueElement && (
            <output className={progressPercentageStyles}>{displayValueElement}</output>
          )}
        </header>
      )}

      {/* 진행률 바 영역 - 시맨틱 progress 태그 사용 */}
      <div className={progressWrapperStyles}>
        <progress
          className={cn(progressTrackVariants({ variant }), Boolean(color) && 'progress-custom')}
          value={currentPercent}
          max={100}
          style={{
            ...(color && {
              ['--progress-color' as string]: color,
            }),
          }}
          aria-label={
            typeof label === 'string'
              ? label ||
                `Progress ${Math.round(totalPercent)}%${
                  hasPending
                    ? ` (${Math.round(currentPercent)}% current, ${Math.round(pendingPercent)}% pending)`
                    : ''
                }`
              : `Progress ${Math.round(totalPercent)}%${
                  hasPending
                    ? ` (${Math.round(currentPercent)}% current, ${Math.round(pendingPercent)}% pending)`
                    : ''
                }`
          }
        />

        {/* 추가 예정 값 - progress 태그는 단일 값만 표시하므로 별도 오버레이 */}
        {hasPending && (
          <div
            className={progressPendingOverlayVariants({ variant })}
            style={{
              left: `${currentPercent}%`,
              width: `${pendingPercent}%`,
              ...(pendingColor && {
                backgroundColor: pendingColor,
              }),
              ...(!pendingColor &&
                color && {
                  backgroundColor: color,
                }),
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </figure>
  );
};

export default ProgressBar;
