import { Table } from '@shared/components/Table';
import type { TableColumn } from '@shared/components/Table/Table.types';

interface EventRow {
  id: string;
  time: string;
  event: string;
  user: string;
  target: string;
  result: 'Success' | 'Failure';
  ipAddress: string;
  [key: string]: unknown;
}

const eventsData: EventRow[] = [
  {
    id: '1',
    time: 'Dec 12, 25 18:30:39',
    event: 'Sign-in',
    user: 'thaki.kim',
    target: '-',
    result: 'Success',
    ipAddress: '192.168.1.100',
  },
  {
    id: '2',
    time: 'Dec 12, 25 18:30:39',
    event: 'Sign-in',
    user: 'thaki.kim',
    target: '-',
    result: 'Success',
    ipAddress: '192.168.1.100',
  },
  {
    id: '3',
    time: 'Dec 12, 25 18:31:10',
    event: 'Sign-in',
    user: 'alex.johnson',
    target: '-',
    result: 'Success',
    ipAddress: '192.168.1.101',
  },
  {
    id: '4',
    time: 'Dec 12, 25 18:32:25',
    event: 'Sign-in',
    user: 'sara.connor',
    target: '-',
    result: 'Success',
    ipAddress: '192.168.1.102',
  },
  {
    id: '5',
    time: 'Dec 12, 25 18:32:25',
    event: 'Sign-in',
    user: 'sara.connor',
    target: '-',
    result: 'Success',
    ipAddress: '192.168.1.102',
  },
];

const eventColumns: TableColumn[] = [
  { key: 'time', header: 'Time', sortable: true },
  { key: 'event', header: 'Event', sortable: true },
  { key: 'user', header: 'User', sortable: true },
  { key: 'target', header: 'Target', sortable: true },
  { key: 'result', header: 'Result', sortable: true },
  { key: 'ipAddress', header: 'IP address', sortable: true },
];

function StatCard({
  label,
  value,
  variant = 'default',
}: {
  label: string;
  value: string | number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
}) {
  const colorMap = {
    default: 'text-text',
    success: 'text-[var(--semantic-color-success,#22c55e)]',
    warning: 'text-[var(--semantic-color-danger,#ef4444)]',
    danger: 'text-[var(--semantic-color-danger,#ef4444)]',
    primary: 'text-primary',
  };
  const textColor = value === '0' || value === 0 ? 'text-text-muted' : colorMap[variant];
  return (
    <div className="flex-1 bg-surface-muted rounded-lg px-4 py-3 min-w-0">
      <div className="flex flex-col gap-1.5">
        <span className={`text-11 font-medium leading-16 ${textColor}`}>{label}</span>
        <span className={`text-[24px] leading-[32px] font-semibold ${textColor}`}>{value}</span>
      </div>
    </div>
  );
}

function ResourceCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-surface-muted rounded-lg px-4 py-3 flex flex-col gap-1.5">
      <p className="text-11 font-medium leading-16 leading-[16px] text-text-subtle m-0">{label}</p>
      <p className="text-[24px] leading-[32px] font-semibold text-text m-0">{value}</p>
    </div>
  );
}

function SimplePieChart({
  data,
  size = 120,
}: {
  data: { name: string; value: number; color: string }[];
  size?: number;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativePercent = 0;
  const segments = data.map((d) => {
    const pct = (d.value / total) * 100;
    const start = cumulativePercent;
    cumulativePercent += pct;
    return { ...d, pct, start };
  });

  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      {segments.map((seg, i) => {
        const r = 50;
        const cx = 60;
        const cy = 60;
        const startAngle = (seg.start / 100) * 360 - 90;
        const endAngle = ((seg.start + seg.pct) / 100) * 360 - 90;
        const largeArc = seg.pct > 50 ? 1 : 0;
        const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
        const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
        const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
        const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);
        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        const midAngle = ((seg.start + seg.pct / 2) / 100) * 360 - 90;
        const labelR = r * 0.6;
        const lx = cx + labelR * Math.cos((midAngle * Math.PI) / 180);
        const ly = cy + labelR * Math.sin((midAngle * Math.PI) / 180);
        return (
          <g key={i}>
            <path d={d} fill={seg.color} />
            {seg.pct >= 15 && (
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="12"
                fontWeight="600"
                fill="#0f172a"
              >
                {Math.round(seg.pct)}%
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function IAMHomePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Row 1: Domain Info + Authentication Summary */}
      <div className="grid grid-cols-[320px_1fr] gap-6">
        {/* Domain Info Card */}
        <div className="bg-surface-muted rounded-2xl border border-border p-4 flex flex-col gap-6">
          <h6 className="text-14 font-semibold leading-20 text-text m-0">Domain Info</h6>
          <h2 className="text-[32px] leading-[40px] font-semibold text-text m-0">DomainA</h2>
          <div className="flex flex-col gap-4 mt-auto">
            <div>
              <div className="text-[10px] leading-[14px] text-text-muted mb-1">Created at</div>
              <div className="text-12 leading-18 text-text">Dec 12, 2025</div>
            </div>
            <div>
              <div className="text-[10px] leading-[14px] text-text-muted mb-1">Description</div>
              <div className="text-12 leading-18 text-text">-</div>
            </div>
          </div>
        </div>

        {/* Authentication Summary Card */}
        <div className="bg-surface rounded-2xl border border-border p-4 flex flex-col gap-4">
          <h6 className="text-14 font-semibold leading-20 text-text m-0">Authentication Summary</h6>

          <div className="grid grid-cols-2 gap-4">
            {/* Today's Sign-ins */}
            <div className="bg-surface-muted rounded-lg p-4 flex items-start justify-between">
              <div className="flex flex-col gap-3">
                <p className="text-[13px] font-medium leading-18 text-text m-0">Today's Sign-ins</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-[#4ade80]" />
                    <span className="text-11 font-medium leading-16 text-text-subtle">
                      Success: 1,234 (96%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-[#f87171]" />
                    <span className="text-11 font-medium leading-16 text-text-subtle">
                      Failure: 45 (4%)
                    </span>
                  </div>
                </div>
              </div>
              <SimplePieChart
                data={[
                  { name: 'Success', value: 1234, color: '#4ade80' },
                  { name: 'Failure', value: 45, color: '#f87171' },
                ]}
              />
            </div>

            {/* MFA Adoption */}
            <div className="bg-surface-muted rounded-lg p-4 flex items-start justify-between">
              <div className="flex flex-col gap-3">
                <p className="text-[13px] font-medium leading-18 text-text m-0">MFA adoption</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-[#4ade80]" />
                    <span className="text-11 font-medium leading-16 text-text-subtle">
                      Enabled: 117 (78%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-[#e2e8f0]" />
                    <span className="text-11 font-medium leading-16 text-text-subtle">
                      Disabled: 33 (22%)
                    </span>
                  </div>
                </div>
              </div>
              <SimplePieChart
                data={[
                  { name: 'Enabled', value: 117, color: '#4ade80' },
                  { name: 'Disabled', value: 33, color: '#e2e8f0' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: User Status */}
      <div className="bg-surface rounded-2xl border border-border p-4 flex flex-col gap-4">
        <h6 className="text-14 font-semibold leading-20 text-text m-0">User Status</h6>
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total" value="150" variant="default" />
          <StatCard label="Online" value="50" variant="success" />
          <StatCard label="Disabled" value="27" variant="danger" />
          <StatCard label="Locked" value="3" variant="primary" />
        </div>
      </div>

      {/* Row 3: IAM Resources + Recent Events */}
      <div className="grid grid-cols-[320px_1fr] gap-6">
        {/* IAM Resources */}
        <div className="bg-surface rounded-2xl border border-border p-4 flex flex-col gap-4">
          <h6 className="text-14 font-semibold leading-20 text-text m-0">IAM Resources</h6>
          <div className="flex flex-col gap-2">
            <ResourceCard label="User group" value="13" />
            <ResourceCard label="Roles" value="13" />
            <ResourceCard label="Policies" value="13" />
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-surface rounded-2xl border border-border p-4 flex flex-col gap-4 min-w-0">
          <h6 className="text-14 font-semibold leading-20 text-text m-0">Recent Events</h6>
          <div className="overflow-x-auto">
            <Table columns={eventColumns} rows={eventsData}>
              {eventsData.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={eventColumns[0]}>
                    {row.time}
                  </Table.Td>
                  <Table.Td rowData={row} column={eventColumns[1]}>
                    {row.event}
                  </Table.Td>
                  <Table.Td rowData={row} column={eventColumns[2]}>
                    {row.user}
                  </Table.Td>
                  <Table.Td rowData={row} column={eventColumns[3]}>
                    {row.target}
                  </Table.Td>
                  <Table.Td rowData={row} column={eventColumns[4]}>
                    <span className="text-primary">{row.result}</span>
                  </Table.Td>
                  <Table.Td rowData={row} column={eventColumns[5]}>
                    {row.ipAddress}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
