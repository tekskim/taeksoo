import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterSearchInput } from './FilterSearchInput';
import type { AppliedFilter, FilterField } from './FilterSearchInput';
import { useState } from 'react';

const sampleFilters: FilterField[] = [
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'error', label: 'Error' },
      { value: 'building', label: 'Building' },
    ],
  },
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter instance name...',
  },
  {
    id: 'namespace',
    label: 'Namespace',
    type: 'select',
    options: [
      { value: 'default', label: 'default' },
      { value: 'kube-system', label: 'kube-system' },
      { value: 'production', label: 'production' },
      { value: 'staging', label: 'staging' },
    ],
  },
  {
    id: 'label',
    label: 'Label',
    type: 'text',
    placeholder: 'e.g. app=nginx',
  },
];

const meta: Meta<typeof FilterSearchInput> = {
  title: 'Components/FilterSearchInput',
  component: FilterSearchInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## FilterSearchInput 컴포넌트

필터 기반 검색을 위한 입력 컴포넌트입니다. 리스트 페이지의 ListToolbar에서 주로 사용됩니다.

### 사용 시기
- 리스트 페이지에서 다중 속성으로 필터링할 때
- 검색 + 필터를 하나의 입력 필드로 통합할 때

### 주요 기능
- **필터 드롭다운**: 클릭 시 사용 가능한 필터 목록 표시
- **텍스트 필터**: 자유 텍스트 입력
- **셀렉트 필터**: 미리 정의된 옵션에서 선택
- **적용된 필터 표시**: Chip 형태로 표시, 개별/전체 삭제 가능

### 예시
\`\`\`tsx
import { FilterSearchInput } from '@thaki/tds';
import type { FilterField, AppliedFilter } from '@thaki/tds';

const filters: FilterField[] = [
  { id: 'status', label: 'Status', type: 'select', options: [...] },
  { id: 'name', label: 'Name', type: 'text' },
];

<FilterSearchInput
  filters={filters}
  appliedFilters={appliedFilters}
  onFiltersChange={setAppliedFilters}
  placeholder="Search by attributes"
  size="sm"
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: '입력 필드 크기',
      table: {
        type: { summary: '"sm" | "md"' },
        defaultValue: { summary: '"md"' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: '부모 컨테이너 너비에 맞춤',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hideAppliedFilters: {
      control: 'boolean',
      description: '적용된 필터 표시 숨김 (외부에서 별도 렌더링 시)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterSearchInput>;

// Basic — no filters, simple search
export const Default: Story = {
  args: {
    placeholder: 'Search...',
  },
};

// With Filters
export const WithFilters: Story = {
  render: function WithFiltersExample() {
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

    return (
      <div className="w-[400px]">
        <FilterSearchInput
          filters={sampleFilters}
          appliedFilters={appliedFilters}
          onFiltersChange={setAppliedFilters}
          placeholder="Search by attributes"
          size="sm"
        />
      </div>
    );
  },
};

// With Pre-applied Filters
export const WithAppliedFilters: Story = {
  render: function WithAppliedFiltersExample() {
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([
      {
        id: 'status-1',
        fieldId: 'status',
        fieldLabel: 'Status',
        value: 'active',
        valueLabel: 'Active',
      },
      {
        id: 'namespace-1',
        fieldId: 'namespace',
        fieldLabel: 'Namespace',
        value: 'production',
        valueLabel: 'production',
      },
    ]);

    return (
      <div className="w-[500px]">
        <FilterSearchInput
          filters={sampleFilters}
          appliedFilters={appliedFilters}
          onFiltersChange={setAppliedFilters}
          placeholder="Search by attributes"
          size="sm"
        />
      </div>
    );
  },
};

// Sizes
export const Sizes: Story = {
  render: function SizesExample() {
    const [filters1, setFilters1] = useState<AppliedFilter[]>([]);
    const [filters2, setFilters2] = useState<AppliedFilter[]>([]);

    return (
      <div className="flex flex-col gap-4 w-[400px]">
        <div>
          <p className="text-label-sm text-[var(--color-text-muted)] mb-2">Small</p>
          <FilterSearchInput
            filters={sampleFilters}
            appliedFilters={filters1}
            onFiltersChange={setFilters1}
            placeholder="Search by attributes"
            size="sm"
          />
        </div>
        <div>
          <p className="text-label-sm text-[var(--color-text-muted)] mb-2">Medium</p>
          <FilterSearchInput
            filters={sampleFilters}
            appliedFilters={filters2}
            onFiltersChange={setFilters2}
            placeholder="Search by attributes"
            size="md"
          />
        </div>
      </div>
    );
  },
};

// Hidden Applied Filters (for external rendering)
export const HiddenAppliedFilters: Story = {
  render: function HiddenFiltersExample() {
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([
      {
        id: 'status-1',
        fieldId: 'status',
        fieldLabel: 'Status',
        value: 'active',
        valueLabel: 'Active',
      },
    ]);

    return (
      <div className="w-[400px]">
        <p className="text-body-sm text-[var(--color-text-muted)] mb-2">
          hideAppliedFilters=true — 필터 칩이 입력 아래에 표시되지 않음 (ListToolbar에서 별도
          렌더링)
        </p>
        <FilterSearchInput
          filters={sampleFilters}
          appliedFilters={appliedFilters}
          onFiltersChange={setAppliedFilters}
          placeholder="Search by attributes"
          size="sm"
          hideAppliedFilters
        />
      </div>
    );
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    filters: sampleFilters,
    placeholder: 'Search by attributes',
    disabled: true,
  },
};

// Simple Search (no filter fields)
export const SimpleSearch: Story = {
  render: function SimpleSearchExample() {
    const [searchValue, setSearchValue] = useState('');

    return (
      <div className="w-[320px]">
        <p className="text-body-sm text-[var(--color-text-muted)] mb-2">
          필터 없이 단순 검색만 사용하는 경우
        </p>
        <FilterSearchInput
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          placeholder="Search..."
          size="sm"
        />
        {searchValue && (
          <p className="text-body-sm text-[var(--color-text-subtle)] mt-2">
            검색어: &quot;{searchValue}&quot;
          </p>
        )}
      </div>
    );
  },
};
