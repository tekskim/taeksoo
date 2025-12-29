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
import { IconExternalLink, IconLock } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InstanceItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  locked: boolean;
  fixedIp: string;
  floatingIp: string;
  az: string;
}

export interface AttachPortToInstanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  portName: string;
  instances?: InstanceItem[];
  onAttach?: (instanceId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockInstances: InstanceItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29tgj${234 + i}`,
  name: `server-${(i % 9) + 1}`,
  status: 'active' as const,
  locked: true,
  fixedIp: '10.62.0.31',
  floatingIp: '-',
  az: 'zone-a',
}));

/* ----------------------------------------
   AttachPortToInstanceDrawer Component
   ---------------------------------------- */

export function AttachPortToInstanceDrawer({
  isOpen,
  onClose,
  portName,
  instances = mockInstances,
  onAttach,
}: AttachPortToInstanceDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 10;

  const filteredInstances = instances.filter(
    (instance) =>
      instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.fixedIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.az.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedInstances = filteredInstances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: TableColumn<InstanceItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="instance-select"
          value={row.id}
          checked={selectedInstanceId === row.id}
          onChange={() => setSelectedInstanceId(row.id)}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, item) => <StatusIndicator status={item.status} layout="icon-only" size="sm" />,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <a
            href={`/instances/${item.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{item.name}</span>
            <IconExternalLink size={12} className="flex-shrink-0" />
          </a>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {item.id}
          </span>
        </VStack>
      ),
    },
    {
      key: 'locked',
      label: 'Locked',
      width: '62px',
      align: 'center',
      render: (_, item) =>
        item.locked ? (
          <IconLock size={14} className="text-[var(--color-text-subtle)]" />
        ) : null,
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
    },
    {
      key: 'az',
      label: 'AZ',
    },
  ];

  const handleAttach = async () => {
    if (!selectedInstanceId) return;
    setIsSubmitting(true);
    try {
      await onAttach?.(selectedInstanceId);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedInstanceId(null);
    setCurrentPage(1);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Attach to Instance"
      width={696}
      footer={
        <HStack gap={2} justifyContent="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} size="md" className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAttach}
            disabled={isSubmitting || !selectedInstanceId}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Attaching...' : 'Attach'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Port Info */}
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] mb-1.5">
            Port name
          </p>
          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {portName}
          </p>
        </div>

        {/* Instances Section */}
        <VStack gap={3} className="flex-1">
          <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
            Instances
          </h6>

          {/* Search */}
          <HStack justifyContent="start" className="w-[280px]">
            <SearchInput
              placeholder="Find Instance with filters"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </HStack>

          {/* Pagination */}
          <HStack gap={2} alignItems="center" className="w-full">
            <Pagination
              totalItems={filteredInstances.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)]" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              {filteredInstances.length} items
            </span>
          </HStack>

          {/* Instance Table */}
          <div className="flex-1 overflow-auto">
            <Table<InstanceItem>
              columns={columns}
              data={paginatedInstances}
              rowKey="id"
              selectedKeys={selectedInstanceId ? [selectedInstanceId] : []}
              onRowClick={(row) => setSelectedInstanceId(row.id)}
              emptyMessage="No instances available"
            />
          </div>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AttachPortToInstanceDrawer;

