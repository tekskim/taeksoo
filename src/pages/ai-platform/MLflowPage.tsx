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
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconFlask, IconExternalLink } from '@tabler/icons-react';

export function MLflowPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('MLflow');
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
          breadcrumb={<Breadcrumb items={[{ label: 'MLOps' }, { label: 'MLflow' }]} />}
          actions={<AiPlatformTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-subtle)]"
    >
      <VStack gap={6}>
        <PageHeader
          title="MLflow"
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
                Open MLflow
              </Button>
            </HStack>
          }
        />
        <p className="text-body-lg text-[var(--color-text-subtle)]">
          Track experiments, models, and deployments.
        </p>
        <EmptyState
          variant="card"
          icon={<IconFlask size={48} stroke={1} />}
          title="MLflow Dashboard"
          description="Connect to MLflow to track experiments and models."
        />
      </VStack>
    </PageShell>
  );
}

export default MLflowPage;
