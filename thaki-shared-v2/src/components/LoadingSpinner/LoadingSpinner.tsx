import React from 'react';
import { cn } from '../../services/utils/cn';
import { spinnerVariants, spinnerInnerVariants } from './LoadingSpinner.styles';
import { LoadingSpinnerProps } from './LoadingSpinner.types';

/**
 * [Design System] 로딩 스피너 컴포넌트
 *
 * 로딩 상태를 표시하는 스피너입니다.
 *
 * @example
 * // 기본 사용법
 * <LoadingSpinner />
 *
 * @example
 * // 크기 변형
 * <LoadingSpinner size="xs" />
 * <LoadingSpinner size="sm" />
 * <LoadingSpinner size="md" />
 * <LoadingSpinner size="lg" />
 *
 * @example
 * // 색상 변형
 * <LoadingSpinner color="primary" />
 * <LoadingSpinner color="secondary" />
 * <LoadingSpinner color="inverse" />
 *
 * @example
 * // 버튼 내 로딩 상태
 * <Button isLoading loadingElement={<LoadingSpinner size="sm" color="inverse" />}>
 *   저장 중...
 * </Button>
 *
 * @param size - 크기 ('xs' | 'sm' | 'md' | 'lg')
 * @param color - 색상 ('primary' | 'secondary' | 'inverse')
 * @param className - 추가 CSS 클래스
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
  ...props
}) => {
  return (
    <div className={cn(spinnerVariants({ size }), className)} {...props}>
      <div className={spinnerInnerVariants({ size, color })} />
    </div>
  );
};
