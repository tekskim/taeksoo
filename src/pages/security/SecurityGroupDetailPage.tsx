import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
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
  PageShell,
  DetailHeader,
  ErrorState,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { SecuritySidebar } from '@/components/SecuritySidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconTrash,
  IconDotsCircleHorizontal,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { CreatePolicyDrawer } from '@/components/CreatePolicyDrawer';
import { EditPolicyDrawer } from '@/components/EditPolicyDrawer';
import { EditRuleDrawer } from '@/components/EditRuleDrawer';

interface SecurityGroupDetail {
  id: string;
  name: string;
  description: string;
  tenant: string;
  origin: string;
  clusterName?: string;
  clusterLink?: string;
  createdAt: string;
}

type RuleDirection = 'Ingress' | 'Egress';
type RuleProtocol = 'Any' | 'TCP' | 'UDP' | 'ICMP' | 'Custom ICMP' | 'SSH' | 'HTTP' | 'HTTPS';

interface SecurityGroupRule {
  id: string;
  direction: RuleDirection;
  protocol: RuleProtocol;
  portRange: string;
  remote: string;
  icmpTypeCode: string;
}

const mockSecurityGroupsMap: Record<string, SecurityGroupDetail> = {
  'sg-a1b2c3d4': {
    id: '7284d9f74e81431e93060a9bbcf2cdfd',
    name: 'default',
    description: 'Web server access group',
    tenant: 'tenantA',
    origin: 'Container',
    clusterName: 'prod-cluster-01',
    clusterLink: '/container/clusters/cluster-01',
    createdAt: 'Dec 28 2025 23:19:49',
  },
  'sg-e5f6g7h8': {
    id: 'e5f6g7h8a1b2c3d4e5f6g7h8a1b2c3d4',
    name: 'web-servers',
    description: 'Security group for web servers',
    tenant: 'tenantA',
    origin: 'OpenStack Neutron',
    createdAt: 'Dec 25 2025 10:30:00',
  },
  'sg-i9j0k1l2': {
    id: 'i9j0k1l2a1b2c3d4e5f6g7h8i9j0k1l2',
    name: 'db-servers',
    description: 'Security group for database servers',
    tenant: 'tenantA',
    origin: 'Container',
    clusterName: 'dev-cluster-02',
    clusterLink: '/container/clusters/cluster-02',
    createdAt: 'Dec 25 2025 14:00:00',
  },
  'sg-m3n4o5p6': {
    id: 'm3n4o5p6a1b2c3d4e5f6g7h8m3n4o5p6',
    name: 'monitoring',
    description: 'Monitoring access group',
    tenant: 'tenantA',
    origin: 'OpenStack Neutron',
    createdAt: 'Dec 25 2025 09:15:00',
  },
  'sg-q7r8s9t0': {
    id: 'q7r8s9t0a1b2c3d4e5f6g7h8q7r8s9t0',
    name: 'cache-sg',
    description: 'Cache server access group',
    tenant: 'tenantA',
    origin: 'OpenStack Neutron',
    createdAt: 'Dec 25 2025 11:00:00',
  },
  'sg-u1v2w3x4': {
    id: 'u1v2w3x4a1b2c3d4e5f6g7h8u1v2w3x4',
    name: 'app-sg',
    description: 'Application server security group',
    tenant: 'tenantA',
    origin: 'Container',
    clusterName: 'prod-cluster-01',
    clusterLink: '/container/clusters/cluster-01',
    createdAt: 'Dec 25 2025 08:00:00',
  },
  'sg-y5z6a7b8': {
    id: 'y5z6a7b8a1b2c3d4e5f6g7h8y5z6a7b8',
    name: 'lb-sg',
    description: 'Load balancer security group',
    tenant: 'tenantA',
    origin: 'OpenStack Neutron',
    createdAt: 'Dec 25 2025 16:00:00',
  },
  'sg-c9d0e1f2': {
    id: 'c9d0e1f2a1b2c3d4e5f6g7h8c9d0e1f2',
    name: 'vpn-sg',
    description: 'VPN access group',
    tenant: 'tenantA',
    origin: 'OpenStack Neutron',
    createdAt: 'Dec 25 2025 12:00:00',
  },
  'sg-g3h4i5j6': {
    id: 'g3h4i5j6a1b2c3d4e5f6g7h8g3h4i5j6',
    name: 'admin-sg',
    description: 'Admin access group',
    tenant: 'tenantA',
    origin: 'OpenStack Neutron',
    createdAt: 'Dec 25 2025 10:00:00',
  },
  'sg-k7l8m9n0': {
    id: 'k7l8m9n0a1b2c3d4e5f6g7h8k7l8m9n0',
    name: 'test-sg',
    description: 'Test environment security group',
    tenant: 'tenantA',
    origin: 'OpenStack Neutron',
    createdAt: 'Dec 25 2025 15:00:00',
  },
  'sg-o1p2q3r4': {
    id: 'o1p2q3r4a1b2c3d4e5f6g7h8o1p2q3r4',
    name: 'staging-sg',
    description: 'Staging environment group',
    tenant: 'tenantA',
    origin: 'OpenStack Neutron',
    createdAt: 'Dec 25 2025 14:30:00',
  },
  'sg-s5t6u7v8': {
    id: 's5t6u7v8a1b2c3d4e5f6g7h8s5t6u7v8',
    name: 'prod-sg',
    description: 'Production security group',
    tenant: 'tenantA',
    origin: 'OpenStack Neutron',
    createdAt: 'Dec 25 2025 09:00:00',
  },
};

const mockRules: SecurityGroupRule[] = Array.from({ length: 115 }, (_, i) => ({
  id: `rule-${String(i + 1).padStart(3, '0')}`,
  direction: i % 3 === 0 ? 'Egress' : 'Ingress',
  protocol: (['Any', 'TCP', 'UDP', 'ICMP', 'SSH', 'HTTP', 'HTTPS'] as RuleProtocol[])[i % 7],
  portRange: i % 3 === 0 ? 'Any' : `${(i * 100) % 65535}`,
  remote: `IP\n0.0.0.0/0`,
  icmpTypeCode: '8/8',
}));

export function SecurityGroupDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'rules';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [ruleSearchTerm, setRuleSearchTerm] = useState('');
  const [ruleCurrentPage, setRuleCurrentPage] = useState(1);
  const rulesPerPage = 10;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<SecurityGroupRule | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [createPolicyOpen, setCreatePolicyOpen] = useState(false);
  const [editPolicyOpen, setEditPolicyOpen] = useState(false);
  const [editRuleOpen, setEditRuleOpen] = useState(false);
  const [ruleToEdit, setRuleToEdit] = useState<SecurityGroupRule | null>(null);

  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const securityGroup = id ? mockSecurityGroupsMap[id] : undefined;
  const [rules, setRules] = useState(mockRules);

  const breadcrumbItems = [
    { label: 'Security', href: '/security' },
    { label: 'Security Groups', href: '/security/security-groups' },
    { label: securityGroup?.name ?? id ?? '—' },
  ];

  useEffect(() => {
    if (securityGroup?.name) {
      updateActiveTabLabel(securityGroup.name);
    }
  }, [securityGroup?.name, updateActiveTabLabel]);

  const getRuleContextMenuItems = (rule: SecurityGroupRule): ContextMenuItem[] => [
    {
      id: 'edit',
      label: 'Edit',
      onClick: () => {
        setRuleToEdit(rule);
        setEditRuleOpen(true);
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      divider: true,
      onClick: () => {
        setRuleToDelete(rule);
        setDeleteModalOpen(true);
      },
    },
  ];

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

  const paginatedRules = useMemo(() => {
    const start = (ruleCurrentPage - 1) * rulesPerPage;
    return filteredRules.slice(start, start + rulesPerPage);
  }, [filteredRules, ruleCurrentPage, rulesPerPage]);

  const ruleColumns: TableColumn<SecurityGroupRule>[] = [
    { key: 'direction', label: 'Direction', flex: 1, minWidth: columnMinWidths.direction },
    { key: 'protocol', label: 'Protocol', flex: 1, minWidth: columnMinWidths.protocol },
    { key: 'portRange', label: 'Port Range', flex: 1, minWidth: columnMinWidths.portRange },
    {
      key: 'remote',
      label: 'Remote',
      flex: 1,
      minWidth: columnMinWidths.remote,
      render: (value: string) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          {value.split('\n').map((line, i) => (
            <span
              key={i}
              className={
                i === 0
                  ? 'text-body-md text-[var(--color-text-default)]'
                  : 'text-body-sm text-[var(--color-text-subtle)]'
              }
            >
              {line}
            </span>
          ))}
        </div>
      ),
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
      sticky: 'right',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getRuleContextMenuItems(row)} trigger="click" align="right">
            <button
              aria-label="Row actions"
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            >
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

  const shellProps = {
    sidebar: <SecuritySidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />,
    sidebarWidth,
    tabBar: (
      <TabBar
        tabs={tabs.map((t) => ({ id: t.id, label: t.label, closable: t.closable }))}
        activeTab={activeTabId}
        onTabChange={selectTab}
        onTabClose={closeTab}
        onTabAdd={addNewTab}
        onTabReorder={moveTab}
      />
    ),
    topBar: (
      <TopBar
        showSidebarToggle={!sidebarOpen}
        onSidebarToggle={openSidebar}
        showNavigation={true}
        onBack={() => navigate(-1)}
        onForward={() => navigate(1)}
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
      />
    ),
    contentClassName: 'pt-4 px-8 pb-6',
  };

  if (!securityGroup) {
    return (
      <PageShell {...shellProps}>
        <ErrorState
          icon={<IconAlertTriangle size={16} stroke={1.5} />}
          title="Security group not found"
          description={`The security group with ID "${id ?? ''}" does not exist.`}
          action={
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/security/security-groups')}
            >
              Back to Security Groups
            </Button>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell {...shellProps}>
      <VStack gap={6}>
        <DetailHeader>
          <DetailHeader.Title>{securityGroup.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconEdit size={12} />}
              onClick={() => setEditPolicyOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconTrash size={12} />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="ID" value={securityGroup.id} copyable />
            <DetailHeader.InfoCard label="Description" value={securityGroup.description} />
            <DetailHeader.InfoCard label="Tenant" value={securityGroup.tenant} />
            <DetailHeader.InfoCard
              label="Origin"
              value={
                securityGroup.clusterName && securityGroup.clusterLink ? (
                  <span className="text-body-md text-[var(--color-text-default)]">
                    {securityGroup.origin} (
                    <Link
                      to={securityGroup.clusterLink}
                      className="text-body-md font-medium text-[var(--color-action-primary)] hover:underline"
                    >
                      {securityGroup.clusterName}
                    </Link>
                    )
                  </span>
                ) : (
                  securityGroup.origin
                )
              }
            />
            <DetailHeader.InfoCard label="Created At" value={securityGroup.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        <div className="w-full">
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
            <TabList>
              <Tab value="rules">Rules</Tab>
            </TabList>

            <TabPanel value="rules" className="pt-0">
              <VStack gap={4} className="pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-heading-h5 text-[var(--color-text-default)]">Rules</h3>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setRuleToEdit(null);
                      setEditRuleOpen(true);
                    }}
                  >
                    Create rule
                  </Button>
                </div>

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
                    variant="muted"
                    size="sm"
                    leftIcon={<IconTrash size={12} />}
                    disabled={selectedRules.length === 0}
                  >
                    Delete
                  </Button>
                </div>

                <Pagination
                  currentPage={ruleCurrentPage}
                  totalPages={Math.ceil(filteredRules.length / rulesPerPage)}
                  totalItems={filteredRules.length}
                  selectedCount={selectedRules.length}
                  onPageChange={setRuleCurrentPage}
                />

                <Table<SecurityGroupRule>
                  columns={ruleColumns}
                  data={paginatedRules}
                  rowKey="id"
                  emptyMessage="No rules found"
                  selectable
                  selectedKeys={selectedRules}
                  onSelectionChange={setSelectedRules}
                />
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>

      <CreatePolicyDrawer
        isOpen={createPolicyOpen}
        onClose={() => setCreatePolicyOpen(false)}
        onSubmit={(data) => console.log('Create policy:', data)}
      />

      <EditPolicyDrawer
        isOpen={editPolicyOpen}
        onClose={() => setEditPolicyOpen(false)}
        policy={{
          name: securityGroup.name,
          description: securityGroup.description,
          shared: false,
          audited: false,
        }}
        onSubmit={(data) => console.log('Edit policy:', data)}
      />

      <EditRuleDrawer
        isOpen={editRuleOpen}
        onClose={() => {
          setEditRuleOpen(false);
          setRuleToEdit(null);
        }}
        rule={
          ruleToEdit
            ? {
                name: ruleToEdit.id,
                description: '',
                enabled: true,
                shared: false,
                protocol: ruleToEdit.protocol,
                action: 'allow',
                sourceCidr: '',
                sourcePort: '',
                destinationCidr: '',
                destinationPort: ruleToEdit.portRange === 'Any' ? '' : ruleToEdit.portRange,
              }
            : undefined
        }
        onSubmit={(data) => console.log('Edit rule:', data)}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setRuleToDelete(null);
        }}
        title="Delete rule"
        description="Removing the selected rule is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => {
          if (ruleToDelete) {
            setRules((prev) => prev.filter((r) => r.id !== ruleToDelete.id));
            setSelectedRules((prev) => prev.filter((rid) => rid !== ruleToDelete.id));
          }
          setDeleteModalOpen(false);
          setRuleToDelete(null);
        }}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete security group"
        description="Removing this security group is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => {
          setIsDeleteOpen(false);
          navigate('/security/security-groups');
        }}
      />
    </PageShell>
  );
}

export default SecurityGroupDetailPage;
