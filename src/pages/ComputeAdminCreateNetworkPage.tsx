import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

type SectionStep = 'basic-info' | 'subnet';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  subnet: 'Subnet',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'subnet'];

/* ----------------------------------------
   Mock Tenant Data
   ---------------------------------------- */

interface Tenant {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'error' | 'building';
}

const mockTenants: Tenant[] = Array.from({ length: 115 }, (_, i) => ({
  id: `tenant-${String(i + 1).padStart(3, '0')}`,
  name: `tenant ${String.fromCharCode(65 + (i % 26))}`,
  description: i % 3 === 0 ? 'Production tenant' : '-',
  status: 'active' as const,
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
          <h5 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
            Quota
          </h5>

          {/* Network Quota */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                Network
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

          {/* Subnet Quota */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                Subnet
              </span>
              <span className="text-body-md leading-4 text-[var(--color-text-default)]">5/20</span>
            </div>
            <div className="flex h-1 w-full items-start isolate pr-1">
              <div
                className="bg-[var(--color-state-success)] h-1 rounded-lg shrink-0 -mr-1 z-[3]"
                style={{ width: '25%' }}
              />
              <div
                className="bg-[#bbf7d0] h-1 rounded-lg shrink-0 -mr-1 z-[2]"
                style={{ width: '5%' }}
              />
              <div className="bg-[var(--color-border-subtle)] flex-1 h-1 rounded-lg -mr-1 z-[1]" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <HStack gap={2}>
          <Button variant="outline" onClick={onCancel} className="w-[80px]">
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
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [externalNetwork, setExternalNetwork] = useState(false); // false = No
  const [providerNetworkType, setProviderNetworkType] = useState<'vlan' | 'flat'>('vlan');
  const [segmentationId, setSegmentationId] = useState<string>('');
  const [mtu, setMtu] = useState<number | undefined>(undefined);
  const [adminState, setAdminState] = useState(true); // true = Up
  const [portSecurity, setPortSecurity] = useState(true); // true = On
  const [shared, setShared] = useState(true); // true = Yes

  // Tenant search and pagination
  const [tenantSearch, setTenantSearch] = useState('');
  const [tenantPage, setTenantPage] = useState(1);
  const tenantsPerPage = 5;

  // Validation errors
  const [networkNameError, setNetworkNameError] = useState<string | null>(null);
  const [tenantError, setTenantError] = useState(false);
  const [cidrError, setCidrError] = useState<string | null>(null);

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

  // Tenant table columns
  const tenantColumns: TableColumn<Tenant>[] = [
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
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/tenants/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 text-body-md leading-4"
            onClick={(e) => e.stopPropagation()}
            target="_blank"
          >
            {row.name}
          </Link>
          <span className="text-body-sm leading-4 text-[var(--color-text-muted)]">ID: {row.id}</span>
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

  // Get selected tenant items for SelectionIndicator
  const selectedTenantItems = useMemo(() => {
    return selectedTenants
      .map((id) => {
        const tenant = mockTenants.find((t) => t.id === id);
        return tenant ? { id: tenant.id, label: tenant.name } : null;
      })
      .filter((item): item is { id: string; label: string } => item !== null);
  }, [selectedTenants]);

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
    navigate('/compute-admin/networks');
  };

  // Handle create
  const handleCreate = () => {
    // In real app, this would call API
    console.log('Creating network:', {
      networkName,
      description,
      ownedTenants: selectedTenants,
      externalNetwork: externalNetwork ? 'Yes' : 'No',
      ...(externalNetwork && {
        providerNetworkType: providerNetworkType.toUpperCase(),
        segmentationId,
      }),
      mtu,
      adminState: adminState ? 'Up' : 'Down',
      portSecurity: portSecurity ? 'On' : 'Off',
      shared: shared ? 'Yes' : 'No',
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
    navigate('/compute-admin/networks');
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

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
                  { label: 'Compute Admin', href: '/compute-admin' },
                  { label: 'Networks', href: '/compute-admin/networks' },
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
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">
                  Create network
                </h1>
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
                            <Input
                              placeholder="Enter network name"
                              value={networkName}
                              onChange={(e) => {
                                setNetworkName(e.target.value);
                                setNetworkNameError(null);
                              }}
                              fullWidth
                              error={!!networkNameError}
                            />
                          </FormField.Control>
                          <FormField.ErrorMessage>{networkNameError}</FormField.ErrorMessage>
                          <FormField.HelperText>
                            You can use letters, numbers, and special characters (+=,.@-_), and the
                            length must be between 2-128 characters.
                          </FormField.HelperText>
                        </FormField>

                        {/* Description */}
                        <VStack gap={2} align="stretch">
                          <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                            Description
                          </span>
                          <Input
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                          />
                          <span className="text-body-sm text-[var(--color-text-subtle)] leading-[16px]">
                            You can use letters, numbers, and special characters (+=,.@-_()[]), and
                            maximum 255 characters.
                          </span>
                        </VStack>

                        {/* Owned tenant */}
                        <VStack gap={4} align="stretch">
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
                              Select the tenant that will own the network.
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
                            {Array.from(
                              { length: Math.min(5, totalTenantPages) },
                              (_, i) => i + 1
                            ).map((page) => (
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
                            ))}
                            <button
                              className="size-6 flex items-center justify-center disabled:opacity-40"
                              disabled={tenantPage === totalTenantPages}
                              onClick={() =>
                                setTenantPage((p) => Math.min(totalTenantPages, p + 1))
                              }
                            >
                              <IconChevronRight size={16} stroke={1.5} />
                            </button>
                            <div className="w-px h-4 bg-[var(--color-border-default)]" />
                            <span className="text-body-sm text-[var(--color-text-subtle)]">
                              {selectedTenants.length > 0
                                ? `${selectedTenants.length} selected`
                                : `${filteredTenants.length} items`}
                            </span>
                          </div>

                          {/* Tenant Table */}
                          <Table
                            columns={tenantColumns}
                            data={paginatedTenants}
                            rowKey="id"
                            selectable
                            selectedKeys={selectedTenants}
                            onSelectionChange={(keys) => {
                              setSelectedTenants(keys);
                              if (keys.length > 0) setTenantError(false);
                            }}
                            emptyMessage="No tenants found"
                          />

                          {/* Selected tenant display */}
                          <SelectionIndicator
                            selectedItems={selectedTenantItems}
                            onRemove={(id) =>
                              setSelectedTenants((prev) => prev.filter((t) => t !== id))
                            }
                            emptyText="No items selected"
                            error={tenantError}
                            errorMessage="Please select an item"
                          />
                        </VStack>

                        {/* External Network */}
                        <VStack gap={2} align="start">
                          <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                            External Network
                          </span>
                          <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
                            Indicates whether the network is used as an external network.
                          </span>
                          <Toggle
                            checked={externalNetwork}
                            onChange={(e) => setExternalNetwork(e.target.checked)}
                            label={externalNetwork ? 'Yes' : 'No'}
                          />
                        </VStack>

                        {/* Provider Network Type - Only visible when External Network is Yes */}
                        {externalNetwork && (
                          <VStack gap={2} align="start">
                            <div className="flex gap-[3px]">
                              <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                                Provider Network Type
                              </span>
                              <span className="text-label-lg text-[var(--color-state-danger)] leading-[20px]">
                                *
                              </span>
                            </div>
                            <span className="text-body-sm text-[var(--color-text-subtle)] leading-[16px]">
                              Select the provider network type to use for the network.
                            </span>
                            <RadioGroup
                              value={providerNetworkType}
                              onChange={setProviderNetworkType}
                              orientation="vertical"
                            >
                              <Radio value="vlan" label="VLAN" />
                              <Radio value="flat" label="Flat" />
                            </RadioGroup>
                          </VStack>
                        )}

                        {/* Segmentation ID - Only visible when External Network is Yes */}
                        {externalNetwork && (
                          <VStack gap={2} align="start">
                            <div className="flex gap-[3px]">
                              <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                                Segmentation ID
                              </span>
                              <span className="text-label-lg text-[var(--color-state-danger)] leading-[20px]">
                                *
                              </span>
                            </div>
                            <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
                              Select the segmentation ID used by the provider network.
                            </span>
                            <Select
                              options={[
                                { value: '100', label: '100' },
                                { value: '200', label: '200' },
                                { value: '300', label: '300' },
                                { value: '400', label: '400' },
                                { value: '500', label: '500' },
                              ]}
                              value={segmentationId}
                              onChange={setSegmentationId}
                              placeholder="Select Segmentation ID"
                              fullWidth
                            />
                          </VStack>
                        )}

                        {/* MTU */}
                        <VStack gap={2} align="start">
                          <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                            MTU
                          </span>
                          <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
                            Specifies the MTU value used by the network.
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-[80px]">
                              <NumberInput
                                value={mtu}
                                onChange={setMtu}
                                min={68}
                                max={65535}
                                placeholder=""
                              />
                            </div>
                            <span className="text-body-md text-[var(--color-text-default)]">
                              bytes
                            </span>
                          </div>
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            68-65535 bytes
                          </span>
                        </VStack>

                        {/* Admin State */}
                        <VStack gap={2} align="start">
                          <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                            Admin State
                          </span>
                          <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
                            Indicates whether the load balancer's administrative state is Up or
                            Down.
                          </span>
                          <Toggle
                            checked={adminState}
                            onChange={(e) => setAdminState(e.target.checked)}
                            label={adminState ? 'Up' : 'Down'}
                          />
                        </VStack>

                        {/* Port Security */}
                        <VStack gap={2} align="start">
                          <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                            Port Security
                          </span>
                          <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
                            Enhances security by allowing only permitted devices to access this
                            network. It is recommended to keep this enabled in most cases.
                          </span>
                          <Toggle
                            checked={portSecurity}
                            onChange={(e) => setPortSecurity(e.target.checked)}
                            label={portSecurity ? 'On' : 'Off'}
                          />
                        </VStack>

                        {/* Shared */}
                        <VStack gap={2} align="start">
                          <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                            Shared
                          </span>
                          <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
                            Indicates whether the network is available to other tenants.
                          </span>
                          <Toggle
                            checked={shared}
                            onChange={(e) => setShared(e.target.checked)}
                            label={shared ? 'Yes' : 'No'}
                          />
                        </VStack>

                        {/* Done Button */}
                        <div className="flex items-center justify-end w-full">
                          <Button
                            variant="primary"
                            onClick={() => {
                              // Show validation errors on required fields
                              if (!networkName.trim()) {
                                setNetworkNameError('Please enter a network name.');
                              } else {
                                setNetworkNameError(null);
                              }

                              if (selectedTenants.length === 0) {
                                setTenantError(true);
                              } else {
                                setTenantError(false);
                              }

                              // Always proceed to next section
                              setSectionStatus((prev) => ({
                                ...prev,
                                'basic-info': 'done',
                                subnet: 'active',
                              }));
                            }}
                          >
                            Done
                          </Button>
                        </div>
                      </SectionCard.Content>
                    )}
                    {sectionStatus['basic-info'] === 'done' && (
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Network name" value={networkName || '-'} />
                        {description && (
                          <SectionCard.DataRow label="Description" value={description} />
                        )}
                        <SectionCard.DataRow
                          label="Owned tenant"
                          value={
                            selectedTenantItems.length > 0
                              ? selectedTenantItems.map((t) => t.label).join(', ')
                              : '-'
                          }
                        />
                        <SectionCard.DataRow
                          label="External Network"
                          value={externalNetwork ? 'Yes' : 'No'}
                        />
                        {externalNetwork && (
                          <SectionCard.DataRow
                            label="Provider Network Type"
                            value={providerNetworkType.toUpperCase()}
                          />
                        )}
                        {externalNetwork && (
                          <SectionCard.DataRow
                            label="Segmentation ID"
                            value={segmentationId || '-'}
                          />
                        )}
                        {mtu && <SectionCard.DataRow label="MTU" value={`${mtu} bytes`} />}
                        <SectionCard.DataRow
                          label="Admin State"
                          value={adminState ? 'Up' : 'Down'}
                        />
                        <SectionCard.DataRow
                          label="Port Security"
                          value={portSecurity ? 'On' : 'Off'}
                        />
                        <SectionCard.DataRow label="Shared" value={shared ? 'Yes' : 'No'} />
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
                          <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
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
                                  error={!!cidrError}
                                />
                              </FormField.Control>
                              <FormField.ErrorMessage>{cidrError}</FormField.ErrorMessage>
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
                                    <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
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
                                    <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
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
                                    <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
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
                              // Show validation error on CIDR if createSubnet is enabled and CIDR is empty
                              if (createSubnet && !cidr.trim()) {
                                setCidrError('Please enter a CIDR.');
                              } else {
                                setCidrError(null);
                              }

                              // Always proceed to done state
                              setSectionStatus((prev) => ({
                                ...prev,
                                subnet: 'done',
                              }));
                            }}
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
                        />
                        {createSubnet && subnetName && (
                          <SectionCard.DataRow label="Subnet name" value={subnetName} />
                        )}
                        {createSubnet && <SectionCard.DataRow label="CIDR" value={cidr || '-'} />}
                        {createSubnet && (
                          <SectionCard.DataRow
                            label="Gateway"
                            value={gateway ? gatewayIp || 'Auto' : 'Off'}
                          />
                        )}
                        {createSubnet && (
                          <SectionCard.DataRow label="DHCP" value={dhcp ? 'On' : 'Off'} />
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
