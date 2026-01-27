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
  IconDotsCircleHorizontal,
  IconTrash,
  IconChevronDown,
  IconStar,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface IngressRow {
  id: string;
  status: 'Running' | 'Pending' | 'Error';
  name: string;
  namespace: string;
  target: string[];
  default: string;
  ingressClass: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const ingressesData: IngressRow[] = [
  {
    id: '1',
    status: 'Running',
    name: 'ingressName',
    namespace: 'namespaceName',
    target: ['http → 80/TCP', 'https-internal → 444/TCP'],
    default: '-',
    ingressClass: 'traefik',
    createdAt: '2025-11-10 12:57',
  },
  {
    id: '2',
    status: 'Running',
    name: 'api-ingress',
    namespace: 'default',
    target: ['api → 8080/TCP'],
    default: '-',
    ingressClass: 'nginx',
    createdAt: '2025-11-09 14:30',
  },
  {
    id: '3',
    status: 'Pending',
    name: 'web-ingress',
    namespace: 'production',
    target: ['web → 80/TCP', 'websecure → 443/TCP'],
    default: 'backend-service:80',
    ingressClass: 'traefik',
    createdAt: '2025-11-08 09:15',
  },
  {
    id: '4',
    status: 'Error',
    name: 'staging-ingress',
    namespace: 'staging',
    target: ['app → 3000/TCP'],
    default: '-',
    ingressClass: 'traefik',
    createdAt: '2025-11-07 16:42',
  },
];

/* ----------------------------------------
   Create Ingress Dropdown Component
   ---------------------------------------- */

interface CreateIngressDropdownProps {
  onCreateForm: () => void;
  onCreateYaml: () => void;
}

function CreateIngressDropdown({ onCreateForm, onCreateYaml }: CreateIngressDropdownProps) {
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
        Create Ingress
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

export function ContainerIngressesPage() {
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

  // Pagination
  const rowsPerPage = 10;
  const totalPages = Math.ceil(ingressesData.length / rowsPerPage);
  const paginatedData = ingressesData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Table columns configuration
  const columns: TableColumn<IngressRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '64px',
      sortable: false,
      align: 'center',
      render: (value: string) => (
        <StatusIndicator
          status={value === 'Running' ? 'active' : value === 'Pending' ? 'paused' : 'error'}
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: '120px',
      sortable: true,
      render: (value: string, row: IngressRow) => (
        <TableLink title={value} onClick={() => navigate(`/container/ingresses/${row.id}`)}>
          {value}
        </TableLink>
      ),
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: '100px',
      sortable: true,
    },
    {
      key: 'target',
      label: 'Target',
      flex: 1,
      minWidth: '140px',
      sortable: false,
      render: (value: string[]) => (
        <div className="flex flex-col gap-0.5">
          {value.map((item, index) => (
            <span key={index} className="text-[12px] leading-4 text-[var(--color-text-default)]">
              {item}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'default',
      label: 'Default',
      flex: 1,
      minWidth: '80px',
      sortable: false,
    },
    {
      key: 'ingressClass',
      label: 'Ingress Class',
      flex: 1,
      minWidth: '100px',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      flex: 1,
      minWidth: '120px',
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '64px',
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
            onClick: () => navigate(`/container/ingresses/${row.id}/edit-yaml`),
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
              items={[{ label: 'clusterName', href: '/container' }, { label: 'Ingresses' }]}
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
                    shellPanel.openConsole('kubectl-ingresses', 'Kubectl: ClusterName');
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
          className="flex-1 overflow-y-auto overflow-x-hidden min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll"
          style={{ paddingBottom: shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0' }}
        >
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full min-h-8">
                <HStack gap={2} align="center">
                  <h1 className="text-[16px] leading-6 font-semibold text-[var(--color-text-default)]">
                    Ingresses
                  </h1>
                  <button className="p-1 hover:bg-[var(--color-surface-subtle)] rounded transition-colors">
                    <IconStar size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
                  </button>
                </HStack>
                <CreateIngressDropdown
                  onCreateForm={() => navigate('/container/ingresses/create')}
                  onCreateYaml={() => navigate('/container/ingresses/create-yaml')}
                />
              </HStack>

              {/* Action Bar */}
              <HStack gap={2} align="center" className="w-full min-h-7">
                {/* Search */}
                <HStack gap={1} align="center">
                  <SearchInput
                    placeholder="Search ingress by attributes"
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
                totalItems={ingressesData.length}
                selectedCount={selectedRows.length}
                showSettings
                onSettingsClick={() => {}}
              />

              {/* Table */}
              <Table<IngressRow>
                columns={columns}
                data={paginatedData}
                rowKey="id"
                selectable
                selectedKeys={selectedRows}
                onSelectionChange={setSelectedRows}
                onRowClick={(row) => navigate(`/container/ingresses/${row.id}`)}
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

export default ContainerIngressesPage;
