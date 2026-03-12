import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  SelectionIndicator,
  Table,
  InfoBox,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

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
  createdAt: 'Aug 23, 2025 20:06:42',
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

  const floatingIPColumns: TableColumn<FloatingIPItem>[] = [
    {
      key: 'id' as keyof FloatingIPItem,
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="floating-ip-select"
            value={row.id}
            checked={selectedFloatingIpId === row.id}
            onChange={() => setSelectedFloatingIpId(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      flex: 1,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-label-md text-[var(--color-action-primary)] leading-4 truncate">
              {row.floatingIp}
            </span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="shrink-0 text-[var(--color-action-primary)]"
            />
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)] leading-4 truncate">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'networkName',
      label: 'Network',
      flex: 1,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-body-md text-[var(--color-text-default)] leading-4 truncate">
            {row.networkName}
          </span>
          <span className="text-body-sm text-[var(--color-text-subtle)] leading-4 truncate">
            ID : {row.networkId}
          </span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
    },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Associate floating IP"
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssociate}
            disabled={isSubmitting}
            className="w-[152px]"
          >
            {isSubmitting ? 'Associating...' : 'Associate'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        <InfoBox.Group>
          <InfoBox label="Load balancer" value={loadBalancer.name} />
          <InfoBox
            label="Owned network"
            value={`${loadBalancer.networkName} (ID : ${loadBalancer.networkId})`}
          />
        </InfoBox.Group>

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
            selectedCount={selectedFloatingIpId ? 1 : 0}
          />

          <VStack gap={2}>
            <Table<FloatingIPItem>
              columns={floatingIPColumns}
              data={paginatedFloatingIPs}
              rowKey="id"
              onRowClick={(row) => setSelectedFloatingIpId(row.id)}
              emptyMessage="No floating IPs found"
            />
            <SelectionIndicator
              selectedItems={
                selectedFloatingIP
                  ? [{ id: selectedFloatingIP.id, label: selectedFloatingIP.floatingIp }]
                  : []
              }
              onRemove={() => setSelectedFloatingIpId(null)}
              emptyText="No item selected"
              error={hasAttemptedSubmit && !selectedFloatingIpId}
              errorMessage="Please select a floating IP."
              className="w-full"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AssociateFloatingIPToLBDrawer;
