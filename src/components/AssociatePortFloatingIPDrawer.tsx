import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  Radio,
  StatusIndicator,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface FixedIPItem {
  id: string;
  fixedIp: string;
  macAddress: string;
  subnetCidr: string;
}

export interface FloatingIPItem {
  id: string;
  status: 'active' | 'inactive' | 'error';
  floatingIp: string;
  networkName: string;
  networkId: string;
  description: string;
}

export interface AssociatePortFloatingIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  portName: string;
  fixedIPs?: FixedIPItem[];
  floatingIPs?: FloatingIPItem[];
  onAssociate?: (fixedIpId: string, floatingIpId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFixedIPs: FixedIPItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `fixed-${i + 1}`,
  fixedIp: '10.0.0.5',
  macAddress: '10.0.01',
  subnetCidr: '192.168.10.0/24',
}));

const mockFloatingIPs: FloatingIPItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `k2l2j${123 + i}`,
  status: 'active',
  floatingIp: '203.0.140.25',
  networkName: 'net-02',
  networkId: `17kfj${123 + i}`,
  description: '-',
}));

/* ----------------------------------------
   AssociatePortFloatingIPDrawer Component
   ---------------------------------------- */

export function AssociatePortFloatingIPDrawer({
  isOpen,
  onClose,
  portName,
  fixedIPs = mockFixedIPs,
  floatingIPs = mockFloatingIPs,
  onAssociate,
}: AssociatePortFloatingIPDrawerProps) {
  // Fixed IP state
  const [fixedIpSearchTerm, setFixedIpSearchTerm] = useState('');
  const [selectedFixedIpId, setSelectedFixedIpId] = useState<string | null>(null);
  const [fixedIpCurrentPage, setFixedIpCurrentPage] = useState(1);

  // Floating IP state
  const [floatingIpSearchTerm, setFloatingIpSearchTerm] = useState('');
  const [selectedFloatingIpId, setSelectedFloatingIpId] = useState<string | null>(null);
  const [floatingIpCurrentPage, setFloatingIpCurrentPage] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fixedIpItemsPerPage = 5;
  const floatingIpItemsPerPage = 5;

  // Fixed IP filtering and pagination
  const filteredFixedIPs = fixedIPs.filter(
    (ip) =>
      ip.fixedIp.toLowerCase().includes(fixedIpSearchTerm.toLowerCase()) ||
      ip.macAddress.toLowerCase().includes(fixedIpSearchTerm.toLowerCase()) ||
      ip.subnetCidr.toLowerCase().includes(fixedIpSearchTerm.toLowerCase())
  );

  const paginatedFixedIPs = filteredFixedIPs.slice(
    (fixedIpCurrentPage - 1) * fixedIpItemsPerPage,
    fixedIpCurrentPage * fixedIpItemsPerPage
  );

  // Floating IP filtering and pagination
  const filteredFloatingIPs = floatingIPs.filter(
    (ip) =>
      ip.floatingIp.toLowerCase().includes(floatingIpSearchTerm.toLowerCase()) ||
      ip.networkName.toLowerCase().includes(floatingIpSearchTerm.toLowerCase()) ||
      ip.description.toLowerCase().includes(floatingIpSearchTerm.toLowerCase())
  );

  const paginatedFloatingIPs = filteredFloatingIPs.slice(
    (floatingIpCurrentPage - 1) * floatingIpItemsPerPage,
    floatingIpCurrentPage * floatingIpItemsPerPage
  );

  const fixedIpColumns: TableColumn<FixedIPItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="fixed-ip-select"
          value={row.id}
          checked={selectedFixedIpId === row.id}
          onChange={() => setSelectedFixedIpId(row.id)}
        />
      ),
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
      sortable: true,
    },
    {
      key: 'macAddress',
      label: 'MAC Address',
    },
    {
      key: 'subnetCidr',
      label: 'Subnet CIDR',
    },
  ];

  const floatingIpColumns: TableColumn<FloatingIPItem>[] = [
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
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, item) => (
        <StatusIndicator status={item.status} layout="icon-only" size="sm" />
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
          <a
            href={`/networks/${item.networkId}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{item.networkName}</span>
            <IconExternalLink size={12} className="flex-shrink-0" />
          </a>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {item.networkId}
          </span>
        </VStack>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
    },
  ];

  const handleAssociate = async () => {
    if (!selectedFixedIpId || !selectedFloatingIpId) return;
    setIsSubmitting(true);
    try {
      await onAssociate?.(selectedFixedIpId, selectedFloatingIpId);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFixedIpSearchTerm('');
    setFloatingIpSearchTerm('');
    setSelectedFixedIpId(null);
    setSelectedFloatingIpId(null);
    setFixedIpCurrentPage(1);
    setFloatingIpCurrentPage(1);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Associate Floating IP"
      description="Associate a floating IP with this port to enable external network access."
      width={696}
      footer={
        <HStack gap={2} justifyContent="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} size="md" className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssociate}
            disabled={isSubmitting || !selectedFixedIpId || !selectedFloatingIpId}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Associating...' : 'Associate'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Port Info */}
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] mb-1.5">
            Port
          </p>
          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {portName}
          </p>
        </div>

        {/* Fixed IP Section */}
        <VStack gap={3} className="flex-1">
          <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
            Fixed IP
          </h6>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              placeholder="Find Fixed IP with filters"
              value={fixedIpSearchTerm}
              onChange={(e) => setFixedIpSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Pagination */}
          <HStack gap={2} alignItems="center" className="w-full">
            <Pagination
              totalItems={filteredFixedIPs.length}
              itemsPerPage={fixedIpItemsPerPage}
              currentPage={fixedIpCurrentPage}
              onPageChange={setFixedIpCurrentPage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)]" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              {filteredFixedIPs.length} items
            </span>
          </HStack>

          {/* Fixed IP Table */}
          <div className="overflow-auto">
            <Table<FixedIPItem>
              columns={fixedIpColumns}
              data={paginatedFixedIPs}
              rowKey="id"
              selectedKeys={selectedFixedIpId ? [selectedFixedIpId] : []}
              onRowClick={(row) => setSelectedFixedIpId(row.id)}
              emptyMessage="No fixed IPs available"
            />
          </div>
        </VStack>

        {/* Divider */}
        <div className="w-full h-px bg-[var(--color-border-default)]" />

        {/* Floating IP Section */}
        <VStack gap={3} className="flex-1">
          <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
            Floating IP
          </h6>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              placeholder="Find floating IP with filters"
              value={floatingIpSearchTerm}
              onChange={(e) => setFloatingIpSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Pagination */}
          <HStack gap={2} alignItems="center" className="w-full">
            <Pagination
              totalItems={filteredFloatingIPs.length}
              itemsPerPage={floatingIpItemsPerPage}
              currentPage={floatingIpCurrentPage}
              onPageChange={setFloatingIpCurrentPage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)]" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              {filteredFloatingIPs.length} items
            </span>
          </HStack>

          {/* Floating IP Table */}
          <div className="overflow-auto">
            <Table<FloatingIPItem>
              columns={floatingIpColumns}
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

export default AssociatePortFloatingIPDrawer;

