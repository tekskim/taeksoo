import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { SelectionIndicator, VStack } from '@/design-system';

const selectionIndicatorProps: PropDef[] = [
  {
    name: 'selectedItems',
    type: 'SelectionItem[]',
    default: '[]',
    required: false,
    description: 'Selected items to display',
  },
  {
    name: 'onRemove',
    type: '(id: string) => void',
    required: false,
    description: 'Item remove handler',
  },
  {
    name: 'emptyText',
    type: 'string',
    default: "'No item selected'",
    required: false,
    description: 'Empty state text',
  },
  {
    name: 'removable',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Allow item removal',
  },
  { name: 'error', type: 'boolean', default: 'false', required: false, description: 'Error state' },
  {
    name: 'errorMessage',
    type: 'string',
    required: false,
    description: 'Error message when error is true',
  },
];

export function SelectionIndicatorPage() {
  return (
    <ComponentPageTemplate
      title="SelectionIndicator"
      description="Display component for showing table selection state. Supports error state for required selection validation."
      preview={
        <ComponentPreview
          code={`<SelectionIndicator
  selectedItems={[{ id: '1', label: 'ubuntu-24.04-tk-base' }]}
  onRemove={() => {}}
/>`}
        >
          <SelectionIndicator
            selectedItems={[{ id: '1', label: 'ubuntu-24.04-tk-base' }]}
            onRemove={() => {}}
          />
        </ComponentPreview>
      }
      usage={{
        code: `import { SelectionIndicator } from '@/design-system';

<SelectionIndicator
  selectedItems={selectedItems}
  onRemove={(id) => handleRemove(id)}
  error={required && selectedItems.length === 0}
  errorMessage="Please select at least one item"
/>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Empty State</Label>
            <SelectionIndicator />
          </VStack>
          <VStack gap={3}>
            <Label>With Selection</Label>
            <SelectionIndicator
              selectedItems={[{ id: '1', label: 'ubuntu-24.04-tk-base' }]}
              onRemove={() => {}}
            />
          </VStack>
          <VStack gap={3}>
            <Label>Multiple Selections</Label>
            <SelectionIndicator
              selectedItems={[
                { id: '1', label: 'default-sg' },
                { id: '2', label: 'web-server-sg' },
                { id: '3', label: 'database-sg' },
              ]}
              onRemove={() => {}}
            />
          </VStack>
          <VStack gap={3}>
            <Label>Multiple Selections (Wrapping)</Label>
            <SelectionIndicator
              selectedItems={[
                { id: '1', label: 'default-sg' },
                { id: '2', label: 'web-server-sg' },
                { id: '3', label: 'database-sg' },
                { id: '4', label: 'monitoring-sg' },
                { id: '5', label: 'load-balancer-sg' },
                { id: '6', label: 'api-gateway-sg' },
                { id: '7', label: 'cache-cluster-sg' },
                { id: '8', label: 'message-queue-sg' },
              ]}
              onRemove={() => {}}
            />
          </VStack>
          <VStack gap={3}>
            <Label>Error State</Label>
            <SelectionIndicator error errorMessage="Please select a start source." />
          </VStack>
          <VStack gap={3}>
            <Label>Error State (uses emptyText as fallback)</Label>
            <SelectionIndicator error emptyText="Selection is required" />
          </VStack>
        </VStack>
      }
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={2}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
            <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>테이블에서 선택된 항목의 수를 표시하는 전용 컴포넌트입니다.</li>
              <li>
                선택 필수(required) 필드에서 미선택 시 <strong>에러 상태</strong>를 표시합니다.
              </li>
              <li>선택된 항목의 개별 제거(X 클릭)와 전체 해제를 지원합니다.</li>
              <li>Drawer 내 리소스 선택 시 테이블 아래에 배치하여 선택 상태를 알립니다.</li>
            </ul>
          </VStack>
        </div>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>min-height: 42px</code> · <code>padding: 8×12px</code> ·{' '}
          <code>radius: table-row-radius</code> · <code>gap: 16px</code>
        </div>
      }
      apiReference={selectionIndicatorProps}
      accessibility={
        <p className="text-body-md text-[var(--color-text-muted)]">
          SelectionIndicator uses aria-live for dynamic content. Remove buttons have aria-label.
          Error state is announced to screen readers.
        </p>
      }
      relatedLinks={[
        {
          label: 'Table',
          path: '/design/components/table',
          description: 'Data table with selection',
        },
        { label: 'Chip', path: '/design/components/chip', description: 'Interactive tags' },
        {
          label: 'Pagination',
          path: '/design/components/pagination',
          description: 'Shows selected count',
        },
      ]}
    />
  );
}
