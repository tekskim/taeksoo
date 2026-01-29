import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  TableLink,
  Button,
  StatusIndicator,
  SearchInput,
  Pagination,
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
  IconDotsCircleHorizontal,
  IconTrash,
  IconChevronDown,
  IconStar,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface HPARow {
  id: string;
  status: 'Running' | 'Pending' | 'Error';
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
    status: 'Running',
    name: 'horizontalpodautoscalerName',
    namespace: 'namespaceName',
    workload: 'workloadName',
    minReplicas: 1,
    maxReplicas: 10,
    currentReplicas: 5,
    createdAt: '2025-11-10 12:57',
  },
  {
    id: '2',
    status: 'Running',
    name: 'api-hpa',
    namespace: 'default',
    workload: 'api-deployment',
    minReplicas: 2,
    maxReplicas: 20,
    currentReplicas: 8,
    createdAt: '2025-11-09 14:30',
  },
  {
    id: '3',
    status: 'Pending',
    name: 'web-hpa',
    namespace: 'production',
    workload: 'web-deployment',
    minReplicas: 3,
    maxReplicas: 15,
    currentReplicas: 3,
    createdAt: '2025-11-08 09:15',
  },
  {
    id: '4',
    status: 'Error',
    name: 'staging-hpa',
    namespace: 'staging',
    workload: 'staging-deployment',
    minReplicas: 1,
    maxReplicas: 5,
    currentReplicas: 1,
    createdAt: '2025-11-07 16:42',
  },
];

/* ----------------------------------------
   Create HPA Dropdown Component
   ---------------------------------------- */

interface CreateHPADropdownProps {
  onCreateForm: () => void;
  onCreateYaml: () => void;
}

function CreateHPADropdown({ onCreateForm, onCreateYaml }: CreateHPADropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, right: 0 };
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    };
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="primary"
        size="sm"
        rightIcon={<IconChevronDown size={12} stroke={1.5} />}
        onClick={() => setIsOpen(!isOpen)}
      >
        Create Horizontal Pod Autoscaler
      </Button>

      {isOpen &&
        createPortal(
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-[99]" onClick={() => setIsOpen(false)} />
            {/* Dropdown */}
            <div
              ref={dropdownRef}
              className="fixed z-[100] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg shadow-lg py-1 min-w-[140px]"
              style={{
                top: getDropdownPosition().top,
                right: getDropdownPosition().right,
              }}
            >
              <button
                className="w-full px-3 py-2 text-left text-[12px] text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  onCreateForm();
                }}
              >
                Create as Form
              </button>
              <button
                className="w-full px-3 py-2 text-left text-[12px] text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  onCreateYaml();
                }}
              >
                Create as YAML
              </button>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

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

  const getStatusType = (status: string): 'active' | 'pending' | 'error' => {
    switch (status) {
      case 'Running':
        return 'active';
      case 'Pending':
        return 'pending';
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
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (value) => <StatusIndicator status={getStatusType(value)} showIcon />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
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
      label: 'Created At',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'action',
      label: 'Action',
      flex: 1,
      minWidth: columnMinWidths.action,
      align: 'center',
      sticky: 'right',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'edit-config',
            label: 'Edit Config',
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

  const handleCreateForm = () => {
    console.log('Create as Form');
  };

  const handleCreateYaml = () => {
    navigate('/container/hpa/create-yaml');
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* TabBar */}
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />

        {/* TopBar */}
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

        {/* Page Content */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll"
          style={{ paddingBottom: shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0' }}
        >
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full min-h-8">
                <HStack gap={2} align="center">
                  <h1 className="text-[16px] leading-6 font-semibold text-[var(--color-text-default)]">
                    Horizontal Pod Autoscalers
                  </h1>
                  <button className="p-1 hover:bg-[var(--color-surface-subtle)] rounded transition-colors">
                    <IconStar size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
                  </button>
                </HStack>
                <CreateHPADropdown
                  onCreateForm={handleCreateForm}
                  onCreateYaml={handleCreateYaml}
                />
              </HStack>

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
