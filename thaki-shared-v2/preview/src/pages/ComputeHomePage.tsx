import { Link } from 'react-router-dom';
import { Table } from '@shared/components/Table';
import { Badge } from '@shared/components/Badge';
import { ProgressBar } from '@shared/components/ProgressBar';
import { CopyButton } from '@shared/components/CopyButton';
import type { TableColumn } from '@shared/components/Table/Table.types';
import { IconChevronRight } from '@tabler/icons-react';

interface RecentActivity {
  id: string;
  resourceType: string;
  resourceId: string;
  action: string;
  requestedTime: string;
  [key: string]: unknown;
}

function PercentageBadge({ percentage }: { percentage: number }) {
  const theme = percentage >= 90 ? 'red' : percentage >= 70 ? 'ylw' : 'gre';
  return (
    <Badge size="sm" type="subtle" theme={theme}>
      {percentage}%
    </Badge>
  );
}

function ComputeQuotaBar({
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
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-12 font-medium leading-18 text-text">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-11 leading-16 text-text-muted">
            {used}/{total} {unit}
          </span>
          <PercentageBadge percentage={percentage} />
        </div>
      </div>
      <ProgressBar
        value={used}
        max={total}
        showValue={false}
        variant={percentage >= 90 ? 'error' : percentage >= 70 ? 'warning' : 'success'}
      />
    </div>
  );
}

function SummaryStatBox({ value, label }: { value: number; label: string }) {
  const textColor = value === 0 ? 'text-text-muted' : 'text-text';
  const isClickable = label !== 'Others';
  return (
    <div
      className={`flex-1 bg-surface-muted rounded-lg p-4 border-2 border-transparent transition-colors ${isClickable ? 'hover:border-primary cursor-pointer' : ''}`}
    >
      <div className={`text-[24px] leading-[32px] font-semibold ${textColor} pb-1`}>{value}</div>
      <div className="text-11 leading-16 text-text-subtle">{label}</div>
    </div>
  );
}

function InfraQuotaRow({
  label,
  used,
  total,
  href,
}: {
  label: string;
  used: number;
  total: number;
  href: string;
}) {
  const percentage = Math.round((used / total) * 100);
  return (
    <div className="flex flex-col gap-2 bg-surface-muted rounded-lg p-3 justify-center">
      <div className="flex items-center justify-between">
        <Link
          to={href}
          className="flex items-center gap-0.5 text-13 font-medium leading-18 text-text hover:text-primary no-underline"
        >
          <span>{label}</span>
          <IconChevronRight size={12} className="text-text-muted" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-11 leading-16 text-text-muted">
            {used}/{total}
          </span>
          <PercentageBadge percentage={percentage} />
        </div>
      </div>
      <ProgressBar
        value={used}
        max={total}
        showValue={false}
        variant={percentage >= 90 ? 'error' : percentage >= 70 ? 'warning' : 'success'}
      />
    </div>
  );
}

function Card({
  title,
  children,
  className = '',
  bgColor = 'bg-surface',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
}) {
  return (
    <div className={`p-4 rounded-2xl border border-border ${bgColor} ${className}`}>
      <h6 className="text-14 font-semibold leading-20 text-text m-0 mb-4">{title}</h6>
      {children}
    </div>
  );
}

const recentActivities: RecentActivity[] = [
  {
    id: '1',
    resourceType: 'Instance',
    resourceId: '12345678',
    action: 'Create',
    requestedTime: 'Mar 18, 2026 09:42',
  },
  {
    id: '2',
    resourceType: 'Instance',
    resourceId: '23456789',
    action: 'Create',
    requestedTime: 'Mar 17, 2026 15:30',
  },
  {
    id: '3',
    resourceType: 'Instance',
    resourceId: '34567890',
    action: 'Create',
    requestedTime: 'Mar 16, 2026 11:15',
  },
  {
    id: '4',
    resourceType: 'Instance',
    resourceId: '45678901',
    action: 'Create',
    requestedTime: 'Mar 15, 2026 08:55',
  },
  {
    id: '5',
    resourceType: 'Instance',
    resourceId: '56789012',
    action: 'Create',
    requestedTime: 'Mar 14, 2026 17:20',
  },
];

const activityColumns: TableColumn[] = [
  { key: 'resourceType', header: 'Target' },
  { key: 'action', header: 'Action' },
  { key: 'requestedTime', header: 'Requested Time' },
];

const PROJECT_ID = '7284d9174e81431e93060a9bbcf2cdfd';

export function ComputeHomePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Row - 4 Cards */}
      <div className="grid grid-cols-4 gap-6">
        {/* Project Info */}
        <Card title="Project Info" bgColor="bg-surface-muted" className="flex flex-col">
          <h3 className="text-[32px] leading-[40px] font-semibold text-text m-0">proj-1</h3>
          <div className="flex flex-col gap-4 mt-auto">
            <div>
              <div className="text-[10px] leading-[14px] text-text-muted mb-1">ID</div>
              <div className="flex items-center gap-1">
                <span className="text-12 leading-18 text-text break-all">{PROJECT_ID}</span>
                <CopyButton text={PROJECT_ID} />
              </div>
            </div>
            <div>
              <div className="text-[10px] leading-[14px] text-text-muted mb-1">Description</div>
              <p className="text-12 leading-18 text-text m-0">
                Development environment for the 'service' backend services.
              </p>
            </div>
          </div>
        </Card>

        {/* Compute Quota */}
        <Card title="Compute quota">
          <div className="flex flex-col gap-[22px]">
            <ComputeQuotaBar label="vCPU" used={4} total={8} unit="vCPU" />
            <ComputeQuotaBar label="RAM" used={22} total={32} unit="GiB" />
            <ComputeQuotaBar label="Disk" used={4} total={6} unit="GiB" />
            <ComputeQuotaBar label="GPU" used={6} total={8} unit="GPU" />
            <ComputeQuotaBar label="NPU" used={6} total={8} unit="NPU" />
          </div>
        </Card>

        {/* VM Summary */}
        <Card title="VM Summary" className="flex flex-col">
          <div className="mb-4">
            <div className="text-[32px] leading-[40px] font-semibold text-text">13</div>
            <div className="text-12 leading-18 text-text-subtle">Total</div>
          </div>
          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex gap-2">
              <SummaryStatBox value={10} label="Active" />
              <SummaryStatBox value={0} label="Error" />
            </div>
            <div className="flex gap-2">
              <SummaryStatBox value={0} label="Shutoff" />
              <SummaryStatBox value={3} label="Others" />
            </div>
          </div>
        </Card>

        {/* Bare Metal Summary */}
        <Card title="Bare metal summary" className="flex flex-col">
          <div className="mb-4">
            <div className="text-[32px] leading-[40px] font-semibold text-text">8</div>
            <div className="text-12 leading-18 text-text-subtle">Total</div>
          </div>
          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex gap-2">
              <SummaryStatBox value={6} label="Active" />
              <SummaryStatBox value={1} label="Error" />
            </div>
            <div className="flex gap-2">
              <SummaryStatBox value={0} label="Shutoff" />
              <SummaryStatBox value={1} label="Others" />
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Row - Recent Activities + Infrastructure Quota */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="p-4 rounded-2xl border border-border bg-surface">
          <h6 className="text-14 font-semibold leading-20 text-text m-0 mb-4">Recent Activities</h6>
          <Table columns={activityColumns} rows={recentActivities}>
            {recentActivities.map((row) => (
              <Table.Tr key={row.id} rowData={row}>
                <Table.Td rowData={row} column={activityColumns[0]}>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <Link
                      to="/compute/instances"
                      className="text-primary font-medium hover:underline no-underline"
                    >
                      {row.resourceType}
                    </Link>
                    <span className="text-11 leading-16 text-text-muted">
                      ID : {row.resourceId}
                    </span>
                  </div>
                </Table.Td>
                <Table.Td rowData={row} column={activityColumns[1]}>
                  {row.action}
                </Table.Td>
                <Table.Td rowData={row} column={activityColumns[2]}>
                  {row.requestedTime}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table>
        </div>

        {/* Infrastructure Quota */}
        <div className="p-4 rounded-2xl border border-border bg-surface flex flex-col">
          <h6 className="text-14 font-semibold leading-20 text-text m-0 mb-4">
            Infrastructure Quota
          </h6>
          <div className="grid grid-cols-2 gap-2 flex-1" style={{ gridAutoRows: '1fr' }}>
            <InfraQuotaRow label="Volumes" used={25} total={50} href="/compute/volumes" />
            <InfraQuotaRow label="Networks" used={25} total={50} href="/compute/networks" />
            <InfraQuotaRow label="Routers" used={25} total={50} href="/compute/routers" />
            <InfraQuotaRow label="Ports" used={25} total={50} href="/compute/ports" />
            <InfraQuotaRow label="Floating IPs" used={25} total={50} href="/compute/floating-ips" />
            <InfraQuotaRow
              label="Security groups"
              used={25}
              total={50}
              href="/compute/security-groups"
            />
            <InfraQuotaRow
              label="Server groups"
              used={25}
              total={50}
              href="/compute/server-groups"
            />
            <InfraQuotaRow label="Key pairs" used={25} total={50} href="/compute/key-pairs" />
          </div>
        </div>
      </div>
    </div>
  );
}
