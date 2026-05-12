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
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate } from 'react-router-dom';
import aiPlatformLogoSrc from '@/assets/icons/ai-platform-logo.png';
import { IconPackage } from '@tabler/icons-react';
import { DataTestToolbar, type DataMode } from './shared';

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

const ITEMS_PER_PAGE = 16;

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
  const [dataMode, setDataMode] = useState<DataMode>('few');

  const manyThaki = useMemo(() => {
    const base = THAKI_PACKAGES[0];
    return Array.from({ length: 30 }, (_, i) => ({ ...base, title: `Thaki Package ${i + 1}` }));
  }, []);
  const manyCommon = useMemo(() => {
    const base = COMMON_PACKAGES[0];
    return Array.from({ length: 30 }, (_, i) => ({ ...base, title: `Common Package ${i + 1}` }));
  }, []);

  const packages = useMemo(() => {
    if (dataMode === 'empty') return [];
    const thaki = dataMode === 'many' ? manyThaki : THAKI_PACKAGES;
    const common = dataMode === 'many' ? manyCommon : COMMON_PACKAGES;
    if (activeTab === 'thaki') return thaki;
    if (activeTab === 'common') return common;
    return [...thaki, ...common];
  }, [activeTab, dataMode, manyThaki, manyCommon]);

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
          actions={<AiPlatformTopBarActions />}
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
          totalPages={Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))}
          onPageChange={setCurrentPage}
          totalItems={filtered.length}
        />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 w-full py-[120px] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
            <span className="text-label-lg text-[var(--color-text-default)]">
              No packages available
            </span>
            <span className="text-body-md text-[var(--color-text-default)] text-center">
              Packages will appear here when available for deployment.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(4,minmax(0,1fr))] items-start gap-4">
            {filtered
              .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
              .map((pkg, i) => (
                <PackageCard
                  key={`${pkg.title}-${i}`}
                  {...pkg}
                  onDeploy={() => console.log('Deploy', pkg.title)}
                />
              ))}
          </div>
        )}
      </VStack>

      <DataTestToolbar mode={dataMode} onChange={setDataMode} />
    </PageShell>
  );
}

export default PackagesPage;
