import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Table } from './Table';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
];

const data = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
];

describe('Table Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Table columns={columns} data={data} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with selectable rows', async () => {
    const { container } = render(
      <Table
        columns={columns}
        data={data}
        selectable
        selectedKeys={['1']}
        onSelectionChange={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with sortable columns', async () => {
    const sortableColumns = columns.map(col => ({ ...col, sortable: true }));
    const { container } = render(
      <Table columns={sortableColumns} data={data} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with empty state', async () => {
    const { container } = render(
      <Table
        columns={columns}
        data={[]}
        emptyMessage="No data available"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
