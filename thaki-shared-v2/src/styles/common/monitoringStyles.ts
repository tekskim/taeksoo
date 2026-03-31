/**
 * Monitoring 공통 스타일 정의
 * 모든 모니터링 탭에서 일관된 스타일을 적용하기 위한 SSOT
 */

// ============================================================================
// Card Styles — 모든 모니터링 카드의 SSOT
// ============================================================================

/** 카드 공통 스타일 (컨테이너 + 타이틀) */
export const cardStyles = {
  /** 기본 카드 (border + radius만, 패딩 없음) */
  base: 'bg-surface border border-border rounded-lg',
  /** 일반 카드 — SSOT p-5 (20px) */
  card: 'bg-surface border border-border rounded-lg p-5',
  /** 패딩 포함 기본 카드 (p-4, 16px) */
  withPadding: 'bg-surface border border-border rounded-lg p-4',
  /** 중간 패딩 카드 (p-md, 16px) */
  withPaddingMd: 'bg-surface border border-border rounded-lg p-md',
  /** 카드 타이틀 (SSOT chartTitle: 14px, semibold, lh 20px) */
  title: 'text-14 font-semibold leading-20 text-text',
  /** 카드 타이틀 — 센터 정렬 */
  titleCenter: 'text-14 font-semibold leading-20 text-text text-center',
  /** 카드 타이틀 — 작은 (12px, 테이블 카드용) */
  titleSm: 'text-12 font-medium leading-20 text-text',
} as const;

// ============================================================================
// Layout Styles
// ============================================================================

/** 그리드 레이아웃 스타일 */
export const gridStyles = {
  /** 2열 그리드 (차트용) */
  cols2: 'grid grid-cols-2 gap-6 max-[1200px]:grid-cols-1',
  /** 3열 그리드 (이미지 탭용) */
  cols3: 'grid grid-cols-3 gap-6 max-[1200px]:grid-cols-2 max-[800px]:grid-cols-1',
  /** 4열 그리드 (풀 통계용) */
  cols4: 'grid grid-cols-4 gap-6 max-[1200px]:grid-cols-2',
  /** 6열 그리드 (호스트 통계용) */
  cols6: 'grid grid-cols-6 gap-6 max-[1400px]:grid-cols-3 max-[900px]:grid-cols-2',
} as const;

/** 플렉스 레이아웃 스타일 */
export const flexStyles = {
  /** 세로 스택 (gap-6) */
  colGap6: 'flex flex-col gap-6',
  /** 가로 스택 (gap-6, wrap) */
  rowGap6Wrap: 'flex gap-6 max-[1200px]:flex-wrap',
} as const;

// ============================================================================
// Gap Constants
// ============================================================================

/** 표준 간격 값 */
export const gapValues = {
  /** 카드 사이 간격 (24px) */
  cards: 'gap-6',
  /** 섹션 사이 간격 (24px) */
  sections: 'gap-6',
  /** 내부 요소 간격 (작은) */
  inner: 'gap-xs',
  /** 내부 요소 간격 (중간) */
  innerMd: 'gap-2',
} as const;

// ============================================================================
// Stat Card Styles (통계 카드 전용)
// ============================================================================

/** 통계 카드 스타일 */
export const statCardStyles = {
  /** 컨테이너 */
  container: `${cardStyles.card} min-h-[100px] flex flex-col gap-2`,
  /** 라벨 */
  label: 'text-text-muted text-[11px] font-medium leading-4 tracking-wider uppercase',
  /** 값 컨테이너 */
  valueContainer: 'flex items-baseline gap-1',
  /** 값 */
  value: 'text-text font-semibold text-2xl leading-8',
  /** 단위 */
  unit: 'text-text font-medium text-sm',
} as const;

// ============================================================================
// Table Card Styles (테이블 카드 전용)
// ============================================================================

/** 테이블 카드 스타일 */
export const tableCardStyles = {
  /** 컨테이너 (고정 높이) */
  container: `${cardStyles.card} box-border h-[200px] flex flex-col gap-xs`,
  /** 컨테이너 (높이 자동) */
  containerAuto: `${cardStyles.card} flex flex-col gap-xs`,
  /** 타이틀 */
  title: cardStyles.title,
} as const;

// ============================================================================
// Pie Chart Card Styles (파이 차트 카드 전용)
// ============================================================================

/** 파이 차트 카드 스타일 */
export const pieChartCardStyles = {
  /** 컨테이너 */
  container: `${cardStyles.card} flex-1 flex flex-col gap-3 min-w-[200px]`,
  /** 타이틀 */
  title: cardStyles.title,
  /** 범례 컨테이너 */
  legendContainer: 'flex flex-wrap justify-center gap-xs mt-1',
  /** 범례 아이템 */
  legendItem: 'flex items-center gap-1.5 text-11 text-text-muted',
  /** 범례 도트 */
  legendDot: 'w-2 h-2 rounded-sm',
} as const;

// ============================================================================
// Line Chart Card Styles (라인 차트 카드 전용)
// ============================================================================

/** 라인 차트 카드 스타일 */
export const lineChartCardStyles = {
  /** 컨테이너 (기본) — 일반 카드와 동일 p-5 (20px) */
  container: `${cardStyles.card} flex flex-col gap-xs`,
  /** 컨테이너 (전체화면) */
  containerFullScreen: `${cardStyles.card} flex flex-col h-full shadow-xl`,
  /** 헤더 */
  header: 'flex items-center justify-between',
  /** 헤더 (전체화면) */
  headerFullScreen: 'flex items-center justify-between relative mb-md',
  /** 타이틀 */
  title: cardStyles.title,
  /** 범례 컨테이너 */
  legendContainer: 'flex flex-col items-start gap-xs mt-5 overflow-y-auto shrink-0',
  /** 범례 아이템 */
  legendItem:
    'flex items-center gap-1.5 text-11 text-text-muted cursor-pointer transition-opacity duration-normal hover:text-text whitespace-nowrap',
  /** 범례 도트 */
  legendDot: 'w-2 h-2 rounded-full shrink-0',
} as const;

// ============================================================================
// Skeleton Styles
// ============================================================================

/** 스켈레톤 공통 스타일 */
export const skeletonStyles = {
  /** 기본 스켈레톤 */
  base: 'bg-surface-muted rounded animate-pulse',
  /** 원형 스켈레톤 */
  circle: 'rounded-full bg-surface-muted animate-pulse',
} as const;

// ============================================================================
// Usage Color Styles (Bar, Half Doughnut Chart 공통)
// ============================================================================

/**
 * 사용량 기반 색상 변형 타입
 *
 * Bar, Half Doughnut Chart에 공통으로 적용되는 색상 규칙:
 * | 상태    | 기준              | 색상   |
 * |---------|-------------------|--------|
 * | Safe    | 0~69% (낮은 사용량) | 초록색 |
 * | Warning | 70~94% (임계 접근)  | 주황색 |
 * | Danger  | 95% 이상 (임계 초과) | 붉은색 |
 *
 * @see https://www.figma.com/design/VjoRXmpHtZqY5tvtbXcvGH/TDS-Guide?node-id=2036-50 (Half Doughnut)
 * @see https://www.figma.com/design/VjoRXmpHtZqY5tvtbXcvGH/TDS-Guide?node-id=1992-189 (Bar)
 */
export type PercentageVariant = 'success' | 'warning' | 'danger';

/**
 * 퍼센티지 값을 기반으로 변형 타입 결정
 *
 * Bar, Half Doughnut Chart에 공통으로 적용되는 색상 규칙:
 * - success (Safe): 0% ~ 69% (낮은 사용량) → 초록색
 * - warning (Warning): 70% ~ 94% (임계 접근) → 주황색
 * - danger (Danger): 95% 이상 (임계 초과) → 붉은색
 *
 * @param percent - 퍼센티지 값
 * @returns 변형 타입 (success | warning | danger)
 */
export const getPercentageVariant = (percent: number): PercentageVariant => {
  if (percent >= 95) return 'danger';
  if (percent >= 70) return 'warning';
  return 'success';
};

/**
 * 퍼센티지 배지 색상 (Figma 디자인 토큰 기반)
 * - success: green100/green500
 * - warning: orange100/orange500
 * - danger: red100/red500
 */
export const PERCENTAGE_BADGE_COLORS: Record<PercentageVariant, { bg: string; fg: string }> = {
  success: {
    bg: 'var(--primitive-color-green100)',
    fg: 'var(--primitive-color-green500)',
  },
  warning: {
    bg: 'var(--primitive-color-orange100)',
    fg: 'var(--primitive-color-orange500)',
  },
  danger: {
    bg: 'var(--primitive-color-red100)',
    fg: 'var(--primitive-color-red500)',
  },
};

/**
 * 사용량 기반 차트 색상 (Bar, Half Doughnut Chart용 HEX 값)
 *
 * Bar, Half Doughnut Chart에 공통으로 적용되는 색상 규칙:
 * | 상태    | 기준              | 색상   |
 * |---------|-------------------|--------|
 * | Safe    | 0~69% (낮은 사용량) | 초록색 |
 * | Warning | 70~94% (임계 접근)  | 주황색 |
 * | Danger  | 95% 이상 (임계 초과) | 붉은색 |
 */
export const USAGE_CHART_COLORS = {
  success: '#22c55e', // green-500
  warning: '#f97316', // orange-500
  danger: '#ef4444', // red-500
  unused: '#f5f5f5', // neutral gray for unused portion
} as const;

/**
 * 퍼센티지 값을 기반으로 차트 색상 반환
 *
 * Bar, Half Doughnut Chart에 공통으로 적용되는 색상 규칙:
 * - success (Safe): 0% ~ 69% (낮은 사용량) → 초록색
 * - warning (Warning): 70% ~ 94% (임계 접근) → 주황색
 * - danger (Danger): 95% 이상 (임계 초과) → 붉은색
 *
 * @param percent - 퍼센티지 값
 * @returns HEX 색상 값
 */
export const getUsageChartColor = (percent: number): string => {
  const variant = getPercentageVariant(percent);
  return USAGE_CHART_COLORS[variant];
};

/** 퍼센티지 배지 Tailwind 클래스 */
export const percentageBadgeStyles = {
  /** 배지 컨테이너 */
  badge:
    'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-medium leading-4',
  /** 배지 내부 도트 */
  dot: 'w-2 h-2 rounded-full shrink-0',
} as const;

// ============================================================================
// Backward Compatibility (deprecated — cardStyles 사용 권장)
// ============================================================================

/** @deprecated cardStyles.title / cardStyles.titleCenter / cardStyles.titleSm 사용 */
export const cardTitleStyles = {
  base: cardStyles.title,
  chart: cardStyles.title,
  center: cardStyles.titleCenter,
  small: cardStyles.titleSm,
} as const;

/** @deprecated statCardStyles.label 사용 */
export const cardLabelStyles = {
  base: statCardStyles.label,
} as const;

/** @deprecated statCardStyles.value / statCardStyles.unit 사용 */
export const cardValueStyles = {
  large: statCardStyles.value,
  unit: statCardStyles.unit,
} as const;
