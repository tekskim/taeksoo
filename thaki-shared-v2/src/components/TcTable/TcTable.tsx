// 필수 React 훅과 컨텍스트 API 임포트
import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
// 유틸 및 컴포넌트 임포트
import { cn } from '../../services/utils';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { ChevronRightIcon } from '../Icon';
import { SelectCell, TableBody } from './TableBody';
import { TableFooter } from './TableFooter';
import { TableHeader } from './TableHeader';
import { DefaultEmptyRow, DefaultErrorRow, TableSkeleton } from './TableSkeleton';
// 테이블 스타일 클래스명 임포트
import {
  bodyTrClassnames,
  expandButtonClassnames,
  expandedTdClassnames,
  expandIconClassnames,
  expandIconExpandedClassnames,
  iconColumnClassnames,
  stickyLastColumnClassnames,
  tableClassnames,
  tableWrapperClassName,
  tdClassnames,
  tdContentClassnames,
  trClassnames,
  trClickableClassnames,
} from './TcTable.styles';
// 타입 정의 임포트
import { BodyProps, SelectValue, TdProps, TrProps, TYPE } from './TcTable.types';
// 컬럼 리사이즈 기능 훅 임포트
import { useColumnResizing } from './useColumnResizing';

// 행 클릭 및 비활성화 상태를 전달하는 컨텍스트
const RowContext = createContext<{
  onRowClick: (() => void) | null;
  disabled: boolean;
  stickyLastColumn: boolean;
}>({ onRowClick: null, disabled: false, stickyLastColumn: false });

/**
 * 테이블 행 컴포넌트
 * 클릭 및 비활성화 상태를 처리하며, RowContext를 통해 행 레벨 상태 전달
 *
 * @component
 * @param {TrProps} props - 행 렌더링 Props
 * @param {React.ReactNode} props.children - 행 내 셀 요소들
 * @param {string} [props.className] - CSS 클래스명
 * @param {() => void} [props.onClick] - 행 클릭 콜백
 * @returns {React.ReactElement} <tr> 엘리먼트
 */
const Tr = ({ children, className, onClick }: TrProps) => {
  const { onRowClick, disabled, stickyLastColumn } = useContext(RowContext);
  // 행 선택 또는 확장 가능 여부 판별
  const isClickable = !disabled && Boolean(onClick || onRowClick);

  // 클릭 비활성화 상태 시 핸들러 제거
  const handleClick = !disabled
    ? () => {
        onClick?.();
        onRowClick?.();
      }
    : undefined;

  return (
    <tr
      className={cn(
        trClassnames,
        stickyLastColumn && stickyLastColumnClassnames,
        bodyTrClassnames,
        isClickable && trClickableClassnames,
        className
      )}
      onClick={handleClick}
      aria-disabled={disabled || undefined}
    >
      {children}
    </tr>
  );
};

/**
 * 리사이즈 가능한 테이블의 컬럼 너비 정의.
 *
 * `<colgroup>`을 렌더링하여 각 컬럼을 명시적 픽셀 너비로 고정한다.
 * 컬럼 크기의 단일 진실 공급원(single source of truth)으로,
 * 모든 행(헤더·본문·푸터)이 대응하는 `<col>`의 너비를 상속받아
 * 셀별 width 없이도 정렬이 유지된다.
 *
 * `resizable`이 활성화되고 DOM에서 너비가 측정된 경우에만 렌더링.
 * 이 가드가 없으면 너비 0인 `<col>`이 `table-fixed` 균등 배분을 덮어쓴다.
 */
/**
 * 리사이즈 가능한 테이블의 컬럼 너비 정의 컴포넌트
 * <colgroup>을 렌더링하여 각 컬럼을 명시적 픽셀 너비로 고정
 *
 * @component
 * @param {Object} props - Props
 * @param {number[]} props.columnWidths - 각 데이터 컬럼의 픽셀 너비 (useColumnResizing이 측정·갱신)
 * @param {number} props.prefixWidth - 접두 컬럼(select/radio)의 픽셀 너비; 없으면 0
 * @param {boolean} props.hasSelect - 테이블에 선택(checkbox/radio) 컬럼이 있는지 여부
 * @returns {React.ReactElement} <colgroup> 엘리먼트
 */
const ColumnWidths = ({
  columnWidths,
  prefixWidth,
  hasSelect,
}: {
  /** 각 데이터 컬럼의 픽셀 너비 (useColumnResizing이 측정·갱신) */
  columnWidths: number[];
  /** 접두 컬럼(select/radio)의 픽셀 너비; 없으면 0 */
  prefixWidth: number;
  /** 테이블에 선택(checkbox/radio) 컬럼이 있는지 여부 */
  hasSelect: boolean;
}) => (
  <colgroup>
    {/* 선택 컬럼이 있으면 먼저 렌더링 */}
    {hasSelect && <col style={{ width: prefixWidth }} />}
    {/* 각 데이터 컬럼 너비 지정 */}
    {columnWidths.map((w, i) => (
      <col key={i} style={{ width: w }} />
    ))}
  </colgroup>
);

/**
 * 테이블 셀(Td) 컴포넌트
 * 정렬, 병합, 에러 바운더리 처리 및 말줄임 기능 제공
 *
 * @component
 * @param {TdProps} props - 셀 렌더링 Props
 * @param {React.ReactNode} props.children - 셀 콘텐츠
 * @param {Align} [props.align] - 텍스트 정렬 방향
 * @param {string} [props.className] - CSS 클래스명
 * @param {number} [props.colspan] - 열 병합 개수
 * @param {number} [props.rowspan] - 행 병합 개수
 * @param {React.ReactNode} [props.suffix] - 셀 우측에 표시할 추가 요소
 * @param {boolean} [props.iconColumn] - 아이콘 컬럼 여부
 * @returns {React.ReactElement} <td> 엘리먼트
 */
const Td = ({ children, className, align, colspan, rowspan, suffix, iconColumn }: TdProps) => (
  <td
    className={cn(tdClassnames, align, iconColumn && iconColumnClassnames, className)}
    colSpan={colspan}
    rowSpan={rowspan}
  >
    {/* 렌더링 에러 발생 시 '-' 표시 */}
    <ErrorBoundary fallback={<div className={tdContentClassnames}>-</div>}>
      <div className={tdContentClassnames}>
        {/* 텍스트 오버플로우 시 말줄임 표시 */}
        <span className="truncate">{children}</span>
        {/* 부가 정보(단위 등) 표시 */}
        {suffix && <span>{suffix}</span>}
      </div>
    </ErrorBoundary>
  </td>
);

/**
 * TcTable (WIP)
 *
 * Intentionally left blank for step-by-step migration.
 */
/**
 * 메인 테이블 컴포넌트
 * 선택(라디오/체크박스), 확장, 정렬, 리사이즈 등 모든 테이블 기능을 제공하는 핵심 컴포넌트
 *
 * @template T - 행 데이터의 타입
 * @component
 * @param {BodyProps<T>} props - 테이블 전체 Props
 * @returns {React.ReactElement} <table> 엘리먼트
 *
 * @example
 * // 기본 사용법 (선택 없음)
 * <TcTable.Body
 *   isLoading={false}
 *   rowData={users}
 *   columnNames={['이름', '이메일']}
 * >
 *   {(user) => (
 *     <>
 *       <TcTable.Tr>
 *         <TcTable.Td>{user.name}</TcTable.Td>
 *         <TcTable.Td>{user.email}</TcTable.Td>
 *       </TcTable.Tr>
 *     </>
 *   )}
 * </TcTable.Body>
 *
 * @example
 * // 체크박스 선택 포함
 * <TcTable.Body
 *   type={TYPE.CHECKBOX}
 *   isLoading={false}
 *   rowData={users}
 *   columnNames={['이름', '이메일']}
 *   getSelectValue={(user) => user.id}
 *   onChange={(selectedIds) => console.log(selectedIds)}
 * >
 *   {(user, { selectCell }) => (
 *     <TcTable.Tr>
 *       <TcTable.Td>{selectCell()}</TcTable.Td>
 *       <TcTable.Td>{user.name}</TcTable.Td>
 *       <TcTable.Td>{user.email}</TcTable.Td>
 *     </TcTable.Tr>
 *   )}
 * </TcTable.Body>
 */
const Table = <T,>({
  type = TYPE.NONE, // 선택 방식 기본값: 없음
  isLoading,
  rowData,
  numberOfSkeletons = 5, // 로딩 중 표시할 스켈레톤 개수
  skeletonUI,
  errorUI = <DefaultErrorRow />, // 오류 UI 기본값
  emptyUI = <DefaultEmptyRow />, // 빈 데이터 UI 기본값
  footer,
  children, // 행 렌더링 함수
  className,
  onChange, // 선택 변경 콜백
  onSortChange, // 정렬 변경 콜백
  columnNames,
  selectedValues, // 외부에서 주입되는 선택값
  getSelectValue, // 행에서 선택값 추출 함수
  expandableUI, // 확장된 행 렌더링 함수
  canMultipleExpand = false, // 다중 확장 허용 여부
  selectOnRowClick = false, // 행 클릭 시 선택 토글
  expandOnRowClick = false, // 행 클릭 시 확장 토글
  stickyLastColumn = false, // 마지막 컬럼 sticky 고정
  getDisabled, // 행 비활성화 판별 함수
  resizable = false, // 컬럼 리사이즈 활성화
}: BodyProps<T>): React.ReactElement => {
  // 테이블 DOM 참조 (리사이즈 시 너비 측정용)
  const tableRef = useRef<HTMLTableElement>(null);

  // 컬럼 리사이즈 로직
  const { columnWidths, prefixWidth } = useColumnResizing({
    columnCount: columnNames.length,
    columnNames,
    tableRef,
    enabled: resizable,
  });

  // 선택된 행의 값들 (Set으로 중복 제거)
  const [checkedRowValues, setCheckedRowValues] = useState<Set<SelectValue>>(
    () => new Set(selectedValues ?? [])
  );

  // 확장된 행의 키들
  const [expandedKeys, setExpandedKeys] = useState<Set<SelectValue>>(() => new Set());

  // 라디오/체크박스 그룹명 생성 (중복 방지)
  const groupName = useId();

  // 선택 컬럼 여부 및 전체 colspan 계산
  const hasSelect = type !== TYPE.NONE;
  const fullColspan = columnNames.length + (hasSelect ? 1 : 0);

  // 행 확장/축소 토글 (다중 확장 설정에 따라 동작)
  const toggleExpand = (key: SelectValue) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);

      if (next.has(key)) {
        // 이미 확장된 행이면 축소
        next.delete(key);
      } else {
        // 단일 확장만 허용하면 다른 행 축소
        if (!canMultipleExpand) {
          next.clear();
        }
        // 새로운 행 확장
        next.add(key);
      }

      return next;
    });
  };

  // 헤더 컬럼 추론용 — 첫 번째 row의 구조만 추출
  const firstRow = rowData?.length
    ? children(rowData[0], { selectCell: () => null, expandButton: () => null })
    : undefined;

  // 각 행별 선택, 확장 상태 및 동작 처리
  const renderedRows = (rowData ?? []).map((row, index) => {
    // 행의 고유 키 생성 (getSelectValue 우선, 없으면 index)
    const rowKey = getSelectValue?.(row) ?? index;
    // 행의 확장 상태 확인
    const isExpanded = expandedKeys.has(rowKey);
    // 행의 비활성화 상태 확인
    const isDisabled = getDisabled?.(row) ?? false;

    // 행 선택 토글 (라디오는 단일, 체크박스는 다중)
    const toggleSelect = () => {
      if (!hasSelect) {
        return;
      }

      const next = new Set(checkedRowValues);

      if (type === TYPE.RADIO) {
        // 라디오: 이전 선택 제거 후 새로운 행만 선택
        next.clear();
        next.add(rowKey);
      } else if (next.has(rowKey)) {
        // 체크박스: 선택된 행이면 제거
        next.delete(rowKey);
      } else {
        // 체크박스: 선택되지 않은 행이면 추가
        next.add(rowKey);
      }

      setCheckedRowValues(next);
      onChange?.(Array.from(next));
    };

    // 행 클릭 시 동작 (선택 또는 확장 토글)
    const onRowClick = () => {
      if (selectOnRowClick) toggleSelect();
      if (expandOnRowClick) toggleExpand(rowKey);
    };

    // 컨텍스트를 통해 행 클릭 및 비활성화 상태 전달
    return (
      <RowContext.Provider
        value={{
          onRowClick: selectOnRowClick || expandOnRowClick ? onRowClick : null,
          disabled: isDisabled,
          stickyLastColumn,
        }}
      >
        {/* 자식 렌더링 함수에 선택셀 및 확장버튼 헬퍼 제공 */}
        {children(row, {
          selectCell: () =>
            hasSelect && (
              <SelectCell
                type={type}
                selectValue={getSelectValue?.(row)}
                index={index}
                groupName={groupName}
                checkedRowValues={checkedRowValues}
                setCheckedRowValues={setCheckedRowValues}
                onChange={onChange}
                disabled={isDisabled}
              />
            ),
          expandButton: () =>
            expandableUI && (
              <button
                type="button"
                className={expandButtonClassnames}
                onClick={(e) => {
                  e.stopPropagation(); // 행 클릭 이벤트 전파 방지
                  toggleExpand(rowKey);
                }}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
              >
                <ChevronRightIcon
                  size={16}
                  className={cn(expandIconClassnames, isExpanded && expandIconExpandedClassnames)}
                />
              </button>
            ),
        })}
      </RowContext.Provider>
    );
  });

  // 확장된 행들의 렌더링 결과 메모이제이션 (행 인덱스를 키로 저장)
  const expandedRows = useMemo(() => {
    const map = new Map<number, React.ReactNode>();
    if (!expandableUI || !rowData) {
      return map;
    }

    // 각 행별로 확장 상태 확인 및 UI 렌더링
    rowData.forEach((row, index) => {
      const key = getSelectValue?.(row) ?? index;
      if (expandedKeys.has(key)) {
        map.set(
          index,
          <tr className={bodyTrClassnames} aria-expanded>
            <td className={expandedTdClassnames} colSpan={fullColspan}>
              {expandableUI(row)}
            </td>
          </tr>
        );
      }
    });

    return map;
  }, [expandableUI, rowData, expandedKeys, getSelectValue, fullColspan]);

  // 테이블 본문 렌더링 (로딩/에러/빈 데이터/실제 데이터 상태 처리)
  const renderBody = () => {
    // 로딩 중: 스켈레톤 표시
    if (isLoading) {
      return (
        <TableSkeleton colSpan={fullColspan} count={numberOfSkeletons}>
          {skeletonUI}
        </TableSkeleton>
      );
    }

    // 데이터 조회 실패: 에러 UI 표시
    if (!rowData) {
      return (
        <TableSkeleton colSpan={fullColspan} count={1}>
          {errorUI}
        </TableSkeleton>
      );
    }

    // 빈 데이터: 빈 상태 UI 표시
    if (rowData.length === 0) {
      return (
        <TableSkeleton colSpan={fullColspan} count={1}>
          {emptyUI}
        </TableSkeleton>
      );
    }

    // 정상 데이터: 행 렌더링
    return (
      <TableBody
        rows={renderedRows}
        expandedRows={expandedRows}
        colSpan={fullColspan}
        errorUI={errorUI}
      />
    );
  };

  // 선택 가능한 행들의 값 (비활성화된 행 제외)
  const selectableRowValues = getSelectValue
    ? (rowData ?? []).filter((row) => !getDisabled?.(row)).map(getSelectValue)
    : [];

  // 이전 로딩 상태 저장 (로딩 완료 감지용)
  const prevIsLoading = useRef(isLoading);
  // 이전 selectedValues 참조 저장 (외부 변경 감지용)
  const prevSelectedRef = useRef(selectedValues);

  // 로딩 완료 또는 외부 selectedValues 변경 시 내부 상태 동기화
  useEffect(() => {
    const loadingJustFinished = prevIsLoading.current && !isLoading;
    const externalChange = selectedValues !== prevSelectedRef.current;

    // 로딩 완료 직후 또는 외부 selectedValues 변경 시 동기화
    if (loadingJustFinished || (!isLoading && externalChange)) {
      setCheckedRowValues(new Set(selectedValues ?? []));
    }

    prevIsLoading.current = isLoading;
    prevSelectedRef.current = selectedValues;
  }, [isLoading, selectedValues]);

  // 리사이즈 활성 + 너비 측정 완료 시에만 <colgroup> 렌더링
  const hasWidths = resizable && columnWidths.length > 0;

  return (
    <div className={tableWrapperClassName}>
      <table ref={tableRef} className={cn(tableClassnames, className)}>
        {/* 리사이징을 위한 col 너비 지정 */}
        {hasWidths && (
          <ColumnWidths
            columnWidths={columnWidths}
            prefixWidth={prefixWidth}
            hasSelect={hasSelect}
          />
        )}
        {/* 헤더 행 (정렬, 전체 선택 기능) */}
        <TableHeader
          type={type}
          firstRow={firstRow}
          columnNames={columnNames}
          stickyLastColumn={stickyLastColumn}
          rowValues={selectableRowValues}
          checkedRowValues={checkedRowValues}
          setCheckedRowValues={setCheckedRowValues}
          onChange={onChange}
          onSortChange={onSortChange}
          isLoading={isLoading}
        />
        {/* 본문 (로딩/에러/빈 데이터/실제 데이터) */}
        {renderBody()}
        {/* 푸터 행 */}
        <TableFooter colSpan={fullColspan}>{footer}</TableFooter>
      </table>
    </div>
  );
};

/**
 * TcTable 네임스페이스
 * 테이블을 구성하는 모든 하위 컴포넌트 모음
 *
 * @namespace TcTable
 * @property {Function} Body - 메인 테이블 컴포넌트 (행 데이터 렌더링)
 * @property {Function} Tr - 테이블 행 컴포넌트
 * @property {Function} Td - 테이블 셀 컴포넌트
 *
 * @example
 * import TcTable from '@thaki/shared';
 *
 * <TcTable.Body {...bodyProps}>
 *   {(row) => (
 *     <TcTable.Tr>
 *       <TcTable.Td>{row.value}</TcTable.Td>
 *     </TcTable.Tr>
 *   )}
 * </TcTable.Body>
 */
const TcTable = {
  Body: Table,
  Tr,
  Td,
} as const;

export default TcTable;
