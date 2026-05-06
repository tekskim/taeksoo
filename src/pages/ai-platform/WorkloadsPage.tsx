import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  PageHeader,
  Table,
  Pagination,
  StatusIndicator,
  ContextMenu,
  ListToolbar,
  FilterSearchInput,
  Drawer,
  Toggle,
  InfoBox,
  Select,
  InlineMessage,
  Disclosure,
  FormField,
} from '@/design-system';
import type { FilterField, AppliedFilter, TableColumn } from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconLock,
  IconCopy,
  IconDotsVertical,
  IconExternalLink,
} from '@tabler/icons-react';
import type { StatusType } from '@/design-system/components/StatusIndicator/StatusIndicator';

interface WorkloadItem {
  id: string;
  name: string;
  label: string;
  status: StatusType;
  locked: boolean;
  cpuUtil: string;
  gpuUtil: string;
  memSystem: string;
  memVram: string;
  diskContainer: string;
  diskVolume: string;
  computeType: string;
  cost: string;
}

const MOCK_DATA: WorkloadItem[] = [
  {
    id: 'wl-001',
    name: 'llama3-70b-inference',
    label: 'prod-gpu-a100',
    status: 'active',
    locked: true,
    cpuUtil: '90%',
    gpuUtil: '0%',
    memSystem: '90%',
    memVram: '0%',
    diskContainer: '90%',
    diskVolume: '0%',
    computeType: '-',
    cost: '$ 0.1/hr',
  },
  {
    id: 'wl-002',
    name: 'qwen3-finetune-v2',
    label: 'train-gpu-h100',
    status: 'active',
    locked: true,
    cpuUtil: '75%',
    gpuUtil: '95%',
    memSystem: '82%',
    memVram: '88%',
    diskContainer: '60%',
    diskVolume: '45%',
    computeType: 'H100',
    cost: '$ 2.5/hr',
  },
  {
    id: 'wl-003',
    name: 'data-preprocessing',
    label: 'cpu-only-batch',
    status: 'active',
    locked: false,
    cpuUtil: '45%',
    gpuUtil: '-',
    memSystem: '30%',
    memVram: '-',
    diskContainer: '70%',
    diskVolume: '20%',
    computeType: '-',
    cost: '$ 0.05/hr',
  },
  {
    id: 'wl-004',
    name: 'stable-diffusion-xl',
    label: 'gpu-render-01',
    status: 'error',
    locked: false,
    cpuUtil: '12%',
    gpuUtil: '0%',
    memSystem: '15%',
    memVram: '0%',
    diskContainer: '90%',
    diskVolume: '85%',
    computeType: 'A100',
    cost: '$ 1.2/hr',
  },
  {
    id: 'wl-005',
    name: 'mistral-7b-deploy',
    label: 'inference-pool-a',
    status: 'active',
    locked: true,
    cpuUtil: '55%',
    gpuUtil: '72%',
    memSystem: '65%',
    memVram: '60%',
    diskContainer: '40%',
    diskVolume: '10%',
    computeType: 'A10G',
    cost: '$ 0.8/hr',
  },
  {
    id: 'wl-006',
    name: 'embedding-service',
    label: 'embed-cpu-02',
    status: 'paused',
    locked: false,
    cpuUtil: '0%',
    gpuUtil: '-',
    memSystem: '0%',
    memVram: '-',
    diskContainer: '25%',
    diskVolume: '5%',
    computeType: '-',
    cost: '$ 0.0/hr',
  },
  {
    id: 'wl-007',
    name: 'rag-pipeline-prod',
    label: 'rag-gpu-mix',
    status: 'active',
    locked: true,
    cpuUtil: '68%',
    gpuUtil: '50%',
    memSystem: '72%',
    memVram: '45%',
    diskContainer: '55%',
    diskVolume: '30%',
    computeType: 'T4',
    cost: '$ 0.3/hr',
  },
  {
    id: 'wl-008',
    name: 'catboost-training',
    label: 'ml-train-cpu',
    status: 'building',
    locked: false,
    cpuUtil: '0%',
    gpuUtil: '-',
    memSystem: '0%',
    memVram: '-',
    diskContainer: '10%',
    diskVolume: '0%',
    computeType: '-',
    cost: '$ 0.0/hr',
  },
  {
    id: 'wl-009',
    name: 'vllm-serving-01',
    label: 'vllm-h100-pod',
    status: 'error',
    locked: false,
    cpuUtil: '8%',
    gpuUtil: '0%',
    memSystem: '12%',
    memVram: '0%',
    diskContainer: '95%',
    diskVolume: '90%',
    computeType: 'H100',
    cost: '$ 3.0/hr',
  },
  {
    id: 'wl-010',
    name: 'tensorrt-optimize',
    label: 'opt-a100-01',
    status: 'paused',
    locked: false,
    cpuUtil: '0%',
    gpuUtil: '0%',
    memSystem: '0%',
    memVram: '0%',
    diskContainer: '30%',
    diskVolume: '15%',
    computeType: 'A100',
    cost: '$ 0.0/hr',
  },
  {
    id: 'wl-011',
    name: 'whisper-transcribe',
    label: 'audio-gpu-01',
    status: 'active',
    locked: false,
    cpuUtil: '40%',
    gpuUtil: '65%',
    memSystem: '50%',
    memVram: '55%',
    diskContainer: '20%',
    diskVolume: '10%',
    computeType: 'T4',
    cost: '$ 0.25/hr',
  },
  {
    id: 'wl-012',
    name: 'llama3-8b-lora',
    label: 'lora-train-h100',
    status: 'building',
    locked: false,
    cpuUtil: '0%',
    gpuUtil: '0%',
    memSystem: '0%',
    memVram: '0%',
    diskContainer: '5%',
    diskVolume: '0%',
    computeType: 'H100',
    cost: '$ 0.0/hr',
  },
  {
    id: 'wl-013',
    name: 'xgboost-batch-pred',
    label: 'batch-cpu-03',
    status: 'paused',
    locked: true,
    cpuUtil: '0%',
    gpuUtil: '-',
    memSystem: '0%',
    memVram: '-',
    diskContainer: '45%',
    diskVolume: '20%',
    computeType: '-',
    cost: '$ 0.0/hr',
  },
  {
    id: 'wl-014',
    name: 'gemma-2b-inference',
    label: 'gemma-a10g-01',
    status: 'active',
    locked: false,
    cpuUtil: '35%',
    gpuUtil: '80%',
    memSystem: '45%',
    memVram: '70%',
    diskContainer: '15%',
    diskVolume: '5%',
    computeType: 'A10G',
    cost: '$ 0.6/hr',
  },
  {
    id: 'wl-015',
    name: 'deepseek-v3-serve',
    label: 'ds-multi-gpu',
    status: 'building',
    locked: false,
    cpuUtil: '0%',
    gpuUtil: '0%',
    memSystem: '0%',
    memVram: '0%',
    diskContainer: '8%',
    diskVolume: '0%',
    computeType: 'H100',
    cost: '$ 0.0/hr',
  },
];

function SummaryCard({
  label,
  count,
  status,
}: {
  label: string;
  count: number;
  status: StatusType;
}) {
  return (
    <div className="flex flex-1 items-center justify-between min-w-0 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] px-4 py-3">
      <VStack gap={1.5}>
        <span className="text-label-sm text-[var(--color-text-subtle)]">{label}</span>
        <span className="text-body-md text-[var(--color-text-default)]">{count}</span>
      </VStack>
      <StatusIndicator status={status} layout="icon-only" />
    </div>
  );
}

function DualCell({ top, bottom }: { top: string; bottom: string }) {
  return (
    <VStack gap={0.5}>
      <span className="text-body-md text-[var(--color-text-default)]">{top}</span>
      <span className="text-body-md text-[var(--color-text-subtle)]">{bottom}</span>
    </VStack>
  );
}

const ITEMS_PER_PAGE = 10;

const PORT_OPTIONS = [
  { value: '80', label: 'Port 80' },
  { value: '443', label: 'Port 443' },
  { value: '8080', label: 'Port 8080' },
];

const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Enter name...' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'error', label: 'Error' },
      { value: 'paused', label: 'Stopped' },
      { value: 'building', label: 'Creating' },
    ],
  },
  {
    id: 'computeType',
    label: 'Compute Type',
    type: 'select',
    options: [
      { value: 'H100', label: 'H100' },
      { value: 'A100', label: 'A100' },
      { value: 'A10G', label: 'A10G' },
      { value: 'T4', label: 'T4' },
    ],
  },
];

export function WorkloadsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Workloads');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [workloads, setWorkloads] = useState<WorkloadItem[]>(() => [...MOCK_DATA]);
  const [isLockOpen, setIsLockOpen] = useState(false);
  const [lockTarget, setLockTarget] = useState<WorkloadItem | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [connectTarget, setConnectTarget] = useState<WorkloadItem | null>(null);
  const [selectedPort, setSelectedPort] = useState('80');

  const connectAccessUrl = useMemo(() => {
    if (!connectTarget) return '';
    return `https://${connectTarget.name}.ai-platform.thaki.cloud:${selectedPort}`;
  }, [connectTarget, selectedPort]);

  const filteredData = useMemo(() => {
    if (appliedFilters.length === 0) return workloads;
    return workloads.filter((item) => {
      return appliedFilters.every((filter) => {
        if (filter.fieldId === 'name') {
          return item.name.toLowerCase().includes(String(filter.value).toLowerCase());
        }
        if (filter.fieldId === 'status') {
          return item.status === filter.value;
        }
        if (filter.fieldId === 'computeType') {
          return item.computeType === filter.value;
        }
        return true;
      });
    });
  }, [appliedFilters, workloads]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const paginatedData = useMemo(
    () => filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredData, currentPage]
  );

  const summaryStats = useMemo(() => {
    const stats = { active: 0, error: 0, paused: 0, building: 0 };
    workloads.forEach((item) => {
      if (item.status === 'active') stats.active++;
      else if (item.status === 'error') stats.error++;
      else if (item.status === 'paused') stats.paused++;
      else if (item.status === 'building') stats.building++;
    });
    return stats;
  }, [workloads]);

  const openLockDrawer = useCallback((row: WorkloadItem) => {
    setLockTarget(row);
    setIsLocked(row.locked);
    setIsLockOpen(true);
  }, []);

  const openConnectDrawer = useCallback((row: WorkloadItem) => {
    setConnectTarget(row);
    setSelectedPort('80');
    setIsConnectOpen(true);
  }, []);

  const handleLockSave = useCallback(() => {
    if (!lockTarget) return;
    setWorkloads((prev) =>
      prev.map((w) => (w.id === lockTarget.id ? { ...w, locked: isLocked } : w))
    );
    setIsLockOpen(false);
    setLockTarget(null);
  }, [lockTarget, isLocked]);

  const closeLockDrawer = useCallback(() => {
    setIsLockOpen(false);
    setLockTarget(null);
  }, []);

  const closeConnectDrawer = useCallback(() => {
    setIsConnectOpen(false);
    setConnectTarget(null);
  }, []);

  const handleFiltersChange = useCallback((filters: AppliedFilter[]) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  }, []);

  const toolbarFilters = useMemo(
    () =>
      appliedFilters.map((f) => {
        const field = filterFields.find((ff) => ff.id === f.fieldId);
        return { id: f.fieldId, label: field?.label || f.fieldId, value: String(f.value) };
      }),
    [appliedFilters]
  );

  const removeFilter = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.fieldId !== filterId));
  }, []);

  const clearAllFilters = useCallback(() => {
    setAppliedFilters([]);
  }, []);

  const getRowActions = useCallback(
    (row: WorkloadItem) => [
      { id: 'start', label: 'Start', onClick: () => console.log('Start', row.id) },
      { id: 'stop', label: 'Stop', onClick: () => console.log('Stop', row.id) },
      { id: 'restart', label: 'Restart', onClick: () => console.log('Restart', row.id) },
      { id: 'connect', label: 'Connect', onClick: () => openConnectDrawer(row) },
      { id: 'lock', label: 'Lock setting', onClick: () => openLockDrawer(row) },
      {
        id: 'delete',
        label: 'Delete',
        status: 'danger' as const,
        divider: true,
        onClick: () => console.log('Delete', row.id),
      },
    ],
    [openConnectDrawer, openLockDrawer]
  );

  const columns: TableColumn<WorkloadItem>[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        width: '59px',
        align: 'center' as const,
        render: (_: unknown, row: WorkloadItem) => (
          <StatusIndicator status={row.status} layout="icon-only" />
        ),
      },
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        minWidth: '200px',
        render: (_: unknown, row: WorkloadItem) => (
          <VStack gap={0.5}>
            <span className="text-body-md font-medium text-[var(--color-action-primary)] cursor-pointer hover:underline">
              {row.name}
            </span>
            <HStack gap={1.5} align="center">
              <span className="text-body-md text-[var(--color-text-subtle)]">{row.label}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(row.label);
                }}
                className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors"
                aria-label="Copy label"
              >
                <IconCopy size={12} stroke={1.5} />
              </button>
            </HStack>
          </VStack>
        ),
      },
      {
        key: 'locked',
        label: 'Locked',
        width: '62px',
        align: 'center' as const,
        render: (_: unknown, row: WorkloadItem) =>
          row.locked ? (
            <IconLock size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
          ) : null,
      },
      {
        key: 'utilization',
        label: 'Utilization',
        minWidth: '140px',
        render: (_: unknown, row: WorkloadItem) => (
          <HStack gap={0}>
            <div className="flex-1 min-w-0">
              <DualCell top={row.cpuUtil} bottom="CPU" />
            </div>
            <div className="flex-1 min-w-0">
              <DualCell top={row.gpuUtil} bottom="GPU" />
            </div>
          </HStack>
        ),
      },
      {
        key: 'memory',
        label: 'Memory',
        minWidth: '140px',
        render: (_: unknown, row: WorkloadItem) => (
          <HStack gap={0}>
            <div className="flex-1 min-w-0">
              <DualCell top={row.memSystem} bottom="System" />
            </div>
            <div className="flex-1 min-w-0">
              <DualCell top={row.memVram} bottom="vRAM" />
            </div>
          </HStack>
        ),
      },
      {
        key: 'disk',
        label: 'Disk',
        minWidth: '160px',
        render: (_: unknown, row: WorkloadItem) => (
          <HStack gap={0}>
            <div className="flex-1 min-w-0">
              <DualCell top={row.diskContainer} bottom="Container Disk" />
            </div>
            <div className="flex-1 min-w-0">
              <DualCell top={row.diskVolume} bottom="Volume" />
            </div>
          </HStack>
        ),
      },
      {
        key: 'computeType',
        label: 'Compute type',
        minWidth: '120px',
        render: (val: string) => (
          <span className="text-body-md text-[var(--color-text-default)]">{val}</span>
        ),
      },
      {
        key: 'cost',
        label: 'Cost',
        minWidth: '100px',
        render: (val: string) => (
          <span className="text-body-md text-[var(--color-text-default)]">{val}</span>
        ),
      },
      {
        key: 'action',
        label: 'Action',
        width: '72px',
        align: 'center' as const,
        render: (_: unknown, row: WorkloadItem) => (
          <ContextMenu items={getRowActions(row)} trigger="click">
            <button
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] p-[10px] hover:bg-[var(--color-surface-hover)] transition-colors size-[28px]"
              aria-label="Actions"
            >
              <IconDotsVertical size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
            </button>
          </ContextMenu>
        ),
      },
    ],
    [getRowActions]
  );

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
          breadcrumb={<Breadcrumb items={[{ label: 'Workloads' }]} />}
          actions={
            <button
              className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
              aria-label="Notifications"
            >
              <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={3}>
        <PageHeader
          title="Workloads"
          actions={
            <HStack gap={1}>
              <Button variant="secondary" size="md">
                Refresh
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/ai-platform/workloads/deploy')}
              >
                Deploy new pod
              </Button>
            </HStack>
          }
        />

        <HStack gap={2}>
          <SummaryCard label="Available" count={summaryStats.active} status="active" />
          <SummaryCard label="Failed" count={summaryStats.error} status="error" />
          <SummaryCard label="Stopped" count={summaryStats.paused} status="paused" />
          <SummaryCard label="Creating" count={summaryStats.building} status="building" />
        </HStack>

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={filterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={handleFiltersChange}
                placeholder="Find workloads with filters"
                size="sm"
                className="w-[var(--search-input-width)]"
                hideAppliedFilters
              />
            </ListToolbar.Actions>
          }
          bulkActions={
            <ListToolbar.Actions>
              <Button variant="muted" size="sm" disabled={selectedItems.length === 0}>
                Delete
              </Button>
            </ListToolbar.Actions>
          }
          filters={toolbarFilters}
          onFilterRemove={removeFilter}
          onFiltersClear={clearAllFilters}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          selectedCount={selectedItems.length}
        />

        <Table
          columns={columns}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedItems}
          onSelectionChange={setSelectedItems}
          emptyMessage="No workloads found"
        />
      </VStack>

      <Drawer
        isOpen={isLockOpen}
        onClose={closeLockDrawer}
        title="Lock setting"
        description="Locking an instance prevents it from being deleted or modified. You can unlock it anytime to allow changes again."
        width={376}
        footer={
          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={closeLockDrawer} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleLockSave} className="flex-1">
              Save
            </Button>
          </HStack>
        }
      >
        <VStack gap={6}>
          <InfoBox label="Workload" value={lockTarget?.name ?? ''} />
          <FormField label="Lock Status" spacing="loose">
            <Toggle
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              label="Locked"
            />
          </FormField>
        </VStack>
      </Drawer>

      <Drawer
        isOpen={isConnectOpen}
        onClose={closeConnectDrawer}
        title="Connect"
        description="Enables external access to web services running inside a Pod via routing or by establishing a direct SSH session."
        width={376}
        footer={
          <Button variant="secondary" onClick={closeConnectDrawer} className="w-full">
            Close
          </Button>
        }
      >
        <VStack gap={6}>
          <FormField label="HTTP service" description="Access your service through web browser">
            <Select
              options={PORT_OPTIONS}
              value={selectedPort}
              onChange={setSelectedPort}
              fullWidth
            />
          </FormField>
          <InfoBox label="Access URL" value={connectAccessUrl} copyable />
          <InlineMessage variant="info">
            This URL connects to your Pod&apos;s web service through a secure session-based proxy.
            Most web applications like Jupyter, VS Code Server are supported.
          </InlineMessage>
          <Disclosure defaultOpen={false}>
            <Disclosure.Trigger>
              <span className="text-heading-h6 text-[var(--color-text-default)]">
                Advanced connection options
              </span>
            </Disclosure.Trigger>
            <Disclosure.Panel className="pt-2">
              <VStack gap={2}>
                <span className="text-body-md text-[var(--color-text-subtle)]">
                  Secure shell access for advanced users
                </span>
                <Button variant="secondary" size="sm" rightIcon={<IconExternalLink size={12} />}>
                  Set Up SSH Connection
                </Button>
                <InlineMessage variant="info">
                  SSH access requires setting up a secure connection through our bastion host. This
                  process takes 5-10 seconds.
                </InlineMessage>
              </VStack>
            </Disclosure.Panel>
          </Disclosure>
        </VStack>
      </Drawer>
    </PageShell>
  );
}

export default WorkloadsPage;
