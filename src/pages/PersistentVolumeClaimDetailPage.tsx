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
  ContextMenu,
  DetailHeader,
  Radio,
  RadioGroup,
  Select,
  Input,
  NumberInput,
  FormField,
  Badge,
  Tooltip,
  Checkbox,
  Table,
  Pagination,
  SearchInput,
  PageShell,
  type ContextMenuItem,
  Popover,
  SectionCard,
  columnMinWidths,
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
  IconDownload,
  IconTrash,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface PVCCondition {
  id: string;
  condition: string;
  size: string;
  message: string;
  updated: string;
}

interface PVCEvent {
  id: string;
  lastSeen: string;
  type: 'Normal' | 'Warning';
  reason: string;
  subobject: string;
  source: string;
  message: string;
  firstSeen: string;
  count: number;
  name: string;
}

interface PersistentVolumeClaimData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  source: 'storage-class' | 'existing-pv';
  storageClass: string;
  requestStorage: number;
  storageUnit: string;
  accessModes: {
    singleNodeReadWrite: boolean;
    manyNodesReadOnly: boolean;
    manyNodesReadWrite: boolean;
  };
  conditions: PVCCondition[];
  events: PVCEvent[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockPersistentVolumeClaimData: Record<string, PersistentVolumeClaimData> = {
  '1': {
    id: '1',
    name: 'cert-manager',
    status: 'OK',
    namespace: 'default',
    createdAt: 'Jul 25, 2025 10:32:16',
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
    },
    annotations: {
      'pv.kubernetes.io/bind-completed': 'yes',
    },
    source: 'storage-class',
    storageClass: 'Default Storage Class',
    requestStorage: 10,
    storageUnit: 'GiB',
    accessModes: {
      singleNodeReadWrite: true,
      manyNodesReadOnly: false,
      manyNodesReadWrite: false,
    },
    conditions: [
      {
        id: '1',
        condition: 'Bound',
        size: 'True',
        message: '[Success] Volume bound successfully',
        updated: 'Jul 25, 2025',
      },
      {
        id: '2',
        condition: 'FileSystemResizePending',
        size: 'False',
        message: '[Info] No resize pending',
        updated: 'Jul 25, 2025',
      },
    ],
    events: [
      {
        id: '1',
        lastSeen: '30m',
        type: 'Normal',
        reason: 'ProvisioningSucceeded',
        subobject: 'pvc',
        source: 'persistentvolume-controller',
        message: 'Successfully provisioned volume pvc-cert-manager-001',
        firstSeen: '30m',
        count: 1,
        name: 'cert-manager.17a8b9c0d1e2f3',
      },
      {
        id: '2',
        lastSeen: '25m',
        type: 'Normal',
        reason: 'Bound',
        subobject: 'pvc',
        source: 'persistentvolume-controller',
        message: 'Volume bound successfully to pod',
        firstSeen: '25m',
        count: 1,
        name: 'cert-manager.17a8b9c0d1e2f4',
      },
    ],
  },
  '2': {
    id: '2',
    name: 'data-postgres-0',
    status: 'OK',
    namespace: 'database',
    createdAt: 'Nov 9, 2025 18:04:44',
    labels: {
      app: 'postgres',
    },
    annotations: {
      'pv.kubernetes.io/bind-completed': 'yes',
    },
    source: 'storage-class',
    storageClass: 'standard',
    requestStorage: 50,
    storageUnit: 'GiB',
    accessModes: {
      singleNodeReadWrite: true,
      manyNodesReadOnly: false,
      manyNodesReadWrite: false,
    },
    conditions: [
      {
        id: '1',
        condition: 'Bound',
        size: 'True',
        message: '[Success] Volume bound to pvc-abc12345',
        updated: 'Nov 9, 2025',
      },
    ],
    events: [
      {
        id: '1',
        lastSeen: '1h',
        type: 'Normal',
        reason: 'ProvisioningSucceeded',
        subobject: 'pvc',
        source: 'persistentvolume-controller',
        message: 'Successfully provisioned volume pvc-abc12345',
        firstSeen: '1h',
        count: 1,
        name: 'data-postgres-0.18a9c0d2e3f4',
      },
    ],
  },
  '3': {
    id: '3',
    name: 'redis-data',
    status: 'True',
    namespace: 'cache',
    createdAt: 'Nov 8, 2025 11:51:27',
    labels: {
      app: 'redis',
    },
    annotations: {},
    source: 'existing-pv',
    storageClass: '',
    requestStorage: 5,
    storageUnit: 'GiB',
    accessModes: {
      singleNodeReadWrite: false,
      manyNodesReadOnly: true,
      manyNodesReadWrite: false,
    },
    conditions: [
      {
        id: '1',
        condition: 'Bound',
        size: 'True',
        message: '[Success] Bound to existing PV',
        updated: 'Nov 8, 2025',
      },
    ],
    events: [
      {
        id: '1',
        lastSeen: '2h',
        type: 'Normal',
        reason: 'ExternalProvisioning',
        subobject: 'pvc',
        source: 'external-provisioner',
        message: 'Bound to existing PV redis-pv-001',
        firstSeen: '2h',
        count: 1,
        name: 'redis-data.19b0d1e3f4g5',
      },
    ],
  },
  '4': {
    id: '4',
    name: 'pending-claim',
    status: 'Raw',
    namespace: 'default',
    createdAt: 'Nov 10, 2025 01:17:01',
    labels: {},
    annotations: {},
    source: 'storage-class',
    storageClass: 'nfs',
    requestStorage: 20,
    storageUnit: 'GiB',
    accessModes: {
      singleNodeReadWrite: false,
      manyNodesReadOnly: false,
      manyNodesReadWrite: true,
    },
    conditions: [
      {
        id: '1',
        condition: 'Pending',
        size: 'True',
        message: '[Waiting] Waiting for volume to be provisioned',
        updated: 'Nov 10, 2025',
      },
    ],
    events: [
      {
        id: '1',
        lastSeen: '5m',
        type: 'Warning',
        reason: 'ProvisioningFailed',
        subobject: 'pvc',
        source: 'nfs-provisioner',
        message: 'Failed to provision volume: no storage capacity available',
        firstSeen: '30m',
        count: 6,
        name: 'pending-claim.20c1e2f4g5h6',
      },
      {
        id: '2',
        lastSeen: '10m',
        type: 'Normal',
        reason: 'ExternalProvisioning',
        subobject: 'pvc',
        source: 'nfs-provisioner',
        message: 'Waiting for a volume to be created',
        firstSeen: '30m',
        count: 3,
        name: 'pending-claim.20c1e2f4g5h7',
      },
    ],
  },
  '5': {
    id: '5',
    name: 'elasticsearch-data-0',
    status: 'OK',
    namespace: 'logging',
    createdAt: 'Nov 7, 2025 04:38:10',
    labels: {
      app: 'elasticsearch',
    },
    annotations: {
      'pv.kubernetes.io/bind-completed': 'yes',
    },
    source: 'storage-class',
    storageClass: 'Ceph',
    requestStorage: 100,
    storageUnit: 'GiB',
    accessModes: {
      singleNodeReadWrite: true,
      manyNodesReadOnly: false,
      manyNodesReadWrite: false,
    },
    conditions: [
      {
        id: '1',
        condition: 'Bound',
        size: 'True',
        message: '[Success] Volume bound to pvc-elastic-001',
        updated: 'Nov 7, 2025',
      },
    ],
    events: [
      {
        id: '1',
        lastSeen: '3h',
        type: 'Normal',
        reason: 'ProvisioningSucceeded',
        subobject: 'pvc',
        source: 'ceph-provisioner',
        message: 'Successfully provisioned volume pvc-elastic-001',
        firstSeen: '3h',
        count: 1,
        name: 'elasticsearch-data-0.21d2f3g5h6i7',
      },
    ],
  },
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function PersistentVolumeClaimDetailPage() {
  const { pvcId } = useParams<{ pvcId: string }>();
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
  const activeTab = searchParams.get('tab') || 'volume-claim';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [selectedEventKeys, setSelectedEventKeys] = useState<string[]>([]);

  // Shell Panel state
  const shellPanel = useShellPanel();

  // Load PVC data
  const [pvcData, setPvcData] = useState<PersistentVolumeClaimData | null>(null);

  useEffect(() => {
    if (pvcId && mockPersistentVolumeClaimData[pvcId]) {
      setPvcData(mockPersistentVolumeClaimData[pvcId]);
    } else {
      // Default to first PVC if not found
      setPvcData(mockPersistentVolumeClaimData['1']);
    }
  }, [pvcId]);

  // Update tab label to match the PVC name (most recent breadcrumb)
  useEffect(() => {
    if (pvcData) {
      updateActiveTabLabel(pvcData.name);
    }
  }, [updateActiveTabLabel, pvcData]);

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

  if (!pvcData) {
    return <div>Loading...</div>;
  }

  // More actions menu
  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'edit-config',
      label: 'Edit config',
      onClick: () => navigate(`/container/pvc/${pvcId}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/pvc/${pvcData.name}/edit-yaml`),
    },
    {
      id: 'download-yaml',
      label: 'Download',
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
  const labelsCount = Object.keys(pvcData.labels).length;

  // Format annotations
  const annotationsCount = Object.keys(pvcData.annotations).length;

  // Storage class options
  const storageClassOptions = [
    { value: 'Default Storage Class', label: 'Default storage class' },
    { value: 'standard', label: 'standard' },
    { value: 'fast', label: 'fast' },
    { value: 'Ceph', label: 'Ceph' },
    { value: 'nfs', label: 'nfs' },
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
                { label: 'Persistent volume claims', href: '/container/pvc' },
                { label: pvcData.name },
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
                    shellPanel.openConsole('kubectl-pvc', `Kubectl: ${pvcData.name}`);
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
              <CopyButton value={pvcData.name} size="sm" iconOnly />
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
          <DetailHeader.Title>Persistent Volume Claim: {pvcData.name}</DetailHeader.Title>
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
                <Tooltip content={pvcData.status === 'Bound' ? 'Active' : pvcData.status}>
                  <span className="max-w-[80px] truncate">
                    <Badge theme="white" size="sm">
                      {pvcData.status === 'Bound' ? 'Active' : pvcData.status}
                    </Badge>
                  </span>
                </Tooltip>
              }
            />
            <DetailHeader.InfoCard
              label="Namespace"
              value={
                <span
                  className="text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline"
                  onClick={() => navigate(`/container/namespaces/${pvcData.namespace}`)}
                >
                  {pvcData.namespace}
                </span>
              }
            />
            <DetailHeader.InfoCard label="Created at" value={pvcData.createdAt} />
            <DetailHeader.InfoCard
              label={`Labels (${labelsCount})`}
              value={
                labelsCount > 0 ? (
                  <div className="flex items-center gap-1 min-w-0">
                    {Object.entries(pvcData.labels)
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
                              {Object.entries(pvcData.labels).map(([k, v]) => (
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
                  <span className="text-body-md text-[var(--color-text-subtle)]">-</span>
                )
              }
            />
            <DetailHeader.InfoCard
              label={`Annotations (${annotationsCount})`}
              value={
                annotationsCount > 0 ? (
                  <div className="flex items-center gap-1 min-w-0">
                    {Object.entries(pvcData.annotations)
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
                              {Object.entries(pvcData.annotations).map(([k, v]) => (
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
                  <span className="text-body-md text-[var(--color-text-subtle)]">-</span>
                )
              }
            />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} size="sm" className="w-full">
          <TabList>
            <Tab value="volume-claim">Volume claim</Tab>
            <Tab value="customize">Customize</Tab>
            <Tab value="conditions">Conditions</Tab>
            <Tab value="labels-annotations">Labels & annotations</Tab>
            <Tab value="recent-events">Recent events</Tab>
          </TabList>

          {/* Volume Claim Tab */}
          <TabPanel value="volume-claim">
            <SectionCard>
              <SectionCard.Header title="Volume claim" />
              <SectionCard.Content>
                <VStack gap={6}>
                  {/* Source */}
                  <VStack gap={3} align="start">
                    <h4 className="text-label-lg text-[var(--color-text-default)]">Source</h4>
                    <RadioGroup value={pvcData.source} onChange={() => {}}>
                      <VStack gap={2} align="start">
                        <Radio
                          value="storage-class"
                          label="Use a Storage Class to provision a new Persistent Volume"
                          disabled
                        />
                        <Radio
                          value="existing-pv"
                          label="Use an existing Persistent Volume"
                          disabled
                        />
                      </VStack>
                    </RadioGroup>
                  </VStack>

                  {/* Storage Class */}
                  <FormField label="Storage Class" disabled className="w-full">
                    <Select
                      options={storageClassOptions}
                      value={pvcData.storageClass}
                      onChange={() => {}}
                      placeholder="Default storage class"
                      fullWidth
                    />
                  </FormField>

                  {/* Request Storage */}
                  <FormField label="Request Storage" required disabled className="w-full">
                    <div className="flex items-center gap-3">
                      <NumberInput
                        value={pvcData.requestStorage}
                        onChange={() => {}}
                        min={1}
                        width="sm"
                        disabled
                      />
                      <span className="text-body-md text-[var(--color-text-default)]">
                        {pvcData.storageUnit}
                      </span>
                    </div>
                  </FormField>
                </VStack>
              </SectionCard.Content>
            </SectionCard>
          </TabPanel>

          {/* Customize Tab */}
          <TabPanel value="customize">
            <SectionCard>
              <SectionCard.Header title="Customize" />
              <SectionCard.Content>
                <VStack gap={3} align="start">
                  <h4 className="text-label-lg text-[var(--color-text-default)]">Access modes</h4>
                  <VStack gap={2} align="start">
                    <Checkbox
                      label="Single node read-write"
                      checked={pvcData.accessModes.singleNodeReadWrite}
                      onChange={() => {}}
                      disabled
                    />
                    <Checkbox
                      label="Many nodes read-only"
                      checked={pvcData.accessModes.manyNodesReadOnly}
                      onChange={() => {}}
                      disabled
                    />
                    <Checkbox
                      label="Many nodes read-write"
                      checked={pvcData.accessModes.manyNodesReadWrite}
                      onChange={() => {}}
                      disabled
                    />
                  </VStack>
                </VStack>
              </SectionCard.Content>
            </SectionCard>
          </TabPanel>

          {/* Conditions Tab */}
          <TabPanel value="conditions">
            <VStack gap={3}>
              {/* Title */}
              <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                Conditions
              </h3>

              {/* Pagination */}
              <Pagination
                currentPage={1}
                totalPages={1}
                onPageChange={() => {}}
                totalItems={pvcData.conditions.length}
              />

              {/* Table */}
              {pvcData.conditions.length > 0 ? (
                <Table<PVCCondition>
                  columns={[
                    {
                      key: 'condition',
                      label: 'Condition',
                      sortable: true,
                      flex: 1,
                    },
                    {
                      key: 'size',
                      label: 'Size',
                      sortable: true,
                      flex: 1,
                    },
                    {
                      key: 'message',
                      label: 'Message',
                      sortable: true,
                      flex: 1,
                    },
                    {
                      key: 'updated',
                      label: 'Updated',
                      sortable: true,
                      flex: 1,
                    },
                  ]}
                  data={pvcData.conditions}
                  rowKey="id"
                />
              ) : (
                <p className="text-body-md text-[var(--color-text-subtle)]">
                  No conditions to display.
                </p>
              )}
            </VStack>
          </TabPanel>

          {/* Labels & Annotations Tab */}
          <TabPanel value="labels-annotations">
            {/* Content Box */}
            <SectionCard>
              <SectionCard.Header title="Labels & annotations" />
              <SectionCard.Content>
                <VStack gap={4}>
                  <VStack gap={2} align="start" className="w-full">
                    <h4 className="text-label-lg text-[var(--color-text-default)]">Labels</h4>
                    {labelsCount > 0 ? (
                      <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                        <VStack gap={2}>
                          {Object.entries(pvcData.labels).map(([key, val]) => (
                            <HStack key={key} gap={2} className="w-full">
                              <FormField label="Key" disabled className="flex-1">
                                <Input value={key} onChange={() => {}} fullWidth />
                              </FormField>
                              <FormField label="Value" disabled className="flex-1">
                                <Input value={val} onChange={() => {}} fullWidth />
                              </FormField>
                            </HStack>
                          ))}
                        </VStack>
                      </div>
                    ) : (
                      <p className="text-body-md text-[var(--color-text-subtle)]">No labels</p>
                    )}
                  </VStack>

                  <VStack gap={2} align="start" className="w-full">
                    <h4 className="text-label-lg text-[var(--color-text-default)]">Annotations</h4>
                    {annotationsCount > 0 ? (
                      <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                        <VStack gap={2}>
                          {Object.entries(pvcData.annotations).map(([key, val]) => (
                            <HStack key={key} gap={2} className="w-full">
                              <FormField label="Key" disabled className="flex-1">
                                <Input value={key} onChange={() => {}} fullWidth />
                              </FormField>
                              <FormField label="Value" disabled className="flex-1">
                                <Input value={val} onChange={() => {}} fullWidth />
                              </FormField>
                            </HStack>
                          ))}
                        </VStack>
                      </div>
                    ) : (
                      <p className="text-body-md text-[var(--color-text-subtle)]">No annotations</p>
                    )}
                  </VStack>
                </VStack>
              </SectionCard.Content>
            </SectionCard>
          </TabPanel>

          {/* Recent Events Tab */}
          <TabPanel value="recent-events">
            <VStack gap={3}>
              {/* Title */}
              <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                Recent events
              </h3>

              {/* Search and Actions */}
              <HStack gap={2} align="center">
                <SearchInput
                  placeholder="Search events by attributes"
                  size="sm"
                  className="w-[var(--search-input-width)]"
                />
                <div className="w-px h-5 bg-[var(--color-border-default)]" />
                <HStack gap={1}>
                  <Button
                    variant="muted"
                    size="sm"
                    leftIcon={<IconDownload size={12} stroke={1.5} />}
                    disabled={selectedEventKeys.length === 0}
                  >
                    Download YAML
                  </Button>
                  <Button
                    variant="muted"
                    size="sm"
                    leftIcon={<IconTrash size={12} stroke={1.5} />}
                    disabled={selectedEventKeys.length === 0}
                  >
                    Delete
                  </Button>
                </HStack>
              </HStack>

              {/* Pagination */}
              <Pagination
                currentPage={1}
                totalPages={1}
                onPageChange={() => {}}
                totalItems={pvcData.events.length}
                selectedCount={selectedEventKeys.length}
              />

              {/* Table */}
              {pvcData.events.length > 0 ? (
                <Table<PVCEvent>
                  columns={[
                    {
                      key: 'lastSeen',
                      label: 'Last seen',
                      sortable: true,
                      flex: 1,
                      minWidth: columnMinWidths.lastSeen,
                    },
                    {
                      key: 'type',
                      label: 'Type',
                      sortable: true,
                      flex: 1,
                      minWidth: columnMinWidths.type,
                    },
                    {
                      key: 'reason',
                      label: 'Reason',
                      sortable: true,
                      flex: 1,
                      minWidth: columnMinWidths.reason,
                    },
                    {
                      key: 'subobject',
                      label: 'Subobject',
                      flex: 1,
                      minWidth: columnMinWidths.subobject,
                    },
                    {
                      key: 'source',
                      label: 'Source',
                      sortable: true,
                      flex: 1,
                      minWidth: '120px',
                    },
                    {
                      key: 'message',
                      label: 'Message',
                      sortable: true,
                      flex: 1,
                      minWidth: '350px',
                    },
                    {
                      key: 'firstSeen',
                      label: 'First seen',
                      sortable: true,
                      flex: 1,
                      minWidth: columnMinWidths.firstSeen,
                    },
                    {
                      key: 'count',
                      label: 'Count',
                      sortable: true,
                      flex: 1,
                      minWidth: columnMinWidths.count,
                    },
                    {
                      key: 'name',
                      label: 'Name',
                      sortable: true,
                      flex: 1,
                      render: (value: string) => (
                        <span className="text-[var(--color-action-primary)] cursor-pointer hover:underline font-medium">
                          {value}
                        </span>
                      ),
                    },
                  ]}
                  data={pvcData.events}
                  rowKey="id"
                  selectable
                  selectedKeys={selectedEventKeys}
                  onSelectionChange={setSelectedEventKeys}
                />
              ) : (
                <p className="text-body-md text-[var(--color-text-subtle)]">
                  No recent events to display.
                </p>
              )}
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}

export default PersistentVolumeClaimDetailPage;
