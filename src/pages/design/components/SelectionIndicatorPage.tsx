import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { SelectionIndicator, VStack } from '@/design-system';

export function SelectionIndicatorPage() {
  return (
    <ComponentPageTemplate
      title="SelectionIndicator"
      description="Display component for showing table selection state. Supports error state for required selection validation."
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
    >
      <VStack gap={8}>
        {/* 사용 정책 */}
        <VStack gap={3}>
          <Label>사용 정책</Label>
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
        </VStack>

        {/* Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>min-height: 42px</code> · <code>padding: 8×12px</code> ·{' '}
            <code>radius: table-row-radius</code> · <code>gap: 16px</code>
          </div>
        </VStack>

        {/* Empty State */}
        <VStack gap={3}>
          <Label>Empty State</Label>
          <SelectionIndicator />
        </VStack>

        {/* With Selection */}
        <VStack gap={3}>
          <Label>With Selection</Label>
          <SelectionIndicator
            selectedItems={[{ id: '1', label: 'ubuntu-24.04-tk-base' }]}
            onRemove={() => {}}
          />
        </VStack>

        {/* Multiple Selections */}
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

        {/* Multiple Selections (Wrapping) */}
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

        {/* Error State */}
        <VStack gap={3}>
          <Label>Error State</Label>
          <SelectionIndicator error errorMessage="Please select a start source." />
        </VStack>

        {/* Error State with Custom Empty Text */}
        <VStack gap={3}>
          <Label>Error State (uses emptyText as fallback)</Label>
          <SelectionIndicator error emptyText="Selection is required" />
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
