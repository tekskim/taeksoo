import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Table,
  SearchInput,
  Pagination,
  ContextMenu,
  ConfirmModal,
  StatusIndicator,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconTrash,
  IconBell,
  IconCopy,
  IconCirclePlus,
  IconDotsCircleHorizontal,
  IconUnlink,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface SecurityGroupDetail {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

type RuleDirection = 'Ingress' | 'Egress';
type RuleProtocol = 'Custom ICMP' | 'TCP' | 'UDP' | 'Any' | 'ICMP' | 'SSH' | 'HTTP' | 'HTTPS' | 'RDP';

interface SecurityGroupRule {
  id: string;
  direction: RuleDirection;
  protocol: RuleProtocol;
  portRange: string;
  remote: string;
  icmpTypeCode: string;
}

interface Port {
  id: string;
  name: string;
  status: 'active' | 'down' | 'build';
  subnet: string;
  dhcp: boolean;
  access: 'Project' | 'Admin';
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockSecurityGroupDetail: SecurityGroupDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'sg-01',
  description: 'Web server access group',
  createdAt: '2025-01-25 09:12:20',
};

const mockRules: SecurityGroupRule[] = Array.from({ length: 115 }, (_, i) => ({
  id: `rule-${String(i + 1).padStart(3, '0')}`,
  direction: i % 3 === 0 ? 'Egress' : 'Ingress',
  protocol: ['Custom ICMP', 'TCP', 'UDP', 'ICMP', 'SSH', 'HTTP', 'HTTPS'][i % 7] as RuleProtocol,
  portRange: i % 3 === 0 ? '1-65535' : 'Any',
  remote: `IP : 0.0.0.0/0`,
  icmpTypeCode: '8/8',
}));

const mockPorts: Port[] = Array.from({ length: 115 }, (_, i) => ({
  id: `port-${String(i + 1).padStart(3, '0')}`,
  name: `net-${String((i % 10) + 1).padStart(2, '0')}`,
  status: ['active', 'active', 'active', 'down', 'build'][i % 5] as 'active' | 'down' | 'build',
  subnet: `10.${62 + (i % 4)}.0.0/24`,
  dhcp: i % 3 !== 2,
  access: i % 5 === 0 ? 'Admin' : 'Project',
}));

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function SecurityGroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('rules');
  
  // Rules state
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [ruleSearchTerm, setRuleSearchTerm] = useState('');
  const [ruleCurrentPage, setRuleCurrentPage] = useState(1);
  const rulesPerPage = 10;

  // Ports state
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);
  const [portSearchTerm, setPortSearchTerm] = useState('');
  const [portCurrentPage, setPortCurrentPage] = useState(1);
  const portsPerPage = 10;

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<SecurityGroupRule | null>(null);
  
  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Mock security group data
  const securityGroup = mockSecurityGroupDetail;
  const rules = mockRules;
  const ports = mockPorts;

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Context menu items for rules
  const getRuleContextMenuItems = (rule: SecurityGroupRule): ContextMenuItem[] => [
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit rule:', rule.id) },
    { id: 'delete', label: 'Delete', status: 'danger', onClick: () => { setRuleToDelete(rule); setDeleteModalOpen(true); } },
  ];

  // Context menu items for ports
  const getPortContextMenuItems = (port: Port): ContextMenuItem[] => [
    { id: 'view', label: 'View Details', onClick: () => console.log('View port:', port.id) },
    { id: 'detach', label: 'Detach', status: 'danger', onClick: () => console.log('Detach port:', port.id) },
  ];

  // Status mapping for ports
  const portStatusMap: Record<string, 'active' | 'down' | 'error' | 'building'> = {
    active: 'active',
    down: 'down',
    build: 'building',
  };

  // Filter rules based on search
  const filteredRules = useMemo(() => {
    if (!ruleSearchTerm) return rules;
    const query = ruleSearchTerm.toLowerCase();
    return rules.filter(rule =>
      rule.direction.toLowerCase().includes(query) ||
      rule.protocol.toLowerCase().includes(query) ||
      rule.remote.toLowerCase().includes(query)
    );
  }, [rules, ruleSearchTerm]);

  // Paginated rules
  const paginatedRules = useMemo(() => {
    const start = (ruleCurrentPage - 1) * rulesPerPage;
    return filteredRules.slice(start, start + rulesPerPage);
  }, [filteredRules, ruleCurrentPage, rulesPerPage]);

  // Filter ports based on search
  const filteredPorts = useMemo(() => {
    if (!portSearchTerm) return ports;
    const query = portSearchTerm.toLowerCase();
    return ports.filter(port =>
      port.name.toLowerCase().includes(query) ||
      port.subnet.toLowerCase().includes(query) ||
      port.access.toLowerCase().includes(query)
    );
  }, [ports, portSearchTerm]);

  // Paginated ports
  const paginatedPorts = useMemo(() => {
    const start = (portCurrentPage - 1) * portsPerPage;
    return filteredPorts.slice(start, start + portsPerPage);
  }, [filteredPorts, portCurrentPage, portsPerPage]);

  // Port columns
  const portColumns: TableColumn<Port>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '60px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={portStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (_, row) => (
        <Link
          to={`/networks/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'subnet',
      label: 'Subnet',
      flex: 1,
    },
    {
      key: 'dhcp',
      label: 'DHCP',
      flex: 1,
      render: (value: boolean) => value ? 'Yes' : 'No',
    },
    {
      key: 'access',
      label: 'Access',
      flex: 1,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getPortContextMenuItems(row)} trigger="click">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
              <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  // Rule columns
  const ruleColumns: TableColumn<SecurityGroupRule>[] = [
    {
      key: 'direction',
      label: 'Direction',
      flex: 1,
    },
    {
      key: 'protocol',
      label: 'Protocol',
      flex: 1,
      sortable: true,
    },
    {
      key: 'portRange',
      label: 'Port Range',
      flex: 1,
    },
    {
      key: 'remote',
      label: 'Remote',
      flex: 1,
    },
    {
      key: 'icmpTypeCode',
      label: 'ICMP Type/Code',
      flex: 1,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getRuleContextMenuItems(row)} trigger="click">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
              <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />

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
            onTabAdd={addNewTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Proj-1', href: '/project' },
                  { label: 'Security Groups', href: '/security-groups' },
                  { label: securityGroup.name },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Main Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={8} className="min-w-[1176px] max-w-[1320px]">
              {/* Header Card */}
              <div className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4">
                {/* Title */}
                <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)] mb-3">
                  {securityGroup.name}
                </h1>

                {/* Actions */}
                <div className="flex items-center gap-1 mb-3">
                  <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                    Edit
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Delete
                  </Button>
                </div>

                {/* Info Row */}
                <div className="flex items-center gap-2">
                  {/* ID */}
                  <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)]">
                        ID
                      </span>
                      <button
                        onClick={() => copyToClipboard(securityGroup.id)}
                        className="p-0.5 rounded hover:bg-[var(--color-surface-muted)] transition-colors"
                      >
                        <IconCopy size={12} className="text-[var(--color-action-primary)]" />
                      </button>
                    </div>
                    <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mt-1.5">
                      {securityGroup.id}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
                    <span className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)]">
                      Description
                    </span>
                    <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mt-1.5">
                      {securityGroup.description}
                    </p>
                  </div>

                  {/* Created At */}
                  <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
                    <span className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)]">
                      Created At
                    </span>
                    <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mt-1.5">
                      {securityGroup.createdAt}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="w-full">
                <Tabs value={activeTab} onChange={setActiveTab} size="sm">
                  <TabList>
                    <Tab value="rules">Rules</Tab>
                    <Tab value="ports">Ports</Tab>
                  </TabList>

                  <TabPanel value="rules">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">
                          Rules
                        </h3>
                        <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                          Create Rule
                        </Button>
                      </div>

                      {/* Toolbar */}
                      <div className="flex items-center gap-2">
                        <div className="w-[280px]">
                          <SearchInput
                            placeholder="Find rules with filters"
                            value={ruleSearchTerm}
                            onChange={(e) => setRuleSearchTerm(e.target.value)}
                            onClear={() => setRuleSearchTerm('')}
                            size="sm"
                            fullWidth
                          />
                        </div>
                        <div className="w-px h-4 bg-[var(--color-border-default)]" />
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconTrash size={12} />}
                          disabled={selectedRules.length === 0}
                        >
                          Delete
                        </Button>
                      </div>

                      {/* Pagination */}
                      <Pagination
                        currentPage={ruleCurrentPage}
                        totalPages={Math.ceil(filteredRules.length / rulesPerPage)}
                        totalItems={filteredRules.length}
                        selectedCount={selectedRules.length}
                        onPageChange={setRuleCurrentPage}
                        showSettings
                        onSettingsClick={() => setIsPreferencesOpen(true)}
                      />

                      {/* Table */}
                      <Table
                        columns={ruleColumns}
                        data={paginatedRules}
                        rowKey="id"
                        selectable
                        selectedRows={selectedRules}
                        onSelectionChange={setSelectedRules}
                      />
                    </VStack>
                  </TabPanel>

                  <TabPanel value="ports">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">
                          Ports
                        </h3>
                      </div>

                      {/* Toolbar */}
                      <div className="flex items-center gap-2">
                        <div className="w-[280px]">
                          <SearchInput
                            placeholder="Find ports with filters"
                            value={portSearchTerm}
                            onChange={(e) => setPortSearchTerm(e.target.value)}
                            onClear={() => setPortSearchTerm('')}
                            size="sm"
                            fullWidth
                          />
                        </div>
                        <div className="w-px h-4 bg-[var(--color-border-default)]" />
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconUnlink size={12} />}
                          disabled={selectedPorts.length === 0}
                        >
                          Detach
                        </Button>
                      </div>

                      {/* Pagination */}
                      <Pagination
                        currentPage={portCurrentPage}
                        totalPages={Math.ceil(filteredPorts.length / portsPerPage)}
                        totalItems={filteredPorts.length}
                        selectedCount={selectedPorts.length}
                        onPageChange={setPortCurrentPage}
                        showSettings
                        onSettingsClick={() => setIsPreferencesOpen(true)}
                      />

                      {/* Table */}
                      <Table
                        columns={portColumns}
                        data={paginatedPorts}
                        rowKey="id"
                        selectable
                        selectedRows={selectedPorts}
                        onSelectionChange={setSelectedPorts}
                      />
                    </VStack>
                  </TabPanel>
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setRuleToDelete(null);
        }}
        title="Delete Rule"
        description={`Are you sure you want to delete this rule? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => {
          setDeleteModalOpen(false);
          setRuleToDelete(null);
        }}
      />
    </div>
  );
}

