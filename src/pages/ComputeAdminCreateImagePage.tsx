import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  HStack,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Input,
  NumberInput,
  Select,
  SectionCard,
  FormField,
  Toggle,
  WizardSummary,
  Tabs,
  TabList,
  Tab,
  Disclosure,
  DisclosureTrigger,
  DisclosurePanel,
  SearchInput,
  Pagination,
  Table,
  StatusIndicator,
  SelectionIndicator,
  Radio,
  RadioGroup,
  type TableColumn,
  fixedColumns,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconEdit, IconUpload, IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'source' | 'specification' | 'advanced';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  source: 'Source',
  specification: 'Specification',
  advanced: 'Advanced',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'source', 'specification', 'advanced'];

// Tenant type for owned tenant selection
interface Tenant {
  id: string;
  name: string;
  status: 'active' | 'deactivated';
  description: string;
}

// Mock tenant data
const mockTenants: Tenant[] = [
  { id: '12345678', name: 'tenant A', status: 'active', description: '-' },
  { id: '12345679', name: 'tenant B', status: 'active', description: '-' },
  { id: '12345680', name: 'tenant C', status: 'active', description: '-' },
  { id: '12345681', name: 'tenant D', status: 'deactivated', description: '-' },
  { id: '12345682', name: 'tenant E', status: 'active', description: '-' },
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

export function ComputeAdminCreateImagePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Form state
  const [imageName, setImageName] = useState('');
  const [description, setDescription] = useState('');
  const [isProtected, setIsProtected] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'shared' | 'private'>('public');

  // Owned tenant state
  const [tenantSearch, setTenantSearch] = useState('');
  const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>([]);
  const [tenantCurrentPage, setTenantCurrentPage] = useState(1);
  const tenantRowsPerPage = 5;

  // Shared tenants state (for visibility = shared)
  const [sharedTenantSearch, setSharedTenantSearch] = useState('');
  const [sharedTenantIds, setSharedTenantIds] = useState<string[]>([]);
  const [sharedTenantCurrentPage, setSharedTenantCurrentPage] = useState(1);

  // Source section state
  const [sourceType, setSourceType] = useState<'file' | 'url'>('file');
  const [sourceUrl, setSourceUrl] = useState('');

  // Specification section state
  const [diskFormat, setDiskFormat] = useState('');
  const [os, setOs] = useState('');
  const [osVersion, setOsVersion] = useState('');
  const [osAdmin, setOsAdmin] = useState('');
  const [minDisk, setMinDisk] = useState<number | undefined>(undefined);
  const [minRam, setMinRam] = useState<number | undefined>(undefined);
  const [specAdvancedOpen, setSpecAdvancedOpen] = useState(true);

  // Advanced section state
  const [qemuGuestAgent, setQemuGuestAgent] = useState(true);
  const [cpuPolicy, setCpuPolicy] = useState('none');
  const [cpuThreadPolicy, setCpuThreadPolicy] = useState('none');

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    source: 'pre',
    specification: 'pre',
    advanced: 'done',
  });

  // Validation error state
  const [showTenantError, setShowTenantError] = useState(false);
  const [showImageNameError, setShowImageNameError] = useState(false);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel } = useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create image');
  }, []);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [
    { label: 'Images', href: '/compute-admin/images' },
    { label: 'Create image' },
  ];

  // Filter tenants by search
  const filteredTenants = useMemo(() => {
    if (!tenantSearch.trim()) return mockTenants;
    return mockTenants.filter(
      (tenant) =>
        tenant.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
        tenant.id.includes(tenantSearch)
    );
  }, [tenantSearch]);

  const totalTenantPages = Math.ceil(filteredTenants.length / tenantRowsPerPage);
  const paginatedTenants = filteredTenants.slice(
    (tenantCurrentPage - 1) * tenantRowsPerPage,
    tenantCurrentPage * tenantRowsPerPage
  );

  const selectedTenants = mockTenants.filter((t) => selectedTenantIds.includes(t.id));

  // Filter shared tenants by search
  const filteredSharedTenants = useMemo(() => {
    if (!sharedTenantSearch.trim()) return mockTenants;
    return mockTenants.filter(
      (tenant) =>
        tenant.name.toLowerCase().includes(sharedTenantSearch.toLowerCase()) ||
        tenant.id.includes(sharedTenantSearch)
    );
  }, [sharedTenantSearch]);

  const totalSharedTenantPages = Math.ceil(filteredSharedTenants.length / tenantRowsPerPage);
  const paginatedSharedTenants = filteredSharedTenants.slice(
    (sharedTenantCurrentPage - 1) * tenantRowsPerPage,
    sharedTenantCurrentPage * tenantRowsPerPage
  );

  const selectedSharedTenants = mockTenants.filter((t) => sharedTenantIds.includes(t.id));

  // Tenant table columns
  const tenantColumns: TableColumn<Tenant>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator status={row.status} layout="icon-only" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <Link
              to={`/compute-admin/tenants/${row.id}`}
              className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </Link>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID: {row.id}</span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      sortable: true,
    },
  ];

  // Navigation handlers
  const handleCancel = () => {
    navigate('/compute-admin/images');
  };

  const handleCreate = () => {
    console.log('Creating image:', {
      imageName,
      description,
      isProtected,
      visibility,
      selectedTenantIds,
      sharedTenantIds,
      sourceType,
      sourceUrl,
      diskFormat,
      os,
      osVersion,
      osAdmin,
      minDisk,
      minRam,
      qemuGuestAgent,
      cpuPolicy,
      cpuThreadPolicy,
    });
    navigate('/compute-admin/images');
  };

  // Section navigation
  const goToNextSection = useCallback(
    (currentSection: SectionStep) => {
      // Validate basic-info section
      if (currentSection === 'basic-info') {
        let hasError = false;

        if (!imageName.trim()) {
          setShowImageNameError(true);
          hasError = true;
        } else {
          setShowImageNameError(false);
        }

        if (selectedTenantIds.length === 0) {
          setShowTenantError(true);
          hasError = true;
        } else {
          setShowTenantError(false);
        }

        if (hasError) return;
      }

      const currentIndex = SECTION_ORDER.indexOf(currentSection);
      const nextSection = SECTION_ORDER[currentIndex + 1];

      if (nextSection) {
        setSectionStatus((prev) => ({
          ...prev,
          [currentSection]: 'done',
          [nextSection]: 'active',
        }));
      }
    },
    [selectedTenantIds, imageName]
  );

  const editSection = useCallback((section: SectionStep) => {
    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      // Set all sections to their appropriate state
      SECTION_ORDER.forEach((s) => {
        if (s === section) {
          newStatus[s] = 'active';
        } else if (newStatus[s] === 'active') {
          newStatus[s] = 'done';
        }
      });
      return newStatus;
    });
  }, []);

  // Check if create button should be enabled
  const isCreateDisabled =
    !imageName.trim() || selectedTenantIds.length === 0 || sectionStatus['basic-info'] === 'active';

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <div className="flex h-full">
        {/* Sidebar */}
        <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content Area */}
        <main
          className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
          style={{ left: sidebarOpen ? '200px' : '0' }}
        >
          {/* Tab Bar */}
          <div className="shrink-0">
            <TabBar
              tabs={tabBarTabs}
              activeTab={activeTabId}
              onTabChange={selectTab}
              onTabClose={closeTab}
              showAddButton={false}
            />
          </div>

          {/* Top Bar */}
          <TopBar
            breadcrumb={<Breadcrumb items={breadcrumbItems} />}
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                onClick={() => console.log('Notifications clicked')}
                aria-label="Notifications"
                badge
              />
            }
          />

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
            <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)] min-h-full">
              <VStack gap={3} className="min-w-[1176px]">
                {/* Page Title */}
                <div className="flex items-center justify-between h-8">
                  <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create image</h1>
                </div>

                {/* Content Area */}
                <HStack gap={6} align="start" className="w-full">
                  {/* Left Column - Main Content */}
                  <VStack gap={4} className="flex-1">
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
                          <FormField required error={showImageNameError}>
                            <FormField.Label>Image name</FormField.Label>
                            <FormField.Control>
                              <Input
                                value={imageName}
                                onChange={(e) => {
                                  setImageName(e.target.value);
                                  if (e.target.value.trim()) {
                                    setShowImageNameError(false);
                                  }
                                }}
                                placeholder="Enter image name"
                                fullWidth
                                error={showImageNameError}
                              />
                            </FormField.Control>
                            {showImageNameError && (
                              <FormField.ErrorMessage>
                                Please enter an image name.
                              </FormField.ErrorMessage>
                            )}
                            <FormField.HelperText>
                              You can use letters, numbers, and special characters (+=,.@-_), and
                              the length must be between 2-128 characters.
                            </FormField.HelperText>
                          </FormField>

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
                              You can use letters, numbers, and special characters (+=,.@-_()[]),
                              and maximum 255 characters.
                            </FormField.HelperText>
                          </FormField>

                          {/* Owned tenant section */}
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-label-lg leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                  Owned tenant
                                </span>
                                <span className="text-[var(--color-state-danger)]">*</span>
                              </div>
                              <span className="text-body-sm leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                                Select the tenant that will own the image.
                              </span>
                            </div>

                            {/* Search */}
                            <SearchInput
                              value={tenantSearch}
                              onChange={(e) => setTenantSearch(e.target.value)}
                              placeholder="Search tenants by attributes"
                            />

                            {/* Pagination */}
                            <Pagination
                              currentPage={tenantCurrentPage}
                              totalPages={totalTenantPages}
                              onPageChange={setTenantCurrentPage}
                              totalItems={filteredTenants.length}
                              selectedCount={selectedTenantIds.length}
                            />

                            {/* Tenant Table */}
                            <Table<Tenant>
                              columns={tenantColumns}
                              data={paginatedTenants}
                              rowKey="id"
                              emptyMessage="No tenants found"
                              selectable
                              selectedKeys={selectedTenantIds}
                              onSelectionChange={(keys) => {
                                setSelectedTenantIds(keys);
                                if (keys.length > 0) {
                                  setShowTenantError(false);
                                }
                              }}
                            />

                            {/* Selection Indicator */}
                            <SelectionIndicator
                              selectedItems={selectedTenants.map((t) => ({
                                id: t.id,
                                label: `${t.name} (ID: ${t.id})`,
                              }))}
                              onRemove={(id) =>
                                setSelectedTenantIds((prev) => prev.filter((tid) => tid !== id))
                              }
                              error={showTenantError}
                              errorMessage="Please select a tenant."
                            />
                          </div>

                          {/* Visibility section */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-label-lg leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                Visibility
                              </span>
                              <span className="text-[var(--color-state-danger)]">*</span>
                            </div>
                            <span className="text-body-md leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                              Specifies the availability scope of the image based on its visibility
                              setting.
                            </span>
                            <RadioGroup
                              value={visibility}
                              onChange={(val) =>
                                setVisibility(val as 'public' | 'shared' | 'private')
                              }
                            >
                              <Radio value="public" label="Public" />
                              <Radio value="shared" label="Shared" />
                              <Radio value="private" label="Private" />
                            </RadioGroup>

                            {/* Shared tenants table - shown when visibility is 'shared' */}
                            {visibility === 'shared' && (
                              <div className="flex flex-col gap-4 mt-2">
                                <div className="flex flex-col gap-2">
                                  <span className="text-label-lg leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                    Tenants
                                  </span>
                                  <span className="text-body-md leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                                    Select the tenants to share the image with.
                                  </span>
                                </div>

                                {/* Search */}
                                <SearchInput
                                  value={sharedTenantSearch}
                                  onChange={(e) => setSharedTenantSearch(e.target.value)}
                                  placeholder="Search tenants by attributes"
                                />

                                {/* Pagination */}
                                <Pagination
                                  currentPage={sharedTenantCurrentPage}
                                  totalPages={totalSharedTenantPages}
                                  onPageChange={setSharedTenantCurrentPage}
                                  totalItems={filteredSharedTenants.length}
                                  selectedCount={sharedTenantIds.length}
                                />

                                {/* Shared Tenant Table */}
                                <Table<Tenant>
                                  columns={tenantColumns}
                                  data={paginatedSharedTenants}
                                  rowKey="id"
                                  emptyMessage="No tenants found"
                                  selectable
                                  selectedKeys={sharedTenantIds}
                                  onSelectionChange={(keys) => {
                                    setSharedTenantIds(keys);
                                  }}
                                />

                                {/* Selection Indicator */}
                                <SelectionIndicator
                                  selectedItems={selectedSharedTenants.map((t) => ({
                                    id: t.id,
                                    label: `${t.name} (ID: ${t.id})`,
                                  }))}
                                  onRemove={(id) =>
                                    setSharedTenantIds((prev) => prev.filter((tid) => tid !== id))
                                  }
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2">
                              <span className="text-label-lg leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                Protected
                              </span>
                              <span className="text-body-md leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                                Protected images cannot be deleted, preventing accidental removal.
                              </span>
                            </div>
                            <HStack gap={2} align="center">
                              <Toggle checked={isProtected} onChange={setIsProtected} />
                              <span className="text-body-md text-[var(--color-text-default)]">
                                {isProtected ? 'Yes' : 'No'}
                              </span>
                            </HStack>
                          </div>

                          <div className="flex items-center justify-end w-full">
                            <Button variant="primary" onClick={() => goToNextSection('basic-info')}>
                              Next
                            </Button>
                          </div>
                        </SectionCard.Content>
                      )}
                      {sectionStatus['basic-info'] === 'done' && (
                        <SectionCard.Content>
                          <SectionCard.DataRow
                            label="Image name"
                            value={imageName || '-'}
                            showDivider
                          />
                          <SectionCard.DataRow
                            label="Description"
                            value={description || '-'}
                            showDivider
                          />
                          <SectionCard.DataRow
                            label="Owned tenant"
                            value={
                              selectedTenants.length > 0
                                ? selectedTenants.map((t) => `${t.name} (ID: ${t.id})`).join(', ')
                                : '-'
                            }
                            showDivider
                          />
                          <SectionCard.DataRow
                            label="Visibility"
                            value={visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                            showDivider
                          />
                          {visibility === 'shared' && (
                            <SectionCard.DataRow
                              label="Shared with"
                              value={
                                selectedSharedTenants.length > 0
                                  ? selectedSharedTenants
                                      .map((t) => `${t.name} (ID: ${t.id})`)
                                      .join(', ')
                                  : '-'
                              }
                              showDivider
                            />
                          )}
                          <SectionCard.DataRow
                            label="Protected"
                            value={isProtected ? 'Yes' : 'No'}
                            showDivider
                          />
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
                          {/* Upload type Label */}
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-center gap-1.5">
                              <span className="text-label-lg leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                Upload type
                              </span>
                              <span className="text-[var(--color-state-danger)]">*</span>
                            </div>
                            <span className="text-body-sm leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                              Registers an image by uploading a file or entering a file URL.
                            </span>
                          </div>

                          {/* Upload type Tabs */}
                          <div className="flex flex-col gap-3 w-full">
                            <Tabs
                              value={sourceType}
                              onChange={(value) => setSourceType(value as 'file' | 'url')}
                              variant="underline"
                              size="sm"
                            >
                              <TabList>
                                <Tab value="file">Upload file</Tab>
                                <Tab value="url">File URL</Tab>
                              </TabList>
                            </Tabs>

                            {/* File Upload */}
                            {sourceType === 'file' && (
                              <VStack gap={3} align="start">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  leftIcon={<IconUpload size={12} />}
                                >
                                  Choose File
                                </Button>
                                <span className="text-body-sm text-[var(--color-text-subtle)]">
                                  Only RAW, QCOW2, ISO, AKI, and ARI file formats are allowed.
                                </span>
                              </VStack>
                            )}

                            {/* File URL */}
                            {sourceType === 'url' && (
                              <VStack gap={3} align="stretch">
                                <Input
                                  value={sourceUrl}
                                  onChange={(e) => setSourceUrl(e.target.value)}
                                  placeholder="e.g. https://example.com/image.qcow2"
                                  fullWidth
                                />
                                <span className="text-body-sm text-[var(--color-text-subtle)]">
                                  The URL must start with http:// or https://.
                                </span>
                              </VStack>
                            )}
                          </div>

                          {/* Divider */}
                          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                          <div className="flex items-center justify-end w-full">
                            <Button
                              variant="primary"
                              onClick={() => goToNextSection('source')}
                              disabled={sourceType === 'url' && !sourceUrl.trim()}
                            >
                              Next
                            </Button>
                          </div>
                        </SectionCard.Content>
                      )}
                      {sectionStatus['source'] === 'done' && (
                        <SectionCard.Content>
                          <SectionCard.DataRow
                            label="Upload type"
                            value={sourceType === 'file' ? 'Upload File' : 'File URL'}
                            showDivider
                          />
                          {sourceType === 'url' && (
                            <SectionCard.DataRow label="URL" value={sourceUrl || '-'} showDivider />
                          )}
                        </SectionCard.Content>
                      )}
                    </SectionCard>

                    {/* Specification Section */}
                    <SectionCard isActive={sectionStatus['specification'] === 'active'}>
                      <SectionCard.Header
                        title={SECTION_LABELS['specification']}
                        showDivider={sectionStatus['specification'] === 'active'}
                        actions={
                          sectionStatus['specification'] === 'done' && (
                            <HStack gap={3} align="center">
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                Auto-filled
                              </span>
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<IconEdit size={12} />}
                                onClick={() => editSection('specification')}
                              >
                                Edit
                              </Button>
                            </HStack>
                          )
                        }
                      />
                      {sectionStatus['specification'] === 'active' && (
                        <SectionCard.Content gap={6}>
                          {/* Disk format */}
                          <FormField required>
                            <FormField.Label>Disk format</FormField.Label>
                            <FormField.Description>
                              Select the disk format for the image. It must match the actual type of
                              the uploaded file.
                            </FormField.Description>
                            <FormField.Control>
                              <Select
                                value={diskFormat}
                                onChange={(value) => setDiskFormat(value)}
                                placeholder="Select disk format"
                                options={[
                                  { value: 'raw', label: 'RAW' },
                                  { value: 'qcow2', label: 'QCOW2' },
                                  { value: 'vhd', label: 'VHD' },
                                  { value: 'vmdk', label: 'VMDK' },
                                  { value: 'iso', label: 'ISO' },
                                  { value: 'aki', label: 'AKI' },
                                  { value: 'ari', label: 'ARI' },
                                ]}
                                fullWidth
                              />
                            </FormField.Control>
                          </FormField>

                          {/* OS */}
                          <FormField required>
                            <FormField.Label>OS</FormField.Label>
                            <FormField.Description>
                              Select the operating system type for the image.
                            </FormField.Description>
                            <FormField.Control>
                              <Select
                                value={os}
                                onChange={(value) => setOs(value)}
                                placeholder="Select OS"
                                options={[
                                  { value: 'ubuntu', label: 'Ubuntu' },
                                  { value: 'centos', label: 'CentOS' },
                                  { value: 'debian', label: 'Debian' },
                                  { value: 'rhel', label: 'Red Hat Enterprise Linux' },
                                  { value: 'windows', label: 'Windows' },
                                  { value: 'other', label: 'Other' },
                                ]}
                                fullWidth
                              />
                            </FormField.Control>
                          </FormField>

                          {/* OS Version */}
                          <FormField required>
                            <FormField.Label>OS version</FormField.Label>
                            <FormField.Description>
                              This metadata helps categorize image.
                            </FormField.Description>
                            <FormField.Control>
                              <Input
                                value={osVersion}
                                onChange={(e) => setOsVersion(e.target.value)}
                                placeholder="e.g. 22.04, 8, 2019"
                                fullWidth
                              />
                            </FormField.Control>
                          </FormField>

                          {/* OS Admin */}
                          <FormField required>
                            <FormField.Label>OS admin</FormField.Label>
                            <FormField.HelperText>
                              Enter the default administrator account used when launching instances
                              from this image.
                            </FormField.HelperText>
                            <FormField.Control>
                              <Input
                                value={osAdmin}
                                onChange={(e) => setOsAdmin(e.target.value)}
                                placeholder="e.g. ubuntu(ubuntu), administrator(windows)"
                                fullWidth
                              />
                            </FormField.Control>
                          </FormField>

                          {/* Advanced Section */}
                          <Disclosure open={specAdvancedOpen} onChange={setSpecAdvancedOpen}>
                            <DisclosureTrigger>Advanced</DisclosureTrigger>
                            <DisclosurePanel>
                              <VStack gap={4} align="stretch" className="pt-3">
                                {/* Min system Disk */}
                                <div className="flex flex-col gap-2">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Min system disk
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Defines the minimum disk size required to boot an instance from
                                    this image.
                                  </span>
                                  <HStack gap={2} align="center">
                                    <NumberInput
                                      value={minDisk}
                                      onChange={setMinDisk}
                                      min={0}
                                      max={500}
                                      width="sm"
                                    />
                                    <span className="text-body-md text-[var(--color-text-default)]">
                                      GiB
                                    </span>
                                  </HStack>
                                  <span className="text-body-sm text-[var(--color-text-subtle)]">
                                    0-500 GiB
                                  </span>
                                </div>

                                {/* Min RAM */}
                                <div className="flex flex-col gap-2">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Min RAM
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Defines the minimum amount of RAM required to boot an instance
                                    from this image.
                                  </span>
                                  <HStack gap={2} align="center">
                                    <NumberInput
                                      value={minRam}
                                      onChange={setMinRam}
                                      min={0}
                                      max={500}
                                      width="sm"
                                    />
                                    <span className="text-body-md text-[var(--color-text-default)]">
                                      GiB
                                    </span>
                                  </HStack>
                                  <span className="text-body-sm text-[var(--color-text-subtle)]">
                                    0-500 GiB
                                  </span>
                                </div>
                              </VStack>
                            </DisclosurePanel>
                          </Disclosure>

                          <div className="flex items-center justify-end w-full">
                            <Button
                              variant="primary"
                              onClick={() => goToNextSection('specification')}
                              disabled={!diskFormat || !os || !osVersion.trim() || !osAdmin.trim()}
                            >
                              Next
                            </Button>
                          </div>
                        </SectionCard.Content>
                      )}
                      {sectionStatus['specification'] === 'done' && (
                        <SectionCard.Content>
                          <SectionCard.DataRow
                            label="Disk format"
                            value={diskFormat.toUpperCase()}
                            showDivider
                          />
                          <SectionCard.DataRow label="OS" value={os || '-'} showDivider />
                          <SectionCard.DataRow
                            label="OS Version"
                            value={osVersion || '-'}
                            showDivider
                          />
                          <SectionCard.DataRow
                            label="OS Admin"
                            value={osAdmin || '-'}
                            showDivider
                          />
                          <SectionCard.DataRow
                            label="Min system Disk"
                            value={minDisk !== undefined ? `${minDisk} GiB` : '-'}
                            showDivider
                          />
                          <SectionCard.DataRow
                            label="Min RAM"
                            value={minRam !== undefined ? `${minRam} GiB` : '-'}
                            showDivider
                          />
                        </SectionCard.Content>
                      )}
                    </SectionCard>

                    {/* Advanced Section */}
                    <SectionCard isActive={sectionStatus['advanced'] === 'active'}>
                      <SectionCard.Header
                        title={SECTION_LABELS['advanced']}
                        showDivider={sectionStatus['advanced'] === 'active'}
                        actions={
                          sectionStatus['advanced'] === 'done' && (
                            <HStack gap={3} align="center">
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                Auto-filled
                              </span>
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<IconEdit size={12} />}
                                onClick={() => editSection('advanced')}
                              >
                                Edit
                              </Button>
                            </HStack>
                          )
                        }
                      />
                      {sectionStatus['advanced'] === 'active' && (
                        <SectionCard.Content gap={6}>
                          {/* QEMU Guest Agent */}
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                QEMU guest agent
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                Enables communication and status retrieval between the hypervisor
                                and the instance.
                              </span>
                            </div>
                            <HStack gap={2} align="center">
                              <Toggle checked={qemuGuestAgent} onChange={setQemuGuestAgent} />
                              <span className="text-body-md text-[var(--color-text-default)]">
                                {qemuGuestAgent ? 'On' : 'Off'}
                              </span>
                            </HStack>
                          </div>

                          {/* CPU Policy */}
                          <FormField>
                            <FormField.Label>CPU policy</FormField.Label>
                            <FormField.HelperText>
                              Policy that defines how vCPUs are allocated.
                            </FormField.HelperText>
                            <FormField.Control>
                              <Select
                                value={cpuPolicy}
                                onChange={(value) => setCpuPolicy(value)}
                                options={[
                                  { value: 'none', label: 'None' },
                                  { value: 'dedicated', label: 'Dedicated' },
                                  { value: 'shared', label: 'Shared' },
                                ]}
                                fullWidth
                              />
                            </FormField.Control>
                          </FormField>

                          {/* CPU Thread Policy */}
                          <FormField>
                            <FormField.Label>CPU thread policy</FormField.Label>
                            <FormField.HelperText>
                              Policy defining how hyperthreads are used for vCPU placement.
                            </FormField.HelperText>
                            <FormField.Control>
                              <Select
                                value={cpuThreadPolicy}
                                onChange={(value) => setCpuThreadPolicy(value)}
                                options={[
                                  { value: 'none', label: 'None' },
                                  { value: 'prefer', label: 'Prefer' },
                                  { value: 'isolate', label: 'Isolate' },
                                  { value: 'require', label: 'Require' },
                                ]}
                                fullWidth
                              />
                            </FormField.Control>
                          </FormField>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-end gap-2 w-full">
                            <Button
                              variant="secondary"
                              onClick={() => {
                                // Reset to default values
                                setQemuGuestAgent(true);
                                setCpuPolicy('none');
                                setCpuThreadPolicy('none');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              onClick={() => {
                                setSectionStatus((prev) => ({
                                  ...prev,
                                  advanced: 'done',
                                }));
                              }}
                            >
                              Done
                            </Button>
                          </div>
                        </SectionCard.Content>
                      )}
                      {sectionStatus['advanced'] === 'done' && (
                        <SectionCard.Content>
                          <SectionCard.DataRow
                            label="QEMU Guest Agent"
                            value={qemuGuestAgent ? 'On' : 'Off'}
                            showDivider
                          />
                          <SectionCard.DataRow
                            label="CPU Policy"
                            value={
                              cpuPolicy === 'none'
                                ? 'None'
                                : cpuPolicy.charAt(0).toUpperCase() + cpuPolicy.slice(1)
                            }
                            showDivider
                          />
                          <SectionCard.DataRow
                            label="CPU Thread Policy"
                            value={
                              cpuThreadPolicy === 'none'
                                ? 'None'
                                : cpuThreadPolicy.charAt(0).toUpperCase() + cpuThreadPolicy.slice(1)
                            }
                            showDivider
                          />
                        </SectionCard.Content>
                      )}
                    </SectionCard>
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ComputeAdminCreateImagePage;
