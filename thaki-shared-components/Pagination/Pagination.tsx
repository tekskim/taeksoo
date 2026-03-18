import type { ReactElement } from 'react';
import { useCallback, useMemo } from 'react';
import { cn } from '../../services';
import { Button } from '../Button';
import { ChevronLeftIcon, ChevronRightIcon, SettingIcon } from '../Icon';
import {
  dividerStyles,
  ellipsisStyles,
  navButtonStyles,
  pageListStyles,
  paginationContainerStyles,
  totalCountStyles,
} from './Pagination.styles';

type Props = {
  className?: string;
  /** 전체 데이터 개수 */
  totalCount: number;
  /** 한 페이지에 표시할 데이터 개수 */
  size: number;
  /** 현재 페이지 */
  currentAt: number;
  /** 버튼 비활성화 여부 */
  disabled?: boolean;
  /** 이전 아이콘 */
  prevIcon?: ReactElement;
  /** 다음 아이콘 */
  nextIcon?: ReactElement;
  /** 설정 버튼 클릭 핸들러 */
  onSettingClick?: () => void;
  /** 설정 버튼 아이콘 */
  settingIcon?: ReactElement;
  /** 설정 버튼 접근성 라벨 */
  settingAriaLabel?: string;
  /** 설정 버튼 툴팁 */
  settingTooltip?: string;
  /** 전체 데이터 개수 표시 라벨 (예: "items", "개") - 설정 시 전체 개수 표시 */
  totalCountLabel?: string;
  /** 페이지 변경 시 호출되는 함수 */
  onPageChange: (
    page: number,
    data?: {
      /** 현재 페이지 */
      currentAt: number;
      /** 변경할 페이지 */
      targetAt: number;
      /** 이전 페이지 존재 여부 */
      hasPrev: boolean;
      /** 다음 페이지 존재 여부 */
      hasNext: boolean;
    }
  ) => void;
};

/**
 * [Design System] 페이지네이션 컴포넌트
 *
 * 페이지 네비게이션을 위한 컴포넌트입니다.
 * 7페이지 이상일 경우 첫/마지막 페이지를 항상 표시하고 말줄임표를 사용합니다.
 *
 * @example
 * // 기본 사용법
 * <Pagination
 *   totalCount={100}
 *   size={10}
 *   currentAt={currentPage}
 *   onPageChange={(page) => setCurrentPage(page)}
 * />
 *
 * @example
 * // API 파라미터와 연동
 * <Pagination
 *   totalCount={data.totalCount}
 *   size={params.size}
 *   currentAt={params.page}
 *   onPageChange={(page, info) => {
 *     setParams(prev => ({ ...prev, page }));
 *   }}
 * />
 *
 * @example
 * // 설정 버튼 포함 (페이지 크기 변경용)
 * <Pagination
 *   totalCount={totalCount}
 *   size={pageSize}
 *   currentAt={currentPage}
 *   onPageChange={handlePageChange}
 *   onSettingClick={() => setShowSizeModal(true)}
 *   settingTooltip="페이지 크기 변경"
 * />
 *
 * @example
 * // 전체 개수 표시 (divider + count label)
 * <Pagination
 *   totalCount={999}
 *   size={10}
 *   currentAt={1}
 *   onPageChange={handleChange}
 *   totalCountLabel="items"
 * />
 *
 * @param totalCount - 전체 데이터 개수
 * @param size - 페이지당 항목 수
 * @param currentAt - 현재 페이지 (1부터 시작)
 * @param disabled - 비활성화 여부
 * @param onPageChange - 페이지 변경 콜백
 * @param onSettingClick - 설정 버튼 클릭 콜백
 * @param totalCountLabel - 전체 개수 표시 라벨 (예: "items") - 설정 시 divider와 함께 전체 개수 표시
 */
const Pagination = ({
  className,
  totalCount = 100,
  size = 5,
  currentAt = 1,
  disabled = false,
  prevIcon = <ChevronLeftIcon size={16} />,
  nextIcon = <ChevronRightIcon size={16} />,
  onSettingClick,
  settingIcon = <SettingIcon size={16} />,
  settingAriaLabel = 'Open pagination settings',
  settingTooltip,
  totalCountLabel = 'items',
  onPageChange,
}: Props): ReactElement => {
  // NOTE: reserved for settings UI; avoid unused errors
  void settingIcon;
  void settingAriaLabel;
  void settingTooltip;
  void onSettingClick;

  /** 페이지네이션 처리할 총 페이지 수 */
  const numberOfPages = useMemo(() => Math.ceil(totalCount / size), [totalCount, size]);

  /** 최종 페이지 버튼 리스트 (말줄임표 포함) */
  const pageList = useMemo(() => {
    // 7페이지 미만: 모든 페이지 표시
    if (numberOfPages < 7) {
      return Array.from({ length: numberOfPages }, (_, i) => i + 1);
    }

    // 7페이지 이상: 첫/마지막 페이지 + 말줄임표 로직
    const pages: (number | string)[] = [];

    // 시작 근처 (1~4페이지): [1, 2, 3, 4, 5, '...', last]
    if (currentAt <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('end-ellipsis');
      pages.push(numberOfPages);
    }
    // 끝 근처: [1, '...', last-4, last-3, last-2, last-1, last]
    else if (currentAt >= numberOfPages - 3) {
      pages.push(1);
      pages.push('start-ellipsis');
      for (let i = numberOfPages - 4; i <= numberOfPages; i++) {
        pages.push(i);
      }
    }
    // 중간: [1, '...', curr-2, curr-1, curr, curr+1, curr+2, '...', last]
    else {
      pages.push(1);
      pages.push('start-ellipsis');
      for (let i = currentAt - 2; i <= currentAt + 2; i++) {
        pages.push(i);
      }
      pages.push('end-ellipsis');
      pages.push(numberOfPages);
    }

    return pages;
  }, [numberOfPages, currentAt]);

  /**
   * @field isPrevDisabled - 이전 버튼 비활성화 여부
   * @field isNextDisabled - 다음 버튼 비활성화 여부
   */
  const { isPrevDisabled, isNextDisabled } = useMemo(
    () => ({
      isPrevDisabled: currentAt === 1,
      isNextDisabled: currentAt === numberOfPages,
    }),
    [currentAt, numberOfPages]
  );

  const handleOnPageChange = useCallback(
    (page: number) => {
      if (page === currentAt) {
        return;
      }

      onPageChange(page, {
        currentAt,
        targetAt: page,
        hasPrev: page > 1,
        hasNext: page < numberOfPages,
      });
    },
    [onPageChange, currentAt, numberOfPages]
  );

  return (
    <>
      {totalCount > 0 && (
        <nav className={cn(paginationContainerStyles, className)} aria-label="Pagination">
          <ul className={pageListStyles}>
            <li>
              <Button
                className={navButtonStyles({ type: 'icon' })}
                disabled={disabled || isPrevDisabled}
                onClick={() => handleOnPageChange(currentAt - 1)}
                aria-label="Previous page"
                size="xs"
                type="button"
              >
                {prevIcon}
              </Button>
            </li>
            {pageList.map((page) => {
              // 말줄임표 렌더링
              if (typeof page === 'string') {
                return (
                  <li key={page} className={ellipsisStyles}>
                    <span aria-hidden="true">∙∙∙</span>
                  </li>
                );
              }

              // 페이지 번호 버튼 렌더링
              const isCurrent = currentAt === page;

              return (
                <li key={page}>
                  <Button
                    className={navButtonStyles({ type: 'page', current: isCurrent })}
                    disabled={disabled || isCurrent}
                    onClick={() => handleOnPageChange(page)}
                    aria-label={`Page ${page}`}
                    size="xs"
                    type="button"
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {page}
                  </Button>
                </li>
              );
            })}
            <li>
              <Button
                className={navButtonStyles({ type: 'icon' })}
                disabled={disabled || isNextDisabled}
                onClick={() => handleOnPageChange(currentAt + 1)}
                aria-label="Next page"
                size="xs"
                type="button"
              >
                {nextIcon}
              </Button>
            </li>
            {/* TODO: enable after v0.7
            {shouldRenderSettingButton && (
              <li>
                <Button
                  className={navButtonStyles({ type: 'setting' })}
                  disabled={disabled}
                  onClick={onSettingClick}
                  aria-label={settingAriaLabel}
                  size="xs"
                  type="button"
                  title={settingTooltip}
                >
                  {settingIcon}
                </Button>
              </li>
            )}
            */}
            {totalCountLabel && (
              <>
                <li aria-hidden="true">
                  <div className={dividerStyles} />
                </li>
                <li className={totalCountStyles}>
                  <span>{totalCount}</span>
                  <span>{totalCountLabel}</span>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </>
  );
};

export { Pagination };
