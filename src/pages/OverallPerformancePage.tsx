import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  fixedColumns,
  columnMinWidths,
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
  { label: 'Total raw capacity', value: '11.6', unit: 'TiB' },
  { label: 'Raw capacity Consumed', value: '47.4', unit: 'TiB' },
  { label: 'Logical stored', value: '15.8', unit: 'TiB' },
  { label: 'Compression savings', value: '0', unit: 'B' },
  { label: 'Compression eligibility', value: 'N/A' },
  { label: 'Compression factor', value: 'N/A' },
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
  {
    id: '1',
    poolName: '.mgr',
    type: 'replica:3',
    usableFree: '10.57 GiB',
    percentUsed: '0.00%',
    growth5d: '896.02 KiB',
    growthPositive: true,
    iops: '0.00',
    bandwidth: '0.00 B/s',
    stored: '8.50 GiB',
  },
  {
    id: '2',
    poolName: '.mgr',
    type: 'replica:4',
    usableFree: '15.23 GiB',
    percentUsed: '0.05%',
    growth5d: '1.20 MiB',
    growthPositive: true,
    iops: '0.00',
    bandwidth: '0.00 B/s',
    stored: '9.00 GiB',
  },
  {
    id: '3',
    poolName: '.mgr',
    type: 'replica:5',
    usableFree: '20.45 GiB',
    percentUsed: '0.10%',
    growth5d: '1.50 MiB',
    growthPositive: true,
    iops: '0.00',
    bandwidth: '0.00 B/s',
    stored: '10.00 GiB',
  },
  {
    id: '4',
    poolName: '.mgr',
    type: 'replica:3',
    usableFree: '10.57 GiB',
    percentUsed: '0.00%',
    growth5d: '0.00 B',
    growthPositive: false,
    iops: '0.00',
    bandwidth: '0.00 B/s',
    stored: '8.50 GiB',
  },
  {
    id: '5',
    poolName: '.mgr',
    type: 'replica:3',
    usableFree: '10.57 GiB',
    percentUsed: '0.00%',
    growth5d: '-525.01 B',
    growthPositive: false,
    iops: '0.00',
    bandwidth: '0.00 B/s',
    stored: '8.50 GiB',
  },
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
  { label: 'Network load', value: '57.5', unit: 'MiB' },
];

// CPU Busy chart series
const cpuBusySeries = [
  {
    name: 'b0x/2e1-ceph0dg-c01',
    color: chartColors.cyan400,
    data: [0.2, 0.25, 0.35, 0.4, 0.38, 0.55],
  },
  {
    name: 'b0x/2e1-ceph0dg-c02',
    color: chartColors.emerald400,
    data: [0.35, 0.45, 0.5, 0.55, 0.6, 0.75],
  },
  {
    name: 'b0x/2e1-ceph0dg-c03',
    color: chartColors.amber400,
    data: [0.5, 0.6, 0.7, 0.85, 0.9, 1.1],
  },
  {
    name: 'b0x/2e1-ceph0dg001',
    color: chartColors.violet400,
    data: [0.6, 0.7, 0.8, 0.95, 1.0, 1.2],
  },
  {
    name: 'b0x/2e1-ceph0dg002',
    color: chartColors.pink400,
    data: [0.15, 0.2, 0.18, 0.22, 0.25, 0.3],
  },
];

// Network load chart series
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
  { name: '@95%ile', color: chartColors.violet400, data: [0.28, 0.32, 0.38, 0.35, 0.33, 0.3] },
  { name: 'AVG read', color: chartColors.emerald400, data: [0.18, 0.2, 0.25, 0.28, 0.26, 0.22] },
  { name: 'MAX read', color: chartColors.amber400, data: [0.22, 0.25, 0.3, 0.32, 0.3, 0.26] },
];

// OSD Write Latencies chart series
const osdWriteLatenciesSeries = [
  { name: '@95%ile write', color: chartColors.cyan400, data: [5.5, 6.0, 7.2, 7.8, 7.5, 7.0] },
  { name: 'AVG write', color: chartColors.emerald400, data: [4.0, 4.5, 5.5, 6.2, 6.0, 5.5] },
  { name: 'MAX write', color: chartColors.amber400, data: [4.8, 5.2, 6.2, 7.0, 6.5, 6.0] },
];

// OSD Pie chart Data
const osdTypesSummaryData = [
  { name: 'hdd', value: 15 },
  { name: 'nvme', value: 25 },
  { name: 'ssd', value: 30 },
  { name: 'hybrid', value: 10 },
  { name: 'sata', value: 5 },
  { name: 'sas', value: 5 },
  { name: 'pcie', value: 4 },
  { name: 'u.2', value: 3 },
  { name: 'm.2', value: 2 },
  { name: 'scsi', value: 1 },
];

const osdObjectstoreTypesData = [
  { name: 'bluestore', value: 70 },
  { name: 'filestore', value: 20 },
  { name: 'seastore', value: 10 },
];

const osdSizeSummaryData = [
  { name: '<3TB', value: 20 },
  { name: '3-6TB', value: 30 },
  { name: '6-12TB', value: 40 },
  { name: '>12TB', value: 10 },
];

// Distribution of PGs per OSD chart series
const pgDistributionSeries = [
  { name: 'PGs per OSD 1', color: chartColors.cyan400, data: [128, 130, 132, 135, 138, 140] },
  { name: 'PGs per OSD 2', color: chartColors.emerald400, data: [125, 126, 128, 130, 132, 135] },
  { name: 'PGs per OSD 3', color: chartColors.amber400, data: [120, 122, 125, 127, 128, 130] },
  { name: 'PGs per OSD 4', color: chartColors.violet400, data: [118, 120, 122, 124, 126, 128] },
];

// Read/Write Profile chart series
const readWriteProfileSeries = [
  { name: 'Reads', color: chartColors.cyan400, data: [150, 180, 450, 520, 380, 420] },
  { name: 'Writes', color: chartColors.emerald400, data: [50, 80, 120, 150, 100, 90] },
];

// Top Slow OSD Ops table data
interface SlowOsdOpsRow {
  id: string;
  osdId: string;
  slowOps: string;
}

const slowOsdOpsData: SlowOsdOpsRow[] = [
  { id: '1', osdId: 'bzfv0rv1-cephadm-cl01', slowOps: '0.00' },
  { id: '2', osdId: 'bzfv0rv1-cephadm-cl01', slowOps: '0.00' },
  { id: '3', osdId: 'bzfv0rv1-cephadm-cl01', slowOps: '0.00' },
  { id: '4', osdId: 'bzfv0rv1-cephadm-cl01', slowOps: '0.00' },
];

// Extended chart colors for pie charts
const extendedChartColors = [
  chartColors.cyan400,
  chartColors.emerald400,
  chartColors.amber400,
  chartColors.violet400,
  chartColors.pink400,
  chartColors.red400,
  chartColors.blue400,
  chartColors.teal400,
  chartColors.orange400,
  chartColors.indigo400,
  '#94a3b8', // slate400
  '#a1a1aa', // zinc400
];

/* ----------------------------------------
   PieChart Component (from design system)
   ---------------------------------------- */

interface PieChartData {
  name: string;
  value: number;
}

function PieChartCard({
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
      },
      formatter: (params: { marker: string; name: string; value: number; percent: number }) => {
        return `<span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${params.color}; margin-right: 6px;"></span>${params.name}<br/><span style="font-weight: 600; margin-left: 14px;">${params.value} (${params.percent.toFixed(0)}%)</span>`;
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
    <div className="flex-1 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-4">
      <span className="text-[length:var(--font-size-13)] font-medium text-[var(--color-text-default)]">
        {title}
      </span>
      <div className="flex justify-center">
        <ReactECharts option={getOption()} style={{ height: '180px', width: '180px' }} />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center max-h-[60px] overflow-y-auto legend-scroll">
        {legendData.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   SingleValueDoughnut Component (from design system)
   ---------------------------------------- */

function SingleValueDoughnutCard({
  title,
  value,
  color,
  className,
}: {
  title: string;
  value: number;
  color?: string;
  className?: string;
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
      show: false,
    },
    animation: false,
    series: [
      {
        type: 'pie',
        radius: ['68%', '80%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        silent: true,
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
          disabled: true,
        },
        data: [
          { value: value, itemStyle: { color: mainColor } },
          { value: 100 - value, itemStyle: { color: bgColor } },
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
    <div
      className={`bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-4 ${className || 'flex-1'}`}
    >
      <span className="text-[length:var(--font-size-13)] font-medium text-[var(--color-text-default)]">
        {title}
      </span>
      <div className="flex justify-center">
        <ReactECharts option={getOption()} style={{ height: '180px', width: '180px' }} />
      </div>
    </div>
  );
}

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
        {unit && (
          <span className="text-[14px] font-normal text-[var(--color-text-muted)] ml-1">
            {unit}
          </span>
        )}
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

function ChartCard({
  title,
  series,
  yAxisFormatter = (v: number) => `${v}`,
  isDarkMode,
  timeRange,
  onTimeRangeChange,
  onRefresh,
}: ChartCardProps) {
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(series.map((s) => [s.name, true]))
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showDataView, setShowDataView] = useState(false);

  const timeLabels = generateTimeLabels();
  const allVisible = Object.values(visibleSeries).every((v) => v);

  const toggleAll = () => {
    const newState = !allVisible;
    setVisibleSeries(Object.fromEntries(series.map((s) => [s.name, newState])));
  };

  const handleFullScreen = () => {
    setMenuOpen(false);
    setIsFullScreen(true);
  };

  const handleExitFullScreen = () => {
    setIsFullScreen(false);
  };

  // Calculate y-axis bounds for exactly 5 labels
  const visibleData = series.filter((s) => visibleSeries[s.name]).flatMap((s) => s.data);
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
        padding: [0, 0, 0, 15],
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

  if (isFullScreen) {
    return (
      <>
        <div className="fullScreenOverlay" onClick={handleExitFullScreen} />
        <div className="fullScreenFloating">{chartContent}</div>
      </>
    );
  }

  return chartContent;
}

/* ----------------------------------------
   EmptyStateChartCard Component (No Data Area chart)
   ---------------------------------------- */

interface EmptyStateChartCardProps {
  title: string;
  yAxisFormatter?: (value: number) => string;
  isDarkMode: boolean;
}

function EmptyStateChartCard({
  title,
  yAxisFormatter = (v: number) => `${v}`,
  isDarkMode,
}: EmptyStateChartCardProps) {
  const timeLabels = generateTimeLabels();

  // Theme-aware colors
  const splitLineColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : chartColors.slate100;
  const splitLineOpacity = isDarkMode ? 1 : 0.5;

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
        padding: [0, 0, 0, 15],
      },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: 100,
      interval: 25,
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
    series: [],
  };

  return (
    <div className="chartCard">
      {/* Header */}
      <div className="chartHeader">
        <span className="chartTitle">{title}</span>
        <div className="chartControls">
          <button className="expandTrigger" title="Expand">
            <IconArrowsMaximize size={16} stroke={1.5} />
          </button>
        </div>
      </div>

      {/* Chart Body */}
      <div className="chartBody">
        <div className="chartWrapper">
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge={true} />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Overall performance Page
   ---------------------------------------- */

export function OverallPerformancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('pools');
  const [timeRange, setTimeRange] = useState<TimeRangeValue>('30m');
  const { isDark } = useDarkMode();

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Pool Overview table columns
  const poolOverviewColumns: TableColumn<PoolOverviewRow>[] = [
    { key: 'poolName', label: 'Pool name', flex: 1, sortable: true },
    { key: 'type', label: 'Type', flex: 1, sortable: false },
    { key: 'usableFree', label: 'Usable free', flex: 1, sortable: true },
    { key: 'percentUsed', label: '% Used', flex: 1, sortable: true },
    {
      key: 'growth5d',
      label: 'Growth (5d)',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <span
          className={
            row.growthPositive
              ? 'text-[var(--color-state-success)]'
              : 'text-[var(--color-state-danger)]'
          }
        >
          {row.growth5d}
        </span>
      ),
    },
    { key: 'iops', label: 'IOPS', flex: 1, sortable: true },
    { key: 'bandwidth', label: 'Bandwidth', flex: 1, sortable: true },
    { key: 'stored', label: 'Stored', flex: 1, sortable: true },
    {
      key: 'id',
      label: 'Detail performance',
      flex: 1, minWidth: columnMinWidths.id,
      align: 'center' as const,
      render: () => (
        <button className="p-1.5 hover:bg-[var(--color-surface-subtle)] rounded transition-colors">
          <IconTerminal2 size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
      ),
    },
  ];

  // Host Overview table columns
  const hostOverviewColumns: TableColumn<HostOverviewRow>[] = [
    { key: 'hostname', label: 'Hostname', flex: 2, sortable: true },
    { key: 'totalMemory', label: 'Total memory', flex: 1, sortable: true },
    { key: 'rawCapacity', label: 'Raw capacity', flex: 1, sortable: true },
    {
      key: 'id',
      label: 'Detail performance',
      flex: 1, minWidth: columnMinWidths.id,
      align: 'center' as const,
      render: () => (
        <button className="p-1.5 hover:bg-[var(--color-surface-subtle)] rounded transition-colors">
          <IconTerminal2 size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
      ),
    },
  ];

  // OSD Latency table columns
  const osdLatencyColumns: TableColumn<OsdLatencyRow>[] = [
    { key: 'osdId', label: 'OSD ID', flex: 1, sortable: true },
    { key: 'latency', label: 'Latency', flex: 1, sortable: true },
  ];

  // Top Slow OSD Ops table columns
  const slowOsdOpsColumns: TableColumn<SlowOsdOpsRow>[] = [
    {
      key: 'osdId',
      label: 'OSD ID',
      flex: 2,
      sortable: true,
      render: (_, row) => (
        <span className="text-[var(--color-action-primary)] hover:underline cursor-pointer">
          {row.osdId}
        </span>
      ),
    },
    { key: 'slowOps', label: 'Slow ops', flex: 2, sortable: true },
    {
      key: 'id',
      label: 'Action',
      flex: 1, minWidth: columnMinWidths.id,
      align: 'center' as const,
      render: () => (
        <button className="p-1.5 hover:bg-[var(--color-surface-subtle)] rounded transition-colors">
          <IconTerminal2 size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'}`}
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
            breadcrumb={
              <Breadcrumb
                items={[{ label: 'Home', href: '/storage' }, { label: 'Overall performance' }]}
              />
            }
            actions={
              <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={6} className="min-w-[1176px]">
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Overall performance
                </h1>
              </div>

              {/* Page Tabs */}
              <div className="w-full">
                <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
                  <TabList>
                    <Tab value="pools">Pools</Tab>
                    <Tab value="hosts">Hosts</Tab>
                    <Tab value="osds">OSDs</Tab>
                    <Tab value="images">Images</Tab>
                  </TabList>

                  {/* Pools Tab Panel */}
                  <TabPanel value="pools" className="pt-6">
                    <VStack gap={6}>
                      {/* Time Period Selector */}
                      <div className="flex justify-start">
                        <MonitoringToolbar
                          timeRange={timeRange}
                          onTimeRangeChange={setTimeRange}
                          onRefresh={() => console.log('Refresh clicked')}
                          showRefresh={true}
                        />
                      </div>

                      {/* Stats Cards - Row 1 */}
                      <div className="flex gap-6">
                        {poolsStats.slice(0, 4).map((stat) => (
                          <StatCardItem key={stat.label} {...stat} />
                        ))}
                      </div>

                      {/* Stats Cards - Row 2 */}
                      <div className="flex gap-6">
                        {poolsStats.slice(4, 8).map((stat) => (
                          <StatCardItem key={stat.label} {...stat} />
                        ))}
                      </div>

                      {/* Charts - Row 1 */}
                      <div className="flex gap-6">
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
                      <div className="flex gap-6">
                        <div className="w-[calc(50%-12px)]">
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
                        <div className="w-[calc(50%-12px)]">
                          <EmptyStateChartCard
                            title="Recovery Rate"
                            yAxisFormatter={(v) => `${v} MB/s`}
                            isDarkMode={isDark}
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
                      <div className="flex justify-start">
                        <MonitoringToolbar
                          timeRange={timeRange}
                          onTimeRangeChange={setTimeRange}
                          onRefresh={() => console.log('Refresh clicked')}
                          showRefresh={true}
                        />
                      </div>

                      {/* Stats Cards Row */}
                      <div className="flex gap-6">
                        {hostsStats.map((stat) => (
                          <StatCardItem key={stat.label} {...stat} />
                        ))}
                      </div>

                      {/* Charts Row */}
                      <div className="flex gap-6">
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
                            title="Network load"
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
                      <div className="flex justify-start">
                        <MonitoringToolbar
                          timeRange={timeRange}
                          onTimeRangeChange={setTimeRange}
                          onRefresh={() => console.log('Refresh clicked')}
                          showRefresh={true}
                        />
                      </div>

                      {/* Read Latencies Row */}
                      <div className="flex gap-6">
                        {/* Highest READ Latencies Table */}
                        <div className="flex-1 h-[334px]">
                          <SectionCard className="h-full">
                            <SectionCard.Header title="Highest READ Latencies" />
                            <SectionCard.Content gap={0} className="overflow-auto flex-1">
                              <Table<OsdLatencyRow>
                                columns={osdLatencyColumns}
                                data={osdReadLatencyData}
                                rowKey="id"
                                rowHeight="40px"
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
                      <div className="flex gap-6">
                        {/* Highest WRITE Latencies Table */}
                        <div className="flex-1 h-[334px]">
                          <SectionCard className="h-full">
                            <SectionCard.Header title="Highest WRITE Latencies" />
                            <SectionCard.Content gap={0} className="overflow-auto flex-1">
                              <Table<OsdLatencyRow>
                                columns={osdLatencyColumns}
                                data={osdWriteLatencyData}
                                rowKey="id"
                                rowHeight="40px"
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

                      {/* Pie charts Row */}
                      <div className="flex gap-6">
                        <PieChartCard title="OSD Types Summary" data={osdTypesSummaryData} />
                        <PieChartCard
                          title="OSD Objectstore Types"
                          data={osdObjectstoreTypesData}
                        />
                        <PieChartCard title="OSD Size Summary" data={osdSizeSummaryData} />
                        <SingleValueDoughnutCard
                          title="OSD onode Hits Ratio"
                          value={98.3}
                          color="#ef4444"
                          className="flex-1"
                        />
                      </div>

                      {/* Distribution & Read/Write Charts Row */}
                      <div className="flex gap-6">
                        <div className="flex-1">
                          <ChartCard
                            title="Distribution of PGs per OSD"
                            series={pgDistributionSeries}
                            yAxisFormatter={(v) => `${v}`}
                            isDarkMode={isDark}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                            onRefresh={() => console.log('Refresh clicked')}
                          />
                        </div>
                        <div className="flex-1">
                          <ChartCard
                            title="Read/Write Profile"
                            series={readWriteProfileSeries}
                            yAxisFormatter={(v) => `${v}`}
                            isDarkMode={isDark}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                            onRefresh={() => console.log('Refresh clicked')}
                          />
                        </div>
                      </div>

                      {/* Top Slow OSD Ops Table */}
                      <SectionCard>
                        <SectionCard.Header title="Top Slow OSD Ops" />
                        <SectionCard.Content gap={0}>
                          <Table<SlowOsdOpsRow>
                            columns={slowOsdOpsColumns}
                            data={slowOsdOpsData}
                            rowKey="id"
                          />
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* Images Tab Panel */}
                  <TabPanel value="images" className="pt-6">
                    <VStack gap={6}>
                      {/* Time Period Selector */}
                      <div className="flex justify-start">
                        <MonitoringToolbar
                          timeRange={timeRange}
                          onTimeRangeChange={setTimeRange}
                          onRefresh={() => console.log('Refresh clicked')}
                          showRefresh={true}
                        />
                      </div>

                      {/* Highest Throughput & Highest Latencies Tables */}
                      <div className="flex gap-6">
                        <div className="flex-1 h-[334px]">
                          <SectionCard className="h-full">
                            <SectionCard.Header title="Highest Throughput" />
                            <SectionCard.Content gap={0} className="overflow-auto flex-1">
                              <Table<{ id: string; imageName: string; throughput: string }>
                                columns={[
                                  {
                                    key: 'imageName',
                                    label: 'Image name',
                                    flex: 1,
                                    sortable: true,
                                  },
                                  {
                                    key: 'throughput',
                                    label: 'Throughput',
                                    flex: 1,
                                    sortable: true,
                                  },
                                ]}
                                data={[
                                  {
                                    id: '1',
                                    imageName: 'ubuntu-22.04-base',
                                    throughput: '125 MB/s',
                                  },
                                  { id: '2', imageName: 'centos-8-minimal', throughput: '98 MB/s' },
                                  { id: '3', imageName: 'debian-11-server', throughput: '87 MB/s' },
                                  { id: '4', imageName: 'rocky-linux-9', throughput: '82 MB/s' },
                                  {
                                    id: '5',
                                    imageName: 'fedora-38-workstation',
                                    throughput: '76 MB/s',
                                  },
                                  { id: '6', imageName: 'alpine-3.18', throughput: '71 MB/s' },
                                  { id: '7', imageName: 'arch-linux-2024', throughput: '68 MB/s' },
                                  { id: '8', imageName: 'opensuse-leap-15', throughput: '65 MB/s' },
                                ]}
                                rowKey="id"
                                rowHeight="40px"
                              />
                            </SectionCard.Content>
                          </SectionCard>
                        </div>
                        <div className="flex-1 h-[334px]">
                          <SectionCard className="h-full">
                            <SectionCard.Header title="Highest Latencies" />
                            <SectionCard.Content gap={0} className="overflow-auto flex-1">
                              <Table<{ id: string; imageName: string; latency: string }>
                                columns={[
                                  {
                                    key: 'imageName',
                                    label: 'Image name',
                                    flex: 1,
                                    sortable: true,
                                  },
                                  { key: 'latency', label: 'Latency', flex: 1, sortable: true },
                                ]}
                                data={[
                                  { id: '1', imageName: 'windows-server-2019', latency: '45 ms' },
                                  { id: '2', imageName: 'rhel-8-enterprise', latency: '32 ms' },
                                  { id: '3', imageName: 'ubuntu-20.04-lts', latency: '28 ms' },
                                  { id: '4', imageName: 'oracle-linux-8', latency: '24 ms' },
                                  { id: '5', imageName: 'sles-15-sp4', latency: '21 ms' },
                                  { id: '6', imageName: 'amazon-linux-2023', latency: '18 ms' },
                                  { id: '7', imageName: 'kali-linux-2024', latency: '15 ms' },
                                  { id: '8', imageName: 'nixos-23.11', latency: '12 ms' },
                                ]}
                                rowKey="id"
                                rowHeight="40px"
                              />
                            </SectionCard.Content>
                          </SectionCard>
                        </div>
                      </div>

                      {/* IOPS & Throughput Charts */}
                      <div className="flex gap-6">
                        <div className="flex-1">
                          <ChartCard
                            title="IOPS"
                            series={[
                              {
                                name: 'image-001',
                                color: chartColors.cyan400,
                                data: [120, 125, 130, 128, 135, 140, 138, 142, 145, 140],
                              },
                              {
                                name: 'image-002',
                                color: chartColors.emerald400,
                                data: [100, 105, 110, 108, 115, 120, 118, 122, 125, 120],
                              },
                              {
                                name: 'image-003',
                                color: chartColors.amber400,
                                data: [80, 85, 90, 88, 95, 100, 98, 102, 105, 100],
                              },
                              {
                                name: 'image-004',
                                color: chartColors.violet400,
                                data: [60, 65, 70, 68, 75, 80, 78, 82, 85, 80],
                              },
                            ]}
                            yAxisFormatter={(v) => `${v}`}
                            isDarkMode={isDark}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                            onRefresh={() => console.log('Refresh clicked')}
                          />
                        </div>
                        <div className="flex-1">
                          <ChartCard
                            title="Throughput"
                            series={[
                              {
                                name: 'read',
                                color: chartColors.cyan400,
                                data: [450, 480, 520, 490, 550, 580, 540, 600, 580, 560],
                              },
                              {
                                name: 'write',
                                color: chartColors.emerald400,
                                data: [120, 150, 180, 160, 200, 220, 190, 250, 230, 210],
                              },
                            ]}
                            yAxisFormatter={(v) => `${v}`}
                            isDarkMode={isDark}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                            onRefresh={() => console.log('Refresh clicked')}
                          />
                        </div>
                      </div>

                      {/* Average Latency & Highest IOPS Charts */}
                      <div className="flex gap-6">
                        <div className="flex-1">
                          <ChartCard
                            title="Average Latency"
                            series={[
                              {
                                name: 'image-001',
                                color: chartColors.cyan400,
                                data: [12, 14, 13, 15, 14, 16, 15, 17, 16, 15],
                              },
                              {
                                name: 'image-002',
                                color: chartColors.emerald400,
                                data: [18, 20, 19, 21, 20, 22, 21, 23, 22, 21],
                              },
                              {
                                name: 'image-003',
                                color: chartColors.amber400,
                                data: [8, 10, 9, 11, 10, 12, 11, 13, 12, 11],
                              },
                              {
                                name: 'image-004',
                                color: chartColors.violet400,
                                data: [22, 24, 23, 25, 24, 26, 25, 27, 26, 25],
                              },
                            ]}
                            yAxisFormatter={(v) => `${v} ms`}
                            isDarkMode={isDark}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                            onRefresh={() => console.log('Refresh clicked')}
                          />
                        </div>
                        <div className="flex-1">
                          <ChartCard
                            title="Highest IOPS"
                            series={[
                              {
                                name: 'read',
                                color: chartColors.cyan400,
                                data: [500, 520, 540, 530, 560, 580, 570, 600, 590, 580],
                              },
                              {
                                name: 'write',
                                color: chartColors.emerald400,
                                data: [150, 160, 170, 165, 180, 190, 185, 200, 195, 190],
                              },
                            ]}
                            yAxisFormatter={(v) => `${v}`}
                            isDarkMode={isDark}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                            onRefresh={() => console.log('Refresh clicked')}
                          />
                        </div>
                      </div>

                      {/* Images Overview Table */}
                      <SectionCard>
                        <SectionCard.Header title="Images Overview" />
                        <SectionCard.Content gap={0}>
                          <Table<{
                            id: string;
                            imageName: string;
                            iops: string;
                            throughput: string;
                          }>
                            columns={[
                              {
                                key: 'imageName',
                                label: 'Image name',
                                flex: 1,
                                sortable: true,
                                render: (_, row) => (
                                  <Link
                                    to={`/storage/images/${row.id}`}
                                    className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {row.imageName}
                                  </Link>
                                ),
                              },
                              { key: 'iops', label: 'IOPS', flex: 1, sortable: true },
                              { key: 'throughput', label: 'Throughput', flex: 1, sortable: true },
                              {
                                key: 'actions',
                                label: 'Action',
                                width: fixedColumns.actions,
                                align: 'center' as const,
                                render: () => (
                                  <button className="p-1.5 hover:bg-[var(--color-surface-subtle)] rounded transition-colors">
                                    <IconTerminal2
                                      size={16}
                                      stroke={1.5}
                                      className="text-[var(--color-text-muted)]"
                                    />
                                  </button>
                                ),
                              },
                            ]}
                            data={[
                              {
                                id: 'img-001',
                                imageName: 'ubuntu-22.04-base',
                                iops: '1,250',
                                throughput: '125 MB/s',
                              },
                              {
                                id: 'img-002',
                                imageName: 'centos-8-minimal',
                                iops: '980',
                                throughput: '98 MB/s',
                              },
                              {
                                id: 'img-003',
                                imageName: 'debian-11-server',
                                iops: '870',
                                throughput: '87 MB/s',
                              },
                              {
                                id: 'img-004',
                                imageName: 'windows-server-2019',
                                iops: '650',
                                throughput: '65 MB/s',
                              },
                            ]}
                            rowKey="id"
                          />
                        </SectionCard.Content>
                      </SectionCard>
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
