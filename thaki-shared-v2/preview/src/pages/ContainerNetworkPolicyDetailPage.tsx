import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import { Input } from '@shared/components/Input';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Dropdown } from '@shared/components/Dropdown';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { IconChevronDown, IconCirclePlus, IconX } from '@tabler/icons-react';

const linkClass =
  'text-12 leading-18 font-medium text-primary hover:underline truncate block min-w-0';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface RuleSelector {
  key: string;
  operator: string;
  value: string;
}

interface IngressRule {
  id: string;
  name: string;
  ruleType: string;
  namespaceSelectors: RuleSelector[];
  podSelectors: RuleSelector[];
  allowedPorts: { port: string; protocol: string }[];
}

interface MatchingPod {
  name: string;
  createdAt: string;
}

interface NetworkPolicyData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  ingressRules: IngressRule[];
  egressRules: IngressRule[];
  podSelector: Record<string, string>;
  matchingPods: MatchingPod[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockNetworkPolicyData: Record<string, NetworkPolicyData> = {
  '1': {
    id: '1',
    name: 'networkpolicyName',
    status: 'OK',
    namespace: 'default',
    createdAt: 'Jul 25, 2025 10:32:16',
    labels: { app: 'web' },
    annotations: { description: 'Network policy for web app' },
    ingressRules: [
      {
        id: 'rule1',
        name: 'Rule 1',
        ruleType: 'Namespace/Pod Label Selector',
        namespaceSelectors: [{ key: 'foo', operator: 'In List', value: 'bar' }],
        podSelectors: [{ key: 'foo', operator: 'In List', value: 'bar' }],
        allowedPorts: [{ port: '8080', protocol: 'TCP' }],
      },
      {
        id: 'rule2',
        name: 'Rule 2',
        ruleType: 'Namespace/Pod Label Selector',
        namespaceSelectors: [{ key: 'env', operator: 'In List', value: 'prod' }],
        podSelectors: [{ key: 'tier', operator: 'In List', value: 'frontend' }],
        allowedPorts: [{ port: '443', protocol: 'TCP' }],
      },
    ],
    egressRules: [
      {
        id: 'egress1',
        name: 'Rule 1',
        ruleType: 'IP Block',
        namespaceSelectors: [],
        podSelectors: [],
        allowedPorts: [{ port: '53', protocol: 'UDP' }],
      },
    ],
    podSelector: { app: 'web', tier: 'frontend' },
    matchingPods: [
      { name: 'deploymentName-77f6bb9c69-4aw7f', createdAt: 'Jul 25, 2025 10:32:16' },
      { name: 'deploymentName-77f6bb9c69-8xk2p', createdAt: 'Jul 25, 2025 10:32:16' },
      { name: 'deploymentName-77f6bb9c69-9m3qt', createdAt: 'Jul 25, 2025 10:32:16' },
    ],
  },
  '2': {
    id: '2',
    name: 'networkpolicyName2',
    status: 'True',
    namespace: 'default',
    createdAt: 'Nov 10, 2025 01:17:01',
    labels: {},
    annotations: {},
    ingressRules: [],
    egressRules: [],
    podSelector: {},
    matchingPods: [],
  },
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerNetworkPolicyDetailPage() {
  const navigate = useNavigate();
  const { networkPolicyId } = useParams<{ networkPolicyId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get('tab') || 'ingress-rules';
  const setActiveTabId = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [selectedRule, setSelectedRule] = useState<string>('rule1');
  const [selectedEgressRule, setSelectedEgressRule] = useState<string>('egress1');
  const [matchingPodsPage, setMatchingPodsPage] = useState(1);
  const [egressMatchingPodsPage, setEgressMatchingPodsPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const [networkPolicyData, setNetworkPolicyData] = useState<NetworkPolicyData | null>(null);

  useEffect(() => {
    if (networkPolicyId && mockNetworkPolicyData[networkPolicyId]) {
      setNetworkPolicyData(mockNetworkPolicyData[networkPolicyId]);
    } else {
      setNetworkPolicyData(mockNetworkPolicyData['1']);
    }
  }, [networkPolicyId]);

  const ruleTypeOptions = [
    { value: 'Namespace/Pod Label Selector', label: 'Namespace/Pod Label Selector' },
    { value: 'IP Block', label: 'IP Block' },
  ];

  const operatorOptions = [
    { value: 'In List', label: 'In List' },
    { value: 'Not In List', label: 'Not In List' },
    { value: 'Exists', label: 'Exists' },
    { value: 'Does Not Exist', label: 'Does Not Exist' },
  ];

  const protocolOptions = [
    { value: 'TCP', label: 'TCP' },
    { value: 'UDP', label: 'UDP' },
    { value: 'SCTP', label: 'SCTP' },
  ];

  const matchingPodsColumns: TableColumn[] = useMemo(
    () => [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'createdAt', header: 'Created at', sortable: true },
    ],
    []
  );

  const infoFields: DetailPageHeaderInfoField[] = useMemo(() => {
    if (!networkPolicyData) return [];
    const labelsCount = Object.keys(networkPolicyData.labels).length;
    const annotationsCount = Object.keys(networkPolicyData.annotations).length;
    return [
      {
        label: 'Status',
        value: (
          <Tooltip content={networkPolicyData.status} direction="top">
            <span className="max-w-[80px] truncate inline-block">
              <Badge theme="white" size="sm">
                {networkPolicyData.status}
              </Badge>
            </span>
          </Tooltip>
        ),
      },
      {
        label: 'Namespace',
        value: (
          <Link
            to={`/container/namespaces/${encodeURIComponent(networkPolicyData.namespace)}`}
            className="text-12 font-medium text-primary hover:underline"
          >
            {networkPolicyData.namespace}
          </Link>
        ),
      },
      { label: 'Created at', value: networkPolicyData.createdAt },
      {
        label: `Labels (${labelsCount})`,
        value:
          labelsCount > 0
            ? Object.entries(networkPolicyData.labels)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')
            : 'labels',
      },
      {
        label: `Annotations (${annotationsCount})`,
        value:
          annotationsCount > 0
            ? Object.entries(networkPolicyData.annotations)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')
            : 'annotations',
      },
    ];
  }, [networkPolicyData]);

  if (!networkPolicyData) {
    return <div className="text-12 text-text-muted p-4">Loading...</div>;
  }

  const labelsCount = Object.keys(networkPolicyData.labels).length;
  const annotationsCount = Object.keys(networkPolicyData.annotations).length;

  const selectedRuleData = networkPolicyData.ingressRules.find((r) => r.id === selectedRule);
  const selectedEgressRuleData = networkPolicyData.egressRules.find(
    (r) => r.id === selectedEgressRule
  );

  const podsPerPage = 10;
  const totalMatchingPodsPages = Math.ceil(networkPolicyData.matchingPods.length / podsPerPage);
  const paginatedMatchingPods = networkPolicyData.matchingPods.slice(
    (matchingPodsPage - 1) * podsPerPage,
    matchingPodsPage * podsPerPage
  );

  const renderMatchingPodsTable = (pageSlice: MatchingPod[]) => (
    <Table<MatchingPod & Record<string, unknown>>
      columns={matchingPodsColumns}
      rows={pageSlice as (MatchingPod & Record<string, unknown>)[]}
      sort={sort}
      order={order}
      onSortChange={handleSortChange}
    >
      {pageSlice.map((row) => (
        <Table.Tr key={row.name} rowData={row as MatchingPod & Record<string, unknown>}>
          <Table.Td
            rowData={row as MatchingPod & Record<string, unknown>}
            column={matchingPodsColumns[0]}
          >
            <Link
              to={`/container/pods/${encodeURIComponent(row.name)}`}
              className={linkClass}
              title={row.name}
            >
              {row.name}
            </Link>
          </Table.Td>
          <Table.Td
            rowData={row as MatchingPod & Record<string, unknown>}
            column={matchingPodsColumns[1]}
          >
            <span className="truncate block min-w-0" title={row.createdAt}>
              {row.createdAt?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '') ?? ''}
            </span>
          </Table.Td>
        </Table.Tr>
      ))}
    </Table>
  );

  const matchingPodsPagination = (
    <Pagination
      totalCount={networkPolicyData.matchingPods.length}
      size={podsPerPage}
      currentAt={matchingPodsPage}
      onPageChange={setMatchingPodsPage}
      totalCountLabel="items"
      onSettingClick={() => {}}
      settingAriaLabel="Pagination settings"
    />
  );

  const egressMatchingPodsPagination = (
    <Pagination
      totalCount={networkPolicyData.matchingPods.length}
      size={podsPerPage}
      currentAt={egressMatchingPodsPage}
      onPageChange={setEgressMatchingPodsPage}
      totalCountLabel="items"
      onSettingClick={() => {}}
      settingAriaLabel="Pagination settings"
    />
  );

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={`Network Policy: ${networkPolicyData.name}`}
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
            <ContextMenu.Item
              action={() => navigate(`/container/network-policies/${networkPolicyId}/edit`)}
            >
              Edit config
            </ContextMenu.Item>
            <ContextMenu.Item
              action={() =>
                navigate(
                  `/container/network-policies/${encodeURIComponent(networkPolicyData.name)}/edit-yaml`
                )
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
        infoFields={infoFields}
      />

      <Tabs activeTabId={activeTabId} onChange={setActiveTabId} variant="line" size="sm">
        <Tab id="ingress-rules" label="Ingress rules">
          <div className="flex flex-col gap-4 pt-4">
            <h3 className="text-16 font-semibold leading-6 text-text m-0">Ingress rules</h3>

            <div className="w-full border border-border rounded-lg overflow-hidden">
              <div className="flex h-full">
                <div className="w-[100px] border-r border-border bg-surface-muted shrink-0">
                  <div className="flex flex-col">
                    {networkPolicyData.ingressRules.map((rule) => (
                      <button
                        key={rule.id}
                        type="button"
                        className={`w-full px-3 py-2 text-left text-11 font-medium flex items-center justify-between hover:bg-surface-subtle ${
                          selectedRule === rule.id ? 'bg-surface-default text-primary' : 'text-text'
                        }`}
                        onClick={() => setSelectedRule(rule.id)}
                      >
                        <span>{rule.name}</span>
                        {rule.id !== 'rule1' && (
                          <IconX size={12} stroke={1.5} className="text-text-muted" />
                        )}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left text-11 font-medium text-primary flex items-center gap-1 hover:bg-surface-subtle border-none bg-transparent cursor-pointer"
                    >
                      <IconCirclePlus size={12} stroke={1.5} />
                      Add rule
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-4 min-w-0">
                  {selectedRuleData ? (
                    <div className="flex flex-col gap-4">
                      <h4 className="text-13 font-medium text-text m-0">Targets</h4>

                      <div className="flex flex-col gap-2">
                        <label className="text-13 font-medium text-text">Rule type</label>
                        <Dropdown.Select
                          value={selectedRuleData.ruleType}
                          onChange={() => {}}
                          placeholder="Select"
                        >
                          {ruleTypeOptions.map((opt) => (
                            <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                          ))}
                        </Dropdown.Select>
                      </div>

                      <div className="flex flex-col gap-3 w-full">
                        <div className="flex flex-col gap-2">
                          <span className="text-13 font-medium text-text">Namespace</span>
                          <div className="w-full border border-border rounded-md p-3">
                            <div className="flex flex-col gap-2">
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <span className="text-13 font-medium text-text">Key</span>
                                </div>
                                <div className="flex-1">
                                  <span className="text-13 font-medium text-text">Operator</span>
                                </div>
                                <div className="flex-1">
                                  <span className="text-13 font-medium text-text">Value</span>
                                </div>
                              </div>
                              <div className="flex gap-2 items-center">
                                <div className="flex-1 min-w-0">
                                  <Input
                                    value={selectedRuleData.namespaceSelectors[0]?.key || 'foo'}
                                    onChange={() => {}}
                                    size="md"
                                    className="w-full"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Dropdown.Select
                                    value={
                                      selectedRuleData.namespaceSelectors[0]?.operator || 'In List'
                                    }
                                    onChange={() => {}}
                                    placeholder="Select"
                                    size="md"
                                  >
                                    {operatorOptions.map((opt) => (
                                      <Dropdown.Option
                                        key={opt.value}
                                        value={opt.value}
                                        label={opt.label}
                                      />
                                    ))}
                                  </Dropdown.Select>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Input
                                    value={selectedRuleData.namespaceSelectors[0]?.value || 'bar'}
                                    onChange={() => {}}
                                    size="md"
                                    className="w-full"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className="text-13 font-medium text-text">Pod</span>
                          <div className="w-full border border-border rounded-md p-3">
                            <div className="flex flex-col gap-2">
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <span className="text-13 font-medium text-text">Key</span>
                                </div>
                                <div className="flex-1">
                                  <span className="text-13 font-medium text-text">Operator</span>
                                </div>
                                <div className="flex-1">
                                  <span className="text-13 font-medium text-text">Value</span>
                                </div>
                              </div>
                              <div className="flex gap-2 items-center">
                                <div className="flex-1 min-w-0">
                                  <Input
                                    value={selectedRuleData.podSelectors[0]?.key || 'foo'}
                                    onChange={() => {}}
                                    size="md"
                                    className="w-full"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Dropdown.Select
                                    value={selectedRuleData.podSelectors[0]?.operator || 'In List'}
                                    onChange={() => {}}
                                    placeholder="Select"
                                    size="md"
                                  >
                                    {operatorOptions.map((opt) => (
                                      <Dropdown.Option
                                        key={opt.value}
                                        value={opt.value}
                                        label={opt.label}
                                      />
                                    ))}
                                  </Dropdown.Select>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Input
                                    value={selectedRuleData.podSelectors[0]?.value || 'bar'}
                                    onChange={() => {}}
                                    size="md"
                                    className="w-full"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 mt-4">
                        <h4 className="text-13 font-medium text-text m-0">
                          Matching pods ({networkPolicyData.matchingPods.length}/10)
                        </h4>
                        {matchingPodsPagination}
                        {renderMatchingPodsTable(paginatedMatchingPods)}
                      </div>

                      <div className="flex flex-col gap-3 mt-4">
                        <h4 className="text-13 font-medium text-text m-0">Allowed ports</h4>
                        <div className="w-full border border-border rounded-md p-3">
                          <div className="flex gap-4">
                            <div className="flex flex-col gap-2 flex-1 min-w-0">
                              <label className="text-13 font-medium text-text">Port</label>
                              <Input
                                value={selectedRuleData.allowedPorts[0]?.port || '8080'}
                                onChange={() => {}}
                                size="md"
                                className="w-full"
                              />
                            </div>
                            <div className="flex flex-col gap-2 flex-1 min-w-0">
                              <label className="text-13 font-medium text-text">Protocol</label>
                              <Dropdown.Select
                                value={selectedRuleData.allowedPorts[0]?.protocol || 'TCP'}
                                onChange={() => {}}
                                placeholder="Select"
                                size="md"
                              >
                                {protocolOptions.map((opt) => (
                                  <Dropdown.Option
                                    key={opt.value}
                                    value={opt.value}
                                    label={opt.label}
                                  />
                                ))}
                              </Dropdown.Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-12 leading-18 text-text-muted m-0">
                      No rule selected. Click on a rule or add a new one.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Tab>

        <Tab id="egress-rules" label="Egress rules">
          <div className="flex flex-col gap-4 pt-4">
            <h3 className="text-16 font-semibold leading-6 text-text m-0">Egress rules</h3>

            <div className="w-full border border-border rounded-lg overflow-hidden">
              <div className="flex h-full">
                <div className="w-[100px] border-r border-border bg-surface-muted shrink-0">
                  <div className="flex flex-col">
                    {networkPolicyData.egressRules.map((rule) => (
                      <button
                        key={rule.id}
                        type="button"
                        className={`w-full px-3 py-2 text-left text-11 font-medium flex items-center justify-between hover:bg-surface-subtle ${
                          selectedEgressRule === rule.id
                            ? 'bg-surface-default text-primary'
                            : 'text-text'
                        }`}
                        onClick={() => setSelectedEgressRule(rule.id)}
                      >
                        <span>{rule.name}</span>
                        {rule.id !== 'egress1' && (
                          <IconX size={12} stroke={1.5} className="text-text-muted" />
                        )}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left text-11 font-medium text-primary flex items-center gap-1 hover:bg-surface-subtle border-none bg-transparent cursor-pointer"
                    >
                      <IconCirclePlus size={12} stroke={1.5} />
                      Add rule
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-4 min-w-0">
                  {selectedEgressRuleData ? (
                    <div className="flex flex-col gap-4">
                      <h4 className="text-13 font-medium text-text m-0">Targets</h4>

                      <div className="flex flex-col gap-2">
                        <label className="text-13 font-medium text-text">Rule type</label>
                        <Dropdown.Select
                          value={selectedEgressRuleData.ruleType}
                          onChange={() => {}}
                          placeholder="Select"
                        >
                          {ruleTypeOptions.map((opt) => (
                            <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                          ))}
                        </Dropdown.Select>
                      </div>

                      <div className="flex flex-col gap-3 w-full">
                        <div className="flex flex-col gap-2">
                          <span className="text-13 font-medium text-text">Namespace</span>
                          <div className="w-full border border-border rounded-md p-3">
                            <div className="flex flex-col gap-2">
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <span className="text-13 font-medium text-text">Key</span>
                                </div>
                                <div className="flex-1">
                                  <span className="text-13 font-medium text-text">Operator</span>
                                </div>
                                <div className="flex-1">
                                  <span className="text-13 font-medium text-text">Value</span>
                                </div>
                              </div>
                              <div className="flex gap-2 items-center">
                                <div className="flex-1 min-w-0">
                                  <Input
                                    value={
                                      selectedEgressRuleData.namespaceSelectors[0]?.key || 'foo'
                                    }
                                    onChange={() => {}}
                                    size="md"
                                    className="w-full"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Dropdown.Select
                                    value={
                                      selectedEgressRuleData.namespaceSelectors[0]?.operator ||
                                      'In List'
                                    }
                                    onChange={() => {}}
                                    placeholder="Select"
                                    size="md"
                                  >
                                    {operatorOptions.map((opt) => (
                                      <Dropdown.Option
                                        key={opt.value}
                                        value={opt.value}
                                        label={opt.label}
                                      />
                                    ))}
                                  </Dropdown.Select>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Input
                                    value={
                                      selectedEgressRuleData.namespaceSelectors[0]?.value || 'bar'
                                    }
                                    onChange={() => {}}
                                    size="md"
                                    className="w-full"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className="text-13 font-medium text-text">Pod</span>
                          <div className="w-full border border-border rounded-md p-3">
                            <div className="flex flex-col gap-2">
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <span className="text-13 font-medium text-text">Key</span>
                                </div>
                                <div className="flex-1">
                                  <span className="text-13 font-medium text-text">Operator</span>
                                </div>
                                <div className="flex-1">
                                  <span className="text-13 font-medium text-text">Value</span>
                                </div>
                              </div>
                              <div className="flex gap-2 items-center">
                                <div className="flex-1 min-w-0">
                                  <Input
                                    value={selectedEgressRuleData.podSelectors[0]?.key || 'foo'}
                                    onChange={() => {}}
                                    size="md"
                                    className="w-full"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Dropdown.Select
                                    value={
                                      selectedEgressRuleData.podSelectors[0]?.operator || 'In List'
                                    }
                                    onChange={() => {}}
                                    placeholder="Select"
                                    size="md"
                                  >
                                    {operatorOptions.map((opt) => (
                                      <Dropdown.Option
                                        key={opt.value}
                                        value={opt.value}
                                        label={opt.label}
                                      />
                                    ))}
                                  </Dropdown.Select>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Input
                                    value={selectedEgressRuleData.podSelectors[0]?.value || 'bar'}
                                    onChange={() => {}}
                                    size="md"
                                    className="w-full"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 mt-4">
                        <h4 className="text-13 font-medium text-text m-0">
                          Matching pods ({networkPolicyData.matchingPods.length}/10)
                        </h4>
                        {egressMatchingPodsPagination}
                        {renderMatchingPodsTable(
                          networkPolicyData.matchingPods.slice(
                            (egressMatchingPodsPage - 1) * podsPerPage,
                            egressMatchingPodsPage * podsPerPage
                          )
                        )}
                      </div>

                      <div className="flex flex-col gap-3 mt-4">
                        <h4 className="text-13 font-medium text-text m-0">Allowed ports</h4>
                        <div className="w-full border border-border rounded-md p-3">
                          <div className="flex gap-4">
                            <div className="flex flex-col gap-2 flex-1 min-w-0">
                              <label className="text-13 font-medium text-text">Port</label>
                              <Input
                                value={selectedEgressRuleData.allowedPorts[0]?.port || '53'}
                                onChange={() => {}}
                                size="md"
                                className="w-full"
                              />
                            </div>
                            <div className="flex flex-col gap-2 flex-1 min-w-0">
                              <label className="text-13 font-medium text-text">Protocol</label>
                              <Dropdown.Select
                                value={selectedEgressRuleData.allowedPorts[0]?.protocol || 'UDP'}
                                onChange={() => {}}
                                placeholder="Select"
                                size="md"
                              >
                                {protocolOptions.map((opt) => (
                                  <Dropdown.Option
                                    key={opt.value}
                                    value={opt.value}
                                    label={opt.label}
                                  />
                                ))}
                              </Dropdown.Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-12 leading-18 text-text-muted m-0">
                      No rule selected. Click on a rule or add a new one.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Tab>

        <Tab id="selectors" label="Selectors">
          <div className="w-full border border-border rounded-md p-4 pt-4">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 w-full">
                <h3 className="text-16 font-semibold leading-6 text-text m-0">Selectors</h3>

                <div className="w-full border border-border rounded-md p-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 w-full">
                      <div className="flex-1">
                        <span className="text-13 font-medium text-text">Key</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-13 font-medium text-text">Operator</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-13 font-medium text-text">Value</span>
                      </div>
                    </div>

                    {Object.entries(networkPolicyData.podSelector).length > 0 ? (
                      Object.entries(networkPolicyData.podSelector).map(([key, value]) => (
                        <div key={key} className="flex gap-2 w-full">
                          <div className="flex-1 min-w-0">
                            <Input
                              value={key}
                              onChange={() => {}}
                              size="md"
                              disabled
                              className="w-full bg-surface-muted"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Dropdown.Select value="In List" onChange={() => {}} disabled size="md">
                              {operatorOptions.map((opt) => (
                                <Dropdown.Option
                                  key={opt.value}
                                  value={opt.value}
                                  label={opt.label}
                                />
                              ))}
                            </Dropdown.Select>
                          </div>
                          <div className="flex-1 min-w-0">
                            <Input
                              value={value}
                              onChange={() => {}}
                              size="md"
                              disabled
                              className="w-full bg-surface-muted"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-12 leading-18 text-text-muted m-0">
                        No selectors configured.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-13 font-medium text-text">
                  Matching pods ({networkPolicyData.matchingPods.length}/10)
                </span>
                {matchingPodsPagination}
                {renderMatchingPodsTable(paginatedMatchingPods)}
              </div>
            </div>
          </div>
        </Tab>

        <Tab id="labels-annotations" label="Labels & annotations">
          <div className="w-full border border-border rounded-lg p-4 pt-4">
            <div className="flex flex-col gap-6">
              <h3 className="text-16 font-semibold leading-6 text-text m-0">
                Labels & annotations
              </h3>

              <div className="flex flex-col gap-2 w-full">
                <h4 className="text-13 font-medium text-text m-0">Labels</h4>
                <div className="w-full border border-border rounded-md p-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 w-full">
                      <div className="flex-1">
                        <span className="text-13 font-medium text-text">Key</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-13 font-medium text-text">Value</span>
                      </div>
                    </div>
                    {labelsCount > 0 ? (
                      Object.entries(networkPolicyData.labels).map(([key, value]) => (
                        <div key={key} className="flex gap-2 w-full">
                          <div className="flex-1 min-w-0">
                            <Input
                              value={key}
                              onChange={() => {}}
                              size="md"
                              disabled
                              className="w-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Input
                              value={value}
                              onChange={() => {}}
                              size="md"
                              disabled
                              className="w-full"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-12 leading-18 text-text-muted m-0">
                        No labels configured.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <h4 className="text-13 font-medium text-text m-0">Annotations</h4>
                <div className="w-full border border-border rounded-md p-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 w-full">
                      <div className="flex-1">
                        <span className="text-13 font-medium text-text">Key</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-13 font-medium text-text">Value</span>
                      </div>
                    </div>
                    {annotationsCount > 0 ? (
                      Object.entries(networkPolicyData.annotations).map(([key, value]) => (
                        <div key={key} className="flex gap-2 w-full">
                          <div className="flex-1 min-w-0">
                            <Input
                              value={key}
                              onChange={() => {}}
                              size="md"
                              disabled
                              className="w-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Input
                              value={value}
                              onChange={() => {}}
                              size="md"
                              disabled
                              className="w-full"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-12 leading-18 text-text-muted m-0">
                        No annotations configured.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
