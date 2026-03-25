import { useMemo, useState, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { EditListenerDrawer } from '../drawers/compute/load-balancer/EditListenerDrawer';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Badge } from '@shared/components/Badge';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { IconTrash, IconEdit, IconDownload } from '@tabler/icons-react';

type ListenerStatus = 'active' | 'down' | 'error';
type PoolStatus = 'active' | 'down' | 'error';
type L7PolicyStatus = 'active' | 'down' | 'error';

interface ListenerDetail {
  id: string;
  name: string;
  tenant: string;
  status: ListenerStatus;
  adminState: 'Up' | 'Down';
  createdAt: string;
  description: string;
  protocol: string;
  port: number;
  connectionLimit: string;
  customHeaders: string;
  clientDataTimeout: string;
  memberConnectTimeout: string;
  memberDataTimeout: string;
  tcpInspectTimeout: string;
  allowedCidrs: string;
  loadBalancer: { name: string; id: string } | null;
}

interface L7Policy extends Record<string, unknown> {
  id: string;
  name: string;
  status: L7PolicyStatus;
  behavior: 'Reject' | 'Redirect to Pool' | 'Redirect to URL';
  position: number | null;
  adminState: 'Up' | 'Down';
}

const mockListenersMap: Record<string, ListenerDetail> = {
  '29tgj234': {
    id: '29tgj234',
    name: 'listener-http-80',
    tenant: 'demo-project',
    status: 'active',
    adminState: 'Up',
    createdAt: 'Jul 25, 2025 10:32:16',
    description: '-',
    protocol: 'HTTP',
    port: 80,
    connectionLimit: '-',
    customHeaders: 'X-Forwarded-For : Disabled / X-Forwarded-Port : Disabled',
    clientDataTimeout: '50000 ms',
    memberConnectTimeout: '5000 ms',
    memberDataTimeout: '50000 ms',
    tcpInspectTimeout: '0 ms',
    allowedCidrs: '10.62.0.32/24(+3)',
    loadBalancer: { name: 'web-lb-01', id: 'lb-001' },
  },
  '38fk29dk': {
    id: '38fk29dk',
    name: 'listener-https-443',
    tenant: 'engineering',
    status: 'active',
    adminState: 'Up',
    createdAt: 'Jul 24, 2025 03:19:59',
    description: 'HTTPS listener for API',
    protocol: 'HTTPS',
    port: 443,
    connectionLimit: '1000',
    customHeaders: 'X-Forwarded-For : Enabled / X-Forwarded-Port : Enabled',
    clientDataTimeout: '50000 ms',
    memberConnectTimeout: '5000 ms',
    memberDataTimeout: '50000 ms',
    tcpInspectTimeout: '0 ms',
    allowedCidrs: '0.0.0.0/0',
    loadBalancer: { name: 'api-lb', id: 'lb-002' },
  },
  '9dk38fj2': {
    id: '9dk38fj2',
    name: 'listener-tcp-8080',
    tenant: 'production',
    status: 'active',
    adminState: 'Up',
    createdAt: 'Jul 23, 2025 20:06:42',
    description: 'TCP listener for app',
    protocol: 'TCP',
    port: 8080,
    connectionLimit: '500',
    customHeaders: '-',
    clientDataTimeout: '60000 ms',
    memberConnectTimeout: '10000 ms',
    memberDataTimeout: '60000 ms',
    tcpInspectTimeout: '5000 ms',
    allowedCidrs: '10.0.0.0/8',
    loadBalancer: { name: 'app-lb', id: 'lb-003' },
  },
};

const defaultListenerDetail: ListenerDetail = {
  id: 'listener-default',
  name: 'Unknown',
  tenant: '-',
  status: 'active',
  adminState: 'Up',
  createdAt: '-',
  description: '-',
  protocol: 'HTTP',
  port: 80,
  connectionLimit: '-',
  customHeaders: '-',
  clientDataTimeout: '-',
  memberConnectTimeout: '-',
  memberDataTimeout: '-',
  tcpInspectTimeout: '-',
  allowedCidrs: '-',
  loadBalancer: { name: 'web-lb-01', id: 'lb-001' },
};

const defaultPoolSummary: {
  id: string;
  name: string;
  status: PoolStatus;
  protocol: string;
  algorithm: string;
  adminState: 'Up' | 'Down';
} = {
  id: '29fg23400',
  name: 'pool-http',
  status: 'active',
  protocol: 'HTTP',
  algorithm: 'Round Robin',
  adminState: 'Up',
};

const mockL7Policies: L7Policy[] = Array.from({ length: 115 }, (_, i) => ({
  id: `l7p-${String(i).padStart(3, '0')}`,
  name: `policy1`,
  status: 'active' as L7PolicyStatus,
  behavior: 'Reject' as const,
  position: null,
  adminState: 'Up' as const,
}));

const listenerStatusMap: Record<ListenerStatus, StatusVariant> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

const poolStatusMap: Record<PoolStatus, StatusVariant> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

const l7PolicyStatusMap: Record<L7PolicyStatus, StatusVariant> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

const STATUS_COL_WIDTH = 60;
const ACTION_COL_WIDTH = 72;
const linkClass =
  'text-12 leading-18 font-medium text-primary hover:underline no-underline inline-flex items-center gap-1.5 min-w-0';

const L7PolicyMenuTrigger = ({ toggle }: { toggle: () => void }) => (
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

export function ComputeAdminListenerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const listener = useMemo(
    () => (id ? (mockListenersMap[id] ?? defaultListenerDetail) : defaultListenerDetail),
    [id]
  );

  const [editListenerOpen, setEditListenerOpen] = useState(false);

  const [l7PolicySearchTerm, setL7PolicySearchTerm] = useState('');
  const [l7PolicyCurrentPage, setL7PolicyCurrentPage] = useState(1);
  const [selectedL7Policies, setSelectedL7Policies] = useState<(string | number)[]>([]);
  const l7PoliciesPerPage = 10;
  const [l7Sort, setL7Sort] = useState('');
  const [l7Order, setL7Order] = useState<SortOrder>('asc');
  const handleL7Sort = useCallback((k: string | null, o: SortOrder) => {
    setL7Sort(k ?? '');
    setL7Order(o);
  }, []);

  const filteredL7Policies = useMemo(() => {
    if (!l7PolicySearchTerm) return mockL7Policies;
    const q = l7PolicySearchTerm.toLowerCase();
    return mockL7Policies.filter(
      (policy) => policy.name.toLowerCase().includes(q) || policy.behavior.toLowerCase().includes(q)
    );
  }, [l7PolicySearchTerm]);

  const paginatedL7Policies = filteredL7Policies.slice(
    (l7PolicyCurrentPage - 1) * l7PoliciesPerPage,
    l7PolicyCurrentPage * l7PoliciesPerPage
  );

  const defaultPool = defaultPoolSummary;

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: listener.status === 'active' ? 'Available' : listener.status,
      accessory: <StatusIndicator variant={listenerStatusMap[listener.status]} layout="iconOnly" />,
    },
    { label: 'ID', value: listener.id, showCopyButton: true, copyText: listener.id },
    { label: 'Tenant', value: listener.tenant },
    { label: 'Admin state', value: listener.adminState },
    { label: 'Created at', value: listener.createdAt },
  ];

  const l7PolicyColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'behavior', header: 'Behavior' },
      { key: 'position', header: 'Position', sortable: true },
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
        title={listener.name}
        actions={
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              variant="secondary"
              appearance="outline"
              size="sm"
              onClick={() => setEditListenerOpen(true)}
            >
              <IconEdit size={12} stroke={1.5} /> Edit
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconTrash size={12} stroke={1.5} /> Delete default pool
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
                  <SectionCard.DataRow label="Name" value={listener.name} />
                  <SectionCard.DataRow label="Tenant" value={listener.tenant} />
                  <SectionCard.DataRow label="Description" value={listener.description} />
                  <SectionCard.DataRow label="Admin state" value={listener.adminState} />
                  <SectionCard.DataRow label="Protocol" value={listener.protocol} />
                  <SectionCard.DataRow label="Port" value={String(listener.port)} />
                  <SectionCard.DataRow label="Connection limit" value={listener.connectionLimit} />
                  <SectionCard.DataRow label="Custom headers" value={listener.customHeaders} />
                  <SectionCard.DataRow
                    label="Client data timeout"
                    value={listener.clientDataTimeout}
                  />
                  <SectionCard.DataRow
                    label="Member connect timeout"
                    value={listener.memberConnectTimeout}
                  />
                  <SectionCard.DataRow
                    label="Member data timeout"
                    value={listener.memberDataTimeout}
                  />
                  <SectionCard.DataRow
                    label="TCP inspect timeout"
                    value={listener.tcpInspectTimeout}
                  />
                  <SectionCard.DataRow label="Allowed CIDRs" value={listener.allowedCidrs} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Association" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Load balancer">
                    {listener.loadBalancer ? (
                      <Link
                        to={`/compute-admin/load-balancers/${listener.loadBalancer.id}`}
                        className={linkClass}
                      >
                        {listener.loadBalancer.name}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>

          <Tab id="pools" label="Default pool">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header
                  title="Default pool"
                  actions={
                    <Button variant="secondary" appearance="outline" size="sm">
                      <IconTrash size={12} stroke={1.5} /> Delete default pool
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Name">
                    {defaultPool ? (
                      <Link to={`/compute-admin/pools/${defaultPool.id}`} className={linkClass}>
                        {defaultPool.name}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Status">
                    {defaultPool ? (
                      <StatusIndicator
                        variant={poolStatusMap[defaultPool.status]}
                        layout="iconOnly"
                      />
                    ) : (
                      '-'
                    )}
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Description" value="-" />
                  <SectionCard.DataRow label="Admin state">
                    {defaultPool ? (
                      <Badge
                        theme={defaultPool.adminState === 'Up' ? 'gre' : 'gry'}
                        size="sm"
                        type="subtle"
                      >
                        {defaultPool.adminState}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Algorithm" value={defaultPool?.algorithm ?? '-'} />
                  <SectionCard.DataRow label="Protocol" value={defaultPool?.protocol ?? '-'} />
                  <SectionCard.DataRow label="Session persistence" value="-" />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>

          <Tab id="l7-policies" label="L7 policies">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-16 font-semibold text-text m-0">L7 policies</h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <input
                    type="search"
                    value={l7PolicySearchTerm}
                    onChange={(e) => {
                      setL7PolicySearchTerm(e.target.value);
                      setL7PolicyCurrentPage(1);
                    }}
                    placeholder="Search policies by attributes"
                    className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
                  />
                  <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
                    <IconDownload size={12} stroke={1.5} />
                  </Button>
                </div>
                <div className="h-4 w-px bg-border" />
                <Button
                  variant="muted"
                  appearance="ghost"
                  size="sm"
                  disabled={selectedL7Policies.length === 0}
                >
                  <IconTrash size={12} stroke={1.5} /> Delete
                </Button>
              </div>
              <Pagination
                totalCount={filteredL7Policies.length}
                size={l7PoliciesPerPage}
                currentAt={l7PolicyCurrentPage}
                onPageChange={setL7PolicyCurrentPage}
                totalCountLabel="items"
                selectedCount={selectedL7Policies.length}
                onSettingClick={() => {}}
              />
              <SelectableTable<L7Policy>
                columns={l7PolicyColumns}
                rows={paginatedL7Policies}
                selectionType="checkbox"
                selectedRows={selectedL7Policies}
                onRowSelectionChange={setSelectedL7Policies}
                getRowId={(row) => row.id}
                sort={l7Sort}
                order={l7Order}
                onSortChange={handleL7Sort}
                stickyLastColumn
              >
                {paginatedL7Policies.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={l7PolicyColumns[0]}>
                      <StatusIndicator variant={l7PolicyStatusMap[row.status]} layout="iconOnly" />
                    </Table.Td>
                    <Table.Td rowData={row} column={l7PolicyColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link to={`/compute-admin/l7-policies/${row.id}`} className={linkClass}>
                          {row.name}
                        </Link>
                        <span className="text-11 text-text-muted">ID : {row.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={l7PolicyColumns[2]}>
                      {row.behavior}
                    </Table.Td>
                    <Table.Td rowData={row} column={l7PolicyColumns[3]}>
                      {row.position !== null ? row.position : '-'}
                    </Table.Td>
                    <Table.Td rowData={row} column={l7PolicyColumns[4]}>
                      <Badge
                        theme={row.adminState === 'Up' ? 'gre' : 'gry'}
                        size="sm"
                        type="subtle"
                      >
                        {row.adminState}
                      </Badge>
                    </Table.Td>
                    <Table.Td rowData={row} column={l7PolicyColumns[5]} preventClickPropagation>
                      <ContextMenu.Root
                        direction="bottom-end"
                        gap={4}
                        trigger={({ toggle }) => <L7PolicyMenuTrigger toggle={toggle} />}
                      >
                        <ContextMenu.Item action={() => console.log('Edit', row.id)}>
                          Edit
                        </ContextMenu.Item>
                        <ContextMenu.Item action={() => console.log('Delete', row.id)} danger>
                          Delete
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </SelectableTable>
            </div>
          </Tab>
        </Tabs>
      </div>

      <EditListenerDrawer
        isOpen={editListenerOpen}
        onClose={() => setEditListenerOpen(false)}
        listenerId={listener.id}
        initialData={{
          name: listener.name,
          description: listener.description === '-' ? '' : listener.description,
          protocol: listener.protocol,
          port: String(listener.port),
          connectionLimit: listener.connectionLimit === '-' ? '-1' : listener.connectionLimit,
          adminUp: listener.adminState === 'Up',
        }}
      />
    </div>
  );
}
