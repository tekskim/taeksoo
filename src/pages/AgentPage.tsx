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
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { AgentPageLayout } from '@/layouts';
import {
  IconMessage,
  IconRobot,
  IconDatabase,
  IconPuzzle,
  IconSettings,
  IconPalette,
  IconBell,
  IconSearch,
  IconTrash,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconDots,
  IconStar,
  IconStarFilled,
  IconCode,
  IconDotsVertical,
  IconDotsCircleHorizontal,
  IconHome,
  IconTarget,
  IconPencil,
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
      return (
        <IconTarget size={12} stroke={1} className="text-white" />
      );
    } else if (status === 'inactive') {
      return (
        <div className="flex flex-col gap-0.5 items-center justify-center">
          <div className="h-1 w-2 bg-white rounded-sm" />
          <div className="h-1 w-2 bg-white rounded-sm" />
        </div>
      );
    } else if (status === 'draft') {
      return (
        <IconPencil size={12} stroke={1} className="text-white" />
      );
    }
  };

  return (
    <div className={`${bgColor} flex flex-[1_0_0] items-center justify-between min-h-px min-w-px px-4 py-3 relative rounded-lg shrink-0`}>
      <div className="flex flex-col gap-1.5 items-start leading-4 not-italic relative shrink-0">
        <p className="font-medium text-[length:var(--font-size-11)] leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
          {label}
        </p>
        <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
          {count}
        </p>
      </div>
      <div className={`${iconBg} flex gap-0 items-center justify-center p-1 relative rounded-2xl shrink-0 size-6`}>
        {getStatusIcon()}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Agent Sidebar Component
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
        <img 
          src={ThakiSymbol} 
          alt="THAKI" 
          className="h-[18px] w-[18px]"
        />
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
              className={location.pathname === '/agent' ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-muted)]'} 
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
              className={location.pathname === '/chat' ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-muted)]'} 
            />
          </Link>
        </Tooltip>

        {/* Robot */}
        <Tooltip content="Agent" position="right">
          <Link
            to="/agent/list"
            className={`flex items-center justify-center size-[38px] rounded-lg transition-colors shrink-0 ${
              location.pathname === '/agent/list' || location.pathname.startsWith('/agent/list') || location.pathname.startsWith('/agent/create')
                ? 'bg-[var(--color-info-weak-bg,#eff6ff)]' 
                : 'bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]'
            }`}
          >
            <IconRobot 
              size={20} 
              stroke={1.5} 
              className={location.pathname === '/agent/list' || location.pathname.startsWith('/agent/list') || location.pathname.startsWith('/agent/create') ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-muted)]'} 
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
            <IconDatabase 
              size={20} 
              stroke={1.5} 
              className="text-[var(--color-text-disabled)]"
            />
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
              className={location.pathname === '/mcp-tools' ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-muted)]'} 
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
    'active': 'active',
    'inactive': 'shutoff',
    'draft': 'pending',
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
      width: '48px',
      align: 'center',
      sortable: false,
      render: (_, row) => (
        row.favorite ? (
          <IconStarFilled size={16} className="text-yellow-500" />
        ) : (
          <IconStar size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        )
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <StatusIndicator status={statusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
    },
    {
      key: 'model',
      label: 'Model',
      flex: 1,
      sortable: true,
    },
    {
      key: 'modelProvider',
      label: 'Model provider',
      flex: 1,
      sortable: true,
    },
    {
      key: 'chats',
      label: 'Chats',
      flex: 1,
      sortable: true,
    },
    {
      key: 'updatedAt',
      label: 'Updated at',
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
      width: '72px',
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'view-code',
            label: 'View Code',
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
          <div className="flex gap-1 items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
              <IconCode size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
            </button>
            <ContextMenu items={menuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
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
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/agent/create')}
        >
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
              <div className="w-[280px]">
                <SearchInput
                  placeholder="Find agent with filters"
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
        />
      </div>
    </AgentPageLayout>
  );
}

export default AgentPage;
