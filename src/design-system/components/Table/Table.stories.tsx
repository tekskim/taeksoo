import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, type TableColumn } from './Table';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { useState } from 'react';
import { IconEdit, IconTrash, IconDotsVertical } from '@tabler/icons-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: 'Jan 15, 2024',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    status: 'active',
    createdAt: 'Jan 20, 2024',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'Viewer',
    status: 'inactive',
    createdAt: 'Feb 1, 2024',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'Editor',
    status: 'pending',
    createdAt: 'Feb 10, 2024',
  },
  {
    id: '5',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    role: 'Viewer',
    status: 'active',
    createdAt: 'Feb 15, 2024',
  },
];

const basicColumns: TableColumn<User>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
];

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Table 컴포넌트

데이터를 행과 열로 표시하는 테이블 컴포넌트입니다.

### 기능
- **정렬**: 컬럼별 오름차순/내림차순 정렬
- **선택**: 단일/다중 행 선택
- **커스텀 렌더링**: 셀 내용 커스터마이징
- **스크롤**: 고정 헤더 + 본문 스크롤

### 사용 시기
- 데이터 목록 표시
- CRUD 작업 인터페이스
- 대시보드 데이터 테이블

### 접근성
- 표준 HTML table 구조 사용
- 정렬 버튼에 aria-sort 적용
- 선택 체크박스 레이블 자동 생성

### 예시
\`\`\`tsx
import { Table } from '@thaki/tds';

const columns = [
  { key: 'name', label: '이름', sortable: true },
  { key: 'email', label: '이메일' },
  { 
    key: 'status', 
    label: '상태',
    render: (value) => <Badge>{value}</Badge>
  },
];

const data = [
  { id: '1', name: '홍길동', email: 'hong@example.com', status: 'active' },
];

<Table 
  columns={columns} 
  data={data} 
  rowKey="id"
  selectable
  selectedKeys={selected}
  onSelectionChange={setSelected}
/>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

// Basic Table
export const Default: Story = {
  render: () => <Table columns={basicColumns} data={sampleUsers} rowKey="id" />,
};

// With Custom Cell Rendering
export const WithCustomRendering: Story = {
  render: () => {
    const columns: TableColumn<User>[] = [
      { key: 'name', label: 'Name', width: '180px' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role', width: '100px' },
      {
        key: 'status',
        label: 'Status',
        width: '100px',
        align: 'center',
        render: (value) => {
          const statusConfig = {
            active: { theme: 'green' as const, label: 'Active' },
            inactive: { theme: 'gray' as const, label: 'Inactive' },
            pending: { theme: 'yellow' as const, label: 'Pending' },
          };
          const config = statusConfig[value as keyof typeof statusConfig];
          return (
            <Badge theme={config.theme} type="subtle" size="sm">
              {config.label}
            </Badge>
          );
        },
      },
    ];

    return <Table columns={columns} data={sampleUsers} rowKey="id" />;
  },
};

// Selectable Table
export const Selectable: Story = {
  render: function SelectableTable() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <Table
          columns={basicColumns}
          data={sampleUsers}
          rowKey="id"
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        />
        <p className="text-body-md text-[var(--color-text-muted)]">
          Selected: {selectedKeys.length > 0 ? selectedKeys.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

// Sortable Columns
export const Sortable: Story = {
  render: () => {
    const sortableColumns: TableColumn<User>[] = [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'role', label: 'Role', sortable: true },
      { key: 'createdAt', label: 'Created at', sortable: true, width: '120px' },
    ];

    return <Table columns={sortableColumns} data={sampleUsers} rowKey="id" />;
  },
};

// With Actions Column
export const WithActions: Story = {
  render: () => {
    const columnsWithActions: TableColumn<User>[] = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role', width: '100px' },
      {
        key: 'actions',
        label: '',
        width: '100px',
        align: 'center',
        render: (_value, row) => (
          <div className="flex items-center justify-end gap-[var(--primitive-spacing-1)]">
            <Button
              variant="ghost"
              size="sm"
              icon={<IconEdit size={12} />}
              aria-label={`Edit ${row.name}`}
            />
            <Button
              variant="ghost"
              size="sm"
              icon={<IconTrash size={12} />}
              aria-label={`Delete ${row.name}`}
            />
          </div>
        ),
      },
    ];

    return <Table columns={columnsWithActions} data={sampleUsers} rowKey="id" />;
  },
};

// Row Click Handler
export const RowClickable: Story = {
  render: () => {
    const handleRowClick = (row: User) => {
      alert(`Clicked on: ${row.name}`);
    };

    return (
      <Table columns={basicColumns} data={sampleUsers} rowKey="id" onRowClick={handleRowClick} />
    );
  },
};

// Empty State
export const Empty: Story = {
  render: () => (
    <Table
      columns={basicColumns}
      data={[]}
      rowKey="id"
      emptyMessage="No users found. Create your first user to get started."
    />
  ),
};

// With Max Height (Scrollable)
export const Scrollable: Story = {
  render: () => {
    const manyUsers = Array.from({ length: 20 }, (_, i) => ({
      id: String(i + 1),
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'Editor' : 'Viewer',
      status: (i % 3 === 0 ? 'active' : i % 3 === 1 ? 'inactive' : 'pending') as User['status'],
      createdAt: 'Jan 1, 2024',
    }));

    return (
      <Table columns={basicColumns} data={manyUsers} rowKey="id" maxHeight="300px" stickyHeader />
    );
  },
};

// Column Alignment
export const ColumnAlignment: Story = {
  render: () => {
    const alignedColumns: TableColumn<User>[] = [
      { key: 'name', label: 'Name (Left)', align: 'left' },
      { key: 'email', label: 'Email (Center)', align: 'center' },
      { key: 'role', label: 'Role (Right)', align: 'center' },
    ];

    return <Table columns={alignedColumns} data={sampleUsers} rowKey="id" />;
  },
};

// Complex Example
export const ComplexExample: Story = {
  render: function ComplexTable() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    const complexColumns: TableColumn<User>[] = [
      {
        key: 'name',
        label: 'User',
        width: '200px',
        sortable: true,
        render: (value, row) => (
          <div className="flex flex-col">
            <span className="text-label-lg">{value}</span>
            <span className="text-body-sm text-[var(--color-text-muted)]">{row.email}</span>
          </div>
        ),
      },
      { key: 'role', label: 'Role', width: '100px', sortable: true },
      {
        key: 'status',
        label: 'Status',
        width: '100px',
        align: 'center',
        render: (value) => {
          const config = {
            active: { theme: 'green' as const, label: 'Active' },
            inactive: { theme: 'gray' as const, label: 'Inactive' },
            pending: { theme: 'yellow' as const, label: 'Pending' },
          };
          const { theme, label } = config[value as keyof typeof config];
          return (
            <Badge theme={theme} type="subtle" size="sm" dot>
              {label}
            </Badge>
          );
        },
      },
      {
        key: 'createdAt',
        label: 'Created',
        width: '120px',
        sortable: true,
        render: (value) => <span className="text-[var(--color-text-muted)]">{value}</span>,
      },
      {
        key: 'actions',
        label: '',
        width: '48px',
        align: 'center',
        render: () => (
          <Button
            variant="ghost"
            size="sm"
            icon={<IconDotsVertical size={12} />}
            aria-label="More actions"
          />
        ),
      },
    ];

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        {selectedKeys.length > 0 && (
          <div className="flex items-center gap-[var(--primitive-spacing-2)] p-[var(--primitive-spacing-2)] bg-[var(--color-surface-subtle)] rounded">
            <span className="text-body-md">{selectedKeys.length} selected</span>
            <Button variant="ghost" size="sm" onClick={() => setSelectedKeys([])}>
              Clear
            </Button>
            <Button variant="danger" size="sm">
              Delete Selected
            </Button>
          </div>
        )}
        <Table
          columns={complexColumns}
          data={sampleUsers}
          rowKey="id"
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        />
      </div>
    );
  },
};
