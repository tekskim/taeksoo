import { useState } from 'react';
import { 
  Drawer, 
  Button, 
  SearchInput, 
  Pagination, 
  StatusIndicator,
  Radio,
  SelectionIndicator,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown, IconAlertCircle } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeItem {
  id: string;
  name: string;
  status: 'available' | 'in-use' | 'error';
  type: string;
  size: string;
  diskTag: string;
}

export interface InstanceInfo {
  id: string;
  name: string;
}

export interface DetachVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo;
  volumes?: VolumeItem[];
  onDetach?: (volumeId: string) => void;
  onCreateNewNetwork?: () => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockVolumes: VolumeItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `vol-${i + 1}`,
  name: 'vol34',
  status: 'in-use',
  type: '_DEFAULT_',
  size: '1500GiB',
  diskTag: 'Data Disk',
}));

/* ----------------------------------------
   DetachVolumeDrawer Component
   ---------------------------------------- */

export function DetachVolumeDrawer({
  isOpen,
  onClose,
  instance,
  volumes = mockVolumes,
  onDetach,
  onCreateNewNetwork,
}: DetachVolumeDrawerProps) {
  const [selectedVolumeId, setSelectedVolumeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = 115;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleDetach = async () => {
    if (!selectedVolumeId) return;
    
    setIsSubmitting(true);
    try {
      await onDetach?.(selectedVolumeId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedVolumeId(null);
    setSearchQuery('');
    setCurrentPage(1);
    onClose();
  };

  const filteredVolumes = volumes.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            disabled={!selectedVolumeId || isSubmitting}
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
              Detach Volume
            </h2>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Detach the selected volume from this instance. Once detached, it will no longer be accessible.
            </p>
          </VStack>

          {/* Warning Message */}
          <div className="w-full p-3 bg-[var(--color-state-danger-bg)] rounded-lg flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              For data consistency, stop all write operations on the instance before detaching a volume.
            </p>
          </div>

          {/* Instance Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-[11px] text-[var(--color-text-subtle)] mb-1.5">Instance Name</div>
            <div className="text-[12px] text-[var(--color-text-default)]">{instance.name}</div>
          </div>
        </VStack>

        {/* Volume Section */}
        <VStack gap={3} className="flex-1 min-h-0">
          {/* Volume Header */}
          <HStack justify="between" align="center" className="w-full">
            <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">Volumes</h3>
            <Button 
              variant="muted" 
              size="sm"
              onClick={onCreateNewNetwork}
              rightIcon={<IconExternalLink size={12} />}
            >
              Create a new network
            </Button>
          </HStack>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search volume by attributes"
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
            />
            <div className="w-px h-4 bg-[var(--color-border-default)] mx-2" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">{totalItems} items</span>
          </HStack>

          {/* Volume Table */}
          <div className="flex-1 overflow-y-auto sidebar-scroll" style={{ width: '648px', maxWidth: '648px', overflowX: 'hidden', paddingRight: '2px' }}>
            {/* Header */}
            <div style={{ display: 'flex', width: '648px', height: '40px' }} className="bg-[var(--color-border-subtle)] border border-[var(--color-border-default)] rounded-md">
              <div style={{ width: '40px', flexShrink: 0 }} className="flex items-center justify-center" />
              <div style={{ width: '59px', flexShrink: 0 }} className="flex items-center justify-center px-3 border-l border-[var(--color-border-default)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Status</span>
              </div>
              <div style={{ width: '137px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Name</span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div style={{ width: '137px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Type</span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div style={{ width: '137px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Size</span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
              <div style={{ width: '138px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Disk Tag</span>
                <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
              </div>
            </div>

            {/* Rows */}
            <div style={{ width: '648px', maxWidth: '648px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {filteredVolumes.map((volume) => (
                <div 
                  key={volume.id}
                  style={{ display: 'flex', width: '648px', minHeight: '40px' }}
                  className={`border rounded-md cursor-pointer transition-all ${
                    selectedVolumeId === volume.id 
                      ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]' 
                      : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                  }`}
                  onClick={() => setSelectedVolumeId(volume.id)}
                >
                  {/* Radio */}
                  <div style={{ width: '40px', flexShrink: 0 }} className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    <Radio
                      name="volume-select"
                      value={volume.id}
                      checked={selectedVolumeId === volume.id}
                      onChange={() => setSelectedVolumeId(volume.id)}
                    />
                  </div>
                  {/* Status */}
                  <div style={{ width: '59px', flexShrink: 0 }} className="flex items-center justify-center">
                    <StatusIndicator status="active" layout="icon-only" size="sm" />
                  </div>
                  {/* Name */}
                  <div style={{ width: '137px', flexShrink: 0 }} className="flex flex-col gap-0.5 justify-center px-3 py-2 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-medium text-[var(--color-action-primary)] truncate">{volume.name}</span>
                      <IconExternalLink size={12} className="shrink-0 text-[var(--color-action-primary)]" />
                    </div>
                    <span className="text-[11px] text-[var(--color-text-subtle)] truncate">ID : 30ujh345</span>
                  </div>
                  {/* Type */}
                  <div style={{ width: '137px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">{volume.type}</span>
                  </div>
                  {/* Size */}
                  <div style={{ width: '137px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">{volume.size}</span>
                  </div>
                  {/* Disk Tag */}
                  <div style={{ width: '138px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                    <span className="text-[12px] text-[var(--color-text-default)] truncate">{volume.diskTag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </VStack>

        {/* Selection Indicator */}
        <SelectionIndicator
          selectedItems={selectedVolumeId ? [{ id: selectedVolumeId, label: volumes.find(v => v.id === selectedVolumeId)?.name || '' }] : []}
          onRemove={() => setSelectedVolumeId(null)}
          emptyText="No item selected"
          className="shrink-0"
          style={{ width: '648px' }}
        />
      </VStack>
    </Drawer>
  );
}

export default DetachVolumeDrawer;
