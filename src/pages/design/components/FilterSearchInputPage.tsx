import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { FilterSearchInput, Chip, VStack } from '@/design-system';
import type { FilterField, AppliedFilter } from '@/design-system';
import { IconSearch } from '@tabler/icons-react';

function FilterSearchInputDemo() {
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const filterFields: FilterField[] = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter name...',
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'shutoff', label: 'Shutoff' },
        { value: 'building', label: 'Building' },
        { value: 'error', label: 'Error' },
      ],
    },
    {
      id: 'image',
      label: 'Image',
      type: 'text',
      placeholder: 'Enter image name...',
    },
    {
      id: 'flavor',
      label: 'Flavor',
      type: 'select',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <FilterSearchInput
        filters={filterFields}
        appliedFilters={appliedFilters}
        onFiltersChange={setAppliedFilters}
        placeholder="Search instance by attributes"
        className="w-[var(--search-input-width)]"
      />
      <div className="text-[11px] text-[var(--color-text-subtle)] bg-[var(--color-surface-muted)] p-3 rounded-md">
        <strong>Usage:</strong> Click the input to see available filters. Select a filter type, then
        enter a value (text) or choose from options (select). Applied filters appear as removable
        tags below the input.
      </div>
    </div>
  );
}

export function FilterSearchInputPage() {
  return (
    <ComponentPageTemplate
      title="Filter search Input"
      description="Combined search and filter input with tag display for applied filters"
      relatedLinks={[
        { label: 'Input', path: '/design/components/input', description: 'Text fields and search' },
        { label: 'Select', path: '/design/components/select', description: 'Dropdown select' },
        { label: 'Chip', path: '/design/components/chip', description: 'Filter tags display' },
      ]}
    >
      <VStack gap={8}>
        {/* 사용 정책 */}
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">개요</h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  리스트 페이지에서 리소스를 검색하고 필터링하기 위한 통합 입력 컴포넌트입니다.
                  검색어 입력과 구조화된 필터를 하나의 인터페이스에서 제공합니다.
                </p>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">동작 정책</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>검색</strong>: 입력 후 300ms debounce 적용하여 필터링. Enter 키로 즉시
                    검색 확정.
                  </li>
                  <li>
                    <strong>필터 추가</strong>: 필터 필드 선택 → 값 입력/선택 → 태그로 적용.
                  </li>
                  <li>
                    <strong>필터 제거</strong>: 개별 태그의 X 클릭 또는 &quot;Clear all&quot;로 전체
                    제거.
                  </li>
                  <li>
                    <strong>복합 필터</strong>: 여러 필터를 AND 조건으로 조합 가능.
                  </li>
                  <li>
                    <strong>빈 결과</strong>: 필터 적용 후 결과가 없으면 EmptyState와 함께 필터
                    초기화 옵션 제공.
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">배치 규칙</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>ListToolbar 내 primaryActions 영역의 첫 번째 요소로 배치합니다.</li>
                  <li>
                    너비는 <code>w-[var(--search-input-width)]</code> CSS 변수를 사용합니다.
                  </li>
                  <li>
                    적용된 필터 태그는 Toolbar 하단에 표시되거나 <code>hideAppliedFilters</code>로
                    숨길 수 있습니다.
                  </li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* Design Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>height: 32px (sm) / 36px (md)</code> · <code>padding: 8×12px</code> ·{' '}
            <code>radius: 6px</code> · <code>font: 12px</code> · <code>chip-gap: 4px</code>
          </div>
        </VStack>

        {/* Features */}
        <VStack gap={3}>
          <Label>Features</Label>
          <ul className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)] list-disc list-inside space-y-1">
            <li>Click input to show available filter options</li>
            <li>Select filter field, then enter value (text) or select option (select type)</li>
            <li>Applied filters displayed as removable chips/tags</li>
            <li>Supports text and select filter types</li>
            <li>Clear all filters button when filters are applied</li>
          </ul>
        </VStack>

        {/* Static States */}
        <VStack gap={3}>
          <Label>States (static preview)</Label>
          <div className="grid grid-cols-3 gap-x-6 gap-y-4">
            <VStack gap={1.5} className="w-[var(--search-input-width)]">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                1. Default
              </span>
              <div className="flex items-center gap-1 h-7 px-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                <span className="flex-1 text-body-sm text-[var(--color-text-subtle)]">
                  Search by attributes
                </span>
                <IconSearch size={12} strokeWidth={2} className="text-[var(--color-text-subtle)]" />
              </div>
            </VStack>

            <VStack gap={1.5} className="w-[var(--search-input-width)]">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                2. Filter applied
              </span>
              <VStack gap={2}>
                <div className="flex items-center gap-1 h-7 px-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                  <span className="flex-1 text-body-sm text-[var(--color-text-subtle)]">
                    Search by attributes
                  </span>
                  <IconSearch
                    size={12}
                    strokeWidth={2}
                    className="text-[var(--color-text-subtle)]"
                  />
                </div>
                <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
                  <Chip label="Name" value="instance-01" onRemove={() => {}} />
                  <button className="text-label-sm text-label-md text-[var(--color-action-primary)]">
                    Clear Filters
                  </button>
                </div>
              </VStack>
            </VStack>

            <VStack gap={1.5} className="w-[var(--search-input-width)]">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                3. Multiple filters
              </span>
              <VStack gap={2}>
                <div className="flex items-center gap-1 h-7 px-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                  <span className="flex-1 text-body-sm text-[var(--color-text-subtle)]">
                    Search by attributes
                  </span>
                  <IconSearch
                    size={12}
                    strokeWidth={2}
                    className="text-[var(--color-text-subtle)]"
                  />
                </div>
                <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
                  <div className="flex items-center gap-1 flex-wrap">
                    <Chip label="Name" value="instance-01" onRemove={() => {}} />
                    <Chip label="Status" value="Running" onRemove={() => {}} />
                  </div>
                  <button className="text-label-sm text-label-md text-[var(--color-action-primary)] whitespace-nowrap">
                    Clear Filters
                  </button>
                </div>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* Interactive Demo */}
        <VStack gap={3}>
          <Label>Interactive demo</Label>
          <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
            Click the input below to see available filters. Select a filter, enter a value, and see
            it appear as a tag.
          </p>
          <FilterSearchInputDemo />
        </VStack>

        {/* Usage Example */}
        <VStack gap={3}>
          <Label>Usage example</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] font-mono whitespace-pre-wrap">
            {`const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Enter name...' },
  { id: 'status', label: 'Status', type: 'select', options: [
    { value: 'running', label: 'Running' },
    { value: 'stopped', label: 'Stopped' },
  ]},
];

// Default: filters displayed inside component
<FilterSearchInput
  filters={filterFields}
  appliedFilters={appliedFilters}
  onFiltersChange={setAppliedFilters}
  placeholder="Search with filters..."
  size="sm"
/>

// With hideAppliedFilters: use with ListToolbar for external filter display
<FilterSearchInput
  filters={filterFields}
  appliedFilters={appliedFilters}
  onFiltersChange={setAppliedFilters}
  placeholder="Search with filters..."
  size="sm"
  hideAppliedFilters  // Filters shown in ListToolbar instead
/>`}
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
