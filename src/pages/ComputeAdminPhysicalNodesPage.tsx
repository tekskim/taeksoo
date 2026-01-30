import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ReactECharts from 'echarts-for-react';
import {
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  MonitoringToolbar,
  Select,
  type TimeRangeValue,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';
import { DataViewDrawer } from '@/components/DataViewDrawer';

/* ----------------------------------------
   Chart Colors
   ---------------------------------------- */

const chartColors = {
  cyan400: '#22d3ee',
  emerald400: '#34d399',
  amber400: '#fbbf24',
  orange400: '#f97316',
  red400: '#f87171',
  violet400: '#a78bfa',
  slate100: '#f1f5f9',
  slate400: '#94a3b8',
  slate800: '#1e293b',
};

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const timeLabels = ['16:00', '16:10', '16:20', '16:30', '16:40', '16:50'];

const cpuUsageData = {
  idle: [20, 25, 30, 25, 20, 25],
  iowait: [5, 8, 10, 8, 5, 8],
  system: [15, 18, 20, 18, 15, 18],
  user: [30, 35, 40, 35, 30, 35],
};

const ramUsageData = {
  used: [1500, 1600, 1700, 1650, 1550, 1600],
  free: [500, 400, 300, 350, 450, 400],
};

const diskIOPSData = {
  read: [300, 350, 400, 380, 320, 350],
  write: [200, 250, 300, 280, 220, 250],
};

const diskUsageData = {
  usage: [40, 42, 45, 44, 41, 43],
};

const systemLoadData = {
  node4: [0.5, 0.6, 0.7, 0.8, 0.7, 0.6],
  node5: [0.4, 0.5, 0.6, 0.7, 0.6, 0.5],
  node6: [0.3, 0.4, 0.5, 0.6, 0.5, 0.4],
};

const networkTrafficData = {
  receive: [400, 450, 500, 480, 420, 450],
  transmit: [300, 350, 400, 380, 320, 350],
};

const tcpConnectionsData = {
  connections: [100, 120, 150, 140, 110, 130],
};

const networkErrorsData = {
  errors: [0, 1, 2, 1, 0, 1],
};

const networkDroppedData = {
  receive: [0, 1, 2, 3, 2, 1],
  transmit: [1, 2, 3, 2, 1, 2],
};

/* ----------------------------------------
   Card Components
   ---------------------------------------- */

function StatCard({
  title,
  value,
  unit,
}: {
  title: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-5 flex-1 min-w-0">
      <div className="mb-4">
        <span className="chartTitle">{title}</span>
      </div>
      <div className="flex items-baseline justify-center gap-1 font-medium">
        <span className="text-[40px] font-normal leading-[48px] text-[var(--color-text-default)]">
          {value}
        </span>
        {unit && <span className="text-body-lg text-[var(--color-text-muted)]">{unit}</span>}
      </div>
    </div>
  );
}

function FileSystemCard() {
  const filesystems = [
    { name: '/dev/sda1', used: 4.9, total: 8, percent: 61 },
    { name: '/dev/sda3/boot', used: 22.12, total: 25, percent: 88 },
  ];

  const getColors = (percent: number) => {
    if (percent >= 100)
      return {
        bg: 'bg-[var(--color-status-error)]/15',
        text: 'text-[var(--color-status-error)]',
      };
    if (percent >= 70)
      return {
        bg: 'bg-[var(--color-status-warning)]/15',
        text: 'text-[var(--color-status-warning)]',
      };
    return {
      bg: 'bg-[var(--color-status-success)]/15',
      text: 'text-[var(--color-status-success)]',
    };
  };

  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-2xl p-4 flex-1 min-w-0">
      <div className="chartTitle mb-4">File System Used Space</div>
      <div className="space-y-[22px]">
        {filesystems.map((fs) => {
          const colors = getColors(fs.percent);
          return (
            <div key={fs.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-label-sm text-[var(--color-text-default)]">{fs.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-body-sm text-[var(--color-text-muted)]">
                    {fs.used}/{fs.total} GiB
                  </span>
                  <div className={`flex items-center px-1.5 py-0.5 rounded-md ${colors.bg}`}>
                    <span className={`text-label-sm ${colors.text}`}>{fs.percent}%</span>
                  </div>
                </div>
              </div>
              <div className="h-[3px] rounded-sm bg-[var(--color-surface-muted)] overflow-hidden">
                <div
                  className="h-full rounded-sm bg-[var(--color-text-muted)] transition-all"
                  style={{ width: `${Math.min(fs.percent, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AreaChartCard({
  title,
  labels,
  series,
  colors,
  legendLabels,
  yAxisUnit,
  stacked = false,
  dropdown,
  onDropdownChange,
  dropdownOptions,
}: {
  title: string;
  labels: string[];
  series: number[][];
  colors: string[];
  legendLabels: string[];
  yAxisUnit?: string;
  stacked?: boolean;
  dropdown?: string;
  onDropdownChange?: (value: string) => void;
  dropdownOptions?: { value: string; label: string }[];
}) {
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>(
    Object.fromEntries(legendLabels.map((label) => [label, true]))
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDataView, setShowDataView] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenTimeRange, setFullScreenTimeRange] = useState<TimeRangeValue>('1h');

  const fullScreenTimeRangeOptions = [
    { label: '1h', value: '1h' as TimeRangeValue },
    { label: '3h', value: '3h' as TimeRangeValue },
    { label: '1d', value: '1d' as TimeRangeValue },
    { label: '1w', value: '1w' as TimeRangeValue },
  ];

  const allVisible = Object.values(visibleSeries).every((v) => v);
  const toggleAll = () => {
    const newState = !allVisible;
    setVisibleSeries(Object.fromEntries(legendLabels.map((label) => [label, newState])));
  };

  // Close fullscreen on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  // Convert series data to format expected by DataViewDrawer
  const drawerSeries = legendLabels.map((label, index) => ({
    name: label,
    data: series[index],
    color: colors[index],
  }));

  const getOption = () => ({
    animation: false,
    grid: { left: '0', right: '16px', top: '20px', bottom: '16px', containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: chartColors.slate400, fontSize: 10, padding: [0, 0, 0, 15] },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value' as const,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: chartColors.slate100, opacity: 0.5 } },
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
        formatter: yAxisUnit ? (value: number) => `${value}${yAxisUnit}` : undefined,
      },
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'white',
      borderColor: '#e2e8f0',
      textStyle: { color: chartColors.slate800, fontSize: 11 },
    },
    series: series
      .filter((_, index) => visibleSeries[legendLabels[index]])
      .map((data, filteredIndex) => {
        const actualIndex = legendLabels.indexOf(
          legendLabels.filter((l) => visibleSeries[l])[filteredIndex]
        );
        return {
          name: legendLabels[actualIndex],
          type: 'line',
          data,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          showSymbol: false,
          stack: stacked ? 'total' : undefined,
          lineStyle: { color: colors[actualIndex], width: 1 },
          itemStyle: { color: colors[actualIndex] },
          areaStyle: { color: colors[actualIndex], opacity: 0.1 },
        };
      }),
  });

  // Render chart content with unique key to force fresh re-render
  const renderChartContent = (mode: 'normal' | 'fullscreen') => (
    <div
      key={`chart-container-${mode}`}
      className={`chartCard flex-1 min-w-0 ${mode === 'fullscreen' ? 'chartCardFullScreen' : ''}`}
      style={mode === 'normal' && isFullScreen ? { visibility: 'hidden' } : undefined}
    >
      {/* Header */}
      <div className="chartHeader">
        <div className="flex items-center gap-2">
          <span className="chartTitle">{title}</span>
          {dropdown && dropdownOptions && onDropdownChange && mode !== 'fullscreen' && (
            <div className="w-[100px]">
              <Select
                options={dropdownOptions}
                value={dropdown}
                onChange={(val) => onDropdownChange(val as string)}
                size="sm"
              />
            </div>
          )}
        </div>
        {/* Fullscreen Toolbar - centered */}
        {mode === 'fullscreen' && (
          <div className="chartHeaderCenter">
            <MonitoringToolbar
              timeRangeOptions={fullScreenTimeRangeOptions}
              timeRange={fullScreenTimeRange}
              onTimeRangeChange={setFullScreenTimeRange}
              onRefresh={() => console.log('Refresh chart')}
            />
          </div>
        )}
        <div className="chartControls">
          {/* Toggle Button - only show for multiple series */}
          {legendLabels.length > 1 && (
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
                  View Data
                </button>
              </div>
            )}
          </div>
          {/* Expand Button */}
          <button
            className="expandTrigger"
            title={mode === 'fullscreen' ? 'Minimize' : 'Expand'}
            onClick={() => setIsFullScreen(mode !== 'fullscreen')}
          >
            {mode === 'fullscreen' ? (
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
            key={`echart-${mode}`}
            option={getOption()}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            opts={{ devicePixelRatio: window.devicePixelRatio }}
          />
        </div>
        <div className="chartLegend">
          {legendLabels.map((label, index) => (
            <div
              key={label}
              className={`legendItem ${!visibleSeries[label] ? 'legendItemHidden' : ''}`}
              onClick={() => setVisibleSeries((prev) => ({ ...prev, [label]: !prev[label] }))}
            >
              <div className="legendDot" style={{ backgroundColor: colors[index] }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Normal mode - always render in place */}
      {renderChartContent('normal')}

      {/* Fullscreen mode - render via portal to document.body */}
      {isFullScreen &&
        createPortal(
          <>
            <div className="fullScreenOverlay" onClick={() => setIsFullScreen(false)} />
            <div className="fullScreenFloating">{renderChartContent('fullscreen')}</div>
          </>,
          document.body
        )}

      {/* Data View Drawer */}
      <DataViewDrawer
        isOpen={showDataView}
        onClose={() => setShowDataView(false)}
        title={`${title} (RAW)`}
        series={drawerSeries}
        timeLabels={labels}
      />
    </>
  );
}

function SystemLoadCard() {
  const [selectedNodes, setSelectedNodes] = useState<Record<string, boolean>>({
    node4: true,
    node5: true,
    node6: true,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDataView, setShowDataView] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const colors = {
    node4: chartColors.cyan400,
    node5: chartColors.emerald400,
    node6: chartColors.orange400,
  };

  const allVisible = Object.values(selectedNodes).every((v) => v);
  const toggleAll = () => {
    const newState = !allVisible;
    setSelectedNodes(
      Object.fromEntries(Object.keys(selectedNodes).map((node) => [node, newState]))
    );
  };

  // Close fullscreen on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  // Convert series data to format expected by DataViewDrawer
  const drawerSeries = Object.entries(colors).map(([node, color]) => ({
    name: node,
    data: systemLoadData[node as keyof typeof systemLoadData],
    color,
  }));

  const getOption = () => {
    const activeSeries = Object.entries(selectedNodes)
      .filter(([, active]) => active)
      .map(([node]) => ({
        name: node,
        type: 'line',
        data: systemLoadData[node as keyof typeof systemLoadData],
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        lineStyle: { color: colors[node as keyof typeof colors], width: 1 },
        itemStyle: { color: colors[node as keyof typeof colors] },
        areaStyle: { color: colors[node as keyof typeof colors], opacity: 0.1 },
      }));

    return {
      animation: false,
      grid: { left: '0', right: '16px', top: '20px', bottom: '16px', containLabel: true },
      xAxis: {
        type: 'category' as const,
        data: timeLabels,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: chartColors.slate400, fontSize: 10, padding: [0, 0, 0, 15] },
        boundaryGap: false,
      },
      yAxis: {
        type: 'value' as const,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: chartColors.slate100, opacity: 0.5 } },
        axisLabel: { color: chartColors.slate400, fontSize: 10 },
      },
      tooltip: {
        trigger: 'axis' as const,
        backgroundColor: 'white',
        borderColor: '#e2e8f0',
        textStyle: { color: chartColors.slate800, fontSize: 11 },
      },
      series: activeSeries,
    };
  };

  const chartContent = (
    <div className={`chartCard ${isFullScreen ? 'chartCardFullScreen' : ''}`}>
      {/* Header */}
      <div className="chartHeader">
        <span className="chartTitle">System Load</span>
        <div className="chartControls">
          <button className="toggleBtn" onClick={toggleAll}>
            <span className={`toggleSwitch ${allVisible ? 'toggleSwitchActive' : ''}`} />
            <span>{allVisible ? 'Hide All' : 'View All'}</span>
          </button>
          <span className="toggleDivider">|</span>
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
                  View Data
                </button>
              </div>
            )}
          </div>
          {/* Expand Button */}
          <button
            className="expandTrigger"
            title={isFullScreen ? 'Minimize' : 'Expand'}
            onClick={() => setIsFullScreen(!isFullScreen)}
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
            option={getOption()}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            opts={{ devicePixelRatio: window.devicePixelRatio }}
          />
        </div>
        <div className="chartLegend">
          {Object.entries(colors).map(([node, color]) => (
            <div
              key={node}
              className={`legendItem ${!selectedNodes[node] ? 'legendItemHidden' : ''}`}
              onClick={() => setSelectedNodes((prev) => ({ ...prev, [node]: !prev[node] }))}
            >
              <div className="legendDot" style={{ backgroundColor: color }} />
              <span>{node}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isFullScreen ? (
        <>
          <div className="fullScreenOverlay" onClick={() => setIsFullScreen(false)} />
          <div className="fullScreenFloating">{chartContent}</div>
        </>
      ) : (
        chartContent
      )}

      {/* Data View Drawer */}
      <DataViewDrawer
        isOpen={showDataView}
        onClose={() => setShowDataView(false)}
        title="System Load (RAW)"
        series={drawerSeries}
        timeLabels={timeLabels}
      />
    </>
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export default function ComputeAdminPhysicalNodesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRangeValue>('1h');
  const [selectedNode, setSelectedNode] = useState('node1');
  const [diskDevice, setDiskDevice] = useState('node1');
  const [diskUsageDevice, setDiskUsageDevice] = useState('dev/sda');
  const [networkInterface, setNetworkInterface] = useState('br-ex');

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [
    { label: 'Compute Admin', href: '/compute-admin' },
    { label: 'Physical Nodes' },
  ];

  const timeRangeOptions = [
    { label: '1h', value: '1h' as TimeRangeValue },
    { label: '3h', value: '3h' as TimeRangeValue },
    { label: '1d', value: '1d' as TimeRangeValue },
    { label: '1w', value: '1w' as TimeRangeValue },
  ];

  const nodeOptions = [
    { value: 'node1', label: 'node1' },
    { value: 'node2', label: 'node2' },
    { value: 'node3', label: 'node3' },
  ];

  const diskDeviceOptions = [
    { value: 'dev/sda', label: 'dev/sda' },
    { value: 'dev/sdb', label: 'dev/sdb' },
  ];

  const networkInterfaceOptions = [
    { value: 'br-ex', label: 'br-ex' },
    { value: 'eth0', label: 'eth0' },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
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

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={<Breadcrumb items={breadcrumbItems} />}
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={6}>
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                  Physical Nodes
                </h1>
              </div>

              {/* Monitoring Toolbar with Node Selector */}
              <div className="flex items-center gap-2">
                <Select
                  options={nodeOptions}
                  value={selectedNode}
                  onChange={(val) => setSelectedNode(val as string)}
                  size="sm"
                  width={273}
                />
                <MonitoringToolbar
                  timeRangeOptions={timeRangeOptions}
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                  onRefresh={() => console.log('Refresh')}
                />
              </div>

              {/* Row 1: Stat Cards */}
              <div className="flex gap-4">
                <StatCard title="CPU Cores" value={0} />
                <StatCard title="Total RAM" value="2.56" unit="GiB" />
                <StatCard title="System Running Time" value="2.56" unit="weeks" />
                <FileSystemCard />
              </div>

              {/* Row 2: CPU Usage & RAM Usage */}
              <div className="flex gap-4">
                <AreaChartCard
                  title="CPU Usage"
                  labels={timeLabels}
                  series={[
                    cpuUsageData.idle,
                    cpuUsageData.iowait,
                    cpuUsageData.system,
                    cpuUsageData.user,
                  ]}
                  colors={[
                    chartColors.cyan400,
                    chartColors.emerald400,
                    chartColors.amber400,
                    chartColors.violet400,
                  ]}
                  legendLabels={['idle', 'iowait', 'system', 'user']}
                  yAxisUnit="%"
                  stacked={true}
                />
                <AreaChartCard
                  title="RAM Usage"
                  labels={timeLabels}
                  series={[ramUsageData.used, ramUsageData.free]}
                  colors={[chartColors.cyan400, chartColors.emerald400]}
                  legendLabels={['Used', 'Free']}
                  stacked={true}
                />
              </div>

              {/* Row 3: Disk IOPS & Disk Usage */}
              <div className="flex gap-4">
                <AreaChartCard
                  title="Disk IOPS"
                  labels={timeLabels}
                  series={[diskIOPSData.read, diskIOPSData.write]}
                  colors={[chartColors.cyan400, chartColors.emerald400]}
                  legendLabels={['Read', 'Write']}
                  dropdown={diskDevice}
                  onDropdownChange={setDiskDevice}
                  dropdownOptions={nodeOptions}
                />
                <AreaChartCard
                  title="Disk Usage"
                  labels={timeLabels}
                  series={[diskUsageData.usage]}
                  colors={[chartColors.emerald400]}
                  legendLabels={['Usage']}
                  yAxisUnit="%"
                  dropdown={diskUsageDevice}
                  onDropdownChange={setDiskUsageDevice}
                  dropdownOptions={diskDeviceOptions}
                />
              </div>

              {/* Row 4: System Load */}
              <SystemLoadCard />

              {/* Row 5: Network Traffic & TCP Connections */}
              <div className="flex gap-4">
                <AreaChartCard
                  title="Network Traffic"
                  labels={timeLabels}
                  series={[networkTrafficData.receive, networkTrafficData.transmit]}
                  colors={[chartColors.cyan400, chartColors.emerald400]}
                  legendLabels={['Receive', 'Transmit']}
                />
                <AreaChartCard
                  title="TCP Connections"
                  labels={['0', '4', '8', '12', '16', '20', '24', '28', '32']}
                  series={[tcpConnectionsData.connections]}
                  colors={[chartColors.cyan400]}
                  legendLabels={['Connections']}
                />
              </div>

              {/* Row 6: Network Errors & Dropped Packets */}
              <div className="flex gap-4">
                <AreaChartCard
                  title="Network Errors"
                  labels={timeLabels}
                  series={[networkErrorsData.errors]}
                  colors={[chartColors.cyan400]}
                  legendLabels={['Errors']}
                  dropdown={networkInterface}
                  onDropdownChange={setNetworkInterface}
                  dropdownOptions={networkInterfaceOptions}
                />
                <AreaChartCard
                  title="Network Dropped Packets"
                  labels={timeLabels}
                  series={[networkDroppedData.receive, networkDroppedData.transmit]}
                  colors={[chartColors.cyan400, chartColors.emerald400]}
                  legendLabels={['Receive', 'Transmit']}
                  dropdown={networkInterface}
                  onDropdownChange={setNetworkInterface}
                  dropdownOptions={networkInterfaceOptions}
                />
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}
