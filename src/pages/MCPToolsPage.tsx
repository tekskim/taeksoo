import { useState, useRef, useEffect, useCallback } from 'react';
import {
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Button,
  Tooltip,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Select,
} from '@/design-system';
import { useTabs } from '@/contexts/TabContext';
import {
  IconMessage,
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
  IconTarget,
  IconAlertTriangle,
  IconLoader2,
  IconDotsVertical,
  IconSquare,
  IconSquareRounded,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react';
import { Icons } from '@/design-system';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThakiSymbol from '@/assets/thakiSymbol.svg';
import { useDarkMode } from '@/hooks/useDarkMode';

/* ----------------------------------------
   Status Card Component
   ---------------------------------------- */
interface StatusCardProps {
  label: string;
  count: number;
  status: 'active' | 'deactive' | 'error';
}

function StatusCard({ label, count, status }: StatusCardProps) {
  let bgColor = 'bg-[var(--color-surface-subtle,#f8fafc)]';
  let iconBg = 'bg-[var(--color-text-muted,#475569)]';
  
  if (status === 'active') {
    bgColor = 'bg-[var(--color-state-success-bg,#f0fdf4)]';
    iconBg = 'bg-[var(--color-success,#4ade80)]';
  } else if (status === 'error') {
    bgColor = 'bg-[var(--color-state-danger-bg,#fef2f2)]';
    iconBg = 'bg-[var(--color-danger,#ef4444)]';
  }

  const getStatusIcon = () => {
    if (status === 'active') {
      return (
        <IconTarget size={12} stroke={1} className="text-white" />
      );
    } else if (status === 'deactive') {
      return (
        <div className="flex flex-col gap-0.5 items-center justify-center">
          <div className="h-1 w-2 bg-white rounded-sm" />
          <div className="h-1 w-2 bg-white rounded-sm" />
        </div>
      );
    } else if (status === 'error') {
      return (
        <IconAlertTriangle size={12} stroke={1} className="text-white" />
      );
    }
  };

  return (
    <div className={`${bgColor} flex flex-[1_0_0] items-center justify-between min-h-px min-w-px px-4 py-3 relative rounded-lg shrink-0`}>
      <div className="flex flex-col gap-1.5 items-start leading-4 not-italic relative shrink-0">
        <p className="font-['Mona_Sans:Medium',sans-serif] relative shrink-0 text-[var(--color-text-subtle,#64748b)] text-[11px]">
          {label}
        </p>
        <p className="font-['Mona_Sans:Regular',sans-serif] relative shrink-0 text-[var(--color-text-default,#0f172a)] text-[12px]">
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
   Agent Sidebar Component (Reused)
   ---------------------------------------- */
export function AgentSidebar() {
  const { isDark } = useDarkMode();
  const location = useLocation();

  return (
    <nav className="fixed left-0 top-0 w-[62px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col items-center pb-3 pt-0 px-0 z-50">
      {/* Logo */}
      <Link
        to="/"
        className="border-b border-[var(--color-border-default)] flex h-[33px] items-center justify-center px-3 py-0 relative shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors"
      >
        <div className="flex items-center relative shrink-0">
          <img 
            src={ThakiSymbol} 
            alt="THAKI" 
            className="h-[18px] w-[18px]"
          />
        </div>
      </Link>

      {/* Menu Items Container */}
      <div className="flex flex-[1_0_0] flex-col items-center justify-between min-h-px min-w-px pb-0 pt-1.5 px-2 relative shrink-0">
        {/* Top Menu Items */}
        <div className="flex flex-col gap-2 items-start relative shrink-0">
          {/* Chat */}
          <Tooltip content="Chat" position="right">
            <Link
              to="/chat"
              className={`flex flex-col gap-0.5 items-center justify-center px-2 py-1.5 relative rounded-md shrink-0 size-[46px] transition-colors ${
                location.pathname === '/chat' 
                  ? 'bg-[var(--color-info-weak-bg,#eff6ff)]' 
                  : 'bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]'
              }`}
            >
              <IconMessage 
                size={22} 
                stroke={1} 
                className={location.pathname === '/chat' ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-muted)]'} 
              />
            </Link>
          </Tooltip>

          {/* Robot */}
          <Tooltip content="Agent" position="right">
            <Link
              to="/agent"
              className={`flex flex-col gap-0.5 items-center justify-center px-2 py-1.5 relative rounded-md shrink-0 size-[46px] transition-colors ${
                location.pathname === '/agent' 
                  ? 'bg-[var(--color-info-weak-bg,#eff6ff)]' 
                  : 'bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]'
              }`}
            >
              <Icons.Robot 
                size={22} 
                stroke={1} 
                className={location.pathname === '/agent' ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-muted)]'} 
              />
            </Link>
          </Tooltip>

          {/* Data sources */}
          <Tooltip content="Data sources" position="right">
            <Link
              to="/storage"
              className={`flex flex-col gap-0.5 items-center justify-center px-2 py-1.5 relative rounded-md shrink-0 size-[46px] transition-colors ${
                location.pathname === '/storage' 
                  ? 'bg-[var(--color-info-weak-bg,#eff6ff)]' 
                  : 'bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]'
              }`}
            >
              <IconDatabase 
                size={22} 
                stroke={1} 
                className={location.pathname === '/storage' ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-muted)]'} 
              />
            </Link>
          </Tooltip>

          {/* MCP tools */}
          <Tooltip content="MCP tools" position="right">
            <Link
              to="/mcp-tools"
              className={`flex flex-col gap-0.5 items-center justify-center px-2 py-1.5 relative rounded-md shrink-0 size-[46px] transition-colors ${
                location.pathname === '/mcp-tools' 
                  ? 'bg-[var(--color-info-weak-bg,#eff6ff)]' 
                  : 'bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]'
              }`}
            >
              <IconPuzzle 
                size={22} 
                stroke={1} 
                className={location.pathname === '/mcp-tools' ? 'text-[var(--color-action-primary)]' : 'text-[var(--color-text-muted)]'} 
              />
            </Link>
          </Tooltip>
        </div>

        {/* Settings (Bottom) */}
        <div className="flex flex-col gap-0 items-start relative shrink-0">
          <Tooltip content="Settings" position="right">
            <Link
              to="/agent"
              className="bg-[var(--color-surface-default)] flex flex-col gap-0.5 items-center justify-center px-2 py-1.5 relative rounded-md shrink-0 size-[46px] hover:bg-[var(--color-surface-muted)] transition-colors"
            >
              <IconSettings size={22} stroke={1} className="text-[var(--color-text-default)]" />
            </Link>
          </Tooltip>
        </div>
      </div>
    </nav>
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
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
  const navigate = useNavigate();
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('my-servers');
  const [templateVisibility, setTemplateVisibility] = useState<Record<string, 'visible' | 'hidden'>>({});

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Templates mock data
  const templates: TemplateRow[] = Array.from({ length: 10 }, (_, i) => ({
    id: `template-${i + 1}`,
    title: i === 0 ? 'LableLableLal' : 'Lable',
    isOfficial: i === 0,
    visibility: i === 1 ? 'visible' : (i % 2 === 0 ? 'visible' : 'hidden'),
    category: 'Communication',
    tools: 99,
    updatedAt: 'Nov 11, 2025, 2:51 PM',
    createdAt: 'Nov 11, 2025, 2:51 PM',
  }));

  // Initialize template visibility state
  useEffect(() => {
    const initialVisibility: Record<string, 'visible' | 'hidden'> = {};
    templates.forEach(template => {
      initialVisibility[template.id] = template.visibility;
    });
    setTemplateVisibility(initialVisibility);
  }, []);

  // Catalog mock data
  const catalogTools: MCPToolCard[] = Array.from({ length: 30 }, (_, i) => {
    const services = [
      { name: 'Brave Search', category: 'Search', thumbnail: 'https://brave.com/favicon.ico', description: 'Search the web using Brave Search API. Get real-time search results, news, and web content for AI-powered research. Search the web', tags: ['Search', 'API', 'Web', 'Research', 'News', 'Content', 'Real-time', 'AI', 'Brave', 'Browser', 'Results', 'Query'] },
      { name: 'Slack', category: 'Communication', thumbnail: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png', description: 'Integrate with Slack workspace. Send messages, manage channels, and interact with your team through Slack API.', tags: ['Messaging', 'Team', 'Real-time', 'Channels', 'Notifications', 'Collaboration', 'Workspace', 'Bot', 'Integration', 'API', 'Chat', 'Workflow'] },
      { name: 'Google Cloud', category: 'Cloud', thumbnail: 'https://www.gstatic.com/devrel-devsite/prod/v45f61267e22832169f15f7bd89df90716b1247c7ea97ba8f337e025024a0b67/cloud/images/favicons/onecloud/favicon.ico', description: 'Access Google Cloud Platform services. Manage compute, storage, and data analytics resources through GCP APIs.', tags: ['Infrastructure', 'Storage', 'Compute', 'BigQuery', 'Cloud Functions', 'GCP', 'Analytics', 'Data', 'Serverless', 'API', 'Resources', 'Management'] },
      { name: 'GitHub', category: 'Development', thumbnail: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', description: 'Interact with GitHub repositories. Manage issues, pull requests, and automate development workflows.', tags: ['CI/CD', 'Version Control', 'Automation', 'Pull Request', 'Workflow', 'Repository', 'Issues', 'Code', 'Git', 'DevOps', 'Integration', 'Projects'] },
      { name: 'Notion', category: 'Productivity', thumbnail: 'https://www.notion.so/images/logo-ios.png', description: 'Connect to Notion workspaces. Read and write pages, databases, and manage your knowledge base.', tags: ['Documentation', 'Notes', 'Wiki', 'Database', 'Templates', 'Knowledge', 'Pages', 'Workspace', 'Collaboration', 'Organization', 'Content', 'Management'] },
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
        thumbnail: 'https://www.gstatic.com/devrel-devsite/prod/v45f61267e22832169f15f7bd89df90716b1247c7ea97ba8f337e025024a0b67/cloud/images/favicons/onecloud/favicon.ico',
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
        thumbnail: 'https://wac-cdn.atlassian.com/dam/jcr:616e6748-ad8c-48d9-ae93-e49019ed5259/Jira.svg',
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
      title: 'Figma Design System',
      mcpServer: {
        thumbnail: 'https://www.figma.com/favicon.ico',
        label: 'figma',
      },
      category: 'Design',
      tags: ['UI/UX', 'Prototype', 'Collaboration', 'Design System', 'Components'],
      createdAt: 'Nov 2, 2025, 5:45 PM',
    },
  ];

  const getStatusIcon = (status: MCPToolRow['status']) => {
    let iconBg = 'bg-[var(--color-text-muted,#475569)]';
    
    if (status === 'active') {
      iconBg = 'bg-[var(--color-success,#4ade80)]';
    } else if (status === 'deactive') {
      iconBg = 'bg-[var(--color-info,#3b82f6)]';
    } else if (status === 'error' || status === 'deleted') {
      iconBg = 'bg-[var(--color-danger,#ef4444)]';
    } else if (status === 'processing') {
      iconBg = 'bg-[var(--color-info,#3b82f6)]';
    }

    return (
      <div className={`${iconBg} flex gap-0 items-center justify-center p-1 relative rounded-full shrink-0 size-6`}>
        {status === 'active' && (
          <IconTarget size={12} stroke={1} className="text-white" />
        )}
        {status === 'deactive' && (
          <div className="flex flex-col gap-0.5 items-center justify-center">
            <div className="h-1 w-2 bg-white rounded-sm" />
            <div className="h-1 w-2 bg-white rounded-sm" />
          </div>
        )}
        {status === 'error' && (
          <IconAlertTriangle size={12} stroke={1} className="text-white" />
        )}
        {status === 'processing' && (
          <IconLoader2 size={12} stroke={1} className="text-white animate-spin" />
        )}
        {status === 'deleted' && (
          <IconTrash size={12} stroke={1} className="text-white" />
        )}
      </div>
    );
  };

  const getStatusLabel = (status: MCPToolRow['status']) => {
    switch (status) {
      case 'active':
        return 'Official';
      case 'deactive':
        return 'Lable';
      case 'error':
        return 'Lable';
      case 'processing':
        return 'Lable';
      case 'deleted':
        return 'Lable';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)] flex items-start" style={{ minWidth: '1440px', width: '1440px', height: '1020px' }}>
      <AgentSidebar />

      <main className="flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative shrink-0 bg-[var(--color-surface-default)] ml-[62px]">
        <div className="min-w-[var(--layout-content-min-width)] w-full h-full flex flex-col">
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            showAddButton={true}
            showWindowControls={true}
          />

          <TopBar
            showSidebarToggle={false}
            showNavigation={true}
            canGoBack={false}
            canGoForward={false}
            onBack={() => {}}
            onForward={() => {}}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'MCP tools' },
                ]}
              />
            }
            actions={
              <>
                <TopBarAction
                  icon={<IconBell size={16} stroke={1} />}
                  aria-label="Notifications"
                  badge={true}
                />
                <TopBarAction
                  icon={<IconPalette size={16} stroke={1} />}
                  onClick={() => navigate('/design-system')}
                  aria-label="Design System"
                />
              </>
            }
          />

          {/* Main Content */}
          <div className="bg-[var(--color-surface-default)] flex flex-[1_0_0] flex-col gap-6 items-center min-h-px min-w-px pb-3 pt-6 px-8 relative shrink-0 w-full overflow-y-auto">
            <div className="flex flex-col gap-6 items-start min-w-[1176px] relative shrink-0 w-full">
              {/* Header */}
              <div className="flex items-center justify-between relative shrink-0 w-full">
                <div className="flex flex-col items-start justify-center relative shrink-0">
                  <div className="flex items-center relative shrink-0">
                    <p className="font-['Mona_Sans:SemiBold',sans-serif] leading-7 not-italic relative shrink-0 text-[var(--color-text-default)] text-[18px]">
                      MCP tools
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs and CTA Button */}
              <div className="flex items-center justify-between relative shrink-0 w-full">
                <div className="flex-1 min-w-0">
                  <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
                    <TabList>
                      <Tab value="my-servers">My servers</Tab>
                      <Tab value="catalog">Catalog</Tab>
                      <Tab value="templates">Templates</Tab>
                    </TabList>
                  </Tabs>
                </div>
                {activeTab === 'templates' && (
                  <div className="ml-4 shrink-0">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {}}
                    >
                      Create template
                    </Button>
                  </div>
                )}
              </div>

              {/* Status Cards - Only for My servers tab */}
              {activeTab === 'my-servers' && (
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <StatusCard label="Active" count={7} status="active" />
                  <StatusCard label="Deactive" count={1} status="deactive" />
                  <StatusCard label="Error" count={1} status="error" />
                </div>
              )}

              {/* Filters */}
              <div className="flex gap-2 items-center relative shrink-0 w-full">
                <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] flex items-center justify-between min-w-[200px] pl-2.5 pr-2 py-1.5 relative rounded-md shrink-0 w-[280px]">
                  <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-subtle)] text-[11px]">
                    {activeTab === 'templates' ? 'Find templates with filters' : 'Find MCP tools with filters'}
                  </p>
                  <IconSearch size={12} stroke={1} className="text-[var(--color-text-muted)] shrink-0" />
                </div>
                {activeTab === 'my-servers' && (
                  <>
                    <div className="bg-[var(--color-border-default)] h-4 shrink-0 w-px" />
                    <button className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] flex gap-1.5 items-center justify-center pl-2 pr-2.5 py-1.5 relative rounded-md shrink-0">
                      <IconTrash size={12} stroke={1} className="text-[var(--color-text-muted,#94a3b8)] shrink-0" />
                      <p className="font-['Mona_Sans:Medium',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-muted,#94a3b8)] text-[11px] text-center">
                        Delete
                      </p>
                    </button>
                  </>
                )}
              </div>

              {/* Pagination */}
              <div className="flex gap-2 h-6 items-center relative shrink-0 w-full">
                <div className="flex gap-2 items-center relative shrink-0">
                  <button className="flex gap-0 items-center justify-center relative shrink-0 size-6" disabled>
                    <IconChevronLeft size={16} stroke={1} className="text-[var(--color-border-default,#e2e8f0)]" />
                  </button>
                  <button className="bg-[var(--color-primary,#2563eb)] flex flex-col gap-0 items-center justify-center relative rounded-md shrink-0 size-6">
                    <p className="font-['Mona_Sans:Medium',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-inverted,white)] text-[11px]">
                      1
                    </p>
                  </button>
                  {[2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className="flex flex-col gap-0 items-center justify-center relative rounded-md shrink-0 size-6"
                      onClick={() => setCurrentPage(page)}
                    >
                      <p className="font-['Mona_Sans:Medium',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-subtle,#64748b)] text-[11px]">
                        {page}
                      </p>
                    </button>
                  ))}
                  <button className="flex gap-0 items-center justify-center relative shrink-0 size-6">
                    <IconDots size={16} stroke={1} className="text-[var(--color-text-muted)] rotate-90" />
                  </button>
                  <button className="flex flex-col gap-0 items-center justify-center relative rounded-md shrink-0 size-6">
                    <p className="font-['Mona_Sans:Medium',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-subtle,#64748b)] text-[11px]">
                      99
                    </p>
                  </button>
                  <button className="flex gap-0 items-center justify-center relative shrink-0 size-6">
                    <IconChevronRight size={16} stroke={1} className="text-[var(--color-text-default)]" />
                  </button>
                  <div className="bg-[var(--color-border-default)] h-4 shrink-0 w-px" />
                  <div className="flex font-['Mona_Sans:Medium',sans-serif] gap-0.5 h-6 items-center justify-center leading-4 not-italic relative shrink-0 text-[var(--color-text-subtle,#64748b)] text-[11px]">
                    <p className="relative shrink-0">99</p>
                    <p className="relative shrink-0">items</p>
                  </div>
                </div>
              </div>

              {/* Content based on active tab */}
              {activeTab === 'my-servers' && (
                /* Table */
                <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                {/* Table Header */}
                <div className="bg-[var(--color-border-subtle,#f1f5f9)] border border-[var(--color-border-default)] flex items-start overflow-clip relative rounded-t-md shrink-0 w-full">
                  <div className="flex gap-0 items-center justify-center p-3 relative shrink-0">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-[var(--color-border-default)]"
                      checked={selectedTools.length === mcpTools.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTools(mcpTools.map(t => t.id));
                        } else {
                          setSelectedTools([]);
                        }
                      }}
                    />
                  </div>
                  <div className="flex h-10 items-center justify-center px-3 py-0 relative shrink-0 w-[59px]">
                    <div className="flex gap-1.5 items-center relative shrink-0">
                      <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] text-center whitespace-nowrap">
                        <p className="leading-4">Status</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                    <div className="flex gap-1.5 items-center relative shrink-0">
                      <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                        <p className="leading-4">Title</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                    <div className="flex gap-1.5 items-center relative shrink-0">
                      <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                        <p className="leading-4">MCP server</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                    <div className="flex gap-1.5 items-center relative shrink-0">
                      <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                        <p className="leading-4">Category</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                    <div className="flex gap-1.5 items-center relative shrink-0">
                      <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                        <p className="leading-4">Tags</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                    <div className="flex gap-1.5 items-center relative shrink-0">
                      <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                        <p className="leading-4">Created at</p>
                      </div>
                      <IconChevronDown size={12} stroke={1} className="text-[var(--color-text-muted)]" />
                    </div>
                  </div>
                  <div className="flex h-10 items-center justify-center px-3 py-0 relative shrink-0 w-[72px]">
                    <div className="flex gap-1.5 items-center relative shrink-0">
                      <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] text-center whitespace-nowrap">
                        <p className="leading-4">Action</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table Rows */}
                {mcpTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] flex items-center relative rounded-md shrink-0 w-full"
                  >
                    <div className="flex gap-0 items-center justify-center p-3 relative shrink-0">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-[var(--color-border-default)]"
                        checked={selectedTools.includes(tool.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTools([...selectedTools, tool.id]);
                          } else {
                            setSelectedTools(selectedTools.filter(id => id !== tool.id));
                          }
                        }}
                      />
                    </div>
                    <div className="flex gap-0 items-center justify-center p-2 relative shrink-0 w-[59px]">
                      {getStatusIcon(tool.status)}
                    </div>
                    <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                      <div className="flex gap-1.5 items-center relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                          <p className="leading-4">{tool.title}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                      <div className="flex gap-2 items-center relative shrink-0">
                        {/* MCP server thumbnail */}
                        <div className="flex items-center justify-center w-6 h-6 shrink-0 rounded-[6px] border border-[var(--color-border-default)] overflow-hidden bg-[var(--color-surface-subtle)]">
                          <img 
                            src={tool.mcpServer.thumbnail} 
                            alt={tool.mcpServer.label}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to colored squares if image fails
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="flex flex-wrap w-full h-full">
                                    <div class="w-1/2 h-1/2 bg-yellow-400"></div>
                                    <div class="w-1/2 h-1/2 bg-green-400"></div>
                                    <div class="w-1/2 h-1/2 bg-blue-400"></div>
                                    <div class="w-1/2 h-1/2 bg-red-400"></div>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                        <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                          <p className="leading-4">{tool.mcpServer.label}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                      <div className="flex gap-1.5 items-start relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                          <p className="leading-4">{tool.category}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                      <div className="flex gap-1 items-center relative w-full min-w-0 max-w-full overflow-hidden">
                        {tool.tags.map((tag, idx) => {
                          // Show first 4 tags, then show +N if there are more
                          if (idx < 4) {
                            return (
                              <div
                                key={idx}
                                className="bg-[var(--color-surface-subtle,#f8fafc)] border border-[var(--color-border-default,#e2e8f0)] px-2 py-0.5 rounded-md text-[11px] leading-4 text-[var(--color-text-default)] whitespace-nowrap flex-shrink-0"
                              >
                                {tag}
                              </div>
                            );
                          }
                          return null;
                        })}
                        {tool.tags.length > 4 && (
                          <span className="text-[11px] text-[var(--color-text-default)] whitespace-nowrap flex-shrink-0 ml-1">
                            +{tool.tags.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                      <div className="flex gap-1.5 items-start relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                          <p className="leading-4">{tool.createdAt}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 items-center justify-center p-1.5 relative shrink-0 w-[72px]">
                      <button className="flex gap-0 items-center justify-center p-1.5 relative shrink-0 hover:bg-[var(--color-surface-muted)] rounded-md">
                        <IconDotsVertical size={16} stroke={1} className="text-[var(--color-text-muted)]" />
                      </button>
                    </div>
                  </div>
                ))}
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
                                  <div class="w-1/2 h-1/2 bg-yellow-400"></div>
                                  <div class="w-1/2 h-1/2 bg-green-400"></div>
                                  <div class="w-1/2 h-1/2 bg-blue-400"></div>
                                  <div class="w-1/2 h-1/2 bg-red-400"></div>
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>

                      {/* Title */}
                      <div className="flex flex-col items-start justify-center relative shrink-0 w-full">
                        <p className="font-['Mona_Sans:Medium',sans-serif] leading-5 not-italic relative shrink-0 text-[var(--color-text-default)] text-[14px]">
                          {tool.title}
                        </p>
                      </div>

                      {/* Category */}
                      <div className="flex flex-col items-start justify-center relative shrink-0">
                        <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-action-primary)] text-[12px]">
                          {tool.category}
                        </p>
                      </div>

                      {/* Description */}
                      <div className="flex flex-col items-start justify-center relative shrink-0 w-full">
                        <p className="font-['Mona_Sans:Regular',sans-serif] leading-5 not-italic relative shrink-0 text-[var(--color-text-subtle)] text-[12px] line-clamp-3">
                          {tool.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex gap-1 items-center flex-wrap relative shrink-0 w-full">
                        {tool.tags.slice(0, 10).map((tag, idx) => (
                          <div
                            key={idx}
                            className="bg-[var(--color-surface-subtle,#f8fafc)] border border-[var(--color-border-default,#e2e8f0)] px-2 py-0.5 rounded-md text-[11px] leading-4 text-[var(--color-text-default)] whitespace-nowrap flex-shrink-0"
                          >
                            {tag}
                          </div>
                        ))}
                        {tool.tags.length > 10 && (
                          <span className="text-[11px] text-[var(--color-text-default)] whitespace-nowrap flex-shrink-0 ml-1">
                            +{tool.tags.length - 10}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'templates' && (
                /* Templates Table */
                <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                  {/* Table Header */}
                  <div className="bg-[var(--color-border-subtle,#f1f5f9)] border border-[var(--color-border-default)] flex items-start overflow-clip relative rounded-t-md shrink-0 w-full">
                    <div className="flex gap-0 items-center justify-center p-3 relative shrink-0">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-[var(--color-border-default)]"
                        checked={selectedTemplates.length === templates.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTemplates(templates.map(t => t.id));
                          } else {
                            setSelectedTemplates([]);
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                      <div className="flex gap-1.5 items-center relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                          <p className="leading-4">Title</p>
                        </div>
                        <IconChevronDown size={12} stroke={1} className="text-[var(--color-text-muted)]" />
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                      <div className="flex gap-1.5 items-center relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                          <p className="leading-4">Visibility</p>
                        </div>
                        <IconChevronDown size={12} stroke={1} className="text-[var(--color-text-muted)]" />
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                      <div className="flex gap-1.5 items-center relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                          <p className="leading-4">Category</p>
                        </div>
                        <IconChevronDown size={12} stroke={1} className="text-[var(--color-text-muted)]" />
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                      <div className="flex gap-1.5 items-center relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                          <p className="leading-4">Tools</p>
                        </div>
                        <IconChevronDown size={12} stroke={1} className="text-[var(--color-text-muted)]" />
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                      <div className="flex gap-1.5 items-center relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                          <p className="leading-4">Updated at</p>
                        </div>
                        <IconChevronDown size={12} stroke={1} className="text-[var(--color-text-muted)]" />
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                      <div className="flex gap-1.5 items-center relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                          <p className="leading-4">Created at</p>
                        </div>
                        <IconChevronDown size={12} stroke={1} className="text-[var(--color-text-muted)]" />
                      </div>
                    </div>
                    <div className="flex h-10 items-center justify-center px-3 py-0 relative shrink-0 w-[72px]">
                      <div className="flex gap-1.5 items-center relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] text-center whitespace-nowrap">
                          <p className="leading-4">Action</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  {templates.map((template) => {
                    const currentVisibility = templateVisibility[template.id] || template.visibility;
                    return (
                      <div
                        key={template.id}
                        className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] flex items-center relative rounded-md shrink-0 w-full"
                      >
                        <div className="flex gap-0 items-center justify-center p-3 relative shrink-0">
                          <input
                            type="checkbox"
                            className="size-4 rounded border-[var(--color-border-default)]"
                            checked={selectedTemplates.includes(template.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTemplates([...selectedTemplates, template.id]);
                              } else {
                                setSelectedTemplates(selectedTemplates.filter(id => id !== template.id));
                              }
                            }}
                          />
                        </div>
                        <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                          <div className="flex gap-1.5 items-center relative shrink-0">
                            {template.isOfficial && (
                              <div className="bg-[var(--color-state-success-bg,#f0fdf4)] flex flex-col gap-0 items-center justify-center px-1.5 py-0.5 relative rounded shrink-0">
                                <p className="font-['Mona_Sans:Medium',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-success,#4ade80)] text-[11px]">
                                  Official
                                </p>
                              </div>
                            )}
                            <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                              <p className="leading-4">{template.title}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                          <div className="flex gap-1.5 items-center relative shrink-0">
                            <Tooltip
                              content="When set to visible, this item will appear in the catalog tab."
                              position="top"
                            >
                              <div className="flex items-center">
                                <Select
                                  size="sm"
                                  value={currentVisibility}
                                  onChange={(value) => {
                                    setTemplateVisibility({
                                      ...templateVisibility,
                                      [template.id]: value as 'visible' | 'hidden',
                                    });
                                  }}
                                  options={[
                                    { value: 'visible', label: 'Visible' },
                                    { value: 'hidden', label: 'Hidden' },
                                  ]}
                                  menuPlacement="auto"
                                />
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                        <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                          <div className="flex gap-1.5 items-start relative shrink-0">
                            <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                              <p className="leading-4">{template.category}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                          <div className="flex gap-1.5 items-start relative shrink-0">
                            <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                              <p className="leading-4">{template.tools}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                          <div className="flex gap-1.5 items-start relative shrink-0">
                            <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                              <p className="leading-4">{template.updatedAt}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                          <div className="flex gap-1.5 items-start relative shrink-0">
                            <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                              <p className="leading-4">{template.createdAt}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 items-center justify-center p-1.5 relative shrink-0 w-[72px]">
                          <button className="flex gap-0 items-center justify-center p-1.5 relative shrink-0 hover:bg-[var(--color-surface-muted)] rounded-md">
                            <IconDotsVertical size={16} stroke={1} className="text-[var(--color-text-muted)]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MCPToolsPage;

