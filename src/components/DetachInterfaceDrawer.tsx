import { useState } from 'react';
import { 
  Drawer, 
  Button, 
  SearchInput, 
  Pagination, 
  StatusIndicator,
  Table,
  Radio,
  InlineMessage,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InterfaceItem {
  id: string;
  name: string;
  status: 'active' | 'down' | 'error';
  fixedIp: string;
  floatingIp: string;
  macAddress: string;
}

export interface DetachInterfaceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName: string;
  interfaces?: InterfaceItem[];
  onDetach?: (interfaceId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockInterfaces: InterfaceItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `interface-${i + 1}`,
  name: 'net-02',
  status: 'active',
  fixedIp: '192.168.10.1',
  floatingIp: '192.168.10.1',
  macAddress: 'fa:16:3e:ab:cd:ef',
}));

/* ----------------------------------------
   DetachInterfaceDrawer Component
   ---------------------------------------- */

export function DetachInterfaceDrawer({
  isOpen,
  onClose,
  instanceName,
  interfaces = mockInterfaces,
  onDetach,
}: DetachInterfaceDrawerProps) {
  const [selectedInterfaceId, setSelectedInterfaceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = 115;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleDetach = async () => {
    if (!selectedInterfaceId) return;
    
    setIsSubmitting(true);
    try {
      await onDetach?.(selectedInterfaceId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedInterfaceId(null);
    setSearchQuery('');
    setCurrentPage(1);
    onClose();
  };

  const filteredInterfaces = interfaces.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Table columns definition
  const columns: TableColumn<InterfaceItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="interface-select"
          value={row.id}
          checked={selectedInterfaceId === row.id}
          onChange={() => setSelectedInterfaceId(row.id)}
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
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, row) => (
        <VStack gap={0}>
          <HStack gap={1} align="center">
            <span className="text-[12px] font-medium text-[var(--color-action-primary)]">{row.name}</span>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-[11px] text-[var(--color-text-muted)]">ID: 17kfj123</span>
        </VStack>
      ),
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'macAddress',
      label: 'MAC Address',
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
            onClick={handleDetach}
            disabled={!selectedInterfaceId || isSubmitting}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Detaching...' : 'Detach'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Detach Interface
            </h2>
            <p className="text-[12px] text-[var(--color-text-muted)] leading-4">
              Detach a network interface from this instance. This may interrupt connectivity if the selected port is primary.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full p-4 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-[11px] text-[var(--color-text-muted)] mb-1">Instance</div>
            <div className="text-[12px] text-[var(--color-text-default)]">{instanceName}</div>
          </div>

          {/* Warning Alert */}
          <InlineMessage variant="warning">
            For data consistency, stop all write operations on the instance before detaching a interface.
          </InlineMessage>
        </VStack>

        {/* Interfaces Section */}
        <VStack gap={3} className="flex-1 min-h-0">
          {/* Interfaces Header */}
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">Interfaces</h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Find interface with filters"
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

          {/* Interface Table */}
          <div className="flex-1 overflow-auto">
            <Table<InterfaceItem>
              columns={columns}
              data={filteredInterfaces}
              rowKey="id"
              selectedKeys={selectedInterfaceId ? [selectedInterfaceId] : []}
              onRowClick={(row) => setSelectedInterfaceId(row.id)}
              emptyMessage="No interfaces available"
            />
          </div>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default DetachInterfaceDrawer;

