export type SelectionType = 'checkbox' | 'radio';

/**
 * 정렬 방향 (API 표준)
 */
export type SortOrder = 'asc' | 'desc';

/**
 * 정렬 상태 (API 표준)
 * @example { sort: 'createdAt', order: 'desc' }
 */
export interface SortState {
  sort: string; // 정렬할 필드명
  order: SortOrder; // 정렬 방향
}

/**
 * 정렬 변경 콜백
 * @param sort - 정렬할 필드명 (null이면 정렬 해제)
 * @param order - 정렬 방향
 */
export type OnSortChange = (sort: string | null, order: SortOrder) => void;

/**
 * 테이블 컬럼 타입
 */
export interface TableColumn {
  key: string;
  header?: string;
  width?: number | string;
  clickable?: boolean;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean; // 정렬 가능 여부
  /** Enable text ellipsis with truncation for this column (default: true) */
  isEllipsis?: boolean;
}

export interface TableProps<TData> {
  rows: TData[];
  columns: TableColumn[];
  className?: string;
  minWidth?: number | string;
  maxWidth?: number | string;
  isLoading?: boolean;
  loadingRowCount?: number;
  loadingUI?: React.ReactNode;
  emptyUI?: React.ReactNode;
  onClickRow?: (row: TData, e: React.MouseEvent<HTMLTableRowElement>) => void;
  children?: React.ReactNode;
  renderHeaderCell?: (column: TableColumn, index: number) => React.ReactElement | null;
  onColumnResize?: (columnKey: string, newWidth: number) => void;
  columnWidths?: Record<string, number>;
  sort?: string; // 현재 정렬 필드 (API 표준)
  order?: SortOrder; // 현재 정렬 방향 (API 표준)
  onSortChange?: OnSortChange; // 정렬 변경 콜백
  stickyLastColumn?: boolean; // 마지막 컬럼 고정 여부
  /** Table layout mode: 'fixed' (default) for equal columns, 'auto' for content-based sizing */
  tableLayout?: 'fixed' | 'auto';
}

/**
 * 확장 가능한 테이블 Props
 */
export interface ExpandableTableProps<TData> extends Omit<TableProps<TData>, 'children'> {
  expandedRowRender: (row: TData) => React.ReactNode; // 확장 영역 렌더 함수
  onExpandedRowsChange?: (expandedRowIds: string[]) => void; // 확장 상태 변경 콜백
  expandRowByClick?: boolean; // 행 클릭 시 확장 여부
  isRowDisabled?: (row: TData, index: number) => boolean; // 행 비활성화 여부 판단 함수
  // 선택 기능 (optional)
  selectionType?: 'radio' | 'checkbox'; // 선택 타입
  selectedRows?: (string | number)[]; // 선택된 행 ID 배열
  onRowSelectionChange?: (selectedRowIds: (string | number)[]) => void; // 선택 변경 핸들러
  getRowId?: (row: TData, index: number) => string | number; // 행 ID 생성 함수
  radioGroupName?: string; // 라디오 그룹 이름 (radio 타입에서만 사용)
  showSelectAllCheckbox?: boolean; // 헤더에 전체 선택 체크박스 표시 여부 (checkbox 타입에서만 사용, 기본값: true)
}

export interface TrProps<TData> {
  rowData: TData;
  className?: string;
  isError?: boolean;
  disabled?: boolean;
  onClick?: (row: TData, e: React.MouseEvent<HTMLTableRowElement>) => void;
  onClickRow?: (row: TData, e: React.MouseEvent<HTMLTableRowElement>) => void;
  children: React.ReactNode;
}

export interface ThProps {
  column: TableColumn;
  className?: string;
  children?: React.ReactNode;
  preventClickPropagation?: boolean;
  onColumnResize?: (columnKey: string, deltaX: number) => void;
  onResizeStart?: (columnKey: string, startX: number, tableElement: HTMLTableElement) => void;
  onResizeEnd?: (columnKey: string) => void;
  currentSort?: string; // 현재 정렬 필드
  currentOrder?: SortOrder; // 현재 정렬 방향
  onSort?: (columnKey: string) => void; // 정렬 클릭 핸들러
  isFirst?: boolean; // 첫 번째 컬럼 여부
  isLast?: boolean; // 마지막 컬럼 여부
}

export interface TdProps<TData> {
  rowData: TData;
  column: TableColumn;
  className?: string;
  children?: React.ReactNode;
  preventClickPropagation?: boolean;
  colSpan?: number;
  /** Enable text ellipsis with truncation (default: true) */
  isEllipsis?: boolean;
}

export interface LoadingRowProps {
  colSpan: number;
  className?: string;
  children?: React.ReactNode;
}

export interface EmptyRowProps {
  colSpan: number;
  className?: string;
  children?: React.ReactNode;
}
