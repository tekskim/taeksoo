import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { AreaChartDemo } from '../../design-system-sections/ChartComponents';
import { VStack } from '@/design-system';

export function AreaChartPage() {
  return (
    <ComponentPageTemplate
      title="Area chart"
      description="Filled area visualization for volume and cumulative data"
      preview={<AreaChartDemo variant="basic" />}
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={2}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
            <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>
                <strong>시계열 데이터</strong>: CPU/Memory/Network 사용량 등 시간에 따른 변화를
                시각화합니다.
              </li>
              <li>
                <strong>Stacked</strong>: 여러 항목의 누적 합을 표시할 때 Stacked 모드를 사용합니다.
              </li>
              <li>
                <strong>빈 데이터</strong>: 데이터가 없는 구간은 &quot;No data&quot; 메시지를
                표시합니다.
              </li>
              <li>hover 시 해당 시점의 정확한 값을 tooltip으로 표시합니다.</li>
              <li>
                <strong>Y축 눈금</strong>: Y축은 항상 5개 단위(splitNumber: 5)로 표시합니다.
              </li>
            </ul>
          </VStack>
        </div>
      }
      tokens={
        <VStack gap={4}>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>fill-opacity: 0.1</code> · <code>line-width: 1px</code> ·{' '}
            <code>smooth: true</code> · <code>symbol-size: 6px</code>
          </div>

          <VStack gap={2}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Primary 5-color palette
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'cyan400', hex: '#22d3ee', label: '1st series' },
                { name: 'emerald400', hex: '#34d399', label: '2nd series' },
                { name: 'amber400', hex: '#fbbf24', label: '3rd series' },
                { name: 'violet400', hex: '#a78bfa', label: '4th series' },
                { name: 'fuchsia400', hex: '#e879f9', label: '5th series' },
              ].map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)]"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-body-sm text-[var(--color-text-default)]">{c.name}</span>
                  <span className="text-body-xs text-[var(--color-text-subtle)]">{c.hex}</span>
                </div>
              ))}
            </div>
          </VStack>

          <VStack gap={2}>
            <span className="text-label-md text-[var(--color-text-default)]">Extended palette</span>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'pink400', hex: '#f472b6' },
                { name: 'red400', hex: '#f87171' },
                { name: 'blue400', hex: '#60a5fa' },
                { name: 'teal400', hex: '#2dd4bf' },
                { name: 'orange400', hex: '#fb923c' },
                { name: 'indigo400', hex: '#818cf8' },
              ].map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)]"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-body-sm text-[var(--color-text-default)]">{c.name}</span>
                  <span className="text-body-xs text-[var(--color-text-subtle)]">{c.hex}</span>
                </div>
              ))}
            </div>
          </VStack>

          <div className="text-body-sm text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            CSS tokens: <code>--chart-color-1</code> … <code>--chart-color-10</code> · Import:{' '}
            <code>{'chartColors, primaryChartColors, extendedChartColors'}</code> from{' '}
            <code>ChartComponents</code>
          </div>
        </VStack>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Basic Area chart</span>
            <AreaChartDemo variant="basic" />
          </VStack>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Stacked Area chart
            </span>
            <AreaChartDemo variant="stacked" />
          </VStack>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">No data</span>
            <AreaChartDemo variant="nodata" />
          </VStack>
        </VStack>
      }
      relatedLinks={[
        {
          label: 'Chart overview',
          path: '/design/charts/overview',
          description: 'Chart guidelines',
        },
        {
          label: 'Monitoring toolbar',
          path: '/design/components/monitoring-toolbar',
          description: 'Time range controls',
        },
      ]}
    />
  );
}
