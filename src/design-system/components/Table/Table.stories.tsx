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
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active', createdAt: '2024-01-20' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer', status: 'inactive', createdAt: '2024-02-01' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'pending', createdAt: '2024-02-10' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', role: 'Viewer', status: 'active', createdAt: '2024-02-15' },
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
          return <Badge theme={config.theme} type="subtle" size="sm">{config.label}</Badge>;
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
      <div className="flex flex-col gap-4">
        <Table
          columns={basicColumns}
          data={sampleUsers}
          rowKey="id"
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        />
        <p className="text-sm text-[var(--color-text-muted)]">
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
      { key: 'createdAt', label: 'Created At', sortable: true, width: '120px' },
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
        align: 'right',
        render: (_value, row) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              icon={<IconEdit size={14} />}
              aria-label={`Edit ${row.name}`}
            />
            <Button
              variant="ghost"
              size="sm"
              icon={<IconTrash size={14} />}
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
      <Table
        columns={basicColumns}
        data={sampleUsers}
        rowKey="id"
        onRowClick={handleRowClick}
      />
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
      createdAt: '2024-01-01',
    }));

    return (
      <Table
        columns={basicColumns}
        data={manyUsers}
        rowKey="id"
        maxHeight="300px"
        stickyHeader
      />
    );
  },
};

// Column Alignment
export const ColumnAlignment: Story = {
  render: () => {
    const alignedColumns: TableColumn<User>[] = [
      { key: 'name', label: 'Name (Left)', align: 'left' },
      { key: 'email', label: 'Email (Center)', align: 'center' },
      { key: 'role', label: 'Role (Right)', align: 'right' },
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
            <span className="font-medium">{value}</span>
            <span className="text-[11px] text-[var(--color-text-muted)]">{row.email}</span>
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
          return <Badge theme={theme} type="subtle" size="sm" dot>{label}</Badge>;
        },
      },
      {
        key: 'createdAt',
        label: 'Created',
        width: '120px',
        sortable: true,
        render: (value) => (
          <span className="text-[var(--color-text-muted)]">{value}</span>
        ),
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
            icon={<IconDotsVertical size={14} />}
            aria-label="More actions"
          />
        ),
      },
    ];

    return (
      <div className="flex flex-col gap-4">
        {selectedKeys.length > 0 && (
          <div className="flex items-center gap-2 p-2 bg-[var(--color-surface-subtle)] rounded">
            <span className="text-sm">{selectedKeys.length} selected</span>
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
