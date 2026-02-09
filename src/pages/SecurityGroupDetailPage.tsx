import { useState, useMemo, useEffect } from 'react';
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
  PageShell,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
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
type RuleProtocol =
  | 'Custom ICMP'
  | 'TCP'
  | 'UDP'
  | 'Any'
  | 'ICMP'
  | 'SSH'
  | 'HTTP'
  | 'HTTPS'
  | 'RDP';

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

// Security group data map by ID - synced with SecurityGroupsPage mock data
const mockSecurityGroupsMap: Record<string, SecurityGroupDetail> = {
  'sg-001': {
    id: 'sg-001',
    name: 'sg-01',
    description: 'Web server access group',
    createdAt: 'Jan 15, 2024',
  },
  'sg-002': {
    id: 'sg-002',
    name: 'default',
    description: 'Default security group',
    createdAt: 'Jan 10, 2024',
  },
  'sg-003': {
    id: 'sg-003',
    name: 'db-sg',
    description: 'Database access group',
    createdAt: 'Feb 1, 2024',
  },
  'sg-004': {
    id: 'sg-004',
    name: 'app-sg',
    description: 'Application server security group',
    createdAt: 'Feb 15, 2024',
  },
  'sg-005': {
    id: 'sg-005',
    name: 'lb-sg',
    description: 'Load balancer security group',
    createdAt: 'Mar 1, 2024',
  },
  'sg-006': {
    id: 'sg-006',
    name: 'cache-sg',
    description: 'Cache server access group',
    createdAt: 'Mar 10, 2024',
  },
  'sg-007': {
    id: 'sg-007',
    name: 'monitor-sg',
    description: 'Monitoring access group',
    createdAt: 'Apr 1, 2024',
  },
  'sg-008': {
    id: 'sg-008',
    name: 'vpn-sg',
    description: 'VPN access group',
    createdAt: 'Apr 15, 2024',
  },
  'sg-009': {
    id: 'sg-009',
    name: 'admin-sg',
    description: 'Admin access group',
    createdAt: 'May 1, 2024',
  },
  'sg-010': {
    id: 'sg-010',
    name: 'test-sg',
    description: 'Test environment security group',
    createdAt: 'May 10, 2024',
  },
};

const defaultSecurityGroupDetail: SecurityGroupDetail = {
  id: 'unknown',
  name: 'Unknown Security group',
  description: '-',
  createdAt: '-',
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
  const sidebarWidth = sidebarOpen ? 200 : 0;
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
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Get security group data based on URL ID
  const securityGroup = id
    ? mockSecurityGroupsMap[id] || defaultSecurityGroupDetail
    : defaultSecurityGroupDetail;
  const rules = mockRules;
  const ports = mockPorts;

  // Update tab label to security group name
  useEffect(() => {
    if (securityGroup.name) {
      updateActiveTabLabel(securityGroup.name);
    }
  }, [securityGroup.name, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Context menu items for rules
  const getRuleContextMenuItems = (rule: SecurityGroupRule): ContextMenuItem[] => [
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => {
        setRuleToDelete(rule);
        setDeleteModalOpen(true);
      },
    },
  ];

  // Context menu items for ports
  const getPortContextMenuItems = (port: Port): ContextMenuItem[] => [
    { id: 'view', label: 'View details', onClick: () => console.log('View port:', port.id) },
    {
      id: 'detach',
      label: 'Detach',
      status: 'danger',
      onClick: () => console.log('Detach port:', port.id),
    },
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
    return rules.filter(
      (rule) =>
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
    return ports.filter(
      (port) =>
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
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator status={portStatusMap[row.status]} layout="icon-only" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (_, row) => (
        <Link
          to={`/compute/networks/${row.id}`}
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
      minWidth: columnMinWidths.ownedSubnet || '100px',
    },
    {
      key: 'dhcp',
      label: 'DHCP',
      flex: 1,
      minWidth: '100px',
      render: (value: boolean) => (value ? 'Yes' : 'No'),
    },
    {
      key: 'access',
      label: 'Access',
      flex: 1,
      minWidth: columnMinWidths.access,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getPortContextMenuItems(row)} trigger="click" align="right">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--action-icon-color)]"
              />
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
      minWidth: columnMinWidths.direction,
    },
    {
      key: 'protocol',
      label: 'Protocol',
      flex: 1,
      minWidth: columnMinWidths.protocol,
      sortable: true,
    },
    {
      key: 'portRange',
      label: 'Port range',
      flex: 1,
      minWidth: columnMinWidths.portRange,
    },
    {
      key: 'remote',
      label: 'Remote',
      flex: 1,
      minWidth: columnMinWidths.remote,
    },
    {
      key: 'icmpTypeCode',
      label: 'ICMP Type/Code',
      flex: 1,
      minWidth: columnMinWidths.icmpTypeCode,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getRuleContextMenuItems(row)} trigger="click" align="right">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--action-icon-color)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />}
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
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Proj-1', href: '/project' },
                { label: 'Security groups', href: '/compute/security-groups' },
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
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6} className="min-w-[1176px]">
        {/* Header Card */}
        <div className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 pt-3 pb-4">
          {/* Title */}
          <h1 className="text-heading-h5 text-[var(--color-text-default)] mb-3">
            {securityGroup.name}
          </h1>

          {/* Actions */}
          <div className="flex items-center gap-1 mb-3">
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
              Edit
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
              Create rule
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
          </div>

          {/* Info Row */}
          <div className="flex items-center gap-2">
            {/* ID */}
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <span className="text-label-sm text-[var(--color-text-subtle)]">ID</span>
              <div className="flex items-center gap-1 mt-1.5">
                <p className="text-body-md text-[var(--color-text-default)]">{securityGroup.id}</p>
                <button
                  onClick={() => copyToClipboard(securityGroup.id)}
                  className="p-0.5 rounded hover:bg-[var(--color-surface-muted)] transition-colors"
                >
                  <IconCopy size={12} className="text-[var(--color-action-primary)]" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <span className="text-label-sm text-[var(--color-text-subtle)]">Description</span>
              <p className="text-body-md text-[var(--color-text-default)] mt-1.5">
                {securityGroup.description}
              </p>
            </div>

            {/* Created at */}
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <span className="text-label-sm text-[var(--color-text-subtle)]">Created at</span>
              <p className="text-body-md text-[var(--color-text-default)] mt-1.5">
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
            </TabList>

            <TabPanel value="rules" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-heading-h5 text-[var(--color-text-default)]">Rules</h3>
                  <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                    Create rule
                  </Button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2">
                  <div className="w-[var(--search-input-width)]">
                    <SearchInput
                      placeholder="Search rules by attributes"
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
                />

                {/* Table */}
                <Table
                  columns={ruleColumns}
                  data={paginatedRules}
                  rowKey="id"
                  selectable
                  selectedKeys={selectedRules}
                  onSelectionChange={setSelectedRules}
                />
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setRuleToDelete(null);
        }}
        title="Delete rule"
        description="Removing the selected instances is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => {
          setDeleteModalOpen(false);
          setRuleToDelete(null);
        }}
      />
    </PageShell>
  );
}
