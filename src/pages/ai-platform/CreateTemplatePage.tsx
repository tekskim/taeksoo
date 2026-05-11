import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VStack, TabBar, TopBar, Breadcrumb, PageShell } from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { MyTemplateForm } from './MyTemplateForm';
import type { MyTemplateFormValues } from './MyTemplateForm';

export function CreateTemplatePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Create template');
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
                { label: 'Infrastructure' },
                { label: 'My templates', href: '/ai-platform/my-templates' },
                { label: 'Create template' },
              ]}
            />
          }
          actions={<AiPlatformTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4} className="w-full pb-20">
        <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create template</h1>
        <MyTemplateForm
          mode="create"
          submitLabel="Create"
          onCancel={() => navigate('/ai-platform/my-templates')}
          onSubmit={(_values: MyTemplateFormValues) => {
            navigate('/ai-platform/my-templates');
          }}
        />
      </VStack>
    </PageShell>
  );
}

export default CreateTemplatePage;
