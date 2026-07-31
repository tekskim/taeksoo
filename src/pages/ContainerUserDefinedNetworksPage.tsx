import { useState, useEffect, useMemo } from 'react';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  TableLink,
  Button,
  FilterSearchInput,
  Pagination,
  ContextMenu,
  PageShell,
  PageHeader,
  ListToolbar,
  ConfirmModal,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
  fixedColumns,
  columnMinWidths,
  Badge,
  Tooltip,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate } from 'react-router-dom';
import {
  IconDownload,
  IconDotsCircleHorizontal,
  IconTrash,
  IconChevronDown,
} from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';
import { useContainerMode } from '@/contexts/ContainerModeContext';
import { getActiveCpCluster } from './containerActiveCluster';

import {
  userDefinedNetworksData,
  type UserDefinedNetworkRow,
  type UdnScope,
  type UdnRole,
} from './containerUserDefinedNetworksData';

/* ----------------------------------------
   UserDefinedNetworks 목록.

   ⚠ CNI 종속 — OVN-Kubernetes를 쓸 때만 존재하는 리소스다.
   목데이터와 타입은 containerUserDefinedNetworksData.ts가 정본이다 — 상세 화면도 같은 것을 읽는다.
   ---------------------------------------- */

/* ----------------------------------------
   Filter fields
   ---------------------------------------- */

const userDefinedNetworkFilterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Pending', label: 'Pending' },
      { value: 'Failed', label: 'Failed' },
    ],
  },
  { id: 'namespace', label: 'Namespace', type: 'text' },
  {
    id: 'scope',
    label: 'Scope',
    type: 'select',
    options: [
      { value: 'Namespace', label: 'Namespace' },
      { value: 'Cluster', label: 'Cluster' },
    ],
  },
  {
    id: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'Primary', label: 'Primary' },
      { value: 'Secondary', label: 'Secondary' },
    ],
  },
  {
    id: 'topology',
    label: 'Topology',
    type: 'select',
    options: [
      { value: 'Layer2', label: 'Layer2' },
      { value: 'Layer3', label: 'Layer3' },
    ],
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerUserDefinedNetworksPage() {
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
  const { isPlatform } = useContainerMode();
  // 전용(등록형) 클러스터: 생성 차단 (D-28)
  const dedicated = isPlatform && getActiveCpCluster().dedicated;
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [udnRows, setUdnRows] = useState(userDefinedNetworksData);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    updateActiveTabLabel('User Defined Networks');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  const filteredData = useMemo(() => {
    if (appliedFilters.length === 0) return udnRows;

    return udnRows.filter((item) => {
      return appliedFilters.every((filter) => {
        const value = item[filter.fieldId as keyof UserDefinedNetworkRow];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter.value.toLowerCase());
        }
        return true;
      });
    });
  }, [appliedFilters, udnRows]);

  const handleBulkDeleteNetworks = () => {
    setUdnRows((prev) => prev.filter((r) => !selectedRows.includes(r.id)));
    setSelectedRows([]);
    setIsBulkDeleteOpen(false);
  };

  const navigate = useNavigate();

  const createDropdownItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create as form',
      onClick: () => navigate('/container/user-defined-networks/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/user-defined-networks/create-yaml'),
    },
  ];

  const shellPanel = useShellPanel();

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

  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const sidebarWidth = sidebarOpen ? 248 : 48;

  const getRowMenuItems = (row: UserDefinedNetworkRow): ContextMenuItem[] => [
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () =>
        navigate(`/container/user-defined-networks/${encodeURIComponent(row.name)}/edit-yaml`),
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

  const columns: TableColumn<UserDefinedNetworkRow>[] = [
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
      render: (value: string, row: UserDefinedNetworkRow) => (
        <div className="min-w-0">
          <TableLink
            title={value}
            onClick={() => navigate(`/container/user-defined-networks/${row.id}`)}
          >
            {value}
          </TableLink>
        </div>
      ),
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: 140,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'scope',
      label: 'Scope',
      flex: 1,
      minWidth: 120,
      sortable: true,
      render: (value: UdnScope) => (
        <Badge theme={value === 'Cluster' ? 'yellow' : 'gray'} type="subtle" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      flex: 1,
      minWidth: 120,
      sortable: true,
      render: (value: UdnRole) => (
        <Badge theme={value === 'Primary' ? 'blue' : 'gray'} type="subtle" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'topology',
      label: 'Topology',
      flex: 1,
      minWidth: 120,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'subnets',
      label: 'Subnets',
      flex: 1,
      minWidth: 160,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
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
      render: (_, row) => (
        <div className="min-w-0" onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getRowMenuItems(row)} trigger="click" align="right">
            <button
              aria-label="Row actions"
              type="button"
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            >
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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'User Defined Networks' }]} />}
          actions={
            <ContainerTopBarActions
              onTerminalClick={() => {
                if (shellPanel.isExpanded) {
                  shellPanel.setIsExpanded(false);
                } else {
                  shellPanel.openConsole('kubectl-user-defined-networks', 'Kubectl: ClusterName');
                }
              }}
              isTerminalActive={shellPanel.isExpanded}
            />
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
        <PageHeader
          title="User Defined Networks"
          actions={
            dedicated ? undefined : (
              <ContextMenu items={createDropdownItems} trigger="click" align="right">
                <Button variant="primary" rightIcon={<IconChevronDown size={14} stroke={1.5} />}>
                  Create network
                </Button>
              </ContextMenu>
            )
          }
        />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={userDefinedNetworkFilterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={setAppliedFilters}
                placeholder="Search networks by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
                hideAppliedFilters
              />
              <Button
                variant="secondary"
                size="sm"
                aria-label="Download"
                className="!p-0 !w-7 !h-7 !min-w-7"
                onClick={() => console.log('Download')}
              >
                <IconDownload size={12} stroke={1.5} />
              </Button>
            </ListToolbar.Actions>
          }
          bulkActions={
            <ListToolbar.Actions>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconDownload size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
                onClick={() => console.log('Download YAML')}
              >
                Download YAML
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconTrash size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
                onClick={() => setIsBulkDeleteOpen(true)}
              >
                Delete
              </Button>
            </ListToolbar.Actions>
          }
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          selectedCount={selectedRows.length}
        />

        <Table<UserDefinedNetworkRow>
          columns={columns}
          loading={loading}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          onRowClick={(row) => navigate(`/container/user-defined-networks/${row.id}`)}
          emptyMessage="No user defined networks found"
        />
      </VStack>

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteNetworks}
        title="Delete selected networks"
        description="Pods attached to a deleted network lose connectivity. A primary network cannot be re-created for a namespace that already has running pods."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={`${selectedRows.length} network(s)`}
      />
    </PageShell>
  );
}

export default ContainerUserDefinedNetworksPage;
