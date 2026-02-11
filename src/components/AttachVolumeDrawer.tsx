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
  fixedColumns,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconLock } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InstanceItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'shutoff';
  isLocked: boolean;
  fixedIP: string;
  flavor: string;
  attachedVolumes: string[];
}

export interface VolumeInfo {
  id: string;
  name: string;
}

export interface AttachVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume: VolumeInfo;
  instances?: InstanceItem[];
  onAttach?: (instanceId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultInstances: InstanceItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29tgj${234 + i}`,
  name: 'server-02',
  status: 'active',
  isLocked: true,
  fixedIP: '10.62.0.31',
  flavor: 'm1.medium',
  attachedVolumes: ['vol-01'],
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   Column definitions
   ---------------------------------------- */

const getInstanceColumns = (
  selectedInstanceId: string | null,
  onSelect: (id: string) => void
): TableColumn<InstanceItem>[] => [
  {
    key: 'radio' as keyof InstanceItem,
    label: '',
    width: '40px',
    render: (_, row) => (
      <Radio
        name="instance-select"
        value={row.id}
        checked={selectedInstanceId === row.id}
        onChange={() => onSelect(row.id)}
      />
    ),
  },
  {
    key: 'status',
    label: 'Status',
    width: fixedColumns.status,
    align: 'center',
    render: (_, row) => <StatusIndicator status={row.status} layout="icon-only" size="sm" />,
  },
  {
    key: 'name',
    label: 'Name',
    flex: 1,
    sortable: true,
    render: (_, row) => (
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1.5">
          <span className="font-medium text-[var(--color-action-primary)] truncate">
            {row.name}
          </span>
          <IconExternalLink size={12} className="shrink-0 text-[var(--color-action-primary)]" />
        </span>
        <span className="text-body-sm text-[var(--color-text-subtle)] truncate">ID : {row.id}</span>
      </div>
    ),
  },
  {
    key: 'isLocked',
    label: 'Locked',
    width: '62px',
    align: 'center',
    render: (_, row) =>
      row.isLocked ? (
        <IconLock size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
      ) : null,
  },
  { key: 'fixedIP', label: 'Fixed IP', flex: 1 },
  { key: 'flavor', label: 'Flavor', flex: 1, sortable: true },
  {
    key: 'attachedVolumes',
    label: 'Attached volumes',
    flex: 1,
    render: (_, row) => <>{row.attachedVolumes.join(', ') || '-'}</>,
  },
];

/* ----------------------------------------
   AttachVolumeDrawer Component
   ---------------------------------------- */

export function AttachVolumeDrawer({
  isOpen,
  onClose,
  volume,
  instances = defaultInstances,
  onAttach,
}: AttachVolumeDrawerProps) {
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
      inst.fixedIP.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.flavor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInstances.length / ITEMS_PER_PAGE);
  const paginatedInstances = filteredInstances.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedInstanceId(null);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleAttach = async () => {
    setHasAttemptedSubmit(true);

    if (!selectedInstanceId) return;

    setIsSubmitting(true);
    try {
      await onAttach?.(selectedInstanceId);
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
  const instanceColumns = getInstanceColumns(selectedInstanceId, setSelectedInstanceId);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAttach}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Attaching...' : 'Attach'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={3} className="h-full">
        {/* Header Section */}
        <VStack gap={2}>
          <VStack gap={0}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Attach Volume
            </h2>
          </VStack>
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            Attach one or more available volumes to this instance. Once attached, the volumes will
            appear as additional storage devices inside the instance.
          </p>
        </VStack>

        {/* Volume Info Box */}
        <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
          <VStack gap={1.5}>
            <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">Volume</span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {volume?.name || '-'}
            </span>
          </VStack>
        </div>

        {/* Instances Section */}
        <VStack gap={3} className="mt-3 pb-5">
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
          />

          {/* Instances Table + Selection Indicator */}
          <VStack gap={2} className="w-full">
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
              className="shrink-0 w-full"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AttachVolumeDrawer;
