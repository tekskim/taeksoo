import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Pagination,
  Button,
  ContextMenu,
  DetailHeader,
  Chip,
  SectionCard,
  type TableColumn,
  type ContextMenuItem,
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
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface HPAData {
  id: string;
  name: string;
  status: 'Active' | 'Pending' | 'Error';
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
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockHPAData: Record<string, HPAData> = {
  '1': {
    id: '1',
    name: 'php-apache-hpa',
    status: 'Active',
    namespace: 'default',
    targetReference: 'php-apache',
    createdAt: '2025-07-25 09:12:20',
    minReplicas: 1,
    maxReplicas: 10,
    currentReplicas: 1,
    lastScaleTime: '2025-07-25 09:12:20',
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
    status: 'Active',
    namespace: 'kube-system',
    targetReference: 'nginx-deployment',
    createdAt: '2025-11-08 09:30:00',
    minReplicas: 2,
    maxReplicas: 20,
    currentReplicas: 5,
    lastScaleTime: '2025-11-08 10:00:00',
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
    updated: '2025-11-10 12:57',
  },
  {
    id: '2',
    condition: 'ScalingActive',
    status: 'True',
    message: '[ValidMetricFound] the HPA was able to successfully calculate a replica count',
    updated: '2025-11-10 12:55',
  },
  {
    id: '3',
    condition: 'ScalingLimited',
    status: 'False',
    message: '[DesiredWithinRange] the desired count is within the acceptable range',
    updated: '2025-11-10 12:50',
  },
];

/* ----------------------------------------
   Metrics Tab
   ---------------------------------------- */

function MetricsTab() {
  return (
    <VStack gap={3}>
      <HStack gap={3} className="w-full items-stretch">
        {/* Metric Card */}
        <SectionCard className="flex-1">
          <SectionCard.Header title="Metric" />
          <SectionCard.Content>
            <SectionCard.DataRow label="Source" value={mockMetricData.source} showDivider={false} />
            <SectionCard.DataRow label="Name" value={mockMetricData.name} />
            <SectionCard.DataRow label="Target Name" value={mockMetricData.targetType} />
            <SectionCard.DataRow label="Value" value={mockMetricData.value} />
            <SectionCard.DataRow
              label="Referent API Version"
              value={mockMetricData.referentApiVersion}
            />
            <SectionCard.DataRow label="Referent Kind" value={mockMetricData.referentKind} />
            <SectionCard.DataRow label="Referent Name" value={mockMetricData.referentName} />
          </SectionCard.Content>
        </SectionCard>

        {/* Current Metrics Card */}
        <SectionCard className="flex-1">
          <SectionCard.Header title="Current Metrics" />
          <SectionCard.Content>
            <span className="text-[12px] font-normal leading-[16px] text-[var(--color-text-default)]">
              No Current Metrics
            </span>
          </SectionCard.Content>
        </SectionCard>
      </HStack>
    </VStack>
  );
}

/* ----------------------------------------
   Behavior Tab
   ---------------------------------------- */

function BehaviorTab() {
  return (
    <VStack gap={3}>
      <HStack gap={3} className="w-full items-stretch">
        {/* Scale down behavior Card */}
        <SectionCard className="flex-1">
          <SectionCard.Header title="Scale down behavior" />
          <SectionCard.Content>
            <SectionCard.DataRow label="Policies" showDivider={false}>
              {mockScaleDownBehavior.policies.map((p, i) => (
                <div key={i}>{p}</div>
              ))}
            </SectionCard.DataRow>
            <SectionCard.DataRow label="Select Policy" value={mockScaleDownBehavior.selectPolicy} />
            <SectionCard.DataRow
              label="Stabilization window seconds"
              value={mockScaleDownBehavior.stabilizationWindowSeconds}
            />
          </SectionCard.Content>
        </SectionCard>

        {/* Scale up behavior Card */}
        <SectionCard className="flex-1">
          <SectionCard.Header title="Scale up behavior" />
          <SectionCard.Content>
            <SectionCard.DataRow label="Policies" showDivider={false}>
              {mockScaleUpBehavior.policies.map((p, i) => (
                <div key={i}>{p}</div>
              ))}
            </SectionCard.DataRow>
            <SectionCard.DataRow label="Select Policy" value={mockScaleUpBehavior.selectPolicy} />
            <SectionCard.DataRow
              label="Stabilization window seconds"
              value={mockScaleUpBehavior.stabilizationWindowSeconds}
            />
          </SectionCard.Content>
        </SectionCard>
      </HStack>
    </VStack>
  );
}

/* ----------------------------------------
   Conditions Tab
   ---------------------------------------- */

function ConditionsTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const conditions = mockConditionsData;

  const columns: TableColumn<ConditionRow>[] = [
    { key: 'condition', label: 'Condition', flex: 1, minWidth: columnMinWidths.condition, sortable: true },
    { key: 'status', label: 'Status', flex: 1, minWidth: columnMinWidths.conditionStatus, sortable: true },
    {
      key: 'message',
      label: 'Message',
      flex: 1,
      minWidth: columnMinWidths.message,
      sortable: true,
      render: (value) => (
        <span className="truncate" title={value}>
          {value}
        </span>
      ),
    },
    { key: 'updated', label: 'Updated', flex: 1, minWidth: columnMinWidths.updatedAt, sortable: true },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-[16px] font-semibold leading-[24px] text-[var(--color-text-default)]">
        Conditions
      </h3>
      <Pagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        totalItems={conditions.length}
      />
      <Table columns={columns} data={conditions} rowKey="id" />
    </VStack>
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export function ContainerHPADetailPage() {
  const { hpaId } = useParams<{ hpaId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('metrics');

  // Get HPA data
  const hpa = mockHPAData[hpaId || ''] || mockHPAData['1'];

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel(`HPA: ${hpa.name}`);
  }, [updateActiveTabLabel, hpa.name]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Shell Panel state
  const shellPanel = useShellPanel();

  // Handle opening shell tab in new browser tab
  const handleOpenInNewTab = (tab: ShellTab) => {
    console.log('Open in new tab:', tab);
  };

  const getStatusType = (status: string): 'active' | 'pending' | 'error' => {
    switch (status) {
      case 'Active':
        return 'active';
      case 'Pending':
        return 'pending';
      case 'Error':
        return 'error';
      default:
        return 'active';
    }
  };

  // Context menu items for More Actions
  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'edit-config',
      label: 'Edit Config',
      onClick: () => navigate(`/container/hpa/${hpa.id}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/hpa/${hpa.name}/edit-yaml`),
    },
    {
      id: 'download-yaml',
      label: 'Download YAML',
      onClick: () => console.log('Download YAML'),
    },
    {
      id: 'delete',
      label: 'Delete',
      onClick: () => console.log('Delete'),
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabReorder={moveTab}
          onTabAdd={addNewTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Horizontal Pod Autoscalers', href: '/container/hpa' },
                { label: hpa.name },
              ]}
            />
          }
          actions={
            <>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconTerminal2 size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
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

        {/* Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={6}>
              {/* Detail Header */}
              <DetailHeader>
                <DetailHeader.Title>Horizontal Pod Autoscaler: {hpa.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <ContextMenu items={moreActionsItems} trigger="click" align="left">
                    <Button
                      variant="secondary"
                      size="md"
                      rightIcon={<IconChevronDown size={16} stroke={1.5} />}
                    >
                      More Actions
                    </Button>
                  </ContextMenu>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Status"
                    value={hpa.status}
                    status={getStatusType(hpa.status)}
                  />
                  <DetailHeader.InfoCard label="Namespace" value={hpa.namespace} copyable />
                  <DetailHeader.InfoCard label="Target Reference" value={hpa.targetReference} />
                  <DetailHeader.InfoCard label="Created At" value={hpa.createdAt} />
                </DetailHeader.InfoGrid>

                {/* Second row: Labels, Annotations */}
                <HStack gap={3} className="w-full mt-3">
                  <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
                    <VStack gap={2}>
                      <span className="text-[11px] font-medium text-[var(--color-text-subtle)] leading-4">
                        Labels ({Object.keys(hpa.labels).length})
                      </span>
                      <div className="flex flex-wrap items-center gap-1 min-w-0 w-full">
                        {Object.entries(hpa.labels)
                          .slice(0, 1)
                          .map(([key, val]) => (
                            <Chip key={key} value={`${key}: ${val}`} maxWidth="100%" />
                          ))}
                        {Object.keys(hpa.labels).length > 1 && (
                          <span className="text-[11px] text-[var(--color-text-default)] cursor-pointer hover:underline">
                            (+{Object.keys(hpa.labels).length - 1})
                          </span>
                        )}
                      </div>
                    </VStack>
                  </div>
                  <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
                    <VStack gap={2}>
                      <span className="text-[11px] font-medium text-[var(--color-text-subtle)] leading-4">
                        Annotations ({Object.keys(hpa.annotations).length})
                      </span>
                      <div className="flex flex-wrap items-center gap-1 min-w-0 w-full">
                        {Object.entries(hpa.annotations)
                          .slice(0, 1)
                          .map(([key, val]) => (
                            <Chip key={key} value={`${key}: ${val}`} maxWidth="100%" />
                          ))}
                        {Object.keys(hpa.annotations).length > 1 && (
                          <span className="text-[11px] text-[var(--color-text-default)] cursor-pointer hover:underline">
                            (+{Object.keys(hpa.annotations).length - 1})
                          </span>
                        )}
                      </div>
                    </VStack>
                  </div>
                </HStack>
              </DetailHeader>

              {/* Tabs */}
              <Tabs value={activeTab} onChange={setActiveTab}>
                <TabList>
                  <Tab value="metrics">Metrics</Tab>
                  <Tab value="behavior">Behavior</Tab>
                  <Tab value="conditions">Conditions</Tab>
                </TabList>

                <TabPanel value="metrics">
                  <MetricsTab />
                </TabPanel>
                <TabPanel value="behavior">
                  <BehaviorTab />
                </TabPanel>
                <TabPanel value="conditions">
                  <ConditionsTab />
                </TabPanel>
              </Tabs>
            </VStack>
          </div>
        </div>
      </main>

      {/* Shell Panel */}
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
    </div>
  );
}

export default ContainerHPADetailPage;
