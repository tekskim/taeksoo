import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Table } from '@shared/components/Table';
import { Pagination } from '@shared/components/Pagination';
import { Popover } from '@shared/components/Popover';
import { IconChevronDown } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface HPAData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  targetReference: string;
  createdAt: string;
  minReplicas: number;
  maxReplicas: number;
  currentReplicas: number;
  lastScaleTime: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
}

interface MetricData {
  source: string;
  name: string;
  targetType: string;
  value: string;
  referentApiVersion: string;
  referentKind: string;
  referentName: string;
}

interface BehaviorData {
  policies: string[];
  selectPolicy: string;
  stabilizationWindowSeconds: string;
}

interface ConditionRow {
  id: string;
  condition: string;
  status: string;
  message: string;
  updated: string;
  [key: string]: unknown;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockHPAData: Record<string, HPAData> = {
  '1': {
    id: '1',
    name: 'php-apache-hpa',
    status: 'OK',
    namespace: 'default',
    targetReference: 'php-apache',
    createdAt: 'Jul 25, 2025 10:32:16',
    minReplicas: 1,
    maxReplicas: 10,
    currentReplicas: 1,
    lastScaleTime: 'Jul 25, 2025',
    labels: {
      foo: 'bar',
    },
    annotations: {
      foo: 'bar',
    },
  },
  '2': {
    id: '2',
    name: 'nginx-hpa',
    status: 'True',
    namespace: 'kube-system',
    targetReference: 'nginx-deployment',
    createdAt: 'Nov 8, 2025 11:51:27',
    minReplicas: 2,
    maxReplicas: 20,
    currentReplicas: 5,
    lastScaleTime: 'Nov 8, 2025',
    labels: {
      app: 'nginx',
    },
    annotations: {
      description: 'HPA for nginx',
    },
  },
};

const mockMetricData: MetricData = {
  source: 'Object',
  name: 'packets-per-second',
  targetType: 'AverageValue',
  value: '80',
  referentApiVersion: 'apps/v1beta1',
  referentKind: 'Deployment',
  referentName: 'php-apache',
};

const mockScaleDownBehavior: BehaviorData = {
  policies: ['1 Pods (for 100s)'],
  selectPolicy: 'Max',
  stabilizationWindowSeconds: '300s',
};

const mockScaleUpBehavior: BehaviorData = {
  policies: ['4 Pods (for 15s)', '100 Percent (for 15s)'],
  selectPolicy: 'Max',
  stabilizationWindowSeconds: '0s',
};

const mockConditionsData: ConditionRow[] = [
  {
    id: '1',
    condition: 'AbleToScale',
    status: 'True',
    message: '[SucceededRescale] the HPA controller was able to update the target scale',
    updated: 'Nov 10, 2025',
  },
  {
    id: '2',
    condition: 'ScalingActive',
    status: 'True',
    message: '[ValidMetricFound] the HPA was able to successfully calculate a replica count',
    updated: 'Nov 10, 2025',
  },
  {
    id: '3',
    condition: 'ScalingLimited',
    status: 'None',
    message: '[DesiredWithinRange] the desired count is within the acceptable range',
    updated: 'Nov 10, 2025',
  },
];

const cardClass = 'flex-1 min-w-0 border border-border rounded-lg bg-surface-default flex flex-col';
const cardHeaderClass = 'text-16 font-semibold leading-6 text-text px-4 pt-4 pb-0';
const dataRowClass =
  'flex flex-col gap-1.5 px-4 py-3 border-t border-border-subtle first:border-t-0';

/* ----------------------------------------
   Metrics Tab
   ---------------------------------------- */

function MetricsTab() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 w-full items-stretch flex-col sm:flex-row">
        <div className={cardClass}>
          <div className={cardHeaderClass}>Metric</div>
          <div className="flex flex-col pb-3">
            <div className={dataRowClass}>
              <span className="text-11 font-medium leading-4 text-text-muted">Source</span>
              <span className="text-12 leading-18 text-text">{mockMetricData.source}</span>
            </div>
            <div className={dataRowClass}>
              <span className="text-11 font-medium leading-4 text-text-muted">Name</span>
              <span className="text-12 leading-18 text-text">{mockMetricData.name}</span>
            </div>
            <div className={dataRowClass}>
              <span className="text-11 font-medium leading-4 text-text-muted">Target name</span>
              <span className="text-12 leading-18 text-text">{mockMetricData.targetType}</span>
            </div>
            <div className={dataRowClass}>
              <span className="text-11 font-medium leading-4 text-text-muted">Value</span>
              <span className="text-12 leading-18 text-text">{mockMetricData.value}</span>
            </div>
            <div className={dataRowClass}>
              <span className="text-11 font-medium leading-4 text-text-muted">
                Referent API version
              </span>
              <span className="text-12 leading-18 text-text">
                {mockMetricData.referentApiVersion}
              </span>
            </div>
            <div className={dataRowClass}>
              <span className="text-11 font-medium leading-4 text-text-muted">Referent kind</span>
              <span className="text-12 leading-18 text-text">{mockMetricData.referentKind}</span>
            </div>
            <div className={dataRowClass}>
              <span className="text-11 font-medium leading-4 text-text-muted">Referent name</span>
              <span className="text-12 leading-18 text-text">{mockMetricData.referentName}</span>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className={cardHeaderClass}>Current metrics</div>
          <div className="px-4 pb-4 pt-3">
            <span className="text-12 font-normal leading-4 text-text">No current metrics</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Behavior Tab
   ---------------------------------------- */

function BehaviorTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 w-full items-start flex-col md:flex-row">
        <div className={cardClass}>
          <div className={cardHeaderClass}>Scale down behavior</div>
          <div className="flex flex-col pb-3">
            <div className={dataRowClass}>
              <span className="text-11 font-medium leading-4 text-text-muted">Policies</span>
              <div className="text-12 leading-18 text-text flex flex-col gap-0.5">
                {mockScaleDownBehavior.policies.map((p, i) => (
                  <div key={i}>{p}</div>
                ))}
              </div>
            </div>
            <div className={dataRowClass}>
              <span className="text-11 font-medium leading-4 text-text-muted">Select policy</span>
              <span className="text-12 leading-18 text-text">
                {mockScaleDownBehavior.selectPolicy}
              </span>
            </div>
            <div className={dataRowClass}>
              <span className="text-11 font-medium leading-4 text-text-muted">
                Stabilization window seconds
              </span>
              <span className="text-12 leading-18 text-text">
                {mockScaleDownBehavior.stabilizationWindowSeconds}
              </span>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className={cardHeaderClass}>Scale up behavior</div>
          <div className="flex flex-col pb-3">
            <div className={dataRowClass}>
              <span className="text-11 font-medium leading-4 text-text-muted">Policies</span>
              <div className="text-12 leading-18 text-text flex flex-col gap-0.5">
                {mockScaleUpBehavior.policies.map((p, i) => (
                  <div key={i}>{p}</div>
                ))}
              </div>
            </div>
            <div className={dataRowClass}>
              <span className="text-11 font-medium leading-4 text-text-muted">Select policy</span>
              <span className="text-12 leading-18 text-text">
                {mockScaleUpBehavior.selectPolicy}
              </span>
            </div>
            <div className={dataRowClass}>
              <span className="text-11 font-medium leading-4 text-text-muted">
                Stabilization window seconds
              </span>
              <span className="text-12 leading-18 text-text">
                {mockScaleUpBehavior.stabilizationWindowSeconds}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Conditions Tab
   ---------------------------------------- */

function ConditionsTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const conditions = mockConditionsData;
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const columns: TableColumn[] = useMemo(
    () => [
      { key: 'condition', header: 'Condition', sortable: true },
      { key: 'status', header: 'Size', sortable: true },
      { key: 'message', header: 'Message', sortable: true },
      { key: 'updated', header: 'Updated', sortable: true },
    ],
    []
  );

  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-16 font-semibold leading-6 text-text">Conditions</h3>
      <Pagination
        totalCount={conditions.length}
        size={10}
        currentAt={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        totalCountLabel="items"
        onSettingClick={() => {}}
        settingAriaLabel="Pagination settings"
      />
      <Table<ConditionRow>
        columns={columns}
        rows={conditions}
        sort={sort}
        order={order}
        onSortChange={(s, o) => {
          setSort(s ?? '');
          setOrder(o);
        }}
      >
        {conditions.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('condition')}>
              <span className="truncate block min-w-0" title={String(row.condition)}>
                {row.condition}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('status')}>
              {row.status}
            </Table.Td>
            <Table.Td rowData={row} column={c('message')}>
              <span className="truncate block min-w-0" title={String(row.message)}>
                {row.message}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('updated')}>
              <span className="truncate block min-w-0" title={String(row.updated)}>
                {row.updated}
              </span>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table>
    </div>
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export function ContainerHPADetailPage() {
  const { hpaId } = useParams<{ hpaId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get('tab') || 'metrics';
  const setActiveTabId = (tab: string) => setSearchParams({ tab }, { replace: true });

  const hpa = mockHPAData[hpaId || ''] || mockHPAData['1'];

  const infoFields: DetailPageHeaderInfoField[] = useMemo(
    () => [
      {
        label: 'Status',
        value: (
          <Tooltip content={hpa.status} direction="top">
            <span className="max-w-[80px] truncate inline-block">
              <Badge theme="white" size="sm">
                {hpa.status}
              </Badge>
            </span>
          </Tooltip>
        ),
      },
      {
        label: 'Namespace',
        value: hpa.namespace,
        showCopyButton: true,
        copyText: hpa.namespace,
      },
      { label: 'Target reference', value: hpa.targetReference },
      { label: 'Created at', value: hpa.createdAt },
    ],
    [hpa]
  );

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={`Horizontal Pod Autoscaler: ${hpa.name}`}
        actions={
          <ContextMenu.Root
            direction="bottom-end"
            gap={4}
            trigger={({ toggle }) => (
              <Button
                variant="secondary"
                appearance="outline"
                size="sm"
                type="button"
                onClick={toggle}
              >
                More actions
                <IconChevronDown size={12} stroke={1.5} />
              </Button>
            )}
          >
            <ContextMenu.Item action={() => navigate(`/container/hpa/${hpa.id}/edit`)}>
              Edit config
            </ContextMenu.Item>
            <ContextMenu.Item action={() => navigate(`/container/hpa/${hpa.name}/edit-yaml`)}>
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
        infoFields={infoFields}
      />

      <div className="flex gap-3 w-full flex-col sm:flex-row">
        <div className="flex-1 min-w-0 bg-surface-muted rounded-lg px-4 py-3">
          <div className="flex flex-col gap-2">
            <span className="text-11 font-medium text-text-muted leading-4">
              Labels ({Object.keys(hpa.labels).length})
            </span>
            <div className="flex items-center gap-1 min-w-0 w-full">
              {Object.entries(hpa.labels)
                .slice(0, 1)
                .map(([key, val]) => (
                  <Badge
                    key={key}
                    theme="white"
                    size="sm"
                    className="min-w-0 truncate justify-start text-left"
                  >
                    {`${key}: ${val}`}
                  </Badge>
                ))}
              {Object.keys(hpa.labels).length > 1 && (
                <Popover
                  trigger="hover"
                  position="bottom"
                  delay={100}
                  hideDelay={100}
                  content={
                    <div className="p-3 min-w-[120px] max-w-[320px]">
                      <div className="text-10 font-medium text-text-muted mb-2">
                        All labels ({Object.keys(hpa.labels).length})
                      </div>
                      <div className="flex flex-col gap-1">
                        {Object.entries(hpa.labels).map(([k, v]) => (
                          <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                            <span className="break-all">{`${k}: ${v}`}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  }
                >
                  <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-10 font-medium text-text-muted bg-surface-subtle hover:bg-surface-hover transition-colors h-5 cursor-pointer">
                    +{Object.keys(hpa.labels).length - 1}
                  </span>
                </Popover>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 bg-surface-muted rounded-lg px-4 py-3">
          <div className="flex flex-col gap-2">
            <span className="text-11 font-medium text-text-muted leading-4">
              Annotations ({Object.keys(hpa.annotations).length})
            </span>
            <div className="flex items-center gap-1 min-w-0 w-full">
              {Object.entries(hpa.annotations)
                .slice(0, 1)
                .map(([key, val]) => (
                  <Badge
                    key={key}
                    theme="white"
                    size="sm"
                    className="min-w-0 truncate justify-start text-left"
                  >
                    {`${key}: ${val}`}
                  </Badge>
                ))}
              {Object.keys(hpa.annotations).length > 1 && (
                <Popover
                  trigger="hover"
                  position="bottom"
                  delay={100}
                  hideDelay={100}
                  content={
                    <div className="p-3 min-w-[120px] max-w-[320px]">
                      <div className="text-10 font-medium text-text-muted mb-2">
                        All annotations ({Object.keys(hpa.annotations).length})
                      </div>
                      <div className="flex flex-col gap-1">
                        {Object.entries(hpa.annotations).map(([k, v]) => (
                          <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                            <span className="break-all">{`${k}: ${v}`}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  }
                >
                  <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-10 font-medium text-text-muted bg-surface-subtle hover:bg-surface-hover transition-colors h-5 cursor-pointer">
                    +{Object.keys(hpa.annotations).length - 1}
                  </span>
                </Popover>
              )}
            </div>
          </div>
        </div>
      </div>

      <Tabs activeTabId={activeTabId} onChange={setActiveTabId} variant="line" size="sm">
        <Tab id="metrics" label="Metrics">
          <MetricsTab />
        </Tab>
        <Tab id="behavior" label="Behavior">
          <BehaviorTab />
        </Tab>
        <Tab id="conditions" label="Conditions">
          <ConditionsTab />
        </Tab>
      </Tabs>
    </div>
  );
}
