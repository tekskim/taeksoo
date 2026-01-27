import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Breadcrumb, VStack, TabBar, TopBar } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconDownload,
} from '@tabler/icons-react';

/* ----------------------------------------
   Sample Node YAML
   ---------------------------------------- */

const getSampleNodeYaml = (nodeName: string) => `apiVersion: v1
kind: Node
metadata:
  annotations:
    alpha.kubernetes.io/provided-node-ip: 172.16.0.237
    csi.volume.kubernetes.io/nodeid: '{"driver.csi.io":"thakicloud"}'
    flannel.alpha.coreos.com/backend-data: '{"VNI":1,"VtepMAC":"f6:a6:94:b8:68:8f"}'
    flannel.alpha.coreos.com/backend-type: vxlan
    flannel.alpha.coreos.com/kube-subnet-manager: 'true'
    flannel.alpha.coreos.com/public-ip: 172.16.0.237
    k3s.io/hostname: ${nodeName}
    k3s.io/internal-ip: 172.16.0.237
    k3s.io/node-args: '["server","--write-kubeconfig-mode","644"]'
    k3s.io/node-config-hash: NME4CSI4TJQMUMCIGOV4CCH62TS6XKU3X76HI5FBHM5MLGQSQ75Q====
    k3s.io/node-env: '{}'
    management.cattle.io/pod-limits: '{"cpu":"400m","memory":"852Mi"}'
    management.cattle.io/pod-requests: '{"cpu":"1360m","memory":"338Mi","pods":"43"}'
    node.alpha.kubernetes.io/ttl: '0'
    volumes.kubernetes.io/controller-managed-attach-detach: 'true'
  creationTimestamp: '2025-10-14T06:59:07Z'
  finalizers:
    - wrangler.cattle.io/node
  labels:
    beta.kubernetes.io/arch: amd64
    beta.kubernetes.io/instance-type: k3s
    beta.kubernetes.io/os: linux
    kubernetes.io/arch: amd64
    kubernetes.io/hostname: ${nodeName}
    kubernetes.io/os: linux
    node-role.kubernetes.io/control-plane: 'true'
    node-role.kubernetes.io/master: 'true'
    node.kubernetes.io/instance-type: k3s
  managedFields:
    - apiVersion: v1
      fieldsType: FieldsV1
      fieldsV1:
        f:metadata:
          f:annotations:
            .: {}
            f:alpha.kubernetes.io/provided-node-ip: {}
            f:k3s.io/hostname: {}
            f:k3s.io/internal-ip: {}
            f:k3s.io/node-args: {}
            f:k3s.io/node-config-hash: {}
            f:k3s.io/node-env: {}
            f:node.alpha.kubernetes.io/ttl: {}
            f:volumes.kubernetes.io/controller-managed-attach-detach: {}
          f:labels:
            .: {}
            f:beta.kubernetes.io/arch: {}
            f:beta.kubernetes.io/instance-type: {}
            f:beta.kubernetes.io/os: {}
            f:kubernetes.io/arch: {}
            f:kubernetes.io/hostname: {}
            f:kubernetes.io/os: {}
            f:node.kubernetes.io/instance-type: {}
  name: ${nodeName}
  resourceVersion: '12345678'
  uid: a1b2c3d4-e5f6-7890-abcd-ef1234567890
spec:
  podCIDR: 10.42.0.0/24
  podCIDRs:
    - 10.42.0.0/24
  providerID: k3s://${nodeName}
status:
  addresses:
    - address: 172.16.0.237
      type: InternalIP
    - address: ${nodeName}
      type: Hostname
  allocatable:
    cpu: '4'
    ephemeral-storage: '95035Mi'
    hugepages-1Gi: '0'
    hugepages-2Mi: '0'
    memory: 7917Mi
    pods: '110'
  capacity:
    cpu: '4'
    ephemeral-storage: 103110Mi
    hugepages-1Gi: '0'
    hugepages-2Mi: '0'
    memory: 8019Mi
    pods: '110'
  conditions:
    - lastHeartbeatTime: '2025-01-15T10:00:00Z'
      lastTransitionTime: '2025-10-14T06:59:07Z'
      message: kubelet has sufficient memory available
      reason: KubeletHasSufficientMemory
      status: 'False'
      type: MemoryPressure
    - lastHeartbeatTime: '2025-01-15T10:00:00Z'
      lastTransitionTime: '2025-10-14T06:59:07Z'
      message: kubelet has no disk pressure
      reason: KubeletHasNoDiskPressure
      status: 'False'
      type: DiskPressure
    - lastHeartbeatTime: '2025-01-15T10:00:00Z'
      lastTransitionTime: '2025-10-14T06:59:07Z'
      message: kubelet has sufficient PID available
      reason: KubeletHasSufficientPID
      status: 'False'
      type: PIDPressure
    - lastHeartbeatTime: '2025-01-15T10:00:00Z'
      lastTransitionTime: '2025-10-14T06:59:07Z'
      message: kubelet is posting ready status
      reason: KubeletReady
      status: 'True'
      type: Ready
  nodeInfo:
    architecture: amd64
    bootID: 12345678-90ab-cdef-1234-567890abcdef
    containerRuntimeVersion: containerd://1.7.11-k3s2
    kernelVersion: 5.15.0-100-generic
    kubeProxyVersion: v1.29.1+k3s2
    kubeletVersion: v1.29.1+k3s2
    machineID: abcdef1234567890abcdef1234567890
    operatingSystem: linux
    osImage: Ubuntu 22.04.3 LTS
    systemUUID: 12345678-90AB-CDEF-1234-567890ABCDEF`;

/* ----------------------------------------
   YAML Editor with Line Numbers
   ---------------------------------------- */

interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCopy: () => void;
  onDownload: () => void;
}

function YamlEditor({ value, onChange, onCopy, onDownload }: YamlEditorProps) {
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
        <div className="font-mono text-[12px] leading-[18px] text-[var(--color-text-subtle)]">
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
          className="w-full h-full py-2 px-2.5 pr-20 font-mono text-[12px] leading-[18px] text-[var(--color-text-default)] bg-transparent border-none outline-none resize-none overflow-auto yaml-editor-scroll"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {/* Action Buttons - Absolute positioned */}
      <div className="absolute top-2 right-4 flex gap-2">
        <button
          onClick={onCopy}
          className="flex items-center justify-center w-7 h-7 border border-[var(--color-border-strong)] rounded-[6px] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          title="Copy to clipboard"
        >
          <IconCopy size={12} stroke={1.5} />
        </button>
        <button
          onClick={onDownload}
          className="flex items-center justify-center w-7 h-7 border border-[var(--color-border-strong)] rounded-[6px] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          title="Download YAML"
        >
          <IconDownload size={12} stroke={1.5} />
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function EditNodeYamlPage() {
  const navigate = useNavigate();
  const { nodeName: nodeNameParam } = useParams<{ nodeName: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Node name from URL
  const nodeName = nodeNameParam || 'node-control-plane-01';

  const [yamlContent, setYamlContent] = useState(() => getSampleNodeYaml(nodeName));

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel(`Edit YAML: ${nodeName}`);
  }, [updateActiveTabLabel, nodeName]);

  // Update YAML when nodeName changes
  useEffect(() => {
    setYamlContent(getSampleNodeYaml(nodeName));
  }, [nodeName]);

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

  // Handle download
  const handleDownload = useCallback(() => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nodeName}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [yamlContent, nodeName]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate('/container/nodes');
  }, [navigate]);

  // Handle save
  const handleSave = useCallback(() => {
    // TODO: Implement actual node update via API
    console.log('Saving node YAML:', yamlContent);
    navigate('/container/nodes');
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
                { label: 'Nodes', href: '/container/nodes' },
                { label: `Edit YAML: ${nodeName}` },
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

        {/* Page Content */}
        <div className="flex-1 overflow-hidden min-w-[var(--layout-content-min-width)] flex flex-col">
          <div className="flex-1 flex flex-col pt-4 px-8 pb-6 bg-[var(--color-surface-default)] min-h-0">
            <VStack gap={6} className="flex-1 min-h-0">
              {/* Header */}
              <div className="flex-shrink-0">
                <h1 className="text-[16px] leading-[24px] font-semibold text-[var(--color-text-default)]">
                  Node: {nodeName}
                </h1>
              </div>

              {/* YAML Editor */}
              <YamlEditor
                value={yamlContent}
                onChange={setYamlContent}
                onCopy={handleCopy}
                onDownload={handleDownload}
              />

              {/* Footer */}
              <div className="flex-shrink-0 flex items-center justify-end gap-3 pt-4">
                <Button variant="secondary" size="md" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditNodeYamlPage;
