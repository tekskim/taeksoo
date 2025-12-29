import { useState } from 'react';
import { 
  Drawer, 
  Button, 
  Radio,
  InlineMessage,
  Tabs,
  TabList,
  Tab,
  SearchInput,
  Pagination,
  Table,
  StatusIndicator,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { 
  IconBrandUbuntu, 
  IconBrandWindows, 
  IconExternalLink,
  IconDots,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ImageItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  version: string;
  size: string;
  minDisk: string;
  minRam: string;
  visibility: 'Private' | 'Public';
  os: 'ubuntu' | 'windows' | 'rocky' | 'other';
  description?: string;
}

export interface RebuildInstanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName: string;
  currentImage?: string;
  images?: ImageItem[];
  onRebuild?: (imageOption: 'current' | 'another', selectedImageId?: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockImages: ImageItem[] = Array.from({ length: 15 }, (_, i) => ({
  id: `img-${i + 1}`,
  name: `ubuntu-24.04-tk-base`,
  status: 'active',
  version: '24.04',
  size: '709.98 MiB',
  minDisk: '10.00 MiB',
  minRam: '0 MiB',
  visibility: i % 2 === 0 ? 'Private' : 'Public',
  os: i % 4 === 0 ? 'windows' : i % 4 === 1 ? 'rocky' : i % 4 === 2 ? 'other' : 'ubuntu',
  description: 'Yes',
}));

/* ----------------------------------------
   OS Icon Component
   ---------------------------------------- */

function OsIconButton({ 
  osType, 
  label,
  isSelected, 
  onClick 
}: { 
  osType: ImageItem['os']; 
  label: string;
  isSelected: boolean; 
  onClick: () => void;
}) {
  const getIcon = () => {
    switch (osType) {
      case 'ubuntu':
        return <IconBrandUbuntu size={16} stroke={1.5} />;
      case 'windows':
        return <IconBrandWindows size={16} stroke={1.5} />;
      case 'rocky':
        // Using a custom rocky icon representation
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2L14 6V10L8 14L2 10V6L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        );
      case 'other':
        return <IconDots size={16} stroke={1.5} />;
      default:
        return <IconDots size={16} stroke={1.5} />;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1 w-[72px] py-2 rounded-md transition-colors
        ${isSelected 
          ? 'border-2 border-[var(--color-action-primary)] text-[var(--color-action-primary)]' 
          : 'border border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]'
        }
      `}
    >
      {getIcon()}
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  );
}

/* ----------------------------------------
   RebuildInstanceDrawer Component
   ---------------------------------------- */

export function RebuildInstanceDrawer({
  isOpen,
  onClose,
  instanceName,
  currentImage = 'ubuntu-24.04',
  images = mockImages,
  onRebuild,
}: RebuildInstanceDrawerProps) {
  const [imageOption, setImageOption] = useState<'current' | 'another'>('current');
  const [activeTab, setActiveTab] = useState('image');
  const [selectedOs, setSelectedOs] = useState<ImageItem['os'] | null>('ubuntu');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 5;

  // Filter images based on OS and search
  const filteredImages = images.filter(img =>
    (selectedOs ? img.os === selectedOs : true) &&
    (img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     img.version.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginate
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: TableColumn<ImageItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="rebuild-image-select"
          value={row.id}
          checked={selectedImageId === row.id}
          onChange={() => setSelectedImageId(row.id)}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, item) => (
        <StatusIndicator status={item.status} layout="icon-only" size="sm" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <HStack gap={1.5}>
            <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-link)]">
              {item.name}
            </span>
            <IconExternalLink size={12} className="text-[var(--color-link)]" />
          </HStack>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            {item.description || 'Yes'}
          </span>
        </VStack>
      ),
    },
    { key: 'version', label: 'Version' },
    { key: 'size', label: 'Size' },
    { key: 'minDisk', label: 'Min Disk' },
    { key: 'minRam', label: 'Min RAM' },
    { key: 'visibility', label: 'Visibility' },
  ];

  const handleRebuild = async () => {
    setIsSubmitting(true);
    try {
      await onRebuild?.(imageOption, imageOption === 'another' ? selectedImageId || undefined : undefined);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setImageOption('current');
    setSelectedImageId(null);
    setSearchTerm('');
    setCurrentPage(1);
    onClose();
  };

  const isRebuildDisabled = imageOption === 'another' && !selectedImageId;

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
            onClick={handleRebuild}
            disabled={isSubmitting || isRebuildDisabled}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Rebuilding...' : 'Rebuild'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full overflow-y-auto">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Rebuild Instance
            </h2>
            <p className="text-[12px] text-[var(--color-text-muted)] leading-4">
              Rebuilding reinstalls the operating system using a new image.
            </p>
          </VStack>

          {/* Warning Message */}
          <InlineMessage variant="error">
            Rebuilding will permanently delete all data on the system disk. Make sure to back up important data before proceeding.
          </InlineMessage>
        </VStack>

        {/* Instance Field (Read-only) */}
        <VStack gap={2}>
          <label className="text-[14px] font-medium text-[var(--color-text-default)]">
            Instance
          </label>
          <div className="w-full px-2.5 py-2 text-[12px] text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-md">
            {instanceName}
          </div>
        </VStack>

        {/* Current Image Field (Read-only) */}
        <VStack gap={2}>
          <label className="text-[14px] font-medium text-[var(--color-text-default)]">
            Current Image
          </label>
          <div className="w-full px-2.5 py-2 text-[12px] text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-md">
            {currentImage}
          </div>
        </VStack>

        {/* Image Selection */}
        <VStack gap={3}>
          <label className="text-[14px] font-medium text-[var(--color-text-default)]">
            Image
          </label>
          <VStack gap={3}>
            <Radio
              name="rebuild-image-option"
              value="current"
              checked={imageOption === 'current'}
              onChange={() => {
                setImageOption('current');
                setSelectedImageId(null);
              }}
              label="Current image"
            />
            <Radio
              name="rebuild-image-option"
              value="another"
              checked={imageOption === 'another'}
              onChange={() => setImageOption('another')}
              label="Another image"
            />
          </VStack>
        </VStack>

        {/* Image Selection UI (when "Another image" is selected) */}
        {imageOption === 'another' && (
          <VStack gap={3} className="w-full">
            {/* Tabs */}
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              variant="underline"
              size="sm"
            >
              <TabList>
                <Tab value="image">Image</Tab>
                <Tab value="instance-snapshot">Instance Snapshot</Tab>
                <Tab value="bootable-volume">Bootable Volume</Tab>
              </TabList>
            </Tabs>

            {/* OS Selection */}
            <HStack gap={2} className="w-full">
              <OsIconButton 
                osType="ubuntu" 
                label="Ubuntu"
                isSelected={selectedOs === 'ubuntu'} 
                onClick={() => {
                  setSelectedOs(selectedOs === 'ubuntu' ? null : 'ubuntu');
                  setCurrentPage(1);
                }}
              />
              <OsIconButton 
                osType="windows" 
                label="Windows"
                isSelected={selectedOs === 'windows'} 
                onClick={() => {
                  setSelectedOs(selectedOs === 'windows' ? null : 'windows');
                  setCurrentPage(1);
                }}
              />
              <OsIconButton 
                osType="rocky" 
                label="Rocky"
                isSelected={selectedOs === 'rocky'} 
                onClick={() => {
                  setSelectedOs(selectedOs === 'rocky' ? null : 'rocky');
                  setCurrentPage(1);
                }}
              />
              <OsIconButton 
                osType="other" 
                label="Other"
                isSelected={selectedOs === 'other'} 
                onClick={() => {
                  setSelectedOs(selectedOs === 'other' ? null : 'other');
                  setCurrentPage(1);
                }}
              />
            </HStack>

            {/* Search Input */}
            <SearchInput
              placeholder="Find Image with filters"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[280px]"
            />

            {/* Pagination */}
            <HStack gap={2} alignItems="center">
              <Pagination 
                totalItems={filteredImages.length} 
                itemsPerPage={itemsPerPage} 
                currentPage={currentPage} 
                onPageChange={setCurrentPage} 
              />
              <div className="w-px h-4 bg-[var(--color-border-default)]" />
              <span className="text-[11px] text-[var(--color-text-subtle)]">
                {filteredImages.length} items
              </span>
            </HStack>

            {/* Image Table */}
            <div className="flex-1 overflow-auto">
              <Table<ImageItem>
                columns={columns}
                data={paginatedImages}
                rowKey="id"
                selectedKeys={selectedImageId ? [selectedImageId] : []}
                onRowClick={(row) => setSelectedImageId(row.id)}
                emptyMessage="No images available"
              />
            </div>
          </VStack>
        )}
      </VStack>
    </Drawer>
  );
}

export default RebuildInstanceDrawer;
