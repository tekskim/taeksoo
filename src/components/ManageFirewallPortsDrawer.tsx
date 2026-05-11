import { useState, useEffect, useMemo } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  StatusIndicator,
  Table,
  InfoBox,
  fixedColumns,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface PortItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'shutoff';
  routerName: string;
  routerId: string;
  fixedIP: string;
  networkName: string;
  networkId: string;
}

export interface FirewallInfo {
  id: string;
  name: string;
}

export interface ManageFirewallPortsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  firewall: FirewallInfo;
  ports?: PortItem[];
  initialSelectedPortIds?: string[];
  onSubmit?: (selectedPortIds: string[]) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultPorts: PortItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `12345678`,
  name: 'port',
  status: 'active' as PortItem['status'],
  routerName: 'router',
  routerId: '12345678',
  fixedIP: '10.7.60.135',
  networkName: 'network',
  networkId: '12345678',
}));

const ITEMS_PER_PAGE = 10;

/* ----------------------------------------
   Column definitions
   ---------------------------------------- */

const portColumns: TableColumn<PortItem>[] = [
  {
    key: 'status',
    label: 'Status',
    width: fixedColumns.status,
    align: 'center',
    render: (_, row) => <StatusIndicator layout="icon-only" status={row.status} size="sm" />,
  },
  {
    key: 'name',
    label: 'Name',
    flex: 1,
    sortable: true,
    render: (_, row) => (
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1">
          <span className="text-label-md text-[var(--color-action-primary)] truncate">
            {row.name}
          </span>
          <IconExternalLink size={12} className="shrink-0 text-[var(--color-action-primary)]" />
        </span>
        <span className="text-body-sm text-[var(--color-text-subtle)] truncate">ID: {row.id}</span>
      </div>
    ),
  },
  {
    key: 'routerName' as keyof PortItem,
    label: 'Router',
    flex: 1,
    sortable: true,
    render: (_, row) => (
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1">
          <span className="text-label-md text-[var(--color-action-primary)] truncate">
            {row.routerName}
          </span>
          <IconExternalLink size={12} className="shrink-0 text-[var(--color-action-primary)]" />
        </span>
        <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
          ID: {row.routerId}
        </span>
      </div>
    ),
  },
  {
    key: 'fixedIP',
    label: 'Fixed IP',
    flex: 1,
  },
  {
    key: 'networkName' as keyof PortItem,
    label: 'Owned Network',
    flex: 1,
    sortable: true,
    render: (_, row) => (
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1">
          <span className="text-label-md text-[var(--color-action-primary)] truncate">
            {row.networkName}
          </span>
          <IconExternalLink size={12} className="shrink-0 text-[var(--color-action-primary)]" />
        </span>
        <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
          ID: {row.networkId}
        </span>
      </div>
    ),
  },
];

/* ----------------------------------------
   ManageFirewallPortsDrawer Component
   ---------------------------------------- */

export function ManageFirewallPortsDrawer({
  isOpen,
  onClose,
  firewall,
  ports = defaultPorts,
  initialSelectedPortIds = [],
  onSubmit,
}: ManageFirewallPortsDrawerProps) {
  const [selectedPortIds, setSelectedPortIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredPorts = useMemo(
    () =>
      ports.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.routerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.fixedIP.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.networkName.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [ports, searchQuery]
  );

  const totalPages = Math.ceil(filteredPorts.length / ITEMS_PER_PAGE);
  const paginatedPorts = filteredPorts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedPortIds(initialSelectedPortIds);
      setSearchQuery('');
      setCurrentPage(1);
      setIsSubmitting(false);
    }
  }, [isOpen, initialSelectedPortIds]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.(selectedPortIds);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setCurrentPage(1);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage ports"
      width={696}
      footer={
        <HStack gap={2} className="w-full max-w-[328px] mx-auto">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <InfoBox label="Firewall" value={firewall.name} />

        <VStack gap={3}>
          <VStack gap={1}>
            <span className="text-heading-h6 text-[var(--color-text-default)]">Ports</span>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              Select ports from the list to associate with the firewall.
            </span>
          </VStack>

          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            onClear={() => {
              setSearchQuery('');
              setCurrentPage(1);
            }}
            placeholder="Search ports by attributes"
            size="sm"
            className="w-[280px]"
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPorts.length}
            onPageChange={setCurrentPage}
            selectedCount={selectedPortIds.length}
          />

          <Table<PortItem>
            columns={portColumns}
            data={paginatedPorts}
            rowKey="id"
            selectable
            selectedKeys={selectedPortIds}
            onSelectionChange={setSelectedPortIds}
            emptyMessage="No ports found"
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageFirewallPortsDrawer;
