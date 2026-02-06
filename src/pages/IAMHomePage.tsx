import { useState, useEffect } from 'react';
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
import { columnMinWidths } from '@/design-system/presets/columnWidths';
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
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      borderRadius: 6,
      padding: [8, 12],
      textStyle: {
        color: '#1e293b',
        fontSize: 11,
        fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
      },
      formatter: (params: { name: string; value: number; percent: number; color: string }) => {
        return `<span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${params.color}; margin-right: 6px;"></span>${params.name}<br/><span style="font-weight: 500; margin-left: 14px;">${params.value} (${params.percent.toFixed(0)}%)</span>`;
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
          fontSize: 12,
          fontWeight: 600,
          color: '#ffffff',
          fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        emphasis: {
          scale: true,
          scaleSize: 5,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
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
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

function StatCard({ label, value, variant = 'default' }: StatCardProps) {
  const bgColors = {
    default: 'bg-[var(--color-surface-subtle)]',
    success: 'bg-[var(--color-state-success-bg)]',
    warning: 'bg-[var(--color-state-warning-bg)]',
    danger: 'bg-[var(--color-state-danger-bg)]',
  };

  const textColor =
    value === '0' || value === 0
      ? 'text-[var(--color-text-muted)]'
      : 'text-[var(--color-text-default)]';

  return (
    <div className={`flex-1 ${bgColors[variant]} rounded-lg p-4`}>
      <div className={`text-[20px] font-medium ${textColor} pb-1`}>{value}</div>
      <div className="text-body-sm text-[var(--color-text-subtle)]">{label}</div>
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
      <p className="text-label-sm leading-[16px] text-[var(--color-text-subtle)]">{label}</p>
      <p className="text-heading-h4 text-[var(--color-text-default)]">{value}</p>
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
        <span className="text-[var(--color-action-primary)]">{value}</span>
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
          <div className="px-8 py-6">
            <VStack gap={6}>
              {/* Row 1: Domain Info + Authentication Summary */}
              <div className="grid grid-cols-[320px_1fr] gap-6">
                {/* Domain Info Card */}
                <div className="bg-[var(--color-surface-subtle)] rounded-2xl border border-[var(--color-border-default)] p-4 flex flex-col gap-6">
                  <h6 className="text-heading-h7">DOMAIN INFO</h6>
                  <h2 className="text-heading-h2 text-[var(--color-text-default)]">DomainA</h2>
                  <VStack gap={4} className="mt-auto">
                    <div>
                      <div className="text-body-xs text-[var(--color-text-muted)] mb-1">
                        Created at
                      </div>
                      <div className="text-body-md text-[var(--color-text-default)]">
                        Dec 12, 2025
                      </div>
                    </div>
                    <div>
                      <div className="text-body-xs text-[var(--color-text-muted)] mb-1">
                        Description
                      </div>
                      <div className="text-body-md text-[var(--color-text-default)]">-</div>
                    </div>
                  </VStack>
                </div>

                {/* Authentication Summary Card */}
                <div className="bg-[var(--color-surface-default)] rounded-2xl border border-[var(--color-border-default)] p-4 flex flex-col gap-4">
                  <h6 className="text-heading-h7">AUTHENTICATION SUMMARY</h6>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Today's Sign-ins */}
                    <div className="bg-[var(--color-surface-subtle)] rounded-lg p-4 flex items-start justify-between">
                      <VStack gap={3}>
                        <p className="text-label-lg text-[var(--color-text-default)]">
                          Today's Sign-ins
                        </p>
                        <VStack gap={2}>
                          <HStack gap={1} align="center">
                            <div className="w-2 h-2 rounded-sm bg-[#4ade80]" />
                            <span className="text-label-sm text-[var(--color-text-subtle)]">
                              Success: 1,234 (96%)
                            </span>
                          </HStack>
                          <HStack gap={1} align="center">
                            <div className="w-2 h-2 rounded-sm bg-[#f87171]" />
                            <span className="text-label-sm text-[var(--color-text-subtle)]">
                              Failure: 45 (4%)
                            </span>
                          </HStack>
                        </VStack>
                      </VStack>
                      <SimplePieChart
                        data={[
                          { name: 'Success', value: 1234, color: '#4ade80' },
                          { name: 'Failure', value: 45, color: '#f87171' },
                        ]}
                        size={100}
                      />
                    </div>

                    {/* MFA Adoption */}
                    <div className="bg-[var(--color-surface-subtle)] rounded-lg p-4 flex items-start justify-between">
                      <VStack gap={3}>
                        <p className="text-label-lg text-[var(--color-text-default)]">
                          MFA adoption
                        </p>
                        <VStack gap={2}>
                          <HStack gap={1} align="center">
                            <div className="w-2 h-2 rounded-sm bg-[#4ade80]" />
                            <span className="text-label-sm text-[var(--color-text-subtle)]">
                              Enabled: 117 (78%)
                            </span>
                          </HStack>
                          <HStack gap={1} align="center">
                            <div className="w-2 h-2 rounded-sm bg-[#e2e8f0]" />
                            <span className="text-label-sm text-[var(--color-text-subtle)]">
                              Disabled: 33 (22%)
                            </span>
                          </HStack>
                        </VStack>
                      </VStack>
                      <SimplePieChart
                        data={[
                          { name: 'Enabled', value: 117, color: '#4ade80' },
                          { name: 'Disabled', value: 33, color: '#e2e8f0' },
                        ]}
                        size={100}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: User Status */}
              <div className="bg-[var(--color-surface-default)] rounded-2xl border border-[var(--color-border-default)] p-4 flex flex-col gap-4">
                <h6 className="text-heading-h7">USER STATUS</h6>
                <div className="grid grid-cols-4 gap-4">
                  <StatCard label="Total" value="150" variant="default" />
                  <StatCard label="Online" value="50" variant="success" />
                  <StatCard label="Disabled" value="27" variant="danger" />
                  <StatCard label="Locked" value="3" variant="warning" />
                </div>
              </div>

              {/* Row 3: IAM Resources + Recent Events */}
              <div className="grid grid-cols-[320px_1fr] gap-6">
                {/* IAM Resources */}
                <div className="bg-[var(--color-surface-default)] rounded-2xl border border-[var(--color-border-default)] p-4 flex flex-col gap-4">
                  <h6 className="text-heading-h7">IAM RESOURCES</h6>
                  <VStack gap={2}>
                    <ResourceCard label="User group" value="13" />
                    <ResourceCard label="Roles" value="13" />
                    <ResourceCard label="Policies" value="13" />
                  </VStack>
                </div>

                {/* Recent Events */}
                <div className="bg-[var(--color-surface-default)] rounded-2xl border border-[var(--color-border-default)] p-4 flex flex-col gap-4 min-w-0">
                  <h6 className="text-heading-h7">RECENT EVENTS</h6>
                  <div className="overflow-x-auto">
                    <Table<EventRow> columns={eventsColumns} data={eventsData} rowKey="id" />
                  </div>
                </div>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default IAMHomePage;
