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
  NumberInput,
  Checkbox,
  Disclosure,
  Tooltip,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState, TableColumn } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  IconBell,
  IconEdit,
  IconExternalLink,
  IconInfoCircle,
  IconPlus,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'listener' | 'pool' | 'member' | 'health-monitor';

// Network table row type
interface NetworkRow {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'muted';
  subnetCidr: string;
  external: string;
  shared: string;
}

// Mock network data
const mockNetworks: NetworkRow[] = [
  { id: '29tgj234', name: 'net-01', status: 'active', subnetCidr: '10.0.0.0/24', external: 'Yes', shared: 'On' },
  { id: '38rhk345', name: 'net-02', status: 'active', subnetCidr: '10.0.1.0/24', external: 'Yes', shared: 'On' },
  { id: '47sil456', name: 'net-03', status: 'active', subnetCidr: '10.0.2.0/24', external: 'No', shared: 'Off' },
  { id: '56tjm567', name: 'net-04', status: 'building', subnetCidr: '10.0.3.0/24', external: 'No', shared: 'Off' },
  { id: '65ukn678', name: 'net-05', status: 'active', subnetCidr: '10.0.4.0/24', external: 'Yes', shared: 'On' },
];

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  'listener': 'Listener',
  'pool': 'Pool',
  'member': 'Member',
  'health-monitor': 'Health monitor',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = [
  'basic-info',
  'listener',
  'pool',
  'member',
  'health-monitor',
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
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-3 flex flex-col gap-3">
        <WizardSummary items={summaryItems} />
        
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

export default function CreateLoadBalancerPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, addTab, closeTab, selectTab } = useTabs();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();

  // Section status state
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    'listener': 'pre',
    'pool': 'pre',
    'member': 'pre',
    'health-monitor': 'pre',
  });

  // Compute which section is currently active (only one should be active at a time)
  const activeSection = useMemo(() => {
    return SECTION_ORDER.find(section => sectionStatus[section] === 'active') || null;
  }, [sectionStatus]);

  // Basic Information form state
  const [loadBalancerName, setLoadBalancerName] = useState('');
  const [description, setDescription] = useState('');
  const [provider, setProvider] = useState<'ovn' | 'amphora'>('ovn');

  // Handler to change provider and reset listener protocol if incompatible
  const handleProviderChange = (newProvider: 'ovn' | 'amphora') => {
    setProvider(newProvider);
    // Reset listener protocol if it's not compatible with the new provider
    if (newProvider === 'ovn' && !['TCP', 'UDP'].includes(listenerProtocol)) {
      setListenerProtocol('');
    }
  };

  // Handler to change listener protocol and auto-fill port
  const handleListenerProtocolChange = (protocol: string) => {
    setListenerProtocol(protocol);
    // Auto-fill port based on protocol
    switch (protocol) {
      case 'HTTP':
        setProtocolPort(80);
        break;
      case 'HTTPS':
      case 'TERMINATED_HTTPS':
        setProtocolPort(443);
        break;
      case 'TCP':
        setProtocolPort(5000);
        break;
      case 'UDP':
        setProtocolPort(53);
        break;
      default:
        break;
    }
  };
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [networkTab, setNetworkTab] = useState<'current' | 'shared' | 'external'>('current');
  const [networkSearch, setNetworkSearch] = useState('');
  const [networkPage, setNetworkPage] = useState(1);
  const [subnet, setSubnet] = useState('');
  const [vipMode, setVipMode] = useState<'auto' | 'manual'>('auto');
  const [manualVip, setManualVip] = useState('');
  const [adminStateUp, setAdminStateUp] = useState(false);

  // Listener form state
  const [listenerName, setListenerName] = useState('listener-http-80');
  const [listenerDescription, setListenerDescription] = useState('');
  const [listenerProtocol, setListenerProtocol] = useState('');
  const [protocolPort, setProtocolPort] = useState(80);
  const [connectionLimitType, setConnectionLimitType] = useState<'unlimited' | 'limited'>('unlimited');
  const [connectionLimitValue, setConnectionLimitValue] = useState<number | undefined>(undefined);
  const [listenerAdminState, setListenerAdminState] = useState(false);
  const [xForwardedFor, setXForwardedFor] = useState(false);
  const [xForwardedPort, setXForwardedPort] = useState(false);
  const [clientDataTimeout, setClientDataTimeout] = useState(50000);
  const [memberConnectTimeout, setMemberConnectTimeout] = useState(5000);
  const [memberDataTimeout, setMemberDataTimeout] = useState(5000);
  const [tcpInspectTimeout, setTcpInspectTimeout] = useState(0);
  const [allowedCidrs, setAllowedCidrs] = useState<string[]>([]);

  // Get selected network details
  const selectedNetworkDetails = useMemo(() => {
    return mockNetworks.find(n => n.id === selectedNetwork);
  }, [selectedNetwork]);

  // Network table columns
  const networkColumns: TableColumn<NetworkRow>[] = useMemo(() => [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedNetwork === row.id}
            onChange={() => setSelectedNetwork(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '70px',
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
      key: 'subnetCidr',
      label: 'Subnet CIDR',
      flex: 1,
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
  ], [selectedNetwork]);

  // Tab bar management
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Section navigation - ensures only one section is active at a time
  const goToNextSection = (currentSection: SectionStep) => {
    const currentIndex = SECTION_ORDER.indexOf(currentSection);
    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      // Mark current section as done
      newStatus[currentSection] = 'done';
      // If there's a next section, make it active
      if (currentIndex < SECTION_ORDER.length - 1) {
        const nextSection = SECTION_ORDER[currentIndex + 1];
        newStatus[nextSection] = 'active';
      }
      return newStatus;
    });
  };

  // Edit section - resets subsequent sections to 'pre' state
  const editSection = (section: SectionStep) => {
    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      // Set clicked section to active
      newStatus[section] = 'active';
      // Reset all sections after this one to 'pre'
      const sectionIndex = SECTION_ORDER.indexOf(section);
      for (let i = sectionIndex + 1; i < SECTION_ORDER.length; i++) {
        newStatus[SECTION_ORDER[i]] = 'pre';
      }
      return newStatus;
    });
  };

  // Create handler
  const handleCreate = () => {
    console.log('Creating load balancer:', {
      loadBalancerName,
      description,
      provider,
      networkId: selectedNetwork,
      networkName: selectedNetworkDetails?.name,
      subnet,
      vipMode,
      manualVip: vipMode === 'manual' ? manualVip : 'auto',
      adminStateUp,
    });
    navigate('/compute/load-balancers');
  };

  // Check if create button should be disabled
  const isCreateDisabled = !loadBalancerName || !selectedNetwork;

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

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
            onTabAdd={() => addTab({ label: 'New Tab', path: '/' })}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={openSidebar}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Proj-1', href: '/project' },
                  { label: 'Load Balancers', href: '/compute/load-balancers' },
                  { label: 'Create load balancer' },
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
            <VStack gap={6} className="min-w-[1176px]">
              {/* Page Header */}
              <h1 className="text-[18px] font-semibold text-[var(--color-text-default)]">
                Create load balancer
              </h1>

              {/* Main Content */}
              <HStack gap={6} align="start" className="w-full">
                {/* Left Column - Form Sections */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  <SectionCard isActive={activeSection === 'basic-info'}>
                    <SectionCard.Header
                      title={SECTION_LABELS['basic-info']}
                      showDivider={activeSection === 'basic-info'}
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
                    {activeSection === 'basic-info' && (
                      <SectionCard.Content gap={6}>
                        {/* Load Balancer Name */}
                        <FormField required>
                          <FormField.Label>Load balancer name</FormField.Label>
                          <FormField.Control>
                            <Input
                              placeholder="Enter Load balancer name"
                              value={loadBalancerName}
                              onChange={(e) => setLoadBalancerName(e.target.value)}
                              fullWidth
                            />
                          </FormField.Control>
                          <FormField.HelperText>
                            You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters.
                          </FormField.HelperText>
                        </FormField>

                        {/* Description */}
                        <FormField>
                          <FormField.Label>Load balancer description</FormField.Label>
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

                        {/* Provider */}
                        <FormField required>
                          <FormField.Label>Provider</FormField.Label>
                          <FormField.HelperText>
                            Choose the provider to use for the load balancer.
                          </FormField.HelperText>
                          <VStack gap={3} className="mt-3">
                            <HStack gap={1.5} align="center">
                              <Radio
                                value="ovn"
                                checked={provider === 'ovn'}
                                onChange={() => handleProviderChange('ovn')}
                                label="OVN"
                              />
                              <IconInfoCircle size={16} className="text-[var(--color-text-subtle)]" />
                            </HStack>
                            <HStack gap={1.5} align="center">
                              <Radio
                                value="amphora"
                                checked={provider === 'amphora'}
                                onChange={() => handleProviderChange('amphora')}
                                label="Amphora"
                              />
                              <IconInfoCircle size={16} className="text-[var(--color-text-subtle)]" />
                            </HStack>
                          </VStack>
                        </FormField>

                        {/* Owned Network */}
                        <VStack gap={4}>
                          <FormField required>
                            <FormField.Label>Owned network</FormField.Label>
                            <FormField.HelperText>
                              Select the network to attach the load balancer to.
                            </FormField.HelperText>
                          </FormField>

                          {/* Network Tabs */}
                          <Tabs
                            value={networkTab}
                            onChange={(value) => setNetworkTab(value as 'current' | 'shared' | 'external')}
                            variant="underline"
                          >
                            <TabList>
                              <Tab value="current">Current tenant</Tab>
                              <Tab value="shared">Shared</Tab>
                              <Tab value="external">External</Tab>
                            </TabList>
                          </Tabs>

                          {/* Search */}
                          <div style={{ width: '280px' }}>
                            <SearchInput
                              placeholder="Search networks by attributes"
                              value={networkSearch}
                              onChange={(e) => setNetworkSearch(e.target.value)}
                            />
                          </div>

                          {/* Pagination */}
                          <Pagination
                            currentPage={networkPage}
                            totalPages={5}
                            totalItems={115}
                            onPageChange={setNetworkPage}
                          />

                          {/* Network Table */}
                          {provider ? (
                            <Table
                              columns={networkColumns}
                              data={mockNetworks}
                              getRowId={(row) => row.id}
                            />
                          ) : (
                            <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md p-4 text-center text-[12px] text-[var(--color-text-default)]">
                              Select a provider to view the network list.
                            </div>
                          )}
                        </VStack>

                        {/* VIP Address */}
                        <FormField required>
                          <FormField.Label>VIP Address</FormField.Label>
                          <FormField.HelperText>
                            Select the subnet for the VIP. You can assign an IP automatically or manually enter one within the subnet range.
                          </FormField.HelperText>
                          <div className="mt-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md px-4 py-2 flex items-center gap-2">
                            <HStack gap={2} align="center">
                              <span className="text-[14px] font-medium text-[var(--color-text-default)]">Subnet</span>
                              <Select
                                options={[
                                  ...(selectedNetworkDetails ? [{ value: selectedNetworkDetails.subnetCidr, label: selectedNetworkDetails.subnetCidr }] : []),
                                  { value: '10.0.0.0/24', label: '10.0.0.0/24' },
                                  { value: '10.0.1.0/24', label: '10.0.1.0/24' },
                                ]}
                                value={subnet}
                                onChange={setSubnet}
                                placeholder="Select"
                                width="sm"
                              />
                            </HStack>
                            <HStack gap={2} align="center">
                              <span className="text-[14px] font-medium text-[var(--color-text-default)]">VIP</span>
                              <Select
                                options={[
                                  { value: 'auto', label: 'Auto-assign' },
                                  { value: 'manual', label: 'Manual' },
                                ]}
                                value={vipMode}
                                onChange={(value) => setVipMode(value as 'auto' | 'manual')}
                                placeholder="Auto-assign"
                                width="sm"
                              />
                            </HStack>
                            {vipMode === 'manual' && (
                              <Input
                                placeholder="Enter VIP address"
                                value={manualVip}
                                onChange={(e) => setManualVip(e.target.value)}
                                style={{ width: '160px' }}
                              />
                            )}
                          </div>
                        </FormField>

                        {/* Load Balancer Admin State */}
                        <FormField>
                          <FormField.Label>Load balancer admin state</FormField.Label>
                          <FormField.HelperText>
                            Set the administrative state of the load balancer. 'UP' enables traffic handling, while 'DOWN' disables it.
                          </FormField.HelperText>
                          <div className="mt-2">
                            <Toggle
                              checked={adminStateUp}
                              onChange={(e) => setAdminStateUp(e.target.checked)}
                              label={adminStateUp ? 'Up' : 'Down'}
                            />
                          </div>
                        </FormField>

                        {/* Next Button */}
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
                        <SectionCard.DataRow
                          label="Load balancer name"
                          value={loadBalancerName}
                          showDivider
                        />
                        {description && (
                          <SectionCard.DataRow
                            label="Description"
                            value={description}
                            showDivider
                          />
                        )}
                        <SectionCard.DataRow
                          label="Provider"
                          value={provider === 'ovn' ? 'OVN' : 'Amphora'}
                          showDivider
                        />
                        <SectionCard.DataRow
                          label="Owned network"
                          value={selectedNetworkDetails?.name || '-'}
                          showDivider
                        />
                        <SectionCard.DataRow
                          label="VIP Address"
                          value={`${subnet || 'Not selected'} / ${vipMode === 'auto' ? 'Auto-assign' : manualVip}`}
                          showDivider
                        />
                        <SectionCard.DataRow
                          label="Admin state"
                          value={adminStateUp ? 'Up' : 'Down'}
                        />
                      </SectionCard.Content>
                    )}
                  </SectionCard>

                  {/* Listener Section */}
                  <SectionCard isActive={activeSection === 'listener'}>
                    <SectionCard.Header
                      title={SECTION_LABELS['listener']}
                      showDivider={activeSection === 'listener'}
                      actions={
                        sectionStatus['listener'] === 'done' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconEdit size={12} />}
                            onClick={() => editSection('listener')}
                          >
                            Edit
                          </Button>
                        )
                      }
                    />
                    {activeSection === 'listener' && (
                      <SectionCard.Content gap={6}>
                        {/* Listener name */}
                        <FormField required>
                          <FormField.Label>Listener name</FormField.Label>
                          <FormField.Control>
                            <Input
                              value={listenerName}
                              onChange={(e) => setListenerName(e.target.value)}
                              placeholder="Enter listener name"
                              fullWidth
                            />
                          </FormField.Control>
                          <FormField.HelperText>
                            You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters.
                          </FormField.HelperText>
                        </FormField>

                        {/* Listener description */}
                        <FormField>
                          <FormField.Label>Listener description</FormField.Label>
                          <FormField.Control>
                            <Input
                              value={listenerDescription}
                              onChange={(e) => setListenerDescription(e.target.value)}
                              placeholder="Enter description"
                              fullWidth
                            />
                          </FormField.Control>
                          <FormField.HelperText>
                            You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters.
                          </FormField.HelperText>
                        </FormField>

                        {/* Listener protocol */}
                        <FormField required>
                          <FormField.Label>Listener protocol</FormField.Label>
                          <p className="text-[12px] text-[var(--color-text-subtle)] mb-2">
                            Select the protocol used to handle client requests.
                          </p>
                          <FormField.Control>
                            <Select
                              value={listenerProtocol}
                              onValueChange={handleListenerProtocolChange}
                              options={
                                provider === 'ovn'
                                  ? [
                                      { value: 'TCP', label: 'TCP' },
                                      { value: 'UDP', label: 'UDP' },
                                    ]
                                  : [
                                      { value: 'HTTP', label: 'HTTP' },
                                      { value: 'HTTPS', label: 'HTTPS' },
                                      { value: 'TCP', label: 'TCP' },
                                      { value: 'UDP', label: 'UDP' },
                                      { value: 'TERMINATED_HTTPS', label: 'TERMINATED_HTTPS' },
                                    ]
                              }
                              placeholder="Select a protocol"
                              width="sm"
                            />
                          </FormField.Control>
                        </FormField>

                        {/* Protocol port */}
                        <FormField required>
                          <FormField.Label>Protocol port</FormField.Label>
                          <p className="text-[12px] text-[var(--color-text-subtle)] mb-2">
                            The port on which the listener receives client requests.
                          </p>
                          <FormField.Control>
                            <NumberInput
                              value={protocolPort}
                              onChange={setProtocolPort}
                              min={1}
                              max={65535}
                              style={{ width: '200px' }}
                            />
                          </FormField.Control>
                          <FormField.HelperText>1-65535</FormField.HelperText>
                        </FormField>

                        {/* Connection limit */}
                        <FormField required>
                          <FormField.Label>Connection limit</FormField.Label>
                          <p className="text-[12px] text-[var(--color-text-subtle)] mb-2">
                            Defines the maximum number of concurrent connections the listener can handle.
                          </p>
                          <FormField.Control>
                            <VStack gap={3} align="start">
                              <Radio
                                label="Unlimited"
                                checked={connectionLimitType === 'unlimited'}
                                onChange={() => setConnectionLimitType('unlimited')}
                              />
                              <HStack gap={3} align="center">
                                <Radio
                                  label="Limited"
                                  checked={connectionLimitType === 'limited'}
                                  onChange={() => setConnectionLimitType('limited')}
                                />
                                <NumberInput
                                  value={connectionLimitValue}
                                  onChange={setConnectionLimitValue}
                                  disabled={connectionLimitType === 'unlimited'}
                                  min={1}
                                  style={{ width: '200px' }}
                                  className={connectionLimitType === 'unlimited' ? 'bg-[var(--color-surface-subtle)]' : ''}
                                />
                              </HStack>
                            </VStack>
                          </FormField.Control>
                        </FormField>

                        {/* Listener admin state */}
                        <FormField>
                          <FormField.Label>Listener admin state</FormField.Label>
                          <p className="text-[12px] text-[var(--color-text-subtle)] mb-2">
                            Set the administrative state of the listener. 'UP' enables traffic handling, while 'DOWN' disables it.
                          </p>
                          <FormField.Control>
                            <HStack gap={2} align="center">
                              <Toggle
                                checked={listenerAdminState}
                                onChange={(e) => setListenerAdminState(e.target.checked)}
                              />
                              <span className="text-[12px] text-[var(--color-text-default)]">
                                {listenerAdminState ? 'Up' : 'Down'}
                              </span>
                            </HStack>
                          </FormField.Control>
                        </FormField>

                        {/* Advanced Section */}
                        <Disclosure defaultOpen={false}>
                          <Disclosure.Trigger>
                            Advanced
                          </Disclosure.Trigger>
                          <Disclosure.Panel>
                            <VStack gap={6} className="mt-4">
                              {/* Custom headers */}
                              <FormField>
                                <FormField.Label>Custom headers</FormField.Label>
                                <p className="text-[12px] text-[var(--color-text-subtle)] mb-3">
                                  Defines custom header values to be forwarded to backend servers.
                                </p>
                                <VStack gap={3} align="start">
                                  <HStack gap={2} align="center">
                                    <Checkbox
                                      checked={xForwardedFor}
                                      onChange={(e) => setXForwardedFor(e.target.checked)}
                                      label="X-Forwarded-For"
                                    />
                                    <Tooltip content="Captures the original client IP address">
                                      <IconInfoCircle size={16} className="text-[var(--color-text-muted)] cursor-help" />
                                    </Tooltip>
                                  </HStack>
                                  <HStack gap={2} align="center">
                                    <Checkbox
                                      checked={xForwardedPort}
                                      onChange={(e) => setXForwardedPort(e.target.checked)}
                                      label="X-Forwarded-Port"
                                    />
                                    <Tooltip content="Captures the original client port">
                                      <IconInfoCircle size={16} className="text-[var(--color-text-muted)] cursor-help" />
                                    </Tooltip>
                                  </HStack>
                                </VStack>
                              </FormField>

                              {/* Client data timeout */}
                              <FormField>
                                <FormField.Label>Client data timeout (ms)</FormField.Label>
                                <p className="text-[12px] text-[var(--color-text-subtle)] mb-2">
                                  Maximum time to wait for client request data.
                                </p>
                                <FormField.Control>
                                  <NumberInput
                                    value={clientDataTimeout}
                                    onChange={setClientDataTimeout}
                                    min={0}
                                    style={{ width: '200px' }}
                                  />
                                </FormField.Control>
                              </FormField>

                              {/* Member connect timeout */}
                              <FormField>
                                <FormField.Label>Member connect timeout (ms)</FormField.Label>
                                <p className="text-[12px] text-[var(--color-text-subtle)] mb-2">
                                  Maximum time to wait when establishing a connection to a backend member.
                                </p>
                                <FormField.Control>
                                  <NumberInput
                                    value={memberConnectTimeout}
                                    onChange={setMemberConnectTimeout}
                                    min={0}
                                    style={{ width: '200px' }}
                                  />
                                </FormField.Control>
                              </FormField>

                              {/* Member data timeout */}
                              <FormField>
                                <FormField.Label>Member data timeout (ms)</FormField.Label>
                                <p className="text-[12px] text-[var(--color-text-subtle)] mb-2">
                                  Maximum time to wait for response data from a backend member.
                                </p>
                                <FormField.Control>
                                  <NumberInput
                                    value={memberDataTimeout}
                                    onChange={setMemberDataTimeout}
                                    min={0}
                                    style={{ width: '200px' }}
                                  />
                                </FormField.Control>
                              </FormField>

                              {/* TCP Inspect Timeout */}
                              <FormField>
                                <FormField.Label>TCP Inspect Timeout (ms)</FormField.Label>
                                <p className="text-[12px] text-[var(--color-text-subtle)] mb-2">
                                  Timeout for TCP packet inspection or handshake. 0 disables this feature.
                                </p>
                                <FormField.Control>
                                  <NumberInput
                                    value={tcpInspectTimeout}
                                    onChange={setTcpInspectTimeout}
                                    min={0}
                                    style={{ width: '200px' }}
                                  />
                                </FormField.Control>
                              </FormField>

                              {/* Allowed CIDRs */}
                              <FormField>
                                <FormField.Label>Allowed CIDRs</FormField.Label>
                                <p className="text-[12px] text-[var(--color-text-subtle)] mb-2">
                                  Defines the client IP ranges allowed to access the listener.
                                </p>
                                <VStack gap={2} align="start">
                                  {allowedCidrs.map((cidr, index) => (
                                    <HStack key={index} gap={2} align="center">
                                      <Input
                                        value={cidr}
                                        onChange={(e) => {
                                          const newCidrs = [...allowedCidrs];
                                          newCidrs[index] = e.target.value;
                                          setAllowedCidrs(newCidrs);
                                        }}
                                        placeholder="e.g. 10.0.0.0/24"
                                        style={{ width: '200px' }}
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setAllowedCidrs(allowedCidrs.filter((_, i) => i !== index));
                                        }}
                                      >
                                        Remove
                                      </Button>
                                    </HStack>
                                  ))}
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    leftIcon={<IconPlus size={12} />}
                                    onClick={() => setAllowedCidrs([...allowedCidrs, ''])}
                                  >
                                    Add CIDR
                                  </Button>
                                </VStack>
                              </FormField>
                            </VStack>
                          </Disclosure.Panel>
                        </Disclosure>

                        {/* Next button */}
                        <div className="flex items-center justify-end w-full">
                          <Button 
                            variant="primary" 
                            onClick={() => goToNextSection('listener')}
                            disabled={!listenerName.trim() || !listenerProtocol || !protocolPort}
                          >
                            Next
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['listener'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow
                          label="Listener name"
                          value={listenerName}
                        />
                        <SectionCard.DataRow
                          label="Protocol / Port"
                          value={`${listenerProtocol} / ${protocolPort}`}
                        />
                        <SectionCard.DataRow
                          label="Connection limit"
                          value={connectionLimitType === 'unlimited' ? 'Unlimited' : String(connectionLimitValue)}
                        />
                        <SectionCard.DataRow
                          label="Admin state"
                          value={listenerAdminState ? 'Up' : 'Down'}
                        />
                      </SectionCard.Content>
                    )}
                  </SectionCard>

                  {/* Pool Section */}
                  <SectionCard isActive={activeSection === 'pool'}>
                    <SectionCard.Header
                      title={SECTION_LABELS['pool']}
                      showDivider={activeSection === 'pool'}
                      actions={
                        sectionStatus['pool'] === 'done' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconEdit size={12} />}
                            onClick={() => editSection('pool')}
                          >
                            Edit
                          </Button>
                        )
                      }
                    />
                    {activeSection === 'pool' && (
                      <SectionCard.Content gap={6}>
                        <p className="text-[12px] text-[var(--color-text-subtle)]">
                          Configure pool settings for the load balancer.
                        </p>
                        {/* Placeholder for pool configuration */}
                        <div className="flex items-center justify-end w-full">
                          <Button 
                            variant="primary" 
                            onClick={() => goToNextSection('pool')}
                          >
                            Next
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['pool'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow
                          label="Pool"
                          value="Configured"
                        />
                      </SectionCard.Content>
                    )}
                  </SectionCard>

                  {/* Member Section */}
                  <SectionCard isActive={activeSection === 'member'}>
                    <SectionCard.Header
                      title={SECTION_LABELS['member']}
                      showDivider={activeSection === 'member'}
                      actions={
                        sectionStatus['member'] === 'done' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconEdit size={12} />}
                            onClick={() => editSection('member')}
                          >
                            Edit
                          </Button>
                        )
                      }
                    />
                    {activeSection === 'member' && (
                      <SectionCard.Content gap={6}>
                        <p className="text-[12px] text-[var(--color-text-subtle)]">
                          Configure member settings for the load balancer.
                        </p>
                        {/* Placeholder for member configuration */}
                        <div className="flex items-center justify-end w-full">
                          <Button 
                            variant="primary" 
                            onClick={() => goToNextSection('member')}
                          >
                            Next
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['member'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow
                          label="Member"
                          value="Configured"
                        />
                      </SectionCard.Content>
                    )}
                  </SectionCard>

                  {/* Health Monitor Section */}
                  <SectionCard isActive={activeSection === 'health-monitor'}>
                    <SectionCard.Header
                      title={SECTION_LABELS['health-monitor']}
                      showDivider={activeSection === 'health-monitor'}
                      actions={
                        sectionStatus['health-monitor'] === 'done' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconEdit size={12} />}
                            onClick={() => editSection('health-monitor')}
                          >
                            Edit
                          </Button>
                        )
                      }
                    />
                    {activeSection === 'health-monitor' && (
                      <SectionCard.Content gap={6}>
                        <p className="text-[12px] text-[var(--color-text-subtle)]">
                          Configure health monitor settings for the load balancer.
                        </p>
                        {/* Placeholder for health monitor configuration */}
                        <div className="flex items-center justify-end w-full">
                          <Button 
                            variant="primary" 
                            onClick={() => goToNextSection('health-monitor')}
                          >
                            Next
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['health-monitor'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow
                          label="Health monitor"
                          value="Configured"
                        />
                      </SectionCard.Content>
                    )}
                  </SectionCard>
                </VStack>

                {/* Right Column - Summary Sidebar */}
                <SummarySidebar
                  sectionStatus={sectionStatus}
                  onCancel={() => navigate('/compute/load-balancers')}
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

