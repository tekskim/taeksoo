import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DetailHeader,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconCirclePlus, IconEdit, IconTrash, IconUsers, IconBell } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface TenantDetail {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'deactivated' | 'building';
  enabled: boolean;
  createdAt: string;
}

interface QuotaItem {
  label: string;
  used: number;
  limit: number;
  unit?: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockTenantsMap: Record<string, TenantDetail> = Object.fromEntries(
  Array.from({ length: 115 }, (_, i) => {
    const id = `${String(i + 1).padStart(8, '0')}`;
    return [
      id,
      {
        id,
        name: `tenant ${String.fromCharCode(65 + (i % 26))}${i > 25 ? Math.floor(i / 26) : ''}`,
        description: i % 3 === 0 ? 'Production tenant' : i % 5 === 0 ? 'Development tenant' : '-',
        status: i === 4 ? 'deactivated' : i % 20 === 0 ? 'building' : 'active',
        enabled: i !== 4,
        createdAt: `${15 + (i % 15)} Jan, 2025`,
      },
    ];
  })
);

const defaultTenantDetail: TenantDetail = {
  id: 'unknown',
  name: 'Unknown Tenant',
  description: '-',
  status: 'deactivated',
  enabled: false,
  createdAt: '-',
};

// Compute Quota Data
const computeQuotas: QuotaItem[] = [
  { label: 'vCPU', used: 8, limit: 10 },
  { label: 'RAM', used: 10, limit: 100, unit: 'GiB' },
  { label: 'Instances', used: 9, limit: 10 },
  { label: 'Key Pairs', used: 500, limit: 500 },
  { label: 'Server Groups', used: 1, limit: 10 },
];

// Storage Quota Data
const storageQuotas: QuotaItem[] = [
  { label: 'Volumes', used: 8, limit: 10 },
  { label: 'Volume Capacity', used: 10, limit: 100, unit: 'GiB' },
  { label: 'Volume Snapshots', used: 9, limit: 10 },
  { label: 'Volume Backups', used: 500, limit: 500 },
  { label: 'Volume Backup Capacity', used: 1, limit: 10, unit: 'GiB' },
];

// Network Quota Data
const networkQuotas: QuotaItem[] = [
  { label: 'Routers', used: 8, limit: 10 },
  { label: 'Networks', used: 10, limit: 100, unit: 'GiB' },
  { label: 'Subnets', used: 9, limit: 10 },
  { label: 'Floating IPs', used: 500, limit: 500 },
  { label: 'Ports', used: 1, limit: 10 },
  { label: 'Security Groups', used: 1, limit: 10 },
  { label: 'Security Group Rules', used: 1, limit: 10 },
  { label: 'Firewalls', used: 1, limit: 10 },
  { label: 'Firewall Policies', used: 1, limit: 10 },
  { label: 'Firewall Rules', used: 1, limit: 10 },
];

/* ----------------------------------------
   Quota Card Component
   ---------------------------------------- */

function QuotaCard({ label, used, limit, unit }: QuotaItem) {
  const percentage = Math.round((used / limit) * 100);

  // Get badge colors based on percentage
  const getBadgeClasses = () => {
    if (percentage >= 100) {
      return 'bg-[var(--semantic-color-state-danger-bg)] text-[var(--semantic-color-state-danger)]';
    } else if (percentage >= 70) {
      return 'bg-[var(--semantic-color-state-warning-bg)] text-[var(--semantic-color-state-warning)]';
    } else {
      return 'bg-[var(--semantic-color-state-success-bg)] text-[var(--semantic-color-state-success)]';
    }
  };

  return (
    <div className="bg-[var(--color-surface-subtle)] rounded-lg p-5 flex-1 min-w-0">
      {/* Header with label and percentage badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-label-md text-[var(--color-text-default)]">{label}</span>
        <span className={`px-1.5 py-0.5 rounded-md text-label-sm ${getBadgeClasses()}`}>
          {percentage}%
        </span>
      </div>

      {/* Value display */}
      <div className="flex items-baseline mb-4">
        <span className="text-heading-h3 text-[var(--color-text-default)]">{used}</span>
        <span className="text-body-lg text-[var(--color-text-subtle)]">
          /{limit}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[var(--color-border-default)] rounded-sm overflow-hidden">
        <div
          className="h-full bg-[var(--color-text-muted)] rounded-sm transition-all"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

/* ----------------------------------------
   Quota Section Component
   ---------------------------------------- */

function QuotaSection({ title, quotas }: { title: string; quotas: QuotaItem[] }) {
  // Split quotas into rows of 5
  const rows: QuotaItem[][] = [];
  for (let i = 0; i < quotas.length; i += 5) {
    rows.push(quotas.slice(i, i + 5));
  }

  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-2xl p-6">
      {/* Section Title */}
      <h4 className="text-heading-h5 text-[var(--color-text-muted)] mb-6">{title}</h4>

      {/* Quota Cards Grid */}
      <div className="flex flex-col gap-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {row.map((quota, index) => (
              <QuotaCard key={`${quota.label}-${index}`} {...quota} />
            ))}
            {/* Fill remaining space if row has fewer than 5 items */}
            {row.length < 5 &&
              Array.from({ length: 5 - row.length }).map((_, i) => (
                <div key={`empty-${i}`} className="flex-1 min-w-0" />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export default function ComputeAdminTenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('quotas');

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Get tenant data based on URL ID
  const tenant = id ? mockTenantsMap[id] || defaultTenantDetail : defaultTenantDetail;

  // Update tab label to tenant name
  useEffect(() => {
    if (tenant.name) {
      updateActiveTabLabel(tenant.name);
    }
  }, [tenant.name, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Status mapping
  const statusMap: Record<string, 'active' | 'deactivated' | 'building'> = {
    active: 'active',
    deactivated: 'deactivated',
    building: 'building',
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            onTabReorder={moveTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Compute Admin', href: '/compute-admin' },
                  { label: 'Tenants', href: '/compute-admin/tenants' },
                  { label: tenant.name },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={12} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={8} className="min-w-[1176px]">
              {/* Header Card */}
              <DetailHeader>
                <DetailHeader.Title>{tenant.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                    Modify Quotas
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                    Edit
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Delete
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconUsers size={12} />}>
                    Manage member
                  </Button>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Status"
                    value={tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                    status={statusMap[tenant.status]}
                  />
                  <DetailHeader.InfoCard label="ID" value={tenant.id} copyable />
                  <DetailHeader.InfoCard label="Enabled" value={tenant.enabled ? 'Yes' : 'No'} />
                  <DetailHeader.InfoCard label="Created At" value={tenant.createdAt} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs Section */}
              <div className="w-full">
                <Tabs value={activeTab} onChange={setActiveTab}>
                  <TabList>
                    <Tab value="quotas">Quotas</Tab>
                  </TabList>

                  {/* Quotas Tab */}
                  <TabPanel value="quotas" className="pt-6">
                    <VStack gap={6}>
                      <QuotaSection title="Compute Quota" quotas={computeQuotas} />
                      <QuotaSection title="Storage Quota" quotas={storageQuotas} />
                      <QuotaSection title="Network Quota" quotas={networkQuotas} />
                    </VStack>
                  </TabPanel>
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}
