import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { SelectionIndicator, VStack } from '@/design-system';

export function SelectionIndicatorPage() {
  return (
    <ComponentPageTemplate
      title="SelectionIndicator"
      description="Display component for showing table selection state. Supports error state for required selection validation."
      whenToUse={[
        '테이블이나 리스트에서 선택된 항목 수를 표시할 때',
        '벌크 액션 영역에서 현재 선택 상태를 알려줄 때',
      ]}
      whenNotToUse={[
        '단순 카운트만 표시하는 경우 → Badge 사용',
        '진행률을 표시하는 경우 → ProgressBar 사용',
      ]}
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
            <SelectionIndicator error errorMessage="Selection is required" />
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={4}>
          <h3 className="text-heading-h4 text-[var(--color-text-default)]">Usage Guidelines</h3>
          <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed">
            <ul className="list-disc pl-5 space-y-1">
              <li>테이블에서 선택된 항목의 수를 표시하는 전용 컴포넌트입니다.</li>
              <li>
                선택 필수(required) 필드에서 미선택 시 <strong>에러 상태</strong>를 표시합니다.
              </li>
              <li>선택된 항목의 개별 제거(X 클릭)와 전체 해제를 지원합니다.</li>
              <li>Drawer 내 리소스 선택 시 테이블 아래에 배치하여 선택 상태를 알립니다.</li>
            </ul>
          </div>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          min-height: 42px · padding: 8×12px · radius: table-row-radius · gap: 16px
        </div>
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
