import { useState, useCallback } from 'react';

/**
 * 드래그앤드롭 아이템의 기본 인터페이스
 *
 * 드래그앤드롭 기능을 사용하는 모든 아이템이 구현해야 하는 기본 속성들을 정의합니다.
 * 각 아이템은 고유한 식별자를 가져야 하며, 드래그 가능 여부와 고정 여부를 설정할 수 있습니다.
 *
 * @param id - 아이템 고유 식별자 (필수)
 * @param draggable - 드래그 가능 여부 (기본값: true)
 * @param fixed - 고정 아이템 여부, true일 경우 이동 불가 (기본값: false)
 */
export interface DragAndDropItem {
  id: string;
  draggable?: boolean;
  fixed?: boolean;
}

/**
 * 드래그앤드롭 상태를 관리하는 인터페이스
 *
 * 현재 드래그 중인 아이템과 드래그 오버 중인 아이템의 인덱스를 추적합니다.
 * 이 상태 정보를 통해 시각적 피드백과 드롭 가능 여부를 판단할 수 있습니다.
 *
 * @param draggedIndex - 현재 드래그 중인 아이템의 인덱스 (드래그 중이 아닐 때는 null)
 * @param dragOverIndex - 드래그 오버 중인 아이템의 인덱스 (드래그 오버 중이 아닐 때는 null)
 */
export interface DragAndDropState {
  draggedIndex: number | null;
  dragOverIndex: number | null;
}

/**
 * useDragAndDrop 훅의 옵션 인터페이스
 *
 * 드래그앤드롭 기능을 구성하기 위한 필수 및 선택적 옵션들을 정의합니다.
 * 아이템 목록과 순서 변경 콜백은 필수이며, 드래그/드롭 가능 여부 검사 함수는 선택사항입니다.
 *
 * @param items - 드래그앤드롭을 적용할 아이템 목록 (필수)
 * @param onReorder - 아이템 순서 변경 시 호출되는 콜백 함수 (필수)
 * @param canDrag - 특정 아이템의 드래그 가능 여부를 검사하는 함수 (선택사항, 기본: item.draggable && !item.fixed)
 * @param canDrop - 특정 위치에 드롭 가능 여부를 검사하는 함수 (선택사항, 기본: !item.fixed)
 */
export interface UseDragAndDropOptions<T extends DragAndDropItem> {
  items: T[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  canDrag?: (item: T, index: number) => boolean;
  canDrop?: (item: T, index: number) => boolean;
}

/**
 * useDragAndDrop 훅의 반환값 인터페이스
 *
 * 드래그앤드롭 기능을 구현하기 위해 필요한 모든 상태와 핸들러 함수들을 제공합니다.
 * 이벤트 핸들러들은 HTML 요소에 직접 연결하여 사용하고, 상태 확인 함수들은 조건부 렌더링에 활용할 수 있습니다.
 *
 * @param state - 현재 드래그앤드롭 상태 (draggedIndex, dragOverIndex 포함)
 * @param handleDragStart - 드래그 시작 시 호출할 이벤트 핸들러
 * @param handleDragOver - 드래그 오버 시 호출할 이벤트 핸들러
 * @param handleDragLeave - 드래그 리브 시 호출할 이벤트 핸들러
 * @param handleDrop - 드롭 시 호출할 이벤트 핸들러
 * @param handleDragEnd - 드래그 종료 시 호출할 이벤트 핸들러
 * @param isDragging - 특정 인덱스의 아이템이 드래그 중인지 확인하는 함수
 * @param isDragOver - 특정 인덱스의 아이템이 드래그 오버 중인지 확인하는 함수
 * @param canDragItem - 특정 인덱스의 아이템이 드래그 가능한지 확인하는 함수
 * @param canDropItem - 특정 인덱스 위치에 드롭 가능한지 확인하는 함수
 */
export interface UseDragAndDropReturn {
  state: DragAndDropState;
  handleDragStart: (e: React.DragEvent, index: number) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, index: number) => void;
  handleDragEnd: () => void;
  isDragging: (index: number) => boolean;
  isDragOver: (index: number) => boolean;
  canDragItem: (index: number) => boolean;
  canDropItem: (index: number) => boolean;
}

/**
 * 드래그앤드롭 기능을 제공하는 React 커스텀 훅
 *
 * HTML5 드래그앤드롭 API를 사용하여 아이템 목록의 순서를 변경할 수 있는 기능을 제공합니다.
 * 상태 관리, 이벤트 핸들링, 유효성 검사 등을 자동으로 처리하여 개발자가 비즈니스 로직에만 집중할 수 있도록 합니다.
 *
 * @example
 * ```tsx
 * const { handleDragStart, handleDrop, isDragging } = useDragAndDrop({
 *   items: columns,
 *   onReorder: (fromIndex, toIndex) => {
 *     // 컬럼 순서 재배열 로직
 *   }
 * });
 * ```
 *
 * @param options - 드래그앤드롭 설정 옵션
 * @returns 드래그앤드롭 상태와 이벤트 핸들러들
 */
export function useDragAndDrop<T extends DragAndDropItem>({
  items,
  onReorder,
  canDrag,
  canDrop,
}: UseDragAndDropOptions<T>): UseDragAndDropReturn {
  // draggedIndex: 현재 드래그 중인 아이템의 인덱스 (드래그 시작 시 설정)
  // dragOverIndex: 현재 드래그 오버 중인 아이템의 인덱스 (드래그 오버 시 설정)
  const [state, setState] = useState<DragAndDropState>({
    draggedIndex: null,
    dragOverIndex: null,
  });

  // 기본 드래그 가능 여부 검사 함수
  // draggable이 false가 아니고, fixed가 아닌 아이템만 드래그 가능
  const defaultCanDrag = useCallback((item: T, _index: number): boolean => {
    return Boolean(item.draggable !== false && !item.fixed);
  }, []);

  // 기본 드롭 가능 여부 검사 함수
  // fixed가 아닌 위치에만 드롭 가능
  const defaultCanDrop = useCallback((item: T, _index: number): boolean => {
    return Boolean(!item.fixed);
  }, []);

  // 특정 인덱스의 아이템이 드래그 가능한지 확인
  const canDragItem = useCallback(
    (index: number): boolean => {
      // 유효하지 않은 인덱스는 드래그 불가
      if (index < 0 || index >= items.length) return false;

      const item = items[index];
      // 커스텀 canDrag 함수가 있으면 사용, 없으면 기본 함수 사용
      return canDrag ? canDrag(item, index) : defaultCanDrag(item, index);
    },
    [items, canDrag, defaultCanDrag]
  );

  // 특정 인덱스 위치에 드롭이 가능한지 확인
  const canDropItem = useCallback(
    (index: number): boolean => {
      // 유효하지 않은 인덱스는 드롭 불가
      if (index < 0 || index >= items.length) return false;

      const item = items[index];
      // 커스텀 canDrop 함수가 있으면 사용, 없으면 기본 함수 사용
      return canDrop ? canDrop(item, index) : defaultCanDrop(item, index);
    },
    [items, canDrop, defaultCanDrop]
  );

  // 드래그 시작 이벤트 핸들러
  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number): void => {
      // 드래그 불가능한 아이템이면 드래그 시작을 방지
      if (!canDragItem(index)) {
        e.preventDefault();
        return;
      }

      // 드래그 중인 아이템의 인덱스를 상태에 저장
      setState(prev => ({ ...prev, draggedIndex: index }));

      // 드래그 효과를 'move'로 설정 (이동 커서 표시)
      e.dataTransfer.effectAllowed = 'move';

      // 드래그 데이터에 현재 요소의 HTML을 저장 (시각적 피드백용)
      e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    },
    [canDragItem]
  );

  // 드래그 오버 이벤트 핸들러 (드래그 중인 아이템이 다른 아이템 위에 있을 때)
  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number): void => {
      // 기본 동작 방지 (드롭을 허용하기 위해 필요)
      e.preventDefault();

      // 다음 조건 중 하나라도 해당하면 드래그 오버 처리하지 않음:
      // 1. 드롭 불가능한 위치
      // 2. 드래그 중인 아이템이 없음
      // 3. 자기 자신 위에 드래그 오버
      if (
        !canDropItem(index) ||
        state.draggedIndex === null ||
        state.draggedIndex === index
      ) {
        return;
      }

      // 드래그 오버 중인 아이템의 인덱스를 상태에 저장
      setState(prev => ({ ...prev, dragOverIndex: index }));
    },
    [canDropItem, state.draggedIndex]
  );

  // 드래그 리브 이벤트 핸들러 (드래그 중인 아이템이 요소를 벗어날 때)
  const handleDragLeave = useCallback((): void => {
    // 드래그 오버 상태를 초기화
    setState(prev => ({ ...prev, dragOverIndex: null }));
  }, []);

  // 드롭 이벤트 핸들러 (실제 드롭이 발생했을 때)
  const handleDrop = useCallback(
    (e: React.DragEvent, index: number): void => {
      // 기본 동작 방지
      e.preventDefault();

      // 다음 조건 중 하나라도 해당하면 드롭 처리하지 않음:
      // 1. 드래그 중인 아이템이 없음
      // 2. 드롭 불가능한 위치
      // 3. 자기 자신에게 드롭
      if (
        state.draggedIndex === null ||
        !canDropItem(index) ||
        state.draggedIndex === index
      ) {
        return;
      }

      // 실제 순서 변경 실행 (부모 컴포넌트의 onReorder 콜백 호출)
      onReorder(state.draggedIndex, index);

      // 드래그앤드롭 상태 초기화
      setState({ draggedIndex: null, dragOverIndex: null });
    },
    [state.draggedIndex, canDropItem, onReorder]
  );

  // 드래그 종료 이벤트 핸들러 (드래그가 완전히 끝났을 때)
  const handleDragEnd = useCallback((): void => {
    // 모든 드래그앤드롭 상태 초기화 (드롭 실패 시에도 호출됨)
    setState({ draggedIndex: null, dragOverIndex: null });
  }, []);

  // 특정 인덱스의 아이템이 현재 드래그 중인지 확인
  const isDragging = useCallback(
    (index: number): boolean => {
      return state.draggedIndex === index;
    },
    [state.draggedIndex]
  );

  // 특정 인덱스의 아이템이 현재 드래그 오버 중인지 확인
  // 자기 자신은 드래그 오버 대상에서 제외
  const isDragOver = useCallback(
    (index: number): boolean => {
      return state.dragOverIndex === index && state.draggedIndex !== index;
    },
    [state.dragOverIndex, state.draggedIndex]
  );

  return {
    state,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    isDragging,
    isDragOver,
    canDragItem,
    canDropItem,
  };
}
