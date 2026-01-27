import { useState } from 'react';
import {
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconChevronRight,
  IconBell,
  IconCpu,
  IconServer,
} from '@tabler/icons-react';
import { Cpu, MemoryStick, HardDrive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Percentage Badge Component
   ---------------------------------------- */
interface PercentageBadgeProps {
  percentage: number;
}

function PercentageBadge({ percentage }: PercentageBadgeProps) {
  const getColors = () => {
    if (percentage >= 100) return {
      bg: 'bg-[var(--color-state-danger)]/15',
      dot: 'bg-[var(--color-state-danger)]',
      text: 'text-[var(--color-state-danger)]'
    };
    if (percentage >= 70) return {
      bg: 'bg-[var(--color-state-warning)]/15',
      dot: 'bg-[var(--color-state-warning)]',
      text: 'text-[var(--color-state-warning)]'
    };
    return {
      bg: 'bg-[var(--color-state-success)]/15',
      dot: 'bg-[var(--color-state-success)]',
      text: 'text-[var(--color-state-success)]'
    };
  };
  
  const colors = getColors();
  
  return (
    <div className={`flex items-center px-1.5 py-0.5 rounded-md ${colors.bg}`}>
      <span className={`text-[11px] font-medium ${colors.text}`}>{percentage}%</span>
    </div>
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
        <span className="text-[12px] font-medium text-[var(--color-text-default)]">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--color-text-muted)]">{used}/{total} {unit}</span>
          <PercentageBadge percentage={percentage} />
        </div>
      </div>
      <div className="h-1 rounded-sm bg-[var(--color-surface-muted)] overflow-hidden">
        <div 
          className="h-full rounded-sm bg-[var(--color-text-muted)]"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
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
  const textColor = value === 0 ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-default)]';
  const isClickable = label !== 'Others';
  
  return (
    <div className={`flex-1 bg-[var(--color-surface-subtle)] rounded-lg p-4 border-2 border-transparent transition-colors ${isClickable ? 'hover:border-[var(--color-action-primary)] cursor-pointer' : ''}`}>
      <div className={`text-[20px] font-medium ${textColor} pb-1`}>{value}</div>
      <div className="text-[11px] text-[var(--color-text-subtle)]">{label}</div>
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
        <div className="flex items-center gap-1 text-[12px] font-medium text-[var(--color-text-default)]">
          <span className="flex-shrink-0">{icon}</span>
          <span className="truncate">{label}</span>
        </div>
        <PercentageBadge percentage={percentage} />
      </div>
      <div className="flex items-baseline mb-3">
        <span className="text-[24px] text-[var(--color-text-default)]">{used}</span>
        <span className="text-[14px] text-[var(--color-text-muted)] pt-1.5">/{total}</span>
      </div>
      <div className="h-1 rounded-sm bg-[var(--color-surface-muted)] overflow-hidden">
        <div 
          className="h-full rounded-sm bg-[var(--color-text-muted)]"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
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
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${enabled ? 'bg-[var(--color-state-success)]/15 text-[var(--color-state-success)]' : 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]'}`}>
          {enabled ? 'Enabled' : 'Disabled'}
        </span>
        <button className="flex items-center gap-1 text-[12px] font-medium text-[var(--color-text-default)] hover:text-[var(--color-action-primary)]">
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

function Card({ title, children, className = '', bgColor = 'bg-[var(--color-surface-default)]' }: CardProps) {
  return (
    <div className={`p-4 rounded-2xl border border-[var(--color-border-default)] ${bgColor} ${className}`}>
      <h6 className="text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-semibold text-[var(--color-text-muted)] mb-4">{title}</h6>
      {children}
    </div>
  );
}

/* ----------------------------------------
   Main ComputeAdminHomePage Component
   ---------------------------------------- */
export function ComputeAdminHomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const navigate = useNavigate();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />

      <main className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[200px]' : 'left-0'}`}>
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
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

          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
              items={[
                { label: 'Compute Admin', href: '/compute-admin' },
                { label: 'Home' },
              ]}
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
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Dashboard Content */}
          <div className="px-8 py-6">
          {/* Top Row - 3 Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* CAPACITY SUMMARY */}
            <Card title="CAPACITY SUMMARY">
              <div className="space-y-[22px]">
                <ComputeQuotaBar label="Total vCPU" used={4} total={8} unit="vCPU" />
                <ComputeQuotaBar label="Total RAM" used={22} total={32} unit="GiB" />
                <ComputeQuotaBar label="Total GPU (T4)" used={6} total={8} unit="GPU" />
                <ComputeQuotaBar label="Total NPU" used={6} total={8} unit="NPU" />
              </div>
            </Card>

            {/* INSTANCE SUMMARY */}
            <Card title="INSTANCE SUMMARY" className="flex flex-col">
              <div className="mb-4">
                <div className="text-[24px] leading-[32px] font-semibold text-[var(--color-text-default)]">13</div>
                <div className="text-[12px] text-[var(--color-text-subtle)]">Total</div>
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
            <Card title="BARE METAL SUMMARY" className="flex flex-col">
              <div className="mb-4">
                <div className="text-[24px] leading-[32px] font-semibold text-[var(--color-text-default)]">8</div>
                <div className="text-[12px] text-[var(--color-text-subtle)]">Total</div>
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
          <Card title="TENANT USAGES">
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
        </div>
      </main>
    </div>
  );
}

export default ComputeAdminHomePage;
