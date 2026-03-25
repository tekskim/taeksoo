import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Badge } from '@shared/components/Badge';
import { ProgressBar } from '@shared/components/ProgressBar';
import { MonitoringToolbar } from '@shared/components/MonitoringToolbar';

/* ----------------------------------------
   Chart Colors (TDS palette)
   Primary: 1-5, Extended: 6-10, Utility
   ---------------------------------------- */

const chartColors = {
  // Primary (1-5)
  cyan400: '#22d3ee',
  emerald400: '#34d399',
  amber400: '#fbbf24',
  violet400: '#a78bfa',
  fuchsia400: '#e879f9',
  // Extended (6-10)
  pink400: '#f472b6',
  red400: '#f87171',
  blue400: '#60a5fa',
  teal400: '#2dd4bf',
  orange400: '#fb923c',
  // Utility
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
    <div className="bg-surface border border-border rounded-lg p-5 flex-1 flex flex-col">
      <span className="text-14 font-semibold leading-20 text-text">{title}</span>
      <div className="flex-1 flex items-center justify-center text-[40px] font-semibold leading-[48px] text-text">
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
  const color = chartColors.orange400;

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
    <div className="bg-surface border border-border rounded-lg p-5 flex flex-col gap-4 flex-1">
      <span className="text-14 font-semibold leading-20 text-text">{title}</span>
      <div className="relative flex justify-center">
        <div className="relative">
          <ReactECharts
            option={getOption()}
            style={{ height: '160px', width: '180px' }}
            opts={{ devicePixelRatio: window.devicePixelRatio }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
            <span className="text-[24px] font-semibold leading-7 text-text">{value}%</span>
            <span className="text-12 leading-18 text-text-subtle">
              {used}
              {unit ? ` ${unit}` : ''}/{total}
              {unit ? ` ${unit}` : ''}
            </span>
          </div>
        </div>
      </div>
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
  const legendData = [
    { label: 'Up', color: chartColors.emerald400 },
    { label: 'Down', color: chartColors.red400 },
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
      textStyle: { color: '#1e293b', fontSize: 11 },
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
          formatter: (params: { percent: number }) =>
            params.percent >= 15 ? `${params.percent.toFixed(0)}%` : '',
          fontSize: 12,
          fontWeight: 600,
          color: '#ffffff',
        },
        emphasis: {
          scale: true,
          scaleSize: 5,
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' },
        },
        labelLine: { show: false },
      },
    ],
  });

  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex flex-col gap-4 flex-1">
      <span className="text-14 font-semibold leading-20 text-text">{title}</span>
      <div className="flex justify-center">
        <ReactECharts
          option={getOption()}
          style={{ height: '180px', width: '180px' }}
          opts={{ devicePixelRatio: window.devicePixelRatio }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center">
        {legendData.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-11 leading-16 text-text-muted">{item.label}</span>
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
  const getBadgeTheme = (percent: number): 'red' | 'ylw' | 'gre' => {
    if (percent >= 100) return 'red';
    if (percent >= 70) return 'ylw';
    return 'gre';
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 flex-1">
      <div className="text-14 font-semibold leading-20 text-text mb-4">{title}</div>
      <div className="flex flex-col gap-[22px]">
        {data.map((node) => {
          const used = type === 'cpu' ? node.cpuUsed : node.ramUsed;
          const total = type === 'cpu' ? node.cpuTotal : node.ramTotal;
          const percent = type === 'cpu' ? node.cpuPercent : node.ramPercent;
          const variant =
            percent >= 90
              ? ('danger' as const)
              : percent >= 70
                ? ('warning' as const)
                : ('success' as const);
          return (
            <div key={node.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-11 font-medium leading-16 text-text">{node.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-11 leading-16 text-text-muted">
                    {used}/{total} GiB
                  </span>
                  <Badge size="sm" type="subtle" theme={getBadgeTheme(percent)}>
                    {percent}%
                  </Badge>
                </div>
              </div>
              <ProgressBar value={used} max={total} variant={variant} showValue={false} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AlarmTrendCard() {
  const [visible, setVisible] = useState(true);

  const getOption = () => ({
    animation: false,
    grid: { left: '0', right: '16px', top: '20px', bottom: '16px', containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: alarmTrendData.labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: chartColors.neutral, fontSize: 10 },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: 4,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: chartColors.grid, opacity: 0.5 } },
      axisLabel: { color: chartColors.neutral, fontSize: 10 },
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'white',
      borderColor: '#e2e8f0',
      textStyle: { color: chartColors.text, fontSize: 11 },
    },
    series: visible
      ? [
          {
            name: 'Total alerts',
            type: 'line',
            data: alarmTrendData.values,
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            showSymbol: false,
            lineStyle: { color: chartColors.cyan400, width: 1 },
            itemStyle: { color: chartColors.cyan400 },
            areaStyle: getAreaGradient(chartColors.cyan400),
          },
        ]
      : [],
  });

  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex-1 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-14 font-semibold leading-20 text-text">Last Week Alarm Trend</span>
      </div>
      <div className="flex gap-3" style={{ height: '160px' }}>
        <div className="flex-1 min-w-0">
          <ReactECharts
            option={getOption()}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            opts={{ devicePixelRatio: window.devicePixelRatio }}
          />
        </div>
        <div className="flex flex-col items-start gap-1 mt-5 shrink-0">
          <div
            className={`flex items-center gap-1.5 text-11 text-text-muted cursor-pointer transition-opacity hover:text-text ${!visible ? 'opacity-40' : ''}`}
            onClick={() => setVisible((v) => !v)}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: chartColors.cyan400 }}
            />
            <span>Total alerts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AreaChartCard({
  title,
  series,
  colors,
  legendLabels,
  yAxisUnit,
}: {
  title: string;
  series: number[][];
  colors: string[];
  legendLabels: string[];
  yAxisUnit: string;
}) {
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>(
    Object.fromEntries(legendLabels.map((l) => [l, true]))
  );

  const allData = legendLabels
    .filter((l) => visibleSeries[l])
    .flatMap((l) => series[legendLabels.indexOf(l)]);
  const dataMax = allData.length > 0 ? Math.max(...allData) : 100;
  const niceMax = Math.ceil(dataMax / 4) * 5;

  const getOption = () => ({
    animation: false,
    grid: { left: '0', right: '16px', top: '20px', bottom: '16px', containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: diskIOPSData.labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: chartColors.neutral, fontSize: 10 },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: niceMax,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: chartColors.grid, opacity: 0.5 } },
      axisLabel: {
        color: chartColors.neutral,
        fontSize: 10,
        formatter: (v: number) => `${v} ${yAxisUnit}`,
      },
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'white',
      borderColor: '#e2e8f0',
      textStyle: { color: chartColors.text, fontSize: 11 },
    },
    series: legendLabels
      .filter((l) => visibleSeries[l])
      .map((label) => {
        const idx = legendLabels.indexOf(label);
        return {
          name: label,
          type: 'line',
          data: series[idx],
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          showSymbol: false,
          lineStyle: { color: colors[idx], width: 1 },
          itemStyle: { color: colors[idx] },
          areaStyle: getAreaGradient(colors[idx]),
        };
      }),
  });

  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex-1 flex flex-col gap-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-14 font-semibold leading-20 text-text">{title}</span>
      </div>
      <div className="flex gap-3" style={{ height: '200px' }}>
        <div className="flex-1 min-w-0">
          <ReactECharts
            option={getOption()}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            opts={{ devicePixelRatio: window.devicePixelRatio }}
          />
        </div>
        <div className="flex flex-col items-start gap-1 mt-5 shrink-0">
          {legendLabels.map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-1.5 text-11 text-text-muted cursor-pointer transition-opacity hover:text-text whitespace-nowrap ${!visibleSeries[label] ? 'opacity-40' : ''}`}
              onClick={() => setVisibleSeries((prev) => ({ ...prev, [label]: !prev[label] }))}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: colors[i] }}
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export function ComputeAdminMonitorOverviewPage() {
  const [timeRange, setTimeRange] = useState('1h');

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[20px] font-semibold leading-7 text-text">Monitor overview</h1>

      <MonitoringToolbar
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        customPeriod={null}
        onCustomPeriodChange={() => {}}
        onRefresh={() => console.log('Refresh')}
      />

      {/* Row 1: Alert Cards + Alarm Trend */}
      <div className="grid grid-cols-4 gap-4">
        <AlertCard title="Today CPU usage > 80% alert" value={0} />
        <AlertCard title="Today RAM usage > 80% alert" value={0} />
        <div className="col-span-2">
          <AlarmTrendCard />
        </div>
      </div>

      {/* Row 2: Gauge Charts + Pie Chart */}
      <div className="grid grid-cols-4 gap-4">
        <GaugeCard title="Physical CPU usage" value={70} used={7} total={10} unit="vCPU" />
        <GaugeCard title="Total RAM usage" value={70} used={8} total={10} unit="GiB" />
        <GaugeCard title="Physical storage usage" value={70} used={8} total={10} unit="TiB" />
        <PieChartCard title="Compute node status" upCount={5} downCount={5} />
      </div>

      {/* Row 3: Host Usage Charts */}
      <div className="flex gap-4">
        <HostUsageCard title="Host CPU usage" data={hostUsageData} type="cpu" />
        <HostUsageCard title="Host RAM usage" data={hostUsageData} type="ram" />
      </div>

      {/* Row 4: Area Charts */}
      <div className="flex gap-4">
        <AreaChartCard
          title="Host disk average IOPS"
          series={[diskIOPSData.reads, diskIOPSData.writes]}
          colors={[chartColors.cyan400, chartColors.emerald400]}
          legendLabels={['Reads', 'Writes']}
          yAxisUnit="ops/s"
        />
        <AreaChartCard
          title="Host average network IO"
          series={[networkIOData.receive, networkIOData.transmit]}
          colors={[chartColors.cyan400, chartColors.emerald400]}
          legendLabels={['Receive', 'Transmit']}
          yAxisUnit="KB/s"
        />
      </div>
    </div>
  );
}
