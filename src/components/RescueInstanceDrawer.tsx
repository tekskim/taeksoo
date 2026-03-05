import { useState } from 'react';
import {
  Drawer,
  Button,
  Radio,
  FormField,
  Disclosure,
  Input,
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
import { IconExternalLink, IconDots, IconEye, IconEyeOff } from '@tabler/icons-react';

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
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    setIsPasswordOpen(false);
    setPassword('');
    setShowPassword(false);
    setSelectedImageId(null);
    setImageSearchQuery('');
    setImageCurrentPage(1);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Rescue Instance"
      description="Create a temporary recovery server using your instance's root disk."
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
        <VStack gap={3}>
          {/* Warning Message */}
          <InlineMessage variant="error">
            Rescue mode will stop your instance and attach its root disk to a temporary server. You
            can log in to that server to recover data or fix configurations.
          </InlineMessage>

          <InfoBox.Group>
            <InfoBox label="Instance name" value={instance.name} />
            <InfoBox label="Current image" value={instance.currentImage} />
          </InfoBox.Group>
        </VStack>

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

        {/* Password (Disclosure) */}
        <Disclosure open={isPasswordOpen} onChange={setIsPasswordOpen} className="pb-5">
          <Disclosure.Trigger>Password</Disclosure.Trigger>
          <Disclosure.Panel>
            <VStack gap={3}>
              <FormField>
                <FormField.Description>
                  Set a password to access the rescue instance.
                </FormField.Description>
                <FormField.Control>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    fullWidth
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="flex items-center justify-center text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)] cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                      </button>
                    }
                  />
                </FormField.Control>
                <FormField.HelperText>
                  You can use letters, numbers, and all common special characters and the length
                  must be between 8-16 characters.
                </FormField.HelperText>
              </FormField>
            </VStack>
          </Disclosure.Panel>
        </Disclosure>
      </VStack>
    </Drawer>
  );
}

export default RescueInstanceDrawer;
