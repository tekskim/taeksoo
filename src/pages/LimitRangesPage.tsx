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
  PageShell,
  PageHeader,
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
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface LimitRangeRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const limitRangesData: LimitRangeRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'limitrangeName',
    namespace: 'namespaceName',
    createdAt: 'Nov 10, 2025 09:23:41',
  },
  {
    id: '2',
    status: 'True',
    name: 'cpu-memory-limits',
    namespace: 'default',
    createdAt: 'Nov 9, 2025 14:07:22',
  },
  {
    id: '3',
    status: 'None',
    name: 'storage-limits',
    namespace: 'kube-system',
    createdAt: 'Nov 8, 2025 11:45:33',
  },
  {
    id: '4',
    status: 'CreateContainerConfigError',
    name: 'container-limits',
    namespace: 'production',
    createdAt: 'Nov 7, 2025 16:52:08',
  },
  {
    id: '5',
    status: 'ImagePullBackOff',
    name: 'pod-limits',
    namespace: 'monitoring',
    createdAt: 'Nov 6, 2025 08:30:15',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function LimitRangesPage() {
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
    updateActiveTabLabel('Limit ranges');
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
  const totalPages = Math.ceil(limitRangesData.length / rowsPerPage);
  const paginatedData = limitRangesData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // Create menu items for each row
  const createMenuItems = (row: LimitRangeRow): ContextMenuItem[] => {
    return [
      {
        id: 'edit-config',
        label: 'Edit config',
        onClick: () => navigate(`/container/limit-ranges/${row.id}/edit`),
      },
      {
        id: 'edit-yaml',
        label: 'Edit YAML',
        onClick: () => navigate(`/container/limit-ranges/${row.id}/edit-yaml`),
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
  };

  // Table columns configuration
  const columns: TableColumn<LimitRangeRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
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
        <span className="text-body-md text-[var(--color-text-default)] truncate" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: columnMinWidths.namespace,
      sortable: true,
      render: (value: string) => (
        <span className="text-body-md text-[var(--color-text-default)] truncate" title={value}>
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
        const display = value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '') ?? '';
        return (
          <span className="text-body-md text-[var(--color-text-default)] truncate" title={display}>
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
      label: 'Create as form',
      onClick: () => navigate('/container/limit-ranges/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/limit-ranges/create-yaml'),
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
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'clusterName', href: '/container' }, { label: 'Limit ranges' }]}
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
                    shellPanel.openConsole('kubectl-lr', 'Kubectl: ClusterName');
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
    >
      <VStack gap={3}>
        {/* Header */}
        <PageHeader
          title="Limit ranges"
          actions={
            <ContextMenu items={createDropdownItems} trigger="click" align="right">
              <Button
                variant="primary"
                size="md"
                rightIcon={<IconChevronDown size={14} stroke={1.5} />}
              >
                Create limit range
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
                placeholder="Search limit range by attributes"
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
          totalItems={limitRangesData.length}
          selectedCount={selectedRows.length}
          showSettings
          onSettingsClick={() => {}}
        />

        {/* Table */}
        <Table<LimitRangeRow>
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

export default LimitRangesPage;
