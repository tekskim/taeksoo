import type { ChartTooltipItem } from './ChartTooltip';

const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

/**
 * Figma TDS Guide 기반 inline CSS (ECharts HTML formatter 등 Tailwind 미적용 환경용)
 */
const inlineStyles = {
  container: [
    'display: flex; flex-direction: column; gap: 8px;',
    'padding: 10px 12px 15px 12px;',
    'border-radius: 15px;',
    'border: 1px solid rgba(26, 26, 26, 0);',
    'box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.15);',
    'backdrop-filter: blur(68px);',
    'background: rgba(246, 246, 246, 0.36);',
  ].join(' '),
  title:
    'font-size: 12px; font-weight: 500; line-height: 16px; color: #475569; margin: 0;',
  row: 'display: flex; align-items: center; gap: 8px;',
  dot: 'width: 7px; height: 7px; border-radius: 2px; flex-shrink: 0;',
  text: 'font-size: 14px; font-weight: 400; line-height: 20px; color: #0f172a;',
} as const;

/**
 * ECharts tooltip formatter용 HTML 문자열 생성
 *
 * ECharts는 React 컴포넌트를 직접 렌더링할 수 없으므로
 * inline CSS 기반 HTML 문자열을 반환합니다.
 *
 * @see https://www.figma.com/design/VjoRXmpHtZqY5tvtbXcvGH/TDS-Guide?node-id=1992-283
 * @see https://www.figma.com/design/VjoRXmpHtZqY5tvtbXcvGH/TDS-Guide?node-id=1992-106
 */
export const chartTooltipHtml = (
  title: string | undefined,
  items: ChartTooltipItem[]
): string => {
  const titleHtml = title
    ? `<div style="${inlineStyles.title}">${escapeHtml(title)}</div>`
    : '';

  const rowsHtml = items
    .map(
      item =>
        `<div style="${inlineStyles.row}">` +
        `<span style="${inlineStyles.dot} background-color: ${escapeHtml(item.color)};"></span>` +
        `<span style="${inlineStyles.text}">${escapeHtml(item.label)}: ${escapeHtml(item.value)}</span>` +
        `</div>`
    )
    .join('');

  return `<div style="${inlineStyles.container}">${titleHtml}${rowsHtml}</div>`;
};
