import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { CardTitle, VStack } from '@/design-system';
import { IconServer } from '@tabler/icons-react';

const cardTitleProps: PropDef[] = [
  { name: 'title', type: 'string', required: true, description: 'Main title text' },
  { name: 'description', type: 'string', required: false, description: 'Description below title' },
  {
    name: 'showStatus',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Show status indicator dot',
  },
  {
    name: 'statusColor',
    type: "'success' | 'warning' | 'error' | 'info' | 'muted'",
    required: false,
    description: 'Status dot color',
  },
  { name: 'badges', type: 'CardTitleBadge[]', required: false, description: 'Array of badges' },
  {
    name: 'side',
    type: "'none' | 'gauge' | 'icon'",
    default: "'none'",
    required: false,
    description: 'Side content type',
  },
  {
    name: 'gaugeValue',
    type: 'string',
    required: false,
    description: 'Gauge value (when side="gauge")',
  },
  {
    name: 'gaugeLabel',
    type: 'string',
    required: false,
    description: 'Gauge label (when side="gauge")',
  },
  { name: 'sideIcon', type: 'ReactNode', required: false, description: 'Icon (when side="icon")' },
  { name: 'onClick', type: '() => void', required: false, description: 'Click handler' },
];

function CardTitlePreview() {
  return (
    <VStack gap={4} className="w-full max-w-[400px]">
      <div className="border border-[var(--color-border-default)] rounded-lg p-4">
        <CardTitle
          title="Worker Node 01"
          description="192.168.1.10"
          showStatus
          statusColor="success"
        />
      </div>
      <div className="border border-[var(--color-border-default)] rounded-lg p-4">
        <CardTitle
          title="Storage Pool"
          badges={[
            { label: 'SSD', variant: 'info' },
            { label: 'Replicated', variant: 'default' },
          ]}
          side="gauge"
          gaugeValue="75%"
          gaugeLabel="Used"
        />
      </div>
      <div className="border border-[var(--color-border-default)] rounded-lg p-4">
        <CardTitle
          title="Server"
          description="Production"
          side="icon"
          sideIcon={<IconServer size={20} stroke={1.5} />}
        />
      </div>
    </VStack>
  );
}

export function CardTitlePage() {
  return (
    <ComponentPageTemplate
      title="CardTitle"
      description="Card header with title, optional description, status dot, badges, and side content (gauge or icon). Used in list items, cards, and headers."
      whenToUse={['카드 또는 리스트 아이템의 헤더 영역', '상태 표시가 필요한 리소스 카드 타이틀']}
      whenNotToUse={[
        '페이지 레벨 타이틀 → PageHeader 사용',
        '섹션 카드 헤더 → SectionCard.Header 사용',
      ]}
      preview={
        <ComponentPreview
          code={`<CardTitle
  title="Worker Node 01"
  description="192.168.1.10"
  showStatus
  statusColor="success"
/>

<CardTitle
  title="Storage Pool"
  badges={[{ label: 'SSD', variant: 'info' }]}
  side="gauge"
  gaugeValue="75%"
  gaugeLabel="Used"
/>`}
        >
          <CardTitlePreview />
        </ComponentPreview>
      }
      props={cardTitleProps}
      usage={{
        code: `import { CardTitle } from '@/design-system';

<CardTitle
  title="Worker Node 01"
  description="192.168.1.10"
  showStatus
  statusColor="success"
  badges={[{ label: 'Ready', variant: 'success' }]}
/>`,
      }}
      relatedLinks={[{ label: 'SectionCard', path: '/design/components/section-card' }]}
    />
  );
}
