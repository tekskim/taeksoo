import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VStack, TabBar, TopBar, Breadcrumb, PageShell } from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { useTabs } from '@/contexts/TabContext';
import { IconBell } from '@tabler/icons-react';
import { WorkloadPodForm, type WorkloadPodFormValues } from '@/pages/ai-platform/WorkloadPodForm';

const EDIT_POD_MOCK_BASE: Omit<WorkloadPodFormValues, 'envVars'> = {
  instanceName: 'qwen3-finetune-v2',
  templateId: 'pytorch',
  gpuCloudId: 'cloud-b',
  labelQty: 2,
  gpuVendorFilter: 'nvidia',
  gpuSearch: '',
  gpuProfileTab: 'high-memory',
  selectedGpuId: 'gpu-h100',
  containerImage: 'ghcr.io/demo/train:1.4.0',
  dockerCommand: 'python -m train.main --config /workspace/config.yaml',
  containerDiskGi: 80,
  volumeDiskGi: 500,
  volumeMountPath: '/workspace',
  exposeHttpPorts: '8080',
};

function mockValuesForId(id: string | undefined): WorkloadPodFormValues {
  return {
    ...EDIT_POD_MOCK_BASE,
    instanceName: id
      ? `${EDIT_POD_MOCK_BASE.instanceName} (${id})`
      : EDIT_POD_MOCK_BASE.instanceName,
    envVars: [
      { id: 'env-1', key: 'CUDA_VISIBLE_DEVICES', value: '0' },
      { id: 'env-2', key: 'OMP_NUM_THREADS', value: '8' },
    ],
  };
}

export function EditPodPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const initialValues = useMemo(() => mockValuesForId(id), [id]);

  useEffect(() => {
    updateActiveTabLabel('Edit pod');
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
                { label: 'Edit pod' },
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
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4} className="w-full max-w-[1680px]">
        <h1 className="text-heading-h4 text-[var(--color-text-default)]">Edit pod</h1>
        <WorkloadPodForm
          mode="edit"
          initialValues={initialValues}
          gpuSelectionReadOnly
          submitLabel="Save"
          onCancel={() => navigate(-1)}
          onSubmit={() => {
            navigate(-1);
          }}
        />
      </VStack>
    </PageShell>
  );
}

export default EditPodPage;
