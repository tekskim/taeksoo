import { useMemo, useCallback } from 'react';
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
} from '@/design-system';
import { AppSwitcher } from '@/components/AppSwitcher';
import { useTabs } from '@/contexts/TabContext';
import { IconCube } from '@tabler/icons-react';

/* ----------------------------------------
   Sidebar
   ---------------------------------------- */

function RunSidebar({ onToggle }: { isOpen?: boolean; onToggle?: () => void }) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (href !== '/run' && location.pathname.startsWith(href + '/')) return true;
    return false;
  };

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="run" onToggleSidebar={onToggle} />

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pt-3 pb-6 sidebar-scroll">
        <VStack gap={2} className="w-full min-w-0">
          <MenuItem
            icon={<IconCube size={16} stroke={1.5} />}
            label="Dashboard"
            href="/run"
            active={isActive('/run') && location.pathname === '/run'}
          />

          <MenuSection title="Jobs" defaultOpen={true}>
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Active Runs"
              href="/run/active"
              active={isActive('/run/active')}
            />
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="All Runs"
              href="/run/all"
              active={isActive('/run/all')}
            />
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="History"
              href="/run/history"
              active={isActive('/run/history')}
            />
          </MenuSection>

          <MenuSection title="Queues" defaultOpen={true}>
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Queue Management"
              href="/run/queues"
              active={isActive('/run/queues')}
            />
          </MenuSection>

          <MenuSection title="Monitoring" defaultOpen={true}>
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Metrics"
              href="/run/metrics"
              active={isActive('/run/metrics')}
            />
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Logs"
              href="/run/logs"
              active={isActive('/run/logs')}
            />
          </MenuSection>

          <MenuSection title="Admin" defaultOpen={true}>
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Dependencies"
              href="/run/dependencies"
              active={isActive('/run/dependencies')}
            />
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Projects"
              href="/run/projects"
              active={isActive('/run/projects')}
            />
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Settings"
              href="/run/settings"
              active={isActive('/run/settings')}
            />
          </MenuSection>
        </VStack>
      </nav>
    </aside>
  );
}

/* ----------------------------------------
   Dashboard Content
   ---------------------------------------- */

function DashboardContent() {
  return (
    <div className="flex flex-col gap-6">
      <MetricCard.Group>
        <MetricCard title="Active runs" value={7} />
        <MetricCard title="Queued" value={12} />
        <MetricCard title="Completed (24h)" value={34} />
        <MetricCard title="Failed (24h)" value={2} />
      </MetricCard.Group>

      <div className="grid grid-cols-2 gap-4">
        <SectionCard>
          <SectionCard.Header title="Resource Utilization" />
          <SectionCard.Content>
            <VStack gap={4}>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-label-sm text-[var(--color-text-default)]">CPU</span>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">72%</span>
                </div>
                <ProgressBar value={72} variant="warning" size="sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-label-sm text-[var(--color-text-default)]">GPU</span>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">91%</span>
                </div>
                <ProgressBar value={91} variant="danger" size="sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-label-sm text-[var(--color-text-default)]">Memory</span>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">58%</span>
                </div>
                <ProgressBar value={58} variant="info" size="sm" />
              </div>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        <SectionCard>
          <SectionCard.Header title="Recent Runs" />
          <SectionCard.Content>
            <SectionCard.DataRow label="training-job-a1b2" value="Running · 30m ago" />
            <SectionCard.DataRow label="eval-pipeline-c3d4" value="Completed · 2h ago" />
            <SectionCard.DataRow label="data-prep-e5f6" value="Queued · 4h ago" />
          </SectionCard.Content>
        </SectionCard>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Placeholder
   ---------------------------------------- */

function PlaceholderContent({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-[400px] rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-default)]">
      <span className="text-body-md text-[var(--color-text-subtle)]">{title} — Coming soon</span>
    </div>
  );
}

/* ----------------------------------------
   Route → title
   ---------------------------------------- */

const ROUTE_MAP: Record<string, string> = {
  '/run': 'Dashboard',
  '/run/active': 'Active Runs',
  '/run/all': 'All Runs',
  '/run/history': 'History',
  '/run/queues': 'Queue Management',
  '/run/metrics': 'Metrics',
  '/run/logs': 'Logs',
  '/run/dependencies': 'Dependencies',
  '/run/projects': 'Projects',
  '/run/settings': 'Settings',
};

/* ----------------------------------------
   Main Page
   ---------------------------------------- */

export default function RunPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
  const title = ROUTE_MAP[location.pathname] || 'Run';

  const tabBarTabs = useMemo(
    () => tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable })),
    [tabs]
  );
  const handleWindowClose = useCallback(() => navigate('/'), [navigate]);

  const breadcrumbItems = [
    { label: 'Run', href: '/run' },
    ...(location.pathname !== '/run' ? [{ label: title }] : []),
  ];

  return (
    <PageShell
      sidebar={<RunSidebar />}
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
      <VStack gap={6}>
        <h4 className="text-heading-h4 text-[var(--color-text-default)]">{title}</h4>
        {location.pathname === '/run' ? <DashboardContent /> : <PlaceholderContent title={title} />}
      </VStack>
    </PageShell>
  );
}
