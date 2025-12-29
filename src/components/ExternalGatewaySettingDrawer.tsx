import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  Radio,
  Toggle,
  StatusIndicator,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface NetworkItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  subnetCidr: string;
  size: 'On' | 'Off';
}

export interface ExternalGatewaySettingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  routerName: string;
  isGatewayEnabled?: boolean;
  selectedNetworkId?: string;
  networks?: NetworkItem[];
  onSave?: (enabled: boolean, networkId: string | null) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockNetworks: NetworkItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29tgj${234 + i}`,
  name: 'net-01',
  status: 'active',
  subnetCidr: '10.0.0.0/24',
  size: 'On',
}));

/* ----------------------------------------
   ExternalGatewaySettingDrawer Component
   ---------------------------------------- */

export function ExternalGatewaySettingDrawer({
  isOpen,
  onClose,
  routerName,
  isGatewayEnabled = true,
  selectedNetworkId = null,
  networks = mockNetworks,
  onSave,
}: ExternalGatewaySettingDrawerProps) {
  const [gatewayEnabled, setGatewayEnabled] = useState(isGatewayEnabled);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(selectedNetworkId);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 10;

  const filteredNetworks = networks.filter(
    (network) =>
      network.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      network.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      network.subnetCidr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedNetworks = filteredNetworks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: TableColumn<NetworkItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="network-select"
          value={row.id}
          checked={selectedId === row.id}
          onChange={() => setSelectedId(row.id)}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, item) => (
        <StatusIndicator status={item.status} layout="icon-only" size="sm" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <a
            href={`/networks/${item.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{item.name}</span>
            <IconExternalLink size={12} className="flex-shrink-0" />
          </a>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {item.id}
          </span>
        </VStack>
      ),
    },
    {
      key: 'subnetCidr',
      label: 'Subnet CIDR',
    },
    {
      key: 'size',
      label: 'Size',
    },
  ];

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave?.(gatewayEnabled, gatewayEnabled ? selectedId : null);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setCurrentPage(1);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="External Gateway Setting"
      description="Configure or update the external gateway for this router. The external gateway connects your router to a public network, allowing instances in attached subnets to access external networks through floating IPs."
      width={696}
      footer={
        <HStack gap={2} justifyContent="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} size="md" className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSubmitting || (gatewayEnabled && !selectedId)}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Router Info */}
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] mb-1.5">
            Router
          </p>
          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {routerName}
          </p>
        </div>

        {/* External Gateway Toggle Section */}
        <VStack gap={3} alignItems="start">
          <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
            External gateway
          </h6>
          <Toggle
            checked={gatewayEnabled}
            onChange={setGatewayEnabled}
            label={gatewayEnabled ? 'Open' : 'Closed'}
          />
        </VStack>

        {/* Network Selection Section */}
        {gatewayEnabled && (
          <VStack gap={3} className="flex-1">
            {/* Search */}
            <div className="w-[280px]">
              <SearchInput
                placeholder="Find network with filters"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Pagination */}
            <HStack gap={2} alignItems="center" className="w-full">
              <Pagination
                totalItems={filteredNetworks.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
              <div className="w-px h-4 bg-[var(--color-border-default)]" />
              <span className="text-[11px] text-[var(--color-text-subtle)]">
                {filteredNetworks.length} items
              </span>
            </HStack>

            {/* Network Table */}
            <div className="flex-1 overflow-auto">
              <Table<NetworkItem>
                columns={columns}
                data={paginatedNetworks}
                rowKey="id"
                selectedKeys={selectedId ? [selectedId] : []}
                onRowClick={(row) => setSelectedId(row.id)}
                emptyMessage="No networks available"
              />
            </div>
          </VStack>
        )}
      </VStack>
    </Drawer>
  );
}

export default ExternalGatewaySettingDrawer;

