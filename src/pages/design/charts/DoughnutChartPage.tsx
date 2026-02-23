import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { DoughnutChartDemo } from '../../design-system-sections/ChartComponents';
import { VStack } from '@/design-system';

export function DoughnutChartPage() {
  return (
    <ComponentPageTemplate
      title="Doughnut chart"
      description="Ring chart for part-to-whole relationships with optional center metrics"
      relatedLinks={[
        {
          label: 'Chart overview',
          path: '/design/charts/overview',
          description: 'Chart guidelines',
        },
        { label: 'Pie chart', path: '/design/charts/pie-chart', description: 'Full pie variant' },
        {
          label: 'Half-Doughnut chart',
          path: '/design/charts/half-doughnut',
          description: 'Gauge variant',
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
                  <strong>구성 비율 + 합계</strong>: Pie chart와 유사하지만, 중앙에 합계/핵심 수치를
                  표시할 수 있습니다.
                </li>
                <li>
                  <strong>Status 모드</strong>: 사용률 기반 시 Safe/Warning/Danger 색상이
                  적용됩니다.
                </li>
                <li>
                  <strong>항목 수</strong>: 최대 7개를 권장합니다. 초과 시
                  &quot;기타(Others)&quot;로 그룹핑합니다.
                </li>
                <li>hover 시 해당 항목의 상세 정보를 tooltip으로 표시합니다.</li>
              </ul>
            </VStack>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>inner-radius: 68%</code> · <code>outer-radius: 80%</code> ·{' '}
            <code>thickness: 12%</code> · <code>border-radius: 6px</code>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Example</Label>
          <div className="flex gap-6 flex-wrap">
            <DoughnutChartDemo title="OSD onode Hits Ratio" value={98.3} color="#ef4444" />
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
