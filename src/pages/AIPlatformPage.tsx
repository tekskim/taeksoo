import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
} from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconSearch,
  IconRefresh,
  IconServer,
  IconCpu,
  IconDatabase,
  IconBolt,
  IconRocket,
  IconApi,
  IconSettings2,
  IconChartLine,
  IconBox,
  IconTemplate,
  IconCloudComputing,
  IconClock,
  IconCalendar,
} from '@tabler/icons-react';

/* ----------------------------------------
   Resource Card Component (My Resource Usage / Queue Status style)
   ---------------------------------------- */

interface ResourceCardProps {
  title: string;
  icon: React.ReactNode;
  iconBgColor: string;
  children: React.ReactNode;
}

function ResourceCard({ title, icon, iconBgColor, children }: ResourceCardProps) {
  return (
    <div className="flex-1 bg-[var(--color-surface-default)] rounded-lg p-5 border border-[var(--color-border-subtle)]">
      <HStack gap={4} align="start">
        <div 
          className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
        <VStack gap={2} className="flex-1">
          <h3 className="text-[14px] font-semibold text-[var(--color-text-default)]">{title}</h3>
          {children}
        </VStack>
      </HStack>
    </div>
  );
}

/* ----------------------------------------
   Stat Metric Card Component (Active Nodes, CPU, Memory, GPUs style)
   ---------------------------------------- */

interface StatMetricProps {
  icon: React.ReactNode;
  iconBgColor: string;
  value: string;
  label: string;
  subLabel?: string;
}

function StatMetricCard({ icon, iconBgColor, value, label, subLabel }: StatMetricProps) {
  return (
    <div className="flex-1 bg-[var(--color-surface-default)] rounded-lg p-4 border border-[var(--color-border-subtle)]">
      <HStack gap={4} align="center">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
        <VStack gap={0.5}>
          <span className="text-[18px] font-semibold text-[var(--color-text-default)]">{value}</span>
          <span className="text-[12px] text-[var(--color-text-subtle)]">{label}</span>
          {subLabel && (
            <span className="text-[11px] text-[var(--color-text-subtle)]">{subLabel}</span>
          )}
        </VStack>
      </HStack>
    </div>
  );
}

/* ----------------------------------------
   Quick Action Card Component
   ---------------------------------------- */

interface QuickActionProps {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  description: string;
  onClick?: () => void;
}

function QuickActionCard({ icon, iconBgColor, title, description, onClick }: QuickActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)] rounded-lg p-6 border border-[var(--color-border-subtle)] cursor-pointer transition-colors text-center"
    >
      <VStack gap={3} align="center">
        <div 
          className="w-14 h-14 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
        <VStack gap={1}>
          <span className="text-[14px] font-semibold text-[var(--color-text-default)]">{title}</span>
          <span className="text-[12px] text-[var(--color-text-subtle)]">{description}</span>
        </VStack>
      </VStack>
    </button>
  );
}

/* ----------------------------------------
   Service Overview Card Component
   ---------------------------------------- */

interface ServiceCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  count: number;
  onClick?: () => void;
}

function ServiceCard({ icon, iconBgColor, title, count, onClick }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)] rounded-lg p-5 border border-[var(--color-border-subtle)] cursor-pointer transition-colors text-center"
    >
      <VStack gap={3} align="center">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
        <VStack gap={0.5}>
          <span className="text-[18px] font-semibold text-[var(--color-text-default)]">{count}</span>
          <span className="text-[12px] text-[var(--color-text-subtle)]">{title}</span>
        </VStack>
      </VStack>
    </button>
  );
}

/* ----------------------------------------
   AI Platform Page
   ---------------------------------------- */

export function AIPlatformPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } = useTabs();

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('AI Platform');
  }, [updateActiveTabLabel]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabs.map(tab => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
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
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'AI Platform' },
                { label: 'Dashboard' },
              ]}
            />
          }
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
            <VStack gap={6}>
              {/* Header */}
              <HStack justify="between" align="center">
                <VStack gap={1}>
                  <h1 className="text-[24px] font-semibold text-[var(--color-text-default)]">Dashboard</h1>
                  <p className="text-[14px] text-[var(--color-text-subtle)]">View cluster overview at a glance</p>
                </VStack>
                <Button variant="secondary" size="sm" icon={<IconRefresh size={14} stroke={1.5} />}>
                  Refresh
                </Button>
              </HStack>

              {/* Row 1: My Resource Usage + Queue Status */}
              <HStack gap={4}>
                <ResourceCard
                  title="My Resource Usage"
                  icon={<IconServer size={24} className="text-[#3b82f6]" stroke={1.5} />}
                  iconBgColor="#eff6ff"
                >
                  <VStack gap={1}>
                    <HStack justify="between">
                      <span className="text-[12px] text-[var(--color-text-subtle)]">Running Jobs:</span>
                      <span className="text-[12px] font-medium text-[var(--color-text-default)]">3</span>
                    </HStack>
                    <HStack justify="between">
                      <span className="text-[12px] text-[var(--color-text-subtle)]">Pending Jobs:</span>
                      <span className="text-[12px] font-medium text-[var(--color-text-default)]">2</span>
                    </HStack>
                    <HStack justify="between">
                      <span className="text-[12px] text-[var(--color-text-subtle)]">Queue:</span>
                      <span className="text-[12px] font-medium text-[var(--color-text-default)]">default</span>
                    </HStack>
                  </VStack>
                </ResourceCard>

                <ResourceCard
                  title="Queue Status"
                  icon={<IconDatabase size={24} className="text-[#8b5cf6]" stroke={1.5} />}
                  iconBgColor="#f5f3ff"
                >
                  <VStack gap={1}>
                    <HStack justify="between">
                      <span className="text-[12px] text-[var(--color-text-subtle)]">My Pending Jobs:</span>
                      <span className="text-[12px] font-medium text-[var(--color-text-default)]">2</span>
                    </HStack>
                    <HStack justify="between">
                      <span className="text-[12px] text-[var(--color-text-subtle)]">My Running Jobs:</span>
                      <span className="text-[12px] font-medium text-[var(--color-text-default)]">3</span>
                    </HStack>
                    <div className="pt-1">
                      <span className="text-[12px] font-medium text-[var(--color-text-default)]">5 active jobs</span>
                      <p className="text-[11px] text-[var(--color-text-subtle)]">You have jobs in progress</p>
                    </div>
                  </VStack>
                </ResourceCard>
              </HStack>

              {/* Row 2: Resource Metrics */}
              <HStack gap={4}>
                <StatMetricCard
                  icon={<IconServer size={20} className="text-[#3b82f6]" stroke={1.5} />}
                  iconBgColor="#eff6ff"
                  value="15 / 15"
                  label="Active Nodes"
                />
                <StatMetricCard
                  icon={<IconCpu size={20} className="text-[#10b981]" stroke={1.5} />}
                  iconBgColor="#ecfdf5"
                  value="61.9%"
                  label="CPU (299 / 484 cores)"
                />
                <StatMetricCard
                  icon={<IconDatabase size={20} className="text-[#f59e0b]" stroke={1.5} />}
                  iconBgColor="#fffbeb"
                  value="41.8%"
                  label="Memory GB"
                  subLabel="(1554 / 3719 GB)"
                />
                <StatMetricCard
                  icon={<IconBolt size={20} className="text-[#3b82f6]" stroke={1.5} />}
                  iconBgColor="#eff6ff"
                  value="14 / 18"
                  label="Active GPUs"
                />
              </HStack>

              {/* Row 3: Quick Actions */}
              <VStack gap={3}>
                <h2 className="text-[16px] font-semibold text-[var(--color-text-default)]">Quick Actions</h2>
                <HStack gap={4}>
                  <QuickActionCard
                    icon={<IconRocket size={24} className="text-[#3b82f6]" stroke={1.5} />}
                    iconBgColor="#eff6ff"
                    title="Deploy New Workload"
                    description="Deploy Pod or template"
                  />
                  <QuickActionCard
                    icon={<IconApi size={24} className="text-[#f59e0b]" stroke={1.5} />}
                    iconBgColor="#fffbeb"
                    title="Serverless Endpoint"
                    description="Create inference API"
                  />
                  <QuickActionCard
                    icon={<IconSettings2 size={24} className="text-[#10b981]" stroke={1.5} />}
                    iconBgColor="#ecfdf5"
                    title="Fine-tuning Job"
                    description="Start model training"
                  />
                  <QuickActionCard
                    icon={<IconChartLine size={24} className="text-[#8b5cf6]" stroke={1.5} />}
                    iconBgColor="#f5f3ff"
                    title="Detailed Monitoring"
                    description="Check resource trends"
                  />
                </HStack>
              </VStack>

              {/* Row 4: Service Overview */}
              <VStack gap={3}>
                <h2 className="text-[16px] font-semibold text-[var(--color-text-default)]">Service Overview</h2>
                <VStack gap={4}>
                  {/* Row 1 */}
                  <HStack gap={4}>
                    <ServiceCard
                      icon={<IconServer size={20} className="text-[#3b82f6]" stroke={1.5} />}
                      iconBgColor="#eff6ff"
                      title="Workloads"
                      count={4}
                    />
                    <ServiceCard
                      icon={<IconTemplate size={20} className="text-[#10b981]" stroke={1.5} />}
                      iconBgColor="#ecfdf5"
                      title="My Templates"
                      count={20}
                    />
                    <ServiceCard
                      icon={<IconBox size={20} className="text-[#3b82f6]" stroke={1.5} />}
                      iconBgColor="#eff6ff"
                      title="Storage"
                      count={40}
                    />
                    <ServiceCard
                      icon={<IconBolt size={20} className="text-[#f59e0b]" stroke={1.5} />}
                      iconBgColor="#fffbeb"
                      title="Serverless"
                      count={7}
                    />
                  </HStack>
                  {/* Row 2 */}
                  <HStack gap={4}>
                    <ServiceCard
                      icon={<IconSettings2 size={20} className="text-[#10b981]" stroke={1.5} />}
                      iconBgColor="#ecfdf5"
                      title="Fine-tuning"
                      count={0}
                    />
                    <ServiceCard
                      icon={<IconChartLine size={20} className="text-[#10b981]" stroke={1.5} />}
                      iconBgColor="#ecfdf5"
                      title="Benchmarks"
                      count={6}
                    />
                    <ServiceCard
                      icon={<IconDatabase size={20} className="text-[#3b82f6]" stroke={1.5} />}
                      iconBgColor="#eff6ff"
                      title="Datasets"
                      count={20}
                    />
                    <ServiceCard
                      icon={<IconCloudComputing size={20} className="text-[#8b5cf6]" stroke={1.5} />}
                      iconBgColor="#f5f3ff"
                      title="Models"
                      count={0}
                    />
                  </HStack>
                </VStack>
              </VStack>

              {/* Row 5: Recent Services */}
              <VStack gap={3}>
                <HStack gap={2} align="center">
                  <IconClock size={16} className="text-[var(--color-text-subtle)]" stroke={1.5} />
                  <h2 className="text-[16px] font-semibold text-[var(--color-text-default)]">Recent Services</h2>
                  <span className="text-[14px] text-[var(--color-text-subtle)]">(Last 24 hours)</span>
                </HStack>
                <div className="bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-subtle)] p-12">
                  <VStack gap={3} align="center">
                    <IconCalendar size={48} className="text-[var(--color-text-disabled)]" stroke={1} />
                    <span className="text-[14px] text-[var(--color-text-subtle)]">No services created in the last 24 hours.</span>
                  </VStack>
                </div>
              </VStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AIPlatformPage;
