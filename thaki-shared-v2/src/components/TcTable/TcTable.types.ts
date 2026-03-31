/**
 * TcTable (WIP)
 *
 * Intentionally kept as a blank canvas.
 * Add types here as the new table API is designed.
 */

/**
 * 테이블 푸터 행 렌더링 Props
 * @interface TfootProps
 * @property {React.ReactNode} children - 푸터 콘텐츠
 * @property {string} [className] - CSS 클래스명 (선택사항)
 * @property {number} [colSpan] - 열 병합 개수 (선택사항)
 */
export interface TfootProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

/**
 * 테이블 컬럼 정렬 방향 상수
 * @const {Object} SORT
 * @property {string} ASC - 오름차순
 * @property {string} DESC - 내림차순
 */
export const SORT = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

/**
 * 정렬 방향 타입 ('asc' | 'desc')
 * @typedef {string} Sort
 */
export type Sort = (typeof SORT)[keyof typeof SORT];

/**
 * 테이블 셀(Td) 렌더링 Props
 * @interface TdProps
 * @property {React.ReactNode} children - 셀 콘텐츠
 * @property {Align} [align] - 텍스트 정렬 방향 (선택사항)
 * @property {string} [className] - CSS 클래스명 (선택사항)
 * @property {number} [colspan] - 열 병합 개수 (선택사항)
 * @property {number} [rowspan] - 행 병합 개수 (선택사항)
 * @property {boolean} [sortable] - 정렬 가능 여부 (선택사항)
 * @property {React.ReactNode} [suffix] - 셀 우측에 표시할 추가 요소 (선택사항, 예: 단위)
 * @property {boolean} [iconColumn] - 아이콘 컬럼 여부 (선택사항)
 */
export interface TdProps {
  children: React.ReactNode;
  align?: Align;
  className?: string;
  colspan?: number;
  rowspan?: number;
  sortable?: boolean;
  suffix?: React.ReactNode;
  iconColumn?: boolean;
}

/**
 * 셀 내 텍스트 정렬 방향 상수
 * @const {Object} ALIGN
 * @property {string} LEFT - 왼쪽 정렬
 * @property {string} CENTER - 중앙 정렬
 * @property {string} RIGHT - 오른쪽 정렬
 */
export const ALIGN = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
} as const;

/**
 * 정렬 방향 타입 ('left' | 'center' | 'right')
 * @typedef {string} Align
 */
export type Align = (typeof ALIGN)[keyof typeof ALIGN];

/**
 * 행 선택 시 사용되는 고유값 타입 (숫자 또는 문자열)
 * @typedef {(number|string)} SelectValue
 */
export type SelectValue = number | string;

/**
 * 테이블 행(Tr) 렌더링 Props
 * @interface TrProps
 * @property {React.ReactNode} children - 행 내 셀 요소들
 * @property {string} [className] - CSS 클래스명 (선택사항)
 * @property {() => void} [onClick] - 행 클릭 콜백 (선택사항)
 */
export interface TrProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * 테이블 선택 방식 상수
 * @const {Object} TYPE
 * @property {string} NONE - 선택 불가능
 * @property {string} RADIO - 라디오 버튼 (단일 선택)
 * @property {string} CHECKBOX - 체크박스 (다중 선택)
 */
export const TYPE = {
  NONE: 'none',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
} as const;

/**
 * 선택 방식 타입 ('none' | 'radio' | 'checkbox')
 * @typedef {string} Type
 */
export type Type = (typeof TYPE)[keyof typeof TYPE];

/**
 * 컬럼 정렬 변경 시 호출되는 콜백 함수 타입
 * @typedef {Function} OnSortChange
 * @param {Object} params - 정렬 변경 정보
 * @param {string} params.columnName - 정렬 대상 컬럼명
 * @param {Sort} params.prev - 이전 정렬 방향
 * @param {Sort} params.curr - 변경된 정렬 방향
 * @returns {void}
 */
export type OnSortChange = ({
  columnName,
  prev,
  curr,
}: {
  columnName: string;
  prev: Sort;
  curr: Sort;
}) => void;

/**
 * 각 행 렌더링 시 제공되는 헬퍼 함수들 (선택셀, 확장버튼)
 * @interface RowHelpers
 * @property {() => React.ReactNode} selectCell - 선택 셀(라디오/체크박스) 렌더링 헬퍼
 * @property {() => React.ReactNode} expandButton - 확장 버튼 렌더링 헬퍼
 */
export interface RowHelpers {
  selectCell: () => React.ReactNode;
  expandButton: () => React.ReactNode;
}

/**
 * 테이블 본문(Body) 전체 Props - 제네릭 타입으로 행 데이터 정의
 * @template T - 행 데이터의 타입
 * @interface BodyProps
 *
 * @property {Type} [type] - 선택 방식 (기본값: TYPE.NONE)
 * @property {boolean} isLoading - 로딩 중 표시 여부
 * @property {T[] | null} [rowData] - 행 데이터 배열 또는 null (에러 상태)
 * @property {string} [className] - 테이블 CSS 클래스명
 * @property {React.ReactNode} [footer] - 푸터 영역 콘텐츠
 * @property {string[]} columnNames - 컬럼 이름 배열
 * @property {OnSortChange} [onSortChange] - 정렬 변경 콜백
 *
 * @property {SelectValue[]} [selectedValues] - 외부에서 주입되는 선택값
 * 배열의 참조가 변경될 때마다 isLoading false 상태에서 내부 체크 상태에 반영됨
 *
 * @property {(row: T) => SelectValue} [getSelectValue] - 행에서 선택값 추출 함수
 * @property {(row: T, helpers: RowHelpers) => React.ReactElement} children - 행 렌더링 함수
 * @property {(selectedValues: SelectValue[]) => void} [onChange] - 선택 값 변경 콜백
 * @property {(row: T) => React.ReactElement} [expandableUI] - 확장된 행 렌더링 함수
 *
 * @property {boolean} [canMultipleExpand=false] - 여러 행 동시 확장 허용 여부
 * @property {React.ReactElement} [emptyUI] - 빈 데이터 시 표시할 UI (기본: DefaultEmptyRow)
 * @property {React.ReactNode} [errorUI] - Row 렌더링 에러 시 표시할 fallback UI
 * @property {React.ReactElement} [skeletonUI] - 로딩 중 표시할 스켈레톤 row UI
 * @property {number} [numberOfSkeletons=5] - 스켈레톤 row 개수
 *
 * @property {boolean} [selectOnRowClick=false] - Row 클릭 시 선택 토글 여부
 * @property {boolean} [expandOnRowClick=false] - Row 클릭 시 확장 토글 여부
 * @property {boolean} [stickyLastColumn=false] - 마지막 컬럼 sticky 고정 여부
 * @property {(row: T) => boolean} [getDisabled] - Row 비활성화 여부 판별 함수
 * @property {boolean} [resizable=false] - 컬럼 리사이즈 활성화 여부
 */
export interface BodyProps<T> {
  type?: Type;
  isLoading: boolean;
  rowData?: T[] | null;
  className?: string;
  footer?: React.ReactNode;
  columnNames: string[];
  onSortChange?: OnSortChange;
  selectedValues?: SelectValue[];
  getSelectValue?: (row: T) => SelectValue;
  children: (row: T, helpers: RowHelpers) => React.ReactElement;
  onChange?: (selectedValues: SelectValue[]) => void;
  expandableUI?: (row: T) => React.ReactElement;
  canMultipleExpand?: boolean;
  emptyUI?: React.ReactElement;
  errorUI?: React.ReactNode;
  skeletonUI?: React.ReactElement;
  numberOfSkeletons?: number;
  selectOnRowClick?: boolean;
  expandOnRowClick?: boolean;
  stickyLastColumn?: boolean;
  getDisabled?: (row: T) => boolean;
  resizable?: boolean;
}
