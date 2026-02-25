import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { Tooltip, MonitoringToolbar } from '@/design-system';
import {
  IconDotsCircleHorizontal,
  IconArrowsMinimize,
  IconArrowsMaximize,
} from '@tabler/icons-react';
import { DataViewDrawer } from '@/components/DataViewDrawer';

/* ----------------------------------------
   Chart Color Palette
   Uses CSS tokens: --chart-color-1 … --chart-color-10
   ---------------------------------------- */

function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export const chartColors = {
  cyan400: '#22d3ee',
  emerald400: '#34d399',
  amber400: '#fbbf24',
  violet400: '#a78bfa',
  fuchsia400: '#e879f9',
  pink400: '#f472b6',
  red400: '#f87171',
  blue400: '#60a5fa',
  teal400: '#2dd4bf',
  orange400: '#fb923c',
  indigo400: '#818cf8',
  slate400: '#94a3b8',
  slate100: '#f1f5f9',
  slate800: '#1e293b',
};

export const primaryChartColors = [
  chartColors.cyan400,
  chartColors.emerald400,
  chartColors.amber400,
  chartColors.violet400,
  chartColors.fuchsia400,
];

export const extendedChartColors = [
  ...primaryChartColors,
  chartColors.pink400,
  chartColors.red400,
  chartColors.blue400,
  chartColors.teal400,
  chartColors.orange400,
];

/* ----------------------------------------
   Base Chart Options (from storage-dashboard)
   ---------------------------------------- */

/**
 * Convert hex color to rgba string.
 */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Create a gradient area style that fades from the line to transparent.
 * Prevents accumulated opacity when multiple series overlap or stack.
 */
export function getAreaGradient(color: string) {
  return {
    color: {
      type: 'linear' as const,
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: hexToRgba(color, 0.25) },
        { offset: 1, color: hexToRgba(color, 0.02) },
      ],
    },
  };
}

/**
 * Calculate nice y-axis scale with exactly 5 labels (4 intervals).
 * Finds the smallest "nice" interval (1, 2, 2.5, or 5 × 10^n) that fits the data.
 */
export function getNiceScale(dataMax: number): { max: number; interval: number } {
  if (dataMax <= 0) return { max: 4, interval: 1 };

  const rawInterval = dataMax / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval)));
  const niceMultiples = [1, 2, 2.5, 5, 10];
  const interval =
    niceMultiples.map((n) => n * magnitude).find((n) => n >= rawInterval) ?? 10 * magnitude;
  const max = interval * 4;

  return { max, interval };
}

/** Read a CSS variable value at runtime (for ECharts which can't use CSS vars directly) */
function getCSSColor(cssVar: string, fallback: string): string {
  if (typeof window !== 'undefined') {
    const val = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    return val || fallback;
  }
  return fallback;
}

export const baseChartOptions = {
  animation: false,
  grid: {
    left: '0',
    right: '16px',
    top: '30px',
    bottom: '16px',
    containLabel: true,
  },
  xAxis: {
    type: 'category' as const,
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
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: {
      lineStyle: {
        color: getCSSColor('--color-border-subtle', chartColors.slate100),
        opacity: 0.5,
      },
    },
    axisLabel: {
      color: chartColors.slate400,
      fontSize: 10,
    },
  },
  tooltip: {
    trigger: 'axis' as const,
    backgroundColor: 'white',
    borderColor: '#e2e8f0',
    textStyle: { color: chartColors.slate800, fontSize: 11 },
    formatter: (
      params: Array<{ marker: string; seriesName: string; value: number; axisValueLabel: string }>
    ) => {
      if (!Array.isArray(params) || params.length === 0) return '';
      const time = params[0].axisValueLabel;
      const items = params
        .map(
          (p) =>
            `<div style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${p.color};"></span><span>${p.seriesName}</span><span style="font-weight: 500; margin-left: auto;">${p.value}</span></div>`
        )
        .join('');
      return `<div style="font-size: 11px;">${time}<div style="margin-top: 4px;">${items}</div></div>`;
    },
    axisPointer: {
      type: 'line',
      snap: true,
      lineStyle: {
        color: chartColors.slate400,
        type: 'dashed',
      },
    },
  },
};

/* ----------------------------------------
   Bar chart Demo (ECharts - from storage-dashboard)
   ---------------------------------------- */

export function BarChartDemo({ variant }: { variant: 'vertical' | 'horizontal' | 'grouped' }) {
  const labels = ['Instances', 'Volumes', 'Networks', 'Snapshots', 'Backups'];
  const currentData = [45, 72, 28, 56, 33];
  const previousData = [35, 55, 42, 38, 28];

  const getOption = () => {
    if (variant === 'horizontal') {
      return {
        ...baseChartOptions,
        grid: { ...baseChartOptions.grid, left: '80px' },
        xAxis: {
          type: 'value' as const,
          min: 0,
          max: 100,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: {
            lineStyle: {
              color: getCSSColor('--color-border-subtle', chartColors.slate100),
              opacity: 0.5,
            },
          },
          axisLabel: { color: chartColors.slate400, fontSize: 10 },
        },
        yAxis: {
          type: 'category' as const,
          data: labels,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: chartColors.slate400, fontSize: 10 },
        },
        series: [
          {
            type: 'bar',
            data: currentData,
            itemStyle: { color: primaryChartColors[0], borderRadius: [0, 4, 4, 0] },
            barWidth: '50%',
          },
        ],
      };
    }

    if (variant === 'grouped') {
      return {
        ...baseChartOptions,
        xAxis: {
          type: 'category' as const,
          data: labels,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: chartColors.slate400, fontSize: 10 },
        },
        yAxis: {
          ...baseChartOptions.yAxis,
          min: 0,
          max: 100,
        },
        series: [
          {
            name: 'Current',
            type: 'bar',
            data: currentData,
            itemStyle: { color: primaryChartColors[0], borderRadius: [4, 4, 0, 0] },
            barGap: '10%',
          },
          {
            name: 'Previous',
            type: 'bar',
            data: previousData,
            itemStyle: { color: primaryChartColors[1], borderRadius: [4, 4, 0, 0] },
          },
        ],
      };
    }

    // Vertical (default)
    return {
      ...baseChartOptions,
      xAxis: {
        type: 'category' as const,
        data: labels,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: chartColors.slate400, fontSize: 10 },
      },
      yAxis: {
        ...baseChartOptions.yAxis,
        min: 0,
        max: 100,
      },
      series: [
        {
          type: 'bar',
          data: currentData,
          itemStyle: { color: primaryChartColors[0], borderRadius: [4, 4, 0, 0] },
          barWidth: '50%',
        },
      ],
    };
  };

  return (
    <div className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-4">
      <ReactECharts
        option={getOption()}
        style={{ height: variant === 'horizontal' ? '250px' : '200px' }}
        notMerge={true}
        opts={{ devicePixelRatio: window.devicePixelRatio }}
      />
      {variant === 'grouped' && (
        <div className="flex gap-4 mt-2 justify-start">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: primaryChartColors[0] }}
            />
            <span className="text-body-sm text-[var(--color-text-muted)]">Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: primaryChartColors[1] }}
            />
            <span className="text-body-sm text-[var(--color-text-muted)]">Previous</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   Area chart Demo (ECharts - from storage-dashboard)
   ---------------------------------------- */

// Generate time labels for charts
export const generateTimeLabels = () => {
  const labels = [];
  for (let i = 0; i <= 50; i += 10) {
    const min = i.toString().padStart(2, '0');
    labels.push(`13:${min}`);
  }
  return labels;
};

// LineChart Component (from storage-dashboard)
interface LineChartSeries {
  name: string;
  data: number[];
  color: string;
}

// Time options for full screen mode (kept for reference/export)
export const timeOptions = [
  { label: '30m', value: '30m' as const },
  { label: '1h', value: '1h' as const },
  { label: '6h', value: '6h' as const },
  { label: '12h', value: '12h' as const },
  { label: '24h', value: '24h' as const },
];

export function LineChart({
  title,
  series,
  yAxisFormatter = (v: number) => `${v}`,
  height = '100%',
  onFullScreen,
  isFullScreen = false,
  onExitFullScreen,
  timeControls,
}: {
  title: string;
  series: LineChartSeries[];
  yAxisFormatter?: (value: number) => string;
  height?: string;
  onFullScreen?: () => void;
  isFullScreen?: boolean;
  onExitFullScreen?: () => void;
  timeControls?: React.ReactNode;
}) {
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>(
    Object.fromEntries(series.map((s) => [s.name, true]))
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDataView, setShowDataView] = useState(false);

  const timeLabels = generateTimeLabels();

  const allVisible = Object.values(visibleSeries).every((v) => v);
  const toggleAll = () => {
    const newState = !allVisible;
    setVisibleSeries(Object.fromEntries(series.map((s) => [s.name, newState])));
  };

  const handleFullScreen = () => {
    setMenuOpen(false);
    if (onFullScreen) onFullScreen();
  };

  // Calculate y-axis bounds for exactly 5 labels using nice-number algorithm
  const visibleData = series.filter((s) => visibleSeries[s.name]).flatMap((s) => s.data);
  const dataMax = visibleData.length > 0 ? Math.max(...visibleData) : 100;
  const { max: niceMax, interval: yInterval } = getNiceScale(dataMax);

  const option = {
    animation: false,
    grid: {
      left: '0',
      right: '16px',
      top: '20px',
      bottom: '16px',
      containLabel: true,
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
      interval: yInterval,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: getCSSColor('--color-border-subtle', chartColors.slate100),
          opacity: 0.5,
        },
      },
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
        formatter: yAxisFormatter,
      },
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'white',
      borderColor: '#e2e8f0',
      textStyle: {
        color: chartColors.slate800,
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
              `<div style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${p.color};"></span><span>${p.seriesName}</span><span style="font-weight: 500; margin-left: auto;">${yAxisFormatter(p.value)}</span></div>`
          )
          .join('');
        return `<div style="font-size: 11px;">${time}<div style="margin-top: 4px;">${items}</div></div>`;
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
        areaStyle: getAreaGradient(s.color),
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
            onClick={isFullScreen ? onExitFullScreen : handleFullScreen}
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
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            opts={{ devicePixelRatio: window.devicePixelRatio }}
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

// ChartWithFullScreen Wrapper Component
export function ChartWithFullScreen({
  title,
  series,
  yAxisFormatter = (v: number) => `${v}`,
  height = '100%',
}: {
  title: string;
  series: LineChartSeries[];
  yAxisFormatter?: (value: number) => string;
  height?: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isFullScreen = searchParams.get('fullscreen') === 'true';
  const fullScreenContainerRef = useRef<HTMLDivElement>(null);
  const [containerReady, setContainerReady] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreen) {
        setSearchParams({}, { replace: true });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, setSearchParams]);

  useEffect(() => {
    if (isFullScreen && fullScreenContainerRef.current) {
      const timer = setTimeout(() => setContainerReady(true), 50);
      return () => clearTimeout(timer);
    } else {
      setContainerReady(false);
    }
  }, [isFullScreen]);

  const handleEnterFullScreen = () => {
    setSearchParams({ fullscreen: 'true' }, { replace: true });
  };

  const handleExitFullScreen = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <>
      {/* Regular Chart */}
      <LineChart
        title={title}
        series={series}
        yAxisFormatter={yAxisFormatter}
        height={height}
        onFullScreen={handleEnterFullScreen}
      />

      {/* Full Screen Overlay & Chart */}
      {isFullScreen && (
        <>
          <div className="fullScreenOverlay" onClick={handleExitFullScreen} />
          <div className="fullScreenFloating" ref={fullScreenContainerRef}>
            {containerReady && (
              <LineChart
                title={title}
                series={series}
                yAxisFormatter={yAxisFormatter}
                isFullScreen={true}
                onExitFullScreen={handleExitFullScreen}
                timeControls={<MonitoringToolbar timeRangeOptions={timeOptions} />}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}

// QuotaBarDemo Component
export function QuotaBarDemo({
  label,
  used,
  total,
  unit,
}: {
  label: string;
  used: number;
  total: number;
  unit: string;
}) {
  const percentage = Math.round((used / total) * 100);

  const getColors = () => {
    if (percentage >= 100)
      return {
        bg: 'bg-[var(--color-status-error-subtle)]',
        text: 'text-[var(--color-status-error)]',
        bar: 'bg-[var(--color-state-danger)]',
        dot: 'bg-[var(--color-state-danger)]',
      };
    if (percentage >= 70)
      return {
        bg: 'bg-[var(--color-status-warning-subtle)]',
        text: 'text-[var(--color-status-warning)]',
        bar: 'bg-[var(--color-state-warning)]',
        dot: 'bg-[var(--color-state-warning)]',
      };
    return {
      bg: 'bg-[var(--color-status-success-subtle)]',
      text: 'text-[var(--color-status-success)]',
      bar: 'bg-[var(--color-state-success)]',
      dot: 'bg-[var(--color-state-success)]',
    };
  };

  const colors = getColors();

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-label-sm leading-[var(--line-height-16)] text-[var(--color-text-default)]">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-body-sm leading-[var(--line-height-16)] text-[var(--color-text-muted)]">
            {used}/{total} {unit}
          </span>
          <div className={`flex items-center px-1.5 py-0.5 rounded-md ${colors.bg}`}>
            <span className={`text-label-sm leading-[var(--line-height-16)] ${colors.text}`}>
              {percentage}%
            </span>
          </div>
        </div>
      </div>
      <Tooltip
        content={
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
              <span>Used: {used}</span>
            </div>
          </div>
        }
        position="top"
      >
        <div className="w-full">
          <div className="h-[3px] rounded-sm bg-[var(--color-surface-muted)] overflow-hidden cursor-pointer">
            <div
              className={`h-full rounded-sm ${colors.bar} transition-all`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </Tooltip>
    </div>
  );
}

export function AreaChartDemo({ variant }: { variant: 'basic' | 'stacked' | 'nodata' }) {
  // Basic variant - Network Traffic (single series)
  const networkTrafficSeries: LineChartSeries[] = [
    { name: 'Traffic', data: [120, 180, 150, 220, 280, 240], color: chartColors.cyan400 },
  ];

  if (variant === 'basic') {
    return (
      <ChartWithFullScreen
        title="Network traffic"
        series={networkTrafficSeries}
        yAxisFormatter={(v) => `${v} MB/s`}
        height="200px"
      />
    );
  }

  // No data variant
  if (variant === 'nodata') {
    const emptySeriesData: LineChartSeries[] = [
      { name: 'Traffic', data: [], color: chartColors.cyan400 },
    ];
    return (
      <ChartWithFullScreen
        title="Network traffic"
        series={emptySeriesData}
        yAxisFormatter={(v) => `${v} MB/s`}
        height="200px"
      />
    );
  }

  // Stacked variant - CPU Utilization
  const cpuUtilizationSeries: LineChartSeries[] = [
    { name: 'osd.0', data: [0.3, 0.45, 0.55, 0.6, 0.8, 1.1], color: chartColors.cyan400 },
    { name: 'osd.1', data: [0.8, 0.95, 1.15, 1.2, 1.0, 1.5], color: chartColors.emerald400 },
    { name: 'osd.2', data: [0.5, 0.7, 0.9, 0.85, 0.75, 1.1], color: chartColors.amber400 },
    { name: 'osd.3', data: [0.3, 0.5, 0.6, 0.55, 0.65, 0.8], color: chartColors.violet400 },
  ];

  return (
    <ChartWithFullScreen
      title="CPU Utilization"
      series={cpuUtilizationSeries}
      yAxisFormatter={(v) => `${v.toFixed(2)}%`}
      height="200px"
    />
  );
}

/* ----------------------------------------
   Pie chart Demo (ECharts - from storage-dashboard)
   ---------------------------------------- */

// Extended color palette for pie charts with many segments (re-uses top-level export)

interface PieChartData {
  name: string;
  value: number;
}

export function PieChartDemo({
  title,
  data,
  showPercentOnSlice = true,
}: {
  title: string;
  data: PieChartData[];
  showPercentOnSlice?: boolean;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const chartData = data.map((item, index) => ({
    ...item,
    itemStyle: { color: extendedChartColors[index % extendedChartColors.length] },
  }));

  const legendData = data.map((item, index) => ({
    label: item.name,
    value: Math.round((item.value / total) * 100),
    color: extendedChartColors[index % extendedChartColors.length],
  }));

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
        label: showPercentOnSlice
          ? {
              show: true,
              position: 'inside',
              formatter: (params: { percent: number }) => {
                return params.percent >= 15 ? `${params.percent.toFixed(0)}%` : '';
              },
              fontSize: 12,
              fontWeight: 600,
              color: '#ffffff',
              fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
            }
          : {
              show: false,
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
        labelLine: {
          show: false,
        },
        data: chartData,
      },
    ],
  });

  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-4 w-[var(--search-input-width)]">
      <span className="text-label-md text-[var(--color-text-default)]">{title}</span>
      <div className="flex justify-center">
        <ReactECharts
          option={getOption()}
          style={{ height: '180px', width: '180px' }}
          opts={{ devicePixelRatio: window.devicePixelRatio }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center max-h-[60px] overflow-y-auto legend-scroll">
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

/* ----------------------------------------
   Doughnut chart Demo (ECharts - matches SingleValueDoughnutCard from storage)
   ---------------------------------------- */

export function DoughnutChartDemo({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color?: string;
}) {
  const getColor = (cssVar: string, fallback: string) => {
    if (typeof window !== 'undefined') {
      const val = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
      return val || fallback;
    }
    return fallback;
  };

  const mainColor = color || getColor('--color-status-error', '#ef4444');
  const bgColor = getColor('--color-border-subtle', '#e2e8f0');

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
      formatter: (params: { name: string; value: number; color: string }) => {
        return `<span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${params.color}; margin-right: 6px;"></span>${params.name}<br/><span style="font-weight: 500; margin-left: 14px;">${params.value}%</span>`;
      },
    },
    animation: false,
    series: [
      {
        type: 'pie',
        radius: ['68%', '80%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 0,
          borderWidth: 0,
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          scale: false,
        },
        data: [
          { value: value, name: 'Used', itemStyle: { color: mainColor } },
          { value: 100 - value, name: 'Available', itemStyle: { color: bgColor } },
        ],
      },
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          text: `${value}%`,
          textAlign: 'center',
          textVerticalAlign: 'middle',
          fill: getColor('--color-text-default', '#0f172a'),
          fontSize: 18,
          fontWeight: 500,
          fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
        },
      },
    ],
  });

  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-4 w-[var(--search-input-width)]">
      <span className="text-label-md text-[var(--color-text-default)]">{title}</span>
      <div className="flex justify-center">
        <ReactECharts
          option={getOption()}
          style={{ height: '180px', width: '180px' }}
          opts={{ devicePixelRatio: window.devicePixelRatio }}
        />
      </div>
    </div>
  );
}

/* ----------------------------------------
   Half-Doughnut chart Demo (ECharts - from storage-dashboard)
   ---------------------------------------- */

export function HalfDoughnutChartDemo({
  value,
  label,
  status = 'default',
  used,
  total,
  unit,
}: {
  value: number;
  label: string;
  status?: 'default' | 'success' | 'warning' | 'error';
  used?: number;
  total?: number;
  unit?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Chart dimensions
  const chartWidth = 180;
  const chartHeight = 160;
  const centerX = chartWidth * 0.5; // 50%
  const centerY = chartHeight * 0.65; // 65%
  const radius = Math.min(chartWidth, chartHeight) * 0.45; // 90% of half
  const arcWidth = 14;
  const innerRadius = radius - arcWidth;
  const outerRadius = radius;

  // Get color from design system CSS variables
  const getColor = (cssVar: string, fallback: string) => {
    if (typeof window !== 'undefined') {
      const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
      return value || fallback;
    }
    return fallback;
  };

  const colorMap = {
    default: primaryChartColors[0],
    success: getColor('--color-status-success', '#22c55e'),
    warning: getColor('--color-status-warning', '#f97316'),
    error: getColor('--color-status-error', '#ef4444'),
  };

  const color = colorMap[status];
  const available = total !== undefined && used !== undefined ? total - used : 0;
  const availablePercent =
    total !== undefined && used !== undefined ? Math.round((available / total) * 100) : 0;

  // Check if mouse is over the gauge arc
  const isOverGaugeArc = (mx: number, my: number) => {
    const dx = mx - centerX;
    const dy = my - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < innerRadius - 4 || distance > outerRadius + 4) return false;

    // Gauge sweeps clockwise from 210° (bottom-left) to 330° (bottom-right)
    // covering the upper arc through 0° (right). The gap is 210°→330° through 270° (bottom).
    let angle = Math.atan2(-dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    return angle <= 210 || angle >= 330;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      // Adjust for padding (p-4 = 16px)
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
        pointer: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        title: {
          show: false,
        },
        detail: {
          show: false,
        },
      },
    ],
  });

  return (
    <div
      ref={containerRef}
      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4 relative w-fit"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        <ReactECharts
          option={getOption()}
          style={{ height: '160px', width: '180px' }}
          opts={{ devicePixelRatio: window.devicePixelRatio }}
        />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
        <span className="text-heading-h3 leading-[28px] text-[var(--color-text-default)]">
          {value}%
        </span>
        {used !== undefined && total !== undefined ? (
          <span className="text-body-md text-[var(--color-text-subtle)]">
            {used}
            {unit}/{total}
            {unit}
          </span>
        ) : (
          <span className="text-body-md text-[var(--color-text-subtle)]">{label}</span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && used !== undefined && total !== undefined && (
        <div
          className="absolute z-10 backdrop-blur-[40px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-1.5 flex flex-col gap-1 pointer-events-none"
          style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-body-sm leading-[14px] text-[var(--color-text-default)] whitespace-nowrap">
              Used:{' '}
              <span className="font-medium">
                {used}
                {unit} ({value}%)
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-border-subtle)]" />
            <span className="text-body-sm leading-[14px] text-[var(--color-text-default)] whitespace-nowrap">
              Available:{' '}
              <span className="font-medium">
                {available.toFixed(1)}
                {unit} ({availablePercent}%)
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   Single Value Doughnut chart Demo (ECharts)
   ---------------------------------------- */

export function SingleValueDoughnutDemo({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color?: string;
}) {
  const getColor = (cssVar: string, fallback: string) => {
    if (typeof window !== 'undefined') {
      const val = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
      return val || fallback;
    }
    return fallback;
  };

  const mainColor = color || getColor('--color-status-error', '#ef4444');
  const bgColor = getColor('--color-border-subtle', '#e2e8f0');

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
      formatter: (params: { name: string; value: number; color: string }) => {
        return `<span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${params.color}; margin-right: 6px;"></span>${params.name}<br/><span style="font-weight: 500; margin-left: 14px;">${params.value}%</span>`;
      },
    },
    animationDuration: 1000,
    animationEasing: 'cubicOut' as const,
    series: [
      {
        type: 'pie',
        radius: ['68%', '80%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 0,
          borderWidth: 0,
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          scale: false,
        },
        data: [
          { value: value, name: 'Used', itemStyle: { color: mainColor } },
          { value: 100 - value, name: 'Available', itemStyle: { color: bgColor } },
        ],
      },
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          text: `${value}%`,
          textAlign: 'center',
          textVerticalAlign: 'middle',
          fill: getColor('--color-text-default', '#0f172a'),
          fontSize: 18,
          fontWeight: 500,
          fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
        },
      },
    ],
  });

  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
      <h4 className="text-body-md font-medium text-[var(--color-text-default)] mb-2">{title}</h4>
      <ReactECharts
        option={getOption()}
        style={{ height: '180px', width: '200px' }}
        opts={{ devicePixelRatio: window.devicePixelRatio }}
      />
    </div>
  );
}
