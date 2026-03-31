import { useState, useCallback, useRef } from 'react';
import type { TableColumn } from './Table.types';
import { TABLE_COLUMN_MIN_WIDTH } from './Table.constants';

export interface UseColumnResizeProps {
  column: TableColumn;
  onColumnResize?: (columnKey: string, newWidth: number) => void;
  onResizeStart?: (columnKey: string, startX: number, tableElement: HTMLTableElement) => void;
  onResizeEnd?: (columnKey: string) => void;
}

/**
 * 단일 컬럼의 마우스 드래그 이벤트 핸들링
 *
 * - 마우스 다운/무브/업 이벤트 처리
 * - requestAnimationFrame 기반 성능 최적화
 * - 드래그 이동량 계산 및 새로운 너비 산출
 */
export const useColumnResize = ({
  column,
  onColumnResize,
  onResizeStart,
  onResizeEnd,
}: UseColumnResizeProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const resizeDataRef = useRef<{
    startMouseX: number;
    startWidth: number;
  } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!onColumnResize || !onResizeStart) return;

      e.preventDefault();
      e.stopPropagation();

      const th = (e.target as HTMLElement).closest('th');
      if (!th) return;

      const table = th.closest('table') as HTMLTableElement | null;
      if (!table) return;

      // 1️⃣ 리사이징 시작 시점의 기준점 저장
      // - startMouseX: 마우스 클릭 위치 (이후 이동량 계산의 기준)
      // - startWidth: 컬럼의 초기 너비 (이후 새 너비 계산의 기준)
      const rect = th.getBoundingClientRect();
      resizeDataRef.current = {
        startMouseX: e.clientX,
        startWidth: rect.width,
      };

      setIsResizing(true);
      onResizeStart(column.key, e.clientX, table);

      // 2️⃣ RAF 기반 성능 최적화
      // - RAF: 브라우저 리페인트 주기(보통 60fps)와 동기화
      let rafId: number | null = null;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        moveEvent.preventDefault();
        if (!resizeDataRef.current) return;

        // 이전 RAF가 아직 실행 대기 중이면 취소하고 새로운 RAF 예약
        if (rafId) cancelAnimationFrame(rafId);

        rafId = requestAnimationFrame(() => {
          if (!resizeDataRef.current) return;

          // 3️⃣ 마우스 이동량(deltaX)을 계산하여 새 너비 산출
          // 새 너비 = 초기 너비 + 마우스 이동량
          const deltaX = moveEvent.clientX - resizeDataRef.current.startMouseX;
          const newWidth = Math.max(
            TABLE_COLUMN_MIN_WIDTH,
            resizeDataRef.current.startWidth + deltaX
          );

          onColumnResize(column.key, newWidth);
        });
      };

      const handleMouseUp = () => {
        // 4️⃣ 리사이징 종료: RAF 정리 및 이벤트 리스너 제거
        if (rafId) cancelAnimationFrame(rafId);

        setIsResizing(false);
        resizeDataRef.current = null;
        onResizeEnd?.(column.key);

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      // passive: false - preventDefault() 사용을 위해 필수
      document.addEventListener('mousemove', handleMouseMove, {
        passive: false,
      });
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onColumnResize, onResizeStart, onResizeEnd, column.key]
  );

  return {
    isResizing,
    isResizable: Boolean(onColumnResize),
    handleMouseDown,
  };
};
