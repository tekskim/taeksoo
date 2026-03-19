import React, { useCallback, useMemo } from 'react';

import { cn } from '../../services/utils/cn';
import { Checkbox } from '../Checkbox';
import { RadioButton } from '../RadioButton';
import { Table } from './Table';
import { tableStyles } from './Table.styles';
import type { TableColumn, TableProps } from './Table.types';
import { useTableSelection } from './useTableSelection';

/**
 * Flatten React children by unwrapping Fragments recursively.
 * This ensures that Fragment-wrapped children are properly processed.
 */
const flattenChildren = (children: React.ReactNode): React.ReactNode[] => {
  const result: React.ReactNode[] = [];
  React.Children.forEach(children, child => {
    if (React.isValidElement(child) && child.type === React.Fragment) {
      const fragmentProps = child.props as { children?: React.ReactNode };
      result.push(...flattenChildren(fragmentProps.children));
    } else {
      result.push(child);
    }
  });
  return result;
};

export interface SelectableTableProps<TData extends Record<string, unknown>>
  extends Omit<
    TableProps<TData>,
    'renderHeaderCell' | 'getRowId' | 'children'
  > {
  /** 선택 타입 */
  selectionType: 'radio' | 'checkbox';
  /** 선택된 행 ID 배열 */
  selectedRows?: (string | number)[];
  /** 선택 변경 핸들러 */
  onRowSelectionChange?: (selectedRowIds: (string | number)[]) => void;
  /** 행 ID 생성 함수 */
  getRowId: (row: TData, index: number) => string | number;
  /** 라디오 그룹 이름 지정 (radio 타입에서만 사용) */
  radioGroupName?: string;
  /** 마지막 컬럼 고정 여부 (선택 컬럼 제외) */
  stickyLastColumn?: boolean;
  /** 행 비활성화 여부 판단 함수 */
  isRowDisabled?: (row: TData, index: number) => boolean;
  /** 행 클릭 시 선택 여부 (false일 경우 체크박스만 선택 가능) */
  selectOnRowClick?: boolean;
  /** 테이블 행들 (필수) */
  children: React.ReactNode;
}

// SelectableTableRow 컴포넌트는 더 이상 사용하지 않음 (children 방식만 사용)

/**
 * @deprecated 레거시 테이블 컴포넌트. 신규 코드에서는 TcTable 컴포넌트 사용 및 type="checkbox" 또는 type="radio"를 사용하세요.
 *
 * 선택 기능이 있는 테이블 컴포넌트
 * Table을 래핑하여 선택 기능을 제공합니다.
 */
export const SelectableTable = <TData extends Record<string, unknown>>({
  rows,
  columns,
  selectionType,
  selectedRows = [],
  onRowSelectionChange,
  getRowId,
  onClickRow,
  children,
  stickyLastColumn = false,
  radioGroupName,
  isRowDisabled,
  selectOnRowClick = true,
  sort,
  order,
  onSortChange,
  ...tableProps
}: SelectableTableProps<TData>): React.ReactElement => {
  const {
    selectedRowsSet,
    isAllSelected,
    resolvedRadioGroupName,
    getResolvedRowId,
    handleRowSelection,
    handleSelectAll,
  } = useTableSelection({
    rows,
    getRowId,
    selectedRows,
    onRowSelectionChange,
    selectionType,
    isRowDisabled,
    radioGroupName,
  });

  const columnsWithSelection = useMemo(
    () => [
      {
        key: '__select__',
        header: '',
        clickable: false,
        align: 'left' as const,
      },
      ...columns,
    ],
    [columns]
  );

  // 헤더 렌더링
  const renderHeaderCell = useCallback(
    (column: TableColumn, index: number) => {
      const isLastDataColumn = index === columns.length; // __select__ 포함해서 columns.length

      if (index === 0 && column.key === '__select__') {
        return (
          <Table.Th
            key="__select__"
            column={column}
            isFirst={false}
            isLast={false}
            className={cn(tableStyles.thSelectionCell, 'table-selection-cell')}
          >
            <div className="flex items-center justify-center">
              {selectionType === 'checkbox' && (
                <Checkbox
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  size="sm"
                />
              )}
            </div>
          </Table.Th>
        );
      }

      // 마지막 컬럼 (선택 컬럼 제외) - 정렬 관련 props 전달
      if (isLastDataColumn) {
        return (
          <Table.Th
            key={column.key}
            column={column}
            isFirst={false}
            isLast={true}
            className={
              stickyLastColumn
                ? cn(
                    tableStyles.stickyLast,
                    tableStyles.stickyLastTh,
                    tableStyles.stickyLastTheadBg
                  )
                : undefined
            }
            currentSort={sort}
            currentOrder={order}
            onSort={
              column.sortable && onSortChange
                ? () => {
                    const nextOrder =
                      sort === column.key
                        ? order === 'asc'
                          ? 'desc'
                          : 'asc'
                        : 'asc';
                    onSortChange(column.key, nextOrder);
                  }
                : undefined
            }
          />
        );
      }

      return null;
    },
    [
      selectionType,
      isAllSelected,
      handleSelectAll,
      stickyLastColumn,
      columns,
      sort,
      order,
      onSortChange,
    ]
  );

  // children을 사용하여 커스텀 렌더링 - children에 selection cell을 추가
  // Flatten children first to handle Fragment-wrapped rows
  const renderRows = (): React.ReactNode => {
    const flatChildren = flattenChildren(children);
    return flatChildren.map((child, index) => {
      if (!React.isValidElement(child)) return child;

      const row = rows[index];
      if (!row) return child;

      const rowId = getResolvedRowId(row, index);
      const isSelected = selectedRowsSet.has(rowId);
      const isDisabled = isRowDisabled ? isRowDisabled(row, index) : false;

      // Table.Tr 컴포넌트인 경우 selection cell 추가
      if (child.type === Table.Tr) {
        const trProps = child.props as {
          children?: React.ReactNode;
          className?: string;
          rowData?: TData;
          onClickRow?: (
            rowData: TData,
            e: React.MouseEvent<HTMLTableRowElement>
          ) => void;
          onClick?: (
            rowData: TData,
            e: React.MouseEvent<HTMLTableRowElement>
          ) => void;
        };
        const childrenArray = React.Children.toArray(trProps.children);

        // Selection cell 생성 (first column - tdSelectionCell에 first 스타일 포함)
        const selectionCell = (
          <Table.Td
            key="__select__"
            rowData={row}
            column={{
              key: '__select__',
              header: '',
              align: 'left',
            }}
            className={cn(tableStyles.tdSelectionCell, 'table-selection-cell')}
            preventClickPropagation={false}
          >
            <div className="flex items-center justify-center">
              {selectionType === 'radio' ? (
                <RadioButton
                  name={resolvedRadioGroupName}
                  value={String(rowId)}
                  checked={isSelected}
                  onChange={() => handleRowSelection(rowId, true, row, index)}
                  size="sm"
                  disabled={isDisabled}
                />
              ) : (
                <Checkbox
                  checked={isSelected}
                  onChange={checked =>
                    handleRowSelection(rowId, checked, row, index)
                  }
                  size="sm"
                  disabled={isDisabled}
                />
              )}
            </div>
          </Table.Td>
        );

        // 클릭 핸들러 추가 - onClick과 onClickRow 모두 처리
        const handleRowClick = (
          rowData: TData,
          e: React.MouseEvent<HTMLTableRowElement>
        ): void => {
          // selectOnRowClick이 true일 때만 행 클릭으로 선택
          if (selectOnRowClick) {
            handleRowSelection(rowId, !isSelected, row, index);
          }
          // 기존 onClick 핸들러 호출 (rowData와 event 전달)
          trProps.onClick?.(rowData, e);
          // onClickRow 핸들러 호출
          trProps.onClickRow?.(rowData, e);
          onClickRow?.(rowData, e);
        };

        // 마지막 컬럼에 tdLast와 sticky-last 클래스 추가
        const updatedChildren = childrenArray.map((td, tdIndex) => {
          if (React.isValidElement(td)) {
            const isLastColumn = tdIndex === childrenArray.length - 1;
            const tdProps = (td as React.ReactElement).props as {
              className?: string;
            };

            if (isLastColumn) {
              return React.cloneElement(
                td as React.ReactElement,
                {
                  ...tdProps,
                  className: cn(
                    tdProps.className,
                    tableStyles.tdLast,
                    stickyLastColumn && tableStyles.stickyLast,
                    stickyLastColumn && tableStyles.stickyLastTbodyBg
                  ),
                } as Record<string, unknown>
              );
            }
          }
          return td;
        });

        return React.cloneElement(child, {
          onClick: handleRowClick, // onClick을 handleRowClick으로 설정
          onClickRow: undefined, // 중복 호출 방지를 위해 onClickRow는 제거
          className: isSelected ? tableStyles.trSelected : trProps.className,
          disabled: isDisabled,
          children: [selectionCell, ...updatedChildren],
        } as Partial<typeof trProps>);
      }

      return child;
    });
  };

  return (
    <Table
      {...tableProps}
      rows={rows}
      columns={columnsWithSelection}
      renderHeaderCell={renderHeaderCell}
      stickyLastColumn={false}
      sort={sort}
      order={order}
      onSortChange={onSortChange}
    >
      {renderRows()}
    </Table>
  );
};
