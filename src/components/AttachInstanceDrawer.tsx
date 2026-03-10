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
  InfoBox,
  Popover,
  Badge,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconLock } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface AttachedVolume {
  name: string;
  id: string;
}

export interface AttachInstanceItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'shutoff';
  isLocked: boolean;
  fixedIP: string;
  flavor: string;
  attachedVolumes: AttachedVolume[];
}

export interface AttachInstanceVolumeInfo {
  id: string;
  name: string;
}

export interface AttachInstanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume: AttachInstanceVolumeInfo;
  instances?: AttachInstanceItem[];
  onAttach?: (instanceId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultInstances: AttachInstanceItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29tgj${234 + i}`,
  name: 'server-02',
  status: 'active' as const,
  isLocked: true,
  fixedIP: '10.62.0.31',
  flavor: 'm1.medium',
  attachedVolumes: [
    { name: 'volume', id: '294u92s2' },
    { name: 'data-vol', id: '38fa91b1' },
    { name: 'backup-vol', id: '5c2d73e4' },
    { name: 'log-vol', id: '7e1f84a9' },
  ],
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   Column definitions
   ---------------------------------------- */

function AttachedVolumesCell({ volumes }: { volumes: AttachedVolume[] }) {
  if (volumes.length === 0) return <>-</>;

  const first = volumes[0];
  const remaining = volumes.length - 1;

  return (
    <div className="flex flex-col gap-0 min-w-0">
      <div className="flex items-center gap-1 min-w-0">
        <span className="text-body-md text-[var(--color-action-primary)] truncate">
          {first.name}
        </span>
        {remaining > 0 && (
          <Popover
            trigger="hover"
            position="top"
            delay={100}
            hideDelay={100}
            content={
              <div className="p-3 min-w-[120px] max-w-[280px]">
                <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                  All Volumes ({volumes.length})
                </div>
                <div className="flex flex-col gap-1">
                  {volumes.map((vol) => (
                    <Badge key={vol.id} theme="white" size="sm" className="w-fit max-w-full">
                      <span className="break-all">
                        {vol.name} (ID:{vol.id})
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            }
          >
            <span className="text-body-sm text-[var(--color-text-default)] cursor-pointer hover:underline shrink-0">
              (+{remaining})
            </span>
          </Popover>
        )}
      </div>
      <span className="text-body-sm text-[var(--color-text-subtle)] truncate">ID:{first.id}</span>
    </div>
  );
}

const getInstanceColumns = (
  selectedInstanceId: string | null,
  onSelect: (id: string) => void
): TableColumn<AttachInstanceItem>[] => [
  {
    key: 'radio' as keyof AttachInstanceItem,
    label: '',
    width: '40px',
    render: (_, row) => (
      <Radio
        name="attach-instance-select"
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
    render: (_, row) => <StatusIndicator layout="icon-only" status={row.status} size="sm" />,
  },
  {
    key: 'name',
    label: 'Name',
    flex: 1,
    sortable: true,
    render: (_, row) => (
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1.5">
          <span className="text-label-md text-[var(--color-action-primary)] truncate">
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
    render: (_, row) => <AttachedVolumesCell volumes={row.attachedVolumes} />,
  },
];

/* ----------------------------------------
   AttachInstanceDrawer Component
   ---------------------------------------- */

export function AttachInstanceDrawer({
  isOpen,
  onClose,
  volume,
  instances = defaultInstances,
  onAttach,
}: AttachInstanceDrawerProps) {
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

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
      title="Attach Instance"
      description="Attach one or more available volumes to this instance. Once attached, the volumes will appear as additional storage devices inside the instance."
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
      <VStack gap={6} className="h-full">
        <InfoBox label="Volume" value={volume?.name || '-'} />

        <VStack gap={3} className="pb-5">
          <VStack gap={1}>
            <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
              Instances<span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </h3>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              Select an instance from the list to attach the volume.
            </span>
          </VStack>

          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search instances by attributes"
              size="sm"
              fullWidth
            />
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredInstances.length}
            onPageChange={setCurrentPage}
            selectedCount={selectedInstanceId ? 1 : 0}
          />

          <VStack gap={2} className="w-full">
            <Table<AttachInstanceItem>
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

export default AttachInstanceDrawer;
