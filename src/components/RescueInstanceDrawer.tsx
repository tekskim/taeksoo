import { useState } from 'react';
import { 
  Drawer, 
  Button, 
  Radio,
  Disclosure,
  Tabs,
  TabList,
  Tab,
  SearchInput,
  Pagination,
  StatusIndicator,
  SelectionIndicator,
  IconUbuntu,
  IconRocky,
  IconGrid,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconAlertCircle, IconHelp, IconChevronDown, IconExternalLink, IconDots } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InstanceInfo {
  id: string;
  name: string;
  currentImage: string;
  protocol: string;
}

export interface RescueInstanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo;
  onRescue?: (imageOption: 'current' | 'another', selectedImageId?: string) => void;
}

/* ----------------------------------------
   Mock Data for Images
   ---------------------------------------- */

interface ImageItem {
  id: string;
  name: string;
  bootable: string;
  version: string;
  size: string;
  minDisk: string;
  minRam: string;
  visibility: string;
}

const mockImages: ImageItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `img-${i + 1}`,
  name: 'ubuntu-24.04-tk-base',
  bootable: 'Yes',
  version: '24.04',
  size: '709.98 MiB',
  minDisk: '10.00 MiB',
  minRam: '0 MiB',
  visibility: 'Private',
}));

type ImageTab = 'image' | 'snapshot' | 'bootable';
type OSFilter = 'ubuntu' | 'windows' | 'rocky' | 'other';

const osChipStyle = (active: boolean) => `
  inline-flex items-center gap-1 px-2 py-1.5 rounded-[4px] cursor-pointer text-[12px] font-medium transition-colors
  ${active 
    ? 'bg-[var(--color-surface-default)] text-[var(--color-text-default)] shadow-sm' 
    : 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]'
  }
`;

/* ----------------------------------------
   RescueInstanceDrawer Component
   ---------------------------------------- */

export function RescueInstanceDrawer({
  isOpen,
  onClose,
  instance,
  onRescue,
}: RescueInstanceDrawerProps) {
  const [imageOption, setImageOption] = useState<'current' | 'another'>('current');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Image selection state
  const [imageTab, setImageTab] = useState<ImageTab>('image');
  const [osFilter, setOsFilter] = useState<OSFilter>('ubuntu');
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [imageCurrentPage, setImageCurrentPage] = useState(1);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  
  const ITEMS_PER_PAGE = 5;
  
  // Filter images based on search
  const filteredImages = mockImages.filter((img) =>
    img.name.toLowerCase().includes(imageSearchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
  const paginatedImages = filteredImages.slice(
    (imageCurrentPage - 1) * ITEMS_PER_PAGE,
    imageCurrentPage * ITEMS_PER_PAGE
  );

  const handleRescue = async () => {
    setIsSubmitting(true);
    try {
      await onRescue?.(imageOption, selectedImageId || undefined);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setImageOption('current');
    setIsAdvancedOpen(false);
    setSelectedImageId(null);
    setImageSearchQuery('');
    setImageCurrentPage(1);
    onClose();
  };

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
            onClick={handleRescue}
            disabled={isSubmitting}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Rescuing...' : 'Rescue'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Rescue Instance
            </h2>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Create a temporary recovery server using your instance's root disk.
            </p>
          </VStack>

          {/* Warning Message */}
          <div className="w-full p-3 bg-[var(--color-state-danger-bg)] rounded-lg flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Rescue mode will stop your instance and attach its root disk to a temporary server.
              <br />
              You can log in to that server to recover data or fix configurations.
            </p>
          </div>
        </VStack>

        {/* Instance Field */}
        <VStack gap={2}>
          <span className="text-[14px] font-medium text-[var(--color-text-default)]">Instance</span>
          <div className="w-full px-2.5 py-2 border border-[var(--color-border-subtle)] rounded-md bg-white">
            <span className="text-[12px] text-[var(--color-text-default)]">{instance.name}</span>
          </div>
        </VStack>

        {/* Current Image Field */}
        <VStack gap={2}>
          <span className="text-[14px] font-medium text-[var(--color-text-default)]">Current Image</span>
          <div className="w-full px-2.5 py-2 border border-[var(--color-border-subtle)] rounded-md bg-white">
            <span className="text-[12px] text-[var(--color-text-default)]">{instance.currentImage}</span>
          </div>
        </VStack>

        {/* Protocol Field */}
        <VStack gap={2}>
          <span className="text-[14px] font-medium text-[var(--color-text-default)]">Protocol</span>
          <div className="w-full px-2.5 py-2 border border-[var(--color-border-subtle)] rounded-md bg-white">
            <span className="text-[12px] text-[var(--color-text-default)]">{instance.protocol}</span>
          </div>
        </VStack>

        {/* Image Selection */}
        <VStack gap={3}>
          <span className="text-[14px] font-medium text-[var(--color-text-default)]">Image</span>
          <VStack gap={3}>
            {/* Current Image Option */}
            <HStack gap={1.5} align="center">
              <Radio
                name="image-option"
                value="current"
                checked={imageOption === 'current'}
                onChange={() => setImageOption('current')}
                label="Current image"
              />
              <IconHelp size={16} className="text-[var(--color-text-subtle)] cursor-help" />
            </HStack>

            {/* Another Image Option */}
            <HStack gap={1.5} align="center">
              <Radio
                name="image-option"
                value="another"
                checked={imageOption === 'another'}
                onChange={() => setImageOption('another')}
                label="Another image"
              />
              <IconHelp size={16} className="text-[var(--color-text-subtle)] cursor-help" />
            </HStack>
          </VStack>
        </VStack>

        {/* Image Selection Table (shown when "Another image" is selected) */}
        {imageOption === 'another' && (
          <VStack gap={3}>
            {/* Tabs */}
            <Tabs
              variant="underline"
              size="sm"
              value={imageTab}
              onChange={(value) => setImageTab(value as ImageTab)}
            >
              <TabList>
                <Tab value="image">Image</Tab>
                <Tab value="snapshot">Instance Snapshot</Tab>
                <Tab value="bootable">Bootable Volume</Tab>
              </TabList>
            </Tabs>

            {/* OS Filter Capsule Tabs */}
            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-1 inline-flex w-fit">
              <button 
                className={osChipStyle(osFilter === 'ubuntu')}
                onClick={() => { setOsFilter('ubuntu'); setImageCurrentPage(1); }}
              >
                <IconUbuntu size={14} />
                <span>Ubuntu</span>
              </button>
              <button 
                className={osChipStyle(osFilter === 'windows')}
                onClick={() => { setOsFilter('windows'); setImageCurrentPage(1); }}
              >
                <IconGrid size={14} />
                <span>Windows</span>
              </button>
              <button 
                className={osChipStyle(osFilter === 'rocky')}
                onClick={() => { setOsFilter('rocky'); setImageCurrentPage(1); }}
              >
                <IconRocky size={14} />
                <span>Rocky</span>
              </button>
              <button 
                className={osChipStyle(osFilter === 'other')}
                onClick={() => { setOsFilter('other'); setImageCurrentPage(1); }}
              >
                <IconDots size={14} />
                <span>Other</span>
              </button>
            </div>

            {/* Search */}
            <SearchInput
              placeholder="Search image by attributes"
              value={imageSearchQuery}
              onChange={(e) => setImageSearchQuery(e.target.value)}
              className="w-[280px]"
            />

            {/* Pagination */}
            <Pagination
              currentPage={imageCurrentPage}
              totalPages={totalPages}
              totalItems={filteredImages.length}
              onPageChange={setImageCurrentPage}
            />

            {/* Image Table */}
            <div style={{ width: '648px', maxWidth: '648px' }}>
              {/* Header */}
              <div style={{ display: 'flex', width: '648px', height: '40px' }} className="bg-[var(--color-border-subtle)] border border-[var(--color-border-default)] rounded-md">
                <div style={{ width: '40px', flexShrink: 0 }} className="flex items-center justify-center" />
                <div style={{ width: '59px', flexShrink: 0 }} className="flex items-center justify-center px-3 border-l border-[var(--color-border-default)]">
                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Status</span>
                </div>
                <div style={{ width: '149px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Name</span>
                  <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                </div>
                <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Version</span>
                  <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                </div>
                <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Size</span>
                  <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                </div>
                <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Min Disk</span>
                  <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                </div>
                <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Min RAM</span>
                  <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                </div>
                <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Visibility</span>
                  <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                </div>
              </div>

              {/* Body */}
              <div style={{ width: '648px', maxWidth: '648px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {paginatedImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedImageId(img.id)}
                    style={{ display: 'flex', width: '648px', minHeight: '40px' }}
                    className={`border rounded-md cursor-pointer transition-all ${
                      selectedImageId === img.id
                        ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]'
                        : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                    }`}
                  >
                    <div style={{ width: '40px', flexShrink: 0 }} className="flex items-center justify-center">
                      <Radio
                        name="image-select"
                        value={img.id}
                        checked={selectedImageId === img.id}
                        onChange={() => setSelectedImageId(img.id)}
                      />
                    </div>
                    <div style={{ width: '59px', flexShrink: 0 }} className="flex items-center justify-center px-3">
                      <StatusIndicator status="active" layout="icon-only" size="sm" />
                    </div>
                    <div style={{ width: '149px', flexShrink: 0 }} className="flex flex-col justify-center px-3 py-2 overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-medium text-[var(--color-action-primary)] truncate">{img.name}</span>
                        <IconExternalLink size={12} className="shrink-0 text-[var(--color-action-primary)]" />
                      </div>
                      <span className="text-[11px] text-[var(--color-text-subtle)] truncate">{img.bootable}</span>
                    </div>
                    <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                      <span className="text-[12px] text-[var(--color-text-default)] truncate">{img.version}</span>
                    </div>
                    <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                      <span className="text-[12px] text-[var(--color-text-default)] truncate">{img.size}</span>
                    </div>
                    <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                      <span className="text-[12px] text-[var(--color-text-default)] truncate">{img.minDisk}</span>
                    </div>
                    <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                      <span className="text-[12px] text-[var(--color-text-default)] truncate">{img.minRam}</span>
                    </div>
                    <div style={{ width: '80px', flexShrink: 0 }} className="flex items-center px-3 py-2 overflow-hidden">
                      <span className="text-[12px] text-[var(--color-text-default)] truncate">{img.visibility}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selection Indicator */}
            <SelectionIndicator
              style={{ width: '648px' }}
              selectedItems={selectedImageId ? [{ id: selectedImageId, label: mockImages.find(img => img.id === selectedImageId)?.name || '' }] : []}
              onRemove={() => setSelectedImageId(null)}
              emptyText="No item selected"
            />
          </VStack>
        )}

        {/* Advanced Options (Disclosure) */}
        <Disclosure
          title="Label"
          expanded={isAdvancedOpen}
          onToggle={() => setIsAdvancedOpen(!isAdvancedOpen)}
        >
          <VStack gap={3} className="pt-3">
            {/* Content placeholder */}
          </VStack>
        </Disclosure>
      </VStack>
    </Drawer>
  );
}

export default RescueInstanceDrawer;
