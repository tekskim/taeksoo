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
        <VStack gap={4}>
          <h3 className="text-heading-h4 text-[var(--color-text-default)]">Usage Guidelines</h3>
          <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>구성 비율</strong>: 전체 대비 각 항목의 비율을 시각화합니다 (e.g. 스토리지
                유형별 분포).
              </li>
              <li>
                <strong>항목 수</strong>: 최대 7개를 권장합니다. 초과 시 나머지 항목을
                &quot;기타(Others)&quot;로 그룹핑합니다.
              </li>
              <li>각 슬라이스에 퍼센트 라벨을 표시합니다.</li>
              <li>hover 시 해당 항목의 상세 값(이름, 수치, 비율)을 tooltip으로 표시합니다. </li>
            </ul>
          </div>
        </VStack>
      }
      tokens={
        <VStack gap={4}>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>radius: 90px</code> · <code>label-threshold: 15%</code> ·{' '}
            <code>legend: external</code> · <code>legend-scroll: 60px</code>
          </div>

          <VStack gap={2}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Primary 5-color palette
            </span>
            <VStack gap={1}>
              {[
                { seq: 1, name: 'cyan400', hex: '#22d3ee', label: '1st series' },
                { seq: 2, name: 'emerald400', hex: '#34d399', label: '2nd series' },
                { seq: 3, name: 'amber400', hex: '#fbbf24', label: '3rd series' },
                { seq: 4, name: 'violet400', hex: '#a78bfa', label: '4th series' },
                { seq: 5, name: 'fuchsia400', hex: '#e879f9', label: '5th series' },
              ].map((c) => (
                <div key={c.name} className="flex items-center gap-1.5 px-2 py-1">
                  <span className="text-body-xs text-[var(--color-text-subtle)] w-3 text-right shrink-0">
                    {c.seq}
                  </span>
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-body-sm text-[var(--color-text-default)]">{c.name}</span>
                  <span className="text-body-xs text-[var(--color-text-subtle)]">{c.hex}</span>
                </div>
              ))}
            </VStack>
          </VStack>

          <VStack gap={2}>
            <span className="text-label-md text-[var(--color-text-default)]">Extended palette</span>
            <VStack gap={1}>
              {[
                { seq: 6, name: 'pink400', hex: '#f472b6' },
                { seq: 7, name: 'red400', hex: '#f87171' },
                { seq: 8, name: 'blue400', hex: '#60a5fa' },
                { seq: 9, name: 'teal400', hex: '#2dd4bf' },
                { seq: 10, name: 'orange400', hex: '#fb923c' },
                { seq: 11, name: 'indigo400', hex: '#818cf8' },
              ].map((c) => (
                <div key={c.name} className="flex items-center gap-1.5 px-2 py-1">
                  <span className="text-body-xs text-[var(--color-text-subtle)] w-3 text-right shrink-0">
                    {c.seq}
                  </span>
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-body-sm text-[var(--color-text-default)]">{c.name}</span>
                  <span className="text-body-xs text-[var(--color-text-subtle)]">{c.hex}</span>
                </div>
              ))}
            </VStack>
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
