import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  dropdownValueStyles,
} from './Dropdown.styles';
import {
  calculateHasFullyRotated,
  calculateNewlyFocusedIndex,
  calculateOptionListHeight,
} from './helper';

/**
 * [Design System] 드롭다운 선택 컴포넌트
 *
 * 옵션 목록에서 단일 값을 선택하는 드롭다운입니다.
 * Portal 기반 렌더링, 키보드 네비게이션(↑↓ Enter Esc), 접근성 지원.
 *
 * @example
 * // 기본 사용법
 * <Dropdown.Select
 *   value={region}
 *   onChange={setRegion}
 *   placeholder="지역 선택"
 * >
 *   <Dropdown.Option value="kr" label="한국" />
 *   <Dropdown.Option value="us" label="미국" />
 *   <Dropdown.Option value="jp" label="일본" />
 * </Dropdown.Select>
 *
 * @example
 * // 크기 변형
 * <Dropdown.Select size="sm" placeholder="Small">...</Dropdown.Select>
 * <Dropdown.Select size="md" placeholder="Medium">...</Dropdown.Select>
 * <Dropdown.Select size="lg" placeholder="Large">...</Dropdown.Select>
 *
 * @example
 * // 비활성화된 옵션 포함
 * <Dropdown.Select value={status} onChange={setStatus} placeholder="상태 선택">
 *   <Dropdown.Option value="active" label="활성" />
 *   <Dropdown.Option value="pending" label="대기중" disabled />
 *   <Dropdown.Option value="inactive" label="비활성" />
 * </Dropdown.Select>
 *
 * @example
 * // 로딩 상태
 * <Dropdown.Select isLoading placeholder="로딩 중...">
 *   {options.map(opt => <Dropdown.Option key={opt.value} {...opt} />)}
 * </Dropdown.Select>
 *
 * @example
 * // FormField와 함께 사용
 * <FormField label="프로젝트" required>
 *   <Dropdown.Select value={project} onChange={setProject} placeholder="선택">
 *     {projects.map(p => <Dropdown.Option key={p.id} value={p.id} label={p.name} />)}
 *   </Dropdown.Select>
 * </FormField>
 *
 * @param value - 현재 선택된 값 (controlled)
 * @param defaultValue - 기본 선택값 (uncontrolled)
 * @param placeholder - 미선택 시 표시 텍스트
 * @param disabled - 비활성화 여부
 * @param isLoading - 로딩 상태
 * @param size - 크기 ('sm' | 'md' | 'lg')
 * @param noData - 옵션 없을 때 표시 텍스트
 * @param numbersOfOptionsInView - 한 번에 표시할 옵션 수 (기본 5)
 * @param onChange - 값 변경 콜백
 * @param onSelect - 선택 시 콜백
 * @param children - Dropdown.Option 컴포넌트들
 */
const Select = (
  props: DropdownProps & {
    closeWhenScrolled?: boolean;
    /**
     * 옵션 리스트 스크롤이 끝에 도달했을 때 호출됩니다.
     * (무한 스크롤/더보기 로딩에 사용)
     */
    onScrollEnd?: () => void;
    /** 끝 도달 판정 임계값(px). 기본 16px */
    scrollEndThreshold?: number;
  }
) => {
  const {
    className,
    value,
    defaultValue = '',
    placeholder,
    disabled = false,
    isLoading = false,
    noData = 'No Data',
    size = 'md',
    numbersOfOptionsInView = 5,
    onChange,
    onSelect,
    closeWhenScrolled = false,
    onScrollEnd,
    scrollEndThreshold = 16,
    children,
  } = props;

  // value prop이 전달되었는지 여부로 controlled/uncontrolled 판별
  // (value={undefined}처럼 명시적으로 넘긴 경우도 controlled로 취급)
  const isValueControlled = Object.prototype.hasOwnProperty.call(props, 'value');

  const id = useId();

  const [isOpened, setIsOpened] = useState(false);
  const [selected, setSelected] = useState<OptionValue>(defaultValue);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [optionListHeight, setOptionListHeight] = useState(0);

  /** 이전 포커스된 옵션의 인덱스를 저장하는 레퍼런스 */
  const prevFocusedIndexRef = useRef(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownListRef = useRef<HTMLUListElement>(null);
  const hasTriggeredScrollEndRef = useRef(false);
  const suppressTriggerClickRef = useRef(false);
  const suppressTriggerClickTimeoutRef = useRef<number | null>(null);

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

  /** 옵션 선택 핸들러 */
  const handleSelect = useCallback(
    (nextValue: OptionValue, index: number) => {
      onSelect?.(nextValue);

      const resolvedSelected: OptionValue = isValueControlled
        ? (value ?? '')
        : selected;

      if (resolvedSelected !== nextValue) {
        onChange?.(nextValue);
      }

      // uncontrolled일 때만 내부 selected 상태를 관리
      if (!isValueControlled) {
        setSelected(nextValue);
      }

      setFocusedIndex(index);
      // Selecting an option should always close the menu.
      // Some environments dispatch a follow-up click to the trigger, so suppress one tick.
      suppressTriggerClickRef.current = true;
      if (suppressTriggerClickTimeoutRef.current !== null) {
        window.clearTimeout(suppressTriggerClickTimeoutRef.current);
      }
      suppressTriggerClickTimeoutRef.current = window.setTimeout(() => {
        suppressTriggerClickRef.current = false;
        suppressTriggerClickTimeoutRef.current = null;
      }, 0);
      setIsOpened(false);
    },
    [isValueControlled, onChange, onSelect, selected, value]
  );

  // 렌더링/비교에 사용할 최종 선택 값 (controlled: props.value, uncontrolled: 내부 상태)
  const resolvedSelected: OptionValue = isValueControlled ? (value ?? '') : selected;

  /** 유효한 옵션 목록 */
  const validOptions = useMemo(
    () =>
      React.Children.toArray(children).filter(child => {
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

  /** 옵션 요소 UI 목록 */
  const optionElements = useMemo(
    () =>
      validOptions.map((child, index) => {
        const {
          props: { value, label, disabled, onClick },
        } = child as React.ReactElement<OptionProps>;

        return React.createElement(Option, {
          key: String(value ?? index),
          id: getOptionDomId(index),
          index,
          label,
          value,
          selected: resolvedSelected === value,
          focused: focusedIndex === index,
          disabled: Boolean(disabled),
          onClick: (value: OptionValue) => {
            onClick?.(value);
            handleSelect(value, index);
          },
        });
      }),
    [validOptions, resolvedSelected, focusedIndex, handleSelect, getOptionDomId]
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
      isActive:
        !isLoading && !disabled && isOpened && optionElements.length > 0,
    }),
    [isLoading, disabled, isOpened, optionElements.length]
  );

  /**
   * 드롭다운 값의 상태에 대한 메모이제이션
   *
   * @field labelOnSelectedOption 현재 선택된 value에 해당하는 옵션의 label
   * @field indexOnSelectedOption 현재 선택된 value에 해당하는 옵션의 index
   */
  const { labelOnSelectedOption, indexOnSelectedOption } = useMemo(() => {
    const optionOnSelected = optionMap[String(resolvedSelected)] ?? {};

    return {
      labelOnSelectedOption: optionOnSelected.label,
      indexOnSelectedOption: optionOnSelected.index,
    };
  }, [optionMap, resolvedSelected]);

  /** 키보드 이벤트 핸들러 */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // 이 설정으로 엔터쳐도 onClick 이벤트가 발생하지 않음
      e.preventDefault();

      switch (e.key) {
        case 'ArrowDown':
          setFocusedIndex(prevFocusedIndex => {
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
            prevFocusedIndexRef.current = hasFullyRotated
              ? -1
              : prevFocusedIndex;

            return newlyFocusedIndex;
          });

          break;
        case 'ArrowUp':
          setFocusedIndex(prevFocusedIndex => {
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
            prevFocusedIndexRef.current = hasFullyRotated
              ? -1
              : prevFocusedIndex;

            return newlyFocusedIndex;
          });

          break;
        case 'Enter':
          if (focusedIndex >= 0) {
            /** 엔터를 쳐서 키보드 포커스된 옵션을 선택 */
            const { props: focusedOptionProp } =
              optionElements[focusedIndex] ?? {};

            if (!focusedOptionProp || focusedOptionProp.disabled) {
              return;
            }

            handleSelect(focusedOptionProp.value, focusedIndex);
          }

          break;
        case 'Escape':
          setIsOpened(false);
          triggerButtonRef.current?.blur();

          break;
      }
    },
    [focusedIndex, optionElements, handleSelect]
  );

  const handleOptionsScroll = useCallback(
    (event: React.UIEvent<HTMLUListElement>): void => {
      if (!onScrollEnd) return;

      const target = event.currentTarget;
      const remaining =
        target.scrollHeight - target.scrollTop - target.clientHeight;

      const isNearEnd = remaining <= scrollEndThreshold;

      if (isNearEnd && !hasTriggeredScrollEndRef.current) {
        hasTriggeredScrollEndRef.current = true;
        onScrollEnd();
        return;
      }

      if (!isNearEnd) {
        hasTriggeredScrollEndRef.current = false;
      }
    },
    [onScrollEnd, scrollEndThreshold]
  );

  // <-------- 비활성화 또는 로딩 상태일 때 드롭다운 닫히는 effect -------->
  useEffect(() => {
    if (disabled || isLoading) {
      setIsOpened(false);
    }
  }, [disabled, isLoading]);

  // 드롭다운이 열릴 때 현재 선택 값에 맞춰 focusedIndex를 동기화
  useEffect(() => {
    if (!isOpened) {
      return;
    }

    const nextFocusedIndex = Number.isInteger(indexOnSelectedOption)
      ? indexOnSelectedOption
      : -1;
    setFocusedIndex(prev => (prev === nextFocusedIndex ? prev : nextFocusedIndex));
  }, [isOpened, indexOnSelectedOption]);

  // <-------- 드롭다운의 옵션리스트 높이를 계산하는 effect -------->
  useEffect(() => {
    if (!isOpened || !optionElements.length) return;

    setTimeout(() => {
      const singleOptionElement =
        dropdownListRef.current?.querySelector('.dropdown-option');
      const optionHeight =
        (singleOptionElement as HTMLElement)?.offsetHeight || 40;
      setOptionListHeight(
        calculateOptionListHeight(
          optionElements.length,
          optionHeight,
          numbersOfOptionsInView,
        ),
      );
    }, 50);
  }, [isOpened, optionElements.length, numbersOfOptionsInView]);

  // <-------- 드롭다운이 열릴 때 옵션리스트에 스크롤이 있는 경우, 선택된 옵션을 향해 스크롤하는 effect (window scroll 방지) -------->
  useEffect(() => {
    if (!isOpened) {
      return;
    }

    if (!Number.isInteger(indexOnSelectedOption)) {
      return;
    }

    const listEl = dropdownListRef.current;
    if (!listEl) {
      return;
    }

    const selectedElement = listEl.querySelector<HTMLElement>(
      `[data-option-index="${indexOnSelectedOption}"]`
    );
    if (!selectedElement) {
      return;
    }

    // NOTE: scrollIntoView는 상위 스크롤 컨테이너(window)를 움직일 수 있어,
    // 옵션 리스트(ul) 내부 스크롤만 조정합니다.
    scrollOptionIntoView(selectedElement);
  }, [isOpened, indexOnSelectedOption, scrollOptionIntoView]);

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
    onClickOutside: event => {
      // 포탈 영역(옵션 리스트) 내부 클릭인지 확인
      const portalElement = dropdownListRef.current;

      if (portalElement?.contains(event.target as Node)) {
        return; // 포탈 영역 내부 클릭이면 드롭다운 닫지 않음
      }

      // 포탈 영역 외부 클릭이면 드롭다운 닫기
      setIsOpened(false);
    },
  });

  // <--- 임치처리 ----
  useEffect(() => {
    const handleScroll = () => {
      if (closeWhenScrolled) setIsOpened(false);
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [closeWhenScrolled]);

  useEffect(() => {
    return () => {
      if (suppressTriggerClickTimeoutRef.current !== null) {
        window.clearTimeout(suppressTriggerClickTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        dropdownContainerStyles({ loading: isLoading }),
        className
      )}
    >
      <label className={cn(dropdownTriggerStyles)}>
        <button
          ref={triggerButtonRef}
          disabled={disabled || isLoading}
          tabIndex={0}
          className={cn(
            dropdownTriggerButtonStyles({
              size,
              hasValue: Boolean(labelOnSelectedOption),
            })
          )}
          onClick={() => {
            if (suppressTriggerClickRef.current) {
              return;
            }
            setIsOpened(disabled || isLoading ? false : !isOpened);
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpened}
          aria-label={`${placeholder || '옵션 선택'}: ${labelOnSelectedOption || '선택되지 않음'}`}
          aria-describedby={isOpened ? dropdownListId : undefined}
          onKeyDown={handleKeyDown}
        >
          <span className={cn(dropdownValueStyles)}>
            {hasNoOptions ? noData : labelOnSelectedOption || placeholder}
          </span>
          <ChevronDownIcon
            size={16}
            className={cn(dropdownArrowStyles({ opened: isOpened, isInput: false }))}
            aria-hidden={true}
          />
        </button>

        {isActive && (
          <Portal
            triggerRef={triggerButtonRef}
            direction="bottom"
            gap={4}
          >
            <ul
              id={dropdownListId}
              ref={dropdownListRef}
              className={cn(dropdownOptionsStyles({ size }), 'dropdown-options')}
              role="listbox"
              aria-label="선택 가능한 옵션 목록"
              onScroll={handleOptionsScroll}
              aria-activedescendant={
                focusedIndex >= 0 ? getOptionDomId(focusedIndex) : undefined
              }
              style={{
                height:
                  optionElements.length > numbersOfOptionsInView
                    ? `${optionListHeight}px`
                    : 'auto',
              }}
            >
              {optionElements}
            </ul>
          </Portal>
        )}
      </label>
    </div>
  );
};

export default Select;
