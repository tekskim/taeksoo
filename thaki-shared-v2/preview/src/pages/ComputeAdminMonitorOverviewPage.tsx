import { Table } from '@shared/components/Table';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';

type AlertSeverity = 'critical' | 'warning' | 'info';

interface AlertRow {
  id: string;
  time: string;
  severity: AlertSeverity;
  resource: string;
  message: string;
  [key: string]: unknown;
}

const severityToVariant: Record<AlertSeverity, StatusVariant> = {
  critical: 'error',
  warning: 'degraded',
  info: 'pending',
};

const severityLabel: Record<AlertSeverity, string> = {
  critical: 'Critical',
  warning: 'Warning',
  info: 'Info',
};

const mockAlerts: AlertRow[] = [
  {
    id: '1',
    time: '2026-03-25 09:14:22',
    severity: 'critical',
    resource: 'Instance i-7a3f9c2e',
    message: 'Host compute-04 reported heartbeat timeout.',
  },
  {
    id: '2',
    time: '2026-03-25 08:58:01',
    severity: 'warning',
    resource: 'Volume vol-db-09',
    message: 'IOPS sustained above 95% of provisioned limit for 15m.',
  },
  {
    id: '3',
    time: '2026-03-25 08:41:33',
    severity: 'info',
    resource: 'Network net-prod-east',
    message: 'Scheduled maintenance window starts in 2 hours.',
  },
  {
    id: '4',
    time: '2026-03-25 07:22:10',
    severity: 'warning',
    resource: 'Flavor gpu.a100.8x',
    message: 'Capacity below 10% in az-2b.',
  },
];

const columns: TableColumn[] = [
  { key: 'time', header: 'Time', align: 'right' },
  { key: 'severity', header: 'Severity', width: 120, align: 'center' },
  { key: 'resource', header: 'Resource' },
  { key: 'message', header: 'Message' },
];

function UtilCard({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-2">
      <span className="text-11 text-text-subtle">{title}</span>
      <span className="text-[24px] font-semibold leading-8 text-text">{value}</span>
      <span className="text-11 text-text-muted">{sub}</span>
    </div>
  );
}

export function ComputeAdminMonitorOverviewPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[20px] font-semibold leading-7 text-text">Monitor overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UtilCard title="Compute utilization" value="67%" sub="Cluster-wide vCPU allocation" />
        <UtilCard title="Storage utilization" value="54%" sub="Ceph pool used / provisioned" />
        <UtilCard title="Network utilization" value="38%" sub="Peak spine utilization (24h)" />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-13 font-medium text-text">Recent alerts &amp; events</h2>
        <Table columns={columns} rows={mockAlerts}>
          {mockAlerts.map((row) => (
            <Table.Tr key={row.id} rowData={row}>
              <Table.Td rowData={row} column={columns[0]}>
                <span className="text-12 text-text">{row.time}</span>
              </Table.Td>
              <Table.Td rowData={row} column={columns[1]}>
                <div className="flex justify-center">
                  <StatusIndicator
                    variant={severityToVariant[row.severity]}
                    label={severityLabel[row.severity]}
                  />
                </div>
              </Table.Td>
              <Table.Td rowData={row} column={columns[2]}>
                <span className="text-12 text-text">{row.resource}</span>
              </Table.Td>
              <Table.Td rowData={row} column={columns[3]}>
                <span className="text-12 text-text">{row.message}</span>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table>
      </section>
    </div>
  );
}
