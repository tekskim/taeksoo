import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { QuotaBarDemo } from '../../design-system-sections/ChartComponents';
import { ProgressBar, VStack } from '@/design-system';

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
      title="Progress Bar"
      description="Visual indicator for quota usage and progress with status-based colors"
      preview={
        <div className="w-[var(--search-input-width)] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
          <ProgressBar variant="quota" label="Instance" value={2} newValue={0} max={10} />
          <ProgressBar variant="quota" label="Instance" value={8} newValue={2} max={10} />
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
              <li>hover 시 정확한 수치를 tooltip으로 표시합니다.</li>
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
              <ProgressBar variant="quota" label="Instance" value={2} newValue={0} max={10} />
              <ProgressBar variant="quota" label="Instance" value={8} newValue={2} max={10} />
              <ProgressBar variant="quota" label="Instance" value={5} newValue={2} max={10} />
              <ProgressBar variant="quota" label="Instance" value={8} newValue={5} max={10} />
              <ProgressBar variant="quota" label="Instance" value={10} newValue={0} max={10} />
              <ProgressBar variant="quota" label="Instance" value={10} newValue={0} />
            </div>
          </VStack>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Default Variant - Status Based Colors
            </span>
            <div className="w-[var(--search-input-width)] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
              <ProgressBar label="30 MB (30%)" value={30} max={100} showValue={false} />
              <ProgressBar label="60 MB (75%)" value={75} max={100} showValue={false} />
              <ProgressBar label="100 MB (100%)" value={100} max={100} showValue={false} />
            </div>
          </VStack>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Dashboard only</span>
            <div className="w-[288px] p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-2xl">
              <div className="text-[11px] font-semibold text-[var(--color-text-muted)] tracking-wide mb-4">
                COMPUTE QUOTA
              </div>
              <div className="space-y-[22px]">
                <QuotaBarDemo label="vCPU" used={4} total={8} unit="vCPU" />
                <QuotaBarDemo label="RAM" used={22} total={32} unit="GiB" />
                <QuotaBarDemo label="Disk" used={4} total={6} unit="GiB" />
                <QuotaBarDemo label="GPU" used={6} total={8} unit="GPU" />
                <QuotaBarDemo label="NPU" used={6} total={8} unit="NPU" />
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
