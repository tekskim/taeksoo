import { useState, useMemo, useEffect, useCallback } from 'react';
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
  Radio,
  RadioGroup,
  SearchInput,
  Table,
  Pagination,
  Slider,
  NumberInput,
  StatusIndicator,
  IconUbuntu,
  IconGrid,
  IconRocky,
  SelectionIndicator,
  PageShell,
  WizardSummary,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import type { TableColumn, WizardSummaryItem, WizardSectionState } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useIsV2 } from '@/hooks/useIsV2';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconDots,
  IconExternalLink,
  IconAlertCircle,
  IconEdit,
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

// Section order for display
const SECTION_ORDER: SectionStep[] = ['basic-info', 'source', 'configuration'];

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
  {
    id: 'img-001',
    name: 'Ubuntu-24.04-64-base',
    version: '24.04',
    size: '799.00 MiB',
    minDisk: '0.00 MiB',
    minRAM: '0 MiB',
    visibility: 'Public',
    os: 'ubuntu',
    status: 'active',
  },
  {
    id: 'img-002',
    name: 'Ubuntu-24.04-64-base',
    version: '24.04',
    size: '199.00 MiB',
    minDisk: '199.00 MiB',
    minRAM: '0 MiB',
    visibility: 'Public',
    os: 'ubuntu',
    status: 'active',
  },
  {
    id: 'img-003',
    name: 'Ubuntu-24.04-64-base',
    version: '24.04',
    size: '199.00 MiB',
    minDisk: '0.00 MiB',
    minRAM: '1 MiB',
    visibility: 'Public',
    os: 'ubuntu',
    status: 'active',
  },
  {
    id: 'img-004',
    name: 'Ubuntu-24.04-64-base',
    version: '24.04',
    size: '159.00 MiB',
    minDisk: '10.00 MiB',
    minRAM: '0 MiB',
    visibility: 'Public',
    os: 'ubuntu',
    status: 'active',
  },
  {
    id: 'img-005',
    name: 'Ubuntu-24.04-64-base',
    version: '24.04',
    size: '799.00 MiB',
    minDisk: '0.00 MiB',
    minRAM: '0 MiB',
    visibility: 'Public',
    os: 'ubuntu',
    status: 'active',
  },
  {
    id: 'img-006',
    name: 'Windows-Server-2019',
    version: '2019',
    size: '4.5 GiB',
    minDisk: '40 GiB',
    minRAM: '2 GiB',
    visibility: 'Public',
    os: 'windows',
    status: 'active',
  },
  {
    id: 'img-007',
    name: 'Rocky-Linux-9',
    version: '9.0',
    size: '1.2 GiB',
    minDisk: '10 GiB',
    minRAM: '1 GiB',
    visibility: 'Public',
    os: 'rocky',
    status: 'active',
  },
];

const mockSnapshots: SnapshotRow[] = [
  {
    id: 'snap-001',
    name: 'snapshot-01',
    volumeType: '_DEFAULT_',
    size: '50 GiB',
    createdAt: 'Nov 1, 2025',
    status: 'active',
  },
  {
    id: 'snap-002',
    name: 'snapshot-02',
    volumeType: '_DEFAULT_',
    size: '0.0 GiB',
    createdAt: 'Nov 20, 2025',
    status: 'active',
  },
  {
    id: 'snap-003',
    name: 'snapshot-03',
    volumeType: '_DEFAULT_',
    size: '10 GiB',
    createdAt: 'Nov 20, 2025',
    status: 'active',
  },
  {
    id: 'snap-004',
    name: 'snapshot-04',
    volumeType: '_DEFAULT_',
    size: '68 GiB',
    createdAt: 'Nov 20, 2025',
    status: 'active',
  },
  {
    id: 'snap-005',
    name: 'snapshot-05',
    volumeType: '_DEFAULT_',
    size: '68 GiB',
    createdAt: 'Nov 30, 2025',
    status: 'active',
  },
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

function SummarySidebar({
  sectionStatus,
  onCancel,
  onCreate,
  isCreateDisabled,
}: SummarySidebarProps) {
  const summaryItems: WizardSummaryItem[] = SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    status: sectionStatus[key],
  }));

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
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
  const isV2 = useIsV2();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

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

  // Validation errors
  const [volumeNameError, setVolumeNameError] = useState<string | null>(null);
  const [azError, setAzError] = useState<string | null>(null);
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [volumeTypeError, setVolumeTypeError] = useState<string | null>(null);

  // Wizard section states
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    source: isV2 ? 'active' : 'pre',
    configuration: isV2 ? 'active' : 'pre',
  });

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel } = useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create volume');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filter images by OS and search
  const filteredImages = useMemo(() => {
    return mockImages.filter((img) => {
      const matchesOs = imageOsFilter === 'all' || img.os === imageOsFilter;
      const matchesSearch =
        !imageSearchQuery || img.name.toLowerCase().includes(imageSearchQuery.toLowerCase());
      return matchesOs && matchesSearch;
    });
  }, [imageOsFilter, imageSearchQuery]);

  // Filter snapshots by search
  const filteredSnapshots = useMemo(() => {
    return mockSnapshots.filter((snap) => {
      return (
        !snapshotSearchQuery || snap.name.toLowerCase().includes(snapshotSearchQuery.toLowerCase())
      );
    });
  }, [snapshotSearchQuery]);

  // Filter volume types by search
  const filteredVolumeTypes = useMemo(() => {
    return mockVolumeTypes.filter((vt) => {
      return (
        !volumeTypeSearchQuery ||
        vt.name.toLowerCase().includes(volumeTypeSearchQuery.toLowerCase())
      );
    });
  }, [volumeTypeSearchQuery]);

  // Validation handlers
  const validateBasicInfo = () => {
    let hasError = false;

    if (!volumeName.trim()) {
      setVolumeNameError('Please enter a volume name.');
      hasError = true;
    } else {
      setVolumeNameError(null);
    }

    if (!availabilityZone) {
      setAzError('Please select an availability zone.');
      hasError = true;
    } else {
      setAzError(null);
    }

    return !hasError;
  };

  const validateSource = () => {
    let hasError = false;

    if (sourceType === 'image' && selectedImage.length === 0) {
      setSourceError('Please select an image.');
      hasError = true;
    } else if (sourceType === 'snapshot' && selectedSnapshot.length === 0) {
      setSourceError('Please select a snapshot.');
      hasError = true;
    } else {
      setSourceError(null);
    }

    return !hasError;
  };

  const validateConfiguration = () => {
    if (sourceType === 'snapshot') {
      setVolumeTypeError(null);
      return true; // Volume type is auto-set for snapshots
    }
    if (selectedVolumeType.length === 0) {
      setVolumeTypeError('Please select a volume type.');
      return false;
    }
    setVolumeTypeError(null);
    return true;
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

  // Section navigation with validation
  const goToNextSection = useCallback(
    (currentSection: SectionStep) => {
      if (isV2) return;
      // Validate current section before proceeding
      let isValid = true;
      if (currentSection === 'basic-info') {
        isValid = validateBasicInfo();
      } else if (currentSection === 'source') {
        isValid = validateSource();
      } else if (currentSection === 'configuration') {
        isValid = validateConfiguration();
      }

      if (!isValid) return;

      const currentIndex = SECTION_ORDER.indexOf(currentSection);
      const nextSection = SECTION_ORDER[currentIndex + 1];

      if (nextSection) {
        setSectionStatus((prev) => ({
          ...prev,
          [currentSection]: 'done',
          [nextSection]: 'active',
        }));
      } else {
        // Last section
        setSectionStatus((prev) => ({
          ...prev,
          [currentSection]: 'done',
        }));
      }
    },
    [validateBasicInfo, validateSource, validateConfiguration, isV2]
  );

  const editSection = useCallback(
    (section: SectionStep) => {
      if (isV2) return;
      setSectionStatus((prev) => {
        const newStatus = { ...prev };
        SECTION_ORDER.forEach((s) => {
          if (s === section) {
            newStatus[s] = 'active';
          } else if (newStatus[s] === 'active') {
            newStatus[s] = 'done';
          }
        });
        return newStatus;
      });
    },
    [isV2]
  );

  // Check if create button should be enabled
  const isCreateDisabled =
    !volumeName.trim() || (!isV2 && sectionStatus['basic-info'] === 'active');

  // Image table columns
  const imageColumns: TableColumn<ImageRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (value: ImageRow['status']) => <StatusIndicator status={value} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row: ImageRow) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-label-md text-[var(--color-action-primary)]">{value}</span>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID: {row.id}</span>
        </div>
      ),
    },
    {
      key: 'version',
      label: 'Version',
      flex: 1,
      minWidth: columnMinWidths.version,
      sortable: true,
    },
    { key: 'size', label: 'Size', flex: 1, minWidth: columnMinWidths.size, sortable: true },
    {
      key: 'minDisk',
      label: 'Min disk',
      flex: 1,
      minWidth: columnMinWidths.minDisk,
      sortable: true,
    },
    { key: 'minRAM', label: 'Min RAM', flex: 1, minWidth: columnMinWidths.minRAM, sortable: true },
    {
      key: 'visibility',
      label: 'Visibility',
      flex: 1,
      minWidth: columnMinWidths.visibility,
      sortable: true,
    },
  ];

  // Snapshot table columns
  const snapshotColumns: TableColumn<SnapshotRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (value: SnapshotRow['status']) => <StatusIndicator status={value} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row: SnapshotRow) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-label-md text-[var(--color-action-primary)]">{value}</span>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            {row.status === 'error' && (
              <IconAlertCircle size={14} className="text-[var(--color-state-danger)]" />
            )}
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID: {row.id}</span>
        </div>
      ),
    },
    {
      key: 'volumeType',
      label: 'Volume type',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: true,
    },
    { key: 'size', label: 'Size', flex: 1, minWidth: columnMinWidths.size, sortable: true },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
  ];

  // Volume type table columns
  const volumeTypeColumns: TableColumn<VolumeTypeRow>[] = [
    { key: 'name', label: 'Name', flex: 1, minWidth: columnMinWidths.name, sortable: true },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      minWidth: columnMinWidths.description,
      sortable: true,
    },
    { key: 'isPublic', label: 'Public', flex: 1, minWidth: columnMinWidths.type },
  ];

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          showAddButton={true}
          showWindowControls={true}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'Volumes', href: '/compute/volumes' }, { label: 'Create volume' }]}
            />
          }
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
      contentClassName="pt-3 px-8 pb-20"
    >
      <VStack gap={3} className="min-w-[1176px]">
        {/* Page Title */}
        <div className="flex items-center justify-between h-8">
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create volume</h1>
        </div>

        {/* Content Area */}
        <HStack gap={6} align="start" className="w-full">
          {/* Left Column - Main Content */}
          <VStack gap={4} className="flex-1">
            {/* Basic information Section */}
            <SectionCard isActive={!isV2 && sectionStatus['basic-info'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['basic-info']}
                showDivider={sectionStatus['basic-info'] === 'done'}
                actions={
                  !isV2 &&
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
              {(isV2 || sectionStatus['basic-info'] === 'active') && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <div className="py-6">
                      <FormField required error={!!volumeNameError}>
                        <FormField.Label>Volume name</FormField.Label>
                        <FormField.Control>
                          <Input
                            value={volumeName}
                            onChange={(e) => {
                              setVolumeName(e.target.value);
                              setVolumeNameError(null);
                            }}
                            placeholder="Enter volume name"
                            fullWidth
                          />
                        </FormField.Control>
                        <FormField.ErrorMessage>{volumeNameError}</FormField.ErrorMessage>
                        <FormField.HelperText>
                          You can use letters, numbers, and special characters (+=,.@-_), and the
                          length must be between 2-64 characters.
                        </FormField.HelperText>
                      </FormField>
                    </div>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <div className="py-6">
                      <FormField required error={!!azError}>
                        <FormField.Label>AZ (Availability zone)</FormField.Label>
                        <FormField.Description>
                          Select the availability zone for the volume.
                        </FormField.Description>
                        <FormField.Control>
                          <Select
                            value={availabilityZone}
                            onChange={(value) => {
                              setAvailabilityZone(value);
                              setAzError(null);
                            }}
                            placeholder="Select AZ"
                            options={azOptions}
                            fullWidth
                          />
                        </FormField.Control>
                        <FormField.ErrorMessage>{azError}</FormField.ErrorMessage>
                      </FormField>
                    </div>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <div className="py-6">
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
                          You can use letters, numbers, and special characters (+=,.@-_()), and
                          maximum 255 characters.
                        </FormField.HelperText>
                      </FormField>
                    </div>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <HStack justify="end" className="pt-3">
                      <Button variant="primary" onClick={() => goToNextSection('basic-info')}>
                        Next
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {!isV2 && sectionStatus['basic-info'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow label="Volume name" value={volumeName || '-'} />
                  <SectionCard.DataRow label="AZ" value={availabilityZone || '-'} />
                  <SectionCard.DataRow label="Description" value={description || '-'} />
                </SectionCard.Content>
              )}
            </SectionCard>
            {isV2 && (
              <SectionCard>
                <SectionCard.Header title={SECTION_LABELS['basic-info']} />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Volume name" value={volumeName || '-'} />
                  <SectionCard.DataRow label="AZ" value={availabilityZone || '-'} />
                  <SectionCard.DataRow label="Description" value={description || '-'} />
                </SectionCard.Content>
              </SectionCard>
            )}

            {/* Source Section */}
            <SectionCard isActive={!isV2 && sectionStatus['source'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['source']}
                showDivider={sectionStatus['source'] === 'done'}
                actions={
                  !isV2 &&
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
              {(isV2 || sectionStatus['source'] === 'active') && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <VStack gap={6} className="py-6">
                      <FormField required>
                        <FormField.Label>Volume source type</FormField.Label>
                        <FormField.Description>
                          Select the source for the new volume. You can create a blank volume or
                          generate a volume from an image or an existing volume.
                        </FormField.Description>
                        <FormField.Control>
                          <RadioGroup
                            value={sourceType}
                            onChange={(value) => {
                              setSourceType(value as SourceType);
                              setSelectedImage([]);
                              setSelectedSnapshot([]);
                              setSourceError(null);
                            }}
                          >
                            <Radio value="blank" label="Blank volume" />
                            <Radio value="image" label="Image" />
                            <Radio value="snapshot" label="Volume snapshot" />
                          </RadioGroup>
                        </FormField.Control>
                      </FormField>

                      {/* Image Selection */}
                      {(isV2 || sourceType === 'image') && (
                        <VStack gap={3} align="stretch">
                          {/* OS Filter Tabs */}
                          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-1 inline-flex w-fit">
                            {[
                              { id: 'all', label: 'Others', icon: IconDots },
                              { id: 'ubuntu', label: 'Ubuntu', icon: IconUbuntu },
                              { id: 'windows', label: 'Windows', icon: IconGrid },
                              { id: 'rocky', label: 'Rocky', icon: IconRocky },
                            ].map((tab) => {
                              const isSelected = imageOsFilter === tab.id;
                              const Icon = tab.icon;
                              return (
                                <button
                                  key={tab.id}
                                  onClick={() => setImageOsFilter(tab.id)}
                                  className={`
                                        inline-flex items-center gap-1.5 px-3 py-2 rounded-[4px] cursor-pointer text-label-md transition-colors
                                        ${
                                          isSelected
                                            ? 'bg-[var(--color-surface-default)] text-[var(--color-text-default)] shadow-sm'
                                            : 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]'
                                        }
                                      `}
                                >
                                  <Icon size={14} />
                                  <span>{tab.label}</span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="w-[var(--search-input-width)]">
                            <SearchInput
                              placeholder="Search images by attributes"
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
                            selectedCount={selectedImage.length}
                          />

                          <VStack gap={2}>
                            <Table<ImageRow>
                              columns={imageColumns}
                              data={filteredImages.slice(
                                (imageCurrentPage - 1) * 5,
                                imageCurrentPage * 5
                              )}
                              rowKey="id"
                              emptyMessage="No images found"
                              selectable
                              hideSelectAll
                              selectedKeys={selectedImage}
                              onSelectionChange={(keys) => {
                                setSelectedImage(keys);
                                setSourceError(null);
                              }}
                            />

                            {/* Selection Indicator for Images */}
                            <SelectionIndicator
                              selectedItems={selectedImage.map((id) => {
                                const image = mockImages.find((img) => img.id === id);
                                return { id, label: image?.name || id };
                              })}
                              onRemove={(id) =>
                                setSelectedImage(selectedImage.filter((i) => i !== id))
                              }
                              error={!!sourceError}
                              errorMessage={sourceError || undefined}
                            />
                          </VStack>
                        </VStack>
                      )}

                      {/* Snapshot Selection */}
                      {(isV2 || sourceType === 'snapshot') && (
                        <VStack gap={4} align="stretch">
                          <div className="w-[var(--search-input-width)]">
                            <SearchInput
                              placeholder="Search snapshots by attributes"
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
                            selectedCount={selectedSnapshot.length}
                          />

                          <VStack gap={2}>
                            <Table<SnapshotRow>
                              columns={snapshotColumns}
                              data={filteredSnapshots.slice(
                                (snapshotCurrentPage - 1) * 5,
                                snapshotCurrentPage * 5
                              )}
                              rowKey="id"
                              emptyMessage="No snapshots found"
                              selectable
                              hideSelectAll
                              selectedKeys={selectedSnapshot}
                              onSelectionChange={(keys) => {
                                setSelectedSnapshot(keys);
                                setSourceError(null);
                              }}
                            />

                            {/* Selection Indicator for Snapshots */}
                            <SelectionIndicator
                              selectedItems={selectedSnapshot.map((id) => {
                                const snapshot = mockSnapshots.find((s) => s.id === id);
                                return { id, label: snapshot?.name || id };
                              })}
                              onRemove={(id) =>
                                setSelectedSnapshot(selectedSnapshot.filter((i) => i !== id))
                              }
                              error={!!sourceError}
                              errorMessage={sourceError || undefined}
                            />
                          </VStack>
                        </VStack>
                      )}
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    <HStack justify="end" className="pt-3">
                      <Button variant="primary" onClick={() => goToNextSection('source')}>
                        Next
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {!isV2 && sectionStatus['source'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Source type"
                    value={
                      sourceType === 'blank'
                        ? 'Blank volume'
                        : sourceType === 'image'
                          ? 'Image'
                          : 'Volume snapshot'
                    }
                  />
                  {sourceType === 'image' && selectedImage.length > 0 && (
                    <SectionCard.DataRow
                      label="Image"
                      value={
                        mockImages.find((img) => img.id === selectedImage[0])?.name ||
                        selectedImage[0]
                      }
                    />
                  )}
                  {sourceType === 'snapshot' && selectedSnapshot.length > 0 && (
                    <SectionCard.DataRow
                      label="Snapshot"
                      value={
                        mockSnapshots.find((s) => s.id === selectedSnapshot[0])?.name ||
                        selectedSnapshot[0]
                      }
                    />
                  )}
                </SectionCard.Content>
              )}
            </SectionCard>
            {isV2 && (
              <SectionCard>
                <SectionCard.Header title={SECTION_LABELS['source']} />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Source type"
                    value={
                      sourceType === 'blank'
                        ? 'Blank volume'
                        : sourceType === 'image'
                          ? 'Image'
                          : 'Volume snapshot'
                    }
                  />
                  {sourceType === 'image' && selectedImage.length > 0 && (
                    <SectionCard.DataRow
                      label="Image"
                      value={
                        mockImages.find((img) => img.id === selectedImage[0])?.name ||
                        selectedImage[0]
                      }
                    />
                  )}
                  {sourceType === 'snapshot' && selectedSnapshot.length > 0 && (
                    <SectionCard.DataRow
                      label="Snapshot"
                      value={
                        mockSnapshots.find((s) => s.id === selectedSnapshot[0])?.name ||
                        selectedSnapshot[0]
                      }
                    />
                  )}
                </SectionCard.Content>
              </SectionCard>
            )}

            {/* Configuration Section */}
            <SectionCard isActive={!isV2 && sectionStatus['configuration'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['configuration']}
                showDivider={sectionStatus['configuration'] === 'done'}
                actions={
                  !isV2 &&
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
              {(isV2 || sectionStatus['configuration'] === 'active') && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    {/* Different content for snapshot vs other sources */}
                    {(isV2 || sourceType === 'snapshot') && (
                      <>
                        {/* Volume type - Read-only for snapshot */}
                        <div className="py-6">
                          <VStack gap={4} align="stretch">
                            <VStack gap={3} align="start">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Volume type{' '}
                                <span className="text-[var(--color-state-danger)]">*</span>
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                Automatically set to the volume type of the source volume used to
                                create the snapshot.
                              </span>
                            </VStack>
                            <div className="bg-[var(--color-surface-subtle)] px-4 py-3 rounded-lg w-full">
                              <span className="text-body-md text-[var(--color-text-default)]">
                                {selectedSnapshot.length > 0
                                  ? mockSnapshots.find((s) => s.id === selectedSnapshot[0])
                                      ?.volumeType || '_DEFAULT_'
                                  : '_DEFAULT_'}
                              </span>
                            </div>
                          </VStack>
                        </div>

                        {/* Volume type capacity */}
                        <div className="py-6">
                          <FormField required>
                            <FormField.Label>Volume type capacity</FormField.Label>
                            <FormField.Description>
                              Defines the size of the volume. Depending on the selected source, a
                              minimum required size may apply.
                            </FormField.Description>
                            <FormField.Control>
                              <HStack
                                gap={3}
                                align="center"
                                className="max-w-[var(--slider-row-max-width)]"
                              >
                                <Slider
                                  value={volumeCapacity}
                                  onChange={setVolumeCapacity}
                                  min={1}
                                  max={1460}
                                  step={10}
                                  className="flex-1"
                                />
                                <NumberInput
                                  value={volumeCapacity}
                                  onChange={(val) => setVolumeCapacity(val ?? 64)}
                                  min={1}
                                  max={1460}
                                  step={1}
                                  width="xs"
                                  suffix="GiB"
                                />
                              </HStack>
                            </FormField.Control>
                            <FormField.HelperText>1-1460 GiB</FormField.HelperText>
                          </FormField>
                        </div>
                      </>
                    )}
                    {(isV2 || sourceType !== 'snapshot') && (
                      <>
                        {/* Standard Volume type selection for blank/image sources */}
                        <div className="py-6">
                          <VStack gap={3} align="stretch">
                            <FormField required>
                              <FormField.Label>Volume type</FormField.Label>
                              <FormField.Description>
                                Select the volume type that determines performance characteristics
                                for the volume.
                              </FormField.Description>
                            </FormField>

                            <div className="w-[var(--search-input-width)]">
                              <SearchInput
                                placeholder="Search volume types by attributes"
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
                              selectedCount={selectedVolumeType.length}
                            />

                            <VStack gap={2}>
                              <Table<VolumeTypeRow>
                                columns={volumeTypeColumns}
                                data={filteredVolumeTypes.slice(
                                  (volumeTypeCurrentPage - 1) * 5,
                                  volumeTypeCurrentPage * 5
                                )}
                                rowKey="id"
                                emptyMessage="No volume types found"
                                selectable
                                selectedKeys={selectedVolumeType}
                                onSelectionChange={(keys) => {
                                  setSelectedVolumeType(keys);
                                  setVolumeTypeError(null);
                                }}
                              />

                              {/* Selection Indicator for Volume Types */}
                              <SelectionIndicator
                                selectedItems={selectedVolumeType.map((id) => {
                                  const volumeType = mockVolumeTypes.find((v) => v.id === id);
                                  return { id, label: volumeType?.name || id };
                                })}
                                onRemove={(id) =>
                                  setSelectedVolumeType(selectedVolumeType.filter((i) => i !== id))
                                }
                                error={!!volumeTypeError}
                                errorMessage={volumeTypeError || undefined}
                              />
                            </VStack>
                          </VStack>
                        </div>

                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                        <div className="py-6">
                          <FormField required>
                            <FormField.Label>Volume type capacity</FormField.Label>
                            <FormField.Description>
                              Defines the size of the volume. Depending on the selected source, and
                              minimum required size may apply.
                            </FormField.Description>
                            <FormField.Control>
                              <HStack
                                gap={3}
                                align="center"
                                className="max-w-[var(--slider-row-max-width)]"
                              >
                                <Slider
                                  value={volumeCapacity}
                                  onChange={setVolumeCapacity}
                                  min={1}
                                  max={1000}
                                  step={10}
                                  className="flex-1"
                                />
                                <NumberInput
                                  value={volumeCapacity}
                                  onChange={(val) => setVolumeCapacity(val ?? 10)}
                                  min={1}
                                  max={1000}
                                  step={1}
                                  width="xs"
                                  suffix="GiB"
                                />
                              </HStack>
                            </FormField.Control>
                            <FormField.HelperText>1 ~ 1000 GiB</FormField.HelperText>
                          </FormField>
                        </div>
                      </>
                    )}

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <HStack justify="end" className="pt-3">
                      <Button variant="primary" onClick={() => goToNextSection('configuration')}>
                        Done
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {!isV2 && sectionStatus['configuration'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Volume type"
                    value={
                      sourceType === 'snapshot'
                        ? (selectedSnapshot.length > 0
                            ? mockSnapshots.find((s) => s.id === selectedSnapshot[0])?.volumeType
                            : '_DEFAULT_') || '_DEFAULT_'
                        : selectedVolumeType.length > 0
                          ? mockVolumeTypes.find((v) => v.id === selectedVolumeType[0])?.name ||
                            selectedVolumeType[0]
                          : '-'
                    }
                  />
                  <SectionCard.DataRow label="Capacity" value={`${volumeCapacity} GiB`} />
                </SectionCard.Content>
              )}
            </SectionCard>
            {isV2 && (
              <SectionCard>
                <SectionCard.Header title={SECTION_LABELS['configuration']} />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Volume type"
                    value={
                      sourceType === 'snapshot'
                        ? (selectedSnapshot.length > 0
                            ? mockSnapshots.find((s) => s.id === selectedSnapshot[0])?.volumeType
                            : '_DEFAULT_') || '_DEFAULT_'
                        : selectedVolumeType.length > 0
                          ? mockVolumeTypes.find((v) => v.id === selectedVolumeType[0])?.name ||
                            selectedVolumeType[0]
                          : '-'
                    }
                  />
                  <SectionCard.DataRow label="Capacity" value={`${volumeCapacity} GiB`} />
                </SectionCard.Content>
              </SectionCard>
            )}
          </VStack>

          {/* Right Column - Summary Sidebar */}
          <SummarySidebar
            sectionStatus={sectionStatus}
            onCancel={handleCancel}
            onCreate={handleCreate}
            isCreateDisabled={isCreateDisabled}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default CreateVolumePage;
