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
  IconRefresh,
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface DaemonSetRow {
  id: string;
  status: 'Running' | 'Pending' | 'Failed' | 'Paused';
  name: string;
  namespace: string;
  image: string;
  ready: number;
  current: number;
  desired: number;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const daemonSetsData: DaemonSetRow[] = [
  {
    id: '1',
    status: 'Running',
    name: 'daemonset1',
    namespace: 'default',
    image: 'nginx',
    ready: 1,
    current: 1,
    desired: 1,
    createdAt: '2025-11-10 12:57',
  },
  {
    id: '2',
    status: 'Running',
    name: 'fluentd-logging',
    namespace: 'kube-system',
    image: 'fluentd:v1.16',
    ready: 3,
    current: 3,
    desired: 3,
    createdAt: '2025-11-09 14:30',
  },
  {
    id: '3',
    status: 'Running',
    name: 'node-exporter',
    namespace: 'monitoring',
    image: 'prom/node-exporter:v1.6.1',
    ready: 5,
    current: 5,
    desired: 5,
    createdAt: '2025-11-08 09:15',
  },
  {
    id: '4',
    status: 'Pending',
    name: 'calico-node',
    namespace: 'kube-system',
    image: 'calico/node:v3.26.1',
    ready: 2,
    current: 3,
    desired: 5,
    createdAt: '2025-11-10 11:22',
  },
  {
    id: '5',
    status: 'Running',
    name: 'kube-proxy',
    namespace: 'kube-system',
    image: 'k8s.gcr.io/kube-proxy:v1.28.0',
    ready: 5,
    current: 5,
    desired: 5,
    createdAt: '2025-11-07 16:45',
  },
  {
    id: '6',
    status: 'Failed',
    name: 'filebeat',
    namespace: 'logging',
    image: 'elastic/filebeat:8.10.2',
    ready: 0,
    current: 0,
    desired: 5,
    createdAt: '2025-11-10 08:00',
  },
  {
    id: '7',
    status: 'Running',
    name: 'nvidia-device-plugin',
    namespace: 'gpu-operator',
    image: 'nvidia/k8s-device-plugin:v0.14.1',
    ready: 2,
    current: 2,
    desired: 2,
    createdAt: '2025-11-06 10:30',
  },
  {
    id: '8',
    status: 'Running',
    name: 'cilium',
    namespace: 'kube-system',
    image: 'cilium/cilium:v1.14.2',
    ready: 5,
    current: 5,
    desired: 5,
    createdAt: '2025-11-05 12:00',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function DaemonSetsPage() {
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
    updateActiveTabLabel('DaemonSets');
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
  const totalPages = Math.ceil(daemonSetsData.length / rowsPerPage);
  const paginatedData = daemonSetsData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Table columns configuration
  const columns: TableColumn<DaemonSetRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      sortable: true,
      align: 'center',
      render: (value: string) => (
        <StatusIndicator
          status={
            value === 'Running' ? 'active' : 
            value === 'Pending' ? 'building' : 
            value === 'Failed' ? 'error' : 
            'muted'
          }
        />
      )
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (value: string, row) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate"
          title={value}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/container/daemonsets/${row.id}`);
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
      sortable: true,
    },
    {
      key: 'image',
      label: 'Image',
      flex: 1.5,
    },
    {
      key: 'ready',
      label: 'Ready',
      width: '80px',
    },
    {
      key: 'current',
      label: 'Current',
      width: '80px',
    },
    {
      key: 'desired',
      label: 'Desired',
      width: '80px',
    },
    {
      key: 'createdAt',
      label: 'Created At',
      width: '150px',
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'execute-shell',
            label: 'Execute Shell',
            onClick: () => shellPanel.openConsole(row.id, `Shell: ${row.name}`),
          },
          {
            id: 'redeploy',
            label: 'Redeploy',
            onClick: () => console.log('Redeploy:', row.id),
          },
          {
            id: 'edit-config',
            label: 'Edit Config',
            onClick: () => navigate(`/container/daemonsets/${row.id}/edit`),
          },
          {
            id: 'edit-yaml',
            label: 'Edit YAML',
            onClick: () => navigate(`/container/daemonsets/${row.id}/edit-yaml`),
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
            <ContextMenu items={menuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
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
      onClick: () => navigate('/container/daemonsets/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/daemonsets/create-yaml'),
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
                { label: 'DaemonSets' },
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
                    shellPanel.openConsole('kubectl-daemonsets', 'Kubectl: ClusterName');
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
          style={{ paddingBottom: shellPanel.isExpanded ? '350px' : '0' }}
        >
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full min-h-8">
                <HStack gap={2} align="center">
                  <h1 className="text-[16px] leading-6 font-semibold text-[var(--color-text-default)]">
                    DaemonSets
                  </h1>
                </HStack>
                
                {/* Create DaemonSet Button with Dropdown */}
                <ContextMenu items={createMenuItems} trigger="click" align="right">
                  <Button variant="primary" size="md" rightIcon={<IconChevronDown size={14} stroke={1.5} />}>
                    Create DaemonSet
                  </Button>
                </ContextMenu>
              </HStack>

              {/* Action Bar */}
              <HStack gap={2} align="center" className="w-full min-h-7">
                {/* Search */}
                <HStack gap={1} align="center">
                  <SearchInput
                    placeholder="Search DaemonSets by attributes"
                    size="sm"
                    className="w-[280px]"
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
                    leftIcon={<IconRefresh size={12} stroke={1.5} />} 
                    disabled={selectedRows.length === 0}
                  >
                    Redeploy
                  </Button>
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
                totalItems={daemonSetsData.length}
                selectedCount={selectedRows.length}
                showSettings
                onSettingsClick={() => {}}
              />

              {/* Table */}
              <Table<DaemonSetRow>
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

export default DaemonSetsPage;
