import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  VStack,
  Button,
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
} from '@tabler/icons-react';
import { Icons } from '@/design-system';

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
            <p className="font-['Mona_Sans:Medium',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-subtle)] text-[11px]">
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
          <div className="flex h-6 items-center justify-between overflow-clip pl-1.5 pr-0 py-0 relative rounded-md shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px]">
              label 1
            </p>
            <button className="bg-[var(--color-surface-subtle)] relative rounded-md shrink-0 size-6 hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-center">
              <IconDots size={12} stroke={1} className="text-[var(--color-text-muted)]" />
            </button>
          </div>
          <div className="flex h-6 items-center overflow-clip px-1.5 py-1 relative rounded-md shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px]">
              label 2
            </p>
          </div>
          <div className="flex gap-0 h-6 items-center overflow-clip px-1.5 py-1 relative rounded-md shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px]">
              label 3
            </p>
          </div>
          <div className="flex gap-0 h-6 items-center overflow-clip px-1.5 py-1 relative rounded-md shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px]">
              label 4
            </p>
          </div>
          <div className="flex gap-0 h-6 items-center overflow-clip px-1.5 py-1 relative rounded-md shrink-0 w-full hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px]">
              label 5
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main ChatPage Component
   ---------------------------------------- */
export function ChatPage() {
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
  const navigate = useNavigate();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)] flex w-full">
      <AgentSidebar />

      <main className="flex flex-1 flex-col min-h-screen bg-[var(--color-surface-default)] ml-[62px]">
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
              <div className="flex-1 flex flex-col gap-6 px-8 pt-6 pb-[120px] overflow-y-auto min-h-0">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h4 className="font-['Mona_Sans:SemiBold',sans-serif] leading-7 not-italic relative shrink-0 text-[var(--color-text-default)] text-[18px]">
                New Chat
              </h4>
              <p className="font-['Mona_Sans:Regular',sans-serif] text-[12px] leading-4 text-[var(--color-text-subtle)]">
                Choose an agent and start a new chat.
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center">
              <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] flex items-center justify-between w-[280px] pl-2.5 pr-2 py-1.5 rounded-md">
                <p className="font-['Mona_Sans:Regular',sans-serif] text-[11px] leading-4 text-[var(--color-text-subtle)]">
                  Find agent with filters
                </p>
                <IconSearch size={12} stroke={1} className="text-[var(--color-text-muted)]" />
              </div>
            </div>

            {/* Empty State */}
            <div className="flex-1 flex flex-col items-center justify-start pt-[120px]">
              <div className="flex flex-col gap-4 items-center">
                <p className="font-['Mona_Sans:Medium',sans-serif] text-[14px] leading-5 text-[var(--color-text-default)]">
                  No Available Agents
                </p>
                <p className="font-['Mona_Sans:Regular',sans-serif] text-[12px] leading-4 text-[var(--color-text-subtle)] text-center max-w-md">
                  Create a new agent or switch an existing agent to Active status.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/agent')}
                >
                  View Agents
                </Button>
              </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChatPage;

