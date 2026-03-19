import type { Meta, StoryObj } from '@storybook/react';
import type { FilterKey } from './FilterSearch.types';
import {
  FilterSearchInput,
  FilterSearchResults,
  useFilterSearch,
} from './index';

const meta = {
  title: 'Form/FilterSearch',
  component: FilterSearchInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## 컴포넌트 구조

FilterSearch는 분리된 컴포넌트 조합으로 사용합니다:

\`\`\`tsx
const { filters, addFilter, removeFilter, clearFilters } = useFilterSearch();

// 검색창은 상단에
<FilterSearchInput
  filterKeys={FILTER_KEYS}
  onFilterAdd={addFilter}
/>

// 결과는 별도 위치에 (예: 테이블 위)
<FilterSearchResults
  filters={filters}
  onRemoveFilter={removeFilter}
  onClearAll={clearFilters}
/>
\`\`\`
검색창과 결과를 화면의 다른 위치에 배치할 때 사용

## 필터 타입 (Filter Types)
- **input**: 텍스트 입력 필터 (예: 이름, 이메일)
- **number**: 숫자 입력 필터 (예: 나이, 수량)
- **select**: 드롭다운 선택 필터 (예: 상태, 역할)
- **dateRange**: 날짜 범위 선택 필터 (예: 생성일, 수정일)

## 주요 기능
- **다중 필터**: 여러 필터를 동시에 적용 가능
- **타입별 입력**: 텍스트/숫자/선택/날짜 범위 등 다양한 입력 방식
- **필터 태그**: 적용된 필터를 시각적으로 표시하고 개별 제거 가능
- **빠른 검색**: Enter 키로 기본 필터(name) 즉시 적용
- **API 변환**: 선택된 필터를 API 파라미터 형식으로 자동 변환
- **키보드 탐색**: Enter/Escape/Backspace 키 지원

## 접근성
- **키보드 지원**: Tab/Enter/Escape/Backspace 키 지원
- **시각적 피드백**: 입력 모드와 필터 타입을 명확히 표시
- **포커스 관리**: 필터 추가/제거 시 자동 포커스 이동
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterSearchInput>;

export default meta;
type Story = Partial<StoryObj<typeof meta>>;

// 필터 키 정의
const FILTER_KEYS: FilterKey[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'input',
    placeholder: 'Custom placeholder',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'input',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
      { value: 'suspended', label: 'Suspended' },
    ],
  },
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'admin', label: 'Administrator' },
      { value: 'user', label: 'User' },
      { value: 'guest', label: 'Guest' },
    ],
  },
  {
    key: 'age',
    label: 'Age',
    type: 'number',
  },
  {
    key: 'createdAt',
    label: 'Created At',
    type: 'dateRange',
  },
  {
    key: 'updatedAt',
    label: 'Updated At',
    type: 'dateRange',
  },
];

// 분리된 컴포넌트 사용 (검색창과 결과 분리)
const SeparatedComponent = () => {
  const { filters, appliedFilters, addFilter, removeFilter, clearFilters } =
    useFilterSearch(newFilters => {
      console.log('Filters changed:', newFilters);
    });

  return (
    <div style={{ maxWidth: '800px' }}>
      {/* Action Bar 영역 - 검색창 */}
      <div
        style={{
          padding: '12px',
          background: 'var(--semantic-color-surface)',
          borderRadius: '6px',
          border: '1px solid var(--semantic-color-border)',
          marginBottom: '16px',
        }}
      >
        <h4
          style={{
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '8px',
            color: 'var(--semantic-color-textMuted)',
          }}
        >
          Action Bar
        </h4>
        <FilterSearchInput
          filterKeys={FILTER_KEYS}
          placeholder="Search users with filters"
          onFilterAdd={addFilter}
        />
      </div>

      {/* Filter Bar 영역 - 필터 결과 */}
      <div style={{ marginBottom: '16px' }}>
        <h4
          style={{
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '8px',
            color: 'var(--semantic-color-textMuted)',
          }}
        >
          Filter Bar
        </h4>
        <FilterSearchResults
          filters={filters}
          onRemoveFilter={removeFilter}
          onClearAll={clearFilters}
        />
      </div>

      {/* Table/List 영역 (예시) */}
      <div
        style={{
          padding: '16px',
          background: 'var(--semantic-color-surfaceMuted)',
          borderRadius: '6px',
          border: '1px solid var(--semantic-color-border)',
        }}
      >
        <h4
          style={{
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '8px',
            color: 'var(--semantic-color-textMuted)',
          }}
        >
          Table/List (filtered data would be here)
        </h4>
        <pre
          style={{
            fontSize: '12px',
            background: 'var(--semantic-color-surface)',
            padding: '12px',
            borderRadius: '4px',
            overflow: 'auto',
            margin: 0,
          }}
        >
          {JSON.stringify(appliedFilters, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export const Separated: Story = {
  render: () => <SeparatedComponent />,
};
