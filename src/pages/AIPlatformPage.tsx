import { useState, useMemo, useCallback, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate, Link, useSearchParams } from 'react-router-dom';
import aiPlatformLogoSrc from '@/assets/icons/ai-platform-logo.png';
import {
  VStack,
  HStack,
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
  PageShell,
  fixedColumns,
  columnMinWidths,
  PageHeader,
  SearchInput,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Drawer,
  FormField,
  Input,
  Select,
  Textarea,
  InfoBox,
  Badge,
  Chip,
} from '@/design-system';
import { useTabs } from '@/contexts/TabContext';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectSelector } from '@/components/ProjectSelector';
import {
  IconLayoutDashboard,
  IconBrain,
  IconDatabase,
  IconStack2,
  IconBolt,
  IconTerminal2,
  IconFileTextSpark,
  IconTable,
  IconGitBranch,
  IconActivity,
  IconSettings,
  IconLayoutSidebar,
  IconBell,
  IconHome,
  IconRefresh,
  IconPlayerPause,
  IconAlertCircle,
  IconCopy,
  IconChevronRight,
  IconCheck,
  IconBox,
  IconCode,
  IconFileText,
  IconTarget,
  IconDotsCircleHorizontal,
  IconTrash,
  IconX,
  IconClockHour4,
  IconChartGridDots,
  IconTopologyStar3,
  IconServerCog,
  IconHelp,
  IconUsersGroup,
  IconFolderOpen,
  IconExternalLink,
} from '@tabler/icons-react';
import { IconHardDriveFigma, IconPackagesFigma, IconFileFigma } from '@/design-system';
import { ArrowRightLeft } from 'lucide-react';

/* ----------------------------------------
   AI Platform Logo Component
   ---------------------------------------- */
function AIPlatformLogo() {
  return (
    <img src={aiPlatformLogoSrc} alt="AI Platform" width={24} height={24} className="shrink-0" />
  );
}

/* ----------------------------------------
   AI Platform Sidebar Component
   ---------------------------------------- */
/* ----------------------------------------
   Cluster Selector
   ---------------------------------------- */
const MOCK_CLUSTERS = [
  { id: 'cluster-a', name: 'A Cluster' },
  { id: 'cluster-b', name: 'B Cluster' },
];

function ClusterSelector({
  clusters,
  selectedId,
  onSelect,
}: {
  clusters: typeof MOCK_CLUSTERS;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = clusters.find((c) => c.id === selectedId);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-[6px] bg-[var(--color-surface-subtle)] px-2.5 py-1.5 transition-colors hover:bg-[var(--color-surface-muted)]"
      >
        <span className="text-label-sm text-[var(--color-text-default)]">
          {selected?.name || 'Select Cluster'}
        </span>
        <ArrowRightLeft
          size={12}
          strokeWidth={1.5}
          className="shrink-0 text-[var(--color-text-default)]"
        />
      </button>
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[100] flex flex-col gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-3 shadow-lg"
            style={{
              top: (buttonRef.current?.getBoundingClientRect().bottom ?? 0) + 4,
              left: buttonRef.current?.getBoundingClientRect().left ?? 0,
              width: Math.max(buttonRef.current?.getBoundingClientRect().width ?? 0, 200),
            }}
          >
            {clusters.map((c) => {
              const isSel = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelect(c.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors ${
                    isSel
                      ? 'border-2 border-[var(--color-action-primary)]'
                      : 'border border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)]'
                  }`}
                >
                  <span className="text-label-md text-[var(--color-text-default)]">{c.name}</span>
                  {isSel && (
                    <IconCheck
                      size={16}
                      className="text-[var(--color-action-primary)]"
                      stroke={1.5}
                    />
                  )}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}

export function AIPlatformSidebar(_props?: { isOpen?: boolean; onToggle?: () => void }) {
  const location = useLocation();
  const { projects, selectedProjectId, setSelectedProjectId } = useProject();
  const [selectedClusterId, setSelectedClusterId] = useState(MOCK_CLUSTERS[0].id);

  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (href !== '/ai-platform' && location.pathname.startsWith(href + '/')) return true;
    return false;
  };

  return (
    <aside className="flex h-screen w-[200px] flex-col border-r border-[var(--color-border-default)] bg-[var(--color-surface-default)] fixed left-0 top-0 z-50">
      {/* Header */}
      <div className="flex items-center border-b border-[var(--color-border-default)]">
        <div className="flex items-center px-2 py-1">
          <AIPlatformLogo />
        </div>
        <div className="flex flex-1 items-center justify-between pr-3 py-1">
          <Link
            to="/ai-platform"
            className="text-[14px] font-medium leading-[20px] text-[var(--color-text-default)]"
          >
            AI Platform
          </Link>
          <button className="rounded-[4px] p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]">
            <IconLayoutSidebar size={16} stroke={1.5} />
          </button>
        </div>
      </div>

      {/* Cluster + Project Selectors */}
      <div className="flex flex-col gap-2 px-3 pt-2">
        <ClusterSelector
          clusters={MOCK_CLUSTERS}
          selectedId={selectedClusterId}
          onSelect={setSelectedClusterId}
        />
        <ProjectSelector
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectSelect={setSelectedProjectId}
          primaryProjectId={primaryProjectId}
          onSetPrimary={setPrimaryProject}
          variant="default"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pt-3 pb-6 sidebar-scroll">
        <VStack gap={2} className="w-full min-w-0">
          <MenuItem
            icon={<IconLayoutDashboard size={16} stroke={1.5} />}
            label="Dashboard"
            href="/ai-platform"
            active={isActive('/ai-platform') && location.pathname === '/ai-platform'}
          />

          <MenuSection title="Hub" defaultOpen={true}>
            <MenuItem
              icon={<IconPackagesFigma size={16} />}
              label="Packages"
              href="/ai-platform/packages"
              active={isActive('/ai-platform/packages')}
            />
            <MenuItem
              icon={<IconBrain size={16} stroke={1.5} />}
              label="Models"
              href="/ai-platform/models"
              active={isActive('/ai-platform/models')}
            />
            <MenuItem
              icon={<IconHardDriveFigma size={16} />}
              label="Datasets"
              href="/ai-platform/datasets"
              active={isActive('/ai-platform/datasets')}
            />
          </MenuSection>

          <MenuSection title="Infrastructure" defaultOpen={true}>
            <MenuItem
              icon={<IconStack2 size={16} stroke={1.5} />}
              label="Workloads"
              href="/ai-platform/workloads"
              active={isActive('/ai-platform/workloads')}
            />
            <MenuItem
              icon={<IconFileFigma size={16} />}
              label="My templates"
              href="/ai-platform/my-templates"
              active={isActive('/ai-platform/my-templates')}
            />
            <MenuItem
              icon={<IconDatabase size={16} stroke={1.5} />}
              label="Volumes"
              href="/ai-platform/volumes"
              active={isActive('/ai-platform/volumes')}
            />
            <MenuItem
              icon={<IconBolt size={16} stroke={1.5} />}
              label="Serverless"
              href="/ai-platform/serverless"
              active={isActive('/ai-platform/serverless')}
            />
          </MenuSection>

          <MenuSection title="ML Studio" defaultOpen={true}>
            <MenuItem
              icon={<IconFileTextSpark size={16} stroke={1.5} />}
              label="Text generation"
              href="/ai-platform/text-generation"
              active={isActive('/ai-platform/text-generation')}
            />
            <MenuItem
              icon={<IconTable size={16} stroke={1.5} />}
              label="Tabular"
              href="/ai-platform/tabular"
              active={isActive('/ai-platform/tabular')}
              disabled
            />
          </MenuSection>

          <MenuSection title="MLOps" defaultOpen={true}>
            <MenuItem
              icon={<IconTerminal2 size={16} stroke={1.5} />}
              label="DevSpace"
              href="/ai-platform/devspace"
              active={isActive('/ai-platform/devspace')}
            />
            <MenuItem
              icon={<IconGitBranch size={16} stroke={1.5} />}
              label="Pipeline builder"
              href="/ai-platform/pipeline-builder"
              active={isActive('/ai-platform/pipeline-builder')}
            />
            <MenuItem
              icon={<IconActivity size={16} stroke={1.5} />}
              label="Benchmark"
              href="/ai-platform/benchmarks"
              active={isActive('/ai-platform/benchmarks')}
            />
            <MenuItem
              icon={<IconExternalLink size={16} stroke={1.5} />}
              label="Kubeflow"
              href="/ai-platform/kubeflow"
              active={isActive('/ai-platform/kubeflow')}
            />
            <MenuItem
              icon={<IconExternalLink size={16} stroke={1.5} />}
              label="MLflow"
              href="/ai-platform/mlflow"
              active={isActive('/ai-platform/mlflow')}
            />
          </MenuSection>

          <MenuSection title="Operations" defaultOpen={true}>
            <MenuItem
              icon={<IconClockHour4 size={16} stroke={1.5} />}
              label="Kueue"
              href="/ai-platform/kueue"
              active={isActive('/ai-platform/kueue')}
            />
            <MenuItem
              icon={<IconChartGridDots size={16} stroke={1.5} />}
              label="Monitoring"
              href="/ai-platform/monitoring"
              active={isActive('/ai-platform/monitoring')}
            />
            <MenuItem
              icon={<IconTopologyStar3 size={16} stroke={1.5} />}
              label="Dependencies"
              href="/ai-platform/dependencies"
              active={isActive('/ai-platform/dependencies')}
            />
            <MenuItem
              icon={<IconServerCog size={16} stroke={1.5} />}
              label="Cluster management"
              href="/ai-platform/system-admin"
              active={isActive('/ai-platform/system-admin')}
            />
          </MenuSection>

          <MenuSection title="Settings" defaultOpen={true}>
            <MenuItem
              icon={<IconSettings size={16} stroke={1.5} />}
              label="Account"
              href="/ai-platform/settings"
              active={isActive('/ai-platform/settings')}
            />
            <MenuItem
              icon={<IconHelp size={16} stroke={1.5} />}
              label="FAQ"
              href="/ai-platform/faq"
              active={isActive('/ai-platform/faq')}
            />
          </MenuSection>

          <MenuSection title="Admin management" defaultOpen={true}>
            <MenuItem
              icon={<IconUsersGroup size={16} stroke={1.5} />}
              label="Groups"
              href="/ai-platform/groups"
              active={isActive('/ai-platform/groups')}
            />
            <MenuItem
              icon={<IconFolderOpen size={16} stroke={1.5} />}
              label="Projects"
              href="/ai-platform/projects"
              active={isActive('/ai-platform/projects')}
            />
          </MenuSection>
        </VStack>
      </OverlayScrollbarsComponent>
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
  /** When false, hides the in-content page title row (breadcrumb TopBar unchanged). */
  showPageTitle?: boolean;
  headerActions?: ReactNode;
  children: ReactNode;
  topBarActions?: ReactNode;
  contentClassName?: string;
}

/* ----------------------------------------
   AI Platform Page Layout Component
   ---------------------------------------- */
export function AIPlatformPageLayout({
  title,
  subtitle,
  breadcrumbItems,
  showNavigation = true,
  showPageTitle = true,
  headerActions,
  children,
  topBarActions,
  contentClassName = 'pt-4 px-8 pb-20',
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
          icon={<IconHome size={16} stroke={1.5} />}
          onClick={() => navigate('/')}
          aria-label="Home"
        />
        <TopBarAction
          icon={<IconBell size={16} stroke={1.5} />}
          aria-label="Notifications"
          badge={true}
        />
      </>
    ),
    [navigate]
  );

  return (
    <PageShell
      sidebar={<AIPlatformSidebar />}
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
          showNavigation={showNavigation}
          canGoBack={false}
          canGoForward={false}
          onBack={() => {}}
          onForward={() => {}}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          actions={topBarActions || defaultTopBarActions}
        />
      }
      contentClassName={contentClassName}
    >
      <VStack gap={6}>
        {/* Page Header */}
        {showPageTitle && (
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-start justify-center">
              <h4 className="text-heading-h4 text-[var(--color-text-default)]">{title}</h4>
              {subtitle && (
                <p className="text-body-md text-[var(--color-text-subtle)] mt-0.5">{subtitle}</p>
              )}
            </div>
            {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
          </div>
        )}

        {/* Page Content */}
        <div className="flex flex-col gap-6 w-full">{children}</div>
      </VStack>
    </PageShell>
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
    breadcrumbs: [{ label: 'Dashboard' }],
  },
  '/ai-platform/explore': {
    title: 'Explore',
    breadcrumbs: [{ label: 'Explore' }],
  },
  // Hub
  '/ai-platform/packages': {
    title: 'Packages',
    breadcrumbs: [{ label: 'Packages' }],
    section: 'Hub',
  },
  '/ai-platform/models/registry': {
    title: 'Registry',
    breadcrumbs: [{ label: 'Models', href: '/ai-platform/models' }, { label: 'Registry' }],
    section: 'Hub',
  },
  '/ai-platform/models/compare': {
    title: 'Compare',
    subtitle:
      'Select a model category and two models to compare their training configuration, metrics, and loss curves.',
    breadcrumbs: [
      { label: 'Models', href: '/ai-platform/models' },
      { label: 'Registry', href: '/ai-platform/models/registry' },
    ],
    section: 'Hub',
  },
  '/ai-platform/datasets': {
    title: 'Datasets',
    breadcrumbs: [{ label: 'Datasets' }],
    section: 'Hub',
  },
  // Infrastructure
  '/ai-platform/workloads': {
    title: 'Workloads',
    subtitle: 'Pod and Helm Chart management',
    breadcrumbs: [{ label: 'Infrastructure' }, { label: 'Workloads' }],
    section: 'Infrastructure',
  },
  '/ai-platform/my-templates': {
    title: 'My Templates',
    breadcrumbs: [{ label: 'Infrastructure' }, { label: 'My Templates' }],
    section: 'Infrastructure',
  },
  '/ai-platform/volumes': {
    title: 'Volumes',
    breadcrumbs: [{ label: 'Infrastructure' }, { label: 'Volumes' }],
    section: 'Infrastructure',
  },
  '/ai-platform/serverless': {
    title: 'Serverless',
    breadcrumbs: [{ label: 'Infrastructure' }, { label: 'Serverless' }],
    section: 'Infrastructure',
  },
  // MLOps
  '/ai-platform/fine-tune': {
    title: 'Fine-Tune',
    breadcrumbs: [{ label: 'MLOps' }, { label: 'Fine-Tune' }],
    section: 'MLOps',
  },
  '/ai-platform/devspace': {
    title: 'DevSpace',
    breadcrumbs: [{ label: 'MLOps' }, { label: 'DevSpace' }],
    section: 'MLOps',
  },
  '/ai-platform/pipeline': {
    title: 'Pipeline',
    breadcrumbs: [{ label: 'MLOps' }, { label: 'Pipeline' }],
    section: 'MLOps',
  },
  '/ai-platform/kubeflow': {
    title: 'Kubeflow',
    breadcrumbs: [{ label: 'MLOps' }, { label: 'Kubeflow' }],
    section: 'MLOps',
  },
  '/ai-platform/mlflow': {
    title: 'MLflow',
    breadcrumbs: [{ label: 'MLOps' }, { label: 'MLflow' }],
    section: 'MLOps',
  },
  '/ai-platform/benchmarks': {
    title: 'Benchmarks',
    breadcrumbs: [{ label: 'MLOps' }, { label: 'Benchmarks' }],
    section: 'MLOps',
  },
  // Settings
  '/ai-platform/settings': {
    title: 'Settings',
    breadcrumbs: [{ label: 'Settings' }],
    section: 'Settings',
  },
  '/ai-platform/faq': {
    title: 'FAQ',
    breadcrumbs: [{ label: 'Settings' }, { label: 'FAQ' }],
    section: 'Settings',
  },
  // Operations
  '/ai-platform/kueue': {
    title: 'Kueue',
    breadcrumbs: [{ label: 'Operations' }, { label: 'Kueue' }],
    section: 'Operations',
  },
  '/ai-platform/monitoring': {
    title: 'Monitoring',
    breadcrumbs: [{ label: 'Operations' }, { label: 'Monitoring' }],
    section: 'Operations',
  },
  '/ai-platform/dependencies': {
    title: 'Dependencies',
    breadcrumbs: [{ label: 'Operations' }, { label: 'Dependencies' }],
    section: 'Operations',
  },
  '/ai-platform/admin': {
    title: 'System Administration',
    breadcrumbs: [{ label: 'Operations' }, { label: 'System Administration' }],
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
    breadcrumbs: [{ label: 'Dashboard' }],
  };
}

/* ----------------------------------------
   Dashboard (Figma-aligned sub-components)
   ---------------------------------------- */

const DASHBOARD_PROJECT = {
  name: 'proj-1',
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  description: "Development environment for the 'service' backend services.",
};

type GaugeTone = 'success' | 'warning' | 'danger';

function StatusPctBadge({ pct, tone }: { pct: number; tone: GaugeTone }) {
  const dotColor = tone === 'success' ? '#22C55E' : tone === 'warning' ? '#F97316' : '#EF4444';
  const pillBg = tone === 'success' ? '#DCFCE7' : tone === 'warning' ? '#FFEDD5' : '#FEE2E2';

  return (
    <span
      className="inline-flex items-center gap-1 rounded-[var(--radius-md)] px-1.5 py-0.5 font-medium"
      style={{ backgroundColor: pillBg, color: dotColor }}
    >
      <span
        className="inline-block h-2 w-2 shrink-0 rounded-[5px]"
        style={{ backgroundColor: dotColor }}
        aria-hidden
      />
      <span className="text-body-sm">{pct}%</span>
    </span>
  );
}

function ResourceGaugeCell({
  title,
  href,
  pct,
  fraction,
  tone,
}: {
  title: string;
  href: string;
  pct: number;
  fraction: string;
  tone: GaugeTone;
}) {
  const barColor = 'bg-[#475569]';

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-[8px] bg-[#f9fafb] px-5 py-4">
      <div className="flex items-center justify-between">
        <Link
          to={href}
          className="flex items-center gap-0 text-label-sm text-[var(--color-text-subtle)] hover:underline"
        >
          {title}
          <IconChevronRight size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
        </Link>
        <StatusPctBadge pct={pct} tone={tone} />
      </div>
      <div className="h-1 w-full overflow-hidden rounded-[2px] bg-[var(--color-border-default)]">
        <div className={`h-full rounded-[100px] ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-label-sm text-[var(--color-text-subtle)]">{fraction}</span>
    </div>
  );
}

function DashboardServiceTile({
  icon,
  title,
  valueDisplay,
  href,
}: {
  icon: ReactNode;
  title: string;
  valueDisplay: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="block rounded-[8px] border-2 border-transparent bg-[#f9fafb] px-4 py-3 transition-colors hover:border-[var(--color-action-primary)] hover:bg-[var(--color-surface-muted)]"
    >
      <div className="flex min-w-0 items-center gap-1">
        <span className="shrink-0">{icon}</span>
        <span className="flex min-w-0 items-center gap-0 text-label-sm text-[var(--color-text-subtle)]">
          {title}
          <IconChevronRight
            size={16}
            stroke={1.5}
            className="shrink-0 text-[var(--color-text-subtle)]"
          />
        </span>
      </div>
      <p className="mt-1.5 text-[20px] font-medium leading-[28px] text-[var(--color-text-default)]">
        {valueDisplay}
      </p>
    </Link>
  );
}

/* ----------------------------------------
   Page Content Components
   ---------------------------------------- */
function DashboardContent() {
  const activities: {
    name: string;
    category: 'workload' | 'serverless';
    status: 'pending' | 'running';
    time: string;
  }[] = [
    { name: 'nginx-6e0f770f', category: 'workload', status: 'pending', time: '3hours ago' },
    { name: 'nginx-ff98data7', category: 'workload', status: 'running', time: '3hours ago' },
    { name: 'nginx-fedd07', category: 'workload', status: 'running', time: '10hours ago' },
    { name: 'docker-test', category: 'serverless', status: 'running', time: '15hours ago' },
    { name: 'test-t', category: 'serverless', status: 'pending', time: '22hours ago' },
  ];

  const queueRunning = '{N}';
  const queuePending = '{N}';
  const kueueRunning = '{N}';
  const kueuePending = '{N}';

  const copyProjectId = () => {
    void navigator.clipboard?.writeText(DASHBOARD_PROJECT.id);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top row: 4 cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* PROJECT INFO — gray fill bg */}
        <div className="flex min-w-0 flex-col justify-between rounded-[16px] border border-[var(--color-border-default)] bg-[#f9fafb] p-[25px]">
          <div className="flex flex-col gap-4">
            <p className="text-label-md font-medium text-[var(--color-text-muted)]">PROJECT INFO</p>
            <p className="text-heading-h2 text-[var(--color-text-default)]">
              {DASHBOARD_PROJECT.name}
            </p>
          </div>
          <div className="flex flex-col gap-4 pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-body-xs text-[var(--color-text-subtle)]">ID</span>
              <div className="flex items-center gap-1">
                <span className="min-w-0 truncate text-body-md text-[var(--color-text-default)]">
                  {DASHBOARD_PROJECT.id}
                </span>
                <button
                  type="button"
                  className="shrink-0 rounded-[var(--radius-sm)] p-1 text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-hover)]"
                  aria-label="Copy project ID"
                  onClick={copyProjectId}
                >
                  <IconCopy size={13} stroke={1} />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-body-xs text-[var(--color-text-subtle)]">Description</span>
              <p className="text-body-md text-[var(--color-text-default)]">
                {DASHBOARD_PROJECT.description}
              </p>
            </div>
          </div>
        </div>

        {/* QUEUE STATUS — white bg, inner cards gray fill */}
        <div className="flex min-w-0 flex-col justify-between rounded-[16px] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-6">
          <p className="text-label-md font-medium text-[var(--color-text-muted)]">QUEUE STATUS</p>
          <div className="flex flex-col gap-2 pt-4">
            <div className="flex h-[78px] items-center rounded-[8px] bg-[#f9fafb] px-4 py-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Title</span>
                <span className="text-body-md text-[var(--color-text-default)]">{'{Value}'}</span>
              </div>
            </div>
            <div className="rounded-[8px] bg-[#f9fafb] px-4 py-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Running Jobs</span>
                <span className="text-heading-h4 text-[#16a34a]">{queueRunning}</span>
              </div>
            </div>
            <div className="rounded-[8px] bg-[#f9fafb] px-4 py-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Pending Jobs</span>
                <span className="text-heading-h4 text-[#ea580c]">{queuePending}</span>
              </div>
            </div>
          </div>
        </div>

        {/* KUEUE JOB STATUS — white bg, inner cards gray fill */}
        <div className="flex min-w-0 flex-col justify-between rounded-[16px] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-6">
          <p className="text-label-md font-medium text-[var(--color-text-muted)]">
            KUEUE JOB STATUS
          </p>
          <div className="flex flex-col gap-2 pt-4">
            <div className="flex h-[78px] items-center rounded-[8px] bg-[#f9fafb] px-4 py-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Queue</span>
                <span className="text-body-md text-[var(--color-text-default)]">{'{Value}'}</span>
              </div>
            </div>
            <div className="rounded-[8px] bg-[#f9fafb] px-4 py-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Running Jobs</span>
                <span className="text-heading-h4 text-[#16a34a]">{kueueRunning}</span>
              </div>
            </div>
            <div className="rounded-[8px] bg-[#f9fafb] px-4 py-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Pending Jobs</span>
                <span className="text-heading-h4 text-[#ea580c]">{kueuePending}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITIES — white bg */}
        <div className="flex min-w-0 flex-col rounded-[16px] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-6">
          <p className="text-label-sm font-medium text-[var(--color-text-muted)]">
            RECENT ACTIVITIES
          </p>
          <div className="mt-6 flex flex-1 flex-col">
            {activities.map((a, i) => (
              <div
                key={`${a.name}-${i}`}
                className={`flex items-center justify-between py-[10px] ${i < activities.length - 1 ? 'border-b border-[var(--color-border-subtle)]' : ''}`}
              >
                <div className="min-w-0">
                  <Link
                    to="/ai-platform/workloads"
                    className="text-body-md font-medium text-[var(--color-action-primary)] hover:underline"
                  >
                    {a.name}
                  </Link>
                  <div className="flex items-center gap-1.5 text-body-sm text-[var(--color-text-subtle)]">
                    <span>{a.category}</span>
                    <span className="text-[var(--color-border-default)]">|</span>
                    <span>{a.status}</span>
                  </div>
                </div>
                <span className="shrink-0 text-body-sm text-[var(--color-text-subtle)]">
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RESOURCE OVERVIEW */}
      <div className="rounded-[16px] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-6">
        <p className="text-label-md font-medium uppercase text-[var(--color-text-muted)]">
          RESOURCE OVERVIEW
        </p>
        <div className="mt-6 grid grid-cols-4 gap-4">
          <ResourceGaugeCell
            title="Active nodes"
            href="/ai-platform/monitoring"
            pct={91}
            fraction="8/10"
            tone="success"
          />
          <ResourceGaugeCell
            title="CPU"
            href="/ai-platform/monitoring"
            pct={10}
            fraction="4/10"
            tone="success"
          />
          <ResourceGaugeCell
            title="Memory GB"
            href="/ai-platform/monitoring"
            pct={50}
            fraction="8/10"
            tone="warning"
          />
          <ResourceGaugeCell
            title="Active GPUs"
            href="/ai-platform/monitoring"
            pct={100}
            fraction="4/10"
            tone="danger"
          />
        </div>
      </div>

      {/* SERVICE OVERVIEW */}
      <div className="rounded-[16px] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-6">
        <p className="text-label-md font-medium uppercase text-[var(--color-text-muted)]">
          SERVICE OVERVIEW
        </p>
        <div className="mt-6 grid grid-cols-4 gap-4">
          <DashboardServiceTile
            icon={<IconStack2 size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />}
            title="Workloads"
            valueDisplay="00.0"
            href="/ai-platform/workloads"
          />
          <DashboardServiceTile
            icon={<IconBox size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />}
            title="Volumes"
            valueDisplay="8"
            href="/ai-platform/volumes"
          />
          <DashboardServiceTile
            icon={<IconBolt size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />}
            title="Serverless"
            valueDisplay="8"
            href="/ai-platform/serverless"
          />
          <DashboardServiceTile
            icon={<IconCode size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />}
            title="Dev Spaces"
            valueDisplay="8"
            href="/ai-platform/dev-spaces"
          />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <DashboardServiceTile
            icon={<IconBrain size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />}
            title="Models"
            valueDisplay="8"
            href="/ai-platform/models"
          />
          <DashboardServiceTile
            icon={
              <IconDatabase size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
            }
            title="Datasets"
            valueDisplay="8"
            href="/ai-platform/datasets"
          />
          <DashboardServiceTile
            icon={
              <IconFileText size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
            }
            title="Text Generation"
            valueDisplay="8"
            href="/ai-platform/text-generation"
          />
          <DashboardServiceTile
            icon={<IconTable size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />}
            title="Tabular"
            valueDisplay="8"
            href="/ai-platform/tabular"
          />
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
  let bgColor = 'bg-[var(--color-surface-subtle)]';
  let iconBg = 'bg-[var(--color-text-muted)]';

  if (status === 'running') {
    bgColor = 'bg-[var(--color-state-success-bg)]';
    iconBg = 'bg-[var(--color-state-success)]';
  } else if (status === 'failed') {
    bgColor = 'bg-[var(--color-state-danger-bg)]';
    iconBg = 'bg-[var(--color-state-danger)]';
  } else if (status === 'pending') {
    bgColor = 'bg-[var(--color-info-weak-bg)]';
    iconBg = 'bg-[var(--color-state-info)]';
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
    <div
      className={`${bgColor} flex flex-[1_0_0] items-center justify-between min-h-px min-w-px px-4 py-3 relative rounded-lg shrink-0`}
    >
      <div className="flex flex-col gap-1.5 items-start leading-4 not-italic relative shrink-0">
        <p className="text-label-sm text-[var(--color-text-subtle)]">{label}</p>
        <p className="text-body-md text-[var(--color-text-default)]">{count}</p>
      </div>
      <div
        className={`${iconBg} flex gap-0 items-center justify-center p-1 relative rounded-2xl shrink-0 size-6`}
      >
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
  const stats = useMemo(
    () => ({
      running: mockWorkloads.filter((w) => w.status === 'running').length,
      pending: mockWorkloads.filter((w) => w.status === 'pending').length,
      failed: mockWorkloads.filter((w) => w.status === 'failed').length,
      stopped: mockWorkloads.filter((w) => w.status === 'stopped').length,
    }),
    []
  );

  // Status mapping for StatusIndicator
  const statusMap: Record<Workload['status'], 'active' | 'error' | 'building' | 'muted'> = {
    running: 'active',
    pending: 'building',
    failed: 'error',
    stopped: 'muted',
  };

  // Context menu items for workloads
  const getWorkloadContextMenuItems = (workload: Workload): ContextMenuItem[] => [
    { id: 'view-logs', label: 'View logs', onClick: () => console.log('View logs:', workload.id) },
    {
      id: 'view-metrics',
      label: 'View metrics',
      onClick: () => console.log('View metrics:', workload.id),
    },
    { id: 'restart', label: 'Restart', onClick: () => console.log('Restart:', workload.id) },
    {
      id: 'stop',
      label: 'Stop',
      status: 'danger',
      onClick: () => console.log('Stop:', workload.id),
    },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete:', workload.id),
    },
  ];

  // Table columns
  const columns: TableColumn<Workload>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center' as const,
      render: (_, row) => <StatusIndicator layout="icon-only" status={statusMap[row.status]} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (_, row) => (
        <div className="flex flex-col">
          <Link
            to={`/ai-platform/workloads/${row.id}`}
            className="text-label-lg text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">{row.namespace}</span>
        </div>
      ),
    },
    {
      key: 'utilization',
      label: 'Utilization',
      flex: 1,
      minWidth: columnMinWidths.usagePercent,
      render: (_, row) =>
        row.utilization !== null ? (
          <UsageCell percent={row.utilization} />
        ) : (
          <span className="text-[var(--color-text-subtle)]">-</span>
        ),
    },
    {
      key: 'memory',
      label: 'Memory',
      flex: 1,
      minWidth: columnMinWidths.memory,
      render: (_, row) =>
        row.memoryPercent !== null ? (
          <UsageCell percent={row.memoryPercent} />
        ) : (
          <span className="text-[var(--color-text-default)]">{row.memory}</span>
        ),
    },
    {
      key: 'disk',
      label: 'Disk',
      flex: 1,
      minWidth: columnMinWidths.disk,
      render: (_, row) =>
        row.diskPercent !== null ? (
          <UsageCell percent={row.diskPercent} />
        ) : (
          <span className="text-[var(--color-text-subtle)]">{row.disk}</span>
        ),
    },
    {
      key: 'computeType',
      label: 'Compute type',
      flex: 1,
      minWidth: columnMinWidths.type,
      render: (_, row) => (
        <span
          className={
            row.computeType !== '-'
              ? 'text-[var(--color-text-default)]'
              : 'text-[var(--color-text-subtle)]'
          }
        >
          {row.computeType}
        </span>
      ),
    },
    {
      key: 'cost',
      label: 'Cost',
      flex: 1,
      minWidth: columnMinWidths.type,
      render: (_, row) => <span className="text-[var(--color-text-default)]">{row.cost}</span>,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center' as const,
      sticky: 'right',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getWorkloadContextMenuItems(row)} trigger="click" align="right">
            <button
              aria-label="Row actions"
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--action-icon-color)]"
              />
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

      {/* Filter search Input */}
      <FilterSearchInput
        filters={filterFields}
        appliedFilters={appliedFilters}
        onFiltersChange={setAppliedFilters}
        placeholder="Search workloads by attributes"
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredWorkloads.length}
        showSettings
        onSettingsClick={() => console.log('Settings clicked')}
      />

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

/* ----------------------------------------
   Models Registry — mock data & views
   ---------------------------------------- */

function formatModelsDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatModelsDateTime(d: Date) {
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

interface RegistryCategoryRow {
  id: string;
  categoryName: string;
  aliases: string[];
  source: 'LLM' | 'Tabular';
  lastVersion: string;
  updatedAt: Date;
  createdAt: Date;
}

interface ModelVersionRow {
  id: string;
  modelName: string;
  version: string;
  aliases: string[];
  storagePath: string;
  createdAt: Date;
}

interface ActivityRecord {
  id: string;
  type: string;
  alias: string;
  version: string;
  requestBy: string;
  reason: string;
  time: Date;
}

const MOCK_REGISTRY_CATEGORIES: RegistryCategoryRow[] = [
  {
    id: 'agentname0',
    categoryName: 'Agentname0',
    aliases: ['Prod', 'Staging'],
    source: 'LLM',
    lastVersion: 'v2',
    updatedAt: new Date('2026-03-15T14:22:00'),
    createdAt: new Date('2026-01-10T09:00:00'),
  },
  {
    id: 'summarizer',
    categoryName: 'Summarizer-v3',
    aliases: ['default'],
    source: 'Tabular',
    lastVersion: 'v1',
    updatedAt: new Date('2026-02-02T11:05:00'),
    createdAt: new Date('2025-11-01T08:30:00'),
  },
  {
    id: 'embed-small',
    categoryName: 'Embedding-small',
    aliases: ['active', 'canary'],
    source: 'LLM',
    lastVersion: 'v4',
    updatedAt: new Date('2026-04-01T16:40:00'),
    createdAt: new Date('2025-06-12T12:15:00'),
  },
];

const MOCK_VERSIONS_BY_CATEGORY: Record<string, ModelVersionRow[]> = {
  agentname0: [
    {
      id: 'av1',
      modelName: 'Agentname0',
      version: 'v2',
      aliases: ['Prod', 'Staging'],
      storagePath: 's3://models/proj-1/agentname0/v2',
      createdAt: new Date('2026-03-15T14:22:00'),
    },
    {
      id: 'av0',
      modelName: 'Agentname0',
      version: 'v1',
      aliases: ['Staging'],
      storagePath: 's3://models/proj-1/agentname0/v1',
      createdAt: new Date('2026-01-10T09:00:00'),
    },
  ],
  summarizer: [
    {
      id: 'sv1',
      modelName: 'Summarizer-v3',
      version: 'v1',
      aliases: ['default'],
      storagePath: 'gs://hub/summarizer/v1/manifest.yaml',
      createdAt: new Date('2025-11-01T08:30:00'),
    },
  ],
  'embed-small': [
    {
      id: 'ev4',
      modelName: 'Embedding-small',
      version: 'v4',
      aliases: ['active', 'canary'],
      storagePath: '/Volumes/ml/embed-small/v4',
      createdAt: new Date('2026-04-01T16:40:00'),
    },
  ],
};

const MOCK_ACTIVITY_BY_CATEGORY: Record<string, ActivityRecord[]> = {
  agentname0: [
    {
      id: 'act1',
      type: 'Alias',
      alias: 'Prod',
      version: 'v2',
      requestBy: 'kim.dev@corp.local',
      reason: 'Promote after eval pass.',
      time: new Date('2026-03-15T14:30:00'),
    },
    {
      id: 'act2',
      type: 'Version',
      alias: '@Staging',
      version: 'v1',
      requestBy: 'svc-ci@corp.local',
      reason: 'Rollback from canary.',
      time: new Date('2026-03-01T09:15:22'),
    },
  ],
};

const ALIAS_SELECT_OPTIONS = [
  { value: 'best', label: 'Best' },
  { value: 'active', label: 'Active' },
  { value: 'canary', label: 'Canary' },
];

function getRegistryCategoryById(id: string | null) {
  if (!id) return null;
  return MOCK_REGISTRY_CATEGORIES.find((c) => c.id === id) ?? null;
}

function ModelsContent() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const modelParam = searchParams.get('model');

  useEffect(() => {
    if (modelParam && !getRegistryCategoryById(modelParam)) {
      navigate('/ai-platform/models/registry', { replace: true });
    }
  }, [modelParam, navigate]);

  const category = getRegistryCategoryById(modelParam);
  const isDetailView = Boolean(modelParam && category);

  const [listSearch, setListSearch] = useState('');
  const [detailSearch, setDetailSearch] = useState('');
  const [activitySearch, setActivitySearch] = useState('');
  const [listPage, setListPage] = useState(1);
  const [detailPage, setDetailPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const [listSelectedKeys, setListSelectedKeys] = useState<string[]>([]);
  const [detailSelectedKeys, setDetailSelectedKeys] = useState<string[]>([]);

  const [isActivityDrawerOpen, setActivityDrawerOpen] = useState(false);
  const [isAssignAliasDrawerOpen, setAssignAliasDrawerOpen] = useState(false);
  const [assignAliasId, setAssignAliasId] = useState<string>('best');
  const [assignReason, setAssignReason] = useState('');
  const [hasAttemptedAliasSubmit, setHasAttemptedAliasSubmit] = useState(false);
  const [assignTargetVersion, setAssignTargetVersion] = useState<ModelVersionRow | null>(null);

  const [isManageAliasDrawerOpen, setManageAliasDrawerOpen] = useState(false);
  const [manageAliasTarget, setManageAliasTarget] = useState<ModelVersionRow | null>(null);
  const [manageAliasValues, setManageAliasValues] = useState<
    { id: string; value: string; isTemplate: boolean }[]
  >([]);

  const rowsPerPage = 10;
  const activityPerPage = 10;

  const filteredCategories = useMemo(() => {
    const q = listSearch.trim().toLowerCase();
    if (!q) return MOCK_REGISTRY_CATEGORIES;
    return MOCK_REGISTRY_CATEGORIES.filter(
      (row) =>
        row.categoryName.toLowerCase().includes(q) ||
        row.aliases.some((a) => a.toLowerCase().includes(q)) ||
        row.source.toLowerCase().includes(q)
    );
  }, [listSearch]);

  const listTotalPages = Math.max(1, Math.ceil(filteredCategories.length / rowsPerPage));

  const pagedCategories = useMemo(() => {
    const start = (listPage - 1) * rowsPerPage;
    return filteredCategories.slice(start, start + rowsPerPage);
  }, [filteredCategories, listPage, rowsPerPage]);

  useEffect(() => {
    setListPage(1);
  }, [listSearch]);

  const versionRows = category ? (MOCK_VERSIONS_BY_CATEGORY[category.id] ?? []) : [];

  const filteredVersions = useMemo(() => {
    const q = detailSearch.trim().toLowerCase();
    if (!q) return versionRows;
    return versionRows.filter(
      (row) =>
        row.modelName.toLowerCase().includes(q) ||
        row.version.toLowerCase().includes(q) ||
        row.storagePath.toLowerCase().includes(q) ||
        row.aliases.some((a) => a.toLowerCase().includes(q))
    );
  }, [versionRows, detailSearch]);

  const detailTotalPages = Math.max(1, Math.ceil(filteredVersions.length / rowsPerPage));

  const pagedVersions = useMemo(() => {
    const start = (detailPage - 1) * rowsPerPage;
    return filteredVersions.slice(start, start + rowsPerPage);
  }, [filteredVersions, detailPage, rowsPerPage]);

  useEffect(() => {
    setDetailPage(1);
  }, [detailSearch, category?.id]);

  const activityRecords = category ? (MOCK_ACTIVITY_BY_CATEGORY[category.id] ?? []) : [];

  const filteredActivity = useMemo(() => {
    const q = activitySearch.trim().toLowerCase();
    if (!q) return activityRecords;
    return activityRecords.filter(
      (row) =>
        row.type.toLowerCase().includes(q) ||
        row.alias.toLowerCase().includes(q) ||
        row.requestBy.toLowerCase().includes(q) ||
        row.reason.toLowerCase().includes(q)
    );
  }, [activityRecords, activitySearch]);

  useEffect(() => {
    setActivityPage(1);
  }, [activitySearch, category?.id, isActivityDrawerOpen]);

  const activityTotalPages = Math.max(1, Math.ceil(filteredActivity.length / activityPerPage));
  const pagedActivity = useMemo(() => {
    const start = (activityPage - 1) * activityPerPage;
    return filteredActivity.slice(start, start + activityPerPage);
  }, [filteredActivity, activityPage]);

  useEffect(() => {
    if (isAssignAliasDrawerOpen) {
      setHasAttemptedAliasSubmit(false);
      setAssignReason('');
      setAssignAliasId('best');
    }
  }, [isAssignAliasDrawerOpen]);

  const openAssignAlias = (row: ModelVersionRow) => {
    setAssignTargetVersion(row);
    setAssignAliasDrawerOpen(true);
  };

  const openManageAlias = (row: ModelVersionRow) => {
    setManageAliasTarget(row);
    const templateAliases = ['best', 'active'];
    setManageAliasValues(
      row.aliases.map((a, i) => ({
        id: `alias-${i}-${Date.now()}`,
        value: a,
        isTemplate: templateAliases.includes(a.toLowerCase()),
      }))
    );
    setManageAliasDrawerOpen(true);
  };

  const addManageAlias = () => {
    setManageAliasValues((prev) => [
      ...prev,
      { id: `alias-new-${Date.now()}`, value: '', isTemplate: false },
    ]);
  };

  const removeManageAlias = (id: string) => {
    setManageAliasValues((prev) => prev.filter((a) => a.id !== id));
  };

  const updateManageAlias = (id: string, value: string) => {
    setManageAliasValues((prev) => prev.map((a) => (a.id === id ? { ...a, value } : a)));
  };

  const getDetailRowMenuItems = (row: ModelVersionRow): ContextMenuItem[] => [
    {
      id: 'activity',
      label: 'Activity history',
      onClick: () => {
        setActivityDrawerOpen(true);
      },
    },
    {
      id: 'alias',
      label: 'Assign alias',
      onClick: () => openAssignAlias(row),
    },
    {
      id: 'manage-alias',
      label: 'Manage alias',
      divider: true,
      onClick: () => openManageAlias(row),
    },
  ];

  const registryColumns: TableColumn<RegistryCategoryRow>[] = [
    {
      key: 'categoryName',
      label: 'Category name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <button
          type="button"
          className="text-left text-[var(--color-action-primary)] text-label-md hover:underline underline-offset-2"
          onClick={(e) => {
            e.stopPropagation();
            setSearchParams({ model: row.id });
          }}
        >
          {row.categoryName}
        </button>
      ),
    },
    {
      key: 'aliases',
      label: 'Aliases',
      flex: 1,
      minWidth: 160,
      render: (_, row) => (
        <HStack gap={1} className="flex-wrap min-w-0">
          {row.aliases.map((a) => (
            <Chip key={a} value={`@${a}`} />
          ))}
        </HStack>
      ),
    },
    {
      key: 'source',
      label: 'Source',
      flex: 1,
      minWidth: 100,
      render: (_, row) => (
        <Badge theme="green" size="sm" type="subtle">
          {row.source}
        </Badge>
      ),
    },
    {
      key: 'lastVersion',
      label: 'Last version',
      flex: 1,
      minWidth: columnMinWidths.type,
      render: (_, row) => (
        <span className="text-body-md text-[var(--color-text-default)]">{row.lastVersion}</span>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Updated at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (_, row) => (
        <span className="text-body-md text-[var(--color-text-default)]">
          {formatModelsDate(row.updatedAt)}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (_, row) => (
        <span className="text-body-md text-[var(--color-text-default)]">
          {formatModelsDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: () => (
        <button
          type="button"
          aria-label="Delete"
          className="inline-flex rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-state-danger)]"
          onClick={(e) => e.stopPropagation()}
        >
          <IconTrash size={16} stroke={1.5} />
        </button>
      ),
    },
  ];

  const versionColumns: TableColumn<ModelVersionRow>[] = [
    {
      key: 'modelName',
      label: 'Model name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <button
          type="button"
          className="text-left text-[var(--color-action-primary)] text-label-md hover:underline underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.modelName}
        </button>
      ),
    },
    {
      key: 'version',
      label: 'Version',
      flex: 1,
      minWidth: 80,
      render: (_, row) => (
        <span className="text-body-md text-[var(--color-text-default)]">{row.version}</span>
      ),
    },
    {
      key: 'aliases',
      label: 'Aliases',
      flex: 1,
      minWidth: 160,
      render: (_, row) => (
        <HStack gap={1} className="flex-wrap min-w-0">
          {row.aliases.map((a) => (
            <Chip key={a} value={`@${a}`} />
          ))}
        </HStack>
      ),
    },
    {
      key: 'storagePath',
      label: 'Storage path',
      flex: 1,
      minWidth: columnMinWidths.image,
      render: (_, row) => (
        <span
          className="text-body-md text-[var(--color-text-muted)] truncate block max-w-full"
          title={row.storagePath}
        >
          {row.storagePath}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (_, row) => (
        <span className="text-body-md text-[var(--color-text-default)]">
          {formatModelsDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()} className="inline-flex justify-center">
          <ContextMenu items={getDetailRowMenuItems(row)} trigger="click" align="right">
            <button
              type="button"
              aria-label="Row actions"
              className="inline-flex rounded-md p-1.5 hover:bg-[var(--color-surface-muted)]"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-muted)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  const handleConfirmAssignAlias = () => {
    setHasAttemptedAliasSubmit(true);
    if (!assignTargetVersion || !assignAliasId.trim()) return;
    setAssignAliasDrawerOpen(false);
  };

  if (!isDetailView || !category) {
    return (
      <VStack gap={6} className="w-full">
        <PageHeader
          title="Registry"
          actions={
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/ai-platform/models/compare')}
            >
              Compare
            </Button>
          }
        />

        <HStack gap={3} align="center" className="flex-wrap w-full">
          <SearchInput
            placeholder="Find models with filter"
            size="sm"
            value={listSearch}
            onChange={(e) => setListSearch(e.target.value)}
            className="w-[312px]"
          />
          <div className="w-px h-4 bg-[var(--color-border-default)]" />
          <Button variant="secondary" size="sm" disabled={listSelectedKeys.length === 0}>
            Delete
          </Button>
        </HStack>

        <Pagination
          currentPage={listPage}
          totalPages={listTotalPages}
          onPageChange={setListPage}
          totalItems={filteredCategories.length}
          selectedCount={listSelectedKeys.length}
          showSettings
          onSettingsClick={() => {}}
        />

        <Table<RegistryCategoryRow>
          columns={registryColumns}
          data={pagedCategories}
          rowKey="id"
          selectable
          selectedKeys={listSelectedKeys}
          onSelectionChange={setListSelectedKeys}
          emptyMessage="No models found"
        />
      </VStack>
    );
  }

  return (
    <VStack gap={6} className="w-full">
      <PageHeader
        title={category.categoryName}
        actions={
          <Button variant="secondary" size="md" onClick={() => setActivityDrawerOpen(true)}>
            Activity history
          </Button>
        }
      />

      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-3">
        <InfoBox label="Model type" value={category.source === 'LLM' ? 'LLM' : 'Tabular'} />
        <InfoBox label="Last version" value={category.lastVersion} />
        <InfoBox label="Aliases">
          <HStack gap={1} className="flex-wrap">
            {category.aliases.map((a) => (
              <Badge key={a} theme="gray" size="sm" type="subtle">{`@${a}`}</Badge>
            ))}
          </HStack>
        </InfoBox>
      </div>

      <Tabs defaultValue="details" variant="underline" size="sm">
        <TabList>
          <Tab value="details">Details</Tab>
        </TabList>
        <TabPanel value="details" className="pt-4">
          <VStack gap={6} className="w-full">
            <HStack gap={3} align="center" className="flex-wrap w-full">
              <SearchInput
                placeholder="Find models with filter"
                size="sm"
                value={detailSearch}
                onChange={(e) => setDetailSearch(e.target.value)}
                className="w-[312px]"
              />
            </HStack>

            <div className="w-full h-px bg-[var(--color-border-subtle)]" />

            <HStack gap={2} align="center" justify="between" className="w-full flex-wrap">
              <Button variant="secondary" size="sm" disabled={detailSelectedKeys.length === 0}>
                Delete
              </Button>
            </HStack>

            <Pagination
              currentPage={detailPage}
              totalPages={detailTotalPages}
              onPageChange={setDetailPage}
              totalItems={filteredVersions.length}
              selectedCount={detailSelectedKeys.length}
              showSettings
              onSettingsClick={() => {}}
            />

            <Table<ModelVersionRow>
              columns={versionColumns}
              data={pagedVersions}
              rowKey="id"
              selectable
              selectedKeys={detailSelectedKeys}
              onSelectionChange={setDetailSelectedKeys}
              emptyMessage="No versions found"
            />
          </VStack>
        </TabPanel>
      </Tabs>

      <Drawer
        isOpen={isActivityDrawerOpen}
        onClose={() => setActivityDrawerOpen(false)}
        title="Activity history"
        description="View the activity history of model versions and alias assignments to track changes for deployment or evaluation."
        width={696}
        footer={
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => setActivityDrawerOpen(false)}
          >
            Close
          </Button>
        }
      >
        <VStack gap={6} className="w-full">
          <InfoBox label="Model name" value={category.categoryName} />
          <SearchInput
            placeholder="Find models with filter"
            size="sm"
            value={activitySearch}
            onChange={(e) => setActivitySearch(e.target.value)}
            className="w-[312px]"
          />
          <Pagination
            currentPage={activityPage}
            totalPages={activityTotalPages}
            onPageChange={setActivityPage}
            totalItems={filteredActivity.length}
            showSettings={false}
          />
          <VStack gap={3} className="w-full">
            {pagedActivity.map((rec) => (
              <div
                key={rec.id}
                className="w-full rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4"
              >
                <HStack gap={2} className="mb-3 flex-wrap">
                  <Badge theme="gray" size="sm" type="subtle">
                    {rec.type}
                  </Badge>
                  <Chip value={rec.alias.startsWith('@') ? rec.alias : `@${rec.alias}`} />
                </HStack>
                <VStack gap={2}>
                  <HStack justify="between" align="start" className="w-full gap-4">
                    <span className="text-label-sm text-[var(--color-text-subtle)] shrink-0">
                      Version
                    </span>
                    <span className="text-body-md text-[var(--color-text-default)] text-right">
                      {rec.version}
                    </span>
                  </HStack>
                  <HStack justify="between" align="start" className="w-full gap-4">
                    <span className="text-label-sm text-[var(--color-text-subtle)] shrink-0">
                      Request by
                    </span>
                    <span className="text-body-md text-[var(--color-text-default)] text-right break-all">
                      {rec.requestBy}
                    </span>
                  </HStack>
                  <HStack justify="between" align="start" className="w-full gap-4">
                    <span className="text-label-sm text-[var(--color-text-subtle)] shrink-0">
                      Reason
                    </span>
                    <span className="text-body-md text-[var(--color-text-default)] text-right">
                      {rec.reason}
                    </span>
                  </HStack>
                  <HStack justify="between" align="start" className="w-full gap-4">
                    <span className="text-label-sm text-[var(--color-text-subtle)] shrink-0">
                      Time
                    </span>
                    <span className="text-body-md text-[var(--color-text-default)] text-right tabular-nums">
                      {formatModelsDateTime(rec.time)}
                    </span>
                  </HStack>
                </VStack>
              </div>
            ))}
          </VStack>
        </VStack>
      </Drawer>

      <Drawer
        isOpen={isAssignAliasDrawerOpen}
        onClose={() => setAssignAliasDrawerOpen(false)}
        title="Assign alias"
        description="Register an alias for each model to identify specific version for deployment or evaluation."
        width={376}
        footer={
          <HStack gap={2} className="w-full">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={() => setAssignAliasDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={handleConfirmAssignAlias}
            >
              Confirm
            </Button>
          </HStack>
        }
      >
        <VStack gap={6} className="w-full">
          <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] p-4 space-y-3">
            <InfoBox
              label="Model name"
              value={assignTargetVersion?.modelName ?? category.categoryName}
            />
            <InfoBox label="Current aliases">
              <HStack gap={1} className="flex-wrap">
                {(assignTargetVersion?.aliases ?? []).map((a) => (
                  <Badge key={a} theme="gray" size="sm" type="subtle">{`@${a}`}</Badge>
                ))}
              </HStack>
            </InfoBox>
            <InfoBox label="Version" value={assignTargetVersion?.version ?? category.lastVersion} />
          </div>
          <FormField
            label="Select alias"
            required
            helperText="Best: top-performing version, Active: currently serving."
            error={hasAttemptedAliasSubmit && !assignAliasId}
            errorMessage={
              hasAttemptedAliasSubmit && !assignAliasId ? 'Select an alias.' : undefined
            }
          >
            <Select
              options={ALIAS_SELECT_OPTIONS}
              value={assignAliasId}
              onChange={setAssignAliasId}
              placeholder="Select alias"
              fullWidth
            />
          </FormField>
          <FormField
            label="Change reason"
            helperText="The reason will be recorded in the Activity history."
          >
            <Textarea
              value={assignReason}
              onChange={(e) => setAssignReason(e.target.value)}
              placeholder="Describe the change"
              fullWidth
            />
          </FormField>
        </VStack>
      </Drawer>

      {/* Manage Alias Drawer */}
      <Drawer
        isOpen={isManageAliasDrawerOpen}
        onClose={() => setManageAliasDrawerOpen(false)}
        title="Manage alias"
        description="Edit or remove aliases for this model version. Template aliases (best, active) cannot be removed."
        width={376}
        footer={
          <HStack gap={2} className="w-full">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={() => setManageAliasDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={() => setManageAliasDrawerOpen(false)}
            >
              Save
            </Button>
          </HStack>
        }
      >
        <VStack gap={6} className="w-full">
          <div className="space-y-3">
            <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] p-4">
              <VStack gap={1.5}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Model name</span>
                <span className="text-body-md text-[var(--color-text-default)]">
                  {manageAliasTarget?.modelName ?? category?.categoryName ?? ''}
                </span>
              </VStack>
            </div>
            <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] p-4">
              <VStack gap={1.5}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Version</span>
                <span className="text-body-md text-[var(--color-text-default)]">
                  {manageAliasTarget?.version ?? ''}
                </span>
              </VStack>
            </div>
          </div>

          <VStack gap={2}>
            <span className="text-heading-h6 text-[var(--color-text-default)]">Alias</span>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              Edit custom aliases or remove them. Template aliases (best, active) cannot be removed.
            </span>
            <VStack gap={2} className="mt-2">
              {manageAliasValues.map((alias) => (
                <HStack key={alias.id} gap={2} align="center">
                  <Input
                    value={alias.value}
                    onChange={(e) => updateManageAlias(alias.id, e.target.value)}
                    placeholder="{aliase}"
                    fullWidth
                    disabled={alias.isTemplate}
                  />
                  {!alias.isTemplate && (
                    <button
                      type="button"
                      onClick={() => removeManageAlias(alias.id)}
                      className="shrink-0 p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                      aria-label="Remove alias"
                    >
                      <IconX size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
                    </button>
                  )}
                </HStack>
              ))}
            </VStack>
          </VStack>
        </VStack>
      </Drawer>
    </VStack>
  );
}

/* ----------------------------------------
   Compare Page — select category + two models, show details table + metrics charts
   ---------------------------------------- */

interface CompareModelOption {
  value: string;
  label: string;
}

const COMPARE_CATEGORY_OPTIONS: CompareModelOption[] = [
  { value: 'llm', label: 'LLM' },
  { value: 'tabular', label: 'Tabular' },
];

const COMPARE_MODEL_OPTIONS: Record<string, CompareModelOption[]> = {
  llm: [
    { value: 'agentname0-v1', label: 'Agentname0 v1' },
    { value: 'agentname0-v2', label: 'Agentname0 v2' },
    { value: 'embed-small-v4', label: 'Embedding-small v4' },
  ],
  tabular: [{ value: 'summarizer-v1', label: 'Summarizer-v3 v1' }],
};

interface CompareDetailRow {
  id: string;
  field: string;
  model1Value: string;
  model2Value: string;
}

const MOCK_COMPARE_DETAILS: CompareDetailRow[] = [
  { id: 'r1', field: 'Experiment', model1Value: '{lable}', model2Value: '{lable}' },
  { id: 'r2', field: 'Base model', model1Value: '{lable}', model2Value: '{lable}' },
  { id: 'r3', field: 'Status', model1Value: '{lable}', model2Value: '{lable}' },
  { id: 'r4', field: 'Created at', model1Value: '{lable}', model2Value: '{lable}' },
  { id: 'r5', field: 'base_model', model1Value: '{lable}', model2Value: '{lable}' },
  { id: 'r6', field: 'batch_size', model1Value: '{lable}', model2Value: '{lable}' },
  { id: 'r7', field: 'learning_rate', model1Value: '{lable}', model2Value: '{lable}' },
  { id: 'r8', field: 'max_length', model1Value: '{lable}', model2Value: '{lable}' },
  { id: 'r9', field: 'max_steps', model1Value: '{lable}', model2Value: '{lable}' },
  { id: 'r10', field: 'method', model1Value: '{lable}', model2Value: '{lable}' },
  { id: 'r11', field: 'total_gpus', model1Value: '{lable}', model2Value: '{lable}' },
  { id: 'r12', field: 'training_mode', model1Value: '{lable}', model2Value: '{lable}' },
];

function CompareContent() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [model1, setModel1] = useState('');
  const [model2, setModel2] = useState('');

  const modelOptions = selectedCategory ? (COMPARE_MODEL_OPTIONS[selectedCategory] ?? []) : [];
  const hasComparison = selectedCategory && model1 && model2;

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setModel1('');
    setModel2('');
  };

  const model1Label = modelOptions.find((o) => o.value === model1)?.label ?? '{Category model 1}';
  const model2Label = modelOptions.find((o) => o.value === model2)?.label ?? '{Category model 2}';

  const compareColumns: TableColumn<CompareDetailRow>[] = useMemo(
    () => [
      {
        key: 'field',
        label: '',
        flex: 1,
        minWidth: '160px',
      },
      {
        key: 'model1Value',
        label: model1Label,
        flex: 1,
        minWidth: '160px',
      },
      {
        key: 'model2Value',
        label: model2Label,
        flex: 1,
        minWidth: '160px',
      },
    ],
    [model1Label, model2Label]
  );

  return (
    <VStack gap={6} className="w-full">
      {/* Section 1 — Selection */}
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
        <VStack gap={5}>
          <span className="text-heading-h6 text-[var(--color-text-default)]">Section 1</span>

          <FormField label="Model category">
            <Select
              options={COMPARE_CATEGORY_OPTIONS}
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Select category"
              className="w-[312px]"
            />
          </FormField>

          <FormField label="Model (Option 1)">
            <Select
              options={modelOptions}
              value={model1}
              onChange={setModel1}
              placeholder="Select model"
              disabled={!selectedCategory}
              className="w-[312px]"
            />
          </FormField>

          <FormField label="Model (Option 2)">
            <Select
              options={modelOptions}
              value={model2}
              onChange={setModel2}
              placeholder="Select model"
              disabled={!selectedCategory}
              className="w-[312px]"
            />
          </FormField>
        </VStack>
      </div>

      {/* Results area */}
      {hasComparison ? (
        <>
          {/* Model details — TDS Table */}
          <VStack gap={3}>
            <span className="text-heading-h5 text-[var(--color-text-default)]">Model details</span>
            <Table<CompareDetailRow>
              columns={compareColumns}
              data={MOCK_COMPARE_DETAILS}
              rowKey="id"
              emptyMessage="No data"
            />
          </VStack>

          {/* Metrics comparison */}
          <VStack gap={3}>
            <span className="text-heading-h5 text-[var(--color-text-default)]">
              Metrics comparison
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
                <VStack gap={3}>
                  <HStack justify="between" align="center">
                    <span className="text-label-md text-[var(--color-text-default)]">Loss</span>
                    <HStack gap={3}>
                      <HStack gap={1} align="center">
                        <div className="w-3 h-3 rounded-sm bg-[var(--chart-color-1)]" />
                        <span className="text-body-sm text-[var(--color-text-muted)]">v3</span>
                      </HStack>
                      <HStack gap={1} align="center">
                        <div className="w-3 h-3 rounded-sm bg-[var(--chart-color-2)]" />
                        <span className="text-body-sm text-[var(--color-text-muted)]">v5</span>
                      </HStack>
                    </HStack>
                  </HStack>
                  <VStack gap={2}>
                    <HStack gap={2} align="center" className="w-full">
                      <span className="text-body-sm text-[var(--color-text-subtle)] w-24 shrink-0 text-right">
                        Training Loss
                      </span>
                      <div className="flex-1 h-5 bg-[var(--chart-color-1)] rounded-sm opacity-80" />
                    </HStack>
                    <HStack gap={2} align="center" className="w-full">
                      <span className="text-body-sm text-[var(--color-text-subtle)] w-24 shrink-0 text-right">
                        Validation Loss
                      </span>
                      <div className="flex-1 h-5 bg-[var(--chart-color-2)] rounded-sm opacity-80" />
                    </HStack>
                  </VStack>
                </VStack>
              </div>

              <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
                <VStack gap={3}>
                  <HStack justify="between" align="center">
                    <span className="text-label-md text-[var(--color-text-default)]">
                      Training Runtime
                    </span>
                    <HStack gap={3}>
                      <HStack gap={1} align="center">
                        <div className="w-3 h-3 rounded-sm bg-[var(--chart-color-1)]" />
                        <span className="text-body-sm text-[var(--color-text-muted)]">v3</span>
                      </HStack>
                      <HStack gap={1} align="center">
                        <div className="w-3 h-3 rounded-sm bg-[var(--chart-color-2)]" />
                        <span className="text-body-sm text-[var(--color-text-muted)]">v5</span>
                      </HStack>
                    </HStack>
                  </HStack>
                  <VStack gap={2}>
                    <HStack gap={2} align="center" className="w-full">
                      <span className="text-body-sm text-[var(--color-text-subtle)] w-24 shrink-0 text-right">
                        Runtime (s)
                      </span>
                      <div className="flex-1 h-5 bg-[var(--chart-color-1)] rounded-sm opacity-80" />
                    </HStack>
                  </VStack>
                </VStack>
              </div>
            </div>
          </VStack>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center min-h-[400px] bg-[var(--color-surface-default)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
          <VStack gap={2} align="center">
            <span className="text-label-lg text-[var(--color-text-default)]">
              Select a model category
            </span>
            <span className="text-body-md text-[var(--color-text-default)] text-center">
              Select options to compare their configurations, metrics, and training curves.
            </span>
          </VStack>
        </div>
      )}
    </VStack>
  );
}

function PlaceholderContent({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center mb-4">
        <IconStack2 size={32} stroke={1} className="text-[var(--color-text-muted)]" />
      </div>
      <h3 className="text-heading-h5 text-[var(--color-text-default)] mb-2">{title}</h3>
      <p className="text-body-lg text-[var(--color-text-muted)]">
        This page is under construction.
      </p>
    </div>
  );
}

/* ----------------------------------------
   Main AI Platform Page Component
   ---------------------------------------- */
export function AIPlatformPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const routeConfig = useRouteConfig();

  const modelsModelId =
    location.pathname === '/ai-platform/models/registry' ? searchParams.get('model') : null;

  const modelsLayout = useMemo(() => {
    if (location.pathname !== '/ai-platform/models/registry') return null;
    const cat = getRegistryCategoryById(modelsModelId);
    const base: BreadcrumbItem[] = [{ label: 'Models', href: '/ai-platform/models' }];
    if (!modelsModelId || !cat) {
      return {
        breadcrumbs: [...base, { label: 'Registry' }],
        showPageTitle: false,
      };
    }
    return {
      breadcrumbs: [
        ...base,
        { label: 'Registry', href: '/ai-platform/models/registry' },
        { label: cat.categoryName },
      ],
      showPageTitle: false,
    };
  }, [location.pathname, modelsModelId]);

  const breadcrumbItems = modelsLayout?.breadcrumbs ?? routeConfig.breadcrumbs;
  const showPageTitle = modelsLayout ? modelsLayout.showPageTitle : true;

  // Render content based on current path
  const renderContent = () => {
    if (location.pathname === '/ai-platform') {
      return <DashboardContent />;
    }
    if (location.pathname === '/ai-platform/workloads') {
      return <WorkloadsContent />;
    }
    if (location.pathname === '/ai-platform/models/registry') {
      return <ModelsContent />;
    }
    if (location.pathname === '/ai-platform/models/compare') {
      return <CompareContent />;
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
      title={modelsLayout ? '' : routeConfig.title}
      subtitle={modelsLayout ? undefined : routeConfig.subtitle}
      breadcrumbItems={breadcrumbItems}
      showPageTitle={showPageTitle}
      headerActions={getHeaderActions()}
    >
      {renderContent()}
    </AIPlatformPageLayout>
  );
}

export default AIPlatformPage;
