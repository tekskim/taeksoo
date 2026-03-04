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
      description="Visual indicator for quota usage and progress with status-based colors"
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
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={2}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
            <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>
                <strong>Quota 표시</strong>: 리소스 할당량 대비 사용량을 시각화합니다 (e.g. vCPU
                5/10).
              </li>
              <li>
                <strong>Status 색상</strong>: 사용률에 따라 Safe/Warning/Danger 색상이 자동
                적용됩니다.
              </li>
              <li>Floating card의 Quota 섹션에서 주로 사용합니다.</li>
            </ul>
          </VStack>
        </div>
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
        {
          label: 'Status colors',
          path: '/design/charts/status-colors',
          description: 'Color thresholds',
        },
        {
          label: 'Chart overview',
          path: '/design/charts/overview',
          description: 'Chart guidelines',
        },
        {
          label: 'Floating card',
          path: '/design/components/floating-card',
          description: 'Uses quota bars',
        },
      ]}
    />
  );
}
