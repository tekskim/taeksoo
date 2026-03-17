import { useState, useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  MonitoringToolbar,
  PageShell,
} from '@/design-system';
import type { TimeRangeValue } from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconDotsCircleHorizontal,
  IconArrowsMaximize,
  IconArrowsMinimize,
} from '@tabler/icons-react';
import { DataViewDrawer } from '@/components/DataViewDrawer';
import { chartColors } from '@/pages/design-system-sections/ChartComponents';

/* ----------------------------------------
   Line Chart Component (Design system Style)
   ---------------------------------------- */
interface LineChartSeries {
  name: string;
  data: number[];
  color: string;
}

interface LineChartProps {
  title: string;
  series: LineChartSeries[];
  timeLabels: string[];
  yAxisFormatter?: (value: number) => string;
  height?: string;
  isFullScreen?: boolean;
  timeControls?: React.ReactNode;
  onExpandClick?: () => void;
  onExitFullScreen?: () => void;
}

function LineChart({
  title,
  series,
  timeLabels,
  yAxisFormatter = (v: number) => `${v}`,
  height = '100%',
  isFullScreen = false,
  timeControls,
  onExpandClick,
  onExitFullScreen,
}: LineChartProps) {
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>(
    Object.fromEntries(series.map((s) => [s.name, true]))
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDataView, setShowDataView] = useState(false);

  // Detect dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const allVisible = Object.values(visibleSeries).every((v) => v);
  const toggleAll = () => {
    const newState = !allVisible;
    setVisibleSeries(Object.fromEntries(series.map((s) => [s.name, newState])));
  };

  // Get theme-aware colors
  const splitLineColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : chartColors.slate100;
  const splitLineOpacity = isDarkMode ? 1 : 0.5;
  const tooltipBg = isDarkMode ? '#1C1C1C' : 'white';
  const tooltipBorder = isDarkMode ? '#333333' : '#e2e8f0';
  const tooltipTextColor = isDarkMode ? '#e5e5e5' : chartColors.slate800;

  // Calculate max value for exactly 5 Y-axis labels (4 intervals) with nice numbers
  const allData = series.filter((s) => visibleSeries[s.name]).flatMap((s) => s.data);
  const dataMax = Math.max(...allData, 0);

  // Calculate nice interval based on data magnitude
  const rawInterval = dataMax / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval || 1)));
  const normalizedInterval = rawInterval / magnitude;

  // Round UP to nice number to ensure interval covers data: 1, 2, 2.5, 5, 10
  let niceNormalizedInterval;
  if (normalizedInterval <= 1) niceNormalizedInterval = 1;
  else if (normalizedInterval <= 2) niceNormalizedInterval = 2;
  else if (normalizedInterval <= 2.5) niceNormalizedInterval = 2.5;
  else if (normalizedInterval <= 5) niceNormalizedInterval = 5;
  else niceNormalizedInterval = 10;

  const niceInterval = niceNormalizedInterval * magnitude;
  const niceMax = niceInterval * 4; // Always exactly 4 intervals = 5 labels

  const option = {
    animation: false,
    grid: {
      left: '40px',
      right: '16px',
      top: '20px',
      bottom: '16px',
      containLabel: false,
    },
    xAxis: {
      type: 'category' as const,
      data: timeLabels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
      },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: niceMax,
      interval: niceInterval,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: splitLineColor, opacity: splitLineOpacity },
      },
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
        formatter: yAxisFormatter,
      },
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: {
        color: tooltipTextColor,
        fontSize: 11,
        fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
      },
      formatter: (
        params: Array<{
          marker: string;
          seriesName: string;
          value: number;
          axisValueLabel: string;
          color: string;
        }>
      ) => {
        if (!Array.isArray(params) || params.length === 0) return '';
        const time = params[0].axisValueLabel;
        const items = params
          .map(
            (p) =>
              `<div style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${p.color};"></span><span>${p.seriesName}</span><span style="font-weight: 500; margin-left: auto;">${p.value}</span></div>`
          )
          .join('');
        return `<div style="font-size: 11px; font-family: Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif;">${time}<div style="margin-top: 4px;">${items}</div></div>`;
      },
    },
    series: series
      .filter((s) => visibleSeries[s.name])
      .map((s) => ({
        name: s.name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        lineStyle: { color: s.color, width: 1 },
        itemStyle: { color: s.color },
        areaStyle: { color: s.color, opacity: 0.1 },
        data: s.data,
      })),
  };

  return (
    <div className={`chartCard ${isFullScreen ? 'chartCardFullScreen' : ''}`}>
      {/* Header */}
      <div className="chartHeader">
        <span className="chartTitle">{title}</span>
        {isFullScreen && timeControls && <div className="chartHeaderCenter">{timeControls}</div>}
        <div className="chartControls">
          {/* Toggle Button - only show for multiple series */}
          {series.length > 1 && (
            <>
              <button className="toggleBtn" onClick={toggleAll}>
                <span className={`toggleSwitch ${allVisible ? 'toggleSwitchActive' : ''}`} />
                <span>{allVisible ? 'Hide All' : 'View All'}</span>
              </button>
              <span className="toggleDivider">|</span>
            </>
          )}

          {/* Menu Button */}
          <div className="menuContainer">
            <button
              className="menuTrigger"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              <IconDotsCircleHorizontal size={16} stroke={1.5} />
            </button>
            {menuOpen && (
              <div className="contextMenu">
                <button className="contextMenuItem" onClick={() => setMenuOpen(false)}>
                  Download Image
                </button>
                <button className="contextMenuItem" onClick={() => setMenuOpen(false)}>
                  Download CSV
                </button>
                <button
                  className="contextMenuItemLast"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowDataView(true);
                  }}
                >
                  Data View
                </button>
              </div>
            )}
          </div>

          {/* Expand/Minimize Button */}
          <button
            className="expandTrigger"
            title={isFullScreen ? 'Minimize' : 'Expand'}
            onClick={isFullScreen ? onExitFullScreen : onExpandClick}
          >
            {isFullScreen ? (
              <IconArrowsMinimize size={16} stroke={1.5} />
            ) : (
              <IconArrowsMaximize size={16} stroke={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Chart Body */}
      <div className="chartBody">
        <div className="chartWrapper">
          <ReactECharts
            option={option}
            style={{ height: isFullScreen ? '100%' : height }}
            notMerge={true}
          />
        </div>
        <div className="chartLegend">
          {series.map((s, i) => (
            <div
              key={i}
              className={`legendItem ${!visibleSeries[s.name] ? 'legendItemHidden' : ''}`}
              onClick={() => setVisibleSeries((prev) => ({ ...prev, [s.name]: !prev[s.name] }))}
            >
              <div className="legendDot" style={{ backgroundColor: s.color }} />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data View Drawer */}
      <DataViewDrawer
        isOpen={showDataView}
        onClose={() => setShowDataView(false)}
        title={`${title} (RAW)`}
        series={series}
        timeLabels={timeLabels}
      />
    </div>
  );
}

/* ----------------------------------------
   Inventory Stat Box Component
   ---------------------------------------- */
interface InventoryStatBoxProps {
  value: number;
  label: string;
}

function InventoryStatBox({ value, label }: InventoryStatBoxProps) {
  const textColor =
    value === 0 ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-default)]';

  return (
    <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg p-4 border-2 border-transparent transition-colors hover:border-[var(--color-action-primary)] cursor-pointer">
      <div className={`text-heading-h3 ${textColor} pb-1`}>{value}</div>
      <div className="text-body-sm text-[var(--color-text-subtle)]">{label}</div>
    </div>
  );
}

/* ----------------------------------------
   Capacity Gauge Component (Half-Doughnut chart)
   ---------------------------------------- */
interface CapacityGaugeProps {
  percentage: number;
  used: number;
  total: number;
  unit: string;
}

function CapacityGauge({ percentage, used, total, unit }: CapacityGaugeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const gaugeRef = useRef<HTMLDivElement>(null);

  const chartWidth = 180;
  const chartHeight = 160;
  const centerX = chartWidth * 0.5;
  const centerY = chartHeight * 0.65;
  const radius = Math.min(chartWidth, chartHeight) * 0.45;
  const arcWidth = 14;
  const innerRadius = radius - arcWidth;
  const outerRadius = radius;

  const getColor = (cssVar: string, fallback: string) => {
    if (typeof window !== 'undefined') {
      const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
      return value || fallback;
    }
    return fallback;
  };

  const statusColor = () => {
    if (percentage >= 95) return getColor('--color-state-danger', '#ef4444');
    if (percentage >= 85) return getColor('--color-state-warning', '#f97316');
    return getColor('--color-state-success', '#22c55e');
  };

  const usedColor = statusColor();
  const available = total - used;
  const availablePercent = Math.round((available / total) * 100);

  const isOverGaugeArc = (mx: number, my: number) => {
    const dx = mx - centerX;
    const dy = my - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < innerRadius - 4 || distance > outerRadius + 4) return false;
    let angle = Math.atan2(-dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return angle <= 210 || angle >= 330;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gaugeRef.current) {
      const rect = gaugeRef.current.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      setMousePos({ x: relX, y: relY });
      setShowTooltip(isOverGaugeArc(relX, relY));
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
            width: 16,
            color: [
              [percentage / 100, usedColor],
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
    <div className="flex flex-col items-center justify-center h-full gap-6 -mt-9">
      {/* Gauge */}
      <div
        ref={gaugeRef}
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <ReactECharts option={getOption()} style={{ height: '200px', width: '220px' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
          <span className="text-heading-h3 leading-[28px] text-[var(--color-text-default)]">
            {percentage.toFixed(2)}%
          </span>
          <span className="text-body-md text-[var(--color-text-subtle)]">
            {used}
            {unit}/{total}
            {unit}
          </span>
        </div>

        {showTooltip && (
          <div
            className="absolute z-10 backdrop-blur-[40px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-1.5 flex flex-col gap-1 pointer-events-none"
            style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}
          >
            <div className="flex items-center gap-1.5">
              <div
                className="w-[5px] h-[5px] rounded-[1px]"
                style={{ backgroundColor: usedColor }}
              />
              <span className="text-body-sm text-[var(--color-text-default)] whitespace-nowrap">
                Used: {used} {unit} ({Math.round(percentage)}%)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-[5px] h-[5px] rounded-[1px] bg-[var(--chart-color-neutral)]" />
              <span className="text-body-sm text-[var(--color-text-default)] whitespace-nowrap">
                Available: {available.toFixed(1)} {unit} ({availablePercent}%)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center -mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: usedColor }} />
          <span className="text-body-sm text-[var(--color-text-muted)]">
            Used: {used}
            {unit}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm shrink-0 bg-[var(--color-state-warning)]" />
          <span className="text-body-sm text-[var(--color-text-muted)]">Warning: 85%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm shrink-0 bg-[var(--color-state-danger)]" />
          <span className="text-body-sm text-[var(--color-text-muted)]">Danger: 95%</span>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Card Component
   ---------------------------------------- */
interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
}

function Card({
  title,
  children,
  className = '',
  bgColor = 'bg-[var(--color-surface-default)]',
}: CardProps) {
  return (
    <div
      className={`p-4 rounded-2xl border border-[var(--color-border-default)] ${bgColor} ${className}`}
    >
      <h6 className="text-heading-h6 mb-4">{title}</h6>
      {children}
    </div>
  );
}

/* ----------------------------------------
   Main StorageHomePage Component
   ---------------------------------------- */
// Full Screen Chart Data Interface
interface FullScreenChartData {
  title: string;
  series: LineChartSeries[];
  yAxisFormatter?: (value: number) => string;
  timeLabels: string[];
}

export function StorageHomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRangeValue>('30m');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  // Fullscreen chart state
  const [fullScreenChart, setFullScreenChart] = useState<FullScreenChartData | null>(null);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Time labels for charts
  const timeLabels = ['16:00', '16:10', '16:20', '16:30', '16:40', '16:50'];

  // Mock data for IOPS chart
  const iopsSeries: LineChartSeries[] = [
    { name: 'Reads', data: [380, 420, 480, 520, 450, 400], color: chartColors.cyan400 },
    { name: 'Writes', data: [520, 580, 680, 720, 580, 420], color: chartColors.emerald400 },
  ];

  // Mock data for OSD Latencies chart
  const latencySeries: LineChartSeries[] = [
    { name: 'Apply', data: [0, 0, 0, 0.15, 0.28, 0.42], color: chartColors.cyan400 },
    { name: 'Commit', data: [0, 0, 0, 0.18, 0.35, 0.5], color: chartColors.emerald400 },
  ];

  // Mock data for Client Throughput chart
  const clientThroughputSeries: LineChartSeries[] = [
    { name: 'Reads', data: [0.1, 0.8, 2.5, 4.2, 5.8, 6.2], color: chartColors.cyan400 },
    { name: 'Writes', data: [0.1, 0.6, 2.0, 3.8, 5.2, 5.8], color: chartColors.emerald400 },
  ];

  // Mock data for Requests/sec chart
  const requestsSeries: LineChartSeries[] = [
    { name: 'Requests', data: [2, 2, 2, 2, 2, 2], color: chartColors.cyan400 },
  ];

  // Mock data for Latency chart
  const latencyDetailSeries: LineChartSeries[] = [
    { name: 'GET', data: [0, 0.5, 2.0, 3.5, 4.2, 4.8], color: chartColors.cyan400 },
    { name: 'PUT', data: [0, 0.4, 1.8, 3.2, 3.8, 4.2], color: chartColors.emerald400 },
  ];

  // Mock data for Recovery Throughput chart
  const recoveryThroughputSeries: LineChartSeries[] = [
    { name: 'Recovery', data: [0, 0, 0, 0, 0, 0], color: chartColors.cyan400 },
  ];

  return (
    <PageShell
      sidebar={
        <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
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
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb items={[{ label: 'Storage', href: '/storage' }, { label: 'Home' }]} />
          }
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
    >
      {/* EntryPage Content */}
      <div className="py-2">
        {/* Top Row - 2 Cards: Inventory and Capacity */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* INVENTORY */}
          <Card title="Inventory" className="flex flex-col">
            {/* Total */}
            <div className="mb-4">
              <div className="text-heading-h2 text-[var(--color-text-default)]">54</div>
              <div className="text-body-md text-[var(--color-text-subtle)]">Total</div>
            </div>
            {/* Stats Grid */}
            <div className="space-y-2 mt-auto">
              <div className="flex gap-2">
                <InventoryStatBox value={21} label="Pools" />
                <InventoryStatBox value={6} label="Hosts" />
              </div>
              <div className="flex gap-2">
                <InventoryStatBox value={24} label="OSDs" />
                <InventoryStatBox value={3} label="Buckets" />
                <InventoryStatBox value={1} label="Object" />
              </div>
            </div>
          </Card>

          {/* CAPACITY */}
          <Card title="Capacity" className="flex flex-col">
            <CapacityGauge percentage={26.19} used={49.7} total={189.9} unit="TiB" />
          </Card>
        </div>

        {/* CLUSTER UTILIZATION Section */}
        <div className="p-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h6 className="text-heading-h6">Cluster Utilization</h6>
            <MonitoringToolbar
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              onRefresh={() => console.log('Refresh clicked')}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* IOPS Chart */}
            <LineChart
              title="IOPS"
              series={iopsSeries}
              timeLabels={timeLabels}
              height="280px"
              onExpandClick={() =>
                setFullScreenChart({ title: 'IOPS', series: iopsSeries, timeLabels })
              }
            />

            {/* OSD Latencies Chart */}
            <LineChart
              title="OSD Latencies"
              series={latencySeries}
              timeLabels={timeLabels}
              yAxisFormatter={(v) => `${v} ms`}
              height="280px"
              onExpandClick={() =>
                setFullScreenChart({
                  title: 'OSD Latencies',
                  series: latencySeries,
                  yAxisFormatter: (v) => `${v} ms`,
                  timeLabels,
                })
              }
            />

            {/* Client Throughput Chart */}
            <LineChart
              title="Client throughput"
              series={clientThroughputSeries}
              timeLabels={timeLabels}
              yAxisFormatter={(v) => `${v} MiB/s`}
              height="280px"
              onExpandClick={() =>
                setFullScreenChart({
                  title: 'Client Throughput',
                  series: clientThroughputSeries,
                  yAxisFormatter: (v) => `${v} MiB/s`,
                  timeLabels,
                })
              }
            />

            {/* Requests/sec Chart */}
            <LineChart
              title="Requests/sec"
              series={requestsSeries}
              timeLabels={timeLabels}
              height="280px"
              onExpandClick={() =>
                setFullScreenChart({
                  title: 'Requests/sec',
                  series: requestsSeries,
                  timeLabels,
                })
              }
            />

            {/* Latency Chart */}
            <LineChart
              title="Latency"
              series={latencyDetailSeries}
              timeLabels={timeLabels}
              yAxisFormatter={(v) => `${v} ms`}
              height="280px"
              onExpandClick={() =>
                setFullScreenChart({
                  title: 'Latency',
                  series: latencyDetailSeries,
                  yAxisFormatter: (v) => `${v} ms`,
                  timeLabels,
                })
              }
            />

            {/* Recovery Throughput Chart */}
            <LineChart
              title="Recovery throughput"
              series={recoveryThroughputSeries}
              timeLabels={timeLabels}
              yAxisFormatter={(v) => `${v} B/s`}
              height="280px"
              onExpandClick={() =>
                setFullScreenChart({
                  title: 'Recovery Throughput',
                  series: recoveryThroughputSeries,
                  yAxisFormatter: (v) => `${v} B/s`,
                  timeLabels,
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Full Screen Chart Overlay */}
      {fullScreenChart && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-8">
          <div className="w-full max-w-[90vw] h-[70vh] flex items-center justify-center">
            <LineChart
              title={fullScreenChart.title}
              series={fullScreenChart.series}
              timeLabels={fullScreenChart.timeLabels}
              yAxisFormatter={fullScreenChart.yAxisFormatter}
              isFullScreen={true}
              timeControls={
                <MonitoringToolbar timeRange={timeRange} onTimeRangeChange={setTimeRange} />
              }
              onExitFullScreen={() => setFullScreenChart(null)}
            />
          </div>
        </div>
      )}
    </PageShell>
  );
}

export default StorageHomePage;
