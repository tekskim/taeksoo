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

function ServeSidebar({ onToggle }: { isOpen?: boolean; onToggle?: () => void }) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (href !== '/serve' && location.pathname.startsWith(href + '/')) return true;
    return false;
  };

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="serve" onToggleSidebar={onToggle} />

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pt-3 pb-6 sidebar-scroll">
        <VStack gap={2} className="w-full min-w-0">
          <MenuItem
            icon={<IconCube size={16} stroke={1.5} />}
            label="Dashboard"
            href="/serve"
            active={isActive('/serve') && location.pathname === '/serve'}
          />

          <MenuSection title="Deployments" defaultOpen={true}>
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Endpoints"
              href="/serve/endpoints"
              active={isActive('/serve/endpoints')}
            />
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Services"
              href="/serve/services"
              active={isActive('/serve/services')}
            />
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Revisions"
              href="/serve/revisions"
              active={isActive('/serve/revisions')}
            />
          </MenuSection>

          <MenuSection title="Monitoring" defaultOpen={true}>
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Metrics"
              href="/serve/metrics"
              active={isActive('/serve/metrics')}
            />
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Logs"
              href="/serve/logs"
              active={isActive('/serve/logs')}
            />
          </MenuSection>

          <MenuSection title="Infrastructure" defaultOpen={true}>
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Clusters"
              href="/serve/clusters"
              active={isActive('/serve/clusters')}
            />
          </MenuSection>

          <MenuSection title="Admin" defaultOpen={true}>
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Dependencies"
              href="/serve/dependencies"
              active={isActive('/serve/dependencies')}
            />
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Projects"
              href="/serve/projects"
              active={isActive('/serve/projects')}
            />
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Settings"
              href="/serve/settings"
              active={isActive('/serve/settings')}
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
        <MetricCard title="Active endpoints" value={8} />
        <MetricCard title="Total services" value={12} />
        <MetricCard title="Avg latency" value="45 ms" />
        <MetricCard title="Success rate" value="99.2 %" />
      </MetricCard.Group>

      <div className="grid grid-cols-2 gap-4">
        <SectionCard>
          <SectionCard.Header title="Resource Usage" />
          <SectionCard.Content>
            <VStack gap={4}>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-label-sm text-[var(--color-text-default)]">CPU</span>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">65%</span>
                </div>
                <ProgressBar value={65} variant="info" size="sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-label-sm text-[var(--color-text-default)]">Memory</span>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">42%</span>
                </div>
                <ProgressBar value={42} variant="info" size="sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-label-sm text-[var(--color-text-default)]">GPU</span>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">78%</span>
                </div>
                <ProgressBar value={78} variant="warning" size="sm" />
              </div>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        <SectionCard>
          <SectionCard.Header title="Recent Deployments" />
          <SectionCard.Content>
            <SectionCard.DataRow label="llama-3-endpoint" value="Running · 2h ago" />
            <SectionCard.DataRow label="whisper-v3-service" value="Running · 5h ago" />
            <SectionCard.DataRow label="embeddings-api" value="Scaling · 12h ago" />
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
  '/serve': 'Dashboard',
  '/serve/endpoints': 'Endpoints',
  '/serve/services': 'Services',
  '/serve/revisions': 'Revisions',
  '/serve/metrics': 'Metrics',
  '/serve/logs': 'Logs',
  '/serve/clusters': 'Clusters',
  '/serve/dependencies': 'Dependencies',
  '/serve/projects': 'Projects',
  '/serve/settings': 'Settings',
};

/* ----------------------------------------
   Main Page
   ---------------------------------------- */

export default function ServePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
  const title = ROUTE_MAP[location.pathname] || 'Serve';

  const tabBarTabs = useMemo(
    () => tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable })),
    [tabs]
  );
  const handleWindowClose = useCallback(() => navigate('/'), [navigate]);

  const breadcrumbItems = [
    { label: 'Serve', href: '/serve' },
    ...(location.pathname !== '/serve' ? [{ label: title }] : []),
  ];

  return (
    <PageShell
      sidebar={<ServeSidebar />}
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
        {location.pathname === '/serve' ? (
          <DashboardContent />
        ) : (
          <PlaceholderContent title={title} />
        )}
      </VStack>
    </PageShell>
  );
}
