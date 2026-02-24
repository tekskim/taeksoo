import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  VStack,
  HStack,
  TabBar,
  TopBar,
  TopBarAction,
  Input,
  Select,
  SectionCard,
  FormField,
  WizardSummary,
  ProgressBar,
  STATUS_THRESHOLDS,
  Tabs,
  TabList,
  Tab,
  Table,
  SearchInput,
  Pagination,
  StatusIndicator,
  RadioGroup,
  Radio,
  Toggle,
  Checkbox,
  SelectionIndicator,
  PageShell,
  fixedColumns,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState, TableColumn } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useIsV2 } from '@/hooks/useIsV2';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { IconBell, IconEdit, IconExternalLink, IconCirclePlus, IconX } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'network' | 'security';

// Network table row type
interface NetworkRow {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'muted';
  external: string;
  shared: string;
  subnetCidr: string;
}

// Mock network data
const mockNetworks: NetworkRow[] = [
  {
    id: '29tgj234',
    name: 'net-01',
    status: 'active',
    external: 'Yes',
    shared: 'On',
    subnetCidr: '10.0.0.0/24',
  },
  {
    id: '38rhk345',
    name: 'net-02',
    status: 'active',
    external: 'Yes',
    shared: 'On',
    subnetCidr: '10.0.0.0/24',
  },
  {
    id: '47sil456',
    name: 'net-03',
    status: 'active',
    external: 'Yes',
    shared: 'On',
    subnetCidr: '10.0.0.0/24',
  },
  {
    id: '56tjm567',
    name: 'net-04',
    status: 'active',
    external: 'Yes',
    shared: 'On',
    subnetCidr: '10.0.0.0/24',
  },
  {
    id: '65ukn678',
    name: 'net-05',
    status: 'active',
    external: 'Yes',
    shared: 'On',
    subnetCidr: '10.0.0.0/24',
  },
];

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  network: 'Network',
  security: 'Security',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'network', 'security'];

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

        {/* Quota Card */}
        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            <h5 className="text-heading-h5 text-[var(--color-text-default)]">Quota</h5>
            <VStack gap={3}>
              <ProgressBar
                variant="quota"
                label="Port"
                value={5}
                max={20}
                showValue
                thresholds={STATUS_THRESHOLDS.compute}
              />
            </VStack>
          </VStack>
        </div>

        {/* Action Buttons */}
        <HStack gap={2}>
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
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export default function CreateVirtualAdapterPage() {
  const navigate = useNavigate();
  const isV2 = useIsV2();
  const { tabs, activeTabId, addTab, closeTab, selectTab } = useTabs();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Section status state
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    network: isV2 ? 'active' : 'pre',
    security: isV2 ? 'active' : 'pre',
  });

  // Form state - Basic Info
  const [adapterName, setAdapterName] = useState('');
  const [description, setDescription] = useState('');

  // Validation errors
  const [adapterNameError, setAdapterNameError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Form state - Network
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [networkTab, setNetworkTab] = useState<'current' | 'shared' | 'external'>('current');
  const [networkSearch, setNetworkSearch] = useState('');
  const [networkPage, setNetworkPage] = useState(1);
  const [macAddressMode, setMacAddressMode] = useState<'auto' | 'manual'>(isV2 ? 'manual' : 'auto');
  const [manualMacAddress, setManualMacAddress] = useState('');

  // Fixed IP entries
  interface FixedIPEntry {
    id: string;
    subnet: string;
    ipMode: 'auto' | 'manual';
    ipAddress: string;
  }
  const [fixedIPs, setFixedIPs] = useState<FixedIPEntry[]>(
    isV2 ? [{ id: 'default-1', subnet: '', ipMode: 'auto', ipAddress: '' }] : []
  );

  const addFixedIP = () => {
    if (!selectedNetwork) return;
    const network = mockNetworks.find((n) => n.id === selectedNetwork);
    setFixedIPs((prev) => [
      ...prev,
      {
        id: `fixed-ip-${Date.now()}`,
        subnet: network?.subnetCidr || '',
        ipMode: 'auto',
        ipAddress: '',
      },
    ]);
  };

  const removeFixedIP = (id: string) => {
    setFixedIPs((prev) => prev.filter((ip) => ip.id !== id));
  };

  const updateFixedIP = (id: string, updates: Partial<FixedIPEntry>) => {
    setFixedIPs((prev) => prev.map((ip) => (ip.id === id ? { ...ip, ...updates } : ip)));
  };

  // Form state - Security
  const [portSecurityEnabled, setPortSecurityEnabled] = useState(isV2 ? true : false);
  const [securityGroupSearch, setSecurityGroupSearch] = useState('');
  const [securityGroupPage, setSecurityGroupPage] = useState(1);
  const [selectedSecurityGroups, setSelectedSecurityGroups] = useState<string[]>([]);

  // Mock security groups data
  const mockSecurityGroups = [
    {
      id: 'sg-01',
      name: 'default-sg',
      description: '-',
      createdAt: 'Aug 23, 2025',
      subtitle: 'internal-02',
    },
    {
      id: 'sg-02',
      name: 'web-sg',
      description: 'Web server security group',
      createdAt: 'Aug 22, 2025',
      subtitle: 'web-tier',
    },
    {
      id: 'sg-03',
      name: 'db-sg',
      description: 'Database security group',
      createdAt: 'Aug 21, 2025',
      subtitle: 'db-tier',
    },
    {
      id: 'sg-04',
      name: 'app-sg',
      description: 'Application security group',
      createdAt: 'Aug 20, 2025',
      subtitle: 'app-tier',
    },
    {
      id: 'sg-05',
      name: 'internal-sg',
      description: '-',
      createdAt: 'Aug 19, 2025',
      subtitle: 'internal-01',
    },
  ];

  // Security group table interface
  interface SecurityGroupRow {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    subtitle: string;
  }

  // Network table columns
  const networkColumns: TableColumn<NetworkRow>[] = useMemo(
    () => [
      {
        key: 'select',
        label: '',
        width: fixedColumns.select,
        render: (_value, row) => (
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Radio
              value={row.id}
              checked={selectedNetwork === row.id}
              onChange={() => {
                setSelectedNetwork(row.id);
                setNetworkError(null);
              }}
            />
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        width: fixedColumns.status,
        align: 'center' as const,
        render: (_value, row) => <StatusIndicator status={row.status} />,
      },
      {
        key: 'name',
        label: 'Name',
        flex: 1,
        sortable: true,
        render: (_value, row) => (
          <VStack gap={0.5} align="start">
            <HStack gap={1.5} align="center">
              <span className="text-[var(--color-action-primary)] text-label-md">{row.name}</span>
              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            </HStack>
            <span className="text-body-sm text-[var(--color-text-subtle)]">ID: {row.id}</span>
          </VStack>
        ),
      },
      {
        key: 'external',
        label: 'External',
        flex: 1,
      },
      {
        key: 'shared',
        label: 'Shared',
        flex: 1,
      },
      {
        key: 'subnetCidr',
        label: 'Subnet CIDR',
        flex: 1,
      },
    ],
    [selectedNetwork]
  );

  // Get selected network details for summary
  const selectedNetworkDetails = useMemo(() => {
    return mockNetworks.find((n) => n.id === selectedNetwork);
  }, [selectedNetwork]);

  // Security group table columns
  const securityGroupColumns: TableColumn<SecurityGroupRow>[] = useMemo(
    () => [
      {
        key: 'select',
        label: '',
        width: fixedColumns.select,
        headerRender: () => {
          const visibleIds = mockSecurityGroups.map((row) => row.id);
          const allSelected =
            visibleIds.length > 0 && visibleIds.every((id) => selectedSecurityGroups.includes(id));
          const someSelected = visibleIds.some((id) => selectedSecurityGroups.includes(id));
          return (
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={() => {
                if (allSelected) {
                  setSelectedSecurityGroups((prev) =>
                    prev.filter((id) => !visibleIds.includes(id))
                  );
                } else {
                  setSelectedSecurityGroups((prev) => [...new Set([...prev, ...visibleIds])]);
                }
              }}
              aria-label="Select all"
            />
          );
        },
        render: (_value, row) => (
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={selectedSecurityGroups.includes(row.id)}
              onChange={() => {
                setSelectedSecurityGroups((prev) =>
                  prev.includes(row.id) ? prev.filter((id) => id !== row.id) : [...prev, row.id]
                );
              }}
            />
          </div>
        ),
      },
      {
        key: 'name',
        label: 'Name',
        flex: 1,
        render: (_value, row) => (
          <VStack gap={0.5} align="start">
            <HStack gap={1.5} align="center">
              <span className="text-[var(--color-action-primary)] text-label-md">{row.name}</span>
              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            </HStack>
            <span className="text-body-sm text-[var(--color-text-subtle)]">{row.subtitle}</span>
          </VStack>
        ),
      },
      {
        key: 'description',
        label: 'Description',
        flex: 1,
        sortable: true,
      },
      {
        key: 'createdAt',
        label: 'Created at',
        flex: 1,
        sortable: true,
      },
    ],
    [selectedSecurityGroups]
  );

  // Computed states
  const isCreateDisabled = !adapterName.trim() || (!isV2 && sectionStatus['security'] !== 'done');

  // Helper function to edit a section
  const editSection = (section: SectionStep) => {
    if (isV2) return;
    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      // Set the clicked section to active
      newStatus[section] = 'active';
      // Set all sections after this one to pre (waiting)
      const sectionIndex = SECTION_ORDER.indexOf(section);
      for (let i = sectionIndex + 1; i < SECTION_ORDER.length; i++) {
        newStatus[SECTION_ORDER[i]] = 'pre';
      }
      return newStatus;
    });
  };

  // Helper function to get next section
  const getNextSection = (currentSection: SectionStep): SectionStep | null => {
    const currentIndex = SECTION_ORDER.indexOf(currentSection);
    if (currentIndex < SECTION_ORDER.length - 1) {
      return SECTION_ORDER[currentIndex + 1];
    }
    return null;
  };

  // Tab Bar data
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Handlers
  const handleCancel = () => {
    navigate('/compute/ports');
  };

  const handleCreate = () => {
    console.log('Creating virtual adapter:', {
      adapterName,
      description,
      networkId: selectedNetwork,
      networkName: selectedNetworkDetails?.name,
      macAddressMode,
      macAddress: macAddressMode === 'manual' ? manualMacAddress : 'auto',
      fixedIPs,
      portSecurityEnabled,
      selectedSecurityGroups,
    });
    navigate('/compute/ports');
  };

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          showAddButton={true}
          showWindowControls={true}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={openSidebar}
          showNavigation={true}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Proj-1', href: '/compute' },
                { label: 'Ports', href: '/compute/ports' },
                { label: 'Create virtual adapter' },
              ]}
            />
          }
          actions={
            <>
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                onClick={() => {}}
                aria-label="Notifications"
              />
            </>
          }
        />
      }
      contentClassName="pt-3 px-8 pb-20"
    >
      <VStack gap={3} className="min-w-[1176px]">
        {/* Page Title */}
        <div className="flex items-center justify-between h-8">
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">
            Create virtual adapter
          </h1>
        </div>

        {/* Content Area */}
        <HStack gap={6} align="start" className="w-full">
          {/* Left Column - Form Sections */}
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
                    {/* Virtual adapter Name */}
                    <div className="py-6">
                      <FormField required error={!!adapterNameError}>
                        <FormField.Label>Virtual adapter Name</FormField.Label>
                        <FormField.Control>
                          <VStack gap={1}>
                            <Input
                              placeholder="Enter name"
                              value={adapterName}
                              onChange={(e) => {
                                setAdapterName(e.target.value);
                                setAdapterNameError(null);
                              }}
                              fullWidth
                            />
                          </VStack>
                        </FormField.Control>
                        <FormField.HelperText>
                          You can use letters, numbers, and special characters (+=,.@-_), and the
                          length must be between 2-128 characters.
                        </FormField.HelperText>
                        {adapterNameError && (
                          <FormField.ErrorMessage>{adapterNameError}</FormField.ErrorMessage>
                        )}
                      </FormField>
                    </div>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    {/* Description */}
                    <div className="py-6">
                      <FormField>
                        <FormField.Label>Description</FormField.Label>
                        <FormField.Control>
                          <Input
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                          />
                        </FormField.Control>
                        <FormField.HelperText>
                          You can use letters, numbers, and special characters (+=,.@-_()[]), and
                          maximum 255 characters.
                        </FormField.HelperText>
                      </FormField>
                    </div>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <HStack justify="end" className="pt-3">
                      <Button
                        variant="primary"
                        onClick={() => {
                          if (!adapterName.trim()) {
                            setAdapterNameError('Please enter a virtual adapter name.');
                            return;
                          }
                          setAdapterNameError(null);
                          setSectionStatus((prev) => ({
                            ...prev,
                            'basic-info': 'done',
                            network: 'active',
                          }));
                        }}
                      >
                        Next
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {!isV2 && sectionStatus['basic-info'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow label="Virtual adapter Name" value={adapterName} />
                  {description && <SectionCard.DataRow label="Description" value={description} />}
                </SectionCard.Content>
              )}
            </SectionCard>
            {isV2 && (
              <SectionCard>
                <SectionCard.Header title={SECTION_LABELS['basic-info']} />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Virtual adapter Name" value={adapterName || '-'} />
                  <SectionCard.DataRow label="Description" value={description || '-'} />
                </SectionCard.Content>
              </SectionCard>
            )}

            {/* Network Section */}
            <SectionCard isActive={!isV2 && sectionStatus['network'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['network']}
                showDivider={sectionStatus['network'] === 'done'}
                actions={
                  !isV2 &&
                  sectionStatus['network'] === 'done' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconEdit size={12} />}
                      onClick={() => editSection('network')}
                    >
                      Edit
                    </Button>
                  )
                }
              />
              {(isV2 || sectionStatus['network'] === 'active') && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    {/* Owned network - Network Table */}
                    <div className="py-6">
                      <VStack gap={4} align="stretch">
                        <FormField required>
                          <FormField.Label>Owned network</FormField.Label>
                          <FormField.Description>
                            Select the network to which the virtual adaptor will be attached.
                          </FormField.Description>
                        </FormField>

                        {/* Network Tabs */}
                        <Tabs
                          value={networkTab}
                          onChange={(value) =>
                            setNetworkTab(value as 'current' | 'shared' | 'external')
                          }
                          variant="underline"
                        >
                          <TabList>
                            <Tab value="current">Current tenant</Tab>
                            <Tab value="shared">Shared</Tab>
                            <Tab value="external">External</Tab>
                          </TabList>
                        </Tabs>

                        {/* Network Table Body */}
                        <VStack gap={2} align="stretch">
                          {/* Search and Pagination */}
                          <div className="w-[var(--search-input-width)]">
                            <SearchInput
                              placeholder="Search fixed IPs by attributes"
                              value={networkSearch}
                              onChange={(e) => setNetworkSearch(e.target.value)}
                            />
                          </div>

                          <HStack gap={2} align="center">
                            <Pagination
                              currentPage={networkPage}
                              totalPages={5}
                              onPageChange={setNetworkPage}
                            />
                            <div className="h-4 w-px bg-[var(--color-border-default)]" />
                            <span className="text-body-sm text-[var(--color-text-subtle)]">
                              115 items
                            </span>
                          </HStack>

                          {/* Network Table */}
                          <Table columns={networkColumns} data={mockNetworks} rowKey="id" />

                          {/* Selection Indicator for Network */}
                          <SelectionIndicator
                            selectedItems={
                              selectedNetwork
                                ? [
                                    {
                                      id: selectedNetwork,
                                      label:
                                        mockNetworks.find((n) => n.id === selectedNetwork)?.name ||
                                        selectedNetwork,
                                    },
                                  ]
                                : []
                            }
                            onRemove={() => setSelectedNetwork(null)}
                            error={!!networkError}
                            errorMessage={networkError || undefined}
                          />
                        </VStack>
                      </VStack>
                    </div>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    {/* Fixed IP Section */}
                    <div className="py-6">
                      <VStack gap={3}>
                        <VStack gap={1.5}>
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Fixed IP
                          </span>
                          <p className="text-body-md text-[var(--color-text-subtle)]">
                            Select a subnet and choose whether to auto-allocate fixed IP or enter
                            one manually.
                          </p>
                        </VStack>

                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                          <VStack gap={2}>
                            {fixedIPs.map((entry) => (
                              <div
                                key={entry.id}
                                className="grid grid-cols-[auto_1fr_1fr_1fr_20px] gap-2 w-full items-center"
                              >
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Subnet
                                </span>
                                <Select
                                  value={entry.subnet}
                                  onChange={(value) => updateFixedIP(entry.id, { subnet: value })}
                                  options={[{ value: entry.subnet, label: entry.subnet }]}
                                  placeholder="Select"
                                  fullWidth
                                />
                                <Select
                                  value={entry.ipMode}
                                  onChange={(value) =>
                                    updateFixedIP(entry.id, {
                                      ipMode: value as 'auto' | 'manual',
                                    })
                                  }
                                  options={[
                                    { value: 'auto', label: 'Auto-allocate' },
                                    { value: 'manual', label: 'Manual' },
                                  ]}
                                  disabled
                                  fullWidth
                                />
                                {entry.ipMode === 'auto' ? (
                                  <span className="text-body-sm text-[var(--color-text-subtle)]">
                                    192.168.1.100 - 192.168.1.200
                                  </span>
                                ) : (
                                  <Input
                                    placeholder="Enter IP address"
                                    value={entry.ipAddress}
                                    onChange={(e) =>
                                      updateFixedIP(entry.id, { ipAddress: e.target.value })
                                    }
                                    fullWidth
                                  />
                                )}
                                <button
                                  onClick={() => removeFixedIP(entry.id)}
                                  className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                >
                                  <IconX
                                    size={16}
                                    className="text-[var(--color-text-muted)]"
                                    stroke={1.5}
                                  />
                                </button>
                              </div>
                            ))}
                            <div className="w-fit">
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                onClick={addFixedIP}
                              >
                                Add fixed IP
                              </Button>
                            </div>
                          </VStack>
                        </div>
                      </VStack>
                    </div>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    {/* MAC address Section */}
                    <div className="py-6">
                      <VStack gap={3} align="stretch">
                        <FormField required>
                          <FormField.Label>MAC address</FormField.Label>
                          <FormField.Description>
                            Choose whether to auto-allocate a MAC address or enter one manually.
                          </FormField.Description>
                          <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                            <VStack className="gap-[var(--radio-group-item-gap)]" align="start">
                              <RadioGroup
                                value={macAddressMode}
                                onChange={(value) => setMacAddressMode(value as 'auto' | 'manual')}
                              >
                                <Radio value="auto" label="Auto-allocate" />
                                <Radio value="manual" label="Manual" />
                              </RadioGroup>
                              {macAddressMode === 'manual' && (
                                <div className="pl-[calc(var(--radio-size)+var(--radio-gap))] w-full">
                                  <Input
                                    placeholder="Enter MAC address (e.g. fa:16:3e:d7:f2:6c)"
                                    value={manualMacAddress}
                                    onChange={(e) => setManualMacAddress(e.target.value)}
                                    fullWidth
                                  />
                                </div>
                              )}
                            </VStack>
                          </FormField.Control>
                        </FormField>
                      </VStack>
                    </div>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    {/* Next Button */}
                    <HStack justify="end" className="pt-3">
                      <Button
                        variant="primary"
                        onClick={() => {
                          if (!selectedNetwork) {
                            setNetworkError('Please select a network.');
                            return;
                          }
                          setNetworkError(null);
                          setSectionStatus((prev) => ({
                            ...prev,
                            network: 'done',
                            security: 'active',
                          }));
                        }}
                      >
                        Next
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {!isV2 && sectionStatus['network'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Network"
                    value={selectedNetworkDetails?.name || '-'}
                  />
                  <SectionCard.DataRow label="Fixed IP" value="Auto-allocate" />
                  <SectionCard.DataRow
                    label="MAC address"
                    value={
                      macAddressMode === 'auto' ? 'Auto-allocate' : manualMacAddress || 'Manual'
                    }
                  />
                </SectionCard.Content>
              )}
            </SectionCard>
            {isV2 && (
              <SectionCard>
                <SectionCard.Header title={SECTION_LABELS['network']} />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Network"
                    value={selectedNetworkDetails?.name || '-'}
                  />
                  <SectionCard.DataRow label="Fixed IP" value="Auto-allocate" />
                  <SectionCard.DataRow
                    label="MAC address"
                    value={
                      macAddressMode === 'auto' ? 'Auto-allocate' : manualMacAddress || 'Manual'
                    }
                  />
                </SectionCard.Content>
              </SectionCard>
            )}

            {/* Security Section */}
            <SectionCard isActive={sectionStatus['security'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['security']}
                showDivider={sectionStatus['security'] === 'done'}
                actions={
                  sectionStatus['security'] === 'done' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconEdit size={12} />}
                      onClick={() => editSection('security')}
                    >
                      Edit
                    </Button>
                  )
                }
              />
              {(isV2 || sectionStatus['security'] === 'active') && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    {/* Port Security Toggle */}
                    <VStack gap={3} className="py-6">
                      <FormField required>
                        <FormField.Label>Port security</FormField.Label>
                        <FormField.Description>
                          Indicates whether to enable security features on the port, including
                          security groups.
                        </FormField.Description>
                      </FormField>
                      <HStack gap={2} align="center">
                        <Toggle
                          checked={portSecurityEnabled}
                          onChange={(e) => setPortSecurityEnabled(e.target.checked)}
                        />
                        <span className="text-body-md text-[var(--color-text-default)]">
                          {portSecurityEnabled ? 'On' : 'Off'}
                        </span>
                      </HStack>
                    </VStack>
                    {/* Security Groups Section */}
                    {(isV2 || portSecurityEnabled) && (
                      <>
                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                        <div className="py-6">
                          <VStack gap={2} align="stretch">
                            <FormField>
                              <FormField.Label>Security groups</FormField.Label>
                              <FormField.Description>
                                Select the security groups to apply to the port.
                              </FormField.Description>
                              <FormField.Control>
                                <VStack gap={2} align="stretch">
                                  {/* Search + Create Button Row */}
                                  <HStack justify="between" align="center">
                                    <div className="w-[var(--search-input-width)]">
                                      <SearchInput
                                        placeholder="Search fixed IPs by attributes"
                                        value={securityGroupSearch}
                                        onChange={(e) => setSecurityGroupSearch(e.target.value)}
                                      />
                                    </div>
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      leftIcon={<IconEdit size={12} />}
                                    >
                                      Create a new security group
                                    </Button>
                                  </HStack>

                                  {/* Pagination */}
                                  <Pagination
                                    currentPage={securityGroupPage}
                                    totalPages={5}
                                    totalItems={115}
                                    onPageChange={setSecurityGroupPage}
                                    selectedCount={selectedSecurityGroups.length}
                                  />

                                  {/* Security Groups Table */}
                                  <Table
                                    columns={securityGroupColumns}
                                    data={mockSecurityGroups}
                                    getRowId={(row) => row.id}
                                  />

                                  {/* Selection Indicator for Security Groups */}
                                  <SelectionIndicator
                                    selectedItems={selectedSecurityGroups.map((id) => ({
                                      id,
                                      label:
                                        mockSecurityGroups.find((sg) => sg.id === id)?.name || id,
                                    }))}
                                    onRemove={(id) =>
                                      setSelectedSecurityGroups((prev) =>
                                        prev.filter((sgId) => sgId !== id)
                                      )
                                    }
                                  />
                                </VStack>
                              </FormField.Control>
                            </FormField>
                          </VStack>
                        </div>
                      </>
                    )}
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    {/* Next Button */}
                    <HStack justify="end" className="pt-3">
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSectionStatus((prev) => ({
                            ...prev,
                            security: 'done',
                          }));
                        }}
                      >
                        Next
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {!isV2 && sectionStatus['security'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Port security"
                    value={portSecurityEnabled ? 'Enabled' : 'Disabled'}
                  />
                  <SectionCard.DataRow
                    label="Security groups"
                    value={
                      selectedSecurityGroups.length > 0
                        ? mockSecurityGroups
                            .filter((sg) => selectedSecurityGroups.includes(sg.id))
                            .map((sg) => sg.name)
                            .join(', ')
                        : 'None'
                    }
                  />
                </SectionCard.Content>
              )}
            </SectionCard>
            {isV2 && (
              <SectionCard>
                <SectionCard.Header title={SECTION_LABELS['security']} />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Port security"
                    value={portSecurityEnabled ? 'Enabled' : 'Disabled'}
                  />
                  <SectionCard.DataRow
                    label="Security groups"
                    value={
                      selectedSecurityGroups.length > 0
                        ? mockSecurityGroups
                            .filter((sg) => selectedSecurityGroups.includes(sg.id))
                            .map((sg) => sg.name)
                            .join(', ')
                        : 'None'
                    }
                  />
                </SectionCard.Content>
              </SectionCard>
            )}
          </VStack>

          {/* Summary Sidebar */}
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
