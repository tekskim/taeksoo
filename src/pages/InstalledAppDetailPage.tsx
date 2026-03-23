import { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Button,
  PageShell,
  DetailHeader,
  StatusIndicator,
  type TableColumn,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconDownload, IconEdit, IconTrash, IconCopy } from '@tabler/icons-react';
import type { InstalledAppStatus } from '@/pages/apps/appsTypes';
import { installedAppsMock } from '@/pages/apps/appsMockData';

/* Read-only YAML viewer: same look as Edit YAML pages (line numbers + content), no edit/save */
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const app = installedAppsMock.find((a) => a.id === appId);

  const downloadValuesYaml = () => {
    if (!app) return;
    const content = app.valuesYaml ?? '# No values';
    const blob = new Blob([content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${app.releaseName}-values.yaml`;
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

  const resourceColumns: TableColumn<{ kind: string; name: string; namespace?: string }>[] = [
    { key: 'kind', label: 'Type', width: '200px' },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (value) => (
        <span className="text-[var(--color-action-primary)] hover:underline cursor-pointer">
          {value as string}
        </span>
      ),
    },
    { key: 'namespace', label: 'Namespace', width: '140px' },
  ];

  if (!app) {
    return (
      <PageShell
        sidebar={
          <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        }
        sidebarWidth={sidebarWidth}
        contentClassName="pt-4 px-8 pb-6"
      >
        <VStack gap={4}>
          <p className="text-body-md text-[var(--color-text-muted)]">App not found.</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/container/apps/installed-apps')}
          >
            Back to Installed Apps
          </Button>
        </VStack>
      </PageShell>
    );
  }

  const isPending = app.status === 'Pending';

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
          showNavigation
          onBack={() => navigate('/container/apps/installed-apps')}
          onForward={() => {}}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Apps', href: '/container/apps/catalog' },
                { label: 'Installed Apps', href: '/container/apps/installed-apps' },
                { label: toTitleCase(app.releaseName) },
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
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        <DetailHeader>
          <HStack justify="between" align="start" className="w-full flex-wrap gap-2">
            <DetailHeader.Title>{toTitleCase(app.releaseName)}</DetailHeader.Title>
            <DetailHeader.Actions>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconEdit size={14} stroke={1.5} />}
                disabled={isPending}
                onClick={() => navigate(`/container/apps/installed-apps/${app.id}/edit`)}
              >
                Edit
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
            <DetailHeader.InfoCard label="App name" value={app.releaseName} />
            <DetailHeader.InfoCard label="Chart name" value={app.name} />
            <DetailHeader.InfoCard label="Version" value={app.version} />
            <DetailHeader.InfoCard label="Namespace" value={app.namespace} />
            <DetailHeader.InfoCard
              label="Last deployed"
              value={app.lastDeployed ?? app.installedAt ?? '—'}
            />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        <Tabs defaultValue="resources" variant="underline" size="sm">
          <TabList>
            <Tab value="resources">Resources</Tab>
            <Tab value="values">Values.yaml</Tab>
          </TabList>
          <TabPanel value="resources">
            <VStack gap={3} className="pt-3">
              {(app.resources ?? []).length === 0 ? (
                <p className="text-body-md text-[var(--color-text-subtle)]">
                  No resources. This release has not created any Kubernetes resources yet.
                </p>
              ) : (
                <Table
                  columns={resourceColumns}
                  data={(app.resources ?? []).map((r, i) => ({
                    ...r,
                    id: `${r.kind}-${r.name}-${i}`,
                  }))}
                  rowKey="id"
                />
              )}
            </VStack>
          </TabPanel>
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
