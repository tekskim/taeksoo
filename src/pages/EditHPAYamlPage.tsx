import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  HStack,
  InlineMessage,
  PageShell,
  TabBar,
  TopBar,
  VStack,
  YamlEditor,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';

/* ----------------------------------------
   Mock HPA YAML Data
   ---------------------------------------- */

const getMockHPAYaml = (hpaId: string) => `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  annotations:
    meta.helm.sh/release-name: php-apache
    meta.helm.sh/release-namespace: default
  creationTimestamp: '2026-07-25T09:12:20Z'
  generation: 1
  labels:
    app.kubernetes.io/managed-by: Helm
  managedFields:
    - apiVersion: autoscaling/v2
      fieldsType: FieldsV1
      fieldsV1:
        f:metadata:
          f:annotations:
            .: {}
            f:meta.helm.sh/release-name: {}
            f:meta.helm.sh/release-namespace: {}
          f:labels:
            .: {}
            f:app.kubernetes.io/managed-by: {}
        f:spec:
          f:maxReplicas: {}
          f:metrics: {}
          f:minReplicas: {}
          f:scaleTargetRef: {}
      manager: helm
      operation: Update
      time: '2026-07-25T09:12:20Z'
  name: php-apache-hpa
  namespace: default
  resourceVersion: '12345'
  uid: a1234567-89ab-cdef-0123-456789abcdef
spec:
  maxReplicas: 10
  metrics:
    - resource:
        name: cpu
        target:
          averageUtilization: 50
          type: Utilization
      type: Resource
  minReplicas: 1
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
status:
  conditions:
    - lastTransitionTime: '2026-07-25T09:12:30Z'
      message: recommended size matches current size
      reason: ReadyForNewScale
      status: 'True'
      type: AbleToScale
    - lastTransitionTime: '2026-07-25T09:12:30Z'
      message: the HPA was able to successfully calculate a replica count
      reason: ValidMetricFound
      status: 'True'
      type: ScalingActive
  currentMetrics:
    - resource:
        current:
          averageUtilization: 0
          averageValue: 1m
        name: cpu
      type: Resource
  currentReplicas: 1
  desiredReplicas: 1`;

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function EditHPAYamlPage() {
  const navigate = useNavigate();
  const { hpaId } = useParams<{ hpaId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [yamlContent, setYamlContent] = useState('');
  const [hpaName, setHpaName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load HPA data
  useEffect(() => {
    if (hpaId) {
      // TODO: Fetch actual HPA data from API
      setYamlContent(getMockHPAYaml(hpaId));
      setHpaName('php-apache-hpa');
    }
  }, [hpaId]);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    if (hpaName) {
      updateActiveTabLabel(`Edit HPA: ${hpaName}`);
    }
  }, [hpaName, updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // Handle read from file
  const handleReadFromFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setYamlContent(content);
      };
      reader.readAsText(file);
    }
    // Reset the input so the same file can be selected again
    e.target.value = '';
  }, []);

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate('/container/hpa');
  }, [navigate]);

  // Handle save
  const handleSave = useCallback(() => {
    // TODO: Implement actual HPA update via API
    console.log('Saving HPA with YAML:', yamlContent);
    navigate('/container/hpa');
  }, [navigate, yamlContent]);

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabReorder={moveTab}
          onTabAdd={addNewTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb items={[{ label: 'HPA', href: '/container/hpa' }, { label: 'Edit HPA' }]} />
          }
          actions={<ContainerTopBarActions />}
        />
      }
      contentClassName="h-full flex flex-col pt-3 px-8 pb-6 min-h-0"
    >
      <VStack gap={6} className="flex-1 min-h-0">
        {/* Header */}
        <VStack gap={1} className="flex-shrink-0">
          <h1 className="text-heading-h4 text-[var(--color-text-default)]">HPA: {hpaName}</h1>
          <InlineMessage variant="warning">
            This HPA is managed by a Helm app; changes made here will likely be overwritten the next
            time Helm runs.
          </InlineMessage>
        </VStack>

        {/* YAML Editor */}
        <YamlEditor value={yamlContent} onChange={setYamlContent} />

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between">
          {/* Left side - Read from File */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".yaml,.yml,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button variant="secondary" size="md" onClick={handleReadFromFile}>
              Read from File
            </Button>
          </div>

          {/* Right side - Cancel & Save */}
          <HStack gap={3}>
            <Button variant="secondary" size="md" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleSave}>
              Save
            </Button>
          </HStack>
        </div>
      </VStack>
    </PageShell>
  );
}

export default EditHPAYamlPage;
