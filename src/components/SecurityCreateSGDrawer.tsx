import { useState, useEffect, useMemo } from 'react';
import {
  Drawer,
  Button,
  Input,
  SearchInput,
  Pagination,
  StatusIndicator,
  SelectionIndicator,
  Table,
  FormField,
  ProgressBar,
  fixedColumns,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';

interface TenantRow {
  id: string;
  name: string;
  tenantId: string;
  status: 'active' | 'error' | 'muted';
  description: string;
}

export interface SecurityCreateSGDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sgQuota?: { used: number; limit: number };
  ruleQuota?: { used: number; limit: number };
  onSubmit?: (data: { name: string; description: string; tenantId: string }) => void;
}

const defaultTenants: TenantRow[] = Array.from({ length: 115 }, (_, i) => ({
  id: `tenant-${String(i + 1).padStart(3, '0')}`,
  name: 'tenant A',
  tenantId: '12345678',
  status: (['active', 'active', 'active', 'error', 'muted'] as const)[i % 5],
  description: '-',
}));

export function SecurityCreateSGDrawer({
  isOpen,
  onClose,
  sgQuota = { used: 2, limit: 10 },
  ruleQuota = { used: 2, limit: 10 },
  onSubmit,
}: SecurityCreateSGDrawerProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<string[]>([]);
  const [tenantSearch, setTenantSearch] = useState('');
  const [tenantPage, setTenantPage] = useState(1);
  const tenantsPerPage = 5;

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setSelectedTenant([]);
      setTenantSearch('');
      setTenantPage(1);
    }
  }, [isOpen]);

  const filteredTenants = useMemo(() => {
    if (!tenantSearch) return defaultTenants;
    const q = tenantSearch.toLowerCase();
    return defaultTenants.filter((t) => t.name.toLowerCase().includes(q) || t.tenantId.includes(q));
  }, [tenantSearch]);

  const paginatedTenants = useMemo(() => {
    const start = (tenantPage - 1) * tenantsPerPage;
    return filteredTenants.slice(start, start + tenantsPerPage);
  }, [filteredTenants, tenantPage]);

  const tenantColumns: TableColumn<TenantRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator
          layout="icon-only"
          status={row.status === 'error' ? 'error' : row.status === 'muted' ? 'muted' : 'active'}
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: '120px',
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-body-md text-[var(--color-text-default)]">{row.name}</span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID: {row.tenantId}</span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      minWidth: '100px',
      sortable: true,
    },
  ];

  const handleSubmit = () => {
    onSubmit?.({
      name,
      description,
      tenantId: selectedTenant[0] ?? '',
    });
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create security group"
      width={640}
      footer={
        <VStack gap={4} className="w-full">
          <ProgressBar
            variant="quota"
            label="Security group quota"
            value={sgQuota.used}
            max={sgQuota.limit}
            newValue={1}
            showValue
          />
          <ProgressBar
            variant="quota"
            label="Security group rule quota"
            value={ruleQuota.used}
            max={ruleQuota.limit}
            newValue={1}
            showValue
          />

          <div className="w-[calc(100%+48px)] -ml-6 h-px bg-[var(--color-border-default)]" />
          <HStack gap={2} justify="end" className="w-full">
            <Button variant="secondary" onClick={onClose} className="w-[160px]">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} className="w-[160px]">
              Create
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={6}>
        <FormField
          label="Security group name"
          helperText="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
          required
        >
          <Input
            placeholder="Enter security group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </FormField>

        <FormField
          label="Description"
          helperText="You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters."
        >
          <Input
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </FormField>

        <VStack gap={3}>
          <FormField
            label="Owned tenant"
            description="Select the tenant that will own the policy."
            required
          >
            <SearchInput
              placeholder="Search tenants by attributes"
              value={tenantSearch}
              onChange={(e) => setTenantSearch(e.target.value)}
              onClear={() => setTenantSearch('')}
              size="sm"
              className="w-[240px]"
            />
          </FormField>

          <Pagination
            currentPage={tenantPage}
            totalPages={Math.ceil(filteredTenants.length / tenantsPerPage)}
            totalItems={filteredTenants.length}
            onPageChange={setTenantPage}
          />

          <VStack gap={2}>
            <Table<TenantRow>
              columns={tenantColumns}
              data={paginatedTenants}
              rowKey="id"
              selectable
              selectionType="radio"
              selectedKeys={selectedTenant}
              onSelectionChange={setSelectedTenant}
              emptyMessage="No tenants found"
            />

            <SelectionIndicator
              selectedItems={
                selectedTenant.length > 0
                  ? [
                      {
                        id: selectedTenant[0],
                        label:
                          defaultTenants.find((t) => t.id === selectedTenant[0])?.name ??
                          selectedTenant[0],
                      },
                    ]
                  : []
              }
              onRemove={() => setSelectedTenant([])}
              emptyText="No item selected"
              className="shrink-0 w-full"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}
