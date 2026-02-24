import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Chip, VStack } from '@/design-system';

const chipProps: PropDef[] = [
  { name: 'label', type: 'string', required: false, description: 'Category/field label' },
  { name: 'value', type: 'string', required: true, description: 'Display value' },
  {
    name: 'variant',
    type: "'default' | 'selected'",
    default: "'default'",
    required: false,
    description: 'Chip variant',
  },
  { name: 'onRemove', type: '() => void', required: false, description: 'Show remove button' },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Disabled state',
  },
  { name: 'icon', type: 'ReactNode', required: false, description: 'Left icon' },
  { name: 'maxWidth', type: 'string', required: false, description: 'Max width for truncation' },
];

export function ChipPage() {
  return (
    <ComponentPageTemplate
      title="Chip"
      description="Interactive tags for displaying selected values with optional remove action"
      preview={
        <ComponentPreview
          code={`<Chip value="Active" onRemove={() => {}} />
<Chip label="Name" value="a" onRemove={() => {}} />`}
        >
          <div className="flex gap-2 flex-wrap">
            <Chip value="Active" onRemove={() => {}} />
            <Chip label="Name" value="a" onRemove={() => {}} />
          </div>
        </ComponentPreview>
      }
      usage={{
        code: `import { Chip } from '@/design-system';

<Chip value="Active" onRemove={() => handleRemove()} />
<Chip label="Status" value="Running" onRemove={() => {}} />`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>With Remove Button</Label>
            <div className="flex gap-2 flex-wrap">
              <Chip value="Active" onRemove={() => {}} />
              <Chip label="Name" value="a" onRemove={() => {}} />
              <Chip label="Status" value="Running" onRemove={() => {}} />
            </div>
          </VStack>
          <VStack gap={3}>
            <Label>Selected Variant (for Radio/Checkbox selections)</Label>
            <div className="flex gap-2 flex-wrap">
              <Chip value="default-sg" variant="selected" onRemove={() => {}} />
              <Chip value="custom-group" variant="selected" onRemove={() => {}} />
              <Chip value="production" variant="selected" onRemove={() => {}} />
            </div>
          </VStack>
          <VStack gap={3}>
            <Label>States</Label>
            <div className="flex gap-2 items-start">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Default
                </span>
                <Chip label="Name" value="a" onRemove={() => {}} />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled
                </span>
                <Chip label="Name" value="a" disabled />
              </VStack>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={2}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
            <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>
                사용자가 선택/입력한 값을 태그 형태로 표시하고, 제거 버튼(X)으로 삭제할 수 있습니다.
              </li>
              <li>
                <strong>Labels</strong>: Kubernetes label(key=value) 표시 시 Chip을 사용합니다.
              </li>
              <li>
                <strong>필터</strong>: 적용된 필터 조건을 Chip으로 표시하고 개별 제거가 가능하게
                합니다.
              </li>
              <li>
                <strong>길이 제한</strong>: 텍스트가 길 경우 말줄임 처리하고 tooltip으로 전체 텍스트
                제공.
              </li>
              <li>
                <strong>최대 개수</strong>: 화면에 너무 많은 Chip이 쌓이면 &quot;+N more&quot;로
                접어서 표시합니다.
              </li>
            </ul>
          </VStack>
        </div>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>padding: 8×4px</code> · <code>gap: 6px</code> · <code>radius: 6px</code> ·{' '}
          <code>font: 11px</code>
        </div>
      }
      apiReference={chipProps}
      accessibility={
        <p className="text-body-md text-[var(--color-text-muted)]">
          Chip remove button has aria-label. Disabled chips are not focusable. Ensure sufficient
          color contrast.
        </p>
      }
      relatedLinks={[
        {
          label: 'Badge',
          path: '/design/components/badge',
          description: 'Status indicators and labels',
        },
        {
          label: 'SelectionIndicator',
          path: '/design/components/selection-indicator',
          description: 'Table selection state display',
        },
        {
          label: 'Filter Search Input',
          path: '/design/components/filter-search-input',
          description: 'Search with filter chips',
        },
      ]}
    />
  );
}
