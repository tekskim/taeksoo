import { useState } from 'react';
import {
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  MonitoringToolbar,
  SectionCard,
  Table,
  type TableColumn,
  type TimeRangeValue,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { DataViewDrawer } from '@/components/DataViewDrawer';
import { useTabs } from '@/contexts/TabContext';
import { useDarkMode } from '@/hooks/useDarkMode';
import { 
  IconBell, 
  IconDotsCircleHorizontal, 
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconTerminal2,
} from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';

/* ----------------------------------------
   Chart Colors (from design system)
   ---------------------------------------- */

const chartColors = {
  // Primary 5-color palette (Tailwind 400 shades)
  cyan400: '#22d3ee',
  emerald400: '#34d399',
  amber400: '#fbbf24',
  violet400: '#a78bfa',
  pink400: '#f472b6',
  // Additional colors for more series
  red400: '#f87171',
  blue400: '#60a5fa',
  teal400: '#2dd4bf',
  orange400: '#fb923c',
  indigo400: '#818cf8',
  // Utility colors
  slate400: '#94a3b8',
  slate100: '#f1f5f9',
  slate800: '#1e293b',
};

/* ----------------------------------------
   Time Labels Generator
   ---------------------------------------- */

const generateTimeLabels = () => {
  const labels = [];
  for (let i = 0; i <= 50; i += 10) {
    const min = i.toString().padStart(2, '0');
    labels.push(`13:${min}`);
  }
  return labels;
};

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface StatCard {
  label: string;
  value: string;
  unit?: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const poolsStats: StatCard[] = [
  { label: 'Pools', value: '21' },
  { label: 'Pools with Compression', value: 'N/A' },
  { label: 'Total Raw Capacity', value: '11.6', unit: 'TiB' },
  { label: 'Raw Capacity Consumed', value: '47.4', unit: 'TiB' },
  { label: 'Logical Stored', value: '15.8', unit: 'TiB' },
  { label: 'Compression Savings', value: '0', unit: 'B' },
  { label: 'Compression Eligibility', value: 'N/A' },
  { label: 'Compression Factor', value: 'N/A' },
];

// Generate mock series data
const generateSeriesData = (base: number, growth: number = 2): number[] => {
  return [0, 1, 2, 3, 4, 5].map((i) => base + i * growth + Math.random() * 3);
};

const capacitySeries = [
  { name: 'backup', color: chartColors.cyan400, data: generateSeriesData(8, 2) },
  { name: 'hdd', color: chartColors.emerald400, data: generateSeriesData(20, 3) },
  { name: 'nfs', color: chartColors.amber400, data: generateSeriesData(25, 2) },
  { name: 'thamZone', color: chartColors.violet400, data: generateSeriesData(30, 2) },
  { name: 'volumes', color: chartColors.pink400, data: generateSeriesData(35, 3) },
];

const iopsSeries = [
  { name: 'backup', color: chartColors.cyan400, data: generateSeriesData(20, 10) },
  { name: 'mgr', color: chartColors.emerald400, data: generateSeriesData(50, 15) },
  { name: 'rgwRoot', color: chartColors.amber400, data: generateSeriesData(80, 12) },
  { name: 'thamZone', color: chartColors.violet400, data: generateSeriesData(120, 20) },
  { name: 'thamZoneMeta', color: chartColors.pink400, data: generateSeriesData(150, 15) },
];

const bandwidthSeries = [
  { name: 'backup', color: chartColors.cyan400, data: generateSeriesData(5, 1) },
  { name: 'mgr', color: chartColors.emerald400, data: generateSeriesData(8, 2) },
  { name: 'nfs', color: chartColors.amber400, data: generateSeriesData(12, 2) },
  { name: 'rgwRoot', color: chartColors.violet400, data: generateSeriesData(15, 3) },
  { name: 'thamZone', color: chartColors.pink400, data: generateSeriesData(20, 3) },
];

/* ----------------------------------------
   Pool Overview Table Data
   ---------------------------------------- */

interface PoolOverviewRow {
  id: string;
  poolName: string;
  type: string;
  usableFree: string;
  percentUsed: string;
  growth5d: string;
  growthPositive: boolean;
  iops: string;
  bandwidth: string;
  stored: string;
}

const poolOverviewData: PoolOverviewRow[] = [
  { id: '1', poolName: '.mgr', type: 'replica:3', usableFree: '10.57 GiB', percentUsed: '0.00%', growth5d: '896.02 KiB', growthPositive: true, iops: '0.00', bandwidth: '0.00 B/s', stored: '8.50 GiB' },
  { id: '2', poolName: '.mgr', type: 'replica:4', usableFree: '15.23 GiB', percentUsed: '0.05%', growth5d: '1.20 MiB', growthPositive: true, iops: '0.00', bandwidth: '0.00 B/s', stored: '9.00 GiB' },
  { id: '3', poolName: '.mgr', type: 'replica:5', usableFree: '20.45 GiB', percentUsed: '0.10%', growth5d: '1.50 MiB', growthPositive: true, iops: '0.00', bandwidth: '0.00 B/s', stored: '10.00 GiB' },
  { id: '4', poolName: '.mgr', type: 'replica:3', usableFree: '10.57 GiB', percentUsed: '0.00%', growth5d: '0.00 B', growthPositive: false, iops: '0.00', bandwidth: '0.00 B/s', stored: '8.50 GiB' },
  { id: '5', poolName: '.mgr', type: 'replica:3', usableFree: '10.57 GiB', percentUsed: '0.00%', growth5d: '-525.01 B', growthPositive: false, iops: '0.00', bandwidth: '0.00 B/s', stored: '8.50 GiB' },
];

/* ----------------------------------------
   Hosts Tab Data
   ---------------------------------------- */

const hostsStats: StatCard[] = [
  { label: 'OSD Hosts', value: '6' },
  { label: 'AVG CPU Busy', value: '0.515', unit: '%' },
  { label: 'AVG RAM Utilization', value: '33.8', unit: '%' },
  { label: 'Physical IOPS', value: '9256' },
  { label: 'AVG Disk Utilization', value: '19', unit: '%' },
  { label: 'Network Load', value: '57.5', unit: 'MiB' },
];

// CPU Busy chart series
const cpuBusySeries = [
  { name: 'b0x/2e1-ceph0dg-c01', color: chartColors.cyan400, data: [0.2, 0.25, 0.35, 0.4, 0.38, 0.55] },
  { name: 'b0x/2e1-ceph0dg-c02', color: chartColors.emerald400, data: [0.35, 0.45, 0.5, 0.55, 0.6, 0.75] },
  { name: 'b0x/2e1-ceph0dg-c03', color: chartColors.amber400, data: [0.5, 0.6, 0.7, 0.85, 0.9, 1.1] },
  { name: 'b0x/2e1-ceph0dg001', color: chartColors.violet400, data: [0.6, 0.7, 0.8, 0.95, 1.0, 1.2] },
  { name: 'b0x/2e1-ceph0dg002', color: chartColors.pink400, data: [0.15, 0.2, 0.18, 0.22, 0.25, 0.3] },
];

// Network Load chart series
const networkLoadSeries = [
  { name: 'b0x/2e1-ceph0dg-c01', color: chartColors.cyan400, data: [8, 10, 12, 15, 18, 22] },
  { name: 'b0x/2e1-ceph0dg-c02', color: chartColors.emerald400, data: [12, 15, 18, 22, 28, 35] },
  { name: 'b0x/2e1-ceph0dg001', color: chartColors.amber400, data: [18, 22, 25, 30, 35, 42] },
  { name: 'b0x/2e1-ceph0dg002', color: chartColors.violet400, data: [25, 30, 35, 40, 45, 50] },
  { name: 'b0x/2e1-ceph0dg003', color: chartColors.pink400, data: [5, 8, 10, 12, 15, 18] },
];

// Host Overview table data
interface HostOverviewRow {
  id: string;
  hostname: string;
  totalMemory: string;
  rawCapacity: string;
}

const hostOverviewData: HostOverviewRow[] = [
  { id: '1', hostname: 'bzfv0rv1-cephadm-cl01', totalMemory: '93.9 GiB', rawCapacity: '93.9 GiB' },
  { id: '2', hostname: 'bzfv0rv1-cephadm-cl02', totalMemory: '93.9 GiB', rawCapacity: '93.9 GiB' },
  { id: '3', hostname: 'bzfv0rv1-cephadm-cl03', totalMemory: '93.9 GiB', rawCapacity: '93.9 GiB' },
  { id: '4', hostname: 'bzfv0rv1-cephadm-cl04', totalMemory: '93.9 GiB', rawCapacity: '93.9 GiB' },
];

// ======== OSDs Tab Mock Data ========

// OSD Latency table data
interface OsdLatencyRow {
  id: string;
  osdId: string;
  latency: string;
}

const osdReadLatencyData: OsdLatencyRow[] = [
  { id: '1', osdId: 'osd.13', latency: '8 ms' },
  { id: '2', osdId: 'osd.3', latency: '6 ms' },
  { id: '3', osdId: 'osd.1', latency: '4 ms' },
  { id: '4', osdId: 'osd.7', latency: '3 ms' },
  { id: '5', osdId: 'osd.9', latency: '3 ms' },
  { id: '6', osdId: 'osd.15', latency: '2 ms' },
];

const osdWriteLatencyData: OsdLatencyRow[] = [
  { id: '1', osdId: 'osd.13', latency: '8 ms' },
  { id: '2', osdId: 'osd.3', latency: '6 ms' },
  { id: '3', osdId: 'osd.1', latency: '4 ms' },
  { id: '4', osdId: 'osd.7', latency: '3 ms' },
  { id: '5', osdId: 'osd.9', latency: '3 ms' },
  { id: '6', osdId: 'osd.15', latency: '2 ms' },
];

// OSD Read Latencies chart series
const osdReadLatenciesSeries = [
  { name: '@95%ile', color: chartColors.violet400, data: [0.28, 0.32, 0.38, 0.35, 0.33, 0.30] },
  { name: 'AVG read', color: chartColors.emerald400, data: [0.18, 0.20, 0.25, 0.28, 0.26, 0.22] },
  { name: 'MAX read', color: chartColors.amber400, data: [0.22, 0.25, 0.30, 0.32, 0.30, 0.26] },
];

// OSD Write Latencies chart series
const osdWriteLatenciesSeries = [
  { name: '@95%ile write', color: chartColors.cyan400, data: [5.5, 6.0, 7.2, 7.8, 7.5, 7.0] },
  { name: 'AVG write', color: chartColors.emerald400, data: [4.0, 4.5, 5.5, 6.2, 6.0, 5.5] },
  { name: 'MAX write', color: chartColors.amber400, data: [4.8, 5.2, 6.2, 7.0, 6.5, 6.0] },
];

/* ----------------------------------------
   StatCard Component
   ---------------------------------------- */

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
}

function StatCardItem({ label, value, unit }: StatCardProps) {
  return (
    <div className="flex-1 min-w-0 p-4 border border-[var(--color-border-default)] rounded-lg bg-[var(--color-surface-default)]">
      <p className="text-[11px] text-[var(--color-text-subtle)] mb-2 whitespace-nowrap">{label}</p>
      <p className="text-[24px] font-semibold text-[var(--color-text-default)] whitespace-nowrap">
        {value}
        {unit && <span className="text-[14px] font-normal text-[var(--color-text-muted)] ml-1">{unit}</span>}
      </p>
    </div>
  );
}

/* ----------------------------------------
   ChartCard Component (matching design system LineChart)
   ---------------------------------------- */

interface ChartCardProps {
  title: string;
  series: { name: string; color: string; data: number[] }[];
  yAxisFormatter?: (value: number) => string;
  isDarkMode: boolean;
  timeRange?: TimeRangeValue;
  onTimeRangeChange?: (value: TimeRangeValue) => void;
  onRefresh?: () => void;
}

function ChartCard({ title, series, yAxisFormatter = (v: number) => `${v}`, isDarkMode, timeRange, onTimeRangeChange, onRefresh }: ChartCardProps) {
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>(
    () => Object.fromEntries(series.map(s => [s.name, true]))
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showDataView, setShowDataView] = useState(false);

  const timeLabels = generateTimeLabels();
  const allVisible = Object.values(visibleSeries).every(v => v);

  const toggleAll = () => {
    const newState = !allVisible;
    setVisibleSeries(Object.fromEntries(series.map(s => [s.name, newState])));
  };

  const handleFullScreen = () => {
    setMenuOpen(false);
    setIsFullScreen(true);
  };

  const handleExitFullScreen = () => {
    setIsFullScreen(false);
  };

  // Calculate y-axis bounds for exactly 5 labels
  const visibleData = series.filter(s => visibleSeries[s.name]).flatMap(s => s.data);
  const dataMax = visibleData.length > 0 ? Math.max(...visibleData) : 100;
  const niceMax = Math.ceil(dataMax / 4) * 4; // Round up to nearest multiple of 4
  const yInterval = niceMax / 4; // 4 intervals = 5 labels

  // Theme-aware colors
  const splitLineColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : chartColors.slate100;
  const splitLineOpacity = isDarkMode ? 1 : 0.5;
  const tooltipBg = isDarkMode ? '#1C1C1C' : 'white';
  const tooltipBorder = isDarkMode ? '#333333' : '#e2e8f0';
  const tooltipTextColor = isDarkMode ? '#e5e5e5' : chartColors.slate800;

  const option = {
    animation: false,
    grid: {
      left: '0',
      right: '16px',
      top: '20px',
      bottom: '16px',
      containLabel: true
    },
    xAxis: {
      type: 'category' as const,
      data: timeLabels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
        padding: [0, 0, 0, 15]
      },
      boundaryGap: false
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: niceMax,
      interval: yInterval,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: splitLineColor, opacity: splitLineOpacity }
      },
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
        formatter: yAxisFormatter
      }
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { 
        color: tooltipTextColor, 
        fontSize: 11, 
        fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif' 
      }
    },
    series: series
      .filter(s => visibleSeries[s.name])
      .map(s => ({
        name: s.name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        lineStyle: { color: s.color, width: 1 },
        itemStyle: { color: s.color },
        areaStyle: { color: s.color, opacity: 0.1 },
        data: s.data
      }))
  };

  const chartContent = (
    <div className={`chartCard ${isFullScreen ? 'chartCardFullScreen' : ''}`}>
      {/* Header */}
      <div className="chartHeader">
        <span className="chartTitle">{title}</span>
        {isFullScreen && timeRange && onTimeRangeChange && (
          <div className="chartHeaderCenter">
            <MonitoringToolbar
              timeRange={timeRange}
              onTimeRangeChange={onTimeRangeChange}
              onRefresh={onRefresh}
              showRefresh={true}
            />
          </div>
        )}
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
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
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
                <button className="contextMenuItemLast" onClick={() => { setMenuOpen(false); setShowDataView(true); }}>
                  Data View
                </button>
              </div>
            )}
          </div>
          
          {/* Expand/Minimize Button */}
          <button 
            className="expandTrigger" 
            title={isFullScreen ? "Minimize" : "Expand"}
            onClick={isFullScreen ? handleExitFullScreen : handleFullScreen}
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
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge={true} />
        </div>
        <div className="chartLegend">
          {series.map((s, i) => (
            <div 
              key={i}
              className={`legendItem ${!visibleSeries[s.name] ? 'legendItemHidden' : ''}`}
              onClick={() => setVisibleSeries(prev => ({ ...prev, [s.name]: !prev[s.name] }))}
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

  if (isFullScreen) {
    return (
      <>
        <div className="fullScreenOverlay" onClick={handleExitFullScreen} />
        <div className="fullScreenFloating">
          {chartContent}
        </div>
      </>
    );
  }

  return chartContent;
}

/* ----------------------------------------
   Overall Performance Page
   ---------------------------------------- */

export function OverallPerformancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('pools');
  const [timeRange, setTimeRange] = useState<TimeRangeValue>('30m');
  const { isDark } = useDarkMode();

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Pool Overview table columns
  const poolOverviewColumns: TableColumn<PoolOverviewRow>[] = [
    { key: 'poolName', label: 'Pool Name', flex: 1, sortable: true },
    { key: 'type', label: 'Type', flex: 1, sortable: false },
    { key: 'usableFree', label: 'Usable Free', flex: 1, sortable: true },
    { key: 'percentUsed', label: '% Used', flex: 1, sortable: true },
    { 
      key: 'growth5d', 
      label: 'Growth (5d)', 
      flex: 1, 
      sortable: true,
      render: (_, row) => (
        <span className={row.growthPositive ? 'text-[var(--color-state-success)]' : 'text-[var(--color-state-danger)]'}>
          {row.growth5d}
        </span>
      )
    },
    { key: 'iops', label: 'IOPS', flex: 1, sortable: true },
    { key: 'bandwidth', label: 'Bandwidth', flex: 1, sortable: true },
    { key: 'stored', label: 'Stored', flex: 1, sortable: true },
    { 
      key: 'id', 
      label: 'Detail Performance', 
      width: '140px',
      align: 'center' as const,
      render: () => (
        <button className="p-1.5 hover:bg-[var(--color-surface-subtle)] rounded transition-colors">
          <IconTerminal2 size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
      )
    },
  ];

  // Host Overview table columns
  const hostOverviewColumns: TableColumn<HostOverviewRow>[] = [
    { key: 'hostname', label: 'Hostname', flex: 2, sortable: true },
    { key: 'totalMemory', label: 'Total Memory', flex: 1, sortable: true },
    { key: 'rawCapacity', label: 'Raw Capacity', flex: 1, sortable: true },
    { 
      key: 'id', 
      label: 'Detail Performance', 
      width: '140px',
      align: 'center' as const,
      render: () => (
        <button className="p-1.5 hover:bg-[var(--color-surface-subtle)] rounded transition-colors">
          <IconTerminal2 size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
      )
    },
  ];

  // OSD Latency table columns
  const osdLatencyColumns: TableColumn<OsdLatencyRow>[] = [
    { key: 'osdId', label: 'OSD ID', flex: 1, sortable: true },
    { key: 'latency', label: 'Latency', flex: 1, sortable: true },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[200px]' : 'left-0'}`}
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
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/storage' },
                  { label: 'Overall Performance' },
                ]}
              />
            }
            actions={
              <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={6} className="min-w-[1176px] max-w-[1400px]">
              {/* Page Tabs */}
              <div className="w-full">
                <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
                  <TabList>
                    <Tab value="pools">Pools</Tab>
                    <Tab value="hosts">Hosts</Tab>
                    <Tab value="osds">OSDs</Tab>
                  </TabList>

                  {/* Pools Tab Panel */}
                  <TabPanel value="pools" className="pt-6">
                    <VStack gap={6}>
                      {/* Time Period Selector */}
                      <div className="flex justify-end">
                        <MonitoringToolbar
                          timeRange={timeRange}
                          onTimeRangeChange={setTimeRange}
                          onRefresh={() => console.log('Refresh clicked')}
                          showRefresh={true}
                        />
                      </div>

                      {/* Stats Cards - Row 1 */}
                      <div className="flex gap-4">
                        {poolsStats.slice(0, 4).map((stat) => (
                          <StatCardItem key={stat.label} {...stat} />
                        ))}
                      </div>

                      {/* Stats Cards - Row 2 */}
                      <div className="flex gap-4">
                        {poolsStats.slice(4, 8).map((stat) => (
                          <StatCardItem key={stat.label} {...stat} />
                        ))}
                      </div>

                      {/* Charts - Row 1 */}
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <ChartCard
                            title="Pool Capacity Usage (RAW)"
                            series={capacitySeries}
                            yAxisFormatter={(v) => `${v} TiB`}
                            isDarkMode={isDark}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                            onRefresh={() => console.log('Refresh clicked')}
                          />
                        </div>
                        <div className="flex-1">
                          <ChartCard
                            title="Client IOPS by Pool"
                            series={iopsSeries}
                            isDarkMode={isDark}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                            onRefresh={() => console.log('Refresh clicked')}
                          />
                        </div>
                      </div>

                      {/* Charts - Row 2 */}
                      <div className="flex gap-4">
                        <div className="w-[calc(50%-8px)]">
                          <ChartCard
                            title="Client Bandwidth by Pool"
                            series={bandwidthSeries}
                            yAxisFormatter={(v) => `${v} MB/s`}
                            isDarkMode={isDark}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                            onRefresh={() => console.log('Refresh clicked')}
                          />
                        </div>
                      </div>

                      {/* Pool Overview Table */}
                      <SectionCard>
                        <SectionCard.Header title="Pool Overview" />
                        <SectionCard.Content gap={0}>
                          <Table<PoolOverviewRow>
                            columns={poolOverviewColumns}
                            data={poolOverviewData}
                            rowKey="id"
                          />
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* Hosts Tab Panel */}
                  <TabPanel value="hosts" className="pt-6">
                    <VStack gap={6}>
                      {/* Time Period Selector */}
                      <div className="flex justify-end">
                        <MonitoringToolbar
                          timeRange={timeRange}
                          onTimeRangeChange={setTimeRange}
                          onRefresh={() => console.log('Refresh clicked')}
                          showRefresh={true}
                        />
                      </div>

                      {/* Stats Cards Row */}
                      <div className="flex gap-4">
                        {hostsStats.map((stat) => (
                          <StatCardItem key={stat.label} {...stat} />
                        ))}
                      </div>

                      {/* Charts Row */}
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <ChartCard
                            title="CPU Busy"
                            series={cpuBusySeries}
                            yAxisFormatter={(v) => `${v.toFixed(1)}%`}
                            isDarkMode={isDark}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                            onRefresh={() => console.log('Refresh clicked')}
                          />
                        </div>
                        <div className="flex-1">
                          <ChartCard
                            title="Network Load"
                            series={networkLoadSeries}
                            yAxisFormatter={(v) => `${v} MiB/s`}
                            isDarkMode={isDark}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                            onRefresh={() => console.log('Refresh clicked')}
                          />
                        </div>
                      </div>

                      {/* Host Overview Table */}
                      <SectionCard>
                        <SectionCard.Header title="Host Overview" />
                        <SectionCard.Content gap={0}>
                          <Table<HostOverviewRow>
                            columns={hostOverviewColumns}
                            data={hostOverviewData}
                            rowKey="id"
                          />
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* OSDs Tab Panel */}
                  <TabPanel value="osds" className="pt-6">
                    <VStack gap={6}>
                      {/* Time Period Selector */}
                      <div className="flex justify-end">
                        <MonitoringToolbar
                          timeRange={timeRange}
                          onTimeRangeChange={setTimeRange}
                          onRefresh={() => console.log('Refresh clicked')}
                          showRefresh={true}
                        />
                      </div>

                      {/* Read Latencies Row */}
                      <div className="flex gap-4">
                        {/* Highest READ Latencies Table */}
                        <div className="flex-1">
                          <SectionCard>
                            <SectionCard.Header title="Highest READ Latencies" />
                            <SectionCard.Content gap={0}>
                              <Table<OsdLatencyRow>
                                columns={osdLatencyColumns}
                                data={osdReadLatencyData}
                                rowKey="id"
                              />
                            </SectionCard.Content>
                          </SectionCard>
                        </div>
                        {/* OSD Read Latencies Chart */}
                        <div className="flex-1">
                          <ChartCard
                            title="OSD Read Latencies"
                            series={osdReadLatenciesSeries}
                            yAxisFormatter={(v) => `${v}`}
                            isDarkMode={isDark}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                            onRefresh={() => console.log('Refresh clicked')}
                          />
                        </div>
                      </div>

                      {/* Write Latencies Row */}
                      <div className="flex gap-4">
                        {/* Highest WRITE Latencies Table */}
                        <div className="flex-1">
                          <SectionCard>
                            <SectionCard.Header title="Highest WRITE Latencies" />
                            <SectionCard.Content gap={0}>
                              <Table<OsdLatencyRow>
                                columns={osdLatencyColumns}
                                data={osdWriteLatencyData}
                                rowKey="id"
                              />
                            </SectionCard.Content>
                          </SectionCard>
                        </div>
                        {/* OSD Write Latencies Chart */}
                        <div className="flex-1">
                          <ChartCard
                            title="OSD Write Latencies"
                            series={osdWriteLatenciesSeries}
                            yAxisFormatter={(v) => `${v}`}
                            isDarkMode={isDark}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                            onRefresh={() => console.log('Refresh clicked')}
                          />
                        </div>
                      </div>
                    </VStack>
                  </TabPanel>
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OverallPerformancePage;

