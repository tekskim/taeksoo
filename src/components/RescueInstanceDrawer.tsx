import { useState } from 'react';
import { 
  Drawer, 
  Button, 
  Radio,
  InlineMessage,
  Disclosure,
  SearchInput,
  Tabs,
  TabList,
  Tab,
  Pagination,
  StatusIndicator,
  Table,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { 
  IconHelp, 
  IconBrandUbuntu, 
  IconBrandWindows,
  IconDots,
  IconExternalLink,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ImageItem {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  version: string;
  size: string;
  minDisk: string;
  minRam: string;
  visibility: 'Public' | 'Private';
  bootable: boolean;
}

export interface RescueInstanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName: string;
  currentImage?: string;
  protocol?: string;
  images?: ImageItem[];
  onRescue?: (imageOption: 'current' | 'another', selectedImageId?: string) => void;
}

const mockImages: ImageItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `img-${i + 1}`,
  name: `ubuntu-24.04-tk-base`,
  status: 'active',
  version: '24.04',
  size: '709.98 MiB',
  minDisk: '10.00 MiB',
  minRam: '0 MiB',
  visibility: 'Private',
  bootable: true,
}));

/* ----------------------------------------
   RescueInstanceDrawer Component
   ---------------------------------------- */

export function RescueInstanceDrawer({
  isOpen,
  onClose,
  instanceName,
  currentImage = 'ubuntu-24.04',
  protocol = 'HTTP',
  images = mockImages,
  onRescue,
}: RescueInstanceDrawerProps) {
  const [imageOption, setImageOption] = useState<'current' | 'another'>('current');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('image');
  const [selectedOs, setSelectedOs] = useState('ubuntu');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredImages = images.filter(img =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    setSelectedImageId(null);
    setSearchTerm('');
    setSelectedOs('ubuntu');
    setActiveTab('image');
    onClose();
  };

  const columns: TableColumn<ImageItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="image-select"
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
      render: () => (
        <StatusIndicator status="active" layout="icon-only" size="sm" />
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
            {item.bootable ? 'Yes' : 'No'}
          </span>
        </VStack>
      ),
    },
    { key: 'version', label: 'Version', width: '100px' },
    { key: 'size', label: 'Size', width: '100px' },
    { key: 'minDisk', label: 'Min Disk', width: '100px' },
    { key: 'minRam', label: 'Min RAM', width: '100px' },
    { key: 'visibility', label: 'Visibility', width: '100px' },
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
      <VStack gap={6} className="h-full overflow-y-auto">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Rescue Instance
            </h2>
            <p className="text-[12px] text-[var(--color-text-muted)] leading-4">
              Create a temporary recovery server using your instance's root disk.
            </p>
          </VStack>

          {/* Warning Message */}
          <InlineMessage variant="error">
            Rescue mode will stop your instance and attach its root disk to a temporary server.
            <br />
            You can log in to that server to recover data or fix configurations.
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

        {/* Protocol Field (Read-only) */}
        <VStack gap={2}>
          <label className="text-[14px] font-medium text-[var(--color-text-default)]">
            Protocol
          </label>
          <div className="w-full px-2.5 py-2 text-[12px] text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-md">
            {protocol}
          </div>
        </VStack>

        {/* Image Selection */}
        <VStack gap={3}>
          <label className="text-[14px] font-medium text-[var(--color-text-default)]">
            Image
          </label>
          <VStack gap={3}>
            <HStack gap={1.5} align="center">
              <Radio
                name="image-option"
                value="current"
                checked={imageOption === 'current'}
                onChange={() => setImageOption('current')}
                label="Current image"
              />
              <button 
                type="button" 
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
                title="Use the same image that your instance is currently using"
              >
                <IconHelp size={16} />
              </button>
            </HStack>
            <HStack gap={1.5} align="center">
              <Radio
                name="image-option"
                value="another"
                checked={imageOption === 'another'}
                onChange={() => setImageOption('another')}
                label="Another image"
              />
              <button 
                type="button" 
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
                title="Select a different rescue image"
              >
                <IconHelp size={16} />
              </button>
            </HStack>
          </VStack>
        </VStack>

        {/* Image Selection Menu (shown when "Another image" is selected) */}
        {imageOption === 'another' && (
          <VStack gap={3}>
            {/* Tabs */}
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              variant="underline"
              size="sm"
            >
              <TabList>
                <Tab value="image">Image</Tab>
                <Tab value="snapshot">Instance Snapshot</Tab>
                <Tab value="volume">Bootable Volume</Tab>
              </TabList>
            </Tabs>

            {/* OS Selection Icons */}
            <HStack gap={2}>
              <OsIconButton
                icon={<IconBrandUbuntu size={16} />}
                label="Ubuntu"
                selected={selectedOs === 'ubuntu'}
                onClick={() => setSelectedOs('ubuntu')}
              />
              <OsIconButton
                icon={<IconBrandWindows size={16} />}
                label="Windows"
                selected={selectedOs === 'windows'}
                onClick={() => setSelectedOs('windows')}
              />
              <OsIconButton
                icon={<span className="text-[14px] font-bold">R</span>}
                label="Rocky"
                selected={selectedOs === 'rocky'}
                onClick={() => setSelectedOs('rocky')}
              />
              <OsIconButton
                icon={<IconDots size={16} />}
                label="Other"
                selected={selectedOs === 'other'}
                onClick={() => setSelectedOs('other')}
              />
            </HStack>

            {/* Search Input */}
            <SearchInput
              placeholder="Find Image with filters"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[280px]"
            />

            {/* Pagination */}
            <HStack justifyContent="start" alignItems="center" gap={2}>
              <Pagination
                totalItems={images.length}
                itemsPerPage={5}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
              <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                {images.length} items
              </span>
            </HStack>

            {/* Image Table */}
            <div className="flex-1 overflow-auto max-h-[300px]">
              <Table<ImageItem>
                columns={columns}
                data={filteredImages}
                rowKey="id"
                selectedKeys={selectedImageId ? [selectedImageId] : []}
                onRowClick={(row) => setSelectedImageId(row.id)}
                emptyMessage="No images available"
              />
            </div>
          </VStack>
        )}

        {/* Advanced Options (Disclosure) */}
        <Disclosure title="Label" defaultOpen={false}>
          <VStack gap={3} className="pt-2">
            <p className="text-[12px] text-[var(--color-text-muted)]">
              Additional advanced options for rescue mode configuration.
            </p>
          </VStack>
        </Disclosure>
      </VStack>
    </Drawer>
  );
}

/* ----------------------------------------
   OsIconButton Component
   ---------------------------------------- */

interface OsIconButtonProps {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}

function OsIconButton({ icon, label, selected, onClick }: OsIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1 py-2 w-[72px] rounded-md border-2 transition-colors
        ${selected 
          ? 'border-[var(--color-action-primary)] bg-[var(--color-surface-default)]' 
          : 'border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:border-[var(--color-border-strong)]'
        }
      `}
    >
      <span className={`${selected ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-muted)]'}`}>
        {icon}
      </span>
      <span className={`text-[11px] font-medium ${selected ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-muted)]'}`}>
        {label}
      </span>
    </button>
  );
}

export default RescueInstanceDrawer;

