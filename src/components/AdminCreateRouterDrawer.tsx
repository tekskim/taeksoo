import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  Input,
  SearchInput,
  Pagination,
  Toggle,
  StatusIndicator,
  SelectionIndicator,
  Table,
  FormField,
  ProgressBar,
  BadgeList,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconExclamationCircle } from '@tabler/icons-react';
import { Tooltip } from '@/design-system';
import { Link } from 'react-router-dom';
import { InlineCopyId } from '@/components/InlineCopyId';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface TenantItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'deactivated';
  description: string;
}

interface NetworkItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building';
  subnetCidrs: string[];
  shared: string;
}

export interface AdminCreateRouterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    name: string;
    description: string;
    tenantId: string | null;
    adminStateUp: boolean;
    externalGatewayEnabled: boolean;
    externalNetworkId: string | null;
  }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockTenants: TenantItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `${12345678 + i}`,
  name: `tenant A`,
  status: i === 4 ? 'deactivated' : 'active',
  description: '-',
}));

const mockNetworks: NetworkItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `${12345678 + i}`,
  name: 'net',
  status: 'active',
  subnetCidrs: ['198.01.0.0/24', '10.0.0.0/16', '172.16.0.0/12', '192.168.1.0/24'],
  shared: 'Yes',
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   AdminCreateRouterDrawer Component
   ---------------------------------------- */

export function AdminCreateRouterDrawer({
  isOpen,
  onClose,
  onSubmit,
}: AdminCreateRouterDrawerProps) {
  const [routerName, setRouterName] = useState('');
  const [description, setDescription] = useState('');
  const [adminStateUp, setAdminStateUp] = useState(true);
  const [externalGatewayEnabled, setExternalGatewayEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Tenant selection
  const [tenantSearch, setTenantSearch] = useState('');
  const [tenantPage, setTenantPage] = useState(1);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  // Network selection
  const [networkSearch, setNetworkSearch] = useState('');
  const [networkPage, setNetworkPage] = useState(1);
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);

  const filteredTenants = mockTenants.filter(
    (t) =>
      t.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(tenantSearch.toLowerCase())
  );
  const totalTenantPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE);
  const paginatedTenants = filteredTenants.slice(
    (tenantPage - 1) * ITEMS_PER_PAGE,
    tenantPage * ITEMS_PER_PAGE
  );

  const filteredNetworks = mockNetworks.filter(
    (n) =>
      n.name.toLowerCase().includes(networkSearch.toLowerCase()) ||
      n.subnetCidrs.some((c) => c.toLowerCase().includes(networkSearch.toLowerCase()))
  );
  const totalNetworkPages = Math.ceil(filteredNetworks.length / ITEMS_PER_PAGE);
  const paginatedNetworks = filteredNetworks.slice(
    (networkPage - 1) * ITEMS_PER_PAGE,
    networkPage * ITEMS_PER_PAGE
  );

  const disabledTenantIds = paginatedTenants
    .filter((t) => t.status === 'deactivated')
    .map((t) => t.id);

  useEffect(() => {
    if (isOpen) {
      setRouterName('');
      setDescription('');
      setAdminStateUp(true);
      setExternalGatewayEnabled(true);
      setSelectedTenantId(null);
      setSelectedNetworkId(null);
      setTenantSearch('');
      setNetworkSearch('');
      setTenantPage(1);
      setNetworkPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!routerName.trim()) return;
    if (!selectedTenantId) return;
    if (externalGatewayEnabled && !selectedNetworkId) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        name: routerName,
        description,
        tenantId: selectedTenantId,
        adminStateUp,
        externalGatewayEnabled,
        externalNetworkId: externalGatewayEnabled ? selectedNetworkId : null,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    onClose();
  };

  const selectedTenant = mockTenants.find((t) => t.id === selectedTenantId);
  const selectedNetwork = mockNetworks.find((n) => n.id === selectedNetworkId);

  const tenantColumns: TableColumn<TenantItem>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '60px',
      align: 'center',
      render: (_, row) => (
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
      render: (_, row) => (
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
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] truncate">
            ID: {row.id}
            <InlineCopyId value={row.id} />
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

  const networkColumns: TableColumn<NetworkItem>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '60px',
      align: 'center',
      render: (_, row) => <StatusIndicator layout="icon-only" status={row.status} size="sm" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <span className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1.5">
            <span className="text-label-md text-[var(--color-action-primary)] truncate">
              {row.name}
            </span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="shrink-0 text-[var(--color-action-primary)]"
            />
          </span>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
            ID : {row.id}
          </span>
        </span>
      ),
    },
    {
      key: 'subnetCidrs',
      label: 'Subnet CIDR',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <BadgeList
          items={row.subnetCidrs}
          maxVisible={1}
          maxBadgeWidth="140px"
          overflowAlign="right"
          popoverTitle={`All Subnets (${row.subnetCidrs.length})`}
        />
      ),
    },
    { key: 'shared', label: 'Shared', flex: 1, sortable: true },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Router"
      description="Create a virtual router to route traffic between different networks or subnets."
      width={696}
      footer={
        <VStack gap={4} className="w-full">
          <ProgressBar
            variant="quota"
            label="Router Quota"
            value={2}
            max={10}
            newValue={1}
            showValue
          />
          <HStack gap={2} justify="center" className="w-full">
            <Button variant="secondary" onClick={handleClose} className="w-[152px]">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-[152px]"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Router Name */}
        <FormField
          label="Router Name"
          helperText="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
          error={hasAttemptedSubmit && !routerName.trim()}
          errorMessage="Router name is required"
          required
        >
          <Input
            value={routerName}
            onChange={(e) => {
              setRouterName(e.target.value);
              if (hasAttemptedSubmit) setHasAttemptedSubmit(false);
            }}
            placeholder="Enter router name"
            fullWidth
            error={hasAttemptedSubmit && !routerName.trim()}
          />
        </FormField>

        {/* Description */}
        <FormField
          label="Description"
          helperText="You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters."
        >
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            fullWidth
          />
        </FormField>

        {/* Tenants */}
        <VStack gap={3} className="w-full">
          <VStack gap={1}>
            <span className="text-label-lg text-[var(--color-text-default)]">
              Tenants<span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </span>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              Select the tenants that are allowed to use the router.
            </span>
          </VStack>

          <SearchInput
            value={tenantSearch}
            onChange={(e) => {
              setTenantSearch(e.target.value);
              setTenantPage(1);
            }}
            placeholder="Search tenants by attributes"
            size="sm"
            className="w-[var(--search-input-width)]"
          />

          <Pagination
            currentPage={tenantPage}
            totalPages={totalTenantPages}
            onPageChange={setTenantPage}
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
                setSelectedTenantId(keys[0] ?? null);
              }}
              disabledKeys={disabledTenantIds}
              onRowClick={(row) => {
                if (row.status !== 'deactivated') setSelectedTenantId(row.id);
              }}
              emptyMessage="No tenants found"
            />
            <SelectionIndicator
              selectedItems={
                selectedTenant ? [{ id: selectedTenant.id, label: selectedTenant.name }] : []
              }
              onRemove={() => setSelectedTenantId(null)}
              emptyText="No item selected"
              error={hasAttemptedSubmit && !selectedTenantId}
              errorMessage="Please select a tenant."
            />
          </VStack>
        </VStack>

        {/* Admin State */}
        <FormField
          label="Admin State"
          description="Indicates whether the router's administrative state is Up or Down."
          spacing="loose"
        >
          <Toggle
            checked={adminStateUp}
            onChange={(e) => setAdminStateUp(e.target.checked)}
            label={adminStateUp ? 'Up' : 'Down'}
          />
        </FormField>

        {/* External Gateway */}
        <FormField
          label="External Gateway"
          description="Indicates whether the external gateway is enabled on the router."
          spacing="loose"
        >
          <Toggle
            checked={externalGatewayEnabled}
            onChange={(e) => setExternalGatewayEnabled(e.target.checked)}
            label={externalGatewayEnabled ? 'Open' : 'Close'}
          />
        </FormField>

        {/* External Network */}
        {externalGatewayEnabled && (
          <VStack gap={3} className="w-full pb-5">
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">
                External Network<span className="ml-1 text-[var(--color-state-danger)]">*</span>
              </span>
              <span className="text-body-md text-[var(--color-text-subtle)]">
                Select the external network used by the router.
              </span>
            </VStack>

            <SearchInput
              value={networkSearch}
              onChange={(e) => {
                setNetworkSearch(e.target.value);
                setNetworkPage(1);
              }}
              placeholder="Search networks by attributes"
              size="sm"
              className="w-[var(--search-input-width)]"
            />

            <Pagination
              currentPage={networkPage}
              totalPages={totalNetworkPages}
              onPageChange={setNetworkPage}
              totalItems={filteredNetworks.length}
            />

            <VStack gap={2}>
              <Table<NetworkItem>
                columns={networkColumns}
                data={paginatedNetworks}
                rowKey="id"
                selectable
                selectionType="radio"
                selectedKeys={selectedNetworkId ? [selectedNetworkId] : []}
                onSelectionChange={(keys) => {
                  setSelectedNetworkId(keys[0] ?? null);
                }}
                onRowClick={(row) => setSelectedNetworkId(row.id)}
                emptyMessage="No networks found"
              />
              <SelectionIndicator
                selectedItems={
                  selectedNetwork ? [{ id: selectedNetwork.id, label: selectedNetwork.name }] : []
                }
                onRemove={() => setSelectedNetworkId(null)}
                emptyText="No item selected"
                error={hasAttemptedSubmit && !selectedNetworkId}
                errorMessage="Please select an external network."
              />
            </VStack>
          </VStack>
        )}
      </VStack>
    </Drawer>
  );
}

export default AdminCreateRouterDrawer;
