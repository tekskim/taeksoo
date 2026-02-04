import { useState } from 'react';
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
  Textarea,
  SectionCard,
  FormField,
  WizardSummary,
  Toggle,
  NumberInput,
  Disclosure,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { IconBell, IconEdit } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'subnet';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  subnet: 'Subnet',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'subnet'];

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
        <HStack gap={2}>
          <Button variant="outline" onClick={onCancel}>
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

export default function CreateNetworkPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, addTab, closeTab, selectTab } = useTabs();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();

  // Section status state
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    subnet: 'pending',
  });

  // Form state - Basic Info
  const [networkName, setNetworkName] = useState('');
  const [description, setDescription] = useState('');
  const [adminState, setAdminState] = useState(true); // true = Up
  const [portSecurity, setPortSecurity] = useState(true); // true = On
  const [mtu, setMtu] = useState<number | undefined>(undefined);

  // Validation errors
  const [networkNameError, setNetworkNameError] = useState<string | null>(null);
  const [cidrError, setCidrError] = useState<string | null>(null);

  // Form state - Subnet
  const [createSubnet, setCreateSubnet] = useState(true); // true = Yes
  const [subnetName, setSubnetName] = useState('');
  const [cidr, setCidr] = useState('');
  const [gateway, setGateway] = useState(true); // true = On
  const [gatewayIp, setGatewayIp] = useState('');
  const [dhcp, setDhcp] = useState(true); // true = On
  const [allocationPools, setAllocationPools] = useState('');
  const [hostRoutes, setHostRoutes] = useState('');

  // Disclosure state
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [subnetAdvancedOpen, setSubnetAdvancedOpen] = useState(false);

  // Check if create button should be disabled
  const isCreateDisabled = sectionStatus['subnet'] !== 'done';

  // TabBar tabs
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    icon: tab.icon,
  }));

  // Edit section handler
  const editSection = (section: SectionStep) => {
    setSectionStatus((prev) => ({
      ...prev,
      [section]: 'active',
    }));
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/compute/networks');
  };

  // Handle create
  const handleCreate = () => {
    // In real app, this would call API
    console.log('Creating network:', {
      networkName,
      description,
      adminState: adminState ? 'Up' : 'Down',
      portSecurity: portSecurity ? 'On' : 'Off',
      mtu,
      subnet: createSubnet
        ? {
            subnetName,
            cidr,
            gateway: gateway ? gatewayIp : null,
            dhcp,
            allocationPools,
            hostRoutes,
          }
        : null,
    });
    navigate('/compute/networks');
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: sidebarOpen ? 'var(--layout-sidebar-width)' : '0px' }}
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
                  { label: 'Networks', href: '/compute/networks' },
                  { label: 'Create network' },
                ]}
              />
            }
            actions={
              <>
                <TopBarAction
                  icon={<IconBell size={18} />}
                  onClick={() => {}}
                  aria-label="Notifications"
                />
              </>
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={3} className="min-w-[1176px]">
              {/* Page Title */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create network</h1>
              </div>

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
                        {/* Network name */}
                        <FormField required error={!!networkNameError}>
                          <FormField.Label>Network name</FormField.Label>
                          <FormField.Control>
                            <VStack gap={1}>
                              <Input
                                placeholder="e.g. private-net"
                                value={networkName}
                                onChange={(e) => {
                                  setNetworkName(e.target.value);
                                  setNetworkNameError(null);
                                }}
                                fullWidth
                                error={!!networkNameError}
                              />
                              {networkNameError && (
                                <span className="text-body-sm text-[var(--color-state-danger)]">
                                  {networkNameError}
                                </span>
                              )}
                            </VStack>
                          </FormField.Control>
                          <FormField.HelperText>
                            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
                          </FormField.HelperText>
                        </FormField>

                        {/* Advanced (optional) */}
                        <Disclosure open={advancedOpen} onChange={setAdvancedOpen}>
                          <Disclosure.Trigger>Advanced (optional)</Disclosure.Trigger>
                          <Disclosure.Panel>
                            <VStack gap={6} align="stretch" className="mt-4">
                              {/* Admin state */}
                              <VStack gap={2} align="start">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Admin state
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Setting it to "Down" disables all related network or control
                                  operations, regardless of runtime status.
                                </span>
                                <Toggle
                                  checked={adminState}
                                  onChange={(e) => setAdminState(e.target.checked)}
                                  label={adminState ? 'Up' : 'Down'}
                                />
                              </VStack>

                              {/* Port security */}
                              <VStack gap={2} align="start">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Port security
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Enhances security by allowing only permitted devices to access
                                  this network. It is recommended to keep this enabled in most
                                  cases.
                                </span>
                                <Toggle
                                  checked={portSecurity}
                                  onChange={(e) => setPortSecurity(e.target.checked)}
                                  label={portSecurity ? 'On' : 'Off'}
                                />
                              </VStack>

                              {/* MTU */}
                              <VStack gap={2} align="start">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  MTU
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Specifies the maximum transmission unit (MTU) size for a network
                                  packet. Leave blank to use the system default unless you have a
                                  specific requirement.
                                </span>
                                <div className="flex items-center gap-2">
                                  <div>
                                    <NumberInput
                                      value={mtu}
                                      onChange={setMtu}
                                      min={68}
                                      max={9000}
                                      placeholder=""
                                      width="sm"
                                    />
                                  </div>
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    bytes
                                  </span>
                                </div>
                                <span className="text-body-sm text-[var(--color-text-subtle)]">
                                  68 - 9000
                                </span>
                              </VStack>
                            </VStack>
                          </Disclosure.Panel>
                        </Disclosure>

                        {/* Description (optional) */}
                        <Disclosure open={descriptionOpen} onChange={setDescriptionOpen}>
                          <Disclosure.Trigger>Description (optional)</Disclosure.Trigger>
                          <Disclosure.Panel>
                            <FormField className="mt-4">
                              <FormField.Control>
                                <Textarea
                                  placeholder="e.g. Internal network for production DB servers of the payment service"
                                  value={description}
                                  onChange={(e) => setDescription(e.target.value)}
                                  rows={3}
                                  fullWidth
                                />
                              </FormField.Control>
                            </FormField>
                          </Disclosure.Panel>
                        </Disclosure>

                        {/* Next Button */}
                        <div className="flex items-center justify-end w-full">
                          <Button
                            variant="primary"
                            onClick={() => {
                              if (!networkName.trim()) {
                                setNetworkNameError('Please enter a network name.');
                                return;
                              }
                              setNetworkNameError(null);
                              setSectionStatus((prev) => ({
                                ...prev,
                                'basic-info': 'done',
                                subnet: 'active',
                              }));
                            }}
                          >
                            Next
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['basic-info'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Network name" value={networkName} showDivider />
                        <SectionCard.DataRow
                          label="Admin state"
                          value={adminState ? 'Up' : 'Down'}
                          showDivider
                        />
                        <SectionCard.DataRow
                          label="Port security"
                          value={portSecurity ? 'On' : 'Off'}
                          showDivider
                        />
                        {mtu && (
                          <SectionCard.DataRow label="MTU" value={`${mtu} bytes`} showDivider />
                        )}
                        {description && (
                          <SectionCard.DataRow label="Description" value={description} />
                        )}
                      </SectionCard.Content>
                    )}
                  </SectionCard>

                  {/* Subnet Section */}
                  <SectionCard isActive={sectionStatus['subnet'] === 'active'}>
                    <SectionCard.Header
                      title={SECTION_LABELS['subnet']}
                      showDivider={sectionStatus['subnet'] === 'active'}
                      actions={
                        sectionStatus['subnet'] === 'done' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconEdit size={12} />}
                            onClick={() => editSection('subnet')}
                          >
                            Edit
                          </Button>
                        )
                      }
                    />
                    {sectionStatus['subnet'] === 'active' && (
                      <SectionCard.Content gap={6}>
                        {/* Create subnet Toggle */}
                        <VStack gap={2} align="start">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Create subnet
                          </span>
                          <Toggle
                            checked={createSubnet}
                            onChange={(e) => setCreateSubnet(e.target.checked)}
                            label={createSubnet ? 'Yes' : 'No'}
                          />
                        </VStack>

                        {createSubnet && (
                          <>
                            {/* Subnet name (optional) */}
                            <FormField>
                              <FormField.Label>Subnet name (optional)</FormField.Label>
                              <FormField.Control>
                                <Input
                                  placeholder="e.g. private-net-subnet-001"
                                  value={subnetName}
                                  onChange={(e) => setSubnetName(e.target.value)}
                                  fullWidth
                                />
                              </FormField.Control>
                              <FormField.HelperText>
                                Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()",
                                "[]"
                              </FormField.HelperText>
                            </FormField>

                            {/* CIDR */}
                            <FormField required>
                              <FormField.Label>CIDR</FormField.Label>
                              <FormField.Control>
                                <Input
                                  placeholder="e.g. 192.168.0.0/24"
                                  value={cidr}
                                  onChange={(e) => setCidr(e.target.value)}
                                  fullWidth
                                />
                              </FormField.Control>
                              <FormField.HelperText>Prefix (/): 24~28</FormField.HelperText>
                            </FormField>

                            {/* Gateway */}
                            <VStack gap={2} align="start">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Gateway
                              </span>
                              <Toggle
                                checked={gateway}
                                onChange={(e) => setGateway(e.target.checked)}
                                label={gateway ? 'On' : 'Off'}
                              />
                            </VStack>

                            {gateway && (
                              <FormField>
                                <FormField.Control>
                                  <Input
                                    placeholder="e.g. 192.168.0.1"
                                    value={gatewayIp}
                                    onChange={(e) => setGatewayIp(e.target.value)}
                                    fullWidth
                                  />
                                </FormField.Control>
                                <FormField.HelperText>
                                  Gateway must be an IP address within the subnet range, excluding
                                  the network and broadcast addresses.
                                </FormField.HelperText>
                              </FormField>
                            )}

                            {/* Advanced (optional) */}
                            <Disclosure open={subnetAdvancedOpen} onChange={setSubnetAdvancedOpen}>
                              <Disclosure.Trigger>Advanced (optional)</Disclosure.Trigger>
                              <Disclosure.Panel>
                                <VStack gap={6} align="stretch" className="mt-4">
                                  {/* DHCP */}
                                  <VStack gap={2} align="start">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      DHCP
                                    </span>
                                    <Toggle
                                      checked={dhcp}
                                      onChange={(e) => setDhcp(e.target.checked)}
                                      label={dhcp ? 'On' : 'Off'}
                                    />
                                  </VStack>

                                  {/* Allocation pools */}
                                  <FormField>
                                    <FormField.Label>Allocation pools</FormField.Label>
                                    <span className="text-body-md text-[var(--color-text-subtle)]">
                                      Manually define the range of IP addresses to be automatically
                                      allocated by DHCP. IPs outside this range will not be
                                      allocated, which is useful for reserving static IPs.
                                    </span>
                                    <FormField.Control>
                                      <Textarea
                                        placeholder="e.g. 192.168.0.100,192.168.0.200"
                                        value={allocationPools}
                                        onChange={(e) => setAllocationPools(e.target.value)}
                                        rows={3}
                                        fullWidth
                                      />
                                    </FormField.Control>
                                    <FormField.HelperText>
                                      Enter one IP address allocation range per line.
                                    </FormField.HelperText>
                                  </FormField>

                                  {/* Host routes */}
                                  <FormField>
                                    <FormField.Label>Host routes</FormField.Label>
                                    <span className="text-body-md text-[var(--color-text-subtle)]">
                                      An advanced feature for manually specifying a route to a
                                      specific network destination.
                                    </span>
                                    <FormField.Control>
                                      <Textarea
                                        placeholder="e.g. 10.10.0.0/24,192.168.0.254"
                                        value={hostRoutes}
                                        onChange={(e) => setHostRoutes(e.target.value)}
                                        rows={3}
                                        fullWidth
                                      />
                                    </FormField.Control>
                                    <FormField.HelperText>
                                      Enter the destination CIDR and the next hop IP address.
                                    </FormField.HelperText>
                                  </FormField>
                                </VStack>
                              </Disclosure.Panel>
                            </Disclosure>
                          </>
                        )}

                        {/* Done Button */}
                        <div className="flex items-center justify-end w-full">
                          <Button
                            variant="primary"
                            onClick={() => {
                              setSectionStatus((prev) => ({
                                ...prev,
                                subnet: 'done',
                              }));
                            }}
                            disabled={createSubnet && !cidr.trim()}
                          >
                            Done
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['subnet'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow
                          label="Create subnet"
                          value={createSubnet ? 'Yes' : 'No'}
                          showDivider
                        />
                        {createSubnet && (
                          <>
                            {subnetName && (
                              <SectionCard.DataRow
                                label="Subnet name"
                                value={subnetName}
                                showDivider
                              />
                            )}
                            <SectionCard.DataRow label="CIDR" value={cidr} showDivider />
                            <SectionCard.DataRow
                              label="Gateway"
                              value={gateway ? gatewayIp || 'Auto' : 'Off'}
                              showDivider
                            />
                            <SectionCard.DataRow label="DHCP" value={dhcp ? 'On' : 'Off'} />
                          </>
                        )}
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
