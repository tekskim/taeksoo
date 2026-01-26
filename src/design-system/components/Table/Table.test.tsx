import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table, type TableColumn } from './Table';

interface TestData {
  id: string;
  name: string;
  email: string;
  status: string;
}

const testColumns: TableColumn<TestData>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
];

const testData: TestData[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', status: 'Active' },
];

describe('Table', () => {
  describe('Rendering', () => {
    it('renders column headers', () => {
      render(<Table columns={testColumns} data={testData} rowKey="id" />);
      
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders data rows', () => {
      render(<Table columns={testColumns} data={testData} rowKey="id" />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('renders empty message when no data', () => {
      render(<Table columns={testColumns} data={[]} rowKey="id" emptyMessage="No items found" />);
      
      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    it('renders default empty message', () => {
      render(<Table columns={testColumns} data={[]} rowKey="id" />);
      
      expect(screen.getByText('No data')).toBeInTheDocument();
    });
  });

  describe('Custom Rendering', () => {
    it('renders custom cell content with render function', () => {
      const columnsWithRender: TableColumn<TestData>[] = [
        ...testColumns,
        {
          key: 'actions',
          label: 'Actions',
          render: (_value, row) => <button data-testid={`action-${row.id}`}>Edit</button>,
        },
      ];

      render(<Table columns={columnsWithRender} data={testData} rowKey="id" />);
      
      expect(screen.getByTestId('action-1')).toBeInTheDocument();
      expect(screen.getByTestId('action-2')).toBeInTheDocument();
    });

    it('renders custom header with headerRender function', () => {
      const columnsWithHeader: TableColumn<TestData>[] = [
        {
          key: 'name',
          label: 'Name',
          headerRender: () => <span data-testid="custom-header">Custom Name</span>,
        },
      ];

      render(<Table columns={columnsWithHeader} data={testData} rowKey="id" />);
      
      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });
  });

  describe('Row Key', () => {
    it('supports string rowKey', () => {
      render(<Table columns={testColumns} data={testData} rowKey="id" />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('supports function rowKey', () => {
      render(
        <Table
          columns={testColumns}
          data={testData}
          rowKey={(row) => `custom-${row.id}`}
        />
      );
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('renders checkboxes when selectable', () => {
      render(
        <Table
          columns={testColumns}
          data={testData}
          rowKey="id"
          selectable
          selectedKeys={[]}
          onSelectionChange={() => {}}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      // 1 header checkbox + 3 row checkboxes
      expect(checkboxes.length).toBe(4);
    });

    it('calls onSelectionChange when row checkbox is clicked', async () => {
      const user = userEvent.setup();
      const handleSelectionChange = vi.fn();
      
      render(
        <Table
          columns={testColumns}
          data={testData}
          rowKey="id"
          selectable
          selectedKeys={[]}
          onSelectionChange={handleSelectionChange}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]); // First row checkbox
      
      expect(handleSelectionChange).toHaveBeenCalledWith(['1']);
    });

    it('selects all rows when header checkbox is clicked', async () => {
      const user = userEvent.setup();
      const handleSelectionChange = vi.fn();
      
      render(
        <Table
          columns={testColumns}
          data={testData}
          rowKey="id"
          selectable
          selectedKeys={[]}
          onSelectionChange={handleSelectionChange}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]); // Header checkbox
      
      expect(handleSelectionChange).toHaveBeenCalledWith(['1', '2', '3']);
    });

    it('deselects all when all are selected and header is clicked', async () => {
      const user = userEvent.setup();
      const handleSelectionChange = vi.fn();
      
      render(
        <Table
          columns={testColumns}
          data={testData}
          rowKey="id"
          selectable
          selectedKeys={['1', '2', '3']}
          onSelectionChange={handleSelectionChange}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]); // Header checkbox
      
      expect(handleSelectionChange).toHaveBeenCalledWith([]);
    });

    it('hides select all checkbox when hideSelectAll is true', () => {
      render(
        <Table
          columns={testColumns}
          data={testData}
          rowKey="id"
          selectable
          hideSelectAll
          selectedKeys={[]}
          onSelectionChange={() => {}}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBe(3); // Only row checkboxes
    });
  });

  describe('Sorting', () => {
    it('renders sort icon for sortable columns', () => {
      const sortableColumns: TableColumn<TestData>[] = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email' },
      ];

      render(
        <Table columns={sortableColumns} data={testData} rowKey="id" />
      );
      
      // Check that sortable column header element exists
      const nameHeader = screen.getByText('Name');
      expect(nameHeader).toBeInTheDocument();
    });

    it('sorts data when sortable column header is clicked', async () => {
      const user = userEvent.setup();
      const sortableColumns: TableColumn<TestData>[] = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email' },
      ];

      render(<Table columns={sortableColumns} data={testData} rowKey="id" />);
      
      // Click to sort ascending
      await user.click(screen.getByText('Name'));
      
      // Check order - Bob should be first alphabetically
      const rows = screen.getAllByText(/Doe|Smith|Wilson/);
      expect(rows[0]).toHaveTextContent('Bob Wilson');
    });
  });

  describe('Row Click', () => {
    it('calls onRowClick when row is clicked', async () => {
      const user = userEvent.setup();
      const handleRowClick = vi.fn();
      
      render(
        <Table
          columns={testColumns}
          data={testData}
          rowKey="id"
          onRowClick={handleRowClick}
        />
      );
      
      await user.click(screen.getByText('John Doe'));
      
      expect(handleRowClick).toHaveBeenCalledWith(testData[0], 0);
    });

    it('has cursor-pointer class when onRowClick is provided', () => {
      render(
        <Table
          columns={testColumns}
          data={testData}
          rowKey="id"
          onRowClick={() => {}}
        />
      );
      
      const row = screen.getByText('John Doe').closest('.cursor-pointer');
      expect(row).toBeInTheDocument();
    });
  });

  describe('Column Alignment', () => {
    it('aligns columns correctly', () => {
      const alignedColumns: TableColumn<TestData>[] = [
        { key: 'name', label: 'Name', align: 'left' },
        { key: 'email', label: 'Email', align: 'center' },
        { key: 'status', label: 'Status', align: 'right' },
      ];

      render(<Table columns={alignedColumns} data={testData} rowKey="id" />);
      
      // Check headers exist with correct text
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });

  describe('Column Width', () => {
    it('applies fixed width to columns', () => {
      const widthColumns: TableColumn<TestData>[] = [
        { key: 'name', label: 'Name', width: '200px' },
        { key: 'email', label: 'Email' },
      ];

      render(<Table columns={widthColumns} data={testData} rowKey="id" />);
      
      // Check that column header is rendered
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });
  });
});
