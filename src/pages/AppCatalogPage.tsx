import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  SearchInput,
  PageShell,
  PageHeader,
  EmptyState,
  Tabs,
  TabList,
  Tab,
  SectionCard,
  Badge,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconRefresh, IconSearch, IconApps } from '@tabler/icons-react';
import type { CatalogChart, AppCategory } from '@/pages/apps/appsTypes';
import {
  catalogCharts,
  installedAppsMock,
  CATEGORIES,
} from '@/pages/apps/appsMockData';

const CURRENT_CLUSTER_ID = 'cluster-1';

/** First letter of each word uppercase (Title case). Hyphens treated as word boundaries. */
function toTitleCase(s: string): string {
  return s
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/* ----------------------------------------
   Catalog Chart Card (Packages Hub 스타일)
   Card 디자인: SectionCard + 그리드
   ---------------------------------------- */

interface CatalogChartCardProps {
  chart: CatalogChart;
  onInstall: (chart: CatalogChart) => void;
}

function CatalogChartCard({ chart, onInstall }: CatalogChartCardProps) {
  const [logoError, setLogoError] = useState(false);
  const alreadyInstalled = installedAppsMock.some((app) => app.name === chart.name);
  const categoryLabel = chart.category === 'Big Data' ? 'Big Data' : chart.category;
  const showLogo = chart.logoUrl && !logoError;

  return (
    <SectionCard className="!p-4 !gap-3 !border-[var(--color-border-subtle)]">
      <HStack gap={3} align="center" className="w-full">
        <div
          className="shrink-0 flex items-center justify-center w-14 min-h-[56px] rounded-[var(--radius-md)]"
          aria-hidden
        >
          {showLogo ? (
            <img
              src={chart.logoUrl}
              alt=""
              className="max-w-10 max-h-10 w-full h-full object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <IconApps
              size={28}
              className="text-[var(--color-action-primary)]"
              stroke={1.5}
            />
          )}
        </div>
        <VStack gap={1} className="flex-1 min-w-0">
          <span className="text-body-lg font-semibold text-[var(--color-text-default)]">
            {toTitleCase(chart.name)}
          </span>
          <span className="text-body-md text-[var(--color-text-subtle)]">
            Version: {chart.version}
          </span>
        </VStack>
      </HStack>
      <p className="text-body-md text-[var(--color-text-muted)] line-clamp-2">
        {chart.description}
      </p>
      <HStack gap={2} className="flex-wrap">
        <Badge variant="default" size="sm">
          {categoryLabel}
        </Badge>
      </HStack>
      <HStack justify="end" className="w-full pt-1">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onInstall(chart)}
        >
          {alreadyInstalled ? 'Upgrade' : 'Install'}
        </Button>
      </HStack>
    </SectionCard>
  );
}

/* ----------------------------------------
   Apps > Catalog (Cluster-scoped)
   Packages Hub와 유사한 Card 그리드 레이아웃
   ---------------------------------------- */

export function AppCatalogPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<AppCategory>('All');

  const filteredCharts = useMemo(() => {
    return catalogCharts.filter((c) => {
      const matchCategory = category === 'All' || c.category === category;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [category, searchQuery]);

  const handleInstall = (chart: CatalogChart) => {
    navigate(`/container/apps/catalog/${chart.name}/install`);
  };

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
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Apps', href: '/container/apps/catalog' },
                { label: 'Catalog' },
              ]}
            />
          }
          actions={
            <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
              <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
          }
        />
      }
      contentClassName="pt-3 px-8 pb-20 bg-[var(--color-surface-subtle)]"
    >
      <VStack gap={6}>
        <PageHeader
          title="Catalog"
          actions={
            <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={14} stroke={1.5} />}>
              Refresh
            </Button>
          }
        />

        <HStack gap={2} align="center">
          <SearchInput
            placeholder="Search by app name"
            size="sm"
            className="w-[var(--search-input-width)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </HStack>

        <Tabs value={category} onChange={(v) => setCategory(v as AppCategory)} variant="underline" size="sm">
          <TabList>
            {CATEGORIES.map((c) => (
              <Tab key={c} value={c}>
                {c}
              </Tab>
            ))}
          </TabList>
        </Tabs>

          {filteredCharts.length === 0 ? (
          <EmptyState
            variant="inline"
            icon={<IconSearch size={48} stroke={1} />}
            title="결과 없음"
            description="검색 조건에 맞는 서비스가 없습니다. 카테고리 또는 검색어를 변경해 보세요."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCharts.map((chart) => (
              <CatalogChartCard key={chart.id} chart={chart} onInstall={handleInstall} />
            ))}
          </div>
        )}
      </VStack>
    </PageShell>
  );
}

export default AppCatalogPage;
