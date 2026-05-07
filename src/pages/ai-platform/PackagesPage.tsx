import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  VStack,
  Button,
  Tabs,
  TabList,
  Tab,
  SearchInput,
  Pagination,
  PageShell,
  PageHeader,
  TabBar,
  TopBar,
  Breadcrumb,
  EmptyState,
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate } from 'react-router-dom';
import { IconBell } from '@tabler/icons-react';
import aiPlatformLogoSrc from '@/assets/icons/ai-platform-logo.png';
import { IconPackage } from '@tabler/icons-react';

interface PackageBadge {
  label: string;
  icon?: 'thaki' | 'common';
}

interface PackageCardProps {
  title: string;
  badges: PackageBadge[];
  onDeploy?: () => void;
}

function ThakiBadgeIcon() {
  return <img src={aiPlatformLogoSrc} alt="" width={12} height={12} className="shrink-0" />;
}

function PackageBadgeItem({ label, icon }: PackageBadge) {
  return (
    <span className="inline-flex items-center gap-1 rounded-[var(--radius-md)] bg-[#f3f4f6] px-1.5 py-0.5">
      {icon === 'thaki' && <ThakiBadgeIcon />}
      {icon === 'common' && (
        <IconPackage size={12} stroke={1.5} className="shrink-0 text-[var(--color-text-muted)]" />
      )}
      <span className="text-label-sm text-[var(--color-text-muted)]">{label}</span>
    </span>
  );
}

function PackageCard({ title, badges, onDeploy }: PackageCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4">
      <div className="flex flex-col gap-3">
        <p className="text-[16px] font-semibold leading-[24px] text-[var(--color-text-default)]">
          {title}
        </p>
        <div className="flex flex-wrap items-center gap-1">
          {badges.map((b, idx) => (
            <PackageBadgeItem key={`${b.label}-${idx}`} {...b} />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end">
        <Button variant="primary" size="sm" onClick={onDeploy}>
          Deploy
        </Button>
      </div>
    </div>
  );
}

const THAKI_PACKAGES: PackageCardProps[] = [
  {
    title: 'Title',
    badges: [{ label: 'Thaki image', icon: 'thaki' }, { label: 'Label' }],
  },
];

const COMMON_PACKAGES: PackageCardProps[] = [
  {
    title: 'Title',
    badges: [{ label: 'Common image', icon: 'common' }, { label: 'Label' }],
  },
];

export function PackagesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Packages');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const packages = useMemo(() => {
    if (activeTab === 'thaki') return THAKI_PACKAGES;
    if (activeTab === 'common') return COMMON_PACKAGES;
    return [...THAKI_PACKAGES, ...COMMON_PACKAGES];
  }, [activeTab]);

  const filtered = useMemo(() => {
    if (!searchQuery) return packages;
    return packages.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [packages, searchQuery]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
          breadcrumb={<Breadcrumb items={[{ label: 'Packages' }]} />}
          actions={
            <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
              <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={3}>
        <PageHeader title="Packages" />

        <Tabs value={activeTab} onChange={handleTabChange} variant="underline" size="sm">
          <TabList>
            <Tab value="all">All</Tab>
            <Tab value="thaki">Thaki images</Tab>
            <Tab value="common">Common images</Tab>
          </TabList>
        </Tabs>

        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Find packages"
          size="sm"
          className="w-[280px]"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
          totalItems={filtered.length}
        />

        {filtered.length === 0 ? (
          <EmptyState
            variant="inline"
            icon={<IconPackage size={48} stroke={1} />}
            title="No packages found"
            description="Try adjusting your search or filter criteria."
          />
        ) : (
          <div className="grid grid-cols-[repeat(4,minmax(0,1fr))] items-start gap-4">
            {filtered.map((pkg, i) => (
              <PackageCard
                key={`${pkg.title}-${i}`}
                {...pkg}
                onDeploy={() => console.log('Deploy', pkg.title)}
              />
            ))}
          </div>
        )}
      </VStack>
    </PageShell>
  );
}

export default PackagesPage;
