import { useEffect } from 'react';
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
  CopyButton,
  useToast,
  EmptyState,
  type TableColumn,
} from '@/design-system';
import { IconBread, IconStack2 } from '@tabler/icons-react';
import { Sidebar } from '@/components/Sidebar';
import { useProject } from '@/contexts/ProjectContext';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { IconChevronRight } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { InlineCopyId } from '@/components/InlineCopyId';

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
  onClick?: () => void;
}

function SummaryStatBox({ value, label, onClick }: SummaryStatBoxProps) {
  const textColor =
    value === 0 ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-default)]';
  const isClickable = !!onClick;

  return (
    <div
      className={`flex-1 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] p-4 border-2 border-transparent transition-colors ${isClickable ? 'hover:border-[var(--color-action-primary)] cursor-pointer' : ''}`}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick?.();
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between">
        <div className="text-body-sm text-[var(--color-text-subtle)]">{label}</div>
        <div className={`text-heading-h4 ${textColor}`}>{value}</div>
      </div>
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
    <div className="flex flex-col gap-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] p-3 justify-center">
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
      className={`p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] ${bgColor} ${className}`}
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
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const navigate = useNavigate();
  const toast = useToast();
  const { projects } = useProject();
  // 선택 가능한 Tenant가 없으면 TopBar·메뉴 트리를 숨기고 page-level Empty State만 표시.
  const hasTenant = projects.length > 0;

  useEffect(() => {
    updateActiveTabLabel('Dashboard');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const projectId = '7284d9174e81431e93060a9bbcf2cdfd';

  const resourceTypeRouteMap: Record<string, string> = {
    Instance: '/compute/instances',
    Volume: '/compute/volumes',
    Network: '/compute/networks',
    Router: '/compute/routers',
    'Floating IP': '/compute/floating-ips',
    'Security Group': '/compute/security-groups',
    'Load Balancer': '/compute/load-balancers',
    Image: '/compute/images',
    'Key Pair': '/compute/key-pairs',
  };

  const recentActivityColumns: TableColumn<RecentActivity>[] = [
    {
      key: 'target',
      label: 'Target',
      flex: 1,
      minWidth: 140,
      render: (_, row) => {
        const basePath = resourceTypeRouteMap[row.resourceType] || '/compute/instances';
        return (
          <div className="flex flex-col gap-0.5 min-w-0">
            <Link
              to={`${basePath}/${row.resourceId}`}
              className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {row.resourceType}
            </Link>
            <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
              <span className="truncate" title={row.resourceId}>
                ID : {row.resourceId.slice(0, 8)}
              </span>
              <InlineCopyId value={row.resourceId} />
            </span>
          </div>
        );
      },
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
      resourceId: '7284d9174e81431e',
      action: 'Reboot',
      requestedTime: 'Apr 15, 2026 09:42',
    },
    {
      id: '2',
      target: '',
      resourceType: 'Volume',
      resourceId: 'a3f1e8b204c647d8',
      action: 'Extend (100 → 200 GiB)',
      requestedTime: 'Apr 15, 2026 08:15',
    },
    {
      id: '3',
      target: '',
      resourceType: 'Security Group',
      resourceId: 'sg92c4d1e7f8a3b5',
      action: 'Add Rule (TCP/443)',
      requestedTime: 'Apr 14, 2026 17:30',
    },
    {
      id: '4',
      target: '',
      resourceType: 'Instance',
      resourceId: 'd4e5f6a7b8c9d0e1',
      action: 'Create',
      requestedTime: 'Apr 14, 2026 14:22',
    },
    {
      id: '5',
      target: '',
      resourceType: 'Floating IP',
      resourceId: 'fip3e8b204c647d8',
      action: 'Associate',
      requestedTime: 'Apr 13, 2026 11:05',
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
        hasTenant ? (
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={openSidebar}
            showNavigation={true}
            onBack={() => navigate(-1)}
            onForward={() => navigate(1)}
            canGoBack={false}
            breadcrumb={<Breadcrumb items={[{ label: 'Dashboard' }]} />}
            actions={
              <>
                <TopBarAction
                  icon={<IconBread size={16} stroke={1.5} />}
                  aria-label="Toast test"
                  onClick={() => toast.success('Instance "web-01" created successfully.')}
                />
              </>
            }
          />
        ) : undefined
      }
      contentClassName="px-8 py-6"
    >
      {!hasTenant ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <EmptyState
            icon={<IconStack2 size={48} stroke={1.25} />}
            title="No tenant available"
            description="No tenant is assigned to your account yet. Resources will appear here once a tenant becomes available."
          />
        </div>
      ) : (
        <>
          {/* Top Row - 4 Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            {/* Tenant Info */}
            <Card
              title="Tenant Info"
              bgColor="bg-[var(--color-surface-subtle)]"
              className="flex flex-col"
            >
              <h3 className="text-heading-h5 text-[var(--color-text-default)] break-all line-clamp-3">
                my-very-long-project-name-for-the-development-environment-of-backend-microservices-and-infrastructure-testing-purpose-2026-v1
              </h3>
              <div className="space-y-4 mt-auto">
                <div>
                  <div className="text-body-xs text-[var(--color-text-muted)] mb-1">
                    Description
                  </div>
                  <p className="text-body-md text-[var(--color-text-default)]">
                    Development environment for the 'service' backend services.
                  </p>
                </div>
                <div>
                  <div className="text-body-xs text-[var(--color-text-muted)] mb-1">ID</div>
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-body-md text-[var(--color-text-default)] truncate">
                      {projectId}
                    </span>
                    <CopyButton value={projectId} size="sm" iconOnly tooltip="Copy ID" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Compute Quota */}
            <Card title="Compute quota" className="flex flex-col">
              <div className="space-y-6 mt-auto">
                <ComputeQuotaBar label="vCPU" used={38} total={64} unit="vCPU" />
                <ComputeQuotaBar label="RAM" used={86} total={128} unit="GiB" />
                <ComputeQuotaBar label="GPU (A100)" used={6} total={8} unit="GPU" />
                <ComputeQuotaBar label="NPU (Gaudi 2)" used={2} total={4} unit="NPU" />
              </div>
            </Card>

            {/* VM Summary */}
            <Card title="VM Summary" className="flex flex-col">
              <div className="mb-4">
                <div className="text-heading-h2 text-[var(--color-text-default)]">21</div>
                <div className="text-body-md text-[var(--color-text-subtle)]">Total</div>
              </div>
              <div className="space-y-2 mt-auto">
                <div className="flex gap-2">
                  <SummaryStatBox
                    value={15}
                    label="Active"
                    onClick={() => navigate('/compute/instances?tab=vm')}
                  />
                  <SummaryStatBox
                    value={2}
                    label="Error"
                    onClick={() => navigate('/compute/instances?tab=vm')}
                  />
                </div>
                <div className="flex gap-2">
                  <SummaryStatBox
                    value={3}
                    label="Stopped"
                    onClick={() => navigate('/compute/instances?tab=vm')}
                  />
                  <SummaryStatBox value={1} label="Others" />
                </div>
              </div>
            </Card>

            {/* Bare Metal Summary */}
            <Card title="Bare metal summary" className="flex flex-col">
              <div className="mb-4">
                <div className="text-heading-h2 text-[var(--color-text-default)]">5</div>
                <div className="text-body-md text-[var(--color-text-subtle)]">Total</div>
              </div>
              <div className="space-y-2 mt-auto">
                <div className="flex gap-2">
                  <SummaryStatBox
                    value={4}
                    label="Active"
                    onClick={() => navigate('/compute/instances?tab=bare-metal')}
                  />
                  <SummaryStatBox
                    value={1}
                    label="Error"
                    onClick={() => navigate('/compute/instances?tab=bare-metal')}
                  />
                </div>
                <div className="flex gap-2">
                  <SummaryStatBox
                    value={0}
                    label="Stopped"
                    onClick={() => navigate('/compute/instances?tab=bare-metal')}
                  />
                  <SummaryStatBox value={0} label="Others" />
                </div>
              </div>
            </Card>
          </div>

          {/* Bottom Row - Recent Activities + Infrastructure Quota */}
          <div className="grid grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
              <SectionHeader title="Recent Activities" />
              <Table<RecentActivity>
                columns={recentActivityColumns}
                data={recentActivities}
                rowKey="id"
                emptyMessage="No recent activities"
              />
            </div>

            {/* Infrastructure Quota */}
            <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] flex flex-col">
              <SectionHeader title="Infrastructure Quota" />
              <div className="grid grid-cols-2 gap-2 flex-1" style={{ gridAutoRows: '1fr' }}>
                <InfraQuotaRow label="Volumes" used={18} total={50} href="/compute/volumes" />
                <InfraQuotaRow label="Networks" used={4} total={10} href="/compute/networks" />
                <InfraQuotaRow label="Routers" used={3} total={10} href="/compute/routers" />
                <InfraQuotaRow label="Ports" used={47} total={200} href="/compute/ports" />
                <InfraQuotaRow
                  label="Floating IPs"
                  used={8}
                  total={10}
                  href="/compute/floating-ips"
                />
                <InfraQuotaRow
                  label="Security groups"
                  used={12}
                  total={20}
                  href="/compute/security-groups"
                />
                <InfraQuotaRow
                  label="Server groups"
                  used={2}
                  total={10}
                  href="/compute/server-groups"
                />
                <InfraQuotaRow label="Key pairs" used={5} total={50} href="/compute/key-pairs" />
              </div>
            </div>
          </div>
        </>
      )}
    </PageShell>
  );
}

export default ComputeHomePage;
