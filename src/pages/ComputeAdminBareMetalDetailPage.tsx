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
  StatusIndicator,
  ContextMenu,
  PageShell,
  Tooltip,
  Chip,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
  CopyButton,
  ConfirmModal,
} from '@/design-system';
import { Link } from 'react-router-dom';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconPlayerPlay,
  IconPlayerStop,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconSquarePlus,
  IconDownload,
  IconLock,
  IconLockOpen,
  IconPower,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';
import { InlineCopyId } from '@/components/InlineCopyId';

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
  locked: boolean;
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
    createdAt: 'Dec 25, 2026 09:12:20',
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
    createdAt: 'Dec 20, 2026 14:30:00',
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
    createdAt: 'Nov 15, 2026 08:45:00',
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
    name: 'db-server-2',
    status: 'shutoff',
    host: 'compute-gpu-01',
    createdAt: 'Oct 10, 2026 17:20:00',
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
    name: 'gpu-node-1',
    status: 'active',
    host: 'compute-06',
    createdAt: 'Sep 5, 2026 11:00:00',
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
  createdAt: 'Dec 25, 2026 09:12:20',
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
    port: '123984734',
    portStatus: 'Active',
    fixedIp: '10.0.0.10',
    macAddress: 'fa:16:3e:12:34:56',
    createdAt: 'Nov 11, 2026 08:30:18',
  },
  {
    id: 'iface-002',
    name: 'eth1',
    network: 'data-net',
    port: '987654321',
    portStatus: 'Active',
    fixedIp: '192.168.1.10',
    macAddress: 'fa:16:3e:ab:cd:ef',
    createdAt: 'Nov 10, 2026 01:17:01',
  },
];

const mockActionLogs: ActionLog[] = [
  {
    id: 'log-001',
    operationName: 'Provision',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2',
    requestedTime: 'Sep 11, 2026',
    result: 'Success',
    startTime: '14:23:15',
    endTime: '14:25:30',
  },
  {
    id: 'log-002',
    operationName: 'Power On',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c3',
    requestedTime: 'Sep 11, 2026',
    result: 'Success',
    startTime: '14:30:05',
    endTime: '14:30:10',
  },
  {
    id: 'log-003',
    operationName: 'Configure Network',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c4',
    requestedTime: 'Sep 11, 2026',
    result: 'Success',
    startTime: '14:35:05',
    endTime: '14:36:00',
  },
];

type BareMetalActionModal = 'stop' | 'reboot' | 'delete';

const BARE_METAL_ACTION_MODAL_COPY: Record<
  BareMetalActionModal,
  { title: string; warning: string; confirmText: string }
> = {
  stop: {
    title: 'Stop Instance',
    warning: 'This action may interrupt the services running on the instance.',
    confirmText: 'Stop',
  },
  reboot: {
    title: 'Reboot Instance',
    warning: 'This action may interrupt the services running on the instance.',
    confirmText: 'Reboot',
  },
  delete: {
    title: 'Delete Instance',
    warning: 'Deleting this instance may interrupt the services running on it.',
    confirmText: 'Delete',
  },
};

/* ----------------------------------------
   Bare Metal Detail Page
   ---------------------------------------- */

export function ComputeAdminBareMetalDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Interfaces tab search + pagination
  const [interfaceSearchQuery, setInterfaceSearchQuery] = useState('');
  const [interfaceCurrentPage, setInterfaceCurrentPage] = useState(1);
  const interfaceRowsPerPage = 10;
  const filteredInterfaces = useMemo(() => {
    const q = interfaceSearchQuery.trim().toLowerCase();
    if (!q) return mockAttachedInterfaces;
    return mockAttachedInterfaces.filter((iface) => {
      const haystack = [
        iface.name,
        iface.id,
        iface.network,
        iface.port,
        iface.portStatus,
        iface.fixedIp,
        iface.macAddress,
        iface.createdAt,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [interfaceSearchQuery]);
  const interfaceTotalPages = Math.ceil(filteredInterfaces.length / interfaceRowsPerPage);

  useEffect(() => {
    setInterfaceCurrentPage(1);
  }, [interfaceSearchQuery]);

  useEffect(() => {
    if (interfaceTotalPages > 0 && interfaceCurrentPage > interfaceTotalPages) {
      setInterfaceCurrentPage(interfaceTotalPages);
    }
  }, [interfaceTotalPages, interfaceCurrentPage]);

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

  const bareMetal = id ? mockBareMetalMap[id] || defaultBareMetalDetail : defaultBareMetalDetail;

  const [bareMetalActionModal, setBareMetalActionModal] = useState<BareMetalActionModal | null>(
    null
  );

  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'instance-status',
      label: 'Instance status',
      submenu: [
        { id: 'start-sub', label: 'Start', onClick: () => {} },
        {
          id: 'stop-sub',
          label: 'Stop',
          status: 'danger',
          onClick: () => setBareMetalActionModal('stop'),
        },
        {
          id: 'reboot-sub',
          label: 'Reboot',
          status: 'danger',
          onClick: () => setBareMetalActionModal('reboot'),
        },
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
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => setBareMetalActionModal('delete'),
    },
  ];

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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Instances', href: '/compute-admin/instances' },
                { label: bareMetal.name },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6} className="min-w-[1176px]">
        <DetailHeader>
          <DetailHeader.Title>
            <span className="inline-flex items-center gap-2">
              {bareMetal.locked ? (
                <Tooltip content="This instance is locked">
                  <IconLock size={16} className="text-[var(--color-text-muted)]" />
                </Tooltip>
              ) : (
                <Tooltip content="This instance is unlocked">
                  <IconLockOpen size={16} className="text-[var(--color-text-disabled)]" />
                </Tooltip>
              )}
              {bareMetal.name}
            </span>
          </DetailHeader.Title>

          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconPlayerPlay size={12} />}>
              Start
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconPlayerStop size={12} />}
              onClick={() => setBareMetalActionModal('stop')}
            >
              Stop
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconPower size={12} />}
              onClick={() => setBareMetalActionModal('reboot')}
            >
              Reboot
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconTrash size={12} />}
              onClick={() => setBareMetalActionModal('delete')}
            >
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
            <DetailHeader.InfoCard label="ID" value={bareMetal.id} copyable />
            <DetailHeader.InfoCard label="Host" value={bareMetal.host} />
            <DetailHeader.InfoCard label="Origin" value={bareMetal.origin} />
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

            <TabPanel value="details" className="pt-0">
              <VStack gap={4} className="pt-4">
                <SectionCard>
                  <SectionCard.Header title="Basic information" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Instance name" value={bareMetal.name} />
                    <SectionCard.DataRow
                      label="Availability zone"
                      value={bareMetal.availabilityZone}
                    />
                    <SectionCard.DataRow label="Description" value={bareMetal.description} />
                  </SectionCard.Content>
                </SectionCard>

                <SectionCard>
                  <SectionCard.Header title="Flavor" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Flavor"
                      value={bareMetal.flavor.name}
                      isLink
                      linkHref="/compute-admin/flavors"
                    />
                    <SectionCard.DataRow
                      label="Spec"
                      value={`vCPU : ${bareMetal.flavor.vcpu} / RAM : ${bareMetal.flavor.ram} / Disk : ${bareMetal.flavor.disk} / GPU : ${bareMetal.flavor.gpu}`}
                    />
                  </SectionCard.Content>
                </SectionCard>

                <SectionCard>
                  <SectionCard.Header title="Source" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Image"
                      value={bareMetal.image}
                      isLink
                      linkHref="/compute-admin/images"
                    />
                    <SectionCard.DataRow label="OS" value={bareMetal.os} />
                  </SectionCard.Content>
                </SectionCard>

                <SectionCard>
                  <SectionCard.Header title="Authentication" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Key pair"
                      value={bareMetal.keyPair}
                      isLink
                      linkHref="/compute-admin/key-pairs"
                    />
                  </SectionCard.Content>
                </SectionCard>

                <SectionCard>
                  <SectionCard.Header title="Advanced" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Tags">
                      {bareMetal.tags.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1">
                          {bareMetal.tags.map((tag, idx) => (
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
                  value={interfaceSearchQuery}
                  onChange={(e) => setInterfaceSearchQuery(e.target.value)}
                  size="sm"
                  className="w-[var(--search-input-width)]"
                />

                <Pagination
                  currentPage={interfaceCurrentPage}
                  totalPages={interfaceTotalPages}
                  totalItems={filteredInterfaces.length}
                  onPageChange={setInterfaceCurrentPage}
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
                            to={`/compute-admin/ports/${iface.id}`}
                            className="inline-flex items-center gap-1.5 min-w-0 text-label-md text-[var(--color-action-primary)] hover:underline truncate"
                          >
                            {iface.name}
                          </Link>
                          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
                            <span className="truncate" title={iface.id}>
                              ID : {iface.id.slice(0, 8)}
                            </span>
                            <InlineCopyId value={iface.id} />
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
                            to={`/compute-admin/networks/${iface.id}`}
                            className="inline-flex items-center gap-1.5 min-w-0 text-label-md text-[var(--color-action-primary)] hover:underline truncate"
                          >
                            {iface.network}
                          </Link>
                          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
                            <span className="truncate" title={iface.id}>
                              ID : {iface.id.slice(0, 8)}
                            </span>
                            <InlineCopyId value={iface.id} />
                          </span>
                        </div>
                      ),
                    },
                    {
                      key: 'fixedIp',
                      label: 'Fixed IP',
                      flex: 1,
                      minWidth: columnMinWidths.fixedIp,
                    },
                    {
                      key: 'macAddress',
                      label: 'Mac address',
                      flex: 1,
                      minWidth: columnMinWidths.macAddress,
                    },
                    {
                      key: 'createdAt',
                      label: 'Created at',
                      flex: 1,
                      minWidth: columnMinWidths.createdAt,
                      sortable: true,
                    },
                    {
                      key: 'action',
                      label: 'Action',
                      width: fixedColumns.actions,
                      align: 'center' as const,
                      sticky: 'right',
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
                              <button
                                aria-label="Row actions"
                                className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
                              >
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
                  data={filteredInterfaces.slice(
                    (interfaceCurrentPage - 1) * interfaceRowsPerPage,
                    interfaceCurrentPage * interfaceRowsPerPage
                  )}
                  rowKey="id"
                />
              </VStack>
            </TabPanel>

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
                          <CopyButton value={row.requestId} size="sm" iconOnly />
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

      {bareMetalActionModal && (
        <ConfirmModal
          isOpen
          onClose={() => setBareMetalActionModal(null)}
          onConfirm={() => setBareMetalActionModal(null)}
          title={BARE_METAL_ACTION_MODAL_COPY[bareMetalActionModal].title}
          description={BARE_METAL_ACTION_MODAL_COPY[bareMetalActionModal].warning}
          infoLabel="Instance"
          infoValue={bareMetal.name}
          confirmText={BARE_METAL_ACTION_MODAL_COPY[bareMetalActionModal].confirmText}
          cancelText="Cancel"
          confirmVariant="danger"
        />
      )}
    </PageShell>
  );
}

export default ComputeAdminBareMetalDetailPage;
