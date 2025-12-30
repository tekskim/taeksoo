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

export interface FixedIPItem {
  id: string;
  fixedIp: string;
  macAddress: string;
  network: string;
  networkId: string;
  subnetCidr: string;
}

export interface FloatingIPItem {
  id: string;
  floatingIp: string;
  floatingIpId: string;
  status: 'active' | 'down' | 'error';
  network: string;
  networkId: string;
  description: string;
}

export interface AssociateFloatingIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName: string;
  fixedIPs?: FixedIPItem[];
  floatingIPs?: FloatingIPItem[];
  onAssociate?: (fixedIpId: string, floatingIpId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFixedIPs: FixedIPItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: `fixed-ip-${i + 1}`,
  fixedIp: '10.0.0.5',
  macAddress: '10.0.0.5',
  network: 'net-02',
  networkId: '17kfj123',
  subnetCidr: '192.168.10.0/24',
}));

const mockFloatingIPs: FloatingIPItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: `floating-ip-${i + 1}`,
  floatingIp: '203.0.140.25',
  floatingIpId: 'k2l2j123',
  status: 'active',
  network: 'net-02',
  networkId: '17kfj123',
  description: '-',
}));

/* ----------------------------------------
   AssociateFloatingIPDrawer Component
   ---------------------------------------- */

export function AssociateFloatingIPDrawer({
  isOpen,
  onClose,
  instanceName,
  fixedIPs = mockFixedIPs,
  floatingIPs = mockFloatingIPs,
  onAssociate,
}: AssociateFloatingIPDrawerProps) {
  const [selectedFixedIpId, setSelectedFixedIpId] = useState<string | null>(null);
  const [selectedFloatingIpId, setSelectedFloatingIpId] = useState<string | null>(null);
  const [fixedIpSearch, setFixedIpSearch] = useState('');
  const [floatingIpSearch, setFloatingIpSearch] = useState('');
  const [fixedIpPage, setFixedIpPage] = useState(1);
  const [floatingIpPage, setFloatingIpPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = 115;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleAssociate = async () => {
    if (!selectedFixedIpId || !selectedFloatingIpId) return;
    
    setIsSubmitting(true);
    try {
      await onAssociate?.(selectedFixedIpId, selectedFloatingIpId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFixedIpId(null);
    setSelectedFloatingIpId(null);
    setFixedIpSearch('');
    setFloatingIpSearch('');
    setFixedIpPage(1);
    setFloatingIpPage(1);
    onClose();
  };

  // Fixed IP Table columns
  const fixedIPColumns: TableColumn<FixedIPItem>[] = [
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
          onChange={() => {
            setSelectedFixedIpId(row.id);
            setSelectedFloatingIpId(null); // Reset floating IP selection
          }}
        />
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
      key: 'macAddress',
      label: 'Mac Address',
      sortable: true,
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'network',
      label: 'Network',
      sortable: true,
      render: (_, row) => (
        <VStack gap={0}>
          <HStack gap={1} align="center">
            <span className="text-[12px] font-medium text-[var(--color-action-primary)]">{row.network}</span>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-[11px] text-[var(--color-text-muted)]">ID: {row.networkId}</span>
        </VStack>
      ),
    },
    {
      key: 'subnetCidr',
      label: 'Subnet CIDR',
      sortable: true,
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
  ];

  // Floating IP Table columns
  const floatingIPColumns: TableColumn<FloatingIPItem>[] = [
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
      key: 'network',
      label: 'Network',
      sortable: true,
      render: (_, row) => (
        <VStack gap={0}>
          <HStack gap={1} align="center">
            <span className="text-[12px] font-medium text-[var(--color-action-primary)]">{row.network}</span>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-[11px] text-[var(--color-text-muted)]">ID: {row.networkId}</span>
        </VStack>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
  ];

  // Floating IPs empty state columns (header only)
  const floatingIPEmptyColumns: TableColumn<FloatingIPItem>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      sortable: true,
    },
    {
      key: 'network',
      label: 'Network',
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
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
            onClick={handleAssociate}
            disabled={!selectedFixedIpId || !selectedFloatingIpId || isSubmitting}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Associating...' : 'Associate'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full overflow-y-auto">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Associate Floating IP
            </h2>
            <p className="text-[12px] text-[var(--color-text-muted)] leading-4">
              Assign a floating IP to this instance for external network access.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full p-4 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-[11px] text-[var(--color-text-muted)] mb-1">Instance</div>
            <div className="text-[12px] text-[var(--color-text-default)]">{instanceName}</div>
          </div>
        </VStack>

        {/* Fixed IP Section */}
        <VStack gap={3}>
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">Fixed IP</h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={fixedIpSearch}
              onChange={(e) => setFixedIpSearch(e.target.value)}
              onClear={() => setFixedIpSearch('')}
              placeholder="Find Fixed IP with filters"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <HStack gap={2} align="center">
            <Pagination
              currentPage={fixedIpPage}
              totalPages={totalPages}
              onPageChange={setFixedIpPage}
              size="sm"
            />
            <div className="w-px h-4 bg-[var(--color-border-default)] mx-2" />
            <span className="text-[11px] text-[var(--color-text-muted)]">{totalItems} items</span>
          </HStack>

          {/* Fixed IP Table */}
          <Table<FixedIPItem>
            columns={fixedIPColumns}
            data={fixedIPs}
            rowKey="id"
            selectedKeys={selectedFixedIpId ? [selectedFixedIpId] : []}
            onRowClick={(row) => {
              setSelectedFixedIpId(row.id);
              setSelectedFloatingIpId(null);
            }}
            emptyMessage="No fixed IPs available"
          />
        </VStack>

        {/* Floating IPs Section - Empty State */}
        {!selectedFixedIpId && (
          <VStack gap={3}>
            <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">Floating IPs</h3>

            {/* Search */}
            <div className="w-[280px]">
              <SearchInput
                value=""
                onChange={() => {}}
                placeholder="Find floating IP with filters"
                size="sm"
                fullWidth
                disabled
              />
            </div>

            {/* Empty Table with message */}
            <div className="border border-[var(--color-border-default)] rounded-lg overflow-hidden">
              <Table<FloatingIPItem>
                columns={floatingIPEmptyColumns}
                data={[]}
                rowKey="id"
                emptyMessage=""
              />
              <div className="flex items-center justify-center py-10 text-[12px] text-[var(--color-text-muted)] text-center">
                Select an instance IP address from the list above<br />
                to view available Floating IPs for association.
              </div>
            </div>
          </VStack>
        )}

        {/* Floating IPs Section - With Data */}
        {selectedFixedIpId && (
          <VStack gap={3}>
            <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">Floating IPs</h3>

            {/* Pagination */}
            <HStack gap={2} align="center">
              <Pagination
                currentPage={floatingIpPage}
                totalPages={totalPages}
                onPageChange={setFloatingIpPage}
                size="sm"
              />
              <div className="w-px h-4 bg-[var(--color-border-default)] mx-2" />
              <span className="text-[11px] text-[var(--color-text-muted)]">{totalItems} items</span>
            </HStack>

            {/* Search */}
            <div className="w-[280px]">
              <SearchInput
                value={floatingIpSearch}
                onChange={(e) => setFloatingIpSearch(e.target.value)}
                onClear={() => setFloatingIpSearch('')}
                placeholder="Find floating IP with filters"
                size="sm"
                fullWidth
              />
            </div>

            {/* Floating IP Table */}
            <Table<FloatingIPItem>
              columns={floatingIPColumns}
              data={floatingIPs}
              rowKey="id"
              selectedKeys={selectedFloatingIpId ? [selectedFloatingIpId] : []}
              onRowClick={(row) => setSelectedFloatingIpId(row.id)}
              emptyMessage="No floating IPs available"
            />
          </VStack>
        )}
      </VStack>
    </Drawer>
  );
}

export default AssociateFloatingIPDrawer;


