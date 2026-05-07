import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VStack, TabBar, TopBar, Breadcrumb, PageShell } from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { useTabs } from '@/contexts/TabContext';
import { IconBell } from '@tabler/icons-react';
import { MyTemplateForm, type MyTemplateFormValues } from './MyTemplateForm';

const EDIT_TEMPLATE_MOCK_BASE: Omit<MyTemplateFormValues, 'envVars' | 'httpPorts'> = {
  templateName: 'Production training image',
  description: 'GPU-enabled PyTorch baseline for fine-tuning jobs.',
  visibility: 'private',
  category: 'aiml',
  customCategory: '',
  baseImage: 'ghcr.io/demo/train:1.4.0',
  runCommands: 'python -m train.main --config /workspace/config.yaml',
  requiresGpu: true,
  minGpuMemory: 16,
  minCpuCores: 8,
  minMemory: 64,
  containerDisk: 80,
  volumeDisk: 500,
  volumeMountPath: '/workspace',
};

function mockValuesForId(id: string | undefined): MyTemplateFormValues {
  return {
    ...EDIT_TEMPLATE_MOCK_BASE,
    templateName: id
      ? `${EDIT_TEMPLATE_MOCK_BASE.templateName} (${id})`
      : EDIT_TEMPLATE_MOCK_BASE.templateName,
    httpPorts: ['8080', '9090'],
    envVars: [
      { id: 'env-1', key: 'CUDA_VISIBLE_DEVICES', value: '0' },
      { id: 'env-2', key: 'OMP_NUM_THREADS', value: '8' },
    ],
  };
}

export function EditTemplatePage() {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const initialValues = useMemo(() => mockValuesForId(templateId), [templateId]);

  useEffect(() => {
    updateActiveTabLabel('Edit template');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const breadcrumbTemplateLabel = initialValues.templateName;

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
                { label: breadcrumbTemplateLabel },
              ]}
            />
          }
          actions={
            <button
              type="button"
              className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
              aria-label="Notifications"
            >
              <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
          }
        />
      }
      contentClassName="pt-3 px-8 pb-20 bg-[var(--color-surface-subtle)]"
    >
      <VStack gap={4} className="w-full max-w-[1680px]">
        <h1 className="text-heading-h5 text-[var(--color-text-default)]">Edit template</h1>
        <MyTemplateForm
          mode="edit"
          initialValues={initialValues}
          submitLabel="Save"
          onCancel={() => navigate('/ai-platform/my-templates')}
          onSubmit={(_values: MyTemplateFormValues) => {
            navigate('/ai-platform/my-templates');
          }}
        />
      </VStack>
    </PageShell>
  );
}

export default EditTemplatePage;
