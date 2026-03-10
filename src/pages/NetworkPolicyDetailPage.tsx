import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Button,
  ContextMenu,
  DetailHeader,
  Badge,
  Tooltip,
  Select,
  Input,
  Pagination,
  Table,
  PageShell,
  type ContextMenuItem,
  type TableColumn,
  columnMinWidths,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconChevronDown,
  IconCirclePlus,
  IconX,
} from '@tabler/icons-react';

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
    createdAt: 'Jul 25, 2025',
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
      { name: 'deploymentName-77f6bb9c69-4aw7f', createdAt: 'Jul 25, 2025' },
      { name: 'deploymentName-77f6bb9c69-8xk2p', createdAt: 'Jul 25, 2025' },
      { name: 'deploymentName-77f6bb9c69-9m3qt', createdAt: 'Jul 25, 2025' },
    ],
  },
  '2': {
    id: '2',
    name: 'networkpolicyName2',
    status: 'True',
    namespace: 'default',
    createdAt: 'Nov 10, 2025',
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

export function NetworkPolicyDetailPage() {
  const { networkPolicyId } = useParams<{ networkPolicyId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    tabs,
    activeTabId,
    selectTab,
    closeTab,
    addNewTab,
    moveTab,
    addTab,
    updateActiveTabLabel,
  } = useTabs();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'ingress-rules';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [selectedRule, setSelectedRule] = useState<string>('rule1');
  const [selectedEgressRule, setSelectedEgressRule] = useState<string>('egress1');
  const [matchingPodsPage, setMatchingPodsPage] = useState(1);
  const [egressMatchingPodsPage, setEgressMatchingPodsPage] = useState(1);

  // Shell Panel state
  const shellPanel = useShellPanel();

  // Load Network Policy data
  const [networkPolicyData, setNetworkPolicyData] = useState<NetworkPolicyData | null>(null);

  useEffect(() => {
    if (networkPolicyId && mockNetworkPolicyData[networkPolicyId]) {
      setNetworkPolicyData(mockNetworkPolicyData[networkPolicyId]);
    } else {
      // Default to first network policy if not found
      setNetworkPolicyData(mockNetworkPolicyData['1']);
    }
  }, [networkPolicyId]);

  // Update tab label to match the Network Policy name (most recent breadcrumb)
  useEffect(() => {
    if (networkPolicyData) {
      updateActiveTabLabel(networkPolicyData.name);
    }
  }, [updateActiveTabLabel, networkPolicyData]);

  // Handle opening shell tab in new browser tab
  const handleOpenInNewTab = (tab: ShellTab) => {
    const tabId = `console-${tab.instanceId}-${Date.now()}`;
    addTab({
      id: tabId,
      label: tab.title,
      path: `/container/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`,
      closable: true,
    });
    navigate(`/container/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`);
  };

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // More actions menu
  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'edit-config',
      label: 'Edit config',
      onClick: () => navigate(`/container/network-policies/${networkPolicyId}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/network-policies/${networkPolicy.name}/edit-yaml`),
    },
    {
      id: 'download-yaml',
      label: 'Download YAML',
      onClick: () => console.log('Download YAML'),
    },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete'),
    },
  ];

  if (!networkPolicyData) {
    return <div>Loading...</div>;
  }

  // Format labels and annotations
  const labelsCount = Object.keys(networkPolicyData.labels).length;
  const annotationsCount = Object.keys(networkPolicyData.annotations).length;

  // Get selected rule data
  const selectedRuleData = networkPolicyData.ingressRules.find((r) => r.id === selectedRule);
  const selectedEgressRuleData = networkPolicyData.egressRules.find(
    (r) => r.id === selectedEgressRule
  );

  // Rule type options
  const ruleTypeOptions = [
    { value: 'Namespace/Pod Label Selector', label: 'Namespace/Pod Label Selector' },
    { value: 'IP Block', label: 'IP Block' },
  ];

  // Operator options
  const operatorOptions = [
    { value: 'In List', label: 'In List' },
    { value: 'Not In List', label: 'Not In List' },
    { value: 'Exists', label: 'Exists' },
    { value: 'Does Not Exist', label: 'Does Not Exist' },
  ];

  // Protocol options
  const protocolOptions = [
    { value: 'TCP', label: 'TCP' },
    { value: 'UDP', label: 'UDP' },
    { value: 'SCTP', label: 'SCTP' },
  ];

  // Matching pods table columns
  const matchingPodsColumns: TableColumn<MatchingPod>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (value: string) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate"
          onClick={() => navigate(`/container/pods/${value}`)}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
  ];

  // Matching pods pagination
  const podsPerPage = 10;
  const totalMatchingPodsPages = Math.ceil(networkPolicyData.matchingPods.length / podsPerPage);
  const paginatedMatchingPods = networkPolicyData.matchingPods.slice(
    (matchingPodsPage - 1) * podsPerPage,
    matchingPodsPage * podsPerPage
  );

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
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
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Network Policies', href: '/container/network-policies' },
                { label: networkPolicyData.name },
              ]}
            />
          }
          actions={
            <>
              <button
                className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                onClick={() => {
                  if (shellPanel.isExpanded) {
                    shellPanel.setIsExpanded(false);
                  } else {
                    shellPanel.openConsole('kubectl-np', `Kubectl: ${networkPolicyData.name}`);
                  }
                }}
              >
                <IconTerminal2
                  size={16}
                  className={
                    shellPanel.isExpanded
                      ? 'text-[var(--color-action-primary)]'
                      : 'text-[var(--color-text-muted)]'
                  }
                  stroke={1.5}
                />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconFile size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconCopy size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
            </>
          }
        />
      }
      bottomPanel={
        <ShellPanel
          isExpanded={shellPanel.isExpanded}
          onExpandedChange={shellPanel.setIsExpanded}
          tabs={shellPanel.tabs}
          activeTabId={shellPanel.activeTabId}
          onActiveTabChange={shellPanel.setActiveTabId}
          onCloseTab={shellPanel.closeTab}
          onContentChange={shellPanel.updateContent}
          onClear={shellPanel.clearContent}
          onOpenInNewTab={handleOpenInNewTab}
          initialHeight={350}
          sidebarWidth={sidebarWidth}
        />
      }
      bottomPanelPadding={shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0'}
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Header */}
        <DetailHeader>
          <DetailHeader.Title>Network Policy: {networkPolicyData.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <ContextMenu items={moreActionsItems} trigger="click" align="right">
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<IconChevronDown size={12} stroke={1.5} />}
              >
                More Actions
              </Button>
            </ContextMenu>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={
                <Tooltip content={networkPolicyData.status}>
                  <span className="max-w-[80px] truncate">
                    <Badge theme="white" size="sm">
                      {networkPolicyData.status}
                    </Badge>
                  </span>
                </Tooltip>
              }
            />
            <DetailHeader.InfoCard
              label="Namespace"
              value={
                <span
                  className="text-[var(--color-action-primary)] cursor-pointer hover:underline"
                  onClick={() => navigate(`/container/namespaces/${networkPolicyData.namespace}`)}
                >
                  {networkPolicyData.namespace}
                </span>
              }
            />
            <DetailHeader.InfoCard label="Created at" value={networkPolicyData.createdAt} />
            <DetailHeader.InfoCard
              label={`Labels (${labelsCount})`}
              value={
                labelsCount > 0
                  ? Object.entries(networkPolicyData.labels)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(', ')
                  : 'labels'
              }
            />
            <DetailHeader.InfoCard
              label={`Annotations (${annotationsCount})`}
              value={
                annotationsCount > 0
                  ? Object.entries(networkPolicyData.annotations)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(', ')
                  : 'annotations'
              }
            />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} size="sm">
          <TabList>
            <Tab value="ingress-rules">Ingress Rules</Tab>
            <Tab value="egress-rules">Egress Rules</Tab>
            <Tab value="selectors">Selectors</Tab>
            <Tab value="labels-annotations">Labels & Annotations</Tab>
          </TabList>

          {/* Ingress Rules Tab */}
          <TabPanel value="ingress-rules">
            <VStack gap={4}>
              <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                Ingress Rules
              </h3>

              <div className="w-full border border-[var(--color-border-default)] rounded-[8px] overflow-hidden">
                <HStack gap={0} className="h-full">
                  {/* Rules List (Left Panel) */}
                  <div className="w-[100px] border-r border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                    <VStack gap={0}>
                      {networkPolicyData.ingressRules.map((rule) => (
                        <button
                          key={rule.id}
                          className={`w-full px-3 py-2 text-left text-label-sm flex items-center justify-between hover:bg-[var(--color-surface-muted)] ${
                            selectedRule === rule.id
                              ? 'bg-[var(--color-surface-default)] text-[var(--color-action-primary)]'
                              : 'text-[var(--color-text-default)]'
                          }`}
                          onClick={() => setSelectedRule(rule.id)}
                        >
                          <span>{rule.name}</span>
                          {rule.id !== 'rule1' && (
                            <IconX
                              size={12}
                              stroke={1.5}
                              className="text-[var(--color-text-muted)]"
                            />
                          )}
                        </button>
                      ))}
                      <button className="w-full px-3 py-2 text-left text-label-sm text-[var(--color-action-primary)] flex items-center gap-1 hover:bg-[var(--color-surface-muted)]">
                        <IconCirclePlus size={12} stroke={1.5} />
                        Add Rule
                      </button>
                    </VStack>
                  </div>

                  {/* Rule Details (Right Panel) */}
                  <div className="flex-1 p-4">
                    {selectedRuleData ? (
                      <VStack gap={4}>
                        <h4 className="text-label-lg text-[var(--color-text-default)]">Targets</h4>

                        {/* Rule Type */}
                        <VStack gap={2}>
                          <label className="text-label-lg text-[var(--color-text-default)]">
                            Rule type
                          </label>
                          <Select
                            options={ruleTypeOptions}
                            value={selectedRuleData.ruleType}
                            onChange={() => {}}
                            fullWidth
                          />
                        </VStack>

                        {/* Selectors */}
                        <VStack gap={3} className="w-full">
                          {/* Namespace */}
                          <VStack gap={2}>
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Namespace
                            </span>
                            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-3">
                              <VStack gap={2}>
                                <HStack gap={2}>
                                  <div className="flex-1">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Key
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Operator
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Value
                                    </span>
                                  </div>
                                </HStack>
                                <HStack gap={2} align="center">
                                  <div className="flex-1">
                                    <Input
                                      value={selectedRuleData.namespaceSelectors[0]?.key || 'foo'}
                                      onChange={() => {}}
                                      size="md"
                                      fullWidth
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Select
                                      options={operatorOptions}
                                      value={
                                        selectedRuleData.namespaceSelectors[0]?.operator ||
                                        'In List'
                                      }
                                      onChange={() => {}}
                                      size="md"
                                      fullWidth
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Input
                                      value={selectedRuleData.namespaceSelectors[0]?.value || 'bar'}
                                      onChange={() => {}}
                                      size="md"
                                      fullWidth
                                    />
                                  </div>
                                </HStack>
                              </VStack>
                            </div>
                          </VStack>

                          {/* Pod */}
                          <VStack gap={2}>
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Pod
                            </span>
                            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-3">
                              <VStack gap={2}>
                                <HStack gap={2}>
                                  <div className="flex-1">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Key
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Operator
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Value
                                    </span>
                                  </div>
                                </HStack>
                                <HStack gap={2} align="center">
                                  <div className="flex-1">
                                    <Input
                                      value={selectedRuleData.podSelectors[0]?.key || 'foo'}
                                      onChange={() => {}}
                                      size="md"
                                      fullWidth
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Select
                                      options={operatorOptions}
                                      value={
                                        selectedRuleData.podSelectors[0]?.operator || 'In List'
                                      }
                                      onChange={() => {}}
                                      size="md"
                                      fullWidth
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Input
                                      value={selectedRuleData.podSelectors[0]?.value || 'bar'}
                                      onChange={() => {}}
                                      size="md"
                                      fullWidth
                                    />
                                  </div>
                                </HStack>
                              </VStack>
                            </div>
                          </VStack>
                        </VStack>

                        {/* Matching Pods */}
                        <VStack gap={3} className="mt-4">
                          <h4 className="text-label-lg text-[var(--color-text-default)]">
                            Matching Pods ({networkPolicyData.matchingPods.length}/10)
                          </h4>

                          <Pagination
                            currentPage={matchingPodsPage}
                            totalPages={totalMatchingPodsPages}
                            onPageChange={setMatchingPodsPage}
                            totalItems={networkPolicyData.matchingPods.length}
                            showSettings
                          />

                          <Table<MatchingPod>
                            columns={matchingPodsColumns}
                            data={paginatedMatchingPods}
                            rowKey="name"
                          />
                        </VStack>

                        {/* Allowed Ports */}
                        <VStack gap={3} className="mt-4">
                          <h4 className="text-label-lg text-[var(--color-text-default)]">
                            Allowed Ports
                          </h4>

                          <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-3">
                            <HStack gap={4}>
                              <VStack gap={2} className="flex-1">
                                <label className="text-label-lg text-[var(--color-text-default)]">
                                  Port
                                </label>
                                <Input
                                  value={selectedRuleData.allowedPorts[0]?.port || '8080'}
                                  onChange={() => {}}
                                  size="md"
                                  fullWidth
                                />
                              </VStack>
                              <VStack gap={2} className="flex-1">
                                <label className="text-label-lg text-[var(--color-text-default)]">
                                  Protocol
                                </label>
                                <Select
                                  options={protocolOptions}
                                  value={selectedRuleData.allowedPorts[0]?.protocol || 'TCP'}
                                  onChange={() => {}}
                                  size="md"
                                  fullWidth
                                />
                              </VStack>
                            </HStack>
                          </div>
                        </VStack>
                      </VStack>
                    ) : (
                      <p className="text-body-md text-[var(--color-text-subtle)]">
                        No rule selected. Click on a rule or add a new one.
                      </p>
                    )}
                  </div>
                </HStack>
              </div>
            </VStack>
          </TabPanel>

          {/* Egress Rules Tab */}
          <TabPanel value="egress-rules">
            <VStack gap={4}>
              <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                Egress Rules
              </h3>

              <div className="w-full border border-[var(--color-border-default)] rounded-[8px] overflow-hidden">
                <HStack gap={0} className="h-full">
                  {/* Rules List (Left Panel) */}
                  <div className="w-[100px] border-r border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                    <VStack gap={0}>
                      {networkPolicyData.egressRules.map((rule) => (
                        <button
                          key={rule.id}
                          className={`w-full px-3 py-2 text-left text-label-sm flex items-center justify-between hover:bg-[var(--color-surface-muted)] ${
                            selectedEgressRule === rule.id
                              ? 'bg-[var(--color-surface-default)] text-[var(--color-action-primary)]'
                              : 'text-[var(--color-text-default)]'
                          }`}
                          onClick={() => setSelectedEgressRule(rule.id)}
                        >
                          <span>{rule.name}</span>
                          {rule.id !== 'egress1' && (
                            <IconX
                              size={12}
                              stroke={1.5}
                              className="text-[var(--color-text-muted)]"
                            />
                          )}
                        </button>
                      ))}
                      <button className="w-full px-3 py-2 text-left text-label-sm text-[var(--color-action-primary)] flex items-center gap-1 hover:bg-[var(--color-surface-muted)]">
                        <IconCirclePlus size={12} stroke={1.5} />
                        Add Rule
                      </button>
                    </VStack>
                  </div>

                  {/* Rule Details (Right Panel) */}
                  <div className="flex-1 p-4">
                    {selectedEgressRuleData ? (
                      <VStack gap={4}>
                        <h4 className="text-label-lg text-[var(--color-text-default)]">Targets</h4>

                        {/* Rule Type */}
                        <VStack gap={2}>
                          <label className="text-label-lg text-[var(--color-text-default)]">
                            Rule type
                          </label>
                          <Select
                            options={ruleTypeOptions}
                            value={selectedEgressRuleData.ruleType}
                            onChange={() => {}}
                            fullWidth
                          />
                        </VStack>

                        {/* Selectors */}
                        <VStack gap={3} className="w-full">
                          {/* Namespace */}
                          <VStack gap={2}>
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Namespace
                            </span>
                            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-3">
                              <VStack gap={2}>
                                <HStack gap={2}>
                                  <div className="flex-1">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Key
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Operator
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Value
                                    </span>
                                  </div>
                                </HStack>
                                <HStack gap={2} align="center">
                                  <div className="flex-1">
                                    <Input
                                      value={
                                        selectedEgressRuleData.namespaceSelectors[0]?.key || 'foo'
                                      }
                                      onChange={() => {}}
                                      size="md"
                                      fullWidth
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Select
                                      options={operatorOptions}
                                      value={
                                        selectedEgressRuleData.namespaceSelectors[0]?.operator ||
                                        'In List'
                                      }
                                      onChange={() => {}}
                                      size="md"
                                      fullWidth
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Input
                                      value={
                                        selectedEgressRuleData.namespaceSelectors[0]?.value || 'bar'
                                      }
                                      onChange={() => {}}
                                      size="md"
                                      fullWidth
                                    />
                                  </div>
                                </HStack>
                              </VStack>
                            </div>
                          </VStack>

                          {/* Pod */}
                          <VStack gap={2}>
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Pod
                            </span>
                            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-3">
                              <VStack gap={2}>
                                <HStack gap={2}>
                                  <div className="flex-1">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Key
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Operator
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Value
                                    </span>
                                  </div>
                                </HStack>
                                <HStack gap={2} align="center">
                                  <div className="flex-1">
                                    <Input
                                      value={selectedEgressRuleData.podSelectors[0]?.key || 'foo'}
                                      onChange={() => {}}
                                      size="md"
                                      fullWidth
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Select
                                      options={operatorOptions}
                                      value={
                                        selectedEgressRuleData.podSelectors[0]?.operator ||
                                        'In List'
                                      }
                                      onChange={() => {}}
                                      size="md"
                                      fullWidth
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Input
                                      value={selectedEgressRuleData.podSelectors[0]?.value || 'bar'}
                                      onChange={() => {}}
                                      size="md"
                                      fullWidth
                                    />
                                  </div>
                                </HStack>
                              </VStack>
                            </div>
                          </VStack>
                        </VStack>

                        {/* Matching Pods */}
                        <VStack gap={3} className="mt-4">
                          <h4 className="text-label-lg text-[var(--color-text-default)]">
                            Matching Pods ({networkPolicyData.matchingPods.length}/10)
                          </h4>

                          <Pagination
                            currentPage={egressMatchingPodsPage}
                            totalPages={totalMatchingPodsPages}
                            onPageChange={setEgressMatchingPodsPage}
                            totalItems={networkPolicyData.matchingPods.length}
                            showSettings
                          />

                          <Table<MatchingPod>
                            columns={matchingPodsColumns}
                            data={paginatedMatchingPods}
                            rowKey="name"
                          />
                        </VStack>

                        {/* Allowed Ports */}
                        <VStack gap={3} className="mt-4">
                          <h4 className="text-label-lg text-[var(--color-text-default)]">
                            Allowed Ports
                          </h4>

                          <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-3">
                            <HStack gap={4}>
                              <VStack gap={2} className="flex-1">
                                <label className="text-label-lg text-[var(--color-text-default)]">
                                  Port
                                </label>
                                <Input
                                  value={selectedEgressRuleData.allowedPorts[0]?.port || '53'}
                                  onChange={() => {}}
                                  size="md"
                                  fullWidth
                                />
                              </VStack>
                              <VStack gap={2} className="flex-1">
                                <label className="text-label-lg text-[var(--color-text-default)]">
                                  Protocol
                                </label>
                                <Select
                                  options={protocolOptions}
                                  value={selectedEgressRuleData.allowedPorts[0]?.protocol || 'UDP'}
                                  onChange={() => {}}
                                  size="md"
                                  fullWidth
                                />
                              </VStack>
                            </HStack>
                          </div>
                        </VStack>
                      </VStack>
                    ) : (
                      <p className="text-body-md text-[var(--color-text-subtle)]">
                        No rule selected. Click on a rule or add a new one.
                      </p>
                    )}
                  </div>
                </HStack>
              </div>
            </VStack>
          </TabPanel>

          {/* Selectors Tab */}
          <TabPanel value="selectors">
            <div className="w-full border border-[var(--color-border-default)] rounded-[6px] p-4">
              <VStack gap={6}>
                {/* Selectors Section */}
                <VStack gap={2} className="w-full">
                  <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                    Selectors
                  </h3>

                  {/* Bordered Container for Selectors */}
                  <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                    <VStack gap={2}>
                      {/* Column Headers */}
                      <HStack gap={2} className="w-full">
                        <div className="flex-1">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Key
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Operator
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Value
                          </span>
                        </div>
                      </HStack>

                      {/* Selector Rows */}
                      {Object.entries(networkPolicyData.podSelector).length > 0 ? (
                        Object.entries(networkPolicyData.podSelector).map(([key, value]) => (
                          <HStack key={key} gap={2} className="w-full">
                            <div className="flex-1">
                              <Input
                                value={key}
                                onChange={() => {}}
                                size="md"
                                fullWidth
                                disabled
                                className="bg-[var(--color-surface-muted)]"
                              />
                            </div>
                            <div className="flex-1">
                              <Select
                                options={operatorOptions}
                                value="In List"
                                onChange={() => {}}
                                size="md"
                                fullWidth
                                disabled
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                value={value}
                                onChange={() => {}}
                                size="md"
                                fullWidth
                                disabled
                                className="bg-[var(--color-surface-muted)]"
                              />
                            </div>
                          </HStack>
                        ))
                      ) : (
                        <p className="text-body-md text-[var(--color-text-subtle)]">
                          No selectors configured.
                        </p>
                      )}
                    </VStack>
                  </div>
                </VStack>

                {/* Matching Pods Section */}
                <VStack gap={3}>
                  <span className="text-label-lg text-[var(--color-text-default)]">
                    Matching Pods ({networkPolicyData.matchingPods.length}/10)
                  </span>

                  <Pagination
                    currentPage={matchingPodsPage}
                    totalPages={totalMatchingPodsPages}
                    onPageChange={setMatchingPodsPage}
                    totalItems={networkPolicyData.matchingPods.length}
                    showSettings
                  />

                  <Table<MatchingPod>
                    columns={matchingPodsColumns}
                    data={paginatedMatchingPods}
                    rowKey="name"
                  />
                </VStack>
              </VStack>
            </div>
          </TabPanel>

          {/* Labels & Annotations Tab */}
          <TabPanel value="labels-annotations">
            <div className="w-full border border-[var(--color-border-default)] rounded-[8px] p-4">
              <VStack gap={6}>
                {/* Section Title */}
                <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                  Labels & Annotations
                </h3>

                {/* Labels */}
                <VStack gap={2} className="w-full">
                  <h4 className="text-label-lg text-[var(--color-text-default)]">Labels</h4>
                  <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                    <VStack gap={2}>
                      {/* Column Headers */}
                      <HStack gap={2} className="w-full">
                        <div className="flex-1">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Key
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Value
                          </span>
                        </div>
                      </HStack>
                      {/* Label Rows */}
                      {labelsCount > 0 ? (
                        Object.entries(networkPolicyData.labels).map(([key, value]) => (
                          <HStack key={key} gap={2} className="w-full">
                            <div className="flex-1">
                              <Input value={key} onChange={() => {}} size="md" fullWidth disabled />
                            </div>
                            <div className="flex-1">
                              <Input
                                value={value}
                                onChange={() => {}}
                                size="md"
                                fullWidth
                                disabled
                              />
                            </div>
                          </HStack>
                        ))
                      ) : (
                        <p className="text-body-md text-[var(--color-text-subtle)]">
                          No labels configured.
                        </p>
                      )}
                    </VStack>
                  </div>
                </VStack>

                {/* Annotations */}
                <VStack gap={2} className="w-full">
                  <h4 className="text-label-lg text-[var(--color-text-default)]">Annotations</h4>
                  <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                    <VStack gap={2}>
                      {/* Column Headers */}
                      <HStack gap={2} className="w-full">
                        <div className="flex-1">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Key
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Value
                          </span>
                        </div>
                      </HStack>
                      {/* Annotation Rows */}
                      {annotationsCount > 0 ? (
                        Object.entries(networkPolicyData.annotations).map(([key, value]) => (
                          <HStack key={key} gap={2} className="w-full">
                            <div className="flex-1">
                              <Input value={key} onChange={() => {}} size="md" fullWidth disabled />
                            </div>
                            <div className="flex-1">
                              <Input
                                value={value}
                                onChange={() => {}}
                                size="md"
                                fullWidth
                                disabled
                              />
                            </div>
                          </HStack>
                        ))
                      ) : (
                        <p className="text-body-md text-[var(--color-text-subtle)]">
                          No annotations configured.
                        </p>
                      )}
                    </VStack>
                  </div>
                </VStack>
              </VStack>
            </div>
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}
