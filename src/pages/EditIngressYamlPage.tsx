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
   Mock Ingress YAML Data
   ---------------------------------------- */

const getMockIngressYaml = (ingressId: string) => `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    cert-manager.io/issuer: thakicloud
    cert-manager.io/issuer-kind: Issuer
    field.cattle.io/publicEndpoints: >-
      [{"addresses":["172.16.0.237"],"port":443,"protocol":"HTTPS","serviceName":"cattle-system:thakicloud","ingressName":"cattle-system:thakicloud","hostname":"thakicloud-tech.thakicloud.net","path":"/","allNodes":false}]
    meta.helm.sh/release-name: thakicloud
    meta.helm.sh/release-namespace: cattle-system
    nginx.ingress.kubernetes.io/proxy-connect-timeout: '30'
    nginx.ingress.kubernetes.io/proxy-read-timeout: '1800'
    nginx.ingress.kubernetes.io/proxy-send-timeout: '1800'
  creationTimestamp: '2025-10-14T07:13:48Z'
  generation: 1
  labels:
    app: thakicloud
    app.kubernetes.io/managed-by: Helm
    chart: thakicloud-2.12.2
    heritage: Helm
    release: thakicloud
  managedFields:
    - apiVersion: networking.k8s.io/v1
      fieldsType: FieldsV1
      fieldsV1:
        f:metadata:
          f:annotations:
            .: {}
            f:cert-manager.io/issuer: {}
            f:cert-manager.io/issuer-kind: {}
            f:meta.helm.sh/release-name: {}
            f:meta.helm.sh/release-namespace: {}
            f:nginx.ingress.kubernetes.io/proxy-connect-timeout: {}
            f:nginx.ingress.kubernetes.io/proxy-read-timeout: {}
            f:nginx.ingress.kubernetes.io/proxy-send-timeout: {}
          f:labels:
            .: {}
            f:app: {}
            f:app.kubernetes.io/managed-by: {}
            f:chart: {}
            f:heritage: {}
            f:release: {}
        f:spec:
          f:rules: {}
          f:tls: {}
      manager: helm
      operation: Update
      time: '2025-10-14T07:13:48Z'
    - apiVersion: networking.k8s.io/v1
      fieldsType: FieldsV1
      fieldsV1:
        f:status:
          f:loadBalancer:
            f:ingress: {}
      manager: nginx-ingress-controller
      operation: Update
      subresource: status
      time: '2025-10-14T07:14:02Z'
  name: thakicloud
  namespace: cattle-system
  resourceVersion: '4123'
  uid: c1234567-89ab-cdef-0123-456789abcdef
spec:
  ingressClassName: nginx
  rules:
    - host: thakicloud-tech.thakicloud.net
      http:
        paths:
          - backend:
              service:
                name: thakicloud
                port:
                  number: 443
            path: /
            pathType: ImplementationSpecific
  tls:
    - hosts:
        - thakicloud-tech.thakicloud.net
      secretName: thakicloud-tls
status:
  loadBalancer:
    ingress:
      - ip: 172.16.0.237`;

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

export function EditIngressYamlPage() {
  const navigate = useNavigate();
  const { ingressId } = useParams<{ ingressId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [yamlContent, setYamlContent] = useState('');
  const [ingressName, setIngressName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load ingress data
  useEffect(() => {
    if (ingressId) {
      // TODO: Fetch actual ingress data from API
      setYamlContent(getMockIngressYaml(ingressId));
      setIngressName('thakicloud');
    }
  }, [ingressId]);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    if (ingressName) {
      updateActiveTabLabel(`Edit ingress: ${ingressName}`);
    }
  }, [ingressName, updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 248 : 48;

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
    navigate('/container/ingresses');
  }, [navigate]);

  // Handle save
  const handleSave = useCallback(() => {
    // TODO: Implement actual ingress update via API
    console.log('Saving ingress with YAML:', yamlContent);
    navigate('/container/ingresses');
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
                { label: 'Ingresses', href: '/container/ingresses' },
                { label: ingressName || 'Edit ingress' },
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
          <h1 className="text-heading-h4 text-[var(--color-text-default)]">
            ingress: {ingressName}
          </h1>
          <InlineMessage variant="warning">
            This ingress is managed by a Helm app; changes made here will likely be overwritten the
            next time Helm runs.
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

export default EditIngressYamlPage;
