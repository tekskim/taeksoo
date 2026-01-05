import { useState } from 'react';
import {
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Button,
  Tooltip,
} from '@/design-system';
import { useTabs } from '@/contexts/TabContext';
import {
  IconMessage,
  IconDatabase,
  IconPuzzle,
  IconSettings,
  IconDownload,
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
  IconPlayerPause,
  IconPencil,
  IconCode,
  IconDotsVertical,
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
  status: 'active' | 'inactive' | 'draft';
}

function StatusCard({ label, count, status }: StatusCardProps) {
  const bgColor = status === 'active' 
    ? 'bg-[var(--color-state-success-bg,#f0fdf4)]' 
    : 'bg-[var(--color-surface-subtle,#f8fafc)]';
  
  const iconBg = status === 'active'
    ? 'bg-[var(--color-success,#4ade80)]'
    : 'bg-[var(--color-text-muted,#475569)]';

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
        {status === 'active' && (
          <div className="flex-[1_0_0] h-full min-h-px min-w-px overflow-clip relative shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L12 4L12 12L4 12L4 4Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L10 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 8L10 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        {status === 'inactive' && (
          <div className="flex-[1_0_0] h-full min-h-px min-w-px overflow-clip relative shrink-0">
            <IconPlayerPause size={12} stroke={1} className="text-white" />
          </div>
        )}
        {status === 'draft' && (
          <div className="flex-[1_0_0] h-full min-h-px min-w-px overflow-clip relative shrink-0">
            <IconPencil size={12} stroke={1} className="text-white" />
          </div>
        )}
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
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
  const navigate = useNavigate();
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

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

  const getStatusIcon = (status: AgentRow['status']) => {
    const iconBg = status === 'active'
      ? 'bg-[var(--color-success,#4ade80)]'
      : 'bg-[var(--color-text-muted,#475569)]';

    return (
      <div className={`${iconBg} flex gap-0 items-center justify-center p-1 relative rounded-2xl shrink-0 size-6`}>
        {status === 'active' && (
          <div className="flex-[1_0_0] h-full min-h-px min-w-px overflow-clip relative shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L12 4L12 12L4 12L4 4Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L10 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 8L10 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        {status === 'inactive' && (
          <IconPlayerPause size={12} stroke={1} className="text-white" />
        )}
        {status === 'draft' && (
          <IconPencil size={12} stroke={1} className="text-white" />
        )}
      </div>
    );
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
                  { label: 'Agent' },
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
                      Agent
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/agent/create')}
                >
                  Create agent
                </Button>
              </div>

              {/* Status Cards */}
              <div className="flex gap-2 items-center relative shrink-0 w-full">
                <StatusCard label="Active" count={5} status="active" />
                <StatusCard label="Inactive" count={5} status="inactive" />
                <StatusCard label="Draft" count={5} status="draft" />
              </div>

              {/* Filters */}
              <div className="flex gap-2 items-center relative shrink-0 w-full">
                <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] flex items-center justify-between min-w-[200px] pl-2.5 pr-2 py-1.5 relative rounded-md shrink-0 w-[280px]">
                  <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-subtle)] text-[11px]">
                    Find agent with filters
                  </p>
                  <IconSearch size={12} stroke={1} className="text-[var(--color-text-muted)] shrink-0" />
                </div>
                <div className="bg-[var(--color-border-default)] h-4 shrink-0 w-px" />
                <button className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] flex gap-1.5 items-center justify-center pl-2 pr-2.5 py-1.5 relative rounded-md shrink-0">
                  <IconTrash size={12} stroke={1} className="text-[var(--color-text-muted,#94a3b8)] shrink-0" />
                  <p className="font-['Mona_Sans:Medium',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-muted,#94a3b8)] text-[11px] text-center">
                    Delete
                  </p>
                </button>
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

              {/* Table */}
              <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                {/* Table Header */}
                <div className="bg-[var(--color-border-subtle,#f1f5f9)] border border-[var(--color-border-default)] flex items-start overflow-clip relative rounded-t-md shrink-0 w-full">
                  <div className="flex gap-0 items-center justify-center p-3 relative shrink-0">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-[var(--color-border-default)]"
                      checked={selectedAgents.length === agents.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAgents(agents.map(a => a.id));
                        } else {
                          setSelectedAgents([]);
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-0 items-center justify-center p-3 relative shrink-0 w-[59px]">
                    {/* Favorite column header - empty */}
                  </div>
                  <div className="flex h-10 items-center justify-center px-3 py-0 relative shrink-0 w-[59px]">
                    <div className="flex gap-1.5 items-center relative shrink-0">
                      <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] text-center whitespace-nowrap">
                        <p className="leading-4">Status</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-l border-[var(--color-border-default)] flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                    <div className="flex gap-1.5 items-center relative shrink-0">
                      <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                        <p className="leading-4">Name</p>
                      </div>
                      <IconChevronDown size={12} stroke={1} className="text-[var(--color-text-muted)]" />
                    </div>
                  </div>
                  <div className="border-l border-[var(--color-border-default)] flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                    <div className="flex gap-1.5 items-center relative shrink-0">
                      <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                        <p className="leading-4">Model</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-l border-[var(--color-border-default)] flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                    <div className="flex gap-1.5 items-center relative shrink-0">
                      <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                        <p className="leading-4">Model provider</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-l border-[var(--color-border-default)] flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                    <div className="flex gap-1.5 items-center relative shrink-0">
                      <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                        <p className="leading-4">Chats</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-l border-[var(--color-border-default)] flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                    <div className="flex gap-1.5 items-center relative shrink-0">
                      <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                        <p className="leading-4">Updated at</p>
                      </div>
                      <IconChevronDown size={12} stroke={1} className="text-[var(--color-text-muted)]" />
                    </div>
                  </div>
                  <div className="border-l border-[var(--color-border-default)] flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                    <div className="flex gap-1.5 items-center relative shrink-0">
                      <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                        <p className="leading-4">Created at</p>
                      </div>
                      <IconChevronDown size={12} stroke={1} className="text-[var(--color-text-muted)]" />
                    </div>
                  </div>
                  <div className="border-l border-[var(--color-border-default)] flex h-10 items-center justify-center px-3 py-0 relative shrink-0 w-[72px]">
                    <div className="flex gap-1.5 items-center relative shrink-0">
                      <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] text-center whitespace-nowrap">
                        <p className="leading-4">Action</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table Rows */}
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] flex items-center relative rounded-md shrink-0 w-full"
                  >
                    <div className="flex gap-0 items-center justify-center p-3 relative shrink-0">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-[var(--color-border-default)]"
                        checked={selectedAgents.includes(agent.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAgents([...selectedAgents, agent.id]);
                          } else {
                            setSelectedAgents(selectedAgents.filter(id => id !== agent.id));
                          }
                        }}
                      />
                    </div>
                    <div className="flex gap-0 items-center justify-center p-3 relative shrink-0">
                      {agent.favorite ? (
                        <IconStarFilled size={16} className="text-yellow-500" />
                      ) : (
                        <IconStar size={16} className="text-[var(--color-border-default,#e2e8f0)]" />
                      )}
                    </div>
                    <div className="flex gap-0 items-center justify-center p-2 relative shrink-0 w-[59px]">
                      {getStatusIcon(agent.status)}
                    </div>
                    <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                      <div className="flex gap-1.5 items-center relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                          <p className="leading-4">{agent.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                      <div className="flex gap-1.5 items-start relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                          <p className="leading-4">{agent.model}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                      <div className="flex gap-1.5 items-start relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                          <p className="leading-4">{agent.modelProvider}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                      <div className="flex gap-1.5 items-start relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                          <p className="leading-4">{agent.chats}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                      <div className="flex gap-1.5 items-start relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                          <p className="leading-4">{agent.updatedAt}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                      <div className="flex gap-1.5 items-start relative shrink-0">
                        <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                          <p className="leading-4">{agent.createdAt}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 items-center justify-center p-1.5 relative shrink-0">
                      <button className="flex items-center p-1.5 relative rounded-md shrink-0 hover:bg-[var(--color-surface-muted)]">
                        <IconCode size={16} stroke={1} className="text-[var(--color-text-muted)]" />
                      </button>
                      <button className="flex gap-0 items-center justify-center p-1.5 relative shrink-0 hover:bg-[var(--color-surface-muted)] rounded-md">
                        <IconDotsVertical size={16} stroke={1} className="text-[var(--color-text-muted)]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AgentPage;
