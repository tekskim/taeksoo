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
  SearchInput,
  Pagination,
  StatusIndicator,
  ContextMenu,
  PageShell,
  fixedColumns,
} from '@/design-system';
import { Link } from 'react-router-dom';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconPlayerPlay,
  IconPlayerStop,
  IconRefresh,
  IconTrash,
  IconChevronDown,
  IconChevronUp,
  IconChevronRight,
  IconEdit,
  IconBell,
  IconDownload,
  IconCopy,
  IconSelector,
  IconLock,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface AttachedVolume {
  id: string;
  name: string;
  status: 'active' | 'in-use' | 'available' | 'error';
  size: string;
  type: string;
  diskTag: string;
  bootable: boolean;
  access: string;
}

interface AttachedInterface {
  id: string;
  name: string;
  network: string;
  port: string;
  portStatus: 'Active' | 'Inactive' | 'Down' | 'Build';
  fixedIp: string;
  macAddress: string;
  createdAt: string;
}

interface ActionLog {
  id: string;
  operationName: string;
  requestId: string;
  requestedTime: string;
  result: 'Success' | 'Error' | 'In Progress';
  startTime: string;
  endTime: string;
}

interface BareMetalDetail {
  id: string;
  name: string;
  status: 'active' | 'shutoff' | 'building' | 'error' | 'paused';
  locked: boolean;
  host: string;
  createdAt: string;
  availabilityZone: string;
  description: string;
  flavor: {
    name: string;
    cpu: number;
    ram: string;
    disk: string;
    gpu: string;
  };
  imageName: string;
  image: string;
  interfaces: number;
  keyPair: string;
  serverGroup: string;
  userData: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

// Bare Metal data map by ID
const mockBareMetalMap: Record<string, BareMetalDetail> = {
  'bm-001': {
    id: 'bm-001',
    name: 'web-server-1',
    status: 'active',
    locked: true,
    host: 'rack-01-node-01',
    createdAt: 'Jul 25, 2025',
    availabilityZone: 'zone-a',
    description: 'Production web server',
    flavor: { name: 'BM flavor', cpu: 8, ram: '16 GiB', disk: '10 GiB', gpu: '-' },
    imageName: 'bm-image-01',
    image: 'BM image',
    interfaces: 2,
    keyPair: 'bm-key',
    serverGroup: 'web-group',
    userData: 'Provided at creation',
  },
  'bm-002': {
    id: 'bm-002',
    name: 'web-server-2',
    status: 'active',
    locked: false,
    host: 'rack-01-node-02',
    createdAt: 'Jul 24, 2025',
    availabilityZone: 'zone-a',
    description: 'Production web server backup',
    flavor: { name: 'BM flavor', cpu: 8, ram: '16 GiB', disk: '10 GiB', gpu: '-' },
    imageName: 'bm-image-01',
    image: 'BM image',
    interfaces: 2,
    keyPair: 'bm-key',
    serverGroup: 'web-group',
    userData: 'Provided at creation',
  },
  'bm-003': {
    id: 'bm-003',
    name: 'db-server-1',
    status: 'active',
    locked: true,
    host: 'rack-02-node-01',
    createdAt: 'Jul 20, 2025',
    availabilityZone: 'zone-b',
    description: 'Database server',
    flavor: { name: 'BM large', cpu: 16, ram: '64 GiB', disk: '500 GiB', gpu: '-' },
    imageName: 'bm-image-02',
    image: 'BM image',
    interfaces: 2,
    keyPair: 'db-key',
    serverGroup: 'db-group',
    userData: 'Provided at creation',
  },
  'bm-004': {
    id: 'bm-004',
    name: 'db-server-2',
    status: 'shutoff',
    locked: true,
    host: 'rack-02-node-02',
    createdAt: 'Jul 15, 2025',
    availabilityZone: 'zone-b',
    description: 'Database server standby',
    flavor: { name: 'BM large', cpu: 16, ram: '64 GiB', disk: '500 GiB', gpu: '-' },
    imageName: 'bm-image-02',
    image: 'BM image',
    interfaces: 2,
    keyPair: 'db-key',
    serverGroup: 'db-group',
    userData: 'Provided at creation',
  },
  'bm-005': {
    id: 'bm-005',
    name: 'gpu-node-1',
    status: 'active',
    locked: false,
    host: 'rack-03-node-01',
    createdAt: 'Jul 10, 2025',
    availabilityZone: 'zone-c',
    description: 'GPU compute node',
    flavor: { name: 'BM GPU', cpu: 32, ram: '128 GiB', disk: '1 TiB', gpu: 'A100 x4' },
    imageName: 'bm-gpu-image',
    image: 'BM GPU',
    interfaces: 2,
    keyPair: 'gpu-key',
    serverGroup: 'gpu-group',
    userData: 'Provided at creation',
  },
};

// Default bare metal detail for unknown IDs
const defaultBareMetalDetail: BareMetalDetail = {
  id: 'unknown',
  name: 'Unknown Bare Metal',
  status: 'active',
  locked: false,
  host: 'unknown-host',
  createdAt: 'Jul 25, 2025',
  availabilityZone: 'zone-a',
  description: '-',
  flavor: { name: 'BM flavor', cpu: 8, ram: '16 GiB', disk: '10 GiB', gpu: '-' },
  imageName: 'unknown-image',
  image: 'Unknown',
  interfaces: 0,
  keyPair: '-',
  serverGroup: '-',
  userData: '-',
};

const mockAttachedVolumes: AttachedVolume[] = [
  {
    id: 'vol-001',
    name: 'boot-vol',
    status: 'active',
    size: '500GiB',
    type: 'SSD',
    diskTag: 'OS Disk',
    bootable: true,
    access: 'Nov 11, 2025',
  },
  {
    id: 'vol-002',
    name: 'data-vol-01',
    status: 'active',
    size: '1000GiB',
    type: 'SSD',
    diskTag: 'Data disk',
    bootable: false,
    access: 'Nov 10, 2025',
  },
  {
    id: 'vol-003',
    name: 'backup-vol',
    status: 'active',
    size: '2000GiB',
    type: '_DEFAULT_',
    diskTag: 'Backup',
    bootable: false,
    access: 'Nov 9, 2025',
  },
];

const mockAttachedInterfaces: AttachedInterface[] = [
  {
    id: 'iface-001',
    name: 'eth0',
    network: 'management-net',
    port: '123984734',
    portStatus: 'Active',
    fixedIp: '10.0.0.10',
    macAddress: 'fa:16:3e:12:34:56',
    createdAt: 'Nov 11, 2025',
  },
  {
    id: 'iface-002',
    name: 'eth1',
    network: 'data-net',
    port: '987654321',
    portStatus: 'Active',
    fixedIp: '192.168.1.10',
    macAddress: 'fa:16:3e:ab:cd:ef',
    createdAt: 'Nov 10, 2025',
  },
];

const mockActionLogs: ActionLog[] = [
  {
    id: 'log-001',
    operationName: 'Provision',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2',
    requestedTime: 'Sep 11, 2025',
    result: 'Success',
    startTime: '14:23:15',
    endTime: '14:25:30',
  },
  {
    id: 'log-002',
    operationName: 'Power On',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c3',
    requestedTime: 'Sep 11, 2025',
    result: 'Success',
    startTime: '14:30:05',
    endTime: '14:30:10',
  },
  {
    id: 'log-003',
    operationName: 'Configure Network',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c4',
    requestedTime: 'Sep 11, 2025',
    result: 'Success',
    startTime: '14:35:05',
    endTime: '14:36:00',
  },
];

/* ----------------------------------------
   Bare Metal Detail Page
   ---------------------------------------- */

export function ComputeAdminBareMetalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Action Logs tab state
  const [actionLogCurrentPage, setActionLogCurrentPage] = useState(1);
  const [actionLogSearchQuery, setActionLogSearchQuery] = useState('');
  const [expandedLogIds, setExpandedLogIds] = useState<Set<string>>(new Set());
  const [actionLogSortKey, setActionLogSortKey] = useState<
    'operationName' | 'requestId' | 'requestedTime' | null
  >(null);
  const [actionLogSortDirection, setActionLogSortDirection] = useState<'asc' | 'desc'>('asc');
  const actionLogRowsPerPage = 10;
  const filteredActionLogs = mockActionLogs
    .filter(
      (log) =>
        log.operationName.toLowerCase().includes(actionLogSearchQuery.toLowerCase()) ||
        log.requestId.toLowerCase().includes(actionLogSearchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!actionLogSortKey) return 0;
      const aValue = a[actionLogSortKey];
      const bValue = b[actionLogSortKey];
      const comparison = aValue.localeCompare(bValue);
      return actionLogSortDirection === 'asc' ? comparison : -comparison;
    });
  const actionLogTotalPages = Math.ceil(filteredActionLogs.length / actionLogRowsPerPage);

  const handleActionLogSort = (key: 'operationName' | 'requestId' | 'requestedTime') => {
    if (actionLogSortKey === key) {
      setActionLogSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setActionLogSortKey(key);
      setActionLogSortDirection('asc');
    }
  };

  const toggleLogExpansion = (logId: string) => {
    setExpandedLogIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Get bare metal data based on the ID from URL
  const bareMetal = id ? mockBareMetalMap[id] || defaultBareMetalDetail : defaultBareMetalDetail;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab } = useTabs();

  // Update tab label to bare metal name
  useEffect(() => {
    if (bareMetal.name) {
      updateActiveTabLabel(bareMetal.name);
    }
  }, [bareMetal.name, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  return (
    <PageShell
      sidebar={
        <ComputeAdminSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
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
                { label: 'Compute Admin', href: '/compute-admin' },
                { label: 'Bare metal nodes', href: '/compute-admin/bare-metal-nodes' },
                { label: bareMetal.name },
              ]}
            />
          }
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
        {/* Bare Metal Header Card */}
        <DetailHeader>
          <DetailHeader.Title>
            {bareMetal.locked && (
              <IconLock
                size={16}
                stroke={1.5}
                className="inline-block mr-1.5 text-[var(--color-text-default)]"
              />
            )}
            {bareMetal.name}
          </DetailHeader.Title>

          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconPlayerPlay size={12} />}>
              Start
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconPlayerStop size={12} />}>
              Stop
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
              Reboot
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
            <ContextMenu
              items={[
                {
                  id: 'lock-setting',
                  label: 'Lock setting',
                  onClick: () => console.log('Lock setting'),
                },
                { id: 'edit', label: 'Edit', onClick: () => console.log('Edit') },
              ]}
              trigger="click"
            >
              <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
                More Actions
              </Button>
            </ContextMenu>
          </DetailHeader.Actions>

          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="Status" value="Active" status="active" />
            <DetailHeader.InfoCard label="ID" value={bareMetal.id} copyable />
            <DetailHeader.InfoCard label="Host" value={bareMetal.host} />
            <DetailHeader.InfoCard label="Created at" value={bareMetal.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Bare Metal Tabs */}
        <div className="w-full">
          <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
            <TabList>
              <Tab value="details">Details</Tab>
              <Tab value="interfaces">Interfaces</Tab>
              <Tab value="action-logs">Action logs</Tab>
            </TabList>

            {/* Details Tab Panel */}
            <TabPanel value="details" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Basic information */}
                <SectionCard>
                  <SectionCard.Header
                    title="Basic information"
                    actions={
                      <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                        Edit
                      </Button>
                    }
                  />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Name" value={bareMetal.name} />
                    <SectionCard.DataRow
                      label="Availability zone"
                      value={bareMetal.availabilityZone}
                    />
                    <SectionCard.DataRow label="Description" value={bareMetal.description} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Flavor */}
                <SectionCard>
                  <SectionCard.Header title="Flavor" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Flavor name"
                      value={bareMetal.flavor.name}
                      isLink
                      linkHref="/compute-admin/flavors"
                    />
                    <SectionCard.DataRow
                      label="Spec"
                      value={`CPU : ${bareMetal.flavor.cpu} / RAM : ${bareMetal.flavor.ram} / Disk : ${bareMetal.flavor.disk} / GPU : ${bareMetal.flavor.gpu}`}
                    />
                  </SectionCard.Content>
                </SectionCard>

                {/* Source */}
                <SectionCard>
                  <SectionCard.Header title="Source" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Image"
                      value={bareMetal.imageName}
                      isLink
                      linkHref="/compute-admin/images"
                    />
                    <SectionCard.DataRow label="OS" value={bareMetal.image} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Authentication */}
                <SectionCard>
                  <SectionCard.Header title="Authentication" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Key pair" value={bareMetal.keyPair} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Advanced */}
                <SectionCard>
                  <SectionCard.Header title="Advanced" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Tags"
                      value={
                        <div className="flex gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-label-sm border border-[var(--color-border-default)] rounded-md bg-[var(--color-surface-default)]">
                            <span className="text-[var(--color-text-default)]">Type</span>
                            <span className="text-[var(--color-border-default)]">|</span>
                            <span className="text-[var(--color-text-default)]">bare-metal</span>
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-label-sm border border-[var(--color-border-default)] rounded-md bg-[var(--color-surface-default)]">
                            <span className="text-[var(--color-text-default)]">Env</span>
                            <span className="text-[var(--color-border-default)]">|</span>
                            <span className="text-[var(--color-text-default)]">prod</span>
                          </span>
                        </div>
                      }
                    />
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>

            {/* Interfaces Tab Panel */}
            <TabPanel value="interfaces" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Header */}
                <div className="flex items-center w-full">
                  <h2 className="text-heading-h5 text-[var(--color-text-default)]">Interfaces</h2>
                </div>

                {/* Search */}
                <SearchInput
                  placeholder="Search interface by attributes"
                  size="sm"
                  className="w-[var(--search-input-width)]"
                />

                {/* Pagination */}
                <Pagination
                  currentPage={1}
                  totalPages={1}
                  totalItems={mockAttachedInterfaces.length}
                  onPageChange={() => {}}
                />

                {/* Table */}
                <Table
                  columns={[
                    {
                      key: 'status',
                      label: 'Status',
                      width: fixedColumns.status,
                      align: 'center',
                      render: (_value: string, iface: AttachedInterface) => {
                        const statusMap: Record<
                          string,
                          'active' | 'down' | 'building' | 'shutoff'
                        > = {
                          Active: 'active',
                          Inactive: 'shutoff',
                          Down: 'down',
                          Build: 'building',
                        };
                        return (
                          <StatusIndicator
                            layout="icon-only"
                            status={statusMap[iface.portStatus] || 'down'}
                          />
                        );
                      },
                    },
                    {
                      key: 'name',
                      label: 'Name',
                      sortable: true,
                      render: (_value: string, iface: AttachedInterface) => (
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <Link
                            to={`/compute-admin/ports/${iface.id}`}
                            className="text-label-md text-[var(--color-action-primary)] hover:underline"
                          >
                            {iface.name}
                          </Link>
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            ID : {iface.id}
                          </span>
                        </div>
                      ),
                    },
                    {
                      key: 'network',
                      label: 'Network',
                      sortable: true,
                      render: (_value: string, iface: AttachedInterface) => (
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <Link
                            to={`/compute-admin/networks/${iface.id}`}
                            className="text-label-md text-[var(--color-action-primary)] hover:underline"
                          >
                            {iface.network}
                          </Link>
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            ID : {iface.id}
                          </span>
                        </div>
                      ),
                    },
                    {
                      key: 'fixedIp',
                      label: 'Fixed IP',
                      render: (_value: string, iface: AttachedInterface) => (
                        <span className="text-[var(--color-text-default)]">{iface.fixedIp}</span>
                      ),
                    },
                    {
                      key: 'macAddress',
                      label: 'Mac address',
                      render: (_value: string, iface: AttachedInterface) => (
                        <span className="text-[var(--color-text-default)]">{iface.macAddress}</span>
                      ),
                    },
                    {
                      key: 'createdAt',
                      label: 'Created at',
                      sortable: true,
                      render: (_value: string, iface: AttachedInterface) => (
                        <span className="text-[var(--color-text-default)]">{iface.createdAt}</span>
                      ),
                    },
                  ]}
                  data={mockAttachedInterfaces}
                  rowKey="id"
                />
              </VStack>
            </TabPanel>

            {/* Action Logs Tab Panel */}
            <TabPanel value="action-logs" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Header */}
                <div className="flex items-center h-7">
                  <h2 className="text-heading-h5 text-[var(--color-text-default)]">Action logs</h2>
                </div>

                {/* Search and Download */}
                <div className="flex items-center gap-1">
                  <SearchInput
                    placeholder="Search action logs by attributes"
                    value={actionLogSearchQuery}
                    onChange={(e) => {
                      setActionLogSearchQuery(e.target.value);
                      setActionLogCurrentPage(1);
                    }}
                    className="w-[var(--search-input-width)]"
                  />
                  <Button variant="secondary" size="sm" className="!p-2 !w-7 !h-7 !min-w-7">
                    <IconDownload size={12} stroke={2} className="w-3 h-3" />
                  </Button>
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={actionLogCurrentPage}
                  totalPages={actionLogTotalPages}
                  onPageChange={setActionLogCurrentPage}
                  totalItems={filteredActionLogs.length}
                />

                {/* Action Logs Table */}
                <div className="w-full flex flex-col gap-1">
                  {/* Table Header */}
                  <div className="flex items-start bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-md">
                    <div
                      className="flex-1 flex items-center h-10 px-3 cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors"
                      onClick={() => handleActionLogSort('operationName')}
                    >
                      <div className="flex items-center gap-1 w-full">
                        <span className="text-label-sm text-[var(--color-text-default)]">
                          Action
                        </span>
                        {actionLogSortKey === 'operationName' ? (
                          actionLogSortDirection === 'asc' ? (
                            <IconChevronUp
                              size={14}
                              stroke={1.5}
                              className="text-[var(--color-action-primary)]"
                            />
                          ) : (
                            <IconChevronDown
                              size={14}
                              stroke={1.5}
                              className="text-[var(--color-action-primary)]"
                            />
                          )
                        ) : (
                          <IconSelector
                            size={14}
                            stroke={1.5}
                            className="text-[var(--color-text-disabled)]"
                          />
                        )}
                      </div>
                    </div>
                    <div
                      className="flex-1 flex items-center h-10 px-3 border-l border-[var(--color-border-default)] cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors"
                      onClick={() => handleActionLogSort('requestId')}
                    >
                      <div className="flex items-center gap-1 w-full">
                        <span className="text-label-sm text-[var(--color-text-default)]">
                          Request ID
                        </span>
                        {actionLogSortKey === 'requestId' ? (
                          actionLogSortDirection === 'asc' ? (
                            <IconChevronUp
                              size={14}
                              stroke={1.5}
                              className="text-[var(--color-action-primary)]"
                            />
                          ) : (
                            <IconChevronDown
                              size={14}
                              stroke={1.5}
                              className="text-[var(--color-action-primary)]"
                            />
                          )
                        ) : (
                          <IconSelector
                            size={14}
                            stroke={1.5}
                            className="text-[var(--color-text-disabled)]"
                          />
                        )}
                      </div>
                    </div>
                    <div
                      className="flex-1 flex items-center h-10 px-3 border-l border-[var(--color-border-default)] cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors"
                      onClick={() => handleActionLogSort('requestedTime')}
                    >
                      <div className="flex items-center gap-1 w-full">
                        <span className="text-label-sm text-[var(--color-text-default)]">
                          Requested Time
                        </span>
                        {actionLogSortKey === 'requestedTime' ? (
                          actionLogSortDirection === 'asc' ? (
                            <IconChevronUp
                              size={14}
                              stroke={1.5}
                              className="text-[var(--color-action-primary)]"
                            />
                          ) : (
                            <IconChevronDown
                              size={14}
                              stroke={1.5}
                              className="text-[var(--color-action-primary)]"
                            />
                          )
                        ) : (
                          <IconSelector
                            size={14}
                            stroke={1.5}
                            className="text-[var(--color-text-disabled)]"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  {filteredActionLogs
                    .slice(
                      (actionLogCurrentPage - 1) * actionLogRowsPerPage,
                      actionLogCurrentPage * actionLogRowsPerPage
                    )
                    .map((log) => {
                      const isExpanded = expandedLogIds.has(log.id);
                      return (
                        <div
                          key={log.id}
                          className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md"
                        >
                          {/* Main Row */}
                          <div className="flex items-center w-full">
                            <div className="flex-1 flex items-center gap-2 min-h-[40px] px-3 py-2">
                              <button
                                onClick={() => toggleLogExpansion(log.id)}
                                className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                              >
                                {isExpanded ? (
                                  <IconChevronDown
                                    size={12}
                                    stroke={1.5}
                                    className="text-[var(--color-text-default)]"
                                  />
                                ) : (
                                  <IconChevronRight
                                    size={12}
                                    stroke={1.5}
                                    className="text-[var(--color-text-default)]"
                                  />
                                )}
                              </button>
                              <span className="text-body-md text-[var(--color-text-default)]">
                                {log.operationName}
                              </span>
                            </div>
                            <div className="flex-1 flex items-center gap-1.5 min-h-[40px] px-3 py-2">
                              <span className="text-body-md text-[var(--color-text-default)]">
                                {log.requestId}
                              </span>
                              <button
                                onClick={() => copyToClipboard(log.requestId)}
                                className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                              >
                                <IconCopy
                                  size={12}
                                  stroke={1.5}
                                  className="text-[var(--color-action-primary)]"
                                />
                              </button>
                            </div>
                            <div className="flex-1 flex items-center min-h-[40px] px-3 py-2">
                              <span className="text-body-md text-[var(--color-text-default)]">
                                {log.requestedTime}
                              </span>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="flex items-center gap-4 min-h-[40px] px-8 py-2 border-t border-[var(--color-border-default)]">
                              <div className="flex items-center gap-2 text-body-md text-[var(--color-text-default)]">
                                <span className="font-medium">Result :</span>
                                <span>{log.result}</span>
                              </div>
                              <div className="w-px h-3 bg-[var(--color-border-default)]" />
                              <div className="flex items-center gap-2 text-body-md text-[var(--color-text-default)]">
                                <span className="font-medium">Start Time :</span>
                                <span>{log.startTime}</span>
                              </div>
                              <div className="w-px h-3 bg-[var(--color-border-default)]" />
                              <div className="flex items-center gap-2 text-body-md text-[var(--color-text-default)]">
                                <span className="font-medium">End Time :</span>
                                <span>{log.endTime}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}

export default ComputeAdminBareMetalDetailPage;
