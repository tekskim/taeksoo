import { useState, type ReactNode } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Popover } from '@shared/components/Popover';
import type { TableColumn } from '@shared/components/Table/Table.types';
import { IconChevronDown, IconDotsCircleHorizontal } from '@tabler/icons-react';

interface ResourceRow extends Record<string, unknown> {
  id: string;
  type: string;
  active: number;
  processing: number;
  error: number;
  total: number;
}

interface NamespaceData {
  name: string;
  status: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  resources: {
    active: number;
    processing: number;
    error: number;
    total: number;
  };
}

const mockNamespaceData: Record<string, NamespaceData> = {
  'cattle-clusters-system': {
    name: 'cattle-clusters-system',
    status: 'OK',
    createdAt: 'Nov 6, 2025 21:25:53',
    labels: { 'kubernetes.io/metadata.name': 'cattle-clusters-system' },
    annotations: {},
    resources: { active: 122, processing: 0, error: 0, total: 138 },
  },
  'kube-system': {
    name: 'kube-system',
    status: 'OK',
    createdAt: 'Nov 6, 2025 21:25:53',
    labels: { 'kubernetes.io/metadata.name': 'kube-system' },
    annotations: {},
    resources: { active: 122, processing: 0, error: 0, total: 138 },
  },
  default: {
    name: 'default',
    status: 'OK',
    createdAt: 'Nov 6, 2025 21:25:53',
    labels: { 'kubernetes.io/metadata.name': 'default' },
    annotations: {},
    resources: { active: 10, processing: 0, error: 0, total: 10 },
  },
};

const mockResourcesData: ResourceRow[] = [
  { id: '1', type: 'Nodes', active: 4, processing: 0, error: 0, total: 4 },
  { id: '2', type: 'Pods', active: 45, processing: 0, error: 0, total: 45 },
  { id: '3', type: 'Services', active: 12, processing: 0, error: 0, total: 12 },
  { id: '4', type: 'ConfigMaps', active: 8, processing: 0, error: 0, total: 8 },
  { id: '5', type: 'Secrets', active: 15, processing: 0, error: 0, total: 15 },
];

interface WorkloadRow extends Record<string, unknown> {
  id: string;
  name: string;
  namespace: string;
  type: string;
  image: string;
  restarts: number;
  createdAt: string;
  health: string;
  status: string;
}

const mockWorkloadsData: WorkloadRow[] = [
  {
    id: '1',
    name: 'frontend-app',
    namespace: 'production',
    type: 'Deployment',
    image: 'thakicloud/frontend:v2.1.0',
    restarts: 0,
    createdAt: 'Jul 25, 2025 10:32:16',
    health: '3 Running',
    status: 'OK',
  },
  {
    id: '2',
    name: 'api-server',
    namespace: 'production',
    type: 'Deployment',
    image: 'thakicloud/api:v1.2.0',
    restarts: 2,
    createdAt: 'Jul 24, 2025 03:19:59',
    health: '5 Running',
    status: 'OK',
  },
  {
    id: '3',
    name: 'fluentd-logger',
    namespace: 'logging',
    type: 'DaemonSet',
    image: 'fluent/fluentd:v1.16',
    restarts: 0,
    createdAt: 'Jul 20, 2025 23:27:51',
    health: '4 Running',
    status: 'OK',
  },
  {
    id: '4',
    name: 'node-exporter',
    namespace: 'monitoring',
    type: 'DaemonSet',
    image: 'prom/node-exporter:v1.6.0',
    restarts: 1,
    createdAt: 'Jul 18, 2025 09:01:17',
    health: '4 Running',
    status: 'True',
  },
  {
    id: '5',
    name: 'postgres-db',
    namespace: 'database',
    type: 'StatefulSet',
    image: 'postgres:15-alpine',
    restarts: 0,
    createdAt: 'Jul 15, 2025 12:22:26',
    health: '3 Running',
    status: 'True',
  },
  {
    id: '6',
    name: 'redis-cluster',
    namespace: 'cache',
    type: 'StatefulSet',
    image: 'redis:7.0-alpine',
    restarts: 0,
    createdAt: 'Jul 14, 2025 05:09:09',
    health: '3 Running',
    status: 'Raw',
  },
  {
    id: '7',
    name: 'backup-scheduler',
    namespace: 'system',
    type: 'CronJob',
    image: 'thakicloud/backup:v1.0.0',
    restarts: 0,
    createdAt: 'Jul 10, 2025 01:17:01',
    health: '0 Running',
    status: 'Raw',
  },
  {
    id: '8',
    name: 'report-generator',
    namespace: 'analytics',
    type: 'CronJob',
    image: 'thakicloud/reports:v2.3.1',
    restarts: 0,
    createdAt: 'Jul 12, 2025 15:43:35',
    health: '0 Running',
    status: 'None',
  },
  {
    id: '9',
    name: 'data-migration',
    namespace: 'database',
    type: 'Job',
    image: 'thakicloud/migrate:v1.5.0',
    restarts: 0,
    createdAt: 'Jul 25, 2025 10:32:16',
    health: '1 Running',
    status: 'None',
  },
  {
    id: '10',
    name: 'index-rebuild',
    namespace: 'search',
    type: 'Job',
    image: 'elasticsearch:8.9.0',
    restarts: 1,
    createdAt: 'Jul 24, 2025 03:19:59',
    health: '0 Completed',
    status: 'CreateContainerConfigError',
  },
  {
    id: '11',
    name: 'api-server-7d8f9c6b5-x2k4m',
    namespace: 'production',
    type: 'Pod',
    image: 'thakicloud/api:v1.2.0',
    restarts: 0,
    createdAt: 'Jul 25, 2025 10:32:16',
    health: '1 Running',
    status: 'InvalidImageName',
  },
  {
    id: '12',
    name: 'worker-batch-9f7d8e6c4-p3n2q',
    namespace: 'workers',
    type: 'Pod',
    image: 'thakicloud/worker:v3.0.2',
    restarts: 3,
    createdAt: 'Jul 25, 2025 10:32:16',
    health: '1 Running',
    status: 'ImagePullBackOff',
  },
];

interface ConditionRow extends Record<string, unknown> {
  id: string;
  condition: string;
  status: string;
  message: string;
  updated: string;
}

const mockConditionsData: ConditionRow[] = [
  {
    id: '1',
    condition: 'NamespaceDeletionDiscoveryFailure',
    status: 'True',
    message: '',
    updated: 'Nov 10, 2025',
  },
  {
    id: '2',
    condition: 'NamespaceDeletionGroupVersionParsingFailure',
    status: 'True',
    message: '',
    updated: 'Nov 10, 2025',
  },
  {
    id: '3',
    condition: 'NamespaceDeletionContentFailure',
    status: 'None',
    message: '',
    updated: 'Nov 10, 2025',
  },
  {
    id: '4',
    condition: 'NamespaceContentRemaining',
    status: 'None',
    message: '',
    updated: 'Nov 10, 2025',
  },
  {
    id: '5',
    condition: 'NamespaceFinalizersRemaining',
    status: 'None',
    message: '',
    updated: 'Nov 10, 2025',
  },
];

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'green' | 'blue' | 'red' | 'black';
}) {
  const colorStyles = {
    green: { text: 'text-[var(--color-state-success)]' },
    blue: { text: 'text-[var(--color-state-info)]' },
    red: { text: 'text-[var(--color-state-danger)]' },
    black: { text: 'text-[var(--color-text-default)]' },
  };

  return (
    <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
      <div className="flex flex-col gap-1.5">
        <span className={`text-label-sm ${colorStyles[color].text}`}>{label}</span>
        <span className={`text-heading-h3 ${colorStyles[color].text}`}>{value}</span>
      </div>
    </div>
  );
}

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

function handleWorkloadAction(action: string, workload: WorkloadRow): void {
  console.log(`Action "${action}" clicked for workload:`, workload.name);
}

function WorkloadRowMenu({ row }: { row: WorkloadRow }) {
  const common = (
    <>
      <ContextMenu.Item action={() => handleWorkloadAction('edit-config', row)}>
        Edit config
      </ContextMenu.Item>
      <ContextMenu.Item action={() => handleWorkloadAction('edit-yaml', row)}>
        Edit YAML
      </ContextMenu.Item>
      <ContextMenu.Item action={() => handleWorkloadAction('download-yaml', row)}>
        Download YAML
      </ContextMenu.Item>
      <ContextMenu.Item action={() => handleWorkloadAction('delete', row)} danger>
        Delete
      </ContextMenu.Item>
    </>
  );

  const shell = (
    <ContextMenu.Item action={() => handleWorkloadAction('execute-shell', row)}>
      Execute shell
    </ContextMenu.Item>
  );

  let extra: ReactNode = null;
  switch (row.type) {
    case 'Deployment':
      extra = (
        <>
          {shell}
          <ContextMenu.Item action={() => handleWorkloadAction('pause-orchestration', row)}>
            Pause orchestration
          </ContextMenu.Item>
          <ContextMenu.Item action={() => handleWorkloadAction('redeploy', row)}>
            Redeploy
          </ContextMenu.Item>
          <ContextMenu.Item action={() => handleWorkloadAction('rollback', row)}>
            Rollback
          </ContextMenu.Item>
        </>
      );
      break;
    case 'DaemonSet':
    case 'StatefulSet':
      extra = (
        <>
          {shell}
          <ContextMenu.Item action={() => handleWorkloadAction('redeploy', row)}>
            Redeploy
          </ContextMenu.Item>
        </>
      );
      break;
    case 'CronJob':
      extra = (
        <>
          {shell}
          <ContextMenu.Item action={() => handleWorkloadAction('run-now', row)}>
            Run now
          </ContextMenu.Item>
          <ContextMenu.Item action={() => handleWorkloadAction('suspend', row)}>
            Suspend
          </ContextMenu.Item>
        </>
      );
      break;
    case 'Job':
      extra = shell;
      break;
    case 'Pod':
      extra = (
        <>
          {shell}
          <ContextMenu.Item action={() => handleWorkloadAction('view-logs', row)}>
            View logs
          </ContextMenu.Item>
        </>
      );
      break;
    default:
      extra = shell;
  }

  return (
    <ContextMenu.Root
      direction="bottom-end"
      gap={4}
      trigger={({ toggle }) => (
        <button
          type="button"
          className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          aria-label="Row actions"
        >
          <IconDotsCircleHorizontal
            size={16}
            stroke={1.5}
            className="text-[var(--color-text-subtle)]"
          />
        </button>
      )}
    >
      {extra}
      {common}
    </ContextMenu.Root>
  );
}

function ResourcesTabContent({ resources }: { resources: ResourceRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const columns: TableColumn[] = [
    { key: 'type', header: 'Type', sortable: true },
    { key: 'active', header: 'Active', align: 'right', sortable: true },
    { key: 'processing', header: 'Processing', align: 'right', sortable: true },
    { key: 'error', header: 'Error', align: 'right', sortable: true },
    { key: 'total', header: 'Total', align: 'right', sortable: true },
  ];
  const c = (key: string) => columns.find((col) => col.key === key)!;
  const pageRows = resources.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">Resources</h3>
      <Pagination
        totalCount={resources.length}
        size={pageSize}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
      />
      <Table columns={columns} rows={pageRows}>
        {pageRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('type')}>
              <span
                className="block min-w-0 truncate text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline"
                title={row.type}
              >
                {row.type}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('active')} />
            <Table.Td rowData={row} column={c('processing')} />
            <Table.Td rowData={row} column={c('error')} />
            <Table.Td rowData={row} column={c('total')} />
          </Table.Tr>
        ))}
      </Table>
    </div>
  );
}

function WorkloadsTabContent({ workloads }: { workloads: WorkloadRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWorkloads = workloads.slice(startIndex, startIndex + itemsPerPage);

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 88, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'namespace', header: 'Namespace', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'image', header: 'Image', sortable: true },
    { key: 'restarts', header: 'Restarts', align: 'right', sortable: true },
    { key: 'health', header: 'Health', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'action', header: 'Action', width: 60, align: 'center' },
  ];
  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">Workloads</h3>
      <Pagination
        totalCount={workloads.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />
      <SelectableTable<WorkloadRow>
        columns={columns}
        rows={paginatedWorkloads}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        stickyLastColumn
      >
        {paginatedWorkloads.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('status')}>
              <Tooltip content={row.status} direction="top">
                <Badge theme="white" size="sm" className="max-w-[80px] inline-flex">
                  <span className="truncate">{row.status}</span>
                </Badge>
              </Tooltip>
            </Table.Td>
            <Table.Td rowData={row} column={c('name')}>
              <span
                className="block min-w-0 truncate text-[var(--color-action-primary)] cursor-pointer hover:underline font-medium"
                title={row.name}
              >
                {row.name}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('namespace')}>
              <span className="block min-w-0 truncate" title={row.namespace}>
                {row.namespace}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('type')}>
              <span className="block min-w-0 truncate" title={row.type}>
                {row.type}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('image')}>
              <span className="block min-w-0 truncate" title={row.image}>
                {row.image}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('restarts')} />
            <Table.Td rowData={row} column={c('health')}>
              <span className="block min-w-0 truncate" title={row.health}>
                {row.health}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('createdAt')}>
              <span className="block min-w-0 truncate" title={stripTime(row.createdAt)}>
                {stripTime(row.createdAt)}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('action')} preventClickPropagation>
              <div className="min-w-0 flex items-center justify-center w-full">
                <WorkloadRowMenu row={row} />
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
    </div>
  );
}

function ConditionsTabContent({ conditions }: { conditions: ConditionRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const columns: TableColumn[] = [
    { key: 'condition', header: 'Condition', sortable: true },
    { key: 'status', header: 'Status', width: 88, align: 'center' },
    { key: 'message', header: 'Message', sortable: true },
    { key: 'updated', header: 'Updated', sortable: true },
  ];
  const c = (key: string) => columns.find((col) => col.key === key)!;
  const pageRows = conditions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
        Conditions
      </h3>
      <Pagination
        totalCount={conditions.length}
        size={pageSize}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
      />
      <Table columns={columns} rows={pageRows}>
        {pageRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('condition')}>
              <span className="block min-w-0 truncate" title={row.condition}>
                {row.condition}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('status')}>
              <Tooltip content={row.status} direction="top">
                <Badge theme="white" size="sm" className="max-w-[80px]">
                  <span className="truncate">{row.status}</span>
                </Badge>
              </Tooltip>
            </Table.Td>
            <Table.Td rowData={row} column={c('message')}>
              <span className="block min-w-0 truncate" title={row.message || '-'}>
                {row.message || '-'}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('updated')}>
              <span className="block min-w-0 truncate" title={row.updated}>
                {row.updated}
              </span>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table>
    </div>
  );
}

export function ContainerNamespaceDetailPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'resources';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const id = rawId ? decodeURIComponent(rawId) : '';
  const namespace = mockNamespaceData[id] || {
    name: id || 'unknown',
    status: 'OK' as const,
    createdAt: 'Nov 6, 2025 21:25:53',
    labels: { 'kubernetes.io/metadata.name': id || '' },
    annotations: {},
    resources: { active: 0, processing: 0, error: 0, total: 0 },
  };

  const labelEntries = Object.entries(namespace.labels);
  const firstLabel = labelEntries[0];
  const firstLabelText = firstLabel ? `${firstLabel[0]}: ${firstLabel[1]}` : '';

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: (
        <Tooltip content={namespace.status} direction="top">
          <span className="max-w-[80px] truncate inline-block">
            <Badge theme="white" size="sm">
              {namespace.status}
            </Badge>
          </span>
        </Tooltip>
      ),
    },
    { label: 'Created at', value: namespace.createdAt },
    {
      label: `Labels (${labelEntries.length})`,
      value:
        labelEntries.length === 0 ? (
          '-'
        ) : (
          <div className="flex items-center gap-1 min-w-0 w-full">
            <Tooltip content={firstLabelText} direction="top">
              <Badge theme="white" size="sm" className="max-w-full">
                <span className="truncate">{firstLabelText}</span>
              </Badge>
            </Tooltip>
            {labelEntries.length > 1 && (
              <Popover
                trigger="hover"
                position="bottom"
                delay={100}
                hideDelay={100}
                content={
                  <div className="p-3 min-w-[120px] max-w-[320px]">
                    <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                      All Labels ({labelEntries.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {labelEntries.map(([k, v], i) => (
                        <Badge key={i} theme="white" size="sm">
                          {k}: {v}
                        </Badge>
                      ))}
                    </div>
                  </div>
                }
              >
                <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                  +{labelEntries.length - 1}
                </span>
              </Popover>
            )}
          </div>
        ),
    },
    {
      label: `Annotations (${Object.keys(namespace.annotations).length})`,
      value:
        Object.keys(namespace.annotations).length > 0
          ? Object.keys(namespace.annotations).length.toString()
          : '-',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader
        title={`Namespace: ${namespace.name}`}
        infoFields={infoFields}
        actions={
          <ContextMenu.Root
            direction="bottom-end"
            gap={4}
            trigger={({ toggle }) => (
              <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
                More actions
                <IconChevronDown size={12} stroke={1.5} className="ml-1" />
              </Button>
            )}
          >
            <ContextMenu.Item action={() => console.log('Edit Config')}>
              Edit config
            </ContextMenu.Item>
            <ContextMenu.Item
              action={() =>
                navigate(`/container/namespaces/${encodeURIComponent(namespace.name)}/edit-yaml`)
              }
            >
              Edit YAML
            </ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Download YAML')}>
              Download YAML
            </ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Delete')} danger>
              Delete
            </ContextMenu.Item>
          </ContextMenu.Root>
        }
      />

      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 pt-3 pb-4 w-full">
        <div className="flex flex-col gap-3">
          <h2 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
            Workload
          </h2>
          <div className="flex gap-3 w-full">
            <StatCard label="Active" value={namespace.resources.active} color="green" />
            <StatCard label="Processing" value={namespace.resources.processing} color="blue" />
            <StatCard label="Error" value={namespace.resources.error} color="red" />
            <StatCard label="Total" value={namespace.resources.total} color="black" />
          </div>
        </div>
      </div>

      <Tabs
        activeTabId={activeTab}
        onChange={setActiveTab}
        variant="line"
        size="sm"
        className="w-full"
      >
        <Tab id="resources" label="Resources">
          <ResourcesTabContent resources={mockResourcesData} />
        </Tab>
        <Tab id="workloads" label="Workloads">
          <WorkloadsTabContent workloads={mockWorkloadsData} />
        </Tab>
        <Tab id="conditions" label="Conditions">
          <ConditionsTabContent conditions={mockConditionsData} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default ContainerNamespaceDetailPage;
