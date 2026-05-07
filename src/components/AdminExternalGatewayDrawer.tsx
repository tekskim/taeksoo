import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  Toggle,
  StatusIndicator,
  SelectionIndicator,
  Table,
  FormField,
  InfoBox,
  BadgeList,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface NetworkItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building';
  subnetCidrs: string[];
  shared: string;
}

export interface AdminExternalGatewayDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  routerName?: string;
  initialGatewayEnabled?: boolean;
  initialSnatEnabled?: boolean;
  initialSelectedNetworkId?: string | null;
  onSubmit?: (data: {
    gatewayEnabled: boolean;
    snatEnabled: boolean;
    networkId: string | null;
  }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockNetworks: NetworkItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `${12345678 + i}`,
  name: 'net',
  status: 'active',
  subnetCidrs: ['198.01.0.0/24', '10.0.0.0/16', '172.16.0.0/12', '192.168.1.0/24'],
  shared: 'Yes',
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   AdminExternalGatewayDrawer Component
   ---------------------------------------- */

export function AdminExternalGatewayDrawer({
  isOpen,
  onClose,
  routerName = 'name',
  initialGatewayEnabled = true,
  initialSnatEnabled = true,
  initialSelectedNetworkId = null,
  onSubmit,
}: AdminExternalGatewayDrawerProps) {
  const [gatewayEnabled, setGatewayEnabled] = useState(initialGatewayEnabled);
  const [snatEnabled, setSnatEnabled] = useState(initialSnatEnabled);
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(
    initialSelectedNetworkId
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const filteredNetworks = mockNetworks.filter(
    (n) =>
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subnetCidrs.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredNetworks.length / ITEMS_PER_PAGE);
  const paginatedNetworks = filteredNetworks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (isOpen) {
      setGatewayEnabled(initialGatewayEnabled);
      setSnatEnabled(initialSnatEnabled);
      setSelectedNetworkId(initialSelectedNetworkId);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, initialGatewayEnabled, initialSnatEnabled, initialSelectedNetworkId]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (gatewayEnabled && !selectedNetworkId) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        gatewayEnabled,
        snatEnabled,
        networkId: selectedNetworkId,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setGatewayEnabled(initialGatewayEnabled);
    setSnatEnabled(initialSnatEnabled);
    setSelectedNetworkId(initialSelectedNetworkId);
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const selectedNetwork = mockNetworks.find((n) => n.id === selectedNetworkId);

  const networkColumns: TableColumn<NetworkItem>[] = [
    {
      key: 'radio',
      label: '',
      width: '40px',
      render: (_, row) => (
        <Radio
          name="network-select"
          value={row.id}
          checked={selectedNetworkId === row.id}
          onChange={() => setSelectedNetworkId(row.id)}
        />
      ),
    },
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
            ID: {row.id}
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
      title="External gateway setting"
      description="Configures the external gateway for the router."
      width={696}
      footer={
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
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Router Info */}
        <InfoBox label="Router" value={routerName} />

        {/* External Gateway Toggle */}
        <FormField
          label="External gateway"
          description="Indicates whether to enable the external gateway."
          spacing="loose"
        >
          <Toggle
            checked={gatewayEnabled}
            onChange={(e) => setGatewayEnabled(e.target.checked)}
            label={gatewayEnabled ? 'Open' : 'Closed'}
          />
        </FormField>

        {/* External Network */}
        {gatewayEnabled && (
          <VStack gap={3} className="w-full">
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">
                External Network<span className="ml-1 text-[var(--color-state-danger)]">*</span>
              </span>
              <span className="text-body-md text-[var(--color-text-subtle)]">
                Select the network to use for the external gateway.
              </span>
            </VStack>

            <SearchInput
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search networks by attributes"
              size="sm"
              className="w-[var(--search-input-width)]"
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredNetworks.length}
              selectedCount={selectedNetworkId ? 1 : 0}
            />

            <VStack gap={2}>
              <Table<NetworkItem>
                columns={networkColumns}
                data={paginatedNetworks}
                rowKey="id"
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

        {/* SNAT */}
        <FormField
          label="SNAT"
          description="Indicates whether to enable SNAT for outbound traffic from the internal network."
          spacing="loose"
        >
          <Toggle
            checked={snatEnabled}
            onChange={(e) => setSnatEnabled(e.target.checked)}
            label={snatEnabled ? 'Enabled' : 'Disabled'}
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default AdminExternalGatewayDrawer;
