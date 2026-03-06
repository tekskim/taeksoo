import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  StatusIndicator,
  SelectionIndicator,
  Table,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconLock } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InstanceItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'shutoff';
  locked: boolean;
  fixedIp: string;
  floatingIp: string | null;
  az: string;
}

export interface AttachPortToInstanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  portId: string;
  portName: string;
  instances?: InstanceItem[];
  onSubmit?: (data: { instanceId: string }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultInstances: InstanceItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29tgj${234 + i}`,
  name: 'server-1',
  status: 'active',
  locked: true,
  fixedIp: '10.62.0.31',
  floatingIp: null,
  az: 'zone-a',
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   AttachPortToInstanceDrawer Component
   ---------------------------------------- */

export function AttachPortToInstanceDrawer({
  isOpen,
  onClose,

  portId,
  portName,
  instances = defaultInstances,
  onSubmit,
}: AttachPortToInstanceDrawerProps) {
  // Instance selection state
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Filter instances
  const filteredInstances = instances.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.fixedIp.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInstances.length / ITEMS_PER_PAGE);
  const paginatedInstances = filteredInstances.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedInstanceId(null);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    if (!selectedInstanceId) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({ instanceId: selectedInstanceId });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedInstanceId(null);
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const selectedInstance = instances.find((i) => i.id === selectedInstanceId);

  const instanceColumns: TableColumn<InstanceItem>[] = [
    {
      key: 'id' as keyof InstanceItem,
      label: '',
      width: 40,
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="instance-select"
            value={row.id}
            checked={selectedInstanceId === row.id}
            onChange={() => setSelectedInstanceId(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 60,
      align: 'center',
      render: (_value, row) => <StatusIndicator status={row.status} size="sm" />,
    },
    {
      key: 'name',
      label: 'Name',
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <HStack gap={1.5} align="center">
            <span className="text-label-md text-[var(--color-action-primary)] truncate">
              {row.name}
            </span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="shrink-0 text-[var(--color-action-primary)]"
            />
          </HStack>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'locked',
      label: 'Locked',
      width: 62,
      align: 'center',
      render: (_value, row) =>
        row.locked ? (
          <IconLock size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
        ) : null,
    },
    { key: 'fixedIp', label: 'Fixed IP' },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      render: (value) => value ?? '-',
    },
    { key: 'az', label: 'AZ' },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Attach to instance"
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Attaching...' : 'Attach'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Port Info */}
        <div className="w-full bg-[var(--color-surface-muted)] rounded-lg px-4 py-3">
          <VStack gap={1.5}>
            <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
              Port name
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {portName}
            </span>
          </VStack>
        </div>

        {/* Instances Section */}
        <VStack gap={3} className="w-full pb-5">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">Instances</h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search instance by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredInstances.length}
            onPageChange={setCurrentPage}
            selectedCount={selectedInstanceId ? 1 : 0}
          />

          <VStack gap={2}>
            <Table<InstanceItem>
              columns={instanceColumns}
              data={paginatedInstances}
              rowKey="id"
              onRowClick={(row) => setSelectedInstanceId(row.id)}
              emptyMessage="No instances found"
            />
            <SelectionIndicator
              selectedItems={
                selectedInstance ? [{ id: selectedInstance.id, label: selectedInstance.name }] : []
              }
              onRemove={() => setSelectedInstanceId(null)}
              emptyText="No item selected"
              error={hasAttemptedSubmit && !selectedInstanceId}
              errorMessage="Please select an instance."
              className="shrink-0 w-[648px]"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AttachPortToInstanceDrawer;
