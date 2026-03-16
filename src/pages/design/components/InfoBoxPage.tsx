import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { InfoBox, Chip, VStack } from '@/design-system';
import { Label } from '../../design-system-sections/HelperComponents';

const infoBoxProps: PropDef[] = [
  { name: 'label', type: 'string', required: true, description: 'Label text' },
  {
    name: 'value',
    type: 'ReactNode',
    required: false,
    description: 'Value (string, number, or ReactNode)',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: false,
    description: 'Complex value (overrides value prop)',
  },
  {
    name: 'tooltip',
    type: 'string',
    required: false,
    description: 'Tooltip text shown via info icon next to label',
  },
  {
    name: 'copyable',
    type: 'boolean',
    required: false,
    defaultValue: 'false',
    description: 'Show copy button (string value only)',
  },
  {
    name: 'status',
    type: 'StatusType',
    required: false,
    description: 'Show StatusIndicator on the right side',
  },
  { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' },
];

function InfoBoxPreview() {
  return (
    <VStack gap={4} className="w-full max-w-[320px]">
      <InfoBox label="Instance Name" value="my-deployment" />
      <InfoBox label="Instance ID" value="i-1234567890abcdef0" copyable />
      <InfoBox label="Status" value="Running" status="active" />
    </VStack>
  );
}

export function InfoBoxPage() {
  return (
    <ComponentPageTemplate
      title="InfoBox"
      description="Label–value block for displaying key-value information. Use value for simple text or children for custom content. tooltip prop adds an info icon next to the label. InfoBox.Group stacks multiple boxes."
      whenToUse={[
        'Drawer 내 리소스 컨텍스트 정보 표시',
        'Modal 내 확인 정보 표시',
        '단순 key-value 정보를 인라인으로 표시할 때',
        'Dashboard 메트릭 수치 표시 (tooltip prop 활용)',
      ]}
      whenNotToUse={[
        'DetailHeader 내부에서 사용 시 → DetailHeader.InfoCard 사용 (내부적으로 InfoBox 래핑)',
      ]}
      preview={
        <ComponentPreview
          code={`<InfoBox label="Instance Name" value="my-deployment" />
<InfoBox label="Instance ID" value="i-1234567890abcdef0" copyable />
<InfoBox label="Status" value="Running" status="active" />`}
        >
          <InfoBoxPreview />
        </ComponentPreview>
      }
      props={infoBoxProps}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Basic</Label>
            <InfoBox label="Instance Name" value="my-deployment" className="max-w-[320px]" />
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <Label>Copyable</Label>
            <InfoBox
              label="Instance ID"
              value="i-1234567890abcdef0"
              copyable
              className="max-w-[320px]"
            />
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <Label>Status</Label>
            <div className="grid grid-cols-2 gap-3 max-w-[480px]">
              <InfoBox label="Status" value="Active" status="active" />
              <InfoBox label="Status" value="Error" status="error" />
              <InfoBox label="Status" value="Building" status="building" />
              <InfoBox label="Status" value="Stopped" status="muted" />
            </div>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <Label>Tooltip</Label>
            <InfoBox
              label="Pod restarts"
              value={3}
              tooltip="Total number of container restarts."
              className="max-w-[320px]"
            />
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <Label>Children (Custom Content)</Label>
            <InfoBox label="Labels (2)" className="max-w-[320px]">
              <div className="flex flex-wrap items-center gap-1">
                <Chip label="app=nginx" size="sm" />
                <Chip label="env=production" size="sm" />
              </div>
            </InfoBox>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <Label>Group</Label>
            <InfoBox.Group className="max-w-[480px]">
              <InfoBox label="Resource Name" value="my-deployment" />
              <InfoBox label="Namespace" value="default" />
              <InfoBox label="Created at" value="2026-02-06 14:30:00" />
            </InfoBox.Group>
          </VStack>
        </VStack>
      }
      relatedLinks={[{ label: 'DetailHeader', path: '/design/patterns/detail-header' }]}
    />
  );
}
