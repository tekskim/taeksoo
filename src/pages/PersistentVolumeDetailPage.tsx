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
  Checkbox,
  Select,
  Input,
  Badge,
  PageShell,
  FormField,
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

interface PersistentVolumeData {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  accessModes: {
    singleNodeReadWrite: boolean;
    manyNodesReadOnly: boolean;
    manyNodesReadWrite: boolean;
  };
  storageClass: string;
  mountOptions: string;
  nodeSelectors: NodeSelectorGroup[];
}

interface NodeSelectorGroup {
  id: string;
  items: NodeSelectorItem[];
}

interface NodeSelectorItem {
  id: string;
  key: string;
  operator: string;
  value: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockPersistentVolumeData: Record<string, PersistentVolumeData> = {
  '1': {
    id: '1',
    name: 'pvc-143076e7-d0b2-4d76-92fc-cea5cbe8b3a2',
    status: 'OK',
    createdAt: 'Jul 25, 2025',
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
    },
    annotations: {
      'pv.kubernetes.io/provisioned-by': 'rbd.csi.ceph.com',
    },
    accessModes: {
      singleNodeReadWrite: true,
      manyNodesReadOnly: false,
      manyNodesReadWrite: false,
    },
    storageClass: 'None',
    mountOptions: 'e.g. bar',
    nodeSelectors: [
      {
        id: '1',
        items: [
          { id: '1-1', key: 'key1', operator: 'in list', value: 'value1' },
          { id: '1-2', key: 'key2', operator: 'is set', value: '-' },
        ],
      },
      {
        id: '2',
        items: [{ id: '2-1', key: 'key3', operator: '>', value: 'value3' }],
      },
    ],
  },
  '2': {
    id: '2',
    name: 'pvc-abc12345-1234-5678-abcd-1234567890ab',
    status: 'OK',
    createdAt: 'Jul 24, 2025',
    labels: {
      app: 'postgres',
    },
    annotations: {
      'pv.kubernetes.io/provisioned-by': 'nfs.csi.k8s.io',
    },
    accessModes: {
      singleNodeReadWrite: false,
      manyNodesReadOnly: true,
      manyNodesReadWrite: false,
    },
    storageClass: 'standard',
    mountOptions: '',
    nodeSelectors: [],
  },
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function PersistentVolumeDetailPage() {
  const { pvId } = useParams<{ pvId: string }>();
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
  const [activeTab, setActiveTab] = useState(0);

  // Shell Panel state
  const shellPanel = useShellPanel();

  // Load PV data
  const [pvData, setPvData] = useState<PersistentVolumeData | null>(null);

  useEffect(() => {
    if (pvId && mockPersistentVolumeData[pvId]) {
      setPvData(mockPersistentVolumeData[pvId]);
    } else {
      // Default to first PV if not found
      setPvData(mockPersistentVolumeData['1']);
    }
  }, [pvId]);

  // Update tab label to match the PV name (most recent breadcrumb)
  useEffect(() => {
    if (pvData) {
      updateActiveTabLabel(pvData.name);
    }
  }, [updateActiveTabLabel, pvData]);

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

  if (!pvData) {
    return <div>Loading...</div>;
  }

  // More actions menu
  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'edit-config',
      label: 'Edit config',
      onClick: () => navigate(`/container/persistent-volumes/${pvId}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/persistent-volumes/${pvData.name}/edit-yaml`),
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

  // Format labels
  const labelsCount = Object.keys(pvData.labels).length;
  const firstLabel = Object.entries(pvData.labels)[0];
  const labelsDisplay = firstLabel ? `${firstLabel[0]}: ${firstLabel[1]}` : '-';
  const labelsExtra = labelsCount > 1 ? `(+${labelsCount - 1})` : '';

  // Format annotations
  const annotationsCount = Object.keys(pvData.annotations).length;
  const firstAnnotation = Object.entries(pvData.annotations)[0];
  const annotationsDisplay = firstAnnotation ? `${firstAnnotation[0]}: ${firstAnnotation[1]}` : '-';
  const annotationsExtra = annotationsCount > 1 ? `(+${annotationsCount - 1})` : '';

  // Operator options for node selectors
  const operatorOptions = [
    { value: 'in list', label: 'in list' },
    { value: 'not in list', label: 'not in list' },
    { value: 'is set', label: 'is set' },
    { value: 'is not set', label: 'is not set' },
    { value: '=', label: '=' },
    { value: '!=', label: '!=' },
    { value: '>', label: '>' },
    { value: '<', label: '<' },
  ];

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
                { label: 'Persistent Volumes', href: '/container/persistent-volumes' },
                { label: pvData.name },
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
                    shellPanel.openConsole('kubectl-pv', `Kubectl: ${pvData.name}`);
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
      }
      bottomPanelPadding={shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0'}
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Header */}
        <DetailHeader>
          <DetailHeader.Title>Persistent Volume: {pvData.name}</DetailHeader.Title>
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
              value={pvData.status === 'Bound' ? 'Active' : pvData.status}
              status={
                pvData.status === 'Bound' || pvData.status === 'Available'
                  ? 'active'
                  : pvData.status === 'Pending'
                    ? 'pending'
                    : pvData.status === 'Failed'
                      ? 'error'
                      : 'muted'
              }
            />
            <DetailHeader.InfoCard label="Created at" value={pvData.createdAt} />
            <DetailHeader.InfoCard
              label={`Labels (${labelsCount})`}
              value={
                <div className="flex flex-wrap items-center gap-1 min-w-0">
                  {Object.entries(pvData.labels)
                    .slice(0, 1)
                    .map(([key, val]) => (
                      <Badge key={key} theme="white" size="sm" className="max-w-full truncate">
                        {`${key}: ${val}`}
                      </Badge>
                    ))}
                  {labelsCount > 1 && (
                    <span className="text-body-sm text-[var(--color-text-default)] cursor-pointer hover:underline">
                      (+{labelsCount - 1})
                    </span>
                  )}
                </div>
              }
            />
            <DetailHeader.InfoCard
              label={`Annotations (${annotationsCount})`}
              value={
                <div className="flex flex-wrap items-center gap-1 min-w-0">
                  {Object.entries(pvData.annotations)
                    .slice(0, 1)
                    .map(([key, val]) => (
                      <Badge key={key} theme="white" size="sm" className="max-w-full truncate">
                        {`${key}: ${val}`}
                      </Badge>
                    ))}
                  {annotationsCount > 1 && (
                    <span className="text-body-sm text-[var(--color-text-default)] cursor-pointer hover:underline">
                      (+{annotationsCount - 1})
                    </span>
                  )}
                </div>
              }
            />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} className="w-full">
          <TabList>
            <Tab value={0}>Customize</Tab>
          </TabList>

          {/* Customize Tab */}
          <TabPanel value={0}>
            <VStack gap={3}>
              {/* Customize Content */}
              <div className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-4">
                <VStack gap={6}>
                  {/* Access Modes */}
                  <VStack gap={2} align="start">
                    <h3 className="text-label-lg text-[var(--color-text-default)]">Access Modes</h3>
                    <VStack gap={1.5} align="start">
                      <Checkbox
                        label="Single node read-write"
                        checked={pvData.accessModes.singleNodeReadWrite}
                        onChange={() => {}}
                        disabled
                      />
                      <Checkbox
                        label="Many nodes read-only"
                        checked={pvData.accessModes.manyNodesReadOnly}
                        onChange={() => {}}
                        disabled
                      />
                      <Checkbox
                        label="Many nodes read-write"
                        checked={pvData.accessModes.manyNodesReadWrite}
                        onChange={() => {}}
                        disabled
                      />
                    </VStack>
                  </VStack>

                  {/* Assign to Storage Class */}
                  <FormField label="Assign to Storage Class" disabled className="w-full">
                    <Select
                      options={[
                        { value: 'None', label: 'None' },
                        { value: 'standard', label: 'standard' },
                        { value: 'fast', label: 'fast' },
                      ]}
                      value={pvData.storageClass}
                      onChange={() => {}}
                      placeholder="None"
                      fullWidth
                    />
                  </FormField>

                  {/* Mount Options */}
                  <VStack gap={2} align="start" className="w-full">
                    <h3 className="text-label-lg text-[var(--color-text-default)]">
                      Mount Options
                    </h3>
                    <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                      <FormField label="Value" disabled className="w-full">
                        <Input
                          placeholder="e.g. bar"
                          value={pvData.mountOptions}
                          onChange={() => {}}
                          fullWidth
                        />
                      </FormField>
                    </div>
                  </VStack>

                  {/* Node Selectors */}
                  <VStack gap={2} align="start" className="w-full">
                    <h3 className="text-label-lg text-[var(--color-text-default)]">
                      Node Selectors
                    </h3>
                    <VStack gap={2} className="w-full">
                      {pvData.nodeSelectors.map((group) => (
                        <div
                          key={group.id}
                          className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3"
                        >
                          <VStack gap={2}>
                            {/* Header Row */}
                            <HStack gap={2} className="w-full">
                              <div className="flex-1">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Key
                                </span>
                              </div>
                              <div className="flex-1">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Operator
                                </span>
                              </div>
                              <div className="flex-1">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Value
                                </span>
                              </div>
                            </HStack>
                            {/* Data Rows */}
                            {group.items.map((item) => (
                              <HStack key={item.id} gap={2} className="w-full">
                                <div className="flex-1">
                                  <Input value={item.key} onChange={() => {}} fullWidth disabled />
                                </div>
                                <div className="flex-1">
                                  <Select
                                    options={operatorOptions}
                                    value={item.operator}
                                    onChange={() => {}}
                                    fullWidth
                                    disabled
                                  />
                                </div>
                                <div className="flex-1">
                                  <Input
                                    value={item.value}
                                    onChange={() => {}}
                                    fullWidth
                                    disabled
                                  />
                                </div>
                              </HStack>
                            ))}
                          </VStack>
                        </div>
                      ))}
                      {pvData.nodeSelectors.length === 0 && (
                        <div className="w-full text-center py-4 text-[var(--color-text-subtle)] text-body-md">
                          No node selectors configured
                        </div>
                      )}
                    </VStack>
                  </VStack>
                </VStack>
              </div>
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}

export default PersistentVolumeDetailPage;
