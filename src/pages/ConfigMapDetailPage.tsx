import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
  Input,
  FormField,
  ContextMenu,
  DetailHeader,
  Badge,
  Tooltip,
  PageShell,
  CopyButton,
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
  status: string;
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
    status: 'OK',
    namespace: 'default',
    createdAt: 'Nov 10, 2025 01:17:01',
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
    status: 'True',
    namespace: 'nginx-ingress',
    createdAt: 'Nov 9, 2025 18:04:44',
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
    status: 'Raw',
    namespace: 'kube-system',
    createdAt: 'Nov 8, 2025 11:51:27',
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
    status: 'None',
    namespace: 'kube-system',
    createdAt: 'Nov 7, 2025 04:38:10',
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
    status: 'OK',
    namespace: 'monitoring',
    createdAt: 'Nov 6, 2025 21:25:53',
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
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'data';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

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
      label: 'Edit config',
      onClick: () =>
        navigate(
          `/container/configmaps/${configMapId}/edit?name=${encodeURIComponent(configMapData?.name ?? configMapId)}`
        ),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () =>
        navigate(`/container/configmaps/${configMapData?.name ?? configMapId}/edit-yaml`),
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
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
      bottomPanel={
        <ShellPanel
          tabs={shellPanel.tabs}
          activeTabId={shellPanel.activeTabId}
          isExpanded={shellPanel.isExpanded}
          onTabChange={shellPanel.setActiveTabId}
          onTabClose={shellPanel.closeTab}
          onToggleExpand={() => shellPanel.setIsExpanded(!shellPanel.isExpanded)}
          onOpenInNewTab={handleOpenInNewTab}
          sidebarOpen={sidebarOpen}
          sidebarWidth={sidebarWidth}
        />
      }
      bottomPanelPadding={shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0'}
      contentClassName="pt-4 px-8 pb-20"
    >
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
                More actions
              </Button>
            </ContextMenu>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={
                <Tooltip content={configMapData.status}>
                  <span className="max-w-[80px] truncate">
                    <Badge theme="white" size="sm">
                      {configMapData.status}
                    </Badge>
                  </span>
                </Tooltip>
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
            <DetailHeader.InfoCard label="Created at" value={configMapData.createdAt} />
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
                  <span className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                    Data
                  </span>

                  {/* Data Entries */}
                  {dataEntries.length > 0 ? (
                    <VStack gap={2}>
                      {dataEntries.map(([key, value]) => (
                        <div
                          key={key}
                          className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3"
                        >
                          <HStack gap={2} className="w-full">
                            <FormField label="Key" className="flex-1">
                              <Input value={key} onChange={() => {}} fullWidth />
                            </FormField>
                            <FormField label="Value" className="flex-1">
                              <Input
                                value={value}
                                onChange={() => {}}
                                fullWidth
                                rightElement={
                                  <CopyButton
                                    value={value}
                                    size="md"
                                    iconOnly
                                    variant="ghost"
                                    className="text-[var(--color-action-primary)] hover:bg-transparent"
                                  />
                                }
                              />
                            </FormField>
                          </HStack>
                        </div>
                      ))}
                    </VStack>
                  ) : (
                    <p className="text-body-md text-[var(--color-text-subtle)]">No data entries.</p>
                  )}
                </VStack>
              </div>

              {/* Binary Data Section */}
              <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-3">
                <VStack gap={3}>
                  {/* Section Header */}
                  <span className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                    Binary data
                  </span>

                  {/* Binary Data Entries */}
                  {binaryDataEntries.length > 0 ? (
                    <VStack gap={2}>
                      {binaryDataEntries.map(([key, value]) => (
                        <div
                          key={key}
                          className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3"
                        >
                          <HStack gap={2} className="w-full">
                            <FormField label="Key" className="flex-1">
                              <Input value={key} onChange={() => {}} fullWidth />
                            </FormField>
                            <FormField label="Value" className="flex-1">
                              <Input
                                value={value}
                                onChange={() => {}}
                                fullWidth
                                rightElement={
                                  <CopyButton
                                    value={value}
                                    size="md"
                                    iconOnly
                                    variant="ghost"
                                    className="text-[var(--color-action-primary)] hover:bg-transparent"
                                  />
                                }
                              />
                            </FormField>
                          </HStack>
                        </div>
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
    </PageShell>
  );
}
