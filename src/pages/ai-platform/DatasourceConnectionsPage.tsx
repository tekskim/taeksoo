import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PageShell,
  TabBar,
  TopBar,
  TopBarAction,
  Button,
  Table,
  FilterSearchInput,
  Pagination,
  ListToolbar,
  StatusIndicator,
  ContextMenu,
  Drawer,
  VStack,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DetailHeader,
  Badge,
  InlineMessage,
  Chip,
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
  IconBell,
  IconPlus,
  IconSearch,
  IconPencil,
  IconTrash,
  IconLink,
  IconDots,
  IconTarget,
  IconPlayerPause,
  IconStar,
  IconStarFilled,
  IconMessageCircle,
  IconExternalLink,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

type AgentLinkStatus = 'active' | 'inactive' | 'draft';

interface ConnectedAgentRow {
  id: string;
  status: AgentLinkStatus;
  favorite: boolean;
  name: string;
  model: string;
  modelProvider: string;
  chats: string;
  updatedAt: string;
  createdAt: string;
}

interface AgentConnSummaryCardProps {
  label: string;
  count: number;
  status: 'active' | 'inactive' | 'draft';
}

function AgentConnSummaryCard({ label, count, status }: AgentConnSummaryCardProps) {
  let bgColor = 'bg-[var(--color-surface-subtle)]';
  let iconBg = 'bg-[var(--color-text-muted)]';

  if (status === 'active') {
    bgColor = 'bg-[var(--color-state-success-bg)]';
    iconBg = 'bg-[var(--color-state-success)]';
  } else if (status === 'inactive') {
    bgColor = 'bg-[var(--color-surface-muted)]';
    iconBg = 'bg-[var(--color-text-muted)]';
  } else {
    bgColor = 'bg-[var(--color-surface-default)]';
    iconBg = 'bg-[var(--color-text-muted)]';
  }

  const icon =
    status === 'active' ? (
      <IconTarget size={16} stroke={1} className="text-[var(--color-text-on-primary)]" />
    ) : status === 'inactive' ? (
      <IconPlayerPause size={16} stroke={1} className="text-[var(--color-text-on-primary)]" />
    ) : (
      <IconPencil size={16} stroke={1} className="text-[var(--color-text-on-primary)]" />
    );

  const border = status === 'draft' ? 'shadow-[inset_0_0_0_1px_var(--color-border-default)]' : '';

  return (
    <div
      className={`${bgColor} ${border} flex flex-[1_0_0] items-center justify-between min-h-px min-w-px px-4 py-3 relative rounded-[var(--radius-lg)] shrink-0`}
    >
      <div className="flex flex-col gap-1.5 items-start leading-4 not-italic relative shrink-0">
        <p className="text-label-sm text-[var(--color-text-subtle)]">{label}</p>
        <p className="text-body-md text-[var(--color-text-default)]">{count}</p>
      </div>
      <div
        className={`${iconBg} flex gap-0 items-center justify-center p-1 relative rounded-2xl shrink-0 size-6`}
      >
        {icon}
      </div>
    </div>
  );
}

function AgentLinkStatusCell({ status }: { status: AgentLinkStatus }) {
  const map: Record<AgentLinkStatus, StatusType> = {
    active: 'active',
    inactive: 'muted',
    draft: 'draft',
  };
  return <StatusIndicator layout="icon-only" status={map[status]} />;
}

const MAIN_FILTER_FIELDS: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'draft', label: 'Draft' },
    ],
  },
];

const DRAWER_FILTER_FIELDS: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'draft', label: 'Draft' },
    ],
  },
];

const MOCK_AGENTS: ConnectedAgentRow[] = [
  {
    id: 'a1',
    status: 'draft',
    favorite: false,
    name: 'lable',
    model: 'claude-sonnet-4-5',
    modelProvider: 'anthropic',
    chats: '-',
    updatedAt: 'Nov 11, 2025, 2:51 PM',
    createdAt: 'Nov 11, 2025, 2:51 PM',
  },
  {
    id: 'a2',
    status: 'active',
    favorite: false,
    name: 'lable',
    model: 'claude-sonnet-4-5',
    modelProvider: 'anthropic',
    chats: '5',
    updatedAt: 'Nov 11, 2025, 2:51 PM',
    createdAt: 'Nov 11, 2025, 2:51 PM',
  },
  {
    id: 'a3',
    status: 'inactive',
    favorite: true,
    name: 'lable',
    model: 'claude-sonnet-4-5',
    modelProvider: 'anthropic',
    chats: '-',
    updatedAt: 'Nov 11, 2025, 2:51 PM',
    createdAt: 'Nov 11, 2025, 2:51 PM',
  },
  {
    id: 'a4',
    status: 'active',
    favorite: false,
    name: 'support-bot',
    model: 'claude-sonnet-4-5',
    modelProvider: 'anthropic',
    chats: '12',
    updatedAt: 'Nov 10, 2025, 9:12 AM',
    createdAt: 'Oct 2, 2025, 4:00 PM',
  },
  {
    id: 'a5',
    status: 'draft',
    favorite: true,
    name: 'internal-docs-agent',
    model: 'claude-sonnet-4-5',
    modelProvider: 'anthropic',
    chats: '-',
    updatedAt: 'Nov 9, 2025, 11:20 AM',
    createdAt: 'Sep 15, 2025, 1:30 PM',
  },
];

const DRAWER_POOL: ConnectedAgentRow[] = [
  ...MOCK_AGENTS,
  {
    id: 'a6',
    status: 'active',
    favorite: false,
    name: 'research-agent',
    model: 'claude-sonnet-4-5',
    modelProvider: 'anthropic',
    chats: '2',
    updatedAt: 'Nov 8, 2025, 3:00 PM',
    createdAt: 'Aug 1, 2025, 10:00 AM',
  },
  {
    id: 'a7',
    status: 'inactive',
    favorite: false,
    name: 'legacy-chat',
    model: 'claude-sonnet-4-5',
    modelProvider: 'anthropic',
    chats: '-',
    updatedAt: 'Jul 4, 2025, 8:00 AM',
    createdAt: 'Jul 1, 2025, 8:00 AM',
  },
  {
    id: 'a8',
    status: 'draft',
    favorite: false,
    name: 'sandbox-agent',
    model: 'claude-sonnet-4-5',
    modelProvider: 'anthropic',
    chats: '-',
    updatedAt: 'Jun 20, 2025, 6:00 PM',
    createdAt: 'Jun 18, 2025, 6:00 PM',
  },
];

const TOTAL_LIST_ITEMS = 99;
const DRAWER_TOTAL_ITEMS = 99;

interface AgentConnectionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function AgentConnectionsDrawer({ isOpen, onClose }: AgentConnectionsDrawerProps) {
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['a1']);
  const pageSize = 5;

  const filtered = useMemo(() => {
    if (appliedFilters.length === 0) return DRAWER_POOL;
    return DRAWER_POOL.filter((row) =>
      appliedFilters.every((f) => {
        if (f.fieldId === 'name') {
          return row.name.toLowerCase().includes(String(f.value).toLowerCase());
        }
        if (f.fieldId === 'status') {
          return row.status === f.value;
        }
        return true;
      })
    );
  }, [appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = useMemo(() => {
    return filtered.slice((page - 1) * pageSize, page * pageSize);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [appliedFilters]);

  const selectedAgents = useMemo(
    () => DRAWER_POOL.filter((a) => selectedKeys.includes(a.id)),
    [selectedKeys]
  );

  const drawerColumns: TableColumn<ConnectedAgentRow>[] = useMemo(
    () => [
      {
        key: 'favorite',
        label: '',
        width: 40,
        align: 'center',
        sortable: false,
        render: (_, row) => (
          <button
            type="button"
            aria-label={row.favorite ? 'Remove from favorites' : 'Add to favorites'}
            className="p-1 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)]"
            onClick={(e) => e.stopPropagation()}
          >
            {row.favorite ? (
              <IconStarFilled size={16} className="text-[var(--primitive-color-yellow400)]" />
            ) : (
              <IconStar size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
            )}
          </button>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        width: fixedColumns.status,
        align: 'center',
        sortable: false,
        render: (_, row) => <AgentLinkStatusCell status={row.status} />,
      },
      {
        key: 'name',
        label: 'Name',
        flex: 1,
        minWidth: columnMinWidths.name,
        sortable: true,
        render: (v: string) => (
          <span className="truncate block" title={v}>
            {v}
          </span>
        ),
      },
      {
        key: 'model',
        label: 'Model',
        flex: 1,
        minWidth: 120,
        sortable: false,
      },
      {
        key: 'chats',
        label: 'Chats',
        width: 72,
        align: 'right',
        sortable: false,
      },
      {
        key: 'createdAt',
        label: 'Created at',
        flex: 1,
        minWidth: columnMinWidths.createdAt,
        align: 'right',
        sortable: true,
        render: (v: string) => <span className="whitespace-nowrap">{v}</span>,
      },
    ],
    []
  );

  const removeSelected = useCallback((id: string) => {
    setSelectedKeys((prev) => prev.filter((k) => k !== id));
  }, []);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Agent connections"
      description="Select an agent to connect with the selected data."
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" size="md" onClick={onClose} className="min-w-[120px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            className="min-w-[120px]"
            onClick={() => {
              onClose();
            }}
          >
            Connect
          </Button>
        </HStack>
      }
    >
      <VStack gap={4}>
        <FilterSearchInput
          filters={DRAWER_FILTER_FIELDS}
          appliedFilters={appliedFilters}
          onFiltersChange={setAppliedFilters}
          placeholder="Find agent with filters"
          size="sm"
          className="w-full"
          hideAppliedFilters
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={DRAWER_TOTAL_ITEMS}
          showSettings={false}
        />
        <Table<ConnectedAgentRow>
          columns={drawerColumns}
          data={pageRows}
          rowKey="id"
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          emptyMessage="No agents found"
        />
        <div className="w-full rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)] px-4 py-3">
          <p className="text-label-sm text-[var(--color-text-subtle)] mb-2">Selected</p>
          <HStack gap={2} className="flex-wrap">
            {selectedAgents.length === 0 ? (
              <span className="text-body-md text-[var(--color-text-subtle)]">
                No agents selected
              </span>
            ) : (
              selectedAgents.map((a) => (
                <Chip key={a.id} value={a.name} onRemove={() => removeSelected(a.id)} />
              ))
            )}
          </HStack>
        </div>
        <InlineMessage variant="warning">
          This action disconnects the agent from the selected data source and applies immediately.
          Active chat sessions may be affected.
        </InlineMessage>
      </VStack>
    </Drawer>
  );
}

export function DatasourceConnectionsPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [activeTab, setActiveTab] = useState('connected');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState<ConnectedAgentRow[]>(MOCK_AGENTS);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    document.title = 'Agent connections - THAKI Cloud';
    return () => {
      document.title = 'THAKI Cloud';
    };
  }, []);

  useEffect(() => {
    updateActiveTabLabel('Agent connections');
  }, [updateActiveTabLabel]);

  const statusCounts = useMemo(() => {
    return {
      active: rows.filter((r) => r.status === 'active').length,
      inactive: rows.filter((r) => r.status === 'inactive').length,
      draft: rows.filter((r) => r.status === 'draft').length,
    };
  }, [rows]);

  const filtered = useMemo(() => {
    if (appliedFilters.length === 0) return rows;
    return rows.filter((row) =>
      appliedFilters.every((f) => {
        if (f.fieldId === 'name') {
          return row.name.toLowerCase().includes(String(f.value).toLowerCase());
        }
        if (f.fieldId === 'status') {
          return row.status === f.value;
        }
        return true;
      })
    );
  }, [rows, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = useMemo(() => {
    return filtered.slice((page - 1) * pageSize, page * pageSize);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [appliedFilters]);

  const toggleFavorite = useCallback((id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)));
  }, []);

  const columns: TableColumn<ConnectedAgentRow>[] = useMemo(
    () => [
      {
        key: 'favorite',
        label: '',
        width: 44,
        align: 'center',
        sortable: false,
        render: (_, row) => (
          <button
            type="button"
            aria-label={row.favorite ? 'Remove from favorites' : 'Add to favorites'}
            className="p-1 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)]"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(row.id);
            }}
          >
            {row.favorite ? (
              <IconStarFilled size={16} className="text-[var(--primitive-color-yellow400)]" />
            ) : (
              <IconStar size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
            )}
          </button>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        width: fixedColumns.status,
        align: 'center',
        sortable: false,
        render: (_, row) => <AgentLinkStatusCell status={row.status} />,
      },
      {
        key: 'name',
        label: 'Name',
        flex: 1,
        minWidth: columnMinWidths.name,
        sortable: true,
        render: (v: string) => (
          <span className="truncate block" title={v}>
            {v}
          </span>
        ),
      },
      {
        key: 'model',
        label: 'Model',
        flex: 1,
        minWidth: 120,
        sortable: true,
      },
      {
        key: 'modelProvider',
        label: 'Model provider',
        flex: 1,
        minWidth: 100,
        sortable: false,
      },
      {
        key: 'chats',
        label: 'Chats',
        width: 72,
        align: 'right',
        sortable: false,
      },
      {
        key: 'updatedAt',
        label: 'Updated at',
        flex: 1,
        minWidth: columnMinWidths.createdAt,
        align: 'right',
        sortable: true,
        render: (v: string) => <span className="whitespace-nowrap">{v}</span>,
      },
      {
        key: 'createdAt',
        label: 'Created at',
        flex: 1,
        minWidth: columnMinWidths.createdAt,
        align: 'right',
        sortable: true,
        render: (v: string) => <span className="whitespace-nowrap">{v}</span>,
      },
      {
        key: 'actions',
        label: 'Action',
        width: fixedColumns.actions,
        align: 'center',
        sticky: 'right',
        sortable: false,
        render: (_, row) => {
          const menuItems: ContextMenuItem[] = [
            {
              id: 'open',
              label: 'Open agent',
              onClick: () => {},
            },
            {
              id: 'disconnect',
              label: 'Disconnect',
              status: 'danger',
              divider: true,
              onClick: () => {},
            },
          ];
          return (
            <div
              className="flex gap-1 items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Open chats"
                className="p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                <IconMessageCircle
                  size={16}
                  stroke={1.5}
                  className="text-[var(--color-text-muted)]"
                />
              </button>
              <button
                type="button"
                aria-label="Open in new context"
                className="p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                <IconExternalLink
                  size={16}
                  stroke={1.5}
                  className="text-[var(--color-text-muted)]"
                />
              </button>
              <ContextMenu items={menuItems} trigger="click" align="right">
                <button
                  type="button"
                  aria-label="Row actions"
                  className="p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] transition-colors"
                >
                  <IconDots size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
                </button>
              </ContextMenu>
            </div>
          );
        },
      },
    ],
    [toggleFavorite]
  );

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
      contentClassName="pt-4 px-8 pb-6 bg-[var(--color-surface-subtle)]"
    >
      <VStack gap={6}>
        <DetailHeader>
          <DetailHeader.Title>Data source 1</DetailHeader.Title>
          <VStack gap={2} className="mb-3">
            <span className="text-body-md text-[var(--color-text-subtle)]">Description</span>
            <HStack gap={1} className="flex-wrap">
              <Badge theme="white" size="sm">
                Tag 1
              </Badge>
              <Badge theme="white" size="sm">
                Tag 2
              </Badge>
              <Badge theme="white" size="sm">
                Tag 3
              </Badge>
            </HStack>
          </VStack>
          <DetailHeader.Actions>
            <Button variant="outline" size="sm" leftIcon={<IconPlus size={12} />}>
              Add documents
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconLink size={12} />}
              onClick={() => setDrawerOpen(true)}
            >
              Agent Connections
            </Button>
            <Button variant="outline" size="sm" leftIcon={<IconSearch size={12} />}>
              Search
            </Button>
            <Button variant="outline" size="sm" leftIcon={<IconPencil size={12} />}>
              Edit
            </Button>
            <Button variant="outline" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="Status" status="error" value="" />
            <DetailHeader.InfoCard label="Type" value="Google cloud storage" />
            <DetailHeader.InfoCard
              label="Sync setting"
              value="Every Monday at 00:00, (KST, UTC+9), no end date."
            />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        <div className="w-full rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] px-4 pt-4 pb-3">
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
            <TabList>
              <Tab value="documents">Documents</Tab>
              <Tab value="information">Information</Tab>
              <Tab value="sync">Sync history</Tab>
              <Tab value="connected">Connected agents</Tab>
            </TabList>

            <TabPanel value="documents" className="pt-6">
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Documents for this data source (mock).
              </p>
            </TabPanel>
            <TabPanel value="information" className="pt-6">
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Information tab (mock).
              </p>
            </TabPanel>
            <TabPanel value="sync" className="pt-6">
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Sync history tab (mock).
              </p>
            </TabPanel>
            <TabPanel value="connected" className="pt-6">
              <VStack gap={4}>
                <HStack justify="between" align="center" className="w-full flex-wrap gap-3">
                  <h2 className="text-heading-h6 text-[var(--color-text-default)]">
                    Connected agents
                  </h2>
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<IconLink size={12} />}
                    onClick={() => setDrawerOpen(true)}
                  >
                    Agent connections
                  </Button>
                </HStack>

                <HStack gap={2} className="w-full flex-wrap">
                  <AgentConnSummaryCard
                    label="Active"
                    count={statusCounts.active}
                    status="active"
                  />
                  <AgentConnSummaryCard
                    label="Inactive"
                    count={statusCounts.inactive}
                    status="inactive"
                  />
                  <AgentConnSummaryCard label="Draft" count={statusCounts.draft} status="draft" />
                </HStack>

                <ListToolbar
                  primaryActions={
                    <ListToolbar.Actions>
                      <FilterSearchInput
                        filters={MAIN_FILTER_FIELDS}
                        appliedFilters={appliedFilters}
                        onFiltersChange={setAppliedFilters}
                        placeholder="Find agent with filters"
                        size="sm"
                        className="w-[var(--search-input-width)]"
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
                      >
                        Delete
                      </Button>
                    </ListToolbar.Actions>
                  }
                />

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  totalItems={TOTAL_LIST_ITEMS}
                  selectedCount={selectedKeys.length}
                  showSettings={false}
                />

                <Table<ConnectedAgentRow>
                  columns={columns}
                  data={pageRows}
                  rowKey="id"
                  selectable
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                  emptyMessage="No connected agents"
                />
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>

      <AgentConnectionsDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </PageShell>
  );
}

export default DatasourceConnectionsPage;
