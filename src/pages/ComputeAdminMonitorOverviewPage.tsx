import { useState, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Badge,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  MonitoringToolbar,
  PageShell,
  PageHeader,
  ProgressBar,
  Tabs,
  TabList,
  Tab,
  STATUS_THRESHOLDS,
  type TimeRangeValue,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate } from 'react-router-dom';
import {
  ChartWithFullScreen,
  chartColors as baseChartColors,
} from '@/pages/design-system-sections/ChartComponents';

const chartColors = { ...baseChartColors, orange400: '#f97316' };

function resolvedChartColor(cssVar: string, chartFallback: string): string {
  if (typeof window === 'undefined') return chartFallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  return v || chartFallback;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const hostUsageData = [
  {
    name: 'node1',
    cpuUsed: 4,
    cpuTotal: 8,
    ramUsed: 4,
    ramTotal: 8,
    cpuPercent: 50,
    ramPercent: 50,
  },
  {
    name: 'node2',
    cpuUsed: 22,
    cpuTotal: 32,
    ramUsed: 22,
    ramTotal: 32,
    cpuPercent: 69,
    ramPercent: 69,
  },
  {
    name: 'node3',
    cpuUsed: 4,
    cpuTotal: 6,
    ramUsed: 4,
    ramTotal: 6,
    cpuPercent: 67,
    ramPercent: 67,
  },
  {
    name: 'node4',
    cpuUsed: 6,
    cpuTotal: 8,
    ramUsed: 6,
    ramTotal: 8,
    cpuPercent: 75,
    ramPercent: 75,
  },
  {
    name: 'node5',
    cpuUsed: 6,
    cpuTotal: 8,
    ramUsed: 6,
    ramTotal: 8,
    cpuPercent: 75,
    ramPercent: 75,
  },
];

const diskIOPSHosts = [
  {
    name: 'host-01',
    total: [100, 200, 250, 350, 300, 550],
    read: [50, 100, 120, 180, 150, 280],
    write: [50, 100, 130, 170, 150, 270],
  },
  {
    name: 'host-02',
    total: [200, 250, 300, 350, 250, 400],
    read: [100, 130, 150, 180, 130, 200],
    write: [100, 120, 150, 170, 120, 200],
  },
  {
    name: 'host-03',
    total: [150, 200, 280, 300, 220, 300],
    read: [80, 100, 140, 160, 110, 150],
    write: [70, 100, 140, 140, 110, 150],
  },
  {
    name: 'host-04',
    total: [80, 100, 150, 200, 180, 200],
    read: [40, 50, 80, 100, 90, 100],
    write: [40, 50, 70, 100, 90, 100],
  },
];

const networkIOHosts = [
  {
    name: 'host-01',
    total: [100, 200, 250, 350, 300, 550],
    receive: [50, 100, 120, 180, 150, 280],
    transmit: [50, 100, 130, 170, 150, 270],
  },
  {
    name: 'host-02',
    total: [200, 250, 300, 350, 250, 400],
    receive: [100, 130, 150, 180, 130, 200],
    transmit: [100, 120, 150, 170, 120, 200],
  },
  {
    name: 'host-03',
    total: [150, 200, 280, 300, 220, 300],
    receive: [80, 100, 140, 160, 110, 150],
    transmit: [70, 100, 140, 140, 110, 150],
  },
  {
    name: 'host-04',
    total: [80, 100, 150, 200, 180, 200],
    receive: [40, 50, 80, 100, 90, 100],
    transmit: [40, 50, 70, 100, 90, 100],
  },
];

/* ----------------------------------------
   Card Components
   ---------------------------------------- */

function GaugeCard({
  title,
  value,
  used,
  total,
  unit,
}: {
  title: string;
  value: number;
  used: number;
  total: number;
  unit?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Chart dimensions (matching design system)
  const chartWidth = 180;
  const chartHeight = 160;
  const centerX = chartWidth * 0.5;
  const centerY = chartHeight * 0.65;
  const radius = Math.min(chartWidth, chartHeight) * 0.45;
  const arcWidth = 14;
  const innerRadius = radius - arcWidth;
  const outerRadius = radius;

  // Get color from CSS variable
  const getColor = (cssVar: string, fallback: string) => {
    if (typeof window !== 'undefined') {
      const val = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
      return val || fallback;
    }
    return fallback;
  };

  const color = chartColors.orange400;
  const available = total - used;
  const availablePercent = Math.round((available / total) * 100);

  // Check if mouse is over the gauge arc
  const isOverGaugeArc = (mx: number, my: number) => {
    const dx = mx - centerX;
    const dy = my - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < innerRadius - 4 || distance > outerRadius + 4) return false;

    let angle = Math.atan2(-dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    return angle >= 150 && angle <= 330;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      const chartX = relX - 16;
      const chartY = relY - 16;

      setMousePos({ x: relX, y: relY });
      setShowTooltip(isOverGaugeArc(chartX, chartY));
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const getOption = () => ({
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        center: ['50%', '65%'],
        radius: '90%',
        min: 0,
        max: 100,
        axisLine: {
          lineStyle: {
            width: 14,
            color: [
              [value / 100, color],
              [1, getColor('--color-border-subtle', '#f1f5f9')],
            ],
          },
        },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        title: { show: false },
        detail: { show: false },
      },
    ],
  });

  return (
    <div
      ref={containerRef}
      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-4 flex-1 relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="chartTitle">{title}</span>
      <div className="relative flex justify-center">
        <div className="relative">
          <ReactECharts
            option={getOption()}
            style={{ height: '160px', width: '180px' }}
            opts={{ devicePixelRatio: window.devicePixelRatio }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
            <span className="text-heading-h3 leading-[28px] text-[var(--color-text-default)]">
              {value}%
            </span>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              {used}
              {unit ? ` ${unit}` : ''}/{total}
              {unit ? ` ${unit}` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute z-10 backdrop-blur-[40px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] shadow-sm px-2 py-1.5 flex flex-col gap-1 pointer-events-none"
          style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-[5px] h-[5px] rounded-[1px]" style={{ backgroundColor: color }} />
            <span className="text-body-sm leading-[14px] text-[var(--color-text-default)] whitespace-nowrap">
              Used: {used}
              {unit} ({value}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-[5px] h-[5px] rounded-[1px] bg-[var(--color-border-subtle)]" />
            <span className="text-body-sm leading-[14px] text-[var(--color-text-default)] whitespace-nowrap">
              Available: {available.toFixed(1)}
              {unit} ({availablePercent}%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function PieChartCard({
  title,
  upCount,
  downCount,
}: {
  title: string;
  upCount: number;
  downCount: number;
}) {
  const total = upCount + downCount;
  const upPercent = Math.round((upCount / total) * 100);
  const downPercent = Math.round((downCount / total) * 100);

  const legendData = [
    { label: 'Up', value: upPercent, color: chartColors.emerald400 },
    { label: 'Down', value: downPercent, color: chartColors.red400 },
  ];

  const getOption = () => ({
    tooltip: {
      show: true,
      trigger: 'item',
      backgroundColor: resolvedChartColor('--color-surface-default', '#ffffff'),
      borderColor: resolvedChartColor('--color-border-default', '#e2e8f0'),
      borderWidth: 1,
      borderRadius: 6,
      padding: [8, 12],
      textStyle: {
        color: chartColors.slate800,
        fontSize: 11,
        fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
      },
      formatter: (params: {
        marker: string;
        name: string;
        value: number;
        percent: number;
        color: string;
      }) => {
        return `<span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${params.color}; margin-right: 6px;"></span>${params.name}<br/><span style="font-weight: 500; margin-left: 14px;">${params.value} (${params.percent.toFixed(0)}%)</span>`;
      },
    },
    animation: false,
    series: [
      {
        type: 'pie',
        radius: '80%',
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        data: [
          { value: upCount, name: 'Up', itemStyle: { color: chartColors.emerald400 } },
          { value: downCount, name: 'Down', itemStyle: { color: chartColors.red400 } },
        ],
        label: {
          show: true,
          position: 'inside',
          formatter: (params: { percent: number }) => {
            return params.percent >= 15 ? `${params.percent.toFixed(0)}%` : '';
          },
          fontSize: 12,
          fontWeight: 600,
          color: resolvedChartColor('--color-text-on-primary', '#ffffff'),
          fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        emphasis: {
          scale: true,
          scaleSize: 5,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
        labelLine: { show: false },
      },
    ],
  });

  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-4 flex-1">
      <span className="chartTitle">{title}</span>
      <div className="flex justify-center">
        <ReactECharts
          option={getOption()}
          style={{ height: '180px', width: '180px' }}
          opts={{ devicePixelRatio: window.devicePixelRatio }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center">
        {legendData.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-body-sm text-[var(--color-text-muted)]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HostUsageCard({
  title,
  data,
  type,
}: {
  title: string;
  data: typeof hostUsageData;
  type: 'cpu' | 'ram';
}) {
  const getBadgeTheme = (percent: number): 'red' | 'yellow' | 'green' => {
    if (percent >= 100) return 'red';
    if (percent >= 70) return 'yellow';
    return 'green';
  };

  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-2xl p-4 flex-1">
      <div className="chartTitle mb-4">{title}</div>
      <div className="space-y-[22px]">
        {data.map((node) => {
          const used = type === 'cpu' ? node.cpuUsed : node.ramUsed;
          const total = type === 'cpu' ? node.cpuTotal : node.ramTotal;
          const percent = type === 'cpu' ? node.cpuPercent : node.ramPercent;
          return (
            <div key={node.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-label-sm text-[var(--color-text-default)]">{node.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-body-sm text-[var(--color-text-muted)]">
                    {used}/{total} GiB
                  </span>
                  <Badge size="sm" type="subtle" theme={getBadgeTheme(percent)}>
                    {percent}%
                  </Badge>
                </div>
              </div>
              <ProgressBar
                variant="quota"
                value={used}
                max={total}
                showValue={false}
                thresholds={STATUS_THRESHOLDS.computeAdmin}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const hostChartColors = [
  baseChartColors.cyan400,
  baseChartColors.emerald400,
  baseChartColors.amber400,
  baseChartColors.violet400,
];

function TabbedAreaChartCard({
  title,
  tabs,
  hosts,
  yAxisUnit,
}: {
  title: string;
  tabs: { value: string; label: string; dataKey: string }[];
  hosts: { name: string; [key: string]: string | number[] }[];
  yAxisUnit: string;
}) {
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  const activeDataKey = tabs.find((t) => t.value === activeTab)?.dataKey ?? tabs[0].dataKey;
  const chartSeries = hosts.map((host, index) => ({
    name: host.name,
    data: host[activeDataKey] as number[],
    color: hostChartColors[index % hostChartColors.length],
  }));

  return (
    <ChartWithFullScreen
      title={title}
      series={chartSeries}
      yAxisFormatter={(v: number) => `${v} ${yAxisUnit}`}
      subHeader={
        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            {tabs.map((tab) => (
              <Tab key={tab.value} value={tab.value}>
                {tab.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      }
    />
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export default function ComputeAdminMonitorOverviewPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [timeRange, setTimeRange] = useState<TimeRangeValue>('1h');

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [{ label: 'Monitor Overview' }];

  const timeRangeOptions = [
    { label: '1h', value: '1h' as TimeRangeValue },
    { label: '3h', value: '3h' as TimeRangeValue },
    { label: '1d', value: '1d' as TimeRangeValue },
    { label: '1w', value: '1w' as TimeRangeValue },
  ];

  return (
    <PageShell
      sidebar={
        <ComputeAdminSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        {/* Page Header */}
        <PageHeader title="Monitor Overview" />

        {/* Monitoring Toolbar */}
        <MonitoringToolbar
          timeRangeOptions={timeRangeOptions}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onRefresh={() => console.log('Refresh')}
        />

        {/* Row 1: Gauge Charts + Pie Chart */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
          <GaugeCard title="Physical CPU usage" value={70} used={7} total={10} unit="vCPU" />
          <GaugeCard title="Total RAM usage" value={70} used={8} total={10} unit="GiB" />
          <GaugeCard title="Physical storage usage" value={70} used={8} total={10} unit="TiB" />
          <PieChartCard title="Compute node status" upCount={5} downCount={5} />
        </div>

        {/* Row 3: Host Usage Charts */}
        <div className="flex gap-6">
          <HostUsageCard title="Host CPU usage" data={hostUsageData} type="cpu" />
          <HostUsageCard title="Host RAM usage" data={hostUsageData} type="ram" />
        </div>

        {/* Row 4: Area Charts */}
        <div className="flex gap-6">
          <TabbedAreaChartCard
            title="Host disk average IOPS"
            tabs={[
              { value: 'total', label: 'Total', dataKey: 'total' },
              { value: 'read', label: 'Read', dataKey: 'read' },
              { value: 'write', label: 'Write', dataKey: 'write' },
            ]}
            hosts={diskIOPSHosts}
            yAxisUnit="ops/s"
          />
          <TabbedAreaChartCard
            title="Host average network IO"
            tabs={[
              { value: 'total', label: 'Total', dataKey: 'total' },
              { value: 'receive', label: 'Receive', dataKey: 'receive' },
              { value: 'transmit', label: 'Transmit', dataKey: 'transmit' },
            ]}
            hosts={networkIOHosts}
            yAxisUnit="KB/s"
          />
        </div>
      </VStack>
    </PageShell>
  );
}
