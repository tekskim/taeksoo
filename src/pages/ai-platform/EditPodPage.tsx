import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VStack, TabBar, TopBar, Breadcrumb, PageShell } from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { WorkloadPodForm, type WorkloadPodFormValues } from '@/pages/ai-platform/WorkloadPodForm';

const EDIT_POD_MOCK_BASE: Omit<WorkloadPodFormValues, 'envVars'> = {
  instanceName: 'qwen3-finetune-v2',
  namespace: 'ai-workloads',
  templateId: 'pytorch',
  gpuCloudId: 'cloud-b',
  labelQty: 2,
  gpuConfigurationId: '2-units',
  gpuVendorFilter: 'nvidia',
  gpuSearch: '',
  gpuProfileTab: 'high-memory',
  selectedGpuId: 'gpu-h100',
  containerImageSource: 'custom',
  imageTemplateSearch: '',
  imageTemplatePage: 1,
  imageTemplateTab: 'all',
  selectedImageTemplateId: null,
  containerImage: 'ghcr.io/demo/train:1.4.0',
  dockerCommand: 'python -m train.main --config /workspace/config.yaml',
  containerDiskGi: 80,
  volumeDiskGi: 500,
  volumeMountPath: '/workspace',
  exposeHttpPorts: '8080',
  cpuRequestValue: 500,
  cpuRequestUnit: 'm',
  cpuLimitValue: 4,
  cpuLimitUnit: 'cores',
  memoryRequestValue: 16,
  memoryRequestUnit: 'Gi',
  memoryLimitValue: 32,
  memoryLimitUnit: 'Gi',
  maxRunningTimeEnabled: true,
  noLimitRunIndefinitely: false,
  idleTimeoutHours: 2,
  idleTimeoutMinutes: 30,
  notifyBeforeTermination: true,
  notifyBeforeTerminationMinutes: 10,
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
          actions={<AiPlatformTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4} className="w-full">
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
