import { useState } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useNavigate } from 'react-router-dom';
import {
  TopBar,
  TopBarAction,
  Button,
  Drawer,
  Input,
  Textarea,
  Pagination,
  SearchInput,
  SectionCard,
  PageShell,
  TabBar,
} from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { ChatSidebar } from '@/components/ChatSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconStar, IconStarFilled } from '@tabler/icons-react';

/* ----------------------------------------
   Agent Card Component
   ---------------------------------------- */
interface AgentCardProps {
  title: string;
  description: string;
  modelName: string;
  isFavorite?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onFavoriteToggle?: () => void;
}

function AgentCard({
  title,
  description,
  modelName,
  isFavorite = false,
  isSelected = false,
  onClick,
  onFavoriteToggle,
}: AgentCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[var(--color-surface-default)] 
        border rounded-[var(--radius-lg)] p-3
        flex flex-col gap-2
        cursor-pointer 
        transition-all duration-150
        ${
          isSelected
            ? 'border-[var(--color-action-primary)] border-2 shadow-sm'
            : 'border-[var(--color-border-default)] hover:bg-[#F9FAFB]'
        }
      `}
    >
      {/* Header with title and favorite */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <p className="text-label-lg text-[var(--color-text-default)] truncate">{title}</p>
          <p className="text-label-md text-[var(--color-text-subtle)] line-clamp-1">
            {description}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle?.();
          }}
          className="shrink-0 p-1 -m-1 rounded hover:bg-[var(--color-surface-muted)] transition-colors"
        >
          {isFavorite ? (
            <IconStarFilled size={16} className="text-[var(--primitive-color-yellow400)]" />
          ) : (
            <IconStar size={16} stroke={1.5} className="text-[var(--color-text-disabled)]" />
          )}
        </button>
      </div>

      {/* Model badge */}
      <div className="flex items-center">
        <span className="bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] text-label-sm px-2 py-1 rounded">
          {modelName}
        </span>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Mock Agent Data
   ---------------------------------------- */
interface Agent {
  id: string;
  title: string;
  description: string;
  modelName: string;
  provider: string;
  temperature: number;
  systemPrompt: string;
  connectedDataSources: string[];
  isFavorite: boolean;
}

const mockAgents: Agent[] = [
  {
    id: '1',
    title: 'SQL Optimizer',
    description: 'Analyzes and optimizes SQL queries for better performance',
    modelName: 'GPT-4o',
    provider: 'openai',
    temperature: 0.7,
    systemPrompt: 'You are a helpful assistant.',
    connectedDataSources: [],
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Code Reviewer',
    description: 'Reviews code and suggests improvements',
    modelName: 'claude-sonnet-4-5-20250929',
    provider: 'anthropic',
    temperature: 0.7,
    systemPrompt: 'You are a helpful assistant.',
    connectedDataSources: [],
    isFavorite: false,
  },
  {
    id: '3',
    title: 'Data Analyst',
    description: 'Helps analyze datasets and create visualizations',
    modelName: 'GPT-4o',
    provider: 'openai',
    temperature: 0.5,
    systemPrompt: 'You are a data analysis expert.',
    connectedDataSources: ['BigQuery', 'Snowflake'],
    isFavorite: false,
  },
  {
    id: '4',
    title: 'DevOps Helper',
    description: 'Assists with CI/CD pipelines and infrastructure',
    modelName: 'claude-sonnet-4-5-20250929',
    provider: 'anthropic',
    temperature: 0.7,
    systemPrompt: 'You are a helpful assistant.',
    connectedDataSources: [],
    isFavorite: true,
  },
  {
    id: '5',
    title: 'API Designer',
    description: 'Helps design RESTful APIs and documentation',
    modelName: 'GPT-4o',
    provider: 'openai',
    temperature: 0.7,
    systemPrompt: 'You are a helpful assistant.',
    connectedDataSources: [],
    isFavorite: false,
  },
  {
    id: '6',
    title: 'Test Writer',
    description: 'Generates unit tests and integration tests',
    modelName: 'claude-sonnet-4-5-20250929',
    provider: 'anthropic',
    temperature: 0.7,
    systemPrompt: 'You are a helpful assistant.',
    connectedDataSources: [],
    isFavorite: false,
  },
  {
    id: '7',
    title: 'Doc Generator',
    description: 'Creates documentation from code comments',
    modelName: 'GPT-4o',
    provider: 'openai',
    temperature: 0.7,
    systemPrompt: 'You are a helpful assistant.',
    connectedDataSources: [],
    isFavorite: true,
  },
  {
    id: '8',
    title: 'Bug Hunter',
    description: 'Identifies potential bugs and security issues',
    modelName: 'claude-sonnet-4-5-20250929',
    provider: 'anthropic',
    temperature: 0.7,
    systemPrompt: 'You are a helpful assistant.',
    connectedDataSources: [],
    isFavorite: false,
  },
];

/* ----------------------------------------
   New Chat Drawer Component
   ---------------------------------------- */
interface NewChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
  onFavoriteToggle?: () => void;
  onStartChat: (chatName: string, additionalInstructions: string) => void;
}

function NewChatDrawer({
  isOpen,
  onClose,
  agent,
  onFavoriteToggle,
  onStartChat,
}: NewChatDrawerProps) {
  const [chatName, setChatName] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  if (!agent) return null;

  const handleStartChat = () => {
    onStartChat(chatName, additionalInstructions);
    setChatName('');
    setAdditionalInstructions('');
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="New chat"
      width={400}
      showCloseButton={true}
      closeOnBackdropClick={true}
      closeOnEscape={true}
      footer={
        <div className="flex gap-3 w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStartChat} className="flex-1">
            Start chat
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Agent Info Card */}
        <div className="border border-[var(--color-border-default)] rounded-md p-4 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-label-lg text-[var(--color-text-default)]">{agent.title}</p>
            <p className="text-label-md text-[var(--color-text-subtle)]">{agent.description}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle?.();
            }}
            className="shrink-0 p-1 rounded hover:bg-[var(--color-surface-muted)] transition-colors"
          >
            {agent.isFavorite ? (
              <IconStarFilled size={18} className="text-[var(--primitive-color-yellow400)]" />
            ) : (
              <IconStar size={18} stroke={1.5} className="text-[var(--color-text-disabled)]" />
            )}
          </button>
        </div>

        {/* Model Information */}
        <SectionCard>
          <SectionCard.Header title="Model information" />
          <SectionCard.Content>
            <SectionCard.DataRow label="Provider" value={agent.provider} />
            <SectionCard.DataRow label="Model name" value={agent.modelName} />
            <SectionCard.DataRow label="Temperature" value={String(agent.temperature)} />
            <SectionCard.DataRow
              label="Connected data sources"
              value={
                agent.connectedDataSources.length > 0
                  ? agent.connectedDataSources.join(', ')
                  : 'No connected data sources'
              }
            />
          </SectionCard.Content>
        </SectionCard>

        {/* System Prompt */}
        <div className="border border-[var(--color-border-default)] rounded-md p-4 flex flex-col gap-3">
          <p className="text-label-lg text-[var(--color-text-default)]">System Prompt</p>
          <div className="border-t border-[var(--color-border-subtle)] pt-3">
            <p className="text-label-md text-[var(--color-text-default)]">{agent.systemPrompt}</p>
          </div>
        </div>

        {/* Chat Name */}
        <div className="flex flex-col gap-2">
          <p className="text-label-lg text-[var(--color-text-default)]">Chat name</p>
          <Input
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            placeholder="e.g., Project planning meeting, code review, etc."
            fullWidth
          />
        </div>

        {/* Additional Instructions */}
        <div className="flex flex-col gap-2">
          <p className="text-label-lg text-[var(--color-text-default)]">Additional instructions</p>
          <Textarea
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            placeholder="Enter any specific instructions you would like to provide to the agent for this chat session."
            rows={3}
            fullWidth
          />
          <p className="text-body-md text-[var(--color-text-subtle)]">
            These instructions will be applied in addition to the agent's default system prompt.
          </p>
        </div>
      </div>
    </Drawer>
  );
}

/* ----------------------------------------
   Main ChatPage Component
   ---------------------------------------- */
export function ChatPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [agents, setAgents] = useState(mockAgents);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || null;

  // Pagination
  const totalPages = Math.ceil(agents.length / itemsPerPage);
  const paginatedAgents = agents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAgentClick = (agentId: string) => {
    setSelectedAgentId(agentId);
    setIsDrawerOpen(true);
  };

  const handleFavoriteToggle = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId ? { ...agent, isFavorite: !agent.isFavorite } : agent
      )
    );
  };

  const handleStartChat = (chatName: string, additionalInstructions: string) => {
    // Generate a unique chat ID
    const chatId = `chat-${Date.now()}`;

    // Navigate to conversation page with agent info
    navigate(`/chat/${chatId}`, {
      state: {
        agentId: selectedAgentId,
        agentName: selectedAgent?.title,
        chatName: chatName || 'New Chat',
        additionalInstructions,
      },
    });

    // Close the drawer
    setIsDrawerOpen(false);
  };

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
      contentClassName="p-0 !min-h-0 h-full"
    >
      {/* Sidebar and Content */}
      <div className="flex h-full">
        {/* Chat Sidebar */}
        <ChatSidebar />

        {/* Content Container */}
        <OverlayScrollbarsComponent
          options={{
            overflow: { x: 'hidden', y: 'scroll' },
            scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
          }}
          defer={false}
          className="flex-1 min-h-0"
        >
          <div className="flex flex-col gap-3 px-8 pt-4 pb-3">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h4 className="text-heading-h4 text-[var(--color-text-default)]">New chat</h4>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Choose an agent and start a new chat.
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center">
              <SearchInput placeholder="Find agent with filters" size="sm" className="w-[280px]" />
            </div>

            {/* Content */}
            {paginatedAgents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[240px] gap-2">
                <p className="text-label-lg text-[var(--color-text-default)]">
                  No Available Agents
                </p>
                <p className="text-body-md text-[var(--color-text-default)] text-center">
                  Create a new agent or switch an existing agent to Active status.
                </p>
                <Button variant="primary" size="md" onClick={() => navigate('/ai-platform/agents')}>
                  View Agents
                </Button>
              </div>
            ) : (
              <>
                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={agents.length}
                />

                {/* Agent Cards Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {paginatedAgents.map((agent) => (
                    <AgentCard
                      key={agent.id}
                      title={agent.title}
                      description={agent.description}
                      modelName={agent.modelName}
                      isFavorite={agent.isFavorite}
                      isSelected={selectedAgentId === agent.id && isDrawerOpen}
                      onClick={() => handleAgentClick(agent.id)}
                      onFavoriteToggle={() => handleFavoriteToggle(agent.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </OverlayScrollbarsComponent>
      </div>

      {/* New Chat Drawer */}
      <NewChatDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        agent={selectedAgent}
        onFavoriteToggle={() => selectedAgentId && handleFavoriteToggle(selectedAgentId)}
        onStartChat={handleStartChat}
      />
    </PageShell>
  );
}

export default ChatPage;
