import { useState } from 'react';
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
  DetailHeader,
  SectionCard,
  Table,
  SearchInput,
  Pagination,
  StatusIndicator,
  ContextMenu,
} from '@/design-system';
import type { TableColumn, ContextMenuItem } from '@/design-system';
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

type L7PolicyStatus = 'active' | 'down' | 'error';

interface L7PolicyDetail {
  id: string;
  name: string;
  status: L7PolicyStatus;
  adminState: 'Up' | 'Down';
  createdAt: string;
  // Basic Information
  description: string;
  behavior: string;
  behaviorDetail: {
    name: string;
    id: string;
  } | null;
  position: number;
  // Association
  listener: {
    name: string;
    id: string;
    loadBalancer?: {
      name: string;
      id: string;
    };
  } | null;
}

type L7RuleStatus = 'active' | 'down' | 'error';

interface L7Rule {
  id: string;
  name: string;
  status: L7RuleStatus;
  type: 'HOST_NAME' | 'PATH' | 'FILE_TYPE' | 'HEADER' | 'COOKIE';
  compareType: 'STARTS_WITH' | 'ENDS_WITH' | 'CONTAINS' | 'EQUAL_TO' | 'REGEX';
  value: string;
  key: string | null;
  invert: boolean;
  adminState: 'Up' | 'Down';
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockL7PolicyDetail: L7PolicyDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'policy1',
  status: 'active',
  adminState: 'Up',
  createdAt: '2025-07-25 09:12:20',
  // Basic Information
  description: '-',
  behavior: 'Forward to Pool',
  behaviorDetail: {
    name: 'web-server-10',
    id: 'pool-001',
  },
  position: 50,
  // Association
  listener: {
    name: 'listener-http-80',
    id: 'listener-001',
    loadBalancer: {
      name: 'web-lb-01',
      id: 'lb-001',
    },
  },
};

/* ----------------------------------------
   Mock L7 Rules Data
   ---------------------------------------- */

const mockL7Rules: L7Rule[] = Array.from({ length: 25 }, (_, i) => ({
  id: `rule-${String(i + 1).padStart(3, '0')}`,
  name: `rule-${String(i + 1).padStart(2, '0')}`,
  status: ['active', 'active', 'down', 'error'][i % 4] as L7RuleStatus,
  type: ['HOST_NAME', 'PATH', 'FILE_TYPE', 'HEADER', 'COOKIE'][i % 5] as L7Rule['type'],
  compareType: ['STARTS_WITH', 'ENDS_WITH', 'CONTAINS', 'EQUAL_TO', 'REGEX'][i % 5] as L7Rule['compareType'],
  value: i % 2 === 0 ? '/api/*' : 'www.example.com',
  key: i % 3 === 0 ? 'X-Custom-Header' : null,
  invert: i % 4 === 0,
  adminState: i % 5 === 0 ? 'Down' : 'Up',
}));

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const l7PolicyStatusMap: Record<L7PolicyStatus, 'active' | 'building' | 'error'> = {
  active: 'active',
  down: 'building',
  error: 'error',
};

const l7RuleStatusMap: Record<L7RuleStatus, 'active' | 'building' | 'error'> = {
  active: 'active',
  down: 'building',
  error: 'error',
};

/* ----------------------------------------
   L7PolicyDetailPage Component
   ---------------------------------------- */

export default function L7PolicyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [copiedId, setCopiedId] = useState(false);

  // L7 Rules state
  const [l7RuleSearchTerm, setL7RuleSearchTerm] = useState('');
  const [l7RuleCurrentPage, setL7RuleCurrentPage] = useState(1);
  const [selectedL7Rules, setSelectedL7Rules] = useState<string[]>([]);
  const l7RulesPerPage = 10;

  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // In a real app, fetch based on id
  const l7Policy = mockL7PolicyDetail;

  const breadcrumbItems = [
    { label: 'Proj-1', href: '/' },
    { label: 'Load Balancers', href: '/load-balancers' },
    { label: l7Policy.listener?.loadBalancer?.name || 'Unknown', href: `/load-balancers/${l7Policy.listener?.loadBalancer?.id}` },
    { label: l7Policy.listener?.name || 'Unknown', href: `/listeners/${l7Policy.listener?.id}` },
    { label: l7Policy.name },
  ];

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const handleCopyId = () => {
    navigator.clipboard.writeText(l7Policy.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Filtered L7 rules
  const filteredL7Rules = l7RuleSearchTerm
    ? mockL7Rules.filter(rule =>
        rule.name.toLowerCase().includes(l7RuleSearchTerm.toLowerCase()) ||
        rule.type.toLowerCase().includes(l7RuleSearchTerm.toLowerCase()) ||
        rule.value.toLowerCase().includes(l7RuleSearchTerm.toLowerCase())
      )
    : mockL7Rules;

  // Paginated L7 rules
  const totalL7RulePages = Math.ceil(filteredL7Rules.length / l7RulesPerPage);
  const paginatedL7Rules = filteredL7Rules.slice(
    (l7RuleCurrentPage - 1) * l7RulesPerPage,
    l7RuleCurrentPage * l7RulesPerPage
  );

  // L7 Rule columns
  const l7RuleColumns: TableColumn<L7Rule>[] = [
    {
      key: 'type',
      label: 'Rule Type',
      flex: 1,
      sortable: true,
    },
    {
      key: 'compareType',
      label: 'Compare Type',
      flex: 1,
      sortable: true,
    },
    {
      key: 'key',
      label: 'Key',
      flex: 1,
      sortable: true,
      render: (_, row) => row.key || '-',
    },
    {
      key: 'value',
      label: 'Value',
      flex: 1,
      sortable: true,
    },
    {
      key: 'invert',
      label: 'Invert',
      flex: 1,
      render: (_, row) => row.invert ? 'On' : 'Off',
    },
    {
      key: 'adminState',
      label: 'Admin State',
      flex: 1,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_: unknown, row: L7Rule) => {
        const ruleMenuItems: ContextMenuItem[] = [
          { id: 'edit', label: 'Edit', onClick: () => console.log('Edit rule', row.id) },
          { id: 'delete', label: 'Delete', status: 'danger', onClick: () => console.log('Delete rule', row.id) },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={ruleMenuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[200px]' : 'left-[48px]'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* TabBar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            showAddButton
            showWindowControls
          />

          {/* TopBar */}
          <TopBar
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={<Breadcrumb items={breadcrumbItems} />}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                onClick={() => {}}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={8} align="stretch" className="min-w-[1176px] max-w-[1320px]">
              {/* Detail Header */}
              <DetailHeader>
                <DetailHeader.Title>
                  <h1 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6 mb-3">
                    {l7Policy.name}
                  </h1>
                  <DetailHeader.Actions>
                    <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                      Create L7 Rule
                    </Button>
                    <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                      Delete
                    </Button>
                  </DetailHeader.Actions>
                </DetailHeader.Title>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Status"
                    value="Available"
                    status={l7PolicyStatusMap[l7Policy.status]}
                  />
                  <DetailHeader.InfoCard
                    label="ID"
                    value={l7Policy.id}
                    copyable
                    onCopy={handleCopyId}
                  />
                  <DetailHeader.InfoCard
                    label="Admin State"
                    value={l7Policy.adminState}
                  />
                  <DetailHeader.InfoCard
                    label="Created At"
                    value={l7Policy.createdAt}
                  />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs */}
              <div className="w-full">
                <Tabs value={activeDetailTab} onChange={setActiveDetailTab}>
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="l7-rules">L7 Rules</Tab>
                  </TabList>

                  {/* Details Tab */}
                  <TabPanel value="details">
                    <VStack gap={6} className="pt-6">
                      <SectionCard>
                        <SectionCard.Header
                          title="Basic Information"
                          actions={
                            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                              Edit
                            </Button>
                          }
                        />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Name" value={l7Policy.name} />
                          <SectionCard.DataRow label="Description" value={l7Policy.description} />
                          <SectionCard.DataRow label="Behavior" value={l7Policy.behavior} />
                          <SectionCard.DataRow
                            label="Behavior Detail"
                            value={
                              l7Policy.behaviorDetail ? (
                                <Link
                                  to={`/pools/${l7Policy.behaviorDetail.id}`}
                                  className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                                >
                                  {l7Policy.behaviorDetail.name}
                                </Link>
                              ) : '-'
                            }
                          />
                          <SectionCard.DataRow label="Position" value={String(l7Policy.position)} />
                          <SectionCard.DataRow label="Admin State" value={l7Policy.adminState} />
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* L7 Rules Tab */}
                  <TabPanel value="l7-rules">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                          L7 Rules
                        </h3>
                        <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                          Create L7 Rule
                        </Button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-2">
                        <div className="w-[280px]">
                          <SearchInput
                            value={l7RuleSearchTerm}
                            onChange={(e) => {
                              setL7RuleSearchTerm(e.target.value);
                              setL7RuleCurrentPage(1);
                            }}
                            placeholder="Find L7 rules with filters"
                          />
                        </div>
                        <div className="h-4 w-px bg-[var(--color-border-default)]" />
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconTrash size={12} />}
                          disabled={selectedL7Rules.length === 0}
                        >
                          Delete
                        </Button>
                      </div>

                      {/* Pagination */}
                        <Pagination
                          currentPage={l7RuleCurrentPage}
                          totalPages={totalL7RulePages}
                          onPageChange={setL7RuleCurrentPage}
                        totalItems={filteredL7Rules.length}
                        selectedCount={selectedL7Rules.length}
                        showSettings
                        onSettingsClick={() => setIsPreferencesOpen(true)}
                        />

                      {/* Table */}
                      <Table
                        columns={l7RuleColumns}
                        data={paginatedL7Rules}
                        rowKey="id"
                        selectable
                        selectedKeys={selectedL7Rules}
                        onSelectionChange={setSelectedL7Rules}
                      />
                    </VStack>
                  </TabPanel>
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

