import { useEffect, useRef, useState } from 'react';
import { cn } from '../../services/utils/cn';
import { Button } from '../Button/Button';
import { ButtonProps } from '../Button/Button.types';
import { RefreshIcon } from '../Icon';

import {
  refreshContainerVariants,
  refreshIconStyles,
  refreshRotateStyles,
  refreshCountVariants,
} from './RefreshButton.styles';

type RefreshButtonSize = 'sm' | 'md' | 'lg';

interface Props extends Omit<ButtonProps, 'children' | 'variant' | 'size'> {
  /** 리프레시 버튼이 돌아가고 있는 시간 */
  duration?: number;
  /** 리프레시 버튼의 크기 */
  size?: RefreshButtonSize;
  /** 리프레시 버튼의 아이콘 */
  refreshUI?: React.ReactNode;
  /** 리프레시 버튼을 클릭했을 때 호출되는 함수 */
  onRefresh: () => void;
  /** 리프레시 버튼을 클릭했을 때 호출되는 함수 */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * @description `RefreshButton` 리프레시 버튼 컴포넌트
 */
const RefreshButton = ({
  className,
  duration = 10000,
  appearance = 'ghost',
  size = 'md',
  isLoading = false,
  disabled = false,
  refreshUI,
  onClick,
  onRefresh,
  ...rest
}: Props): React.ReactElement => {
  // 남은 시간에 대한 상태
  const [remainDuration, setRemainDuration] = useState(duration);

  // 리프레시 버튼이 돌아가고 있는지 여부에 대한 상태
  const [isRefreshing, setIsRefreshing] = useState(false);

  /** 카운트다운 인터벌 참조 */
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /** 클릭되거나 인터벌이 다 돌아서 리프레시 상태인지 여부 */
  const refreshingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /** 리프레시 버튼이 돌아가고 있는지 여부 */
  const rotatingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /** 남은 시간을 초 단위로 표시 (메모 불필요) */
  const currentCount = (remainDuration / 1000).toFixed(0);

  /** size/appearance에 따른 파생값 (메모 불필요) */
  const iconSize = size === 'sm' ? 20 : size === 'md' ? 24 : 32;
  const iconVariant = appearance === 'outline' ? 'primary' : 'secondary';
  const buttonVariant = appearance === 'outline' ? 'primary' : 'secondary';

  /** 기본 리프레시 아이콘 (메모 불필요) */
  const DefaultRefreshIcon = (): React.ReactNode => {
    if (refreshUI) {
      return refreshUI;
    }
    return <RefreshIcon size={iconSize} variant={iconVariant} weight="regular" />;
  };

  /** 리프레시 버튼 클릭 핸들러 (불필요한 useCallback 제거) */
  const onClickRefresh = (e: React.MouseEvent<HTMLButtonElement>): void => {
    // 이미 회전 중이면 잠깐 멈췄다 다시 회전시켜 애니메이션을 재생
    setIsRefreshing((prev) => {
      if (prev) {
        clearTimeout(rotatingTimeoutRef.current!);
        rotatingTimeoutRef.current = null;
        rotatingTimeoutRef.current = setTimeout(() => {
          setIsRefreshing(true);
        }, 50);
      }
      return !prev;
    });

    // 즉시 카운트다운을 0으로 만들어 리프레시 트리거
    setRemainDuration(0);

    onClick?.(e);
  };

  /** 카운트다운 인터벌을 시작하는 함수 */
  const startCountdownInterval = (): void => {
    countdownIntervalRef.current = setInterval(() => {
      setRemainDuration((prev) => prev - 1000);
    }, 1000);
  };

  // 클릭되거나 인터벌이 다 돌아서 남은 시간이 0 이하일 때, 동작하는 이펙트
  useEffect(() => {
    if (remainDuration <= 0) {
      // 리프레시 버튼을 돌리기
      setIsRefreshing(true);

      // 남은 시간을 다시 duration대로 초기화
      setRemainDuration(duration);

      // 리프레시 함수 호출
      onRefresh?.();

      // 카운트다운 인터벌 초기화
      clearInterval(countdownIntervalRef.current!);
      countdownIntervalRef.current = null;

      clearTimeout(refreshingTimeoutRef.current!);

      // 1 초 후에 다시 카운트다운 인터벌 시작하도록 타임아웃 등록
      refreshingTimeoutRef.current = setTimeout(() => {
        setIsRefreshing(false);
        startCountdownInterval();
      }, 1000);
    }
  }, [duration, remainDuration, onRefresh]);

  // duration 및 다른 props들이 변경되었을 때, 이벤트를 모두 클린업하고 카운트다운 시작
  useEffect(() => {
    setIsRefreshing(false);

    setRemainDuration(duration);

    if (!isLoading && !disabled) {
      startCountdownInterval();
    }

    return () => {
      clearInterval(countdownIntervalRef.current!);
      countdownIntervalRef.current = null;

      clearTimeout(refreshingTimeoutRef.current!);
      refreshingTimeoutRef.current = null;

      clearTimeout(rotatingTimeoutRef.current!);
      rotatingTimeoutRef.current = null;
    };
  }, [duration, isLoading, disabled]);

  // duration prop 검증 이펙트 (필수)
  useEffect(() => {
    if (typeof duration !== 'number' || !duration || duration <= 0) {
      throw new Error('duration must be a positive number');
    }

    // 1000 단위로 나누어 떨어지지 않으면 에러를 발생시킴
    if (duration % 1000 !== 0) {
      throw new Error('duration must be a multiple of 1000');
    }
  }, [duration]);

  return (
    <Button
      className={className}
      variant={buttonVariant}
      appearance={appearance}
      size={size}
      isLoading={isLoading}
      disabled={disabled}
      onClick={onClickRefresh}
      {...rest}
    >
      <div className={refreshContainerVariants({ size })}>
        <div className={cn(refreshIconStyles, isRefreshing && refreshRotateStyles)}>
          <DefaultRefreshIcon />
        </div>
        <span className={refreshCountVariants({ size })}>
          {!isRefreshing && currentCount !== '0' ? currentCount : ''}
        </span>
      </div>
    </Button>
  );
};

export { RefreshButton };
export type { Props as RefreshButtonProps };
