import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';
import { useState } from 'react';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Pagination 컴포넌트

테이블이나 목록의 페이지 네비게이션을 제공하는 컴포넌트입니다.

### 기능
- 현재 페이지 표시
- 이전/다음 페이지 이동
- 페이지 번호 직접 선택
- 총 항목 수 표시
- 선택된 항목 수 표시
- 설정 버튼 (페이지당 항목 수 변경 등)

### 페이지 범위 표시
- siblingCount: 현재 페이지 양옆에 표시할 페이지 수
- 페이지가 많으면 "..." (ellipsis) 표시

### 예시
\`\`\`tsx
import { Pagination } from '@thaki/tds';

// 기본 사용
<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => setPage(page)}
/>

// 총 항목 수 표시
<Pagination
  currentPage={page}
  totalPages={Math.ceil(items.length / 10)}
  totalItems={items.length}
  onPageChange={setPage}
/>

// 선택 항목 수 & 설정 버튼
<Pagination
  currentPage={page}
  totalPages={10}
  totalItems={100}
  selectedCount={5}
  showSettings
  onSettingsClick={() => openSettings()}
  onPageChange={setPage}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    currentPage: {
      control: 'number',
      description: '현재 페이지 (1부터 시작)',
      table: {
        type: { summary: 'number' },
      },
    },
    totalPages: {
      control: 'number',
      description: '전체 페이지 수',
      table: {
        type: { summary: 'number' },
      },
    },
    totalItems: {
      control: 'number',
      description: '전체 항목 수 (표시용)',
      table: {
        type: { summary: 'number' },
      },
    },
    selectedCount: {
      control: 'number',
      description: '선택된 항목 수',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    siblingCount: {
      control: 'number',
      description: '현재 페이지 양옆에 표시할 페이지 수',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '전체 비활성화',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showSettings: {
      control: 'boolean',
      description: '설정 버튼 표시',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// Basic
export const Default: Story = {
  render: function DefaultPagination() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  },
};

// With Total Items
export const WithTotalItems: Story = {
  render: function WithTotalItems() {
    const [page, setPage] = useState(1);
    return (
      <Pagination currentPage={page} totalPages={10} totalItems={100} onPageChange={setPage} />
    );
  },
};

// With Selection
export const WithSelection: Story = {
  render: function WithSelection() {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        currentPage={page}
        totalPages={10}
        totalItems={100}
        selectedCount={5}
        onPageChange={setPage}
      />
    );
  },
};

// With Settings Button
export const WithSettings: Story = {
  render: function WithSettings() {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        currentPage={page}
        totalPages={10}
        totalItems={100}
        showSettings
        onSettingsClick={() => alert('Settings clicked!')}
        onPageChange={setPage}
      />
    );
  },
};

// Many Pages
export const ManyPages: Story = {
  render: function ManyPages() {
    const [page, setPage] = useState(25);
    return (
      <Pagination currentPage={page} totalPages={100} totalItems={1000} onPageChange={setPage} />
    );
  },
};

// Few Pages
export const FewPages: Story = {
  render: function FewPages() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={3} totalItems={30} onPageChange={setPage} />;
  },
};

// First Page
export const FirstPage: Story = {
  render: function FirstPage() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  },
};

// Last Page
export const LastPage: Story = {
  render: function LastPage() {
    const [page, setPage] = useState(10);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  },
};

// Disabled
export const Disabled: Story = {
  render: () => <Pagination currentPage={5} totalPages={10} disabled onPageChange={() => {}} />,
};

// Full Example
export const FullExample: Story = {
  render: function FullExample() {
    const [page, setPage] = useState(5);
    const [selectedCount, setSelectedCount] = useState(3);

    return (
      <div className="flex flex-col gap-4">
        <Pagination
          currentPage={page}
          totalPages={20}
          totalItems={200}
          selectedCount={selectedCount}
          showSettings
          onSettingsClick={() => alert('Open settings')}
          onPageChange={setPage}
        />
        <div className="flex gap-4 text-sm">
          <button
            className="text-[var(--color-action-primary)]"
            onClick={() => setSelectedCount((s) => s + 1)}
          >
            Select more
          </button>
          <button
            className="text-[var(--color-action-primary)]"
            onClick={() => setSelectedCount(0)}
          >
            Clear selection
          </button>
        </div>
      </div>
    );
  },
};
