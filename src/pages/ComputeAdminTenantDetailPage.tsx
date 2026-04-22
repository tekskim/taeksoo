import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DetailHeader,
  SectionCard,
  PageShell,
  ProgressBar,
  Tooltip,
  STATUS_THRESHOLDS,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconCirclePlus,
  IconEdit,
  IconTrash,
  IconSettings,
  IconInfoCircle,
} from '@tabler/icons-react';

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
  tooltip?: string;
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
        createdAt: `${15 + (i % 15)} Jan, 2026`,
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
  {
    label: 'Key Pairs',
    used: 500,
    limit: 500,
    tooltip: 'Maximum number of key pairs each user can create in this tenant.',
  },
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

// Volume Type Quota Data
interface VolumeTypeQuota {
  name: string;
  quotas: QuotaItem[];
}

const volumeTypeQuotas: VolumeTypeQuota[] = [
  {
    name: 'Ssd-performance',
    quotas: [
      { label: 'Type', used: 8, limit: 10 },
      { label: 'Type Capacity', used: 10, limit: 100, unit: 'GiB' },
      { label: 'Type Snapshots', used: 9, limit: 10 },
    ],
  },
  {
    name: 'Hdd-standard',
    quotas: [
      { label: 'Type', used: 8, limit: 10 },
      { label: 'Type Capacity', used: 10, limit: 100, unit: 'GiB' },
      { label: 'Type Snapshots', used: 9, limit: 10 },
    ],
  },
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
  { label: 'Load balancers', used: 1, limit: 10 },
  { label: 'Listeners', used: 1, limit: 10 },
  { label: 'Members', used: 1, limit: 10, tooltip: 'Backend servers registered to a pool.' },
  { label: 'Pools', used: 1, limit: 10 },
  { label: 'Health monitors', used: 1, limit: 10 },
  { label: 'L7 policies', used: 1, limit: 10 },
  { label: 'L7 rules', used: 1, limit: 10 },
];

/* ----------------------------------------
   Quota Card Component
   ---------------------------------------- */

function QuotaCard({
  label,
  used,
  limit,
  unit,
  tooltip,
  showPercentage = true,
  coloredGauge = false,
}: QuotaItem & { showPercentage?: boolean; coloredGauge?: boolean }) {
  const percentage = Math.round((used / limit) * 100);

  const getBadgeTheme = (): 'red' | 'yellow' | 'green' => {
    if (percentage >= 100) return 'red';
    if (percentage >= 70) return 'yellow';
    return 'green';
  };

  return (
    <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] py-4 px-5 flex-1 min-w-0 h-[112px] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-label-md text-[var(--color-text-default)]">
          {label}
          {tooltip && (
            <Tooltip content={tooltip}>
              <IconInfoCircle size={14} className="text-[var(--color-text-subtle)]" />
            </Tooltip>
          )}
        </span>
        {showPercentage && (
          <Badge size="sm" type="subtle" theme={getBadgeTheme()}>
            {percentage}%
          </Badge>
        )}
      </div>

      <div className="flex items-baseline">
        <span className="text-heading-h3 text-[var(--color-text-default)]">{used}</span>
        <span className="text-body-lg text-[var(--color-text-subtle)]">
          /{limit}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>

      <ProgressBar
        value={used}
        max={limit}
        showValue={false}
        thresholds={STATUS_THRESHOLDS.computeAdmin}
      />
    </div>
  );
}

/* ----------------------------------------
   Quota Section Component
   ---------------------------------------- */

function QuotaSection({
  title,
  quotas,
  showPercentage = true,
  coloredGauge = false,
  volumeTypeGroups,
}: {
  title: string;
  quotas: QuotaItem[];
  showPercentage?: boolean;
  coloredGauge?: boolean;
  volumeTypeGroups?: VolumeTypeQuota[];
}) {
  return (
    <SectionCard>
      <SectionCard.Header title={title} />
      <SectionCard.Content>
        <VStack gap={6}>
          <div className="grid grid-cols-5 gap-4">
            {quotas.map((quota, index) => (
              <QuotaCard
                key={`${quota.label}-${index}`}
                {...quota}
                showPercentage={showPercentage}
                coloredGauge={coloredGauge}
              />
            ))}
          </div>
          {volumeTypeGroups &&
            volumeTypeGroups.map((group) => (
              <VStack key={group.name} gap={3}>
                <span
                  className="text-label-lg text-[var(--color-text-default)] truncate max-w-full"
                  title={group.name}
                >
                  {group.name}
                </span>
                <div className="grid grid-cols-5 gap-4">
                  {group.quotas.map((quota, index) => (
                    <QuotaCard
                      key={`${quota.label}-${index}`}
                      {...quota}
                      showPercentage={showPercentage}
                      coloredGauge={coloredGauge}
                    />
                  ))}
                </div>
              </VStack>
            ))}
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export default function ComputeAdminTenantDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'quotas';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

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
    <PageShell
      sidebar={
        <ComputeAdminSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
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
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'Tenants', href: '/compute-admin/tenants' }, { label: tenant.name }]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6} className="min-w-[1176px]">
        {/* Header Card */}
        <DetailHeader>
          <DetailHeader.Title>{tenant.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
              Modify quotas
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
              Edit
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconSettings size={12} />}>
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
            <DetailHeader.InfoCard label="Description" value={tenant.description || '-'} />
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
                <QuotaSection title="Compute quota" quotas={computeQuotas} coloredGauge={true} />
                <QuotaSection
                  title="Storage quota"
                  quotas={storageQuotas}
                  showPercentage={true}
                  coloredGauge={true}
                  volumeTypeGroups={volumeTypeQuotas}
                />
                <QuotaSection title="Network quota" quotas={networkQuotas} coloredGauge={true} />
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}
