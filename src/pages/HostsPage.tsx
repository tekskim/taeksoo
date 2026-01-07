import { useState, useMemo } from 'react';
import {
  Button,
  SearchInput,
  Table,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  StatusIndicator,
  Chip,
  type TableColumn,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconRefresh,
  IconBell,
  IconTrash,
  IconDownload,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

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
   Status Cell Component
   ---------------------------------------- */

interface StatusCellProps {
  status: Host['status'];
}

function StatusCell({ status }: StatusCellProps) {
  // Map host status to StatusIndicator status types
  const statusMap: Record<Host['status'], 'active' | 'maintenance' | 'down'> = {
    available: 'active',
    maintenance: 'maintenance',
    offline: 'down',
  };

  return (
    <StatusIndicator status={statusMap[status]} layout="icon-only" size="sm" />
  );
}

/* ----------------------------------------
   Labels Cell Component
   ---------------------------------------- */

interface LabelsCellProps {
  labels: string[];
}

function LabelsCell({ labels }: LabelsCellProps) {
  if (labels.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {labels.map((label, index) => (
        <Chip key={index} value={label} />
      ))}
    </div>
  );
}

/* ----------------------------------------
   Model Cell Component
   ---------------------------------------- */

interface ModelCellProps {
  model: string;
  modelDetail: string;
}

function ModelCell({ model, modelDetail }: ModelCellProps) {
  return (
    <div className="flex flex-col">
      <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
        {model}
      </span>
      <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
        ({modelDetail})
      </span>
    </div>
  );
}

/* ----------------------------------------
   Hosts Page
   ---------------------------------------- */

export function HostsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filter hosts based on search
  const filteredHosts = useMemo(() =>
    mockHosts.filter((host) =>
      host.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.labels.some(label => label.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [searchQuery]
  );

  const totalPages = Math.ceil(filteredHosts.length / rowsPerPage);

  // Get paginated data
  const paginatedHosts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredHosts.slice(start, start + rowsPerPage);
  }, [filteredHosts, currentPage, rowsPerPage]);

  // Table columns definition
  const columns: TableColumn<Host>[] = [
    {
      key: 'status',
      label: 'Status',
      width: 56,
      sortable: false,
      align: 'center',
      render: (_, row) => <StatusCell status={row.status} />,
    },
    {
      key: 'hostname',
      label: 'Hostname',
      flex: 1.2,
      sortable: true,
      render: (_, row) => (
        <Link
          to={`/storage/hosts/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
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
      sortable: false,
      render: (_, row) => <LabelsCell labels={row.labels} />,
    },
    {
      key: 'model',
      label: 'Model',
      flex: 1.2,
      sortable: true,
      render: (_, row) => <ModelCell model={row.model} modelDetail={row.modelDetail} />,
    },
    {
      key: 'cpus',
      label: 'CPUs',
      width: 70,
      sortable: true,
    },
    {
      key: 'cores',
      label: 'Cores',
      width: 70,
      sortable: true,
    },
    {
      key: 'totalMemory',
      label: 'Total Memory',
      width: 100,
      sortable: true,
    },
    {
      key: 'rawCapacity',
      label: 'Raw Capacity',
      width: 100,
      sortable: true,
    },
    {
      key: 'hdds',
      label: 'HDDs',
      width: 70,
      sortable: true,
    },
    {
      key: 'flash',
      label: 'Flash',
      width: 70,
      sortable: true,
    },
    {
      key: 'nics',
      label: 'NICs',
      width: 70,
      sortable: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[200px]' : 'left-0'}`}
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

          {/* Top Bar with Breadcrumb Navigation */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/storage' },
                  { label: 'Hosts' },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                  Hosts
                </h1>
              </div>

              {/* Search and Actions */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Search users by attributes"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClear={() => setSearchQuery('')}
                      size="sm"
                      fullWidth
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<IconDownload size={14} stroke={1.5} />}
                    aria-label="Download"
                    onClick={() => console.log('Download clicked')}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<IconRefresh size={14} stroke={1.5} />}
                    aria-label="Refresh"
                    onClick={() => console.log('Refresh clicked')}
                  />
                </div>
                <div className="w-px h-4 bg-[var(--color-border-default)]" />
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<IconTrash size={14} stroke={1.5} />}
                  onClick={() => console.log('Delete clicked')}
                >
                  Delete
                </Button>
              </div>

              {/* Pagination */}
              {filteredHosts.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showSettings
                  onSettingsClick={() => console.log('Settings clicked')}
                  totalItems={filteredHosts.length}
                />
              )}

              {/* Hosts Table */}
              <Table<Host>
                columns={columns}
                data={paginatedHosts}
                rowKey="id"
                emptyMessage="No hosts found"
              />
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HostsPage;

