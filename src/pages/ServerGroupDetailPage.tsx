import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  Button,
  VStack,
  HStack,
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
  ContextMenu,
  PageShell,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  IconCirclePlus,
  IconTrash,
  IconBell,
  IconDotsCircleHorizontal,
  IconLock,
  IconLockOpen,
  IconTerminal2,
} from '@tabler/icons-react';

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
  fixedIP: string;
  floatingIP: string;
  az: string;
  os: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

// Server group data map by ID - synced with ServerGroupsPage mock data
const mockServerGroupsMap: Record<string, ServerGroupDetail> = {
  'sg-001': { id: 'sg-001', name: 'server-1', policy: 'Anti-affinity' },
  'sg-002': { id: 'sg-002', name: 'web-servers', policy: 'Anti-affinity' },
  'sg-003': { id: 'sg-003', name: 'db-cluster', policy: 'Affinity' },
  'sg-004': { id: 'sg-004', name: 'cache-group', policy: 'Soft-anti-affinity' },
  'sg-005': { id: 'sg-005', name: 'app-servers', policy: 'Anti-affinity' },
  'sg-006': { id: 'sg-006', name: 'monitoring', policy: 'Soft-affinity' },
  'sg-007': { id: 'sg-007', name: 'k8s-workers', policy: 'Anti-affinity' },
  'sg-008': { id: 'sg-008', name: 'k8s-masters', policy: 'Anti-affinity' },
  'sg-009': { id: 'sg-009', name: 'storage-nodes', policy: 'Affinity' },
  'sg-010': { id: 'sg-010', name: 'load-balancers', policy: 'Anti-affinity' },
};

const defaultServerGroupDetail: ServerGroupDetail = {
  id: 'unknown',
  name: 'Unknown Server group',
  policy: '-',
};

const mockServerGroupInstances: ServerGroupInstance[] = [
  {
    id: '29tgj234',
    name: 'web-server-01',
    status: 'active',
    locked: true,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj235',
    name: 'web-server-01',
    status: 'active',
    locked: true,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj236',
    name: 'web-server-01',
    status: 'active',
    locked: true,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj237',
    name: 'web-server-01',
    status: 'error',
    locked: false,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj238',
    name: 'web-server-01',
    status: 'active',
    locked: true,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj239',
    name: 'web-server-01',
    status: 'shutoff',
    locked: false,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj240',
    name: 'web-server-01',
    status: 'active',
    locked: true,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj241',
    name: 'web-server-01',
    status: 'active',
    locked: false,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj242',
    name: 'web-server-01',
    status: 'building',
    locked: false,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj243',
    name: 'web-server-01',
    status: 'active',
    locked: true,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj244',
    name: 'web-server-01',
    status: 'paused',
    locked: false,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
];

/* ----------------------------------------
   Server group Detail Page
   ---------------------------------------- */

export function ServerGroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'instances';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Instance search and pagination state
  const [instanceSearchQuery, setInstanceSearchQuery] = useState('');
  const [instanceCurrentPage, setInstanceCurrentPage] = useState(1);
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);
  const instancesPerPage = 10;

  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Get server group data based on URL ID
  const serverGroup = id
    ? mockServerGroupsMap[id] || defaultServerGroupDetail
    : defaultServerGroupDetail;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label to server group name
  useEffect(() => {
    if (serverGroup.name) {
      updateActiveTabLabel(serverGroup.name);
    }
  }, [serverGroup.name, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Proj-1', href: '/' },
    { label: 'Server group', href: '/compute/server-groups' },
    { label: serverGroup.name },
  ];

  // Filter instances
  const filteredInstances = useMemo(() => {
    if (!instanceSearchQuery) return mockServerGroupInstances;
    const query = instanceSearchQuery.toLowerCase();
    return mockServerGroupInstances.filter(
      (inst) =>
        inst.name.toLowerCase().includes(query) ||
        inst.id.toLowerCase().includes(query) ||
        inst.image.toLowerCase().includes(query) ||
        inst.fixedIP.toLowerCase().includes(query)
    );
  }, [instanceSearchQuery]);

  const instanceTotalPages = Math.ceil(filteredInstances.length / instancesPerPage);

  const paginatedInstances = useMemo(() => {
    const start = (instanceCurrentPage - 1) * instancesPerPage;
    return filteredInstances.slice(start, start + instancesPerPage);
  }, [filteredInstances, instanceCurrentPage, instancesPerPage]);

  // Context menu items for instances
  const getInstanceContextMenuItems = (instance: ServerGroupInstance): ContextMenuItem[] => [
    { id: 'console', label: 'Console', onClick: () => console.log('Console', instance.id) },
    { id: 'start', label: 'Start', onClick: () => console.log('Start', instance.id) },
    { id: 'stop', label: 'Stop', onClick: () => console.log('Stop', instance.id) },
    { id: 'reboot', label: 'Reboot', onClick: () => console.log('Reboot', instance.id) },
    { id: 'divider1', type: 'divider' },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete', instance.id),
    },
  ];

  // Instance table columns
  const instanceColumns: TableColumn<ServerGroupInstance>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator layout="icon-only" status={row.status} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute/instances/${row.id}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'locked',
      label: 'Locked',
      width: fixedColumns.locked,
      align: 'center',
      render: (_, row) =>
        row.locked ? (
          <IconLock size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
        ) : (
          <IconLockOpen size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
        ),
    },
    {
      key: 'fixedIP',
      label: 'Fixed IP',
      flex: 1,
      minWidth: columnMinWidths.fixedIp,
    },
    {
      key: 'floatingIP',
      label: 'Floating IP',
      flex: 1,
      minWidth: columnMinWidths.fixedIp,
      render: (value) => (
        <Link
          to="#"
          className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {value}
        </Link>
      ),
    },
    {
      key: 'az',
      label: 'AZ',
      flex: 1,
      minWidth: columnMinWidths.az,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'os',
      label: 'OS',
      flex: 1,
      minWidth: 120,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <HStack gap={1} className="justify-center">
          <button
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Open console for', row.id);
            }}
            title="Open console"
          >
            <IconTerminal2 size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
          </button>
          <ContextMenu
            items={getInstanceContextMenuItems(row)}
            trigger={
              <button
                className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
                onClick={(e) => e.stopPropagation()}
              >
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--action-icon-color)]"
                />
              </button>
            }
          />
        </HStack>
      ),
    },
  ];

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
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6} className="min-w-[1176px]">
        {/* Detail header */}
        <DetailHeader>
          <DetailHeader.Title>{serverGroup.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
            >
              Create instance
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} stroke={1.5} />}>
              Delete
            </Button>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="ID" value={serverGroup.id} copyable />
            <DetailHeader.InfoCard label="Policy" value={serverGroup.policy} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs Content */}
        <div className="w-full">
          <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
            <TabList>
              <Tab value="instances">Instances</Tab>
            </TabList>

            {/* Instances Tab */}
            <TabPanel value="instances" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Section Header */}
                <h2 className="text-heading-h5 text-[var(--color-text-default)]">Instances</h2>

                {/* Search */}
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

                {/* Pagination */}
                <Pagination
                  currentPage={instanceCurrentPage}
                  totalPages={instanceTotalPages}
                  onPageChange={setInstanceCurrentPage}
                  totalItems={filteredInstances.length}
                  selectedCount={selectedInstances.length}
                />

                {/* Instances Table */}
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
    </PageShell>
  );
}

export default ServerGroupDetailPage;
