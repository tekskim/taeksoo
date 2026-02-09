import { useState } from 'react';
import { TabBar, TopBar, TopBarAction, Breadcrumb, PageShell } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
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
import { Link, useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Percentage Badge Component
   ---------------------------------------- */
interface PercentageBadgeProps {
  percentage: number;
}

function PercentageBadge({ percentage }: PercentageBadgeProps) {
  const getColors = () => {
    if (percentage >= 100)
      return {
        bg: 'bg-[var(--color-state-danger-bg)]',
        text: 'text-[var(--color-state-danger-text)]',
      };
    if (percentage >= 70)
      return {
        bg: 'bg-[var(--color-state-warning-bg)]',
        text: 'text-[var(--color-state-warning-text)]',
      };
    return {
      bg: 'bg-[var(--color-state-success-bg)]',
      text: 'text-[var(--color-state-success-text)]',
    };
  };

  const colors = getColors();

  return (
    <div className={`flex items-center px-1.5 py-0.5 rounded-md ${colors.bg}`}>
      <span className={`text-label-sm ${colors.text}`}>{percentage}%</span>
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
        <span className="text-label-md text-[var(--color-text-default)]">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-body-sm text-[var(--color-text-muted)]">
            {used}/{total} {unit}
          </span>
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
    <div className="bg-[var(--color-surface-subtle)] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <Link
          to={href}
          className="flex items-center gap-1 text-label-md text-[var(--color-text-default)] hover:text-[var(--color-action-primary)] min-w-0"
        >
          <span className="flex-shrink-0">{icon}</span>
          <span className="truncate">{label}</span>
          <IconChevronRight size={12} className="text-[var(--color-text-muted)] flex-shrink-0" />
        </Link>
        <PercentageBadge percentage={percentage} />
      </div>
      <div className="flex items-baseline mb-3">
        <span className="text-heading-h3 text-[var(--color-text-default)]">{used}</span>
        <span className="text-body-lg text-[var(--color-text-muted)]">/{total}</span>
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
    <div
      className={`flex items-center justify-between py-2.5 ${!isLast ? 'border-b border-[var(--color-border-subtle)]' : ''}`}
    >
      <div>
        <div className="text-label-md text-[var(--color-action-primary)]">{name}</div>
        <div className="flex items-center gap-1.5 text-body-sm text-[var(--color-text-muted)]">
          <span>{resourceType}</span>
          <span className="text-[var(--color-border-default)]">|</span>
          <span>{action}</span>
        </div>
      </div>
      <span className="text-body-sm text-[var(--color-text-muted)]">{time}</span>
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
      <h6 className="text-heading-h7 mb-4">{title}</h6>
      {children}
    </div>
  );
}

/* ----------------------------------------
   Main ComputeHomePage Component
   ---------------------------------------- */
export function ComputeHomePage() {
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

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
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
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
          onSidebarToggle={openSidebar}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb items={[{ label: 'Proj-1', href: '/project' }, { label: 'Home' }]} />
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
      {/* Top Row - 4 Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {/* Project Info */}
        <Card
          title="Project Info"
          bgColor="bg-[var(--color-surface-subtle)]"
          className="flex flex-col"
        >
          <h3 className="text-heading-h2 text-[var(--color-text-default)]">proj-1</h3>
          <div className="space-y-4 mt-auto">
            <div>
              <div className="text-body-xs text-[var(--color-text-muted)] mb-1">ID</div>
              <div className="flex items-center gap-1">
                <span className="text-body-md text-[var(--color-text-default)]">{projectId}</span>
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
              <div className="text-body-xs text-[var(--color-text-muted)] mb-1">Description</div>
              <p className="text-body-md text-[var(--color-text-default)]">
                Development environment for the 'service' backend services.
              </p>
            </div>
          </div>
        </Card>

        {/* Compute Quota */}
        <Card title="Compute quota">
          <div className="space-y-[22px]">
            <ComputeQuotaBar label="vCPU" used={4} total={8} unit="vCPU" />
            <ComputeQuotaBar label="RAM" used={22} total={32} unit="GiB" />
            <ComputeQuotaBar label="Disk" used={4} total={6} unit="GiB" />
            <ComputeQuotaBar label="GPU" used={6} total={8} unit="GPU" />
            <ComputeQuotaBar label="NPU" used={6} total={8} unit="NPU" />
          </div>
        </Card>

        {/* Instance Summary */}
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
              <SummaryStatBox value={0} label="Shutoff" />
              <SummaryStatBox value={3} label="Others" />
            </div>
          </div>
        </Card>

        {/* Bare Metal Summary */}
        <Card title="Bare metal summary" className="flex flex-col">
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
              <SummaryStatBox value={0} label="Shutoff" />
              <SummaryStatBox value={1} label="Others" />
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Row - 2 Cards */}
      <div className="grid grid-cols-[1fr_396px] gap-6">
        {/* Infrastructure Quota */}
        <Card title="Infrastructure Quota">
          <div className="space-y-4 mt-8">
            <div className="grid grid-cols-4 gap-4">
              <InfraQuotaCard
                icon={<IconDatabase size={16} stroke={1.5} />}
                label="Volumes"
                used={8}
                total={10}
                href="/compute/volumes"
              />
              <InfraQuotaCard
                icon={<IconNetwork size={16} stroke={1.5} />}
                label="Networks"
                used={10}
                total={100}
                href="/compute/networks"
              />
              <InfraQuotaCard
                icon={<IconRouter size={16} stroke={1.5} />}
                label="Routers"
                used={9}
                total={10}
                href="/compute/routers"
              />
              <InfraQuotaCard
                icon={<IconPlug size={16} stroke={1.5} />}
                label="Ports"
                used={500}
                total={500}
                href="/compute/ports"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <InfraQuotaCard
                icon={<IconWorldWww size={16} stroke={1.5} />}
                label="Floating IPs"
                used={2}
                total={50}
                href="/compute/floating-ips"
              />
              <InfraQuotaCard
                icon={<IconShieldLock size={16} stroke={1.5} />}
                label="Security groups"
                used={85}
                total={100}
                href="/compute/security-groups"
              />
              <InfraQuotaCard
                icon={<IconKey size={16} stroke={1.5} />}
                label="Key pairs"
                used={18}
                total={100}
                href="/compute/key-pairs"
              />
              <InfraQuotaCard
                icon={<IconServer size={16} stroke={1.5} />}
                label="Server groups"
                used={1}
                total={10}
                href="/compute/server-groups"
              />
            </div>
          </div>
        </Card>

        {/* Recent Activities */}
        <Card title="Recent Activities">
          <div>
            <ActivityItem
              name="web-server-01"
              resourceType="Instance"
              action="create"
              time="2m ago"
            />
            <ActivityItem name="data-vol-03" resourceType="Volume" action="attach" time="15m ago" />
            <ActivityItem name="private-net" resourceType="Network" action="update" time="1h ago" />
            <ActivityItem
              name="api-server-02"
              resourceType="Instance"
              action="reboot"
              time="3h ago"
            />
            <ActivityItem
              name="sg-default"
              resourceType="Security group"
              action="modify"
              time="5h ago"
              isLast
            />
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

export default ComputeHomePage;
