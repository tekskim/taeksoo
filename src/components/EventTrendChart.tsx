import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { useEffect, useMemo, useRef, type ReactElement } from 'react';

import { getHistogramColors } from '@/design-system';
import type { StatsBucket } from '@/pages/audit/types';

/**
 * 대시보드 이벤트 추이 차트 — TDS "Histogram chart(Stacked variant)" 스펙 정합.
 * 시간 구간별 발생량을 누적 막대로 표현. 기준 계열(Normal)=`state.info`, 강조 계열(Sensitive)=`state.warning`.
 * 보기 전용(드래그 선택 비활성), peak 색 강조·표기 없음(Stacked 규칙). barWidth ≥90%, Y축 guide line 5개.
 *
 * ⚠️ echarts 캔버스는 CSS 변수를 못 읽어, 범례(DOM)는 var() 토큰을 쓰고 캔버스는 런타임 해석 hex를 쓴다.
 */

// 범례(DOM)용 시맨틱 토큰 — 캔버스 색은 getHistogramColors()로 별도 해석
export const TREND_NORMAL_COLOR = 'var(--color-state-info)';
export const TREND_SENSITIVE_COLOR = 'var(--color-state-warning)';

const formatBucketLabel = (isoTime: string): string => {
  const date = new Date(isoTime);
  if (Number.isNaN(date.getTime())) return isoTime;
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

const MONTH_ABBR = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** 툴팁 제목 — UX Writing Guide(영문) 날짜 포맷: MMM DD, YYYY HH:mm */
const formatBucketDateTime = (isoTime: string): string => {
  const date = new Date(isoTime);
  if (Number.isNaN(date.getTime())) return isoTime;
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${MONTH_ABBR[date.getMonth()]} ${dd}, ${date.getFullYear()} ${hh}:${mm}`;
};

/** 툴팁 HTML — 시간 라벨 + 계열별 색·라벨·값 */
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
    `box-shadow:0 4px 12px rgba(15,23,42,0.08);font-size:11px;min-width:140px;">` +
    `<div style="font-weight:600;color:#0F172A;margin-bottom:2px;">${title}</div>${items}</div>`
  );
};

interface Props {
  buckets: StatsBucket[];
}

const EventTrendChart = ({ buckets }: Props): ReactElement => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<echarts.EChartsType | null>(null);

  const labels = useMemo(() => buckets.map((bucket) => formatBucketLabel(bucket.start)), [buckets]);

  // Histogram 계열 색 — 캔버스용 런타임 해석 (기준=state.info / 강조=state.warning)
  const { base: normalColor, emphasis: sensitiveColor } = getHistogramColors();

  const chartOptions = useMemo<EChartsOption>(() => {
    const axisInterval = Math.max(0, Math.ceil(buckets.length / 8) - 1);

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
      },
      yAxis: {
        type: 'value' as const,
        axisLabel: { fontSize: 10, color: '#94A3B8' },
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
          if (!Array.isArray(params) || params.length === 0) return '';
          const first = params[0] as { dataIndex?: unknown };
          const index = typeof first.dataIndex === 'number' ? first.dataIndex : -1;
          const bucket = index >= 0 ? buckets[index] : null;
          if (!bucket) return '';
          return tooltipHtml(formatBucketDateTime(bucket.start), [
            {
              label: 'Normal',
              value: String(Math.max(bucket.total - bucket.sensitive, 0)),
              color: normalColor,
            },
            {
              label: 'Sensitive',
              value: String(bucket.sensitive),
              color: sensitiveColor,
            },
          ]);
        },
      },
      series: [
        {
          type: 'bar',
          name: 'Normal',
          stack: 'volume',
          data: buckets.map((bucket) => Math.max(bucket.total - bucket.sensitive, 0)),
          barWidth: '90%', // TDS Histogram: barWidth ≥90%
          barMinHeight: 1,
          animation: false,
          itemStyle: { color: normalColor, borderRadius: [0, 0, 0, 0] },
          emphasis: { focus: 'none' },
        },
        {
          type: 'bar',
          name: 'Sensitive',
          stack: 'volume',
          data: buckets.map((bucket) => bucket.sensitive),
          animation: false,
          itemStyle: { color: sensitiveColor, borderRadius: [0, 0, 0, 0] },
          emphasis: { focus: 'none' },
        },
      ],
    };
  }, [buckets, labels, normalColor, sensitiveColor]);

  useEffect(() => {
    if (!chartRef.current) return;

    const container = chartRef.current;
    const instance = echarts.init(container);
    instanceRef.current = instance;

    const handleResize = (): void => {
      instance.resize();
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            instance.resize();
          })
        : null;
    resizeObserver?.observe(container);

    requestAnimationFrame(() => {
      instance.resize();
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
      instance.dispose();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    instance.setOption(chartOptions, { notMerge: true, lazyUpdate: true });
  }, [chartOptions]);

  return <div ref={chartRef} className="min-h-[230px] w-full flex-1" />;
};

export default EventTrendChart;
