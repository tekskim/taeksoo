/**
 * Chart color tokens — TDS SSoT 차트 스펙 정합.
 *
 * - Stacked Bar Chart(가로형, Action Types 등) 세그먼트: **범주형 차트 팔레트**
 *   `--component-chart-color-1..10` (상태색 아님). DOM 요소는 var() 직접 사용 가능.
 * - Stacked Histogram(Event Trend·Log Timeline) 계열: 기준=`state.info`, 강조=`state.warning`.
 *   echarts 캔버스는 CSS 변수를 못 읽으므로 resolveCssVar로 런타임 해석한다.
 *
 * 참조: Notion "Usage Chart(Stacked Bar Chart)" · "Histogram chart(Stacked)".
 */

/** 범주형 차트 팔레트 fallback (목업 `--component-chart-color-N`와 동일) */
export const chartColorFallbacks = [
  '#22d3ee', // 1 cyan400
  '#34d399', // 2 emerald400
  '#fbbf24', // 3 amber400
  '#a78bfa', // 4 violet400
  '#e879f9', // 5 fuchsia400
  '#f472b6', // 6 pink400
  '#f87171', // 7 red400
  '#60a5fa', // 8 blue400
  '#2dd4bf', // 9 teal400
  '#fb923c', // 10 orange400
] as const;

/** index → 범주형 팔레트 토큰 (순환). DOM 요소용 — `var(--component-chart-color-N, hex)` 반환 */
export const getChartColorByIndex = (index: number): string => {
  const len = chartColorFallbacks.length;
  const i = ((index % len) + len) % len;
  return `var(--component-chart-color-${i + 1}, ${chartColorFallbacks[i]})`;
};

/** echarts 캔버스용 — CSS 변수를 런타임 해석해 hex 반환 (var() 미지원) */
export const resolveCssVar = (varName: string, fallback: string): string => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || fallback;
};

/** Histogram 계열 시맨틱 색 — echarts용 런타임 해석 (light: info=#2563eb / warning=#f97316) */
export const getHistogramColors = (): { base: string; emphasis: string } => ({
  base: resolveCssVar('--color-state-info', '#2563eb'),
  emphasis: resolveCssVar('--color-state-warning', '#f97316'),
});

/** 사용률/상태 차트 색 (Gauge·Donut 임계값용 — Histogram·Stacked Bar에는 미적용) */
export const USAGE_CHART_COLORS = {
  success: '#22c55e',
  warning: '#f97316',
  danger: '#ef4444',
  unused: '#f5f5f5',
} as const;
