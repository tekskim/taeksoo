import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { default as DetailPageHeader } from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { default as DetailCard } from '@shared/components/DetailCard/DetailCard';
import type { DetailCardField } from '@shared/components/DetailCard/DetailCard';
import { Badge } from '@shared/components/Badge';
import { Button } from '@shared/components/Button';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Table } from '@shared/components/Table';
import { Tabs, Tab } from '@shared/components/Tabs';
import { ProgressBar } from '@shared/components/ProgressBar';
import { CopyButton } from '@shared/components/CopyButton';
import type { TableColumn } from '@shared/components/Table/Table.types';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { getStorageListConfig, type StorageSlug, STORAGE_SLUGS } from '../data/storageListConfig';

function isStorageSlug(v: string | undefined): v is StorageSlug {
  return !!v && (STORAGE_SLUGS as readonly string[]).includes(v);
}

function ChartPlaceholder({ title, height = 200 }: { title: string; height?: number }) {
  return (
    <div
      className="rounded-lg border border-border bg-surface-subtle flex items-center justify-center"
      style={{ height }}
    >
      <span className="text-12 text-text-muted">{title}</span>
    </div>
  );
}

// -- Pool Detail --
function PoolDetail({ id }: { id: string }) {
  const config = useMemo(() => getStorageListConfig('pools'), []);
  const row = config.rows.find((r) => r.id === id);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  if (!row) return <div className="text-text-muted">Pool not found.</div>;

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Data protection', value: row.dataProtection },
    {
      label: 'Applications',
      value: row.applications,
      showCopyButton: true,
      copyText: row.applications,
    },
    { label: 'PG Status', value: row.pgStatus },
    { label: 'Crush ruleset', value: row.crushRuleset },
  ];

  const basicFields: DetailCardField[] = [
    { label: 'Description', value: 'Ceph storage pool for block volumes' },
    { label: 'Cache mode', value: 'none' },
    { label: 'Tier pool', value: '-' },
    { label: 'No scrub', value: 'false' },
    { label: 'No deep scrub', value: 'false' },
    { label: 'Max objects', value: '0 (unlimited)' },
    { label: 'Max bytes', value: '0 (unlimited)' },
  ];

  const loadFields: DetailCardField[] = [
    { label: 'PG autoscale mode', value: 'on' },
    { label: 'Target size ratio', value: '0' },
  ];

  const pgFields: DetailCardField[] = [
    { label: 'PG num', value: '128' },
    { label: 'PGP num', value: '128' },
    { label: 'Min size', value: '2' },
    { label: 'Size', value: '3' },
  ];

  const advancedFields: DetailCardField[] = [
    { label: 'Compression mode', value: 'none' },
    { label: 'Compression algorithm', value: 'snappy' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader title={row.name} infoFields={infoFields} />
      <Tabs
        size="sm"
        variant="line"
        activeTabId={activeTab}
        onChange={(t) => setSearchParams({ tab: t }, { replace: true })}
        contentClassName="pt-6"
      >
        <Tab id="details" label="Details">
          <div className="flex flex-col gap-6">
            <DetailCard
              title="Basic information"
              fields={basicFields}
              actions={
                <Button appearance="outline" variant="secondary" size="sm">
                  <IconEdit size={12} /> Edit
                </Button>
              }
            />
            <DetailCard
              title="Pool flags & limits"
              fields={[
                { label: 'No scrub', value: 'false' },
                { label: 'No deep scrub', value: 'false' },
                { label: 'Max objects', value: '0 (unlimited)' },
                { label: 'Max bytes', value: '0 (unlimited)' },
              ]}
            />
            <DetailCard title="Load balancing" fields={loadFields} />
            <DetailCard
              title="Snapshots & history"
              fields={[
                { label: 'Snapshots', value: '3' },
                { label: 'Last snapshot', value: '2025-03-01' },
              ]}
            />
            <DetailCard title="PG & data placement" fields={pgFields} />
            <DetailCard title="Advanced" fields={advancedFields} />
          </div>
        </Tab>
        <Tab id="performance" label="Performance">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-surface p-4 flex flex-col items-center gap-2">
                <span className="text-11 text-text-muted">Capacity used</span>
                <span className="text-[28px] font-semibold text-text">{row.usagePercent}%</span>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4 flex flex-col items-center gap-2">
                <span className="text-11 text-text-muted">Time till full</span>
                <span className="text-[28px] font-semibold text-text">~180 days</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ChartPlaceholder title="Object ingress/egress" />
              <ChartPlaceholder title="Client IOPS" />
              <ChartPlaceholder title="Client throughput" />
              <ChartPlaceholder title="Objects" />
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

// -- Host Detail --
function HostDetail({ id }: { id: string }) {
  const config = useMemo(() => getStorageListConfig('hosts'), []);
  const row = config.rows.find((r) => r.id === id);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  if (!row) return <div className="text-text-muted">Host not found.</div>;

  const statusVariant =
    row.status === 'available' ? 'active' : row.status === 'maintenance' ? 'degraded' : 'shutoff';
  const statusLabel =
    row.status === 'available'
      ? 'Available'
      : row.status === 'maintenance'
        ? 'Maintenance'
        : 'Offline';

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Status', value: <StatusIndicator variant={statusVariant} label={statusLabel} /> },
    { label: 'Labels', value: row.labels || '-' },
  ];

  const basicFields: DetailCardField[] = [
    { label: 'Model', value: row.model },
    { label: 'CPUs', value: row.cpus },
    { label: 'Cores', value: row.cores },
    { label: 'Total memory', value: row.totalMemory },
    { label: 'Raw capacity', value: row.rawCapacity },
    { label: 'HDDs', value: row.hdds },
    { label: 'Flash', value: row.flash },
    { label: 'NICs', value: row.nics },
  ];

  const deviceColumns: TableColumn[] = [
    { key: 'deviceId', header: 'Device ID', sortable: true },
    { key: 'deviceName', header: 'Device name', sortable: true },
    { key: 'daemons', header: 'Daemons' },
  ];

  const deviceRows = [
    { id: 'd1', deviceId: '/dev/sda', deviceName: 'ST4000NM000A', daemons: 'osd.1' },
    { id: 'd2', deviceId: '/dev/sdb', deviceName: 'SSDSC2KB960G8', daemons: 'osd.2' },
    { id: 'd3', deviceId: '/dev/sdc', deviceName: 'ST4000NM000A', daemons: 'osd.3' },
  ];

  const daemonColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 64 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'version', header: 'Version' },
    { key: 'lastRefreshed', header: 'Last refreshed' },
    { key: 'cpuUsage', header: 'CPU' },
    { key: 'memory', header: 'Memory' },
  ];

  const daemonRows = [
    {
      id: 'dm1',
      status: 'running',
      name: 'osd.1',
      version: '17.2.6',
      lastRefreshed: '10s ago',
      cpuUsage: '2.3%',
      memory: '1.2 GiB',
    },
    {
      id: 'dm2',
      status: 'running',
      name: 'mon.a',
      version: '17.2.6',
      lastRefreshed: '5s ago',
      cpuUsage: '0.8%',
      memory: '512 MiB',
    },
    {
      id: 'dm3',
      status: 'running',
      name: 'mgr.a',
      version: '17.2.6',
      lastRefreshed: '8s ago',
      cpuUsage: '1.1%',
      memory: '640 MiB',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader title={row.hostname} infoFields={infoFields} />
      <Tabs
        size="sm"
        variant="line"
        activeTabId={activeTab}
        onChange={(t) => setSearchParams({ tab: t }, { replace: true })}
        contentClassName="pt-6"
      >
        <Tab id="details" label="Details">
          <DetailCard title="Basic information" fields={basicFields} />
        </Tab>
        <Tab id="devices" label="Devices">
          <div className="flex flex-col gap-4">
            <h3 className="text-14 font-semibold text-text">Devices</h3>
            <Table columns={deviceColumns} rows={deviceRows}>
              {deviceRows.map((r) => (
                <Table.Tr key={r.id} rowData={r}>
                  <Table.Td rowData={r} column={deviceColumns[0]}>
                    {r.deviceId}
                  </Table.Td>
                  <Table.Td rowData={r} column={deviceColumns[1]}>
                    {r.deviceName}
                  </Table.Td>
                  <Table.Td rowData={r} column={deviceColumns[2]}>
                    <Badge theme="gry" type="subtle" size="sm">
                      {r.daemons}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table>
          </div>
        </Tab>
        <Tab id="daemon" label="Daemon">
          <div className="flex flex-col gap-4">
            <h3 className="text-14 font-semibold text-text">Daemons</h3>
            <Table columns={daemonColumns} rows={daemonRows}>
              {daemonRows.map((r) => (
                <Table.Tr key={r.id} rowData={r}>
                  <Table.Td rowData={r} column={daemonColumns[0]}>
                    <StatusIndicator
                      variant={r.status === 'running' ? 'active' : 'error'}
                      layout="iconOnly"
                    />
                  </Table.Td>
                  <Table.Td rowData={r} column={daemonColumns[1]}>
                    {r.name}
                  </Table.Td>
                  <Table.Td rowData={r} column={daemonColumns[2]}>
                    {r.version}
                  </Table.Td>
                  <Table.Td rowData={r} column={daemonColumns[3]}>
                    {r.lastRefreshed}
                  </Table.Td>
                  <Table.Td rowData={r} column={daemonColumns[4]}>
                    <ProgressBar value={parseFloat(r.cpuUsage)} max={100} showValue="percentage" />
                  </Table.Td>
                  <Table.Td rowData={r} column={daemonColumns[5]}>
                    {r.memory}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table>
          </div>
        </Tab>
        <Tab id="performance" label="Performance">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <ChartPlaceholder title="CPU Utilization" />
              <ChartPlaceholder title="RAM Usage" />
              <ChartPlaceholder title="Network load" />
              <ChartPlaceholder title="Network drop/error rate" />
            </div>
            <h3 className="text-14 font-semibold text-text mt-4">Disk Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <ChartPlaceholder title="Disk IOPS" />
              <ChartPlaceholder title="Throughput by Disk" />
              <ChartPlaceholder title="Disk latency" />
              <ChartPlaceholder title="Disk utilization" />
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

// -- OSD Detail --
function OSDDetail({ id }: { id: string }) {
  const config = useMemo(() => getStorageListConfig('osds'), []);
  const row = config.rows.find((r) => r.id === id);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  if (!row) return <div className="text-text-muted">OSD not found.</div>;

  const statusItems = row.status.split(',').map((s) => s.trim());

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: (
        <div className="flex gap-1">
          {statusItems.map((s, i) => (
            <Badge key={i} theme="gry" type="subtle" size="sm">
              {s}
            </Badge>
          ))}
        </div>
      ),
    },
    { label: 'ID', value: row.osdId, showCopyButton: true, copyText: row.osdId },
  ];

  const basicFields: DetailCardField[] = [
    {
      label: 'Device class',
      value: '',
      type: 'component',
      component: (
        <Badge
          theme={row.deviceClass === 'ssd' ? 'blu' : row.deviceClass === 'nvme' ? 'gre' : 'gry'}
          type="subtle"
          size="sm"
        >
          {row.deviceClass.toUpperCase()}
        </Badge>
      ),
    },
    { label: 'PGs', value: row.pgs },
    { label: 'Size', value: row.size },
    { label: 'Flags', value: row.flags },
    {
      label: 'Usage',
      value: '',
      type: 'component',
      component: <ProgressBar value={Number(row.usagePercent)} max={100} showValue="percentage" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader title={row.host} infoFields={infoFields} />
      <Tabs
        size="sm"
        variant="line"
        activeTabId={activeTab}
        onChange={(t) => setSearchParams({ tab: t }, { replace: true })}
        contentClassName="pt-6"
      >
        <Tab id="details" label="Details">
          <DetailCard title="Basic information" fields={basicFields} />
        </Tab>
        <Tab id="devices" label="Devices">
          <div className="flex flex-col gap-4">
            <h3 className="text-14 font-semibold text-text">Devices</h3>
            <Table
              columns={[
                { key: 'deviceId', header: 'Device ID', sortable: true },
                { key: 'deviceName', header: 'Device name' },
                { key: 'daemons', header: 'Daemons' },
              ]}
              rows={[
                { id: 'd1', deviceId: '/dev/sda', deviceName: 'ST4000NM000A', daemons: row.osdId },
              ]}
            >
              {[
                { id: 'd1', deviceId: '/dev/sda', deviceName: 'ST4000NM000A', daemons: row.osdId },
              ].map((r) => (
                <Table.Tr key={r.id} rowData={r}>
                  <Table.Td rowData={r} column={{ key: 'deviceId', header: 'Device ID' }}>
                    {r.deviceId}
                  </Table.Td>
                  <Table.Td rowData={r} column={{ key: 'deviceName', header: 'Device name' }}>
                    {r.deviceName}
                  </Table.Td>
                  <Table.Td rowData={r} column={{ key: 'daemons', header: 'Daemons' }}>
                    <Badge theme="gry" type="subtle" size="sm">
                      {r.daemons}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table>
          </div>
        </Tab>
        <Tab id="device-health" label="Device health">
          <DetailCard
            title="Device information"
            fields={[
              { label: 'Model', value: 'ST4000NM000A-2HZ100' },
              { label: 'Serial', value: `WFK${id}ABC` },
              { label: 'Firmware', value: 'SC60' },
              { label: 'Total capacity', value: row.size },
            ]}
          />
        </Tab>
        <Tab id="performance" label="Performance">
          <div className="flex flex-col gap-4">
            <h3 className="text-14 font-semibold text-text">OSD Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <ChartPlaceholder title="Latency" />
              <ChartPlaceholder title="R/W IOPS" />
              <ChartPlaceholder title="R/W Bytes" />
              <ChartPlaceholder title="Utilization" />
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

// -- Image Detail --
function ImageDetail({ id }: { id: string }) {
  const config = useMemo(() => getStorageListConfig('images'), []);
  const row = config.rows.find((r) => r.id === id);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  if (!row) return <div className="text-text-muted">Image not found.</div>;

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Pool', value: row.pool },
    { label: 'Size', value: row.size },
    { label: 'Objects', value: row.objects },
    { label: 'Object size', value: row.objectSize },
    { label: 'Total provisioned', value: row.totalProvisioned },
  ];

  const basicFields: DetailCardField[] = [
    { label: 'Namespace', value: row.namespace },
    { label: 'Parent', value: row.parent },
    {
      label: 'Mirroring',
      value: '',
      type: 'component',
      component: (
        <Badge theme={row.mirroring === 'Enabled' ? 'gre' : 'gry'} type="subtle" size="sm">
          {row.mirroring}
        </Badge>
      ),
    },
    {
      label: 'Features',
      value: '',
      type: 'component',
      component: (
        <div className="flex gap-1 flex-wrap">
          <Badge theme="gry" type="subtle" size="sm">
            layering
          </Badge>
          <Badge theme="gry" type="subtle" size="sm">
            exclusive-lock
          </Badge>
          <Badge theme="gry" type="subtle" size="sm">
            object-map
          </Badge>
          <Badge theme="gry" type="subtle" size="sm">
            fast-diff
          </Badge>
        </div>
      ),
    },
    { label: 'Next scheduled snapshot', value: row.nextScheduledSnapshot },
    {
      label: 'Usage',
      value: '',
      type: 'component',
      component: <ProgressBar value={Number(row.usagePercent)} max={100} showValue="percentage" />,
    },
  ];

  const snapshotColumns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'state', header: 'State' },
    { key: 'size', header: 'Size' },
    { key: 'used', header: 'Used' },
    { key: 'created', header: 'Created' },
  ];

  const snapshotRows = [
    {
      id: 's1',
      name: 'snap-daily-001',
      state: 'active',
      size: row.size,
      used: '2.1 GiB',
      created: '2025-03-14',
    },
    {
      id: 's2',
      name: 'snap-daily-002',
      state: 'active',
      size: row.size,
      used: '1.8 GiB',
      created: '2025-03-13',
    },
    {
      id: 's3',
      name: 'snap-weekly-001',
      state: 'active',
      size: row.size,
      used: '4.5 GiB',
      created: '2025-03-10',
    },
  ];

  const configColumns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'description', header: 'Description' },
    { key: 'configKey', header: 'Key' },
    { key: 'source', header: 'Source' },
    { key: 'configValue', header: 'Value' },
  ];

  const configRows = [
    {
      id: 'c1',
      name: 'rbd_qos_iops_limit',
      description: 'IOPS limit',
      configKey: 'rbd_qos_iops_limit',
      source: 'pool',
      configValue: '0',
    },
    {
      id: 'c2',
      name: 'rbd_qos_bps_limit',
      description: 'Bandwidth limit',
      configKey: 'rbd_qos_bps_limit',
      source: 'pool',
      configValue: '0',
    },
    {
      id: 'c3',
      name: 'rbd_qos_read_iops_limit',
      description: 'Read IOPS limit',
      configKey: 'rbd_qos_read_iops_limit',
      source: 'pool',
      configValue: '0',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader title={row.name} infoFields={infoFields} />
      <Tabs
        size="sm"
        variant="line"
        activeTabId={activeTab}
        onChange={(t) => setSearchParams({ tab: t }, { replace: true })}
        contentClassName="pt-6"
      >
        <Tab id="details" label="Details">
          <DetailCard title="Basic information" fields={basicFields} />
        </Tab>
        <Tab id="snapshots" label="Snapshots">
          <div className="flex flex-col gap-4">
            <h3 className="text-14 font-semibold text-text">Snapshots</h3>
            <Table columns={snapshotColumns} rows={snapshotRows}>
              {snapshotRows.map((r) => (
                <Table.Tr key={r.id} rowData={r}>
                  <Table.Td rowData={r} column={snapshotColumns[0]}>
                    {r.name}
                  </Table.Td>
                  <Table.Td rowData={r} column={snapshotColumns[1]}>
                    <Badge theme="gre" type="subtle" size="sm">
                      {r.state}
                    </Badge>
                  </Table.Td>
                  <Table.Td rowData={r} column={snapshotColumns[2]}>
                    {r.size}
                  </Table.Td>
                  <Table.Td rowData={r} column={snapshotColumns[3]}>
                    {r.used}
                  </Table.Td>
                  <Table.Td rowData={r} column={snapshotColumns[4]}>
                    {r.created}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table>
          </div>
        </Tab>
        <Tab id="configuration" label="Configuration">
          <div className="flex flex-col gap-4">
            <h3 className="text-14 font-semibold text-text">Configuration</h3>
            <Table columns={configColumns} rows={configRows}>
              {configRows.map((r) => (
                <Table.Tr key={r.id} rowData={r}>
                  <Table.Td rowData={r} column={configColumns[0]}>
                    {r.name}
                  </Table.Td>
                  <Table.Td rowData={r} column={configColumns[1]}>
                    {r.description}
                  </Table.Td>
                  <Table.Td rowData={r} column={configColumns[2]}>
                    <span className="text-12 text-text">{r.configKey}</span>
                  </Table.Td>
                  <Table.Td rowData={r} column={configColumns[3]}>
                    {r.source}
                  </Table.Td>
                  <Table.Td rowData={r} column={configColumns[4]}>
                    {r.configValue}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table>
          </div>
        </Tab>
        <Tab id="performance" label="Performance">
          <div className="grid grid-cols-2 gap-4">
            <ChartPlaceholder title="IOPS" />
            <ChartPlaceholder title="Throughput" />
            <ChartPlaceholder title="Average latency" />
            <ChartPlaceholder title="Highest IOPS" />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

// -- Bucket Detail --
function BucketDetail({ id }: { id: string }) {
  const config = useMemo(() => getStorageListConfig('buckets'), []);
  const row = config.rows.find((r) => r.id === id);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  if (!row) return <div className="text-text-muted">Bucket not found.</div>;

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Owner', value: row.owner },
    { label: 'Used capacity', value: row.usedCapacity },
    { label: 'Objects', value: row.objects },
    { label: 'Created at', value: row.creationDate },
  ];

  const basicFields: DetailCardField[] = [
    { label: 'Region', value: 'default' },
    { label: 'Versioning', value: 'Suspended' },
    { label: 'MFA Delete', value: 'Disabled' },
    { label: 'Encryption', value: 'None' },
    { label: 'Index type', value: 'Normal' },
    { label: 'Placement rule', value: 'default-placement' },
    { label: 'Capacity limit', value: row.capacityLimit },
    { label: 'Object limit', value: row.objectLimit },
  ];

  const policyJson = JSON.stringify(
    {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicRead',
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${row.name}/*`],
        },
      ],
    },
    null,
    2
  );

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader
        title={row.name}
        infoFields={infoFields}
        actions={
          <Button appearance="outline" variant="error" size="sm">
            <IconTrash size={12} /> Delete
          </Button>
        }
      />
      <Tabs
        size="sm"
        variant="line"
        activeTabId={activeTab}
        onChange={(t) => setSearchParams({ tab: t }, { replace: true })}
        contentClassName="pt-6"
      >
        <Tab id="details" label="Details">
          <DetailCard title="Basic information" fields={basicFields} />
        </Tab>
        <Tab id="policies" label="Policies">
          <DetailCard
            title="Policies"
            fields={[
              {
                label: 'Bucket policy',
                value: '',
                type: 'component',
                component: (
                  <pre className="w-full max-h-[420px] overflow-auto rounded-lg border border-border bg-surface-subtle p-3 text-12 leading-5 text-text">
                    {policyJson}
                  </pre>
                ),
              },
            ]}
            actions={<CopyButton text={policyJson} />}
          />
        </Tab>
        <Tab id="objects" label="Objects">
          <div className="flex flex-col gap-4">
            <h3 className="text-14 font-semibold text-text">Objects</h3>
            <Table
              columns={[
                { key: 'key', header: 'Key', sortable: true },
                { key: 'size', header: 'Size' },
                { key: 'lastModified', header: 'Last modified' },
              ]}
              rows={[
                { id: 'o1', key: 'index.html', size: '4.2 KiB', lastModified: '2025-03-10' },
                { id: 'o2', key: 'styles/main.css', size: '12.8 KiB', lastModified: '2025-03-10' },
                { id: 'o3', key: 'images/logo.png', size: '45.2 KiB', lastModified: '2025-03-08' },
              ]}
            >
              {[
                { id: 'o1', key: 'index.html', size: '4.2 KiB', lastModified: '2025-03-10' },
                { id: 'o2', key: 'styles/main.css', size: '12.8 KiB', lastModified: '2025-03-10' },
                { id: 'o3', key: 'images/logo.png', size: '45.2 KiB', lastModified: '2025-03-08' },
              ].map((r) => (
                <Table.Tr key={r.id} rowData={r}>
                  <Table.Td rowData={r} column={{ key: 'key', header: 'Key' }}>
                    <span className="text-12 text-text">{r.key}</span>
                  </Table.Td>
                  <Table.Td rowData={r} column={{ key: 'size', header: 'Size' }}>
                    {r.size}
                  </Table.Td>
                  <Table.Td rowData={r} column={{ key: 'lastModified', header: 'Last modified' }}>
                    {r.lastModified}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

// -- FileSystem Detail --
function FileSystemDetail({ id }: { id: string }) {
  const config = useMemo(() => getStorageListConfig('file-systems'), []);
  const row = config.rows.find((r) => r.id === id);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  if (!row) return <div className="text-text-muted">File System not found.</div>;

  const rankColumns: TableColumn[] = [
    { key: 'rank', header: 'Rank', sortable: true, width: 60 },
    { key: 'state', header: 'State' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'version', header: 'Version' },
  ];
  const rankRows = [
    { id: 'r0', rank: '0', state: 'active', name: `mds.${row.name}.a`, version: '17.2.6' },
  ];

  const poolColumns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'type', header: 'Type' },
    { key: 'usage', header: 'Usage' },
  ];
  const poolRows = [
    { id: 'p1', name: `${row.name}_data`, type: 'Data', usage: '45%' },
    { id: 'p2', name: `${row.name}_metadata`, type: 'Metadata', usage: '12%' },
  ];

  const dirColumns: TableColumn[] = [
    { key: 'path', header: 'Path', sortable: true },
    { key: 'maxFiles', header: 'Max files' },
    { key: 'maxBytes', header: 'Max bytes' },
  ];
  const dirRows = [
    { id: 'dir1', path: '/shared', maxFiles: 'unlimited', maxBytes: 'unlimited' },
    { id: 'dir2', path: '/user-data', maxFiles: '100000', maxBytes: '100 GiB' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader
        title={row.name}
        actions={
          <div className="flex gap-2">
            <Button appearance="outline" variant="error" size="sm">
              <IconTrash size={12} /> Delete
            </Button>
            <Button appearance="outline" variant="secondary" size="sm">
              <IconEdit size={12} /> Edit
            </Button>
          </div>
        }
      />
      <Tabs
        size="sm"
        variant="line"
        activeTabId={activeTab}
        onChange={(t) => setSearchParams({ tab: t }, { replace: true })}
        contentClassName="pt-6"
      >
        <Tab id="details" label="Details">
          <div className="flex flex-col gap-6">
            <DetailCard
              title="Ranks"
              fields={[
                {
                  label: '',
                  value: '',
                  type: 'component',
                  component: (
                    <Table columns={rankColumns} rows={rankRows}>
                      {rankRows.map((r) => (
                        <Table.Tr key={r.id} rowData={r}>
                          <Table.Td rowData={r} column={rankColumns[0]}>
                            {r.rank}
                          </Table.Td>
                          <Table.Td rowData={r} column={rankColumns[1]}>
                            <Badge theme="gre" type="subtle" size="sm">
                              {r.state}
                            </Badge>
                          </Table.Td>
                          <Table.Td rowData={r} column={rankColumns[2]}>
                            {r.name}
                          </Table.Td>
                          <Table.Td rowData={r} column={rankColumns[3]}>
                            {r.version}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table>
                  ),
                },
              ]}
            />
            <DetailCard
              title="Pools"
              fields={[
                {
                  label: '',
                  value: '',
                  type: 'component',
                  component: (
                    <Table columns={poolColumns} rows={poolRows}>
                      {poolRows.map((r) => (
                        <Table.Tr key={r.id} rowData={r}>
                          <Table.Td rowData={r} column={poolColumns[0]}>
                            {r.name}
                          </Table.Td>
                          <Table.Td rowData={r} column={poolColumns[1]}>
                            {r.type}
                          </Table.Td>
                          <Table.Td rowData={r} column={poolColumns[2]}>
                            <ProgressBar
                              value={parseFloat(r.usage)}
                              max={100}
                              showValue="percentage"
                            />
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table>
                  ),
                },
              ]}
            />
            <DetailCard
              title="Standbys"
              fields={[{ label: 'Standby daemons', value: `mds.${row.name}.s` }]}
            />
          </div>
        </Tab>
        <Tab id="directories" label="Directories">
          <div className="flex flex-col gap-4">
            <h3 className="text-14 font-semibold text-text">Directories</h3>
            <Table columns={dirColumns} rows={dirRows}>
              {dirRows.map((r) => (
                <Table.Tr key={r.id} rowData={r}>
                  <Table.Td rowData={r} column={dirColumns[0]}>
                    <span className="text-12 text-text">{r.path}</span>
                  </Table.Td>
                  <Table.Td rowData={r} column={dirColumns[1]}>
                    {r.maxFiles}
                  </Table.Td>
                  <Table.Td rowData={r} column={dirColumns[2]}>
                    {r.maxBytes}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table>
          </div>
        </Tab>
        <Tab id="subvolumes" label="Subvolumes">
          <div className="text-12 text-text-muted py-8 text-center">No subvolumes configured.</div>
        </Tab>
        <Tab id="clients" label="Clients">
          <div className="text-12 text-text-muted py-8 text-center">No active clients.</div>
        </Tab>
        <Tab id="performance" label="Performance">
          <DetailCard
            title="Performance Details"
            fields={[
              { label: 'Read throughput', value: '-' },
              { label: 'Write throughput', value: '-' },
              { label: 'IOPS', value: '-' },
              { label: 'Latency', value: '-' },
            ]}
          />
        </Tab>
      </Tabs>
    </div>
  );
}

// -- NFS Detail --
function NFSDetail({ id }: { id: string }) {
  const config = useMemo(() => getStorageListConfig('nfs'), []);
  const row = config.rows.find((r) => r.id === id);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  if (!row) return <div className="text-text-muted">NFS Export not found.</div>;

  const basicFields: DetailCardField[] = [
    { label: 'Access Type', value: row.accessType },
    { label: 'Storage Backend', value: row.storageBackend },
    { label: 'Cluster', value: row.cluster },
    { label: 'NFS Protocol', value: '4' },
    { label: 'Path', value: row.path },
    { label: 'Pseudo', value: row.pseudo },
    { label: 'Security Label', value: 'false' },
    { label: 'Squash', value: 'no_root_squash' },
    { label: 'Transport', value: 'TCP' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader
        title={row.pseudo}
        actions={
          <div className="flex gap-2">
            <Button appearance="outline" variant="error" size="sm">
              <IconTrash size={12} /> Delete
            </Button>
            <Button appearance="outline" variant="secondary" size="sm">
              <IconEdit size={12} /> Edit
            </Button>
          </div>
        }
      />
      <Tabs
        size="sm"
        variant="line"
        activeTabId={activeTab}
        onChange={(t) => setSearchParams({ tab: t }, { replace: true })}
        contentClassName="pt-6"
      >
        <Tab id="details" label="Details">
          <DetailCard title="Basic information" fields={basicFields} />
        </Tab>
        <Tab id="clients" label="Clients">
          <div className="flex flex-col gap-4">
            <h3 className="text-14 font-semibold text-text">Clients</h3>
            <div className="text-12 text-text-muted py-8 text-center">No active clients.</div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

// -- Main Router --
export function StorageDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const id = params.id ?? '';

  if (slug === 'pools') return <PoolDetail id={id} />;
  if (slug === 'hosts') return <HostDetail id={id} />;
  if (slug === 'osds') return <OSDDetail id={id} />;
  if (slug === 'images') return <ImageDetail id={id} />;
  if (slug === 'buckets') return <BucketDetail id={id} />;
  if (slug === 'file-systems') return <FileSystemDetail id={id} />;
  if (slug === 'nfs') return <NFSDetail id={id} />;

  return <div className="text-text-muted">Detail view not available for this resource.</div>;
}

export default StorageDetailPage;
