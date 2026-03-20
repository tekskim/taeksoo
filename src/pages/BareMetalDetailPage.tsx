import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Tooltip,
  Chip,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { Link } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTabs } from '@/contexts/TabContext';
import {
  IconPlayerPlay,
  IconPlayerStop,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconBell,
  IconSquarePlus,
  IconPower,
  IconDotsCircleHorizontal,
  IconDownload,
  IconCopy,
  IconLock,
  IconLockOpen,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

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
  host: string;
  createdAt: string;
  origin: string;
  availabilityZone: string;
  description: string;
  flavor: {
    name: string;
    vcpu: number;
    ram: string;
    disk: string;
    gpu: number;
  };
  image: string;
  os: string;
  locked: boolean;
  keyPair: string;
  tags: { key: string; value: string }[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockBareMetalMap: Record<string, BareMetalDetail> = {
  'bm-001': {
    id: 'bm-001',
    name: 'web-server-1',
    status: 'active',
    host: 'compute-03',
    createdAt: 'Dec 25, 2025 09:12:20',
    origin: 'Container cluster (k8s-prod)',
    availabilityZone: 'zone-a',
    description: '-',
    flavor: { name: 'BM flavor', vcpu: 8, ram: '16 GiB', disk: '10 GiB', gpu: 0 },
    image: 'image-01',
    os: 'Ubuntu 22.04',
    locked: false,
    keyPair: 'web-server-10',
    tags: [
      { key: 'Team', value: 'dev' },
      { key: 'Env', value: 'production' },
    ],
  },
  'bm-002': {
    id: 'bm-002',
    name: 'web-server-2',
    status: 'active',
    host: 'compute-04',
    createdAt: 'Dec 20, 2025 14:30:00',
    origin: 'Container cluster (k8s-prod)',
    availabilityZone: 'zone-a',
    description: 'Secondary web server',
    flavor: { name: 'BM flavor', vcpu: 8, ram: '16 GiB', disk: '10 GiB', gpu: 0 },
    image: 'image-01',
    os: 'Ubuntu 22.04',
    locked: false,
    keyPair: 'web-server-10',
    tags: [{ key: 'Team', value: 'dev' }],
  },
  'bm-003': {
    id: 'bm-003',
    name: 'db-server-1',
    status: 'active',
    host: 'compute-05',
    createdAt: 'Nov 15, 2025 08:45:00',
    origin: 'Manual deployment',
    availabilityZone: 'zone-b',
    description: 'Primary database server',
    flavor: { name: 'BM large', vcpu: 16, ram: '64 GiB', disk: '500 GiB', gpu: 0 },
    image: 'image-03',
    os: 'Rocky Linux 9',
    locked: true,
    keyPair: 'db-key',
    tags: [
      { key: 'Team', value: 'infra' },
      { key: 'Role', value: 'database' },
    ],
  },
  'bm-004': {
    id: 'bm-004',
    name: 'ml-node-1',
    status: 'shutoff',
    host: 'compute-gpu-01',
    createdAt: 'Oct 10, 2025 17:20:00',
    origin: 'Container cluster (ml-cluster)',
    availabilityZone: 'zone-a',
    description: 'Machine learning compute node',
    flavor: { name: 'BM GPU', vcpu: 32, ram: '128 GiB', disk: '1000 GiB', gpu: 4 },
    image: 'image-04',
    os: 'Ubuntu 22.04',
    locked: false,
    keyPair: 'ml-key',
    tags: [{ key: 'Team', value: 'ml' }],
  },
  'bm-005': {
    id: 'bm-005',
    name: 'storage-node-1',
    status: 'active',
    host: 'compute-06',
    createdAt: 'Sep 5, 2025 11:00:00',
    origin: 'Manual deployment',
    availabilityZone: 'zone-b',
    description: 'Distributed storage node',
    flavor: { name: 'BM storage', vcpu: 8, ram: '32 GiB', disk: '2000 GiB', gpu: 0 },
    image: 'image-02',
    os: 'Rocky Linux 9',
    locked: true,
    keyPair: 'storage-key',
    tags: [
      { key: 'Team', value: 'infra' },
      { key: 'Role', value: 'storage' },
    ],
  },
};

const defaultBareMetalDetail: BareMetalDetail = {
  id: 'unknown',
  name: 'Unknown Instance',
  status: 'active',
  host: 'compute-03',
  createdAt: 'Dec 25, 2025 09:12:20',
  origin: '-',
  availabilityZone: 'nova',
  description: '-',
  flavor: { name: 'BM flavor', vcpu: 1, ram: '4 GiB', disk: '40 GiB', gpu: 0 },
  image: 'Unknown',
  os: 'Unknown',
  locked: false,
  keyPair: '-',
  tags: [],
};

const mockAttachedInterfaces: AttachedInterface[] = [
  {
    id: 'iface-001',
    name: 'eth0',
    network: 'management-net',
    port: 'port-bm-001',
    portStatus: 'Active',
    fixedIp: '10.20.30.40',
    macAddress: 'fa:16:3e:aa:bb:cc',
    createdAt: 'Dec 25, 2025 09:12:20',
  },
  {
    id: 'iface-002',
    name: 'eth1',
    network: 'data-net',
    port: 'port-bm-002',
    portStatus: 'Active',
    fixedIp: '192.168.1.10',
    macAddress: 'fa:16:3e:dd:ee:ff',
    createdAt: 'Dec 25, 2025 09:12:20',
  },
  {
    id: 'iface-003',
    name: 'eth2',
    network: 'storage-net',
    port: 'port-bm-003',
    portStatus: 'Active',
    fixedIp: '172.16.0.5',
    macAddress: 'fa:16:3e:11:22:33',
    createdAt: 'Dec 26, 2025 10:00:00',
  },
  {
    id: 'iface-004',
    name: 'eth3',
    network: 'backup-net',
    port: 'port-bm-004',
    portStatus: 'Inactive',
    fixedIp: '10.30.40.50',
    macAddress: 'fa:16:3e:44:55:66',
    createdAt: 'Dec 27, 2025 08:30:00',
  },
];

const mockActionLogs: ActionLog[] = [
  {
    id: 'log-001',
    operationName: 'Create',
    requestId: 'req-1a2b3c4d5e6f',
    requestedTime: 'Dec 25, 2025 09:12:20',
    result: 'Success',
    startTime: 'Dec 25, 2025 09:12:20',
    endTime: 'Dec 25, 2025 09:15:45',
  },
  {
    id: 'log-002',
    operationName: 'Stop',
    requestId: 'req-7g8h9i0j1k2l',
    requestedTime: 'Jan 5, 2026 14:30:00',
    result: 'Success',
    startTime: 'Jan 5, 2026 14:30:00',
    endTime: 'Jan 5, 2026 14:30:15',
  },
  {
    id: 'log-003',
    operationName: 'Start',
    requestId: 'req-3m4n5o6p7q8r',
    requestedTime: 'Jan 5, 2026 14:35:00',
    result: 'Success',
    startTime: 'Jan 5, 2026 14:35:00',
    endTime: 'Jan 5, 2026 14:35:30',
  },
  {
    id: 'log-004',
    operationName: 'Reboot',
    requestId: 'req-9s0t1u2v3w4x',
    requestedTime: 'Feb 10, 2026 08:00:00',
    result: 'Success',
    startTime: 'Feb 10, 2026 08:00:00',
    endTime: 'Feb 10, 2026 08:02:30',
  },
  {
    id: 'log-005',
    operationName: 'Lock',
    requestId: 'req-5y6z7a8b9c0d',
    requestedTime: 'Mar 1, 2026 10:15:00',
    result: 'Success',
    startTime: 'Mar 1, 2026 10:15:00',
    endTime: 'Mar 1, 2026 10:15:01',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function BareMetalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [activeTab, setActiveTab] = useState('details');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Interface tab state
  const [interfaceCurrentPage, setInterfaceCurrentPage] = useState(1);
  const interfaceRowsPerPage = 10;
  const interfaceTotalPages = Math.ceil(mockAttachedInterfaces.length / interfaceRowsPerPage);

  // Action logs state
  const [actionLogCurrentPage, setActionLogCurrentPage] = useState(1);
  const [actionLogSearchQuery, setActionLogSearchQuery] = useState('');
  const [expandedLogIds, setExpandedLogIds] = useState<Set<string>>(new Set());
  const actionLogRowsPerPage = 10;

  const filteredActionLogs = mockActionLogs.filter((log) => {
    if (!actionLogSearchQuery) return true;
    const q = actionLogSearchQuery.toLowerCase();
    return (
      log.operationName.toLowerCase().includes(q) ||
      log.requestId.toLowerCase().includes(q) ||
      log.requestedTime.toLowerCase().includes(q)
    );
  });

  const actionLogTotalPages = Math.ceil(filteredActionLogs.length / actionLogRowsPerPage);

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

  const instance = id ? mockBareMetalMap[id] || defaultBareMetalDetail : defaultBareMetalDetail;

  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab } = useTabs();

  useEffect(() => {
    if (instance.name) {
      updateActiveTabLabel(instance.name);
    }
  }, [instance.name, updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'instance-status',
      label: 'Instance status',
      submenu: [
        { id: 'start-sub', label: 'Start', onClick: () => {} },
        { id: 'stop-sub', label: 'Stop', status: 'danger', onClick: () => {} },
        { id: 'reboot-sub', label: 'Reboot', status: 'danger', onClick: () => {} },
      ],
    },
    {
      id: 'configuration',
      label: 'Configuration',
      submenu: [
        { id: 'lock-setting', label: 'Lock setting', onClick: () => {} },
        { id: 'manage-tags', label: 'Manage tags', onClick: () => {} },
        { id: 'edit', label: 'Edit', onClick: () => {} },
      ],
    },
    { id: 'delete', label: 'Delete', status: 'danger', onClick: () => {} },
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
          showWindowControls={true}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={openSidebar}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Proj-1', href: '/project' },
                { label: 'Instances list', href: '/compute/instances' },
                { label: instance.name },
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
        {/* Detail Header */}
        <DetailHeader>
          <DetailHeader.Title>
            <span className="inline-flex items-center gap-2">
              {instance.locked ? (
                <Tooltip content="This instance is locked">
                  <IconLock size={16} className="text-[var(--color-text-muted)]" />
                </Tooltip>
              ) : (
                <Tooltip content="This instance is unlocked">
                  <IconLockOpen size={16} className="text-[var(--color-text-disabled)]" />
                </Tooltip>
              )}
              {instance.name}
            </span>
          </DetailHeader.Title>

          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconPlayerPlay size={12} />}>
              Start
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconPlayerStop size={12} />}>
              Stop
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconPower size={12} />}>
              Reboot
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
            <ContextMenu items={moreActionsItems} trigger="click">
              <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
                More actions
              </Button>
            </ContextMenu>
          </DetailHeader.Actions>

          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="Status" value="Active" status="active" />
            <DetailHeader.InfoCard label="ID" value={instance.id} copyable />
            <DetailHeader.InfoCard label="Host" value={instance.host} />
            <DetailHeader.InfoCard label="Origin" value={instance.origin} />
            <DetailHeader.InfoCard label="Created at" value={instance.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs */}
        <div>
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
            <TabList>
              <Tab value="details">Details</Tab>
              <Tab value="interfaces">Interfaces</Tab>
              <Tab value="action-logs">Action logs</Tab>
            </TabList>

            {/* Details Tab */}
            <TabPanel value="details" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Basic Information */}
                <SectionCard>
                  <SectionCard.Header title="Basic information" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Instance name" value={instance.name} />
                    <SectionCard.DataRow
                      label="Availability zone"
                      value={instance.availabilityZone}
                    />
                    <SectionCard.DataRow label="Description" value={instance.description} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Flavor */}
                <SectionCard>
                  <SectionCard.Header title="Flavor" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Flavor"
                      value={instance.flavor.name}
                      isLink
                      linkHref="/compute/flavors"
                    />
                    <SectionCard.DataRow
                      label="Spec"
                      value={`vCPU : ${instance.flavor.vcpu} / RAM : ${instance.flavor.ram} / Disk : ${instance.flavor.disk} / GPU : ${instance.flavor.gpu}`}
                    />
                  </SectionCard.Content>
                </SectionCard>

                {/* Source */}
                <SectionCard>
                  <SectionCard.Header title="Source" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Image"
                      value={instance.image}
                      isLink
                      linkHref="/compute/images"
                    />
                    <SectionCard.DataRow label="OS" value={instance.os} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Authentication */}
                <SectionCard>
                  <SectionCard.Header title="Authentication" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Key pair"
                      value={instance.keyPair}
                      isLink
                      linkHref="/compute/key-pairs"
                    />
                  </SectionCard.Content>
                </SectionCard>

                {/* Advanced */}
                <SectionCard>
                  <SectionCard.Header title="Advanced" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Tags">
                      {instance.tags.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1">
                          {instance.tags.map((tag, idx) => (
                            <Chip key={idx} label={tag.key} value={tag.value} />
                          ))}
                        </div>
                      ) : (
                        <span className="text-body-md text-[var(--color-text-default)]">-</span>
                      )}
                    </SectionCard.DataRow>
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>

            {/* Interfaces Tab */}
            <TabPanel value="interfaces" className="pt-0">
              <VStack gap={4} className="pt-4">
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-heading-h5 text-[var(--color-text-default)]">Interfaces</h2>
                  <Button variant="secondary" size="sm" leftIcon={<IconSquarePlus size={12} />}>
                    Attach interface
                  </Button>
                </div>

                <SearchInput
                  placeholder="Search interface by attributes"
                  size="sm"
                  className="w-[var(--search-input-width)]"
                />

                <Pagination
                  currentPage={interfaceCurrentPage}
                  totalPages={interfaceTotalPages}
                  onPageChange={setInterfaceCurrentPage}
                  totalItems={mockAttachedInterfaces.length}
                  showSettings
                  onSettingsClick={() => setIsPreferencesOpen(true)}
                />

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
                      flex: 1,
                      minWidth: columnMinWidths.name,
                      sortable: true,
                      render: (_value: string, iface: AttachedInterface) => (
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <Link
                            to={`/compute/ports/${iface.id}`}
                            className="inline-flex items-center gap-1.5 min-w-0 text-label-md text-[var(--color-action-primary)] hover:underline truncate"
                          >
                            {iface.name}
                          </Link>
                          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                            ID : {iface.id}
                          </span>
                        </div>
                      ),
                    },
                    {
                      key: 'network',
                      label: 'Network',
                      flex: 1,
                      minWidth: columnMinWidths.network,
                      sortable: true,
                      render: (_value: string, iface: AttachedInterface) => (
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <Link
                            to={`/compute/networks/${iface.id}`}
                            className="inline-flex items-center gap-1.5 min-w-0 text-label-md text-[var(--color-action-primary)] hover:underline truncate"
                          >
                            {iface.network}
                          </Link>
                          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                            ID : {iface.id}
                          </span>
                        </div>
                      ),
                    },
                    {
                      key: 'fixedIp',
                      label: 'Fixed IP',
                      flex: 1,
                      minWidth: columnMinWidths.fixedIp,
                      render: (_value: string, iface: AttachedInterface) => (
                        <span className="text-[var(--color-text-default)]">{iface.fixedIp}</span>
                      ),
                    },
                    {
                      key: 'macAddress',
                      label: 'Mac address',
                      flex: 1,
                      minWidth: columnMinWidths.macAddress,
                      render: (_value: string, iface: AttachedInterface) => (
                        <span className="text-[var(--color-text-default)]">{iface.macAddress}</span>
                      ),
                    },
                    {
                      key: 'createdAt',
                      label: 'Created at',
                      flex: 1,
                      minWidth: columnMinWidths.createdAt,
                      sortable: true,
                      render: (_value: string, iface: AttachedInterface) => (
                        <span className="text-[var(--color-text-default)]">{iface.createdAt}</span>
                      ),
                    },
                    {
                      key: 'action',
                      label: 'Action',
                      width: fixedColumns.actions,
                      align: 'center' as const,
                      render: (_: unknown, iface: AttachedInterface) => {
                        const interfaceMenuItems: ContextMenuItem[] = [
                          {
                            id: 'detach',
                            label: 'Detach',
                            status: 'danger',
                            onClick: () => {},
                          },
                        ];
                        return (
                          <div onClick={(e) => e.stopPropagation()}>
                            <ContextMenu items={interfaceMenuItems} trigger="click" align="right">
                              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                                <IconDotsCircleHorizontal
                                  size={16}
                                  stroke={1.5}
                                  className="text-[var(--action-icon-color)]"
                                />
                              </button>
                            </ContextMenu>
                          </div>
                        );
                      },
                    },
                  ]}
                  data={mockAttachedInterfaces.slice(
                    (interfaceCurrentPage - 1) * interfaceRowsPerPage,
                    interfaceCurrentPage * interfaceRowsPerPage
                  )}
                  rowKey="id"
                />
              </VStack>
            </TabPanel>

            {/* Action Logs Tab */}
            <TabPanel value="action-logs" className="pt-0">
              <VStack gap={4} className="pt-4">
                <div className="flex items-center h-7">
                  <h2 className="text-heading-h5 text-[var(--color-text-default)]">Action logs</h2>
                </div>

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
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<IconDownload size={12} stroke={1.5} />}
                    aria-label="Download"
                  />
                </div>

                <Pagination
                  currentPage={actionLogCurrentPage}
                  totalPages={actionLogTotalPages}
                  onPageChange={setActionLogCurrentPage}
                  totalItems={filteredActionLogs.length}
                  showSettings
                  onSettingsClick={() => setIsPreferencesOpen(true)}
                />

                <Table<ActionLog>
                  columns={[
                    {
                      key: 'operationName',
                      label: 'Action',
                      flex: 1,
                      sortable: true,
                      render: (_value: string, row: ActionLog) => (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLogExpansion(row.id);
                            }}
                            className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                          >
                            {expandedLogIds.has(row.id) ? (
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
                          <span>{row.operationName}</span>
                        </div>
                      ),
                    },
                    {
                      key: 'requestId',
                      label: 'Request ID',
                      flex: 1,
                      sortable: true,
                      render: (_value: string, row: ActionLog) => (
                        <div className="flex items-center gap-1.5">
                          <span>{row.requestId}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(row.requestId);
                            }}
                            className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                          >
                            <IconCopy
                              size={12}
                              stroke={1.5}
                              className="text-[var(--color-action-primary)]"
                            />
                          </button>
                        </div>
                      ),
                    },
                    {
                      key: 'requestedTime',
                      label: 'Requested time',
                      flex: 1,
                      sortable: true,
                    },
                  ]}
                  data={filteredActionLogs.slice(
                    (actionLogCurrentPage - 1) * actionLogRowsPerPage,
                    actionLogCurrentPage * actionLogRowsPerPage
                  )}
                  rowKey="id"
                  onRowClick={(row) => toggleLogExpansion(row.id)}
                  expandedContent={(row) =>
                    expandedLogIds.has(row.id) ? (
                      <div className="flex items-center gap-4 px-8 py-3">
                        <div className="flex items-center gap-2 text-body-md text-[var(--color-text-default)]">
                          <span className="font-medium">Result :</span>
                          <span>{row.result}</span>
                        </div>
                        <div className="w-px h-3 bg-[var(--color-border-default)]" />
                        <div className="flex items-center gap-2 text-body-md text-[var(--color-text-default)]">
                          <span className="font-medium">Start Time :</span>
                          <span>{row.startTime}</span>
                        </div>
                        <div className="w-px h-3 bg-[var(--color-border-default)]" />
                        <div className="flex items-center gap-2 text-body-md text-[var(--color-text-default)]">
                          <span className="font-medium">End Time :</span>
                          <span>{row.endTime}</span>
                        </div>
                      </div>
                    ) : null
                  }
                />
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}

export default BareMetalDetailPage;
