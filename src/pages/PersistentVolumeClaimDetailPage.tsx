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
  RadioGroup,
  Select,
  NumberInput,
  Chip,
  Checkbox,
  Table,
  Pagination,
  SearchInput,
  columnMinWidths,
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
  status: 'Bound' | 'Pending' | 'Lost';
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
    status: 'Bound',
    namespace: 'default',
    createdAt: '2025-07-25 09:12:20',
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
        updated: '2025-07-25 09:12:20',
      },
      {
        id: '2',
        condition: 'FileSystemResizePending',
        size: 'False',
        message: '[Info] No resize pending',
        updated: '2025-07-25 09:12:20',
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
    status: 'Bound',
    namespace: 'database',
    createdAt: '2025-11-09 14:30',
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
        updated: '2025-11-09 14:30',
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
    status: 'Bound',
    namespace: 'cache',
    createdAt: '2025-11-08 09:15',
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
        updated: '2025-11-08 09:15',
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
    status: 'Pending',
    namespace: 'default',
    createdAt: '2025-11-10 08:00',
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
        updated: '2025-11-10 08:00',
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
    status: 'Bound',
    namespace: 'logging',
    createdAt: '2025-11-07 16:45',
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
        updated: '2025-11-07 16:45',
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
  const [activeTab, setActiveTab] = useState('volume-claim');
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

  // More actions menu
  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'edit-config',
      label: 'Edit Config',
      onClick: () => navigate(`/container/pvc/${pvcId}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/pvc/${pvc.name}/edit-yaml`),
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

  if (!pvcData) {
    return <div>Loading...</div>;
  }

  // Format labels
  const labelsCount = Object.keys(pvcData.labels).length;

  // Format annotations
  const annotationsCount = Object.keys(pvcData.annotations).length;

  // Storage class options
  const storageClassOptions = [
    { value: 'Default Storage Class', label: 'Default Storage Class' },
    { value: 'standard', label: 'standard' },
    { value: 'fast', label: 'fast' },
    { value: 'Ceph', label: 'Ceph' },
    { value: 'nfs', label: 'nfs' },
  ];

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
                { label: 'Persistent Volume Claims', href: '/container/pvc' },
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
                <DetailHeader.Title>Persistent Volume Claim: {pvcData.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <ContextMenu items={moreActionsItems} trigger="click" align="left">
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
                    value={pvcData.status === 'Bound' ? 'Active' : pvcData.status}
                    status={
                      pvcData.status === 'Bound'
                        ? 'active'
                        : pvcData.status === 'Pending'
                          ? 'pending'
                          : 'error'
                    }
                  />
                  <DetailHeader.InfoCard
                    label="Namespace"
                    value={
                      <span
                        className="text-body-md text-[var(--color-action-primary)] cursor-pointer hover:underline"
                        onClick={() => navigate(`/container/namespaces/${pvcData.namespace}`)}
                      >
                        {pvcData.namespace}
                      </span>
                    }
                  />
                  <DetailHeader.InfoCard label="Created At" value={pvcData.createdAt} />
                  <DetailHeader.InfoCard
                    label={`Labels (${labelsCount})`}
                    value={
                      labelsCount > 0 ? (
                        <div className="flex flex-wrap items-center gap-1 min-w-0">
                          {Object.entries(pvcData.labels)
                            .slice(0, 1)
                            .map(([key, val]) => (
                              <Chip key={key} value={`${key}: ${val}`} maxWidth="100%" />
                            ))}
                          {labelsCount > 1 && (
                            <span className="text-body-sm text-[var(--color-text-default)] cursor-pointer hover:underline">
                              (+{labelsCount - 1})
                            </span>
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
                        <div className="flex flex-wrap items-center gap-1 min-w-0">
                          {Object.entries(pvcData.annotations)
                            .slice(0, 1)
                            .map(([key, val]) => (
                              <Chip key={key} value={`${key}: ${val}`} maxWidth="100%" />
                            ))}
                          {annotationsCount > 1 && (
                            <span className="text-body-sm text-[var(--color-text-default)] cursor-pointer hover:underline">
                              (+{annotationsCount - 1})
                            </span>
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
                  <Tab value="volume-claim">Volume Claim</Tab>
                  <Tab value="customize">Customize</Tab>
                  <Tab value="conditions">Conditions</Tab>
                  <Tab value="labels-annotations">Labels & Annotations</Tab>
                  <Tab value="recent-events">Recent Events</Tab>
                </TabList>

                {/* Volume Claim Tab */}
                <TabPanel value="volume-claim">
                  {/* Content Box */}
                  <div className="w-full border border-[var(--color-border-default)] rounded-[8px] p-4">
                    <VStack gap={4}>
                      {/* Title */}
                      <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                        Volume Claim
                      </h3>
                      {/* Source */}
                      <VStack gap={1.5} align="start">
                        <h4 className="text-label-lg text-[var(--color-text-default)]">Source</h4>
                        <RadioGroup value={pvcData.source} onChange={() => {}}>
                          <VStack gap={1} align="start">
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
                      <VStack gap={2} align="start" className="w-full">
                        <label className="text-label-sm text-[var(--color-text-default)]">
                          Storage Class
                        </label>
                        <Select
                          options={storageClassOptions}
                          value={pvcData.storageClass}
                          onChange={() => {}}
                          placeholder="Default Storage Class"
                          fullWidth
                          disabled
                        />
                      </VStack>

                      {/* Request Storage */}
                      <VStack gap={2} align="start" className="w-full">
                        <label className="text-label-lg text-[var(--color-text-default)]">
                          Request Storage{' '}
                          <span className="text-[var(--color-state-warning)]">*</span>
                        </label>
                        <div className="flex items-center gap-3 w-full">
                          <div className="flex-1">
                            <NumberInput
                              value={pvcData.requestStorage}
                              onChange={() => {}}
                              min={1}
                              fullWidth
                              disabled
                            />
                          </div>
                          <span className="text-body-md text-[var(--color-text-default)]">
                            {pvcData.storageUnit}
                          </span>
                        </div>
                      </VStack>
                    </VStack>
                  </div>
                </TabPanel>

                {/* Customize Tab */}
                <TabPanel value="customize">
                  {/* Content Box */}
                  <div className="w-full border border-[var(--color-border-default)] rounded-[8px] p-4">
                    <VStack gap={4}>
                      {/* Title */}
                      <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                        Customize
                      </h3>
                      {/* Access Modes */}
                      <VStack gap={1.5} align="start">
                        <h4 className="text-label-lg text-[var(--color-text-default)]">
                          Access Modes
                        </h4>
                        <VStack gap={1} align="start">
                          <Checkbox
                            label="Single Node Read-Write"
                            checked={pvcData.accessModes.singleNodeReadWrite}
                            onChange={() => {}}
                            disabled
                          />
                          <Checkbox
                            label="Many Nodes Read-Only"
                            checked={pvcData.accessModes.manyNodesReadOnly}
                            onChange={() => {}}
                            disabled
                          />
                          <Checkbox
                            label="Many Nodes Read-Write"
                            checked={pvcData.accessModes.manyNodesReadWrite}
                            onChange={() => {}}
                            disabled
                          />
                        </VStack>
                      </VStack>
                    </VStack>
                  </div>
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
                  <div className="w-full border border-[var(--color-border-default)] rounded-[8px] p-4">
                    <VStack gap={4}>
                      {/* Title */}
                      <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                        Labels & Annotations
                      </h3>
                      {/* Labels Section */}
                      <VStack gap={4} align="start" className="w-full">
                        <h4 className="text-label-lg text-[var(--color-text-default)]">Labels</h4>
                        <VStack gap={2} align="start" className="w-full">
                          {labelsCount > 0 ? (
                            Object.entries(pvcData.labels).map(([key, val]) => (
                              <div key={key} className="flex gap-2 w-full">
                                <div className="flex-1">
                                  <label className="text-label-sm text-[var(--color-text-default)] mb-2 block">
                                    Key
                                  </label>
                                  <div className="w-full h-[36px] px-[10px] py-[8px] bg-[var(--color-border-default)] border border-[var(--color-border-strong)] rounded-[6px] text-body-md text-[var(--color-text-default)]">
                                    {key}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <label className="text-label-sm text-[var(--color-text-default)] mb-2 block">
                                    Value
                                  </label>
                                  <div className="w-full h-[36px] px-[10px] py-[8px] bg-[var(--color-border-default)] border border-[var(--color-border-strong)] rounded-[6px] text-body-md text-[var(--color-text-default)]">
                                    {val}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-body-md text-[var(--color-text-subtle)]">
                              No labels
                            </p>
                          )}
                        </VStack>
                      </VStack>

                      {/* Annotations Section */}
                      <VStack gap={4} align="start" className="w-full">
                        <h4 className="text-label-lg text-[var(--color-text-default)]">
                          Annotations
                        </h4>
                        <VStack gap={2} align="start" className="w-full">
                          {annotationsCount > 0 ? (
                            Object.entries(pvcData.annotations).map(([key, val]) => (
                              <div key={key} className="flex gap-2 w-full">
                                <div className="flex-1">
                                  <label className="text-label-sm text-[var(--color-text-default)] mb-2 block">
                                    Key
                                  </label>
                                  <div className="w-full h-[36px] px-[10px] py-[8px] bg-[var(--color-border-default)] border border-[var(--color-border-strong)] rounded-[6px] text-body-md text-[var(--color-text-default)]">
                                    {key}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <label className="text-label-sm text-[var(--color-text-default)] mb-2 block">
                                    Value
                                  </label>
                                  <div className="w-full h-[36px] px-[10px] py-[8px] bg-[var(--color-border-default)] border border-[var(--color-border-strong)] rounded-[6px] text-body-md text-[var(--color-text-default)]">
                                    {val}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-body-md text-[var(--color-text-subtle)]">
                              No annotations
                            </p>
                          )}
                        </VStack>
                      </VStack>
                    </VStack>
                  </div>
                </TabPanel>

                {/* Recent Events Tab */}
                <TabPanel value="recent-events">
                  <VStack gap={3}>
                    {/* Title */}
                    <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                      Recent Events
                    </h3>

                    {/* Search and Actions */}
                    <HStack gap={2} align="center">
                      <SearchInput
                        placeholder="Search events by attributes"
                        size="sm"
                        className="w-[var(--search-input-width)]"
                      />
                      <HStack gap={1}>
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={selectedEventKeys.length === 0}
                        >
                          <IconDownload size={14} stroke={1.5} />
                          Download YAML
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={selectedEventKeys.length === 0}
                        >
                          <IconTrash size={14} stroke={1.5} />
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
                            label: 'Last Seen',
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
                            minWidth: columnMinWidths.source,
                          },
                          {
                            key: 'message',
                            label: 'Message',
                            sortable: true,
                            flex: 1,
                          },
                          {
                            key: 'firstSeen',
                            label: 'First Seen',
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
                            minWidth: columnMinWidths.name,
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

export default PersistentVolumeClaimDetailPage;
