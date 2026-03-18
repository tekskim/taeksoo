import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { cn } from '../../services/utils/cn';
import { ExpandOffIcon } from '../Icon/svg';
import {
  disclosureContentStyles,
  disclosureHeaderStyles,
  disclosureIconWrapperStyles,
  disclosureLabelStyles,
  disclosureOptionalTextStyles,
  disclosureSectionStyles,
} from './Disclosure.styles';

interface DisclosureProps {
  /** 추가 CSS 클래스명 */
  className?: string;
  width?: CSSProperties['width'];
  /** 메인 라벨 텍스트 */
  label?: string;
  /** 확장/축소할 콘텐츠 */
  children?: ReactNode;
  /** 확장 상태 (외부에서 주입 시 사용) */
  expanded?: boolean;
  /** 확장 상태 변경 핸들러 */
  onExpandChange?: (expanded: boolean) => void;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 닫혀있을 때도 content DOM을 유지함. 복잡한 content나 상태 유지가 필요할 때 사용 */
  keepMounted?: boolean;
  /** 헤더 클릭 시 호출되는 핸들러 */
  onClick?: () => void;
}

/**
 * Disclosure 컴포넌트 - 확장/축소 가능한 섹션
 *
 * @param props.className - 추가 CSS 클래스명
 * @param props.label - 메인 라벨 텍스트
 * @param props.children - 확장/축소할 콘텐츠
 * @param props.expanded - 확장 상태 (외부에서 주입 시 사용)
 * @param props.onExpandChange - 확장 상태 변경 핸들러
 * @param props.disabled - 비활성화 상태
 * @param props.keepMounted - 닫혀있을 때도 content DOM을 유지함
 * @param props.onClick - 헤더 클릭 시 호출되는 핸들러
 * @returns Disclosure UI 컴포넌트
 */
const Disclosure = ({
  className,
  width,
  label,
  children,
  expanded,
  onExpandChange,
  disabled = false,
  keepMounted = false,
  onClick,
}: DisclosureProps) => {
  const [internalExpanded, setInternalExpanded] = useState(false);

  const isExpanded = expanded !== undefined ? expanded : internalExpanded;

  const handleClick = useCallback(() => {
    if (disabled) return;

    const newExpanded = !isExpanded;

    if (expanded === undefined) {
      setInternalExpanded(newExpanded);
    }

    onExpandChange?.(newExpanded);
    onClick?.();
  }, [disabled, isExpanded, expanded, onExpandChange, onClick]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [disabled, handleClick]
  );

  return (
    <div
      className={cn(disclosureSectionStyles({ disabled }), className)}
      style={{ width }}
      data-expanded={isExpanded}
      data-disabled={disabled}
    >
      <button
        className={disclosureHeaderStyles({ disabled })}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isExpanded}
        aria-disabled={disabled}
      >
        <div className={disclosureIconWrapperStyles({ expanded: isExpanded })}>
          <ExpandOffIcon size={12} weight="fill" variant="secondary" />
        </div>
        {label && (
          <span className={disclosureLabelStyles}>
            {(() => {
              // Parse label to separate main text from "(optional)" or "(Optional)"
              // Handles both "Text(optional)" and "Text (optional)" formats
              const optionalMatch = label.match(/^(.+?)\s*(\([Oo]ptional\))$/);
              if (optionalMatch) {
                const [, mainText, optionalText] = optionalMatch;
                return (
                  <>
                    {mainText} <span className={disclosureOptionalTextStyles}>{optionalText}</span>
                  </>
                );
              }
              return label;
            })()}
          </span>
        )}
      </button>
      {children && (
        <div className={disclosureContentStyles} style={{ display: isExpanded ? 'block' : 'none' }}>
          {(keepMounted || isExpanded) && children}
        </div>
      )}
    </div>
  );
};

export default Disclosure;
