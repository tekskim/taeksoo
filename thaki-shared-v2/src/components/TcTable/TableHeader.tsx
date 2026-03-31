// React 훅, 유틸, 선택 컴포넌트, 아이콘, 스타일, 타입 임포트
import React, { useMemo, useState } from 'react';
import { cn } from '../../services/utils/cn';
import { Checkbox } from '../Checkbox';
import { ChevronDownIcon } from '../Icon';
import {
  iconColumnClassnames,
  selectCellClassnames,
  selectInnerClassnames,
  stickyLastColumnClassnames,
  sortIconActiveClassnames,
  sortIconAscClassnames,
  sortIconClassnames,
  thClassnames,
  thContentClassnames,
  thLabelClassnames,
  thSortableClassnames,
  theadTrClassnames,
  trClassnames,
} from './TcTable.styles';
import { Align, OnSortChange, SORT, SelectValue, TYPE, TdProps, Type } from './TcTable.types';

/**
 * 개별 헤더 셀(Th) 컴포넌트
 *
 * - `sortable`이면 클릭 시 정렬 상태를 토글하고 `onSortChange`를 호출
 * - 현재 정렬 중인 컬럼(`sortedColumnName`)과 일치하면 활성 아이콘 표시
 * - 정렬 아이콘은 접근성용 `<button>`으로 감싸되 tabIndex=-1로 포커스 제외
 */
export const Th = ({
  sortedColumnName,
  setSortedColumnName,
  columnName,
  className,
  align,
  onSortChange,
  sortable = false,
  iconColumn,
}: {
  sortedColumnName: string | null;
  setSortedColumnName: (sortedColumnName: string | null) => void;
  columnName: string;
  className?: string;
  align?: Align;
  onSortChange?: OnSortChange;
  sortable?: boolean;
  iconColumn?: boolean;
}) => {
  // 현재 이 컬럼이 정렬 활성 상태인지 여부
  const isSorted = sortedColumnName === columnName;

  // 정렬 토글: 이미 정렬 중이면 해제, 아니면 활성화 후 콜백 호출
  const handleSortChange = () => {
    setSortedColumnName(isSorted ? null : columnName);
    onSortChange?.({
      columnName,
      prev: isSorted ? SORT.ASC : SORT.DESC,
      curr: isSorted ? SORT.DESC : SORT.ASC,
    });
  };

  return (
    <th
      className={cn(thClassnames, align, iconColumn && iconColumnClassnames, className)}
      aria-sort={isSorted ? 'ascending' : sortable ? 'none' : undefined}
    >
      <div
        className={cn(thContentClassnames, sortable && thSortableClassnames)}
        onClick={sortable ? handleSortChange : undefined}
      >
        <span className={thLabelClassnames}>{columnName}</span>
        {/* 정렬 가능 컬럼에만 정렬 아이콘 표시 */}
        {sortable && (
          <button
            type="button"
            className="inline-flex items-center justify-center p-0 border-none bg-transparent"
            aria-label={`Sort by ${columnName}`}
            tabIndex={-1}
          >
            <ChevronDownIcon
              size={12}
              className={cn(
                sortIconClassnames,
                isSorted && sortIconActiveClassnames,
                isSorted && sortIconAscClassnames
              )}
            />
          </button>
        )}
      </div>
    </th>
  );
};

/** 전체 선택 셀 — 비활성 행을 제외한 활성 행만 토글 */
export const SelectAllCell = ({
  rowValues, // 활성 행의 선택값 (비활성 행은 이미 필터됨)
  checkedRowValues, // 현재 체크된 전체 선택값
  setCheckedRowValues,
  onChange,
  disabled = false, // 로딩 중 비활성
}: {
  rowValues: (SelectValue | undefined)[];
  checkedRowValues: Set<SelectValue>;
  setCheckedRowValues: (checkedRowValues: Set<SelectValue>) => void;
  onChange?: (selectedValues: SelectValue[]) => void;
  disabled?: boolean;
}) => {
  // undefined 제거 → 실제 선택 가능한 값만 추출
  const selectableValues = rowValues.filter((v): v is SelectValue => v != null);
  // 활성 행 전부가 체크돼 있으면 전체 선택 상태
  const isAllChecked =
    selectableValues.length > 0 && selectableValues.every((v) => checkedRowValues.has(v));

  const toggle = () => {
    if (disabled) return;

    const selectableSet = new Set(selectableValues);
    // 비활성 행의 기존 선택값 보존
    const preserved = [...checkedRowValues].filter((v) => !selectableSet.has(v));

    const newCheckedRowValues = isAllChecked
      ? new Set<SelectValue>(preserved) // 전체 해제: 비활성 행만 유지
      : new Set([...preserved, ...selectableValues]); // 전체 선택: 비활성 행 + 활성 행

    setCheckedRowValues(newCheckedRowValues);
    onChange?.(Array.from(newCheckedRowValues));
  };

  return (
    <th className={cn(thClassnames, selectCellClassnames)} data-select>
      <div className={selectInnerClassnames}>
        <Checkbox checked={isAllChecked} onChange={toggle} disabled={disabled} />
      </div>
    </th>
  );
};

/**
 * 테이블 헤더 컴포넌트
 *
 * - `type`에 따라 전체 선택 체크박스(CHECKBOX) 또는 빈 플레이스홀더(RADIO)를 첫 번째 셀로 렌더링
 * - `firstRow`의 자식 `Td` props를 추론하여 각 `Th`에 align 등 속성을 자동으로 전달
 * - 정렬 활성 컬럼 상태(`sortedColumnName`)를 내부에서 관리하고 각 `Th`에 공유
 */
export const TableHeader = ({
  columnNames,
  type,
  firstRow,
  stickyLastColumn = false,
  rowValues,
  onSortChange,
  checkedRowValues,
  setCheckedRowValues,
  onChange,
  isLoading = false,
}: {
  columnNames: string[];
  type: Type;
  firstRow?: React.ReactElement;
  stickyLastColumn?: boolean;
  rowValues: (SelectValue | undefined)[];
  checkedRowValues: Set<SelectValue>;
  setCheckedRowValues: (checkedRowValues: Set<SelectValue>) => void;
  onChange?: (selectedValues: SelectValue[]) => void;
  onSortChange?: OnSortChange;
  isLoading?: boolean;
}) => {
  // 현재 정렬 중인 컬럼명 (null이면 정렬 없음)
  const [sortedColumnName, setSortedColumnName] = useState<string | null>(null);

  // firstRow의 Td props를 추론해 컬럼별 align 등 속성 추출
  // firstRow가 유효하지 않으면 columnNames만으로 구성
  const columns = useMemo(() => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(firstRow)) {
      return columnNames.map((columnName) => ({ columnName }));
    }

    return React.Children.toArray(firstRow.props.children).map((child, index) => ({
      ...(React.isValidElement<TdProps>(child) ? child.props : {}),
      columnName: columnNames[index],
    }));
  }, [firstRow, columnNames]);

  return (
    <thead>
      <tr
        className={cn(
          trClassnames,
          stickyLastColumn && stickyLastColumnClassnames,
          theadTrClassnames
        )}
      >
        {/* CHECKBOX: 전체 선택 셀 / RADIO: 빈 플레이스홀더 셀 */}
        {type === TYPE.CHECKBOX && (
          <SelectAllCell
            rowValues={rowValues}
            checkedRowValues={checkedRowValues}
            setCheckedRowValues={setCheckedRowValues}
            onChange={onChange}
            disabled={isLoading}
          />
        )}
        {type === TYPE.RADIO && (
          <th
            className={cn(thClassnames, selectCellClassnames)}
            data-select
            aria-label="placeholder"
          />
        )}
        {/* 각 컬럼에 대한 Th 렌더링 (정렬 상태 공유) */}
        {columns.map(({ columnName, ...props }, index) => (
          <Th
            {...props}
            key={`${columnName}-${index}`}
            columnName={columnName}
            onSortChange={onSortChange}
            sortedColumnName={sortedColumnName}
            setSortedColumnName={setSortedColumnName}
          />
        ))}
      </tr>
    </thead>
  );
};
