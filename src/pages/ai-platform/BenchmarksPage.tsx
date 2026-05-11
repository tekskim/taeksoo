import { useState, useEffect, useMemo } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  PageHeader,
  EmptyState,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Table,
  type TableColumn,
  Pagination,
  SearchInput,
  StatusIndicator,
  ContextMenu,
  type ContextMenuItem,
  MetricCard,
  Drawer,
  FormField,
  Input,
  InlineMessage,
  InfoBox,
  fixedColumns,
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import {
  IconChartBar,
  IconTrash,
  IconDotsCircleHorizontal,
  IconDownload,
  IconCopy,
} from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';
import { chartColors, primaryChartColors } from '@/pages/design-system-sections/ChartComponents';

/* ——— types ——— */

type BenchmarkStatus = 'completed' | 'failed' | 'running' | 'pending';

interface BenchmarkRow {
  id: string;
  status: BenchmarkStatus;
  name: string;
  model: string;
  benchmark: string;
  score: string;
  startedAt: string;
  completedAt: string;
}

interface LeaderboardRow {
  id: string;
  rank: number;
  name: string;
  duration: string;
  score: string;
  metric: string;
}

interface TaskRow {
  id: string;
  name: string;
  category: string;
  score: string;
}

/* ——— mock data ——— */

const MOCK_BENCHMARKS: BenchmarkRow[] = [
  {
    id: 'b1',
    status: 'completed',
    name: 'Qwen/Qwen3-Embedding-8B Benchmark',
    model: 'Qwen/Qwen3-Embedding-8B',
    benchmark: 'Full Benchmark',
    score: '00.0%',
    startedAt: 'Nov 11, 2025, 2:51 PM',
    completedAt: 'Nov 11, 2025, 2:51 PM',
  },
  {
    id: 'b2',
    status: 'failed',
    name: 'Qwen/Qwen3-Embedding-8B Benchmark',
    model: 'Qwen/Qwen3-Embedding-8B',
    benchmark: 'Full Benchmark',
    score: '-',
    startedAt: 'Nov 11, 2025, 2:51 PM',
    completedAt: 'Nov 11, 2025, 2:51 PM',
  },
  {
    id: 'b3',
    status: 'failed',
    name: 'Qwen/Qwen3-Embedding-8B Benchmark',
    model: 'Qwen/Qwen3-Embedding-8B',
    benchmark: 'Full Benchmark',
    score: '-',
    startedAt: 'Nov 11, 2025, 2:51 PM',
    completedAt: 'Nov 11, 2025, 2:51 PM',
  },
  {
    id: 'b4',
    status: 'pending',
    name: 'Qwen/Qwen3-Embedding-8B Benchmark',
    model: 'Qwen/Qwen3-Embedding-8B',
    benchmark: 'Full Benchmark',
    score: '-',
    startedAt: 'Nov 11, 2025, 2:51 PM',
    completedAt: 'Nov 11, 2025, 2:51 PM',
  },
];

const MOCK_LEADERBOARD: LeaderboardRow[] = [
  { id: 'l1', rank: 1, name: 'XGBoost', duration: '0s', score: '90.1%', metric: 'Lable' },
  { id: 'l2', rank: 2, name: 'XGBoost', duration: '40s', score: '89%', metric: 'mse' },
];

const MOCK_CHART_DATA = [
  { name: 'gpt-4o', value: 91.3 },
  { name: 'claude-3.5-so...', value: 90.1 },
  { name: 'Qwen2.5-72B-I...', value: 89.2 },
  { name: 'DeepSeek-V3', value: 87.6 },
  { name: 'Llama-31-70B...', value: 85.6 },
  { name: 'Mistral-Large...', value: 83.1 },
  { name: 'gemma-2-27b-it', value: 79.9 },
];

const MOCK_TASKS: TaskRow[] = Array.from({ length: 10 }, (_, i) => ({
  id: `t${i + 1}`,
  name: 'Name',
  category: 'Lable',
  score: '00.0',
}));

const MOCK_LOG = `[오후 04:47:49] === Running MMLU ===
[오후 04:47:49] missing _msg field; see https://docs.victoriametrics.com/victorialogs/keyconcepts/#message-field
[오후 04:47:49] =======================================
[오후 04:47:49] Results Path: /data/tkai-data/orgs/c0000000-0000-0000-000000000001/projects/f0000000-0000-0000-0000-000000000001/benchmark-results/a146733f379b
[오후 04:47:49] Tasks: mbpp_plus, humaneval_plus, gpqa_main_cot_n_shot, hendrycks_math_cot_n_shot, mbpp, mmlu, mmlu_pro, humaneval
[오후 04:47:49] Run ID: a146733f379b
[오후 04:47:49] Endpoint Type: serverless-vllm
[오후 04:47:49] Model URL: http://qwen3-embedding-8b2.project-f0000000-0000-0000-0000-000000000001.svc.cluster.local:8000
[오후 04:47:49] Model Name: Qwen/Qwen3-Embedding-8B
[오후 04:47:49] =======================================
[오후 04:47:49] === BENCHMARK START ===
[오후 04:47:49] =======================================
[오후 04:47:59] 2026-01-30:07:47:59 WARNING [__main__:369] --limit SHOULD ONLY BE USED FOR TESTING.REAL METRICS SHOULD NOT BE COMPUTED USING LIMIT.
[오후 04:47:59] 2026-01-30:07:47:59 INFO [__main__:450] Selected Tasks: ['mmlu']
[오후 04:47:59] 'http://qwen3-embedding-8b2.project-f0000000-0000-0000-0000-000000000001.svc.cluster.local:8000/v1/completions'`;

const STATUS_MAP: Record<BenchmarkStatus, 'active' | 'error' | 'muted' | 'building'> = {
  completed: 'active',
  failed: 'error',
  running: 'building',
  pending: 'muted',
};

/* ——— Dashboard Tab ——— */

function DashboardTab({ hasData }: { hasData: boolean }) {
  if (!hasData) {
    return (
      <EmptyState
        variant="card"
        icon={<IconChartBar size={48} stroke={1} />}
        title="No benchmark results yet"
        description="Results will appear here when benchmarks are run."
      />
    );
  }

  const leaderboardColumns: TableColumn<LeaderboardRow>[] = [
    {
      key: 'rank',
      header: 'Status',
      width: 59,
      align: 'center',
      render: (row) => <span className="text-body-md">{row.rank}</span>,
    },
    { key: 'name', header: 'Name', minWidth: 200, sortable: true },
    { key: 'duration', header: '[Lable]', minWidth: 200 },
    { key: 'score', header: '[Lable]', minWidth: 200, sortable: true },
    { key: 'metric', header: 'Lable', minWidth: 200 },
  ];

  const barOption = {
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
    },
    grid: { left: 40, right: 20, top: 30, bottom: 40 },
    xAxis: {
      type: 'category' as const,
      data: MOCK_CHART_DATA.map((d) => d.name),
      axisLabel: { color: chartColors.slate400, fontSize: 10, rotate: 0 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: chartColors.slate100 } },
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: 100,
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
        formatter: (v: number) => `${v}%`,
      },
      splitLine: { lineStyle: { color: chartColors.slate100, opacity: 0.5 } },
    },
    series: [
      {
        type: 'bar' as const,
        data: MOCK_CHART_DATA.map((d) => d.value),
        barWidth: 60,
        itemStyle: { color: primaryChartColors[0], borderRadius: [4, 4, 0, 0] },
        label: {
          show: true,
          position: 'top' as const,
          color: chartColors.slate400,
          fontSize: 10,
          formatter: (p: { value: number }) => `${p.value}%`,
        },
      },
    ],
  };

  return (
    <VStack gap={4}>
      <HStack className="w-full items-center justify-between">
        <span className="text-heading-h5 text-[var(--color-text-default)]">Dashboard</span>
        <Button variant="secondary" size="sm">
          Refresh
        </Button>
      </HStack>

      <MetricCard.Group>
        <MetricCard title="Highest Score" value="87.5%" />
        <MetricCard title="Average Score" value="87.8%" />
        <MetricCard title="Registered Models" value="7" />
      </MetricCard.Group>

      <div className="w-full h-[300px] bg-white border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
        <ReactECharts option={barOption} style={{ height: 280 }} />
      </div>

      <span className="text-heading-h5 text-[var(--color-text-default)]">Model Leaderboard</span>

      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={3} />

      <Table
        columns={leaderboardColumns}
        data={MOCK_LEADERBOARD}
        rowKey="id"
        emptyMessage="No leaderboard data"
      />
    </VStack>
  );
}

/* ——— Run Tab ——— */

function RunTab({
  onNewBenchmark,
  onViewLog,
  onViewResult,
}: {
  onNewBenchmark: () => void;
  onViewLog: (row: BenchmarkRow) => void;
  onViewResult: (row: BenchmarkRow) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_BENCHMARKS;
    const q = searchQuery.toLowerCase();
    return MOCK_BENCHMARKS.filter(
      (b) => b.name.toLowerCase().includes(q) || b.model.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const getRowActions = (row: BenchmarkRow): ContextMenuItem[] => [
    { id: 'view-result', label: 'View result', onClick: () => onViewResult(row) },
    { id: 'view-log', label: 'View log', onClick: () => onViewLog(row) },
    { id: 'delete', label: 'Delete', status: 'danger' as const, divider: true, onClick: () => {} },
  ];

  const columns: TableColumn<BenchmarkRow>[] = [
    {
      ...fixedColumns.status,
      key: 'status',
      header: 'Status',
      render: (row) => <StatusIndicator status={STATUS_MAP[row.status]} />,
    },
    { key: 'name', header: 'Name', minWidth: 200 },
    { key: 'model', header: 'Model', minWidth: 180 },
    { key: 'benchmark', header: 'Benchmark', minWidth: 120 },
    { key: 'score', header: 'Score', minWidth: 80 },
    { key: 'startedAt', header: 'Started at', minWidth: 160, sortable: true },
    { key: 'completedAt', header: 'Completed at', minWidth: 160, sortable: true },
    {
      ...fixedColumns.actions,
      key: 'actions',
      header: 'Action',
      render: (row) => (
        <ContextMenu items={getRowActions(row)} trigger="click">
          <button
            className="p-1 rounded hover:bg-[var(--color-surface-hover)]"
            aria-label="Actions"
          >
            <IconDotsCircleHorizontal
              size={16}
              stroke={1.5}
              className="text-[var(--color-text-muted)]"
            />
          </button>
        </ContextMenu>
      ),
    },
  ];

  return (
    <VStack gap={3}>
      <HStack className="w-full items-center justify-between">
        <span className="text-heading-h5 text-[var(--color-text-default)]">Dashboard</span>
        <HStack gap={2}>
          <Button variant="secondary" size="sm">
            Refresh
          </Button>
          <Button variant="primary" size="md" onClick={onNewBenchmark}>
            New benchmark
          </Button>
        </HStack>
      </HStack>

      <div className="flex w-full items-start gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] px-4 py-3">
          <span className="text-label-sm text-[var(--color-text-subtle)]">Highest Score</span>
          <span className="text-body-md text-[var(--color-text-default)] font-medium">87.5%</span>
          <StatusIndicator status="active" layout="icon-only" />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] px-4 py-3">
          <span className="text-label-sm text-[var(--color-text-subtle)]">Failed</span>
          <span className="text-body-md text-[var(--color-text-default)] font-medium">0</span>
          <StatusIndicator status="error" layout="icon-only" />
        </div>
      </div>

      <HStack gap={2} align="center">
        <SearchInput
          placeholder="Find benchmarks with filters"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="sm"
          className="w-[var(--search-input-width)]"
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
        totalItems={filteredData.length}
        selectedCount={selectedItems.length}
      />

      <Table
        columns={columns}
        data={filteredData}
        rowKey="id"
        selectable
        selectedKeys={selectedItems}
        onSelectionChange={setSelectedItems}
        emptyMessage="No benchmarks found"
      />
    </VStack>
  );
}

/* ——— New Benchmark Drawer ——— */

function NewBenchmarkDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [token, setToken] = useState('');

  useEffect(() => {
    if (isOpen) setToken('');
  }, [isOpen]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="New Benchmark Run"
      width={376}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={onClose} className="flex-1">
            Run
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <FormField label="Serverless Endpoint" required>
          <InlineMessage variant="warning">
            No active Serverless endpoints. Please create and start an endpoint in the Serverless
            page first.
          </InlineMessage>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            Select a running Serverless endpoint
          </span>
        </FormField>

        <FormField
          label="HuggingFace Token"
          helperText="A Hugging Face token is required to access gated datasets (e.g., GPQA, HumanEval)."
        >
          <Input
            placeholder="hf_xxxxxxxxxxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            fullWidth
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}

/* ——— Live Log Drawer ——— */

function LiveLogDrawer({
  isOpen,
  onClose,
  benchmarkName,
}: {
  isOpen: boolean;
  onClose: () => void;
  benchmarkName: string;
}) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Live log" width={696}>
      <VStack gap={4}>
        <InfoBox label="Name" value={benchmarkName} />

        <span className="text-body-md text-[var(--color-text-subtle)]">223lines | 23KB</span>

        <div className="w-full rounded-[var(--radius-lg)] bg-[#0f172a] p-4 overflow-auto max-h-[700px]">
          <pre className="text-body-sm text-[#e2e8f0] whitespace-pre-wrap font-mono leading-relaxed">
            {MOCK_LOG}
          </pre>
        </div>
      </VStack>
    </Drawer>
  );
}

/* ——— View Result Drawer ——— */

function ViewResultDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [resultTab, setResultTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);

  const taskColumns: TableColumn<TaskRow>[] = [
    { key: 'name', header: 'Task name', minWidth: 180, sortable: true },
    { key: 'category', header: 'Category', minWidth: 180 },
    { key: 'score', header: 'Score', minWidth: 120 },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="View result" width={696}>
      <VStack gap={4}>
        <HStack className="w-full items-center justify-between">
          <span className="text-body-md text-[var(--color-text-subtle)]">Description</span>
          <Button variant="secondary" size="sm" leftIcon={<IconDownload size={12} />}>
            Download
          </Button>
        </HStack>

        <Tabs value={resultTab} onChange={setResultTab} variant="underline" size="sm">
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="json">Json</Tab>
          </TabList>

          <TabPanel value="overview" className="pt-0">
            <VStack gap={3} className="pt-4">
              <InfoBox label="Overall average" value="{00}" />

              <Pagination
                currentPage={currentPage}
                totalPages={3}
                onPageChange={setCurrentPage}
                totalItems={24}
              />

              <Table
                columns={taskColumns}
                data={MOCK_TASKS}
                rowKey="id"
                emptyMessage="No tasks found"
              />
            </VStack>
          </TabPanel>

          <TabPanel value="json" className="pt-0">
            <VStack gap={3} className="pt-4">
              <HStack className="w-full items-center justify-between">
                <span className="text-heading-h6 text-[var(--color-text-default)]">
                  Results JSON data
                </span>
                <HStack gap={2} align="center">
                  <span className="text-body-md text-[var(--color-text-subtle)]">
                    0,000 characters
                  </span>
                  <Button variant="secondary" size="sm" leftIcon={<IconCopy size={12} />}>
                    Copy
                  </Button>
                </HStack>
              </HStack>
              <div className="w-full min-h-[400px] rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] p-4">
                <pre className="text-body-md text-[var(--color-text-subtle)] font-mono whitespace-pre-wrap">
                  input user data
                </pre>
              </div>
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>
    </Drawer>
  );
}

/* ——— Main Page ——— */

export function BenchmarksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Benchmark');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [hasData] = useState(true);
  const [newBenchmarkOpen, setNewBenchmarkOpen] = useState(false);
  const [liveLogOpen, setLiveLogOpen] = useState(false);
  const [viewResultOpen, setViewResultOpen] = useState(false);
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkRow | null>(null);

  const handleViewLog = (row: BenchmarkRow) => {
    setSelectedBenchmark(row);
    setLiveLogOpen(true);
  };

  const handleViewResult = (row: BenchmarkRow) => {
    setSelectedBenchmark(row);
    setViewResultOpen(true);
  };

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
          breadcrumb={<Breadcrumb items={[{ label: 'MLOps' }, { label: 'Benchmark' }]} />}
          actions={<AiPlatformTopBarActions showSearch />}
        />
      }
      contentClassName="pt-3 px-8 pb-20"
    >
      <VStack gap={3}>
        <PageHeader title="Benchmark" />

        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="dashboard">Dashboard</Tab>
            <Tab value="run">Run</Tab>
          </TabList>

          <TabPanel value="dashboard" className="pt-0">
            <div className="pt-4">
              <DashboardTab hasData={hasData} />
            </div>
          </TabPanel>

          <TabPanel value="run" className="pt-0">
            <div className="pt-4">
              <RunTab
                onNewBenchmark={() => setNewBenchmarkOpen(true)}
                onViewLog={handleViewLog}
                onViewResult={handleViewResult}
              />
            </div>
          </TabPanel>
        </Tabs>
      </VStack>

      <NewBenchmarkDrawer isOpen={newBenchmarkOpen} onClose={() => setNewBenchmarkOpen(false)} />

      <LiveLogDrawer
        isOpen={liveLogOpen}
        onClose={() => setLiveLogOpen(false)}
        benchmarkName={selectedBenchmark?.name ?? ''}
      />

      <ViewResultDrawer isOpen={viewResultOpen} onClose={() => setViewResultOpen(false)} />
    </PageShell>
  );
}

export default BenchmarksPage;
