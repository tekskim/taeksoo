import type React from 'react';
import type { ReactElement } from 'react';

export interface ChartTooltipItem {
  color: string;
  label: string;
  value: string;
}

export interface ChartTooltipProps {
  /** Optional header label (e.g. time string or resource name) */
  title?: string;
  items: ChartTooltipItem[];
}

const styles = {
  title: 'text-12 font-medium leading-16 text-text-muted',
  row: 'flex items-center gap-2',
  dot: 'w-[7px] h-[7px] rounded-[2px] shrink-0',
  text: 'text-14 font-normal leading-20 text-text',
} as const;

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '10px 12px 15px 12px',
  borderRadius: '15px',
  WebkitBackdropFilter: 'blur(68px)',
  backdropFilter: 'blur(68px)',
  background: 'rgba(246, 246, 246, 0.36)',
  border: '1px solid rgba(26, 26, 26, 0.12)',
  boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.15)',
};

/**
 * Chart Tooltip — Figma TDS Guide 기반 공통 차트 툴팁 (React 컴포넌트)
 *
 * Doughnut/Ring 차트 등 커스텀 툴팁에 사용합니다.
 * ECharts tooltip에는 `chartTooltipHtml`을 사용하세요.
 *
 * @see https://www.figma.com/design/VjoRXmpHtZqY5tvtbXcvGH/TDS-Guide?node-id=1992-283 (Doughnut)
 * @see https://www.figma.com/design/VjoRXmpHtZqY5tvtbXcvGH/TDS-Guide?node-id=1992-106 (Line chart)
 */
const ChartTooltip = ({ title, items }: ChartTooltipProps): ReactElement => (
  <div style={containerStyle}>
    {title && <span className={styles.title}>{title}</span>}
    {items.map((item, i) => (
      <div key={i} className={styles.row}>
        <span className={styles.dot} style={{ backgroundColor: item.color }} />
        <span className={styles.text}>
          {item.label}: {item.value}
        </span>
      </div>
    ))}
  </div>
);

export default ChartTooltip;
