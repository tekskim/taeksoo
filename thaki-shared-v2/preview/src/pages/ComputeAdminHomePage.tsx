import { Badge } from '@shared/components/Badge';
import { ProgressBar } from '@shared/components/ProgressBar';
import { IconChevronRight, IconCpu, IconServer } from '@tabler/icons-react';
import { Cpu, MemoryStick, HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';

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

function TenantUsageCard({
  icon,
  label,
  used,
  total,
}: {
  icon: React.ReactNode;
  label: string;
  used: number;
  total: number;
}) {
  const percentage = Math.round((used / total) * 100);
  return (
    <div className="bg-surface-muted rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 text-12 font-medium leading-18 text-text">
          <span className="flex-shrink-0">{icon}</span>
          <span className="truncate">{label}</span>
        </div>
        <PercentageBadge percentage={percentage} />
      </div>
      <div className="flex items-baseline mb-3">
        <span className="text-[24px] leading-[32px] font-semibold text-text">{used}</span>
        <span className="text-14 leading-20 text-text-muted">/{total}</span>
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

function TenantRow({
  name,
  enabled,
  resources,
}: {
  name: string;
  enabled: boolean;
  resources: {
    vCPU: { used: number; total: number };
    RAM: { used: number; total: number };
    Disk: { used: number; total: number };
    GPU: { used: number; total: number };
    NPU: { used: number; total: number };
  };
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge size="sm" type="subtle" theme={enabled ? 'gre' : 'gry'}>
          {enabled ? 'Enabled' : 'Disabled'}
        </Badge>
        <Link
          to="/compute-admin/tenants"
          className="flex items-center gap-1 text-13 font-medium leading-18 text-text hover:text-primary no-underline"
        >
          {name}
          <IconChevronRight size={12} className="text-text-muted" />
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-4">
        <TenantUsageCard
          icon={<Cpu size={14} strokeWidth={1.5} />}
          label="vCPU"
          used={resources.vCPU.used}
          total={resources.vCPU.total}
        />
        <TenantUsageCard
          icon={<MemoryStick size={14} strokeWidth={1.5} />}
          label="RAM"
          used={resources.RAM.used}
          total={resources.RAM.total}
        />
        <TenantUsageCard
          icon={<HardDrive size={14} strokeWidth={1.5} />}
          label="Disk"
          used={resources.Disk.used}
          total={resources.Disk.total}
        />
        <TenantUsageCard
          icon={<IconCpu size={14} stroke={1.5} />}
          label="GPU (T4)"
          used={resources.GPU.used}
          total={resources.GPU.total}
        />
        <TenantUsageCard
          icon={<IconServer size={14} stroke={1.5} />}
          label="NPU"
          used={resources.NPU.used}
          total={resources.NPU.total}
        />
      </div>
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

export function ComputeAdminHomePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Row - 3 Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Capacity Summary */}
        <Card title="Capacity Summary">
          <div className="flex flex-col gap-[22px]">
            <ComputeQuotaBar label="Total vCPU" used={4} total={8} unit="vCPU" />
            <ComputeQuotaBar label="Total RAM" used={22} total={32} unit="GiB" />
            <ComputeQuotaBar label="Total GPU (T4)" used={6} total={8} unit="GPU" />
            <ComputeQuotaBar label="Total NPU" used={6} total={8} unit="NPU" />
          </div>
        </Card>

        {/* Instance Summary */}
        <Card title="Instance Summary" className="flex flex-col">
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
              <SummaryStatBox value={0} label="Stopped" />
              <SummaryStatBox value={3} label="Others" />
            </div>
          </div>
        </Card>

        {/* Bare Metal Summary */}
        <Card title="Bare Metal Summary" className="flex flex-col">
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
              <SummaryStatBox value={0} label="Stopped" />
              <SummaryStatBox value={1} label="Others" />
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Row - Tenant Usages */}
      <Card title="Tenant Usages">
        <div className="space-y-6">
          <TenantRow
            name="Tenant A"
            enabled={true}
            resources={{
              vCPU: { used: 4, total: 8 },
              RAM: { used: 22, total: 32 },
              Disk: { used: 4, total: 6 },
              GPU: { used: 6, total: 8 },
              NPU: { used: 6, total: 8 },
            }}
          />
          <TenantRow
            name="Tenant B"
            enabled={false}
            resources={{
              vCPU: { used: 4, total: 8 },
              RAM: { used: 22, total: 32 },
              Disk: { used: 4, total: 6 },
              GPU: { used: 6, total: 8 },
              NPU: { used: 6, total: 8 },
            }}
          />
          <TenantRow
            name="Tenant C"
            enabled={true}
            resources={{
              vCPU: { used: 4, total: 8 },
              RAM: { used: 22, total: 32 },
              Disk: { used: 4, total: 6 },
              GPU: { used: 6, total: 8 },
              NPU: { used: 6, total: 8 },
            }}
          />
        </div>
      </Card>
    </div>
  );
}
