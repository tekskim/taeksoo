import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { HalfDoughnutChartDemo } from '../../design-system-sections/ChartComponents';
import { VStack } from '@/design-system';

export function HalfDoughnutChartPage() {
  return (
    <ComponentPageTemplate
      title="Half-Doughnut chart"
      description="Progress and metric visualization with half-circular arc design"
      preview={
        <HalfDoughnutChartDemo
          value={35}
          label="Safe"
          status="success"
          used={66.5}
          total={189.9}
          unit="TiB"
        />
      }
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={2}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
            <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>
                <strong>단일 지표</strong>: 하나의 리소스 사용률을 게이지 형태로 시각화합니다 (e.g.
                CPU 45%).
              </li>
              <li>
                <strong>Status 색상</strong>: 사용률에 따라 Safe/Warning/Danger 색상이 자동
                적용됩니다.
              </li>
              <li>중앙에 현재 값(퍼센트 또는 수치)을 크게 표시합니다.</li>
              <li>대시보드 Overview에서 주요 리소스 현황을 한눈에 보여줄 때 사용합니다.</li>
            </ul>
          </VStack>
        </div>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>arc-width: 14px</code> · <code>start-angle: 200°</code> ·{' '}
          <code>end-angle: -20°</code>
        </div>
      }
      examples={
        <VStack gap={6}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Status variants</span>
            <div className="flex items-center gap-8 flex-wrap">
              <HalfDoughnutChartDemo
                value={35}
                label="Safe"
                status="success"
                used={66.5}
                total={189.9}
                unit="TiB"
              />
              <HalfDoughnutChartDemo
                value={75}
                label="Warning"
                status="warning"
                used={142.4}
                total={189.9}
                unit="TiB"
              />
              <HalfDoughnutChartDemo
                value={95}
                label="Danger"
                status="error"
                used={180.4}
                total={189.9}
                unit="TiB"
              />
            </div>
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
          label: 'Status colors',
          path: '/design/charts/status-colors',
          description: 'Color thresholds',
        },
        {
          label: 'Doughnut chart',
          path: '/design/charts/doughnut',
          description: 'Full ring variant',
        },
      ]}
    />
  );
}
