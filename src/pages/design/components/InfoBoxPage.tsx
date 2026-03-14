import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { InfoBox, Chip, VStack } from '@/design-system';

const infoBoxProps: PropDef[] = [
  { name: 'label', type: 'string', required: true, description: 'Label text' },
  { name: 'value', type: 'string | number', required: false, description: 'Value text' },
  {
    name: 'children',
    type: 'ReactNode',
    required: false,
    description: 'Complex value (overrides value prop)',
  },
  { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' },
];

function InfoBoxPreview() {
  return (
    <VStack gap={4} className="w-full max-w-[480px]">
      <InfoBox label="Instance ID" value="i-1234567890abcdef0" />
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
      description="Label–value block for displaying key-value information. Use value for simple text or children for custom content. InfoBox.Group stacks multiple boxes."
      whenToUse={[
        'Drawer 내 리소스 컨텍스트 정보 표시',
        'Modal 내 확인 정보 표시',
        '단순 key-value 정보를 인라인으로 표시할 때',
      ]}
      whenNotToUse={[
        '상세 페이지 헤더 정보 → DetailHeader.InfoCard 사용',
        '메트릭 수치 표시 → MetricCard 사용',
      ]}
      preview={
        <ComponentPreview
          code={`<InfoBox label="Instance ID" value="i-1234567890abcdef0" />

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

<InfoBox label="Instance" value={instance.name} />

<InfoBox.Group>
  <InfoBox label="Name" value="my-resource" />
  <InfoBox label="Created" value="2026-01-01" />
</InfoBox.Group>`,
      }}
      relatedLinks={[
        { label: 'MetricCard', path: '/design/components/metric-card' },
        { label: 'DetailHeader', path: '/design/patterns/detail-header' },
      ]}
    />
  );
}
