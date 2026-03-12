import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  PageShell,
  PageHeader,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Button,
  SearchInput,
  Pagination,
  Chip,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
  Badge,
  Tooltip,
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

interface Cluster {
  id: string;
  name: string;
  status: string;
  kubernetesVersion: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockClusters: Cluster[] = [
  {
    id: 'cluster-001',
    name: 'production-kubernetes-high-availability-cluster',
    status: 'OK',
    kubernetesVersion: 'v1.34',
    createdAt: 'Nov 11, 2025 08:30:18',
  },
  {
    id: 'cluster-002',
    name: 'staging-development-testing-environment-cluster',
    status: 'OK',
    kubernetesVersion: 'v1.33.4',
    createdAt: 'Oct 6, 2025 21:25:53',
  },
  {
    id: 'cluster-003',
    name: 'production-microservices-platform-cluster',
    status: 'True',
    kubernetesVersion: 'v1.32.2',
    createdAt: 'Sep 15, 2025 12:22:26',
  },
  {
    id: 'cluster-004',
    name: 'staging-integration-testing-environment-cluster',
    status: 'None',
    kubernetesVersion: 'v1.33.1',
    createdAt: 'Aug 20, 2025 23:27:51',
  },
  {
    id: 'cluster-005',
    name: 'development-sandbox-experimental-cluster',
    status: 'ImagePullBackOff',
    kubernetesVersion: 'v1.31.0',
    createdAt: 'Jul 10, 2025 01:17:01',
  },
];

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
      width: fixedColumns.statusLabel,
      sortable: false,
      render: (status) => (
        <Tooltip content={status}>
          <Badge theme="white" size="sm" className="max-w-[80px]">
            <span className="truncate">{status}</span>
          </Badge>
        </Tooltip>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 2,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value, row) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate"
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
      label: 'Kubernetes version',
      flex: 1,
      minWidth: columnMinWidths.version,
      sortable: true,
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

  // Create menu items
  const createMenuItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create as form',
      onClick: () => navigate('/container/cluster-management/create'),
    },
  ];

  return (
    <PageShell
      sidebar={
        <ClusterManagementSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
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
              items={[
                { label: 'Cluster management', href: '/container/cluster-management' },
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
    >
      <VStack gap={3}>
        {/* Header */}
        <PageHeader
          title="Clusters"
          actions={
            <ContextMenu items={createMenuItems} trigger="click" align="right">
              <Button
                variant="primary"
                size="md"
                rightIcon={<IconChevronDown size={14} stroke={1.5} />}
              >
                Create cluster
              </Button>
            </ContextMenu>
          }
        />

        {/* Toolbar */}
        <div className="flex flex-col gap-2">
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
                disabled={selectedClusters.length === 0}
              >
                Download KubeConfig
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconDownload size={12} stroke={1.5} />}
                disabled={selectedClusters.length === 0}
              >
                Download YAML
              </Button>
              <Button
                variant="muted"
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
                className="text-[11px] text-label-md text-[var(--color-action-primary)] hover:underline"
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
    </PageShell>
  );
}

export default ClusterManagementPage;
