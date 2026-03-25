import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Tooltip } from '@shared/components/Tooltip';
import { Badge } from '@shared/components/Badge';
import { Popover } from '@shared/components/Popover';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { IconChevronDown } from '@tabler/icons-react';

interface IngressData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  ingressClass: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
}

interface RuleRow {
  id: string;
  pathType: string;
  path: string;
  targetService: string;
  port: number;
  certificates: string;
  [key: string]: unknown;
}

const mockIngressData: Record<string, IngressData> = {
  '1': {
    id: '1',
    name: 'ingressName',
    status: 'OK',
    namespace: 'default',
    ingressClass: 'ingressclassName',
    createdAt: 'Jul 25, 2025 10:32:16',
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
      'cluster.x-k8s.io/provider': 'cluster-api',
      'control-plane': 'controller-manager',
    },
    annotations: {
      'deployment.kubernetes.io/revision': '1',
      'meta.helm.sh/release-name': 'thakicloud-provisioning-capi',
      'meta.helm.sh/release-namespace': 'cattle-provisioning-capi-system',
    },
  },
  '2': {
    id: '2',
    name: 'api-ingress',
    status: 'True',
    namespace: 'kube-system',
    ingressClass: 'traefik',
    createdAt: 'Nov 8, 2025 11:51:27',
    labels: {
      'app.kubernetes.io/name': 'traefik',
    },
    annotations: {
      'kubernetes.io/ingress.class': 'traefik',
    },
  },
};

const mockRulesData: RuleRow[] = [
  {
    id: '1',
    pathType: 'ImplementationSpecific',
    path: 'https://thakicloud.thakicloud.net/',
    targetService: 'serviceName',
    port: 80,
    certificates: 'tls-thakicloud-ingress',
  },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function RulesTab({ rules }: { rules: RuleRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const columns: TableColumn[] = [
    { key: 'pathType', header: 'Path type', sortable: true },
    { key: 'path', header: 'Path', sortable: true },
    { key: 'targetService', header: 'Target service', sortable: true },
    { key: 'port', header: 'Port', sortable: true },
    { key: 'certificates', header: 'Certificates', sortable: true },
  ];
  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-16 font-semibold leading-6 text-text m-0">Rules</h3>
      <Pagination
        totalCount={rules.length}
        size={10}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
      />
      <Table<RuleRow>
        columns={columns}
        rows={rules}
        sort={sort}
        order={order}
        onSortChange={(k, o) => {
          setSort(k ?? '');
          setOrder(o);
        }}
      >
        {rules.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('pathType')}>
              {row.pathType}
            </Table.Td>
            <Table.Td rowData={row} column={c('path')}>
              <span className={`${linkClass} truncate block min-w-0`} title={row.path}>
                {row.path}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('targetService')}>
              <span className={`${linkClass} truncate block min-w-0`} title={row.targetService}>
                {row.targetService}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('port')}>
              {row.port}
            </Table.Td>
            <Table.Td rowData={row} column={c('certificates')}>
              <span className={`${linkClass} truncate block min-w-0`} title={row.certificates}>
                {row.certificates}
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

export function ContainerIngressDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'rules';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const ingress = useMemo(() => {
    if (id && mockIngressData[id]) return mockIngressData[id];
    return mockIngressData['1'];
  }, [id]);

  const infoFields: DetailPageHeaderInfoField[] = useMemo(
    () => [
      {
        label: 'Status',
        value: (
          <Tooltip content={ingress.status} direction="top">
            <Badge
              theme="white"
              size="sm"
              className="max-w-[80px] inline-flex overflow-hidden min-w-0 !justify-start !text-left"
            >
              <span className="truncate">{ingress.status}</span>
            </Badge>
          </Tooltip>
        ),
      },
      {
        label: 'Namespace',
        value: ingress.namespace,
        showCopyButton: true,
        copyText: ingress.namespace,
      },
      { label: 'Ingress class', value: ingress.ingressClass },
      { label: 'Created at', value: ingress.createdAt },
      makeLabelAnnotationInfoField('Labels', Object.entries(ingress.labels)),
      makeLabelAnnotationInfoField('Annotations', Object.entries(ingress.annotations)),
    ],
    [ingress]
  );

  const moreActions = (
    <ContextMenu.Root
      direction="bottom-end"
      gap={4}
      trigger={({ toggle }) => (
        <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
          More actions
          <IconChevronDown size={14} stroke={1.5} className="ml-1" />
        </Button>
      )}
    >
      <ContextMenu.Item action={() => console.log('Edit Config')}>Edit config</ContextMenu.Item>
      <ContextMenu.Item action={() => navigate(`/container/ingresses/${ingress.id}/edit-yaml`)}>
        Edit YAML
      </ContextMenu.Item>
      <ContextMenu.Item action={() => console.log('Download YAML')}>Download YAML</ContextMenu.Item>
      <ContextMenu.Item action={() => console.log('Delete')} danger>
        Delete
      </ContextMenu.Item>
    </ContextMenu.Root>
  );

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={`Ingress: ${ingress.name}`}
        actions={moreActions}
        infoFields={infoFields}
      />

      <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
        <Tab id="rules" label="Rules">
          <RulesTab rules={mockRulesData} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default ContainerIngressDetailPage;
