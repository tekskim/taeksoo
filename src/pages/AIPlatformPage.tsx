import { useState, useMemo, useCallback, ReactNode } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  VStack,
  MenuItem,
  MenuSection,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Button,
  Table,
  type TableColumn,
  Pagination,
  FilterSearchInput,
  type FilterField,
  type AppliedFilter,
  ListToolbar,
  ContextMenu,
  type ContextMenuItem,
  StatusIndicator,
} from '@/design-system';
import { useTabs } from '@/contexts/TabContext';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectSelector } from '@/components/ProjectSelector';
import {
  IconLayoutDashboard,
  IconSearch,
  IconPackage,
  IconBrain,
  IconDatabase,
  IconStack2,
  IconTemplate,
  IconBox,
  IconBolt,
  IconSettings2,
  IconCode,
  IconGitBranch,
  IconBrandDocker,
  IconChartBar,
  IconSettings,
  IconHelp,
  IconServer,
  IconActivity,
  IconBoxModel,
  IconShield,
  IconChevronDown,
  IconApps,
  IconBell,
  IconPalette,
  IconRefresh,
  IconDotsCircleHorizontal,
  IconTarget,
  IconPlayerPause,
  IconAlertCircle,
} from '@tabler/icons-react';

/* ----------------------------------------
   AI Platform Logo Component
   ---------------------------------------- */
function AIPlatformLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.5 7.5L20 10L14.5 12.5L12 18L9.5 12.5L4 10L9.5 7.5L12 2Z" fill="url(#ai-gradient)" />
      <path d="M12 6L13.5 9.5L17 11L13.5 12.5L12 16L10.5 12.5L7 11L10.5 9.5L12 6Z" fill="#F472B6" />
      <defs>
        <linearGradient id="ai-gradient" x1="4" y1="2" x2="20" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A78BFA" />
          <stop offset="1" stopColor="#818CF8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ----------------------------------------
   AI Platform Sidebar Component
   ---------------------------------------- */
export function AIPlatformSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects, selectedProjectId, setSelectedProjectId } = useProject();

  // Check if current path matches href
  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (href !== '/ai-platform' && location.pathname.startsWith(href + '/')) return true;
    return false;
  };

  return (
    <aside className="w-[220px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0 z-50">
      {/* Header - Logo */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
        <Link to="/ai-platform" className="flex items-center gap-2">
          <AIPlatformLogo />
          <span className="font-semibold text-[14px] text-[var(--color-text-default)]">AI Platform</span>
        </Link>
        <button className="p-1.5 rounded-md border border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)] transition-colors">
          <IconApps size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
      </div>

      {/* Project Selector */}
      <div className="px-3 py-2">
        <ProjectSelector
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectSelect={setSelectedProjectId}
          variant="default"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto overflow-x-hidden sidebar-scroll">
        <VStack gap={1} className="w-full min-w-0">
          {/* Dashboard */}
          <MenuItem
            icon={<IconLayoutDashboard size={18} stroke={1.5} />}
            label="Dashboard"
            href="/ai-platform"
            active={isActive('/ai-platform') && location.pathname === '/ai-platform'}
          />

          {/* Explore */}
          <MenuItem
            icon={<IconSearch size={18} stroke={1.5} />}
            label="Explore"
            href="/ai-platform/explore"
            active={isActive('/ai-platform/explore')}
          />

          {/* Hub Section */}
          <MenuSection title="Hub" defaultOpen={true}>
            <MenuItem
              icon={<IconPackage size={18} stroke={1.5} />}
              label="Packages"
              href="/ai-platform/packages"
              active={isActive('/ai-platform/packages')}
            />
            <MenuItem
              icon={<IconBrain size={18} stroke={1.5} />}
              label="Models"
              href="/ai-platform/models"
              active={isActive('/ai-platform/models')}
            />
            <MenuItem
              icon={<IconDatabase size={18} stroke={1.5} />}
              label="Datasets"
              href="/ai-platform/datasets"
              active={isActive('/ai-platform/datasets')}
            />
          </MenuSection>

          {/* Infrastructure Section */}
          <MenuSection title="Infrastructure" defaultOpen={true}>
            <MenuItem
              icon={<IconStack2 size={18} stroke={1.5} />}
              label="Workloads"
              href="/ai-platform/workloads"
              active={isActive('/ai-platform/workloads')}
            />
            <MenuItem
              icon={<IconTemplate size={18} stroke={1.5} />}
              label="My Templates"
              href="/ai-platform/templates"
              active={isActive('/ai-platform/templates')}
            />
            <MenuItem
              icon={<IconBox size={18} stroke={1.5} />}
              label="Storage"
              href="/ai-platform/storage"
              active={isActive('/ai-platform/storage')}
            />
            <MenuItem
              icon={<IconBolt size={18} stroke={1.5} />}
              label="Serverless"
              href="/ai-platform/serverless"
              active={isActive('/ai-platform/serverless')}
            />
          </MenuSection>

          {/* MLOps Section */}
          <MenuSection title="MLOps" defaultOpen={true}>
            <MenuItem
              icon={<IconSettings2 size={18} stroke={1.5} />}
              label="Fine-Tune"
              href="/ai-platform/fine-tune"
              active={isActive('/ai-platform/fine-tune')}
            />
            <MenuItem
              icon={<IconCode size={18} stroke={1.5} />}
              label="DevSpace"
              href="/ai-platform/devspace"
              active={isActive('/ai-platform/devspace')}
            />
            <MenuItem
              icon={<IconGitBranch size={18} stroke={1.5} />}
              label="Pipeline"
              href="/ai-platform/pipeline"
              active={isActive('/ai-platform/pipeline')}
            />
            <MenuItem
              icon={<IconBrandDocker size={18} stroke={1.5} />}
              label="Kubeflow"
              href="/ai-platform/kubeflow"
              active={isActive('/ai-platform/kubeflow')}
            />
            <MenuItem
              icon={<IconBrandDocker size={18} stroke={1.5} />}
              label="MLflow"
              href="/ai-platform/mlflow"
              active={isActive('/ai-platform/mlflow')}
            />
            <MenuItem
              icon={<IconChartBar size={18} stroke={1.5} />}
              label="Benchmarks"
              href="/ai-platform/benchmarks"
              active={isActive('/ai-platform/benchmarks')}
            />
          </MenuSection>

          {/* Settings Section */}
          <MenuSection title="Settings" defaultOpen={true}>
            <MenuItem
              icon={<IconSettings size={18} stroke={1.5} />}
              label="Settings"
              href="/ai-platform/settings"
              active={isActive('/ai-platform/settings')}
            />
            <MenuItem
              icon={<IconHelp size={18} stroke={1.5} />}
              label="FAQ"
              href="/ai-platform/faq"
              active={isActive('/ai-platform/faq')}
            />
          </MenuSection>

          {/* Operations Section */}
          <MenuSection title="Operations" defaultOpen={true}>
            <MenuItem
              icon={<IconServer size={18} stroke={1.5} />}
              label="Kueue"
              href="/ai-platform/kueue"
              active={isActive('/ai-platform/kueue')}
            />
            <MenuItem
              icon={<IconActivity size={18} stroke={1.5} />}
              label="Monitoring"
              href="/ai-platform/monitoring"
              active={isActive('/ai-platform/monitoring')}
            />
            <MenuItem
              icon={<IconBoxModel size={18} stroke={1.5} />}
              label="Dependencies"
              href="/ai-platform/dependencies"
              active={isActive('/ai-platform/dependencies')}
            />
            <MenuItem
              icon={<IconShield size={18} stroke={1.5} />}
              label="System Administration"
              href="/ai-platform/admin"
              active={isActive('/ai-platform/admin')}
            />
          </MenuSection>
        </VStack>
      </nav>
    </aside>
  );
}

/* ----------------------------------------
   AI Platform Page Layout Types
   ---------------------------------------- */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AIPlatformPageLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumbItems: BreadcrumbItem[];
  showNavigation?: boolean;
  headerActions?: ReactNode;
  children: ReactNode;
  topBarActions?: ReactNode;
}

/* ----------------------------------------
   AI Platform Page Layout Component
   ---------------------------------------- */
export function AIPlatformPageLayout({
  title,
  subtitle,
  breadcrumbItems,
  showNavigation = true,
  headerActions,
  children,
  topBarActions,
}: AIPlatformPageLayoutProps) {
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
  const navigate = useNavigate();

  const tabBarTabs = useMemo(
    () =>
      tabs.map((tab) => ({
        id: tab.id,
        label: tab.label,
        closable: tab.closable,
      })),
    [tabs]
  );

  const handleWindowClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const defaultTopBarActions = useMemo(
    () => (
      <>
        <TopBarAction
          icon={<IconPalette size={16} stroke={1} />}
          onClick={() => navigate('/design-system')}
          aria-label="Design System"
        />
        <TopBarAction
          icon={<IconBell size={16} stroke={1} />}
          aria-label="Notifications"
          badge={true}
        />
      </>
    ),
    [navigate]
  );

  return (
    <div className="h-screen bg-[var(--color-surface-subtle)] flex w-full overflow-hidden">
      {/* Sidebar */}
      <AIPlatformSidebar />

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col h-screen bg-[var(--color-surface-default)] ml-[220px]">
        {/* TabBar - Fixed */}
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

        {/* TopBar - Fixed */}
        <TopBar
          showSidebarToggle={false}
          showNavigation={showNavigation}
          canGoBack={false}
          canGoForward={false}
          onBack={() => {}}
          onForward={() => {}}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          actions={topBarActions || defaultTopBarActions}
        />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="bg-[var(--color-surface-default)] flex flex-col gap-6 pb-[120px] pt-6 px-8 w-full">
            {/* Page Header */}
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start justify-center">
                <h4 className="text-[18px] leading-7 font-semibold text-[var(--color-text-default)]">
                  {title}
                </h4>
                {subtitle && (
                  <p className="text-[12px] text-[var(--color-text-subtle)] mt-0.5">{subtitle}</p>
                )}
              </div>
              {headerActions && (
                <div className="flex items-center gap-2">{headerActions}</div>
              )}
            </div>

            {/* Page Content */}
            <div className="flex flex-col gap-6 w-full">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ----------------------------------------
   Route Configuration for Breadcrumbs
   ---------------------------------------- */
interface RouteConfig {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  section?: string;
}

const routeConfigs: Record<string, RouteConfig> = {
  '/ai-platform': {
    title: 'Dashboard',
    subtitle: 'View cluster overview at a glance',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Dashboard' }],
  },
  '/ai-platform/explore': {
    title: 'Explore',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Explore' }],
  },
  // Hub
  '/ai-platform/packages': {
    title: 'Packages',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Hub' }, { label: 'Packages' }],
    section: 'Hub',
  },
  '/ai-platform/models': {
    title: 'Models',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Hub' }, { label: 'Models' }],
    section: 'Hub',
  },
  '/ai-platform/datasets': {
    title: 'Datasets',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Hub' }, { label: 'Datasets' }],
    section: 'Hub',
  },
  // Infrastructure
  '/ai-platform/workloads': {
    title: 'Workloads',
    subtitle: 'Pod and Helm Chart management',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Infrastructure' }, { label: 'Workloads' }],
    section: 'Infrastructure',
  },
  '/ai-platform/templates': {
    title: 'My Templates',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Infrastructure' }, { label: 'My Templates' }],
    section: 'Infrastructure',
  },
  '/ai-platform/storage': {
    title: 'Storage',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Infrastructure' }, { label: 'Storage' }],
    section: 'Infrastructure',
  },
  '/ai-platform/serverless': {
    title: 'Serverless',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Infrastructure' }, { label: 'Serverless' }],
    section: 'Infrastructure',
  },
  // MLOps
  '/ai-platform/fine-tune': {
    title: 'Fine-Tune',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'MLOps' }, { label: 'Fine-Tune' }],
    section: 'MLOps',
  },
  '/ai-platform/devspace': {
    title: 'DevSpace',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'MLOps' }, { label: 'DevSpace' }],
    section: 'MLOps',
  },
  '/ai-platform/pipeline': {
    title: 'Pipeline',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'MLOps' }, { label: 'Pipeline' }],
    section: 'MLOps',
  },
  '/ai-platform/kubeflow': {
    title: 'Kubeflow',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'MLOps' }, { label: 'Kubeflow' }],
    section: 'MLOps',
  },
  '/ai-platform/mlflow': {
    title: 'MLflow',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'MLOps' }, { label: 'MLflow' }],
    section: 'MLOps',
  },
  '/ai-platform/benchmarks': {
    title: 'Benchmarks',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'MLOps' }, { label: 'Benchmarks' }],
    section: 'MLOps',
  },
  // Settings
  '/ai-platform/settings': {
    title: 'Settings',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Settings' }],
    section: 'Settings',
  },
  '/ai-platform/faq': {
    title: 'FAQ',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Settings' }, { label: 'FAQ' }],
    section: 'Settings',
  },
  // Operations
  '/ai-platform/kueue': {
    title: 'Kueue',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Operations' }, { label: 'Kueue' }],
    section: 'Operations',
  },
  '/ai-platform/monitoring': {
    title: 'Monitoring',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Operations' }, { label: 'Monitoring' }],
    section: 'Operations',
  },
  '/ai-platform/dependencies': {
    title: 'Dependencies',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Operations' }, { label: 'Dependencies' }],
    section: 'Operations',
  },
  '/ai-platform/admin': {
    title: 'System Administration',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Operations' }, { label: 'System Administration' }],
    section: 'Operations',
  },
};

/* ----------------------------------------
   useRouteConfig Hook
   ---------------------------------------- */
function useRouteConfig(): RouteConfig {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Exact match
  if (routeConfigs[pathname]) {
    return routeConfigs[pathname];
  }
  
  // Default fallback
  return {
    title: 'Dashboard',
    breadcrumbs: [{ label: 'AI Platform', href: '/ai-platform' }, { label: 'Dashboard' }],
  };
}

/* ----------------------------------------
   Dashboard Sub-Components
   ---------------------------------------- */

// Resource Usage Card
interface ResourceCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

function ResourceCard({ icon, title, children }: ResourceCardProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-5 flex gap-4">
      <div className="w-12 h-12 rounded-lg bg-[var(--color-surface-subtle)] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-default)] mb-2">{title}</h3>
        {children}
      </div>
    </div>
  );
}

// Stat Card with Icon
interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  iconBgColor?: string;
}

function StatCard({ icon, value, label, iconBgColor = 'bg-[var(--color-surface-subtle)]' }: StatCardProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-[18px] font-semibold text-[var(--color-text-default)]">{value}</p>
        <p className="text-[11px] text-[var(--color-text-subtle)]">{label}</p>
      </div>
    </div>
  );
}

// Quick Action Card
interface QuickActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

function QuickActionCard({ icon, title, description, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-5 flex flex-col items-center text-center hover:border-[var(--color-border-strong)] hover:shadow-sm transition-all"
    >
      <div className="w-12 h-12 rounded-lg bg-[var(--color-surface-subtle)] flex items-center justify-center mb-3">
        {icon}
      </div>
      <h4 className="text-[14px] font-medium text-[var(--color-text-default)] mb-1">{title}</h4>
      <p className="text-[11px] text-[var(--color-text-subtle)]">{description}</p>
    </button>
  );
}

// Service Overview Card
interface ServiceOverviewCardProps {
  icon: ReactNode;
  count: number;
  label: string;
  onClick?: () => void;
}

function ServiceOverviewCard({ icon, count, label, onClick }: ServiceOverviewCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-5 flex flex-col items-center text-center hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-muted)] transition-all"
    >
      <div className="mb-3">{icon}</div>
      <p className="text-[18px] font-semibold text-[var(--color-text-default)]">{count}</p>
      <p className="text-[11px] text-[var(--color-text-subtle)]">{label}</p>
    </button>
  );
}

// Data Row for Resource Cards
interface DataRowProps {
  label: string;
  value: string | number;
}

function DataRow({ label, value }: DataRowProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[12px] text-[var(--color-text-subtle)]">{label}</span>
      <span className="text-[12px] font-medium text-[var(--color-text-default)]">{value}</span>
    </div>
  );
}

/* ----------------------------------------
   Page Content Components
   ---------------------------------------- */
function DashboardContent() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      {/* My Resource Usage & Queue Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ResourceCard
          icon={<IconStack2 size={24} stroke={1.5} className="text-[var(--color-action-primary)]" />}
          title="My Resource Usage"
        >
          <div className="space-y-1">
            <DataRow label="Running Jobs:" value={0} />
            <DataRow label="Pending Jobs:" value={0} />
            <DataRow label="Queue:" value="default" />
          </div>
        </ResourceCard>

        <ResourceCard
          icon={<IconActivity size={24} stroke={1.5} className="text-[var(--color-text-muted)]" />}
          title="Queue Status"
        >
          <div className="space-y-1">
            <DataRow label="My Pending Jobs:" value={0} />
            <DataRow label="My Running Jobs:" value={0} />
            <p className="text-[12px] font-medium text-[var(--color-text-default)] mt-2">No active jobs</p>
            <p className="text-[11px] text-[var(--color-text-subtle)]">You can start a new job now</p>
          </div>
        </ResourceCard>
      </div>

      {/* Resource Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<IconServer size={20} stroke={1.5} className="text-[var(--color-action-primary)]" />}
          value="15 / 15"
          label="Active Nodes"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          icon={<IconActivity size={20} stroke={1.5} className="text-emerald-600" />}
          value="65.6%"
          label="CPU (317 / 484 cores)"
          iconBgColor="bg-emerald-50"
        />
        <StatCard
          icon={<IconChartBar size={20} stroke={1.5} className="text-amber-600" />}
          value="42.2%"
          label="Memory GB (1568 / 3719 GB)"
          iconBgColor="bg-amber-50"
        />
        <StatCard
          icon={<IconBolt size={20} stroke={1.5} className="text-emerald-600" />}
          value="16 / 18"
          label="Active GPUs"
          iconBgColor="bg-emerald-50"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-[14px] font-semibold text-[var(--color-text-default)] mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon={<IconStack2 size={28} stroke={1.5} className="text-[var(--color-action-primary)]" />}
            title="Deploy New Workload"
            description="Deploy Pod or template"
            onClick={() => navigate('/ai-platform/workloads')}
          />
          <QuickActionCard
            icon={<IconBolt size={28} stroke={1.5} className="text-emerald-600" />}
            title="Serverless Endpoint"
            description="Create inference API"
            onClick={() => navigate('/ai-platform/serverless')}
          />
          <QuickActionCard
            icon={<IconSettings2 size={28} stroke={1.5} className="text-violet-600" />}
            title="Fine-tuning Job"
            description="Start model training"
            onClick={() => navigate('/ai-platform/fine-tune')}
          />
          <QuickActionCard
            icon={<IconActivity size={28} stroke={1.5} className="text-emerald-600" />}
            title="Detailed Monitoring"
            description="Check resource trends"
            onClick={() => navigate('/ai-platform/monitoring')}
          />
        </div>
      </div>

      {/* Service Overview */}
      <div>
        <h3 className="text-[14px] font-semibold text-[var(--color-text-default)] mb-3">Service Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ServiceOverviewCard
            icon={<IconStack2 size={28} stroke={1.5} className="text-[var(--color-action-primary)]" />}
            count={4}
            label="Workloads"
            onClick={() => navigate('/ai-platform/workloads')}
          />
          <ServiceOverviewCard
            icon={<IconTemplate size={28} stroke={1.5} className="text-[var(--color-action-primary)]" />}
            count={20}
            label="My Templates"
            onClick={() => navigate('/ai-platform/templates')}
          />
          <ServiceOverviewCard
            icon={<IconBox size={28} stroke={1.5} className="text-[var(--color-action-primary)]" />}
            count={40}
            label="Storage"
            onClick={() => navigate('/ai-platform/storage')}
          />
          <ServiceOverviewCard
            icon={<IconBolt size={28} stroke={1.5} className="text-emerald-600" />}
            count={7}
            label="Serverless"
            onClick={() => navigate('/ai-platform/serverless')}
          />
          <ServiceOverviewCard
            icon={<IconSettings2 size={28} stroke={1.5} className="text-violet-600" />}
            count={0}
            label="Fine-tuning"
            onClick={() => navigate('/ai-platform/fine-tune')}
          />
          <ServiceOverviewCard
            icon={<IconChartBar size={28} stroke={1.5} className="text-cyan-600" />}
            count={6}
            label="Benchmarks"
            onClick={() => navigate('/ai-platform/benchmarks')}
          />
          <ServiceOverviewCard
            icon={<IconDatabase size={28} stroke={1.5} className="text-[var(--color-action-primary)]" />}
            count={0}
            label="Datasets"
            onClick={() => navigate('/ai-platform/datasets')}
          />
          <ServiceOverviewCard
            icon={<IconBrain size={28} stroke={1.5} className="text-violet-600" />}
            count={0}
            label="Models"
            onClick={() => navigate('/ai-platform/models')}
          />
        </div>
      </div>

      {/* Recent Services */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <IconActivity size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
          <h3 className="text-[14px] font-semibold text-[var(--color-text-default)]">Recent Services</h3>
          <span className="text-[11px] text-[var(--color-text-subtle)]">(Last 24 hours)</span>
        </div>
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-8 flex items-center justify-center">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <IconActivity size={16} stroke={1.5} className="animate-spin" />
            <span className="text-[12px]">Loading services...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Workloads Page Content
   ---------------------------------------- */

// Mock workload data
interface Workload {
  id: string;
  name: string;
  status: 'running' | 'pending' | 'failed' | 'stopped';
  namespace: string;
  utilization: number | null;
  memory: string;
  memoryPercent: number | null;
  disk: string;
  diskPercent: number | null;
  computeType: string;
  cost: string;
}

const mockWorkloads: Workload[] = [
  {
    id: '1',
    name: 'presidio-pii-deid-eb9502cc',
    status: 'running',
    namespace: 'default',
    utilization: null,
    memory: '40960Mi',
    memoryPercent: null,
    disk: '-',
    diskPercent: null,
    computeType: 'gpu × 1',
    cost: '$0.89/hr',
  },
  {
    id: '2',
    name: 'audiocraft-f6c7d9c6',
    status: 'running',
    namespace: 'default',
    utilization: null,
    memory: '40960Mi',
    memoryPercent: null,
    disk: '-',
    diskPercent: null,
    computeType: 'gpu × 1',
    cost: '$0.89/hr',
  },
  {
    id: '3',
    name: 'llm-interview-eval-agent-78acdf18',
    status: 'running',
    namespace: 'default',
    utilization: 0,
    memory: '-',
    memoryPercent: 3,
    disk: '-',
    diskPercent: 100,
    computeType: '-',
    cost: '$0.1/hr',
  },
  {
    id: '4',
    name: 'prompt-optimizer-7a1cd6a9',
    status: 'running',
    namespace: 'default',
    utilization: 0,
    memory: '-',
    memoryPercent: 7,
    disk: '-',
    diskPercent: 100,
    computeType: '-',
    cost: '$0.1/hr',
  },
];

// Linear Usage Cell Component (matches existing PoolsPage pattern)
interface UsageCellProps {
  percent: number;
}

function UsageCell({ percent }: UsageCellProps) {
  // Determine color based on percentage thresholds
  const getStatusColor = (value: number): string => {
    if (value >= 95) return 'var(--color-state-danger)';
    if (value >= 85) return 'var(--color-state-warning)';
    return 'var(--color-state-success)';
  };

  return (
    <div className="flex flex-col gap-[var(--spacing-1)] w-full">
      <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
        {percent.toFixed(0)}%
      </span>
      <div className="h-1 w-full bg-[var(--color-border-subtle)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ 
            width: `${Math.min(percent, 100)}%`,
            backgroundColor: getStatusColor(percent),
          }}
        />
      </div>
    </div>
  );
}

// Status Card Component (matches Data sources pattern)
interface StatusCardProps {
  label: string;
  count: number;
  status: 'running' | 'pending' | 'failed' | 'stopped';
}

function StatusCard({ label, count, status }: StatusCardProps) {
  let bgColor = 'bg-[var(--color-surface-subtle,#f8fafc)]';
  let iconBg = 'bg-[var(--color-text-muted,#475569)]';
  
  if (status === 'running') {
    bgColor = 'bg-[var(--color-state-success-bg,#f0fdf4)]';
    iconBg = 'bg-[var(--color-success,#4ade80)]';
  } else if (status === 'failed') {
    bgColor = 'bg-[var(--color-state-danger-bg,#fef2f2)]';
    iconBg = 'bg-[var(--color-danger,#ef4444)]';
  } else if (status === 'pending') {
    bgColor = 'bg-[var(--color-info-weak-bg,#eff6ff)]';
    iconBg = 'bg-[var(--color-info,#3b82f6)]';
  }

  const getStatusIcon = () => {
    if (status === 'running') {
      return <IconTarget size={12} stroke={1} className="text-white" />;
    } else if (status === 'failed') {
      return <IconAlertCircle size={12} stroke={1} className="text-white" />;
    } else if (status === 'pending') {
      return <IconRefresh size={12} stroke={1} className="text-white" />;
    } else {
      return <IconPlayerPause size={12} stroke={1} className="text-white" />;
    }
  };

  return (
    <div className={`${bgColor} flex flex-[1_0_0] items-center justify-between min-h-px min-w-px px-4 py-3 relative rounded-lg shrink-0`}>
      <div className="flex flex-col gap-1.5 items-start leading-4 not-italic relative shrink-0">
        <p className="font-medium text-[length:var(--font-size-11)] leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
          {label}
        </p>
        <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
          {count}
        </p>
      </div>
      <div className={`${iconBg} flex gap-0 items-center justify-center p-1 relative rounded-2xl shrink-0 size-6`}>
        {getStatusIcon()}
      </div>
    </div>
  );
}

function WorkloadsContent() {
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Define filter fields for FilterSearchInput
  const filterFields: FilterField[] = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter workload name...',
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'running', label: 'Running' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' },
        { value: 'stopped', label: 'Stopped' },
      ],
    },
    {
      id: 'resource',
      label: 'Resource',
      type: 'select',
      options: [
        { value: 'gpu', label: 'GPU Usage' },
        { value: 'cpu', label: 'CPU Only' },
      ],
    },
    {
      id: 'namespace',
      label: 'Namespace',
      type: 'text',
      placeholder: 'Enter namespace...',
    },
  ];

  // Filter workloads based on applied filters
  const filteredWorkloads = useMemo(() => {
    return mockWorkloads.filter((workload) => {
      // Check each applied filter
      for (const filter of appliedFilters) {
        if (filter.fieldId === 'name') {
          if (!workload.name.toLowerCase().includes(filter.value.toLowerCase())) {
            return false;
          }
        }
        if (filter.fieldId === 'status') {
          if (workload.status !== filter.value) {
            return false;
          }
        }
        if (filter.fieldId === 'resource') {
          const hasGPU = workload.computeType.toLowerCase().includes('gpu');
          if (filter.value === 'gpu' && !hasGPU) return false;
          if (filter.value === 'cpu' && hasGPU) return false;
        }
        if (filter.fieldId === 'namespace') {
          if (!workload.namespace.toLowerCase().includes(filter.value.toLowerCase())) {
            return false;
          }
        }
      }
      return true;
    });
  }, [appliedFilters]);

  const totalPages = Math.ceil(filteredWorkloads.length / rowsPerPage);

  // Stats
  const stats = useMemo(() => ({
    running: mockWorkloads.filter(w => w.status === 'running').length,
    pending: mockWorkloads.filter(w => w.status === 'pending').length,
    failed: mockWorkloads.filter(w => w.status === 'failed').length,
    stopped: mockWorkloads.filter(w => w.status === 'stopped').length,
  }), []);

  // Status mapping for StatusIndicator
  const statusMap: Record<Workload['status'], 'active' | 'error' | 'building' | 'muted'> = {
    'running': 'active',
    'pending': 'building',
    'failed': 'error',
    'stopped': 'muted',
  };

  // Context menu items for workloads
  const getWorkloadContextMenuItems = (workload: Workload): ContextMenuItem[] => [
    { id: 'view-logs', label: 'View Logs', onClick: () => console.log('View logs:', workload.id) },
    { id: 'view-metrics', label: 'View Metrics', onClick: () => console.log('View metrics:', workload.id) },
    { id: 'restart', label: 'Restart', onClick: () => console.log('Restart:', workload.id) },
    { id: 'stop', label: 'Stop', status: 'danger', onClick: () => console.log('Stop:', workload.id) },
    { id: 'delete', label: 'Delete', status: 'danger', onClick: () => console.log('Delete:', workload.id) },
  ];

  // Table columns
  const columns: TableColumn<Workload>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center' as const,
      render: (_, row) => (
        <StatusIndicator status={statusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 2,
      render: (_, row) => (
        <div className="flex flex-col">
          <Link
            to={`/ai-platform/workloads/${row.id}`}
            className="text-[13px] font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-[11px] text-[var(--color-text-subtle)]">{row.namespace}</span>
        </div>
      ),
    },
    {
      key: 'utilization',
      label: 'Utilization',
      flex: 1,
      render: (_, row) => (
        row.utilization !== null ? (
          <UsageCell percent={row.utilization} />
        ) : (
          <span className="text-[var(--color-text-subtle)]">-</span>
        )
      ),
    },
    {
      key: 'memory',
      label: 'Memory',
      flex: 1,
      render: (_, row) => (
        row.memoryPercent !== null ? (
          <UsageCell percent={row.memoryPercent} />
        ) : (
          <span className="text-[var(--color-text-default)]">{row.memory}</span>
        )
      ),
    },
    {
      key: 'disk',
      label: 'Disk',
      flex: 1,
      render: (_, row) => (
        row.diskPercent !== null ? (
          <UsageCell percent={row.diskPercent} />
        ) : (
          <span className="text-[var(--color-text-subtle)]">{row.disk}</span>
        )
      ),
    },
    {
      key: 'computeType',
      label: 'Compute Type',
      flex: 1,
      render: (_, row) => (
        <span className={row.computeType !== '-' ? 'text-[var(--color-text-default)]' : 'text-[var(--color-text-subtle)]'}>
          {row.computeType}
        </span>
      ),
    },
    {
      key: 'cost',
      label: 'Cost',
      flex: 1,
      render: (_, row) => (
        <span className="text-[var(--color-text-default)]">{row.cost}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center' as const,
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getWorkloadContextMenuItems(row)} trigger="click">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
              <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Status Cards - Data sources pattern */}
      <div className="flex gap-2 items-center relative shrink-0 w-full">
        <StatusCard label="Running" count={stats.running} status="running" />
        <StatusCard label="Failed" count={stats.failed} status="failed" />
        <StatusCard label="Pending" count={stats.pending} status="pending" />
        <StatusCard label="Stopped" count={stats.stopped} status="stopped" />
      </div>

      {/* Filter Search Input */}
      <FilterSearchInput
        filters={filterFields}
        appliedFilters={appliedFilters}
        onFiltersChange={setAppliedFilters}
        placeholder="Find workloads with filters"
        size="sm"
        className="w-[400px]"
      />

      {/* List Toolbar - Actions only */}
      <ListToolbar
        primaryActions={
          <ListToolbar.Actions>
            <Button
              variant="secondary"
              size="sm"
              icon={<IconRefresh size={14} stroke={1.5} />}
              aria-label="Refresh"
              onClick={() => window.location.reload()}
            />
          </ListToolbar.Actions>
        }
      />

      {/* Pagination */}
      {filteredWorkloads.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredWorkloads.length}
          showSettings
          onSettingsClick={() => console.log('Settings clicked')}
        />
      )}

      {/* Table */}
      <Table<Workload>
        columns={columns}
        data={filteredWorkloads.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)}
        rowKey="id"
        emptyMessage="No workloads found"
      />
    </div>
  );
}

function PlaceholderContent({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center mb-4">
        <IconStack2 size={32} stroke={1} className="text-[var(--color-text-muted)]" />
      </div>
      <h3 className="text-[16px] font-medium text-[var(--color-text-default)] mb-2">{title}</h3>
      <p className="text-[14px] text-[var(--color-text-muted)]">This page is under construction.</p>
    </div>
  );
}

/* ----------------------------------------
   Main AI Platform Page Component
   ---------------------------------------- */
export function AIPlatformPage() {
  const location = useLocation();
  const routeConfig = useRouteConfig();

  // Render content based on current path
  const renderContent = () => {
    if (location.pathname === '/ai-platform') {
      return <DashboardContent />;
    }
    if (location.pathname === '/ai-platform/workloads') {
      return <WorkloadsContent />;
    }
    return <PlaceholderContent title={routeConfig.title} />;
  };

  // Header actions based on current page
  const getHeaderActions = () => {
    if (location.pathname === '/ai-platform') {
      return (
        <Button
          variant="secondary"
          size="md"
          leftIcon={<IconRefresh size={14} stroke={1.5} />}
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      );
    }
    if (location.pathname === '/ai-platform/workloads') {
      return (
        <Button variant="primary" size="md">
          Deploy Workload
        </Button>
      );
    }
    return null;
  };

  return (
    <AIPlatformPageLayout
      title={routeConfig.title}
      subtitle={routeConfig.subtitle}
      breadcrumbItems={routeConfig.breadcrumbs}
      headerActions={getHeaderActions()}
    >
      {renderContent()}
    </AIPlatformPageLayout>
  );
}

export default AIPlatformPage;

