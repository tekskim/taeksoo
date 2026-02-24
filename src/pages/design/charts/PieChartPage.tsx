import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { PieChartDemo } from '../../design-system-sections/ChartComponents';
import { VStack } from '@/design-system';

export function PieChartPage() {
  return (
    <ComponentPageTemplate
      title="Pie chart"
      description="Part-to-whole relationships with percentage labels on slices"
      preview={
        <PieChartDemo
          title="OSD Objectstore Types"
          data={[
            { name: 'bluestore', value: 70 },
            { name: 'filestore', value: 20 },
            { name: 'seastore', value: 10 },
          ]}
        />
      }
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={2}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
            <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>
                <strong>구성 비율</strong>: 전체 대비 각 항목의 비율을 시각화합니다 (e.g. 스토리지
                유형별 분포).
              </li>
              <li>
                <strong>항목 수</strong>: 최대 7개를 권장합니다. 초과 시 나머지 항목을
                &quot;기타(Others)&quot;로 그룹핑합니다.
              </li>
              <li>각 슬라이스에 퍼센트 라벨을 표시합니다.</li>
              <li>hover 시 해당 항목의 상세 값(이름, 수치, 비율)을 tooltip으로 표시합니다.</li>
            </ul>
          </VStack>
        </div>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>radius: 90px</code> · <code>label-threshold: 15%</code> ·{' '}
          <code>legend: external</code> · <code>legend-scroll: 60px</code>
        </div>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Examples (from storage-dashboard)
            </span>
            <div className="flex gap-6 flex-wrap">
              <PieChartDemo
                title="OSD Types Summary"
                data={[
                  { name: 'hdd', value: 15 },
                  { name: 'nvme', value: 25 },
                  { name: 'ssd', value: 30 },
                  { name: 'hybrid', value: 10 },
                  { name: 'sata', value: 5 },
                  { name: 'sas', value: 5 },
                  { name: 'pcie', value: 4 },
                  { name: 'u.2', value: 3 },
                  { name: 'm.2', value: 3 },
                  { name: 'scsi', value: 2 },
                  { name: 'fc', value: 2 },
                  { name: 'iscsi', value: 1 },
                ]}
              />
              <PieChartDemo
                title="OSD Objectstore Types"
                data={[
                  { name: 'bluestore', value: 70 },
                  { name: 'filestore', value: 20 },
                  { name: 'seastore', value: 10 },
                ]}
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
          label: 'Doughnut chart',
          path: '/design/charts/doughnut',
          description: 'Ring chart variant',
        },
      ]}
    />
  );
}
