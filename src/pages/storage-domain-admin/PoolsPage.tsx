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
  PageShell,
  PageHeader,
  STATUS_THRESHOLDS,
  type TableColumn,
  columnMinWidths,
  BadgeList,
} from '@/design-system';
import { StorageDomainAdminSidebar as StorageSidebar } from '@/components/StorageDomainAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconDownload } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';

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
    applications: 'rbd',
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
    applications: 'rbd',
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
    applications: 'rbd',
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
    applications: 'rbd',
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
  // Determine color based on default thresholds (70 warning, 90 danger)
  const getStatusColor = (value: number): string => {
    const { warning, danger } = STATUS_THRESHOLDS.storage;
    if (value >= danger) return 'var(--color-state-danger)';
    if (value >= warning) return 'var(--color-state-warning)';
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

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filter pools based on search
  const filteredPools = useMemo(
    () =>
      mockPools.filter(
        (pool) =>
          pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pool.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pool.applications.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
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
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <Link
          to={`/storage-domain-admin/pools/${row.id}`}
          className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'dataProtection',
      label: 'Data protection',
      flex: 1,
      minWidth: columnMinWidths.dataProtection,
      sortable: false,
    },
    {
      key: 'applications',
      label: 'Applications',
      flex: 1,
      minWidth: columnMinWidths.applications,
      sortable: true,
    },
    {
      key: 'pgStatus',
      label: 'PG Status',
      flex: 1,
      minWidth: columnMinWidths.pgStatus,
      sortable: true,
      render: (_, row) => (
        <BadgeList
          items={row.pgStatus}
          maxVisible={2}
          maxBadgeWidth="140px"
          popoverTitle={`PG Status (${row.pgStatus.length})`}
        />
      ),
    },
    {
      key: 'crushRuleset',
      label: 'Crush ruleset',
      flex: 1,
      minWidth: columnMinWidths.crushRuleset,
      sortable: true,
    },
    {
      key: 'usagePercent',
      label: 'Usage',
      flex: 1,
      minWidth: columnMinWidths.usagePercent,
      sortable: true,
      render: (_, row) => <UsageCell percent={row.usagePercent} />,
    },
    {
      key: 'readOps',
      label: 'Read ops',
      flex: 1,
      minWidth: columnMinWidths.readOps,
      sortable: false,
    },
    {
      key: 'writeOps',
      label: 'Write ops',
      flex: 1,
      minWidth: columnMinWidths.writeOps,
      sortable: false,
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
          breadcrumb={<Breadcrumb items={[{ label: 'Pools' }]} />}
        />
      }
    >
      <VStack gap={3}>
        {/* Page Header */}
        <PageHeader title="Pools" />

        {/* Search and Actions */}
        <div className="flex items-center gap-1">
          <div className="w-[var(--search-input-width)]">
            <SearchInput
              placeholder="Search pools by attributes"
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
            icon={<IconDownload size={12} stroke={1.5} />}
            aria-label="Download"
            onClick={() => console.log('Download clicked')}
          />
          <Button
            variant="secondary"
            size="sm"
            icon={<IconRefresh size={12} stroke={1.5} />}
            aria-label="Refresh"
            onClick={() => console.log('Refresh clicked')}
          />
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredPools.length}
          showSettings
          onSettingsClick={() => console.log('Settings clicked')}
        />

        {/* Pools Table */}
        <Table<Pool>
          columns={columns}
          data={paginatedPools}
          rowKey="id"
          emptyMessage="No pools found"
          loading={loading}
        />
      </VStack>
    </PageShell>
  );
}

export default PoolsPage;
