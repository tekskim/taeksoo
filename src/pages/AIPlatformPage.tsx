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
  TableColumn,
  Pagination,
  SearchInput,
  Select,
  Badge,
  StatusIndicator,
} from '@/design-system';
import { useTabs } from '@/contexts/TabContext';
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
  IconPlus,
  IconCircleCheck,
  IconClock,
  IconAlertCircle,
  IconCube,
  IconHexagon,
  IconDotsVertical,
  IconCpu,
  IconCurrencyDollar,
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

// Mini Gauge Component for utilization display
function MiniGauge({ value, color = 'blue' }: { value: number; color?: 'blue' | 'green' | 'red' }) {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-emerald-500',
    red: 'text-red-500',
  };
  
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-[var(--color-border-subtle)]"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={colorClasses[color]}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${value}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <IconCpu size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </div>
      </div>
      <span className="text-[10px] text-[var(--color-text-subtle)]">{value}%</span>
    </div>
  );
}

// Workload Stats Card
interface WorkloadStatCardProps {
  icon: ReactNode;
  value: number;
  label: string;
  iconColor?: string;
  iconBgColor?: string;
}

function WorkloadStatCard({ icon, value, label, iconColor = 'text-[var(--color-text-muted)]', iconBgColor = 'bg-[var(--color-surface-subtle)]' }: WorkloadStatCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg">
      <div className={`w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center shrink-0`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <div>
        <p className="text-[20px] font-semibold text-[var(--color-text-default)]">{value}</p>
        <p className="text-[11px] text-[var(--color-text-subtle)]">{label}</p>
      </div>
    </div>
  );
}

function WorkloadsContent() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filter workloads
  const filteredWorkloads = useMemo(() => {
    return mockWorkloads.filter((workload) => {
      const matchesSearch = workload.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || workload.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredWorkloads.length / rowsPerPage);

  // Stats
  const stats = useMemo(() => ({
    total: mockWorkloads.length,
    running: mockWorkloads.filter(w => w.status === 'running').length,
    pending: mockWorkloads.filter(w => w.status === 'pending').length,
    failed: mockWorkloads.filter(w => w.status === 'failed').length,
    pods: mockWorkloads.length,
    helmCharts: 0,
  }), []);

  // Table columns
  const columns: TableColumn<Workload>[] = [
    {
      key: 'name',
      header: 'Name',
      width: '280px',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${
            row.status === 'running' ? 'bg-emerald-500' :
            row.status === 'pending' ? 'bg-amber-500' :
            row.status === 'failed' ? 'bg-red-500' : 'bg-gray-400'
          }`} />
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-[var(--color-text-default)]">{row.name}</span>
            <div className="flex items-center gap-2">
              <Badge variant={row.status === 'running' ? 'success' : row.status === 'failed' ? 'danger' : 'default'} size="sm">
                {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
              </Badge>
              <span className="text-[11px] text-[var(--color-text-subtle)]">{row.namespace}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'utilization',
      header: 'Utilization',
      width: '100px',
      align: 'center' as const,
      render: (_, row) => (
        row.utilization !== null ? (
          <MiniGauge value={row.utilization} color="blue" />
        ) : (
          <span className="text-[var(--color-text-subtle)]">-</span>
        )
      ),
    },
    {
      key: 'memory',
      header: 'Memory',
      width: '100px',
      align: 'center' as const,
      render: (_, row) => (
        row.memoryPercent !== null ? (
          <MiniGauge value={row.memoryPercent} color="green" />
        ) : (
          <div className="flex items-center gap-1.5">
            <IconCpu size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
            <span className="text-[12px] text-[var(--color-text-default)]">{row.memory}</span>
          </div>
        )
      ),
    },
    {
      key: 'disk',
      header: 'Disk',
      width: '100px',
      align: 'center' as const,
      render: (_, row) => (
        row.diskPercent !== null ? (
          <MiniGauge value={row.diskPercent} color={row.diskPercent > 90 ? 'red' : 'green'} />
        ) : (
          <span className="text-[var(--color-text-subtle)]">{row.disk}</span>
        )
      ),
    },
    {
      key: 'computeType',
      header: 'Compute Type',
      width: '120px',
      render: (_, row) => (
        row.computeType !== '-' ? (
          <div className="flex items-center gap-1.5">
            <IconCpu size={14} stroke={1.5} className="text-amber-500" />
            <span className="text-[12px] text-[var(--color-text-default)]">{row.computeType}</span>
          </div>
        ) : (
          <span className="text-[var(--color-text-subtle)]">-</span>
        )
      ),
    },
    {
      key: 'cost',
      header: 'Cost',
      width: '100px',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <IconCurrencyDollar size={14} stroke={1.5} className="text-emerald-500" />
          <span className="text-[12px] text-[var(--color-text-default)]">{row.cost.replace('$', '')}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '40px',
      align: 'center' as const,
      render: () => (
        <button className="p-1 rounded hover:bg-[var(--color-surface-subtle)] transition-colors">
          <IconDotsVertical size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
      ),
    },
  ];

  // Status options for filter
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'running', label: 'Running' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'stopped', label: 'Stopped' },
  ];

  const resourceOptions = [
    { value: 'all', label: 'All Resources' },
    { value: 'pod', label: 'Pods' },
    { value: 'helm', label: 'Helm Charts' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Sort by Newest' },
    { value: 'oldest', label: 'Sort by Oldest' },
    { value: 'name', label: 'Sort by Name' },
    { value: 'cost', label: 'Sort by Cost' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <WorkloadStatCard
          icon={<IconStack2 size={20} stroke={1.5} />}
          value={stats.total}
          label="Total"
          iconColor="text-[var(--color-action-primary)]"
          iconBgColor="bg-blue-50"
        />
        <WorkloadStatCard
          icon={<IconCircleCheck size={20} stroke={1.5} />}
          value={stats.running}
          label="Running"
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />
        <WorkloadStatCard
          icon={<IconClock size={20} stroke={1.5} />}
          value={stats.pending}
          label="Pending"
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50"
        />
        <WorkloadStatCard
          icon={<IconAlertCircle size={20} stroke={1.5} />}
          value={stats.failed}
          label="Failed"
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
        />
        <WorkloadStatCard
          icon={<IconCube size={20} stroke={1.5} />}
          value={stats.pods}
          label="Pods"
          iconColor="text-[var(--color-action-primary)]"
          iconBgColor="bg-blue-50"
        />
        <WorkloadStatCard
          icon={<IconHexagon size={20} stroke={1.5} />}
          value={stats.helmCharts}
          label="Helm Charts"
          iconColor="text-violet-600"
          iconBgColor="bg-violet-50"
        />
      </div>

      {/* Filters Section */}
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconSearch size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
          <span className="text-[13px] font-medium text-[var(--color-text-default)]">Filters</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-[280px]">
            <SearchInput
              placeholder="Search workload name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              size="sm"
              fullWidth
            />
          </div>
          <div className="w-[160px]">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              size="sm"
              fullWidth
            />
          </div>
          <div className="w-[160px]">
            <Select
              options={resourceOptions}
              value={resourceFilter}
              onChange={setResourceFilter}
              size="sm"
              fullWidth
            />
          </div>
          <div className="w-[160px]">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              size="sm"
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-3">
        {/* Pagination */}
        {filteredWorkloads.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredWorkloads.length}
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
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            leftIcon={<IconRefresh size={14} stroke={1.5} />}
            onClick={() => window.location.reload()}
          >
            Refresh Workloads
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<IconPlus size={14} stroke={1.5} />}
          >
            Deploy New Workload
          </Button>
        </div>
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

