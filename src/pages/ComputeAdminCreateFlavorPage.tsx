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
  SectionCard,
  FormField,
  WizardSummary,
  RadioGroup,
  Radio,
  Toggle,
  SearchInput,
  Pagination,
  StatusIndicator,
  Checkbox,
  PageShell,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconEdit,
  IconExternalLink,
  IconCirclePlus,
  IconCircleMinus,
  IconChevronRight,
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'resources' | 'metadata';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  resources: 'Resources',
  metadata: 'Metadata',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'resources', 'metadata'];

// Tenant type for selection
interface Tenant {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  description: string;
}

// Mock tenants data
const mockTenants: Tenant[] = [
  { id: '12345678', name: 'tenant A', status: 'active', description: '-' },
  { id: '12345679', name: 'tenant B', status: 'active', description: '-' },
  { id: '12345680', name: 'tenant C', status: 'active', description: '-' },
  { id: '12345681', name: 'tenant D', status: 'active', description: '-' },
  { id: '12345682', name: 'tenant E', status: 'inactive', description: '-' },
  { id: '12345683', name: 'tenant F', status: 'active', description: '-' },
  { id: '12345684', name: 'tenant G', status: 'active', description: '-' },
  { id: '12345685', name: 'tenant H', status: 'active', description: '-' },
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

export function ComputeAdminCreateFlavorPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic info form state
  const [flavorName, setFlavorName] = useState('');
  const [category, setCategory] = useState<'cpu' | 'gpu' | 'npu' | 'bare-metal'>('cpu');
  const [isPublic, setIsPublic] = useState(true);

  // Tenant selection state (when isPublic is false)
  const [tenantSearch, setTenantSearch] = useState('');
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [tenantPage, setTenantPage] = useState(1);
  const tenantsPerPage = 5;

  // Resources form state
  const [vcpu, setVcpu] = useState<number | undefined>(1);
  const [ram, setRam] = useState<number | undefined>(1);
  const [rootDisk, setRootDisk] = useState<number | undefined>(0);
  const [ephemeralDisk, setEphemeralDisk] = useState<number | undefined>(0);
  const [swapDisk, setSwapDisk] = useState<number | undefined>(0);

  // Metadata form state
  const [availableMetadataSearch, setAvailableMetadataSearch] = useState('');
  const [existingMetadataSearch, setExistingMetadataSearch] = useState('');
  const [customMetadataKey, setCustomMetadataKey] = useState('');
  const [expandedMetadata, setExpandedMetadata] = useState<Set<string>>(new Set());
  const [selectedMetadata, setSelectedMetadata] = useState<Array<{ key: string; value: string }>>(
    []
  );

  // Available metadata options (mock data)
  const availableMetadataOptions = [
    {
      key: 'cpu_allocation_ratio',
      label: 'CPU Allocation Ratio',
      children: ['1.0', '2.0', '4.0', '8.0', '16.0'],
    },
    { key: 'ram_allocation_ratio', label: 'RAM Allocation Ratio', children: ['1.0', '1.5', '2.0'] },
    { key: 'disk_allocation_ratio', label: 'Disk Allocation Ratio', children: ['1.0', '2.0'] },
    { key: 'hw:cpu_policy', label: 'CPU Policy', children: ['shared', 'dedicated'] },
    {
      key: 'hw:cpu_thread_policy',
      label: 'CPU Thread Policy',
      children: ['prefer', 'isolate', 'require'],
    },
    { key: 'hw:numa_nodes', label: 'NUMA Nodes', children: ['1', '2', '4'] },
    { key: 'hw:mem_page_size', label: 'Memory Page Size', children: ['small', 'large', 'any'] },
    { key: 'quota:disk_read_bytes_sec', label: 'Disk Read Bytes/sec' },
    { key: 'quota:disk_write_bytes_sec', label: 'Disk Write Bytes/sec' },
    { key: 'quota:vif_inbound_average', label: 'VIF Inbound Average' },
  ];

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    resources: 'pre',
    metadata: 'pre',
  });

  // Validation error state
  const [showFlavorNameError, setShowFlavorNameError] = useState(false);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create flavor');
  }, []);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [
    { label: 'Flavors', href: '/compute-admin/flavors' },
    { label: 'Create flavor' },
  ];

  // Navigation handlers
  const handleCancel = () => {
    navigate('/compute-admin/flavors');
  };

  const handleCreate = () => {
    console.log('Creating flavor:', {
      flavorName,
      category,
      isPublic,
      selectedTenants: isPublic ? [] : selectedTenants,
      vcpu,
      ram,
      rootDisk,
      ephemeralDisk,
      swapDisk,
      metadata: selectedMetadata,
    });
    navigate('/compute-admin/flavors');
  };

  // Filter tenants based on search
  const filteredTenants = useMemo(() => {
    if (!tenantSearch.trim()) return mockTenants;
    const searchLower = tenantSearch.toLowerCase();
    return mockTenants.filter(
      (t) => t.name.toLowerCase().includes(searchLower) || t.id.toLowerCase().includes(searchLower)
    );
  }, [tenantSearch]);

  // Paginated tenants
  const paginatedTenants = useMemo(() => {
    const start = (tenantPage - 1) * tenantsPerPage;
    return filteredTenants.slice(start, start + tenantsPerPage);
  }, [filteredTenants, tenantPage]);

  const totalTenantPages = Math.ceil(filteredTenants.length / tenantsPerPage);

  // Handle tenant selection
  const handleTenantSelect = (tenantId: string, checked: boolean) => {
    if (checked) {
      setSelectedTenants((prev) => [...prev, tenantId]);
    } else {
      setSelectedTenants((prev) => prev.filter((id) => id !== tenantId));
    }
  };

  const handleSelectAllTenants = (checked: boolean) => {
    if (checked) {
      const allIds = paginatedTenants.map((t) => t.id);
      setSelectedTenants((prev) => [...new Set([...prev, ...allIds])]);
    } else {
      const pageIds = new Set(paginatedTenants.map((t) => t.id));
      setSelectedTenants((prev) => prev.filter((id) => !pageIds.has(id)));
    }
  };

  const allPageTenantsSelected =
    paginatedTenants.length > 0 && paginatedTenants.every((t) => selectedTenants.includes(t.id));

  // Section navigation
  const goToNextSection = useCallback(
    (currentSection: SectionStep) => {
      // Validate basic-info section
      if (currentSection === 'basic-info') {
        if (!flavorName.trim()) {
          setShowFlavorNameError(true);
          return;
        }
        setShowFlavorNameError(false);
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
    [flavorName]
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
  const isCreateDisabled = !flavorName.trim() || sectionStatus['basic-info'] === 'active';

  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <PageShell
      sidebar={
        <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
        />
      }
      topBar={
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
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3} className="min-w-[1176px]">
        {/* Page Title */}
        <div className="flex items-center justify-between h-8">
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create flavor</h1>
        </div>

        {/* Content Area */}
        <HStack gap={6} align="start" className="w-full">
          {/* Left Column - Main Content */}
          <VStack gap={4} className="flex-1">
            {/* Basic information Section */}
            <SectionCard isActive={sectionStatus['basic-info'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['basic-info']}
                showDivider={sectionStatus['basic-info'] === 'done'}
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
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Flavor name */}
                    <div className="py-6">
                      <FormField required error={showFlavorNameError}>
                        <FormField.Label>Flavor name</FormField.Label>
                        <FormField.Control>
                          <Input
                            value={flavorName}
                            onChange={(e) => {
                              setFlavorName(e.target.value);
                              if (e.target.value.trim()) {
                                setShowFlavorNameError(false);
                              }
                            }}
                            placeholder="Enter flavor name"
                            fullWidth
                            error={showFlavorNameError}
                          />
                        </FormField.Control>
                        {showFlavorNameError && (
                          <FormField.ErrorMessage>
                            Please enter a flavor name.
                          </FormField.ErrorMessage>
                        )}
                        <FormField.HelperText>
                          You can use letters, numbers, and special characters (+=,.@-_), and the
                          length must be between 2-128 characters.
                        </FormField.HelperText>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Category section */}
                    <VStack gap={3} className="py-6">
                      <VStack gap={3}>
                        <div className="flex items-center gap-1.5">
                          <span className="text-label-lg leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                            Category
                          </span>
                          <span className="text-[var(--color-state-danger)]">*</span>
                        </div>
                        <span className="text-body-md leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                          Choose the resource category to apply to the flavor.
                        </span>
                      </VStack>
                      <RadioGroup
                        value={category}
                        onChange={(val) => setCategory(val as 'cpu' | 'gpu' | 'npu' | 'bare-metal')}
                      >
                        <Radio value="cpu" label="CPU" />
                        <Radio value="gpu" label="GPU" />
                        <Radio value="npu" label="NPU" />
                        <Radio value="bare-metal" label="Bare metal" />
                      </RadioGroup>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Public section */}
                    <VStack gap={3} className="py-6">
                      <VStack gap={2}>
                        <div className="flex items-center gap-1.5">
                          <span className="text-label-lg leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                            Public
                          </span>
                          <span className="text-[var(--color-state-danger)]">*</span>
                        </div>
                        <span className="text-body-md leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                          Indicates whether the flavor is available to other tenants.
                        </span>
                      </VStack>
                      <Toggle
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        label={isPublic ? 'On' : 'Off'}
                      />
                    </VStack>

                    {/* Tenant section - shown when Public is Off */}
                    {!isPublic && (
                      <>
                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                        <VStack gap={3} className="py-6">
                          <VStack gap={2}>
                            <div className="flex items-center gap-1.5">
                              <span className="text-label-lg leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                Tenant
                              </span>
                              <span className="text-[var(--color-state-danger)]">*</span>
                            </div>
                            <span className="text-body-md leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                              Select the tenant that can use the flavor.
                            </span>
                          </VStack>

                          {/* Search */}
                          <SearchInput
                            value={tenantSearch}
                            onChange={setTenantSearch}
                            placeholder="Search tenants by attributes"
                            className="w-[280px]"
                          />

                          {/* Pagination */}
                          <Pagination
                            currentPage={tenantPage}
                            totalPages={totalTenantPages}
                            onPageChange={setTenantPage}
                            totalItems={filteredTenants.length}
                            showItemCount
                          />

                          {/* Tenant Table */}
                          <VStack gap={2}>
                            <div className="flex flex-col gap-1 w-full">
                              {/* Table Header */}
                              <div className="flex items-center bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md">
                                <div className="flex items-center justify-center p-3 w-[48px]">
                                  <Checkbox
                                    checked={allPageTenantsSelected}
                                    onChange={(e) => handleSelectAllTenants(e.target.checked)}
                                  />
                                </div>
                                <div className="flex items-center justify-center p-3 w-[60px] border-l border-[var(--color-border-default)]">
                                  <span className="text-label-sm text-[var(--color-text-default)]">
                                    Status
                                  </span>
                                </div>
                                <div className="flex-1 p-3 border-l border-[var(--color-border-default)]">
                                  <span className="text-label-sm text-[var(--color-text-default)]">
                                    Name
                                  </span>
                                </div>
                                <div className="flex-1 p-3 border-l border-[var(--color-border-default)]">
                                  <span className="text-label-sm text-[var(--color-text-default)]">
                                    Description
                                  </span>
                                </div>
                              </div>

                              {/* Table Rows */}
                              {paginatedTenants.map((tenant) => (
                                <div
                                  key={tenant.id}
                                  className="flex items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md"
                                >
                                  <div className="flex items-center justify-center p-3 w-[48px]">
                                    <Checkbox
                                      checked={selectedTenants.includes(tenant.id)}
                                      onChange={(e) =>
                                        handleTenantSelect(tenant.id, e.target.checked)
                                      }
                                    />
                                  </div>
                                  <div className="flex items-center justify-center p-2 w-[60px]">
                                    <StatusIndicator
                                      status={tenant.status === 'active' ? 'active' : 'muted'}
                                    />
                                  </div>
                                  <div className="flex-1 flex flex-col gap-0.5 p-3">
                                    <Link
                                      to={`/compute-admin/tenants/${tenant.id}`}
                                      className="text-label-md text-[var(--color-link)] hover:underline flex items-center gap-1.5"
                                    >
                                      {tenant.name}
                                      <IconExternalLink size={12} />
                                    </Link>
                                    <span className="text-body-sm text-[var(--color-text-muted)]">
                                      ID: {tenant.id}
                                    </span>
                                  </div>
                                  <div className="flex-1 p-3">
                                    <span className="text-body-md text-[var(--color-text-default)]">
                                      {tenant.description}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Selection count */}
                            <div className="bg-[var(--color-surface-subtle)] px-2 py-2 rounded-md w-full">
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                {selectedTenants.length === 0
                                  ? 'No item selected'
                                  : `${selectedTenants.length} item${selectedTenants.length > 1 ? 's' : ''} selected`}
                              </span>
                            </div>
                          </VStack>
                        </VStack>
                      </>
                    )}

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    <HStack justify="end" className="pt-3">
                      <Button variant="primary" onClick={() => goToNextSection('basic-info')}>
                        Next
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {sectionStatus['basic-info'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow label="Flavor name" value={flavorName || '-'} />
                  <SectionCard.DataRow
                    label="Category"
                    value={category === 'bare-metal' ? 'Bare Metal' : category.toUpperCase()}
                  />
                  <SectionCard.DataRow label="Public" value={isPublic ? 'On' : 'Off'} />
                  {!isPublic && (
                    <SectionCard.DataRow
                      label="Tenants"
                      value={
                        selectedTenants.length === 0
                          ? 'None selected'
                          : `${selectedTenants.length} tenant${selectedTenants.length > 1 ? 's' : ''} selected`
                      }
                    />
                  )}
                </SectionCard.Content>
              )}
            </SectionCard>

            {/* Resources Section */}
            <SectionCard isActive={sectionStatus['resources'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['resources']}
                showDivider={sectionStatus['resources'] === 'done'}
                actions={
                  sectionStatus['resources'] === 'done' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconEdit size={12} />}
                      onClick={() => editSection('resources')}
                    >
                      Edit
                    </Button>
                  )
                }
              />
              {sectionStatus['resources'] === 'active' && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* vCPU */}
                    <VStack gap={2} className="py-6">
                      <div className="flex items-center gap-1.5">
                        <span className="text-label-lg leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                          vCPU
                        </span>
                        <span className="text-[var(--color-state-danger)]">*</span>
                      </div>
                      <span className="text-body-md leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                        Number of virtual CPUs for instances using this flavor.
                      </span>
                      <HStack gap={2} align="center">
                        <NumberInput value={vcpu} onChange={setVcpu} min={1} max={128} width="sm" />
                        <span className="text-body-md text-[var(--color-text-default)]">cores</span>
                      </HStack>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* RAM */}
                    <VStack gap={2} className="py-6">
                      <div className="flex items-center gap-1.5">
                        <span className="text-label-lg leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                          RAM
                        </span>
                        <span className="text-[var(--color-state-danger)]">*</span>
                      </div>
                      <span className="text-body-md leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                        Amount of memory for instances using this flavor.
                      </span>
                      <HStack gap={2} align="center">
                        <NumberInput value={ram} onChange={setRam} min={1} max={1024} width="sm" />
                        <span className="text-body-md text-[var(--color-text-default)]">GiB</span>
                      </HStack>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Root Disk */}
                    <VStack gap={2} className="py-6">
                      <div className="flex items-center gap-1.5">
                        <span className="text-label-lg leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                          Root disk
                        </span>
                        <span className="text-[var(--color-state-danger)]">*</span>
                      </div>
                      <span className="text-body-md leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                        Size of the root disk. Use 0 for no local disk (boot from volume).
                      </span>
                      <HStack gap={2} align="center">
                        <NumberInput
                          value={rootDisk}
                          onChange={setRootDisk}
                          min={0}
                          max={10000}
                          width="sm"
                        />
                        <span className="text-body-md text-[var(--color-text-default)]">GiB</span>
                      </HStack>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Ephemeral Disk */}
                    <VStack gap={2} className="py-6">
                      <span className="text-label-lg leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                        Ephemeral disk
                      </span>
                      <span className="text-body-md leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                        Size of temporary disk. This disk is deleted when the instance is
                        terminated.
                      </span>
                      <HStack gap={2} align="center">
                        <NumberInput
                          value={ephemeralDisk}
                          onChange={setEphemeralDisk}
                          min={0}
                          max={10000}
                          width="sm"
                        />
                        <span className="text-body-md text-[var(--color-text-default)]">GiB</span>
                      </HStack>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Swap Disk */}
                    <VStack gap={2} className="py-6">
                      <span className="text-label-lg leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                        Swap disk
                      </span>
                      <span className="text-body-md leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                        Size of swap space. Use 0 for no swap.
                      </span>
                      <HStack gap={2} align="center">
                        <NumberInput
                          value={swapDisk}
                          onChange={setSwapDisk}
                          min={0}
                          max={10000}
                          width="sm"
                        />
                        <span className="text-body-md text-[var(--color-text-default)]">MiB</span>
                      </HStack>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    <HStack justify="end" className="pt-3">
                      <Button variant="primary" onClick={() => goToNextSection('resources')}>
                        Next
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {sectionStatus['resources'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow label="vCPU" value={`${vcpu ?? 0} cores`} />
                  <SectionCard.DataRow label="RAM" value={`${ram ?? 0} GiB`} />
                  <SectionCard.DataRow label="Root disk" value={`${rootDisk ?? 0} GiB`} />
                  <SectionCard.DataRow label="Ephemeral disk" value={`${ephemeralDisk ?? 0} GiB`} />
                  <SectionCard.DataRow label="Swap disk" value={`${swapDisk ?? 0} MiB`} />
                </SectionCard.Content>
              )}
            </SectionCard>

            {/* Metadata Section */}
            <SectionCard isActive={sectionStatus['metadata'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['metadata']}
                showDivider={sectionStatus['metadata'] === 'done'}
                actions={
                  sectionStatus['metadata'] === 'done' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconEdit size={12} />}
                      onClick={() => editSection('metadata')}
                    >
                      Edit
                    </Button>
                  )
                }
              />
              {sectionStatus['metadata'] === 'active' && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Metadata */}
                    <VStack gap={3} className="py-6">
                      <VStack gap={2}>
                        <div className="flex items-center gap-1.5">
                          <span className="text-label-lg leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                            Metadata
                          </span>
                          <span className="text-[var(--color-state-danger)]">*</span>
                        </div>
                        <span className="text-body-md leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                          Select existing metadata or define new metadata to apply to the host
                          aggregate.
                        </span>
                      </VStack>

                      {/* Two Column Layout */}
                      <div className="flex gap-6">
                        {/* Left Column - Available Metadata */}
                        <div className="flex-1 flex flex-col gap-2 bg-[var(--color-surface-subtle)] rounded-md p-2">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Available metadata
                          </span>

                          {/* Search */}
                          <SearchInput
                            value={availableMetadataSearch}
                            onChange={setAvailableMetadataSearch}
                            placeholder="Search metadata"
                            className="w-full"
                          />

                          {/* Custom metadata input row */}
                          <div className="flex items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md">
                            <div className="flex-1 px-3 py-2">
                              <Input
                                value={customMetadataKey}
                                onChange={(e) => setCustomMetadataKey(e.target.value)}
                                placeholder="Enter custom metadata key"
                                fullWidth
                              />
                            </div>
                            <div className="px-3 py-2">
                              <button
                                onClick={() => {
                                  if (customMetadataKey.trim()) {
                                    setSelectedMetadata((prev) => [
                                      ...prev,
                                      { key: customMetadataKey.trim(), value: '' },
                                    ]);
                                    setCustomMetadataKey('');
                                  }
                                }}
                                className="flex items-center justify-center w-7 h-7 rounded-md border border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)]"
                              >
                                <IconCirclePlus
                                  size={16}
                                  stroke={1.5}
                                  className="text-[var(--color-text-muted)]"
                                />
                              </button>
                            </div>
                          </div>

                          {/* Metadata List */}
                          <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
                            {availableMetadataOptions
                              .filter(
                                (item) =>
                                  !availableMetadataSearch ||
                                  item.label
                                    .toLowerCase()
                                    .includes(availableMetadataSearch.toLowerCase()) ||
                                  item.key
                                    .toLowerCase()
                                    .includes(availableMetadataSearch.toLowerCase())
                              )
                              .map((item, index, arr) => (
                                <div key={item.key} className="flex flex-col">
                                  {/* Parent row */}
                                  <div
                                    className={`
                                              flex items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)]
                                              ${expandedMetadata.has(item.key) && item.children ? 'rounded-t-md border-b-0' : 'rounded-md'}
                                            `}
                                  >
                                    <div className="flex-1 flex items-center gap-2 px-3 py-2 min-h-[40px]">
                                      <button
                                        onClick={() => {
                                          if (item.children) {
                                            setExpandedMetadata((prev) => {
                                              const newSet = new Set(prev);
                                              if (newSet.has(item.key)) {
                                                newSet.delete(item.key);
                                              } else {
                                                newSet.add(item.key);
                                              }
                                              return newSet;
                                            });
                                          }
                                        }}
                                        className="p-0.5"
                                      >
                                        {expandedMetadata.has(item.key) ? (
                                          <IconChevronDown
                                            size={16}
                                            className="text-[var(--color-text-default)]"
                                          />
                                        ) : (
                                          <IconChevronRight
                                            size={16}
                                            className="text-[var(--color-text-default)]"
                                          />
                                        )}
                                      </button>
                                      <span className="text-label-md text-[var(--color-text-default)]">
                                        {item.label}
                                      </span>
                                    </div>
                                    <div className="px-3 py-2">
                                      <button
                                        onClick={() => {
                                          if (!selectedMetadata.some((m) => m.key === item.key)) {
                                            setSelectedMetadata((prev) => [
                                              ...prev,
                                              { key: item.key, value: '' },
                                            ]);
                                          }
                                        }}
                                        className="flex items-center justify-center w-7 h-7 rounded-md border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-subtle)]"
                                      >
                                        <IconCirclePlus
                                          size={16}
                                          stroke={1.5}
                                          className="text-[var(--color-text-default)]"
                                        />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Child rows when expanded */}
                                  {item.children && expandedMetadata.has(item.key) && (
                                    <div className="flex flex-col">
                                      {item.children.map((child, childIndex) => (
                                        <div
                                          key={child}
                                          className={`
                                                    flex items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)] border-t-0
                                                    ${childIndex === item.children!.length - 1 ? 'rounded-b-md' : ''}
                                                  `}
                                        >
                                          <div className="flex-1 flex items-center gap-2 px-3 py-2 pl-10 min-h-[40px]">
                                            <span className="text-label-md text-[var(--color-text-default)]">
                                              {child}
                                            </span>
                                          </div>
                                          <div className="px-3 py-2">
                                            <button
                                              onClick={() => {
                                                setSelectedMetadata((prev) => {
                                                  const existing = prev.find(
                                                    (m) => m.key === item.key
                                                  );
                                                  if (existing) {
                                                    return prev.map((m) =>
                                                      m.key === item.key
                                                        ? { ...m, value: child }
                                                        : m
                                                    );
                                                  }
                                                  return [...prev, { key: item.key, value: child }];
                                                });
                                              }}
                                              className="flex items-center justify-center w-7 h-7 rounded-md border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-subtle)]"
                                            >
                                              <IconCirclePlus
                                                size={16}
                                                stroke={1.5}
                                                className="text-[var(--color-text-default)]"
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Right Column - Existing Metadata */}
                        <div className="flex-1 flex flex-col gap-2 bg-[var(--color-surface-subtle)] rounded-md p-2">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Existing metadata
                          </span>

                          {/* Search */}
                          <SearchInput
                            value={existingMetadataSearch}
                            onChange={setExistingMetadataSearch}
                            placeholder="Search metadata"
                            className="w-full"
                          />

                          {/* Selected Metadata List */}
                          <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
                            {selectedMetadata
                              .filter(
                                (item) =>
                                  !existingMetadataSearch ||
                                  item.key
                                    .toLowerCase()
                                    .includes(existingMetadataSearch.toLowerCase())
                              )
                              .map((item, index) => (
                                <div
                                  key={`${item.key}-${index}`}
                                  className="flex items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md"
                                >
                                  <div className="flex-1 flex items-center gap-2 px-3 py-2 min-h-[40px]">
                                    <span className="text-label-md text-[var(--color-text-default)] shrink-0">
                                      {item.key}
                                    </span>
                                    <div className="w-px h-4 bg-[var(--color-border-default)]" />
                                    <Input
                                      value={item.value}
                                      onChange={(e) => {
                                        setSelectedMetadata((prev) =>
                                          prev.map((m, i) =>
                                            i === index ? { ...m, value: e.target.value } : m
                                          )
                                        );
                                      }}
                                      placeholder="Enter value"
                                      fullWidth
                                    />
                                  </div>
                                  <div className="px-3 py-2">
                                    <button
                                      onClick={() => {
                                        setSelectedMetadata((prev) =>
                                          prev.filter((_, i) => i !== index)
                                        );
                                      }}
                                      className="flex items-center justify-center w-7 h-7 rounded-md border border-[var(--color-border-strong)] hover:bg-red-50"
                                    >
                                      <IconCircleMinus
                                        size={16}
                                        stroke={1.5}
                                        className="text-[var(--color-text-default)]"
                                      />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            {selectedMetadata.length === 0 && (
                              <div className="flex items-center justify-center py-8">
                                <span className="text-body-md text-[var(--color-text-muted)]">
                                  No metadata selected
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Action Buttons */}
                    <HStack justify="end" gap={2} className="pt-3">
                      <Button variant="secondary" onClick={() => goToNextSection('metadata')}>
                        Skip
                      </Button>
                      <Button variant="primary" onClick={() => goToNextSection('metadata')}>
                        Next
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {sectionStatus['metadata'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Metadata count"
                    value={`${selectedMetadata.length} item${selectedMetadata.length !== 1 ? 's' : ''}`}
                  />
                  {selectedMetadata.slice(0, 3).map((item, index) => (
                    <SectionCard.DataRow key={index} label={item.key} value={item.value || '-'} />
                  ))}
                  {selectedMetadata.length > 3 && (
                    <span className="text-body-md text-[var(--color-text-muted)]">
                      +{selectedMetadata.length - 3} more items
                    </span>
                  )}
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
    </PageShell>
  );
}

export default ComputeAdminCreateFlavorPage;
