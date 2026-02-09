import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  SectionCard,
  StatusIndicator,
  Table,
  SearchInput,
  Pagination,
  DetailHeader,
  PageShell,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  VStack,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
} from '@/design-system';
import { AgentSidebar } from '@/components/AgentSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconStar,
  IconStarFilled,
  IconPlayerPause,
  IconPlayerPlay,
  IconTrash,
  IconEdit,
  IconRefresh,
  IconCode,
  IconDownload,
  IconBell,
  IconPalette,
} from '@tabler/icons-react';

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */
const toolStatusMap: Record<'active' | 'inactive' | 'error', 'active' | 'shutoff' | 'error'> = {
  active: 'active',
  inactive: 'shutoff',
  error: 'error',
};

/* ----------------------------------------
   MCP Tool Header Component
   ---------------------------------------- */
interface MCPToolHeaderProps {
  name: string;
  description: string;
  tags: string[];
  isFavorite: boolean;
  status: 'active' | 'inactive' | 'error';
  mcpServer: string;
  category: string;
  executions: number;
  createdAt: string;
  onFavoriteToggle: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
}

function MCPToolHeader({
  name,
  description,
  tags,
  isFavorite,
  status,
  mcpServer,
  category,
  executions,
  createdAt,
  onFavoriteToggle,
  onDeactivate,
  onDelete,
}: MCPToolHeaderProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 pt-3 pb-4 w-full">
      <div className="flex flex-col gap-4">
        {/* Title Row */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <h1 className="text-heading-h5 text-[var(--color-text-default)]">{name}</h1>
            <button
              onClick={onFavoriteToggle}
              className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
            >
              {isFavorite ? (
                <IconStarFilled size={22} className="text-yellow-500" />
              ) : (
                <IconStar size={22} stroke={1} className="text-[var(--color-border-default)]" />
              )}
            </button>
          </div>
          <p className="text-body-md text-[var(--color-text-subtle)]">{description}</p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {tags.map((tag, idx) => (
              <Badge key={idx} theme="gray" type="subtle" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={
              status === 'active' ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />
            }
            onClick={onDeactivate}
          >
            {status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<IconCode size={12} />}>
            View code
          </Button>
          <Button variant="danger" size="sm" leftIcon={<IconTrash size={12} />} onClick={onDelete}>
            Delete
          </Button>
        </div>

        {/* Info Grid */}
        <DetailHeader.InfoGrid>
          <DetailHeader.InfoCard label="Status" status={toolStatusMap[status]} />
          <DetailHeader.InfoCard label="MCP server" value={mcpServer} />
          <DetailHeader.InfoCard label="Category" value={category} />
          <DetailHeader.InfoCard label="Executions" value={executions.toLocaleString()} />
          <DetailHeader.InfoCard label="Created at" value={createdAt} />
        </DetailHeader.InfoGrid>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Details Tab Content
   ---------------------------------------- */
function DetailsTabContent() {
  return (
    <div className="flex flex-col gap-4">
      {/* Basic Information */}
      <SectionCard>
        <SectionCard.Header
          title="Basic information"
          actions={
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
              Edit
            </Button>
          }
        />
        <SectionCard.Content>
          <SectionCard.DataRow label="Name" value="send_slack_message" />
          <SectionCard.DataRow
            label="Description"
            value="Send a message to a Slack channel or user"
          />
          <SectionCard.DataRow label="Category" value="Communication" />
          <SectionCard.DataRow label="Tags">
            <div className="flex gap-1">
              <Badge theme="gray" type="subtle" size="sm">
                messaging
              </Badge>
              <Badge theme="gray" type="subtle" size="sm">
                team
              </Badge>
              <Badge theme="gray" type="subtle" size="sm">
                real-time
              </Badge>
            </div>
          </SectionCard.DataRow>
        </SectionCard.Content>
      </SectionCard>

      {/* Tool Configuration */}
      <SectionCard>
        <SectionCard.Header
          title="Tool configuration"
          actions={
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
              Edit
            </Button>
          }
        />
        <SectionCard.Content>
          <SectionCard.DataRow label="Input schema" value="JSON Schema" />
          <SectionCard.DataRow label="Output format" value="JSON" />
          <SectionCard.DataRow label="Timeout" value="30 seconds" />
          <SectionCard.DataRow label="Rate limit" value="100 requests/minute" />
        </SectionCard.Content>
      </SectionCard>

      {/* MCP Server Information */}
      <SectionCard>
        <SectionCard.Header title="MCP server information" />
        <SectionCard.Content>
          <SectionCard.DataRow label="Server name" value="Slack" isLink />
          <SectionCard.DataRow label="Server URL" value="https://api.slack.com/mcp" />
          <SectionCard.DataRow label="Version" value="1.2.0" />
          <SectionCard.DataRow label="Protocol" value="MCP v1" />
        </SectionCard.Content>
      </SectionCard>
    </div>
  );
}

/* ----------------------------------------
   Execution Logs Tab Content
   ---------------------------------------- */
interface ExecutionLogRow {
  id: string;
  timestamp: string;
  status: 'success' | 'failed' | 'running';
  duration: string;
  input: string;
  output: string;
  agent: string;
}

function ExecutionLogsTabContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const rowsPerPage = 10;

  // Mock data
  const executionLogs: ExecutionLogRow[] = Array.from({ length: 50 }, (_, i) => ({
    id: `log-${i + 1}`,
    timestamp: `Jan ${30 - (i % 30)}, 2026, ${9 + (i % 12)}:${String(i % 60).padStart(2, '0')} ${i % 2 === 0 ? 'AM' : 'PM'}`,
    status: i % 5 === 0 ? 'failed' : i % 7 === 0 ? 'running' : 'success',
    duration: `${(Math.random() * 5).toFixed(2)}s`,
    input: `{"channel": "general", "message": "Hello ${i + 1}"}`,
    output: i % 5 === 0 ? 'Error: Rate limit exceeded' : `{"ok": true, "ts": "1706..."}`,
    agent: i % 3 === 0 ? 'Customer Support Agent' : i % 2 === 0 ? 'Sales Agent' : 'Marketing Agent',
  }));

  const filteredLogs = useMemo(() => {
    if (!searchQuery) return executionLogs;
    return executionLogs.filter(
      (log) =>
        log.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.input.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [executionLogs, searchQuery]);

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const statusMap: Record<ExecutionLogRow['status'], 'active' | 'error' | 'building'> = {
    success: 'active',
    failed: 'error',
    running: 'building',
  };

  const columns: TableColumn<ExecutionLogRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (_, row) => <StatusIndicator status={statusMap[row.status]} layout="icon-only" />,
    },
    {
      key: 'timestamp',
      label: 'Timestamp',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      key: 'agent',
      label: 'Agent',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string) => (
        <div className="min-w-0">
          <span
            className="text-[var(--color-action-primary)] font-medium hover:underline cursor-pointer truncate block"
            title={value}
          >
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
      render: (value: string) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      key: 'input',
      label: 'Input',
      flex: 1,
      minWidth: columnMinWidths.description,
      sortable: false,
      render: (value: string) => (
        <div className="min-w-0">
          <span className="truncate font-mono text-body-sm block" title={value}>
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'output',
      label: 'Output',
      flex: 1,
      minWidth: columnMinWidths.description,
      sortable: false,
      render: (value: string) => (
        <div className="min-w-0">
          <span className="truncate font-mono text-body-sm block" title={value}>
            {value}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">Execution logs</h2>
        <Button variant="secondary" size="sm" leftIcon={<IconDownload size={12} />}>
          Export
        </Button>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-2">
        <div className="w-[280px]">
          <SearchInput
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            size="sm"
            fullWidth
          />
        </div>
        <div className="h-4 w-px bg-[var(--color-border-default)]" />
        <Button variant="muted" size="sm" leftIcon={<IconRefresh size={12} />}>
          Refresh
        </Button>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredLogs.length}
        selectedCount={selectedRows.length}
      />

      {/* Table */}
      <Table<ExecutionLogRow>
        columns={columns}
        data={paginatedLogs}
        rowKey="id"
        rowHeight="40px"
        emptyMessage="No execution logs found"
        selectable
        selectedKeys={selectedRows}
        onSelectionChange={setSelectedRows}
      />
    </div>
  );
}

/* ----------------------------------------
   Settings Tab Content
   ---------------------------------------- */
function SettingsTabContent() {
  return (
    <div className="flex flex-col gap-4">
      {/* Access Control */}
      <SectionCard>
        <SectionCard.Header
          title="Access control"
          actions={
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
              Edit
            </Button>
          }
        />
        <SectionCard.Content>
          <SectionCard.DataRow label="Visibility" value="All agents" />
          <SectionCard.DataRow label="Allowed agents">
            <div className="flex gap-1 flex-wrap">
              <Badge theme="blue" type="subtle" size="sm">
                Customer Support Agent
              </Badge>
              <Badge theme="blue" type="subtle" size="sm">
                Sales Agent
              </Badge>
              <Badge theme="blue" type="subtle" size="sm">
                Marketing Agent
              </Badge>
            </div>
          </SectionCard.DataRow>
          <SectionCard.DataRow label="Rate limit per agent" value="50 requests/minute" />
        </SectionCard.Content>
      </SectionCard>

      {/* Authentication */}
      <SectionCard>
        <SectionCard.Header
          title="Authentication"
          actions={
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
              Edit
            </Button>
          }
        />
        <SectionCard.Content>
          <SectionCard.DataRow label="Auth type" value="OAuth 2.0" />
          <SectionCard.DataRow label="Token expiry" value="1 hour" />
          <SectionCard.DataRow label="Scopes" value="chat:write, chat:read" />
        </SectionCard.Content>
      </SectionCard>

      {/* Advanced Settings */}
      <SectionCard>
        <SectionCard.Header
          title="Advanced settings"
          actions={
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
              Edit
            </Button>
          }
        />
        <SectionCard.Content>
          <SectionCard.DataRow label="Retry on failure" value="Enabled (3 retries)" />
          <SectionCard.DataRow label="Retry delay" value="Exponential backoff" />
          <SectionCard.DataRow label="Logging level" value="Info" />
          <SectionCard.DataRow label="Cache responses" value="Disabled" />
        </SectionCard.Content>
      </SectionCard>

      {/* Danger Zone */}
      <SectionCard>
        <SectionCard.Header title="Danger zone" />
        <SectionCard.Content>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-label-md text-[var(--color-text-default)]">Delete this tool</p>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                Once deleted, this tool cannot be recovered. All execution logs will also be
                deleted.
              </p>
            </div>
            <Button variant="danger" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete tool
            </Button>
          </div>
        </SectionCard.Content>
      </SectionCard>
    </div>
  );
}

/* ----------------------------------------
   Main MCPToolDetailPage Component
   ---------------------------------------- */
export function MCPToolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [activeTab, setActiveTab] = useState('details');
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock tool data
  const toolData = {
    id: id || 'tool-1',
    name: 'send_slack_message',
    description:
      'Send a message to a Slack channel or user. Supports rich text formatting and attachments.',
    tags: ['messaging', 'team', 'real-time'],
    status: 'active' as const,
    mcpServer: 'Slack',
    category: 'Communication',
    executions: 1234,
    createdAt: 'Nov 11, 2025, 2:51 PM',
  };

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
            <Breadcrumb
              items={[{ label: 'MCP Tools', href: '/mcp-tools' }, { label: toolData.name }]}
            />
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
        {/* Header */}
        <MCPToolHeader
          name={toolData.name}
          description={toolData.description}
          tags={toolData.tags}
          isFavorite={isFavorite}
          status={toolData.status}
          mcpServer={toolData.mcpServer}
          category={toolData.category}
          executions={toolData.executions}
          createdAt={toolData.createdAt}
          onFavoriteToggle={() => setIsFavorite(!isFavorite)}
          onDeactivate={() => console.log('Deactivate')}
          onDelete={() => console.log('Delete')}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="details">Details</Tab>
            <Tab value="execution-logs">Execution logs</Tab>
            <Tab value="settings">Settings</Tab>
          </TabList>

          <TabPanel value="details" className="pt-0">
            <div className="pt-4">
              <DetailsTabContent />
            </div>
          </TabPanel>

          <TabPanel value="execution-logs" className="pt-0">
            <div className="pt-4">
              <ExecutionLogsTabContent />
            </div>
          </TabPanel>

          <TabPanel value="settings" className="pt-0">
            <div className="pt-4">
              <SettingsTabContent />
            </div>
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}

export default MCPToolDetailPage;
