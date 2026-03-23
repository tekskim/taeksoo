import { useState } from 'react';
import {
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  PageShell,
  Badge,
  ProgressBar,
  Table,
  STATUS_THRESHOLDS,
  type TableColumn,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { IconCopy, IconCheck, IconChevronRight, IconBell } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Recent Activity Type
   ---------------------------------------- */
interface RecentActivity {
  id: string;
  target: string;
  resourceType: string;
  resourceId: string;
  action: string;
  requestedTime: string;
}

/* ----------------------------------------
   Percentage Badge Component
   ---------------------------------------- */
interface PercentageBadgeProps {
  percentage: number;
}

function PercentageBadge({ percentage }: PercentageBadgeProps) {
  const theme = percentage >= 90 ? 'red' : percentage >= 70 ? 'yellow' : 'green';

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
      <ProgressBar
        variant="quota"
        value={used}
        max={total}
        showValue={false}
        thresholds={STATUS_THRESHOLDS.compute}
      />
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
   Infrastructure Quota Row Component
   ---------------------------------------- */
interface InfraQuotaRowProps {
  label: string;
  used: number;
  total: number;
  href: string;
}

function InfraQuotaRow({ label, used, total, href }: InfraQuotaRowProps) {
  const percentage = Math.round((used / total) * 100);

  return (
    <div className="flex flex-col gap-2 bg-[var(--color-surface-subtle)] rounded-lg p-3 justify-center">
      <div className="flex items-center justify-between">
        <Link
          to={href}
          className="flex items-center gap-0.5 text-label-lg text-[var(--color-text-default)] hover:text-[var(--color-action-primary)]"
        >
          <span>{label}</span>
          <IconChevronRight size={12} className="text-[var(--color-text-muted)]" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-body-sm text-[var(--color-text-muted)]">
            {used}/{total}
          </span>
          <PercentageBadge percentage={percentage} />
        </div>
      </div>
      <ProgressBar
        variant="quota"
        value={used}
        max={total}
        showValue={false}
        thresholds={STATUS_THRESHOLDS.compute}
      />
    </div>
  );
}

/* ----------------------------------------
   Section Header Component
   ---------------------------------------- */
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-4">
      <span className="text-heading-h6">{title}</span>
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

  const recentActivityColumns: TableColumn<RecentActivity>[] = [
    {
      key: 'target',
      label: 'Target',
      flex: 1,
      minWidth: 140,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to="/compute/instances"
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {row.resourceType}
          </Link>
          <span className="text-body-sm text-[var(--color-text-muted)] truncate">
            ID : {row.resourceId}
          </span>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      flex: 1,
      minWidth: 100,
    },
    {
      key: 'requestedTime',
      label: 'Requested Time',
      flex: 1,
      minWidth: 160,
    },
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      target: '',
      resourceType: 'Instance',
      resourceId: '12345678',
      action: 'Create',
      requestedTime: 'Mar 18, 2026 09:42',
    },
    {
      id: '2',
      target: '',
      resourceType: 'Instance',
      resourceId: '23456789',
      action: 'Create',
      requestedTime: 'Mar 17, 2026 15:30',
    },
    {
      id: '3',
      target: '',
      resourceType: 'Instance',
      resourceId: '34567890',
      action: 'Create',
      requestedTime: 'Mar 16, 2026 11:15',
    },
    {
      id: '4',
      target: '',
      resourceType: 'Instance',
      resourceId: '45678901',
      action: 'Create',
      requestedTime: 'Mar 15, 2026 08:55',
    },
    {
      id: '5',
      target: '',
      resourceType: 'Instance',
      resourceId: '56789012',
      action: 'Create',
      requestedTime: 'Mar 14, 2026 17:20',
    },
  ];

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} currentAppId="compute" />}
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
                    <IconCopy size={12} className="text-[var(--color-text-default)]" />
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

        {/* VM Summary */}
        <Card title="VM Summary" className="flex flex-col">
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

      {/* Bottom Row - Recent Activities + Infrastructure Quota */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="p-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
          <SectionHeader title="Recent Activities" />
          <Table<RecentActivity>
            columns={recentActivityColumns}
            data={recentActivities}
            rowKey="id"
            emptyMessage="No recent activities"
          />
        </div>

        {/* Infrastructure Quota */}
        <div className="p-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] flex flex-col">
          <SectionHeader title="Infrastructure Quota" />
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
    </PageShell>
  );
}

export default ComputeHomePage;
