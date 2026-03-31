import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface UseColumnResizingOptions {
  /** 데이터 컬럼 개수 (선택/확장 컬럼 제외) */
  columnCount: number;
  /** 컬럼 이름 목록 — 헤더 변경 시 핸들을 다시 부착하기 위한 의존성으로 사용 */
  columnNames: string[];
  /** <table> 요소에 대한 참조 */
  tableRef: React.RefObject<HTMLTableElement | null>;
  /** 리사이징 활성화/비활성화 (기본값: true) */
  enabled?: boolean;
  /** 최소 컬럼 너비 (픽셀 단위, 기본값: 50) */
  minWidth?: number;
}

interface UseColumnResizingReturn {
  /** 픽셀 값으로 표현된 컬럼 너비; 아직 초기화되지 않았을 때는 빈 배열 */
  columnWidths: number[];
  /** 접두사 컬럼(선택/라디오)의 너비 (픽셀); 없을 때는 0 */
  prefixWidth: number;
  /** 현재 리사이징 드래그가 진행 중인지 여부 */
  isResizing: boolean;
}

// ── 명령형 리사이즈 핸들을 위한 인라인 스타일 ──
// 각 컬럼 헤더의 오른쪽 끝에 추가될 드래그 가능한 핸들
const HANDLE_STYLES: Partial<CSSStyleDeclaration> = {
  position: 'absolute', // 부모 <th>에 절대 위치
  right: '0', // 오른쪽 끝에 정렬
  top: '0',
  bottom: '0',
  width: '4px', // 얇은 수직 선
  cursor: 'col-resize', // 리사이징 가능 표시
  zIndex: '10', // 다른 요소 위에 표시
  background: 'transparent',
  transition: 'background 150ms', // 호버 시 색상 부드럽게 변경
};

// 호버 시 표시할 색상 (기본값: 파란색 반투명)
const HANDLE_HOVER_BG = 'var(--semantic-color-primary-default, rgba(59,130,246,0.4))';

/** 테이블 헤더 행에서 data-column <th> 요소를 읽기 */
const getDataThElements = (table: HTMLTableElement, columnCount: number): HTMLElement[] => {
  // 테이블 헤더 행 가져오기
  const headerRow = table.querySelector('thead tr');
  if (!headerRow) return [];

  // 모든 <th> 요소 수집
  const ths = Array.from(headerRow.querySelectorAll('th'));

  // 데이터 컬럼은 마지막 `columnCount`개의 <th> 요소 (선택/라디오 건너뜀)
  // 예: 선택 컬럼 1개 + 데이터 컬럼 3개 = 총 4개 중 뒤 3개만 반환
  return ths.slice(ths.length - columnCount) as HTMLElement[];
};

/**
 * 헤더 셀의 오른쪽 테두리를 드래그하여 컬럼 리사이징을 활성화하는 훅입니다.
 *
 * 모든 리사이징 로직 — 핸들 생성, 이벤트 와이어링, 커서 관리 — 는
 * 완전히 여기에 캡슐화되어 있습니다. 헤더/바디 컴포넌트는 리사이징에 대해 완전히 인식할 필요가 없습니다.
 *
 * 전체 테이블 너비는 보존됩니다: 컬럼 테두리를 드래그하면 드래그한 컬럼과 그 오른쪽 이웃 사이의
 * 공간을 재분배합니다 (이웃에서 빼앗기).
 * 마지막 컬럼에는 오른쪽 이웃이 없으므로 핸들이 없습니다.
 */
export const useColumnResizing = ({
  columnCount,
  columnNames,
  tableRef,
  enabled = true,
  minWidth = 50,
}: UseColumnResizingOptions): UseColumnResizingReturn => {
  // 상태: 각 컬럼의 현재 너비 (픽셀)
  const [columnWidths, setColumnWidths] = useState<number[]>([]);

  // 상태: 선택/라디오 등 접두사 컬럼들의 전체 너비
  const [prefixWidth, setPrefixWidth] = useState(0);

  // 상태: 현재 리사이징 드래그 진행 중 여부
  const [isResizing, setIsResizing] = useState(false);

  // 변경 가능한 드래그 상태 — 전역 리스너에서 오래된 클로저를 피함
  // 드래그 중 컬럼 인덱스, 시작 X 좌표, 시작 너비 저장
  const dragRef = useRef<{
    columnIndex: number;
    startX: number;
    startWidths: number[];
  } | null>(null);

  // 스로틀된 mousemove 업데이트를 위한 rAF 핸들
  // requestAnimationFrame ID를 저장하여 중복 실행 방지
  const rafRef = useRef(0);

  // 생성된 핸들과 수정된 <th> 요소를 정리를 위해 추적
  // 컴포넌트 언마운트 시 생성한 요소들을 정리
  const handlesRef = useRef<HTMLDivElement[]>([]);
  const modifiedThsRef = useRef<HTMLElement[]>([]);

  // columnNames의 안정적인 직렬화된 키 — 이름 변경 시 재초기화 트리거
  // 컬럼 이름이 변경되면 모든 핸들을 다시 생성
  const columnKey = columnNames.join('\0');

  // ── 너비를 동기적으로 씨앗 (페인트 전)하여 레이아웃 시프트를 피함 ──
  // useLayoutEffect는 DOM 업데이트 직후, 브라우저 페인트 전에 실행
  useLayoutEffect(() => {
    // 리사이징 비활성화 또는 테이블 없으면 초기화
    if (!enabled || !tableRef.current) {
      setColumnWidths([]);
      setPrefixWidth(0);
      return;
    }

    const table = tableRef.current;
    const headerRow = table.querySelector('thead tr');
    if (!headerRow) return;

    // 모든 <th> 요소 수집 (선택 + 데이터 컬럼)
    const allThs = Array.from(headerRow.querySelectorAll('th')) as HTMLElement[];
    const prefixCount = allThs.length - columnCount;

    // 접두사(선택/라디오) 컬럼 측정
    // offsetWidth로 각 요소의 실제 너비를 계산
    const prefix = allThs.slice(0, prefixCount).reduce((sum, th) => sum + th.offsetWidth, 0);
    setPrefixWidth(prefix);

    // 데이터 컬럼 측정
    // 각 데이터 컬럼의 너비를 배열로 저장
    const dataThs = allThs.slice(prefixCount);
    if (dataThs.length === 0) return;

    setColumnWidths(dataThs.map((th) => th.offsetWidth));
  }, [enabled, columnCount, columnKey, tableRef]);

  // ── 명령형 리사이즈 핸들 생성/제거 ──
  // 리사이징 활성화 또는 컬럼 구조 변경 시 핸들을 다시 생성
  useEffect(() => {
    if (!enabled || !tableRef.current) return;

    const dataThElements = getDataThElements(tableRef.current, columnCount);
    if (dataThElements.length === 0) return;

    const handles: HTMLDivElement[] = [];
    const modifiedThs: HTMLElement[] = [];

    // 마지막 컬럼을 제외한 모든 컬럼에 대해 핸들 생성 (오른쪽 이웃 없음)
    // 각 컬럼 헤더에 오른쪽 끝에 드래그 가능한 핸들 추가
    dataThElements.forEach((thEl, index) => {
      // 마지막 컬럼은 오른쪽 이웃이 없으므로 핸들 생성 안 함
      if (index >= dataThElements.length - 1) return;

      // 절대 위치 자식을 위해 th가 위치 지정되도록 보장
      // position이 static이면 relative로 변경 (절대 위치 자식 포함 가능하게)
      if (getComputedStyle(thEl).position === 'static') {
        thEl.style.position = 'relative';
        modifiedThs.push(thEl); // 정리 시 복원하기 위해 기록
      }

      // 핸들 요소 생성 및 스타일 적용
      const handle = document.createElement('div');
      Object.assign(handle.style, HANDLE_STYLES);
      handle.setAttribute('role', 'separator'); // 접근성: 분리자 역할
      handle.setAttribute('aria-orientation', 'vertical'); // 접근성: 수직 분리자

      // 호버 피드백: 마우스 들어갈 때 색상 변경
      handle.addEventListener('mouseenter', () => {
        // 드래그 중이 아닐 때만 호버 색상 표시
        if (!dragRef.current) handle.style.background = HANDLE_HOVER_BG;
      });

      // 호버 피드백: 마우스 나갈 때 색상 복원
      handle.addEventListener('mouseleave', () => {
        if (!dragRef.current) handle.style.background = 'transparent';
      });

      // 드래그 시작: 마우스 누르면 드래그 상태 활성화
      handle.addEventListener('mousedown', (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // 드래그 상태 저장 (초기 마우스 위치, 컬럼 인덱스, 현재 너비)
        setColumnWidths((prev) => {
          dragRef.current = {
            columnIndex: index,
            startX: e.clientX,
            startWidths: [...prev], // 현재 너비 스냅샷
          };
          return prev;
        });

        setIsResizing(true);
        handle.style.background = HANDLE_HOVER_BG; // 드래그 시작 표시
      });

      // 생성한 핸들을 <th>에 추가
      thEl.appendChild(handle);
      handles.push(handle);
    });

    // 생성한 핸들과 수정한 요소 기록 (나중에 정리하기 위해)
    handlesRef.current = handles;
    modifiedThsRef.current = modifiedThs;

    // 정리: 컬럼 구조 변경 시 이전 핸들 제거 및 스타일 복원
    return () => {
      // 모든 핸들 제거
      handles.forEach((h) => h.remove());
      handlesRef.current = [];

      // 수정한 <th>s의 position 스타일 복원
      modifiedThs.forEach((th) => {
        th.style.position = '';
      });
      modifiedThsRef.current = [];

      // deps가 변경되었을 때 드래그가 진행 중이었다면 취소
      if (dragRef.current) {
        dragRef.current = null;
        setIsResizing(false);
      }
    };
  }, [enabled, columnCount, columnKey, tableRef]);

  // ── 드래그 중 전역 mousemove / mouseup ──
  // 리사이징 중 마우스 이동과 해제 감지
  useEffect(() => {
    // 드래그 중이 아니면 불필요하므로 조기 반환
    if (!isResizing) return;

    const { body } = document;
    // 이전 스타일 저장 (정리 시 복원용)
    const prevCursor = body.style.cursor;
    const prevUserSelect = body.style.userSelect;

    // 테이블 밖에서도 커서가 col-resize로 유지되도록 전역으로 적용
    // 부드러운 드래깅 경험을 위해 문서 전체에 적용
    body.style.cursor = 'col-resize';
    body.style.userSelect = 'none'; // 드래그 중 텍스트 선택 방지

    // 리사이징 로직: 마우스 이동에 따라 컬럼 너비 조정
    const applyResize = (clientX: number, drag: NonNullable<typeof dragRef.current>) => {
      const { columnIndex, startX, startWidths } = drag;
      const neighborIndex = columnIndex + 1; // 오른쪽 이웃 컬럼

      // 마우스 이동 거리 계산
      const rawDelta = clientX - startX;

      // 두 컬럼 모두 minWidth 이하로 가지 않도록 클램프
      // 예: minWidth=50, 이웃 너비=100이면 최대 50px까지만 줄일 수 있음
      const maxGrow = startWidths[neighborIndex] - minWidth;
      const maxShrink = -(startWidths[columnIndex] - minWidth);
      const delta = Math.min(maxGrow, Math.max(maxShrink, rawDelta));

      // 새로운 너비 계산: 드래그한 컬럼은 증가, 이웃은 감소
      const next = [...startWidths];
      next[columnIndex] = startWidths[columnIndex] + delta;
      next[neighborIndex] = startWidths[neighborIndex] - delta;

      // 상태 업데이트하여 테이블 리렌더링
      setColumnWidths(next);
    };

    // 마우스 이동 핸들러: 리사이징 계산
    const handleMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return; // 드래그 상태 없으면 무시

      // 스로틀: 한 프레임에 최대 한 번만 업데이트
      // requestAnimationFrame으로 브라우저 리페인트 속도에 맞춤
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => applyResize(e.clientX, drag));
    };

    // 마우스 해제 핸들러: 드래그 종료
    const handleMouseUp = () => {
      cancelAnimationFrame(rafRef.current);
      dragRef.current = null; // 드래그 상태 초기화
      setIsResizing(false); // 리사이징 상태 종료

      // 핸들 하이라이트 복원 (호버 색상 제거)
      handlesRef.current.forEach((h) => {
        h.style.background = 'transparent';
      });
    };

    // 전역 이벤트 리스너 등록 (테이블 밖에서의 마우스 이동도 감지)
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // 정리: 리스너 제거 및 스타일 복원
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // 원본 body 스타일 복원
      body.style.cursor = prevCursor;
      body.style.userSelect = prevUserSelect;
    };
  }, [isResizing, minWidth]);

  // 반환 값: 리사이징이 비활성화된 경우 빈 배열 반환
  // 활성화된 경우 측정한 컬럼 너비와 접두사 너비, 드래그 상태 반환
  return {
    columnWidths: enabled ? columnWidths : [],
    prefixWidth: enabled ? prefixWidth : 0,
    isResizing,
  };
};
