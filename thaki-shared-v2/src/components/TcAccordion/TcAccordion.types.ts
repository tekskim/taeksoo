import type { Dispatch, ReactNode, SetStateAction } from 'react';

/**
 * TcAccordion 컴포넌트의 프로퍼티 타입.
 * 단일 아코디언 항목의 동작과 렌더링을 제어합니다.
 */
interface TcAccordionProps {
  /** 아코디언 항목의 고유 식별자. TcAccordionGroup 내에서 사용할 때 필수입니다. */
  id?: string | number;
  /** 아코디언 컨테이너에 적용할 CSS 클래스명 */
  className?: string;
  /** 아코디언 헤더 영역에 렌더링될 콘텐츠 */
  header?: ReactNode;
  /** 아코디언 본문(펼쳐지는 영역)에 렌더링될 콘텐츠 */
  children: ReactNode;
  /** 아코디언 열림 상태를 제어하는 값. 지정하면 제어 컴포넌트로 동작합니다. */
  isOpen?: boolean;
  /** 초기 열림 상태 (제어되지 않는 컴포넌트일 때만 사용). 기본값은 false입니다. */
  defaultOpen?: boolean;
  /** true일 때 아코디언과 상호작용을 비활성화합니다. */
  disabled?: boolean;
  /** 열림/닫힘 상태가 변경될 때마다 호출되는 콜백 */
  onToggle?: () => void;
  /** 아코디언이 열릴 때 호출되는 콜백 */
  onOpen?: () => void;
  /** 아코디언이 닫힐 때 호출되는 콜백 */
  onClose?: () => void;
}

/**
 * TcAccordionGroup 컴포넌트의 프로퍼티 타입.
 * 여러 아코디언 항목들을 그룹화하고 상태를 관리합니다.
 */
interface TcAccordionGroupProps {
  /** 아코디언 그룹 컨테이너에 적용할 CSS 클래스명 */
  className?: string;
  /** 아코디언 그룹의 자식 요소들 (TcAccordion 항목들을 포함) */
  children: ReactNode;
  /** true일 때 여러 아코디언을 동시에 열 수 있습니다. 기본값은 true입니다. */
  multiple?: boolean;
}

/**
 * TcAccordionContext에서 제공하는 상태와 핸들러의 타입.
 * 그룹 내 아코디언 항목들 간의 상태 동기화를 담당합니다.
 */
interface TcAccordionContextValue {
  /** 현재 열려있는 아코디언 항목들의 id를 담는 Set */
  openedAccordionIds: Set<string | number>;
  /** openedAccordionIds 상태를 업데이트하는 함수 */
  setOpenedAccordionIds: Dispatch<SetStateAction<Set<string | number>>>;
  /** TcAccordionGroup 내부에 있는지 여부 */
  isGrouped: boolean;
  /** TcAccordionGroup의 multiple 설정값 */
  multiple: boolean;
}

export type { TcAccordionProps, TcAccordionGroupProps, TcAccordionContextValue };
