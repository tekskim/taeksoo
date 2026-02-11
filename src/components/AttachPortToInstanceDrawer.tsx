import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  StatusIndicator,
  SelectionIndicator,
} from '@/design-system';
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

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Attach to Instance"
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
          />

          {/* Instances Table */}
          <div
            className="flex flex-col gap-[var(--table-row-gap)]"
            style={{ width: '648px', maxWidth: '648px' }}
          >
            {/* Header */}
            <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
              <div className="w-[var(--table-checkbox-width)] flex items-center justify-center" />
              <div className="w-[59px] flex items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Status
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Name
              </div>
              <div className="w-[62px] flex items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Locked
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Fixed IP
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Floating IP
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                AZ
              </div>
            </div>

            {/* Rows */}
            {paginatedInstances.map((inst) => (
              <div
                key={inst.id}
                className={`flex items-stretch min-h-[var(--table-row-height)] border rounded-[var(--table-row-radius)] cursor-pointer transition-all ${
                  selectedInstanceId === inst.id
                    ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]'
                    : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                }`}
                onClick={() => setSelectedInstanceId(inst.id)}
              >
                {/* Radio */}
                <div
                  className="w-[var(--table-checkbox-width)] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Radio
                    name="instance-select"
                    value={inst.id}
                    checked={selectedInstanceId === inst.id}
                    onChange={() => setSelectedInstanceId(inst.id)}
                  />
                </div>
                {/* Status */}
                <div className="w-[59px] flex items-center justify-center">
                  <StatusIndicator status={inst.status} layout="icon-only" size="sm" />
                </div>
                {/* Name with ID */}
                <div className="flex-1 flex flex-col justify-center gap-0.5 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <HStack gap={1.5} align="center">
                    <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)] truncate">
                      {inst.name}
                    </span>
                    <IconExternalLink
                      size={12}
                      stroke={1.5}
                      className="shrink-0 text-[var(--color-action-primary)]"
                    />
                  </HStack>
                  <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                    ID : {inst.id}
                  </span>
                </div>
                {/* Locked */}
                <div className="w-[62px] flex items-center justify-center">
                  {inst.locked && (
                    <IconLock size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
                  )}
                </div>
                {/* Fixed IP */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                    {inst.fixedIp}
                  </span>
                </div>
                {/* Floating IP */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                    {inst.floatingIp ?? '-'}
                  </span>
                </div>
                {/* AZ */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                    {inst.az}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Indicator */}
          <SelectionIndicator
            selectedItems={
              selectedInstance ? [{ id: selectedInstance.id, label: selectedInstance.name }] : []
            }
            onRemove={() => setSelectedInstanceId(null)}
            emptyText="No item Selected"
            error={hasAttemptedSubmit && !selectedInstanceId}
            errorMessage="Please select an instance."
            className="shrink-0"
            style={{ width: '648px' }}
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AttachPortToInstanceDrawer;
