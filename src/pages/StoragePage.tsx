import { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Tooltip,
  Table,
  SearchInput,
  Pagination,
  ListToolbar,
  StatusIndicator,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
} from '@/design-system';
import { AgentPageLayout } from '@/layouts';
import {
  IconMessage,
  IconRobot,
  IconDatabase,
  IconPuzzle,
  IconSettings,
  IconTrash,
  IconStar,
  IconStarFilled,
  IconPencil,
  IconDotsCircleHorizontal,
  IconAlertTriangle,
  IconRefresh,
  IconLoader2,
  IconTarget,
  IconHome,
} from '@tabler/icons-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThakiSymbol from '@/assets/thakiSymbol.svg';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectSelector } from '@/components/ProjectSelector';

/* ----------------------------------------
   Status Card Component
   ---------------------------------------- */
interface StatusCardProps {
  label: string;
  count: number;
  status: 'completed' | 'error' | 'processing' | 'pending' | 'draft';
}

function StatusCard({ label, count, status }: StatusCardProps) {
  let bgColor = 'bg-[var(--color-surface-subtle,#f8fafc)]';
  let iconBg = 'bg-[var(--color-text-muted,#475569)]';

  if (status === 'completed') {
    bgColor = 'bg-[var(--color-state-success-bg,#f0fdf4)]';
    iconBg = 'bg-[var(--color-success,#4ade80)]';
  } else if (status === 'error') {
    bgColor = 'bg-[var(--color-state-danger-bg,#fef2f2)]';
    iconBg = 'bg-[var(--color-danger,#ef4444)]';
  } else if (status === 'processing') {
    bgColor = 'bg-[var(--color-info-weak-bg,#eff6ff)]';
    iconBg = 'bg-[var(--color-info,#3b82f6)]';
  }

  const getStatusIcon = () => {
    if (status === 'completed') {
      return <IconTarget size={12} stroke={1} className="text-white" />;
    } else if (status === 'error') {
      return <IconAlertTriangle size={12} stroke={1} className="text-white" />;
    } else if (status === 'processing') {
      return <IconLoader2 size={12} stroke={1} className="text-white animate-spin" />;
    } else if (status === 'pending') {
      return <IconRefresh size={12} stroke={1} className="text-white" />;
    } else if (status === 'draft') {
      return <IconPencil size={12} stroke={1} className="text-white" />;
    }
  };

  return (
    <div
      className={`${bgColor} flex flex-[1_0_0] items-center justify-between min-h-px min-w-px px-4 py-3 relative rounded-lg shrink-0`}
    >
      <div className="flex flex-col gap-1.5 items-start leading-4 not-italic relative shrink-0">
        <p className="font-medium text-[length:var(--font-size-11)] leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
          {label}
        </p>
        <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
          {count}
        </p>
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
   Agent Sidebar Component (Reused)
   ---------------------------------------- */
export function AgentSidebar() {
  const { isDark } = useDarkMode();
  const location = useLocation();
  const { projects, selectedProjectId, setSelectedProjectId } = useProject();

  return (
    <nav className="fixed left-0 top-0 w-[62px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col items-center z-50">
      {/* Logo */}
      <Link
        to="/"
        className="border-b border-[var(--color-border-default)] flex h-[36px] items-center justify-center w-full hover:bg-[var(--color-surface-muted)] transition-colors shrink-0"
      >
        <img src={ThakiSymbol} alt="THAKI" className="h-[18px] w-[18px]" />
      </Link>

      {/* Menu Items - Project Selector and Navigation */}
      <div className="flex flex-col gap-2 items-center px-2 pt-3 flex-1 min-h-0 w-full">
        {/* Project Selector Button */}
        <div className="w-full flex items-center justify-center shrink-0">
          <ProjectSelector
            projects={projects}
            selectedProjectId={selectedProjectId}
            onProjectSelect={setSelectedProjectId}
            variant="sidebar-icon"
          />
        </div>

        {/* Home */}
        <Tooltip content="Home" position="right">
          <Link
            to="/agent"
            className={`flex items-center justify-center size-[38px] rounded-lg transition-colors shrink-0 ${
              location.pathname === '/agent'
                ? 'bg-[var(--color-info-weak-bg,#eff6ff)]'
                : 'bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]'
            }`}
          >
            <IconHome
              size={20}
              stroke={1.5}
              className={
                location.pathname === '/agent'
                  ? 'text-[var(--color-action-primary)]'
                  : 'text-[var(--color-text-muted)]'
              }
            />
          </Link>
        </Tooltip>

        {/* Chat */}
        <Tooltip content="Chat" position="right">
          <Link
            to="/chat"
            className={`flex items-center justify-center size-[38px] rounded-lg transition-colors shrink-0 ${
              location.pathname === '/chat'
                ? 'bg-[var(--color-info-weak-bg,#eff6ff)]'
                : 'bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]'
            }`}
          >
            <IconMessage
              size={20}
              stroke={1.5}
              className={
                location.pathname === '/chat'
                  ? 'text-[var(--color-action-primary)]'
                  : 'text-[var(--color-text-muted)]'
              }
            />
          </Link>
        </Tooltip>

        {/* Robot */}
        <Tooltip content="Agent" position="right">
          <Link
            to="/agent/list"
            className={`flex items-center justify-center size-[38px] rounded-lg transition-colors shrink-0 ${
              location.pathname === '/agent/list' ||
              location.pathname.startsWith('/agent/list') ||
              location.pathname.startsWith('/agent/create')
                ? 'bg-[var(--color-info-weak-bg,#eff6ff)]'
                : 'bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]'
            }`}
          >
            <IconRobot
              size={20}
              stroke={1.5}
              className={
                location.pathname === '/agent/list' ||
                location.pathname.startsWith('/agent/list') ||
                location.pathname.startsWith('/agent/create')
                  ? 'text-[var(--color-action-primary)]'
                  : 'text-[var(--color-text-muted)]'
              }
            />
          </Link>
        </Tooltip>

        {/* Data sources - Coming soon */}
        <Tooltip content="Data sources (Coming soon)" position="right">
          <button
            type="button"
            disabled
            className="flex items-center justify-center size-[38px] rounded-lg transition-colors shrink-0 bg-[var(--color-surface-default)] cursor-not-allowed opacity-50"
          >
            <IconDatabase size={20} stroke={1.5} className="text-[var(--color-text-disabled)]" />
          </button>
        </Tooltip>

        {/* MCP tools */}
        <Tooltip content="MCP tools" position="right">
          <Link
            to="/mcp-tools"
            className={`flex items-center justify-center size-[38px] rounded-lg transition-colors shrink-0 ${
              location.pathname === '/mcp-tools'
                ? 'bg-[var(--color-info-weak-bg,#eff6ff)]'
                : 'bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]'
            }`}
          >
            <IconPuzzle
              size={20}
              stroke={1.5}
              className={
                location.pathname === '/mcp-tools'
                  ? 'text-[var(--color-action-primary)]'
                  : 'text-[var(--color-text-muted)]'
              }
            />
          </Link>
        </Tooltip>
      </div>

      {/* Settings (Bottom) */}
      <div className="px-2 pb-3 w-full flex items-center justify-center shrink-0">
        <Tooltip content="Settings" position="right">
          <Link
            to="/agent"
            className="flex items-center justify-center size-[38px] rounded-lg bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)] transition-colors shrink-0"
          >
            <IconSettings size={20} stroke={1.5} className="text-[var(--color-text-default)]" />
          </Link>
        </Tooltip>
      </div>
    </nav>
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
          <IconStarFilled size={16} className="text-yellow-500" />
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
      render: (_, row) => <StatusIndicator status={statusMap[row.status]} layout="icon-only" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      sortable: true,
    },
    {
      key: 'documents',
      label: 'Documents',
      flex: 1,
      sortable: false,
      render: (_, row) => {
        if (row.documentsProgress) {
          const { current, total, percentage, hasError } = row.documentsProgress;
          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[12px]">
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
        return <span className="text-[var(--color-text-default)]">{row.documents}</span>;
      },
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      sortable: true,
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
            <ContextMenu items={menuItems} trigger="click">
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
    <AgentPageLayout
      title="Data sources"
      breadcrumbItems={[{ label: 'Data sources' }]}
      headerActions={
        <Button variant="primary" size="md" onClick={() => {}}>
          Create data source
        </Button>
      }
    >
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
    </AgentPageLayout>
  );
}

export default StoragePage;
