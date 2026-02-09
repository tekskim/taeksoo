import { useState } from 'react';
import {
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  PageShell,
  Badge,
  ProgressBar,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconChevronRight, IconBell, IconCpu, IconServer } from '@tabler/icons-react';
import { Cpu, MemoryStick, HardDrive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Percentage Badge Component
   ---------------------------------------- */
interface PercentageBadgeProps {
  percentage: number;
}

function PercentageBadge({ percentage }: PercentageBadgeProps) {
  const theme = percentage >= 100 ? 'red' : percentage >= 70 ? 'yellow' : 'green';

  return (
    <Badge size="sm" type="subtle" theme={theme}>
      {percentage}%
    </Badge>
  );
}

/* ----------------------------------------
   Compute Quota Bar Component
   ---------------------------------------- */
interface ComputeQuotaBarProps {
  label: string;
  used: number;
  total: number;
  unit: string;
}

function ComputeQuotaBar({ label, used, total, unit }: ComputeQuotaBarProps) {
  const percentage = Math.round((used / total) * 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-label-md text-[var(--color-text-default)]">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-body-sm text-[var(--color-text-muted)]">
            {used}/{total} {unit}
          </span>
          <PercentageBadge percentage={percentage} />
        </div>
      </div>
      <ProgressBar value={used} max={total} showValue={false} />
    </div>
  );
}

/* ----------------------------------------
   Summary Stat Box Component
   ---------------------------------------- */
interface SummaryStatBoxProps {
  value: number;
  label: string;
}

function SummaryStatBox({ value, label }: SummaryStatBoxProps) {
  const textColor =
    value === 0 ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-default)]';
  const isClickable = label !== 'Others';

  return (
    <div
      className={`flex-1 bg-[var(--color-surface-subtle)] rounded-lg p-4 border-2 border-transparent transition-colors ${isClickable ? 'hover:border-[var(--color-action-primary)] cursor-pointer' : ''}`}
    >
      <div className={`text-heading-h3 ${textColor} pb-1`}>{value}</div>
      <div className="text-body-sm text-[var(--color-text-subtle)]">{label}</div>
    </div>
  );
}

/* ----------------------------------------
   Tenant Usage Card Component
   ---------------------------------------- */
interface TenantUsageCardProps {
  icon: React.ReactNode;
  label: string;
  used: number;
  total: number;
}

function TenantUsageCard({ icon, label, used, total }: TenantUsageCardProps) {
  const percentage = Math.round((used / total) * 100);

  return (
    <div className="bg-[var(--color-surface-subtle)] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 text-label-md text-[var(--color-text-default)]">
          <span className="flex-shrink-0">{icon}</span>
          <span className="truncate">{label}</span>
        </div>
        <PercentageBadge percentage={percentage} />
      </div>
      <div className="flex items-baseline mb-3">
        <span className="text-heading-h3 text-[var(--color-text-default)]">{used}</span>
        <span className="text-body-lg text-[var(--color-text-muted)]">/{total}</span>
      </div>
      <ProgressBar value={used} max={total} showValue={false} />
    </div>
  );
}

/* ----------------------------------------
   Tenant Row Component
   ---------------------------------------- */
interface TenantRowProps {
  name: string;
  enabled: boolean;
  resources: {
    vCPU: { used: number; total: number };
    RAM: { used: number; total: number };
    Disk: { used: number; total: number };
    GPU: { used: number; total: number };
    NPU: { used: number; total: number };
  };
}

function TenantRow({ name, enabled, resources }: TenantRowProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-0.5 rounded text-body-xs font-medium ${enabled ? 'bg-[var(--color-state-success-bg)] text-[var(--color-state-success-text)]' : 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]'}`}
        >
          {enabled ? 'Enabled' : 'Disabled'}
        </span>
        <button className="flex items-center gap-1 text-label-md text-[var(--color-text-default)] hover:text-[var(--color-action-primary)]">
          {name}
          <IconChevronRight size={14} className="text-[var(--color-text-muted)]" />
        </button>
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

/* ----------------------------------------
   Card Component
   ---------------------------------------- */
interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
}

function Card({
  title,
  children,
  className = '',
  bgColor = 'bg-[var(--color-surface-default)]',
}: CardProps) {
  return (
    <div
      className={`p-4 rounded-2xl border border-[var(--color-border-default)] ${bgColor} ${className}`}
    >
      <h6 className="text-heading-h6 mb-4">{title}</h6>
      {children}
    </div>
  );
}

/* ----------------------------------------
   Main ComputeAdminHomePage Component
   ---------------------------------------- */
export function ComputeAdminHomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const navigate = useNavigate();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  return (
    <PageShell
      sidebar={
        <ComputeAdminSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
          onWindowClose={() => navigate('/')}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'Compute Admin', href: '/compute-admin' }, { label: 'Home' }]}
            />
          }
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
      contentClassName="px-8 py-6"
    >
      {/* Top Row - 3 Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* CAPACITY SUMMARY */}
        <Card title="Capacity Summary">
          <div className="space-y-[22px]">
            <ComputeQuotaBar label="Total vCPU" used={4} total={8} unit="vCPU" />
            <ComputeQuotaBar label="Total RAM" used={22} total={32} unit="GiB" />
            <ComputeQuotaBar label="Total GPU (T4)" used={6} total={8} unit="GPU" />
            <ComputeQuotaBar label="Total NPU" used={6} total={8} unit="NPU" />
          </div>
        </Card>

        {/* INSTANCE SUMMARY */}
        <Card title="Instance Summary" className="flex flex-col">
          <div className="mb-4">
            <div className="text-heading-h2 text-[var(--color-text-default)]">13</div>
            <div className="text-body-md text-[var(--color-text-subtle)]">Total</div>
          </div>
          <div className="space-y-2 mt-auto">
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

        {/* BARE METAL SUMMARY */}
        <Card title="Bare Metal Summary" className="flex flex-col">
          <div className="mb-4">
            <div className="text-heading-h2 text-[var(--color-text-default)]">8</div>
            <div className="text-body-md text-[var(--color-text-subtle)]">Total</div>
          </div>
          <div className="space-y-2 mt-auto">
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
    </PageShell>
  );
}

export default ComputeAdminHomePage;
