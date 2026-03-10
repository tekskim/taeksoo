import { useState } from 'react';
import {
  VStack,
  HStack,
  PageShell,
  PageHeader,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  TableLink,
  Button,
  SearchInput,
  Pagination,
  ContextMenu,
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
  IconDotsCircleHorizontal,
  IconTrash,
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface HPARow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  workload: string;
  minReplicas: number;
  maxReplicas: number;
  currentReplicas: number;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const hpaData: HPARow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'frontend-web-application-horizontal-autoscaler',
    namespace: 'namespaceName',
    workload: 'workloadName',
    minReplicas: 1,
    maxReplicas: 10,
    currentReplicas: 5,
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '2',
    status: 'True',
    name: 'backend-api-gateway-cpu-memory-autoscaler',
    namespace: 'default',
    workload: 'api-deployment',
    minReplicas: 2,
    maxReplicas: 20,
    currentReplicas: 8,
    createdAt: 'Nov 9, 2025',
  },
  {
    id: '3',
    status: 'CreateContainerConfigError',
    name: 'frontend-web-production-pending-workload-autoscaler',
    namespace: 'production',
    workload: 'web-deployment',
    minReplicas: 3,
    maxReplicas: 15,
    currentReplicas: 3,
    createdAt: 'Nov 8, 2025',
  },
  {
    id: '4',
    status: 'ImagePullBackOff',
    name: 'staging-environment-workload-autoscaler',
    namespace: 'staging',
    workload: 'staging-deployment',
    minReplicas: 1,
    maxReplicas: 5,
    currentReplicas: 1,
    createdAt: 'Nov 7, 2025',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerHPAPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, addTab } = useTabs();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([]);
  const navigate = useNavigate();

  // Create menu items
  const createDropdownItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create as Form',
      onClick: () => navigate('/container/hpa/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/hpa/create-yaml'),
    },
  ];

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

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const getStatusType = (status: string): 'active' | 'building' | 'error' => {
    switch (status) {
      case 'Running':
        return 'active';
      case 'Pending':
        return 'building';
      case 'Error':
        return 'error';
      default:
        return 'active';
    }
  };

  const columns: TableColumn<HPARow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      align: 'center',
      sortable: false,
      render: (value) => (
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
      flex: 2,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value, row) => (
        <TableLink onClick={() => navigate(`/container/hpa/${row.id}`)}>{value}</TableLink>
      ),
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: columnMinWidths.namespace,
      sortable: true,
    },
    {
      key: 'workload',
      label: 'Workload',
      flex: 1,
      minWidth: columnMinWidths.workload,
    },
    {
      key: 'minReplicas',
      label: 'Minimum Replicas',
      flex: 1,
      minWidth: columnMinWidths.minReplicas,
      sortable: true,
    },
    {
      key: 'maxReplicas',
      label: 'Maximum Replicas',
      flex: 1,
      minWidth: columnMinWidths.maxReplicas,
      sortable: true,
    },
    {
      key: 'currentReplicas',
      label: 'Current Replicas',
      flex: 1,
      minWidth: columnMinWidths.currentReplicas,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'action',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'edit-config',
            label: 'Edit config',
            onClick: () => console.log('Edit Config:', row.id),
          },
          {
            id: 'edit-yaml',
            label: 'Edit YAML',
            onClick: () => navigate(`/container/hpa/${row.id}/edit-yaml`),
          },
          {
            id: 'download-yaml',
            label: 'Download YAML',
            onClick: () => console.log('Download YAML:', row.id),
          },
          {
            id: 'delete',
            label: 'Delete',
            onClick: () => console.log('Delete:', row.id),
            danger: true,
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

  const handleCreateForm = () => {
    console.log('Create as Form');
  };

  const handleCreateYaml = () => {
    navigate('/container/hpa/create-yaml');
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
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Horizontal Pod Autoscalers' },
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
                    shellPanel.openConsole('kubectl-hpa', 'Kubectl: ClusterName');
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
        <PageHeader
          title="Horizontal Pod Autoscalers"
          actions={
            <ContextMenu items={createDropdownItems} trigger="click" align="right">
              <Button variant="primary" rightIcon={<IconChevronDown size={14} stroke={1.5} />}>
                Create Horizontal Pod Autoscaler
              </Button>
            </ContextMenu>
          }
        />

        {/* Action Bar */}
        <HStack gap={2} align="center" className="w-full min-h-7">
          {/* Search */}
          <HStack gap={1} align="center">
            <SearchInput
              placeholder="Search horizontal pod autoscaler by attributes"
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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
          totalItems={hpaData.length}
          selectedCount={selectedRows.length}
          showSettings
          onSettingsClick={() => {}}
        />

        {/* Table */}
        <Table<HPARow>
          columns={columns}
          data={hpaData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          onRowClick={(row) => navigate(`/container/hpa/${row.id}`)}
        />
      </VStack>
    </PageShell>
  );
}
