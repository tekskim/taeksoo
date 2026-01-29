import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  StatusIndicator,
  Radio,
  SelectionIndicator,
  Select,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface NetworkItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building';
  subnetCidr: string;
  external: boolean;
  shared: boolean;
  inThisProject: boolean;
}

export interface InstanceInfo {
  id: string;
  name: string;
}

export interface AttachInterfaceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo;
  networks?: NetworkItem[];
  onAttach?: (networkId: string, fixedIp: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockNetworks: NetworkItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: `net-${i + 1}`,
  name: 'net-02',
  status: 'active',
  subnetCidr: '192.168.20.0/24',
  external: false,
  shared: true,
  inThisProject: true,
}));

/* ----------------------------------------
   AttachInterfaceDrawer Component
   ---------------------------------------- */

export function AttachInterfaceDrawer({
  isOpen,
  onClose,
  instance,
  networks = mockNetworks,
  onAttach,
}: AttachInterfaceDrawerProps) {
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [fixedIpMode, setFixedIpMode] = useState('auto-assign');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const totalItems = 115;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleAttach = async () => {
    setHasAttemptedSubmit(true);
    if (!selectedNetworkId) return;

    setIsSubmitting(true);
    try {
      await onAttach?.(selectedNetworkId, fixedIpMode);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedNetworkId(null);
    setSearchQuery('');
    setCurrentPage(1);
    setFixedIpMode('auto-assign');
    setHasAttemptedSubmit(false);
    onClose();
  };

  const filteredNetworks = networks.filter((n) =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAttach}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Attaching...' : 'Attach'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Attach Interface
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
              Attach a new network interface to this instance. You can connect it to another network
              or subnet for additional access.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-body-sm text-[var(--color-text-subtle)] mb-1.5">Instance Name</div>
            <div className="text-body-md text-[var(--color-text-default)]">{instance.name}</div>
          </div>
        </VStack>

        {/* Networks Section */}
        <VStack gap={3} className="flex-1 min-h-0 pb-5">
          {/* Networks Header */}
          <h3 className="text-label-lg text-[var(--color-text-default)]">Networks</h3>

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
          <HStack gap={2} align="center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)] mx-2" />
            <span className="text-body-sm text-[var(--color-text-subtle)]">{totalItems} items</span>
          </HStack>

          {/* Networks Table */}
          <div
            className="flex-1 overflow-y-auto sidebar-scroll"
            style={{ width: '648px', maxWidth: '648px', overflowX: 'hidden', paddingRight: '2px' }}
          >
            {/* Header */}
            <div
              style={{ display: 'flex', width: '648px', height: '40px' }}
              className="bg-[var(--color-border-subtle)] border border-[var(--color-border-default)] rounded-md"
            >
              <div
                style={{ width: '40px', flexShrink: 0 }}
                className="flex items-center justify-center"
              />
              <div
                style={{ width: '59px', flexShrink: 0 }}
                className="flex items-center justify-center px-3 border-l border-[var(--color-border-default)]"
              >
                <span className="text-label-sm text-[var(--color-text-default)]">
                  Status
                </span>
              </div>
              <div
                style={{ width: '110px', flexShrink: 0 }}
                className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]"
              >
                <span className="text-label-sm text-[var(--color-text-default)]">
                  Name
                </span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div
                style={{ width: '110px', flexShrink: 0 }}
                className="flex items-center px-3 border-l border-[var(--color-border-default)]"
              >
                <span className="text-label-sm text-[var(--color-text-default)]">
                  Subnet CIDR
                </span>
              </div>
              <div
                style={{ width: '80px', flexShrink: 0 }}
                className="flex items-center px-3 border-l border-[var(--color-border-default)]"
              >
                <span className="text-label-sm text-[var(--color-text-default)]">
                  External
                </span>
              </div>
              <div
                style={{ width: '80px', flexShrink: 0 }}
                className="flex items-center px-3 border-l border-[var(--color-border-default)]"
              >
                <span className="text-label-sm text-[var(--color-text-default)]">
                  Shared
                </span>
              </div>
              <div
                style={{ width: '109px', flexShrink: 0 }}
                className="flex items-center px-3 border-l border-[var(--color-border-default)]"
              >
                <span className="text-label-sm text-[var(--color-text-default)]">
                  In This Project
                </span>
              </div>
            </div>

            {/* Rows */}
            <div
              style={{
                width: '648px',
                maxWidth: '648px',
                marginTop: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {filteredNetworks.map((network) => (
                <div
                  key={network.id}
                  style={{ display: 'flex', width: '648px', minHeight: '40px' }}
                  className={`border rounded-md cursor-pointer transition-all ${
                    selectedNetworkId === network.id
                      ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]'
                      : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                  }`}
                  onClick={() => setSelectedNetworkId(network.id)}
                >
                  {/* Radio */}
                  <div
                    style={{ width: '40px', flexShrink: 0 }}
                    className="flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Radio
                      name="network-select"
                      value={network.id}
                      checked={selectedNetworkId === network.id}
                      onChange={() => setSelectedNetworkId(network.id)}
                    />
                  </div>
                  {/* Status */}
                  <div
                    style={{ width: '59px', flexShrink: 0 }}
                    className="flex items-center justify-center"
                  >
                    <StatusIndicator status="active" layout="icon-only" size="sm" />
                  </div>
                  {/* Name */}
                  <div
                    style={{ width: '110px', flexShrink: 0 }}
                    className="flex flex-col gap-0.5 justify-center px-3 py-2 overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-label-md text-[var(--color-action-primary)] truncate">
                        {network.name}
                      </span>
                      <IconExternalLink
                        size={12}
                        className="shrink-0 text-[var(--color-action-primary)]"
                      />
                    </div>
                    <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                      ID : 17kfj123
                    </span>
                  </div>
                  {/* Subnet CIDR */}
                  <div
                    style={{ width: '110px', flexShrink: 0 }}
                    className="flex items-center px-3 py-2 overflow-hidden"
                  >
                    <span className="text-body-md text-[var(--color-text-default)] truncate">
                      {network.subnetCidr}
                    </span>
                  </div>
                  {/* External */}
                  <div
                    style={{ width: '80px', flexShrink: 0 }}
                    className="flex items-center px-3 py-2 overflow-hidden"
                  >
                    <span className="text-body-md text-[var(--color-text-default)] truncate">
                      {network.external ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {/* Shared */}
                  <div
                    style={{ width: '80px', flexShrink: 0 }}
                    className="flex items-center px-3 py-2 overflow-hidden"
                  >
                    <span className="text-body-md text-[var(--color-text-default)] truncate">
                      {network.shared ? 'On' : 'Off'}
                    </span>
                  </div>
                  {/* In This Project */}
                  <div
                    style={{ width: '109px', flexShrink: 0 }}
                    className="flex items-center px-3 py-2 overflow-hidden"
                  >
                    <span className="text-body-md text-[var(--color-text-default)] truncate">
                      {network.inThisProject ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </VStack>

        {/* Selection Indicator */}
        <SelectionIndicator
          selectedItems={
            selectedNetworkId
              ? [
                  {
                    id: selectedNetworkId,
                    label: networks.find((n) => n.id === selectedNetworkId)?.name || '',
                  },
                ]
              : []
          }
          onRemove={() => setSelectedNetworkId(null)}
          emptyText="No item selected"
          className="shrink-0"
          style={{ width: '648px' }}
          error={hasAttemptedSubmit && !selectedNetworkId}
          errorMessage="Please select a network"
        />

        {/* Fixed IP Section */}
        <VStack gap={2} className="shrink-0" style={{ width: '648px' }}>
          <h3 className="text-label-lg text-[var(--color-text-default)]">Fixed IP</h3>
          <Select options={[]} placeholder="Select subnet" disabled={false} fullWidth />
          <Select
            options={[
              { value: 'auto-assign', label: 'Auto-assign' },
              { value: 'manual', label: 'Manual' },
            ]}
            value={fixedIpMode}
            onChange={(value) => setFixedIpMode(value)}
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AttachInterfaceDrawer;
