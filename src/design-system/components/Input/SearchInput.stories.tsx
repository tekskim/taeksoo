import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchInput } from './SearchInput';

/**
 * # SearchInput
 *
 * 검색 전용 입력 컴포넌트입니다. 오른쪽에 검색 아이콘이 고정되며, 값이 있을 때 클리어 버튼이 표시됩니다.
 *
 * ## 언제 사용하나요?
 * - 리스트 페이지에서 간단한 텍스트 검색이 필요할 때
 * - 필터 없이 단순 키워드 검색만 필요할 때
 * - FilterSearchInput의 복잡한 필터가 불필요한 경우
 *
 * ## 기능
 * - **검색 아이콘**: 오른쪽에 항상 표시
 * - **클리어 버튼**: 값이 있을 때 자동 표시 (`clearable` prop)
 * - **Controlled/Uncontrolled**: 두 가지 모드 지원
 * - **Label**: 옵션으로 라벨 표시 가능
 *
 * ## 접근성
 * - `type="search"` 네이티브 시맨틱
 * - `aria-label` 자동 적용 (label prop 또는 기본값 "Search")
 * - 클리어 버튼에 `aria-label="Clear search"` 적용
 */
const meta = {
  title: 'Components/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '검색 전용 입력 컴포넌트입니다. 검색 아이콘과 클리어 버튼을 포함합니다.',
      },
    },
  },
  tags: ['autodocs'],
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
    label: {
      control: 'text',
      description: '라벨 텍스트',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    fullWidth: {
      control: 'boolean',
      description: '부모 너비에 맞춤',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    clearable: {
      control: 'boolean',
      description: '클리어 버튼 표시 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ----------------------------------------
   Basic Examples
   ---------------------------------------- */

export const Default: Story = {
  args: {
    placeholder: 'Search...',
  },
};

export const WithLabel: Story = {
  name: 'With Label',
  args: {
    label: 'Search',
    placeholder: 'Search resources...',
  },
};

export const WithDefaultValue: Story = {
  name: 'With Default Value',
  args: {
    placeholder: 'Search...',
    defaultValue: 'nginx-deployment',
  },
};

/* ----------------------------------------
   Sizes
   ---------------------------------------- */

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-full">
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
          Small
        </p>
        <SearchInput size="sm" placeholder="Search..." />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
          Medium (default)
        </p>
        <SearchInput size="md" placeholder="Search..." />
      </div>
    </div>
  ),
};

/* ----------------------------------------
   States
   ---------------------------------------- */

export const Disabled: Story = {
  args: {
    placeholder: 'Search...',
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  name: 'Disabled with Value',
  args: {
    placeholder: 'Search...',
    defaultValue: 'read-only-query',
    disabled: true,
  },
};

export const NotClearable: Story = {
  name: 'Not Clearable',
  args: {
    placeholder: 'Search (no clear button)...',
    defaultValue: 'some-value',
    clearable: false,
  },
};

/* ----------------------------------------
   Controlled Example
   ---------------------------------------- */

export const Controlled: Story = {
  render: function ControlledExample() {
    const [value, setValue] = useState('');

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-3)] w-full">
        <SearchInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue('')}
          placeholder="Type to search..."
        />
        {value && (
          <p className="text-body-sm text-[var(--color-text-subtle)]">
            검색어: &quot;{value}&quot;
          </p>
        )}
      </div>
    );
  },
};

/* ----------------------------------------
   Use Cases
   ---------------------------------------- */

export const ResourceSearch: Story = {
  name: 'Use Case — Resource Search',
  render: function ResourceSearchExample() {
    const [value, setValue] = useState('');
    const resources = [
      'nginx-deployment-01',
      'nginx-deployment-02',
      'redis-master',
      'redis-slave',
      'postgres-primary',
    ];
    const filtered = resources.filter((r) => r.toLowerCase().includes(value.toLowerCase()));

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-3)] w-full">
        <SearchInput
          size="sm"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue('')}
          placeholder="Search resources..."
        />
        <ul className="flex flex-col gap-[var(--primitive-spacing-1)]">
          {filtered.map((r) => (
            <li
              key={r}
              className="text-body-md text-[var(--color-text-default)] px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]"
            >
              {r}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="text-body-sm text-[var(--color-text-subtle)] px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)]">
              No results found
            </li>
          )}
        </ul>
      </div>
    );
  },
};

export const CustomWidth: Story = {
  name: 'Custom Width',
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-3)] w-full">
      <SearchInput placeholder="w-[200px]" className="w-[200px]" />
      <SearchInput placeholder="fullWidth" fullWidth />
    </div>
  ),
};
