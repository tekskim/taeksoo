import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';

import { Tag, Tooltip, getHistogramColors } from '@/design-system';
import type { StatsBucket } from '@/pages/audit/types';

/**
 * 이벤트 타임라인 차트 — TDS "Histogram chart(Stacked variant)" 스펙 정합.
 * 기준 계열(Events)=`state.info`, 강조 계열(Sensitive)=`state.warning`을 누적.
 * Stacked 규칙: peak 색 강조·peak 값 별도 표기 없음(주황=강조 계열 전용). barWidth ≥90%, Y축 guide line 5개.
 * 요약(Total·Success·Failure)은 차트 헤더 배지로 통합.
 *
 * onRangeSelect 전달 시 인터랙티브 — 막대 클릭·드래그로 시간 구간을 선택하면 콜백으로 통지하고,
 * 선택 영역을 차트에 음영(markArea)·하단 결과 바로 표시한다(suite-dev 동작 동일). 선택은 Clear로 해제.
 *
 * ⚠️ echarts 캔버스는 CSS 변수를 못 읽어 색은 getHistogramColors()로 런타임 해석한다.
 */

const HISTOGRAM_BAR_WIDTH_RATIO = 0.9;
const SELECT_OVERLAY_FILL = 'rgba(37, 99, 235, 0.12)'; // state.info alpha
const SELECT_OVERLAY_BORDER = 'rgba(37, 99, 235, 0.5)';
// markArea 반-밴드 — 선택 구간 음영을 막대 폭에 정확히 맞춤 (LogExplorer 동일)
const MARK_AREA_HALF_BAND = HISTOGRAM_BAR_WIDTH_RATIO / 2 + 0.02;
const DRAG_THRESHOLD = 4;

const formatIsoToDateTime = (isoTime: string): string => {
  const date = new Date(isoTime);
  if (Number.isNaN(date.getTime())) return isoTime;
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${mm}-${dd} ${hh}:${min}`;
};

const timeLabel = (isoTime: string): string => {
  const date = new Date(isoTime);
  if (Number.isNaN(date.getTime())) return isoTime;
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

/** 툴팁 HTML — 구간 + 계열별 색·라벨·값 */
const tooltipHtml = (
  title: string,
  rows: Array<{ label: string; value: string; color: string }>
): string => {
  const items = rows
    .map(
      (r) =>
        `<div style="display:flex;align-items:center;gap:6px;margin-top:2px;">` +
        `<span style="width:8px;height:8px;border-radius:2px;background:${r.color};"></span>` +
        `<span style="flex:1;color:#64748B;">${r.label}</span>` +
        `<span style="font-weight:600;color:#0F172A;">${r.value}</span>` +
        `</div>`
    )
    .join('');
  return (
    `<div style="padding:8px 10px;border-radius:6px;border:1px solid #E2E8F0;background:#fff;` +
    `box-shadow:0 4px 12px rgba(15,23,42,0.08);font-size:11px;min-width:180px;">` +
    `<div style="font-weight:600;color:#0F172A;margin-bottom:2px;">${title}</div>${items}</div>`
  );
};

/** 선택 구간 (버킷 인덱스 범위) */
interface Selection {
  startIdx: number;
  endIdx: number;
}

/** 선택 시간 범위 — 하단 테이블 필터링용 */
export interface TimeRange {
  start: Date;
  end: Date;
}

interface Props {
  buckets: StatsBucket[];
  stepMs: number;
  /** 성공률 (0–100) */
  successRate?: number | null;
  /** 실패율 (0–100) */
  failureRate?: number | null;
  /** 접기/펼치기 버튼 노출 (기본 true) */
  collapsible?: boolean;
  /** 차트 높이(px) — 기본 110 */
  height?: number;
  /** 막대 클릭·드래그 선택 구간 통지 (null = 선택 해제). 미전달 시 보기 전용 */
  onRangeSelect?: (range: TimeRange | null) => void;
}

export default function LogTimelineChart({
  buckets,
  stepMs,
  successRate,
  failureRate,
  collapsible = true,
  height = 110,
  onRangeSelect,
}: Props): ReactElement {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<echarts.EChartsType | null>(null);
  const suppressNextClickRef = useRef(false);
  const [dragBox, setDragBox] = useState<{ left: number; width: number } | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);

  const isInteractive = Boolean(onRangeSelect);
  const totalCount = useMemo(() => buckets.reduce((sum, b) => sum + b.total, 0), [buckets]);
  // Histogram 계열 색 — 캔버스용 런타임 해석 (기준=state.info / 강조=state.warning)
  const { base: barColor, emphasis: sensitiveColor } = getHistogramColors();

  // 버킷 인덱스 범위 → 선택 적용 + 시간 범위 통지
  const selectByIndices = useCallback(
    (indices: number[]): void => {
      if (indices.length === 0 || buckets.length === 0) return;
      const sorted = [...indices].sort((a, b) => a - b);
      const startIdx = Math.max(0, sorted[0]);
      const endIdx = Math.min(buckets.length - 1, sorted[sorted.length - 1]);
      const startBucket = buckets[startIdx];
      const endBucket = buckets[endIdx];
      if (!startBucket || !endBucket) return;
      setSelection({ startIdx, endIdx });
      onRangeSelect?.({
        start: new Date(startBucket.start),
        end: new Date(new Date(endBucket.start).getTime() + stepMs),
      });
    },
    [buckets, stepMs, onRangeSelect]
  );

  const clearSelection = useCallback((): void => {
    setSelection(null);
    onRangeSelect?.(null);
  }, [onRangeSelect]);

  // 막대 단일 클릭 → 해당 구간 선택 (드래그 직후 클릭은 무시)
  const handleChartClick = useCallback(
    (event: unknown): void => {
      if (suppressNextClickRef.current) {
        suppressNextClickRef.current = false;
        return;
      }
      const idx =
        event &&
        typeof event === 'object' &&
        typeof (event as { dataIndex?: unknown }).dataIndex === 'number'
          ? (event as { dataIndex: number }).dataIndex
          : -1;
      if (idx < 0) return;
      selectByIndices([idx]);
    },
    [selectByIndices]
  );
  const clickHandlerRef = useRef(handleChartClick);
  useEffect(() => {
    clickHandlerRef.current = handleChartClick;
  }, [handleChartClick]);

  const chartOptions = useMemo<EChartsOption>(() => {
    const labels = buckets.map((b) => timeLabel(b.start));
    const axisInterval = Math.max(0, Math.ceil(buckets.length / 12) - 1);
    const sensitiveCounts = buckets.map((b) => Math.min(b.sensitive, b.total));
    const normalCounts = buckets.map((b, i) => b.total - sensitiveCounts[i]);

    return {
      // TDS Histogram 스펙: top 20 · bottom 16 · left 0(containLabel) · right 16
      grid: { left: 0, right: 16, top: 20, bottom: 16, containLabel: true },
      xAxis: {
        type: 'category' as const,
        data: labels,
        boundaryGap: true,
        axisLabel: { fontSize: 10, color: '#94A3B8', interval: axisInterval, margin: 8 },
        axisLine: { lineStyle: { color: '#E2E8F0' } },
        axisTick: { alignWithLabel: true, lineStyle: { color: '#E2E8F0' } },
        axisPointer: {
          show: true,
          type: 'shadow',
          shadowStyle: { color: 'rgba(37, 99, 235, 0.06)' },
        },
      },
      yAxis: {
        type: 'value' as const,
        axisLabel: {
          fontSize: 10,
          color: '#94A3B8',
          formatter: (value: number): string =>
            value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value),
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } },
        splitNumber: 5, // Guide Line 5개 고정 (TDS Histogram)
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        extraCssText: 'border:none; box-shadow:none; background:transparent;',
        formatter: (params: unknown): string => {
          const first = Array.isArray(params) ? params[0] : params;
          if (!first || typeof first !== 'object') return '';
          const index =
            typeof (first as { dataIndex?: unknown }).dataIndex === 'number'
              ? (first as { dataIndex: number }).dataIndex
              : -1;
          const bucket = index >= 0 ? buckets[index] : null;
          if (!bucket) return '';
          const start = formatIsoToDateTime(bucket.start);
          const end = formatIsoToDateTime(
            new Date(new Date(bucket.start).getTime() + stepMs).toISOString()
          );
          const ratio =
            totalCount > 0 ? ` (${((bucket.total / totalCount) * 100).toFixed(1)}%)` : '';
          return tooltipHtml(`${start} ~ ${end}`, [
            { label: 'Events', value: `${bucket.total.toLocaleString()}${ratio}`, color: barColor },
            {
              label: 'Sensitive',
              value: sensitiveCounts[index].toLocaleString(),
              color: sensitiveColor,
            },
          ]);
        },
      },
      series: [
        {
          type: 'bar',
          name: 'Events',
          stack: 'volume',
          data: normalCounts,
          barWidth: `${HISTOGRAM_BAR_WIDTH_RATIO * 100}%`,
          barMinHeight: 1,
          animation: false,
          emphasis: { focus: 'none' },
          // Stacked 규칙: peak 색 강조 없음 — 기준 계열 단일색(state.info)
          itemStyle: { borderRadius: 0, color: barColor },
          // 선택 구간 음영 — 숫자 인덱스 ±half-band로 막대 폭에 정확히 정렬 (LogExplorer 동일)
          ...(selection
            ? {
                markArea: {
                  silent: true,
                  itemStyle: {
                    color: SELECT_OVERLAY_FILL,
                    borderColor: SELECT_OVERLAY_BORDER,
                    borderWidth: 1,
                  },
                  data: [
                    [
                      { xAxis: selection.startIdx - MARK_AREA_HALF_BAND },
                      { xAxis: selection.endIdx + MARK_AREA_HALF_BAND },
                    ],
                  ],
                },
              }
            : {}),
        },
        {
          type: 'bar',
          name: 'Sensitive',
          stack: 'volume',
          data: sensitiveCounts,
          animation: false,
          emphasis: { focus: 'none' },
          itemStyle: { borderRadius: 0, color: sensitiveColor },
        },
      ],
    };
  }, [buckets, stepMs, totalCount, barColor, sensitiveColor, selection]);

  // echarts init + 막대 클릭 핸들러
  useEffect(() => {
    if (!chartRef.current || isCollapsed) return;

    const container = chartRef.current;
    const instance = echarts.init(container);
    instanceRef.current = instance;

    const onClick = (event: unknown): void => clickHandlerRef.current(event);
    if (isInteractive) instance.on('click', onClick);

    const handleResize = (): void => instance.resize();
    window.addEventListener('resize', handleResize);
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => instance.resize()) : null;
    resizeObserver?.observe(container);
    requestAnimationFrame(() => instance.resize());

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
      instance.off('click', onClick);
      instance.dispose();
      instanceRef.current = null;
    };
  }, [isCollapsed, isInteractive]);

  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    instance.setOption(chartOptions, { notMerge: true, lazyUpdate: true });
  }, [chartOptions, isCollapsed]);

  // 드래그 범위 선택 — 차트 위 마우스 드래그로 여러 구간을 한 번에 선택
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isCollapsed || !isInteractive) return;

    let startX = 0;
    let currentX = 0;
    let dragging = false;
    let pressed = false;

    const clampX = (rawX: number): number => {
      const rect = container.getBoundingClientRect();
      return Math.min(rect.width, Math.max(0, rawX - rect.left));
    };

    const onMouseDown = (e: MouseEvent): void => {
      if (e.button !== 0) return;
      pressed = true;
      dragging = false;
      startX = clampX(e.clientX);
      currentX = startX;
    };
    const onMouseMove = (e: MouseEvent): void => {
      if (!pressed) return;
      currentX = clampX(e.clientX);
      if (!dragging && Math.abs(currentX - startX) > DRAG_THRESHOLD) {
        dragging = true;
        suppressNextClickRef.current = true;
      }
      if (dragging) {
        setDragBox({ left: Math.min(startX, currentX), width: Math.abs(currentX - startX) });
      }
    };
    const onMouseUp = (): void => {
      if (!pressed) return;
      const wasDragging = dragging;
      pressed = false;
      dragging = false;
      setDragBox(null);
      if (!wasDragging) return;

      const instance = instanceRef.current;
      if (!instance) return;
      const leftPx = Math.min(startX, currentX);
      const rightPx = Math.max(startX, currentX);
      const from = instance.convertFromPixel({ gridIndex: 0 }, [leftPx, 0]) as number[] | null;
      const to = instance.convertFromPixel({ gridIndex: 0 }, [rightPx, 0]) as number[] | null;
      if (!from || !to) return;
      const minCoord = Number(from[0]);
      const maxCoord = Number(to[0]);
      if (!Number.isFinite(minCoord) || !Number.isFinite(maxCoord)) return;
      const half = HISTOGRAM_BAR_WIDTH_RATIO / 2;
      const overlapped = buckets
        .map((_, i) => i)
        .filter(
          (i) =>
            i + half >= Math.min(minCoord, maxCoord) && i - half <= Math.max(minCoord, maxCoord)
        );
      selectByIndices(overlapped);
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isCollapsed, isInteractive, buckets, selectByIndices]);

  // 선택 결과 요약 (구간 수·합계·비율)
  const selectionSummary = useMemo(() => {
    if (!selection) return null;
    const slice = buckets.slice(selection.startIdx, selection.endIdx + 1);
    const sum = slice.reduce((s, b) => s + b.total, 0);
    const pct = totalCount > 0 ? (sum / totalCount) * 100 : 0;
    const startBucket = buckets[selection.startIdx];
    const endBucket = buckets[selection.endIdx];
    return {
      rangeStart: formatIsoToDateTime(startBucket.start),
      rangeEnd: formatIsoToDateTime(
        new Date(new Date(endBucket.start).getTime() + stepMs).toISOString()
      ),
      count: slice.length,
      sum,
      pct,
    };
  }, [selection, buckets, stepMs, totalCount]);

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
      <div
        className={`flex items-center justify-between gap-2 px-4 py-2.5 ${
          isCollapsed ? '' : 'border-b border-[var(--color-border-subtle)]'
        }`}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <Tooltip content="Total events in the current result set (all filters applied).">
            <Tag size="sm" variant="info">
              Total Events: {totalCount.toLocaleString()}
            </Tag>
          </Tooltip>
          {successRate != null && (
            <Tooltip content="Share of events that completed successfully (success ÷ total).">
              <Tag size="sm" variant="success">
                Success Rate: {successRate.toFixed(1)}%
              </Tag>
            </Tooltip>
          )}
          {failureRate != null && (
            <Tooltip content="Share of events that failed or were denied.">
              <Tag size="sm" variant="danger">
                Failure Rate: {failureRate.toFixed(1)}%
              </Tag>
            </Tooltip>
          )}
        </div>
        {collapsible && (
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-subtle)]"
            aria-label={isCollapsed ? 'Expand timeline' : 'Collapse timeline'}
          >
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className={`h-4 w-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
              fill="none"
            >
              <path
                d="M4 6.5L8 10L12 6.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {!isCollapsed && (
        <>
          <div className="px-4 py-2.5">
            <div
              ref={containerRef}
              className="relative select-none"
              style={{ cursor: isInteractive && buckets.length > 0 ? 'crosshair' : 'default' }}
            >
              <div ref={chartRef} style={{ height }} className="w-full" />
              {dragBox && dragBox.width > 0 && (
                <div
                  className="pointer-events-none absolute inset-y-0 z-[1]"
                  style={{
                    left: `${dragBox.left}px`,
                    width: `${dragBox.width}px`,
                    background: SELECT_OVERLAY_FILL,
                    borderLeft: '1px solid rgba(37, 99, 235, 0.5)',
                    borderRight: '1px solid rgba(37, 99, 235, 0.5)',
                  }}
                />
              )}
            </div>
          </div>

          {selectionSummary && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] px-4 py-2">
              <span className="text-body-sm text-[var(--color-text-default)]">
                Selected{' '}
                <span className="font-medium">
                  {selectionSummary.rangeStart} ~ {selectionSummary.rangeEnd}
                </span>{' '}
                <span className="text-[var(--color-text-subtle)]">
                  · {selectionSummary.count} buckets · {selectionSummary.sum.toLocaleString()}{' '}
                  events ({selectionSummary.pct.toFixed(1)}%)
                </span>
              </span>
              <button
                type="button"
                onClick={clearSelection}
                className="flex items-center gap-1 rounded-[var(--radius-md)] px-2 py-1 text-body-sm text-[var(--color-text-subtle)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-default)]"
              >
                <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                Clear
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
