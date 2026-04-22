/**
 * App Catalog — FR-001 app list, FR-002 app detail, FR-003 app search
 *
 * v1.0 apps: CNPG Operator (Operator tab), CNPG Instance/Valkey/nginx/Kafka/Milvus/Gitea (Applications tab)
 * - Applications tab: 모든 사용자 접근 가능
 * - Operators tab: 테넌트 관리자에게만 표시 (정책서 §FR-001, 기능명세서 결정사항)
 */
import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Modal,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { AppCatalogSidebar } from '@/components/AppCatalogSidebar';
import { useAppCatalogMode } from '@/contexts/AppCatalogModeContext';
import { useTabs } from '@/contexts/TabContext';
import { IconSearch, IconPackage, IconAlertTriangle } from '@tabler/icons-react';
import type { CatalogChart, AppCategory, AppType } from '@/pages/apps/appsTypes';
import { catalogCharts, installedOperatorsMock } from '@/pages/apps/appsMockData';

/** 메인 탭 타입 (FR-001: Applications / Operators 탭 구분) */
type MainTab = 'Applications' | 'Operators';

/** Display name — replace hyphens with spaces, capitalize each word */
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
  const isOperator = chart.appType === 'Operator';

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
            {chart.displayName ?? toDisplayName(chart.name)}
          </span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">v{chart.version}</span>
        </VStack>
      </HStack>

      {/* Description */}
      <p className="text-body-md text-[var(--color-text-muted)] line-clamp-3 flex-1">
        {chart.description}
      </p>

      {/* Footer: category + install type + install button */}
      <HStack justify="between" align="center" className="w-full pt-1">
        <HStack gap={1.5} align="center">
          <Badge variant="default" size="sm">
            {chart.category}
          </Badge>
          {isOperator ? (
            <Badge variant="warning" size="sm">
              Operator
            </Badge>
          ) : (
            chart.installType && (
              <Badge variant="info" size="sm">
                {chart.installType.startsWith('Operator') ? 'Operator-managed' : 'Helm'}
              </Badge>
            )
          )}
        </HStack>
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
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const { isStandalone } = useAppCatalogMode();
  const sidebarWidth = sidebarOpen ? 240 : 40;

  /** 메인 탭: ?mainTab=operators URL 파라미터로 초기 탭 설정 가능 (캡처용) */
  const initialMainTab: MainTab =
    searchParams.get('mainTab') === 'operators' ? 'Operators' : 'Applications';
  const [mainTab, setMainTab] = useState<MainTab>(initialMainTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<AppCategory>('All');

  /** Operator-required 안내 모달: dependency 미설치 시 해당 chart를 저장 */
  const [operatorRequiredChart, setOperatorRequiredChart] = useState<CatalogChart | null>(null);

  // demo URL param: ?showOperatorModal=<chartName> (캡처용 — 모달 미리 열기)
  const demoModalChart = searchParams.get('showOperatorModal');
  useEffect(() => {
    if (demoModalChart) {
      const chart = catalogCharts.find((c) => c.name === demoModalChart);
      if (chart) setOperatorRequiredChart(chart);
    }
  }, [demoModalChart]);

  const targetAppType: AppType = mainTab === 'Operators' ? 'Operator' : 'Application';

  /** 현재 탭에 실제로 존재하는 카테고리만 표시 (All + 해당 탭의 카테고리) */
  const availableCategories = useMemo<AppCategory[]>(() => {
    const cats = catalogCharts
      .filter((c) => (c.appType ?? 'Application') === targetAppType)
      .map((c) => c.category)
      .filter((c): c is AppCategory => !!c);
    return ['All', ...Array.from(new Set(cats))] as AppCategory[];
  }, [targetAppType]);

  const filteredCharts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return catalogCharts.filter((c) => {
      const chartType: AppType = c.appType ?? 'Application';
      const matchType = chartType === targetAppType;
      const matchCategory = category === 'All' || c.category === category;
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q));
      return matchType && matchCategory && matchSearch;
    });
  }, [mainTab, category, searchQuery, targetAppType]);

  const handleInstall = (chart: CatalogChart) => {
    if (chart.dependsOn) {
      // dependsOn은 Operator 이름을 가리키므로 installedOperatorsMock만 확인
      const depInstalled = installedOperatorsMock.some((op) => op.name === chart.dependsOn);
      if (!depInstalled) {
        setOperatorRequiredChart(chart);
        return;
      }
    }
    navigate(`/container/appcatalog/catalog/${chart.name}/install`);
  };

  const handleMainTabChange = (tab: MainTab) => {
    setMainTab(tab);
    setCategory('All');
    setSearchQuery('');
  };

  /** 의존 Operator의 display name 조회 */
  const requiredOperatorChart = operatorRequiredChart?.dependsOn
    ? catalogCharts.find((c) => c.name === operatorRequiredChart.dependsOn)
    : null;
  const requiredOperatorDisplayName =
    requiredOperatorChart?.displayName ??
    (operatorRequiredChart?.dependsOn ? toDisplayName(operatorRequiredChart.dependsOn) : '');

  return (
    <>
      <PageShell
        sidebar={
          isStandalone ? (
            <AppCatalogSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          ) : (
            <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          )
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
                  { label: 'App Catalog', href: '/container/appcatalog/catalog' },
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

          {/* Applications | Operators (underline, 상위 그룹핑) */}
          <Tabs
            value={mainTab}
            onChange={(v) => handleMainTabChange(v as MainTab)}
            variant="underline"
            size="sm"
          >
            <TabList>
              <Tab value="Applications">Applications</Tab>
              <Tab value="Operators">Operators</Tab>
            </TabList>
          </Tabs>

          {/* Search + Category tabs (boxed, 하위 그룹핑) */}
          <VStack gap={3}>
            <SearchInput
              placeholder={`Search ${mainTab.toLowerCase()} by name`}
              size="sm"
              className="w-[var(--search-input-width)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {availableCategories.length > 1 && (
              <Tabs
                value={category}
                onChange={(v) => setCategory(v as AppCategory)}
                variant="boxed"
                size="sm"
              >
                <TabList>
                  {availableCategories.map((c) => (
                    <Tab key={c} value={c}>
                      {c}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
            )}
          </VStack>

          {/* App grid */}
          {filteredCharts.length === 0 ? (
            <EmptyState
              variant="inline"
              icon={<IconSearch size={48} stroke={1} />}
              title="No results found"
              description={`No ${mainTab.toLowerCase()} match your search or category filter.`}
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

      {/* Operator Required 안내 모달 */}
      {operatorRequiredChart && (
        <Modal
          isOpen={!!operatorRequiredChart}
          onClose={() => setOperatorRequiredChart(null)}
          title="Operator Required"
          showCloseButton
          closeOnBackdropClick
          closeOnEscape
        >
          <VStack gap={4}>
            {/* 안내 메시지 */}
            <HStack
              gap={3}
              align="start"
              className="p-3 rounded-[var(--radius-md)] bg-[var(--color-feedback-warning-subtle,#fef9ec)] border border-[var(--color-feedback-warning,#f59e0b)]"
            >
              <IconAlertTriangle
                size={20}
                stroke={1.5}
                className="shrink-0 mt-0.5 text-[var(--color-feedback-warning,#f59e0b)]"
              />
              <VStack gap={1}>
                <span className="text-body-md font-medium text-[var(--color-text-default)]">
                  {requiredOperatorDisplayName} is not installed
                </span>
                <span className="text-body-sm text-[var(--color-text-subtle)]">
                  <strong>
                    {operatorRequiredChart.displayName ?? toDisplayName(operatorRequiredChart.name)}
                  </strong>{' '}
                  is managed by <strong>{requiredOperatorDisplayName}</strong>. You must install the
                  Operator before creating instances.
                </span>
              </VStack>
            </HStack>

            {/* 대상 앱 + 의존 Operator 관계 표시 */}
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] divide-y divide-[var(--color-border-subtle)] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--color-surface-subtle)]">
                <span className="text-label-sm text-[var(--color-text-muted)]">Application</span>
                <span className="text-body-sm text-[var(--color-text-default)] font-medium">
                  {operatorRequiredChart.displayName ?? toDisplayName(operatorRequiredChart.name)}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--color-surface-subtle)]">
                <span className="text-label-sm text-[var(--color-text-muted)]">
                  Required Operator
                </span>
                <HStack gap={1.5} align="center">
                  <Badge variant="warning" size="sm">
                    Operator
                  </Badge>
                  <span className="text-body-sm text-[var(--color-text-default)] font-medium">
                    {requiredOperatorDisplayName}
                  </span>
                </HStack>
              </div>
            </div>

            {/* 액션 버튼 */}
            <HStack gap={2} justify="end" className="pt-1">
              <Button variant="secondary" size="sm" onClick={() => setOperatorRequiredChart(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setOperatorRequiredChart(null);
                  navigate(
                    `/container/appcatalog/catalog/${operatorRequiredChart.dependsOn}/install`
                  );
                }}
              >
                Install Operator
              </Button>
            </HStack>
          </VStack>
        </Modal>
      )}
    </>
  );
}

export default AppCatalogPage;
