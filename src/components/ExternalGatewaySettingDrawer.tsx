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
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface NetworkItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'shutoff';
  subnetCidr: string;
  size: string;
}

export interface RouterInfo {
  name: string;
}

export interface ExternalGatewaySettingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  router: RouterInfo;
  initialGatewayEnabled?: boolean;
  initialSelectedNetworkId?: string | null;
  networks?: NetworkItem[];
  onSubmit?: (data: { gatewayEnabled: boolean; networkId: string | null }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultNetworks: NetworkItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29tgj${234 + i}`,
  name: 'net-01',
  status: 'active',
  subnetCidr: '10.0.0.0/24',
  size: 'On',
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   ExternalGatewaySettingDrawer Component
   ---------------------------------------- */

export function ExternalGatewaySettingDrawer({
  isOpen,
  onClose,
  router,
  initialGatewayEnabled = true,
  initialSelectedNetworkId = null,
  networks = defaultNetworks,
  onSubmit,
}: ExternalGatewaySettingDrawerProps) {
  // Gateway toggle state
  const [gatewayEnabled, setGatewayEnabled] = useState(initialGatewayEnabled);

  // Network selection state
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(
    initialSelectedNetworkId
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter networks
  const filteredNetworks = networks.filter(
    (net) =>
      net.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      net.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      net.subnetCidr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNetworks.length / ITEMS_PER_PAGE);
  const paginatedNetworks = filteredNetworks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setGatewayEnabled(initialGatewayEnabled);
      setSelectedNetworkId(initialSelectedNetworkId);
      setSearchQuery('');
      setCurrentPage(1);
    }
  }, [isOpen, initialGatewayEnabled, initialSelectedNetworkId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.({
        gatewayEnabled,
        networkId: selectedNetworkId,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedNetworkId(initialSelectedNetworkId);
    setGatewayEnabled(initialGatewayEnabled);
    setSearchQuery('');
    setCurrentPage(1);
    onClose();
  };

  const selectedNetwork = networks.find((n) => n.id === selectedNetworkId);

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
    { key: 'subnetCidr', label: 'Subnet CIDR', flex: 1 },
    { key: 'size', label: 'Size', flex: 1 },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="External gateway setting"
      description="Configure or update the external gateway for this router. The external gateway connects your router to a public network, allowing instances in attached subnets to access external networks through floating IPs."
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        <VStack gap={3} className="w-[648px]">
          <InfoBox label="Router" value={router.name} />
        </VStack>

        {/* External Gateway Toggle Section */}
        <FormField label="External gateway" spacing="loose">
          <HStack gap={2} align="center">
            <Toggle checked={gatewayEnabled} onChange={setGatewayEnabled} />
            <span className="text-body-md text-[var(--color-text-default)]">
              {gatewayEnabled ? 'Open' : 'Closed'}
            </span>
          </HStack>
        </FormField>

        {/* Network Selection Section */}
        <VStack gap={3} className="w-full pb-5">
          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search network by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredNetworks.length}
            onPageChange={setCurrentPage}
            selectedCount={selectedNetworkId ? 1 : 0}
          />

          {/* Networks Table */}
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
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ExternalGatewaySettingDrawer;
