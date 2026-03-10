import { useState, useMemo } from 'react';
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
  PageHeader,
  VStack,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import {
  IconTrash,
  IconStar,
  IconStarFilled,
  IconCode,
  IconDotsVertical,
  IconTarget,
  IconPencil,
  IconPalette,
  IconBell,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { AgentSidebar } from '@/components/AgentSidebar';
import { useTabs } from '@/contexts/TabContext';

/* ----------------------------------------
   Status Card Component
   ---------------------------------------- */
interface StatusCardProps {
  label: string;
  count: number;
  status: 'active' | 'inactive' | 'draft';
}

function StatusCard({ label, count, status }: StatusCardProps) {
  let bgColor = 'bg-[var(--color-surface-subtle)]';
  let iconBg = 'bg-[var(--color-text-muted)]';

  if (status === 'active') {
    bgColor = 'bg-[var(--color-state-success-bg)]';
    iconBg = 'bg-[var(--color-success)]';
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
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
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
      render: (_, row) => <StatusIndicator layout="icon-only" status={statusMap[row.status]} />,
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
            <ContextMenu items={menuItems} trigger="click" align="right">
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
            <Breadcrumb items={[{ label: 'Home', href: '/agent' }, { label: 'Agent' }]} />
          }
          actions={
            <>
              <TopBarAction
                icon={<IconPalette size={16} stroke={1} />}
                onClick={() => navigate('/design-system')}
                aria-label="Design System"
              />
              <TopBarAction
                icon={<IconBell size={16} stroke={1} />}
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
          title="Agent"
          actions={
            <Button variant="primary" size="md" onClick={() => navigate('/agent/create')}>
              Create agent
            </Button>
          }
        />

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
      </VStack>
    </PageShell>
  );
}

export default AgentPage;

// Re-export AgentSidebar for backward compatibility
export { AgentSidebar } from '@/components/AgentSidebar';
