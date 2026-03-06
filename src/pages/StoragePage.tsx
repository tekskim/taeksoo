import { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Table,
  SearchInput,
  Pagination,
  ListToolbar,
  StatusIndicator,
  ContextMenu,
  PageShell,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  VStack,
  PageHeader,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { AgentSidebar } from '@/components/AgentSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconTrash,
  IconStar,
  IconStarFilled,
  IconPencil,
  IconDotsCircleHorizontal,
  IconAlertTriangle,
  IconRefresh,
  IconLoader2,
  IconTarget,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Status Card Component
   ---------------------------------------- */
interface StatusCardProps {
  label: string;
  count: number;
  status: 'completed' | 'error' | 'processing' | 'pending' | 'draft';
}

function StatusCard({ label, count, status }: StatusCardProps) {
  let bgColor = 'bg-[var(--color-surface-subtle)]';
  let iconBg = 'bg-[var(--color-text-muted)]';

  if (status === 'completed') {
    bgColor = 'bg-[var(--color-state-success-bg)]';
    iconBg = 'bg-[var(--color-success)]';
  } else if (status === 'error') {
    bgColor = 'bg-[var(--color-state-danger-bg)]';
    iconBg = 'bg-[var(--color-danger)]';
  } else if (status === 'processing') {
    bgColor = 'bg-[var(--color-info-weak-bg)]';
    iconBg = 'bg-[var(--color-info)]';
  }

  const getStatusIcon = () => {
    if (status === 'completed') {
      return <IconTarget size={16} stroke={1} className="text-white" />;
    } else if (status === 'error') {
      return <IconAlertTriangle size={16} stroke={1} className="text-white" />;
    } else if (status === 'processing') {
      return <IconLoader2 size={16} stroke={1} className="text-white animate-spin" />;
    } else if (status === 'pending') {
      return <IconRefresh size={12} stroke={1} className="text-white" />;
    } else if (status === 'draft') {
      return <IconPencil size={16} stroke={1} className="text-white" />;
    }
  };

  return (
    <div
      className={`${bgColor} flex flex-[1_0_0] items-center justify-between min-h-px min-w-px px-4 py-3 relative rounded-lg shrink-0`}
    >
      <div className="flex flex-col gap-1.5 items-start leading-4 not-italic relative shrink-0">
        <p className="text-label-sm text-[var(--color-text-subtle)]">{label}</p>
        <p className="text-body-md text-[var(--color-text-default)]">{count}</p>
      </div>
      <div
        className={`${iconBg} flex gap-0 items-center justify-center p-1 relative rounded-2xl shrink-0 size-6`}
      >
        {getStatusIcon()}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Data source Table Row Data Type
   ---------------------------------------- */
interface DataSourceRow {
  id: string;
  favorite: boolean;
  status: 'completed' | 'error' | 'processing' | 'pending' | 'draft';
  name: string;
  type: string;
  documents: string;
  documentsProgress?: { current: number; total: number; percentage: number; hasError?: boolean };
  size: string;
  createdAt: string;
}

/* ----------------------------------------
   Main StoragePage Component
   ---------------------------------------- */
export function StoragePage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Set page title
  useEffect(() => {
    document.title = 'Data sources - THAKI Cloud';
    return () => {
      document.title = 'THAKI Cloud';
    };
  }, []);

  // Mock data
  const dataSources: DataSourceRow[] = [
    {
      id: '1',
      favorite: false,
      status: 'draft',
      name: 'lable',
      type: 'File',
      documents: '-',
      size: '-',
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
    {
      id: '2',
      favorite: false,
      status: 'pending',
      name: 'lable',
      type: 'File',
      documents: '-',
      size: '-',
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
    {
      id: '3',
      favorite: false,
      status: 'completed',
      name: 'lable',
      type: 'File',
      documents: '7',
      size: '60 MB',
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
    {
      id: '4',
      favorite: false,
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
      favorite: false,
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
      favorite: false,
      status: 'processing',
      name: 'lable',
      type: 'File',
      documents: '(75%)',
      documentsProgress: { current: 7, total: 10, percentage: 75 },
      size: '60 MB',
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
  ];

  // Status mapping for StatusIndicator
  const statusMap: Record<DataSourceRow['status'], 'active' | 'shutoff' | 'pending'> = {
    completed: 'active',
    error: 'shutoff',
    processing: 'pending',
    pending: 'pending',
    draft: 'pending',
  };

  // Filter data sources by search
  const filteredDataSources = useMemo(() => {
    if (!searchQuery) return dataSources;

    return dataSources.filter(
      (ds) =>
        ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ds.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dataSources, searchQuery]);

  const totalPages = Math.ceil(filteredDataSources.length / rowsPerPage);
  const paginatedDataSources = useMemo(() => {
    return filteredDataSources.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredDataSources, currentPage, rowsPerPage]);

  // Table columns definition
  const columns: TableColumn<DataSourceRow>[] = [
    {
      key: 'favorite',
      label: '',
      width: fixedColumns.favorite,
      align: 'center',
      sortable: false,
      render: (_, row) =>
        row.favorite ? (
          <IconStarFilled size={16} className="text-[var(--primitive-color-yellow400)]" />
        ) : (
          <IconStar size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        ),
    },
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (_, row) => <StatusIndicator status={statusMap[row.status]} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block" title={value}>
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
    },
    {
      key: 'documents',
      label: 'Documents',
      flex: 1,
      minWidth: columnMinWidths.documents,
      sortable: false,
      render: (_, row) => {
        if (row.documentsProgress) {
          const { current, total, percentage, hasError } = row.documentsProgress;
          return (
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-1 text-body-md whitespace-nowrap">
                <span className="text-[var(--color-text-default)]">
                  {current}/{total}
                </span>
                <span className="text-[var(--color-text-subtle)]">({percentage}%)</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--color-surface-subtle)] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    hasError ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-action-primary)]'
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
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => console.log('Delete:', row.id),
          },
        ];

        return (
          <div
            className="flex gap-1 items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
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

  return (
    <PageShell
      sidebar={<AgentSidebar />}
      sidebarWidth={60}
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
          showSidebarToggle={false}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb items={[{ label: 'Home', href: '/agent' }, { label: 'Data Sources' }]} />
          }
          actions={
            <>
              <TopBarAction
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="m12 1 0 2m0 18 0 2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12l2 0m18 0 2 0M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                }
                onClick={() => navigate('/design-system')}
                aria-label="Design System"
              />
              <TopBarAction
                icon={<IconAlertTriangle size={16} stroke={1} />}
                aria-label="Notifications"
                badge={true}
              />
            </>
          }
        />
      }
    >
      <VStack gap={6}>
        <PageHeader
          title="Data sources"
          actions={
            <Button variant="primary" size="md" onClick={() => {}}>
              Create data source
            </Button>
          }
        />

        {/* Status Cards */}
        <div className="flex gap-2 items-center relative shrink-0 w-full">
          <StatusCard label="Completed" count={5} status="completed" />
          <StatusCard label="Error" count={0} status="error" />
          <StatusCard label="Processing" count={5} status="processing" />
          <StatusCard label="Pending" count={5} status="pending" />
          <StatusCard label="Draft" count={5} status="draft" />
        </div>

        {/* List Toolbar, Pagination, Table - Grouped with 12px gap */}
        <div className="flex flex-col gap-3 w-full">
          {/* List Toolbar */}
          <ListToolbar
            primaryActions={
              <ListToolbar.Actions>
                <div className="w-[var(--search-input-width)]">
                  <SearchInput
                    placeholder="Search data sources by attributes"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClear={() => setSearchQuery('')}
                    size="sm"
                    fullWidth
                  />
                </div>
              </ListToolbar.Actions>
            }
            bulkActions={
              <ListToolbar.Actions>
                <Button
                  variant="muted"
                  size="sm"
                  leftIcon={<IconTrash size={12} />}
                  disabled={selectedDataSources.length === 0}
                >
                  Delete
                </Button>
              </ListToolbar.Actions>
            }
          />

          {/* Pagination */}
          {filteredDataSources.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredDataSources.length}
              selectedCount={selectedDataSources.length}
            />
          )}

          {/* Table */}
          <Table<DataSourceRow>
            columns={columns}
            data={paginatedDataSources}
            rowKey="id"
            emptyMessage="No data sources found"
            selectable
            selectedKeys={selectedDataSources}
            onSelectionChange={setSelectedDataSources}
          />
        </div>
      </VStack>
    </PageShell>
  );
}

export default StoragePage;
