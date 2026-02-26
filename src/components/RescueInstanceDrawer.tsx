import { useState } from 'react';
import {
  Drawer,
  Button,
  Radio,
  FormField,
  Disclosure,
  Tabs,
  TabList,
  Tab,
  SearchInput,
  Pagination,
  StatusIndicator,
  SelectionIndicator,
  InlineMessage,
  InfoBox,
  IconUbuntu,
  IconRocky,
  IconGrid,
  Table,
  fixedColumns,
  columnMinWidths,
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

  const imageColumns: TableColumn<ImageItem>[] = [
    {
      key: 'id' as keyof ImageItem,
      label: '',
      width: fixedColumns.radio,
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
      width: fixedColumns.status,
      align: 'center',
      render: () => <StatusIndicator status="active" layout="icon-only" size="sm" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
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
    { key: 'version', label: 'Version', flex: 1, minWidth: columnMinWidths.version },
    { key: 'size', label: 'Size', flex: 1, minWidth: columnMinWidths.size, align: 'right' },
    {
      key: 'minDisk',
      label: 'Min disk',
      flex: 1,
      minWidth: columnMinWidths.minDisk,
      align: 'right',
    },
    { key: 'minRam', label: 'Min RAM', flex: 1, minWidth: columnMinWidths.minRam, align: 'right' },
    { key: 'visibility', label: 'Visibility', flex: 1, minWidth: columnMinWidths.visibility },
  ];

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
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRescue}
            disabled={isSubmitting}
            className="w-[152px] h-8"
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
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Rescue Instance
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Create a temporary recovery server using your instance's root disk.
            </p>
          </VStack>

          {/* Warning Message */}
          <InlineMessage variant="error">
            Rescue mode will stop your instance and attach its root disk to a temporary server. You
            can log in to that server to recover data or fix configurations.
          </InlineMessage>
        </VStack>

        <InfoBox.Group>
          <InfoBox label="Instance" value={instance.name} />
          <InfoBox label="Current image" value={instance.currentImage} />
          <InfoBox label="Protocol" value={instance.protocol} />
        </InfoBox.Group>

        {/* Image Selection */}
        <FormField label="Image" spacing="loose">
          <VStack gap={2}>
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
        </FormField>

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
              selectedCount={selectedImageId ? 1 : 0}
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
