import { useState, useMemo, useEffect } from 'react';
import {
  Button,
  SearchInput,
  Table,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Badge,
  BadgeList,
  PageShell,
  PageHeader,
  ListToolbar,
  columnMinWidths,
  type TableColumn,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconDownload, IconTrash } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface Host {
  id: string;
  status: 'available' | 'maintenance' | 'offline';
  hostname: string;
  labels: string[];
  model: string;
  modelDetail: string;
  cpus: number;
  cores: number;
  totalMemory: string;
  rawCapacity: string;
  hdds: number;
  flash: number;
  nics: number;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockHosts: Host[] = [
  {
    id: 'host-001',
    status: 'available',
    hostname: 'bzfv0rv1-cephadm-cl01',
    labels: [],
    model: 'ThinkSystem',
    modelDetail: 'ThinkSystem SR665 V3',
    cpus: 1,
    cores: 16,
    totalMemory: '93.9 GiB',
    rawCapacity: '93.9 GiB',
    hdds: 4,
    flash: 1,
    nics: 4,
  },
  {
    id: 'host-002',
    status: 'available',
    hostname: 'bzfv0rv1-cephadm-cl02',
    labels: [],
    model: 'ThinkSystem',
    modelDetail: 'ThinkSystem SR665 V3',
    cpus: 1,
    cores: 16,
    totalMemory: '93.9 GiB',
    rawCapacity: '93.9 GiB',
    hdds: 4,
    flash: 1,
    nics: 2,
  },
  {
    id: 'host-003',
    status: 'available',
    hostname: 'bzfv0rv1-cephadm-cl03',
    labels: ['admin'],
    model: 'ThinkSystem',
    modelDetail: 'ThinkSystem SR665 V3',
    cpus: 2,
    cores: 16,
    totalMemory: '125.5 GiB',
    rawCapacity: '23.5 TiB',
    hdds: 0,
    flash: 0,
    nics: 4,
  },
  {
    id: 'host-004',
    status: 'available',
    hostname: 'bzfv0rv1-cephadm002',
    labels: [],
    model: 'ThinkSystem',
    modelDetail: 'ThinkSystem SR665 V3',
    cpus: 2,
    cores: 16,
    totalMemory: '125.5 GiB',
    rawCapacity: '23.5 TiB',
    hdds: 0,
    flash: 0,
    nics: 4,
  },
  {
    id: 'host-005',
    status: 'available',
    hostname: 'bzfv0rv1-cephadm003',
    labels: [],
    model: 'ThinkSystem',
    modelDetail: 'ThinkSystem SR665 V3',
    cpus: 2,
    cores: 16,
    totalMemory: '125.5 GiB',
    rawCapacity: '23.5 TiB',
    hdds: 0,
    flash: 0,
    nics: 4,
  },
  {
    id: 'host-006',
    status: 'maintenance',
    hostname: 'bzfv0rv1-cephadm004',
    labels: ['osd', 'mon'],
    model: 'ThinkSystem',
    modelDetail: 'ThinkSystem SR665 V3',
    cpus: 2,
    cores: 32,
    totalMemory: '256 GiB',
    rawCapacity: '48 TiB',
    hdds: 8,
    flash: 2,
    nics: 6,
  },
  {
    id: 'host-007',
    status: 'offline',
    hostname: 'bzfv0rv1-cephadm005',
    labels: [],
    model: 'PowerEdge',
    modelDetail: 'Dell PowerEdge R750',
    cpus: 2,
    cores: 24,
    totalMemory: '128 GiB',
    rawCapacity: '16 TiB',
    hdds: 4,
    flash: 1,
    nics: 4,
  },
];

/* ----------------------------------------
   Labels Cell Component
   ---------------------------------------- */

/* ----------------------------------------
   Model Cell Component
   ---------------------------------------- */

interface ModelCellProps {
  model: string;
  modelDetail: string;
}

function ModelCell({ model, modelDetail }: ModelCellProps) {
  const fullText = `${model} (${modelDetail})`;
  return (
    <span
      className="truncate text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]"
      title={fullText}
    >
      {fullText}
    </span>
  );
}

/* ----------------------------------------
   Hosts Page
   ---------------------------------------- */

export function HostsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [loading, setLoading] = useState(true);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter hosts based on search
  const filteredHosts = useMemo(
    () =>
      mockHosts.filter(
        (host) =>
          host.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          host.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          host.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          host.labels.some((label) => label.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [searchQuery]
  );

  const totalPages = Math.ceil(filteredHosts.length / rowsPerPage);

  // Get paginated data
  const paginatedHosts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredHosts.slice(start, start + rowsPerPage);
  }, [filteredHosts, currentPage, rowsPerPage]);

  // Table columns definition (using fixedColumns / columnMinWidths preset)
  // Using minWidth for headers that need space, flex for expandable columns
  const columns: TableColumn<Host>[] = [
    {
      key: 'status',
      label: 'Status',
      width: 120,
      sortable: false,
      render: () => (
        <Badge variant="success" size="sm">
          Available
        </Badge>
      ),
    },
    {
      key: 'hostname',
      label: 'Hostname',
      flex: 1,
      minWidth: columnMinWidths.hostname,
      sortable: true,
      render: (_, row) => (
        <Link
          to={`/storage/hosts/${row.id}`}
          className="block truncate text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          title={row.hostname}
          onClick={(e) => e.stopPropagation()}
        >
          {row.hostname}
        </Link>
      ),
    },
    {
      key: 'labels',
      label: 'Labels',
      flex: 1,
      minWidth: columnMinWidths.labels,
      sortable: false,
      render: (_, row) => (
        <BadgeList
          items={row.labels}
          maxVisible={2}
          popoverTitle={`All Labels (${row.labels.length})`}
        />
      ),
    },
    {
      key: 'model',
      label: 'Model',
      flex: 1,
      minWidth: columnMinWidths.model,
      sortable: true,
      render: (_, row) => <ModelCell model={row.model} modelDetail={row.modelDetail} />,
    },
    {
      key: 'cpus',
      label: 'CPUs',
      flex: 1,
      minWidth: columnMinWidths.cpus,
      sortable: true,
    },
    {
      key: 'cores',
      label: 'Cores',
      flex: 1,
      minWidth: columnMinWidths.cores,
      sortable: true,
    },
    {
      key: 'totalMemory',
      label: 'Total memory',
      flex: 1,
      minWidth: columnMinWidths.totalMemory,
      sortable: true,
    },
    {
      key: 'rawCapacity',
      label: 'Raw capacity',
      flex: 1,
      minWidth: columnMinWidths.rawCapacity,
      sortable: true,
    },
    {
      key: 'hdds',
      label: 'HDDs',
      flex: 1,
      minWidth: columnMinWidths.hdds,
      sortable: true,
    },
    {
      key: 'flash',
      label: 'Flash',
      flex: 1,
      minWidth: columnMinWidths.flash,
      sortable: true,
    },
    {
      key: 'nics',
      label: 'NICs',
      flex: 1,
      minWidth: columnMinWidths.nics,
      sortable: true,
    },
  ];

  return (
    <PageShell
      sidebar={
        <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
      }
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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'Hosts' }]} />}
        />
      }
    >
      <VStack gap={3}>
        {/* Page Header */}
        <PageHeader title="Hosts" />

        {/* Search and Actions */}
        <ListToolbar
          showDivider={false}
          primaryActions={
            <ListToolbar.Actions>
              <div className="flex items-center gap-1">
                <SearchInput
                  placeholder="Search hosts by attributes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                  size="sm"
                  className="w-[var(--search-input-width)]"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<IconDownload size={12} stroke={1.5} />}
                  aria-label="Download"
                  onClick={() => console.log('Download clicked')}
                />
                <div className="flex items-center gap-2 ml-1">
                  <div className="w-px h-4 bg-[var(--color-border-default)]" />
                  <div className="flex items-center gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconRefresh size={12} stroke={1.5} />}
                      onClick={() => console.log('Refresh clicked')}
                    >
                      Refresh
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconTrash size={12} stroke={1.5} />}
                      onClick={() => console.log('Delete clicked')}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </ListToolbar.Actions>
          }
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showSettings
          onSettingsClick={() => console.log('Settings clicked')}
          totalItems={filteredHosts.length}
        />

        {/* Hosts Table */}
        <Table<Host>
          columns={columns}
          data={paginatedHosts}
          rowKey="id"
          emptyMessage="No hosts found"
          loading={loading}
        />
      </VStack>
    </PageShell>
  );
}

export default HostsPage;
