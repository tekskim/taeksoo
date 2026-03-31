import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Badge } from '@shared/components/Badge';
import { ProgressBar } from '@shared/components/ProgressBar';
import { MonitoringToolbar } from '@shared/components/MonitoringToolbar';
import { Dropdown } from '@shared/components/Dropdown';

/* ----------------------------------------
   Chart Colors (TDS palette)
   ---------------------------------------- */

const chartColors = {
  cyan400: '#22d3ee',
  emerald400: '#34d399',
  amber400: '#fbbf24',
  violet400: '#a78bfa',
  orange400: '#f97316',
  slate100: '#f1f5f9',
  slate400: '#94a3b8',
  slate800: '#1e293b',
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

function getNiceScale(dataMax: number) {
  if (dataMax <= 0) return { max: 10, interval: 2 };
  const raw = Math.ceil(dataMax * 1.1);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  let niceMax: number;
  if (norm <= 1.5) niceMax = 1.5 * mag;
  else if (norm <= 2) niceMax = 2 * mag;
  else if (norm <= 3) niceMax = 3 * mag;
  else if (norm <= 5) niceMax = 5 * mag;
  else if (norm <= 7.5) niceMax = 7.5 * mag;
  else niceMax = 10 * mag;
  const interval = niceMax / 4;
  return { max: niceMax, interval };
}

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
    <div className="bg-surface border border-border rounded-lg p-5 flex-1 min-w-0">
      <div className="mb-4">
        <span className="text-14 font-semibold leading-20 text-text">{title}</span>
      </div>
      <div className="flex items-baseline justify-center gap-1 font-medium">
        <span className="text-[40px] font-semibold leading-[48px] text-text">{value}</span>
        {unit && <span className="text-14 leading-20 text-text-muted">{unit}</span>}
      </div>
    </div>
  );
}

function FileSystemCard() {
  const filesystems = [
    { name: '/dev/sda1', used: 4.9, total: 8, percent: 61 },
    { name: '/dev/sda3/boot', used: 22.12, total: 25, percent: 88 },
  ];

  const getBadgeTheme = (percent: number): 'red' | 'ylw' | 'gre' => {
    if (percent >= 100) return 'red';
    if (percent >= 70) return 'ylw';
    return 'gre';
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 flex-1 min-w-0">
      <div className="text-14 font-semibold leading-20 text-text mb-4">File System Used Space</div>
      <div className="flex flex-col gap-[22px]">
        {filesystems.map((fs) => {
          const variant =
            fs.percent >= 90
              ? ('danger' as const)
              : fs.percent >= 70
                ? ('warning' as const)
                : ('success' as const);
          return (
            <div key={fs.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-11 font-medium leading-16 text-text">{fs.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-11 leading-16 text-text-muted">
                    {fs.used}/{fs.total} GiB
                  </span>
                  <Badge size="sm" type="subtle" theme={getBadgeTheme(fs.percent)}>
                    {fs.percent}%
                  </Badge>
                </div>
              </div>
              <ProgressBar value={fs.used} max={fs.total} variant={variant} showValue={false} />
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
    Object.fromEntries(legendLabels.map((l) => [l, true]))
  );

  const allVisible = Object.values(visibleSeries).every((v) => v);
  const toggleAll = () => {
    const newState = !allVisible;
    setVisibleSeries(Object.fromEntries(legendLabels.map((l) => [l, newState])));
  };

  const visibleIndices = legendLabels
    .map((l, i) => ({ label: l, index: i }))
    .filter(({ label }) => visibleSeries[label]);

  let dataMax: number;
  if (stacked && visibleIndices.length > 0) {
    const numPoints = series[0]?.length || 0;
    let maxSum = 0;
    for (let x = 0; x < numPoints; x++) {
      let sum = 0;
      for (const { index } of visibleIndices) sum += series[index][x] || 0;
      maxSum = Math.max(maxSum, sum);
    }
    dataMax = maxSum;
  } else {
    const allData = visibleIndices.flatMap(({ index }) => series[index]);
    dataMax = allData.length > 0 ? Math.max(...allData) : 100;
  }
  const { max: niceMax, interval: yInterval } = getNiceScale(dataMax);

  const getOption = () => ({
    animation: false,
    grid: { left: '0', right: '16px', top: '20px', bottom: '16px', containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: chartColors.slate400, fontSize: 10 },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: niceMax,
      interval: yInterval,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: chartColors.slate100, opacity: 0.5 } },
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
        formatter: yAxisUnit ? (v: number) => `${v}${yAxisUnit}` : undefined,
      },
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'white',
      borderColor: '#e2e8f0',
      textStyle: { color: chartColors.slate800, fontSize: 11 },
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
          stack: stacked ? 'total' : undefined,
          lineStyle: { color: colors[idx], width: 1 },
          itemStyle: { color: colors[idx] },
          areaStyle: getAreaGradient(colors[idx]),
        };
      }),
  });

  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex-1 flex flex-col gap-1 min-w-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-14 font-semibold leading-20 text-text">{title}</span>
          {dropdown && dropdownOptions && onDropdownChange && (
            <Dropdown.Select
              value={dropdown}
              onChange={(v) => onDropdownChange(String(v))}
              size="sm"
            >
              {dropdownOptions.map((opt) => (
                <Dropdown.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Dropdown.Option>
              ))}
            </Dropdown.Select>
          )}
        </div>
        <div className="flex items-center gap-2">
          {legendLabels.length > 1 && (
            <button
              className="flex items-center gap-1.5 text-11 text-text-muted cursor-pointer hover:text-text border-none bg-transparent px-0"
              onClick={toggleAll}
            >
              <span
                className={`inline-block w-[28px] h-[14px] rounded-full transition-colors ${allVisible ? 'bg-action-primary' : 'bg-surface-muted'}`}
                style={{ position: 'relative' }}
              >
                <span
                  className="absolute top-[2px] w-[10px] h-[10px] rounded-full bg-white transition-transform"
                  style={{ left: allVisible ? '16px' : '2px' }}
                />
              </span>
              <span>{allVisible ? 'Hide All' : 'View All'}</span>
            </button>
          )}
        </div>
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

function SystemLoadCard() {
  const nodeColors = {
    node4: chartColors.cyan400,
    node5: chartColors.emerald400,
    node6: chartColors.orange400,
  };

  const [selectedNodes, setSelectedNodes] = useState<Record<string, boolean>>({
    node4: true,
    node5: true,
    node6: true,
  });

  const allVisible = Object.values(selectedNodes).every((v) => v);
  const toggleAll = () => {
    const newState = !allVisible;
    setSelectedNodes(Object.fromEntries(Object.keys(selectedNodes).map((n) => [n, newState])));
  };

  const visibleData = Object.entries(selectedNodes)
    .filter(([, active]) => active)
    .flatMap(([node]) => systemLoadData[node as keyof typeof systemLoadData]);
  const sysDataMax = visibleData.length > 0 ? Math.max(...visibleData) : 1;
  const { max: sysNiceMax, interval: sysYInterval } = getNiceScale(sysDataMax);

  const getOption = () => ({
    animation: false,
    grid: { left: '0', right: '16px', top: '20px', bottom: '16px', containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: timeLabels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: chartColors.slate400, fontSize: 10 },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: sysNiceMax,
      interval: sysYInterval,
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
    series: Object.entries(selectedNodes)
      .filter(([, active]) => active)
      .map(([node]) => ({
        name: node,
        type: 'line',
        data: systemLoadData[node as keyof typeof systemLoadData],
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        lineStyle: { color: nodeColors[node as keyof typeof nodeColors], width: 1 },
        itemStyle: { color: nodeColors[node as keyof typeof nodeColors] },
        areaStyle: getAreaGradient(nodeColors[node as keyof typeof nodeColors]),
      })),
  });

  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-14 font-semibold leading-20 text-text">System Load</span>
        <button
          className="flex items-center gap-1.5 text-11 text-text-muted cursor-pointer hover:text-text border-none bg-transparent px-0"
          onClick={toggleAll}
        >
          <span
            className={`inline-block w-[28px] h-[14px] rounded-full transition-colors ${allVisible ? 'bg-action-primary' : 'bg-surface-muted'}`}
            style={{ position: 'relative' }}
          >
            <span
              className="absolute top-[2px] w-[10px] h-[10px] rounded-full bg-white transition-transform"
              style={{ left: allVisible ? '16px' : '2px' }}
            />
          </span>
          <span>{allVisible ? 'Hide All' : 'View All'}</span>
        </button>
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
          {Object.entries(nodeColors).map(([node, color]) => (
            <div
              key={node}
              className={`flex items-center gap-1.5 text-11 text-text-muted cursor-pointer transition-opacity hover:text-text ${!selectedNodes[node] ? 'opacity-40' : ''}`}
              onClick={() => setSelectedNodes((prev) => ({ ...prev, [node]: !prev[node] }))}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span>{node}</span>
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

export function ComputeAdminPhysicalNodesPage() {
  const [timeRange, setTimeRange] = useState('1h');
  const [selectedNode, setSelectedNode] = useState('node1');
  const [diskDevice, setDiskDevice] = useState('node1');
  const [diskUsageDevice, setDiskUsageDevice] = useState('dev/sda');
  const [networkInterface, setNetworkInterface] = useState('br-ex');

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[20px] font-semibold leading-7 text-text">Physical nodes</h1>

      {/* Node Selector + Monitoring Toolbar */}
      <div className="flex items-center gap-2">
        <div className="w-[160px]">
          <Dropdown.Select
            value={selectedNode}
            onChange={(v) => setSelectedNode(String(v))}
            size="sm"
          >
            {nodeOptions.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Dropdown.Option>
            ))}
          </Dropdown.Select>
        </div>
        <MonitoringToolbar
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          customPeriod={null}
          onCustomPeriodChange={() => {}}
          onRefresh={() => console.log('Refresh')}
        />
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex gap-4">
          <StatCard title="CPU Cores" value={0} />
          <StatCard title="Total RAM" value="2.56" unit="GiB" />
        </div>
        <div className="flex gap-4">
          <StatCard title="System running time" value="2.56" unit="weeks" />
          <FileSystemCard />
        </div>
      </div>

      {/* Row 2: CPU Usage & RAM Usage */}
      <div className="flex gap-4">
        <AreaChartCard
          title="CPU Usage"
          labels={timeLabels}
          series={[cpuUsageData.idle, cpuUsageData.iowait, cpuUsageData.system, cpuUsageData.user]}
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
          title="Disk usage"
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
          title="Network traffic"
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
          title="Network errors"
          labels={timeLabels}
          series={[networkErrorsData.errors]}
          colors={[chartColors.cyan400]}
          legendLabels={['Errors']}
          dropdown={networkInterface}
          onDropdownChange={setNetworkInterface}
          dropdownOptions={networkInterfaceOptions}
        />
        <AreaChartCard
          title="Network dropped packets"
          labels={timeLabels}
          series={[networkDroppedData.receive, networkDroppedData.transmit]}
          colors={[chartColors.cyan400, chartColors.emerald400]}
          legendLabels={['Receive', 'Transmit']}
          dropdown={networkInterface}
          onDropdownChange={setNetworkInterface}
          dropdownOptions={networkInterfaceOptions}
        />
      </div>
    </div>
  );
}
