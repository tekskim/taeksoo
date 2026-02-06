import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Button,
  StatusIndicator,
  SearchInput,
  Pagination,
  ListToolbar,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
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
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface PersistentVolumeRow {
  id: string;
  status: 'Bound' | 'Available' | 'Released' | 'Failed' | 'Pending';
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
    status: 'Bound',
    name: 'pvc-143076e7-d0b2-4d76-92fc-cea5cbe8b3a2',
    reclaimPolicy: 'Delete',
    persistentVolumeClaim: 'Ceph-pvc',
    source: 'rbd.csi.ceph.com',
    reason: '',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '2',
    status: 'Bound',
    name: 'pvc-abc12345-1234-5678-abcd-1234567890ab',
    reclaimPolicy: 'Retain',
    persistentVolumeClaim: 'data-postgres-0',
    source: 'nfs.csi.k8s.io',
    reason: '',
    createdAt: 'Nov 9, 2025',
  },
  {
    id: '3',
    status: 'Available',
    name: 'pv-nfs-storage-01',
    reclaimPolicy: 'Retain',
    persistentVolumeClaim: '',
    source: 'nfs.csi.k8s.io',
    reason: '',
    createdAt: 'Nov 8, 2025',
  },
  {
    id: '4',
    status: 'Released',
    name: 'pvc-old-volume-xyz789',
    reclaimPolicy: 'Delete',
    persistentVolumeClaim: '',
    source: 'rbd.csi.ceph.com',
    reason: 'Claim deleted',
    createdAt: 'Nov 7, 2025',
  },
  {
    id: '5',
    status: 'Bound',
    name: 'pvc-redis-data-001',
    reclaimPolicy: 'Delete',
    persistentVolumeClaim: 'redis-data',
    source: 'local.csi.k8s.io',
    reason: '',
    createdAt: 'Nov 6, 2025',
  },
  {
    id: '6',
    status: 'Failed',
    name: 'pv-failed-provision',
    reclaimPolicy: 'Delete',
    persistentVolumeClaim: '',
    source: 'rbd.csi.ceph.com',
    reason: 'Provisioning failed',
    createdAt: 'Nov 5, 2025',
  },
  {
    id: '7',
    status: 'Pending',
    name: 'pvc-pending-volume',
    reclaimPolicy: 'Retain',
    persistentVolumeClaim: 'pending-claim',
    source: 'nfs.csi.k8s.io',
    reason: 'Waiting for node',
    createdAt: 'Nov 10, 2025',
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
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([
    { key: 'Name', value: 'a' },
  ]);
  const navigate = useNavigate();

  // Update tab label to match the page title (most recent breadcrumb)
  useEffect(() => {
    updateActiveTabLabel('Persistent Volumes');
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
  const totalPages = Math.ceil(persistentVolumesData.length / rowsPerPage);
  const paginatedData = persistentVolumesData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Create menu items for each row
  const createMenuItems = (row: PersistentVolumeRow): ContextMenuItem[] => [
    {
      id: 'edit-config',
      label: 'Edit config',
      onClick: () => navigate(`/container/persistent-volumes/${row.id}/edit`),
    },
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
      width: fixedColumns.status,
      sortable: true,
      align: 'center',
      render: (value: string) => (
        <StatusIndicator
          status={
            value === 'Bound'
              ? 'active'
              : value === 'Available'
                ? 'active'
                : value === 'Failed'
                  ? 'error'
                  : 'building'
          }
        />
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
      sortable: true,
      render: (value: string) =>
        value ? <span>{value}</span> : <span className="text-[var(--color-text-subtle)]">-</span>,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={createMenuItems(row)} trigger="click" align="right">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
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
      label: 'Create as Form',
      onClick: () => navigate('/container/persistent-volumes/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/persistent-volumes/create-yaml'),
    },
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
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Persistent Volumes' },
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
                    shellPanel.openConsole('kubectl-pv', 'Kubectl: ClusterName');
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

        {/* Content Area */}
        <div
          className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll"
          style={{ paddingBottom: shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0' }}
        >
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full min-h-8">
                <HStack gap={2} align="center">
                  <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                    Persistent Volumes
                  </h1>
                </HStack>

                {/* Create Button with Dropdown */}
                <ContextMenu items={createDropdownItems} trigger="click" align="right">
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<IconChevronDown size={14} stroke={1.5} />}
                  >
                    Create Persistent Volume
                  </Button>
                </ContextMenu>
              </HStack>

              {/* Action Bar */}
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <SearchInput
                      placeholder="Search Persistent Volumes by attributes"
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
                totalItems={persistentVolumesData.length}
                selectedCount={selectedRows.length}
                showSettings
                onSettingsClick={() => {}}
              />

              {/* Table */}
              <Table<PersistentVolumeRow>
                columns={columns}
                data={paginatedData}
                rowKey="id"
                selectable
                selectedKeys={selectedRows}
                onSelectionChange={setSelectedRows}
              />
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

export default PersistentVolumesPage;
