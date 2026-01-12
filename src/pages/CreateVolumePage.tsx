import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  HStack,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Input,
  Select,
  SectionCard,
  FormField,
  WizardSummary,
  Radio,
  RadioGroup,
  SearchInput,
  Table,
  Pagination,
  Slider,
  NumberInput,
  StatusIndicator,
  Chip,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState, TableColumn } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconEdit,
  IconDots,
  IconBrandUbuntu,
  IconBrandWindows,
  IconMountain,
  IconExternalLink,
  IconAlertCircle,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'source' | 'configuration';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  source: 'Source',
  configuration: 'Configuration',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = [
  'basic-info',
  'source',
  'configuration',
];

type SourceType = 'blank' | 'image' | 'snapshot';

interface ImageRow {
  id: string;
  name: string;
  version: string;
  size: string;
  minDisk: string;
  minRAM: string;
  visibility: string;
  os: string;
  status: 'active' | 'error' | 'building' | 'muted';
}

interface SnapshotRow {
  id: string;
  name: string;
  volumeType: string;
  size: string;
  createdAt: string;
  status: 'active' | 'error' | 'building' | 'muted';
}

interface VolumeTypeRow {
  id: string;
  name: string;
  description: string;
  isPublic: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockImages: ImageRow[] = [
  { id: 'img-001', name: 'Ubuntu-24.04-64-base', version: '24.04', size: '799.00 MiB', minDisk: '0.00 MiB', minRAM: '0 MiB', visibility: 'Public', os: 'ubuntu', status: 'active' },
  { id: 'img-002', name: 'Ubuntu-24.04-64-base', version: '24.04', size: '199.00 MiB', minDisk: '199.00 MiB', minRAM: '0 MiB', visibility: 'Public', os: 'ubuntu', status: 'active' },
  { id: 'img-003', name: 'Ubuntu-24.04-64-base', version: '24.04', size: '199.00 MiB', minDisk: '0.00 MiB', minRAM: '1 MiB', visibility: 'Public', os: 'ubuntu', status: 'active' },
  { id: 'img-004', name: 'Ubuntu-24.04-64-base', version: '24.04', size: '159.00 MiB', minDisk: '10.00 MiB', minRAM: '0 MiB', visibility: 'Public', os: 'ubuntu', status: 'active' },
  { id: 'img-005', name: 'Ubuntu-24.04-64-base', version: '24.04', size: '799.00 MiB', minDisk: '0.00 MiB', minRAM: '0 MiB', visibility: 'Public', os: 'ubuntu', status: 'active' },
  { id: 'img-006', name: 'Windows-Server-2019', version: '2019', size: '4.5 GiB', minDisk: '40 GiB', minRAM: '2 GiB', visibility: 'Public', os: 'windows', status: 'active' },
  { id: 'img-007', name: 'Rocky-Linux-9', version: '9.0', size: '1.2 GiB', minDisk: '10 GiB', minRAM: '1 GiB', visibility: 'Public', os: 'rocky', status: 'active' },
];

const mockSnapshots: SnapshotRow[] = [
  { id: 'snap-001', name: 'snapshot-01', volumeType: '_DEFAULT_', size: '50 GiB', createdAt: '2025-11-01', status: 'active' },
  { id: 'snap-002', name: 'snapshot-02', volumeType: '_DEFAULT_', size: '0.0 GiB', createdAt: '2025-11-20', status: 'active' },
  { id: 'snap-003', name: 'snapshot-03', volumeType: '_DEFAULT_', size: '10 GiB', createdAt: '2025-11-20', status: 'active' },
  { id: 'snap-004', name: 'snapshot-04', volumeType: '_DEFAULT_', size: '68 GiB', createdAt: '2025-11-20', status: 'active' },
  { id: 'snap-005', name: 'snapshot-05', volumeType: '_DEFAULT_', size: '68 GiB', createdAt: '2025-11-30', status: 'active' },
];

const mockVolumeTypes: VolumeTypeRow[] = [
  { id: 'vt-001', name: '_DEFAULT_', description: '-', isPublic: 'On' },
  { id: 'vt-002', name: '_DEFAULT_', description: '-', isPublic: 'On' },
  { id: 'vt-003', name: '_DEFAULT_', description: '-', isPublic: 'On' },
  { id: 'vt-004', name: '_DEFAULT_', description: '-', isPublic: 'On' },
  { id: 'vt-005', name: '_DEFAULT_', description: '-', isPublic: 'On' },
];

const azOptions = [
  { value: 'nova', label: 'nova' },
  { value: 'nova-2', label: 'nova-2' },
  { value: 'nova-3', label: 'nova-3' },
];

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  sectionStatus: Record<SectionStep, WizardSectionState>;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({ sectionStatus, onCancel, onCreate, isCreateDisabled }: SummarySidebarProps) {
  const summaryItems: WizardSummaryItem[] = SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    status: sectionStatus[key],
  }));

  return (
    <div className="w-[312px] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        <WizardSummary items={summaryItems} />
        
        {/* Action Buttons */}
        <div className="flex flex-col w-full">
          <div className="flex gap-2 items-center justify-end w-full">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={onCreate}
              disabled={isCreateDisabled}
              className="flex-1"
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function CreateVolumePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [volumeName, setVolumeName] = useState('');
  const [availabilityZone, setAvailabilityZone] = useState('');
  const [description, setDescription] = useState('');
  
  // Source section state
  const [sourceType, setSourceType] = useState<SourceType>('blank');
  const [selectedImage, setSelectedImage] = useState<string[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string[]>([]);
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [snapshotSearchQuery, setSnapshotSearchQuery] = useState('');
  const [imageOsFilter, setImageOsFilter] = useState('all');
  const [imageCurrentPage, setImageCurrentPage] = useState(1);
  const [snapshotCurrentPage, setSnapshotCurrentPage] = useState(1);

  // Configuration section state
  const [selectedVolumeType, setSelectedVolumeType] = useState<string[]>([]);
  const [volumeTypeSearchQuery, setVolumeTypeSearchQuery] = useState('');
  const [volumeTypeCurrentPage, setVolumeTypeCurrentPage] = useState(1);
  const [volumeCapacity, setVolumeCapacity] = useState(10);

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    source: 'pre',
    configuration: 'pre',
  });

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel } = useTabs();

  // Update tab label
  useState(() => {
    updateActiveTabLabel('Create volume');
  });

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filter images by OS and search
  const filteredImages = useMemo(() => {
    return mockImages.filter((img) => {
      const matchesOs = imageOsFilter === 'all' || img.os === imageOsFilter;
      const matchesSearch = !imageSearchQuery || 
        img.name.toLowerCase().includes(imageSearchQuery.toLowerCase());
      return matchesOs && matchesSearch;
    });
  }, [imageOsFilter, imageSearchQuery]);

  // Filter snapshots by search
  const filteredSnapshots = useMemo(() => {
    return mockSnapshots.filter((snap) => {
      return !snapshotSearchQuery || 
        snap.name.toLowerCase().includes(snapshotSearchQuery.toLowerCase());
    });
  }, [snapshotSearchQuery]);

  // Filter volume types by search
  const filteredVolumeTypes = useMemo(() => {
    return mockVolumeTypes.filter((vt) => {
      return !volumeTypeSearchQuery || 
        vt.name.toLowerCase().includes(volumeTypeSearchQuery.toLowerCase());
    });
  }, [volumeTypeSearchQuery]);

  // Navigation functions
  const goToNextSection = (currentSection: SectionStep) => {
    const currentIndex = SECTION_ORDER.indexOf(currentSection);
    const nextSection = SECTION_ORDER[currentIndex + 1];

    if (nextSection) {
      setSectionStatus((prev) => ({
        ...prev,
        [currentSection]: 'done',
        [nextSection]: 'active',
      }));
    }
  };

  const editSection = (section: SectionStep) => {
    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      // Set the target section to active
      newStatus[section] = 'active';
      // Set all sections after the target to 'pre'
      const sectionIndex = SECTION_ORDER.indexOf(section);
      SECTION_ORDER.forEach((s, i) => {
        if (i > sectionIndex) {
          newStatus[s] = 'pre';
        }
      });
      return newStatus;
    });
  };

  const handleCancel = () => {
    navigate('/compute/volumes');
  };

  const handleCreate = () => {
    console.log('Creating volume:', {
      volumeName,
      availabilityZone,
      description,
      sourceType,
      selectedImage,
      selectedSnapshot,
      selectedVolumeType,
      volumeCapacity,
    });
    navigate('/compute/volumes');
  };

  // Check if create button should be disabled
  const isCreateDisabled = sectionStatus['configuration'] !== 'done';

  // Image table columns
  const imageColumns: TableColumn<ImageRow>[] = [
    { 
      key: 'status', 
      label: 'Status', 
      width: '70px',
      align: 'center',
      render: (value: ImageRow['status']) => <StatusIndicator status={value} />
    },
    { 
      key: 'name', 
      label: 'Name', 
      flex: 1, 
      sortable: true,
      render: (value: string, row: ImageRow) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-[var(--color-action-primary)] leading-[16px]">{value}</span>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </div>
          <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">ID: {row.id}</span>
        </div>
      )
    },
    { key: 'version', label: 'Version', width: '100px', sortable: true },
    { key: 'size', label: 'Size', width: '120px', sortable: true },
    { key: 'minDisk', label: 'Min disk', width: '120px', sortable: true },
    { key: 'minRAM', label: 'Min RAM', width: '100px', sortable: true },
    { key: 'visibility', label: 'Visibility', width: '100px', sortable: true },
  ];

  // Snapshot table columns
  const snapshotColumns: TableColumn<SnapshotRow>[] = [
    { 
      key: 'status', 
      label: 'Status', 
      width: '70px',
      align: 'center',
      render: (value: SnapshotRow['status']) => <StatusIndicator status={value} />
    },
    { 
      key: 'name', 
      label: 'Name', 
      flex: 2, 
      sortable: true,
      render: (value: string, row: SnapshotRow) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-[var(--color-action-primary)] leading-[16px]">{value}</span>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            {row.status === 'error' && (
              <IconAlertCircle size={16} className="text-[var(--color-state-danger)]" />
            )}
          </div>
          <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">ID: {row.id}</span>
        </div>
      )
    },
    { key: 'volumeType', label: 'Volume type', flex: 1, sortable: true },
    { key: 'size', label: 'Size', flex: 1, sortable: true },
    { key: 'createdAt', label: 'Created at', flex: 1, sortable: true },
  ];

  // Volume type table columns
  const volumeTypeColumns: TableColumn<VolumeTypeRow>[] = [
    { key: 'name', label: 'Name', flex: 2, sortable: true },
    { key: 'description', label: 'Description', flex: 2, sortable: true },
    { key: 'isPublic', label: 'Public', flex: 1 },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[200px]' : 'left-0'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Volumes', href: '/compute/volumes' },
                  { label: 'Create volume' },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            {/* Page Title */}
            <h1 className="text-[length:var(--font-size-18)] font-semibold leading-[var(--line-height-28)] text-[var(--color-text-default)] max-w-[1320px] mx-auto mb-4">
              Create volume
            </h1>
            
            <div className="flex gap-6 max-w-[1320px] mx-auto items-start">
              {/* Left Column - Main Content */}
              <div className="flex-1 min-w-0">
                <VStack gap={4} align="stretch">
                  
                  {/* Basic information Section */}
                  <SectionCard isActive={sectionStatus['basic-info'] === 'active'}>
                    <SectionCard.Header 
                      title={SECTION_LABELS['basic-info']}
                      showDivider={sectionStatus['basic-info'] === 'active'}
                      actions={
                        sectionStatus['basic-info'] === 'done' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconEdit size={12} />}
                            onClick={() => editSection('basic-info')}
                          >
                            Edit
                          </Button>
                        )
                      }
                    />
                    {sectionStatus['basic-info'] === 'active' && (
                      <SectionCard.Content gap={6}>
                        <FormField required>
                          <FormField.Label>Volume name</FormField.Label>
                          <FormField.Control>
                            <Input 
                              value={volumeName} 
                              onChange={(e) => setVolumeName(e.target.value)}
                              placeholder="Enter volume name"
                              fullWidth 
                            />
                          </FormField.Control>
                          <FormField.HelperText>
                            You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-64 characters.
                          </FormField.HelperText>
                        </FormField>

                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                        <FormField required>
                          <FormField.Label>AZ (Availability zone)</FormField.Label>
                          <FormField.HelperText>
                            Select the availability zone for the volume.
                          </FormField.HelperText>
                          <FormField.Control>
                            <Select
                              value={availabilityZone}
                              onChange={(value) => setAvailabilityZone(value)}
                              placeholder="Select AZ"
                              options={azOptions}
                              fullWidth
                            />
                          </FormField.Control>
                        </FormField>

                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                        <FormField>
                          <FormField.Label>Description</FormField.Label>
                          <FormField.Control>
                            <Input 
                              value={description} 
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Enter description"
                              fullWidth 
                            />
                          </FormField.Control>
                          <FormField.HelperText>
                            You can use letters, numbers, and special characters (+=,.@-_()), and maximum 255 characters.
                          </FormField.HelperText>
                        </FormField>

                        <div className="flex items-center justify-end w-full">
                          <Button 
                            variant="primary" 
                            onClick={() => goToNextSection('basic-info')}
                            disabled={!volumeName.trim() || !availabilityZone}
                          >
                            Next
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['basic-info'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Volume name" value={volumeName} showDivider />
                        <SectionCard.DataRow label="AZ" value={availabilityZone} showDivider />
                        <SectionCard.DataRow label="Description" value={description || '-'} showDivider />
                      </SectionCard.Content>
                    )}
                  </SectionCard>

                  {/* Source Section */}
                  <SectionCard isActive={sectionStatus['source'] === 'active'}>
                    <SectionCard.Header 
                      title={SECTION_LABELS['source']}
                      showDivider={sectionStatus['source'] === 'active'}
                      actions={
                        sectionStatus['source'] === 'done' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconEdit size={12} />}
                            onClick={() => editSection('source')}
                          >
                            Edit
                          </Button>
                        )
                      }
                    />
                    {sectionStatus['source'] === 'active' && (
                      <SectionCard.Content gap={6}>
                        <FormField required>
                          <FormField.Label>Volume source type</FormField.Label>
                          <FormField.HelperText>
                            Select the source for the new volume. You can create a blank volume or generate a volume from an image or an existing volume.
                          </FormField.HelperText>
                          <RadioGroup
                            value={sourceType}
                            onChange={(value) => {
                              setSourceType(value as SourceType);
                              setSelectedImage([]);
                              setSelectedSnapshot([]);
                            }}
                          >
                            <Radio value="blank" label="Blank volume" />
                            <Radio value="image" label="Image" />
                            <Radio value="snapshot" label="Volume snapshot" />
                          </RadioGroup>
                        </FormField>

                        {/* Image Selection */}
                        {sourceType === 'image' && (
                          <VStack gap={4} align="stretch">
                            {/* OS Filter Tabs */}
                            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-1 inline-flex w-fit">
                              <HStack gap={2}>
                                {[
                                  { id: 'all', label: 'Others', icon: IconDots },
                                  { id: 'ubuntu', label: 'Ubuntu', icon: IconBrandUbuntu },
                                  { id: 'windows', label: 'Windows', icon: IconBrandWindows },
                                  { id: 'rocky', label: 'Rocky', icon: IconMountain },
                                ].map((tab) => {
                                  const isSelected = imageOsFilter === tab.id;
                                  const Icon = tab.icon;
                                  return (
                                    <button
                                      key={tab.id}
                                      onClick={() => setImageOsFilter(tab.id)}
                                      className={`
                                        inline-flex items-center gap-1 justify-center px-0 py-2 rounded-[6px] cursor-pointer text-[11px] font-medium transition-colors w-[100px]
                                        ${isSelected 
                                          ? 'bg-white border border-[var(--color-border-default)] text-[var(--color-action-primary)]' 
                                          : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-default)]'
                                        }
                                      `}
                                    >
                                      <Icon size={14} />
                                      <span>{tab.label}</span>
                                    </button>
                                  );
                                })}
                              </HStack>
                            </div>

                            <div className="w-[280px]">
                              <SearchInput
                                placeholder="Search images by attribute"
                                value={imageSearchQuery}
                                onChange={(e) => setImageSearchQuery(e.target.value)}
                                onClear={() => setImageSearchQuery('')}
                                size="sm"
                                fullWidth
                              />
                            </div>

                            <Pagination
                              currentPage={imageCurrentPage}
                              totalPages={Math.ceil(filteredImages.length / 5)}
                              onPageChange={setImageCurrentPage}
                              totalItems={filteredImages.length}
                            />

                            <Table<ImageRow>
                              columns={imageColumns}
                              data={filteredImages.slice((imageCurrentPage - 1) * 5, imageCurrentPage * 5)}
                              rowKey="id"
                              emptyMessage="No images found"
                              selectable
                              hideSelectAll
                              selectedKeys={selectedImage}
                              onSelectionChange={setSelectedImage}
                            />

                            {/* Selected Images Chips */}
                            {selectedImage.length > 0 && (
                              <HStack gap={2} className="flex-wrap">
                                {selectedImage.map(id => {
                                  const image = mockImages.find(img => img.id === id);
                                  return image ? (
                                    <Chip 
                                      key={id}
                                      value={image.name}
                                      onRemove={() => setSelectedImage(selectedImage.filter(i => i !== id))}
                                    />
                                  ) : null;
                                })}
                              </HStack>
                            )}
                          </VStack>
                        )}

                        {/* Snapshot Selection */}
                        {sourceType === 'snapshot' && (
                          <VStack gap={4} align="stretch">
                            <div className="w-[280px]">
                              <SearchInput
                                placeholder="Search snapshots by attribute"
                                value={snapshotSearchQuery}
                                onChange={(e) => setSnapshotSearchQuery(e.target.value)}
                                onClear={() => setSnapshotSearchQuery('')}
                                size="sm"
                                fullWidth
                              />
                            </div>

                            <Pagination
                              currentPage={snapshotCurrentPage}
                              totalPages={Math.ceil(filteredSnapshots.length / 5)}
                              onPageChange={setSnapshotCurrentPage}
                              totalItems={filteredSnapshots.length}
                            />

                            <Table<SnapshotRow>
                              columns={snapshotColumns}
                              data={filteredSnapshots.slice((snapshotCurrentPage - 1) * 5, snapshotCurrentPage * 5)}
                              rowKey="id"
                              emptyMessage="No snapshots found"
                              selectable
                              hideSelectAll
                              selectedKeys={selectedSnapshot}
                              onSelectionChange={setSelectedSnapshot}
                            />

                            {/* Selected Snapshots Chips */}
                            {selectedSnapshot.length > 0 && (
                              <HStack gap={2} className="flex-wrap">
                                {selectedSnapshot.map(id => {
                                  const snapshot = mockSnapshots.find(s => s.id === id);
                                  return snapshot ? (
                                    <Chip 
                                      key={id}
                                      value={snapshot.name}
                                      onRemove={() => setSelectedSnapshot(selectedSnapshot.filter(i => i !== id))}
                                    />
                                  ) : null;
                                })}
                              </HStack>
                            )}
                          </VStack>
                        )}

                        <div className="flex items-center justify-end w-full">
                          <Button 
                            variant="primary" 
                            onClick={() => goToNextSection('source')}
                            disabled={
                              (sourceType === 'image' && selectedImage.length === 0) ||
                              (sourceType === 'snapshot' && selectedSnapshot.length === 0)
                            }
                          >
                            Next
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['source'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Source type" 
                          value={sourceType === 'blank' ? 'Blank volume' : sourceType === 'image' ? 'Image' : 'Volume snapshot'} 
                          showDivider 
                        />
                        {sourceType === 'image' && selectedImage.length > 0 && (
                          <SectionCard.DataRow 
                            label="Image" 
                            value={mockImages.find(i => i.id === selectedImage[0])?.name || '-'} 
                            showDivider 
                          />
                        )}
                        {sourceType === 'snapshot' && selectedSnapshot.length > 0 && (
                          <SectionCard.DataRow 
                            label="Snapshot" 
                            value={mockSnapshots.find(s => s.id === selectedSnapshot[0])?.name || '-'} 
                            showDivider 
                          />
                        )}
                      </SectionCard.Content>
                    )}
                  </SectionCard>

                  {/* Configuration Section */}
                  <SectionCard isActive={sectionStatus['configuration'] === 'active'}>
                    <SectionCard.Header 
                      title={SECTION_LABELS['configuration']}
                      showDivider={sectionStatus['configuration'] === 'active'}
                      actions={
                        sectionStatus['configuration'] === 'done' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconEdit size={12} />}
                            onClick={() => editSection('configuration')}
                          >
                            Edit
                          </Button>
                        )
                      }
                    />
                    {sectionStatus['configuration'] === 'active' && (
                      <SectionCard.Content gap={6}>
                        {/* Different content for snapshot vs other sources */}
                        {sourceType === 'snapshot' ? (
                          <>
                            {/* Volume type - Read-only for snapshot */}
                            <VStack gap={4} align="stretch">
                              <VStack gap={3} align="start">
                                <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                                  Volume type <span className="text-[var(--color-state-danger)]">*</span>
                                </span>
                                <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                                  Automatically set to the volume type of the source volume used to create the snapshot.
                                </span>
                              </VStack>
                              <div className="bg-[var(--color-surface-subtle)] px-4 py-3 rounded-lg w-full">
                                <span className="text-[12px] text-[var(--color-text-default)]">
                                  {selectedSnapshot.length > 0 
                                    ? mockSnapshots.find(s => s.id === selectedSnapshot[0])?.volumeType || '_DEFAULT_'
                                    : '_DEFAULT_'
                                  }
                                </span>
                              </div>
                            </VStack>

                            {/* Volume type capacity */}
                            <FormField required>
                              <FormField.Label>Volume type capacity</FormField.Label>
                              <FormField.HelperText>
                                Defines the size of the volume. Depending on the selected source, a minimum required size may apply.
                              </FormField.HelperText>
                              <div className="flex items-center gap-6 w-full border border-[var(--color-border-default)] rounded-md px-4 py-2">
                                <div className="flex-1">
                                  <Slider
                                    value={volumeCapacity}
                                    onChange={setVolumeCapacity}
                                    min={1}
                                    max={1460}
                                  />
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-[80px]">
                                    <NumberInput
                                      value={volumeCapacity}
                                      onChange={(val) => setVolumeCapacity(val ?? 64)}
                                      min={1}
                                      max={1460}
                                    />
                                  </div>
                                  <span className="text-[12px] text-[var(--color-text-default)]">GiB</span>
                                </div>
                              </div>
                              <FormField.HelperText>
                                1-1460 GiB
                              </FormField.HelperText>
                            </FormField>

                            <div className="flex items-center justify-end w-full">
                              <Button 
                                variant="primary" 
                                onClick={() => {
                                  setSectionStatus((prev) => ({
                                    ...prev,
                                    configuration: 'done',
                                  }));
                                }}
                              >
                                Next
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Standard Volume type selection for blank/image sources */}
                            <FormField required>
                              <FormField.Label>Volume type</FormField.Label>
                              <FormField.HelperText>
                                Select the volume type that determines performance characteristics for the volume.
                              </FormField.HelperText>
                            </FormField>

                            <VStack gap={4} align="stretch">
                              <div className="w-[280px]">
                                <SearchInput
                                  placeholder="Search volume types"
                                  value={volumeTypeSearchQuery}
                                  onChange={(e) => setVolumeTypeSearchQuery(e.target.value)}
                                  onClear={() => setVolumeTypeSearchQuery('')}
                                  size="sm"
                                  fullWidth
                                />
                              </div>

                              <Pagination
                                currentPage={volumeTypeCurrentPage}
                                totalPages={Math.ceil(filteredVolumeTypes.length / 5)}
                                onPageChange={setVolumeTypeCurrentPage}
                                totalItems={filteredVolumeTypes.length}
                              />

                              <Table<VolumeTypeRow>
                                columns={volumeTypeColumns}
                                data={filteredVolumeTypes.slice((volumeTypeCurrentPage - 1) * 5, volumeTypeCurrentPage * 5)}
                                rowKey="id"
                                emptyMessage="No volume types found"
                                selectable
                                selectedKeys={selectedVolumeType}
                                onSelectionChange={setSelectedVolumeType}
                              />

                              <span className="text-[12px] text-[var(--color-text-subtle)]">Selected</span>
                            </VStack>

                            <FormField required>
                              <FormField.Label>Volume type capacity</FormField.Label>
                              <FormField.HelperText>
                                Defines the size of the volume. Depending on the selected source, and minimum required size may apply.
                              </FormField.HelperText>
                              <div className="flex items-center gap-4 w-full">
                                <div className="flex-1">
                                  <Slider
                                    value={volumeCapacity}
                                    onChange={setVolumeCapacity}
                                    min={1}
                                    max={1000}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-[80px]">
                                    <NumberInput
                                      value={volumeCapacity}
                                      onChange={(val) => setVolumeCapacity(val ?? 10)}
                                      min={1}
                                      max={1000}
                                    />
                                  </div>
                                  <span className="text-[14px] text-[var(--color-text-default)]">GiB</span>
                                </div>
                              </div>
                              <FormField.HelperText>
                                1 ~ 1000 GiB
                              </FormField.HelperText>
                            </FormField>

                            <div className="flex items-center justify-end w-full">
                              <Button 
                                variant="primary" 
                                onClick={() => {
                                  setSectionStatus((prev) => ({
                                    ...prev,
                                    configuration: 'done',
                                  }));
                                }}
                                disabled={selectedVolumeType.length === 0}
                              >
                                Next
                              </Button>
                            </div>
                          </>
                        )}
                      </SectionCard.Content>
                    )}
                    {sectionStatus['configuration'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Volume type" 
                          value={mockVolumeTypes.find(v => v.id === selectedVolumeType[0])?.name || '-'} 
                          showDivider 
                        />
                        <SectionCard.DataRow 
                          label="Capacity" 
                          value={`${volumeCapacity} GiB`} 
                          showDivider 
                        />
                      </SectionCard.Content>
                    )}
                  </SectionCard>

                </VStack>
              </div>

              {/* Right Column - Summary Sidebar */}
              <SummarySidebar
                sectionStatus={sectionStatus}
                onCancel={handleCancel}
                onCreate={handleCreate}
                isCreateDisabled={isCreateDisabled}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateVolumePage;

