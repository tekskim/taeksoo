import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  HStack,
  VStack,
  TabBar,
  TopBar,
  InlineMessage,
  PageShell,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconTerminal2, IconFile, IconCopy, IconSearch } from '@tabler/icons-react';

/* ----------------------------------------
   Mock HPA YAML Data
   ---------------------------------------- */

const getMockHPAYaml = (hpaId: string) => `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  annotations:
    meta.helm.sh/release-name: php-apache
    meta.helm.sh/release-namespace: default
  creationTimestamp: '2025-07-25T09:12:20Z'
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
      time: '2025-07-25T09:12:20Z'
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
    - lastTransitionTime: '2025-07-25T09:12:30Z'
      message: recommended size matches current size
      reason: ReadyForNewScale
      status: 'True'
      type: AbleToScale
    - lastTransitionTime: '2025-07-25T09:12:30Z'
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
   YAML Editor with Line Numbers
   ---------------------------------------- */

interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCopy: () => void;
}

function YamlEditor({ value, onChange, onCopy }: YamlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = value.split('\n');
  const lineCount = lines.length;

  // Sync scroll between line numbers and textarea
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  return (
    <div className="flex-1 flex min-h-0 border border-[var(--color-border-default)] rounded-[4px] bg-[var(--color-base-white)] overflow-hidden relative">
      {/* Line Numbers */}
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

      {/* Editor */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="w-full h-full py-2 px-2.5 pr-12 font-mono text-body-md leading-[18px] text-[var(--color-text-default)] bg-transparent border-none outline-none resize-none overflow-auto yaml-editor-scroll"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {/* Copy Button - Absolute positioned */}
      <div className="absolute top-2 right-4">
        <button
          onClick={onCopy}
          className="flex items-center justify-center w-7 h-7 border border-[var(--color-border-strong)] rounded-[6px] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          title="Copy to clipboard"
        >
          <IconCopy size={12} stroke={1.5} />
        </button>
      </div>
    </div>
  );
}

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
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(yamlContent);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [yamlContent]);

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
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Horizontal Pod Autoscalers', href: '/container/hpa' },
                { label: hpaName || 'Edit HPA' },
              ]}
            />
          }
          actions={
            <>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconTerminal2 size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconFile size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconCopy size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
            </>
          }
        />
      }
      contentClassName="h-full flex flex-col pt-3 px-8 pb-6 min-h-0"
    >
      <VStack gap={6} className="flex-1 min-h-0">
        {/* Header */}
        <VStack gap={2} className="flex-shrink-0">
          <h1 className="text-heading-h4 text-[var(--color-text-default)]">HPA: {hpaName}</h1>
          <InlineMessage variant="warning">
            This HPA is managed by a Helm app; changes made here will likely be overwritten the next
            time Helm runs.
          </InlineMessage>
        </VStack>

        {/* YAML Editor */}
        <YamlEditor value={yamlContent} onChange={setYamlContent} onCopy={handleCopy} />

        {/* Footer */}
        <div className="flex-shrink-0 h-[61px] flex items-center justify-between border-t border-[var(--color-border-strong)]">
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
