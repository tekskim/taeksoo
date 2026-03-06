import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
  IconCirclePlus,
  IconTrash,
  IconEdit,
  IconRefresh,
  IconMessage,
  IconBell,
  IconPalette,
} from '@tabler/icons-react';

/* ----------------------------------------
   Status Mapping for InfoCard
   ---------------------------------------- */
const agentStatusMap: Record<'active' | 'inactive' | 'draft', 'active' | 'shutoff' | 'building'> = {
  active: 'active',
  inactive: 'shutoff',
  draft: 'building',
};

/* ----------------------------------------
   Agent Header Component
   ---------------------------------------- */
interface AgentHeaderProps {
  name: string;
  description: string;
  tags: string[];
  isFavorite: boolean;
  status: 'active' | 'inactive' | 'draft';
  model: string;
  modelProvider: string;
  chats: number;
  updatedAt: string;
  createdAt: string;
  onFavoriteToggle: () => void;
  onDeactivate: () => void;
  onConnectDataSource: () => void;
  onConnectMCPServer: () => void;
  onDelete: () => void;
}

function AgentHeader({
  name,
  description,
  tags,
  isFavorite,
  status,
  model,
  modelProvider,
  chats,
  updatedAt,
  createdAt,
  onFavoriteToggle,
  onDeactivate,
  onConnectDataSource,
  onConnectMCPServer,
  onDelete,
}: AgentHeaderProps) {
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
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag, index) => (
            <Badge key={index} theme="gray" type="subtle" size="sm">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 items-center">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<IconPlayerPause size={12} />}
            onClick={onDeactivate}
          >
            Deactive
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<IconCirclePlus size={12} />}
            onClick={onConnectDataSource}
          >
            Connect data source
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<IconCirclePlus size={12} />}
            onClick={onConnectMCPServer}
          >
            Connect MCP server
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<IconTrash size={12} />}
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>

        {/* Info Cards Row */}
        <DetailHeader.InfoGrid>
          <DetailHeader.InfoCard
            label="Status"
            value={status.charAt(0).toUpperCase() + status.slice(1)}
            status={agentStatusMap[status]}
          />
          <DetailHeader.InfoCard label="Model" value={model} />
          <DetailHeader.InfoCard label="Model provider" value={modelProvider} />
          <DetailHeader.InfoCard label="Chats" value={String(chats)} />
          <DetailHeader.InfoCard label="Updated at" value={updatedAt} />
          <DetailHeader.InfoCard label="Created at" value={createdAt} />
        </DetailHeader.InfoGrid>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Information Tab Content
   ---------------------------------------- */
interface InformationTabProps {
  agentName: string;
  description: string;
  tags: string[];
  modelProvider: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  tone: string;
  maxTokens: number;
  maxIteration: number;
  onEditBasicInfo: () => void;
  onEditModelSettings: () => void;
  onEditPromptSettings: () => void;
}

function InformationTab({
  agentName,
  description,
  tags,
  modelProvider,
  model,
  temperature,
  systemPrompt,
  tone,
  maxTokens,
  maxIteration,
  onEditBasicInfo,
  onEditModelSettings,
  onEditPromptSettings,
}: InformationTabProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Basic Information */}
      <SectionCard>
        <SectionCard.Header
          title="Basic information"
          actions={
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconEdit size={12} />}
              onClick={onEditBasicInfo}
            >
              Edit
            </Button>
          }
        />
        <SectionCard.Content>
          <SectionCard.DataRow label="Agent name" value={agentName} />
          <SectionCard.DataRow label="Description" value={description || '-'} />
          <SectionCard.DataRow label="Tag">
            <div className="flex gap-1 flex-wrap">
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <Badge key={index} theme="gray" type="subtle" size="sm">
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-body-md text-[var(--color-text-muted)]">-</span>
              )}
            </div>
          </SectionCard.DataRow>
        </SectionCard.Content>
      </SectionCard>

      {/* Model Settings */}
      <SectionCard>
        <SectionCard.Header
          title="Model settings"
          actions={
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconEdit size={12} />}
              onClick={onEditModelSettings}
            >
              Edit
            </Button>
          }
        />
        <SectionCard.Content>
          <SectionCard.DataRow label="Model provider" value={modelProvider} />
          <SectionCard.DataRow label="Model" value={model} />
          <SectionCard.DataRow label="Temperature" value={String(temperature)} />
        </SectionCard.Content>
      </SectionCard>

      {/* Prompt Settings */}
      <SectionCard>
        <SectionCard.Header
          title="Prompt settings"
          actions={
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconEdit size={12} />}
              onClick={onEditPromptSettings}
            >
              Edit
            </Button>
          }
        />
        <SectionCard.Content>
          <SectionCard.DataRow label="System prompt" value={systemPrompt || '-'} />
          <SectionCard.DataRow label="Tone" value={tone} />
          <SectionCard.DataRow label="Max tokens" value={maxTokens.toLocaleString()} />
          <SectionCard.DataRow label="Max iteration" value={String(maxIteration)} />
        </SectionCard.Content>
      </SectionCard>
    </div>
  );
}

/* ----------------------------------------
   Data Sources Tab Content
   ---------------------------------------- */
interface DataSourceRow {
  id: string;
  status: 'active' | 'inactive';
  name: string;
  type: string;
  documents: number;
  size: string;
  createdAt: string;
}

function DataSourcesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Mock data
  const dataSources: DataSourceRow[] = [
    {
      id: '1',
      status: 'active',
      name: 'lable',
      type: 'File',
      documents: 7,
      size: '60 MB',
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
    {
      id: '2',
      status: 'active',
      name: 'lable',
      type: 'File',
      documents: 7,
      size: '60 MB',
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
  ];

  const totalPages = 99;
  const totalItems = 99;

  const columns: TableColumn<DataSourceRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator
          layout="icon-only"
          status={row.status === 'active' ? 'active' : 'shutoff'}
        />
      ),
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
    { key: 'type', label: 'Type', flex: 1, minWidth: columnMinWidths.type },
    { key: 'documents', label: 'Documents', flex: 1, minWidth: columnMinWidths.documents },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
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
      width: fixedColumns.action,
      align: 'center',
      render: () => (
        <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
          <IconRefresh size={12} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">Data sources</h2>
        <Button variant="primary" size="sm">
          Connect data source
        </Button>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-2">
        <div className="w-[280px]">
          <SearchInput
            placeholder="Find data sources with filters"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            size="sm"
            fullWidth
          />
        </div>
        <div className="h-4 w-px bg-[var(--color-border-default)]" />
        <Button
          variant="muted"
          size="sm"
          leftIcon={<IconTrash size={12} />}
          disabled={selectedRows.length === 0}
        >
          Delete
        </Button>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
      />

      {/* Table */}
      <Table<DataSourceRow>
        columns={columns}
        data={dataSources}
        rowKey="id"
        rowHeight="40px"
        emptyMessage="No data sources found"
        selectable
        selectedKeys={selectedRows}
        onSelectionChange={setSelectedRows}
      />
    </div>
  );
}

/* ----------------------------------------
   MCP Servers Tab Content
   ---------------------------------------- */
interface MCPServerRow {
  id: string;
  status: 'active' | 'warning' | 'error';
  title: string;
  mcpServer: string;
  category: string;
  tags: string[];
  createdAt: string;
}

function MCPServersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Mock data
  const mcpServers: MCPServerRow[] = [
    {
      id: '1',
      status: 'active',
      title: 'Lable',
      mcpServer: 'lable',
      category: 'Communication',
      tags: ['Tag', 'Tag', 'Tag', 'Tag', 'Tag', 'Tag', 'Tag', 'Tag'],
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
    {
      id: '2',
      status: 'warning',
      title: 'Lable',
      mcpServer: 'lable',
      category: 'Communication',
      tags: ['Tag', 'Tag', 'Tag', 'Tag', 'Tag', 'Tag', 'Tag', 'Tag'],
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
    {
      id: '3',
      status: 'error',
      title: 'Lable',
      mcpServer: 'lable',
      category: 'Communication',
      tags: ['Tag', 'Tag', 'Tag'],
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
  ];

  const totalPages = 99;
  const totalItems = 990;

  const statusMap: Record<MCPServerRow['status'], 'active' | 'shutoff' | 'error'> = {
    active: 'active',
    warning: 'shutoff',
    error: 'error',
  };

  const columns: TableColumn<MCPServerRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator layout="icon-only" status={statusMap[row.status]} />,
    },
    {
      key: 'title',
      label: 'Title',
      flex: 1,
      minWidth: columnMinWidths.name,
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
      key: 'mcpServer',
      label: 'MCP server',
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (value: string) => (
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="size-5 rounded bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold">S</span>
          </div>
          <span className="truncate" title={value}>
            {value}
          </span>
        </div>
      ),
    },
    { key: 'category', label: 'Category', flex: 1, minWidth: columnMinWidths.category },
    {
      key: 'tags',
      label: 'Tags',
      flex: 1,
      minWidth: columnMinWidths.labels,
      render: (tags: string[]) => {
        const maxVisible = 3;
        const visibleTags = tags.slice(0, maxVisible);
        const remainingCount = tags.length - maxVisible;

        return (
          <div className="flex gap-1 items-center overflow-hidden">
            {visibleTags.map((tag, index) => (
              <Badge key={index} theme="gray" type="subtle" size="sm">
                {tag}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Badge theme="gray" type="subtle" size="sm">
                +{remainingCount}
              </Badge>
            )}
          </div>
        );
      },
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
      width: fixedColumns.action,
      align: 'center',
      render: () => (
        <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
          <IconRefresh size={12} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">MCP servers</h2>
        <Button variant="primary" size="sm">
          Connect MCP server
        </Button>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-2">
        <div className="w-[280px]">
          <SearchInput
            placeholder="Find MCP tools with filters"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            size="sm"
            fullWidth
          />
        </div>
        <div className="h-4 w-px bg-[var(--color-border-default)]" />
        <Button
          variant="muted"
          size="sm"
          leftIcon={<IconTrash size={12} />}
          disabled={selectedRows.length === 0}
        >
          Delete
        </Button>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
      />

      {/* Table */}
      <Table<MCPServerRow>
        columns={columns}
        data={mcpServers}
        rowKey="id"
        rowHeight="40px"
        emptyMessage="No MCP servers found"
        selectable
        selectedKeys={selectedRows}
        onSelectionChange={setSelectedRows}
      />
    </div>
  );
}

/* ----------------------------------------
   Execution Logs Tab Content
   ---------------------------------------- */
interface ExecutionLogItem {
  id: string;
  question: string;
  response: string;
  steps: string[];
  status: 'completed' | 'failed' | 'running';
  createdAt: string;
  responseTime: string;
  stepsCount: number;
}

function ExecutionLogCard({ log }: { log: ExecutionLogItem }) {
  return (
    <div className="border border-[var(--color-border-default)] rounded-lg p-4 w-full">
      <div className="flex flex-col gap-3">
        {/* Question */}
        <div className="flex flex-col gap-1">
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            질문: {log.question}
          </span>
        </div>

        {/* Response Header */}
        <div className="flex items-start gap-2">
          <IconMessage size={16} className="text-[var(--color-action-primary)] mt-0.5 shrink-0" />
          <span className="text-body-md text-[var(--color-text-default)]">
            {log.response.split('\n')[0]}
          </span>
        </div>

        {/* Response Content */}
        <div className="pl-6 text-body-sm text-[var(--color-text-muted)]">
          {log.response.split('\n').slice(1).join('\n')}
        </div>

        {/* Steps Summary */}
        <div className="flex items-center gap-1.5 pl-6">
          <IconMessage size={14} className="text-[var(--color-text-subtle)]" />
          <span className="text-body-sm text-[var(--color-text-subtle)]">주요 전달 내용</span>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 pt-2">
          <Badge theme="green" type="subtle" size="sm">
            {log.status === 'completed'
              ? 'Completed'
              : log.status === 'failed'
                ? 'Failed'
                : 'Running'}
          </Badge>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            Created at: {log.createdAt}
          </span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            Response Time: {log.responseTime}
          </span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            Steps: {log.stepsCount}
          </span>
        </div>
      </div>
    </div>
  );
}

function ExecutionLogsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data
  const logs: ExecutionLogItem[] = Array.from({ length: 8 }, (_, i) => ({
    id: String(i + 1),
    question: '2023년 한국 GDP 성장률 전망은?',
    response: `# 2025년 한국 GDP 성장률 전망

한국은행의 "2025년 8월 경제전망보고서"에 따르면, 2025년 한국 GDP 성장률은 "0.9%"로 전망됩니다.`,
    steps: ['데이터 수집', '분석', '결과 생성'],
    status: 'completed' as const,
    createdAt: 'Sep 28, 2025',
    responseTime: '29.4s',
    stepsCount: 8,
  }));

  const totalPages = 99;
  const totalItems = 195;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full h-7">
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">Execution logs</h2>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="w-[280px]">
          <SearchInput
            placeholder="Find execution logs with filters"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            size="sm"
            fullWidth
          />
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
      />

      {/* Log Cards */}
      <div className="flex flex-col gap-3 w-full">
        {logs.map((log) => (
          <ExecutionLogCard key={log.id} log={log} />
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Status History Tab Content
   ---------------------------------------- */
interface StatusHistoryRow {
  id: string;
  status: 'active' | 'inactive' | 'draft';
  changedAt: string;
  changedBy: string;
}

function StatusHistoryTab() {
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data
  const statusHistory: StatusHistoryRow[] = [
    {
      id: '1',
      status: 'inactive',
      changedAt: 'Nov 11, 2025, 2:51 PM',
      changedBy: 'test@example.com',
    },
    {
      id: '2',
      status: 'active',
      changedAt: 'Nov 11, 2025, 2:51 PM',
      changedBy: 'test@example.com',
    },
    {
      id: '3',
      status: 'inactive',
      changedAt: 'Nov 11, 2025, 2:51 PM',
      changedBy: 'test@example.com',
    },
    {
      id: '4',
      status: 'active',
      changedAt: 'Nov 11, 2025, 2:51 PM',
      changedBy: 'test@example.com',
    },
    { id: '5', status: 'draft', changedAt: 'Nov 11, 2025, 2:51 PM', changedBy: 'test@example.com' },
  ];

  const totalPages = 99;
  const totalItems = 99;

  const columns: TableColumn<StatusHistoryRow>[] = [
    {
      key: 'status',
      label: 'Status',
      flex: 1,
      minWidth: columnMinWidths.type,
      render: (value: StatusHistoryRow['status']) => {
        const statusLabels: Record<typeof value, string> = {
          active: 'Active',
          inactive: 'Inactive',
          draft: 'Draft',
        };
        return (
          <span className="text-body-md text-[var(--color-text-default)]">
            {statusLabels[value]}
          </span>
        );
      },
    },
    {
      key: 'changedAt',
      label: 'Changed at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      key: 'changedBy',
      label: 'Changed by',
      flex: 1,
      minWidth: columnMinWidths.username,
      sortable: true,
    },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full h-7">
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">Status history</h2>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
      />

      {/* Table */}
      <Table<StatusHistoryRow>
        columns={columns}
        data={statusHistory}
        rowKey="id"
        emptyMessage="No status history found"
        rowHeight="40px"
      />
    </div>
  );
}

/* ----------------------------------------
   Main AgentDetailPage Component
   ---------------------------------------- */
export function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'information';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Mock agent data
  const agent = {
    id: id || '1',
    name: 'Agentname0',
    description: 'Description',
    tags: ['Tag 1', 'Tag 2', 'Tag 3'],
    isFavorite: false,
    status: 'active' as const,
    model: 'claude-sonnet-4-5',
    modelProvider: 'anthropic',
    modelProviderDisplay: 'Anthropic (Claude)',
    modelDisplay: 'Claude Sonnet 4.5 (Latest) - Recommended',
    chats: 7,
    temperature: 0.6,
    systemPrompt: 'Enter a prompt or task for your agent',
    tone: 'Default',
    maxTokens: 50000,
    maxIteration: 5,
    updatedAt: 'Nov 11, 2025, 2:51 PM',
    createdAt: 'Nov 11, 2025, 2:51 PM',
  };

  const [isFavorite, setIsFavorite] = useState(agent.isFavorite);

  // Event handlers
  const handleFavoriteToggle = () => setIsFavorite(!isFavorite);
  const handleDeactivate = () => console.log('Deactivate agent');
  const handleConnectDataSource = () => console.log('Connect data source');
  const handleConnectMCPServer = () => console.log('Connect MCP server');
  const handleDelete = () => console.log('Delete agent');
  const handleEditBasicInfo = () => console.log('Edit basic info');
  const handleEditModelSettings = () => console.log('Edit model settings');
  const handleEditPromptSettings = () => console.log('Edit prompt settings');

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
            <Breadcrumb items={[{ label: 'Agent', href: '/agent/list' }, { label: agent.name }]} />
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
        {/* Agent Header Card */}
        <AgentHeader
          name={agent.name}
          description={agent.description}
          tags={agent.tags}
          isFavorite={isFavorite}
          status={agent.status}
          model={agent.model}
          modelProvider={agent.modelProvider}
          chats={agent.chats}
          updatedAt={agent.updatedAt}
          createdAt={agent.createdAt}
          onFavoriteToggle={handleFavoriteToggle}
          onDeactivate={handleDeactivate}
          onConnectDataSource={handleConnectDataSource}
          onConnectMCPServer={handleConnectMCPServer}
          onDelete={handleDelete}
        />

        {/* Tabs Section */}
        <div className="flex flex-col gap-3 w-full">
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
            <TabList>
              <Tab value="information">Information</Tab>
              <Tab value="data-sources">Data sources</Tab>
              <Tab value="mcp-servers">MCP servers</Tab>
              <Tab value="execution-logs">Execution logs</Tab>
              <Tab value="status-history">Status history</Tab>
            </TabList>

            <TabPanel value="information">
              <InformationTab
                agentName={agent.name}
                description={agent.description}
                tags={agent.tags}
                modelProvider={agent.modelProviderDisplay}
                model={agent.modelDisplay}
                temperature={agent.temperature}
                systemPrompt={agent.systemPrompt}
                tone={agent.tone}
                maxTokens={agent.maxTokens}
                maxIteration={agent.maxIteration}
                onEditBasicInfo={handleEditBasicInfo}
                onEditModelSettings={handleEditModelSettings}
                onEditPromptSettings={handleEditPromptSettings}
              />
            </TabPanel>

            <TabPanel value="data-sources">
              <DataSourcesTab />
            </TabPanel>

            <TabPanel value="mcp-servers">
              <MCPServersTab />
            </TabPanel>

            <TabPanel value="execution-logs">
              <ExecutionLogsTab />
            </TabPanel>

            <TabPanel value="status-history">
              <StatusHistoryTab />
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}

export default AgentDetailPage;
