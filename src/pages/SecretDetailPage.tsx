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
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconChevronDown,
  IconEye,
  IconEyeOff,
  IconPencilCog,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface SecretData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  secretType: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  data: Record<string, string>;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockSecretData: Record<string, SecretData> = {
  '1': {
    id: '1',
    name: 'secretName',
    status: 'OK',
    namespace: 'namespaceName',
    secretType: 'Custom type - customType',
    createdAt: 'Nov 10, 2025 09:23:41',
    labels: {},
    annotations: {},
    data: {
      Key1: 'supersecretvalue1',
      Key2: 'supersecretvalue2',
    },
  },
  '2': {
    id: '2',
    name: 'db-credentials',
    status: 'True',
    namespace: 'default',
    secretType: 'Opaque',
    createdAt: 'Nov 9, 2025 14:07:22',
    labels: {
      app: 'database',
    },
    annotations: {
      description: 'Database credentials',
    },
    data: {
      username: 'admin',
      password: 'dbpassword123',
    },
  },
  '3': {
    id: '3',
    name: 'tls-secret',
    status: 'Raw',
    namespace: 'nginx-ingress',
    secretType: 'kubernetes.io/tls',
    createdAt: 'Nov 8, 2025 11:45:33',
    labels: {},
    annotations: {},
    data: {
      'tls.crt': '-----BEGIN CERTIFICATE-----...',
      'tls.key': '-----BEGIN PRIVATE KEY-----...',
    },
  },
  '4': {
    id: '4',
    name: 'docker-registry',
    status: 'None',
    namespace: 'default',
    secretType: 'kubernetes.io/dockerconfigjson',
    createdAt: 'Nov 7, 2025 16:52:08',
    labels: {},
    annotations: {},
    data: {
      '.dockerconfigjson': '{"auths":{"registry.example.com":{"auth":"..."}}}',
    },
  },
  '5': {
    id: '5',
    name: 'service-account-token',
    status: 'OK',
    namespace: 'kube-system',
    secretType: 'kubernetes.io/service-account-token',
    createdAt: 'Nov 6, 2025 08:30:15',
    labels: {
      'kubernetes.io/service-account.name': 'default',
    },
    annotations: {
      'kubernetes.io/service-account.uid': 'abc-123-def',
    },
    data: {
      'ca.crt': '-----BEGIN CERTIFICATE-----...',
      namespace: 'kube-system',
      token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  },
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function SecretDetailPage() {
  const { secretId } = useParams<{ secretId: string }>();
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
  const [visibleValues, setVisibleValues] = useState<Record<string, boolean>>({});

  // Shell Panel state
  const shellPanel = useShellPanel();

  // Load Secret data
  const [secretData, setSecretData] = useState<SecretData | null>(null);

  useEffect(() => {
    if (secretId && mockSecretData[secretId]) {
      setSecretData(mockSecretData[secretId]);
    } else {
      // Default to first secret if not found
      setSecretData(mockSecretData['1']);
    }
  }, [secretId]);

  // Update tab label to match the Secret name (most recent breadcrumb)
  useEffect(() => {
    if (secretData) {
      updateActiveTabLabel(secretData.name);
    }
  }, [updateActiveTabLabel, secretData]);

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
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // More actions menu
  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'edit-config',
      label: 'Edit config',
      onClick: () => navigate(`/container/secrets/${secretId}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/secrets/${secretData?.name ?? secretId}/edit-yaml`),
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

  if (!secretData) {
    return <div>Loading...</div>;
  }

  // Format labels
  const labelsCount = Object.keys(secretData.labels).length;

  // Format annotations
  const annotationsCount = Object.keys(secretData.annotations).length;

  // Format data entries
  const dataEntries = Object.entries(secretData.data);

  // Toggle value visibility
  const toggleValueVisibility = (key: string) => {
    setVisibleValues((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Mask value
  const maskValue = (value: string) => {
    return '••••••••';
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
                { label: 'Secrets', href: '/container/secrets' },
                { label: secretData.name },
              ]}
            />
          }
          actions={
            <>
              <button
                className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                onClick={() => window.dispatchEvent(new CustomEvent('open-cluster-appearance'))}
                aria-label="Customize cluster appearance"
              >
                <IconPencilCog size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button
                className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                onClick={() => {
                  if (shellPanel.isExpanded) {
                    shellPanel.setIsExpanded(false);
                  } else {
                    shellPanel.openConsole('kubectl-secret', `Kubectl: ${secretData.name}`);
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
          <DetailHeader.Title>Secret: {secretData.name}</DetailHeader.Title>
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
                <Tooltip content={secretData.status}>
                  <span className="max-w-[80px] truncate">
                    <Badge theme="white" size="sm">
                      {secretData.status}
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
                  onClick={() => navigate(`/container/namespaces/${secretData.namespace}`)}
                >
                  {secretData.namespace}
                </span>
              }
            />
            <DetailHeader.InfoCard label="Secret type" value={secretData.secretType} />
            <DetailHeader.InfoCard label="Created at" value={secretData.createdAt} />
            <DetailHeader.InfoCard
              label={`Labels (${labelsCount})`}
              value={
                labelsCount > 0
                  ? Object.entries(secretData.labels)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(', ')
                  : '-'
              }
            />
            <DetailHeader.InfoCard
              label={`Annotations (${annotationsCount})`}
              value={
                annotationsCount > 0
                  ? Object.entries(secretData.annotations)
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
                              value={visibleValues[key] ? value : maskValue(value)}
                              onChange={() => {}}
                              fullWidth
                              rightElement={
                                <HStack gap={1} className="flex-shrink-0">
                                  <button
                                    onClick={() => toggleValueVisibility(key)}
                                    className="hover:text-[var(--color-text-default)] transition-colors"
                                    aria-label={visibleValues[key] ? 'Hide value' : 'Show value'}
                                  >
                                    {visibleValues[key] ? (
                                      <IconEyeOff size={14} stroke={1.5} />
                                    ) : (
                                      <IconEye size={14} stroke={1.5} />
                                    )}
                                  </button>
                                  <CopyButton
                                    value={value}
                                    size="md"
                                    iconOnly
                                    variant="ghost"
                                    className="text-[var(--color-action-primary)] hover:bg-transparent"
                                  />
                                </HStack>
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
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}
