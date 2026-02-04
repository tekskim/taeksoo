import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Breadcrumb, HStack, VStack, TabBar, TopBar } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconTerminal2, IconFile, IconCopy, IconSearch } from '@tabler/icons-react';

/* ----------------------------------------
   Default YAML Template
   ---------------------------------------- */

const DEFAULT_YAML = `apiVersion: v1
kind: Service
metadata:
  name: ''
  annotations:
    {}
    #  key: string
  labels:
    {}
    #  key: string
  namespace: default
spec:
  selector:
    #  key: string
  ports:
    - name: ''
      protocol: TCP
#    - appProtocol: string
#      name: string
#      nodePort: int
#      port: int
#      protocol: string
#      targetPort: string
  sessionAffinity: None
  type: ClusterIP
#  allocateLoadBalancerNodePorts: boolean
#  clusterIP: string
#  clusterIPs:
#    - string
#  externalIPs:
#    - string
#  externalName: string
#  externalTrafficPolicy: string
#  healthCheckNodePort: int
#  internalTrafficPolicy: string
#  ipFamilies:
#    - string
#  ipFamilyPolicy: string
#  loadBalancerClass: string
#  loadBalancerIP: string
#  loadBalancerSourceRanges:
#    - string
#  publishNotReadyAddresses: boolean
#  sessionAffinityConfig:
#    clientIP:
#      timeoutSeconds: int
#  trafficDistribution: string
__clone: true`;

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
        <div className="font-mono text-body-md text-[var(--color-text-subtle)]">
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
          className="w-full h-full py-2 px-2.5 pr-12 font-mono text-body-md text-[var(--color-text-default)] bg-transparent border-none outline-none resize-none overflow-auto yaml-editor-scroll"
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

export function CreateServiceYamlPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [yamlContent, setYamlContent] = useState(DEFAULT_YAML);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Service (YAML)');
  }, [updateActiveTabLabel]);

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
    navigate('/container/services');
  }, [navigate]);

  // Handle create
  const handleCreate = useCallback(() => {
    // TODO: Implement actual service creation via API
    console.log('Creating service with YAML:', yamlContent);
    navigate('/container/services');
  }, [navigate, yamlContent]);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabReorder={moveTab}
          onTabAdd={addNewTab}
        />

        {/* Top Bar */}
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
                { label: 'Services', href: '/container/services' },
                { label: 'Create Service' },
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
                <IconCopy size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
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

        {/* Page Content */}
        <div className="flex-1 overflow-hidden min-w-[var(--layout-content-min-width)] flex flex-col">
          <div className="flex-1 flex flex-col pt-4 px-8 pb-6 bg-[var(--color-surface-default)] min-h-0">
            <VStack gap={6} className="flex-1 min-h-0">
              {/* Header */}
              <VStack gap={2} className="flex-shrink-0">
                <h1 className="text-heading-h4 text-[var(--color-text-default)]">Create Service</h1>
                <p className="text-body-sm text-[var(--color-text-subtle)]">
                  Services allow you to define a logical set of Pods that can be accessed with a
                  single IP address and port.
                </p>
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

                {/* Right side - Cancel & Create */}
                <HStack gap={3}>
                  <Button variant="secondary" size="md" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" onClick={handleCreate}>
                    Create
                  </Button>
                </HStack>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateServiceYamlPage;
