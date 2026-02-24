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
  PageShell,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useIsV2 } from '@/hooks/useIsV2';
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
          <Button variant="secondary" size="md" onClick={onCancel}>
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
  const isV2 = useIsV2();
  const { tabs, activeTabId, addTab, closeTab, selectTab } = useTabs();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Section status state
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    subnet: isV2 ? 'active' : 'pending',
  });

  // Form state - Basic Info
  const [networkName, setNetworkName] = useState('');
  const [description, setDescription] = useState('');
  const [adminState, setAdminState] = useState(true); // true = Up
  const [portSecurity, setPortSecurity] = useState(true); // true = On
  const [mtu, setMtu] = useState<number | undefined>(1500);

  // Validation errors
  const [networkNameError, setNetworkNameError] = useState<string | null>(null);
  const [cidrError, setCidrError] = useState<string | null>(null);

  // Form state - Subnet
  const [createSubnet, setCreateSubnet] = useState(isV2 ? true : false); // true = Yes
  const [subnetName, setSubnetName] = useState('');
  const [cidr, setCidr] = useState('');
  const [gateway, setGateway] = useState(isV2 ? true : false); // true = On
  const [gatewayIp, setGatewayIp] = useState('');
  const [dhcp, setDhcp] = useState(true); // true = On
  const [allocationPools, setAllocationPools] = useState('');
  const [hostRoutes, setHostRoutes] = useState('');

  // Disclosure state
  const [advancedOpen, setAdvancedOpen] = useState(isV2);
  const [descriptionOpen, setDescriptionOpen] = useState(isV2);
  const [subnetAdvancedOpen, setSubnetAdvancedOpen] = useState(isV2);

  // Check if create button should be disabled
  const isCreateDisabled = !isV2 && sectionStatus['subnet'] !== 'done';

  // TabBar tabs
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    icon: tab.icon,
  }));

  // Edit section handler
  const editSection = (section: SectionStep) => {
    if (isV2) return;
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
                { label: 'Networks', href: '/compute/networks' },
                { label: 'Create network' },
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
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create network</h1>
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
                    {/* Network name */}
                    <div className="py-6">
                      <FormField required error={!!networkNameError}>
                        <FormField.Label>Network name</FormField.Label>
                        <FormField.Control>
                          <VStack gap={2}>
                            <Input
                              placeholder="e.g. private-net"
                              value={networkName || '-'}
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
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    {/* Advanced (optional) */}
                    <div className="py-6">
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
                                Enhances security by allowing only permitted devices to access this
                                network. It is recommended to keep this enabled in most cases.
                              </span>
                              <Toggle
                                checked={portSecurity}
                                onChange={(e) => setPortSecurity(e.target.checked)}
                                label={portSecurity ? 'On' : 'Off'}
                              />
                            </VStack>

                            {/* MTU */}
                            <FormField>
                              <FormField.Label>MTU</FormField.Label>
                              <FormField.Description>
                                Specifies the maximum transmission unit (MTU) size for a network
                                packet. Leave blank to use the system default unless you have a
                                specific requirement.
                              </FormField.Description>
                              <FormField.Control>
                                <HStack gap={2} align="center">
                                  <NumberInput
                                    value={mtu}
                                    onChange={setMtu}
                                    min={68}
                                    max={9000}
                                    placeholder=""
                                    width="sm"
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    bytes
                                  </span>
                                </HStack>
                              </FormField.Control>
                              <FormField.HelperText>68 - 9000</FormField.HelperText>
                            </FormField>
                          </VStack>
                        </Disclosure.Panel>
                      </Disclosure>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    {/* Description (optional) */}
                    <div className="py-6">
                      <Disclosure open={descriptionOpen} onChange={setDescriptionOpen}>
                        <Disclosure.Trigger>Description (optional)</Disclosure.Trigger>
                        <Disclosure.Panel>
                          <div className="mt-4">
                            <Textarea
                              placeholder="e.g. Internal network for production DB servers of the payment service"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              rows={3}
                              fullWidth
                            />
                          </div>
                        </Disclosure.Panel>
                      </Disclosure>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    {/* Next Button */}
                    <HStack justify="end" className="pt-3">
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
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {!isV2 && sectionStatus['basic-info'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow label="Network name" value={networkName || '-'} />
                  <SectionCard.DataRow label="Admin state" value={adminState ? 'Up' : 'Down'} />
                  <SectionCard.DataRow label="Port security" value={portSecurity ? 'On' : 'Off'} />
                  {mtu && <SectionCard.DataRow label="MTU" value={`${mtu} bytes`} />}
                  {description && <SectionCard.DataRow label="Description" value={description} />}
                </SectionCard.Content>
              )}
            </SectionCard>
            {isV2 && (
              <SectionCard>
                <SectionCard.Header title={SECTION_LABELS['basic-info']} />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Network name" value={networkName || '-'} />
                  <SectionCard.DataRow label="Admin state" value={adminState ? 'Up' : 'Down'} />
                  <SectionCard.DataRow label="Port security" value={portSecurity ? 'On' : 'Off'} />
                  {mtu && <SectionCard.DataRow label="MTU" value={`${mtu} bytes`} />}
                  {description && <SectionCard.DataRow label="Description" value={description} />}
                </SectionCard.Content>
              </SectionCard>
            )}

            {/* Subnet Section */}
            <SectionCard isActive={!isV2 && sectionStatus['subnet'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['subnet']}
                showDivider={sectionStatus['subnet'] === 'done'}
                actions={
                  !isV2 &&
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
              {(isV2 || sectionStatus['subnet'] === 'active') && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    {/* Create subnet Toggle */}
                    <VStack gap={2} align="start" className="py-6">
                      <span className="text-label-lg text-[var(--color-text-default)]">
                        Create subnet
                      </span>
                      <Toggle
                        checked={createSubnet}
                        onChange={(e) => setCreateSubnet(e.target.checked)}
                        label={createSubnet ? 'Yes' : 'No'}
                      />
                    </VStack>

                    {(isV2 || createSubnet) && (
                      <>
                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                        {/* Subnet name (optional) */}
                        <div className="py-6">
                          <FormField>
                            <FormField.Label>Subnet name (optional)</FormField.Label>
                            <FormField.Control>
                              <Input
                                placeholder="e.g. private-net-subnet-001"
                                value={subnetName || '-'}
                                onChange={(e) => setSubnetName(e.target.value)}
                                fullWidth
                              />
                            </FormField.Control>
                            <FormField.HelperText>
                              Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
                            </FormField.HelperText>
                          </FormField>
                        </div>

                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                        {/* CIDR */}
                        <div className="py-6">
                          <FormField required error={!!cidrError}>
                            <FormField.Label>CIDR</FormField.Label>
                            <FormField.Control>
                              <Input
                                placeholder="e.g. 192.168.0.0/24"
                                value={cidr}
                                onChange={(e) => {
                                  setCidr(e.target.value);
                                  setCidrError(null);
                                }}
                                fullWidth
                              />
                            </FormField.Control>
                            <FormField.ErrorMessage>{cidrError}</FormField.ErrorMessage>
                            <FormField.HelperText>Prefix (/): 24~28</FormField.HelperText>
                          </FormField>
                        </div>

                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                        {/* Gateway */}
                        <div className="py-6">
                          <FormField>
                            <FormField.Label>Gateway</FormField.Label>
                            <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                              <VStack gap={3}>
                                <Toggle
                                  checked={gateway}
                                  onChange={(e) => setGateway(e.target.checked)}
                                  label={gateway ? 'On' : 'Off'}
                                />
                                {(isV2 || gateway) && (
                                  <Input
                                    placeholder="e.g. 192.168.0.1"
                                    value={gatewayIp}
                                    onChange={(e) => setGatewayIp(e.target.value)}
                                    fullWidth
                                  />
                                )}
                              </VStack>
                            </FormField.Control>
                            {(isV2 || gateway) && (
                              <FormField.HelperText>
                                Gateway must be an IP address within the subnet range, excluding the
                                network and broadcast addresses.
                              </FormField.HelperText>
                            )}
                          </FormField>
                        </div>

                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                        {/* Advanced (optional) */}
                        <div className="py-6">
                          <Disclosure open={subnetAdvancedOpen} onChange={setSubnetAdvancedOpen}>
                            <Disclosure.Trigger>Advanced (optional)</Disclosure.Trigger>
                            <Disclosure.Panel>
                              <VStack gap={6} align="stretch" className="mt-4">
                                {/* DHCP */}
                                <FormField>
                                  <FormField.Label>DHCP</FormField.Label>
                                  <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                                    <Toggle
                                      checked={dhcp}
                                      onChange={(e) => setDhcp(e.target.checked)}
                                      label={dhcp ? 'On' : 'Off'}
                                    />
                                  </FormField.Control>
                                </FormField>

                                {/* Allocation pools */}
                                <FormField>
                                  <FormField.Label>Allocation pools</FormField.Label>
                                  <FormField.Description>
                                    Manually define the range of IP addresses to be automatically
                                    allocated by DHCP. IPs outside this range will not be allocated,
                                    which is useful for reserving static IPs.
                                  </FormField.Description>
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
                                  <FormField.Description>
                                    An advanced feature for manually specifying a route to a
                                    specific network destination.
                                  </FormField.Description>
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
                        </div>
                      </>
                    )}

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    {/* Done Button */}
                    <HStack justify="end" className="pt-3">
                      <Button
                        variant="primary"
                        onClick={() => {
                          if (createSubnet && !cidr.trim()) {
                            setCidrError('Please enter a CIDR.');
                            return;
                          }
                          setCidrError(null);
                          setSectionStatus((prev) => ({
                            ...prev,
                            subnet: 'done',
                          }));
                        }}
                      >
                        Done
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {!isV2 && sectionStatus['subnet'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow label="Create subnet" value={createSubnet ? 'Yes' : 'No'} />
                  {createSubnet && subnetName && (
                    <SectionCard.DataRow label="Subnet name" value={subnetName || '-'} />
                  )}
                  {createSubnet && <SectionCard.DataRow label="CIDR" value={cidr} />}
                  {createSubnet && (
                    <SectionCard.DataRow
                      label="Gateway"
                      value={gateway ? gatewayIp || 'Auto' : 'Off'}
                    />
                  )}
                  {createSubnet && <SectionCard.DataRow label="DHCP" value={dhcp ? 'On' : 'Off'} />}
                </SectionCard.Content>
              )}
            </SectionCard>
            {isV2 && (
              <SectionCard>
                <SectionCard.Header title={SECTION_LABELS['subnet']} />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Create subnet" value={createSubnet ? 'Yes' : 'No'} />
                  {createSubnet && subnetName && (
                    <SectionCard.DataRow label="Subnet name" value={subnetName || '-'} />
                  )}
                  {createSubnet && <SectionCard.DataRow label="CIDR" value={cidr} />}
                  {createSubnet && (
                    <SectionCard.DataRow
                      label="Gateway"
                      value={gateway ? gatewayIp || 'Auto' : 'Off'}
                    />
                  )}
                  {createSubnet && <SectionCard.DataRow label="DHCP" value={dhcp ? 'On' : 'Off'} />}
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
