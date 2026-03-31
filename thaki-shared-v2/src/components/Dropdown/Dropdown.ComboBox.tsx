import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Option, { isOptionPlaceholder } from './Dropdown.Option';
import { DropdownProps, OptionProps, OptionValue } from './Dropdown.types';

import { useClickOutside } from '../../services';
import { cn } from '../../services/utils/cn';
import { ChevronDownIcon } from '../Icon';
import Portal from '../Portal';
import {
  dropdownArrowStyles,
  dropdownContainerStyles,
  dropdownOptionsStyles,
  dropdownTriggerButtonStyles,
  dropdownTriggerStyles,
  noResultButtonStyles,
  noResultStyles,
} from './Dropdown.styles';
import {
  calculateHasFullyRotated,
  calculateNewlyFocusedIndex,
  calculateOptionListHeight,
} from './helper';

type ComboBoxProps = DropdownProps & {
  /** 검색 결과가 없을 때 표시할 텍스트 */
  noResult?: string;
};

/**
 * @description
 * Dropdown.ComboBox 컴포넌트는 콤보박스 형태의 입력 및 선택 UI를 제공하며,
 * 사용자가 직접 입력하거나 옵션 목록에서 선택할 수 있도록 합니다.
 *
 * 주요 기능:
 * - 텍스트 입력과 드롭다운 선택을 결합한 콤보박스를 제공합니다.
 * - 입력값에 따른 옵션 필터링을 지원합니다.
 * - 키보드 네비게이션(↑, ↓, Enter, Esc)을 지원합니다.
 * - 웹 접근성 표준을 준수합니다.
 *
 * @param className - 콤보박스 컴포넌트의 클래스 이름
 * @param value - 현재 선택된 값
 * @param defaultValue - 기본 선택값 (기본값: '')
 * @param placeholder - 입력 필드의 플레이스홀더 텍스트
 * @param disabled - 콤보박스 비활성화 여부 (기본값: false)
 * @param isLoading - 로딩 상태 여부 (기본값: false)
 * @param noData - 옵션이 없을 때 표시할 텍스트 (기본값: 'No Data')
 * @param size - 콤보박스 크기 (기본값: 'md')
 * @param numbersOfOptionsInView - 한 번에 보여질 옵션 개수 (기본값: 5)
 * @param onChange - 값 변경 시 호출되는 콜백 함수
 * @param onSelect - 옵션 선택 시 호출되는 콜백 함수
 * @param children - 드롭다운 옵션들 (Dropdown.Option 컴포넌트들)
 * @returns 콤보박스 컴포넌트
 */
const ComboBox = ({
  className,
  value,
  defaultValue = '',
  placeholder,
  disabled = false,
  isLoading = false,
  noData = 'No Data',
  noResult = 'No Result',
  size = 'md',
  numbersOfOptionsInView = 5,
  onChange,
  onSelect,
  children,
}: ComboBoxProps) => {
  const id = useId();

  const [isOpened, setIsOpened] = useState(false);
  const [selected, setSelected] = useState<OptionValue>(value ?? defaultValue);
  const [inputValue, setInputValue] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [optionListHeight, setOptionListHeight] = useState(0);

  /** 이전 포커스된 옵션의 인덱스를 저장하는 레퍼런스 */
  const prevFocusedIndexRef = useRef(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerInputRef = useRef<HTMLInputElement>(null);
  const dropdownListRef = useRef<HTMLUListElement>(null);

  /** 드롭다운 리스트 요소 ID (포탈에 있는것 선택시 사용) */
  const dropdownListId = `${id}-dropdown-options`;

  const getOptionDomId = useCallback(
    (index: number): string => `${dropdownListId}-option-${index}`,
    [dropdownListId]
  );

  const scrollOptionIntoView = useCallback((optionEl: HTMLElement): void => {
    const listEl = dropdownListRef.current;
    if (!listEl) {
      return;
    }

    const optionTop = optionEl.offsetTop;
    const optionBottom = optionTop + optionEl.offsetHeight;
    const viewTop = listEl.scrollTop;
    const viewBottom = viewTop + listEl.clientHeight;

    if (optionTop < viewTop) {
      listEl.scrollTop = optionTop;
      return;
    }

    if (optionBottom > viewBottom) {
      listEl.scrollTop = optionBottom - listEl.clientHeight;
    }
  }, []);

  /** 유효한 옵션 목록 */
  const validOptions = useMemo(
    () =>
      React.Children.toArray(children).filter((child) => {
        // OptionPlaceholder 컴포넌트인지 확인 (Module Federation 호환을 위해 displayName 체크)
        if (!React.isValidElement(child) || !isOptionPlaceholder(child.type)) {
          throw new Error('Dropdown.Option 컴포넌트가 아닙니다.');
        }

        return true;
      }),
    [children]
  );

  /** 옵션 목록의 value를 키로 하는 딕셔너리 */
  const optionMap = useMemo(
    () =>
      validOptions.reduce(
        (map, child, index) => {
          const {
            props: { value, label },
          } = child as React.ReactElement<OptionProps>;

          return {
            ...map,
            [String(value)]: { label, index },
          };
        },
        {} as Record<string, { label: string; index: number }>
      ),
    [validOptions]
  );

  /** 옵션 선택 핸들러 */
  const handleSelect = useCallback(
    (value: OptionValue, index: number) => {
      onSelect?.(value);

      if (selected !== value) {
        onChange?.(value);
      }

      setSelected(value);

      setFocusedIndex(index);

      // 선택된 옵션에 대한 라벨
      const { label: selectedOptionLabel = '' } = optionMap[String(value)] ?? {};

      setInputValue(selectedOptionLabel);

      setIsOpened((current) => !current);
    },
    [selected, onChange, onSelect, optionMap]
  );

  /** 필터링된 옵션 목록 */
  const filteredOptions = useMemo(
    () =>
      validOptions.filter((child) => {
        const {
          props: { label },
        } = child as React.ReactElement<OptionProps>;

        return label.toLowerCase().includes(inputValue.toLowerCase());
      }),
    [validOptions, inputValue]
  );

  /** 옵션 요소 UI 목록 */
  const optionElements = useMemo(
    () =>
      filteredOptions.map((child, index) => {
        const {
          props: { value, label, disabled, onClick },
        } = child as React.ReactElement<OptionProps>;

        return React.createElement(Option, {
          key: String(value ?? index),
          id: getOptionDomId(index),
          index,
          label,
          value,
          selected: selected === value,
          focused: focusedIndex === index,
          disabled: Boolean(disabled),
          onClick: (value: OptionValue) => {
            onClick?.(value);
            handleSelect(value, index);
          },
        });
      }),
    [filteredOptions, selected, focusedIndex, handleSelect, getOptionDomId]
  );

  /**
   * 옵션 목록의 상태 메모이제이션
   *
   * @field hasNoOptions 옵션이 없는 상황
   * @field isActive 드롭다운이 활성화된 상황
   */
  const { hasNoOptions, isActive } = useMemo(
    () => ({
      hasNoOptions: !isLoading && optionElements.length === 0,
      isActive: !isLoading && !disabled && isOpened,
    }),
    [isLoading, disabled, isOpened, optionElements.length]
  );

  /**
   * 드롭다운 값의 상태에 대한 메모이제이션
   *
   * @field labelOnValueProp 외부에서 주입된 value로 찾은 옵션의 label
   * @field indexOnValueProp 외부에서 주입된 value로 찾은 옵션의 index
   */
  const { labelOnValueProp, indexOnValueProp } = useMemo(() => {
    const optionOnValue = optionMap[String(value)] ?? {};

    return {
      labelOnValueProp: optionOnValue.label,
      indexOnValueProp: optionOnValue.index,
    };
  }, [optionMap, value]);

  /** 키보드 이벤트 핸들러 */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
        if (focusedIndex >= 0) {
          /** 엔터를 쳐서 키보드 포커스된 옵션을 선택 */
          const { props: focusedOptionProp } = optionElements[focusedIndex] ?? {};

          if (!focusedOptionProp || focusedOptionProp.disabled) {
            return;
          }

          handleSelect(focusedOptionProp.value, 0);
        }
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault(); // <-- 의도하지 않은 인풋 커서 움직임 방지

        setFocusedIndex((prevFocusedIndex) => {
          /** 키보드 화살표 위를 눌렀을 때, 포커스되는 옵션의 index 계산 */
          const newlyFocusedIndex = calculateNewlyFocusedIndex(
            prevFocusedIndex,
            optionElements.length,
            'up'
          );

          /** 키보드 화살표 위를 눌렀을 때, 한 바퀴를 돌아서 마지막으로 돌아가는지 여부 계산 */
          const hasFullyRotated = calculateHasFullyRotated(
            prevFocusedIndex,
            newlyFocusedIndex,
            optionElements.length,
            'up'
          );

          // 키보드 화살표 위를 눌렀을 때, 한 바퀴를 돌아서 마지막으로 돌아가는 경우, prevFocusedIndexRef를 -1로 설정
          prevFocusedIndexRef.current = hasFullyRotated ? -1 : prevFocusedIndex;

          return newlyFocusedIndex;
        });
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault(); // <-- 의도하지 않은 인풋 커서 움직임 방지

        setFocusedIndex((prevFocusedIndex) => {
          /** 키보드 화살표 아래를 눌렀을 때, 포커스되는 옵션의 index 계산 */
          const newlyFocusedIndex = calculateNewlyFocusedIndex(
            prevFocusedIndex,
            optionElements.length,
            'down'
          );

          /** 키보드 화살표 아래를 눌렀을 때, 한 바퀴를 돌아서 처음으로 돌아가는지 여부 계산 */
          const hasFullyRotated = calculateHasFullyRotated(
            prevFocusedIndex,
            newlyFocusedIndex,
            optionElements.length,
            'down'
          );

          // 키보드 화살표 아래를 눌렀을 때, 한 바퀴를 돌아서 처음으로 돌아가는 경우, prevFocusedIndexRef를 -1로 설정
          prevFocusedIndexRef.current = hasFullyRotated ? -1 : prevFocusedIndex;

          return newlyFocusedIndex;
        });
      }

      if (e.key === 'Escape') {
        setIsOpened(false);
        triggerInputRef.current?.blur();
      }
    },
    [focusedIndex, optionElements, handleSelect]
  );

  /** 인풋 변경 핸들러 */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setFocusedIndex(0);
    setIsOpened(true);
  }, []);

  // <-------- 비활성화 또는 로딩 상태일 때 드롭다운 닫히는 effect -------->
  useEffect(() => {
    // 비활성화 또는 로딩중이면 드롭다운 닫기
    if (disabled || isLoading) {
      setIsOpened(false);
    }
  }, [disabled, isLoading]);

  // <-------- 외부에서 주입된 value로 찾은 옵션의 label, index를 선택상태와 포커스상태에 반영하는 effect (외부에서 강제로 value 변환하거나 mount 이후에 value가 변동되는 상황에 대응) -------->
  useEffect(() => {
    // 라벨이 있다면 그에 해당하는 옵션이 있다는 뜻이므로, 그 옵션의 value로 선택상태 변경
    const nextSelected: OptionValue = labelOnValueProp ? (value ?? '') : '';
    setSelected((prev) => (prev === nextSelected ? prev : nextSelected));

    // 위의 옵션에 해당하는 라벨로 인풋값 상태 변경
    const nextInputValue = labelOnValueProp ?? '';
    setInputValue((prev) => (prev === nextInputValue ? prev : nextInputValue));
  }, [value, labelOnValueProp, indexOnValueProp]);

  // <-------- 로딩이 끝났는데, 유효한 옵션의 갯수가 0이면 노데이터 처리 -------->
  useEffect(() => {
    if (!isLoading && validOptions.length === 0) {
      setInputValue(noData);
    }
  }, [isLoading, noData, validOptions.length]);

  // <-------- 드롭다운의 옵션리스트 높이를 계산하는 effect -------->
  useEffect(() => {
    if (!isOpened) return;

    setTimeout(() => {
      const singleOptionElement = dropdownListRef.current?.querySelector('.dropdown-option');
      const optionHeight = (singleOptionElement as HTMLElement)?.offsetHeight || 40;
      setOptionListHeight(
        calculateOptionListHeight(optionElements.length, optionHeight, numbersOfOptionsInView)
      );
    }, 50);
  }, [isOpened, optionElements.length, numbersOfOptionsInView]);

  // <-------- focusedIndex가 변경될 때 해당 요소로 스크롤하는 effect -------->
  useEffect(() => {
    if (focusedIndex < 0 || !isActive) {
      return;
    }

    const listEl = dropdownListRef.current;
    const focusedElement = listEl?.querySelector<HTMLElement>(
      `[data-option-index="${focusedIndex}"]`
    );

    if (!focusedElement) {
      return;
    }

    // NOTE: scrollIntoView는 상위 스크롤 컨테이너(window)를 움직일 수 있어,
    // 옵션 리스트(ul) 내부 스크롤만 조정합니다.
    scrollOptionIntoView(focusedElement);

    // 다음 스크롤을 위해 prevFocusedIndexRef 업데이트
    prevFocusedIndexRef.current = focusedIndex;
  }, [focusedIndex, isActive, scrollOptionIntoView]);

  // <-------- 외부 클릭 시 드롭다운 닫히는 effect -------->
  useClickOutside(containerRef, {
    onClickOutside: (event) => {
      // 포탈 영역(옵션 리스트) 내부 클릭인지 확인
      const portalElement = dropdownListRef.current;

      if (portalElement?.contains(event.target as Node)) {
        return; // 포탈 영역 내부 클릭이면 드롭다운 닫지 않음
      }

      // 포탈 영역 외부 클릭이면 드롭다운 닫기
      setIsOpened(false);
    },
  });

  return (
    <div
      ref={containerRef}
      className={cn(dropdownContainerStyles({ loading: isLoading }), className)}
    >
      <label className={cn(dropdownTriggerStyles)}>
        <input
          ref={triggerInputRef}
          className={cn(dropdownTriggerButtonStyles({ size, isInput: true }))}
          role="combobox"
          type="text"
          placeholder={placeholder}
          value={String(inputValue)}
          disabled={disabled || isLoading || validOptions.length === 0}
          aria-expanded={isOpened}
          aria-autocomplete="list"
          aria-controls={isOpened ? dropdownListId : undefined}
          aria-label={`${placeholder || '옵션 검색'}: ${inputValue || '입력되지 않음'}`}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          onClick={() => setIsOpened(!isOpened)}
        />
        <ChevronDownIcon
          size={12}
          className={cn(dropdownArrowStyles({ opened: isOpened, isInput: true }))}
          aria-hidden={true}
        />

        {isActive && (
          <Portal triggerRef={triggerInputRef} direction="bottom" gap={4}>
            <ul
              id={dropdownListId}
              ref={dropdownListRef}
              className={cn(dropdownOptionsStyles({ size }), 'dropdown-options')}
              role="listbox"
              aria-label="선택 가능한 옵션 목록"
              aria-activedescendant={focusedIndex >= 0 ? getOptionDomId(focusedIndex) : undefined}
              style={{ height: `${optionListHeight}px` }}
            >
              {hasNoOptions ? (
                <li className={cn(noResultStyles, 'dropdown-option')}>
                  <button
                    className={cn(noResultButtonStyles)}
                    onClick={() => setIsOpened(false)}
                    aria-label="검색 결과 없음"
                  >
                    {noResult}
                  </button>
                </li>
              ) : (
                optionElements
              )}
            </ul>
          </Portal>
        )}
      </label>
    </div>
  );
};

export default ComboBox;
