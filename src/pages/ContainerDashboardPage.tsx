import { useState } from 'react';
import {
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  SectionCard,
  Table,
  Button,
  Pagination,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconRefresh,
  IconHelp,
  IconExternalLink,
  IconCheck,
} from '@tabler/icons-react';

/* ----------------------------------------
   Capacity Gauge Chart Component
   ---------------------------------------- */

interface GaugeChartProps {
  title: string;
  subtitle?: string;
  usedValue: string;
  usedPercent: number;
  reservedValue?: string;
  reservedPercent?: number;
  maxValue: string;
  usedColor?: string;
  reservedColor?: string;
}

function GaugeChart({
  title,
  subtitle,
  usedValue,
  usedPercent,
  reservedValue,
  reservedPercent,
  maxValue,
  usedColor = '#f87171',
  reservedColor = '#22c55e',
}: GaugeChartProps) {
  const size = 120;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate stroke offsets for the arcs
  const usedOffset = circumference * (1 - usedPercent / 100);
  const reservedOffset = reservedPercent ? circumference * (1 - reservedPercent / 100) : circumference;
  
  return (
    <div className="flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-2">
        <p className="text-[12px] font-medium text-[var(--color-text-default)]">{title}</p>
        {subtitle && <p className="text-[12px] font-medium text-[var(--color-text-default)]">{subtitle}</p>}
      </div>
      
      {/* Gauge */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border-default)"
            strokeWidth={strokeWidth}
          />
          {/* Reserved arc (if exists) */}
          {reservedPercent && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={reservedColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={reservedOffset}
              strokeLinecap="round"
              opacity={0.7}
            />
          )}
          {/* Used arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={usedColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={usedOffset}
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 space-y-1 w-full">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: usedColor }} />
            <span className="font-medium text-[var(--color-text-default)]">Used</span>
          </div>
          <span className="text-[12px] text-[var(--color-text-default)]">{usedValue}</span>
        </div>
        {reservedValue && (
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-sm opacity-70" style={{ backgroundColor: reservedColor }} />
              <span className="font-medium text-[var(--color-text-default)]">Reserved</span>
            </div>
            <span className="text-[12px] text-[var(--color-text-default)]">{reservedValue}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm bg-black opacity-50" />
            <span className="font-medium text-[var(--color-text-default)]">Maximum</span>
          </div>
          <span className="text-[12px] text-[var(--color-text-default)]">{maxValue}</span>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Control Plane Component Card
   ---------------------------------------- */

interface ControlPlaneCardProps {
  name: string;
  uptime: string;
  status?: 'healthy' | 'warning' | 'error';
}

function ControlPlaneCard({ name, uptime, status = 'healthy' }: ControlPlaneCardProps) {
  return (
    <div className="flex-1 bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[6px] px-4 py-3 flex items-center gap-3">
      {/* Status Icon */}
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
        status === 'healthy' ? 'bg-[var(--color-state-success-bg)]' : 
        status === 'warning' ? 'bg-[var(--color-state-warning-bg)]' : 
        'bg-[var(--color-state-danger-bg)]'
      }`}>
        <IconCheck size={12} className={`${
          status === 'healthy' ? 'text-[var(--color-state-success)]' : 
          status === 'warning' ? 'text-[var(--color-state-warning)]' : 
          'text-[var(--color-state-danger)]'
        }`} stroke={2} />
      </div>
      
      {/* Info */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-[var(--color-text-default)]">{name}</span>
          <IconHelp size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
        </div>
        <span className="text-[12px] text-[var(--color-text-muted)] opacity-60">Uptime: {uptime}</span>
      </div>
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
  { id: '1', reason: 'Pulling', object: 'Pod object', message: 'Pulling image "nginx:lastest"', name: 'testpod.1872cb50f1f3985b', firstSeen: '2d8h', lastSeen: '5m2s', count: 666 },
  { id: '2', reason: 'Failed', object: 'Pod object', message: 'Failed to pull image "nginx:lastest": rpc error: code = NotFound desc = failed to pull and unpack image...', name: 'testpod.1872cb51519dc95b', firstSeen: '2d8h', lastSeen: '5m2s', count: 664 },
  { id: '3', reason: 'FailedGetScale', object: 'HorizontalPodAutoscaler object', message: 'Back-off pulling image "nginx:lastest"', name: 'test.1870aa1e813aa422', firstSeen: '9d', lastSeen: '54s', count: 53607 },
  { id: '4', reason: 'BackOff', object: 'Pod object', message: 'Error: ImagePullBackOff', name: 'testpod.1872cb51804912b6', firstSeen: '2d8h', lastSeen: '4s', count: 14495 },
  { id: '5', reason: 'Failed', object: 'Pod object', message: 'Error: ImagePullBackOff', name: 'testpod.1872cb5180493d50', firstSeen: '2d8h', lastSeen: '4s', count: 14495 },
];

const eventsColumns = [
  { key: 'reason', label: 'Reason', width: '160px', sortable: true },
  { 
    key: 'object', 
    label: 'Object', 
    width: '160px', 
    sortable: true,
    render: (value: string) => (
      <span className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline">{value}</span>
    )
  },
  { key: 'message', label: 'Message', flex: 1, sortable: true },
  { 
    key: 'name', 
    label: 'Name', 
    flex: 1, 
    sortable: true,
    render: (value: string) => (
      <span className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline">{value}</span>
    )
  },
  { key: 'firstSeen', label: 'First Seen', width: '120px', sortable: true },
  { key: 'lastSeen', label: 'Last Seen', width: '120px', sortable: true },
  { key: 'count', label: 'Count', width: '120px', sortable: true },
];

/* ----------------------------------------
   Container Dashboard Page
   ---------------------------------------- */

export function ContainerDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const [currentPage, setCurrentPage] = useState(1);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();

  // Calculate sidebar width (40px icon sidebar + 200px menu sidebar)
  const sidebarWidth = sidebarOpen ? 240 : 0;

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

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
        />

        {/* Top Bar */}
        <TopBar>
          <Breadcrumb
            items={[
              { label: 'clusterName', href: '/container' },
              { label: 'Dashboard' },
            ]}
          />
          <TopBarAction>
            <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
              <IconRefresh size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
            <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
              <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
          </TopBarAction>
        </TopBar>

        {/* Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={6} className="min-w-[1176px]">
              {/* Basic Information & Capacity */}
              <div className="grid grid-cols-2 gap-6">
                {/* Basic Information Card */}
                <SectionCard>
                  <SectionCard.Header title="Basic Information" />
                  <SectionCard.Content>
                    <div className="grid grid-cols-2 gap-4">
                      <SectionCard.DataRow label="Architecture">amd64</SectionCard.DataRow>
                      <SectionCard.DataRow label="Kubernetes Version">v1.33.4+k3s1</SectionCard.DataRow>
                      <SectionCard.DataRow label="Total Resources">295</SectionCard.DataRow>
                      <SectionCard.DataRow label="Created At">2025-11-09 12:57</SectionCard.DataRow>
                      <SectionCard.DataRow label={
                        <span className="flex items-center gap-1">
                          Deployments
                          <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                        </span>
                      }>
                        15
                      </SectionCard.DataRow>
                      <SectionCard.DataRow label={
                        <span className="flex items-center gap-1">
                          Nodes
                          <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                        </span>
                      }>
                        1
                      </SectionCard.DataRow>
                    </div>
                  </SectionCard.Content>
                </SectionCard>

                {/* Capacity Card */}
                <SectionCard>
                  <SectionCard.Header title="Capacity" />
                  <SectionCard.Content>
                    <div className="grid grid-cols-3 gap-6 py-4">
                      <GaugeChart
                        title="CPU"
                        subtitle="(cores)"
                        usedValue="0.26 cores (3.3%)"
                        usedPercent={3.3}
                        reservedValue="4.21 cores (50.2%)"
                        reservedPercent={50.2}
                        maxValue="8 cores"
                      />
                      <GaugeChart
                        title="Memory"
                        subtitle="(GiB)"
                        usedValue="3.6 GiB (22.5%)"
                        usedPercent={22.5}
                        reservedValue="4.0 GiB (25.0%)"
                        reservedPercent={25}
                        maxValue="16.0 GiB"
                      />
                      <GaugeChart
                        title="Pods"
                        usedValue="51 (46.4%)"
                        usedPercent={46.4}
                        maxValue="110"
                        usedColor="#000000"
                      />
                    </div>
                  </SectionCard.Content>
                </SectionCard>
              </div>

              {/* Control Plane Components */}
              <SectionCard>
                <SectionCard.Header title="Control Plane Components" />
                <SectionCard.Content>
                  <div className="flex gap-1">
                    <ControlPlaneCard name="Etcd" uptime="15d 4h 23m" />
                    <ControlPlaneCard name="Scheduler" uptime="15d 4h 23m" />
                    <ControlPlaneCard name="Controller Manager" uptime="15d 4h 23m" />
                  </div>
                </SectionCard.Content>
              </SectionCard>

              {/* Events & Secrets */}
              <SectionCard>
                <SectionCard.Content gap={0}>
                  <div className="w-full">
                    <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="md">
                      <div className="flex items-center justify-between border-b border-[var(--color-border-default)] mb-4">
                        <TabList>
                          <Tab value="events">Events</Tab>
                          <Tab value="secrets">Secrets</Tab>
                        </TabList>
                        <Button variant="secondary" size="sm">
                          Full Events List
                        </Button>
                      </div>

                      <TabPanel value="events" className="pt-0">
                        <VStack gap={3}>
                          <Table<EventRow>
                            columns={eventsColumns}
                            data={eventsData}
                            rowKey="id"
                            rowHeight="40px"
                          />
                          <div className="flex items-center gap-2">
                            <Pagination
                              currentPage={currentPage}
                              totalPages={1}
                              onPageChange={setCurrentPage}
                            />
                          </div>
                        </VStack>
                      </TabPanel>

                      <TabPanel value="secrets" className="pt-0">
                        <div className="text-center py-8 text-[var(--color-text-muted)]">
                          No secrets found
                        </div>
                      </TabPanel>
                    </Tabs>
                  </div>
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContainerDashboardPage;

