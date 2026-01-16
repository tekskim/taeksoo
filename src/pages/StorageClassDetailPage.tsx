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
  Radio,
  Chip,
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

interface StorageClassData {
  id: string;
  name: string;
  status: 'Active' | 'Pending' | 'Error';
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
    status: 'Active',
    isDefault: true,
    createdAt: '2025-07-25 09:12:20',
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
    },
    annotations: {
      'storageclass.kubernetes.io/is-default-class': 'true',
    },
    parameters: {
      'foo': 'bar',
      'type': 'gp3',
      'fsType': 'ext4',
    },
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'WaitForFirstConsumer',
    allowVolumeExpansion: true,
    mountOptions: ['bar', 'bar', 'bar'],
  },
  '2': {
    id: '2',
    name: 'storageclassName2',
    status: 'Active',
    isDefault: false,
    createdAt: '2025-07-25 09:12:20',
    labels: {
      'app': 'storage',
    },
    annotations: {
      'description': 'Standard storage class',
    },
    parameters: {
      'type': 'standard',
    },
    reclaimPolicy: 'Retain',
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: false,
    mountOptions: ['noatime', 'nodiratime'],
  },
  '3': {
    id: '3',
    name: 'ceph-rbd',
    status: 'Active',
    isDefault: false,
    createdAt: '2025-11-09 14:30',
    labels: {},
    annotations: {},
    parameters: {
      'clusterID': 'ceph-cluster-1',
      'pool': 'replicapool',
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
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, addTab } = useTabs();
  const [activeTab, setActiveTab] = useState('parameters');

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
      id: 'set-default',
      label: 'Set as Default',
      onClick: () => console.log('Set as default'),
    },
    {
      id: 'edit-config',
      label: 'Edit Config',
      onClick: () => navigate(`/container/storage-classes/${storageClassId}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/storage-classes/${storageClassId}/edit-yaml`),
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
          tabs={tabs.map(tab => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
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
                { label: 'Storage Classes', href: '/container/storage-classes' },
                { label: scData.name },
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
                    shellPanel.openConsole('kubectl-sc', `Kubectl: ${scData.name}`);
                  }
                }}
              >
                <IconTerminal2 size={16} className={shellPanel.isExpanded ? "text-[var(--color-action-primary)]" : "text-[var(--color-text-muted)]"} stroke={1.5} />
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

        {/* Content Area */}
        <div 
          className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll"
          style={{ paddingBottom: shellPanel.isExpanded ? '350px' : '0' }}
        >
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={6}>
              {/* Header */}
              <DetailHeader>
                <DetailHeader.Title>Storage Class: {scData.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <ContextMenu items={moreActionsItems} trigger="click" align="right">
                    <Button
                      variant="secondary"
                      size="md"
                      rightIcon={<IconChevronDown size={16} stroke={1.5} />}
                    >
                      More Actions
                    </Button>
                  </ContextMenu>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Status"
                    value={scData.status}
                    status={
                      scData.status === 'Active'
                        ? 'active'
                        : scData.status === 'Pending'
                        ? 'pending'
                        : 'error'
                    }
                  />
                  <DetailHeader.InfoCard
                    label="Default"
                    value={scData.isDefault ? 'Yes' : 'No'}
                  />
                  <DetailHeader.InfoCard
                    label="Created At"
                    value={scData.createdAt}
                  />
                  <DetailHeader.InfoCard
                    label={`Labels (${labelsCount})`}
                    value={
                      labelsCount > 0 ? (
                        <div className="flex flex-wrap items-center gap-1 min-w-0">
                          {Object.entries(scData.labels).slice(0, 1).map(([key, val]) => (
                            <Chip key={key} value={`${key}: ${val}`} maxWidth="100%" />
                          ))}
                          {labelsCount > 1 && (
                            <span className="text-[11px] text-[var(--color-text-default)] cursor-pointer hover:underline">
                              (+{labelsCount - 1})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[12px] text-[var(--color-text-default)]">-</span>
                      )
                    }
                  />
                  <DetailHeader.InfoCard
                    label={`Annotations (${annotationsCount})`}
                    value={
                      annotationsCount > 0 ? (
                        <div className="flex flex-wrap items-center gap-1 min-w-0">
                          {Object.entries(scData.annotations).slice(0, 1).map(([key, val]) => (
                            <Chip key={key} value={`${key}: ${val}`} maxWidth="100%" />
                          ))}
                          {annotationsCount > 1 && (
                            <span className="text-[11px] text-[var(--color-text-default)] cursor-pointer hover:underline">
                              (+{annotationsCount - 1})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[12px] text-[var(--color-text-default)]">-</span>
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
                  <div className="w-full border border-[var(--color-border-default)] rounded-[8px] p-4">
                    <VStack gap={3}>
                      {/* Title */}
                      <h3 className="text-[14px] font-semibold leading-[20px] text-[var(--color-text-default)]">
                        Parameters
                      </h3>

                        {parametersEntries.length > 0 ? (
                          <div className="flex gap-2 w-full">
                            {/* Key Column */}
                            <div className="flex-1">
                              <label className="text-[11px] font-medium text-[var(--color-text-default)] mb-2 block">
                                Key
                              </label>
                              <VStack gap={2}>
                                {parametersEntries.map(([key]) => (
                                  <div
                                    key={key}
                                    className="w-full h-[36px] px-[10px] py-[8px] bg-[var(--color-border-default)] border border-[var(--color-border-strong)] rounded-[6px] text-[12px] text-[var(--color-text-subtle)]"
                                  >
                                    {key}
                                  </div>
                                ))}
                              </VStack>
                            </div>
                            {/* Value Column */}
                            <div className="flex-1">
                              <label className="text-[11px] font-medium text-[var(--color-text-default)] mb-2 block">
                                Value
                              </label>
                              <VStack gap={2}>
                                {parametersEntries.map(([key, val]) => (
                                  <div
                                    key={key}
                                    className="w-full h-[36px] px-[10px] py-[8px] bg-[var(--color-border-default)] border border-[var(--color-border-strong)] rounded-[6px] text-[12px] text-[var(--color-text-subtle)]"
                                  >
                                    {val}
                                  </div>
                                ))}
                              </VStack>
                            </div>
                          </div>
                        ) : (
                          <p className="text-[12px] text-[var(--color-text-subtle)]">
                            No parameters defined.
                          </p>
                        )}
                    </VStack>
                  </div>
                </TabPanel>

                {/* Customize Tab */}
                <TabPanel value="customize">
                  {/* Content Box */}
                  <div className="w-full border border-[var(--color-border-default)] rounded-[8px] px-4 py-3">
                    <VStack gap={3}>
                      {/* Title */}
                      <h3 className="text-[14px] font-semibold leading-[20px] text-[var(--color-text-default)]">
                        Customize
                      </h3>

                        {/* Reclaim Policy */}
                        <VStack gap={1.5} align="start">
                          <label className="text-[14px] font-medium text-[var(--color-text-default)]">
                            Reclaim Policy
                          </label>
                          <VStack gap={1} align="start">
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
                        <VStack gap={1.5} align="start">
                          <label className="text-[14px] font-medium text-[var(--color-text-default)]">
                            Allow Volume Expansion
                          </label>
                          <VStack gap={1} align="start">
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
                        <VStack gap={1.5} align="start">
                          <label className="text-[14px] font-medium text-[var(--color-text-default)]">
                            Volume Binding Mode
                          </label>
                          <VStack gap={1} align="start">
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
                        <VStack gap={2} align="start" className="w-full">
                          <label className="text-[14px] font-medium text-[var(--color-text-default)]">
                            Mount Options
                          </label>
                          {scData.mountOptions.length > 0 ? (
                            <VStack gap={2} className="w-full">
                              {scData.mountOptions.map((option, index) => (
                                <div
                                  key={index}
                                  className="w-full h-[32px] px-[10px] py-[8px] bg-[#e5e7eb] rounded-[6px] text-[12px] text-[var(--color-text-subtle)] flex items-center"
                                >
                                  {option}
                                </div>
                              ))}
                            </VStack>
                          ) : (
                            <p className="text-[12px] text-[var(--color-text-subtle)]">
                              No mount options defined.
                            </p>
                          )}
                        </VStack>
                    </VStack>
                  </div>
                </TabPanel>
              </Tabs>
            </VStack>
          </div>
        </div>
      </main>

      {/* Shell Panel */}
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
        minHeight={300}
        sidebarOpen={sidebarOpen}
        sidebarWidth={sidebarWidth}
      />
    </div>
  );
}

export default StorageClassDetailPage;
