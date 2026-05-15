import { useMemo, useCallback, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  PageShell,
  TabBar,
  TopBar,
  Breadcrumb,
  VStack,
  MenuItem,
  MenuSection,
  SectionCard,
  MetricCard,
  ProgressBar,
  Badge,
  PageHeader,
  EmptyState,
} from '@/design-system';
import { AppSwitcher } from '@/components/AppSwitcher';
import { useTabs } from '@/contexts/TabContext';
import {
  IconLayoutDashboard,
  IconList,
  IconStack2,
  IconChartBar,
  IconCalendarEvent,
  IconBell,
  IconClipboardList,
  IconFileText,
  IconServer,
  IconTrendingUp,
  IconNetwork,
  IconSettings,
  IconPackage,
  IconFolder,
  IconHammer,
} from '@tabler/icons-react';

/* ----------------------------------------
   Sidebar
   ---------------------------------------- */

function FabricSidebar({ onToggle }: { isOpen?: boolean; onToggle?: () => void }) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (href !== '/fabric' && location.pathname.startsWith(href + '/')) return true;
    return false;
  };

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="fabric" onToggleSidebar={onToggle} />

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pt-3 pb-6 sidebar-scroll">
        <VStack gap={2} className="w-full min-w-0">
          <MenuItem
            icon={<IconLayoutDashboard size={16} stroke={1.5} />}
            label="Dashboard"
            href="/fabric"
            active={isActive('/fabric') && location.pathname === '/fabric'}
          />

          <MenuSection title="Kueue" defaultOpen={true}>
            <MenuItem
              icon={<IconList size={16} stroke={1.5} />}
              label="Kueue Queue"
              href="/fabric/kueue-queue"
              active={isActive('/fabric/kueue-queue')}
            />
            <MenuItem
              icon={<IconStack2 size={16} stroke={1.5} />}
              label="Kueue Workloads"
              href="/fabric/kueue-workloads"
              active={isActive('/fabric/kueue-workloads')}
            />
            <MenuItem
              icon={<IconChartBar size={16} stroke={1.5} />}
              label="Kueue Analytics"
              href="/fabric/kueue-analytics"
              active={isActive('/fabric/kueue-analytics')}
            />
            <MenuItem
              icon={<IconCalendarEvent size={16} stroke={1.5} />}
              label="Kueue Scheduler"
              href="/fabric/kueue-scheduler"
              active={isActive('/fabric/kueue-scheduler')}
            />
            <MenuItem
              icon={<IconBell size={16} stroke={1.5} />}
              label="Kueue Alert"
              href="/fabric/kueue-alert"
              active={isActive('/fabric/kueue-alert')}
            />
            <MenuItem
              icon={<IconClipboardList size={16} stroke={1.5} />}
              label="Resource Inventory"
              href="/fabric/resource-inventory"
              active={isActive('/fabric/resource-inventory')}
            />
            <MenuItem
              icon={<IconFileText size={16} stroke={1.5} />}
              label="Audit Log"
              href="/fabric/audit-log"
              active={isActive('/fabric/audit-log')}
            />
          </MenuSection>

          <MenuSection title="Monitoring" defaultOpen={true}>
            <MenuItem
              icon={<IconServer size={16} stroke={1.5} />}
              label="Nodes"
              href="/fabric/nodes"
              active={isActive('/fabric/nodes')}
            />
            <MenuItem
              icon={<IconTrendingUp size={16} stroke={1.5} />}
              label="Usage Trend"
              href="/fabric/usage-trend"
              active={isActive('/fabric/usage-trend')}
            />
          </MenuSection>

          <MenuSection title="Cluster Managements" defaultOpen={true}>
            <MenuItem
              icon={<IconNetwork size={16} stroke={1.5} />}
              label="Connected Clusters"
              href="/fabric/connected-clusters"
              active={isActive('/fabric/connected-clusters')}
            />
          </MenuSection>

          <MenuSection title="Operations" defaultOpen={false}>
            <MenuItem
              icon={<IconSettings size={16} stroke={1.5} />}
              label="Settings"
              href="/fabric/settings"
              active={isActive('/fabric/settings')}
            />
          </MenuSection>

          <MenuSection title="Admin Managements" defaultOpen={true}>
            <MenuItem
              icon={<IconPackage size={16} stroke={1.5} />}
              label="Dependencies"
              href="/fabric/dependencies"
              active={isActive('/fabric/dependencies')}
            />
            <MenuItem
              icon={<IconFolder size={16} stroke={1.5} />}
              label="Projects"
              href="/fabric/projects"
              active={isActive('/fabric/projects')}
            />
          </MenuSection>
        </VStack>
      </nav>
    </aside>
  );
}

/* ----------------------------------------
   Capacity Bar
   ---------------------------------------- */

type CapacityTone = 'info' | 'warning' | 'danger';

function capacityTone(pct: number): CapacityTone {
  if (pct >= 80) return 'danger';
  if (pct >= 60) return 'warning';
  return 'info';
}

const toneToBadgeTheme = { info: 'green', warning: 'yellow', danger: 'red' } as const;

function CapacityRow({
  label,
  usageLabel,
  allocatableLabel,
  limitsLabel,
  pct,
}: {
  label: string;
  usageLabel: string;
  allocatableLabel: string;
  limitsLabel?: string;
  pct: number;
}) {
  const tone = capacityTone(pct);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-label-sm text-[var(--color-text-default)]">{label}</span>
        <Badge theme={toneToBadgeTheme[tone]} size="sm">
          {pct}%
        </Badge>
      </div>
      <ProgressBar value={pct} max={100} variant="quota" size="sm" showValue={false} />
      <div className="flex items-center gap-3 text-body-xs text-[var(--color-text-subtle)]">
        <span>{usageLabel}</span>
        <span>{allocatableLabel}</span>
        {limitsLabel && <span>{limitsLabel}</span>}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Dashboard Content
   ---------------------------------------- */

function DashboardContent() {
  return (
    <VStack gap={6}>
      {/* Row 1: Cluster + Project + Cluster Summary + Workload Metrics */}
      <div className="grid grid-cols-4 gap-4 items-stretch">
        {/* CLUSTER INFO */}
        <SectionCard className="bg-[var(--color-surface-subtle)]">
          <SectionCard.Header
            title="Cluster Info"
            titleClassName="text-heading-h6"
            showDivider={false}
          />
          <SectionCard.Content className="flex-1 flex flex-col">
            <VStack gap={3} className="flex-1">
              <span className="text-heading-h4 text-[var(--color-text-default)]">
                gpu-cluster-01
              </span>
              <div className="mt-auto">
                <div className="text-body-xs text-[var(--color-text-muted)] mb-1">ID</div>
                <span className="text-body-md text-[var(--color-text-default)]">cls-a1b2c3d4</span>
              </div>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        {/* PROJECT INFO */}
        <SectionCard className="bg-[var(--color-surface-subtle)]">
          <div className="flex items-baseline justify-between w-full">
            <span className="text-heading-h6 text-[var(--color-text-default)]">Project Info</span>
          </div>
          <SectionCard.Content className="flex-1 flex flex-col">
            <VStack gap={3} className="flex-1">
              <span className="text-heading-h4 text-[var(--color-text-default)]">proj-1</span>
              <div className="mt-auto">
                <div className="text-body-xs text-[var(--color-text-muted)] mb-1">Description</div>
                <span className="text-body-md text-[var(--color-text-default)]">
                  Development environment for the service backend services.
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-body-sm text-[var(--color-text-muted)]">
                  Type <span className="font-medium text-[var(--color-text-default)]">Team</span>
                </span>
                <span className="text-body-sm text-[var(--color-text-muted)]">
                  Tier <span className="font-medium text-[var(--color-text-default)]">Large</span>
                </span>
              </div>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        {/* CLUSTER SUMMARY */}
        <SectionCard className="flex flex-col">
          <SectionCard.Header
            title="Cluster Summary"
            titleClassName="text-heading-h6"
            showDivider={false}
          />
          <SectionCard.Content className="flex-1 flex flex-col justify-end">
            <MetricCard.Group className="grid grid-cols-2">
              <MetricCard title="Total nodes" value={15} />
              <MetricCard title="Total pods" value={993} />
              <MetricCard title="Updated pods" value={0} />
              <MetricCard title="GPU types" value={2} />
            </MetricCard.Group>
          </SectionCard.Content>
        </SectionCard>

        {/* WORKLOAD METRICS */}
        <SectionCard className="flex flex-col">
          <SectionCard.Header
            title="Workload Metrics"
            titleClassName="text-heading-h6"
            showDivider={false}
          />
          <SectionCard.Content className="flex-1 flex flex-col justify-end">
            <MetricCard.Group className="grid grid-cols-2">
              <MetricCard title="Running" value={12} />
              <MetricCard title="Pending" value={3} />
              <MetricCard title="Failed" value={1} />
              <MetricCard title="Completed" value={48} />
            </MetricCard.Group>
          </SectionCard.Content>
        </SectionCard>
      </div>

      {/* Row 2: Performance Metrics (full width) */}
      <SectionCard>
        <SectionCard.Header
          title="Performance Metrics"
          titleClassName="text-heading-h6"
          showDivider={false}
        />
        <SectionCard.Content>
          <MetricCard.Group>
            <MetricCard title="Queue wait time" value="0s" />
            <MetricCard title="Workloads per hour" value="0.00/h" />
            <MetricCard title="Completion rate" value="00 %" />
            <MetricCard title="Scheduling efficiency" value="00 %" />
          </MetricCard.Group>
        </SectionCard.Content>
      </SectionCard>

      {/* Row 3: Logical capacity + Physical capacity */}
      <div className="grid grid-cols-2 gap-4">
        {/* LOGICAL CAPACITY */}
        <SectionCard>
          <SectionCard.Header
            title="Logical capacity"
            titleClassName="text-heading-h6"
            showDivider={false}
          />
          <SectionCard.Content>
            <VStack gap={4}>
              <CapacityRow
                label="CPU"
                usageLabel="Usage: 75 cores/100 cores"
                allocatableLabel="Allocatable: 25 cores"
                limitsLabel="Limits: 75 cores"
                pct={90}
              />
              <CapacityRow
                label="Memory"
                usageLabel="Usage: 75 cores/100 cores"
                allocatableLabel="Allocatable: 25 cores"
                limitsLabel="Limits: 15 cores"
                pct={76}
              />
              <CapacityRow
                label="CPU limits"
                usageLabel="Limits: 76 cores/100 cores"
                allocatableLabel="Allocatable: 25 cores"
                limitsLabel="Overcommit ratio"
                pct={60}
              />
              <CapacityRow
                label="Memory limits"
                usageLabel="Usage: 75 cores/100 cores"
                allocatableLabel="Allocatable: 25 cores"
                limitsLabel="Overcommit ratio"
                pct={75}
              />
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        {/* PHYSICAL CAPACITY */}
        <SectionCard>
          <SectionCard.Header
            title="Physical capacity"
            titleClassName="text-heading-h6"
            showDivider={false}
          />
          <SectionCard.Content>
            <VStack gap={4}>
              <CapacityRow
                label="CPU"
                usageLabel="Usage: 75 cores/100 cores"
                allocatableLabel="Allocatable: 25 cores"
                pct={76}
              />
              <CapacityRow
                label="Memory"
                usageLabel="Usage: 75 cores/100 cores"
                allocatableLabel="Allocatable: 25 cores"
                pct={76}
              />
              <CapacityRow
                label="Disk"
                usageLabel="Usage: 75 cores/100 cores"
                allocatableLabel="Allocatable: 25 cores"
                pct={60}
              />
              <CapacityRow
                label="GPU"
                usageLabel="Usage: 75 cores/100 cores"
                allocatableLabel="Allocatable: 25 cores"
                pct={50}
              />
            </VStack>
          </SectionCard.Content>
        </SectionCard>
      </div>

      {/* Row 4: GPU resource summary */}
      <SectionCard>
        <SectionCard.Header
          title="GPU resource summary"
          titleClassName="text-heading-h6"
          showDivider={false}
        />
        <SectionCard.Content>
          <VStack gap={4}>
            <CapacityRow
              label="GPU"
              usageLabel="Usage: 2 GB / 6 GB"
              allocatableLabel="Requests: 3 GB"
              limitsLabel="Allocatable: 3 GB"
              pct={75}
            />
            <CapacityRow
              label="MIG-3G-5GB"
              usageLabel="Usage: 2 GB / 6 GB"
              allocatableLabel="Requests: 3 GB"
              limitsLabel="Allocatable: 3 GB"
              pct={79}
            />
          </VStack>
        </SectionCard.Content>
      </SectionCard>
    </VStack>
  );
}

/* ----------------------------------------
   Placeholder for sub-pages
   ---------------------------------------- */

function PlaceholderContent({ title }: { title: string }) {
  return (
    <EmptyState
      variant="inline"
      icon={<IconHammer size={48} stroke={1} />}
      title={`${title} — Coming soon`}
      description="This page is under construction."
    />
  );
}

/* ----------------------------------------
   Page Layout
   ---------------------------------------- */

function FabricPageLayout({
  title,
  breadcrumbItems,
  children,
}: {
  title: string;
  breadcrumbItems: { label: string; href?: string }[];
  children: ReactNode;
}) {
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
  const navigate = useNavigate();

  const tabBarTabs = useMemo(
    () => tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable })),
    [tabs]
  );

  const handleWindowClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <PageShell
      sidebar={<FabricSidebar />}
      sidebarWidth={200}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          showAddButton={true}
          showWindowControls={true}
          onWindowClose={handleWindowClose}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={false}
          showNavigation={true}
          canGoBack={false}
          canGoForward={false}
          onBack={() => {}}
          onForward={() => {}}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={3}>
        <PageHeader title={title} />
        {children}
      </VStack>
    </PageShell>
  );
}

/* ----------------------------------------
   Route → title mapping
   ---------------------------------------- */

const ROUTE_MAP: Record<string, string> = {
  '/fabric': 'Dashboard',
  '/fabric/kueue-queue': 'Kueue Queue',
  '/fabric/kueue-workloads': 'Kueue Workloads',
  '/fabric/kueue-analytics': 'Kueue Analytics',
  '/fabric/kueue-scheduler': 'Kueue Scheduler',
  '/fabric/kueue-alert': 'Kueue Alert',
  '/fabric/resource-inventory': 'Resource Inventory',
  '/fabric/audit-log': 'Audit Log',
  '/fabric/nodes': 'Nodes',
  '/fabric/usage-trend': 'Usage Trend',
  '/fabric/connected-clusters': 'Connected Clusters',
  '/fabric/settings': 'Settings',
  '/fabric/dependencies': 'Dependencies',
  '/fabric/projects': 'Projects',
};

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export default function FabricPage() {
  const location = useLocation();
  const title = ROUTE_MAP[location.pathname] || 'Fabric';

  const breadcrumbItems = [
    { label: 'Fabric', href: '/fabric' },
    ...(location.pathname !== '/fabric' ? [{ label: title }] : []),
  ];

  return (
    <FabricPageLayout title={title} breadcrumbItems={breadcrumbItems}>
      {location.pathname === '/fabric' ? (
        <DashboardContent />
      ) : (
        <PlaceholderContent title={title} />
      )}
    </FabricPageLayout>
  );
}
