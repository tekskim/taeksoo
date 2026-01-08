import { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconRefresh,
  IconBell,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';

/* ----------------------------------------
   Time Controls Component (Design System Style)
   ---------------------------------------- */
type TimeRange = '30m' | '1h' | '6h' | '12h' | '24h';

const timeOptions: { label: string; value: TimeRange }[] = [
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '6h', value: '6h' },
  { label: '12h', value: '12h' },
  { label: '24h', value: '24h' },
];

// Icons for time controls
const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Helper function for date formatting
const formatDateForDisplay = (date: Date | null) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}`;
};

interface TimeControlsProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  onRefresh?: () => void;
}

function TimeControls({ value, onChange, onRefresh }: TimeControlsProps) {
  const handleTimeRangeClick = (newValue: TimeRange) => {
    onChange(newValue);
  };

  return (
    <div className="fullScreenTimeControls">
      {/* Time Range Buttons */}
      <div className="timeSegments">
        {timeOptions.map(option => (
          <button 
            key={option.value}
            className={`timeSegment ${value === option.value ? 'timeSegmentActive' : ''}`}
            onClick={() => handleTimeRangeClick(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Refresh Button */}
      <button className="refreshButton" onClick={onRefresh}>
        <IconRefresh size={14} stroke={1.5} />
      </button>
    </div>
  );
}

/* ----------------------------------------
   Chart Colors (from design system)
   ---------------------------------------- */
const chartColors = {
  cyan400: '#22d3ee',
  emerald400: '#34d399',
  amber400: '#fbbf24',
  violet400: '#a78bfa',
  fuchsia400: '#e879f9',
  blue400: '#60a5fa',
  green400: '#4ade80',
  pink400: '#f472b6',
  rose400: '#fb7185',
  teal400: '#2dd4bf',
  orange400: '#fb923c',
  red400: '#f87171',
  indigo400: '#818cf8',
  lime400: '#a3e635',
  sky400: '#38bdf8',
  yellow400: '#facc15',
  slate400: '#94a3b8',
  slate100: '#f1f5f9',
  slate800: '#1e293b',
};

/* ----------------------------------------
   Line Chart Component (Design System Style)
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
}

function LineChart({ 
  title, 
  series, 
  timeLabels,
  yAxisFormatter = (v: number) => `${v}`,
  height = '100%'
}: LineChartProps) {
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>(
    Object.fromEntries(series.map(s => [s.name, true]))
  );
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode changes
  useState(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  });

  const allVisible = Object.values(visibleSeries).every(v => v);
  const toggleAll = () => {
    const newState = !allVisible;
    setVisibleSeries(Object.fromEntries(series.map(s => [s.name, newState])));
  };

  // Get theme-aware colors
  const splitLineColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : chartColors.slate100;
  const splitLineOpacity = isDarkMode ? 1 : 0.5;
  const tooltipBg = isDarkMode ? '#1C1C1C' : 'white';
  const tooltipBorder = isDarkMode ? '#333333' : '#e2e8f0';
  const tooltipTextColor = isDarkMode ? '#e5e5e5' : chartColors.slate800;

  // Calculate max value for exactly 5 Y-axis labels (4 intervals) with nice numbers
  const allData = series.filter(s => visibleSeries[s.name]).flatMap(s => s.data);
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
      containLabel: false
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
      interval: niceInterval,
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
      },
      formatter: (params: Array<{ marker: string; seriesName: string; value: number; axisValueLabel: string; color: string }>) => {
        if (!Array.isArray(params) || params.length === 0) return '';
        const time = params[0].axisValueLabel;
        const items = params.map(p => 
          `<div style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${p.color};"></span><span>${p.seriesName}</span><span style="font-weight: 500; margin-left: auto;">${p.value}</span></div>`
        ).join('');
        return `<div style="font-size: 11px; font-family: Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif;">${time}<div style="margin-top: 4px;">${items}</div></div>`;
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

  return (
    <div className="chartCard">
      {/* Header */}
      <div className="chartHeader">
        <span className="chartTitle">{title}</span>
        <div className="chartControls">
          {/* Toggle Button */}
          {series.length > 1 && (
            <button className="toggleBtn" onClick={toggleAll}>
              <span className={`toggleSwitch ${allVisible ? 'toggleSwitchActive' : ''}`} />
              <span>{allVisible ? 'Hide All' : 'View All'}</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Chart Body */}
      <div className="chartBody">
        <div className="chartWrapper">
          <ReactECharts option={option} style={{ height }} notMerge={true} />
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
  const textColor = value === 0 ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-default)]';
  
  return (
    <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg p-4 border-2 border-transparent transition-colors hover:border-[var(--color-action-primary)] cursor-pointer">
      <div className={`text-[20px] font-medium ${textColor} pb-1`}>{value}</div>
      <div className="text-[11px] text-[var(--color-text-subtle)]">{label}</div>
    </div>
  );
}

/* ----------------------------------------
   Capacity Gauge Component (Half-Doughnut Chart)
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Get color from design system CSS variables
  const getColor = (cssVar: string, fallback: string) => {
    if (typeof window !== 'undefined') {
      const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
      return value || fallback;
    }
    return fallback;
  };

  // Determine status color based on percentage
  const getStatusColor = () => {
    if (percentage >= 90) return getColor('--color-status-error', '#ef4444');
    if (percentage >= 70) return getColor('--color-status-warning', '#f97316');
    return getColor('--color-status-success', '#22c55e');
  };

  const color = getStatusColor();
  const available = total - used;
  const availablePercent = Math.round((available / total) * 100);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const getOption = () => ({
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        center: ['50%', '60%'],
        radius: '95%',
        min: 0,
        max: 100,
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [percentage / 100, color],
              [1, getColor('--color-border-subtle', '#f1f5f9')]
            ]
          }
        },
        pointer: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          show: false
        }
      }
    ]
  });

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseMove={handleMouseMove}
    >
      <ReactECharts option={getOption()} style={{ height: '180px', width: '210px' }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
        <span className="text-[24px] leading-[28px] font-semibold text-[var(--color-text-default)]">{percentage.toFixed(2)}%</span>
        <span className="text-[12px] text-[var(--color-text-subtle)]">{used}{unit}/{total}{unit}</span>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div 
          className="absolute z-10 backdrop-blur-[40px] bg-[rgba(246,246,246,0.9)] dark:bg-[rgba(30,30,30,0.9)] border border-[rgba(26,26,26,0.15)] dark:border-[rgba(255,255,255,0.15)] rounded-[6px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-1.5 flex flex-col gap-1 pointer-events-none"
          style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-[5px] h-[5px] rounded-[1px]" style={{ backgroundColor: color }} />
            <span className="text-[11px] leading-[14px] text-[var(--color-text-default)] whitespace-nowrap">
              Used: {used}{unit} ({Math.round(percentage)}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-[5px] h-[5px] rounded-[1px] bg-[#e5e7eb]" />
            <span className="text-[11px] leading-[14px] text-[var(--color-text-default)] whitespace-nowrap">
              Available: {available.toFixed(1)}{unit} ({availablePercent}%)
            </span>
          </div>
        </div>
      )}
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

function Card({ title, children, className = '', bgColor = 'bg-[var(--color-surface-default)]' }: CardProps) {
  return (
    <div className={`p-4 rounded-2xl border border-[var(--color-border-default)] ${bgColor} ${className}`}>
      <h6 className="text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-semibold text-[var(--color-text-muted)] mb-4">{title}</h6>
      {children}
    </div>
  );
}

/* ----------------------------------------
   Main StorageHomePage Component
   ---------------------------------------- */
export function StorageHomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30m');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();

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
    { name: 'Commit', data: [0, 0, 0, 0.18, 0.35, 0.50], color: chartColors.emerald400 },
  ];

  // Mock data for Client Throughput chart
  const clientThroughputSeries: LineChartSeries[] = [
    { name: 'Reads', data: [0.1, 0.8, 2.5, 4.2, 5.8, 6.2], color: chartColors.cyan400 },
    { name: 'Writes', data: [0.1, 0.6, 2.0, 3.8, 5.2, 5.8], color: chartColors.emerald400 },
    { name: 'Metadata', data: [0.05, 0.4, 1.5, 2.8, 4.0, 4.5], color: chartColors.amber400 },
    { name: 'Recovery', data: [0.02, 0.3, 1.2, 2.2, 3.2, 3.8], color: chartColors.violet400 },
    { name: 'Replication', data: [0.02, 0.25, 1.0, 1.8, 2.8, 3.2], color: chartColors.pink400 },
    { name: 'Backup', data: [0.01, 0.2, 0.8, 1.5, 2.2, 2.6], color: chartColors.rose400 },
    { name: 'Sync', data: [0.01, 0.15, 0.6, 1.2, 1.8, 2.2], color: chartColors.blue400 },
    { name: 'Cache', data: [0.01, 0.1, 0.5, 1.0, 1.5, 1.8], color: chartColors.teal400 },
    { name: 'Streaming', data: [0.01, 0.08, 0.4, 0.8, 1.2, 1.5], color: chartColors.orange400 },
    { name: 'Archive', data: [0.01, 0.05, 0.3, 0.6, 0.9, 1.1], color: chartColors.red400 },
    { name: 'Scrub', data: [0.02, 0.12, 0.45, 0.9, 1.3, 1.6], color: chartColors.indigo400 },
    { name: 'Repair', data: [0.01, 0.09, 0.35, 0.7, 1.1, 1.3], color: chartColors.lime400 },
    { name: 'Snapshot', data: [0.02, 0.11, 0.42, 0.85, 1.25, 1.5], color: chartColors.sky400 },
    { name: 'Clone', data: [0.01, 0.07, 0.28, 0.55, 0.82, 1.0], color: chartColors.yellow400 },
  ];

  // Mock data for Requests/sec chart
  const requestsSeries: LineChartSeries[] = [
    { name: 'Requests', data: [2, 2, 2, 2, 2, 2], color: chartColors.cyan400 },
  ];

  // Mock data for Latency chart
  const latencyDetailSeries: LineChartSeries[] = [
    { name: 'GET', data: [0, 0.5, 2.0, 3.5, 4.2, 4.8], color: chartColors.cyan400 },
    { name: 'PUT', data: [0, 0.4, 1.8, 3.2, 3.8, 4.2], color: chartColors.emerald400 },
    { name: 'DELETE', data: [0, 0.3, 1.5, 2.8, 3.2, 3.6], color: chartColors.amber400 },
    { name: 'POST', data: [0, 0.25, 1.2, 2.4, 2.8, 3.2], color: chartColors.violet400 },
    { name: 'PATCH', data: [0, 0.2, 1.0, 2.0, 2.4, 2.8], color: chartColors.pink400 },
  ];

  // Mock data for Recovery Throughput chart
  const recoveryThroughputSeries: LineChartSeries[] = [
    { name: 'Recovery', data: [0, 0, 0, 0, 0, 0], color: chartColors.cyan400 },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />

      <main className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[200px]' : 'left-0'}`}>
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            showAddButton={true}
            showWindowControls={true}
          />

          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
              items={[
                { label: 'Storage', href: '/storage' },
                { label: 'Home' },
              ]}
            />
            }
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
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* EntryPage Content */}
          <div className="px-8 py-6">
          {/* Top Row - 2 Cards: Inventory and Capacity */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* INVENTORY */}
            <Card title="INVENTORY" className="flex flex-col">
              {/* Total */}
              <div className="mb-4">
                <div className="text-[24px] leading-[32px] font-semibold text-[var(--color-text-default)]">54</div>
                <div className="text-[12px] text-[var(--color-text-subtle)]">Total</div>
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
            <Card title="CAPACITY" className="flex flex-col">
              <CapacityGauge 
                percentage={26.19} 
                used={49.7} 
                total={189.9} 
                unit="TiB" 
              />
            </Card>
          </div>

          {/* CLUSTER UTILIZATION Section */}
          <div className="p-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h6 className="text-[length:var(--font-size-14)] leading-[var(--line-height-20)] font-semibold text-[var(--color-text-default)]">CLUSTER UTILIZATION</h6>
              <TimeControls 
                value={timeRange} 
                onChange={setTimeRange}
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
              />
              
              {/* OSD Latencies Chart */}
              <LineChart
                title="OSD Latencies"
                series={latencySeries}
                timeLabels={timeLabels}
                yAxisFormatter={(v) => `${v} ms`}
                height="280px"
              />

              {/* Client Throughput Chart */}
              <LineChart
                title="Client Throughput"
                series={clientThroughputSeries}
                timeLabels={timeLabels}
                yAxisFormatter={(v) => `${v} MiB/s`}
                height="280px"
              />

              {/* Requests/sec Chart */}
              <LineChart
                title="Requests/sec"
                series={requestsSeries}
                timeLabels={timeLabels}
                height="280px"
              />

              {/* Latency Chart */}
              <LineChart
                title="Latency"
                series={latencyDetailSeries}
                timeLabels={timeLabels}
                yAxisFormatter={(v) => `${v} ms`}
                height="280px"
              />

              {/* Recovery Throughput Chart */}
              <LineChart
                title="Recovery Throughput"
                series={recoveryThroughputSeries}
                timeLabels={timeLabels}
                yAxisFormatter={(v) => `${v} B/s`}
                height="280px"
              />
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}

export default StorageHomePage;

