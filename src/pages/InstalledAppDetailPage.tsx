import { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Button,
  PageShell,
  DetailHeader,
  StatusIndicator,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { AppCatalogSidebar } from '@/components/AppCatalogSidebar';
import { useAppCatalogMode } from '@/contexts/AppCatalogModeContext';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconDownload, IconEdit, IconTrash, IconCopy } from '@tabler/icons-react';
import type { InstalledAppStatus } from '@/pages/apps/appsTypes';
import { installedAppsMock } from '@/pages/apps/appsMockData';

/* ─── Read-only YAML viewer ─── */
function YamlViewer({
  value,
  onCopy,
  onDownload,
}: {
  value: string;
  onCopy: () => void;
  onDownload: () => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const lines = value.split('\n');
  const lineCount = lines.length;

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollContainerRef.current.scrollTop;
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full min-h-0 flex-1">
      <HStack justify="end" gap={2}>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<IconCopy size={12} stroke={1.5} />}
          onClick={onCopy}
        >
          Copy
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<IconDownload size={12} stroke={1.5} />}
          onClick={onDownload}
        >
          Download
        </Button>
      </HStack>
      <div className="flex-1 flex min-h-[320px] border border-[var(--color-border-default)] rounded-[4px] bg-[var(--color-base-white)] overflow-hidden relative">
        <div
          ref={lineNumbersRef}
          className="w-[44px] flex-shrink-0 overflow-y-scroll py-2 pr-2 select-none text-right bg-[var(--color-surface-default)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="font-mono text-body-md leading-[18px] text-[var(--color-text-subtle)]">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1}>{i + 1}</div>
            ))}
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 min-w-0 overflow-auto"
        >
          <pre className="w-full min-h-full py-2 px-2.5 font-mono text-body-md leading-[18px] text-[var(--color-text-default)] bg-transparent whitespace-pre select-text">
            {value}
          </pre>
        </div>
      </div>
    </div>
  );
}

const statusMap: Record<InstalledAppStatus, 'active' | 'building' | 'error'> = {
  Deployed: 'active',
  Pending: 'building',
  Failed: 'error',
};

function toTitleCase(s: string): string {
  return s
    .replace(/-/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function InstalledAppDetailPage() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const { isStandalone } = useAppCatalogMode();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = isStandalone ? (sidebarOpen ? 200 : 0) : sidebarOpen ? 240 : 40;
  const basePath = isStandalone ? '/app-catalog' : '/container';

  const app = installedAppsMock.find((a) => a.id === appId);

  const downloadValuesYaml = () => {
    if (!app) return;
    const content = app.valuesYaml ?? '# No values';
    const blob = new Blob([content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${app.name}-values.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyValuesYaml = useCallback(async () => {
    if (!app) return;
    try {
      await navigator.clipboard.writeText(app.valuesYaml ?? '# No values');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [app]);

  const sidebarEl = isStandalone ? (
    <AppCatalogSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
  ) : (
    <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
  );

  if (!app) {
    return (
      <PageShell sidebar={sidebarEl} sidebarWidth={sidebarWidth} contentClassName="pt-4 px-8 pb-6">
        <VStack gap={4}>
          <p className="text-body-md text-[var(--color-text-muted)]">App not found.</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`${basePath}/installed-apps`)}
          >
            Back to Installed Apps
          </Button>
        </VStack>
      </PageShell>
    );
  }

  const isPending = app.status === 'Pending';
  const chartDisplayName = app.displayName ?? toTitleCase(app.name);

  return (
    <PageShell
      sidebar={sidebarEl}
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
          showNavigation={!isStandalone}
          onBack={() => navigate(`${basePath}/installed-apps`)}
          onForward={() => {}}
          breadcrumb={
            <Breadcrumb
              items={
                isStandalone
                  ? [
                      { label: 'Installed Apps', href: `${basePath}/installed-apps` },
                      { label: chartDisplayName },
                    ]
                  : [
                      { label: 'clusterName', href: '/container' },
                      { label: 'Apps', href: '/container/catalog' },
                      { label: 'Installed Apps', href: '/container/installed-apps' },
                      { label: chartDisplayName },
                    ]
              }
            />
          }
          actions={
            <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
              <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
          }
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        <DetailHeader>
          <HStack justify="between" align="start" className="w-full flex-wrap gap-2">
            <DetailHeader.Title>{chartDisplayName}</DetailHeader.Title>
            <DetailHeader.Actions>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconEdit size={14} stroke={1.5} />}
                disabled={isPending}
                onClick={() => navigate(`${basePath}/installed-apps/${app.id}/edit`)}
              >
                Edit / Upgrade
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconTrash size={14} stroke={1.5} />}
                disabled={isPending}
              >
                Delete
              </Button>
            </DetailHeader.Actions>
          </HStack>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={
                <StatusIndicator
                  status={statusMap[app.status]}
                  label={app.status}
                  layout="default"
                />
              }
            />
            <DetailHeader.InfoCard label="App name" value={chartDisplayName} />
            <DetailHeader.InfoCard label="Version" value={app.version} />
            <DetailHeader.InfoCard label="Namespace" value={app.namespace} />
            <DetailHeader.InfoCard
              label="Last deployed"
              value={app.lastDeployed ?? app.installedAt ?? '—'}
            />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        <Tabs defaultValue="values" variant="underline" size="sm">
          <TabList>
            <Tab value="values">Values</Tab>
          </TabList>
          <TabPanel value="values">
            <div className="pt-3 flex flex-col min-h-0 flex-1">
              <YamlViewer
                value={app.valuesYaml ?? '# No values'}
                onCopy={copyValuesYaml}
                onDownload={downloadValuesYaml}
              />
            </div>
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}

export default InstalledAppDetailPage;
