import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  PageHeader,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Table,
  SearchInput,
  Pagination,
  SectionCard,
  Drawer,
  InlineMessage,
  ProgressBar,
  Select,
} from '@/design-system';
import ReactECharts from 'echarts-for-react';
import { chartColors, primaryChartColors } from '@/pages/design-system-sections/ChartComponents';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconAlertCircle, IconCopy } from '@tabler/icons-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_CLUSTER_QUEUES = [
  {
    id: '1',
    status: 'active',
    name: 'yunjae-park-kf-profile',
    strategy: 'BestEffortFIFO',
    cohort: 'default-cohort',
    localQueue: 79,
  },
];

const MOCK_LOCAL_QUEUES = [
  {
    id: '1',
    status: 'active',
    name: 'yunjae-park-kf-profile',
    namespace: 'Lable',
    boundTo: 'default-queue > gpu-cluster-queue',
    tier: 'Large',
    pending: 0,
    running: 0,
    completed: 0,
  },
  {
    id: '2',
    status: 'active',
    name: 'yunjae-park-kf-profile',
    namespace: 'Lable',
    boundTo: 'default-queue > gpu-cluster-queue',
    tier: 'Large',
    pending: 0,
    running: 0,
    completed: 0,
  },
];

const MOCK_WORKLOADS = [
  {
    id: '1',
    status: 'active',
    name: 'jobset-cml-da3fb3a3-a0757',
    project: 'project-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx...',
    priority: 'Default',
    queue: 'N/A',
    waitExec: 'Starting',
    cpu: 4,
    memory: '8 GB',
  },
  {
    id: '2',
    status: 'active',
    name: 'jobset-cml-da3fb3a3-a0757',
    project: 'project-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx...',
    priority: 'Training',
    queue: 'default-queue\n> gpu-cluster-queue',
    waitExec: '5s\n5s run',
    cpu: 4,
    memory: '8 GB',
  },
];

const MOCK_SCHEDULER_QUEUES = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  name: 'Lable',
  pods: '172 pods',
  type: 'cluster',
  pending: 0,
  admitted: 0,
  rejected: 0,
  avgQueueTime: '0s',
  admissionRate: '0.00/h',
  fairness: 100,
  expanded: i === 0,
}));

const MOCK_TOP10_NAMESPACES = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  rank: `#${i}`,
  name: 'Title',
  workloadCount: '00',
  percentage: '00%',
}));

const MOCK_QUEUE_PERFORMANCE = [
  { id: '1', name: 'jobset-cml-de3fb3a3-a0757', workloads: 50, avgWait: '0s', success: 4 },
  { id: '2', name: 'jobset-cml-de3fb3a3-a0757', workloads: 50, avgWait: '0s', success: 4 },
  { id: '3', name: 'jobset-cml-de3fb3a3-a0757', workloads: 50, avgWait: '0s', success: 4 },
];

const MOCK_RESOURCE_FLAVORS = [
  {
    id: '1',
    name: 'yunjae-park-kf-profile',
    available: 0,
    total: 16,
    type: 'CPU',
    allocated: 2,
    utilization: 75,
  },
  {
    id: '2',
    name: 'yunjae-park-kf-profile',
    available: 0,
    total: 16,
    type: 'CPU',
    allocated: 2,
    utilization: 75,
  },
  {
    id: '3',
    name: 'yunjae-park-kf-profile',
    available: 0,
    total: 16,
    type: 'CPU',
    allocated: 2,
    utilization: 75,
  },
];

// ─── Overview Tab ────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <VStack gap={4}>
      <HStack justify="between" align="center">
        <span className="text-heading-h5 text-[var(--color-text-default)]">Overview</span>
        <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
          Refresh
        </Button>
      </HStack>

      <InlineMessage variant="success">
        <span className="font-medium">Critical</span> · Low queue efficiency
        <span className="ml-auto text-body-sm text-[var(--color-text-subtle)]">
          Last 24 Hours / Updated: Nov 11 2025 02:51 PM
        </span>
      </InlineMessage>

      {/* Workload Metrics */}
      <SectionCard>
        <SectionCard.Header
          title="WORKLOAD METRICS"
          actions={
            <span className="text-body-md text-[var(--color-action-primary)] cursor-pointer">
              View detail
            </span>
          }
        />
        <SectionCard.Content>
          <div className="grid grid-cols-4 gap-4">
            {['Title', 'Title', 'Title', 'Title'].map((t, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-body-sm text-[var(--color-text-subtle)]">{t}</span>
                <span className="text-heading-h3 text-[var(--color-text-default)]">0</span>
              </div>
            ))}
          </div>
        </SectionCard.Content>
      </SectionCard>

      {/* Performance Metrics */}
      <SectionCard>
        <SectionCard.Header
          title="PERFORMANCE METRICS"
          actions={
            <span className="text-body-md text-[var(--color-action-primary)] cursor-pointer">
              View detail
            </span>
          }
        />
        <SectionCard.Content>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-body-sm text-[var(--color-text-subtle)]">Title</span>
              <span className="text-heading-h4 text-[var(--color-text-default)]">0s</span>
              <span className="text-body-xs text-[var(--color-text-subtle)]">Queue wait time</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-body-sm text-[var(--color-text-subtle)]">Title</span>
              <span className="text-heading-h4 text-[var(--color-text-default)]">0.00/h</span>
              <span className="text-body-xs text-[var(--color-text-subtle)]">
                Workloads per hour
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-body-sm text-[var(--color-text-subtle)]">Title</span>
              <span className="text-heading-h4 text-[var(--color-text-default)]">00 %</span>
              <span className="text-body-xs text-[var(--color-text-subtle)]">Completion rate</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-body-sm text-[var(--color-text-subtle)]">Title</span>
              <span className="text-heading-h4 text-[var(--color-text-default)]">00 %</span>
              <span className="text-body-xs text-[var(--color-text-subtle)]">
                Scheduling efficiency
              </span>
            </div>
          </div>
        </SectionCard.Content>
      </SectionCard>

      {/* Resource Progress */}
      <SectionCard>
        <SectionCard.Header title="PERFORMANCE METRICS" />
        <SectionCard.Content>
          <div className="grid grid-cols-3 gap-4">
            <ResourceProgressCard
              title="Title"
              usage={10}
              total={100}
              unit="cores"
              available={90}
              percent={10}
              color="green"
            />
            <ResourceProgressCard
              title="Title"
              usage={60}
              total={100}
              unit="GB"
              available={40}
              percent={60}
              color="blue"
            />
            <ResourceProgressCard
              title="Title"
              usage={95}
              total={100}
              unit="GPUs"
              available={5}
              percent={10}
              color="red"
            />
          </div>
        </SectionCard.Content>
      </SectionCard>
    </VStack>
  );
}

function ResourceProgressCard({
  title,
  usage,
  total,
  unit,
  available,
  percent,
  color,
}: {
  title: string;
  usage: number;
  total: number;
  unit: string;
  available: number;
  percent: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    green: 'var(--color-state-success)',
    blue: 'var(--color-action-primary)',
    red: 'var(--color-state-danger)',
  };
  return (
    <div className="flex flex-col gap-2 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
      <HStack justify="between" align="center">
        <span className="text-heading-h6 text-[var(--color-text-default)]">{title}</span>
        <HStack gap={1} align="center">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorMap[color] }} />
          <span className="text-body-sm text-[var(--color-text-default)]">{percent}%</span>
        </HStack>
      </HStack>
      <ProgressBar value={usage} max={total} />
      <span className="text-body-xs text-[var(--color-text-subtle)]">
        Usage: {usage} {unit}/{total} {unit} Available: {available} {unit}
      </span>
    </div>
  );
}

// ─── Queue Tab ───────────────────────────────────────────────────────────────

function QueueTab() {
  const [subTab, setSubTab] = useState('cluster');
  const [search, setSearch] = useState('');

  const clusterColumns = [
    {
      key: 'status',
      header: 'Status',
      width: 60,
      align: 'center' as const,
      render: () => (
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-state-success)] mx-auto" />
      ),
    },
    {
      key: 'name',
      header: 'Cluster queues name',
      minWidth: 200,
      render: (_: unknown, row: (typeof MOCK_CLUSTER_QUEUES)[0]) => (
        <span className="text-[var(--color-action-primary)]">{row.name}</span>
      ),
    },
    { key: 'strategy', header: 'Queuing Strategy', minWidth: 150 },
    { key: 'cohort', header: 'Cohort', minWidth: 150 },
    { key: 'localQueue', header: 'LocalQueue', minWidth: 100 },
    {
      key: 'action',
      header: 'Action',
      width: 60,
      align: 'center' as const,
      render: () => (
        <IconRefresh size={14} className="text-[var(--color-text-subtle)] mx-auto cursor-pointer" />
      ),
    },
  ];

  const localColumns = [
    {
      key: 'status',
      header: 'Status',
      width: 60,
      align: 'center' as const,
      render: () => (
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-state-success)] mx-auto" />
      ),
    },
    {
      key: 'name',
      header: 'Name',
      minWidth: 180,
      render: (_: unknown, row: (typeof MOCK_LOCAL_QUEUES)[0]) => (
        <span className="text-[var(--color-action-primary)]">{row.name}</span>
      ),
    },
    { key: 'namespace', header: 'Namespace', minWidth: 100 },
    { key: 'boundTo', header: 'Bound to ClusterQueue', minWidth: 200 },
    { key: 'tier', header: 'Tier', minWidth: 80 },
    { key: 'pending', header: 'Pending', minWidth: 80 },
    { key: 'running', header: 'Running', minWidth: 80 },
    { key: 'completed', header: 'Completed', minWidth: 80 },
    {
      key: 'action',
      header: 'Action',
      width: 60,
      align: 'center' as const,
      render: () => (
        <IconRefresh size={14} className="text-[var(--color-text-subtle)] mx-auto cursor-pointer" />
      ),
    },
  ];

  return (
    <VStack gap={3}>
      <Tabs value={subTab} onChange={setSubTab} variant="boxed" size="sm">
        <TabList>
          <Tab value="cluster">Cluster queues</Tab>
          <Tab value="local">Loocal queues</Tab>
        </TabList>
      </Tabs>

      <HStack justify="between" align="center">
        <span className="text-heading-h6 text-[var(--color-text-default)]">
          {subTab === 'cluster' ? 'Cluster queues' : 'Local queues'}
        </span>
        <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
          Refresh
        </Button>
      </HStack>

      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Find local queues with filters"
        size="sm"
        className="w-[280px]"
      />
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={2} />

      {subTab === 'cluster' ? (
        <Table columns={clusterColumns} data={MOCK_CLUSTER_QUEUES} rowKey="id" />
      ) : (
        <Table columns={localColumns} data={MOCK_LOCAL_QUEUES} rowKey="id" />
      )}
    </VStack>
  );
}

// ─── Workloads Tab ───────────────────────────────────────────────────────────

function WorkloadsTab() {
  const [search, setSearch] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);

  const columns = [
    {
      key: 'status',
      header: 'Status',
      width: 60,
      align: 'center' as const,
      render: () => (
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-state-success)] mx-auto" />
      ),
    },
    {
      key: 'name',
      header: 'Name',
      minWidth: 220,
      render: (_: unknown, row: (typeof MOCK_WORKLOADS)[0]) => (
        <div className="flex flex-col">
          <span
            className="text-[var(--color-action-primary)] cursor-pointer"
            onClick={() => setDetailOpen(true)}
          >
            {row.name}
          </span>
          <span className="text-body-xs text-[var(--color-text-subtle)]">{row.project}</span>
        </div>
      ),
    },
    { key: 'priority', header: 'Priority', minWidth: 100 },
    {
      key: 'queue',
      header: 'Queue',
      minWidth: 150,
      render: (_: unknown, row: (typeof MOCK_WORKLOADS)[0]) => (
        <span className="whitespace-pre-line">{row.queue}</span>
      ),
    },
    {
      key: 'waitExec',
      header: 'Wait/Exec time',
      minWidth: 120,
      render: (_: unknown, row: (typeof MOCK_WORKLOADS)[0]) => (
        <span className="whitespace-pre-line">{row.waitExec}</span>
      ),
    },
    { key: 'cpu', header: 'CPU', minWidth: 60 },
    { key: 'memory', header: 'Memory', minWidth: 80 },
    {
      key: 'action',
      header: 'Action',
      width: 60,
      align: 'center' as const,
      render: () => (
        <IconRefresh size={14} className="text-[var(--color-text-subtle)] mx-auto cursor-pointer" />
      ),
    },
  ];

  return (
    <VStack gap={3}>
      <HStack justify="between" align="center">
        <span className="text-heading-h6 text-[var(--color-text-default)]">Workloads</span>
        <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
          Refresh
        </Button>
      </HStack>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1 p-3 rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
          <span className="text-body-sm text-[var(--color-text-subtle)]">Active Workloads</span>
          <span className="text-body-md text-[var(--color-text-default)]">
            1 queued · 0 running
          </span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
          <span className="text-body-sm text-[var(--color-text-subtle)]">Avg Wait Time</span>
          <span className="text-body-md text-[var(--color-text-default)]">-</span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
          <span className="text-body-sm text-[var(--color-text-subtle)]">Completed Today</span>
          <span className="text-body-md text-[var(--color-text-default)]">6</span>
        </div>
      </div>

      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Find workloads with filters"
        size="sm"
        className="w-[280px]"
      />
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={2} />
      <Table columns={columns} data={MOCK_WORKLOADS} rowKey="id" />

      <WorkloadDetailDrawer isOpen={detailOpen} onClose={() => setDetailOpen(false)} />
    </VStack>
  );
}

function WorkloadDetailDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="jobset-rec-5c103196-f9db4" width={480}>
      <VStack gap={6}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 p-3 rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)]">
            <span className="text-body-sm text-[var(--color-text-subtle)]">Status</span>
            <HStack gap={2} align="center">
              <span className="text-body-md text-[var(--color-text-default)]">Completes</span>
              <div className="w-5 h-5 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
                <IconAlertCircle size={12} className="text-white" />
              </div>
            </HStack>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)]">
            <span className="text-body-sm text-[var(--color-text-subtle)]">Priority</span>
            <span className="text-body-md text-[var(--color-text-default)]">Training</span>
          </div>
        </div>

        <SectionCard>
          <SectionCard.Header title="Workload information" />
          <SectionCard.Content>
            <SectionCard.DataRow label="Namespace">
              <HStack gap={1} align="center">
                <span>{'{Lable}'}</span>
                <IconCopy size={14} className="text-[var(--color-text-subtle)] cursor-pointer" />
              </HStack>
            </SectionCard.DataRow>
            <SectionCard.DataRow label="ID">
              <HStack gap={1} align="center">
                <span>{'{Lable}'}</span>
                <IconCopy size={14} className="text-[var(--color-text-subtle)] cursor-pointer" />
              </HStack>
            </SectionCard.DataRow>
            <SectionCard.DataRow label="Status Reason" value="Admitted" />
            <SectionCard.DataRow label="Priority Class" value="training-preemption" />
            <SectionCard.DataRow label="Tier" value="xlarge" />
            <SectionCard.DataRow label="Created At" value="Nov 11, 2025, 2:51 PM" />
            <SectionCard.DataRow label="Kueue Managed" value="{Lable}" />
          </SectionCard.Content>
        </SectionCard>

        <SectionCard>
          <SectionCard.Header title="Resources" />
          <SectionCard.Content>
            <SectionCard.DataRow label="CPU" value="Admitted" />
            <SectionCard.DataRow label="Memory" value="training-preemption" />
            <SectionCard.DataRow label="GPU" value="1×GPU" />
            <SectionCard.DataRow label="flavor" value="gpu-h100-nvl-4-flavor" />
          </SectionCard.Content>
        </SectionCard>
      </VStack>
    </Drawer>
  );
}

// ─── Analytics Tab ───────────────────────────────────────────────────────────

function AnalyticsTab() {
  const trendOption = {
    grid: { top: 30, right: 20, bottom: 30, left: 40 },
    xAxis: {
      type: 'category' as const,
      data: [
        '2026.1.27',
        '2026.1.28',
        '2026.1.29',
        '2026.1.30',
        '2026.1.31',
        '2026.2.1',
        '2026.2.2',
        '2026.2.3',
        '2026.2.4',
        '2026.2.5',
        '2026.2.6',
        '2026.2.7',
      ],
      axisLabel: { fontSize: 10, color: chartColors.slate400 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { fontSize: 10, color: chartColors.slate400 },
      splitLine: { lineStyle: { color: chartColors.slate100 } },
    },
    series: [
      {
        type: 'line',
        data: [4, 6, 8, 5, 7, 9, 6, 8, 10, 7, 5, 6],
        smooth: true,
        areaStyle: { color: `${primaryChartColors[0]}20` },
        lineStyle: { color: primaryChartColors[0] },
        itemStyle: { color: primaryChartColors[0] },
      },
      {
        type: 'line',
        data: [2, 3, 4, 2, 3, 5, 3, 4, 5, 3, 2, 3],
        smooth: true,
        areaStyle: { color: `${primaryChartColors[1]}20` },
        lineStyle: { color: primaryChartColors[1] },
        itemStyle: { color: primaryChartColors[1] },
      },
    ],
  };

  const waitTimeOption = {
    grid: { top: 20, right: 20, bottom: 30, left: 40 },
    xAxis: {
      type: 'category' as const,
      data: ['0-1s', '1-5s', '5-10s', '10-30s', '30-60s', '1-5m', '5-15m', '15-30m', '30m+'],
      axisLabel: { fontSize: 10, color: chartColors.slate400 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { fontSize: 10, color: chartColors.slate400 },
      splitLine: { lineStyle: { color: chartColors.slate100 } },
    },
    series: [
      {
        type: 'bar',
        data: [30, 20, 15, 10, 5, 3, 2, 1, 0],
        itemStyle: { color: primaryChartColors[0], borderRadius: [4, 4, 0, 0] },
        barWidth: '60%',
      },
    ],
  };

  const donutOption = {
    series: [
      {
        type: 'pie',
        radius: ['50%', '80%'],
        center: ['50%', '50%'],
        data: [
          { value: 60, name: 'Title', itemStyle: { color: primaryChartColors[0] } },
          { value: 25, name: 'Title', itemStyle: { color: primaryChartColors[1] } },
          { value: 15, name: 'Title', itemStyle: { color: primaryChartColors[2] } },
        ],
        label: { show: true, position: 'inside', fontSize: 10, color: '#fff', formatter: '{d}%' },
      },
    ],
  };

  const cpuDistOption = {
    grid: { top: 20, right: 20, bottom: 30, left: 40 },
    xAxis: {
      type: 'category' as const,
      data: ['1', '2', '4', '8', '16', '32', '64', '128'],
      axisLabel: { fontSize: 10, color: chartColors.slate400 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { fontSize: 10, color: chartColors.slate400 },
      splitLine: { lineStyle: { color: chartColors.slate100 } },
    },
    series: [
      {
        type: 'bar',
        data: [25, 20, 15, 10, 5, 3, 2, 1],
        itemStyle: { color: primaryChartColors[0], borderRadius: [4, 4, 0, 0] },
        barWidth: '60%',
      },
    ],
  };

  const top10Columns = [
    { key: 'rank', header: 'Rank', minWidth: 60 },
    { key: 'name', header: 'Name', minWidth: 120 },
    { key: 'workloadCount', header: 'Workload Count', minWidth: 120 },
    { key: 'percentage', header: 'Percentage', minWidth: 100 },
  ];

  const queuePerfColumns = [
    { key: 'name', header: 'Queue Name', minWidth: 200 },
    { key: 'workloads', header: 'Workloads', minWidth: 100 },
    { key: 'avgWait', header: 'Avg Wait', minWidth: 80 },
    { key: 'success', header: 'Success', minWidth: 80 },
  ];

  return (
    <VStack gap={4}>
      <HStack justify="between" align="center">
        <span className="text-heading-h6 text-[var(--color-text-default)]">Analytics</span>
        <HStack gap={2} align="center">
          <span className="text-body-sm text-[var(--color-text-subtle)]">Updated 12:04:21</span>
          <Select
            options={[{ value: '7d', label: '7 days' }]}
            value="7d"
            onChange={() => {}}
            className="w-[100px]"
          />
          <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
            Refresh
          </Button>
        </HStack>
      </HStack>

      {/* Performance */}
      <SectionCard>
        <SectionCard.Header title="PERFORMANCE" />
        <SectionCard.Content>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-body-sm text-[var(--color-text-subtle)]">Title</span>
              <span className="text-heading-h4">0s</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-body-sm text-[var(--color-text-subtle)]">Title</span>
              <span className="text-heading-h4">0.0/h</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-body-sm text-[var(--color-text-subtle)]">Title</span>
              <span className="text-heading-h4">0%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-body-sm text-[var(--color-text-subtle)]">Title</span>
              <span className="text-heading-h4">0</span>
            </div>
          </div>
        </SectionCard.Content>
      </SectionCard>

      {/* Workload Trends */}
      <SectionCard>
        <SectionCard.Header title="WORKLOAD TRENDS" />
        <SectionCard.Content>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            94 completed, 8 failed (91.3% success)
          </span>
          <ReactECharts option={trendOption} style={{ height: 200 }} />
        </SectionCard.Content>
      </SectionCard>

      {/* Wait Time + Failure */}
      <div className="grid grid-cols-2 gap-4">
        <SectionCard>
          <SectionCard.Header title="WAIT TIME DISTRIBUTION" />
          <SectionCard.Content>
            <span className="text-body-sm text-[var(--color-text-subtle)]">Avg 1s (P95 1s)</span>
            <ReactECharts option={waitTimeOption} style={{ height: 180 }} />
          </SectionCard.Content>
        </SectionCard>
        <SectionCard>
          <SectionCard.Header title="Failure Reasons" />
          <SectionCard.Content>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex flex-col gap-1 p-2 rounded bg-[var(--color-surface-subtle)]">
                <span className="text-body-sm text-[var(--color-text-subtle)]">Success</span>
                <span className="text-heading-h6">00 (00%)</span>
              </div>
              <div className="flex flex-col gap-1 p-2 rounded bg-[var(--color-surface-subtle)]">
                <span className="text-body-sm text-[var(--color-text-subtle)]">Fail</span>
                <span className="text-heading-h6">00 (00%)</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ReactECharts option={donutOption} style={{ height: 160 }} />
              <VStack gap={2}>
                <span className="text-body-sm font-medium">Top failure reasons</span>
                {Array.from({ length: 5 }).map((_, i) => (
                  <HStack key={i} gap={2} align="center" className="text-body-xs">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: primaryChartColors[i % 5] }}
                    />
                    <span className="flex-1 truncate">
                      project-f0000000-0000-0000-0000-000000000...
                    </span>
                    <span>00</span>
                    <span className="text-[var(--color-state-danger)]">{70 + i * 2}%</span>
                  </HStack>
                ))}
              </VStack>
            </div>
          </SectionCard.Content>
        </SectionCard>
      </div>

      {/* Workload Size Distribution */}
      <SectionCard>
        <SectionCard.Header title="WORKLOAD SIZE DISTRIBUTION" />
        <SectionCard.Content>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-body-md font-medium mb-2 block">By CPU Cores</span>
              <ReactECharts option={cpuDistOption} style={{ height: 180 }} />
            </div>
            <div>
              <span className="text-body-md font-medium mb-2 block">
                Workload Size Distribution
              </span>
              <VStack gap={3}>
                <HStack gap={2} align="center">
                  <span className="text-body-sm w-12">GPU(T4)</span>
                  <div className="flex-1">
                    <ProgressBar value={80} max={100} />
                  </div>
                  <span className="text-body-sm">Title: 00.0</span>
                  <span className="text-body-xs text-[var(--color-state-success)]">● 15%</span>
                </HStack>
                <HStack gap={2} align="center">
                  <span className="text-body-sm w-12">NPU</span>
                  <div className="flex-1">
                    <ProgressBar value={60} max={100} />
                  </div>
                  <span className="text-body-sm" />
                  <span className="text-body-xs text-[var(--color-state-success)]">● 15%</span>
                </HStack>
                <span className="text-body-sm text-[var(--color-text-subtle)]">
                  Total Workloads: 104
                </span>
              </VStack>
            </div>
          </div>
        </SectionCard.Content>
      </SectionCard>

      {/* Tables */}
      <div className="grid grid-cols-2 gap-4">
        <SectionCard>
          <SectionCard.Header title="TOP 10 NAMESPACES" />
          <SectionCard.Content>
            <Table columns={top10Columns} data={MOCK_TOP10_NAMESPACES} rowKey="id" />
          </SectionCard.Content>
        </SectionCard>
        <SectionCard>
          <SectionCard.Header title="QUEUE PERFORMANCE" />
          <SectionCard.Content>
            <Table columns={queuePerfColumns} data={MOCK_QUEUE_PERFORMANCE} rowKey="id" />
          </SectionCard.Content>
        </SectionCard>
      </div>
    </VStack>
  );
}

// ─── Scheduler Tab ───────────────────────────────────────────────────────────

function SchedulerTab() {
  const schedulerColumns = [
    {
      key: 'name',
      header: 'Queue name',
      minWidth: 150,
      render: (_: unknown, row: (typeof MOCK_SCHEDULER_QUEUES)[0]) => (
        <div className="flex flex-col">
          <span>
            {row.expanded ? '▼' : '▶'} {row.name}
          </span>
          <span className="text-body-xs text-[var(--color-text-subtle)]">{row.pods}</span>
        </div>
      ),
    },
    { key: 'type', header: 'Type', minWidth: 80 },
    { key: 'pending', header: 'Pending', minWidth: 80 },
    { key: 'admitted', header: 'Admitted', minWidth: 80 },
    { key: 'rejected', header: 'Rejected', minWidth: 80 },
    { key: 'avgQueueTime', header: 'Avg Queue Time', minWidth: 120 },
    { key: 'admissionRate', header: 'Admission Rate', minWidth: 120 },
    { key: 'fairness', header: 'Fairness', minWidth: 80 },
  ];

  return (
    <VStack gap={4}>
      <HStack justify="between" align="center">
        <span className="text-heading-h6 text-[var(--color-text-default)]">Scheduler</span>
        <HStack gap={2} align="center">
          <Select
            options={[{ value: '1h', label: '1 Hour' }]}
            value="1h"
            onChange={() => {}}
            className="w-[100px]"
          />
          <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
            Refresh
          </Button>
        </HStack>
      </HStack>

      {/* Top Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Decisions', value: '0', sub: 'Workloads/hour' },
          { label: 'Success Rate', value: '00.0%', sub: '0 admitted' },
          { label: 'Avg Queue Time', value: '00.0%', sub: '0 admitted' },
          { label: 'Avg Decision Time', value: '00.0%', sub: '0 admitted' },
        ].map((m, i) => (
          <div
            key={i}
            className="flex flex-col gap-1 p-3 rounded-[var(--radius-lg)] border border-[var(--color-border-default)]"
          >
            <span className="text-body-sm text-[var(--color-text-subtle)]">{m.label}</span>
            <span className="text-heading-h4 text-[var(--color-text-default)]">{m.value}</span>
            <span className="text-body-xs text-[var(--color-text-subtle)]">{m.sub}</span>
          </div>
        ))}
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-3 gap-4">
        {['RECENT ACTIVITIES', 'BY PRIORITY', 'TOP REASONS'].map((title) => (
          <SectionCard key={title}>
            <SectionCard.Header title={title} />
            <SectionCard.Content>
              <VStack gap={2}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <HStack key={i} gap={2} align="center">
                    <span className="text-body-xs text-[var(--color-text-default)] flex-1 truncate">
                      project-f0000000-0000-0000-0000-000000000001
                    </span>
                    <span className="text-body-xs">00.0</span>
                    <span className="text-body-xs text-[var(--color-state-success)]">● 10%</span>
                  </HStack>
                ))}
              </VStack>
            </SectionCard.Content>
          </SectionCard>
        ))}
      </div>

      {/* Performance Metrics + Queue Performance */}
      <div className="grid grid-cols-2 gap-4">
        <SectionCard>
          <SectionCard.Header title="Performance Metrics" />
          <SectionCard.Content>
            <div className="grid grid-cols-2 gap-4">
              <VStack gap={2}>
                <span className="text-body-sm font-medium text-[var(--color-text-default)]">
                  Decision Latency
                </span>
                <HStack justify="between">
                  <span className="text-body-sm">Average</span>
                  <span className="text-body-sm">0μs</span>
                </HStack>
                <HStack justify="between">
                  <span className="text-body-sm">P95</span>
                  <span className="text-body-sm">0μs</span>
                </HStack>
                <HStack justify="between">
                  <span className="text-body-sm">P99</span>
                  <span className="text-body-sm">0μs</span>
                </HStack>
              </VStack>
              <VStack gap={2}>
                <span className="text-body-sm font-medium text-[var(--color-text-default)]">
                  Decision Latency
                </span>
                <HStack justify="between">
                  <span className="text-body-sm text-[var(--color-state-success)]">Average</span>
                  <span className="text-body-sm">0μs</span>
                </HStack>
                <HStack justify="between">
                  <span className="text-body-sm text-[var(--color-state-success)]">Median</span>
                  <span className="text-body-sm">0μs</span>
                </HStack>
                <HStack justify="between">
                  <span className="text-body-sm text-[var(--color-state-success)]">P95</span>
                  <span className="text-body-sm">0μs</span>
                </HStack>
              </VStack>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
              <HStack justify="between">
                <span className="text-body-md font-medium">Throughput</span>
                <span className="text-body-md">0.00 decisions/sec</span>
              </HStack>
            </div>
          </SectionCard.Content>
        </SectionCard>
        <SectionCard>
          <SectionCard.Header title="Queue Performance" />
          <SectionCard.Content>
            <div className="grid grid-cols-2 gap-4">
              <VStack gap={2}>
                <span className="text-body-sm font-medium text-[var(--color-text-default)]">
                  Decision Latency
                </span>
                <HStack justify="between">
                  <span className="text-body-sm">Average</span>
                  <span className="text-body-sm">0μs</span>
                </HStack>
                <HStack justify="between">
                  <span className="text-body-sm">P95</span>
                  <span className="text-body-sm">0μs</span>
                </HStack>
                <HStack justify="between">
                  <span className="text-body-sm">P99</span>
                  <span className="text-body-sm">0μs</span>
                </HStack>
              </VStack>
              <VStack gap={2}>
                <span className="text-body-sm font-medium text-[var(--color-text-default)]">
                  Decision Latency
                </span>
                <HStack justify="between">
                  <span className="text-body-sm text-[var(--color-state-success)]">Average</span>
                  <span className="text-body-sm">0μs</span>
                </HStack>
                <HStack justify="between">
                  <span className="text-body-sm text-[var(--color-state-success)]">Median</span>
                  <span className="text-body-sm">0μs</span>
                </HStack>
                <HStack justify="between">
                  <span className="text-body-sm text-[var(--color-state-success)]">P95</span>
                  <span className="text-body-sm">0μs</span>
                </HStack>
              </VStack>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
              <HStack justify="between">
                <span className="text-body-md font-medium">Overall Fairness Score</span>
                <span className="text-body-md">100</span>
              </HStack>
            </div>
          </SectionCard.Content>
        </SectionCard>
      </div>

      {/* Queue Scheduler Metrics */}
      <SectionCard>
        <SectionCard.Header title="Queue Scheduler Metrics" />
        <SectionCard.Content>
          <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={4} />
          <Table columns={schedulerColumns} data={MOCK_SCHEDULER_QUEUES} rowKey="id" />
        </SectionCard.Content>
      </SectionCard>
    </VStack>
  );
}

// ─── Alerts Tab ──────────────────────────────────────────────────────────────

function AlertsTab() {
  return (
    <VStack gap={4}>
      <HStack justify="between" align="center">
        <span className="text-heading-h6 text-[var(--color-text-default)]">Alerts</span>
        <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
          Refresh
        </Button>
      </HStack>

      <div className="grid grid-cols-[1fr_2fr] gap-4">
        {/* Alert Summary */}
        <SectionCard>
          <SectionCard.Header title="ALERT SUMMARY" />
          <SectionCard.Content>
            <VStack gap={3}>
              <HStack justify="between" align="center">
                <span className="text-body-sm text-[var(--color-state-danger)]">Total alerts</span>
                <span className="text-heading-h4">0</span>
              </HStack>
              <span className="text-body-xs text-[var(--color-text-subtle)]">
                All active alerts
              </span>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <div className="grid grid-cols-2 gap-3">
                <VStack gap={1}>
                  <span className="text-body-sm text-[var(--color-state-danger)]">Active</span>
                  <span className="text-heading-h5">00.0</span>
                  <span className="text-body-xs text-[var(--color-text-subtle)]">
                    Require attention
                  </span>
                </VStack>
                <VStack gap={1}>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">
                    Idle resources
                  </span>
                  <span className="text-heading-h5">00.0</span>
                  <span className="text-body-xs text-[var(--color-text-subtle)]">
                    Under-utilized
                  </span>
                </VStack>
              </div>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <div className="grid grid-cols-2 gap-3">
                <VStack gap={1}>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">Cost waste</span>
                  <span className="text-heading-h5">$0.00</span>
                  <span className="text-body-xs text-[var(--color-text-subtle)]">/Hour</span>
                </VStack>
                <VStack gap={1}>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">Resolved</span>
                  <span className="text-heading-h5">0</span>
                  <span className="text-body-xs text-[var(--color-text-subtle)]">
                    Recently fixed
                  </span>
                </VStack>
              </div>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        {/* Alert Breakdown */}
        <SectionCard>
          <SectionCard.Header title="ALERT BREAKDOWN" />
          <SectionCard.Content>
            <div className="grid grid-cols-2 gap-4">
              <VStack gap={2}>
                <span className="text-body-sm font-medium">By Type</span>
                {[
                  { type: 'GPU', count: 2 },
                  { type: 'Idle-resource', count: 1 },
                  { type: 'Policy', count: 2 },
                  { type: 'System', count: 3 },
                  { type: 'Resource', count: 0 },
                ].map((item) => (
                  <HStack
                    key={item.type}
                    justify="between"
                    className="py-1 border-b border-[var(--color-border-subtle)]"
                  >
                    <span className="text-body-sm">{item.type}</span>
                    <span className="text-body-sm">{item.count}</span>
                  </HStack>
                ))}
              </VStack>
              <VStack gap={2}>
                <span className="text-body-sm font-medium">By Severity</span>
                {[
                  { severity: 'Critical', count: 3, color: 'var(--color-state-danger)' },
                  { severity: 'High', count: 0, color: 'var(--color-state-warning)' },
                  { severity: 'Medium', count: 3, color: '#f59e0b' },
                  { severity: 'Low', count: 3, color: 'var(--color-state-success)' },
                ].map((item) => (
                  <HStack
                    key={item.severity}
                    justify="between"
                    className="py-1 border-b border-[var(--color-border-subtle)]"
                  >
                    <span className="text-body-sm" style={{ color: item.color }}>
                      {item.severity}
                    </span>
                    <span className="text-body-sm">{item.count}</span>
                  </HStack>
                ))}
              </VStack>
            </div>
          </SectionCard.Content>
        </SectionCard>
      </div>

      {/* Alert Details */}
      <SectionCard>
        <SectionCard.Header
          title="ALERT DETAILS"
          actions={
            <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
              Refresh
            </Button>
          }
        />
        <SectionCard.Content>
          <SearchInput
            value=""
            onChange={() => {}}
            placeholder="Find local queues with filters"
            size="sm"
            className="w-[280px]"
          />
          <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={4} />
          <div className="grid grid-cols-2 gap-4 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <AlertCard key={i} severity={i === 2 ? 'critical' : i === 1 ? 'info' : 'success'} />
            ))}
          </div>
        </SectionCard.Content>
      </SectionCard>
    </VStack>
  );
}

function AlertCard({ severity }: { severity: 'success' | 'info' | 'critical' }) {
  const colorMap = {
    success: 'var(--color-state-success)',
    info: 'var(--color-state-info)',
    critical: 'var(--color-state-danger)',
  };
  return (
    <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
      <VStack gap={3}>
        <HStack justify="between" align="start">
          <VStack gap={1}>
            <HStack gap={2} align="center">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colorMap[severity] }}
              />
              <span className="text-heading-h6">Title</span>
            </HStack>
            <span className="text-body-sm text-[var(--color-text-subtle)]">{'{Type}'}</span>
            <HStack gap={1}>
              <span className="text-body-xs px-1.5 py-0.5 rounded bg-[var(--color-state-danger-bg)] text-[var(--color-state-danger)]">
                {'{Severity}'}
              </span>
              <span className="text-body-xs px-1.5 py-0.5 rounded bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]">
                {'{Resource Kind}'}
              </span>
            </HStack>
          </VStack>
          <span className="text-body-sm text-[var(--color-text-subtle)]">26 min remaining</span>
        </HStack>

        <div className="grid grid-cols-2 gap-2">
          <VStack gap={1}>
            <span className="text-body-xs text-[var(--color-text-subtle)]">CPU</span>
            <span className="text-body-sm">2.1% (42m / 2000m)</span>
          </VStack>
          <VStack gap={1}>
            <span className="text-body-xs text-[var(--color-text-subtle)]">Memory</span>
            <span className="text-body-sm">15.3% (1.2GB / 8.0GB)</span>
          </VStack>
          <VStack gap={1}>
            <span className="text-body-xs text-[var(--color-text-subtle)]">GPU memory</span>
            <span className="text-body-sm">5.0% (0.8GB / 16.0GB)</span>
          </VStack>
          <VStack gap={1}>
            <span className="text-body-xs text-[var(--color-text-subtle)]">Wasting</span>
            <span className="text-body-sm">$3.45/hour</span>
          </VStack>
        </div>

        <span className="text-body-xs text-[var(--color-text-subtle)]">
          Created at: Nov 11, 2025 02:51 PM Resolved at: Nov 11, 2025 02:51 PM
        </span>

        <HStack gap={2}>
          <Button variant="secondary" size="sm">
            Recommendations
          </Button>
          <Button variant="secondary" size="sm">
            Ignore
          </Button>
          <Button variant="secondary" size="sm">
            Suspend Now
          </Button>
          <Button variant="secondary" size="sm">
            Extend Grace Period
          </Button>
        </HStack>
      </VStack>
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────────────────────

function SettingsTab() {
  const [subTab, setSubTab] = useState('inventory');
  const [search, setSearch] = useState('');

  const flavorColumns = [
    { key: 'name', header: 'Name', minWidth: 180 },
    { key: 'available', header: 'Available', minWidth: 80 },
    { key: 'total', header: 'Total', minWidth: 60 },
    { key: 'type', header: 'Type', minWidth: 80 },
    { key: 'allocated', header: 'Allocated', minWidth: 80 },
    {
      key: 'utilization',
      header: '??',
      minWidth: 100,
      render: (_: unknown, row: (typeof MOCK_RESOURCE_FLAVORS)[0]) => (
        <HStack gap={2} align="center">
          <span className="text-body-sm">{row.utilization}%</span>
          <div className="flex-1">
            <ProgressBar value={row.utilization} max={100} />
          </div>
        </HStack>
      ),
    },
  ];

  return (
    <VStack gap={3}>
      <Tabs value={subTab} onChange={setSubTab} variant="boxed" size="sm">
        <TabList>
          <Tab value="inventory">Resource Inventory</Tab>
          <Tab value="queue-mgmt">Queue Management</Tab>
          <Tab value="audit">Audit Log</Tab>
        </TabList>
      </Tabs>

      {subTab === 'inventory' && (
        <VStack gap={4}>
          <span className="text-label-lg text-[var(--color-text-default)]">RESOURCE INVENTORY</span>
          <div className="grid grid-cols-3 gap-4">
            <ResourceProgressCard
              title="CPU"
              usage={10}
              total={100}
              unit="cores"
              available={90}
              percent={10}
              color="green"
            />
            <ResourceProgressCard
              title="Memory"
              usage={60}
              total={100}
              unit="GB"
              available={40}
              percent={60}
              color="blue"
            />
            <ResourceProgressCard
              title="GPU"
              usage={95}
              total={100}
              unit="GPUs"
              available={5}
              percent={99}
              color="red"
            />
          </div>

          <HStack justify="between" align="center">
            <span className="text-heading-h6 text-[var(--color-text-default)]">
              Resource Flavors
            </span>
            <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
              Refresh
            </Button>
          </HStack>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find local queues with filters"
            size="sm"
            className="w-[280px]"
          />
          <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={2} />
          <Table columns={flavorColumns} data={MOCK_RESOURCE_FLAVORS} rowKey="id" />
        </VStack>
      )}

      {subTab === 'queue-mgmt' && (
        <VStack gap={4}>
          <span className="text-body-md text-[var(--color-text-subtle)]">
            Queue management settings will appear here.
          </span>
        </VStack>
      )}

      {subTab === 'audit' && (
        <VStack gap={4}>
          <span className="text-body-md text-[var(--color-text-subtle)]">
            Audit log will appear here.
          </span>
        </VStack>
      )}
    </VStack>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function KueuePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Kueue');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

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
          breadcrumb={<Breadcrumb items={[{ label: 'Operations' }, { label: 'Kueue' }]} />}
          actions={<AiPlatformTopBarActions showSearch />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={3}>
        <PageHeader title="Kueue" />

        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="queue">Queue</Tab>
            <Tab value="workloads">Workloads</Tab>
            <Tab value="analytics">Analytics</Tab>
            <Tab value="scheduler">Scheduler</Tab>
            <Tab value="alerts">Alerts</Tab>
            <Tab value="settings">Settings</Tab>
          </TabList>

          <TabPanel value="overview">
            <OverviewTab />
          </TabPanel>
          <TabPanel value="queue">
            <QueueTab />
          </TabPanel>
          <TabPanel value="workloads">
            <WorkloadsTab />
          </TabPanel>
          <TabPanel value="analytics">
            <AnalyticsTab />
          </TabPanel>
          <TabPanel value="scheduler">
            <SchedulerTab />
          </TabPanel>
          <TabPanel value="alerts">
            <AlertsTab />
          </TabPanel>
          <TabPanel value="settings">
            <SettingsTab />
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}

export default KueuePage;
