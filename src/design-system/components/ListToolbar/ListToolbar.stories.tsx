import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListToolbar } from './ListToolbar';
import { Button } from '../Button';
import { SearchInput } from '../Input';
import { IconDownload, IconTrash, IconPlus } from '@tabler/icons-react';

const meta: Meta<typeof ListToolbar> = {
  title: 'Components/ListToolbar',
  component: ListToolbar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
## ListToolbar 컴포넌트

리스트/테이블 상단에 배치되는 툴바 컴포넌트입니다.

### 구성 요소
- **ListToolbar**: 메인 컨테이너
- **ListToolbar.Actions**: 액션 버튼 그룹
- **ListToolbar.Divider**: 구분선
- **ListToolbar.Filters**: 필터 칩 영역

### 특징
- 검색, 다운로드 등 기본 액션
- 선택된 항목에 대한 일괄 액션
- 활성 필터 표시 및 제거

### 사용 시기
- 데이터 테이블 상단
- 리스트 페이지 액션 바
- 필터링 가능한 목록

### 예시
\`\`\`tsx
<ListToolbar
  primaryActions={
    <>
      <SearchInput placeholder="Search..." />
      <Button variant="secondary">Download</Button>
    </>
  }
  bulkActions={
    <Button variant="danger">Delete Selected</Button>
  }
  filters={[
    { id: '1', field: 'Status', value: 'Running' },
  ]}
  onFilterRemove={(id) => removeFilter(id)}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    showDivider: {
      control: 'boolean',
      description: '구분선 표시',
      table: { defaultValue: { summary: 'true' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ListToolbar>;

// Default
export const Default: Story = {
  render: () => (
    <ListToolbar
      primaryActions={
        <ListToolbar.Actions>
          <SearchInput placeholder="Search instances..." size="sm" />
          <Button variant="secondary" size="sm" leftIcon={<IconDownload size={14} />}>
            Download
          </Button>
        </ListToolbar.Actions>
      }
    />
  ),
};

// With Bulk Actions
export const WithBulkActions: Story = {
  render: () => (
    <ListToolbar
      primaryActions={
        <ListToolbar.Actions>
          <SearchInput placeholder="Search..." size="sm" />
        </ListToolbar.Actions>
      }
      bulkActions={
        <ListToolbar.Actions>
          <Button variant="danger" size="sm" leftIcon={<IconTrash size={14} />}>
            Delete (3)
          </Button>
        </ListToolbar.Actions>
      }
    />
  ),
};

// With Filters
export const WithFilters: Story = {
  render: () => (
    <ListToolbar
      primaryActions={
        <ListToolbar.Actions>
          <SearchInput placeholder="Search..." size="sm" />
        </ListToolbar.Actions>
      }
      filters={[
        { id: '1', field: 'Status', value: 'Running' },
        { id: '2', field: 'Type', value: 'm5.large' },
        { id: '3', field: 'Region', value: 'us-east-1' },
      ]}
      onFilterRemove={(id) => console.log('Remove filter:', id)}
      onFiltersClear={() => console.log('Clear all filters')}
    />
  ),
};

// Full Featured
export const FullFeatured: Story = {
  render: () => (
    <ListToolbar
      primaryActions={
        <ListToolbar.Actions>
          <SearchInput placeholder="Search instances..." size="sm" />
          <Button variant="secondary" size="sm" leftIcon={<IconDownload size={14} />}>
            Export
          </Button>
          <Button variant="primary" size="sm" leftIcon={<IconPlus size={14} />}>
            Create
          </Button>
        </ListToolbar.Actions>
      }
      bulkActions={
        <ListToolbar.Actions>
          <Button variant="secondary" size="sm">
            Stop (2)
          </Button>
          <Button variant="danger" size="sm" leftIcon={<IconTrash size={14} />}>
            Delete (2)
          </Button>
        </ListToolbar.Actions>
      }
      filters={[
        { id: '1', field: 'Status', value: 'Running' },
        { id: '2', field: 'Type', value: 'm5.large' },
      ]}
      onFilterRemove={(id) => console.log('Remove:', id)}
      onFiltersClear={() => console.log('Clear all')}
    />
  ),
};

// Without Divider
export const WithoutDivider: Story = {
  render: () => (
    <ListToolbar
      showDivider={false}
      primaryActions={
        <ListToolbar.Actions>
          <SearchInput placeholder="Search..." size="sm" />
        </ListToolbar.Actions>
      }
      bulkActions={
        <ListToolbar.Actions>
          <Button variant="secondary" size="sm">
            Action
          </Button>
        </ListToolbar.Actions>
      }
    />
  ),
};

// Filters Only
export const FiltersOnly: Story = {
  render: () => (
    <ListToolbar
      filters={[
        { id: '1', field: 'Environment', value: 'Production' },
        { id: '2', field: 'Owner', value: 'admin@example.com' },
        { id: '3', field: 'Created', value: 'Last 7 days' },
      ]}
      onFilterRemove={(id) => console.log('Remove:', id)}
      onFiltersClear={() => console.log('Clear all')}
      clearFiltersLabel="Reset All"
    />
  ),
};

// Custom Children
export const CustomChildren: Story = {
  render: () => (
    <ListToolbar>
      <div className="flex items-center justify-between w-full">
        <SearchInput placeholder="Search..." size="sm" />
        <div className="flex items-center gap-[var(--primitive-spacing-2)]">
          <span className="text-body-md text-[var(--color-text-muted)]">Showing 1-10 of 100</span>
          <Button variant="primary" size="sm">
            Create New
          </Button>
        </div>
      </div>
    </ListToolbar>
  ),
};
