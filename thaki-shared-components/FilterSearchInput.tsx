import React, { useCallback, useRef, useState } from 'react';
import { cn } from '../../services/utils/cn';
import type { DateRange } from '../DatePicker';
import { DatePicker } from '../DatePicker';
import { SearchIcon } from '../Icon';
import FilterDropdown from './FilterDropdown';
import FilterLabel from './FilterLabel';
import {
  filterSearchStyles as shared,
  filterSearchInputStyles as styles,
} from './FilterSearch.styles';
import type { FilterKey, FilterKeyWithValue } from './FilterSearch.types';
import { formatDateRangeDisplay, generateFilterId } from './filterUtils';

export interface FilterSearchInputProps {
  filterKeys: FilterKey[];
  placeholder?: string;
  className?: string;
  onFilterAdd: (filter: FilterKeyWithValue) => void;
  /**
   * 필터 키 선택 없이 텍스트 입력 후 Enter 시 적용할 기본 필터 키
   * @default 'name'
   */
  defaultFilterKey?: string;
  /** 이미 선택된 필터 목록 (중복 방지용) */
  selectedFilters?: FilterKeyWithValue[];
}

/**
 * FilterSearchInput 컴포넌트
 *
 * 필터 키를 선택하고 값을 입력/선택하여 필터를 추가하는 입력 컴포넌트
 *
 * @param filterKeys - 사용 가능한 필터 키 목록
 * @param placeholder - 검색창 placeholder
 * @param className - 추가 CSS 클래스
 * @param onFilterAdd - 필터 추가 시 호출되는 콜백 함수
 * @param defaultFilterKey - 필터 키 선택 없이 Enter 시 적용할 기본 필터 키 (기본값: 'name')
 */
const FilterSearchInput: React.FC<FilterSearchInputProps> = ({
  filterKeys,
  placeholder = 'Find instance with filters',
  className,
  onFilterAdd,
  defaultFilterKey = 'name',
  selectedFilters = [],
}): React.ReactElement => {
  // 현재 입력 중인 필터 상태
  const [activeFilterKey, setActiveFilterKey] = useState<FilterKey | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // 드롭다운 열림 상태
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSelectDropdownOpen, setIsSelectDropdownOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);

  // 입력 상태 초기화
  const resetInputState = useCallback((): void => {
    setActiveFilterKey(null);
    setInputValue('');
    setIsSelectDropdownOpen(false);
    setIsDatePickerOpen(false);
    setDateRange(undefined);
  }, []);

  // 필터 추가 공통 헬퍼
  const addFilterKey = useCallback(
    (filterData: Partial<FilterKeyWithValue>): void => {
      if (!activeFilterKey) return;

      const newFilter: FilterKeyWithValue = {
        ...activeFilterKey,
        id: generateFilterId(activeFilterKey.key),
        ...filterData,
      };

      onFilterAdd(newFilter);
      resetInputState();
      inputRef.current?.focus();
    },
    [activeFilterKey, resetInputState, onFilterAdd]
  );

  // 드롭다운 토글 핸들러
  const toggleSelectDropdown = useCallback(() => setIsSelectDropdownOpen((prev) => !prev), []);

  const toggleDatePicker = useCallback(() => setIsDatePickerOpen((prev) => !prev), []);

  // 필터 키 선택 핸들러
  const handleKeySelect = useCallback(
    (key: string): void => {
      const filterKey = filterKeys.find((fk) => fk.key === key);
      if (!filterKey) return;

      setIsDropdownOpen(false);
      setActiveFilterKey(filterKey);

      // 필터 타입에 따른 처리
      switch (filterKey.type) {
        case 'input':
        case 'number':
          // 입력형/숫자형: 입력 모드로 전환
          setInputValue('');
          setTimeout(() => valueInputRef.current?.focus(), 0);
          break;
        case 'select':
          // 선택형: 옵션 드롭다운 표시
          setIsSelectDropdownOpen(true);
          break;
        case 'dateRange':
          // 날짜 범위: 날짜 선택기 표시
          setIsDatePickerOpen(true);
          setDateRange(undefined);
          break;
      }
    },
    [filterKeys]
  );

  // 선택형 필터 옵션 선택 핸들러
  const handleSelectOption = useCallback(
    (value: string): void => {
      if (!activeFilterKey) return;

      const selectedOption = activeFilterKey.options?.find((opt) => opt.value === value);
      if (!selectedOption) return;

      addFilterKey({
        value: selectedOption.value,
        displayValue: selectedOption.label,
      });
    },
    [activeFilterKey, addFilterKey]
  );

  // 선택 모드에서 이미 선택된 옵션 제외한 목록
  const availableOptions = activeFilterKey?.options?.filter(
    (opt) => !selectedFilters.some((sf) => sf.key === activeFilterKey.key && sf.value === opt.value)
  );

  // 날짜 범위 Apply 핸들러 (버튼 클릭 시)
  const handleDateRangeApply = useCallback(
    (range: DateRange | undefined): void => {
      // 시작과 끝 날짜가 모두 선택되었을 때만 필터 추가
      if (range?.from && range?.to) {
        addFilterKey({
          startDate: range.from,
          endDate: range.to,
          displayValue: formatDateRangeDisplay(range.from, range.to),
        });
      }
    },
    [addFilterKey]
  );

  // 날짜 범위 Cancel 핸들러
  const handleDateRangeCancel = useCallback((): void => {
    resetInputState();
    inputRef.current?.focus();
  }, [resetInputState]);

  // 입력값 확정 핸들러 (Enter 키 또는 포커스 아웃)
  const handleInputConfirm = useCallback((): void => {
    if (!inputValue.trim()) return;
    if (!activeFilterKey) return;

    // 이미 동일한 key+value 조합이 있으면 무시
    const isDuplicate = selectedFilters.some(
      (sf) => sf.key === activeFilterKey.key && sf.value === inputValue.trim()
    );
    if (isDuplicate) {
      resetInputState();
      inputRef.current?.focus();
      return;
    }

    addFilterKey({
      value: inputValue.trim(),
    });
  }, [inputValue, addFilterKey, activeFilterKey, selectedFilters, resetInputState]);

  // 입력 취소 핸들러 (Escape 키)
  const handleInputCancel = useCallback((): void => {
    resetInputState();
    inputRef.current?.focus();
  }, [resetInputState]);

  // 입력 필드 키 이벤트 핸들러
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      // 한글 IME 조합 중이면 무시 (마지막 글자 중복 입력 방지)
      if (e.nativeEvent.isComposing) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        handleInputConfirm();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleInputCancel();
      } else if (e.key === 'Backspace' && !inputValue) {
        // 입력값이 비어있을 때 Backspace 누르면 필터 키 선택 취소
        e.preventDefault();
        handleInputCancel();
      }
    },
    [handleInputConfirm, handleInputCancel, inputValue]
  );

  // 빠른 검색 (Enter 키) - defaultFilterKey 필터로 자동 추가
  const handleQuickSearch = useCallback((): void => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    // defaultFilterKey가 filterKeys에 없으면 첫 번째 input 타입 필터 키 사용
    let targetFilterKey = filterKeys.find((fk) => fk.key === defaultFilterKey);

    // fallback: defaultFilterKey 매칭 실패 시 첫 번째 input 타입 필터 사용
    if (!targetFilterKey) {
      targetFilterKey = filterKeys.find((fk) => fk.type === 'input');
    }

    if (!targetFilterKey) return;

    // 이미 동일한 key+value 조합이 있으면 무시
    const isDuplicate = selectedFilters.some(
      (sf) => sf.key === targetFilterKey.key && sf.value === trimmedValue
    );
    if (isDuplicate) {
      setInputValue('');
      setIsDropdownOpen(false);
      return;
    }

    const newFilter: FilterKeyWithValue = {
      ...targetFilterKey,
      id: generateFilterId(targetFilterKey.key),
      value: trimmedValue,
    };

    onFilterAdd(newFilter);
    setInputValue('');
    setIsDropdownOpen(false);
  }, [inputValue, filterKeys, onFilterAdd, defaultFilterKey, selectedFilters]);

  // 검색창 키 이벤트 핸들러 (필터 키 선택 전)
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      // 한글 IME 조합 중이면 무시 (마지막 글자 중복 입력 방지)
      if (e.nativeEvent.isComposing) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        handleQuickSearch();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsDropdownOpen(false);
      }
    },
    [handleQuickSearch]
  );

  return (
    <div className={cn(styles.root, className)}>
      {/* 입력 모드가 아닐 때: 필터 키 선택 */}
      {!activeFilterKey && (
        <FilterDropdown
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          trigger={
            <div className={shared.inputWrapper}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder={placeholder}
                className={shared.searchInput}
                autoComplete="off"
              />

              <div className={shared.searchIcon}>
                <SearchIcon variant="secondary" size="xs" />
              </div>
            </div>
          }
          className={shared.searchContainer}
        >
          {filterKeys.length > 0 && (
            <div className={shared.dropdownList}>
              {filterKeys.map((key) => (
                <button
                  key={key.key}
                  type="button"
                  onClick={() => handleKeySelect(key.key)}
                  className={shared.dropdownItem}
                >
                  <span>{key.label}</span>
                </button>
              ))}
            </div>
          )}
        </FilterDropdown>
      )}

      {/* 입력 모드일 때: 텍스트 또는 숫자 입력 */}
      {activeFilterKey &&
        (activeFilterKey.type === 'input' || activeFilterKey.type === 'number') && (
          <div className={shared.inputModeContainer}>
            <FilterLabel label={activeFilterKey.label} />
            <input
              ref={valueInputRef}
              type={activeFilterKey.type === 'number' ? 'number' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={
                activeFilterKey.placeholder ||
                (activeFilterKey.type === 'number' ? 'Enter number...' : 'Enter value...')
              }
              className={shared.valueInputInline}
              autoComplete="off"
            />
          </div>
        )}

      {/* 선택 모드일 때: 옵션 선택 */}
      {activeFilterKey && activeFilterKey.type === 'select' && (
        <FilterDropdown
          isOpen={isSelectDropdownOpen}
          onClose={() => setIsSelectDropdownOpen(false)}
          trigger={
            <div className={shared.inputModeContainer}>
              <FilterLabel label={activeFilterKey.label} />
              <button type="button" onClick={toggleSelectDropdown} className={shared.selectTrigger}>
                {activeFilterKey.placeholder || 'Select option...'}
              </button>
            </div>
          }
          className={shared.selectContainer}
        >
          {availableOptions && availableOptions.length > 0 && (
            <div className={shared.dropdownList}>
              {availableOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelectOption(option.value)}
                  className={shared.dropdownItem}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </FilterDropdown>
      )}

      {/* 날짜 범위 모드일 때: 날짜 선택 */}
      {activeFilterKey && activeFilterKey.type === 'dateRange' && (
        <FilterDropdown
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          trigger={
            <div className={shared.inputModeContainer}>
              <FilterLabel label={activeFilterKey.label} />
              <button type="button" onClick={toggleDatePicker} className={shared.selectTrigger}>
                {dateRange?.from || dateRange?.to
                  ? formatDateRangeDisplay(dateRange.from, dateRange.to)
                  : activeFilterKey.placeholder || 'Select date range...'}
              </button>
            </div>
          }
          className={shared.dateRangeContainer}
        >
          <DatePicker
            value={dateRange}
            onApply={handleDateRangeApply}
            onCancel={handleDateRangeCancel}
            numberOfMonths={1}
            minDate={activeFilterKey.minDate}
            maxDate={activeFilterKey.maxDate}
            preventFutureSet={activeFilterKey.preventFutureSet}
          />
        </FilterDropdown>
      )}
    </div>
  );
};

export default FilterSearchInput;
