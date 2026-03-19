/**
 * 공통 스타일
 */

/** 액션 바 (필터, 버튼 등) - 리스트/탭 공통 사용 */
export const actionBarStyle =
  'flex items-center justify-start flex-wrap gap-[var(--semantic-space-sm)]';

/**
 * 상세페이지 탭 하위에서 사용하는 스타일
 */
export const tabStyles = {
  /** 컨테이너: 12px 간격 */
  container: 'flex flex-col gap-[var(--primitive-space-3)] w-full',
} as const;

/**
 * 리스트 페이지에서 사용하는 스타일
 */
export const listStyles = {
  /** 헤더/탭/테이블 영역 래퍼: 12px 간격 */
  content: 'flex flex-col gap-[var(--primitive-space-3)] w-full min-w-0',
  /** 테이블 컨테이너 (액션바/필터/페이지네이션/테이블): 12px 간격 */
  tableContainer: 'flex flex-col gap-[var(--primitive-space-3)] w-full',
} as const;
