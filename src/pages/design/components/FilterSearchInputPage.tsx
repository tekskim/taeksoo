import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { Label } from '../../design-system-sections/HelperComponents';
import { FilterSearchInput, Chip, VStack } from '@/design-system';
import type { FilterField, AppliedFilter } from '@/design-system';
import { IconSearch } from '@tabler/icons-react';

const SEARCH_INPUT_GUIDELINES = `## Overview

사용자가 리소스 목록 또는 데이터 집합을 빠르게 탐색하고 필터링할 수 있도록 하는 검색 입력 컴포넌트.
두 가지 방식의 검색을 지원한다.

- **Keyword Search**: 일반 텍스트 기반 검색. 사용자가 자유 형식으로 검색어를 입력하면 해당 키워드가 포함된 결과를 찾는다.
- **Filter Search**: 필터 키 기반 구조화된 검색. 사용자가 필터 키(속성)를 선택한 뒤 해당 키에 대한 값을 입력하거나 선택하여 정확한 조건으로 데이터를 좁혀간다.

완성된 필터는 검색 필드 아래에 Chip 형태로 표시되며 개별 필터를 제거하거나 전체 필터를 초기화할 수 있다.

---

## Composition

| 요소 | 설명 |
| --- | --- |
| Search field | 필터 조건 입력 영역 |
| Filter key dropdown | 필터 키 선택 메뉴 |
| Filter value input | 필터 값 입력 또는 선택 |
| Filter chips | 적용된 필터 목록 |
| Clear action | 전체 필터 초기화 |

---

## Variants

| Mode | 설명 |
| --- | --- |
| Keyword search | 텍스트 기반 검색 |
| Filter search | 필터 키 기반 검색 |

---

## States

| State | 설명 |
| --- | --- |
| Default | 기본 상태 |
| Focus | 입력 중 |
| Active | 필터 키 입력 완료 + 필터 값 입력 중 |

---

## Behavior

### 1) Filter Creation Flow
1. 검색 필드 클릭 또는 입력 → 필터 키 드롭다운 노출
2. 필터 키 선택 → 검색 필드에 키 정보가 chip형태로 노출
3. 필터값 입력 또는 선택 → Filter chips 영역에 새로운 필터(chip) 생성

### 2) Filter Value Input Types

| 유형 | 입력 방식 |
| --- | --- |
| text | Text input |
| enum | Select |
| boolean | Select |
| number | Text input |
| tag | Select |

### 3) Filter Chip

| 항목 | 내용 |
| --- | --- |
| 표시 형태 | Chip |
| Chip 표시 내용 | [키 + 값] |
| Chip 포함 요소 | 제거 버튼 |
| 생성 시점 | Enter 입력 또는 Value 선택 |

### 4) Chip Removal

| 동작 | 결과 |
| --- | --- |
| Chip ✕ 버튼 클릭 | 해당 필터 제거 |
| Clear 클릭 | 모든 필터 제거 |

### 5) Multiple Filters

| 조건 | 로직 |
| --- | --- |
| 같은 필터 키 | OR |
| 다른 필터 키 | AND |

### 6) Placeholder Policy
- Filter Search는 Label 대신 Placeholder를 사용한다.
- 표준 문구: "Search {resources} by attributes"

---

## Usage Guidelines

### Do ✅
- 필터 키 기반 검색을 제공한다
- 생성된 필터를 Chip으로 표시한다
- Clear action을 제공한다

### Don't ❌
- 필터 조건을 텍스트로만 표시하지 않는다
- 여러 필터를 하나의 문자열로 표현하지 않는다

---

## Related

| 이름 | 유형 | 이유 |
| --- | --- | --- |
| List page | Pattern | 필터 검색이 사용되는 대표적 사례 |
| Chip | Component | 필터 표시 |
| Table | Component | 필터 대상 |
`;

const filterSearchInputProps: PropDef[] = [
  {
    name: 'filters',
    type: 'FilterField[]',
    required: true,
    description: 'Available filter fields',
  },
  {
    name: 'appliedFilters',
    type: 'AppliedFilter[]',
    required: true,
    description: 'Currently applied filters',
  },
  {
    name: 'onFiltersChange',
    type: '(filters: AppliedFilter[]) => void',
    required: true,
    description: 'Filter change handler',
  },
  { name: 'placeholder', type: 'string', required: false, description: 'Search placeholder text' },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'sm'",
    required: false,
    description: 'Input size',
  },
  {
    name: 'hideAppliedFilters',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Hide applied filter chips',
  },
  { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' },
];

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
      description="사용자가 리소스 목록 또는 데이터 집합을 빠르게 탐색하고 필터링할 수 있도록 하는 검색 입력 컴포넌트. Keyword Search와 Filter Search 두 가지 방식의 검색을 지원한다."
      whenToUse={['리소스 목록 검색', '테이블 필터링', '설정 항목 검색']}
      whenNotToUse={['폼 입력 (→ Text input, Textarea)', '정해진 값 선택 (→ Select)']}
      preview={
        <ComponentPreview
          code={`<FilterSearchInput\n  filters={filterFields}\n  appliedFilters={appliedFilters}\n  onFiltersChange={setAppliedFilters}\n  placeholder="Search by attributes"\n/>`}
        >
          <FilterSearchInputDemo />
        </ComponentPreview>
      }
      usage={{
        code: `import { FilterSearchInput } from '@/design-system';\nimport type { FilterField, AppliedFilter } from '@/design-system';\n\nconst filterFields: FilterField[] = [\n  { id: 'name', label: 'Name', type: 'text', placeholder: 'Enter name...' },\n  { id: 'status', label: 'Status', type: 'select', options: [...] },\n];\n\nconst [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);\n\n<FilterSearchInput\n  filters={filterFields}\n  appliedFilters={appliedFilters}\n  onFiltersChange={setAppliedFilters}\n  placeholder="Search by attributes"\n/>`,
      }}
      examples={
        <VStack gap={8}>
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
                  <IconSearch
                    size={12}
                    strokeWidth={2}
                    className="text-[var(--color-text-subtle)]"
                  />
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

          <VStack gap={3}>
            <Label>Interactive demo</Label>
            <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
              Click the input below to see available filters. Select a filter, enter a value, and
              see it appear as a tag.
            </p>
            <FilterSearchInputDemo />
          </VStack>

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
      }
      guidelines={<NotionRenderer markdown={SEARCH_INPUT_GUIDELINES} />}
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>height: 32px (sm) / 36px (md)</code> · <code>padding: 8×12px</code> ·{' '}
          <code>radius: 6px</code> · <code>font: 12px</code> · <code>chip-gap: 4px</code>
        </div>
      }
      apiReference={filterSearchInputProps}
      accessibility={
        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
          <li>Tab: Move focus to input</li>
          <li>Enter: Apply search</li>
          <li>Filter chips: Keyboard removable</li>
        </ul>
      }
      relatedLinks={[
        { label: 'Chip', path: '/design/components/chip' },
        { label: 'Table', path: '/design/components/table' },
      ]}
    />
  );
}
