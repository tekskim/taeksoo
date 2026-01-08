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
  type TableColumn,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconRefresh,
  IconBell,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface Pool {
  id: string;
  name: string;
  dataProtection: string;
  applications: string;
  pgStatus: string[];
  crushRuleset: string;
  usagePercent: number;
  readOps: string;
  writeOps: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockPools: Pool[] = [
  {
    id: 'pool-001',
    name: 'volumes',
    dataProtection: 'EC: 2+1',
    applications: 'rgb',
    pgStatus: ['127 active+clean,', '1 active+clean', '+scrubbing+deep'],
    crushRuleset: 'rule_nvme',
    usagePercent: 88.17,
    readOps: '446.8 /s',
    writeOps: '54.8 /s',
  },
  {
    id: 'pool-002',
    name: 'images',
    dataProtection: 'replicas: 3',
    applications: 'rgb',
    pgStatus: ['32 active+clean'],
    crushRuleset: 'rule_nvme',
    usagePercent: 96.5,
    readOps: '0 /s',
    writeOps: '0 /s',
  },
  {
    id: 'pool-003',
    name: 'VMs',
    dataProtection: 'replicas: 3',
    applications: 'rgb',
    pgStatus: ['32 active+clean'],
    crushRuleset: 'rule_hdd',
    usagePercent: 72.3,
    readOps: '0 /s',
    writeOps: '0 /s',
  },
  {
    id: 'pool-004',
    name: 'backups',
    dataProtection: 'replicas: 3',
    applications: 'rbd',
    pgStatus: ['32 active+clean'],
    crushRuleset: 'rule_hdd',
    usagePercent: 0,
    readOps: '0 /s',
    writeOps: '0 /s',
  },
  {
    id: 'pool-005',
    name: 'Kubernetes PV',
    dataProtection: 'replicas: 3',
    applications: 'cephfs',
    pgStatus: ['16 active+clean'],
    crushRuleset: 'rule_hdd',
    usagePercent: 0,
    readOps: '0 /s',
    writeOps: '0 /s',
  },
  {
    id: 'pool-006',
    name: 'snapshots',
    dataProtection: 'EC: 4+2',
    applications: 'rgb',
    pgStatus: ['64 active+clean'],
    crushRuleset: 'rule_nvme',
    usagePercent: 45.2,
    readOps: '120.5 /s',
    writeOps: '32.1 /s',
  },
  {
    id: 'pool-007',
    name: 'metrics',
    dataProtection: 'replicas: 2',
    applications: 'rgw',
    pgStatus: ['16 active+clean'],
    crushRuleset: 'rule_ssd',
    usagePercent: 12.8,
    readOps: '890.2 /s',
    writeOps: '156.7 /s',
  },
];

/* ----------------------------------------
   Usage Cell Component
   ---------------------------------------- */

interface UsageCellProps {
  percent: number;
}

function UsageCell({ percent }: UsageCellProps) {
  // Determine color based on percentage thresholds
  const getStatusColor = (value: number): string => {
    if (value >= 95) return 'var(--color-state-danger)';
    if (value >= 85) return 'var(--color-state-warning)';
    return 'var(--color-state-success)';
  };

  return (
    <div className="flex flex-col gap-[var(--spacing-1)] w-full">
      <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
        {percent.toFixed(2)}%
      </span>
      <div className="h-1 w-full bg-[var(--color-border-subtle)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ 
            width: `${Math.min(percent, 100)}%`,
            backgroundColor: getStatusColor(percent),
          }}
        />
      </div>
    </div>
  );
}

/* ----------------------------------------
   Pools Page
   ---------------------------------------- */

export function PoolsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPools, setSelectedPools] = useState<string[]>([]);
  const rowsPerPage = 10;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filter pools based on search
  const filteredPools = useMemo(() =>
    mockPools.filter((pool) =>
      pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.applications.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]
  );

  const totalPages = Math.ceil(filteredPools.length / rowsPerPage);

  // Get paginated data
  const paginatedPools = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredPools.slice(start, start + rowsPerPage);
  }, [filteredPools, currentPage, rowsPerPage]);

  // Table columns definition
  const columns: TableColumn<Pool>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <Link
          to={`/storage/pools/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'dataProtection',
      label: 'Data Protection',
      flex: 1,
      sortable: false,
    },
    {
      key: 'applications',
      label: 'Applications',
      flex: 1,
      sortable: true,
    },
    {
      key: 'pgStatus',
      label: 'PG Status',
      flex: 1.2,
      sortable: true,
      render: (_, row) => {
        const fullText = row.pgStatus.join(' ');
        return (
          <div 
            className="line-clamp-2 text-[length:var(--table-font-size)] leading-[var(--table-line-height)]"
            title={fullText}
          >
            {fullText}
          </div>
        );
      },
    },
    {
      key: 'crushRuleset',
      label: 'Crush Ruleset',
      flex: 1,
      sortable: true,
    },
    {
      key: 'usagePercent',
      label: 'Usage',
      flex: 1.2,
      sortable: true,
      render: (_, row) => (
        <UsageCell percent={row.usagePercent} />
      ),
    },
    {
      key: 'readOps',
      label: 'Read ops',
      flex: 0.8,
      sortable: false,
    },
    {
      key: 'writeOps',
      label: 'Write ops',
      flex: 0.8,
      sortable: false,
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
            onTabReorder={moveTab}
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
                  { label: 'Pools' },
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
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                  Pools
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
                    icon={<IconRefresh size={14} stroke={1.5} />}
                    aria-label="Refresh"
                    onClick={() => console.log('Refresh clicked')}
                  />
                </div>
              </div>

              {/* Pagination */}
              {filteredPools.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showSettings
                  onSettingsClick={() => console.log('Settings clicked')}
                  totalItems={filteredPools.length}
                  selectedCount={selectedPools.length}
                />
              )}

              {/* Pools Table */}
              <Table<Pool>
                columns={columns}
                data={paginatedPools}
                rowKey="id"
                emptyMessage="No pools found"
                selectable
                selectedKeys={selectedPools}
                onSelectionChange={setSelectedPools}
              />
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PoolsPage;

