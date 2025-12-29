import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  Radio,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface FloatingIPItem {
  id: string;
  floatingIp: string;
  networkName: string;
  networkId: string;
  createdAt: string;
}

export interface AssociateLBFloatingIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  loadBalancerName: string;
  ownedNetworkName: string;
  ownedNetworkId: string;
  floatingIPs?: FloatingIPItem[];
  onAssociate?: (floatingIpId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFloatingIPs: FloatingIPItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `45ghj${567 + i}`,
  floatingIp: '10.0.0.5',
  networkName: 'net-02',
  networkId: `45ghj${567 + i}`,
  createdAt: '2025-08-23',
}));

/* ----------------------------------------
   AssociateLBFloatingIPDrawer Component
   ---------------------------------------- */

export function AssociateLBFloatingIPDrawer({
  isOpen,
  onClose,
  loadBalancerName,
  ownedNetworkName,
  ownedNetworkId,
  floatingIPs = mockFloatingIPs,
  onAssociate,
}: AssociateLBFloatingIPDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloatingIpId, setSelectedFloatingIpId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 10;

  const filteredFloatingIPs = floatingIPs.filter(
    (ip) =>
      ip.floatingIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ip.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ip.networkName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedFloatingIPs = filteredFloatingIPs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: TableColumn<FloatingIPItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="floating-ip-select"
          value={row.id}
          checked={selectedFloatingIpId === row.id}
          onChange={() => setSelectedFloatingIpId(row.id)}
        />
      ),
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      sortable: true,
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <a
            href={`/floating-ips/${item.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{item.floatingIp}</span>
            <IconExternalLink size={12} className="flex-shrink-0" />
          </a>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {item.id}
          </span>
        </VStack>
      ),
    },
    {
      key: 'network',
      label: 'Network',
      sortable: true,
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {item.networkName}
          </span>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {item.networkId}
          </span>
        </VStack>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
    },
  ];

  const handleAssociate = async () => {
    if (!selectedFloatingIpId) return;
    setIsSubmitting(true);
    try {
      await onAssociate?.(selectedFloatingIpId);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedFloatingIpId(null);
    setCurrentPage(1);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Associate Floating IP"
      width={696}
      footer={
        <HStack gap={2} justifyContent="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} size="md" className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssociate}
            disabled={isSubmitting || !selectedFloatingIpId}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Associating...' : 'Associate'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Load Balancer Info */}
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] mb-1.5">
            Load balancer
          </p>
          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {loadBalancerName}
          </p>
        </div>

        {/* Owned Network Info */}
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] mb-1.5">
            Owned Network
          </p>
          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {ownedNetworkName} (ID : {ownedNetworkId})
          </p>
        </div>

        {/* Floating IP Section */}
        <VStack gap={3} className="flex-1">
          <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
            Floating IP
          </h6>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              placeholder="Find floating IP with filters"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Pagination */}
          <HStack gap={2} alignItems="center" className="w-full">
            <Pagination
              totalItems={filteredFloatingIPs.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)]" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              {filteredFloatingIPs.length} items
            </span>
          </HStack>

          {/* Floating IP Table */}
          <div className="flex-1 overflow-auto">
            <Table<FloatingIPItem>
              columns={columns}
              data={paginatedFloatingIPs}
              rowKey="id"
              selectedKeys={selectedFloatingIpId ? [selectedFloatingIpId] : []}
              onRowClick={(row) => setSelectedFloatingIpId(row.id)}
              emptyMessage="No floating IPs available"
            />
          </div>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AssociateLBFloatingIPDrawer;

