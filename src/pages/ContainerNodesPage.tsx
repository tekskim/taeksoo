import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Button,
  SearchInput,
  Pagination,
  Chip,
  ContextMenu,
  ProgressBar,
  STATUS_THRESHOLDS,
  PageShell,
  PageHeader,
  CopyButton,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
  Badge,
  Tooltip,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate } from 'react-router-dom';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconDownload,
  IconTrash,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface NodeRow {
  id: string;
  status: string;
  name: string;
  roles: string;
  version: string;
  externalIp: string;
  internalIp: string;
  os: string;
  cpuUsage: number;
  ramUsage: number;
  podsUsage: number;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const nodesData: NodeRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'master-control-plane-high-availability-node-01',
    roles: 'Control Plane',
    version: 'v1.34',
    externalIp: '-',
    internalIp: '172.16.0.237',
    os: 'Linux',
    cpuUsage: 8,
    ramUsage: 23,
    podsUsage: 13,
    createdAt: 'Nov 1, 2025 08:12:34',
  },
  {
    id: '2',
    status: 'OK',
    name: 'worker-node-production-cluster-az1-pool-001',
    roles: 'Worker',
    version: 'v1.34',
    externalIp: '-',
    internalIp: '172.16.0.238',
    os: 'Linux',
    cpuUsage: 45,
    ramUsage: 67,
    podsUsage: 42,
    createdAt: 'Nov 1, 2025 09:45:22',
  },
  {
    id: '3',
    status: 'True',
    name: 'worker-node-production-cluster-az1-pool-002',
    roles: 'Worker',
    version: 'v1.34',
    externalIp: '-',
    internalIp: '172.16.0.239',
    os: 'Linux',
    cpuUsage: 32,
    ramUsage: 51,
    podsUsage: 28,
    createdAt: 'Nov 1, 2025 11:23:17',
  },
  {
    id: '4',
    status: 'Raw',
    name: 'worker-node-production-cluster-az2-pool-003',
    roles: 'Worker',
    version: 'v1.34',
    externalIp: '10.0.1.100',
    internalIp: '172.16.0.240',
    os: 'Linux',
    cpuUsage: 78,
    ramUsage: 82,
    podsUsage: 65,
    createdAt: 'Nov 2, 2025 14:30:41',
  },
  {
    id: '5',
    status: 'None',
    name: 'worker-node-production-cluster-az2-pool-004',
    roles: 'Worker',
    version: 'v1.34',
    externalIp: '-',
    internalIp: '172.16.0.241',
    os: 'Linux',
    cpuUsage: 0,
    ramUsage: 0,
    podsUsage: 0,
    createdAt: 'Nov 2, 2025 16:52:08',
  },
  {
    id: '6',
    status: 'ImagePullBackOff',
    name: 'worker-node-gpu-inference-accelerator-pool-001',
    roles: 'Worker, GPU',
    version: 'v1.34',
    externalIp: '10.0.1.101',
    internalIp: '172.16.0.242',
    os: 'Linux',
    cpuUsage: 92,
    ramUsage: 88,
    podsUsage: 75,
    createdAt: 'Nov 3, 2025 10:17:55',
  },
];

/* ----------------------------------------
   Progress Cell Component
   ---------------------------------------- */

function ProgressCell({ value }: { value: number }) {
  return (
    <ProgressBar
      variant="quota"
      value={value}
      max={100}
      showValue
      size="sm"
      thresholds={STATUS_THRESHOLDS.container}
    />
  );
}

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerNodesPage() {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([
    { key: 'Name', value: 'a' },
  ]);
  const navigate = useNavigate();

  // Update tab label to match the page title (most recent breadcrumb)
  useEffect(() => {
    updateActiveTabLabel('Nodes');
  }, [updateActiveTabLabel]);

  // Shell Panel state
  const shellPanel = useShellPanel();

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

  // Pagination
  const rowsPerPage = 10;
  const totalPages = Math.ceil(nodesData.length / rowsPerPage);
  const paginatedData = nodesData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // Table columns configuration
  const columns: TableColumn<NodeRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      sortable: false,
      render: (value: string) => (
        <Tooltip content={value}>
          <Badge theme="white" size="sm" className="max-w-[80px]">
            <span className="truncate">{value}</span>
          </Badge>
        </Tooltip>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate block"
          title={value}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/container/nodes/${value}`);
          }}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'roles',
      label: 'Roles',
      flex: 1,
      minWidth: columnMinWidths.roles,
    },
    {
      key: 'version',
      label: 'Version',
      flex: 1,
      minWidth: columnMinWidths.version,
    },
    {
      key: 'ip',
      label: 'Internal IP',
      flex: 1,
      minWidth: columnMinWidths.ipAddress,
      sortable: true,
      render: (_, row) => (
        <span className="inline-flex items-center gap-1 min-w-0 w-full">
          <span className="truncate" title={row.internalIp}>
            {row.internalIp}
          </span>
          <span className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <CopyButton
              value={row.internalIp}
              size="sm"
              variant="ghost"
              iconOnly
              className="!ring-0 !ring-offset-0 !outline-none !border-transparent text-[var(--color-action-primary)]"
            />
          </span>
        </span>
      ),
    },
    {
      key: 'os',
      label: 'OS',
      flex: 1,
      minWidth: columnMinWidths.os,
      sortable: true,
    },
    {
      key: 'cpuUsage',
      label: 'CPU',
      flex: 1,
      minWidth: columnMinWidths.cpuUsage,
      sortable: true,
      render: (value: number) => <ProgressCell value={value} />,
    },
    {
      key: 'ramUsage',
      label: 'RAM',
      flex: 1,
      minWidth: columnMinWidths.ramUsage,
      sortable: true,
      render: (value: number) => <ProgressCell value={value} />,
    },
    {
      key: 'podsUsage',
      label: 'Pods',
      flex: 1,
      minWidth: columnMinWidths.podsUsage,
      sortable: true,
      render: (value: number) => <ProgressCell value={value} />,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'edit-config',
            label: 'Edit config',
            onClick: () => navigate(`/container/nodes/${row.name}/edit`),
          },
          {
            id: 'edit-yaml',
            label: 'Edit YAML',
            onClick: () => navigate(`/container/nodes/${row.name}/edit-yaml`),
          },
          {
            id: 'download-yaml',
            label: 'Download YAML',
            onClick: () => console.log('Download YAML:', row.id),
          },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => console.log('Delete:', row.id),
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click" align="right">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--action-icon-color)]"
                />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleClearFilters = () => {
    setFilters([]);
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
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'clusterName', href: '/container' }, { label: 'Nodes' }]}
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
                    shellPanel.openConsole('kubectl-nodes', 'Kubectl: ClusterName');
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
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        {/* Header */}
        <PageHeader title="Nodes" />

        {/* Toolbar */}
        <div className="flex flex-col gap-2">
          {/* Action Bar */}
          <HStack gap={2} align="center" className="w-full min-h-7">
            {/* Search */}
            <HStack gap={1} align="center">
              <SearchInput
                placeholder="Search Nodes by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
              />
              <Button
                variant="secondary"
                size="sm"
                aria-label="Download"
                className="!p-0 !w-7 !h-7 !min-w-7"
              >
                <IconDownload size={12} stroke={1.5} />
              </Button>
            </HStack>

            {/* Divider */}
            <div className="w-px h-4 bg-[var(--color-border-default)]" />

            {/* Actions */}
            <HStack gap={1} align="center">
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconDownload size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Download YAML
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconTrash size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Delete
              </Button>
            </HStack>
          </HStack>

          {/* Filter Bar */}
          {filters.length > 0 && (
            <HStack
              gap={2}
              justify="between"
              align="center"
              className="w-full pl-2 pr-4 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]"
            >
              <HStack gap={1} align="center">
                {filters.map((filter, index) => (
                  <Chip
                    key={index}
                    label={filter.key}
                    value={filter.value}
                    onRemove={() => handleRemoveFilter(index)}
                  />
                ))}
              </HStack>
              <button
                onClick={handleClearFilters}
                className="text-label-sm text-[var(--color-action-primary)] hover:underline"
              >
                Clear filters
              </button>
            </HStack>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={nodesData.length}
          selectedCount={selectedRows.length}
          showSettings
          onSettingsClick={() => {}}
        />

        {/* Table */}
        <Table<NodeRow>
          columns={columns}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
        />
      </VStack>
    </PageShell>
  );
}

export default ContainerNodesPage;
