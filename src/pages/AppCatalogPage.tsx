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
  Modal,
  InlineMessage,
  InfoBox,
} from '@/design-system';
import { AppCatalogSidebar, APP_CATALOG_CLUSTERS } from '@/components/AppCatalogSidebar';
import { AppCatalogTopBarActions } from '@/components/AppCatalogTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconSearch, IconApps, IconStack2 } from '@tabler/icons-react';
import type { CatalogChart, AppCategory } from '@/pages/apps/appsTypes';
import {
  catalogCharts,
  installedAppsMock,
  CATEGORIES,
  getOperatorRequirements,
  hasUnmetOperatorDependency,
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
  const alreadyInstalled =
    !chart.duplicateInstallable && installedAppsMock.some((app) => app.name === chart.name);
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
            <IconApps size={28} className="text-[var(--color-action-primary)]" stroke={1.5} />
          )}
        </div>
        <VStack gap={1} className="flex-1 min-w-0">
          <span className="text-body-lg font-semibold text-[var(--color-text-default)]">
            {chart.displayName ?? toTitleCase(chart.name)}
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
          {chart.category}
        </Badge>
        {chart.packageLabel && (
          <Badge variant={chart.packageType === 'operator' ? 'warning' : 'info'} size="sm">
            {chart.packageLabel}
          </Badge>
        )}
      </HStack>
      <HStack justify="end" className="w-full pt-1">
        <Button variant="primary" size="sm" onClick={() => onInstall(chart)}>
          {alreadyInstalled ? 'Upgrade' : 'Install'}
        </Button>
      </HStack>
    </SectionCard>
  );
}

/* ----------------------------------------
   Operator Required Modal
   App이 선행 Operator(복수 가능)에 의존하고 그중 미설치가 있을 때 노출.
   - 의존 Operator를 행 단위로 나열하고 각 행에서 독립적으로 install 페이지로 이동
     (단일 redirect 기준이 애매한 복수 의존성 문제를 행별 분리로 해결)
   - 모든 Operator가 설치되어야 'Install [App]' 진행 버튼 활성화
   ---------------------------------------- */

interface OperatorRequiredModalProps {
  app: CatalogChart;
  onClose: () => void;
  onInstallOperator: (operatorChartName: string) => void;
  onProceed: (app: CatalogChart) => void;
}

function OperatorRequiredModal({
  app,
  onClose,
  onInstallOperator,
  onProceed,
}: OperatorRequiredModalProps) {
  const requirements = getOperatorRequirements(app);
  const missingCount = requirements.filter((req) => !req.installed).length;
  const allInstalled = missingCount === 0;

  return (
    <Modal isOpen onClose={onClose} title="Operator required" className="!w-[440px]">
      <div className="flex flex-col gap-4">
        <InlineMessage variant="warning">
          {requirements.length > 1
            ? `${app.displayName} depends on ${requirements.length} operators. Install the ${missingCount} missing operator(s) before continuing.`
            : `${app.displayName} is managed by an operator that is not installed yet. Install it first to continue.`}
        </InlineMessage>

        <InfoBox label="Application" value={app.displayName} />

        <div className="flex flex-col gap-1.5">
          <span className="text-label-sm text-[var(--color-text-subtle)]">Required operators</span>
          <div className="flex flex-col rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] divide-y divide-[var(--color-border-subtle)]">
            {requirements.map((req) => (
              <div
                key={req.chartName}
                className="flex items-center justify-between gap-3 px-3 py-2.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-body-md text-[var(--color-text-default)] truncate">
                    {req.displayName}
                  </span>
                  {req.installed ? (
                    <Badge variant="success" size="sm">
                      Installed
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm">
                      Not installed
                    </Badge>
                  )}
                </div>
                {!req.installed && (
                  <Button
                    variant="link"
                    size="sm"
                    disabled={!req.available}
                    onClick={() => onInstallOperator(req.chartName)}
                  >
                    Install
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 w-full pt-1">
          <Button variant="outline" size="md" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            disabled={!allInstalled}
            onClick={() => onProceed(app)}
          >
            Install {app.displayName}
          </Button>
        </div>
      </div>
    </Modal>
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
  // 사이드바 실제 폭(AppCatalogSidebar = w-[200px])과 일치시킨다. 닫히면 sidebar는 null이므로 0.
  const sidebarWidth = sidebarOpen ? 200 : 0;
  // 선택 가능한 클러스터가 없으면(AC-EMPTY) TopBar·메뉴 트리를 숨기고 page-level Empty State만 표시.
  const hasCluster = APP_CATALOG_CLUSTERS.length > 0;

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<AppCategory>('All');
  /** 선행 Operator 미충족으로 게이팅된 설치 대상 App */
  const [pendingApp, setPendingApp] = useState<CatalogChart | null>(null);

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

  const goToInstall = (chartName: string) => {
    navigate(`/app-catalog/${chartName}/install`);
  };

  const handleInstall = (chart: CatalogChart) => {
    // 선행 Operator 중 미설치가 있으면 설치 전 안내 모달로 게이팅
    if (hasUnmetOperatorDependency(chart)) {
      setPendingApp(chart);
      return;
    }
    goToInstall(chart.name);
  };

  return (
    <PageShell
      sidebar={
        <AppCatalogSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
        hasCluster ? (
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            showNavigation={false}
            breadcrumb={<Breadcrumb items={[{ label: 'Catalog' }]} />}
            actions={<AppCatalogTopBarActions />}
          />
        ) : undefined
      }
      contentClassName="pt-3 px-8 pb-20 bg-[var(--color-surface-subtle)]"
    >
      {!hasCluster ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <EmptyState
            icon={<IconStack2 size={48} stroke={1.25} />}
            title="No cluster available"
            description="No cluster is registered on the platform. Apps and operators will appear here once a cluster is available."
          />
        </div>
      ) : (
        <>
          <VStack gap={6}>
            <PageHeader title="Catalog" />

            <HStack gap={2} align="center">
              <SearchInput
                placeholder="Search by app name"
                size="sm"
                className="w-[var(--search-input-width)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </HStack>

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

          {pendingApp && (
            <OperatorRequiredModal
              app={pendingApp}
              onClose={() => setPendingApp(null)}
              onInstallOperator={(operatorChartName) => {
                setPendingApp(null);
                goToInstall(operatorChartName);
              }}
              onProceed={(app) => {
                setPendingApp(null);
                goToInstall(app.name);
              }}
            />
          )}
        </>
      )}
    </PageShell>
  );
}

export default AppCatalogPage;
