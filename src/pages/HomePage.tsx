import { useState } from 'react';
import {
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconDatabase,
  IconNetwork,
  IconRouter,
  IconPlug,
  IconWorldWww,
  IconShieldLock,
  IconKey,
  IconServer,
  IconCopy,
  IconCheck,
  IconChevronRight,
  IconBell,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Percentage Badge Component
   ---------------------------------------- */
interface PercentageBadgeProps {
  percentage: number;
}

function PercentageBadge({ percentage }: PercentageBadgeProps) {
  const getBgColor = () => {
    if (percentage >= 100) return 'bg-[#fee2e2]';
    if (percentage >= 70) return 'bg-[#ffedd5]';
    return 'bg-[#dcfce7]';
  };
  
  const getDotColor = () => {
    if (percentage >= 100) return 'bg-[#ef4444]';
    if (percentage >= 70) return 'bg-[#f97316]';
    return 'bg-[#22c55e]';
  };
  
  const getTextColor = () => {
    if (percentage >= 100) return 'text-[#ef4444]';
    if (percentage >= 70) return 'text-[#f97316]';
    return 'text-[#22c55e]';
  };
  
  return (
    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md ${getBgColor()}`}>
      <div className={`w-2 h-2 rounded-full ${getDotColor()}`} />
      <span className={`text-[11px] font-medium ${getTextColor()}`}>{percentage}%</span>
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
        <span className="text-[12px] font-medium text-[#0f172a]">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#64748b]">{used}/{total} {unit}</span>
          <PercentageBadge percentage={percentage} />
        </div>
      </div>
      <div className="h-1 rounded-sm bg-[#e2e8f0] overflow-hidden">
        <div 
          className="h-full rounded-sm bg-[#475569]"
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
  const textColor = value === 0 ? 'text-[#64748b]' : 'text-[#0f172a]';
  
  return (
    <div className="flex-1 bg-[#fafafa] rounded-lg p-4 border-2 border-transparent hover:border-[#2563eb] transition-colors cursor-pointer">
      <div className={`text-[20px] font-medium ${textColor} pb-1`}>{value}</div>
      <div className="text-[11px] text-[#475569]">{label}</div>
    </div>
  );
}

/* ----------------------------------------
   Infrastructure Quota Card Component
   ---------------------------------------- */
interface InfraQuotaCardProps {
  icon: React.ReactNode;
  label: string;
  used: number;
  total: number;
  href: string;
}

function InfraQuotaCard({ icon, label, used, total, href }: InfraQuotaCardProps) {
  const percentage = Math.round((used / total) * 100);
  
  return (
    <div className="bg-[#fafafa] rounded-lg pt-4 pb-5 px-5">
      <div className="flex items-center justify-between mb-3">
        <Link 
          to={href}
          className="flex items-center gap-1 text-[12px] font-medium text-[#0f172a] hover:text-[#2563eb]"
        >
          {icon}
          <span>{label}</span>
          <IconChevronRight size={12} className="text-[#64748b]" />
        </Link>
        <PercentageBadge percentage={percentage} />
      </div>
      <div className="flex items-baseline mb-3">
        <span className="text-[24px] text-[#0f172a]">{used}</span>
        <span className="text-[14px] text-[#64748b] pt-1.5">/{total}</span>
      </div>
      <div className="h-1 rounded-sm bg-[#e2e8f0] overflow-hidden">
        <div 
          className="h-full rounded-sm bg-[#475569]"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

/* ----------------------------------------
   Activity Item Component
   ---------------------------------------- */
interface ActivityItemProps {
  name: string;
  resourceType: string;
  action: string;
  time: string;
  isLast?: boolean;
}

function ActivityItem({ name, resourceType, action, time, isLast = false }: ActivityItemProps) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${!isLast ? 'border-b border-[#f1f5f9]' : ''}`}>
      <div>
        <div className="text-[12px] font-medium text-[#2563eb]">{name}</div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
          <span>{resourceType}</span>
          <span className="text-[#e2e8f0]">|</span>
          <span>{action}</span>
        </div>
      </div>
      <span className="text-[11px] text-[#64748b]">{time}</span>
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

function Card({ title, children, className = '', bgColor = 'bg-white' }: CardProps) {
  return (
    <div className={`p-6 rounded-2xl border border-[#e2e8f0] ${bgColor} ${className}`}>
      <h6 className="text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-semibold text-[var(--color-text-muted)] mb-6">{title}</h6>
      {children}
    </div>
  );
}

/* ----------------------------------------
   Main HomePage Component
   ---------------------------------------- */
export function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
  const [copied, setCopied] = useState(false);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const projectId = '7284d9174e81431e93060a9bbcf2cdfd';

  const handleCopyId = () => {
    navigator.clipboard.writeText(projectId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <main className={`min-h-screen bg-white transition-[margin] duration-200 overflow-x-auto ${sidebarOpen ? 'ml-[200px]' : 'ml-0'}`}>
        <div className="min-w-[var(--layout-content-min-width)]">
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          showAddButton={true}
          showWindowControls={true}
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
                { label: 'Proj-1', href: '/project' },
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

        {/* Dashboard Content */}
        <div className="px-8 py-6">
          {/* Top Row - 4 Cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {/* PROJECT INFO */}
            <Card title="PROJECT INFO" bgColor="bg-[#fafafa]" className="flex flex-col justify-between">
              <div>
                <h3 className="text-[32px] font-semibold text-[#0f172a] mb-4">proj-1</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-[#64748b] mb-1">ID</div>
                  <div className="flex items-center gap-1">
                    <span className="text-[12px] text-[#0f172a]">{projectId}</span>
                    <button 
                      onClick={handleCopyId}
                      className="p-1.5 -m-1 rounded-md hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-surface-subtle)] transition-colors"
                      title={copied ? 'Copied!' : 'Copy ID'}
                    >
                      {copied ? (
                        <IconCheck size={12} className="text-[var(--color-state-success)]" />
                      ) : (
                        <IconCopy size={12} className="text-[var(--color-action-primary)]" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#64748b] mb-1">Description</div>
                  <p className="text-[12px] text-[#0f172a]">
                    Development environment for the 'service' backend services.
                  </p>
                </div>
              </div>
            </Card>

            {/* COMPUTE QUOTA */}
            <Card title="COMPUTE QUOTA">
              <div className="space-y-[22px]">
                <ComputeQuotaBar label="vCPU" used={4} total={8} unit="vCPU" />
                <ComputeQuotaBar label="RAM" used={22} total={32} unit="GiB" />
                <ComputeQuotaBar label="Disk" used={4} total={6} unit="GiB" />
                <ComputeQuotaBar label="GPU" used={6} total={8} unit="GPU" />
                <ComputeQuotaBar label="NPU" used={6} total={8} unit="NPU" />
              </div>
            </Card>

            {/* INSTANCE SUMMARY */}
            <Card title="INSTANCE SUMMARY">
              <div className="mb-6">
                <div className="text-[24px] font-semibold text-[#0f172a]">13</div>
                <div className="text-[12px] text-[#475569]">Total</div>
              </div>
              <div className="space-y-2">
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

            {/* BARE METAL SUMMARY */}
            <Card title="BARE METAL SUMMARY" className="border-[#e0e0e0]">
              <div className="mb-6">
                <div className="text-[24px] font-semibold text-[#0f172a]">8</div>
                <div className="text-[12px] text-[#475569]">Total</div>
              </div>
              <div className="space-y-2">
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

          {/* Bottom Row - 2 Cards */}
          <div className="grid grid-cols-[1fr_396px] gap-6">
            {/* INFRASTRUCTURE QUOTA */}
            <Card title="INFRASTRUCTURE QUOTA">
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <InfraQuotaCard
                    icon={<IconDatabase size={16} stroke={1.5} />}
                    label="Volumes"
                    used={8}
                    total={10}
                    href="/volumes"
                  />
                  <InfraQuotaCard
                    icon={<IconNetwork size={16} stroke={1.5} />}
                    label="Networks"
                    used={10}
                    total={100}
                    href="/networks"
                  />
                  <InfraQuotaCard
                    icon={<IconRouter size={16} stroke={1.5} />}
                    label="Routers"
                    used={9}
                    total={10}
                    href="/routers"
                  />
                  <InfraQuotaCard
                    icon={<IconPlug size={16} stroke={1.5} />}
                    label="Ports"
                    used={500}
                    total={500}
                    href="/ports"
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <InfraQuotaCard
                    icon={<IconWorldWww size={16} stroke={1.5} />}
                    label="Floating IPs"
                    used={2}
                    total={50}
                    href="/floating-ips"
                  />
                  <InfraQuotaCard
                    icon={<IconShieldLock size={16} stroke={1.5} />}
                    label="Security Groups"
                    used={85}
                    total={100}
                    href="/security-groups"
                  />
                  <InfraQuotaCard
                    icon={<IconKey size={16} stroke={1.5} />}
                    label="Key Pairs"
                    used={18}
                    total={100}
                    href="/key-pairs"
                  />
                  <InfraQuotaCard
                    icon={<IconServer size={16} stroke={1.5} />}
                    label="Server Groups"
                    used={1}
                    total={10}
                    href="/server-groups"
                  />
                </div>
              </div>
            </Card>

            {/* RECENT ACTIVITIES */}
            <Card title="RECENT ACTIVITIES">
              <div>
                <ActivityItem
                  name="web-server-01"
                  resourceType="Instance"
                  action="create"
                  time="2m ago"
                />
                <ActivityItem
                  name="data-vol-03"
                  resourceType="Volume"
                  action="attach"
                  time="15m ago"
                />
                <ActivityItem
                  name="private-net"
                  resourceType="Network"
                  action="update"
                  time="1h ago"
                />
                <ActivityItem
                  name="api-server-02"
                  resourceType="Instance"
                  action="reboot"
                  time="3h ago"
                />
                <ActivityItem
                  name="sg-default"
                  resourceType="Security Group"
                  action="modify"
                  time="5h ago"
                  isLast
                />
              </div>
            </Card>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
