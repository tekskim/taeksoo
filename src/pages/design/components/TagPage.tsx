import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Tag, HStack, VStack } from '@/design-system';

const tagProps: PropDef[] = [
  { name: 'children', type: 'ReactNode', required: true, description: 'Tag content' },
  {
    name: 'variant',
    type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'",
    default: "'default'",
    required: false,
    description: 'Color variant',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    required: false,
    description: 'Tag size',
  },
  {
    name: 'closable',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Show close button',
  },
  { name: 'onClose', type: '() => void', required: false, description: 'Close button handler' },
  { name: 'icon', type: 'ReactNode', required: false, description: 'Left icon' },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Disabled state',
  },
  {
    name: 'rounded',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Pill shape',
  },
  {
    name: 'outline',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Bordered style without fill',
  },
  {
    name: 'clickable',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Clickable tag',
  },
];

function TagPreview() {
  return (
    <VStack gap={3}>
      <HStack gap={2}>
        <Tag>Default</Tag>
        <Tag variant="primary">Primary</Tag>
        <Tag variant="success">Success</Tag>
        <Tag variant="warning">Warning</Tag>
        <Tag variant="danger">Danger</Tag>
        <Tag variant="info">Info</Tag>
      </HStack>
      <HStack gap={2}>
        <Tag closable onClose={() => {}}>
          Closable
        </Tag>
        <Tag rounded variant="primary">
          Rounded
        </Tag>
        <Tag outline variant="info">
          Outline
        </Tag>
      </HStack>
    </VStack>
  );
}

export function TagPage() {
  return (
    <ComponentPageTemplate
      title="Tag"
      description="Tag component for labels, categories, or filters. Supports variants, sizes, closable, and outline styles."
      whenToUse={['레이블, 카테고리, 필터 태그 표시에 사용', '삭제 가능한 필터 칩으로 사용']}
      whenNotToUse={[
        '상태 표시 → Badge 또는 StatusIndicator 사용',
        '단순 텍스트 강조 → Badge 사용',
      ]}
      preview={
        <ComponentPreview
          code={`<Tag variant="primary">Primary</Tag>
<Tag closable onClose={() => {}}>Closable</Tag>
<Tag rounded variant="success">Rounded</Tag>
<Tag outline variant="info">Outline</Tag>`}
        >
          <TagPreview />
        </ComponentPreview>
      }
      props={tagProps}
      usage={{
        code: `import { Tag } from '@/design-system';

<Tag variant="primary" closable onClose={handleRemove}>
  app=nginx
</Tag>`,
      }}
      relatedLinks={[
        { label: 'Badge', path: '/design/components/badge' },
        { label: 'Chip', path: '/design/components/chip' },
      ]}
    />
  );
}
