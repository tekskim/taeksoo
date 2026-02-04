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
  type StatusType,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { ClusterManagementSidebar } from '@/components/ClusterManagementSidebar';
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

type ClusterStatus = 'active' | 'building' | 'error' | 'deleting';

interface Cluster {
  id: string;
  name: string;
  status: ClusterStatus;
  kubernetesVersion: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockClusters: Cluster[] = [
  {
    id: 'cluster-001',
    name: 'Cluster1',
    status: 'building',
    kubernetesVersion: 'v1.34',
    createdAt: '2025-11-11 13:00',
  },
  {
    id: 'cluster-002',
    name: 'ClusterName',
    status: 'active',
    kubernetesVersion: 'v1.33.4',
    createdAt: '2025-10-06 12:51',
  },
  {
    id: 'cluster-003',
    name: 'production-cluster',
    status: 'active',
    kubernetesVersion: 'v1.32.2',
    createdAt: '2025-09-15 09:30',
  },
  {
    id: 'cluster-004',
    name: 'staging-cluster',
    status: 'active',
    kubernetesVersion: 'v1.33.1',
    createdAt: '2025-08-20 14:45',
  },
  {
    id: 'cluster-005',
    name: 'dev-cluster',
    status: 'error',
    kubernetesVersion: 'v1.31.0',
    createdAt: '2025-07-10 11:20',
  },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const statusMap: Record<ClusterStatus, StatusType> = {
  active: 'active',
  building: 'building',
  error: 'error',
  deleting: 'deleting',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ClusterManagementPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([]);

  // Update tab label to match the page title
  useEffect(() => {
    updateActiveTabLabel('Clusters');
  }, [updateActiveTabLabel]);

  // Pagination
  const rowsPerPage = 10;
  const totalPages = Math.ceil(mockClusters.length / rowsPerPage);
  const paginatedClusters = mockClusters.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Table columns
  const columns: TableColumn<Cluster>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      sortable: true,
      align: 'center',
      render: (status) => (
        <StatusIndicator status={statusMap[status as ClusterStatus]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value, row) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline line-clamp-2"
          title={value as string}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/container/cluster-management/${row.id}`);
          }}
        >
          {value as string}
        </span>
      ),
    },
    {
      key: 'kubernetesVersion',
      label: 'Kubernetes Version',
      flex: 1,
      minWidth: columnMinWidths.version,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'kubectl-shell',
            label: 'Kubectl Shell',
            onClick: () => console.log('Kubectl Shell for', row.name),
          },
          {
            id: 'download-kubeconfig',
            label: 'Download KubeConfig',
            onClick: () => console.log('Download KubeConfig for', row.name),
          },
          {
            id: 'copy-kubeconfig',
            label: 'Copy KubeConfig to Clipboard',
            onClick: () => console.log('Copy KubeConfig for', row.name),
          },
          {
            id: 'delete',
            label: 'Delete',
            onClick: () => console.log('Delete', row.name),
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click">
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

  // Create menu items
  const createMenuItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create as Form',
      onClick: () => navigate('/container/cluster-management/create'),
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <ClusterManagementSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

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
                { label: 'Cluster Management', href: '/container/cluster-management' },
                { label: 'Clusters' },
              ]}
            />
          }
          actions={
            <>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconTerminal2 size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
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
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full min-h-8">
                <HStack gap={2} align="center">
                  <h1 className="text-[16px] leading-6 font-semibold text-[var(--color-text-default)]">
                    Clusters
                  </h1>
                </HStack>

                {/* Create Cluster Button with Dropdown */}
                <ContextMenu items={createMenuItems} trigger="click" align="right">
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<IconChevronDown size={14} stroke={1.5} />}
                  >
                    Create Cluster
                  </Button>
                </ContextMenu>
              </HStack>

              {/* Action Bar */}
              <HStack gap={2} align="center" className="w-full min-h-7">
                {/* Search */}
                <HStack gap={1} align="center">
                  <SearchInput
                    placeholder="Search clusters with attributes"
                    size="sm"
                    className="w-[var(--search-input-width)]"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    aria-label="Download"
                    className="!p-0 !w-7 !h-7 !min-w-7"
                  >
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
                    disabled={selectedClusters.length === 0}
                  >
                    Download KubeConfig
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconDownload size={12} stroke={1.5} />}
                    disabled={selectedClusters.length === 0}
                  >
                    Download YAML
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconTrash size={12} stroke={1.5} />}
                    disabled={selectedClusters.length === 0}
                  >
                    Delete
                  </Button>
                </HStack>
              </HStack>

              {/* Filter Bar */}
              {filters.length > 0 && (
                <HStack
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
                totalItems={mockClusters.length}
                selectedCount={selectedClusters.length}
                showSettings
                onSettingsClick={() => {}}
              />

              {/* Table */}
              <Table<Cluster>
                columns={columns}
                data={paginatedClusters}
                rowKey="id"
                selectable
                selectedKeys={selectedClusters}
                onSelectionChange={setSelectedClusters}
              />
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ClusterManagementPage;
