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
import {
  IconLayoutDashboard,
  IconTerminal2,
  IconBrain,
  IconTable,
  IconGitBranch,
  IconActivity,
  IconDatabase,
  IconBox,
  IconSettings,
  IconFolder,
} from '@tabler/icons-react';

/* ----------------------------------------
   Sidebar
   ---------------------------------------- */

function MLStudioSidebar({ onToggle }: { isOpen?: boolean; onToggle?: () => void }) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (href !== '/ml-studio' && location.pathname.startsWith(href + '/')) return true;
    return false;
  };

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="ml-studio" onToggleSidebar={onToggle} />

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pt-3 pb-6 sidebar-scroll">
        <VStack gap={2} className="w-full min-w-0">
          <MenuItem
            icon={<IconLayoutDashboard size={16} stroke={1.5} />}
            label="Dashboard"
            href="/ml-studio"
            active={isActive('/ml-studio') && location.pathname === '/ml-studio'}
          />

          <MenuSection title="Workspace" defaultOpen={true}>
            <MenuItem
              icon={<IconTerminal2 size={16} stroke={1.5} />}
              label="DevSpace"
              href="/ml-studio/devspace"
              active={isActive('/ml-studio/devspace')}
            />
            <MenuItem
              icon={<IconGitBranch size={16} stroke={1.5} />}
              label="Pipelines"
              href="/ml-studio/pipelines"
              active={isActive('/ml-studio/pipelines')}
            />
          </MenuSection>

          <MenuSection title="Training" defaultOpen={true}>
            <MenuItem
              icon={<IconBrain size={16} stroke={1.5} />}
              label="Experiments"
              href="/ml-studio/experiments"
              active={isActive('/ml-studio/experiments')}
            />
            <MenuItem
              icon={<IconActivity size={16} stroke={1.5} />}
              label="Benchmarks"
              href="/ml-studio/benchmarks"
              active={isActive('/ml-studio/benchmarks')}
            />
            <MenuItem
              icon={<IconTable size={16} stroke={1.5} />}
              label="Tabular"
              href="/ml-studio/tabular"
              active={isActive('/ml-studio/tabular')}
            />
          </MenuSection>

          <MenuSection title="Assets" defaultOpen={true}>
            <MenuItem
              icon={<IconBrain size={16} stroke={1.5} />}
              label="Models"
              href="/ml-studio/models"
              active={isActive('/ml-studio/models')}
            />
            <MenuItem
              icon={<IconDatabase size={16} stroke={1.5} />}
              label="Datasets"
              href="/ml-studio/datasets"
              active={isActive('/ml-studio/datasets')}
            />
            <MenuItem
              icon={<IconBox size={16} stroke={1.5} />}
              label="Volumes"
              href="/ml-studio/volumes"
              active={isActive('/ml-studio/volumes')}
            />
          </MenuSection>

          <MenuSection title="Admin" defaultOpen={true}>
            <MenuItem
              icon={<IconFolder size={16} stroke={1.5} />}
              label="Projects"
              href="/ml-studio/projects"
              active={isActive('/ml-studio/projects')}
            />
            <MenuItem
              icon={<IconSettings size={16} stroke={1.5} />}
              label="Settings"
              href="/ml-studio/settings"
              active={isActive('/ml-studio/settings')}
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
        <MetricCard title="Active experiments" value={5} />
        <MetricCard title="Running pipelines" value={3} />
        <MetricCard title="Total models" value={24} />
        <MetricCard title="Datasets" value={18} />
      </MetricCard.Group>

      <div className="grid grid-cols-2 gap-4">
        <SectionCard>
          <SectionCard.Header title="Compute Resources" />
          <SectionCard.Content>
            <VStack gap={4}>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-label-sm text-[var(--color-text-default)]">CPU</span>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">54%</span>
                </div>
                <ProgressBar value={54} variant="info" size="sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-label-sm text-[var(--color-text-default)]">GPU</span>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">82%</span>
                </div>
                <ProgressBar value={82} variant="danger" size="sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-label-sm text-[var(--color-text-default)]">Memory</span>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">61%</span>
                </div>
                <ProgressBar value={61} variant="warning" size="sm" />
              </div>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        <SectionCard>
          <SectionCard.Header title="Recent Experiments" />
          <SectionCard.Content>
            <SectionCard.DataRow label="llama-3-finetune" value="Running · 1h ago" />
            <SectionCard.DataRow label="bert-classification" value="Completed · 3h ago" />
            <SectionCard.DataRow label="whisper-training" value="Queued · 6h ago" />
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
  '/ml-studio': 'Dashboard',
  '/ml-studio/devspace': 'DevSpace',
  '/ml-studio/pipelines': 'Pipelines',
  '/ml-studio/experiments': 'Experiments',
  '/ml-studio/benchmarks': 'Benchmarks',
  '/ml-studio/tabular': 'Tabular',
  '/ml-studio/models': 'Models',
  '/ml-studio/datasets': 'Datasets',
  '/ml-studio/volumes': 'Volumes',
  '/ml-studio/projects': 'Projects',
  '/ml-studio/settings': 'Settings',
};

/* ----------------------------------------
   Main Page
   ---------------------------------------- */

export default function MLStudioPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
  const title = ROUTE_MAP[location.pathname] || 'ML Studio';

  const tabBarTabs = useMemo(
    () => tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable })),
    [tabs]
  );
  const handleWindowClose = useCallback(() => navigate('/'), [navigate]);

  const breadcrumbItems = [
    { label: 'ML Studio', href: '/ml-studio' },
    ...(location.pathname !== '/ml-studio' ? [{ label: title }] : []),
  ];

  return (
    <PageShell
      sidebar={<MLStudioSidebar />}
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
        {location.pathname === '/ml-studio' ? (
          <DashboardContent />
        ) : (
          <PlaceholderContent title={title} />
        )}
      </VStack>
    </PageShell>
  );
}
