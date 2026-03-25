import { useMemo, useState, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { EditPoolDrawer } from '../drawers/compute/load-balancer/EditPoolDrawer';
import { ManageMembersDrawer } from '../drawers/compute/load-balancer/ManageMembersDrawer';
import { CreateHealthMonitorDrawer } from '../drawers/compute/load-balancer/CreateHealthMonitorDrawer';
import { EditMemberDrawer } from '../drawers/compute/load-balancer/EditMemberDrawer';
import { Table } from '@shared/components/Table';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Badge } from '@shared/components/Badge';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { IconTrash, IconDownload, IconEdit } from '@tabler/icons-react';

type PoolStatus = 'active' | 'down' | 'error';
type MemberStatus = 'active' | 'down' | 'error';

interface PoolDetail {
  id: string;
  name: string;
  tenant: string;
  status: PoolStatus;
  adminState: 'Up' | 'Down';
  createdAt: string;
  description: string;
  algorithm: string;
  protocol: string;
  sessionPersistence: string;
  listener: { name: string; id: string } | null;
}

interface Member extends Record<string, unknown> {
  id: string;
  status: MemberStatus;
  source: {
    name: string;
    id: string;
  };
  ipAddress: string;
  port: number;
  weight: number;
  backup: boolean;
  adminState: 'Up' | 'Down';
}

interface HealthMonitor {
  id: string;
  name: string;
  state: string;
  type: string;
  interval: number;
  timeout: number;
  maxRetries: number;
  adminState: 'Up' | 'Down';
}

const mockPoolsMap: Record<string, PoolDetail> = {
  '29fg23400': {
    id: '29fg23400',
    name: 'pool-http',
    tenant: 'demo-project',
    status: 'active',
    adminState: 'Up',
    createdAt: 'Jul 25, 2025 10:32:16',
    description: '-',
    algorithm: 'Round Robin',
    protocol: 'HTTP',
    sessionPersistence: 'None',
    listener: { name: 'listener-http-80', id: '29tgj234' },
  },
  '29fg23401': {
    id: '29fg23401',
    name: 'pool-http',
    tenant: 'engineering',
    status: 'active',
    adminState: 'Up',
    createdAt: 'Jul 24, 2025 03:19:59',
    description: 'HTTP connection pool',
    algorithm: 'Round Robin',
    protocol: 'HTTP',
    sessionPersistence: 'None',
    listener: { name: 'listener-http-80', id: '29tgj234' },
  },
  '29fg23402': {
    id: '29fg23402',
    name: 'pool-http',
    tenant: 'production',
    status: 'active',
    adminState: 'Up',
    createdAt: 'Jul 23, 2025 20:06:42',
    description: 'HTTP connection pool',
    algorithm: 'Round Robin',
    protocol: 'HTTP',
    sessionPersistence: 'None',
    listener: { name: 'listener-http-80', id: '29tgj234' },
  },
};

const defaultPoolDetail: PoolDetail = {
  id: 'pool-default',
  name: 'Unknown Pool',
  tenant: '-',
  status: 'active',
  adminState: 'Up',
  createdAt: '-',
  description: '-',
  algorithm: '-',
  protocol: '-',
  sessionPersistence: '-',
  listener: { name: '-', id: '' },
};

const mockMembers: Member[] = Array.from({ length: 115 }, (_, i) => ({
  id: `member-${String(i + 1).padStart(3, '0')}`,
  status: ['active', 'active', 'active', 'down', 'error'][i % 5] as MemberStatus,
  source: {
    name: 'instance-usw-lo',
    id: `inst-${String(i + 1).padStart(3, '0')}`,
  },
  ipAddress: '10.63.0.46',
  port: 80,
  weight: 1,
  backup: false,
  adminState: 'Up' as const,
}));

const mockHealthMonitor: HealthMonitor = {
  id: 'hm-001',
  name: 'hm-pool-http',
  state: 'Online',
  type: 'HTTP',
  interval: 5,
  timeout: 3,
  maxRetries: 3,
  adminState: 'Up',
};

const poolStatusMap: Record<PoolStatus, StatusVariant> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

const memberStatusMap: Record<MemberStatus, StatusVariant> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

const STATUS_COL_WIDTH = 60;
const ACTION_COL_WIDTH = 72;
const linkClass =
  'text-12 leading-18 font-medium text-primary hover:underline no-underline inline-flex items-center gap-1.5 min-w-0';

const MemberMenuTrigger = ({ toggle }: { toggle: () => void }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      toggle();
    }}
    className="p-1.5 rounded-md hover:bg-surface-muted border-none bg-transparent inline-flex"
    aria-label="Row actions"
  >
    <IconTrash size={16} stroke={1.5} className="text-text-subtle" />
  </button>
);

export function ComputeAdminPoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const pool = useMemo(
    () => (id ? (mockPoolsMap[id] ?? defaultPoolDetail) : defaultPoolDetail),
    [id]
  );

  const [editPoolOpen, setEditPoolOpen] = useState(false);
  const [manageMembersOpen, setManageMembersOpen] = useState(false);
  const [createHealthMonOpen, setCreateHealthMonOpen] = useState(false);
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberCurrentPage, setMemberCurrentPage] = useState(1);
  const membersPerPage = 10;
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const handleSort = useCallback((k: string | null, o: SortOrder) => {
    setSort(k ?? '');
    setOrder(o);
  }, []);

  const filteredMembers = useMemo(() => {
    if (!memberSearchTerm) return mockMembers;
    const q = memberSearchTerm.toLowerCase();
    return mockMembers.filter(
      (member) =>
        member.id.toLowerCase().includes(q) ||
        member.source.name.toLowerCase().includes(q) ||
        member.ipAddress.toLowerCase().includes(q)
    );
  }, [memberSearchTerm]);

  const paginatedMembers = filteredMembers.slice(
    (memberCurrentPage - 1) * membersPerPage,
    memberCurrentPage * membersPerPage
  );

  const healthMonitor = mockHealthMonitor;

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: pool.status === 'active' ? 'Online' : pool.status,
      accessory: <StatusIndicator variant={poolStatusMap[pool.status]} layout="iconOnly" />,
    },
    { label: 'ID', value: pool.id, showCopyButton: true, copyText: pool.id },
    { label: 'Tenant', value: pool.tenant },
    { label: 'Admin state', value: pool.adminState },
    { label: 'Created at', value: pool.createdAt },
  ];

  const memberColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
      { key: 'ipAddress', header: 'IP Address' },
      { key: 'port', header: 'Port', sortable: true },
      { key: 'weight', header: 'Weight', sortable: true },
      { key: 'backup', header: 'Backup' },
      { key: 'adminState', header: 'Admin state' },
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

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={pool.name}
        actions={
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              variant="secondary"
              appearance="outline"
              size="sm"
              onClick={() => setEditPoolOpen(true)}
            >
              <IconEdit size={12} stroke={1.5} /> Edit
            </Button>
            <Button
              variant="secondary"
              appearance="outline"
              size="sm"
              onClick={() => setManageMembersOpen(true)}
            >
              Manage members
            </Button>
            <Button
              variant="secondary"
              appearance="outline"
              size="sm"
              onClick={() => setCreateHealthMonOpen(true)}
            >
              Health monitor
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconTrash size={12} stroke={1.5} /> Delete
            </Button>
          </div>
        }
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs activeTabId={activeDetailTab} onChange={setActiveDetailTab} variant="line" size="sm">
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Name" value={pool.name} />
                  <SectionCard.DataRow label="Tenant" value={pool.tenant} />
                  <SectionCard.DataRow label="Description" value={pool.description} />
                  <SectionCard.DataRow label="Admin state" value={pool.adminState} />
                  <SectionCard.DataRow label="Algorithm" value={pool.algorithm} />
                  <SectionCard.DataRow label="Protocol" value={pool.protocol} />
                  <SectionCard.DataRow
                    label="Session persistence"
                    value={pool.sessionPersistence}
                  />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Association" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Listener">
                    {pool.listener && pool.listener.id ? (
                      <Link
                        to={`/compute-admin/listeners/${pool.listener.id}`}
                        className={linkClass}
                      >
                        {pool.listener.name}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>

          <Tab id="members" label="Members">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-16 font-semibold text-text m-0">Members</h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <input
                    type="search"
                    value={memberSearchTerm}
                    onChange={(e) => {
                      setMemberSearchTerm(e.target.value);
                      setMemberCurrentPage(1);
                    }}
                    placeholder="Search member by attributes"
                    className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
                  />
                  <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
                    <IconDownload size={12} stroke={1.5} />
                  </Button>
                </div>
              </div>
              <Pagination
                totalCount={filteredMembers.length}
                size={membersPerPage}
                currentAt={memberCurrentPage}
                onPageChange={setMemberCurrentPage}
                totalCountLabel="items"
                onSettingClick={() => {}}
              />
              <Table<Member>
                columns={memberColumns}
                rows={paginatedMembers}
                sort={sort}
                order={order}
                onSortChange={handleSort}
              >
                {paginatedMembers.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={memberColumns[0]}>
                      <StatusIndicator variant={memberStatusMap[row.status]} layout="iconOnly" />
                    </Table.Td>
                    <Table.Td rowData={row} column={memberColumns[1]}>
                      {row.ipAddress}
                    </Table.Td>
                    <Table.Td rowData={row} column={memberColumns[2]}>
                      {row.port}
                    </Table.Td>
                    <Table.Td rowData={row} column={memberColumns[3]}>
                      {row.weight}
                    </Table.Td>
                    <Table.Td rowData={row} column={memberColumns[4]}>
                      {row.backup ? 'Yes' : 'No'}
                    </Table.Td>
                    <Table.Td rowData={row} column={memberColumns[5]}>
                      <Badge
                        theme={row.adminState === 'Up' ? 'gre' : 'gry'}
                        size="sm"
                        type="subtle"
                      >
                        {row.adminState}
                      </Badge>
                    </Table.Td>
                    <Table.Td rowData={row} column={memberColumns[6]} preventClickPropagation>
                      <ContextMenu.Root
                        direction="bottom-end"
                        gap={4}
                        trigger={({ toggle }) => <MemberMenuTrigger toggle={toggle} />}
                      >
                        <ContextMenu.Item
                          action={() => {
                            setActiveMemberId(row.id);
                            setEditMemberOpen(true);
                          }}
                        >
                          Edit
                        </ContextMenu.Item>
                        <ContextMenu.Item action={() => console.log('Delete', row.id)} danger>
                          Delete
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>

          <Tab id="health-monitor" label="Health monitor">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Health monitor" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Health monitor name" value={healthMonitor.name} />
                  <SectionCard.DataRow label="State" value={healthMonitor.state} />
                  <SectionCard.DataRow label="Admin state" value={healthMonitor.adminState} />
                  <SectionCard.DataRow label="Type" value={healthMonitor.type} />
                  <SectionCard.DataRow label="Interval" value={`${healthMonitor.interval} sec`} />
                  <SectionCard.DataRow label="Timeout" value={`${healthMonitor.timeout} sec`} />
                  <SectionCard.DataRow
                    label="Max retries"
                    value={String(healthMonitor.maxRetries)}
                  />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>
        </Tabs>
      </div>

      <EditPoolDrawer
        isOpen={editPoolOpen}
        onClose={() => setEditPoolOpen(false)}
        poolId={pool.id}
        initialData={{
          name: pool.name,
          description: pool.description === '-' ? '' : pool.description,
          algorithm:
            pool.algorithm === 'Round Robin'
              ? 'ROUND_ROBIN'
              : pool.algorithm === 'Least Connections'
                ? 'LEAST_CONNECTIONS'
                : 'ROUND_ROBIN',
          sessionPersistence: pool.sessionPersistence,
          adminUp: pool.adminState === 'Up',
        }}
      />
      <ManageMembersDrawer
        isOpen={manageMembersOpen}
        onClose={() => setManageMembersOpen(false)}
        poolName={pool.name}
      />
      <CreateHealthMonitorDrawer
        isOpen={createHealthMonOpen}
        onClose={() => setCreateHealthMonOpen(false)}
      />
      <EditMemberDrawer
        isOpen={editMemberOpen}
        onClose={() => {
          setEditMemberOpen(false);
          setActiveMemberId(null);
        }}
        memberId={activeMemberId ?? undefined}
        initialData={{ name: 'member-01', weight: 1, adminUp: true }}
      />
    </div>
  );
}
