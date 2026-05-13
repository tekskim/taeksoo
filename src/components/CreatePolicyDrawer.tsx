import { useState, useEffect, useMemo } from 'react';
import {
  Drawer,
  Button,
  Input,
  Toggle,
  SearchInput,
  Pagination,
  StatusIndicator,
  SelectionIndicator,
  Table,
  FormField,
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

export interface CreatePolicyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    name: string;
    description: string;
    tenantId: string;
    shared: boolean;
    audited: boolean;
  }) => void;
}

const defaultTenants: TenantRow[] = Array.from({ length: 115 }, (_, i) => ({
  id: `tenant-${String(i + 1).padStart(3, '0')}`,
  name: 'tenant A',
  tenantId: '12345678',
  status: (['active', 'active', 'active', 'error', 'muted'] as const)[i % 5],
  description: '-',
}));

export function CreatePolicyDrawer({ isOpen, onClose, onSubmit }: CreatePolicyDrawerProps) {
  const [policyName, setPolicyName] = useState('');
  const [description, setDescription] = useState('');
  const [shared, setShared] = useState(false);
  const [audited, setAudited] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<string[]>([]);
  const [tenantSearch, setTenantSearch] = useState('');
  const [tenantPage, setTenantPage] = useState(1);
  const tenantsPerPage = 5;

  useEffect(() => {
    if (isOpen) {
      setPolicyName('');
      setDescription('');
      setShared(false);
      setAudited(false);
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
      name: policyName,
      description,
      tenantId: selectedTenant[0] ?? '',
      shared,
      audited,
    });
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create policy"
      width={640}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            Create
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <FormField
          label="Policy name"
          helperText="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
          required
        >
          <Input
            placeholder="Enter policy name"
            value={policyName}
            onChange={(e) => setPolicyName(e.target.value)}
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

        <FormField
          label="Shared"
          description="Indicates whether the policy is shared with other tenants."
          spacing="loose"
        >
          <Toggle checked={shared} onChange={setShared} label={shared ? 'Yes' : 'No'} />
        </FormField>

        <FormField
          label="Audited"
          description="Indicates whether the policy rules have been audited."
          spacing="loose"
        >
          <Toggle checked={audited} onChange={setAudited} label={audited ? 'Yes' : 'No'} />
        </FormField>
      </VStack>
    </Drawer>
  );
}
