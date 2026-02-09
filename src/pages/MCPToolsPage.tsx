import { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Tabs,
  TabList,
  Tab,
  Table,
  SearchInput,
  Pagination,
  ListToolbar,
  StatusIndicator,
  ContextMenu,
  Badge,
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
  IconDotsCircleHorizontal,
  IconStar,
  IconStarFilled,
  IconTarget,
  IconAlertTriangle,
  IconCircleX,
  IconLock,
  IconBell,
  IconPalette,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Status Card Component
   ---------------------------------------- */
interface StatusCardProps {
  label: string;
  count: number;
  status: 'active' | 'deactive' | 'error';
}

function StatusCard({ label, count, status }: StatusCardProps) {
  let bgColor = 'bg-[var(--color-surface-subtle)]';
  let iconBg = 'bg-[var(--color-text-muted)]';

  if (status === 'active') {
    bgColor = 'bg-[var(--color-state-success-bg)]';
    iconBg = 'bg-[var(--color-success)]';
  } else if (status === 'error') {
    bgColor = 'bg-[var(--color-state-danger-bg)]';
    iconBg = 'bg-[var(--color-danger)]';
  }

  const getStatusIcon = () => {
    if (status === 'active') {
      return <IconTarget size={12} stroke={1} className="text-white" />;
    } else if (status === 'deactive') {
      return <IconCircleX size={12} stroke={1.5} className="text-white" />;
    } else if (status === 'error') {
      return <IconAlertTriangle size={12} stroke={1} className="text-white" />;
    }
  };

  return (
    <div
      className={`${bgColor} flex flex-[1_0_0] items-center justify-between min-h-px min-w-px px-4 py-3 relative rounded-lg shrink-0`}
    >
      <div className="flex flex-col gap-1.5 items-start leading-4 not-italic relative shrink-0">
        <p className="text-label-sm leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
          {label}
        </p>
        <p className="text-body-md leading-[var(--line-height-18)] text-[var(--color-text-default)]">
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
   MCP Tool Table Row Data Type
   ---------------------------------------- */
interface MCPToolRow {
  id: string;
  favorite: boolean;
  status: 'active' | 'deactive' | 'error' | 'processing' | 'deleted';
  title: string;
  mcpServer: {
    thumbnail: string;
    label: string;
  };
  category: string;
  tags: string[];
  createdAt: string;
}

interface MCPToolCard {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  tags: string[];
}

interface TemplateRow {
  id: string;
  title: string;
  isOfficial: boolean;
  visibility: 'visible' | 'hidden';
  category: string;
  tools: number;
  updatedAt: string;
  createdAt: string;
}

/* ----------------------------------------
   Main MCPToolsPage Component
   ---------------------------------------- */
export function MCPToolsPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('my-servers');
  const [templateVisibility, setTemplateVisibility] = useState<
    Record<string, 'visible' | 'hidden'>
  >({});
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Status mapping for StatusIndicator
  const statusMap: Record<
    MCPToolRow['status'],
    'active' | 'error' | 'building' | 'deactivated' | 'pending'
  > = {
    active: 'active',
    deactive: 'deactivated',
    error: 'error',
    processing: 'building',
    deleted: 'pending',
  };

  // Templates mock data
  const templates: TemplateRow[] = Array.from({ length: 10 }, (_, i) => ({
    id: `template-${i + 1}`,
    title: i === 0 ? 'LableLableLal' : 'Lable',
    isOfficial: i === 0,
    visibility: i === 1 ? 'visible' : i % 2 === 0 ? 'visible' : 'hidden',
    category: 'Communication',
    tools: 99,
    updatedAt: 'Nov 11, 2025, 2:51 PM',
    createdAt: 'Nov 11, 2025, 2:51 PM',
  }));

  // Initialize template visibility state
  useEffect(() => {
    const initialVisibility: Record<string, 'visible' | 'hidden'> = {};
    templates.forEach((template) => {
      initialVisibility[template.id] = template.visibility;
    });
    setTemplateVisibility(initialVisibility);
  }, []);

  // Catalog mock data
  const catalogTools: MCPToolCard[] = Array.from({ length: 30 }, (_, i) => {
    const services = [
      {
        name: 'Brave Search',
        category: 'Search',
        thumbnail: 'https://brave.com/favicon.ico',
        description:
          'Search the web using Brave Search API. Get real-time search results, news, and web content for AI-powered research. Search the web',
        tags: [
          'Search',
          'API',
          'Web',
          'Research',
          'News',
          'Content',
          'Real-time',
          'AI',
          'Brave',
          'Browser',
          'Results',
          'Query',
        ],
      },
      {
        name: 'Slack',
        category: 'Communication',
        thumbnail: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png',
        description:
          'Integrate with Slack workspace. Send messages, manage channels, and interact with your team through Slack API.',
        tags: [
          'Messaging',
          'Team',
          'Real-time',
          'Channels',
          'Notifications',
          'Collaboration',
          'Workspace',
          'Bot',
          'Integration',
          'API',
          'Chat',
          'Workflow',
        ],
      },
      {
        name: 'Google Cloud',
        category: 'Cloud',
        thumbnail:
          'https://www.gstatic.com/devrel-devsite/prod/v45f61267e22832169f15f7bd89df90716b1247c7ea97ba8f337e025024a0b67/cloud/images/favicons/onecloud/favicon.ico',
        description:
          'Access Google Cloud Platform services. Manage compute, storage, and data analytics resources through GCP APIs.',
        tags: [
          'Infrastructure',
          'Storage',
          'Compute',
          'BigQuery',
          'Cloud Functions',
          'GCP',
          'Analytics',
          'Data',
          'Serverless',
          'API',
          'Resources',
          'Management',
        ],
      },
      {
        name: 'GitHub',
        category: 'Development',
        thumbnail: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        description:
          'Interact with GitHub repositories. Manage issues, pull requests, and automate development workflows.',
        tags: [
          'CI/CD',
          'Version Control',
          'Automation',
          'Pull Request',
          'Workflow',
          'Repository',
          'Issues',
          'Code',
          'Git',
          'DevOps',
          'Integration',
          'Projects',
        ],
      },
      {
        name: 'Notion',
        category: 'Productivity',
        thumbnail: 'https://www.notion.so/images/logo-ios.png',
        description:
          'Connect to Notion workspaces. Read and write pages, databases, and manage your knowledge base.',
        tags: [
          'Documentation',
          'Notes',
          'Wiki',
          'Database',
          'Templates',
          'Knowledge',
          'Pages',
          'Workspace',
          'Collaboration',
          'Organization',
          'Content',
          'Management',
        ],
      },
    ];
    const service = services[i % services.length];
    return {
      id: `catalog-${i + 1}`,
      title: service.name,
      category: service.category,
      description: service.description,
      thumbnail: service.thumbnail,
      tags: service.tags,
    };
  });

  // Mock data
  const mcpTools: MCPToolRow[] = [
    {
      id: '1',
      favorite: false,
      status: 'active',
      title: 'Slack Integration Tool',
      mcpServer: {
        thumbnail: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png',
        label: 'slack',
      },
      category: 'Communication',
      tags: ['Messaging', 'Team', 'Real-time'],
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
    {
      id: '2',
      favorite: false,
      status: 'deactive',
      title: 'Google Cloud Platform',
      mcpServer: {
        thumbnail:
          'https://www.gstatic.com/devrel-devsite/prod/v45f61267e22832169f15f7bd89df90716b1247c7ea97ba8f337e025024a0b67/cloud/images/favicons/onecloud/favicon.ico',
        label: 'google-cloud',
      },
      category: 'Cloud',
      tags: ['Infrastructure', 'Storage', 'Compute', 'BigQuery', 'Cloud Functions'],
      createdAt: 'Nov 10, 2025, 10:30 AM',
    },
    {
      id: '3',
      favorite: false,
      status: 'error',
      title: 'Microsoft Teams Connector',
      mcpServer: {
        thumbnail: 'https://cdn-icons-png.flaticon.com/512/732/732221.png',
        label: 'teams',
      },
      category: 'Communication',
      tags: ['Video', 'Meeting', 'Collaboration', 'Office 365', 'SharePoint'],
      createdAt: 'Nov 9, 2025, 4:15 PM',
    },
    {
      id: '4',
      favorite: false,
      status: 'processing',
      title: 'GitHub Actions MCP',
      mcpServer: {
        thumbnail: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        label: 'github',
      },
      category: 'Development',
      tags: ['CI/CD', 'Version Control', 'Automation', 'Pull Request', 'Workflow'],
      createdAt: 'Nov 8, 2025, 1:20 PM',
    },
    {
      id: '5',
      favorite: false,
      status: 'deleted',
      title: 'Notion Workspace',
      mcpServer: {
        thumbnail: 'https://www.notion.so/images/logo-ios.png',
        label: 'notion',
      },
      category: 'Productivity',
      tags: ['Documentation', 'Notes', 'Wiki', 'Database', 'Templates'],
      createdAt: 'Nov 7, 2025, 9:45 AM',
    },
    {
      id: '6',
      favorite: false,
      status: 'active',
      title: 'Discord Bot Integration',
      mcpServer: {
        thumbnail: 'https://discord.com/assets/f9bb9c4af2b9c32a2c5ee0014661546d.png',
        label: 'discord',
      },
      category: 'Communication',
      tags: ['Chat', 'Community', 'Bot', 'Voice', 'Gaming'],
      createdAt: 'Nov 6, 2025, 3:30 PM',
    },
    {
      id: '7',
      favorite: false,
      status: 'active',
      title: 'AWS Services Connector',
      mcpServer: {
        thumbnail: 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png',
        label: 'aws',
      },
      category: 'Cloud',
      tags: ['S3', 'Lambda', 'EC2', 'RDS', 'CloudWatch'],
      createdAt: 'Nov 5, 2025, 11:00 AM',
    },
    {
      id: '8',
      favorite: false,
      status: 'active',
      title: 'Jira Project Management',
      mcpServer: {
        thumbnail:
          'https://wac-cdn.atlassian.com/dam/jcr:616e6748-ad8c-48d9-ae93-e49019ed5259/Jira.svg',
        label: 'jira',
      },
      category: 'Productivity',
      tags: ['Project', 'Issue Tracking', 'Agile', 'Sprint', 'Backlog'],
      createdAt: 'Nov 4, 2025, 2:15 PM',
    },
    {
      id: '9',
      favorite: false,
      status: 'active',
      title: 'Linear Issue Tracker',
      mcpServer: {
        thumbnail: 'https://linear.app/favicon.ico',
        label: 'linear',
      },
      category: 'Development',
      tags: ['Issue', 'Sprint', 'Planning', 'Roadmap', 'Milestone'],
      createdAt: 'Nov 3, 2025, 8:30 AM',
    },
    {
      id: '10',
      favorite: false,
      status: 'active',
      title: 'Figma Design system',
      mcpServer: {
        thumbnail: 'https://www.figma.com/favicon.ico',
        label: 'figma',
      },
      category: 'Design',
      tags: ['UI/UX', 'Prototype', 'Collaboration', 'Design system', 'Components'],
      createdAt: 'Nov 2, 2025, 5:45 PM',
    },
  ];

  // Filter tools by search
  const filteredTools = useMemo(() => {
    if (!searchQuery) return mcpTools;

    return mcpTools.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.mcpServer.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mcpTools, searchQuery]);

  const totalPages = Math.ceil(filteredTools.length / rowsPerPage);
  const paginatedTools = useMemo(() => {
    return filteredTools.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredTools, currentPage, rowsPerPage]);

  // Filter templates by search
  const filteredTemplates = useMemo(() => {
    if (!searchQuery) return templates;

    return templates.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [templates, searchQuery]);

  const templateTotalPages = Math.ceil(filteredTemplates.length / rowsPerPage);
  const paginatedTemplates = useMemo(() => {
    return filteredTemplates.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredTemplates, currentPage, rowsPerPage]);

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    // In a real app, this would update the state
    console.log('Toggle favorite:', id);
  };

  // MCP Tools Table columns
  const toolColumns: TableColumn<MCPToolRow>[] = [
    {
      key: 'favorite',
      label: '',
      width: fixedColumns.favorite,
      align: 'center',
      headerRender: () => (
        <div className="flex items-center justify-center w-full">
          <IconStar size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </div>
      ),
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(row.id);
          }}
          className="p-1 rounded hover:bg-[var(--color-surface-subtle)] transition-colors"
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
      render: (_, row) => <StatusIndicator status={statusMap[row.status]} layout="icon-only" />,
    },
    {
      key: 'title',
      label: 'Title',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row) => (
        <span
          className="text-[var(--color-action-primary)] font-medium hover:underline cursor-pointer truncate block"
          title={value}
          onClick={() => navigate(`/mcp-tools/${row.id}`)}
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
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded bg-[var(--color-surface-subtle)] flex items-center justify-center overflow-hidden shrink-0 p-0.5">
            <img
              src={row.mcpServer.thumbnail}
              alt={row.mcpServer.label}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-body-xs text-[var(--color-text-muted)]">${row.mcpServer.label.charAt(0).toUpperCase()}</span>`;
                }
              }}
            />
          </div>
          <span className="truncate" title={row.mcpServer.label}>
            {row.mcpServer.label}
          </span>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      flex: 1,
      minWidth: columnMinWidths.category,
      sortable: true,
    },
    {
      key: 'tags',
      label: 'Tags',
      flex: 1,
      minWidth: columnMinWidths.labels,
      sortable: false,
      render: (_, row) => (
        <div className="flex gap-1 items-center overflow-hidden">
          {row.tags.slice(0, 2).map((tag, idx) => (
            <Badge key={idx} theme="gray" type="subtle" size="sm">
              {tag}
            </Badge>
          ))}
          {row.tags.length > 2 && (
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              +{row.tags.length - 2}
            </span>
          )}
        </div>
      ),
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
          <div onClick={(e) => e.stopPropagation()}>
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

  // Templates Table columns
  const templateColumns: TableColumn<TemplateRow>[] = [
    {
      key: 'title',
      label: 'Title',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-2 min-w-0">
          {row.isOfficial && (
            <Badge theme="blue" type="subtle" size="sm" className="shrink-0">
              Official
            </Badge>
          )}
          <span
            className="text-[var(--color-action-primary)] font-medium hover:underline cursor-pointer truncate"
            title={row.title}
          >
            {row.title}
          </span>
        </div>
      ),
    },
    {
      key: 'visibility',
      label: 'Visibility',
      width: fixedColumns.locked,
      align: 'center',
      sortable: false,
      render: (_, row) => {
        const currentVisibility = templateVisibility[row.id] || row.visibility;
        return currentVisibility === 'hidden' ? (
          <IconLock size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        ) : null;
      },
    },
    {
      key: 'category',
      label: 'Category',
      flex: 1,
      minWidth: columnMinWidths.category,
      sortable: true,
    },
    {
      key: 'tools',
      label: 'Tools',
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
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'toggle-visibility',
            label: templateVisibility[row.id] === 'visible' ? 'Hide' : 'Show',
            onClick: () => {
              setTemplateVisibility((prev) => ({
                ...prev,
                [row.id]: prev[row.id] === 'visible' ? 'hidden' : 'visible',
              }));
            },
          },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => console.log('Delete:', row.id),
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
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
          breadcrumb={<Breadcrumb items={[{ label: 'MCP Tools' }]} />}
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
      <VStack gap={3}>
        <PageHeader title="MCP tools" />

        {/* Tabs */}
        <div className="w-full">
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
            <TabList>
              <Tab value="my-servers">My servers</Tab>
              <Tab value="catalog">Catalog</Tab>
              <Tab value="templates">Templates</Tab>
            </TabList>
          </Tabs>
        </div>

        {/* Status Cards - Only for My servers tab */}
        {activeTab === 'my-servers' && (
          <div className="flex gap-2 items-center relative shrink-0 w-full">
            <StatusCard label="Active" count={7} status="active" />
            <StatusCard label="Deactive" count={1} status="deactive" />
            <StatusCard label="Error" count={1} status="error" />
          </div>
        )}

        {/* List Toolbar, Pagination, Table - Grouped with 12px gap */}
        {activeTab === 'my-servers' && (
          <div className="flex flex-col gap-3 w-full">
            {/* List Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[var(--search-input-width)]">
                    <SearchInput
                      placeholder="Search MCP tools by attributes"
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
                    disabled={selectedTools.length === 0}
                  >
                    Delete
                  </Button>
                </ListToolbar.Actions>
              }
            />

            {/* Pagination */}
            {filteredTools.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredTools.length}
                selectedCount={selectedTools.length}
              />
            )}

            {/* Table */}
            <Table<MCPToolRow>
              columns={toolColumns}
              data={paginatedTools}
              rowKey="id"
              emptyMessage="No MCP tools found"
              selectable
              selectedKeys={selectedTools}
              onSelectionChange={setSelectedTools}
            />
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="flex flex-col gap-3 w-full">
            {/* List Toolbar with Create Button */}
            <div className="flex items-center justify-between w-full">
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <div className="w-[var(--search-input-width)]">
                      <SearchInput
                        placeholder="Search templates by attributes"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        size="sm"
                        fullWidth
                      />
                    </div>
                  </ListToolbar.Actions>
                }
              />
              <Button size="md" variant="primary" onClick={() => navigate('/mcp-tools/create')}>
                Create template
              </Button>
            </div>

            {/* Pagination */}
            {filteredTemplates.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={templateTotalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredTemplates.length}
                selectedCount={selectedTemplates.length}
              />
            )}

            {/* Table */}
            <Table<TemplateRow>
              columns={templateColumns}
              data={paginatedTemplates}
              rowKey="id"
              emptyMessage="No templates found"
              selectable
              selectedKeys={selectedTemplates}
              onSelectionChange={setSelectedTemplates}
            />
          </div>
        )}

        {activeTab === 'catalog' && (
          /* Catalog Grid */
          <div className="grid grid-cols-3 gap-4 relative shrink-0 w-full">
            {catalogTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] flex flex-col gap-3 items-start p-4 rounded-md relative shrink-0"
              >
                {/* Thumbnail */}
                <div className="flex items-center justify-center w-6 h-6 shrink-0 rounded-[6px] border border-[var(--color-border-default)] overflow-hidden bg-[var(--color-surface-subtle)]">
                  <img
                    src={tool.thumbnail}
                    alt={tool.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                                <div class="flex flex-wrap w-full h-full">
                                  <div class="w-1/2 h-1/2 bg-[var(--primitive-color-yellow400)]"></div>
                                  <div class="w-1/2 h-1/2 bg-[var(--primitive-color-green400)]"></div>
                                  <div class="w-1/2 h-1/2 bg-[var(--primitive-color-blue400)]"></div>
                                  <div class="w-1/2 h-1/2 bg-[var(--primitive-color-red400)]"></div>
                                </div>
                              `;
                      }
                    }}
                  />
                </div>

                {/* Title */}
                <div className="flex flex-col items-start justify-center relative shrink-0 w-full">
                  <p className="text-label-lg leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                    {tool.title}
                  </p>
                </div>

                {/* Category */}
                <div className="flex flex-col items-start justify-center relative shrink-0">
                  <p className="text-body-md leading-[var(--line-height-16)] text-[var(--color-action-primary)]">
                    {tool.category}
                  </p>
                </div>

                {/* Description */}
                <div className="flex flex-col items-start justify-center relative shrink-0 w-full">
                  <p className="text-body-md leading-[var(--line-height-20)] text-[var(--color-text-subtle)] line-clamp-3">
                    {tool.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex gap-1 items-center flex-wrap relative shrink-0 w-full">
                  {tool.tags.slice(0, 10).map((tag, idx) => (
                    <div
                      key={idx}
                      className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] px-2 py-0.5 rounded-md text-body-sm leading-4 text-[var(--color-text-default)] whitespace-nowrap flex-shrink-0"
                    >
                      {tag}
                    </div>
                  ))}
                  {tool.tags.length > 10 && (
                    <span className="text-body-sm text-[var(--color-text-default)] whitespace-nowrap flex-shrink-0 ml-1">
                      +{tool.tags.length - 10}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </VStack>
    </PageShell>
  );
}

export default MCPToolsPage;
