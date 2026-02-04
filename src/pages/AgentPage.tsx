import { useState, useMemo } from 'react';
import {
  Button,
  Tooltip,
  Table,
  SearchInput,
  Pagination,
  ListToolbar,
  StatusIndicator,
  ContextMenu,
  SNBMenuItem,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { AgentPageLayout } from '@/layouts';
import {
  IconDatabase,
  IconPuzzle,
  IconSettings,
  IconTrash,
  IconStar,
  IconStarFilled,
  IconCode,
  IconDotsVertical,
  IconTarget,
  IconPencil,
  IconMessages,
  IconRobotFace,
  IconArrowLeft,
} from '@tabler/icons-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AgentLogo from '@/assets/icons/agent-logo.svg';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectSelector } from '@/components/ProjectSelector';

/* ----------------------------------------
   Status Card Component
   ---------------------------------------- */
interface StatusCardProps {
  label: string;
  count: number;
  status: 'active' | 'inactive' | 'draft';
}

function StatusCard({ label, count, status }: StatusCardProps) {
  let bgColor = 'bg-[var(--color-surface-subtle,#f8fafc)]';
  let iconBg = 'bg-[var(--color-text-muted,#475569)]';

  if (status === 'active') {
    bgColor = 'bg-[var(--color-state-success-bg,#f0fdf4)]';
    iconBg = 'bg-[var(--color-success,#4ade80)]';
  }

  const getStatusIcon = () => {
    if (status === 'active') {
      return <IconTarget size={12} stroke={1} className="text-white" />;
    } else if (status === 'inactive') {
      return (
        <div className="flex flex-col gap-0.5 items-center justify-center">
          <div className="h-1 w-2 bg-white rounded-sm" />
          <div className="h-1 w-2 bg-white rounded-sm" />
        </div>
      );
    } else if (status === 'draft') {
      return <IconPencil size={12} stroke={1} className="text-white" />;
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
   Agent Sidebar Component
   ---------------------------------------- */
export function AgentSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects, selectedProjectId, setSelectedProjectId } = useProject();

  // Helper to check if path is active
  const isActive = (paths: string[]) => {
    return paths.some((path) =>
      path.endsWith('*')
        ? location.pathname.startsWith(path.slice(0, -1))
        : location.pathname === path
    );
  };

  return (
    <nav className="fixed left-0 top-0 w-[60px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col items-center pb-3 z-50">
      {/* Logo - Home/Dashboard link */}
      <Link
        to="/agent"
        className="border-b border-[var(--color-border-default)] flex h-[36px] items-center justify-center w-full hover:bg-[var(--color-surface-muted)] transition-colors shrink-0"
      >
        <img src={AgentLogo} alt="Agent" className="h-6 w-6" />
      </Link>

      {/* Sidebar Container */}
      <div className="flex flex-col flex-1 items-center justify-between pt-1.5 px-2 w-full min-h-0">
        {/* Top Section - Project & Navigation */}
        <div className="flex flex-col items-center w-full">
          {/* Back to All Services */}
          <div className="flex items-center justify-center py-1.5">
            <Tooltip content="All Services" position="right">
              <Link
                to="/"
                className="size-[38px] rounded-lg bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-center shrink-0"
              >
                <IconArrowLeft
                  size={20}
                  stroke={1.5}
                  className="text-[var(--color-text-default)]"
                />
              </Link>
            </Tooltip>
          </div>

          {/* Project Selector */}
          <div className="flex items-center justify-center py-1.5">
            <ProjectSelector
              projects={projects}
              selectedProjectId={selectedProjectId}
              onProjectSelect={setSelectedProjectId}
              variant="sidebar-icon"
            />
          </div>

          {/* Divider */}
          <div className="w-9 h-px bg-[var(--color-border-default)] my-1.5" />

          {/* Navigation Items */}
          <div className="flex flex-col gap-2 items-center">
            {/* Chat */}
            <Tooltip content="Chat" position="right">
              <SNBMenuItem
                isSelected={isActive(['/chat', '/chat/*'])}
                onClick={() => navigate('/chat')}
              >
                <IconMessages size={20} stroke={1.5} />
              </SNBMenuItem>
            </Tooltip>

            {/* Agent */}
            <Tooltip content="Agent" position="right">
              <SNBMenuItem
                isSelected={isActive([
                  '/agent/list',
                  '/agent/list/*',
                  '/agent/create',
                  '/agent/create/*',
                ])}
                onClick={() => navigate('/agent/list')}
              >
                <IconRobotFace size={20} stroke={1.5} />
              </SNBMenuItem>
            </Tooltip>

            {/* Data sources */}
            <Tooltip content="Data sources" position="right">
              <SNBMenuItem
                isSelected={isActive(['/agent/storage', '/agent/storage/*'])}
                onClick={() => navigate('/agent/storage')}
              >
                <IconDatabase size={20} stroke={1.5} />
              </SNBMenuItem>
            </Tooltip>

            {/* MCP Tools */}
            <Tooltip content="MCP tools" position="right">
              <SNBMenuItem
                isSelected={isActive(['/mcp-tools', '/mcp-tools/*'])}
                onClick={() => navigate('/mcp-tools')}
              >
                <IconPuzzle size={20} stroke={1.5} />
              </SNBMenuItem>
            </Tooltip>
          </div>
        </div>

        {/* Bottom Section - Settings */}
        <div className="flex items-center justify-center">
          <Tooltip content="Settings" position="right">
            <SNBMenuItem onClick={() => navigate('/settings')}>
              <IconSettings size={20} stroke={1.5} />
            </SNBMenuItem>
          </Tooltip>
        </div>
      </div>
    </nav>
  );
}

/* ----------------------------------------
   Agent Table Row Data Type
   ---------------------------------------- */
interface AgentRow {
  id: string;
  favorite: boolean;
  status: 'active' | 'inactive' | 'draft';
  name: string;
  model: string;
  modelProvider: string;
  chats: string;
  updatedAt: string;
  createdAt: string;
}

/* ----------------------------------------
   Main AgentPage Component
   ---------------------------------------- */
export function AgentPage() {
  const navigate = useNavigate();
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data
  const agents: AgentRow[] = [
    {
      id: '1',
      favorite: false,
      status: 'draft',
      name: 'lable',
      model: 'claude-sonnet-4-5',
      modelProvider: 'anthropic',
      chats: '-',
      updatedAt: 'Nov 11, 2025, 2:51 PM',
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
    {
      id: '2',
      favorite: false,
      status: 'active',
      name: 'lable',
      model: 'claude-sonnet-4-5',
      modelProvider: 'anthropic',
      chats: '5',
      updatedAt: 'Nov 11, 2025, 2:51 PM',
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
    {
      id: '3',
      favorite: true,
      status: 'inactive',
      name: 'lable',
      model: 'claude-sonnet-4-5',
      modelProvider: 'anthropic',
      chats: '-',
      updatedAt: 'Nov 11, 2025, 2:51 PM',
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
  ];

  // Status mapping for StatusIndicator
  const statusMap: Record<AgentRow['status'], 'active' | 'shutoff' | 'pending'> = {
    active: 'active',
    inactive: 'shutoff',
    draft: 'pending',
  };

  // Filter agents by search
  const filteredAgents = useMemo(() => {
    if (!searchQuery) return agents;

    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.modelProvider.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [agents, searchQuery]);

  const totalPages = Math.ceil(filteredAgents.length / rowsPerPage);
  const paginatedAgents = useMemo(() => {
    return filteredAgents.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredAgents, currentPage, rowsPerPage]);

  // Table columns definition
  const columns: TableColumn<AgentRow>[] = [
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
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string) => (
        <span
          className="text-[var(--color-action-primary)] font-medium hover:underline cursor-pointer truncate block"
          title={value}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'model',
      label: 'Model',
      flex: 1,
      minWidth: columnMinWidths.model,
      sortable: true,
    },
    {
      key: 'modelProvider',
      label: 'Model provider',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
    },
    {
      key: 'chats',
      label: 'Chats',
      flex: 1,
      minWidth: columnMinWidths.count,
      sortable: true,
    },
    {
      key: 'updatedAt',
      label: 'Updated at',
      flex: 1,
      minWidth: columnMinWidths.updatedAt,
      sortable: true,
      render: (value: string) => <span className="whitespace-nowrap">{value}</span>,
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
      width: fixedColumns.actionWide,
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'view-code',
            label: 'View code',
            onClick: () => console.log('View code:', row.id),
          },
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
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
              <IconCode size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
            </button>
            <ContextMenu items={menuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
                <IconDotsVertical
                  size={16}
                  stroke={1.5}
                  className="text-[var(--color-text-muted)]"
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
      title="Agent"
      breadcrumbItems={[{ label: 'Agent' }]}
      headerActions={
        <Button variant="primary" size="md" onClick={() => navigate('/agent/create')}>
          Create agent
        </Button>
      }
    >
      {/* Status Cards */}
      <div className="flex gap-2 items-center relative shrink-0 w-full">
        <StatusCard label="Active" count={5} status="active" />
        <StatusCard label="Inactive" count={5} status="inactive" />
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
                  placeholder="Search agent by attributes"
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
                disabled={selectedAgents.length === 0}
              >
                Delete
              </Button>
            </ListToolbar.Actions>
          }
        />

        {/* Pagination */}
        {filteredAgents.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredAgents.length}
            selectedCount={selectedAgents.length}
          />
        )}

        {/* Table */}
        <Table<AgentRow>
          columns={columns}
          data={paginatedAgents}
          rowKey="id"
          emptyMessage="No agents found"
          selectable
          selectedKeys={selectedAgents}
          onSelectionChange={setSelectedAgents}
          onRowClick={(row) => navigate(`/agent/list/${row.id}`)}
        />
      </div>
    </AgentPageLayout>
  );
}

export default AgentPage;
