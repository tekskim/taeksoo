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
  Radio,
  Badge,
  Tooltip,
  PageShell,
  type ContextMenuItem,
  Popover,
  CopyButton,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconSearch,
  IconChevronDown,
  IconPencilCog,
  IconKey,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface StorageClassData {
  id: string;
  name: string;
  status: string;
  isDefault: boolean;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  parameters: Record<string, string>;
  reclaimPolicy: 'Delete' | 'Retain';
  volumeBindingMode: 'Immediate' | 'WaitForFirstConsumer';
  allowVolumeExpansion: boolean;
  mountOptions: string[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockStorageClassData: Record<string, StorageClassData> = {
  '1': {
    id: '1',
    name: 'storageclassName1',
    status: 'OK',
    isDefault: true,
    createdAt: 'Jul 25, 2025 10:32:16',
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
    },
    annotations: {
      'storageclass.kubernetes.io/is-default-class': 'true',
    },
    parameters: {
      foo: 'bar',
      type: 'gp3',
      fsType: 'ext4',
    },
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'WaitForFirstConsumer',
    allowVolumeExpansion: true,
    mountOptions: ['bar', 'bar', 'bar'],
  },
  '2': {
    id: '2',
    name: 'storageclassName2',
    status: 'True',
    isDefault: false,
    createdAt: 'Jul 25, 2025 10:32:16',
    labels: {
      app: 'storage',
    },
    annotations: {
      description: 'Standard storage class',
    },
    parameters: {
      type: 'standard',
    },
    reclaimPolicy: 'Retain',
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: false,
    mountOptions: ['noatime', 'nodiratime'],
  },
  '3': {
    id: '3',
    name: 'ceph-rbd',
    status: 'Raw',
    isDefault: false,
    createdAt: 'Nov 9, 2025 18:04:44',
    labels: {},
    annotations: {},
    parameters: {
      clusterID: 'ceph-cluster-1',
      pool: 'replicapool',
    },
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: true,
    mountOptions: [],
  },
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function StorageClassDetailPage() {
  const { storageClassId } = useParams<{ storageClassId: string }>();
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
  const activeTab = searchParams.get('tab') || 'parameters';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Shell Panel state
  const shellPanel = useShellPanel();

  // Load Storage Class data
  const [scData, setScData] = useState<StorageClassData | null>(null);

  useEffect(() => {
    if (storageClassId && mockStorageClassData[storageClassId]) {
      setScData(mockStorageClassData[storageClassId]);
    } else {
      // Default to first storage class if not found
      setScData(mockStorageClassData['1']);
    }
  }, [storageClassId]);

  // Update tab label to match the Storage Class name (most recent breadcrumb)
  useEffect(() => {
    if (scData) {
      updateActiveTabLabel(scData.name);
    }
  }, [updateActiveTabLabel, scData]);

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
      id: 'set-default',
      label: 'Set as default',
      onClick: () => console.log('Set as default'),
    },
    {
      id: 'edit-config',
      label: 'Edit config',
      onClick: () => navigate(`/container/storage-classes/${storageClassId}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () =>
        navigate(`/container/storage-classes/${scData?.name ?? storageClassId}/edit-yaml`),
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

  if (!scData) {
    return <div>Loading...</div>;
  }

  // Format labels
  const labelsCount = Object.keys(scData.labels).length;

  // Format annotations
  const annotationsCount = Object.keys(scData.annotations).length;

  // Format parameters
  const parametersEntries = Object.entries(scData.parameters);

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
                { label: 'Storage classes', href: '/container/storage-classes' },
                { label: scData.name },
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
                onClick={() => window.dispatchEvent(new CustomEvent('open-access-token'))}
                aria-label="Access Token"
              >
                <IconKey size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button
                className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                onClick={() => {
                  if (shellPanel.isExpanded) {
                    shellPanel.setIsExpanded(false);
                  } else {
                    shellPanel.openConsole('kubectl-sc', `Kubectl: ${scData.name}`);
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
              <CopyButton value={scData.name} size="sm" iconOnly />
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
          isExpanded={shellPanel.isExpanded}
          onExpandedChange={shellPanel.setIsExpanded}
          tabs={shellPanel.tabs}
          activeTabId={shellPanel.activeTabId}
          onActiveTabChange={shellPanel.setActiveTabId}
          onCloseTab={shellPanel.closeTab}
          onContentChange={shellPanel.updateContent}
          onClear={shellPanel.clearContent}
          onOpenInNewTab={handleOpenInNewTab}
          initialHeight={350}
          sidebarWidth={sidebarWidth}
        />
      }
      bottomPanelPadding={shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0'}
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Header */}
        <DetailHeader>
          <DetailHeader.Title>Storage Class: {scData.name}</DetailHeader.Title>
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
                <Tooltip content={scData.status}>
                  <span className="max-w-[80px] truncate">
                    <Badge theme="white" size="sm">
                      {scData.status}
                    </Badge>
                  </span>
                </Tooltip>
              }
            />
            <DetailHeader.InfoCard label="Default" value={scData.isDefault ? 'Yes' : 'No'} />
            <DetailHeader.InfoCard label="Created at" value={scData.createdAt} />
            <DetailHeader.InfoCard
              label={`Labels (${labelsCount})`}
              value={
                labelsCount > 0 ? (
                  <div className="flex items-center gap-1 min-w-0">
                    {Object.entries(scData.labels)
                      .slice(0, 1)
                      .map(([key, val]) => (
                        <Badge
                          key={key}
                          theme="white"
                          size="sm"
                          className="min-w-0 truncate justify-start text-left"
                        >
                          {`${key}: ${val}`}
                        </Badge>
                      ))}
                    {labelsCount > 1 && (
                      <Popover
                        trigger="hover"
                        position="bottom"
                        delay={100}
                        hideDelay={100}
                        content={
                          <div className="p-3 min-w-[120px] max-w-[320px]">
                            <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                              All labels ({labelsCount})
                            </div>
                            <div className="flex flex-col gap-1">
                              {Object.entries(scData.labels).map(([k, v]) => (
                                <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                                  <span className="break-all">{`${k}: ${v}`}</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        }
                      >
                        <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                          +{labelsCount - 1}
                        </span>
                      </Popover>
                    )}
                  </div>
                ) : (
                  <span className="text-body-md text-[var(--color-text-default)]">-</span>
                )
              }
            />
            <DetailHeader.InfoCard
              label={`Annotations (${annotationsCount})`}
              value={
                annotationsCount > 0 ? (
                  <div className="flex items-center gap-1 min-w-0">
                    {Object.entries(scData.annotations)
                      .slice(0, 1)
                      .map(([key, val]) => (
                        <Badge
                          key={key}
                          theme="white"
                          size="sm"
                          className="min-w-0 truncate justify-start text-left"
                        >
                          {`${key}: ${val}`}
                        </Badge>
                      ))}
                    {annotationsCount > 1 && (
                      <Popover
                        trigger="hover"
                        position="bottom"
                        delay={100}
                        hideDelay={100}
                        content={
                          <div className="p-3 min-w-[120px] max-w-[320px]">
                            <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                              All annotations ({annotationsCount})
                            </div>
                            <div className="flex flex-col gap-1">
                              {Object.entries(scData.annotations).map(([k, v]) => (
                                <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                                  <span className="break-all">{`${k}: ${v}`}</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        }
                      >
                        <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                          +{annotationsCount - 1}
                        </span>
                      </Popover>
                    )}
                  </div>
                ) : (
                  <span className="text-body-md text-[var(--color-text-default)]">-</span>
                )
              }
            />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} size="sm">
          <TabList>
            <Tab value="parameters">Parameters</Tab>
            <Tab value="customize">Customize</Tab>
          </TabList>

          {/* Parameters Tab */}
          <TabPanel value="parameters">
            {/* Content Box */}
            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-4">
              <VStack gap={3}>
                {/* Title */}
                <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                  Parameters
                </h3>

                {parametersEntries.length > 0 ? (
                  <VStack gap={2} className="w-full">
                    {parametersEntries.map(([key, val]) => (
                      <div
                        key={key}
                        className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3"
                      >
                        <HStack gap={2} className="w-full">
                          <FormField label="Key" disabled className="flex-1">
                            <Input value={key} onChange={() => {}} fullWidth />
                          </FormField>
                          <FormField label="Value" disabled className="flex-1">
                            <Input value={val} onChange={() => {}} fullWidth />
                          </FormField>
                        </HStack>
                      </div>
                    ))}
                  </VStack>
                ) : (
                  <p className="text-body-md text-[var(--color-text-subtle)]">
                    No parameters defined.
                  </p>
                )}
              </VStack>
            </div>
          </TabPanel>

          {/* Customize Tab */}
          <TabPanel value="customize">
            {/* Content Box */}
            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-4">
              <VStack gap={6}>
                {/* Title */}
                <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                  Customize
                </h3>

                {/* Reclaim Policy */}
                <VStack gap={3} align="start">
                  <label className="text-label-lg text-[var(--color-text-default)]">
                    Reclaim policy
                  </label>
                  <VStack gap={2} align="start">
                    <Radio
                      label="Delete volumes and underlying device when volume claim is deleted"
                      checked={scData.reclaimPolicy === 'Delete'}
                      onChange={() => {}}
                      disabled
                    />
                    <Radio
                      label="Retain the volume for manual cleanup"
                      checked={scData.reclaimPolicy === 'Retain'}
                      onChange={() => {}}
                      disabled
                    />
                  </VStack>
                </VStack>

                {/* Allow Volume Expansion */}
                <VStack gap={3} align="start">
                  <label className="text-label-lg text-[var(--color-text-default)]">
                    Allow volume expansion
                  </label>
                  <VStack gap={2} align="start">
                    <Radio
                      label="Enabled"
                      checked={scData.allowVolumeExpansion === true}
                      onChange={() => {}}
                      disabled
                    />
                    <Radio
                      label="Disabled"
                      checked={scData.allowVolumeExpansion === false}
                      onChange={() => {}}
                      disabled
                    />
                  </VStack>
                </VStack>

                {/* Volume Binding Mode */}
                <VStack gap={3} align="start">
                  <label className="text-label-lg text-[var(--color-text-default)]">
                    Volume binding mode
                  </label>
                  <VStack gap={2} align="start">
                    <Radio
                      label="Bind and provision a persistent volume once the PersistentVolumeClaim is created"
                      checked={scData.volumeBindingMode === 'Immediate'}
                      onChange={() => {}}
                      disabled
                    />
                    <Radio
                      label="Bind and provision a persistent volume once a Pod using the PersistentVolumeClaim is created"
                      checked={scData.volumeBindingMode === 'WaitForFirstConsumer'}
                      onChange={() => {}}
                      disabled
                    />
                  </VStack>
                </VStack>

                {/* Mount Options */}
                <VStack gap={3} align="start" className="w-full">
                  <label className="text-label-lg text-[var(--color-text-default)]">
                    Mount options
                  </label>
                  {scData.mountOptions.length > 0 ? (
                    <VStack gap={2} className="w-full">
                      {scData.mountOptions.map((option, index) => (
                        <Input key={index} value={option} onChange={() => {}} fullWidth disabled />
                      ))}
                    </VStack>
                  ) : (
                    <p className="text-body-md text-[var(--color-text-subtle)]">
                      No mount options defined.
                    </p>
                  )}
                </VStack>
              </VStack>
            </div>
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}

export default StorageClassDetailPage;
