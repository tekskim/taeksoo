import { useState, useMemo } from 'react';
import { Button } from '@thaki/shared/components/Button';
import { Table, SelectableTable } from '@thaki/shared/components/Table';
import type { TableColumn as SharedTableColumn } from '@thaki/shared/components/Table/Table.types';
import { Pagination } from '@thaki/shared/components/Pagination';
import { StatusIndicator } from '@thaki/shared/components/StatusIndicator';
import { ContextMenu } from '@thaki/shared/components/ContextMenu';
import { TabBar } from '@thaki/shared/components/TabBar';
import { ToolBar } from '@thaki/shared/components/ToolBar';
import Layout from '@thaki/shared/components/Layout';
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
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';

const FIXED_WIDTHS = {
  favorite: '40px',
  status: '64px',
  actions: '80px',
} as const;

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage] = useState(10);

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

  const statusVariantMap: Record<AgentRow['status'], 'active' | 'shutoff' | 'pending'> = {
    active: 'active',
    inactive: 'shutoff',
    draft: 'pending',
  };

  const filteredAgents = useMemo(() => {
    if (!searchQuery) return agents;
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.modelProvider.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [agents, searchQuery]);

  const paginatedAgents = useMemo(() => {
    return filteredAgents.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredAgents, currentPage, rowsPerPage]);

  const sharedColumns: SharedTableColumn[] = [
    { key: 'favorite', header: '', width: FIXED_WIDTHS.favorite, align: 'center' },
    { key: 'status', header: 'Status', width: FIXED_WIDTHS.status, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'model', header: 'Model', sortable: true },
    { key: 'modelProvider', header: 'Model provider', sortable: true },
    { key: 'chats', header: 'Chats', sortable: true },
    { key: 'updatedAt', header: 'Updated at', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: FIXED_WIDTHS.actions, align: 'center' },
  ];

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, title: tab.label }))}
          activeTab={activeTabId}
          onTabClick={selectTab}
          onTabClose={closeTab}
          onAddTab={addNewTab}
          onTabReorder={moveTab}
          showWindowControls={true}
        />
      }
      topBar={
        <ToolBar
          breadcrumbItems={[{ label: 'Home', path: '/agent' }, { label: 'Agent' }]}
          navigation={{
            canGoBack: true,
            canGoForward: true,
            onGoBack: () => window.history.back(),
            onGoForward: () => window.history.forward(),
          }}
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          langButton={null}
          rightActions={
            <>
              <button
                type="button"
                className="inline-flex items-center justify-center size-7 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] transition-colors"
                onClick={() => navigate('/design-system')}
                aria-label="Design System"
              >
                <IconPalette size={16} stroke={1} />
              </button>
              <div className="relative inline-flex">
                <button
                  type="button"
                  className="inline-flex items-center justify-center size-7 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] transition-colors"
                  aria-label="Notifications"
                >
                  <IconBell size={16} stroke={1} />
                </button>
                <span className="absolute top-1 right-1 size-[6px] bg-[var(--color-state-danger)] rounded-full" />
              </div>
            </>
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <Layout.VStack className="gap-3">
        {/* Page Header → Layout.HStack composition */}
        <Layout.HStack align="center" justify="between" className="w-full min-h-8">
          <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">Agent</h1>
          <Button variant="primary" size="md" onClick={() => navigate('/agent/create')}>
            Create agent
          </Button>
        </Layout.HStack>

        {/* Status Cards */}
        <Layout.HStack gap="sm" align="center" className="w-full">
          <StatusCard label="Active" count={5} status="active" />
          <StatusCard label="Inactive" count={5} status="inactive" />
          <StatusCard label="Draft" count={5} status="draft" />
        </Layout.HStack>

        {/* List: Toolbar + Pagination + Table */}
        <Layout.VStack className="gap-3 w-full">
          {/* Toolbar → Layout.HStack composition */}
          <Layout.HStack align="center" gap="sm">
            {/* Search Input → thaki-shared Input tokens composition */}
            <div className="w-[var(--search-input-width)]">
              <div className="relative block w-full">
                <input
                  type="search"
                  className="w-full border rounded-md font-sans font-normal text-12 bg-[var(--component-input-color-bg)] border-[var(--component-input-color-border)] [color:var(--component-input-color-text)] placeholder:text-[var(--component-input-color-placeholder)] placeholder:opacity-100 outline-none transition-[border-color,background-color,box-shadow] duration-normal ease-in-out hover:border-[var(--component-input-color-borderFocus)] hover:bg-[var(--component-input-color-bgHover)] focus:border-[var(--component-input-color-borderFocus)] focus:bg-[var(--component-input-color-bg)] h-7 py-1.5 pl-2 pr-8"
                  placeholder="Search agent by attributes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search"
                />
                {searchQuery && (
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-7 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <IconX size={12} strokeWidth={2} />
                  </button>
                )}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] pointer-events-none">
                  <IconSearch size={12} strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Bulk actions */}
            <Button
              variant="secondary"
              appearance="ghost"
              size="sm"
              disabled={selectedAgents.length === 0}
            >
              <IconTrash size={12} />
              Delete
            </Button>
          </Layout.HStack>

          {/* Pagination */}
          <Pagination
            currentAt={currentPage}
            totalCount={filteredAgents.length}
            size={rowsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
            selectedCount={selectedAgents.length}
          />

          {/* Table */}
          <SelectableTable
            columns={sharedColumns}
            rows={paginatedAgents as unknown as Record<string, unknown>[]}
            selectionType="checkbox"
            selectedRows={selectedAgents}
            onRowSelectionChange={(ids) => setSelectedAgents(ids as string[])}
            getRowId={(row) => (row as unknown as AgentRow).id}
            selectOnRowClick={false}
            onClickRow={(row) => navigate(`/agent/list/${(row as unknown as AgentRow).id}`)}
            emptyUI={
              <span className="text-body-md text-[var(--color-text-subtle)]">No agents found</span>
            }
          >
            {paginatedAgents.map((row) => (
              <Table.Tr key={row.id} rowData={row as unknown as Record<string, unknown>}>
                <Table.Td
                  rowData={row as unknown as Record<string, unknown>}
                  column={sharedColumns[0]}
                >
                  {row.favorite ? (
                    <IconStarFilled size={16} className="text-[var(--primitive-color-yellow400)]" />
                  ) : (
                    <IconStar size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
                  )}
                </Table.Td>
                <Table.Td
                  rowData={row as unknown as Record<string, unknown>}
                  column={sharedColumns[1]}
                >
                  <StatusIndicator layout="iconOnly" variant={statusVariantMap[row.status]} />
                </Table.Td>
                <Table.Td
                  rowData={row as unknown as Record<string, unknown>}
                  column={sharedColumns[2]}
                >
                  <span
                    className="text-[var(--color-action-primary)] font-medium hover:underline cursor-pointer truncate block"
                    title={row.name}
                  >
                    {row.name}
                  </span>
                </Table.Td>
                <Table.Td
                  rowData={row as unknown as Record<string, unknown>}
                  column={sharedColumns[3]}
                >
                  {row.model}
                </Table.Td>
                <Table.Td
                  rowData={row as unknown as Record<string, unknown>}
                  column={sharedColumns[4]}
                >
                  {row.modelProvider}
                </Table.Td>
                <Table.Td
                  rowData={row as unknown as Record<string, unknown>}
                  column={sharedColumns[5]}
                >
                  {row.chats}
                </Table.Td>
                <Table.Td
                  rowData={row as unknown as Record<string, unknown>}
                  column={sharedColumns[6]}
                >
                  <span className="whitespace-nowrap">{row.updatedAt}</span>
                </Table.Td>
                <Table.Td
                  rowData={row as unknown as Record<string, unknown>}
                  column={sharedColumns[7]}
                >
                  <span className="whitespace-nowrap">{row.createdAt}</span>
                </Table.Td>
                <Table.Td
                  rowData={row as unknown as Record<string, unknown>}
                  column={sharedColumns[8]}
                  preventClickPropagation
                >
                  <div className="flex gap-1 items-center justify-center">
                    <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
                      <IconCode size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
                    </button>
                    <ContextMenu.Root
                      trigger={({ toggle }) => (
                        <button
                          className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
                          onClick={toggle}
                        >
                          <IconDotsVertical
                            size={16}
                            stroke={1.5}
                            className="text-[var(--color-text-muted)]"
                          />
                        </button>
                      )}
                    >
                      <ContextMenu.Item action={() => console.log('View code:', row.id)}>
                        View code
                      </ContextMenu.Item>
                      <ContextMenu.Item danger action={() => console.log('Delete:', row.id)}>
                        Delete
                      </ContextMenu.Item>
                    </ContextMenu.Root>
                  </div>
                </Table.Td>
              </Table.Tr>
            ))}
          </SelectableTable>
        </Layout.VStack>
      </Layout.VStack>
    </PageShell>
  );
}

export default AgentPage;
