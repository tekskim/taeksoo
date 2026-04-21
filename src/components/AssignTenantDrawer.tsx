import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  StatusIndicator,
  SelectionIndicator,
  Tooltip,
  InfoBox,
  Table,
  CopyButton,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExclamationCircle, IconExternalLink } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface AssignTenantNodeInfo {
  id: string;
  serial: string;
}

export interface AssignTenantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  node: AssignTenantNodeInfo;
  onAssign?: (tenantId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

interface TenantItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'deactivated';
  description: string;
}

const mockTenants: TenantItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `tenant-${String(i + 1).padStart(3, '0')}`,
  name: `tenant ${String.fromCharCode(65 + (i % 26))}`,
  status: i === 4 ? 'deactivated' : 'active',
  description: '-',
}));

/* ----------------------------------------
   AssignTenantDrawer Component
   ---------------------------------------- */

export function AssignTenantDrawer({ isOpen, onClose, node, onAssign }: AssignTenantDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [tenantError, setTenantError] = useState(false);

  const ITEMS_PER_PAGE = 5;

  const filteredTenants = mockTenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE);
  const paginatedTenants = filteredTenants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectTenant = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    if (tenantError) setTenantError(false);
  };

  const disabledTenantIds = paginatedTenants
    .filter((t) => t.status === 'deactivated')
    .map((t) => t.id);

  const tenantColumns: TableColumn<TenantItem>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '60px',
      align: 'center',
      render: (_value, row) => (
        <StatusIndicator
          status={row.status === 'active' ? 'active' : 'deactivated'}
          layout="icon-only"
          size="sm"
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link
              to={`/compute-admin/tenants/${row.id}`}
              className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </Link>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)] shrink-0" />
            {row.status === 'deactivated' && (
              <Tooltip content="This tenant is disabled.">
                <IconExclamationCircle
                  size={12}
                  className="text-[var(--color-state-danger)] shrink-0"
                />
              </Tooltip>
            )}
          </div>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-disabled)] truncate">
            ID: {row.id}
            <CopyButton
              value={row.id}
              size="sm"
              iconOnly
              variant="ghost"
              className="h-auto p-0 text-[var(--color-text-disabled)] hover:text-[var(--color-text-muted)]"
            />
          </span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      sortable: true,
      render: (value) => (
        <span className="text-body-md text-[var(--color-text-default)]">{value as string}</span>
      ),
    },
  ];

  const handleAssign = () => {
    if (!selectedTenantId) {
      setTenantError(true);
      return;
    }
    setIsSubmitting(true);
    onAssign?.(selectedTenantId);
    setTimeout(() => {
      setIsSubmitting(false);
      handleClose();
    }, 1000);
  };

  const handleClose = () => {
    setSearchQuery('');
    setCurrentPage(1);
    setSelectedTenantId(null);
    setTenantError(false);
    onClose();
  };

  const selectedTenant = selectedTenantId
    ? mockTenants.find((t) => t.id === selectedTenantId)
    : null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Assign tenant to node"
      width={560}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssign}
            disabled={isSubmitting}
            className="w-[152px]"
          >
            Assign
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <InfoBox label="Bare metal node" value={node.serial} />

        <VStack gap={3} className="w-full">
          <div className="flex flex-col gap-1">
            <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
              Tenants <span className="text-[var(--color-state-danger)]">*</span>
            </h3>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Select the tenant to assign to the node.
            </p>
          </div>

          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search tenants by attributes"
            size="sm"
            className="w-[var(--search-input-width)]"
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredTenants.length}
          />

          <VStack gap={2}>
            <Table
              columns={tenantColumns}
              data={paginatedTenants}
              rowKey="id"
              selectable
              selectionType="radio"
              selectedKeys={selectedTenantId ? [selectedTenantId] : []}
              onSelectionChange={(keys) => {
                const id = keys[0] ?? null;
                if (id) handleSelectTenant(id);
                else {
                  setSelectedTenantId(null);
                }
              }}
              disabledKeys={disabledTenantIds}
              onRowClick={(row) => {
                if (row.status !== 'deactivated') handleSelectTenant(row.id);
              }}
              emptyMessage="No tenants found"
            />

            <SelectionIndicator
              selectedItems={
                selectedTenant ? [{ id: selectedTenant.id, label: selectedTenant.name }] : []
              }
              onRemove={() => setSelectedTenantId(null)}
              emptyText="No item selected"
              error={tenantError}
              errorMessage="Please select a tenant to assign."
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AssignTenantDrawer;
