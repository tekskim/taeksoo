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
} from '@/design-system';
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
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(initialSelectedNetworkId);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter networks
  const filteredNetworks = networks.filter((net) =>
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

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button 
            variant="secondary" 
            onClick={handleClose}
            className="w-[152px] h-8"
          >
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
        {/* Header Section */}
        <VStack gap={3} className="w-[648px]">
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              External Gateway Setting
            </h2>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Configure or update the external gateway for this router. The external gateway connects your router to a public network, allowing instances in attached subnets to access external networks through floating IPs.
            </p>
          </VStack>

          {/* Router Info Box */}
          <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
            <VStack gap={1.5}>
              <span className="text-[11px] font-medium text-[var(--color-text-subtle)] leading-4">
                Router
              </span>
              <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                {router.name}
              </span>
            </VStack>
          </div>
        </VStack>

        {/* External Gateway Toggle Section */}
        <VStack gap={3}>
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            External gateway
          </h3>
          <HStack gap={2} align="center">
            <Toggle
              checked={gatewayEnabled}
              onChange={setGatewayEnabled}
            />
            <span className="text-[12px] text-[var(--color-text-default)]">
              {gatewayEnabled ? 'Open' : 'Closed'}
            </span>
          </HStack>
        </VStack>

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
          />

          {/* Networks Table */}
          <div className="flex flex-col gap-[var(--table-row-gap)]" style={{ width: '648px', maxWidth: '648px' }}>
            {/* Header */}
            <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
              <div className="w-[var(--table-checkbox-width)] flex items-center justify-center" />
              <div className="w-[59px] flex items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Status
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Name
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Subnet CIDR
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Size
              </div>
            </div>

            {/* Rows */}
            {paginatedNetworks.map((net) => (
              <div 
                key={net.id}
                className={`flex items-stretch min-h-[var(--table-row-height)] border rounded-[var(--table-row-radius)] cursor-pointer transition-all ${
                  selectedNetworkId === net.id 
                    ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]' 
                    : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                }`}
                onClick={() => setSelectedNetworkId(net.id)}
              >
                {/* Radio */}
                <div className="w-[var(--table-checkbox-width)] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                  <Radio
                    name="network-select"
                    value={net.id}
                    checked={selectedNetworkId === net.id}
                    onChange={() => setSelectedNetworkId(net.id)}
                  />
                </div>
                {/* Status */}
                <div className="w-[59px] flex items-center justify-center">
                  <StatusIndicator status={net.status} layout="icon-only" size="sm" />
                </div>
                {/* Name with ID */}
                <div className="flex-1 flex flex-col justify-center gap-0.5 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <HStack gap={1.5} align="center">
                    <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)] truncate">{net.name}</span>
                    <IconExternalLink size={12} stroke={1.5} className="shrink-0 text-[var(--color-action-primary)]" />
                  </HStack>
                  <span className="text-[11px] text-[var(--color-text-subtle)] truncate">ID : {net.id}</span>
                </div>
                {/* Subnet CIDR */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">{net.subnetCidr}</span>
                </div>
                {/* Size */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">{net.size}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Indicator - directly under the table */}
          <SelectionIndicator
            selectedItems={selectedNetwork ? [{ id: selectedNetwork.id, label: selectedNetwork.name }] : []}
            onRemove={() => setSelectedNetworkId(null)}
            emptyText="No item Selected"
            className="shrink-0"
            style={{ width: '648px' }}
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ExternalGatewaySettingDrawer;
