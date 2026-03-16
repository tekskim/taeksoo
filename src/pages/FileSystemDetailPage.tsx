import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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
  PageShell,
  ProgressBar,
  STATUS_THRESHOLDS,
  columnMinWidths,
  type TableColumn,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconTrash, IconEdit } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface FileSystemDetail {
  id: string;
  name: string;
  enabled: boolean;
  created: string;
  standbyDaemons: string;
}

interface Rank {
  id: string;
  rank: number;
  state: string;
  daemon: string;
  activity: string;
  dentries: string;
  inodes: string;
  dirs: string;
  caps: string;
}

interface Pool {
  id: string;
  pool: string;
  type: string;
  size: string;
  usageValue: number;
  usageMax: number;
}

interface Directory {
  id: string;
  path: string;
}

interface Subvolume {
  id: string;
  name: string;
  status: string;
  size: string;
  dataPool: string;
  created: string;
}

interface SubvolumeGroup {
  id: string;
  name: string;
  dataPool: string;
  mode: string;
}

interface Snapshot {
  id: string;
  name: string;
  path: string;
  created: string;
}

interface SnapshotSchedule {
  id: string;
  path: string;
  schedule: string;
  retention: string;
  status: string;
  created: string;
}

interface Client {
  id: string;
  clientId: string;
  hostname: string;
  root: string;
  version: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFileSystemDetails: Record<string, FileSystemDetail> = {
  'fs-1': {
    id: 'fs-1',
    name: 'ai-platform',
    enabled: true,
    created: '5 months ago',
    standbyDaemons:
      'perf-test.bdv2kr1-cephobj02.wysejgk, ai-platform.bdv2kr1-cephobj-cit02.vinzy, perf-test-hdd.bdv2kr1-cephobj01.wfbtcv',
  },
  'fs-2': {
    id: 'fs-2',
    name: 'perf-test',
    enabled: true,
    created: 'A month ago',
    standbyDaemons: 'ai-platform.bdv2kr1-cephobj03.hrfkwyy, perf-test-hdd.bdv2kr1-cephobj01.wfbtcv',
  },
  'fs-3': {
    id: 'fs-3',
    name: 'perf-test-hdd',
    enabled: true,
    created: 'A month ago',
    standbyDaemons: 'ai-platform.bdv2kr1-cephobj03.hrfkwyy, perf-test.bdv2kr1-cephobj02.wysejgk',
  },
};

const mockRanks: Record<string, Rank[]> = {
  'fs-1': [
    {
      id: 'rank-1',
      rank: 0,
      state: 'active',
      daemon: 'ai-platform.bdv2kr1-cephobj03.hrfkwyy',
      activity: 'Reqs: 101 /s',
      dentries: '1.3 M',
      inodes: '1.3 M',
      dirs: '92.4 k',
      caps: '328.3 k',
    },
  ],
  'fs-2': [
    {
      id: 'rank-1',
      rank: 0,
      state: 'active',
      daemon: 'perf-test.bdv2kr1-cephobj02.wysejgk',
      activity: 'Reqs: 54 /s',
      dentries: '820 k',
      inodes: '820 k',
      dirs: '45.1 k',
      caps: '156.2 k',
    },
  ],
  'fs-3': [
    {
      id: 'rank-1',
      rank: 0,
      state: 'active',
      daemon: 'perf-test-hdd.bdv2kr1-cephobj01.wfbtcv',
      activity: 'Reqs: 32 /s',
      dentries: '450 k',
      inodes: '450 k',
      dirs: '22.3 k',
      caps: '89.7 k',
    },
  ],
};

const mockPools: Record<string, Pool[]> = {
  'fs-1': [
    {
      id: 'pool-1',
      pool: 'cephfs.ai-platform.data',
      type: 'data',
      size: '70.2 TiB',
      usageValue: 25,
      usageMax: 100,
    },
    {
      id: 'pool-2',
      pool: 'cephfs.ai-platform.meta',
      type: 'metadata',
      size: '10.1 TiB',
      usageValue: 0.5,
      usageMax: 100,
    },
  ],
  'fs-2': [
    {
      id: 'pool-1',
      pool: 'cephfs.perf-test.data',
      type: 'data',
      size: '50.0 TiB',
      usageValue: 18,
      usageMax: 100,
    },
    {
      id: 'pool-2',
      pool: 'cephfs.perf-test.meta',
      type: 'metadata',
      size: '8.5 TiB',
      usageValue: 0.3,
      usageMax: 100,
    },
  ],
  'fs-3': [
    {
      id: 'pool-1',
      pool: 'cephfs.perf-test-hdd.data',
      type: 'data',
      size: '120.0 TiB',
      usageValue: 42,
      usageMax: 100,
    },
    {
      id: 'pool-2',
      pool: 'cephfs.perf-test-hdd.meta',
      type: 'metadata',
      size: '12.0 TiB',
      usageValue: 1.2,
      usageMax: 100,
    },
  ],
};

const mockDirectories: Directory[] = [
  { id: 'dir-1', path: '/volumes' },
  { id: 'dir-2', path: '/volumes/_nogroup' },
  { id: 'dir-3', path: '/volumes/_nogroup/data' },
];

const mockSubvolumes: Subvolume[] = [
  {
    id: 'sv-1',
    name: 'data',
    status: 'Complete',
    size: '10 GiB',
    dataPool: 'cephfs.ai-platform.data',
    created: '5 months ago',
  },
];

const mockSubvolumeGroups: SubvolumeGroup[] = [
  {
    id: 'svg-1',
    name: '_nogroup',
    dataPool: 'cephfs.ai-platform.data',
    mode: '755',
  },
];

const mockSnapshots: Snapshot[] = [];

const mockSnapshotSchedules: SnapshotSchedule[] = [];

const mockClients: Client[] = [
  {
    id: 'client-1',
    clientId: '46990',
    hostname: 'nfs.ai-platform.cephfs-01',
    root: '/',
    version: 'ceph version 18.2.4',
  },
  {
    id: 'client-2',
    clientId: '47112',
    hostname: 'nfs.ai-platform.cephfs-02',
    root: '/',
    version: 'ceph version 18.2.4',
  },
  {
    id: 'client-3',
    clientId: '48203',
    hostname: 'nfs.perf-test.cephfs-01',
    root: '/volumes/_nogroup/data',
    version: 'ceph version 18.2.4',
  },
  {
    id: 'client-4',
    clientId: '49501',
    hostname: 'nfs.perf-test-hdd.cephfs-01',
    root: '/volumes/_nogroup/data',
    version: 'ceph version 18.2.4',
  },
];

/* ----------------------------------------
   File System Detail Page
   ---------------------------------------- */

export function FileSystemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const fsData = id ? mockFileSystemDetails[id] : undefined;

  useEffect(() => {
    if (fsData?.name) {
      updateActiveTabLabel(fsData.name);
    }
  }, [fsData?.name, updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const ranks = id ? mockRanks[id] || [] : [];
  const pools = id ? mockPools[id] || [] : [];

  const rankColumns: TableColumn<Rank>[] = [
    { key: 'rank', label: 'Rank', width: 60, sortable: true },
    { key: 'state', label: 'State', flex: 1, minWidth: 70, sortable: true },
    { key: 'daemon', label: 'Daemon', flex: 2, minWidth: 140, sortable: true },
    { key: 'activity', label: 'Activity', flex: 1, minWidth: 100, sortable: true },
    { key: 'dentries', label: 'Dentries', flex: 1, minWidth: 80, sortable: true },
    { key: 'inodes', label: 'Inodes', flex: 1, minWidth: 80, sortable: true },
    { key: 'dirs', label: 'Dirs', flex: 1, minWidth: 70, sortable: true },
    { key: 'caps', label: 'Caps', flex: 1, minWidth: 70, sortable: true },
  ];

  const poolColumns: TableColumn<Pool>[] = [
    { key: 'pool', label: 'Pool', flex: 2, minWidth: 160, sortable: true },
    { key: 'type', label: 'Type', flex: 1, minWidth: 80, sortable: true },
    { key: 'size', label: 'Size', flex: 1, minWidth: 80, sortable: true },
    {
      key: 'usageValue',
      label: 'Usage',
      flex: 2,
      minWidth: 120,
      sortable: true,
      render: (_, row) => (
        <ProgressBar
          value={row.usageValue}
          max={row.usageMax}
          showValue={false}
          size="sm"
          thresholds={STATUS_THRESHOLDS.storage}
          label={`${Math.round(row.usageValue)}%`}
        />
      ),
    },
  ];

  const directoryColumns: TableColumn<Directory>[] = [
    {
      key: 'path',
      label: 'Path',
      flex: 1,
      minWidth: columnMinWidths.nameWide,
      sortable: true,
    },
  ];

  const subvolumeColumns: TableColumn<Subvolume>[] = [
    { key: 'name', label: 'Name', flex: 1, minWidth: columnMinWidths.name, sortable: true },
    { key: 'status', label: 'Status', flex: 1, minWidth: columnMinWidths.status, sortable: true },
    { key: 'size', label: 'Size', flex: 1, minWidth: columnMinWidths.status, sortable: true },
    {
      key: 'dataPool',
      label: 'Data pool',
      flex: 1,
      minWidth: columnMinWidths.owner,
      sortable: true,
    },
    {
      key: 'created',
      label: 'Created',
      flex: 1,
      minWidth: columnMinWidths.creationDate,
      sortable: true,
    },
  ];

  const subvolumeGroupColumns: TableColumn<SubvolumeGroup>[] = [
    { key: 'name', label: 'Name', flex: 1, minWidth: columnMinWidths.name, sortable: true },
    {
      key: 'dataPool',
      label: 'Data pool',
      flex: 1,
      minWidth: columnMinWidths.owner,
      sortable: true,
    },
    { key: 'mode', label: 'Mode', flex: 1, minWidth: columnMinWidths.status, sortable: true },
  ];

  const snapshotColumns: TableColumn<Snapshot>[] = [
    { key: 'name', label: 'Name', flex: 1, minWidth: columnMinWidths.name, sortable: true },
    { key: 'path', label: 'Path', flex: 2, minWidth: columnMinWidths.nameWide, sortable: true },
    {
      key: 'created',
      label: 'Created',
      flex: 1,
      minWidth: columnMinWidths.creationDate,
      sortable: true,
    },
  ];

  const snapshotScheduleColumns: TableColumn<SnapshotSchedule>[] = [
    { key: 'path', label: 'Path', flex: 2, minWidth: columnMinWidths.nameWide, sortable: true },
    {
      key: 'schedule',
      label: 'Schedule',
      flex: 1,
      minWidth: columnMinWidths.status,
      sortable: true,
    },
    {
      key: 'retention',
      label: 'Retention',
      flex: 1,
      minWidth: columnMinWidths.status,
      sortable: true,
    },
    { key: 'status', label: 'Status', flex: 1, minWidth: columnMinWidths.status, sortable: true },
    {
      key: 'created',
      label: 'Created',
      flex: 1,
      minWidth: columnMinWidths.creationDate,
      sortable: true,
    },
  ];

  const clientColumns: TableColumn<Client>[] = [
    {
      key: 'clientId',
      label: 'Client ID',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
    },
    {
      key: 'hostname',
      label: 'Hostname',
      flex: 2,
      minWidth: columnMinWidths.nameWide,
      sortable: true,
    },
    { key: 'root', label: 'Root', flex: 1, minWidth: columnMinWidths.owner, sortable: true },
    {
      key: 'version',
      label: 'Version',
      flex: 1,
      minWidth: columnMinWidths.owner,
      sortable: true,
    },
  ];

  if (!fsData) {
    return (
      <PageShell
        sidebar={
          <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
        }
        sidebarWidth={sidebarWidth}
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
                  { label: 'Home', href: '/storage' },
                  { label: 'File Systems', href: '/storage/file-systems' },
                  { label: 'Not Found' },
                ]}
              />
            }
          />
        }
      >
        <div className="p-8 text-[var(--color-text-muted)]">File system not found.</div>
      </PageShell>
    );
  }

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
            <Breadcrumb
              items={[
                { label: 'Home', href: '/storage' },
                { label: 'File Systems', href: '/storage/file-systems' },
                { label: fsData.name },
              ]}
            />
          }
          actions={
            <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      <VStack gap={6} className="min-w-[1176px]">
        <DetailHeader>
          <DetailHeader.Title>{fsData.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} stroke={1.5} />}>
              Delete
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} stroke={1.5} />}>
              Edit
            </Button>
          </DetailHeader.Actions>
        </DetailHeader>

        <div className="w-full">
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
            <TabList>
              <Tab value="details">Details</Tab>
              <Tab value="directories">Directories</Tab>
              <Tab value="subvolumes">Subvolumes</Tab>
              <Tab value="subvolume-groups">Subvolume groups</Tab>
              <Tab value="snapshots">Snapshots</Tab>
              <Tab value="snapshot-schedules">Snapshot schedules</Tab>
              <Tab value="clients">
                <span className="flex items-center gap-1.5">
                  Clients
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-default)] text-label-xs">
                    {mockClients.length}
                  </span>
                </span>
              </Tab>
              <Tab value="performance">Performance Details</Tab>
            </TabList>

            {/* Details */}
            <TabPanel value="details" className="pt-4">
              <VStack gap={6}>
                {/* Ranks */}
                <SectionCard>
                  <SectionCard.Header title="Ranks" />
                  <SectionCard.Content>
                    <Table<Rank>
                      columns={rankColumns}
                      data={ranks}
                      rowKey="id"
                      emptyMessage="No data to display"
                    />
                    <div className="mt-2 text-body-sm text-[var(--color-text-muted)]">
                      {ranks.length} total
                    </div>
                  </SectionCard.Content>
                </SectionCard>

                {/* Pools */}
                <SectionCard>
                  <SectionCard.Header title="Pools" />
                  <SectionCard.Content>
                    <Table<Pool>
                      columns={poolColumns}
                      data={pools}
                      rowKey="id"
                      emptyMessage="No data to display"
                    />
                    <div className="mt-2 text-body-sm text-[var(--color-text-muted)]">
                      {pools.length} total
                    </div>
                  </SectionCard.Content>
                </SectionCard>

                {/* Standbys */}
                <SectionCard>
                  <SectionCard.Header title="Standbys" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Standby daemons" value={fsData.standbyDaemons} />
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>

            {/* Directories */}
            <TabPanel value="directories" className="pt-4">
              <Table<Directory>
                columns={directoryColumns}
                data={mockDirectories}
                rowKey="id"
                emptyMessage="No data to display"
              />
              <div className="mt-2 text-body-sm text-[var(--color-text-muted)]">
                {mockDirectories.length} total
              </div>
            </TabPanel>

            {/* Subvolumes */}
            <TabPanel value="subvolumes" className="pt-4">
              <Table<Subvolume>
                columns={subvolumeColumns}
                data={mockSubvolumes}
                rowKey="id"
                emptyMessage="No data to display"
              />
              <div className="mt-2 text-body-sm text-[var(--color-text-muted)]">
                {mockSubvolumes.length} total
              </div>
            </TabPanel>

            {/* Subvolume groups */}
            <TabPanel value="subvolume-groups" className="pt-4">
              <Table<SubvolumeGroup>
                columns={subvolumeGroupColumns}
                data={mockSubvolumeGroups}
                rowKey="id"
                emptyMessage="No data to display"
              />
              <div className="mt-2 text-body-sm text-[var(--color-text-muted)]">
                {mockSubvolumeGroups.length} total
              </div>
            </TabPanel>

            {/* Snapshots */}
            <TabPanel value="snapshots" className="pt-4">
              <Table<Snapshot>
                columns={snapshotColumns}
                data={mockSnapshots}
                rowKey="id"
                emptyMessage="No data to display"
              />
              <div className="mt-2 text-body-sm text-[var(--color-text-muted)]">
                {mockSnapshots.length} total
              </div>
            </TabPanel>

            {/* Snapshot schedules */}
            <TabPanel value="snapshot-schedules" className="pt-4">
              <Table<SnapshotSchedule>
                columns={snapshotScheduleColumns}
                data={mockSnapshotSchedules}
                rowKey="id"
                emptyMessage="No data to display"
              />
              <div className="mt-2 text-body-sm text-[var(--color-text-muted)]">
                {mockSnapshotSchedules.length} total
              </div>
            </TabPanel>

            {/* Clients */}
            <TabPanel value="clients" className="pt-4">
              <Table<Client>
                columns={clientColumns}
                data={mockClients}
                rowKey="id"
                emptyMessage="No data to display"
              />
              <div className="mt-2 text-body-sm text-[var(--color-text-muted)]">
                {mockClients.length} total
              </div>
            </TabPanel>

            {/* Performance Details */}
            <TabPanel value="performance" className="pt-4">
              <SectionCard>
                <SectionCard.Header title="Performance Details" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Read throughput" value="-" />
                  <SectionCard.DataRow label="Write throughput" value="-" />
                  <SectionCard.DataRow label="Read IOPS" value="-" />
                  <SectionCard.DataRow label="Write IOPS" value="-" />
                  <SectionCard.DataRow label="Read latency" value="-" />
                  <SectionCard.DataRow label="Write latency" value="-" />
                </SectionCard.Content>
              </SectionCard>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}

export default FileSystemDetailPage;
