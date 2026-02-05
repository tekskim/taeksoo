import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Button,
  ContextMenu,
  DetailHeader,
  type ContextMenuItem,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface ConfigMapData {
  id: string;
  name: string;
  status: 'Active' | 'Pending' | 'Error';
  namespace: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  data: Record<string, string>;
  binaryData: Record<string, string>;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockConfigMapData: Record<string, ConfigMapData> = {
  '1': {
    id: '1',
    name: 'app-config',
    status: 'Active',
    namespace: 'default',
    createdAt: '2025-11-10 12:57',
    labels: {},
    annotations: {},
    data: {
      'config.yaml': 'server:\n  port: 8080\n  host: 0.0.0.0',
      'settings.json': '{"debug": true, "logLevel": "info"}',
    },
    binaryData: {
      'cert.pem': 'base64encodeddata...',
      'key.pem': 'base64encodeddata...',
    },
  },
  '2': {
    id: '2',
    name: 'nginx-config',
    status: 'Active',
    namespace: 'nginx-ingress',
    createdAt: '2025-11-09 14:30',
    labels: {
      app: 'nginx',
    },
    annotations: {
      description: 'Nginx configuration',
    },
    data: {
      'nginx.conf': 'worker_processes 1;\nevents { worker_connections 1024; }',
    },
    binaryData: {},
  },
  '3': {
    id: '3',
    name: 'kube-root-ca.crt',
    status: 'Active',
    namespace: 'kube-system',
    createdAt: '2025-11-08 09:15',
    labels: {},
    annotations: {},
    data: {
      'ca.crt': '-----BEGIN CERTIFICATE-----\nMIIBdjCCAR2gAwIBAgI...',
    },
    binaryData: {},
  },
  '4': {
    id: '4',
    name: 'coredns',
    status: 'Active',
    namespace: 'kube-system',
    createdAt: '2025-11-07 16:45',
    labels: {
      'k8s-app': 'kube-dns',
    },
    annotations: {},
    data: {
      Corefile: '.:53 {\n    errors\n    health\n    kubernetes cluster.local\n}',
      NodeHosts: '# Kubernetes-managed hosts file',
      'Corefile.bak': '# Backup configuration',
      'custom.zones': '# Custom DNS zones',
    },
    binaryData: {},
  },
  '5': {
    id: '5',
    name: 'prometheus-config',
    status: 'Active',
    namespace: 'monitoring',
    createdAt: '2025-11-06 11:20',
    labels: {
      app: 'prometheus',
    },
    annotations: {
      'prometheus.io/scrape': 'true',
    },
    data: {
      'prometheus.yml':
        'global:\n  scrape_interval: 15s\nscrape_configs:\n  - job_name: prometheus',
      'rules.yml': 'groups:\n  - name: example\n    rules: []',
      'alerts.yml': 'groups:\n  - name: alerts\n    rules: []',
      'recording.yml': '# Recording rules',
      'custom.yml': '# Custom configuration',
      'targets.json': '[]',
    },
    binaryData: {},
  },
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ConfigMapDetailPage() {
  const { configMapId } = useParams<{ configMapId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    tabs,
    activeTabId,
    selectTab,
    closeTab,
    addNewTab,
    moveTab,
    addTab,
    updateActiveTabLabel,
  } = useTabs();
  const [activeTab, setActiveTab] = useState('data');

  // Shell Panel state
  const shellPanel = useShellPanel();

  // Load ConfigMap data
  const [configMapData, setConfigMapData] = useState<ConfigMapData | null>(null);

  useEffect(() => {
    if (configMapId && mockConfigMapData[configMapId]) {
      setConfigMapData(mockConfigMapData[configMapId]);
    } else {
      // Default to first configmap if not found
      setConfigMapData(mockConfigMapData['1']);
    }
  }, [configMapId]);

  // Update tab label to match the ConfigMap name (most recent breadcrumb)
  useEffect(() => {
    if (configMapData) {
      updateActiveTabLabel(configMapData.name);
    }
  }, [updateActiveTabLabel, configMapData]);

  // Handle opening shell tab in new browser tab
  const handleOpenInNewTab = (tab: ShellTab) => {
    const tabId = `console-${tab.instanceId}-${Date.now()}`;
    addTab({
      id: tabId,
      label: tab.title,
      path: `/container/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`,
      closable: true,
    });
    navigate(`/container/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`);
  };

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // More actions menu
  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'edit-config',
      label: 'Edit Config',
      onClick: () => navigate(`/container/configmaps/${configMapId}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/configmaps/${configMap.name}/edit-yaml`),
    },
    {
      id: 'download-yaml',
      label: 'Download YAML',
      onClick: () => console.log('Download YAML'),
    },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete'),
    },
  ];

  if (!configMapData) {
    return <div>Loading...</div>;
  }

  // Format labels
  const labelsCount = Object.keys(configMapData.labels).length;

  // Format annotations
  const annotationsCount = Object.keys(configMapData.annotations).length;

  // Format data entries
  const dataEntries = Object.entries(configMapData.data);
  const binaryDataEntries = Object.entries(configMapData.binaryData);

  // Copy to clipboard function
  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    // Could add toast notification here
  };

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
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'ConfigMaps', href: '/container/configmaps' },
                { label: configMapData.name },
              ]}
            />
          }
          actions={
            <>
              <button
                className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                onClick={() => {
                  if (shellPanel.isExpanded) {
                    shellPanel.setIsExpanded(false);
                  } else {
                    shellPanel.openConsole('kubectl-cm', `Kubectl: ${configMapData.name}`);
                  }
                }}
              >
                <IconTerminal2
                  size={16}
                  className={
                    shellPanel.isExpanded
                      ? 'text-[var(--color-action-primary)]'
                      : 'text-[var(--color-text-muted)]'
                  }
                  stroke={1.5}
                />
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

        {/* Content Area */}
        <div
          className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll"
          style={{ paddingBottom: shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0' }}
        >
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={6}>
              {/* Header */}
              <DetailHeader>
                <DetailHeader.Title>ConfigMap: {configMapData.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <ContextMenu items={moreActionsItems} trigger="click" align="right">
                    <Button
                      variant="secondary"
                      size="sm"
                      rightIcon={<IconChevronDown size={12} stroke={1.5} />}
                    >
                      More Actions
                    </Button>
                  </ContextMenu>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Status"
                    value={configMapData.status}
                    status={
                      configMapData.status === 'Active'
                        ? 'active'
                        : configMapData.status === 'Pending'
                          ? 'pending'
                          : 'error'
                    }
                  />
                  <DetailHeader.InfoCard
                    label="Namespace"
                    value={
                      <span
                        className="text-[var(--color-action-primary)] cursor-pointer hover:underline"
                        onClick={() => navigate(`/container/namespaces/${configMapData.namespace}`)}
                      >
                        {configMapData.namespace}
                      </span>
                    }
                  />
                  <DetailHeader.InfoCard label="Created At" value={configMapData.createdAt} />
                  <DetailHeader.InfoCard
                    label={`Labels (${labelsCount})`}
                    value={
                      labelsCount > 0
                        ? Object.entries(configMapData.labels)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(', ')
                        : '-'
                    }
                  />
                  <DetailHeader.InfoCard
                    label={`Annotations (${annotationsCount})`}
                    value={
                      annotationsCount > 0
                        ? Object.entries(configMapData.annotations)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(', ')
                        : '-'
                    }
                  />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs */}
              <Tabs value={activeTab} onChange={setActiveTab} size="sm">
                <TabList>
                  <Tab value="data">Data</Tab>
                </TabList>

                {/* Data Tab */}
                <TabPanel value="data">
                  <VStack gap={3}>
                    {/* Data Section */}
                    <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-3">
                      <VStack gap={3}>
                        {/* Section Header */}
                        <HStack gap={1} align="center">
                          <span className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                            Data
                          </span>
                          <span className="text-label-lg leading-[20px] text-[var(--color-text-subtle)]">
                            ({dataEntries.length})
                          </span>
                        </HStack>

                        {/* Data Entries */}
                        {dataEntries.length > 0 ? (
                          <VStack gap={3}>
                            {dataEntries.map(([key, value], index) => (
                              <HStack key={key} gap={2} align="end" className="w-full">
                                {/* Key Column */}
                                <div className="w-[240px]">
                                  {index === 0 && (
                                    <label className="text-label-sm text-[var(--color-text-default)] mb-2 block">
                                      Key
                                    </label>
                                  )}
                                  <div className="w-full h-[36px] px-2.5 py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-md)] text-body-md text-[var(--color-text-default)] flex items-center">
                                    {key}
                                  </div>
                                </div>
                                {/* Value Column */}
                                <div className="flex-1">
                                  {index === 0 && (
                                    <label className="text-label-sm text-[var(--color-text-default)] mb-2 block">
                                      Value
                                    </label>
                                  )}
                                  <div className="w-full h-[36px] px-2.5 py-1.5 bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--primitive-radius-md)] text-body-md text-[var(--color-text-default)] flex items-center justify-between">
                                    <span className="truncate">{value}</span>
                                    <button
                                      className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors flex-shrink-0"
                                      onClick={() => copyToClipboard(value)}
                                      aria-label="Copy value"
                                    >
                                      <IconCopy
                                        size={16}
                                        className="text-[var(--color-text-muted)]"
                                        stroke={1.5}
                                      />
                                    </button>
                                  </div>
                                </div>
                              </HStack>
                            ))}
                          </VStack>
                        ) : (
                          <p className="text-body-md text-[var(--color-text-subtle)]">
                            No data entries.
                          </p>
                        )}
                      </VStack>
                    </div>

                    {/* Binary Data Section */}
                    <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-3">
                      <VStack gap={3}>
                        {/* Section Header */}
                        <HStack gap={1} align="center">
                          <span className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                            Binary Data
                          </span>
                          <span className="text-label-lg leading-[20px] text-[var(--color-text-subtle)]">
                            ({binaryDataEntries.length})
                          </span>
                        </HStack>

                        {/* Binary Data Entries */}
                        {binaryDataEntries.length > 0 ? (
                          <VStack gap={3}>
                            {binaryDataEntries.map(([key, value], index) => (
                              <HStack key={key} gap={2} align="end" className="w-full">
                                {/* Key Column */}
                                <div className="w-[240px]">
                                  {index === 0 && (
                                    <label className="text-label-sm text-[var(--color-text-default)] mb-2 block">
                                      Key
                                    </label>
                                  )}
                                  <div className="w-full h-[36px] px-2.5 py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-md)] text-body-md text-[var(--color-text-default)] flex items-center">
                                    {key}
                                  </div>
                                </div>
                                {/* Value Column */}
                                <div className="flex-1">
                                  {index === 0 && (
                                    <label className="text-label-sm text-[var(--color-text-default)] mb-2 block">
                                      Value
                                    </label>
                                  )}
                                  <div className="w-full h-[36px] px-2.5 py-1.5 bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--primitive-radius-md)] text-body-md text-[var(--color-text-default)] flex items-center justify-between">
                                    <span className="truncate">{value}</span>
                                    <button
                                      className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors flex-shrink-0"
                                      onClick={() => copyToClipboard(value)}
                                      aria-label="Copy value"
                                    >
                                      <IconCopy
                                        size={16}
                                        className="text-[var(--color-text-muted)]"
                                        stroke={1.5}
                                      />
                                    </button>
                                  </div>
                                </div>
                              </HStack>
                            ))}
                          </VStack>
                        ) : (
                          <p className="text-body-md text-[var(--color-text-subtle)]">
                            No binary data entries.
                          </p>
                        )}
                      </VStack>
                    </div>
                  </VStack>
                </TabPanel>
              </Tabs>
            </VStack>
          </div>
        </div>

        {/* Shell Panel */}
        <ShellPanel
          tabs={shellPanel.tabs}
          activeTabId={shellPanel.activeTabId}
          isExpanded={shellPanel.isExpanded}
          onTabChange={shellPanel.setActiveTabId}
          onTabClose={shellPanel.closeTab}
          onToggleExpand={() => shellPanel.setIsExpanded(!shellPanel.isExpanded)}
          onOpenInNewTab={handleOpenInNewTab}
        />
      </main>
    </div>
  );
}
