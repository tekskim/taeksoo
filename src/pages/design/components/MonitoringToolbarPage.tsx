import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { MonitoringToolbar, VStack } from '@/design-system';

export function MonitoringToolbarPage() {
  return (
    <ComponentPageTemplate
      title="Monitoring toolbar"
      description="Time range selection and refresh controls for monitoring dashboards"
      relatedLinks={[
        {
          label: 'DatePicker',
          path: '/design/components/datepicker',
          description: 'Date range selection',
        },
        {
          label: 'Chart overview',
          path: '/design/charts/overview',
          description: 'Chart component guidelines',
        },
      ]}
    >
      <VStack gap={8}>
        <VStack gap={3}>
          <Label>1. 개요</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={3}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">정의</h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  그래프의 데이터 조회 범위를 제어하는 버튼 그룹입니다. 최소한의 클릭으로 원하는
                  시간대의 데이터를 빠르게 탐색하는 것이 목표입니다.
                </p>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">위치</h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  그래프 조합으로 이뤄진 화면의 <strong>상단 영역</strong>에 배치됩니다. (모니터링
                  화면 상단 등)
                </p>
              </VStack>
            </VStack>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>2. 구성 요소</Label>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                상대 시간 버튼
              </h4>
              <ol className="list-decimal pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  기본값은 <strong>30m</strong>로 선택 (
                  <code>defaultTimeRange: &apos;30m&apos;</code>)
                </li>
                <li>라디오 버튼처럼 동작 — 한 번에 하나만 활성화</li>
                <li>클릭 즉시 데이터가 해당 기간으로 필터링</li>
              </ol>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                커스텀 기간 버튼
              </h4>
              <ol className="list-decimal pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>클릭 시 데이트 피커 노출</li>
                <li>기간 선택 완료 시 상대 시간 버튼 선택 해지</li>
                <li>
                  기간 선택 후 기간과 <strong>Clear</strong> 버튼 노출
                </li>
                <li>Clear 클릭 시 커스텀 기간 해지 → 1h(상대 시간) 재선택</li>
                <li>Clear 외 영역 클릭 시 데이트 피커 재노출 (기간 재설정 가능)</li>
              </ol>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                새로 고침 버튼
              </h4>
              <ol className="list-decimal pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>클릭 시 데이터가 새로고침됩니다.</li>
              </ol>
            </div>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>segment-padding: 4px 12px</code> · <code>border-radius: 8px</code> ·{' '}
            <code>font-size: 11px</code> · <code>gap: 4px</code>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Default</Label>
          <div className="flex items-center justify-end p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <MonitoringToolbar
              onTimeRangeChange={(value) => console.log('Time range:', value)}
              onCustomPeriodChange={(period) => console.log('Custom period:', period)}
              onRefresh={() => console.log('Refresh clicked')}
            />
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Specifications</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-12)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Property
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Type
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Default
                  </th>
                  <th className="text-left font-medium text-[var(--color-text-subtle)]">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    timeRangeOptions
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">TimeRangeOption[]</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                    30m, 1h, 6h, 12h, 24h
                  </td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Time range options to display
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    timeRange
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">TimeRangeValue</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Controlled time range value
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    defaultTimeRange
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">TimeRangeValue</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">&apos;30m&apos;</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Default time range (uncontrolled)
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    onTimeRangeChange
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">(value) =&gt; void</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Callback when time range changes
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    customPeriod
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">CustomPeriod | null</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Custom date range (start, end)
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    onCustomPeriodChange
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">(period) =&gt; void</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Callback when custom period changes
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    onRefresh
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">() =&gt; void</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Callback when refresh is clicked
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    showRefresh
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">true</td>
                  <td className="py-2 text-[var(--color-text-default)]">Show refresh button</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    maxDate
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">Date</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">new Date()</td>
                  <td className="py-2 text-[var(--color-text-default)]">Maximum selectable date</td>
                </tr>
              </tbody>
            </table>
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
