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
  SectionCard,
  FormField,
  WizardSummary,
  ProgressBar,
  Tabs,
  Table,
  SearchInput,
  Pagination,
  StatusIndicator,
  RadioGroup,
  Radio,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState, Column } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  IconBell,
  IconEdit,
  IconExternalLink,
  IconPlus,
} from '@tabler/icons-react';

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
  { id: '29tgj234', name: 'net-01', status: 'active', external: 'Yes', shared: 'On', subnetCidr: '10.0.0.0/24' },
  { id: '38rhk345', name: 'net-02', status: 'active', external: 'Yes', shared: 'On', subnetCidr: '10.0.0.0/24' },
  { id: '47sil456', name: 'net-03', status: 'active', external: 'Yes', shared: 'On', subnetCidr: '10.0.0.0/24' },
  { id: '56tjm567', name: 'net-04', status: 'active', external: 'Yes', shared: 'On', subnetCidr: '10.0.0.0/24' },
  { id: '65ukn678', name: 'net-05', status: 'active', external: 'Yes', shared: 'On', subnetCidr: '10.0.0.0/24' },
];

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  'network': 'Network',
  'security': 'Security',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = [
  'basic-info',
  'network',
  'security',
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

        {/* Quota Card */}
        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            <h5 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
              Quota
            </h5>
            <VStack gap={3}>
              <ProgressBar
                variant="quota"
                label="Port"
                value={5}
                max={20}
                showValue
              />
            </VStack>
          </VStack>
        </div>
        
        {/* Action Buttons */}
        <HStack gap={2}>
          <Button variant="secondary" onClick={onCancel} className="w-[80px]">
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
  const { tabs, activeTabId, addTab, closeTab, selectTab } = useTabs();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();

  // Section status state
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    'network': 'pre',
    'security': 'pre',
  });

  // Form state - Basic Info
  const [adapterName, setAdapterName] = useState('');
  const [description, setDescription] = useState('');

  // Form state - Network
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [networkTab, setNetworkTab] = useState<'current' | 'shared' | 'external'>('current');
  const [networkSearch, setNetworkSearch] = useState('');
  const [networkPage, setNetworkPage] = useState(1);
  const [macAddressMode, setMacAddressMode] = useState<'auto' | 'manual'>('auto');

  // Form state - Security (placeholder for future implementation)
  const [securityGroupId, setSecurityGroupId] = useState('');

  // Network table columns
  const networkColumns: Column<NetworkRow>[] = useMemo(() => [
    {
      key: 'status',
      header: 'Status',
      width: '70px',
      align: 'center' as const,
      render: (_value, row) => <StatusIndicator status={row.status} />,
    },
    {
      key: 'name',
      header: 'Name',
      flex: 1,
      sortable: true,
      render: (_value, row) => (
        <VStack gap={0.5} align="start">
          <HStack gap={1.5} align="center">
            <span className="text-[var(--color-action-primary)] text-[12px] font-medium">
              {row.name}
            </span>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-[11px] text-[var(--color-text-subtle)]">
            ID: {row.id}
          </span>
        </VStack>
      ),
    },
    {
      key: 'external',
      header: 'External',
      flex: 1,
    },
    {
      key: 'shared',
      header: 'Shared',
      flex: 1,
    },
    {
      key: 'subnetCidr',
      header: 'Subnet CIDR',
      flex: 1,
    },
  ], []);

  // Get selected network details for summary
  const selectedNetworkDetails = useMemo(() => {
    return mockNetworks.find(n => n.id === selectedNetwork);
  }, [selectedNetwork]);

  // Computed states
  const isCreateDisabled = !adapterName.trim() || sectionStatus['security'] !== 'done';

  // Helper function to edit a section
  const editSection = (section: SectionStep) => {
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
      networkId,
      securityGroupId,
    });
    navigate('/compute/ports');
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: sidebarOpen ? '200px' : '0px' }}
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
                <TopBarAction icon={<IconBell size={18} />} onClick={() => {}} aria-label="Notifications" />
              </>
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={6} className="min-w-[1176px]">
              {/* Page Title */}
              <h1 className="text-[18px] font-semibold leading-7 text-[var(--color-text-default)]">
                Create virtual adapter
              </h1>

              {/* Content Area */}
              <HStack gap={6} align="start" className="w-full">
                {/* Left Column - Form Sections */}
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
                        {/* Virtual adapter Name */}
                        <FormField required>
                          <FormField.Label>Virtual adapter Name</FormField.Label>
                          <FormField.Control>
                            <Input
                              placeholder="Enter name"
                              value={adapterName}
                              onChange={(e) => setAdapterName(e.target.value)}
                              fullWidth
                            />
                          </FormField.Control>
                          <FormField.HelperText>
                            You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters.
                          </FormField.HelperText>
                        </FormField>

                        {/* Description */}
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
                            You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters.
                          </FormField.HelperText>
                        </FormField>

                        {/* Next Button */}
                        <div className="flex items-center justify-end w-full">
                          <Button 
                            variant="primary" 
                            onClick={() => {
                              setSectionStatus((prev) => ({
                                ...prev,
                                'basic-info': 'done',
                                'network': 'active',
                              }));
                            }}
                            disabled={!adapterName.trim()}
                          >
                            Next
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['basic-info'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Virtual adapter Name" 
                          value={adapterName} 
                          showDivider 
                        />
                        {description && (
                          <SectionCard.DataRow 
                            label="Description" 
                            value={description} 
                          />
                        )}
                      </SectionCard.Content>
                    )}
                  </SectionCard>

                  {/* Network Section */}
                  <SectionCard isActive={sectionStatus['network'] === 'active'}>
                    <SectionCard.Header 
                      title={SECTION_LABELS['network']}
                      showDivider={sectionStatus['network'] === 'active'}
                      actions={
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
                    {sectionStatus['network'] === 'active' && (
                      <SectionCard.Content gap={6}>
                        {/* Owned network - Network Table */}
                        <VStack gap={4} align="stretch">
                          <FormField required>
                            <FormField.Label>Owned network</FormField.Label>
                            <FormField.HelperText>
                              Select the network to which the virtual adaptor will be attached.
                            </FormField.HelperText>
                          </FormField>

                          {/* Network Tabs */}
                          <Tabs
                            value={networkTab}
                            onChange={(value) => setNetworkTab(value as 'current' | 'shared' | 'external')}
                            variant="underline"
                          >
                            <Tabs.List>
                              <Tabs.Tab value="current">Current tenant</Tabs.Tab>
                              <Tabs.Tab value="shared">Shared</Tabs.Tab>
                              <Tabs.Tab value="external">External</Tabs.Tab>
                            </Tabs.List>
                          </Tabs>

                          {/* Network Table Body */}
                          <VStack gap={3} align="stretch">
                            {/* Search and Pagination */}
                            <div className="w-[280px]">
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
                              <span className="text-[11px] text-[var(--color-text-subtle)]">
                                115 items
                              </span>
                            </HStack>

                            {/* Network Table */}
                            <Table
                              columns={networkColumns}
                              data={mockNetworks}
                              selectable
                              selectionMode="single"
                              selectedRows={selectedNetwork ? [selectedNetwork] : []}
                              onSelectionChange={(selected) => {
                                setSelectedNetwork(selected.length > 0 ? selected[0] : null);
                              }}
                              getRowId={(row) => row.id}
                            />
                          </VStack>
                        </VStack>

                        {/* Fixed IP Section */}
                        <VStack gap={3} align="stretch">
                          <FormField>
                            <FormField.Label>Fixed IP</FormField.Label>
                            <FormField.HelperText>
                              Select a subnet and choose whether to auto-allocate fixed IP or enter one manually.
                            </FormField.HelperText>
                          </FormField>
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconPlus size={12} />}
                            disabled
                          >
                            Add fixed IP
                          </Button>
                        </VStack>

                        {/* MAC address Section */}
                        <VStack gap={3} align="stretch">
                          <FormField required>
                            <FormField.Label>MAC address</FormField.Label>
                            <FormField.HelperText>
                              Choose whether to auto-allocate a MAC address or enter one manually.
                            </FormField.HelperText>
                          </FormField>
                          <RadioGroup
                            value={macAddressMode}
                            onChange={(value) => setMacAddressMode(value as 'auto' | 'manual')}
                          >
                            <Radio value="auto" label="Auto-allocate" />
                            <Radio value="manual" label="Manual" />
                          </RadioGroup>
                        </VStack>

                        {/* Next Button */}
                        <div className="flex items-center justify-end w-full">
                          <Button 
                            variant="primary" 
                            onClick={() => {
                              setSectionStatus((prev) => ({
                                ...prev,
                                'network': 'done',
                                'security': 'active',
                              }));
                            }}
                            disabled={!selectedNetwork}
                          >
                            Next
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['network'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Network" 
                          value={selectedNetworkDetails?.name || '-'} 
                          showDivider
                        />
                        <SectionCard.DataRow 
                          label="Fixed IP" 
                          value="Auto-allocate" 
                          showDivider
                        />
                        <SectionCard.DataRow 
                          label="MAC address" 
                          value={macAddressMode === 'auto' ? 'Auto-allocate' : 'Manual'} 
                        />
                      </SectionCard.Content>
                    )}
                  </SectionCard>

                  {/* Security Section */}
                  <SectionCard isActive={sectionStatus['security'] === 'active'}>
                    <SectionCard.Header 
                      title={SECTION_LABELS['security']}
                      showDivider={sectionStatus['security'] === 'active'}
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
                    {sectionStatus['security'] === 'active' && (
                      <SectionCard.Content gap={6}>
                        {/* Security group Selection - Placeholder */}
                        <FormField>
                          <FormField.Label>Security group</FormField.Label>
                          <FormField.Control>
                            <Input
                              placeholder="Select security group"
                              value={securityGroupId}
                              onChange={(e) => setSecurityGroupId(e.target.value)}
                              fullWidth
                            />
                          </FormField.Control>
                          <FormField.HelperText>
                            Select security groups to apply to the virtual adapter.
                          </FormField.HelperText>
                        </FormField>

                        {/* Done Button */}
                        <div className="flex items-center justify-end w-full">
                          <Button 
                            variant="primary" 
                            onClick={() => {
                              setSectionStatus((prev) => ({
                                ...prev,
                                'security': 'done',
                              }));
                            }}
                          >
                            Done
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['security'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Security group" 
                          value={securityGroupId || 'Default'} 
                        />
                      </SectionCard.Content>
                    )}
                  </SectionCard>
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
          </div>
        </div>
      </main>
    </div>
  );
}

