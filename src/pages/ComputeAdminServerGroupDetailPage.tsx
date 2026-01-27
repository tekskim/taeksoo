import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  SearchInput,
  Table,
  Pagination,
  StatusIndicator,
  type TableColumn,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconBell, IconLock, IconLockOpen } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type PolicyType = 'Anti-affinity' | 'Affinity' | 'Soft-anti-affinity' | 'Soft-affinity';
type InstanceStatus = 'active' | 'building' | 'error' | 'shutoff' | 'paused';

interface ServerGroupDetail {
  id: string;
  name: string;
  policy: PolicyType;
}

interface ServerGroupInstance {
  id: string;
  name: string;
  status: InstanceStatus;
  locked: boolean;
  host: string;
  fixedIP: string;
  floatingIP: string;
  az: string;
  os: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockServerGroupsMap: Record<string, ServerGroupDetail> = {
  'sg-001': { id: 'sg-001', name: 'server-1', policy: 'Anti-affinity' },
  'sg-002': { id: 'sg-002', name: 'web-servers', policy: 'Anti-affinity' },
  'sg-003': { id: 'sg-003', name: 'db-cluster', policy: 'Affinity' },
  'sg-004': { id: 'sg-004', name: 'cache-group', policy: 'Soft-anti-affinity' },
  'sg-005': { id: 'sg-005', name: 'app-servers', policy: 'Anti-affinity' },
};

const defaultServerGroupDetail: ServerGroupDetail = {
  id: 'unknown',
  name: 'Unknown Server group',
  policy: 'Anti-affinity',
};

const mockServerGroupInstances: ServerGroupInstance[] = [
  {
    id: '29tgj234',
    name: 'web-server-01',
    status: 'active',
    locked: true,
    host: 'compute-01',
    fixedIP: '10.62.0.30',
    floatingIP: '20.20.20.30',
    az: 'zone-a',
    os: 'ubuntu 24.04',
    createdAt: 'Dec 25, 2025',
  },
  {
    id: '29tgj235',
    name: 'web-server-02',
    status: 'active',
    locked: true,
    host: 'compute-01',
    fixedIP: '10.62.0.31',
    floatingIP: '20.20.20.31',
    az: 'zone-a',
    os: 'ubuntu 24.04',
    createdAt: 'Dec 25, 2025',
  },
  {
    id: '29tgj236',
    name: 'web-server-03',
    status: 'active',
    locked: true,
    host: 'compute-02',
    fixedIP: '10.62.0.32',
    floatingIP: '20.20.20.32',
    az: 'zone-b',
    os: 'ubuntu 24.04',
    createdAt: 'Dec 25, 2025',
  },
  {
    id: '29tgj237',
    name: 'web-server-04',
    status: 'error',
    locked: false,
    host: 'compute-02',
    fixedIP: '10.62.0.33',
    floatingIP: '-',
    az: 'zone-b',
    os: 'ubuntu 24.04',
    createdAt: 'Dec 25, 2025',
  },
  {
    id: '29tgj238',
    name: 'web-server-05',
    status: 'active',
    locked: true,
    host: 'compute-03',
    fixedIP: '10.62.0.34',
    floatingIP: '20.20.20.34',
    az: 'zone-a',
    os: 'ubuntu 24.04',
    createdAt: 'Dec 25, 2025',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ComputeAdminServerGroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('instances');

  const [instanceSearchQuery, setInstanceSearchQuery] = useState('');
  const [instanceCurrentPage, setInstanceCurrentPage] = useState(1);
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);
  const instancesPerPage = 10;

  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const serverGroup = id
    ? mockServerGroupsMap[id] || defaultServerGroupDetail
    : defaultServerGroupDetail;

  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    if (serverGroup.name) {
      updateActiveTabLabel(serverGroup.name);
    }
  }, [serverGroup.name, updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [
    { label: 'Compute Admin', href: '/compute-admin' },
    { label: 'Server Groups', href: '/compute-admin/server-groups' },
    { label: serverGroup.name },
  ];

  const filteredInstances = useMemo(() => {
    if (!instanceSearchQuery) return mockServerGroupInstances;
    const query = instanceSearchQuery.toLowerCase();
    return mockServerGroupInstances.filter(
      (inst) => inst.name.toLowerCase().includes(query) || inst.id.toLowerCase().includes(query)
    );
  }, [instanceSearchQuery]);

  const instanceTotalPages = Math.ceil(filteredInstances.length / instancesPerPage);

  const paginatedInstances = useMemo(() => {
    const start = (instanceCurrentPage - 1) * instancesPerPage;
    return filteredInstances.slice(start, start + instancesPerPage);
  }, [filteredInstances, instanceCurrentPage, instancesPerPage]);

  const instanceColumns: TableColumn<ServerGroupInstance>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, row) => <StatusIndicator status={row.status} layout="icon-only" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/instances/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)] truncate">
            ID: {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'locked',
      label: 'Locked',
      width: '80px',
      align: 'center',
      render: (_, row) =>
        row.locked ? (
          <IconLock size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
        ) : (
          <IconLockOpen size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
        ),
    },
    {
      key: 'host',
      label: 'Host',
      flex: 1,
    },
    {
      key: 'fixedIP',
      label: 'Fixed IP',
      flex: 1,
    },
    {
      key: 'floatingIP',
      label: 'Floating IP',
      flex: 1,
      render: (_, row) =>
        row.floatingIP !== '-' ? (
          <Link
            to={`/compute-admin/floating-ips/${row.floatingIP}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.floatingIP}
          </Link>
        ) : (
          <span className="text-[var(--color-text-default)]">-</span>
        ),
    },
    {
      key: 'az',
      label: 'AZ',
      flex: 1,
    },
    {
      key: 'os',
      label: 'OS',
      flex: 1,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      flex: 1,
      sortable: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'
        }`}
      >
        <div className="shrink-0 bg-[var(--color-surface-default)]">
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

          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => navigate(-1)}
            onForward={() => navigate(1)}
            breadcrumb={<Breadcrumb items={breadcrumbItems} />}
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={6} className="min-w-[1176px]">
              <DetailHeader>
                <DetailHeader.Title>{serverGroup.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Delete
                  </Button>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard label="ID" value={serverGroup.id} copyable />
                  <DetailHeader.InfoCard label="Tenant" value="tenantA" />
                  <DetailHeader.InfoCard label="Policy" value={serverGroup.policy} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              <div className="w-full">
                <Tabs
                  value={activeDetailTab}
                  onChange={setActiveDetailTab}
                  variant="underline"
                  size="sm"
                >
                  <TabList>
                    <Tab value="instances">Instances</Tab>
                  </TabList>

                  <TabPanel value="instances" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      <h2 className="text-[length:var(--font-size-16)] leading-[var(--line-height-24)] font-semibold text-[var(--color-text-default)]">
                        Instances
                      </h2>

                      <div className="w-[var(--search-input-width)]">
                        <SearchInput
                          placeholder="Search instance by attributes"
                          value={instanceSearchQuery}
                          onChange={(e) => setInstanceSearchQuery(e.target.value)}
                          onClear={() => setInstanceSearchQuery('')}
                          size="sm"
                          fullWidth
                        />
                      </div>

                      <Pagination
                        currentPage={instanceCurrentPage}
                        totalPages={instanceTotalPages}
                        onPageChange={setInstanceCurrentPage}
                        totalItems={filteredInstances.length}
                        selectedCount={selectedInstances.length}
                      />

                      <Table<ServerGroupInstance>
                        columns={instanceColumns}
                        data={paginatedInstances}
                        rowKey="id"
                        emptyMessage="No instances found"
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

export default ComputeAdminServerGroupDetailPage;
