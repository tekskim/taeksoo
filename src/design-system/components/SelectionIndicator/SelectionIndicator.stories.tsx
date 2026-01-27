import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectionIndicator } from './SelectionIndicator';
import { Button } from '../Button';

const meta: Meta<typeof SelectionIndicator> = {
  title: 'Components/SelectionIndicator',
  component: SelectionIndicator,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
## SelectionIndicator 컴포넌트

선택된 항목들을 표시하는 인디케이터 컴포넌트입니다.

### 특징
- 선택된 항목을 칩으로 표시
- 개별 항목 제거 기능
- 빈 상태 및 에러 상태 표시
- 우측 커스텀 콘텐츠 영역

### Props
- **selectedItems**: 선택된 항목 배열 \`{id, label}[]\`
- **onRemove**: 항목 제거 콜백
- **emptyText**: 빈 상태 텍스트
- **error**: 에러 상태
- **errorMessage**: 에러 메시지
- **rightContent**: 우측 콘텐츠

### 사용 시기
- 다중 선택 폼
- 필터 선택 표시
- 태그 선택기

### 예시
\`\`\`tsx
<SelectionIndicator
  selectedItems={[
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
  ]}
  onRemove={(id) => handleRemove(id)}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    removable: {
      control: 'boolean',
      description: '항목 제거 가능 여부',
      table: { defaultValue: { summary: 'true' } },
    },
    error: {
      control: 'boolean',
      description: '에러 상태',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SelectionIndicator>;

// Default (Empty)
export const Default: Story = {
  args: {
    selectedItems: [],
    emptyText: 'No items selected',
  },
};

// With Selected Items
export const WithSelectedItems: Story = {
  args: {
    selectedItems: [
      { id: '1', label: 'web-server-01' },
      { id: '2', label: 'api-server-02' },
      { id: '3', label: 'db-server-03' },
    ],
    onRemove: (id) => console.log('Remove:', id),
  },
};

// Single Selection
export const SingleSelection: Story = {
  args: {
    selectedItems: [{ id: '1', label: 'production-cluster' }],
    onRemove: (id) => console.log('Remove:', id),
  },
};

// Non-removable
export const NonRemovable: Story = {
  args: {
    selectedItems: [
      { id: '1', label: 'Fixed Item 1' },
      { id: '2', label: 'Fixed Item 2' },
    ],
    removable: false,
  },
};

// Error State
export const ErrorState: Story = {
  args: {
    selectedItems: [],
    error: true,
    errorMessage: 'Please select at least one item',
  },
};

// With Right Content
export const WithRightContent: Story = {
  args: {
    selectedItems: [
      { id: '1', label: 'Instance 1' },
      { id: '2', label: 'Instance 2' },
    ],
    onRemove: (id) => console.log('Remove:', id),
    rightContent: (
      <Button variant="secondary" size="sm">
        Clear All
      </Button>
    ),
  },
};

// Many Items
export const ManyItems: Story = {
  args: {
    selectedItems: [
      { id: '1', label: 'server-alpha' },
      { id: '2', label: 'server-beta' },
      { id: '3', label: 'server-gamma' },
      { id: '4', label: 'server-delta' },
      { id: '5', label: 'server-epsilon' },
      { id: '6', label: 'server-zeta' },
    ],
    onRemove: (id) => console.log('Remove:', id),
  },
};

// Custom Empty Text
export const CustomEmptyText: Story = {
  args: {
    selectedItems: [],
    emptyText: 'Click on items to select them',
  },
};

// In Form Context
export const InFormContext: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[var(--color-text-default)]">
        Selected Instances
      </label>
      <SelectionIndicator
        selectedItems={[
          { id: '1', label: 'prod-web-01' },
          { id: '2', label: 'prod-web-02' },
        ]}
        onRemove={(id) => console.log('Remove:', id)}
        rightContent={<span className="text-xs text-[var(--color-text-muted)]">2 selected</span>}
      />
    </div>
  ),
};

// Error with Right Content
export const ErrorWithRightContent: Story = {
  args: {
    selectedItems: [],
    error: true,
    errorMessage: 'Selection required',
    rightContent: (
      <Button variant="secondary" size="sm">
        Browse
      </Button>
    ),
  },
};
