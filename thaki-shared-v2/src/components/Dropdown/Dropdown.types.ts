/**
 * @fileoverview Dropdown 컴포넌트의 타입 정의
 *
 * 이 파일은 Dropdown 컴포넌트와 관련된 모든 타입을 정의합니다.
 * OptionValue, BasicOptionProps, OptionProps, DropdownProps 등이 포함됩니다.
 */

/**
 * Dropdown 옵션의 값 타입
 *
 * @description 드롭다운에서 선택할 수 있는 옵션의 값 타입입니다.
 * 문자열, 숫자, 불린 값을 모두 지원합니다.
 *
 * @example
 * ```ts
 * const stringValue: OptionValue = "option1";
 * const numberValue: OptionValue = 42;
 * const booleanValue: OptionValue = true;
 * ```
 */
type OptionValue = string | number | boolean;

/**
 * 드롭다운 옵션의 기본 속성
 *
 * @description 드롭다운의 각 옵션 항목이 가져야 하는 기본적인 속성들을 정의합니다.
 */
type BasicOptionProps = {
  /** 옵션의 고유 값 (필수) */
  value: OptionValue;
  /** 사용자에게 보여질 옵션의 표시 텍스트 (필수) */
  label: string;
  /** 옵션의 비활성화 여부 */
  disabled?: boolean;
  /** 옵션 클릭 시 실행될 콜백 함수 */
  onClick?: (value: OptionValue) => void;
};

/**
 * 드롭다운 옵션의 완전한 속성
 *
 * @description BasicOptionProps를 확장하여 드롭다운 컴포넌트 내부에서
 * 옵션의 상태를 관리하는 추가 속성들을 포함합니다.
 *
 * @extends BasicOptionProps
 */
type OptionProps = BasicOptionProps & {
  /** 드롭다운 내부 렌더링용 옵션 DOM id (aria-activedescendant 등에서 사용) */
  id: string;
  /** 드롭다운 내부 렌더링용 옵션 인덱스 */
  index: number;
  /** 현재 옵션이 선택되었는지 여부 */
  selected: boolean;
  /** 현재 옵션이 키보드 포커스를 받았는지 여부 */
  focused: boolean;
};

/**
 * Dropdown 컴포넌트의 props
 *
 * @description Dropdown 컴포넌트에 전달되는 모든 속성을 정의합니다.
 */
type DropdownProps = {
  /** 추가 CSS 클래스명 */
  className?: string;
  /** 현재 선택된 옵션의 값 (제어 컴포넌트용) */
  value?: OptionValue;
  /** 초기 선택값 (비제어 컴포넌트용) */
  defaultValue?: OptionValue;
  /** 옵션이 선택되지 않았을 때 표시될 텍스트 */
  placeholder?: string;
  /** 드롭다운의 전체 비활성화 여부 */
  disabled?: boolean;
  /** 드롭다운의 크기 (기본값: 'md') */
  size?: 'sm' | 'md' | 'lg';
  /** 로딩 상태 표시 여부 */
  isLoading?: boolean;
  /** 옵션이 없을 때 표시될 메시지 */
  noData?: string;
  /** 한 번에 보여질 옵션의 개수 (기본값: 10) */
  numbersOfOptionsInView?: number;
  /** 값이 변경될 때 호출되는 콜백 함수 */
  onChange?: (value: OptionValue) => void;
  /** 옵션이 선택될 때 호출되는 콜백 함수 */
  onSelect?: (value: OptionValue) => void;
  /** 드롭다운 내부에 렌더링될 옵션 요소들 */
  children: React.ReactElement[];
};

export type { BasicOptionProps, DropdownProps, OptionProps, OptionValue };
