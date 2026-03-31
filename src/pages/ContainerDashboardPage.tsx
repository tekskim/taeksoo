import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDarkMode } from '@/hooks/useDarkMode';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  DetailHeader,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Table,
  Button,
  Pagination,
  PageShell,
  Badge,
  Tooltip,
  SearchInput,
  type TableColumn,
  columnMinWidths,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconTerminal2,
  IconExternalLink,
  IconFile,
  IconCopy,
  IconSearch,
  IconBell,
  IconHelpCircle,
  IconPencilCog,
  IconKey,
} from '@tabler/icons-react';

/* ----------------------------------------
   Capacity Progress bar Component
   Uses design system tokens for consistent styling
   ---------------------------------------- */

type CapacityStatus = 'success' | 'warning' | 'danger';

interface CapacityProgressBarProps {
  label: string;
  used: number;
  total: number;
  unit: string;
  percentage: number;
}

function CapacityProgressBar({ label, used, total, unit, percentage }: CapacityProgressBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark: isDarkMode } = useDarkMode();

  // Determine status based on percentage thresholds
  const getStatus = (pct: number): CapacityStatus => {
    if (pct >= 95) return 'danger';
    if (pct >= 70) return 'warning';
    return 'success';
  };

  const status = getStatus(percentage);

  // Design system color tokens - with dark mode support
  const statusColors: Record<
    CapacityStatus,
    { bg: string; darkBg: string; fill: string; text: string }
  > = {
    success: {
      bg: 'var(--color-green-100)',
      darkBg: 'rgba(34, 197, 94, 0.15)', // green-500 with 15% opacity for dark mode
      fill: 'var(--color-state-success)',
      text: 'var(--color-green-600)',
    },
    warning: {
      bg: 'var(--color-orange-100)',
      darkBg: 'rgba(249, 115, 22, 0.15)', // orange-500 with 15% opacity for dark mode
      fill: 'var(--color-state-warning)',
      text: 'var(--color-orange-600)',
    },
    danger: {
      bg: 'var(--color-red-100)',
      darkBg: 'rgba(239, 68, 68, 0.15)', // red-500 with 15% opacity for dark mode
      fill: 'var(--color-state-danger)',
      text: 'var(--color-red-600)',
    },
  };

  const colors = statusColors[status];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-[var(--spacing-2)] w-full cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between w-full">
        {/* Label */}
        <span className="text-label-md text-[var(--color-text-default)]">{label}</span>

        {/* Value and Badge */}
        <div className="flex items-center gap-[var(--spacing-2)]">
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            {used} / {total} {unit}
          </span>
          <div
            className="flex items-center px-1.5 py-0.5 rounded-[var(--radius-md)]"
            style={{ backgroundColor: isDarkMode ? colors.darkBg : colors.bg }}
          >
            <span
              className="text-label-sm"
              style={{ color: isDarkMode ? colors.fill : colors.text }}
            >
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar - using design system tokens */}
      <div className="relative h-[var(--progress-bar-height)] w-full">
        {/* Background */}
        <div
          className="absolute inset-0 rounded-[var(--progress-bar-radius)]"
          style={{ backgroundColor: 'var(--color-border-subtle)' }}
        />
        {/* Filled segment */}
        <div
          className="absolute inset-y-0 left-0 rounded-[var(--progress-bar-radius)] transition-all"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: colors.fill,
            minWidth: percentage > 0 ? 4 : 0,
          }}
        />

        {/* Tooltip - follows cursor */}
        {showTooltip && (
          <div
            className="absolute z-10 backdrop-blur-[40px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-1.5 flex flex-col gap-1 pointer-events-none"
            style={{ left: mousePos.x + 12, top: mousePos.y - 40 }}
          >
            <div className="flex items-center gap-1.5">
              <div
                className="w-[5px] h-[5px] rounded-[1px]"
                style={{ backgroundColor: colors.fill }}
              />
              <span className="text-body-sm text-[var(--color-text-default)] whitespace-nowrap">
                Used: {used} {unit} ({percentage}%)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-[5px] h-[5px] rounded-[1px] bg-[var(--color-border-subtle)]" />
              <span className="text-body-sm text-[var(--color-text-default)] whitespace-nowrap">
                Total: {total} {unit}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Dashboard Card Component (matching ComputeHomePage style)
   ---------------------------------------- */

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
  actions?: React.ReactNode;
}

function Card({
  title,
  children,
  className = '',
  bgColor = 'bg-[var(--color-surface-default)]',
  actions,
}: CardProps) {
  return (
    <div
      className={`p-4 rounded-2xl border border-[var(--color-border-default)] ${bgColor} ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h6 className="text-heading-h6">{title}</h6>
        {actions}
      </div>
      {children}
    </div>
  );
}

/* ----------------------------------------
   Events Table Data
   ---------------------------------------- */

interface EventRow {
  id: string;
  reason: string;
  object: string;
  message: string;
  name: string;
  firstSeen: string;
  lastSeen: string;
  count: number;
}

const eventsData: EventRow[] = [
  {
    id: '1',
    reason: 'Pulling',
    object: 'Pod object',
    message: 'Pulling image "nginx:lastest"',
    name: 'testpod.1872cb50f1f3985b',
    firstSeen: '2d8h',
    lastSeen: '5m2s',
    count: 666,
  },
  {
    id: '2',
    reason: 'Failed',
    object: 'Pod object',
    message:
      'Failed to pull image "nginx:lastest": rpc error: code = NotFound desc = failed to pull and unpack image...',
    name: 'testpod.1872cb51519dc95b',
    firstSeen: '2d8h',
    lastSeen: '5m2s',
    count: 664,
  },
  {
    id: '3',
    reason: 'FailedGetScale',
    object: 'HorizontalPodAutoscaler object',
    message: 'Back-off pulling image "nginx:lastest"',
    name: 'test.1870aa1e813aa422',
    firstSeen: '9d',
    lastSeen: '54s',
    count: 53607,
  },
  {
    id: '4',
    reason: 'BackOff',
    object: 'Pod object',
    message: 'Error: ImagePullBackOff',
    name: 'testpod.1872cb51804912b6',
    firstSeen: '2d8h',
    lastSeen: '4s',
    count: 14495,
  },
  {
    id: '5',
    reason: 'Failed',
    object: 'Pod object',
    message: 'Error: ImagePullBackOff',
    name: 'testpod.1872cb5180493d50',
    firstSeen: '2d8h',
    lastSeen: '4s',
    count: 14495,
  },
];

const eventsColumns: TableColumn<EventRow>[] = [
  { key: 'reason', label: 'Reason', flex: 1, minWidth: columnMinWidths.reason, sortable: true },
  {
    key: 'object',
    label: 'Object',
    flex: 1,
    minWidth: columnMinWidths.object,
    sortable: true,
    render: (value: string) => (
      <div className="min-w-0">
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate block"
          title={value}
        >
          {value}
        </span>
      </div>
    ),
  },
  {
    key: 'message',
    label: 'Message',
    flex: 1,
    minWidth: columnMinWidths.message,
    sortable: true,
    render: (value: string) => (
      <div className="min-w-0">
        <span className="truncate block" title={value ?? ''}>
          {value}
        </span>
      </div>
    ),
  },
  {
    key: 'name',
    label: 'Name',
    flex: 1,
    minWidth: columnMinWidths.name,
    sortable: true,
    render: (value: string) => (
      <div className="min-w-0">
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate block"
          title={value}
        >
          {value}
        </span>
      </div>
    ),
  },
  {
    key: 'firstSeen',
    label: 'First seen',
    flex: 1,
    minWidth: columnMinWidths.firstSeen,
    sortable: true,
  },
  {
    key: 'lastSeen',
    label: 'Last seen',
    flex: 1,
    minWidth: columnMinWidths.lastSeen,
    sortable: true,
  },
  { key: 'count', label: 'Count', flex: 1, minWidth: columnMinWidths.count, sortable: true },
];

/* ----------------------------------------
   Container Dashboard Page
   ---------------------------------------- */

export function ContainerDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'events';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [currentPage, setCurrentPage] = useState(1);
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label to "Dashboard" on mount
  useEffect(() => {
    updateActiveTabLabel('Dashboard');
  }, [updateActiveTabLabel]);

  // Calculate sidebar width (40px icon sidebar always visible + 200px menu sidebar when open)
  const sidebarWidth = sidebarOpen ? 248 : 48;

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'default-cluster', href: '/container' }, { label: 'Dashboard' }]}
            />
          }
          actions={
            <>
              <Tooltip content="Customize appearance" position="bottom">
                <button
                  className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-cluster-appearance'))}
                  aria-label="Customize cluster appearance"
                >
                  <IconPencilCog
                    size={16}
                    className="text-[var(--color-text-muted)]"
                    stroke={1.5}
                  />
                </button>
              </Tooltip>
              <Tooltip content="Access Token" position="bottom">
                <button
                  type="button"
                  className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-access-token'))}
                  aria-label="Access Token"
                >
                  <IconKey size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                </button>
              </Tooltip>
              <Tooltip content="kubectl Shell" position="bottom">
                <button
                  className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  aria-label="kubectl Shell"
                >
                  <IconTerminal2
                    size={16}
                    className="text-[var(--color-text-muted)]"
                    stroke={1.5}
                  />
                </button>
              </Tooltip>
              <Tooltip content="Download kubeconfig" position="bottom">
                <button
                  className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  aria-label="Download kubeconfig"
                >
                  <IconFile size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                </button>
              </Tooltip>
              <Tooltip content="Copy kubeconfig" position="bottom">
                <button
                  className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  aria-label="Copy kubeconfig"
                >
                  <IconCopy size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                </button>
              </Tooltip>
              <Tooltip content="Search resource types" position="bottom">
                <button
                  className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  aria-label="Search resource types"
                >
                  <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                </button>
              </Tooltip>
              <Tooltip content="Notifications" position="bottom">
                <button
                  className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  aria-label="Notifications"
                >
                  <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                </button>
              </Tooltip>
            </>
          }
        />
      }
      contentClassName="px-8 py-6"
    >
      {/* Top Row - 2 Cards */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Basic information Card */}
        <Card
          title="Basic information"
          bgColor="bg-[var(--color-surface-subtle)]"
          className="flex flex-col"
        >
          <h3 className="text-heading-h2 text-[var(--color-text-default)]">k3s-cluster</h3>
          <div className="space-y-4 mt-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Architecture</span>
                <span className="text-body-md text-[var(--color-text-default)]">amd64</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Kubernetes version
                </span>
                <span className="text-body-md text-[var(--color-text-default)]">v1.33.4+k3s1</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Total resources
                </span>
                <span className="text-body-md text-[var(--color-text-default)]">295</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Created at</span>
                <span className="text-body-md text-[var(--color-text-default)]">Nov 9, 2025</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)] flex items-center gap-1">
                  Deployments
                  <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                </span>
                <span className="text-body-md text-[var(--color-text-default)]">15</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)] flex items-center gap-1">
                  Nodes
                  <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                </span>
                <span className="text-body-md text-[var(--color-text-default)]">1</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Capacity Card */}
        <Card title="Capacity">
          <VStack gap={5}>
            <CapacityProgressBar
              label="CPU (Used)"
              used={0.26}
              total={8}
              unit="cores"
              percentage={3.3}
            />
            <CapacityProgressBar
              label="CPU (Reserved)"
              used={3.6}
              total={16.0}
              unit="GiB"
              percentage={50.2}
            />
            <CapacityProgressBar
              label="Memory (Used)"
              used={12.0}
              total={16.0}
              unit="GiB"
              percentage={75}
            />
            <CapacityProgressBar
              label="Memory (Reserved)"
              used={15}
              total={16}
              unit="GiB"
              percentage={93.8}
            />
            <CapacityProgressBar label="Pods" used={51} total={110} unit="" percentage={46.4} />
          </VStack>
        </Card>
      </div>

      {/* Control Plane Components */}
      <div className="mb-6">
        <Card title="Control plane components">
          <DetailHeader.InfoGrid>
            {(['Etcd', 'Scheduler', 'Controller manager'] as const).map((name) => {
              const tooltips: Record<string, string> = {
                Etcd: 'etcd is a distributed key-value store used by Kubernetes to store all cluster state and configuration data.',
                Scheduler:
                  'Scheduler assigns pods to nodes based on resource requirements, constraints, and scheduling policies.',
                'Controller manager':
                  'Controller manager runs background controllers that ensure cluster resources reach their desired state.',
              };
              return (
                <div
                  key={name}
                  className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3 relative min-w-0"
                >
                  <div className="absolute top-1/2 right-3 -translate-y-1/2">
                    <Badge theme="white" size="sm">
                      Active
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1.5 min-w-0 pr-14">
                    <span className="text-label-sm leading-4 text-[var(--color-text-subtle)] whitespace-nowrap flex items-center gap-1">
                      {name}
                      <Tooltip content={tooltips[name]} position="top">
                        <IconHelpCircle
                          size={12}
                          className="text-[var(--color-text-subtle)] cursor-help"
                        />
                      </Tooltip>
                    </span>
                    <span className="text-body-md leading-4 font-normal truncate text-[var(--color-text-default)]">
                      Uptime: 15d 4h 23m
                    </span>
                  </div>
                </div>
              );
            })}
          </DetailHeader.InfoGrid>
        </Card>
      </div>

      {/* Events & Secrets */}
      <Card title="Events & Secrets">
        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList className="w-full mb-3">
            <Tab value="events">Events</Tab>
            <Tab value="secrets">Secrets</Tab>
          </TabList>

          <TabPanel value="events" className="pt-0">
            <VStack gap={3}>
              <HStack gap={2} align="center">
                <SearchInput
                  value={eventSearchQuery}
                  onChange={setEventSearchQuery}
                  placeholder="Search events by attributes"
                  size="sm"
                  className="w-[var(--search-input-width)]"
                />
                <div className="h-4 w-px bg-[var(--color-border-default)]" />
                <Button variant="secondary" size="sm">
                  Full events list
                </Button>
              </HStack>
              <div className="flex justify-start">
                <Pagination
                  currentPage={currentPage}
                  totalPages={1}
                  onPageChange={setCurrentPage}
                  showSettings
                  onSettingsClick={() => {}}
                />
              </div>
              <Table<EventRow> columns={eventsColumns} data={eventsData} rowKey="id" />
            </VStack>
          </TabPanel>

          <TabPanel value="secrets" className="pt-0">
            <div className="text-center py-8 text-[var(--color-text-muted)]">No secrets found</div>
          </TabPanel>
        </Tabs>
      </Card>
    </PageShell>
  );
}

export default ContainerDashboardPage;
