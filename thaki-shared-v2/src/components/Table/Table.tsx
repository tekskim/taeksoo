import React, { useCallback, useMemo } from 'react';

import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { ChevronDownIcon } from '../Icon';
import { Skeleton } from '../Skeleton';
import { Typography } from '../Typography';

import { cn } from '../../services/utils/cn';
import {
  TABLE_ACTION_COLUMN_WIDTH,
  TABLE_FAVORITE_COLUMN_WIDTH,
  TABLE_LOCKED_COLUMN_WIDTH,
  TABLE_SELECTION_COLUMN_WIDTH,
  TABLE_STATUS_COLUMN_WIDTH,
} from './Table.constants';
import { getTableClasses, getTrClasses, tableStyles } from './Table.styles';
import type {
  EmptyRowProps,
  LoadingRowProps,
  SortOrder,
  TableColumn,
  TableProps,
  TdProps,
  ThProps,
  TrProps,
} from './Table.types';
import { useColumnResize } from './useColumnResize';
import { useTableResize } from './useTableResize';

const normalizeColumnKey = (columnKey: string): string =>
  columnKey.trim().toLowerCase();

const FIXED_COLUMN_WIDTHS: Record<string, number> = {
  __select__: TABLE_SELECTION_COLUMN_WIDTH,
  status: TABLE_STATUS_COLUMN_WIDTH,
  locked: TABLE_LOCKED_COLUMN_WIDTH,
  lock: TABLE_LOCKED_COLUMN_WIDTH,
  action: TABLE_ACTION_COLUMN_WIDTH,
  actions: TABLE_ACTION_COLUMN_WIDTH,
  __actions: TABLE_ACTION_COLUMN_WIDTH,
  favorite: TABLE_FAVORITE_COLUMN_WIDTH,
  favourite: TABLE_FAVORITE_COLUMN_WIDTH,
};

const getFixedColumnWidth = (columnKey: string): number | undefined =>
  FIXED_COLUMN_WIDTHS[normalizeColumnKey(columnKey)];

const ACTION_COLUMN_KEYS = new Set(['action', 'actions', '__actions']);

const isActionColumnKey = (columnKey: string): boolean =>
  ACTION_COLUMN_KEYS.has(normalizeColumnKey(columnKey));

const resolveColumnAlign = (column: TableColumn): 'left' | 'center' | 'right' =>
  column.align ?? (isActionColumnKey(column.key) ? 'center' : 'left');

/**
 * 메모이제이션된 테이블 헤더 컴포넌트
 * columns가 변경될 때만 리렌더링 (width 변경은 DOM 직접 조작으로 처리)
 */
const TableHeader = React.memo(
  ({
    columns,
    renderHeaderCell,
    handleColumnResize,
    handleResizeStart,
    handleResizeEnd,
    currentSort,
    currentOrder,
    onSort,
    stickyLastColumn,
  }: {
    columns: TableColumn[];
    renderHeaderCell?: (
      column: TableColumn,
      index: number
    ) => React.ReactElement | null;
    handleColumnResize?: (columnKey: string, newWidth: number) => void;
    handleResizeStart?: (
      columnKey: string,
      startX: number,
      tableElement: HTMLTableElement
    ) => void;
    handleResizeEnd?: (columnKey: string) => void;
    currentSort?: string;
    currentOrder?: SortOrder;
    onSort?: (columnKey: string) => void;
    stickyLastColumn?: boolean;
  }) => {
    return (
      <thead className={tableStyles.thead}>
        <tr className={tableStyles.theadTr}>
          {columns.map((column: TableColumn, index: number) => {
            const isFirstColumn = index === 0;
            const isLastColumn = index === columns.length - 1;
            const customHeader = renderHeaderCell?.(column, index);
            if (customHeader) {
              return customHeader;
            }

            return (
              <Th
                key={column.key}
                column={column}
                isFirst={isFirstColumn}
                isLast={isLastColumn}
                onColumnResize={handleColumnResize}
                onResizeStart={handleResizeStart}
                onResizeEnd={handleResizeEnd}
                currentSort={currentSort}
                currentOrder={currentOrder}
                onSort={onSort}
                className={
                  stickyLastColumn && isLastColumn
                    ? cn(
                        tableStyles.stickyLast,
                        tableStyles.stickyLastTh,
                        tableStyles.stickyLastTheadBg
                      )
                    : undefined
                }
              />
            );
          })}
        </tr>
      </thead>
    );
  },
  // 커스텀 비교 함수: columns와 함수들의 참조만 비교
  (prevProps, nextProps) => {
    return (
      prevProps.columns === nextProps.columns &&
      prevProps.renderHeaderCell === nextProps.renderHeaderCell &&
      prevProps.handleColumnResize === nextProps.handleColumnResize &&
      prevProps.handleResizeStart === nextProps.handleResizeStart &&
      prevProps.handleResizeEnd === nextProps.handleResizeEnd &&
      prevProps.currentSort === nextProps.currentSort &&
      prevProps.currentOrder === nextProps.currentOrder &&
      prevProps.onSort === nextProps.onSort &&
      prevProps.stickyLastColumn === nextProps.stickyLastColumn
    );
  }
);

/**
 * 테이블 행(TR) 컴포넌트
 *
 * @param props.rowData - 행 데이터
 * @param props.className - 커스텀 CSS 클래스
 * @param props.isError - 에러 상태 표시
 * @param props.disabled - 비활성화 상태 (클릭 불가, 시각적으로 흐리게 표시)
 * @param props.onClick - 행 클릭 이벤트 핸들러
 * @param props.onClickRow - 행 클릭 이벤트 핸들러 (대체)
 * @param props.children - 자식 요소 (td 등)
 */
const Tr = <TData,>({
  rowData,
  className,
  isError = false,
  disabled = false,
  onClick,
  children,
  onClickRow,
}: TrProps<TData>): React.ReactElement => {
  const hasClickHandler = Boolean(onClick || onClickRow);

  const handleClick = hasClickHandler
    ? (e: React.MouseEvent<HTMLTableRowElement>) => {
        if (disabled) return;
        onClick?.(rowData, e);
        onClickRow?.(rowData, e);
      }
    : undefined;

  return (
    <tr
      className={cn(
        getTrClasses({
          isError,
          isClickable: hasClickHandler && !disabled,
          className,
        })
      )}
      onClick={handleClick}
      style={{ cursor: hasClickHandler && !disabled ? 'pointer' : 'default' }}
    >
      {children}
    </tr>
  );
};

/**
 * 테이블 헤더 셀(TH) 컴포넌트
 *
 * @param props.column - 컬럼 정의 객체
 * @param props.className - 커스텀 CSS 클래스
 * @param props.children - 커스텀 헤더 내용
 * @param props.onColumnResize - 컬럼 리사이징 핸들러
 * @param props.onResizeStart - 리사이징 시작 핸들러
 * @param props.onResizeEnd - 리사이징 종료 핸들러
 * @param props.currentSort - 현재 정렬 필드
 * @param props.currentOrder - 현재 정렬 방향
 * @param props.onSort - 정렬 클릭 핸들러
 */
const Th = React.memo(
  ({
    column,
    className,
    children,
    onColumnResize,
    onResizeStart,
    onResizeEnd,
    currentSort,
    currentOrder,
    onSort,
    isFirst = false,
    isLast = false,
  }: ThProps): React.ReactElement => {
    const isSortable = column.sortable ?? false; // 기본값 false
    const isCurrentSort = currentSort === column.key;
    const align = resolveColumnAlign(column);
    const alignClassName =
      align === 'center'
        ? tableStyles.alignCenter
        : align === 'right'
          ? tableStyles.alignRight
          : tableStyles.alignLeft;

    const { isResizing, isResizable, handleMouseDown } = useColumnResize({
      column,
      onColumnResize,
      onResizeStart,
      onResizeEnd,
    });

    // 헤더 클릭 핸들러 (정렬 가능한 경우에만)
    const handleClick = React.useCallback(() => {
      if (isSortable && onSort) {
        onSort(column.key);
      }
    }, [isSortable, onSort, column.key]);

    // 정렬 아이콘 JSX 메모이제이션
    const sortIcon = React.useMemo(() => {
      if (!isSortable || !onSort) {
        return null;
      }

      // 정렬 상태에 따라 아이콘 회전
      // 기본: 아래 화살표, 오름차순: 위 화살표 (180도 회전), 내림차순: 아래 화살표
      const isAscending = isCurrentSort && currentOrder === 'asc';

      return (
        <ChevronDownIcon
          size={12}
          className={cn(
            tableStyles.sortIcon,
            isCurrentSort && tableStyles.sortIconActive
          )}
          style={{
            transform: isAscending ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
          }}
        />
      );
    }, [isSortable, onSort, isCurrentSort, currentOrder]);

    const headerContent =
      children === undefined ? column.header ?? '' : children;
    const headerNode =
      headerContent === null || headerContent === false
        ? null
        : React.isValidElement(headerContent)
          ? headerContent
          : (
              <span className={tableStyles.thLabel}>{headerContent}</span>
            );

    return (
      <th
        className={cn(
          tableStyles.th,
          tableStyles.columnDivider,
          alignClassName,
          isFirst && tableStyles.thFirst,
          isLast && tableStyles.thLast,
          isSortable && onSort && 'sortable',
          className
        )}
        data-column-key={column.key}
      >
        <div
          className={cn(
            tableStyles.thContent,
            isSortable && onSort && tableStyles.thClickable
          )}
          onClick={handleClick}
        >
          {headerNode}
          {sortIcon}
        </div>
        {isResizable && (
          <div
            className={cn(tableStyles.resizeHandle, isResizing && 'resizing')}
            onMouseDown={handleMouseDown}
          />
        )}
      </th>
    );
  },
  // 커스텀 비교 함수: width 변경은 무시 (리사이징 시 불필요한 리렌더 방지)
  (prevProps, nextProps) => {
    // column의 width를 제외한 주요 속성만 비교
    if (
      prevProps.column.key !== nextProps.column.key ||
      prevProps.column.align !== nextProps.column.align ||
      prevProps.column.sortable !== nextProps.column.sortable ||
      prevProps.column.header !== nextProps.column.header
    ) {
      return false;
    }

    return (
      prevProps.className === nextProps.className &&
      prevProps.children === nextProps.children &&
      prevProps.onColumnResize === nextProps.onColumnResize &&
      prevProps.onResizeStart === nextProps.onResizeStart &&
      prevProps.onResizeEnd === nextProps.onResizeEnd &&
      prevProps.currentSort === nextProps.currentSort &&
      prevProps.currentOrder === nextProps.currentOrder &&
      prevProps.onSort === nextProps.onSort &&
      prevProps.isFirst === nextProps.isFirst &&
      prevProps.isLast === nextProps.isLast
    );
  }
);

/**
 * 테이블 데이터 셀(TD) 컴포넌트
 *
 * @param props.rowData - 행 데이터
 * @param props.column - 컬럼 정의 객체
 * @param props.className - 커스텀 CSS 클래스
 * @param props.children - 커스텀 셀 내용
 * @param props.preventClickPropagation - 클릭 이벤트 전파 방지 (액션 셀용)
 * @param props.colSpan - 셀 병합 수
 * @param props.isEllipsis - 텍스트 말줄임 적용 여부 (기본: true)
 */
const Td = <TData,>({
  rowData,
  column,
  className,
  children,
  preventClickPropagation = false,
  colSpan,
  isEllipsis = true,
}: TdProps<TData>): React.ReactElement => {
  const isClickable = column.clickable !== false;
  const isActionColumn = isActionColumnKey(column.key);
  const align = column.align ?? (isActionColumn ? 'center' : 'left');
  const alignClassName =
    align === 'center'
      ? tableStyles.alignCenter
      : align === 'right'
        ? tableStyles.alignRight
        : tableStyles.alignLeft;
  const columnWidthStyle =
    column.width != null
      ? {
          width: column.width,
          minWidth: column.width,
          maxWidth: column.width,
        }
      : undefined;

  // Priority: column.isEllipsis > isEllipsis prop (default: true)
  const shouldEllipsis = column.isEllipsis ?? isEllipsis;

  const handleClick = (e: React.MouseEvent) => {
    if (!isClickable || preventClickPropagation) {
      e.stopPropagation();
    }
  };

  const cellValue = (rowData as Record<string, unknown>)[column.key];

  return (
    <td
      className={cn(
        tableStyles.td,
        alignClassName,
        preventClickPropagation && tableStyles.tdActionCell,
        isActionColumn && tableStyles.tdActionColumn,
        shouldEllipsis && 'truncate',
        className
      )}
      style={{
        cursor: isClickable ? 'inherit' : 'default',
        ...columnWidthStyle,
      }}
      onClick={handleClick}
      colSpan={colSpan}
      data-column-key={column.key}
    >
      <ErrorBoundary fallback="-">
        {children
          ? children
          : React.isValidElement(cellValue)
            ? cellValue
            : typeof cellValue === 'object' && cellValue !== null
              ? JSON.stringify(cellValue)
              : (
                  <span className={cn(tableStyles.tdText, shouldEllipsis && 'truncate')}>
                    {String(cellValue ?? '-')}
                  </span>
                )}
      </ErrorBoundary>
    </td>
  );
};

/**
 * 로딩 상태 행 컴포넌트
 *
 * @param props.colSpan - 병합할 컬럼 수
 * @param props.className - 커스텀 CSS 클래스
 * @param props.children - 커스텀 로딩 UI
 */
const LoadingRow: React.FC<LoadingRowProps> = ({
  colSpan,
  className,
  children,
}): React.ReactElement => (
  <tr className={tableStyles.tr}>
    <td
      className={cn(
        tableStyles.td,
        tableStyles.noPad,
        tableStyles.noPadFullRow,
        className
      )}
      colSpan={colSpan}
    >
      {children || <Skeleton />}
    </td>
  </tr>
);

/**
 * 빈 데이터 행 컴포넌트
 *
 * @param props.colSpan - 병합할 컬럼 수
 * @param props.className - 커스텀 CSS 클래스
 * @param props.children - 커스텀 빈 상태 UI
 */
const EmptyRow: React.FC<EmptyRowProps> = ({
  colSpan,
  className,
  children,
}): React.ReactElement => (
  <tr className={tableStyles.tr}>
    <td
      className={cn(
        tableStyles.td,
        tableStyles.emptyCell,
        tableStyles.emptyCellFullRow,
        className
      )}
      colSpan={colSpan}
    >
      <div className={tableStyles.emptyState}>
        {children ?? (
          <Typography.Text variant="paragraph" className="font-medium leading-20">
            No Data
          </Typography.Text>
        )}
      </div>
    </td>
  </tr>
);

/**
 * @deprecated 레거시 테이블 컴포넌트. 신규 코드에서는 `TcTable`을 사용하세요.
 *
 * [Design System] 데이터 테이블 컴포넌트
 *
 * 데이터를 표 형식으로 표시하며, 정렬, 컬럼 리사이징, 행 클릭 등을 지원합니다.
 *
 * @example
 * // 기본 사용법
 * const columns = [
 *   { key: 'name', header: '이름', sortable: true },
 *   { key: 'status', header: '상태' },
 *   { key: 'createdAt', header: '생성일', sortable: true },
 * ];
 *
 * <Table
 *   columns={columns}
 *   rows={data}
 *   onClickRow={(row) => navigate(`/detail/${row.id}`)}
 * />
 *
 * @example
 * // 정렬 기능 (API 표준)
 * <Table
 *   columns={columns}
 *   rows={data}
 *   sort={sortState.sort}
 *   order={sortState.order}
 *   onSortChange={(sort, order) => setSortState({ sort, order })}
 * />
 *
 * @example
 * // 커스텀 셀 렌더링
 * <Table columns={columns} rows={data}>
 *   {data.map((row) => (
 *     <Table.Tr key={row.id} rowData={row}>
 *       <Table.Td rowData={row} column={columns[0]}>{row.name}</Table.Td>
 *       <Table.Td rowData={row} column={columns[1]}>
 *         <Badge theme={row.status === 'active' ? 'gre' : 'gry'}>{row.status}</Badge>
 *       </Table.Td>
 *       <Table.Td rowData={row} column={columns[2]} preventClickPropagation>
 *         <Button size="sm" appearance="ghost">편집</Button>
 *       </Table.Td>
 *     </Table.Tr>
 *   ))}
 * </Table>
 *
 * @example
 * // 로딩 및 빈 상태 (커스텀 UI)
 * <Table
 *   columns={columns}
 *   rows={data}
 *   isLoading={isLoading}
 *   loadingRowCount={5}
 *   emptyUI={<div>데이터가 없습니다</div>}
 * />
 *
 * @example
 * // 빈 상태 (기본 제공 - emptyResourceName 사용)
 * <Table
 *   columns={columns}
 *   rows={data}
 *   emptyResourceName="instance snapshots"
 *   hasFilters={Object.keys(filterParams).length > 0}
 * />
 *
 * @example
 * // 마지막 컬럼 고정 (액션 버튼용)
 * <Table columns={columns} rows={data} stickyLastColumn />
 *
 * @param rows - 테이블 행 데이터 배열
 * @param columns - 컬럼 정의 배열 ({ key, header, width?, sortable?, align? })
 * @param isLoading - 로딩 상태
 * @param loadingRowCount - 로딩 스켈레톤 행 수 (기본: 5)
 * @param emptyUI - 빈 상태 커스텀 UI
 * @param onClickRow - 행 클릭 핸들러
 * @param sort - 현재 정렬 필드
 * @param order - 현재 정렬 방향 ('asc' | 'desc')
 * @param onSortChange - 정렬 변경 콜백
 * @param stickyLastColumn - 마지막 컬럼 고정 여부
 * @param onColumnResize - 컬럼 리사이징 콜백
 * @param children - 커스텀 행 렌더링 (Table.Tr, Table.Td 사용)
 */
const TableComponent = <TData extends Record<string, unknown>>({
  rows,
  columns,
  className,
  minWidth,
  maxWidth,
  isLoading = false,
  loadingRowCount = 5,
  loadingUI,
  emptyUI,
  onClickRow,
  children,
  renderHeaderCell,
  onColumnResize,
  columnWidths,
  sort,
  order,
  onSortChange,
  stickyLastColumn = false,
  tableLayout = 'fixed',
}: TableProps<TData>): React.ReactElement => {
  const columnsWithFixedWidth = useMemo(() => {
    return columns.map((column: TableColumn) => {
      const fixedWidth = getFixedColumnWidth(column.key);
      if (fixedWidth != null) {
        return column.width === fixedWidth
          ? column
          : { ...column, width: fixedWidth };
      }
      if (tableLayout !== 'fixed' || column.width == null) {
        return column;
      }
      return { ...column, width: undefined };
    });
  }, [columns, tableLayout]);

  // 정렬 핸들러 (API 표준)
  const handleSort = useCallback(
    (columnKey: string) => {
      if (!onSortChange) {
        return;
      }

      // 현재 정렬 상태에 따라 다음 방향 결정
      // 첫 클릭: no sort -> asc
      // 이후: asc <-> desc 반복
      if (sort === columnKey) {
        // 같은 컬럼 클릭: asc와 desc 토글
        const nextOrder = order === 'asc' ? 'desc' : 'asc';
        onSortChange(columnKey, nextOrder);
      } else {
        // 새로운 컬럼 정렬: 기본 asc
        onSortChange(columnKey, 'asc');
      }
    },
    [sort, order, onSortChange]
  );

  const {
    isResizing,
    handleColumnResize,
    handleResizeStart,
    handleResizeEnd,
    getColumnWidth,
  } = useTableResize({
    columns: columnsWithFixedWidth,
    columnWidths,
    maxWidth,
    onColumnResize,
  });

  // 로딩 상태 렌더링 메모이제이션
  const renderLoadingBody = useMemo(
    () => (
      <tbody>
        {loadingUI ||
          Array.from({ length: loadingRowCount }).map((_, i) => (
            <LoadingRow key={i} colSpan={columns.length} />
          ))}
      </tbody>
    ),
    [loadingUI, loadingRowCount, columns.length]
  );

  // 기본 빈 상태 UI 생성
  const defaultEmptyUI = useMemo(() => {
    return emptyUI;
  }, [emptyUI]);

  // 빈 상태 렌더링 메모이제이션
  const renderEmptyBody = useMemo(
    () => (
      <tbody>
        <EmptyRow colSpan={columns.length}>{defaultEmptyUI}</EmptyRow>
      </tbody>
    ),
    [columns.length, defaultEmptyUI]
  );

  // 커스텀 바디 렌더링
  const renderCustomBody = (): React.ReactElement => (
    <tbody>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === Tr) {
          // Tr의 children(Td들)을 순회하여 first/last Td에 스타일 추가
          const trChildren = React.Children.toArray(
            (child as React.ReactElement<TrProps<TData>>).props.children
          );

          const updatedChildren = trChildren.map((tdChild, index) => {
            if (React.isValidElement(tdChild) && tdChild.type === Td) {
              const isFirstColumn = index === 0;
              const isLastColumn = index === trChildren.length - 1;
              const existingClassName = (
                tdChild.props as { className?: string }
              ).className;

              // Selection cell인지 확인 (tdSelectionCell이 이미 적용된 경우)
              const isSelectionCell =
                existingClassName?.includes('table-selection-cell') ?? false;

              // first/last 스타일과 sticky 스타일 적용
              // Selection cell은 자체 first 스타일을 포함하므로 tdFirst 적용 안함
              const newClassName = cn(
                existingClassName,
                isFirstColumn && !isSelectionCell && tableStyles.tdFirst,
                isLastColumn && tableStyles.tdLast,
                stickyLastColumn && isLastColumn && tableStyles.stickyLast,
                stickyLastColumn &&
                  isLastColumn &&
                  tableStyles.stickyLastTbodyBg
              );

              return React.cloneElement(
                tdChild as React.ReactElement<TdProps<TData>>,
                {
                  ...(tdChild.props as TdProps<TData>),
                  column: columnsWithWidth[index],
                  className: newClassName,
                }
              );
            }
            return tdChild;
          });

          return React.cloneElement(
            child as React.ReactElement<TrProps<TData>>,
            { onClickRow },
            updatedChildren
          );
        }
        return child;
      })}
    </tbody>
  );

  // width가 적용된 columns 메모이제이션
  const columnsWithWidth = useMemo(() => {
    return columnsWithFixedWidth.map((column: TableColumn) => {
      const currentWidth = getColumnWidth(column);
      return currentWidth === column.width
        ? column
        : { ...column, width: currentWidth };
    });
  }, [columnsWithFixedWidth, getColumnWidth]);

  // 기본 바디 렌더링
  const renderDefaultBody = (): React.ReactElement => {
    return (
      <tbody>
        {rows.map((row: TData, rowIndex: number) => (
          <Tr key={rowIndex} rowData={row} onClickRow={onClickRow}>
            {columnsWithWidth.map((column: TableColumn, index: number) => {
              const isFirstColumn = index === 0;
              const isLastColumn = index === columnsWithWidth.length - 1;

              return (
                <Td
                  key={column.key}
                  rowData={row}
                  column={column}
                  className={cn(
                    isFirstColumn && tableStyles.tdFirst,
                    isLastColumn && tableStyles.tdLast,
                    stickyLastColumn && isLastColumn && tableStyles.stickyLast,
                    stickyLastColumn &&
                      isLastColumn &&
                      tableStyles.stickyLastTbodyBg
                  )}
                />
              );
            })}
          </Tr>
        ))}
      </tbody>
    );
  };

  // 바디 렌더링 로직
  const renderBody = (): React.ReactNode => {
    if (isLoading) {
      return renderLoadingBody;
    }

    if (!rows || rows.length === 0) {
      return renderEmptyBody;
    }

    return children ? renderCustomBody() : renderDefaultBody();
  };

  // 테이블 스타일
  const tableStyle: React.CSSProperties = {
    ...(minWidth && {
      minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
    }),
    ...(maxWidth && {
      maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
      width: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    }),
  };

  return (
    <div className={cn(tableStyles.container, className)}>
      <table
        className={getTableClasses(isResizing, tableLayout)}
        style={tableStyle}
      >
        <colgroup>
          {columnsWithWidth.map(column => (
            <col
              key={column.key}
              style={
                column.width != null
                  ? {
                      width: column.width,
                      minWidth: column.width,
                      maxWidth: column.width,
                    }
                  : undefined
              }
            />
          ))}
        </colgroup>
        <TableHeader
          columns={columnsWithFixedWidth}
          renderHeaderCell={renderHeaderCell}
          handleColumnResize={onColumnResize ? handleColumnResize : undefined}
          handleResizeStart={onColumnResize ? handleResizeStart : undefined}
          handleResizeEnd={onColumnResize ? handleResizeEnd : undefined}
          currentSort={sort}
          currentOrder={order}
          onSort={handleSort}
          stickyLastColumn={stickyLastColumn}
        />
        {renderBody()}
      </table>
    </div>
  );
};

export const Table = Object.assign(TableComponent, {
  Tr,
  Th,
  Td,
  LoadingRow,
  EmptyRow,
}) as typeof TableComponent & {
  Tr: <TData>(props: TrProps<TData>) => React.ReactElement;
  Th: (props: ThProps) => React.ReactElement;
  Td: <TData>(props: TdProps<TData>) => React.ReactElement;
  LoadingRow: React.FC<LoadingRowProps>;
  EmptyRow: React.FC<EmptyRowProps>;
};

export default Table;
