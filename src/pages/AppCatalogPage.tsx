/**
 * App Catalog — FR-001 앱 목록 조회, FR-002 앱 상세 조회, FR-003 앱 검색
 *
 * v1.0 제공 앱: PostgreSQL, nginx, Kafka, Valkey, Milvus
 * 카테고리 탭으로 필터링, 이름으로 검색 가능
 */
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
  Badge,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconSearch, IconPackage } from '@tabler/icons-react';
import type { CatalogChart, AppCategory } from '@/pages/apps/appsTypes';
import { catalogCharts, CATEGORIES } from '@/pages/apps/appsMockData';

/** 이름 표시용 — hyphen을 공백으로, 각 단어 첫 글자 대문자 */
function toDisplayName(s: string): string {
  return s
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/* ────────────────────────────────────────────────────────────
   Catalog Chart Card
   ──────────────────────────────────────────────────────────── */

interface CatalogChartCardProps {
  chart: CatalogChart;
  onInstall: (chart: CatalogChart) => void;
}

function CatalogChartCard({ chart, onInstall }: CatalogChartCardProps) {
  const [logoError, setLogoError] = useState(false);
  const showLogo = !!chart.logoUrl && !logoError;

  return (
    <div className="flex flex-col gap-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4 hover:border-[var(--color-border-strong)] transition-colors">
      {/* Header: icon + name + version */}
      <HStack gap={3} align="start" className="w-full">
        <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)]">
          {showLogo ? (
            <img
              src={chart.logoUrl}
              alt=""
              className="w-7 h-7 object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <IconPackage size={24} className="text-[var(--color-text-subtle)]" stroke={1.5} />
          )}
        </div>
        <VStack gap={0.5} className="flex-1 min-w-0 pt-0.5">
          <span className="text-heading-h6 text-[var(--color-text-default)]">
            {toDisplayName(chart.name)}
          </span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">v{chart.version}</span>
        </VStack>
      </HStack>

      {/* Description */}
      <p className="text-body-md text-[var(--color-text-muted)] line-clamp-3 flex-1">
        {chart.description}
      </p>

      {/* Footer: category + install button */}
      <HStack justify="between" align="center" className="w-full pt-1">
        <Badge variant="default" size="sm">
          {chart.category}
        </Badge>
        <Button variant="primary" size="sm" onClick={() => onInstall(chart)}>
          Install
        </Button>
      </HStack>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   AppCatalogPage
   ──────────────────────────────────────────────────────────── */

export function AppCatalogPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<AppCategory>('All');

  const filteredCharts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return catalogCharts.filter((c) => {
      const matchCategory = category === 'All' || c.category === category;
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
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4}>
        <PageHeader title="Catalog" />

        {/* Search + Category tabs */}
        <VStack gap={3}>
          <SearchInput
            placeholder="Search by app name"
            size="sm"
            className="w-[var(--search-input-width)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Tabs
            value={category}
            onChange={(v) => setCategory(v as AppCategory)}
            variant="underline"
            size="sm"
          >
            <TabList>
              {CATEGORIES.map((c) => (
                <Tab key={c} value={c}>
                  {c}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </VStack>

        {/* App grid */}
        {filteredCharts.length === 0 ? (
          <EmptyState
            variant="inline"
            icon={<IconSearch size={48} stroke={1} />}
            title="No results found"
            description="No apps match your search or category filter. Try adjusting your criteria."
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
