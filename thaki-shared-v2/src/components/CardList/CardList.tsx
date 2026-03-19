import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { cn } from '../../services/utils/cn';

import { ErrorBoundary } from '../ErrorBoundary';
import { cardListStyles, cardStyles, cardErrorStyles } from './CardList.styles';

interface Props<T> {
  /** 카드 리스트의 클래스명 */
  className?: string;
  /** 카드 리스트의 데이터 */
  list: T[] | null | undefined;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 스켈레톤 카드의 개수 */
  numbersOfSkeleton?: number;
  /** 스켈레톤 카드의 레이아웃 */
  skeletonUI?: ReactElement | null;
  /** 빈 카드의 레이아웃 */
  emptyUI?: ReactNode;
  /** 에러 카드의 레이아웃 */
  errorCardUI?: ReactNode;
  /** 카드 리스트의 아이템 렌더링 함수 */
  children: (item: T, index: number) => ReactNode;
}

/**
 * 카드 리스트의 상태
 * @case loading - 로딩 상태
 * @case empty - 빈 상태
 * @case contents - 카드 리스트 상태
 */
type CardListStatus = 'loading' | 'empty' | 'contents';

/**
 * @description `CardList`카드 리스트 컴포넌트는 카드 리스트의 상태에 따라 스켈레톤, 빈 카드, 카드 리스트를 렌더링합니다.
 * @param className - 카드 리스트 컴포넌트의 클래스명
 * @param list - 카드 리스트의 데이터
 * @param isLoading - 로딩 상태
 * @param numbersOfSkeleton - 스켈레톤 카드의 개수
 * @param skeletonUI - 스켈레톤 카드의 UI
 * @param emptyUI - 빈 카드의 UI
 * @param errorCardUI - 에러 카드의 UI
 * @param children - 카드 리스트의 아이템 렌더링 함수
 */
const CardList = <T,>({
  className,
  list,
  isLoading = false,
  numbersOfSkeleton = 5,
  skeletonUI = null,
  emptyUI = <div aria-label="데이터가 없습니다" />,
  errorCardUI = (
    <div className={cn(cardErrorStyles)} aria-label="오류가 발생했습니다" />
  ),
  children,
}: Props<T>) => {
  /** 카드 리스트의 상태 */
  const status = useMemo<CardListStatus>(() => {
    if (isLoading || !list) {
      return 'loading';
    }

    if (list.length === 0) {
      return 'empty';
    }

    return 'contents';
  }, [isLoading, list]);

  /** 스켈레톤 카드 렌더링 함수 */
  const renderSkeletonCards = useCallback(() => {
    return Array.from({ length: numbersOfSkeleton }).map((_, index) =>
      skeletonUI ? (
        <div key={index} className={cn(cardStyles)} aria-label="로딩 중">
          {React.cloneElement(skeletonUI, {
            ...(skeletonUI.props || {}),
          })}
        </div>
      ) : (
        <ErrorBoundary key={index} fallback={errorCardUI}>
          <div className={cn(cardStyles)} aria-label="로딩 중">
            {children({} as T, index)}
          </div>
        </ErrorBoundary>
      )
    );
  }, [numbersOfSkeleton, skeletonUI, errorCardUI, children]);

  /** 카드 리스트 렌더링 함수 */
  const renderContentCards = useCallback(() => {
    return list!.map((item, index) => (
      <ErrorBoundary
        key={(item as { id: string })?.id ?? index}
        fallback={errorCardUI}
      >
        <div className={cn(cardStyles)}>{children(item, index)}</div>
      </ErrorBoundary>
    ));
  }, [list, errorCardUI, children]);

  /** 카드 리스트 렌더링 함수 */
  const cardList = useMemo(() => {
    switch (status) {
      case 'loading':
        return renderSkeletonCards();
      case 'contents':
        return renderContentCards();
      default:
        return emptyUI;
    }
  }, [status, emptyUI, renderSkeletonCards, renderContentCards]);

  // 검증 로직
  useEffect(() => {
    // 로딩이 끝났는데, 리스트가 배열이 아니면 에러
    if (!isLoading && !Array.isArray(list)) {
      throw new Error('list is not an array');
    }
  }, [list, isLoading]);

  return <div className={cn(cardListStyles, className)}>{cardList}</div>;
};

export { CardList };
export type { Props as CardListProps };
