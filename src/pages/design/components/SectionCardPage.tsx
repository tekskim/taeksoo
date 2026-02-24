import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Button, SectionCard, VStack } from '@/design-system';
import { IconEdit } from '@tabler/icons-react';

const sectionCardProps: PropDef[] = [
  {
    name: 'isActive',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Active state with blue border',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'SectionCard.Header + Content',
  },
];

const sectionCardHeaderProps: PropDef[] = [
  { name: 'title', type: 'string', required: true, description: 'Section title' },
  { name: 'actions', type: 'ReactNode', required: false, description: 'Action buttons' },
  {
    name: 'showDivider',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Show divider',
  },
  { name: 'description', type: 'string', required: false, description: 'Description text' },
];

const sectionCardDataRowProps: PropDef[] = [
  { name: 'label', type: 'ReactNode', required: true, description: 'Row label' },
  { name: 'value', type: 'string', required: false, description: 'Row value text' },
  { name: 'children', type: 'ReactNode', required: false, description: 'Custom value content' },
  {
    name: 'isLink',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Render as link',
  },
  { name: 'linkHref', type: 'string', required: false, description: 'Link destination' },
];

export function SectionCardPage() {
  return (
    <ComponentPageTemplate
      title="Section card"
      description="Container component for grouping related content in detail views"
      preview={
        <ComponentPreview
          code={`<SectionCard>
  <SectionCard.Header title="Basic information" />
  <SectionCard.Content>
    <SectionCard.DataRow label="Instance name" value="web-server-01" />
    <SectionCard.DataRow label="Availability zone" value="nova" />
  </SectionCard.Content>
</SectionCard>`}
        >
          <SectionCard>
            <SectionCard.Header title="Basic information" />
            <SectionCard.Content>
              <SectionCard.DataRow label="Instance name" value="web-server-01" />
              <SectionCard.DataRow label="Availability zone" value="nova" />
              <SectionCard.DataRow label="Description" value="Production web server" />
            </SectionCard.Content>
          </SectionCard>
        </ComponentPreview>
      }
      usage={{
        code: `import { SectionCard } from '@/design-system';\n\n<SectionCard>\n  <SectionCard.Header title="Basic information" actions={<Button>Edit</Button>} />\n  <SectionCard.Content>\n    <SectionCard.DataRow label="Name" value="instance-01" />\n    <SectionCard.DataRow label="Status">\n      <StatusIndicator status="active" label="Active" />\n    </SectionCard.DataRow>\n  </SectionCard.Content>\n</SectionCard>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              With Action Buttons
            </span>
            <SectionCard>
              <SectionCard.Header
                title="Basic information"
                actions={
                  <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                    Edit
                  </Button>
                }
              />
              <SectionCard.Content>
                <SectionCard.DataRow label="Instance name" value="web-server-01" />
                <SectionCard.DataRow label="Availability zone" value="nova" />
              </SectionCard.Content>
            </SectionCard>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">With Link Values</span>
            <SectionCard>
              <SectionCard.Header title="Flavor" />
              <SectionCard.Content>
                <SectionCard.DataRow
                  label="Flavor name"
                  value="m1.large"
                  isLink
                  linkHref="/flavors"
                />
                <SectionCard.DataRow label="Spec" value="vCPU: 4 / RAM: 8 GiB / Disk: 80 GiB" />
              </SectionCard.Content>
            </SectionCard>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Multiple Sections (Detail Page Layout)
            </span>
            <VStack gap={4}>
              <SectionCard>
                <SectionCard.Header
                  title="Basic information"
                  actions={
                    <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                      Edit
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Instance name" value="tk-test" />
                  <SectionCard.DataRow label="Availability zone" value="nova" />
                  <SectionCard.DataRow label="Description" value="-" />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Flavor" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Flavor name"
                    value="web-server-10"
                    isLink
                    linkHref="/flavors"
                  />
                  <SectionCard.DataRow
                    label="Spec"
                    value="vCPU: 1 / RAM: 4 GiB / Disk: 40 GiB / GPU: 1"
                  />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Image" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Image"
                    value="web-server-10"
                    isLink
                    linkHref="/images"
                  />
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </VStack>
        </VStack>
      }
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={2}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
            <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>Detail Page에서 관련 정보를 그룹화하는 카드 컨테이너입니다.</li>
              <li>
                <strong>Header</strong>: 섹션 타이틀과 선택적 액션 버튼(Edit 등)을 포함합니다.
              </li>
              <li>
                <strong>DataRow</strong>: label-value 형태로 정보를 표시합니다. <code>isLink</code>
                로 클릭 가능한 링크를 제공합니다.
              </li>
              <li>
                <strong>복잡한 값</strong>: value prop 대신 <code>children</code>으로
                StatusIndicator, Chip 등 커스텀 콘텐츠를 표시합니다.
              </li>
              <li>
                하나의 SectionCard에는 <strong>최대 10개의 DataRow</strong>를 권장합니다. 초과 시
                SectionCard를 분리하세요.
              </li>
            </ul>
          </VStack>
        </div>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>padding: 16×12px</code> · <code>radius: 6px (md)</code> ·{' '}
          <code>header.height: 32px</code> · <code>title: 14px medium</code> ·{' '}
          <code>label: 11px medium</code> · <code>value: 12px</code>
        </div>
      }
      apiReference={sectionCardProps}
      subComponentApis={[
        { name: 'SectionCard.Header', props: sectionCardHeaderProps },
        { name: 'SectionCard.DataRow', props: sectionCardDataRowProps },
      ]}
      relatedLinks={[
        {
          label: 'Detail header',
          path: '/design/components/detail-header',
          description: 'Page header for detail views',
        },
        {
          label: 'Disclosure',
          path: '/design/components/disclosure',
          description: 'Expandable sections',
        },
        {
          label: 'Form Field',
          path: '/design/components/form-field',
          description: 'Form field with label',
        },
      ]}
    />
  );
}
