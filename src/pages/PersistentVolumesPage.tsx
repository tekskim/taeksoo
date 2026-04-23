import { useState, useEffect, useMemo } from 'react';
import {
  VStack,
  PageShell,
  PageHeader,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Button,
  SearchInput,
  Pagination,
  ListToolbar,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
  Badge,
  Tooltip,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate } from 'react-router-dom';
import {
  IconDownload,
  IconTrash,
  IconDotsCircleHorizontal,
  IconChevronDown,
} from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface PersistentVolumeRow {
  id: string;
  status: string;
  name: string;
  reclaimPolicy: string;
  persistentVolumeClaim: string;
  source: string;
  reason: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const persistentVolumesData: PersistentVolumeRow[] = [
  {
    id: '1',
    status: 'Active',
    name: 'pvc-143076e7-d0b2-4d76-92fc-cea5cbe8b3a2',
    reclaimPolicy: 'Delete',
    persistentVolumeClaim: 'Ceph-pvc',
    source: 'rbd.csi.ceph.com',
    reason: '',
    createdAt: 'Nov 10, 2026 01:17:01',
  },
  {
    id: '2',
    status: 'Processing',
    name: 'pvc-abc12345-1234-5678-abcd-1234567890ab',
    reclaimPolicy: 'Retain',
    persistentVolumeClaim: 'data-postgres-0',
    source: 'nfs.csi.k8s.io',
    reason: '',
    createdAt: 'Nov 9, 2026 18:04:44',
  },
  {
    id: '3',
    status: 'Failed',
    name: 'pvc-a1b2c3d4-e5f6-7890-abcd-1234567890ab-data-volume',
    reclaimPolicy: 'Retain',
    persistentVolumeClaim: '',
    source: 'nfs.csi.k8s.io',
    reason: '',
    createdAt: 'Nov 8, 2026 11:51:27',
  },
  {
    id: '4',
    status: 'Released',
    name: 'pvc-f1e2d3c4-b5a6-7890-fedc-0987654321ba-logs-storage',
    reclaimPolicy: 'Delete',
    persistentVolumeClaim: '',
    source: 'rbd.csi.ceph.com',
    reason: 'Claim deleted',
    createdAt: 'Nov 7, 2026 04:38:10',
  },
  {
    id: '5',
    status: 'Active',
    name: 'pvc-redis-cluster-sentinel-persistent-data-01-volume',
    reclaimPolicy: 'Delete',
    persistentVolumeClaim: 'redis-data',
    source: 'local.csi.k8s.io',
    reason: '',
    createdAt: 'Nov 6, 2026 21:25:53',
  },
  {
    id: '6',
    status: 'Processing',
    name: 'pvc-failed-provisioning-rbd-csi-ceph-storage-volume',
    reclaimPolicy: 'Delete',
    persistentVolumeClaim: '',
    source: 'rbd.csi.ceph.com',
    reason: 'Provisioning failed',
    createdAt: 'Nov 5, 2026 14:12:36',
  },
  {
    id: '7',
    status: 'Failed',
    name: 'pvc-pending-nfs-provisioning-waiting-for-node-volume',
    reclaimPolicy: 'Retain',
    persistentVolumeClaim: 'pending-claim',
    source: 'nfs.csi.k8s.io',
    reason: 'Waiting for node',
    createdAt: 'Nov 10, 2026 01:17:01',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function PersistentVolumesPage() {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([
    { key: 'Name', value: 'a' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  const navigate = useNavigate();

  // Update tab label to match the page title (most recent breadcrumb)
  useEffect(() => {
    updateActiveTabLabel('Persistent volumes');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return persistentVolumesData;
    const q = searchTerm.toLowerCase();
    return persistentVolumesData.filter(
      (item) =>
        item.status.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.reclaimPolicy.toLowerCase().includes(q) ||
        item.persistentVolumeClaim.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q)
    );
  }, [searchTerm]);

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
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // Create menu items for each row
  const createMenuItems = (row: PersistentVolumeRow): ContextMenuItem[] => [
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/persistent-volumes/${row.id}/edit-yaml`),
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
  const columns: TableColumn<PersistentVolumeRow>[] = [
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
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate"
          title={value}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/container/persistent-volumes/${row.id}`);
          }}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'reclaimPolicy',
      label: 'Reclaim Policy',
      flex: 1,
      sortable: true,
    },
    {
      key: 'persistentVolumeClaim',
      label: 'Persistent volume claim',
      flex: 1,
      minWidth: columnMinWidths.persistentVolumeClaim,
      sortable: true,
      render: (value: string) =>
        value ? (
          <span
            className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate"
            title={value}
          >
            {value}
          </span>
        ) : (
          <span className="text-[var(--color-text-subtle)]">-</span>
        ),
    },
    {
      key: 'source',
      label: 'Source',
      flex: 1,
    },
    {
      key: 'reason',
      label: 'Reason',
      flex: 1,
      minWidth: columnMinWidths.reason,
      sortable: true,
      render: (value: string) =>
        value ? (
          <span className="min-w-0 truncate block" title={value}>
            {value}
          </span>
        ) : (
          <span className="text-[var(--color-text-subtle)]">-</span>
        ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => {
        const display = value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '') ?? '';
        return (
          <span className="min-w-0 truncate block" title={value ?? ''}>
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
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={createMenuItems(row)} trigger="click" align="right">
            <button
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

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleClearFilters = () => {
    setFilters([]);
  };

  // Create menu items
  const createDropdownItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create as form',
      onClick: () => navigate('/container/persistent-volumes/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/persistent-volumes/create-yaml'),
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
          breadcrumb={<Breadcrumb items={[{ label: 'Persistent Volumes' }]} />}
          actions={
            <ContainerTopBarActions
              onTerminalClick={() => {
                if (shellPanel.isExpanded) {
                  shellPanel.setIsExpanded(false);
                } else {
                  shellPanel.openConsole('kubectl-pv', 'Kubectl: ClusterName');
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
          title="Persistent volumes"
          actions={
            <ContextMenu items={createDropdownItems} trigger="click" align="right">
              <Button
                variant="primary"
                size="md"
                rightIcon={<IconChevronDown size={14} stroke={1.5} />}
              >
                Create persistent volume
              </Button>
            </ContextMenu>
          }
        />

        {/* List Toolbar */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <SearchInput
                placeholder="Search Persistent Volumes by attributes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm('')}
                size="sm"
                className="w-[var(--search-input-width)]"
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
            </ListToolbar.Actions>
          }
          filters={filters.map((filter, index) => ({
            id: String(index),
            field: filter.key,
            value: filter.value,
          }))}
          onFilterRemove={(id) => handleRemoveFilter(Number(id))}
          onFiltersClear={handleClearFilters}
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
        <Table<PersistentVolumeRow>
          columns={columns}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          loading={loading}
          emptyMessage="No persistent volumes found"
        />
      </VStack>
    </PageShell>
  );
}

export default PersistentVolumesPage;
