import { useEffect, useId, useRef, useState } from 'react';

import type { TcAccordionProps } from './TcAccordion.types';
import { useTcAccordionContext } from './TcAccordion.context';
import { TcAccordionGroup } from './TcAccordionGroup';
import { cn } from '../../services';
import {
  tcAccordionClosedClassnames,
  tcAccordionContentClassnames,
  tcAccordionDividerClassnames,
  tcAccordionDividerWrapperClassnames,
  tcAccordionContentPaddingClassnames,
  tcAccordionHeaderClassnames,
  tcAccordionItemClassnames,
  tcAccordionOpenClassnames,
} from './TcAccordion.styles';

/**
 * TcAccordion의 기본 구현 컴포넌트.
 * 아코디언 항목의 열림/닫힘 상태를 관리하고 렌더링합니다.
 * 제어 컴포넌트(isOpen) 또는 비제어 컴포넌트(defaultOpen)로 사용 가능합니다.
 * TcAccordionGroup 내에서 사용할 때는 id prop이 필수입니다.
 */
const TcAccordionBase = ({
  id,
  className,
  onToggle,
  onOpen,
  onClose,
  isOpen: controlledIsOpen,
  defaultOpen = false,
  disabled = false,
  header,
  children,
}: TcAccordionProps) => {
  const { isGrouped, multiple, openedAccordionIds, setOpenedAccordionIds } =
    useTcAccordionContext();

  if (process.env.NODE_ENV !== 'production' && isGrouped && !id) {
    console.error(
      '[TcAccordion] TcAccordionGroup 안에서 사용할 때는 id prop이 필요합니다.\n' +
        '예시: <TcAccordion id="accordion-1" ...>'
    );
  }

  const [isOpen, setIsOpen] = useState(controlledIsOpen ?? defaultOpen);

  const tempId = useId();
  const accordionId = `tc-accordion-${id ?? tempId}-panel`;

  const isMounted = useRef(false);
  const isGroupSynced = useRef(false);

  /**
   * 아코디언의 열림/닫힘 상태를 토글합니다.
   * 비활성화 상태에서는 동작하지 않습니다.
   * TcAccordionGroup 내에서는 그룹의 상태 관리자에 의해 제어됩니다.
   */
  const handleToggle = () => {
    if (disabled) {
      return;
    }

    if (isGrouped && id && !multiple) {
      setOpenedAccordionIds((prev) => (prev.has(id) ? new Set() : new Set([id])));
    } else {
      setIsOpen(!isOpen);
    }

    (isOpen ? onClose : onOpen)?.();
    onToggle?.();
  };

  /**
   * 아코디언 헤더의 키보드 이벤트를 처리합니다.
   * Enter 키 입력 시 아코디언을 토글합니다.
   */
  const handleHeaderKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      handleToggle();
    }
  };

  useEffect(() => {
    if (!isMounted.current || typeof controlledIsOpen !== 'boolean') {
      isMounted.current = true;
      return;
    }

    setIsOpen(controlledIsOpen);
    (controlledIsOpen ? onOpen : onClose)?.();
    onToggle?.();
    // onOpen/onClose/onToggle은 의도적으로 deps에서 제외.
    // controlledIsOpen 변경 시점의 콜백만 호출하면 충분하며,
    // 콜백 참조가 바뀔 때마다 effect가 재실행되는 것을 방지함.
    // 호출부에서 useCallback으로 콜백을 안정화하는 것을 권장.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledIsOpen]);

  useEffect(() => {
    if (!isGrouped || !id) {
      return;
    }

    if (!isGroupSynced.current) {
      isGroupSynced.current = true;
      if (isOpen) {
        if (multiple) {
          // multiple=true에서는 동시 마운트 defaultOpen 항목들을 누적해야 한다.
          setOpenedAccordionIds((prev) => new Set([...prev, id]));
        } else {
          // multiple=false에서는 마지막으로 동기화된 defaultOpen 항목 하나만 유지한다.
          setOpenedAccordionIds(new Set([id]));
        }
      }

      return;
    }

    const nextIsOpen = openedAccordionIds.has(id);

    if (isOpen && !nextIsOpen) {
      onClose?.();
      onToggle?.();
    }

    setIsOpen(nextIsOpen);
    // isOpen/onClose/onToggle/multiple은 의도적으로 deps에서 제외.
    // - isOpen: openedAccordionIds 변경 시점의 렌더 값을 그대로 읽으면 충분함.
    // - onClose/onToggle: 콜백 참조 변경으로 인한 불필요한 재실행 방지.
    // - multiple: 마운트 초기화 시점에만 필요하며, 동적 변경은 지원하지 않음.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isGrouped, openedAccordionIds, setOpenedAccordionIds]);

  return (
    <div className={cn(tcAccordionItemClassnames, className)}>
      <div
        aria-expanded={isOpen}
        aria-controls={accordionId}
        aria-disabled={disabled}
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={cn(tcAccordionHeaderClassnames, {
          'cursor-not-allowed': disabled,
        })}
        onClick={handleToggle}
        onKeyDown={handleHeaderKeyDown}
      >
        {header}
      </div>
      <div
        id={accordionId}
        role="region"
        className={cn(
          tcAccordionContentClassnames,
          isOpen ? tcAccordionOpenClassnames : tcAccordionClosedClassnames
        )}
      >
        <div className="overflow-hidden">
          <div className={cn(tcAccordionDividerWrapperClassnames)}>
            <div className={cn(tcAccordionDividerClassnames)} />
          </div>
          <div className={cn(tcAccordionContentPaddingClassnames)}>{children}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * TcAccordion 컴포넌트는 기본 아코디언 기능을 제공합니다.
 * TcAccordionGroup과 함께 사용하여 여러 아코디언 항목을 관리할 수 있습니다.
 *
 * 사용 예시:
 * ```
 * <TcAccordion.Group multiple>
 *   <TcAccordion id="item1" header="헤더">내용</TcAccordion>
 *   <TcAccordion id="item2" header="헤더">내용</TcAccordion>
 * </TcAccordion.Group>
 * ```
 */
export const TcAccordion = Object.assign(TcAccordionBase, {
  Group: TcAccordionGroup,
});
