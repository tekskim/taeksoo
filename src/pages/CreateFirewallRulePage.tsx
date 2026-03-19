import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsV2 } from '@/hooks/useIsV2';
import {
  PageShell,
  Button,
  Breadcrumb,
  VStack,
  HStack,
  TabBar,
  TopBar,
  TopBarAction,
  Input,
  SectionCard,
  WizardSummary,
  Toggle,
  Select,
  FormField,
  Radio,
  RadioGroup,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { IconBell, IconEdit } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'configuration';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  configuration: 'Configuration',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'configuration'];

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

        {/* Quota Section */}
        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-lg p-4 flex flex-col gap-4">
          <h5 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">Quota</h5>

          {/* NACL Rules Quota */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                NACL rules
              </span>
              <span className="text-body-md leading-4 text-[var(--color-text-default)]">2/10</span>
            </div>
            <div className="flex h-1 w-full items-start isolate pr-1">
              <div
                className="bg-[var(--color-state-success)] h-1 rounded-lg shrink-0 -mr-1 z-[3]"
                style={{ width: '20%' }}
              />
              <div
                className="bg-[#bbf7d0] h-1 rounded-lg shrink-0 -mr-1 z-[2]"
                style={{ width: '10%' }}
              />
              <div className="bg-[var(--color-border-subtle)] flex-1 h-1 rounded-lg -mr-1 z-[1]" />
            </div>
          </div>
        </div>

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

export default function CreateFirewallRulePage() {
  const navigate = useNavigate();
  const isV2 = useIsV2();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();

  // Section status state
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    configuration: isV2 ? 'active' : 'pending',
  });

  // Form state - Basic Info
  const [ruleName, setRuleName] = useState('');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(true); // true = On
  const [shared, setShared] = useState(false); // false = No

  // Form state - Configuration
  const [protocol, setProtocol] = useState<string>('tcp');
  const [action, setAction] = useState<string>('allow');
  const [sourceIp, setSourceIp] = useState('');
  const [sourcePort, setSourcePort] = useState('');
  const [destinationIp, setDestinationIp] = useState('');
  const [destinationPort, setDestinationPort] = useState('');

  // Validation errors
  const [ruleNameError, setRuleNameError] = useState<string | null>(null);

  // Check if create button should be disabled
  const isCreateDisabled = sectionStatus['configuration'] !== 'done';

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
    navigate('/compute/firewall');
  };

  // Handle create
  const handleCreate = () => {
    // In real app, this would call API
    console.log('Creating NACL rule:', {
      ruleName,
      description,
      enabled: enabled ? 'On' : 'Off',
      shared: shared ? 'Yes' : 'No',
      protocol,
      action,
      sourceIp,
      sourcePort,
      destinationIp,
      destinationPort,
    });
    navigate('/compute/firewall');
  };

  const sidebarWidth = sidebarOpen ? 200 : 0;

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
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
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
                { label: 'NACL', href: '/compute/firewall' },
                { label: 'Create NACL rule' },
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
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3} className="min-w-[1176px]">
        {/* Page Title */}
        <div className="flex items-center justify-between h-8">
          <h1 className="text-heading-h4 text-[var(--color-text-default)]">Create NACL rule</h1>
        </div>

        {/* Content Area */}
        <HStack gap={6} align="start" className="w-full">
          {/* Left Column - Form Sections */}
          <VStack gap={4} className="flex-1">
            {/* Basic information Section */}
            <SectionCard isActive={isV2 || sectionStatus['basic-info'] === 'active'}>
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
              {(isV2 || sectionStatus['basic-info'] === 'active') && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Rule name */}
                    <div className="py-6">
                      <FormField required error={!!ruleNameError}>
                        <FormField.Label>Rule name</FormField.Label>
                        <FormField.Control>
                          <Input
                            placeholder="Enter rule name"
                            value={ruleName}
                            onChange={(e) => {
                              setRuleName(e.target.value);
                              setRuleNameError(null);
                            }}
                            fullWidth
                          />
                        </FormField.Control>
                        <FormField.HelperText>
                          You can use letters, numbers, and special characters (+=,.@-_), and the
                          length must be between 2-128 characters.
                        </FormField.HelperText>
                        <FormField.ErrorMessage>{ruleNameError}</FormField.ErrorMessage>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Description */}
                    <div className="py-6">
                      <FormField>
                        <FormField.Label>Description</FormField.Label>
                        <FormField.Control>
                          <Input
                            placeholder="Enter description "
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

                    {/* Enabled */}
                    <div className="py-6">
                      <FormField>
                        <FormField.Label>Enabled</FormField.Label>
                        <FormField.Description>
                          Indicates whether the rule is enabled.
                        </FormField.Description>
                        <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                          <Toggle
                            checked={enabled}
                            onChange={(e) => setEnabled(e.target.checked)}
                            label={enabled ? 'On' : 'Off'}
                          />
                        </FormField.Control>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Shared */}
                    <div className="py-6">
                      <FormField>
                        <FormField.Label>Shared</FormField.Label>
                        <FormField.Description>
                          Indicates whether the rule is shared with other tenants.
                        </FormField.Description>
                        <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                          <Toggle
                            checked={shared}
                            onChange={(e) => setShared(e.target.checked)}
                            label={shared ? 'Yes' : 'No'}
                          />
                        </FormField.Control>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Next Button */}
                    <HStack justify="end" className="pt-3">
                      <Button
                        variant="primary"
                        onClick={() => {
                          // Validate required fields
                          let hasError = false;

                          if (!ruleName.trim()) {
                            setRuleNameError('Please enter a rule name.');
                            hasError = true;
                          } else {
                            setRuleNameError(null);
                          }

                          // Only proceed to next section if no errors
                          if (!hasError) {
                            setSectionStatus((prev) => ({
                              ...prev,
                              'basic-info': 'done',
                              configuration: 'active',
                            }));
                          }
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
                  <SectionCard.DataRow label="Rule name" value={ruleName || '-'} />
                  {description && <SectionCard.DataRow label="Description" value={description} />}
                  <SectionCard.DataRow label="Enabled" value={enabled ? 'On' : 'Off'} />
                  <SectionCard.DataRow label="Shared" value={shared ? 'Yes' : 'No'} />
                </SectionCard.Content>
              )}
            </SectionCard>

            {isV2 && (
              <SectionCard>
                <SectionCard.Header title={SECTION_LABELS['basic-info']} />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Rule name" value={ruleName || '-'} />
                  {description && <SectionCard.DataRow label="Description" value={description} />}
                  <SectionCard.DataRow label="Enabled" value={enabled ? 'On' : 'Off'} />
                  <SectionCard.DataRow label="Shared" value={shared ? 'Yes' : 'No'} />
                </SectionCard.Content>
              </SectionCard>
            )}

            {/* Configuration Section */}
            <SectionCard isActive={isV2 || sectionStatus['configuration'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['configuration']}
                showDivider={sectionStatus['configuration'] === 'done'}
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
              {(isV2 || sectionStatus['configuration'] === 'active') && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Protocol */}
                    <div className="py-6">
                      <FormField required>
                        <FormField.Label>Protocol</FormField.Label>
                        <FormField.Description>
                          Select the protocol to which the rule applies.
                        </FormField.Description>
                        <FormField.Control>
                          <Select
                            options={[
                              { value: 'tcp', label: 'TCP' },
                              { value: 'udp', label: 'UDP' },
                              { value: 'icmp', label: 'ICMP' },
                              { value: 'any', label: 'Any' },
                            ]}
                            value={protocol}
                            onChange={setProtocol}
                            placeholder="Select a protocol"
                            fullWidth
                          />
                        </FormField.Control>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Action */}
                    <div className="py-6">
                      <FormField required>
                        <FormField.Label>Action</FormField.Label>
                        <FormField.Description>
                          Choose whether to allow or deny the traffic.
                        </FormField.Description>
                        <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                          <RadioGroup value={action} onChange={setAction} orientation="vertical">
                            <Radio value="allow" label="Allow" />
                            <Radio value="deny" label="Deny" />
                            <Radio value="reject" label="Reject" />
                          </RadioGroup>
                        </FormField.Control>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Source CIDR */}
                    <div className="py-6">
                      <FormField>
                        <FormField.Label>Source CIDR</FormField.Label>
                        <FormField.Description>
                          Specifies the source network or IP address in CIDR format.
                        </FormField.Description>
                        <FormField.Control>
                          <Input
                            placeholder="e.g. 192.168.0.0/24"
                            value={sourceIp}
                            onChange={(e) => setSourceIp(e.target.value)}
                            fullWidth
                          />
                        </FormField.Control>
                        <FormField.HelperText>
                          Must be entered in CIDR format (IP/prefix).
                        </FormField.HelperText>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Source Port */}
                    <div className="py-6">
                      <FormField>
                        <FormField.Label>Source Port</FormField.Label>
                        <FormField.Description>
                          Specifies the port range to which the rule applies.
                        </FormField.Description>
                        <FormField.Control>
                          <Input
                            placeholder="e.g. 80 or 80–443"
                            value={sourcePort}
                            onChange={(e) => setSourcePort(e.target.value)}
                            fullWidth
                          />
                        </FormField.Control>
                        <FormField.HelperText>
                          Must be a number between 1–65535 or a "start–end" range.
                        </FormField.HelperText>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Destination CIDR */}
                    <div className="py-6">
                      <FormField>
                        <FormField.Label>Destination CIDR</FormField.Label>
                        <FormField.Description>
                          Specifies the destination network or IP address in CIDR format.
                        </FormField.Description>
                        <FormField.Control>
                          <Input
                            placeholder="e.g. 10.0.0.0/16"
                            value={destinationIp}
                            onChange={(e) => setDestinationIp(e.target.value)}
                            fullWidth
                          />
                        </FormField.Control>
                        <FormField.HelperText>
                          Must be entered in CIDR format (IP/prefix).
                        </FormField.HelperText>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Destination Port */}
                    <div className="py-6">
                      <FormField>
                        <FormField.Label>Destination Port</FormField.Label>
                        <FormField.Description>
                          Defines the network address (CIDR) for the subnet.
                        </FormField.Description>
                        <FormField.Control>
                          <Input
                            placeholder="e.g. 443 or 3000–4000"
                            value={destinationPort}
                            onChange={(e) => setDestinationPort(e.target.value)}
                            fullWidth
                          />
                        </FormField.Control>
                        <FormField.HelperText>
                          Must be a number between 1–65535 or a "start–end" range.
                        </FormField.HelperText>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Next Button */}
                    <HStack justify="end" className="pt-3">
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
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {!isV2 && sectionStatus['configuration'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow label="Protocol" value={protocol.toUpperCase() || '-'} />
                  <SectionCard.DataRow
                    label="Action"
                    value={action.charAt(0).toUpperCase() + action.slice(1) || '-'}
                  />
                  <SectionCard.DataRow label="Source CIDR" value={sourceIp || '-'} />
                  <SectionCard.DataRow label="Source port" value={sourcePort || '-'} />
                  <SectionCard.DataRow label="Destination CIDR" value={destinationIp || '-'} />
                  <SectionCard.DataRow label="Destination port" value={destinationPort || '-'} />
                </SectionCard.Content>
              )}
            </SectionCard>

            {isV2 && (
              <SectionCard>
                <SectionCard.Header title={SECTION_LABELS['configuration']} />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Protocol" value={protocol.toUpperCase() || '-'} />
                  <SectionCard.DataRow
                    label="Action"
                    value={action.charAt(0).toUpperCase() + action.slice(1) || '-'}
                  />
                  <SectionCard.DataRow label="Source CIDR" value={sourceIp || '-'} />
                  <SectionCard.DataRow label="Source port" value={sourcePort || '-'} />
                  <SectionCard.DataRow label="Destination CIDR" value={destinationIp || '-'} />
                  <SectionCard.DataRow label="Destination port" value={destinationPort || '-'} />
                </SectionCard.Content>
              </SectionCard>
            )}

            {isV2 && (
              <HStack justify="end" gap={2} className="pt-4">
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleCreate}>
                  Create
                </Button>
              </HStack>
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
