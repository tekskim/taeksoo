import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  Badge,
  ProgressBar,
  PageShell,
  PageHeader,
  STATUS_THRESHOLDS,
  type TableColumn,
  columnMinWidths,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconBell } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface OSD {
  id: number;
  host: string;
  status: ('in' | 'up' | 'out' | 'down')[];
  deviceClass: 'hdd' | 'ssd' | 'nvme';
  pgs: number;
  size: string;
  flags: string;
  usage: number;
  usageLabel: string;
  readOps: string;
  writeOps: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockOSDs: OSD[] = [
  {
    id: 1,
    host: 'bzv2krt1-ceph',
    status: ['in', 'up'],
    deviceClass: 'hdd',
    pgs: 153,
    size: '2.9 GiB',
    flags: '-',
    usage: 88.17,
    usageLabel: 'chunking',
    readOps: '61.2 /s',
    writeOps: '11 /s',
  },
  {
    id: 2,
    host: 'bzv2krt1-ceph',
    status: ['in', 'up'],
    deviceClass: 'hdd',
    pgs: 153,
    size: '2.9 GiB',
    flags: '-',
    usage: 88.17,
    usageLabel: 'chunking',
    readOps: '61.2 /s',
    writeOps: '11 /s',
  },
  {
    id: 3,
    host: 'bzv2krt1-ceph',
    status: ['in', 'up'],
    deviceClass: 'hdd',
    pgs: 153,
    size: '2.9 GiB',
    flags: '-',
    usage: 88.17,
    usageLabel: 'chunking',
    readOps: '61.2 /s',
    writeOps: '11 /s',
  },
  {
    id: 4,
    host: 'bzv2krt2-ceph',
    status: ['in', 'up'],
    deviceClass: 'ssd',
    pgs: 200,
    size: '4.5 GiB',
    flags: '-',
    usage: 72.5,
    usageLabel: 'active',
    readOps: '120.5 /s',
    writeOps: '45.2 /s',
  },
  {
    id: 5,
    host: 'bzv2krt2-ceph',
    status: ['out', 'down'],
    deviceClass: 'ssd',
    pgs: 0,
    size: '4.5 GiB',
    flags: 'noout',
    usage: 0,
    usageLabel: 'offline',
    readOps: '0 /s',
    writeOps: '0 /s',
  },
  {
    id: 6,
    host: 'bzv2krt3-ceph',
    status: ['in', 'up'],
    deviceClass: 'nvme',
    pgs: 312,
    size: '8.2 GiB',
    flags: '-',
    usage: 45.8,
    usageLabel: 'active',
    readOps: '250.3 /s',
    writeOps: '98.7 /s',
  },
];

/* ----------------------------------------
   ID Cell Component (Hyperlink)
   ---------------------------------------- */

interface IDCellProps {
  id: number;
}

function IDCell({ id }: IDCellProps) {
  return (
    <Link
      to={`/storage/osds/${id}`}
      className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
    >
      osd.{id}
    </Link>
  );
}

/* ----------------------------------------
   Status Cell Component
   ---------------------------------------- */

interface StatusCellProps {
  status: OSD['status'];
}

function StatusCell({ status }: StatusCellProps) {
  return (
    <div className="flex gap-0.5">
      {status.map((s, index) => (
        <Badge key={index} variant={s === 'in' || s === 'up' ? 'success' : 'default'} size="sm">
          {s}
        </Badge>
      ))}
    </div>
  );
}

/* ----------------------------------------
   Device Class Cell Component
   ---------------------------------------- */

interface DeviceClassCellProps {
  deviceClass: OSD['deviceClass'];
}

function DeviceClassCell({ deviceClass }: DeviceClassCellProps) {
  return (
    <Badge variant="info" size="sm">
      {deviceClass.toUpperCase()}
    </Badge>
  );
}

/* ----------------------------------------
   Usage Cell Component
   ---------------------------------------- */

interface UsageCellProps {
  usage: number;
}

function UsageCell({ usage }: UsageCellProps) {
  // Determine status based on storage thresholds (85 warning, 95 danger)
  const getUsageStatus = (percent: number): 'success' | 'warning' | 'danger' => {
    const { warning, danger } = STATUS_THRESHOLDS.storage;
    if (percent >= danger) return 'danger';
    if (percent >= warning) return 'warning';
    return 'success';
  };

  return (
    <div className="flex flex-col gap-1.5 w-[105px]">
      <span className="text-body-md text-[var(--color-text-default)]">{usage.toFixed(2)}%</span>
      <ProgressBar value={usage} max={100} status={getUsageStatus(usage)} />
    </div>
  );
}

/* ----------------------------------------
   OSDs Page
   ---------------------------------------- */

export function OSDsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filter OSDs based on search
  const filteredOSDs = useMemo(
    () =>
      mockOSDs.filter(
        (osd) =>
          osd.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
          osd.id.toString().includes(searchQuery) ||
          osd.deviceClass.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const totalPages = Math.ceil(filteredOSDs.length / rowsPerPage);

  // Get paginated data
  const paginatedOSDs = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredOSDs.slice(start, start + rowsPerPage);
  }, [filteredOSDs, currentPage, rowsPerPage]);

  // Table columns definition
  const columns: TableColumn<OSD>[] = [
    {
      key: 'id',
      label: 'ID',
      flex: 1,
      minWidth: columnMinWidths.id,
      sortable: true,
      render: (_, row) => <IDCell id={row.id} />,
    },
    {
      key: 'host',
      label: 'Host',
      flex: 1,
      minWidth: columnMinWidths.host,
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: false,
      render: (_, row) => <StatusCell status={row.status} />,
    },
    {
      key: 'deviceClass',
      label: 'Device class',
      flex: 1,
      minWidth: columnMinWidths.deviceClass,
      sortable: true,
      render: (_, row) => <DeviceClassCell deviceClass={row.deviceClass} />,
    },
    {
      key: 'pgs',
      label: 'PGs',
      flex: 1,
      minWidth: columnMinWidths.pgs,
      sortable: true,
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
    },
    {
      key: 'flags',
      label: 'Flags',
      flex: 1,
      minWidth: columnMinWidths.flags,
      sortable: false,
    },
    {
      key: 'usage',
      label: 'Usage',
      flex: 1,
      minWidth: columnMinWidths.usage,
      sortable: true,
      render: (_, row) => <UsageCell usage={row.usage} />,
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
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb items={[{ label: 'Home', href: '/storage' }, { label: 'OSDs' }]} />
          }
          actions={
            <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
          }
        />
      }
    >
      <VStack gap={3}>
        {/* Page Header */}
        <PageHeader title="OSDs" />

        {/* Search and Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-[var(--search-input-width)]">
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
              icon={<IconRefresh size={12} stroke={1.5} />}
              aria-label="Refresh"
              onClick={() => console.log('Refresh clicked')}
            />
          </div>
        </div>

        {/* Pagination */}
        {filteredOSDs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showSettings
            onSettingsClick={() => console.log('Settings clicked')}
            totalItems={filteredOSDs.length}
            itemsPerPage={rowsPerPage}
            showItemCount
          />
        )}

        {/* OSDs Table */}
        <Table<OSD>
          columns={columns}
          data={paginatedOSDs}
          rowKey="id"
          emptyMessage="No OSDs found"
        />
      </VStack>
    </PageShell>
  );
}

export default OSDsPage;
