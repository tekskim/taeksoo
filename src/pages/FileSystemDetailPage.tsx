import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
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
  DetailHeader,
  SectionCard,
  Table,
  SearchInput,
  Pagination,
  PageShell,
  ErrorState,
  ProgressBar,
  STATUS_THRESHOLDS,
  columnMinWidths,
  type TableColumn,
} from '@/design-system';
import { StorageSidebarResolver as StorageSidebar } from '@/components/StorageSidebarResolver';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconEdit } from '@tabler/icons-react';

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
  const navigate = useNavigate();
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

  const LIST_PAGE_SIZE = 10;

  const [ranksSearch, setRanksSearch] = useState('');
  const [ranksPage, setRanksPage] = useState(1);
  const [poolsSearch, setPoolsSearch] = useState('');
  const [poolsPage, setPoolsPage] = useState(1);
  const [directoriesSearch, setDirectoriesSearch] = useState('');
  const [directoriesPage, setDirectoriesPage] = useState(1);
  const [subvolumesSearch, setSubvolumesSearch] = useState('');
  const [subvolumesPage, setSubvolumesPage] = useState(1);
  const [subvolumeGroupsSearch, setSubvolumeGroupsSearch] = useState('');
  const [subvolumeGroupsPage, setSubvolumeGroupsPage] = useState(1);
  const [snapshotsSearch, setSnapshotsSearch] = useState('');
  const [snapshotsPage, setSnapshotsPage] = useState(1);
  const [snapshotSchedulesSearch, setSnapshotSchedulesSearch] = useState('');
  const [snapshotSchedulesPage, setSnapshotSchedulesPage] = useState(1);
  const [clientsSearch, setClientsSearch] = useState('');
  const [clientsPage, setClientsPage] = useState(1);

  const filteredRanks = useMemo(() => {
    const q = ranksSearch.trim().toLowerCase();
    if (!q) return ranks;
    return ranks.filter((r) => {
      const hay = [
        String(r.rank),
        r.state,
        r.daemon,
        r.activity,
        r.dentries,
        r.inodes,
        r.dirs,
        r.caps,
      ].join(' ');
      return hay.toLowerCase().includes(q);
    });
  }, [ranks, ranksSearch]);

  const paginatedRanks = useMemo(
    () => filteredRanks.slice((ranksPage - 1) * LIST_PAGE_SIZE, ranksPage * LIST_PAGE_SIZE),
    [filteredRanks, ranksPage]
  );

  const filteredPools = useMemo(() => {
    const q = poolsSearch.trim().toLowerCase();
    if (!q) return pools;
    return pools.filter((p) => {
      const hay = [p.pool, p.type, p.size, String(p.usageValue), String(p.usageMax)].join(' ');
      return hay.toLowerCase().includes(q);
    });
  }, [pools, poolsSearch]);

  const paginatedPools = useMemo(
    () => filteredPools.slice((poolsPage - 1) * LIST_PAGE_SIZE, poolsPage * LIST_PAGE_SIZE),
    [filteredPools, poolsPage]
  );

  const filteredDirectories = useMemo(() => {
    const q = directoriesSearch.trim().toLowerCase();
    if (!q) return mockDirectories;
    return mockDirectories.filter((d) => d.path.toLowerCase().includes(q));
  }, [directoriesSearch]);

  const paginatedDirectories = useMemo(
    () =>
      filteredDirectories.slice(
        (directoriesPage - 1) * LIST_PAGE_SIZE,
        directoriesPage * LIST_PAGE_SIZE
      ),
    [filteredDirectories, directoriesPage]
  );

  const filteredSubvolumes = useMemo(() => {
    const q = subvolumesSearch.trim().toLowerCase();
    if (!q) return mockSubvolumes;
    return mockSubvolumes.filter((s) => {
      const hay = [s.name, s.status, s.size, s.dataPool, s.created].join(' ');
      return hay.toLowerCase().includes(q);
    });
  }, [subvolumesSearch]);

  const paginatedSubvolumes = useMemo(
    () =>
      filteredSubvolumes.slice(
        (subvolumesPage - 1) * LIST_PAGE_SIZE,
        subvolumesPage * LIST_PAGE_SIZE
      ),
    [filteredSubvolumes, subvolumesPage]
  );

  const filteredSubvolumeGroups = useMemo(() => {
    const q = subvolumeGroupsSearch.trim().toLowerCase();
    if (!q) return mockSubvolumeGroups;
    return mockSubvolumeGroups.filter((g) => {
      const hay = [g.name, g.dataPool, g.mode].join(' ');
      return hay.toLowerCase().includes(q);
    });
  }, [subvolumeGroupsSearch]);

  const paginatedSubvolumeGroups = useMemo(
    () =>
      filteredSubvolumeGroups.slice(
        (subvolumeGroupsPage - 1) * LIST_PAGE_SIZE,
        subvolumeGroupsPage * LIST_PAGE_SIZE
      ),
    [filteredSubvolumeGroups, subvolumeGroupsPage]
  );

  const filteredSnapshots = useMemo(() => {
    const q = snapshotsSearch.trim().toLowerCase();
    if (!q) return mockSnapshots;
    return mockSnapshots.filter((s) => {
      const hay = [s.name, s.path, s.created].join(' ');
      return hay.toLowerCase().includes(q);
    });
  }, [snapshotsSearch]);

  const paginatedSnapshots = useMemo(
    () =>
      filteredSnapshots.slice((snapshotsPage - 1) * LIST_PAGE_SIZE, snapshotsPage * LIST_PAGE_SIZE),
    [filteredSnapshots, snapshotsPage]
  );

  const filteredSnapshotSchedules = useMemo(() => {
    const q = snapshotSchedulesSearch.trim().toLowerCase();
    if (!q) return mockSnapshotSchedules;
    return mockSnapshotSchedules.filter((s) => {
      const hay = [s.path, s.schedule, s.retention, s.status, s.created].join(' ');
      return hay.toLowerCase().includes(q);
    });
  }, [snapshotSchedulesSearch]);

  const paginatedSnapshotSchedules = useMemo(
    () =>
      filteredSnapshotSchedules.slice(
        (snapshotSchedulesPage - 1) * LIST_PAGE_SIZE,
        snapshotSchedulesPage * LIST_PAGE_SIZE
      ),
    [filteredSnapshotSchedules, snapshotSchedulesPage]
  );

  const filteredClients = useMemo(() => {
    const q = clientsSearch.trim().toLowerCase();
    if (!q) return mockClients;
    return mockClients.filter((c) => {
      const hay = [c.clientId, c.hostname, c.root, c.version].join(' ');
      return hay.toLowerCase().includes(q);
    });
  }, [clientsSearch]);

  const paginatedClients = useMemo(
    () => filteredClients.slice((clientsPage - 1) * LIST_PAGE_SIZE, clientsPage * LIST_PAGE_SIZE),
    [filteredClients, clientsPage]
  );

  useEffect(() => {
    setRanksPage(1);
  }, [ranksSearch]);

  useEffect(() => {
    setPoolsPage(1);
  }, [poolsSearch]);

  useEffect(() => {
    setDirectoriesPage(1);
  }, [directoriesSearch]);

  useEffect(() => {
    setSubvolumesPage(1);
  }, [subvolumesSearch]);

  useEffect(() => {
    setSubvolumeGroupsPage(1);
  }, [subvolumeGroupsSearch]);

  useEffect(() => {
    setSnapshotsPage(1);
  }, [snapshotsSearch]);

  useEffect(() => {
    setSnapshotSchedulesPage(1);
  }, [snapshotSchedulesSearch]);

  useEffect(() => {
    setClientsPage(1);
  }, [clientsSearch]);

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
            onBack={() => navigate(-1)}
            onForward={() => navigate(1)}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'File Systems', href: '/storage/file-systems' },
                  { label: 'Not Found' },
                ]}
              />
            }
          />
        }
      >
        <ErrorState
          title="File system not found"
          description="The requested file system could not be found."
          action={
            <Button variant="secondary" size="md" onClick={() => navigate('/storage/file-systems')}>
              Back to file systems
            </Button>
          }
        />
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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'File Systems', href: '/storage/file-systems' },
                { label: fsData.name },
              ]}
            />
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

        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="details">Details</Tab>
            <Tab value="directories">Directories</Tab>
            <Tab value="subvolumes">Subvolumes</Tab>
            <Tab value="subvolume-groups">Subvolume groups</Tab>
            <Tab value="snapshots">Snapshots</Tab>
            <Tab value="snapshot-schedules">Snapshot schedules</Tab>
            <Tab value="clients">Clients</Tab>
            <Tab value="performance">Performance Details</Tab>
          </TabList>

          {/* Details */}
          <TabPanel value="details" className="pt-4">
            <VStack gap={6}>
              {/* Ranks */}
              <SectionCard>
                <SectionCard.Header title="Ranks" />
                <SectionCard.Content showDividers={false} gap={3}>
                  <div className="w-[var(--search-input-width)]">
                    <SearchInput
                      placeholder="Search ranks by attributes"
                      size="sm"
                      fullWidth
                      value={ranksSearch}
                      onChange={(e) => setRanksSearch(e.target.value)}
                      onClear={() => setRanksSearch('')}
                    />
                  </div>
                  <Pagination
                    currentPage={ranksPage}
                    totalPages={Math.ceil(filteredRanks.length / LIST_PAGE_SIZE) || 1}
                    onPageChange={setRanksPage}
                    totalItems={filteredRanks.length}
                    itemsPerPage={LIST_PAGE_SIZE}
                    showItemCount
                  />
                  <Table<Rank>
                    columns={rankColumns}
                    data={paginatedRanks}
                    rowKey="id"
                    emptyMessage="No ranks found"
                  />
                </SectionCard.Content>
              </SectionCard>

              {/* Pools */}
              <SectionCard>
                <SectionCard.Header title="Pools" />
                <SectionCard.Content showDividers={false} gap={3}>
                  <div className="w-[var(--search-input-width)]">
                    <SearchInput
                      placeholder="Search pools by attributes"
                      size="sm"
                      fullWidth
                      value={poolsSearch}
                      onChange={(e) => setPoolsSearch(e.target.value)}
                      onClear={() => setPoolsSearch('')}
                    />
                  </div>
                  <Pagination
                    currentPage={poolsPage}
                    totalPages={Math.ceil(filteredPools.length / LIST_PAGE_SIZE) || 1}
                    onPageChange={setPoolsPage}
                    totalItems={filteredPools.length}
                    itemsPerPage={LIST_PAGE_SIZE}
                    showItemCount
                  />
                  <Table<Pool>
                    columns={poolColumns}
                    data={paginatedPools}
                    rowKey="id"
                    emptyMessage="No pools found"
                  />
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
          <TabPanel value="directories" className="pt-0">
            <VStack gap={4} className="pt-4">
              <div className="flex items-center h-7">
                <h3 className="text-heading-h5 text-[var(--color-text-default)]">Directories</h3>
              </div>
              <div className="w-[var(--search-input-width)]">
                <SearchInput
                  placeholder="Search directories by attributes"
                  size="sm"
                  fullWidth
                  value={directoriesSearch}
                  onChange={(e) => setDirectoriesSearch(e.target.value)}
                  onClear={() => setDirectoriesSearch('')}
                />
              </div>
              <Pagination
                currentPage={directoriesPage}
                totalPages={Math.ceil(filteredDirectories.length / LIST_PAGE_SIZE) || 1}
                onPageChange={setDirectoriesPage}
                totalItems={filteredDirectories.length}
                itemsPerPage={LIST_PAGE_SIZE}
                showItemCount
              />
              <Table<Directory>
                columns={directoryColumns}
                data={paginatedDirectories}
                rowKey="id"
                emptyMessage="No directories found"
              />
            </VStack>
          </TabPanel>

          {/* Subvolumes */}
          <TabPanel value="subvolumes" className="pt-0">
            <VStack gap={4} className="pt-4">
              <div className="flex items-center h-7">
                <h3 className="text-heading-h5 text-[var(--color-text-default)]">Subvolumes</h3>
              </div>
              <div className="w-[var(--search-input-width)]">
                <SearchInput
                  placeholder="Search subvolumes by attributes"
                  size="sm"
                  fullWidth
                  value={subvolumesSearch}
                  onChange={(e) => setSubvolumesSearch(e.target.value)}
                  onClear={() => setSubvolumesSearch('')}
                />
              </div>
              <Pagination
                currentPage={subvolumesPage}
                totalPages={Math.ceil(filteredSubvolumes.length / LIST_PAGE_SIZE) || 1}
                onPageChange={setSubvolumesPage}
                totalItems={filteredSubvolumes.length}
                itemsPerPage={LIST_PAGE_SIZE}
                showItemCount
              />
              <Table<Subvolume>
                columns={subvolumeColumns}
                data={paginatedSubvolumes}
                rowKey="id"
                emptyMessage="No subvolumes found"
              />
            </VStack>
          </TabPanel>

          {/* Subvolume groups */}
          <TabPanel value="subvolume-groups" className="pt-0">
            <VStack gap={4} className="pt-4">
              <div className="flex items-center h-7">
                <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                  Subvolume groups
                </h3>
              </div>
              <div className="w-[var(--search-input-width)]">
                <SearchInput
                  placeholder="Search subvolume groups by attributes"
                  size="sm"
                  fullWidth
                  value={subvolumeGroupsSearch}
                  onChange={(e) => setSubvolumeGroupsSearch(e.target.value)}
                  onClear={() => setSubvolumeGroupsSearch('')}
                />
              </div>
              <Pagination
                currentPage={subvolumeGroupsPage}
                totalPages={Math.ceil(filteredSubvolumeGroups.length / LIST_PAGE_SIZE) || 1}
                onPageChange={setSubvolumeGroupsPage}
                totalItems={filteredSubvolumeGroups.length}
                itemsPerPage={LIST_PAGE_SIZE}
                showItemCount
              />
              <Table<SubvolumeGroup>
                columns={subvolumeGroupColumns}
                data={paginatedSubvolumeGroups}
                rowKey="id"
                emptyMessage="No subvolume groups found"
              />
            </VStack>
          </TabPanel>

          {/* Snapshots */}
          <TabPanel value="snapshots" className="pt-0">
            <VStack gap={4} className="pt-4">
              <div className="flex items-center h-7">
                <h3 className="text-heading-h5 text-[var(--color-text-default)]">Snapshots</h3>
              </div>
              <div className="w-[var(--search-input-width)]">
                <SearchInput
                  placeholder="Search snapshots by attributes"
                  size="sm"
                  fullWidth
                  value={snapshotsSearch}
                  onChange={(e) => setSnapshotsSearch(e.target.value)}
                  onClear={() => setSnapshotsSearch('')}
                />
              </div>
              <Pagination
                currentPage={snapshotsPage}
                totalPages={Math.ceil(filteredSnapshots.length / LIST_PAGE_SIZE) || 1}
                onPageChange={setSnapshotsPage}
                totalItems={filteredSnapshots.length}
                itemsPerPage={LIST_PAGE_SIZE}
                showItemCount
              />
              <Table<Snapshot>
                columns={snapshotColumns}
                data={paginatedSnapshots}
                rowKey="id"
                emptyMessage="No snapshots found"
              />
            </VStack>
          </TabPanel>

          {/* Snapshot schedules */}
          <TabPanel value="snapshot-schedules" className="pt-0">
            <VStack gap={4} className="pt-4">
              <div className="flex items-center h-7">
                <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                  Snapshot schedules
                </h3>
              </div>
              <div className="w-[var(--search-input-width)]">
                <SearchInput
                  placeholder="Search snapshot schedules by attributes"
                  size="sm"
                  fullWidth
                  value={snapshotSchedulesSearch}
                  onChange={(e) => setSnapshotSchedulesSearch(e.target.value)}
                  onClear={() => setSnapshotSchedulesSearch('')}
                />
              </div>
              <Pagination
                currentPage={snapshotSchedulesPage}
                totalPages={Math.ceil(filteredSnapshotSchedules.length / LIST_PAGE_SIZE) || 1}
                onPageChange={setSnapshotSchedulesPage}
                totalItems={filteredSnapshotSchedules.length}
                itemsPerPage={LIST_PAGE_SIZE}
                showItemCount
              />
              <Table<SnapshotSchedule>
                columns={snapshotScheduleColumns}
                data={paginatedSnapshotSchedules}
                rowKey="id"
                emptyMessage="No snapshot schedules found"
              />
            </VStack>
          </TabPanel>

          {/* Clients */}
          <TabPanel value="clients" className="pt-0">
            <VStack gap={4} className="pt-4">
              <div className="flex items-center h-7">
                <h3 className="text-heading-h5 text-[var(--color-text-default)]">Clients</h3>
              </div>
              <div className="w-[var(--search-input-width)]">
                <SearchInput
                  placeholder="Search clients by attributes"
                  size="sm"
                  fullWidth
                  value={clientsSearch}
                  onChange={(e) => setClientsSearch(e.target.value)}
                  onClear={() => setClientsSearch('')}
                />
              </div>
              <Pagination
                currentPage={clientsPage}
                totalPages={Math.ceil(filteredClients.length / LIST_PAGE_SIZE) || 1}
                onPageChange={setClientsPage}
                totalItems={filteredClients.length}
                itemsPerPage={LIST_PAGE_SIZE}
                showItemCount
              />
              <Table<Client>
                columns={clientColumns}
                data={paginatedClients}
                rowKey="id"
                emptyMessage="No clients found"
              />
            </VStack>
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
      </VStack>
    </PageShell>
  );
}

export default FileSystemDetailPage;
