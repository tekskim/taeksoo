import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  SelectionIndicator,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface FloatingIPItem {
  id: string;
  floatingIp: string;
  networkId: string;
  networkName: string;
  createdAt: string;
}

export interface LoadBalancerInfo {
  id: string;
  name: string;
  networkId: string;
  networkName: string;
}

export interface AssociateFloatingIPToLBDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  loadBalancer: LoadBalancerInfo;
  floatingIPs?: FloatingIPItem[];
  onAssociate?: (floatingIpId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultFloatingIPs: FloatingIPItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `45ghj${567 + i}`,
  floatingIp: '10.0.0.5',
  networkId: `45ghj${567 + i}`,
  networkName: 'net-02',
  createdAt: 'Aug 23, 2025',
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   AssociateFloatingIPToLBDrawer Component
   ---------------------------------------- */

export function AssociateFloatingIPToLBDrawer({
  isOpen,
  onClose,
  loadBalancer,
  floatingIPs = defaultFloatingIPs,
  onAssociate,
}: AssociateFloatingIPToLBDrawerProps) {
  // Floating IP selection state
  const [selectedFloatingIpId, setSelectedFloatingIpId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFloatingIpId(null);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  // Filter floating IPs
  const filteredFloatingIPs = floatingIPs.filter(
    (fip) =>
      fip.floatingIp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fip.networkName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fip.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFloatingIPs.length / ITEMS_PER_PAGE);
  const paginatedFloatingIPs = filteredFloatingIPs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAssociate = async () => {
    setHasAttemptedSubmit(true);

    if (!selectedFloatingIpId) return;

    setIsSubmitting(true);
    try {
      await onAssociate?.(selectedFloatingIpId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFloatingIpId(null);
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const selectedFloatingIP = floatingIPs.find((fip) => fip.id === selectedFloatingIpId);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Associate floating IP"
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssociate}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Associating...' : 'Associate'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Info Boxes Section */}
        <VStack gap={3}>
          {/* Load Balancer Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-muted)] rounded-lg">
            <VStack gap={1.5}>
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Load balancer
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {loadBalancer.name}
              </span>
            </VStack>
          </div>

          {/* Owned Network Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-muted)] rounded-lg">
            <VStack gap={1.5}>
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Owned Network
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {loadBalancer.networkName} (ID : {loadBalancer.networkId})
              </span>
            </VStack>
          </div>
        </VStack>

        {/* Floating IP Section */}
        <VStack gap={3} className="pb-5">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">Floating IP</h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search floating IP by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredFloatingIPs.length}
            onPageChange={setCurrentPage}
          />

          {/* Floating IPs Table */}
          <div className="flex flex-col gap-1" style={{ width: '648px', maxWidth: '648px' }}>
            {/* Header */}
            <div className="flex items-stretch min-h-[40px] bg-[var(--color-border-subtle)] border border-[var(--color-border-default)] rounded-md">
              <div className="w-[40px] flex items-center justify-center shrink-0" />
              <div className="flex-1 flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-label-sm text-[var(--color-text-default)] leading-4">
                  Floating IP
                </span>
                <IconChevronDown size={16} className="text-[var(--color-text-default)]" />
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-label-sm text-[var(--color-text-default)] leading-4">
                  Network
                </span>
                <IconChevronDown size={16} className="text-[var(--color-text-default)]" />
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-label-sm text-[var(--color-text-default)] leading-4">
                  Created At
                </span>
                <IconChevronDown size={16} className="text-[var(--color-text-default)]" />
              </div>
            </div>

            {/* Rows */}
            {paginatedFloatingIPs.map((fip) => (
              <div
                key={fip.id}
                className={`flex items-stretch min-h-[40px] border rounded-md cursor-pointer transition-all ${
                  selectedFloatingIpId === fip.id
                    ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]'
                    : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                }`}
                onClick={() => setSelectedFloatingIpId(fip.id)}
              >
                {/* Radio */}
                <div
                  className="w-[40px] flex items-center justify-center shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Radio
                    name="floating-ip-select"
                    value={fip.id}
                    checked={selectedFloatingIpId === fip.id}
                    onChange={() => setSelectedFloatingIpId(fip.id)}
                  />
                </div>
                {/* Floating IP */}
                <div className="flex-1 flex flex-col gap-0.5 justify-center px-3 py-2 overflow-hidden min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-label-md text-[var(--color-action-primary)] leading-4 truncate">
                      {fip.floatingIp}
                    </span>
                    <IconExternalLink
                      size={12}
                      stroke={1.5}
                      className="shrink-0 text-[var(--color-action-primary)]"
                    />
                  </div>
                  <span className="text-body-sm text-[var(--color-text-subtle)] leading-4 truncate">
                    ID : {fip.id}
                  </span>
                </div>
                {/* Network */}
                <div className="flex-1 flex flex-col gap-0.5 justify-center px-3 py-2 overflow-hidden min-w-0">
                  <span className="text-body-md text-[var(--color-text-default)] leading-4 truncate">
                    {fip.networkName}
                  </span>
                  <span className="text-body-sm text-[var(--color-text-subtle)] leading-4 truncate">
                    ID : {fip.networkId}
                  </span>
                </div>
                {/* Created At */}
                <div className="flex-1 flex items-center px-3 py-2 overflow-hidden min-w-0">
                  <span className="text-body-md text-[var(--color-text-default)] leading-4 truncate">
                    {fip.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Indicator - Below table */}
          <SelectionIndicator
            selectedItems={
              selectedFloatingIP
                ? [{ id: selectedFloatingIP.id, label: selectedFloatingIP.floatingIp }]
                : []
            }
            onRemove={() => setSelectedFloatingIpId(null)}
            emptyText="No item Selected"
            error={hasAttemptedSubmit && !selectedFloatingIpId}
            errorMessage="Please select a floating IP."
            className="w-full"
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AssociateFloatingIPToLBDrawer;
