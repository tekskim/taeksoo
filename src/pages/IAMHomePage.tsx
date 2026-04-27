import { useState, useEffect } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Badge,
  PageShell,
  type TableColumn,
} from '@/design-system';
import { columnMinWidths } from '@/design-system/presets/columnWidths';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconSearch } from '@tabler/icons-react';
import { chartColors } from '@/pages/design-system-sections/ChartComponents';

function resolvedChartColor(cssVar: string, chartFallback: string): string {
  if (typeof window === 'undefined') return chartFallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  return v || chartFallback;
}

/** Parse a px length from a CSS variable (e.g. `--font-size-11: 11px`) for ECharts numeric options. */
function resolvedCssPx(cssVar: string, fallbackPx: number): number {
  if (typeof window === 'undefined') return fallbackPx;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  if (!raw) return fallbackPx;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallbackPx;
}

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface EventRow {
  id: string;
  time: string;
  event: string;
  user: string;
  target: string;
  result: 'Success' | 'Failure';
  ipAddress: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const eventsData: EventRow[] = [
  {
    id: '1',
    time: 'Dec 12, 25 18:30:39',
    event: 'Sign-in',
    user: 'thaki.kim',
    target: '-',
    result: 'Success',
    ipAddress: '192.168.1.100',
  },
  {
    id: '2',
    time: 'Dec 12, 25 18:30:52',
    event: 'MFA challenge',
    user: 'thaki.kim',
    target: 'IAM console',
    result: 'Success',
    ipAddress: '192.168.1.100',
  },
  {
    id: '3',
    time: 'Dec 12, 25 18:31:10',
    event: 'Sign-in',
    user: 'alex.johnson',
    target: '-',
    result: 'Success',
    ipAddress: '192.168.1.101',
  },
  {
    id: '4',
    time: 'Dec 12, 25 18:32:25',
    event: 'Sign-in',
    user: 'sara.connor',
    target: '-',
    result: 'Success',
    ipAddress: '192.168.1.102',
  },
  {
    id: '5',
    time: 'Dec 12, 25 18:33:01',
    event: 'Create API key',
    user: 'sara.connor',
    target: 'project-api',
    result: 'Success',
    ipAddress: '192.168.1.102',
  },
];

/* ----------------------------------------
   Simple Pie Chart Component (from design system)
   ---------------------------------------- */

interface SimplePieChartProps {
  data: { name: string; value: number; color: string }[];
  size?: number;
}

function SimplePieChart({ data, size = 100 }: SimplePieChartProps) {
  const getOption = () => ({
    tooltip: {
      show: true,
      trigger: 'item',
      backgroundColor: resolvedChartColor('--color-surface-default', '#ffffff'),
      borderColor: resolvedChartColor('--color-border-default', chartColors.slate100),
      borderWidth: 1,
      borderRadius: resolvedCssPx('--radius-md', 6),
      padding: [resolvedCssPx('--spacing-2', 8), resolvedCssPx('--spacing-3', 12)],
      textStyle: {
        color: chartColors.slate800,
        fontSize: resolvedCssPx('--font-size-11', 11),
        fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
      },
      formatter: (params: { name: string; value: number; percent: number; color: string }) => {
        return `<span style="display:inline-block;width:var(--spacing-2);height:var(--spacing-2);border-radius:var(--radius-full);background-color:${params.color};margin-right:var(--spacing-1-5);"></span>${params.name}<br/><span style="font-weight:500;margin-left:calc(var(--spacing-3) + var(--spacing-0-5));">${params.value} (${params.percent.toFixed(0)}%)</span>`;
      },
    },
    animation: false,
    series: [
      {
        type: 'pie',
        radius: '80%',
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: 'inside',
          formatter: (params: { percent: number }) => {
            return params.percent >= 15 ? `${params.percent.toFixed(0)}%` : '';
          },
          fontSize: resolvedCssPx('--font-size-12', 12),
          fontWeight: 600,
          color: chartColors.slate800,
          fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        emphasis: {
          scale: true,
          scaleSize: 5,
        },
        labelLine: {
          show: false,
        },
        data: data.map((item) => ({
          name: item.name,
          value: item.value,
          itemStyle: { color: item.color },
        })),
      },
    ],
  });

  return (
    <ReactECharts
      option={getOption()}
      style={{ height: `${size}px`, width: `${size}px` }}
      opts={{ devicePixelRatio: window.devicePixelRatio }}
    />
  );
}

/* ----------------------------------------
   Stat Card Component
   ---------------------------------------- */

interface StatCardProps {
  label: string;
  value: string | number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
}

function StatCard({ label, value, variant = 'default' }: StatCardProps) {
  const colorStyles = {
    default: 'text-[var(--color-text-default)]',
    primary: 'text-[var(--color-action-primary)]',
    success: 'text-[var(--color-state-success)]',
    warning: 'text-[var(--color-state-warning)]',
    danger: 'text-[var(--color-state-danger)]',
  };

  const textColor =
    value === '0' || value === 0 ? 'text-[var(--color-text-muted)]' : colorStyles[variant];

  return (
    <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] px-4 py-3">
      <div className="flex flex-col gap-1.5">
        <span className={`text-label-sm ${textColor}`}>{label}</span>
        <span className={`text-heading-h3 ${textColor}`}>{value}</span>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Resource Card Component
   ---------------------------------------- */

interface ResourceCardProps {
  label: string;
  value: string | number;
}

function ResourceCard({ label, value }: ResourceCardProps) {
  return (
    <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] px-4 py-3 flex flex-col gap-1.5">
      <p className="text-body-sm text-[var(--color-text-subtle)]">{label}</p>
      <p className="text-heading-h3 text-[var(--color-text-default)]">{value}</p>
    </div>
  );
}

/* ----------------------------------------
   IAM Home Page
   ---------------------------------------- */

export function IAMHomePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const signInPieData = [
    { name: 'Success', value: 1234, color: chartColors.emerald400 },
    { name: 'Failure', value: 45, color: chartColors.red400 },
  ];
  const mfaPieData = [
    { name: 'Enabled', value: 117, color: chartColors.emerald400 },
    {
      name: 'Disabled',
      value: 33,
      color: resolvedChartColor('--color-border-default', chartColors.slate100),
    },
  ];

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Dashboard');
  }, [updateActiveTabLabel]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Events table columns
  const eventsColumns: TableColumn<EventRow>[] = [
    { key: 'time', label: 'Time', flex: 1, minWidth: columnMinWidths.createdAt, sortable: true },
    { key: 'event', label: 'Event', flex: 1, minWidth: columnMinWidths.name, sortable: true },
    { key: 'user', label: 'User', flex: 1, minWidth: columnMinWidths.user, sortable: true },
    { key: 'target', label: 'Target', flex: 1, minWidth: columnMinWidths.name, sortable: true },
    {
      key: 'result',
      label: 'Result',
      flex: 1,
      minWidth: columnMinWidths.typeLg,
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'Success' ? 'success' : 'error'} size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP address',
      flex: 1,
      minWidth: columnMinWidths.ipAddress,
      sortable: true,
    },
  ];

  return (
    <PageShell
      sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
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
          breadcrumb={<Breadcrumb items={[{ label: 'Dashboard' }]} />}
          actions={
            <button
              type="button"
              aria-label="Search"
              onClick={() => navigate('/iam/users')}
              className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
            >
              <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
          }
        />
      }
      contentClassName="px-8 py-6"
    >
      <VStack gap={6}>
        {/* Row 1: Domain Info + Authentication Summary */}
        <div className="grid grid-cols-[320px_1fr] gap-6">
          {/* Domain Info Card */}
          <div className="bg-[var(--color-surface-subtle)] rounded-2xl border border-[var(--color-border-default)] p-4 flex flex-col gap-6">
            <h6 className="text-heading-h6">Domain Info</h6>
            <h2 className="text-heading-h2 text-[var(--color-text-default)]">DomainA</h2>
            <VStack gap={4} className="mt-auto">
              <div>
                <div className="text-body-xs text-[var(--color-text-muted)] mb-1">Created at</div>
                <div className="text-body-md text-[var(--color-text-default)]">Dec 12, 2026</div>
              </div>
              <div>
                <div className="text-body-xs text-[var(--color-text-muted)] mb-1">Description</div>
                <div className="text-body-md text-[var(--color-text-default)]">-</div>
              </div>
            </VStack>
          </div>

          {/* Authentication Summary Card */}
          <div className="bg-[var(--color-surface-default)] rounded-2xl border border-[var(--color-border-default)] p-4 flex flex-col gap-4">
            <h6 className="text-heading-h6">Authentication Summary</h6>

            <div className="grid grid-cols-2 gap-4">
              {/* Today's Sign-ins */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] p-4 flex items-start justify-between">
                <VStack gap={3}>
                  <p className="text-label-lg text-[var(--color-text-default)]">Today's Sign-ins</p>
                  <VStack gap={2}>
                    <HStack gap={1} align="center">
                      <div
                        className="w-2 h-2 rounded-sm"
                        style={{ backgroundColor: 'var(--chart-color-2)' }}
                      />
                      <span className="text-label-sm text-[var(--color-text-subtle)]">
                        Success: 1,234 (96%)
                      </span>
                    </HStack>
                    <HStack gap={1} align="center">
                      <div
                        className="w-2 h-2 rounded-sm"
                        style={{ backgroundColor: 'var(--chart-color-7)' }}
                      />
                      <span className="text-label-sm text-[var(--color-text-subtle)]">
                        Failure: 45 (4%)
                      </span>
                    </HStack>
                  </VStack>
                </VStack>
                <SimplePieChart data={signInPieData} size={120} />
              </div>

              {/* MFA Adoption */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] p-4 flex items-start justify-between">
                <VStack gap={3}>
                  <p className="text-label-lg text-[var(--color-text-default)]">MFA adoption</p>
                  <VStack gap={2}>
                    <HStack gap={1} align="center">
                      <div
                        className="w-2 h-2 rounded-sm"
                        style={{ backgroundColor: 'var(--chart-color-2)' }}
                      />
                      <span className="text-label-sm text-[var(--color-text-subtle)]">
                        Enabled: 117 (78%)
                      </span>
                    </HStack>
                    <HStack gap={1} align="center">
                      <div
                        className="w-2 h-2 rounded-sm"
                        style={{ backgroundColor: 'var(--color-border-default)' }}
                      />
                      <span className="text-label-sm text-[var(--color-text-subtle)]">
                        Disabled: 33 (22%)
                      </span>
                    </HStack>
                  </VStack>
                </VStack>
                <SimplePieChart data={mfaPieData} size={120} />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: User Status */}
        <div className="bg-[var(--color-surface-default)] rounded-2xl border border-[var(--color-border-default)] p-4 flex flex-col gap-4">
          <h6 className="text-heading-h6">User Status</h6>
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total" value="150" variant="default" />
            <StatCard label="Online" value="50" variant="success" />
            <StatCard label="Disabled" value="27" variant="danger" />
            <StatCard label="Locked" value="3" variant="primary" />
          </div>
        </div>

        {/* Row 3: IAM Resources + Recent Events */}
        <div className="grid grid-cols-[320px_1fr] gap-6">
          {/* IAM Resources */}
          <div className="bg-[var(--color-surface-default)] rounded-2xl border border-[var(--color-border-default)] p-4 flex flex-col gap-4">
            <h6 className="text-heading-h6">IAM Resources</h6>
            <VStack gap={2}>
              <ResourceCard label="Users" value="24" />
              <ResourceCard label="Roles" value="8" />
              <ResourceCard label="Policies" value="15" />
              <ResourceCard label="User Groups" value="6" />
              <ResourceCard label="Domains" value="3" />
            </VStack>
          </div>

          {/* Recent Events */}
          <div className="bg-[var(--color-surface-default)] rounded-2xl border border-[var(--color-border-default)] p-4 flex flex-col gap-4 min-w-0">
            <h6 className="text-heading-h6">Recent Events</h6>
            <OverlayScrollbarsComponent
              options={{
                overflow: { x: 'scroll', y: 'hidden' },
                scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
              }}
              defer={false}
            >
              <Table<EventRow> columns={eventsColumns} data={eventsData} rowKey="id" />
            </OverlayScrollbarsComponent>
          </div>
        </div>
      </VStack>
    </PageShell>
  );
}

export default IAMHomePage;
