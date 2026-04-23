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

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface StorageClassRow {
  id: string;
  name: string;
  status: string;
  provisioner: string;
  reclaimPolicy: 'Delete' | 'Retain';
  volumeBindingMode: 'Immediate' | 'WaitForFirstConsumer';
  allowVolumeExpansion: boolean;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const storageClassesData: StorageClassRow[] = [
  {
    id: '1',
    name: 'standard',
    status: 'OK',
    provisioner: 'ebs.csi.aws.com',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'WaitForFirstConsumer',
    allowVolumeExpansion: true,
    createdAt: 'Jul 25, 2026 10:32:16',
  },
  {
    id: '2',
    name: 'fast-ssd',
    status: 'Active',
    provisioner: 'pd.csi.storage.gke.io',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: true,
    createdAt: 'Nov 9, 2026 18:04:44',
  },
  {
    id: '3',
    name: 'nfs-client',
    status: 'Active',
    provisioner: 'nfs.csi.k8s.io',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: false,
    createdAt: 'Nov 10, 2026 01:17:01',
  },
  {
    id: '4',
    name: 'ceph-rbd',
    status: 'True',
    provisioner: 'rbd.csi.ceph.com',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: true,
    createdAt: 'Nov 8, 2026 14:22:09',
  },
  {
    id: '5',
    name: 'local-path',
    status: 'Active',
    provisioner: 'rancher.io/local-path',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'WaitForFirstConsumer',
    allowVolumeExpansion: false,
    createdAt: 'Oct 3, 2026 09:15:42',
  },
  {
    id: '6',
    name: 'premium-ssd',
    status: 'OK',
    provisioner: 'disk.csi.azure.com',
    reclaimPolicy: 'Retain',
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: true,
    createdAt: 'Sep 21, 2026 11:03:55',
  },
];

/* ----------------------------------------
   Filter fields
   ---------------------------------------- */

const storageClassFilterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'OK', label: 'OK' },
      { value: 'Active', label: 'Active' },
      { value: 'True', label: 'True' },
    ],
  },
  { id: 'provisioner', label: 'Provisioner', type: 'text' },
  {
    id: 'reclaimPolicy',
    label: 'Reclaim Policy',
    type: 'select',
    options: [
      { value: 'Delete', label: 'Delete' },
      { value: 'Retain', label: 'Retain' },
    ],
  },
  {
    id: 'volumeBindingMode',
    label: 'Volume Binding Mode',
    type: 'select',
    options: [
      { value: 'Immediate', label: 'Immediate' },
      { value: 'WaitForFirstConsumer', label: 'WaitForFirstConsumer' },
    ],
  },
  {
    id: 'allowVolumeExpansion',
    label: 'Allow Volume Expansion',
    type: 'select',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function StorageClassesPage() {
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
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [storageClassRows, setStorageClassRows] = useState(storageClassesData);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    updateActiveTabLabel('Storage Classes');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  const filteredData = useMemo(() => {
    if (appliedFilters.length === 0) return storageClassRows;

    return storageClassRows.filter((item) => {
      return appliedFilters.every((filter) => {
        if (filter.fieldId === 'allowVolumeExpansion') {
          return String(item.allowVolumeExpansion) === filter.value;
        }
        const value = item[filter.fieldId as keyof StorageClassRow];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter.value.toLowerCase());
        }
        return true;
      });
    });
  }, [appliedFilters, storageClassRows]);

  const handleBulkDeleteStorageClasses = () => {
    setStorageClassRows((prev) => prev.filter((r) => !selectedRows.includes(r.id)));
    setSelectedRows([]);
    setIsBulkDeleteOpen(false);
  };

  const navigate = useNavigate();

  const createDropdownItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create as form',
      onClick: () => navigate('/container/storage-classes/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/storage-classes/create-yaml'),
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

  const getRowMenuItems = (row: StorageClassRow): ContextMenuItem[] => [
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () =>
        navigate(`/container/storage-classes/${encodeURIComponent(row.name)}/edit-yaml`),
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

  const columns: TableColumn<StorageClassRow>[] = [
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
      render: (value: string, row: StorageClassRow) => (
        <div className="min-w-0">
          <TableLink title={value} onClick={() => navigate(`/container/storage-classes/${row.id}`)}>
            {value}
          </TableLink>
        </div>
      ),
    },
    {
      key: 'provisioner',
      label: 'Provisioner',
      flex: 1,
      minWidth: columnMinWidths.image,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'reclaimPolicy',
      label: 'Reclaim Policy',
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
      key: 'volumeBindingMode',
      label: 'Volume Binding Mode',
      flex: 1,
      minWidth: 180,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'allowVolumeExpansion',
      label: 'Allow Volume Expansion',
      flex: 1,
      minWidth: 160,
      align: 'center',
      sortable: true,
      render: (value: boolean) => (
        <Badge theme={value ? 'green' : 'gray'} type="subtle" size="sm">
          {value ? 'Yes' : 'No'}
        </Badge>
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
          breadcrumb={<Breadcrumb items={[{ label: 'Storage Classes' }]} />}
          actions={
            <ContainerTopBarActions
              onTerminalClick={() => {
                if (shellPanel.isExpanded) {
                  shellPanel.setIsExpanded(false);
                } else {
                  shellPanel.openConsole('kubectl-storage-classes', 'Kubectl: ClusterName');
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
          title="Storage Classes"
          actions={
            <ContextMenu items={createDropdownItems} trigger="click" align="right">
              <Button variant="primary" rightIcon={<IconChevronDown size={14} stroke={1.5} />}>
                Create storage class
              </Button>
            </ContextMenu>
          }
        />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={storageClassFilterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={setAppliedFilters}
                placeholder="Search storage classes by attributes"
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

        <Table<StorageClassRow>
          columns={columns}
          loading={loading}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          onRowClick={(row) => navigate(`/container/storage-classes/${row.id}`)}
          emptyMessage="No storage classes found"
        />
      </VStack>

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteStorageClasses}
        title="Delete selected storage classes"
        description="Removing the selected storage classes is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={`${selectedRows.length} storage class(es)`}
      />
    </PageShell>
  );
}

export default StorageClassesPage;
