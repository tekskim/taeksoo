import { useState, useCallback, useRef, useEffect } from 'react';
import type { TableColumn } from './Table.types';
import { TABLE_COLUMN_MIN_WIDTH } from './Table.constants';

export interface UseTableResizeProps {
  columns: TableColumn[];
  columnWidths?: Record<string, number>;
  maxWidth?: number | string;
  onColumnResize?: (columnKey: string, newWidth: number) => void;
}

/**
 * 테이블 전체의 컬럼 리사이징 상태 관리 및 다중 컬럼 조정 로직
 *
 * - 모든 컬럼의 너비 상태를 관리하고 외부 props와 동기화
 * - maxWidth 설정 시 한 컬럼 확대 시 오른쪽 컬럼들을 비율에 맞게 축소
 * - DOM 기반 실제 렌더링 너비 측정 및 적용
 */
export const useTableResize = ({
  columns,
  columnWidths,
  maxWidth,
  onColumnResize,
}: UseTableResizeProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [internalWidths, setInternalWidths] = useState<Record<string, number> | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const startWidthsRef = useRef<Record<string, number>>({});

  // 1️⃣ 외부 props(columnWidths)와 내부 상태(internalWidths) 동기화
  // - 리사이징 중에는 동기화하지 않음 (드래그 중 외부 업데이트 방지)
  useEffect(() => {
    if (columnWidths && !isResizing) {
      setInternalWidths(columnWidths);
    }
  }, [columnWidths, isResizing]);

  // 2️⃣ 현재 컬럼들의 실제 너비를 측정
  // - tableRef가 있으면: DOM에서 실제 렌더링된 너비 측정
  // - tableRef가 없으면: props 값을 fallback으로 사용
  const getCurrentWidths = useCallback(() => {
    if (!tableRef.current) {
      return columns.reduce(
        (acc, col) => {
          const widthValue =
            columnWidths?.[col.key] ??
            (typeof col.width === 'number'
              ? col.width
              : typeof col.width === 'string'
                ? Number.parseFloat(col.width)
                : undefined);
          acc[col.key] =
            widthValue != null && !Number.isNaN(widthValue) ? widthValue : TABLE_COLUMN_MIN_WIDTH;
          return acc;
        },
        {} as Record<string, number>
      );
    }

    const headers = tableRef.current.querySelectorAll('thead th');
    return columns.reduce(
      (acc, col, index) => {
        const header = headers[index] as HTMLElement;
        acc[col.key] = header
          ? header.getBoundingClientRect().width
          : (columnWidths?.[col.key] ??
            (typeof col.width === 'number'
              ? col.width
              : typeof col.width === 'string'
                ? Number.parseFloat(col.width)
                : TABLE_COLUMN_MIN_WIDTH));
        return acc;
      },
      {} as Record<string, number>
    );
  }, [columns, columnWidths]);

  // 3️⃣ 계산된 새 너비를 DOM에 직접 적용
  // - width, minWidth, maxWidth를 모두 설정하여 고정 너비 유지
  const applyWidths = useCallback(
    (newWidths: Record<string, number>) => {
      if (!tableRef.current) return;

      const headers = tableRef.current.querySelectorAll('thead th');

      columns.forEach((col, index) => {
        const newWidth = newWidths[col.key];
        if (newWidth === undefined) return;

        const header = headers[index] as HTMLElement;
        if (header) {
          const widthPx = `${newWidth}px`;
          header.style.width = widthPx;
          header.style.minWidth = widthPx;
          header.style.maxWidth = widthPx;
        }
      });
    },
    [columns]
  );

  // 4️⃣ 컬럼 리사이징 메인 로직
  const handleColumnResize = useCallback(
    (columnKey: string, newWidth: number) => {
      if (!tableRef.current) return;

      const startWidths = startWidthsRef.current;
      const newWidths = { ...startWidths, [columnKey]: newWidth };

      // maxWidth 제약이 있는 경우: 한 컬럼이 커지면 오른쪽 컬럼들을 축소
      if (maxWidth) {
        const columnIndex = columns.findIndex((col) => col.key === columnKey);
        const rightColumns = columns.filter((_, idx) => idx > columnIndex);

        if (rightColumns.length > 0) {
          // 오른쪽 컬럼들의 총 너비 계산
          const totalRightWidth = rightColumns.reduce((sum, col) => sum + startWidths[col.key], 0);

          // 각 오른쪽 컬럼을 너비 비율에 맞게 축소
          // 예: A컬럼 +100px 증가 → B(200px), C(100px)가 있다면
          //     B는 2/3만큼(66px), C는 1/3만큼(33px) 감소
          let remaining = newWidth - startWidths[columnKey];
          rightColumns.forEach((col, idx) => {
            const startWidth = startWidths[col.key];
            const ratio = startWidth / totalRightWidth;
            const reduction =
              idx === rightColumns.length - 1
                ? remaining // 마지막 컬럼: 남은 차이를 모두 적용 (반올림 오차 보정)
                : Math.round((newWidth - startWidths[columnKey]) * ratio);

            newWidths[col.key] = Math.max(TABLE_COLUMN_MIN_WIDTH, startWidth - reduction);
            remaining -= startWidth - newWidths[col.key];
          });
        }
      }

      setInternalWidths(newWidths);
      applyWidths(newWidths);

      // 변경된 컬럼들만 부모 컴포넌트에 알림
      if (onColumnResize) {
        Object.entries(newWidths).forEach(([key, width]) => {
          if (width !== startWidths[key]) {
            onColumnResize(key, width);
          }
        });
      }
    },
    [columns, maxWidth, onColumnResize, applyWidths]
  );

  // 5️⃣ 리사이징 시작: 초기 상태 저장 및 테이블 설정
  const handleResizeStart = useCallback(
    (_columnKey: string, _startX: number, tableElement: HTMLTableElement) => {
      tableRef.current = tableElement;
      startWidthsRef.current = getCurrentWidths(); // 모든 컬럼의 시작 너비 저장
      setIsResizing(true);

      tableElement.classList.add('resizing'); // CSS 스타일링용 클래스

      // maxWidth가 설정된 경우: 테이블 전체를 고정 레이아웃으로 전환
      if (maxWidth) {
        const width = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
        tableElement.style.width = width;
        tableElement.style.tableLayout = 'fixed';
      }
    },
    [getCurrentWidths, maxWidth]
  );

  // 6️⃣ 리사이징 종료: 정리 작업
  const handleResizeEnd = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.classList.remove('resizing');
      tableRef.current = null;
    }
    setIsResizing(false);
  }, []);

  // 7️⃣ 컬럼 너비 계산: 우선순위에 따라 반환
  // internalWidths (리사이징 상태) → columnWidths (외부 props) → column.width (기본값)
  const getColumnWidth = useCallback(
    (column: TableColumn) => {
      return internalWidths?.[column.key] ?? columnWidths?.[column.key] ?? column.width;
    },
    [internalWidths, columnWidths]
  );

  return {
    isResizing,
    handleColumnResize,
    handleResizeStart,
    handleResizeEnd,
    getColumnWidth,
  };
};
