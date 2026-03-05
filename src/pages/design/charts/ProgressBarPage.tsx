import { type ReactNode, useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { QuotaBarDemo } from '../../design-system-sections/ChartComponents';
import { ProgressBar, VStack } from '@/design-system';

function getCSSVar(name: string, fallback: string) {
  if (typeof window !== 'undefined') {
    const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return val || fallback;
  }
  return fallback;
}

function statusColor(pct: number) {
  if (pct >= 100) return getCSSVar('--color-state-danger', '#dc2626');
  if (pct >= 70) return getCSSVar('--color-state-warning', '#ea580c');
  return getCSSVar('--color-state-success', '#22c55e');
}

function GaugeHoverTooltip({
  used,
  max,
  unit,
  children,
}: {
  used: number;
  max: number;
  unit?: string;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const available = max - used;
  const pct = Math.round((used / max) * 100);
  const color = statusColor(pct);
  const suffix = unit ? ` ${unit}` : '';
  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 z-50 backdrop-blur-[40px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-1.5 flex flex-col gap-1 w-fit whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-body-sm leading-[14px] text-[var(--color-text-default)]">
              Used:{' '}
              <span className="font-medium">
                {used}
                {suffix} ({pct}%)
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full shrink-0 bg-[var(--color-border-subtle)]" />
            <span className="text-body-sm leading-[14px] text-[var(--color-text-default)]">
              Available:{' '}
              <span className="font-medium">
                {available}
                {suffix} ({100 - pct}%)
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const progressBarProps: PropDef[] = [
  { name: 'value', type: 'number', required: true, description: 'Current value (used)' },
  {
    name: 'max',
    type: 'number',
    required: false,
    description: 'Maximum value (undefined = unlimited)',
  },
  {
    name: 'newValue',
    type: 'number',
    default: '0',
    required: false,
    description: 'New/additional value (quota variant)',
  },
  {
    name: 'variant',
    type: "'default' | 'quota'",
    default: "'default'",
    required: false,
    description: 'Bar variant',
  },
  { name: 'label', type: 'string', required: false, description: 'Label text' },
  {
    name: 'showValue',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Show value text',
  },
  { name: 'size', type: "'sm' | 'md'", default: "'md'", required: false, description: 'Bar size' },
  { name: 'error', type: 'boolean', default: 'false', required: false, description: 'Error state' },
  {
    name: 'thresholds',
    type: 'StatusThresholds',
    required: false,
    description: 'Custom thresholds (e.g. STATUS_THRESHOLDS.compute)',
  },
];

export function ProgressBarPage() {
  return (
    <ComponentPageTemplate
      title="Gauge bar chart"
      description="전체 용량 대비 현재 사용량을 시각화하는 수평형 막대 인디케이터다. 사용률에 따라 상태 기반 색상(Status Color)이 자동 적용된다. 복수의 리소스를 리스트 형태로 나열하여 비교할 때 사용한다."
      whenToUse={[
        '리소스 할당량(Quota), 리소스 현황 등을 시각화할 때 (예: vCPU 5/10, Capacity 167.49/189.9 TiB)',
        '사용률에 따른 상태를 색상(Status Color)으로 즉시 인지시켜야 할 때',
        '표시할 리소스가 2개 이상이거나, 리스트/대시보드 형태로 나열할 때',
      ]}
      whenNotToUse={[
        '단순한 진행 상태(Progress)를 나타낼 때 → Progress Bar 사용',
        '여러 카테고리의 구성 비율을 비교할 때 → Pie Chart 사용',
        '여러 카테고리의 값을 비교할 때 → Bar Chart 사용',
        '전체 대비 비율 맥락이 없는 단독 지표 → Badge 또는 Tag로 대체',
        'Standalone metric without total context — use Badge or Tag instead',
      ]}
      preview={
        <div className="w-[var(--search-input-width)] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
          <GaugeHoverTooltip used={2} max={10}>
            <ProgressBar variant="quota" label="Instance" value={2} max={10} />
          </GaugeHoverTooltip>
          <GaugeHoverTooltip used={8} max={10}>
            <ProgressBar variant="quota" label="Instance" value={8} max={10} />
          </GaugeHoverTooltip>
        </div>
      }
      guidelines={
        <VStack gap={6}>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Variants</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Variant
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-muted)]">
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium">Quota</td>
                      <td className="py-2">
                        리소스명과 사용량/총량 수치를 함께 표시. 항목별 Gauge Bar가 리스트 형태로
                        나열됨
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium">Default</td>
                      <td className="py-2">
                        수치 레이블만 표시 (예: 30 MB (30%)). 공간이 제한적인 컨텍스트에서 사용
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Dashboard</td>
                      <td className="py-2">
                        리소스 그룹 타이틀(예: COMPUTE QUOTA)과 함께 항목별 이름, 사용량/총량,
                        퍼센트를 모두 표시. 대시보드 전용 레이아웃
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                상태 기반 색상 전환
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        상태
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        기준 (사용률)
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        색상
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-muted)]">
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">Safe (안전)</td>
                      <td className="py-2 pr-4">0 – 69%</td>
                      <td className="py-2">Green (초록)</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">Warning (경고)</td>
                      <td className="py-2 pr-4">70 – 94%</td>
                      <td className="py-2">Orange (주황)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Danger (위험)</td>
                      <td className="py-2 pr-4">95%+</td>
                      <td className="py-2">Red (빨강)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                임계값은 서비스 도메인별로 조정 가능하며, Status Color 토큰과 함께 관리된다.
              </p>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">Do</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    같은 컨텍스트 안에서 Gauge Bar 트랙 너비를 통일하여 시각적 비교가 가능하도록
                    한다.
                  </li>
                  <li>
                    차트와 함께 반드시 수치를 표시한다 — 색상만으로 정보를 전달하지 않는다 (접근성).
                  </li>
                  <li>
                    100%를 초과하는 경우, 채움은 100%로 표시하고 별도의 오버플로우 처리를 적용한다.
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">Don&apos;t</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>같은 컨텍스트에서 Gauge Bar Chart와 Donut Chart를 혼용하지 않는다.</li>
                  <li>단일 리소스를 강조해야 할 때는 Gauge Bar 대신 Donut Chart를 사용한다.</li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>height: 4px</code> · <code>radius: pill</code>
        </div>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Quota Variant - Status Based Colors
            </span>
            <div className="w-[var(--search-input-width)] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
              <GaugeHoverTooltip used={2} max={10}>
                <ProgressBar variant="quota" label="Instance" value={2} max={10} />
              </GaugeHoverTooltip>
              <GaugeHoverTooltip used={5} max={10}>
                <ProgressBar variant="quota" label="Instance" value={5} max={10} />
              </GaugeHoverTooltip>
              <GaugeHoverTooltip used={7} max={10}>
                <ProgressBar variant="quota" label="Instance" value={7} max={10} />
              </GaugeHoverTooltip>
              <GaugeHoverTooltip used={10} max={10}>
                <ProgressBar variant="quota" label="Instance" value={10} max={10} />
              </GaugeHoverTooltip>
            </div>
          </VStack>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Default Variant - Status Based Colors
            </span>
            <div className="w-[var(--search-input-width)] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
              <GaugeHoverTooltip used={30} max={100} unit="MB">
                <ProgressBar label="30 MB (30%)" value={30} max={100} showValue={false} />
              </GaugeHoverTooltip>
              <GaugeHoverTooltip used={75} max={100} unit="MB">
                <ProgressBar label="60 MB (75%)" value={75} max={100} showValue={false} />
              </GaugeHoverTooltip>
              <GaugeHoverTooltip used={100} max={100} unit="MB">
                <ProgressBar label="100 MB (100%)" value={100} max={100} showValue={false} />
              </GaugeHoverTooltip>
            </div>
          </VStack>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Dashboard only</span>
            <div className="w-[288px] p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-2xl">
              <div className="text-[11px] font-semibold text-[var(--color-text-muted)] tracking-wide mb-4">
                COMPUTE QUOTA
              </div>
              <div className="space-y-[22px]">
                <GaugeHoverTooltip used={4} max={8} unit="vCPU">
                  <div className="pointer-events-none">
                    <QuotaBarDemo label="vCPU" used={4} total={8} unit="vCPU" />
                  </div>
                </GaugeHoverTooltip>
                <GaugeHoverTooltip used={22} max={32} unit="GiB">
                  <div className="pointer-events-none">
                    <QuotaBarDemo label="RAM" used={22} total={32} unit="GiB" />
                  </div>
                </GaugeHoverTooltip>
                <GaugeHoverTooltip used={4} max={6} unit="GiB">
                  <div className="pointer-events-none">
                    <QuotaBarDemo label="Disk" used={4} total={6} unit="GiB" />
                  </div>
                </GaugeHoverTooltip>
                <GaugeHoverTooltip used={6} max={8} unit="GPU">
                  <div className="pointer-events-none">
                    <QuotaBarDemo label="GPU" used={6} total={8} unit="GPU" />
                  </div>
                </GaugeHoverTooltip>
                <GaugeHoverTooltip used={6} max={8} unit="NPU">
                  <div className="pointer-events-none">
                    <QuotaBarDemo label="NPU" used={6} total={8} unit="NPU" />
                  </div>
                </GaugeHoverTooltip>
              </div>
            </div>
          </VStack>
        </VStack>
      }
      apiReference={progressBarProps}
      relatedLinks={[
        { label: 'Status Colors', path: '/design/foundation/color' },
        { label: 'Tooltip', path: '/design/components/tooltip' },
      ]}
    />
  );
}
