import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  VStack,
  Button,
  Drawer,
  Input,
  Textarea,
} from '@/design-system';
import { AgentSidebar } from '@/pages/AgentPage';
import { useTabs } from '@/contexts/TabContext';
import {
  IconMessage,
  IconBell,
  IconSearch,
  IconPlus,
  IconDots,
  IconPalette,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react';
import { Icons } from '@/design-system';

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
        border rounded-lg p-3
        flex flex-col gap-2
        cursor-pointer 
        transition-all duration-150
        ${isSelected 
          ? 'border-[var(--color-action-primary)] border-2 shadow-sm' 
          : 'border-[var(--color-border-default)] hover:bg-[#F9FAFB]'
        }
      `}
    >
      {/* Header with title and favorite */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <p className="font-medium text-[length:var(--font-size-14)] leading-[length:var(--line-height-20)] text-[var(--color-text-default)] truncate">
            {title}
          </p>
          <p className="font-normal text-[length:var(--font-size-12)] leading-[length:var(--line-height-18)] text-[var(--color-text-subtle)] line-clamp-1">
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
            <IconStarFilled size={16} className="text-[#EAB308]" />
          ) : (
            <IconStar size={16} stroke={1.5} className="text-[var(--color-text-disabled)]" />
          )}
        </button>
      </div>
      
      {/* Model badge */}
      <div className="flex items-center">
        <span className="bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] text-[length:var(--font-size-11)] font-medium px-2 py-1 rounded">
          {modelName}
        </span>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Chat Menu Item Component
   ---------------------------------------- */
interface ChatMenuItemProps {
  label: string;
  status?: 'default' | 'selected' | 'selected-alert';
  onClick?: () => void;
  onMoreClick?: (e: React.MouseEvent) => void;
}

function ChatMenuItem({ 
  label, 
  status = 'default', 
  onClick,
  onMoreClick,
}: ChatMenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMoreHovered, setIsMoreHovered] = useState(false);

  const isSelected = status === 'selected' || status === 'selected-alert';
  const showMoreButton = isHovered || isSelected;

  // Base container styles
  const containerBaseClass = "flex overflow-clip relative rounded-md w-full cursor-pointer transition-colors";
  
  // Status-based styles
  const containerStatusClass = isSelected
    ? "bg-[var(--color-border-default)] items-center justify-between pl-1.5 pr-0 py-0 h-6"
    : isHovered
      ? "bg-[var(--color-surface-muted)] items-center justify-between pl-1.5 pr-0 py-0 h-6"
      : "items-center gap-0 px-1.5 py-1 h-6";

  // More button styles
  const moreButtonClass = isMoreHovered
    ? "bg-[var(--color-surface-subtle)] relative rounded-md shrink-0 size-6 flex items-center justify-center"
    : "relative shrink-0 size-6 flex items-center justify-center";

  return (
    <div
      className={`${containerBaseClass} ${containerStatusClass}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsMoreHovered(false);
      }}
    >
      <p className="font-normal leading-[length:var(--line-height-16)] relative shrink-0 text-[var(--color-text-default)] text-[length:var(--font-size-12)] truncate flex-1">
        {label}
      </p>
      {showMoreButton && (
        <button
          className={moreButtonClass}
          onClick={(e) => {
            e.stopPropagation();
            onMoreClick?.(e);
          }}
          onMouseEnter={() => setIsMoreHovered(true)}
          onMouseLeave={() => setIsMoreHovered(false)}
        >
          <IconDots size={16} stroke={1} className="text-[var(--color-text-default)]" />
        </button>
      )}
    </div>
  );
}

/* ----------------------------------------
   Chat Sidebar Component
   ---------------------------------------- */
function ChatSidebar() {
  const navigate = useNavigate();
  const [selectedChatId, setSelectedChatId] = useState<string | null>('1');

  const chatItems = [
    { id: '1', label: 'New chat' },
    { id: '2', label: 'SQL Query Optimization' },
    { id: '3', label: 'Code Review Session' },
    { id: '4', label: 'API Design Discussion' },
    { id: '5', label: 'Bug Analysis' },
  ];
  
  return (
    <div className="bg-[var(--color-surface-subtle)] border-r border-[var(--color-border-default)] flex flex-col h-full w-[200px] shrink-0">
      <div className="flex flex-col w-full flex-1 overflow-y-auto min-h-0">
        {/* Header */}
        <div className="flex flex-col gap-1 items-center justify-between px-2 pt-3 pb-2 w-full sticky top-0 bg-[var(--color-surface-subtle)] z-10">
          <div className="flex h-6 items-center justify-between overflow-clip pl-1.5 pr-0 py-0 relative rounded-md shrink-0 w-full">
            <p className="font-medium leading-[length:var(--line-height-16)] relative shrink-0 text-[var(--color-text-subtle)] text-[length:var(--font-size-11)]">
              Chats
            </p>
            <div className="flex gap-1 items-center justify-end relative shrink-0">
              <button className="bg-[var(--color-surface-subtle)] relative rounded-md shrink-0 size-6 hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-center">
                <IconSearch size={12} stroke={1} className="text-[var(--color-text-muted)]" />
              </button>
              <button 
                onClick={() => navigate('/chat')}
                className="bg-[var(--color-surface-subtle)] relative rounded-md shrink-0 size-6 hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-center"
              >
                <IconPlus size={12} stroke={1} className="text-[var(--color-text-muted)]" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex flex-col gap-1 items-start px-2 w-full">
          {chatItems.map((chat) => (
            <ChatMenuItem
              key={chat.id}
              label={chat.label}
              status={selectedChatId === chat.id ? 'selected' : 'default'}
              onClick={() => setSelectedChatId(chat.id)}
              onMoreClick={(e) => {
                console.log('More clicked for:', chat.label);
              }}
            />
          ))}
        </div>
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
  { id: '1', title: 'SQL Optimizer', description: 'Analyzes and optimizes SQL queries for better performance', modelName: 'GPT-4o', provider: 'openai', temperature: 0.7, systemPrompt: 'You are a helpful assistant.', connectedDataSources: [], isFavorite: true },
  { id: '2', title: 'Code Reviewer', description: 'Reviews code and suggests improvements', modelName: 'claude-sonnet-4-5-20250929', provider: 'anthropic', temperature: 0.7, systemPrompt: 'You are a helpful assistant.', connectedDataSources: [], isFavorite: false },
  { id: '3', title: 'Data Analyst', description: 'Helps analyze datasets and create visualizations', modelName: 'GPT-4o', provider: 'openai', temperature: 0.5, systemPrompt: 'You are a data analysis expert.', connectedDataSources: ['BigQuery', 'Snowflake'], isFavorite: false },
  { id: '4', title: 'DevOps Helper', description: 'Assists with CI/CD pipelines and infrastructure', modelName: 'claude-sonnet-4-5-20250929', provider: 'anthropic', temperature: 0.7, systemPrompt: 'You are a helpful assistant.', connectedDataSources: [], isFavorite: true },
  { id: '5', title: 'API Designer', description: 'Helps design RESTful APIs and documentation', modelName: 'GPT-4o', provider: 'openai', temperature: 0.7, systemPrompt: 'You are a helpful assistant.', connectedDataSources: [], isFavorite: false },
  { id: '6', title: 'Test Writer', description: 'Generates unit tests and integration tests', modelName: 'claude-sonnet-4-5-20250929', provider: 'anthropic', temperature: 0.7, systemPrompt: 'You are a helpful assistant.', connectedDataSources: [], isFavorite: false },
  { id: '7', title: 'Doc Generator', description: 'Creates documentation from code comments', modelName: 'GPT-4o', provider: 'openai', temperature: 0.7, systemPrompt: 'You are a helpful assistant.', connectedDataSources: [], isFavorite: true },
  { id: '8', title: 'Bug Hunter', description: 'Identifies potential bugs and security issues', modelName: 'claude-sonnet-4-5-20250929', provider: 'anthropic', temperature: 0.7, systemPrompt: 'You are a helpful assistant.', connectedDataSources: [], isFavorite: false },
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

function NewChatDrawer({ isOpen, onClose, agent, onFavoriteToggle, onStartChat }: NewChatDrawerProps) {
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
            <p className="font-semibold text-[length:var(--font-size-14)] leading-[length:var(--line-height-20)] text-[var(--color-text-default)]">
              {agent.title}
            </p>
            <p className="font-normal text-[length:var(--font-size-12)] leading-[length:var(--line-height-18)] text-[var(--color-text-subtle)]">
              {agent.description}
            </p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle?.();
            }}
            className="shrink-0 p-1 rounded hover:bg-[var(--color-surface-muted)] transition-colors"
          >
            {agent.isFavorite ? (
              <IconStarFilled size={18} className="text-[#EAB308]" />
            ) : (
              <IconStar size={18} stroke={1.5} className="text-[var(--color-text-disabled)]" />
            )}
          </button>
        </div>

        {/* Model Information */}
        <div className="border border-[var(--color-border-default)] rounded-md p-4 flex flex-col gap-4">
          <p className="font-semibold text-[length:var(--font-size-14)] leading-[length:var(--line-height-20)] text-[var(--color-text-default)]">
            Model information
          </p>
          
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 pb-3 border-b border-[var(--color-border-subtle)]">
              <p className="font-normal text-[length:var(--font-size-11)] leading-[length:var(--line-height-16)] text-[var(--color-action-primary)]">
                Provider
              </p>
              <p className="font-normal text-[length:var(--font-size-12)] leading-[length:var(--line-height-18)] text-[var(--color-text-default)]">
                {agent.provider}
              </p>
            </div>
            
            <div className="flex flex-col gap-1 pb-3 border-b border-[var(--color-border-subtle)]">
              <p className="font-normal text-[length:var(--font-size-11)] leading-[length:var(--line-height-16)] text-[var(--color-action-primary)]">
                Model Name
              </p>
              <p className="font-normal text-[length:var(--font-size-12)] leading-[length:var(--line-height-18)] text-[var(--color-text-default)]">
                {agent.modelName}
              </p>
            </div>
            
            <div className="flex flex-col gap-1 pb-3 border-b border-[var(--color-border-subtle)]">
              <p className="font-normal text-[length:var(--font-size-11)] leading-[length:var(--line-height-16)] text-[var(--color-action-primary)]">
                Temperature
              </p>
              <p className="font-normal text-[length:var(--font-size-12)] leading-[length:var(--line-height-18)] text-[var(--color-text-default)]">
                {agent.temperature}
              </p>
            </div>
            
            <div className="flex flex-col gap-1">
              <p className="font-normal text-[length:var(--font-size-11)] leading-[length:var(--line-height-16)] text-[var(--color-action-primary)]">
                Connected Data Sources
              </p>
              <p className="font-normal text-[length:var(--font-size-12)] leading-[length:var(--line-height-18)] text-[var(--color-text-default)]">
                {agent.connectedDataSources.length > 0 
                  ? agent.connectedDataSources.join(', ')
                  : 'No connected data sources'}
              </p>
            </div>
          </div>
        </div>

        {/* System Prompt */}
        <div className="border border-[var(--color-border-default)] rounded-md p-4 flex flex-col gap-3">
          <p className="font-semibold text-[length:var(--font-size-14)] leading-[length:var(--line-height-20)] text-[var(--color-text-default)]">
            System Prompt
          </p>
          <div className="border-t border-[var(--color-border-subtle)] pt-3">
            <p className="font-normal text-[length:var(--font-size-12)] leading-[length:var(--line-height-18)] text-[var(--color-text-default)]">
              {agent.systemPrompt}
            </p>
          </div>
        </div>

        {/* Chat Name */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-[length:var(--font-size-14)] leading-[length:var(--line-height-20)] text-[var(--color-text-default)]">
            Chat name
          </p>
          <Input 
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            placeholder="e.g., Project planning meeting, code review, etc."
            fullWidth
          />
        </div>

        {/* Additional Instructions */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-[length:var(--font-size-14)] leading-[length:var(--line-height-20)] text-[var(--color-text-default)]">
            Additional instructions
          </p>
          <Textarea 
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            placeholder="Enter any specific instructions you would like to provide to the agent for this chat session."
            rows={3}
          />
          <p className="font-normal text-[length:var(--font-size-11)] leading-[length:var(--line-height-16)] text-[var(--color-text-subtle)]">
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
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
  const navigate = useNavigate();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [agents, setAgents] = useState(mockAgents);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || null;

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const handleAgentClick = (agentId: string) => {
    setSelectedAgentId(agentId);
    setIsDrawerOpen(true);
  };

  const handleFavoriteToggle = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, isFavorite: !agent.isFavorite }
        : agent
    ));
  };

  const handleStartChat = (chatName: string, additionalInstructions: string) => {
    console.log('Starting chat:', { agent: selectedAgent?.title, chatName, additionalInstructions });
    // Here you would typically navigate to the chat or create a new chat session
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)] flex w-full">
      <AgentSidebar />

      <main className="flex flex-1 flex-col min-h-screen bg-[var(--color-surface-default)] ml-[60px]">
        <div className="w-full flex flex-col min-h-screen">
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            showAddButton={true}
            showWindowControls={true}
            onWindowClose={() => navigate('/')}
          />

          {/* TopBar and Sidebar at same level */}
          <div className="flex flex-1 min-h-0">
            {/* Chat Sidebar */}
            <ChatSidebar />

            {/* TopBar and Content */}
            <div className="flex flex-1 flex-col min-h-0">
              <TopBar
                showSidebarToggle={false}
                showNavigation={false}
                actions={
                  <>
                    <TopBarAction
                      icon={<IconPalette size={16} stroke={1} />}
                      aria-label="Design System"
                      onClick={() => navigate('/design-system')}
                    />
                    <TopBarAction
                      icon={<IconBell size={16} stroke={1} />}
                      aria-label="Notifications"
                      badge={true}
                    />
                  </>
                }
              />

              {/* Content Container */}
              <div className="flex-1 flex flex-col gap-4 px-6 pt-4 pb-[120px] overflow-y-auto min-h-0">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold leading-[length:var(--line-height-28)] relative shrink-0 text-[var(--color-text-default)] text-[length:var(--font-size-18)]">
                New Chat
              </h4>
              <p className="font-normal text-[length:var(--font-size-12)] leading-[length:var(--line-height-18)] text-[var(--color-text-subtle)]">
                Choose an agent and start a new chat.
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center">
              <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] flex items-center justify-between w-[280px] pl-2.5 pr-2 py-1.5 rounded-md">
                <p className="font-normal text-[length:var(--font-size-11)] leading-[length:var(--line-height-16)] text-[var(--color-text-subtle)]">
                  Find agent with filters
                </p>
                <IconSearch size={12} stroke={1} className="text-[var(--color-text-muted)]" />
              </div>
            </div>

            {/* Agent Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {agents.map((agent) => (
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

            </div>
            </div>
          </div>
        </div>
      </main>

      {/* New Chat Drawer */}
      <NewChatDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        agent={selectedAgent}
        onFavoriteToggle={() => selectedAgentId && handleFavoriteToggle(selectedAgentId)}
        onStartChat={handleStartChat}
      />
    </div>
  );
}

export default ChatPage;

