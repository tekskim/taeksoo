import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import ReactECharts from 'echarts-for-react';
import {
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  MonitoringToolbar,
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
  orange400: '#f97316',
  red400: '#f87171',
  slate100: '#f1f5f9',
  slate400: '#94a3b8',
  slate800: '#1e293b',
};

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const alarmTrendData = {
  labels: ['1/1', '1/2', '1/3', '1/4', '1/5', '1/6', '1/7'],
  values: [1, 2, 3, 2, 1, 0, 1],
};

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

const diskIOPSData = {
  labels: ['16:00', '16:10', '16:20', '16:30', '16:40', '16:50'],
  reads: [400, 450, 500, 600, 550, 500],
  writes: [600, 650, 700, 800, 750, 700],
};

const networkIOData = {
  labels: ['16:00', '16:10', '16:20', '16:30', '16:40', '16:50'],
  receive: [400, 450, 500, 600, 550, 500],
  transmit: [500, 550, 600, 700, 650, 600],
};

/* ----------------------------------------
   Card Components
   ---------------------------------------- */

function AlertCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-5 flex-1 flex flex-col">
      <span className="chartTitle">{title}</span>
      <div className="flex-1 flex items-center justify-center text-[48px] font-normal text-[var(--color-text-default)] leading-[48px]">
        {value}
      </div>
    </div>
  );
}

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
          className="absolute z-10 backdrop-blur-[40px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-1.5 flex flex-col gap-1 pointer-events-none"
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
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      borderRadius: 6,
      padding: [8, 12],
      textStyle: {
        color: '#1e293b',
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
          color: '#ffffff',
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
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-2xl p-4 flex-1">
      <div className="chartTitle mb-4">{title}</div>
      <div className="space-y-[22px]">
        {data.map((node) => {
          const percent = type === 'cpu' ? node.cpuPercent : node.ramPercent;
          const used = type === 'cpu' ? node.cpuUsed : node.ramUsed;
          const total = type === 'cpu' ? node.cpuTotal : node.ramTotal;
          const colors = getColors(percent);
          return (
            <div key={node.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-label-sm text-[var(--color-text-default)]">{node.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-body-sm text-[var(--color-text-muted)]">
                    {used}/{total} GiB
                  </span>
                  <div className={`flex items-center px-1.5 py-0.5 rounded-md ${colors.bg}`}>
                    <span className={`text-label-sm ${colors.text}`}>{percent}%</span>
                  </div>
                </div>
              </div>
              <div className="h-[3px] rounded-sm bg-[var(--color-surface-muted)] overflow-hidden">
                <div
                  className="h-full rounded-sm bg-[var(--color-text-muted)] transition-all"
                  style={{ width: `${Math.min(percent, 100)}%` }}
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
}: {
  title: string;
  labels: string[];
  series: number[][];
  colors: string[];
  legendLabels: string[];
  yAxisUnit: string;
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
        formatter: (value: number) => `${value} ${yAxisUnit}`,
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
      className={`chartCard flex-1 ${mode === 'fullscreen' ? 'chartCardFullScreen' : ''}`}
      style={mode === 'normal' && isFullScreen ? { visibility: 'hidden' } : undefined}
    >
      {/* Header */}
      <div className="chartHeader">
        <span className="chartTitle">{title}</span>
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
          {legendLabels.length > 1 && (
            <>
              <button className="toggleBtn" onClick={toggleAll}>
                <span className={`toggleSwitch ${allVisible ? 'toggleSwitchActive' : ''}`} />
                <span>{allVisible ? 'Hide All' : 'View All'}</span>
              </button>
              <span className="toggleDivider">|</span>
            </>
          )}
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

function AlarmTrendCard() {
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
    'Total alerts': true,
  });
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

  const legendLabels = ['Total alerts'];
  const colors = [chartColors.cyan400];

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
    data: alarmTrendData.values,
    color: colors[index],
  }));

  const getOption = () => ({
    animation: false,
    grid: { left: '0', right: '16px', top: '20px', bottom: '16px', containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: alarmTrendData.labels,
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
      min: 0,
      max: 4,
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'white',
      borderColor: '#e2e8f0',
      textStyle: { color: chartColors.slate800, fontSize: 11 },
    },
    series: legendLabels
      .filter((label) => visibleSeries[label])
      .map((label, index) => ({
        name: label,
        type: 'line',
        data: alarmTrendData.values,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        lineStyle: { color: colors[index], width: 1 },
        itemStyle: { color: colors[index] },
        areaStyle: { color: colors[index], opacity: 0.1 },
      })),
  });

  // Render chart content with unique key to force fresh re-render
  const renderChartContent = (mode: 'normal' | 'fullscreen') => (
    <div
      key={`alarm-container-${mode}`}
      className={`chartCard flex-1 ${mode === 'fullscreen' ? 'chartCardFullScreen' : ''}`}
      style={mode === 'normal' && isFullScreen ? { visibility: 'hidden' } : undefined}
    >
      {/* Header */}
      <div className="chartHeader">
        <span className="chartTitle">Last Week Alarm Trend</span>
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
          {legendLabels.length > 1 && (
            <>
              <button className="toggleBtn" onClick={toggleAll}>
                <span className={`toggleSwitch ${allVisible ? 'toggleSwitchActive' : ''}`} />
                <span>{allVisible ? 'Hide All' : 'View All'}</span>
              </button>
              <span className="toggleDivider">|</span>
            </>
          )}
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
            key={`alarm-echart-${mode}`}
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
        title="Last Week Alarm Trend (RAW)"
        series={drawerSeries}
        timeLabels={alarmTrendData.labels}
      />
    </>
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export default function ComputeAdminMonitorOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRangeValue>('1h');

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [
    { label: 'Compute Admin', href: '/compute-admin' },
    { label: 'Monitor Overview' },
  ];

  const timeRangeOptions = [
    { label: '1h', value: '1h' as TimeRangeValue },
    { label: '3h', value: '3h' as TimeRangeValue },
    { label: '1d', value: '1d' as TimeRangeValue },
    { label: '1w', value: '1w' as TimeRangeValue },
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
                  Monitor Overview
                </h1>
              </div>

              {/* Monitoring Toolbar */}
              <MonitoringToolbar
                timeRangeOptions={timeRangeOptions}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                onRefresh={() => console.log('Refresh')}
              />

              {/* Row 1: Alert Cards + Alarm Trend */}
              <div className="flex gap-4">
                <AlertCard title="Today CPU usage > 80% alert" value={0} />
                <AlertCard title="Today RAM usage > 80% alert" value={0} />
                <AlarmTrendCard />
              </div>

              {/* Row 2: Gauge Charts + Pie Chart */}
              <div className="flex gap-4">
                <GaugeCard title="Physical CPU Usage" value={70} used={7} total={10} unit="vCPU" />
                <GaugeCard title="Total RAM Usage" value={70} used={8} total={10} unit="GiB" />
                <GaugeCard
                  title="Physical Storage Usage"
                  value={70}
                  used={8}
                  total={10}
                  unit="TiB"
                />
                <PieChartCard title="Compute Node Status" upCount={5} downCount={5} />
              </div>

              {/* Row 3: Host Usage Charts */}
              <div className="flex gap-4">
                <HostUsageCard title="Host CPU Usage" data={hostUsageData} type="cpu" />
                <HostUsageCard title="Host RAM Usage" data={hostUsageData} type="ram" />
              </div>

              {/* Row 4: Area Charts */}
              <div className="flex gap-4">
                <AreaChartCard
                  title="Host Disk Average IOPS"
                  labels={diskIOPSData.labels}
                  series={[diskIOPSData.reads, diskIOPSData.writes]}
                  colors={[chartColors.cyan400, chartColors.emerald400]}
                  legendLabels={['Reads', 'Writes']}
                  yAxisUnit="ops/s"
                />
                <AreaChartCard
                  title="Host Average Network IO"
                  labels={networkIOData.labels}
                  series={[networkIOData.receive, networkIOData.transmit]}
                  colors={[chartColors.cyan400, chartColors.emerald400]}
                  legendLabels={['Receive', 'Transmit']}
                  yAxisUnit="KB/s"
                />
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}
