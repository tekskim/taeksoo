import React, { Children, isValidElement, memo, useCallback, useMemo, useState } from 'react';
import { cn } from '../../services/utils/cn';
import {
  accordionContentStyles,
  accordionGroupStyles,
  accordionHeaderStyles,
  accordionItemStyles,
} from './Accordion.styles';

interface AccordionRootProps {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  children: React.ReactNode;
  /** single 모드에서 모든 아이템을 닫을 수 있는지 여부. false면 항상 하나는 열려있어야 함 */
  collapsible?: boolean;
  /** 전체 아코디언을 비활성화 상태로 만듦. 모든 상호작용이 차단됨 */
  disabled?: boolean;
  /** 루트 컨테이너에 적용할 추가 CSS 클래스 */
  className?: string;
}

/**
 * [Design System] 아코디언 그룹 컴포넌트
 *
 * 접을 수 있는 콘텐츠 패널들을 관리하는 루트 컨테이너입니다.
 *
 * @example
 * // 기본 사용법 (단일 열림)
 * <Accordion.Group defaultValue="section1">
 *   <Accordion.Item id="section1" header="섹션 1">
 *     섹션 1 내용
 *   </Accordion.Item>
 *   <Accordion.Item id="section2" header="섹션 2">
 *     섹션 2 내용
 *   </Accordion.Item>
 * </Accordion.Group>
 *
 * @example
 * // 다중 열림 모드
 * <Accordion.Group type="multiple" defaultValue={['faq1', 'faq2']}>
 *   <Accordion.Item id="faq1" header="자주 묻는 질문 1">답변 1</Accordion.Item>
 *   <Accordion.Item id="faq2" header="자주 묻는 질문 2">답변 2</Accordion.Item>
 *   <Accordion.Item id="faq3" header="자주 묻는 질문 3">답변 3</Accordion.Item>
 * </Accordion.Group>
 *
 * @example
 * // Controlled 모드
 * <Accordion.Group value={openSection} onChange={setOpenSection}>
 *   <Accordion.Item id="details" header="상세 정보">상세 내용</Accordion.Item>
 *   <Accordion.Item id="settings" header="설정">설정 내용</Accordion.Item>
 * </Accordion.Group>
 *
 * @example
 * // 항상 하나 이상 열림 유지 (collapsible=false)
 * <Accordion.Group collapsible={false} defaultValue="first">
 *   <Accordion.Item id="first" header="첫 번째">내용</Accordion.Item>
 *   <Accordion.Item id="second" header="두 번째">내용</Accordion.Item>
 * </Accordion.Group>
 *
 * @example
 * // 비활성화 상태
 * <Accordion.Group disabled>
 *   <Accordion.Item id="item1" header="비활성화된 아이템">내용</Accordion.Item>
 * </Accordion.Group>
 *
 * @param type - 타입 ('single' | 'multiple', 기본: 'single')
 * @param defaultValue - 초기 열림 아이템 ID (uncontrolled)
 * @param value - 현재 열림 아이템 ID (controlled)
 * @param onChange - 열림/닫힘 변경 콜백
 * @param collapsible - single 모드에서 모두 닫기 허용 (기본: true)
 * @param disabled - 전체 비활성화
 * @param children - Accordion.Item 컴포넌트들
 */

const AccordionRoot: React.FC<AccordionRootProps> = ({
  type = 'single',
  defaultValue,
  value,
  onChange,
  children,
  collapsible = true,
  disabled = false,
  className,
}) => {
  const [internalValue, setInternalValue] = useState<Set<string>>(() => {
    const initial = value || defaultValue;
    if (!initial) return new Set();
    return new Set(typeof initial === 'string' ? [initial] : initial);
  });

  const isControlled = value !== undefined;

  const openItems = useMemo(() => {
    return isControlled
      ? new Set(typeof value === 'string' ? [value] : value || [])
      : internalValue;
  }, [isControlled, value, internalValue]);

  const toggle = useCallback(
    (itemId: string) => {
      // disabled 상태에서는 토글 차단
      if (disabled) return;

      if (isControlled) {
        // Controlled 모드
        const currentOpenItems = new Set(typeof value === 'string' ? [value] : value || []);
        const newOpenItems = new Set(currentOpenItems);

        if (newOpenItems.has(itemId)) {
          // 아이템을 닫으려고 할 때
          // single 모드이고 collapsible이 false이면서 이것이 마지막 열린 아이템일 때는 닫지 않음
          if (type === 'single' && !collapsible && newOpenItems.size === 1) {
            return; // 닫기 차단
          }
          newOpenItems.delete(itemId);
        } else {
          if (type === 'single') {
            newOpenItems.clear();
          }
          newOpenItems.add(itemId);
        }

        const newValue =
          type === 'single' ? Array.from(newOpenItems)[0] || '' : Array.from(newOpenItems);

        onChange?.(newValue);
      } else {
        // Uncontrolled 모드
        setInternalValue((prevItems) => {
          const newOpenItems = new Set(prevItems);

          if (newOpenItems.has(itemId)) {
            // 아이템을 닫으려고 할 때
            // single 모드이고 collapsible이 false이면서 이것이 마지막 열린 아이템일 때는 닫지 않음
            if (type === 'single' && !collapsible && newOpenItems.size === 1) {
              return prevItems; // 상태 변경 없이 반환
            }
            newOpenItems.delete(itemId);
          } else {
            if (type === 'single') {
              newOpenItems.clear();
            }
            newOpenItems.add(itemId);
          }

          const newValue =
            type === 'single' ? Array.from(newOpenItems)[0] || '' : Array.from(newOpenItems);

          onChange?.(newValue);

          return newOpenItems;
        });
      }
    },
    [type, isControlled, value, onChange, disabled, collapsible]
  );

  // 각 itemId별로 안정적인 toggle 함수 캐시
  const toggleHandlers = useMemo(() => {
    const handlers = new Map<string, () => void>();

    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === AccordionItem) {
        const childProps = child.props as AccordionItemProps;
        const itemId = childProps.id;
        if (!handlers.has(itemId)) {
          // 각 itemId별로 고정된 함수 생성
          handlers.set(itemId, () => toggle(itemId));
        }
      }
    });

    return handlers;
  }, [children, toggle]);

  // 각 아이템별 메모이제이션된 컴포넌트 생성
  const renderedChildren = useMemo(() => {
    return Children.map(children, (child) => {
      if (!isValidElement(child)) return child;

      // AccordionItem인 경우에만 props 주입
      if (child.type === AccordionItem || child.type === MemoizedAccordionItem) {
        const childProps = child.props as AccordionItemProps;
        const itemId = childProps.id;
        const isOpen = openItems.has(itemId);

        // 메모이제이션된 컴포넌트 사용
        return React.createElement(MemoizedAccordionItem, {
          key: itemId, // 안정적인 key 사용
          ...childProps,
          isOpen,
          onToggle: toggleHandlers.get(itemId),
          disabled, // Root의 disabled 상태를 Item에 전달
        });
      }

      return child;
    });
  }, [children, openItems, toggleHandlers, disabled]);

  return <div className={cn(accordionGroupStyles, className)}>{renderedChildren}</div>;
};

interface AccordionItemProps {
  id: string;
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  /** 닫혀있을 때도 content DOM을 유지함. 복잡한 content나 상태 유지가 필요할 때 사용 */
  keepMounted?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
}

/**
 * AccordionItem 컴포넌트 - 아코디언의 개별 아이템 (헤더 + 콘텐츠)
 *
 * @param props.id - 아이템의 고유 식별자 (필수)
 * @param props.header - 클릭하여 펼치기/접기를 제어하는 헤더 영역 콘텐츠
 * @param props.children - 펼쳐졌을 때 표시되는 콘텐츠 영역
 * @param props.className - 아이템 컨테이너에 적용할 추가 CSS 클래스
 * @param props.style - 아이템 컨테이너에 적용할 인라인 스타일
 * @param props.aria-label - 스크린 리더를 위한 접근성 레이블
 * @param props.keepMounted - 닫혀있을 때도 content DOM을 유지함. 복잡한 content나 상태 유지가 필요할 때 사용 (기본값: false)
 * @param props.isOpen - 현재 열림 상태 (내부적으로 주입됨)
 * @param props.onToggle - 토글 함수 (내부적으로 주입됨)
 * @param props.disabled - 비활성화 상태 (내부적으로 주입됨)
 * @returns AccordionItem UI 컴포넌트
 */

const AccordionItem: React.FC<AccordionItemProps> = ({
  header,
  children,
  className,
  style,
  'aria-label': ariaLabel,
  keepMounted = false,
  isOpen = false,
  onToggle,
  disabled = false,
}) => {
  const handleClick = useCallback(() => {
    if (disabled) return;
    onToggle?.();
  }, [onToggle, disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle?.();
      }
    },
    [onToggle, disabled]
  );

  return (
    <div
      className={cn(accordionItemStyles({ disabled }), className)}
      style={style}
      data-open={isOpen}
      data-disabled={disabled}
    >
      <div
        className={accordionHeaderStyles({ disabled })}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-disabled={disabled}
        data-disabled={disabled}
      >
        {header}
      </div>
      {/* 애니메이션을 위해 content div는 항상 렌더링, children만 조건부 렌더링 */}
      <div className={accordionContentStyles}>{(keepMounted || isOpen) && children}</div>
    </div>
  );
};

// 성능 최적화를 위한 메모이제이션된 AccordionItem
const MemoizedAccordionItem = memo(AccordionItem, (prevProps, nextProps) => {
  // 중요한 props만 비교하여 불필요한 리렌더링 방지
  return (
    prevProps.id === nextProps.id &&
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.header === nextProps.header &&
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className &&
    prevProps.style === nextProps.style &&
    prevProps['aria-label'] === nextProps['aria-label'] &&
    prevProps.keepMounted === nextProps.keepMounted &&
    prevProps.disabled === nextProps.disabled
    // onToggle 함수는 toggleHandlers로 안정화되므로 비교하지 않음
  );
});

const AccordionObject = {
  Group: AccordionRoot,
  Item: AccordionItem,
};

export default AccordionObject;

export { AccordionRoot as Accordion, AccordionItem };
