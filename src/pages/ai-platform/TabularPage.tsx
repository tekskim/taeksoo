import { useState, useMemo } from 'react';
import {
  PageShell,
  PageHeader,
  VStack,
  HStack,
  Button,
  Table,
  Pagination,
  FilterSearchInput,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  InfoBox,
  ProgressBar,
  StatusIndicator,
  EmptyState,
  ContextMenu,
  Breadcrumb,
  TopBar,
  TabBar,
} from '@/design-system';
import type { FilterField, AppliedFilter } from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from '@/pages/ai-platform/AiPlatformTopBarActions';
import { IconRefresh, IconTrash, IconTable, IconDotsVertical } from '@tabler/icons-react';

// --- Types ---

type TabularExperiment = {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building';
  mlTask: string;
  model: string;
  progress: number;
};

type TabularDetailModel = {
  id: string;
  rank: number;
  name: string;
  trainTime: string;
  accuracy: string;
  metric: string;
};

// --- Mock Data ---

const MOCK_EXPERIMENTS: TabularExperiment[] = [
  {
    id: '1',
    name: 'E-Commerce Price Elasticity',
    status: 'building',
    mlTask: 'Classification',
    model: 'XGBoost',
    progress: 75,
  },
  {
    id: '2',
    name: 'Customer Churn Prediction',
    status: 'active',
    mlTask: 'Classification',
    model: 'XGBoost',
    progress: 100,
  },
  {
    id: '3',
    name: 'Fraud Detection Pipeline',
    status: 'active',
    mlTask: 'Classification',
    model: 'XGBoost',
    progress: 100,
  },
];

const MOCK_DETAIL_MODELS: TabularDetailModel[] = [
  { id: '1', rank: 1, name: 'XGBoost', trainTime: '0s', accuracy: '90.1%', metric: 'Label' },
  { id: '2', rank: 2, name: 'XGBoost', trainTime: '40s', accuracy: '88%', metric: 'mse' },
];

const FILTER_FIELDS: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Enter name...' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Completed' },
      { value: 'error', label: 'Failed' },
      { value: 'building', label: 'Running' },
    ],
  },
  {
    id: 'mlTask',
    label: 'ML Task',
    type: 'select',
    options: [
      { value: 'classification', label: 'Classification' },
      { value: 'regression', label: 'Regression' },
    ],
  },
];

const CAPSULE_TABS = ['Feature Importance', 'Dependence', 'Local SHAP', 'Interaction', 'Drift'];

// --- Components ---

function StatCard({
  label,
  value,
  status,
}: {
  label: string;
  value: number;
  status: 'active' | 'error' | 'building';
}) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] px-4 py-3">
      <VStack gap={1}>
        <span className="text-label-sm text-[var(--color-text-subtle)]">{label}</span>
        <span className="text-body-md text-[var(--color-text-default)]">{value}</span>
      </VStack>
      <StatusIndicator status={status} layout="icon-only" />
    </div>
  );
}

// --- Main Page ---

export function TabularPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [selectedExperiment, setSelectedExperiment] = useState<TabularExperiment | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [detailTab, setDetailTab] = useState('overview');
  const [insightTab, setInsightTab] = useState('Feature Importance');

  const filteredExperiments = useMemo(() => {
    let result = MOCK_EXPERIMENTS;
    appliedFilters.forEach((f) => {
      if (f.fieldId === 'name') {
        result = result.filter((e) => e.name.toLowerCase().includes(String(f.value).toLowerCase()));
      }
      if (f.fieldId === 'status') {
        result = result.filter((e) => e.status === f.value);
      }
    });
    return result;
  }, [appliedFilters]);

  const completedCount = MOCK_EXPERIMENTS.filter((e) => e.status === 'active').length;
  const failedCount = MOCK_EXPERIMENTS.filter((e) => e.status === 'error').length;
  const runningCount = MOCK_EXPERIMENTS.filter((e) => e.status === 'building').length;

  // --- List Columns ---

  const listColumns = [
    {
      key: 'status',
      header: 'Status',
      width: 59,
      align: 'center' as const,
      render: (row: TabularExperiment) => (
        <StatusIndicator status={row.status} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (row: TabularExperiment) => (
        <button
          className="text-[var(--color-action-primary)] text-label-md hover:underline text-left"
          onClick={() => setSelectedExperiment(row)}
        >
          {row.name}
        </button>
      ),
    },
    { key: 'mlTask', header: 'ML task' },
    { key: 'model', header: 'Model' },
    {
      key: 'progress',
      header: 'Progress',
      render: (row: TabularExperiment) =>
        row.progress < 100 ? (
          <VStack gap={1}>
            <span className="text-body-md text-[var(--color-text-default)]">{row.progress}%</span>
            <ProgressBar value={row.progress} className="w-full" />
          </VStack>
        ) : (
          <span className="text-body-md text-[var(--color-text-default)]">100%</span>
        ),
    },
    {
      key: 'action',
      header: 'Action',
      width: 72,
      align: 'center' as const,
      render: (row: TabularExperiment) => (
        <ContextMenu
          items={[
            { id: 'view', label: 'View details', onClick: () => setSelectedExperiment(row) },
            { id: 'delete', label: 'Delete', status: 'danger', divider: true, onClick: () => {} },
          ]}
          trigger="click"
        >
          <button className="p-1 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)]">
            <IconDotsVertical size={16} className="text-[var(--color-text-muted)]" />
          </button>
        </ContextMenu>
      ),
    },
  ];

  // --- Detail Columns ---

  const detailColumns = [
    { key: 'rank', header: 'Rank', width: 59, align: 'center' as const },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'trainTime', header: 'Train time' },
    { key: 'accuracy', header: 'Accuracy', sortable: true },
    { key: 'metric', header: 'Metric' },
  ];

  // --- List View ---

  const listView = (
    <VStack gap={3}>
      <PageHeader
        title="Tabular"
        actions={
          <HStack gap={2}>
            <Button variant="secondary" size="md" leftIcon={<IconRefresh size={12} />}>
              Refresh
            </Button>
            <Button variant="primary" size="md">
              Start training
            </Button>
          </HStack>
        }
      />

      <div className="flex gap-2">
        <StatCard label="Completed" value={completedCount} status="active" />
        <StatCard label="Failed" value={failedCount} status="error" />
        <StatCard label="Running" value={runningCount} status="building" />
      </div>

      <HStack gap={2} align="center">
        <FilterSearchInput
          filters={FILTER_FIELDS}
          appliedFilters={appliedFilters}
          onFiltersChange={setAppliedFilters}
          placeholder="Find experiments with filter"
          size="sm"
          className="w-[280px]"
          hideAppliedFilters
        />
        <div className="w-px h-4 bg-[var(--color-border-default)]" />
        <Button
          variant="muted"
          size="sm"
          leftIcon={<IconTrash size={12} />}
          disabled={selectedItems.length === 0}
        >
          Delete
        </Button>
      </HStack>

      <Pagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        totalItems={filteredExperiments.length}
        selectedCount={selectedItems.length}
      />

      {filteredExperiments.length === 0 ? (
        <EmptyState
          icon={<IconTable size={48} stroke={1} />}
          title="No experiments found"
          description="Start your first training to create a tabular experiment."
          action={
            <Button variant="primary" size="md">
              Start training
            </Button>
          }
        />
      ) : (
        <Table
          columns={listColumns}
          data={filteredExperiments}
          rowKey="id"
          selectable
          selectedKeys={selectedItems}
          onSelectionChange={setSelectedItems}
        />
      )}
    </VStack>
  );

  // --- Detail View ---

  const detailView = selectedExperiment && (
    <VStack gap={4}>
      <VStack gap={1}>
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">
          {selectedExperiment.name}
        </h2>
        <span className="text-body-md text-[var(--color-text-subtle)]">Description</span>
      </VStack>

      <InfoBox.Group>
        <InfoBox label="Category" value="E-Commerce > Price Elasticity" />
        <InfoBox label="Best Score" value="90.1%" />
        <InfoBox label="Models Trained" value="4" />
        <InfoBox label="Stability" value="0.01" />
        <InfoBox label="Risk level" value="Low" />
      </InfoBox.Group>

      <Tabs value={detailTab} onChange={setDetailTab} variant="underline" size="sm">
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="model-insights">Model Insights</Tab>
          <Tab value="performance">Performance</Tab>
          <Tab value="risk">Risk & Quality</Tab>
        </TabList>

        <TabPanel value="overview" className="pt-0">
          <VStack gap={3} className="pt-4">
            <VStack gap={1}>
              <span className="text-heading-h6 text-[var(--color-text-default)]">Overview</span>
              <span className="text-body-md text-[var(--color-text-subtle)]">
                Compare performance of trained models
              </span>
            </VStack>
            <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={2} />
            <Table columns={detailColumns} data={MOCK_DETAIL_MODELS} rowKey="id" />
          </VStack>
        </TabPanel>

        <TabPanel value="model-insights" className="pt-0">
          <VStack gap={4} className="pt-4">
            <div className="flex gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-1">
              {CAPSULE_TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setInsightTab(t)}
                  className={`px-2.5 py-1.5 rounded-[var(--radius-md)] text-label-lg transition-colors ${
                    insightTab === t
                      ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)]'
                      : 'text-[var(--color-text-default)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <VStack gap={1}>
              <span className="text-heading-h5 text-[var(--color-text-default)]">
                Model Leaderboard
              </span>
              <span className="text-body-md text-[var(--color-text-subtle)]">
                View SHAP-based feature importance.
              </span>
            </VStack>
            <div className="w-full h-[400px] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] flex items-center justify-center">
              <span className="text-body-md text-[var(--color-text-subtle)]">
                Chart placeholder — {insightTab}
              </span>
            </div>
          </VStack>
        </TabPanel>

        <TabPanel value="performance" className="pt-0">
          <VStack gap={3} className="pt-4">
            <EmptyState
              variant="inline"
              icon={<IconTable size={48} stroke={1} />}
              title="Performance"
              description="Performance metrics and charts will be displayed here."
            />
          </VStack>
        </TabPanel>

        <TabPanel value="risk" className="pt-0">
          <VStack gap={3} className="pt-4">
            <EmptyState
              variant="inline"
              icon={<IconTable size={48} stroke={1} />}
              title="Risk & Quality"
              description="Risk assessment and quality metrics will be displayed here."
            />
          </VStack>
        </TabPanel>
      </Tabs>
    </VStack>
  );

  // --- Breadcrumb ---

  const breadcrumbItems = selectedExperiment
    ? [{ label: 'Tabular', href: '/ai-platform/tabular' }, { label: selectedExperiment.name }]
    : [{ label: 'Tabular' }];

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={[{ id: 'tabular', label: 'Tabular', closable: false }]}
          activeTab="tabular"
          onTabChange={() => {}}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => {
            if (selectedExperiment) setSelectedExperiment(null);
            else window.history.back();
          }}
          onForward={() => window.history.forward()}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          actions={<AiPlatformTopBarActions />}
        />
      }
      contentClassName="pt-3 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      {selectedExperiment ? detailView : listView}
    </PageShell>
  );
}
