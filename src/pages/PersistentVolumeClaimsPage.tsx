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
  Chip,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
  columnWidths,
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

interface PersistentVolumeClaimRow {
  id: string;
  status: 'Bound' | 'Pending' | 'Lost';
  name: string;
  namespace: string;
  volume: string;
  capacity: string;
  accessModes: string;
  storageClass: string;
  volumeAttributesClass: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const persistentVolumeClaimsData: PersistentVolumeClaimRow[] = [
  {
    id: '1',
    status: 'Bound',
    name: 'cert-manager',
    namespace: 'default',
    volume: 'pvc-143076e7-d0b2-4d76-92fc-cea5cbe8b3a2',
    capacity: '10Gi',
    accessModes: 'RWO',
    storageClass: 'Ceph',
    volumeAttributesClass: '1',
    createdAt: '2025-11-10 12:57',
  },
  {
    id: '2',
    status: 'Bound',
    name: 'data-postgres-0',
    namespace: 'database',
    volume: 'pvc-abc12345-1234-5678-abcd-1234567890ab',
    capacity: '50Gi',
    accessModes: 'RWO',
    storageClass: 'Ceph',
    volumeAttributesClass: '1',
    createdAt: '2025-11-09 14:30',
  },
  {
    id: '3',
    status: 'Bound',
    name: 'redis-data',
    namespace: 'cache',
    volume: 'pvc-redis-data-001',
    capacity: '5Gi',
    accessModes: 'RWO',
    storageClass: 'local',
    volumeAttributesClass: '1',
    createdAt: '2025-11-08 09:15',
  },
  {
    id: '4',
    status: 'Pending',
    name: 'pending-claim',
    namespace: 'default',
    volume: '',
    capacity: '20Gi',
    accessModes: 'RWX',
    storageClass: 'nfs',
    volumeAttributesClass: '',
    createdAt: '2025-11-10 08:00',
  },
  {
    id: '5',
    status: 'Bound',
    name: 'elasticsearch-data-0',
    namespace: 'logging',
    volume: 'pvc-elastic-001',
    capacity: '100Gi',
    accessModes: 'RWO',
    storageClass: 'Ceph',
    volumeAttributesClass: '2',
    createdAt: '2025-11-07 16:45',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function PersistentVolumeClaimsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, addTab, updateActiveTabLabel } = useTabs();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([
    { key: 'Name', value: 'a' }
  ]);
  const navigate = useNavigate();

  // Update tab label to match the page title (most recent breadcrumb)
  useEffect(() => {
    updateActiveTabLabel('Persistent Volume Claims');
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
  const totalPages = Math.ceil(persistentVolumeClaimsData.length / rowsPerPage);
  const paginatedData = persistentVolumeClaimsData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Create menu items for each row
  const createMenuItems = (row: PersistentVolumeClaimRow): ContextMenuItem[] => [
    {
      id: 'edit-config',
      label: 'Edit Config',
      onClick: () => navigate(`/container/pvc/${row.id}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/pvc/${row.id}/edit-yaml`),
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
  const columns: TableColumn<PersistentVolumeClaimRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: columnWidths.status,
      sortable: true,
      align: 'center',
      render: (value: string) => (
        <StatusIndicator
          status={
            value === 'Bound' ? 'active' :
            value === 'Pending' ? 'pending' :
            value === 'Lost' ? 'error' : 
            'pending'
          }
        />
      )
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: '120px',
      sortable: true,
      render: (value: string, row) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate"
          title={value}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/container/pvc/${row.id}`);
          }}
        >
          {value}
        </span>
      )
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: '80px',
      sortable: true,
    },
    {
      key: 'volume',
      label: 'Volume',
      flex: 1.5,
      sortable: true,
      render: (value: string) => (
        value ? (
          <span className="truncate" title={value}>{value}</span>
        ) : (
          <span className="text-[var(--color-text-subtle)]">-</span>
        )
      )
    },
    {
      key: 'capacity',
      label: 'Capacity',
      width: columnWidths.capacity,
    },
    {
      key: 'accessModes',
      label: 'Access Modes',
      width: columnWidths.accessModes,
    },
    {
      key: 'storageClass',
      label: 'Storage Class',
      flex: 1,
      minWidth: '100px',
    },
    {
      key: 'volumeAttributesClass',
      label: 'VolumeAttributesClass',
      flex: 1,
      minWidth: '120px',
      sortable: true,
      render: (value: string) => (
        value ? value : <span className="text-[var(--color-text-subtle)]">-</span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created At',
      width: columnWidths.createdAt,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: columnWidths.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={createMenuItems(row)} trigger="click" align="left">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
              <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
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
      onClick: () => navigate('/container/pvc/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/pvc/create-yaml'),
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
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Persistent Volume Claims' },
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
                    shellPanel.openConsole('kubectl-pvc', 'Kubectl: ClusterName');
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
          style={{ paddingBottom: shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0' }}
        >
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full min-h-8">
                <HStack gap={2} align="center">
                  <h1 className="text-[16px] leading-6 font-semibold text-[var(--color-text-default)]">
                    Persistent Volume Claims
                  </h1>
                </HStack>
                
                {/* Create Button with Dropdown */}
                <ContextMenu items={createDropdownItems} trigger="click" align="right">
                  <Button variant="primary" size="md" rightIcon={<IconChevronDown size={14} stroke={1.5} />}>
                    Create Persistent Volume Claim
                  </Button>
                </ContextMenu>
              </HStack>

              {/* Action Bar */}
              <HStack gap={2} align="center" className="w-full min-h-7">
                {/* Search */}
                <HStack gap={1} align="center">
                  <SearchInput
                    placeholder="Search PVCs by attributes"
                    size="sm"
                    className="w-[var(--search-input-width)]"
                  />
                  <Button variant="secondary" size="sm" aria-label="Download" className="!p-0 !w-7 !h-7 !min-w-7">
                    <IconDownload size={14} stroke={1.5} />
                  </Button>
                </HStack>

                {/* Divider */}
                <div className="w-px h-4 bg-[var(--color-border-default)]" />

                {/* Actions */}
                <HStack gap={1} align="center">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    leftIcon={<IconDownload size={12} stroke={1.5} />} 
                    disabled={selectedRows.length === 0}
                  >
                    Download YAML
                  </Button>
                  <Button 
                    variant="secondary" 
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
                <HStack justify="between" align="center" className="w-full pl-2 pr-4 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
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
                    className="text-[11px] font-medium text-[var(--color-action-primary)] hover:underline"
                  >
                    Clear Filters
                  </button>
                </HStack>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={persistentVolumeClaimsData.length}
                selectedCount={selectedRows.length}
                showSettings
                onSettingsClick={() => {}}
              />

              {/* Table */}
              <Table<PersistentVolumeClaimRow>
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

export default PersistentVolumeClaimsPage;
