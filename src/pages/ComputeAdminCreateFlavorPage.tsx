import { useState, useCallback, useMemo } from 'react';
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
  Disclosure,
  DisclosureTrigger,
  DisclosurePanel,
  RadioGroup,
  Radio,
  SearchInput,
  Table,
  StatusIndicator,
  Pagination,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState, TableColumn } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconEdit,
  IconExternalLink,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'resources' | 'advanced';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  resources: 'Resources',
  advanced: 'Advanced',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = [
  'basic-info',
  'resources',
  'advanced',
];

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
  const [rxtxFactor, setRxtxFactor] = useState<number | undefined>(1);

  // Advanced form state
  const [cpuPolicy, setCpuPolicy] = useState('none');
  const [cpuThreadPolicy, setCpuThreadPolicy] = useState('none');
  const [numaNodes, setNumaNodes] = useState<number | undefined>(undefined);
  const [advancedOpen, setAdvancedOpen] = useState(true);

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    resources: 'pre',
    advanced: 'done',
  });

  // Validation error state
  const [showFlavorNameError, setShowFlavorNameError] = useState(false);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel } = useTabs();

  // Update tab label
  useState(() => {
    updateActiveTabLabel('Create flavor');
  });

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
      rxtxFactor,
      cpuPolicy,
      cpuThreadPolicy,
      numaNodes,
    });
    navigate('/compute-admin/flavors');
  };

  // Filter tenants based on search
  const filteredTenants = useMemo(() => {
    if (!tenantSearch.trim()) return mockTenants;
    const searchLower = tenantSearch.toLowerCase();
    return mockTenants.filter(
      (t) =>
        t.name.toLowerCase().includes(searchLower) ||
        t.id.toLowerCase().includes(searchLower)
    );
  }, [tenantSearch]);

  // Paginated tenants
  const paginatedTenants = useMemo(() => {
    const start = (tenantPage - 1) * tenantsPerPage;
    return filteredTenants.slice(start, start + tenantsPerPage);
  }, [filteredTenants, tenantPage, tenantsPerPage]);

  const totalTenantPages = Math.ceil(filteredTenants.length / tenantsPerPage);

  // Tenant table columns
  const tenantColumns: TableColumn<Tenant>[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        width: '60px',
        align: 'center' as const,
        render: (_value: unknown, row: Tenant) => (
          <StatusIndicator status={row.status === 'active' ? 'active' : 'muted'} />
        ),
      },
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        render: (_value: unknown, row: Tenant) => (
          <div className="flex flex-col gap-0.5">
            <Link
              to={`/compute-admin/tenants/${row.id}`}
              className="text-[12px] font-medium text-[var(--color-link)] hover:underline flex items-center gap-1.5"
            >
              {row.name}
              <IconExternalLink size={12} />
            </Link>
            <span className="text-[11px] text-[var(--color-text-muted)]">
              ID: {row.id}
            </span>
          </div>
        ),
      },
      {
        key: 'description',
        label: 'Description',
        sortable: true,
        render: (_value: unknown, row: Tenant) => (
          <span className="text-[12px] text-[var(--color-text-default)]">
            {row.description}
          </span>
        ),
      },
    ],
    []
  );

  // Section navigation
  const goToNextSection = useCallback((currentSection: SectionStep) => {
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
  }, [flavorName]);

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
                icon={<IconBell size={16} />}
                onClick={() => console.log('Notifications clicked')}
                aria-label="Notifications"
                badge
              />
            }
          />

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
            <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)] min-h-full">
              <VStack gap={3} className="min-w-[1176px]">
                {/* Page Title */}
                <div className="flex items-center justify-between h-8">
                  <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                    Create flavor
                  </h1>
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
                          {/* Flavor name */}
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
                              You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters.
                            </FormField.HelperText>
                          </FormField>

                          {/* Category section */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[14px] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                Category
                              </span>
                              <span className="text-[var(--color-state-danger)]">*</span>
                            </div>
                            <span className="text-[12px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                              Choose the resource category to apply to the flavor.
                            </span>
                            <RadioGroup value={category} onChange={(val) => setCategory(val as 'cpu' | 'gpu' | 'npu' | 'bare-metal')}>
                              <Radio value="cpu" label="CPU" />
                              <Radio value="gpu" label="GPU" />
                              <Radio value="npu" label="NPU" />
                              <Radio value="bare-metal" label="Bare Metal" />
                            </RadioGroup>
                          </div>

                          {/* Public section */}
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[14px] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                  Public
                                </span>
                                <span className="text-[var(--color-state-danger)]">*</span>
                              </div>
                              <span className="text-[12px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                                Indicates whether the flavor is available to other tenants.
                              </span>
                            </div>
                            <HStack gap={2} align="center">
                              <Toggle 
                                checked={isPublic} 
                                onChange={(e) => setIsPublic(e.target.checked)}
                              />
                              <span className="text-[12px] text-[var(--color-text-default)]">
                                {isPublic ? 'On' : 'Off'}
                              </span>
                            </HStack>
                          </div>

                          {/* Tenant section - shown when Public is Off */}
                          {!isPublic && (
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[14px] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                    Tenant
                                  </span>
                                  <span className="text-[var(--color-state-danger)]">*</span>
                                </div>
                                <span className="text-[12px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                                  Select the tenant that can use the flavor.
                                </span>
                              </div>
                              
                              <div className="flex flex-col gap-3">
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
                                <Table
                                  columns={tenantColumns}
                                  data={paginatedTenants}
                                  rowKey="id"
                                  selectable
                                  selectedKeys={Array.isArray(selectedTenants) ? selectedTenants : []}
                                  onSelectionChange={(keys) => setSelectedTenants(Array.isArray(keys) ? keys : [])}
                                />
                                
                                {/* Selection count */}
                                <div className="bg-[var(--color-surface-subtle)] px-2 py-2 rounded-[6px]">
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    {selectedTenants.length === 0
                                      ? 'No item selected'
                                      : `${selectedTenants.length} item${selectedTenants.length > 1 ? 's' : ''} selected`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-end w-full">
                            <Button 
                              variant="primary" 
                              onClick={() => goToNextSection('basic-info')}
                            >
                              Next
                            </Button>
                          </div>
                        </SectionCard.Content>
                      )}
                      {sectionStatus['basic-info'] === 'done' && (
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Flavor name" value={flavorName || '-'} showDivider />
                          <SectionCard.DataRow label="Category" value={category === 'bare-metal' ? 'Bare Metal' : category.toUpperCase()} showDivider />
                          <SectionCard.DataRow label="Public" value={isPublic ? 'On' : 'Off'} showDivider />
                          {!isPublic && (
                            <SectionCard.DataRow 
                              label="Tenants" 
                              value={
                                selectedTenants.length === 0 
                                  ? 'None selected' 
                                  : `${selectedTenants.length} tenant${selectedTenants.length > 1 ? 's' : ''} selected`
                              } 
                              showDivider 
                            />
                          )}
                        </SectionCard.Content>
                      )}
                    </SectionCard>

                    {/* Resources Section */}
                    <SectionCard isActive={sectionStatus['resources'] === 'active'}>
                      <SectionCard.Header 
                        title={SECTION_LABELS['resources']}
                        showDivider={sectionStatus['resources'] === 'active'}
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
                        <SectionCard.Content gap={6}>
                          {/* vCPU */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[14px] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                vCPU
                              </span>
                              <span className="text-[var(--color-state-danger)]">*</span>
                            </div>
                            <span className="text-[12px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                              Number of virtual CPUs for instances using this flavor.
                            </span>
                            <HStack gap={2} align="center">
                              <NumberInput 
                                value={vcpu}
                                onChange={setVcpu}
                                min={1}
                                max={128}
                                className="w-[100px]"
                              />
                              <span className="text-[12px] text-[var(--color-text-default)]">cores</span>
                            </HStack>
                          </div>

                          {/* RAM */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[14px] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                RAM
                              </span>
                              <span className="text-[var(--color-state-danger)]">*</span>
                            </div>
                            <span className="text-[12px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                              Amount of memory for instances using this flavor.
                            </span>
                            <HStack gap={2} align="center">
                              <NumberInput 
                                value={ram}
                                onChange={setRam}
                                min={1}
                                max={1024}
                                className="w-[100px]"
                              />
                              <span className="text-[12px] text-[var(--color-text-default)]">GiB</span>
                            </HStack>
                          </div>

                          {/* Root Disk */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[14px] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                Root disk
                              </span>
                              <span className="text-[var(--color-state-danger)]">*</span>
                            </div>
                            <span className="text-[12px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                              Size of the root disk. Use 0 for no local disk (boot from volume).
                            </span>
                            <HStack gap={2} align="center">
                              <NumberInput 
                                value={rootDisk}
                                onChange={setRootDisk}
                                min={0}
                                max={10000}
                                className="w-[100px]"
                              />
                              <span className="text-[12px] text-[var(--color-text-default)]">GiB</span>
                            </HStack>
                          </div>

                          {/* Ephemeral Disk */}
                          <div className="flex flex-col gap-2">
                            <span className="text-[14px] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                              Ephemeral disk
                            </span>
                            <span className="text-[12px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                              Size of temporary disk. This disk is deleted when the instance is terminated.
                            </span>
                            <HStack gap={2} align="center">
                              <NumberInput 
                                value={ephemeralDisk}
                                onChange={setEphemeralDisk}
                                min={0}
                                max={10000}
                                className="w-[100px]"
                              />
                              <span className="text-[12px] text-[var(--color-text-default)]">GiB</span>
                            </HStack>
                          </div>

                          {/* Swap Disk */}
                          <div className="flex flex-col gap-2">
                            <span className="text-[14px] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                              Swap disk
                            </span>
                            <span className="text-[12px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                              Size of swap space. Use 0 for no swap.
                            </span>
                            <HStack gap={2} align="center">
                              <NumberInput 
                                value={swapDisk}
                                onChange={setSwapDisk}
                                min={0}
                                max={10000}
                                className="w-[100px]"
                              />
                              <span className="text-[12px] text-[var(--color-text-default)]">MiB</span>
                            </HStack>
                          </div>

                          {/* RX/TX Factor */}
                          <div className="flex flex-col gap-2">
                            <span className="text-[14px] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                              RX/TX factor
                            </span>
                            <span className="text-[12px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                              Network bandwidth weight factor.
                            </span>
                            <HStack gap={2} align="center">
                              <NumberInput 
                                value={rxtxFactor}
                                onChange={setRxtxFactor}
                                min={0}
                                max={100}
                                className="w-[100px]"
                              />
                            </HStack>
                          </div>

                          <div className="flex items-center justify-end w-full">
                            <Button 
                              variant="primary" 
                              onClick={() => goToNextSection('resources')}
                            >
                              Next
                            </Button>
                          </div>
                        </SectionCard.Content>
                      )}
                      {sectionStatus['resources'] === 'done' && (
                        <SectionCard.Content>
                          <SectionCard.DataRow label="vCPU" value={`${vcpu ?? 0} cores`} showDivider />
                          <SectionCard.DataRow label="RAM" value={`${ram ?? 0} GiB`} showDivider />
                          <SectionCard.DataRow label="Root disk" value={`${rootDisk ?? 0} GiB`} showDivider />
                          <SectionCard.DataRow label="Ephemeral disk" value={`${ephemeralDisk ?? 0} GiB`} showDivider />
                          <SectionCard.DataRow label="Swap disk" value={`${swapDisk ?? 0} MiB`} showDivider />
                          <SectionCard.DataRow label="RX/TX factor" value={`${rxtxFactor ?? 1}`} showDivider />
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
                              <span className="text-[12px] text-[var(--color-text-subtle)]">Auto-filled</span>
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
                          <Disclosure 
                            open={advancedOpen} 
                            onChange={setAdvancedOpen}
                          >
                            <DisclosureTrigger>CPU & NUMA Settings</DisclosureTrigger>
                            <DisclosurePanel>
                              <VStack gap={4} align="stretch" className="pt-3">
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

                                {/* NUMA Nodes */}
                                <div className="flex flex-col gap-2">
                                  <span className="text-[14px] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                    NUMA nodes
                                  </span>
                                  <span className="text-[12px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                                    Number of NUMA nodes for the flavor. Leave empty for default.
                                  </span>
                                  <HStack gap={2} align="center">
                                    <NumberInput 
                                      value={numaNodes}
                                      onChange={setNumaNodes}
                                      min={1}
                                      max={8}
                                      className="w-[100px]"
                                    />
                                  </HStack>
                                </div>
                              </VStack>
                            </DisclosurePanel>
                          </Disclosure>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-end gap-2 w-full">
                            <Button 
                              variant="secondary" 
                              onClick={() => {
                                // Reset to default values
                                setCpuPolicy('none');
                                setCpuThreadPolicy('none');
                                setNumaNodes(undefined);
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
                            label="CPU Policy" 
                            value={cpuPolicy === 'none' ? 'None' : cpuPolicy.charAt(0).toUpperCase() + cpuPolicy.slice(1)} 
                            showDivider 
                          />
                          <SectionCard.DataRow 
                            label="CPU Thread Policy" 
                            value={cpuThreadPolicy === 'none' ? 'None' : cpuThreadPolicy.charAt(0).toUpperCase() + cpuThreadPolicy.slice(1)} 
                            showDivider 
                          />
                          <SectionCard.DataRow 
                            label="NUMA Nodes" 
                            value={numaNodes !== undefined ? `${numaNodes}` : '-'} 
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

export default ComputeAdminCreateFlavorPage;
