import { useMemo, useState, type ReactElement } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { LiveMigrateInstanceDrawer } from '../drawers/compute/instance/LiveMigrateInstanceDrawer';
import { RescueInstanceDrawer } from '../drawers/compute/instance/RescueInstanceDrawer';
import { RebuildInstanceDrawer } from '../drawers/compute/instance/RebuildInstanceDrawer';
import { ResizeInstanceDrawer } from '../drawers/compute/instance/ResizeInstanceDrawer';
import { ManageTagsDrawer } from '../drawers/compute/instance/ManageTagsDrawer';
import { ManageSecurityGroupsDrawer } from '../drawers/compute/instance/ManageSecurityGroupsDrawer';
import { DisassociateFloatingIPDrawer } from '../drawers/compute/instance/DisassociateFloatingIPDrawer';
import { AssociateFloatingIPDrawer } from '../drawers/compute/instance/AssociateFloatingIPDrawer';
import { DetachInterfaceDrawer } from '../drawers/compute/instance/DetachInterfaceDrawer';
import { AttachInterfaceDrawer } from '../drawers/compute/instance/AttachInterfaceDrawer';
import { DetachVolumeDrawer } from '../drawers/compute/instance/DetachVolumeDrawer';
import { AttachVolumeDrawer } from '../drawers/compute/instance/AttachVolumeDrawer';
import { LockSettingDrawer } from '../drawers/compute/instance/LockSettingDrawer';
import { CreateInstanceSnapshotDrawer } from '../drawers/compute/instance/CreateInstanceSnapshotDrawer';
import { EditInstanceDrawer } from '../drawers/compute/instance/EditInstanceDrawer';
import { Table } from '@shared/components/Table';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Tooltip } from '@shared/components/Tooltip';
import { Badge } from '@shared/components/Badge';
import { MonitoringToolbar } from '@shared/components/MonitoringToolbar';
import Tag from '@shared/components/Tag/Tag';
import CopyButton from '@shared/components/CopyButton/CopyButton';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import { cn } from '@shared/services/utils/cn';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import {
  IconTerminal2,
  IconPlayerPlay,
  IconPlayerStop,
  IconTrash,
  IconChevronDown,
  IconChevronUp,
  IconChevronRight,
  IconSquarePlus,
  IconLinkPlus,
  IconPower,
  IconSettings,
  IconCirclePlus,
  IconLock,
  IconLockOpen,
  IconDotsCircleHorizontal,
  IconDownload,
  IconSearch,
} from '@tabler/icons-react';
import {
  mockInstancesMap,
  defaultInstanceDetail,
  mockAttachedVolumes,
  mockAttachedInterfaces,
  mockFloatingIPs,
  mockNetworkInterfaces,
  mockSecurityGroups,
  mockInstanceSnapshots,
  mockActionLogs,
  CONSOLE_LOG_SAMPLE,
  type AttachedVolume,
  type AttachedInterface,
  type FloatingIP,
  type SecurityGroup,
  type InstanceSnapshot,
  type ActionLog,
  type InstanceDetail,
} from './instanceDetailPageMockData';

const STATUS_COL_WIDTH = 60;
const ACTION_COL_WIDTH = 72;

type TimeRange = '1h' | '1d' | '1w' | '2w';

function volumeStatusVariant(s: AttachedVolume['status']): StatusVariant {
  if (s === 'error') return 'error';
  if (s === 'in-use') return 'inUse';
  if (s === 'available') return 'mounted';
  return 'active';
}

function portStatusVariant(portStatus: AttachedInterface['portStatus']): StatusVariant {
  const m: Record<AttachedInterface['portStatus'], StatusVariant> = {
    Active: 'active',
    Inactive: 'shutoff',
    Down: 'down',
    Build: 'building',
  };
  return m[portStatus] ?? 'down';
}

function snapshotStatusVariant(s: InstanceSnapshot['status']): StatusVariant {
  if (s === 'active') return 'active';
  if (s === 'queued' || s === 'saving') return 'building';
  return 'error';
}

function floatingStatusVariant(s: FloatingIP['status']): StatusVariant {
  if (s === 'error') return 'error';
  if (s === 'active') return 'active';
  return 'shutoff';
}

/** Single-key attribute search wiring for FilterSearchInput + existing string query state */
const ATTRIBUTE_SEARCH_FILTER_KEYS: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter value...' },
];

function attributeSearchSelectedFilters(query: string): FilterKeyWithValue[] {
  const q = query.trim();
  if (!q) return [];
  return [
    {
      ...ATTRIBUTE_SEARCH_FILTER_KEYS[0],
      id: 'search',
      value: q,
    },
  ];
}

const ActionTrigger = ({ toggle }: { toggle: () => void }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      toggle();
    }}
    className="p-1.5 rounded-md bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none inline-flex"
    aria-label="Row actions"
  >
    <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-text-subtle" />
  </button>
);

export function ComputeAdminInstanceDetailPage() {
  const [drawerOpen, setDrawerOpen] = useState<string | null>(null);
  const closeDrawer = () => setDrawerOpen(null);

  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const instance: InstanceDetail = id
    ? (mockInstancesMap[id] ?? defaultInstanceDetail)
    : defaultInstanceDetail;

  const [selectedNetworkInterface, setSelectedNetworkInterface] = useState(
    mockNetworkInterfaces[0]?.id ?? ''
  );

  const [interfaceCurrentPage, setInterfaceCurrentPage] = useState(1);
  const interfaceRowsPerPage = 10;

  const [floatingIpCurrentPage, setFloatingIpCurrentPage] = useState(1);
  const floatingIpRowsPerPage = 10;

  const [securityCurrentPage, setSecurityCurrentPage] = useState(1);
  const securityRowsPerPage = 10;
  const [securitySearchQuery, setSecuritySearchQuery] = useState('');

  const [snapshotCurrentPage, setSnapshotCurrentPage] = useState(1);
  const [snapshotSearchQuery, setSnapshotSearchQuery] = useState('');
  const snapshotRowsPerPage = 10;
  const filteredSnapshots = mockInstanceSnapshots.filter((snapshot) =>
    snapshot.name.toLowerCase().includes(snapshotSearchQuery.toLowerCase())
  );
  const snapshotTotalPages = Math.ceil(filteredSnapshots.length / snapshotRowsPerPage);

  const [monitoringTimeRange, setMonitoringTimeRange] = useState<TimeRange>('1h');

  const [logLength, setLogLength] = useState(20);

  const [actionLogCurrentPage, setActionLogCurrentPage] = useState(1);
  const [actionLogSearchQuery, setActionLogSearchQuery] = useState('');
  const [expandedLogIds, setExpandedLogIds] = useState<Set<string>>(new Set());
  const actionLogRowsPerPage = 10;
  const filteredActionLogs = mockActionLogs.filter(
    (log) =>
      log.operationName.toLowerCase().includes(actionLogSearchQuery.toLowerCase()) ||
      log.requestId.toLowerCase().includes(actionLogSearchQuery.toLowerCase())
  );
  const actionLogTotalPages = Math.ceil(filteredActionLogs.length / actionLogRowsPerPage);

  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const handleSortChange = (nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  };

  const [volSearchQuery, setVolSearchQuery] = useState('');
  const [volPage, setVolPage] = useState(1);
  const volRowsPerPage = 10;

  const [ifSearchQuery, setIfSearchQuery] = useState('');
  const [fipSearchQuery, setFipSearchQuery] = useState('');

  const toggleLogExpansion = (logId: string) => {
    setExpandedLogIds((prev) => {
      const next = new Set(prev);
      if (next.has(logId)) next.delete(logId);
      else next.add(logId);
      return next;
    });
  };

  const filteredVolumes = useMemo(() => {
    const q = volSearchQuery.trim().toLowerCase();
    if (!q) return mockAttachedVolumes;
    return mockAttachedVolumes.filter(
      (v) => v.name.toLowerCase().includes(q) || v.id.toLowerCase().includes(q)
    );
  }, [volSearchQuery]);

  const filteredInterfaces = useMemo(() => {
    const q = ifSearchQuery.trim().toLowerCase();
    if (!q) return mockAttachedInterfaces;
    return mockAttachedInterfaces.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        i.network.toLowerCase().includes(q)
    );
  }, [ifSearchQuery]);

  const filteredFloatingIps = useMemo(() => {
    const q = fipSearchQuery.trim().toLowerCase();
    if (!q) return mockFloatingIPs;
    return mockFloatingIPs.filter(
      (f) =>
        f.floatingIp.toLowerCase().includes(q) ||
        f.fixedIp.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q) ||
        f.name.toLowerCase().includes(q)
    );
  }, [fipSearchQuery]);

  const filteredSecurityGroups = useMemo(() => {
    const q = securitySearchQuery.trim().toLowerCase();
    if (!q) return mockSecurityGroups;
    return mockSecurityGroups.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.id.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
    );
  }, [securitySearchQuery]);

  const paginatedVolumes = filteredVolumes.slice(
    (volPage - 1) * volRowsPerPage,
    volPage * volRowsPerPage
  );

  const paginatedInterfaces = filteredInterfaces.slice(
    (interfaceCurrentPage - 1) * interfaceRowsPerPage,
    interfaceCurrentPage * interfaceRowsPerPage
  );

  const paginatedFloatingIps = filteredFloatingIps.slice(
    (floatingIpCurrentPage - 1) * floatingIpRowsPerPage,
    floatingIpCurrentPage * floatingIpRowsPerPage
  );

  const paginatedSecurity = filteredSecurityGroups.slice(
    (securityCurrentPage - 1) * securityRowsPerPage,
    securityCurrentPage * securityRowsPerPage
  );
  const paginatedSnapshots = filteredSnapshots.slice(
    (snapshotCurrentPage - 1) * snapshotRowsPerPage,
    snapshotCurrentPage * snapshotRowsPerPage
  );
  const paginatedActionLogs = filteredActionLogs.slice(
    (actionLogCurrentPage - 1) * actionLogRowsPerPage,
    actionLogCurrentPage * actionLogRowsPerPage
  );

  const volumeColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'size', header: 'Size', sortable: true },
      { key: 'type', header: 'Type', sortable: true },
      { key: 'diskTag', header: 'Disk tag' },
      { key: 'bootable', header: 'Bootable' },
      { key: 'access', header: 'Created at' },
      {
        key: 'actions',
        header: 'Action',
        width: ACTION_COL_WIDTH,
        align: 'center',
        clickable: false,
      },
    ],
    []
  );

  const interfaceColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'network', header: 'Network', sortable: true },
      { key: 'fixedIp', header: 'Fixed IP' },
      { key: 'macAddress', header: 'Mac address' },
      { key: 'createdAt', header: 'Created at', sortable: true },
      {
        key: 'actions',
        header: 'Action',
        width: ACTION_COL_WIDTH,
        align: 'center',
        clickable: false,
      },
    ],
    []
  );

  const floatingColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
      { key: 'floatingIp', header: 'Floating IP' },
      { key: 'fixedIp', header: 'Fixed IP' },
      { key: 'createdAt', header: 'Created at', sortable: true },
      {
        key: 'actions',
        header: 'Action',
        width: ACTION_COL_WIDTH,
        align: 'center',
        clickable: false,
      },
    ],
    []
  );

  const securityColumns: TableColumn[] = useMemo(
    () => [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'description', header: 'Description', sortable: true },
      { key: 'createdAt', header: 'Created at', sortable: true },
      {
        key: 'actions',
        header: 'Action',
        width: ACTION_COL_WIDTH,
        align: 'center',
        clickable: false,
      },
    ],
    []
  );

  const snapshotColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'size', header: 'Size', sortable: true },
      { key: 'diskFormat', header: 'Disk format', sortable: true },
      { key: 'createdAt', header: 'Created at', sortable: true },
      {
        key: 'actions',
        header: 'Action',
        width: ACTION_COL_WIDTH,
        align: 'center',
        clickable: false,
      },
    ],
    []
  );

  const actionLogColumns: TableColumn[] = useMemo(
    () => [
      { key: 'operationName', header: 'Action', sortable: true },
      { key: 'requestId', header: 'Request ID', sortable: true },
      { key: 'requestedTime', header: 'Requested time', sortable: true },
    ],
    []
  );

  const infoFields = [
    {
      label: 'Status',
      value: 'Active',
      accessory: <StatusIndicator variant="active" layout="iconOnly" />,
    },
    { label: 'ID', value: instance.id, showCopyButton: true as const, copyText: instance.id },
    { label: 'Tenant', value: 'demo-project' },
    { label: 'Host', value: instance.host },
    { label: 'Origin', value: instance.image },
    {
      label: 'Locked state',
      value: (
        <span className="inline-flex items-center gap-1 min-w-0">
          {instance.locked ? (
            <IconLock size={14} className="text-text-muted shrink-0" />
          ) : (
            <IconLockOpen size={14} className="text-text-muted shrink-0" />
          )}
          <span>{instance.locked ? 'Locked' : 'Unlocked'}</span>
        </span>
      ),
    },
    { label: 'Created at', value: instance.createdAt },
  ];

  const headerTitle = (
    <span className="inline-flex items-center gap-2">
      <Tooltip
        content={instance.locked ? 'This instance is locked' : 'This instance is unlocked'}
        focusable={false}
      >
        <span className="inline-flex cursor-default">
          {instance.locked ? (
            <IconLock size={16} className="text-text-muted" stroke={1.5} />
          ) : (
            <IconLockOpen size={16} className="text-text-muted" stroke={1.5} />
          )}
        </span>
      </Tooltip>
      {instance.name}
    </span>
  );

  const actions = (
    <div className="flex items-center gap-1 flex-wrap">
      <Button variant="secondary" appearance="outline" size="sm">
        <IconTerminal2 size={12} stroke={1.5} /> Console
      </Button>
      <Button variant="secondary" appearance="outline" size="sm">
        <IconPlayerPlay size={12} stroke={1.5} /> Start
      </Button>
      <Button variant="secondary" appearance="outline" size="sm">
        <IconPlayerStop size={12} stroke={1.5} /> Stop
      </Button>
      <Button variant="secondary" appearance="outline" size="sm">
        <IconPower size={12} stroke={1.5} /> Reboot
      </Button>
      <Button variant="secondary" appearance="outline" size="sm">
        <IconTrash size={12} stroke={1.5} /> Delete
      </Button>
      <ContextMenu.Root
        direction="bottom-end"
        gap={4}
        subContextMenuDirection="right-top"
        trigger={({ toggle }) => (
          <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
            More actions <IconChevronDown size={12} stroke={1.5} />
          </Button>
        )}
      >
        <ContextMenu.SubItems label="Instance status" subContextMenuDirection="right-top">
          <ContextMenu.Item action={() => {}}>Soft reboot</ContextMenu.Item>
          <ContextMenu.Item action={() => {}}>Pause</ContextMenu.Item>
          <ContextMenu.Item action={() => {}}>Suspend</ContextMenu.Item>
          <ContextMenu.Item action={() => {}}>Shelve</ContextMenu.Item>
          <ContextMenu.Item action={() => {}}>Unpause</ContextMenu.Item>
          <ContextMenu.Item action={() => {}}>Resume</ContextMenu.Item>
          <ContextMenu.Item action={() => {}}>Unshelve</ContextMenu.Item>
          <ContextMenu.Item action={() => setDrawerOpen('rescue')}>Rescue</ContextMenu.Item>
          <ContextMenu.Item action={() => {}}>Unrescue</ContextMenu.Item>
        </ContextMenu.SubItems>
        <ContextMenu.SubItems label="Storage&Snapshot" subContextMenuDirection="right-top">
          <ContextMenu.Item action={() => setDrawerOpen('attachVol')}>
            Attach volume
          </ContextMenu.Item>
          <ContextMenu.Item action={() => setDrawerOpen('detachVol')} danger>
            Detach volume
          </ContextMenu.Item>
          <ContextMenu.Item action={() => setDrawerOpen('snapshot')}>
            Create instance snapshot
          </ContextMenu.Item>
        </ContextMenu.SubItems>
        <ContextMenu.SubItems label="Network" subContextMenuDirection="right-top">
          <ContextMenu.Item action={() => setDrawerOpen('attachIf')}>
            Attach interface
          </ContextMenu.Item>
          <ContextMenu.Item action={() => setDrawerOpen('detachIf')} danger>
            Detach interface
          </ContextMenu.Item>
          <ContextMenu.Item action={() => setDrawerOpen('assocFip')}>
            Associate floating IP
          </ContextMenu.Item>
          <ContextMenu.Item action={() => setDrawerOpen('disassocFip')} danger>
            Disassociate floating IP
          </ContextMenu.Item>
          <ContextMenu.Item action={() => setDrawerOpen('manageSg')}>
            Manage security groups
          </ContextMenu.Item>
        </ContextMenu.SubItems>
        <ContextMenu.SubItems label="Configuration" subContextMenuDirection="right-top">
          <ContextMenu.Item action={() => setDrawerOpen('lock')}>Lock setting</ContextMenu.Item>
          <ContextMenu.Item action={() => setDrawerOpen('rebuild')} danger>
            Rebuild
          </ContextMenu.Item>
          <ContextMenu.Item action={() => setDrawerOpen('resize')}>Resize</ContextMenu.Item>
          <ContextMenu.Item action={() => setDrawerOpen('manageTags')}>
            Manage tags
          </ContextMenu.Item>
          <ContextMenu.Item action={() => setDrawerOpen('edit')}>Edit</ContextMenu.Item>
        </ContextMenu.SubItems>
        <ContextMenu.Item action={() => {}}>Confirm resize</ContextMenu.Item>
        <ContextMenu.Item action={() => {}}>Revert resize</ContextMenu.Item>
      </ContextMenu.Root>
    </div>
  );

  const securityToolbar = (
    <div className="flex flex-col gap-4 pt-4">
      <FilterSearchInput
        className="w-full max-w-[320px]"
        filterKeys={ATTRIBUTE_SEARCH_FILTER_KEYS}
        placeholder="Search security group by attributes"
        defaultFilterKey="name"
        selectedFilters={attributeSearchSelectedFilters(securitySearchQuery)}
        onFilterAdd={(f: FilterKeyWithValue) => {
          setSecuritySearchQuery(String(f.value ?? ''));
          setSecurityCurrentPage(1);
        }}
      />
      <Pagination
        totalCount={filteredSecurityGroups.length}
        size={securityRowsPerPage}
        currentAt={securityCurrentPage}
        onPageChange={(page) => setSecurityCurrentPage(page)}
        onSettingClick={() => {}}
        totalCountLabel="items"
      />
      <Table<SecurityGroup>
        columns={securityColumns}
        rows={paginatedSecurity}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {paginatedSecurity.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={securityColumns[0]}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link
                  to={`/compute-admin/security-groups/${row.id}`}
                  className="text-12 leading-18 font-medium text-primary hover:underline no-underline truncate"
                >
                  {row.name}
                </Link>
                <span className="text-11 text-text-muted truncate">ID : {row.id}</span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={securityColumns[1]}>
              {row.description}
            </Table.Td>
            <Table.Td rowData={row} column={securityColumns[2]}>
              {row.createdAt}
            </Table.Td>
            <Table.Td rowData={row} column={securityColumns[3]} preventClickPropagation>
              <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                <ContextMenu.Item action={() => {}} danger>
                  Detach
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 min-w-[1176px]">
      <DetailPageHeader title={headerTitle} actions={actions} infoFields={infoFields} />

      <div className="w-full">
        <Tabs activeTabId={activeDetailTab} onChange={setActiveDetailTab} variant="line" size="sm">
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
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

              <SectionCard>
                <SectionCard.Header title="Flavor" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Flavor name"
                    value={instance.flavor.name}
                    isLink
                    linkHref="/compute-admin/flavors"
                  />
                  <SectionCard.DataRow
                    label="Spec"
                    value={`vCPU : ${instance.flavor.vcpu} / RAM : ${instance.flavor.ram} / Disk : ${instance.flavor.disk} / GPU : ${instance.flavor.gpu}`}
                  />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Source" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Image"
                    value={instance.image}
                    isLink
                    linkHref="/compute-admin/images"
                  />
                  <SectionCard.DataRow label="OS" value={instance.os} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Authentication" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Key pair"
                    value={instance.keyPair}
                    isLink
                    linkHref="/compute-admin/key-pairs"
                  />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Advanced" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Tags">
                    <div className="flex flex-wrap items-center gap-1">
                      <Tag label="Team" value="dev" />
                      <Tag label="Key" value="Value" />
                    </div>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow
                    label="Server group"
                    value={instance.serverGroup}
                    isLink
                    linkHref="/compute-admin/server-groups"
                  />
                  <SectionCard.DataRow label="User data" value={instance.userData} />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>

          <Tab id="volumes" label="Volumes">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-16 font-semibold leading-6 text-text m-0">Volumes</h2>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => setDrawerOpen('attachVol')}
                >
                  <IconSquarePlus size={12} stroke={1.5} /> Attach volume
                </Button>
              </div>
              <FilterSearchInput
                className="w-full max-w-[320px]"
                filterKeys={ATTRIBUTE_SEARCH_FILTER_KEYS}
                placeholder="Search volume by attributes"
                defaultFilterKey="name"
                selectedFilters={attributeSearchSelectedFilters(volSearchQuery)}
                onFilterAdd={(f: FilterKeyWithValue) => {
                  setVolSearchQuery(String(f.value ?? ''));
                  setVolPage(1);
                }}
              />
              <Pagination
                totalCount={filteredVolumes.length}
                size={volRowsPerPage}
                currentAt={volPage}
                onPageChange={(page) => setVolPage(page)}
                onSettingClick={() => {}}
                totalCountLabel="items"
              />
              <Table<AttachedVolume>
                columns={volumeColumns}
                rows={paginatedVolumes}
                sort={sort}
                order={order}
                onSortChange={handleSortChange}
                stickyLastColumn
              >
                {paginatedVolumes.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={volumeColumns[0]}>
                      <StatusIndicator
                        variant={volumeStatusVariant(row.status)}
                        layout="iconOnly"
                      />
                    </Table.Td>
                    <Table.Td rowData={row} column={volumeColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          to={`/compute-admin/volumes/${row.id}`}
                          className="text-12 leading-18 font-medium text-primary hover:underline no-underline truncate"
                        >
                          {row.name}
                        </Link>
                        <span className="text-11 text-text-muted truncate">ID : {row.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={volumeColumns[2]}>
                      {row.size}
                    </Table.Td>
                    <Table.Td rowData={row} column={volumeColumns[3]}>
                      {row.type}
                    </Table.Td>
                    <Table.Td rowData={row} column={volumeColumns[4]}>
                      {row.diskTag}
                    </Table.Td>
                    <Table.Td rowData={row} column={volumeColumns[5]}>
                      {row.bootable ? 'Yes' : 'No'}
                    </Table.Td>
                    <Table.Td rowData={row} column={volumeColumns[6]}>
                      {row.access}
                    </Table.Td>
                    <Table.Td rowData={row} column={volumeColumns[7]} preventClickPropagation>
                      <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                        <ContextMenu.SubItems label="Data protection">
                          <ContextMenu.Item action={() => {}}>
                            Create volume snapshot
                          </ContextMenu.Item>
                          <ContextMenu.Item action={() => {}}>
                            Create volume backup
                          </ContextMenu.Item>
                          <ContextMenu.Item action={() => {}}>Clone volume</ContextMenu.Item>
                        </ContextMenu.SubItems>
                        <ContextMenu.Item action={() => {}}>Extend volume</ContextMenu.Item>
                        <ContextMenu.Item action={() => {}}>Bootable</ContextMenu.Item>
                        <ContextMenu.Item action={() => setDrawerOpen('detachVol')} danger>
                          Detach
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>

          <Tab id="interfaces" label="Interfaces">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-16 font-semibold leading-6 text-text m-0">Interfaces</h2>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => setDrawerOpen('attachIf')}
                >
                  <IconSquarePlus size={12} stroke={1.5} /> Attach interface
                </Button>
              </div>
              <FilterSearchInput
                className="w-full max-w-[320px]"
                filterKeys={ATTRIBUTE_SEARCH_FILTER_KEYS}
                placeholder="Search interface by attributes"
                defaultFilterKey="name"
                selectedFilters={attributeSearchSelectedFilters(ifSearchQuery)}
                onFilterAdd={(f: FilterKeyWithValue) => {
                  setIfSearchQuery(String(f.value ?? ''));
                  setInterfaceCurrentPage(1);
                }}
              />
              <Pagination
                totalCount={filteredInterfaces.length}
                size={interfaceRowsPerPage}
                currentAt={interfaceCurrentPage}
                onPageChange={(page) => setInterfaceCurrentPage(page)}
                onSettingClick={() => {}}
                totalCountLabel="items"
              />
              <Table<AttachedInterface>
                columns={interfaceColumns}
                rows={paginatedInterfaces}
                sort={sort}
                order={order}
                onSortChange={handleSortChange}
                stickyLastColumn
              >
                {paginatedInterfaces.map((iface) => (
                  <Table.Tr key={iface.id} rowData={iface}>
                    <Table.Td rowData={iface} column={interfaceColumns[0]}>
                      <StatusIndicator
                        variant={portStatusVariant(iface.portStatus)}
                        layout="iconOnly"
                      />
                    </Table.Td>
                    <Table.Td rowData={iface} column={interfaceColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          to={`/compute-admin/ports/${iface.id}`}
                          className="text-12 leading-18 font-medium text-primary hover:underline no-underline truncate"
                        >
                          {iface.name}
                        </Link>
                        <span className="text-11 text-text-muted truncate">ID : {iface.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={iface} column={interfaceColumns[2]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          to={`/compute-admin/networks/${iface.id}`}
                          className="text-12 leading-18 font-medium text-primary hover:underline no-underline truncate"
                        >
                          {iface.network}
                        </Link>
                        <span className="text-11 text-text-muted truncate">ID : {iface.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={iface} column={interfaceColumns[3]}>
                      {iface.fixedIp}
                    </Table.Td>
                    <Table.Td rowData={iface} column={interfaceColumns[4]}>
                      {iface.macAddress}
                    </Table.Td>
                    <Table.Td rowData={iface} column={interfaceColumns[5]}>
                      {iface.createdAt}
                    </Table.Td>
                    <Table.Td rowData={iface} column={interfaceColumns[6]} preventClickPropagation>
                      <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                        <ContextMenu.Item action={() => setDrawerOpen('detachIf')} danger>
                          Detach
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>

          <Tab id="floating-ips" label="Floating IPs">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-16 font-semibold leading-6 text-text m-0">Floating IPs</h2>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => setDrawerOpen('assocFip')}
                >
                  <IconLinkPlus size={12} stroke={1.5} /> Associate floating IP
                </Button>
              </div>
              <FilterSearchInput
                className="w-full max-w-[320px]"
                filterKeys={ATTRIBUTE_SEARCH_FILTER_KEYS}
                placeholder="Search floating IP by attributes"
                defaultFilterKey="name"
                selectedFilters={attributeSearchSelectedFilters(fipSearchQuery)}
                onFilterAdd={(f: FilterKeyWithValue) => {
                  setFipSearchQuery(String(f.value ?? ''));
                  setFloatingIpCurrentPage(1);
                }}
              />
              <Pagination
                totalCount={filteredFloatingIps.length}
                size={floatingIpRowsPerPage}
                currentAt={floatingIpCurrentPage}
                onPageChange={(page) => setFloatingIpCurrentPage(page)}
                onSettingClick={() => {}}
                totalCountLabel="items"
              />
              <Table<FloatingIP>
                columns={floatingColumns}
                rows={paginatedFloatingIps}
                sort={sort}
                order={order}
                onSortChange={handleSortChange}
                stickyLastColumn
              >
                {paginatedFloatingIps.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={floatingColumns[0]}>
                      <StatusIndicator
                        variant={floatingStatusVariant(row.status)}
                        layout="iconOnly"
                      />
                    </Table.Td>
                    <Table.Td rowData={row} column={floatingColumns[1]}>
                      <Link
                        to={`/compute-admin/floating-ips/${row.id}`}
                        className="text-12 leading-18 font-medium text-primary hover:underline no-underline truncate"
                      >
                        {row.floatingIp}
                      </Link>
                    </Table.Td>
                    <Table.Td rowData={row} column={floatingColumns[2]}>
                      {row.fixedIp}
                    </Table.Td>
                    <Table.Td rowData={row} column={floatingColumns[3]}>
                      {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                    </Table.Td>
                    <Table.Td rowData={row} column={floatingColumns[4]} preventClickPropagation>
                      <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                        <ContextMenu.Item action={() => setDrawerOpen('disassocFip')} danger>
                          Disassociate
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>

          <Tab id="security" label="Security">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-16 font-semibold leading-6 text-text m-0">Security groups</h2>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => setDrawerOpen('manageSg')}
                >
                  <IconSettings size={12} stroke={1.5} /> Manage security group
                </Button>
              </div>
              <Tabs
                activeTabId={selectedNetworkInterface}
                onChange={setSelectedNetworkInterface}
                variant="button"
                size="sm"
                destroyOnHidden={false}
              >
                {mockNetworkInterfaces.map((net) => (
                  <Tab key={net.id} id={net.id} label={`${net.name}(${net.ip})`}>
                    {securityToolbar}
                  </Tab>
                ))}
              </Tabs>
            </div>
          </Tab>

          <Tab id="snapshots" label="Instance snapshots">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-16 font-semibold leading-6 text-text m-0">
                  Instance snapshots
                </h2>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => setDrawerOpen('snapshot')}
                >
                  <IconCirclePlus size={12} stroke={1.5} /> Create Snapshot
                </Button>
              </div>
              <FilterSearchInput
                className="w-full max-w-[320px]"
                filterKeys={ATTRIBUTE_SEARCH_FILTER_KEYS}
                placeholder="Search instance snapshot by attributes"
                defaultFilterKey="name"
                selectedFilters={attributeSearchSelectedFilters(snapshotSearchQuery)}
                onFilterAdd={(f: FilterKeyWithValue) => {
                  setSnapshotSearchQuery(String(f.value ?? ''));
                  setSnapshotCurrentPage(1);
                }}
              />
              <Pagination
                totalCount={filteredSnapshots.length}
                size={snapshotRowsPerPage}
                currentAt={snapshotCurrentPage}
                onPageChange={(page) => setSnapshotCurrentPage(page)}
                onSettingClick={() => {}}
                totalCountLabel="items"
              />
              <Table<InstanceSnapshot>
                columns={snapshotColumns}
                rows={paginatedSnapshots}
                sort={sort}
                order={order}
                onSortChange={handleSortChange}
                stickyLastColumn
                emptyUI={
                  <span className="text-12 text-text-muted">No instance snapshots found</span>
                }
              >
                {paginatedSnapshots.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={snapshotColumns[0]}>
                      <StatusIndicator
                        variant={snapshotStatusVariant(row.status)}
                        layout="iconOnly"
                      />
                    </Table.Td>
                    <Table.Td rowData={row} column={snapshotColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          to={`/compute-admin/instance-snapshots/${row.id}`}
                          className="text-12 leading-18 font-medium text-primary hover:underline no-underline truncate"
                        >
                          {row.name}
                        </Link>
                        <span className="text-11 text-text-muted truncate">ID : {row.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={snapshotColumns[2]}>
                      {row.size}
                    </Table.Td>
                    <Table.Td rowData={row} column={snapshotColumns[3]}>
                      {row.diskFormat}
                    </Table.Td>
                    <Table.Td rowData={row} column={snapshotColumns[4]}>
                      {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                    </Table.Td>
                    <Table.Td rowData={row} column={snapshotColumns[5]} preventClickPropagation>
                      <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                        <ContextMenu.Item action={() => {}}>Edit</ContextMenu.Item>
                        <ContextMenu.Item action={() => {}}>Create instance</ContextMenu.Item>
                        <ContextMenu.Item action={() => {}}>Create volume</ContextMenu.Item>
                        <ContextMenu.Item action={() => {}} danger>
                          Delete
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>

          <Tab id="monitoring" label="Monitoring">
            <div className="flex flex-col gap-3 pt-4">
              <h2 className="text-16 font-semibold leading-6 text-text m-0">Monitoring</h2>
              <MonitoringToolbar
                timeRange={monitoringTimeRange}
                onTimeRangeChange={(v) => setMonitoringTimeRange(v as TimeRange)}
                timeRangeOptions={[
                  { label: '1h', value: '1h' },
                  { label: '1d', value: '1d' },
                  { label: '1w', value: '1w' },
                  { label: '2w', value: '2w' },
                ]}
                customPeriod={null}
                onCustomPeriodChange={() => {}}
                onRefresh={() => {}}
              />
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 flex-wrap">
                  <div className="flex-1 min-w-[280px] min-h-[200px] rounded-lg border border-border bg-surface-muted" />
                  <div className="flex-1 min-w-[280px] min-h-[200px] rounded-lg border border-border bg-surface-muted" />
                </div>
                <div className="flex gap-3 flex-wrap">
                  <div className="flex-1 min-w-[280px] min-h-[200px] rounded-lg border border-border bg-surface-muted" />
                  <div className="flex-1 min-w-[280px] min-h-[200px] rounded-lg border border-border bg-surface-muted" />
                </div>
                <div className="w-full max-w-[calc(50%-6px)] min-h-[200px] rounded-lg border border-border bg-surface-muted" />
              </div>
            </div>
          </Tab>

          <Tab id="resource-map" label="Resource map">
            <div className="pt-6">
              <p className="text-12 text-text-muted m-0">
                Resource Map content will be displayed here.
              </p>
            </div>
          </Tab>

          <Tab id="logs" label="Logs">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center h-7">
                <h2 className="text-16 font-semibold leading-6 text-text m-0">Console Logs</h2>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-surface-default border border-border rounded-md w-full">
                <div className="flex items-center gap-3">
                  <span className="text-13 font-medium leading-[18px] text-text">Log Length</span>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center justify-between w-20 h-7 px-2.5 py-1 bg-surface-default border border-border-strong rounded-md">
                      <span className="text-12 leading-[18px] text-text">{logLength}</span>
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => setLogLength((p) => p + 1)}
                          className="text-text hover:text-primary p-0 border-none bg-transparent cursor-pointer"
                          aria-label="Increase log length"
                        >
                          <IconChevronUp size={12} stroke={1.5} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setLogLength((p) => Math.max(1, p - 1))}
                          className="text-text hover:text-primary p-0 border-none bg-transparent cursor-pointer"
                          aria-label="Decrease log length"
                        >
                          <IconChevronDown size={12} stroke={1.5} />
                        </button>
                      </div>
                    </div>
                    <Button variant="secondary" appearance="outline" size="sm" aria-label="Search">
                      <IconSearch size={12} stroke={1.5} />
                    </Button>
                  </div>
                </div>
                <Button variant="secondary" appearance="outline" size="sm" aria-label="Download">
                  <IconDownload size={12} stroke={1.5} />
                </Button>
              </div>
              <div className="w-full flex-1 min-h-[500px] bg-[#1e293b] border border-border rounded-lg p-6 overflow-auto">
                <pre className="font-mono text-12 leading-[22px] text-[#cbd5e1] whitespace-pre-wrap m-0">
                  {CONSOLE_LOG_SAMPLE}
                </pre>
              </div>
            </div>
          </Tab>

          <Tab id="action-logs" label="Action logs">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center h-7">
                <h2 className="text-16 font-semibold leading-6 text-text m-0">Action logs</h2>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <FilterSearchInput
                  className="flex-1 min-w-0 max-w-[320px]"
                  filterKeys={ATTRIBUTE_SEARCH_FILTER_KEYS}
                  placeholder="Search action logs by attributes"
                  defaultFilterKey="name"
                  selectedFilters={attributeSearchSelectedFilters(actionLogSearchQuery)}
                  onFilterAdd={(f: FilterKeyWithValue) => {
                    setActionLogSearchQuery(String(f.value ?? ''));
                    setActionLogCurrentPage(1);
                  }}
                />
                <Button variant="secondary" appearance="outline" size="sm" aria-label="Download">
                  <IconDownload size={12} stroke={1.5} />
                </Button>
              </div>
              <Pagination
                totalCount={filteredActionLogs.length}
                size={actionLogRowsPerPage}
                currentAt={actionLogCurrentPage}
                onPageChange={(page) => setActionLogCurrentPage(page)}
                onSettingClick={() => {}}
                totalCountLabel="items"
              />
              <Table<ActionLog>
                columns={actionLogColumns}
                rows={paginatedActionLogs}
                sort={sort}
                order={order}
                onSortChange={handleSortChange}
              >
                {paginatedActionLogs.flatMap((row) => {
                  const expanded = expandedLogIds.has(row.id);
                  const r = row;
                  const rowsOut: ReactElement[] = [
                    <Table.Tr key={row.id} rowData={r} onClick={() => toggleLogExpansion(row.id)}>
                      <Table.Td rowData={r} column={actionLogColumns[0]}>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLogExpansion(row.id);
                            }}
                            className="p-0.5 hover:bg-surface-muted rounded border-none bg-transparent cursor-pointer"
                            aria-expanded={expanded}
                            aria-label={expanded ? 'Collapse row' : 'Expand row'}
                          >
                            {expanded ? (
                              <IconChevronDown size={12} stroke={1.5} className="text-text" />
                            ) : (
                              <IconChevronRight size={12} stroke={1.5} className="text-text" />
                            )}
                          </button>
                          <span>{row.operationName}</span>
                        </div>
                      </Table.Td>
                      <Table.Td rowData={r} column={actionLogColumns[1]}>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="truncate">{row.requestId}</span>
                          <CopyButton text={row.requestId} />
                        </div>
                      </Table.Td>
                      <Table.Td rowData={r} column={actionLogColumns[2]}>
                        {row.requestedTime}
                      </Table.Td>
                    </Table.Tr>,
                  ];
                  if (expanded) {
                    rowsOut.push(
                      <Table.Tr key={`${row.id}-detail`} rowData={r}>
                        <Table.Td rowData={r} column={actionLogColumns[0]} colSpan={3}>
                          <div className="flex items-center gap-4 px-8 py-3">
                            <div className="flex items-center gap-2 text-12 text-text">
                              <span className="font-medium">Result :</span>
                              <span>{row.result}</span>
                            </div>
                            <div className="w-px h-3 bg-border" />
                            <div className="flex items-center gap-2 text-12 text-text">
                              <span className="font-medium">Start Time :</span>
                              <span>{row.startTime}</span>
                            </div>
                            <div className="w-px h-3 bg-border" />
                            <div className="flex items-center gap-2 text-12 text-text">
                              <span className="font-medium">End Time :</span>
                              <span>{row.endTime}</span>
                            </div>
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    );
                  }
                  return rowsOut;
                })}
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>
      <EditInstanceDrawer
        isOpen={drawerOpen === 'edit'}
        onClose={closeDrawer}
        instanceId={instance.id}
        initialData={{ name: instance.name, description: '' }}
      />
      <CreateInstanceSnapshotDrawer
        isOpen={drawerOpen === 'snapshot'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <LockSettingDrawer
        isOpen={drawerOpen === 'lock'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <AttachVolumeDrawer
        isOpen={drawerOpen === 'attachVol'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <DetachVolumeDrawer
        isOpen={drawerOpen === 'detachVol'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <AttachInterfaceDrawer
        isOpen={drawerOpen === 'attachIf'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <DetachInterfaceDrawer
        isOpen={drawerOpen === 'detachIf'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <AssociateFloatingIPDrawer
        isOpen={drawerOpen === 'assocFip'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <DisassociateFloatingIPDrawer
        isOpen={drawerOpen === 'disassocFip'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <ManageSecurityGroupsDrawer
        isOpen={drawerOpen === 'manageSg'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <ManageTagsDrawer
        isOpen={drawerOpen === 'manageTags'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <ResizeInstanceDrawer
        isOpen={drawerOpen === 'resize'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <RebuildInstanceDrawer
        isOpen={drawerOpen === 'rebuild'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <RescueInstanceDrawer
        isOpen={drawerOpen === 'rescue'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <LiveMigrateInstanceDrawer
        isOpen={drawerOpen === 'migrate'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
    </div>
  );
}

export default ComputeAdminInstanceDetailPage;
