import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
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
  Table,
  Input,
  Select,
  Badge,
  ContextMenu,
  ConfirmModal,
  PageShell,
  DetailHeader,
  ErrorState,
  SectionCard,
  Pagination,
  type ContextMenuItem,
} from '@/design-system';
import { SecuritySidebar } from '@/components/SecuritySidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTabs } from '@/contexts/TabContext';
import { IconChevronDown, IconAlertTriangle } from '@tabler/icons-react';

interface NetworkPolicyDetail {
  id: string;
  name: string;
  namespace: string;
  cluster: string;
  clusterLink: string;
  status: 'active' | 'error';
  createdAt: string;
  labels: string[];
  annotations: string[];
  podSelector: string;
}

interface LabelSelector {
  id: string;
  key: string;
  operator: string;
  values: string;
}

interface RuleTarget {
  id: string;
  ruleType: string;
  cidr: string;
  exceptions: string[];
  namespaceSelectors?: LabelSelector[];
  podSelectors?: LabelSelector[];
}

interface AllowedPort {
  id: string;
  port: string;
  protocol: string;
}

interface TrafficRule {
  id: string;
  name: string;
  targets: RuleTarget[];
  allowedPorts: AllowedPort[];
}

interface SelectorRule {
  id: string;
  key: string;
  operator: string;
  value: string;
}

interface KeyValue {
  id: string;
  key: string;
  value: string;
}

const RULE_TYPE_OPTIONS = [
  { value: 'ip-block', label: 'IP Block' },
  { value: 'namespace-label-selector', label: 'Namespace Label Selector' },
  { value: 'pod-label-selector', label: 'Pod Label Selector' },
  { value: 'namespace-pod-label-selector', label: 'Namespace/Pod Label Selector' },
];

const PROTOCOL_OPTIONS = [
  { value: 'TCP', label: 'TCP' },
  { value: 'UDP', label: 'UDP' },
  { value: 'SCTP', label: 'SCTP' },
];

const OPERATOR_OPTIONS = [
  { value: 'in', label: 'in list' },
  { value: 'not-in', label: 'not in list' },
  { value: 'exists', label: 'exists' },
  { value: 'does-not-exist', label: 'does not exist' },
];

const mockPoliciesMap: Record<string, NetworkPolicyDetail> = {
  'np-001': {
    id: 'np-001',
    name: 'deny-all-ingress',
    namespace: 'production',
    cluster: 'prod-cluster-01',
    clusterLink: '/container/clusters/cluster-01',
    status: 'active',
    createdAt: 'Dec 28 2025 23:19:49',
    labels: ['app=api'],
    annotations: ['description=deny all ingress'],
    podSelector: 'app=api',
  },
  'np-002': {
    id: 'np-002',
    name: 'allow-frontend',
    namespace: 'production',
    cluster: 'prod-cluster-01',
    clusterLink: '/container/clusters/cluster-01',
    status: 'active',
    createdAt: 'Dec 29 2025 10:00:00',
    labels: ['app=frontend', 'tier=web'],
    annotations: ['description=allow frontend traffic'],
    podSelector: 'app=frontend',
  },
  'np-003': {
    id: 'np-003',
    name: 'allow-monitoring',
    namespace: 'monitoring',
    cluster: 'staging-cluster-02',
    clusterLink: '/container/clusters/cluster-02',
    status: 'active',
    createdAt: 'Jan 05 2026 14:30:00',
    labels: ['app=prometheus'],
    annotations: [],
    podSelector: 'app=prometheus',
  },
};

const mockIngressRules: TrafficRule[] = [
  {
    id: 'rule-1',
    name: 'Rule 1',
    targets: [
      {
        id: 'target-1',
        ruleType: 'namespace-pod-label-selector',
        cidr: '',
        exceptions: [],
        namespaceSelectors: [{ id: 'ns-1', key: 'foo', operator: 'in', values: 'bar' }],
        podSelectors: [{ id: 'pod-1', key: 'foo', operator: 'in', values: 'bar' }],
      },
    ],
    allowedPorts: [{ id: 'port-1', port: '8080', protocol: 'TCP' }],
  },
  {
    id: 'rule-2',
    name: 'Rule 2',
    targets: [],
    allowedPorts: [],
  },
];

const mockEgressRules: TrafficRule[] = [
  {
    id: 'egress-rule-1',
    name: 'Rule 1',
    targets: [
      {
        id: 'egress-target-1',
        ruleType: 'namespace-pod-label-selector',
        cidr: '',
        exceptions: [],
        namespaceSelectors: [{ id: 'ens-1', key: 'foo', operator: 'in', values: 'bar' }],
        podSelectors: [{ id: 'epod-1', key: 'foo', operator: 'in', values: 'bar' }],
      },
    ],
    allowedPorts: [{ id: 'egress-port-1', port: '443', protocol: 'TCP' }],
  },
  {
    id: 'egress-rule-2',
    name: 'Rule 2',
    targets: [],
    allowedPorts: [],
  },
];

const mockSelectorRules: SelectorRule[] = [
  { id: 'sel-1', key: 'app', operator: 'in', value: 'api' },
];

const mockLabels: KeyValue[] = [
  { id: 'lbl-1', key: 'app', value: 'api' },
  { id: 'lbl-2', key: 'env', value: 'production' },
];

const mockAnnotations: KeyValue[] = [
  { id: 'ann-1', key: 'description', value: 'deny all ingress traffic' },
];

interface MatchingPod {
  id: string;
  name: string;
  createdAt: string;
}

const MOCK_MATCHING_PODS: MatchingPod[] = [
  { id: '1', name: 'deploymentName-776bb9c69-4aw7f', createdAt: '2025-07-25 09:12:20' },
];

const MATCHING_PODS_COLUMNS = [
  {
    key: 'name' as const,
    label: 'Name',
    sortable: true,
    render: (value: string) => (
      <span className="text-label-md text-[var(--color-action-primary)]">{value}</span>
    ),
  },
  { key: 'createdAt' as const, label: 'Created At', sortable: true },
];

function ReadonlyTrafficRules({ rules, title }: { rules: TrafficRule[]; title: string }) {
  const [activeRuleIndex, setActiveRuleIndex] = useState(0);
  const activeRule = rules[activeRuleIndex];

  if (rules.length === 0) {
    return (
      <SectionCard className="pb-4">
        <SectionCard.Header title={title} />
        <SectionCard.Content>
          <span className="text-body-md text-[var(--color-text-subtle)]">
            No {title.toLowerCase()} configured.
          </span>
        </SectionCard.Content>
      </SectionCard>
    );
  }

  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title={title} />
      <SectionCard.Content>
        <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] w-full overflow-hidden">
          <div className="flex w-full">
            <div className="flex flex-col border-r border-[var(--color-border-default)] shrink-0 min-w-[100px]">
              {rules.map((rule, index) => (
                <button
                  key={rule.id}
                  onClick={() => setActiveRuleIndex(index)}
                  className={`flex items-center justify-between px-3 py-2 text-left border-b border-[var(--color-border-default)] last:border-b-0 ${
                    activeRuleIndex === index
                      ? 'bg-[var(--color-surface-default)] text-[var(--color-action-primary)]'
                      : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-subtle)]'
                  }`}
                >
                  <span className="text-label-md">{rule.name}</span>
                </button>
              ))}
            </div>

            {activeRule && (
              <div className="flex-1 p-3">
                <VStack gap={6}>
                  {/* Sources/Targets */}
                  <VStack gap={3}>
                    <label className="text-label-lg text-[var(--color-text-default)]">
                      Sources
                    </label>

                    <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 w-full">
                      <VStack gap={1.5} className="w-full">
                        {activeRule.targets.length === 0 && (
                          <span className="text-body-md text-[var(--color-text-subtle)]">
                            No sources configured.
                          </span>
                        )}
                        {activeRule.targets.map((target) => (
                          <div
                            key={target.id}
                            className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-4 py-3 w-full"
                          >
                            <VStack gap={3}>
                              <VStack gap={2}>
                                <div className="grid grid-cols-[1fr_1fr] gap-2 w-full items-center">
                                  <span className="block text-label-sm text-[var(--color-text-default)]">
                                    Rule type
                                  </span>
                                  {target.ruleType === 'ip-block' && (
                                    <span className="block text-label-sm text-[var(--color-text-default)]">
                                      CIDR
                                    </span>
                                  )}
                                </div>
                                <div className="grid grid-cols-[1fr_1fr] gap-2 w-full items-center">
                                  <Select
                                    options={RULE_TYPE_OPTIONS}
                                    value={target.ruleType}
                                    onChange={() => {}}
                                    fullWidth
                                    disabled
                                  />
                                  {target.ruleType === 'ip-block' && (
                                    <Input
                                      value={target.cidr}
                                      onChange={() => {}}
                                      fullWidth
                                      disabled
                                    />
                                  )}
                                </div>
                              </VStack>

                              {/* Namespace/Pod label selector combined */}
                              {target.ruleType === 'namespace-pod-label-selector' && (
                                <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-4 pt-3 pb-4 w-full">
                                  <VStack gap={2}>
                                    <VStack gap={2}>
                                      <span className="text-label-md text-[var(--color-text-default)]">
                                        Namespace
                                      </span>
                                      {(target.namespaceSelectors || []).map((sel) => (
                                        <div
                                          key={sel.id}
                                          className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3 w-full"
                                        >
                                          <div className="flex gap-2 w-full">
                                            <VStack gap={2} className="flex-1 min-w-0">
                                              <span className="text-label-sm text-[var(--color-text-default)]">
                                                Key
                                              </span>
                                              <Input
                                                value={sel.key}
                                                onChange={() => {}}
                                                fullWidth
                                                disabled
                                              />
                                            </VStack>
                                            <VStack gap={2} className="flex-1 min-w-0">
                                              <span className="text-label-sm text-[var(--color-text-default)]">
                                                Operator
                                              </span>
                                              <Select
                                                options={OPERATOR_OPTIONS}
                                                value={sel.operator}
                                                onChange={() => {}}
                                                fullWidth
                                                disabled
                                              />
                                            </VStack>
                                            <VStack gap={2} className="flex-1 min-w-0">
                                              <span className="text-label-sm text-[var(--color-text-default)]">
                                                Value
                                              </span>
                                              <Input
                                                value={sel.values}
                                                onChange={() => {}}
                                                fullWidth
                                                disabled
                                              />
                                            </VStack>
                                          </div>
                                        </div>
                                      ))}
                                    </VStack>
                                    <VStack gap={2}>
                                      <span className="text-label-md text-[var(--color-text-default)]">
                                        Pod
                                      </span>
                                      {(target.podSelectors || []).map((sel) => (
                                        <div
                                          key={sel.id}
                                          className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3 w-full"
                                        >
                                          <div className="flex gap-2 w-full">
                                            <VStack gap={2} className="flex-1 min-w-0">
                                              <span className="text-label-sm text-[var(--color-text-default)]">
                                                Key
                                              </span>
                                              <Input
                                                value={sel.key}
                                                onChange={() => {}}
                                                fullWidth
                                                disabled
                                              />
                                            </VStack>
                                            <VStack gap={2} className="flex-1 min-w-0">
                                              <span className="text-label-sm text-[var(--color-text-default)]">
                                                Operator
                                              </span>
                                              <Select
                                                options={OPERATOR_OPTIONS}
                                                value={sel.operator}
                                                onChange={() => {}}
                                                fullWidth
                                                disabled
                                              />
                                            </VStack>
                                            <VStack gap={2} className="flex-1 min-w-0">
                                              <span className="text-label-sm text-[var(--color-text-default)]">
                                                Value
                                              </span>
                                              <Input
                                                value={sel.values}
                                                onChange={() => {}}
                                                fullWidth
                                                disabled
                                              />
                                            </VStack>
                                          </div>
                                        </div>
                                      ))}
                                    </VStack>
                                  </VStack>
                                </div>
                              )}

                              {/* Namespace-only or Pod-only label selectors */}
                              {(target.ruleType === 'namespace-label-selector' ||
                                target.ruleType === 'pod-label-selector') && (
                                <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 w-full">
                                  <VStack gap={1.5}>
                                    <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 w-full">
                                      <span className="block text-label-sm text-[var(--color-text-default)]">
                                        Key
                                      </span>
                                      <span className="block text-label-sm text-[var(--color-text-default)]">
                                        Operator
                                      </span>
                                      <span className="block text-label-sm text-[var(--color-text-default)]">
                                        Values
                                      </span>
                                    </div>
                                    {(
                                      (target.ruleType === 'namespace-label-selector'
                                        ? target.namespaceSelectors
                                        : target.podSelectors) || []
                                    ).map((sel) => (
                                      <div
                                        key={sel.id}
                                        className="grid grid-cols-[1fr_1fr_1fr] gap-2 w-full items-center"
                                      >
                                        <Input
                                          value={sel.key}
                                          onChange={() => {}}
                                          fullWidth
                                          disabled
                                        />
                                        <Select
                                          options={OPERATOR_OPTIONS}
                                          value={sel.operator}
                                          onChange={() => {}}
                                          fullWidth
                                          disabled
                                        />
                                        <Input
                                          value={sel.values}
                                          onChange={() => {}}
                                          fullWidth
                                          disabled
                                        />
                                      </div>
                                    ))}
                                  </VStack>
                                </div>
                              )}

                              {/* IP Block exceptions */}
                              {target.ruleType === 'ip-block' && target.exceptions.length > 0 && (
                                <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 w-full">
                                  <VStack gap={1.5}>
                                    <span className="block text-label-sm text-[var(--color-text-default)]">
                                      Exception CIDR
                                    </span>
                                    {target.exceptions.map((ex, i) => (
                                      <Input
                                        key={i}
                                        value={ex}
                                        onChange={() => {}}
                                        fullWidth
                                        disabled
                                      />
                                    ))}
                                  </VStack>
                                </div>
                              )}

                              {/* Matching Pods */}
                              {target.ruleType !== 'ip-block' && (
                                <VStack gap={2} className="w-full">
                                  <Pagination
                                    currentPage={1}
                                    totalPages={Math.ceil(116 / 10)}
                                    totalItems={116}
                                    onPageChange={() => {}}
                                  />
                                  <span className="text-label-sm text-[var(--color-text-default)]">
                                    Matching Pods
                                  </span>
                                  <Table
                                    columns={MATCHING_PODS_COLUMNS}
                                    data={MOCK_MATCHING_PODS}
                                    rowKey="id"
                                    rowHeight="40px"
                                  />
                                </VStack>
                              )}
                            </VStack>
                          </div>
                        ))}
                      </VStack>
                    </div>
                  </VStack>

                  {/* Allowed Ports */}
                  <VStack gap={3}>
                    <label className="text-label-lg text-[var(--color-text-default)]">
                      Allowed Ports
                    </label>

                    <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 w-full">
                      <VStack gap={1.5} className="w-full">
                        {activeRule.allowedPorts.length === 0 && (
                          <span className="text-body-md text-[var(--color-text-subtle)]">
                            No allowed ports configured.
                          </span>
                        )}
                        {activeRule.allowedPorts.map((port) => (
                          <div
                            key={port.id}
                            className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-4 py-3 w-full"
                          >
                            <VStack gap={2}>
                              <div className="grid grid-cols-[1fr_1fr] gap-2 w-full items-center">
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Port
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Protocol
                                </span>
                              </div>
                              <div className="grid grid-cols-[1fr_1fr] gap-2 w-full items-center">
                                <Input value={port.port} onChange={() => {}} fullWidth disabled />
                                <Select
                                  options={PROTOCOL_OPTIONS}
                                  value={port.protocol}
                                  onChange={() => {}}
                                  fullWidth
                                  disabled
                                />
                              </div>
                            </VStack>
                          </div>
                        ))}
                      </VStack>
                    </div>
                  </VStack>
                </VStack>
              </div>
            )}
          </div>
        </div>
      </SectionCard.Content>
    </SectionCard>
  );
}

export function NetworkPolicyDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'ingress';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const policy = id ? mockPoliciesMap[id] : undefined;

  useEffect(() => {
    if (policy?.name) {
      updateActiveTabLabel(policy.name);
    }
  }, [policy?.name, updateActiveTabLabel]);

  const breadcrumbItems = [
    { label: 'Security', href: '/security' },
    { label: 'Network Policies', href: '/security/network-policies' },
    { label: policy?.name ?? id ?? '—' },
  ];

  const moreActions: ContextMenuItem[] = [
    { id: 'edit-yaml', label: 'Edit YAML', onClick: () => {} },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      divider: true,
      onClick: () => setIsDeleteOpen(true),
    },
  ];

  if (!policy) {
    return (
      <PageShell
        sidebar={<SecuritySidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
        sidebarWidth={sidebarWidth}
        tabBar={
          <TabBar
            tabs={tabs.map((t) => ({ id: t.id, label: t.label, closable: t.closable }))}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            onTabReorder={moveTab}
          />
        }
        topBar={
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={openSidebar}
            showNavigation={true}
            onBack={() => navigate(-1)}
            onForward={() => navigate(1)}
            breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          />
        }
        contentClassName="pt-4 px-8 pb-20"
      >
        <ErrorState
          icon={<IconAlertTriangle size={48} stroke={1} />}
          title="Network Policy not found"
          description={`No network policy with ID "${id}" was found.`}
          action={
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/security/network-policies')}
            >
              Back to Network Policies
            </Button>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      sidebar={<SecuritySidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((t) => ({ id: t.id, label: t.label, closable: t.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={openSidebar}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        <DetailHeader>
          <DetailHeader.Title>Network Policy: {policy.name}</DetailHeader.Title>

          <DetailHeader.Actions>
            <ContextMenu items={moreActions} trigger="click" align="right">
              <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
                More Actions
              </Button>
            </ContextMenu>
          </DetailHeader.Actions>

          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={policy.status === 'active' ? 'Active' : 'Error'}
              status={policy.status}
            />
            <DetailHeader.InfoCard
              label="Cluster"
              value={
                <Link
                  to={policy.clusterLink}
                  className="text-body-md text-[var(--color-action-primary)] hover:underline"
                  style={{ fontWeight: 500 }}
                >
                  {policy.cluster}
                </Link>
              }
            />
            <DetailHeader.InfoCard label="Namespace" value={policy.namespace} />
            <DetailHeader.InfoCard label="Created At" value={policy.createdAt} />
            <DetailHeader.InfoCard
              label="Labels"
              value={
                <div className="flex flex-wrap items-center gap-1 min-w-0 w-full">
                  {policy.labels.map((l, i) => (
                    <Badge key={i} theme="white" size="sm">
                      {l}
                    </Badge>
                  ))}
                </div>
              }
            />
            <DetailHeader.InfoCard
              label="Annotations"
              value={
                <div className="flex flex-wrap items-center gap-1 min-w-0 w-full">
                  {policy.annotations.length > 0 ? (
                    policy.annotations.map((a, i) => (
                      <Badge key={i} theme="white" size="sm">
                        {a}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-body-md text-[var(--color-text-subtle)]">—</span>
                  )}
                </div>
              }
            />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="ingress">Ingress Rules</Tab>
            <Tab value="egress">Egress Rules</Tab>
            <Tab value="selectors">Selectors</Tab>
            <Tab value="labels">Labels & Annotations</Tab>
          </TabList>

          <TabPanel value="ingress" className="pt-0">
            <VStack gap={4} className="pt-4">
              <ReadonlyTrafficRules rules={mockIngressRules} title="Ingress Rules" />
            </VStack>
          </TabPanel>

          <TabPanel value="egress" className="pt-0">
            <VStack gap={4} className="pt-4">
              <ReadonlyTrafficRules rules={mockEgressRules} title="Egress Rules" />
            </VStack>
          </TabPanel>

          <TabPanel value="selectors" className="pt-0">
            <VStack gap={4} className="pt-4">
              <SectionCard className="pb-4">
                <SectionCard.Header title="Selectors" />
                <SectionCard.Content>
                  <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 w-full">
                    <VStack gap={1.5}>
                      <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 w-full">
                        <span className="block text-label-sm text-[var(--color-text-default)]">
                          Key
                        </span>
                        <span className="block text-label-sm text-[var(--color-text-default)]">
                          Operator
                        </span>
                        <span className="block text-label-sm text-[var(--color-text-default)]">
                          Value
                        </span>
                      </div>
                      {mockSelectorRules.map((rule) => (
                        <div
                          key={rule.id}
                          className="grid grid-cols-[1fr_1fr_1fr] gap-2 w-full items-center"
                        >
                          <Input value={rule.key} onChange={() => {}} fullWidth disabled />
                          <Select
                            options={OPERATOR_OPTIONS}
                            value={rule.operator}
                            onChange={() => {}}
                            fullWidth
                            disabled
                          />
                          <Input value={rule.value} onChange={() => {}} fullWidth disabled />
                        </div>
                      ))}
                    </VStack>
                  </div>

                  <VStack gap={2} className="mt-4">
                    <span className="text-label-sm text-[var(--color-text-default)]">
                      Matching Pods
                    </span>
                    <Pagination
                      currentPage={1}
                      totalPages={Math.ceil(116 / 10)}
                      totalItems={116}
                      onPageChange={() => {}}
                    />
                    <Table
                      columns={MATCHING_PODS_COLUMNS}
                      data={MOCK_MATCHING_PODS}
                      rowKey="id"
                      rowHeight="40px"
                    />
                  </VStack>
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </TabPanel>

          <TabPanel value="labels" className="pt-0">
            <VStack gap={4} className="pt-4">
              <SectionCard className="pb-4">
                <SectionCard.Header title="Labels" />
                <SectionCard.Content>
                  <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 w-full">
                    <VStack gap={1.5}>
                      <div className="grid grid-cols-[1fr_1fr] gap-2 w-full">
                        <span className="block text-label-sm text-[var(--color-text-default)]">
                          Key
                        </span>
                        <span className="block text-label-sm text-[var(--color-text-default)]">
                          Value
                        </span>
                      </div>
                      {mockLabels.map((label) => (
                        <div
                          key={label.id}
                          className="grid grid-cols-[1fr_1fr] gap-2 w-full items-center"
                        >
                          <Input value={label.key} onChange={() => {}} fullWidth disabled />
                          <Input value={label.value} onChange={() => {}} fullWidth disabled />
                        </div>
                      ))}
                    </VStack>
                  </div>
                </SectionCard.Content>
              </SectionCard>

              <SectionCard className="pb-4">
                <SectionCard.Header title="Annotations" />
                <SectionCard.Content>
                  <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 w-full">
                    <VStack gap={1.5}>
                      <div className="grid grid-cols-[1fr_1fr] gap-2 w-full">
                        <span className="block text-label-sm text-[var(--color-text-default)]">
                          Key
                        </span>
                        <span className="block text-label-sm text-[var(--color-text-default)]">
                          Value
                        </span>
                      </div>
                      {mockAnnotations.map((ann) => (
                        <div
                          key={ann.id}
                          className="grid grid-cols-[1fr_1fr] gap-2 w-full items-center"
                        >
                          <Input value={ann.key} onChange={() => {}} fullWidth disabled />
                          <Input value={ann.value} onChange={() => {}} fullWidth disabled />
                        </div>
                      ))}
                    </VStack>
                  </div>
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          setIsDeleteOpen(false);
          navigate('/security/network-policies');
        }}
        title="Delete Network Policy"
        description="This action is permanent and cannot be undone."
        infoLabel="Policy name"
        infoValue={policy.name}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </PageShell>
  );
}

export default NetworkPolicyDetailPage;
