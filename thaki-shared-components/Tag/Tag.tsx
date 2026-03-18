import type { ReactElement } from 'react';
import { cn } from '../../services/utils/cn';
import { CloseSmallIcon } from '../Icon';
import {
  tagVariants,
  tagTextWrapperStyles,
  tagTextStyles,
  tagSeparatorBase,
  tagCloseButtonStyles,
} from './Tag.styles';

type TagVariant = 'filter' | 'multiSelect';

/**
 * Tag 컴포넌트의 Props
 */
type Props = {
  /** 태그에 표시될 메인 라벨 텍스트 */
  label: string;
  /** 구분자 뒤에 표시되는 선택적 값 */
  value?: string;
  /** 닫기 버튼 클릭 시 호출되는 콜백 함수 */
  onClose?: () => void;
  /** 추가 CSS 클래스명 */
  className?: string;
  /** 닫기 버튼의 커스텀 aria-label */
  ariaLabel?: string;
  /** 태그 스타일 변형 */
  variant?: TagVariant;
};

/**
 * [Design System] 태그 컴포넌트
 *
 * 필터나 선택된 값을 표시하는 태그입니다.
 *
 * @example
 * // 기본 태그 (라벨만)
 * <Tag label="카테고리" />
 *
 * @example
 * // 라벨 + 값
 * <Tag label="상태" value="활성" />
 *
 * @example
 * // 삭제 가능한 태그
 * <Tag label="태그" onClose={() => handleRemove('tag')} />
 *
 * @example
 * // 필터 표시용
 * <Tag label="지역" value="서울" onClose={handleRemoveFilter} />
 *
 * @example
 * // 다중 선택 스타일
 * <Tag label="선택됨" variant="multiSelect" onClose={handleRemove} />
 *
 * @example
 * // 선택된 필터 목록
 * {filters.map(filter => (
 *   <Tag
 *     key={filter.key}
 *     label={filter.label}
 *     value={filter.value}
 *     onClose={() => removeFilter(filter.key)}
 *   />
 * ))}
 *
 * @param label - 메인 라벨 텍스트
 * @param value - 구분자 뒤에 표시되는 값 (선택)
 * @param onClose - 닫기 버튼 클릭 콜백
 * @param variant - 스타일 변형 ('filter' | 'multiSelect')
 * @param ariaLabel - 닫기 버튼 aria-label
 * @param className - 추가 CSS 클래스
 */
const Tag = ({
  label,
  value,
  onClose,
  className,
  ariaLabel,
  variant = 'filter',
}: Props): ReactElement => {
  const isMultiSelect = variant === 'multiSelect';

  return (
    <div className={cn(tagVariants({ variant }), className)}>
      <span className={tagTextWrapperStyles}>
        <span className={tagTextStyles}>{label}</span>
        {value && (
          <>
            <span
              className={cn(tagSeparatorBase, isMultiSelect && 'text-text-inverse opacity-[0.64]')}
            >
              |
            </span>
            <span className={tagTextStyles}>{value}</span>
          </>
        )}
      </span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={tagCloseButtonStyles}
          aria-label={ariaLabel || `Remove ${label}`}
        >
          <CloseSmallIcon size={12} />
        </button>
      )}
    </div>
  );
};

export default Tag;
