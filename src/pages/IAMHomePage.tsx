import { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  type TableColumn,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconSearch } from '@tabler/icons-react';

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
    time: 'Dec 12, 25 18:30:39',
    event: 'Sign-in',
    user: 'thaki.kim',
    target: '-',
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
    time: 'Dec 12, 25 18:32:25',
    event: 'Sign-in',
    user: 'sara.connor',
    target: '-',
    result: 'Success',
    ipAddress: '192.168.1.102',
  },
];

/* ----------------------------------------
   Half Donut Chart Component (ECharts Gauge - from design system)
   ---------------------------------------- */

interface HalfDonutChartProps {
  percentage: number;
  primaryColor?: string;
  secondaryColor?: string;
  label?: string;
  value?: string;
  /** Tooltip data for primary segment (e.g., Success) */
  primaryTooltip?: { label: string; value: string; percent: number };
  /** Tooltip data for secondary segment (e.g., Failure) */
  secondaryTooltip?: { label: string; value: string; percent: number };
}

// Get color from design system CSS variables
const getColor = (cssVar: string, fallback: string) => {
  if (typeof window !== 'undefined') {
    const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    return value || fallback;
  }
  return fallback;
};

function HalfDonutChart({
  percentage,
  primaryColor = '#4ade80',
  secondaryColor,
  label,
  value,
  primaryTooltip,
  secondaryTooltip,
}: HalfDonutChartProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Chart dimensions
  const chartWidth = 120;
  const chartHeight = 100;
  const centerX = chartWidth * 0.5;
  const centerY = chartHeight * 0.65;
  const radius = Math.min(chartWidth, chartHeight) * 0.45;
  const arcWidth = 14;
  const innerRadius = radius - arcWidth;
  const outerRadius = radius;

  const bgColor = secondaryColor || getColor('--color-border-subtle', '#f1f5f9');

  // Check if mouse is over the gauge arc
  const isOverGaugeArc = (mx: number, my: number) => {
    const dx = mx - centerX;
    const dy = my - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < innerRadius - 4 || distance > outerRadius + 4) return false;

    let angle = Math.atan2(-dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    return angle >= 150 && angle <= 330;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      setMousePos({ x: relX, y: relY });
      setShowTooltip(isOverGaugeArc(relX, relY));
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const getOption = () => ({
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        center: ['50%', '65%'],
        radius: '90%',
        min: 0,
        max: 100,
        axisLine: {
          lineStyle: {
            width: 14,
            color: [
              [percentage / 100, primaryColor],
              [1, bgColor],
            ],
          },
        },
        pointer: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        title: {
          show: false,
        },
        detail: {
          show: false,
        },
      },
    ],
  });

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <ReactECharts
        option={getOption()}
        style={{ height: `${chartHeight}px`, width: `${chartWidth}px` }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4 pointer-events-none">
        {label && <span className="text-[10px] text-[var(--color-text-subtle)]">{label}</span>}
        {value && (
          <span className="text-[16px] font-semibold text-[var(--color-text-default)]">
            {value}
          </span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute z-10 backdrop-blur-[40px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-1.5 pointer-events-none whitespace-nowrap"
          style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}
        >
          {primaryTooltip && secondaryTooltip ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: primaryColor }} />
                <span className="text-[11px] leading-[14px] text-[var(--color-text-default)]">
                  {primaryTooltip.label}: {primaryTooltip.value} ({primaryTooltip.percent}%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-sm"
                  style={{ backgroundColor: secondaryColor || bgColor }}
                />
                <span className="text-[11px] leading-[14px] text-[var(--color-text-default)]">
                  {secondaryTooltip.label}: {secondaryTooltip.value} ({secondaryTooltip.percent}%)
                </span>
              </div>
            </div>
          ) : (
            <span className="text-[11px] leading-[14px] text-[var(--color-text-default)]">
              {percentage}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   Stat Card Component
   ---------------------------------------- */

interface StatCardProps {
  label: string;
  value: string | number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

function StatCard({ label, value, variant = 'default' }: StatCardProps) {
  const bgColors = {
    default: 'bg-[var(--color-surface-subtle)]',
    success: 'bg-[var(--inline-message-success-bg)]',
    warning: 'bg-[var(--inline-message-warning-bg)]',
    danger: 'bg-[var(--inline-message-error-bg)]',
  };

  return (
    <div className={`flex-1 ${bgColors[variant]} rounded-lg px-4 py-3 flex flex-col gap-1.5`}>
      <p className="text-[11px] leading-[16px] font-medium text-[var(--color-text-subtle)]">
        {label}
      </p>
      <p className="text-[18px] font-semibold text-[var(--color-text-default)]">{value}</p>
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
    <div className="bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3 flex flex-col gap-1.5">
      <p className="text-[11px] leading-[16px] font-medium text-[var(--color-text-subtle)]">
        {label}
      </p>
      <p className="text-[18px] font-semibold text-[var(--color-text-default)]">{value}</p>
    </div>
  );
}

/* ----------------------------------------
   IAM Home Page
   ---------------------------------------- */

export function IAMHomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('IAM home');
  }, [updateActiveTabLabel]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Events table columns
  const eventsColumns: TableColumn<EventRow>[] = [
    { key: 'time', label: 'Time', flex: 1, sortable: true },
    { key: 'event', label: 'Event', flex: 1, sortable: true },
    { key: 'user', label: 'User', flex: 1, sortable: true },
    { key: 'target', label: 'Target', flex: 1, sortable: true },
    {
      key: 'result',
      label: 'Result',
      flex: 1,
      sortable: true,
      render: (value: string) => (
        <span className="text-[var(--color-action-primary)]">{value}</span>
      ),
    },
    { key: 'ipAddress', label: 'IP address', flex: 1, sortable: true },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          breadcrumb={<Breadcrumb items={[{ label: 'IAM' }, { label: 'Home' }]} />}
          actions={
            <>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
            </>
          }
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-3 px-8 pb-20 bg-[var(--color-surface-subtle)] min-h-full">
            <VStack gap={3}>
              {/* Row 1: Domain Info + Authentication Summary */}
              <HStack gap={3} align="stretch">
                {/* Domain Info Card */}
                <div className="w-[var(--wizard-summary-width)] shrink-0 bg-[var(--color-surface-default)] rounded-lg p-4 flex flex-col gap-6">
                  <h2 className="text-[24px] font-semibold text-[var(--color-text-default)]">
                    DomainA
                  </h2>
                  <VStack gap={2}>
                    <HStack gap={2}>
                      <span className="text-[12px] font-medium text-[var(--color-text-default)]">
                        Created at
                      </span>
                      <span className="text-[12px] text-[var(--color-text-default)]">
                        Dec 12, 2025
                      </span>
                    </HStack>
                    <HStack gap={2}>
                      <span className="text-[12px] font-medium text-[var(--color-text-default)]">
                        Description
                      </span>
                      <span className="text-[12px] text-[var(--color-text-default)]">-</span>
                    </HStack>
                  </VStack>
                </div>

                {/* Authentication Summary Card */}
                <div className="flex-1 bg-[var(--color-surface-default)] rounded-lg pt-3 pb-4 px-4 flex flex-col gap-3">
                  <h3 className="text-[14px] font-semibold text-[var(--color-text-default)]">
                    Authentication summary
                  </h3>

                  <HStack gap={3}>
                    {/* Today's Sign-ins */}
                    <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg p-4 flex items-start justify-between">
                      <VStack gap={3}>
                        <p className="text-[14px] font-medium text-[var(--color-text-default)]">
                          Today's Sign-ins
                        </p>
                        <VStack gap={2}>
                          <HStack gap={1} align="center">
                            <div className="w-[3px] h-[3px] rounded-full bg-[#4ade80]" />
                            <span className="text-[11px] font-medium text-[var(--color-text-subtle)]">
                              Success: 1,234 (96%)
                            </span>
                          </HStack>
                          <HStack gap={1} align="center">
                            <div className="w-[3px] h-[3px] rounded-full bg-[#f87171]" />
                            <span className="text-[11px] font-medium text-[var(--color-text-subtle)]">
                              Failure: 45 (4%)
                            </span>
                          </HStack>
                        </VStack>
                      </VStack>
                      <HalfDonutChart
                        percentage={96}
                        primaryColor="#4ade80"
                        secondaryColor="#f87171"
                        label="Total"
                        value="1,279"
                        primaryTooltip={{ label: 'Success', value: '1,234', percent: 96 }}
                        secondaryTooltip={{ label: 'Failure', value: '45', percent: 4 }}
                      />
                    </div>

                    {/* MFA Adoption */}
                    <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg p-4 flex items-start justify-between">
                      <VStack gap={3}>
                        <p className="text-[14px] font-medium text-[var(--color-text-default)]">
                          MFA adoption
                        </p>
                        <VStack gap={2}>
                          <HStack gap={1} align="center">
                            <div className="w-[3px] h-[3px] rounded-full bg-[#4ade80]" />
                            <span className="text-[11px] font-medium text-[var(--color-text-subtle)]">
                              Enabled: 117 (78%)
                            </span>
                          </HStack>
                          <HStack gap={1} align="center">
                            <div className="w-[3px] h-[3px] rounded-full bg-[#e2e8f0]" />
                            <span className="text-[11px] font-medium text-[var(--color-text-subtle)]">
                              Disabled: 33 (22%)
                            </span>
                          </HStack>
                        </VStack>
                      </VStack>
                      <HalfDonutChart
                        percentage={78}
                        primaryColor="#4ade80"
                        secondaryColor="#e2e8f0"
                        value="78%"
                        primaryTooltip={{ label: 'Enabled', value: '117', percent: 78 }}
                        secondaryTooltip={{ label: 'Disabled', value: '33', percent: 22 }}
                      />
                    </div>
                  </HStack>
                </div>
              </HStack>

              {/* Row 2: User Status */}
              <div className="bg-[var(--color-surface-default)] rounded-lg pt-3 pb-4 px-4 flex flex-col gap-3">
                <h3 className="text-[14px] font-semibold text-[var(--color-text-default)]">
                  User status
                </h3>
                <HStack gap={2}>
                  <StatCard label="Total" value="150" variant="default" />
                  <StatCard label="Online" value="50" variant="success" />
                  <StatCard label="Disabled" value="27" variant="danger" />
                  <StatCard label="Locked" value="3" variant="warning" />
                </HStack>
              </div>

              {/* Row 3: IAM Resources + Recent Events */}
              <HStack gap={3} align="start">
                {/* IAM Resources */}
                <div className="w-[var(--wizard-summary-width)] shrink-0 bg-[var(--color-surface-default)] rounded-lg pt-3 pb-4 px-4 flex flex-col gap-3">
                  <h3 className="text-[14px] font-semibold text-[var(--color-text-default)]">
                    IAM resources
                  </h3>
                  <VStack gap={2}>
                    <ResourceCard label="User group" value="13" />
                    <ResourceCard label="Roles" value="13" />
                    <ResourceCard label="Policies" value="13" />
                  </VStack>
                </div>

                {/* Recent Events */}
                <div className="flex-1 bg-[var(--color-surface-default)] rounded-lg p-4 flex flex-col gap-3">
                  <h3 className="text-[14px] font-semibold text-[var(--color-text-default)]">
                    Recent events
                  </h3>
                  <Table<EventRow> columns={eventsColumns} data={eventsData} rowKey="id" />
                </div>
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default IAMHomePage;
