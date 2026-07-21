import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VStack, TabBar, TopBar, Breadcrumb, PageShell } from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { WorkloadPodForm } from '@/pages/ai-platform/WorkloadPodForm';

export function DeployNewPodPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Deploy new pod');
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
              items={[
                { label: 'Workloads', href: '/ai-platform/workloads' },
                { label: 'Deploy new pod' },
              ]}
            />
          }
          actions={<AiPlatformTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4} className="w-full">
        <h1 className="text-heading-h4 text-[var(--color-text-default)]">Deploy new pod</h1>
        <WorkloadPodForm
          mode="deploy"
          submitLabel="Deploy"
          onCancel={() => navigate('/ai-platform/workloads')}
          onSubmit={() => {
            navigate('/ai-platform/workloads');
          }}
        />
      </VStack>
    </PageShell>
  );
}

export default DeployNewPodPage;
