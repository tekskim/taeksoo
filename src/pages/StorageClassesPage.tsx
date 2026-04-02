import { useState } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  TableLink,
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
  Popover,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate } from 'react-router-dom';
import {
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconBell,
  IconDownload,
  IconDotsCircleHorizontal,
  IconTrash,
  IconChevronDown,
  IconPencilCog,
  IconKey,
} from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface ServiceRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  target: string[];
  selector: string[];
  type: 'ClusterIP' | 'ClusterIP (Headless)' | 'ExternalName' | 'LoadBalancer' | 'NodePort';
  ipAddresses: string[];
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const servicesData: ServiceRow[] = [
  {
    id: '1',
    status: 'Active',
    name: 'frontend-web-application-loadbalancer-service',
    namespace: 'namespaceName',
    target: ['http + 80/TCP', 'https-internal + 444/TCP'],
    selector: ['key1=value1'],
    type: 'LoadBalancer',
    ipAddresses: ['10.96.0.1', '203.0.113.10'],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '2',
    status: 'Processing',
    name: 'backend-api-gateway-cluster-internal-service',
    namespace: 'namespaceName',
    target: ['myport + 80/TCP'],
    selector: ['key1=value1', 'key2=value2', 'key3=value3'],
    type: 'ClusterIP (Headless)',
    ipAddresses: ['None'],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '3',
    status: 'Error',
    name: 'external-database-connection-externalname-service',
    namespace: 'namespaceName',
    target: ['my.database.example.com'],
    selector: ['-'],
    type: 'ExternalName',
    ipAddresses: ['-'],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '4',
    status: 'Active',
    name: 'ingress-nginx-loadbalancer-external-service',
    namespace: 'namespaceName',
    target: ['80/TCP', '443/TCP'],
    selector: ['key1=value1', 'key2=value2'],
    type: 'LoadBalancer',
    ipAddresses: ['10.96.12.34', '203.0.113.50'],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '5',
    status: 'Processing',
    name: 'legacy-application-nodeport-external-access-service',
    namespace: 'namespaceName',
    target: ['[Any Node]:31575'],
    selector: ['key1=value1'],
    type: 'NodePort',
    ipAddresses: ['10.96.5.67'],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerServicesPage() {
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
      label: 'Create as form',
      onClick: () => navigate('/container/services/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/services/create-yaml'),
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

  // Pagination
  const rowsPerPage = 10;
  const totalPages = Math.ceil(servicesData.length / rowsPerPage);
  const paginatedData = servicesData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // Table columns configuration
  const columns: TableColumn<ServiceRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      sortable: false,
      render: (value: string) => (
        <span className="min-w-0 block">
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
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row: ServiceRow) => (
        <div className="min-w-0">
          <TableLink title={value} onClick={() => navigate(`/container/services/${row.id}`)}>
            {value}
          </TableLink>
        </div>
      ),
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: columnMinWidths.namespace,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'target',
      label: 'Target',
      flex: 1,
      minWidth: columnMinWidths.ip,
      sortable: false,
      render: (value: string[]) => (
        <div className="flex w-full items-center gap-1 min-w-0">
          <span className="truncate min-w-0 flex-1" title={value[0]}>
            {value[0]}
          </span>
          {value.length > 1 && (
            <span className="ml-auto">
              <Popover
                trigger="hover"
                position="bottom"
                delay={100}
                hideDelay={100}
                content={
                  <div className="p-3 min-w-[120px] max-w-[320px]">
                    <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                      All targets ({value.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {value.map((item, i) => (
                        <Badge key={i} theme="white" size="sm">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                }
              >
                <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                  +{value.length - 1}
                </span>
              </Popover>
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'ipAddresses',
      label: 'IP addresses',
      flex: 1,
      minWidth: columnMinWidths.ip,
      render: (value: string[]) => (
        <div className="flex w-full items-center gap-1 min-w-0">
          <span className="truncate min-w-0 flex-1" title={value[0]}>
            {value[0]}
          </span>
          {value.length > 1 && (
            <span className="ml-auto">
              <Popover
                trigger="hover"
                position="bottom"
                delay={100}
                hideDelay={100}
                content={
                  <div className="p-3 min-w-[120px] max-w-[320px]">
                    <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                      All IP addresses ({value.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {value.map((item, i) => (
                        <Badge key={i} theme="white" size="sm">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                }
              >
                <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                  +{value.length - 1}
                </span>
              </Popover>
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'selector',
      label: 'Selector',
      flex: 1,
      minWidth: columnMinWidths.ip,
      sortable: false,
      render: (value: string[]) => (
        <div className="flex w-full items-center gap-1 min-w-0">
          <span className="truncate min-w-0 flex-1" title={value[0]}>
            {value[0]}
          </span>
          {value.length > 1 && (
            <span className="ml-auto">
              <Popover
                trigger="hover"
                position="bottom"
                delay={100}
                hideDelay={100}
                content={
                  <div className="p-3 min-w-[120px] max-w-[320px]">
                    <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                      All selectors ({value.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {value.map((item, i) => (
                        <Badge key={i} theme="white" size="sm">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                }
              >
                <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                  +{value.length - 1}
                </span>
              </Popover>
            </span>
          )}
        </div>
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
          <span className="truncate block min-w-0" title={display}>
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
            onClick: () => navigate(`/container/services/${row.id}/edit-yaml`),
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
          <div className="min-w-0" onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click" align="right">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
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
              items={[{ label: 'clusterName', href: '/container' }, { label: 'Services' }]}
            />
          }
          actions={
            <>
              <button
                className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                onClick={() => window.dispatchEvent(new CustomEvent('open-cluster-appearance'))}
                aria-label="Customize cluster appearance"
              >
                <IconPencilCog size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button
                className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                onClick={() => window.dispatchEvent(new CustomEvent('open-access-token'))}
                aria-label="Access Token"
              >
                <IconKey size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button
                className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                onClick={() => {
                  if (shellPanel.isExpanded) {
                    shellPanel.setIsExpanded(false);
                  } else {
                    shellPanel.openConsole('kubectl-services', 'Kubectl: ClusterName');
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
          title="Services"
          actions={
            <ContextMenu items={createDropdownItems} trigger="click" align="right">
              <Button variant="primary" rightIcon={<IconChevronDown size={14} stroke={1.5} />}>
                Create service
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
                placeholder="Search service by attributes"
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
          totalItems={servicesData.length}
          selectedCount={selectedRows.length}
          showSettings
          onSettingsClick={() => {}}
        />

        {/* Table */}
        <Table<ServiceRow>
          columns={columns}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          onRowClick={(row) => navigate(`/container/services/${row.id}`)}
        />
      </VStack>
    </PageShell>
  );
}

export { ContainerServicesPage as StorageClassesPage };
export default ContainerServicesPage;
