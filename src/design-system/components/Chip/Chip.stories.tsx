import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './Chip';
import { useState } from 'react';
import { IconTag, IconUser, IconCalendar, IconMapPin } from '@tabler/icons-react';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Chip 컴포넌트

필터, 태그, 선택된 옵션 등을 표시하는 인터랙티브 컴포넌트입니다.

### Badge vs Chip
| | Badge | Chip |
|---|---|---|
| **상호작용** | 표시만 | 삭제/선택 가능 |
| **사용 시점** | 상태 표시 | 필터, 태그 입력 |
| **크기** | 작음 | 중간 |

### 사용 시기
- 필터 조건 표시 및 제거
- 태그 입력/관리
- 선택된 옵션 표시
- 키-값 쌍 표시

### 구조
- **label**: 카테고리/키 (선택)
- **value**: 실제 값 (필수)
- **icon**: 아이콘 (선택)
- **onRemove**: 삭제 버튼 (선택)

### 예시
\`\`\`tsx
import { Chip } from '@thaki/tds';

// 기본 사용
<Chip value="Tag" />

// 라벨 + 값
<Chip label="Status" value="Active" />

// 삭제 가능
<Chip 
  value="Filter" 
  onRemove={() => handleRemove()} 
/>

// 아이콘 포함
<Chip 
  label="User" 
  value="John" 
  icon={<IconUser />} 
  onRemove={() => {}}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: '카테고리/키 라벨 (선택)',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      description: '표시할 값 (필수)',
      table: {
        type: { summary: 'string' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'selected'],
      description: '칩 스타일 변형',
      table: {
        type: { summary: '"default" | "selected"' },
        defaultValue: { summary: '"default"' },
      },
    },
    icon: {
      description: '값 앞에 표시할 아이콘',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    onRemove: {
      description: '삭제 버튼 클릭 콜백 (제공 시 X 버튼 표시)',
      table: {
        type: { summary: '() => void' },
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
    maxWidth: {
      control: 'text',
      description: '최대 너비 (초과 시 말줄임)',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    value: 'Value',
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

// Basic Chip
export const Default: Story = {
  args: {
    value: 'Chip',
  },
};

// With Label
export const WithLabel: Story = {
  args: {
    label: 'Status',
    value: 'Active',
  },
};

// With Icon
export const WithIcon: Story = {
  args: {
    value: 'Tag',
    icon: <IconTag size={12} />,
  },
};

// With Label and Icon
export const WithLabelAndIcon: Story = {
  args: {
    label: 'Assignee',
    value: 'John Doe',
    icon: <IconUser size={12} />,
  },
};

// Removable
export const Removable: Story = {
  render: function RemovableChip() {
    const [visible, setVisible] = useState(true);

    if (!visible) {
      return (
        <button
          className="text-sm text-[var(--color-action-primary)]"
          onClick={() => setVisible(true)}
        >
          Reset chip
        </button>
      );
    }

    return <Chip value="Removable" onRemove={() => setVisible(false)} />;
  },
};

// Removable with Label
export const RemovableWithLabel: Story = {
  render: function RemovableChipWithLabel() {
    const [chips, setChips] = useState([
      { id: '1', label: 'Status', value: 'Active' },
      { id: '2', label: 'Region', value: 'US East' },
      { id: '3', label: 'Type', value: 'Production' },
    ]);

    const handleRemove = (id: string) => {
      setChips(chips.filter((chip) => chip.id !== id));
    };

    return (
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <Chip
            key={chip.id}
            label={chip.label}
            value={chip.value}
            onRemove={() => handleRemove(chip.id)}
          />
        ))}
        {chips.length === 0 && (
          <span className="text-sm text-[var(--color-text-muted)]">All chips removed</span>
        )}
      </div>
    );
  },
};

// Selected Variant
export const Selected: Story = {
  args: {
    label: 'Filter',
    value: 'Selected',
    variant: 'selected',
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    value: 'Disabled',
    disabled: true,
    onRemove: () => {},
  },
};

// With Truncation
export const Truncated: Story = {
  args: {
    label: 'Description',
    value: 'This is a very long value that should be truncated',
    maxWidth: '200px',
    onRemove: () => {},
  },
};

// Filter Tags Example
export const FilterTags: Story = {
  render: function FilterTagsExample() {
    const [filters, setFilters] = useState([
      { id: '1', label: 'Status', value: 'Running', icon: <IconTag size={12} /> },
      { id: '2', label: 'User', value: 'john@example.com', icon: <IconUser size={12} /> },
      { id: '3', label: 'Date', value: '2024-01-15', icon: <IconCalendar size={12} /> },
      { id: '4', label: 'Region', value: 'US East', icon: <IconMapPin size={12} /> },
    ]);

    const handleRemove = (id: string) => {
      setFilters(filters.filter((f) => f.id !== id));
    };

    const handleClearAll = () => {
      setFilters([]);
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              value={filter.value}
              icon={filter.icon}
              onRemove={() => handleRemove(filter.id)}
            />
          ))}
          {filters.length > 0 && (
            <button
              className="text-xs text-[var(--color-action-primary)] hover:underline"
              onClick={handleClearAll}
            >
              Clear all
            </button>
          )}
        </div>
        {filters.length === 0 && (
          <p className="text-sm text-[var(--color-text-muted)]">No active filters</p>
        )}
      </div>
    );
  },
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium mb-2">Default</p>
        <div className="flex flex-wrap gap-2">
          <Chip value="Basic" />
          <Chip label="Status" value="Active" />
          <Chip value="With Icon" icon={<IconTag size={12} />} />
          <Chip label="Label" value="Removable" onRemove={() => {}} />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Selected</p>
        <div className="flex flex-wrap gap-2">
          <Chip value="Basic" variant="selected" />
          <Chip label="Status" value="Active" variant="selected" />
          <Chip value="With Icon" icon={<IconTag size={12} />} variant="selected" />
          <Chip label="Label" value="Removable" variant="selected" onRemove={() => {}} />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Disabled</p>
        <div className="flex flex-wrap gap-2">
          <Chip value="Disabled" disabled />
          <Chip label="Status" value="Active" disabled />
          <Chip value="With Remove" disabled onRemove={() => {}} />
        </div>
      </div>
    </div>
  ),
};

// Use Case: Tag Input
export const TagInput: Story = {
  render: function TagInputExample() {
    const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind']);
    const [input, setInput] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && input.trim()) {
        e.preventDefault();
        if (!tags.includes(input.trim())) {
          setTags([...tags, input.trim()]);
        }
        setInput('');
      }
    };

    const handleRemove = (tag: string) => {
      setTags(tags.filter((t) => t !== tag));
    };

    return (
      <div className="w-[400px]">
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 p-2 border border-[var(--color-border-default)] rounded min-h-[80px]">
          {tags.map((tag) => (
            <Chip key={tag} value={tag} onRemove={() => handleRemove(tag)} />
          ))}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add tag..."
            className="flex-1 min-w-[100px] outline-none bg-transparent text-sm"
          />
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">Press Enter to add a tag</p>
      </div>
    );
  },
};
