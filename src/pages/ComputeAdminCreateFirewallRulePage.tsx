import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Table,
  SearchInput,
  StatusIndicator,
  SelectionIndicator,
  Radio,
  RadioGroup,
  Select,
  type TableColumn,
  fixedColumns,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { IconBell, IconEdit, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

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
   Mock Tenant Data
   ---------------------------------------- */

interface Tenant {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'error' | 'building' | 'deactivated';
}

const mockTenants: Tenant[] = Array.from({ length: 115 }, (_, i) => ({
  id: `tenant-${String(i + 1).padStart(3, '0')}`,
  name: `tenant ${String.fromCharCode(65 + (i % 26))}`,
  description: i % 3 === 0 ? 'Production tenant' : '-',
  status: i === 4 ? 'deactivated' : ('active' as const),
}));

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

          {/* Firewall Rules Quota */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                Firewall rules
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

export default function ComputeAdminCreateFirewallRulePage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();

  // Section status state
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    configuration: 'pending',
  });

  // Form state - Basic Info
  const [ruleName, setRuleName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(true); // true = On
  const [shared, setShared] = useState(false); // false = No

  // Form state - Configuration
  const [protocol, setProtocol] = useState<string>('tcp');
  const [action, setAction] = useState<string>('allow');
  const [sourceIp, setSourceIp] = useState('');
  const [sourcePort, setSourcePort] = useState('');
  const [destinationIp, setDestinationIp] = useState('');
  const [destinationPort, setDestinationPort] = useState('');

  // Tenant search and pagination
  const [tenantSearch, setTenantSearch] = useState('');
  const [tenantPage, setTenantPage] = useState(1);
  const tenantsPerPage = 5;

  // Validation errors
  const [ruleNameError, setRuleNameError] = useState<string | null>(null);
  const [tenantError, setTenantError] = useState(false);

  // Filter tenants based on search
  const filteredTenants = useMemo(() => {
    if (!tenantSearch.trim()) return mockTenants;
    return mockTenants.filter(
      (t) =>
        t.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
        t.id.toLowerCase().includes(tenantSearch.toLowerCase())
    );
  }, [tenantSearch]);

  // Paginate tenants
  const totalTenantPages = Math.ceil(filteredTenants.length / tenantsPerPage);
  const paginatedTenants = useMemo(() => {
    const start = (tenantPage - 1) * tenantsPerPage;
    return filteredTenants.slice(start, start + tenantsPerPage);
  }, [filteredTenants, tenantPage]);

  // Tenant table columns with radio selection
  const tenantColumns: TableColumn<Tenant>[] = [
    {
      key: 'select',
      label: '',
      width: 40,
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            checked={selectedTenant === row.id}
            onChange={() => {
              setSelectedTenant(row.id);
              setTenantError(false);
            }}
            disabled={row.status === 'deactivated'}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (_, row) => <StatusIndicator status={row.status} layout="icon-only" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/tenants/${row.id}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 text-body-md leading-4"
            onClick={(e) => e.stopPropagation()}
            target="_blank"
          >
            {row.name}
          </Link>
          <span className="text-body-sm leading-4 text-[var(--color-text-muted)]">
            ID: {row.id}
          </span>
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
    navigate('/compute-admin/firewall');
  };

  // Handle create
  const handleCreate = () => {
    // In real app, this would call API
    console.log('Creating firewall rule:', {
      ruleName,
      description,
      ownedTenant: selectedTenant,
      enabled: enabled ? 'On' : 'Off',
      shared: shared ? 'Yes' : 'No',
      protocol,
      action,
      sourceIp,
      sourcePort,
      destinationIp,
      destinationPort,
    });
    navigate('/compute-admin/firewall');
  };

  // Get selected tenant name
  const selectedTenantName = useMemo(() => {
    if (!selectedTenant) return '-';
    const tenant = mockTenants.find((t) => t.id === selectedTenant);
    return tenant ? tenant.name : '-';
  }, [selectedTenant]);

  // Get selected tenant items for SelectionIndicator
  const selectedTenantItems = useMemo(() => {
    if (!selectedTenant) return [];
    const tenant = mockTenants.find((t) => t.id === selectedTenant);
    return tenant ? [{ id: tenant.id, label: tenant.name }] : [];
  }, [selectedTenant]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <PageShell
      sidebar={<ComputeAdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
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
                { label: 'Compute Admin', href: '/compute-admin' },
                { label: 'Firewall', href: '/compute-admin/firewall' },
                { label: 'Create rule' },
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
          <h1 className="text-heading-h4 text-[var(--color-text-default)]">Create rule</h1>
        </div>

        {/* Content Area */}
        <HStack gap={6} align="start" className="w-full">
          {/* Left Column - Form Sections */}
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

                    {/* Rule name */}
                    <VStack gap={3} align="stretch" className="py-6">
                      <div className="flex gap-[3px]">
                        <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                          Rule name
                        </span>
                        <span className="text-label-lg text-[var(--color-state-danger)] leading-[20px]">
                          *
                        </span>
                      </div>
                      <Input
                        placeholder="Enter rule name"
                        value={ruleName}
                        onChange={(e) => {
                          setRuleName(e.target.value);
                          setRuleNameError(null);
                        }}
                        fullWidth
                        error={!!ruleNameError}
                      />
                      {ruleNameError && (
                        <span className="text-body-sm leading-[var(--line-height-16)] text-[var(--color-state-danger)]">
                          {ruleNameError}
                        </span>
                      )}
                      <span className="text-body-sm text-[var(--color-text-subtle)] leading-[16px]">
                        You can use letters, numbers, and special characters (+=,.@-_), and the
                        length must be between 2-128 characters.
                      </span>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Description */}
                    <VStack gap={3} align="stretch" className="py-6">
                      <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                        Description
                      </span>
                      <Input
                        placeholder="Enter description "
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                      />
                      <span className="text-body-sm text-[var(--color-text-subtle)] leading-[16px]">
                        You can use letters, numbers, and special characters (+=,.@-_()[]), and
                        maximum 255 characters.
                      </span>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Owned tenant */}
                    <VStack gap={3} align="stretch" className="py-6">
                      <VStack gap={2} align="start">
                        <div className="flex gap-[3px]">
                          <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                            Owned tenant
                          </span>
                          <span className="text-label-lg text-[var(--color-state-danger)] leading-[20px]">
                            *
                          </span>
                        </div>
                        <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
                          Select the tenant that will own the rule.
                        </span>
                      </VStack>

                      {/* Tenant Search */}
                      <SearchInput
                        placeholder="Search tenants by attributes"
                        value={tenantSearch}
                        onChange={(e) => {
                          setTenantSearch(e.target.value);
                          setTenantPage(1);
                        }}
                        className="w-[280px]"
                      />

                      {/* Tenant Pagination */}
                      <div className="flex items-center gap-2">
                        <button
                          className="size-6 flex items-center justify-center disabled:opacity-40"
                          disabled={tenantPage === 1}
                          onClick={() => setTenantPage((p) => Math.max(1, p - 1))}
                        >
                          <IconChevronLeft size={16} stroke={1.5} />
                        </button>
                        {Array.from({ length: Math.min(5, totalTenantPages) }, (_, i) => i + 1).map(
                          (page) => (
                            <button
                              key={page}
                              className={`size-6 flex items-center justify-center rounded-md text-label-sm ${
                                page === tenantPage
                                  ? 'bg-[var(--color-action-primary)] text-white'
                                  : 'text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-subtle)]'
                              }`}
                              onClick={() => setTenantPage(page)}
                            >
                              {page}
                            </button>
                          )
                        )}
                        <button
                          className="size-6 flex items-center justify-center disabled:opacity-40"
                          disabled={tenantPage === totalTenantPages}
                          onClick={() => setTenantPage((p) => Math.min(totalTenantPages, p + 1))}
                        >
                          <IconChevronRight size={16} stroke={1.5} />
                        </button>
                        <div className="w-px h-4 bg-[var(--color-border-default)]" />
                        <span className="text-body-sm text-[var(--color-text-subtle)]">
                          {filteredTenants.length} items
                        </span>
                      </div>

                      {/* Tenant Table with Radio Selection */}
                      <VStack gap={2}>
                        <div className="w-full">
                          <Table
                            columns={tenantColumns}
                            data={paginatedTenants}
                            rowKey="id"
                            emptyMessage="No tenants found"
                            onRowClick={(row) => {
                              if (row.status !== 'deactivated') {
                                setSelectedTenant(row.id);
                                setTenantError(false);
                              }
                            }}
                          />
                        </div>
                        <SelectionIndicator
                          selectedItems={selectedTenantItems}
                          onRemove={() => setSelectedTenant(null)}
                          emptyText="No item selected"
                          error={tenantError}
                          errorMessage="Please select a tenant"
                        />
                      </VStack>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Enabled */}
                    <VStack gap={3} align="start" className="py-6">
                      <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                        Enabled
                      </span>
                      <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
                        Indicates whether the rule is enabled.
                      </span>
                      <Toggle
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        label={enabled ? 'On' : 'Off'}
                      />
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Shared */}
                    <VStack gap={3} align="start" className="py-6">
                      <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                        Shared
                      </span>
                      <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
                        Indicates whether the rule is shared with other tenants.
                      </span>
                      <Toggle
                        checked={shared}
                        onChange={(e) => setShared(e.target.checked)}
                        label={shared ? 'Yes' : 'No'}
                      />
                    </VStack>

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

                          if (!selectedTenant) {
                            setTenantError(true);
                            hasError = true;
                          } else {
                            setTenantError(false);
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
              {sectionStatus['basic-info'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow label="Rule name" value={ruleName || '-'} />
                  {description && <SectionCard.DataRow label="Description" value={description} />}
                  <SectionCard.DataRow label="Owned tenant" value={selectedTenantName} />
                  <SectionCard.DataRow label="Enabled" value={enabled ? 'On' : 'Off'} />
                  <SectionCard.DataRow label="Shared" value={shared ? 'Yes' : 'No'} />
                </SectionCard.Content>
              )}
            </SectionCard>

            {/* Configuration Section */}
            <SectionCard isActive={sectionStatus['configuration'] === 'active'}>
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
              {sectionStatus['configuration'] === 'active' && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Protocol */}
                    <VStack gap={3} align="stretch" className="py-6">
                      <div className="flex gap-[3px]">
                        <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                          Protocol
                        </span>
                        <span className="text-label-lg text-[var(--color-state-danger)] leading-[20px]">
                          *
                        </span>
                      </div>
                      <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
                        Select the protocol to which the rule applies.
                      </span>
                      <div>
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
                      </div>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Action */}
                    <VStack gap={3} align="stretch" className="py-6">
                      <div className="flex gap-[6px] items-center">
                        <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                          Action
                        </span>
                        <span className="text-label-lg text-[var(--color-state-danger)] leading-[20px]">
                          *
                        </span>
                      </div>
                      <span className="text-body-sm text-[var(--color-text-subtle)] leading-[16px]">
                        Choose whether to allow or deny the traffic.
                      </span>
                      <RadioGroup value={action} onChange={setAction} orientation="vertical">
                        <Radio value="allow" label="Allow" />
                        <Radio value="deny" label="Deny" />
                        <Radio value="reject" label="Reject" />
                      </RadioGroup>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Source CIDR */}
                    <VStack gap={3} align="stretch" className="py-6">
                      <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                        Source CIDR
                      </span>
                      <span className="text-body-sm text-[var(--color-text-subtle)] leading-[16px]">
                        Specifies the source network or IP address in CIDR format.
                      </span>
                      <Input
                        placeholder="e.g. 192.168.0.0/24"
                        value={sourceIp}
                        onChange={(e) => setSourceIp(e.target.value)}
                        fullWidth
                      />
                      <span className="text-body-sm text-[var(--color-text-subtle)] leading-[16px]">
                        Must be entered in CIDR format (IP/prefix).
                      </span>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Source Port */}
                    <VStack gap={3} align="stretch" className="py-6">
                      <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                        Source Port
                      </span>
                      <span className="text-body-sm text-[var(--color-text-subtle)] leading-[16px]">
                        Specifies the port range to which the rule applies.
                      </span>
                      <Input
                        placeholder="e.g. 80 or 80–443"
                        value={sourcePort}
                        onChange={(e) => setSourcePort(e.target.value)}
                        fullWidth
                      />
                      <span className="text-body-sm text-[var(--color-text-subtle)] leading-[16px]">
                        Must be a number between 1–65535 or a "start–end" range.
                      </span>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Destination CIDR */}
                    <VStack gap={3} align="stretch" className="py-6">
                      <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                        Destination CIDR
                      </span>
                      <span className="text-body-sm text-[var(--color-text-subtle)] leading-[16px]">
                        Specifies the destination network or IP address in CIDR format.
                      </span>
                      <Input
                        placeholder="e.g. 10.0.0.0/16"
                        value={destinationIp}
                        onChange={(e) => setDestinationIp(e.target.value)}
                        fullWidth
                      />
                      <span className="text-body-sm text-[var(--color-text-subtle)] leading-[16px]">
                        Must be entered in CIDR format (IP/prefix).
                      </span>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Destination Port */}
                    <VStack gap={3} align="stretch" className="py-6">
                      <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                        Destination Port
                      </span>
                      <span className="text-body-sm text-[var(--color-text-subtle)] leading-[16px]">
                        Defines the network address (CIDR) for the subnet.
                      </span>
                      <Input
                        placeholder="e.g. 443 or 3000–4000"
                        value={destinationPort}
                        onChange={(e) => setDestinationPort(e.target.value)}
                        fullWidth
                      />
                      <span className="text-body-sm text-[var(--color-text-subtle)] leading-[16px]">
                        Must be a number between 1–65535 or a "start–end" range.
                      </span>
                    </VStack>

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
              {sectionStatus['configuration'] === 'done' && (
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
