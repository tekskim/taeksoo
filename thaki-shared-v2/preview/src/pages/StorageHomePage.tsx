import { useState, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { Title } from '@shared/components/Title';
import { MonitoringToolbar } from '@shared/components/MonitoringToolbar';
import { ChartToggle } from '@shared/components/ChartToggle';
import {
  IconDotsCircleHorizontal,
  IconArrowsMaximize,
  IconArrowsMinimize,
} from '@tabler/icons-react';

/* ----------------------------------------
   Chart Colors (TDS palette)
   ---------------------------------------- */
const chartColors = {
  cyan400: '#22d3ee',
  emerald400: '#34d399',
  amber400: '#fbbf24',
  violet400: '#a78bfa',
  fuchsia400: '#e879f9',
  neutral: '#94a3b8',
  grid: '#f1f5f9',
  text: '#1e293b',
};

function getAreaGradient(color: string) {
  return {
    type: 'linear' as const,
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: color + '40' },
      { offset: 1, color: color + '05' },
    ],
  };
}

/* ----------------------------------------
   LineChart Component
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
  const [menuOpen, setMenuOpen] = useState(false);

  const allVisible = Object.values(visibleSeries).every((v) => v);
  const toggleAll = () => {
    const newState = !allVisible;
    setVisibleSeries(Object.fromEntries(series.map((s) => [s.name, newState])));
  };

  const allData = series.filter((s) => visibleSeries[s.name]).flatMap((s) => s.data);
  const dataMax = Math.max(...allData, 0);
  const rawInterval = dataMax / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval || 1)));
  const normalizedInterval = rawInterval / magnitude;

  let niceNormalizedInterval;
  if (normalizedInterval <= 1) niceNormalizedInterval = 1;
  else if (normalizedInterval <= 2) niceNormalizedInterval = 2;
  else if (normalizedInterval <= 2.5) niceNormalizedInterval = 2.5;
  else if (normalizedInterval <= 5) niceNormalizedInterval = 5;
  else niceNormalizedInterval = 10;

  const niceInterval = niceNormalizedInterval * magnitude;
  const niceMax = niceInterval * 4;

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
      axisLabel: { color: chartColors.neutral, fontSize: 10 },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: niceMax,
      interval: niceInterval,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: chartColors.grid, opacity: 0.5 } },
      axisLabel: {
        color: chartColors.neutral,
        fontSize: 10,
        formatter: yAxisFormatter,
      },
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'white',
      borderColor: '#e2e8f0',
      textStyle: { color: chartColors.text, fontSize: 11 },
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
              `<div style="display:flex;align-items:center;gap:8px;"><span style="display:inline-block;width:8px;height:8px;border-radius:9999px;background:${p.color};"></span><span>${p.seriesName}</span><span style="font-weight:500;margin-left:auto;">${p.value}</span></div>`
          )
          .join('');
        return `<div style="font-size:11px;">${time}<div style="margin-top:4px;">${items}</div></div>`;
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

  const containerClass = isFullScreen
    ? 'bg-surface border border-border rounded-lg p-5 flex flex-col h-full shadow-xl'
    : 'bg-surface border border-border rounded-lg p-5 flex flex-col gap-1';

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isFullScreen ? 'relative mb-4' : ''}`}>
        <span className="text-14 font-semibold leading-20 text-text">{title}</span>
        {isFullScreen && timeControls && (
          <div className="absolute left-1/2 -translate-x-1/2">{timeControls}</div>
        )}
        <div className="flex items-center gap-2">
          {series.length > 1 && (
            <>
              <ChartToggle isActive={allVisible} onClick={toggleAll} />
              <span className="text-text-muted text-11">|</span>
            </>
          )}
          <div className="relative">
            <button
              className="flex items-center justify-center w-6 h-6 rounded text-text-muted hover:text-text hover:bg-surface-muted transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              <IconDotsCircleHorizontal size={16} stroke={1.5} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-md shadow-md py-1 z-10 min-w-[140px]">
                <button
                  className="w-full text-left px-3 py-1.5 text-11 text-text hover:bg-surface-muted"
                  onClick={() => setMenuOpen(false)}
                >
                  Download Image
                </button>
                <button
                  className="w-full text-left px-3 py-1.5 text-11 text-text hover:bg-surface-muted"
                  onClick={() => setMenuOpen(false)}
                >
                  Download CSV
                </button>
                <button
                  className="w-full text-left px-3 py-1.5 text-11 text-text hover:bg-surface-muted"
                  onClick={() => setMenuOpen(false)}
                >
                  Data View
                </button>
              </div>
            )}
          </div>
          <button
            className="flex items-center justify-center w-6 h-6 rounded text-text-muted hover:text-text hover:bg-surface-muted transition-colors"
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

      {/* Chart + Legend */}
      <div className="flex gap-3" style={{ height: isFullScreen ? '100%' : height }}>
        <div className="flex-1 min-w-0">
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            opts={{ devicePixelRatio: window.devicePixelRatio }}
          />
        </div>
        <div className="flex flex-col items-start gap-1 mt-5 shrink-0">
          {series.map((s) => (
            <div
              key={s.name}
              className={`flex items-center gap-1.5 text-11 text-text-muted cursor-pointer transition-opacity hover:text-text whitespace-nowrap ${!visibleSeries[s.name] ? 'opacity-40' : ''}`}
              onClick={() => setVisibleSeries((prev) => ({ ...prev, [s.name]: !prev[s.name] }))}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Inventory Stat Box
   ---------------------------------------- */
function InventoryStatBox({ value, label }: { value: number; label: string }) {
  const textColor = value === 0 ? 'text-text-muted' : 'text-text';
  return (
    <div className="flex-1 bg-surface-subtle rounded-lg p-4 border-2 border-transparent transition-colors hover:border-primary cursor-pointer">
      <div className={`text-[24px] font-semibold leading-8 ${textColor} pb-1`}>{value}</div>
      <div className="text-11 leading-16 text-text-subtle">{label}</div>
    </div>
  );
}

/* ----------------------------------------
   Capacity Gauge (Half-Doughnut)
   ---------------------------------------- */
function CapacityGauge({
  percentage,
  used,
  total,
  unit,
}: {
  percentage: number;
  used: number;
  total: number;
  unit: string;
}) {
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

  const statusColor = () => {
    if (percentage >= 95) return '#ef4444';
    if (percentage >= 85) return '#f97316';
    return '#22c55e';
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
              [1, chartColors.grid],
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
      <div
        ref={gaugeRef}
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <ReactECharts
          option={getOption()}
          style={{ height: '200px', width: '220px' }}
          opts={{ devicePixelRatio: window.devicePixelRatio }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
          <span className="text-[24px] font-semibold leading-7 text-text">
            {percentage.toFixed(2)}%
          </span>
          <span className="text-12 leading-18 text-text-subtle">
            {used}
            {unit}/{total}
            {unit}
          </span>
        </div>

        {showTooltip && (
          <div
            className="absolute z-10 bg-surface border border-border rounded-md shadow-md px-2 py-1.5 flex flex-col gap-1 pointer-events-none"
            style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-[5px] h-[5px] rounded-sm" style={{ backgroundColor: usedColor }} />
              <span className="text-11 leading-16 text-text whitespace-nowrap">
                Used: {used} {unit} ({Math.round(percentage)}%)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-[5px] h-[5px] rounded-sm bg-text-muted" />
              <span className="text-11 leading-16 text-text whitespace-nowrap">
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
          <span className="text-11 leading-16 text-text-muted">
            Used: {used}
            {unit}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm shrink-0 bg-warning" />
          <span className="text-11 leading-16 text-text-muted">Warning: 85%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm shrink-0 bg-danger" />
          <span className="text-11 leading-16 text-text-muted">Danger: 95%</span>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Card Component
   ---------------------------------------- */
function Card({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-5 rounded-2xl border border-border bg-surface ${className}`}>
      <h6 className="text-14 font-semibold leading-20 text-text mb-4">{title}</h6>
      {children}
    </div>
  );
}

/* ----------------------------------------
   Full Screen Chart Data
   ---------------------------------------- */
interface FullScreenChartData {
  title: string;
  series: LineChartSeries[];
  yAxisFormatter?: (value: number) => string;
  timeLabels: string[];
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */
export function StorageHomePage() {
  const [timeRange, setTimeRange] = useState('30m');
  const [fullScreenChart, setFullScreenChart] = useState<FullScreenChartData | null>(null);

  const timeLabels = ['16:00', '16:10', '16:20', '16:30', '16:40', '16:50'];

  const iopsSeries: LineChartSeries[] = [
    { name: 'Reads', data: [380, 420, 480, 520, 450, 400], color: chartColors.cyan400 },
    { name: 'Writes', data: [520, 580, 680, 720, 580, 420], color: chartColors.emerald400 },
  ];

  const latencySeries: LineChartSeries[] = [
    { name: 'Apply', data: [0, 0, 0, 0.15, 0.28, 0.42], color: chartColors.cyan400 },
    { name: 'Commit', data: [0, 0, 0, 0.18, 0.35, 0.5], color: chartColors.emerald400 },
  ];

  const clientThroughputSeries: LineChartSeries[] = [
    { name: 'Reads', data: [0.1, 0.8, 2.5, 4.2, 5.8, 6.2], color: chartColors.cyan400 },
    { name: 'Writes', data: [0.1, 0.6, 2.0, 3.8, 5.2, 5.8], color: chartColors.emerald400 },
  ];

  const requestsSeries: LineChartSeries[] = [
    { name: 'Requests', data: [2, 2, 2, 2, 2, 2], color: chartColors.cyan400 },
  ];

  const latencyDetailSeries: LineChartSeries[] = [
    { name: 'GET', data: [0, 0.5, 2.0, 3.5, 4.2, 4.8], color: chartColors.cyan400 },
    { name: 'PUT', data: [0, 0.4, 1.8, 3.2, 3.8, 4.2], color: chartColors.emerald400 },
  ];

  const recoveryThroughputSeries: LineChartSeries[] = [
    { name: 'Recovery', data: [0, 0, 0, 0, 0, 0], color: chartColors.cyan400 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Title title="Storage Dashboard" />

      {/* Top Row: Inventory + Capacity */}
      <div className="grid grid-cols-2 gap-6">
        {/* INVENTORY */}
        <Card title="Inventory" className="flex flex-col">
          <div className="mb-4">
            <div className="text-[32px] font-semibold leading-10 text-text">54</div>
            <div className="text-12 leading-18 text-text-subtle">Total</div>
          </div>
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

      {/* CLUSTER UTILIZATION */}
      <div className="p-5 rounded-2xl border border-border bg-surface">
        <div className="flex items-center justify-between mb-6">
          <h6 className="text-14 font-semibold leading-20 text-text">Cluster Utilization</h6>
          <MonitoringToolbar
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            customPeriod={null}
            onCustomPeriodChange={() => {}}
            onRefresh={() => console.log('Refresh')}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <LineChart
            title="IOPS"
            series={iopsSeries}
            timeLabels={timeLabels}
            height="280px"
            onExpandClick={() =>
              setFullScreenChart({ title: 'IOPS', series: iopsSeries, timeLabels })
            }
          />
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
                <MonitoringToolbar
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                  customPeriod={null}
                  onCustomPeriodChange={() => {}}
                  onRefresh={() => console.log('Refresh')}
                />
              }
              onExitFullScreen={() => setFullScreenChart(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default StorageHomePage;
