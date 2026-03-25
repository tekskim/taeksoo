import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { EditServerGroupDrawer } from '../drawers/compute/misc/EditServerGroupDrawer';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Table } from '@shared/components/Table';
import { Pagination } from '@shared/components/Pagination';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import type { FilterKeyWithValue } from '@shared/components/FilterSearch';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { ContextMenu } from '@shared/components/ContextMenu';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import {
  IconCirclePlus,
  IconTrash,
  IconDotsCircleHorizontal,
  IconLock,
  IconLockOpen,
  IconTerminal2,
  IconEdit,
} from '@tabler/icons-react';
import { stripTimeFromTableDate } from './tableDateDisplay';

type PolicyType = 'Anti-affinity' | 'Affinity' | 'Soft-anti-affinity' | 'Soft-affinity';
type InstanceStatus = 'active' | 'building' | 'error' | 'shutoff' | 'paused';

interface ServerGroupDetail {
  id: string;
  name: string;
  policy: PolicyType;
}

interface ServerGroupInstance {
  id: string;
  name: string;
  status: InstanceStatus;
  locked: boolean;
  fixedIP: string;
  floatingIP: string;
  az: string;
  os: string;
  image: string;
  createdAt: string;
}

const mockServerGroupsMap: Record<string, ServerGroupDetail> = {
  'sg-001': { id: 'sg-001', name: 'server-1', policy: 'Anti-affinity' },
  'sg-002': { id: 'sg-002', name: 'web-servers', policy: 'Anti-affinity' },
  'sg-003': { id: 'sg-003', name: 'db-cluster', policy: 'Affinity' },
  'sg-004': { id: 'sg-004', name: 'cache-group', policy: 'Soft-anti-affinity' },
  'sg-005': { id: 'sg-005', name: 'app-servers', policy: 'Anti-affinity' },
  'sg-006': { id: 'sg-006', name: 'monitoring', policy: 'Soft-affinity' },
  'sg-007': { id: 'sg-007', name: 'k8s-workers', policy: 'Anti-affinity' },
  'sg-008': { id: 'sg-008', name: 'k8s-masters', policy: 'Anti-affinity' },
  'sg-009': { id: 'sg-009', name: 'storage-nodes', policy: 'Affinity' },
  'sg-010': { id: 'sg-010', name: 'load-balancers', policy: 'Anti-affinity' },
};

const defaultServerGroupDetail: ServerGroupDetail = {
  id: 'unknown',
  name: 'Unknown Server group',
  policy: '-',
};

const mockServerGroupInstances: ServerGroupInstance[] = [
  {
    id: '29tgj234',
    name: 'web-server-01',
    status: 'active',
    locked: true,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    image: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj235',
    name: 'web-server-01',
    status: 'active',
    locked: true,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    image: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj236',
    name: 'web-server-01',
    status: 'active',
    locked: true,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    image: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj237',
    name: 'web-server-01',
    status: 'error',
    locked: false,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    image: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj238',
    name: 'web-server-01',
    status: 'active',
    locked: true,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    image: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj239',
    name: 'web-server-01',
    status: 'shutoff',
    locked: false,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    image: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj240',
    name: 'web-server-01',
    status: 'active',
    locked: true,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    image: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj241',
    name: 'web-server-01',
    status: 'active',
    locked: false,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    image: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj242',
    name: 'web-server-01',
    status: 'building',
    locked: false,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    image: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj243',
    name: 'web-server-01',
    status: 'active',
    locked: true,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    image: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
  {
    id: '29tgj244',
    name: 'web-server-01',
    status: 'paused',
    locked: false,
    fixedIP: '10.62.0.30',
    floatingIP: '192.168.1.10',
    az: 'zone-o',
    os: 'Ubuntu 24.04',
    image: 'Ubuntu 24.04',
    createdAt: 'Sep 30, 2025',
  },
];

function instanceStatusVariant(s: InstanceStatus): StatusVariant {
  const m: Record<InstanceStatus, StatusVariant> = {
    active: 'active',
    building: 'building',
    error: 'error',
    shutoff: 'shutoff',
    paused: 'paused',
  };
  return m[s];
}

const STATUS_W = 60;
const ACTION_W = 72;
const LOCK_W = 60;

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

export function ComputeServerGroupDetailPage() {
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'instances';

  const serverGroup = useMemo(
    () => (id ? mockServerGroupsMap[id] || defaultServerGroupDetail : defaultServerGroupDetail),
    [id]
  );

  const [instanceSearchQuery, setInstanceSearchQuery] = useState('');
  const [instanceCurrentPage, setInstanceCurrentPage] = useState(1);
  const instancesPerPage = 10;
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const handleSortChange = (nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  };

  const filteredInstances = useMemo(() => {
    if (!instanceSearchQuery) return mockServerGroupInstances;
    const query = instanceSearchQuery.toLowerCase();
    return mockServerGroupInstances.filter(
      (inst) =>
        inst.name.toLowerCase().includes(query) ||
        inst.id.toLowerCase().includes(query) ||
        inst.image.toLowerCase().includes(query) ||
        inst.fixedIP.toLowerCase().includes(query)
    );
  }, [instanceSearchQuery]);

  const instanceTotalPages = Math.ceil(filteredInstances.length / instancesPerPage);
  const paginatedInstances = useMemo(() => {
    const start = (instanceCurrentPage - 1) * instancesPerPage;
    return filteredInstances.slice(start, start + instancesPerPage);
  }, [filteredInstances, instanceCurrentPage, instancesPerPage]);

  const instanceColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: STATUS_W, align: 'center' },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'locked', header: 'Locked', width: LOCK_W, align: 'center' },
      { key: 'fixedIP', header: 'Fixed IP' },
      { key: 'floatingIP', header: 'Floating IP' },
      { key: 'az', header: 'AZ' },
      { key: 'os', header: 'OS', sortable: true },
      { key: 'createdAt', header: 'Created at', sortable: true },
      { key: 'actions', header: 'Action', width: ACTION_W, align: 'center', clickable: false },
    ],
    []
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'ID', value: serverGroup.id, showCopyButton: true, copyText: serverGroup.id },
    { label: 'Policy', value: serverGroup.policy },
  ];

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={serverGroup.name}
        actions={
          <div className="flex flex-wrap gap-1">
            <Button variant="secondary" appearance="outline" size="sm">
              <IconCirclePlus size={12} stroke={1.5} /> Create instance
            </Button>
            <Button
              variant="secondary"
              appearance="outline"
              size="sm"
              onClick={() => setEditDrawerOpen(true)}
            >
              <IconEdit size={12} stroke={1.5} /> Edit
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconTrash size={12} stroke={1.5} /> Delete
            </Button>
          </div>
        }
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs
          activeTabId={activeTab}
          onChange={(tab) => setSearchParams({ tab }, { replace: true })}
          variant="line"
          size="sm"
        >
          <Tab id="instances" label="Instances">
            <div className="flex flex-col gap-4 pt-4">
              <h2 className="text-16 font-semibold leading-6 text-text m-0">Instances</h2>
              <FilterSearchInput
                filterKeys={[{ key: 'name', label: 'Name', type: 'input' as const }]}
                onFilterAdd={(f: FilterKeyWithValue) => {
                  setInstanceSearchQuery(String(f.value ?? ''));
                  setInstanceCurrentPage(1);
                }}
                selectedFilters={
                  instanceSearchQuery
                    ? [
                        {
                          id: 'search',
                          key: 'name',
                          label: 'Name',
                          value: instanceSearchQuery,
                          type: 'input' as const,
                        },
                      ]
                    : []
                }
                placeholder="Search by attributes"
                defaultFilterKey="name"
                className="w-full max-w-[320px]"
              />
              <Pagination
                totalCount={filteredInstances.length}
                size={instancesPerPage}
                currentAt={instanceCurrentPage}
                onPageChange={(p) => setInstanceCurrentPage(p)}
                onSettingClick={() => {}}
                totalCountLabel="items"
              />
              <Table<ServerGroupInstance>
                columns={instanceColumns}
                rows={paginatedInstances}
                sort={sort}
                order={order}
                onSortChange={handleSortChange}
                stickyLastColumn
              >
                {paginatedInstances.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={instanceColumns[0]}>
                      <StatusIndicator
                        variant={instanceStatusVariant(row.status)}
                        layout="iconOnly"
                      />
                    </Table.Td>
                    <Table.Td rowData={row} column={instanceColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          to={`/compute/instances/${row.id}`}
                          className="text-12 leading-18 font-medium text-primary hover:underline no-underline truncate"
                        >
                          {row.name}
                        </Link>
                        <span className="text-11 text-text-muted truncate">ID : {row.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={instanceColumns[2]}>
                      {row.locked ? (
                        <IconLock size={16} stroke={1.5} className="text-text mx-auto" />
                      ) : (
                        <IconLockOpen size={16} stroke={1.5} className="text-text-muted mx-auto" />
                      )}
                    </Table.Td>
                    <Table.Td rowData={row} column={instanceColumns[3]}>
                      {row.fixedIP}
                    </Table.Td>
                    <Table.Td rowData={row} column={instanceColumns[4]}>
                      <Link
                        to="#"
                        className="text-12 leading-18 font-medium text-primary hover:underline no-underline"
                      >
                        {row.floatingIP}
                      </Link>
                    </Table.Td>
                    <Table.Td rowData={row} column={instanceColumns[5]}>
                      {row.az}
                    </Table.Td>
                    <Table.Td rowData={row} column={instanceColumns[6]}>
                      {row.os}
                    </Table.Td>
                    <Table.Td rowData={row} column={instanceColumns[7]}>
                      {stripTimeFromTableDate(row.createdAt)}
                    </Table.Td>
                    <Table.Td rowData={row} column={instanceColumns[8]} preventClickPropagation>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          className="p-1.5 rounded-md hover:bg-surface-muted transition-colors border-none bg-transparent cursor-pointer"
                          title="Open console"
                        >
                          <IconTerminal2 size={16} stroke={1.5} className="text-text-muted" />
                        </button>
                        <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                          <ContextMenu.Item action={() => console.log('Console', row.id)}>
                            Console
                          </ContextMenu.Item>
                          <ContextMenu.Item action={() => console.log('Start', row.id)}>
                            Start
                          </ContextMenu.Item>
                          <ContextMenu.Item action={() => console.log('Stop', row.id)}>
                            Stop
                          </ContextMenu.Item>
                          <ContextMenu.Item action={() => console.log('Reboot', row.id)}>
                            Reboot
                          </ContextMenu.Item>
                          <ContextMenu.Item action={() => console.log('Delete', row.id)} danger>
                            Delete
                          </ContextMenu.Item>
                        </ContextMenu.Root>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>

      <EditServerGroupDrawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        serverGroupId={serverGroup.id}
        initialData={{ name: serverGroup.name, description: '' }}
      />
    </div>
  );
}
