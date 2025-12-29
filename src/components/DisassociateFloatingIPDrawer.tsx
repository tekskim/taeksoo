import { useState } from 'react';
import { 
  Drawer, 
  Button, 
  SearchInput, 
  Pagination, 
  StatusIndicator,
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
  floatingIpId: string;
  status: 'active' | 'down' | 'error';
  fixedIp: string;
  createdAt: string;
}

export interface DisassociateFloatingIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName: string;
  floatingIPs?: FloatingIPItem[];
  onDisassociate?: (floatingIpId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFloatingIPs: FloatingIPItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `floating-ip-${i + 1}`,
  floatingIp: '203.0.113.25',
  floatingIpId: '17kfj123',
  status: 'active',
  fixedIp: '10.0.0.5',
  createdAt: '2025-09-01',
}));

/* ----------------------------------------
   DisassociateFloatingIPDrawer Component
   ---------------------------------------- */

export function DisassociateFloatingIPDrawer({
  isOpen,
  onClose,
  instanceName,
  floatingIPs = mockFloatingIPs,
  onDisassociate,
}: DisassociateFloatingIPDrawerProps) {
  const [selectedFloatingIpId, setSelectedFloatingIpId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = 115;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const filteredFloatingIPs = floatingIPs.filter(ip =>
    ip.floatingIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ip.fixedIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ip.floatingIpId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDisassociate = async () => {
    if (!selectedFloatingIpId) return;
    
    setIsSubmitting(true);
    try {
      await onDisassociate?.(selectedFloatingIpId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFloatingIpId(null);
    setSearchTerm('');
    setCurrentPage(1);
    onClose();
  };

  // Floating IP Table columns
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
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: () => (
        <StatusIndicator status="active" layout="icon-only" size="sm" />
      ),
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      sortable: true,
      render: (_, row) => (
        <VStack gap={0}>
          <HStack gap={1} align="center">
            <span className="text-[12px] font-medium text-[var(--color-action-primary)]">{row.floatingIp}</span>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-[11px] text-[var(--color-text-muted)]">ID: {row.floatingIpId}</span>
        </VStack>
      ),
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
      sortable: true,
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
  ];

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
            size="md"
            className="w-[152px]"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleDisassociate}
            disabled={!selectedFloatingIpId || isSubmitting}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Disassociating...' : 'Disassociate'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full overflow-y-auto">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Disassociate Floating IP
            </h2>
            <p className="text-[12px] text-[var(--color-text-muted)] leading-4">
              Remove the association between this floating IP and the instance. Once disassociated, the instance will lose external network access through this IP.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full p-4 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-[11px] text-[var(--color-text-muted)] mb-1">Instance</div>
            <div className="text-[12px] text-[var(--color-text-default)]">{instanceName}</div>
          </div>
        </VStack>

        {/* Floating IPs Section */}
        <VStack gap={3}>
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">Floating IPs</h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
              placeholder="Find floating IP with filters"
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
              size="sm"
            />
            <div className="w-px h-4 bg-[var(--color-border-default)] mx-2" />
            <span className="text-[11px] text-[var(--color-text-muted)]">{totalItems} items</span>
          </HStack>

          {/* Floating IP Table */}
          <Table<FloatingIPItem>
            columns={columns}
            data={filteredFloatingIPs}
            rowKey="id"
            selectedKeys={selectedFloatingIpId ? [selectedFloatingIpId] : []}
            onRowClick={(row) => setSelectedFloatingIpId(row.id)}
            emptyMessage="No floating IPs available"
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default DisassociateFloatingIPDrawer;

