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
import { IconTrash, IconTable, IconDotsVertical } from '@tabler/icons-react';

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

const CAPSULE_TABS = ['Feature importance', 'Dependence', 'Local SHAP', 'Interaction', 'Drift'];

const FEATURE_IMPORTANCE_DATA = [
  { name: 'ExitRates', value: 0.6844 },
  { name: 'ProductRelated_Duration', value: 0.26 },
  { name: 'TrafficType', value: 0.1 },
  { name: 'BounceRates', value: 0.05 },
  { name: 'Region', value: 0.02 },
  { name: 'Informational', value: 0.015 },
  { name: 'OperatingSystems', value: 0.012 },
  { name: 'Administrative_Duration', value: 0.01 },
  { name: 'Month_May', value: 0.008 },
  { name: 'Informational_Duration', value: 0.007 },
  { name: 'PageValues', value: 0.005 },
  { name: 'Month_Nov', value: 0.004 },
  { name: 'Browser', value: 0.003 },
  { name: 'Month_Feb', value: 0.002 },
  { name: 'Month_Jul', value: 0.001 },
];

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
      <div className="flex flex-col gap-1.5">
        <span className="text-label-sm text-[var(--color-text-subtle)]">{label}</span>
        <span className="text-body-md text-[var(--color-text-default)]">{value}</span>
      </div>
      <StatusIndicator status={status} layout="icon-only" />
    </div>
  );
}

function FeatureImportanceChart() {
  const maxValue = FEATURE_IMPORTANCE_DATA[0].value;
  return (
    <div className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden">
      <div className="px-6 pt-5 pb-4">
        <h4 className="text-heading-h6 text-[var(--color-text-default)]">Feature Importance</h4>
      </div>
      <div className="px-6 pb-5">
        <div className="flex flex-col gap-1.5">
          {FEATURE_IMPORTANCE_DATA.map((item) => (
            <div key={item.name} className="flex items-center gap-3 h-[22px]">
              <span className="text-body-md text-[var(--color-text-default)] w-[180px] text-right shrink-0 truncate">
                {item.name}
              </span>
              <div className="flex-1 h-[14px] relative">
                <div
                  className="absolute top-0 left-0 h-full rounded-sm bg-[var(--color-action-primary)]"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="w-[180px] shrink-0" />
          <div className="flex-1 flex justify-between">
            <span className="text-body-sm text-[var(--color-text-subtle)]">0</span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">0.2</span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">0.4</span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">0.6</span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              {maxValue.toFixed(16).replace(/0+$/, '')}
            </span>
          </div>
        </div>
      </div>
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
      render: (_value: unknown, row: TabularExperiment) => (
        <StatusIndicator status={row.status} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (_value: unknown, row: TabularExperiment) => (
        <button
          className="text-label-md text-[var(--color-action-primary)] hover:underline text-left"
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
      render: (_value: unknown, row: TabularExperiment) =>
        row.progress < 100 ? (
          <div className="flex flex-col gap-2">
            <span className="text-body-md text-[var(--color-text-default)]">{row.progress}%</span>
            <ProgressBar value={row.progress} className="w-full" />
          </div>
        ) : (
          <span className="text-body-md text-[var(--color-text-default)]">100%</span>
        ),
    },
    {
      key: 'action',
      header: 'Action',
      width: 72,
      align: 'center' as const,
      render: (_value: unknown, row: TabularExperiment) => (
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
          <HStack gap={1}>
            <Button variant="secondary" size="md">
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
    <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] bg-[var(--color-surface-default)] pt-3 pb-4 px-4">
      <VStack gap={4}>
        <VStack gap={1}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)]">
            {selectedExperiment.name}
          </h2>
          <span className="text-body-md text-[var(--color-text-subtle)]">Description</span>
        </VStack>

        <div className="flex gap-2">
          {[
            { label: 'Category', value: 'E-Commerce > Price Elasticity' },
            { label: 'Best Score', value: '90.1%' },
            { label: 'Models Trained', value: '4' },
            { label: 'Stability', value: '0.01' },
            { label: 'Risk level', value: 'Low' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-1 flex-col gap-1.5 rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] px-4 py-3"
            >
              <span className="text-label-sm text-[var(--color-text-subtle)]">{item.label}</span>
              <span className="text-body-md text-[var(--color-text-default)]">{item.value}</span>
            </div>
          ))}
        </div>
      </VStack>

      <div className="flex flex-col gap-3 mt-4">
        <Tabs value={detailTab} onChange={setDetailTab} variant="underline" size="sm">
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="model-insights">Model Insights</Tab>
            <Tab value="performance">Performance</Tab>
            <Tab value="risk">Risk & Quality</Tab>
          </TabList>

          <TabPanel value="overview" className="pt-0">
            <VStack gap={3} className="pt-3">
              <VStack gap={1}>
                <span className="text-heading-h6 text-[var(--color-text-default)]">Overview</span>
                <span className="text-body-md text-[var(--color-text-subtle)]">
                  Compare performance of trained models.
                </span>
              </VStack>
              <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={2} />
              <Table columns={detailColumns} data={MOCK_DETAIL_MODELS} rowKey="id" />
            </VStack>
          </TabPanel>

          <TabPanel value="model-insights" className="pt-0">
            <VStack gap={4} className="pt-3">
              <div className="flex gap-2">
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
                  Model leaderboard
                </span>
                <span className="text-body-md text-[var(--color-text-subtle)]">
                  View SHAP-based feature importance.
                </span>
              </VStack>
              <FeatureImportanceChart />
            </VStack>
          </TabPanel>

          <TabPanel value="performance" className="pt-0">
            <VStack gap={3} className="pt-3">
              <EmptyState
                variant="inline"
                icon={<IconTable size={48} stroke={1} />}
                title="Performance"
                description="Performance metrics and charts will be displayed here."
              />
            </VStack>
          </TabPanel>

          <TabPanel value="risk" className="pt-0">
            <VStack gap={3} className="pt-3">
              <EmptyState
                variant="inline"
                icon={<IconTable size={48} stroke={1} />}
                title="Risk & Quality"
                description="Risk assessment and quality metrics will be displayed here."
              />
            </VStack>
          </TabPanel>
        </Tabs>
      </div>
    </div>
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
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      {selectedExperiment ? detailView : listView}
    </PageShell>
  );
}
