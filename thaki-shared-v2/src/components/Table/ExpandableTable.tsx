import React, { useCallback, useMemo, useState } from 'react';

import { cn } from '../../services/utils/cn';
import { Checkbox } from '../Checkbox';
import { ChevronRightIcon } from '../Icon';
import { RadioButton } from '../RadioButton';
import { Table } from './Table';
import { TABLE_SELECTION_COLUMN_WIDTH } from './Table.constants';
import { tableStyles } from './Table.styles';
import type { ExpandableTableProps, TableColumn } from './Table.types';
import { useTableSelection } from './useTableSelection';

/**
 * @deprecated 레거시 테이블 컴포넌트. 신규 코드에서는 TcTable 컴포넌트 사용 및 expandableUI prop을 사용하세요.
 *
 * 확장 가능한 테이블 컴포넌트
 *
 * Table 컴포넌트를 래핑하여 행 확장 기능을 제공합니다.
 * 선택 기능(checkbox/radio)도 optional로 지원합니다.
 *
 * @param props.expandedRowRender - 확장 영역 렌더 함수
 * @param props.onExpandedRowsChange - 확장 상태 변경 콜백
 * @param props.expandRowByClick - 행 전체 클릭 시 확장 여부 (기본값: true)
 * @param props.stickyLastColumn - 마지막 컬럼 고정 여부 (기본값: false)
 * @param props.isRowDisabled - 행 비활성화 여부 판단 함수
 * @param props.selectionType - 선택 타입 (checkbox/radio)
 * @param props.selectedRows - 선택된 행 ID 배열
 * @param props.onRowSelectionChange - 선택 변경 핸들러
 * @param props.getRowId - 행 ID 생성 함수
 * @param props.radioGroupName - 라디오 그룹 이름 (radio 타입에서만 사용)
 * @param props.showSelectAllCheckbox - 헤더에 전체 선택 체크박스 표시 여부 (checkbox 타입에서만 사용, 기본값: true)
 */
export const ExpandableTable = <TData extends Record<string, unknown>>({
  expandedRowRender,
  onExpandedRowsChange,
  expandRowByClick = true,
  rows,
  columns,
  onClickRow,
  stickyLastColumn = false,
  isRowDisabled,
  // Selection props
  selectionType,
  selectedRows = [],
  onRowSelectionChange,
  getRowId,
  radioGroupName,
  showSelectAllCheckbox = true,
  ...tableProps
}: ExpandableTableProps<TData>): React.ReactElement => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Selection 관련 상태 (useTableSelection 훅 사용)
  const {
    hasSelection,
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

  // 행 확장 토글
  const toggleRowExpansion = useCallback(
    (rowId: string | number) => {
      setExpandedRows((prev) => {
        const newSet = new Set(prev);
        const stringRowId = String(rowId);
        if (newSet.has(stringRowId)) {
          newSet.delete(stringRowId);
        } else {
          newSet.add(stringRowId);
        }

        // 확장 상태 변경 콜백 호출
        if (onExpandedRowsChange) {
          onExpandedRowsChange(Array.from(newSet));
        }

        return newSet;
      });
    },
    [onExpandedRowsChange]
  );

  // 확장 행 클릭 핸들러
  const handleRowClick = useCallback(
    (
      row: TData,
      rowId: string | number,
      rowIndex: number,
      e: React.MouseEvent<HTMLTableRowElement>
    ) => {
      // disabled 체크
      const disabled = isRowDisabled ? isRowDisabled(row, rowIndex) : false;
      if (disabled) return;

      // expandRowByClick이 true면 행 전체 클릭 시 확장/축소
      if (expandRowByClick) {
        toggleRowExpansion(rowId);
      }

      // 부모에서 전달한 onClickRow 콜백 실행
      if (onClickRow) {
        onClickRow(row, e);
      }
    },
    [expandRowByClick, toggleRowExpansion, onClickRow, isRowDisabled]
  );

  // selection 컬럼 추가
  const columnsWithSelection = useMemo(() => {
    if (!hasSelection) return columns;
    return [
      {
        key: '__select__',
        header: '',
        width: TABLE_SELECTION_COLUMN_WIDTH,
        clickable: false,
        align: 'left' as const,
      },
      ...columns,
    ];
  }, [hasSelection, columns]);

  // 헤더 렌더링 (selection 전체 선택 체크박스)
  const renderHeaderCell = useCallback(
    (column: TableColumn, index: number) => {
      const effectiveColumnsLength = hasSelection ? columns.length + 1 : columns.length;
      const isFirstColumn = index === 0;
      const isLastDataColumn = index === effectiveColumnsLength - 1;

      if (hasSelection && isFirstColumn && column.key === '__select__') {
        return (
          <Table.Th
            key="__select__"
            column={column}
            isFirst={false}
            isLast={false}
            className={cn(tableStyles.thSelectionCell, 'table-selection-cell')}
          >
            {selectionType === 'checkbox' && showSelectAllCheckbox && (
              <Checkbox checked={isAllSelected} onChange={handleSelectAll} size="sm" />
            )}
          </Table.Th>
        );
      }

      // 마지막 컬럼 (selection 컬럼 제외)
      if (isLastDataColumn) {
        return (
          <Table.Th
            key={column.key}
            column={column}
            isFirst={!hasSelection && isFirstColumn}
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
          />
        );
      }

      // 첫 번째 데이터 컬럼 (selection이 없을 때)
      if (!hasSelection && isFirstColumn) {
        return <Table.Th key={column.key} column={column} isFirst={true} isLast={false} />;
      }

      return null;
    },
    [
      hasSelection,
      selectionType,
      isAllSelected,
      handleSelectAll,
      stickyLastColumn,
      columns.length,
      showSelectAllCheckbox,
    ]
  );

  // 커스텀 행 렌더링
  return (
    <Table<TData>
      {...tableProps}
      rows={rows}
      columns={columnsWithSelection}
      stickyLastColumn={false}
      renderHeaderCell={hasSelection ? renderHeaderCell : undefined}
    >
      {rows.map((row: TData, rowIndex: number) => {
        const rowId = getResolvedRowId(row, rowIndex);
        const stringRowId = String(rowId);
        const expanded = expandedRows.has(stringRowId);
        const disabled = isRowDisabled ? isRowDisabled(row, rowIndex) : false;
        const isSelected = hasSelection && selectedRowsSet.has(rowId);

        return (
          <React.Fragment key={stringRowId}>
            {/* 기본 행 */}
            <Table.Tr
              rowData={row}
              disabled={disabled}
              className={isSelected ? 'tr-selected' : undefined}
              onClickRow={
                expandRowByClick || onClickRow
                  ? (r, e) => handleRowClick(r, rowId, rowIndex, e)
                  : undefined
              }
            >
              {columnsWithSelection.map((column: TableColumn, index: number) => {
                const isSelectionColumn = hasSelection && index === 0;
                const isExpandColumn = hasSelection ? index === 1 : index === 0;
                const effectiveColumnsLength = hasSelection ? columns.length + 1 : columns.length;
                const isFirstColumn = index === 0;
                const isLastColumn = index === effectiveColumnsLength - 1;

                // Selection cell (first column - tdSelectionCell에 first 스타일 포함)
                if (isSelectionColumn) {
                  return (
                    <Table.Td
                      key="__select__"
                      rowData={row}
                      column={column}
                      className={cn(tableStyles.tdSelectionCell, 'table-selection-cell')}
                      preventClickPropagation={false}
                    >
                      {selectionType === 'radio' ? (
                        <RadioButton
                          name={resolvedRadioGroupName}
                          value={String(rowId)}
                          checked={isSelected}
                          onChange={() => handleRowSelection(rowId, true, row, rowIndex)}
                          size="sm"
                          disabled={disabled}
                        />
                      ) : (
                        <Checkbox
                          checked={isSelected}
                          onChange={(checked) => handleRowSelection(rowId, checked, row, rowIndex)}
                          size="sm"
                          disabled={disabled}
                        />
                      )}
                    </Table.Td>
                  );
                }

                // Expand 컬럼에 확장 아이콘 추가
                if (isExpandColumn) {
                  // 실제 데이터 컬럼 key 가져오기
                  const dataColumn = hasSelection ? columns[0] : column;
                  const isFirstDataColumn = !hasSelection && isFirstColumn;
                  return (
                    <td
                      key={column.key}
                      className={cn(
                        tableStyles.td,
                        isFirstDataColumn && tableStyles.tdFirst,
                        isLastColumn && tableStyles.tdLast,
                        column.align === 'left' && tableStyles.alignLeft,
                        column.align === 'center' && tableStyles.alignCenter,
                        column.align === 'right' && tableStyles.alignRight,
                        stickyLastColumn && isLastColumn && tableStyles.stickyLast,
                        stickyLastColumn && isLastColumn && tableStyles.stickyLastTbodyBg
                      )}
                      style={
                        column.width
                          ? {
                              width:
                                typeof column.width === 'number'
                                  ? `${column.width}px`
                                  : column.width,
                            }
                          : undefined
                      }
                    >
                      <div className={tableStyles.expandCellWrapper}>
                        <button
                          type="button"
                          className={tableStyles.expandButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!disabled) {
                              toggleRowExpansion(rowId);
                            }
                          }}
                          aria-label={expanded ? 'Collapse row' : 'Expand row'}
                          aria-expanded={expanded}
                          disabled={disabled}
                        >
                          <ChevronRightIcon
                            size={16}
                            style={{
                              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease',
                            }}
                          />
                        </button>
                        <span className={tableStyles.expandCellContent}>
                          {row[dataColumn.key] as React.ReactNode}
                        </span>
                      </div>
                    </td>
                  );
                }

                return (
                  <Table.Td
                    key={column.key}
                    rowData={row}
                    column={column}
                    className={cn(
                      isLastColumn && tableStyles.tdLast,
                      stickyLastColumn && isLastColumn && tableStyles.stickyLast,
                      stickyLastColumn && isLastColumn && tableStyles.stickyLastTbodyBg
                    )}
                  />
                );
              })}
            </Table.Tr>

            {/* 확장 영역 */}
            {expanded && (
              <tr className={cn(tableStyles.tr, tableStyles.expandedRow)}>
                <td
                  colSpan={columnsWithSelection.length}
                  className={cn(
                    tableStyles.td,
                    tableStyles.expandedContent,
                    tableStyles.noPadFullRow
                  )}
                >
                  {expandedRowRender(row)}
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      })}
    </Table>
  );
};
