import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { AreaChartDemo } from '../../design-system-sections/ChartComponents';
import { VStack } from '@/design-system';

export function AreaChartPage() {
  return (
    <ComponentPageTemplate
      title="Area chart"
      description="Filled area visualization for volume and cumulative data"
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
    >
      <VStack gap={8}>
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>시계열 데이터</strong>: CPU/Memory/Network 사용량 등 시간에 따른 변화를
                  시각화합니다.
                </li>
                <li>
                  <strong>Stacked</strong>: 여러 항목의 누적 합을 표시할 때 Stacked 모드를
                  사용합니다.
                </li>
                <li>
                  <strong>빈 데이터</strong>: 데이터가 없는 구간은 &quot;No data&quot; 메시지를
                  표시합니다.
                </li>
                <li>hover 시 해당 시점의 정확한 값을 tooltip으로 표시합니다.</li>
              </ul>
            </VStack>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>fill-opacity: 0.1</code> · <code>line-width: 1px</code> ·{' '}
            <code>smooth: true</code> · <code>symbol-size: 6px</code>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Basic Area chart</Label>
          <AreaChartDemo variant="basic" />
        </VStack>

        <VStack gap={3}>
          <Label>Stacked Area chart</Label>
          <AreaChartDemo variant="stacked" />
        </VStack>

        <VStack gap={3}>
          <Label>No data</Label>
          <AreaChartDemo variant="nodata" />
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
