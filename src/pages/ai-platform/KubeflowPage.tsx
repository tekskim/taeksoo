import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  PageHeader,
  EmptyState,
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AITopBarActions } from '@/components/AITopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconBrandDocker, IconExternalLink } from '@tabler/icons-react';

export function KubeflowPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Kubeflow');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

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
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'AI Platform' }, { label: 'MLOps' }, { label: 'Kubeflow' }]}
            />
          }
          actions={<AITopBarActions />}
        />
      }
      contentClassName="pt-3 px-8 pb-20 bg-[var(--color-surface-subtle)]"
    >
      <VStack gap={6}>
        <PageHeader
          title="Kubeflow"
          actions={
            <HStack gap={2}>
              <Button variant="secondary" size="md" icon={<IconRefresh size={14} stroke={1.5} />}>
                Refresh
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={<IconExternalLink size={14} stroke={1.5} />}
              >
                Open Kubeflow
              </Button>
            </HStack>
          }
        />
        <p className="text-body-lg text-[var(--color-text-subtle)]">
          ML toolkit for Kubernetes-native workflows.
        </p>
        <EmptyState
          variant="card"
          icon={<IconBrandDocker size={48} stroke={1} />}
          title="Kubeflow dashboard"
          description="Connect to Kubeflow to manage ML workflows."
        />
      </VStack>
    </PageShell>
  );
}

export default KubeflowPage;
