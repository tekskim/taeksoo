import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TopBar, TopBarAction, StatusIndicator, PageShell, TabBar } from '@/design-system';
import { AgentSidebar } from '@/components/AgentSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconPlus,
  IconDots,
  IconSettings,
  IconSearch,
  IconArrowUp,
} from '@tabler/icons-react';

/* ----------------------------------------
   Chat Sidebar Component
   ---------------------------------------- */
function ChatSidebar() {
  const navigate = useNavigate();

  return (
    <div className="bg-[var(--color-surface-subtle)] border-r border-[var(--color-border-default)] flex flex-col h-full w-[200px] shrink-0">
      <div className="flex flex-col w-full flex-1 overflow-y-auto min-h-0">
        {/* Header */}
        <div className="flex flex-col gap-1 items-center justify-between px-2 pt-3 pb-2 w-full sticky top-0 bg-[var(--color-surface-subtle)] z-10">
          <div className="flex h-6 items-center justify-between overflow-clip pl-1.5 pr-0 py-0 relative rounded-md shrink-0 w-full">
            <p className="text-label-sm text-[var(--color-text-subtle)]">Chats</p>
            <div className="flex gap-1 items-center justify-end relative shrink-0">
              <button className="bg-[var(--color-surface-subtle)] relative rounded-md shrink-0 size-6 hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-center">
                <IconSearch size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="bg-[var(--color-surface-subtle)] relative rounded-md shrink-0 size-6 hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-center"
              >
                <IconPlus size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex flex-col gap-1 items-start px-2 w-full">
          <div className="flex h-6 items-center justify-between overflow-clip pl-1.5 pr-0 py-0 relative rounded-md shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <p className="text-label-md text-[var(--color-text-default)]">label 1</p>
            <button className="bg-[var(--color-surface-subtle)] relative rounded-md shrink-0 size-6 hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-center">
              <IconDots size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
            </button>
          </div>
          <div className="flex h-6 items-center overflow-clip px-1.5 py-1 relative rounded-md shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <p className="text-label-md text-[var(--color-text-default)]">label 2</p>
          </div>
          <div className="flex gap-0 h-6 items-center overflow-clip px-1.5 py-1 relative rounded-md shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <p className="text-label-md text-[var(--color-text-default)]">label 3</p>
          </div>
          <div className="flex gap-0 h-6 items-center overflow-clip px-1.5 py-1 relative rounded-md shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <p className="text-label-md text-[var(--color-text-default)]">label 4</p>
          </div>
          <div className="flex gap-0 h-6 items-center overflow-clip px-1.5 py-1 relative rounded-md shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <p className="text-label-md text-[var(--color-text-default)]">label 5</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main ChatConversationPage Component
   ---------------------------------------- */
export function ChatConversationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [message, setMessage] = useState('');

  // Get agent info from location state or use defaults
  const agentName = location.state?.agentName || 'Agent name';
  const chatName = location.state?.chatName || 'New Chat';

  const handleSendMessage = () => {
    if (!message.trim()) return;
    console.log('Sending message:', message);
    // TODO: Implement actual message sending
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
          left={
            <div className="flex items-center gap-2 bg-[var(--color-surface-subtle)] rounded-md px-2 h-6">
              <StatusIndicator status="active" />
              <span className="text-label-md text-[var(--color-text-default)]">{agentName}</span>
            </div>
          }
          actions={
            <>
              <TopBarAction icon={<IconSettings size={16} stroke={1.5} />} aria-label="Settings" />
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            </>
          }
        />
      }
      contentClassName="p-0"
    >
      {/* Sidebar and Content */}
      <div className="flex flex-1 min-h-0 h-full">
        {/* Chat Sidebar */}
        <ChatSidebar />

        {/* Content Container */}
        <div className="flex-1 flex flex-col h-full bg-[var(--color-surface-default)]">
          {/* Main Content - Centered */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
            <div className="flex flex-col items-center gap-4 w-full max-w-[659px]">
              {/* Heading */}
              <h2 className="text-heading-h4 text-[var(--color-text-default)]">
                Tell me what you need
              </h2>

              {/* Input Area */}
              <div className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-2xl p-4 min-h-[100px] flex flex-col justify-between">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything"
                  className="w-full resize-none bg-transparent text-body-lg text-[var(--color-text-default)] placeholder:text-[var(--color-text-subtle)] focus:outline-none min-h-[60px]"
                  rows={2}
                />
                <div className="flex items-center justify-end">
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] disabled:bg-[var(--color-border-default)] text-white rounded-full p-1 transition-colors"
                  >
                    <IconArrowUp size={16} stroke={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default ChatConversationPage;
