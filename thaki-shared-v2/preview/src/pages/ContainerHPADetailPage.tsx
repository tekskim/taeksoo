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
import SectionCard from '@shared/components/SectionCard/SectionCard';
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

/* ----------------------------------------
   Metrics Tab
   ---------------------------------------- */

function MetricsTab() {
  return (
    <div className="flex gap-3 w-full items-stretch flex-col sm:flex-row">
      <div className="flex-1 min-w-0">
        <SectionCard>
          <SectionCard.Header title="Metric" />
          <SectionCard.Content>
            <SectionCard.DataRow label="Source" value={mockMetricData.source} />
            <SectionCard.DataRow label="Name" value={mockMetricData.name} />
            <SectionCard.DataRow label="Target name" value={mockMetricData.targetType} />
            <SectionCard.DataRow label="Value" value={mockMetricData.value} />
            <SectionCard.DataRow
              label="Referent API version"
              value={mockMetricData.referentApiVersion}
            />
            <SectionCard.DataRow label="Referent kind" value={mockMetricData.referentKind} />
            <SectionCard.DataRow label="Referent name" value={mockMetricData.referentName} />
          </SectionCard.Content>
        </SectionCard>
      </div>
      <div className="flex-1 min-w-0">
        <SectionCard>
          <SectionCard.Header title="Current metrics" />
          <SectionCard.Content>
            <SectionCard.DataRow label="" value="No current metrics" />
          </SectionCard.Content>
        </SectionCard>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Behavior Tab
   ---------------------------------------- */

function BehaviorTab() {
  return (
    <div className="flex gap-4 w-full items-start flex-col md:flex-row">
      <div className="flex-1 min-w-0">
        <SectionCard>
          <SectionCard.Header title="Scale down behavior" />
          <SectionCard.Content>
            <SectionCard.DataRow label="Policies">
              <div className="flex flex-col gap-0.5">
                {mockScaleDownBehavior.policies.map((p, i) => (
                  <span key={i} className="text-12 leading-18 text-text">
                    {p}
                  </span>
                ))}
              </div>
            </SectionCard.DataRow>
            <SectionCard.DataRow label="Select policy" value={mockScaleDownBehavior.selectPolicy} />
            <SectionCard.DataRow
              label="Stabilization window seconds"
              value={mockScaleDownBehavior.stabilizationWindowSeconds}
            />
          </SectionCard.Content>
        </SectionCard>
      </div>
      <div className="flex-1 min-w-0">
        <SectionCard>
          <SectionCard.Header title="Scale up behavior" />
          <SectionCard.Content>
            <SectionCard.DataRow label="Policies">
              <div className="flex flex-col gap-0.5">
                {mockScaleUpBehavior.policies.map((p, i) => (
                  <span key={i} className="text-12 leading-18 text-text">
                    {p}
                  </span>
                ))}
              </div>
            </SectionCard.DataRow>
            <SectionCard.DataRow label="Select policy" value={mockScaleUpBehavior.selectPolicy} />
            <SectionCard.DataRow
              label="Stabilization window seconds"
              value={mockScaleUpBehavior.stabilizationWindowSeconds}
            />
          </SectionCard.Content>
        </SectionCard>
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

function makeLabelAnnotationInfoField(
  title: string,
  entries: [string, string][]
): DetailPageHeaderInfoField {
  return {
    label: `${title} (${entries.length})`,
    value:
      entries.length === 0 ? (
        '-'
      ) : (
        <div className="flex items-center gap-1 min-w-0 w-full">
          {entries.slice(0, 1).map(([key, val]) => (
            <Badge
              key={key}
              theme="white"
              size="sm"
              className="min-w-0 truncate justify-start text-left"
            >
              {`${key}: ${val}`}
            </Badge>
          ))}
          {entries.length > 1 && (
            <Popover
              trigger="hover"
              position="bottom"
              delay={100}
              hideDelay={100}
              content={
                <div className="p-3 min-w-[120px] max-w-[320px]">
                  <div className="text-[10px] leading-[14px] font-medium text-text-muted mb-2">
                    All {title.toLowerCase()} ({entries.length})
                  </div>
                  <div className="flex flex-col gap-1">
                    {entries.map(([k, v]) => (
                      <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                        <span className="break-all">{`${k}: ${v}`}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              }
            >
              <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-[10px] leading-[14px] font-medium text-text-muted bg-surface-subtle hover:bg-surface-muted transition-colors h-5 cursor-pointer">
                +{entries.length - 1}
              </span>
            </Popover>
          )}
        </div>
      ),
  };
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
      makeLabelAnnotationInfoField('Labels', Object.entries(hpa.labels)),
      makeLabelAnnotationInfoField('Annotations', Object.entries(hpa.annotations)),
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
