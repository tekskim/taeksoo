import type { ReactNode } from 'react';

/* ----------------------------------------
   MetricCard Types
   ---------------------------------------- */

export interface MetricCardProps {
  /** 메트릭 제목 */
  title: string;
  /** 메트릭 값 */
  value: string | number;
  /** 툴팁 텍스트 (아이콘 표시) */
  tooltip?: string;
  /** 값 옆 부가 요소 (상태 인디케이터, 뱃지 등) */
  extra?: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

export interface MetricCardGroupProps {
  /** MetricCard 항목들 */
  children: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

/* ----------------------------------------
   MetricCard Component
   ---------------------------------------- */

export function MetricCard({ title, value, tooltip, extra, className = '' }: MetricCardProps) {
  return (
    <div
      className={`flex-1 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] px-4 py-3 ${className}`.trim()}
    >
      <div className="flex flex-col gap-[6px]">
        <div className="flex items-center gap-[4px]">
          <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">{title}</span>
          {tooltip && <MetricTooltip content={tooltip} />}
        </div>
        <div className="flex items-center gap-[8px]">
          <span className="text-body-md leading-4 font-normal text-[var(--color-text-default)]">
            {value}
          </span>
          {extra}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   MetricCard.Group Component
   ---------------------------------------- */

function MetricCardGroup({ children, className = '' }: MetricCardGroupProps) {
  return (
    <div className={`flex items-stretch gap-[12px] w-full ${className}`.trim()}>{children}</div>
  );
}

MetricCard.Group = MetricCardGroup;

/* ----------------------------------------
   Internal: Tooltip trigger (lightweight)
   ---------------------------------------- */

function MetricTooltip({ content }: { content: string }) {
  return (
    <span className="relative group">
      <button
        type="button"
        className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)] transition-colors"
        aria-label={content}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </button>
      <span
        className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          px-[var(--tooltip-padding-x,8px)] py-[var(--tooltip-padding-y,4px)]
          bg-[var(--color-surface-inverse)] text-[var(--color-text-inverse)]
          text-[var(--tooltip-font-size,11px)] leading-4
          rounded-[var(--primitive-radius-sm)]
          whitespace-nowrap
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-opacity duration-[var(--duration-fast)]
          z-[var(--z-tooltip)] pointer-events-none
        "
        role="tooltip"
      >
        {content}
      </span>
    </span>
  );
}
