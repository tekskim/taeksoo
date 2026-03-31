import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Title } from '@shared/components/Title';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Table } from '@shared/components/Table';
import { Badge } from '@shared/components/Badge';
import { ProgressBar } from '@shared/components/ProgressBar';
import type { TableColumn } from '@shared/components/Table/Table.types';

function StatCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3 flex flex-col gap-1 min-w-0">
      <span className="text-11 text-text-muted truncate">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-[18px] font-semibold text-text">{value}</span>
        {unit && <span className="text-11 text-text-muted">{unit}</span>}
      </div>
    </div>
  );
}

function ChartPlaceholder({ title, height = 180 }: { title: string; height?: number }) {
  return (
    <div
      className="rounded-lg border border-border bg-surface-subtle flex items-center justify-center"
      style={{ height }}
    >
      <span className="text-12 text-text-muted">{title}</span>
    </div>
  );
}

// -- Pools Tab --
function PoolsTab() {
  const poolColumns: TableColumn[] = [
    { key: 'poolName', header: 'Pool name', sortable: true },
    { key: 'type', header: 'Type' },
    { key: 'usableFree', header: 'Usable free' },
    { key: 'percentUsed', header: '% Used' },
    { key: 'growth5d', header: 'Growth (5d)' },
    { key: 'iops', header: 'IOPS' },
    { key: 'bandwidth', header: 'Bandwidth' },
    { key: 'stored', header: 'Stored' },
  ];

  const poolRows = [
    {
      id: 'p1',
      poolName: 'volumes',
      type: 'replicated',
      usableFree: '12.4 TiB',
      percentUsed: '42%',
      growth5d: '+2.3%',
      iops: '2,050',
      bandwidth: '128 MiB/s',
      stored: '9.1 TiB',
    },
    {
      id: 'p2',
      poolName: 'images',
      type: 'replicated',
      usableFree: '15.6 TiB',
      percentUsed: '28%',
      growth5d: '+0.8%',
      iops: '1,320',
      bandwidth: '64 MiB/s',
      stored: '6.1 TiB',
    },
    {
      id: 'p3',
      poolName: 'vms',
      type: 'replicated',
      usableFree: '7.5 TiB',
      percentUsed: '65%',
      growth5d: '+4.1%',
      iops: '3,600',
      bandwidth: '256 MiB/s',
      stored: '14.2 TiB',
    },
    {
      id: 'p4',
      poolName: 'backups',
      type: 'erasure',
      usableFree: '85.0 TiB',
      percentUsed: '15%',
      growth5d: '-0.2%',
      iops: '250',
      bandwidth: '32 MiB/s',
      stored: '15.0 TiB',
    },
    {
      id: 'p5',
      poolName: 'kubernetes-pv',
      type: 'replicated',
      usableFree: '4.7 TiB',
      percentUsed: '78%',
      growth5d: '+6.2%',
      iops: '6,200',
      bandwidth: '512 MiB/s',
      stored: '16.8 TiB',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Total capacity (RAW)" value="189.9" unit="TiB" />
        <StatCard label="Used capacity (RAW)" value="49.7" unit="TiB" />
        <StatCard label="Total pools" value={7} />
        <StatCard label="Active PGs" value="1,536" />
        <StatCard label="Total objects" value="2.4M" />
        <StatCard label="PG per OSD" value={64} />
        <StatCard label="Read throughput" value="892" unit="MiB/s" />
        <StatCard label="Write throughput" value="512" unit="MiB/s" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartPlaceholder title="Pool capacity (RAW)" height={200} />
        <ChartPlaceholder title="Client IOPS" height={200} />
        <ChartPlaceholder title="Client bandwidth" height={200} />
        <ChartPlaceholder title="Recovery rate" height={200} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-14 font-semibold text-text">Pool overview</span>
        <Table columns={poolColumns} rows={poolRows}>
          {poolRows.map((r) => (
            <Table.Tr key={r.id} rowData={r}>
              <Table.Td rowData={r} column={poolColumns[0]}>
                <span className="text-12 font-medium text-text">{r.poolName}</span>
              </Table.Td>
              <Table.Td rowData={r} column={poolColumns[1]}>
                <Badge theme={r.type === 'replicated' ? 'blu' : 'gry'} type="subtle" size="sm">
                  {r.type}
                </Badge>
              </Table.Td>
              <Table.Td rowData={r} column={poolColumns[2]}>
                {r.usableFree}
              </Table.Td>
              <Table.Td rowData={r} column={poolColumns[3]}>
                <ProgressBar value={parseFloat(r.percentUsed)} max={100} showValue="percentage" />
              </Table.Td>
              <Table.Td rowData={r} column={poolColumns[4]}>
                <span
                  className={`text-12 ${r.growth5d.startsWith('+') ? 'text-state-success' : r.growth5d.startsWith('-') ? 'text-error' : 'text-text'}`}
                >
                  {r.growth5d}
                </span>
              </Table.Td>
              <Table.Td rowData={r} column={poolColumns[5]}>
                {r.iops}
              </Table.Td>
              <Table.Td rowData={r} column={poolColumns[6]}>
                {r.bandwidth}
              </Table.Td>
              <Table.Td rowData={r} column={poolColumns[7]}>
                {r.stored}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table>
      </div>
    </div>
  );
}

// -- Hosts Tab --
function HostsTab() {
  const hostColumns: TableColumn[] = [
    { key: 'hostname', header: 'Hostname', sortable: true },
    { key: 'totalMemory', header: 'Total memory' },
    { key: 'rawCapacity', header: 'Raw capacity' },
  ];

  const hostRows = [
    { id: 'h1', hostname: 'ceph-node-01', totalMemory: '256 GiB', rawCapacity: '43.7 TiB' },
    { id: 'h2', hostname: 'ceph-node-02', totalMemory: '256 GiB', rawCapacity: '43.7 TiB' },
    { id: 'h3', hostname: 'ceph-node-03', totalMemory: '128 GiB', rawCapacity: '21.8 TiB' },
    { id: 'h4', hostname: 'ceph-node-05', totalMemory: '384 GiB', rawCapacity: '87.3 TiB' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total hosts" value={6} />
        <StatCard label="Available" value={5} />
        <StatCard label="Total memory" value="1,664" unit="GiB" />
        <StatCard label="Total raw capacity" value="327.8" unit="TiB" />
        <StatCard label="Average CPU" value="34.2" unit="%" />
        <StatCard label="Network errors" value={0} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartPlaceholder title="CPU Busy" height={200} />
        <ChartPlaceholder title="Network Load" height={200} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-14 font-semibold text-text">Host overview</span>
        <Table columns={hostColumns} rows={hostRows}>
          {hostRows.map((r) => (
            <Table.Tr key={r.id} rowData={r}>
              <Table.Td rowData={r} column={hostColumns[0]}>
                <span className="text-12 font-medium text-text">{r.hostname}</span>
              </Table.Td>
              <Table.Td rowData={r} column={hostColumns[1]}>
                {r.totalMemory}
              </Table.Td>
              <Table.Td rowData={r} column={hostColumns[2]}>
                {r.rawCapacity}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table>
      </div>
    </div>
  );
}

// -- OSDs Tab --
function OSDsTab() {
  const latencyColumns: TableColumn[] = [
    { key: 'osdId', header: 'OSD ID', sortable: true },
    { key: 'latency', header: 'Latency' },
  ];

  const readLatencyRows = [
    { id: 'rl1', osdId: 'osd.5', latency: '0.82 ms' },
    { id: 'rl2', osdId: 'osd.2', latency: '0.45 ms' },
    { id: 'rl3', osdId: 'osd.6', latency: '0.38 ms' },
  ];

  const writeLatencyRows = [
    { id: 'wl1', osdId: 'osd.5', latency: '1.24 ms' },
    { id: 'wl2', osdId: 'osd.2', latency: '0.91 ms' },
    { id: 'wl3', osdId: 'osd.1', latency: '0.78 ms' },
  ];

  const slowOpsColumns: TableColumn[] = [
    { key: 'osdId', header: 'OSD ID', sortable: true },
    { key: 'slowOps', header: 'Slow ops' },
  ];

  const slowOpsRows = [
    { id: 'so1', osdId: 'osd.4', slowOps: '12' },
    { id: 'so2', osdId: 'osd.1', slowOps: '3' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <span className="text-14 font-semibold text-text">Highest READ latency</span>
          <Table columns={latencyColumns} rows={readLatencyRows}>
            {readLatencyRows.map((r) => (
              <Table.Tr key={r.id} rowData={r}>
                <Table.Td rowData={r} column={latencyColumns[0]}>
                  <span className="text-12 text-primary">{r.osdId}</span>
                </Table.Td>
                <Table.Td rowData={r} column={latencyColumns[1]}>
                  {r.latency}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table>
        </div>
        <ChartPlaceholder title="Read Latency Chart" height={200} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <span className="text-14 font-semibold text-text">Highest WRITE latency</span>
          <Table columns={latencyColumns} rows={writeLatencyRows}>
            {writeLatencyRows.map((r) => (
              <Table.Tr key={r.id} rowData={r}>
                <Table.Td rowData={r} column={latencyColumns[0]}>
                  <span className="text-12 text-primary">{r.osdId}</span>
                </Table.Td>
                <Table.Td rowData={r} column={latencyColumns[1]}>
                  {r.latency}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table>
        </div>
        <ChartPlaceholder title="Write Latency Chart" height={200} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartPlaceholder title="PG Distribution" height={200} />
        <ChartPlaceholder title="Read/Write Profile" height={200} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-14 font-semibold text-text">Top slow OSD ops</span>
        <Table columns={slowOpsColumns} rows={slowOpsRows}>
          {slowOpsRows.map((r) => (
            <Table.Tr key={r.id} rowData={r}>
              <Table.Td rowData={r} column={slowOpsColumns[0]}>
                <span className="text-12 text-primary">{r.osdId}</span>
              </Table.Td>
              <Table.Td rowData={r} column={slowOpsColumns[1]}>
                {r.slowOps}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table>
      </div>
    </div>
  );
}

// -- Images Tab --
function ImagesTab() {
  const throughputColumns: TableColumn[] = [
    { key: 'imageName', header: 'Image name', sortable: true },
    { key: 'iops', header: 'IOPS' },
    { key: 'throughput', header: 'Throughput' },
  ];

  const imagesRows = [
    { id: 'io1', imageName: 'volume-web-01', iops: '1,250', throughput: '48 MiB/s' },
    { id: 'io2', imageName: 'volume-db-master', iops: '3,800', throughput: '156 MiB/s' },
    { id: 'io3', imageName: 'volume-k8s-pv-01', iops: '2,100', throughput: '84 MiB/s' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <ChartPlaceholder title="IOPS" height={200} />
        <ChartPlaceholder title="Throughput" height={200} />
        <ChartPlaceholder title="Average Latency" height={200} />
        <ChartPlaceholder title="Highest IOPS" height={200} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-14 font-semibold text-text">Images overview</span>
        <Table columns={throughputColumns} rows={imagesRows}>
          {imagesRows.map((r) => (
            <Table.Tr key={r.id} rowData={r}>
              <Table.Td rowData={r} column={throughputColumns[0]}>
                <span className="text-12 font-medium text-primary">{r.imageName}</span>
              </Table.Td>
              <Table.Td rowData={r} column={throughputColumns[1]}>
                {r.iops}
              </Table.Td>
              <Table.Td rowData={r} column={throughputColumns[2]}>
                {r.throughput}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table>
      </div>
    </div>
  );
}

// -- Main --
export function StoragePerformancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'pools';

  return (
    <div className="flex flex-col gap-4">
      <Title title="Overall Performance" />
      <Tabs
        size="sm"
        variant="line"
        activeTabId={activeTab}
        onChange={(t) => setSearchParams({ tab: t }, { replace: true })}
        contentClassName="pt-6"
      >
        <Tab id="pools" label="Pools">
          <PoolsTab />
        </Tab>
        <Tab id="hosts" label="Hosts">
          <HostsTab />
        </Tab>
        <Tab id="osds" label="OSDs">
          <OSDsTab />
        </Tab>
        <Tab id="images" label="Images">
          <ImagesTab />
        </Tab>
      </Tabs>
    </div>
  );
}

export default StoragePerformancePage;
