import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { InfoBox, Chip, VStack } from '@/design-system';

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
    <VStack gap={4} className="w-full max-w-[480px]">
      <InfoBox label="Instance ID" value="i-1234567890abcdef0" copyable />
      <InfoBox label="Status" value="Running" status="active" />
      <InfoBox label="Pod restarts" value={3} tooltip="Total number of container restarts." />
      <InfoBox label="Labels (2)">
        <div className="flex flex-wrap items-center gap-1">
          <Chip label="app=nginx" size="sm" />
          <Chip label="env=production" size="sm" />
        </div>
      </InfoBox>
      <InfoBox.Group>
        <InfoBox label="Resource Name" value="my-deployment" />
        <InfoBox label="Namespace" value="default" />
        <InfoBox label="Created at" value="2026-02-06 14:30:00" />
      </InfoBox.Group>
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
          code={`<InfoBox label="Instance ID" value="i-1234567890abcdef0" copyable />

<InfoBox label="Status" value="Running" status="active" />

<InfoBox label="Pod restarts" value={3} tooltip="Total number of container restarts." />

<InfoBox label="Labels (2)">
  <Chip label="app=nginx" size="sm" />
</InfoBox>

<InfoBox.Group>
  <InfoBox label="Resource Name" value="my-deployment" />
  <InfoBox label="Namespace" value="default" />
</InfoBox.Group>`}
        >
          <InfoBoxPreview />
        </ComponentPreview>
      }
      props={infoBoxProps}
      usage={{
        code: `import { InfoBox } from '@/design-system';

// 기본
<InfoBox label="Instance" value={instance.name} />

// 복사 버튼
<InfoBox label="ID" value={resource.id} copyable />

// 상태 표시
<InfoBox label="Status" value="Running" status="active" />

// tooltip
<InfoBox label="Pod restarts" value={3} tooltip="Total number of container restarts." />

// 그룹
<InfoBox.Group>
  <InfoBox label="Name" value="my-resource" />
  <InfoBox label="Created" value="2026-01-01" />
</InfoBox.Group>`,
      }}
      relatedLinks={[{ label: 'DetailHeader', path: '/design/patterns/detail-header' }]}
    />
  );
}
