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
  ProgressBar,
  Checkbox,
} from '@/design-system';
import ReactECharts from 'echarts-for-react';
import {
  primaryChartColors,
  extendedChartColors,
  chartColors,
} from '@/pages/design-system-sections/ChartComponents';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconDownload } from '@tabler/icons-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_NODES = [
  {
    id: '1',
    status: 'active',
    name: 'Lable',
    pods: '172 pods',
    cpuLogical: '67%',
    cpuLogicalDetail: '213.2 cores /256 cores',
    memLogical: '80%',
    memLogicalDetail: '213.2 GB /256 GB',
    cpuPhysical: '67%',
    cpuPhysicalDetail: '213.2 cores /256 cores',
    memPhysical: '81%',
    memPhysicalDetail: '213.2 GB /256 GB',
    diskPhysical: '21%',
    diskPhysicalDetail: '213.2 GB /256 GB',
    gpu: '10%',
    gpuDetail: 'V10',
    expanded: true,
  },
  {
    id: '2',
    status: 'active',
    name: 'Lable',
    pods: '172 pods',
    cpuLogical: '61%',
    cpuLogicalDetail: '213.2 cores /256 cores',
    memLogical: '80%',
    memLogicalDetail: '213.2 GB /256 GB',
    cpuPhysical: '67%',
    cpuPhysicalDetail: '213.2 cores /256 cores',
    memPhysical: '81%',
    memPhysicalDetail: '213.2 GB /256 GB',
    diskPhysical: '21%',
    diskPhysicalDetail: '213.2 GB /256 GB',
    gpu: '10%',
    gpuDetail: 'V10',
    expanded: false,
  },
  {
    id: '3',
    status: 'active',
    name: 'Lable',
    pods: '172 pods',
    cpuLogical: '67%',
    cpuLogicalDetail: '213.2 cores /256 cores',
    memLogical: '80%',
    memLogicalDetail: '213.2 GB /256 GB',
    cpuPhysical: '67%',
    cpuPhysicalDetail: '213.2 cores /256 cores',
    memPhysical: '81%',
    memPhysicalDetail: '213.2 GB /256 GB',
    diskPhysical: '21%',
    diskPhysicalDetail: '213.2 GB /256 GB',
    gpu: '10%',
    gpuDetail: 'V10',
    expanded: false,
  },
];

const NODE_NAMES = [
  'bds/2kr1-gpunode01-GPU0',
  'bds/2kr1-gpunode01-GPU0',
  'bds/2kr1-gpunode01-GPU0',
  'tkai-aks-md-1-00a0969bfa-r6dq8-k8aq5-GPU0',
  'tkai-aks-md-1-00a0969bfa-r6dq8-l6bq8-GPU0',
  'tkai-aks-md-1-00a0969bfa-r6dq8-n2kq-GPU0',
  'tkai-server-1-GPU0',
  'tkai-server-1-GPU0',
  '5tai-server-1-GPU0',
  'bds/2kr1-gpunode01-GPU4',
  'bds/2kr1-gpunode01-GPU4',
  'bds/2kr1-gpunode01-GPU4',
];

// ─── Overview Tab ────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <VStack gap={4}>
      {/* Cluster Summary */}
      <SectionCard>
        <SectionCard.Header title="Cluster Summary" />
        <SectionCard.Content>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total nodes', value: '1' },
              { label: 'Total pods', value: '1' },
              { label: 'Labeled pods', value: '1' },
              { label: 'GPU types', value: '0' },
            ].map((m) => (
              <div
                key={m.label}
                className="flex items-center justify-between p-3 rounded-[var(--radius-lg)] border border-[var(--color-border-default)]"
              >
                <span className="text-body-md text-[var(--color-text-default)]">{m.label}</span>
                <span className="text-heading-h4 text-[var(--color-text-default)]">{m.value}</span>
              </div>
            ))}
          </div>
        </SectionCard.Content>
      </SectionCard>

      {/* Capacity */}
      <div className="grid grid-cols-2 gap-4">
        <SectionCard>
          <SectionCard.Header title="Logical capacity" />
          <SectionCard.Content>
            <VStack gap={4}>
              <CapacityRow
                label="CPU"
                percent={50}
                color="green"
                usage="75 cores/100 cores"
                allocatable="25 cores"
                limits="70 cores"
              />
              <CapacityRow
                label="Memory"
                percent={75}
                color="red"
                usage="75 cores/100 cores"
                allocatable="25 cores"
                limits="70 cores"
              />
              <CapacityRow
                label="CPU limits"
                percent={50}
                color="green"
                usage="15 cores/100 cores"
                allocatable="25 cores"
                extra="Overcommit ratio"
              />
              <CapacityRow
                label="Memory limits"
                percent={75}
                color="red"
                usage="15 cores/100 cores"
                allocatable="25 cores"
                extra="Overcommit ratio"
              />
            </VStack>
          </SectionCard.Content>
        </SectionCard>
        <SectionCard>
          <SectionCard.Header title="Physical capacity" />
          <SectionCard.Content>
            <VStack gap={4}>
              <CapacityRow
                label="CPU"
                percent={79}
                color="red"
                usage="75 cores/100 cores"
                allocatable="25 cores"
              />
              <CapacityRow
                label="Memory"
                percent={71}
                color="red"
                usage="75 cores/100 cores"
                allocatable="25 cores"
              />
              <CapacityRow
                label="Disk"
                percent={50}
                color="green"
                usage="75 cores/100 cores"
                allocatable="25 cores"
              />
              <CapacityRow
                label="GPU"
                percent={50}
                color="green"
                usage="75 cores/100 cores"
                allocatable="25 cores"
              />
            </VStack>
          </SectionCard.Content>
        </SectionCard>
      </div>

      {/* GPU Resource Summary */}
      <SectionCard>
        <SectionCard.Header title="GPU resource summary" />
        <SectionCard.Content>
          <div className="grid grid-cols-2 gap-4">
            <GpuCard
              title="GPU"
              percent={75}
              usage="2 GB / 6 GB"
              requests="3 GB"
              allocatable="2 GB"
            />
            <GpuCard
              title="MIG-1G-12GB"
              percent={75}
              usage="2 GB / 6 GB"
              requests="3 GB"
              allocatable="2 GB"
            />
          </div>
        </SectionCard.Content>
      </SectionCard>
    </VStack>
  );
}

function CapacityRow({
  label,
  percent,
  color,
  usage,
  allocatable,
  limits,
  extra,
}: {
  label: string;
  percent: number;
  color: string;
  usage: string;
  allocatable: string;
  limits?: string;
  extra?: string;
}) {
  const dotColor =
    color === 'green'
      ? 'var(--color-state-success)'
      : color === 'red'
        ? 'var(--color-state-danger)'
        : 'var(--color-state-warning)';
  return (
    <VStack gap={1}>
      <HStack justify="between" align="center">
        <span className="text-body-md text-[var(--color-text-default)]">{label}</span>
        <HStack gap={1} align="center">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
          <span className="text-body-sm">{percent}%</span>
        </HStack>
      </HStack>
      <ProgressBar value={percent} max={100} />
      <HStack gap={3}>
        <span className="text-body-xs text-[var(--color-text-subtle)]">Usage: {usage}</span>
        <span className="text-body-xs text-[var(--color-text-subtle)]">
          Allocatable: {allocatable}
        </span>
        {limits && (
          <span className="text-body-xs text-[var(--color-text-subtle)]">Limits: {limits}</span>
        )}
        {extra && <span className="text-body-xs text-[var(--color-text-subtle)]">{extra}</span>}
      </HStack>
    </VStack>
  );
}

function GpuCard({
  title,
  percent,
  usage,
  requests,
  allocatable,
}: {
  title: string;
  percent: number;
  usage: string;
  requests: string;
  allocatable: string;
}) {
  return (
    <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
      <VStack gap={2}>
        <HStack justify="between" align="center">
          <span className="text-heading-h6 text-[var(--color-text-default)]">{title}</span>
          <HStack gap={1} align="center">
            <div className="w-2 h-2 rounded-full bg-[var(--color-state-danger)]" />
            <span className="text-body-sm">{percent}%</span>
          </HStack>
        </HStack>
        <ProgressBar value={percent} max={100} />
        <HStack gap={3}>
          <span className="text-body-xs text-[var(--color-text-subtle)]">Usage: {usage}</span>
          <span className="text-body-xs text-[var(--color-text-subtle)]">Requests: {requests}</span>
          <span className="text-body-xs text-[var(--color-text-subtle)]">
            Allocatable: {allocatable}
          </span>
        </HStack>
      </VStack>
    </div>
  );
}

// ─── Nodes Tab ───────────────────────────────────────────────────────────────

function NodesTab() {
  const [search, setSearch] = useState('');

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
      minWidth: 140,
      render: (_: unknown, row: (typeof MOCK_NODES)[0]) => (
        <div className="flex flex-col">
          <HStack gap={1} align="center">
            <span className="text-body-sm">{row.expanded ? '▼' : '▶'}</span>
            <span className="text-body-md font-medium">{row.name}</span>
          </HStack>
          <span className="text-body-xs text-[var(--color-text-subtle)] ml-4">{row.pods}</span>
        </div>
      ),
    },
    {
      key: 'cpuLogical',
      header: 'CPU (Logical)',
      minWidth: 140,
      render: (_: unknown, row: (typeof MOCK_NODES)[0]) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-body-sm text-[var(--color-state-danger)]">{row.cpuLogical}</span>
          <span className="text-body-xs text-[var(--color-text-subtle)]">
            {row.cpuLogicalDetail}
          </span>
        </div>
      ),
    },
    {
      key: 'memLogical',
      header: 'Memory (Logical)',
      minWidth: 140,
      render: (_: unknown, row: (typeof MOCK_NODES)[0]) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-body-sm text-[var(--color-state-danger)]">{row.memLogical}</span>
          <span className="text-body-xs text-[var(--color-text-subtle)]">
            {row.memLogicalDetail}
          </span>
        </div>
      ),
    },
    {
      key: 'cpuPhysical',
      header: 'CPU (Physical)',
      minWidth: 140,
      render: (_: unknown, row: (typeof MOCK_NODES)[0]) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-body-sm text-[var(--color-state-success)]">{row.cpuPhysical}</span>
          <span className="text-body-xs text-[var(--color-text-subtle)]">
            {row.cpuPhysicalDetail}
          </span>
        </div>
      ),
    },
    {
      key: 'memPhysical',
      header: 'Memory (Physical)',
      minWidth: 140,
      render: (_: unknown, row: (typeof MOCK_NODES)[0]) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-body-sm text-[var(--color-state-danger)]">{row.memPhysical}</span>
          <span className="text-body-xs text-[var(--color-text-subtle)]">
            {row.memPhysicalDetail}
          </span>
        </div>
      ),
    },
    {
      key: 'diskPhysical',
      header: 'Disk (Physical)',
      minWidth: 140,
      render: (_: unknown, row: (typeof MOCK_NODES)[0]) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-body-sm text-[var(--color-state-danger)]">{row.diskPhysical}</span>
          <span className="text-body-xs text-[var(--color-text-subtle)]">
            {row.diskPhysicalDetail}
          </span>
        </div>
      ),
    },
    {
      key: 'gpu',
      header: 'GPU',
      minWidth: 100,
      render: (_: unknown, row: (typeof MOCK_NODES)[0]) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-body-sm">{row.gpu}</span>
          <span className="text-body-xs text-[var(--color-text-subtle)]">{row.gpuDetail}</span>
        </div>
      ),
    },
  ];

  return (
    <VStack gap={3}>
      <HStack gap={2} align="center">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Find experiments tools with filters"
          size="sm"
          className="w-[280px]"
        />
        <Button
          variant="secondary"
          size="sm"
          icon={<IconDownload size={12} />}
          aria-label="Download"
        />
      </HStack>
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={4} />
      <Table columns={columns} data={MOCK_NODES} rowKey="id" />
    </VStack>
  );
}

// ─── Usage Trend Tab ─────────────────────────────────────────────────────────

function UsageTrendTab() {
  const [metrics, setMetrics] = useState({ all: false, request: true, limits: true, usage: true });
  const [selectedNodes, setSelectedNodes] = useState<string[]>(NODE_NAMES.slice(0, 10));

  const timeLabels = Array.from({ length: 30 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

  const chartOption = {
    grid: { top: 30, right: 20, bottom: 40, left: 50 },
    xAxis: {
      type: 'category' as const,
      data: timeLabels,
      axisLabel: { fontSize: 9, color: chartColors.slate400, rotate: 45 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: 600,
      axisLabel: { fontSize: 10, color: chartColors.slate400, formatter: '{value}%' },
      splitLine: { lineStyle: { color: chartColors.slate100 } },
    },
    series: NODE_NAMES.slice(0, 10).map((name, i) => ({
      name,
      type: 'line' as const,
      data: timeLabels.map(() => Math.floor(Math.random() * 400) + 50),
      lineStyle: { width: 1.5, color: [...primaryChartColors, ...extendedChartColors][i % 10] },
      itemStyle: { color: [...primaryChartColors, ...extendedChartColors][i % 10] },
      symbol: 'none',
      smooth: false,
    })),
    tooltip: { trigger: 'axis' as const },
    legend: { show: false },
  };

  return (
    <VStack gap={4}>
      <VStack gap={1}>
        <span className="text-heading-h6 text-[var(--color-text-default)]">Usage Trend</span>
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          Average usage across all cluster nodes. Click a card to view the detailed trend for that
          resource.
        </span>
      </VStack>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'CPU', avg: '11%', min: '97%', max: '214%', color: primaryChartColors[0] },
          { label: 'Memory', avg: '70%', min: '40%', max: '80%', color: primaryChartColors[1] },
          { label: 'Disk', avg: '94%', min: '77%', max: '100%', color: primaryChartColors[2] },
          {
            label: 'GPU memory',
            avg: '94%',
            min: '77%',
            max: '100%',
            color: primaryChartColors[3],
          },
        ].map((card) => (
          <div
            key={card.label}
            className="p-3 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] cursor-pointer hover:border-[var(--color-border-focus)]"
          >
            <VStack gap={2}>
              <span className="text-body-md font-medium text-[var(--color-text-default)]">
                {card.label}
              </span>
              <div
                className="w-full h-1 rounded-full"
                style={{ backgroundColor: `${card.color}30` }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${parseInt(card.avg)}%`, backgroundColor: card.color }}
                />
              </div>
              <HStack gap={2} className="text-body-xs text-[var(--color-text-subtle)]">
                <span>24h Average: {card.avg}</span>
                <span>Min: {card.min}</span>
                <span>Max: {card.max}</span>
              </HStack>
            </VStack>
          </div>
        ))}
      </div>

      {/* Metrics Selection */}
      <SectionCard>
        <SectionCard.Header title="Metrics" />
        <SectionCard.Content>
          <span className="text-body-sm text-[var(--color-text-subtle)] mb-2 block">
            Select metrics to display on the chart. Multiple selections are supported.
          </span>
          <HStack gap={4}>
            <Checkbox
              label="All"
              checked={metrics.all}
              onChange={(e) =>
                setMetrics({ ...metrics, all: (e.target as HTMLInputElement).checked })
              }
            />
            <Checkbox
              label="Request"
              checked={metrics.request}
              onChange={(e) =>
                setMetrics({ ...metrics, request: (e.target as HTMLInputElement).checked })
              }
            />
            <Checkbox
              label="Limits"
              checked={metrics.limits}
              onChange={(e) =>
                setMetrics({ ...metrics, limits: (e.target as HTMLInputElement).checked })
              }
            />
            <Checkbox
              label="Usage"
              checked={metrics.usage}
              onChange={(e) =>
                setMetrics({ ...metrics, usage: (e.target as HTMLInputElement).checked })
              }
            />
          </HStack>
        </SectionCard.Content>
      </SectionCard>

      {/* Time Range */}
      <SectionCard>
        <SectionCard.Header title="Time range" />
        <SectionCard.Content>
          <span className="text-body-sm text-[var(--color-text-subtle)] mb-2 block">
            Set the duration and data collection interval. You can query up to 168 hours (7 days).
            Click Apply after setting.
          </span>
          <HStack gap={3} align="center" className="flex-wrap">
            <HStack gap={1} align="center">
              <div className="w-3 h-3 rounded-full bg-[var(--color-action-primary)]" />
              <span className="text-body-sm">Current Time</span>
            </HStack>
            <span className="text-body-sm text-[var(--color-text-subtle)]">Custom Date</span>
          </HStack>
          <HStack gap={3} align="center" className="mt-2">
            <span className="text-body-sm">Duration</span>
            <input
              className="w-12 h-7 border border-[var(--color-border-default)] rounded px-2 text-body-sm"
              defaultValue="1"
            />
            <span className="text-body-sm">hours</span>
            <span className="text-body-sm ml-2">Interval</span>
            <input
              className="w-12 h-7 border border-[var(--color-border-default)] rounded px-2 text-body-sm"
              defaultValue="1"
            />
            <span className="text-body-sm">minutes</span>
            <span className="text-body-sm ml-2">Quick select:</span>
            {['1h', '3h', '1d', '1w', 'Period'].map((q) => (
              <button
                key={q}
                className="px-2 py-1 text-body-sm rounded border border-[var(--color-border-default)] hover:bg-[var(--color-surface-hover)]"
              >
                {q}
              </button>
            ))}
            <Button
              variant="secondary"
              size="sm"
              icon={<IconRefresh size={12} />}
              aria-label="Refresh"
            />
          </HStack>
        </SectionCard.Content>
      </SectionCard>

      {/* Node List + Chart */}
      <div className="grid grid-cols-[240px_1fr] gap-4">
        <VStack gap={2}>
          <span className="text-heading-h6 text-[var(--color-text-default)]">Lode list</span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            Select up to 15 nodes
          </span>
          <VStack gap={1}>
            {NODE_NAMES.slice(0, 10).map((name, i) => (
              <Checkbox
                key={i}
                label={name.length > 8 ? 'Lable' : name}
                checked={selectedNodes.includes(name)}
                onChange={() => {
                  setSelectedNodes((prev) =>
                    prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
                  );
                }}
              />
            ))}
          </VStack>
        </VStack>
        <VStack gap={2}>
          <span className="text-heading-h6 text-[var(--color-text-default)]">CPU Usage Trend</span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            Select up to 15 nodes
          </span>
          <ReactECharts option={chartOption} style={{ height: 320 }} />
        </VStack>
      </div>

      {/* Color Legend */}
      <VStack gap={2}>
        <span className="text-body-md font-medium">Color Legend</span>
        <div className="grid grid-cols-5 gap-2">
          {NODE_NAMES.map((name, i) => (
            <HStack key={i} gap={1} align="center">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: [...primaryChartColors, ...extendedChartColors][i % 10] }}
              />
              <span className="text-body-xs text-[var(--color-text-subtle)] truncate">{name}</span>
            </HStack>
          ))}
        </div>
      </VStack>
    </VStack>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function MonitoringPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Monitoring');
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
          breadcrumb={<Breadcrumb items={[{ label: 'Operations' }, { label: 'Monitoring' }]} />}
          actions={<AiPlatformTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={3}>
        <PageHeader
          title="Monitoring"
          actions={
            <HStack gap={2}>
              <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
                Refresh
              </Button>
              <Button variant="primary" size="sm">
                Export to excel
              </Button>
            </HStack>
          }
        />

        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="nodes">Nodes</Tab>
            <Tab value="usage">Usage Trend</Tab>
          </TabList>

          <TabPanel value="overview">
            <OverviewTab />
          </TabPanel>
          <TabPanel value="nodes">
            <NodesTab />
          </TabPanel>
          <TabPanel value="usage">
            <UsageTrendTab />
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}

export default MonitoringPage;
