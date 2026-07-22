import { useState, useEffect, useMemo } from 'react';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Button,
  FilterSearchInput,
  Pagination,
  ListToolbar,
  ContextMenu,
  PageShell,
  PageHeader,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
  type FilterItem,
  fixedColumns,
  columnMinWidths,
  Badge,
  Tooltip,
  ConfirmModal,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  IconDownload,
  IconTrash,
  IconDotsCircleHorizontal,
  IconChevronDown,
} from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';
import { managedByColumn, type WorkloadManagedBy } from './containerManagedBy';
import { useContainerMode } from '@/contexts/ContainerModeContext';
import { getActiveCpCluster } from './containerActiveCluster';

/* ----------------------------------------
   Types ---------------------------------------- */

interface PodRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  managedBy?: WorkloadManagedBy;
  image: string;
  ready: string;
  restarts: number;
  ip: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data ---------------------------------------- */

// 전용(등록형) 클러스터의 파드(D-26·D-27): 상위 제품이 만든 워크로드(managed-by 배지)와
// Metis/Maxis Agent 스택(tkai-* 네임스페이스, 배지 없음)만 존재한다.
const dedicatedPods: PodRow[] = [
  {
    id: 'cp-1',
    status: 'Running',
    name: 'devspace-taeksoo-workbench-0',
    namespace: 'ml-dev',
    managedBy: 'Maxis',
    image: 'maxis/devspace-base:24.06',
    ready: '1/1',
    restarts: 0,
    ip: '10.76.3.21',
    createdAt: 'Nov 10, 2026 09:12:40',
  },
  {
    id: 'cp-2',
    status: 'Running',
    name: 'llama3-70b-vllm-serving-6c9d8f-q4wz1',
    namespace: 'ml-serving',
    managedBy: 'Metis',
    image: 'vllm/vllm-openai:v0.5.4',
    ready: '1/1',
    restarts: 0,
    ip: '10.76.3.35',
    createdAt: 'Nov 9, 2026 22:47:03',
  },
  {
    id: 'cp-3',
    status: 'Running',
    name: 'kube-agent-7d5b9c6f4-h2s8k',
    namespace: 'tkai-system',
    image: 'thaki/kube-agent:1.4.2',
    ready: '1/1',
    restarts: 0,
    ip: '10.76.9.2',
    createdAt: 'Nov 8, 2026 08:00:11',
  },
  {
    id: 'cp-4',
    status: 'Running',
    name: 'keda-operator-59f8d7c6b-m3x7p',
    namespace: 'tkai-keda',
    image: 'kedacore/keda:2.14.0',
    ready: '1/1',
    restarts: 0,
    ip: '10.76.9.14',
    createdAt: 'Nov 8, 2026 08:01:27',
  },
  {
    id: 'cp-5',
    status: 'Running',
    name: 'kai-kueue-controller-6b8c5d9e2-r9t4v',
    namespace: 'tkai-kueue',
    image: 'thaki/kai-kueue:0.9.1',
    ready: '1/1',
    restarts: 0,
    ip: '10.76.9.20',
    createdAt: 'Nov 8, 2026 08:02:05',
  },
];

const podsData: PodRow[] = [
  {
    id: '1',
    status: 'Running',
    name: 'frontend-web-application-deployment-7fb96c846b-x2vnl',
    namespace: 'default',
    image: 'nginx:1.25',
    ready: '1/1',
    restarts: 1,
    ip: '10.76.0.1',
    createdAt: 'Nov 10, 2026 01:17:01',
  },
  {
    id: '2',
    status: 'Running',
    name: 'backend-api-gateway-service-5d4f8b7c9a-k8m2n',
    namespace: 'default',
    image: 'nginx:1.27',
    ready: '1/1',
    restarts: 0,
    ip: '10.76.0.12',
    createdAt: 'Nov 9, 2026 18:04:44',
  },
  {
    id: '3',
    status: 'Failed',
    name: 'monitoring-prometheus-alertmanager-statefulset-0',
    namespace: 'production',
    image: 'backend-api:v2.1.0',
    ready: '0/1',
    restarts: 0,
    ip: '-',
    createdAt: 'Nov 10, 2026 01:17:01',
  },
  {
    id: '4',
    status: 'Processing',
    name: 'ingress-nginx-controller-admission-create-28t5q',
    namespace: 'analytics',
    image: 'data-processor:v1.5',
    ready: '0/1',
    restarts: 5,
    ip: '10.76.0.45',
    createdAt: 'Nov 10, 2026 01:17:01',
  },
  {
    id: '5',
    status: 'Running',
    name: 'kube-system-coredns-autoscaler-7f89d5c6b4-2pv8r',
    namespace: 'cache',
    image: 'redis:7.2',
    ready: '1/1',
    restarts: 0,
    ip: '10.76.0.23',
    createdAt: 'Nov 8, 2026 11:51:27',
  },
  {
    id: '6',
    status: 'Succeeded',
    name: 'postgresql-primary-replication-statefulset-0',
    namespace: 'database',
    image: 'postgres:15',
    ready: '1/1',
    restarts: 1,
    ip: '10.76.0.34',
    createdAt: 'Nov 7, 2026 04:38:10',
  },
  {
    id: '7',
    status: 'Running',
    name: 'database-migration-schema-update-v2-job-20260115',
    namespace: 'database',
    image: 'migration:v1.0',
    ready: '0/1',
    restarts: 0,
    ip: '10.76.0.56',
    createdAt: 'Nov 6, 2026 21:25:53',
  },
  {
    id: '8',
    status: 'Running',
    name: 'monitoring-node-exporter-prometheus-daemonset-node1',
    namespace: 'monitoring',
    image: 'prometheus-agent:v2.45',
    ready: '1/1',
    restarts: 2,
    ip: '10.76.0.67',
    createdAt: 'Nov 5, 2026 14:12:36',
  },
];

const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'namespace', label: 'Namespace', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'Running', label: 'Running' },
      { value: 'Failed', label: 'Failed' },
      { value: 'Processing', label: 'Processing' },
      { value: 'Succeeded', label: 'Succeeded' },
    ],
  },
  { id: 'image', label: 'Image', type: 'text' },
  { id: 'ready', label: 'Ready', type: 'text' },
  { id: 'restarts', label: 'Restarts', type: 'text' },
  { id: 'ip', label: 'IP', type: 'text' },
  { id: 'createdAt', label: 'Created at', type: 'text' },
];

/* ----------------------------------------
   Component ---------------------------------------- */

export function PodsPage() {
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
  const { isPlatform } = useContainerMode();
  // 전용(등록형) 클러스터: 생성 차단, 조회+운영 조치만 (D-28)
  const dedicated = isPlatform && getActiveCpCluster().dedicated;
  const initialPods = dedicated ? dedicatedPods : podsData;
  const [data, setData] = useState(initialPods);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  const navigate = useNavigate();

  // Update tab label to match the page title (most recent breadcrumb)
  useEffect(() => {
    updateActiveTabLabel('Pods');
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

  // Handle Execute Shell
  const handleExecuteShell = (podName: string) => {
    shellPanel.openConsole(podName, `Shell: ${podName}`);
  };

  // Handle View Logs
  const handleViewLogs = (podName: string) => {
    shellPanel.openConsole(podName, `Logs: ${podName}`);
  };

  const removeFilter = (filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  const clearAllFilters = () => {
    setAppliedFilters([]);
  };

  const toolbarFilters: FilterItem[] = appliedFilters.map((f) => ({
    id: f.id,
    field: f.fieldLabel,
    value: f.valueLabel || f.value,
  }));

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return appliedFilters.every((filter) => {
        const raw = item[filter.fieldId as keyof PodRow];
        const value = String(typeof raw === 'number' ? raw : (raw ?? '')).toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [data, appliedFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  // Pagination
  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // Create menu items for each row
  const createMenuItems = (row: PodRow): ContextMenuItem[] => [
    {
      id: 'execute-shell',
      label: 'Execute shell',
      onClick: () => handleExecuteShell(row.name),
    },
    {
      id: 'view-logs',
      label: 'View logs',
      onClick: () => handleViewLogs(row.name),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/pods/${row.id}/edit-yaml`),
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

  // Table columns configuration
  const columns: TableColumn<PodRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      sortable: false,
      render: (value: string) => (
        <Tooltip content={value}>
          <Badge
            theme={getContainerStatusTheme(value)}
            type="subtle"
            size="sm"
            className="max-w-[80px]"
          >
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
      render: (value: string, row) => (
        <Link
          to={`/container/pods/${row.id}`}
          className="text-[var(--color-action-primary)] font-medium hover:underline truncate block min-w-0"
          title={value}
          onClick={(e) => e.stopPropagation()}
        >
          {value}
        </Link>
      ),
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: columnMinWidths.namespace,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    // Container Platform 전용(D-26): 담당 제품 표시
    ...(isPlatform ? [managedByColumn<PodRow>()] : []),
    {
      key: 'image',
      label: 'Image',
      flex: 1,
      minWidth: columnMinWidths.image,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'ready',
      label: 'Ready',
      flex: 1,
      minWidth: columnMinWidths.ready,
      sortable: true,
    },
    {
      key: 'restarts',
      label: 'Restarts',
      flex: 1,
      minWidth: columnMinWidths.restarts,
      sortable: true,
    },
    {
      key: 'ip',
      label: 'IP',
      flex: 1,
      minWidth: columnMinWidths.ip,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => {
        const display = value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
        return (
          <span className="truncate block min-w-0" title={value}>
            {display}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_, row) => (
        <div className="min-w-0" onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={createMenuItems(row)} trigger="click" align="right">
            <button
              type="button"
              aria-label="Row actions"
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--action-icon-color)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  const handleBulkDeleteConfirm = () => {
    setData((prev) => prev.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
    setIsBulkDeleteOpen(false);
  };

  // Create menu items
  const createDropdownItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create as form',
      onClick: () => navigate('/container/pods/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/pods/create-yaml'),
    },
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
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'Pods' }]} />}
          actions={
            <ContainerTopBarActions
              onTerminalClick={() => {
                if (shellPanel.isExpanded) {
                  shellPanel.setIsExpanded(false);
                } else {
                  shellPanel.openConsole('kubectl-pods', 'Kubectl: ClusterName');
                }
              }}
              isTerminalActive={shellPanel.isExpanded}
            />
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
        <PageHeader
          title="Pods"
          actions={
            dedicated ? undefined : (
              <ContextMenu items={createDropdownItems} trigger="click" align="right">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<IconChevronDown size={14} stroke={1.5} />}
                >
                  Create pod
                </Button>
              </ContextMenu>
            )
          }
        />

        {/* List Toolbar */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={filterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={setAppliedFilters}
                placeholder="Search pods by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
                hideAppliedFilters
              />
              <Button
                variant="secondary"
                size="sm"
                icon={<IconDownload size={12} stroke={1.5} />}
                aria-label="Download"
              />
            </ListToolbar.Actions>
          }
          bulkActions={
            <ListToolbar.Actions>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconDownload size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
                onClick={() => console.log('Download YAML:', selectedRows)}
              >
                Download YAML
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconTrash size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
                onClick={() => setIsBulkDeleteOpen(true)}
              >
                Delete
              </Button>
            </ListToolbar.Actions>
          }
          filters={toolbarFilters}
          onFilterRemove={removeFilter}
          onFiltersClear={clearAllFilters}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          selectedCount={selectedRows.length}
        />

        {/* Table */}
        <Table<PodRow>
          columns={columns}
          loading={loading}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          emptyMessage="No pods found"
        />
      </VStack>

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete selected pods"
        description="This action is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={`${selectedRows.length} pod(s)`}
      />
    </PageShell>
  );
}

export default PodsPage;
