import { useMemo, useState } from 'react';
import type { StatsBucket } from '@/pages/audit/types';

/**
 * Histogram chart (목업) — 정책서 "Histogram chart"의 Single·Stacked 공통 규칙 구현.
 * 공통: 시간 구간(bucket) 막대 · X축 구간 라벨 · Y 기준선(0) · hover 하이라이트 + 툴팁(구간 범위 + 계열별 count + 합계·%).
 * Stacked: 기준 계열(base) 위에 강조 계열(emphasis)을 누적, 범례 제공. (Single은 emphasis 미지정)
 * peak 값은 별도 캡션/라벨/마커로 표기하지 않는다 (정책).
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const p2 = (n: number) => String(n).padStart(2, '0');

export interface HistogramChartProps {
  buckets: StatsBucket[];
  /** 차트 높이(px) — 기본 160 */
  height?: number;
  /** 기준 계열 라벨/색 */
  baseLabel?: string;
  baseColor?: string;
  /** 강조 계열(누적) — 지정 시 Stacked, 미지정 시 Single */
  emphasisKey?: 'sensitive' | 'failed';
  emphasisLabel?: string;
  emphasisColor?: string;
  /** X축 구간 라벨 표시 (기본 true) */
  showXAxis?: boolean;
}

export function HistogramChart({
  buckets,
  height = 160,
  baseLabel = 'Events',
  baseColor = 'var(--color-action-primary)',
  emphasisKey,
  emphasisLabel = 'Sensitive',
  emphasisColor = 'var(--color-state-warning)',
  showXAxis = true,
}: HistogramChartProps) {
  const [hover, setHover] = useState<number | null>(null);

  const n = buckets.length;
  const max = useMemo(() => Math.max(...buckets.map((b) => b.total), 1), [buckets]);
  const grandTotal = useMemo(() => buckets.reduce((s, b) => s + b.total, 0), [buckets]);
  // 구간 크기(step) — 인접 버킷 시작 간격
  const stepMs = useMemo(() => {
    if (n < 2) return 3600_000;
    return new Date(buckets[1].start).getTime() - new Date(buckets[0].start).getTime();
  }, [buckets, n]);

  const labelEvery = Math.max(1, Math.ceil(n / 6));

  const fmtRange = (startIso: string) => {
    const s = new Date(startIso);
    const e = new Date(s.getTime() + stepMs);
    return `${MONTHS[s.getMonth()]} ${p2(s.getDate())}, ${p2(s.getHours())}:${p2(s.getMinutes())} ~ ${p2(e.getHours())}:${p2(e.getMinutes())}`;
  };
  const fmtTick = (startIso: string) => {
    const s = new Date(startIso);
    return `${p2(s.getHours())}:${p2(s.getMinutes())}`;
  };

  return (
    <div className="w-full">
      {/* Chart area */}
      <div className="relative flex items-end gap-[3px]" style={{ height }}>
        {buckets.map((b, i) => {
          const emph = emphasisKey ? b[emphasisKey] : 0;
          const emphPx = (emph / max) * height;
          const basePx = ((b.total - emph) / max) * height;
          const isHover = hover === i;
          return (
            <div
              key={i}
              className="flex flex-1 cursor-pointer flex-col justify-end"
              style={{ height }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((h) => (h === i ? null : h))}
            >
              <div
                className="w-full rounded-t-sm"
                style={{
                  height: `${Math.max(basePx, b.total > 0 ? 1 : 0)}px`,
                  backgroundColor: baseColor,
                  filter: isHover ? 'brightness(1.15)' : undefined,
                }}
              />
              {emphasisKey && (
                <div
                  className="w-full"
                  style={{
                    height: `${emphPx}px`,
                    backgroundColor: emphasisColor,
                    filter: isHover ? 'brightness(1.15)' : undefined,
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Hover tooltip — 구간 범위 + 계열별 count + 합계(%) */}
        {hover !== null && buckets[hover] && (
          <div
            className="pointer-events-none absolute z-10 whitespace-nowrap rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] px-2.5 py-1.5 shadow-md"
            style={{
              left: `${((hover + 0.5) / n) * 100}%`,
              bottom: 'calc(100% + 6px)',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-body-sm font-medium text-[var(--color-text-default)]">
              {fmtRange(buckets[hover].start)}
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-body-sm text-[var(--color-text-subtle)]">
              <span className="flex items-center gap-1">
                <span
                  className="size-2 rounded-sm"
                  style={{ backgroundColor: baseColor }}
                  aria-hidden
                />
                {baseLabel}{' '}
                {(
                  buckets[hover].total - (emphasisKey ? buckets[hover][emphasisKey] : 0)
                ).toLocaleString()}
              </span>
              {emphasisKey && (
                <span className="flex items-center gap-1">
                  <span
                    className="size-2 rounded-sm"
                    style={{ backgroundColor: emphasisColor }}
                    aria-hidden
                  />
                  {emphasisLabel} {buckets[hover][emphasisKey].toLocaleString()}
                </span>
              )}
            </div>
            <div className="mt-0.5 text-body-sm text-[var(--color-text-default)]">
              Total {buckets[hover].total.toLocaleString()} (
              {grandTotal ? ((buckets[hover].total / grandTotal) * 100).toFixed(1) : '0'}%)
            </div>
          </div>
        )}
      </div>

      {/* X-axis 구간 라벨 */}
      {showXAxis && (
        <div className="mt-1 flex gap-[3px]">
          {buckets.map((b, i) => (
            <span
              key={i}
              className="flex-1 text-center text-[10px] text-[var(--color-text-subtle)]"
            >
              {i % labelEvery === 0 ? fmtTick(b.start) : ''}
            </span>
          ))}
        </div>
      )}

      {/* 범례 */}
      <div className="mt-2 flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-sm" style={{ backgroundColor: baseColor }} aria-hidden />
          <span className="text-body-sm text-[var(--color-text-subtle)]">{baseLabel}</span>
        </span>
        {emphasisKey && (
          <span className="flex items-center gap-1">
            <span
              className="size-2 rounded-sm"
              style={{ backgroundColor: emphasisColor }}
              aria-hidden
            />
            <span className="text-body-sm text-[var(--color-text-subtle)]">{emphasisLabel}</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default HistogramChart;
