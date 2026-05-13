import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Table,
  FilterSearchInput,
  Pagination,
  ListToolbar,
  StatusIndicator,
  ContextMenu,
  PageShell,
  TabBar,
  TopBar,
  TopBarAction,
  VStack,
  PageHeader,
  Modal,
  ConfirmModal,
  EmptyState,
  InfoBox,
  HStack,
  MetricCard,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
  type StatusType,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconTrash,
  IconDotsCircleHorizontal,
  IconBell,
  IconAlertCircle,
  IconDatabase,
  IconPlus,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { DataTestToolbar, type DataMode, multiplyData } from '@/pages/ai-platform/shared';

type DatasourceStatus = 'completed' | 'error' | 'processing' | 'pending' | 'draft' | 'deleting';

interface DatasourceRow {
  id: string;
  status: DatasourceStatus;
  name: string;
  type: string;
  documents: string;
  documentsProgress?: { current: number; total: number; percentage: number; hasError?: boolean };
  size: string;
  createdAt: string;
}

const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  {
    id: 'type',
    label: 'Type',
    type: 'select',
    options: [{ value: 'File', label: 'File' }],
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'completed', label: 'Completed' },
      { value: 'error', label: 'Error' },
      { value: 'processing', label: 'Processing' },
      { value: 'pending', label: 'Pending' },
      { value: 'draft', label: 'Draft' },
      { value: 'deleting', label: 'Deleting' },
    ],
  },
];

const initialRows: DatasourceRow[] = [
  {
    id: '1',
    status: 'draft',
    name: 'lable',
    type: 'File',
    documents: '-',
    size: '-',
    createdAt: 'Nov 11, 2025, 2:51 PM',
  },
  {
    id: '2',
    status: 'pending',
    name: 'lable',
    type: 'File',
    documents: '-',
    size: '-',
    createdAt: 'Nov 11, 2025, 2:51 PM',
  },
  {
    id: '3',
    status: 'completed',
    name: 'lable',
    type: 'File',
    documents: '7',
    size: '60 MB',
    createdAt: 'Nov 11, 2025, 2:51 PM',
  },
  {
    id: '4',
    status: 'processing',
    name: 'lable',
    type: 'File',
    documents: '7/10 (75%)',
    documentsProgress: { current: 7, total: 10, percentage: 75 },
    size: '60 MB',
    createdAt: 'Nov 11, 2025, 2:51 PM',
  },
  {
    id: '5',
    status: 'error',
    name: 'lable',
    type: 'File',
    documents: '7/10 (75%)',
    documentsProgress: { current: 7, total: 10, percentage: 75, hasError: true },
    size: '60 MB',
    createdAt: 'Nov 11, 2025, 2:51 PM',
  },
  {
    id: '6',
    status: 'processing',
    name: 'lable',
    type: 'File',
    documents: '(75%)',
    documentsProgress: { current: 7, total: 10, percentage: 75 },
    size: '60 MB',
    createdAt: 'Nov 11, 2025, 2:51 PM',
  },
  {
    id: '7',
    status: 'deleting',
    name: 'lable',
    type: 'File',
    documents: '3/10 (30%)',
    documentsProgress: { current: 3, total: 10, percentage: 30 },
    size: '60 MB',
    createdAt: 'Nov 11, 2025, 2:51 PM',
  },
];

function DatasourceStatusCell({ status }: { status: DatasourceStatus }) {
  if (status === 'deleting') {
    return (
      <div className="flex justify-center">
        <span className="flex items-center justify-center size-6 rounded-full bg-[var(--color-state-info-bg)] text-[var(--color-state-info)]">
          <IconTrash size={16} stroke={1.5} />
        </span>
      </div>
    );
  }

  const map: Record<Exclude<DatasourceStatus, 'deleting'>, StatusType> = {
    completed: 'active',
    error: 'error',
    processing: 'building',
    pending: 'pending',
    draft: 'draft',
  };

  return <StatusIndicator layout="icon-only" status={map[status]} />;
}

export function DatasourcePage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [dataMode, setDataMode] = useState<DataMode>('many');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [singleDeleteOpen, setSingleDeleteOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<DatasourceRow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const rowsPerPage = 10;

  useEffect(() => {
    document.title = 'Data sources - THAKI Cloud';
    return () => {
      document.title = 'THAKI Cloud';
    };
  }, []);

  useEffect(() => {
    updateActiveTabLabel('Data sources');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters, dataMode]);

  useEffect(() => {
    setSelectedKeys([]);
  }, [dataMode]);

  const rows = useMemo(() => {
    if (dataMode === 'empty') return [];
    if (dataMode === 'few') return initialRows;
    return multiplyData(initialRows, 99);
  }, [dataMode]);

  const dataSources = rows;
  const totalItems = dataSources.length;

  const statusCounts = useMemo(() => {
    return {
      completed: dataSources.filter((d) => d.status === 'completed').length,
      error: dataSources.filter((d) => d.status === 'error').length,
      processing: dataSources.filter((d) => d.status === 'processing' || d.status === 'deleting')
        .length,
      pending: dataSources.filter((d) => d.status === 'pending').length,
      draft: dataSources.filter((d) => d.status === 'draft').length,
    };
  }, [dataSources]);

  const filtered = useMemo(() => {
    if (appliedFilters.length === 0) return dataSources;
    return dataSources.filter((ds) =>
      appliedFilters.every((filter) => {
        if (filter.fieldId === 'name') {
          return ds.name.toLowerCase().includes(String(filter.value).toLowerCase());
        }
        if (filter.fieldId === 'type') {
          return ds.type === filter.value;
        }
        if (filter.fieldId === 'status') {
          return ds.status === filter.value;
        }
        return true;
      })
    );
  }, [dataSources, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = useMemo(() => {
    return filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filtered, currentPage, rowsPerPage]);

  const handleBulkDelete = () => {
    setBulkDeleteOpen(false);
    setSelectedKeys([]);
  };

  const confirmSingleDelete = () => {
    if (!pendingDelete) return;
    setSingleDeleteOpen(false);
    setPendingDelete(null);
  };

  const columns: TableColumn<DatasourceRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (_, row) => <DatasourceStatusCell status={row.status} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row) => (
        <button
          type="button"
          className="truncate block text-left text-[var(--color-action-primary)] hover:underline cursor-pointer w-full"
          title={value}
          onClick={() => navigate('/agent/datasource/connections')}
        >
          {value}
        </button>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: false,
    },
    {
      key: 'documents',
      label: 'Documents',
      flex: 1,
      minWidth: '140px',
      sortable: false,
      render: (_, row) => {
        if (row.documentsProgress) {
          const { current, total, percentage, hasError } = row.documentsProgress;
          const percentOnly = row.documents.trim().startsWith('(') && !row.documents.includes('/');

          return (
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-1 text-body-md whitespace-nowrap">
                {percentOnly ? (
                  <span className="text-[var(--color-text-subtle)]">({percentage}%)</span>
                ) : (
                  <>
                    <span className="text-[var(--color-text-default)]">
                      {current}/{total}
                    </span>
                    <span className="text-[var(--color-text-subtle)]"> ({percentage}%)</span>
                  </>
                )}
                {hasError ? (
                  <IconAlertCircle
                    size={14}
                    className="text-[var(--color-state-danger)] shrink-0"
                  />
                ) : null}
              </div>
              <div className="w-full h-1.5 bg-[var(--color-surface-subtle)] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    hasError ? 'bg-[var(--color-state-danger)]' : 'bg-[var(--color-action-primary)]'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        }
        return <span className="text-[var(--color-text-default)]">{row.documents ?? '-'}</span>;
      },
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
      render: (value: string) => <span className="whitespace-nowrap">{value ?? '-'}</span>,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => <span className="whitespace-nowrap">{value}</span>,
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
            id: 'edit',
            label: 'Edit',
            onClick: () => navigate(`/agent/datasource/${row.id}/edit`),
          },
          {
            id: 'agent-connections',
            label: 'Agent connections',
            onClick: () => navigate('/agent/datasource/connections'),
          },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            divider: true,
            onClick: () => {
              setPendingDelete(row);
              setSingleDeleteOpen(true);
            },
          },
        ];

        return (
          <div
            className="flex gap-1 items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <ContextMenu items={menuItems} trigger="click" align="right">
              <button
                type="button"
                aria-label="Row actions"
                className="p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] transition-colors"
              >
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

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
          showAddButton={true}
          showWindowControls={true}
          onWindowClose={() => navigate('/')}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={false}
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-3"
    >
      <VStack gap={6}>
        <PageHeader
          title="Data sources"
          actions={
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/agent/datasource/create')}
            >
              Create data source
            </Button>
          }
        />

        <MetricCard.Group>
          <MetricCard title="Completed" value={statusCounts.completed} />
          <MetricCard title="Error" value={statusCounts.error} />
          <MetricCard title="Processing" value={statusCounts.processing} />
          <MetricCard title="Pending" value={statusCounts.pending} />
          <MetricCard title="Draft" value={statusCounts.draft} />
        </MetricCard.Group>

        <div className="flex flex-col gap-3 w-full">
          <ListToolbar
            primaryActions={
              <ListToolbar.Actions>
                <FilterSearchInput
                  filters={filterFields}
                  appliedFilters={appliedFilters}
                  onFiltersChange={setAppliedFilters}
                  placeholder="Find data sources with filters"
                  size="sm"
                  className="w-[280px]"
                  hideAppliedFilters
                />
              </ListToolbar.Actions>
            }
            bulkActions={
              <ListToolbar.Actions>
                <Button
                  variant="muted"
                  size="sm"
                  leftIcon={<IconTrash size={12} />}
                  disabled={selectedKeys.length === 0}
                  onClick={() => setBulkDeleteOpen(true)}
                >
                  Delete
                </Button>
              </ListToolbar.Actions>
            }
          />

          {dataMode === 'empty' ? (
            <EmptyState
              variant="card"
              icon={<IconDatabase size={48} stroke={1} />}
              title="No data sources"
              description="Create a data source to index documents for your agents."
              action={
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<IconPlus size={12} />}
                  onClick={() => navigate('/agent/datasource/create')}
                >
                  Create data source
                </Button>
              }
            />
          ) : (
            <>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                selectedCount={selectedKeys.length}
              />

              <Table<DatasourceRow>
                columns={columns}
                data={paginated}
                rowKey="id"
                emptyMessage="No data sources found"
                selectable
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
              />
            </>
          )}
        </div>
      </VStack>

      <DataTestToolbar mode={dataMode} onChange={setDataMode} />

      <ConfirmModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title="Delete selected data sources"
        description="Deleting the selected data sources is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={`${selectedKeys.length} data source(s)`}
      />

      <Modal
        isOpen={singleDeleteOpen}
        onClose={() => {
          setSingleDeleteOpen(false);
          setPendingDelete(null);
        }}
        title="Confirm data source deletion"
        description="Are you sure you want to delete this data source? This action cannot be undone."
        size="md"
      >
        <VStack gap={4}>
          <InfoBox label="Data source name" value={pendingDelete?.name ?? 'sample-datasource'} />
          <div className="flex gap-2 items-start p-3 rounded-[var(--radius-lg)] bg-[var(--color-state-danger-bg)]">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
            />
            <p className="text-body-sm text-[var(--color-text-default)]">
              Deleting a data source is a permanent action and cannot be undone.
            </p>
          </div>
          <HStack gap={2} justify="end" className="w-full pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setSingleDeleteOpen(false);
                setPendingDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={confirmSingleDelete}>
              Delete
            </Button>
          </HStack>
        </VStack>
      </Modal>
    </PageShell>
  );
}

export default DatasourcePage;
