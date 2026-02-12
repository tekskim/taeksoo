import { useState } from 'react';
import {
  Drawer,
  Button,
  Radio,
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
  Table,
  InlineMessage,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconDots } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InstanceInfo {
  id: string;
  name: string;
  currentImage: string;
}

export interface RebuildInstanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo;
  onRebuild?: (imageOption: 'current' | 'another', selectedImageId?: string) => void;
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

/* ----------------------------------------
   RebuildInstanceDrawer Component
   ---------------------------------------- */

export function RebuildInstanceDrawer({
  isOpen,
  onClose,
  instance,
  onRebuild,
}: RebuildInstanceDrawerProps) {
  const [imageOption, setImageOption] = useState<'current' | 'another'>('current');
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

  const imageColumns: TableColumn<ImageItem>[] = [
    {
      key: 'id' as keyof ImageItem,
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="image-select"
            value={row.id}
            checked={selectedImageId === row.id}
            onChange={() => setSelectedImageId(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'id' as keyof ImageItem,
      label: 'Status',
      width: '59px',
      align: 'center',
      render: () => <StatusIndicator status="active" layout="icon-only" size="sm" />,
    },
    {
      key: 'name',
      label: 'Name',
      render: (_value, row) => (
        <div className="flex flex-col justify-center gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-label-md text-[var(--color-action-primary)] truncate">
              {row.name}
            </span>
            <IconExternalLink size={12} className="shrink-0 text-[var(--color-action-primary)]" />
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
            {row.bootable}
          </span>
        </div>
      ),
    },
    { key: 'version', label: 'Version' },
    { key: 'size', label: 'Size' },
    { key: 'minDisk', label: 'Min disk' },
    { key: 'minRam', label: 'Min RAM' },
    { key: 'visibility', label: 'Visibility' },
  ];

  const handleRebuild = async () => {
    setIsSubmitting(true);
    try {
      await onRebuild?.(imageOption, selectedImageId || undefined);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setImageOption('current');
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
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRebuild}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Rebuilding...' : 'Rebuild'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Rebuild Instance
            </h2>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              Rebuilding reinstalls the operating system using a new image.
            </p>
          </VStack>

          {/* Warning Message */}
          <InlineMessage variant="error">
            Rebuilding will permanently delete all data on the system disk. Make sure to back up
            important data before proceeding.
          </InlineMessage>
        </VStack>

        {/* Instance Field */}
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)]">Instance</span>
          <div className="w-full px-2.5 py-2 border border-[var(--color-border-subtle)] rounded-md bg-white">
            <span className="text-body-md text-[var(--color-text-default)]">{instance.name}</span>
          </div>
        </VStack>

        {/* Current Image Field */}
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)]">Current image</span>
          <div className="w-full px-2.5 py-2 border border-[var(--color-border-subtle)] rounded-md bg-white">
            <span className="text-body-md text-[var(--color-text-default)]">
              {instance.currentImage}
            </span>
          </div>
        </VStack>

        {/* Image Selection */}
        <VStack gap={3}>
          <span className="text-label-lg text-[var(--color-text-default)]">Image</span>
          <VStack gap={3}>
            {/* Current Image Option */}
            <Radio
              name="image-option"
              value="current"
              checked={imageOption === 'current'}
              onChange={() => setImageOption('current')}
              label="Current image"
            />

            {/* Another Image Option */}
            <Radio
              name="image-option"
              value="another"
              checked={imageOption === 'another'}
              onChange={() => setImageOption('another')}
              label="Another image"
            />
          </VStack>
        </VStack>

        {/* Image Selection Table (shown when "Another image" is selected) */}
        {imageOption === 'another' && (
          <VStack gap={3} className="pb-5">
            {/* Tabs */}
            <Tabs
              variant="underline"
              size="sm"
              value={imageTab}
              onChange={(value) => setImageTab(value as ImageTab)}
            >
              <TabList>
                <Tab value="image">Image</Tab>
                <Tab value="snapshot">Instance snapshot</Tab>
                <Tab value="bootable">Bootable volume</Tab>
              </TabList>
            </Tabs>

            {/* OS Filter Capsule Tabs */}
            <Tabs
              variant="boxed"
              size="sm"
              value={osFilter}
              onChange={(value) => {
                setOsFilter(value as OSFilter);
                setImageCurrentPage(1);
              }}
            >
              <TabList>
                <Tab value="ubuntu">
                  <HStack gap={1} align="center">
                    <IconUbuntu size={14} />
                    <span>Ubuntu</span>
                  </HStack>
                </Tab>
                <Tab value="windows">
                  <HStack gap={1} align="center">
                    <IconGrid size={14} />
                    <span>Windows</span>
                  </HStack>
                </Tab>
                <Tab value="rocky">
                  <HStack gap={1} align="center">
                    <IconRocky size={14} />
                    <span>Rocky</span>
                  </HStack>
                </Tab>
                <Tab value="other">
                  <HStack gap={1} align="center">
                    <IconDots size={14} />
                    <span>Other</span>
                  </HStack>
                </Tab>
              </TabList>
            </Tabs>

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

            <VStack gap={2}>
              <Table<ImageItem>
                columns={imageColumns}
                data={paginatedImages}
                rowKey="id"
                onRowClick={(row) => setSelectedImageId(row.id)}
                emptyMessage="No images found"
              />
              <SelectionIndicator
                style={{ width: '648px' }}
                selectedItems={
                  selectedImageId
                    ? [
                        {
                          id: selectedImageId,
                          label: mockImages.find((img) => img.id === selectedImageId)?.name || '',
                        },
                      ]
                    : []
                }
                onRemove={() => setSelectedImageId(null)}
                emptyText="No item selected"
              />
            </VStack>
          </VStack>
        )}
      </VStack>
    </Drawer>
  );
}

export default RebuildInstanceDrawer;
