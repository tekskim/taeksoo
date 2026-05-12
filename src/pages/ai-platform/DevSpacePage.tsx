import { useState, useEffect, useMemo } from 'react';
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
  StatusIndicator,
  ContextMenu,
  SearchInput,
  EmptyState,
  Drawer,
  FormField,
  Input,
  Select,
  InfoBox,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import {
  IconTrash,
  IconCode,
  IconExternalLink,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';
import type { StatusType } from '@/design-system/components/StatusIndicator/StatusIndicator';

interface DevSpaceItem {
  id: string;
  name: string;
  image: string;
  cpuCount: string;
  memory: string;
  storage: string;
  ports: string;
  status: StatusType;
}

const MOCK_DATA: DevSpaceItem[] = [
  {
    id: 'ds-001',
    name: 'Project A',
    image: 'ghcr.io/thakicloud/aio-sandbox:latest',
    cpuCount: '2',
    memory: '4Gi',
    storage: '10Gi (tkai-nfs-agent)',
    ports: '8080',
    status: 'active',
  },
  {
    id: 'ds-002',
    name: 'Project A',
    image: 'ghcr.io/thakicloud/aio-sandbox:latest',
    cpuCount: '2',
    memory: '4Gi',
    storage: '10Gi (tkai-nfs-agent)',
    ports: '8080',
    status: 'error',
  },
  {
    id: 'ds-003',
    name: 'Project A',
    image: 'ghcr.io/thakicloud/aio-sandbox:latest',
    cpuCount: '2',
    memory: '4Gi',
    storage: '10Gi (tkai-nfs-agent)',
    ports: '8080',
    status: 'building',
  },
];

const GPU_OPTIONS = [
  { value: 'none', label: 'No GPU' },
  { value: 'nvidia-t4', label: 'NVIDIA T4' },
  { value: 'nvidia-a100', label: 'NVIDIA A100' },
  { value: 'nvidia-h100', label: 'NVIDIA H100' },
];

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] px-4 py-3">
      <VStack gap={1.5}>
        <span className="text-label-sm text-[var(--color-text-subtle)]">{label}</span>
        <span className="text-body-md text-[var(--color-text-default)]">{value}</span>
      </VStack>
    </div>
  );
}

export function DevSpacePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [webAccessDrawerOpen, setWebAccessDrawerOpen] = useState(false);
  const [selectedDevSpace, setSelectedDevSpace] = useState<DevSpaceItem | null>(null);

  const [formName, setFormName] = useState('');
  const [formCpu, setFormCpu] = useState('2');
  const [formMemory, setFormMemory] = useState('4Gi');
  const [formStorage, setFormStorage] = useState('10Gi');
  const [formGpu, setFormGpu] = useState('none');

  useEffect(() => {
    updateActiveTabLabel('DevSpace');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const filteredData = useMemo(() => {
    if (!searchQuery) return MOCK_DATA;
    return MOCK_DATA.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.image.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const runningCount = MOCK_DATA.filter((d) => d.status === 'active').length;
  const failedCount = MOCK_DATA.filter((d) => d.status === 'error').length;
  const pendingCount = MOCK_DATA.filter((d) => d.status === 'building').length;

  const handleWebAccess = (item: DevSpaceItem) => {
    setSelectedDevSpace(item);
    setWebAccessDrawerOpen(true);
  };

  const getContextMenuItems = (row: DevSpaceItem) => [
    { id: 'web-access', label: 'Web access', onClick: () => handleWebAccess(row) },
    { id: 'delete', label: 'Delete', status: 'danger' as const, divider: true, onClick: () => {} },
  ];

  const columns: TableColumn<DevSpaceItem>[] = [
    {
      key: 'status',
      title: 'Status',
      width: 60,
      align: 'center' as const,
      render: (_v: unknown, row: DevSpaceItem) => (
        <StatusIndicator status={row.status} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      minWidth: 160,
    },
    {
      key: 'image',
      title: 'Image',
      minWidth: 220,
    },
    {
      key: 'type',
      title: 'Type',
      minWidth: 100,
      render: (_v: unknown, row: DevSpaceItem) => (
        <VStack gap={0}>
          <span className="text-body-md text-[var(--color-text-default)]">CPU</span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">{row.cpuCount}</span>
        </VStack>
      ),
    },
    {
      key: 'memory',
      title: 'Memory',
      minWidth: 100,
    },
    {
      key: 'storage',
      title: 'Storage',
      minWidth: 180,
    },
    {
      key: 'ports',
      title: 'Ports',
      minWidth: 100,
    },
    {
      key: 'action',
      title: 'Action',
      width: 72,
      align: 'center' as const,
      render: (_v: unknown, row: DevSpaceItem) => (
        <ContextMenu items={getContextMenuItems(row)} trigger="click">
          <button className="p-1 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)]">
            <IconDotsCircleHorizontal
              size={16}
              stroke={1.5}
              className="text-[var(--color-text-default)]"
            />
          </button>
        </ContextMenu>
      ),
    },
  ];

  const resetForm = () => {
    setFormName('');
    setFormCpu('2');
    setFormMemory('4Gi');
    setFormStorage('10Gi');
    setFormGpu('none');
  };

  const handleCreateOpen = () => {
    resetForm();
    setCreateDrawerOpen(true);
  };

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
          breadcrumb={<Breadcrumb items={[{ label: 'MLOps' }, { label: 'DevSpace' }]} />}
          actions={<AiPlatformTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={3}>
        <PageHeader
          title="DevSpace"
          actions={
            <HStack gap={2}>
              <Button variant="secondary" size="md" onClick={() => {}}>
                Refresh
              </Button>
              <Button variant="primary" size="md" onClick={handleCreateOpen}>
                Create DevSpace
              </Button>
            </HStack>
          }
        />

        <div className="flex w-full items-start gap-2">
          <StatCard label="Running" value={runningCount} />
          <StatCard label="Failed" value={failedCount} />
          <StatCard label="Pending" value={pendingCount} />
        </div>

        <HStack gap={2} align="center">
          <SearchInput
            placeholder="Find projects with filter"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
            className="w-[280px]"
          />
          <div className="w-px h-4 bg-[var(--color-border-default)]" />
          <Button
            variant="muted"
            size="sm"
            leftIcon={<IconTrash size={12} />}
            disabled={selectedItems.length === 0}
          >
            Delete
          </Button>
        </HStack>

        {filteredData.length === 0 ? (
          <EmptyState
            variant="inline"
            icon={<IconCode size={48} stroke={1} />}
            title="No DevSpaces"
            description="Create your first DevSpace to start developing."
          />
        ) : (
          <Table
            columns={columns}
            data={filteredData}
            rowKey="id"
            selectable
            selectedKeys={selectedItems}
            onSelectionChange={setSelectedItems}
          />
        )}
      </VStack>

      <Drawer
        isOpen={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        title="Create DevSpace"
        width={376}
        footer={
          <HStack gap={2} className="w-full">
            <Button
              variant="secondary"
              onClick={() => setCreateDrawerOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setCreateDrawerOpen(false)} className="flex-1">
              Create
            </Button>
          </HStack>
        }
      >
        <VStack gap={6}>
          <InfoBox label="Container Image" value="ghcr.io/thakicloud/aio-sandbox:latest" />

          <FormField label="DevSpace Name" required>
            <Input
              placeholder="Enter a name for this DevSpace"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              fullWidth
            />
          </FormField>

          <FormField
            label="CPU Request"
            helperText="Example: 2 (cores) or 500m (millicores)"
            required
          >
            <Input value={formCpu} onChange={(e) => setFormCpu(e.target.value)} fullWidth />
          </FormField>

          <FormField label="Memory Request" helperText="Example: 4Gi, 512Mi" required>
            <Input value={formMemory} onChange={(e) => setFormMemory(e.target.value)} fullWidth />
          </FormField>

          <FormField label="Storage Size" helperText="Example: 10Gi, 50Gi, 100Gi" required>
            <Input value={formStorage} onChange={(e) => setFormStorage(e.target.value)} fullWidth />
          </FormField>

          <FormField label="GPU Type" helperText="Description">
            <Select
              options={GPU_OPTIONS}
              value={formGpu}
              onChange={(v) => setFormGpu(v)}
              fullWidth
            />
          </FormField>
        </VStack>
      </Drawer>

      <Drawer
        isOpen={webAccessDrawerOpen}
        onClose={() => setWebAccessDrawerOpen(false)}
        title="Web access"
        description={`Port access information for ${selectedDevSpace?.name ?? ''}`}
        width={376}
      >
        <VStack gap={6}>
          <InfoBox label="Name" value={selectedDevSpace?.name ?? ''} />
          <InfoBox label="Namespace" value="project-b0bfb7ee-7bb5-4cdc-9098-289ed2271e7" />
          <VStack gap={3}>
            <InfoBox label="Port" value="8080 → 8080" />
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-4 py-3">
              <span className="text-body-md text-[var(--color-text-default)] break-all font-mono">
                https://76d9950c080f-8080.tkai.thakicloud.site
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconExternalLink size={12} />}
              onClick={() =>
                window.open('https://76d9950c080f-8080.tkai.thakicloud.site', '_blank')
              }
            >
              Open in browser
            </Button>
          </VStack>
        </VStack>
      </Drawer>
    </PageShell>
  );
}

export default DevSpacePage;
